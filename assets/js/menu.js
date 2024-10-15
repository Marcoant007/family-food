let carrinho = {};

async function carregarCardapio() {
    try {
        const response = await fetch('menu.json');
        const data = await response.json();

        const tabMenu = document.getElementById('tab-menu');
        const menuContent = document.getElementById('menu-content');

        data.forEach((categoria, index) => {
            const tabItem = document.createElement('li');
            tabItem.classList.add('nav-item');

            const tabLink = document.createElement('a');
            tabLink.classList.add('nav-link');
            if (index === 0) tabLink.classList.add('active', 'show');
            tabLink.setAttribute('data-bs-toggle', 'tab');
            tabLink.setAttribute('href', `#menu-${categoria.categoria.toLowerCase().replace(/\s/g, '-')}`);
            tabLink.innerHTML = `<h4>${categoria.categoria}</h4>`;

            tabItem.appendChild(tabLink);
            tabMenu.appendChild(tabItem);

            const tabPane = document.createElement('div');
            tabPane.classList.add('tab-pane', 'fade');
            if (index === 0) tabPane.classList.add('active', 'show');
            tabPane.id = `menu-${categoria.categoria.toLowerCase().replace(/\s/g, '-')}`;

            const tabHeader = document.createElement('div');
            tabHeader.classList.add('tab-header', 'text-center');

            const row = document.createElement('div');
            row.classList.add('row', 'gy-6');

            categoria.itens.forEach(item => {
                const col = document.createElement('div');
                col.classList.add('col-lg-3', 'menu-item');

                const img = document.createElement('img');
                img.src = item.foto;
                img.alt = item.nome;
                img.classList.add('menu-img', 'img-fluid');
                img.style.cursor = 'pointer';
                img.onclick = () => adicionarAoCarrinho(item);

                const itemCount = document.createElement('span');
                itemCount.classList.add('item-count');
                itemCount.id = `count-${item.nome.replace(/\s/g, '-')}`;
                itemCount.textContent = "0";

                col.appendChild(img);
                col.appendChild(itemCount);

                const title = document.createElement('h4');
                title.textContent = item.nome;

                const ingredients = document.createElement('p');
                ingredients.classList.add('ingredients');
                ingredients.textContent = item.ingredientes;

                const price = document.createElement('p');
                price.classList.add('price');
                price.textContent = `R$${item.preco.toFixed(2)}`;

                col.appendChild(title);
                col.appendChild(ingredients);
                col.appendChild(price);

                row.appendChild(col);
            });

            tabPane.appendChild(tabHeader);
            tabPane.appendChild(row);
            menuContent.appendChild(tabPane);
        });
    } catch (error) {
        console.error('Erro ao carregar o cardápio:', error);
    }
}

function adicionarAoCarrinho(item) {
    const itemKey = item.nome.replace(/\s/g, '-');
    if (carrinho[itemKey]) {
        carrinho[itemKey].count++;
    } else {
        carrinho[itemKey] = {
            item: item,
            count: 1
        };
    }
    atualizarContadorItem(itemKey);
    console.log(`Item adicionado: ${item.nome}`);
}

function atualizarContadorItem(itemKey) {
    const itemCountElement = document.getElementById(`count-${itemKey}`);
    itemCountElement.textContent = carrinho[itemKey].count;
    itemCountElement.style.display = 'inline';
}

function finalizarPedido() {
    if (Object.keys(carrinho).length === 0) {
        alert("O carrinho está vazio! Adicione itens antes de finalizar o pedido.");
        return;
    }

    let mensagem = "🍲 *Olá, gostaria de fazer um pedido:* 🍲\n\n";
    let total = 0;

    for (const key in carrinho) {
        const item = carrinho[key].item;
        const quantidade = carrinho[key].count;
        const subtotal = item.preco * quantidade;
        total += subtotal;

        mensagem += `- ${item.nome} (x${quantidade}): R$${subtotal.toFixed(2)} ✅\n`;
    }

    mensagem += `\n💵 *Total a pagar:* R$${total.toFixed(2)}\n\n`;
    mensagem += "📞 *Aguardo a confirmação do pedido!* 😊";

    const mensagemEncoded = encodeURIComponent(mensagem);
    const telefone = "5527988740756"; // Número sem o "+" inicial
    const url = `https://wa.me/${telefone}?text=${mensagemEncoded}`;

    window.open(url, "_blank");
}

window.onload = carregarCardapio();