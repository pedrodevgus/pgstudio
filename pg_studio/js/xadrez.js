// CONSTANTES
const PECAS = {
    REI: 'rei', RAINHA: 'rainha', TORRE: 'torre',
    BISPO: 'bispo', CAVALO: 'cavalo', PEAO: 'peao'
};

const CORES = { BRANCAS: 'brancas', PRETAS: 'pretas' };
const ESTADO_JOGO = { EM_ANDAMENTO: 0, XEQUE: 1, XEQUE_MATE: 2, EMPATE: 3 };

// TABULEIRO
let tabuleiro = Array(8).fill().map(() => Array(8).fill(null));
let jogadorAtual = CORES.BRANCAS;
let casaSelecionada = null;
let movimentosPossiveis = [];
let estadoJogo = ESTADO_JOGO.EM_ANDAMENTO;
let historicoMovimentos = [];

// INICIALIZAÇÃO
function iniciarJogo() {
    // Resetar estado
    tabuleiro = Array(8).fill().map(() => Array(8).fill(null));
    jogadorAtual = CORES.BRANCAS;
    casaSelecionada = null;
    movimentosPossiveis = [];
    estadoJogo = ESTADO_JOGO.EM_ANDAMENTO;
    historicoMovimentos = [];
    
    // Peças pretas (linha 0 e 1)
    tabuleiro[0] = [
        criarPeca(PECAS.TORRE, CORES.PRETAS),
        criarPeca(PECAS.CAVALO, CORES.PRETAS),
        criarPeca(PECAS.BISPO, CORES.PRETAS),
        criarPeca(PECAS.RAINHA, CORES.PRETAS),
        criarPeca(PECAS.REI, CORES.PRETAS),
        criarPeca(PECAS.BISPO, CORES.PRETAS),
        criarPeca(PECAS.CAVALO, CORES.PRETAS),
        criarPeca(PECAS.TORRE, CORES.PRETAS)
    ];
    tabuleiro[1] = Array(8).fill().map(() => criarPeca(PECAS.PEAO, CORES.PRETAS));

    // Peças brancas (linha 6 e 7)
    tabuleiro[6] = Array(8).fill().map(() => criarPeca(PECAS.PEAO, CORES.BRANCAS));
    tabuleiro[7] = [
        criarPeca(PECAS.TORRE, CORES.BRANCAS),
        criarPeca(PECAS.CAVALO, CORES.BRANCAS),
        criarPeca(PECAS.BISPO, CORES.BRANCAS),
        criarPeca(PECAS.RAINHA, CORES.BRANCAS),
        criarPeca(PECAS.REI, CORES.BRANCAS),
        criarPeca(PECAS.BISPO, CORES.BRANCAS),
        criarPeca(PECAS.CAVALO, CORES.BRANCAS),
        criarPeca(PECAS.TORRE, CORES.BRANCAS)
    ];

    renderizarTabuleiro();
    document.getElementById('xadrez-jogador').textContent = 'Jogador: Brancas';
    document.getElementById('xadrez-mensagem').textContent = 'Clique em uma peça para começar';
    document.getElementById('pontuacao').textContent = '0';
}

function criarPeca(tipo, cor) {
    return { tipo, cor, movimentou: false };
}

// RENDERIZAÇÃO
function renderizarTabuleiro() {
    // Limpa todas as casas
    for (let i = 1; i <= 8; i++) {
        const linha = document.getElementById(`linha${i}`);
        linha.innerHTML = '';
        
        for (let j = 1; j <= 8; j++) {
            const casa = document.createElement('div');
            const linhaTabuleiro = 8 - i;
            const colunaTabuleiro = j - 1;
            const peca = tabuleiro[linhaTabuleiro][colunaTabuleiro];
            
            // Remove classes anteriores
            casa.className = '';
            
            // Adiciona classes básicas
            casa.classList.add((linhaTabuleiro + colunaTabuleiro) % 2 ? 'xadrez-casa-escura' : 'xadrez-casa-clara');
            
            // Adiciona peça se existir
            if (peca) {
                casa.textContent = obterSimboloPeca(peca);
                casa.style.color = peca.cor === CORES.BRANCAS ? '#fff' : '#000';
            }
            
            // Marca casa selecionada
            if (casaSelecionada && casaSelecionada.linha === linhaTabuleiro && casaSelecionada.coluna === colunaTabuleiro) {
                casa.classList.add('casa-selecionada');
            }
            
            // Marca movimentos possíveis
            const isMovimentoPossivel = movimentosPossiveis.some(m => 
                m.linha === linhaTabuleiro && m.coluna === colunaTabuleiro
            );
            
            if (isMovimentoPossivel) {
                if (tabuleiro[linhaTabuleiro][colunaTabuleiro]) {
                    casa.classList.add('captura-possivel');
                } else {
                    casa.classList.add('movimento-possivel');
                }
            }
            
            casa.addEventListener('click', () => lidarClique(linhaTabuleiro, colunaTabuleiro));
            linha.appendChild(casa);
        }
    }
}

