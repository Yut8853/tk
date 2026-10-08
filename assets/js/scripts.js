/*-----------------------------------------------------------------------------------

    Theme Name: Mivon
    Theme URI: http://
    Description: Creative Agency & Portfolio
    Author: UI-ThemeZ
    Author URI: http://themeforest.net/user/UI-ThemeZ
    Version: 1.0

-----------------------------------------------------------------------------------*/


$(function () {

    "use strict";




    var wind = $(window);


    /* =============================================================================
    -----------------------------  Smooth Scroll nav   -----------------------------
    ============================================================================= */


    // ページ内移動はhrefの標準アンカーに統一する。


    /* =============================================================================
    -----------------------------  Dark & Light Mode   -----------------------------
    ============================================================================= */

    $(function () {

        function isLight() {
            return localStorage.getItem("light-mode");
        }

        function toggleRootClass() {
            document.querySelector("body:not(.notmode)").classList.toggle("light");
        }

        function toggleLocalStorageItem() {
            if (isLight()) {
                localStorage.removeItem("light-mode");
                $(".navbar .logo img , footer .logo img").attr("src", "assets/imgs/logo-light.svg");
            } else {
                localStorage.setItem("light-mode", "set");
                $(".navbar .logo img , footer .logo img").attr("src", "assets/imgs/logo-dark.svg");
            }
        }

        if (isLight()) {
            toggleRootClass();
        }

        document.querySelector(".theme-icon").addEventListener("click", () => {
            toggleLocalStorageItem();
            toggleRootClass();
        });

        $("body.light .navbar .logo img , body.light footer .logo img").attr("src", "assets/imgs/logo-dark.svg");

    });


    /* =============================================================================
    --------------------------------  Navbar Menu   --------------------------------
    ============================================================================= */

    $('.navbar .dropdown').hover(function () {
        $(this).find('.dropdown-menu').addClass('show');
    }, function () {
        $(this).find('.dropdown-menu').removeClass('show')
    });

    $('.navbar .dropdown-item').hover(function () {
        $(this).find('.dropdown-side').addClass('show');
    }, function () {
        $(this).find('.dropdown-side').removeClass('show')
    });

    $(".navbar .search-form").on("click", ".search-icon", function () {

        $(".navbar .search-form").toggleClass("open");

        if ($(".navbar .search-form").hasClass('open')) {

            $(".search-form .close-search").slideDown();

        } else {

            $(".search-form .close-search").slideUp();
        }
    });

    $(".navbar").on("click", ".navbar-toggler", function () {

        var menu = $(".navbar .navbar-collapse");
        menu.toggleClass("show");
        $(this).attr("aria-expanded", String(menu.hasClass("show")));
    });

    wind.on("scroll", function () {

        var bodyScroll = wind.scrollTop(),
            navbar = $(".navbar"),
            logo = $(".navbar.change .logo> img");

        if (bodyScroll > 300) {

            navbar.addClass("nav-scroll");
            logo.attr('src', 'assets/imgs/logo-dark.png');

        } else {

            navbar.removeClass("nav-scroll");
            logo.attr('src', 'assets/imgs/logo-light.png');
        }
    });


    $('.navbar .menu-icon').on('click', function () {

        $('.hamenu').addClass("open");
        $('.hamenu').animate({ top: 0 });

        $('.blur-menubg').addClass("active");

    });

    $('.hamenu .close-menu, .one-scroll .menu-links .main-menu > li').on('click', function () {

        $('.hamenu').removeClass("open").delay(100).animate({ top: "-100%" });
        $('.hamenu .menu-links .main-menu .dmenu, .hamenu .menu-links .main-menu .sub-dmenu').removeClass("dopen");
        $('.hamenu .menu-links .main-menu .sub-menu, .hamenu .menu-links .main-menu .sub-menu2').slideUp();

        $('.blur-menubg').removeClass("active");

    });

    $('.hamenu .menu-links .main-menu > li').on('mouseenter', function () {
        $(this).removeClass('hoverd').siblings().addClass('hoverd');
    });

    $('.hamenu .menu-links .main-menu > li').on('mouseleave', function () {
        $(this).removeClass('hoverd').siblings().removeClass('hoverd');
    });


    $('.main-menu > li .dmenu').on('click', function () {
        $(this).parent().parent().find(".sub-menu").toggleClass("sub-open").slideToggle();
        $(this).toggleClass("dopen");
    });

    $('.sub-menu > ul > li .sub-dmenu').on('click', function () {
        $(this).parent().parent().find(".sub-menu2").toggleClass("sub-open").slideToggle();
        $(this).toggleClass("dopen");
    });


    /* =============================================================================
    ------------------------------  Snap parallax gsap   ------------------------------
    ============================================================================= */

    /* =============================================================================
    ------------------------------  Parallax Swiper   ------------------------------
    ============================================================================= */


    var parallaxShowCase;
    var parallaxShowCaseOptions = {
        speed: 1500,
        autoplay: {
            delay: 5000,
        },
        parallax: true,
        mousewheel: true,
        loop: true,

        on: {
            init: function () {
                var swiper = this;
                for (var i = 0; i < swiper.slides.length; i++) {
                    $(swiper.slides[i])
                        .find('.bg-img')
                        .attr({
                            'data-swiper-parallax': 0.75 * swiper.width
                        });
                }
            },
            resize: function () {
                this.update();
            }
        },

        pagination: {
            el: '.showcase-full .swiper-pagination',
            clickable: true
        },

        navigation: {
            nextEl: '.showcase-full .swiper-button-next',
            prevEl: '.showcase-full .swiper-button-prev'
        }
    };
    parallaxShowCase = new Swiper('.showcase-full .parallax-slider-full', parallaxShowCaseOptions);


    /* =============================================================================
    ------------------------------  Swiper slider   -----------------------------
    ============================================================================= */

    var testim2 = new Swiper(".testim-style2 .swiper-container", {
        slidesPerView: 1,
        spaceBetween: 10,
        speed: 1500,
        autoplay: {
            delay: 5000,
        },
        loop: true,
        pagination: {
            el: ".testim-style2 .swiper-pagination",
            clickable: true,
        },
    });

    var testimCard = new Swiper(".testim-card2 .testim-swiper", {
        effect: "cards",
        grabCursor: true,
        navigation: {
            nextEl: '.testim-card2 .swiper-button-next',
            prevEl: '.testim-card2 .swiper-button-prev',
        },
        keyboard: {
            enabled: true,
            onlyInViewport: false,
        }
    });

    var testim3 = new Swiper(".testim-style3 .swiper-container", {
        slidesPerView: 3,
        spaceBetween: 30,
        speed: 1500,
        autoplay: {
            delay: 5000,
        },
        loop: true,
        pagination: {
            el: ".testim-style3 .swiper-pagination",
            clickable: true,
        },

        breakpoints: {
            0: {
                slidesPerView: 1,
            },
            640: {
                slidesPerView: 1,
            },
            768: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 3,
            },
        },
    });

    var Blog1 = new Swiper('.blog-style1 .swiper-container , .blog-style2 .swiper-container', {
        slidesPerView: 3,
        spaceBetween: 30,
        speed: 1500,
        pagination: {
            el: ".blog-style1 .swiper-pagination",
            type: "fraction",
        },
        navigation: {
            nextEl: '.blog-style1 .swiper-button-next',
            prevEl: '.blog-style1 .swiper-button-prev',
        },
        mousewheel: false,
        keyboard: true,
        autoplay: {
            delay: 5000,
        },
        loop: false,
        breakpoints: {
            0: {
                slidesPerView: 1,
            },
            640: {
                slidesPerView: 1,
            },
            768: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 3,
            },
        },
    });

    var heroaward = new Swiper(".hero-style2 .awards-swiper", {
        slidesPerView: 1,
        spaceBetween: 30,
        speed: 1500,
        autoplay: {
            delay: 5000,
        },
        loop: true,
        pagination: {
            el: ".hero-style2 .swiper-pagination",
            clickable: true,
        },

        navigation: {
            nextEl: ".hero-style2 .swiper-button-next",
            prevEl: ".hero-style2 .swiper-button-prev",
        },
    });

    var team = new Swiper(".about-md .team-swiper", {
        slidesPerView: 1,
        spaceBetween: 30,
        speed: 1500,
        loop: true,
        pagination: {
            el: ".about-md .swiper-pagination",
            clickable: true,
        },

        navigation: {
            nextEl: ".about-md .swiper-button-next",
            prevEl: ".about-md .swiper-button-prev",
        },
    });

    // thumb slider
    var portfolioThumbSlider = new Swiper('.testim-style1 .thumb-slider', {
        slidesPerView: 1,
        spaceBetween: 30,
        // centeredSlides: true,
        speed: 2000,
        // watchSlidesProgress: true,
        navigation: {
            nextEl: '.testim-style1 .swiper-button-next',
            prevEl: '.testim-style1 .swiper-button-prev',
        },
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
        },
        mousewheel: false,
        keyboard: true,
        loop: true,
        allowTouchMove: false,
        a11y: false,
    });

    // main slider
    var portfolioMainSlider = new Swiper('.testim-style1 .main-slider', {
        slidesPerView: 1,
        spaceBetween: 30,
        centeredSlides: true,
        speed: 2000,
        pagination: {
            el: '.testim-style1 .swiper-pagination',
            type: 'fraction',
        },
        navigation: {
            nextEl: '.testim-style1 .swiper-button-next',
            prevEl: '.testim-style1 .swiper-button-prev',
        },
        mousewheel: false,
        keyboard: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
        },
        loop: true,
        // thumbs: {
        //     swiper: portfolioThumbSlider
        // },
        allowTouchMove: false,
        a11y: false,
    });


    var heroeffect = new Swiper(".hero-swiper", {
        effect: "coverflow",
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: "auto",
        spaceBetween: 10,
        loop: true,
        loopedSlides: 8,
        coverflowEffect: {
            rotate: 80,
            depth: -100,
            modifier: .2,
            scale: 1.2,
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
    });

    var swiperVer = new Swiper('.portfolio-vertical .swiper-container', {
        direction: 'vertical',
        slidesPerView: 7,
        centeredSlides: true,
        spaceBetween: 0,
        mousewheel: true,
        grabCursor: true,
        loop: true,
        speed: 1500,
        autoplay: {
            delay: 1500,
            disableOnInteraction: false,
        },
    });


    /* =============================================================================
    ------------------------------  Interactive work   -----------------------------
    ============================================================================= */

    $('.inter-links-center .links-text li').on('mouseenter', function () {
        var tab_id = $(this).attr('data-tab');
        $('.links-text li').removeClass('current');
        $(this).addClass('current');

        $('.links-img .img').removeClass('current');
        $("#" + tab_id).addClass('current');

        if ($(this).hasClass('current')) {
            return false;
        }
    });


    $('.inter-links-center .links-text li').on('mouseenter', function () {
        $(this).removeClass('no-active').siblings().addClass('no-active');
    });

    $('.inter-links-center .links-text li').on('mouseleave', function () {
        $('.inter-links-center .links-text li').removeClass('no-active');
    });


    /* =============================================================================
    ------------------------------  Interactive   -----------------------------
    ============================================================================= */

    $('.interactive-sec .cluom').on('mouseenter', function () {
        var tab_id = $(this).attr('data-tab');
        $('.interactive-sec .cluom').removeClass('current');
        $(this).addClass('current');

        $('.interactive-sec .glry-img .tab-img ').removeClass('current');
        $("#" + tab_id).addClass('current');

        if ($(this).hasClass('current')) {
            return false;
        }
    });



    // 25. hover reveal for image //
    const hoverItem = document.querySelectorAll(".hover-reveal-item");
    function moveImage(e, hoverItem) {
        const item = hoverItem.getBoundingClientRect();
        const x = e.clientX - item.x;
        const y = e.clientY - item.y;
        if (hoverItem.children[1]) {
            hoverItem.children[1].style.transform = `translate(${x}px, ${y}px)`;
        }
    }
    hoverItem.forEach((item, i) => {
        item.addEventListener("mousemove", (e) => {
            setInterval(moveImage(e, item), 100);
        });
    });


    $('.team-reval .item-row , .awards-reval .item-row , .serv-style6 .item').hover(function () {
        $(".team-reval .item-row , .awards-reval .item-row , .serv-style6 .item").css("opacity", ".2");
        $(this).css("opacity", "1");
    }, function () {
        $(".team-reval .item-row , .awards-reval .item-row , .serv-style6 .item").css("opacity", "1");
    });



    /* =============================================================================
   ------------------------------  Data Background   ------------------------------
   ============================================================================= */

    var pageSection = $(".bg-img, section");
    pageSection.each(function (indx) {

        if ($(this).attr("data-background")) {
            $(this).css("background-image", "url(" + $(this).data("background") + ")");
        }
    });

    var pageSectionColor = $(".bg-solid-color, section");
    pageSectionColor.each(function (indx) {

        var color = $(this).attr("data-solid-color");

        if ($(this).attr("data-solid-color")) {
            $(this).css("background-color", color);
        }
    });

    /* =============================================================================
    -----------------------------------  Tabs  -------------------------------------
    ============================================================================= */

    $('#tabs .tab-links').on('click', '.item-link', function () {

        var tab_id = $(this).attr('data-tab');

        $('#tabs .tab-links .item-link').removeClass('current');
        $(this).addClass('current');

        $('.tab-content').hide();
        $("#" + tab_id).show();

    });

    $('#tabs-fade .tab-links').on('click', '.item-link', function () {

        var tab2_id = $(this).attr('data-tab');

        $('#tabs-fade .tab-links .item-link').removeClass('current');
        $(this).addClass('current');

        $('.tab-content').fadeOut();
        $("#" + tab2_id).fadeIn();

    });

    /* ===============================  Accordion Side  =============================== */

    $(".portfolio-crev .item, .portfolio-elegant .item").hover(
        function () {
            $(".portfolio-elegant .item .cont").addClass("hide");
            $(this).addClass("active");
        },
        function () {
            $(this).removeClass("active");
            $(".portfolio-elegant .item .cont").removeClass("hide");
        }
    );


    /* =============================================================================
    --------------------------------  Accordion  -----------------------------------
    ============================================================================= */

    $(".accordion").on("click", ".title", function () {

        $(this).next().slideDown();

        $(".accordion-info").not($(this).next()).slideUp();

    });

    $(".accordion").on("click", ".accordion-item", function () {

        $(".accordion .accordion-item").removeClass("active");
        $(this).addClass("active");

    });


    /* =============================================================================
    ---------------------------------  Tolltip  ------------------------------------
    ============================================================================= */

    $('[data-tooltip-tit]').hover(function () {
        $('<div class="div-tooltip-tit"></div>').text($(this).attr('data-tooltip-tit')).appendTo('body').fadeIn();
    }, function () {
        $('.div-tooltip-tit').remove();
    }).mousemove(function (e) {
        $('.div-tooltip-tit').css({ top: e.pageY + 10, left: e.pageX + 20 })
    });

    $('[data-tooltip-sub]').hover(function () {
        $('<div class="div-tooltip-sub"></div>').text($(this).attr('data-tooltip-sub')).appendTo('body').fadeIn();
    }, function () {
        $('.div-tooltip-sub').remove();
    }).mousemove(function (e) {
        $('.div-tooltip-sub').css({ top: e.pageY + (-20), left: e.pageX + 30 })
    });


    /* =============================================================================
    -------------------------------  Progress Bar  ---------------------------------
    ============================================================================= */

    wind.on('scroll', function () {
        $(".skill-progress .progres").each(function () {
            var bottom_of_object =
                $(this).offset().top + $(this).outerHeight();
            var bottom_of_window =
                $(window).scrollTop() + $(window).height();
            var myVal = $(this).attr('data-value');
            if (bottom_of_window > bottom_of_object) {
                $(this).css({
                    width: myVal
                });
            }
        });
    });


    var $targetElements = $('.same-hw');

    // Function to set height equal to width
    function setHeightEqualToWidth() {
        $targetElements.each(function () {
            var elementWidth = $(this).width();
            $(this).height(elementWidth);
        });
    }

    // Call the function on page load
    setHeightEqualToWidth();

    // Call the function on window resize to maintain the aspect ratio
    $(window).resize(function () {
        setHeightEqualToWidth();
    });

    /* =============================================================================
    -----------------------------  Trigger Plugins  --------------------------------
    ============================================================================= */

    /* ========== YouTubePopUp ========== */

    $("a.vid").YouTubePopUp();


    /* ========== magnificPopup ========== */

    $('.popup-img , .gallery').magnificPopup({
        delegate: '.popimg',
        type: 'image',
        gallery: {
            enabled: true
        }
    });


    /* =========== hover3d =========== */

    $(".hover3d").hover3d({
        selector: ".hover3d-child",
        invert: true
    });

});


