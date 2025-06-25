// Configurações
const TELEFONE_LOJA = "5515981475186";
const MAX_PRODUTOS_CARRINHO = 2; // Novo limite de produtos diferentes no carrinho

// Estado da aplicação
let produtos = [];
let carrinho = [];
let termoPesquisa = '';
let carrinhoInteracting = false; // Flag para controlar interação com o carrinho

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
const carrinhoSidebar = document.getElementById('carrinho-sidebar');
const carrinhoContent = document.getElementById('carrinho-content');
const overlay = document.getElementById('overlay');
const carrinhoTotal = document.getElementById('carrinho-total');
const carrinhoCount = document.getElementById('carrinho-count');
const carrinhoCountFlutuante = document.getElementById('carrinho-count-flutuante'); // Novo elemento
const fecharCarrinhoBtn = document.getElementById('fechar-carrinho');
const finalizarPedidoBtn = document.getElementById('finalizar-pedido');
const categoriasContainer = document.querySelector('.categorias');
const feedback = document.getElementById('feedback');
const modalOverlay = document.getElementById('modal-overlay');
const formDadosCliente = document.getElementById('dados-cliente');
const btnCancelar = document.getElementById('cancelar-pedido');
const pesquisaInput = document.getElementById('pesquisa-input');
const pesquisaBtn = document.getElementById('pesquisa-btn');
const limparPesquisaBtn = document.getElementById('limpar-pesquisa');
const carrinhoIconFlutuante = document.getElementById('carrinho-icon-flutuante'); // Novo elemento


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
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        produtosContainer.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--cor-erro);">
                                        <p>Não foi possível carregar os produtos. Tente novamente mais tarde.</p>
                                    </div>`;
    }
}

// Função para gerar os botões de categoria dinamicamente
function gerarBotoesCategoria() {
    const todosBtn = document.querySelector('.categoria-btn[data-categoria="todos"]');
    categoriasContainer.innerHTML = '';
    categoriasContainer.appendChild(todosBtn);
    
    const categorias = [...new Set(produtos.map(p => p.CATEGORIA))];
    categorias.forEach(categoria => {
        const btn = document.createElement('button');
        btn.className = 'categoria-btn';
        btn.setAttribute('data-categoria', categoria);
        btn.textContent = categoria.charAt(0).toUpperCase() + categoria.slice(1).toLowerCase();
        categoriasContainer.appendChild(btn);
    });
    
    document.querySelectorAll('.categoria-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.categoria-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            categoriaAtiva = btn.getAttribute('data-categoria');
            renderizarProdutos();
        });
    });
}

// Função para filtrar produtos com base no termo de pesquisa
function pesquisarProdutos() {
    termoPesquisa = pesquisaInput.value.trim().toLowerCase();
    limparPesquisaBtn.style.display = termoPesquisa ? 'flex' : 'none';
    renderizarProdutos();
}

// Função para renderizar produtos (com suporte à pesquisa)
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
            p.TAMANHO.toLowerCase().includes(termoPesquisa) ||
            p.SKU.toLowerCase().includes(termoPesquisa)
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
        
        const tamanhoFormatado = produto.TAMANHO && !isNaN(produto.TAMANHO) ? `${produto.TAMANHO} cm` : produto.TAMANHO;

        produtoCard.innerHTML = `
            <div class="produto-info">
                <div class="produto-titulo">${produto.DESCRICAO}</div>
                <div class="produto-atributos">
                    <p><strong>Material:</strong> ${produto.MATERIAL}</p>
                    <p><strong>Modelo:</strong> ${produto.MODELO}</p>
                    <p><strong>Cor:</strong> ${produto.COR}</p>
                    <p><strong>Tamanho:</strong> ${tamanhoFormatado}</p>
                    <p class="sku-info"><strong>SKU:</strong> ${produto.SKU}</p>
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

    const itemExistente = carrinho.find(item => item.SKU === sku);

    if (itemExistente) {
        mostrarFeedback("Limite Atingido", true); // Já no carrinho
    } else {
        if (carrinho.length >= MAX_PRODUTOS_CARRINHO) {
            mostrarFeedback("Limite Atingido", true); // Mais de 2 produtos diferentes
            return;
        }
        carrinho.push({ ...produto, quantidade: 1 });
        salvarCarrinho();
        atualizarCarrinho();
        mostrarFeedback("Incluído no carrinho", false);
    }
}

function removerDoCarrinho(sku) {
    carrinho = carrinho.filter(item => item.SKU !== sku);
    salvarCarrinho();
    atualizarCarrinho();
    if (carrinho.length === 0) {
        carrinhoContent.innerHTML = '<div class="carrinho-vazio">Seu carrinho está vazio</div>';
    }
}

