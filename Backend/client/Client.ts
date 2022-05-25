/**
 * Client server implementation
 */

import { io, Socket } from "socket.io-client";
import Operation from "./Operation";

const ACK_TIMEOUT_DURATION = 10_000;

export default class Client {
  socket: Socket;
  state = null;
  isAcked = true;
  opID = 0;
  timeoutID: number = NaN;
  buffer: Operation[] = [];

  constructor(document: string) {
    this.socket = io(`ws://localhost:8080/edit?document=${document}`);

    this.socket.on("connect", () => {
      console.log(`Socket ${this.socket.id} connected: ${this.socket.connected}`);
    });

    this.socket.on("ack", () => {
      clearTimeout(this.timeoutID);
      this.isAcked = true;

      // Send next packet if there is one
      const operation = this.buffer.shift();
      if (operation !== undefined) {
        this.send(operation);
      }
    });

    this.socket.on("op", (operation: JSON) => {
      // TODO: Need to call operation function
      console.log(operation);
    });
  }

  /**
   * Send an operation from client to centralised server through websocket
   * 
   * @param operation the operation the client wants to send
   */
  public send(operation: Operation) {
    if (this.isAcked) {
      // Send the message
      this.socket.send(JSON.stringify(operation));
      this.isAcked = false;
      this.timeoutID = setTimeout(() => {
        throw new Error(`Did not receive ACK after ${ACK_TIMEOUT_DURATION} ms!`)
      }, ACK_TIMEOUT_DURATION, "finish")
    } else {
      // Add to buffer
      this.buffer.push(operation);
    }
  }
}
