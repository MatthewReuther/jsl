<?php 
		global $post; $parent_id = $post->post_parent;
		$sidebar =  get_field('display_sidebar');
		$offset =  get_field('offset_content');
		$content_area =  get_field('main_content_area');
		$background_image =  get_field('main_content_bg_img');
		$vzaar_id =  get_field('vzaar_id');

?>
<?php get_header(); ?>

		<div class="main-content-wrap">	
			

			<div class="frame-main clearfix">	
					
					<div class="row">
			    		<div class="col content-container no-gutter col-md-12">
				        	<div class="col-md-12 frame-content">
								<?php echo $content_area ?>
				            	<?php echo do_shortcode("[vzaar id='$vzaar_id']"); ?>
				        	</div>
			    		</div>
					</div><!-- row -->
			    	
				   
			</div><!-- frame -->
		</div><!-- main-content-wrap -->
	

	</div><!-- main-content-container -->
	
	
	
	

<?php get_footer(); ?>