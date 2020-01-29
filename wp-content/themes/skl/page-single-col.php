<?php
/*
Template Name: Single Column Layout Test
*/
?>

<?php 
		global $post; $parent_id = $post->post_parent;
		$sidebar =  get_field('display_sidebar');
		$offset =  get_field('offset_content');
		$content_area =  get_field('main_content_area');
		$background_image =  get_field('main_content_bg_img');
		$phone_number =  get_field( 'phone_number', 'options' );

?>
<?php get_header(); ?>
	<div class="main-content-container clearfix <?php if($offset) { ?> offset <?php } ?>" <?php if (!empty($background_image)) { ?>style="background-image: url('<?php echo $background_image['url']; ?>'); background-repeat: no-repeat; 
    background-size: cover; " <?php } ?>>



		<div class="main-content-wrap">	
			
			
			
				<div class="frame-main clearfix">	
						
					<div class="row">
						
							
				    		<div class="col content-container no-gutter col-md-12">
					        	<div class="col-md-12 frame-content clearfix">
						        							        
					            	<?php echo $content_area ?>
										<?php include('include-content-main.php'); ?>
										
										
							<div id="indexDiv" class="wheelNav400"><svg height="400" version="1.1" width="400" xmlns="http://www.w3.org/2000/svg" style="overflow: hidden; position: relative;" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet"><path fill="#d63c22" stroke="#333333" d="M200,200L72.72077938642141,72.72077938642146A180,180,0,0,1,185.8773627689878,20.554879928036968L199.99999999999997,20L214.12263723101196,20.55487992803694A180,180,0,0,1,327.2792206135785,72.72077938642141Z" stroke-width="0" fill-opacity="1" id="wheelnav-indexDiv-slice-3" transform="matrix(1,0,0,1,0,0)" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); cursor: pointer; fill-opacity: 1;"></path><path fill="none" stroke="#444444" d="M0,0" stroke-width="1" id="wheelnav-indexDiv-line-3" transform="matrix(1,0,0,1,0,0)" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); cursor: pointer;"></path><path fill="#333333" stroke="none" d="M200.0009999439451,77.625C191.77899994394508,77.625,185.0899999439451,84.314,185.0899999439451,92.536C185.0899999439451,98.798,188.96999994394508,104.17,194.45199994394508,106.375L198.0909999439451,97.299C196.2029999439451,96.54100000000001,194.86899994394508,94.69500000000001,194.86899994394508,92.536C194.86899994394508,89.702,197.16599994394508,87.404,199.99999994394508,87.404S205.13099994394508,89.702,205.13099994394508,92.536C205.13099994394508,94.693,203.79699994394508,96.541,201.90899994394508,97.299L205.54899994394506,106.375C211.02799994394508,104.169,214.90999994394505,98.797,214.90999994394505,92.536C214.91099994394506,84.31400000000001,208.22199994394506,77.625,200.00099994394506,77.625Z" font="100 24px Impact, Charcoal, sans-serif" id="wheelnav-indexDiv-title-3" transform="matrix(1.6767,0,0,1.6767,-135.3454,-62.2589)" stroke-width="0.5964000022421956" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); font: 100 24px Impact, Charcoal, sans-serif; cursor: pointer;"></path><path fill="#f77604" stroke="#333333" d="M200,200L72.72077938642146,327.27922061357856A180,180,0,0,1,20.554879928036968,214.1226372310121L20,200.00000000000003L20.554879928036968,185.87736276898792A180,180,0,0,1,72.72077938642141,72.72077938642146Z" stroke-width="0" fill-opacity="1" id="wheelnav-indexDiv-slice-2" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); cursor: pointer; fill-opacity: 1;" transform="matrix(1,0,0,1,0,0)"></path><path fill="none" stroke="#444444" d="M0,0" stroke-width="1" id="wheelnav-indexDiv-line-2" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); cursor: pointer;" transform="matrix(1,0,0,1,0,0)"></path><text x="92" y="200" text-anchor="middle" font="100 24px Impact, Charcoal, sans-serif" stroke="none" fill="#333333" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); text-anchor: middle; font: 100 24px Impact, Charcoal, sans-serif; cursor: pointer;" id="wheelnav-indexDiv-title-2" transform="matrix(1,0,0,1,0,0)"><tspan dy="9.5" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);">how to use?</tspan></text><path fill="#f5be41" stroke="#333333" d="M200,200L327.27922061357856,327.27922061357856A180,180,0,0,1,214.1226372310121,379.44512007196306L200,380L185.87736276898792,379.44512007196306A180,180,0,0,1,72.72077938642146,327.27922061357856Z" stroke-width="0" fill-opacity="1" id="wheelnav-indexDiv-slice-1" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); cursor: pointer; fill-opacity: 1;" transform="matrix(1,0,0,1,0,0)"></path><path fill="none" stroke="#444444" d="M0,0" stroke-width="1" id="wheelnav-indexDiv-line-1" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); cursor: pointer;" transform="matrix(1,0,0,1,0,0)"></path><text x="200" y="308" text-anchor="middle" font="100 24px Impact, Charcoal, sans-serif" stroke="none" fill="#333333" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); text-anchor: middle; font: 100 24px Impact, Charcoal, sans-serif; cursor: pointer;" id="wheelnav-indexDiv-title-1" transform="matrix(1,0,0,1,0,0)"><tspan dy="9.5" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);">what's this?</tspan></text><desc style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);">Created with Raphaël 2.1.2</desc><defs style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"></defs><path fill="#2d9e46" stroke="#111111" d="M200,200L327.27922061357856,72.72077938642146A180,180,0,0,1,379.44512007196306,185.87736276898792L398,200L379.44512007196306,214.1226372310121A180,180,0,0,1,327.27922061357856,327.27922061357856Z" stroke-width="0" fill-opacity="1" id="wheelnav-indexDiv-slice-0" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); cursor: default; fill-opacity: 1;" transform="matrix(1,0,0,1,0,0)"></path><path fill="none" stroke="#444444" d="M0,0" stroke-width="1" id="wheelnav-indexDiv-line-0" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); cursor: default;" transform="matrix(1,0,0,1,0,0)"></path><text x="308" y="200" text-anchor="middle" font="100 24px Impact, Charcoal, sans-serif" stroke="none" fill="#ffffff" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); text-anchor: middle; font: 100 24px Impact, Charcoal, sans-serif; cursor: default;" id="wheelnav-indexDiv-title-0" transform="matrix(1,0,0,1,0,0)"><tspan dy="9.5" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);">wheelnav.js</tspan></text></svg></div>
					        	</div>
				    		</div>
				    	
													
							
					
								    
					</div>
									
				</div>
			
			</div>
		
			

		
		
	</div>
	

<?php get_footer(); ?>