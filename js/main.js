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

class ScrollDistributor {
  constructor() {
    this._data = new Map();
    this._checker = function (object) {
      // if checker returns true, we should activate objects
      let coords = $(object)[0].getBoundingClientRect();
      let top =
        coords.top >= 0 ? coords.top : Math.abs(coords.top) - coords.height;

      return top <= this.maxDistance;
    };

    this._mainFunc = function () {
      /* ==========================================
       * _data is an associative container:
       * key - predicate
       * value - [{isActive, toExecute, object}...]
       * ==========================================
       */
      for (let pair of this._data) {
        let condition = pair[0]; // function
        let dataObject = pair[1]; // [{isActive, toExecute, object}...]

        if (condition()) {
          dataObject.forEach((element) => {
            element.isActive = this._checker(element.object);
            if (element.isActive) element.toExecute();
          });
        }
      }
    }.bind(this);

    this._initializers = [];
    this._maxDistance = $(window).height();
  }

  get maxDistance() {
    return this._maxDistance;
  }

  set maxDistance(value) {
    this._maxDistance = value;
  }

  set(predicate, func, object) {
    if (typeof predicate !== "function") return false;
    if (typeof func !== "function") return false;

    if (this._data.has(predicate)) {
      let arr = this._data.get(predicate); // [{isActive, toExecute, object}...]
      let isFuncExist = false;

      // if the same function is exists in _data object, we don't need to add it
      for (let i = 0; i < arr.length; ++i) {
        let element = arr[i].toExecute;
        if (element === func) {
          isFuncExist = true;
          break;
        }
      }

      if (isFuncExist) return false;

      this._data.get(predicate).push({
        isActive: true,
        toExecute: func,
        object: object,
      });
    } else {
      this._data.set(predicate, [
        {
          isActive: true,
          toExecute: func,
          object: object,
        },
      ]);
    }

    return true;
  }

  erase(predicate) {
    this._data.delete(predicate);
  }

  addInitializer(func) {
    if (typeof func !== "function") return null;

    this._initializers.push(func);
  }

  run() {
    let self = this;
    $(function () {
      self._initializers.forEach((func) => func());
      $(window).bind("scroll", self._mainFunc);
    });
  }

  stop() {
    let self = this;
    $(function () {
      $(window).unbind("scroll", self._mainFunc);
    });
  }

  isActive(predicate) {
    if (!this._data.has(predicate)) return null;

    return this._data.get(predicate).isActive;
  }
}

