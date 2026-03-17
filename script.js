// ==================== CONSTANTS ====================
const WHATSAPP_NUMBER = "919395045293"; // 

// ==================== STATE & DOM CACHE ====================
let cart = JSON.parse(localStorage.getItem('sanghamitraCart')) || [];

const DOM = {
    productsGrid:   document.getElementById('products-grid'),
    cartModal:      document.getElementById('cart-modal'),
    cartItems:      document.getElementById('cart-items'),
    cartTotal:      document.getElementById('cart-total'),
    cartCount:      document.getElementById('cart-count'),
    checkoutModal:  document.getElementById('checkout-modal'),
    checkoutForm:   document.getElementById('checkout-form'),
    checkoutName:   document.getElementById('checkout-name'),
    checkoutPhone:  document.getElementById('checkout-phone'),
    checkoutAddress:document.getElementById('checkout-address'),
    checkoutNameErr:document.getElementById('checkout-name-error'),
    checkoutPhoneErr:document.getElementById('checkout-phone-error'),
    checkoutAddrErr:document.getElementById('checkout-address-error'),
    submitOrderBtn: document.getElementById('submit-order-btn'),
};

// ==================== PRODUCT DATA ====================
const products = [
    { id: 1, name: "Fresh Cow Milk",    price: 60,  unit: "litre", img: "https://iili.io/qWUBRII.md.png", desc: "Pure, unadulterated milk collected daily" },
    { id: 2, name: "Traditional Desi Ghee", price: 650, unit: "kg", img: "https://iili.io/qWS5Dtj.md.jpg",  desc: "Hand-churned A2 ghee" },
    { id: 3, name: "Fresh Paneer",      price: 420, unit: "kg", img: "https://iili.io/qWS5vus.md.jpg", desc: "Soft, creamy homemade paneer" },
    { id: 4, name: "Natural Curd",      price: 120, unit: "kg", img: "https://iili.io/qWS5Dtj.md.jpg", desc: "Thick probiotic-rich curd" },
];

// ==================== CART HELPERS ====================
function saveCart() {
    localStorage.setItem('sanghamitraCart', JSON.stringify(cart));
}

function updateCartCount() {
    if (DOM.cartCount) {
        DOM.cartCount.textContent = cart.reduce((sum, item) => sum + (item.qty || 0), 0);
    }
}

function getCartItem(id) {
    return cart.find(item => item.id === id);
}

function getCartQty(id) {
    const item = getCartItem(id);
    return item ? item.qty : 0;
}

// ==================== RENDER PRODUCTS ====================
function renderProducts() {
    if (!DOM.productsGrid) return;

    DOM.productsGrid.innerHTML = products.map(p => {
        const qty = getCartQty(p.id);

        let controlHtml = '';

        if (qty <= 0) {
            controlHtml = `
                <button onclick="addToCart(${p.id})" 
                        style="background: rgba(0,173,239,1);"
                        onmouseover="this.style.background='rgba(0,140,200,1)'"
                        onmouseout="this.style.background='rgba(0,173,239,1)'"
                        class="mt-6 w-full text-white py-4 rounded-2xl font-medium flex items-center justify-center gap-2 transition duration-200">
                    <i class="fa-solid fa-cart-plus"></i> ADD TO CART
                </button>
            `;
        } else {
            controlHtml = `
                <div class="mt-6 w-full flex items-center justify-between rounded-2xl overflow-hidden shadow-sm"
                     style="background: rgba(0,173,239,0.1); border: 1px solid rgba(0,173,239,0.35);">
                    <button onclick="changeQtyById(${p.id}, -1)" 
                            style="color: rgba(0,120,180,1);"
                            onmouseover="this.style.background='rgba(0,173,239,0.2)'"
                            onmouseout="this.style.background='transparent'"
                            class="w-12 h-12 flex items-center justify-center transition duration-150 font-bold text-xl">
                        −
                    </button>
                    <span class="font-semibold text-lg min-w-[40px] text-center" style="color: rgba(0,100,160,1);">
                        ${qty}
                    </span>
                    <button onclick="changeQtyById(${p.id}, 1)" 
                            style="color: rgba(0,120,180,1);"
                            onmouseover="this.style.background='rgba(0,173,239,0.2)'"
                            onmouseout="this.style.background='transparent'"
                            class="w-12 h-12 flex items-center justify-center transition duration-150 font-bold text-xl">
                        +
                    </button>
                </div>
            `;
        }

        return `
            <div class="rounded-3xl overflow-hidden card-hover shadow-md" style="background: rgba(0,173,239,0.07);">
                <img src="${p.img}" alt="${p.name}" class="w-full h-56 object-cover">
                <div class="p-6">
                    <h3 class="text-2xl font-semibold text-gray-800">${p.name}</h3>
                    <p class="font-medium mt-1" style="color: rgba(0,140,200,1);">₹ ${p.price} / ${p.unit}</p>
                    <p class="mt-3 text-sm text-gray-600">${p.desc}</p>
                    ${controlHtml}
                </div>
            </div>
        `;
    }).join('');
}

