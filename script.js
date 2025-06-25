// Configurações
const TELEFONE_LOJA = "5515981475186";

// Estado da aplicação
let produtos = [];
let carrinho = [];
let termoPesquisa = '';

// Tenta carregar o carrinho do localStorage
try {
    const storedCarrinho = localStorage.getItem('carrinho');
    if (storedCarrinho) {
        carrinho = JSON.parse(storedCarrinho);
    }
} catch (e) {
    console.error('Erro ao carregar carrinho do localStorage:', e);
    localStorage.removeItem('carrinho');
}

let categoriaAtiva = 'todos';

// Elementos DOM
const produtosContainer = document.getElementById('produtos-container');
const carrinhoIcon = document.getElementById('carrinho-icon');
const carrinhoSidebar = document.getElementById('carrinho-sidebar');
const carrinhoContent = document.getElementById('carrinho-content');
const overlay = document.getElementById('overlay');
const carrinhoTotal = document.getElementById('carrinho-total');
const carrinhoCount = document.getElementById('carrinho-count');
const fecharCarrinhoBtn = document.getElementById('fechar-carrinho');
const finalizarPedidoBtn = document.getElementById('finalizar-pedido');
const categoriasMenu = document.getElementById('categorias-menu'); // Renomeado para evitar conflito
const feedback = document.getElementById('feedback');
const modalOverlay = document.getElementById('modal-overlay');
const formDadosCliente = document.getElementById('dados-cliente');
const btnCancelar = document.getElementById('cancelar-pedido');
const pesquisaInput = document.getElementById('pesquisa-input');
const pesquisaBtn = document.getElementById('pesquisa-btn');
const limparPesquisaBtn = document.getElementById('limpar-pesquisa');
const nomeClienteInput = document.getElementById('nome-cliente');
const telefoneClienteInput = document.getElementById('telefone-cliente');
const observacoesInput = document.getElementById('observacoes');
const sidebarCategorias = document.getElementById('sidebar-categorias');
const fecharCategoriasBtn = document.getElementById('fechar-categorias');

