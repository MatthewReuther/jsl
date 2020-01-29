
/* This is the main JS file, included on every page of the site.
 * Use Sprockets 'require's *only* in this file. To add functionality, create
 * a new file and 'require' it in here. Coffeescript files should have the 
 * extension 'js.coffee'.
 */

// wait for document ready
jQuery(document).ready(function($) {


   $('.contact-form').parsley();








  /***************************************
  *       Main Navigation Dropdowns      *
  ***************************************/

  // initialize Superfish
  $(".desktop-nav-wrap .menu").superfish();
  // initialize dropdowns
  // clone and differentiate between desktop nav and mobile nav
  $(".desktop-nav-wrap .menu").addClass("desktop-nav");
  $(".desktop-nav-wrap .menu").clone().removeClass("desktop-nav").addClass("mobile-nav").appendTo(".mobile-nav-wrap");
  $(".mobile-nav-wrap > ul > li > ul").parent().addClass("dropdown");
  $(".mobile-nav-wrap > ul > li > div").parent().addClass("dropdown");
  $('.menu > li > ul').siblings('a').after('<i class="icon-down-arrow"></i>');
  $('.menu > li > div').siblings('a').after('<i class="icon-down-arrow"></i>');
  $('.nav-container .cta').find('a').prepend('<i class="icn-right-arrow-cirle"></i>');
  $('.menu .branding a').empty();
  $('.menu .branding a').append('<i class="icn-s-logo ir">S</i>');

  // add dropdown class to LI's with child UL's (for styling purposes)
  $('.menu > li > ul').parent().addClass("dropdown");
  $('.menu > li > div').parent().addClass("dropdown");
  // $('.desktop-nav-wrap .dropdown ul').wrap('<div class="sf-mega"></div>');

  // clone first tier nav links and place in child UL's for mobile user access
  $(".mobile-nav-wrap ul > li > ul").prev("a").each(function() {
    var $li = $("<li><a class='link-overview' href='"+$(this).parent().children("a").attr("href")+"'>Overview</a></li>");
    $(this).parent().children("ul").prepend($li);
  });
  
  $(".mobile-nav-wrap ul > li > div").prev("a").each(function() {
    var $li = $("<li><a class='link-overview' href='"+$(this).parent().children("a").attr("href")+"'>Overview</a></li>");
    $(this).parent().find("ul:first-child").prepend($li);
  });


  // bind dropdown functions to parent LI's
  // $('.desktop-nav-wrap .menu > li').hover(function() {
  //   $(this).addClass("active");
  //     $('> ul', this).addClass('hover').not('a').stop(true, true).slideDown('2000');
  // }, function() {
  //   $(this).removeClass("active");
  //     $('> ul', this).removeClass('hover').not('a').stop(true, true).slideUp('2000');
  // });
  
  // set click toggle for mobile submenus
  $(".mobile-nav-wrap ul > li.dropdown .icon-down-arrow").click(function(e) {

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
  
  // stop child lists from propagating click event to parent LI
  $(".mobile-nav-wrap ul > li.dropdown ul *").click(function(e) {
    e.stopPropagation();
  });
  
  // mobile dropdown toggle code
  $('.btn-mobile-nav').click(function() {
    if ($(this).hasClass('active'))
      $(this).removeClass('active');
    else
      $(this).addClass('active');
    if ($('.mobile-nav-wrap .menu').is(":visible"))
      $('.mobile-nav-wrap .menu').removeClass("expanded").slideUp('2000').addClass("collapsed");
    else
      $('.mobile-nav-wrap .menu').removeClass("collapsed").slideDown('2000').addClass("expanded");
  }); 
        
  $('.lt-ie9 .nav-content-sub a').css( "background-size", "contain" );
  $('.lt-ie9 .h-form').css( "background-size", "contain" );
  
    $('input, textarea').placeholder();
    // FORM VALIDATION SCRIPT
    // toggle form values
    $('form :input').not('input[type=submit]').not('input[type=hidden]').each(function() {

      this.onfocus = function() {
        if (this.value == this.defaultValue)
          this.value = "";
      }
      
      this.onblur = function() {
        if (this.value == "")
          this.value = this.defaultValue;
      }

    });

    // form check function
    $('form').submit(function() {

      // initialize message variable
      var message = '';
      // initialize focus variable
      var focus = '';
      // variable to hold current element title
      var elTitle = '';
      // initialize flag variable for go/no-go on form submissions
      var flag = false;
      

      // checkTitle() function to get/generate title
      // for form field inputs (used for user alerts)
      function checkTitle() {
        
        var element = '';
        
        // check if title attribute has been set and grab title
        if ($(this).attr('title') != '' && $(this).attr('title') != undefined)
          element = $(this).attr('title');

        
        // else, check value attribute for title
        else if ($(this).prop('defaultValue') != '' && $(this).prop('defaultValue') != undefined)
          element = $(this).prop('defaultValue');

        // else, check placeholder (html5)
        else if ($(this).attr('placeholder') != '' && $(this).attr('placeholder') != undefined)
          element = $(this).attr('placeholder');

        // else, use element name
        else
          element = $(this).attr('name');

          
        elTitle = element;
      }

      // checkEmpty() function to check for default value
      // and empty values in text boxes
      function checkEmpty() {
        
        var empty = false;
        
        switch($(this).attr('type')) {
          case "text": 
            // trim whitespace from input value
            var trimVal = $.trim($(this).val());
      
            if (trimVal == '' || trimVal == 'undefined' || trimVal == $(this).attr('placeholder') || trimVal == $(this).prop("defaultValue"))
              empty = true;

            break;
            
          case "checkbox":
            if (! $(this).is(':checked'))
              empty = true;
            
            break;
        }
        
        // generate empty alert message
        if (empty == true) {

          $(this).each(checkTitle);
          message += '* ' + elTitle + ' is required.' + '\r\n';
          
          if (focus == '')
            focus = this;
        }
      }
      
      // checkEmail function to check email values for
      // invalid email address formats
      function checkEmail() {
        // email regex filters
        var emailFilter=/^.+@.+\..+$/;
        var illegalChars= /[\(\)\<\>\,\;\:\\\/\[\]]/;
        
        // check email address format
        if (!(emailFilter.test($(this).val())) || $(this).val().match(illegalChars)) {
        
          $(this).each(checkTitle);
          message += '* ' + elTitle + ' is in an invalid format.' + '\r\n';
          
          // set focus element if first incomplete item
          if (focus == '')
            focus = this;
        }
      }

      // checkPhone function to check phone number
      // values for invalid phone number formats
      function checkPhone() {
        // get phone number format
        var digits = $(this).val().replace(/[\(\)\.\-\ ]/g, '');

        if (isNaN(parseInt(digits))) {
        
          $(this).each(checkTitle);
            message += '* ' + elTitle + ' contains illegal characters.' + '\r\n';
            
            // set focus element if first incomplete item
            if (focus == '')
            focus = this;
          }
      }

      // check fields
      $(':input.required', this).not('input[type=submit]').not('input[type=hidden]').each(checkEmpty);
      $('.email-address.required', this).each(checkEmail);
      $('.phone-number.required', this).each(checkPhone);

      // check if message set - if so, errors have occured
      if (message != '') {
        // display alert message
        alert("Please complete the following before submitting: \r\n\r\n" + message);
        // focus on first incomplete element
        $(focus).focus();
        // reset variables
        focus = '';
        message = '';
        // stop form from sending
        return false;
      }

      // else, return true and complete send
      return true;
    });


//   $('input, textarea').placeholder();
//   this.sitemapstyler = function(){
//      var sitemap = document.getElementById("sitemap")
//      if(sitemap){
        
//        this.listItem = function(li){
//          if(li.getElementsByTagName("ul").length > 0){
//            var ul = li.getElementsByTagName("ul")[0];
//            ul.style.display = "none";
//            var span = document.createElement("span");
//            span.className = "collapsed";
//            span.onclick = function(){
//              ul.style.display = (ul.style.display == "none") ? "block" : "none";
//              this.className = (ul.style.display == "none") ? "collapsed" : "expanded";
//            };
//            li.appendChild(span);
//          };
//        };
        
//        var items = sitemap.getElementsByTagName("li");
//        for(var i=0;i<items.length;i++){
//          listItem(items[i]);
//        };
        
//      };  
//    };
    
//    window.onload = sitemapstyler;

  $('.flexslider').flexslider();

 });
