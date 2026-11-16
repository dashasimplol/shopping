import type { Product, ShoppingListItem } from "./interfaces.js";

function isProduct(value: unknown): value is Product {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;

  return (
    typeof item.id === "number" &&
    typeof item.name === "string" &&
    typeof item.price === "number"
  );
}

export function isShoppingListItem(value: unknown): value is ShoppingListItem {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;

  return (
    typeof item.id === "number" &&
    isProduct(item.product) &&
    typeof item.quantity === "number"
  );
}

export function parseItem(data: unknown): ShoppingListItem {
  if (!isShoppingListItem(data)) {
    throw new Error("Сервер вернул данные неожиданного формата");
  }
  return data;
}

export function parseItems(data: unknown): ShoppingListItem[] {
  if (!Array.isArray(data) || !data.every(isShoppingListItem)) {
    throw new Error("Сервер вернул данные неожиданного формата");
  }
  return data;
}
