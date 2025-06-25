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
const carrinhoSidebar = document.getElementById('carrinho-sidebar');
const carrinhoContent = document.getElementById('carrinho-content');
const overlay = document.getElementById('overlay');
const carrinhoTotal = document.getElementById('carrinho-total');
const carrinhoCountHeader = document.getElementById('carrinho-count'); // Count in header
const carrinhoCountFloating = document.getElementById('carrinho-count-flutuante'); // Count in floating icon
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
const carrinhoIconFloating = document.getElementById('carrinho-icon-flutuante'); // Floating cart icon

// Função para carregar produtos do JSON
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
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--cor-erro);">
                <p>Erro ao carregar os produtos. Tente novamente mais tarde.</p>
            </div>
        `;
    }
}

// Função para gerar os botões de categoria dinamicamente
function gerarBotoesCategoria() {
    const todosBtn = document.createElement('button');
    todosBtn.className = 'categoria-btn active';
    todosBtn.setAttribute('data-categoria', 'todos');
    todosBtn.textContent = 'Todos';
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
            (p.TAMANHO && p.TAMANHO.toString().toLowerCase().includes(termoPesquisa))
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

        const tamanhoFormatado = (typeof produto.TAMANHO === 'number' || (typeof produto.TAMANHO === 'string' && !isNaN(parseFloat(produto.TAMANHO)))) ? `${produto.TAMANHO} cm` : produto.TAMANHO;
        
        const quantidadeNoCarrinho = carrinho.find(item => item.SKU === produto.SKU)?.quantidade || 0;
        const isDisabled = quantidadeNoCarrinho >= 2;
        const buttonText = isDisabled ? 'Limite Atingido' : 'Adicionar ao Carrinho';
        const buttonClass = isDisabled ? 'add-carrinho limite-atingido' : 'add-carrinho';

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
                <button class="${buttonClass}" data-sku="${produto.SKU}" ${isDisabled ? 'disabled' : ''}>${buttonText}</button>
            </div>
        `;
        produtoCard.insertBefore(imagemContainer, produtoCard.firstChild);
        
        produtosContainer.appendChild(produtoCard);
    });

    document.querySelectorAll('.add-carrinho:not(.limite-atingido)').forEach(btn => {
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
        if (itemExistente.quantidade < 2) {
            itemExistente.quantidade += 1;
            mostrarFeedback('Incluído no carrinho', 'success');
        } else {
            mostrarFeedback('Limite Atingido (máx. 2 por item)', 'error');
            return;
        }
    } else {
        carrinho.push({
            ...produto,
            quantidade: 1
        });
        mostrarFeedback('Incluído no carrinho', 'success');
    }

    atualizarCarrinho();
    renderizarProdutos(); // Re-render to update button state
}

function removerDoCarrinho(sku) {
    carrinho = carrinho.filter(item => item.SKU !== sku);
    atualizarCarrinho();
    renderizarProdutos(); // Re-render to update button state
}

function aumentarQuantidade(sku) {
    const item = carrinho.find(item => item.SKU === sku);
    if (item && item.quantidade < 2) {
        item.quantidade += 1;
        atualizarCarrinho();
        renderizarProdutos(); // Re-render to update button state
    } else if (item && item.quantidade >=2) {
         mostrarFeedback('Limite Atingido (máx. 2 por item)', 'error');
    }
}

function diminuirQuantidade(sku) {
    const item = carrinho.find(item => item.SKU === sku);
    if (item) {
        item.quantidade -= 1;
        if (item.quantidade <= 0) {
            removerDoCarrinho(sku);
        } else {
            atualizarCarrinho();
            renderizarProdutos(); // Re-render to update button state
        }
    }
}

function atualizarCarrinho() {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    carrinhoContent.innerHTML = '';
    let total = 0;

    if (carrinho.length === 0) {
        carrinhoContent.innerHTML = '<div class="carrinho-vazio">Seu carrinho está vazio</div>';
    } else {
        carrinho.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'carrinho-item';

            const tamanhoFormatado = (typeof item.TAMANHO === 'number' || (typeof item.TAMANHO === 'string' && !isNaN(parseFloat(item.TAMANHO)))) ? `${item.TAMANHO} cm` : item.TAMANHO;

            itemElement.innerHTML = `
                <div class="carrinho-item-img-container">
                    ${item.IMAGES && item.IMAGES.length > 0 ? `<img src="${item.IMAGES[0]}" alt="${item.DESCRICAO}" class="carrinho-item-img">` : `<div class="placeholder-imagem">Sem imagem</div>`}
                </div>
                <div class="carrinho-item-detalhes">
                    <div class="carrinho-item-titulo">${item.DESCRICAO}</div>
                    <div class="carrinho-item-atributos">
                        <p>Tamanho: ${tamanhoFormatado}</p>
                    </div>
                    <div class="carrinho-item-preco">R$ ${(item.PRECO * item.quantidade).toFixed(2).replace('.', ',')}</div>
                    <div class="carrinho-item-controles">
                        <button class="quantidade-btn diminuir-qtd" data-sku="${item.SKU}">-</button>
                        <input type="text" class="quantidade-input" value="${item.quantidade}" readonly>
                        <button class="quantidade-btn aumentar-qtd" data-sku="${item.SKU}">+</button>
                        <span class="remover-item" data-sku="${item.SKU}">Remover</span>
                    </div>
                </div>
            `;
            carrinhoContent.appendChild(itemElement);
            total += item.PRECO * item.quantidade;
        });
    }

    carrinhoTotal.textContent = total.toFixed(2).replace('.', ',');
    const totalItensCarrinho = carrinho.reduce((sum, item) => sum + item.quantidade, 0);
    carrinhoCountHeader.textContent = totalItensCarrinho;
    carrinhoCountFloating.textContent = totalItensCarrinho;

    if (totalItensCarrinho > 0) {
        carrinhoCountHeader.style.display = 'flex';
        carrinhoCountFloating.style.display = 'flex';
    } else {
        carrinhoCountHeader.style.display = 'none';
        carrinhoCountFloating.style.display = 'none';
    }

    // Add event listeners for quantity buttons and remove button
    document.querySelectorAll('.aumentar-qtd').forEach(btn => {
        btn.addEventListener('click', (e) => aumentarQuantidade(e.target.getAttribute('data-sku')));
    });
    document.querySelectorAll('.diminuir-qtd').forEach(btn => {
        btn.addEventListener('click', (e) => diminuirQuantidade(e.target.getAttribute('data-sku')));
    });
    document.querySelectorAll('.remover-item').forEach(btn => {
        btn.addEventListener('click', (e) => removerDoCarrinho(e.target.getAttribute('data-sku')));
    });
}

