<?php 
		$portfolio_items = get_sub_field( 'portfolio_items' );

 ?>
<section class="block block--grid block--<?php //echo $section_id; ?> clearfix block--portfolio-grid"><div>
	<h2>Check out some of our most recent work.</h2>
	<div class="frame--grid">

		<?php // echo section title ?>
		

			<?php // ACF Relationship Field
			$posts = get_sub_field( 'portfolio_items' );
			if ( $posts ) : $i=1;?>
			  <div class="grid clearfix">
			  <?php foreach ( $posts as $post) : // variable must be called $post (IMPORTANT) ?>
			    <?php setup_postdata( $post ); 
			    	 $project_thumbnail = get_field( 'project_thumbnail');
			    	 $project_type = get_field( 'project_type');
			    	 $project_image = get_field( 'project_image', $projects->ID );
			    ?>
			   <figure class="grid--item grid--item--<?php echo $i; ?>"> <?php if($project_type == 'image') { ?>
                      <a data-fancybox="images" href="<?php echo $project_image['url']; ?>"><img class="grid--img" src="<?php echo $project_thumbnail['url']; ?>" alt=""></a>

                      <?php } else if($project_type == 'video') { ?>
                      <!-- <a href="<?php // the_permalink(); ?>" class="fancybox"></a> -->
                      <a data-fancybox data-type="iframe" data-src="<?php the_permalink(); ?>" href="javascript:;"><img class="grid--img" src="<?php echo $project_thumbnail['url']; ?>" alt="">
                      </a>
                    <?php } ?></figure>
			     
	
			   	
			  <?php $i++; endforeach; ?>
			  </div>
			  <?php wp_reset_postdata(); // IMPORTANT - reset the  object so the rest of the page works correctly ?>
			<?php endif; ?>
		  
		
		<h3 class="btn--box"><a href="/work/" class="btn btn__naked">See All of Our Work</a></h3>
		
	</div>
</section>