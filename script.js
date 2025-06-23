document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURAÇÕES ---
    const TELEFONE_LOJA = "5515981475186"; // Coloque aqui o WhatsApp da loja

    // --- ESTADO DA APLICAÇÃO ---
    let produtos = [];
    let carrinho = [];
    let termoPesquisa = '';
    let categoriaAtiva = 'todos';

    // --- ELEMENTOS DOM ---
    const produtosContainer = document.getElementById('produtos-container');
    const carrinhoIcon = document.getElementById('carrinho-icon');
    const carrinhoSidebar = document.getElementById('carrinho-sidebar');
    const carrinhoContent = document.getElementById('carrinho-content');
    const overlay = document.getElementById('overlay');
    const carrinhoTotalEl = document.getElementById('carrinho-total');
    const carrinhoCount = document.getElementById('carrinho-count');
    const fecharCarrinhoBtn = document.getElementById('fechar-carrinho');
    const finalizarPedidoBtn = document.getElementById('finalizar-pedido');
    const categoriasContainer = document.querySelector('.categorias');
    const feedbackEl = document.getElementById('feedback');
    const modalOverlay = document.getElementById('modal-overlay');
    const formDadosCliente = document.getElementById('dados-cliente');
    const btnCancelar = document.getElementById('cancelar-pedido');
    const pesquisaInput = document.getElementById('pesquisa-input');
    const pesquisaBtn = document.getElementById('pesquisa-btn');
    const limparPesquisaBtn = document.getElementById('limpar-pesquisa');

    // --- FUNÇÕES PRINCIPAIS ---

    // Carrega os produtos do arquivo JSON
    async function carregarDadosIniciais() {
        try {
            const response = await fetch('produtos.json');
            if (!response.ok) {
                throw new Error(`Erro ao buscar produtos: ${response.statusText}`);
            }
            produtos = await response.json();
            carregarCarrinhoDoLocalStorage();
            inicializarLoja();
        } catch (error) {
            console.error("Falha ao carregar produtos.json:", error);
            produtosContainer.innerHTML = `<p style="text-align: center; grid-column: 1 / -1; color: red;">Não foi possível carregar o catálogo. Tente recarregar a página.</p>`;
        }
    }

    // Inicia a loja após os dados serem carregados
    function inicializarLoja() {
        gerarBotoesCategoria();
        renderizarProdutos();
        atualizarCarrinhoUI();
        configurarEventListeners();
    }

    // --- FUNÇÕES DE RENDERIZAÇÃO E UI ---

    // Gera os botões de categoria dinamicamente
    function gerarBotoesCategoria() {
        const categorias = ['todos', ...new Set(produtos.map(p => p.CATEGORIA))];
        categoriasContainer.innerHTML = '';
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

    // Renderiza os produtos na tela
    function renderizarProdutos() {
        produtosContainer.innerHTML = '';
        
        const produtosFiltrados = produtos.filter(produto => {
            const correspondeCategoria = categoriaAtiva === 'todos' || produto.CATEGORIA === categoriaAtiva;
            const correspondePesquisa = termoPesquisa === '' ||
                Object.values(produto).some(val =>
                    String(val).toLowerCase().includes(termoPesquisa)
                );
            return correspondeCategoria && correspondePesquisa;
        });

        if (produtosFiltrados.length === 0) {
            produtosContainer.innerHTML = `<p style="grid-column: 1 / -1; text-align: center;">Nenhum produto encontrado.</p>`;
            return;
        }

        produtosFiltrados.forEach(produto => {
            const card = document.createElement('div');
            card.className = 'produto-card';
            card.innerHTML = `
                <div class="produto-imagem-container">
                    <img class="produto-imagem" src="${produto.IMAGES[0]}" alt="${produto.DESCRICAO}" loading="lazy" onerror="this.parentElement.innerHTML = '<div class=\\'placeholder-imagem\\'>Imagem indisponível</div>';">
                </div>
                <div class="produto-info">
                    <h3 class="produto-titulo">${produto.DESCRICAO}</h3>
                    <div class="produto-atributos">
                        <p><strong>Material:</strong> ${produto.MATERIAL}</p>
                        <p><strong>Tamanho:</strong> ${produto.TAMANHO}</p>
                    </div>
                    <div class="produto-preco">R$ ${produto.PRECO.toFixed(2).replace('.', ',')}</div>
                    <button class="add-carrinho" data-sku="${produto.SKU}">Adicionar ao Carrinho</button>
                </div>
            `;
            produtosContainer.appendChild(card);
        });
    }
    
    // Atualiza a interface do carrinho (sidebar)
    function atualizarCarrinhoUI() {
        carrinhoContent.innerHTML = '';
        if (carrinho.length === 0) {
            carrinhoContent.innerHTML = '<div class="carrinho-vazio">Seu carrinho está vazio</div>';
        } else {
            carrinho.forEach(item => {
                const itemEl = document.createElement('div');
                itemEl.className = 'carrinho-item';
                itemEl.innerHTML = `
                    <div class="carrinho-item-img-container">
                        <img class="carrinho-item-img" src="${item.IMAGES[0]}" alt="${item.DESCRICAO}">
                    </div>
                    <div class="carrinho-item-detalhes">
                        <div class="carrinho-item-titulo">${item.DESCRICAO}</div>
                        <div class="carrinho-item-preco">R$ ${(item.PRECO * item.quantidade).toFixed(2).replace('.', ',')}</div>
                        <div class="carrinho-item-controles">
                            <button class="quantidade-btn" data-action="decrementar" data-sku="${item.SKU}">-</button>
                            <input type="number" class="quantidade-input" value="${item.quantidade}" min="1" data-sku="${item.SKU}">
                            <button class="quantidade-btn" data-action="incrementar" data-sku="${item.SKU}">+</button>
                            <span class="remover-item" data-sku="${item.SKU}">Remover</span>
                        </div>
                    </div>
                `;
                carrinhoContent.appendChild(itemEl);
            });
        }
        
        const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
        const totalPreco = carrinho.reduce((acc, item) => acc + (item.PRECO * item.quantidade), 0);
        
        carrinhoCount.textContent = totalItens;
        carrinhoCount.style.display = totalItens > 0 ? 'flex' : 'none';
        carrinhoTotalEl.textContent = totalPreco.toFixed(2).replace('.', ',');

        salvarCarrinhoNoLocalStorage();
    }

    // Mostra uma mensagem de feedback (snackbar)
    function mostrarFeedback(mensagem, tipo = 'success') {
        feedbackEl.textContent = mensagem;
        feedbackEl.className = `feedback ${tipo === 'error' ? 'error' : ''} show`;
        setTimeout(() => {
            feedbackEl.classList.remove('show');
        }, 3000);
    }

    // --- LÓGICA DO CARRINHO ---
    
    function adicionarAoCarrinho(sku) {
        const itemExistente = carrinho.find(item => item.SKU === sku);
        if (itemExistente) {
            itemExistente.quantidade++;
        } else {
            const produto = produtos.find(p => p.SKU === sku);
            carrinho.push({ ...produto, quantidade: 1 });
        }
        mostrarFeedback('Produto adicionado ao carrinho!');
        atualizarCarrinhoUI();
    }

    function atualizarQuantidade(sku, quantidade) {
        const item = carrinho.find(item => item.SKU === sku);
        if (item) {
            item.quantidade = Math.max(1, quantidade);
        }
        atualizarCarrinhoUI();
    }
    
    function removerDoCarrinho(sku) {
        carrinho = carrinho.filter(item => item.SKU !== sku);
        mostrarFeedback('Produto removido do carrinho', 'error');
        atualizarCarrinhoUI();
    }

    function salvarCarrinhoNoLocalStorage() {
        localStorage.setItem('carrinhoLoja', JSON.stringify(carrinho));
    }
    
    function carregarCarrinhoDoLocalStorage() {
        const carrinhoSalvo = localStorage.getItem('carrinhoLoja');
        if (carrinhoSalvo) {
            carrinho = JSON.parse(carrinhoSalvo);
        }
    }
    
    // --- LÓGICA DO WHATSAPP ---

    function finalizarPedido() {
        if (carrinho.length === 0) {
            mostrarFeedback('Seu carrinho está vazio!', 'error');
            return;
        }
        modalOverlay.style.display = 'flex';
    }

    function enviarPedidoWhatsApp(e) {
        e.preventDefault();
        const nomeCliente = document.getElementById('nome-cliente').value.trim();
        const observacoes = document.getElementById('observacoes').value.trim();

        if (!nomeCliente) {
            mostrarFeedback('Por favor, informe seu nome.', 'error');
            return;
        }

        let mensagem = `*Pedido da Loja Salve Maria Imaculada*\n\n`;
        mensagem += `*Cliente:* ${nomeCliente}\n\n`;
        mensagem += `*Itens do Pedido:*\n`;
        carrinho.forEach(item => {
            mensagem += `--------------------\n`;
            mensagem += `*Produto:* ${item.DESCRICAO}\n`;
            mensagem += `*Qtd:* ${item.quantidade}\n`;
            mensagem += `*Preço:* R$ ${(item.PRECO * item.quantidade).toFixed(2).replace('.', ',')}\n`;
        });
        mensagem += `--------------------\n`;
        
        const totalPedido = carrinho.reduce((acc, item) => acc + (item.PRECO * item.quantidade), 0);
        mensagem += `*Total do Pedido:* R$ ${totalPedido.toFixed(2).replace('.', ',')}\n\n`;

        if (observacoes) {
            mensagem += `*Observações:* ${observacoes}\n\n`;
        }
        
        mensagem += `Aguardo confirmação do pedido e informações sobre o frete. Obrigado!`;
        
        const linkWhatsApp = `https://wa.me/${TELEFONE_LOJA}?text=${encodeURIComponent(mensagem)}`;
        
        window.open(linkWhatsApp, '_blank');
        
        // Limpa o carrinho e o formulário
        carrinho = [];
        formDadosCliente.reset();
        modalOverlay.style.display = 'none';
        atualizarCarrinhoUI();
        mostrarFeedback('Pedido enviado com sucesso!');
    }

    // --- CONFIGURAÇÃO DE EVENT LISTENERS ---
    
    function configurarEventListeners() {
        // Pesquisa
        pesquisaBtn.addEventListener('click', () => {
            termoPesquisa = pesquisaInput.value.trim().toLowerCase();
            limparPesquisaBtn.style.display = termoPesquisa ? 'block' : 'none';
            renderizarProdutos();
        });
        limparPesquisaBtn.addEventListener('click', () => {
            pesquisaInput.value = '';
            termoPesquisa = '';
            limparPesquisaBtn.style.display = 'none';
            renderizarProdutos();
        });
        pesquisaInput.addEventListener('keyup', (e) => {
             if (e.key === 'Enter') {
                pesquisaBtn.click();
            }
            limparPesquisaBtn.style.display = pesquisaInput.value ? 'block' : 'none';
        });

        // Categorias
        categoriasContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('categoria-btn')) {
                categoriaAtiva = e.target.dataset.categoria;
                document.querySelector('.categoria-btn.active').classList.remove('active');
                e.target.classList.add('active');
                renderizarProdutos();
            }
        });

        // Adicionar ao carrinho
        produtosContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-carrinho')) {
                const sku = e.target.dataset.sku;
                adicionarAoCarrinho(sku);
            }
        });

        // Controles do Carrinho (sidebar)
        const fecharCarrinho = () => {
            carrinhoSidebar.classList.remove('open');
            overlay.classList.remove('active');
        }
        carrinhoIcon.addEventListener('click', () => {
            carrinhoSidebar.classList.add('open');
            overlay.classList.add('active');
        });
        fecharCarrinhoBtn.addEventListener('click', fecharCarrinho);
        overlay.addEventListener('click', fecharCarrinho);
        
        // Ações dentro do carrinho
        carrinhoContent.addEventListener('click', e => {
            const sku = e.target.dataset.sku;
            if (e.target.classList.contains('remover-item')) {
                removerDoCarrinho(sku);
            }
            if (e.target.classList.contains('quantidade-btn')) {
                const acao = e.target.dataset.action;
                const item = carrinho.find(i => i.SKU === sku);
                if (acao === 'incrementar') {
                    item.quantidade++;
                } else if (acao === 'decrementar') {
                    item.quantidade = Math.max(1, item.quantidade - 1);
                }
                atualizarCarrinhoUI();
            }
        });
        carrinhoContent.addEventListener('change', e => {
            if (e.target.classList.contains('quantidade-input')) {
                const sku = e.target.dataset.sku;
                const novaQuantidade = parseInt(e.target.value, 10);
                atualizarQuantidade(sku, novaQuantidade);
            }
        });

        // Finalizar Pedido
        finalizarPedidoBtn.addEventListener('click', finalizarPedido);
        formDadosCliente.addEventListener('submit', enviarPedidoWhatsApp);
        btnCancelar.addEventListener('click', () => modalOverlay.style.display = 'none');
        modalOverlay.addEventListener('click', (e) => {
             if (e.target === modalOverlay) {
                modalOverlay.style.display = 'none';
            }
        });
    }

    // --- INICIALIZAÇÃO ---
    carregarDadosIniciais();
});