function obterSimboloPeca(peca) {
    const simbolos = {
        rei: { brancas: '♔', pretas: '♚' },
        rainha: { brancas: '♕', pretas: '♛' },
        torre: { brancas: '♖', pretas: '♜' },
        bispo: { brancas: '♗', pretas: '♝' },
        cavalo: { brancas: '♘', pretas: '♞' },
        peao: { brancas: '♙', pretas: '♟' }
    };
    return simbolos[peca.tipo][peca.cor];
}

// LÓGICA DO JOGO
function lidarClique(linha, coluna) {
    if (estadoJogo === ESTADO_JOGO.XEQUE_MATE || estadoJogo === ESTADO_JOGO.EMPATE) return;
    
    const peca = tabuleiro[linha][coluna];
    
    // Caso 1: Selecionar uma peça do jogador atual
    if (peca && peca.cor === jogadorAtual) {
        casaSelecionada = { linha, coluna };
        movimentosPossiveis = calcularMovimentosValidos(linha, coluna);
        renderizarTabuleiro();
        document.getElementById('xadrez-mensagem').textContent = 'Selecione o destino';
        return;
    }
    
    // Caso 2: Tentar mover para uma casa válida
    if (casaSelecionada) {
        const movimentoValido = movimentosPossiveis.some(
            m => m.linha === linha && m.coluna === coluna
        );
        
        if (movimentoValido) {
            // Adiciona animação
            const casaDom = document.querySelector(`#linha${8 - casaSelecionada.linha} div:nth-child(${casaSelecionada.coluna + 1})`);
            if (casaDom) casaDom.classList.add('peca-movendo');
            
            // Realiza o movimento após a animação
            setTimeout(() => {
                moverPeca(casaSelecionada.linha, casaSelecionada.coluna, linha, coluna);
                casaSelecionada = null;
                movimentosPossiveis = [];
                
                // Verifica estado do jogo
                const adversario = jogadorAtual === CORES.BRANCAS ? CORES.PRETAS : CORES.BRANCAS;
                if (estaEmXeque(adversario)) {
                    if (verificarXequeMate(adversario)) {
                        estadoJogo = ESTADO_JOGO.XEQUE_MATE;
                        document.getElementById('xadrez-mensagem').textContent = 
                            `Xeque-mate! ${jogadorAtual === CORES.BRANCAS ? 'Brancas' : 'Pretas'} venceram!`;
                    } else {
                        estadoJogo = ESTADO_JOGO.XEQUE;
                        document.getElementById('xadrez-mensagem').textContent = 'Xeque!';
                    }
                } else if (verificarEmpate(adversario)) {
                    estadoJogo = ESTADO_JOGO.EMPATE;
                    document.getElementById('xadrez-mensagem').textContent = 'Empate!';
                } else {
                    estadoJogo = ESTADO_JOGO.EM_ANDAMENTO;
                    document.getElementById('xadrez-mensagem').textContent = '';
                }
                
                trocarJogador();
                renderizarTabuleiro();
                
                // Atualiza contador de movimentos
                document.getElementById('pontuacao').textContent = 
                    parseInt(document.getElementById('pontuacao').textContent) + 1;
            }, 300);
        }
    }
}

