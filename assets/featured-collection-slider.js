$(document).ready(() => {
  // Initialize Slick
  $(".featured-collection-slider--card-list").each(function () {
    const autoplay = $(this).data("slick-autoplay");
    const autoplaySpeed = $(this).data("slick-speed") * 1000;

    $(this).slick({
      arrows: false,
      dots: true,
      slidesToShow: 4,
      slidesToScroll: 4,
      autoplay,
      autoplaySpeed,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    });
  });

  // Click handlers
  const atcButtons = document.querySelectorAll(".featured-collection-slider--card-atc-button");

  for (const button of atcButtons) {
    button.addEventListener("click", (event) => {
      const id = event.currentTarget.getAttribute("data-product-id");

      console.log(`adding ${id} to cart...`);
    });
  }
});
