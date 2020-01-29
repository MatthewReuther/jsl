<?php 

	// FEATURED CONTENT BLOCK APPEARANCE VARS
	$fcb = get_sub_field('fcb_appearance_fields');
	// Desktop Vars
	$fcb_header_fc = $fcb['header_font_color'];
	$fcb_body_fc = $fcb['body_font_color'];
	
	$fcb_frame_align = $fcb['frame_alignment'];
	$fcb_frame_width = $fcb['frame_width'];
	$fcb_text_alignment = $fcb['text_alignment'];
	
	// Tablet Vars
	$fcb_frame_width_tab = $fcb['frame_width_tablet'];
	
	
	// Mobile Vars
	$fcb_frame_width_mob = $fcb['frame_width_mobile'];
	$frame_vert_center = $fcb['frame_vert_center'];
?>
 
	<div class="frame__<?php echo $frame_position; ?> frame-main frame-block frame-<?php echo $fcb_frame_align ?>">	 	
		<div class="main-inner-wrap clearfix col-lg-<?php echo $fcb_frame_width; ?> col-md-<?php echo $fcb_frame_width_tab; ?> col-sm-<?php echo $fcb_frame_width_mob; ?>   text-<?php echo $banner_text_alignment; ?>">	
			<?php if ( have_rows( 'section_rows' ) ) : ?>
			<div class="row <?php if($frame_vert_center) { ?> vertically-centered <?php } ?>">

			<?php 
			// Rows
			while ( have_rows( 'section_rows' ) ) : the_row(); ?>
			
				<?php

				//Row
				$number_of_col = get_sub_field( 'number_of_columns' );		 		
				switch ($number_of_col) {
					case "one":
						$col_class = "col-md-12";
						break;
						
						case "two":
						$col_class = "col-md-6";
						break;	
						
						case "three":
						$col_class = "col-md-4";
						break;
		 			
						case "four":
						$col_class = "col-md-3";
						break;
				}
				
					if( have_rows('columns') ): ?>
						<?php while( have_rows('columns') ): the_row(); 
						
						
						// vars
		 				 				
						$column_one_title = get_sub_field( 'column_one_title' );
						$column_one_header_color_divider = get_sub_field('column_one_divider_header_color_divider');
						$column_one_content = get_sub_field( 'column_one_content' );
						$column_one_title_color = get_sub_field( 'column_one_font_color_title' );
						$column_one_body_color = get_sub_field( 'column_one_font_color_body' );
						$column_one_frame_align = get_sub_field( 'column_one_frame_align' );
						$column_one_frame_width = get_sub_field( 'column_one_frame_width' );		 	
						$column_one_hide = get_sub_field( 'column_one_hide' );
						$column_one_video = get_sub_field( 'column_one_video' );
						$column_one_button_text = get_sub_field('column_one_btn_button_text');
						$column_one_button_url = get_sub_field('column_one_btn_button_url');
						$column_one_button_style = get_sub_field('column_one_btn_button_style');
						$column_one_button_size = get_sub_field('column_one_btn_button_size');
	

						$column_two_title = get_sub_field( 'column_two_title' );
						$column_two_header_color_divider = get_sub_field('column_two_divider_header_color_divider');
						$column_two_content = get_sub_field( 'column_two_content' );
						$column_two_title_color = get_sub_field( 'column_two_font_color_title' );
						$column_two_body_color = get_sub_field( 'column_two_font_color_body' );
						$column_two_frame_align = get_sub_field( 'column_two_frame_align' );
						$column_two_frame_width = get_sub_field( 'column_two_frame_width' );
						$column_two_hide = get_sub_field( 'column_two_hide' );
						$column_two_video = get_sub_field( 'column_two_video' );
						$column_two_button_url = get_sub_field('column_two_btn_button_text');
						$column_two_button_text = get_sub_field('column_two_btn_button_url');
						$column_two_button_style = get_sub_field('column_two_btn_button_style');
						$column_two_button_size = get_sub_field('column_two_btn_button_size');
						
						
						$column_three_title = get_sub_field( 'column_three_title' );
						$column_three_content = get_sub_field( 'column_three_content' );
						$column_three_frame_align = get_sub_field( 'column_three_frame_align' );
						$column_three_frame_width = get_sub_field( 'column_three_frame_width' );
						$column_three_title_color = get_sub_field( 'column_three_font_color_title' );
						$column_three_body_color = get_sub_field( 'column_three_font_color_body' );
						$column_three_hide = get_sub_field( 'column_three_hide' );
						
						
						
						$column_four_title = get_sub_field( 'column_four_title' );
						$column_four_content = get_sub_field( 'column_four_content' );
						$column_four_frame_align = get_sub_field( 'column_four_frame_align' );
						$column_four_frame_width = get_sub_field( 'column_four_frame_width' );
						$column_four_title_color = get_sub_field( 'column_four_font_color_title' );
						$column_four_body_color = get_sub_field( 'column_four_font_color_body' );
						$column_four_hide = get_sub_field( 'column_four_hide' );
			?>


						<?php if( ($number_of_col == "one") || ($number_of_col == "two") ||  ($number_of_col == "three") ||  ($number_of_col == "four") ) { ?>
									<div class="col col-left <?php echo $col_class; ?>  clearfix  <?php if ($column_one_hide) { ?> hide-mobile <?php } ?>">										
										<div class="col col-md-<?php echo $column_one_frame_width; ?> frame-<?php echo $column_one_frame_align; ?> text-<?php echo $fcb_text_alignment; ?> clearfix" >										
											<div class="inner-wrap clearfix" style="color:<?php echo $column_one_body_color; ?> !important;">
												
												<?php if(!empty($column_one_title)) { ?>
													<h2 style="color:<?php echo $column_one_title_color; ?>;" class="title"><?php echo $column_one_title; ?></h2>
													<hr class="color-divider" style="background-color: <?php echo $column_one_header_color_divider; ?>">
													
												<?php } ?>
												
												<?php echo $column_one_content; ?>
												
												<?php if(!empty($column_one_video)) { ?>
												
													<?php include('include-video.php'); ?>
												
												<?php } ?>
												
							
												
												
												<?php if(!empty($column_one_button_text) && !empty($column_one_button_url)) {
          
									              $btn = "<a href='$column_one_button_url' class='c-btn $column_one_button_style $column_one_button_size'>$column_one_button_text</a>";
									              echo $btn;
									              
									            } ?>
												
											</div>
										</div>
									
								<?php if( ($number_of_col == "two") ||  ($number_of_col == "three") ||  ($number_of_col == "four") ) { ?>
									</div>		
								<?php } ?>			
							<?php } ?>
							<?php if( ($number_of_col == "two") ||  ($number_of_col == "three") ||  ($number_of_col == "four") ) { ?>
									<div class="col col-right <?php echo $col_class; ?> clearfix <?php if ($column_two_hide) { ?> hide-mobile <?php } ?>">								
							
										<div class="col col-md-<?php echo $column_two_frame_width; ?> frame-<?php echo $column_two_frame_align;  ?> clearfix">
											<div class="inner-wrap clearfix" style="color:<?php echo $column_two_body_color; ?> !important;">

												<?php if(!empty($column_two_title)) { ?>
													<h2 style="color:<?php echo $column_two_title_color; ?>!important;" class="title"><?php echo $column_two_title; ?></h2>
													<hr class="color-divider" style="background-color: <?php echo $column_two_header_color_divider; ?>">
													
												<?php } ?>
												
												
												
												<?php if(!empty($column_two_video)) { ?>
												
													<?php include('include-video.php'); ?>
												
												<?php } ?>
												
											
												<?php echo $column_two_content; ?>
												
												<?php if(!empty($column_two_button_text) && !empty($column_two_button_url)) {
          
									              $btn = "<a href='$column_two_button_url' class='c-btn $column_two_button_style $column_two_button_size'>$column_two_button_text</a>";
									              echo $btn;
									              
									            } ?>
												
											</div>
										</div>
									</div>


							<?php } ?>
							
							<?php if( ($number_of_col == "three") ||  ($number_of_col == "four") ) { ?>
									<div class="col <?php echo $col_class; ?> clearfix">
										<div class="col <?php echo $column_three_frame_width; ?> frame-<?php echo $column_three_frame_align; ?> clearfix">
											<div class="inner-wrap clearfix" style="color:<?php echo $column_three_body_color; ?> !important;">
												
												<?php if(!empty($column_three_title)) { ?><h2 style="color:<?php echo $column_three_title_color; ?>!important;" class="title"><?php echo $column_three_title; ?></h2><?php } ?>
												
												<?php echo $column_three_content; ?>
												
											</div>
										</div>
									</div>
							<?php } ?>
					
							<?php if( $number_of_col == "four" ) { ?>
									<div class="col <?php echo $col_class; ?> clearfix">
										<div class="col <?php echo $column_four_frame_width; ?> frame-<?php echo $column_four_frame_align; ?> clearfix">
											<div class="inner-wrap clearfix" style="color:<?php echo $column_four_body_color; ?> !important;">
												
												<?php if(!empty($column_four_title)) { ?><h2 style="color:<?php echo $column_four_title_color; ?>!important;" class="title"><?php echo $column_four_title; ?></h2><?php } ?>
												
												
												<?php echo $column_four_content; ?>
											</div>
										</div>
										
									</div>
							<?php } ?>
					<?php endwhile; ?>		
				
				<?php endif;?>


				
				<?php endwhile; // End Row ?>
			</div><!-- row -->
 			
			<?php endif; // End Rows ?>


		</div><!-- /.inner-content -->
	</div><!-- /.frame -->
</section>
