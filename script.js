
/* ==========================================
   MINISTORE - E-COMMERCE APPLICATION
   HTML + CSS + VANILLA JAVASCRIPT
========================================== */


/* 1. PRODUCT DATABASE */

const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 3500,
        category: "Electronics",
        description: "High-quality wireless headphones with clear sound and comfortable ear cushions.",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600"
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 4500,
        category: "Electronics",
        description: "Modern smart watch with fitness tracking and notification features.",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"
    },
    {
        id: 3,
        name: "Running Shoes",
        price: 5200,
        category: "Fashion",
        description: "Comfortable sports shoes suitable for running and everyday activities.",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"
    },
    {
        id: 4,
        name: "Travel Backpack",
        price: 2800,
        category: "Accessories",
        description: "Durable backpack with multiple compartments for travel and school.",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600"
    },
    {
        id: 5,
        name: "Digital Camera",
        price: 18500,
        category: "Electronics",
        description: "Compact digital camera for capturing everyday moments.",
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600"
    },
    {
        id: 6,
        name: "Classic Wristwatch",
        price: 3200,
        category: "Accessories",
        description: "Elegant wristwatch with a timeless design.",
        image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600"
    },
    {
        id: 7,
        name: "Casual T-Shirt",
        price: 1200,
        category: "Fashion",
        description: "Comfortable casual clothing suitable for everyday wear.",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600"
    },
    {
        id: 8,
        name: "Coffee Maker",
        price: 6500,
        category: "Home",
        description: "Convenient coffee maker for preparing coffee at home.",
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600"
    },
    {
        id: 9,
        name: "Desk Lamp",
        price: 1800,
        category: "Home",
        description: "Modern desk lamp suitable for study and office spaces.",
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600"
    },
    {
        id: 10,
        name: "Bluetooth Speaker",
        price: 2900,
        category: "Electronics",
        description: "Portable speaker with wireless connectivity.",
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600"
    },
    {
        id: 11,
        name: "Leather Handbag",
        price: 3900,
        category: "Fashion",
        description: "Stylish handbag with practical storage compartments.",
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600"
    },
    {
        id: 12,
        name: "Sunglasses",
        price: 1500,
        category: "Accessories",
        description: "Fashion sunglasses suitable for everyday outdoor use.",
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600"
    }
];


/* 2. APPLICATION STATE */

// Load saved shopping cart from LocalStorage.

function loadCart() {
    try {
        const saved = JSON.parse(
            localStorage.getItem("ministore_cart")
        );

        if (!Array.isArray(saved)) return [];

        return saved
            .filter(item =>
                products.some(p => p.id === item.id) &&
                Number.isInteger(item.quantity) &&
                item.quantity > 0
            )
            .map(item => ({
                id: item.id,
                quantity: Math.min(item.quantity, 99)
            }));

    } catch (error) {
        return [];
    }
}

let cart = loadCart();


/* 3. UTILITY FUNCTIONS */

// Format money into Kenya Shillings.

function formatMoney(amount) {
    return new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency: "KES",
        maximumFractionDigits: 0
    }).format(amount);
}

// Find a product using its ID.

function findProduct(id) {
    return products.find(product => product.id === Number(id));
}

// Save shopping cart.

function saveCart() {
    localStorage.setItem(
        "ministore_cart",
        JSON.stringify(cart)
    );
}

// Calculate total cart quantity.

function getCartCount() {
    return cart.reduce(
        (total, item) => total + item.quantity,
        0
    );
}

// Calculate total shopping cost.

function getCartTotal() {
    return cart.reduce((total, item) => {
        const product = findProduct(item.id);

        return total + (
            product ? product.price * item.quantity : 0
        );
    }, 0);
}


/* 4. DISPLAY PRODUCTS */

// Reusable function to display products.

function renderProducts(productList = products) {

    const grid = document.getElementById("product-grid");

    document.getElementById("product-total").textContent =
        `${productList.length} products available`;

    document.getElementById("no-products")
        .classList.toggle("hidden", productList.length > 0);

    grid.innerHTML = productList.map(product => `

        <article class="product-card">

            <img
                class="product-image"
                src="${product.image}"
                alt="${product.name}"
                loading="lazy"
                onerror="this.src='https://placehold.co/600x400?text=Product'"
                onclick="showProductDetails(${product.id})"
            >

            <div class="product-info">

                <span class="category-label">
                    ${product.category}
                </span>

                <h3>${product.name}</h3>

                <p>${product.description}</p>

                <div class="product-price">
                    ${formatMoney(product.price)}
                </div>

                <div class="product-actions">

                    <button
                        class="view-btn"
                        onclick="showProductDetails(${product.id})">
                        View Details
                    </button>

                    <button
                        class="add-btn"
                        onclick="addToCart(${product.id})">
                        Add to Cart
                    </button>

                </div>

            </div>

        </article>

    `).join("");
}


