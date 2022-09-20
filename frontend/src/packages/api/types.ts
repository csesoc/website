export type APIError = {
    Status: number,
    Message: string
}

export type EmptyAPIResponse = {
    Status: 200,
    Message: string,
    Response: ""
}

export const IsError = <T>(o: T | APIError): o is APIError =>
    'Status' in o && 
    typeof o.Status === 'number' &&
    o.Status != 200