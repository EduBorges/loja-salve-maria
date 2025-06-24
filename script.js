// script.js

document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const carrinhoFixo = document.getElementById('carrinho-fixo');
    const carrinhoFlutuante = document.getElementById('carrinho-flutuante');
    const produtosGrid = document.getElementById('produtos-grid');
    const listaCategorias = document.getElementById('lista-categorias');
    const pesquisaInput = document.getElementById('pesquisa-input');
    const pesquisaBtn = document.getElementById('pesquisa-btn');
    const finalizarPedidoBtn = document.getElementById('finalizar-pedido');
    const modalOverlay = document.getElementById('modal-overlay');
    const cancelarPedidoBtn = document.getElementById('cancelar-pedido');
    const formPedido = document.getElementById('form-pedido');
    
    // Variáveis de estado
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    let produtos = [];
    let categorias = new Set();

    // Função para carregar produtos
    async function carregarProdutos() {
        try {
            const response = await fetch('produtos.json');
            produtos = await response.json();
            exibirProdutos(produtos);
            carregarCategorias();
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
        }
    }

    // Função para exibir produtos
    function exibirProdutos(produtosParaExibir) {
        produtosGrid.innerHTML = '';
        produtosParaExibir.forEach(produto => {
            const produtoCard = document.createElement('div');
            produtoCard.className = 'produto-card';
            produtoCard.innerHTML = `
                <img src="${produto.IMAGES[0]}" alt="${produto.DESCRICAO}" class="produto-imagem">
                <div class="produto-info">
                    <h3 class="produto-titulo">${produto.DESCRICAO}</h3>
                    <p class="produto-preco">R$ ${produto.PRECO.toFixed(2).replace('.', ',')}</p>
                    <button class="add-carrinho" data-sku="${produto.SKU}">Adicionar ao Carrinho</button>
                </div>
            `;
            produtosGrid.appendChild(produtoCard);
        });

        // Adiciona eventos aos botões
        document.querySelectorAll('.add-carrinho').forEach(btn => {
            btn.addEventListener('click', function() {
                const sku = this.getAttribute('data-sku');
                adicionarAoCarrinho(sku);
            });
        });
    }

    // Função para carregar categorias
    function carregarCategorias() {
        categorias = new Set(produtos.map(p => p.CATEGORIA));
        listaCategorias.innerHTML = '';

        // Adiciona a opção "TODOS"
        const liTodos = document.createElement('li');
        liTodos.innerHTML = `<button class="active">TODOS</button>`;
        liTodos.addEventListener('click', () => filtrarPorCategoria('TODOS'));
        listaCategorias.appendChild(liTodos);

        // Adiciona as demais categorias
        categorias.forEach(categoria => {
            const li = document.createElement('li');
            li.innerHTML = `<button>${categoria}</button>`;
            li.addEventListener('click', () => filtrarPorCategoria(categoria));
            listaCategorias.appendChild(li);
        });
    }

    // Função para filtrar por categoria
    function filtrarPorCategoria(categoria) {
        // Atualiza a classe active nos botões
        document.querySelectorAll('#lista-categorias button').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');

        if (categoria === 'TODOS') {
            exibirProdutos(produtos);
        } else {
            const produtosFiltrados = produtos.filter(p => p.CATEGORIA === categoria);
            exibirProdutos(produtosFiltrados);
        }
    }

    // Função para adicionar ao carrinho
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
        mostrarFeedback('Produto adicionado ao carrinho!', 'sucesso');
    }

    // Função para atualizar o carrinho
    function atualizarCarrinho() {
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        atualizarContadorCarrinho();
        renderizarItensCarrinho();
    }

    // Função para atualizar o contador do carrinho
    function atualizarContadorCarrinho() {
        const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
        document.getElementById('carrinho-count').textContent = totalItens;
        document.getElementById('carrinho-count-flutuante').textContent = totalItens;
    }

    // Função para renderizar os itens do carrinho
    function renderizarItensCarrinho() {
        const carrinhoContent = document.getElementById('carrinho-content');
        const carrinhoTotal = document.getElementById('carrinho-total');

        if (carrinho.length === 0) {
            carrinhoContent.innerHTML = '<p class="carrinho-vazio">Seu carrinho está vazio</p>';
            carrinhoTotal.textContent = 'R$ 0,00';
            return;
        }

        carrinhoContent.innerHTML = '';
        let total = 0;

        carrinho.forEach(item => {
            total += item.PRECO * item.quantidade;

            const itemDiv = document.createElement('div');
            itemDiv.className = 'carrinho-item';
            itemDiv.innerHTML = `
                <img src="${item.IMAGES[0]}" alt="${item.DESCRICAO}" class="carrinho-item-img">
                <div class="carrinho-item-detalhes">
                    <h4 class="carrinho-item-titulo">${item.DESCRICAO}</h4>
                    <p class="carrinho-item-preco">R$ ${item.PRECO.toFixed(2).replace('.', ',')}</p>
                    <div class="carrinho-item-controles">
                        <button class="quantidade-btn diminuir" data-sku="${item.SKU}">-</button>
                        <span>${item.quantidade}</span>
                        <button class="quantidade-btn aumentar" data-sku="${item.SKU}">+</button>
                        <span class="remover-item" data-sku="${item.SKU}">Remover</span>
                    </div>
                </div>
            `;
            carrinhoContent.appendChild(itemDiv);
        });

        // Adiciona eventos aos botões de quantidade e remover
        document.querySelectorAll('.diminuir').forEach(btn => {
            btn.addEventListener('click', function() {
                const sku = this.getAttribute('data-sku');
                alterarQuantidade(sku, -1);
            });
        });

        document.querySelectorAll('.aumentar').forEach(btn => {
            btn.addEventListener('click', function() {
                const sku = this.getAttribute('data-sku');
                alterarQuantidade(sku, 1);
            });
        });

        document.querySelectorAll('.remover-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const sku = this.getAttribute('data-sku');
                removerDoCarrinho(sku);
            });
        });

        carrinhoTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }

    // Função para alterar quantidade
    function alterarQuantidade(sku, delta) {
        const item = carrinho.find(item => item.SKU === sku);
        if (!item) return;

        item.quantidade += delta;

        if (item.quantidade <= 0) {
            carrinho = carrinho.filter(item => item.SKU !== sku);
        }

        atualizarCarrinho();
    }

    // Função para remover do carrinho
    function removerDoCarrinho(sku) {
        carrinho = carrinho.filter(item => item.SKU !== sku);
        atualizarCarrinho();
        mostrarFeedback('Produto removido do carrinho!', 'erro');
    }

    // Função para mostrar feedback
    function mostrarFeedback(mensagem, tipo) {
        const feedback = document.createElement('div');
        feedback.className = `feedback ${tipo}`;
        feedback.textContent = mensagem;
        document.body.appendChild(feedback);

        setTimeout(() => {
            feedback.remove();
        }, 3000);
    }

    // Função para pesquisar produtos
    function pesquisarProdutos() {
        const termo = pesquisaInput.value.toLowerCase();
        if (!termo) {
            exibirProdutos(produtos);
            return;
        }

        const resultados = produtos.filter(produto => 
            produto.DESCRICAO.toLowerCase().includes(termo) ||
            produto.MATERIAL.toLowerCase().includes(termo) ||
            produto.CATEGORIA.toLowerCase().includes(termo)
        );

        exibirProdutos(resultados);
    }

    // Função para alternar o carrinho (abrir/fechar)
    function toggleCarrinho() {
        if (carrinhoFixo.style.display === 'flex') {
            carrinhoFixo.style.display = 'none';
        } else {
            carrinhoFixo.style.display = 'flex';
        }
    }

    // Event listeners
    carrinhoFlutuante.addEventListener('click', function(e) {
        e.stopPropagation(); // Impede que o evento se propague para o documento
        toggleCarrinho();
    });

    // Remove o event listener do documento que estava fechando o carrinho
    // E adiciona apenas para o carrinho, para fechar quando clicar fora
    carrinhoFixo.addEventListener('click', function(e) {
        e.stopPropagation(); // Impede que o evento se propague para o documento
    });

    // Mantém o carrinho aberto quando clicar em elementos dentro dele
    document.addEventListener('click', function() {
        // Não faz nada - o carrinho só fecha quando clicar no ícone novamente
    });

    pesquisaBtn.addEventListener('click', pesquisarProdutos);
    pesquisaInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') pesquisarProdutos();
    });

    finalizarPedidoBtn.addEventListener('click', function() {
        if (carrinho.length === 0) {
            mostrarFeedback('Seu carrinho está vazio!', 'erro');
            return;
        }
        modalOverlay.style.display = 'flex';
    });

    cancelarPedidoBtn.addEventListener('click', function() {
        modalOverlay.style.display = 'none';
    });

    formPedido.addEventListener('submit', function(e) {
        e.preventDefault();
        const nome = document.getElementById('nome').value;
        const telefone = document.getElementById('telefone').value;
        const observacoes = document.getElementById('observacoes').value;

        if (!nome) {
            mostrarFeedback('Por favor, informe seu nome', 'erro');
            return;
        }

        // Formatar mensagem para WhatsApp
        let mensagem = `*Pedido de ${nome}*\n\n`;
        mensagem += `*Itens:*\n`;
        
        carrinho.forEach(item => {
            mensagem += `- ${item.DESCRICAO} (${item.quantidade}x) - R$ ${(item.PRECO * item.quantidade).toFixed(2)}\n`;
        });

        mensagem += `\n*Total: R$ ${carrinho.reduce((total, item) => total + (item.PRECO * item.quantidade), 0).toFixed(2)}*\n`;
        
        if (observacoes) {
            mensagem += `\n*Observações:*\n${observacoes}\n`;
        }

        // Limpar carrinho após envio
        carrinho = [];
        atualizarCarrinho();
        modalOverlay.style.display = 'none';
        formPedido.reset();

        // Abrir WhatsApp
        const url = `https://wa.me/55${telefone.replace(/\D/g, '')}?text=${encodeURIComponent(mensagem)}`;
        window.open(url, '_blank');

        mostrarFeedback('Pedido enviado com sucesso!', 'sucesso');
    });

    // Inicialização
    carregarProdutos();
    renderizarItensCarrinho();
    atualizarContadorCarrinho();
});
