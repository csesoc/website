import { Operation, transform } from "./operation";

/**
 * OperationQueue is a simple data structure of the maintenance of outgoing
 * operations, new operations are pushed to this queue and when and incoming
 * operation from the server applies that operation is transformed against all
 * elements of this queue
 */
export class OperationQueue {

  /**
   * Push an operation to the end of the operation queue
   *
   * @param operation - the new operation to add
   * @returns the new length of the queue
   */
  public enqueueOperation = (operation: Operation): number =>
    this.operationQueue.push(operation);

  /**
   * Takes an incoming operation from the server and applies it to all
   * elements of the queue
   *
   * @param serverOp - the incoming operation from the server
   * @returns serverOp transformed against all operations in the operation queue
   */
  public applyAndTransformIncomingOperation = (
    serverOp: Operation
  ): Operation => {
    const { newQueue, newOp } = this.operationQueue.reduce(
      (prevSet, op) => {
        const newOp = transform(op, prevSet.newOp);
        return { newQueue: prevSet.newQueue.concat(newOp), newOp: newOp[1] };
      },
      { newQueue: [] as Operation[], newOp: serverOp }
    );

    this.operationQueue = newQueue;
    return newOp;
  };

  /**
   * @returns if are any operations queued
   */
  public isEmpty = (): boolean => this.operationQueue.length === 0;

  /**
   * @returns the operation at the head of the operation queue and removes it
   */
  public dequeueOperation = (): Operation | undefined =>
    this.operationQueue.shift();

  /**
   * @returns the operation at the head of the operation queue
   */
  public peekHead = (): Operation | undefined => this.operationQueue[0];

  // operationQueue is our internal operation queue
  private operationQueue = [] as Operation[];
}
