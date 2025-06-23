// Configurações
const TELEFONE_LOJA = "5515981475186";
const PRODUTOS_URL = "produtos.json";

// Estado da aplicação
let produtos = [];
let carrinho = [];
let termoPesquisa = '';
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
const categoriasContainer = document.querySelector('.categorias');
const feedback = document.getElementById('feedback');
const modalOverlay = document.getElementById('modal-overlay');
const formDadosCliente = document.getElementById('dados-cliente');
const btnCancelar = document.getElementById('cancelar-pedido');
const pesquisaInput = document.getElementById('pesquisa-input');
const pesquisaBtn = document.getElementById('pesquisa-btn');
const limparPesquisaBtn = document.getElementById('limpar-pesquisa');

// Inicializar carrinho do localStorage
function inicializarCarrinho() {
    try {
        const storedCarrinho = localStorage.getItem('carrinho');
        if (storedCarrinho) {
            carrinho = JSON.parse(storedCarrinho);
            console.log('Carrinho carregado do localStorage:', carrinho);
        }
    } catch (e) {
        console.error('Erro ao carregar carrinho do localStorage:', e);
        carrinho = [];
        localStorage.removeItem('carrinho');
    }
    atualizarCarrinho();
}

// Função para carregar produtos
async function carregarProdutos() {
    try {
        const response = await fetch(PRODUTOS_URL);
        produtos = await response.json();
        gerarBotoesCategoria();
        renderizarProdutos();
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        mostrarFeedback('Erro ao carregar produtos', 'error');
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
        btn.setAttribute('aria-label', `Filtrar por ${categoria}`);
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

// Função para renderizar produtos
function renderizarProdutos() {
    produtosContainer.innerHTML = '';
    
    let produtosFiltrados = produtos;
    
    if (categoriaAtiva !== 'todos') {
        produtosFiltrados = produtosFiltrados.filter(p => p.CATEGORIA === categoriaAtiva);
    }
    
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
        imagem.loading = 'lazy';
        
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
        
        produtoCard.innerHTML = `
            <div class="produto-info">
                <div class="produto-titulo">${produto.DESCRICAO}</div>
                <div class="produto-atributos">
                    <p><strong>Material:</strong> ${produto.MATERIAL}</p>
                    <p><strong>Modelo:</strong> ${produto.MODELO}</p>
                    <p><strong>Cor:</strong> ${produto.COR}</p>
                    <p><strong>Tamanho:</strong> ${produto.TAMANHO}</p>
                    <p><strong>SKU:</strong> ${produto.SKU}</p>
                </div>
                <div class="produto-preco">R$ ${produto.PRECO.toFixed(2).replace('.', ',')}</div>
                <button class="add-carrinho" data-sku="${produto.SKU}" aria-label="Adicionar ${produto.DESCRICAO} ao carrinho">Adicionar ao Carrinho</button>
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
    if (!produto) {
        console.error('Produto não encontrado:', sku);
        return;
    }

    const itemExistente = carrinho.find(item => item.SKU === sku);
    const novaQuantidade = itemExistente ? itemExistente.quantidade + 1 : 1;

    if (novaQuantidade > produto.QTD) {
        mostrarFeedback(`Estoque insuficiente! Apenas ${produto.QTD} unidade(s) disponível(is).`, 'error');
        return;
    }

    if (itemExistente) {
        itemExistente.quantidade = novaQuantidade;
    } else {
        carrinho.push({ ...produto, quantidade: 1 });
    }

    console.log('Adicionando ao carrinho:', { sku, quantidade: novaQuantidade });
    atualizarCarrinho();
    mostrarFeedback('Produto adicionado ao carrinho!');
}

function removerDoCarrinho(sku) {
    carrinho = carrinho.filter(item => item.SKU !== sku);
    console.log('Removendo do carrinho:', sku);
    atualizarCarrinho();
    mostrarFeedback('Produto removido do carrinho');
}

function atualizarQuantidade(sku, novaQuantidade) {
    const item = carrinho.find(item => item.SKU === sku);
    const produto = produtos.find(p => p.SKU === sku);
    if (item && produto) {
        if (novaQuantidade > produto.QTD) {
            mostrarFeedback(`Estoque insuficiente! Apenas ${produto.QTD} unidade(s) disponível(is).`, 'error');
            item.quantidade = produto.QTD;
        } else {
            item.quantidade = Math.max(1, novaQuantidade);
        }
        console.log('Atualizando quantidade:', { sku, novaQuantidade: item.quantidade });
        atualizarCarrinho();
    }
}

// Função para atualizar o carrinho
function atualizarCarrinho() {
    try {
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        console.log('Carrinho salvo no localStorage:', carrinho);
    } catch (e) {
        console.error('Erro ao salvar carrinho no localStorage:', e);
    }

    const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
    carrinhoCount.textContent = totalItens;
    carrinhoCount.style.display = totalItens > 0 ? 'flex' : 'none';

    carrinhoContent.innerHTML = '';

    if (carrinho.length === 0) {
        carrinhoContent.innerHTML = '<div class="carrinho-vazio">Seu carrinho está vazio</div>';
        carrinhoTotal.textContent = 'R$ 0,00';
        return;
    }

    let total = 0;
    
    carrinho.forEach(item => {
        total += item.PRECO * item.quantidade;
        
        const carrinhoItem = document.createElement('div');
        carrinhoItem.className = 'carrinho-item';
        
        const imgContainer = document.createElement('div');
        imgContainer.className = 'carrinho-item-img-container';
        
        if (item.IMAGES && item.IMAGES.length > 0) {
            const img = document.createElement('img');
            img.className = 'carrinho-item-img';
            img.alt = item.DESCRICAO;
            img.src = item.IMAGES[0];
            img.loading = 'lazy';
            
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
            <div class="carrinho-item-titulo">${item.DESCRICAO}</div>
            <div class="carrinho-item-atributos">
                <p>${item.MODELO} | ${item.COR}</p>
                <p>${item.MATERIAL} | ${item.TAMANHO}</p>
            </div>
            <div class="carrinho-item-preco">R$ ${(item.PRECO * item.quantidade).toFixed(2).replace('.', ',')}</div>
            <div class="carrinho-item-controles">
                <button class="quantidade-btn" data-sku="${item.SKU}" data-action="decrementar" aria-label="Diminuir quantidade">-</button>
                <input type="number" class="quantidade-input" value="${item.quantidade}" min="1" max="${item.QTD}" data-sku="${item.SKU}" aria-label="Quantidade do item">
                <button class="quantidade-btn" data-sku="${item.SKU}" data-action="incrementar" aria-label="Aumentar quantidade">+</button>
                <span class="remover-item" data-sku="${item.SKU}" role="button" aria-label="Remover ${item.DESCRICAO} do carrinho">Remover</span>
            </div>
        `;
        
        carrinhoItem.appendChild(detalhes);
        carrinhoContent.appendChild(carrinhoItem);
    });
    
    carrinhoTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    
    document.querySelectorAll('.quantidade-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const sku = e.target.getAttribute('data-sku');
            const action = e.target.getAttribute('data-action');
            const input = e.target.parentElement.querySelector('.quantidade-input');
            
            if (action === 'incrementar') {
                input.value = parseInt(input.value) + 1;
            } else if (action === 'decrementar') {
                input.value = Math.max(1, parseInt(input.value) - 1);
            }
            
            input.dispatchEvent(new Event('change'));
        });
    });
    
    document.querySelectorAll('.quantidade-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const sku = e.target.getAttribute('data-sku');
            const novaQuantidade = parseInt(e.target.value) || 1;
            atualizarQuantidade(sku, novaQuantidade);
        });
    });
    
    document.querySelectorAll('.remover-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const sku = e.target.getAttribute('data-sku');
            removerDoCarrinho(sku);
        });
    });
}

