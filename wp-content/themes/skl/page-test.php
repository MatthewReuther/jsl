<?php
/*
Template Name: Tests Layout
*/
?>
<?php
	 
	global $post; $parent_id = $post->post_parent;
	$sidebar =  get_field('display_sidebar');
	$offset =  get_field('offset_content');
	$testimonial_amount = get_field('testimonial_amount');

?>
<?php get_header(); ?>


	<div class="main-content-container clearfix offset">

		<div class="main-content-wrap">	

			<div class="frame-main clearfix">
				
				<div class="row clearfix">
					
				<?php 
				
				// query
				$the_query = new WP_Query(array(
					'post_type'			=> 'testimonial',
					'posts_per_page'	=> -1,
/*
					'meta_key'			=> 'testimonial_amount',
					'orderby'			=> 'meta_value',
*/
					'order'				=> 'DESC'
				));
				
				?>
				<?php if( $the_query->have_posts() ): ?>
					<ul>
					<?php while( $the_query->have_posts() ) : $the_query->the_post(); 
						

				            $staff_id = $the_pages->post->ID;
				            $testimonial_author = get_field('testimonial_author',$the_pages->ID);
				            $testimonial_reference = get_field('testimonial_attorney_amount',$the_pages->ID);
				            $testimonial_content = get_field('testimonial_content',$the_pages->ID);
				            $testimonial_amount = get_field('testimonial_amount',$the_pages->ID);
				            $testimonial_attribution = get_field('testimonial_attribution',$the_pages->ID);						
						
						?>
						<li <?php echo $class; ?>>
							<?php echo $testimonial_amount; ?>
						</li>
					<?php endwhile; ?>
					</ul>
				<?php endif; ?>
				
				<?php wp_reset_query();	 // Restore global post data stomped by the_post(). ?>
					
					
					

					
					</div><!-- row -->   
					
					
					<?php include('pagination.php');?>
					
	
				

			</div><!-- frame -->
		
		</div>
	

	</div><!-- main-content-container -->
	



	

<?php get_footer(); ?>