<?php 
	
	$staff_id = $the_pages->post->ID;
	$staff_url = get_permalink($the_pages->ID);
	$staff_name = get_the_title();
	$staff_photo = get_field('staff_photo',$the_pages->ID);
	$staff_title = get_field('staff_title',$the_pages->ID);
	$staff_email = get_field('staff_email',$the_pages->ID);
	$staff_phone = get_field('staff_phone',$the_pages->ID);
	$staff_fax = get_field('staff_fax',$the_pages->ID);	
	$staff_mobile_phone = get_field('staff_mobile_phone',$the_pages->ID); 
	$staff_content = get_field('staff_content');

?>
<?php get_header(); ?>
			<div class="main-content-wrap">	
				<div class="frame-main clearfix">
					
					<div class="row attorney-card card-container" id="attorney-card">
	<!-- 					 col-md-4 col-sm-4 col-md-3 col-lg-3 -->
				        	<div class="col-sm-5 col-md-4 col-lg-3 col col-left no-gutter staff-contact-container">
								<div class="staff-img-container" style="background-image: url(<?php echo $staff_photo; ?>);">
	        
						        </div>
	
							    <div class="staff-info-container">
									<div class="inner-wrap">
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
														<span class="phone"><?php echo $staff_phone; ?></span>
														
														<?php if(!empty($staff_fax)) { ?>
															<span class="fax">F:<?php echo $staff_fax; ?></span>
														<?php } ?>
													</div>
												</div>
																					
											<?php } ?>
											
											<?php if(!empty($staff_mobile_phone)) { ?>
												<div class="phone-container mobile">
													<i class="icn icn-phone mobile"></i>
													<div class="staff-phone">
														<span class="phone"><?php echo $staff_mobile_phone; ?></span>
														
													</div>
												</div>
											<?php } ?>	
											
										</div>
									</div>						
									
												
								</div>
								
								
							</div>					            
				    
				    
	
				        <div class="col col-sm-7  col-md-8 col-lg-9 col-right staff-bio-container no-gutter">
					        <div class="inner-wrap">
						        
					    		<div class="staff-title-container">
					    			<span class="sub-title">MEET OUR TEAM</span>
									<h2 class="name"><?php echo $staff_name ?></h2>
									<span class="staff-title"><?php echo $staff_title; ?></span>
								</div>
												
								<div class="staff-content-container">
								
									<div class="staff-bio">
										<p><?php echo $staff_content; ?><p>
									</div>
									
									<div class="staff-tabs-container">
										<?php if( have_rows('staff_profile_tabs') ): ?>
																			
										    <?php while( have_rows('staff_profile_tabs') ): the_row(); 
											    
												$attorney_tab_title = get_sub_field('staff_tab_title');
												$attorney_tab_content = get_sub_field('staff_tab_content');
												
											?>	
											<div class="staff-tab">											
												<h3><?php echo $attorney_tab_title; ?></h3>
												<?php echo $attorney_tab_content; ?>
											</div>
											<?php endwhile; ?>
						    
										<?php endif; ?>
									</div>
									
								</div>
					        </div>
					        
								
	
				        	</div>
				        
				    </div>
				</div><!-- frame -->
				
				<?php include('include-content-before.php'); ?>
	
		</div><!-- main-content-wrap -->
	

	</div><!-- main-content-container -->
		
	

	

<?php get_footer(); ?>


