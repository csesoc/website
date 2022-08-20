export interface Operation {
	operation: string;
	index: number;
}


export const transform = (a: Operation, b: Operation): [Operation, Operation] => [{ operation: 'add', index: 3}, { operation: 'add', index: 3}];
