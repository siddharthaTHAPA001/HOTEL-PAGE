// Wait for the DOM to be fully loaded before running script
document.addEventListener('DOMContentLoaded', () => {

    // --- Get Modal Elements ---
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    
    // --- Get Button Elements ---
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const logoutBtn = document.getElementById('logout-btn');
    
    // --- Get Close Buttons ---
    const closeLogin = document.getElementById('close-login');
    const closeRegister = document.getElementById('close-register');

    // --- Get Forms ---
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    // --- Get UI Elements to Update ---
    const authButtons = document.querySelector('.auth-buttons');
    const userInfo = document.getElementById('user-info');
    const welcomeMsg = document.getElementById('welcome-msg');
    
    // --- Get Error/Success Message Elements ---
    const loginError = document.getElementById('login-error');
    const registerMsg = document.getElementById('register-msg');

    // --- Modal Open/Close Event Listeners ---
    loginBtn.onclick = () => {
        loginModal.style.display = 'block';
        registerModal.style.display = 'none'; // Close other modal
    };
    registerBtn.onclick = () => {
        registerModal.style.display = 'block';
        loginModal.style.display = 'none'; // Close other modal
    };
    closeLogin.onclick = () => loginModal.style.display = 'none';
    closeRegister.onclick = () => registerModal.style.display = 'none';

    // Close modals if user clicks outside the modal content
    window.onclick = (event) => {
        if (event.target == loginModal) {
            loginModal.style.display = 'none';
        }
        if (event.target == registerModal) {
            registerModal.style.display = 'none';
        }
    };

    // --- Registration Logic ---
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent form from submitting
        
        // Clear previous messages
        registerMsg.textContent = '';

        // Get form values
        const username = document.getElementById('reg-username').value;
        const password = document.getElementById('reg-password').value;

        // Get existing users from "local database" (localStorage)
        // If no users exist, default to an empty array
        const users = JSON.parse(localStorage.getItem('hotelUsers')) || [];

        // Check if user already exists
        const userExists = users.find(user => user.username === username);

        if (userExists) {
            registerMsg.textContent = 'Username already exists. Please try another.';
            registerMsg.className = 'error-msg';
        } else {
            // Add new user to the array
            users.push({ username, password });
            
            // Save the updated array back to localStorage
            localStorage.setItem('hotelUsers', JSON.stringify(users));

            // Show success message
            registerMsg.textContent = 'Account created successfully! You can now log in.';
            registerMsg.className = 'success-msg';

            // Clear the form
            registerForm.reset();
        }
    });

    // --- Login Logic ---
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Clear previous error
        loginError.textContent = '';

        // Get form values
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('hotelUsers')) || [];

        // Find the user
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            // Successful login
            loginModal.style.display = 'none';
            loginForm.reset();
            updateUIAfterLogin(username);
            // Save current user to session storage (persists for the tab session)
            sessionStorage.setItem('currentUser', username);
        } else {
            // Failed login
            loginError.textContent = 'Invalid username or password.';
        }
    });

    // --- Logout Logic ---
    logoutBtn.addEventListener('click', () => {
        // Clear session storage
        sessionStorage.removeItem('currentUser');
        // Update UI
        authButtons.classList.remove('hidden');
        userInfo.classList.add('hidden');
        welcomeMsg.textContent = '';
    });

    // --- UI Update Function ---
    function updateUIAfterLogin(username) {
        // Hide "Sign In" and "Register" buttons
        loginBtn.classList.add('hidden');
        registerBtn.classList.add('hidden');

        // Show "Welcome" message and "Logout" button
        userInfo.classList.remove('hidden');
        welcomeMsg.textContent = `Welcome, ${username}`;
    }

    // --- Check for logged-in user on page load ---
    function checkLoginStatus() {
        const currentUser = sessionStorage.getItem('currentUser');
        if (currentUser) {
            updateUIAfterLogin(currentUser);
        } else {
            // Ensure auth buttons are visible and user info is hidden
            loginBtn.classList.remove('hidden');
            registerBtn.classList.remove('hidden');
            userInfo.classList.add('hidden');
        }
    }
    
    // Check login status when the page loads
    checkLoginStatus();

});