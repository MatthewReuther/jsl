		


	<?php 
		$posts = get_field('related_attorneys');

		if( $posts ):
		
		 ?>
		<section class="section-related-attorneys"><h2>Meet Your Legal Team</h2>

<p>At Cory Watson Attorneys, we know how important it is to feel comfortable getting legal help after an injury. Before you contact us for help, get to know the names and faces of the attorneys handling cases like yours.</p>
	<div class="related-attorneys-container">
			<div class="related-attorneys">
		    <ul class="clearfix list-related-attorneys">
		    <?php foreach( $posts as $post): ?>

		        <?php setup_postdata($post); 
		        	    $atty_name = get_the_title($post->ID);
		    					$atty_image = get_field('attorney_image',$the_pages->ID);
		    					$atty_title = get_field('attorney_title',$the_pages->ID);
								$atty_secondary_title = get_field('attorney_secondary_title',$the_pages->ID);
		    					//Lower case everything
		    					$atty_id = strtolower($atty_name);
		    					//Convert whitespaces and underscore to dash
		    					$atty_id = preg_replace("/[\s_]/", "-", $atty_id);
		    					$atty_id = preg_replace("/[.,]/", "", $atty_id);
		    					$atty_id = preg_replace('/["]/', "", $atty_id); ?>

		        <li>
		        	<div class="atty-card clearfix">
								<div class="img-box"> <a href="<?php echo get_permalink($post->ID); ?>"> 
									<img src="<?php echo $atty_image['url']; ?>" alt="<?php echo $atty_image['alt']; ?>" />		</a>
								</div>
								<div class="atty-info">
									<h3 class="atty-name"><?php if(!empty($preferred_name)) { echo $preferred_name; } else {echo $atty_name; } ?></h3>
										<p class="atty-title"><?php echo $atty_title; ?></p>
									<?php if(!empty($atty_secondary_title)) { ?><p class="atty-title atty-title-secondary"><?php echo $atty_secondary_title; ?></p><?php } ?>
								</div>
							</div>
		       		
		        </li>
		    <?php endforeach; ?>
		    </ul>
		    <?php wp_reset_postdata(); // IMPORTANT - reset the $post object so the rest of the page works correctly ?></div>
		    <div class="slider-related-attorneys"></div>
		    </div>
		    		<p>Want to learn more? Visit the <a href="/about-us/meet-our-attorneys/">Meet Our Attorneys</a> page for full bios on all of our attorneys.</p></section>
		<?php endif; ?>
