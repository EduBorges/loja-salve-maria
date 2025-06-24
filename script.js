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

    listaCategorias.innerHTML = categorias.map(categoria => \`
        <li>
            <button class="\${categoria === 'todos' ? 'active' : ''}" 
                    data-categoria="\${categoria}">
                \${categoria === 'todos' ? 'Todos' : categoria}
            </button>
        </li>
    \`).join('');

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

    if (categoriaAtiva !== 'todos') {
        produtosFiltrados = produtosFiltrados.filter(p => p.CATEGORIA === categoriaAtiva);
    }

    if (termoPesquisa) {
        produtosFiltrados = produtosFiltrados.filter(p =>
            p.DESCRICAO.toLowerCase().includes(termoPesquisa) ||
            p.CATEGORIA.toLowerCase().includes(termoPesquisa)
        );
    }

    produtosGrid.innerHTML = produtosFiltrados.length > 0 ?
        produtosFiltrados.map(produto => \`
            <div class="produto-card">
                <img src="\${produto.IMAGES[0]}" alt="\${produto.DESCRICAO}" class="produto-imagem">
                <div class="produto-info">
                    <h3 class="produto-titulo">\${produto.DESCRICAO}</h3>
                    <p><strong>Material:</strong> \${produto.MATERIAL}</p>
                    <p><strong>Modelo:</strong> \${produto.MODELO}</p>
                    <p><strong>Cor:</strong> \${produto.COR}</p>
                    <p><strong>Tamanho:</strong> \${produto.TAMANHO}</p>
                    <div class="produto-preco">R$ \${produto.PRECO.toFixed(2).replace('.', ',')}</div>
                    <button class="add-carrinho" data-sku="\${produto.SKU}">Adicionar</button>
                </div>
            </div>
        \`).join('') :
        '<p>Nenhum produto encontrado.</p>';

    document.querySelectorAll('.add-carrinho').forEach(btn => {
        btn.addEventListener('click', () => {
            const sku = btn.dataset.sku;
            adicionarAoCarrinho(sku);
        });
    });
}

// As demais funções continuam como no seu script original (não precisam de alteração)