/* 5. SEARCH AND CATEGORY FILTER */

// Filter products by name, description and category.

function filterProducts() {

    const search = document.getElementById("search-input")
        .value.trim().toLowerCase();

    const category = document.getElementById("category-filter")
        .value;

    const filtered = products.filter(product => {

        const matchesSearch =
            product.name.toLowerCase().includes(search) ||
            product.description.toLowerCase().includes(search) ||
            product.category.toLowerCase().includes(search);

        const matchesCategory =
            category === "All" ||
            product.category === category;

        return matchesSearch && matchesCategory;
    });

    renderProducts(filtered);
}

document.getElementById("search-input")
    .addEventListener("input", filterProducts);

document.getElementById("category-filter")
    .addEventListener("change", filterProducts);


/* 6. PRODUCT DETAILS */

function showProductDetails(id) {

    const product = findProduct(id);

    if (!product) return;

    document.getElementById("product-details").innerHTML = `

        <div class="detail-layout">

            <img src="${product.image}"
                 alt="${product.name}"
                 onerror="this.src='https://placehold.co/600x400?text=Product'">

            <div>

                <span class="category-label">
                    ${product.category}
                </span>

                <h2>${product.name}</h2>

                <h3 class="product-price">
                    ${formatMoney(product.price)}
                </h3>

                <p>${product.description}</p>

                <br>

                <button class="primary-btn"
                    onclick="addToCart(${product.id}); closeProductDetails()">
                    Add to Cart
                </button>

            </div>

        </div>

    `;

    document.getElementById("product-modal")
        .classList.remove("hidden");
}

function closeProductDetails() {
    document.getElementById("product-modal")
        .classList.add("hidden");
}


/* 7. ADD PRODUCTS TO CART */

function addToCart(id) {

    const product = findProduct(id);

    if (!product) return;

    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {

        if (existingItem.quantity >= 99) {
            alert("Maximum quantity reached.");
            return;
        }

        existingItem.quantity++;

    } else {

        cart.push({
            id: id,
            quantity: 1
        });

    }

    updateCart();

    alert(product.name + " added to your shopping cart!");
}


/* 8. UPDATE SHOPPING CART */