// Funções de feedback
function mostrarFeedback(mensagem, tipo = 'success') {
    feedback.textContent = mensagem;
    feedback.className = `feedback show ${tipo}`;
    setTimeout(() => {
        feedback.classList.remove('show');
    }, 2500);
}

// Funções do modal de checkout
function abrirModalCheckout() {
    modalOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

function fecharModalCheckout() {
    modalOverlay.style.display = 'none';
    document.body.style.overflow = ''; // Allow scrolling
    formDadosCliente.reset(); // Clear form fields
    document.getElementById('nome-cliente').classList.remove('input-error');
    document.getElementById('telefone-cliente').classList.remove('input-error');
}

function finalizarPedidoWhatsApp() {
    abrirModalCheckout();
}

formDadosCliente.addEventListener('submit', (e) => {
    e.preventDefault();
    const nomeClienteInput = document.getElementById('nome-cliente');
    const telefoneClienteInput = document.getElementById('telefone-cliente');
    const observacoesInput = document.getElementById('observacoes');

    const nome = nomeClienteInput.value.trim();
    const telefone = telefoneClienteInput.value.trim();
    const observacoes = observacoesInput.value.trim();

    // Reset error states
    nomeClienteInput.classList.remove('input-error');
    telefoneClienteInput.classList.remove('input-error');

    if (!nome || !telefone) {
        mostrarFeedback('Falta informação! Nome e WhatsApp são obrigatórios.', 'error');
        if (!nome) nomeClienteInput.classList.add('input-error');
        if (!telefone) telefoneClienteInput.classList.add('input-error');
        return;
    }

    let mensagem = `Olá! Meu nome é ${nome} e gostaria de fazer o seguinte pedido:\n\n`;

    carrinho.forEach(item => {
        const precoUnitario = item.PRECO.toFixed(2).replace('.', ',');
        const subtotal = (item.PRECO * item.quantidade).toFixed(2).replace('.', ',');
        const tamanhoFormatado = (typeof item.TAMANHO === 'number' || (typeof item.TAMANHO === 'string' && !isNaN(parseFloat(item.TAMANHO)))) ? `${item.TAMANHO} cm` : item.TAMANHO;

        mensagem += `*Produto:* ${item.DESCRICAO}\n`;
        mensagem += `*Valor Unitário:* R$ ${precoUnitario}\n`;
        mensagem += `*Quantidade:* ${item.quantidade}\n`;
        mensagem += `*Subtotal:* R$ ${subtotal}\n`;
        mensagem += `*SKU:* ${item.SKU}\n`;
        if (tamanhoFormatado) {
             mensagem += `*Tamanho:* ${tamanhoFormatado}\n`;
        }
        mensagem += `----------\n`;
    });

    mensagem += `*Total do Pedido:* R$ ${carrinhoTotal.textContent}\n\n`;

    if (observacoes) {
        mensagem += `*Observações:* ${observacoes}\n\n`;
    }

    mensagem += "Confirme, por gentileza, a disponibilidade e o frete.";

    const whatsappUrl = `https://wa.me/${TELEFONE_LOJA}?text=${encodeURIComponent(mensagem)}`;
    window.open(whatsappUrl, '_blank');

    fecharModalCheckout();
    carrinho = []; // Clear cart after sending order
    atualizarCarrinho();
    mostrarFeedback('Pedido enviado para o WhatsApp!', 'success');
});

btnCancelar.addEventListener('click', fecharModalCheckout);

// Event Listeners
pesquisaInput.addEventListener('input', pesquisarProdutos);
limparPesquisaBtn.addEventListener('click', () => {
    pesquisaInput.value = '';
    pesquisarProdutos();
});
pesquisaBtn.addEventListener('click', pesquisarProdutos);

// Handle opening and closing the sidebar
carrinhoIconFloating.addEventListener('click', () => {
    console.log('Ícone do carrinho flutuante clicado');
    carrinhoSidebar.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none'; // Disable scroll on touch devices
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

// For touch devices, prevent default touch behavior on checkout button if needed
finalizarPedidoBtn.addEventListener('click', finalizarPedidoWhatsApp);
finalizarPedidoBtn.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevent double tap zoom etc.
    finalizarPedidoWhatsApp();
}, { passive: false });

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('Inicializando loja...');
    carregarProdutos(); // Load products from JSON
    
    // Update initial display of floating cart icon and count
    const totalItensCarrinho = carrinho.reduce((sum, item) => sum + item.quantidade, 0);
    if (totalItensCarrinho > 0) {
        carrinhoCountFloating.style.display = 'flex';
        carrinhoCountFloating.textContent = totalItensCarrinho;
    } else {
        carrinhoCountFloating.style.display = 'none';
    }
});
