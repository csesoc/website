// integer operation
type integerOperation = {
    newValue: number
}

type booleanOperation = {
    newValue: boolean
}

// string based operations
type stringOperation = {
    operationType: "insert" | "delete";
    rangeStart: number, rangeEnd: number;

    newValue?: string;
}

// array based operations
type arrayOperation = {
    index: number
    
    payload: {
        $type: string
        value: object
    }
}

// object based operations
type objectOperation = {
    $type: string,
    value: object
}

// the generic operation type
type operation = {
    $type: "integerOperation" | "booleanOperation" | 
            "arrayOperation" | "objectOperation",

    path: number[],
    operation: integerOperation | booleanOperation | 
                arrayOperation | objectOperation;
}