// Função para carregar produtos do JSON
async function carregarProdutos() {
    try {
        const response = await fetch('produtos.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        produtos = await response.json();
        gerarBotoesCategoria();
        renderizarProdutos();
        atualizarCarrinho();
    } catch (e) {
        console.error('Erro ao carregar produtos:', e);
        produtosContainer.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--cor-erro);">
                <p>Erro ao carregar os produtos. Por favor, tente novamente mais tarde.</p>
            </div>
        `;
    }
}

// Função para gerar os botões de categoria dinamicamente
function gerarBotoesCategoria() {
    categoriasMenu.innerHTML = ''; // Limpa os botões existentes
    
    const todosBtn = document.createElement('button');
    todosBtn.className = 'categoria-btn active';
    todosBtn.setAttribute('data-categoria', 'todos');
    todosBtn.textContent = 'Todos';
    categoriasMenu.appendChild(todosBtn);

    const categoriasSet = new Set(produtos.map(p => p.CATEGORIA));
    categoriasSet.forEach(categoria => {
        const btn = document.createElement('button');
        btn.className = 'categoria-btn';
        btn.setAttribute('data-categoria', categoria);
        btn.textContent = categoria.charAt(0).toUpperCase() + categoria.slice(1).toLowerCase();
        categoriasMenu.appendChild(btn);
    });
    
    document.querySelectorAll('.categoria-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.categoria-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            categoriaAtiva = btn.getAttribute('data-categoria');
            renderizarProdutos();
            if (window.innerWidth < 768) { // Fecha a sidebar em mobile
                sidebarCategorias.classList.remove('open');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
                document.body.style.touchAction = '';
            }
        });
    });
}

// Função para filtrar produtos com base no termo de pesquisa
function pesquisarProdutos() {
    termoPesquisa = pesquisaInput.value.trim().toLowerCase();
    limparPesquisaBtn.style.display = termoPesquisa ? 'flex' : 'none';
    renderizarProdutos();
}

// Função para renderizar produtos (com suporte à pesquisa e filtros)
function renderizarProdutos() {
    produtosContainer.innerHTML = '';
    let produtosFiltrados = produtos;
    
    // Filtrar por categoria
    if (categoriaAtiva !== 'todos') {
        produtosFiltrados = produtosFiltrados.filter(p => p.CATEGORIA === categoriaAtiva);
    }
    
    // Filtrar por termo de pesquisa
    if (termoPesquisa) {
        produtosFiltrados = produtosFiltrados.filter(p => 
            p.DESCRICAO.toLowerCase().includes(termoPesquisa) ||
            p.CATEGORIA.toLowerCase().includes(termoPesquisa) ||
            p.MATERIAL.toLowerCase().includes(termoPesquisa) ||
            p.MODELO.toLowerCase().includes(termoPesquisa) ||
            p.COR.toLowerCase().includes(termoPesquisa) ||
            String(p.TAMANHO).toLowerCase().includes(termoPesquisa) // Converte para string para pesquisa
        );
    }
    
    if (produtosFiltrados.length === 0) {
        produtosContainer.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                <p>Nenhum produto encontrado${termoPesquisa ? ' para a pesquisa "' + termoPesquisa + '"' : ''}.</p>
            </div>
        `;
        return;
    }

    produtosFiltrados.forEach(produto => {
        const produtoCard = document.createElement('div');
        produtoCard.className = 'produto-card';
        
        const imagemContainer = document.createElement('div');
        imagemContainer.className = 'produto-imagem-container';
        
        const imagem = document.createElement('img');
        imagem.className = 'produto-imagem';
        imagem.alt = produto.DESCRICAO;
        
        const placeholder = document.createElement('div');
        placeholder.className = 'placeholder-imagem';
        placeholder.textContent = 'Carregando imagem...';
        imagemContainer.appendChild(placeholder);
        
        if (produto.IMAGES && produto.IMAGES.length > 0) {
            imagem.src = produto.IMAGES[0];
            imagem.onload = () => {
                placeholder.remove();
                imagemContainer.appendChild(imagem);
            };
            
            imagem.onerror = () => {
                placeholder.textContent = 'Imagem indisponível';
                placeholder.style.backgroundColor = '#e0e0e0';
                placeholder.style.color = '#666';
            };
        } else {
            placeholder.textContent = 'Sem imagem';
            placeholder.style.backgroundColor = '#e0e0e0';
            placeholder.style.color = '#666';
        }
        
        // Formatar tamanho com " cm" se for numérico
        const tamanhoFormatado = typeof produto.TAMANHO === 'number' ? `${produto.TAMANHO} cm` : produto.TAMANHO;

        produtoCard.innerHTML = `
            <div class="produto-info">
                <div class="produto-titulo">${produto.DESCRICAO}</div>
                <div class="produto-atributos">
                    <p><strong>Material:</strong> ${produto.MATERIAL}</p>
                    <p><strong>Modelo:</strong> ${produto.MODELO}</p>
                    <p><strong>Cor:</strong> ${produto.COR}</p>
                    <p><strong>Tamanho:</strong> ${tamanhoFormatado}</p>
                    </div>
                <div class="produto-preco">R$ ${produto.PRECO.toFixed(2).replace('.', ',')}</div>
                <button class="add-carrinho" data-sku="${produto.SKU}">Adicionar ao Carrinho</button>
            </div>
        `;
        produtoCard.insertBefore(imagemContainer, produtoCard.firstChild);
        
        produtosContainer.appendChild(produtoCard);
    });

    document.querySelectorAll('.add-carrinho').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const sku = e.target.getAttribute('data-sku');
            adicionarAoCarrinho(sku);
        });
    });
}

// Funções do carrinho
function adicionarAoCarrinho(sku) {
    const produto = produtos.find(p => p.SKU === sku);
    if (!produto) return;

    const itemExistenteNoCarrinho = carrinho.find(item => item.SKU === sku);

    if (itemExistenteNoCarrinho) {
        exibirFeedback('Limite Atingido: Item já no carrinho.', 'error');
        return;
    }

    if (carrinho.length >= 2) {
        exibirFeedback('Limite Atingido: Máximo de 2 produtos diferentes no carrinho.', 'error');
        return;
    }

    carrinho.push({ ...produto, quantidade: 1 });
    salvarCarrinho();
    atualizarCarrinho();
    exibirFeedback('Incluído no carrinho', 'success');
}

function removerDoCarrinho(sku) {
    carrinho = carrinho.filter(item => item.SKU !== sku);
    salvarCarrinho();
    atualizarCarrinho();
}

function atualizarQuantidade(sku, novaQuantidade) {
    const item = carrinho.find(item => item.SKU === sku);
    if (item) {
        item.quantidade = parseInt(novaQuantidade);
        if (item.quantidade <= 0 || isNaN(item.quantidade)) {
            removerDoCarrinho(sku);
        } else {
            salvarCarrinho();
            atualizarCarrinho();
        }
    }
}

