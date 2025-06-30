let menu = [];
let order = [];

const menuContainer = document.getElementById("menu-container");
const orderList = document.getElementById("order-list");
const orderTotal = document.getElementById("order-total");
const clearOrderBtn = document.getElementById("clear-order");

// Load menu.json and display items
async function loadMenu() {
  try {
    const response = await fetch('menu.json');
    menu = await response.json();
    renderMenu();
  } catch (e) {
    console.error("Failed to load menu.json", e);
    menuContainer.textContent = "Failed to load menu.";
  }
}

// Render menu items
function renderMenu() {
  menuContainer.innerHTML = "";
  menu.forEach(item => {
    const div = document.createElement("div");
    div.className = "menu-item";
    if (item.Spicy) div.classList.add("spicy");

    div.textContent = `${item.Name} - $${item.Price.toFixed(2)}`;
    div.title = `${item.Category}${item.Spicy ? " (Spicy)" : ""}`;

    div.addEventListener("click", () => {
      addToOrder(item);
    });

    menuContainer.appendChild(div);
  });
}


// Add item to order
function addToOrder(item) {
  order.push(item);
  renderOrder();
}

// Render current order list and total
function renderOrder() {
  orderList.innerHTML = "";
  let total = 0;
  order.forEach((item, idx) => {
    total += item.Price;
    const li = document.createElement("li");
    li.textContent = `${item.Name} - $${item.Price.toFixed(2)}`;

    // Optional: allow removal on click
    li.style.cursor = "pointer";
    li.title = "Tap to remove item";
    li.addEventListener("click", () => {
      order.splice(idx, 1);
      renderOrder();
    });

    orderList.appendChild(li);
  });
  orderTotal.textContent = total.toFixed(2);
}

clearOrderBtn.addEventListener("click", () => {
  order = [];
  renderOrder();
});

loadMenu();