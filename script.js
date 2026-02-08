function scrollToProducts() {
    document.getElementById('produtos').scrollIntoView({ behavior: 'smooth' });
}

let todosProdutos = [];

// Carregar Produtos
async function carregarProdutos() {
    try {
        const response = await fetch('produtos.json');
        todosProdutos = await response.json();
        
        criarFiltros(todosProdutos);
        renderizarGrid(todosProdutos);
        
    } catch (error) {
        console.error("Erro ao carregar catálogo:", error);
    }
}

// Criar Botões de Categoria
function criarFiltros(produtos) {
    // Pega todas as categorias únicas do JSON
    const categorias = ['Todos', ...new Set(produtos.map(p => p.categoria))];
    const containerFiltros = document.getElementById('filtros-container');
    
    if(containerFiltros) {
        containerFiltros.innerHTML = categorias.map(cat => 
            `<button onclick="filtrar('${cat}')" class="btn-filtro">${cat}</button>`
        ).join('');
    }
}

// Filtrar Produtos
function filtrar(categoria) {
    if (categoria === 'Todos') {
        renderizarGrid(todosProdutos);
    } else {
        const filtrados = todosProdutos.filter(p => p.categoria === categoria);
        renderizarGrid(filtrados);
    }
}

// Desenhar na Tela
function renderizarGrid(lista) {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = lista.map(prod => `
        <div class="product-card">
            <div class="img-container">
                <img src="${prod.imagem}" alt="${prod.nome}" onerror="this.src='https://via.placeholder.com/300?text=Ozonteck'">
            </div>
            <div class="product-info">
                <div class="tag-cat">${prod.categoria}</div>
                <div class="product-title">${prod.nome}</div>
                <p class="product-desc">${prod.descricao}</p>
                <div class="product-price">${prod.preco}</div>
                <button onclick="comprar('${prod.nome}', '${prod.preco}')" class="btn-comprar">
                    Comprar no WhatsApp
                </button>
            </div>
        </div>
    `).join('');
}

// Função de Compra
async function comprar(nome, preco) {
    // 1. Pixel simples
    if(typeof fbq !== 'undefined') fbq('track', 'InitiateCheckout', { content_name: nome, value: 0.00, currency: 'BRL' });

    // 2. Pixel Backend (Se estiver usando Vercel)
    const apiUrl = '/api/pixel'; 
    try {
        fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                eventName: 'InitiateCheckout',
                eventData: { content_name: nome, value: preco },
                userAgent: navigator.userAgent
            })
        });
    } catch (e) { console.log('Backend pixel ignorado (dev mode)'); }

    // 3. WhatsApp
    const numeroWhatsApp = "5511999999999"; // <--- TROQUE PELO SEU NÚMERO
    const mensagem = `Olá, vi o *${nome}* no site e gostaria de saber mais!`;
    window.open(`https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`, '_blank');
}

document.addEventListener('DOMContentLoaded', carregarProdutos);
