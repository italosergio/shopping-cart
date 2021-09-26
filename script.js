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
    
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// const addCart = (product) => {
//   const sectionItemsAdd = document.querySelector('.cart__items');
//   const buttomsItemAdd = document.querySelectorAll('.item__add');
//   product.results.forEach(({ id: sku, title: name, salePrice: price }) => {
//     sectionItemsAdd.appendChild(createCartItemElement({ sku, name, price }));
//     // console.log(product);
//     }))
//   };
// };

const addToCart = (id) => {
  const sectionItemsAdd = document.querySelector('.cart__items');
  fetch(`https://api.mercadolibre.com/items/${id}`)
  .then((result) => result.json())
  .then(({ id: sku, title: name, price: salePrice }) => {
    const cartItem = createCartItemElement({ sku, name, salePrice });
    console.log(cartItem);
    console.log(sectionItemsAdd);
    sectionItemsAdd.appendChild(cartItem);
  });
};

const listItems = async (product) => {
  console.log(product);
  const sectionItems = document.querySelector('.items');
  try {
    await product.results.forEach((element) => {
      const { id, title, thumbnail } = element;
      const createItem = createProductItemElement({ sku: id, name: title, image: thumbnail });
      sectionItems.appendChild(createItem);
      createItem.lastChild.addEventListener('click', (e) => {
        console.log('evento ativo');
        const event = e.target.parentNode;
        const ids = getSkuFromProductItem(event);
        addToCart(ids);
      });
    });
  } catch (error) {
    console.log(error);
  }
};

// eslint-disable-next-line max-lines-per-function
const requestAPI = async () => {
  try {
    const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
    const product = await response.json();
    // console.log(product);
    listItems(product);
    // addCart({ sku: id, name: title, salePrice: price });

  } catch (error) {
    console.log(error);
  }
};

// const buttomAddCart = document.querySelector('.item__add');
// buttomAddCart.addEventListener('click', () => {
//   console.log('aaaaaa');
// });

// };

window.onload = () => {
  requestAPI();
  // document.querySelector('body').addEventListener('click', (ev) => console.log(ev.target));
};
