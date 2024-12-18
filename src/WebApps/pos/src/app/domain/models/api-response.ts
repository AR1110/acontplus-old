
export interface ApiResponse {
    code: "0" | "1" | "2"
    message: string
    payload: unknown
    titleSms?: string
}



export function isApiResponse(object: unknown | object): object is ApiResponse {
    if (object !== null && typeof object === 'object') {
        return 'code'! in object;
    }
    return false;
}
