export type Operation = {
	// TODO: we may need to remodel our operations and re-think how exactly this should be structured
	path: number[];
	editType: "insert" | "delete" | "noop";
}

// constant noop type
export const noop: Operation = { path: [], editType: "noop" };

// transform takes in two operations and returns their transformed ops
export const transform = (a: Operation, b: Operation): [Operation, Operation] => {
	const transformedPaths = transformPaths(a, b);

	a.path = transformedPaths[0];
	b.path = transformedPaths[1];

	return [normalise(a), normalise(b)];
}

// transformPaths takes in two operations and transforms them accordingly, note that it only returns the updated paths
const transformPaths = (a: Operation, b: Operation): [number[], number[]] => {
	const tp = transformationPoint(a.path, b.path);
	if (!effectIndependent(a.path, b.path, tp)) {
		switch (true) {
			case a.editType === "insert" && b.editType === "insert": return transformInserts(a.path, b.path, tp);
			case a.editType === "delete" && b.editType === "delete": return transformDeletes(a.path, b.path, tp);
			case a.editType === "insert" && b.editType === "delete": return transformInsertDelete(a.path, b.path, tp);
			default: 
				const result = transformInsertDelete(b.path, a.path, tp);
				result.reverse();
				return result;
		}
	}

	return [a.path, b.path];
}

// transformInserts takes 2 paths and their transformation point and transforms them as if they were insertion functions
const transformInserts = (a: number[], b: number[], tp: number): [number[], number[]] => {
	switch (true) {
		case a[tp] > b[tp]: return [update(a, tp, 1), b];
		case a[tp] < b[tp]: return [a, update(b, tp, 1)];
		default:
			return a.length > b.length
					? [update(a, tp, 1), b]
					: (a.length < b.length ? [a, update(b, tp, 1)] : [a, b]); 
	}
}

// transformDeletes takes 2 paths and transforms them as if they were deletion operations
const transformDeletes = (a: number[], b: number[], tp: number): [number[], number[]] => {
	switch (true) {
		case a[tp] > b[tp]: return [update(a, tp, -1), b];
		case a[tp] < b[tp]: return [a, update(b, tp, -1)];
		default:
			return a.length > b.length
					? [[], b]
					: (a.length < b.length ? [a, []] : [[], []]); 
	}
}

// transformInsertDelete takes an insertion operation and a deletion operation and transforms them
const transformInsertDelete = (insertOp: number[], deleteOp: number[], tp: number): [number[], number[]] => {
	switch (true) {
		case insertOp[tp] > deleteOp[tp]: return [update(insertOp, tp, -1), deleteOp];
		case insertOp[tp] < deleteOp[tp]: return [insertOp, update(deleteOp, tp, 1)];
		default:
			return insertOp.length > deleteOp.length
					? [[], deleteOp]
					: [insertOp, update(deleteOp, tp, 1)] 
	}
}

// update updates a specific index in a path
const update = (pos: number[], toChange: number, change: number) => {
	pos[toChange] += change;
	return pos;
}

// transformationPoint takes in two paths and computes their transformation point
const transformationPoint = (a: number[], b: number[]): number =>
	[...Array(Math.max(a.length, b.length)).keys()]
	.find(i => (a[i] ?? -1) != (b[i] ?? -1)) ?? (Math.max(a.length, b.length) - 1);
	

// effectIndependence takes two paths and determines if their effect is independent or not
const effectIndependent = (a: number[], b: number[], transformationPoint: number): boolean =>
	a.length > (transformationPoint + 1) && b.length > (transformationPoint + 1) ||
	(a[transformationPoint] > b[transformationPoint] && a.length < b.length) ||
	(a[transformationPoint] < b[transformationPoint] && a.length > b.length);

// normalise turns an empty operation into a noop
const normalise = (a: Operation): Operation =>
	a.path.length === 0
		? noop
		: a;