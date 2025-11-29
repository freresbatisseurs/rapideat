// Données "fake" de restaurants
const restaurants = [
  {
    id: 1,
    name: "Pizza Bella",
    category: "pizza",
    rating: 4.6,
    time: "25-35 min",
    priceLevel: "€€",
    tags: ["Pizza", "Italien", "Halal"],
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
    menu: [
      {
        section: "Pizzas classiques",
        items: [
          {
            id: "p1",
            name: "Margherita",
            description: "Sauce tomate, mozzarella, basilic frais",
            price: 9.9,
          },
          {
            id: "p2",
            name: "Reine",
            description: "Jambon, champignons, mozzarella",
            price: 11.5,
          },
        ],
      },
      {
        section: "Boissons",
        items: [
          {
            id: "p3",
            name: "Coca-Cola 33cl",
            description: "",
            price: 2.9,
          },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Best Burger",
    category: "burger",
    rating: 4.3,
    time: "20-30 min",
    priceLevel: "€",
    tags: ["Burger", "Frites", "Menus"],
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
    menu: [
      {
        section: "Burgers",
        items: [
          {
            id: "b1",
            name: "Cheeseburger",
            description: "Bœuf, cheddar, salade, tomate",
            price: 8.9,
          },
          {
            id: "b2",
            name: "Double Burger",
            description: "Double steak, cheddar, oignons caramélisés",
            price: 11.9,
          },
        ],
      },
      {
        section: "Accompagnements",
        items: [
          {
            id: "b3",
            name: "Frites maison",
            description: "Frites croustillantes",
            price: 3.5,
          },
        ],
      },
    ],
  },
  {
    id: 3,
    name: "Tokyo Sushi",
    category: "japonais",
    rating: 4.7,
    time: "30-40 min",
    priceLevel: "€€€",
    tags: ["Sushi", "Maki", "Japonais"],
    image:
      "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=800&q=80",
    menu: [
      {
        section: "Assortiments",
        items: [
          {
            id: "s1",
            name: "Assortiment 12 pièces",
            description: "Sushi & maki variés",
            price: 14.9,
          },
          {
            id: "s2",
            name: "Assortiment 24 pièces",
            description: "Pour 2 personnes",
            price: 26.9,
          },
        ],
      },
    ],
  },
];

// ÉTAT GLOBAL
let filteredCategory = "all";
let cart = [];

// ÉLÉMENTS DOM
const restaurantsContainer = document.getElementById("restaurantsContainer");
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filter-btn");

const restaurantModal = document.getElementById("restaurantModal");
const restaurantDetails = document.getElementById("restaurantDetails");
const closeRestaurantModal = document.getElementById("closeRestaurantModal");

const cartModal = document.getElementById("cartModal");
const openCartBtn = document.getElementById("openCartBtn");
const closeCartModal = document.getElementById("closeCartModal");
const cartItemsEl = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
const cartCountEl = document.getElementById("cartCount");
const checkoutBtn = document.getElementById("checkoutBtn");

const toast = document.getElementById("toast");

// RENDU DES RESTOS
function renderRestaurants() {
  const query = searchInput.value.toLowerCase();

  const filtered = restaurants.filter((r) => {
    const matchCategory =
      filteredCategory === "all" || r.category === filteredCategory;
    const matchSearch =
      r.name.toLowerCase().includes(query) ||
      r.tags.join(" ").toLowerCase().includes(query);
    return matchCategory && matchSearch;
  });

  restaurantsContainer.innerHTML = "";

  if (filtered.length === 0) {
    restaurantsContainer.innerHTML = `<p>Aucun restaurant trouvé.</p>`;
    return;
  }

  filtered.forEach((r) => {
    const card = document.createElement("div");
    card.className = "restaurant-card";
    card.innerHTML = `
      <img src="${r.image}" alt="${r.name}" class="restaurant-image" />
      <div class="restaurant-body">
        <div class="restaurant-name">${r.name}</div>
        <div class="restaurant-info">
          ⭐ ${r.rating} • ${r.time} • ${r.priceLevel}
        </div>
        <div class="restaurant-tags">${r.tags.join(" • ")}</div>
      </div>
    `;
    card.addEventListener("click", () => openRestaurant(r.id));
    restaurantsContainer.appendChild(card);
  });
}

// OUVRIR MODALE RESTO
function openRestaurant(id) {
  const restaurant = restaurants.find((r) => r.id === id);
  if (!restaurant) return;

  let html = `
    <div class="restaurant-header">
      <img src="${restaurant.image}" alt="${restaurant.name}" />
      <div class="restaurant-header-info">
        <h2>${restaurant.name}</h2>
        <div class="restaurant-info">
          ⭐ ${restaurant.rating} • ${restaurant.time} • ${restaurant.priceLevel}
        </div>
        <div class="restaurant-tags">${restaurant.tags.join(" • ")}</div>
      </div>
    </div>
  `;

  restaurant.menu.forEach((section) => {
    html += `
      <div class="menu-section">
        <h3>${section.section}</h3>
        ${section.items
          .map(
            (item) => `
          <div class="menu-item">
            <div class="menu-item-info">
              <h4>${item.name}</h4>
              <p>${item.description || ""}</p>
              <div class="menu-item-price">${item.price.toFixed(2)} €</div>
            </div>
            <div class="menu-item-actions">
              <button class="btn-primary" data-restaurant-id="${
                restaurant.id
              }" data-item-id="${item.id}">
                Ajouter
              </button>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    `;
  });

  restaurantDetails.innerHTML = html;
  restaurantModal.classList.remove("hidden");

  // Ajout des écouteurs sur les boutons "Ajouter"
  restaurantDetails
    .querySelectorAll("button[data-item-id]")
    .forEach((btn) => {
      btn.addEventListener("click", () => {
        const restaurantId = parseInt(btn.dataset.restaurantId, 10);
        const itemId = btn.dataset.itemId;
        addToCart(restaurantId, itemId);
      });
    });
}

function closeRestaurant() {
  restaurantModal.classList.add("hidden");
}

// PANIER
function addToCart(restaurantId, itemId) {
  const restaurant = restaurants.find((r) => r.id === restaurantId);
  if (!restaurant) return;

  let selectedItem = null;
  restaurant.menu.forEach((section) => {
    section.items.forEach((item) => {
      if (item.id === itemId) {
        selectedItem = item;
      }
    });
  });

  if (!selectedItem) return;

  const key = `${restaurantId}_${itemId}`;
  const existing = cart.find((c) => c.key === key);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      key,
      restaurantId,
      restaurantName: restaurant.name,
      id: selectedItem.id,
      name: selectedItem.name,
      price: selectedItem.price,
      quantity: 1,
    });
  }

  updateCartUI();
  showToast("Article ajouté au panier");
}

function updateCartUI() {
  cartItemsEl.innerHTML = "";

  if (cart.length === 0) {
    cartItemsEl.innerHTML = `<p>Votre panier est vide.</p>`;
    cartTotalEl.textContent = "0,00 €";
    cartCountEl.textContent = "0";
    return;
  }

  let total = 0;
  let count = 0;

  cart.forEach((item) => {
    total += item.price * item.quantity;
    count += item.quantity;

    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <div class="cart-item-info">
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-restaurant">${item.restaurantName}</div>
        <div class="cart-item-qty">
          <button data-action="dec">-</button>
          <span>${item.quantity}</span>
          <button data-action="inc">+</button>
        </div>
      </div>
      <div class="cart-item-price">
        ${(item.price * item.quantity).toFixed(2)} €
      </div>
    `;

    const [decBtn, , incBtn] =
      row.querySelectorAll(".cart-item-qty button, .cart-item-qty span");

    decBtn.addEventListener("click", () => changeQuantity(item.key, -1));
    incBtn.addEventListener("click", () => changeQuantity(item.key, 1));

    cartItemsEl.appendChild(row);
  });

  cartTotalEl.textContent = `${total.toFixed(2)} €`;
  cartCountEl.textContent = String(count);
}

function changeQuantity(key, delta) {
  const index = cart.findIndex((c) => c.key === key);
  if (index === -1) return;

  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }
  updateCartUI();
}

function openCart() {
  cartModal.classList.remove("hidden");
}

function closeCart() {
  cartModal.classList.add("hidden");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  toast.classList.remove("hidden");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 1500);
}

// ÉVÉNEMENTS
searchInput.addEventListener("input", renderRestaurants);

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    filteredCategory = btn.dataset.category;
    renderRestaurants();
  });
});

closeRestaurantModal.addEventListener("click", closeRestaurant);
restaurantModal.addEventListener("click", (e) => {
  if (e.target === restaurantModal) {
    closeRestaurant();
  }
});

openCartBtn.addEventListener("click", openCart);
closeCartModal.addEventListener("click", closeCart);
cartModal.addEventListener("click", (e) => {
  if (e.target === cartModal) {
    closeCart();
  }
});

checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    showToast("Votre panier est vide");
    return;
  }
  alert("Simulation : commande validée ✅ (à toi d'ajouter la suite)");
});

// INIT
renderRestaurants();
updateCartUI();
