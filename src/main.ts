import { ShoppingList } from "./shoppingList.js";
import {
  fetchItems,
  createItemOnServer,
  updateQuantityOnServer,
  deleteItemOnServer,
} from "./api.js";

const shoppingList = new ShoppingList();

const addForm = document.querySelector<HTMLFormElement>("#add-form");
const nameInput = document.querySelector<HTMLInputElement>("#product-name");
const priceInput = document.querySelector<HTMLInputElement>("#product-price");
const quantityInput = document.querySelector<HTMLInputElement>("#product-quantity");
const listElement = document.querySelector<HTMLUListElement>("#shopping-list");
const messageElement = document.querySelector<HTMLParagraphElement>("#message");

function showMessage(text: string): void {
  if (messageElement) {
    messageElement.textContent = text;
  }
}

function render(): void {
  if (!listElement) return;
  listElement.replaceChildren();

  const items = shoppingList.getAllItems();
  if (items.length === 0) {
    const empty = document.createElement("li");
    empty.textContent = "Список покупок пуст.";
    listElement.append(empty);
    return;
  }

  for (const item of items) {
    const li = document.createElement("li");

    const info = document.createElement("span");
    info.textContent = `${item.product.name} — ${item.product.price} руб. × ${item.quantity} шт.`;

    const actions = document.createElement("div");
    actions.className = "actions";

    const incButton = document.createElement("button");
    incButton.type = "button";
    incButton.className = "btn-qty";
    incButton.dataset.action = "inc";
    incButton.dataset.id = String(item.id);
    incButton.textContent = "+1";

    const delButton = document.createElement("button");
    delButton.type = "button";
    delButton.className = "btn-del";
    delButton.dataset.action = "delete";
    delButton.dataset.id = String(item.id);
    delButton.textContent = "Удалить";

    actions.append(incButton, delButton);
    li.append(info, actions);
    listElement.append(li);
  }
}

async function init(): Promise<void> {
  showMessage("Загрузка списка...");
  try {
    const items = await fetchItems();
    shoppingList.setItems(items);
    showMessage("");
    render();
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Неизвестная ошибка";
    showMessage(`Не удалось загрузить данные: ${msg}`);
  }
}

addForm?.addEventListener("submit", async (event: SubmitEvent) => {
  event.preventDefault();
  if (!nameInput || !priceInput || !quantityInput) return;

  const name = nameInput.value.trim();
  const price = Number(priceInput.value);
  const quantity = Number(quantityInput.value);

  if (!name || price <= 0 || quantity <= 0) {
    showMessage("Заполните корректно все поля.");
    return;
  }

  try {
    const created = await createItemOnServer({
      product: { id: Date.now(), name, price },
      quantity,
    });
    shoppingList.addItem(created);
    addForm.reset();
    quantityInput.value = "1";
    showMessage("");
    render();
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Неизвестная ошибка";
    showMessage(`Ошибка при добавлении: ${msg}`);
  }
});

listElement?.addEventListener("click", async (event: MouseEvent) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const button = target.closest<HTMLButtonElement>("button[data-action]");
  if (!button) return;

  const id = Number(button.dataset.id);
  const action = button.dataset.action;
  if (!id || !action) return;

  try {
    if (action === "inc") {
      const current = shoppingList.getAllItems().find((i) => i.id === id);
      if (!current) return;

      const updated = await updateQuantityOnServer(id, current.quantity + 1);
      shoppingList.updateQuantity(id, updated.quantity);
      render();
    } else if (action === "delete") {
      await deleteItemOnServer(id);
      shoppingList.removeItem(id);
      render();
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Неизвестная ошибка";
    showMessage(`Ошибка операции: ${msg}`);
  }
});

void init();
