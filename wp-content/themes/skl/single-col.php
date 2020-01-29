<?php
/*
Template Name: Single Column Layout
*/
?>
<?php 
		global $post; $parent_id = $post->post_parent;
		$sidebar =  get_field('display_sidebar');
		$offset =  get_field('offset_content');
		$content_area =  get_field('main_content_area');
		$background_image =  get_field('main_content_bg_img');
		$phone_number =  get_field( 'phone_number', 'options' );

?>
<?php get_header(); ?>
	<div class="main-content-container clearfix <?php if($offset) { ?> offset <?php } ?>" <?php if (!empty($background_image)) { ?>style="background-image: url('<?php echo $background_image['url']; ?>'); background-repeat: no-repeat; 
    background-size: cover; " <?php } ?>>




		
			
			
		
			<div class="main-content-wrap">	
				<div class="frame-main clearfix">	
						
					<div class="row">
						
							
							
						
								    
					</div>
									
				</div>
			<?php include('include-content-before.php'); ?>	
			</div>
				


		
		
	</div>
	

<?php get_footer(); ?>