<?php
/*
Template Name: Community Giveaways Layout
*/
?>
<?php 
		global $post; $parent_id = $post->post_parent;
		$custom_title =  get_field('main_content_area_title');
		$content_area =  get_field('main_content_area');
		
?>

<?php get_header(); ?>

	<div class="main-content-container clearfix">
		<div class="main-content-wrap">	
			<div class="frame-main clearfix">

				<div class="row  all-posts clearfix">
					<?php
						$paged = (get_query_var('paged')) ? get_query_var('paged') : 1; 
						$args = array(
						    'post_type' => 'gives',
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
									$excerpt_trimmed = get_field('giveaway_location');
									$featured_image = get_field('giveaway_image');
									$post_url = get_permalink(); 
									
									$giveaway_location = get_field('giveaway_location');
									$giveaway_date = get_field('giveaway_date');
									$giveaway_description = get_field('giveaway_description');
									$giveaway_url = get_field('giveaway_url');
									
						            ?>
	
									
													            
							           <div class="col col-lg-12 post-container <?php if( $counter % 2 == 0 ) { ?> even <?php } else { ?> odd <?php } ?>">
				
											<div class="inner-wrap  clearfix">
																								
												<div class="col col-lg-6 col-md-6 col-sm-6 col-xs-12 img-container">

													<div class="media-wrapper">
													
														<img src="<?php echo $featured_image['url']; ?>"  alt="<?php the_title(); ?>">
												
<!--
														<div class="img" style="background-image: url(<?php echo $featured_image['url']; ?>);">
															<img class="spacer" src="<?php bloginfo('template_directory');?>/img/pixel-16x9.png" alt="Pixel" />
														</div>
-->
													
													</div>

												</div>

												<div class="col col-lg-6 col-md-6 col-sm-6 col-xs-12 card-content">
													<div cass="col col-lg-10 col-md-10 col-sm-12 col-xs-12 card-content">	
														<h3><?php the_title(); ?></h3>
														<span class="give-location"><?php echo $giveaway_location ?></span>
														<span class="give-date"><?php echo $giveaway_date ?></span>

														<?php echo $giveaway_description ?>
														
														<?php if($giveaway_url) { ?>
															<a href="<?php echo $giveaway_url['url'] ?>" target="_blank" class="c-btn primary "><?php echo $giveaway_url['title'] ?></a>
														
														<?php } ?>
														
														
													</div>
												</div>
		
												
										
		
					            			</div>
					            			
							            </div>
						            	
						            	<?php $counter++; ?>
														            	
						           
						    <?php } ?>
						    <?php wp_reset_postdata(); ?>
						<?php } ?>
						
					
					</div><!-- row -->   
					
					<?php if(!empty($custom_title)) { ?>
								
						<h2 style="color: <?php echo $mc_header_fc ?>!important;"><?php echo $custom_title ?></h2>
						<hr class="color-divider" style="background-color: #1E99D3">
										
					<?php } ?>
		        			        
	            	<?php echo $content_area ?>					
					
					<?php include('pagination.php');?>
					

			

			</div><!-- frame -->
		</div><!-- main-content-wrap -->
	

	</div><!-- main-content-container -->
	



	

<?php get_footer(); ?>