function moverPeca(linhaOrigem, colunaOrigem, linhaDestino, colunaDestino) {
    const peca = tabuleiro[linhaOrigem][colunaOrigem];
    peca.movimentou = true;
    
    // Registrar movimento no histórico
    historicoMovimentos.push({
        peca: {...peca},
        origem: {linha: linhaOrigem, coluna: colunaOrigem},
        destino: {linha: linhaDestino, coluna: colunaDestino},
        capturada: tabuleiro[linhaDestino][colunaDestino] ? {...tabuleiro[linhaDestino][colunaDestino]} : null
    });
    
    // Movimento especial: Roque
    if (peca.tipo === PECAS.REI && Math.abs(colunaDestino - colunaOrigem) === 2) {
        // Roque pequeno (direita)
        if (colunaDestino > colunaOrigem) {
            // Mover torre
            tabuleiro[linhaDestino][5] = tabuleiro[linhaDestino][7];
            tabuleiro[linhaDestino][7] = null;
            tabuleiro[linhaDestino][5].movimentou = true;
        } 
        // Roque grande (esquerda)
        else {
            // Mover torre
            tabuleiro[linhaDestino][3] = tabuleiro[linhaDestino][0];
            tabuleiro[linhaDestino][0] = null;
            tabuleiro[linhaDestino][3].movimentou = true;
        }
    }
    
    // Movimento especial: En passant
    if (peca.tipo === PECAS.PEAO && 
        colunaDestino !== colunaOrigem && 
        !tabuleiro[linhaDestino][colunaDestino]) {
        // Capturar peão adversário
        tabuleiro[linhaOrigem][colunaDestino] = null;
    }
    
    // Movimento normal
    tabuleiro[linhaDestino][colunaDestino] = peca;
    tabuleiro[linhaOrigem][colunaOrigem] = null;
    
    // Promoção de peão
    if (peca.tipo === PECAS.PEAO && (linhaDestino === 0 || linhaDestino === 7)) {
        tabuleiro[linhaDestino][colunaDestino] = criarPeca(PECAS.RAINHA, peca.cor);
    }
}

function trocarJogador() {
    jogadorAtual = jogadorAtual === CORES.BRANCAS ? CORES.PRETAS : CORES.BRANCAS;
    document.getElementById('xadrez-jogador').textContent = `Jogador: ${jogadorAtual === CORES.BRANCAS ? 'Brancas' : 'Pretas'}`;
}

// VERIFICAÇÕES DE XEQUE E FIM DE JOGO
function encontrarRei(cor) {
    for (let linha = 0; linha < 8; linha++) {
        for (let coluna = 0; coluna < 8; coluna++) {
            const peca = tabuleiro[linha][coluna];
            if (peca && peca.tipo === PECAS.REI && peca.cor === cor) {
                return { linha, coluna };
            }
        }
    }
    return null;
}

function estaEmXeque(cor) {
    const reiPos = encontrarRei(cor);
    if (!reiPos) return true; // Rei capturado
    
    const adversario = cor === CORES.BRANCAS ? CORES.PRETAS : CORES.BRANCAS;
    
    // Verificar se alguma peça adversária ataca o rei
    for (let linha = 0; linha < 8; linha++) {
        for (let coluna = 0; coluna < 8; coluna++) {
            const peca = tabuleiro[linha][coluna];
            if (peca && peca.cor === adversario) {
                const movimentos = calcularMovimentos(linha, coluna);
                if (movimentos.some(m => m.linha === reiPos.linha && m.coluna === reiPos.coluna)) {
                    return true;
                }
            }
        }
    }
    return false;
}

function verificarXequeMate(cor) {
    if (!estaEmXeque(cor)) return false;
    
    // Verificar se existe algum movimento válido que tire do xeque
    for (let linha = 0; linha < 8; linha++) {
        for (let coluna = 0; coluna < 8; coluna++) {
            const peca = tabuleiro[linha][coluna];
            if (peca && peca.cor === cor) {
                const movimentos = calcularMovimentosValidos(linha, coluna);
                if (movimentos.length > 0) {
                    return false;
                }
            }
        }
    }
    
    return true;
}

function verificarEmpate(cor) {
    // 1. Afogamento
    if (!estaEmXeque(cor)) {
        let temMovimentoValido = false;
        
        for (let linha = 0; linha < 8; linha++) {
            for (let coluna = 0; coluna < 8; coluna++) {
                const peca = tabuleiro[linha][coluna];
                if (peca && peca.cor === cor && calcularMovimentosValidos(linha, coluna).length > 0) {
                    temMovimentoValido = true;
                    break;
                }
            }
            if (temMovimentoValido) break;
        }
        
        if (!temMovimentoValido) return true;
    }
    
    // 2. Insuficiência de material (implementação simplificada)
    const pecas = contarPecas();
    if (pecas.total === 2) return true; // Apenas dois reis
    
    return false;
}

