$(document).ready(function () {
  let doc = $(document);
  let brand = $("#main-brand");
  let menu = $(".menu");
  let about = $(".about-section");
  let test = $(".test");

  /* ==========================================
   * This code makes the brand logo
   * to be smaller when scrolling
   * ==========================================
   */
  doc.scroll(function () {
    let max_width = 600;
    let min_width = 200;
    let expand_coefficient = 1;

    let new_width = max_width - doc.scrollTop() * expand_coefficient;

    brand.width(new_width >= min_width ? new_width : min_width);
  });

  /* ==========================================
   * This code makes a menu
   * to be fixed when we scroll the first part
   * of the page and to be sticky when we cross it's bottom border
   * ==========================================
   */
  doc.scroll(function () {
    if (test[0].getBoundingClientRect().y >= test.height()) {
      menu.removeClass("menu_sticky-bottom");
      menu.addClass("menu_fixed");
    } else {
      menu.removeClass("menu_fixed");
      menu.addClass("menu_sticky-bottom");
    }
  });

  doc.scroll(function () {
    // console.log(about[0].getBoundingClientRect());
    // console.log(about.height());

    let coords = about[0].getBoundingClientRect();

    // GC - Green Channel
    // BC - Blue Channel
    let GCStart = 90;
    let BCStart = 61;

    let GCEnd = 30;
    let BCEnd = 172;

    if (coords.y <= 0) {
      let GCCurrent =
        GCStart + ((3 * coords.y) / about.height()) * (GCStart - GCEnd);
      let BCCurrent =
        BCStart - ((3 * coords.y) / about.height()) * (BCEnd - BCStart);

      if (GCCurrent < GCEnd) GCCurrent = GCEnd;
      if (BCCurrent > BCEnd) BCCurrent = BCEnd;

      about.css("background-color", `rgb(255, ${GCCurrent}, ${BCCurrent})`);
    }
  });
});
