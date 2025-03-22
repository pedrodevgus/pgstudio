function atualizarHora() {
    const elementoHora = document.getElementById("hora-atual");
    const agora = new Date();
    const horas = String(agora.getHours()).padStart(2, '0'); // Formata para 2 dígitos
    const minutos = String(agora.getMinutes()).padStart(2, '0'); // Formata para 2 dígitos
    const segundos = String(agora.getSeconds()).padStart(2, '0'); // Formata para 2 dígitos
    elementoHora.textContent = `${horas}:${minutos}:${segundos}`; // Exibe a hora no formato HH:MM:SS
}
 // Efeito de carregamento suave
 document.addEventListener("DOMContentLoaded", function () {
    document.body.style.opacity = "0";
    setTimeout(() => {
        document.body.style.transition = "opacity 0.5s ease";
        document.body.style.opacity = "1";
    }, 100);
}); 

 // Atualiza a hora a cada segundo
 setInterval(atualizarHora, 1000);

 // Exibe a hora imediatamente ao carregar a página
 atualizarHora();


           
  
       