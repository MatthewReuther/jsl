
/* This is the main JS file, included on every page of the site.
 * Use Sprockets 'require's *only* in this file. To add functionality, create
 * a new file and 'require' it in here. Coffeescript files should have the
 * extension 'js.coffee'.
 */

// wait for document ready
jQuery(document).ready(function($) {

/* CHECK IFRAME ORGINAL CODE */

/*
	$("body").fitVids({
      ignore: ".video-player-responsive",
      customSelector: "iframe[src*='view.vzaar.com']",
    });
*/



	 wow = new WOW(
	    {
	      boxClass:     'animatable',      // default
	      animateClass: 'animated', // default
	      offset:       0,          // default
	      mobile:       false,       // default
	      live:         true        // default
	    }
	  )
	  wow.init();
		
		$('#iFramePortal').load(function(){
			checkIframe();
		});
		
		// $('.btn-video').click( function() {
		// 		$('.video-iframe').attr('src', $(this).attr('data-url'));
		// });
	
		
	
	
	
	var checkIframeCnt = 0;
	function checkIframe() {
		if(checkIframeCnt==1) {
			jQuery('#portalDescription').addClass('hidden');
			jQuery('#portalContent').parent().removeClass('col-md-6').addClass('col-md-12');
		}
				
			checkIframeCnt=1;
	}


	
  $('#commentCapture').parents('.mktoFormRow').addClass('mkto-field-message');
  /***************************************
  *       Main Navigation Dropdowns      *
  ***************************************/
  



	

	setInterval(function(){

		if ($('#wheel:hover').length != 0) {
		    // do something ;)
		}
	    
	    else {
	       $("#case-results #wheel-nav .next.nav-control").click();
	    }
	}, 3000);	
	
	
	
	var hideTimeout = null;
	
	var show = function() {
		
    if ($(this).scrollTop() > 100) {
        $('#toTopBar').addClass('active');
        };		

	}
	
	var hide = function() {
	  $('#toTopBar').removeClass('active');
	}
	
	$(document).ready(function(){
	
	  $(window).scroll(function(e){
	  	if (hideTimeout) {
	    	window.clearTimeout(hideTimeout);
			hideTimeout = null;
	    }
	    show();
	
	    window.setTimeout(hide, 10000);
	  });
	  
	});
	

	// Select all links with hashes
	$('a[href*="#"]')
	  // Remove links that don't actually link to anything
	  .not('[href="#"]')
	  .not('[href="#0"]')
	  .click(function(event) {
	    // On-page links
	    if (
	      location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') 
	      && 
	      location.hostname == this.hostname
	    ) {
	      // Figure out element to scroll to
	      var target = $(this.hash);
	      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
	      // Does a scroll target exist?
	      if (target.length) {
	        // Only prevent default if animation is actually gonna happen
	        event.preventDefault();
	        $('html, body').animate({
	          scrollTop: target.offset().top-70
	        }, 1000, function() {
	          // Callback after animation
	          // Must change focus!
	          var $target = $(target);
	          $target.focus();
	          if ($target.is(":focus")) { // Checking if the target was focused
	            return false;
	          } else {
	            $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
	            $target.focus(); // Set focus again
	          };
	        });
	      }
	    }
	  });
	  
	
	
	
	  /***************************************
  *               Accordion            *
  ***************************************/

  $('.accordion--content').slideUp();
  $('.accordion--title').click(function() {

    if (! $(this).parent().hasClass('active')) {
      $(this).parent('.accordion--item').addClass("active").children('.accordion--content').stop(true, true).slideDown();
      $(this).find('.arrow').addClass("active");
    }
    
    else {
      $(this).parent('.accordion--item').removeClass("active").children('.accordion--content').stop(true, true).slideUp();
      $(this).find('.arrow').removeClass("active");
    }

  });
  $('.accordion--content .icn--toggle').click(function() {

      $(this).parents('.accordion--item').removeClass("active").children('.accordion--content').stop(true, true).slideUp();
  });
  
  

	
	$( ".navigation-desktop ul.menu > li > ul.sub-menu" ).wrapInner( "<div class='frame-main clearfix'></div>" );
	$( ".navigation-mobile > ul.menu-mobile" ).wrapInner( "<div class='frame-main clearfix'></div>" );
	/***************************************
	*          DESKTOP NAVIGATION          *
	***************************************/
	$('.header-container ul.menu > li > ul, .header-container .menu ul > li > ul, .header-container ul.menu-mobile > .frame-main > li > ul, .header-container .menu-mobile > .frame-main > ul > li > ul').parent().addClass('dropdown');

	/***************************************
	*          MOBILE NAVIGATION           *
	***************************************/
	$('.header-container ul.menu-mobile > .frame-main > li.dropdown a, .header-container .menu-mobile > .frame-main ul > li.dropdown a').append('<span class="expand-wrapper"><span class="expand"></span></span>');


/*
	 if($(".header-container .menu > li").hasClass("dropdown")){
	      $(".header-container .menu > li.dropdown > a").append('<img class="dropdown-icon" src="https://cjasandbox2.wpengine.com/wp-content/themes/skl/img/icons/icon_nav_dropdown_arrow.svg"/>');
	 }
*/

	 if($(".header-container .menu > li").hasClass("dropdown")){
	      $(".header-container .menu > li.dropdown > a").append('<icn class="dropdown-icon"></icn>');
	 }

	// create toggle function for mobile nav
	$('.menu-mobile-toggle').click(function() {

		if (! $(this).hasClass("active")) {
			$(this).addClass("active");
			$(this).parent().find('ul.menu-mobile').stop(true, true).slideDown();
		}
	
		else {
			$(this).removeClass("active");
			
			$(".header-container ul.menu-mobile li.dropdown").removeClass("active");
			$(this).parent().find('ul.menu-mobile').stop(true, true).slideUp();
			
		}

	});
	

	   //set click toggle for mobile submenus
   $(".menu-mobile li.dropdown > a").click(function(e) {

     // stop link from propogating
     e.preventDefault();

     var x = $(this).parent();

     if (! x.hasClass("active")) {
       x.addClass("active");
       $('> ul', x).not('a').stop(true, true).slideDown(333);
     }
   
     else {
       x.removeClass("active");
       $('> ul', x).not('a').stop(true, true).slideUp(333);
     }
   });
   
   
   
	   //set click toggle for mobile submenus
   $(".menu > li.desktop-inactive > a").click(function(e) {
     // stop link from propogating
     e.preventDefault();

   });
   
	


	var $container = $('.grid')
	// initialize Isotope
	$container.isotope({
	  // options...
	  resizable: false, // disable normal resizing
	  // set columnWidth to a percentage of container width
	  masonry: { isFitWidth: true, gutter: 20, }
	});
	
	// update columnWidth on window resize
	$(window).smartresize(function(){
	  $container.isotope({
	    // update columnWidth to a percentage of container width
	    masonry: { isFitWidth: true, gutter: 20, }
	  });
	});
	
	
	
	$('.all-staff .type-attorney').last().after( '<div class="staff-container dummy staff col col-lg-4 col-md-4 col-sm-6 col-xs-6 clearfix"><div class="staff-img-container" style="border: 4px solid transparent;"></div></div>');
	
		
	

	
  	 // Select and loop the container element of the elements you want to equalise

    



	
	
			$('#recent-posts').each(function(){  
	      
	
		      var highestBox = 0;
		      
		
		      $('.recent-container', this).each(function(){
		
		        if($(this).height() > highestBox) {
		          highestBox = $(this).height(); 
		        }
		      
		      });  
		            
		
		      $('.recent-container',this).height(highestBox);
		                    
		    });
		    
		    
		    


		    


	        
    

	
	
	

	

	
	



		
  
	/***************************************
	*           SCROLLUP FUNCTION          *
	***************************************/

	
	// detect 
	$(".header-container").bind('inview', function (event, visible) {
	  if (visible == true) {
	  	$(".header-container .alert-sticky").removeClass('sticky-active');
	  }
	  
	  else {
	  	$(".header-container .alert-sticky").addClass('sticky-active');
	  }
	});
 
 
	
	$('.testimonial-slider-container .post-slides').slick({
       dots: false,
       infinite: true,
       arrows: true,
       adaptiveHeight: true,
       slidesToShow: 1,
	   slidesToScroll: 1,
	   nextArrow: '<i class="nav-control nav-next"></i>',
	   prevArrow: '<i class="nav-control nav-prev"></i>',
	   appendArrows: '.slider-testimonial-nav',
	   autoplaySpeed: 2000,
	   
	});
	
	
	$('.case-mobile-slider .post-slides').slick({
		dots: false,
		arrows: true,
		slidesToShow: 1,
		slidesToScroll: 1,
		infinite: false,
	    nextArrow: '<i class="nav-control nav-next"></i>',
	    prevArrow: '<i class="nav-control nav-prev"></i>',
	    appendArrows: '.slider-case-result-nav',
	    autoplaySpeed: 2000,
	});

	$(window).on('resize orientationchange', function() {
	  $('.testimonial-slider-container .post-slides .post-slides').slick('resize');
	  $('.grid-container .grid-slides').slick('resize');
	});


/*
	$(window).on('resize orientationchange', function(){
		$(function() {
			$('header .header-container').parent().css('min-height', $('header .header-container').outerHeight())
		})
	});
*/

	
	$(window).scroll(function() {
	  var sticky = $('header .header-container');
	  // Use the wrapper's top
	  if (sticky.parent().position().top - $(window).scrollTop() < 0) {
	    if (!sticky.data('fixed')) {
		  sticky.addClass('active'); 
	      sticky.css({
	        'position': 'fixed',
	        'z-index': '999',
	        'top': '0'
	      })
	      sticky.data('fixed', true)
	     
	    }
	  } else if (sticky.data('fixed')) {
		sticky.removeClass('active'); 
	    sticky.css({
	      'position': 'absolute',
	      'z-index': '999',
	      'top': '0'
	    })
	    sticky.data('fixed', false)
	   
	  }
	})
	
	

  

	
	
	

	
  
  
  

 });






