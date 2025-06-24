document.addEventListener('DOMContentLoaded', () => {

    // ---- CONFIGURAÇÕES E ESTADO DA APLICAÇÃO ---- //
    const TELEFONE_LOJA = "5515981475186";
    const LIMITE_POR_ITEM = 3;
    let todosOsProdutos = [];
    let carrinho = [];

    // ---- SELETORES DE ELEMENTOS DOM ---- //
    const produtosContainer = document.getElementById('produtos-container');
    const categoriasContainer = document.getElementById('categorias-container');
    const carrinhoFab = document.getElementById('carrinho-fab');
    const carrinhoSidebar = document.getElementById('carrinho-sidebar');
    const carrinhoContent = document.getElementById('carrinho-content');
    const overlay = document.getElementById('overlay');
    const carrinhoTotalEl = document.getElementById('carrinho-total');
    const carrinhoCountEl = document.getElementById('carrinho-count');
    const fecharCarrinhoBtn = document.getElementById('fechar-carrinho');
    const finalizarPedidoBtn = document.getElementById('finalizar-pedido');
    const pesquisaInput = document.getElementById('pesquisa-input');
    const limparPesquisaBtn = document.getElementById('limpar-pesquisa');
    const feedbackEl = document.getElementById('feedback');
    // ---- FUNÇÕES PRINCIPAIS ---- //

    /**
     * Carrega os dados dos produtos do arquivo JSON e inicializa a loja.
     */
    async function carregarDados() {
        try {
            const response = await fetch('produtos.json');
            if (!response.ok) throw new Error(`Erro ao carregar: ${response.statusText}`);
            todosOsProdutos = await response.json();
            inicializarLoja();
            } catch (error) {
            produtosContainer.innerHTML = `<p>Falha ao carregar produtos. Tente novamente mais tarde.</p>`;
            console.error(error);
        }
    }

    /**
     * Inicializa os componentes da loja.
     */
    function inicializarLoja() {
        carregarCarrinhoDoLocalStorage();
        gerarBotoesCategoria();
        renderizarProdutos();
        atualizarCarrinho();
        adicionarEventListeners();
        }
    
    /**
     * Gera os botões de categoria dinamicamente.
     */
    function gerarBotoesCategoria() {
        const categorias = ['Todos', ...new Set(todosOsProdutos.map(p => p.CATEGORIA))];
        categoriasContainer.innerHTML = '<h3>Categorias</h3>';
        categorias.forEach(categoria => {
            const btn = document.createElement('button');
            btn.className = 'categoria-btn';
            btn.dataset.categoria = categoria;
            btn.textContent = categoria.charAt(0).toUpperCase() + categoria.slice(1).toLowerCase();
            if (categoria === 'Todos') btn.classList.add('active');
            categoriasContainer.appendChild(btn);
        
            });
    }

    /**
     * Renderiza os produtos na tela com base nos filtros.
     */
    function renderizarProdutos() {
        const categoriaAtiva = document.querySelector('.categoria-btn.active')?.dataset.categoria || 'Todos';
        const termoPesquisa = pesquisaInput.value.toLowerCase();

        const produtosFiltrados = todosOsProdutos.filter(produto => {
            const correspondeCategoria = categoriaAtiva === 'Todos' || produto.CATEGORIA === categoriaAtiva;
            const correspondePesquisa = termoPesquisa === '' || Object.values(produto).some(val => 
                String(val).toLowerCase().includes(termoPesquisa)
            );
            return correspondeCategoria && correspondePesquisa;
      
              });

        produtosContainer.innerHTML = '';
        if (produtosFiltrados.length === 0) {
            produtosContainer.innerHTML = `<p>Nenhum produto encontrado.</p>`;
            return;
        }

        produtosFiltrados.forEach(produto => {
            const card = document.createElement('div');
            card.className = 'produto-card';
            card.innerHTML = `
                <div class="produto-imagem-container">
                    <img class="produto-imagem" src="${produto.IMAGES[0]}" alt="${produto.DESCRICAO}" loading="lazy">
     
                               </div>
                <div class="produto-info">
                    <h4 class="produto-titulo">${produto.DESCRICAO}</h4>
                    <p class="produto-preco">R$ ${produto.PRECO.toFixed(2).replace('.', ',')}</p>
                    <button class="add-carrinho" data-sku="${produto.SKU}">Adicionar</button>
      
                              </div>`;
            produtosContainer.appendChild(card);
        });
        }

    // ---- FUNÇÕES DO CARRINHO ---- //

    function adicionarAoCarrinho(sku) {
        const itemExistente = carrinho.find(item => item.SKU === sku);
        if (itemExistente) {
            if (itemExistente.quantidade < LIMITE_POR_ITEM) {
                itemExistente.quantidade++;
                } else {
                // Ajuste na mensagem de erro conforme solicitado
                mostrarFeedback(`Limitado a 3 itens por cliente`);
                return;
            }
        } else {
            const produto = todosOsProdutos.find(p => p.SKU === sku);
            carrinho.push({ ...produto, quantidade: 1 });
        }
        atualizarCarrinho();
        }
    
    function atualizarQuantidade(sku, novaQuantidade) {
        const item = carrinho.find(item => item.SKU === sku);
        if (!item) return;

        if (novaQuantidade > LIMITE_POR_ITEM) {
            // Ajuste na mensagem de erro conforme solicitado
            mostrarFeedback(`Limitado a 3 itens por cliente`);
            item.quantidade = LIMITE_POR_ITEM;
        } else {
            item.quantidade = Math.max(1, novaQuantidade);
            // Garante que não seja menor que 1
        }
        atualizarCarrinho();
        }

    function removerDoCarrinho(sku) {
        carrinho = carrinho.filter(item => item.SKU !== sku);
        atualizarCarrinho();
    }

    function atualizarCarrinho() {
        salvarCarrinhoNoLocalStorage();
        carrinhoContent.innerHTML = '';
        let totalGeral = 0;
        let totalItens = 0;

        if (carrinho.length === 0) {
            carrinhoContent.innerHTML = `<p style="text-align:center; padding: 2rem 0;">Seu carrinho está vazio.</p>`;
            } else {
            carrinho.forEach(item => {
                const subtotal = item.PRECO * item.quantidade;
                totalGeral += subtotal;
                totalItens += item.quantidade;
                
           
                     const itemDiv = document.createElement('div');
                itemDiv.className = 'carrinho-item';
                itemDiv.innerHTML = `
                    <img class="carrinho-item-img" src="${item.IMAGES[0]}" alt="${item.DESCRICAO}">
                    <div class="carrinho-item-detalhes">
            
                                    <div class="carrinho-item-titulo">${item.DESCRICAO}</div>
                        <div class="carrinho-item-preco">Subtotal: R$ ${subtotal.toFixed(2).replace('.', ',')}</div>
                        <div class="carrinho-item-controles">
                            <button class="quantidade-btn" data-sku="${item.SKU}" data-action="decrementar">-</button>
   
                                                     <input type="number" class="quantidade-input" value="${item.quantidade}" min="1" max="${LIMITE_POR_ITEM}" data-sku="${item.SKU}">
                            <button class="quantidade-btn" data-sku="${item.SKU}" data-action="incrementar">+</button>
                            <span class="remover-item" data-sku="${item.SKU}">Remover</span>
        
                                            </div>
                    </div>`;
                carrinhoContent.appendChild(itemDiv);
            });
        }

        carrinhoTotalEl.textContent = totalGeral.toFixed(2).replace('.', ',');
        carrinhoCountEl.textContent = totalItens;
        carrinhoCountEl.style.display = totalItens > 0 ? 'flex' : 'none';
    }

    function finalizarPedido() {
        if (carrinho.length === 0) {
            mostrarFeedback("Seu carrinho está vazio para finalizar a compra.");
            return;
        }
        
        let mensagem = "Pedido via Site:\n\n";
        
        // Ajuste no formato da mensagem do WhatsApp
        carrinho.forEach(item => {
            const subtotal = item.PRECO * item.quantidade;
            const valorUnitario = item.PRECO.toFixed(2).replace('.', ',');
            const subtotalFormatado = subtotal.toFixed(2).replace('.', ',');
            
            mensagem += `${item.DESCRICAO} - R$ ${valorUnitario} x ${item.quantidade} x R$ ${subtotalFormatado}\n`;
        });

        const total = carrinho.reduce((sum, item) => sum + (item.PRECO * item.quantidade), 0);
        
        mensagem += "\n"; // Adiciona uma linha em branco para separar os itens do total
        mensagem += `Total Geral: R$ ${total.toFixed(2).replace('.', ',')}`;

        const linkWhatsApp = `https://wa.me/${TELEFONE_LOJA}?text=${encodeURIComponent(mensagem)}`;
        window.open(linkWhatsApp, '_blank');
        }

    // ---- FUNÇÕES AUXILIARES E DE UI ---- //

    function toggleCarrinho() {
        carrinhoSidebar.classList.toggle('open');
        overlay.classList.toggle('active');
        document.body.style.overflow = carrinhoSidebar.classList.contains('open') ? 'hidden' : '';
    }
    
    function mostrarFeedback(texto) {
        feedbackEl.textContent = texto;
        feedbackEl.classList.add('show');
        setTimeout(() => {
            feedbackEl.classList.remove('show');
        }, 3000);
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
    
    // ---- EVENT LISTENERS ---- //
    function adicionarEventListeners() {
        // Filtros e Pesquisa
        categoriasContainer.addEventListener('click', e => {
            if (e.target.classList.contains('categoria-btn')) {
                document.querySelector('.categoria-btn.active').classList.remove('active');
                e.target.classList.add('active');
         
                       renderizarProdutos();
            }
        });
        pesquisaInput.addEventListener('input', renderizarProdutos);
        limparPesquisaBtn.addEventListener('click', () => {
            pesquisaInput.value = '';
            renderizarProdutos();
        });
        pesquisaInput.addEventListener('keyup', () => {
            limparPesquisaBtn.style.display = pesquisaInput.value ? 'block' : 'none';
        });
        // Adicionar ao carrinho
        produtosContainer.addEventListener('click', e => {
            if (e.target.classList.contains('add-carrinho')) {
                adicionarAoCarrinho(e.target.dataset.sku);
            }
        });
        // Controles do Carrinho
        carrinhoFab.addEventListener('click', toggleCarrinho);
        fecharCarrinhoBtn.addEventListener('click', toggleCarrinho);
        overlay.addEventListener('click', toggleCarrinho);
        finalizarPedidoBtn.addEventListener('click', finalizarPedido);
        carrinhoContent.addEventListener('click', e => {
            const sku = e.target.dataset.sku;
            if (!sku) return;

            if (e.target.classList.contains('remover-item')) {
                removerDoCarrinho(sku);
            }
            if (e.target.matches('[data-action="incrementar"]')) {
            
                    const item = carrinho.find(i => i.SKU === sku);
                if (item) atualizarQuantidade(sku, item.quantidade + 1);
            }
            if (e.target.matches('[data-action="decrementar"]')) {
                const item = carrinho.find(i => i.SKU === sku);
                if (item) atualizarQuantidade(sku, 
                    item.quantidade - 1);
            }
        });
        carrinhoContent.addEventListener('change', e => {
            if (e.target.classList.contains('quantidade-input')) {
                atualizarQuantidade(e.target.dataset.sku, parseInt(e.target.value));
            }
        });
        }

    // ---- INICIALIZAÇÃO ---- //
    carregarDados();
});
