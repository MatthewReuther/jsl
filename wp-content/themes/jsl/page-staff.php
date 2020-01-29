<?php
/*
Template Name: Staff Overview Layout
*/

$offset =  get_field('offset_content');
?>

<?php get_header(); ?>


		<div class="main-content-wrap  clearfix">	
			<div class="frame-staff clearfix">
				
			
				
			<div class="row all-staff  clearfix">
				
				<?php 

					$args = array(
					    'post_type' => 'attorney',
					    'posts_per_page' => -1,
					    'orderby' => 'menu_order',
					    'order' => 'ASC'
					);
					
					$the_pages = new WP_Query( $args );
					$postnum = 0; // Set counter to 0 outside the loop
					if( $the_pages->have_posts() ){
					    // set variables here, outside loop, if needed
					    
					    while( $the_pages->have_posts() ){
	
					            // iterate to next post
					            $the_pages->the_post();
	
					            $staff_id = $the_pages->post->ID;
					            $staff_url = get_permalink($the_pages->ID);

					            $staff_name = get_the_title();
					            $staff_photo = get_field('staff_photo',$the_pages->ID);
					            $staff_title = get_field('staff_title',$the_pages->ID);
					            $staff_type = get_field('staff_type',$the_pages->ID);
					            $staff_featured = get_field('staff_featured',$the_pages->ID);
					            $staff_email = get_field('staff_email',$the_pages->ID);
					            $staff_phone = get_field('staff_phone',$the_pages->ID);
					            $staff_fax = get_field('staff_fax',$the_pages->ID);	
					            $staff_mobile_phone = get_field('staff_mobile_phone',$the_pages->ID); 
					            $staff_content = get_field('staff_content',$the_pages->ID);
					            
					            
					            
					            ?>
					     

					           
						    <?php if (($staff_featured)) { ?>         
  
<!--
							<?php $postnum++; // Increment counter
								if ($postnum == 9){ ?>
								
								<div class="staff-container staff col col-lg-4 col-md-4 col-sm-6 col-xs-6 clearfix">
			 						<div class="staff-img-container" style="border: 4px solid transparent;">
					            	</div> 
					        	</div> 
								
							<?php } ?>
-->
							
							
					            
					            <div class="staff-container staff col col-lg-4 col-md-4 col-sm-6 col-xs-6 clearfix type-<?php echo $staff_type; ?>">
					            	<?php if(!empty($staff_content)) { ?>
						            	<a href="<?php echo $staff_url; ?>" class="staff-img-container" style="background-image: url(<?php echo $staff_photo; ?>);">
											<div class="overlay"></div>
											
												<div class="inner-wrap">
													<h2 class="staff-name"><?php echo $staff_name; ?></h2>
													
													
													
													<div class="staff-contact-wrap">
														<h3 class="staff-title"><em><?php echo $staff_title; ?></em></h3>
														<span href="<?php echo $staff_url; ?>" class="mobile">Read Bio ></span>
	
													</div>
	
								            	</div>
						            		
											
						            	</a><!-- staff-img-container -->
					            	<?php } else { ?>
					            	
						            	<div class="staff-img-container" style="background-image: url(<?php echo $staff_photo; ?>);">
											<div class="overlay"></div>
											
												<div class="inner-wrap">
													<h2 class="staff-name"><?php echo $staff_name; ?></h2>
													
													
													
													<div class="staff-contact-wrap">
														<h3 class="staff-title"><em><?php echo $staff_title; ?></em></h3>
														
													</div>
	
								            	</div>
						            		
											
						            	</div><!-- staff-img-container -->					            	
					            	
					            	<?php } ?>
		            	
					            </div><!-- staff-container -->
					           
								
					            
					        
					        <?php } ?>
						            
						            

					   <?php }
					}
				
				 ?>


							 

			
				</div><!-- row -->




			</div><!-- frame -->
			
			

	</div><!-- main-content-wrap -->





		
	

<?php get_footer(); ?>