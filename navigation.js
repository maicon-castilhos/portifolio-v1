(() => {
    const links = [...document.querySelectorAll('nav ul a[href^="#"]')];
    const destinations = links.map(link => document.getElementById(link.hash.slice(1)));
    const sections = destinations.filter(section => section && section.id !== 'home');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const header = document.querySelector('header');
    let frame = 0;
    let flashTimer = 0;

    function updateNavigation() {
        frame = 0;
        const offset = Math.max(140, header.getBoundingClientRect().bottom + 24);
        let current = 'home';

        for (const section of sections) {
            if (section.getBoundingClientRect().top <= offset) {
                current = section.id;
            }
        }

        const { scrollHeight, clientHeight } = document.documentElement;
        if (scrollHeight > clientHeight && window.scrollY + clientHeight >= scrollHeight - 4) {
            current = sections.at(-1)?.id ?? current;
        }

        links.forEach((link, index) => {
            const active = destinations[index]?.id === current;
            link.classList.toggle('active', active);
            if (active) {
                link.setAttribute('aria-current', 'location');
            } else {
                link.removeAttribute('aria-current');
            }
        });

        for (const section of sections) {
            section.classList.toggle('on', section.id === current);
        }
    }

    function scheduleUpdate() {
        if (!frame) {
            frame = window.requestAnimationFrame(updateNavigation);
        }
    }

    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    updateNavigation();

    if ('IntersectionObserver' in window && !reduceMotion.matches) {
        const observer = new IntersectionObserver(entries => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            }
        }, { threshold: 0.06 });

        document.querySelectorAll('section, .contact').forEach(section => observer.observe(section));
    }

    links.forEach((link, index) => {
        link.addEventListener('click', () => {
            window.clearTimeout(flashTimer);
            const section = destinations[index];
            if (reduceMotion.matches || !section?.matches('section')) {
                return;
            }

            flashTimer = window.setTimeout(() => {
                section.classList.remove('flash');
                void section.offsetWidth;
                section.classList.add('flash');
            }, 350);
        });
    });
})();

