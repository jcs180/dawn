document.addEventListener('DOMContentLoaded', () => {
  const sliderContainer = document.querySelector('.featured-collection-slider');

  if (sliderContainer) {
    const settings = JSON.parse(sliderContainer.getAttribute('data-slider-settings'));

    // Build HTML for the products dynamically
    const slider = document.createElement('div');

    slider.classList.add('slick-slider');
    for (product of products) {
      const slide = document.createElement('div');
      slide.classList.add('slick-slide');
      slide.innerHTML = `
              <a href="${product.url}">
                <img src="${product.image}" alt="${product.title}" width="${product.width}" height="${product.height}">
                <h3>${product.title}</h3>
                <p>${product.price}</p>
              </a>
            `;
      slider.appendChild(slide);
    }

    sliderContainer.appendChild(slider);

    // Initialize Slick.js
    $(slider).slick({
      autoplay: settings.autoplay,
      arrows: true,
      dots: true,
    });
  }
});
