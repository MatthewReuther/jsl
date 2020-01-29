<?php 

	$section_title = get_sub_field( 'section_title' );
	$section_content = get_sub_field( 'section_content' );
	$section_anchor = get_sub_field( 'section_anchor' );
	$section_jump_line = get_sub_field( 'section_jump_line' );
	$section_trailing_content = get_sub_field( 'section_trailing_content' );

	$bg_color = get_sub_field( 'background_color' );
	$bg_image = get_sub_field( 'background_image' );
	$bg_image_width = get_sub_field( 'main_background_width' );
	$bg_image_frame = get_sub_field( 'main_background_alignment' );

	$frame_position = get_sub_field("frame_position");
	$frame_vert_center = get_sub_field("frame_vert_center");
	$frame_alignment = get_sub_field("frame_alignment");

	if( have_rows('sizing') ): 

	 	while( have_rows('sizing') ): the_row(); 
	 		
	 		$section_height = get_sub_field( 'section_height' );
	 		$frame_width = get_sub_field( 'section_width' );
		
		endwhile;
	endif;
	if( have_rows('css_id_&_classes') ): 

	 	while( have_rows('css_id_&_classes') ): the_row(); 
	 		
	 			$css_id = get_sub_field("css_id");
	 			$css_class = get_sub_field("css_class");
		
		endwhile;
	endif;

	$font_color = get_sub_field( 'font_color' );


	$number_of_col = get_sub_field( 'number_of_columns' );



 ?>
 
 <?php if($section_anchor) { ?><a nohref id='<?php echo $section_anchor; ?>' class='anchor'></a> <?php } ?>
 
<?php

// check if the repeater field has rows of data
if( have_rows('section_rows') ): 

 	// loop through the rows of data
    while ( have_rows('section_rows') ) : the_row();

 		$number_of_col = get_sub_field( 'number_of_columns' );
 		
 		?>
 		
 		
 		
 		<?php

    endwhile;


endif;

?>

 



<section id="<?php echo $css_id; ?>" class="block block-<?php echo $number_of_col ?>-column <?php echo " $css_class"; ?><?php if($bg_tilt) { echo " $bg_tilt"; echo " $bg_tilt_dir"; } ?> block--align__<?php echo $frame_alignment; ?> clearfix" style="background-color: <?php echo $bg_color; ?>">
 
 <?php if(!empty($bg_image)) { ?>
 	<div class="main-bg <?php echo $bg_image_frame; ?> <?php echo $bg_image_width; ?>" <?php if(! empty($bg_image)) { ?> style="background-image: url(<?php echo $bg_image[url]; ?>);"><?php } ?></div>
<?php } ?>

 	<div class="frame__<?php echo $frame_position; ?> frame-main">	 	
 		<div class="main-inner-wrap clearfix">
 			<?php if(!empty(get_sub_field('section_title'))) { ?>
			<h2><?php echo $section_title; ?></h2>
			<?php } ?>
 			<?php echo $section_content; ?>
 				

 		
 		<?php if ( have_rows( 'section_rows' ) ) : ?>
<!-- 			<div class="row" > -->
			<div class="row <?php if($frame_vert_center) { ?> vertically-centered <?php } ?>">

			<?php 
			// Rows
			while ( have_rows( 'section_rows' ) ) : the_row(); ?>
			
				<?php

				//Row
		 		$number_of_col = get_sub_field( 'number_of_columns' );
		 		$display_custom_column_widths = get_sub_field( 'custom_column_width' );
		 		$custom_column_width = get_sub_field( 'select_custom_column_widths' );
		 				 		
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
		 				$column_one_sub_title = get_sub_field( 'column_one_sub_title' );
		 				$column_one_title_icon = get_sub_field( 'column_one_title_icon' );
		 				$column_one_bg_img = get_sub_field( 'column_one_bg_img' );
