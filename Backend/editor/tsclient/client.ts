/*
    Client interface that the frontend can use to interact with the editor
    the class expects an init function it can callback to when the server is ready
    and a function the class can call when the server is dead 
*/
export default class Client {
    constructor(documentID: Number, initCallback: (arg: string) => void, terminatingCallbck : (arg: TerminationReason) => void) {
        this.documentID = documentID
        this.socket = new WebSocket(`ws://localhost:8080/edit?DocumentID=${documentID}`);

        // setup handler functions
        // note that the assumption in this simple protocol is that 
        // we only get messages that are ACKNOWLEDGEMENTS of previous requests
        this.socket.onmessage = (message) => {
            const data : payload = JSON.parse(message.data) as payload
            switch (data.type) {
                case "init":
                    initCallback(data.contents!)
                    break
                case "acknowledged":
                    this.handleAcknowledgement()
                    break
                case "terminating":
                    terminatingCallbck("terminating")
                    break
            }
        }

        // handles violent termination
        this.socket.close = (___, reason) =>
            terminatingCallbck(reason! as TerminationReason)
    }

    // handles an incoming request to 
    private handleAcknowledgement() : void {
        // pop a message from the queueu and push it down
        // my understanding of JS is that this code has no race conditions 
        // as everything runs in a single thread anways and is non-preemptible
        if (this.messageQueue.length == 0) {
            // push it straight down the websocket
            this.sendToSocket(this.messageQueue.pop() ?? "")
        } 
    }

    // public method that can be used to push 
    // data to a server document
    public async pushDocumentData(data: string) : Promise<void> {
        if (this.messageQueue.length == 0) {
            // push it straight down the websocket
            await this.sendToSocket(data)
        } else {
            this.messageQueue.push(data)
        }
    }

    private async sendToSocket(data: string) : Promise<void> {
        if (data === "") {
            return new Promise((resolve, reject) => resolve())
        }

        return new Promise((resolve, reject) => {
            this.socket.send(data)
            resolve()
        });
    }


    documentID: Number
    socket: WebSocket
    messageQueue: Array<string>
}

export type TerminationReason = "locked" | "terminating" | "error"

interface payload {
    type: "init" | "terminating" | "acknowledged"
    contents?: string
}