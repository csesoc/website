/**
 * Client server implementation
 * example payload = {
 *   "type": "ack" | "op",
 *   "data": {
 *   }
 * }
 */

import { io } from "socket.io-client";
import Operation from "./Operation";

export default class Client {
  socket = io("ws://localhost:8080");
  state = null;
  isAcked = true;
  opID = 0;
  buffer: Operation[] = [];

  constructor() {
    this.socket.on("connect", () => {
      console.log(`Socket ${this.socket.id} connected: ${this.socket.connected}`);
    });

    this.socket.on("ack", () => {
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
      // Send the message and check that we get an ACK back
      this.socket.send(JSON.stringify(operation));
      this.isAcked = false;
    } else {
      // Add to buffers
      this.buffer.push(operation);
    }
  }
}
