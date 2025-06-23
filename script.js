// Aguarda o carregamento do HTML antes de executar o script
document.addEventListener('DOMContentLoaded', () => {
    // Configurações
    const TELEFONE_LOJA = "5515981475186"; [cite: 171]

    // Estado da aplicação
    let produtos = []; [cite: 172]
    let carrinho = []; [cite: 172]
    let termoPesquisa = ''; [cite: 173]
    let categoriaAtiva = 'todos'; [cite: 177]

    // Elementos DOM
    const produtosContainer = document.getElementById('produtos-container'); [cite: 177]
    const carrinhoIcon = document.getElementById('carrinho-icon'); [cite: 177]
    const carrinhoSidebar = document.getElementById('carrinho-sidebar'); [cite: 178]
    const carrinhoContent = document.getElementById('carrinho-content'); [cite: 178]
    const overlay = document.getElementById('overlay'); [cite: 178]
    const carrinhoTotal = document.getElementById('carrinho-total'); [cite: 178]
    const carrinhoCount = document.getElementById('carrinho-count'); [cite: 178]
    const fecharCarrinhoBtn = document.getElementById('fechar-carrinho'); [cite: 179]
    const finalizarPedidoBtn = document.getElementById('finalizar-pedido'); [cite: 179]
    const categoriasContainer = document.querySelector('.categorias'); [cite: 179]
    const feedback = document.getElementById('feedback'); [cite: 179]
    const modalOverlay = document.getElementById('modal-overlay'); [cite: 179]
    const formDadosCliente = document.getElementById('dados-cliente'); [cite: 180]
    const btnCancelar = document.getElementById('cancelar-pedido'); [cite: 180]
    const pesquisaInput = document.getElementById('pesquisa-input'); [cite: 180]
    const pesquisaBtn = document.getElementById('pesquisa-btn'); [cite: 180]
    const limparPesquisaBtn = document.getElementById('limpar-pesquisa'); [cite: 180]

    // --- NOVO: Função para carregar produtos do JSON ---
    async function carregarProdutos() {
        try {
            const response = await fetch('produtos.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            produtos = await response.json();
            
            // Tenta carregar o carrinho do localStorage
            const storedCarrinho = localStorage.getItem('carrinho'); [cite: 173]
            if (storedCarrinho) { [cite: 174]
                carrinho = JSON.parse(storedCarrinho); [cite: 174]
            }

            inicializarLoja();
        } catch (e) {
            console.error('Erro ao carregar produtos:', e);
            produtosContainer.innerHTML = '<p style="text-align: center; color: red;">Não foi possível carregar os produtos. Verifique o console para mais detalhes.</p>';
        }
    }

    function inicializarLoja() {
        console.log('Inicializando loja...');
        gerarBotoesCategoria(); [cite: 201]
        renderizarProdutos(); [cite: 201]
        atualizarCarrinho(); [cite: 201]
        carrinhoIcon.style.display = 'flex';
        if (carrinho.length > 0) { [cite: 297]
            carrinhoCount.style.display = 'flex'; [cite: 297]
        }
    }

    // Função para gerar os botões de categoria dinamicamente
    function gerarBotoesCategoria() {
        const todosBtn = document.querySelector('.categoria-btn[data-categoria="todos"]'); [cite: 201]
        categoriasContainer.innerHTML = ''; [cite: 202]
        categoriasContainer.appendChild(todosBtn); [cite: 202]
        
        const categorias = [...new Set(produtos.map(p => p.CATEGORIA))]; [cite: 202]
        categorias.forEach(categoria => { [cite: 203]
            const btn = document.createElement('button'); [cite: 203]
            btn.className = 'categoria-btn'; [cite: 203]
            btn.setAttribute('data-categoria', categoria); [cite: 203]
            btn.textContent = categoria.charAt(0).toUpperCase() + categoria.slice(1).toLowerCase(); [cite: 203]
            categoriasContainer.appendChild(btn); [cite: 203]
        }); [cite: 204]
        
        document.querySelectorAll('.categoria-btn').forEach(btn => { [cite: 204]
            btn.addEventListener('click', () => { [cite: 204]
                document.querySelectorAll('.categoria-btn').forEach(b => b.classList.remove('active')); [cite: 204]
                btn.classList.add('active'); [cite: 204]
                categoriaAtiva = btn.getAttribute('data-categoria'); [cite: 204]
                renderizarProdutos(); [cite: 205]
            });
        });
    }

    // ... (cole todo o restante do seu JavaScript aqui) ...

    // Event Listeners para pesquisa
    pesquisaInput.addEventListener('input', pesquisarProdutos); [cite: 291]
    pesquisaBtn.addEventListener('click', pesquisarProdutos); [cite: 292]
    limparPesquisaBtn.addEventListener('click', () => { [cite: 292]
        pesquisaInput.value = ''; [cite: 292]
        termoPesquisa = ''; [cite: 292]
        limparPesquisaBtn.style.display = 'none'; [cite: 292]
        renderizarProdutos(); [cite: 292]
    });

    // Event Listeners do Carrinho
    carrinhoIcon.addEventListener('click', () => { [cite: 293]
        carrinhoSidebar.classList.add('open'); [cite: 293]
        overlay.classList.add('active'); [cite: 293]
        document.body.style.overflow = 'hidden'; [cite: 293]
        document.body.style.touchAction = 'none'; [cite: 293]
    });

    const fecharCarrinho = () => {
        carrinhoSidebar.classList.remove('open'); [cite: 294, 295]
        overlay.classList.remove('active'); [cite: 294, 295]
        document.body.style.overflow = ''; [cite: 294, 295]
        document.body.style.touchAction = ''; [cite: 294, 295]
    };

    fecharCarrinhoBtn.addEventListener('click', fecharCarrinho); [cite: 294]
    overlay.addEventListener('click', fecharCarrinho); [cite: 295]
    finalizarPedidoBtn.addEventListener('click', finalizarPedidoWhatsApp); [cite: 296]

    // Inicialização
    carregarProdutos();
});