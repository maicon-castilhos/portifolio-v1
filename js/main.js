// Navegacao progressiva: sem JavaScript, os links continuam acessiveis.
document.documentElement.classList.add('has-js');
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
const menuButton = document.getElementById('mobile-menu-button');
const navigation = document.getElementById('main-navigation');
const menuLines = document.getElementById('menu-lines');
function setMenuOpen(open) {
    navigation.classList.toggle('is-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    const menuLabel = open ? 'Fechar menu de navegação' : 'Abrir menu de navegação';
    menuButton.setAttribute('aria-label', window.portfolioI18n?.t(menuLabel) ?? menuLabel);
    menuLines.setAttribute('d', open ? 'M6 6l12 12M6 18 18 6' : 'M4 6h16M4 12h16M4 18h16');
}
if (menuButton && navigation) {
    menuButton.hidden = false;
    document.addEventListener('portfolio:languagechange', () => setMenuOpen(menuButton.getAttribute('aria-expanded') === 'true'));
    menuButton.addEventListener('click', () => setMenuOpen(menuButton.getAttribute('aria-expanded') !== 'true'));
    navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenuOpen(false)));
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
            setMenuOpen(false);
            menuButton.focus();
        }
    });
    document.addEventListener('click', event => {
        if (!event.target.closest('.site-header')) setMenuOpen(false);
    });
    window.matchMedia('(min-width: 768px)').addEventListener('change', event => {
        if (event.matches) setMenuOpen(false);
    });
}
// Identifica a secao atual sem alterar o historico ou o foco do visitante.
const navLinks = [...document.querySelectorAll('.main-navigation a[href^="#"]')];
const sections = navLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
if ('IntersectionObserver' in window) {
    const visibleSections = new Map();
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => visibleSections.set(entry.target.id, entry.isIntersecting));
        const active = sections.filter(section => visibleSections.get(section.id)).sort((a, b) => Math.abs(a.getBoundingClientRect().top - 100) - Math.abs(b.getBoundingClientRect().top - 100))[0];
        if (active) navLinks.forEach(link => {
            if (link.hash === '#' + active.id) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
        });
    }, {rootMargin: '-80px 0px -45% 0px', threshold: 0});
    sections.forEach(section => observer.observe(section));
}
// Links diretos a categorias tambem revelam seu conteudo.
function revealHashTarget() {
    if (!location.hash) return;
    const target = document.getElementById(location.hash.slice(1));
    if (target && target.tagName === 'DETAILS') target.open = true;
}
window.addEventListener('hashchange', revealHashTarget);
revealHashTarget();
