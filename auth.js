// Authentication and User Session Management
class AuthManager {
    constructor() {
        this.init();
    }

    init() {
        this.updateUI();
        this.bindEvents();
    }

    // Check if user is logged in
    isLoggedIn() {
        const user = localStorage.getItem('freshBasketUser');
        return user !== null;
    }

    // Get current user data
    getCurrentUser() {
        const userData = localStorage.getItem('freshBasketUser');
        return userData ? JSON.parse(userData) : null;
    }

    // Login user
    login(userData) {
        localStorage.setItem('freshBasketUser', JSON.stringify({
            ...userData,
            loginTime: new Date().toISOString()
        }));
        this.updateUI();
    }

    // Register user
    register(userData) {
        localStorage.setItem('freshBasketUser', JSON.stringify({
            ...userData,
            registrationTime: new Date().toISOString()
        }));
        this.updateUI();
    }

    // Logout user
    logout() {
        localStorage.removeItem('freshBasketUser');
        this.updateUI();
        // Redirect to home page
        window.location.href = 'index.html';
    }

    // Update UI based on login status
    updateUI() {
        const loginButtons = document.querySelectorAll('[href="login.html"]');
        const user = this.getCurrentUser();

        loginButtons.forEach(button => {
            if (this.isLoggedIn() && user) {
                // Replace login button with user menu
                const isMainHeader = button.closest('nav') && !button.closest('#mobile-menu');
                
                if (isMainHeader) {
                    // Desktop header
                    button.outerHTML = `
                        <div class="relative">
                            <button id="user-menu-button" class="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition duration-300 shadow-md transform hover:scale-105">
                                <i class="fas fa-user-circle text-lg"></i>
                                <span class="hidden sm:inline">${user.name || user.email.split('@')[0]}</span>
                                <i class="fas fa-chevron-down text-xs"></i>
                            </button>
                            <div id="user-dropdown" class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 hidden z-50">
                                <div class="py-2">
                                    <div class="px-4 py-2 border-b border-gray-100">
                                        <p class="text-sm font-medium text-gray-900">${user.name || 'User'}</p>
                                        <p class="text-xs text-gray-500">${user.email}</p>
                                    </div>
                                    <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition duration-200">
                                        <i class="fas fa-user mr-2"></i>My Profile
                                    </a>
                                    <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition duration-200">
                                        <i class="fas fa-shopping-bag mr-2"></i>My Orders
                                    </a>
                                    <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition duration-200">
                                        <i class="fas fa-heart mr-2"></i>Wishlist
                                    </a>
                                    <button id="logout-button" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition duration-200">
                                        <i class="fas fa-sign-out-alt mr-2"></i>Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                } else {
                    // Mobile menu
                    button.outerHTML = `
                        <div class="border-t border-gray-200 pt-4">
                            <div class="px-4 py-3 bg-green-50 rounded-lg mb-4">
                                <div class="flex items-center space-x-3">
                                    <div class="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                                        <i class="fas fa-user text-white"></i>
                                    </div>
                                    <div>
                                        <p class="font-semibold text-gray-900">${user.name || 'User'}</p>
                                        <p class="text-sm text-gray-500">${user.email}</p>
                                    </div>
                                </div>
                            </div>
                            <a href="#" class="block py-3 px-4 text-gray-700 hover:bg-green-50 rounded-md transition duration-300">
                                <i class="fas fa-user mr-3"></i>My Profile
                            </a>
                            <a href="#" class="block py-3 px-4 text-gray-700 hover:bg-green-50 rounded-md transition duration-300">
                                <i class="fas fa-shopping-bag mr-3"></i>My Orders
                            </a>
                            <a href="#" class="block py-3 px-4 text-gray-700 hover:bg-green-50 rounded-md transition duration-300">
                                <i class="fas fa-heart mr-3"></i>Wishlist
                            </a>
                            <button id="mobile-logout-button" class="w-full text-left py-3 px-4 text-red-600 hover:bg-red-50 rounded-md transition duration-300">
                                <i class="fas fa-sign-out-alt mr-3"></i>Logout
                            </button>
                        </div>
                    `;
                }
            }
        });

        // Bind events after UI update
        this.bindDropdownEvents();
    }

    // Bind events for user dropdown and logout
    bindDropdownEvents() {
        const userMenuButton = document.getElementById('user-menu-button');
        const userDropdown = document.getElementById('user-dropdown');
        const logoutButton = document.getElementById('logout-button');
        const mobileLogoutButton = document.getElementById('mobile-logout-button');

        if (userMenuButton && userDropdown) {
            userMenuButton.addEventListener('click', (e) => {
                e.stopPropagation();
                userDropdown.classList.toggle('hidden');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!userMenuButton.contains(e.target) && !userDropdown.contains(e.target)) {
                    userDropdown.classList.add('hidden');
                }
            });
        }

        if (logoutButton) {
            logoutButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }

        if (mobileLogoutButton) {
            mobileLogoutButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }
    }

    // Bind general events
    bindEvents() {
        // Update UI when storage changes (for multiple tabs)
        window.addEventListener('storage', (e) => {
            if (e.key === 'freshBasketUser') {
                this.updateUI();
            }
        });
    }
}

// Initialize auth manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
});
