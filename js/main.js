// ============================================================
// 1. Ano dinâmico no footer
// ============================================================
document.getElementById('year').textContent = new Date().getFullYear();

// ============================================================
// 2. Menu mobile (abre/fecha)
// ============================================================
const btn = document.getElementById('mobile-menu-button');
const menu = document.getElementById('mobile-menu');
const iconOpen = document.getElementById('icon-open');
const iconClose = document.getElementById('icon-close');

btn.addEventListener('click', () => {
    const isOpen = !menu.classList.contains('hidden');
    menu.classList.toggle('hidden');
    iconOpen.classList.toggle('hidden');
    iconClose.classList.toggle('hidden');
    btn.setAttribute('aria-expanded', String(!isOpen));
});

// Fecha o menu ao clicar em um link (mobile)
menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        menu.classList.add('hidden');
        iconOpen.classList.remove('hidden');
        iconClose.classList.add('hidden');
        btn.setAttribute('aria-expanded', 'false');
    });
});

// ============================================================
// 3. Efeito Encrypt/Scramble (aplica em TODOS os botões .btn-encrypt)
// ============================================================
const CHARS = "!@#$%^&*():{};|,.<>/?";
const CYCLES_PER_LETTER = 2;
const SHUFFLE_TIME = 50;

document.querySelectorAll('.btn-encrypt').forEach((btn) => {
    const textEl = btn.querySelector('.btn-encrypt-text');
    if (!textEl) return;

    const TARGET_TEXT = textEl.textContent.trim();
    let intervalRef = null;

    function scramble() {
        let pos = 0;
        clearInterval(intervalRef);

        intervalRef = setInterval(() => {
            const scrambled = TARGET_TEXT.split("").map((char, index) => {
                if (char === " ") return " ";
                if (pos / CYCLES_PER_LETTER > index) return char;
                const randomCharIndex = Math.floor(Math.random() * CHARS.length);
                return CHARS[randomCharIndex];
            }).join("");

            textEl.textContent = scrambled;
            pos++;

            if (pos >= TARGET_TEXT.length * CYCLES_PER_LETTER) {
                stopScramble();
            }
        }, SHUFFLE_TIME);
    }

    function stopScramble() {
        if (intervalRef) clearInterval(intervalRef);
        textEl.textContent = TARGET_TEXT;
    }

    btn.addEventListener('mouseenter', scramble);
    btn.addEventListener('mouseleave', stopScramble);
    btn.addEventListener('focus', scramble);
    btn.addEventListener('blur', stopScramble);
});