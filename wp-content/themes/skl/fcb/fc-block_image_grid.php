<?php 

	// $section_title = get_sub_field( 'section_title' );
	// $section_content = get_sub_field( 'section_content' );
	// $section_anchor = get_sub_field( 'section_anchor' );
		$section_trailing_content = get_sub_field( 'section_trailing_content' );
	
	$bg_color = get_sub_field( 'background_color' );
	// $bg_image = get_sub_field( 'background_image' );
	// $bg_tilt = get_sub_field( 'background_tilt' );
	// if($bg_tilt) {
	// 	$bg_tilt = "block__tilt";
	// 	$tilt_direction = get_sub_field( 'tilt_direction' );
	// 	$bg_tilt_dir = $bg_tilt . "__" . $tilt_direction;
	// }

	$frame_position = get_sub_field("frame_position");
	$frame_alignment = get_sub_field("frame_alignment");

	// if( have_rows('sizing') ): 

	//  	while( have_rows('sizing') ): the_row(); 
	 		
	//  		$section_height = get_sub_field( 'section_height' );
	//  		$frame_width = get_sub_field( 'section_width' );
		
	// 	endwhile;
	// endif;
	// if( have_rows('css_id_&_classes') ): 

	//  	while( have_rows('css_id_&_classes') ): the_row(); 
	 		
	//  			$css_id = get_sub_field("css_id");
	//  			$css_class = get_sub_field("css_class");
		
	// 	endwhile;
	// endif;

	// $font_color = get_sub_field( 'font_color' );


	
 ?>
<section class="block block--image--grid block__<?php echo $bg_color; ?> block--align__<?php echo $frame_alignment; ?> ">
	<div class="frame frame--image--grid">
	<div class="grid">
			<?php if ( have_rows( 'images' ) ) : $i=1;?>
		
					<?php while ( have_rows( 'images' ) ) : the_row();
					$thumbnail = get_sub_field( 'image_item' ); 

					?>
					<figure class="grid--item grid--item--<?php echo $i; ?>"><img class="grid--img" src="<?php echo $thumbnail['url']; ?>" alt=""></figure>
					<?php $i++; endwhile; ?>

			<?php endif; ?>

			</div>
		<?php if(!empty($section_trailing_content)) { echo $section_trailing_content; } ?>
	</div>
</section>