// Finalizar pedido via WhatsApp
function finalizarPedidoWhatsApp() {
    if (carrinho.length === 0) {
        mostrarFeedback('Seu carrinho está vazio!', 'error');
        return;
    }
    
    modalOverlay.style.display = 'flex';
    modalOverlay.scrollIntoView({ behavior: 'smooth', block: 'center' });
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        document.getElementById('nome-cliente').focus();
    }, 100);
}

// Formatar telefone
document.getElementById('telefone-cliente').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.substring(0, 11);
    
    if (value.length > 0) {
        value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
        if (value.length > 10) {
            value = value.replace(/(\d)(\d{4})$/, '$1-$2');
        } else {
            value = value.replace(/(\d)(\d{3})$/, '$1-$2');
        }
    }
    
    e.target.value = value;
});

// Enviar pedido quando o formulário for submetido
formDadosCliente.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nomeCliente = document.getElementById('nome-cliente').value.trim();
    const telefoneCliente = document.getElementById('telefone-cliente').value.replace(/\D/g, '');
    const observacoes = document.getElementById('observacoes').value.trim();
    
    if (!nomeCliente) {
        mostrarFeedback('Por favor, informe seu nome!', 'error');
        return;
    }
    
    let mensagem = `*Pedido da Loja Salve Maria Imaculada*\n\n`;
    mensagem += `*Cliente:* ${nomeCliente}\n`;
    
    if (telefoneCliente) {
        mensagem += `*WhatsApp:* ${telefoneCliente}\n`;
    }
    
    mensagem += `\n*Itens do Pedido:*\n\n`;
    
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
    
    mensagem += `Por favor, confirme a disponibilidade dos itens e informe o valor do frete.`;
    
    const mensagemCodificada = encodeURIComponent(mensagem);
    
    modalOverlay.style.display = 'none';
    document.body.style.overflow = '';
    
    formDadosCliente.reset();
    
    window.open(`https://wa.me/${TELEFONE_LOJA}?text=${mensagemCodificada}`, '_blank');
    
    carrinho = [];
    localStorage.removeItem('carrinho');
    atualizarCarrinho();
    
    mostrarFeedback('Pedido enviado com sucesso!');
});

