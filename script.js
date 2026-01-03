// Pizza Menu Data
const menuData = [
    {
        id: 1,
        name: 'Margherita',
        price: 12.99,
        category: 'vegetarian',
        description: 'Classic pizza with fresh mozzarella, basil, and tomato sauce',
        icon: '🍕'
    },
    {
        id: 2,
        name: 'Pepperoni',
        price: 14.99,
        category: 'non-veg',
        description: 'Loaded with pepperoni and mozzarella cheese',
        icon: '🍕'
    },
    {
        id: 3,
        name: 'Vegetarian Supreme',
        price: 13.99,
        category: 'vegetarian',
        description: 'Bell peppers, mushrooms, olives, onions, and tomatoes',
        icon: '🍕'
    },
    {
        id: 4,
        name: 'Meat Lovers',
        price: 16.99,
        category: 'non-veg',
        description: 'Pepperoni, sausage, ham, and beef with extra cheese',
        icon: '🍕'
    },
    {
        id: 5,
        name: 'Quattro Formaggi',
        price: 15.99,
        category: 'special',
        description: 'Four types of premium cheese blend',
        icon: '🍕'
    },
    {
        id: 6,
        name: 'BBQ Chicken',
        price: 14.99,
        category: 'non-veg',
        description: 'Grilled chicken, BBQ sauce, red onions, and cheddar',
        icon: '🍕'
    },
    {
        id: 7,
        name: 'Spinach & Feta',
        price: 13.49,
        category: 'vegetarian',
        description: 'Fresh spinach, feta cheese, and garlic',
        icon: '🍕'
    },
    {
        id: 8,
        name: 'Hawaiian',
        price: 14.49,
        category: 'special',
        description: 'Ham, pineapple, and mozzarella',
        icon: '🍕'
    },
    {
        id: 9,
        name: 'Buffalo Wings',
        price: 15.99,
        category: 'non-veg',
        description: 'Spicy buffalo chicken with ranch and onions',
        icon: '🍕'
    }
];

// Shopping Cart
let cart = [];
let currentFilter = 'all';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    displayMenu(menuData);
    loadCartFromStorage();
});

// Display Menu Items
function displayMenu(items) {
    const menuGrid = document.getElementById('menuGrid');
    menuGrid.innerHTML = '';

    items.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.innerHTML = `
            <div class="menu-item-image">
                ${item.icon}
            </div>
            <div class="menu-item-info">
                <span class="menu-item-category">${item.category.toUpperCase()}</span>
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <div class="menu-item-footer">
                    <span class="menu-item-price">$${item.price.toFixed(2)}</span>
                    <button class="add-to-cart-btn" onclick="addToCart(${item.id})">Add to Cart</button>
                </div>
            </div>
        `;
        menuGrid.appendChild(menuItem);
    });
}

// Filter Menu
function filterMenu(category) {
    currentFilter = category;
    
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Filter items
    let filtered = menuData;
    if (category !== 'all') {
        filtered = menuData.filter(item => item.category === category);
    }
    displayMenu(filtered);
}

// Add to Cart
function addToCart(itemId) {
    const item = menuData.find(p => p.id === itemId);
    const existingItem = cart.find(c => c.id === itemId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...item,
            quantity: 1
        });
    }

    saveCartToStorage();
    updateCart();
    showNotification(`${item.name} added to cart!`);
}

// Update Cart Display
function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartCount.textContent = '0';
        updateCartSummary();
        return;
    }

    cartItems.innerHTML = '';
    let totalItems = 0;

    cart.forEach(item => {
        totalItems += item.quantity;
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
            </div>
            <div class="quantity-control">
                <button class="quantity-btn" onclick="decreaseQuantity(${item.id})">−</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="increaseQuantity(${item.id})">+</button>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
        `;
        cartItems.appendChild(cartItem);
    });

    cartCount.textContent = totalItems;
    updateCartSummary();
}

// Increase Quantity
function increaseQuantity(itemId) {
    const item = cart.find(c => c.id === itemId);
    if (item) {
        item.quantity += 1;
        saveCartToStorage();
        updateCart();
    }
}

// Decrease Quantity
function decreaseQuantity(itemId) {
    const item = cart.find(c => c.id === itemId);
    if (item) {
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            removeFromCart(itemId);
            return;
        }
        saveCartToStorage();
        updateCart();
    }
}

// Remove from Cart
function removeFromCart(itemId) {
    cart = cart.filter(c => c.id !== itemId);
    saveCartToStorage();
    updateCart();
}

// Update Cart Summary
function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
    document.getElementById('checkoutTotal').textContent = `$${total.toFixed(2)}`;

    // Update order summary
    updateOrderSummary();
}

// Update Order Summary
function updateOrderSummary() {
    const orderSummary = document.getElementById('orderSummary');
    if (cart.length === 0) {
        orderSummary.innerHTML = '<p class="empty-cart">No items in cart</p>';
        return;
    }

    orderSummary.innerHTML = '';
    cart.forEach(item => {
        const summaryItem = document.createElement('div');
        summaryItem.className = 'summary-row';
        summaryItem.innerHTML = `
            <span>${item.quantity}x ${item.name}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        `;
        orderSummary.appendChild(summaryItem);
    });
}

// Toggle Cart Sidebar
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('overlay');
    cartSidebar.classList.toggle('open');
    overlay.classList.toggle('active');
}

// Proceed to Checkout
function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty. Add some pizzas first!');
        return;
    }
    openCheckoutModal();
}

// Open Checkout Modal
function openCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    const overlay = document.getElementById('overlay');
    
    // Close cart if open
    document.getElementById('cartSidebar').classList.remove('open');
    
    modal.classList.add('active');
    overlay.classList.add('active');
    updateOrderSummary();
}

// Close Checkout Modal
function closeCheckout() {
    document.getElementById('checkoutModal').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
}

// Submit Order
function submitOrder(event) {
    event.preventDefault();

    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    // Generate order number
    const orderNumber = '#' + Math.floor(100000 + Math.random() * 900000);

    // Get form data
    const formData = new FormData(event.target);
    
    // Log order (in real app, this would be sent to server)
    console.log('Order Details:', {
        orderNumber: orderNumber,
        items: cart,
        customer: {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            instructions: formData.get('instructions'),
            payment: formData.get('payment')
        },
        total: document.getElementById('checkoutTotal').textContent,
        timestamp: new Date().toLocaleString()
    });

    // Close checkout modal
    closeCheckout();

    // Show success message
    showSuccessMessage(orderNumber);

    // Reset cart
    setTimeout(() => {
        resetCart();
    }, 2000);
}

// Show Success Message
function showSuccessMessage(orderNumber) {
    document.getElementById('orderNumber').textContent = `Your order number is: ${orderNumber}`;
    document.getElementById('successModal').classList.add('active');
    document.getElementById('overlay').classList.add('active');
}

// Reset and Close
function resetAndClose() {
    document.getElementById('successModal').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
}

// Close All Modals
function closeAllModals() {
    document.getElementById('cartSidebar').classList.remove('open');
    document.getElementById('checkoutModal').classList.remove('active');
    document.getElementById('successModal').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
}

// Reset Cart
function resetCart() {
    cart = [];
    saveCartToStorage();
    updateCart();
    document.getElementById('orderForm').reset();
}

// Scroll to Menu
function scrollToMenu() {
    document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
}

// Local Storage
function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
}

// Notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${getComputedStyle(document.documentElement).getPropertyValue('--success-color')};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 999;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);

// Keyboard shortcut (Esc to close modals)
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeAllModals();
    }
});