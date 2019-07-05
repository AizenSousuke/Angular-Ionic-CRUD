export interface Recipe {
    id: number,
    imageLink?: string,
    name: string,
    description?: string,
    ingredients: string[],
    timeNeeded?: number,
    favourite?: boolean
}