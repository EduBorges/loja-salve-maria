// Dados dos produtos movidos para o arquivo JavaScript
const produtosData = [
  {
    "SKU": "1",
    "DESCRICAO": "Pingente São Bento",
    "MATERIAL": "metal",
    "MODELO": "colar",
    "COR": "outros",
    "TAMANHO": "15",
    "QTD": 10,
    "PRECO": 15,
    "IMAGES": [
      "https://drive.google.com/thumbnail?id=1SrnocKBLfeOIVRZciUPJrokXSVDszGau"
    ],
    "CATEGORIA": "ACESSORIOS"
  },
  // ... (insira todos os outros produtos aqui)
  {
    "SKU": "25000",
    "DESCRICAO": "Terço",
    "MATERIAL": "Madeira",
    "MODELO": "Tradicional",
    "COR": "Mogno",
    "TAMANHO": "20",
    "QTD": 10,
    "PRECO": 20,
    "IMAGES": [
      "https://drive.google.com/thumbnail?id=1amSEnAnfyATnijCpXCPIB6l6AzK_iGHb"
    ],
    "CATEGORIA": "TERÇOS"
  }
];

// Configurações
const TELEFONE_LOJA = "5515981475186";

// Estado da aplicação
let produtos = [];
let carrinho = [];
let termoPesquisa = '';
let categoriaAtiva = 'todos';
let carrinhoAberto = false;

// Elementos DOM
const produtosContainer = document.getElementById('produtos-container');
const carrinhoIcon = document.getElementById('carrinho-icon');
const carrinhoSidebar = document.getElementById('carrinho-sidebar');
const carrinhoContent = document.getElementById('carrinho-content');
const carrinhoTotal = document.getElementById('carrinho-total');
const carrinhoCount = document.getElementById('carrinho-count');
const categoriasContainer = document.getElementById('categorias-container');
const feedback = document.getElementById('feedback');
const modalOverlay = document.getElementById('modal-overlay');
const formDadosCliente = document.getElementById('dados-cliente');
const btnCancelar = document.getElementById('cancelar-pedido');
const pesquisaInput = document.getElementById('pesquisa-input');
const pesquisaBtn = document.getElementById('pesquisa-btn');
const limparPesquisaBtn = document.getElementById('limpar-pesquisa');
const finalizarPedidoBtn = document.getElementById('finalizar-pedido');

// Função para carregar produtos
function carregarProdutos() {
    produtos = produtosData;
    gerarBotoesCategoria();
    renderizarProdutos();
    atualizarCarrinho();
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
            p.TAMANHO.toLowerCase().includes(termoPesquisa)
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
        
        // Adiciona "cm" ao tamanho se for numérico
        const tamanhoDisplay = isNaN(produto.TAMANHO) ? produto.TAMANHO : `${produto.TAMANHO} cm`;
        
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
    
    // Verifica se já atingiu o limite de 2 unidades
    if (itemExistente && itemExistente.quantidade >= 2) {
        mostrarFeedback('Limite Atingido (máximo 2 por produto)', 'error');
        return;
    }
    
    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({
            ...produto,
            quantidade: 1
        });
    }

    atualizarCarrinho();
    mostrarFeedback('Incluído no carrinho!');
    
    // Abre o carrinho se estiver fechado
    if (!carrinhoAberto) {
        toggleCarrinho();
    }
}

function removerDoCarrinho(sku) {
    carrinho = carrinho.filter(item => item.SKU !== sku);
    atualizarCarrinho();
    mostrarFeedback('Produto removido do carrinho');
}

function atualizarQuantidade(sku, novaQuantidade) {
    const item = carrinho.find(item => item.SKU === sku);
    if (item) {
        // Limita a quantidade máxima a 2
        novaQuantidade = Math.min(2, Math.max(1, novaQuantidade));
        item.quantidade = novaQuantidade;
        atualizarCarrinho();
    }
}

// Função para atualizar o carrinho
function atualizarCarrinho() {
    try {
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
    } catch (e) {
        console.error('Erro ao acessar localStorage:', e);
    }

    // Atualiza contador do carrinho
    const totalItens = carrinho.reduce((total, item) => total + (item.quantidade || 1), 0);
    
    carrinhoCount.textContent = totalItens;
    carrinhoCount.style.display = totalItens > 0 ? 'flex' : 'none';

    // Limpa conteúdo anterior
    carrinhoContent.innerHTML = '';

    // Se carrinho vazio
    if (carrinho.length === 0) {
        carrinhoContent.innerHTML = '<div class="carrinho-vazio">Seu carrinho está vazio</div>';
        carrinhoTotal.textContent = '0,00';
        return;
    }

    // Calcula total
    let total = 0;
    
    // Renderiza cada item do carrinho
    carrinho.forEach(item => {
        total += (item.PRECO || 0) * (item.quantidade || 1);
        
        const carrinhoItem = document.createElement('div');
        carrinhoItem.className = 'carrinho-item';
        
        const imgContainer = document.createElement('div');
        imgContainer.className = 'carrinho-item-img-container';
        
        if (item.IMAGES && item.IMAGES.length > 0) {
            const img = document.createElement('img');
            img.className = 'carrinho-item-img';
            img.alt = item.DESCRICAO || 'Produto sem descrição';
            img.src = item.IMAGES[0];
            
            img.onerror = () => {
                imgContainer.innerHTML = '<div class="placeholder-imagem">Sem imagem</div>';
            };
            
            imgContainer.appendChild(img);
        } else {
            imgContainer.innerHTML = '<div class="placeholder-imagem">Sem imagem</div>';
        }
        
        carrinhoItem.appendChild(imgContainer);
        
        const detalhes = document.createElement('div');
        detalhes.className = 'carrinho-item-detalhes';
        detalhes.innerHTML = `
            <div class="carrinho-item-titulo">${item.DESCRICAO || 'Produto sem nome'}</div>
            <div class="carrinho-item-atributos">
                <p>${item.MODELO || ''} | ${item.COR || ''}</p>
                <p>${item.MATERIAL || ''} | ${item.TAMANHO || ''}</p>
            </div>
            <div class="carrinho-item-preco">R$ ${((item.PRECO || 0) * (item.quantidade || 1)).toFixed(2).replace('.', ',')}</div>
            <div class="carrinho-item-controles">
                <button class="quantidade-btn" data-sku="${item.SKU || ''}" data-action="decrementar">-</button>
 
