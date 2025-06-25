// Configurações
const TELEFONE_LOJA = "5515981475186";

// Estado da aplicação
let produtos = [];
let carrinho = [];
let termoPesquisa = '';
let isCartLocked = false; // New state variable for cart interaction lock

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
const carrinhoFloatIcon = document.getElementById('carrinho-float-icon'); // Renamed ID
const carrinhoSidebar = document.getElementById('carrinho-sidebar');
const carrinhoContent = document.getElementById('carrinho-content');
const overlay = document.getElementById('overlay');
const carrinhoTotal = document.getElementById('carrinho-total');
const carrinhoCount = document.getElementById('carrinho-count');
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
const nomeClienteInput = document.getElementById('nome-cliente');
const telefoneClienteInput = document.getElementById('telefone-cliente');

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
        console.error("Erro ao carregar produtos:", error);
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
            p.TAMANHO.toString().toLowerCase().includes(termoPesquisa) // Convert to string for search
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
        
        // Format size with "cm" if it's a number, otherwise display as is
        const tamanhoDisplay = typeof produto.TAMANHO === 'number' ? `${produto.TAMANHO} cm` : produto.TAMANHO;

        produtoCard.innerHTML = `
            <div class="produto-info">
                <div class="produto-titulo">${produto.DESCRICAO}</div>
                <div class="produto-atributos">
                    <p><strong>Material:</strong> ${produto.MATERIAL}</p>
                    <p><strong>Modelo:</strong> ${produto.MODELO}</p>
                    <p><strong>Cor:</strong> ${produto.COR}</p>
                    <p><strong>Tamanho:</strong> ${tamanhoDisplay}</p>
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
    
    // Check for product limit (1 per product, max 2 different products)
    if (itemExistente) {
        mostrarFeedback('Limite Atingido', true); // Error feedback for already added product
        return;
    } else {
        if (carrinho.length >= 2) {
            mostrarFeedback('Limite de 2 produtos diferentes por compra', true); // Error feedback for max items
            return;
        }
        carrinho.push({
            ...produto,
            quantidade: 1 // Always start with quantity 1 for unique products
        });
        mostrarFeedback('Incluído no carrinho', false); // Success feedback
    }

    atualizarCarrinho();
    lockCartInteraction(true); // Lock cart interaction when adding
    setTimeout(() => lockCartInteraction(false), 500); // Unlock after a short delay
}

function removerDoCarrinho(sku) {
    carrinho = carrinho.filter(item => item.SKU !== sku);
    atualizarCarrinho();
    mostrarFeedback('Produto removido do carrinho');
    lockCartInteraction(true); // Lock cart interaction when removing
    setTimeout(() => lockCartInteraction(false), 500); // Unlock after a short delay
}

function atualizarQuantidade(sku, novaQuantidade) {
    const item = carrinho.find(item => item.SKU === sku);
    if (item) {
        item.quantidade = Math.max(1, novaQuantidade);
        atualizarCarrinho();
        lockCartInteraction(true); // Lock cart interaction when changing quantity
        setTimeout(() => lockCartInteraction(false), 500); // Unlock after a short delay
    }
}

// Function to lock/unlock cart interactions
function lockCartInteraction(lock) {
    isCartLocked = lock;
    if (lock) {
        carrinhoSidebar.classList.add('locked'); // Add a class to indicate locked state (for CSS cursor/pointer-events)
    } else {
        carrinhoSidebar.classList.remove('locked');
    }
}

// Função para atualizar o carrinho
function atualizarCarrinho() {
    if (typeof carrinho === 'undefined') {
        carrinho = [];
    }

    try {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('carrinho', JSON.stringify(carrinho));
        }
    } catch (e) {
        console.error('Erro ao acessar localStorage:', e);
        // Fallback for environments where localStorage is not available (e.g., some sandboxed environments)
    }

    carrinhoContent.innerHTML = '';
    let total = 0;

    if (carrinho.length === 0) {
        carrinhoContent.innerHTML = '<div class="carrinho-vazio">Seu carrinho está vazio</div>';
        carrinhoCount.style.display = 'none';
        carrinhoCount.textContent = '0';
    } else {
        carrinho.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'carrinho-item';
            
            // Format size with "cm" if it's a number, otherwise display as is
            const tamanhoDisplay = typeof item.TAMANHO === 'number' ? `${item.TAMANHO} cm` : item.TAMANHO;

            itemElement.innerHTML = `
                <div class="carrinho-item-img-container">
                    <img src="${item.IMAGES && item.IMAGES.length > 0 ? item.IMAGES[0] : 'https://via.placeholder.com/70x70?text=Sem+Imagem'}" alt="${item.DESCRICAO}" class="carrinho-item-img">
                </div>
                <div class="carrinho-item-detalhes">
                    <div class="carrinho-item-titulo">${item.DESCRICAO}</div>
                    <div class="carrinho-item-atributos">
                        <p>Tamanho: ${tamanhoDisplay}</p>
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

        carrinhoContent.querySelectorAll('.quantidade-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const sku = e.target.getAttribute('data-sku');
                const action = e.target.getAttribute('data-action');
                const input = carrinhoContent.querySelector(`.quantidade-input[data-sku="${sku}"]`);
                let novaQuantidade = parseInt(input.value);

                if (action === 'increase') {
                    novaQuantidade++;
                } else if (action === 'decrease') {
                    novaQuantidade--;
                }
                atualizarQuantidade(sku, novaQuantidade);
            });
        });

        carrinhoContent.querySelectorAll('.quantidade-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const sku = e.target.getAttribute('data-sku');
                const novaQuantidade = parseInt(e.target.value);
                atualizarQuantidade(sku, novaQuantidade);
            });
        });

        carrinhoContent.querySelectorAll('.remover-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const sku = e.target.getAttribute('data-sku');
                removerDoCarrinho(sku);
            });
        });
        
        carrinhoCount.style.display = 'flex';
        carrinhoCount.textContent = carrinho.length.toString(); // Count distinct products
    }

    carrinhoTotal.textContent = total.toFixed(2).replace('.', ',');
}

