<?php 
		global $post; $parent_id = $post->post_parent;
		$offset = get_field( 'offset_content', get_option('page_for_posts'));
		
?>

<?php get_header(); ?>

	<div class="main-content-container clearfix">
		<div class="main-content-wrap">	
			<div class="frame-main clearfix">
				
				<div class="row  all-posts clearfix">
					<?php
						$paged = (get_query_var('paged')) ? get_query_var('paged') : 1; 
						$args = array(
						    'post_type' => 'post',
						    'posts_per_page' => 6,
						    'order' => 'DEC',
						    'paged' => $paged
						    
						);
						
						//Set up a counter
						$counter = 0;
						
						$the_pages = new WP_Query( $args );
						if( $the_pages->have_posts() ){
						    // set variables here, outside loop, if needed
						    
						    while( $the_pages->have_posts() ){
		
									
						            // iterate to next post
						            $the_pages->the_post();
									
				            		$excerpt = get_the_excerpt($the_pages->ID);
									$trim = array(" [", "]");
									$excerpt_trimmed = str_replace($trim, '', $excerpt);
									$featured_image = wp_get_attachment_image_src( get_post_thumbnail_id($post->ID), 'large');
									$post_url = get_permalink(); 
						            ?>
	
									
													            
							           <div class="col col-lg-12 post-container <?php if( $counter % 2 == 0 ) { ?> even <?php } else { ?> odd <?php } ?>">
				
											<div class="inner-wrap  clearfix">
																								
												<div class="col col-lg-6 col-md-6 col-sm-6 col-xs-12 img-container">

													<div class="media-wrapper">
													
														<img src="<?php echo $featured_image[0]; ?>" class="og-image" alt="<?php the_title(); ?>">
												
														<div class="img" style="background-image: url(<?php echo $featured_image[0]; ?>);">
															<img class="spacer" src="<?php bloginfo('template_directory');?>/img/pixel-16x9.png" alt="Pixel"/>
														</div>
													
													</div>

												</div>

												<div class="col col-lg-6 col-md-6 col-sm-6 col-xs-12 card-content">
													<div cass="col col-lg-10 col-md-10 col-sm-12 col-xs-12 card-content">	
														<h3><?php the_title(); ?></h3>
														<p class="excerpt"><?php echo $excerpt_trimmed; ?></p>
														<a href="<?php echo $post_url ?>" class="c-btn primary ">Read More</a>
														
													</div>
												</div>
		
												
										
		
					            			</div>
					            			
							            </div>
						            	
						            	<?php $counter++; ?>
														            	
						           
						    <?php } ?>
						    <?php wp_reset_postdata(); ?>
						<?php } ?>
						
					
					</div><!-- row -->   
					
					
					<?php include('pagination.php');?>
					

			

			</div><!-- frame -->
		</div><!-- main-content-wrap -->
	

	</div><!-- main-content-container -->
	



	

<?php get_footer(); ?>