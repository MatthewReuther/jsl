<?php
/*
Template Name: Testimonials Layout
*/
?>
<?php
	 
	global $post; $parent_id = $post->post_parent;
	$sidebar =  get_field('display_sidebar');
			$custom_title =  get_field('main_content_area_title');
		$content_area =  get_field('main_content_area');
?>
<?php get_header(); ?>

	<div class="main-content-container clearfix">
		<div class="main-content-wrap" style="padding-bottom: 0px;">	
			
			
				<?php if(!empty($custom_title)) { ?>		
					<h2><?php echo $custom_title ?></h2>
					<hr class="color-divider" style="background-color: #1E99D3">
				<?php } ?>
								        			        
					    <?php echo $content_area ?>
				<?php include('include-content-before.php'); ?>

			
		
		</div><!-- main-content-wrap -->
	

	</div><!-- main-content-container -->
	



	

<?php get_footer(); ?>