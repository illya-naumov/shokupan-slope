
export function loadHeader() {
    const headerHTML = `
    <header>
        <nav>
            <div class="logo">
                <a href="/">
                    <img src="/logo.svg" alt="Shokupan Slope Logo" class="logo-icon" width="40" height="40">
                    Shokupan Slope
                </a>
            </div>
            <div class="nav-links">
                <a href="/">Home</a>
                <a href="/about.html">About</a>
                <a href="/shipping.html">Delivery</a>
                <a href="/order.html">Order</a>
            </div>
            <div class="socials">
                <a href="#instagram" aria-label="Instagram">IG</a>
                <a href="#facebook" aria-label="Facebook">FB</a>
            </div>
        </nav>
    </header>
    `;
    document.body.insertAdjacentHTML('afterbegin', headerHTML);

    // Highlight active link
    const path = window.location.pathname;
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        if (link.getAttribute('href') === path || (path === '/' && link.getAttribute('href') === '/')) {
            link.style.fontWeight = '700';
            link.style.textDecoration = 'underline';
        }
    });

    // Add mobile menu styles dynamically or via CSS
    // For now, simpler CSS in style.css handles the checks
}

export function loadFooter() {
    const footerHTML = `
    <footer>
        <p>&copy; 2026 Shokupan Slope. Made with Love in Brooklyn.</p>
    </footer>
    `;
    document.body.insertAdjacentHTML('beforeend', footerHTML);
}