function atualizarCarrinho() {
    carrinhoContent.innerHTML = '';
    let total = 0;

    if (carrinho.length === 0) {
        carrinhoContent.innerHTML = '<div class="carrinho-vazio">Seu carrinho está vazio</div>';
    } else {
        carrinho.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'carrinho-item';
            
            const tamanhoFormatado = typeof item.TAMANHO === 'number' ? `${item.TAMANHO} cm` : item.TAMANHO;

            itemElement.innerHTML = `
                <div class="carrinho-item-img-container">
                    <img src="${item.IMAGES && item.IMAGES.length > 0 ? item.IMAGES[0] : ''}" alt="${item.DESCRICAO}" class="carrinho-item-img">
                </div>
                <div class="carrinho-item-detalhes">
                    <div class="carrinho-item-titulo">${item.DESCRICAO}</div>
                    <div class="carrinho-item-atributos">
                        <p>Tamanho: ${tamanhoFormatado}</p>
                        <p>SKU: ${item.SKU}</p>
                    </div>
                    <div class="carrinho-item-preco">R$ ${(item.PRECO * item.quantidade).toFixed(2).replace('.', ',')}</div>
                    <div class="carrinho-item-controles">
                        <button class="quantidade-btn" data-sku="${item.SKU}" data-action="decrease">-</button>
                        <input type="number" class="quantidade-input" value="${item.quantidade}" min="1" data-sku="${item.SKU}">
                        <button class="quantidade-btn" data-sku="${item.SKU}" data-action="increase">+</button>
                        <span class="remover-item" data-sku="${item.SKU}">Remover</span>
                    </div>
                </div>
            `;
            carrinhoContent.appendChild(itemElement);
            total += item.PRECO * item.quantidade;
        });

        document.querySelectorAll('.quantidade-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const sku = e.target.getAttribute('data-sku');
                const action = e.target.getAttribute('data-action');
                const input = document.querySelector(`.quantidade-input[data-sku="${sku}"]`);
                let novaQuantidade = parseInt(input.value);

                if (action === 'increase') {
                    novaQuantidade++;
                } else if (action === 'decrease') {
                    novaQuantidade--;
                }
                actualizarQuantidade(sku, novaQuantidade); // Corrigido para chamar a função correta
            });
        });

        document.querySelectorAll('.quantidade-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const sku = e.target.getAttribute('data-sku');
                const novaQuantidade = e.target.value;
                actualizarQuantidade(sku, novaQuantidade); // Corrigido para chamar a função correta
            });
        });

        document.querySelectorAll('.remover-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const sku = e.target.getAttribute('data-sku');
                removerDoCarrinho(sku);
            });
        });
    }

    carrinhoTotal.textContent = total.toFixed(2).replace('.', ',');
    carrinhoCount.textContent = carrinho.length;
    carrinhoCount.style.display = carrinho.length > 0 ? 'flex' : 'none';

    salvarCarrinho();
}

