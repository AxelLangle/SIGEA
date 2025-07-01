$(function() {
	$(".btn").click(function() {
		$(".form-signin").toggleClass("form-signin-left");
    $(".form-signup").toggleClass("form-signup-left");
    $(".frame").toggleClass("frame-long");
    $(".signup-inactive").toggleClass("signup-active");
    $(".signin-active").toggleClass("signin-inactive");
    $(".forgot").toggleClass("forgot-left");   
    $(this).removeClass("idle").addClass("active");
	});
});

$(function() {
	$(".btn-signup").click(function() {
  $(".nav").toggleClass("nav-up");
  $(".form-signup-left").toggleClass("form-signup-down");
  $(".success").toggleClass("success-left"); 
  $(".frame").toggleClass("frame-short");
	});
});

$(function() {
	$(".btn-signin").click(function() {
  $(".btn-animate").toggleClass("btn-animate-grow");
  $(".welcome").toggleClass("welcome-left");
  $(".cover-photo").toggleClass("cover-photo-down");
  $(".frame").toggleClass("frame-short");
  $(".profile-photo").toggleClass("profile-photo-down");
  $(".btn-goback").toggleClass("btn-goback-up");
  $(".forgot").toggleClass("forgot-fade");
	});
});

document.addEventListener('DOMContentLoaded', function() {
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    tabLogin.addEventListener('click', function() {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        tabLogin.classList.add('active');
        tabLogin.classList.remove('inactive');
        tabRegister.classList.remove('active');
        tabRegister.classList.add('inactive');
    });

    tabRegister.addEventListener('click', function() {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        tabRegister.classList.add('active');
        tabRegister.classList.remove('inactive');
        tabLogin.classList.remove('active');
        tabLogin.classList.add('inactive');
    });
});