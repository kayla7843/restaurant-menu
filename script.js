let menu = [];
let order = [];
let currentCategory = "lunch";
const SALES_TAX_RATE = 0.065; 

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

// Render menu items filtered by availability (lunch/dinner)
function renderMenu() {
  menuContainer.innerHTML = "";

  // Filter items by availability (lunch/dinner)
  const filteredMenu = menu.filter(item => 
    item.Avalibility && item.Avalibility.toLowerCase() === currentCategory
  );

  // Group items by category
  const categories = {};
  filteredMenu.forEach(item => {
    if (!categories[item.Category]) {
      categories[item.Category] = [];
    }
    categories[item.Category].push(item);
  });

  // For each category, create a section with title and items
  Object.keys(categories).forEach(categoryName => {
    // Category header
    const categoryHeader = document.createElement("h3");
    categoryHeader.textContent = categoryName;
    categoryHeader.style.marginTop = "20px";
    menuContainer.appendChild(categoryHeader);

    // Items list container for this category
    const categoryDiv = document.createElement("div");
    categoryDiv.style.display = "flex";
    categoryDiv.style.flexWrap = "wrap";
    categoryDiv.style.gap = "10px";
    menuContainer.appendChild(categoryDiv);

    categories[categoryName].forEach(item => {
      const div = document.createElement("div");
      div.className = "menu-item";
      if (item.Spicy && item.Spicy.toLowerCase() === "true") {
        div.classList.add("spicy");
      }

      div.textContent = `${item.Name} - $${item.Price.toFixed(2)}`;
      div.title = `${item.Category}${item.Spicy && item.Spicy.toLowerCase() === "true" ? " (Spicy)" : ""}`;

      div.addEventListener("click", () => {
        addToOrder(item);
      });

      categoryDiv.appendChild(div);
    });
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
  let subtotal = 0;
  order.forEach((item, idx) => {
    subtotal += item.Price;
    const li = document.createElement("li");
    li.textContent = `${item.Name} - $${item.Price.toFixed(2)}`;

    li.style.cursor = "pointer";
    li.title = "Tap to remove item";
    li.addEventListener("click", () => {
      order.splice(idx, 1);
      renderOrder();
    });

    orderList.appendChild(li);
  });

  const tax = subtotal * SALES_TAX_RATE;
  const total = subtotal + tax;

  document.getElementById("order-subtotal").textContent = subtotal.toFixed(2);
  document.getElementById("order-tax").textContent = tax.toFixed(2);
  orderTotal.textContent = total.toFixed(2);
}


// Clear order button
clearOrderBtn.addEventListener("click", () => {
  order = [];
  renderOrder();
});

// Toggle lunch/dinner menu
const toggleButtons = document.querySelectorAll("#menu-toggle button");

toggleButtons.forEach(button => {
  button.addEventListener("click", () => {
    currentCategory = button.getAttribute("data-category");

    // Update active button styling
    toggleButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    renderMenu();
  });
});

// Initial load
loadMenu();
