const startBtn = document.getElementById('startBtn');
const authModal = document.getElementById('authModal');
const closeModal = document.getElementById('closeModal');
const authTabs = document.querySelectorAll('.auth-tab');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

// Ouvrir le modal
startBtn.addEventListener('click', () => {
    authModal.classList.add('active');
});

// Fermer le modal
closeModal.addEventListener('click', () => {
    authModal.classList.remove('active');
});

authModal.addEventListener('click', (e) => {
    if (e.target === authModal) {
        authModal.classList.remove('active');
    }
});

// Changer d'onglet
authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        authTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        const tabName = tab.dataset.tab;
        if (tabName === 'login') {
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
        } else {
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
        }
    });
});

// Connexion
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(loginForm);
    const data = {
        email: formData.get('email'),
        password: formData.get('password')
    };
    
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            window.location.href = '/app';
        } else {
            document.getElementById('loginError').textContent = result.error;
        }
    } catch (error) {
        document.getElementById('loginError').textContent = 'Erreur de connexion';
    }
});

// Inscription
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(registerForm);
    const data = {
        username: formData.get('username'),
        email: formData.get('email'),
        password: formData.get('password')
    };
    
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            window.location.href = '/app';
        } else {
            document.getElementById('registerError').textContent = result.error;
        }
    } catch (error) {
        document.getElementById('registerError').textContent = 'Erreur d\'inscription';
    }
});