function updateCart() {

    saveCart();

    // Update cart badge.

    document.getElementById("cart-count").textContent =
        getCartCount();

    // Update cart items.

    const container = document.getElementById("cart-items");

    if (cart.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                <h3>Your cart is empty</h3>
                <p>Add products to begin shopping.</p>
            </div>
        `;

    } else {

        container.innerHTML = cart.map(item => {

            const product = findProduct(item.id);

            if (!product) return "";

            return `

                <div class="cart-item">

                    <img src="${product.image}"
                         alt="${product.name}"
                         onerror="this.src='https://placehold.co/100x100?text=Product'">

                    <div>

                        <h4>${product.name}</h4>

                        <p>${formatMoney(product.price)}</p>

                        <div class="quantity-controls">

                            <button onclick="changeQuantity(${product.id}, -1)">
                                -
                            </button>

                            <span>${item.quantity}</span>

                            <button onclick="changeQuantity(${product.id}, 1)">
                                +
                            </button>

                            <button class="remove-btn"
                                onclick="removeFromCart(${product.id})">
                                Remove
                            </button>

                        </div>

                    </div>

                </div>

            `;

        }).join("");

    }

    document.getElementById("cart-subtotal").textContent =
        formatMoney(getCartTotal());

}


/* 9. CHANGE PRODUCT QUANTITY */

function changeQuantity(id, change) {

    const item = cart.find(item => item.id === id);

    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {

        cart = cart.filter(item => item.id !== id);

    } else if (item.quantity > 99) {

        item.quantity = 99;
        alert("Maximum quantity is 99.");

    }

    updateCart();
}


/* 10. REMOVE PRODUCT FROM CART */

function removeFromCart(id) {

    cart = cart.filter(item => item.id !== id);

    updateCart();

}


/* 11. CART SIDEBAR NAVIGATION */

function openCart() {

    document.getElementById("cart-sidebar")
        .classList.add("active");

    document.getElementById("cart-overlay")
        .classList.remove("hidden");
}

function closeCart() {

    document.getElementById("cart-sidebar")
        .classList.remove("active");

    document.getElementById("cart-overlay")
        .classList.add("hidden");
}


/* 12. CHECKOUT NAVIGATION */

function goToCheckout() {

    if (cart.length === 0) {
        alert("Your shopping cart is empty!");
        return;
    }

    closeCart();

    document.getElementById("home-page")
        .classList.add("hidden");

    document.getElementById("checkout-page")
        .classList.remove("hidden");

    document.getElementById("success-page")
        .classList.add("hidden");

    renderCheckoutSummary();

    window.scrollTo(0, 0);
}


/* 13. CHECKOUT ORDER SUMMARY */

function renderCheckoutSummary() {

    const container = document.getElementById("checkout-items");

    container.innerHTML = cart.map(item => {

        const product = findProduct(item.id);

        if (!product) return "";

        return `

            <div class="summary-item">

                <span>
                    ${product.name} × ${item.quantity}
                </span>

                <strong>
                    ${formatMoney(product.price * item.quantity)}
                </strong>

            </div>

        `;

    }).join("");

    const total = getCartTotal();

    document.getElementById("checkout-subtotal")
        .textContent = formatMoney(total);

    document.getElementById("checkout-total")
        .textContent = formatMoney(total);
}


/* 14. PROCESS CUSTOMER ORDER */

document.getElementById("checkout-form")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        // Confirm that the cart has products.

        if (cart.length === 0) {
            alert("Your shopping cart is empty.");
            showHome();
            return;
        }

        // Collect customer details.

        const customer = {
            name: document.getElementById("customer-name")
                .value.trim(),

            email: document.getElementById("customer-email")
                .value.trim(),

            phone: document.getElementById("customer-phone")
                .value.trim(),

            address: document.getElementById("customer-address")
                .value.trim(),

            city: document.getElementById("customer-city")
                .value.trim(),

            payment: document.getElementById("payment-method")
                .value
        };

        // Additional validation.

        if (
            !customer.name ||
            !customer.email ||
            !customer.phone ||
            !customer.address ||
            !customer.city
        ) {
            alert("Please complete all required fields.");
            return;
        }

        // Capture the order before clearing the cart.

        const order = {
            orderNumber: "MS-" + Date.now(),
            customer: customer,
            items: cart.map(item => ({
                product: findProduct(item.id).name,
                quantity: item.quantity,
                price: findProduct(item.id).price
            })),
            total: getCartTotal(),
            date: new Date().toISOString()
        };

        // Save demo order history.

        let orders = [];

        try {
            orders = JSON.parse(
                localStorage.getItem("ministore_orders")
            ) || [];

            if (!Array.isArray(orders)) orders = [];

        } catch (error) {
            orders = [];
        }

        orders.push(order);

        localStorage.setItem(
            "ministore_orders",
            JSON.stringify(orders)
        );

        // Display confirmation.

        document.getElementById("order-number")
            .textContent = order.orderNumber;

        document.getElementById("confirmed-customer")
            .textContent = customer.name;

        document.getElementById("confirmed-total")
            .textContent = formatMoney(order.total);

        document.getElementById("confirmed-payment")
            .textContent = customer.payment;

        // Clear cart after successful order recording.

        cart = [];

        updateCart();

        // Reset checkout form.

        document.getElementById("checkout-form").reset();

        // Navigate to confirmation.

        document.getElementById("checkout-page")
            .classList.add("hidden");

        document.getElementById("home-page")
            .classList.add("hidden");

        document.getElementById("success-page")
            .classList.remove("hidden");

        window.scrollTo(0, 0);

    });


/* 15. HOMEPAGE NAVIGATION */

function showHome() {

    document.getElementById("home-page")
        .classList.remove("hidden");

    document.getElementById("checkout-page")
        .classList.add("hidden");

    document.getElementById("success-page")
        .classList.add("hidden");

    closeCart();
    closeProductDetails();

    window.scrollTo(0, 0);
}

function scrollToProducts() {

    document.getElementById("products")
        .scrollIntoView({
            behavior: "smooth"
        });

}


/* 16. INITIALISE APPLICATION */

function initialiseApp() {

    renderProducts();

    updateCart();

    showHome();

}

// Start the application when the page loads.

document.addEventListener("DOMContentLoaded", initialiseApp);
