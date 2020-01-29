<?php
/*
Template Name: Staff Overview Layout
*/

$offset =  get_field('offset_content');
?>

<?php get_header(); ?>


		<div class="main-content-wrap clearfix">	
			<div class="frame-main frame-row clearfix">
				



<!--
			<div id="filters" style="visibility: hidden;"> 
			  <a class="btn round white is-checked" data-filter=".staff">Attorney</a>
			  <a class="btn round white" data-filter=".attorney">Staff</a>
			</div>
-->

			




			<div class="row featured-staff  clearfix">
				<?php 
					$args = array(
					    'post_type' => 'attorney',
					    'posts_per_page' => -1,
					    'orderby' => 'menu_order',
					    'order' => 'DESC'
					);
	
					$the_pages = new WP_Query( $args );
					if( $the_pages->have_posts() ){
					    // set variables here, outside loop, if needed
					    $i = 0;  
					    while( $the_pages->have_posts() ){
	
					            // iterate to next post
					            $the_pages->the_post();
	
					            $staff_id = $the_pages->post->ID;
					            $staff_url = get_permalink($the_pages->ID);

					          	$staff_name = get_the_title();
					            $staff_photo = get_field('staff_photo',$the_pages->ID);
					            $staff_title = get_field('staff_title',$the_pages->ID);
					            $staff_featured = get_field('staff_featured',$the_pages->ID);
					            $staff_email = get_field('staff_email',$the_pages->ID);
					            $staff_phone = get_field('staff_phone',$the_pages->ID);
					            $staff_fax = get_field('staff_fax',$the_pages->ID);	
					            $staff_mobile_phone = get_field('staff_mobile_phone',$the_pages->ID); 
					            $staff_content = get_field('staff_content',$the_pages->ID);
					            
					            $i++ 
					            
					            
					            ?>
					            
					           
						            
								
					            <?php if (($staff_featured)) { ?> 
					            <div class="col-<?php echo $i; ?> clearfix">	
						            <div class="staff-container staff attorney">
						            	<div class="staff-img-container" style="background-image: url(<?php echo $staff_photo; ?>);">
	
											<a href="<?php echo $staff_url; ?>" class="overlay mobile">
												<div class="inner-wrap">
													<span class="staff-name"><?php echo $staff_name; ?></span>
													
													<div class="staff-contact-wrap">
														<?php if(!empty($staff_email)) { ?>
															<div class="email-container">
																<i class="icn icn-email"></i>
																<div class="staff-email">
																	<span><?php echo $staff_email; ?></span>
																</div>
															</div>
														<?php } ?>	
																
														<?php if(!empty($staff_phone)) { ?>
															<div class="phone-container">
																<i class="icn icn-phone"></i>
																<div class="staff-phone">
																	<span><?php echo $staff_phone; ?></span>
																</div>
															</div>
														<?php } ?>	
													</div>
	
								            	</div>
						            		</a>
	
						            	</div>
						            	
						            	<div class="staff-info-container col-md-12">
											<div class="staff-name-container">
												<span><?php echo $staff_name ?></span>
											</div>
											
											<div class="staff-title-container">
												<span><?php echo $staff_title; ?></span>
											</div>
											
											<?php echo do_shortcode("[btn kind='arrow right' style='font-size: 14px; font-weight: 600;' color='blue'  link='$staff_url']Read Bio[/btn]"); ?>
	
										</div>	
														            	
						            </div>
								</div>
						            
						         <?php }  ?>	
						            
						            
					 
    
    
					            

					   <?php }
					}
				
				 ?>



			

					            
					            
			</div>		
			
				
			<div class="row all-staff grid clearfix">
				<?php 
					$args = array(
					    'post_type' => 'attorney',
					    'posts_per_page' => -1,
					    'orderby' => 'menu_order',
					    'order' => 'ASC'
					);
	
					$the_pages = new WP_Query( $args );
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
					            $staff_featured = get_field('staff_featured',$the_pages->ID);
					            $staff_email = get_field('staff_email',$the_pages->ID);
					            $staff_phone = get_field('staff_phone',$the_pages->ID);
					            $staff_fax = get_field('staff_fax',$the_pages->ID);	
					            $staff_mobile_phone = get_field('staff_mobile_phone',$the_pages->ID); 
					            $staff_content = get_field('staff_content',$the_pages->ID);
					            
					            
					            
					            ?>
					            
					           
						    <?php if (!($staff_featured)) { ?>         
					            
					            <div class="staff-container staff col-xs-6 col-sm-6  col-md-6  clearfix">
					            	<div class="staff-img-container" style="background-image: url(<?php echo $staff_photo; ?>);">

										<a href="<?php echo $staff_url; ?>" class="overlay mobile">
											<div class="inner-wrap">
												<span class="staff-name"><?php echo $staff_name; ?></span>
												
												<div class="staff-contact-wrap">
													<?php if(!empty($staff_email)) { ?>
														<div class="email-container">
															<i class="icn icn-email"></i>
															<div class="staff-email">
																<span><?php echo $staff_email; ?></span>
															</div>
														</div>
													<?php } ?>	
															
													<?php if(!empty($staff_phone)) { ?>
														<div class="phone-container">
															<i class="icn icn-phone"></i>
															<div class="staff-phone">
																<span><?php echo $staff_phone; ?></span>
															</div>
														</div>
													<?php } ?>	
												</div>

							            	</div>
					            		</a>

					            	</div><!-- staff-img-container -->
					            	
					            	<div class="staff-info-container col-md-12">
										<div class="staff-name-container">
											<span><?php echo $staff_name ?></span>
										</div>
										
										<div class="staff-title-container">
											<span><?php echo $staff_title; ?></span>
										</div>
										
										<?php if(!empty($staff_content)) { ?>	
											<?php echo do_shortcode("[btn kind='arrow right' style='font-size: 14px; font-weight: 600;' color='blue'  link='$staff_url']Read Bio[/btn]"); ?>
										<?php } ?>
										
									</div>	
		            	
					            </div><!-- staff-container -->
					        
					        <?php } ?>
						            
						            
					 
    
    
					            

					   <?php }
					}
				
				 ?>
				 
				 

				<?php 
					$args = array(
					    'post_type' => 'staff',
					    'posts_per_page' => -1,
					    'orderby' => 'menu_order',
					    'order' => 'ASC'
					);
	
					$the_pages = new WP_Query( $args );
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
					            $staff_featured = get_field('staff_featured',$the_pages->ID);
					            $staff_email = get_field('staff_email',$the_pages->ID);
					            $staff_phone = get_field('staff_phone',$the_pages->ID);
					            $staff_fax = get_field('staff_fax',$the_pages->ID);	
					            $staff_mobile_phone = get_field('staff_mobile_phone',$the_pages->ID); 
					            $staff_content = get_field('staff_content',$the_pages->ID);
					            
					            ?>
					            
					            <div class="staff-container staff-member  attorney">
					            	<div class="staff-img-container" style="background-image: url(<?php echo $staff_photo; ?>);">
									
									
										<?php if(!empty($staff_content)) { ?>
										
											<a href="<?php echo $staff_url; ?>" class="overlay mobile ">
												<div class="inner-wrap">
													<span class="staff-name"><?php echo $staff_name; ?></span>
													
													<div class="staff-contact-wrap">
														<?php if(!empty($staff_email)) { ?>
															<div class="email-container">
																<i class="icn icn-email"></i>
																<div class="staff-email">
																	<span><?php echo $staff_email; ?></span>
																</div>
															</div>
														<?php } ?>	
																
														<?php if(!empty($staff_phone)) { ?>
															<div class="phone-container">
																<i class="icn icn-phone"></i>
																<div class="staff-phone">
																	<span><?php echo $staff_phone; ?></span>
																</div>
															</div>
														<?php } ?>	
													</div>
	
												</div>
						        			</a>
										
										<?php } else { ?>
									
										<div class="overlay no-bio">
											<div class="inner-wrap">
												<span class="staff-name"><?php echo $staff_name; ?></span>
												
												<div class="staff-contact-wrap">
													<?php if(!empty($staff_email)) { ?>
														<div class="email-container">
															<i class="icn icn-email"></i>
															<div class="staff-email">
																<span><?php echo $staff_email; ?></span>
															</div>
														</div>
													<?php } ?>	
															
													<?php if(!empty($staff_phone)) { ?>
														<div class="phone-container">
															<i class="icn icn-phone"></i>
															<div class="staff-phone">
																<span><?php echo $staff_phone; ?></span>
															</div>
														</div>
													<?php } ?>	
												</div>

											</div>
					        			</div>

									
										<?php } ?>	
									


					        		</div><!-- staff-img-container -->
					            	
					            	<div class="staff-info-container col-md-12">
										<div class="staff-name-container">
											<span><?php echo $staff_name ?></span>
										</div>
										
										<div class="staff-title-container">
											<span><?php echo $staff_title; ?></span>
										</div>
										
										<?php if(!empty($staff_content)) { ?>	
											<?php echo do_shortcode("[btn kind='arrow right' style='font-size: 14px; font-weight: 600;' color='blue'  link='$staff_url']Read Bio[/btn]"); ?>
										<?php } ?>	
										
									</div>	
		            	
					            </div><!-- staff-container -->
					   <?php }
					}
					
				 ?>

			
					 
				 

			
				</div><!-- row -->




			</div><!-- frame -->

	</div><!-- main-content-wrap -->


</div><!-- main-content-container -->


		
	

<?php get_footer(); ?>