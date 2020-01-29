

<?php 

$posts = get_sub_field( 'column_one_video' );

if( $posts ): ?>
	<?php foreach( $posts as $p ): // variable must NOT be called $post (IMPORTANT)
	$vzaar_id =  get_field('vzaar_id', $p->ID);
	
	?>
	   
	   <?php echo do_shortcode("[vzaar id='$vzaar_id']"); ?>
	    
	<?php endforeach; ?>
		
			
	
<?php endif; ?>

<?php 

$posts = get_sub_field( 'column_two_video' );

if( $posts ): ?>
	<?php foreach( $posts as $p ): // variable must NOT be called $post (IMPORTANT)
	$vzaar_id =  get_field('vzaar_id', $p->ID);
	
	?>
	   
	   <?php echo do_shortcode("[vzaar id='$vzaar_id']"); ?>
	    
	<?php endforeach; ?>
		
			
	
<?php endif; ?>