// Fechar modal ao clicar no botão cancelar
btnCancelar.addEventListener('click', function() {
    modalOverlay.style.display = 'none';
    document.body.style.overflow = '';
});

// Fechar modal ao clicar fora
modalOverlay.addEventListener('click', function(e) {
    if (e.target === modalOverlay) {
        modalOverlay.style.display = 'none';
        document.body.style.overflow = '';
    }
});

// Fechar modal com tecla Esc
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.style.display === 'flex') {
        modalOverlay.style.display = 'none';
        document.body.style.overflow = '';
    }
});

// Mostrar feedback
function mostrarFeedback(texto, tipo = 'success') {
    feedback.textContent = texto;
    feedback.className = 'feedback';
    feedback.classList.add(tipo === 'error' ? 'error' : 'show');
    
    setTimeout(() => {
        feedback.classList.remove('show');
    }, 3000);
}

// Event Listeners para pesquisa
pesquisaInput.addEventListener('input', pesquisarProdutos);
pesquisaBtn.addEventListener('click', pesquisarProdutos);
limparPesquisaBtn.addEventListener('click', () => {
    pesquisaInput.value = '';
    termoPesquisa = '';
    limparPesquisaBtn.style.display = 'none';
    renderizarProdutos();
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

finalizarPedidoBtn.addEventListener('click', finalizarPedidoWhatsApp);
finalizarPedidoBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    finalizarPedidoWhatsApp();
}, { passive: false });

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    inicializarCarrinho();
    carregarProdutos();
    
    carrinhoIcon.style.display = 'flex';
    if (carrinho.length > 0) {
        carrinhoCount.style.display = 'flex';
    }
});
