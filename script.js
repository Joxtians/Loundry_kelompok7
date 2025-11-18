// DOM Ready - HANYA SATU KALI
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - Checking authentication');
    // Check authentication first
    checkAuthentication();
    
    // Initialize all functionality
    initNavbar();
    initAnimations();
    initAuthForms();
    initTestimonialSlider();
    initDashboard();
});

// Navbar Toggle
function initNavbar() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// Fade-in Animations
function initAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });
    
    fadeElements.forEach(element => {
        fadeInObserver.observe(element);
    });
}

// Authentication Forms
function initAuthForms() {
    console.log('Initializing auth forms');
    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        console.log('Login form found, adding event listener');
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Register Form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Logout Button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

// Login Handler - HANYA SATU VERSI
function handleLogin(e) {
    e.preventDefault();
    console.log('Login form submitted');
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Reset errors
    clearErrors();
    
    // Validation
    let isValid = true;
    
    if (!email) {
        showError('emailError', 'Email harus diisi');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('emailError', 'Format email tidak valid');
        isValid = false;
    }
    
    if (!password) {
        showError('passwordError', 'Password harus diisi');
        isValid = false;
    } else if (password.length < 6) {
        showError('passwordError', 'Password minimal 6 karakter');
        isValid = false;
    }
    
    if (!isValid) {
        console.log('Validation failed');
        return;
    }
    
    console.log('Credentials validated, checking...');
    
    // Check credentials
    if (email === 'admin@jlfco.com' && password === 'admin123') {
        console.log('Admin login successful');
        // Admin login
        localStorage.setItem('currentUser', JSON.stringify({
            email: email,
            name: 'Administrator',
            role: 'admin'
        }));
        redirectAfterLogin();
    } else {
        // Check if user exists
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            console.log('User login successful');
            localStorage.setItem('currentUser', JSON.stringify({
                email: user.email,
                name: user.fullName,
                role: 'user'
            }));
            redirectAfterLogin();
        } else {
            console.log('Login failed - invalid credentials');
            showError('passwordError', 'Email atau password salah');
        }
    }
}

// Register Handler
function handleRegister(e) {
    e.preventDefault();
    
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Reset errors
    clearErrors();
    
    // Validation
    let isValid = true;
    
    if (!fullName) {
        showError('fullNameError', 'Nama lengkap harus diisi');
        isValid = false;
    }
    
    if (!email) {
        showError('emailError', 'Email harus diisi');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('emailError', 'Format email tidak valid');
        isValid = false;
    } else if (isEmailExists(email)) {
        showError('emailError', 'Email sudah terdaftar');
        isValid = false;
    }
    
    if (!phone) {
        showError('phoneError', 'Nomor telepon harus diisi');
        isValid = false;
    } else if (!isValidPhone(phone)) {
        showError('phoneError', 'Format nomor telepon tidak valid');
        isValid = false;
    }
    
    if (!password) {
        showError('passwordError', 'Password harus diisi');
        isValid = false;
    } else if (password.length < 6) {
        showError('passwordError', 'Password minimal 6 karakter');
        isValid = false;
    }
    
    if (!confirmPassword) {
        showError('confirmPasswordError', 'Konfirmasi password harus diisi');
        isValid = false;
    } else if (password !== confirmPassword) {
        showError('confirmPasswordError', 'Password tidak cocok');
        isValid = false;
    }
    
    if (!isValid) return;
    
    // Save user
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push({
        fullName,
        email,
        phone,
        password
    });
    
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto login after registration
    localStorage.setItem('currentUser', JSON.stringify({
        email: email,
        name: fullName,
        role: 'user'
    }));
    
    alert('Pendaftaran berhasil! Anda akan diarahkan ke dashboard.');
    redirectAfterLogin();
}

// Logout Handler
function handleLogout(e) {
    e.preventDefault();
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Validation Helpers
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[0-9+\-\s()]{10,}$/;
    return phoneRegex.test(phone);
}

function isEmailExists(email) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.some(user => user.email === email);
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
    });
}

