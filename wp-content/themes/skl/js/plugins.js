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

// Aspect Ratio for Vzaar
(function ($) {
  aspectRatio = function () {
  var video = $('.vzaar-video-player');
  var w = video.attr('width');
  var h = video.attr('height');
  // This is the part that does the hard work:
  // height divided by width to calculate the ratio as a fraction,
  // multiply by 100 and concatenate a % sign.
  var ratio = ((h/w) * 100).toFixed(2) + "%";
  $('.videoContainer').css('padding-bottom', ratio);
  }
})(jQuery);

	/*
	     _ _      _       _
	 ___| (_) ___| | __  (_)___
	/ __| | |/ __| |/ /  | / __|
	\__ \ | | (__|   < _ | \__ \
	|___/_|_|\___|_|\_(_)/ |___/
	                   |__/
	
	 Version: 1.6.0
	  Author: Ken Wheeler
	 Website: http://kenwheeler.github.io
	    Docs: http://kenwheeler.github.io/slick
	    Repo: http://github.com/kenwheeler/slick
	  Issues: http://github.com/kenwheeler/slick/issues
	
	 */
	/* global window, document, define, jQuery, setInterval, clearInterval */
	(function(factory) {
	    'use strict';
	    if (typeof define === 'function' && define.amd) {
	        define(['jquery'], factory);
	    } else if (typeof exports !== 'undefined') {
	        module.exports = factory(require('jquery'));
	    } else {
	        factory(jQuery);
	    }
	
	}(function($) {
	    'use strict';
	    var Slick = window.Slick || {};
	
	    Slick = (function() {
	
	        var instanceUid = 0;
	
	        function Slick(element, settings) {
	
	            var _ = this, dataSettings;
	
	            _.defaults = {
	                accessibility: true,
	                adaptiveHeight: false,
	                appendArrows: $(element),
	                appendDots: $(element),
	                arrows: true,
	                asNavFor: null,
	                prevArrow: '<button type="button" data-role="none" class="slick-prev" aria-label="Previous" tabindex="0" role="button">Previous</button>',
	                nextArrow: '<button type="button" data-role="none" class="slick-next" aria-label="Next" tabindex="0" role="button">Next</button>',
	                autoplay: false,
	                autoplaySpeed: 3000,
	                centerMode: false,
	                centerPadding: '50px',
	                cssEase: 'ease',
	                customPaging: function(slider, i) {
	                    return $('<button type="button" data-role="none" role="button" tabindex="0" />').text(i + 1);
	                },
	                dots: false,
	                dotsClass: 'slick-dots',
	                draggable: true,
	                easing: 'linear',
	                edgeFriction: 0.35,
	                fade: false,
	                focusOnSelect: false,
	                infinite: true,
	                initialSlide: 0,
	                lazyLoad: 'ondemand',
	                mobileFirst: false,
	                pauseOnHover: true,
	                pauseOnFocus: true,
	                pauseOnDotsHover: false,
	                respondTo: 'window',
	                responsive: null,
	                rows: 1,
	                rtl: false,
	                slide: '',
	                slidesPerRow: 1,
	                slidesToShow: 1,
	                slidesToScroll: 1,
	                speed: 500,
	                swipe: true,
	                swipeToSlide: false,
	                touchMove: true,
	                touchThreshold: 5,
	                useCSS: true,
	                useTransform: true,
	                variableWidth: false,
	                vertical: false,
	                verticalSwiping: false,
	                waitForAnimate: true,
	                zIndex: 1000
	            };
	
	            _.initials = {
	                animating: false,
	                dragging: false,
	                autoPlayTimer: null,
	                currentDirection: 0,
	                currentLeft: null,
	                currentSlide: 0,
	                direction: 1,
	                $dots: null,
	                listWidth: null,
	                listHeight: null,
	                loadIndex: 0,
	                $nextArrow: null,
	                $prevArrow: null,
	                slideCount: null,
	                slideWidth: null,
	                $slideTrack: null,
	                $slides: null,
	                sliding: false,
	                slideOffset: 0,
	                swipeLeft: null,
	                $list: null,
	                touchObject: {},
	                transformsEnabled: false,
	                unslicked: false
	            };
	
	            $.extend(_, _.initials);
	
	            _.activeBreakpoint = null;
	            _.animType = null;
	            _.animProp = null;
	            _.breakpoints = [];
	            _.breakpointSettings = [];
	            _.cssTransitions = false;
	            _.focussed = false;
	            _.interrupted = false;
	            _.hidden = 'hidden';
	            _.paused = true;
	            _.positionProp = null;
	            _.respondTo = null;
	            _.rowCount = 1;
	            _.shouldClick = true;
	            _.$slider = $(element);
	            _.$slidesCache = null;
	            _.transformType = null;
	            _.transitionType = null;
	            _.visibilityChange = 'visibilitychange';
	            _.windowWidth = 0;
	            _.windowTimer = null;
	
	            dataSettings = $(element).data('slick') || {};
	
	            _.options = $.extend({}, _.defaults, settings, dataSettings);
	
	            _.currentSlide = _.options.initialSlide;
	
	            _.originalSettings = _.options;
	
	            if (typeof document.mozHidden !== 'undefined') {
	                _.hidden = 'mozHidden';
	                _.visibilityChange = 'mozvisibilitychange';
	            } else if (typeof document.webkitHidden !== 'undefined') {
	                _.hidden = 'webkitHidden';
	                _.visibilityChange = 'webkitvisibilitychange';
	            }
	
	            _.autoPlay = $.proxy(_.autoPlay, _);
	            _.autoPlayClear = $.proxy(_.autoPlayClear, _);
	            _.autoPlayIterator = $.proxy(_.autoPlayIterator, _);
	            _.changeSlide = $.proxy(_.changeSlide, _);
	            _.clickHandler = $.proxy(_.clickHandler, _);
	            _.selectHandler = $.proxy(_.selectHandler, _);
	            _.setPosition = $.proxy(_.setPosition, _);
	            _.swipeHandler = $.proxy(_.swipeHandler, _);
	            _.dragHandler = $.proxy(_.dragHandler, _);
	            _.keyHandler = $.proxy(_.keyHandler, _);
	
	            _.instanceUid = instanceUid++;
	
	            // A simple way to check for HTML strings
	            // Strict HTML recognition (must start with <)
	            // Extracted from jQuery v1.11 source
	            _.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/;
	
	
	            _.registerBreakpoints();
	            _.init(true);
	
	        }
	
	        return Slick;
	
	    }());
	
	    Slick.prototype.activateADA = function() {
	        var _ = this;
	
	        _.$slideTrack.find('.slick-active').attr({
	            'aria-hidden': 'false'
	        }).find('a, input, button, select').attr({
	            'tabindex': '0'
	        });
	
	    };
	
	    Slick.prototype.addSlide = Slick.prototype.slickAdd = function(markup, index, addBefore) {
	
	        var _ = this;
	
	        if (typeof(index) === 'boolean') {
	            addBefore = index;
	            index = null;
	        } else if (index < 0 || (index >= _.slideCount)) {
	            return false;
	        }
	
	        _.unload();
	
	        if (typeof(index) === 'number') {
	            if (index === 0 && _.$slides.length === 0) {
	                $(markup).appendTo(_.$slideTrack);
	            } else if (addBefore) {
	                $(markup).insertBefore(_.$slides.eq(index));
	            } else {
	                $(markup).insertAfter(_.$slides.eq(index));
	            }
	        } else {
	            if (addBefore === true) {
	                $(markup).prependTo(_.$slideTrack);
	            } else {
	                $(markup).appendTo(_.$slideTrack);
	            }
	        }
	
	        _.$slides = _.$slideTrack.children(this.options.slide);
	
	        _.$slideTrack.children(this.options.slide).detach();
	
	        _.$slideTrack.append(_.$slides);
	
	        _.$slides.each(function(index, element) {
	            $(element).attr('data-slick-index', index);
	        });
	
	        _.$slidesCache = _.$slides;
	
	        _.reinit();
	
	    };
	
	    Slick.prototype.animateHeight = function() {
	        var _ = this;
	        if (_.options.slidesToShow === 1 && _.options.adaptiveHeight === true && _.options.vertical === false) {
	            var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);
	            _.$list.animate({
	                height: targetHeight
	            }, _.options.speed);
	        }
	    };
	
	    Slick.prototype.animateSlide = function(targetLeft, callback) {
	
	        var animProps = {},
	            _ = this;
	
	        _.animateHeight();
	
	        if (_.options.rtl === true && _.options.vertical === false) {
	            targetLeft = -targetLeft;
	        }
	        if (_.transformsEnabled === false) {
	            if (_.options.vertical === false) {
	                _.$slideTrack.animate({
	                    left: targetLeft
	                }, _.options.speed, _.options.easing, callback);
	            } else {
	                _.$slideTrack.animate({
	                    top: targetLeft
	                }, _.options.speed, _.options.easing, callback);
	            }
	
	        } else {
	
	            if (_.cssTransitions === false) {
	                if (_.options.rtl === true) {
	                    _.currentLeft = -(_.currentLeft);
	                }
	                $({
	                    animStart: _.currentLeft
	                }).animate({
	                    animStart: targetLeft
	                }, {
	                    duration: _.options.speed,
	                    easing: _.options.easing,
	                    step: function(now) {
	                        now = Math.ceil(now);
	                        if (_.options.vertical === false) {
	                            animProps[_.animType] = 'translate(' +
	                                now + 'px, 0px)';
	                            _.$slideTrack.css(animProps);
	                        } else {
	                            animProps[_.animType] = 'translate(0px,' +
	                                now + 'px)';
	                            _.$slideTrack.css(animProps);
	                        }
	                    },
	                    complete: function() {
	                        if (callback) {
	                            callback.call();
	                        }
	                    }
	                });
	
	            } else {
	
	                _.applyTransition();
	                targetLeft = Math.ceil(targetLeft);
	
	                if (_.options.vertical === false) {
	                    animProps[_.animType] = 'translate3d(' + targetLeft + 'px, 0px, 0px)';
	                } else {
	                    animProps[_.animType] = 'translate3d(0px,' + targetLeft + 'px, 0px)';
	                }
	                _.$slideTrack.css(animProps);
	
	                if (callback) {
	                    setTimeout(function() {
	
	                        _.disableTransition();
	
	                        callback.call();
	                    }, _.options.speed);
	                }
	
	            }
	
	        }
	
	    };
	
	    Slick.prototype.getNavTarget = function() {
	
	        var _ = this,
	            asNavFor = _.options.asNavFor;
	
	        if ( asNavFor && asNavFor !== null ) {
	            asNavFor = $(asNavFor).not(_.$slider);
	        }
	
	        return asNavFor;
	
	    };
	
	    Slick.prototype.asNavFor = function(index) {
	
	        var _ = this,
	            asNavFor = _.getNavTarget();
	
	        if ( asNavFor !== null && typeof asNavFor === 'object' ) {
	            asNavFor.each(function() {
	                var target = $(this).slick('getSlick');
	                if(!target.unslicked) {
	                    target.slideHandler(index, true);
	                }
	            });
	        }
	
	    };
	
	    Slick.prototype.applyTransition = function(slide) {
	
	        var _ = this,
	            transition = {};
	
	        if (_.options.fade === false) {
	            transition[_.transitionType] = _.transformType + ' ' + _.options.speed + 'ms ' + _.options.cssEase;
	        } else {
	            transition[_.transitionType] = 'opacity ' + _.options.speed + 'ms ' + _.options.cssEase;
	        }
	
	        if (_.options.fade === false) {
	            _.$slideTrack.css(transition);
	        } else {
	            _.$slides.eq(slide).css(transition);
	        }
	
	    };
	
	    Slick.prototype.autoPlay = function() {
	
	        var _ = this;
	
	        _.autoPlayClear();
	
	        if ( _.slideCount > _.options.slidesToShow ) {
	            _.autoPlayTimer = setInterval( _.autoPlayIterator, _.options.autoplaySpeed );
	        }
	
	    };
	
	    Slick.prototype.autoPlayClear = function() {
	
	        var _ = this;
	
	        if (_.autoPlayTimer) {
	            clearInterval(_.autoPlayTimer);
	        }
	
	    };
	
	    Slick.prototype.autoPlayIterator = function() {
	
	        var _ = this,
	            slideTo = _.currentSlide + _.options.slidesToScroll;
	
	        if ( !_.paused && !_.interrupted && !_.focussed ) {
	
	            if ( _.options.infinite === false ) {
	
	                if ( _.direction === 1 && ( _.currentSlide + 1 ) === ( _.slideCount - 1 )) {
	                    _.direction = 0;
	                }
	
	                else if ( _.direction === 0 ) {
	
	                    slideTo = _.currentSlide - _.options.slidesToScroll;
	
	                    if ( _.currentSlide - 1 === 0 ) {
	                        _.direction = 1;
	                    }
	
	                }
	
	            }
	
	            _.slideHandler( slideTo );
	
	        }
	
	    };
	
	    Slick.prototype.buildArrows = function() {
	
	        var _ = this;
	
	        if (_.options.arrows === true ) {
	
	            _.$prevArrow = $(_.options.prevArrow).addClass('slick-arrow');
	            _.$nextArrow = $(_.options.nextArrow).addClass('slick-arrow');
	
	            if( _.slideCount > _.options.slidesToShow ) {
	
	                _.$prevArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex');
	                _.$nextArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex');
	
	                if (_.htmlExpr.test(_.options.prevArrow)) {
	                    _.$prevArrow.prependTo(_.options.appendArrows);
	                }
	
	                if (_.htmlExpr.test(_.options.nextArrow)) {
	                    _.$nextArrow.appendTo(_.options.appendArrows);
	                }
	
	                if (_.options.infinite !== true) {
	                    _.$prevArrow
	                        .addClass('slick-disabled')
	                        .attr('aria-disabled', 'true');
	                }
	
	            } else {
	
	                _.$prevArrow.add( _.$nextArrow )
	
	                    .addClass('slick-hidden')
	                    .attr({
	                        'aria-disabled': 'true',
	                        'tabindex': '-1'
	                    });
	
	            }
	
	        }
	
	    };
	
	    Slick.prototype.buildDots = function() {
	
	        var _ = this,
	            i, dot;
	
	        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
	
	            _.$slider.addClass('slick-dotted');
	
	            dot = $('<ul />').addClass(_.options.dotsClass);
	
	            for (i = 0; i <= _.getDotCount(); i += 1) {
	                dot.append($('<li />').append(_.options.customPaging.call(this, _, i)));
	            }
	
	            _.$dots = dot.appendTo(_.options.appendDots);
	
	            _.$dots.find('li').first().addClass('slick-active').attr('aria-hidden', 'false');
	
	        }
	
	    };
	
	    Slick.prototype.buildOut = function() {
	
	        var _ = this;
	
	        _.$slides =
	            _.$slider
	                .children( _.options.slide + ':not(.slick-cloned)')
	                .addClass('slick-slide');
	
	        _.slideCount = _.$slides.length;
	
	        _.$slides.each(function(index, element) {
	            $(element)
	                .attr('data-slick-index', index)
	                .data('originalStyling', $(element).attr('style') || '');
	        });
	
	        _.$slider.addClass('slick-slider');
	
	        _.$slideTrack = (_.slideCount === 0) ?
	            $('<div class="slick-track"/>').appendTo(_.$slider) :
	            _.$slides.wrapAll('<div class="slick-track"/>').parent();
	
	        _.$list = _.$slideTrack.wrap(
	            '<div aria-live="polite" class="slick-list"/>').parent();
	        _.$slideTrack.css('opacity', 0);
	
	        if (_.options.centerMode === true || _.options.swipeToSlide === true) {
	            _.options.slidesToScroll = 1;
	        }
	
	        $('img[data-lazy]', _.$slider).not('[src]').addClass('slick-loading');
	
	        _.setupInfinite();
	
	        _.buildArrows();
	
	        _.buildDots();
	
	        _.updateDots();
	
	
	        _.setSlideClasses(typeof _.currentSlide === 'number' ? _.currentSlide : 0);
	
	        if (_.options.draggable === true) {
	            _.$list.addClass('draggable');
	        }
	
	    };
	
	    Slick.prototype.buildRows = function() {
	
	        var _ = this, a, b, c, newSlides, numOfSlides, originalSlides,slidesPerSection;
	
	        newSlides = document.createDocumentFragment();
	        originalSlides = _.$slider.children();
	
	        if(_.options.rows > 1) {
	
	            slidesPerSection = _.options.slidesPerRow * _.options.rows;
	            numOfSlides = Math.ceil(
	                originalSlides.length / slidesPerSection
	            );
	
	            for(a = 0; a < numOfSlides; a++){
	                var slide = document.createElement('div');
	                for(b = 0; b < _.options.rows; b++) {
	                    var row = document.createElement('div');
	                    for(c = 0; c < _.options.slidesPerRow; c++) {
	                        var target = (a * slidesPerSection + ((b * _.options.slidesPerRow) + c));
	                        if (originalSlides.get(target)) {
	                            row.appendChild(originalSlides.get(target));
	                        }
	                    }
	                    slide.appendChild(row);
	                }
	                newSlides.appendChild(slide);
	            }
	
	            _.$slider.empty().append(newSlides);
	            _.$slider.children().children().children()
	                .css({
	                    'width':(100 / _.options.slidesPerRow) + '%',
	                    'display': 'inline-block'
	                });
	
	        }
	
	    };
	
	    Slick.prototype.checkResponsive = function(initial, forceUpdate) {
	
	        var _ = this,
	            breakpoint, targetBreakpoint, respondToWidth, triggerBreakpoint = false;
	        var sliderWidth = _.$slider.width();
	        var windowWidth = window.innerWidth || $(window).width();
	
	        if (_.respondTo === 'window') {
	            respondToWidth = windowWidth;
	        } else if (_.respondTo === 'slider') {
	            respondToWidth = sliderWidth;
	        } else if (_.respondTo === 'min') {
	            respondToWidth = Math.min(windowWidth, sliderWidth);
	        }
	
	        if ( _.options.responsive &&
	            _.options.responsive.length &&
	            _.options.responsive !== null) {
	
	            targetBreakpoint = null;
	
	            for (breakpoint in _.breakpoints) {
	                if (_.breakpoints.hasOwnProperty(breakpoint)) {
	                    if (_.originalSettings.mobileFirst === false) {
	                        if (respondToWidth < _.breakpoints[breakpoint]) {
	                            targetBreakpoint = _.breakpoints[breakpoint];
	                        }
	                    } else {
	                        if (respondToWidth > _.breakpoints[breakpoint]) {
	                            targetBreakpoint = _.breakpoints[breakpoint];
	                        }
	                    }
	                }
	            }
	
	            if (targetBreakpoint !== null) {
	                if (_.activeBreakpoint !== null) {
	                    if (targetBreakpoint !== _.activeBreakpoint || forceUpdate) {
	                        _.activeBreakpoint =
	                            targetBreakpoint;
	                        if (_.breakpointSettings[targetBreakpoint] === 'unslick') {
	                            _.unslick(targetBreakpoint);
	                        } else {
	                            _.options = $.extend({}, _.originalSettings,
	                                _.breakpointSettings[
	                                    targetBreakpoint]);
	                            if (initial === true) {
	                                _.currentSlide = _.options.initialSlide;
	                            }
	                            _.refresh(initial);
	                        }
	                        triggerBreakpoint = targetBreakpoint;
	                    }
	                } else {
	                    _.activeBreakpoint = targetBreakpoint;
	                    if (_.breakpointSettings[targetBreakpoint] === 'unslick') {
	                        _.unslick(targetBreakpoint);
	                    } else {
	                        _.options = $.extend({}, _.originalSettings,
	                            _.breakpointSettings[
	                                targetBreakpoint]);
	                        if (initial === true) {
	                            _.currentSlide = _.options.initialSlide;
	                        }
	                        _.refresh(initial);
	                    }
	                    triggerBreakpoint = targetBreakpoint;
	                }
	            } else {
	                if (_.activeBreakpoint !== null) {
	                    _.activeBreakpoint = null;
	                    _.options = _.originalSettings;
	                    if (initial === true) {
	                        _.currentSlide = _.options.initialSlide;
	                    }
	                    _.refresh(initial);
	                    triggerBreakpoint = targetBreakpoint;
	                }
	            }
	
	            // only trigger breakpoints during an actual break. not on initialize.
	            if( !initial && triggerBreakpoint !== false ) {
	                _.$slider.trigger('breakpoint', [_, triggerBreakpoint]);
	            }
	        }
	
	    };
	
	    Slick.prototype.changeSlide = function(event, dontAnimate) {
	
	        var _ = this,
	            $target = $(event.currentTarget),
	            indexOffset, slideOffset, unevenOffset;
	
	        // If target is a link, prevent default action.
	        if($target.is('a')) {
	            event.preventDefault();
	        }
	
	        // If target is not the <li> element (ie: a child), find the <li>.
	        if(!$target.is('li')) {
	            $target = $target.closest('li');
	        }
	
	        unevenOffset = (_.slideCount % _.options.slidesToScroll !== 0);
	        indexOffset = unevenOffset ? 0 : (_.slideCount - _.currentSlide) % _.options.slidesToScroll;
	
	        switch (event.data.message) {
	
	            case 'previous':
	                slideOffset = indexOffset === 0 ? _.options.slidesToScroll : _.options.slidesToShow - indexOffset;
	                if (_.slideCount > _.options.slidesToShow) {
	                    _.slideHandler(_.currentSlide - slideOffset, false, dontAnimate);
	                }
	                break;
	
	            case 'next':
	                slideOffset = indexOffset === 0 ? _.options.slidesToScroll : indexOffset;
	                if (_.slideCount > _.options.slidesToShow) {
	                    _.slideHandler(_.currentSlide + slideOffset, false, dontAnimate);
	                }
	                break;
	
	            case 'index':
	                var index = event.data.index === 0 ? 0 :
	                    event.data.index || $target.index() * _.options.slidesToScroll;
	
	                _.slideHandler(_.checkNavigable(index), false, dontAnimate);
	                $target.children().trigger('focus');
	                break;
	
	            default:
	                return;
	        }
	
	    };
	
	    Slick.prototype.checkNavigable = function(index) {
	
	        var _ = this,
	            navigables, prevNavigable;
	
	        navigables = _.getNavigableIndexes();
	        prevNavigable = 0;
	        if (index > navigables[navigables.length - 1]) {
	            index = navigables[navigables.length - 1];
	        } else {
	            for (var n in navigables) {
	                if (index < navigables[n]) {
	                    index = prevNavigable;
	                    break;
	                }
	                prevNavigable = navigables[n];
	            }
	        }
	
	        return index;
	    };
	
	    Slick.prototype.cleanUpEvents = function() {
	
	        var _ = this;
	
	        if (_.options.dots && _.$dots !== null) {
	
	            $('li', _.$dots)
	                .off('click.slick', _.changeSlide)
	                .off('mouseenter.slick', $.proxy(_.interrupt, _, true))
	                .off('mouseleave.slick', $.proxy(_.interrupt, _, false));
	
	        }
	
	        _.$slider.off('focus.slick blur.slick');
	
	        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
	            _.$prevArrow && _.$prevArrow.off('click.slick', _.changeSlide);
	            _.$nextArrow && _.$nextArrow.off('click.slick', _.changeSlide);
	        }
	
	        _.$list.off('touchstart.slick mousedown.slick', _.swipeHandler);
	        _.$list.off('touchmove.slick mousemove.slick', _.swipeHandler);
	        _.$list.off('touchend.slick mouseup.slick', _.swipeHandler);
	        _.$list.off('touchcancel.slick mouseleave.slick', _.swipeHandler);
	
	        _.$list.off('click.slick', _.clickHandler);
	
	        $(document).off(_.visibilityChange, _.visibility);
	
	        _.cleanUpSlideEvents();
	
	        if (_.options.accessibility === true) {
	            _.$list.off('keydown.slick', _.keyHandler);
	        }
	
	        if (_.options.focusOnSelect === true) {
	            $(_.$slideTrack).children().off('click.slick', _.selectHandler);
	        }
	
	        $(window).off('orientationchange.slick.slick-' + _.instanceUid, _.orientationChange);
	
	        $(window).off('resize.slick.slick-' + _.instanceUid, _.resize);
	
	        $('[draggable!=true]', _.$slideTrack).off('dragstart', _.preventDefault);
	
	        $(window).off('load.slick.slick-' + _.instanceUid, _.setPosition);
	        $(document).off('ready.slick.slick-' + _.instanceUid, _.setPosition);
	
	    };
	
	    Slick.prototype.cleanUpSlideEvents = function() {
	
	        var _ = this;
	
	        _.$list.off('mouseenter.slick', $.proxy(_.interrupt, _, true));
	        _.$list.off('mouseleave.slick', $.proxy(_.interrupt, _, false));
	
	    };
	
	    Slick.prototype.cleanUpRows = function() {
	
	        var _ = this, originalSlides;
	
	        if(_.options.rows > 1) {
	            originalSlides = _.$slides.children().children();
	            originalSlides.removeAttr('style');
	            _.$slider.empty().append(originalSlides);
	        }
	
	    };
	
	    Slick.prototype.clickHandler = function(event) {
	
	        var _ = this;
	
	        if (_.shouldClick === false) {
	            event.stopImmediatePropagation();
	            event.stopPropagation();
	            event.preventDefault();
	        }
	
	    };
	
	    Slick.prototype.destroy = function(refresh) {
	
	        var _ = this;
	
	        _.autoPlayClear();
	
	        _.touchObject = {};
	
	        _.cleanUpEvents();
	
	        $('.slick-cloned', _.$slider).detach();
	
	        if (_.$dots) {
	            _.$dots.remove();
	        }
	
	
	        if ( _.$prevArrow && _.$prevArrow.length ) {
	
	            _.$prevArrow
	                .removeClass('slick-disabled slick-arrow slick-hidden')
	                .removeAttr('aria-hidden aria-disabled tabindex')
	                .css('display','');
	
	            if ( _.htmlExpr.test( _.options.prevArrow )) {
	                _.$prevArrow.remove();
	            }
	        }
	
	        if ( _.$nextArrow && _.$nextArrow.length ) {
	
	            _.$nextArrow
	                .removeClass('slick-disabled slick-arrow slick-hidden')
	                .removeAttr('aria-hidden aria-disabled tabindex')
	                .css('display','');
	
	            if ( _.htmlExpr.test( _.options.nextArrow )) {
	                _.$nextArrow.remove();
	            }
	
	        }
	
	
	        if (_.$slides) {
	
	            _.$slides
	                .removeClass('slick-slide slick-active slick-center slick-visible slick-current')
	                .removeAttr('aria-hidden')
	                .removeAttr('data-slick-index')
	                .each(function(){
	                    $(this).attr('style', $(this).data('originalStyling'));
	                });
	
	            _.$slideTrack.children(this.options.slide).detach();
	
	            _.$slideTrack.detach();
	
	            _.$list.detach();
	
	            _.$slider.append(_.$slides);
	        }
	
	        _.cleanUpRows();
	
	        _.$slider.removeClass('slick-slider');
	        _.$slider.removeClass('slick-initialized');
	        _.$slider.removeClass('slick-dotted');
	
	        _.unslicked = true;
	
	        if(!refresh) {
	            _.$slider.trigger('destroy', [_]);
	        }
	
	    };
	
	    Slick.prototype.disableTransition = function(slide) {
	
	        var _ = this,
	            transition = {};
	
	        transition[_.transitionType] = '';
	
	        if (_.options.fade === false) {
	            _.$slideTrack.css(transition);
	        } else {
	            _.$slides.eq(slide).css(transition);
	        }
	
	    };
	
	    Slick.prototype.fadeSlide = function(slideIndex, callback) {
	
	        var _ = this;
	
	        if (_.cssTransitions === false) {
	
	            _.$slides.eq(slideIndex).css({
	                zIndex: _.options.zIndex
	            });
	
	            _.$slides.eq(slideIndex).animate({
	                opacity: 1
	            }, _.options.speed, _.options.easing, callback);
	
	        } else {
	
	            _.applyTransition(slideIndex);
	
	            _.$slides.eq(slideIndex).css({
	                opacity: 1,
	                zIndex: _.options.zIndex
	            });
	
	            if (callback) {
	                setTimeout(function() {
	
	                    _.disableTransition(slideIndex);
	
	                    callback.call();
	                }, _.options.speed);
	            }
	
	        }
	
	    };
	
	    Slick.prototype.fadeSlideOut = function(slideIndex) {
	
	        var _ = this;
	
	        if (_.cssTransitions === false) {
	
	            _.$slides.eq(slideIndex).animate({
	                opacity: 0,
	                zIndex: _.options.zIndex - 2
	            }, _.options.speed, _.options.easing);
	
	        } else {
	
	            _.applyTransition(slideIndex);
	
	            _.$slides.eq(slideIndex).css({
	                opacity: 0,
	                zIndex: _.options.zIndex - 2
	            });
	
	        }
	
	    };
	
	    Slick.prototype.filterSlides = Slick.prototype.slickFilter = function(filter) {
	
	        var _ = this;
	
	        if (filter !== null) {
	
	            _.$slidesCache = _.$slides;
	
	            _.unload();
	
	            _.$slideTrack.children(this.options.slide).detach();
	
	            _.$slidesCache.filter(filter).appendTo(_.$slideTrack);
	
	            _.reinit();
	
	        }
	
	    };
	
	    Slick.prototype.focusHandler = function() {
	
	        var _ = this;
	
	        _.$slider
	            .off('focus.slick blur.slick')
	            .on('focus.slick blur.slick',
	                '*:not(.slick-arrow)', function(event) {
	
	            event.stopImmediatePropagation();
	            var $sf = $(this);
	
	            setTimeout(function() {
	
	                if( _.options.pauseOnFocus ) {
	                    _.focussed = $sf.is(':focus');
	                    _.autoPlay();
	                }
	
	            }, 0);
	
	        });
	    };
	
	    Slick.prototype.getCurrent = Slick.prototype.slickCurrentSlide = function() {
	
	        var _ = this;
	        return _.currentSlide;
	
	    };
	
	    Slick.prototype.getDotCount = function() {
	
	        var _ = this;
	
	        var breakPoint = 0;
	        var counter = 0;
	        var pagerQty = 0;
	
	        if (_.options.infinite === true) {
	            while (breakPoint < _.slideCount) {
	                ++pagerQty;
	                breakPoint = counter + _.options.slidesToScroll;
	                counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
	            }
	        } else if (_.options.centerMode === true) {
	            pagerQty = _.slideCount;
	        } else if(!_.options.asNavFor) {
	            pagerQty = 1 + Math.ceil((_.slideCount - _.options.slidesToShow) / _.options.slidesToScroll);
	        }else {
	            while (breakPoint < _.slideCount) {
	                ++pagerQty;
	                breakPoint = counter + _.options.slidesToScroll;
	                counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
	            }
	        }
	
	        return pagerQty - 1;
	
	    };
	
	    Slick.prototype.getLeft = function(slideIndex) {
	
	        var _ = this,
	            targetLeft,
	            verticalHeight,
	            verticalOffset = 0,
	            targetSlide;
	
	        _.slideOffset = 0;
	        verticalHeight = _.$slides.first().outerHeight(true);
	
	        if (_.options.infinite === true) {
	            if (_.slideCount > _.options.slidesToShow) {
	                _.slideOffset = (_.slideWidth * _.options.slidesToShow) * -1;
	                verticalOffset = (verticalHeight * _.options.slidesToShow) * -1;
	            }
	            if (_.slideCount % _.options.slidesToScroll !== 0) {
	                if (slideIndex + _.options.slidesToScroll > _.slideCount && _.slideCount > _.options.slidesToShow) {
	                    if (slideIndex > _.slideCount) {
	                        _.slideOffset = ((_.options.slidesToShow - (slideIndex - _.slideCount)) * _.slideWidth) * -1;
	                        verticalOffset = ((_.options.slidesToShow - (slideIndex - _.slideCount)) * verticalHeight) * -1;
	                    } else {
	                        _.slideOffset = ((_.slideCount % _.options.slidesToScroll) * _.slideWidth) * -1;
	                        verticalOffset = ((_.slideCount % _.options.slidesToScroll) * verticalHeight) * -1;
	                    }
	                }
	            }
	        } else {
	            if (slideIndex + _.options.slidesToShow > _.slideCount) {
	                _.slideOffset = ((slideIndex + _.options.slidesToShow) - _.slideCount) * _.slideWidth;
	                verticalOffset = ((slideIndex + _.options.slidesToShow) - _.slideCount) * verticalHeight;
	            }
	        }
	
	        if (_.slideCount <= _.options.slidesToShow) {
	            _.slideOffset = 0;
	            verticalOffset = 0;
	        }
	
	        if (_.options.centerMode === true && _.options.infinite === true) {
	            _.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2) - _.slideWidth;
	        } else if (_.options.centerMode === true) {
	            _.slideOffset = 0;
	            _.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2);
	        }
	
	        if (_.options.vertical === false) {
	            targetLeft = ((slideIndex * _.slideWidth) * -1) + _.slideOffset;
	        } else {
	            targetLeft = ((slideIndex * verticalHeight) * -1) + verticalOffset;
	        }
	
	        if (_.options.variableWidth === true) {
	
	            if (_.slideCount <= _.options.slidesToShow || _.options.infinite === false) {
	                targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex);
	            } else {
	                targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex + _.options.slidesToShow);
	            }
	
	            if (_.options.rtl === true) {
	                if (targetSlide[0]) {
	                    targetLeft = (_.$slideTrack.width() - targetSlide[0].offsetLeft - targetSlide.width()) * -1;
	                } else {
	                    targetLeft =  0;
	                }
	            } else {
	                targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;
	            }
	
	            if (_.options.centerMode === true) {
	                if (_.slideCount <= _.options.slidesToShow || _.options.infinite === false) {
	                    targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex);
	                } else {
	                    targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex + _.options.slidesToShow + 1);
	                }
	
	                if (_.options.rtl === true) {
	                    if (targetSlide[0]) {
	                        targetLeft = (_.$slideTrack.width() - targetSlide[0].offsetLeft - targetSlide.width()) * -1;
	                    } else {
	                        targetLeft =  0;
	                    }
	                } else {
	                    targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;
	                }
	
	                targetLeft += (_.$list.width() - targetSlide.outerWidth()) / 2;
	            }
	        }
	
	        return targetLeft;
	
	    };
	
	    Slick.prototype.getOption = Slick.prototype.slickGetOption = function(option) {
	
	        var _ = this;
	
	        return _.options[option];
	
	    };
	
	    Slick.prototype.getNavigableIndexes = function() {
	
	        var _ = this,
	            breakPoint = 0,
	            counter = 0,
	            indexes = [],
	            max;
	
	        if (_.options.infinite === false) {
	            max = _.slideCount;
	        } else {
	            breakPoint = _.options.slidesToScroll * -1;
	            counter = _.options.slidesToScroll * -1;
	            max = _.slideCount * 2;
	        }
	
	        while (breakPoint < max) {
	            indexes.push(breakPoint);
	            breakPoint = counter + _.options.slidesToScroll;
	            counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
	        }
	
	        return indexes;
	
	    };
	
	    Slick.prototype.getSlick = function() {
	
	        return this;
	
	    };
	
	    Slick.prototype.getSlideCount = function() {
	
	        var _ = this,
	            slidesTraversed, swipedSlide, centerOffset;
	
	        centerOffset = _.options.centerMode === true ? _.slideWidth * Math.floor(_.options.slidesToShow / 2) : 0;
	
	        if (_.options.swipeToSlide === true) {
	            _.$slideTrack.find('.slick-slide').each(function(index, slide) {
	                if (slide.offsetLeft - centerOffset + ($(slide).outerWidth() / 2) > (_.swipeLeft * -1)) {
	                    swipedSlide = slide;
	                    return false;
	                }
	            });
	
	            slidesTraversed = Math.abs($(swipedSlide).attr('data-slick-index') - _.currentSlide) || 1;
	
	            return slidesTraversed;
	
	        } else {
	            return _.options.slidesToScroll;
	        }
	
	    };
	
	    Slick.prototype.goTo = Slick.prototype.slickGoTo = function(slide, dontAnimate) {
	
	        var _ = this;
	
	        _.changeSlide({
	            data: {
	                message: 'index',
	                index: parseInt(slide)
	            }
	        }, dontAnimate);
	
	    };
	
	    Slick.prototype.init = function(creation) {
	
	        var _ = this;
	
	        if (!$(_.$slider).hasClass('slick-initialized')) {
	
	            $(_.$slider).addClass('slick-initialized');
	
	            _.buildRows();
	            _.buildOut();
	            _.setProps();
	            _.startLoad();
	            _.loadSlider();
	            _.initializeEvents();
	            _.updateArrows();
	            _.updateDots();
	            _.checkResponsive(true);
	            _.focusHandler();
	
	        }
	
	        if (creation) {
	            _.$slider.trigger('init', [_]);
	        }
	
	        if (_.options.accessibility === true) {
	            _.initADA();
	        }
	
	        if ( _.options.autoplay ) {
	
	            _.paused = false;
	            _.autoPlay();
	
	        }
	
	    };
	
	    Slick.prototype.initADA = function() {
	        var _ = this;
	        _.$slides.add(_.$slideTrack.find('.slick-cloned')).attr({
	            'aria-hidden': 'true',
	            'tabindex': '-1'
	        }).find('a, input, button, select').attr({
	            'tabindex': '-1'
	        });
	
	        _.$slideTrack.attr('role', 'listbox');
	
	        _.$slides.not(_.$slideTrack.find('.slick-cloned')).each(function(i) {
	            $(this).attr({
	                'role': 'option',
	                'aria-describedby': 'slick-slide' + _.instanceUid + i + ''
	            });
	        });
	
	        if (_.$dots !== null) {
	            _.$dots.attr('role', 'tablist').find('li').each(function(i) {
	                $(this).attr({
	                    'role': 'presentation',
	                    'aria-selected': 'false',
	                    'aria-controls': 'navigation' + _.instanceUid + i + '',
	                    'id': 'slick-slide' + _.instanceUid + i + ''
	                });
	            })
	                .first().attr('aria-selected', 'true').end()
	                .find('button').attr('role', 'button').end()
	                .closest('div').attr('role', 'toolbar');
	        }
	        _.activateADA();
	
	    };
	
	    Slick.prototype.initArrowEvents = function() {
	
	        var _ = this;
	
	        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
	            _.$prevArrow
	               .off('click.slick')
	               .on('click.slick', {
	                    message: 'previous'
	               }, _.changeSlide);
	            _.$nextArrow
	               .off('click.slick')
	               .on('click.slick', {
	                    message: 'next'
	               }, _.changeSlide);
	        }
	
	    };
	
	    Slick.prototype.initDotEvents = function() {
	
	        var _ = this;
	
	        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
	            $('li', _.$dots).on('click.slick', {
	                message: 'index'
	            }, _.changeSlide);
	        }
	
	        if ( _.options.dots === true && _.options.pauseOnDotsHover === true ) {
	
	            $('li', _.$dots)
	                .on('mouseenter.slick', $.proxy(_.interrupt, _, true))
	                .on('mouseleave.slick', $.proxy(_.interrupt, _, false));
	
	        }
	
	    };
	
	    Slick.prototype.initSlideEvents = function() {
	
	        var _ = this;
	
	        if ( _.options.pauseOnHover ) {
	
	            _.$list.on('mouseenter.slick', $.proxy(_.interrupt, _, true));
	            _.$list.on('mouseleave.slick', $.proxy(_.interrupt, _, false));
	
	        }
	
	    };
	
	    Slick.prototype.initializeEvents = function() {
	
	        var _ = this;
	
	        _.initArrowEvents();
	
	        _.initDotEvents();
	        _.initSlideEvents();
	
	        _.$list.on('touchstart.slick mousedown.slick', {
	            action: 'start'
	        }, _.swipeHandler);
	        _.$list.on('touchmove.slick mousemove.slick', {
	            action: 'move'
	        }, _.swipeHandler);
	        _.$list.on('touchend.slick mouseup.slick', {
	            action: 'end'
	        }, _.swipeHandler);
	        _.$list.on('touchcancel.slick mouseleave.slick', {
	            action: 'end'
	        }, _.swipeHandler);
	
	        _.$list.on('click.slick', _.clickHandler);
	
	        $(document).on(_.visibilityChange, $.proxy(_.visibility, _));
	
	        if (_.options.accessibility === true) {
	            _.$list.on('keydown.slick', _.keyHandler);
	        }
	
	        if (_.options.focusOnSelect === true) {
	            $(_.$slideTrack).children().on('click.slick', _.selectHandler);
	        }
	
	        $(window).on('orientationchange.slick.slick-' + _.instanceUid, $.proxy(_.orientationChange, _));
	
	        $(window).on('resize.slick.slick-' + _.instanceUid, $.proxy(_.resize, _));
	
	        $('[draggable!=true]', _.$slideTrack).on('dragstart', _.preventDefault);
	
	        $(window).on('load.slick.slick-' + _.instanceUid, _.setPosition);
	        $(document).on('ready.slick.slick-' + _.instanceUid, _.setPosition);
	
	    };
	
	    Slick.prototype.initUI = function() {
	
	        var _ = this;
	
	        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
	
	            _.$prevArrow.show();
	            _.$nextArrow.show();
	
	        }
	
	        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
	
	            _.$dots.show();
	
	        }
	
	    };
	
	    Slick.prototype.keyHandler = function(event) {
	
	        var _ = this;
	         //Dont slide if the cursor is inside the form fields and arrow keys are pressed
	        if(!event.target.tagName.match('TEXTAREA|INPUT|SELECT')) {
	            if (event.keyCode === 37 && _.options.accessibility === true) {
	                _.changeSlide({
	                    data: {
	                        message: _.options.rtl === true ? 'next' :  'previous'
	                    }
	                });
	            } else if (event.keyCode === 39 && _.options.accessibility === true) {
	                _.changeSlide({
	                    data: {
	                        message: _.options.rtl === true ? 'previous' : 'next'
	                    }
	                });
	            }
	        }
	
	    };
	
	    Slick.prototype.lazyLoad = function() {
	
	        var _ = this,
	            loadRange, cloneRange, rangeStart, rangeEnd;
	
	        function loadImages(imagesScope) {
	
	            $('img[data-lazy]', imagesScope).each(function() {
	
	                var image = $(this),
	                    imageSource = $(this).attr('data-lazy'),
	                    imageToLoad = document.createElement('img');
	
	                imageToLoad.onload = function() {
	
	                    image
	                        .animate({ opacity: 0 }, 100, function() {
	                            image
	                                .attr('src', imageSource)
	                                .animate({ opacity: 1 }, 200, function() {
	                                    image
	                                        .removeAttr('data-lazy')
	                                        .removeClass('slick-loading');
	                                });
	                            _.$slider.trigger('lazyLoaded', [_, image, imageSource]);
	                        });
	
	                };
	
	                imageToLoad.onerror = function() {
	
	                    image
	                        .removeAttr( 'data-lazy' )
	                        .removeClass( 'slick-loading' )
	                        .addClass( 'slick-lazyload-error' );
	
	                    _.$slider.trigger('lazyLoadError', [ _, image, imageSource ]);
	
	                };
	
	                imageToLoad.src = imageSource;
	
	            });
	
	        }
	
	        if (_.options.centerMode === true) {
	            if (_.options.infinite === true) {
	                rangeStart = _.currentSlide + (_.options.slidesToShow / 2 + 1);
	                rangeEnd = rangeStart + _.options.slidesToShow + 2;
	            } else {
	                rangeStart = Math.max(0, _.currentSlide - (_.options.slidesToShow / 2 + 1));
	                rangeEnd = 2 + (_.options.slidesToShow / 2 + 1) + _.currentSlide;
	            }
	        } else {
	            rangeStart = _.options.infinite ? _.options.slidesToShow + _.currentSlide : _.currentSlide;
	            rangeEnd = Math.ceil(rangeStart + _.options.slidesToShow);
	            if (_.options.fade === true) {
	                if (rangeStart > 0) rangeStart--;
	                if (rangeEnd <= _.slideCount) rangeEnd++;
	            }
	        }
	
	        loadRange = _.$slider.find('.slick-slide').slice(rangeStart, rangeEnd);
	        loadImages(loadRange);
	
	        if (_.slideCount <= _.options.slidesToShow) {
	            cloneRange = _.$slider.find('.slick-slide');
	            loadImages(cloneRange);
	        } else
	        if (_.currentSlide >= _.slideCount - _.options.slidesToShow) {
	            cloneRange = _.$slider.find('.slick-cloned').slice(0, _.options.slidesToShow);
	            loadImages(cloneRange);
	        } else if (_.currentSlide === 0) {
	            cloneRange = _.$slider.find('.slick-cloned').slice(_.options.slidesToShow * -1);
	            loadImages(cloneRange);
	        }
	
	    };
	
	    Slick.prototype.loadSlider = function() {
	
	        var _ = this;
	
	        _.setPosition();
	
	        _.$slideTrack.css({
	            opacity: 1
	        });
	
	        _.$slider.removeClass('slick-loading');
	
	        _.initUI();
	
	        if (_.options.lazyLoad === 'progressive') {
	            _.progressiveLazyLoad();
	        }
	
	    };
	
	    Slick.prototype.next = Slick.prototype.slickNext = function() {
	
	        var _ = this;
	
	        _.changeSlide({
	            data: {
	                message: 'next'
	            }
	        });
	
	    };
	
	    Slick.prototype.orientationChange = function() {
	
	        var _ = this;
	
	        _.checkResponsive();
	        _.setPosition();
	
	    };
	
	    Slick.prototype.pause = Slick.prototype.slickPause = function() {
	
	        var _ = this;
	
	        _.autoPlayClear();
	        _.paused = true;
	
	    };
	
	    Slick.prototype.play = Slick.prototype.slickPlay = function() {
	
	        var _ = this;
	
	        _.autoPlay();
	        _.options.autoplay = true;
	        _.paused = false;
	        _.focussed = false;
	        _.interrupted = false;
	
	    };
	
	    Slick.prototype.postSlide = function(index) {
	
	        var _ = this;
	
	        if( !_.unslicked ) {
	
	            _.$slider.trigger('afterChange', [_, index]);
	
	            _.animating = false;
	
	            _.setPosition();
	
	            _.swipeLeft = null;
	
	            if ( _.options.autoplay ) {
	                _.autoPlay();
	            }
	
	            if (_.options.accessibility === true) {
	                _.initADA();
	            }
	
	        }
	
	    };
	
	    Slick.prototype.prev = Slick.prototype.slickPrev = function() {
	
	        var _ = this;
	
	        _.changeSlide({
	            data: {
	                message: 'previous'
	            }
	        });
	
	    };
	
	    Slick.prototype.preventDefault = function(event) {
	
	        event.preventDefault();
	
	    };
	
	    Slick.prototype.progressiveLazyLoad = function( tryCount ) {
	
	        tryCount = tryCount || 1;
	
	        var _ = this,
	            $imgsToLoad = $( 'img[data-lazy]', _.$slider ),
	            image,
	            imageSource,
	            imageToLoad;
	
	        if ( $imgsToLoad.length ) {
	
	            image = $imgsToLoad.first();
	            imageSource = image.attr('data-lazy');
	            imageToLoad = document.createElement('img');
	
	            imageToLoad.onload = function() {
	
	                image
	                    .attr( 'src', imageSource )
	                    .removeAttr('data-lazy')
	                    .removeClass('slick-loading');
	
	                if ( _.options.adaptiveHeight === true ) {
	                    _.setPosition();
	                }
	
	                _.$slider.trigger('lazyLoaded', [ _, image, imageSource ]);
	                _.progressiveLazyLoad();
	
	            };
	
	            imageToLoad.onerror = function() {
	
	                if ( tryCount < 3 ) {
	
	                    /**
	                     * try to load the image 3 times,
	                     * leave a slight delay so we don't get
	                     * servers blocking the request.
	                     */
	                    setTimeout( function() {
	                        _.progressiveLazyLoad( tryCount + 1 );
	                    }, 500 );
	
	                } else {
	
	                    image
	                        .removeAttr( 'data-lazy' )
	                        .removeClass( 'slick-loading' )
	                        .addClass( 'slick-lazyload-error' );
	
	                    _.$slider.trigger('lazyLoadError', [ _, image, imageSource ]);
	
	                    _.progressiveLazyLoad();
	
	                }
	
	            };
	
	            imageToLoad.src = imageSource;
	
	        } else {
	
	            _.$slider.trigger('allImagesLoaded', [ _ ]);
	
	        }
	
	    };
	
	    Slick.prototype.refresh = function( initializing ) {
	
	        var _ = this, currentSlide, lastVisibleIndex;
	
	        lastVisibleIndex = _.slideCount - _.options.slidesToShow;
	
	        // in non-infinite sliders, we don't want to go past the
	        // last visible index.
	        if( !_.options.infinite && ( _.currentSlide > lastVisibleIndex )) {
	            _.currentSlide = lastVisibleIndex;
	        }
	
	        // if less slides than to show, go to start.
	        if ( _.slideCount <= _.options.slidesToShow ) {
	            _.currentSlide = 0;
	
	        }
	
	        currentSlide = _.currentSlide;
	
	        _.destroy(true);
	
	        $.extend(_, _.initials, { currentSlide: currentSlide });
	
	        _.init();
	
	        if( !initializing ) {
	
	            _.changeSlide({
	                data: {
	                    message: 'index',
	                    index: currentSlide
	                }
	            }, false);
	
	        }
	
	    };
	
	    Slick.prototype.registerBreakpoints = function() {
	
	        var _ = this, breakpoint, currentBreakpoint, l,
	            responsiveSettings = _.options.responsive || null;
	
	        if ( $.type(responsiveSettings) === 'array' && responsiveSettings.length ) {
	
	            _.respondTo = _.options.respondTo || 'window';
	
	            for ( breakpoint in responsiveSettings ) {
	
	                l = _.breakpoints.length-1;
	                currentBreakpoint = responsiveSettings[breakpoint].breakpoint;
	
	                if (responsiveSettings.hasOwnProperty(breakpoint)) {
	
	                    // loop through the breakpoints and cut out any existing
	                    // ones with the same breakpoint number, we don't want dupes.
	                    while( l >= 0 ) {
	                        if( _.breakpoints[l] && _.breakpoints[l] === currentBreakpoint ) {
	                            _.breakpoints.splice(l,1);
	                        }
	                        l--;
	                    }
	
	                    _.breakpoints.push(currentBreakpoint);
	                    _.breakpointSettings[currentBreakpoint] = responsiveSettings[breakpoint].settings;
	
	                }
	
	            }
	
	            _.breakpoints.sort(function(a, b) {
	                return ( _.options.mobileFirst ) ? a-b : b-a;
	            });
	
	        }
	
	    };
	
	    Slick.prototype.reinit = function() {
	
	        var _ = this;
	
	        _.$slides =
	            _.$slideTrack
	                .children(_.options.slide)
	                .addClass('slick-slide');
	
	        _.slideCount = _.$slides.length;
	
	        if (_.currentSlide >= _.slideCount && _.currentSlide !== 0) {
	            _.currentSlide = _.currentSlide - _.options.slidesToScroll;
	        }
	
	        if (_.slideCount <= _.options.slidesToShow) {
	            _.currentSlide = 0;
	        }
	
	        _.registerBreakpoints();
	
	        _.setProps();
	        _.setupInfinite();
	        _.buildArrows();
	        _.updateArrows();
	        _.initArrowEvents();
	        _.buildDots();
	        _.updateDots();
	        _.initDotEvents();
	        _.cleanUpSlideEvents();
	        _.initSlideEvents();
	
	        _.checkResponsive(false, true);
	
	        if (_.options.focusOnSelect === true) {
	            $(_.$slideTrack).children().on('click.slick', _.selectHandler);
	        }
	
	        _.setSlideClasses(typeof _.currentSlide === 'number' ? _.currentSlide : 0);
	
	        _.setPosition();
	        _.focusHandler();
	
	        _.paused = !_.options.autoplay;
	        _.autoPlay();
	
	        _.$slider.trigger('reInit', [_]);
	
	    };
	
	    Slick.prototype.resize = function() {
	
	        var _ = this;
	
	        if ($(window).width() !== _.windowWidth) {
	            clearTimeout(_.windowDelay);
	            _.windowDelay = window.setTimeout(function() {
	                _.windowWidth = $(window).width();
	                _.checkResponsive();
	                if( !_.unslicked ) { _.setPosition(); }
	            }, 50);
	        }
	    };
	
	    Slick.prototype.removeSlide = Slick.prototype.slickRemove = function(index, removeBefore, removeAll) {
	
	        var _ = this;
	
	        if (typeof(index) === 'boolean') {
	            removeBefore = index;
	            index = removeBefore === true ? 0 : _.slideCount - 1;
	        } else {
	            index = removeBefore === true ? --index : index;
	        }
	
	        if (_.slideCount < 1 || index < 0 || index > _.slideCount - 1) {
	            return false;
	        }
	
	        _.unload();
	
	        if (removeAll === true) {
	            _.$slideTrack.children().remove();
	        } else {
	            _.$slideTrack.children(this.options.slide).eq(index).remove();
	        }
	
	        _.$slides = _.$slideTrack.children(this.options.slide);
	
	        _.$slideTrack.children(this.options.slide).detach();
	
	        _.$slideTrack.append(_.$slides);
	
	        _.$slidesCache = _.$slides;
	
	        _.reinit();
	
	    };
	
	    Slick.prototype.setCSS = function(position) {
	
	        var _ = this,
	            positionProps = {},
	            x, y;
	
	        if (_.options.rtl === true) {
	            position = -position;
	        }
	        x = _.positionProp == 'left' ? Math.ceil(position) + 'px' : '0px';
	        y = _.positionProp == 'top' ? Math.ceil(position) + 'px' : '0px';
	
	        positionProps[_.positionProp] = position;
	
	        if (_.transformsEnabled === false) {
	            _.$slideTrack.css(positionProps);
	        } else {
	            positionProps = {};
	            if (_.cssTransitions === false) {
	                positionProps[_.animType] = 'translate(' + x + ', ' + y + ')';
	                _.$slideTrack.css(positionProps);
	            } else {
	                positionProps[_.animType] = 'translate3d(' + x + ', ' + y + ', 0px)';
	                _.$slideTrack.css(positionProps);
	            }
	        }
	
	    };
	
	    Slick.prototype.setDimensions = function() {
	
	        var _ = this;
	
	        if (_.options.vertical === false) {
	            if (_.options.centerMode === true) {
	                _.$list.css({
	                    padding: ('0px ' + _.options.centerPadding)
	                });
	            }
	        } else {
	            _.$list.height(_.$slides.first().outerHeight(true) * _.options.slidesToShow);
	            if (_.options.centerMode === true) {
	                _.$list.css({
	                    padding: (_.options.centerPadding + ' 0px')
	                });
	            }
	        }
	
	        _.listWidth = _.$list.width();
	        _.listHeight = _.$list.height();
	
	
	        if (_.options.vertical === false && _.options.variableWidth === false) {
	            _.slideWidth = Math.ceil(_.listWidth / _.options.slidesToShow);
	            _.$slideTrack.width(Math.ceil((_.slideWidth * _.$slideTrack.children('.slick-slide').length)));
	
	        } else if (_.options.variableWidth === true) {
	            _.$slideTrack.width(5000 * _.slideCount);
	        } else {
	            _.slideWidth = Math.ceil(_.listWidth);
	            _.$slideTrack.height(Math.ceil((_.$slides.first().outerHeight(true) * _.$slideTrack.children('.slick-slide').length)));
	        }
	
	        var offset = _.$slides.first().outerWidth(true) - _.$slides.first().width();
	        if (_.options.variableWidth === false) _.$slideTrack.children('.slick-slide').width(_.slideWidth - offset);
	
	    };
	
	    Slick.prototype.setFade = function() {
	
	        var _ = this,
	            targetLeft;
	
	        _.$slides.each(function(index, element) {
	            targetLeft = (_.slideWidth * index) * -1;
	            if (_.options.rtl === true) {
	                $(element).css({
	                    position: 'relative',
	                    right: targetLeft,
	                    top: 0,
	                    zIndex: _.options.zIndex - 2,
	                    opacity: 0
	                });
	            } else {
	                $(element).css({
	                    position: 'relative',
	                    left: targetLeft,
	                    top: 0,
	                    zIndex: _.options.zIndex - 2,
	                    opacity: 0
	                });
	            }
	        });
	
	        _.$slides.eq(_.currentSlide).css({
	            zIndex: _.options.zIndex - 1,
	            opacity: 1
	        });
	
	    };
	
	    Slick.prototype.setHeight = function() {
	
	        var _ = this;
	
	        if (_.options.slidesToShow === 1 && _.options.adaptiveHeight === true && _.options.vertical === false) {
	            var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);
	            _.$list.css('height', targetHeight);
	        }
	
	    };
	
	    Slick.prototype.setOption =
	    Slick.prototype.slickSetOption = function() {
	
	        /**
	         * accepts arguments in format of:
	         *
	         *  - for changing a single option's value:
	         *     .slick("setOption", option, value, refresh )
	         *
	         *  - for changing a set of responsive options:
	         *     .slick("setOption", 'responsive', [{}, ...], refresh )
	         *
	         *  - for updating multiple values at once (not responsive)
	         *     .slick("setOption", { 'option': value, ... }, refresh )
	         */
	
	        var _ = this, l, item, option, value, refresh = false, type;
	
	        if( $.type( arguments[0] ) === 'object' ) {
	
	            option =  arguments[0];
	            refresh = arguments[1];
	            type = 'multiple';
	
	        } else if ( $.type( arguments[0] ) === 'string' ) {
	
	            option =  arguments[0];
	            value = arguments[1];
	            refresh = arguments[2];
	
	            if ( arguments[0] === 'responsive' && $.type( arguments[1] ) === 'array' ) {
	
	                type = 'responsive';
	
	            } else if ( typeof arguments[1] !== 'undefined' ) {
	
	                type = 'single';
	
	            }
	
	        }
	
	        if ( type === 'single' ) {
	
	            _.options[option] = value;
	
	
	        } else if ( type === 'multiple' ) {
	
	            $.each( option , function( opt, val ) {
	
	                _.options[opt] = val;
	
	            });
	
	
	        } else if ( type === 'responsive' ) {
	
	            for ( item in value ) {
	
	                if( $.type( _.options.responsive ) !== 'array' ) {
	
	                    _.options.responsive = [ value[item] ];
	
	                } else {
	
	                    l = _.options.responsive.length-1;
	
	                    // loop through the responsive object and splice out duplicates.
	                    while( l >= 0 ) {
	
	                        if( _.options.responsive[l].breakpoint === value[item].breakpoint ) {
	
	                            _.options.responsive.splice(l,1);
	
	                        }
	
	                        l--;
	
	                    }
	
	                    _.options.responsive.push( value[item] );
	
	                }
	
	            }
	
	        }
	
	        if ( refresh ) {
	
	            _.unload();
	            _.reinit();
	
	        }
	
	    };
	
	    Slick.prototype.setPosition = function() {
	
	        var _ = this;
	
	        _.setDimensions();
	
	        _.setHeight();
	
	        if (_.options.fade === false) {
	            _.setCSS(_.getLeft(_.currentSlide));
	        } else {
	            _.setFade();
	        }
	
	        _.$slider.trigger('setPosition', [_]);
	
	    };
	
	    Slick.prototype.setProps = function() {
	
	        var _ = this,
	            bodyStyle = document.body.style;
	
	        _.positionProp = _.options.vertical === true ? 'top' : 'left';
	
	        if (_.positionProp === 'top') {
	            _.$slider.addClass('slick-vertical');
	        } else {
	            _.$slider.removeClass('slick-vertical');
	        }
	
	        if (bodyStyle.WebkitTransition !== undefined ||
	            bodyStyle.MozTransition !== undefined ||
	            bodyStyle.msTransition !== undefined) {
	            if (_.options.useCSS === true) {
	                _.cssTransitions = true;
	            }
	        }
	
	        if ( _.options.fade ) {
	            if ( typeof _.options.zIndex === 'number' ) {
	                if( _.options.zIndex < 3 ) {
	                    _.options.zIndex = 3;
	                }
	            } else {
	                _.options.zIndex = _.defaults.zIndex;
	            }
	        }
	
	        if (bodyStyle.OTransform !== undefined) {
	            _.animType = 'OTransform';
	            _.transformType = '-o-transform';
	            _.transitionType = 'OTransition';
	            if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined) _.animType = false;
	        }
	        if (bodyStyle.MozTransform !== undefined) {
	            _.animType = 'MozTransform';
	            _.transformType = '-moz-transform';
	            _.transitionType = 'MozTransition';
	            if (bodyStyle.perspectiveProperty === undefined && bodyStyle.MozPerspective === undefined) _.animType = false;
	        }
	        if (bodyStyle.webkitTransform !== undefined) {
	            _.animType = 'webkitTransform';
	            _.transformType = '-webkit-transform';
	            _.transitionType = 'webkitTransition';
	            if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined) _.animType = false;
	        }
	        if (bodyStyle.msTransform !== undefined) {
	            _.animType = 'msTransform';
	            _.transformType = '-ms-transform';
	            _.transitionType = 'msTransition';
	            if (bodyStyle.msTransform === undefined) _.animType = false;
	        }
	        if (bodyStyle.transform !== undefined && _.animType !== false) {
	            _.animType = 'transform';
	            _.transformType = 'transform';
	            _.transitionType = 'transition';
	        }
	        _.transformsEnabled = _.options.useTransform && (_.animType !== null && _.animType !== false);
	    };
	
	
	    Slick.prototype.setSlideClasses = function(index) {
	
	        var _ = this,
	            centerOffset, allSlides, indexOffset, remainder;
	
	        allSlides = _.$slider
	            .find('.slick-slide')
	            .removeClass('slick-active slick-center slick-current')
	            .attr('aria-hidden', 'true');
	
	        _.$slides
	            .eq(index)
	            .addClass('slick-current');
	
	        if (_.options.centerMode === true) {
	
	            centerOffset = Math.floor(_.options.slidesToShow / 2);
	
	            if (_.options.infinite === true) {
	
	                if (index >= centerOffset && index <= (_.slideCount - 1) - centerOffset) {
	
	                    _.$slides
	                        .slice(index - centerOffset, index + centerOffset + 1)
	                        .addClass('slick-active')
	                        .attr('aria-hidden', 'false');
	
	                } else {
	
	                    indexOffset = _.options.slidesToShow + index;
	                    allSlides
	                        .slice(indexOffset - centerOffset + 1, indexOffset + centerOffset + 2)
	                        .addClass('slick-active')
	                        .attr('aria-hidden', 'false');
	
	                }
	
	                if (index === 0) {
	
	                    allSlides
	                        .eq(allSlides.length - 1 - _.options.slidesToShow)
	                        .addClass('slick-center');
	
	                } else if (index === _.slideCount - 1) {
	
	                    allSlides
	                        .eq(_.options.slidesToShow)
	                        .addClass('slick-center');
	
	                }
	
	            }
	
	            _.$slides
	                .eq(index)
	                .addClass('slick-center');
	
	        } else {
	
	            if (index >= 0 && index <= (_.slideCount - _.options.slidesToShow)) {
	
	                _.$slides
	                    .slice(index, index + _.options.slidesToShow)
	                    .addClass('slick-active')
	                    .attr('aria-hidden', 'false');
	
	            } else if (allSlides.length <= _.options.slidesToShow) {
	
	                allSlides
	                    .addClass('slick-active')
	                    .attr('aria-hidden', 'false');
	
	            } else {
	
	                remainder = _.slideCount % _.options.slidesToShow;
	                indexOffset = _.options.infinite === true ? _.options.slidesToShow + index : index;
	
	                if (_.options.slidesToShow == _.options.slidesToScroll && (_.slideCount - index) < _.options.slidesToShow) {
	
	                    allSlides
	                        .slice(indexOffset - (_.options.slidesToShow - remainder), indexOffset + remainder)
	                        .addClass('slick-active')
	                        .attr('aria-hidden', 'false');
	
	                } else {
	
	                    allSlides
	                        .slice(indexOffset, indexOffset + _.options.slidesToShow)
	                        .addClass('slick-active')
	                        .attr('aria-hidden', 'false');
	
	                }
	
	            }
	
	        }
	
	        if (_.options.lazyLoad === 'ondemand') {
	            _.lazyLoad();
	        }
	
	    };
	
	    Slick.prototype.setupInfinite = function() {
	
	        var _ = this,
	            i, slideIndex, infiniteCount;
	
	        if (_.options.fade === true) {
	            _.options.centerMode = false;
	        }
	
	        if (_.options.infinite === true && _.options.fade === false) {
	
	            slideIndex = null;
	
	            if (_.slideCount > _.options.slidesToShow) {
	
	                if (_.options.centerMode === true) {
	                    infiniteCount = _.options.slidesToShow + 1;
	                } else {
	                    infiniteCount = _.options.slidesToShow;
	                }
	
	                for (i = _.slideCount; i > (_.slideCount -
	                        infiniteCount); i -= 1) {
	                    slideIndex = i - 1;
	                    $(_.$slides[slideIndex]).clone(true).attr('id', '')
	                        .attr('data-slick-index', slideIndex - _.slideCount)
	                        .prependTo(_.$slideTrack).addClass('slick-cloned');
	                }
	                for (i = 0; i < infiniteCount; i += 1) {
	                    slideIndex = i;
	                    $(_.$slides[slideIndex]).clone(true).attr('id', '')
	                        .attr('data-slick-index', slideIndex + _.slideCount)
	                        .appendTo(_.$slideTrack).addClass('slick-cloned');
	                }
	                _.$slideTrack.find('.slick-cloned').find('[id]').each(function() {
	                    $(this).attr('id', '');
	                });
	
	            }
	
	        }
	
	    };
	
	    Slick.prototype.interrupt = function( toggle ) {
	
	        var _ = this;
	
	        if( !toggle ) {
	            _.autoPlay();
	        }
	        _.interrupted = toggle;
	
	    };
	
	    Slick.prototype.selectHandler = function(event) {
	
	        var _ = this;
	
	        var targetElement =
	            $(event.target).is('.slick-slide') ?
	                $(event.target) :
	                $(event.target).parents('.slick-slide');
	
	        var index = parseInt(targetElement.attr('data-slick-index'));
	
	        if (!index) index = 0;
	
	        if (_.slideCount <= _.options.slidesToShow) {
	
	            _.setSlideClasses(index);
	            _.asNavFor(index);
	            return;
	
	        }
	
	        _.slideHandler(index);
	
	    };
	
	    Slick.prototype.slideHandler = function(index, sync, dontAnimate) {
	
	        var targetSlide, animSlide, oldSlide, slideLeft, targetLeft = null,
	            _ = this, navTarget;
	
	        sync = sync || false;
	
	        if (_.animating === true && _.options.waitForAnimate === true) {
	            return;
	        }
	
	        if (_.options.fade === true && _.currentSlide === index) {
	            return;
	        }
	
	        if (_.slideCount <= _.options.slidesToShow) {
	            return;
	        }
	
	        if (sync === false) {
	            _.asNavFor(index);
	        }
	
	        targetSlide = index;
	        targetLeft = _.getLeft(targetSlide);
	        slideLeft = _.getLeft(_.currentSlide);
	
	        _.currentLeft = _.swipeLeft === null ? slideLeft : _.swipeLeft;
	
	        if (_.options.infinite === false && _.options.centerMode === false && (index < 0 || index > _.getDotCount() * _.options.slidesToScroll)) {
	            if (_.options.fade === false) {
	                targetSlide = _.currentSlide;
	                if (dontAnimate !== true) {
	                    _.animateSlide(slideLeft, function() {
	                        _.postSlide(targetSlide);
	                    });
	                } else {
	                    _.postSlide(targetSlide);
	                }
	            }
	            return;
	        } else if (_.options.infinite === false && _.options.centerMode === true && (index < 0 || index > (_.slideCount - _.options.slidesToScroll))) {
	            if (_.options.fade === false) {
	                targetSlide = _.currentSlide;
	                if (dontAnimate !== true) {
	                    _.animateSlide(slideLeft, function() {
	                        _.postSlide(targetSlide);
	                    });
	                } else {
	                    _.postSlide(targetSlide);
	                }
	            }
	            return;
	        }
	
	        if ( _.options.autoplay ) {
	            clearInterval(_.autoPlayTimer);
	        }
	
	        if (targetSlide < 0) {
	            if (_.slideCount % _.options.slidesToScroll !== 0) {
	                animSlide = _.slideCount - (_.slideCount % _.options.slidesToScroll);
	            } else {
	                animSlide = _.slideCount + targetSlide;
	            }
	        } else if (targetSlide >= _.slideCount) {
	            if (_.slideCount % _.options.slidesToScroll !== 0) {
	                animSlide = 0;
	            } else {
	                animSlide = targetSlide - _.slideCount;
	            }
	        } else {
	            animSlide = targetSlide;
	        }
	
	        _.animating = true;
	
	        _.$slider.trigger('beforeChange', [_, _.currentSlide, animSlide]);
	
	        oldSlide = _.currentSlide;
	        _.currentSlide = animSlide;
	
	        _.setSlideClasses(_.currentSlide);
	
	        if ( _.options.asNavFor ) {
	
	            navTarget = _.getNavTarget();
	            navTarget = navTarget.slick('getSlick');
	
	            if ( navTarget.slideCount <= navTarget.options.slidesToShow ) {
	                navTarget.setSlideClasses(_.currentSlide);
	            }
	
	        }
	
	        _.updateDots();
	        _.updateArrows();
	
	        if (_.options.fade === true) {
	            if (dontAnimate !== true) {
	
	                _.fadeSlideOut(oldSlide);
	
	                _.fadeSlide(animSlide, function() {
	                    _.postSlide(animSlide);
	                });
	
	            } else {
	                _.postSlide(animSlide);
	            }
	            _.animateHeight();
	            return;
	        }
	
	        if (dontAnimate !== true) {
	            _.animateSlide(targetLeft, function() {
	                _.postSlide(animSlide);
	            });
	        } else {
	            _.postSlide(animSlide);
	        }
	
	    };
	
	    Slick.prototype.startLoad = function() {
	
	        var _ = this;
	
	        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
	
	            _.$prevArrow.hide();
	            _.$nextArrow.hide();
	
	        }
	
	        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
	
	            _.$dots.hide();
	
	        }
	
	        _.$slider.addClass('slick-loading');
	
	    };
	
	    Slick.prototype.swipeDirection = function() {
	
	        var xDist, yDist, r, swipeAngle, _ = this;
	
	        xDist = _.touchObject.startX - _.touchObject.curX;
	        yDist = _.touchObject.startY - _.touchObject.curY;
	        r = Math.atan2(yDist, xDist);
	
	        swipeAngle = Math.round(r * 180 / Math.PI);
	        if (swipeAngle < 0) {
	            swipeAngle = 360 - Math.abs(swipeAngle);
	        }
	
	        if ((swipeAngle <= 45) && (swipeAngle >= 0)) {
	            return (_.options.rtl === false ? 'left' : 'right');
	        }
	        if ((swipeAngle <= 360) && (swipeAngle >= 315)) {
	            return (_.options.rtl === false ? 'left' : 'right');
	        }
	        if ((swipeAngle >= 135) && (swipeAngle <= 225)) {
	            return (_.options.rtl === false ? 'right' : 'left');
	        }
	        if (_.options.verticalSwiping === true) {
	            if ((swipeAngle >= 35) && (swipeAngle <= 135)) {
	                return 'down';
	            } else {
	                return 'up';
	            }
	        }
	
	        return 'vertical';
	
	    };
	
	    Slick.prototype.swipeEnd = function(event) {
	
	        var _ = this,
	            slideCount,
	            direction;
	
	        _.dragging = false;
	        _.interrupted = false;
	        _.shouldClick = ( _.touchObject.swipeLength > 10 ) ? false : true;
	
	        if ( _.touchObject.curX === undefined ) {
	            return false;
	        }
	
	        if ( _.touchObject.edgeHit === true ) {
	            _.$slider.trigger('edge', [_, _.swipeDirection() ]);
	        }
	
	        if ( _.touchObject.swipeLength >= _.touchObject.minSwipe ) {
	
	            direction = _.swipeDirection();
	
	            switch ( direction ) {
	
	                case 'left':
	                case 'down':
	
	                    slideCount =
	                        _.options.swipeToSlide ?
	                            _.checkNavigable( _.currentSlide + _.getSlideCount() ) :
	                            _.currentSlide + _.getSlideCount();
	
	                    _.currentDirection = 0;
	
	                    break;
	
	                case 'right':
	                case 'up':
	
	                    slideCount =
	                        _.options.swipeToSlide ?
	                            _.checkNavigable( _.currentSlide - _.getSlideCount() ) :
	                            _.currentSlide - _.getSlideCount();
	
	                    _.currentDirection = 1;
	
	                    break;
	
	                default:
	
	
	            }
	
	            if( direction != 'vertical' ) {
	
	                _.slideHandler( slideCount );
	                _.touchObject = {};
	                _.$slider.trigger('swipe', [_, direction ]);
	
	            }
	
	        } else {
	
	            if ( _.touchObject.startX !== _.touchObject.curX ) {
	
	                _.slideHandler( _.currentSlide );
	                _.touchObject = {};
	
	            }
	
	        }
	
	    };
	
	    Slick.prototype.swipeHandler = function(event) {
	
	        var _ = this;
	
	        if ((_.options.swipe === false) || ('ontouchend' in document && _.options.swipe === false)) {
	            return;
	        } else if (_.options.draggable === false && event.type.indexOf('mouse') !== -1) {
	            return;
	        }
	
	        _.touchObject.fingerCount = event.originalEvent && event.originalEvent.touches !== undefined ?
	            event.originalEvent.touches.length : 1;
	
	        _.touchObject.minSwipe = _.listWidth / _.options
	            .touchThreshold;
	
	        if (_.options.verticalSwiping === true) {
	            _.touchObject.minSwipe = _.listHeight / _.options
	                .touchThreshold;
	        }
	
	        switch (event.data.action) {
	
	            case 'start':
	                _.swipeStart(event);
	                break;
	
	            case 'move':
	                _.swipeMove(event);
	                break;
	
	            case 'end':
	                _.swipeEnd(event);
	                break;
	
	        }
	
	    };
	
	    Slick.prototype.swipeMove = function(event) {
	
	        var _ = this,
	            edgeWasHit = false,
	            curLeft, swipeDirection, swipeLength, positionOffset, touches;
	
	        touches = event.originalEvent !== undefined ? event.originalEvent.touches : null;
	
	        if (!_.dragging || touches && touches.length !== 1) {
	            return false;
	        }
	
	        curLeft = _.getLeft(_.currentSlide);
	
	        _.touchObject.curX = touches !== undefined ? touches[0].pageX : event.clientX;
	        _.touchObject.curY = touches !== undefined ? touches[0].pageY : event.clientY;
	
	        _.touchObject.swipeLength = Math.round(Math.sqrt(
	            Math.pow(_.touchObject.curX - _.touchObject.startX, 2)));
	
	        if (_.options.verticalSwiping === true) {
	            _.touchObject.swipeLength = Math.round(Math.sqrt(
	                Math.pow(_.touchObject.curY - _.touchObject.startY, 2)));
	        }
	
	        swipeDirection = _.swipeDirection();
	
	        if (swipeDirection === 'vertical') {
	            return;
	        }
	
	        if (event.originalEvent !== undefined && _.touchObject.swipeLength > 4) {
	            event.preventDefault();
	        }
	
	        positionOffset = (_.options.rtl === false ? 1 : -1) * (_.touchObject.curX > _.touchObject.startX ? 1 : -1);
	        if (_.options.verticalSwiping === true) {
	            positionOffset = _.touchObject.curY > _.touchObject.startY ? 1 : -1;
	        }
	
	
	        swipeLength = _.touchObject.swipeLength;
	
	        _.touchObject.edgeHit = false;
	
	        if (_.options.infinite === false) {
	            if ((_.currentSlide === 0 && swipeDirection === 'right') || (_.currentSlide >= _.getDotCount() && swipeDirection === 'left')) {
	                swipeLength = _.touchObject.swipeLength * _.options.edgeFriction;
	                _.touchObject.edgeHit = true;
	            }
	        }
	
	        if (_.options.vertical === false) {
	            _.swipeLeft = curLeft + swipeLength * positionOffset;
	        } else {
	            _.swipeLeft = curLeft + (swipeLength * (_.$list.height() / _.listWidth)) * positionOffset;
	        }
	        if (_.options.verticalSwiping === true) {
	            _.swipeLeft = curLeft + swipeLength * positionOffset;
	        }
	
	        if (_.options.fade === true || _.options.touchMove === false) {
	            return false;
	        }
	
	        if (_.animating === true) {
	            _.swipeLeft = null;
	            return false;
	        }
	
	        _.setCSS(_.swipeLeft);
	
	    };
	
	    Slick.prototype.swipeStart = function(event) {
	
	        var _ = this,
	            touches;
	
	        _.interrupted = true;
	
	        if (_.touchObject.fingerCount !== 1 || _.slideCount <= _.options.slidesToShow) {
	            _.touchObject = {};
	            return false;
	        }
	
	        if (event.originalEvent !== undefined && event.originalEvent.touches !== undefined) {
	            touches = event.originalEvent.touches[0];
	        }
	
	        _.touchObject.startX = _.touchObject.curX = touches !== undefined ? touches.pageX : event.clientX;
	        _.touchObject.startY = _.touchObject.curY = touches !== undefined ? touches.pageY : event.clientY;
	
	        _.dragging = true;
	
	    };
	
	    Slick.prototype.unfilterSlides = Slick.prototype.slickUnfilter = function() {
	
	        var _ = this;
	
	        if (_.$slidesCache !== null) {
	
	            _.unload();
	
	            _.$slideTrack.children(this.options.slide).detach();
	
	            _.$slidesCache.appendTo(_.$slideTrack);
	
	            _.reinit();
	
	        }
	
	    };
	
	    Slick.prototype.unload = function() {
	
	        var _ = this;
	
	        $('.slick-cloned', _.$slider).remove();
	
	        if (_.$dots) {
	            _.$dots.remove();
	        }
	
	        if (_.$prevArrow && _.htmlExpr.test(_.options.prevArrow)) {
	            _.$prevArrow.remove();
	        }
	
	        if (_.$nextArrow && _.htmlExpr.test(_.options.nextArrow)) {
	            _.$nextArrow.remove();
	        }
	
	        _.$slides
	            .removeClass('slick-slide slick-active slick-visible slick-current')
	            .attr('aria-hidden', 'true')
	            .css('width', '');
	
	    };
	
	    Slick.prototype.unslick = function(fromBreakpoint) {
	
	        var _ = this;
	        _.$slider.trigger('unslick', [_, fromBreakpoint]);
	        _.destroy();
	
	    };
	
	    Slick.prototype.updateArrows = function() {
	
	        var _ = this,
	            centerOffset;
	
	        centerOffset = Math.floor(_.options.slidesToShow / 2);
	
	        if ( _.options.arrows === true &&
	            _.slideCount > _.options.slidesToShow &&
	            !_.options.infinite ) {
	
	            _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');
	            _.$nextArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');
	
	            if (_.currentSlide === 0) {
	
	                _.$prevArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
	                _.$nextArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');
	
	            } else if (_.currentSlide >= _.slideCount - _.options.slidesToShow && _.options.centerMode === false) {
	
	                _.$nextArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
	                _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');
	
	            } else if (_.currentSlide >= _.slideCount - 1 && _.options.centerMode === true) {
	
	                _.$nextArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
	                _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');
	
	            }
	
	        }
	
	    };
	
	    Slick.prototype.updateDots = function() {
	
	        var _ = this;
	
	        if (_.$dots !== null) {
	
	            _.$dots
	                .find('li')
	                .removeClass('slick-active')
	                .attr('aria-hidden', 'true');
	
	            _.$dots
	                .find('li')
	                .eq(Math.floor(_.currentSlide / _.options.slidesToScroll))
	                .addClass('slick-active')
	                .attr('aria-hidden', 'false');
	
	        }
	
	    };
	
	    Slick.prototype.visibility = function() {
	
	        var _ = this;
	
	        if ( _.options.autoplay ) {
	
	            if ( document[_.hidden] ) {
	
	                _.interrupted = true;
	
	            } else {
	
	                _.interrupted = false;
	
	            }
	
	        }
	
	    };
	
	    $.fn.slick = function() {
	        var _ = this,
	            opt = arguments[0],
	            args = Array.prototype.slice.call(arguments, 1),
	            l = _.length,
	            i,
	            ret;
	        for (i = 0; i < l; i++) {
	            if (typeof opt == 'object' || typeof opt == 'undefined')
	                _[i].slick = new Slick(_[i], opt);
	            else
	                ret = _[i].slick[opt].apply(_[i].slick, args);
	            if (typeof ret != 'undefined') return ret;
	        }
	        return _;
	    };
	
	}));
	
	
