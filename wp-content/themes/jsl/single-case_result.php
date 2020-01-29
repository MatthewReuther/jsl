
<?php 
		global $post; $parent_id = $post->post_parent;
		$sidebar =  get_field('display_sidebar');
		
		$content_area =  get_field('main_content_area');
		$background_image =  get_field('main_content_bg_img');
				            
		$case_total = nice_number(get_field('case_total',$the_pages->ID));
		$case_description = get_field('case_description', $the_pages->ID);

?>
<?php get_header(); ?>



<div class="main-content-container clearfix" <?php if (!$include_banner) { ?> style="padding-top: 120px;"<?php }?>>
		<div class="main-content-wrap">	
			

			<div class="frame-main clearfix">	
					
					<div class="row">
			    		<div class="col content-container no-gutter col-md-8">
				        	<div class="col-md-12 frame-content">
					        	
				            	<h1 style="color: #17345d; margin-bottom: 10px;">$<?php echo $case_total; ?> <?php echo the_title(); ?></h1>
				            	<hr class="color-divider" style="background-color: #1E99D3">
				            	<?php echo $case_description ?>
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

