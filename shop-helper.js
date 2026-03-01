/**
 * Shop page helper script
 * Ensures product cards have the necessary structure for cart functionality
 * Works across all pages: shop, product detail, meet (home), etc.
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Shop helper script loaded');
    
    // Fix product cards
    enhanceProductCards();
    
    // Add cart functionality to all non-product-card "Add to Cart" buttons
    enhanceAddToCartButtons();
});

function enhanceProductCards() {
    const productCards = document.querySelectorAll('.product-card');
    console.log(`Found ${productCards.length} product cards on the page`);
    
    productCards.forEach((card, index) => {
        // Ensure each card has an ID
        if (!card.id) {
            card.id = `product-${index + 1000}`;
        }
        
        // Make sure product name has the correct class
        const nameElement = card.querySelector('h3') || card.querySelector('h3.text-lg');
        if (nameElement && !nameElement.classList.contains('product-name')) {
            nameElement.classList.add('product-name');
        }
        
        // Add click event to add-to-cart button
        const addToCartBtn = card.querySelector('.add-to-cart-btn');
        if (addToCartBtn) {
            // Remove any existing event listeners to prevent duplicates
            const newButton = addToCartBtn.cloneNode(true);
            addToCartBtn.parentNode.replaceChild(newButton, addToCartBtn);
            
            // Add the event listener
            newButton.addEventListener('click', (event) => {
                console.log('Add to cart clicked from product card');
                
                if (typeof getProductDataFromCard === 'function' && typeof addToCart === 'function') {
                    const product = getProductDataFromCard(card);
                    addToCart(product);
                } else {
                    console.error('Cart functions not available');
                }
                
                // Prevent navigation to product detail page
                event.preventDefault();
                event.stopPropagation();
            });
        }
    });
}

// Add cart functionality to all "Add to Cart" buttons outside product cards
function enhanceAddToCartButtons() {
    // First, find all "Add to Cart" buttons that are not within product-card elements
    const allAddToCartButtons = document.querySelectorAll('button');
    const standaloneButtons = Array.from(allAddToCartButtons).filter(button => {
        // Check if the button text contains "Add to Cart"
        const hasAddToCartText = button.textContent.trim().includes('Add to Cart');
        
        // Check if button is not already in a product-card
        const notInProductCard = !button.closest('.product-card');
        
        // Check if it's not already an add-to-cart-btn
        const notAlreadyAddToCartBtn = !button.classList.contains('add-to-cart-btn');
        
        return hasAddToCartText && notInProductCard;
    });
    
    console.log(`Found ${standaloneButtons.length} standalone "Add to Cart" buttons`);
    
    // For each standalone button
    standaloneButtons.forEach((button, index) => {
        // Add the add-to-cart-btn class
        button.classList.add('add-to-cart-btn');
        
        // Find the closest container div that might contain product information
        const container = button.closest('div');
        
        if (container) {
            // Convert container to a product card by adding the class
            container.classList.add('product-card');
            container.setAttribute('data-id', `standalone-product-${index}`);
            
            // Find the product name (most likely the first h3 element)
            const nameElement = container.querySelector('h3');
            if (nameElement && !nameElement.classList.contains('product-name')) {
                nameElement.classList.add('product-name');
            }
            
            // Add click event to button
            button.addEventListener('click', (event) => {
                console.log('Add to cart clicked from standalone button');
                
                if (typeof getProductDataFromCard === 'function' && typeof addToCart === 'function') {
                    try {
                        const product = getProductDataFromCard(container);
                        addToCart(product);
                    } catch (error) {
                        console.error('Error adding product to cart:', error);
                    }
                } else {
                    console.error('Cart functions not available');
                }
                
                // Prevent default behavior
                event.preventDefault();
                event.stopPropagation();
            });
        }
    });
}