// 		 				$column_one_content = get_sub_field( 'column_one_content', false , false );
		 				$column_one_content = get_sub_field( 'column_one_content' );
		 				$column_one_frame_align = get_sub_field( 'column_one_frame_align' );
		 				$column_one_slider = get_sub_field( 'column_one_slider' );
		 				$column_one_color = get_sub_field( 'column_one_font_color' );
		 				$column_one_sub_color = get_sub_field( 'column_one_sub_title_color' );
		 				$column_one_video = get_sub_field( 'column_one_video' );
		 				
		 						 				
		 				
		 				$column_two_title = get_sub_field( 'column_two_title' );
		 				$column_two_sub_title = get_sub_field( 'column_two_sub_title' );
		 				$column_two_title_icon = get_sub_field( 'column_two_title_icon' );
		 				$column_two_bg_img = get_sub_field( 'column_two_bg_img' );
		 				$column_two_content = get_sub_field( 'column_two_content' );
		 				$column_two_frame_align = get_sub_field( 'column_two_frame_align' );
		 				$column_two_slider = get_sub_field( 'column_two_slider' );
		 				$column_two_color = get_sub_field( 'column_two_font_color' );
		 				$column_two_sub_color = get_sub_field( 'column_two_sub_title_color' );
		 				$column_two_video = get_sub_field( 'column_two_video' );
		 				
		 				$column_three_title = get_sub_field( 'column_three_title' );
		 				$column_three_title_icon = get_sub_field( 'column_three_title_icon' );
		 				$column_three_content = get_sub_field( 'column_three_content' );
		 				$column_three_frame_align = get_sub_field( 'column_three_frame_align' );
		 				$column_three_color = get_sub_field( 'column_three_font_color' );

		 			
		 				
		 				$column_four_title = get_sub_field( 'column_four_title' );
		 				$column_four_title_icon = get_sub_field( 'column_four_title_icon' );
		 				$column_four_content = get_sub_field( 'column_four_content' );
		 				$column_four_frame_align = get_sub_field( 'column_four_frame_align' );
		 				$column_four_color = get_sub_field( 'column_four_font_color' );

		 				
