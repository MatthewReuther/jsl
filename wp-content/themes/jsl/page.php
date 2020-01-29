<?php 
		global $post; $parent_id = $post->post_parent;
		$sidebar =  get_field('display_sidebar');
		$include_banner = get_field('has_banner');
		
		$custom_title =  get_field('main_content_area_title');
		$content_area =  get_field('main_content_area');
		
		$mc = get_field('mc_appearance_fields');
		// Desktop Vars
		$mc_header_fc = $mc['header_font_color'];
		$mc_body_fc = $mc['body_font_color'];

?>
<?php get_header(); ?>
			
								
			<?php if($sidebar) { ?>
			<div class="main-content-wrap" <?php if (!$include_banner) { ?> style=""<?php }?>>	
				<div class="frame-main clearfix">	
						
					<div class="row">
						
						<?php if ( is_page( array( 'portal') )) { ?>

				    		<div class="col content-container no-gutter col-md-6" id="portalDescription">
					        	<div class="col-md-12 frame-content clearfix">
						        	
						        	<?php if(!empty($custom_title)) { ?>
												
										<h2><?php echo $custom_title ?></h2>
										<hr class="color-divider" style="background-color: #FA5095">
									<?php } ?>
									
						        					        
					            	<?php echo $content_area ?>
									<?php include('include-content-main.php'); ?>
					        	</div>
				    		</div>
				    	
							<div id="pip-login" class="col-md-6 sidebar-container iFrameLogin">
					        	<div class="col-md-12 col box-shadow" id="portalContent">
									
										<iframe id="iFramePortal" src="//portal.pip-app.com/loginclient.asp" frameborder="no" style="border:0px; width:100%; height:230px"></iframe>
														        	
					        	</div>
					    	</div>						
							
						<?php } elseif ( is_page( array( 'contact-us') )) { ?>

				    		<div class="col content-container no-gutter col-md-7">
					        	<div class="col-md-12 frame-content clearfix" style="color: <?php echo $mc_body_fc ?> !important;">
						        
						        	<?php if(!empty($custom_title)) { ?>
												
										<h2 style="color: <?php echo $mc_header_fc ?>!important;"><?php echo $custom_title ?></h2>
										<hr class="color-divider" style="background-color: #1E99D3">
														
									<?php } ?>
						        			        
					            	<?php echo $content_area ?>
									<?php include('include-content-main.php'); ?>
									<section id="firm-locations" class="block block__white  block--align__left clearfix">
										<div class="frame__none ">
											<div class="main-inner-wrap clearfix">
												<div class="row header-wrap">
													<div class="title-container ">
														<h2>Our Locations</h2>
													</div>
												</div>
												<?php if( have_rows('locations_repeater', 'option') ): ?>
												<div class="row all-locations clearfix">
													<?php $i = 0;  ?>
													<?php while( have_rows('locations_repeater', 'option') ): the_row(); 
																
																// vars
																$title = get_sub_field('location_title', 'option');
																$address_street = get_sub_field('location_address', 'option');
																$address_city_state = get_sub_field('location_city_state_zip', 'option');
																$directions = get_sub_field('location_directions', 'option');
																?>
													<?php $i++ ?>
													<div class="col col-lg-4 col-md-6 col-sm-6 col-xs-12  location-container">
														<div class="inner-wrap">
															<div class="location-info">
																<span class="location-title">
																	<?php echo $title; ?>
																</span>
																<span class="location-address">
																	<?php echo $address_street; ?>
																</span>
																<span class="location-address">
																	<?php echo $address_city_state; ?>
																</span>
															</div>
															<div class="location-directions">
																<?php echo do_shortcode("[btn kind='arrow right' style='font-size: 14px;' color='white' link='$directions' target='_blank']Get Directions[/btn]"); ?>
															</div>
														</div>
													</div>
													<?php endwhile; ?>
												</div>
												<?php endif; ?>
											</div>
											<!-- /.main-inner-wrap -->
										</div>
									</section>
									
									
					        	</div>
				    		</div>
				    	
							<div class="col-md-5 sidebar-container">
					        	<div class="col-md-12 col box-shadow">
								
									<?php echo do_shortcode('[cta_form kind="single-column" title=false descritpion=false]'); ?>
					        	
					        	</div>
					    	</div>							
							
						<?php } else { ?>
							
				    		<div class="col content-container no-gutter col-md-8">
					        	<div class="col-md-12 frame-content clearfix" style="color: <?php echo $mc_body_fc ?> !important;">
						        
						        	<?php if(!empty($custom_title)) { ?>
												
										<h2 style="color: <?php echo $mc_header_fc ?>!important;"><?php echo $custom_title ?></h2>
										<hr class="color-divider" style="background-color: #1E99D3">
														
									<?php } ?>
						        			        
					            	<?php echo $content_area ?>
									<?php include('include-content-main.php'); ?>
					        	</div>
				    		</div>
				    	
							<div class="col-md-4 sidebar-container">
					        	<div class="col-md-12 col box-shadow">
								
									<?php echo do_shortcode('[cta_form kind="single-column" title=false descritpion=false]'); ?>
					        	
					        	</div>
					    	</div>								
							
						<?php } ?>
								    
					</div><!-- row -->
									
				</div><!-- frame -->
			
			</div><!-- main-content-wrap -->
		
			<?php include('include-content-before.php'); ?>
			
		</div><!-- main-content-container -->	
			
		
			
		<?php } else if ( !empty($content_area) ) {  ?>
		
		
			<div class="main-content-wrap" <?php if (!$include_banner) { ?> style=""<?php }?>>	
				<div class="frame-main clearfix">	
					<div class="col content-container no-gutter col-md-12">
						<div class="col-md-12 frame-content clearfix">
							
							<?php if((!empty($custom_title) && $include_banner)) { ?>
												
								<h2><?php echo $custom_title ?></h2>
								
							<?php } else { ?>
								
								<h1 style="color: <?php echo $mc_header_fc ?>!important;"><?php echo $custom_title ?></h1>
								
								
							<?php }  ?>			    							        
					    	<?php echo $content_area ?>
							<?php include('include-content-main.php'); ?>
							
						</div>
					</div>
				</div>
			</div>
		
		</div><!-- main-content-container -->
		
		<?php include('include-content-before.php'); ?>
		
				
		
		<?php } else { ?>
		
		<?php include('include-content-before.php'); ?>
		
		
		<?php } ?>




	

<?php get_footer(); ?>