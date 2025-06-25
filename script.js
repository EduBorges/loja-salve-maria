document.addEventListener('DOMContentLoaded', () => {
    // Configurações
    const TELEFONE_LOJA = "5515981475186";
    const LIMITE_POR_PRODUTO = 3;

    // Estado da aplicação
    let todosProdutos = [];
    let carrinho = [];
    let termoPesquisa = '';
    let categoriaAtiva = 'todos';

    // Elementos DOM
    const produtosContainer = document.getElementById('produtos-container');
    const carrinhoIcon = document.getElementById('carrinho-icon');
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

    // --- FUNÇÕES DE INICIALIZAÇÃO E RENDERIZAÇÃO ---

    // Carrega dados iniciais
    async function init() {
        try {
            const response = await fetch('produtos.json');
            todosProdutos = await response.json();
            carregarCarrinhoDoLocalStorage();
            gerarBotoesCategoria();
            renderizarProdutos();
            atualizarCarrinho(false); // Não mostrar feedback na carga inicial
        } catch (error) {
            console.error("Falha ao carregar os produtos:", error);
            produtosContainer.innerHTML = `<p style="grid-column: 1 / -1; text-align: center;">Não foi possível carregar os produtos. Tente novamente mais tarde.</p>`;
        }
    }

    // Gera os botões de categoria
    function gerarBotoesCategoria() {
        const categorias = [...new Set(todosProdutos.map(p => p.CATEGORIA))];
        const todosBtn = categoriasContainer.querySelector('.categoria-btn[data-categoria="todos"]');
        categoriasContainer.innerHTML = '';
        categoriasContainer.appendChild(todosBtn);

        categorias.sort().forEach(categoria => {
            const btn = document.createElement('button');
            btn.className = 'categoria-btn';
            btn.dataset.categoria = categoria;
            btn.textContent = categoria.charAt(0).toUpperCase() + categoria.slice(1).toLowerCase();
            categoriasContainer.appendChild(btn);
        });

        categoriasContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('categoria-btn')) {
                categoriasContainer.querySelector('.active').classList.remove('active');
                e.target.classList.add('active');
                categoriaAtiva = e.target.dataset.categoria;
                renderizarProdutos();
            }
        });
    }

    // Formata o tamanho do produto para exibição
    function formatarTamanho(tamanho) {
        if (!tamanho || typeof tamanho !== 'string') return '';
        if (tamanho.toLowerCase() === 'media' || tamanho.toLowerCase() === 'bolso') {
            return tamanho.charAt(0).toUpperCase() + tamanho.slice(1);
        }
        const tamanhoNumerico = tamanho.replace(/[^0-9]/g, '');
        return tamanhoNumerico ? `${tamanhoNumerico} cm` : tamanho;
    }

    // Renderiza os produtos na tela
    function renderizarProdutos() {
        let produtosFiltrados = todosProdutos;

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
            produtosContainer.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--cor-texto-claro);">
                    <p>Nenhum produto encontrado.</p>
                </div>`;
            return;
        }

        produtosFiltrados.forEach(produto => {
            const produtoCard = document.createElement('div');
            produtoCard.className = 'produto-card';
            produtoCard.innerHTML = `
                <div class="produto-imagem-container">
                    <div class="placeholder-imagem">Carregando...</div>
                    <img class="produto-imagem" src="${produto.IMAGES[0]}" alt="${produto.DESCRICAO}" loading="lazy" style="display:none;">
                </div>
                <div class="produto-info">
                    <div class="produto-titulo">${produto.DESCRICAO}</div>
                    <div class="produto-atributos">
                        <p><strong>Material:</strong> ${produto.MATERIAL}</p>
                        <p><strong>Tamanho:</strong> ${formatarTamanho(produto.TAMANHO)}</p>
                    </div>
                    <div class="produto-preco">R$ ${produto.PRECO.toFixed(2).replace('.', ',')}</div>
                    <button class="add-carrinho" data-sku="${produto.SKU}">Adicionar ao Carrinho</button>
                </div>`;
            
            const img = produtoCard.querySelector('.produto-imagem');
            const placeholder = produtoCard.querySelector('.placeholder-imagem');

            img.onload = () => {
                placeholder.style.display = 'none';
                img.style.display = 'block';
            };
            img.onerror = () => {
                placeholder.textContent = 'Imagem indisponível';
            };

            produtosContainer.appendChild(produtoCard);
        });
    }

    // --- FUNÇÕES DO CARRINHO ---

    function adicionarAoCarrinho(sku) {
        const itemExistente = carrinho.find(item => item.SKU === sku);

        if (itemExistente) {
            if (itemExistente.quantidade < LIMITE_POR_PRODUTO) {
                itemExistente.quantidade++;
                mostrarFeedback('Quantidade atualizada!', 'success');
            } else {
                mostrarFeedback('Limite Atingido', 'error');
                return;
            }
        } else {
            const produto = todosProdutos.find(p => p.SKU === sku);
            if (produto) {
                carrinho.push({ ...produto, quantidade: 1 });
                mostrarFeedback('Incluído no carrinho', 'success');
            }
        }
        atualizarCarrinho();
    }
    
    function removerDoCarrinho(sku) {
        carrinho = carrinho.filter(item => item.SKU !== sku);
        atualizarCarrinho();
    }

    function atualizarQuantidade(sku, novaQuantidade) {
        const item = carrinho.find(item => item.SKU === sku);
        if (item) {
            novaQuantidade = Math.max(1, Math.min(novaQuantidade, LIMITE_POR_PRODUTO));
             if (item.quantidade === novaQuantidade && novaQuantidade === LIMITE_POR_PRODUTO) {
                mostrarFeedback('Limite Atingido', 'error');
            }
            item.quantidade = novaQuantidade;
            atualizarCarrinho();
        }
    }

    function atualizarCarrinho(notificar = true) {
        salvarCarrinhoNoLocalStorage();
        renderizarItensCarrinho();
        atualizarContadorEtotal();
        if (notificar) {
           // mostrarFeedback('Carrinho atualizado');
        }
    }

    function renderizarItensCarrinho() {
        carrinhoContent.innerHTML = '';
        if (carrinho.length === 0) {
            carrinhoContent.innerHTML = '<div class="carrinho-vazio">Seu carrinho está vazio</div>';
            return;
        }

        carrinho.forEach(item => {
            const subtotal = (item.PRECO * item.quantidade).toFixed(2).replace('.', ',');
            const carrinhoItem = document.createElement('div');
            carrinhoItem.className = 'carrinho-item';
            carrinhoItem.innerHTML = `
                <div class="carrinho-item-img-container">
                    <img class="carrinho-item-img" src="${item.IMAGES[0]}" alt="${item.DESCRICAO}">
                </div>
                <div class="carrinho-item-detalhes">
                    <div class="carrinho-item-titulo">${item.DESCRICAO}</div>
                    <div class="carrinho-item-preco">R$ ${subtotal}</div>
                    <div class="carrinho-item-controles">
                        <button class="quantidade-btn" data-action="decrementar" data-sku="${item.SKU}">-</button>
                        <input type="number" class="quantidade-input" value="${item.quantidade}" min="1" max="${LIMITE_POR_PRODUTO}" data-sku="${item.SKU}">
                        <button class="quantidade-btn" data-action="incrementar" data-sku="${item.SKU}">+</button>
                        <span class="remover-item" data-sku="${item.SKU}">Remover</span>
                    </div>
                </div>
            `;
            carrinhoContent.appendChild(carrinhoItem);
        });
    }

    function atualizarContadorEtotal() {
        const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
        const valorTotal = carrinho.reduce((total, item) => total + (item.PRECO * item.quantidade), 0);

        carrinhoCountEl.textContent = totalItens;
        carrinhoCountEl.style.display = totalItens > 0 ? 'flex' : 'none';
        carrinhoTotalEl.textContent = valorTotal.toFixed(2).replace('.', ',');
    }

    // --- FUNÇÕES DE INTERAÇÃO E UI ---

    function mostrarFeedback(texto, tipo = 'success') {
        feedbackEl.textContent = texto;
        feedbackEl.className = 'feedback'; // Reset classes
        feedbackEl.classList.add(tipo, 'show');

        setTimeout(() => {
            feedbackEl.classList.remove('show');
        }, 2500);
    }

    function toggleCarrinho() {
        const isAberto = carrinhoSidebar.classList.contains('open');
        if (isAberto) {
            carrinhoSidebar.classList.remove('open');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        } else {
            carrinhoSidebar.classList.add('open');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    function finalizarPedidoWhatsApp() {
        if (carrinho.length === 0) {
            mostrarFeedback('Seu carrinho está vazio!', 'error');
            return;
        }
        modalOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    // --- LOCAL STORAGE ---

    function salvarCarrinhoNoLocalStorage() {
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
    }

    function carregarCarrinhoDoLocalStorage() {
        const storedCarrinho = localStorage.getItem('carrinho');
        if (storedCarrinho) {
            carrinho = JSON.parse(storedCarrinho);
        }
    }
    
    // --- EVENT LISTENERS ---

    // Pesquisa
    pesquisaInput.addEventListener('input', () => {
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

    // Ações nos produtos
    produtosContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-carrinho')) {
            const sku = e.target.dataset.sku;
            adicionarAoCarrinho(sku);
        }
    });

    // Ações no carrinho
    carrinhoIcon.addEventListener('click', toggleCarrinho);
    fecharCarrinhoBtn.addEventListener('click', toggleCarrinho);
    overlay.addEventListener('click', toggleCarrinho);

    carrinhoContent.addEventListener('click', (e) => {
        const target = e.target;
        const sku = target.dataset.sku;
        if (!sku) return;

        if (target.classList.contains('remover-item')) {
            removerDoCarrinho(sku);
        }
        if (target.classList.contains('quantidade-btn')) {
            const action = target.dataset.action;
            const input = target.parentElement.querySelector('.quantidade-input');
            let novaQuantidade = parseInt(input.value);
            
            if(action === 'incrementar') novaQuantidade++;
            if(action === 'decrementar') novaQuantidade--;

            atualizarQuantidade(sku, novaQuantidade);
        }
    });

    carrinhoContent.addEventListener('change', (e) => {
        if (e.target.classList.contains('quantidade-input')) {
            const sku = e.target.dataset.sku;
            const novaQuantidade = parseInt(e.target.value);
            atualizarQuantidade(sku, novaQuantidade);
        }
    });

    // Finalizar Pedido e Modal
    finalizarPedidoBtn.addEventListener('click', finalizarPedidoWhatsApp);

    btnCancelar.addEventListener('click', () => {
        modalOverlay.style.display = 'none';
        document.body.style.overflow = '';
    });

    formDadosCliente.addEventListener('submit', (e) => {
        e.preventDefault();
        const nomeCliente = document.getElementById('nome-cliente').value.trim();
        const obs = document.getElementById('observacoes').value.trim();

        if (!nomeCliente) {
            mostrarFeedback('Por favor, informe seu nome!', 'error');
            return;
        }

        let mensagem = `*Pedido da Loja Salve Maria Imaculada*\n\n*Cliente:* ${nomeCliente}\n\n`;
        
        carrinho.forEach(item => {
            mensagem += `Nome: ${item.DESCRICAO}\n`;
            mensagem += `Valor unitário: R$ ${item.PRECO.toFixed(2).replace('.', ',')}\n`;
            mensagem += `Quantidade: ${item.quantidade}\n`;
            mensagem += `Subtotal: R$ ${(item.PRECO * item.quantidade).toFixed(2).replace('.', ',')}\n`;
            mensagem += `SKU: ${item.SKU}\n`;
            mensagem += `----------\n\n`;
        });
        
        const total = carrinho.reduce((sum, item) => sum + (item.PRECO * item.quantidade), 0);
        mensagem += `*Total do Pedido:* R$ ${total.toFixed(2).replace('.', ',')}\n\n`;

        if(obs) {
            mensagem += `*Observações:*\n${obs}\n\n`;
        }

        mensagem += `Aguardando confirmação e cálculo do frete.`;

        window.open(`https://wa.me/${TELEFONE_LOJA}?text=${encodeURIComponent(mensagem)}`, '_blank');
        
        // Limpar após envio
        carrinho = [];
        atualizarCarrinho();
        formDadosCliente.reset();
        modalOverlay.style.display = 'none';
        document.body.style.overflow = '';
        if(carrinhoSidebar.classList.contains('open')) {
            toggleCarrinho();
        }
    });

    // Iniciar
    init();
});
