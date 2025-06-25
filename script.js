// Configurações
const TELEFONE_LOJA = "5515981475186";
const MAX_PRODUTO_CARRINHO = 2; // Limite máximo de cada produto no carrinho

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
const categoriasContainer = document.getElementById('categorias-menu'); // Changed to id
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


// Função para carregar produtos
async function carregarProdutos() {
    try {
        const response = await fetch('produtos.json');
        produtos = await response.json();
        gerarBotoesCategoria();
        renderizarProdutos();
        atualizarCarrinho();
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        produtosContainer.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                <p>Ocorreu um erro ao carregar os produtos. Tente novamente mais tarde.</p>
            </div>
        `;
    }
}

// Função para gerar os botões de categoria dinamicamente
function gerarBotoesCategoria() {
    const todosBtn = categoriasContainer.querySelector('.categoria-btn[data-categoria="todos"]');
    categoriasContainer.innerHTML = ''; // Clear existing buttons
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
            (typeof p.TAMANHO === 'string' && p.TAMANHO.toLowerCase().includes(termoPesquisa)) ||
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
        
        const tamanhoExibicao = produto.TAMANHO === "Bolso" || produto.TAMANHO === "media" ? produto.TAMANHO : `${produto.TAMANHO} cm`;

        produtoCard.innerHTML = `
            <div class="produto-info">
                <div class="produto-titulo">${produto.DESCRICAO}</div>
                <div class="produto-atributos">
                    <p><strong>Material:</strong> ${produto.MATERIAL}</p>
                    <p><strong>Modelo:</strong> ${produto.MODELO}</p>
                    <p><strong>Cor:</strong> ${produto.COR}</p>
                    <p><strong>Tamanho:</strong> ${tamanhoExibicao}</p>
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
function adicionarAoCarrinho(sku, quantidade = 1) {
    const produto = produtos.find(p => p.SKU === sku);
    if (!produto) return;

    const itemExistente = carrinho.find(item => item.SKU === sku);

    if (itemExistente) {
        if (itemExistente.quantidade + quantidade > MAX_PRODUTO_CARRINHO) {
            mostrarFeedback('Limite Atingido', true);
            return;
        }
        itemExistente.quantidade += quantidade;
    } else {
        if (quantidade > MAX_PRODUTO_CARRINHO) {
            mostrarFeedback('Limite Atingido', true);
            return;
        }
        carrinho.push({ ...produto, quantidade });
    }
    
    salvarCarrinho();
    atualizarCarrinho();
    mostrarFeedback('Incluído no carrinho', false);
}

function removerDoCarrinho(sku) {
    carrinho = carrinho.filter(item => item.SKU !== sku);
    salvarCarrinho();
    atualizarCarrinho();
}

function atualizarQuantidade(sku, novaQuantidade) {
    const item = carrinho.find(item => item.SKU === sku);
    if (item) {
        if (novaQuantidade <= 0) {
            removerDoCarrinho(sku);
            return;
        }
        if (novaQuantidade > MAX_PRODUTO_CARRINHO) {
            mostrarFeedback('Limite Atingido', true);
            return;
        }
        item.quantidade = novaQuantidade;
        salvarCarrinho();
        atualizarCarrinho();
    }
}

function salvarCarrinho() {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

function atualizarCarrinho() {
    carrinhoContent.innerHTML = '';
    let total = 0;

    if (carrinho.length === 0) {
        carrinhoContent.innerHTML = '<div class="carrinho-vazio">Seu carrinho está vazio</div>';
        carrinhoCount.style.display = 'none';
    } else {
        carrinhoCount.style.display = 'flex';
        carrinhoCount.textContent = carrinho.reduce((sum, item) => sum + item.quantidade, 0);

        carrinho.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'carrinho-item';
            
            const tamanhoExibicao = item.TAMANHO === "Bolso" || item.TAMANHO === "media" ? item.TAMANHO : `${item.TAMANHO} cm`;

            itemElement.innerHTML = `
                <div class="carrinho-item-img-container">
                    <img src="${item.IMAGES && item.IMAGES[0] ? item.IMAGES[0] : ''}" alt="${item.DESCRICAO}" class="carrinho-item-img" onerror="this.onerror=null;this.src='placeholder.png';">
                </div>
                <div class="carrinho-item-detalhes">
                    <div class="carrinho-item-titulo">${item.DESCRICAO}</div>
                    <div class="carrinho-item-atributos">
                        <p>Tamanho: ${tamanhoExibicao}</p>
                    </div>
                    <div class="carrinho-item-preco">R$ ${(item.PRECO * item.quantidade).toFixed(2).replace('.', ',')}</div>
                    <div class="carrinho-item-controles">
                        <button class="quantidade-btn decrease" data-sku="${item.SKU}">-</button>
                        <input type="number" class="quantidade-input" value="${item.quantidade}" min="1" max="${MAX_PRODUTO_CARRINHO}" data-sku="${item.SKU}">
                        <button class="quantidade-btn increase" data-sku="${item.SKU}">+</button>
                        <span class="remover-item" data-sku="${item.SKU}">Remover</span>
                    </div>
                </div>
            `;
            carrinhoContent.appendChild(itemElement);

            total += item.PRECO * item.quantidade;
        });

        // Adicionar event listeners para os botões de quantidade e remover
        carrinhoContent.querySelectorAll('.quantidade-btn.decrease').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const sku = e.target.getAttribute('data-sku');
                const input = carrinhoContent.querySelector(`.quantidade-input[data-sku="${sku}"]`);
                updateQuantityInCart(sku, parseInt(input.value) - 1);
            });
        });

        carrinhoContent.querySelectorAll('.quantidade-btn.increase').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const sku = e.target.getAttribute('data-sku');
                const input = carrinhoContent.querySelector(`.quantidade-input[data-sku="${sku}"]`);
                updateQuantityInCart(sku, parseInt(input.value) + 1);
            });
        });

        carrinhoContent.querySelectorAll('.quantidade-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const sku = e.target.getAttribute('data-sku');
                updateQuantityInCart(sku, parseInt(e.target.value));
            });
        });

        carrinhoContent.querySelectorAll('.remover-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const sku = e.target.getAttribute('data-sku');
                removerDoCarrinho(sku);
            });
        });
    }

    carrinhoTotal.textContent = total.toFixed(2).replace('.', ',');
}

