<?php
/*
Template Name: Case Results Layout
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
						    'post_type' => 'case_result',
						    'posts_per_page' => 9,

						    'meta_key'	=> 'case_total',
						    'orderby'	=> 'meta_value_num',
						   
							
							
							
						    'paged' => $paged
						    
						    
						);
		
						$the_pages = new WP_Query( $args );
						if( $the_pages->have_posts() ){
						    // set variables here, outside loop, if needed
						    
						    while( $the_pages->have_posts() ){
		
						            // iterate to next post
						            $the_pages->the_post();
						            $staff_id = $the_pages->post->ID;
						            
						            $case_amount = get_field('case_amount',$the_pages->ID);
						            
									$case_total = nice_number(get_field('case_total',$the_pages->ID));
						            $case_description = get_field('case_description', $the_pages->ID);
						            
						            
						            
						            
						            
						            ?>
						            
						            
						            
	
	
									<div class="col col-xs-12 col-sm-6 col-md-4 col-lg-4 grid-item">
										
													            
							            <div class="col col-md-12 no-gutter result-container card-container">
				
											<div class="inner-wrap">
												
												
												<div class="card-content">
													
													<h3>$<?php echo $case_total; ?> <?php echo the_title(); ?></h3>
													
													
													<?php echo $case_description; ?>
													<p class="todo"><a href="<?php the_permalink(); ?>">&nbsp;</a><p>
												</div>
													
		
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