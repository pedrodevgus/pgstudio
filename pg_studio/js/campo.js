var linhas, colunas, bombas, matriz, tabela;

function gerarMatriz(l, c) {
    matriz = [];
    for (var i = 0; i < l; i++) {
        matriz[i] = new Array(c).fill(0);
    }
}

function gerarTabela(l, c) {
    gerarMatriz(l, c);
    var str = "";
    for (var i = 0; i < l; i++) {
        str += "<tr>";
        for (var j = 0; j < c; j++) {
            str += "<td class='blocked'></td>";
        }
        str += "</tr>";
    }
    tabela.innerHTML = str;
    ajustarTamanhoCelulas();
}

function mostrarMatriz() {
    for (var i = 0; i < linhas; i++) {
        for (var j = 0; j < colunas; j++) {
            if (matriz[i][j] === -1) {
                tabela.rows[i].cells[j].innerHTML = "💣";
            } else {
                tabela.rows[i].cells[j].innerHTML = matriz[i][j];
            }
        }
    }
}

function gerarBombas() {
    for (var i = 0; i < bombas;) {
        var linha = Math.floor((Math.random() * linhas));
        var coluna = Math.floor((Math.random() * colunas));
        if (matriz[linha][coluna] === 0) {
            matriz[linha][coluna] = -1;
            i++;
        }
    }
}

function gerarNumero(l, c) {
    var count = 0;
    for (var i = l - 1; i <= l + 1; i++) {
        for (var j = c - 1; j <= c + 1; j++) {
            if (i >= 0 && i < linhas && j >= 0 && j < colunas) {
                if (matriz[i][j] === -1) {
                    count++;
                }
            }
        }
    }
    matriz[l][c] = count;
}

function gerarNumeros() {
    for (var i = 0; i < linhas; i++) {
        for (var j = 0; j < colunas; j++) {
            if (matriz[i][j] !== -1) {
                gerarNumero(i, j);
            }
        }
    }
}

function bandeira(event) {
    event.preventDefault();
    var cell = event.target;
    if (cell.tagName === 'TD') {
        var linha = cell.parentNode.rowIndex;
        var coluna = cell.cellIndex;
        if (cell.className === "blocked") {
            cell.className = "flag";
            cell.innerHTML = "🚩";
        } else if (cell.className === "flag") {
            cell.className = "blocked";
            cell.innerHTML = "";
        }
        fimDeJogo();
    }
    return false;
}

function init() {
    // Esconde o botão de reiniciar
    document.getElementById('reiniciar').style.display = 'none';
    
    tabela = document.getElementById("tabela");
    tabela.onclick = verificar;
    tabela.oncontextmenu = bandeira;
    var diff = document.getElementById("dificuldade");
    switch (parseInt(diff.value)) {
        case 0:
            linhas = 9;
            colunas = 9;
            bombas = 10;
            break;
        case 1:
            linhas = 16;
            colunas = 16;
            bombas = 40;
            break;
        default:
            linhas = 16;
            colunas = 30;
            bombas = 99;
            break;
    }
    gerarTabela(linhas, colunas);
    gerarBombas();
    gerarNumeros();
}

function limparCelulas(l, c) {
    for (var i = l - 1; i <= l + 1; i++) {
        for (var j = c - 1; j <= c + 1; j++) {
            if (i >= 0 && i < linhas && j >= 0 && j < colunas) {
                var cell = tabela.rows[i].cells[j];
                if (cell.className !== "blank") {
                    switch (matriz[i][j]) {
                        case -1:
                            break;
                        case 0:
                            cell.innerHTML = "";
                            cell.className = "blank";
                            limparCelulas(i, j);
                            break;
                        default:
                            cell.innerHTML = matriz[i][j];
                            cell.className = "n" + matriz[i][j];
                    }
                }
            }
        }
    }
}

function mostrarBombas() {
    for (var i = 0; i < linhas; i++) {
        for (var j = 0; j < colunas; j++) {
            if (matriz[i][j] === -1) {
                var cell = tabela.rows[i].cells[j];
                cell.innerHTML = "💣";
                cell.className = "blank";
            }
        }
    }
}

function verificar(event) {
    var cell = event.target;
    if (cell.tagName === 'TD' && cell.className !== "flag") {
        var linha = cell.parentNode.rowIndex;
        var coluna = cell.cellIndex;
        switch (matriz[linha][coluna]) {
            case -1:
                mostrarBombas();
                cell.classList.add("defeat");
                tabela.onclick = undefined;
                tabela.oncontextmenu = undefined;
                mostrarBotaoReiniciar();
                setTimeout(() => alert("Você perdeu! Clique em Reiniciar para jogar novamente."), 100);
                break;
            case 0:
                limparCelulas(linha, coluna);
                break;
            default:
                cell.innerHTML = matriz[linha][coluna];
                cell.className = "n" + matriz[linha][coluna];
        }
        fimDeJogo();
    }
}

function fimDeJogo() {
    var cells = document.querySelectorAll(".blocked, .flag");
    if (cells.length === bombas) {
        mostrarBombas();
        tabela.onclick = undefined;
        tabela.oncontextmenu = undefined;
        document.querySelectorAll(".blank").forEach(cell => {
            cell.classList.add("victory");
        });
        mostrarBotaoReiniciar();
        setTimeout(() => alert("Você venceu! Clique em Reiniciar para jogar novamente."), 100);
    }
}

function ajustarTamanhoCelulas() {
    const celulas = tabela.getElementsByTagName('td');
    const tamanhoBase = window.innerWidth < 600 ? 25 : 30;
    
    for (let celula of celulas) {
        celula.style.width = `${tamanhoBase}px`;
        celula.style.height = `${tamanhoBase}px`;
    }
}

function mostrarBotaoReiniciar() {
    const botao = document.getElementById('reiniciar');
    botao.style.display = 'inline-block';
    botao.onclick = function() {
        init();
    };
}

function registerEvents() {
    init();
    var diff = document.getElementById("dificuldade");
    diff.onchange = init;
    
    window.addEventListener('resize', ajustarTamanhoCelulas);
    
    // Configura o botão de reiniciar
    document.getElementById('reiniciar').addEventListener('click', function() {
        init();
    });
}

document.addEventListener("DOMContentLoaded", function() {
    registerEvents();
    document.body.style.opacity = "0";
    setTimeout(() => {
        document.body.style.transition = "opacity 0.5s ease";
        document.body.style.opacity = "1";
    }, 100);
});