function alterarQuantidade(sku, delta) {
    carrinhoInteracting = true; // Inicia interação
    const item = carrinho.find(item => item.SKU === sku);
    if (item) {
        item.quantidade += delta;
        if (item.quantidade <= 0) {
            removerDoCarrinho(sku);
        } else {
            salvarCarrinho();
            atualizarCarrinho();
        }
    }
    carrinhoInteracting = false; // Finaliza interação
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
            
            const tamanhoFormatado = item.TAMANHO && !isNaN(item.TAMANHO) ? `${item.TAMANHO} cm` : item.TAMANHO;

            itemElement.innerHTML = `
                <div class="carrinho-item-img-container">
                    <img src="${item.IMAGES && item.IMAGES.length > 0 ? item.IMAGES[0] : 'https://via.placeholder.com/70'}" alt="${item.DESCRICAO}" class="carrinho-item-img">
                </div>
                <div class="carrinho-item-detalhes">
                    <div class="carrinho-item-titulo">${item.DESCRICAO}</div>
                    <div class="carrinho-item-atributos">
                        <p>Material: ${item.MATERIAL}</p>
                        <p>Tamanho: ${tamanhoFormatado}</p>
                    </div>
                    <div class="carrinho-item-preco">R$ ${(item.PRECO * item.quantidade).toFixed(2).replace('.', ',')}</div>
                    <div class="carrinho-item-controles">
                        <button class="quantidade-btn" data-sku="${item.SKU}" data-delta="-1">-</button>
                        <input type="number" class="quantidade-input" value="${item.quantidade}" min="1" data-sku="${item.SKU}">
                        <button class="quantidade-btn" data-sku="${item.SKU}" data-delta="1">+</button>
                        <span class="remover-item" data-sku="${item.SKU}">Remover</span>
                    </div>
                </div>
            `;
            carrinhoContent.appendChild(itemElement);
            total += item.PRECO * item.quantidade;
        });
    }

    carrinhoTotal.textContent = total.toFixed(2).replace('.', ',');
    carrinhoCount.textContent = carrinho.length;
    carrinhoCountFlutuante.textContent = carrinho.length; // Atualiza o contador do ícone flutuante

    // Esconde o contador se o carrinho estiver vazio
    if (carrinho.length > 0) {
        carrinhoCount.style.display = 'flex';
        carrinhoCountFlutuante.style.display = 'flex';
    } else {
        carrinhoCount.style.display = 'none';
        carrinhoCountFlutuante.style.display = 'none';
    }

    // Adiciona event listeners para os botões de quantidade e remover
    document.querySelectorAll('.quantidade-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const sku = e.target.getAttribute('data-sku');
            const delta = parseInt(e.target.getAttribute('data-delta'));
            alterarQuantidade(sku, delta);
        });
    });

    document.querySelectorAll('.quantidade-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const sku = e.target.getAttribute('data-sku');
            const novaQuantidade = parseInt(e.target.value);
            const item = carrinho.find(item => item.SKU === sku);
            if (item && novaQuantidade >= 1) {
                item.quantidade = novaQuantidade;
                salvarCarrinho();
                atualizarCarrinho();
            } else if (item && novaQuantidade < 1) {
                removerDoCarrinho(sku);
            }
        });
    });

    document.querySelectorAll('.remover-item').forEach(span => {
        span.addEventListener('click', (e) => {
            const sku = e.target.getAttribute('data-sku');
            removerDoCarrinho(sku);
        });
    });
}

