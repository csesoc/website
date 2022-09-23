export type APIError = {
    Status: number,
    Message: string
}

export type EmptyAPIResponse = Record<string, never>;

export const IsError = <T>(o: T | APIError): o is APIError =>
    'Status' in o && 
    typeof o.Status === 'number' &&
    o.Status != 200;

export const IsEmptyApiResponse = (o: EmptyAPIResponse | APIError): o is EmptyAPIResponse =>
    Object.entries(o).length === 0;