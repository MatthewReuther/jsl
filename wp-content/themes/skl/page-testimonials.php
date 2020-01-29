<?php
/*
Template Name: Testimonials Layout
*/
?>
<?php
	 
	global $post; $parent_id = $post->post_parent;
	$sidebar =  get_field('display_sidebar');
	$offset =  get_field('offset_content');

?>
<?php get_header(); ?>

		<div class="main-content-wrap">	

			<div class="frame-main clearfix">
				
				<div class="row all-posts grid clearfix">
					<?php
						$paged = (get_query_var('paged')) ? get_query_var('paged') : 1; 

						$args = array(
						    'post_type' => 'testimonial',
						    'posts_per_page' => 9,
						    
							'meta_query' => array(
								'relation' => 'OR',
								array(
							     'key' => 'testimonial_amount',
							     'compare' => 'NOT EXISTS', // doesn't work
							     'value' => '' // This is ignored, but is necessary...
							    ),
							    array(
							     'key' => 'testimonial_amount'
							    
							    )
							    
							),

						    'orderby'	=> 'meta_value_num',
						    'order' => 'DESC',
						    'paged' => $paged
						    
						);

						$the_pages = new WP_Query( $args );
						if( $the_pages->have_posts() ){
						    // set variables here, outside loop, if needed
						    
						    while( $the_pages->have_posts() ){
		
						            // iterate to next post
						            $the_pages->the_post();
						            $staff_id = $the_pages->post->ID;
						            $testimonial_author = get_field('testimonial_author',$the_pages->ID);
						            $testimonial_reference = get_field('testimonial_attorney_amount',$the_pages->ID);
						            $testimonial_content = get_field('testimonial_content',$the_pages->ID);
						            $testimonial_amount = number_format(get_field('testimonial_amount',$the_pages->ID), 2, '.', ',');
						            $testimonial_attribution = get_field('testimonial_attribution',$the_pages->ID);
						            
						            
						            
						            ?>
	

									<div class="col col-xs-12 col-sm-6 col-md-4 col-lg-4 grid-item" data-url="<?php the_permalink(); ?>">
				
													            
							            <div class="col col-md-12 testimonial-container card-container">
				
											<div class="inner-wrap">
												<a href="<?php the_permalink(); ?>"><img src="<?php bloginfo('template_directory');?>/img/icons/icon_testimonial_quote.svg" ></a>
												
												<div class="card-content">
													<?php echo $testimonial_content; ?>
												</div>
		
												<?php if(!empty($testimonial_author )) { ?>
					
													
														<p>– <?php echo $testimonial_author; ?></p>
													
												
												<?php } ?>	
													
												
												
												
												<?php if(!empty($testimonial_attribution)) { ?>
												
													<p><em><?php echo $testimonial_attribution; ?><?php if(!empty($testimonial_amount)) { ?> $<?php echo $testimonial_amount; ?><?php } ?>.</em></p>
													
		
												<?php } ?>
											
	
		
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