/**
 * Isotope v1.5.26
 * An exquisite jQuery plugin for magical layouts
 * http://isotope.metafizzy.co
 *
 * Commercial use requires one-time purchase of a commercial license
 * http://isotope.metafizzy.co/docs/license.html
 *
 * Non-commercial use is licensed under the MIT License
 *
 * Copyright 2014 Metafizzy
 */
!function(t,i){"use strict";var s,e=t.document,n=e.documentElement,o=t.Modernizr,r=function(t){return t.charAt(0).toUpperCase()+t.slice(1)},a="Moz Webkit O Ms".split(" "),h=function(t){var i,s=n.style;if("string"==typeof s[t])return t;t=r(t);for(var e=0,o=a.length;o>e;e++)if(i=a[e]+t,"string"==typeof s[i])return i},l=h("transform"),u=h("transitionProperty"),c={csstransforms:function(){return!!l},csstransforms3d:function(){var t=!!h("perspective");if(t&&"webkitPerspective"in n.style){var s=i("<style>@media (transform-3d),(-webkit-transform-3d){#modernizr{height:3px}}</style>").appendTo("head"),e=i('<div id="modernizr" />').appendTo("html");t=3===e.height(),e.remove(),s.remove()}return t},csstransitions:function(){return!!u}};if(o)for(s in c)o.hasOwnProperty(s)||o.addTest(s,c[s]);else{o=t.Modernizr={_version:"1.6ish: miniModernizr for Isotope"};var d,f=" ";for(s in c)d=c[s](),o[s]=d,f+=" "+(d?"":"no-")+s;i("html").addClass(f)}if(o.csstransforms){var m=o.csstransforms3d?{translate:function(t){return"translate3d("+t[0]+"px, "+t[1]+"px, 0) "},scale:function(t){return"scale3d("+t+", "+t+", 1) "}}:{translate:function(t){return"translate("+t[0]+"px, "+t[1]+"px) "},scale:function(t){return"scale("+t+") "}},p=function(t,s,e){var n,o,r=i.data(t,"isoTransform")||{},a={},h={};a[s]=e,i.extend(r,a);for(n in r)o=r[n],h[n]=m[n](o);var u=h.translate||"",c=h.scale||"",d=u+c;i.data(t,"isoTransform",r),t.style[l]=d};i.cssNumber.scale=!0,i.cssHooks.scale={set:function(t,i){p(t,"scale",i)},get:function(t){var s=i.data(t,"isoTransform");return s&&s.scale?s.scale:1}},i.fx.step.scale=function(t){i.cssHooks.scale.set(t.elem,t.now+t.unit)},i.cssNumber.translate=!0,i.cssHooks.translate={set:function(t,i){p(t,"translate",i)},get:function(t){var s=i.data(t,"isoTransform");return s&&s.translate?s.translate:[0,0]}}}var y,g;o.csstransitions&&(y={WebkitTransitionProperty:"webkitTransitionEnd",MozTransitionProperty:"transitionend",OTransitionProperty:"oTransitionEnd otransitionend",transitionProperty:"transitionend"}[u],g=h("transitionDuration"));var v,_=i.event,A=i.event.handle?"handle":"dispatch";_.special.smartresize={setup:function(){i(this).bind("resize",_.special.smartresize.handler)},teardown:function(){i(this).unbind("resize",_.special.smartresize.handler)},handler:function(t,i){var s=this,e=arguments;t.type="smartresize",v&&clearTimeout(v),v=setTimeout(function(){_[A].apply(s,e)},"execAsap"===i?0:100)}},i.fn.smartresize=function(t){return t?this.bind("smartresize",t):this.trigger("smartresize",["execAsap"])},i.Isotope=function(t,s,e){this.element=i(s),this._create(t),this._init(e)};var w=["width","height"],C=i(t);i.Isotope.settings={resizable:!0,layoutMode:"masonry",containerClass:"isotope",itemClass:"isotope-item",hiddenClass:"isotope-hidden",hiddenStyle:{opacity:0,scale:.001},visibleStyle:{opacity:1,scale:1},containerStyle:{position:"relative",overflow:"hidden"},animationEngine:"best-available",animationOptions:{queue:!1,duration:800},sortBy:"original-order",sortAscending:!0,resizesContainer:!0,transformsEnabled:!0,itemPositionDataEnabled:!1},i.Isotope.prototype={_create:function(t){this.options=i.extend({},i.Isotope.settings,t),this.styleQueue=[],this.elemCount=0;var s=this.element[0].style;this.originalStyle={};var e=w.slice(0);for(var n in this.options.containerStyle)e.push(n);for(var o=0,r=e.length;r>o;o++)n=e[o],this.originalStyle[n]=s[n]||"";this.element.css(this.options.containerStyle),this._updateAnimationEngine(),this._updateUsingTransforms();var a={"original-order":function(t,i){return i.elemCount++,i.elemCount},random:function(){return Math.random()}};this.options.getSortData=i.extend(this.options.getSortData,a),this.reloadItems(),this.offset={left:parseInt(this.element.css("padding-left")||0,10),top:parseInt(this.element.css("padding-top")||0,10)};var h=this;setTimeout(function(){h.element.addClass(h.options.containerClass)},0),this.options.resizable&&C.bind("smartresize.isotope",function(){h.resize()}),this.element.delegate("."+this.options.hiddenClass,"click",function(){return!1})},_getAtoms:function(t){var i=this.options.itemSelector,s=i?t.filter(i).add(t.find(i)):t,e={position:"absolute"};return s=s.filter(function(t,i){return 1===i.nodeType}),this.usingTransforms&&(e.left=0,e.top=0),s.css(e).addClass(this.options.itemClass),this.updateSortData(s,!0),s},_init:function(t){this.$filteredAtoms=this._filter(this.$allAtoms),this._sort(),this.reLayout(t)},option:function(t){if(i.isPlainObject(t)){this.options=i.extend(!0,this.options,t);var s;for(var e in t)s="_update"+r(e),this[s]&&this[s]()}},_updateAnimationEngine:function(){var t,i=this.options.animationEngine.toLowerCase().replace(/[ _\-]/g,"");switch(i){case"css":case"none":t=!1;break;case"jquery":t=!0;break;default:t=!o.csstransitions}this.isUsingJQueryAnimation=t,this._updateUsingTransforms()},_updateTransformsEnabled:function(){this._updateUsingTransforms()},_updateUsingTransforms:function(){var t=this.usingTransforms=this.options.transformsEnabled&&o.csstransforms&&o.csstransitions&&!this.isUsingJQueryAnimation;t||(delete this.options.hiddenStyle.scale,delete this.options.visibleStyle.scale),this.getPositionStyles=t?this._translate:this._positionAbs},_filter:function(t){var i=""===this.options.filter?"*":this.options.filter;if(!i)return t;var s=this.options.hiddenClass,e="."+s,n=t.filter(e),o=n;if("*"!==i){o=n.filter(i);var r=t.not(e).not(i).addClass(s);this.styleQueue.push({$el:r,style:this.options.hiddenStyle})}return this.styleQueue.push({$el:o,style:this.options.visibleStyle}),o.removeClass(s),t.filter(i)},updateSortData:function(t,s){var e,n,o=this,r=this.options.getSortData;t.each(function(){e=i(this),n={};for(var t in r)n[t]=s||"original-order"!==t?r[t](e,o):i.data(this,"isotope-sort-data")[t];i.data(this,"isotope-sort-data",n)})},_sort:function(){var t=this.options.sortBy,i=this._getSorter,s=this.options.sortAscending?1:-1,e=function(e,n){var o=i(e,t),r=i(n,t);return o===r&&"original-order"!==t&&(o=i(e,"original-order"),r=i(n,"original-order")),(o>r?1:r>o?-1:0)*s};this.$filteredAtoms.sort(e)},_getSorter:function(t,s){return i.data(t,"isotope-sort-data")[s]},_translate:function(t,i){return{translate:[t,i]}},_positionAbs:function(t,i){return{left:t,top:i}},_pushPosition:function(t,i,s){i=Math.round(i+this.offset.left),s=Math.round(s+this.offset.top);var e=this.getPositionStyles(i,s);this.styleQueue.push({$el:t,style:e}),this.options.itemPositionDataEnabled&&t.data("isotope-item-position",{x:i,y:s})},layout:function(t,i){var s=this.options.layoutMode;if(this["_"+s+"Layout"](t),this.options.resizesContainer){var e=this["_"+s+"GetContainerSize"]();this.styleQueue.push({$el:this.element,style:e})}this._processStyleQueue(t,i),this.isLaidOut=!0},_processStyleQueue:function(t,s){var e,n,r,a,h=this.isLaidOut?this.isUsingJQueryAnimation?"animate":"css":"css",l=this.options.animationOptions,u=this.options.onLayout;if(n=function(t,i){i.$el[h](i.style,l)},this._isInserting&&this.isUsingJQueryAnimation)n=function(t,i){e=i.$el.hasClass("no-transition")?"css":h,i.$el[e](i.style,l)};else if(s||u||l.complete){var c=!1,d=[s,u,l.complete],f=this;if(r=!0,a=function(){if(!c){for(var i,s=0,e=d.length;e>s;s++)i=d[s],"function"==typeof i&&i.call(f.element,t,f);c=!0}},this.isUsingJQueryAnimation&&"animate"===h)l.complete=a,r=!1;else if(o.csstransitions){for(var m,p=0,v=this.styleQueue[0],_=v&&v.$el;!_||!_.length;){if(m=this.styleQueue[p++],!m)return;_=m.$el}var A=parseFloat(getComputedStyle(_[0])[g]);A>0&&(n=function(t,i){i.$el[h](i.style,l).one(y,a)},r=!1)}}i.each(this.styleQueue,n),r&&a(),this.styleQueue=[]},resize:function(){this["_"+this.options.layoutMode+"ResizeChanged"]()&&this.reLayout()},reLayout:function(t){this["_"+this.options.layoutMode+"Reset"](),this.layout(this.$filteredAtoms,t)},addItems:function(t,i){var s=this._getAtoms(t);this.$allAtoms=this.$allAtoms.add(s),i&&i(s)},insert:function(t,i){this.element.append(t);var s=this;this.addItems(t,function(t){var e=s._filter(t);s._addHideAppended(e),s._sort(),s.reLayout(),s._revealAppended(e,i)})},appended:function(t,i){var s=this;this.addItems(t,function(t){s._addHideAppended(t),s.layout(t),s._revealAppended(t,i)})},_addHideAppended:function(t){this.$filteredAtoms=this.$filteredAtoms.add(t),t.addClass("no-transition"),this._isInserting=!0,this.styleQueue.push({$el:t,style:this.options.hiddenStyle})},_revealAppended:function(t,i){var s=this;setTimeout(function(){t.removeClass("no-transition"),s.styleQueue.push({$el:t,style:s.options.visibleStyle}),s._isInserting=!1,s._processStyleQueue(t,i)},10)},reloadItems:function(){this.$allAtoms=this._getAtoms(this.element.children())},remove:function(t,i){this.$allAtoms=this.$allAtoms.not(t),this.$filteredAtoms=this.$filteredAtoms.not(t);var s=this,e=function(){t.remove(),i&&i.call(s.element)};t.filter(":not(."+this.options.hiddenClass+")").length?(this.styleQueue.push({$el:t,style:this.options.hiddenStyle}),this._sort(),this.reLayout(e)):e()},shuffle:function(t){this.updateSortData(this.$allAtoms),this.options.sortBy="random",this._sort(),this.reLayout(t)},destroy:function(){var t=this.usingTransforms,i=this.options;this.$allAtoms.removeClass(i.hiddenClass+" "+i.itemClass).each(function(){var i=this.style;i.position="",i.top="",i.left="",i.opacity="",t&&(i[l]="")});var s=this.element[0].style;for(var e in this.originalStyle)s[e]=this.originalStyle[e];this.element.unbind(".isotope").undelegate("."+i.hiddenClass,"click").removeClass(i.containerClass).removeData("isotope"),C.unbind(".isotope")},_getSegments:function(t){var i,s=this.options.layoutMode,e=t?"rowHeight":"columnWidth",n=t?"height":"width",o=t?"rows":"cols",a=this.element[n](),h=this.options[s]&&this.options[s][e]||this.$filteredAtoms["outer"+r(n)](!0)||a;i=Math.floor(a/h),i=Math.max(i,1),this[s][o]=i,this[s][e]=h},_checkIfSegmentsChanged:function(t){var i=this.options.layoutMode,s=t?"rows":"cols",e=this[i][s];return this._getSegments(t),this[i][s]!==e},_masonryReset:function(){this.masonry={},this._getSegments();var t=this.masonry.cols;for(this.masonry.colYs=[];t--;)this.masonry.colYs.push(0)},_masonryLayout:function(t){var s=this,e=s.masonry;t.each(function(){var t=i(this),n=Math.ceil(t.outerWidth(!0)/e.columnWidth);if(n=Math.min(n,e.cols),1===n)s._masonryPlaceBrick(t,e.colYs);else{var o,r,a=e.cols+1-n,h=[];for(r=0;a>r;r++)o=e.colYs.slice(r,r+n),h[r]=Math.max.apply(Math,o);s._masonryPlaceBrick(t,h)}})},_masonryPlaceBrick:function(t,i){for(var s=Math.min.apply(Math,i),e=0,n=0,o=i.length;o>n;n++)if(i[n]===s){e=n;break}var r=this.masonry.columnWidth*e,a=s;this._pushPosition(t,r,a);var h=s+t.outerHeight(!0),l=this.masonry.cols+1-o;for(n=0;l>n;n++)this.masonry.colYs[e+n]=h},_masonryGetContainerSize:function(){var t=Math.max.apply(Math,this.masonry.colYs);return{height:t}},_masonryResizeChanged:function(){return this._checkIfSegmentsChanged()},_fitRowsReset:function(){this.fitRows={x:0,y:0,height:0}},_fitRowsLayout:function(t){var s=this,e=this.element.width(),n=this.fitRows;t.each(function(){var t=i(this),o=t.outerWidth(!0),r=t.outerHeight(!0);0!==n.x&&o+n.x>e&&(n.x=0,n.y=n.height),s._pushPosition(t,n.x,n.y),n.height=Math.max(n.y+r,n.height),n.x+=o})},_fitRowsGetContainerSize:function(){return{height:this.fitRows.height}},_fitRowsResizeChanged:function(){return!0},_cellsByRowReset:function(){this.cellsByRow={index:0},this._getSegments(),this._getSegments(!0)},_cellsByRowLayout:function(t){var s=this,e=this.cellsByRow;t.each(function(){var t=i(this),n=e.index%e.cols,o=Math.floor(e.index/e.cols),r=(n+.5)*e.columnWidth-t.outerWidth(!0)/2,a=(o+.5)*e.rowHeight-t.outerHeight(!0)/2;s._pushPosition(t,r,a),e.index++})},_cellsByRowGetContainerSize:function(){return{height:Math.ceil(this.$filteredAtoms.length/this.cellsByRow.cols)*this.cellsByRow.rowHeight+this.offset.top}},_cellsByRowResizeChanged:function(){return this._checkIfSegmentsChanged()},_straightDownReset:function(){this.straightDown={y:0}},_straightDownLayout:function(t){var s=this;t.each(function(){var t=i(this);s._pushPosition(t,0,s.straightDown.y),s.straightDown.y+=t.outerHeight(!0)})},_straightDownGetContainerSize:function(){return{height:this.straightDown.y}},_straightDownResizeChanged:function(){return!0},_masonryHorizontalReset:function(){this.masonryHorizontal={},this._getSegments(!0);var t=this.masonryHorizontal.rows;for(this.masonryHorizontal.rowXs=[];t--;)this.masonryHorizontal.rowXs.push(0)},_masonryHorizontalLayout:function(t){var s=this,e=s.masonryHorizontal;t.each(function(){var t=i(this),n=Math.ceil(t.outerHeight(!0)/e.rowHeight);if(n=Math.min(n,e.rows),1===n)s._masonryHorizontalPlaceBrick(t,e.rowXs);else{var o,r,a=e.rows+1-n,h=[];for(r=0;a>r;r++)o=e.rowXs.slice(r,r+n),h[r]=Math.max.apply(Math,o);s._masonryHorizontalPlaceBrick(t,h)}})},_masonryHorizontalPlaceBrick:function(t,i){for(var s=Math.min.apply(Math,i),e=0,n=0,o=i.length;o>n;n++)if(i[n]===s){e=n;break}var r=s,a=this.masonryHorizontal.rowHeight*e;this._pushPosition(t,r,a);var h=s+t.outerWidth(!0),l=this.masonryHorizontal.rows+1-o;for(n=0;l>n;n++)this.masonryHorizontal.rowXs[e+n]=h},_masonryHorizontalGetContainerSize:function(){var t=Math.max.apply(Math,this.masonryHorizontal.rowXs);return{width:t}},_masonryHorizontalResizeChanged:function(){return this._checkIfSegmentsChanged(!0)},_fitColumnsReset:function(){this.fitColumns={x:0,y:0,width:0}},_fitColumnsLayout:function(t){var s=this,e=this.element.height(),n=this.fitColumns;t.each(function(){var t=i(this),o=t.outerWidth(!0),r=t.outerHeight(!0);0!==n.y&&r+n.y>e&&(n.x=n.width,n.y=0),s._pushPosition(t,n.x,n.y),n.width=Math.max(n.x+o,n.width),n.y+=r})},_fitColumnsGetContainerSize:function(){return{width:this.fitColumns.width}},_fitColumnsResizeChanged:function(){return!0},_cellsByColumnReset:function(){this.cellsByColumn={index:0},this._getSegments(),this._getSegments(!0)},_cellsByColumnLayout:function(t){var s=this,e=this.cellsByColumn;t.each(function(){var t=i(this),n=Math.floor(e.index/e.rows),o=e.index%e.rows,r=(n+.5)*e.columnWidth-t.outerWidth(!0)/2,a=(o+.5)*e.rowHeight-t.outerHeight(!0)/2;s._pushPosition(t,r,a),e.index++})},_cellsByColumnGetContainerSize:function(){return{width:Math.ceil(this.$filteredAtoms.length/this.cellsByColumn.rows)*this.cellsByColumn.columnWidth}},_cellsByColumnResizeChanged:function(){return this._checkIfSegmentsChanged(!0)},_straightAcrossReset:function(){this.straightAcross={x:0}},_straightAcrossLayout:function(t){var s=this;t.each(function(){var t=i(this);s._pushPosition(t,s.straightAcross.x,0),s.straightAcross.x+=t.outerWidth(!0)})},_straightAcrossGetContainerSize:function(){return{width:this.straightAcross.x}},_straightAcrossResizeChanged:function(){return!0}},i.fn.imagesLoaded=function(t){function s(){t.call(n,o)}function e(t){var n=t.target;n.src!==a&&-1===i.inArray(n,h)&&(h.push(n),--r<=0&&(setTimeout(s),o.unbind(".imagesLoaded",e)))}var n=this,o=n.find("img").add(n.filter("img")),r=o.length,a="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",h=[];return r||s(),o.bind("load.imagesLoaded error.imagesLoaded",e).each(function(){var t=this.src;this.src=a,this.src=t}),n};var z=function(i){t.console&&t.console.error(i)};i.fn.isotope=function(t,s){if("string"==typeof t){var e=Array.prototype.slice.call(arguments,1);this.each(function(){var s=i.data(this,"isotope");return s?i.isFunction(s[t])&&"_"!==t.charAt(0)?void s[t].apply(s,e):void z("no such method '"+t+"' for isotope instance"):void z("cannot call methods on isotope prior to initialization; attempted to call method '"+t+"'")})}else this.each(function(){var e=i.data(this,"isotope");e?(e.option(t),e._init(s)):i.data(this,"isotope",new i.Isotope(t,this,s))});return this}}(window,jQuery);

