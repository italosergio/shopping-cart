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

function cartItemClickListener(event) {
  // coloque seu código aqui 
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// eslint-disable-next-line max-lines-per-function
const requestAPI = async () => {
  try {
    const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
    const product = await response.json();
    const sectionItems = await document.querySelector('.items');
    await product.results.forEach((element) => {
      const { id, title, thumbnail } = element;
      console.log({ id, title, thumbnail });
      sectionItems.appendChild(createProductItemElement({ sku: id, name: title, image: thumbnail }));
    });
    // console.log(product.results[0].title);
    // const { results } = await product;
    // results.reduce((acc, crr) => {
    //   const { id, title, thumbnail } = crr;
    //   console.log(id);
    //   console.log(title);
    //   console.log(thumbnail);console.log(
    //   return createProductItemElement({ id, title, thumbnail });
    // });
  } catch (error) {
    console.log(error);
  }
};

window.onload = () => {
  requestAPI();
};
