let cart = {};

const F = window.env.STRINGF;
const TELEFONE_WHATSAPP = window.env.TELEFONE_WHATSAPP;
const PIX_CODE = window.env.PIX_CODE;

async function loadMenu() {
    try {
        const response = await fetch('todaymenu.json');
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

                const title = document.createElement('h4');
                title.textContent = item.nome;

                const ingredients = document.createElement('p');
                ingredients.classList.add('ingredients');
                ingredients.textContent = item.ingredientes;

                const itemCount = document.createElement('span');
                itemCount.classList.add('item-count');
                itemCount.id = `count-${item.nome.replace(/\s/g, '-')}`;
                itemCount.textContent = "0";
                itemCount.style.display = 'none';

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
                removeButton.textContent = '-';
                removeButton.onclick = () => removeToCart(item);

                priceContainer.appendChild(removeButton);
                priceContainer.appendChild(price);
                priceContainer.appendChild(addButton);

                col.appendChild(img);
                col.appendChild(itemCount);
                col.appendChild(title);
                col.appendChild(ingredients);
                col.appendChild(priceContainer);
                row.appendChild(col);
            });

            tabPane.appendChild(row);
            menuContent.appendChild(tabPane);
        });
    } catch (error) {
        console.error('Error loading menu:', error);
    }
}

function updateItemCounter(itemKey) {
    const itemCountElement = document.getElementById(`count-${itemKey}`);
    if (itemCountElement) {
        if (cart[itemKey]) {
            itemCountElement.textContent = cart[itemKey].count;
            itemCountElement.style.display = 'inline';
        } else {
            itemCountElement.style.display = 'none';
        }
    } else {
        console.warn(`Elemento para o item ${itemKey} não encontrado.`);
    }
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = Object.values(cart).reduce((sum, item) => sum + item.count, 0);
        cartCount.textContent = totalItems > 0 ? totalItems : '';
        cartCount.style.display = totalItems > 0 ? 'inline' : 'none';
    }
}

function addToCart(item) {
    const itemKey = item.nome.replace(/\s/g, '-');
    if (cart[itemKey]) {
        cart[itemKey].count++;
    } else {
        cart[itemKey] = {
            item,
            count: 1
        };
    }
    updateItemCounter(itemKey);
    updateCartCount();
    console.log(`Item added: ${item.nome}`);
}

function removeToCart(item) {
    const itemKey = item.nome.replace(/\s/g, '-');
    if (cart[itemKey] && cart[itemKey].count > 0) {
        cart[itemKey].count--;
        if (cart[itemKey].count === 0) delete cart[itemKey];
    } else {
        console.warn(`Sem item para remover: ${item.nome}`);
    }
    updateItemCounter(itemKey);
    updateCartCount();
    console.log(`Item removed: ${item.nome}`);
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
        const {
            item,
            count
        } = cart[key];
        const subtotal = item.preco * count;
        total += subtotal;

        cartHtml += `
            <li class="cart-item">
                <span>${item.nome} - R$${item.preco.toFixed(2)} x ${count} = R$${subtotal.toFixed(2)}</span>
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
        preConfirm: checkout
    });
}

function adjustQuantity(itemKey, quantity) {
    if (cart[itemKey]) {
        cart[itemKey].count += quantity;
        if (cart[itemKey].count <= 0) delete cart[itemKey];
    }
    updateItemCounter(itemKey);
    updateCartCount();
    viewCart();
}


async function handlePixPayment(message, total) {
    Swal.fire({
        title: 'Pague com Pix',
        html: `
            <img src="https://familiaalicerce.netlify.app/assets/img/oferta/qrcode-pix.svg" alt="QR Code" style="width:200px; height:200px;"/>
            <p><strong>Total a pagar: R$${total.toFixed(2)}</strong></p>
            <p>Use o QR code acima ou <button id="copy-pix-button" onclick="copyPixCode()">Copiar Código Pix</button></p>
        `,
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Já Paguei, Enviar Comprovante',
        confirmButtonColor: '#28a745',
        preConfirm: () => {
            return Swal.fire({
                title: 'Anexe o comprovante de pagamento',
                input: 'file',
                inputAttributes: {
                    accept: 'image/*'
                },
                confirmButtonText: 'Enviar Pedido',
                confirmButtonColor: '#28a745',
                inputValidator: (file) => {
                    if (!file) {
                        return 'Por favor, anexe o comprovante de pagamento!';
                    }
                }
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const file = result.value;

                    Swal.fire({
                        title: 'Aguarde',
                        text: 'Estamos enviando seu comprovante...',
                        allowOutsideClick: false,
                        didOpen: () => {
                            Swal.showLoading();
                        }
                    });

                    const linkComprovante = await uploadToImage(file);
                    message += `*Forma de pagamento:* Pix\n*Comprovante:* ${linkComprovante}\n`;

                    sendOrder(message);
                }
            });
        }
    });
}

function selectPaymentMethod(message, total) {
    Swal.fire({
        title: 'Escolha a forma de pagamento',
        input: 'radio',
        inputOptions: {
            dinheiro: 'Dinheiro',
            pix: 'Pix',
            cartao: 'Cartão'
        },
        inputValidator: (value) => {
            if (!value) {
                return 'Por favor, selecione uma forma de pagamento!';
            }
        },
        confirmButtonText: 'Continuar',
        confirmButtonColor: '#28a745'
    }).then((result) => {
        if (result.isConfirmed) {
            const paymentMethod = result.value;

            if (paymentMethod === 'dinheiro') {
                message += "*Forma de pagamento:* Dinheiro\n";
                sendOrder(message);
            } else if (paymentMethod === 'pix') {
                handlePixPayment(message, total);
            } else if (paymentMethod === 'cartao') {
                message += "*Forma de pagamento:* Cartão\n";
                sendOrder(message);
            }
        }
    });
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
        confirmButtonText: 'Próximo',
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
            selectPaymentMethod(message, total);
        }
    });
}



async function uploadToImage(file) {
    const formData = new FormData();
    formData.append("image", file);

    try {
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${F}`, {
            method: "POST",
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            return data.data.url;
        } else {
            console.error("Erro ao fazer upload para o ImgBB");
            return "Link não disponível";
        }
    } catch (error) {
        console.error("Erro de rede:", error);
        return "Link não disponível";
    }
}

function sendOrder(message) {
    Swal.fire({
        title: 'Aguarde',
        text: 'Estamos finalizando seu pedido...',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    setTimeout(() => {
        message += "📞 *Aguardo a confirmação do pedido!* 😊";
        const mensagemEncoded = encodeURIComponent(message);
        const url = `https://wa.me/${TELEFONE_WHATSAPP}?text=${mensagemEncoded}`;
        window.open(url, "_blank");

        Swal.close();
    }, 2000);
}


function copyPixCode() {
    navigator.clipboard.writeText(PIX_CODE).then(() => {
        const copyButton = document.getElementById('copy-pix-button');
        copyButton.textContent = 'Código Copiado!';
        copyButton.classList.add('copied');

        setTimeout(() => {
            copyButton.textContent = 'Copiar Código Pix';
            copyButton.classList.remove('copied');
        }, 1500);
    });
}

window.onload = loadMenu;