function isProduct(value) {
    if (typeof value !== "object" || value === null)
        return false;
    const item = value;
    return (typeof item.id === "number" &&
        typeof item.name === "string" &&
        typeof item.price === "number");
}
export function isShoppingListItem(value) {
    if (typeof value !== "object" || value === null)
        return false;
    const item = value;
    return (typeof item.id === "number" &&
        isProduct(item.product) &&
        typeof item.quantity === "number");
}
export function parseItem(data) {
    if (!isShoppingListItem(data)) {
        throw new Error("Сервер вернул данные неожиданного формата");
    }
    return data;
}
export function parseItems(data) {
    if (!Array.isArray(data) || !data.every(isShoppingListItem)) {
        throw new Error("Сервер вернул данные неожиданного формата");
    }
    return data;
}
