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

function visualizarCarrinho() {
    if (Object.keys(carrinho).length === 0) {
        Swal.fire({
            title: "Opss..",
            text: "O carrinho está vazio! Adicione itens antes de finalizar o pedido.",
            icon: "error",
            confirmButtonText: 'Ok',
            confirmButtonColor: '#28a745',
        });
        return;
    }

    let total = 0;
    let pedidoHtml = "<ul style='list-style: none; padding: 0;'>";
    for (const key in carrinho) {
        const item = carrinho[key].item;
        const quantidade = carrinho[key].count;
        const subtotal = item.preco * quantidade;
        total += subtotal;

        const nomeAbreviado = abreviarNome(item.nome);
        
        pedidoHtml += `
            <li style="margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between;">
                <span>${nomeAbreviado} - R$${item.preco.toFixed(2)} x ${quantidade} = R$${subtotal.toFixed(2)}</span>
                <div>
                    <button onclick="ajustarQuantidade('${key}', 1)" style="margin-left: 10px; background-color: #28a745; color: white; border: none; border-radius: 50%; width: 30px; height: 30px; font-weight: bold; cursor: pointer;">+</button>
                    <button onclick="ajustarQuantidade('${key}', -1)" style="margin-left: 5px; background-color: #dc3545; color: white; border: none; border-radius: 50%; width: 30px; height: 30px; font-weight: bold; cursor: pointer;">-</button>
                </div>
            </li>
        `;
    }
    pedidoHtml += `</ul><p><strong>Total: R$${total.toFixed(2)}</strong></p>`;

    Swal.fire({
        title: 'Resumo do Pedido',
        html: pedidoHtml,
        showCancelButton: true,
        cancelButtonText: 'Continuar Escolhendo',
        confirmButtonText: 'Finalizar Pedido',
        confirmButtonColor: '#28a745',
        preConfirm: () => {
            finalizarPedido();
        }
    });
}

function ajustarQuantidade(itemKey, quantidade) {
    if (carrinho[itemKey]) {
        carrinho[itemKey].count += quantidade;

        if (carrinho[itemKey].count <= 0) {
            delete carrinho[itemKey];
            document.getElementById(`count-${itemKey}`).style.display = 'none';
        } else {
            atualizarContadorItem(itemKey);
        }
    }

    visualizarCarrinho();
}

function atualizarContadorItem(itemKey) {
    const itemCountElement = document.getElementById(`count-${itemKey}`);
    if (carrinho[itemKey]) {
        itemCountElement.textContent = carrinho[itemKey].count;
        itemCountElement.style.display = 'inline';
    } else {
        itemCountElement.style.display = 'none';
    }
}

function finalizarPedido() {
    let total = 0;
    let mensagem = "🍽️ *Olá, gostaria de fazer um pedido:* 🍽️\n\n";
    for (const key in carrinho) {
        const item = carrinho[key].item;
        const quantidade = carrinho[key].count;
        const subtotal = item.preco * quantidade;
        total += subtotal;
        mensagem += `- ${item.nome} (x${quantidade}): R$${subtotal.toFixed(2)} ✅\n`;
    }
    mensagem += `\n💰 *Total a pagar:* R$${total.toFixed(2)}\n\n`;

    Swal.fire({
        title: 'Digite seu nome',
        input: 'text',
        inputPlaceholder: 'Nome completo',
        showCancelButton: true,
        confirmButtonText: 'Enviar Pedido',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#28a745',
        inputValidator: (value) => {
            if (!value) {
                return 'Por favor, insira seu nome!';
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const nome = result.value;
            mensagem += `*Nome do cliente:* ${nome}\n\n`;
            mensagem += "📞 *Aguardo a confirmação do pedido!* 😊";

            const mensagemEncoded = encodeURIComponent(mensagem);
            const telefone = "+5527988740756";
            const url = `https://wa.me/${telefone}?text=${mensagemEncoded}`;

            window.open(url, "_blank");
        }
    });
}

function abreviarNome(nome, maxLen = 20) {
    return nome.length > maxLen ? nome.substring(0, maxLen - 3) + "..." : nome;
}

window.onload = carregarCardapio();