// 		 				Frame Width
						$column_one_frame_width = get_sub_field( 'column_one_frame_width' );
						$column_two_frame_width = get_sub_field( 'column_two_frame_width' );
						$column_three_frame_width = get_sub_field( 'column_three_frame_width' );
						$column_four_frame_width = get_sub_field( 'column_four_frame_width' );
						
						
		 				?>


						<?php if( ($number_of_col == "one") || ($number_of_col == "two") ||  ($number_of_col == "three") ||  ($number_of_col == "four") ) { ?>										
									<div class="<?php if($display_custom_column_widths == true) { ?> <?php echo $custom_column_width; ?> custom-col-left <?php } ?> col col-left clearfix <?php echo $col_class; ?>"><?php } {?>						
										<div class="col <?php echo $column_one_frame_width; ?> frame-<?php echo $column_one_frame_align; ?> clearfix" >										
											<div class="inner-wrap clearfix" style="color:<?php echo $column_one_color; ?>;">
												<?php if(!empty($column_one_title_icon)) { ?><i class="icn" style="height: 85px; width: 180px; background-image: url(<?php echo $column_two_title_icon[url]; ?>);"></i><?php } ?>
												<?php if(!empty($column_one_sub_title)) { ?><span class="sub-title" style="color:<?php echo $column_one_sub_color; ?>;"><?php echo $column_one_sub_title; ?></span><?php } ?>
												<?php if(!empty($column_one_title)) { ?><h2 class="title"><?php echo $column_one_title; ?></h2><?php } ?>
												
												
												<?php if(!empty($column_one_video)) { ?>
												
													<?php include('include-video.php'); ?>
												
												<?php } ?>
												
												
												<?php if((!empty($column_one_slider)) || ($column_one_slider == "null")) { ?>
												
													<?php include('include-sliders.php'); ?>
												
												
												<?php } ?>
												<?php echo $column_one_content; ?>
											</div>
										</div>
									</div>
									<?php if(!empty($column_one_bg_img)) { ?><div class="col-1 col-bg-img" <?php if(!empty($column_one_bg_img)) { ?> style="background-image: url(<?php echo $column_one_bg_img[url]; ?>);"><?php } ?></div></h3><?php } ?>
	
							<?php } ?>
							<?php if( ($number_of_col == "two") ||  ($number_of_col == "three") ||  ($number_of_col == "four") ) { ?>								
									<div class="<?php if($display_custom_column_widths == true) { ?> <?php echo $custom_column_width; ?> custom-col-right <?php } ?> col col-right clearfix <?php echo $col_class; ?>"><?php } {?>
							
										<div class="col <?php echo $column_two_frame_width; ?> frame-<?php echo $column_two_frame_align;  ?> clearfix">
											<div class="inner-wrap clearfix" style="color:<?php echo $column_two_color; ?>;">
												<?php if(!empty($column_two_title_icon)) { ?><i class="icn" style="background-image: url(<?php echo $column_two_title_icon[url]; ?>);"></i><?php } ?>
												<?php if(!empty($column_two_sub_title)) { ?><span class="sub-title" style="color:<?php echo $column_two_sub_color; ?>;"><?php echo $column_two_sub_title; ?></span><?php } ?>
												<?php if(!empty($column_two_title)) { ?><h2 class="title"><?php echo $column_two_title; ?></h2><?php } ?>
												
												<?php if(!empty($column_two_video)) { ?>
												
													<?php include('include-video.php'); ?>
												
												<?php } ?>
												
												<?php if(empty($column_one_slider) && (!($column_two_slider == "null"))) { ?>
												
													<?php include('include-sliders.php'); ?>
												
												
												<?php } ?>
												<?php echo $column_two_content; ?>
											</div>
										</div>
									</div>
									<?php if(!empty($column_two_bg_img)) { ?><div class="background-test col-2" <?php if(!empty($column_two_bg_img)) { ?> style="background-image: url(<?php echo $column_two_bg_img[url]; ?>);"><?php } ?></div></h3><?php } ?>

							<?php } ?>
							
							<?php if( ($number_of_col == "three") ||  ($number_of_col == "four") ) { ?>
									<div class="col <?php echo $col_class; ?> clearfix">
										<div class="col <?php echo $column_three_frame_width; ?> frame-<?php echo $column_three_frame_align; ?> clearfix">
											<div class="inner-wrap clearfix" style="color:<?php echo $column_three_color; ?>;">
												<?php if(!empty($column_three_title_icon)) { ?><i class="icn" style="background-image: url(<?php echo $column_three_title_icon[url]; ?>);"></i><?php } ?>	
												<?php if(!empty($column_three_title)) { ?><h3><?php echo $column_three_title; ?></h3><?php } ?>	
												<?php echo $column_three_content; ?>
											</div>
										</div>
									</div>
							<?php } ?>
					
							<?php if( $number_of_col == "four" ) { ?>
									<div class="col <?php echo $col_class; ?> clearfix">
										<div class="col <?php echo $column_four_frame_width; ?> frame-<?php echo $column_four_frame_align; ?> clearfix">
											<div class="inner-wrap clearfix" style="color:<?php echo $column_four_color; ?>;">
												<?php if(!empty($column_four_title_icon)) { ?><i class="icn" style="background-image: url(<?php echo $column_four_title_icon[url]; ?>);"></i><?php } ?>
												<?php if(!empty($column_four_title)) { ?><h3><?php echo $column_four_title; ?></h3><?php } ?>
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
		<?php if(!empty($section_trailing_content)) { echo $section_trailing_content; } ?>


		</div><!-- /.inner-content -->
	</div><!-- /.frame -->
</section>
