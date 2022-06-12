/*
    Client interface that the frontend can use to interact with the editor
*/
export default class Client {
    constructor(documentID: Number) {
        this.documentID = documentID
        this.socket = new WebSocket(`ws://localhost:8080/edit?DocumentID=${documentID}`);

        // setup handler functions
        // note that the assumption in this simple protocol is that 
        // we only get messages that are ACKNOWLEDGEMENTS of previous requests
        this.socket.onmessage = (message) => 
            this.handleAcknowledgement(message.data)
    }

    // handles an incoming request to 
    private handleAcknowledgement(message: string) : void {
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
            return
        }

        this.socket.send(data);
    }


    documentID: Number
    socket: WebSocket

    messageQueue: Array<string>
}