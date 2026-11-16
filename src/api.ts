import type { ShoppingListItem, NewShoppingListItem } from "./interfaces.js";
import { parseItem, parseItems } from "./parse.js";

const API_URL = "http://localhost:3001/items";

async function request(url: string, init?: RequestInit): Promise<unknown> {
  const response = await fetch(url, init);
  if (!response.ok) {
    throw new Error(`Ошибка сервера: ${response.status}`);
  }
  if (init?.method === "DELETE") return;
  return await response.json();
}

export async function fetchItems(): Promise<ShoppingListItem[]> {
  const data = await request(API_URL);
  return parseItems(data);
}

export async function createItemOnServer(item: NewShoppingListItem): Promise<ShoppingListItem> {
  const data = await request(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
  return parseItem(data);
}

export async function updateQuantityOnServer(id: number, quantity: number): Promise<ShoppingListItem> {
  const data = await request(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantity }),
  });
  return parseItem(data);
}

export async function deleteItemOnServer(id: number): Promise<void> {
  await request(`${API_URL}/${id}`, { method: "DELETE" });
}
