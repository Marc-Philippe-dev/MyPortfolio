class Footer extends HTMLElement{
    constructor() {
        super();
        this.innerHTML = `
<footer class="flex">
    <p>
        (c) Copyright Marc GNANCADJA 2022. All rights reserved.
    </p>
    <ul class="flex privacy">
        <li><a href="" target = "_blank">Policy Privacy</a></li>
        <li><a href="" target = "_blank">Terms & conditions</a></li>
    </ul>
    <ul class="flex ">
        <a href="https://twitter.com/MarcGnancadja" class="flex-item " target = "_blank"><img src="/assets/icons/twitter.svg" alt="twitter logo" ></a>
        <a href="https://www.instagram.com/marcgnancadja/" class="flex-item " target = "_blank"><img src="/assets/icons/instagram.svg" alt="" ></a>
        <a href="https://www.linkedin.com/in/marc-philippe-gnancadja/" class="flex-item " target = "_blank"><img src="/assets/icons/Linkedin.svg" alt="" ></a>
        <a href="https://github.com/Marc-Philippe-dev" class="flex-item " target = "_blank"><img src="/assets/icons/GitHub.svg" alt="" ></a>
    </ul>
</footer>`
    } ;
}

window.customElements.define('app-footer' , Footer);