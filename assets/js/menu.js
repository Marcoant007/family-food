let cart = {};

async function loadMenu() {
    try {
        const response = await fetch('menu.json');
        const data = await response.json();

        const tabMenu = document.getElementById('tab-menu');
        const menuContent = document.getElementById('menu-content');

        data.forEach((category, index) => {
            const tabItem = document.createElement('li');
            tabItem.classList.add('nav-item');

            const tabLink = document.createElement('a');
            tabLink.classList.add('nav-link');
            if (index === 0) tabLink.classList.add('active', 'show');
            tabLink.setAttribute('data-bs-toggle', 'tab');
            tabLink.setAttribute('href', `#menu-${category.categoria.toLowerCase().replace(/\s/g, '-')}`);
            tabLink.innerHTML = `<h4>${category.categoria}</h4>`;

            tabItem.appendChild(tabLink);
            tabMenu.appendChild(tabItem);

            const tabPane = document.createElement('div');
            tabPane.classList.add('tab-pane', 'fade');
            if (index === 0) tabPane.classList.add('active', 'show');
            tabPane.id = `menu-${category.categoria.toLowerCase().replace(/\s/g, '-')}`;

            const tabHeader = document.createElement('div');
            tabHeader.classList.add('tab-header', 'text-center');

            const row = document.createElement('div');
            row.classList.add('row', 'gy-6');

            category.itens.forEach(item => {
                const col = document.createElement('div');
                col.classList.add('col-lg-3', 'col-md-4', 'menu-item');
            
                const img = document.createElement('img');
                img.src = item.foto;
                img.alt = item.nome;
                img.classList.add('menu-img', 'img-fluid');
                img.style.cursor = 'pointer';
                img.onclick = () => addToCart(item);
            
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
            
                const priceContainer = document.createElement('div');
                priceContainer.classList.add('price-container');
                
                const price = document.createElement('span');
                price.classList.add('price');
                price.textContent = `R$${item.preco.toFixed(2)}`;
                
                const addButton = document.createElement('button');
                addButton.classList.add('btn', 'btn-add', 'btn-sm');
                addButton.textContent = '+';
                addButton.onclick = () => addToCart(item);

                const removeButton = document.createElement('button');
                removeButton.classList.add('btn', 'btn-subtract', 'btn-sm');
                removeButton.textContent = "-";
                removeButton.onclick= () => removeToCart(item);
            
                priceContainer.appendChild(removeButton);
                priceContainer.appendChild(price);
                priceContainer.appendChild(addButton);
            
                col.appendChild(title);
                col.appendChild(ingredients);
                col.appendChild(priceContainer);
            
                row.appendChild(col);
            });

            tabPane.appendChild(tabHeader);
            tabPane.appendChild(row);
            menuContent.appendChild(tabPane);
        });
    } catch (error) {
        console.error('Error loading menu:', error);
    }
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = Object.keys(cart).reduce((sum, key) => sum + cart[key].count, 0);
        if (totalItems > 0) {
            cartCount.textContent = totalItems;
            cartCount.style.display = 'inline';
        } else {
            cartCount.style.display = 'none';
        }
    }
}

function addToCart(item) {
    const itemKey = item.nome.replace(/\s/g, '-');
    if (cart[itemKey]) {
        cart[itemKey].count++;
    } else {
        cart[itemKey] = {
            item: item,
            count: 1
        };
    }
    updateItemCounter(itemKey);
    updateCartCount();
    console.log(`Item added: ${item.nome}`);
}

function removeToCart(item) {
    const itemKey = item.nome.replace(/\s/g, '-');
    if (cart[itemKey] && cart[itemKey].count > 0){
        cart[itemKey].count--;
    } else {
        console.log(`Sem item para remover`)
    }

    updateItemCounter(itemKey);
    updateCartCount();
    console.log(`Item removed: ${item.nome}`);
}

function updateItemCounter(itemKey) {
    const itemCountElement = document.getElementById(`count-${itemKey}`);
    if (cart[itemKey]) {
        itemCountElement.textContent = cart[itemKey].count;
        itemCountElement.style.display = 'inline';
    } else {
        itemCountElement.style.display = 'none';
    }
}

function viewCart() {
    if (Object.keys(cart).length === 0) {
        Swal.fire({
            title: "Oops..",
            text: "O carrinho está vazio.",
            icon: "error",
            confirmButtonText: 'Ok',
            confirmButtonColor: '#28a745',
        });
        return;
    }

    let total = 0;
    let cartHtml = "<ul style='list-style: none; padding: 0;'>";
    for (const key in cart) {
        const item = cart[key].item;
        const quantity = cart[key].count;
        const subtotal = item.preco * quantity;
        total += subtotal;

        const abbreviatedName = abbreviateName(item.nome);

        cartHtml += `
            <li class="cart-item">
                <span>${abbreviatedName} - R$${item.preco.toFixed(2)} x ${quantity} = R$${subtotal.toFixed(2)}</span>
                <div class="button-container">
                    <button onclick="adjustQuantity('${key}', 1)">+</button>
                    <button onclick="adjustQuantity('${key}', -1)">-</button>
                </div>
            </li>
        `;
    }
    cartHtml += `</ul><p><strong>Total: R$${total.toFixed(2)}</strong></p>`;

    Swal.fire({
        title: 'Resumo do Pedido',
        html: cartHtml,
        showCancelButton: true,
        cancelButtonText: 'Continue Comprando',
        confirmButtonText: 'Finalizar Pedido',
        confirmButtonColor: '#28a745',
        preConfirm: () => {
            checkout();
        }
    });
}

function adjustQuantity(itemKey, quantity) {
    if (cart[itemKey]) {
        cart[itemKey].count += quantity;

        if (cart[itemKey].count <= 0) {
            delete cart[itemKey];
        } 
    }
    updateCartCount();
    viewCart();
}

function checkout() {
    let total = 0;
    let message = "🍽️ *Olá, gostaria de fazer um pedido:* 🍽️\n\n";
    for (const key in cart) {
        const item = cart[key].item;
        const quantity = cart[key].count;
        const subtotal = item.preco * quantity;
        total += subtotal;
        message += `- ${item.nome} (x${quantity}): R$${subtotal.toFixed(2)} ✅\n`;
    }
    message += `\n💰 *Total a pagar:* R$${total.toFixed(2)}\n\n`;

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
            message += `*Nome do cliente:* ${nome}\n\n`;
            message += "📞 *Aguardo a confirmação do pedido!* 😊";

            const mensagemEncoded = encodeURIComponent(message);
            const telefone = "+5527988740756";
            const url = `https://wa.me/${telefone}?text=${mensagemEncoded}`;

            window.open(url, "_blank");
        }
    });
}

function abbreviateName(name, maxLen = 20) {
    return name.length > maxLen ? name.substring(0, maxLen - 3) + "..." : name;
}

window.onload = loadMenu();
