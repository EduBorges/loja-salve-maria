// Configurações
const TELEFONE_LOJA = "5515981475186"; // Seu número de WhatsApp com código do país

// Estado da aplicação
let produtos = [];
let carrinho = [];
let termoPesquisa = '';
let isInteractingWithCart = false; // Flag para interações do carrinho

// Tenta carregar o carrinho do localStorage
try {
    const storedCarrinho = localStorage.getItem('carrinho');
    if (storedCarrinho) {
        carrinho = JSON.parse(storedCarrinho);
    }
} catch (e) {
    console.error('Erro ao carregar carrinho do localStorage:', e);
    localStorage.removeItem('carrinho'); // Limpa o carrinho se houver erro
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
const categoriasContainer = document.getElementById('categorias-container');
const feedback = document.getElementById('feedback');
const modalOverlay = document.getElementById('modal-overlay');
const formDadosCliente = document.getElementById('dados-cliente');
const nomeClienteInput = document.getElementById('nome-cliente');
const telefoneClienteInput = document.getElementById('telefone-cliente');
const observacoesInput = document.getElementById('observacoes');
const btnCancelarModal = document.getElementById('cancelar-pedido');
const pesquisaInput = document.getElementById('pesquisa-input');
const limparPesquisaBtn = document.getElementById('limpar-pesquisa');

// Função para exibir feedback (sucesso/erro)
function showFeedback(message, isError = false) {
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

// Função para carregar produtos do JSON (simulando fetch)
async function carregarProdutos() {
    try {
        // Em um ambiente real, você faria um fetch para 'produtos.json'
        // const response = await fetch('produtos.json');
        // const data = await response.json();
        // produtos = data;

        // Para este exemplo, como o conteúdo é passado diretamente,
        // vou assumir que produtosData será carregado de um script externo
        // ou você precisará colar o conteúdo de produtos.json aqui temporariamente para testes
        // ou ajustar o index.html para carregar produtos.json antes deste script.
        
        // Simulação de carregamento do produtos.json
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
            <p>Erro ao carregar produtos. Tente novamente mais tarde.</p>
        </div>`;
    }
}

// Função para gerar os botões de categoria dinamicamente
function gerarBotoesCategoria() {
    categoriasContainer.innerHTML = ''; // Limpa botões existentes

    const todosBtn = document.createElement('button');
    todosBtn.className = 'categoria-btn active';
    todosBtn.setAttribute('data-categoria', 'todos');
    todosBtn.textContent = 'Todos';
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
    
    // Filtrar por termo de pesquisa (global)
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
        
        // Adiciona "cm" ao tamanho se for um número e não contiver "cm"
        const tamanhoExibicao = (typeof produto.TAMANHO === 'string' && !isNaN(parseFloat(produto.TAMANHO)) && !produto.TAMANHO.toLowerCase().includes('cm'))
                               ? `${produto.TAMANHO}cm`
                               : produto.TAMANHO || 'N/A';

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
        produtoCard.prepend(imagemContainer); // Adiciona a imagem no início do card
        produtosContainer.appendChild(produtoCard);
    });

    // Adiciona event listeners aos botões "Adicionar ao Carrinho"
    document.querySelectorAll('.add-carrinho').forEach(button => {
        button.addEventListener('click', (e) => {
            const sku = e.target.dataset.sku;
            adicionarAoCarrinho(sku);
        });
    });
}

// Função para adicionar produto ao carrinho
function adicionarAoCarrinho(sku) {
    isInteractingWithCart = true;
    const produtoExistenteNoCarrinho = carrinho.find(item => item.SKU === sku);
    const produtoNoCatalogo = produtos.find(p => p.SKU === sku);

    if (!produtoNoCatalogo) {
        showFeedback('Produto não encontrado.', true);
        isInteractingWithCart = false;
        return;
    }

    if (produtoExistenteNoCarrinho) {
        if (produtoExistenteNoCarrinho.quantidade < 2) { // Limite de 2 unidades
            produtoExistenteNoCarrinho.quantidade++;
            showFeedback('Incluído no carrinho');
        } else {
            showFeedback('Limite Atingido', true);
        }
    } else {
        carrinho.push({ ...produtoNoCatalogo, quantidade: 1 });
        showFeedback('Incluído no carrinho');
    }
    salvarCarrinho();
    atualizarCarrinho();
    isInteractingWithCart = false;
}

// Função para remover produto do carrinho
function removerDoCarrinho(sku) {
    isInteractingWithCart = true;
    carrinho = carrinho.filter(item => item.SKU !== sku);
    salvarCarrinho();
    atualizarCarrinho();
    showFeedback('Item removido do carrinho');
    isInteractingWithCart = false;
}

// Função para alterar quantidade do produto no carrinho
function alterarQuantidade(sku, novaQuantidade) {
    isInteractingWithCart = true;
    const item = carrinho.find(item => item.SKU === sku);
    if (item) {
        if (novaQuantidade > 0 && novaQuantidade <= 2) { // Limite de 2 unidades
            item.quantidade = novaQuantidade;
        } else if (novaQuantidade > 2) {
            showFeedback('Limite Atingido', true);
            item.quantidade = 2; // Volta para o limite
        } else {
            removerDoCarrinho(sku);
            isInteractingWithCart = false;
            return; // Sai para não continuar o resto da função
        }
    }
    salvarCarrinho();
    atualizarCarrinho();
    isInteractingWithCart = false;
}

// Salvar carrinho no localStorage
function salvarCarrinho() {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

// Atualizar exibição do carrinho
function atualizarCarrinho() {
    carrinhoContent.innerHTML = '';
    let total = 0;

    if (carrinho.length === 0) {
        carrinhoContent.innerHTML = '<div class="carrinho-vazio">Seu carrinho está vazio</div>';
    } else {
        carrinho.forEach(item => {
            const itemTotal = item.PRECO * item.quantidade;
            total += itemTotal;

            // Adiciona "cm" ao tamanho se for um número e não contiver "cm"
            const tamanhoExibicao = (typeof item.TAMANHO === 'string' && !isNaN(parseFloat(item.TAMANHO)) && !item.TAMANHO.toLowerCase().includes('cm'))
                                   ? `${item.TAMANHO}cm`
                                   : item.TAMANHO || 'N/A';

            const itemElement = document.createElement('div');
            itemElement.className = 'carrinho-item';
            itemElement.innerHTML = `
                <div class="carrinho-item-img-container">
                    ${item.IMAGES && item.IMAGES.length > 0 ? `<img src="${item.IMAGES[0]}" alt="${item.DESCRICAO}" class="carrinho-item-img">` : `<div class="placeholder-imagem">Sem imagem</div>`}
                </div>
                <div class="carrinho-item-detalhes">
                    <div class="carrinho-item-titulo">${item.DESCRICAO}</div>
                    <div class="carrinho-item-atributos">
                        <p>Material: ${item.MATERIAL}</p>
                        <p>Tamanho: ${tamanhoExibicao}</p>
                        <p>SKU: ${item.SKU}</p>
                    </div>
                    <div class="carrinho-item-preco">R$ ${item.PRECO.toFixed(2).replace('.', ',')}</div>
                    <div class="carrinho-item-controles">
                        <button class="quantidade-btn" data-sku="${item.SKU}" data-action="decrease">-</button>
                        <input type="number" class="quantidade-input" data-sku="${item.SKU}" value="${item.quantidade}" min="1" max="2" readonly>
                        <button class="quantidade-btn" data-sku="${item.SKU}" data-action="increase">+</button>
                        <span class="remover-item" data-sku="${item.SKU}">Remover</span>
                    </div>
                </div>
            `;
            carrinhoContent.appendChild(itemElement);
        });

        // Adiciona event listeners para os botões de quantidade e remover
        carrinhoContent.querySelectorAll('.quantidade-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const sku = e.target.dataset.sku;
                const action = e.target.dataset.action;
                const input = carrinhoContent.querySelector(`.quantidade-input[data-sku="${sku}"]`);
                let novaQuantidade = parseInt(input.value);

                if (action === 'increase') {
                    novaQuantidade++;
                } else {
                    novaQuantidade--;
                }
                alterarQuantidade(sku, novaQuantidade);
            });
        });

        carrinhoContent.querySelectorAll('.remover-item').forEach(span => {
            span.addEventListener('click', (e) => {
                const sku = e.target.dataset.sku;
                removerDoCarrinho(sku);
            });
        });
    }

    carrinhoTotal.textContent = total.toFixed(2).replace('.', ',');
    carrinhoCount.textContent = carrinho.reduce((sum, item) => sum + item.quantidade, 0);

    // Esconde/mostra o contador do carrinho
    carrinhoCount.style.display = carrinho.length > 0 ? 'flex' : 'none';
}

// Abrir/Fechar Carrinho Sidebar
carrinhoIcon.addEventListener('click', () => {
    if (!isInteractingWithCart) { // Só abre/fecha se não estiver interagindo
        carrinhoSidebar.classList.add('open');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        document.body.style.touchAction = 'none'; // Evita scroll da página ao abrir carrinho
    }
});

fecharCarrinhoBtn.addEventListener('click', () => {
    carrinhoSidebar.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
});

overlay.addEventListener('click', () => {
    if (!isInteractingWithCart) { // Só fecha se não estiver interagindo
        carrinhoSidebar.classList.remove('open');
        modalOverlay.style.display = 'none'; // Fecha o modal também se estiver aberto
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        document.body.style.touchAction = '';
    }
});

// Lógica do Modal de Checkout
finalizarPedidoBtn.addEventListener('click', () => {
    if (carrinho.length === 0) {
        showFeedback('Seu carrinho está vazio!', true);
        return;
    }
    modalOverlay.style.display = 'flex';
    overlay.classList.add('active'); // Garante que o overlay esteja ativo
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
});

btnCancelarModal.addEventListener('click', () => {
    modalOverlay.style.display = 'none';
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
    // Limpa campos e remove classes de erro
    nomeClienteInput.value = '';
    telefoneClienteInput.value = '';
    observacoesInput.value = '';
    nomeClienteInput.classList.remove('error');
    telefoneClienteInput.classList.remove('error');
});

formDadosCliente.addEventListener('submit', (event) => {
    event.preventDefault();

    const nomeCliente = nomeClienteInput.value.trim();
    const telefoneCliente = telefoneClienteInput.value.trim();
    const observacoesCliente = observacoesInput.value.trim();

    // Validação
    let hasError = false;
    if (nomeCliente === '') {
        nomeClienteInput.classList.add('error');
        hasError = true;
    } else {
        nomeClienteInput.classList.remove('error');
    }

    if (telefoneCliente === '') { // Telefone agora é obrigatório
        telefoneClienteInput.classList.add('error');
        hasError = true;
    } else {
        telefoneClienteInput.classList.remove('error');
    }

    if (hasError) {
        showFeedback('Falta informação!', true);
        return;
    }

    // Gerar mensagem do WhatsApp
    let mensagemWhatsApp = `Olá! Gostaria de fazer o seguinte pedido da Loja Salve Maria Imaculada:\n\n`;

    carrinho.forEach(item => {
        const subtotal = (item.PRECO * item.quantidade).toFixed(2).replace('.', ',');
        const tamanhoExibicao = (typeof item.TAMANHO === 'string' && !isNaN(parseFloat(item.TAMANHO)) && !item.TAMANHO.toLowerCase().includes('cm'))
                               ? `${item.TAMANHO}cm`
                               : item.TAMANHO || 'N/A';
                               
        mensagemWhatsApp += `*Nome do Produto:* ${item.DESCRICAO}\n`;
        mensagemWhatsApp += `*Valor Unitário:* R$ ${item.PRECO.toFixed(2).replace('.', ',')}\n`;
        mensagemWhatsApp += `*Quantidade:* ${item.quantidade}\n`;
        mensagemWhatsApp += `*Subtotal:* R$ ${subtotal}\n`;
        mensagemWhatsApp += `*SKU:* ${item.SKU}\n`;
        mensagemWhatsApp += `----------\n`;
    });

    const totalCarrinho = carrinho.reduce((sum, item) => sum + (item.PRECO * item.quantidade), 0);
    mensagemWhatsApp += `*Total do Pedido:* R$ ${totalCarrinho.toFixed(2).replace('.', ',')}\n\n`;
    
    mensagemWhatsApp += `*Nome do Cliente:* ${nomeCliente}\n`;
    mensagemWhatsApp += `*Telefone:* ${telefoneCliente}\n`;
    if (observacoesCliente) {
        mensagemWhatsApp += `*Observações:* ${observacoesCliente}\n`;
    }

    mensagemWhatsApp += `\nConfirme, por gentileza, a disponibilidade e o frete.`;

    const urlWhatsApp = `https://api.whatsapp.com/send?phone=${TELEFONE_LOJA}&text=${encodeURIComponent(mensagemWhatsApp)}`;
    window.open(urlWhatsApp, '_blank');

    // Fechar modal e limpar carrinho
    modalOverlay.style.display = 'none';
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
    
    carrinho = [];
    salvarCarrinho();
    atualizarCarrinho();
    showFeedback('Pedido enviado para o WhatsApp!');

    // Limpa campos
    nomeClienteInput.value = '';
    telefoneClienteInput.value = '';
    observacoesInput.value = '';
});

// Event listeners para pesquisa
pesquisaInput.addEventListener('input', pesquisarProdutos);
limparPesquisaBtn.addEventListener('click', () => {
    pesquisaInput.value = '';
    pesquisarProdutos(); // Chama para limpar os resultados
});


// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    console.log('Inicializando loja...');
    carregarProdutos(); // Garante que produtosData é carregado e renderizado
});
