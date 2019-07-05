export interface Recipe {
    name: string,
    description?: string,
    ingredients: string[],
    timeNeeded?: number,
    favourite?: boolean
}