$(document).ready(function () {
  let distributor = new ScrollDistributor();
  let doc = $(document);
  let firstPart = $(".first-part");

  /* main-section variables */
  let mainSection = $(".main-section");
  let brand = $("#main-brand");
  let mainMenu = $(".menu");

  /* about-section variables */
  let aboutSection = $(".about-section");
  let stripes = $(".stripe");
  let leftStripe = $(".stripe_left");
  let rightStripe = $(".stripe_right");
  let firstFounder = $("#first-founder");
  let secondFounder = $("#second-founder");

  /* slider section variables */
  let slider = $(".slider");
  let sliderCoords = slider[0].getBoundingClientRect();
  let sliderWrapper = $(".slider-wrapper");
  let sliderLength = Array.from($(".slider .slide")).length;

  /* clients section variables */
  let clientsSection = $(".clients-section");
  let clientsSectionMenu = $(".clients-section__menu");
  let clientsSectionBrandWrapper = $(".clients-section__brand-wrapper");

  /* reviews section variables */
  let reviewsSection = $(".reviews-section");
  let reviewsSectionMenu = $(".reviews-section__menu");
  let reviewsSectionBrandWrapper = $(".reviews-section__brand-wrapper");

  /*---------- PREDICATES ----------*/

  function alwaysTrue() {
    return true;
  }

  function isEndOfObject(object) {
    let coords = object[0].getBoundingClientRect();
    return Math.abs(coords.top) >= coords.height - $(window).height();
  }

  function isAboveObject(object) {
    let coords = object[0].getBoundingClientRect();
    return coords.top > 0;
  }

  function isAboveAboutSection() {
    return isAboveObject(aboutSection);
  }

  function isInsideAboutSection() {
    return !isAboveAboutSection();
  }

  function isEndOfAboutSection() {
    return isEndOfObject(aboutSection);
  }

  function isNotEndOfAboutSection() {
    return !isEndOfAboutSection();
  }

  function isEndOfFirstPart() {
    return isEndOfObject(firstPart);
  }

  function isNotEndOfFirstPart() {
    return !isEndOfFirstPart();
  }

  function isAboveSlider() {
    return isAboveObject(slider);
  }

  function isInsideSlider() {
    return !isAboveSlider();
  }

  function test1() {
    let coords = aboutSection[0].getBoundingClientRect();
    return -coords.top >= coords.height;
  }

  function test2() {
    return !test1();
  }

  function isEndOfClientsSection() {
    return isEndOfObject(clientsSection);
  }

  function isNotEndOfClientsSection() {
    return !isEndOfClientsSection();
  }

  function isEndOfReviewsSection() {
    return isEndOfObject(reviewsSection);
  }

  function isNotEndOfReviewsSection() {
    return !isEndOfReviewsSection();
  }
  /*---------- END OF PREDICATES ----------*/

  /*---------- INITIALIZING FUNCTIONS ----------*/

  /* ==========================================
   * This code makes the stripes
   * to be centered on team-header__item elements
   * ==========================================
   */

  function centerStripes() {
    let firstCoords = firstFounder[0].getBoundingClientRect();
    leftStripe.css("left", `${firstCoords.left + firstFounder.width() / 2}px`);

    let secondCoords = secondFounder[0].getBoundingClientRect();
    rightStripe.css(
      "left",
      `${secondCoords.left + secondFounder.width() / 2}px`
    );
  }
  /* ==========================================
   * Slider section code
   * ==========================================
   */

  function initializeSlider() {
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
  }

  /*---------- END OF INITIALIZING FUNCTIONS ----------*/

  /*---------- EXECUTABLE FUNCTIONS ----------*/

  /* ==========================================
   * This function makes the brand logo
   * to be smaller when scrolling
   * ==========================================
   */

  function normalizeMainBrandLogo() {
    brand.width(normalize(0, 300, 400, 200, doc.scrollTop()));
  }

  /* ==========================================
   * This code makes the main section to hid when we can't see it
   * ==========================================
   */

  function hidMainSection() {
    mainSection.addClass("main-section_hidden");
  }

  function showMainSection() {
    mainSection.removeClass("main-section_hidden");
  }

  /* ==========================================
   * This code makes a menu
   * to be fixed when we scroll the first part
   * of the page and to be sticky when we cross it's bottom border
   * ==========================================
   */

  function fixMenu(menu) {
    menu.removeClass("sticky-bottom").addClass("fixed");
  }

  function stickMenu(menu) {
    menu.removeClass("fixed").addClass("sticky-bottom");
  }

  function fixMainMenu() {
    fixMenu(mainMenu);
  }

  function stickMainMenu() {
    stickMenu(mainMenu);
  }

  /* ==========================================
   * This code makes the about section
   * to flow from one color to another
   * ==========================================
   */

  function flowAboutSectionColor() {
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
  }

  /* ==========================================
   * This code makes the stripes
   * appear slowly when scrolling
   * ==========================================
   */

  function showAboutStripes() {
    let coords = aboutSection[0].getBoundingClientRect();
    let newOpacity = normalize(0, -150, 0, 100, coords.top);

    stripes.css("opacity", `${newOpacity}%`);
  }

  /* ==========================================
   * This code makes the stripes to stick to
   * the bottom of its parent when scrolling
   * ==========================================
   */

  function fixStripes() {
    stripes.addClass("fixed").removeClass("absolute");
  }

  function stickStripes() {
    stripes.addClass("absolute").removeClass("fixed");
  }

  /* ==========================================
   * This code makes the taglines
   * disappear when scrolling
   * ==========================================
   */

  function hidTagLines() {
    let items = $(".taglines__item");

    Array.from(items).forEach((item) => {
      let coords = item.getBoundingClientRect();
      let newOpacity = normalize(300, 170, 100, 0, coords.top);
      $(item).css("opacity", `${newOpacity}%`);
    });
  }

  /* ==========================================
   * This code makes the slider
   * to appear when scrolling
   * ==========================================
   */

  function showSlider() {
    let sliderCoords = slider[0].getBoundingClientRect();
    let slideInfo = $(".slide.current .slide__info");

    if (!slideInfo.hasClass("animate")) slideInfo.addClass("animate");

    $(".slider").css(
      "opacity",
      `${normalize($(window).height(), 0, 0, 100, sliderCoords.top)}%`
    );
  }

  /* ==========================================
   * This code triggers
   * the 'active' class for the slider
   * ==========================================
   */

  function activateSlider() {
    slider.addClass("active");
  }

  function deactivateSlider() {
    $(".slide").css("top", "0");
    slider.removeClass("active");
  }

  /* ==========================================
   * This code controls
   * the work of the slider
   * ==========================================
   */

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

  function sliderController() {
    if (slider.hasClass("active")) {
      // scroll inside the slider
      let sliderScroll = $(window).scrollTop() - sliderCoords.top;
      let current = $(".slide.current");

      let maxHeight = getMaxHeight(current);
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
        nextElement.css("opacity", "100%");

        if (maxHeight < sliderWrapper.height()) current.removeClass("current");
      } else if (sliderScroll <= minHeight) {
        current.css("top", "0px");

        if (prevElement.html()) {
          prevElement.addClass("current");
          current.removeClass("current");
        }
      } else {
        current.css("top", `${-sliderScroll + getMinHeight(current)}px`);
        if (nextElement) {
          let nextElementInfo = $(
            `.slide[data-index=${nextElement.data("index")}] .slide__info`
          );
          if (!nextElementInfo.hasClass("animate"))
            nextElementInfo.addClass("animate");

          nextElement.css(
            "opacity",
            `${normalize(
              0,
              -current.height(),
              0,
              100,
              -sliderScroll + getMinHeight(current)
            )}%`
          );
        }
      }
    }
  }

  /* ==========================================
   * Disappearing client logos
   * ==========================================
   */

  function showClientLogos() {
    let items = Array.from($(".clients__item")).concat(
      Array.from($(".clients-section__text"))
    );

    items.forEach((item) => {
      let coords = item.getBoundingClientRect();
      $(item).css("opacity", `${normalize(200, 20, 100, 0, coords.top)}%`);
    });
  }

  /* ==========================================
   * Sticky brand logo code
   * ==========================================
   */

  function fixBrandLogo(logo, offset) {
    logo.removeClass("absolute");
    logo.addClass("fixed");
    logo.css("top", `${offset}px`);
  }

  function stickBrandLogo(section, logo, offset) {
    let coords = section[0].getBoundingClientRect();

    logo.removeClass("fixed");
    logo.addClass("absolute");
    logo.css("top", `${offset + coords.height - $(window).height()}px`);
  }

  function fixClientsBrandLogo() {
    fixBrandLogo(clientsSectionBrandWrapper, 20);
  }

  function stickClientsBrandLogo() {
    stickBrandLogo(clientsSection, clientsSectionBrandWrapper, 20);
  }

  /* ==========================================
   * Sticky menu in the clients section
   * ==========================================
   */

  function fixClientsMenu() {
    fixMenu(clientsSectionMenu);
  }

  function stickClientsMenu() {
    stickMenu(clientsSectionMenu);
  }

  /* ==========================================
   * This code hides the review items
   * ==========================================
   */

  function hidReviewsItems() {
    let items = Array.from($(".reviews__text"))
      .concat(Array.from($(".reviews__client")))
      .concat(Array.from($(".reviews-section__text")));

    items.forEach((item) => {
      let coords = item.getBoundingClientRect();
      $(item).css("opacity", `${normalize(150, 50, 100, 0, coords.top)}%`);
    });
  }

  /* ==========================================
   * Sticky brand logo in the reviews section
   * ==========================================
   */

  function fixReviewsBrandLogo() {
    fixBrandLogo(reviewsSectionBrandWrapper, 20);
  }

  function stickReviewsBrandLogo() {
    stickBrandLogo(reviewsSection, reviewsSectionBrandWrapper, 20);
  }

  /* ==========================================
   * Sticky menu in the reviews section
   * ==========================================
   */

  function fixReviewsMenu() {
    fixMenu(reviewsSectionMenu);
  }

  function stickReviewsMenu() {
    stickMenu(reviewsSectionMenu);
  }

  /*---------- END OF EXECUTABLE FUNCTIONS ----------*/

  /*---------- FUNCTIONS BINDING ----------*/

  distributor.addInitializer(centerStripes);
  distributor.addInitializer(initializeSlider);

  distributor.set(isNotEndOfAboutSection, normalizeMainBrandLogo, brand);

  distributor.set(isAboveAboutSection, showMainSection, mainSection);
  distributor.set(isInsideAboutSection, hidMainSection, aboutSection);

  distributor.set(isEndOfFirstPart, stickMainMenu, firstPart);
  distributor.set(isNotEndOfFirstPart, fixMainMenu, firstPart);

  distributor.set(alwaysTrue, flowAboutSectionColor, aboutSection);
  distributor.set(alwaysTrue, showAboutStripes, aboutSection);

  distributor.set(isEndOfAboutSection, stickStripes, aboutSection);
  distributor.set(isNotEndOfAboutSection, fixStripes, aboutSection);

  distributor.set(alwaysTrue, hidTagLines, aboutSection);

  distributor.set(isEndOfAboutSection, showSlider, slider);

  distributor.set(test2, deactivateSlider, slider);
  distributor.set(test1, activateSlider, slider);

  distributor.set(alwaysTrue, sliderController, slider);
  distributor.set(alwaysTrue, showClientLogos, clientsSection);

  distributor.set(isEndOfClientsSection, stickClientsBrandLogo, clientsSection);
  distributor.set(
    isNotEndOfClientsSection,
    fixClientsBrandLogo,
    clientsSection
  );

  distributor.set(isEndOfClientsSection, stickClientsMenu, clientsSection);
  distributor.set(isNotEndOfClientsSection, fixClientsMenu, clientsSection);

  distributor.set(alwaysTrue, hidReviewsItems, reviewsSection);

  distributor.set(isEndOfReviewsSection, stickReviewsBrandLogo, reviewsSection);
  distributor.set(
    isNotEndOfReviewsSection,
    fixReviewsBrandLogo,
    reviewsSection
  );

  distributor.set(isEndOfReviewsSection, stickReviewsMenu, reviewsSection);
  distributor.set(isNotEndOfReviewsSection, fixReviewsMenu, reviewsSection);

  /*---------- END OF FUNCTIONS BINDING ----------*/

  /*---------- DISTRIBUTOR RUNNING ----------*/

  distributor.run();

  /*---------- END OF DISTRIBUTOR RUNNING ----------*/
});
