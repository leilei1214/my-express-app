class MyHeaderComponent extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });

        // 使用 <template> 和 <content> 來插入 header 的 HTML
        const template = document.createElement('template');
        template.innerHTML = `
            <style>
                /* 可以在這裡加入你的 CSS 樣式 */
                .rd-navbar-wrap {
                    background-color: #333; /* 假設背景色 */
                }
                /* 其他樣式 */
            </style>
            <div class="rd-navbar-wrap">
                <nav class="rd-navbar rd-navbar-classic" data-layout="rd-navbar-fixed">
                    <!-- 這裡放入你的 nav HTML 內容 -->
                    <!-- 整個 nav 內容從你提供的 HTML 複製過來 -->
                    <div class="rd-navbar-panel">
                        <button class="rd-navbar-toggle" data-rd-navbar-toggle=".rd-navbar-main"><span></span></button>
                        <div class="rd-navbar-panel-inner container">
                            <div class="rd-navbar-collapse rd-navbar-panel-item rd-navbar-panel-item-left">
                                <div class="owl-carousel-navbar owl-carousel-inline-outer">
                                    <div class="owl-inline-nav">
                                        <button class="owl-arrow owl-arrow-prev"></button>
                                        <button class="owl-arrow owl-arrow-next"></button>
                                    </div>
                                    <div class="owl-carousel-inline-wrap">
                                        <div class="owl-carousel owl-carousel-inline" data-items="1" data-dots="false" data-nav="true" data-autoplay="true">
                                            <!-- 複製你的 article 內容 -->
                                            <article class="post-inline">
                                                <time class="post-inline-time" datetime="2020">April 15, 2020</time>
                                                <p class="post-inline-title">Sportland vs Dream Team</p>
                                            </article>
                                            <article class="post-inline">
                                                <time class="post-inline-time" datetime="2020">April 15, 2020</time>
                                                <p class="post-inline-title">Sportland vs Real Madrid</p>
                                            </article>
                                            <article class="post-inline">
                                                <time class="post-inline-time" datetime="2020">April 15, 2020</time>
                                                <p class="post-inline-title">Sportland vs Barcelona</p>
                                            </article>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="rd-navbar-panel-item rd-navbar-panel-item-right">
                                <ul class="list-inline list-inline-bordered">
                                    <li>
                                        <select class="select select-inline" data-placeholder="Select an option">
                                            <option value="en" selected="">en</option>
                                            <option value="fr">fr</option>
                                            <option value="es">es</option>
                                        </select>
                                    </li>
                                    <li>
                                        <div class="cart-inline-toggled-outer">
                                            <button class="link link-cart cart-inline-toggle"><span class="link-cart-icon fl-bigmug-line-shopping202"></span><span class="link-cart-counter">2</span></button>
                                            <article class="cart-inline cart-inline-toggled">
                                                <div class="cart-inline-inner">
                                                    <div class="cart-inline-header">
                                                        <h5 class="cart-inline-title">In cart: 2 products</h5>
                                                        <p class="cart-inline-subtitle">total price: $750</p>
                                                    </div>
                                                    <div class="cart-inline-main">
                                                        <article class="product-inline">
                                                            <div class="product-inline-aside"><a class="product-inline-figure" href="#"><img class="product-inline-image" src="images/product-Nike-Air-Zoom-Pegasus-67x30.png" alt="" width="67" height="30"/></a></div>
                                                            <div class="product-inline-main">
                                                                <p class="heading-7 product-inline-title"><a href="#">Nike Air Zoom Pegasus</a></p>
                                                                <ul class="product-inline-meta">
                                                                    <li>
                                                                        <input class="form-input" type="number" value="2" min="1">
                                                                    </li>
                                                                    <li>
                                                                        <p class="product-inline-price">$500.00</p>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </article>
                                                        <article class="product-inline">
                                                            <div class="product-inline-aside"><a class="product-inline-figure" href="#"><img class="product-inline-image" src="images/product-Nike-Baseball-Hat-55x38.png" alt="" width="55" height="38"/></a></div>
                                                            <div class="product-inline-main">
                                                                <p class="heading-7 product-inline-title"><a href="#">Nike Baseball Hat</a></p>
                                                                <ul class="product-inline-meta">
                                                                    <li>
                                                                        <input class="form-input" type="number" value="1" min="1">
                                                                    </li>
                                                                    <li>
                                                                        <p class="product-inline-price">$250.00</p>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </article>
                                                    </div>
                                                    <div class="cart-inline-footer"><a class="button button-md button-default-outline" href="#">Go to Cart</a><a class="button button-md button-primary" href="#">Checkout</a></div>
                                                </div>
                                            </article>
                                        </div>
                                    </li>
                                    <li id="login_status"><a class="link link-icon link-icon-left link-classic" href="#"><span class="icon fl-bigmug-line-login12"></span><span class="link-icon-text">Your Account</span></a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="rd-navbar-main">
                        <div class="rd-navbar-main-top">
                            <div class="rd-navbar-main-container container">
                                <div class="rd-navbar-brand"><a class="brand" href="./"><img class="brand-logo" src="../images/logo.png" alt="" width="95" height="126"/></a></div>
                                <ul class="rd-navbar-list">
                                    <li class="rd-navbar-list-item"><a class="rd-navbar-list-link" href="#"><img src="../images/partners-1-inverse-75x42.png" alt="" width="75" height="42"/></a></li>
                                    <li class="rd-navbar-list-item"><a class="rd-navbar-list-link" href="#"><img src="../images/partners-2-inverse-88x45.png" alt="" width="88" height="45"/></a></li>
                                    <li class="rd-navbar-list-item"><a class="rd-navbar-list-link" href="#"><img src="../images/partners-3-inverse-79x52.png" alt="" width="79" height="52"/></a></li>
                                </ul>
                                <div class="rd-navbar-search">
                                    <button class="rd-navbar-search-toggle" data-rd-navbar-toggle=".rd-navbar-search"><span></span></button>
                                    <form class="rd-search" action="#" method="GET">
                                        <div class="form-wrap">
                                            <label class="form-label" for="rd-navbar-search-form-input">Enter your search request here...</label>
                                            <input class="rd-navbar-search-form-input form-input" id="rd-navbar-search-form-input" type="text" name="s" autocomplete="off">
                                        </div>
                                        <button class="rd-search-form-submit fl-budicons-launch-search81" type="submit"></button>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div class="rd-navbar-main-bottom rd-navbar-darker">
                            <div class="rd-navbar-main-container container">
                                <ul class="rd-navbar-nav">
                                    <li class="rd-nav-item active"><a class="rd-nav-link" href="index.html">Home</a></li>
                                    <li class="rd-nav-item"><a class="rd-nav-link" href="#">Game overview</a></li>
                                    <li class="rd-nav-item"><a class="rd-nav-link" href="#">Typography</a></li>
                                    <li class="rd-nav-item"><a class="rd-nav-link" href="#">Contact us</a></li>
                                </ul>
                                <div class="rd-navbar-main-element">
                                    <ul class="list-inline list-inline-sm">
                                        <li><a class="icon icon-xs icon-light fa fa-facebook" href="#"></a></li>
                                        <li><a class="icon icon-xs icon-light fa fa-twitter" href="#"></a></li>
                                        <li><a class="icon icon-xs icon-light fa fa-google-plus" href="#"></a></li>
                                        <li><a class="icon icon-xs icon-light fa fa-instagram" href="#"></a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        `;
        shadow.appendChild(template.content.cloneNode(true));
    }
}

customElements.define('my-component', MyHeaderComponent);
