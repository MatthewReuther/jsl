						

		<?php
		$logo = get_field('footer_logo', 'option');
		$disclaimer = get_field('option_disclaimer', 'option');
		?>				    
	    
		<footer>
			<div class="footer-container row">
				<div class="row frame-main clearfix">
					<div class="navigation-container col col-md-12 clearfix">
					<div class="logo-container col col-lg-2 col-md-2 col-sm-2 col-xs-12">
						<a href="/" class="logo">
		
<!-- 							<img style="width: 120px;" src="<?php bloginfo('template_directory');?>/img/logo/JSL-logo-update-whiteblue.svg" alt="<?php bloginfo('template_directory');?>/img/logo/SKL_logo_white.svg" /> -->
							<img src="<?php bloginfo('template_directory');?>/img/logo/JSL-logo-update-whiteblue.svg" alt="<?php bloginfo('template_directory');?>/img/logo/SKL_logo_white.svg" />
						</a>
					</div>
												
						<?php wp_nav_menu( array('theme_location' => 'footer-menu', 'container' => '', 'container_class' => '', 'menu_class' => 'footer-menu footer-main-menu col col-lg-8 col-md-8  ') ); ?>
						
						
						<?php if( have_rows('option_socials', 'option') ): ?>
					
					    	<ul class="footer-menu  social-menu">
					
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
						
						
						
					<div class="social-conatiner col col-md-2">
						<?php
		
						// check if the repeater field has rows of data
						if( have_rows('option_socials_repeater', 'option') ): 
						
						 	// loop through the rows of data
						    while ( have_rows('option_socials_repeater', 'option') ) : the_row();
						
						 		$social_name = get_sub_field( 'option_social_name' );
						 		$social_image_desktop = get_sub_field( 'option_social_icon' );
						 	
						 		$social_link = get_sub_field( 'option_social_link' );
						 		
						 		?>
						 		
						 		<a class="" href="<?php echo $social_link ?>" target="_blank">
							 		<img src="<?php echo $social_image_desktop['url']; ?>" alt="<?php echo $social_name; ?>">
<!-- 							 		<i class="icon" style="background-image: url('<?php echo $social_image_desktop['url']; ?>');"></i> -->
						 		</a>
						 		
						 		<?php
						
						    endwhile;
						
						
						endif;
						
						?>
					</div>						
						
						
						
				</div>

			
				<div class="row all-locations clearfix">

<!-- 						col-sm-5 col-md-4 col-lg-3 -->
					<div class="all-locations col clearfix col-xs-8 col col-sm-12 col-md-12 col-lg-12">
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
									<div class="col col-md-2 col-sm-3 col-xs-12 location-container">
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
				<div class="row frame-main">
					<div class="inner-wrap col col-md-12">
						<div class="col col-md-12">
							<?php echo $disclaimer; ?>
						</div>
					</div>
				</div>
				

				
			</div>

		</footer>
				    
				    		  
	</div><!-- /.page-container -->
	<?php wp_footer(); ?>
	</body>
</html>

