<?php 
		$global_blocks =  get_sub_field('global_blocks');
		$blog_url = get_permalink( get_option( 'page_for_posts' ) );

		// FEATURED CONTENT BLOCK APPEARANCE VARS
		$fcb = get_sub_field('fcb_appearance_fields');
		// Desktop Vars
		$fcb_header_fc = $fcb['header_font_color'];
		$fcb_body_fc = $fcb['body_font_color'];
		$fcb_bg_img = $fcb['background_image'];
		$fcb_bg_color = $fcb['background_color'];
		$fcb_frame_align = $fcb['frame_alignment'];
		$fcb_frame_width = $fcb['frame_width'];
		$fcb_text_alignment = $fcb['text_alignment'];
		
		// Tablet Vars
		$fcb_bg_img_tab = $fcb['background_image_tablet'];
		$fcb_bg_color_tab = $fcb['background_color_tablet'];
		$fcb_frame_width_tab = $fcb['frame_width_tablet'];
		
		
		// Mobile Vars
		$fcb_bg_img_mob = $fcb['background_image_mobile'];
		$fcb_bg_color_mob = $fcb['background_color_mobile'];
		$fcb_frame_width_mob = $fcb['frame_width_mobile'];
		$frame_vert_center = $fcb['frame_vert_center'];
		
		$vzaar_id =  get_field('vzaar_id');
	
		
?>
<?php if( $global_blocks == 'recent-posts') { ?>
<!-- 	<section id="recent-posts" class="block block__white  block--align__left clearfix"> -->
		<div class="frame__none frame-main">
			<div class="main-inner-wrap <?php if($frame_vert_center) { ?> vertically-centered <?php } ?> clearfix">
				<div class="row header-wrap">
					<div class="col col-md-12 no-gutter title-container" style="text-align: center;">
						<h2 style="color: <?php echo $fcb_header_fc ?> !important; text-align: center;">Legal News and Blog</h2>
						<hr class="color-divider" style="background-color: #00DA73">
						<?php echo do_shortcode("[btn kind='arrow right' style='font-weight: bold;' color='blue' link='$blog_url']View All Articles[/btn]"); ?>
					</div>
				</div>
			<!-- header-wrap -->
				<div class="row col col-md-12 clearfix all-posts recent-posts-container">
					<!-- 	// Define our WP Query Parameters -->
					<?php $the_query = new WP_Query( 'posts_per_page=4' ); ?>
					<?php $i = 0;  ?>
					<!-- 	// Start our WP Query -->
					<?php while ($the_query -> have_posts()) : $the_query -> the_post(); 
									$featured_image = wp_get_attachment_image_src( get_post_thumbnail_id($post->ID), 'large');
									$post_url = get_permalink();
									
								?>
					<?php $i++ ?>
					
					<div class="col col-xs-12 col-sm-6 col-md-6 col-lg-3 recent-container clearfix">
						<div class="inner-wrap clearfix" >
							<div class="img-container ">
								
								<div class="media-wrapper">
									<div class="overlay"></div>
									<img src="
										<?php echo $featured_image[0]; ?>" alt="<?php the_title(); ?>" class="og-image">
										<div class="img" style="background-image: url(
											<?php echo $featured_image[0]; ?>);">
											<img class="spacer" src="
												<?php bloginfo('template_directory');?>/img/pixel-16x9.png" alt="Pixel"/>
											</div>
										</div>
									</div>
									
									<div class="post-title clearfix">
										<?php the_title(); ?>
									</div>
									<?php echo do_shortcode("[btn kind='arrow right' style='font-weight: 600;'  color='blue'  link='$post_url']Read More[/btn]"); ?>
								</div>
								<!-- inner-wrap -->
							</div>
							<!-- recent-container -->
							<?php 
									
										endwhile;
								
										wp_reset_postdata();
									?>
							
						</div>
						<!-- row -->
					</div>
				<!-- /.main-inner-wrap -->
			</div>
			<!-- /.frame -->
