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
    const categorias = ['Todos', ...new Set(produtos.map(p => p.categoria))];
    const containerFiltros = document.getElementById('filtros-container');
    if(containerFiltros) {
        containerFiltros.innerHTML = categorias.map(cat => 
            `<button onclick="filtrar('${cat}')" class="btn-filtro">${cat}</button>`
        ).join('');
    }
}

// Filtrar
function filtrar(categoria) {
    if (categoria === 'Todos') {
        renderizarGrid(todosProdutos);
    } else {
        const filtrados = todosProdutos.filter(p => p.categoria === categoria);
        renderizarGrid(filtrados);
    }
}

// --- LÓGICA DO CARROSSEL ---
function renderizarGrid(lista) {
    const grid = document.getElementById('product-grid');
    
    grid.innerHTML = lista.map((prod, index) => {
        // Verifica se é array ou string antiga para evitar erros
        let imagens = Array.isArray(prod.imagens) ? prod.imagens : [prod.imagem];
        
        // Cria o HTML das imagens (apenas a primeira ganha a classe 'active')
        let imgsHtml = imagens.map((img, i) => 
            `<img src="${img}" class="${i === 0 ? 'active' : ''}" onerror="this.src='https://via.placeholder.com/300?text=Ozonteck'">`
        ).join('');

        // Só mostra setas se tiver mais de 1 imagem
        let botoesHtml = imagens.length > 1 ? `
            <button class="carousel-btn prev" onclick="mudarSlide(this, -1)">&#10094;</button>
            <button class="carousel-btn next" onclick="mudarSlide(this, 1)">&#10095;</button>
        ` : '';

        return `
        <div class="product-card">
            <div class="img-container carousel">
                ${imgsHtml}
                ${botoesHtml}
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
        `;
    }).join('');
}

// Função que gira o carrossel
function mudarSlide(botao, direcao) {
    const container = botao.parentElement; // Pega o container da foto
    const slides = container.querySelectorAll('img'); // Pega todas as fotos desse produto
    let ativoIndex = 0;

    // Descobre qual foto está visível agora
    slides.forEach((img, index) => {
        if (img.classList.contains('active')) {
            ativoIndex = index;
            img.classList.remove('active'); // Esconde a atual
        }
    });

    // Calcula a próxima foto (loop infinito)
    let proximoIndex = ativoIndex + direcao;
    if (proximoIndex >= slides.length) proximoIndex = 0;
    if (proximoIndex < 0) proximoIndex = slides.length - 1;

    // Mostra a nova foto
    slides[proximoIndex].classList.add('active');
}

// Função de Compra (Mantida)
async function comprar(nome, preco) {
    if(typeof fbq !== 'undefined') fbq('track', 'InitiateCheckout', { content_name: nome, value: 0.00, currency: 'BRL' });
    const numeroWhatsApp = "5511999999999"; 
    const mensagem = `Olá, vi o *${nome}* no site e gostaria de saber mais!`;
    window.open(`https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`, '_blank');
}

document.addEventListener('DOMContentLoaded', carregarProdutos);