function contarPecas() {
    let total = 0;
    let bisposBrancos = 0, bisposPretos = 0;
    let cavalosBrancos = 0, cavalosPretos = 0;
    
    for (let linha = 0; linha < 8; linha++) {
        for (let coluna = 0; coluna < 8; coluna++) {
            const peca = tabuleiro[linha][coluna];
            if (peca) {
                total++;
                if (peca.tipo === PECAS.BISPO) {
                    if (peca.cor === CORES.BRANCAS) bisposBrancos++;
                    else bisposPretos++;
                } else if (peca.tipo === PECAS.CAVALO) {
                    if (peca.cor === CORES.BRANCAS) cavalosBrancos++;
                    else cavalosPretos++;
                }
            }
        }
    }
    
    return { total, bisposBrancos, bisposPretos, cavalosBrancos, cavalosPretos };
}

// CÁLCULO DE MOVIMENTOS
function calcularMovimentosValidos(linha, coluna) {
    const movimentos = calcularMovimentos(linha, coluna);
    return movimentos.filter(mov => {
        // Fazer movimento temporário
        const pecaOriginalDestino = tabuleiro[mov.linha][mov.coluna];
        const peca = tabuleiro[linha][coluna];
        
        tabuleiro[mov.linha][mov.coluna] = peca;
        tabuleiro[linha][coluna] = null;
        
        // Verificar se o rei ficaria em xeque
        const emXeque = estaEmXeque(peca.cor);
        
        // Desfazer movimento
        tabuleiro[linha][coluna] = peca;
        tabuleiro[mov.linha][mov.coluna] = pecaOriginalDestino;
        
        return !emXeque;
    });
}

function calcularMovimentos(linha, coluna) {
    const peca = tabuleiro[linha][coluna];
    if (!peca) return [];
    
    const movimentos = [];
    
    switch (peca.tipo) {
        case PECAS.PEAO:
            calcularMovimentosPeao(linha, coluna, peca.cor, movimentos);
            break;
        case PECAS.CAVALO:
            calcularMovimentosCavalo(linha, coluna, peca.cor, movimentos);
            break;
        case PECAS.BISPO:
            calcularMovimentosBispo(linha, coluna, peca.cor, movimentos);
            break;
        case PECAS.TORRE:
            calcularMovimentosTorre(linha, coluna, peca.cor, movimentos);
            break;
        case PECAS.RAINHA:
            calcularMovimentosRainha(linha, coluna, peca.cor, movimentos);
            break;
        case PECAS.REI:
            calcularMovimentosRei(linha, coluna, peca.cor, movimentos);
            break;
    }
    
    return movimentos;
}

function calcularMovimentosPeao(linha, coluna, cor, movimentos) {
    const direcao = cor === CORES.BRANCAS ? -1 : 1;
    
    // Movimento para frente
    if (linha + direcao >= 0 && linha + direcao < 8 && !tabuleiro[linha + direcao][coluna]) {
        movimentos.push({ linha: linha + direcao, coluna });
        
        // Primeiro movimento (pode avançar 2 casas)
        if (!tabuleiro[linha][coluna].movimentou && 
            linha + 2 * direcao >= 0 && linha + 2 * direcao < 8 && 
            !tabuleiro[linha + 2 * direcao][coluna]) {
            movimentos.push({ linha: linha + 2 * direcao, coluna });
        }
    }
    
    // Captura diagonal
    for (const dc of [-1, 1]) {
        const novaColuna = coluna + dc;
        if (novaColuna >= 0 && novaColuna < 8 && linha + direcao >= 0 && linha + direcao < 8) {
            const pecaAlvo = tabuleiro[linha + direcao][novaColuna];
            if (pecaAlvo && pecaAlvo.cor !== cor) {
                movimentos.push({ linha: linha + direcao, coluna: novaColuna });
            }
        }
    }
}

function calcularMovimentosCavalo(linha, coluna, cor, movimentos) {
    const movimentosCavalo = [
        { dl: 2, dc: 1 }, { dl: 1, dc: 2 },
        { dl: -1, dc: 2 }, { dl: -2, dc: 1 },
        { dl: -2, dc: -1 }, { dl: -1, dc: -2 },
        { dl: 1, dc: -2 }, { dl: 2, dc: -1 }
    ];
    
    for (const movimento of movimentosCavalo) {
        const novaLinha = linha + movimento.dl;
        const novaColuna = coluna + movimento.dc;
        
        if (novaLinha >= 0 && novaLinha < 8 && novaColuna >= 0 && novaColuna < 8) {
            const pecaAlvo = tabuleiro[novaLinha][novaColuna];
            if (!pecaAlvo || pecaAlvo.cor !== cor) {
                movimentos.push({ linha: novaLinha, coluna: novaColuna });
            }
        }
    }
}

