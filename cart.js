/**
 * FreshBasket Shopping Cart Functionality
 * Handles adding products to cart, updating cart count, and managing cart items
 */

// Initialize cart from localStorage or as empty array
let cart = JSON.parse(localStorage.getItem('freshBasketCart')) || [];

// Function to update cart count in the UI
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);
    
    console.log(`Updating cart count UI: ${totalItems} items`);
    
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
        
        // Add animation class to show feedback
        element.classList.add('animate-pulse');
        setTimeout(() => {
            element.classList.remove('animate-pulse');
        }, 1000);
    });
}

// Function to add a product to cart
function addToCart(product) {
    // Validate the product has required fields
    if (!product.name || !product.price) {
        console.error('Invalid product data:', product);
        alert('Error adding product to cart. Please try again.');
        return;
    }
    
    // Check if product already exists in cart
    const existingProductIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingProductIndex !== -1) {
        // Product exists, increase quantity
        cart[existingProductIndex].quantity += 1;
        console.log(`Increased quantity for ${product.name}. New quantity: ${cart[existingProductIndex].quantity}`);
    } else {
        // Add new product with quantity 1
        product.quantity = 1;
        cart.push(product);
        console.log(`Added new product to cart: ${product.name}`);
    }
    
    // Save to localStorage
    localStorage.setItem('freshBasketCart', JSON.stringify(cart));
    console.log('Cart updated in localStorage. Current cart:', cart);
    
    // Update cart count
    updateCartCount();
    
    // Show feedback to user
    showAddToCartFeedback(product.name);
}

// Function to show feedback when product is added
function showAddToCartFeedback(productName) {
    // Create feedback element
    const feedback = document.createElement('div');
    feedback.className = 'fixed top-20 right-5 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 transform translate-y-0 opacity-100 transition-all duration-300';
    feedback.textContent = `${productName} added to cart!`;
    
    // Add to body
    document.body.appendChild(feedback);
    
    // Animation
    setTimeout(() => {
        feedback.classList.add('translate-y-2', 'opacity-0');
        setTimeout(() => {
            document.body.removeChild(feedback);
        }, 300);
    }, 2000);
}

// Function to get product data from a product card
function getProductDataFromCard(productCard) {
    // Find the product name - checking multiple possible class names
    const nameElement = productCard.querySelector('.product-name') || 
                       productCard.querySelector('h3') || 
                       productCard.querySelector('h3.text-lg');
    
    // Find the price - being more specific with our selector
    const priceElement = productCard.querySelector('.text-green-700') || 
                        productCard.querySelector('.text-xl.font-bold.text-green-700') ||
                        productCard.querySelector('p.text-green-700');
    
    // Find the category - try multiple possible selectors
    const categoryElement = productCard.querySelector('.text-sm.text-gray-500') || 
                           productCard.querySelector('p.text-sm.text-gray-500');
    
    // Find the image
    const imageElement = productCard.querySelector('img');
    
    const product = {
        id: productCard.dataset.id || productCard.getAttribute('id') || Date.now().toString(),
        name: nameElement ? nameElement.textContent.trim() : 'Unknown Product',
        price: priceElement ? parseFloat(priceElement.textContent.replace('₹', '').trim()) : 0,
        image: imageElement ? imageElement.src : '',
        brand: productCard.dataset.brand || 'Unknown',
        category: categoryElement ? categoryElement.textContent.trim() : 'General'
    };
    
    console.log('Adding product to cart:', product);
    return product;
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing cart.js on page load');
    
    // Load cart from localStorage or create an empty array if it doesn't exist
    cart = JSON.parse(localStorage.getItem('freshBasketCart')) || [];
    console.log('Cart loaded from localStorage:', cart);
    
    // Update cart count when page loads
    updateCartCount();
    
    // Add event listeners to all "Add to Cart" buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    console.log(`Found ${addToCartButtons.length} 'Add to Cart' buttons on the page`);
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            console.log('Add to cart button clicked');
            const productCard = event.target.closest('.product-card');
            
            if (productCard) {
                const product = getProductDataFromCard(productCard);
                addToCart(product);
                
                // Prevent event bubbling to parent links
                event.preventDefault();
                event.stopPropagation();
            } else {
                console.error('Could not find parent product card');
            }
        });
    });
});