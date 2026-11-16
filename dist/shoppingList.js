export class ShoppingList {
    constructor() {
        this.items = [];
    }
    setItems(items) {
        this.items = items;
    }
    addItem(item) {
        this.items.push(item);
    }
    removeItem(id) {
        this.items = this.items.filter((item) => item.id !== id);
    }
    updateQuantity(id, newQuantity) {
        const index = this.items.findIndex((item) => item.id === id);
        if (index !== -1) {
            this.items[index].quantity = newQuantity;
        }
    }
    getAllItems() {
        return this.items;
    }
}