function calcularMovimentosBispo(linha, coluna, cor, movimentos) {
    const direcoes = [
        { dl: 1, dc: 1 }, { dl: 1, dc: -1 },
        { dl: -1, dc: 1 }, { dl: -1, dc: -1 }
    ];
    
    calcularMovimentosDirecionais(linha, coluna, cor, direcoes, movimentos);
}

function calcularMovimentosTorre(linha, coluna, cor, movimentos) {
    const direcoes = [
        { dl: 1, dc: 0 }, { dl: -1, dc: 0 },
        { dl: 0, dc: 1 }, { dl: 0, dc: -1 }
    ];
    
    calcularMovimentosDirecionais(linha, coluna, cor, direcoes, movimentos);
    
    // Roque - verificação simplificada
    if (!tabuleiro[linha][coluna].movimentou) {
        // Torre da direita (roque pequeno)
        if (tabuleiro[linha][7] && tabuleiro[linha][7].tipo === PECAS.TORRE && 
            !tabuleiro[linha][7].movimentou && 
            !tabuleiro[linha][5] && !tabuleiro[linha][6]) {
            movimentos.push({ linha, coluna: 6 });
        }
        
        // Torre da esquerda (roque grande)
        if (tabuleiro[linha][0] && tabuleiro[linha][0].tipo === PECAS.TORRE && 
            !tabuleiro[linha][0].movimentou && 
            !tabuleiro[linha][1] && !tabuleiro[linha][2] && !tabuleiro[linha][3]) {
            movimentos.push({ linha, coluna: 2 });
        }
    }
}

function calcularMovimentosRainha(linha, coluna, cor, movimentos) {
    const direcoes = [
        { dl: 1, dc: 1 }, { dl: 1, dc: -1 },
        { dl: -1, dc: 1 }, { dl: -1, dc: -1 },
        { dl: 1, dc: 0 }, { dl: -1, dc: 0 },
        { dl: 0, dc: 1 }, { dl: 0, dc: -1 }
    ];
    
    calcularMovimentosDirecionais(linha, coluna, cor, direcoes, movimentos);
}

function calcularMovimentosRei(linha, coluna, cor, movimentos) {
    for (let dl = -1; dl <= 1; dl++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dl === 0 && dc === 0) continue;
            
            const novaLinha = linha + dl;
            const novaColuna = coluna + dc;
            
            if (novaLinha >= 0 && novaLinha < 8 && novaColuna >= 0 && novaColuna < 8) {
                const pecaAlvo = tabuleiro[novaLinha][novaColuna];
                if (!pecaAlvo || pecaAlvo.cor !== cor) {
                    movimentos.push({ linha: novaLinha, coluna: novaColuna });
                }
            }
        }
    }
    
    // Roque - verificação simplificada
    if (!tabuleiro[linha][coluna].movimentou) {
        // Roque pequeno (direita)
        if (tabuleiro[linha][7] && tabuleiro[linha][7].tipo === PECAS.TORRE && 
            !tabuleiro[linha][7].movimentou && 
            !tabuleiro[linha][5] && !tabuleiro[linha][6]) {
            movimentos.push({ linha, coluna: 6 });
        }
        
        // Roque grande (esquerda)
        if (tabuleiro[linha][0] && tabuleiro[linha][0].tipo === PECAS.TORRE && 
            !tabuleiro[linha][0].movimentou && 
            !tabuleiro[linha][1] && !tabuleiro[linha][2] && !tabuleiro[linha][3]) {
            movimentos.push({ linha, coluna: 2 });
        }
    }
}

function calcularMovimentosDirecionais(linha, coluna, cor, direcoes, movimentos) {
    for (const direcao of direcoes) {
        let novaLinha = linha + direcao.dl;
        let novaColuna = coluna + direcao.dc;
        
        while (novaLinha >= 0 && novaLinha < 8 && novaColuna >= 0 && novaColuna < 8) {
            const pecaAlvo = tabuleiro[novaLinha][novaColuna];
            
            if (!pecaAlvo) {
                movimentos.push({ linha: novaLinha, coluna: novaColuna });
            } else {
                if (pecaAlvo.cor !== cor) {
                    movimentos.push({ linha: novaLinha, coluna: novaColuna });
                }
                break;
            }
            
            novaLinha += direcao.dl;
            novaColuna += direcao.dc;
        }
    }
}

// INICIAR JOGO
document.addEventListener('DOMContentLoaded', () => {
    iniciarJogo();
    document.getElementById('xadrez-reiniciar').addEventListener('click', iniciarJogo);
});