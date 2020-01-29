<?php 

	$section_title = get_sub_field( 'section_title' );
	$section_content = get_sub_field( 'section_content' );
	$section_anchor = get_sub_field( 'section_anchor' );

	if( have_rows('css_id_&_classes') ): 

	 	while( have_rows('css_id_&_classes') ): the_row(); 
	 		
	 			$css_id = get_sub_field("css_id");
	 			$css_class = get_sub_field("css_class");
		
		endwhile;
	endif;

 ?>
 <?php if($section_anchor) { ?><a nohref id='<?php echo $section_anchor; ?>' class='anchor'></a> <?php } ?>
 <section id="" class="block block__blog-feed">
	<div class="frame">
		<?php if(!empty(get_sub_field('section_title'))) { ?>
		<h2><?php echo $section_title; ?></h2>
		<?php } ?>
		<?php echo $section_content; ?>
		<?php 
   	// the query
   	$the_query = new WP_Query( array(
      'posts_per_page' => 10,
   	)); 
		?>

		<?php if ( $the_query->have_posts() ) : ?>
			<ul class="blog-feed--list">
		  <?php while ( $the_query->have_posts() ) : $the_query->the_post(); ?>
		    <?php 
		    	$blog_title = get_the_title();
		    	if (strlen($blog_title) > 39)
		    	   $blog_title = substr($blog_title, 0, 36) . '...';
		    	$thumb = get_the_post_thumbnail_url( $post_id, 'medium' );  

		    ?>
			<li class="blog-feed--list--item">
				<a href="<?php the_permalink(); ?>">
				<h3><?php echo $blog_title; ?></h3>
				<img src="<?php echo $thumb; ?>" alt="">
		    
		    </a>
			</li>

		  <?php endwhile; ?>
		  <?php wp_reset_postdata(); ?>
			</ul>
		<?php else : ?>
		  <p><?php __('No News'); ?></p>
		<?php endif; ?>





 		
 
 		<!-- <h3 class="btn--box"><a href="" class="btn btn__naked">Visit Our Blog</a></h3> -->

 		<div class="form__blog-optin">
 			<!-- <p>Subscribe to receive insights from our team straight to your inbox.</p> -->
 			<?php echo do_shortcode('[updates_form]'); ?>
 		</div>
 	</div>
 </section>