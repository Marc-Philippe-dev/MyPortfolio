
class Navbar extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `<header>
    <nav class="flex nav grow">
        <img src="./assets/icons/logo_size1.jpg" alt="company logo" id="logo ">
        <div class=" flex mobile-nav grow">

            <div class=" flex grow tablet-nav">
                <ul class="flex mr-auto nav-links">
                    <li class="link flex-item"> <a href="index.html"> Home </a></li>
                    <li class="link flex-item"> <a href="about.html"> About Me </a></li>
                    <li class="link flex-item"> <a href="contact.html">Contact</a></li>
                </ul>

                <ul class="navbar-nav contact-infos  flex">
                    <li class="flex-item "><a target = "_blank" href="mailto:contact@marcodev.tech" class="mail">contact@marcodev.tech</a></li>
                    <li class="flex-item"><a target = "_blank" href="tel:+216 58 373 582">+216 58 373 582</a></li>
                </ul>
                <div class="vertical-divider none-divider1"></div>
            </div>

            <ul class="flex ml-auto">
                <a target = "_blank" href="https://twitter.com/MarcGnancadja" class="flex-item "><img src="./assets/icons/twitter.svg" alt="twitter logo"></a>
                <a target = "_blank" href="https://www.instagram.com/marcgnancadja/" class="flex-item "><img src="./assets/icons/instagram.svg" alt=""></a>
                <a target = "_blank" href="https://www.linkedin.com/in/marc-philippe-gnancadja/" class="flex-item "><img src="./assets/icons/Linkedin.svg" alt=""></a>
                <a target = "_blank" href="https://github.com/Marc-Philippe-dev" class="flex-item "><img src="./assets/icons/GitHub.svg" alt=""></a>
            </ul>
            <div class="vertical-divider none-divider2 hidden "></div>
        </div>
        <img src="./assets/icons/hamburger_menu.svg" alt="hamburger_menu" class="hidden flex-item  hamburger-menu">
    </nav>
</header>`
    }
}

window.customElements.define('app-nav-bar', Navbar);