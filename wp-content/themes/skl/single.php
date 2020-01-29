
<?php 
		global $post; $parent_id = $post->post_parent;
		$sidebar =  get_field('display_sidebar');
		
		$content_area =  get_field('main_content_area');
		$background_image =  get_field('main_content_bg_img');

?>
<?php get_header(); ?>




		<div class="main-content-wrap">	
			

			<div class="frame-main clearfix">	
					
					<div class="row">
			    		<div class="col content-container no-gutter col-md-8">
				        	<div class="col-md-12 frame-content">
					        	<h1><?php the_title(); ?></h1>
				            	<?php the_content(); ?>
				        	</div>
			    		</div>
			    	
					    <div class="col-md-4 sidebar-container">
					        <div class="col-md-12 col box-shadow">
					            <?php echo do_shortcode('[cta_form kind="single-column" title=false descritpion=false]'); ?>
					        </div>
					    </div>
					</div>
								
		
			</div><!-- frame -->
		</div><!-- main-content-wrap -->
	

	</div><!-- main-content-container -->
	

<?php get_footer(); ?>

