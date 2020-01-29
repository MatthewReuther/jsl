
<?php 
		global $post; $parent_id = $post->post_parent;
		$sidebar =  get_field('display_sidebar');
		
		$content_area =  get_field('main_content_area');
		$background_image =  get_field('main_content_bg_img');
				            
        $testimonial_author = get_field('testimonial_author',$the_pages->ID);
        $testimonial_reference = get_field('testimonial_attorney_amount',$the_pages->ID);
        $testimonial_content = get_field('testimonial_content',$the_pages->ID);
        $testimonial_amount = number_format(get_field('testimonial_amount',$the_pages->ID), 2, '.', ',');
        $testimonial_attribution = get_field('testimonial_attribution',$the_pages->ID);
        $testimonial_quote = get_field('testimonial_quote_color',$the_pages->ID);

?>
<?php get_header(); ?>



<div class="main-content-container clearfix" <?php if (!$include_banner) { ?> style="padding-top: 120px;"<?php }?>>
		<div class="main-content-wrap">	
			

			<div class="frame-main clearfix">	
					
					<div class="row">
			    		<div class="col content-container no-gutter col-md-8">
				        	<div class="col-md-12 frame-content">
					        	
				            	<h1 style="color: #17345d; margin-bottom: 10px;"><?php echo the_title(); ?></h1>
				            	<hr class="color-divider" style="background-color: #1E99D3">
				            	<?php echo $testimonial_content ?>
				            	-<?php echo $testimonial_author ?>
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