// ==================== CHANGE QUANTITY FROM PRODUCT CARD ====================
function changeQtyById(id, delta) {
    let itemIndex = cart.findIndex(item => item.id === id);

    if (itemIndex === -1 && delta > 0) {
        const product = products.find(p => p.id === id);
        if (product) {
            cart.push({ ...product, qty: 1 });
            itemIndex = cart.length - 1;
        } else {
            return;
        }
    }

    if (itemIndex !== -1) {
        const newQty = cart[itemIndex].qty + delta;
        if (newQty <= 0) {
            cart.splice(itemIndex, 1);
        } else {
            cart[itemIndex].qty = newQty;
        }
    }

    saveCart();
    updateCartCount();
    renderCart();
    renderProducts();
}

// ==================== ADD TO CART ====================
function addToCart(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const existingIndex = cart.findIndex(item => item.id === id);

    if (existingIndex !== -1) {
        cart[existingIndex].qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    saveCart();
    updateCartCount();
    renderCart();
    renderProducts();

    // Toast feedback
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-8 left-1/2 -translate-x-1/2 text-white px-6 py-3 rounded-2xl shadow-2xl z-[9999]';
    toast.style.background = 'rgba(0,140,200,1)';
    toast.textContent = `${product.name} added!`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2200);
}

// ==================== CART RENDER ====================
function renderCart() {
    if (!DOM.cartItems) return;

    if (cart.length === 0) {
        DOM.cartItems.innerHTML = `<p class="text-center text-gray-500 py-12">Your cart is empty<br>Start adding fresh dairy!</p>`;
        DOM.cartTotal.textContent = '₹ 0';
        return;
    }

    let html = '';
    let total = 0;

    cart.forEach((item, i) => {
        const itemTotal = item.price * item.qty;
        total += itemTotal;
        html += `
            <div class="flex gap-4 border-b pb-6 last:border-b-0">
                <img src="${item.img}" alt="${item.name}" class="w-20 h-20 object-cover rounded-2xl">
                <div class="flex-1">
                    <div class="flex justify-between items-start">
                        <div>
                            <h4 class="font-medium">${item.name}</h4>
                            <p class="text-xs text-gray-500">₹ ${item.price} × ${item.qty} ${item.unit}</p>
                        </div>
                        <button onclick="removeFromCart(${i})" class="text-red-600 hover:text-red-800 text-xl">×</button>
                    </div>
                    <div class="flex items-center gap-3 mt-3">
                        <button onclick="changeQty(${i}, -1)" class="w-9 h-9 border rounded-lg hover:bg-gray-100">-</button>
                        <span class="font-semibold w-8 text-center">${item.qty}</span>
                        <button onclick="changeQty(${i}, 1)"  class="w-9 h-9 border rounded-lg hover:bg-gray-100">+</button>
                    </div>
                </div>
                <div class="font-medium text-right">₹ ${itemTotal}</div>
            </div>
        `;
    });

    DOM.cartItems.innerHTML = html;
    DOM.cartTotal.textContent = `₹ ${total}`;
}

function changeQty(index, delta) {
    if (!cart[index]) return;
    cart[index].qty = Math.max(1, cart[index].qty + delta);
    saveCart();
    renderCart();
    updateCartCount();
    renderProducts();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    renderCart();
    updateCartCount();
    renderProducts();
}

// ==================== MODAL CONTROLS ====================
function toggleCart() {
    DOM.cartModal.classList.toggle('hidden');
    if (!DOM.cartModal.classList.contains('hidden')) renderCart();
}

