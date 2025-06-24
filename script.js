// Configurações
const TELEFONE_LOJA = "5515981475186";

// Estado da aplicação
let produtos = [];
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
let categoriaAtiva = 'todos';
let termoPesquisa = '';

// Elementos DOM
const produtosGrid = document.getElementById('produtos-grid');
const listaCategorias = document.getElementById('lista-categorias');
const carrinhoFixo = document.getElementById('carrinho-fixo');
const carrinhoContent = document.getElementById('carrinho-content');
const carrinhoCount = document.getElementById('carrinho-count');
const carrinhoTotal = document.getElementById('carrinho-total');
const finalizarPedidoBtn = document.getElementById('finalizar-pedido');
const pesquisaInput = document.getElementById('pesquisa-input');
const pesquisaBtn = document.getElementById('pesquisa-btn');
const modalOverlay = document.getElementById('modal-overlay');
const formPedido = document.getElementById('form-pedido');
const cancelarPedidoBtn = document.getElementById('cancelar-pedido');
const carrinhoFlutuante = document.getElementById('carrinho-flutuante');

// Carregar produtos
async function carregarProdutos() {
    try {
        const response = await fetch('produtos.json');
        produtos = await response.json();
        renderizarCategorias();
        renderizarProdutos();
        atualizarCarrinho();
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        produtosGrid.innerHTML = '<p>Erro ao carregar produtos. Por favor, recarregue a página.</p>';
    }
}

// Renderizar categorias
function renderizarCategorias() {
    const categorias = ['todos', ...new Set(produtos.map(p => p.CATEGORIA))];
    
    listaCategorias.innerHTML = categorias.map(categoria => `
        <li>
            <button class="${categoria === 'todos' ? 'active' : ''}" 
                    data-categoria="${categoria}">
                ${categoria === 'todos' ? 'Todos' : categoria}
            </button>
        </li>
    `).join('');
    
    // Adicionar event listeners
    document.querySelectorAll('#lista-categorias button').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#lista-categorias button').forEach(b => 
                b.classList.remove('active'));
            btn.classList.add('active');
            categoriaAtiva = btn.dataset.categoria;
            renderizarProdutos();
        });
    });
}

// Renderizar produtos
function renderizarProdutos() {
    let produtosFiltrados = produtos;
    
    // Filtrar por categoria
    if (categoriaAtiva !== 'todos') {
        produtosFiltrados = produtosFiltrados.filter(p => p.CATEGORIA === categoriaAtiva);
    }
    
    // Filtrar por termo de pesquisa
    if (termoPesquisa) {
        produtosFiltrados = produtosFiltrados.filter(p => 
            p.DESCRICAO.toLowerCase().includes(termoPesquisa) ||
            p.CATEGORIA.toLowerCase().includes(termoPesquisa)
        );
    }
    
    // Renderizar
    produtosGrid.innerHTML = produtosFiltrados.length > 0 ? 
        produtosFiltrados.map(produto => `
            <div class="produto-card">
                <img src="${produto.IMAGES[0]}" alt="${produto.DESCRICAO}" class="produto-imagem">
                <div class="produto-info">
                    <h3 class="produto-titulo">${produto.DESCRICAO}</h3>
                    <div class="produto-preco">R$ ${produto.PRECO.toFixed(2).replace('.', ',')}</div>
                    <button class="add-carrinho" data-sku="${produto.SKU}">Adicionar</button>
                </div>
            </div>
        `).join('') :
        '<p>Nenhum produto encontrado.</p>';
    
    // Adicionar event listeners aos botões
    document.querySelectorAll('.add-carrinho').forEach(btn => {
        btn.addEventListener('click', () => {
            const sku = btn.dataset.sku;
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
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({
            ...produto,
            quantidade: 1
        });
    }
    
    atualizarCarrinho();
    mostrarFeedback('Produto adicionado ao carrinho!');
}

function removerDoCarrinho(sku) {
    carrinho = carrinho.filter(item => item.SKU !== sku);
    atualizarCarrinho();
    mostrarFeedback('Produto removido do carrinho');
}

function atualizarQuantidade(sku, novaQuantidade) {
    const item = carrinho.find(item => item.SKU === sku);
    if (item) {
        item.quantidade = Math.max(1, novaQuantidade);
        atualizarCarrinho();
    }
}

function atualizarCarrinho() {
    // Salvar no localStorage
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    
    // Atualizar contador
    const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
    carrinhoCount.textContent = totalItens;
    document.getElementById('carrinho-count-flutuante').textContent = totalItens;
    
    // Atualizar conteúdo
    if (carrinho.length === 0) {
        carrinhoContent.innerHTML = '<p class="carrinho-vazio">Seu carrinho está vazio</p>';
        carrinhoTotal.textContent = 'R$ 0,00';
        return;
    }
    
    carrinhoContent.innerHTML = carrinho.map(item => `
        <div class="carrinho-item">
            <img src="${item.IMAGES[0]}" alt="${item.DESCRICAO}" class="carrinho-item-img">
            <div class="carrinho-item-detalhes">
                <h4 class="carrinho-item-titulo">${item.DESCRICAO}</h4>
                <div class="carrinho-item-preco">R$ ${item.PRECO.toFixed(2).replace('.', ',')}</div>
                <div class="carrinho-item-controles">
                    <button class="quantidade-btn" data-action="decrementar" data-sku="${item.SKU}">-</button>
                    <span>${item.quantidade}</span>
                    <button class="quantidade-btn" data-action="incrementar" data-sku="${item.SKU}">+</button>
                    <span class="remover-item" data-sku="${item.SKU}">Remover</span>
                </div>
            </div>
        </div>
    `).join('');
    
    // Atualizar total
    const total = carrinho.reduce((sum, item) => sum + (item.PRECO * item.quantidade), 0);
    carrinhoTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    
    // Adicionar event listeners
    document.querySelectorAll('.quantidade-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const sku = e.target.dataset.sku;
            const action = e.target.dataset.action;
            const item = carrinho.find(item => item.SKU === sku);
            
            if (action === 'incrementar') {
                item.quantidade += 1;
            } else if (action === 'decrementar') {
                item.quantidade = Math.max(1, item.quantidade - 1);
            }
            
            atualizarCarrinho();
        });
    });
    
    document.querySelectorAll('.remover-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const sku = e.target.dataset.sku;
            removerDoCarrinho(sku);
        });
    });
}