!function(i){"use strict";"function"==typeof define&&define.amd?define(["jquery"],i):"undefined"!=typeof exports?module.exports=i(require("jquery")):i(jQuery)}(function(i){"use strict";var e=window.Slick||{};(e=function(){var e=0;return function(t,o){var s,n=this;n.defaults={accessibility:!0,adaptiveHeight:!1,appendArrows:i(t),appendDots:i(t),arrows:!0,asNavFor:null,prevArrow:'<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',nextArrow:'<button class="slick-next" aria-label="Next" type="button">Next</button>',autoplay:!1,autoplaySpeed:3e3,centerMode:!1,centerPadding:"50px",cssEase:"ease",customPaging:function(e,t){return i('<button type="button" />').text(t+1)},dots:!1,dotsClass:"slick-dots",draggable:!0,easing:"linear",edgeFriction:.35,fade:!1,focusOnSelect:!1,focusOnChange:!1,infinite:!0,initialSlide:0,lazyLoad:"ondemand",mobileFirst:!1,pauseOnHover:!0,pauseOnFocus:!0,pauseOnDotsHover:!1,respondTo:"window",responsive:null,rows:1,rtl:!1,slide:"",slidesPerRow:1,slidesToShow:1,slidesToScroll:1,speed:500,swipe:!0,swipeToSlide:!1,touchMove:!0,touchThreshold:5,useCSS:!0,useTransform:!0,variableWidth:!1,vertical:!1,verticalSwiping:!1,waitForAnimate:!0,zIndex:1e3},n.initials={animating:!1,dragging:!1,autoPlayTimer:null,currentDirection:0,currentLeft:null,currentSlide:0,direction:1,$dots:null,listWidth:null,listHeight:null,loadIndex:0,$nextArrow:null,$prevArrow:null,scrolling:!1,slideCount:null,slideWidth:null,$slideTrack:null,$slides:null,sliding:!1,slideOffset:0,swipeLeft:null,swiping:!1,$list:null,touchObject:{},transformsEnabled:!1,unslicked:!1},i.extend(n,n.initials),n.activeBreakpoint=null,n.animType=null,n.animProp=null,n.breakpoints=[],n.breakpointSettings=[],n.cssTransitions=!1,n.focussed=!1,n.interrupted=!1,n.hidden="hidden",n.paused=!0,n.positionProp=null,n.respondTo=null,n.rowCount=1,n.shouldClick=!0,n.$slider=i(t),n.$slidesCache=null,n.transformType=null,n.transitionType=null,n.visibilityChange="visibilitychange",n.windowWidth=0,n.windowTimer=null,s=i(t).data("slick")||{},n.options=i.extend({},n.defaults,o,s),n.currentSlide=n.options.initialSlide,n.originalSettings=n.options,void 0!==document.mozHidden?(n.hidden="mozHidden",n.visibilityChange="mozvisibilitychange"):void 0!==document.webkitHidden&&(n.hidden="webkitHidden",n.visibilityChange="webkitvisibilitychange"),n.autoPlay=i.proxy(n.autoPlay,n),n.autoPlayClear=i.proxy(n.autoPlayClear,n),n.autoPlayIterator=i.proxy(n.autoPlayIterator,n),n.changeSlide=i.proxy(n.changeSlide,n),n.clickHandler=i.proxy(n.clickHandler,n),n.selectHandler=i.proxy(n.selectHandler,n),n.setPosition=i.proxy(n.setPosition,n),n.swipeHandler=i.proxy(n.swipeHandler,n),n.dragHandler=i.proxy(n.dragHandler,n),n.keyHandler=i.proxy(n.keyHandler,n),n.instanceUid=e++,n.htmlExpr=/^(?:\s*(<[\w\W]+>)[^>]*)$/,n.registerBreakpoints(),n.init(!0)}}()).prototype.activateADA=function(){this.$slideTrack.find(".slick-active").attr({"aria-hidden":"false"}).find("a, input, button, select").attr({tabindex:"0"})},e.prototype.addSlide=e.prototype.slickAdd=function(e,t,o){var s=this;if("boolean"==typeof t)o=t,t=null;else if(t<0||t>=s.slideCount)return!1;s.unload(),"number"==typeof t?0===t&&0===s.$slides.length?i(e).appendTo(s.$slideTrack):o?i(e).insertBefore(s.$slides.eq(t)):i(e).insertAfter(s.$slides.eq(t)):!0===o?i(e).prependTo(s.$slideTrack):i(e).appendTo(s.$slideTrack),s.$slides=s.$slideTrack.children(this.options.slide),s.$slideTrack.children(this.options.slide).detach(),s.$slideTrack.append(s.$slides),s.$slides.each(function(e,t){i(t).attr("data-slick-index",e)}),s.$slidesCache=s.$slides,s.reinit()},e.prototype.animateHeight=function(){var i=this;if(1===i.options.slidesToShow&&!0===i.options.adaptiveHeight&&!1===i.options.vertical){var e=i.$slides.eq(i.currentSlide).outerHeight(!0);i.$list.animate({height:e},i.options.speed)}},e.prototype.animateSlide=function(e,t){var o={},s=this;s.animateHeight(),!0===s.options.rtl&&!1===s.options.vertical&&(e=-e),!1===s.transformsEnabled?!1===s.options.vertical?s.$slideTrack.animate({left:e},s.options.speed,s.options.easing,t):s.$slideTrack.animate({top:e},s.options.speed,s.options.easing,t):!1===s.cssTransitions?(!0===s.options.rtl&&(s.currentLeft=-s.currentLeft),i({animStart:s.currentLeft}).animate({animStart:e},{duration:s.options.speed,easing:s.options.easing,step:function(i){i=Math.ceil(i),!1===s.options.vertical?(o[s.animType]="translate("+i+"px, 0px)",s.$slideTrack.css(o)):(o[s.animType]="translate(0px,"+i+"px)",s.$slideTrack.css(o))},complete:function(){t&&t.call()}})):(s.applyTransition(),e=Math.ceil(e),!1===s.options.vertical?o[s.animType]="translate3d("+e+"px, 0px, 0px)":o[s.animType]="translate3d(0px,"+e+"px, 0px)",s.$slideTrack.css(o),t&&setTimeout(function(){s.disableTransition(),t.call()},s.options.speed))},e.prototype.getNavTarget=function(){var e=this,t=e.options.asNavFor;return t&&null!==t&&(t=i(t).not(e.$slider)),t},e.prototype.asNavFor=function(e){var t=this.getNavTarget();null!==t&&"object"==typeof t&&t.each(function(){var t=i(this).slick("getSlick");t.unslicked||t.slideHandler(e,!0)})},e.prototype.applyTransition=function(i){var e=this,t={};!1===e.options.fade?t[e.transitionType]=e.transformType+" "+e.options.speed+"ms "+e.options.cssEase:t[e.transitionType]="opacity "+e.options.speed+"ms "+e.options.cssEase,!1===e.options.fade?e.$slideTrack.css(t):e.$slides.eq(i).css(t)},e.prototype.autoPlay=function(){var i=this;i.autoPlayClear(),i.slideCount>i.options.slidesToShow&&(i.autoPlayTimer=setInterval(i.autoPlayIterator,i.options.autoplaySpeed))},e.prototype.autoPlayClear=function(){var i=this;i.autoPlayTimer&&clearInterval(i.autoPlayTimer)},e.prototype.autoPlayIterator=function(){var i=this,e=i.currentSlide+i.options.slidesToScroll;i.paused||i.interrupted||i.focussed||(!1===i.options.infinite&&(1===i.direction&&i.currentSlide+1===i.slideCount-1?i.direction=0:0===i.direction&&(e=i.currentSlide-i.options.slidesToScroll,i.currentSlide-1==0&&(i.direction=1))),i.slideHandler(e))},e.prototype.buildArrows=function(){var e=this;!0===e.options.arrows&&(e.$prevArrow=i(e.options.prevArrow).addClass("slick-arrow"),e.$nextArrow=i(e.options.nextArrow).addClass("slick-arrow"),e.slideCount>e.options.slidesToShow?(e.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),e.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),e.htmlExpr.test(e.options.prevArrow)&&e.$prevArrow.prependTo(e.options.appendArrows),e.htmlExpr.test(e.options.nextArrow)&&e.$nextArrow.appendTo(e.options.appendArrows),!0!==e.options.infinite&&e.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true")):e.$prevArrow.add(e.$nextArrow).addClass("slick-hidden").attr({"aria-disabled":"true",tabindex:"-1"}))},e.prototype.buildDots=function(){var e,t,o=this;if(!0===o.options.dots){for(o.$slider.addClass("slick-dotted"),t=i("<ul />").addClass(o.options.dotsClass),e=0;e<=o.getDotCount();e+=1)t.append(i("<li />").append(o.options.customPaging.call(this,o,e)));o.$dots=t.appendTo(o.options.appendDots),o.$dots.find("li").first().addClass("slick-active")}},e.prototype.buildOut=function(){var e=this;e.$slides=e.$slider.children(e.options.slide+":not(.slick-cloned)").addClass("slick-slide"),e.slideCount=e.$slides.length,e.$slides.each(function(e,t){i(t).attr("data-slick-index",e).data("originalStyling",i(t).attr("style")||"")}),e.$slider.addClass("slick-slider"),e.$slideTrack=0===e.slideCount?i('<div class="slick-track"/>').appendTo(e.$slider):e.$slides.wrapAll('<div class="slick-track"/>').parent(),e.$list=e.$slideTrack.wrap('<div class="slick-list"/>').parent(),e.$slideTrack.css("opacity",0),!0!==e.options.centerMode&&!0!==e.options.swipeToSlide||(e.options.slidesToScroll=1),i("img[data-lazy]",e.$slider).not("[src]").addClass("slick-loading"),e.setupInfinite(),e.buildArrows(),e.buildDots(),e.updateDots(),e.setSlideClasses("number"==typeof e.currentSlide?e.currentSlide:0),!0===e.options.draggable&&e.$list.addClass("draggable")},e.prototype.buildRows=function(){var i,e,t,o,s,n,r,l=this;if(o=document.createDocumentFragment(),n=l.$slider.children(),l.options.rows>1){for(r=l.options.slidesPerRow*l.options.rows,s=Math.ceil(n.length/r),i=0;i<s;i++){var d=document.createElement("div");for(e=0;e<l.options.rows;e++){var a=document.createElement("div");for(t=0;t<l.options.slidesPerRow;t++){var c=i*r+(e*l.options.slidesPerRow+t);n.get(c)&&a.appendChild(n.get(c))}d.appendChild(a)}o.appendChild(d)}l.$slider.empty().append(o),l.$slider.children().children().children().css({width:100/l.options.slidesPerRow+"%",display:"inline-block"})}},e.prototype.checkResponsive=function(e,t){var o,s,n,r=this,l=!1,d=r.$slider.width(),a=window.innerWidth||i(window).width();if("window"===r.respondTo?n=a:"slider"===r.respondTo?n=d:"min"===r.respondTo&&(n=Math.min(a,d)),r.options.responsive&&r.options.responsive.length&&null!==r.options.responsive){s=null;for(o in r.breakpoints)r.breakpoints.hasOwnProperty(o)&&(!1===r.originalSettings.mobileFirst?n<r.breakpoints[o]&&(s=r.breakpoints[o]):n>r.breakpoints[o]&&(s=r.breakpoints[o]));null!==s?null!==r.activeBreakpoint?(s!==r.activeBreakpoint||t)&&(r.activeBreakpoint=s,"unslick"===r.breakpointSettings[s]?r.unslick(s):(r.options=i.extend({},r.originalSettings,r.breakpointSettings[s]),!0===e&&(r.currentSlide=r.options.initialSlide),r.refresh(e)),l=s):(r.activeBreakpoint=s,"unslick"===r.breakpointSettings[s]?r.unslick(s):(r.options=i.extend({},r.originalSettings,r.breakpointSettings[s]),!0===e&&(r.currentSlide=r.options.initialSlide),r.refresh(e)),l=s):null!==r.activeBreakpoint&&(r.activeBreakpoint=null,r.options=r.originalSettings,!0===e&&(r.currentSlide=r.options.initialSlide),r.refresh(e),l=s),e||!1===l||r.$slider.trigger("breakpoint",[r,l])}},e.prototype.changeSlide=function(e,t){var o,s,n,r=this,l=i(e.currentTarget);switch(l.is("a")&&e.preventDefault(),l.is("li")||(l=l.closest("li")),n=r.slideCount%r.options.slidesToScroll!=0,o=n?0:(r.slideCount-r.currentSlide)%r.options.slidesToScroll,e.data.message){case"previous":s=0===o?r.options.slidesToScroll:r.options.slidesToShow-o,r.slideCount>r.options.slidesToShow&&r.slideHandler(r.currentSlide-s,!1,t);break;case"next":s=0===o?r.options.slidesToScroll:o,r.slideCount>r.options.slidesToShow&&r.slideHandler(r.currentSlide+s,!1,t);break;case"index":var d=0===e.data.index?0:e.data.index||l.index()*r.options.slidesToScroll;r.slideHandler(r.checkNavigable(d),!1,t),l.children().trigger("focus");break;default:return}},e.prototype.checkNavigable=function(i){var e,t;if(e=this.getNavigableIndexes(),t=0,i>e[e.length-1])i=e[e.length-1];else for(var o in e){if(i<e[o]){i=t;break}t=e[o]}return i},e.prototype.cleanUpEvents=function(){var e=this;e.options.dots&&null!==e.$dots&&(i("li",e.$dots).off("click.slick",e.changeSlide).off("mouseenter.slick",i.proxy(e.interrupt,e,!0)).off("mouseleave.slick",i.proxy(e.interrupt,e,!1)),!0===e.options.accessibility&&e.$dots.off("keydown.slick",e.keyHandler)),e.$slider.off("focus.slick blur.slick"),!0===e.options.arrows&&e.slideCount>e.options.slidesToShow&&(e.$prevArrow&&e.$prevArrow.off("click.slick",e.changeSlide),e.$nextArrow&&e.$nextArrow.off("click.slick",e.changeSlide),!0===e.options.accessibility&&(e.$prevArrow&&e.$prevArrow.off("keydown.slick",e.keyHandler),e.$nextArrow&&e.$nextArrow.off("keydown.slick",e.keyHandler))),e.$list.off("touchstart.slick mousedown.slick",e.swipeHandler),e.$list.off("touchmove.slick mousemove.slick",e.swipeHandler),e.$list.off("touchend.slick mouseup.slick",e.swipeHandler),e.$list.off("touchcancel.slick mouseleave.slick",e.swipeHandler),e.$list.off("click.slick",e.clickHandler),i(document).off(e.visibilityChange,e.visibility),e.cleanUpSlideEvents(),!0===e.options.accessibility&&e.$list.off("keydown.slick",e.keyHandler),!0===e.options.focusOnSelect&&i(e.$slideTrack).children().off("click.slick",e.selectHandler),i(window).off("orientationchange.slick.slick-"+e.instanceUid,e.orientationChange),i(window).off("resize.slick.slick-"+e.instanceUid,e.resize),i("[draggable!=true]",e.$slideTrack).off("dragstart",e.preventDefault),i(window).off("load.slick.slick-"+e.instanceUid,e.setPosition)},e.prototype.cleanUpSlideEvents=function(){var e=this;e.$list.off("mouseenter.slick",i.proxy(e.interrupt,e,!0)),e.$list.off("mouseleave.slick",i.proxy(e.interrupt,e,!1))},e.prototype.cleanUpRows=function(){var i,e=this;e.options.rows>1&&((i=e.$slides.children().children()).removeAttr("style"),e.$slider.empty().append(i))},e.prototype.clickHandler=function(i){!1===this.shouldClick&&(i.stopImmediatePropagation(),i.stopPropagation(),i.preventDefault())},e.prototype.destroy=function(e){var t=this;t.autoPlayClear(),t.touchObject={},t.cleanUpEvents(),i(".slick-cloned",t.$slider).detach(),t.$dots&&t.$dots.remove(),t.$prevArrow&&t.$prevArrow.length&&(t.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display",""),t.htmlExpr.test(t.options.prevArrow)&&t.$prevArrow.remove()),t.$nextArrow&&t.$nextArrow.length&&(t.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display",""),t.htmlExpr.test(t.options.nextArrow)&&t.$nextArrow.remove()),t.$slides&&(t.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function(){i(this).attr("style",i(this).data("originalStyling"))}),t.$slideTrack.children(this.options.slide).detach(),t.$slideTrack.detach(),t.$list.detach(),t.$slider.append(t.$slides)),t.cleanUpRows(),t.$slider.removeClass("slick-slider"),t.$slider.removeClass("slick-initialized"),t.$slider.removeClass("slick-dotted"),t.unslicked=!0,e||t.$slider.trigger("destroy",[t])},e.prototype.disableTransition=function(i){var e=this,t={};t[e.transitionType]="",!1===e.options.fade?e.$slideTrack.css(t):e.$slides.eq(i).css(t)},e.prototype.fadeSlide=function(i,e){var t=this;!1===t.cssTransitions?(t.$slides.eq(i).css({zIndex:t.options.zIndex}),t.$slides.eq(i).animate({opacity:1},t.options.speed,t.options.easing,e)):(t.applyTransition(i),t.$slides.eq(i).css({opacity:1,zIndex:t.options.zIndex}),e&&setTimeout(function(){t.disableTransition(i),e.call()},t.options.speed))},e.prototype.fadeSlideOut=function(i){var e=this;!1===e.cssTransitions?e.$slides.eq(i).animate({opacity:0,zIndex:e.options.zIndex-2},e.options.speed,e.options.easing):(e.applyTransition(i),e.$slides.eq(i).css({opacity:0,zIndex:e.options.zIndex-2}))},e.prototype.filterSlides=e.prototype.slickFilter=function(i){var e=this;null!==i&&(e.$slidesCache=e.$slides,e.unload(),e.$slideTrack.children(this.options.slide).detach(),e.$slidesCache.filter(i).appendTo(e.$slideTrack),e.reinit())},e.prototype.focusHandler=function(){var e=this;e.$slider.off("focus.slick blur.slick").on("focus.slick blur.slick","*",function(t){t.stopImmediatePropagation();var o=i(this);setTimeout(function(){e.options.pauseOnFocus&&(e.focussed=o.is(":focus"),e.autoPlay())},0)})},e.prototype.getCurrent=e.prototype.slickCurrentSlide=function(){return this.currentSlide},e.prototype.getDotCount=function(){var i=this,e=0,t=0,o=0;if(!0===i.options.infinite)if(i.slideCount<=i.options.slidesToShow)++o;else for(;e<i.slideCount;)++o,e=t+i.options.slidesToScroll,t+=i.options.slidesToScroll<=i.options.slidesToShow?i.options.slidesToScroll:i.options.slidesToShow;else if(!0===i.options.centerMode)o=i.slideCount;else if(i.options.asNavFor)for(;e<i.slideCount;)++o,e=t+i.options.slidesToScroll,t+=i.options.slidesToScroll<=i.options.slidesToShow?i.options.slidesToScroll:i.options.slidesToShow;else o=1+Math.ceil((i.slideCount-i.options.slidesToShow)/i.options.slidesToScroll);return o-1},e.prototype.getLeft=function(i){var e,t,o,s,n=this,r=0;return n.slideOffset=0,t=n.$slides.first().outerHeight(!0),!0===n.options.infinite?(n.slideCount>n.options.slidesToShow&&(n.slideOffset=n.slideWidth*n.options.slidesToShow*-1,s=-1,!0===n.options.vertical&&!0===n.options.centerMode&&(2===n.options.slidesToShow?s=-1.5:1===n.options.slidesToShow&&(s=-2)),r=t*n.options.slidesToShow*s),n.slideCount%n.options.slidesToScroll!=0&&i+n.options.slidesToScroll>n.slideCount&&n.slideCount>n.options.slidesToShow&&(i>n.slideCount?(n.slideOffset=(n.options.slidesToShow-(i-n.slideCount))*n.slideWidth*-1,r=(n.options.slidesToShow-(i-n.slideCount))*t*-1):(n.slideOffset=n.slideCount%n.options.slidesToScroll*n.slideWidth*-1,r=n.slideCount%n.options.slidesToScroll*t*-1))):i+n.options.slidesToShow>n.slideCount&&(n.slideOffset=(i+n.options.slidesToShow-n.slideCount)*n.slideWidth,r=(i+n.options.slidesToShow-n.slideCount)*t),n.slideCount<=n.options.slidesToShow&&(n.slideOffset=0,r=0),!0===n.options.centerMode&&n.slideCount<=n.options.slidesToShow?n.slideOffset=n.slideWidth*Math.floor(n.options.slidesToShow)/2-n.slideWidth*n.slideCount/2:!0===n.options.centerMode&&!0===n.options.infinite?n.slideOffset+=n.slideWidth*Math.floor(n.options.slidesToShow/2)-n.slideWidth:!0===n.options.centerMode&&(n.slideOffset=0,n.slideOffset+=n.slideWidth*Math.floor(n.options.slidesToShow/2)),e=!1===n.options.vertical?i*n.slideWidth*-1+n.slideOffset:i*t*-1+r,!0===n.options.variableWidth&&(o=n.slideCount<=n.options.slidesToShow||!1===n.options.infinite?n.$slideTrack.children(".slick-slide").eq(i):n.$slideTrack.children(".slick-slide").eq(i+n.options.slidesToShow),e=!0===n.options.rtl?o[0]?-1*(n.$slideTrack.width()-o[0].offsetLeft-o.width()):0:o[0]?-1*o[0].offsetLeft:0,!0===n.options.centerMode&&(o=n.slideCount<=n.options.slidesToShow||!1===n.options.infinite?n.$slideTrack.children(".slick-slide").eq(i):n.$slideTrack.children(".slick-slide").eq(i+n.options.slidesToShow+1),e=!0===n.options.rtl?o[0]?-1*(n.$slideTrack.width()-o[0].offsetLeft-o.width()):0:o[0]?-1*o[0].offsetLeft:0,e+=(n.$list.width()-o.outerWidth())/2)),e},e.prototype.getOption=e.prototype.slickGetOption=function(i){return this.options[i]},e.prototype.getNavigableIndexes=function(){var i,e=this,t=0,o=0,s=[];for(!1===e.options.infinite?i=e.slideCount:(t=-1*e.options.slidesToScroll,o=-1*e.options.slidesToScroll,i=2*e.slideCount);t<i;)s.push(t),t=o+e.options.slidesToScroll,o+=e.options.slidesToScroll<=e.options.slidesToShow?e.options.slidesToScroll:e.options.slidesToShow;return s},e.prototype.getSlick=function(){return this},e.prototype.getSlideCount=function(){var e,t,o=this;return t=!0===o.options.centerMode?o.slideWidth*Math.floor(o.options.slidesToShow/2):0,!0===o.options.swipeToSlide?(o.$slideTrack.find(".slick-slide").each(function(s,n){if(n.offsetLeft-t+i(n).outerWidth()/2>-1*o.swipeLeft)return e=n,!1}),Math.abs(i(e).attr("data-slick-index")-o.currentSlide)||1):o.options.slidesToScroll},e.prototype.goTo=e.prototype.slickGoTo=function(i,e){this.changeSlide({data:{message:"index",index:parseInt(i)}},e)},e.prototype.init=function(e){var t=this;i(t.$slider).hasClass("slick-initialized")||(i(t.$slider).addClass("slick-initialized"),t.buildRows(),t.buildOut(),t.setProps(),t.startLoad(),t.loadSlider(),t.initializeEvents(),t.updateArrows(),t.updateDots(),t.checkResponsive(!0),t.focusHandler()),e&&t.$slider.trigger("init",[t]),!0===t.options.accessibility&&t.initADA(),t.options.autoplay&&(t.paused=!1,t.autoPlay())},e.prototype.initADA=function(){var e=this,t=Math.ceil(e.slideCount/e.options.slidesToShow),o=e.getNavigableIndexes().filter(function(i){return i>=0&&i<e.slideCount});e.$slides.add(e.$slideTrack.find(".slick-cloned")).attr({"aria-hidden":"true",tabindex:"-1"}).find("a, input, button, select").attr({tabindex:"-1"}),null!==e.$dots&&(e.$slides.not(e.$slideTrack.find(".slick-cloned")).each(function(t){var s=o.indexOf(t);i(this).attr({role:"tabpanel",id:"slick-slide"+e.instanceUid+t,tabindex:-1}),-1!==s&&i(this).attr({"aria-describedby":"slick-slide-control"+e.instanceUid+s})}),e.$dots.attr("role","tablist").find("li").each(function(s){var n=o[s];i(this).attr({role:"presentation"}),i(this).find("button").first().attr({role:"tab",id:"slick-slide-control"+e.instanceUid+s,"aria-controls":"slick-slide"+e.instanceUid+n,"aria-label":s+1+" of "+t,"aria-selected":null,tabindex:"-1"})}).eq(e.currentSlide).find("button").attr({"aria-selected":"true",tabindex:"0"}).end());for(var s=e.currentSlide,n=s+e.options.slidesToShow;s<n;s++)e.$slides.eq(s).attr("tabindex",0);e.activateADA()},e.prototype.initArrowEvents=function(){var i=this;!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow.off("click.slick").on("click.slick",{message:"previous"},i.changeSlide),i.$nextArrow.off("click.slick").on("click.slick",{message:"next"},i.changeSlide),!0===i.options.accessibility&&(i.$prevArrow.on("keydown.slick",i.keyHandler),i.$nextArrow.on("keydown.slick",i.keyHandler)))},e.prototype.initDotEvents=function(){var e=this;!0===e.options.dots&&(i("li",e.$dots).on("click.slick",{message:"index"},e.changeSlide),!0===e.options.accessibility&&e.$dots.on("keydown.slick",e.keyHandler)),!0===e.options.dots&&!0===e.options.pauseOnDotsHover&&i("li",e.$dots).on("mouseenter.slick",i.proxy(e.interrupt,e,!0)).on("mouseleave.slick",i.proxy(e.interrupt,e,!1))},e.prototype.initSlideEvents=function(){var e=this;e.options.pauseOnHover&&(e.$list.on("mouseenter.slick",i.proxy(e.interrupt,e,!0)),e.$list.on("mouseleave.slick",i.proxy(e.interrupt,e,!1)))},e.prototype.initializeEvents=function(){var e=this;e.initArrowEvents(),e.initDotEvents(),e.initSlideEvents(),e.$list.on("touchstart.slick mousedown.slick",{action:"start"},e.swipeHandler),e.$list.on("touchmove.slick mousemove.slick",{action:"move"},e.swipeHandler),e.$list.on("touchend.slick mouseup.slick",{action:"end"},e.swipeHandler),e.$list.on("touchcancel.slick mouseleave.slick",{action:"end"},e.swipeHandler),e.$list.on("click.slick",e.clickHandler),i(document).on(e.visibilityChange,i.proxy(e.visibility,e)),!0===e.options.accessibility&&e.$list.on("keydown.slick",e.keyHandler),!0===e.options.focusOnSelect&&i(e.$slideTrack).children().on("click.slick",e.selectHandler),i(window).on("orientationchange.slick.slick-"+e.instanceUid,i.proxy(e.orientationChange,e)),i(window).on("resize.slick.slick-"+e.instanceUid,i.proxy(e.resize,e)),i("[draggable!=true]",e.$slideTrack).on("dragstart",e.preventDefault),i(window).on("load.slick.slick-"+e.instanceUid,e.setPosition),i(e.setPosition)},e.prototype.initUI=function(){var i=this;!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow.show(),i.$nextArrow.show()),!0===i.options.dots&&i.slideCount>i.options.slidesToShow&&i.$dots.show()},e.prototype.keyHandler=function(i){var e=this;i.target.tagName.match("TEXTAREA|INPUT|SELECT")||(37===i.keyCode&&!0===e.options.accessibility?e.changeSlide({data:{message:!0===e.options.rtl?"next":"previous"}}):39===i.keyCode&&!0===e.options.accessibility&&e.changeSlide({data:{message:!0===e.options.rtl?"previous":"next"}}))},e.prototype.lazyLoad=function(){function e(e){i("img[data-lazy]",e).each(function(){var e=i(this),t=i(this).attr("data-lazy"),o=i(this).attr("data-srcset"),s=i(this).attr("data-sizes")||n.$slider.attr("data-sizes"),r=document.createElement("img");r.onload=function(){e.animate({opacity:0},100,function(){o&&(e.attr("srcset",o),s&&e.attr("sizes",s)),e.attr("src",t).animate({opacity:1},200,function(){e.removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading")}),n.$slider.trigger("lazyLoaded",[n,e,t])})},r.onerror=function(){e.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),n.$slider.trigger("lazyLoadError",[n,e,t])},r.src=t})}var t,o,s,n=this;if(!0===n.options.centerMode?!0===n.options.infinite?s=(o=n.currentSlide+(n.options.slidesToShow/2+1))+n.options.slidesToShow+2:(o=Math.max(0,n.currentSlide-(n.options.slidesToShow/2+1)),s=n.options.slidesToShow/2+1+2+n.currentSlide):(o=n.options.infinite?n.options.slidesToShow+n.currentSlide:n.currentSlide,s=Math.ceil(o+n.options.slidesToShow),!0===n.options.fade&&(o>0&&o--,s<=n.slideCount&&s++)),t=n.$slider.find(".slick-slide").slice(o,s),"anticipated"===n.options.lazyLoad)for(var r=o-1,l=s,d=n.$slider.find(".slick-slide"),a=0;a<n.options.slidesToScroll;a++)r<0&&(r=n.slideCount-1),t=(t=t.add(d.eq(r))).add(d.eq(l)),r--,l++;e(t),n.slideCount<=n.options.slidesToShow?e(n.$slider.find(".slick-slide")):n.currentSlide>=n.slideCount-n.options.slidesToShow?e(n.$slider.find(".slick-cloned").slice(0,n.options.slidesToShow)):0===n.currentSlide&&e(n.$slider.find(".slick-cloned").slice(-1*n.options.slidesToShow))},e.prototype.loadSlider=function(){var i=this;i.setPosition(),i.$slideTrack.css({opacity:1}),i.$slider.removeClass("slick-loading"),i.initUI(),"progressive"===i.options.lazyLoad&&i.progressiveLazyLoad()},e.prototype.next=e.prototype.slickNext=function(){this.changeSlide({data:{message:"next"}})},e.prototype.orientationChange=function(){var i=this;i.checkResponsive(),i.setPosition()},e.prototype.pause=e.prototype.slickPause=function(){var i=this;i.autoPlayClear(),i.paused=!0},e.prototype.play=e.prototype.slickPlay=function(){var i=this;i.autoPlay(),i.options.autoplay=!0,i.paused=!1,i.focussed=!1,i.interrupted=!1},e.prototype.postSlide=function(e){var t=this;t.unslicked||(t.$slider.trigger("afterChange",[t,e]),t.animating=!1,t.slideCount>t.options.slidesToShow&&t.setPosition(),t.swipeLeft=null,t.options.autoplay&&t.autoPlay(),!0===t.options.accessibility&&(t.initADA(),t.options.focusOnChange&&i(t.$slides.get(t.currentSlide)).attr("tabindex",0).focus()))},e.prototype.prev=e.prototype.slickPrev=function(){this.changeSlide({data:{message:"previous"}})},e.prototype.preventDefault=function(i){i.preventDefault()},e.prototype.progressiveLazyLoad=function(e){e=e||1;var t,o,s,n,r,l=this,d=i("img[data-lazy]",l.$slider);d.length?(t=d.first(),o=t.attr("data-lazy"),s=t.attr("data-srcset"),n=t.attr("data-sizes")||l.$slider.attr("data-sizes"),(r=document.createElement("img")).onload=function(){s&&(t.attr("srcset",s),n&&t.attr("sizes",n)),t.attr("src",o).removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading"),!0===l.options.adaptiveHeight&&l.setPosition(),l.$slider.trigger("lazyLoaded",[l,t,o]),l.progressiveLazyLoad()},r.onerror=function(){e<3?setTimeout(function(){l.progressiveLazyLoad(e+1)},500):(t.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),l.$slider.trigger("lazyLoadError",[l,t,o]),l.progressiveLazyLoad())},r.src=o):l.$slider.trigger("allImagesLoaded",[l])},e.prototype.refresh=function(e){var t,o,s=this;o=s.slideCount-s.options.slidesToShow,!s.options.infinite&&s.currentSlide>o&&(s.currentSlide=o),s.slideCount<=s.options.slidesToShow&&(s.currentSlide=0),t=s.currentSlide,s.destroy(!0),i.extend(s,s.initials,{currentSlide:t}),s.init(),e||s.changeSlide({data:{message:"index",index:t}},!1)},e.prototype.registerBreakpoints=function(){var e,t,o,s=this,n=s.options.responsive||null;if("array"===i.type(n)&&n.length){s.respondTo=s.options.respondTo||"window";for(e in n)if(o=s.breakpoints.length-1,n.hasOwnProperty(e)){for(t=n[e].breakpoint;o>=0;)s.breakpoints[o]&&s.breakpoints[o]===t&&s.breakpoints.splice(o,1),o--;s.breakpoints.push(t),s.breakpointSettings[t]=n[e].settings}s.breakpoints.sort(function(i,e){return s.options.mobileFirst?i-e:e-i})}},e.prototype.reinit=function(){var e=this;e.$slides=e.$slideTrack.children(e.options.slide).addClass("slick-slide"),e.slideCount=e.$slides.length,e.currentSlide>=e.slideCount&&0!==e.currentSlide&&(e.currentSlide=e.currentSlide-e.options.slidesToScroll),e.slideCount<=e.options.slidesToShow&&(e.currentSlide=0),e.registerBreakpoints(),e.setProps(),e.setupInfinite(),e.buildArrows(),e.updateArrows(),e.initArrowEvents(),e.buildDots(),e.updateDots(),e.initDotEvents(),e.cleanUpSlideEvents(),e.initSlideEvents(),e.checkResponsive(!1,!0),!0===e.options.focusOnSelect&&i(e.$slideTrack).children().on("click.slick",e.selectHandler),e.setSlideClasses("number"==typeof e.currentSlide?e.currentSlide:0),e.setPosition(),e.focusHandler(),e.paused=!e.options.autoplay,e.autoPlay(),e.$slider.trigger("reInit",[e])},e.prototype.resize=function(){var e=this;i(window).width()!==e.windowWidth&&(clearTimeout(e.windowDelay),e.windowDelay=window.setTimeout(function(){e.windowWidth=i(window).width(),e.checkResponsive(),e.unslicked||e.setPosition()},50))},e.prototype.removeSlide=e.prototype.slickRemove=function(i,e,t){var o=this;if(i="boolean"==typeof i?!0===(e=i)?0:o.slideCount-1:!0===e?--i:i,o.slideCount<1||i<0||i>o.slideCount-1)return!1;o.unload(),!0===t?o.$slideTrack.children().remove():o.$slideTrack.children(this.options.slide).eq(i).remove(),o.$slides=o.$slideTrack.children(this.options.slide),o.$slideTrack.children(this.options.slide).detach(),o.$slideTrack.append(o.$slides),o.$slidesCache=o.$slides,o.reinit()},e.prototype.setCSS=function(i){var e,t,o=this,s={};!0===o.options.rtl&&(i=-i),e="left"==o.positionProp?Math.ceil(i)+"px":"0px",t="top"==o.positionProp?Math.ceil(i)+"px":"0px",s[o.positionProp]=i,!1===o.transformsEnabled?o.$slideTrack.css(s):(s={},!1===o.cssTransitions?(s[o.animType]="translate("+e+", "+t+")",o.$slideTrack.css(s)):(s[o.animType]="translate3d("+e+", "+t+", 0px)",o.$slideTrack.css(s)))},e.prototype.setDimensions=function(){var i=this;!1===i.options.vertical?!0===i.options.centerMode&&i.$list.css({padding:"0px "+i.options.centerPadding}):(i.$list.height(i.$slides.first().outerHeight(!0)*i.options.slidesToShow),!0===i.options.centerMode&&i.$list.css({padding:i.options.centerPadding+" 0px"})),i.listWidth=i.$list.width(),i.listHeight=i.$list.height(),!1===i.options.vertical&&!1===i.options.variableWidth?(i.slideWidth=Math.ceil(i.listWidth/i.options.slidesToShow),i.$slideTrack.width(Math.ceil(i.slideWidth*i.$slideTrack.children(".slick-slide").length))):!0===i.options.variableWidth?i.$slideTrack.width(5e3*i.slideCount):(i.slideWidth=Math.ceil(i.listWidth),i.$slideTrack.height(Math.ceil(i.$slides.first().outerHeight(!0)*i.$slideTrack.children(".slick-slide").length)));var e=i.$slides.first().outerWidth(!0)-i.$slides.first().width();!1===i.options.variableWidth&&i.$slideTrack.children(".slick-slide").width(i.slideWidth-e)},e.prototype.setFade=function(){var e,t=this;t.$slides.each(function(o,s){e=t.slideWidth*o*-1,!0===t.options.rtl?i(s).css({position:"relative",right:e,top:0,zIndex:t.options.zIndex-2,opacity:0}):i(s).css({position:"relative",left:e,top:0,zIndex:t.options.zIndex-2,opacity:0})}),t.$slides.eq(t.currentSlide).css({zIndex:t.options.zIndex-1,opacity:1})},e.prototype.setHeight=function(){var i=this;if(1===i.options.slidesToShow&&!0===i.options.adaptiveHeight&&!1===i.options.vertical){var e=i.$slides.eq(i.currentSlide).outerHeight(!0);i.$list.css("height",e)}},e.prototype.setOption=e.prototype.slickSetOption=function(){var e,t,o,s,n,r=this,l=!1;if("object"===i.type(arguments[0])?(o=arguments[0],l=arguments[1],n="multiple"):"string"===i.type(arguments[0])&&(o=arguments[0],s=arguments[1],l=arguments[2],"responsive"===arguments[0]&&"array"===i.type(arguments[1])?n="responsive":void 0!==arguments[1]&&(n="single")),"single"===n)r.options[o]=s;else if("multiple"===n)i.each(o,function(i,e){r.options[i]=e});else if("responsive"===n)for(t in s)if("array"!==i.type(r.options.responsive))r.options.responsive=[s[t]];else{for(e=r.options.responsive.length-1;e>=0;)r.options.responsive[e].breakpoint===s[t].breakpoint&&r.options.responsive.splice(e,1),e--;r.options.responsive.push(s[t])}l&&(r.unload(),r.reinit())},e.prototype.setPosition=function(){var i=this;i.setDimensions(),i.setHeight(),!1===i.options.fade?i.setCSS(i.getLeft(i.currentSlide)):i.setFade(),i.$slider.trigger("setPosition",[i])},e.prototype.setProps=function(){var i=this,e=document.body.style;i.positionProp=!0===i.options.vertical?"top":"left","top"===i.positionProp?i.$slider.addClass("slick-vertical"):i.$slider.removeClass("slick-vertical"),void 0===e.WebkitTransition&&void 0===e.MozTransition&&void 0===e.msTransition||!0===i.options.useCSS&&(i.cssTransitions=!0),i.options.fade&&("number"==typeof i.options.zIndex?i.options.zIndex<3&&(i.options.zIndex=3):i.options.zIndex=i.defaults.zIndex),void 0!==e.OTransform&&(i.animType="OTransform",i.transformType="-o-transform",i.transitionType="OTransition",void 0===e.perspectiveProperty&&void 0===e.webkitPerspective&&(i.animType=!1)),void 0!==e.MozTransform&&(i.animType="MozTransform",i.transformType="-moz-transform",i.transitionType="MozTransition",void 0===e.perspectiveProperty&&void 0===e.MozPerspective&&(i.animType=!1)),void 0!==e.webkitTransform&&(i.animType="webkitTransform",i.transformType="-webkit-transform",i.transitionType="webkitTransition",void 0===e.perspectiveProperty&&void 0===e.webkitPerspective&&(i.animType=!1)),void 0!==e.msTransform&&(i.animType="msTransform",i.transformType="-ms-transform",i.transitionType="msTransition",void 0===e.msTransform&&(i.animType=!1)),void 0!==e.transform&&!1!==i.animType&&(i.animType="transform",i.transformType="transform",i.transitionType="transition"),i.transformsEnabled=i.options.useTransform&&null!==i.animType&&!1!==i.animType},e.prototype.setSlideClasses=function(i){var e,t,o,s,n=this;if(t=n.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden","true"),n.$slides.eq(i).addClass("slick-current"),!0===n.options.centerMode){var r=n.options.slidesToShow%2==0?1:0;e=Math.floor(n.options.slidesToShow/2),!0===n.options.infinite&&(i>=e&&i<=n.slideCount-1-e?n.$slides.slice(i-e+r,i+e+1).addClass("slick-active").attr("aria-hidden","false"):(o=n.options.slidesToShow+i,t.slice(o-e+1+r,o+e+2).addClass("slick-active").attr("aria-hidden","false")),0===i?t.eq(t.length-1-n.options.slidesToShow).addClass("slick-center"):i===n.slideCount-1&&t.eq(n.options.slidesToShow).addClass("slick-center")),n.$slides.eq(i).addClass("slick-center")}else i>=0&&i<=n.slideCount-n.options.slidesToShow?n.$slides.slice(i,i+n.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false"):t.length<=n.options.slidesToShow?t.addClass("slick-active").attr("aria-hidden","false"):(s=n.slideCount%n.options.slidesToShow,o=!0===n.options.infinite?n.options.slidesToShow+i:i,n.options.slidesToShow==n.options.slidesToScroll&&n.slideCount-i<n.options.slidesToShow?t.slice(o-(n.options.slidesToShow-s),o+s).addClass("slick-active").attr("aria-hidden","false"):t.slice(o,o+n.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false"));"ondemand"!==n.options.lazyLoad&&"anticipated"!==n.options.lazyLoad||n.lazyLoad()},e.prototype.setupInfinite=function(){var e,t,o,s=this;if(!0===s.options.fade&&(s.options.centerMode=!1),!0===s.options.infinite&&!1===s.options.fade&&(t=null,s.slideCount>s.options.slidesToShow)){for(o=!0===s.options.centerMode?s.options.slidesToShow+1:s.options.slidesToShow,e=s.slideCount;e>s.slideCount-o;e-=1)t=e-1,i(s.$slides[t]).clone(!0).attr("id","").attr("data-slick-index",t-s.slideCount).prependTo(s.$slideTrack).addClass("slick-cloned");for(e=0;e<o+s.slideCount;e+=1)t=e,i(s.$slides[t]).clone(!0).attr("id","").attr("data-slick-index",t+s.slideCount).appendTo(s.$slideTrack).addClass("slick-cloned");s.$slideTrack.find(".slick-cloned").find("[id]").each(function(){i(this).attr("id","")})}},e.prototype.interrupt=function(i){var e=this;i||e.autoPlay(),e.interrupted=i},e.prototype.selectHandler=function(e){var t=this,o=i(e.target).is(".slick-slide")?i(e.target):i(e.target).parents(".slick-slide"),s=parseInt(o.attr("data-slick-index"));s||(s=0),t.slideCount<=t.options.slidesToShow?t.slideHandler(s,!1,!0):t.slideHandler(s)},e.prototype.slideHandler=function(i,e,t){var o,s,n,r,l,d=null,a=this;if(e=e||!1,!(!0===a.animating&&!0===a.options.waitForAnimate||!0===a.options.fade&&a.currentSlide===i))if(!1===e&&a.asNavFor(i),o=i,d=a.getLeft(o),r=a.getLeft(a.currentSlide),a.currentLeft=null===a.swipeLeft?r:a.swipeLeft,!1===a.options.infinite&&!1===a.options.centerMode&&(i<0||i>a.getDotCount()*a.options.slidesToScroll))!1===a.options.fade&&(o=a.currentSlide,!0!==t?a.animateSlide(r,function(){a.postSlide(o)}):a.postSlide(o));else if(!1===a.options.infinite&&!0===a.options.centerMode&&(i<0||i>a.slideCount-a.options.slidesToScroll))!1===a.options.fade&&(o=a.currentSlide,!0!==t?a.animateSlide(r,function(){a.postSlide(o)}):a.postSlide(o));else{if(a.options.autoplay&&clearInterval(a.autoPlayTimer),s=o<0?a.slideCount%a.options.slidesToScroll!=0?a.slideCount-a.slideCount%a.options.slidesToScroll:a.slideCount+o:o>=a.slideCount?a.slideCount%a.options.slidesToScroll!=0?0:o-a.slideCount:o,a.animating=!0,a.$slider.trigger("beforeChange",[a,a.currentSlide,s]),n=a.currentSlide,a.currentSlide=s,a.setSlideClasses(a.currentSlide),a.options.asNavFor&&(l=(l=a.getNavTarget()).slick("getSlick")).slideCount<=l.options.slidesToShow&&l.setSlideClasses(a.currentSlide),a.updateDots(),a.updateArrows(),!0===a.options.fade)return!0!==t?(a.fadeSlideOut(n),a.fadeSlide(s,function(){a.postSlide(s)})):a.postSlide(s),void a.animateHeight();!0!==t?a.animateSlide(d,function(){a.postSlide(s)}):a.postSlide(s)}},e.prototype.startLoad=function(){var i=this;!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow.hide(),i.$nextArrow.hide()),!0===i.options.dots&&i.slideCount>i.options.slidesToShow&&i.$dots.hide(),i.$slider.addClass("slick-loading")},e.prototype.swipeDirection=function(){var i,e,t,o,s=this;return i=s.touchObject.startX-s.touchObject.curX,e=s.touchObject.startY-s.touchObject.curY,t=Math.atan2(e,i),(o=Math.round(180*t/Math.PI))<0&&(o=360-Math.abs(o)),o<=45&&o>=0?!1===s.options.rtl?"left":"right":o<=360&&o>=315?!1===s.options.rtl?"left":"right":o>=135&&o<=225?!1===s.options.rtl?"right":"left":!0===s.options.verticalSwiping?o>=35&&o<=135?"down":"up":"vertical"},e.prototype.swipeEnd=function(i){var e,t,o=this;if(o.dragging=!1,o.swiping=!1,o.scrolling)return o.scrolling=!1,!1;if(o.interrupted=!1,o.shouldClick=!(o.touchObject.swipeLength>10),void 0===o.touchObject.curX)return!1;if(!0===o.touchObject.edgeHit&&o.$slider.trigger("edge",[o,o.swipeDirection()]),o.touchObject.swipeLength>=o.touchObject.minSwipe){switch(t=o.swipeDirection()){case"left":case"down":e=o.options.swipeToSlide?o.checkNavigable(o.currentSlide+o.getSlideCount()):o.currentSlide+o.getSlideCount(),o.currentDirection=0;break;case"right":case"up":e=o.options.swipeToSlide?o.checkNavigable(o.currentSlide-o.getSlideCount()):o.currentSlide-o.getSlideCount(),o.currentDirection=1}"vertical"!=t&&(o.slideHandler(e),o.touchObject={},o.$slider.trigger("swipe",[o,t]))}else o.touchObject.startX!==o.touchObject.curX&&(o.slideHandler(o.currentSlide),o.touchObject={})},e.prototype.swipeHandler=function(i){var e=this;if(!(!1===e.options.swipe||"ontouchend"in document&&!1===e.options.swipe||!1===e.options.draggable&&-1!==i.type.indexOf("mouse")))switch(e.touchObject.fingerCount=i.originalEvent&&void 0!==i.originalEvent.touches?i.originalEvent.touches.length:1,e.touchObject.minSwipe=e.listWidth/e.options.touchThreshold,!0===e.options.verticalSwiping&&(e.touchObject.minSwipe=e.listHeight/e.options.touchThreshold),i.data.action){case"start":e.swipeStart(i);break;case"move":e.swipeMove(i);break;case"end":e.swipeEnd(i)}},e.prototype.swipeMove=function(i){var e,t,o,s,n,r,l=this;return n=void 0!==i.originalEvent?i.originalEvent.touches:null,!(!l.dragging||l.scrolling||n&&1!==n.length)&&(e=l.getLeft(l.currentSlide),l.touchObject.curX=void 0!==n?n[0].pageX:i.clientX,l.touchObject.curY=void 0!==n?n[0].pageY:i.clientY,l.touchObject.swipeLength=Math.round(Math.sqrt(Math.pow(l.touchObject.curX-l.touchObject.startX,2))),r=Math.round(Math.sqrt(Math.pow(l.touchObject.curY-l.touchObject.startY,2))),!l.options.verticalSwiping&&!l.swiping&&r>4?(l.scrolling=!0,!1):(!0===l.options.verticalSwiping&&(l.touchObject.swipeLength=r),t=l.swipeDirection(),void 0!==i.originalEvent&&l.touchObject.swipeLength>4&&(l.swiping=!0,i.preventDefault()),s=(!1===l.options.rtl?1:-1)*(l.touchObject.curX>l.touchObject.startX?1:-1),!0===l.options.verticalSwiping&&(s=l.touchObject.curY>l.touchObject.startY?1:-1),o=l.touchObject.swipeLength,l.touchObject.edgeHit=!1,!1===l.options.infinite&&(0===l.currentSlide&&"right"===t||l.currentSlide>=l.getDotCount()&&"left"===t)&&(o=l.touchObject.swipeLength*l.options.edgeFriction,l.touchObject.edgeHit=!0),!1===l.options.vertical?l.swipeLeft=e+o*s:l.swipeLeft=e+o*(l.$list.height()/l.listWidth)*s,!0===l.options.verticalSwiping&&(l.swipeLeft=e+o*s),!0!==l.options.fade&&!1!==l.options.touchMove&&(!0===l.animating?(l.swipeLeft=null,!1):void l.setCSS(l.swipeLeft))))},e.prototype.swipeStart=function(i){var e,t=this;if(t.interrupted=!0,1!==t.touchObject.fingerCount||t.slideCount<=t.options.slidesToShow)return t.touchObject={},!1;void 0!==i.originalEvent&&void 0!==i.originalEvent.touches&&(e=i.originalEvent.touches[0]),t.touchObject.startX=t.touchObject.curX=void 0!==e?e.pageX:i.clientX,t.touchObject.startY=t.touchObject.curY=void 0!==e?e.pageY:i.clientY,t.dragging=!0},e.prototype.unfilterSlides=e.prototype.slickUnfilter=function(){var i=this;null!==i.$slidesCache&&(i.unload(),i.$slideTrack.children(this.options.slide).detach(),i.$slidesCache.appendTo(i.$slideTrack),i.reinit())},e.prototype.unload=function(){var e=this;i(".slick-cloned",e.$slider).remove(),e.$dots&&e.$dots.remove(),e.$prevArrow&&e.htmlExpr.test(e.options.prevArrow)&&e.$prevArrow.remove(),e.$nextArrow&&e.htmlExpr.test(e.options.nextArrow)&&e.$nextArrow.remove(),e.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden","true").css("width","")},e.prototype.unslick=function(i){var e=this;e.$slider.trigger("unslick",[e,i]),e.destroy()},e.prototype.updateArrows=function(){var i=this;Math.floor(i.options.slidesToShow/2),!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&!i.options.infinite&&(i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false"),i.$nextArrow.removeClass("slick-disabled").attr("aria-disabled","false"),0===i.currentSlide?(i.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true"),i.$nextArrow.removeClass("slick-disabled").attr("aria-disabled","false")):i.currentSlide>=i.slideCount-i.options.slidesToShow&&!1===i.options.centerMode?(i.$nextArrow.addClass("slick-disabled").attr("aria-disabled","true"),i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false")):i.currentSlide>=i.slideCount-1&&!0===i.options.centerMode&&(i.$nextArrow.addClass("slick-disabled").attr("aria-disabled","true"),i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false")))},e.prototype.updateDots=function(){var i=this;null!==i.$dots&&(i.$dots.find("li").removeClass("slick-active").end(),i.$dots.find("li").eq(Math.floor(i.currentSlide/i.options.slidesToScroll)).addClass("slick-active"))},e.prototype.visibility=function(){var i=this;i.options.autoplay&&(document[i.hidden]?i.interrupted=!0:i.interrupted=!1)},i.fn.slick=function(){var i,t,o=this,s=arguments[0],n=Array.prototype.slice.call(arguments,1),r=o.length;for(i=0;i<r;i++)if("object"==typeof s||void 0===s?o[i].slick=new e(o[i],s):t=o[i].slick[s].apply(o[i].slick,n),void 0!==t)return t;return o}});


// ==================================================
// fancyBox v3.5.2
//
// Licensed GPLv3 for open source use
// or fancyBox Commercial License for commercial use
//
// http://fancyapps.com/fancybox/
// Copyright 2018 fancyApps
//
// ==================================================
!function(t,e,n,o){"use strict";function a(t,e){var o,a,i,s=[],r=0;t&&t.isDefaultPrevented()||(t.preventDefault(),e=e||{},t&&t.data&&(e=h(t.data.options,e)),o=e.$target||n(t.currentTarget).trigger("blur"),i=n.fancybox.getInstance(),i&&i.$trigger&&i.$trigger.is(o)||(e.selector?s=n(e.selector):(a=o.attr("data-fancybox")||"",a?(s=t.data?t.data.items:[],s=s.length?s.filter('[data-fancybox="'+a+'"]'):n('[data-fancybox="'+a+'"]')):s=[o]),r=n(s).index(o),r<0&&(r=0),i=n.fancybox.open(s,e,r),i.$trigger=o))}if(t.console=t.console||{info:function(t){}},n){if(n.fn.fancybox)return void console.info("fancyBox already initialized");var i={closeExisting:!1,loop:!1,gutter:50,keyboard:!0,preventCaptionOverlap:!0,arrows:!0,infobar:!0,smallBtn:"auto",toolbar:"auto",buttons:["zoom","slideShow","thumbs","close"],idleTime:3,protect:!1,modal:!1,image:{preload:!1},ajax:{settings:{data:{fancybox:!0}}},iframe:{tpl:'<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" allowfullscreen allow="autoplay; fullscreen" src=""></iframe>',preload:!0,css:{},attr:{scrolling:"auto"}},video:{tpl:'<video class="fancybox-video" controls controlsList="nodownload" poster="{{poster}}"><source src="{{src}}" type="{{format}}" />Sorry, your browser doesn\'t support embedded videos, <a href="{{src}}">download</a> and watch with your favorite video player!</video>',format:"",autoStart:!0},defaultType:"image",animationEffect:"zoom",animationDuration:366,zoomOpacity:"auto",transitionEffect:"fade",transitionDuration:366,slideClass:"",baseClass:"",baseTpl:'<div class="fancybox-container" role="dialog" tabindex="-1"><div class="fancybox-bg"></div><div class="fancybox-inner"><div class="fancybox-infobar"><span data-fancybox-index></span>&nbsp;/&nbsp;<span data-fancybox-count></span></div><div class="fancybox-toolbar">{{buttons}}</div><div class="fancybox-navigation">{{arrows}}</div><div class="fancybox-stage"></div><div class="fancybox-caption"></div></div></div>',spinnerTpl:'<div class="fancybox-loading"></div>',errorTpl:'<div class="fancybox-error"><p>{{ERROR}}</p></div>',btnTpl:{download:'<a download data-fancybox-download class="fancybox-button fancybox-button--download" title="{{DOWNLOAD}}" href="javascript:;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.62 17.09V19H5.38v-1.91zm-2.97-6.96L17 11.45l-5 4.87-5-4.87 1.36-1.32 2.68 2.64V5h1.92v7.77z"/></svg></a>',zoom:'<button data-fancybox-zoom class="fancybox-button fancybox-button--zoom" title="{{ZOOM}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.7 17.3l-3-3a5.9 5.9 0 0 0-.6-7.6 5.9 5.9 0 0 0-8.4 0 5.9 5.9 0 0 0 0 8.4 5.9 5.9 0 0 0 7.7.7l3 3a1 1 0 0 0 1.3 0c.4-.5.4-1 0-1.5zM8.1 13.8a4 4 0 0 1 0-5.7 4 4 0 0 1 5.7 0 4 4 0 0 1 0 5.7 4 4 0 0 1-5.7 0z"/></svg></button>',close:'<button data-fancybox-close class="fancybox-button fancybox-button--close" title="{{CLOSE}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 10.6L6.6 5.2 5.2 6.6l5.4 5.4-5.4 5.4 1.4 1.4 5.4-5.4 5.4 5.4 1.4-1.4-5.4-5.4 5.4-5.4-1.4-1.4-5.4 5.4z"/></svg></button>',arrowLeft:'<button data-fancybox-prev class="fancybox-button fancybox-button--arrow_left" title="{{PREV}}"><div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M11.28 15.7l-1.34 1.37L5 12l4.94-5.07 1.34 1.38-2.68 2.72H19v1.94H8.6z"/></svg></div></button>',arrowRight:'<button data-fancybox-next class="fancybox-button fancybox-button--arrow_right" title="{{NEXT}}"><div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.4 12.97l-2.68 2.72 1.34 1.38L19 12l-4.94-5.07-1.34 1.38 2.68 2.72H5v1.94z"/></svg></div></button>',smallBtn:'<button type="button" data-fancybox-close class="fancybox-button fancybox-close-small" title="{{CLOSE}}"><svg xmlns="http://www.w3.org/2000/svg" version="1" viewBox="0 0 24 24"><path d="M13 12l5-5-1-1-5 5-5-5-1 1 5 5-5 5 1 1 5-5 5 5 1-1z"/></svg></button>'},parentEl:"body",hideScrollbar:!0,autoFocus:!0,backFocus:!0,trapFocus:!0,fullScreen:{autoStart:!1},touch:{vertical:!0,momentum:!0},hash:null,media:{},slideShow:{autoStart:!1,speed:3e3},thumbs:{autoStart:!1,hideOnClose:!0,parentEl:".fancybox-container",axis:"y"},wheel:"auto",onInit:n.noop,beforeLoad:n.noop,afterLoad:n.noop,beforeShow:n.noop,afterShow:n.noop,beforeClose:n.noop,afterClose:n.noop,onActivate:n.noop,onDeactivate:n.noop,clickContent:function(t,e){return"image"===t.type&&"zoom"},clickSlide:"close",clickOutside:"close",dblclickContent:!1,dblclickSlide:!1,dblclickOutside:!1,mobile:{preventCaptionOverlap:!1,idleTime:!1,clickContent:function(t,e){return"image"===t.type&&"toggleControls"},clickSlide:function(t,e){return"image"===t.type?"toggleControls":"close"},dblclickContent:function(t,e){return"image"===t.type&&"zoom"},dblclickSlide:function(t,e){return"image"===t.type&&"zoom"}},lang:"en",i18n:{en:{CLOSE:"Close",NEXT:"Next",PREV:"Previous",ERROR:"The requested content cannot be loaded. <br/> Please try again later.",PLAY_START:"Start slideshow",PLAY_STOP:"Pause slideshow",FULL_SCREEN:"Full screen",THUMBS:"Thumbnails",DOWNLOAD:"Download",SHARE:"Share",ZOOM:"Zoom"},de:{CLOSE:"Schliessen",NEXT:"Weiter",PREV:"Zurück",ERROR:"Die angeforderten Daten konnten nicht geladen werden. <br/> Bitte versuchen Sie es später nochmal.",PLAY_START:"Diaschau starten",PLAY_STOP:"Diaschau beenden",FULL_SCREEN:"Vollbild",THUMBS:"Vorschaubilder",DOWNLOAD:"Herunterladen",SHARE:"Teilen",ZOOM:"Maßstab"}}},s=n(t),r=n(e),c=0,l=function(t){return t&&t.hasOwnProperty&&t instanceof n},d=function(){return t.requestAnimationFrame||t.webkitRequestAnimationFrame||t.mozRequestAnimationFrame||t.oRequestAnimationFrame||function(e){return t.setTimeout(e,1e3/60)}}(),u=function(){return t.cancelAnimationFrame||t.webkitCancelAnimationFrame||t.mozCancelAnimationFrame||t.oCancelAnimationFrame||function(e){t.clearTimeout(e)}}(),f=function(){var t,n=e.createElement("fakeelement"),a={transition:"transitionend",OTransition:"oTransitionEnd",MozTransition:"transitionend",WebkitTransition:"webkitTransitionEnd"};for(t in a)if(n.style[t]!==o)return a[t];return"transitionend"}(),p=function(t){return t&&t.length&&t[0].offsetHeight},h=function(t,e){var o=n.extend(!0,{},t,e);return n.each(e,function(t,e){n.isArray(e)&&(o[t]=e)}),o},g=function(t){var o,a;return!(!t||t.ownerDocument!==e)&&(n(".fancybox-container").css("pointer-events","none"),o={x:t.getBoundingClientRect().left+t.offsetWidth/2,y:t.getBoundingClientRect().top+t.offsetHeight/2},a=e.elementFromPoint(o.x,o.y)===t,n(".fancybox-container").css("pointer-events",""),a)},b=function(t,e,o){var a=this;a.opts=h({index:o},n.fancybox.defaults),n.isPlainObject(e)&&(a.opts=h(a.opts,e)),n.fancybox.isMobile&&(a.opts=h(a.opts,a.opts.mobile)),a.id=a.opts.id||++c,a.currIndex=parseInt(a.opts.index,10)||0,a.prevIndex=null,a.prevPos=null,a.currPos=0,a.firstRun=!0,a.group=[],a.slides={},a.addContent(t),a.group.length&&a.init()};n.extend(b.prototype,{init:function(){var o,a,i=this,s=i.group[i.currIndex],r=s.opts;r.closeExisting&&n.fancybox.close(!0),n("body").addClass("fancybox-active"),!n.fancybox.getInstance()&&r.hideScrollbar!==!1&&!n.fancybox.isMobile&&e.body.scrollHeight>t.innerHeight&&(n("head").append('<style id="fancybox-style-noscroll" type="text/css">.compensate-for-scrollbar{margin-right:'+(t.innerWidth-e.documentElement.clientWidth)+"px;}</style>"),n("body").addClass("compensate-for-scrollbar")),a="",n.each(r.buttons,function(t,e){a+=r.btnTpl[e]||""}),o=n(i.translate(i,r.baseTpl.replace("{{buttons}}",a).replace("{{arrows}}",r.btnTpl.arrowLeft+r.btnTpl.arrowRight))).attr("id","fancybox-container-"+i.id).addClass(r.baseClass).data("FancyBox",i).appendTo(r.parentEl),i.$refs={container:o},["bg","inner","infobar","toolbar","stage","caption","navigation"].forEach(function(t){i.$refs[t]=o.find(".fancybox-"+t)}),i.trigger("onInit"),i.activate(),i.jumpTo(i.currIndex)},translate:function(t,e){var n=t.opts.i18n[t.opts.lang]||t.opts.i18n.en;return e.replace(/\{\{(\w+)\}\}/g,function(t,e){var a=n[e];return a===o?t:a})},addContent:function(t){var e,a=this,i=n.makeArray(t);n.each(i,function(t,e){var i,s,r,c,l,d={},u={};n.isPlainObject(e)?(d=e,u=e.opts||e):"object"===n.type(e)&&n(e).length?(i=n(e),u=i.data()||{},u=n.extend(!0,{},u,u.options),u.$orig=i,d.src=a.opts.src||u.src||i.attr("href"),d.type||d.src||(d.type="inline",d.src=e)):d={type:"html",src:e+""},d.opts=n.extend(!0,{},a.opts,u),n.isArray(u.buttons)&&(d.opts.buttons=u.buttons),n.fancybox.isMobile&&d.opts.mobile&&(d.opts=h(d.opts,d.opts.mobile)),s=d.type||d.opts.type,c=d.src||"",!s&&c&&((r=c.match(/\.(mp4|mov|ogv|webm)((\?|#).*)?$/i))?(s="video",d.opts.video.format||(d.opts.video.format="video/"+("ogv"===r[1]?"ogg":r[1]))):c.match(/(^data:image\/[a-z0-9+\/=]*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg|ico)((\?|#).*)?$)/i)?s="image":c.match(/\.(pdf)((\?|#).*)?$/i)?(s="iframe",d=n.extend(!0,d,{contentType:"pdf",opts:{iframe:{preload:!1}}})):"#"===c.charAt(0)&&(s="inline")),s?d.type=s:a.trigger("objectNeedsType",d),d.contentType||(d.contentType=n.inArray(d.type,["html","inline","ajax"])>-1?"html":d.type),d.index=a.group.length,"auto"==d.opts.smallBtn&&(d.opts.smallBtn=n.inArray(d.type,["html","inline","ajax"])>-1),"auto"===d.opts.toolbar&&(d.opts.toolbar=!d.opts.smallBtn),d.$thumb=d.opts.$thumb||null,d.opts.$trigger&&d.index===a.opts.index&&(d.$thumb=d.opts.$trigger.find("img:first"),d.$thumb.length&&(d.opts.$orig=d.opts.$trigger)),d.$thumb&&d.$thumb.length||!d.opts.$orig||(d.$thumb=d.opts.$orig.find("img:first")),d.$thumb&&!d.$thumb.length&&(d.$thumb=null),d.thumb=d.opts.thumb||(d.$thumb?d.$thumb[0].src:null),"function"===n.type(d.opts.caption)&&(d.opts.caption=d.opts.caption.apply(e,[a,d])),"function"===n.type(a.opts.caption)&&(d.opts.caption=a.opts.caption.apply(e,[a,d])),d.opts.caption instanceof n||(d.opts.caption=d.opts.caption===o?"":d.opts.caption+""),"ajax"===d.type&&(l=c.split(/\s+/,2),l.length>1&&(d.src=l.shift(),d.opts.filter=l.shift())),d.opts.modal&&(d.opts=n.extend(!0,d.opts,{trapFocus:!0,infobar:0,toolbar:0,smallBtn:0,keyboard:0,slideShow:0,fullScreen:0,thumbs:0,touch:0,clickContent:!1,clickSlide:!1,clickOutside:!1,dblclickContent:!1,dblclickSlide:!1,dblclickOutside:!1})),a.group.push(d)}),Object.keys(a.slides).length&&(a.updateControls(),e=a.Thumbs,e&&e.isActive&&(e.create(),e.focus()))},addEvents:function(){var e=this;e.removeEvents(),e.$refs.container.on("click.fb-close","[data-fancybox-close]",function(t){t.stopPropagation(),t.preventDefault(),e.close(t)}).on("touchstart.fb-prev click.fb-prev","[data-fancybox-prev]",function(t){t.stopPropagation(),t.preventDefault(),e.previous()}).on("touchstart.fb-next click.fb-next","[data-fancybox-next]",function(t){t.stopPropagation(),t.preventDefault(),e.next()}).on("click.fb","[data-fancybox-zoom]",function(t){e[e.isScaledDown()?"scaleToActual":"scaleToFit"]()}),s.on("orientationchange.fb resize.fb",function(t){t&&t.originalEvent&&"resize"===t.originalEvent.type?(e.requestId&&u(e.requestId),e.requestId=d(function(){e.update(t)})):(e.current&&"iframe"===e.current.type&&e.$refs.stage.hide(),setTimeout(function(){e.$refs.stage.show(),e.update(t)},n.fancybox.isMobile?600:250))}),r.on("keydown.fb",function(t){var o=n.fancybox?n.fancybox.getInstance():null,a=o.current,i=t.keyCode||t.which;if(9==i)return void(a.opts.trapFocus&&e.focus(t));if(!(!a.opts.keyboard||t.ctrlKey||t.altKey||t.shiftKey||n(t.target).is("input")||n(t.target).is("textarea")))return 8===i||27===i?(t.preventDefault(),void e.close(t)):37===i||38===i?(t.preventDefault(),void e.previous()):39===i||40===i?(t.preventDefault(),void e.next()):void e.trigger("afterKeydown",t,i)}),e.group[e.currIndex].opts.idleTime&&(e.idleSecondsCounter=0,r.on("mousemove.fb-idle mouseleave.fb-idle mousedown.fb-idle touchstart.fb-idle touchmove.fb-idle scroll.fb-idle keydown.fb-idle",function(t){e.idleSecondsCounter=0,e.isIdle&&e.showControls(),e.isIdle=!1}),e.idleInterval=t.setInterval(function(){e.idleSecondsCounter++,e.idleSecondsCounter>=e.group[e.currIndex].opts.idleTime&&!e.isDragging&&(e.isIdle=!0,e.idleSecondsCounter=0,e.hideControls())},1e3))},removeEvents:function(){var e=this;s.off("orientationchange.fb resize.fb"),r.off("keydown.fb .fb-idle"),this.$refs.container.off(".fb-close .fb-prev .fb-next"),e.idleInterval&&(t.clearInterval(e.idleInterval),e.idleInterval=null)},previous:function(t){return this.jumpTo(this.currPos-1,t)},next:function(t){return this.jumpTo(this.currPos+1,t)},jumpTo:function(t,e){var a,i,s,r,c,l,d,u,f,h=this,g=h.group.length;if(!(h.isDragging||h.isClosing||h.isAnimating&&h.firstRun)){if(t=parseInt(t,10),s=h.current?h.current.opts.loop:h.opts.loop,!s&&(t<0||t>=g))return!1;if(a=h.firstRun=!Object.keys(h.slides).length,c=h.current,h.prevIndex=h.currIndex,h.prevPos=h.currPos,r=h.createSlide(t),g>1&&((s||r.index<g-1)&&h.createSlide(t+1),(s||r.index>0)&&h.createSlide(t-1)),h.current=r,h.currIndex=r.index,h.currPos=r.pos,h.trigger("beforeShow",a),h.updateControls(),r.forcedDuration=o,n.isNumeric(e)?r.forcedDuration=e:e=r.opts[a?"animationDuration":"transitionDuration"],e=parseInt(e,10),i=h.isMoved(r),r.$slide.addClass("fancybox-slide--current"),a)return r.opts.animationEffect&&e&&h.$refs.container.css("transition-duration",e+"ms"),h.$refs.container.addClass("fancybox-is-open").trigger("focus"),h.loadSlide(r),void h.preload("image");l=n.fancybox.getTranslate(c.$slide),d=n.fancybox.getTranslate(h.$refs.stage),n.each(h.slides,function(t,e){n.fancybox.stop(e.$slide,!0)}),c.pos!==r.pos&&(c.isComplete=!1),c.$slide.removeClass("fancybox-slide--complete fancybox-slide--current"),i?(f=l.left-(c.pos*l.width+c.pos*c.opts.gutter),n.each(h.slides,function(t,o){o.$slide.removeClass("fancybox-animated").removeClass(function(t,e){return(e.match(/(^|\s)fancybox-fx-\S+/g)||[]).join(" ")});var a=o.pos*l.width+o.pos*o.opts.gutter;n.fancybox.setTranslate(o.$slide,{top:0,left:a-d.left+f}),o.pos!==r.pos&&o.$slide.addClass("fancybox-slide--"+(o.pos>r.pos?"next":"previous")),p(o.$slide),n.fancybox.animate(o.$slide,{top:0,left:(o.pos-r.pos)*l.width+(o.pos-r.pos)*o.opts.gutter},e,function(){o.$slide.css({transform:"",opacity:""}).removeClass("fancybox-slide--next fancybox-slide--previous"),o.pos===h.currPos&&h.complete()})})):e&&r.opts.transitionEffect&&(u="fancybox-animated fancybox-fx-"+r.opts.transitionEffect,c.$slide.addClass("fancybox-slide--"+(c.pos>r.pos?"next":"previous")),n.fancybox.animate(c.$slide,u,e,function(){c.$slide.removeClass(u).removeClass("fancybox-slide--next fancybox-slide--previous")},!1)),r.isLoaded?h.revealContent(r):h.loadSlide(r),h.preload("image")}},createSlide:function(t){var e,o,a=this;return o=t%a.group.length,o=o<0?a.group.length+o:o,!a.slides[t]&&a.group[o]&&(e=n('<div class="fancybox-slide"></div>').appendTo(a.$refs.stage),a.slides[t]=n.extend(!0,{},a.group[o],{pos:t,$slide:e,isLoaded:!1}),a.updateSlide(a.slides[t])),a.slides[t]},scaleToActual:function(t,e,a){var i,s,r,c,l,d=this,u=d.current,f=u.$content,p=n.fancybox.getTranslate(u.$slide).width,h=n.fancybox.getTranslate(u.$slide).height,g=u.width,b=u.height;d.isAnimating||d.isMoved()||!f||"image"!=u.type||!u.isLoaded||u.hasError||(d.isAnimating=!0,n.fancybox.stop(f),t=t===o?.5*p:t,e=e===o?.5*h:e,i=n.fancybox.getTranslate(f),i.top-=n.fancybox.getTranslate(u.$slide).top,i.left-=n.fancybox.getTranslate(u.$slide).left,c=g/i.width,l=b/i.height,s=.5*p-.5*g,r=.5*h-.5*b,g>p&&(s=i.left*c-(t*c-t),s>0&&(s=0),s<p-g&&(s=p-g)),b>h&&(r=i.top*l-(e*l-e),r>0&&(r=0),r<h-b&&(r=h-b)),d.updateCursor(g,b),n.fancybox.animate(f,{top:r,left:s,scaleX:c,scaleY:l},a||330,function(){d.isAnimating=!1}),d.SlideShow&&d.SlideShow.isActive&&d.SlideShow.stop())},scaleToFit:function(t){var e,o=this,a=o.current,i=a.$content;o.isAnimating||o.isMoved()||!i||"image"!=a.type||!a.isLoaded||a.hasError||(o.isAnimating=!0,n.fancybox.stop(i),e=o.getFitPos(a),o.updateCursor(e.width,e.height),n.fancybox.animate(i,{top:e.top,left:e.left,scaleX:e.width/i.width(),scaleY:e.height/i.height()},t||330,function(){o.isAnimating=!1}))},getFitPos:function(t){var e,o,a,i,s=this,r=t.$content,c=t.$slide,l=t.width||t.opts.width,d=t.height||t.opts.height,u={};return!!(t.isLoaded&&r&&r.length)&&(e=n.fancybox.getTranslate(s.$refs.stage).width,o=n.fancybox.getTranslate(s.$refs.stage).height,e-=parseFloat(c.css("paddingLeft"))+parseFloat(c.css("paddingRight"))+parseFloat(r.css("marginLeft"))+parseFloat(r.css("marginRight")),o-=parseFloat(c.css("paddingTop"))+parseFloat(c.css("paddingBottom"))+parseFloat(r.css("marginTop"))+parseFloat(r.css("marginBottom")),l&&d||(l=e,d=o),a=Math.min(1,e/l,o/d),l=a*l,d=a*d,l>e-.5&&(l=e),d>o-.5&&(d=o),"image"===t.type?(u.top=Math.floor(.5*(o-d))+parseFloat(c.css("paddingTop")),u.left=Math.floor(.5*(e-l))+parseFloat(c.css("paddingLeft"))):"video"===t.contentType&&(i=t.opts.width&&t.opts.height?l/d:t.opts.ratio||16/9,d>l/i?d=l/i:l>d*i&&(l=d*i)),u.width=l,u.height=d,u)},update:function(t){var e=this;n.each(e.slides,function(n,o){e.updateSlide(o,t)})},updateSlide:function(t,e){var o=this,a=t&&t.$content,i=t.width||t.opts.width,s=t.height||t.opts.height,r=t.$slide;o.adjustCaption(t),a&&(i||s||"video"===t.contentType)&&!t.hasError&&(n.fancybox.stop(a),n.fancybox.setTranslate(a,o.getFitPos(t)),t.pos===o.currPos&&(o.isAnimating=!1,o.updateCursor())),o.adjustLayout(t),r.length&&(r.trigger("refresh"),t.pos===o.currPos&&o.$refs.toolbar.add(o.$refs.navigation.find(".fancybox-button--arrow_right")).toggleClass("compensate-for-scrollbar",r.get(0).scrollHeight>r.get(0).clientHeight)),o.trigger("onUpdate",t,e)},centerSlide:function(t){var e=this,a=e.current,i=a.$slide;!e.isClosing&&a&&(i.siblings().css({transform:"",opacity:""}),i.parent().children().removeClass("fancybox-slide--previous fancybox-slide--next"),n.fancybox.animate(i,{top:0,left:0,opacity:1},t===o?0:t,function(){i.css({transform:"",opacity:""}),a.isComplete||e.complete()},!1))},isMoved:function(t){var e,o,a=t||this.current;return!!a&&(o=n.fancybox.getTranslate(this.$refs.stage),e=n.fancybox.getTranslate(a.$slide),!a.$slide.hasClass("fancybox-animated")&&(Math.abs(e.top-o.top)>.5||Math.abs(e.left-o.left)>.5))},updateCursor:function(t,e){var o,a,i=this,s=i.current,r=i.$refs.container;s&&!i.isClosing&&i.Guestures&&(r.removeClass("fancybox-is-zoomable fancybox-can-zoomIn fancybox-can-zoomOut fancybox-can-swipe fancybox-can-pan"),o=i.canPan(t,e),a=!!o||i.isZoomable(),r.toggleClass("fancybox-is-zoomable",a),n("[data-fancybox-zoom]").prop("disabled",!a),o?r.addClass("fancybox-can-pan"):a&&("zoom"===s.opts.clickContent||n.isFunction(s.opts.clickContent)&&"zoom"==s.opts.clickContent(s))?r.addClass("fancybox-can-zoomIn"):s.opts.touch&&(s.opts.touch.vertical||i.group.length>1)&&"video"!==s.contentType&&r.addClass("fancybox-can-swipe"))},isZoomable:function(){var t,e=this,n=e.current;if(n&&!e.isClosing&&"image"===n.type&&!n.hasError){if(!n.isLoaded)return!0;if(t=e.getFitPos(n),t&&(n.width>t.width||n.height>t.height))return!0}return!1},isScaledDown:function(t,e){var a=this,i=!1,s=a.current,r=s.$content;return t!==o&&e!==o?i=t<s.width&&e<s.height:r&&(i=n.fancybox.getTranslate(r),i=i.width<s.width&&i.height<s.height),i},canPan:function(t,e){var a=this,i=a.current,s=null,r=!1;return"image"===i.type&&(i.isComplete||t&&e)&&!i.hasError&&(r=a.getFitPos(i),t!==o&&e!==o?s={width:t,height:e}:i.isComplete&&(s=n.fancybox.getTranslate(i.$content)),s&&r&&(r=Math.abs(s.width-r.width)>1.5||Math.abs(s.height-r.height)>1.5)),r},loadSlide:function(t){var e,o,a,i=this;if(!t.isLoading&&!t.isLoaded){if(t.isLoading=!0,i.trigger("beforeLoad",t)===!1)return t.isLoading=!1,!1;switch(e=t.type,o=t.$slide,o.off("refresh").trigger("onReset").addClass(t.opts.slideClass),e){case"image":i.setImage(t);break;case"iframe":i.setIframe(t);break;case"html":i.setContent(t,t.src||t.content);break;case"video":i.setContent(t,t.opts.video.tpl.replace(/\{\{src\}\}/gi,t.src).replace("{{format}}",t.opts.videoFormat||t.opts.video.format||"").replace("{{poster}}",t.thumb||""));break;case"inline":n(t.src).length?i.setContent(t,n(t.src)):i.setError(t);break;case"ajax":i.showLoading(t),a=n.ajax(n.extend({},t.opts.ajax.settings,{url:t.src,success:function(e,n){"success"===n&&i.setContent(t,e)},error:function(e,n){e&&"abort"!==n&&i.setError(t)}})),o.one("onReset",function(){a.abort()});break;default:i.setError(t)}return!0}},setImage:function(t){var o,a=this;setTimeout(function(){var e=t.$image;a.isClosing||!t.isLoading||e&&e.length&&e[0].complete||t.hasError||a.showLoading(t)},50),a.checkSrcset(t),t.$content=n('<div class="fancybox-content"></div>').addClass("fancybox-is-hidden").appendTo(t.$slide.addClass("fancybox-slide--image")),t.opts.preload!==!1&&t.opts.width&&t.opts.height&&t.thumb&&(t.width=t.opts.width,t.height=t.opts.height,o=e.createElement("img"),o.onerror=function(){n(this).remove(),t.$ghost=null},o.onload=function(){a.afterLoad(t)},t.$ghost=n(o).addClass("fancybox-image").appendTo(t.$content).attr("src",t.thumb)),a.setBigImage(t)},checkSrcset:function(e){var n,o,a,i,s=e.opts.srcset||e.opts.image.srcset;if(s){a=t.devicePixelRatio||1,i=t.innerWidth*a,o=s.split(",").map(function(t){var e={};return t.trim().split(/\s+/).forEach(function(t,n){var o=parseInt(t.substring(0,t.length-1),10);return 0===n?e.url=t:void(o&&(e.value=o,e.postfix=t[t.length-1]))}),e}),o.sort(function(t,e){return t.value-e.value});for(var r=0;r<o.length;r++){var c=o[r];if("w"===c.postfix&&c.value>=i||"x"===c.postfix&&c.value>=a){n=c;break}}!n&&o.length&&(n=o[o.length-1]),n&&(e.src=n.url,e.width&&e.height&&"w"==n.postfix&&(e.height=e.width/e.height*n.value,e.width=n.value),e.opts.srcset=s)}},setBigImage:function(t){var o=this,a=e.createElement("img"),i=n(a);t.$image=i.one("error",function(){o.setError(t)}).one("load",function(){var e;t.$ghost||(o.resolveImageSlideSize(t,this.naturalWidth,this.naturalHeight),o.afterLoad(t)),o.isClosing||(t.opts.srcset&&(e=t.opts.sizes,e&&"auto"!==e||(e=(t.width/t.height>1&&s.width()/s.height()>1?"100":Math.round(t.width/t.height*100))+"vw"),i.attr("sizes",e).attr("srcset",t.opts.srcset)),t.$ghost&&setTimeout(function(){t.$ghost&&!o.isClosing&&t.$ghost.hide()},Math.min(300,Math.max(1e3,t.height/1600))),o.hideLoading(t))}).addClass("fancybox-image").attr("src",t.src).appendTo(t.$content),(a.complete||"complete"==a.readyState)&&i.naturalWidth&&i.naturalHeight?i.trigger("load"):a.error&&i.trigger("error")},resolveImageSlideSize:function(t,e,n){var o=parseInt(t.opts.width,10),a=parseInt(t.opts.height,10);t.width=e,t.height=n,o>0&&(t.width=o,t.height=Math.floor(o*n/e)),a>0&&(t.width=Math.floor(a*e/n),t.height=a)},setIframe:function(t){var e,a=this,i=t.opts.iframe,s=t.$slide;n.fancybox.isMobile&&(i.css.overflow="scroll"),t.$content=n('<div class="fancybox-content'+(i.preload?" fancybox-is-hidden":"")+'"></div>').css(i.css).appendTo(s),s.addClass("fancybox-slide--"+t.contentType),t.$iframe=e=n(i.tpl.replace(/\{rnd\}/g,(new Date).getTime())).attr(i.attr).appendTo(t.$content),i.preload?(a.showLoading(t),e.on("load.fb error.fb",function(e){this.isReady=1,t.$slide.trigger("refresh"),a.afterLoad(t)}),s.on("refresh.fb",function(){var n,a,r=t.$content,c=i.css.width,l=i.css.height;if(1===e[0].isReady){try{n=e.contents(),a=n.find("body")}catch(t){}a&&a.length&&a.children().length&&(s.css("overflow","visible"),r.css({width:"100%","max-width":"100%",height:"9999px"}),c===o&&(c=Math.ceil(Math.max(a[0].clientWidth,a.outerWidth(!0)))),r.css("width",c?c:"").css("max-width",""),l===o&&(l=Math.ceil(Math.max(a[0].clientHeight,a.outerHeight(!0)))),r.css("height",l?l:""),s.css("overflow","auto")),r.removeClass("fancybox-is-hidden")}})):a.afterLoad(t),e.attr("src",t.src),s.one("onReset",function(){try{n(this).find("iframe").hide().unbind().attr("src","//about:blank")}catch(t){}n(this).off("refresh.fb").empty(),t.isLoaded=!1,t.isRevealed=!1})},setContent:function(t,e){var o=this;o.isClosing||(o.hideLoading(t),t.$content&&n.fancybox.stop(t.$content),t.$slide.empty(),l(e)&&e.parent().length?((e.hasClass("fancybox-content")||e.parent().hasClass("fancybox-content"))&&e.parents(".fancybox-slide").trigger("onReset"),t.$placeholder=n("<div>").hide().insertAfter(e),e.css("display","inline-block")):t.hasError||("string"===n.type(e)&&(e=n("<div>").append(n.trim(e)).contents()),t.opts.filter&&(e=n("<div>").html(e).find(t.opts.filter))),t.$slide.one("onReset",function(){n(this).find("video,audio").trigger("pause"),t.$placeholder&&(t.$placeholder.after(e.removeClass("fancybox-content").hide()).remove(),t.$placeholder=null),t.$smallBtn&&(t.$smallBtn.remove(),t.$smallBtn=null),t.hasError||(n(this).empty(),t.isLoaded=!1,t.isRevealed=!1)}),n(e).appendTo(t.$slide),n(e).is("video,audio")&&(n(e).addClass("fancybox-video"),n(e).wrap("<div></div>"),t.contentType="video",t.opts.width=t.opts.width||n(e).attr("width"),t.opts.height=t.opts.height||n(e).attr("height")),t.$content=t.$slide.children().filter("div,form,main,video,audio,article,.fancybox-content").first(),t.$content.siblings().hide(),t.$content.length||(t.$content=t.$slide.wrapInner("<div></div>").children().first()),t.$content.addClass("fancybox-content"),t.$slide.addClass("fancybox-slide--"+t.contentType),o.afterLoad(t))},setError:function(t){t.hasError=!0,t.$slide.trigger("onReset").removeClass("fancybox-slide--"+t.contentType).addClass("fancybox-slide--error"),t.contentType="html",this.setContent(t,this.translate(t,t.opts.errorTpl)),t.pos===this.currPos&&(this.isAnimating=!1)},showLoading:function(t){var e=this;t=t||e.current,t&&!t.$spinner&&(t.$spinner=n(e.translate(e,e.opts.spinnerTpl)).appendTo(t.$slide).hide().fadeIn("fast"))},hideLoading:function(t){var e=this;t=t||e.current,t&&t.$spinner&&(t.$spinner.stop().remove(),delete t.$spinner)},afterLoad:function(t){var e=this;e.isClosing||(t.isLoading=!1,t.isLoaded=!0,e.trigger("afterLoad",t),e.hideLoading(t),!t.opts.smallBtn||t.$smallBtn&&t.$smallBtn.length||(t.$smallBtn=n(e.translate(t,t.opts.btnTpl.smallBtn)).appendTo(t.$content)),t.opts.protect&&t.$content&&!t.hasError&&(t.$content.on("contextmenu.fb",function(t){return 2==t.button&&t.preventDefault(),!0}),"image"===t.type&&n('<div class="fancybox-spaceball"></div>').appendTo(t.$content)),e.adjustCaption(t),e.adjustLayout(t),t.pos===e.currPos&&e.updateCursor(),e.revealContent(t))},adjustCaption:function(t){var e=this,n=t||e.current,o=n.opts.caption,a=e.$refs.caption,i=!1;n.opts.preventCaptionOverlap&&o&&o.length&&(n.pos!==e.currPos?(a=a.clone().empty().appendTo(a.parent()),a.html(o),i=a.outerHeight(!0),a.empty().remove()):e.$caption&&(i=e.$caption.outerHeight(!0)),n.$slide.css("padding-bottom",i||""))},adjustLayout:function(t){var e,n,o,a,i=this,s=t||i.current;s.isLoaded&&s.opts.disableLayoutFix!==!0&&(s.$content.css("margin-bottom",""),s.$content.outerHeight()>s.$slide.height()+.5&&(o=s.$slide[0].style["padding-bottom"],a=s.$slide.css("padding-bottom"),parseFloat(a)>0&&(e=s.$slide[0].scrollHeight,s.$slide.css("padding-bottom",0),Math.abs(e-s.$slide[0].scrollHeight)<1&&(n=a),s.$slide.css("padding-bottom",o))),s.$content.css("margin-bottom",n))},revealContent:function(t){var e,a,i,s,r=this,c=t.$slide,l=!1,d=!1,u=r.isMoved(t),f=t.isRevealed;return t.isRevealed=!0,e=t.opts[r.firstRun?"animationEffect":"transitionEffect"],i=t.opts[r.firstRun?"animationDuration":"transitionDuration"],i=parseInt(t.forcedDuration===o?i:t.forcedDuration,10),!u&&t.pos===r.currPos&&i||(e=!1),"zoom"===e&&(t.pos===r.currPos&&i&&"image"===t.type&&!t.hasError&&(d=r.getThumbPos(t))?l=r.getFitPos(t):e="fade"),"zoom"===e?(r.isAnimating=!0,l.scaleX=l.width/d.width,l.scaleY=l.height/d.height,s=t.opts.zoomOpacity,"auto"==s&&(s=Math.abs(t.width/t.height-d.width/d.height)>.1),s&&(d.opacity=.1,l.opacity=1),n.fancybox.setTranslate(t.$content.removeClass("fancybox-is-hidden"),d),p(t.$content),void n.fancybox.animate(t.$content,l,i,function(){r.isAnimating=!1,r.complete()})):(r.updateSlide(t),e?(n.fancybox.stop(c),a="fancybox-slide--"+(t.pos>=r.prevPos?"next":"previous")+" fancybox-animated fancybox-fx-"+e,c.addClass(a).removeClass("fancybox-slide--current"),t.$content.removeClass("fancybox-is-hidden"),p(c),"image"!==t.type&&t.$content.hide().show(0),void n.fancybox.animate(c,"fancybox-slide--current",i,function(){c.removeClass(a).css({transform:"",opacity:""}),t.pos===r.currPos&&r.complete()},!0)):(t.$content.removeClass("fancybox-is-hidden"),f||!u||"image"!==t.type||t.hasError||t.$content.hide().fadeIn("fast"),void(t.pos===r.currPos&&r.complete())))},getThumbPos:function(t){var e,o,a,i,s,r=!1,c=t.$thumb;return!(!c||!g(c[0]))&&(e=n.fancybox.getTranslate(c),o=parseFloat(c.css("border-top-width")||0),a=parseFloat(c.css("border-right-width")||0),i=parseFloat(c.css("border-bottom-width")||0),s=parseFloat(c.css("border-left-width")||0),r={top:e.top+o,left:e.left+s,width:e.width-a-s,height:e.height-o-i,scaleX:1,scaleY:1},e.width>0&&e.height>0&&r)},complete:function(){var t,e=this,o=e.current,a={};!e.isMoved()&&o.isLoaded&&(o.isComplete||(o.isComplete=!0,o.$slide.siblings().trigger("onReset"),e.preload("inline"),p(o.$slide),o.$slide.addClass("fancybox-slide--complete"),n.each(e.slides,function(t,o){o.pos>=e.currPos-1&&o.pos<=e.currPos+1?a[o.pos]=o:o&&(n.fancybox.stop(o.$slide),o.$slide.off().remove())}),e.slides=a),e.isAnimating=!1,e.updateCursor(),e.trigger("afterShow"),o.opts.video.autoStart&&o.$slide.find("video,audio").filter(":visible:first").trigger("play").one("ended",function(){this.webkitExitFullscreen&&this.webkitExitFullscreen(),e.next()}),o.opts.autoFocus&&"html"===o.contentType&&(t=o.$content.find("input[autofocus]:enabled:visible:first"),t.length?t.trigger("focus"):e.focus(null,!0)),o.$slide.scrollTop(0).scrollLeft(0))},preload:function(t){var e,n,o=this;o.group.length<2||(n=o.slides[o.currPos+1],e=o.slides[o.currPos-1],e&&e.type===t&&o.loadSlide(e),n&&n.type===t&&o.loadSlide(n))},focus:function(t,o){var a,i,s=this,r=["a[href]","area[href]",'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',"select:not([disabled]):not([aria-hidden])","textarea:not([disabled]):not([aria-hidden])","button:not([disabled]):not([aria-hidden])","iframe","object","embed","[contenteditable]",'[tabindex]:not([tabindex^="-"])'].join(",");s.isClosing||(a=!t&&s.current&&s.current.isComplete?s.current.$slide.find("*:visible"+(o?":not(.fancybox-close-small)":"")):s.$refs.container.find("*:visible"),a=a.filter(r).filter(function(){return"hidden"!==n(this).css("visibility")&&!n(this).hasClass("disabled")}),a.length?(i=a.index(e.activeElement),t&&t.shiftKey?(i<0||0==i)&&(t.preventDefault(),a.eq(a.length-1).trigger("focus")):(i<0||i==a.length-1)&&(t&&t.preventDefault(),a.eq(0).trigger("focus"))):s.$refs.container.trigger("focus"))},activate:function(){var t=this;n(".fancybox-container").each(function(){var e=n(this).data("FancyBox");e&&e.id!==t.id&&!e.isClosing&&(e.trigger("onDeactivate"),e.removeEvents(),e.isVisible=!1)}),t.isVisible=!0,(t.current||t.isIdle)&&(t.update(),t.updateControls()),t.trigger("onActivate"),t.addEvents()},close:function(t,e){var o,a,i,s,r,c,l,u=this,f=u.current,h=function(){u.cleanUp(t)};return!u.isClosing&&(u.isClosing=!0,u.trigger("beforeClose",t)===!1?(u.isClosing=!1,d(function(){u.update()}),!1):(u.removeEvents(),i=f.$content,o=f.opts.animationEffect,a=n.isNumeric(e)?e:o?f.opts.animationDuration:0,f.$slide.removeClass("fancybox-slide--complete fancybox-slide--next fancybox-slide--previous fancybox-animated"),t!==!0?n.fancybox.stop(f.$slide):o=!1,f.$slide.siblings().trigger("onReset").remove(),a&&u.$refs.container.removeClass("fancybox-is-open").addClass("fancybox-is-closing").css("transition-duration",a+"ms"),u.hideLoading(f),u.hideControls(!0),u.updateCursor(),"zoom"!==o||i&&a&&"image"===f.type&&!u.isMoved()&&!f.hasError&&(l=u.getThumbPos(f))||(o="fade"),"zoom"===o?(n.fancybox.stop(i),s=n.fancybox.getTranslate(i),c={top:s.top,left:s.left,scaleX:s.width/l.width,scaleY:s.height/l.height,width:l.width,height:l.height},r=f.opts.zoomOpacity,"auto"==r&&(r=Math.abs(f.width/f.height-l.width/l.height)>.1),r&&(l.opacity=0),n.fancybox.setTranslate(i,c),p(i),n.fancybox.animate(i,l,a,h),!0):(o&&a?n.fancybox.animate(f.$slide.addClass("fancybox-slide--previous").removeClass("fancybox-slide--current"),"fancybox-animated fancybox-fx-"+o,a,h):t===!0?setTimeout(h,a):h(),
!0)))},cleanUp:function(e){var o,a,i,s=this,r=s.current.opts.$orig;s.current.$slide.trigger("onReset"),s.$refs.container.empty().remove(),s.trigger("afterClose",e),s.current.opts.backFocus&&(r&&r.length&&r.is(":visible")||(r=s.$trigger),r&&r.length&&(a=t.scrollX,i=t.scrollY,r.trigger("focus"),n("html, body").scrollTop(i).scrollLeft(a))),s.current=null,o=n.fancybox.getInstance(),o?o.activate():(n("body").removeClass("fancybox-active compensate-for-scrollbar"),n("#fancybox-style-noscroll").remove())},trigger:function(t,e){var o,a=Array.prototype.slice.call(arguments,1),i=this,s=e&&e.opts?e:i.current;return s?a.unshift(s):s=i,a.unshift(i),n.isFunction(s.opts[t])&&(o=s.opts[t].apply(s,a)),o===!1?o:void("afterClose"!==t&&i.$refs?i.$refs.container.trigger(t+".fb",a):r.trigger(t+".fb",a))},updateControls:function(){var t=this,o=t.current,a=o.index,i=t.$refs.container,s=t.$refs.caption,r=o.opts.caption;o.$slide.trigger("refresh"),t.$caption=r&&r.length?s.html(r):null,t.hasHiddenControls||t.isIdle||t.showControls(),i.find("[data-fancybox-count]").html(t.group.length),i.find("[data-fancybox-index]").html(a+1),i.find("[data-fancybox-prev]").prop("disabled",!o.opts.loop&&a<=0),i.find("[data-fancybox-next]").prop("disabled",!o.opts.loop&&a>=t.group.length-1),"image"===o.type?i.find("[data-fancybox-zoom]").show().end().find("[data-fancybox-download]").attr("href",o.opts.image.src||o.src).show():o.opts.toolbar&&i.find("[data-fancybox-download],[data-fancybox-zoom]").hide(),n(e.activeElement).is(":hidden,[disabled]")&&t.$refs.container.trigger("focus")},hideControls:function(t){var e=this,n=["infobar","toolbar","nav"];!t&&e.current.opts.preventCaptionOverlap||n.push("caption"),this.$refs.container.removeClass(n.map(function(t){return"fancybox-show-"+t}).join(" ")),this.hasHiddenControls=!0},showControls:function(){var t=this,e=t.current?t.current.opts:t.opts,n=t.$refs.container;t.hasHiddenControls=!1,t.idleSecondsCounter=0,n.toggleClass("fancybox-show-toolbar",!(!e.toolbar||!e.buttons)).toggleClass("fancybox-show-infobar",!!(e.infobar&&t.group.length>1)).toggleClass("fancybox-show-caption",!!t.$caption).toggleClass("fancybox-show-nav",!!(e.arrows&&t.group.length>1)).toggleClass("fancybox-is-modal",!!e.modal)},toggleControls:function(){this.hasHiddenControls?this.showControls():this.hideControls()}}),n.fancybox={version:"3.5.2",defaults:i,getInstance:function(t){var e=n('.fancybox-container:not(".fancybox-is-closing"):last').data("FancyBox"),o=Array.prototype.slice.call(arguments,1);return e instanceof b&&("string"===n.type(t)?e[t].apply(e,o):"function"===n.type(t)&&t.apply(e,o),e)},open:function(t,e,n){return new b(t,e,n)},close:function(t){var e=this.getInstance();e&&(e.close(),t===!0&&this.close(t))},destroy:function(){this.close(!0),r.add("body").off("click.fb-start","**")},isMobile:/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),use3d:function(){var n=e.createElement("div");return t.getComputedStyle&&t.getComputedStyle(n)&&t.getComputedStyle(n).getPropertyValue("transform")&&!(e.documentMode&&e.documentMode<11)}(),getTranslate:function(t){var e;return!(!t||!t.length)&&(e=t[0].getBoundingClientRect(),{top:e.top||0,left:e.left||0,width:e.width,height:e.height,opacity:parseFloat(t.css("opacity"))})},setTranslate:function(t,e){var n="",a={};if(t&&e)return e.left===o&&e.top===o||(n=(e.left===o?t.position().left:e.left)+"px, "+(e.top===o?t.position().top:e.top)+"px",n=this.use3d?"translate3d("+n+", 0px)":"translate("+n+")"),e.scaleX!==o&&e.scaleY!==o?n+=" scale("+e.scaleX+", "+e.scaleY+")":e.scaleX!==o&&(n+=" scaleX("+e.scaleX+")"),n.length&&(a.transform=n),e.opacity!==o&&(a.opacity=e.opacity),e.width!==o&&(a.width=e.width),e.height!==o&&(a.height=e.height),t.css(a)},animate:function(t,e,a,i,s){var r,c=this;n.isFunction(a)&&(i=a,a=null),c.stop(t),r=c.getTranslate(t),t.on(f,function(l){(!l||!l.originalEvent||t.is(l.originalEvent.target)&&"z-index"!=l.originalEvent.propertyName)&&(c.stop(t),n.isNumeric(a)&&t.css("transition-duration",""),n.isPlainObject(e)?e.scaleX!==o&&e.scaleY!==o&&c.setTranslate(t,{top:e.top,left:e.left,width:r.width*e.scaleX,height:r.height*e.scaleY,scaleX:1,scaleY:1}):s!==!0&&t.removeClass(e),n.isFunction(i)&&i(l))}),n.isNumeric(a)&&t.css("transition-duration",a+"ms"),n.isPlainObject(e)?(e.scaleX!==o&&e.scaleY!==o&&(delete e.width,delete e.height,t.parent().hasClass("fancybox-slide--image")&&t.parent().addClass("fancybox-is-scaling")),n.fancybox.setTranslate(t,e)):t.addClass(e),t.data("timer",setTimeout(function(){t.trigger(f)},a+33))},stop:function(t,e){t&&t.length&&(clearTimeout(t.data("timer")),e&&t.trigger(f),t.off(f).css("transition-duration",""),t.parent().removeClass("fancybox-is-scaling"))}},n.fn.fancybox=function(t){var e;return t=t||{},e=t.selector||!1,e?n("body").off("click.fb-start",e).on("click.fb-start",e,{options:t},a):this.off("click.fb-start").on("click.fb-start",{items:this,options:t},a),this},r.on("click.fb-start","[data-fancybox]",a),r.on("click.fb-start","[data-fancybox-trigger]",function(t){n('[data-fancybox="'+n(this).attr("data-fancybox-trigger")+'"]').eq(n(this).attr("data-fancybox-index")||0).trigger("click.fb-start",{$trigger:n(this)})}),function(){var t=".fancybox-button",e="fancybox-focus",o=null;r.on("mousedown mouseup focus blur",t,function(a){switch(a.type){case"mousedown":o=n(this);break;case"mouseup":o=null;break;case"focusin":n(t).removeClass(e),n(this).is(o)||n(this).is("[disabled]")||n(this).addClass(e);break;case"focusout":n(t).removeClass(e)}})}()}}(window,document,jQuery),function(t){"use strict";var e={youtube:{matcher:/(youtube\.com|youtu\.be|youtube\-nocookie\.com)\/(watch\?(.*&)?v=|v\/|u\/|embed\/?)?(videoseries\?list=(.*)|[\w-]{11}|\?listType=(.*)&list=(.*))(.*)/i,params:{autoplay:1,autohide:1,fs:1,rel:0,hd:1,wmode:"transparent",enablejsapi:1,html5:1},paramPlace:8,type:"iframe",url:"//www.youtube-nocookie.com/embed/$4",thumb:"//img.youtube.com/vi/$4/hqdefault.jpg"},vimeo:{matcher:/^.+vimeo.com\/(.*\/)?([\d]+)(.*)?/,params:{autoplay:1,hd:1,show_title:1,show_byline:1,show_portrait:0,fullscreen:1},paramPlace:3,type:"iframe",url:"//player.vimeo.com/video/$2"},instagram:{matcher:/(instagr\.am|instagram\.com)\/p\/([a-zA-Z0-9_\-]+)\/?/i,type:"image",url:"//$1/p/$2/media/?size=l"},gmap_place:{matcher:/(maps\.)?google\.([a-z]{2,3}(\.[a-z]{2})?)\/(((maps\/(place\/(.*)\/)?\@(.*),(\d+.?\d+?)z))|(\?ll=))(.*)?/i,type:"iframe",url:function(t){return"//maps.google."+t[2]+"/?ll="+(t[9]?t[9]+"&z="+Math.floor(t[10])+(t[12]?t[12].replace(/^\//,"&"):""):t[12]+"").replace(/\?/,"&")+"&output="+(t[12]&&t[12].indexOf("layer=c")>0?"svembed":"embed")}},gmap_search:{matcher:/(maps\.)?google\.([a-z]{2,3}(\.[a-z]{2})?)\/(maps\/search\/)(.*)/i,type:"iframe",url:function(t){return"//maps.google."+t[2]+"/maps?q="+t[5].replace("query=","q=").replace("api=1","")+"&output=embed"}}},n=function(e,n,o){if(e)return o=o||"","object"===t.type(o)&&(o=t.param(o,!0)),t.each(n,function(t,n){e=e.replace("$"+t,n||"")}),o.length&&(e+=(e.indexOf("?")>0?"&":"?")+o),e};t(document).on("objectNeedsType.fb",function(o,a,i){var s,r,c,l,d,u,f,p=i.src||"",h=!1;s=t.extend(!0,{},e,i.opts.media),t.each(s,function(e,o){if(c=p.match(o.matcher)){if(h=o.type,f=e,u={},o.paramPlace&&c[o.paramPlace]){d=c[o.paramPlace],"?"==d[0]&&(d=d.substring(1)),d=d.split("&");for(var a=0;a<d.length;++a){var s=d[a].split("=",2);2==s.length&&(u[s[0]]=decodeURIComponent(s[1].replace(/\+/g," ")))}}return l=t.extend(!0,{},o.params,i.opts[e],u),p="function"===t.type(o.url)?o.url.call(this,c,l,i):n(o.url,c,l),r="function"===t.type(o.thumb)?o.thumb.call(this,c,l,i):n(o.thumb,c),"youtube"===e?p=p.replace(/&t=((\d+)m)?(\d+)s/,function(t,e,n,o){return"&start="+((n?60*parseInt(n,10):0)+parseInt(o,10))}):"vimeo"===e&&(p=p.replace("&%23","#")),!1}}),h?(i.opts.thumb||i.opts.$thumb&&i.opts.$thumb.length||(i.opts.thumb=r),"iframe"===h&&(i.opts=t.extend(!0,i.opts,{iframe:{preload:!1,attr:{scrolling:"no"}}})),t.extend(i,{type:h,src:p,origSrc:i.src,contentSource:f,contentType:"image"===h?"image":"gmap_place"==f||"gmap_search"==f?"map":"video"})):p&&(i.type=i.opts.defaultType)});var o={youtube:{src:"https://www.youtube.com/iframe_api",class:"YT",loading:!1,loaded:!1},vimeo:{src:"https://player.vimeo.com/api/player.js",class:"Vimeo",loading:!1,loaded:!1},load:function(t){var e,n=this;return this[t].loaded?void setTimeout(function(){n.done(t)}):void(this[t].loading||(this[t].loading=!0,e=document.createElement("script"),e.type="text/javascript",e.src=this[t].src,"youtube"===t?window.onYouTubeIframeAPIReady=function(){n[t].loaded=!0,n.done(t)}:e.onload=function(){n[t].loaded=!0,n.done(t)},document.body.appendChild(e)))},done:function(e){var n,o,a;"youtube"===e&&delete window.onYouTubeIframeAPIReady,n=t.fancybox.getInstance(),n&&(o=n.current.$content.find("iframe"),"youtube"===e&&void 0!==YT&&YT?a=new YT.Player(o.attr("id"),{events:{onStateChange:function(t){0==t.data&&n.next()}}}):"vimeo"===e&&void 0!==Vimeo&&Vimeo&&(a=new Vimeo.Player(o),a.on("ended",function(){n.next()})))}};t(document).on({"afterShow.fb":function(t,e,n){e.group.length>1&&("youtube"===n.contentSource||"vimeo"===n.contentSource)&&o.load(n.contentSource)}})}(jQuery),function(t,e,n){"use strict";var o=function(){return t.requestAnimationFrame||t.webkitRequestAnimationFrame||t.mozRequestAnimationFrame||t.oRequestAnimationFrame||function(e){return t.setTimeout(e,1e3/60)}}(),a=function(){return t.cancelAnimationFrame||t.webkitCancelAnimationFrame||t.mozCancelAnimationFrame||t.oCancelAnimationFrame||function(e){t.clearTimeout(e)}}(),i=function(e){var n=[];e=e.originalEvent||e||t.e,e=e.touches&&e.touches.length?e.touches:e.changedTouches&&e.changedTouches.length?e.changedTouches:[e];for(var o in e)e[o].pageX?n.push({x:e[o].pageX,y:e[o].pageY}):e[o].clientX&&n.push({x:e[o].clientX,y:e[o].clientY});return n},s=function(t,e,n){return e&&t?"x"===n?t.x-e.x:"y"===n?t.y-e.y:Math.sqrt(Math.pow(t.x-e.x,2)+Math.pow(t.y-e.y,2)):0},r=function(t){if(t.is('a,area,button,[role="button"],input,label,select,summary,textarea,video,audio,iframe')||n.isFunction(t.get(0).onclick)||t.data("selectable"))return!0;for(var e=0,o=t[0].attributes,a=o.length;e<a;e++)if("data-fancybox-"===o[e].nodeName.substr(0,14))return!0;return!1},c=function(e){var n=t.getComputedStyle(e)["overflow-y"],o=t.getComputedStyle(e)["overflow-x"],a=("scroll"===n||"auto"===n)&&e.scrollHeight>e.clientHeight,i=("scroll"===o||"auto"===o)&&e.scrollWidth>e.clientWidth;return a||i},l=function(t){for(var e=!1;;){if(e=c(t.get(0)))break;if(t=t.parent(),!t.length||t.hasClass("fancybox-stage")||t.is("body"))break}return e},d=function(t){var e=this;e.instance=t,e.$bg=t.$refs.bg,e.$stage=t.$refs.stage,e.$container=t.$refs.container,e.destroy(),e.$container.on("touchstart.fb.touch mousedown.fb.touch",n.proxy(e,"ontouchstart"))};d.prototype.destroy=function(){var t=this;t.$container.off(".fb.touch"),n(e).off(".fb.touch"),t.requestId&&(a(t.requestId),t.requestId=null),t.tapped&&(clearTimeout(t.tapped),t.tapped=null)},d.prototype.ontouchstart=function(o){var a=this,c=n(o.target),d=a.instance,u=d.current,f=u.$slide,p=u.$content,h="touchstart"==o.type;if(h&&a.$container.off("mousedown.fb.touch"),(!o.originalEvent||2!=o.originalEvent.button)&&f.length&&c.length&&!r(c)&&!r(c.parent())&&(c.is("img")||!(o.originalEvent.clientX>c[0].clientWidth+c.offset().left))){if(!u||d.isAnimating||u.$slide.hasClass("fancybox-animated"))return o.stopPropagation(),void o.preventDefault();a.realPoints=a.startPoints=i(o),a.startPoints.length&&(u.touch&&o.stopPropagation(),a.startEvent=o,a.canTap=!0,a.$target=c,a.$content=p,a.opts=u.opts.touch,a.isPanning=!1,a.isSwiping=!1,a.isZooming=!1,a.isScrolling=!1,a.canPan=d.canPan(),a.startTime=(new Date).getTime(),a.distanceX=a.distanceY=a.distance=0,a.canvasWidth=Math.round(f[0].clientWidth),a.canvasHeight=Math.round(f[0].clientHeight),a.contentLastPos=null,a.contentStartPos=n.fancybox.getTranslate(a.$content)||{top:0,left:0},a.sliderStartPos=n.fancybox.getTranslate(f),a.stagePos=n.fancybox.getTranslate(d.$refs.stage),a.sliderStartPos.top-=a.stagePos.top,a.sliderStartPos.left-=a.stagePos.left,a.contentStartPos.top-=a.stagePos.top,a.contentStartPos.left-=a.stagePos.left,n(e).off(".fb.touch").on(h?"touchend.fb.touch touchcancel.fb.touch":"mouseup.fb.touch mouseleave.fb.touch",n.proxy(a,"ontouchend")).on(h?"touchmove.fb.touch":"mousemove.fb.touch",n.proxy(a,"ontouchmove")),n.fancybox.isMobile&&e.addEventListener("scroll",a.onscroll,!0),((a.opts||a.canPan)&&(c.is(a.$stage)||a.$stage.find(c).length)||(c.is(".fancybox-image")&&o.preventDefault(),n.fancybox.isMobile&&c.hasClass("fancybox-caption")))&&(a.isScrollable=l(c)||l(c.parent()),n.fancybox.isMobile&&a.isScrollable||o.preventDefault(),(1===a.startPoints.length||u.hasError)&&(a.canPan?(n.fancybox.stop(a.$content),a.isPanning=!0):a.isSwiping=!0,a.$container.addClass("fancybox-is-grabbing")),2===a.startPoints.length&&"image"===u.type&&(u.isLoaded||u.$ghost)&&(a.canTap=!1,a.isSwiping=!1,a.isPanning=!1,a.isZooming=!0,n.fancybox.stop(a.$content),a.centerPointStartX=.5*(a.startPoints[0].x+a.startPoints[1].x)-n(t).scrollLeft(),a.centerPointStartY=.5*(a.startPoints[0].y+a.startPoints[1].y)-n(t).scrollTop(),a.percentageOfImageAtPinchPointX=(a.centerPointStartX-a.contentStartPos.left)/a.contentStartPos.width,a.percentageOfImageAtPinchPointY=(a.centerPointStartY-a.contentStartPos.top)/a.contentStartPos.height,a.startDistanceBetweenFingers=s(a.startPoints[0],a.startPoints[1]))))}},d.prototype.onscroll=function(t){var n=this;n.isScrolling=!0,e.removeEventListener("scroll",n.onscroll,!0)},d.prototype.ontouchmove=function(t){var e=this;return void 0!==t.originalEvent.buttons&&0===t.originalEvent.buttons?void e.ontouchend(t):e.isScrolling?void(e.canTap=!1):(e.newPoints=i(t),void((e.opts||e.canPan)&&e.newPoints.length&&e.newPoints.length&&(e.isSwiping&&e.isSwiping===!0||t.preventDefault(),e.distanceX=s(e.newPoints[0],e.startPoints[0],"x"),e.distanceY=s(e.newPoints[0],e.startPoints[0],"y"),e.distance=s(e.newPoints[0],e.startPoints[0]),e.distance>0&&(e.isSwiping?e.onSwipe(t):e.isPanning?e.onPan():e.isZooming&&e.onZoom()))))},d.prototype.onSwipe=function(e){var i,s=this,r=s.instance,c=s.isSwiping,l=s.sliderStartPos.left||0;if(c!==!0)"x"==c&&(s.distanceX>0&&(s.instance.group.length<2||0===s.instance.current.index&&!s.instance.current.opts.loop)?l+=Math.pow(s.distanceX,.8):s.distanceX<0&&(s.instance.group.length<2||s.instance.current.index===s.instance.group.length-1&&!s.instance.current.opts.loop)?l-=Math.pow(-s.distanceX,.8):l+=s.distanceX),s.sliderLastPos={top:"x"==c?0:s.sliderStartPos.top+s.distanceY,left:l},s.requestId&&(a(s.requestId),s.requestId=null),s.requestId=o(function(){s.sliderLastPos&&(n.each(s.instance.slides,function(t,e){var o=e.pos-s.instance.currPos;n.fancybox.setTranslate(e.$slide,{top:s.sliderLastPos.top,left:s.sliderLastPos.left+o*s.canvasWidth+o*e.opts.gutter})}),s.$container.addClass("fancybox-is-sliding"))});else if(Math.abs(s.distance)>10){if(s.canTap=!1,r.group.length<2&&s.opts.vertical?s.isSwiping="y":r.isDragging||s.opts.vertical===!1||"auto"===s.opts.vertical&&n(t).width()>800?s.isSwiping="x":(i=Math.abs(180*Math.atan2(s.distanceY,s.distanceX)/Math.PI),s.isSwiping=i>45&&i<135?"y":"x"),"y"===s.isSwiping&&n.fancybox.isMobile&&s.isScrollable)return void(s.isScrolling=!0);r.isDragging=s.isSwiping,s.startPoints=s.newPoints,n.each(r.slides,function(t,e){var o,a;n.fancybox.stop(e.$slide),o=n.fancybox.getTranslate(e.$slide),a=n.fancybox.getTranslate(r.$refs.stage),e.$slide.css({transform:"",opacity:"","transition-duration":""}).removeClass("fancybox-animated").removeClass(function(t,e){return(e.match(/(^|\s)fancybox-fx-\S+/g)||[]).join(" ")}),e.pos===r.current.pos&&(s.sliderStartPos.top=o.top-a.top,s.sliderStartPos.left=o.left-a.left),n.fancybox.setTranslate(e.$slide,{top:o.top-a.top,left:o.left-a.left})}),r.SlideShow&&r.SlideShow.isActive&&r.SlideShow.stop()}},d.prototype.onPan=function(){var t=this;return s(t.newPoints[0],t.realPoints[0])<(n.fancybox.isMobile?10:5)?void(t.startPoints=t.newPoints):(t.canTap=!1,t.contentLastPos=t.limitMovement(),t.requestId&&a(t.requestId),void(t.requestId=o(function(){n.fancybox.setTranslate(t.$content,t.contentLastPos)})))},d.prototype.limitMovement=function(){var t,e,n,o,a,i,s=this,r=s.canvasWidth,c=s.canvasHeight,l=s.distanceX,d=s.distanceY,u=s.contentStartPos,f=u.left,p=u.top,h=u.width,g=u.height;return a=h>r?f+l:f,i=p+d,t=Math.max(0,.5*r-.5*h),e=Math.max(0,.5*c-.5*g),n=Math.min(r-h,.5*r-.5*h),o=Math.min(c-g,.5*c-.5*g),l>0&&a>t&&(a=t-1+Math.pow(-t+f+l,.8)||0),l<0&&a<n&&(a=n+1-Math.pow(n-f-l,.8)||0),d>0&&i>e&&(i=e-1+Math.pow(-e+p+d,.8)||0),d<0&&i<o&&(i=o+1-Math.pow(o-p-d,.8)||0),{top:i,left:a}},d.prototype.limitPosition=function(t,e,n,o){var a=this,i=a.canvasWidth,s=a.canvasHeight;return n>i?(t=t>0?0:t,t=t<i-n?i-n:t):t=Math.max(0,i/2-n/2),o>s?(e=e>0?0:e,e=e<s-o?s-o:e):e=Math.max(0,s/2-o/2),{top:e,left:t}},d.prototype.onZoom=function(){var e=this,i=e.contentStartPos,r=i.width,c=i.height,l=i.left,d=i.top,u=s(e.newPoints[0],e.newPoints[1]),f=u/e.startDistanceBetweenFingers,p=Math.floor(r*f),h=Math.floor(c*f),g=(r-p)*e.percentageOfImageAtPinchPointX,b=(c-h)*e.percentageOfImageAtPinchPointY,m=(e.newPoints[0].x+e.newPoints[1].x)/2-n(t).scrollLeft(),v=(e.newPoints[0].y+e.newPoints[1].y)/2-n(t).scrollTop(),y=m-e.centerPointStartX,x=v-e.centerPointStartY,w=l+(g+y),$=d+(b+x),S={top:$,left:w,scaleX:f,scaleY:f};e.canTap=!1,e.newWidth=p,e.newHeight=h,e.contentLastPos=S,e.requestId&&a(e.requestId),e.requestId=o(function(){n.fancybox.setTranslate(e.$content,e.contentLastPos)})},d.prototype.ontouchend=function(t){var o=this,s=o.isSwiping,r=o.isPanning,c=o.isZooming,l=o.isScrolling;return o.endPoints=i(t),o.dMs=Math.max((new Date).getTime()-o.startTime,1),o.$container.removeClass("fancybox-is-grabbing"),n(e).off(".fb.touch"),e.removeEventListener("scroll",o.onscroll,!0),o.requestId&&(a(o.requestId),o.requestId=null),o.isSwiping=!1,o.isPanning=!1,o.isZooming=!1,o.isScrolling=!1,o.instance.isDragging=!1,o.canTap?o.onTap(t):(o.speed=100,o.velocityX=o.distanceX/o.dMs*.5,o.velocityY=o.distanceY/o.dMs*.5,void(r?o.endPanning():c?o.endZooming():o.endSwiping(s,l)))},d.prototype.endSwiping=function(t,e){var o=this,a=!1,i=o.instance.group.length,s=Math.abs(o.distanceX),r="x"==t&&i>1&&(o.dMs>130&&s>10||s>50),c=300;o.sliderLastPos=null,"y"==t&&!e&&Math.abs(o.distanceY)>50?(n.fancybox.animate(o.instance.current.$slide,{top:o.sliderStartPos.top+o.distanceY+150*o.velocityY,opacity:0},200),a=o.instance.close(!0,250)):r&&o.distanceX>0?a=o.instance.previous(c):r&&o.distanceX<0&&(a=o.instance.next(c)),a!==!1||"x"!=t&&"y"!=t||o.instance.centerSlide(200),o.$container.removeClass("fancybox-is-sliding")},d.prototype.endPanning=function(){var t,e,o,a=this;a.contentLastPos&&(a.opts.momentum===!1||a.dMs>350?(t=a.contentLastPos.left,e=a.contentLastPos.top):(t=a.contentLastPos.left+500*a.velocityX,e=a.contentLastPos.top+500*a.velocityY),o=a.limitPosition(t,e,a.contentStartPos.width,a.contentStartPos.height),o.width=a.contentStartPos.width,o.height=a.contentStartPos.height,n.fancybox.animate(a.$content,o,330))},d.prototype.endZooming=function(){var t,e,o,a,i=this,s=i.instance.current,r=i.newWidth,c=i.newHeight;i.contentLastPos&&(t=i.contentLastPos.left,e=i.contentLastPos.top,a={top:e,left:t,width:r,height:c,scaleX:1,scaleY:1},n.fancybox.setTranslate(i.$content,a),r<i.canvasWidth&&c<i.canvasHeight?i.instance.scaleToFit(150):r>s.width||c>s.height?i.instance.scaleToActual(i.centerPointStartX,i.centerPointStartY,150):(o=i.limitPosition(t,e,r,c),n.fancybox.animate(i.$content,o,150)))},d.prototype.onTap=function(e){var o,a=this,s=n(e.target),r=a.instance,c=r.current,l=e&&i(e)||a.startPoints,d=l[0]?l[0].x-n(t).scrollLeft()-a.stagePos.left:0,u=l[0]?l[0].y-n(t).scrollTop()-a.stagePos.top:0,f=function(t){var o=c.opts[t];if(n.isFunction(o)&&(o=o.apply(r,[c,e])),o)switch(o){case"close":r.close(a.startEvent);break;case"toggleControls":r.toggleControls();break;case"next":r.next();break;case"nextOrClose":r.group.length>1?r.next():r.close(a.startEvent);break;case"zoom":"image"==c.type&&(c.isLoaded||c.$ghost)&&(r.canPan()?r.scaleToFit():r.isScaledDown()?r.scaleToActual(d,u):r.group.length<2&&r.close(a.startEvent))}};if((!e.originalEvent||2!=e.originalEvent.button)&&(s.is("img")||!(d>s[0].clientWidth+s.offset().left))){if(s.is(".fancybox-bg,.fancybox-inner,.fancybox-outer,.fancybox-container"))o="Outside";else if(s.is(".fancybox-slide"))o="Slide";else{if(!r.current.$content||!r.current.$content.find(s).addBack().filter(s).length)return;o="Content"}if(a.tapped){if(clearTimeout(a.tapped),a.tapped=null,Math.abs(d-a.tapX)>50||Math.abs(u-a.tapY)>50)return this;f("dblclick"+o)}else a.tapX=d,a.tapY=u,c.opts["dblclick"+o]&&c.opts["dblclick"+o]!==c.opts["click"+o]?a.tapped=setTimeout(function(){a.tapped=null,r.isAnimating||f("click"+o)},500):f("click"+o);return this}},n(e).on("onActivate.fb",function(t,e){e&&!e.Guestures&&(e.Guestures=new d(e))}).on("beforeClose.fb",function(t,e){e&&e.Guestures&&e.Guestures.destroy()})}(window,document,jQuery),function(t,e){"use strict";e.extend(!0,e.fancybox.defaults,{btnTpl:{slideShow:'<button data-fancybox-play class="fancybox-button fancybox-button--play" title="{{PLAY_START}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6.5 5.4v13.2l11-6.6z"/></svg><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M8.33 5.75h2.2v12.5h-2.2V5.75zm5.15 0h2.2v12.5h-2.2V5.75z"/></svg></button>'},slideShow:{autoStart:!1,speed:3e3,progress:!0}});var n=function(t){this.instance=t,this.init()};e.extend(n.prototype,{timer:null,isActive:!1,$button:null,init:function(){var t=this,n=t.instance,o=n.group[n.currIndex].opts.slideShow;t.$button=n.$refs.toolbar.find("[data-fancybox-play]").on("click",function(){t.toggle()}),n.group.length<2||!o?t.$button.hide():o.progress&&(t.$progress=e('<div class="fancybox-progress"></div>').appendTo(n.$refs.inner))},set:function(t){var n=this,o=n.instance,a=o.current;a&&(t===!0||a.opts.loop||o.currIndex<o.group.length-1)?n.isActive&&"video"!==a.contentType&&(n.$progress&&e.fancybox.animate(n.$progress.show(),{scaleX:1},a.opts.slideShow.speed),n.timer=setTimeout(function(){o.current.opts.loop||o.current.index!=o.group.length-1?o.next():o.jumpTo(0)},a.opts.slideShow.speed)):(n.stop(),o.idleSecondsCounter=0,o.showControls())},clear:function(){var t=this;clearTimeout(t.timer),t.timer=null,t.$progress&&t.$progress.removeAttr("style").hide()},start:function(){var t=this,e=t.instance.current;e&&(t.$button.attr("title",(e.opts.i18n[e.opts.lang]||e.opts.i18n.en).PLAY_STOP).removeClass("fancybox-button--play").addClass("fancybox-button--pause"),t.isActive=!0,e.isComplete&&t.set(!0),t.instance.trigger("onSlideShowChange",!0))},stop:function(){var t=this,e=t.instance.current;t.clear(),t.$button.attr("title",(e.opts.i18n[e.opts.lang]||e.opts.i18n.en).PLAY_START).removeClass("fancybox-button--pause").addClass("fancybox-button--play"),t.isActive=!1,t.instance.trigger("onSlideShowChange",!1),t.$progress&&t.$progress.removeAttr("style").hide()},toggle:function(){var t=this;t.isActive?t.stop():t.start()}}),e(t).on({"onInit.fb":function(t,e){e&&!e.SlideShow&&(e.SlideShow=new n(e))},"beforeShow.fb":function(t,e,n,o){var a=e&&e.SlideShow;o?a&&n.opts.slideShow.autoStart&&a.start():a&&a.isActive&&a.clear()},"afterShow.fb":function(t,e,n){var o=e&&e.SlideShow;o&&o.isActive&&o.set()},"afterKeydown.fb":function(n,o,a,i,s){var r=o&&o.SlideShow;!r||!a.opts.slideShow||80!==s&&32!==s||e(t.activeElement).is("button,a,input")||(i.preventDefault(),r.toggle())},"beforeClose.fb onDeactivate.fb":function(t,e){var n=e&&e.SlideShow;n&&n.stop()}}),e(t).on("visibilitychange",function(){var n=e.fancybox.getInstance(),o=n&&n.SlideShow;o&&o.isActive&&(t.hidden?o.clear():o.set())})}(document,jQuery),function(t,e){"use strict";var n=function(){for(var e=[["requestFullscreen","exitFullscreen","fullscreenElement","fullscreenEnabled","fullscreenchange","fullscreenerror"],["webkitRequestFullscreen","webkitExitFullscreen","webkitFullscreenElement","webkitFullscreenEnabled","webkitfullscreenchange","webkitfullscreenerror"],["webkitRequestFullScreen","webkitCancelFullScreen","webkitCurrentFullScreenElement","webkitCancelFullScreen","webkitfullscreenchange","webkitfullscreenerror"],["mozRequestFullScreen","mozCancelFullScreen","mozFullScreenElement","mozFullScreenEnabled","mozfullscreenchange","mozfullscreenerror"],["msRequestFullscreen","msExitFullscreen","msFullscreenElement","msFullscreenEnabled","MSFullscreenChange","MSFullscreenError"]],n={},o=0;o<e.length;o++){var a=e[o];if(a&&a[1]in t){for(var i=0;i<a.length;i++)n[e[0][i]]=a[i];return n}}return!1}();if(n){var o={request:function(e){e=e||t.documentElement,e[n.requestFullscreen](e.ALLOW_KEYBOARD_INPUT)},exit:function(){t[n.exitFullscreen]()},toggle:function(e){e=e||t.documentElement,this.isFullscreen()?this.exit():this.request(e)},isFullscreen:function(){return Boolean(t[n.fullscreenElement])},enabled:function(){return Boolean(t[n.fullscreenEnabled])}};e.extend(!0,e.fancybox.defaults,{btnTpl:{fullScreen:'<button data-fancybox-fullscreen class="fancybox-button fancybox-button--fsenter" title="{{FULL_SCREEN}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 16h3v3h2v-5H5zm3-8H5v2h5V5H8zm6 11h2v-3h3v-2h-5zm2-11V5h-2v5h5V8z"/></svg></button>'},fullScreen:{autoStart:!1}}),e(t).on(n.fullscreenchange,function(){var t=o.isFullscreen(),n=e.fancybox.getInstance();n&&(n.current&&"image"===n.current.type&&n.isAnimating&&(n.current.$content.css("transition","none"),n.isAnimating=!1,n.update(!0,!0,0)),n.trigger("onFullscreenChange",t),n.$refs.container.toggleClass("fancybox-is-fullscreen",t),n.$refs.toolbar.find("[data-fancybox-fullscreen]").toggleClass("fancybox-button--fsenter",!t).toggleClass("fancybox-button--fsexit",t))})}e(t).on({"onInit.fb":function(t,e){var a;return n?void(e&&e.group[e.currIndex].opts.fullScreen?(a=e.$refs.container,a.on("click.fb-fullscreen","[data-fancybox-fullscreen]",function(t){t.stopPropagation(),t.preventDefault(),o.toggle()}),e.opts.fullScreen&&e.opts.fullScreen.autoStart===!0&&o.request(),e.FullScreen=o):e&&e.$refs.toolbar.find("[data-fancybox-fullscreen]").hide()):void e.$refs.toolbar.find("[data-fancybox-fullscreen]").remove()},"afterKeydown.fb":function(t,e,n,o,a){e&&e.FullScreen&&70===a&&(o.preventDefault(),e.FullScreen.toggle())},"beforeClose.fb":function(t,e){e&&e.FullScreen&&e.$refs.container.hasClass("fancybox-is-fullscreen")&&o.exit()}})}(document,jQuery),function(t,e){"use strict";var n="fancybox-thumbs",o=n+"-active";e.fancybox.defaults=e.extend(!0,{btnTpl:{thumbs:'<button data-fancybox-thumbs class="fancybox-button fancybox-button--thumbs" title="{{THUMBS}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M14.59 14.59h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76H5.65v-3.76zm8.94-4.47h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76H5.65v-3.76zm8.94-4.47h3.76v3.76h-3.76V5.65zm-4.47 0h3.76v3.76h-3.76V5.65zm-4.47 0h3.76v3.76H5.65V5.65z"/></svg></button>'},thumbs:{autoStart:!1,hideOnClose:!0,parentEl:".fancybox-container",axis:"y"}},e.fancybox.defaults);var a=function(t){this.init(t)};e.extend(a.prototype,{$button:null,$grid:null,$list:null,isVisible:!1,isActive:!1,init:function(t){var e=this,n=t.group,o=0;e.instance=t,e.opts=n[t.currIndex].opts.thumbs,t.Thumbs=e,e.$button=t.$refs.toolbar.find("[data-fancybox-thumbs]");for(var a=0,i=n.length;a<i&&(n[a].thumb&&o++,!(o>1));a++);o>1&&e.opts?(e.$button.removeAttr("style").on("click",function(){e.toggle()}),e.isActive=!0):e.$button.hide()},create:function(){var t,o=this,a=o.instance,i=o.opts.parentEl,s=[];o.$grid||(o.$grid=e('<div class="'+n+" "+n+"-"+o.opts.axis+'"></div>').appendTo(a.$refs.container.find(i).addBack().filter(i)),o.$grid.on("click","a",function(){a.jumpTo(e(this).attr("data-index"))})),o.$list||(o.$list=e('<div class="'+n+'__list">').appendTo(o.$grid)),e.each(a.group,function(e,n){t=n.thumb,t||"image"!==n.type||(t=n.src),s.push('<a href="javascript:;" tabindex="0" data-index="'+e+'"'+(t&&t.length?' style="background-image:url('+t+')"':'class="fancybox-thumbs-missing"')+"></a>")}),o.$list[0].innerHTML=s.join(""),"x"===o.opts.axis&&o.$list.width(parseInt(o.$grid.css("padding-right"),10)+a.group.length*o.$list.children().eq(0).outerWidth(!0))},focus:function(t){var e,n,a=this,i=a.$list,s=a.$grid;a.instance.current&&(e=i.children().removeClass(o).filter('[data-index="'+a.instance.current.index+'"]').addClass(o),n=e.position(),"y"===a.opts.axis&&(n.top<0||n.top>i.height()-e.outerHeight())?i.stop().animate({scrollTop:i.scrollTop()+n.top},t):"x"===a.opts.axis&&(n.left<s.scrollLeft()||n.left>s.scrollLeft()+(s.width()-e.outerWidth()))&&i.parent().stop().animate({scrollLeft:n.left},t))},update:function(){var t=this;t.instance.$refs.container.toggleClass("fancybox-show-thumbs",this.isVisible),t.isVisible?(t.$grid||t.create(),t.instance.trigger("onThumbsShow"),t.focus(0)):t.$grid&&t.instance.trigger("onThumbsHide"),t.instance.update()},hide:function(){this.isVisible=!1,this.update()},show:function(){this.isVisible=!0,this.update()},toggle:function(){this.isVisible=!this.isVisible,this.update()}}),e(t).on({"onInit.fb":function(t,e){var n;e&&!e.Thumbs&&(n=new a(e),n.isActive&&n.opts.autoStart===!0&&n.show())},"beforeShow.fb":function(t,e,n,o){var a=e&&e.Thumbs;a&&a.isVisible&&a.focus(o?0:250)},"afterKeydown.fb":function(t,e,n,o,a){var i=e&&e.Thumbs;i&&i.isActive&&71===a&&(o.preventDefault(),i.toggle())},"beforeClose.fb":function(t,e){var n=e&&e.Thumbs;n&&n.isVisible&&n.opts.hideOnClose!==!1&&n.$grid.hide()}})}(document,jQuery),function(t,e){"use strict";function n(t){var e={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;","`":"&#x60;","=":"&#x3D;"};return String(t).replace(/[&<>"'`=\/]/g,function(t){return e[t]})}e.extend(!0,e.fancybox.defaults,{btnTpl:{share:'<button data-fancybox-share class="fancybox-button fancybox-button--share" title="{{SHARE}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M2.55 19c1.4-8.4 9.1-9.8 11.9-9.8V5l7 7-7 6.3v-3.5c-2.8 0-10.5 2.1-11.9 4.2z"/></svg></button>'},share:{url:function(t,e){return!t.currentHash&&"inline"!==e.type&&"html"!==e.type&&(e.origSrc||e.src)||window.location},tpl:'<div class="fancybox-share"><h1>{{SHARE}}</h1><p><a class="fancybox-share__button fancybox-share__button--fb" href="https://www.facebook.com/sharer/sharer.php?u={{url}}"><svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m287 456v-299c0-21 6-35 35-35h38v-63c-7-1-29-3-55-3-54 0-91 33-91 94v306m143-254h-205v72h196" /></svg><span>Facebook</span></a><a class="fancybox-share__button fancybox-share__button--tw" href="https://twitter.com/intent/tweet?url={{url}}&text={{descr}}"><svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m456 133c-14 7-31 11-47 13 17-10 30-27 37-46-15 10-34 16-52 20-61-62-157-7-141 75-68-3-129-35-169-85-22 37-11 86 26 109-13 0-26-4-37-9 0 39 28 72 65 80-12 3-25 4-37 2 10 33 41 57 77 57-42 30-77 38-122 34 170 111 378-32 359-208 16-11 30-25 41-42z" /></svg><span>Twitter</span></a><a class="fancybox-share__button fancybox-share__button--pt" href="https://www.pinterest.com/pin/create/button/?url={{url}}&description={{descr}}&media={{media}}"><svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m265 56c-109 0-164 78-164 144 0 39 15 74 47 87 5 2 10 0 12-5l4-19c2-6 1-8-3-13-9-11-15-25-15-45 0-58 43-110 113-110 62 0 96 38 96 88 0 67-30 122-73 122-24 0-42-19-36-44 6-29 20-60 20-81 0-19-10-35-31-35-25 0-44 26-44 60 0 21 7 36 7 36l-30 125c-8 37-1 83 0 87 0 3 4 4 5 2 2-3 32-39 42-75l16-64c8 16 31 29 56 29 74 0 124-67 124-157 0-69-58-132-146-132z" fill="#fff"/></svg><span>Pinterest</span></a></p><p><input class="fancybox-share__input" type="text" value="{{url_raw}}" onclick="select()" /></p></div>'
}}),e(t).on("click","[data-fancybox-share]",function(){var t,o,a=e.fancybox.getInstance(),i=a.current||null;i&&("function"===e.type(i.opts.share.url)&&(t=i.opts.share.url.apply(i,[a,i])),o=i.opts.share.tpl.replace(/\{\{media\}\}/g,"image"===i.type?encodeURIComponent(i.src):"").replace(/\{\{url\}\}/g,encodeURIComponent(t)).replace(/\{\{url_raw\}\}/g,n(t)).replace(/\{\{descr\}\}/g,a.$caption?encodeURIComponent(a.$caption.text()):""),e.fancybox.open({src:a.translate(a,o),type:"html",opts:{touch:!1,animationEffect:!1,afterLoad:function(t,e){a.$refs.container.one("beforeClose.fb",function(){t.close(null,0)}),e.$content.find(".fancybox-share__button").click(function(){return window.open(this.href,"Share","width=550, height=450"),!1})},mobile:{autoFocus:!1}}}))})}(document,jQuery),function(t,e,n){"use strict";function o(){var e=t.location.hash.substr(1),n=e.split("-"),o=n.length>1&&/^\+?\d+$/.test(n[n.length-1])?parseInt(n.pop(-1),10)||1:1,a=n.join("-");return{hash:e,index:o<1?1:o,gallery:a}}function a(t){""!==t.gallery&&n("[data-fancybox='"+n.escapeSelector(t.gallery)+"']").eq(t.index-1).focus().trigger("click.fb-start")}function i(t){var e,n;return!!t&&(e=t.current?t.current.opts:t.opts,n=e.hash||(e.$orig?e.$orig.data("fancybox")||e.$orig.data("fancybox-trigger"):""),""!==n&&n)}n.escapeSelector||(n.escapeSelector=function(t){var e=/([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g,n=function(t,e){return e?"\0"===t?"�":t.slice(0,-1)+"\\"+t.charCodeAt(t.length-1).toString(16)+" ":"\\"+t};return(t+"").replace(e,n)}),n(function(){n.fancybox.defaults.hash!==!1&&(n(e).on({"onInit.fb":function(t,e){var n,a;e.group[e.currIndex].opts.hash!==!1&&(n=o(),a=i(e),a&&n.gallery&&a==n.gallery&&(e.currIndex=n.index-1))},"beforeShow.fb":function(n,o,a,s){var r;a&&a.opts.hash!==!1&&(r=i(o),r&&(o.currentHash=r+(o.group.length>1?"-"+(a.index+1):""),t.location.hash!=="#"+o.currentHash&&(s&&!o.origHash&&(o.origHash=t.location.hash),o.hashTimer&&clearTimeout(o.hashTimer),o.hashTimer=setTimeout(function(){"replaceState"in t.history?(t.history[s?"pushState":"replaceState"]({},e.title,t.location.pathname+t.location.search+"#"+o.currentHash),s&&(o.hasCreatedHistory=!0)):t.location.hash=o.currentHash,o.hashTimer=null},300))))},"beforeClose.fb":function(n,o,a){a.opts.hash!==!1&&(clearTimeout(o.hashTimer),o.currentHash&&o.hasCreatedHistory?t.history.back():o.currentHash&&("replaceState"in t.history?t.history.replaceState({},e.title,t.location.pathname+t.location.search+(o.origHash||"")):t.location.hash=o.origHash),o.currentHash=null)}}),n(t).on("hashchange.fb",function(){var t=o(),e=null;n.each(n(".fancybox-container").get().reverse(),function(t,o){var a=n(o).data("FancyBox");if(a&&a.currentHash)return e=a,!1}),e?e.currentHash===t.gallery+"-"+t.index||1===t.index&&e.currentHash==t.gallery||(e.currentHash=null,e.close()):""!==t.gallery&&a(t)}),setTimeout(function(){n.fancybox.getInstance()||a(o())},50))})}(window,document,jQuery),function(t,e){"use strict";var n=(new Date).getTime();e(t).on({"onInit.fb":function(t,e,o){e.$refs.stage.on("mousewheel DOMMouseScroll wheel MozMousePixelScroll",function(t){var o=e.current,a=(new Date).getTime();e.group.length<2||o.opts.wheel===!1||"auto"===o.opts.wheel&&"image"!==o.type||(t.preventDefault(),t.stopPropagation(),o.$slide.hasClass("fancybox-animated")||(t=t.originalEvent||t,a-n<250||(n=a,e[(-t.deltaY||-t.deltaX||t.wheelDelta||-t.detail)<0?"next":"previous"]())))})}})}(document,jQuery);

/*!
 * jQuery Smooth Scroll - v1.7.2 - 2016-01-23
 * https://github.com/kswedberg/jquery-smooth-scroll
 * Copyright (c) 2016 Karl Swedberg
 * Licensed MIT
 */

!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):a("object"==typeof module&&module.exports?require("jquery"):jQuery)}(function(a){var b="1.7.2",c={},d={exclude:[],excludeWithin:[],offset:0,direction:"top",delegateSelector:null,scrollElement:null,scrollTarget:null,beforeScroll:function(){},afterScroll:function(){},easing:"swing",speed:400,autoCoefficient:2,preventDefault:!0},e=function(b){var c=[],d=!1,e=b.dir&&"left"===b.dir?"scrollLeft":"scrollTop";return this.each(function(){var b=a(this);if(this!==document&&this!==window)return!document.scrollingElement||this!==document.documentElement&&this!==document.body?void(b[e]()>0?c.push(this):(b[e](1),d=b[e]()>0,d&&c.push(this),b[e](0))):(c.push(document.scrollingElement),!1)}),c.length||this.each(function(){this===document.documentElement&&"smooth"===a(this).css("scrollBehavior")&&(c=[this]),c.length||"BODY"!==this.nodeName||(c=[this])}),"first"===b.el&&c.length>1&&(c=[c[0]]),c};a.fn.extend({scrollable:function(a){var b=e.call(this,{dir:a});return this.pushStack(b)},firstScrollable:function(a){var b=e.call(this,{el:"first",dir:a});return this.pushStack(b)},smoothScroll:function(b,c){if(b=b||{},"options"===b)return c?this.each(function(){var b=a(this),d=a.extend(b.data("ssOpts")||{},c);a(this).data("ssOpts",d)}):this.first().data("ssOpts");var d=a.extend({},a.fn.smoothScroll.defaults,b),e=function(b){var c=function(a){return a.replace(/(:|\.|\/)/g,"\\$1")},e=this,f=a(this),g=a.extend({},d,f.data("ssOpts")||{}),h=d.exclude,i=g.excludeWithin,j=0,k=0,l=!0,m={},n=a.smoothScroll.filterPath(location.pathname),o=a.smoothScroll.filterPath(e.pathname),p=location.hostname===e.hostname||!e.hostname,q=g.scrollTarget||o===n,r=c(e.hash);if(r&&!a(r).length&&(l=!1),g.scrollTarget||p&&q&&r){for(;l&&j<h.length;)f.is(c(h[j++]))&&(l=!1);for(;l&&k<i.length;)f.closest(i[k++]).length&&(l=!1)}else l=!1;l&&(g.preventDefault&&b.preventDefault(),a.extend(m,g,{scrollTarget:g.scrollTarget||r,link:e}),a.smoothScroll(m))};return null!==b.delegateSelector?this.undelegate(b.delegateSelector,"click.smoothscroll").delegate(b.delegateSelector,"click.smoothscroll",e):this.unbind("click.smoothscroll").bind("click.smoothscroll",e),this}}),a.smoothScroll=function(b,d){if("options"===b&&"object"==typeof d)return a.extend(c,d);var e,f,g,h,i,j=0,k="offset",l="scrollTop",m={},n={};"number"==typeof b?(e=a.extend({link:null},a.fn.smoothScroll.defaults,c),g=b):(e=a.extend({link:null},a.fn.smoothScroll.defaults,b||{},c),e.scrollElement&&(k="position","static"===e.scrollElement.css("position")&&e.scrollElement.css("position","relative"))),l="left"===e.direction?"scrollLeft":l,e.scrollElement?(f=e.scrollElement,/^(?:HTML|BODY)$/.test(f[0].nodeName)||(j=f[l]())):f=a("html, body").firstScrollable(e.direction),e.beforeScroll.call(f,e),g="number"==typeof b?b:d||a(e.scrollTarget)[k]()&&a(e.scrollTarget)[k]()[e.direction]||0,m[l]=g+j+e.offset,h=e.speed,"auto"===h&&(i=Math.abs(m[l]-f[l]()),h=i/e.autoCoefficient),n={duration:h,easing:e.easing,complete:function(){e.afterScroll.call(e.link,e)}},e.step&&(n.step=e.step),f.length?f.stop().animate(m,n):e.afterScroll.call(e.link,e)},a.smoothScroll.version=b,a.smoothScroll.filterPath=function(a){return a=a||"",a.replace(/^\//,"").replace(/(?:index|default).[a-zA-Z]{3,4}$/,"").replace(/\/$/,"")},a.fn.smoothScroll.defaults=d});
/*
 Sticky-kit v1.1.2 | WTFPL | Leaf Corcoran 2015 | http://leafo.net
*/
(function(){var b,f;b=this.jQuery||window.jQuery;f=b(window);b.fn.stick_in_parent=function(d){var A,w,J,n,B,K,p,q,k,E,t;null==d&&(d={});t=d.sticky_class;B=d.inner_scrolling;E=d.recalc_every;k=d.parent;q=d.offset_top;p=d.spacer;w=d.bottoming;null==q&&(q=0);null==k&&(k=void 0);null==B&&(B=!0);null==t&&(t="is_stuck");A=b(document);null==w&&(w=!0);J=function(a,d,n,C,F,u,r,G){var v,H,m,D,I,c,g,x,y,z,h,l;if(!a.data("sticky_kit")){a.data("sticky_kit",!0);I=A.height();g=a.parent();null!=k&&(g=g.closest(k));
if(!g.length)throw"failed to find stick parent";v=m=!1;(h=null!=p?p&&a.closest(p):b("<div />"))&&h.css("position",a.css("position"));x=function(){var c,f,e;if(!G&&(I=A.height(),c=parseInt(g.css("border-top-width"),10),f=parseInt(g.css("padding-top"),10),d=parseInt(g.css("padding-bottom"),10),n=g.offset().top+c+f,C=g.height(),m&&(v=m=!1,null==p&&(a.insertAfter(h),h.detach()),a.css({position:"",top:"",width:"",bottom:""}).removeClass(t),e=!0),F=a.offset().top-(parseInt(a.css("margin-top"),10)||0)-q,
u=a.outerHeight(!0),r=a.css("float"),h&&h.css({width:a.outerWidth(!0),height:u,display:a.css("display"),"vertical-align":a.css("vertical-align"),"float":r}),e))return l()};x();if(u!==C)return D=void 0,c=q,z=E,l=function(){var b,l,e,k;if(!G&&(e=!1,null!=z&&(--z,0>=z&&(z=E,x(),e=!0)),e||A.height()===I||x(),e=f.scrollTop(),null!=D&&(l=e-D),D=e,m?(w&&(k=e+u+c>C+n,v&&!k&&(v=!1,a.css({position:"fixed",bottom:"",top:c}).trigger("sticky_kit:unbottom"))),e<F&&(m=!1,c=q,null==p&&("left"!==r&&"right"!==r||a.insertAfter(h),
h.detach()),b={position:"",width:"",top:""},a.css(b).removeClass(t).trigger("sticky_kit:unstick")),B&&(b=f.height(),u+q>b&&!v&&(c-=l,c=Math.max(b-u,c),c=Math.min(q,c),m&&a.css({top:c+"px"})))):e>F&&(m=!0,b={position:"fixed",top:c},b.width="border-box"===a.css("box-sizing")?a.outerWidth()+"px":a.width()+"px",a.css(b).addClass(t),null==p&&(a.after(h),"left"!==r&&"right"!==r||h.append(a)),a.trigger("sticky_kit:stick")),m&&w&&(null==k&&(k=e+u+c>C+n),!v&&k)))return v=!0,"static"===g.css("position")&&g.css({position:"relative"}),
a.css({position:"absolute",bottom:d,top:"auto"}).trigger("sticky_kit:bottom")},y=function(){x();return l()},H=function(){G=!0;f.off("touchmove",l);f.off("scroll",l);f.off("resize",y);b(document.body).off("sticky_kit:recalc",y);a.off("sticky_kit:detach",H);a.removeData("sticky_kit");a.css({position:"",bottom:"",top:"",width:""});g.position("position","");if(m)return null==p&&("left"!==r&&"right"!==r||a.insertAfter(h),h.remove()),a.removeClass(t)},f.on("touchmove",l),f.on("scroll",l),f.on("resize",
y),b(document.body).on("sticky_kit:recalc",y),a.on("sticky_kit:detach",H),setTimeout(l,0)}};n=0;for(K=this.length;n<K;n++)d=this[n],J(b(d));return this}}).call(this);    
    
    
    

