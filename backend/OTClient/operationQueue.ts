import { Operation, transform } from './operation'
import { None, Option, Some } from './option'

// OperationQueue is a simple data structure of the maintenance of outgoing operations, new operations are pushed to this queue
// and when and incoming operation from the server applies that operation is transformed against all elements of this queue
export class OperationQueue {
    
    // queueOperation pushes an operation to the end of the operation queue
    public enqueueOperation = (operation: Operation) => 
        this.operationQueue.push(operation); 
    
    // applyIncomingOperation takes an incoming operation from the server and applies
    // it to all elements of the queue, it returns the serverOp transformed against all operations
    // in the operation queue
    public applyAndTransformIncomingOperation = (serverOp: Operation): Operation => {
        const { newQueue, newOp } = 
            this.operationQueue.reduce(
                (prevSet, op) => { 
                    const newOp = transform(op, prevSet.newOp); 
                    return { newQueue: prevSet.newQueue.concat(newOp), newOp: newOp[1] }; 
                },
                { newQueue: [] as Operation[], newOp: serverOp}
            );

        this.operationQueue = newQueue;
        return newOp;
    }

    // isEmpty determines if there are any operations queued or not
    public isEmpty = (): boolean => this.operationQueue.length === 0;

    // dequeueOperation removes the operation at the head of the operation queue
    public dequeueOperation = (): Option<Operation> =>
        this.isEmpty()
            ? None()
            : Some(this.operationQueue.shift());

    // peekHead just peeks at the head of the operation queue
    public peekHead = (): Option<Operation> => 
        this.isEmpty()
            ? None()
            : Some(this.operationQueue[0]);

    // operationQueue is our internal operation queue
    private operationQueue = [] as Operation[];
}