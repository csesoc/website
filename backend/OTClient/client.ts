/**
 * Client server implementation
 */

import { io, Socket } from "socket.io-client";
import { Operation } from "./operation";
import { OperationQueue } from "./operationQueue";
import { bind } from "./util";

const ACK_TIMEOUT_DURATION = 10_000;

/*
	The Client-Server protocol
		- The general outline of our client-server protocol is as follows:
			- Client wants to send an operation (it applies it locally)
			- If there are any operations in the op buffer it pushes it to the end
			- If there aren't it sends it directly to the server

			- The client then awaits for an acknowledgment
			- While it waits of an acknowledgement it queues everything in the buffer
			- All incoming operations from the server are transformed against buffer operations (As they haven't been applied yet)
			- When at acknowledgement is received the client then sends the next queued operation to the server
*/

export default class Client {
  // TODO: Handle destruction / closing of the websocket
  constructor(opCallback: (op: Operation) => void) {
    this.socket = io(`ws://localhost:8080/edit?document=${document}`);

    this.socket.on("connect", this.handleConnection);
    this.socket.on("ack", this.handleAck);
    this.socket.on("op", this.handleOperation(opCallback));
  }

  /**
   * Handles an incoming acknowledgement operation
   */
  private handleAck = () => {
    clearTimeout(this.timeoutID);
    this.pendingAcknowledgement = false;

    // dequeue the current operation and send a new one if required
    this.queuedOperations.dequeueOperation();
    bind((op) => this.sendToServer(op), this.queuedOperations.peekHead());
  };

  /**
   * Handles an incoming operation from the server
   */
  private handleOperation =
    (opCallback: (op: Operation) => void) => (operation: Operation) => {
      const transformedOp =
        this.queuedOperations.applyAndTransformIncomingOperation(operation);
      opCallback(transformedOp);

      this.appliedOperations += 1;
    };

  /**
   * Handles the even when the connection opens
   */
  private handleConnection = () => {
    console.log(`Socket ${this.socket.id} connected: ${this.socket.connected}`);
  };

  /**
   * Send an operation from client to centralised server through websocket
   *
   * @param operation the operation the client wants to send
   */
  public pushOperation = (operation: Operation) => {
    // Note that if there aren't any pending acknowledgements then the operation queue will be empty
    this.queuedOperations.enqueueOperation(operation);

    if (!this.pendingAcknowledgement) {
      this.sendToServer(operation);
    }
  };

  /**
   * Pushes an operation to the server
   */
  private sendToServer = (operation: Operation) => {
    this.pendingAcknowledgement = true;

    this.socket.send(
      JSON.stringify({ operation, appliedOperations: this.appliedOperations })
    );
    this.timeoutID = setTimeout(
      () => {
        throw Error(`Did not receive ACK after ${ACK_TIMEOUT_DURATION} ms!`);
      },
      ACK_TIMEOUT_DURATION,
      "finish"
    );
  };

  private socket: Socket;

  private queuedOperations: OperationQueue = new OperationQueue();
  private pendingAcknowledgement = false;
  private appliedOperations = 0;

  private timeoutID: number = NaN;
}
