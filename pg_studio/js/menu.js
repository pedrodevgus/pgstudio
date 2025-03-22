// Efeito de carregamento suave
document.addEventListener("DOMContentLoaded", function() {
    document.body.style.opacity = "0";
    setTimeout(() => {
        document.body.style.transition = "opacity 0.5s ease";
        document.body.style.opacity = "1";
    }, 100);
}); 