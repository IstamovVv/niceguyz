/* ==========================================
 * This function normalize a value from one interval
 * to another interval
 * For example:
 * First interval [0;1]
 * Second interval: [0;200]
 * And if a value from the first interval equals to 0.5
 * The function will return 100 for the second interval
 * ==========================================
 */

function normalize(firstLeft, firstRight, secondLeft, secondRight, firstValue) {
  let ratio;

  if (firstLeft > firstRight) {
    ratio = 1 - (firstValue - firstRight) / (firstLeft - firstRight);
  } else {
    ratio = (firstValue - firstLeft) / (firstRight - firstLeft);
  }

  if (ratio < 0) return secondLeft;
  if (ratio > 1) return secondRight;

  if (secondLeft > secondRight)
    return secondLeft - (secondLeft - secondRight) * ratio;

  return secondLeft + (secondRight - secondLeft) * ratio;
}

$(document).ready(function () {
  let doc = $(document);

  /* first part variable */
  let firstPart = $(".first-part");

  /* main-section variables */
  let brand = $("#main-brand");
  let menu = $(".menu");

  /* about-section variables */
  let aboutSection = $(".about-section");
  let firstFounder = $("#first-founder");
  let secondFounder = $("#second-founder");
  let stripes = $(".stripe");
  let leftStripe = $(".stripe_left");
  let rightStripe = $(".stripe_right");

  /* slider section variables */
  let slider = $(".slider");
  let sliderCoords = slider[0].getBoundingClientRect();
  let sliderWrapper = $(".slider-wrapper");
  let sliderLength = Array.from($(".slider .slide")).length;

  /*---------- MAIN SECTION BEGIN ----------*/

  /* ==========================================
   * This code makes the brand logo
   * to be smaller when scrolling
   * ==========================================
   */
  doc.scroll(function () {
    brand.width(normalize(0, 300, 400, 200, doc.scrollTop()));
  });

  /* ==========================================
   * This code makes a menu
   * to be fixed when we scroll the first part
   * of the page and to be sticky when we cross it's bottom border
   * ==========================================
   */

  doc.scroll(function () {
    let firstPartCoords = firstPart[0].getBoundingClientRect();

    if (
      Math.abs(firstPartCoords.top) <
      firstPart.height() - $(window).height()
    ) {
      menu.removeClass("menu_sticky-bottom").addClass("menu_fixed");
    } else {
      menu.removeClass("menu_fixed").addClass("menu_sticky-bottom");
    }
  });

  /*---------- MAIN SECTION END ----------*/

  /*---------- ABOUT SECTION BEGIN ----------*/

  doc.scroll(function () {
    let coords = aboutSection[0].getBoundingClientRect();

    // GC - Green Channel
    // BC - Blue Channel
    let GCStart = 90;
    let BCStart = 61;

    let GCEnd = 30;
    let BCEnd = 172;

    let GCCurrent = normalize(0, -500, GCStart, GCEnd, coords.top);
    let BCCurrent = normalize(0, -500, BCStart, BCEnd, coords.top);

    aboutSection.css(
      "background-color",
      `rgb(255, ${GCCurrent}, ${BCCurrent})`
    );
  });

  /* ==========================================
   * This code makes the stripes
   * to be centered on team-header__item elements
   * ==========================================
   */

  let firstCoords = firstFounder[0].getBoundingClientRect();
  leftStripe.css("left", `${firstCoords.left + firstFounder.width() / 2}px`);

  let secondCoords = secondFounder[0].getBoundingClientRect();
  rightStripe.css("left", `${secondCoords.left + secondFounder.width() / 2}px`);

  /* ==========================================
   * This code makes the stripes
   * appear slowly when scrolling
   * ==========================================
   */

  doc.scroll(function () {
    let coords = aboutSection[0].getBoundingClientRect();
    let newOpacity = normalize(0, -150, 0, 100, coords.top);

    stripes.css("opacity", `${newOpacity}%`);
  });

  /* ==========================================
   * This code makes the taglines
   * disappear when scrolling
   * ==========================================
   */

  doc.scroll(function () {
    let items = $(".taglines__item");
    Array.from(items).forEach((item) => {
      let coords = item.getBoundingClientRect();
      let newOpacity = normalize(300, 170, 100, 0, coords.top);
      $(item).css("opacity", `${newOpacity}%`);
    });
  });

  doc.scroll(function () {
    let coords = aboutSection[0].getBoundingClientRect();
    if (Math.abs(coords.top) + $(window).height() >= coords.height) {
      stripes.addClass("stripe_absolute").removeClass("stripe_fixed");
    } else {
      stripes.addClass("stripe_fixed").removeClass("stripe_absolute");
    }
  });

  /* ==========================================
   * Slider section code
   * ==========================================
   */

  // z-index for slides
  for (let i = 0; i < sliderLength; ++i) {
    $(`.slide[data-index=${i}]`).css("z-index", `${sliderLength - i - 1}`);
  }

  // All slides except the first should be transparent
  $(".slide:not(.current)").css("opacity", "0");

  // calculate height for slider-wrapper
  let sliderWrapperHeight = 0;
  for (let i = 0; i < sliderLength; ++i) {
    sliderWrapperHeight += $(`.slide[data-index=${i}]`).height();
  }
  sliderWrapper.css("height", `${sliderWrapperHeight}px`);

  // active class trigger for slider
  $(window).scroll(function () {
    let aboutCoords = aboutSection[0].getBoundingClientRect();

    if (-aboutCoords.top >= aboutCoords.height) {
      slider.addClass("active");
    } else {
      $(".slide").css("top", "0");
      slider.removeClass("active");
    }
  });

  function getMaxHeight(element) {
    let index = element.data("index");
    let value = 0;
    while (index >= 0) {
      value += $(`.slide[data-index=${index}]`).height();
      index -= 1;
    }

    return value;
  }

  function getMinHeight(element) {
    let index = element.data("index") - 1;
    let value = 0;
    while (index >= 0) {
      value += $(`.slide[data-index=${index}]`).height();
      index -= 1;
    }

    return value;
  }

  $(window).scroll(function () {
    if (slider.hasClass("active")) {
      // scroll inside the slider
      let sliderScroll = $(window).scrollTop() - sliderCoords.top;
      let current = $(".slide.current");

      // the boundary when we have to show a new next slide
      //let maxHeight = $(window).height() * (current.data("index") + 1);
      let maxHeight = getMaxHeight(current);
      // the boundary when we have to show a previous slide
      //let minHeight = $(window).height() * current.data("index");
      let minHeight = getMinHeight(current);

      // the next slide
      let nextElement =
        $(`.slide[data-index=${current.data("index") + 1}]`) || null;
      // the previous slide
      let prevElement =
        $(`.slide[data-index=${current.data("index") - 1}]`) || null;

      if (sliderScroll >= maxHeight) {
        current.css("top", `${-current.height()}px`);

        if (nextElement) nextElement.addClass("current");

        if (maxHeight < sliderWrapper.height()) current.removeClass("current");
      } else if (sliderScroll <= minHeight) {
        current.css("top", "0px");

        if (prevElement) {
          prevElement.addClass("current");
          current.removeClass("current");
        }
      } else {
        current.css("top", `${-sliderScroll + getMinHeight(current)}px`);
        if (nextElement) {
          nextElement.css(
            "opacity",
            `${normalize(
              0,
              -$(window).height(),
              0,
              100,
              -sliderScroll + getMinHeight(current)
            )}%`
          );
        }
      }
    }
  });

  /* ==========================================
   * Appearing elements code
   * ==========================================
   */
});

/*---------- ABOUT SECTION END ----------*/
