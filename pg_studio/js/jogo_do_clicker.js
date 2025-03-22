let money = 0;
let mpc = 1; // Dinheiro por clique
let mpcCost = 10; // Custo para aumentar o dinheiro por clique
let mps = 0; // Dinheiro por segundo básico
let mpsCost = 50; // Custo para comprar dinheiro por segundo
let pg_emp_mps = 0; // Dinheiro por segundo da equipe PG
let pg_emp_mps_cost = 700; // Custo para comprar a equipe PG
let trgrmps = 0; // Dinheiro por segundo da fazenda
let trgrmpsCost = 200; // Custo para comprar a fazenda
let inf = 1000000; // Objetivo final

// Limites de quantidade
const limiteConzinheiros = 30; // Limite de conzinheiros
const limiteFazendas = 8; // Limite de fazendas
const limiteFabricas = 8; // Limite de fábricas

// Quantidades compradas
let quantidadeFabricas = 0; // Quantidade de fábricas compradas
let quantidadeFazendas = 0; // Quantidade de fazendas compradas
let quantidadeConzinheiros = 0; // Quantidade de conzinheiros comprados

// Elementos do DOM
const moneyDisplay = document.getElementById("money");
const mpcDisplay = document.getElementById("mpc");
const mpcCostDisplay = document.getElementById("mpcCost");
const mpsDisplay = document.getElementById("mps");
const mpsCostDisplay = document.getElementById("mpsCost");
const pgmpsCostDisplay = document.getElementById("pg_emp_mps_cost");
const trgrmpsCostDisplay = document.getElementById("trgrmpsCost");
const finalContainer = document.getElementById("finalContainer");
const finalButton = document.getElementById("infg"); // ID corrigido para "infg"

// Verifica se os elementos do DOM foram encontrados
if (!moneyDisplay || !mpcDisplay || !mpcCostDisplay || !mpsDisplay || !mpsCostDisplay || !pgmpsCostDisplay || !trgrmpsCostDisplay || !finalContainer || !finalButton) {
  console.error("Erro: Um ou mais elementos do DOM não foram encontrados. Verifique os IDs no HTML.");
} else {
  // Atualiza os valores na tela
  function updateDisplay() {
    moneyDisplay.textContent = Math.max(money, 0); // Garante que o dinheiro não seja negativo
    mpcDisplay.textContent = mpc;
    mpcCostDisplay.textContent = mpcCost;
    mpsDisplay.textContent = mps + pg_emp_mps + trgrmps; // Exibe a soma de mps, pg_emp_mps e trgrmps
    mpsCostDisplay.textContent = mpsCost;
    pgmpsCostDisplay.textContent = pg_emp_mps_cost;
    trgrmpsCostDisplay.textContent = trgrmpsCost;
  }

  // Adiciona dinheiro ao clicar no cookie
  function clickCookie() {
    money += mpc;
    updateDisplay();
  }

  // Melhora o dinheiro por clique
  function upgradeMPC() {
    if (money >= mpcCost) {
      money -= mpcCost;
      mpc++; // Aumenta o dinheiro por clique
      if (mpc > 5) {
        mpc += 50;
      }
      mpcCost *= 2; // Dobra o custo para a próxima melhoria
      updateDisplay();
    } else {
      alert("Sem dinheiro suficiente para atualizar!");
    }
  }

  // Compra dinheiro por segundo (conzinheiros)
  function buyMPS() {
    if (quantidadeConzinheiros >= limiteConzinheiros) {
      alert("Limite de conzinheiros alcançado!");
      return; // Sai da função se o limite for atingido
    }

    if (money >= mpsCost) {
      money -= mpsCost;
      mps += 2; // Aumenta o dinheiro por segundo básico
      quantidadeConzinheiros++; // Incrementa a quantidade de conzinheiros
      mpsCost *= 2; // Dobra o custo para a próxima compra
      if (mps >= 6) {
        mps += 8;
      }
      updateDisplay();
    } else {
      alert("Sem dinheiro suficiente para comprar conzinheiros!");
    }
  }

  // Compra a equipe PG (fábrica)
  function buypg_emp() {
    if (quantidadeFabricas >= limiteFabricas) {
      alert("Limite de fábricas alcançado!");
      return; // Sai da função se o limite for atingido
    }

    if (money >= pg_emp_mps_cost) {
      money -= pg_emp_mps_cost; // Subtrai o custo
      pg_emp_mps += 30; // Aumenta o dinheiro por segundo da fábrica
      quantidadeFabricas++; // Incrementa a quantidade de fábricas
      pg_emp_mps_cost *= 2; // Dobra o custo para a próxima compra
      updateDisplay();
    } else {
      alert("Sem dinheiro suficiente para comprar a fábrica!");
    }
  }

  // Compra a fazenda
  function buytrgr() {
    if (quantidadeFazendas >= limiteFazendas) {
      alert("Limite de fazendas alcançado!");
      return; // Sai da função se o limite for atingido
    }

    if (money >= trgrmpsCost) {
      money -= trgrmpsCost; // Subtrai o custo
      trgrmps += 25; // Aumenta o dinheiro por segundo da fazenda
      quantidadeFazendas++; // Incrementa a quantidade de fazendas
      trgrmpsCost *= 2; // Dobra o custo para a próxima compra
      updateDisplay();
    } else {
      alert("Sem dinheiro suficiente para comprar a fazenda!");
    }
  }

  // Função para finalizar o jogo
  function infg() {
    if (money >= inf) {
      money -= inf; // Subtrai 1.000.000 de empadas
      alert("Parabéns! Você conseguiu a empada dourada!🎉");
      updateDisplay();
    } else {
      alert("Você não tem empadas suficientes!"); // Mensagem de erro
    }
  }

  // Adiciona o evento de clique ao botão final
  finalButton.addEventListener("click", infg);

  // Atualiza o dinheiro automaticamente a cada segundo
  setInterval(function () {
    money += mps + pg_emp_mps + trgrmps; // Adiciona dinheiro por segundo, da fábrica e da fazenda
    updateDisplay();
  }, 1000);

  // Inicializa o display
  updateDisplay();
}

// Efeito de carregamento suave
document.addEventListener("DOMContentLoaded", function () {
  document.body.style.opacity = "0";
  setTimeout(() => {
    document.body.style.transition = "opacity 0.5s ease";
    document.body.style.opacity = "1";
  }, 100);
});