/* =============================================================================
-----------------------------  cursor Animation  -----------------------------
============================================================================= */

(function () {
    const link = document.querySelectorAll('.hover-this');
    const cursor = document.querySelector('.cursor');
    const animateit = function (e) {
        const hoverAnim = this.querySelector('.hover-anim');
        const { offsetX: x, offsetY: y } = e,
            { offsetWidth: width, offsetHeight: height } = this,
            move = 25,
            xMove = x / width * (move * 2) - move,
            yMove = y / height * (move * 2) - move;
        hoverAnim.style.transform = `translate(${xMove}px, ${yMove}px)`;
        if (e.type === 'mouseleave') hoverAnim.style.transform = '';
    };
    const editCursor = e => {
        const { clientX: x, clientY: y } = e;
        cursor.style.left = x + 'px';
        cursor.style.top = y + 'px';
    };
    link.forEach(b => b.addEventListener('mousemove', animateit));
    link.forEach(b => b.addEventListener('mouseleave', animateit));
    window.addEventListener('mousemove', editCursor);

    $("a, .cursor-pointer").hover(
        function () {
            $(".cursor").addClass("cursor-active");
        }, function () {
            $(".cursor").removeClass("cursor-active");
        }
    );


    /* =============================================================================
    -----------------------------  Text Animation  -----------------------------
    ============================================================================= */


    let elements = document.querySelectorAll(".rolling-text");

    elements.forEach((element) => {
        let innerText = element.innerText;
        element.innerHTML = "";

        let textContainer = document.createElement("div");
        textContainer.classList.add("block");

        for (let letter of innerText) {
            let span = document.createElement("span");
            span.innerText = letter.trim() === "" ? "\xa0" : letter;
            span.classList.add("letter");
            textContainer.appendChild(span);
        }

        element.appendChild(textContainer);
        element.appendChild(textContainer.cloneNode(true));
    });

    elements.forEach((element) => {
        element.addEventListener("mouseover", () => {
            element.classList.remove("play");
        });
    });
})();


