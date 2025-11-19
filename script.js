// Configurações
const TELEFONE_LOJA = "5515997769053";

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
    fetch('produtos.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar produtos');
            }
            return response.json();
        })
        .then(data => {
            produtos = data;
            gerarBotoesCategoria();
            renderizarProdutos();
            atualizarCarrinho();
        })
        .catch(error => {
            console.error('Erro:', error);
            mostrarFeedback('Erro ao carregar produtos', 'error');
            produtosContainer.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                    <p>Erro ao carregar os produtos. Por favor, recarregue a página.</p>
                </div>
            `;
        });
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
                <input type="number" class="quantidade-input" value="${item.quantidade || 1}" min="1" max="2" data-sku="${item.SKU || ''}">
                <button class="quantidade-btn" data-sku="${item.SKU || ''}" data-action="incrementar">+</button>
                <span class="remover-item" data-sku="${item.SKU || ''}">Remover</span>
            </div>
        `;
        
        carrinhoItem.appendChild(detalhes);
        carrinhoContent.appendChild(carrinhoItem);
    });
    
    // Atualiza total
    carrinhoTotal.textContent = total.toFixed(2).replace('.', ',');
    
    // Adiciona event listeners aos controles de quantidade
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
    
    // Validação dos campos obrigatórios
    if (!nomeCliente || !telefoneCliente) {
        if (!nomeCliente) {
            document.getElementById('nome-cliente').style.borderColor = 'var(--cor-erro)';
        }
        if (!telefoneCliente) {
            document.getElementById('telefone-cliente').style.borderColor = 'var(--cor-erro)';
        }
        mostrarFeedback('Falta informação! Preencha os campos obrigatórios.', 'error');
        return;
    }
    
    let mensagem = `*Pedido da Loja Salve Maria Imaculada*\n\n`;
    mensagem += `*Cliente:* ${nomeCliente}\n`;
    mensagem += `*WhatsApp:* ${telefoneCliente}\n`;
    
    mensagem += `\n*Itens do Pedido:*\n\n`;
    
    carrinho.forEach((item, index) => {
        mensagem += `*${index + 1}. ${item.DESCRICAO}*\n`;
        mensagem += `   - Valor unitário: R$ ${item.PRECO.toFixed(2).replace('.', ',')}\n`;
        mensagem += `   - Quantidade: ${item.quantidade}\n`;
        mensagem += `   - Subtotal: R$ ${(item.PRECO * item.quantidade).toFixed(2).replace('.', ',')}\n`;
        mensagem += `   - SKU: ${item.SKU}\n`;
        mensagem += `----------\n\n`;
    });
    
    const total = carrinho.reduce((sum, item) => sum + (item.PRECO * item.quantidade), 0);
    mensagem += `*Total do Pedido:* R$ ${total.toFixed(2).replace('.', ',')}\n\n`;
    
    if (observacoes) {
        mensagem += `*Observações:*\n${observacoes}\n\n`;
    }
    
    mensagem += `Confirmar os itens se estão disponíveis em estoque e valores para entrega`;
    
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

// Mostrar feedback
function mostrarFeedback(texto, tipo = 'success') {
    feedback.textContent = texto;
    feedback.className = 'feedback';
    feedback.classList.add(tipo === 'error' ? 'error' : 'show');
    
    // Aumentar o tempo de exibição para 3 segundos (3000ms)
    setTimeout(() => {
        feedback.classList.remove('show');
    }, 3000);
}

// Localize a função adicionarAoCarrinho e atualize a verificação de limite:
function adicionarAoCarrinho(sku) {
    const produto = produtos.find(p => p.SKU === sku);
    if (!produto) return;

    const itemExistente = carrinho.find(item => item.SKU === sku);
    
    // Verifica se já atingiu o limite de 2 unidades
    if (itemExistente && itemExistente.quantidade >= 2) {
        mostrarFeedback('Limite máximo atingido (2 unidades por produto)', 'error');
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
    mostrarFeedback('Item adicionado ao carrinho!');
    
    // Abre o carrinho se estiver fechado
    if (!carrinhoAberto) {
        toggleCarrinho();
    }
}

// Atualize o event listener para fechar o carrinho apenas quando clicar fora
document.addEventListener('click', (e) => {
    if (carrinhoAberto && 
        !e.target.closest('.carrinho-sidebar') && 
        !e.target.closest('.carrinho-icon')) {
        toggleCarrinho();
    }
});

// Alternar carrinho (abrir/fechar)
function toggleCarrinho() {
    carrinhoAberto = !carrinhoAberto;
    if (carrinhoAberto) {
        carrinhoSidebar.classList.add('open');
    } else {
        carrinhoSidebar.classList.remove('open');
    }
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

// Event Listeners para o carrinho
carrinhoIcon.addEventListener('click', toggleCarrinho);

// Fechar carrinho ao clicar fora
document.addEventListener('click', (e) => {
    if (carrinhoAberto && 
        !e.target.closest('.carrinho-sidebar') && 
        !e.target.closest('.carrinho-icon')) {
        toggleCarrinho();
    }
});

finalizarPedidoBtn.addEventListener('click', finalizarPedidoWhatsApp);

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Tenta carregar o carrinho do localStorage
    try {
        const storedCarrinho = localStorage.getItem('carrinho');
        if (storedCarrinho) {
            carrinho = JSON.parse(storedCarrinho);
        }
    } catch (e) {
        console.error('Erro ao carregar carrinho do localStorage:', e);
        localStorage.removeItem('carrinho');
    }

    carregarProdutos();
    
    // Resetar bordas dos campos ao digitar
    document.getElementById('nome-cliente').addEventListener('input', function() {
        this.style.borderColor = '';
    });
    
    document.getElementById('telefone-cliente').addEventListener('input', function() {
        this.style.borderColor = '';
    });
});
