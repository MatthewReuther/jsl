<?php 

	$section_title = get_sub_field( 'section_title' );
	$section_content = get_sub_field( 'section_content' );
	$section_anchor = get_sub_field( 'section_anchor' );
	$section_jump_line = get_sub_field( 'section_jump_line' );
	
	$accordion_items = get_sub_field( 'accordion_items' );

	$bg_color = get_sub_field( 'background_color' );
	$bg_image = get_sub_field( 'background_image' );
	$bg_tilt = get_sub_field( 'background_tilt' );
	if($bg_tilt) {
		$bg_tilt = "block__tilt";
		$tilt_direction = get_sub_field( 'tilt_direction' );
		$bg_tilt_dir = $bg_tilt . "__" . $tilt_direction;
	}

	$frame_position = get_sub_field("frame_position");
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


	
 ?>




 <?php if($section_anchor) { ?><a nohref id='<?php echo $section_anchor; ?>' class='anchor'></a> <?php } ?>

 <section id="<?php echo $css_id; ?>" class="block block__<?php echo $bg_color; ?><?php echo " $css_class"; ?><?php if($bg_tilt) { echo " $bg_tilt"; echo " $bg_tilt_dir"; } ?> block--align__<?php echo $frame_alignment; ?> clearfix" <?php if (! empty($bg_image)) { ?>style="background-image: url('<?php echo $bg_image[url]; ?>');" <?php } ?>>
 	<div class="frame frame__accordion frame__<?php echo $frame_position; ?> frame__<?php echo $frame_width; ?>">
 		<div class="inner-content">
 			<?php if(!empty(get_sub_field('section_title'))) { ?>
			<h2><?php echo $section_title; ?></h2>
			<?php } ?>
 			<?php echo $section_content; ?>
 			<?php if ( have_rows( 'accordion_items' ) ) : ?>
 					<ul class="accordion">
 					<?php while ( have_rows( 'accordion_items' ) ) : the_row();
 						  $toggle_title = get_sub_field('toggle_title');
        			$toggle_content = get_sub_field('toggle_content');

 						?>
 						
					
					<li class="accordion--item">
						<div class="accordion--title">	
							<span><?php echo $toggle_title; ?></span>
							<i class="arrow ">+</i>
						</div>
						<div class="accordion--content">
							<?php echo $toggle_content; ?>
						</div>
					</li>









 					<?php endwhile; ?>
				</ul>
 			<?php endif; ?>
	
 		</div><!-- /.inner-content -->
 		<?php if ( have_rows( 'section_rows' ) ) : ?>
			
			<?php 
			// Rows
			while ( have_rows( 'section_rows' ) ) : the_row(); ?>
				<div class="row">
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

	

		 		if( have_rows('columns') ): 

		 			while( have_rows('columns') ): the_row(); 
		 				
		 				// vars
		 				$column_one_title = get_sub_field( 'column_one_title' );
		 				$column_one_title_icon = get_sub_field( 'column_one_title_icon' );
		 				$column_one_content = get_sub_field( 'column_one_content' );
		 				
		 				$column_two_title = get_sub_field( 'column_two_title' );
		 				$column_two_title_icon = get_sub_field( 'column_two_title_icon' );
		 				$column_two_content = get_sub_field( 'column_two_content' );
		 				
		 				$column_three_title = get_sub_field( 'column_three_title' );
		 				$column_three_title_icon = get_sub_field( 'column_three_title_icon' );
		 				$column_three_content = get_sub_field( 'column_three_content' );
		 				
		 				$column_four_title = get_sub_field( 'column_four_title' );
		 				$column_four_title_icon = get_sub_field( 'column_four_title_icon' );
		 				$column_four_content = get_sub_field( 'column_four_content' );
		 				
		 				?>
		 				

						
						<?php if( ($number_of_col == "one") || ($number_of_col == "two") ||  ($number_of_col == "three") ||  ($number_of_col == "four") ) { ?>
									<div class="col <?php echo $col_class; ?>">
										<?php if(!empty($column_one_title_icon)) { ?><i class="icn" style="background-image: url(<?php echo $column_one_title_icon[url]; ?>);"></i><?php } ?>
										<?php if(!empty($column_one_title)) { ?><h3><?php echo $column_one_title; ?></h3><?php } ?>
										<?php echo $column_one_content; ?>
									</div>
							<?php } ?>
							<?php if( ($number_of_col == "two") ||  ($number_of_col == "three") ||  ($number_of_col == "four") ) { ?>
									<div class="col <?php echo $col_class; ?>">
										<?php if(!empty($column_two_title_icon)) { ?><i class="icn" style="background-image: url(<?php echo $column_two_title_icon[url]; ?>);"></i><?php } ?>
										<?php if(!empty($column_two_title)) { ?><h3><?php echo $column_two_title; ?></h3><?php } ?>
										<?php echo $column_two_content; ?>
									</div>
							<?php } ?>
							<?php if( ($number_of_col == "three") ||  ($number_of_col == "four") ) { ?>
									<div class="col <?php echo $col_class; ?>">
										<?php if(!empty($column_three_title_icon)) { ?><i class="icn" style="background-image: url(<?php echo $column_three_title_icon[url]; ?>);"></i><?php } ?>	
										<?php if(!empty($column_three_title)) { ?><h3><?php echo $column_three_title; ?></h3><?php } ?>	
										<?php echo $column_three_content; ?>
									</div>
							<?php } ?>
							<?php if( $number_of_col == "four" ) { ?>
									<div class="col <?php echo $col_class; ?>">
										<?php if(!empty($column_four_title_icon)) { ?><i class="icn" style="background-image: url(<?php echo $column_four_title_icon[url]; ?>);"></i><?php } ?>
										<?php if(!empty($column_four_title)) { ?><h3><?php echo $column_four_title; ?></h3><?php } ?>
										<?php echo $column_four_content; ?>
									</div>
							<?php } ?>
		 			<?php endwhile; ?>
		 			
		 		<?php endif;?>



				
				</div><!-- /.row -->
			<?php endwhile; // End Row ?>
 				
 		<?php endif; // End Rows ?>
		<?php if( have_rows('section_jump_line') ): 

			while( have_rows('section_jump_line') ): the_row(); 
				
				// vars
				$jump_line_text = get_sub_field( 'jump_line_text' );
				$jump_line_url = get_sub_field( 'jump_line_url' );
				
				?>
			<?php echo "<a href='$jump_line_url' class='jump-line'>$jump_line_text</a>";  ?>
			<?php endwhile; ?>
			
		<?php endif; ?>
	</div><!-- /.frame -->
</section>
