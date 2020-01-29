						

		<?php
		$logo = get_field('footer_logo', 'option');
		$disclaimer = get_field('option_disclaimer', 'option');
		?>				    
				    
		<footer>
			<div class="footer-container">
				<div class="frame frame-main clearfix">
					<div class="navigation-container clearfix">
						<a href="/" class="logo">
		
							<img src="<?php bloginfo('template_directory');?>/img/logo/JSL-logo-update-whiteblue.svg" alt="<?php bloginfo('template_directory');?>/img/logo/SKL_logo_white.svg" />
						</a>
												
						<?php wp_nav_menu( array('theme_location' => 'footer-menu', 'container' => '', 'container_class' => '', 'menu_class' => 'footer-menu footer-main-menu') ); ?>
						
						
						<?php if( have_rows('option_socials', 'option') ): ?>
					
					    	<ul class="footer-menu social-menu">
					
							<?php while( have_rows('option_socials', 'option') ): the_row(); ?>
								<?php
									
									$image = get_sub_field('social_icon');
								
								?>	
								<li>
					        		<a class="social-icon" href="<?php the_sub_field('social_link'); ?>" alt="<?php the_sub_field('social_name'); ?>" target="_blank" rel="nofollow">
						        	
										<?php echo file_get_contents($image); ?>
					        		</a>
					        	
								</li>
					
							<?php endwhile; ?>
					
					    	</ul>
					
						<?php endif; ?>
						
						
						
					<div class="social-conatiner">
						<?php
		
						// check if the repeater field has rows of data
						if( have_rows('option_socials_repeater', 'option') ): 
						
						 	// loop through the rows of data
						    while ( have_rows('option_socials_repeater', 'option') ) : the_row();
						
						 		$social_name = get_sub_field( 'option_social_name' );
						 		$social_image_desktop = get_sub_field( 'option_social_icon' );
						 	
						 		$social_link = get_sub_field( 'option_social_link' );
						 		
						 		?>
						 		
						 		<a href="<?php echo $social_link ?>" target="_blank">
<!-- 							 		<img src="<?php echo $social_image_desktop['url']; ?>" alt="<?php echo $social_name; ?>"> -->
							 		<i class="icon" style="background-image: url('<?php echo $social_image_desktop['url']; ?>');"></i>
						 		</a>
						 		
						 		<?php
						
						    endwhile;
						
						
						endif;
						
						?>
					</div>						
						
						
						
				</div>

			
				<div class="row all-locations clearfix">
					<div class="location-title col col-xs-4 no-gutter clearfix">
						<span>Locations</span>
					</div>
<!-- 						col-sm-5 col-md-4 col-lg-3 -->
					<div class="all-locations col no-gutter clearfix col-xs-8 col col-sm-12 col-md-12 col-lg-12">
						<?php if( have_rows('locations_repeater', 'option') ): ?>
						
								
								<?php $i = 0;  ?>
								<?php while( have_rows('locations_repeater', 'option') ): the_row(); 
									
									// vars
									$title = get_sub_field('location_title', 'option');
									$address_street = get_sub_field('location_address', 'option');
									$address_city_state = get_sub_field('location_city_state_zip', 'option');
									$directions = get_sub_field('location_directions', 'option');
									
									?>
									
									<?php $i++ ?>
									<div class="col col-md-3 col-xs-6 location-container">
										<div class="inner-wrap">
											<div class="location-info">
												<span class="location-title"><?php echo $title; ?></span>
												<span class="location-address"><?php echo $address_street; ?></span>
												<span class="location-address"><?php echo $address_city_state; ?></span>
											</div>
											
						
										</div>
							
										
									</div>
							
								<?php endwhile; ?>
							
					</div>
						
							<?php endif; ?>

					</div>
				</div><!-- /.frame -->
			</div>
			

			<div class="copyright-container">
				<div class="frame-main">
					<?php echo $disclaimer; ?>
				
				<div class="social-conatiner mobile">
					<?php
	
					// check if the repeater field has rows of data
					if( have_rows('option_socials_repeater', 'option') ): 
					
					 	// loop through the rows of data
					    while ( have_rows('option_socials_repeater', 'option') ) : the_row();
					
					 		$social_name = get_sub_field( 'option_social_name' );
					 		$social_image_mobile = get_sub_field( 'option_social_icon_mobile' );
					 		$social_link = get_sub_field( 'option_social_link' );
					 		
					 		?>
					 		
					 		<a href="<?php echo $social_link ?>" target="_blank">
						 		
						 		<i class="icon" style="background-image: url('<?php echo $social_image_mobile['url']; ?>');"></i>
					 		</a>
					 		
					 		<?php
					
					    endwhile;
					
					
					endif;
					
					?>
				</div>
					
					
				</div>
				

				
			</div>

		</footer>
				    
				    		  
	</div><!-- /.page-container -->
	<?php wp_footer(); ?>
	</body>
</html>

