package diffsyncService

import (
	"DiffSync/internal/filesystem"
	diffsync "DiffSync/internal/state"
	"os"
	"time"

	"github.com/sergi/go-diff/diffmatchpatch"
)

// just another extension package :)
// Autosave is a bit odd, need to have actual discussion about it
// currently the autosave feature is time based, eg. backup every 10s
// honestly this file is basically a copy+paste of the previewExtension.go file
// hence we can abstract away a lot of the commonalities when we finish the prototype

const AUTOSAVE_EXTENSION_NAME string = "extension.autosave"
const autosaveSpan = 10 * time.Second

// Yesssssir
type AutoSaver struct {
	documentHook   *diffsync.EditSession
	autosaveText   string
	autosaveShadow string

	// exposed functionality
	sync           chan string
	stop           chan bool
	finaliseBackup chan bool

	// config for diff + fuzzy patcher, this should change later
	dmp           *diffmatchpatch.DiffMatchPatch
	physicalStore *os.File
}

// implementation of the Extension interface, standard extension implementation
func (autosaver *AutoSaver) Construct(hook *diffsync.EditSession) {
	autosaver.documentHook = hook

	autosaver.sync = make(chan string)
	autosaver.stop = make(chan bool)
	autosaver.finaliseBackup = make(chan bool)
	file, _ := filesystem.Open(hook.On.DocID, "")
	autosaver.physicalStore = file
	autosaver.dmp = diffmatchpatch.New()
}

func (autosaver *AutoSaver) StartExtension(documentState string) {
	autosaver.autosaveText = documentState
	autosaver.autosaveShadow = documentState
	go autosaver.Spin()
	go autosaver.consistentSave()
}

func (autosaver *AutoSaver) GetExtensionName() string {
	return AUTOSAVE_EXTENSION_NAME
}

func (autosaver *AutoSaver) StopExtension() {
	autosaver.stop <- true
	autosaver.finaliseBackup <- true
}

func (autosaver *AutoSaver) ApplyPatch(patches string) {
	autosaver.sync <- patches
}

func (autosaver *AutoSaver) GetEditSession() *diffsync.EditSession {
	return autosaver.documentHook
}

// function that performs autosaving every autosaveSpan seconds
func (autosaver *AutoSaver) consistentSave() {
	defer autosaver.physicalStore.Close()

L: /* oh god im so sorry */
	for _ = range time.Tick(autosaveSpan) {
		// save
		autosaver.physicalStore.Truncate(0)
		autosaver.physicalStore.Seek(0, 0)
		autosaver.physicalStore.WriteString(autosaver.autosaveText)

		// check that we weren't asked to just stop this process
		select {
		case _ = <-autosaver.finaliseBackup:
			// terminate the loop if we are asked to stop backing up
			break L
		default:
			break
		}
	}

	// do a final backup
	autosaver.physicalStore.WriteString(autosaver.autosaveText)
}

// spinning loop of death that handles document sychronisation + diff propogation
// basically just an event loop implementing the client side of differential synchronisation
func (autosaver *AutoSaver) Spin() {
	for {
		select {
		case patches := <-autosaver.sync:
			parsedPatches, _ := autosaver.dmp.PatchFromText(patches)

			if len(parsedPatches) == 0 {
				continue
			}
			// fuzy patch our patches in
			newClient, _ := autosaver.dmp.PatchApply(parsedPatches, autosaver.autosaveText)
			newShadow, _ := autosaver.dmp.PatchApply(parsedPatches, autosaver.autosaveShadow)

			autosaver.autosaveText = newClient
			autosaver.autosaveShadow = newShadow

			// finally diff the 2 and propogate the patches back to the server
			diffs := autosaver.dmp.PatchMake(autosaver.autosaveShadow, autosaver.autosaveText)
			autosaver.autosaveShadow = autosaver.autosaveText
			autosaver.documentHook.On.Sync <- diffsync.Payload{
				Diffs:         []byte(autosaver.dmp.PatchToText(diffs)),
				EditSessionID: autosaver.documentHook.ID,
			}
			break
		case _ = <-autosaver.stop:
			return
		}
	}
}
