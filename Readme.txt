# Vamos criar o conteúdo do arquivo README.md baseado nas instruções fornecidas.

conteudo_readme = """
# 🍽️ Cardápio Digital - Igreja Familia Alicerce

Bem-vindo ao **Cardápio Digital da Igreja Familia Alicerce**! Este projeto foi desenvolvido para facilitar o acesso ao nosso cardápio semanal, onde você pode visualizar nossas opções e enviar seu pedido diretamente para o WhatsApp.

> Acesse o Cardápio Online: [https://familiaalicerce.netlify.app/cardapio](https://familiaalicerce.netlify.app/cardapio)

## 🌟 Visão Geral

Nosso cardápio digital é atualizado semanalmente com opções deliciosas e variadas. Desde caldos e salgados até bebidas e sobremesas, sempre há algo para todos os gostos! Simples e fácil de usar, nosso sistema permite que você faça seu pedido diretamente pelo WhatsApp.

## 🚀 Funcionalidades

- **Navegação por Categorias:** Explore as opções de **Caldos**, **Porções**, **Salgados**, **Bebidas** e **Gelados**.
- **Adicione ao Carrinho:** Selecione os itens desejados e veja o total de forma prática.
- **Envio para o WhatsApp:** Com apenas um clique, envie seu pedido finalizado diretamente para o WhatsApp.

## 🛠️ Tecnologias Utilizadas

- **HTML5 & CSS3:** Estrutura e estilos.
- **Bootstrap 5:** Layout responsivo e moderno.
- **JavaScript:** Lógica de interatividade e controle do carrinho.
- **Fetch API:** Carregamento do cardápio diretamente de um arquivo JSON.
- **Google Fonts:** Fontes *Roboto*, *Inter* e *Amatic SC* para um visual agradável.

## 📋 Exemplo de Estrutura do Cardápio

```json
[
    {
        "categoria": "Caldos",
        "itens": [
            {
                "nome": "Caldo Verde",
                "ingredientes": "Batata, couve, linguiça",
                "preco": 10.00,
                "foto": "https://www.saboresajinomoto.com.br/uploads/images/recipes/caldo-verde-1.jpg"
            }
        ]
    },
    {
        "categoria": "Bebidas",
        "itens": [
            {
                "nome": "Suco Natural",
                "ingredientes": "Laranja, Limão, Maracujá",
                "preco": 7.00,
                "foto": "https://www.receiteria.com.br/wp-content/uploads/receitas-de-suco-natural-1.jpg"
            }
        ]
    }
]
