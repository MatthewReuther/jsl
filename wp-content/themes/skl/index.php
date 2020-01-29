<?php 
		global $post; $parent_id = $post->post_parent;
		$offset = get_field( 'offset_content', get_option('page_for_posts'));
		
?>

<?php get_header(); ?>

		
		<div class="main-content-wrap">	
			<div class="frame-main clearfix">
				
				<div class="row all-posts clearfix">
					<?php
						$paged = (get_query_var('paged')) ? get_query_var('paged') : 1; 
						$args = array(
						    'post_type' => 'post',
						    'posts_per_page' => 6,
						    'order' => 'DEC',
						    'paged' => $paged
						    
						);
		
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
	
									
													            
							            <div class="col col-md-12 post-container card-container">
				
											<div class="inner-wrap clearfix">
												
											<?php /* if (!empty($featured_image)) { */ ?> 													
												<div class="col col-md-4 col-sm-3 col-xs-5 img-container">

													<div class="media-wrapper">
													
														<img src="<?php echo $featured_image[0]; ?>" class="og-image">
												
														<div class="img" style="background-image: url(<?php echo $featured_image[0]; ?>);">
															<img class="spacer" src="<?php bloginfo('template_directory');?>/img/pixel-16x9.png" />
														</div>
													
													</div>

												</div>
<!-- 											<?php /*  } */ ?> -->

<!-- 												<div <?php if (!empty($featured_image)) { ?> class="col-md-8 col-sm-9 col-xs-7 col card-content" <?php } else { ?>class="col col-md-12 col-sm-12 col-xs-12 testttt col card-content"  <?php } ?>> -->
												<div class="col col-md-8 col-sm-9 col-xs-7 card-content">
													<span class="date"><?php the_time('F jS, Y') ?></span>
													<h2><?php the_title(); ?></h2>
													<p class="excerpt"><?php echo $excerpt_trimmed; ?></p>
													<?php echo do_shortcode("[btn kind='arrow right' style='font-size: 16px; font-weight: 600;' color='blue'  link='$post_url']Read More[/btn]"); ?>
<!-- 													<a class="btn-more" href="<?php the_permalink(); ?>"> Read More</a> -->
												</div>
		
												
										
		
					            			</div>
					            			
							            </div>
						            	
						            	
														            	
						           
						    <?php } ?>
						    <?php wp_reset_postdata(); ?>
						<?php } ?>
						
					
					</div><!-- row -->   
					
					
					<?php include('pagination.php');?>
					

			

			</div><!-- frame -->
		</div><!-- main-content-wrap -->
	

	</div><!-- main-content-container -->
	



	

<?php get_footer(); ?>