function salvarCarrinho() {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

function exibirFeedback(mensagem, tipo) {
    feedback.textContent = mensagem;
    feedback.className = `feedback show ${tipo}`;
    setTimeout(() => {
        feedback.classList.remove('show');
    }, 3000);
}

// Funções do Modal de Checkout
function abrirModalCheckout() {
    if (carrinho.length === 0) {
        exibirFeedback('Seu carrinho está vazio!', 'error');
        return;
    }
    nomeClienteInput.value = '';
    telefoneClienteInput.value = '';
    observacoesInput.value = '';
    // Remover classes de erro de campos anteriores
    nomeClienteInput.closest('.form-group').classList.remove('error');
    telefoneClienteInput.closest('.form-group').classList.remove('error');
    modalOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
}

function fecharModalCheckout() {
    modalOverlay.style.display = 'none';
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
}

function finalizarPedidoWhatsApp() {
    const nome = nomeClienteInput.value.trim();
    const telefone = telefoneClienteInput.value.trim();
    const observacoes = observacoesInput.value.trim();

    let formValido = true;

    if (!nome) {
        nomeClienteInput.closest('.form-group').classList.add('error');
        formValido = false;
    } else {
        nomeClienteInput.closest('.form-group').classList.remove('error');
    }

    if (!telefone) {
        telefoneClienteInput.closest('.form-group').classList.add('error');
        exibirFeedback('Falta informação: Telefone é obrigatório.', 'error');
        formValido = false;
    } else {
        telefoneClienteInput.closest('.form-group').classList.remove('error');
    }

    if (!formValido) {
        exibirFeedback('Falta informação: Preencha todos os campos obrigatórios.', 'error');
        return;
    }

    let mensagem = `Olá! Gostaria de fazer um pedido na Loja Salve Maria Imaculada.\n\n`;
    mensagem += `*Dados do Cliente:*\n`;
    mensagem += `Nome: ${nome}\n`;
    mensagem += `Telefone: ${telefone}\n`;
    if (observacoes) {
        mensagem += `Observações: ${observacoes}\n`;
    }
    mensagem += `\n*Meu Pedido:*\n`;

    carrinho.forEach(item => {
        const subtotal = (item.PRECO * item.quantidade).toFixed(2).replace('.', ',');
        const tamanhoFormatado = typeof item.TAMANHO === 'number' ? `${item.TAMANHO} cm` : item.TAMANHO;
        mensagem += `----------\n`;
        mensagem += `Produto: ${item.DESCRICAO}\n`;
        mensagem += `Valor Unitário: R$ ${item.PRECO.toFixed(2).replace('.', ',')}\n`;
        mensagem += `Quantidade: ${item.quantidade}\n`;
        mensagem += `Subtotal: R$ ${subtotal}\n`;
        mensagem += `SKU: ${item.SKU}\n`;
    });

    const totalGeral = carrinho.reduce((sum, item) => sum + (item.PRECO * item.quantidade), 0);
    mensagem += `----------\n`;
    mensagem += `*Total Geral do Pedido: R$ ${totalGeral.toFixed(2).replace('.', ',')}*\n\n`;
    mensagem += `Confirme, por gentileza, a disponibilidade e o frete.`;

    const urlWhatsApp = `https://api.whatsapp.com/send?phone=${TELEFONE_LOJA}&text=${encodeURIComponent(mensagem)}`;
    window.open(urlWhatsApp, '_blank');
    
    // Limpar carrinho e fechar modal após o envio (opcional, pode ser uma confirmação do usuário)
    carrinho = [];
    salvarCarrinho();
    atualizarCarrinho();
    fecharModalCheckout();
    exibirFeedback('Pedido enviado para o WhatsApp!', 'success');
}


// Event Listeners
pesquisaBtn.addEventListener('click', pesquisarProdutos);
limparPesquisaBtn.addEventListener('click', () => {
    pesquisaInput.value = '';
    pesquisarProdutos();
});
pesquisaInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        pesquisarProdutos();
    } else {
        limparPesquisaBtn.style.display = pesquisaInput.value.trim() ? 'flex' : 'none';
    }
});

carrinhoIcon.addEventListener('click', () => {
    console.log('Ícone do carrinho clicado');
    carrinhoSidebar.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
});

fecharCarrinhoBtn.addEventListener('click', () => {
    carrinhoSidebar.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
});

overlay.addEventListener('click', () => {
    // Only close if not interacting with modal
    if (modalOverlay.style.display !== 'flex') {
        carrinhoSidebar.classList.remove('open');
        sidebarCategorias.classList.remove('open'); // Fechar também a sidebar de categorias
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        document.body.style.touchAction = '';
    }
});

// Event listener para o botão de finalizar pedido que abre o modal
finalizarPedidoBtn.addEventListener('click', abrirModalCheckout);
finalizarPedidoBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    abrirModalCheckout();
}, { passive: false });

// Event listeners do modal
formDadosCliente.addEventListener('submit', (e) => {
    e.preventDefault();
    finalizarPedidoWhatsApp();
});

btnCancelar.addEventListener('click', fecharModalCheckout);

// Adicionar um botão para abrir a sidebar de categorias em telas pequenas
// Este botão precisaria ser adicionado no index.html, por exemplo, no header
// Exemplo (adicionar ao index.html): <button id="abrir-categorias-mobile" class="menu-mobile-btn">☰ Categorias</button>
const abrirCategoriasMobileBtn = document.getElementById('abrir-categorias-mobile'); // Assumindo que este ID exista
if (abrirCategoriasMobileBtn) {
    abrirCategoriasMobileBtn.addEventListener('click', () => {
        sidebarCategorias.classList.add('open');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        document.body.style.touchAction = 'none';
    });
}

fecharCategoriasBtn.addEventListener('click', () => {
    sidebarCategorias.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
});


// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    console.log('Inicializando loja...');
    carregarProdutos();
    
    // O ícone do carrinho já deve estar visível por CSS (position: fixed)
    // carrinhoIcon.style.display = 'flex'; // Removido, pois é handled by CSS

    if (carrinho.length > 0) {
        carrinhoCount.style.display = 'flex';
    }
});
