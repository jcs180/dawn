document.addEventListener('DOMContentLoaded', () => {
  const sliderContainer = document.querySelector('.featured-collection-slider');

  if (sliderContainer) {
    const settings = JSON.parse(sliderContainer.getAttribute('data-slider-settings'));

    // Build HTML for the products dynamically
    const slider = document.createElement('div');

    slider.classList.add('slick-slider');

    sliderContainer.appendChild(slider);

    // Initialize Slick.js
    $(slider).slick({
      autoplay: settings.autoplay,
      arrows: true,
      dots: true,
    });
  }
});
