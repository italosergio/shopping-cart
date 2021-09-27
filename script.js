function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const priceSum = () => {
  let sum = 0;
  document.querySelectorAll('li').forEach((element) => {
    sum += parseFloat(element.innerText.split('$').pop());
  });
  
  return parseFloat(sum.toFixed(2));
};

const innerSumChange = () => {
  document.querySelector('.total-price').innerText = priceSum();
};

function cartItemClickListener(event) {
  event.target.remove();
  localStorage.setItem('saveCart', document.querySelector('ol').innerHTML);
  innerSumChange();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addToCart = async (id) => {
  const sectionItemsAdd = document.querySelector('.cart__items');
  try {
    const results = await fetch(`https://api.mercadolibre.com/items/${id}`);
    const jsonResult = await results.json();
    const { id: sku, title: name, price: salePrice } = await jsonResult;
    const cartItem = await createCartItemElement({ sku, name, salePrice });
    sectionItemsAdd.appendChild(cartItem);
    localStorage.setItem('saveCart', document.querySelector('ol').innerHTML);
    innerSumChange();
  } catch (error) {
    console.log(error);
  }
};

const removeLoading = () => {
  document.querySelector('.load').remove();
};

const listItems = async (product) => {
  const sectionItems = document.querySelector('.items');
  try {
    await product.results.forEach((element) => {
      const { id, title, thumbnail } = element;
      const createItem = createProductItemElement({ sku: id, name: title, image: thumbnail });
      sectionItems.appendChild(createItem);
      createItem.lastChild.addEventListener('click', (e) => {
        const event = e.target.parentNode;
        const ids = getSkuFromProductItem(event);
        addToCart(ids);
      });
    });
    removeLoading();
  } catch (error) {
    console.log(error);
  }
};

const requestAPI = async () => {
  try {
    const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
    const product = await response.json();
    listItems(product);
  } catch (error) {
    console.log(error);
  }
};

const reloadPg = () => {
  document.querySelector('ol').innerHTML = localStorage.getItem('saveCart');
  document.querySelectorAll('li')
  .forEach((element) => element.addEventListener('click', cartItemClickListener));
};

const toEmptyCart = () => {
  document.querySelector('.empty-cart').addEventListener('click', () => {
    document.querySelector('ol').innerHTML = '';
    localStorage.setItem('saveCart', '');
    innerSumChange();
  });
};

window.onload = () => {
  requestAPI();
  reloadPg();
  priceSum();
  innerSumChange();
  toEmptyCart();
};
