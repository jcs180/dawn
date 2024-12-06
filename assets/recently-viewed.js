/*=================================================================*/
// STORE RECENTLY VIEWED DATA
const MAX_LENGTH = 5; // Will be 4, since we remove the currently viewed product
const productHandle = window.location.pathname.split('/products/')[1];
const data = JSON.parse(localStorage.getItem('recentlyViewedProductHandles')) || [];

if (productHandle && !data.includes(productHandle)) {
  data.push(productHandle);
}

const updatedData = data.slice(-MAX_LENGTH);

localStorage.setItem('recentlyViewedProductHandles', JSON.stringify(updatedData));

/*=================================================================*/
// SECTION FUNCTIONALITY
const recentlyViewedProductsWrapper = document.querySelector('.recently-viewed-section-wrapper');
const recentlyViewedProductsContainer = document.querySelector('#recently-viewed-products');

if (recentlyViewedProductsContainer) {
  renderProducts();
}

async function renderProducts() {
  try {
    const products = (await Promise.all(updatedData.map(fetchProductData))).filter(
      ({ product }) => product.handle !== productHandle
    );

    if (products.length) {
      // Inject HTML
      const productHTML = products.reverse().map(buildProductCard).join('');

      recentlyViewedProductsContainer.innerHTML = productHTML;

      // Set up click handlers
      document.addEventListener('click', (e) => {
        if (e.target.matches('.recently-viewed-add-to-cart')) {
          addToCart(e.target.getAttribute('data-id'));
        }
      });

      // Display section once ready
      recentlyViewedProductsWrapper.style.display = 'block';
    }
  } catch (err) {
    console.error('Error rendering content:', err);
    return null;
  }
}

/*=================================================================*/
// HELPERS
async function addToCart(variantId, quantity = 1) {
  try {
    const response = await fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: variantId, quantity }),
    });

    if (!response.ok) throw new Error('Failed to add product to cart');

    // TODO: Update cart properly (meaning items get added to notification drawer)
    // const cartData = await response.json();
    // console.log('Cart updated:', cartData);

    // // Trigger the cart update event
    // publish(PUB_SUB_EVENTS.cartUpdate, {
    //   source: 'product-form',
    //   productVariantId: variantId,
    //   cartData: cartData,
    // });

    // Temp workaround for updating cart
    const cartNotificationPopup = document.querySelector('#cart-notification');
    const cartIconBubble = document.querySelector('#cart-icon-bubble');
    const cartCountBubble = document.querySelector('.cart-count-bubble span');
    const cartCount = Number.parseInt(cartCountBubble?.innerHTML) || 0;
    const header = document.querySelector('.shopify-section-header-sticky');

    cartNotificationPopup.classList.add('active');
    header.classList.remove('shopify-section-header-hidden');

    if (cartCountBubble) {
      cartCountBubble.innerHTML = cartCount + 1;
    } else {
      cartIconBubble.innerHTML += `
        <div class="cart-count-bubble">
            <span aria-hidden="true">1</span>
            <span class="visually-hidden">1 item</span>
        </div>
        `;
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
  }
}

function buildProductCard({ product }) {
  /*
    TODO:
    - Dynamically fetch currency data, instead of hardcoding
    - Add variant selector, instead of assuming first variant
  */

  const currency = 'GBP';
  const currencySymbol = '£';

  return `
    <div class="recently-viewed-item">
        <img src="${product.image.src}" alt="${product.title}">
        <div class="info">
            <h3 class="card__heading h5">${product.title}</h3>
            <span class="price">${currencySymbol}${product.variants[0].price} ${currency}</span>
        </div>
        <button class="recently-viewed-add-to-cart button button--secondary" data-id="${product.variants[0].id}">
            Add to Cart
        </button>
    </div>
`;
}

async function fetchProductData(handle) {
  try {
    const response = await fetch(`/products/${handle}.json`);
    if (!response.ok) throw new Error('Failed to fetch product');
    return response.json();
  } catch (err) {
    console.error(`Error fetching product ${handle}:`, err);
    return null;
  }
}
