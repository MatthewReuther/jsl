<?php 
		global $post; $parent_id = $post->post_parent;
		$sidebar =  get_field('display_sidebar');
		$offset =  get_field('offset_content');
		$content_area =  get_field('main_content_area');
		$background_image =  get_field('main_content_bg_img');
		$phone_number =  get_field( 'phone_number', 'options' );

?>
<?php get_header(); ?>


			
			<?php if($sidebar) { ?>
			<div class="main-content-wrap">	
				<div class="frame-main clearfix">	
						
					<div class="row">
						
						<?php if( is_page( array( 'contact-us') )){ ?>

				    		<div class="col content-container no-gutter col-md-5">
					        	<div class="col-md-12 frame-content">
						        							        
					            	<?php echo $content_area ?>
					            	
					            	<div class="free-cta-btn-container">
						            	<span>Free Consultations 24/7</span>
					            		<a class="btn primary blue " style="font-weight: 600;" href="tel:<?php echo $phone_number ?>">Call Now</a>
					            	</div>
					        	</div>
				    		</div>
				    	
							<div class="col-md-7 sidebar-container">
					        	<div class="col-md-12 col box-shadow">
								
									<?php echo do_shortcode('[cta_form kind="two-column" title=false descritpion=false]'); ?>
					        	
					        	</div>
					    	</div>
					    	
					    									
						<?php } elseif ( is_page( array( 'portal') )) { ?>

				    		<div class="col content-container no-gutter col-md-8" id="portalDescription">
					        	<div class="col-md-12 frame-content clearfix">
						        							        
					            	<?php echo $content_area ?>
									<?php include('include-content-main.php'); ?>
					        	</div>
				    		</div>
				    	
							<div class="col-md-4 sidebar-container iFrameLogin">
					        	<div class="col-md-12 col box-shadow" id="portalContent">
									
										<iframe id="iFramePortal" src="//portal.pip-app.com/loginclient.asp" frameborder="no" style="border:0px; width:100%; height:230px"></iframe>
														        	
					        	</div>
					    	</div>						
							
						<?php } else { ?>
							
				    		<div class="col content-container no-gutter col-md-8">
					        	<div class="col-md-12 frame-content clearfix">
						        							        
					            	<?php echo $content_area ?>
									<?php include('include-content-main.php'); ?>
					        	</div>
				    		</div>
				    	
							<div class="col-md-4 sidebar-container">
					        	<div class="col-md-12 col box-shadow">
								
									<?php echo do_shortcode('[cta_form kind="single-column" title=false descritpion=false]'); ?>
					        	
					        	</div>
					    	</div>								
							
						<?php } ?>
								    
					</div><!-- row -->
									
				</div><!-- frame -->
			
			</div><!-- main-content-wrap -->
		
			<?php include('include-content-before.php'); ?>
			
		</div><!-- main-content-container -->	
			
		
			
		<?php } else if ( !empty($content_area) ) {  ?>
		
		
			<div class="main-content-wrap">	
				<div class="frame-main clearfix">	
					<div class="col content-container no-gutter col-md-12">
						<div class="col-md-12 frame-content clearfix">					    							        
					    	<?php echo $content_area ?>
							<?php include('include-content-main.php'); ?>
							
						</div>
					</div>
				</div>
			</div>
		
		</div><!-- main-content-container -->
		
		
				
		
		<?php } else { ?>
		
		<?php include('include-content-before.php'); ?>
		
		
		<?php } ?>




	

<?php get_footer(); ?>