// Define o tema antes da primeira pintura. O armazenamento e opcional.
(() => {
    let theme = null;
    let language = 'pt';
    try {
        theme = localStorage.getItem('maicon-portfolio-theme');
        language = localStorage.getItem('maicon-portfolio-language') || 'pt';
    } catch (_) { /* As preferencias continuam funcionando nesta visita. */ }
    const dark = theme === 'dark' || (theme !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    document.documentElement.dataset.language = language === 'en' ? 'en' : 'pt';
})();
