document.addEventListener('DOMContentLoaded', function() {
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    // Mostrar login por defecto
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';

    tabLogin.addEventListener('click', function() {
        tabLogin.classList.add('active');
        tabLogin.classList.remove('inactive');
        tabRegister.classList.remove('active');
        tabRegister.classList.add('inactive');
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    });

    tabRegister.addEventListener('click', function() {
        tabRegister.classList.add('active');
        tabRegister.classList.remove('inactive');
        tabLogin.classList.remove('active');
        tabLogin.classList.add('inactive');
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    });
});