function mostrarFeedback(message, isError = false) {
    feedback.textContent = message;
    feedback.className = 'feedback show'; // Reset classes
    if (isError) {
        feedback.classList.add('error');
    } else {
        feedback.classList.remove('error');
    }

    setTimeout(() => {
        feedback.classList.remove('show');
    }, 3000);
}

function toggleCarrinhoSidebar() {
    if (carrinhoSidebar.classList.contains('open')) {
        // If cart is open and not locked, close it
        if (!isCartLocked) {
            carrinhoSidebar.classList.remove('open');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
            document.body.style.touchAction = '';
        }
    } else {
        // Open cart
        carrinhoSidebar.classList.add('open');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        document.body.style.touchAction = 'none';
    }
}


function finalizarPedidoWhatsApp() {
    if (carrinho.length === 0) {
        mostrarFeedback('Seu carrinho está vazio!', true);
        return;
    }

    // Show the modal for customer information
    modalOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent scrolling background
    document.body.style.touchAction = 'none';
}

function gerarMensagemWhatsApp(nome, telefone, observacoes) {
    let mensagem = `Olá! Meu nome é ${nome}.`;
    if (telefone) {
        mensagem += `\nMeu WhatsApp é: ${telefone}.`;
    }
    mensagem += `\nGostaria de finalizar meu pedido:\n\n`;

    let totalPedido = 0;

    carrinho.forEach(item => {
        const subtotalItem = item.PRECO * item.quantidade;
        totalPedido += subtotalItem;
        
        // Format size with "cm" if it's a number, otherwise display as is
        const tamanhoDisplay = typeof item.TAMANHO === 'number' ? `${item.TAMANHO} cm` : item.TAMANHO;

        mensagem += `Produto: ${item.DESCRICAO}\n`;
        mensagem += `Valor Unitário: R$ ${item.PRECO.toFixed(2).replace('.', ',')}\n`;
        mensagem += `Quantidade: ${item.quantidade}\n`;
        mensagem += `Subtotal: R$ ${subtotalItem.toFixed(2).replace('.', ',')}\n`;
        mensagem += `SKU: ${item.SKU}\n`;
        mensagem += `----------\n`;
    });

    mensagem += `\nTotal do Pedido: R$ ${totalPedido.toFixed(2).replace('.', ',')}\n\n`;
    
    if (observacoes) {
        mensagem += `Observações: ${observacoes}\n\n`;
    }

    mensagem += "Confirmar os itens se estão disponíveis em estoque e valores para entrega";
    
    return encodeURIComponent(mensagem);
}


// Event Listeners
carrinhoFloatIcon.addEventListener('click', toggleCarrinhoSidebar);

fecharCarrinhoBtn.addEventListener('click', () => {
    if (!isCartLocked) {
        toggleCarrinhoSidebar();
    }
});

overlay.addEventListener('click', () => {
    if (!isCartLocked) {
        toggleCarrinhoSidebar();
    }
});

finalizarPedidoBtn.addEventListener('click', finalizarPedidoWhatsApp);
finalizarPedidoBtn.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevent default touch behavior
    finalizarPedidoWhatsApp();
}, { passive: false }); // Use passive: false to allow preventDefault

pesquisaInput.addEventListener('input', pesquisarProdutos);
pesquisaBtn.addEventListener('click', pesquisarProdutos);
limparPesquisaBtn.addEventListener('click', () => {
    pesquisaInput.value = '';
    pesquisarProdutos();
});

// Modal event listeners
formDadosCliente.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let isValid = true;
    nomeClienteInput.classList.remove('invalid');
    telefoneClienteInput.classList.remove('invalid');

    if (nomeClienteInput.value.trim() === '') {
        nomeClienteInput.classList.add('invalid');
        isValid = false;
    }
    if (telefoneClienteInput.value.trim() === '') {
        telefoneClienteInput.classList.add('invalid');
        isValid = false;
    }

    if (!isValid) {
        mostrarFeedback('Falta informação', true);
        return;
    }

    const nome = nomeClienteInput.value.trim();
    const telefone = telefoneClienteInput.value.trim();
    const observacoes = document.getElementById('observacoes').value.trim();

    const mensagemWhatsApp = gerarMensagemWhatsApp(nome, telefone, observacoes);
    const whatsappUrl = `https://wa.me/${TELEFONE_LOJA}?text=${mensagemWhatsApp}`;
    window.open(whatsappUrl, '_blank');

    // Optionally clear cart and close modal after sending
    carrinho = [];
    atualizarCarrinho();
    modalOverlay.style.display = 'none';
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
    carrinhoSidebar.classList.remove('open'); // Close cart sidebar as well
    overlay.classList.remove('active');
    mostrarFeedback('Pedido enviado para o WhatsApp!');
});

btnCancelar.addEventListener('click', () => {
    modalOverlay.style.display = 'none';
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
    nomeClienteInput.classList.remove('invalid'); // Clear validation
    telefoneClienteInput.classList.remove('invalid'); // Clear validation
});


// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    console.log('Inicializando loja...');
    carregarProdutos();
    
    // Initial display of cart icon count
    if (carrinho.length > 0) {
        carrinhoCount.style.display = 'flex';
        carrinhoCount.textContent = carrinho.length.toString();
    }
});
