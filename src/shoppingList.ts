import type { ShoppingListItem } from "./interfaces.js";

export class ShoppingList {
  private items: ShoppingListItem[] = [];

  setItems(items: ShoppingListItem[]): void {
    this.items = items;
  }

  addItem(item: ShoppingListItem): void {
    this.items.push(item);
  }

  removeItem(id: number): void {
    this.items = this.items.filter((item) => item.id !== id);
  }

  updateQuantity(id: number, newQuantity: number): void {
    const index = this.items.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.items[index].quantity = newQuantity;
    }
  }

  getAllItems(): ShoppingListItem[] {
    return this.items;
  }
}