<!-- 		</section> -->
		<?php } ?>



		
		
		<?php if( $global_blocks == 'locations') { ?>
<!-- 		<section id="firm-locations" class="block block__white  block--align__left clearfix"> -->
			<div class="frame__none frame-main ">
				<div class="main-inner-wrap <?php if($frame_vert_center) { ?> vertically-centered <?php } ?> clearfix">
					<div class="row header-wrap">
						<div class="title-container">
							<h2>Our Locations</h2>
						</div>
					</div>
					<?php if( have_rows('locations_repeater', 'option') ): ?>
					<div class="row all-locations clearfix">
						<?php $i = 0;  ?>
						<?php while( have_rows('locations_repeater', 'option') ): the_row(); 
									
									// vars
									$title = get_sub_field('location_title', 'option');
									$address_street = get_sub_field('location_address', 'option');
									$address_city_state = get_sub_field('location_city_state_zip', 'option');
									$directions = get_sub_field('location_directions', 'option');
									?>
						<?php $i++ ?>
						<div class="col col-md-3 location-container">
							<div class="inner-wrap">
								<div class="location-info">
									<span class="location-title">
										<?php echo $title; ?>
									</span>
									<span class="location-address">
										<?php echo $address_street; ?>
									</span>
									<span class="location-address">
										<?php echo $address_city_state; ?>
									</span>
								</div>
								<div class="location-directions">
									<?php echo do_shortcode("[btn kind='arrow right' style='font-size: 14px;' color='white' link='$directions' target='_blank']Get Directions[/btn]"); ?>
								</div>
							</div>
						</div>
						<?php endwhile; ?>
					</div>
					<?php endif; ?>
				</div>
				<!-- /.main-inner-wrap -->
			</div>
			<!-- /.frame -->
<!-- 		</section> -->
		<?php } ?>
		
		

		<?php if( $global_blocks == 'grid') { ?>
<!-- 		<section id="judd-shaw-way" class="block block__grid block__white  block--align__left clearfix"> -->
			<div class="frame__none frame-main ">
				<div class="main-inner-wrap clearfix">
					<div class="row header-wrap">
						<div class="col col-md-12 title-container ">
							<h2 style="color: <?php echo $fcb_header_fc ?> !important; text-align: center;">Judd Shaw Way</h2>
							<hr class="color-divider" style="background-color: #1E99D3; margin: 0 auto;">
						</div>
					</div>
					<?php if( have_rows('grid_repeater', 'option') ): ?>
						<?php 
							$i = 0; 
							$group = 0;
							$grid_item = 0;  
						?>
						
					
					<div class="row grid-items clearfix">
						
						<?php while( have_rows('grid_repeater', 'option') ): the_row(); 
									
									// vars
									$item_icn = get_sub_field('grid_item_icon', 'option');
									$item_title = get_sub_field('grid_item_title', 'option');
									$item_divider = get_sub_field('header_color_divider', 'option');
									$item_content = get_sub_field('grid_item_content', 'option');
									
									?>
						
						<?php if ($i % 3 == 0) {
					    	$group++;
					    	$grid_item++;
					    ?>
					        <div class="grid-row grid-row-<?php echo $group; ?> " >
					      
					    <?php } ?>
							<div class="col col-lg-4 col-md-12 col-sm-12 grid-item grid-item-<?php echo $grid_item++ ?>">
								<div class="col col-md-12 grid-item-container item-container-<?php echo $i ?>" style="color: <?php echo $fcb_body_fc ?> !important;">
									<div class="overlay"></div>
									<div class="inner-wrap">
										<div class="item-info">
											<div class="item-icon">
												<img src="<?php echo $item_icn['url']; ?>" alt="<?php echo $item_title; ?>"/>
											</div>
											<?php if(!empty($item_title)) { ?>
												<div class="item-title">
											
													<h3><?php echo $item_title; ?></h3>
													<hr class="color-divider" style="margin: 0; background-color: <?php echo $item_divider; ?>">
												
												</div>
												
											<?php } ?>	
											<div class="item-content">
												<?php echo $item_content ?>
											</div>
										</div>
										
									</div>
								</div>
							</div>
									
						<?php if ($i % 3 == 2) { ?>
							
						    </div><!-- .grid-row -->
						 <?php } ?> 
						 
						 <?php $i++; ?>
						

						<?php endwhile; ?>
					</div>
					<?php endif; ?>
				</div>
				<!-- /.main-inner-wrap -->
			</div>
			<!-- /.frame -->
<!-- 		</section> -->
		<?php } ?>
		
		
		
		
		<?php if( $global_blocks == 'case-results') { ?>
		<?php 
		$case_bg_img = get_field('option_case_bg_img', 'option');
	?>
<!-- 		<section id="case-results" class="block block-two-column   block--align__left clearfix" style="background-color: white"> -->
			
			<div class="frame__none frame-main ">
				<div class="main-inner-wrap clearfix">
					<div class="row <?php if($frame_vert_center) { ?> vertically-centered <?php } ?>">
						<div class=" col col-left clearfix col-md-6">
							<div class="col col-md-9 frame-left clearfix">
								<div class="inner-wrap clearfix" style="color: <?php echo $fcb_body_fc ?> !important;">
									
							
									<h2 class="title" style="color: <?php echo $fcb_header_fc ?> !important;">
										
										<?php the_field('option_case_title', 'option'); ?>
									</h2>
									<hr class="color-divider" style="background-color: #00DA73">
									<?php the_field('option_case_content', 'option'); ?>
								</div>
							</div>
						</div>
						<div class=" col col-right clearfix col-md-6">
							<div class="col col-md-12 clearfix">
								<div class="inner-wrap clearfix" style="color:#FFFFFF;">
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
													<div data-info="result-amount">$
														<?php echo $case_total; ?>
													</div>
													<div data-info="result-title">
														<?php echo the_title(); ?>
													</div>
												</div>
												<?php endforeach;?>
											</div>
											<!-- CASE RESULT-->
										</section>
									</div>
									<!-- Wheel Div -->
									<div class="results-info-wrap" data-panel-index="1" class="tab-content tab-content-1 active">
										<div class="inner-wrap">
											<div class="result-amount-container">
												<span></span>
											</div>
											<div class="result-tite-container">
												<span></span>
											</div>
											<!-- 	                                    <?php echo do_shortcode("[btn kind='arrow right' color='light blue' link='/case-results/']Learn More[/btn]"); ?>	 -->
											<!-- Navigation of wheel -->
											<div id="wheel-nav">
												<div class="previous nav-control" data-arrow-nav="previous">
													<img src="
														<?php bloginfo('template_directory');?>/img/icons/icon_mobile_arrow_left.svg" alt="Spin Whell Left">
													</div>
													<!-- next btn -->
													<div class="next nav-control" data-arrow-nav="next">
														<img src="
															<?php bloginfo('template_directory');?>/img/icons/icon_mobile_arrow_right.svg" alt="Spin Wheel Right">
														</div>
														<!-- previous btn -->
													</div>
													<!-- Navigation of wheel -->
												</div>
											</div>
											
											
											<div class="slider-container case-mobile-slider clearfix">
												<!-- 		<div class="slide block-wave" style="background-image: url(<?php echo $slide_image[url]; ?>); min-height: 645px; background-size: 100%; background-position: 100%; background-repeat: no-repeat;"> -->
												<div class="post-slides frame-
													<?php echo $column_two_frame_align; ?>
													<?php echo $column_two_frame_width; ?>">
													<!-- 	// Define our WP Query Parameters -->
													<?php $the_query = new WP_Query( array( 
														'post_type' => 'case_result', 
														'posts_per_page' => 12,
														
														'meta_key'	=> 'case_total',
									    				'orderby'	=> 'meta_value_num'
									    				
									    				
														
														 ) ); ?>
													<!-- 	// Start our WP Query -->
													<?php while ($the_query -> have_posts()) : $the_query -> the_post(); 
												$case_total = nice_number(get_field('case_total',$the_pages->ID));
												$case_description = get_field('case_description', $the_pages->ID);
											?>
													<div class="slide">
														<div class="inner-wrap">
															<div class="slide-img">
																<img src="
																	<?php bloginfo('template_directory');?>/img/icons/icon_scale.svg" alt="Spin Wheel Right">
																</div>
																<div class="slide-content">
																	<span class="result-amount">
																		$<?php echo $case_total; ?>
																	</span>
																	<span class="result-title">
																		<?php echo the_title();?>
																	</span>
																	
																</div>
															</div>
															<!-- .inner-content -->
														</div>
														<!-- .slide -->
														<?php 
												
											endwhile;
											
											wp_reset_postdata();
											?>
													</div>
													<!-- .slides -->
													<div class="slider-nav slider-case-result-nav "></div>
												</div>
												<!-- .slideshow-container -->
											</div>
										</div>
									</div>
								</div>
							</div>
							<!-- /.main-inner-wrap -->
						</div>
						<!-- /.frame -->
<!-- 					</section> -->
					<?php } ?>
					
					
					<?php if( $global_blocks == 'testimonials') { ?>
					
						<?php 
							$testimonial_icon = get_field('option_testimonial_icon', 'option');
							$testimonial_title = get_field('option_testimonial_title', 'option');
							$testimonial_block_content = get_field('option_testimonial_content', 'option');
							$testimonial_bg_img = get_field('option_testimonial_bg_img', 'option');
							$testimonial_bg_color = get_field('option_testimonial_bg_color', 'option');
						?>
					
<!-- 					<section id="testimonial-slider" class="block block-one-column   block--align__left clearfix" style="background-color: <?php echo $testimonial_bg_color ?>"> -->
						<div class="frame-main frame-<?php echo $fcb_frame_align ?> clearfix">
							<div class="main-inner-wrap <?php if($frame_vert_center) { ?> vertically-centered <?php } ?> clearfix col-md-<?php echo $fcb_frame_width ?> text-<?php echo $fcb_text_alignment; ?> ">
								<div class="row">
									
										<div class="col col-md-12 frame-center clearfix">
											<div class="inner-wrap clearfix" style="color:#fff;">
												<img src="<?php echo $testimonial_icon['url']; ?>" alt="Testimonial Stars"/>
												
												
												
												<h2 class="title"  style="text-align: center; color:#fff;"><?php echo $testimonial_title; ?></h2>
												
												<hr class="color-divider" style="background-color: #FF763F; margin: 0 auto;">
												
												<div class="slider-container col col-lg-8 col-md-7 col-sm-12 testimonial-slider-container clearfix">

													<div class=" post-slides frame-
														<?php echo $column_two_frame_align; ?>
														<?php echo $column_two_frame_width; ?>">
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
																
																	<div class="content-container">
																		<?php echo $testimonial_content; ?>
																		<?php if(!empty($testimonial_author )) { ?>
																		<p>– 
																			<?php echo $testimonial_author; ?>
																		</p>
																		<?php } ?>
																		<?php if(!empty($testimonial_reference)) { ?>
																		<p>
																			<em>
																				<?php echo $testimonial_reference; ?>
																			</em>
																		</p>
																		<?php } ?>
																	</div>
																</div>
																<!-- .inner-content -->
															</div>
															<!-- .slide -->
															<?php 
																		
																	endwhile;
																	
																	wp_reset_postdata();
																	?>
														</div>
														
														<!-- .slides -->
													</div>
													
													<!-- .slideshow-container -->
												</div>
												
											</div>
										</div>
										<div class="slider-testimonial-nav slider-nav"></div>
									
										<?php echo $testimonial_block_content; ?>
									
									
									

									<!-- row -->
								</div>
								<!-- /.inner-content -->
							</div>
<!-- 						</section> -->
						<?php } ?>
						

					<?php if( $global_blocks == 'video_testimonials') { ?>
					
						<?php 
							$testimonial_icon = get_field('option_testimonial_icon', 'option');
							$testimonial_title = get_field('option_testimonial_title', 'option');
							$testimonial_block_content = get_field('option_testimonial_content', 'option');
							$testimonial_bg_img = get_field('option_testimonial_bg_img', 'option');
							$testimonial_bg_color = get_field('option_testimonial_bg_color', 'option');
						?>
					
<!-- 					<section id="testimonial-slider" class="block block-one-column   block--align__left clearfix" style="background-color: <?php echo $testimonial_bg_color ?>"> -->
						<div class="frame-main frame-<?php echo $fcb_frame_align ?> clearfix">
							<div class="main-inner-wrap <?php if($frame_vert_center) { ?> vertically-centered <?php } ?> clearfix col-md-<?php echo $fcb_frame_width ?> text-<?php echo $fcb_text_alignment; ?> ">
								<div class="row">
									
										<div class="col col-md-12 frame-center clearfix">
											<div class="inner-wrap clearfix" style="color:#fff;">
												
												
												
												<div class="slider-container col col-lg-8 col-md-7 col-sm-12 testimonial-slider-container video-slider clearfix">

													<div class=" post-slides frame-
														<?php echo $column_two_frame_align; ?>
														<?php echo $column_two_frame_width; ?>">
														<!-- 	// Define our WP Query Parameters -->
														<?php $the_query = new WP_Query( array( 'post_type' => 'video_testimonial', 'posts_per_page' => 8 ) ); ?>
														<!-- 	// Start our WP Query -->
														<?php while ($the_query -> have_posts()) : $the_query -> the_post(); 
																		$testimonial_author = get_field('testimonial_author',$the_pages->ID);
															            $testimonial_reference = get_field('testimonial_attorney_amount',$the_pages->ID);
															            $testimonial_content = get_field('testimonial_content',$the_pages->ID);
															            $testimonial_name = get_the_title();
															            
															            $vzaar_id =  get_field('vzaar_id');
																	?>
														<div class="slide">
															<div class="inner-wrap">
																
																
																<div class="content-container">
																	<div class="video-container">
																		<?php echo do_shortcode("[vzaar id='$vzaar_id']"); ?>
																	</div>
																	<div class="text-container">
																		<h3><?php echo $testimonial_name; ?></h3>
																		<hr class="color-divider" style="background-color: #1E99D3; margin: 0 auto;">
																		<?php echo $testimonial_content; ?>
																	</div>
																	
																</div>																
																
																	
							
																	
																	
																</div>
																<!-- .inner-content -->
															</div>
															
														
															<!-- .slide -->
															<?php 
																		
																	endwhile;
																	
																	wp_reset_postdata();
																	?>
														</div>
														
														<!-- .slides -->
													</div>
													
													<!-- .slideshow-container -->
												</div>
												
											</div>
										</div>
										<div class="slider-testimonial-nav slider-nav"></div>
										
										
									
									
									

									<!-- row -->
								</div>
								<!-- /.inner-content -->
							</div>
<!-- 						</section> -->
						<?php } ?>
						
						

							
		<?php if( $global_blocks == 'all-testimonials') { ?>
		<div class="frame-main clearfix">

					<div class=" no-gutter title-container testimonial" style="text-align: center;">
						<h2 style="color: <?php echo $fcb_header_fc ?> !important; text-align: center;">Client Testimonials</h2>
						<hr class="color-divider" style="background-color: #00DA73">
					</div>
			
	
			
				<div class="row all-posts grid clearfix">
					
							
					
					<?php
						$paged = (get_query_var('paged')) ? get_query_var('paged') : 1; 

						$args = array(
						    'post_type' => 'testimonial',
						    'posts_per_page' => 9,
						    
							'meta_query' => array(
								'relation' => 'OR',
								array(
							     'key' => 'testimonial_amount',
							     'compare' => 'NOT EXISTS', // doesn't work
							     'value' => '' // This is ignored, but is necessary...
							    ),
							    array(
							     'key' => 'testimonial_amount'
							    
							    )
							    
							),

						    'orderby'	=> 'meta_value_num',
						    'order' => 'DESC',
						    'paged' => $paged
						    
						);

						$the_pages = new WP_Query( $args );
						if( $the_pages->have_posts() ){
						    // set variables here, outside loop, if needed
						    
						    while( $the_pages->have_posts() ){
		
						            // iterate to next post
						            $the_pages->the_post();
						            $staff_id = $the_pages->post->ID;
						            $testimonial_author = get_field('testimonial_author',$the_pages->ID);
						            $testimonial_reference = get_field('testimonial_attorney_amount',$the_pages->ID);
						            $testimonial_content = get_field('testimonial_content',$the_pages->ID);
						            $testimonial_amount = number_format(get_field('testimonial_amount',$the_pages->ID), 2, '.', ',');
						            $testimonial_attribution = get_field('testimonial_attribution',$the_pages->ID);
						            $testimonial_quote = get_field('testimonial_quote_color',$the_pages->ID);
						            
						            
						            
						            ?>
	

									<div class="col col-xs-12 col-sm-6 col-md-4 col-lg-4 grid-item" data-url="<?php the_permalink(); ?>">
				
													            
							            <div class="col col-md-12 testimonial-container card-container">
				
											<div class="inner-wrap">
												<?php include(get_template_directory() . '/img/icons/testimonial-quote.svg'); ?>
													
												
												<div class="card-content">
													<?php echo $testimonial_content; ?>
												</div>
		
												<?php if(!empty($testimonial_author )) { ?>
					
													
														<p>– <?php echo $testimonial_author; ?></p>
													
												
												<?php } ?>	
													
												
												
												
												<?php if(!empty($testimonial_attribution)) { ?>
												
													<p><em><?php echo $testimonial_attribution; ?><?php if(!empty($testimonial_amount)) { ?> $<?php echo $testimonial_amount; ?><?php } ?>.</em></p>
													
		
												<?php } ?>
											
	
		
					            			</div>
					            			
							            </div>
						            	
						            	
														            	
						            </div>
						    <?php } ?>
						    <?php wp_reset_postdata(); ?>
						<?php } ?>
						
					
					</div><!-- row -->  
					<?php  include(get_template_directory() . '/pagination.php');?>	 
		</div>
					
								
				<?php } ?>
				
		<?php if( $global_blocks == 'form') { ?>
<!-- 						<section id="get-help" class="block block-one-column   block--align__left clearfix" style="background-color: "> -->
			<div class="frame__none frame-main">
				<div class="main-inner-wrap <?php if($frame_vert_center) { ?> vertically-centered <?php } ?> clearfix">
					<div class="row">
						<div class=" col col-left clearfix col-md-12">
							<div class="col col-md-9 frame-center clearfix">
								<div class="inner-wrap clearfix" style="color:#33424A;">
									<?php echo do_shortcode('[cta_form title=false descritpion=false]'); ?>
								</div>
							</div>
						</div>
					</div>
					<!-- row -->
				</div>
				<!-- /.inner-content -->
<!-- 							</section> -->
			<?php } ?>

		<?php if( $global_blocks == 'testimonial-form') { ?>
<!-- 						<section id="get-help" class="block block-one-column   block--align__left clearfix" style="background-color: "> -->
			<div class="frame__none frame-main">
				<div class="main-inner-wrap <?php if($frame_vert_center) { ?> vertically-centered <?php } ?> clearfix">
					<div class="row">
						<div class=" col col-left clearfix col-md-12">
							<div class="col col-md-9 frame-center clearfix">
								<div class="inner-wrap clearfix" style="color:#33424A;">
									<?php echo do_shortcode('[testimonial_form title=false descritpion=false]'); ?>
								</div>
							</div>
						</div>
					</div>
					<!-- row -->
				</div>
				<!-- /.inner-content -->
<!-- 							</section> -->
			<?php } ?>