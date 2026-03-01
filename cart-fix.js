/**
 * Cart Fix - Ensures cart functionality works properly
 * This script fixes issues with the cart and ensures items are displayed correctly
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Cart fix script loaded');
    
    // Check if we're on the cart page
    if (window.location.href.includes('cart.html')) {
        console.log('On cart page - applying fixes');
        
        // Load cart from localStorage
        const cart = JSON.parse(localStorage.getItem('freshBasketCart')) || [];
        console.log('Current cart contents:', cart);
        
        // Fix cart display issues
        fixCartDisplay();
    }
});

function fixCartDisplay() {
    // Add a small delay to ensure other scripts have loaded first
    setTimeout(() => {
        const cartItemsContainer = document.getElementById('cart-items');
        const cart = JSON.parse(localStorage.getItem('freshBasketCart')) || [];
        const emptyCartMessage = document.querySelector('.empty-cart-message');
        
        console.log(`Fixing cart display - ${cart.length} items in cart`);
        
        // Force refresh cart display if we have items but they're not showing
        if (cart.length > 0 && emptyCartMessage && emptyCartMessage.style.display !== 'none') {
            console.log('Cart has items but empty message is still showing - fixing display');
            
            // Hide empty cart message
            emptyCartMessage.style.display = 'none';
            
            // Clear existing items
            cartItemsContainer.innerHTML = '';
            
            // Add each cart item manually
            let subtotal = 0;
            
            cart.forEach((item, index) => {
                const itemTotal = item.price * item.quantity;
                subtotal += itemTotal;
                
                console.log(`Adding item to cart display: ${item.name}, quantity: ${item.quantity}, price: ${item.price}`);
                
                const cartItemElement = document.createElement('div');
                cartItemElement.className = 'py-6 flex flex-row items-start gap-4';
                cartItemElement.innerHTML = `
                    <div class="w-1/5">
                        <img src="${item.image}" alt="${item.name}" class="w-24 h-24 object-cover rounded-lg mx-auto">
                    </div>
                    <div class="w-3/5 text-left">
                        <h3 class="text-lg font-semibold text-gray-800">${item.name}</h3>
                        <p class="text-sm text-gray-600">${item.category} | ${item.brand || 'Unknown'}</p>
                        <p class="text-green-700 font-medium">₹${item.price}</p>
                        <div class="flex items-center justify-start mt-2">
                            <button class="quantity-btn px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-l" data-action="decrease" data-index="${index}">-</button>
                            <input type="number" value="${item.quantity}" class="quantity-input w-12 text-center border-t border-b border-gray-200 py-1" data-index="${index}" min="1">
                            <button class="quantity-btn px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-r" data-action="increase" data-index="${index}">+</button>
                        </div>
                    </div>
                    <div class="w-1/5 flex flex-col items-end gap-4">
                        <span class="font-semibold text-lg">₹${itemTotal.toFixed(2)}</span>
                        <button class="text-red-500 hover:text-red-700 remove-item" data-index="${index}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                
                cartItemsContainer.appendChild(cartItemElement);
            });
            
            // Update order summary
            if (typeof updateOrderSummary === 'function') {
                updateOrderSummary(subtotal);
            }
            
            // Enable checkout button
            const checkoutBtn = document.getElementById('checkout-btn');
            if (checkoutBtn) {
                checkoutBtn.disabled = false;
            }
            
            // Setup quantity buttons
            if (typeof setupQuantityButtons === 'function') {
                setupQuantityButtons();
            }
            
            // Setup remove buttons
            if (typeof setupRemoveButtons === 'function') {
                setupRemoveButtons();
            }
        }
    }, 500);
}
