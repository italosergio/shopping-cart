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
  section.appendChild(createCustomElement('button', 'item__add btn btn-primary', 'Adicionar ao carrinho!'));
  section.addEventListener('m', (e) => {
    e.target.className = 'item zoom';
    e.target,addEventListener('mo')
  })

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const sumValue = () => {
  let sum = 0;
  document.querySelectorAll('li').forEach((line) => {
    sum += parseFloat(line.innerText.split('$').pop());
  });
  
  return parseFloat(sum.toFixed(2));
};

const priceSum = () => {
  document.querySelector('.total-price').innerText = sumValue();
};

function cartItemClickListener(event) {
  event.target.remove();
  localStorage.setItem('saveCart', document.querySelector('ol').innerHTML);
  priceSum();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item list-group-item list-group-item-info mb-1';
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
    priceSum();
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
      createItem.lastChild.addEventListener('click', (event) => {
        const eventArea = event.target.parentNode;
        const idTarget = getSkuFromProductItem(eventArea);
        addToCart(idTarget);
      });
    });
    removeLoading();
  } catch (error) {
    console.log(error);
  }
};

const mlRequestApiComputer = async () => {
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
    priceSum();
  });
};

window.onload = () => {
  mlRequestApiComputer();
  reloadPg();
  sumValue();
  priceSum();
  toEmptyCart();

  if (document.querySelectorAll('li').length) {
    document.querySelector('.empty-cart').classList.add('displayNone');
  }
};
