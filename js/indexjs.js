function increaseQuantity(button) {
  let input = button.previousElementSibling;
  input.value = parseInt(input.value) + 1;
}

function decreaseQuantity(button) {
  let input = button.nextElementSibling;
  if (parseInt(input.value) > 1) {
    input.value = parseInt(input.value) - 1;
  }
}
//
document.addEventListener("DOMContentLoaded", () => {
  const reviews = document.querySelectorAll(".reviews-card");
  const prevBtn = document.querySelector(".history-nav#prev-part");
  const nextBtn = document.querySelector(".history-nav#next-part");

  let currentIndex = 0;
  const reviewsData = [
    {
      title: "Настоящий вкус Италии!",
      description:
        "«Pizza Mondo — это просто находка! Тесто тонкое и хрустящее, начинки в меру, а соусы просто потрясающие. Очень советую попробовать |Дон Карлеоне| — она великолепна!»",
    },
    {
      title: "Лучшая пиццерия в городе",
      description:
        "«Обожаю Pizza Mondo! Уютная атмосфера, быстрая доставка и потрясающий выбор пиццы. Особенно понравилась |Гавайская| — свежий ананас делает её просто восхитительной! Всем рекомендую!»",
    },
    {
      title: "Идеальное сочетание вкуса",
      description:
        "«Давно искал место, где делают настоящую итальянскую пиццу. В Pizza Mondo всё именно так! Отличное качество ингредиентов, дружелюбный персонал и самые вкусные пиццы в городе. Это любовь с первого кусочка!»",
    },
  ];

  function updateReview() {
    reviews.forEach((review, index) => {
      if (index === currentIndex) {
        review.style.display = "flex";
        review.querySelector("#reviews-title").textContent =
          reviewsData[currentIndex].title;
        review.querySelector("#reviews-content").textContent =
          reviewsData[currentIndex].description;
      } else {
        review.style.display = "none";
      }
    });
  }

  document.querySelectorAll("#prev-part").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentIndex =
        (currentIndex - 1 + reviewsData.length) % reviewsData.length;
      updateReview();
    });
  });
  document.querySelectorAll("#next-part").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % reviewsData.length;
      updateReview();
    });
  });

  updateReview();
});

document.querySelectorAll(".menu_card").forEach((card) => {
  const basePrice = Number(card.dataset.basePrice);
  const priceElement = card.querySelector(".price");
  const changeElement = card.querySelector(".change_price");
  const sizeOptions = card.querySelectorAll(".size_selection input");
  const quantityInputs = card.querySelector(".menu_quantity input");
  function updatePrice() {
    const selectedSize = card.querySelector(
      ".size_selection input:checked",
    ).value;

    let price = basePrice;
    let changeText = "";

    if (selectedSize === "60") {
      price = basePrice + 1000;
      changeText = "+1000тг";
    } else if (selectedSize === "15") {
      price = basePrice - 1000;
      changeText = "-1000тг";
    }

    const quantity = Number(quantityInputs.value) || 1;
    priceElement.textContent = price * quantity;
    changeElement.textContent = changeText;
  }
  sizeOptions.forEach((option) => {
    option.addEventListener("change", updatePrice);
  });

  card.querySelectorAll(".menu_quantity button").forEach((button) => {
    button.addEventListener("click", updatePrice);
  });

  updatePrice();
});

const cart = new Map();
const cartToggle = document.getElementById("cart-toggle");
const cartDialog = document.getElementById("cart-dialog");
const cartClose = document.getElementById("cart-close");
const cartClear = document.getElementById("cart-clear");
const cartItemsList = document.getElementById("cart-items");
const cartEmpty = document.getElementById("cart-empty");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");

function formatMoney(amount) {
  return `${amount.toLocaleString("ru-RU")} тг`;
}

function createCartButton(label, action, className, ariaLabel) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.textContent = label;
  button.dataset.action = action;
  button.setAttribute("aria-label", ariaLabel);
  return button;
}

function renderCart() {
  cartItemsList.replaceChildren();

  let total = 0;
  let itemCount = 0;

  cart.forEach((item, key) => {
    total += item.unitPrice * item.quantity;
    itemCount += item.quantity;

    const row = document.createElement("li");
    row.className = "cart-item";
    row.dataset.key = key;

    const details = document.createElement("div");
    details.className = "cart-item-details";

    const name = document.createElement("strong");
    name.className = "cart-item-name";
    name.textContent = item.name;

    const description = document.createElement("span");
    description.className = "cart-item-description";
    description.textContent = `${item.size} см · ${formatMoney(
      item.unitPrice,
    )} за пиццу`;

    const controls = document.createElement("div");
    controls.className = "cart-item-controls";
    controls.append(
      createCartButton(
        "−",
        "decrease",
        "cart-quantity-button",
        "Уменьшить количество",
      ),
    );

    const quantity = document.createElement("span");
    quantity.className = "cart-item-quantity";
    quantity.textContent = item.quantity;
    quantity.setAttribute("aria-label", `Количество: ${item.quantity}`);
    controls.append(quantity);
    controls.append(
      createCartButton(
        "+",
        "increase",
        "cart-quantity-button",
        "Увеличить количество",
      ),
    );

    const lineTotal = document.createElement("strong");
    lineTotal.className = "cart-item-total";
    lineTotal.textContent = formatMoney(item.unitPrice * item.quantity);

    const remove = createCartButton(
      "Удалить",
      "remove",
      "cart-remove-button",
      `Удалить ${item.name} из корзины`,
    );

    details.append(name, description);
    row.append(details, controls, lineTotal, remove);
    cartItemsList.append(row);
  });

  cartCount.textContent = itemCount;
  cartTotal.textContent = formatMoney(total);
  cartEmpty.hidden = cart.size > 0;
  cartClear.disabled = cart.size === 0;
}

document.querySelectorAll(".menu_card").forEach((card) => {
  card.querySelector(".menu_add_to_cart").addEventListener("click", () => {
    const name = card.querySelector("h2").textContent.trim();
    const size = card.querySelector(".size_selection input:checked").value;
    const basePrice = Number(card.dataset.basePrice);
    const quantity =
      Number(card.querySelector(".menu_quantity input").value) || 1;
    const sizeAdjustment = size === "60" ? 1000 : size === "15" ? -1000 : 0;
    const unitPrice = basePrice + sizeAdjustment;
    const key = `${name}-${size}`;
    const existingItem = cart.get(key);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.set(key, { name, size, unitPrice, quantity });
    }

    renderCart();
  });
});

cartToggle.addEventListener("click", () => {
  renderCart();
  cartDialog.showModal();
});

cartClose.addEventListener("click", () => cartDialog.close());

cartDialog.addEventListener("click", (event) => {
  if (event.target === cartDialog) {
    cartDialog.close();
  }
});

cartClear.addEventListener("click", () => {
  cart.clear();
  renderCart();
});

cartItemsList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const row = button.closest(".cart-item");
  const item = cart.get(row.dataset.key);
  if (!item) return;

  if (button.dataset.action === "increase") {
    item.quantity += 1;
  } else if (button.dataset.action === "decrease") {
    item.quantity -= 1;
    if (item.quantity <= 0) cart.delete(row.dataset.key);
  } else if (button.dataset.action === "remove") {
    cart.delete(row.dataset.key);
  }

  renderCart();
});

renderCart();
