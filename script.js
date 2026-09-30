const WHATSAPP_NUMBER = '5531999999999';

const menu = [
  { id:'ribeye', category:'carnes', tag:'Carnes', name:'Ribeye Angus', desc:'Corte nobre, suculento e com sabor intenso.', price:129, image:'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=85' },
  { id:'picanha', category:'carnes', tag:'Carnes', name:'Picanha na Brasa', desc:'A clássica da casa, selada no ponto ideal.', price:119, image:'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=85' },
  { id:'file', category:'carnes', tag:'Carnes', name:'Filé Mignon', desc:'Maciez marcante com manteiga de ervas.', price:109, image:'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=85' },
  { id:'bruschetta', category:'entradas', tag:'Entradas', name:'Bruschetta da Casa', desc:'Tomate confit, pão artesanal e manjericão.', price:32, image:'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=800&q=85' },
  { id:'croqueta', category:'entradas', tag:'Entradas', name:'Croqueta de Costela', desc:'Crocante por fora, cremosa e intensa por dentro.', price:39, image:'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=85' },
  { id:'batata', category:'acompanhamentos', tag:'Acompanhamentos', name:'Batata Rústica', desc:'Páprica defumada, ervas e aioli da casa.', price:29, image:'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=85' },
  { id:'legumes', category:'acompanhamentos', tag:'Acompanhamentos', name:'Legumes na Brasa', desc:'Seleção de legumes tostados no fogo.', price:34, image:'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=85' },
  { id:'oldfashioned', category:'bebidas', tag:'Bebidas', name:'Old Fashioned', desc:'Bourbon, bitters e laranja.', price:36, image:'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=85' },
  { id:'limonada', category:'bebidas', tag:'Bebidas', name:'Limonada Brasa', desc:'Limão siciliano, gengibre e alecrim.', price:18, image:'https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=800&q=85' },
  { id:'gateau', category:'sobremesas', tag:'Sobremesas', name:'Petit Gâteau', desc:'Chocolate intenso, sorvete de baunilha.', price:32, image:'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=85' },
  { id:'pudim', category:'sobremesas', tag:'Sobremesas', name:'Pudim de Baunilha', desc:'Textura cremosa e caramelo de flor de sal.', price:26, image:'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=85' },
  { id:'brownie', category:'sobremesas', tag:'Sobremesas', name:'Brownie da Brasa', desc:'Chocolate, castanhas e sorvete artesanal.', price:29, image:'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=85' }
];

const cart = new Map();
const money = value => new Intl.NumberFormat('pt-BR', { style:'currency', currency:'BRL' }).format(value);
const grid = document.getElementById('menuGrid');
const drawer = document.getElementById('cartDrawer');
const backdrop = document.getElementById('drawerBackdrop');

function renderMenu(filter='todos') {
  const visible = filter === 'todos' ? menu : menu.filter(item => item.category === filter);
  grid.innerHTML = visible.map(item => `
    <article class="menu-item" data-category="${item.category}">
      <img class="menu-photo" src="${item.image}" alt="${item.name}" loading="lazy">
      <div class="menu-info">
        <span class="menu-tag">${item.tag}</span>
        <h3>${item.name}</h3>
        <p>${item.desc}</p>
        <div class="menu-bottom">
          <span class="menu-price">${money(item.price)}</span>
          <button class="add-item" type="button" data-id="${item.id}" aria-label="Adicionar ${item.name}">+</button>
        </div>
      </div>
    </article>
  `).join('');
  document.querySelectorAll('.add-item').forEach(btn => btn.addEventListener('click', () => addToCart(btn.dataset.id)));
}

function addToCart(id) {
  const current = cart.get(id) || 0;
  cart.set(id, current + 1);
  renderCart();
  showToast();
}

function changeQty(id, delta) {
  const current = cart.get(id) || 0;
  const next = current + delta;
  if (next <= 0) cart.delete(id); else cart.set(id, next);
  renderCart();
}

function cartTotals() {
  let qty = 0;
  let total = 0;
  for (const [id, amount] of cart.entries()) {
    const item = menu.find(x => x.id === id);
    if (!item) continue;
    qty += amount;
    total += item.price * amount;
  }
  return { qty, total };
}

