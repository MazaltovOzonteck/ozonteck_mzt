// Função para rolar até produtos
function scrollToProducts() {
    document.getElementById('produtos').scrollIntoView({ behavior: 'smooth' });
}

// Carregar Produtos do JSON
async function carregarProdutos() {
    try {
        const response = await fetch('produtos.json');
        const produtos = await response.json();
        const grid = document.getElementById('product-grid');

        produtos.forEach(prod => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <img src="${prod.imagem}" alt="${prod.nome}" class="product-img">
                <div class="product-info">
                    <div class="product-title">${prod.nome}</div>
                    <p class="product-desc">${prod.descricao}</p>
                    <div class="product-price">${prod.preco}</div>
                    <button onclick="comprar('${prod.nome}', '${prod.preco}')" class="btn-comprar">Comprar no WhatsApp</button>
                </div>
            `;
            grid.appendChild(card);
        });
    } catch (error) {
        console.error("Erro ao carregar catálogo:", error);
    }
}

// Função de Compra e Rastreamento (Frontend + Backend)
async function comprar(nome, preco) {
    // 1. Rastreamento Frontend (Padrão)
    if(typeof fbq !== 'undefined') {
        fbq('track', 'InitiateCheckout', { content_name: nome, value: parseFloat(preco.replace('R$','').replace(',','.')), currency: 'BRL' });
    }

    // 2. Rastreamento Backend (Vercel API - Mais robusto)
    // O link abaixo deve ser o da sua Vercel após o deploy
    const apiUrl = '/api/pixel'; 
    
    try {
        fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                eventName: 'InitiateCheckout',
                eventData: { content_name: nome, value: preco },
                userAgent: navigator.userAgent,
                ip: 'auto' // A Vercel/Facebook resolvem isso
            })
        });
    } catch (e) { console.log('Erro pixel backend', e); }

    // 3. Redirecionar para WhatsApp
    const mensagem = `Olá, tenho interesse no produto: ${nome}`;
    window.open(`https://wa.me/SEU_NUMERO?text=${encodeURIComponent(mensagem)}`, '_blank');
}

// Iniciar
document.addEventListener('DOMContentLoaded', carregarProdutos);