function salvarCarrinho() {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

function mostrarFeedback(message, isError) {
    feedback.textContent = message;
    feedback.classList.remove('show', 'error');
    if (isError) {
        feedback.classList.add('error');
    }
    feedback.classList.add('show');
    setTimeout(() => {
        feedback.classList.remove('show');
    }, 2000);
}

// Funções do Modal de Cliente
function abrirModalCliente() {
    if (carrinho.length === 0) {
        mostrarFeedback("Seu carrinho está vazio!", true);
        return;
    }
    modalOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Evita rolagem do fundo
    carrinhoSidebar.classList.remove('open'); // Fecha o carrinho ao abrir o modal
    overlay.classList.remove('active');
}

function fecharModalCliente() {
    modalOverlay.style.display = 'none';
    document.body.style.overflow = '';
    // Limpar campos e feedback de erro
    formDadosCliente.reset();
    document.querySelectorAll('.form-group').forEach(group => group.classList.remove('error'));
    const alertElement = document.querySelector('.modal-alert');
    if (alertElement) alertElement.remove();
}

function finalizarPedidoWhatsApp(event) {
    if (event) event.preventDefault(); // Previne o envio padrão do formulário se for um evento de submit

    const nomeCliente = document.getElementById('nome-cliente').value.trim();
    const telefoneCliente = document.getElementById('telefone-cliente').value.trim();
    const observacoes = document.getElementById('observacoes').value.trim();

    // Remover alertas anteriores
    const oldAlert = formDadosCliente.querySelector('.modal-alert');
    if (oldAlert) oldAlert.remove();
    document.querySelectorAll('.form-group').forEach(group => group.classList.remove('error'));


    if (!nomeCliente || !telefoneCliente) {
        const alertElement = document.createElement('div');
        alertElement.className = 'modal-alert';
        alertElement.textContent = 'Falta informação';
        formDadosCliente.prepend(alertElement); // Adiciona antes do primeiro form-group

        if (!nomeCliente) {
            document.getElementById('nome-cliente').closest('.form-group').classList.add('error');
        }
        if (!telefoneCliente) {
            document.getElementById('telefone-cliente').closest('.form-group').classList.add('error');
        }
        return;
    }

    let mensagem = `Olá, gostaria de fazer o seguinte pedido da Loja Salve Maria Imaculada:\n\n`;

    carrinho.forEach(item => {
        const subtotal = (item.PRECO * item.quantidade).toFixed(2).replace('.', ',');
        mensagem += `*Produto:* ${item.DESCRICAO}\n`;
        mensagem += `*Valor Unitário:* R$ ${item.PRECO.toFixed(2).replace('.', ',')}\n`;
        mensagem += `*Quantidade:* ${item.quantidade}\n`;
        mensagem += `*Subtotal:* R$ ${subtotal}\n`;
        mensagem += `*SKU:* ${item.SKU}\n`;
        mensagem += `----------\n`;
    });

    const totalGeral = carrinho.reduce((sum, item) => sum + (item.PRECO * item.quantidade), 0);
    mensagem += `*Total Geral:* R$ ${totalGeral.toFixed(2).replace('.', ',')}\n\n`;
    mensagem += `*Dados do Cliente:*\n`;
    mensagem += `*Nome:* ${nomeCliente}\n`;
    mensagem += `*Telefone:* ${telefoneCliente}\n`;
    if (observacoes) {
        mensagem += `*Observações:* ${observacoes}\n`;
    }
    mensagem += `\nConfirme, por gentileza, a disponibilidade e o frete.`;

    const urlWhatsApp = `https://wa.me/${TELEFONE_LOJA}?text=${encodeURIComponent(mensagem)}`;
    window.open(urlWhatsApp, '_blank');

    // Limpar carrinho e fechar modal após o envio (simulado)
    carrinho = [];
    salvarCarrinho();
    atualizarCarrinho();
    fecharModalCliente();
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

carrinhoIconFlutuante.addEventListener('click', () => {
    if (carrinhoSidebar.classList.contains('open')) {
        carrinhoSidebar.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        document.body.style.touchAction = '';
    } else {
        carrinhoSidebar.classList.add('open');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        document.body.style.touchAction = 'none';
    }
});

fecharCarrinhoBtn.addEventListener('click', () => {
    if (!carrinhoInteracting) { // Só fecha se não estiver interagindo
        carrinhoSidebar.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        document.body.style.touchAction = '';
    }
});

overlay.addEventListener('click', () => {
    if (!carrinhoInteracting) { // Só fecha se não estiver interagindo
        carrinhoSidebar.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        document.body.style.touchAction = '';
    }
});

// Impede o fechamento do carrinho ao clicar dentro dele (a menos que seja um botão de controle)
carrinhoSidebar.addEventListener('click', (e) => {
    if (e.target.closest('.quantidade-btn') || e.target.closest('.remover-item') || e.target.closest('.quantidade-input')) {
        // Interacting with cart controls
        carrinhoInteracting = true;
    } else {
        carrinhoInteracting = false;
    }
});


finalizarPedidoBtn.addEventListener('click', abrirModalCliente);
finalizarPedidoBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    abrirModalCliente();
}, { passive: false });

btnCancelar.addEventListener('click', fecharModalCliente);
formDadosCliente.addEventListener('submit', finalizarPedidoWhatsApp);

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    console.log('Inicializando loja...');
    carregarProdutos();
    
    // Initial display for floating cart icon and count
    if (carrinho.length > 0) {
        carrinhoCountFlutuante.style.display = 'flex';
    }
});
