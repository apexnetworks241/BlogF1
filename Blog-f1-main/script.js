function aplicarTema(escuro) {
    if (escuro) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('temaF1Blog', 'escuro');
        document.getElementById('modo-toggle').textContent = '☀️';
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('temaF1Blog', 'claro');
        document.getElementById('modo-toggle').textContent = '🌙';
    }
}

// Verificar preferência do usuário ou do sistema
const temaSalvo = localStorage.getItem('temaF1Blog');
const preferenciaSistema = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (temaSalvo === 'escuro' || (!temaSalvo && preferenciaSistema)) {
    aplicarTema(true);
} else {
    aplicarTema(false);
}

// Alternar tema ao clicar no botão
document.getElementById('modo-toggle').addEventListener('click', () => {
    const estaEscuro = document.body.classList.contains('dark-mode');
    aplicarTema(!estaEscuro);
});

// Destacar navegação ativa
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function() {
        document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
        this.classList.add('active');
    });
});