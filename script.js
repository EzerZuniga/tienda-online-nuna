// nuna.js - JavaScript extraído de nuna.html

// ===========================
// CONFIGURATION & DATA
// ===========================

const CONFIG = {
    currency: 'S/',
    freeShippingThreshold: 0,
    animationDuration: 400,
    toastDuration: 3500,
};

const PRODUCTS = [
    {
        id: 'chaleco-alpaca',
        name: 'Chaleco de Alpaca Premium',
        description: 'Chaleco tejido a mano con fibra de alpaca baby (18-22 micrones). Suave como la seda, abrigador como ninguno, elegante para cualquier ocasión. Certificado de origen y trazabilidad completa.',
        price: 380,
        image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=85',
        badge: 'Alpaca Baby',
        badgeClass: 'badge-gold'
    },
    {
        id: 'manta-andina',
        name: 'Manta Ceremonial Tocapu',
        description: 'Manta tradicional con diseños Tocapu ancestrales, cada símbolo cuenta una historia. Perfecta para decoración de interiores o como pieza de abrigo ceremonial. Diseño registrado.',
        price: 420,
        image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&q=85',
        badge: 'Textil Ancestral',
        badgeClass: 'badge-primary'
    },
    {
        id: 'audifonos-premium',
        name: 'Audífonos Inalámbricos Pro',
        description: 'Alta fidelidad con cancelación de ruido activa. Batería de 40 horas, construcción en aluminio reciclado. Garantía de 3 años y soporte técnico especializado.',
        price: 580,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=85',
        badge: 'Tech Sostenible',
        badgeClass: 'badge-secondary'
    },
    {
        id: 'cafe-altura',
        name: 'Café Orgánico de Altura',
        description: 'Café 100% arábica cultivado a más de 1,800 msnm en Chanchamayo. Notas de chocolate oscuro y frutos rojos. Comercio justo certificado, tostado artesanal en pequeños lotes.',
        price: 75,
        image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=85',
        badge: 'Gourmet',
        badgeClass: 'badge-primary'
    },
    {
        id: 'poncho-tradicional',
        name: 'Poncho Tradicional Premium',
        description: 'Poncho artesanal con diseños geométricos tradicionales de Cusco. Tejido en telar de cintura, técnica de más de 3,000 años. Pieza única, no hay dos iguales.',
        price: 650,
        image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=85',
        badge: 'Pieza Única',
        badgeClass: 'badge-gold'
    },
    {
        id: 'chocolate-organico',
        name: 'Chocolate Artesanal 75%',
        description: 'Chocolate de origen único de cacao chuncho nativo del Cusco. 75% cacao puro, sin lecitina ni aditivos. Premiado internacionalmente, producción limitada.',
        price: 55,
        image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=800&q=85',
        badge: 'Cacao Nativo',
        badgeClass: 'badge-primary'
    },
    {
        id: 'bufanda-alpaca',
        name: 'Bufanda de Alpaca Multicolor',
        description: 'Bufanda tejida con la técnica de "pallay" (diseño en el tejido). Colores naturales de alpaca: blanco, beige, marrón y negro. Extraordinariamente suave y liviana.',
        price: 180,
        image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800&q=85',
        badge: 'Colores Naturales',
        badgeClass: 'badge-gold'
    },
    {
        id: 'quinua-real',
        name: 'Quinua Real Orgánica',
        description: 'Quinua real del altiplano boliviano-peruano. Grano grande, proteína completa, certificación orgánica. Comercio directo con comunidades productoras.',
        price: 45,
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=85',
        badge: 'Superalimento',
        badgeClass: 'badge-secondary'
    }
];

// ===========================
// STATE MANAGEMENT
// ===========================