// Finalizar pedido
function finalizarPedido() {
    if (carrinho.length === 0) {
        mostrarFeedback('Seu carrinho está vazio!', 'erro');
        return;
    }
    
    modalOverlay.style.display = 'flex';
}

// Enviar pedido por WhatsApp
function enviarPedidoWhatsApp(nome, telefone, observacoes) {
    let mensagem = `*Pedido da Loja Salve Maria Imaculada*\n\n`;
    mensagem += `*Cliente:* ${nome}\n`;
    if (telefone) mensagem += `*WhatsApp:* ${telefone}\n\n`;
    mensagem += `*Itens do Pedido:*\n\n`;
    
    carrinho.forEach((item, index) => {
        mensagem += `*${index + 1}. ${item.DESCRICAO}*\n`;
        mensagem += `   - SKU: ${item.SKU}\n`;
        mensagem += `   - Quantidade: ${item.quantidade}\n`;
        mensagem += `   - Preço unitário: R$ ${item.PRECO.toFixed(2).replace('.', ',')}\n`;
        mensagem += `   - Subtotal: R$ ${(item.PRECO * item.quantidade).toFixed(2).replace('.', ',')}\n\n`;
    });
    
    const total = carrinho.reduce((sum, item) => sum + (item.PRECO * item.quantidade), 0);
    mensagem += `*Total do Pedido:* R$ ${total.toFixed(2).replace('.', ',')}\n\n`;
    
    if (observacoes) {
        mensagem += `*Observações:*\n${observacoes}\n\n`;
    }
    
    mensagem += `Por favor, confirme a disponibilidade dos itens.`;
    
    const mensagemCodificada = encodeURIComponent(mensagem);
    window.open(`https://wa.me/${TELEFONE_LOJA}?text=${mensagemCodificada}`, '_blank');
    
    // Limpar carrinho após envio
    carrinho = [];
    localStorage.removeItem('carrinho');
    atualizarCarrinho();
    modalOverlay.style.display = 'none';
    mostrarFeedback('Pedido enviado com sucesso!');
}

// Feedback visual
function mostrarFeedback(mensagem, tipo = 'sucesso') {
    const feedback = document.createElement('div');
    feedback.className = `feedback ${tipo}`;
    feedback.textContent = mensagem;
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        feedback.remove();
    }, 3000);
}

// Event Listeners
pesquisaInput.addEventListener('input', (e) => {
    termoPesquisa = e.target.value.toLowerCase();
    renderizarProdutos();
});

pesquisaBtn.addEventListener('click', () => {
    termoPesquisa = pesquisaInput.value.toLowerCase();
    renderizarProdutos();
});

finalizarPedidoBtn.addEventListener('click', finalizarPedido);

formPedido.addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = document.getElementById('nome').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const observacoes = document.getElementById('observacoes').value.trim();
    
    if (!nome) {
        mostrarFeedback('Por favor, informe seu nome', 'erro');
        return;
    }
    
    enviarPedidoWhatsApp(nome, telefone, observacoes);
    formPedido.reset();
});

cancelarPedidoBtn.addEventListener('click', () => {
    modalOverlay.style.display = 'none';
});

modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        modalOverlay.style.display = 'none';
    }
});

// Event Listener para o ícone flutuante
carrinhoFlutuante.addEventListener('click', () => {
    carrinhoFixo.style.display = 'block';
    carrinhoFixo.scrollIntoView({ behavior: 'smooth' });
});

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    carregarProdutos();
    
    // Inicializar contador do ícone flutuante
    const totalItens = carrinho.reduce((total, item) => total + (item.quantidade || 0), 0);
    document.getElementById('carrinho-count-flutuante').textContent = totalItens;
});