// Testimonial Slider
function initTestimonialSlider() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (!slides.length) return;
    
    let currentSlide = 0;
    
    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Show current slide
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        
        currentSlide = index;
    }
    
    function nextSlide() {
        let nextIndex = currentSlide + 1;
        if (nextIndex >= slides.length) nextIndex = 0;
        showSlide(nextIndex);
    }
    
    function prevSlide() {
        let prevIndex = currentSlide - 1;
        if (prevIndex < 0) prevIndex = slides.length - 1;
        showSlide(prevIndex);
    }
    
    // Auto slide every 5 seconds
    let slideInterval = setInterval(nextSlide, 5000);
    
    // Event listeners
    if (nextBtn) nextBtn.addEventListener('click', function() {
        clearInterval(slideInterval);
        nextSlide();
        slideInterval = setInterval(nextSlide, 5000);
    });
    
    if (prevBtn) prevBtn.addEventListener('click', function() {
        clearInterval(slideInterval);
        prevSlide();
        slideInterval = setInterval(nextSlide, 5000);
    });
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            clearInterval(slideInterval);
            showSlide(index);
            slideInterval = setInterval(nextSlide, 5000);
        });
    });
}

// Dashboard Initialization
function initDashboard() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Display user name if on dashboard
    const userNameElement = document.getElementById('userName');
    if (userNameElement && currentUser) {
        userNameElement.textContent = currentUser.name;
    }
}

// Authentication Check Function
function checkAuthentication() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const currentPage = window.location.pathname.split('/').pop();
    
    console.log('Current page:', currentPage);
    console.log('Current user:', currentUser);
    
    // Pages that don't require authentication
    const publicPages = ['index.html', 'login.html', 'register.html', ''];
    
    // If current page is not public and user is not logged in, redirect to login
    if (!publicPages.includes(currentPage) && !currentUser) {
        console.log('Redirecting to login - page requires authentication');
        redirectToLogin();
        return;
    }
    
    // If user is already logged in and tries to access login/register, redirect to appropriate dashboard
    if (currentUser && (currentPage === 'login.html' || currentPage === 'register.html')) {
        console.log('User already logged in, redirecting to dashboard');
        if (currentUser.role === 'admin') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'user.html';
        }
        return;
    }
    
    // Role-based access control
    if (currentUser) {
        if (currentPage === 'admin.html' && currentUser.role !== 'admin') {
            window.location.href = 'user.html';
            return;
        }
        
        if (currentPage === 'user.html' && currentUser.role !== 'user') {
            window.location.href = 'admin.html';
            return;
        }
    }
    
    console.log('Authentication check passed');
}

// Function to check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('currentUser') !== null;
}

// Function to get current user
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}

// Function to redirect to login with return URL
function redirectToLogin() {
    const currentPage = window.location.pathname.split('/').pop();
    // Only add return URL for protected pages, not for public pages
    const protectedPages = ['layanan.html', 'tentang.html', 'testimoni.html', 'admin.html', 'user.html'];
    
    if (protectedPages.includes(currentPage)) {
        window.location.href = `login.html?return=${currentPage}`;
    } else {
        window.location.href = 'login.html';
    }
}

// Function to handle protected navigation
function navigateToProtectedPage(page) {
    if (isLoggedIn()) {
        window.location.href = page;
    } else {
        redirectToLogin();
    }
}

// Function to redirect after successful login
function redirectAfterLogin() {
    const urlParams = new URLSearchParams(window.location.search);
    const returnUrl = urlParams.get('return');
    
    console.log('Return URL:', returnUrl);
    
    if (returnUrl && returnUrl !== 'login.html' && returnUrl !== 'register.html') {
        window.location.href = returnUrl;
    } else {
        const currentUser = getCurrentUser();
        if (currentUser.role === 'admin') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'user.html';
        }
    }
}

// Initialize demo data if not exists
function initDemoData() {
    // Check if users exist in localStorage
    if (!localStorage.getItem('users')) {
        const demoUsers = [
            {
                fullName: 'Demo User',
                email: 'user@example.com',
                phone: '081234567890',
                password: 'user123'
            }
        ];
        localStorage.setItem('users', JSON.stringify(demoUsers));
    }
}

// Call demo data initialization
initDemoData();