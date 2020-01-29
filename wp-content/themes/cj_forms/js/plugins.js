// usage: log('inside coolFunc', this, arguments);
// paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function f(){ log.history = log.history || []; log.history.push(arguments); if(this.console) { var args = arguments, newarr; args.callee = args.callee.caller; newarr = [].slice.call(args); if (typeof console.log === 'object') log.apply.call(console.log, console, newarr); else console.log.apply(console, newarr);}};

// make it safe to use console.log always
(function(a){function b(){}for(var c="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),d;!!(d=c.pop());){a[d]=a[d]||b;}})
(function(){try{console.log();return window.console;}catch(a){return (window.console={});}}());


// place any jQuery/helper plugins in here, instead of separate, slower script files.

/**
 * author Christopher Blum
 *    - based on the idea of Remy Sharp, http://remysharp.com/2009/01/26/element-in-view-event-plugin/
 *    - forked from http://github.com/zuk/jquery.inview/
 */
(function ($) {
  var inviewObjects = {}, viewportSize, viewportOffset,
      d = document, w = window, documentElement = d.documentElement, expando = $.expando;

  $.event.special.inview = {
    add: function(data) {
      inviewObjects[data.guid + "-" + this[expando]] = { data: data, $element: $(this) };
    },

    remove: function(data) {
      try { delete inviewObjects[data.guid + "-" + this[expando]]; } catch(e) {}
    }
  };

  function getViewportSize() {
    var mode, domObject, size = { height: w.innerHeight, width: w.innerWidth };

    // if this is correct then return it. iPad has compat Mode, so will
    // go into check clientHeight/clientWidth (which has the wrong value).
    if (!size.height) {
      mode = d.compatMode;
      if (mode || !$.support.boxModel) { // IE, Gecko
        domObject = mode === 'CSS1Compat' ?
          documentElement : // Standards
          d.body; // Quirks
        size = {
          height: domObject.clientHeight,
          width:  domObject.clientWidth
        };
      }
    }

    return size;
  }

  function getViewportOffset() {
    return {
      top:  w.pageYOffset || documentElement.scrollTop   || d.body.scrollTop,
      left: w.pageXOffset || documentElement.scrollLeft  || d.body.scrollLeft
    };
  }

  function checkInView() {
    var $elements = $(), elementsLength, i = 0;

    $.each(inviewObjects, function(i, inviewObject) {
      var selector  = inviewObject.data.selector,
          $element  = inviewObject.$element;
      $elements = $elements.add(selector ? $element.find(selector) : $element);
    });

    elementsLength = $elements.length;
    if (elementsLength) {
      viewportSize   = viewportSize   || getViewportSize();
      viewportOffset = viewportOffset || getViewportOffset();

      for (; i<elementsLength; i++) {
        // Ignore elements that are not in the DOM tree
        if (!$.contains(documentElement, $elements[i])) {
          continue;
        }

        var $element      = $($elements[i]),
            elementSize   = { height: $element.height(), width: $element.width() },
            elementOffset = $element.offset(),
            inView        = $element.data('inview'),
            visiblePartX,
            visiblePartY,
            visiblePartsMerged;
        
        // Don't ask me why because I haven't figured out yet:
        // viewportOffset and viewportSize are sometimes suddenly null in Firefox 5.
        // Even though it sounds weird:
        // It seems that the execution of this function is interferred by the onresize/onscroll event
        // where viewportOffset and viewportSize are unset
        if (!viewportOffset || !viewportSize) {
          return;
        }
        
        if (elementOffset.top + elementSize.height > viewportOffset.top &&
            elementOffset.top < viewportOffset.top + viewportSize.height &&
            elementOffset.left + elementSize.width > viewportOffset.left &&
            elementOffset.left < viewportOffset.left + viewportSize.width) {
          visiblePartX = (viewportOffset.left > elementOffset.left ?
            'right' : (viewportOffset.left + viewportSize.width) < (elementOffset.left + elementSize.width) ?
            'left' : 'both');
          visiblePartY = (viewportOffset.top > elementOffset.top ?
            'bottom' : (viewportOffset.top + viewportSize.height) < (elementOffset.top + elementSize.height) ?
            'top' : 'both');
          visiblePartsMerged = visiblePartX + "-" + visiblePartY;
          if (!inView || inView !== visiblePartsMerged) {
            $element.data('inview', visiblePartsMerged).trigger('inview', [true, visiblePartX, visiblePartY]);
          }
        } else if (inView) {
          $element.data('inview', false).trigger('inview', [false]);
        }
      }
    }
  }

  $(w).bind("scroll resize", function() {
    viewportSize = viewportOffset = null;
  });
  
  // IE < 9 scrolls to focused elements without firing the "scroll" event
  if (!documentElement.addEventListener && documentElement.attachEvent) {
    documentElement.attachEvent("onfocusin", function() {
      viewportOffset = null;
    });
  }

  // Use setInterval in order to also make sure this captures elements within
  // "overflow:scroll" elements or elements that appeared in the dom tree due to
  // dom manipulation and reflow
  // old: $(window).scroll(checkInView);
  //
  // By the way, iOS (iPad, iPhone, ...) seems to not execute, or at least delays
  // intervals while the user scrolls. Therefore the inview event might fire a bit late there
  setInterval(checkInView, 250);
})(jQuery);



/*
     * backgroundSize: A jQuery cssHook adding support for "cover" and "contain" to IE6,7,8
     *
     * Requirements:
     * - jQuery 1.7.0+
     *
     * Limitations:
     * - doesn't work with multiple backgrounds (use the :after trick)
     * - doesn't work with the "4 values syntax" of background-position
     * - doesn't work with lengths in background-position (only percentages and keywords)
     * - doesn't work with "background-repeat: repeat;"
     * - doesn't work with non-default values of background-clip/origin/attachment/scroll
     * - you should still test your website in IE!
     *
     * latest version and complete README available on Github:
     * https://github.com/louisremi/jquery.backgroundSize.js
     *
     * Copyright 2012 @louis_remi
     * Licensed under the MIT license.
     *
     * This saved you an hour of work?
     * Send me music http://www.amazon.co.uk/wishlist/HNTU0468LQON
     *
     */



(function($,window,document,Math,undefined) {

      var div = $( "<div>" )[0],
        rsrc = /url\(["']?(.*?)["']?\)/,
        watched = [],
        positions = {
          top: 0,
          left: 0,
          bottom: 1,
          right: 1,
          center: .5
        };

      // feature detection
      if ( "backgroundSize" in div.style && !$.debugBGS ) { return; }

      $.cssHooks.backgroundSize = {
        set: function( elem, value ) {
          var firstTime = !$.data( elem, "bgsImg" ),
            pos,
            $wrapper, $img;

          $.data( elem, "bgsValue", value );

          if ( firstTime ) {
            // add this element to the 'watched' list so that it's updated on resize
            watched.push( elem );

            $.refreshBackgroundDimensions( elem, true );

            // create wrapper and img
            $wrapper = $( "<div>" ).css({
              position: "absolute",
              zIndex: -1,
              top: 0,
              right: 0,
              left: 0,
              bottom: 0,
              overflow: "hidden"
            });

            $img = $( "<img>" ).css({
              position: "absolute"
            }).appendTo( $wrapper ),

            $wrapper.prependTo( elem );

            $.data( elem, "bgsImg", $img[0] );

            pos = ( 
              // Firefox, Chrome (for debug)
              $.css( elem, "backgroundPosition" ) ||
              // IE8
              $.css( elem, "backgroundPositionX" ) + " " + $.css( elem, "backgroundPositionY" )
            ).split(" ");

            // Only compatible with 1 or 2 percentage or keyword values,
            // Not yet compatible with length values and 4 values.
            $.data( elem, "bgsPos", [ 
              positions[ pos[0] ] || parseFloat( pos[0] ) / 100, 
              positions[ pos[1] ] || parseFloat( pos[1] ) / 100
            ]);

            // This is the part where we mess with the existing DOM
            // to make sure that the background image is correctly zIndexed
            $.css( elem, "zIndex" ) == "auto" && ( elem.style.zIndex = 0 );
            $.css( elem, "position" ) == "static" && ( elem.style.position = "relative" );

            $.refreshBackgroundImage( elem );

          } else {
            $.refreshBackground( elem );
          }
        },

        get: function( elem ) {
          return $.data( elem, "bgsValue" ) || "";
        }
      };

      // The background should refresh automatically when changing the background-image
      $.cssHooks.backgroundImage = {
        set: function( elem, value ) {
          // if the element has a backgroundSize, refresh its background
          return $.data( elem, "bgsImg") ?
            $.refreshBackgroundImage( elem, value ) :
            // otherwise set the background-image normally
            value;
        }
      };

      $.refreshBackgroundDimensions = function( elem, noBgRefresh ) {
        var $elem = $(elem),
          currDim = {
            width: $elem.innerWidth(),
            height: $elem.innerHeight()
          },
          prevDim = $.data( elem, "bgsDim" ),
          changed = !prevDim ||
            currDim.width != prevDim.width ||
            currDim.height != prevDim.height;

        $.data( elem, "bgsDim", currDim );

        if ( changed && !noBgRefresh ) {
          $.refreshBackground( elem );
        }
      };

      $.refreshBackgroundImage = function( elem, value ) {
        var img = $.data( elem, "bgsImg" ),
          currSrc = ( rsrc.exec( value || $.css( elem, "backgroundImage" ) ) || [] )[1],
          prevSrc = img && img.src,
          changed = currSrc != prevSrc,
          imgWidth, imgHeight;

        if ( changed ) {
          img.style.height = img.style.width = "auto";

          img.onload = function() {
            var dim = {
              width: img.width,
              height: img.height
            };

            // ignore onload on the proxy image
            if ( dim.width == 1 && dim.height == 1 ) { return; }

            $.data( elem, "bgsImgDim", dim );
            $.data( elem, "bgsConstrain", false );

            $.refreshBackground( elem );

            img.style.visibility = "visible";

            img.onload = null;
          };

          img.style.visibility = "hidden";
          img.src = currSrc;

          if ( img.readyState || img.complete ) {
            img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
            img.src = currSrc;
          }

          elem.style.backgroundImage = "none";
        }
      };

      $.refreshBackground = function( elem ) {
        var value = $.data( elem, "bgsValue" ),
          elemDim = $.data( elem, "bgsDim" ),
          imgDim = $.data( elem, "bgsImgDim" ),
          $img = $( $.data( elem, "bgsImg" ) ),
          pos = $.data( elem, "bgsPos" ),
          prevConstrain = $.data( elem, "bgsConstrain" ),
          currConstrain,
          elemRatio = elemDim.width / elemDim.height,
          imgRatio = imgDim.width / imgDim.height,
          delta;

        if ( value == "contain" ) {
          if ( imgRatio > elemRatio ) {
            $.data( elem, "bgsConstrain", ( currConstrain = "width" ) );

            delta = Math.floor( ( elemDim.height - elemDim.width / imgRatio ) * pos[1] );

            $img.css({
              top: delta
            });

            // when switchin from height to with constraint,
            // make sure to release contraint on height and reset left
            if ( currConstrain != prevConstrain ) {
              $img.css({
                width: "100%",
                height: "auto",
                left: 0
              });
            }

          } else {
            $.data( elem, "bgsConstrain", ( currConstrain = "height" ) );

            delta = Math.floor( ( elemDim.width - elemDim.height * imgRatio ) * pos[0] );

            $img.css({
              left: delta
            });

            if ( currConstrain != prevConstrain ) {
              $img.css({
                height: "100%",
                width: "auto",
                top: 0
              });
            }
          }

        } else if ( value == "cover" ) {
          if ( imgRatio > elemRatio ) {
            $.data( elem, "bgsConstrain", ( currConstrain = "height" ) );

            delta = Math.floor( ( elemDim.height * imgRatio - elemDim.width ) * pos[0] );

            $img.css({
              left: -delta
            });

            if ( currConstrain != prevConstrain ) {
              $img.css({
                height:"100%",
                width: "auto",
                top: 0
              });
            }

          } else {
            $.data( elem, "bgsConstrain", ( currConstrain = "width" ) );

            delta = Math.floor( ( elemDim.width / imgRatio - elemDim.height ) * pos[1] );

            $img.css({
              top: -delta
            });

            if ( currConstrain != prevConstrain ) {
              $img.css({
                width: "100%",
                height: "auto",
                left: 0
              });
            }
          }
        }
      }

      // Built-in throttledresize
      var $event = $.event,
        $special,
        dummy = {_:0},
        frame = 0,
        wasResized, animRunning;

      $special = $event.special.throttledresize = {
        setup: function() {
          $( this ).on( "resize", $special.handler );
        },
        teardown: function() {
          $( this ).off( "resize", $special.handler );
        },
        handler: function( event, execAsap ) {
          // Save the context
          var context = this,
            args = arguments;

          wasResized = true;

              if ( !animRunning ) {
                $(dummy).animate(dummy, { duration: Infinity, step: function() {
                  frame++;

                  if ( frame > $special.threshold && wasResized || execAsap ) {
                    // set correct event type
                    event.type = "throttledresize";
                    $event.dispatch.apply( context, args );
                    wasResized = false;
                    frame = 0;
                  }
                  if ( frame > 9 ) {
                    $(dummy).stop();
                    animRunning = false;
                    frame = 0;
                  }
                }});
                animRunning = true;
              }
        },
        threshold: 1
      };

      // All backgrounds should refresh automatically when the window is resized
      $(window).on("throttledresize", function() {
        $(watched).each(function() {
          $.refreshBackgroundDimensions( this );
        });
      });

      })(jQuery,window,document,Math);

      /*! http://mths.be/placeholder v2.0.7 by @mathias */
          ;(function(window, document, $) {

            var isInputSupported = 'placeholder' in document.createElement('input'),
                isTextareaSupported = 'placeholder' in document.createElement('textarea'),
                prototype = $.fn,
                valHooks = $.valHooks,
                hooks,
                placeholder;

            if (isInputSupported && isTextareaSupported) {

              placeholder = prototype.placeholder = function() {
                return this;
              };

              placeholder.input = placeholder.textarea = true;

            } else {

              placeholder = prototype.placeholder = function() {
                var $this = this;
                $this
                  .filter((isInputSupported ? 'textarea' : ':input') + '[placeholder]')
                  .not('.placeholder')
                  .bind({
                    'focus.placeholder': clearPlaceholder,
                    'blur.placeholder': setPlaceholder
                  })
                  .data('placeholder-enabled', true)
                  .trigger('blur.placeholder');
                return $this;
              };

              placeholder.input = isInputSupported;
              placeholder.textarea = isTextareaSupported;

              hooks = {
                'get': function(element) {
                  var $element = $(element);
                  return $element.data('placeholder-enabled') && $element.hasClass('placeholder') ? '' : element.value;
                },
                'set': function(element, value) {
                  var $element = $(element);
                  if (!$element.data('placeholder-enabled')) {
                    return element.value = value;
                  }
                  if (value == '') {
                    element.value = value;
                    // Issue #56: Setting the placeholder causes problems if the element continues to have focus.
                    if (element != document.activeElement) {
                      // We can't use `triggerHandler` here because of dummy text/password inputs :(
                      setPlaceholder.call(element);
                    }
                  } else if ($element.hasClass('placeholder')) {
                    clearPlaceholder.call(element, true, value) || (element.value = value);
                  } else {
                    element.value = value;
                  }
                  // `set` can not return `undefined`; see http://jsapi.info/jquery/1.7.1/val#L2363
                  return $element;
                }
              };

              isInputSupported || (valHooks.input = hooks);
              isTextareaSupported || (valHooks.textarea = hooks);

              $(function() {
                // Look for forms
                $(document).delegate('form', 'submit.placeholder', function() {
                  // Clear the placeholder values so they don't get submitted
                  var $inputs = $('.placeholder', this).each(clearPlaceholder);
                  setTimeout(function() {
                    $inputs.each(setPlaceholder);
                  }, 10);
                });
              });

              // Clear placeholder values upon page reload
              $(window).bind('beforeunload.placeholder', function() {
                $('.placeholder').each(function() {
                  this.value = '';
                });
              });

            }

            function args(elem) {
              // Return an object of element attributes
              var newAttrs = {},
                  rinlinejQuery = /^jQuery\d+$/;
              $.each(elem.attributes, function(i, attr) {
                if (attr.specified && !rinlinejQuery.test(attr.name)) {
                  newAttrs[attr.name] = attr.value;
                }
              });
              return newAttrs;
            }

            function clearPlaceholder(event, value) {
              var input = this,
                  $input = $(input);
              if (input.value == $input.attr('placeholder') && $input.hasClass('placeholder')) {
                if ($input.data('placeholder-password')) {
                  $input = $input.hide().next().show().attr('id', $input.removeAttr('id').data('placeholder-id'));
                  // If `clearPlaceholder` was called from `$.valHooks.input.set`
                  if (event === true) {
                    return $input[0].value = value;
                  }
                  $input.focus();
                } else {
                  input.value = '';
                  $input.removeClass('placeholder');
                  input == document.activeElement && input.select();
                }
              }
            }

            function setPlaceholder() {
              var $replacement,
                  input = this,
                  $input = $(input),
                  $origInput = $input,
                  id = this.id;
              if (input.value == '') {
                if (input.type == 'password') {
                  if (!$input.data('placeholder-textinput')) {
                    try {
                      $replacement = $input.clone().attr({ 'type': 'text' });
                    } catch(e) {
                      $replacement = $('<input>').attr($.extend(args(this), { 'type': 'text' }));
                    }
                    $replacement
                      .removeAttr('name')
                      .data({
                        'placeholder-password': true,
                        'placeholder-id': id
                      })
                      .bind('focus.placeholder', clearPlaceholder);
                    $input
                      .data({
                        'placeholder-textinput': $replacement,
                        'placeholder-id': id
                      })
                      .before($replacement);
                  }
                  $input = $input.removeAttr('id').hide().prev().attr('id', id).show();
                  // Note: `$input[0] != input` now!
                }
                $input.addClass('placeholder');
                $input[0].value = $input.attr('placeholder');
              } else {
                $input.removeClass('placeholder');
              }
            }

          }(this, document, jQuery));
/*! http://mths.be/placeholder v2.0.7 by @mathias */
    ;(function(window, document, $) {

      var isInputSupported = 'placeholder' in document.createElement('input'),
          isTextareaSupported = 'placeholder' in document.createElement('textarea'),
          prototype = $.fn,
          valHooks = $.valHooks,
          hooks,
          placeholder;

      if (isInputSupported && isTextareaSupported) {

        placeholder = prototype.placeholder = function() {
          return this;
        };

        placeholder.input = placeholder.textarea = true;

      } else {

        placeholder = prototype.placeholder = function() {
          var $this = this;
          $this
            .filter((isInputSupported ? 'textarea' : ':input') + '[placeholder]')
            .not('.placeholder')
            .bind({
              'focus.placeholder': clearPlaceholder,
              'blur.placeholder': setPlaceholder
            })
            .data('placeholder-enabled', true)
            .trigger('blur.placeholder');
          return $this;
        };

        placeholder.input = isInputSupported;
        placeholder.textarea = isTextareaSupported;

        hooks = {
          'get': function(element) {
            var $element = $(element);
            return $element.data('placeholder-enabled') && $element.hasClass('placeholder') ? '' : element.value;
          },
          'set': function(element, value) {
            var $element = $(element);
            if (!$element.data('placeholder-enabled')) {
              return element.value = value;
            }
            if (value == '') {
              element.value = value;
              // Issue #56: Setting the placeholder causes problems if the element continues to have focus.
              if (element != document.activeElement) {
                // We can't use `triggerHandler` here because of dummy text/password inputs :(
                setPlaceholder.call(element);
              }
            } else if ($element.hasClass('placeholder')) {
              clearPlaceholder.call(element, true, value) || (element.value = value);
            } else {
              element.value = value;
            }
            // `set` can not return `undefined`; see http://jsapi.info/jquery/1.7.1/val#L2363
            return $element;
          }
        };

        isInputSupported || (valHooks.input = hooks);
        isTextareaSupported || (valHooks.textarea = hooks);

        $(function() {
          // Look for forms
          $(document).delegate('form', 'submit.placeholder', function() {
            // Clear the placeholder values so they don't get submitted
            var $inputs = $('.placeholder', this).each(clearPlaceholder);
            setTimeout(function() {
              $inputs.each(setPlaceholder);
            }, 10);
          });
        });

        // Clear placeholder values upon page reload
        $(window).bind('beforeunload.placeholder', function() {
          $('.placeholder').each(function() {
            this.value = '';
          });
        });

      }

      function args(elem) {
        // Return an object of element attributes
        var newAttrs = {},
            rinlinejQuery = /^jQuery\d+$/;
        $.each(elem.attributes, function(i, attr) {
          if (attr.specified && !rinlinejQuery.test(attr.name)) {
            newAttrs[attr.name] = attr.value;
          }
        });
        return newAttrs;
      }

      function clearPlaceholder(event, value) {
        var input = this,
            $input = $(input);
        if (input.value == $input.attr('placeholder') && $input.hasClass('placeholder')) {
          if ($input.data('placeholder-password')) {
            $input = $input.hide().next().show().attr('id', $input.removeAttr('id').data('placeholder-id'));
            // If `clearPlaceholder` was called from `$.valHooks.input.set`
            if (event === true) {
              return $input[0].value = value;
            }
            $input.focus();
          } else {
            input.value = '';
            $input.removeClass('placeholder');
            input == document.activeElement && input.select();
          }
        }
      }

      function setPlaceholder() {
        var $replacement,
            input = this,
            $input = $(input),
            $origInput = $input,
            id = this.id;
        if (input.value == '') {
          if (input.type == 'password') {
            if (!$input.data('placeholder-textinput')) {
              try {
                $replacement = $input.clone().attr({ 'type': 'text' });
              } catch(e) {
                $replacement = $('<input>').attr($.extend(args(this), { 'type': 'text' }));
              }
              $replacement
                .removeAttr('name')
                .data({
                  'placeholder-password': true,
                  'placeholder-id': id
                })
                .bind('focus.placeholder', clearPlaceholder);
              $input
                .data({
                  'placeholder-textinput': $replacement,
                  'placeholder-id': id
                })
                .before($replacement);
            }
            $input = $input.removeAttr('id').hide().prev().attr('id', id).show();
            // Note: `$input[0] != input` now!
          }
          $input.addClass('placeholder');
          $input[0].value = $input.attr('placeholder');
        } else {
          $input.removeClass('placeholder');
        }
      }

    }(this, document, jQuery));

 /*
 * jQuery FlexSlider v1.8
 * http://www.woothemes.com/flexslider/
 *
 * Copyright 2012 WooThemes
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Contributing Author: Tyler Smith
 */

;(function ($) {
  
  //FlexSlider: Object Instance
  $.flexslider = function(el, options) {
    var slider = $(el);
    
    // slider DOM reference for use outside of the plugin
    $.data(el, "flexslider", slider);

    slider.init = function() {
      slider.vars = $.extend({}, $.flexslider.defaults, options);
      $.data(el, 'flexsliderInit', true);
      slider.container = $('.slides', slider).eq(0);
      slider.slides = $('.slides:first > li', slider);
      slider.count = slider.slides.length;
      slider.animating = false;
      slider.currentSlide = slider.vars.slideToStart;
      slider.animatingTo = slider.currentSlide;
      slider.atEnd = (slider.currentSlide == 0) ? true : false;
      slider.eventType = ('ontouchstart' in document.documentElement) ? 'touchstart' : 'click';
      slider.cloneCount = 0;
      slider.cloneOffset = 0;
      slider.manualPause = false;
      slider.vertical = (slider.vars.slideDirection == "vertical");
      slider.prop = (slider.vertical) ? "top" : "marginLeft";
      slider.args = {};
      
      //Test for webbkit CSS3 Animations
      slider.transitions = "webkitTransition" in document.body.style && slider.vars.useCSS;
      if (slider.transitions) slider.prop = "-webkit-transform";
      
      //Test for controlsContainer
      if (slider.vars.controlsContainer != "") {
        slider.controlsContainer = $(slider.vars.controlsContainer).eq($('.slides').index(slider.container));
        slider.containerExists = slider.controlsContainer.length > 0;
      }
      //Test for manualControls
      if (slider.vars.manualControls != "") {
        slider.manualControls = $(slider.vars.manualControls, ((slider.containerExists) ? slider.controlsContainer : slider));
        slider.manualExists = slider.manualControls.length > 0;
      }
      
      ///////////////////////////////////////////////////////////////////
      // FlexSlider: Randomize Slides
      if (slider.vars.randomize) {
        slider.slides.sort(function() { return (Math.round(Math.random())-0.5); });
        slider.container.empty().append(slider.slides);
      }
      ///////////////////////////////////////////////////////////////////
      
      ///////////////////////////////////////////////////////////////////
      // FlexSlider: Slider Animation Initialize
      if (slider.vars.animation.toLowerCase() == "slide") {
        if (slider.transitions) {
          slider.setTransition(0);
        }
        slider.css({"overflow": "hidden"});
        if (slider.vars.animationLoop) {
          slider.cloneCount = 2;
          slider.cloneOffset = 1;
          slider.container.append(slider.slides.filter(':first').clone().addClass('clone')).prepend(slider.slides.filter(':last').clone().addClass('clone'));
        }
        //create newSlides to capture possible clones
    slider.newSlides = $('.slides:first > li', slider);
        var sliderOffset = (-1 * (slider.currentSlide + slider.cloneOffset));
        if (slider.vertical) {
          slider.newSlides.css({"display": "block", "width": "100%", "float": "left"});
          slider.container.height((slider.count + slider.cloneCount) * 200 + "%").css("position", "absolute").width("100%");
          //Timeout function to give browser enough time to get proper height initially
          setTimeout(function() {
            slider.css({"position": "relative"}).height(slider.slides.filter(':first').height());
            slider.args[slider.prop] = (slider.transitions) ? "translate3d(0," + sliderOffset * slider.height() + "px,0)" : sliderOffset * slider.height() + "px";
            slider.container.css(slider.args);
          }, 100);

        } else {
          slider.args[slider.prop] = (slider.transitions) ? "translate3d(" + sliderOffset * slider.width() + "px,0,0)" : sliderOffset * slider.width() + "px";
          slider.container.width((slider.count + slider.cloneCount) * 200 + "%").css(slider.args);
          //Timeout function to give browser enough time to get proper width initially
          setTimeout(function() {
            slider.newSlides.width(slider.width()).css({"float": "left", "display": "block"});
          }, 100);
        }
        
      } else { //Default to fade
        //Not supporting fade CSS3 transitions right now
        slider.transitions = false;
        slider.slides.css({"width": "100%", "float": "left", "marginRight": "-100%"}).eq(slider.currentSlide).fadeIn(slider.vars.animationDuration); 
      }
      ///////////////////////////////////////////////////////////////////
      
      ///////////////////////////////////////////////////////////////////
      // FlexSlider: Control Nav
      if (slider.vars.controlNav) {
        if (slider.manualExists) {
          slider.controlNav = slider.manualControls;
        } else {
          var controlNavScaffold = $('<ol class="flex-control-nav"></ol>');
          var j = 1;
          for (var i = 0; i < slider.count; i++) {
            controlNavScaffold.append('<li><a>' + j + '</a></li>');
            j++;
          }

          if (slider.containerExists) {
            $(slider.controlsContainer).append(controlNavScaffold);
            slider.controlNav = $('.flex-control-nav li a', slider.controlsContainer);
          } else {
            slider.append(controlNavScaffold);
            slider.controlNav = $('.flex-control-nav li a', slider);
          }
        }

        slider.controlNav.eq(slider.currentSlide).addClass('active');

        slider.controlNav.bind(slider.eventType, function(event) {
          event.preventDefault();
          if (!$(this).hasClass('active')) {
            (slider.controlNav.index($(this)) > slider.currentSlide) ? slider.direction = "next" : slider.direction = "prev";
            slider.flexAnimate(slider.controlNav.index($(this)), slider.vars.pauseOnAction);
          }
        });
      }
      ///////////////////////////////////////////////////////////////////
      
      //////////////////////////////////////////////////////////////////
      //FlexSlider: Direction Nav
      if (slider.vars.directionNav) {
        var directionNavScaffold = $('<ul class="flex-direction-nav"><li><a class="prev" href="#">' + slider.vars.prevText + '</a></li><li><a class="next" href="#">' + slider.vars.nextText + '</a></li></ul>');
        
        if (slider.containerExists) {
          $(slider.controlsContainer).append(directionNavScaffold);
          slider.directionNav = $('.flex-direction-nav li a', slider.controlsContainer);
        } else {
          slider.append(directionNavScaffold);
          slider.directionNav = $('.flex-direction-nav li a', slider);
        }
        
        //Set initial disable styles if necessary
        if (!slider.vars.animationLoop) {
          if (slider.currentSlide == 0) {
            slider.directionNav.filter('.prev').addClass('disabled');
          } else if (slider.currentSlide == slider.count - 1) {
            slider.directionNav.filter('.next').addClass('disabled');
          }
        }
        
        slider.directionNav.bind(slider.eventType, function(event) {
          event.preventDefault();
          var target = ($(this).hasClass('next')) ? slider.getTarget('next') : slider.getTarget('prev');
          
          if (slider.canAdvance(target)) {
            slider.flexAnimate(target, slider.vars.pauseOnAction);
          }
        });
      }
      //////////////////////////////////////////////////////////////////
      
      //////////////////////////////////////////////////////////////////
      //FlexSlider: Keyboard Nav
      if (slider.vars.keyboardNav && $('ul.slides').length == 1) {
        function keyboardMove(event) {
          if (slider.animating) {
            return;
          } else if (event.keyCode != 39 && event.keyCode != 37){
            return;
          } else {
            if (event.keyCode == 39) {
              var target = slider.getTarget('next');
            } else if (event.keyCode == 37){
              var target = slider.getTarget('prev');
            }
        
            if (slider.canAdvance(target)) {
              slider.flexAnimate(target, slider.vars.pauseOnAction);
            }
          }
        }
        $(document).bind('keyup', keyboardMove);
      }
      //////////////////////////////////////////////////////////////////
      
      ///////////////////////////////////////////////////////////////////
      // FlexSlider: Mousewheel interaction
      if (slider.vars.mousewheel) {
        slider.mousewheelEvent = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel";
        slider.bind(slider.mousewheelEvent, function(e) {
          e.preventDefault();
          e = e ? e : window.event;
          var wheelData = e.detail ? e.detail * -1 : e.originalEvent.wheelDelta / 40,
              target = (wheelData < 0) ? slider.getTarget('next') : slider.getTarget('prev');
          
          if (slider.canAdvance(target)) {
            slider.flexAnimate(target, slider.vars.pauseOnAction);
          }
        });
      }
      ///////////////////////////////////////////////////////////////////
      
      //////////////////////////////////////////////////////////////////
      //FlexSlider: Slideshow Setup
      if (slider.vars.slideshow) {
        //pauseOnHover
        if (slider.vars.pauseOnHover && slider.vars.slideshow) {
          slider.hover(function() {
            slider.pause();
          }, function() {
            if (!slider.manualPause) {
              slider.resume();
            }
          });
        }

        //Initialize animation
        slider.animatedSlides = setInterval(slider.animateSlides, slider.vars.slideshowSpeed);
      }
      //////////////////////////////////////////////////////////////////
      
      //////////////////////////////////////////////////////////////////
      //FlexSlider: Pause/Play
      if (slider.vars.pausePlay) {
        var pausePlayScaffold = $('<div class="flex-pauseplay"><span></span></div>');
      
        if (slider.containerExists) {
          slider.controlsContainer.append(pausePlayScaffold);
          slider.pausePlay = $('.flex-pauseplay span', slider.controlsContainer);
        } else {
          slider.append(pausePlayScaffold);
          slider.pausePlay = $('.flex-pauseplay span', slider);
        }
        
        var pausePlayState = (slider.vars.slideshow) ? 'pause' : 'play';
        slider.pausePlay.addClass(pausePlayState).text((pausePlayState == 'pause') ? slider.vars.pauseText : slider.vars.playText);
        
        slider.pausePlay.bind(slider.eventType, function(event) {
          event.preventDefault();
          if ($(this).hasClass('pause')) {
            slider.pause();
            slider.manualPause = true;
          } else {
            slider.resume();
            slider.manualPause = false;
          }
        });
      }
      //////////////////////////////////////////////////////////////////
      
      //////////////////////////////////////////////////////////////////
      //FlexSlider:Touch Swip Gestures
      //Some brilliant concepts adapted from the following sources
      //Source: TouchSwipe - http://www.netcu.de/jquery-touchwipe-iphone-ipad-library
      //Source: SwipeJS - http://swipejs.com
      if ('ontouchstart' in document.documentElement && slider.vars.touch) {
        //For brevity, variables are named for x-axis scrolling
        //The variables are then swapped if vertical sliding is applied
        //This reduces redundant code...I think :)
        //If debugging, recognize variables are named for horizontal scrolling
        var startX,
          startY,
          offset,
          cwidth,
          dx,
          startT,
          scrolling = false;
              
        slider.each(function() {
          if ('ontouchstart' in document.documentElement) {
            this.addEventListener('touchstart', onTouchStart, false);
          }
        });
        
        function onTouchStart(e) {
          if (slider.animating) {
            e.preventDefault();
          } else if (e.touches.length == 1) {
            slider.pause();
            cwidth = (slider.vertical) ? slider.height() : slider.width();
            startT = Number(new Date());
            offset = (slider.vertical) ? (slider.currentSlide + slider.cloneOffset) * slider.height() : (slider.currentSlide + slider.cloneOffset) * slider.width();
            startX = (slider.vertical) ? e.touches[0].pageY : e.touches[0].pageX;
            startY = (slider.vertical) ? e.touches[0].pageX : e.touches[0].pageY;
            slider.setTransition(0);

            this.addEventListener('touchmove', onTouchMove, false);
            this.addEventListener('touchend', onTouchEnd, false);
          }
        }

        function onTouchMove(e) {
          dx = (slider.vertical) ? startX - e.touches[0].pageY : startX - e.touches[0].pageX;
          scrolling = (slider.vertical) ? (Math.abs(dx) < Math.abs(e.touches[0].pageX - startY)) : (Math.abs(dx) < Math.abs(e.touches[0].pageY - startY));

          if (!scrolling) {
            e.preventDefault();
            if (slider.vars.animation == "slide" && slider.transitions) {
              if (!slider.vars.animationLoop) {
                dx = dx/((slider.currentSlide == 0 && dx < 0 || slider.currentSlide == slider.count - 1 && dx > 0) ? (Math.abs(dx)/cwidth+2) : 1);
              }
              slider.args[slider.prop] = (slider.vertical) ? "translate3d(0," + (-offset - dx) + "px,0)": "translate3d(" + (-offset - dx) + "px,0,0)";
              slider.container.css(slider.args);
            }
          }
        }
        
        function onTouchEnd(e) {
          slider.animating = false;
          if (slider.animatingTo == slider.currentSlide && !scrolling && !(dx == null)) {
            var target = (dx > 0) ? slider.getTarget('next') : slider.getTarget('prev');
            if (slider.canAdvance(target) && Number(new Date()) - startT < 550 && Math.abs(dx) > 20 || Math.abs(dx) > cwidth/2) {
              slider.flexAnimate(target, slider.vars.pauseOnAction);
            } else if (slider.vars.animation !== "fade") {
              slider.flexAnimate(slider.currentSlide, slider.vars.pauseOnAction);
            }
          }
          
          //Finish the touch by undoing the touch session
          this.removeEventListener('touchmove', onTouchMove, false);
          this.removeEventListener('touchend', onTouchEnd, false);
          startX = null;
          startY = null;
          dx = null;
          offset = null;
        }
      }
      //////////////////////////////////////////////////////////////////
      
      //////////////////////////////////////////////////////////////////
      //FlexSlider: Resize Functions (If necessary)
      if (slider.vars.animation.toLowerCase() == "slide") {
        $(window).resize(function(){
          if (!slider.animating && slider.is(":visible")) {
            if (slider.vertical) {
              slider.height(slider.slides.filter(':first').height());
              slider.args[slider.prop] = (-1 * (slider.currentSlide + slider.cloneOffset))* slider.slides.filter(':first').height() + "px";
              if (slider.transitions) {
                slider.setTransition(0);
                slider.args[slider.prop] = (slider.vertical) ? "translate3d(0," + slider.args[slider.prop] + ",0)" : "translate3d(" + slider.args[slider.prop] + ",0,0)";
              }
              slider.container.css(slider.args);
            } else {
              slider.newSlides.width(slider.width());
              slider.args[slider.prop] = (-1 * (slider.currentSlide + slider.cloneOffset))* slider.width() + "px";
              if (slider.transitions) {
                slider.setTransition(0);
                slider.args[slider.prop] = (slider.vertical) ? "translate3d(0," + slider.args[slider.prop] + ",0)" : "translate3d(" + slider.args[slider.prop] + ",0,0)";
              }
              slider.container.css(slider.args);
            }
          }
        });
      }
      //////////////////////////////////////////////////////////////////
      
      //FlexSlider: start() Callback
      slider.vars.start(slider);
    }
    
    //FlexSlider: Animation Actions
    slider.flexAnimate = function(target, pause) {
      if (!slider.animating && slider.is(":visible")) {
        //Animating flag
        slider.animating = true;
        
        //FlexSlider: before() animation Callback
        slider.animatingTo = target;
        slider.vars.before(slider);
        
        //Optional paramter to pause slider when making an anmiation call
        if (pause) {
          slider.pause();
        }
        
        //Update controlNav   
        if (slider.vars.controlNav) {
          slider.controlNav.removeClass('active').eq(target).addClass('active');
        }
        
        //Is the slider at either end
        slider.atEnd = (target == 0 || target == slider.count - 1) ? true : false;
        if (!slider.vars.animationLoop && slider.vars.directionNav) {
          if (target == 0) {
            slider.directionNav.removeClass('disabled').filter('.prev').addClass('disabled');
          } else if (target == slider.count - 1) {
            slider.directionNav.removeClass('disabled').filter('.next').addClass('disabled');
          } else {
            slider.directionNav.removeClass('disabled');
          }
        }
        
        if (!slider.vars.animationLoop && target == slider.count - 1) {
          slider.pause();
          //FlexSlider: end() of cycle Callback
          slider.vars.end(slider);
        }
        
        if (slider.vars.animation.toLowerCase() == "slide") {
          var dimension = (slider.vertical) ? slider.slides.filter(':first').height() : slider.slides.filter(':first').width();
          
          if (slider.currentSlide == 0 && target == slider.count - 1 && slider.vars.animationLoop && slider.direction != "next") {
            slider.slideString = "0px";
          } else if (slider.currentSlide == slider.count - 1 && target == 0 && slider.vars.animationLoop && slider.direction != "prev") {
            slider.slideString = (-1 * (slider.count + 1)) * dimension + "px";
          } else {
            slider.slideString = (-1 * (target + slider.cloneOffset)) * dimension + "px";
          }
          slider.args[slider.prop] = slider.slideString;

          if (slider.transitions) {
              slider.setTransition(slider.vars.animationDuration); 
              slider.args[slider.prop] = (slider.vertical) ? "translate3d(0," + slider.slideString + ",0)" : "translate3d(" + slider.slideString + ",0,0)";
              slider.container.css(slider.args).one("webkitTransitionEnd transitionend", function(){
                slider.wrapup(dimension);
              });   
          } else {
            slider.container.animate(slider.args, slider.vars.animationDuration, function(){
              slider.wrapup(dimension);
            });
          }
        } else { //Default to Fade
          slider.slides.eq(slider.currentSlide).fadeOut(slider.vars.animationDuration);
          slider.slides.eq(target).fadeIn(slider.vars.animationDuration, function() {
            slider.wrapup();
          });
        }
      }
    }
    
    //FlexSlider: Function to minify redundant animation actions
    slider.wrapup = function(dimension) {
      if (slider.vars.animation == "slide") {
        //Jump the slider if necessary
        if (slider.currentSlide == 0 && slider.animatingTo == slider.count - 1 && slider.vars.animationLoop) {
          slider.args[slider.prop] = (-1 * slider.count) * dimension + "px";
          if (slider.transitions) {
            slider.setTransition(0);
            slider.args[slider.prop] = (slider.vertical) ? "translate3d(0," + slider.args[slider.prop] + ",0)" : "translate3d(" + slider.args[slider.prop] + ",0,0)";
          }
          slider.container.css(slider.args);
        } else if (slider.currentSlide == slider.count - 1 && slider.animatingTo == 0 && slider.vars.animationLoop) {
          slider.args[slider.prop] = -1 * dimension + "px";
          if (slider.transitions) {
            slider.setTransition(0);
            slider.args[slider.prop] = (slider.vertical) ? "translate3d(0," + slider.args[slider.prop] + ",0)" : "translate3d(" + slider.args[slider.prop] + ",0,0)";
          }
          slider.container.css(slider.args);
        }
      }
      slider.animating = false;
      slider.currentSlide = slider.animatingTo;
      //FlexSlider: after() animation Callback
      slider.vars.after(slider);
    }
    
    //FlexSlider: Automatic Slideshow
    slider.animateSlides = function() {
      if (!slider.animating) {
        slider.flexAnimate(slider.getTarget("next"));
      }
    }
    
    //FlexSlider: Automatic Slideshow Pause
    slider.pause = function() {
      clearInterval(slider.animatedSlides);
      if (slider.vars.pausePlay) {
        slider.pausePlay.removeClass('pause').addClass('play').text(slider.vars.playText);
      }
    }
    
    //FlexSlider: Automatic Slideshow Start/Resume
    slider.resume = function() {
      slider.animatedSlides = setInterval(slider.animateSlides, slider.vars.slideshowSpeed);
      if (slider.vars.pausePlay) {
        slider.pausePlay.removeClass('play').addClass('pause').text(slider.vars.pauseText);
      }
    }
    
    //FlexSlider: Helper function for non-looping sliders
    slider.canAdvance = function(target) {
      if (!slider.vars.animationLoop && slider.atEnd) {
        if (slider.currentSlide == 0 && target == slider.count - 1 && slider.direction != "next") {
          return false;
        } else if (slider.currentSlide == slider.count - 1 && target == 0 && slider.direction == "next") {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }  
    }
    
    //FlexSlider: Helper function to determine animation target
    slider.getTarget = function(dir) {
      slider.direction = dir;
      if (dir == "next") {
        return (slider.currentSlide == slider.count - 1) ? 0 : slider.currentSlide + 1;
      } else {
        return (slider.currentSlide == 0) ? slider.count - 1 : slider.currentSlide - 1;
      }
    }
    
    //FlexSlider: Helper function to set CSS3 transitions
    slider.setTransition = function(dur) {
      slider.container.css({'-webkit-transition-duration': (dur/1000) + "s"});
    }

    //FlexSlider: Initialize
    slider.init();
  }
  
  //FlexSlider: Default Settings
  $.flexslider.defaults = {
    animation: "fade",              //String: Select your animation type, "fade" or "slide"
    slideDirection: "horizontal",   //String: Select the sliding direction, "horizontal" or "vertical"
    slideshow: true,                //Boolean: Animate slider automatically
    slideshowSpeed: 7000,           //Integer: Set the speed of the slideshow cycling, in milliseconds
    animationDuration: 600,         //Integer: Set the speed of animations, in milliseconds
    directionNav: true,             //Boolean: Create navigation for previous/next navigation? (true/false)
    controlNav: true,               //Boolean: Create navigation for paging control of each clide? Note: Leave true for manualControls usage
    keyboardNav: true,              //Boolean: Allow slider navigating via keyboard left/right keys
    mousewheel: false,              //Boolean: Allow slider navigating via mousewheel
    prevText: "Previous",           //String: Set the text for the "previous" directionNav item
    nextText: "Next",               //String: Set the text for the "next" directionNav item
    pausePlay: false,               //Boolean: Create pause/play dynamic element
    pauseText: 'Pause',             //String: Set the text for the "pause" pausePlay item
    playText: 'Play',               //String: Set the text for the "play" pausePlay item
    randomize: false,               //Boolean: Randomize slide order
    slideToStart: 0,                //Integer: The slide that the slider should start on. Array notation (0 = first slide)
    animationLoop: true,            //Boolean: Should the animation loop? If false, directionNav will received "disable" classes at either end
    pauseOnAction: true,            //Boolean: Pause the slideshow when interacting with control elements, highly recommended.
    pauseOnHover: false,            //Boolean: Pause the slideshow when hovering over slider, then resume when no longer hovering
    useCSS: true,                   //Boolean: Override the use of CSS3 Translate3d animations
    touch: true,                    //Boolean: Disable touchswipe events
    controlsContainer: "",          //Selector: Declare which container the navigation elements should be appended too. Default container is the flexSlider element. Example use would be ".flexslider-container", "#container", etc. If the given element is not found, the default action will be taken.
    manualControls: "",             //Selector: Declare custom control navigation. Example would be ".flex-control-nav li" or "#tabs-nav li img", etc. The number of elements in your controlNav should match the number of slides/tabs.
    start: function(){},            //Callback: function(slider) - Fires when the slider loads the first slide
    before: function(){},           //Callback: function(slider) - Fires asynchronously with each slider animation
    after: function(){},            //Callback: function(slider) - Fires after each slider animation completes
    end: function(){}               //Callback: function(slider) - Fires when the slider reaches the last slide (asynchronous)
  }
  
  //FlexSlider: Plugin Function
  $.fn.flexslider = function(options) {
    return this.each(function() {
      var $slides = $(this).find('.slides > li');
      if ($slides.length === 1) {
        $slides.find('.slides > li').fadeIn(400);
        if (options && options.start) options.start($(this));
      }
      else if ($(this).data('flexsliderInit') != true) {
        new $.flexslider(this, options);
      }
    });
  }

})(jQuery);

/**
 * hoverIntent is similar to jQuery's built-in "hover" method except that
 * instead of firing the handlerIn function immediately, hoverIntent checks
 * to see if the user's mouse has slowed down (beneath the sensitivity
 * threshold) before firing the event. The handlerOut function is only
 * called after a matching handlerIn.
 *
 * hoverIntent r7 // 2013.03.11 // jQuery 1.9.1+
 * http://cherne.net/brian/resources/jquery.hoverIntent.html
 *
 * You may use hoverIntent under the terms of the MIT license. Basically that
 * means you are free to use hoverIntent as long as this header is left intact.
 * Copyright 2007, 2013 Brian Cherne
 *
 * // basic usage ... just like .hover()
 * .hoverIntent( handlerIn, handlerOut )
 * .hoverIntent( handlerInOut )
 *
 * // basic usage ... with event delegation!
 * .hoverIntent( handlerIn, handlerOut, selector )
 * .hoverIntent( handlerInOut, selector )
 *
 * // using a basic configuration object
 * .hoverIntent( config )
 *
 * @param  handlerIn   function OR configuration object
 * @param  handlerOut  function OR selector for delegation OR undefined
 * @param  selector    selector OR undefined
 * @author Brian Cherne <brian(at)cherne(dot)net>
 **/
(function($) {
    $.fn.hoverIntent = function(handlerIn,handlerOut,selector) {

        // default configuration values
        var cfg = {
            interval: 100,
            sensitivity: 7,
            timeout: 0
        };

        if ( typeof handlerIn === "object" ) {
            cfg = $.extend(cfg, handlerIn );
        } else if ($.isFunction(handlerOut)) {
            cfg = $.extend(cfg, { over: handlerIn, out: handlerOut, selector: selector } );
        } else {
            cfg = $.extend(cfg, { over: handlerIn, out: handlerIn, selector: handlerOut } );
        }

        // instantiate variables
        // cX, cY = current X and Y position of mouse, updated by mousemove event
        // pX, pY = previous X and Y position of mouse, set by mouseover and polling interval
        var cX, cY, pX, pY;

        // A private function for getting mouse position
        var track = function(ev) {
            cX = ev.pageX;
            cY = ev.pageY;
        };

        // A private function for comparing current and previous mouse position
        var compare = function(ev,ob) {
            ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
            // compare mouse positions to see if they've crossed the threshold
            if ( ( Math.abs(pX-cX) + Math.abs(pY-cY) ) < cfg.sensitivity ) {
                $(ob).off("mousemove.hoverIntent",track);
                // set hoverIntent state to true (so mouseOut can be called)
                ob.hoverIntent_s = 1;
                return cfg.over.apply(ob,[ev]);
            } else {
                // set previous coordinates for next time
                pX = cX; pY = cY;
                // use self-calling timeout, guarantees intervals are spaced out properly (avoids JavaScript timer bugs)
                ob.hoverIntent_t = setTimeout( function(){compare(ev, ob);} , cfg.interval );
            }
        };

        // A private function for delaying the mouseOut function
        var delay = function(ev,ob) {
            ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
            ob.hoverIntent_s = 0;
            return cfg.out.apply(ob,[ev]);
        };

        // A private function for handling mouse 'hovering'
        var handleHover = function(e) {
            // copy objects to be passed into t (required for event object to be passed in IE)
            var ev = jQuery.extend({},e);
            var ob = this;

            // cancel hoverIntent timer if it exists
            if (ob.hoverIntent_t) { ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t); }

            // if e.type == "mouseenter"
            if (e.type == "mouseenter") {
                // set "previous" X and Y position based on initial entry point
                pX = ev.pageX; pY = ev.pageY;
                // update "current" X and Y position based on mousemove
                $(ob).on("mousemove.hoverIntent",track);
                // start polling interval (self-calling timeout) to compare mouse coordinates over time
                if (ob.hoverIntent_s != 1) { ob.hoverIntent_t = setTimeout( function(){compare(ev,ob);} , cfg.interval );}

                // else e.type == "mouseleave"
            } else {
                // unbind expensive mousemove event
                $(ob).off("mousemove.hoverIntent",track);
                // if hoverIntent state is true, then call the mouseOut function after the specified delay
                if (ob.hoverIntent_s == 1) { ob.hoverIntent_t = setTimeout( function(){delay(ev,ob);} , cfg.timeout );}
            }
        };

        // listen for mouseenter and mouseleave
        return this.on({'mouseenter.hoverIntent':handleHover,'mouseleave.hoverIntent':handleHover}, cfg.selector);
    };
})(jQuery);
/*
 * jQuery Superfish Menu Plugin
 * Copyright (c) 2013 Joel Birch
 *
 * Dual licensed under the MIT and GPL licenses:
 *  http://www.opensource.org/licenses/mit-license.php
 *  http://www.gnu.org/licenses/gpl.html
 */

(function ($) {
  "use strict";

  var methods = (function () {
    // private properties and methods go here
    var c = {
        bcClass: 'sf-breadcrumb',
        menuClass: 'sf-js-enabled',
        anchorClass: 'sf-with-ul',
        menuArrowClass: 'sf-arrows'
      },
      ios = (function () {
        var ios = /iPhone|iPad|iPod/i.test(navigator.userAgent);
        if (ios) {
          // iOS clicks only bubble as far as body children
          $(window).load(function () {
            $('body').children().on('click', $.noop);
          });
        }
        return ios;
      })(),
      wp7 = (function () {
        var style = document.documentElement.style;
        return ('behavior' in style && 'fill' in style && /iemobile/i.test(navigator.userAgent));
      })(),
      toggleMenuClasses = function ($menu, o) {
        var classes = c.menuClass;
        if (o.cssArrows) {
          classes += ' ' + c.menuArrowClass;
        }
        $menu.toggleClass(classes);
      },
      setPathToCurrent = function ($menu, o) {
        return $menu.find('li.' + o.pathClass).slice(0, o.pathLevels)
          .addClass(o.hoverClass + ' ' + c.bcClass)
            .filter(function () {
              return ($(this).children(o.popUpSelector).hide().show().length);
            }).removeClass(o.pathClass);
      },
      toggleAnchorClass = function ($li) {
        $li.children('a').toggleClass(c.anchorClass);
      },
      toggleTouchAction = function ($menu) {
        var touchAction = $menu.css('ms-touch-action');
        touchAction = (touchAction === 'pan-y') ? 'auto' : 'pan-y';
        $menu.css('ms-touch-action', touchAction);
      },
      applyHandlers = function ($menu, o) {
        var targets = 'li:has(' + o.popUpSelector + ')';
        if ($.fn.hoverIntent && !o.disableHI) {
          $menu.hoverIntent(over, out, targets);
        }
        else {
          $menu
            .on('mouseenter.superfish', targets, over)
            .on('mouseleave.superfish', targets, out);
        }
        var touchevent = 'MSPointerDown.superfish';
        if (!ios) {
          touchevent += ' touchend.superfish';
        }
        if (wp7) {
          touchevent += ' mousedown.superfish';
        }
        $menu
          .on('focusin.superfish', 'li', over)
          .on('focusout.superfish', 'li', out)
          .on(touchevent, 'a', o, touchHandler);
      },
      touchHandler = function (e) {
        var $this = $(this),
          $ul = $this.siblings(e.data.popUpSelector);

        if ($ul.length > 0 && $ul.is(':hidden')) {
          $this.one('click.superfish', false);
          if (e.type === 'MSPointerDown') {
            $this.trigger('focus');
          } else {
            $.proxy(over, $this.parent('li'))();
          }
        }
      },
      over = function () {
        var $this = $(this),
          o = getOptions($this);
        clearTimeout(o.sfTimer);
        $this.siblings().superfish('hide').end().superfish('show');
      },
      out = function () {
        var $this = $(this),
          o = getOptions($this);
        if (ios) {
          $.proxy(close, $this, o)();
        }
        else {
          clearTimeout(o.sfTimer);
          o.sfTimer = setTimeout($.proxy(close, $this, o), o.delay);
        }
      },
      close = function (o) {
        o.retainPath = ($.inArray(this[0], o.$path) > -1);
        this.superfish('hide');

        if (!this.parents('.' + o.hoverClass).length) {
          o.onIdle.call(getMenu(this));
          if (o.$path.length) {
            $.proxy(over, o.$path)();
          }
        }
      },
      getMenu = function ($el) {
        return $el.closest('.' + c.menuClass);
      },
      getOptions = function ($el) {
        return getMenu($el).data('sf-options');
      };

    return {
      // public methods
      hide: function (instant) {
        if (this.length) {
          var $this = this,
            o = getOptions($this);
          if (!o) {
            return this;
          }
          var not = (o.retainPath === true) ? o.$path : '',
            $ul = $this.find('li.' + o.hoverClass).add(this).not(not).removeClass(o.hoverClass).children(o.popUpSelector),
            speed = o.speedOut;

          if (instant) {
            $ul.show();
            speed = 0;
          }
          o.retainPath = false;
          o.onBeforeHide.call($ul);
          $ul.stop(true, true).animate(o.animationOut, speed, function () {
            var $this = $(this);
            o.onHide.call($this);
          });
        }
        return this;
      },
      show: function () {
        var o = getOptions(this);
        if (!o) {
          return this;
        }
        var $this = this.addClass(o.hoverClass),
          $ul = $this.children(o.popUpSelector);

        o.onBeforeShow.call($ul);
        $ul.stop(true, true).animate(o.animation, o.speed, function () {
          o.onShow.call($ul);
        });
        return this;
      },
      destroy: function () {
        return this.each(function () {
          var $this = $(this),
            o = $this.data('sf-options'),
            $hasPopUp;
          if (!o) {
            return false;
          }
          $hasPopUp = $this.find(o.popUpSelector).parent('li');
          clearTimeout(o.sfTimer);
          toggleMenuClasses($this, o);
          toggleAnchorClass($hasPopUp);
          toggleTouchAction($this);
          // remove event handlers
          $this.off('.superfish').off('.hoverIntent');
          // clear animation's inline display style
          $hasPopUp.children(o.popUpSelector).attr('style', function (i, style) {
            return style.replace(/display[^;]+;?/g, '');
          });
          // reset 'current' path classes
          o.$path.removeClass(o.hoverClass + ' ' + c.bcClass).addClass(o.pathClass);
          $this.find('.' + o.hoverClass).removeClass(o.hoverClass);
          o.onDestroy.call($this);
          $this.removeData('sf-options');
        });
      },
      init: function (op) {
        return this.each(function () {
          var $this = $(this);
          if ($this.data('sf-options')) {
            return false;
          }
          var o = $.extend({}, $.fn.superfish.defaults, op),
            $hasPopUp = $this.find(o.popUpSelector).parent('li');
          o.$path = setPathToCurrent($this, o);

          $this.data('sf-options', o);

          toggleMenuClasses($this, o);
          toggleAnchorClass($hasPopUp);
          toggleTouchAction($this);
          applyHandlers($this, o);

          $hasPopUp.not('.' + c.bcClass).superfish('hide', true);

          o.onInit.call(this);
        });
      }
    };
  })();

  $.fn.superfish = function (method, args) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    }
    else if (typeof method === 'object' || ! method) {
      return methods.init.apply(this, arguments);
    }
    else {
      return $.error('Method ' +  method + ' does not exist on jQuery.fn.superfish');
    }
  };

  $.fn.superfish.defaults = {
    popUpSelector: 'ul,.sf-mega', // within menu context
    hoverClass: 'sfHover',
    pathClass: 'overrideThisToUse',
    pathLevels: 1,
    delay: 800,
    animation: {opacity: 'show'},
    animationOut: {opacity: 'hide'},
    speed: 'normal',
    speedOut: 'fast',
    cssArrows: true,
    disableHI: false,
    onInit: $.noop,
    onBeforeShow: $.noop,
    onShow: $.noop,
    onBeforeHide: $.noop,
    onHide: $.noop,
    onIdle: $.noop,
    onDestroy: $.noop
  };

  // soon to be deprecated
  $.fn.extend({
    hideSuperfishUl: methods.hide,
    showSuperfishUl: methods.show
  });

})(jQuery);
/*
  By Osvaldas Valutis, www.osvaldas.info
  Available for use under the MIT License
*/



;(function( $, window, document, undefined )
{
  $.fn.doubleTapToGo = function( params )
  {
    if( !( 'ontouchstart' in window ) &&
      !navigator.msMaxTouchPoints &&
      !navigator.userAgent.toLowerCase().match( /windows phone os 7/i ) ) return false;

    this.each( function()
    {
      var curItem = false;

      $( this ).on( 'click', function( e )
      {
        var item = $( this );
        if( item[ 0 ] != curItem[ 0 ] )
        {
          e.preventDefault();
          curItem = item;
        }
      });

      $( document ).on( 'click touchstart MSPointerDown', function( e )
      {
        var resetItem = true,
          parents   = $( e.target ).parents();

        for( var i = 0; i < parents.length; i++ )
          if( parents[ i ] == curItem[ 0 ] )
            resetItem = false;

        if( resetItem )
          curItem = false;
      });
    });
    return this;
  };
})( jQuery, window, document );

/*!
* Parsley.js
* Version 2.7.0 - built Wed, Mar 1st 2017, 3:53 pm
* http://parsleyjs.org
* Guillaume Potier - <guillaume@wisembly.com>
* Marc-Andre Lafortune - <petroselinum@marc-andre.ca>
* MIT Licensed
*/

// The source code below is generated by babel as
// Parsley is written in ECMAScript 6
//
var _slice = Array.prototype.slice;

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('jquery')) : typeof define === 'function' && define.amd ? define(['jquery'], factory) : global.parsley = factory(global.jQuery);
})(this, function ($) {
  'use strict';

  var globalID = 1;
  var pastWarnings = {};

  var Utils__Utils = {
    // Parsley DOM-API
    // returns object from dom attributes and values
    attr: function attr($element, namespace, obj) {
      var i;
      var attribute;
      var attributes;
      var regex = new RegExp('^' + namespace, 'i');

      if ('undefined' === typeof obj) obj = {};else {
        // Clear all own properties. This won't affect prototype's values
        for (i in obj) {
          if (obj.hasOwnProperty(i)) delete obj[i];
        }
      }

      if ('undefined' === typeof $element || 'undefined' === typeof $element[0]) return obj;

      attributes = $element[0].attributes;
      for (i = attributes.length; i--;) {
        attribute = attributes[i];

        if (attribute && attribute.specified && regex.test(attribute.name)) {
          obj[this.camelize(attribute.name.slice(namespace.length))] = this.deserializeValue(attribute.value);
        }
      }

      return obj;
    },

    checkAttr: function checkAttr($element, namespace, _checkAttr) {
      return $element.is('[' + namespace + _checkAttr + ']');
    },

    setAttr: function setAttr($element, namespace, attr, value) {
      $element[0].setAttribute(this.dasherize(namespace + attr), String(value));
    },

    generateID: function generateID() {
      return '' + globalID++;
    },

    /** Third party functions **/
    // Zepto deserialize function
    deserializeValue: function deserializeValue(value) {
      var num;

      try {
        return value ? value == "true" || (value == "false" ? false : value == "null" ? null : !isNaN(num = Number(value)) ? num : /^[\[\{]/.test(value) ? $.parseJSON(value) : value) : value;
      } catch (e) {
        return value;
      }
    },

    // Zepto camelize function
    camelize: function camelize(str) {
      return str.replace(/-+(.)?/g, function (match, chr) {
        return chr ? chr.toUpperCase() : '';
      });
    },

    // Zepto dasherize function
    dasherize: function dasherize(str) {
      return str.replace(/::/g, '/').replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2').replace(/([a-z\d])([A-Z])/g, '$1_$2').replace(/_/g, '-').toLowerCase();
    },

    warn: function warn() {
      var _window$console;

      if (window.console && 'function' === typeof window.console.warn) (_window$console = window.console).warn.apply(_window$console, arguments);
    },

    warnOnce: function warnOnce(msg) {
      if (!pastWarnings[msg]) {
        pastWarnings[msg] = true;
        this.warn.apply(this, arguments);
      }
    },

    _resetWarnings: function _resetWarnings() {
      pastWarnings = {};
    },

    trimString: function trimString(string) {
      return string.replace(/^\s+|\s+$/g, '');
    },

    parse: {
      date: function date(string) {
        var parsed = string.match(/^(\d{4,})-(\d\d)-(\d\d)$/);
        if (!parsed) return null;

        var _parsed$map = parsed.map(function (x) {
          return parseInt(x, 10);
        });

        var _parsed$map2 = _slicedToArray(_parsed$map, 4);

        var _ = _parsed$map2[0];
        var year = _parsed$map2[1];
        var month = _parsed$map2[2];
        var day = _parsed$map2[3];

        var date = new Date(year, month - 1, day);
        if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) return null;
        return date;
      },
      string: function string(_string) {
        return _string;
      },
      integer: function integer(string) {
        if (isNaN(string)) return null;
        return parseInt(string, 10);
      },
      number: function number(string) {
        if (isNaN(string)) throw null;
        return parseFloat(string);
      },
      'boolean': function _boolean(string) {
        return !/^\s*false\s*$/i.test(string);
      },
      object: function object(string) {
        return Utils__Utils.deserializeValue(string);
      },
      regexp: function regexp(_regexp) {
        var flags = '';

        // Test if RegExp is literal, if not, nothing to be done, otherwise, we need to isolate flags and pattern
        if (/^\/.*\/(?:[gimy]*)$/.test(_regexp)) {
          // Replace the regexp literal string with the first match group: ([gimy]*)
          // If no flag is present, this will be a blank string
          flags = _regexp.replace(/.*\/([gimy]*)$/, '$1');
          // Again, replace the regexp literal string with the first match group:
          // everything excluding the opening and closing slashes and the flags
          _regexp = _regexp.replace(new RegExp('^/(.*?)/' + flags + '$'), '$1');
        } else {
          // Anchor regexp:
          _regexp = '^' + _regexp + '$';
        }
        return new RegExp(_regexp, flags);
      }
    },

    parseRequirement: function parseRequirement(requirementType, string) {
      var converter = this.parse[requirementType || 'string'];
      if (!converter) throw 'Unknown requirement specification: "' + requirementType + '"';
      var converted = converter(string);
      if (converted === null) throw 'Requirement is not a ' + requirementType + ': "' + string + '"';
      return converted;
    },

    namespaceEvents: function namespaceEvents(events, namespace) {
      events = this.trimString(events || '').split(/\s+/);
      if (!events[0]) return '';
      return $.map(events, function (evt) {
        return evt + '.' + namespace;
      }).join(' ');
    },

    difference: function difference(array, remove) {
      // This is O(N^2), should be optimized
      var result = [];
      $.each(array, function (_, elem) {
        if (remove.indexOf(elem) == -1) result.push(elem);
      });
      return result;
    },

    // Alter-ego to native Promise.all, but for jQuery
    all: function all(promises) {
      // jQuery treats $.when() and $.when(singlePromise) differently; let's avoid that and add spurious elements
      return $.when.apply($, _toConsumableArray(promises).concat([42, 42]));
    },

    // Object.create polyfill, see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create#Polyfill
    objectCreate: Object.create || (function () {
      var Object = function Object() {};
      return function (prototype) {
        if (arguments.length > 1) {
          throw Error('Second argument not supported');
        }
        if (typeof prototype != 'object') {
          throw TypeError('Argument must be an object');
        }
        Object.prototype = prototype;
        var result = new Object();
        Object.prototype = null;
        return result;
      };
    })(),

    _SubmitSelector: 'input[type="submit"], button:submit'
  };

  var Utils__default = Utils__Utils;

  // All these options could be overriden and specified directly in DOM using
  // `data-parsley-` default DOM-API
  // eg: `inputs` can be set in DOM using `data-parsley-inputs="input, textarea"`
  // eg: `data-parsley-stop-on-first-failing-constraint="false"`

  var Defaults = {
    // ### General

    // Default data-namespace for DOM API
    namespace: 'data-parsley-',

    // Supported inputs by default
    inputs: 'input, textarea, select',

    // Excluded inputs by default
    excluded: 'input[type=button], input[type=submit], input[type=reset], input[type=hidden]',

    // Stop validating field on highest priority failing constraint
    priorityEnabled: true,

    // ### Field only

    // identifier used to group together inputs (e.g. radio buttons...)
    multiple: null,

    // identifier (or array of identifiers) used to validate only a select group of inputs
    group: null,

    // ### UI
    // Enable\Disable error messages
    uiEnabled: true,

    // Key events threshold before validation
    validationThreshold: 3,

    // Focused field on form validation error. 'first'|'last'|'none'
    focus: 'first',

    // event(s) that will trigger validation before first failure. eg: `input`...
    trigger: false,

    // event(s) that will trigger validation after first failure.
    triggerAfterFailure: 'input',

    // Class that would be added on every failing validation Parsley field
    errorClass: 'parsley-error',

    // Same for success validation
    successClass: 'parsley-success',

    // Return the `$element` that will receive these above success or error classes
    // Could also be (and given directly from DOM) a valid selector like `'#div'`
    classHandler: function classHandler(Field) {},

    // Return the `$element` where errors will be appended
    // Could also be (and given directly from DOM) a valid selector like `'#div'`
    errorsContainer: function errorsContainer(Field) {},

    // ul elem that would receive errors' list
    errorsWrapper: '<ul class="parsley-errors-list"></ul>',

    // li elem that would receive error message
    errorTemplate: '<li></li>'
  };

  var Base = function Base() {
    this.__id__ = Utils__default.generateID();
  };

  Base.prototype = {
    asyncSupport: true, // Deprecated

    _pipeAccordingToValidationResult: function _pipeAccordingToValidationResult() {
      var _this = this;

      var pipe = function pipe() {
        var r = $.Deferred();
        if (true !== _this.validationResult) r.reject();
        return r.resolve().promise();
      };
      return [pipe, pipe];
    },

    actualizeOptions: function actualizeOptions() {
      Utils__default.attr(this.$element, this.options.namespace, this.domOptions);
      if (this.parent && this.parent.actualizeOptions) this.parent.actualizeOptions();
      return this;
    },

    _resetOptions: function _resetOptions(initOptions) {
      this.domOptions = Utils__default.objectCreate(this.parent.options);
      this.options = Utils__default.objectCreate(this.domOptions);
      // Shallow copy of ownProperties of initOptions:
      for (var i in initOptions) {
        if (initOptions.hasOwnProperty(i)) this.options[i] = initOptions[i];
      }
      this.actualizeOptions();
    },

    _listeners: null,

    // Register a callback for the given event name
    // Callback is called with context as the first argument and the `this`
    // The context is the current parsley instance, or window.Parsley if global
    // A return value of `false` will interrupt the calls
    on: function on(name, fn) {
      this._listeners = this._listeners || {};
      var queue = this._listeners[name] = this._listeners[name] || [];
      queue.push(fn);

      return this;
    },

    // Deprecated. Use `on` instead
    subscribe: function subscribe(name, fn) {
      $.listenTo(this, name.toLowerCase(), fn);
    },

    // Unregister a callback (or all if none is given) for the given event name
    off: function off(name, fn) {
      var queue = this._listeners && this._listeners[name];
      if (queue) {
        if (!fn) {
          delete this._listeners[name];
        } else {
          for (var i = queue.length; i--;) if (queue[i] === fn) queue.splice(i, 1);
        }
      }
      return this;
    },

    // Deprecated. Use `off`
    unsubscribe: function unsubscribe(name, fn) {
      $.unsubscribeTo(this, name.toLowerCase());
    },

    // Trigger an event of the given name
    // A return value of `false` interrupts the callback chain
    // Returns false if execution was interrupted
    trigger: function trigger(name, target, extraArg) {
      target = target || this;
      var queue = this._listeners && this._listeners[name];
      var result;
      var parentResult;
      if (queue) {
        for (var i = queue.length; i--;) {
          result = queue[i].call(target, target, extraArg);
          if (result === false) return result;
        }
      }
      if (this.parent) {
        return this.parent.trigger(name, target, extraArg);
      }
      return true;
    },

    asyncIsValid: function asyncIsValid(group, force) {
      Utils__default.warnOnce("asyncIsValid is deprecated; please use whenValid instead");
      return this.whenValid({ group: group, force: force });
    },

    _findRelated: function _findRelated() {
      return this.options.multiple ? this.parent.$element.find('[' + this.options.namespace + 'multiple="' + this.options.multiple + '"]') : this.$element;
    }
  };

  var convertArrayRequirement = function convertArrayRequirement(string, length) {
    var m = string.match(/^\s*\[(.*)\]\s*$/);
    if (!m) throw 'Requirement is not an array: "' + string + '"';
    var values = m[1].split(',').map(Utils__default.trimString);
    if (values.length !== length) throw 'Requirement has ' + values.length + ' values when ' + length + ' are needed';
    return values;
  };

  var convertExtraOptionRequirement = function convertExtraOptionRequirement(requirementSpec, string, extraOptionReader) {
    var main = null;
    var extra = {};
    for (var key in requirementSpec) {
      if (key) {
        var value = extraOptionReader(key);
        if ('string' === typeof value) value = Utils__default.parseRequirement(requirementSpec[key], value);
        extra[key] = value;
      } else {
        main = Utils__default.parseRequirement(requirementSpec[key], string);
      }
    }
    return [main, extra];
  };

  // A Validator needs to implement the methods `validate` and `parseRequirements`

  var Validator = function Validator(spec) {
    $.extend(true, this, spec);
  };

  Validator.prototype = {
    // Returns `true` iff the given `value` is valid according the given requirements.
    validate: function validate(value, requirementFirstArg) {
      if (this.fn) {
        // Legacy style validator

        if (arguments.length > 3) // If more args then value, requirement, instance...
          requirementFirstArg = [].slice.call(arguments, 1, -1); // Skip first arg (value) and last (instance), combining the rest
        return this.fn(value, requirementFirstArg);
      }

      if ($.isArray(value)) {
        if (!this.validateMultiple) throw 'Validator `' + this.name + '` does not handle multiple values';
        return this.validateMultiple.apply(this, arguments);
      } else {
        var instance = arguments[arguments.length - 1];
        if (this.validateDate && instance._isDateInput()) {
          arguments[0] = Utils__default.parse.date(arguments[0]);
          if (arguments[0] === null) return false;
          return this.validateDate.apply(this, arguments);
        }
        if (this.validateNumber) {
          if (isNaN(value)) return false;
          arguments[0] = parseFloat(arguments[0]);
          return this.validateNumber.apply(this, arguments);
        }
        if (this.validateString) {
          return this.validateString.apply(this, arguments);
        }
        throw 'Validator `' + this.name + '` only handles multiple values';
      }
    },

    // Parses `requirements` into an array of arguments,
    // according to `this.requirementType`
    parseRequirements: function parseRequirements(requirements, extraOptionReader) {
      if ('string' !== typeof requirements) {
        // Assume requirement already parsed
        // but make sure we return an array
        return $.isArray(requirements) ? requirements : [requirements];
      }
      var type = this.requirementType;
      if ($.isArray(type)) {
        var values = convertArrayRequirement(requirements, type.length);
        for (var i = 0; i < values.length; i++) values[i] = Utils__default.parseRequirement(type[i], values[i]);
        return values;
      } else if ($.isPlainObject(type)) {
        return convertExtraOptionRequirement(type, requirements, extraOptionReader);
      } else {
        return [Utils__default.parseRequirement(type, requirements)];
      }
    },
    // Defaults:
    requirementType: 'string',

    priority: 2

  };

  var ValidatorRegistry = function ValidatorRegistry(validators, catalog) {
    this.__class__ = 'ValidatorRegistry';

    // Default Parsley locale is en
    this.locale = 'en';

    this.init(validators || {}, catalog || {});
  };

  var typeTesters = {
    email: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i,

    // Follow https://www.w3.org/TR/html5/infrastructure.html#floating-point-numbers
    number: /^-?(\d*\.)?\d+(e[-+]?\d+)?$/i,

    integer: /^-?\d+$/,

    digits: /^\d+$/,

    alphanum: /^\w+$/i,

    date: {
      test: function test(value) {
        return Utils__default.parse.date(value) !== null;
      }
    },

    url: new RegExp("^" +
    // protocol identifier
    "(?:(?:https?|ftp)://)?" + // ** mod: make scheme optional
    // user:pass authentication
    "(?:\\S+(?::\\S*)?@)?" + "(?:" +
    // IP address exclusion
    // private & local networks
    // "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +   // ** mod: allow local networks
    // "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +  // ** mod: allow local networks
    // "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +  // ** mod: allow local networks
    // IP address dotted notation octets
    // excludes loopback network 0.0.0.0
    // excludes reserved space >= 224.0.0.0
    // excludes network & broacast addresses
    // (first & last IP address of each class)
    "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" + "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" + "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" + "|" +
    // host name
    '(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)' +
    // domain name
    '(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*' +
    // TLD identifier
    '(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))' + ")" +
    // port number
    "(?::\\d{2,5})?" +
    // resource path
    "(?:/\\S*)?" + "$", 'i')
  };
  typeTesters.range = typeTesters.number;

  // See http://stackoverflow.com/a/10454560/8279
  var decimalPlaces = function decimalPlaces(num) {
    var match = ('' + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
    if (!match) {
      return 0;
    }
    return Math.max(0,
    // Number of digits right of decimal point.
    (match[1] ? match[1].length : 0) - (
    // Adjust for scientific notation.
    match[2] ? +match[2] : 0));
  };

  // parseArguments('number', ['1', '2']) => [1, 2]
  var ValidatorRegistry__parseArguments = function ValidatorRegistry__parseArguments(type, args) {
    return args.map(Utils__default.parse[type]);
  };
  // operatorToValidator returns a validating function for an operator function, applied to the given type
  var ValidatorRegistry__operatorToValidator = function ValidatorRegistry__operatorToValidator(type, operator) {
    return function (value) {
      for (var _len = arguments.length, requirementsAndInput = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        requirementsAndInput[_key - 1] = arguments[_key];
      }

      requirementsAndInput.pop(); // Get rid of `input` argument
      return operator.apply(undefined, [value].concat(_toConsumableArray(ValidatorRegistry__parseArguments(type, requirementsAndInput))));
    };
  };

  var ValidatorRegistry__comparisonOperator = function ValidatorRegistry__comparisonOperator(operator) {
    return {
      validateDate: ValidatorRegistry__operatorToValidator('date', operator),
      validateNumber: ValidatorRegistry__operatorToValidator('number', operator),
      requirementType: operator.length <= 2 ? 'string' : ['string', 'string'], // Support operators with a 1 or 2 requirement(s)
      priority: 30
    };
  };

  ValidatorRegistry.prototype = {
    init: function init(validators, catalog) {
      this.catalog = catalog;
      // Copy prototype's validators:
      this.validators = $.extend({}, this.validators);

      for (var name in validators) this.addValidator(name, validators[name].fn, validators[name].priority);

      window.Parsley.trigger('parsley:validator:init');
    },

    // Set new messages locale if we have dictionary loaded in ParsleyConfig.i18n
    setLocale: function setLocale(locale) {
      if ('undefined' === typeof this.catalog[locale]) throw new Error(locale + ' is not available in the catalog');

      this.locale = locale;

      return this;
    },

    // Add a new messages catalog for a given locale. Set locale for this catalog if set === `true`
    addCatalog: function addCatalog(locale, messages, set) {
      if ('object' === typeof messages) this.catalog[locale] = messages;

      if (true === set) return this.setLocale(locale);

      return this;
    },

    // Add a specific message for a given constraint in a given locale
    addMessage: function addMessage(locale, name, message) {
      if ('undefined' === typeof this.catalog[locale]) this.catalog[locale] = {};

      this.catalog[locale][name] = message;

      return this;
    },

    // Add messages for a given locale
    addMessages: function addMessages(locale, nameMessageObject) {
      for (var name in nameMessageObject) this.addMessage(locale, name, nameMessageObject[name]);

      return this;
    },

    // Add a new validator
    //
    //    addValidator('custom', {
    //        requirementType: ['integer', 'integer'],
    //        validateString: function(value, from, to) {},
    //        priority: 22,
    //        messages: {
    //          en: "Hey, that's no good",
    //          fr: "Aye aye, pas bon du tout",
    //        }
    //    })
    //
    // Old API was addValidator(name, function, priority)
    //
    addValidator: function addValidator(name, arg1, arg2) {
      if (this.validators[name]) Utils__default.warn('Validator "' + name + '" is already defined.');else if (Defaults.hasOwnProperty(name)) {
        Utils__default.warn('"' + name + '" is a restricted keyword and is not a valid validator name.');
        return;
      }
      return this._setValidator.apply(this, arguments);
    },

    updateValidator: function updateValidator(name, arg1, arg2) {
      if (!this.validators[name]) {
        Utils__default.warn('Validator "' + name + '" is not already defined.');
        return this.addValidator.apply(this, arguments);
      }
      return this._setValidator.apply(this, arguments);
    },

    removeValidator: function removeValidator(name) {
      if (!this.validators[name]) Utils__default.warn('Validator "' + name + '" is not defined.');

      delete this.validators[name];

      return this;
    },

    _setValidator: function _setValidator(name, validator, priority) {
      if ('object' !== typeof validator) {
        // Old style validator, with `fn` and `priority`
        validator = {
          fn: validator,
          priority: priority
        };
      }
      if (!validator.validate) {
        validator = new Validator(validator);
      }
      this.validators[name] = validator;

      for (var locale in validator.messages || {}) this.addMessage(locale, name, validator.messages[locale]);

      return this;
    },

    getErrorMessage: function getErrorMessage(constraint) {
      var message;

      // Type constraints are a bit different, we have to match their requirements too to find right error message
      if ('type' === constraint.name) {
        var typeMessages = this.catalog[this.locale][constraint.name] || {};
        message = typeMessages[constraint.requirements];
      } else message = this.formatMessage(this.catalog[this.locale][constraint.name], constraint.requirements);

      return message || this.catalog[this.locale].defaultMessage || this.catalog.en.defaultMessage;
    },

    // Kind of light `sprintf()` implementation
    formatMessage: function formatMessage(string, parameters) {
      if ('object' === typeof parameters) {
        for (var i in parameters) string = this.formatMessage(string, parameters[i]);

        return string;
      }

      return 'string' === typeof string ? string.replace(/%s/i, parameters) : '';
    },

    // Here is the Parsley default validators list.
    // A validator is an object with the following key values:
    //  - priority: an integer
    //  - requirement: 'string' (default), 'integer', 'number', 'regexp' or an Array of these
    //  - validateString, validateMultiple, validateNumber: functions returning `true`, `false` or a promise
    // Alternatively, a validator can be a function that returns such an object
    //
    validators: {
      notblank: {
        validateString: function validateString(value) {
          return (/\S/.test(value)
          );
        },
        priority: 2
      },
      required: {
        validateMultiple: function validateMultiple(values) {
          return values.length > 0;
        },
        validateString: function validateString(value) {
          return (/\S/.test(value)
          );
        },
        priority: 512
      },
      type: {
        validateString: function validateString(value, type) {
          var _ref = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

          var _ref$step = _ref.step;
          var step = _ref$step === undefined ? 'any' : _ref$step;
          var _ref$base = _ref.base;
          var base = _ref$base === undefined ? 0 : _ref$base;

          var tester = typeTesters[type];
          if (!tester) {
            throw new Error('validator type `' + type + '` is not supported');
          }
          if (!tester.test(value)) return false;
          if ('number' === type) {
            if (!/^any$/i.test(step || '')) {
              var nb = Number(value);
              var decimals = Math.max(decimalPlaces(step), decimalPlaces(base));
              if (decimalPlaces(nb) > decimals) // Value can't have too many decimals
                return false;
              // Be careful of rounding errors by using integers.
              var toInt = function toInt(f) {
                return Math.round(f * Math.pow(10, decimals));
              };
              if ((toInt(nb) - toInt(base)) % toInt(step) != 0) return false;
            }
          }
          return true;
        },
        requirementType: {
          '': 'string',
          step: 'string',
          base: 'number'
        },
        priority: 256
      },
      pattern: {
        validateString: function validateString(value, regexp) {
          return regexp.test(value);
        },
        requirementType: 'regexp',
        priority: 64
      },
      minlength: {
        validateString: function validateString(value, requirement) {
          return value.length >= requirement;
        },
        requirementType: 'integer',
        priority: 30
      },
      maxlength: {
        validateString: function validateString(value, requirement) {
          return value.length <= requirement;
        },
        requirementType: 'integer',
        priority: 30
      },
      length: {
        validateString: function validateString(value, min, max) {
          return value.length >= min && value.length <= max;
        },
        requirementType: ['integer', 'integer'],
        priority: 30
      },
      mincheck: {
        validateMultiple: function validateMultiple(values, requirement) {
          return values.length >= requirement;
        },
        requirementType: 'integer',
        priority: 30
      },
      maxcheck: {
        validateMultiple: function validateMultiple(values, requirement) {
          return values.length <= requirement;
        },
        requirementType: 'integer',
        priority: 30
      },
      check: {
        validateMultiple: function validateMultiple(values, min, max) {
          return values.length >= min && values.length <= max;
        },
        requirementType: ['integer', 'integer'],
        priority: 30
      },
      min: ValidatorRegistry__comparisonOperator(function (value, requirement) {
        return value >= requirement;
      }),
      max: ValidatorRegistry__comparisonOperator(function (value, requirement) {
        return value <= requirement;
      }),
      range: ValidatorRegistry__comparisonOperator(function (value, min, max) {
        return value >= min && value <= max;
      }),
      equalto: {
        validateString: function validateString(value, refOrValue) {
          var $reference = $(refOrValue);
          if ($reference.length) return value === $reference.val();else return value === refOrValue;
        },
        priority: 256
      }
    }
  };

  var UI = {};

  var diffResults = function diffResults(newResult, oldResult, deep) {
    var added = [];
    var kept = [];

    for (var i = 0; i < newResult.length; i++) {
      var found = false;

      for (var j = 0; j < oldResult.length; j++) if (newResult[i].assert.name === oldResult[j].assert.name) {
        found = true;
        break;
      }

      if (found) kept.push(newResult[i]);else added.push(newResult[i]);
    }

    return {
      kept: kept,
      added: added,
      removed: !deep ? diffResults(oldResult, newResult, true).added : []
    };
  };

  UI.Form = {

    _actualizeTriggers: function _actualizeTriggers() {
      var _this2 = this;

      this.$element.on('submit.Parsley', function (evt) {
        _this2.onSubmitValidate(evt);
      });
      this.$element.on('click.Parsley', Utils__default._SubmitSelector, function (evt) {
        _this2.onSubmitButton(evt);
      });

      // UI could be disabled
      if (false === this.options.uiEnabled) return;

      this.$element.attr('novalidate', '');
    },

    focus: function focus() {
      this._focusedField = null;

      if (true === this.validationResult || 'none' === this.options.focus) return null;

      for (var i = 0; i < this.fields.length; i++) {
        var field = this.fields[i];
        if (true !== field.validationResult && field.validationResult.length > 0 && 'undefined' === typeof field.options.noFocus) {
          this._focusedField = field.$element;
          if ('first' === this.options.focus) break;
        }
      }

      if (null === this._focusedField) return null;

      return this._focusedField.focus();
    },

    _destroyUI: function _destroyUI() {
      // Reset all event listeners
      this.$element.off('.Parsley');
    }

  };

  UI.Field = {

    _reflowUI: function _reflowUI() {
      this._buildUI();

      // If this field doesn't have an active UI don't bother doing something
      if (!this._ui) return;

      // Diff between two validation results
      var diff = diffResults(this.validationResult, this._ui.lastValidationResult);

      // Then store current validation result for next reflow
      this._ui.lastValidationResult = this.validationResult;

      // Handle valid / invalid / none field class
      this._manageStatusClass();

      // Add, remove, updated errors messages
      this._manageErrorsMessages(diff);

      // Triggers impl
      this._actualizeTriggers();

      // If field is not valid for the first time, bind keyup trigger to ease UX and quickly inform user
      if ((diff.kept.length || diff.added.length) && !this._failedOnce) {
        this._failedOnce = true;
        this._actualizeTriggers();
      }
    },

    // Returns an array of field's error message(s)
    getErrorsMessages: function getErrorsMessages() {
      // No error message, field is valid
      if (true === this.validationResult) return [];

      var messages = [];

      for (var i = 0; i < this.validationResult.length; i++) messages.push(this.validationResult[i].errorMessage || this._getErrorMessage(this.validationResult[i].assert));

      return messages;
    },

    // It's a goal of Parsley that this method is no longer required [#1073]
    addError: function addError(name) {
      var _ref2 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var message = _ref2.message;
      var assert = _ref2.assert;
      var _ref2$updateClass = _ref2.updateClass;
      var updateClass = _ref2$updateClass === undefined ? true : _ref2$updateClass;

      this._buildUI();
      this._addError(name, { message: message, assert: assert });

      if (updateClass) this._errorClass();
    },

    // It's a goal of Parsley that this method is no longer required [#1073]
    updateError: function updateError(name) {
      var _ref3 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var message = _ref3.message;
      var assert = _ref3.assert;
      var _ref3$updateClass = _ref3.updateClass;
      var updateClass = _ref3$updateClass === undefined ? true : _ref3$updateClass;

      this._buildUI();
      this._updateError(name, { message: message, assert: assert });

      if (updateClass) this._errorClass();
    },

    // It's a goal of Parsley that this method is no longer required [#1073]
    removeError: function removeError(name) {
      var _ref4 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var _ref4$updateClass = _ref4.updateClass;
      var updateClass = _ref4$updateClass === undefined ? true : _ref4$updateClass;

      this._buildUI();
      this._removeError(name);

      // edge case possible here: remove a standard Parsley error that is still failing in this.validationResult
      // but highly improbable cuz' manually removing a well Parsley handled error makes no sense.
      if (updateClass) this._manageStatusClass();
    },

    _manageStatusClass: function _manageStatusClass() {
      if (this.hasConstraints() && this.needsValidation() && true === this.validationResult) this._successClass();else if (this.validationResult.length > 0) this._errorClass();else this._resetClass();
    },

    _manageErrorsMessages: function _manageErrorsMessages(diff) {
      if ('undefined' !== typeof this.options.errorsMessagesDisabled) return;

      // Case where we have errorMessage option that configure an unique field error message, regardless failing validators
      if ('undefined' !== typeof this.options.errorMessage) {
        if (diff.added.length || diff.kept.length) {
          this._insertErrorWrapper();

          if (0 === this._ui.$errorsWrapper.find('.parsley-custom-error-message').length) this._ui.$errorsWrapper.append($(this.options.errorTemplate).addClass('parsley-custom-error-message'));

          return this._ui.$errorsWrapper.addClass('filled').find('.parsley-custom-error-message').html(this.options.errorMessage);
        }

        return this._ui.$errorsWrapper.removeClass('filled').find('.parsley-custom-error-message').remove();
      }

      // Show, hide, update failing constraints messages
      for (var i = 0; i < diff.removed.length; i++) this._removeError(diff.removed[i].assert.name);

      for (i = 0; i < diff.added.length; i++) this._addError(diff.added[i].assert.name, { message: diff.added[i].errorMessage, assert: diff.added[i].assert });

      for (i = 0; i < diff.kept.length; i++) this._updateError(diff.kept[i].assert.name, { message: diff.kept[i].errorMessage, assert: diff.kept[i].assert });
    },

    _addError: function _addError(name, _ref5) {
      var message = _ref5.message;
      var assert = _ref5.assert;

      this._insertErrorWrapper();
      this._ui.$errorsWrapper.addClass('filled').append($(this.options.errorTemplate).addClass('parsley-' + name).html(message || this._getErrorMessage(assert)));
    },

    _updateError: function _updateError(name, _ref6) {
      var message = _ref6.message;
      var assert = _ref6.assert;

      this._ui.$errorsWrapper.addClass('filled').find('.parsley-' + name).html(message || this._getErrorMessage(assert));
    },

    _removeError: function _removeError(name) {
      this._ui.$errorsWrapper.removeClass('filled').find('.parsley-' + name).remove();
    },

    _getErrorMessage: function _getErrorMessage(constraint) {
      var customConstraintErrorMessage = constraint.name + 'Message';

      if ('undefined' !== typeof this.options[customConstraintErrorMessage]) return window.Parsley.formatMessage(this.options[customConstraintErrorMessage], constraint.requirements);

      return window.Parsley.getErrorMessage(constraint);
    },

    _buildUI: function _buildUI() {
      // UI could be already built or disabled
      if (this._ui || false === this.options.uiEnabled) return;

      var _ui = {};

      // Give field its Parsley id in DOM
      this.$element.attr(this.options.namespace + 'id', this.__id__);

      /** Generate important UI elements and store them in this **/
      // $errorClassHandler is the $element that woul have parsley-error and parsley-success classes
      _ui.$errorClassHandler = this._manageClassHandler();

      // $errorsWrapper is a div that would contain the various field errors, it will be appended into $errorsContainer
      _ui.errorsWrapperId = 'parsley-id-' + (this.options.multiple ? 'multiple-' + this.options.multiple : this.__id__);
      _ui.$errorsWrapper = $(this.options.errorsWrapper).attr('id', _ui.errorsWrapperId);

      // ValidationResult UI storage to detect what have changed bwt two validations, and update DOM accordingly
      _ui.lastValidationResult = [];
      _ui.validationInformationVisible = false;

      // Store it in this for later
      this._ui = _ui;
    },

    // Determine which element will have `parsley-error` and `parsley-success` classes
    _manageClassHandler: function _manageClassHandler() {
      // An element selector could be passed through DOM with `data-parsley-class-handler=#foo`
      if ('string' === typeof this.options.classHandler && $(this.options.classHandler).length) return $(this.options.classHandler);

      // Class handled could also be determined by function given in Parsley options
      var $handler = this.options.classHandler.call(this, this);

      // If this function returned a valid existing DOM element, go for it
      if ('undefined' !== typeof $handler && $handler.length) return $handler;

      return this._inputHolder();
    },

    _inputHolder: function _inputHolder() {
      // if simple element (input, texatrea, select...) it will perfectly host the classes and precede the error container
      if (!this.options.multiple || this.$element.is('select')) return this.$element;

      // But if multiple element (radio, checkbox), that would be their parent
      return this.$element.parent();
    },

    _insertErrorWrapper: function _insertErrorWrapper() {
      var $errorsContainer;

      // Nothing to do if already inserted
      if (0 !== this._ui.$errorsWrapper.parent().length) return this._ui.$errorsWrapper.parent();

      if ('string' === typeof this.options.errorsContainer) {
        if ($(this.options.errorsContainer).length) return $(this.options.errorsContainer).append(this._ui.$errorsWrapper);else Utils__default.warn('The errors container `' + this.options.errorsContainer + '` does not exist in DOM');
      } else if ('function' === typeof this.options.errorsContainer) $errorsContainer = this.options.errorsContainer.call(this, this);

      if ('undefined' !== typeof $errorsContainer && $errorsContainer.length) return $errorsContainer.append(this._ui.$errorsWrapper);

      return this._inputHolder().after(this._ui.$errorsWrapper);
    },

    _actualizeTriggers: function _actualizeTriggers() {
      var _this3 = this;

      var $toBind = this._findRelated();
      var trigger;

      // Remove Parsley events already bound on this field
      $toBind.off('.Parsley');
      if (this._failedOnce) $toBind.on(Utils__default.namespaceEvents(this.options.triggerAfterFailure, 'Parsley'), function () {
        _this3._validateIfNeeded();
      });else if (trigger = Utils__default.namespaceEvents(this.options.trigger, 'Parsley')) {
        $toBind.on(trigger, function (event) {
          _this3._validateIfNeeded(event);
        });
      }
    },

    _validateIfNeeded: function _validateIfNeeded(event) {
      var _this4 = this;

      // For keyup, keypress, keydown, input... events that could be a little bit obstrusive
      // do not validate if val length < min threshold on first validation. Once field have been validated once and info
      // about success or failure have been displayed, always validate with this trigger to reflect every yalidation change.
      if (event && /key|input/.test(event.type)) if (!(this._ui && this._ui.validationInformationVisible) && this.getValue().length <= this.options.validationThreshold) return;

      if (this.options.debounce) {
        window.clearTimeout(this._debounced);
        this._debounced = window.setTimeout(function () {
          return _this4.validate();
        }, this.options.debounce);
      } else this.validate();
    },

    _resetUI: function _resetUI() {
      // Reset all event listeners
      this._failedOnce = false;
      this._actualizeTriggers();

      // Nothing to do if UI never initialized for this field
      if ('undefined' === typeof this._ui) return;

      // Reset all errors' li
      this._ui.$errorsWrapper.removeClass('filled').children().remove();

      // Reset validation class
      this._resetClass();

      // Reset validation flags and last validation result
      this._ui.lastValidationResult = [];
      this._ui.validationInformationVisible = false;
    },

    _destroyUI: function _destroyUI() {
      this._resetUI();

      if ('undefined' !== typeof this._ui) this._ui.$errorsWrapper.remove();

      delete this._ui;
    },

    _successClass: function _successClass() {
      this._ui.validationInformationVisible = true;
      this._ui.$errorClassHandler.removeClass(this.options.errorClass).addClass(this.options.successClass);
    },
    _errorClass: function _errorClass() {
      this._ui.validationInformationVisible = true;
      this._ui.$errorClassHandler.removeClass(this.options.successClass).addClass(this.options.errorClass);
    },
    _resetClass: function _resetClass() {
      this._ui.$errorClassHandler.removeClass(this.options.successClass).removeClass(this.options.errorClass);
    }
  };

  var Form = function Form(element, domOptions, options) {
    this.__class__ = 'Form';

    this.$element = $(element);
    this.domOptions = domOptions;
    this.options = options;
    this.parent = window.Parsley;

    this.fields = [];
    this.validationResult = null;
  };

  var Form__statusMapping = { pending: null, resolved: true, rejected: false };

  Form.prototype = {
    onSubmitValidate: function onSubmitValidate(event) {
      var _this5 = this;

      // This is a Parsley generated submit event, do not validate, do not prevent, simply exit and keep normal behavior
      if (true === event.parsley) return;

      // If we didn't come here through a submit button, use the first one in the form
      var $submitSource = this._$submitSource || this.$element.find(Utils__default._SubmitSelector).first();
      this._$submitSource = null;
      this.$element.find('.parsley-synthetic-submit-button').prop('disabled', true);
      if ($submitSource.is('[formnovalidate]')) return;

      var promise = this.whenValidate({ event: event });

      if ('resolved' === promise.state() && false !== this._trigger('submit')) {
        // All good, let event go through. We make this distinction because browsers
        // differ in their handling of `submit` being called from inside a submit event [#1047]
      } else {
          // Rejected or pending: cancel this submit
          event.stopImmediatePropagation();
          event.preventDefault();
          if ('pending' === promise.state()) promise.done(function () {
            _this5._submit($submitSource);
          });
        }
    },

    onSubmitButton: function onSubmitButton(event) {
      this._$submitSource = $(event.currentTarget);
    },
    // internal
    // _submit submits the form, this time without going through the validations.
    // Care must be taken to "fake" the actual submit button being clicked.
    _submit: function _submit($submitSource) {
      if (false === this._trigger('submit')) return;
      // Add submit button's data
      if ($submitSource) {
        var $synthetic = this.$element.find('.parsley-synthetic-submit-button').prop('disabled', false);
        if (0 === $synthetic.length) $synthetic = $('<input class="parsley-synthetic-submit-button" type="hidden">').appendTo(this.$element);
        $synthetic.attr({
          name: $submitSource.attr('name'),
          value: $submitSource.attr('value')
        });
      }

      this.$element.trigger($.extend($.Event('submit'), { parsley: true }));
    },

    // Performs validation on fields while triggering events.
    // @returns `true` if all validations succeeds, `false`
    // if a failure is immediately detected, or `null`
    // if dependant on a promise.
    // Consider using `whenValidate` instead.
    validate: function validate(options) {
      if (arguments.length >= 1 && !$.isPlainObject(options)) {
        Utils__default.warnOnce('Calling validate on a parsley form without passing arguments as an object is deprecated.');

        var _arguments = _slice.call(arguments);

        var group = _arguments[0];
        var force = _arguments[1];
        var event = _arguments[2];

        options = { group: group, force: force, event: event };
      }
      return Form__statusMapping[this.whenValidate(options).state()];
    },

    whenValidate: function whenValidate() {
      var _Utils__default$all$done$fail$always,
          _this6 = this;

      var _ref7 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var group = _ref7.group;
      var force = _ref7.force;
      var event = _ref7.event;

      this.submitEvent = event;
      if (event) {
        this.submitEvent = $.extend({}, event, { preventDefault: function preventDefault() {
            Utils__default.warnOnce("Using `this.submitEvent.preventDefault()` is deprecated; instead, call `this.validationResult = false`");
            _this6.validationResult = false;
          } });
      }
      this.validationResult = true;

      // fire validate event to eventually modify things before every validation
      this._trigger('validate');

      // Refresh form DOM options and form's fields that could have changed
      this._refreshFields();

      var promises = this._withoutReactualizingFormOptions(function () {
        return $.map(_this6.fields, function (field) {
          return field.whenValidate({ force: force, group: group });
        });
      });

      return (_Utils__default$all$done$fail$always = Utils__default.all(promises).done(function () {
        _this6._trigger('success');
      }).fail(function () {
        _this6.validationResult = false;
        _this6.focus();
        _this6._trigger('error');
      }).always(function () {
        _this6._trigger('validated');
      })).pipe.apply(_Utils__default$all$done$fail$always, _toConsumableArray(this._pipeAccordingToValidationResult()));
    },

    // Iterate over refreshed fields, and stop on first failure.
    // Returns `true` if all fields are valid, `false` if a failure is detected
    // or `null` if the result depends on an unresolved promise.
    // Prefer using `whenValid` instead.
    isValid: function isValid(options) {
      if (arguments.length >= 1 && !$.isPlainObject(options)) {
        Utils__default.warnOnce('Calling isValid on a parsley form without passing arguments as an object is deprecated.');

        var _arguments2 = _slice.call(arguments);

        var group = _arguments2[0];
        var force = _arguments2[1];

        options = { group: group, force: force };
      }
      return Form__statusMapping[this.whenValid(options).state()];
    },

    // Iterate over refreshed fields and validate them.
    // Returns a promise.
    // A validation that immediately fails will interrupt the validations.
    whenValid: function whenValid() {
      var _this7 = this;

      var _ref8 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var group = _ref8.group;
      var force = _ref8.force;

      this._refreshFields();

      var promises = this._withoutReactualizingFormOptions(function () {
        return $.map(_this7.fields, function (field) {
          return field.whenValid({ group: group, force: force });
        });
      });
      return Utils__default.all(promises);
    },

    // Reset UI
    reset: function reset() {
      // Form case: emit a reset event for each field
      for (var i = 0; i < this.fields.length; i++) this.fields[i].reset();

      this._trigger('reset');
    },

    // Destroy Parsley instance (+ UI)
    destroy: function destroy() {
      // Field case: emit destroy event to clean UI and then destroy stored instance
      this._destroyUI();

      // Form case: destroy all its fields and then destroy stored instance
      for (var i = 0; i < this.fields.length; i++) this.fields[i].destroy();

      this.$element.removeData('Parsley');
      this._trigger('destroy');
    },

    _refreshFields: function _refreshFields() {
      return this.actualizeOptions()._bindFields();
    },

    _bindFields: function _bindFields() {
      var _this8 = this;

      var oldFields = this.fields;

      this.fields = [];
      this.fieldsMappedById = {};

      this._withoutReactualizingFormOptions(function () {
        _this8.$element.find(_this8.options.inputs).not(_this8.options.excluded).each(function (_, element) {
          var fieldInstance = new window.Parsley.Factory(element, {}, _this8);

          // Only add valid and not excluded `Field` and `FieldMultiple` children
          if (('Field' === fieldInstance.__class__ || 'FieldMultiple' === fieldInstance.__class__) && true !== fieldInstance.options.excluded) {
            var uniqueId = fieldInstance.__class__ + '-' + fieldInstance.__id__;
            if ('undefined' === typeof _this8.fieldsMappedById[uniqueId]) {
              _this8.fieldsMappedById[uniqueId] = fieldInstance;
              _this8.fields.push(fieldInstance);
            }
          }
        });

        $.each(Utils__default.difference(oldFields, _this8.fields), function (_, field) {
          field.reset();
        });
      });
      return this;
    },

    // Internal only.
    // Looping on a form's fields to do validation or similar
    // will trigger reactualizing options on all of them, which
    // in turn will reactualize the form's options.
    // To avoid calling actualizeOptions so many times on the form
    // for nothing, _withoutReactualizingFormOptions temporarily disables
    // the method actualizeOptions on this form while `fn` is called.
    _withoutReactualizingFormOptions: function _withoutReactualizingFormOptions(fn) {
      var oldActualizeOptions = this.actualizeOptions;
      this.actualizeOptions = function () {
        return this;
      };
      var result = fn();
      this.actualizeOptions = oldActualizeOptions;
      return result;
    },

    // Internal only.
    // Shortcut to trigger an event
    // Returns true iff event is not interrupted and default not prevented.
    _trigger: function _trigger(eventName) {
      return this.trigger('form:' + eventName);
    }

  };

  var Constraint = function Constraint(parsleyField, name, requirements, priority, isDomConstraint) {
    var validatorSpec = window.Parsley._validatorRegistry.validators[name];
    var validator = new Validator(validatorSpec);

    $.extend(this, {
      validator: validator,
      name: name,
      requirements: requirements,
      priority: priority || parsleyField.options[name + 'Priority'] || validator.priority,
      isDomConstraint: true === isDomConstraint
    });
    this._parseRequirements(parsleyField.options);
  };

  var capitalize = function capitalize(str) {
    var cap = str[0].toUpperCase();
    return cap + str.slice(1);
  };

  Constraint.prototype = {
    validate: function validate(value, instance) {
      var _validator;

      return (_validator = this.validator).validate.apply(_validator, [value].concat(_toConsumableArray(this.requirementList), [instance]));
    },

    _parseRequirements: function _parseRequirements(options) {
      var _this9 = this;

      this.requirementList = this.validator.parseRequirements(this.requirements, function (key) {
        return options[_this9.name + capitalize(key)];
      });
    }
  };

  var Field = function Field(field, domOptions, options, parsleyFormInstance) {
    this.__class__ = 'Field';

    this.$element = $(field);

    // Set parent if we have one
    if ('undefined' !== typeof parsleyFormInstance) {
      this.parent = parsleyFormInstance;
    }

    this.options = options;
    this.domOptions = domOptions;

    // Initialize some properties
    this.constraints = [];
    this.constraintsByName = {};
    this.validationResult = true;

    // Bind constraints
    this._bindConstraints();
  };

  var parsley_field__statusMapping = { pending: null, resolved: true, rejected: false };

  Field.prototype = {
    // # Public API
    // Validate field and trigger some events for mainly `UI`
    // @returns `true`, an array of the validators that failed, or
    // `null` if validation is not finished. Prefer using whenValidate
    validate: function validate(options) {
      if (arguments.length >= 1 && !$.isPlainObject(options)) {
        Utils__default.warnOnce('Calling validate on a parsley field without passing arguments as an object is deprecated.');
        options = { options: options };
      }
      var promise = this.whenValidate(options);
      if (!promise) // If excluded with `group` option
        return true;
      switch (promise.state()) {
        case 'pending':
          return null;
        case 'resolved':
          return true;
        case 'rejected':
          return this.validationResult;
      }
    },

    // Validate field and trigger some events for mainly `UI`
    // @returns a promise that succeeds only when all validations do
    // or `undefined` if field is not in the given `group`.
    whenValidate: function whenValidate() {
      var _whenValid$always$done$fail$always,
          _this10 = this;

      var _ref9 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var force = _ref9.force;
      var group = _ref9.group;

      // do not validate a field if not the same as given validation group
      this.refreshConstraints();
      if (group && !this._isInGroup(group)) return;

      this.value = this.getValue();

      // Field Validate event. `this.value` could be altered for custom needs
      this._trigger('validate');

      return (_whenValid$always$done$fail$always = this.whenValid({ force: force, value: this.value, _refreshed: true }).always(function () {
        _this10._reflowUI();
      }).done(function () {
        _this10._trigger('success');
      }).fail(function () {
        _this10._trigger('error');
      }).always(function () {
        _this10._trigger('validated');
      })).pipe.apply(_whenValid$always$done$fail$always, _toConsumableArray(this._pipeAccordingToValidationResult()));
    },

    hasConstraints: function hasConstraints() {
      return 0 !== this.constraints.length;
    },

    // An empty optional field does not need validation
    needsValidation: function needsValidation(value) {
      if ('undefined' === typeof value) value = this.getValue();

      // If a field is empty and not required, it is valid
      // Except if `data-parsley-validate-if-empty` explicitely added, useful for some custom validators
      if (!value.length && !this._isRequired() && 'undefined' === typeof this.options.validateIfEmpty) return false;

      return true;
    },

    _isInGroup: function _isInGroup(group) {
      if ($.isArray(this.options.group)) return -1 !== $.inArray(group, this.options.group);
      return this.options.group === group;
    },

    // Just validate field. Do not trigger any event.
    // Returns `true` iff all constraints pass, `false` if there are failures,
    // or `null` if the result can not be determined yet (depends on a promise)
    // See also `whenValid`.
    isValid: function isValid(options) {
      if (arguments.length >= 1 && !$.isPlainObject(options)) {
        Utils__default.warnOnce('Calling isValid on a parsley field without passing arguments as an object is deprecated.');

        var _arguments3 = _slice.call(arguments);

        var force = _arguments3[0];
        var value = _arguments3[1];

        options = { force: force, value: value };
      }
      var promise = this.whenValid(options);
      if (!promise) // Excluded via `group`
        return true;
      return parsley_field__statusMapping[promise.state()];
    },

    // Just validate field. Do not trigger any event.
    // @returns a promise that succeeds only when all validations do
    // or `undefined` if the field is not in the given `group`.
    // The argument `force` will force validation of empty fields.
    // If a `value` is given, it will be validated instead of the value of the input.
    whenValid: function whenValid() {
      var _this11 = this;

      var _ref10 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var _ref10$force = _ref10.force;
      var force = _ref10$force === undefined ? false : _ref10$force;
      var value = _ref10.value;
      var group = _ref10.group;
      var _refreshed = _ref10._refreshed;

      // Recompute options and rebind constraints to have latest changes
      if (!_refreshed) this.refreshConstraints();
      // do not validate a field if not the same as given validation group
      if (group && !this._isInGroup(group)) return;

      this.validationResult = true;

      // A field without constraint is valid
      if (!this.hasConstraints()) return $.when();

      // Value could be passed as argument, needed to add more power to 'field:validate'
      if ('undefined' === typeof value || null === value) value = this.getValue();

      if (!this.needsValidation(value) && true !== force) return $.when();

      var groupedConstraints = this._getGroupedConstraints();
      var promises = [];
      $.each(groupedConstraints, function (_, constraints) {
        // Process one group of constraints at a time, we validate the constraints
        // and combine the promises together.
        var promise = Utils__default.all($.map(constraints, function (constraint) {
          return _this11._validateConstraint(value, constraint);
        }));
        promises.push(promise);
        if (promise.state() === 'rejected') return false; // Interrupt processing if a group has already failed
      });
      return Utils__default.all(promises);
    },

    // @returns a promise
    _validateConstraint: function _validateConstraint(value, constraint) {
      var _this12 = this;

      var result = constraint.validate(value, this);
      // Map false to a failed promise
      if (false === result) result = $.Deferred().reject();
      // Make sure we return a promise and that we record failures
      return Utils__default.all([result]).fail(function (errorMessage) {
        if (!(_this12.validationResult instanceof Array)) _this12.validationResult = [];
        _this12.validationResult.push({
          assert: constraint,
          errorMessage: 'string' === typeof errorMessage && errorMessage
        });
      });
    },

    // @returns Parsley field computed value that could be overrided or configured in DOM
    getValue: function getValue() {
      var value;

      // Value could be overriden in DOM or with explicit options
      if ('function' === typeof this.options.value) value = this.options.value(this);else if ('undefined' !== typeof this.options.value) value = this.options.value;else value = this.$element.val();

      // Handle wrong DOM or configurations
      if ('undefined' === typeof value || null === value) return '';

      return this._handleWhitespace(value);
    },

    // Reset UI
    reset: function reset() {
      this._resetUI();
      return this._trigger('reset');
    },

    // Destroy Parsley instance (+ UI)
    destroy: function destroy() {
      // Field case: emit destroy event to clean UI and then destroy stored instance
      this._destroyUI();
      this.$element.removeData('Parsley');
      this.$element.removeData('FieldMultiple');
      this._trigger('destroy');
    },

    // Actualize options that could have change since previous validation
    // Re-bind accordingly constraints (could be some new, removed or updated)
    refreshConstraints: function refreshConstraints() {
      return this.actualizeOptions()._bindConstraints();
    },

    /**
    * Add a new constraint to a field
    *
    * @param {String}   name
    * @param {Mixed}    requirements      optional
    * @param {Number}   priority          optional
    * @param {Boolean}  isDomConstraint   optional
    */
    addConstraint: function addConstraint(name, requirements, priority, isDomConstraint) {

      if (window.Parsley._validatorRegistry.validators[name]) {
        var constraint = new Constraint(this, name, requirements, priority, isDomConstraint);

        // if constraint already exist, delete it and push new version
        if ('undefined' !== this.constraintsByName[constraint.name]) this.removeConstraint(constraint.name);

        this.constraints.push(constraint);
        this.constraintsByName[constraint.name] = constraint;
      }

      return this;
    },

    // Remove a constraint
    removeConstraint: function removeConstraint(name) {
      for (var i = 0; i < this.constraints.length; i++) if (name === this.constraints[i].name) {
        this.constraints.splice(i, 1);
        break;
      }
      delete this.constraintsByName[name];
      return this;
    },

    // Update a constraint (Remove + re-add)
    updateConstraint: function updateConstraint(name, parameters, priority) {
      return this.removeConstraint(name).addConstraint(name, parameters, priority);
    },

    // # Internals

    // Internal only.
    // Bind constraints from config + options + DOM
    _bindConstraints: function _bindConstraints() {
      var constraints = [];
      var constraintsByName = {};

      // clean all existing DOM constraints to only keep javascript user constraints
      for (var i = 0; i < this.constraints.length; i++) if (false === this.constraints[i].isDomConstraint) {
        constraints.push(this.constraints[i]);
        constraintsByName[this.constraints[i].name] = this.constraints[i];
      }

      this.constraints = constraints;
      this.constraintsByName = constraintsByName;

      // then re-add Parsley DOM-API constraints
      for (var name in this.options) this.addConstraint(name, this.options[name], undefined, true);

      // finally, bind special HTML5 constraints
      return this._bindHtml5Constraints();
    },

    // Internal only.
    // Bind specific HTML5 constraints to be HTML5 compliant
    _bindHtml5Constraints: function _bindHtml5Constraints() {
      // html5 required
      if (this.$element.attr('required')) this.addConstraint('required', true, undefined, true);

      // html5 pattern
      if ('string' === typeof this.$element.attr('pattern')) this.addConstraint('pattern', this.$element.attr('pattern'), undefined, true);

      // range
      if ('undefined' !== typeof this.$element.attr('min') && 'undefined' !== typeof this.$element.attr('max')) this.addConstraint('range', [this.$element.attr('min'), this.$element.attr('max')], undefined, true);

      // HTML5 min
      else if ('undefined' !== typeof this.$element.attr('min')) this.addConstraint('min', this.$element.attr('min'), undefined, true);

        // HTML5 max
        else if ('undefined' !== typeof this.$element.attr('max')) this.addConstraint('max', this.$element.attr('max'), undefined, true);

      // length
      if ('undefined' !== typeof this.$element.attr('minlength') && 'undefined' !== typeof this.$element.attr('maxlength')) this.addConstraint('length', [this.$element.attr('minlength'), this.$element.attr('maxlength')], undefined, true);

      // HTML5 minlength
      else if ('undefined' !== typeof this.$element.attr('minlength')) this.addConstraint('minlength', this.$element.attr('minlength'), undefined, true);

        // HTML5 maxlength
        else if ('undefined' !== typeof this.$element.attr('maxlength')) this.addConstraint('maxlength', this.$element.attr('maxlength'), undefined, true);

      // html5 types
      var type = this.$element.attr('type');

      if ('undefined' === typeof type) return this;

      // Small special case here for HTML5 number: integer validator if step attribute is undefined or an integer value, number otherwise
      if ('number' === type) {
        return this.addConstraint('type', ['number', {
          step: this.$element.attr('step') || '1',
          base: this.$element.attr('min') || this.$element.attr('value')
        }], undefined, true);
        // Regular other HTML5 supported types
      } else if (/^(email|url|range|date)$/i.test(type)) {
          return this.addConstraint('type', type, undefined, true);
        }
      return this;
    },

    // Internal only.
    // Field is required if have required constraint without `false` value
    _isRequired: function _isRequired() {
      if ('undefined' === typeof this.constraintsByName.required) return false;

      return false !== this.constraintsByName.required.requirements;
    },

    // Internal only.
    // Shortcut to trigger an event
    _trigger: function _trigger(eventName) {
      return this.trigger('field:' + eventName);
    },

    // Internal only
    // Handles whitespace in a value
    // Use `data-parsley-whitespace="squish"` to auto squish input value
    // Use `data-parsley-whitespace="trim"` to auto trim input value
    _handleWhitespace: function _handleWhitespace(value) {
      if (true === this.options.trimValue) Utils__default.warnOnce('data-parsley-trim-value="true" is deprecated, please use data-parsley-whitespace="trim"');

      if ('squish' === this.options.whitespace) value = value.replace(/\s{2,}/g, ' ');

      if ('trim' === this.options.whitespace || 'squish' === this.options.whitespace || true === this.options.trimValue) value = Utils__default.trimString(value);

      return value;
    },

    _isDateInput: function _isDateInput() {
      var c = this.constraintsByName.type;
      return c && c.requirements === 'date';
    },

    // Internal only.
    // Returns the constraints, grouped by descending priority.
    // The result is thus an array of arrays of constraints.
    _getGroupedConstraints: function _getGroupedConstraints() {
      if (false === this.options.priorityEnabled) return [this.constraints];

      var groupedConstraints = [];
      var index = {};

      // Create array unique of priorities
      for (var i = 0; i < this.constraints.length; i++) {
        var p = this.constraints[i].priority;
        if (!index[p]) groupedConstraints.push(index[p] = []);
        index[p].push(this.constraints[i]);
      }
      // Sort them by priority DESC
      groupedConstraints.sort(function (a, b) {
        return b[0].priority - a[0].priority;
      });

      return groupedConstraints;
    }

  };

  var parsley_field = Field;

  var Multiple = function Multiple() {
    this.__class__ = 'FieldMultiple';
  };

  Multiple.prototype = {
    // Add new `$element` sibling for multiple field
    addElement: function addElement($element) {
      this.$elements.push($element);

      return this;
    },

    // See `Field.refreshConstraints()`
    refreshConstraints: function refreshConstraints() {
      var fieldConstraints;

      this.constraints = [];

      // Select multiple special treatment
      if (this.$element.is('select')) {
        this.actualizeOptions()._bindConstraints();

        return this;
      }

      // Gather all constraints for each input in the multiple group
      for (var i = 0; i < this.$elements.length; i++) {

        // Check if element have not been dynamically removed since last binding
        if (!$('html').has(this.$elements[i]).length) {
          this.$elements.splice(i, 1);
          continue;
        }

        fieldConstraints = this.$elements[i].data('FieldMultiple').refreshConstraints().constraints;

        for (var j = 0; j < fieldConstraints.length; j++) this.addConstraint(fieldConstraints[j].name, fieldConstraints[j].requirements, fieldConstraints[j].priority, fieldConstraints[j].isDomConstraint);
      }

      return this;
    },

    // See `Field.getValue()`
    getValue: function getValue() {
      // Value could be overriden in DOM
      if ('function' === typeof this.options.value) return this.options.value(this);else if ('undefined' !== typeof this.options.value) return this.options.value;

      // Radio input case
      if (this.$element.is('input[type=radio]')) return this._findRelated().filter(':checked').val() || '';

      // checkbox input case
      if (this.$element.is('input[type=checkbox]')) {
        var values = [];

        this._findRelated().filter(':checked').each(function () {
          values.push($(this).val());
        });

        return values;
      }

      // Select multiple case
      if (this.$element.is('select') && null === this.$element.val()) return [];

      // Default case that should never happen
      return this.$element.val();
    },

    _init: function _init() {
      this.$elements = [this.$element];

      return this;
    }
  };

  var Factory = function Factory(element, options, parsleyFormInstance) {
    this.$element = $(element);

    // If the element has already been bound, returns its saved Parsley instance
    var savedparsleyFormInstance = this.$element.data('Parsley');
    if (savedparsleyFormInstance) {

      // If the saved instance has been bound without a Form parent and there is one given in this call, add it
      if ('undefined' !== typeof parsleyFormInstance && savedparsleyFormInstance.parent === window.Parsley) {
        savedparsleyFormInstance.parent = parsleyFormInstance;
        savedparsleyFormInstance._resetOptions(savedparsleyFormInstance.options);
      }

      if ('object' === typeof options) {
        $.extend(savedparsleyFormInstance.options, options);
      }

      return savedparsleyFormInstance;
    }

    // Parsley must be instantiated with a DOM element or jQuery $element
    if (!this.$element.length) throw new Error('You must bind Parsley on an existing element.');

    if ('undefined' !== typeof parsleyFormInstance && 'Form' !== parsleyFormInstance.__class__) throw new Error('Parent instance must be a Form instance');

    this.parent = parsleyFormInstance || window.Parsley;
    return this.init(options);
  };

  Factory.prototype = {
    init: function init(options) {
      this.__class__ = 'Parsley';
      this.__version__ = '2.7.0';
      this.__id__ = Utils__default.generateID();

      // Pre-compute options
      this._resetOptions(options);

      // A Form instance is obviously a `<form>` element but also every node that is not an input and has the `data-parsley-validate` attribute
      if (this.$element.is('form') || Utils__default.checkAttr(this.$element, this.options.namespace, 'validate') && !this.$element.is(this.options.inputs)) return this.bind('parsleyForm');

      // Every other element is bound as a `Field` or `FieldMultiple`
      return this.isMultiple() ? this.handleMultiple() : this.bind('parsleyField');
    },

    isMultiple: function isMultiple() {
      return this.$element.is('input[type=radio], input[type=checkbox]') || this.$element.is('select') && 'undefined' !== typeof this.$element.attr('multiple');
    },

    // Multiples fields are a real nightmare :(
    // Maybe some refactoring would be appreciated here...
    handleMultiple: function handleMultiple() {
      var _this13 = this;

      var name;
      var multiple;
      var parsleyMultipleInstance;

      // Handle multiple name
      if (this.options.multiple) ; // We already have our 'multiple' identifier
      else if ('undefined' !== typeof this.$element.attr('name') && this.$element.attr('name').length) this.options.multiple = name = this.$element.attr('name');else if ('undefined' !== typeof this.$element.attr('id') && this.$element.attr('id').length) this.options.multiple = this.$element.attr('id');

      // Special select multiple input
      if (this.$element.is('select') && 'undefined' !== typeof this.$element.attr('multiple')) {
        this.options.multiple = this.options.multiple || this.__id__;
        return this.bind('parsleyFieldMultiple');

        // Else for radio / checkboxes, we need a `name` or `data-parsley-multiple` to properly bind it
      } else if (!this.options.multiple) {
          Utils__default.warn('To be bound by Parsley, a radio, a checkbox and a multiple select input must have either a name or a multiple option.', this.$element);
          return this;
        }

      // Remove special chars
      this.options.multiple = this.options.multiple.replace(/(:|\.|\[|\]|\{|\}|\$)/g, '');

      // Add proper `data-parsley-multiple` to siblings if we have a valid multiple name
      if ('undefined' !== typeof name) {
        $('input[name="' + name + '"]').each(function (i, input) {
          if ($(input).is('input[type=radio], input[type=checkbox]')) $(input).attr(_this13.options.namespace + 'multiple', _this13.options.multiple);
        });
      }

      // Check here if we don't already have a related multiple instance saved
      var $previouslyRelated = this._findRelated();
      for (var i = 0; i < $previouslyRelated.length; i++) {
        parsleyMultipleInstance = $($previouslyRelated.get(i)).data('Parsley');
        if ('undefined' !== typeof parsleyMultipleInstance) {

          if (!this.$element.data('FieldMultiple')) {
            parsleyMultipleInstance.addElement(this.$element);
          }

          break;
        }
      }

      // Create a secret Field instance for every multiple field. It will be stored in `data('FieldMultiple')`
      // And will be useful later to access classic `Field` stuff while being in a `FieldMultiple` instance
      this.bind('parsleyField', true);

      return parsleyMultipleInstance || this.bind('parsleyFieldMultiple');
    },

    // Return proper `Form`, `Field` or `FieldMultiple`
    bind: function bind(type, doNotStore) {
      var parsleyInstance;

      switch (type) {
        case 'parsleyForm':
          parsleyInstance = $.extend(new Form(this.$element, this.domOptions, this.options), new Base(), window.ParsleyExtend)._bindFields();
          break;
        case 'parsleyField':
          parsleyInstance = $.extend(new parsley_field(this.$element, this.domOptions, this.options, this.parent), new Base(), window.ParsleyExtend);
          break;
        case 'parsleyFieldMultiple':
          parsleyInstance = $.extend(new parsley_field(this.$element, this.domOptions, this.options, this.parent), new Multiple(), new Base(), window.ParsleyExtend)._init();
          break;
        default:
          throw new Error(type + 'is not a supported Parsley type');
      }

      if (this.options.multiple) Utils__default.setAttr(this.$element, this.options.namespace, 'multiple', this.options.multiple);

      if ('undefined' !== typeof doNotStore) {
        this.$element.data('FieldMultiple', parsleyInstance);

        return parsleyInstance;
      }

      // Store the freshly bound instance in a DOM element for later access using jQuery `data()`
      this.$element.data('Parsley', parsleyInstance);

      // Tell the world we have a new Form or Field instance!
      parsleyInstance._actualizeTriggers();
      parsleyInstance._trigger('init');

      return parsleyInstance;
    }
  };

  var vernums = $.fn.jquery.split('.');
  if (parseInt(vernums[0]) <= 1 && parseInt(vernums[1]) < 8) {
    throw "The loaded version of jQuery is too old. Please upgrade to 1.8.x or better.";
  }
  if (!vernums.forEach) {
    Utils__default.warn('Parsley requires ES5 to run properly. Please include https://github.com/es-shims/es5-shim');
  }
  // Inherit `on`, `off` & `trigger` to Parsley:
  var Parsley = $.extend(new Base(), {
    $element: $(document),
    actualizeOptions: null,
    _resetOptions: null,
    Factory: Factory,
    version: '2.7.0'
  });

  // Supplement Field and Form with Base
  // This way, the constructors will have access to those methods
  $.extend(parsley_field.prototype, UI.Field, Base.prototype);
  $.extend(Form.prototype, UI.Form, Base.prototype);
  // Inherit actualizeOptions and _resetOptions:
  $.extend(Factory.prototype, Base.prototype);

  // ### jQuery API
  // `$('.elem').parsley(options)` or `$('.elem').psly(options)`
  $.fn.parsley = $.fn.psly = function (options) {
    if (this.length > 1) {
      var instances = [];

      this.each(function () {
        instances.push($(this).parsley(options));
      });

      return instances;
    }

    // Return undefined if applied to non existing DOM element
    if (!$(this).length) {
      Utils__default.warn('You must bind Parsley on an existing element.');

      return;
    }

    return new Factory(this, options);
  };

  // ### Field and Form extension
  // Ensure the extension is now defined if it wasn't previously
  if ('undefined' === typeof window.ParsleyExtend) window.ParsleyExtend = {};

  // ### Parsley config
  // Inherit from ParsleyDefault, and copy over any existing values
  Parsley.options = $.extend(Utils__default.objectCreate(Defaults), window.ParsleyConfig);
  window.ParsleyConfig = Parsley.options; // Old way of accessing global options

  // ### Globals
  window.Parsley = window.psly = Parsley;
  Parsley.Utils = Utils__default;
  window.ParsleyUtils = {};
  $.each(Utils__default, function (key, value) {
    if ('function' === typeof value) {
      window.ParsleyUtils[key] = function () {
        Utils__default.warnOnce('Accessing `window.ParsleyUtils` is deprecated. Use `window.Parsley.Utils` instead.');
        return Utils__default[key].apply(Utils__default, arguments);
      };
    }
  });

  // ### Define methods that forward to the registry, and deprecate all access except through window.Parsley
  var registry = window.Parsley._validatorRegistry = new ValidatorRegistry(window.ParsleyConfig.validators, window.ParsleyConfig.i18n);
  window.ParsleyValidator = {};
  $.each('setLocale addCatalog addMessage addMessages getErrorMessage formatMessage addValidator updateValidator removeValidator'.split(' '), function (i, method) {
    window.Parsley[method] = $.proxy(registry, method);
    window.ParsleyValidator[method] = function () {
      var _window$Parsley;

      Utils__default.warnOnce('Accessing the method \'' + method + '\' through Validator is deprecated. Simply call \'window.Parsley.' + method + '(...)\'');
      return (_window$Parsley = window.Parsley)[method].apply(_window$Parsley, arguments);
    };
  });

  // ### UI
  // Deprecated global object
  window.Parsley.UI = UI;
  window.ParsleyUI = {
    removeError: function removeError(instance, name, doNotUpdateClass) {
      var updateClass = true !== doNotUpdateClass;
      Utils__default.warnOnce('Accessing UI is deprecated. Call \'removeError\' on the instance directly. Please comment in issue 1073 as to your need to call this method.');
      return instance.removeError(name, { updateClass: updateClass });
    },
    getErrorsMessages: function getErrorsMessages(instance) {
      Utils__default.warnOnce('Accessing UI is deprecated. Call \'getErrorsMessages\' on the instance directly.');
      return instance.getErrorsMessages();
    }
  };
  $.each('addError updateError'.split(' '), function (i, method) {
    window.ParsleyUI[method] = function (instance, name, message, assert, doNotUpdateClass) {
      var updateClass = true !== doNotUpdateClass;
      Utils__default.warnOnce('Accessing UI is deprecated. Call \'' + method + '\' on the instance directly. Please comment in issue 1073 as to your need to call this method.');
      return instance[method](name, { message: message, assert: assert, updateClass: updateClass });
    };
  });

  // ### PARSLEY auto-binding
  // Prevent it by setting `ParsleyConfig.autoBind` to `false`
  if (false !== window.ParsleyConfig.autoBind) {
    $(function () {
      // Works only on `data-parsley-validate`.
      if ($('[data-parsley-validate]').length) $('[data-parsley-validate]').parsley();
    });
  }

  var o = $({});
  var deprecated = function deprecated() {
    Utils__default.warnOnce("Parsley's pubsub module is deprecated; use the 'on' and 'off' methods on parsley instances or window.Parsley");
  };

  // Returns an event handler that calls `fn` with the arguments it expects
  function adapt(fn, context) {
    // Store to allow unbinding
    if (!fn.parsleyAdaptedCallback) {
      fn.parsleyAdaptedCallback = function () {
        var args = Array.prototype.slice.call(arguments, 0);
        args.unshift(this);
        fn.apply(context || o, args);
      };
    }
    return fn.parsleyAdaptedCallback;
  }

  var eventPrefix = 'parsley:';
  // Converts 'parsley:form:validate' into 'form:validate'
  function eventName(name) {
    if (name.lastIndexOf(eventPrefix, 0) === 0) return name.substr(eventPrefix.length);
    return name;
  }

  // $.listen is deprecated. Use Parsley.on instead.
  $.listen = function (name, callback) {
    var context;
    deprecated();
    if ('object' === typeof arguments[1] && 'function' === typeof arguments[2]) {
      context = arguments[1];
      callback = arguments[2];
    }

    if ('function' !== typeof callback) throw new Error('Wrong parameters');

    window.Parsley.on(eventName(name), adapt(callback, context));
  };

  $.listenTo = function (instance, name, fn) {
    deprecated();
    if (!(instance instanceof parsley_field) && !(instance instanceof Form)) throw new Error('Must give Parsley instance');

    if ('string' !== typeof name || 'function' !== typeof fn) throw new Error('Wrong parameters');

    instance.on(eventName(name), adapt(fn));
  };

  $.unsubscribe = function (name, fn) {
    deprecated();
    if ('string' !== typeof name || 'function' !== typeof fn) throw new Error('Wrong arguments');
    window.Parsley.off(eventName(name), fn.parsleyAdaptedCallback);
  };

  $.unsubscribeTo = function (instance, name) {
    deprecated();
    if (!(instance instanceof parsley_field) && !(instance instanceof Form)) throw new Error('Must give Parsley instance');
    instance.off(eventName(name));
  };

  $.unsubscribeAll = function (name) {
    deprecated();
    window.Parsley.off(eventName(name));
    $('form,input,textarea,select').each(function () {
      var instance = $(this).data('Parsley');
      if (instance) {
        instance.off(eventName(name));
      }
    });
  };

  // $.emit is deprecated. Use jQuery events instead.
  $.emit = function (name, instance) {
    var _instance;

    deprecated();
    var instanceGiven = instance instanceof parsley_field || instance instanceof Form;
    var args = Array.prototype.slice.call(arguments, instanceGiven ? 2 : 1);
    args.unshift(eventName(name));
    if (!instanceGiven) {
      instance = window.Parsley;
    }
    (_instance = instance).trigger.apply(_instance, _toConsumableArray(args));
  };

  var pubsub = {};

  $.extend(true, Parsley, {
    asyncValidators: {
      'default': {
        fn: function fn(xhr) {
          // By default, only status 2xx are deemed successful.
          // Note: we use status instead of state() because responses with status 200
          // but invalid messages (e.g. an empty body for content type set to JSON) will
          // result in state() === 'rejected'.
          return xhr.status >= 200 && xhr.status < 300;
        },
        url: false
      },
      reverse: {
        fn: function fn(xhr) {
          // If reverse option is set, a failing ajax request is considered successful
          return xhr.status < 200 || xhr.status >= 300;
        },
        url: false
      }
    },

    addAsyncValidator: function addAsyncValidator(name, fn, url, options) {
      Parsley.asyncValidators[name] = {
        fn: fn,
        url: url || false,
        options: options || {}
      };

      return this;
    }

  });

  Parsley.addValidator('remote', {
    requirementType: {
      '': 'string',
      'validator': 'string',
      'reverse': 'boolean',
      'options': 'object'
    },

    validateString: function validateString(value, url, options, instance) {
      var data = {};
      var ajaxOptions;
      var csr;
      var validator = options.validator || (true === options.reverse ? 'reverse' : 'default');

      if ('undefined' === typeof Parsley.asyncValidators[validator]) throw new Error('Calling an undefined async validator: `' + validator + '`');

      url = Parsley.asyncValidators[validator].url || url;

      // Fill current value
      if (url.indexOf('{value}') > -1) {
        url = url.replace('{value}', encodeURIComponent(value));
      } else {
        data[instance.$element.attr('name') || instance.$element.attr('id')] = value;
      }

      // Merge options passed in from the function with the ones in the attribute
      var remoteOptions = $.extend(true, options.options || {}, Parsley.asyncValidators[validator].options);

      // All `$.ajax(options)` could be overridden or extended directly from DOM in `data-parsley-remote-options`
      ajaxOptions = $.extend(true, {}, {
        url: url,
        data: data,
        type: 'GET'
      }, remoteOptions);

      // Generate store key based on ajax options
      instance.trigger('field:ajaxoptions', instance, ajaxOptions);

      csr = $.param(ajaxOptions);

      // Initialise querry cache
      if ('undefined' === typeof Parsley._remoteCache) Parsley._remoteCache = {};

      // Try to retrieve stored xhr
      var xhr = Parsley._remoteCache[csr] = Parsley._remoteCache[csr] || $.ajax(ajaxOptions);

      var handleXhr = function handleXhr() {
        var result = Parsley.asyncValidators[validator].fn.call(instance, xhr, url, options);
        if (!result) // Map falsy results to rejected promise
          result = $.Deferred().reject();
        return $.when(result);
      };

      return xhr.then(handleXhr, handleXhr);
    },

    priority: -1
  });

  Parsley.on('form:submit', function () {
    Parsley._remoteCache = {};
  });

  window.ParsleyExtend.addAsyncValidator = function () {
    Utils.warnOnce('Accessing the method `addAsyncValidator` through an instance is deprecated. Simply call `Parsley.addAsyncValidator(...)`');
    return Parsley.addAsyncValidator.apply(Parsley, arguments);
  };

  // This is included with the Parsley library itself,
  // thus there is no use in adding it to your project.
  Parsley.addMessages('en', {
    defaultMessage: "This value seems to be invalid.",
    type: {
      email: "This value should be a valid email.",
      url: "This value should be a valid url.",
      number: "This value should be a valid number.",
      integer: "This value should be a valid integer.",
      digits: "This value should be digits.",
      alphanum: "This value should be alphanumeric."
    },
    notblank: "This value should not be blank.",
    required: "This value is required.",
    pattern: "This value seems to be invalid.",
    min: "This value should be greater than or equal to %s.",
    max: "This value should be lower than or equal to %s.",
    range: "This value should be between %s and %s.",
    minlength: "This value is too short. It should have %s characters or more.",
    maxlength: "This value is too long. It should have %s characters or fewer.",
    length: "This value length is invalid. It should be between %s and %s characters long.",
    mincheck: "You must select at least %s choices.",
    maxcheck: "You must select %s choices or fewer.",
    check: "You must select between %s and %s choices.",
    equalto: "This value should be the same."
  });

  Parsley.setLocale('en');

  /**
   * inputevent - Alleviate browser bugs for input events
   * https://github.com/marcandre/inputevent
   * @version v0.0.3 - (built Thu, Apr 14th 2016, 5:58 pm)
   * @author Marc-Andre Lafortune <github@marc-andre.ca>
   * @license MIT
   */

  function InputEvent() {
    var _this14 = this;

    var globals = window || global;

    // Slightly odd way construct our object. This way methods are force bound.
    // Used to test for duplicate library.
    $.extend(this, {

      // For browsers that do not support isTrusted, assumes event is native.
      isNativeEvent: function isNativeEvent(evt) {
        return evt.originalEvent && evt.originalEvent.isTrusted !== false;
      },

      fakeInputEvent: function fakeInputEvent(evt) {
        if (_this14.isNativeEvent(evt)) {
          $(evt.target).trigger('input');
        }
      },

      misbehaves: function misbehaves(evt) {
        if (_this14.isNativeEvent(evt)) {
          _this14.behavesOk(evt);
          $(document).on('change.inputevent', evt.data.selector, _this14.fakeInputEvent);
          _this14.fakeInputEvent(evt);
        }
      },

      behavesOk: function behavesOk(evt) {
        if (_this14.isNativeEvent(evt)) {
          $(document) // Simply unbinds the testing handler
          .off('input.inputevent', evt.data.selector, _this14.behavesOk).off('change.inputevent', evt.data.selector, _this14.misbehaves);
        }
      },

      // Bind the testing handlers
      install: function install() {
        if (globals.inputEventPatched) {
          return;
        }
        globals.inputEventPatched = '0.0.3';
        var _arr = ['select', 'input[type="checkbox"]', 'input[type="radio"]', 'input[type="file"]'];
        for (var _i = 0; _i < _arr.length; _i++) {
          var selector = _arr[_i];
          $(document).on('input.inputevent', selector, { selector: selector }, _this14.behavesOk).on('change.inputevent', selector, { selector: selector }, _this14.misbehaves);
        }
      },

      uninstall: function uninstall() {
        delete globals.inputEventPatched;
        $(document).off('.inputevent');
      }

    });
  };

  var inputevent = new InputEvent();

  inputevent.install();

  var parsley = Parsley;

  return parsley;
});
//# sourceMappingURL=parsley.js.map