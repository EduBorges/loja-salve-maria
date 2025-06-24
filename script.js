formPedido.addEventListener('submit', function(e) {
    e.preventDefault();
    const nome = document.getElementById('nome').value;
    const telefone = document.getElementById('telefone').value;
    const observacoes = document.getElementById('observacoes').value;

    if (!nome) {
        mostrarFeedback('Por favor, informe seu nome', 'erro');
        return;
    }

    // Formatar mensagem para WhatsApp seguindo o padrão solicitado
    let mensagem = `*Pedido da Loja Salve Maria Imaculada*\n\n`;
    mensagem += `*Cliente:* ${nome}\n`;
    mensagem += `*WhatsApp:* ${telefone || 'Não informado'}\n\n`;
    
    mensagem += `*Itens do Pedido:*\n`;
    
    // Adiciona cada item com a formatação especificada
    carrinho.forEach((item, index) => {
        const subtotal = item.PRECO * item.quantidade;
        mensagem += `*${index + 1}. ${item.DESCRICAO}* - SKU: ${item.SKU} - Quantidade: ${item.quantidade} - `;
        mensagem += `Preço unitário: R$ ${item.PRECO.toFixed(2).replace('.', ',')} - `;
        mensagem += `Subtotal: R$ ${subtotal.toFixed(2).replace('.', ',')}\n\n`;
    });

    // Calcula o total
    const total = carrinho.reduce((sum, item) => sum + (item.PRECO * item.quantidade), 0);
    mensagem += `*Total do Pedido:* R$ ${total.toFixed(2).replace('.', ',')}\n\n`;
    
    // Adiciona observações se existirem
    if (observacoes) {
        mensagem += `*Observações:* ${observacoes}\n`;
    }

    // Limpar carrinho após envio
    carrinho = [];
    atualizarCarrinho();
    modalOverlay.style.display = 'none';
    formPedido.reset();

    // Abrir WhatsApp com número fixo e mensagem formatada
    const url = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');

    mostrarFeedback('Pedido enviado com sucesso!', 'sucesso');
});
