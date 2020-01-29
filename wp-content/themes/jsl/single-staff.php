<?php 
	
	$staff_id = $the_pages->post->ID;
	$staff_url = get_permalink($the_pages->ID);
	$staff_name = get_the_title();
	$staff_photo = get_field('staff_photo',$the_pages->ID);
	$staff_title = get_field('staff_title',$the_pages->ID);
	$staff_email = get_field('staff_email',$the_pages->ID);
	$staff_phone = get_field('staff_phone',$the_pages->ID);
	$staff_fax = get_field('staff_fax',$the_pages->ID);
	$staff_quote = get_field('staff_quote',$the_pages->ID);
	$staff_quote_auth = get_field('staff_quote_auth',$the_pages->ID);
	$staff_mobile_phone = get_field('staff_mobile_phone',$the_pages->ID); 
	$staff_content = get_field('staff_content');

?>
<?php get_header(); ?>
<div class="main-content-container clearfix" <?php if (!$include_banner) { ?> style="padding-top: 120px;"<?php }?>>
			<div class="main-content-wrap" <?php if (!$include_banner) { ?> style=""<?php }?>>	
				<div class="frame-main clearfix">
					
					<div class="row attorney-card " id="attorney-card">
	<!-- 					 col-md-4 col-sm-4 col-md-3 col-lg-3 -->
			        	<div class="col col-lg-4 col-md-4 col-sm-5 col-xs-10 col-left img-container">
							<div class="media-wrapper">
							
								<img src="<?php echo $staff_photo; ?>" class="og-image" alt="<?php echo $staff_name ?>">
						
								<div class="img" style="background-image: url(<?php echo $staff_photo; ?>);">
									<img class="spacer" src="<?php bloginfo('template_directory');?>/img/pixel-16x9.png" alt="Pixel"/>
								</div>
							
							</div>				        	
				        	
						</div>					            				    
	
				        <div class="col col-lg-8 col-md-8 col-sm-7 col-xs-12 col-right staff-bio-container">
					        <div class="inner-wrap">
						        
						        <div class="staff-intro-container">
						    		<div class="staff-title-container">
										<h1 class="name"><?php echo $staff_name ?></h1>
										<span class="staff-title"><?php echo $staff_title; ?></span>
									</div>
									
									<?php if(!empty($staff_quote)) { ?>
										<div class="staff-quote-container">
											<span><div class="quote">"</div><?php echo $staff_quote ?><div class="quote">" <?php echo $staff_quote_auth; ?></div></span>
										</div>
									<?php } ?>
									
									<hr class="color-divider" style="background-color:#00DA73">	
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


				<section id="get-help" class="block block-one-column   block--align__left clearfix" style="background-color: #1e99d3;">
					<div class="frame__none frame-main">
						<div class="main-inner-wrap clearfix">
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
					</section>		

	</div><!-- main-content-container -->
		
	

	

<?php get_footer(); ?>