const State = {
    cart: [],
    addToCart(product) {
        const existingItem = this.cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({ ...product, quantity: 1 });
        }
        this.saveCart();
        return existingItem ? existingItem : this.cart[this.cart.length - 1];
    },
    removeFromCart(productId) {
        const index = this.cart.findIndex(item => item.id === productId);
        if (index > -1) {
            const removed = this.cart.splice(index, 1)[0];
            this.saveCart();
            return removed;
        }
        return null;
    },
    updateQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                return this.removeFromCart(productId);
            }
            item.quantity = quantity;
            this.saveCart();
            return item;
        }
        return null;
    },
    getTotal() {
        return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
    getItemCount() {
        return this.cart.reduce((sum, item) => sum + item.quantity, 0);
    },
    clearCart() {
        this.cart = [];
        this.saveCart();
    },
    saveCart() {
        try {
            localStorage.setItem('nuna_cart', JSON.stringify(this.cart));
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    },
    loadCart() {
        try {
            const saved = localStorage.getItem('nuna_cart');
            if (saved) {
                this.cart = JSON.parse(saved);
            }
        } catch (error) {
            console.error('Error loading cart:', error);
            this.cart = [];
        }
    }
};

// ===========================
// UTILITIES
// ===========================

const Utils = {
    formatPrice(price) {
        return `${CONFIG.currency} ${price.toFixed(0)}`;
    },
    scrollToSection(sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            const headerHeight = 96; // Height of fixed header
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    },
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// ===========================
// UI COMPONENTS
// ===========================

const ProductCard = {
    render(product) {
        return `
            <article class="product-card">
                <div class="product-image-wrapper">
                    <img 
                        src="${Utils.escapeHtml(product.image)}" 
                        alt="${Utils.escapeHtml(product.name)}"
                        class="product-image"
                        loading="lazy">
                    <div class="product-badge">
                        <span class="badge ${product.badgeClass}">${Utils.escapeHtml(product.badge)}</span>
                    </div>
                </div>
                <div class="product-content">
                    <h3 class="product-title font-display">${Utils.escapeHtml(product.name)}</h3>
                    <p class="product-description">${Utils.escapeHtml(product.description)}</p>
                    <div class="product-footer">
                        <div>
                            <span class="product-price">
                                <span class="product-price-currency">${CONFIG.currency}</span>
                                ${product.price}
                            </span>
                        </div>
                        <button 
                            data-add-to-cart="${product.id}"
                            class="btn btn-primary"
                            style="padding: 0.75rem 1.5rem; font-size: 0.875rem;">
                            Agregar
                        </button>
                    </div>
                </div>
            </article>
        `;
    },
    addToCart(productId) {
        const product = PRODUCTS.find(p => p.id === productId);
        if (!product) {
            console.error('Product not found:', productId);
            return;
        }
        State.addToCart(product);
        CartManager.update();
        Notifications.show(`${product.name} agregado al carrito`);
    }
};

const CartManager = {
    toggle() {
        const modal = document.getElementById('cart-modal');
        const isHidden = modal.classList.contains('hidden');
        if (isHidden) {
            this.open();
        } else {
            this.close();
        }
    },
    open() {
        const modal = document.getElementById('cart-modal');
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        this.render();
    },
    close() {
        const modal = document.getElementById('cart-modal');
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    },
    update() {
        this.updateBadges();
        if (!document.getElementById('cart-modal').classList.contains('hidden')) {
            this.render();
        }
    },
    updateBadges() {
        const count = State.getItemCount();
        const badges = [
            document.getElementById('cart-count-badge'),
            document.getElementById('mobile-cart-count')
        ];
        badges.forEach(badge => {
            if (badge) {
                badge.textContent = count;
                if (count > 0) {
                    badge.classList.remove('hidden');
                } else {
                    badge.classList.add('hidden');
                }
            }
        });
    },
    render() {
        const container = document.getElementById('cart-items-container');
        const footer = document.getElementById('cart-footer');
        if (State.cart.length === 0) {
            container.innerHTML = `
                <div class="cart-empty">
                    <div class="cart-empty-icon">
                        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <circle cx="9" cy="21" r="1"/>
                            <circle cx="20" cy="21" r="1"/>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                        </svg>
                    </div>
                    <h3 class="font-display text-2xl font-semibold mb-2">Tu carrito está vacío</h3>
                    <p class="text-gray-600 mb-6">Explora nuestra colección y encuentra algo especial</p>
                    <button onclick="CartManager.close(); Utils.scrollToSection('catalog')" class="btn btn-primary">
                        Ver Productos
                    </button>
                </div>
            `;
            footer.classList.add('hidden');
            return;
        }
        container.innerHTML = `
            <div class="space-y-4">
                ${State.cart.map(item => `
                    <div class="cart-item">
                        <img 
                            src="${Utils.escapeHtml(item.image)}" 
                            alt="${Utils.escapeHtml(item.name)}"
                            class="cart-item-image">
                        <div class="flex-1 min-w-0">
                            <h4 class="font-semibold mb-1 truncate">${Utils.escapeHtml(item.name)}</h4>
                            <p class="text-sm mb-2" style="color: var(--oro-inca);">
                                ${Utils.formatPrice(item.price)}
                            </p>
                            <div class="flex items-center gap-2">
                                <button 
                                    onclick="CartManager.changeQuantity('${item.id}', ${item.quantity - 1})"
                                    class="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 transition"
                                    aria-label="Decrease quantity">
                                    <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M5 12h14"/>
                                    </svg>
                                </button>
                                <span class="w-12 text-center font-medium">${item.quantity}</span>
                                <button 
                                    onclick="CartManager.changeQuantity('${item.id}', ${item.quantity + 1})"
                                    class="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 transition"
                                    aria-label="Increase quantity">
                                    <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M12 5v14M5 12h14"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <button 
                            onclick="CartManager.removeItem('${item.id}')"
                            class="p-2 text-red-500 hover:bg-red-50 rounded-full transition self-start"
                            aria-label="Remove item">
                            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M18 6L6 18M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                `).join('')}
            </div>
        `;
        const total = State.getTotal();
        document.getElementById('cart-subtotal').textContent = Utils.formatPrice(total);
        document.getElementById('cart-total').textContent = Utils.formatPrice(total);
        footer.classList.remove('hidden');
    },
    changeQuantity(productId, newQuantity) {
        State.updateQuantity(productId, newQuantity);
        this.update();
    },
    removeItem(productId) {
        const removed = State.removeFromCart(productId);
        if (removed) {
            Notifications.show(`${removed.name} eliminado del carrito`);
        }
        this.update();
    },
    checkout() {
        if (State.cart.length === 0) {
            Notifications.show('Tu carrito está vacío');
            return;
        }
        const total = State.getTotal();
        const itemCount = State.getItemCount();
        alert(`¡Gracias por tu compra!\n\nTotal: ${Utils.formatPrice(total)}\nProductos: ${itemCount}\n\nEn una implementación real, aquí se procesaría el pago.`);
        State.clearCart();
        this.update();
        this.close();
    }
};

const Notifications = {
    show(message) {
        const toast = document.getElementById('notification-toast');
        const messageEl = document.getElementById('notification-message');
        messageEl.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, CONFIG.toastDuration);
    }
};

const MobileMenu = {
    toggle() {
        const menu = document.getElementById('mobile-menu');
        const button = document.getElementById('mobile-menu-button');
        const isHidden = menu.classList.contains('hidden');
        menu.classList.toggle('hidden');
        button.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
    },
    close() {
        const menu = document.getElementById('mobile-menu');
        const button = document.getElementById('mobile-menu-button');
        menu.classList.add('hidden');
        button.setAttribute('aria-expanded', 'false');
    }
};

// ===========================
// INITIALIZATION
// ===========================

function initializeApp() {
    // Load cart from localStorage
    State.loadCart();
    // Render products
    const productGrid = document.getElementById('product-grid');
    if (productGrid) {
        productGrid.innerHTML = PRODUCTS.map(product => ProductCard.render(product)).join('');
        // Delegated click handler for add-to-cart buttons
        productGrid.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-add-to-cart]');
            if (!btn) return;
            const id = btn.getAttribute('data-add-to-cart');
            if (id) {
                ProductCard.addToCart(id);
            }
        });
    }
    // Update cart badges
    CartManager.updateBadges();
    // Scroll progress indicator
    window.addEventListener('scroll', Utils.debounce(() => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        document.getElementById('scroll-progress').style.width = scrolled + '%';
    }, 10));
    // Header scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.site-header');
        const currentScroll = window.pageYOffset;
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    });
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const targetId = href.substring(1);
                Utils.scrollToSection(targetId);
            }
        });
    });
    // Keyboard navigation for cart
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const cartModal = document.getElementById('cart-modal');
            if (!cartModal.classList.contains('hidden')) {
                CartManager.close();
            }
            const mobileMenu = document.getElementById('mobile-menu');
            if (!mobileMenu.classList.contains('hidden')) {
                MobileMenu.close();
            }
        }
    });
    console.log('✓ Nuna Store initialized successfully');
}
// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
