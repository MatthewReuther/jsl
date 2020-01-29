<?php if (class_exists('acf')) { ?>

	<?php

		// check if the flexible content field has rows of data
		if( have_rows('flex_content_blocks_before') ):
			$count = 0;
		
			// loop through the rows of data
			while ( have_rows('flex_content_blocks_before') ) : the_row();
	
			$count++;
	
			$anchor = get_sub_field('anchor');						
			$css_classes = get_sub_field('css_classes');
	
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
			
			$fcb_top_padding = $fcb['block_top_padding'];
			$fcb_bottom_padding = $fcb['block_bottom_padding'];
			
			$header_color_divider = get_field('header_color_divider');
	
			// check if the repeater field has rows of data
			if( have_rows('section_rows') ): 
			
				// loop through the rows of data
				while ( have_rows('section_rows') ) : the_row();
			
				$number_of_col = get_sub_field( 'number_of_columns' );
	
			endwhile;
		endif; 
	?>




	<?php if( get_row_layout() == 'block_global'  || get_row_layout() == 'block_content' ): ?>


			<section id="<?php echo $anchor; ?>" class="block block-<?php echo $count; ?> block-<?php echo $css_classes; ?> block-<?php echo $number_of_col ?>-column block--align__<?php echo $text_alignment; ?> clearfix" <?php if (!empty($fcb_bg_img) && empty($fcb_bg_color)) { ?>style="padding-top: <?php echo $fcb_top_padding ?>; padding-bottom: <?php echo $fcb_bottom_padding ?>; background-image: url('<?php echo $fcb_bg_img['url']; ?>');" <?php } elseif (empty($fcb_bg_img) && !empty($fcb_bg_color)) { ?>style="padding-top: <?php echo $fcb_top_padding ?>; padding-bottom: <?php echo $fcb_bottom_padding ?>; background-color: <?php echo $fcb_bg_color ?>;"  <?php } else { ?> style="padding-top: <?php echo $fcb_top_padding ?>; padding-bottom: <?php echo $fcb_bottom_padding ?>;"  <?php }?>>
		
				<?php if(!empty($fcb_bg_img_tab) && empty($fcb_bg_color_tab)) {?>
		
				<style>
				@media only screen and (max-width: 1179px) {
					.block-<?php echo $count; ?> {
						background-image: url('<?php echo $fcb_bg_img_tab['url']; ?>') !important;
						background-position: center top;
					}
				}
				</style>
		
				<?php } elseif (!empty($fcb_bg_color_tab) && empty($fcb_bg_img_tab)) {?> 
				<style>
				@media only screen and (max-width: 1179px) {
					.block-<?php echo $count; ?> {
						background-image: none !important;
						background-color: <?php echo $fcb_bg_color_tab ?> !important;
					}
				}
				</style>
				<?php } ?>
		
		
				<?php if(!empty($fcb_bg_img_mob) && empty($fcb_bg_color_mob)) {?>
				<style>
				@media only screen and (max-width: 479px) {
					.block-<?php echo $count; ?> {
						background-image: url('<?php echo $fcb_bg_img_mob['url']; ?>') !important;
						background-position: 62% !important;
					}
				}
				</style>
		
				<?php } elseif (!empty($fcb_bg_color_mob) && empty($fcb_bg_img_mob)) {?> 
				<style>
					@media only screen and (max-width: 479px) {
						.block-<?php echo $count; ?> {
						background-image: none !important;
						background-color: <?php echo $fcb_bg_color_mob ?> !important;
						}
					}
				</style>
				<?php } ?>
		
		
				<?php
					get_template_part('fcb/fc', get_row_layout());
				?>
		
		
		
			</section>
	<?php	
		endif;

	endwhile;

	else :
	
	// no layouts found
	
	endif;

	?>

<?php } ?>