function updateQuantityInCart(sku, newQuantity) {
    const item = carrinho.find(cartItem => cartItem.SKU === sku);
    if (item) {
        if (newQuantity > MAX_PRODUTO_CARRINHO) {
            mostrarFeedback('Limite Atingido', true);
            // Revert input value to max allowed or current quantity
            const input = carrinhoContent.querySelector(`.quantidade-input[data-sku="${sku}"]`);
            if (input) input.value = item.quantidade; // Keep the current valid quantity
            return;
        }
        if (newQuantity <= 0) {
            removerDoCarrinho(sku);
        } else {
            item.quantidade = newQuantity;
            salvarCarrinho();
            atualizarCarrinho();
        }
    }
}

// Funções de feedback e modal
function mostrarFeedback(message, isError) {
    feedback.textContent = message;
    feedback.classList.remove('show', 'error');
    if (isError) {
        feedback.classList.add('error');
    }
    feedback.classList.add('show');

    setTimeout(() => {
        feedback.classList.remove('show');
    }, 3000);
}

function abrirModalPedido() {
    if (carrinho.length === 0) {
        mostrarFeedback('Seu carrinho está vazio!', true);
        return;
    }
    modalOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
}

function fecharModalPedido() {
    modalOverlay.style.display = 'none';
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
    // Limpar campos do formulário e resetar destaques
    formDadosCliente.reset();
    document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
        input.classList.remove('input-error');
    });
}

function finalizarPedidoWhatsApp() {
    abrirModalPedido();
}

formDadosCliente.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Validação
    let formValido = true;
    const camposObrigatorios = [nomeClienteInput]; // Telefone é opcional agora

    camposObrigatorios.forEach(input => {
        if (input.value.trim() === '') {
            input.classList.add('input-error');
            formValido = false;
        } else {
            input.classList.remove('input-error');
        }
    });

    if (!formValido) {
        mostrarFeedback('Falta informação', true);
        return;
    }

    const nomeCliente = nomeClienteInput.value.trim();
    const telefoneCliente = telefoneClienteInput.value.trim();
    const observacoes = observacoesInput.value.trim();

    let mensagem = `Olá! Gostaria de fazer um pedido na Loja Salve Maria Imaculada:%0A%0A`;

    carrinho.forEach(item => {
        const subtotal = item.PRECO * item.quantidade;
        const tamanhoExibicao = item.TAMANHO === "Bolso" || item.TAMANHO === "media" ? item.TAMANHO : `${item.TAMANHO} cm`;
        
        mensagem += `*Produto:* ${item.DESCRICAO}%0A`;
        mensagem += `*SKU:* ${item.SKU}%0A`;
        mensagem += `*Tamanho:* ${tamanhoExibicao}%0A`;
        mensagem += `*Valor Unitário:* R$ ${item.PRECO.toFixed(2).replace('.', ',')}%0A`;
        mensagem += `*Quantidade:* ${item.quantidade}%0A`;
        mensagem += `*Subtotal:* R$ ${subtotal.toFixed(2).replace('.', ',')}%0A`;
        mensagem += `----------%0A`;
    });

    const totalPedido = carrinho.reduce((sum, item) => sum + (item.PRECO * item.quantidade), 0);
    mensagem += `*Total do Pedido:* R$ ${totalPedido.toFixed(2).replace('.', ',')}%0A%0A`;

    if (observacoes) {
        mensagem += `*Observações:* ${observacoes}%0A%0A`;
    }
    
    mensagem += `*Nome do Cliente:* ${nomeCliente}%0A`;
    if (telefoneCliente) {
        mensagem += `*Telefone:* ${telefoneCliente}%0A%0A`;
    }

    mensagem += `Confirme, por gentileza, a disponibilidade e o frete.`;

    // Redirecionar para o WhatsApp
    const urlWhatsapp = `https://wa.me/${TELEFONE_LOJA}?text=${mensagem}`;
    window.open(urlWhatsapp, '_blank');

    // Limpar carrinho e fechar modal após o envio
    carrinho = [];
    salvarCarrinho();
    atualizarCarrinho();
    fecharModalPedido();
    mostrarFeedback('Pedido enviado!', false);
});

// Event Listeners
carrinhoIcon.addEventListener('click', () => {
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
    carrinhoSidebar.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
});

btnCancelar.addEventListener('click', fecharModalPedido);

finalizarPedidoBtn.addEventListener('click', finalizarPedidoWhatsApp);
finalizarPedidoBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    finalizarPedidoWhatsApp();
}, { passive: false });

pesquisaBtn.addEventListener('click', pesquisarProdutos);
pesquisaInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        pesquisarProdutos();
    }
    limparPesquisaBtn.style.display = pesquisaInput.value.trim() ? 'flex' : 'none';
});

limparPesquisaBtn.addEventListener('click', () => {
    pesquisaInput.value = '';
    pesquisarProdutos();
});

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    carregarProdutos();
    
    carrinhoIcon.style.display = 'flex';
    if (carrinho.length > 0) {
        carrinhoCount.style.display = 'flex';
    }
});
