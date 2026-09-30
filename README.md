# Brasa 31 — projeto conceito MODURA

Site demonstrativo de restaurante/steakhouse criado para o portfólio da MODURA.

## Recursos
- Landing page premium e responsiva
- Cardápio digital com filtros
- Carrinho de pedido no navegador
- Envio do pedido por WhatsApp
- Formulário de reserva via WhatsApp
- QR Code dinâmico apontando para o cardápio
- Seções de apresentação, localização e horários
- Pronto para hospedagem estática na Vercel

## Antes de publicar para um cliente real
No arquivo `script.js`, altere:

```js
const WHATSAPP_NUMBER = '5531999999999';
```

No `index.html`, substitua o telefone, Instagram, endereço, horários e textos demonstrativos.

## Rodar localmente
Você pode abrir `index.html` diretamente ou iniciar um servidor local:

```bash
python -m http.server 8080
```

Depois acesse `http://localhost:8080`.

## Publicar na Vercel
O projeto não precisa de build. Importe a pasta/repositório na Vercel e mantenha o Framework Preset como `Other` e o Build Command vazio.
