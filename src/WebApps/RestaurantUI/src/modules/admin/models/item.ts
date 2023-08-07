export interface ItemReadDto {
    readonly id: number
    productId: number	
    roductionAreaId: number		
    summary?: string		
    cooking:	boolean
    recipe?:	 string
    instructions?	: string
    Content?: string	
    CreatedAt?: string		
    UpdatedAt?: string		
    Enabled?: boolean		
    Deleted?: boolean		
    UserId?: number	
}

export interface ItemCreateDto {
    productId: number
}

export interface ItemUpdateDto {
    id: number
}