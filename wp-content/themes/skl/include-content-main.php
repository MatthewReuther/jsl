<?php if (class_exists('acf')) { ?>
	
	<?php
	
	// check if the flexible content field has rows of data
	if( have_rows('flex_content_blocks') ):
	
	
	     // loop through the rows of data
	    while ( have_rows('flex_content_blocks') ) : the_row();
		


			get_template_part('fcb/fc', get_row_layout());
			
	
	    endwhile;
	
	else :
	
	    // no layouts found
	
	endif;
	
	?>

<?php } ?>