/* =============================================================================
////////////////////////////////////////////////////////////////////////////////
============================================================================= */

$(window).on("load", function () {


    /* =============================================================================
    ---------------------------------  Preloader  ----------------------------------
    ============================================================================= */




    /* =============================================================================
    -----------------------------  isotope Masonery   ------------------------------
    ============================================================================= */

    $('.gallery').isotope({
        itemSelector: '.items'
    });

    // isotope
    $('.gallery2').isotope({
        // options
        itemSelector: '.items',
        masonry: {
            // use element for option
            columnWidth: '.width2'
        }
    });

    var $gallery = $('.gallery , .gallery2').isotope();

    $('.filtering').on('click', 'span', function () {
        var filterValue = $(this).attr('data-filter');
        $gallery.isotope({ filter: filterValue });
    });

    $('.filtering').on('click', 'span', function () {
        $(this).addClass('active').siblings().removeClass('active');
    });



});


/* =============================================================================
-----------------------------  Button scroll up   ------------------------------
============================================================================= */

$(document).ready(function () {

    "use strict";

    var progressPath = document.querySelector('.progress-wrap path');
    var pathLength = progressPath.getTotalLength();
    progressPath.style.transition = progressPath.style.WebkitTransition = 'none';
    progressPath.style.strokeDasharray = pathLength + ' ' + pathLength;
    progressPath.style.strokeDashoffset = pathLength;
    progressPath.getBoundingClientRect();
    progressPath.style.transition = progressPath.style.WebkitTransition = 'stroke-dashoffset 10ms linear';
    var updateProgress = function () {
        var scroll = $(window).scrollTop();
        var height = $(document).height() - $(window).height();
        var progress = pathLength - (scroll * pathLength / height);
        progressPath.style.strokeDashoffset = progress;
    }
    updateProgress();
    $(window).scroll(updateProgress);
    var offset = 150;
    var duration = 550;
    jQuery(window).on('scroll', function () {
        if (jQuery(this).scrollTop() > offset) {
            jQuery('.progress-wrap').addClass('active-progress');
        } else {
            jQuery('.progress-wrap').removeClass('active-progress');
        }
    });
    jQuery('.progress-wrap').on('click', function (event) {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: 'auto' });
        return false;
    })

});


/* =============================================================================
-------------------------------  Wow Animation   -------------------------------
============================================================================= */

wow = new WOW({
    animateClass: 'animated',
    offset: 100
});
wow.init();


/* =============================================================================
////////////////////////////////////////////////////////////////////////////////
============================================================================= */

$(function () {
    var width = $(window).width();
    if (width < 991) {

        "use strict";

        $(".navbar .navbar-nav").on("click", ".nav-link", function () {

            $(".navbar .navbar-nav .dropdown .dropdown-menu").removeClass("show");

            $(this).parent().find(".dropdown-menu").addClass("show");
        });
    }
});
