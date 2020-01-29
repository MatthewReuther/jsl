<?php
/*
Template Name: Voting Page Layout
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

		<div class="main-content-wrap">	
			
			
			<?php if($sidebar) { ?>
				<div class="frame-main clearfix">	
						
					<div class="row">
						
							
				    		<div class="col content-container no-gutter col-md-8">
					        	<div class="col-md-12 frame-content clearfix">
						        							        
					            	<?php echo $content_area ?>
										<?php include('include-content-main.php'); ?>
					        	</div>
				    		</div>
				    	
							<div class="col-md-4 sidebar-container">
					        	<div class="col-md-12 col box-shadow">
								
									<?php echo do_shortcode('[gravityform id=4 title=true description=false]'); ?>
					        	
					        	</div>
					    	</div>								
							
					
								    
					</div>
									
				</div>
			
			</div>
		
			
	
			<?php include('include-content-before.php'); ?>
			
			<?php } else { ?>
				<div class="frame-main clearfix">
					<div class="row">
					<?php if(!empty($content_area)) { ?>	
						
			    		<div class="col col-md-12 content-container no-gutter">
				        	<div class="col-md-12 frame-content">
				            	<?php echo $content_area ?>
				        	</div>
				    
			    		</div>
			    	<?php } ?>
					
				</div>
			</div>
				<?php include('include-content-before.php'); ?>
			<?php } ?>

		

	</div><!-- main-content-container -->
	

<?php get_footer(); ?>