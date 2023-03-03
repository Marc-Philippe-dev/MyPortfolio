const hamburger = document.querySelector(".hamburger-menu");

const tabletNav = document.querySelector(".tablet-nav");

const mobileNav = document.querySelector(".mobile-nav")

hamburger.addEventListener("click", () => {
    tabletNav.classList.toggle('active');
    mobileNav.classList.toggle('active');
})



