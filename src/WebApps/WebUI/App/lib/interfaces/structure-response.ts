export interface StructureResponse {
    code: string;
    message?: string;
    payload?: any;
}

export function isApiResponse(object: unknown | object): object is StructureResponse {
    if (object !== null && typeof object === 'object') {
        return 'code'! in object;
    }
    return false;
}
