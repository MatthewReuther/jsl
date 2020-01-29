<?php 
		$global_blocks =  get_sub_field('global_blocks');
		$blog_url = get_permalink( get_option( 'page_for_posts' ) );
?>

	<?php if( $global_blocks == 'recent-posts') { ?>

		<section id="recent-posts" class="block block__white  block--align__left clearfix">
		 	 
			<div class="frame__none frame-main">
				<div class="main-inner-wrap clearfix">
				
						<div class="row header-wrap">
							<div class="col col-md-12 no-gutter title-container">
								<span>Blog</span>
								<h2>Firm News</h2>
								
								<?php echo do_shortcode("[btn kind='arrow right' style='font-weight: bold;' color='blue' link='$blog_url']View All Firm News[/btn]"); ?>	
							</div>
							
						
						</div><!-- header-wrap -->

					 			 				
					
		 		
						<div class="row  all-posts recent-posts-container">
		
						
						<!-- 	// Define our WP Query Parameters -->
							<?php $the_query = new WP_Query( 'posts_per_page=4' ); ?>
							<?php $i = 0;  ?>
						<!-- 	// Start our WP Query -->
							<?php while ($the_query -> have_posts()) : $the_query -> the_post(); 
								$featured_image = wp_get_attachment_image_src( get_post_thumbnail_id($post->ID), 'large');
								$post_url = get_permalink();
								
							?>
								<?php $i++ ?>
								<div class="col-<?php echo $i; ?> col-xs-12 col-sm-4 col-md-4 col-lg-3 recent-container clearfix">						
																	
									<div class="inner-wrap clearfix col col-xs-12 col-lg-12 col no-gutter" >
										<div class="img-container col-xs-4 col-sm-12 col no-gutter">
											
											<div class="media-wrapper">
											
												<img src="<?php echo $featured_image[0]; ?>" class="og-image">
										
												<div class="img" style="background-image: url(<?php echo $featured_image[0]; ?>);">
													<img class="spacer" src="<?php bloginfo('template_directory');?>/img/pixel-16x9.png" />
												</div>
											
											</div>
											
										</div>
										
										<span class="date"><?php the_time('F jS, Y') ?></span>
										
<!-- 										<a class="post-title" href="<?php echo the_permalink() ?>"><?php the_title(); ?></a> -->
										<div class="post-title col-xs-8 col-sm-12 col-md-12 col no-gutter clearfix"><?php the_title(); ?></div>
										<?php echo do_shortcode("[btn kind='arrow right' style='font-weight: 600;'  color='blue'  link='$post_url']Read More[/btn]"); ?>
																	
									</div><!-- inner-wrap -->
								
								

								</div><!-- recent-container -->		
												
								<?php 
								
									endwhile;
							
									wp_reset_postdata();
								?>
							<div class="veiw-posts-mobile">
								<?php echo do_shortcode("[btn kind='arrow right' style='font-weight: bold;' color='blue' link='$blog_url']View All Firm News[/btn]"); ?>
							</div>	
						</div><!-- row -->			
							
		
				
		 				
		 		

				</div><!-- /.main-inner-wrap -->
			</div><!-- /.frame -->
			
		</section>
		
	<?php } ?>
	
	<?php if( $global_blocks == 'locations') { ?>
	
		<section id="firm-locations" class="block block__white  block--align__left clearfix">
		 	 
			<div class="frame__none frame-main ">
				<div class="main-inner-wrap clearfix">
				
						<div class="row header-wrap">
							
							<div class="col col-md-12 title-container no-gutter">
								<h2>Locations</h2>
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
									<div class="col col-md-3 location-container">
										<div class="inner-wrap">
											<div class="location-info">
												<span class="location-title"><?php echo $title; ?></span>
												<span class="location-address"><?php echo $address_street; ?></span>
												<span class="location-address"><?php echo $address_city_state; ?></span>
											</div>
											
											
											<div class="location-directions">
																				
												<?php echo do_shortcode("[btn kind='arrow right' style='font-size: 14px;' color='white' link='$directions' target='_blank']Get Directions[/btn]"); ?>
												
											</div>
										</div>
							
										
									</div>
							
								<?php endwhile; ?>
							
						
						</div>
							<?php endif; ?>
					
		 				
				</div><!-- /.main-inner-wrap -->
			</div><!-- /.frame -->
		</section>
			
	<?php } ?>
	
	
	<?php if( $global_blocks == 'callout') { ?>
	
		<section id="firm-callouts" class="block block__white  block--align__left clearfix">
		 	 
			<div class="frame__none frame-main ">
				<div class="main-inner-wrap clearfix">
				

						<?php if( have_rows('callout_repeater', 'option') ): ?>							
						<div class="row clearfix">
								
								<?php $i = 0;  ?>
								<?php while( have_rows('callout_repeater', 'option') ): the_row(); 
									
									// vars
									$title = get_sub_field('callout_title', 'option');
									$image = get_sub_field('callout_image', 'option');
									?>
									
									<?php $i++ ?>
									<div class="col col-<?php echo $i; ?> col-md-4 callout-container">
										<div class="inner-wrap">
											<div class="callout-image" style="background-image: url(<?php echo $image['url']; ?>);">
												
											</div>
<!-- 											<img class="callout-image" src="<?php echo $image['url']; ?>"> -->
											<span class="callout-title"><?php echo $title; ?></span>
										</div>
											
											
									</div>
							
										
							
								<?php endwhile; ?>
							
						
						</div>
							<?php endif; ?>
					
		 				
				</div><!-- /.main-inner-wrap -->
			</div><!-- /.frame -->
		</section>
			
	<?php } ?>
	

	<?php if( $global_blocks == 'form') { ?>


<section id="get-help" class="block block-one-column   block--align__left clearfix" style="background-color: ">
 
 
 	<div class="frame__none frame-main">	 	
 		<div class="main-inner-wrap clearfix">
 			 			 				

 		
 					<div class="row">

						
										

																
									<div class=" col col-left clearfix col-md-12">						
										<div class="col col-md-9 frame-center clearfix">										
											<div class="inner-wrap clearfix" style="color:#33424A;">
																																																
												
												<?php echo do_shortcode('[cta_form title=false descritpion=false]'); ?>													
												
																								
											</div>
										</div>
									</div>
										
																					

									
														
												
									 					 			
		 		

				
				 			</div><!-- row -->
 			
 				

		</div><!-- /.inner-content -->
	</section>




			
	<?php } ?>