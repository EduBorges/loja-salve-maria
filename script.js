document.addEventListener('DOMContentLoaded', () => {

    // ---- CONFIGURAÇÕES E ESTADO DA APLICAÇÃO ---- //
    const TELEFONE_LOJA = "5515981475186";
    let todosOsProdutos = [];
    let carrinho = [];
    let termoPesquisa = '';
    let categoriaAtiva = 'todos';

    // ---- SELETORES DE ELEMENTOS DOM ---- //
    const produtosContainer = document.getElementById('produtos-container');
    const carrinhoFab = document.getElementById('carrinho-fab');
    const carrinhoSidebar = document.getElementById('carrinho-sidebar');
    const carrinhoContent = document.getElementById('carrinho-content');
    const overlay = document.getElementById('overlay');
    const carrinhoTotalEl = document.getElementById('carrinho-total');
    const carrinhoCountEl = document.getElementById('carrinho-count');
    const fecharCarrinhoBtn = document.getElementById('fechar-carrinho');
    const finalizarPedidoBtn = document.getElementById('finalizar-pedido');
    const categoriasContainer = document.getElementById('categorias-container');
    const feedbackEl = document.getElementById('feedback');
    const modalOverlay = document.getElementById('modal-overlay');
    const formDadosCliente = document.getElementById('dados-cliente');
    const btnCancelar = document.getElementById('cancelar-pedido');
    const pesquisaInput = document.getElementById('pesquisa-input');
    const limparPesquisaBtn = document.getElementById('limpar-pesquisa');

    // ---- FUNÇÕES PRINCIPAIS ---- //

    /**
     * Carrega os dados dos produtos do arquivo JSON e inicializa a loja.
     */
    async function carregarDados() {
        try {
            const response = await fetch('produtos.json');
            if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
            todosOsProdutos = await response.json();
            inicializarLoja();
        } catch (error) {
            console.error("Falha ao carregar produtos:", error);
            produtosContainer.innerHTML = '<p class="erro-carregamento">Não foi possível carregar os produtos. Tente recarregar a página.</p>';
        }
    }

    /**
     * Inicializa os componentes da loja após carregar os dados.
     */
    function inicializarLoja() {
        carregarCarrinhoDoLocalStorage();
        gerarBotoesCategoria();
        renderizarProdutos();
        atualizarCarrinho();
        adicionarEventListeners();
    }
    
    /**
     * Gera os botões de categoria dinamicamente a partir dos produtos.
     */
    function gerarBotoesCategoria() {
        const categorias = ['todos', ...new Set(todosOsProdutos.map(p => p.CATEGORIA))];
        categoriasContainer.innerHTML = '<h3>Categorias</h3>';
        
        categorias.forEach(categoria => {
            const btn = document.createElement('button');
            btn.className = 'categoria-btn';
            btn.dataset.categoria = categoria;
            btn.textContent = categoria.charAt(0).toUpperCase() + categoria.slice(1).toLowerCase();
            if (categoria === categoriaAtiva) {
                btn.classList.add('active');
            }
            categoriasContainer.appendChild(btn);
        });
    }

    /**
     * Renderiza os produtos na tela com base na categoria e pesquisa ativas.
     */
    function renderizarProdutos() {
        let produtosFiltrados = todosOsProdutos;

        if (categoriaAtiva !== 'todos') {
            produtosFiltrados = produtosFiltrados.filter(p => p.CATEGORIA === categoriaAtiva);
        }

        if (termoPesquisa) {
            produtosFiltrados = produtosFiltrados.filter(p =>
                Object.values(p).some(val =>
                    String(val).toLowerCase().includes(termoPesquisa)
                )
            );
        }

        produtosContainer.innerHTML = '';
        if (produtosFiltrados.length === 0) {
            produtosContainer.innerHTML = `<p class="nenhum-produto">Nenhum produto encontrado.</p>`;
            return;
        }

        produtosFiltrados.forEach(produto => {
            const card = document.createElement('div');
            card.className = 'produto-card';
            card.innerHTML = `
                <div class="produto-imagem-container">
                    <div class="placeholder-imagem">Carregando...</div>
                    <img class="produto-imagem" src="${produto.IMAGES[0]}" alt="${produto.DESCRICAO}" loading="lazy" onerror="this.previousElementSibling.textContent='Imagem indisponível'; this.style.display='none';">
                </div>
                <div class="produto-info">
                    <h4 class="produto-titulo">${produto.DESCRICAO}</h4>
                    <div class="produto-atributos">
                        ${produto.MATERIAL ? `<p>Material: ${produto.MATERIAL}</p>` : ''}
                        ${produto.TAMANHO ? `<p>Tamanho: ${produto.TAMANHO}</p>` : ''}
                    </div>
                    <p class="produto-preco">R$ ${produto.PRECO.toFixed(2).replace('.', ',')}</p>
                    <button class="add-carrinho" data-sku="${produto.SKU}">Adicionar</button>
                </div>
            `;
            // O SKU é intencionalmente omitido da interface do usuário
            produtosContainer.appendChild(card);
        });
    }


    // ---- FUNÇÕES DO CARRINHO ---- //

    function adicionarAoCarrinho(sku) {
        const produto = todosOsProdutos.find(p => p.SKU === sku);
        if (!produto) return;

        const itemExistente = carrinho.find(item => item.SKU === sku);
        if (itemExistente) {
            itemExistente.quantidade++;
        } else {
            carrinho.push({ ...produto, quantidade: 1 });
        }
        mostrarFeedback('Produto adicionado ao carrinho!');
        atualizarCarrinho();
    }
    
    function atualizarQuantidade(sku, novaQuantidade) {
        const item = carrinho.find(item => item.SKU === sku);
        if (item) {
            item.quantidade = Math.max(1, novaQuantidade);
            atualizarCarrinho();
        }
    }

    function removerDoCarrinho(sku) {
        carrinho = carrinho.filter(item => item.SKU !== sku);
        mostrarFeedback('Produto removido.');
        atualizarCarrinho();
    }

    /**
     * Atualiza a exibição do carrinho (UI e totais) e salva no localStorage.
     */
    function atualizarCarrinho() {
        salvarCarrinhoNoLocalStorage();
        carrinhoContent.innerHTML = '';

        if (carrinho.length === 0) {
            carrinhoContent.innerHTML = '<div class="carrinho-vazio">Seu carrinho está vazio</div>';
            carrinhoCountEl.style.display = 'none';
            carrinhoTotalEl.textContent = '0,00';
            return;
        }

        let totalGeral = 0;
        let totalItens = 0;

        carrinho.forEach(item => {
            const subtotal = item.PRECO * item.quantidade;
            totalGeral += subtotal;
            totalItens += item.quantidade;
            
            const itemDiv = document.createElement('div');
            itemDiv.className = 'carrinho-item';
            itemDiv.innerHTML = `
                <div class="carrinho-item-img-container">
                    <img class="carrinho-item-img" src="${item.IMAGES[0]}" alt="${item.DESCRICAO}">
                </div>
                <div class="carrinho-item-detalhes">
                    <div class="carrinho-item-titulo">${item.DESCRICAO}</div>
                    <div class="carrinho-item-preco">R$ ${subtotal.toFixed(2).replace('.', ',')}</div>
                    <div class="carrinho-item-controles">
                        <button class="quantidade-btn" data-sku="${item.SKU}" data-action="decrementar">-</button>
                        <input type="number" class="quantidade-input" value="${item.quantidade}" min="1" data-sku="${item.SKU}">
                        <button class="quantidade-btn" data-sku="${item.SKU}" data-action="incrementar">+</button>
                        <span class="remover-item" data-sku="${item.SKU}">Remover</span>
                    </div>
                </div>
            `;
            carrinhoContent.appendChild(itemDiv);
        });

        carrinhoTotalEl.textContent = totalGeral.toFixed(2).replace('.', ',');
        carrinhoCountEl.textContent = totalItens;
        carrinhoCountEl.style.display = 'flex';
    }

    // ---- FUNÇÕES DE UI E INTERAÇÃO ---- //

    function toggleCarrinho() {
        carrinhoSidebar.classList.toggle('open');
        overlay.classList.toggle('active');
        document.body.style.overflow = carrinhoSidebar.classList.contains('open') ? 'hidden' : '';
    }

    function finalizarPedido() {
        if (carrinho.length === 0) {
            mostrarFeedback('Seu carrinho está vazio!', 'error');
            return;
        }
        modalOverlay.style.display = 'flex';
        document.getElementById('nome-cliente').focus();
    }
    
    function mostrarFeedback(texto, tipo = 'success') {
        feedbackEl.textContent = texto;
        feedbackEl.className = `feedback ${tipo} show`;
        setTimeout(() => {
            feedbackEl.classList.remove('show');
        }, 3000);
    }

    function handlePesquisa() {
        termoPesquisa = pesquisaInput.value.trim().toLowerCase();
        limparPesquisaBtn.style.display = termoPesquisa ? 'block' : 'none';
        renderizarProdutos();
    }
    
    function limparPesquisa() {
        pesquisaInput.value = '';
        handlePesquisa();
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        const nomeCliente = document.getElementById('nome-cliente').value.trim();
        if (!nomeCliente) {
            mostrarFeedback('Por favor, informe seu nome!', 'error');
            return;
        }
        
        const observacoes = document.getElementById('observacoes').value.trim();
        let mensagem = `*Pedido da Loja Salve Maria Imaculada*\n\n`;
        mensagem += `*Cliente:* ${nomeCliente}\n\n`;
        mensagem += `*Itens do Pedido:*\n`;

        carrinho.forEach(item => {
            mensagem += `--------------------\n`;
            mensagem += `*Produto:* ${item.DESCRICAO}\n`;
            mensagem += `*SKU:* ${item.SKU}\n`; // SKU incluído aqui
            mensagem += `*Qtd:* ${item.quantidade}\n`;
            mensagem += `*Subtotal:* R$ ${(item.PRECO * item.quantidade).toFixed(2).replace('.', ',')}\n`;
        });
        
        const total = carrinho.reduce((sum, item) => sum + (item.PRECO * item.quantidade), 0);
        mensagem += `--------------------\n`;
        mensagem += `*Total do Pedido: R$ ${total.toFixed(2).replace('.', ',')}*\n\n`;

        if (observacoes) {
            mensagem += `*Observações:* ${observacoes}\n\n`;
        }
        
        mensagem += `Aguardando confirmação e cálculo do frete.`;
        
        const linkWhatsApp = `https://wa.me/${TELEFONE_LOJA}?text=${encodeURIComponent(mensagem)}`;
        
        window.open(linkWhatsApp, '_blank');

        // Limpa tudo após enviar
        carrinho = [];
        atualizarCarrinho();
        modalOverlay.style.display = 'none';
        formDadosCliente.reset();
        toggleCarrinho(); // Fecha o carrinho
        mostrarFeedback('Pedido enviado! Você foi redirecionado para o WhatsApp.');
    }

    // ---- PERSISTÊNCIA (localStorage) ---- //

    function salvarCarrinhoNoLocalStorage() {
        localStorage.setItem('carrinhoLojaSMI', JSON.stringify(carrinho));
    }

    function carregarCarrinhoDoLocalStorage() {
        const carrinhoSalvo = localStorage.getItem('carrinhoLojaSMI');
        if (carrinhoSalvo) {
            carrinho = JSON.parse(carrinhoSalvo);
        }
    }

    // ---- EVENT LISTENERS ---- //

    function adicionarEventListeners() {
        // Categorias e Produtos
        categoriasContainer.addEventListener('click', e => {
            if (e.target.classList.contains('categoria-btn')) {
                categoriaAtiva = e.target.dataset.categoria;
                document.querySelectorAll('.categoria-btn').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                renderizarProdutos();
            }
        });

        produtosContainer.addEventListener('click', e => {
            if (e.target.classList.contains('add-carrinho')) {
                adicionarAoCarrinho(e.target.dataset.sku);
            }
        });

        // Pesquisa
        pesquisaInput.addEventListener('input', handlePesquisa);
        limparPesquisaBtn.addEventListener('click', limparPesquisa);
        
        // Carrinho
        carrinhoFab.addEventListener('click', toggleCarrinho);
        fecharCarrinhoBtn.addEventListener('click', toggleCarrinho);
        overlay.addEventListener('click', toggleCarrinho);
        finalizarPedidoBtn.addEventListener('click', finalizarPedido);

        carrinhoContent.addEventListener('click', e => {
            const target = e.target;
            const sku = target.dataset.sku;

            if (target.classList.contains('quantidade-btn')) {
                const input = target.parentElement.querySelector('.quantidade-input');
                let qtde = parseInt(input.value);
                if (target.dataset.action === 'incrementar') qtde++;
                else if (target.dataset.action === 'decrementar') qtde--;
                atualizarQuantidade(sku, qtde);
            }
            if (target.classList.contains('remover-item')) {
                removerDoCarrinho(sku);
            }
        });
        
        carrinhoContent.addEventListener('change', e => {
            if (e.target.classList.contains('quantidade-input')) {
                atualizarQuantidade(e.target.dataset.sku, parseInt(e.target.value));
            }
        });

        // Modal
        formDadosCliente.addEventListener('submit', handleFormSubmit);
        btnCancelar.addEventListener('click', () => modalOverlay.style.display = 'none');
    }

    // ---- INICIALIZAÇÃO ---- //
    carregarDados();
});
