
	
	<?php if( $column_one_slider == 'case-results-slider') { ?>

				
						<div id="wheel-data-container" style="display: none;">
						<div id="wheel-case-results"></div>
						</div>
			
			
			        <!-- Main Content -->

			            <!-- left-->
			                          
			                <!-- Wheel -->
			                <div id="wheel-div">
			                    <!-- Wheel -->
			                    <section id="wheel" data-study-wheel="case-results">
			                        <div id="caseResultsMenu" data-wheelnav data-wheelnav-navangle="0" data-wheelnav-slicepath="Pieslice" data-wheelnav-navangle="1" data-wheelnav-colors="" data-wheelnav-init>
			                            
										<?php  
											$args = array(
											'post_type' => 'case_result',
											'posts_per_page' => 12,
											'meta_key'	=> 'case_total',
						    				'orderby'	=> 'meta_value_num'
											
										
											);
											
											
									
											$case_result = get_posts( $args );
										
										?>
										
										<?php
											foreach ( $case_result as $post ) : setup_postdata( $post );
// 												$case_amount = get_field('case_amount',$the_pages->ID);
												$case_total = nice_number(get_field('case_total',$the_pages->ID));
										        $case_description = get_field('case_description', $the_pages->ID);
								
										
										?>
											
											<div data-wheelnav-navitemimg="https://sklaw.com/wp-content/themes/skl/img/icons/icon_scale.svg" onclick="swapProgramData();"></div>
				
											<div class="wheel-data">
											    	
											    	<div data-info="result-amount">$<?php echo $case_total; ?></div>
											    	<div data-info="result-title"><?php echo the_title(); ?></div>
												
													
													

											</div>
											
										<?php endforeach;?>			
										
			                        </div><!-- CASE RESULT-->
			                        
			                    </section>
										                    
			                    
			                    
			   
			                    
			            	</div><!-- Wheel Div -->		                
		                
		              
                        

                      
                            	
                                <div class="results-info-wrap" data-panel-index="1" class="tab-content tab-content-1 active">
	                                <div class="inner-wrap">    
	                                      
	                                    <div class="result-amount-container">
		                                    <span></span>
	                                    </div>
	                                        
	                                   		                                   
                                        <div class="result-tite-container">
                                            <span></span>
                                        </div>
	                                       
	                                        
	                                    <?php echo do_shortcode("[btn kind='arrow right' color='light blue' link='/case-results/']Learn More[/btn]"); ?>	                                        
	                                
	                                    
	                            	</div>
                            	
                            	</div>

                        	                       

				

		                <!-- Navigation of wheel -->
		                <div id="wheel-nav">
			                
			             	<div class="previous nav-control" data-arrow-nav="previous">
						 		<img src="<?php bloginfo('template_directory');?>/img/icons/icon_mobile_arrow_left.svg" alt="Spin Whell Left">
		                        
		                    </div>
		
		                    <!-- next btn -->
		                    <div class="next nav-control" data-arrow-nav="next">
		                        <img src="<?php bloginfo('template_directory');?>/img/icons/icon_mobile_arrow_right.svg" alt="Spin Wheel Right">
		                    </div>
		
		                    <!-- previous btn -->

		
		
		
		                </div><!-- Navigation of wheel -->					
							
				
						<div class="slider-container case-mobile-slider clearfix">
													
				<!-- 		<div class="slide block-wave" style="background-image: url(<?php echo $slide_image[url]; ?>); min-height: 645px; background-size: 100%; background-position: 100%; background-repeat: no-repeat;"> -->
									
									<div class="post-slides frame-<?php echo $column_two_frame_align; ?> <?php echo $column_two_frame_width; ?>">
										
										
										<!-- 	// Define our WP Query Parameters -->
											<?php $the_query = new WP_Query( array( 'post_type' => 'case_result', 'posts_per_page' => 12 ) ); ?>
				
											 
										<!-- 	// Start our WP Query -->
											<?php while ($the_query -> have_posts()) : $the_query -> the_post(); 
												$case_amount = get_field('case_amount',$the_pages->ID);
												$case_description = get_field('case_description', $the_pages->ID);
											?>
											
											
											<div class="slide">
												<div class="inner-wrap">
												
												<div class="slide-img">
							                        <img src="<?php bloginfo('template_directory');?>/img/icons/icon_scale.svg" alt="Spin Wheel Right">
							                    </div>
							                    
							                    
							                    <div class="slide-content">
								                	<span class="amount"><?php echo $case_amount;?></span>
								                	<span class="title"><?php echo the_title();?></span>
													<?php echo do_shortcode("[btn kind='arrow right' color='light blue' link='/case-results/']Learn More[/btn]"); ?>	                             
							                    </div>
							                    
							                    
							                    
							                    
							                                         
								
													
		
											    </div><!-- .inner-content -->
									    	</div><!-- .slide -->
											<?php 
												
											endwhile;
											
											wp_reset_postdata();
											?>
											
									      
									     
										
										
									</div><!-- .slides -->
												
						
							<div class="slider-case-result-nav"></div>	
						
							
						</div><!-- .slideshow-container -->

  	
			<?php } ?>
	
	
	
	
	<?php if((empty($column_one_slider)) && ($column_two_slider === 'testimonial-slider') ) { ?>
				


					
		
				
						<div class="slider-container testimonial-slider-container clearfix">
													
				<!-- 		<div class="slide block-wave" style="background-image: url(<?php echo $slide_image[url]; ?>); min-height: 645px; background-size: 100%; background-position: 100%; background-repeat: no-repeat;"> -->
									
									<div class="post-slides frame-<?php echo $column_two_frame_align; ?> <?php echo $column_two_frame_width; ?>">
										
										
										<!-- 	// Define our WP Query Parameters -->
											<?php $the_query = new WP_Query( array( 'post_type' => 'testimonial', 'posts_per_page' => 8 ) ); ?>
				
											 
										<!-- 	// Start our WP Query -->
											<?php while ($the_query -> have_posts()) : $the_query -> the_post(); 
												$testimonial_author = get_field('testimonial_author',$the_pages->ID);
									            $testimonial_reference = get_field('testimonial_attorney_amount',$the_pages->ID);
									            $testimonial_content = get_field('testimonial_content',$the_pages->ID);
											?>
											
											
											<div class="slide">
												<div class="inner-wrap">
													<img src="<?php bloginfo('template_directory');?>/img/icons/icon_testimonial_quote.svg" >
												
													<div class="content-container">
														<?php echo $testimonial_content; ?>
															<?php if(!empty($testimonial_author )) { ?>
						
														
															<p>– <?php echo $testimonial_author; ?></p>
														
													
															<?php } ?>	
																	
															<?php if(!empty($testimonial_reference)) { ?>
						
																<p><em><?php echo $testimonial_reference; ?></em></p>
					
															<?php } ?>
													</div>	
													
		
											    </div><!-- .inner-content -->
									    	</div><!-- .slide -->
											<?php 
												
											endwhile;
											
											wp_reset_postdata();
											?>
											
									      
									     
										
										
									</div><!-- .slides -->
												
						
								
						
							
						</div><!-- .slideshow-container -->
				
					

				   
				    

	
  	
			<?php } ?>
			

