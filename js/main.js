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

  /* main-section variables */
  let main = $(".main-section");
  let brand = $("#main-brand");
  let menu = $(".menu");

  /* about-section variables */
  let about = $(".about-section");
  let teamHeader = $(".team-header");
  let firstFounder = $("#first-founder");
  let secondFounder = $("#second-founder");
  let leftStripe = $("#left-stripe");
  let rightStripe = $("#right-stripe");
  let teamImage = $(".team-image");

  /* test section. should be deleted later */
  let test = $(".test");

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
    if (test[0].getBoundingClientRect().top >= test.height()) {
      menu.removeClass("menu_sticky-bottom");
      menu.addClass("menu_fixed");
    } else {
      menu.removeClass("menu_fixed");
      menu.addClass("menu_sticky-bottom");
    }
  });

  /*---------- MAIN SECTION END ----------*/

  /*---------- ABOUT SECTION BEGIN ----------*/

  doc.scroll(function () {
    let coords = about[0].getBoundingClientRect();

    // GC - Green Channel
    // BC - Blue Channel
    let GCStart = 90;
    let BCStart = 61;

    let GCEnd = 30;
    let BCEnd = 172;

    let GCCurrent = normalize(0, -500, 90, 30, coords.top);
    let BCCurrent = normalize(0, -500, 61, 172, coords.top);

    about.css("background-color", `rgb(255, ${GCCurrent}, ${BCCurrent})`);
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
    let coords = about[0].getBoundingClientRect();
    let newOpacity = normalize(0, -150, 0, 100, coords.top);

    leftStripe.css("opacity", `${newOpacity}%`);
    rightStripe.css("opacity", `${newOpacity}%`);
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
});

/*---------- ABOUT SECTION END ----------*/