function openCheckoutModal() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    DOM.checkoutModal.classList.remove('hidden');
    DOM.checkoutName?.focus();
}

function closeCheckoutModal() {
    DOM.checkoutModal.classList.add('hidden');
    [DOM.checkoutNameErr, DOM.checkoutPhoneErr, DOM.checkoutAddrErr].forEach(el => el?.classList.add('hidden'));
}

function checkoutViaWhatsApp() {
    openCheckoutModal();
}

// ==================== WHATSAPP ORDER ====================
function sendOrderToWhatsApp(e) {
    e.preventDefault();

    const name    = DOM.checkoutName?.value.trim() || '';
    const phone   = DOM.checkoutPhone?.value.trim() || '';
    const address = DOM.checkoutAddress?.value.trim() || '';

    let valid = true;
    [DOM.checkoutNameErr, DOM.checkoutPhoneErr, DOM.checkoutAddrErr].forEach(el => el?.classList.add('hidden'));

    const nameRegex = /^[a-zA-Z\u0900-\u097F]+([\s][a-zA-Z\u0900-\u097F]+)+$/;

if (name.length < 5 || !nameRegex.test(name)) {
    DOM.checkoutNameErr.textContent = "Please enter your full name (with letters only)";
    DOM.checkoutNameErr.classList.remove('hidden');
    valid = false;
}

    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 10 || phoneDigits.length > 12) {
        DOM.checkoutPhoneErr.textContent = "Enter valid 10-digit number";
        DOM.checkoutPhoneErr.classList.remove('hidden');
        valid = false;
    }

    if (address.length < 15) {
        DOM.checkoutAddrErr.textContent = "Please provide complete address with pincode";
        DOM.checkoutAddrErr.classList.remove('hidden');
        valid = false;
    }

    if (!valid) return;

    let message = `🛒 *Sanghamitra Order*\n\n`;
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.qty;
        message += `• ${item.name} × ${item.qty} ${item.unit} = ₹ ${itemTotal}\n`;
        total += itemTotal;
    });

    message += `\n*Total:* ₹ ${total}\n\n`;
    message += `*Customer Details:*\nName: ${name}\nPhone: ${phone}\nAddress:\n${address}\n\n`;
    message += `Please confirm order & suggest delivery slot 🙏`;

    const encoded = encodeURIComponent(message);

    if (DOM.submitOrderBtn) {
        DOM.submitOrderBtn.classList.add('loading');
        DOM.submitOrderBtn.disabled = true;
        DOM.submitOrderBtn.innerHTML = '<i class="fa-brands fa-whatsapp text-2xl"></i> Opening WhatsApp...';
    }

    setTimeout(() => {
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, '_blank');

        setTimeout(() => {
            if (DOM.submitOrderBtn) {
                DOM.submitOrderBtn.classList.remove('loading');
                DOM.submitOrderBtn.disabled = false;
                DOM.submitOrderBtn.innerHTML = '<i class="fa-brands fa-whatsapp text-2xl"></i> Send Order on WhatsApp';
            }

            closeCheckoutModal();

            // Success toast
            const toast = document.createElement('div');
            toast.className = 'fixed bottom-8 left-1/2 -translate-x-1/2 text-white px-8 py-4 rounded-2xl shadow-2xl text-center z-[9999]';
            toast.style.background = 'rgba(0,140,200,1)';
            toast.innerHTML = 'Order sent!<br>We will confirm shortly on WhatsApp';
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 4500);
        }, 600);
    }, 300);
}

// ==================== INIT & EVENT LISTENERS ====================
window.addEventListener('load', () => {
    renderProducts();
    updateCartCount();

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            if (anchor.getAttribute('href') !== '#') {
                e.preventDefault();
                document.querySelector(anchor.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    if (DOM.cartModal) {
        DOM.cartModal.addEventListener('click', e => {
            if (e.target === DOM.cartModal) toggleCart();
        });
    }

    if (DOM.checkoutForm) {
        DOM.checkoutForm.addEventListener('submit', sendOrderToWhatsApp);
    }

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            if (!DOM.checkoutModal?.classList.contains('hidden')) closeCheckoutModal();
            else if (!DOM.cartModal?.classList.contains('hidden')) toggleCart();
        }
    });
});

function toggleMobileMenu() {
    document.getElementById('mobileMenu')?.classList.toggle('hidden');
}