function renderCart() {
  const { qty, total } = cartTotals();
  document.getElementById('cartCount').textContent = qty;
  document.getElementById('cartSummaryCount').textContent = `${qty} ${qty === 1 ? 'item' : 'itens'}`;
  document.getElementById('cartSummaryTotal').textContent = money(total);
  document.getElementById('drawerCount').textContent = `${qty} ${qty === 1 ? 'item' : 'itens'}`;
  document.getElementById('drawerTotal').textContent = money(total);

  const lines = document.getElementById('cartLines');
  if (!qty) {
    lines.innerHTML = '<p class="empty-cart">Seu pedido está vazio.<br>Escolha algo no cardápio.</p>';
    return;
  }

  lines.innerHTML = [...cart.entries()].map(([id, amount]) => {
    const item = menu.find(x => x.id === id);
    return `
      <div class="cart-line">
        <div>
          <strong>${item.name}</strong>
          <small>${money(item.price * amount)}</small>
          <button class="remove-line" data-remove="${id}" type="button">remover</button>
        </div>
        <div class="qty-control">
          <button type="button" data-delta="-1" data-id="${id}" aria-label="Diminuir quantidade">−</button>
          <span>${amount}</span>
          <button type="button" data-delta="1" data-id="${id}" aria-label="Aumentar quantidade">+</button>
        </div>
      </div>`;
  }).join('');

  lines.querySelectorAll('[data-delta]').forEach(btn => btn.addEventListener('click', () => changeQty(btn.dataset.id, Number(btn.dataset.delta))));
  lines.querySelectorAll('[data-remove]').forEach(btn => btn.addEventListener('click', () => { cart.delete(btn.dataset.remove); renderCart(); }));
}

function openCart() {
  drawer.classList.add('open');
  backdrop.classList.add('show');
  drawer.setAttribute('aria-hidden','false');
  document.body.classList.add('no-scroll');
}
function closeCart() {
  drawer.classList.remove('open');
  backdrop.classList.remove('show');
  drawer.setAttribute('aria-hidden','true');
  document.body.classList.remove('no-scroll');
}

function showToast() {
  const toast = document.getElementById('toast');
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 1500);
}

function sendOrder() {
  const { qty, total } = cartTotals();
  if (!qty) {
    alert('Adicione pelo menos um item ao pedido.');
    return;
  }
  const rows = [...cart.entries()].map(([id, amount]) => {
    const item = menu.find(x => x.id === id);
    return `• ${amount}x ${item.name} — ${money(item.price * amount)}`;
  });
  const note = document.getElementById('orderNote').value.trim();
  const message = [
    'Olá, Brasa 31! Gostaria de fazer este pedido:',
    '',
    ...rows,
    '',
    `Total: ${money(total)}`,
    note ? `Observação: ${note}` : '',
    '',
    'Aguardo a confirmação. Obrigado!'
  ].filter(Boolean).join('\n');
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
}

function setupQr() {
  const target = `${location.origin}${location.pathname}#cardapio`;
  const qr = document.getElementById('qrImage');
  qr.src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=0&data=${encodeURIComponent(target)}`;
}

function setupReservation() {
  const date = document.getElementById('resDate');
  const today = new Date();
  const localISO = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split('T')[0];
  date.min = localISO;

  document.getElementById('reservationForm').addEventListener('submit', event => {
    event.preventDefault();
    const name = document.getElementById('resName').value.trim();
    const d = document.getElementById('resDate').value;
    const time = document.getElementById('resTime').value;
    const guests = document.getElementById('resGuests').value;
    const formattedDate = d ? d.split('-').reverse().join('/') : d;
    const message = `Olá, Brasa 31! Gostaria de solicitar uma reserva.\n\nNome: ${name}\nData: ${formattedDate}\nHorário: ${time}\nPessoas: ${guests}\n\nPodem confirmar a disponibilidade?`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
  });
}

function setupNavigation() {
  const header = document.querySelector('.site-header');
  const toggle = document.getElementById('menuToggle');
  const mobile = document.getElementById('mobileMenu');
  window.addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 30), { passive:true });

  toggle.addEventListener('click', () => {
    const open = mobile.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    mobile.setAttribute('aria-hidden', String(!open));
  });
  mobile.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mobile.classList.remove('open');
    toggle.setAttribute('aria-expanded','false');
    mobile.setAttribute('aria-hidden','true');
  }));
}

document.querySelectorAll('.filter').forEach(btn => btn.addEventListener('click', () => {
  document.querySelectorAll('.filter').forEach(x => x.classList.remove('active'));
  btn.classList.add('active');
  renderMenu(btn.dataset.filter);
}));

document.getElementById('cartToggle').addEventListener('click', openCart);
document.getElementById('cartSummary').addEventListener('click', openCart);
document.getElementById('closeCart').addEventListener('click', closeCart);
backdrop.addEventListener('click', closeCart);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCart(); });
document.getElementById('sendOrder').addEventListener('click', sendOrder);

renderMenu();
renderCart();
setupQr();
setupReservation();
setupNavigation();
