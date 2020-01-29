	var activeWheel;
	
	
	
	window.onload = function () {
	    $('#wheel-case-results').append($('#caseResultsMenu .wheel-data'));
	
	    
	    
	    //case-results Wheel
	    $currentwidth = $('#caseResultsMenu').width();
	    var caseResultsMenu = new wheelnav('caseResultsMenu');
	    
	    caseResultsMenu.sliceInitPathFunction = caseResultsMenu.slicePathFunction;
// 	    caseResultsMenu.wheelRadius = caseResultsMenu.wheelRadius * 1.1;
	    caseResultsMenu.wheelRadius = 400;
	    caseResultsMenu.clockwise = false;
		
				
	    caseResultsMenu.slicePathFunction = slicePath().PieSlice;
	    caseResultsMenu.slicePathCustom = slicePath().PieSliceCustomization();
	    
		caseResultsMenu.selectedPercent = 1.2;
		caseResultsMenu.hoverPercent = 1.1;
	    caseResultsMenu.animatetime = 300;
	    caseResultsMenu.animateeffect = 'linear';
		caseResultsMenu.sliceSelectedTransformFunction = sliceTransform().ScaleTransform;
		caseResultsMenu.titleWidth = 70;
		caseResultsMenu.titleSelectedWidth = 90;

		
	    caseResultsMenu.createWheel();
	    
	 
	    activeWheel = caseResultsMenu;
	    activeWheel.navItems[activeWheel.selectedNavItemIndex].navigateFunction.call();
	    
			
		window.addEventListener("resize", resizeMenu);
		

		function resizeMenu(){
			activeWheel.refreshWheel();
		    
		}
	
	
	    //Tabs
	    
	    //toggle tab active classes
	    
	    $("ul.tab li").on("click", function(event){
	        if ($("section.info-panel > ul.tab > li").hasClass("active")){
	           $("section.info-panel > ul.tab > li").removeClass("active"); 
	           $(".tab-content-container > section").removeClass("active"); 
	        }
	        
	        $(this).toggleClass("active");
	        $("section[data-panel-index='" + $(this).attr('data-tabindex') + "']").addClass("active");
	       
	    }); 
	    
	      
	    
	    //Wait half a second then slide wheel in
	    var active = "slide-from-left";
	    
	    setTimeout(function () {
	        $("section[data-study-wheel='case-results']").addClass(active);
	    }, 100);
	   
	    
	   
	 
	    //Wheel Nav Menu
	    $("a[data-study-link]").on("click", function(){
	        switch($(this).attr('data-study-link')) {
				case 'case-results':
				    activeWheel = caseResultsMenu;
				    break;
	
			}
			
	        activeWheel.navItems[activeWheel.selectedNavItemIndex].navigateFunction.call();
			
			$('.dropdown > a').html($(this).html());
	        
	        $("section.area-of-study > ul > li > a").removeClass("active");
	        $(this).addClass('active');
	    
	        
	        $("section[data-study-wheel]").removeClass(active);
	    
	        $("section[data-study-wheel='" + $(this).attr('data-study-link') + "']").addClass(active);
	        
	        $('.area-of-study .dropdown').removeClass('active');
	        
	        return false;
	     });
	    
	
		//console.log(caseResultsMenu);
		var rndSlice = -1;
		var rndSlice2 = -1;
			
		$('.next').click(function() {
			if(activeWheel.selectedNavItemIndex == activeWheel.navItemCount - 1) {
				activeWheel.navigateWheel(0).add('current');
				activeWheel.navItems[activeWheel.selectedNavItemIndex].navigateFunction.call();
			} else  {
				activeWheel.navigateWheel(activeWheel.selectedNavItemIndex + 1);
				activeWheel.navItems[activeWheel.selectedNavItemIndex].navigateFunction.call();
			}
		});
		
		$('.previous').click(function() {
			if(activeWheel.selectedNavItemIndex == 0) {
				activeWheel.navigateWheel(activeWheel.navItemCount - 1);
				activeWheel.navItems[activeWheel.selectedNavItemIndex].navigateFunction.call();
			} else  {
				activeWheel.navigateWheel(activeWheel.selectedNavItemIndex - 1);
				activeWheel.navItems[activeWheel.selectedNavItemIndex].navigateFunction.call();
			}
		});
		
		
	        
	};
	
	function swapProgramData() {
	    var resultAmount, resultTitle;
	    var dataObj;
	    
	    
	    setTimeout(function() {
	        switch(activeWheel.holderId) {
	            case 'caseResultsMenu':
	                dataObj = $('#wheel-case-results .wheel-data')[activeWheel.selectedNavItemIndex];
	                break;
	                   }
	        
	
	              
	        resultAmount = $('[data-info="result-amount"]', dataObj).html();
	        resultTitle = $('[data-info="result-title"]', dataObj).html();
	
	    	    	
	    	
	        $('.result-amount-container span').html(resultAmount);
	        $('.result-tite-container span').html(resultTitle);
	        
	        
	    }, 200);
	}
	
		// Do this on load and on resize

		
	
