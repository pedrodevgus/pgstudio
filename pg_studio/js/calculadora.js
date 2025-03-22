// Função para adicionar um valor ao visor
function adicionar(valor) {
  document.getElementById('visor').value += valor;
  }// Função para limpar o visor
  function limpar() {
  document.getElementById('visor').value = '';
  }// Função para apagar o último caractere
  function apagar() {
  var visor = document.getElementById('visor');
  visor.value = visor.value.slice(0, -1);
  }// Função para calcular o resultado
  function calcular() {
  var visor = document.getElementById('visor');
  try {
  // Usa a função eval() para calcular o resultado
  // Nota: eval() pode ser perigoso com entrada não confiável
  visor.value = eval(visor.value);
  } catch (error) {
  // Se houver um erro na expressão, mostra "Erro" no visor
  visor.value = 'Erro, atualize a página';
  }
  }

  
    // Efeito de carregamento suave
    document.addEventListener("DOMContentLoaded", function() {
      document.body.style.opacity = "0";
      setTimeout(() => {
          document.body.style.transition = "opacity 0.5s ease";
          document.body.style.opacity = "1";
      }, 100);
  });


  
    // Efeito de carregamento suave
    document.addEventListener("DOMContentLoaded", function() {
      document.body.style.opacity = "0";
      setTimeout(() => {
          document.body.style.transition = "opacity 0.5s ease";
          document.body.style.opacity = "1";
      }, 100);
  });