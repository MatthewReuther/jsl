<?php 
  $accordion_bg_color = get_sub_field( 'accordion_item_background_color' );
  $accordion_id = get_sub_field( 'accordion_id' );
  $accordion_title = get_sub_field('accordion_title');

 ?>

<div class="block block--accordion<?php echo $accordion_bg_color; ?> accordion--<?php echo $accordion_id; ?> clearfix" <?php if (! empty($bg_image)) { ?>style="background-image: url('<?php echo $bg_image[url]; ?>');" <?php } ?>>
<div class="frame">
</div>
  <div class=" accordion frame-accordion">

<?php


  
  if( have_rows('accordion_items') ): 

    $i = 1;

    $accordion_items = get_field('accordion_items');
    
    ?>
    
   
      <?php 
      while( have_rows('accordion_items') ): the_row();

        $toggle_title = get_sub_field('toggle_title');
        $toggle_content = get_sub_field('toggle_content');
	    $item_id = str_replace(" ", "-", $toggle_title);
	     
       ?>
      <div class="accordion__item">
      <div class="accordion__title" id="<?php echo $item_id; ?>"><span><?php echo $toggle_title; ?><i class="icn--toggle"></i></span></div>
        <div class="accordion__content">
        <?php 
          // Start Flexible Content
          if ( have_rows( 'toggle_content' ) ) : ?>
            <?php while ( have_rows('toggle_content' ) ) : the_row();
          
              // Layout Name: layout_name
              if ( get_row_layout() == 'block_content_area' ) : ?>
                <div class="content-area ">
                  <?php the_sub_field( 'content_area' ); ?>
<!--                   <div class="icn--toggle"></div> -->
                </div>
          
              <?php elseif (get_row_layout() == 'block_video') : 
              // ACF Relationship Field
              $posts = get_sub_field( 'video_items' );
            

              ?>
								

								  <div class="accordion-video accordion-video--desktop">
								 
								  <?php foreach ( $posts as $post) : // variable must be called $post (IMPORTANT) ?>
								    <?php setup_postdata( $post ); ?>
								    <div class="accordion__video__item video--colorbox">
								   <?php 
																$video_url = get_permalink();
																$video_thumb = get_field( 'video_thumb'); 
																$video_id = get_field( 'video_id'); ?>

																<a class="ajax" data-href="<?php echo $video_url; ?>" href="<?php echo $video_url; ?>">
																<div class="box--img">
								    				  						<?php if(!empty($video_thumb)) : ?>
								    												<img src="<?php echo $video_thumb[url]; ?>" alt="<?php the_title(); ?>">
								    											<?php endif; ?>
																</div>
															</a>

								   					<h4><?php the_title(); ?></h4>
								   					<p><?php the_date('F Y'); ?></p>
								    </div>

								  <?php endforeach; wp_reset_postdata(); ?>
									
								  </div>
									
									  <div class="accordion-video accordion-video--mobile">
									 
									  <?php foreach ( $posts as $post) : // variable must be called $post (IMPORTANT) ?>
									    <?php setup_postdata( $post ); ?>
									    <div class="accordion__video__item video--colorbox">
									   <?php 
																	$video_url = get_permalink();
																	$video_thumb = get_field( 'video_thumb'); 
																	$video_id = get_field( 'video_id'); ?>

																	<a class="ajax" data-href="<?php echo $video_url; ?>" href="<?php echo $video_url; ?>">
																	<div class="box--img">
									    				  						<?php if(!empty($video_thumb)) : ?>
									    												<img src="<?php echo $video_thumb[url]; ?>" alt="<?php the_title(); ?>">
									    											<?php endif; ?>
																	</div>
																</a>
															<h4><?php the_title(); ?></h4>
															<p><?php the_date('F Y'); ?></p>
									   
									    </div>

									  <?php endforeach;?>
										
									  </div>
										<div class="accordion-video-paging-nav"><span class="accordion-video-paging-info"></span></div>
								
			<?php  wp_reset_postdata();  ?>
			

              <?php elseif (get_row_layout() == 'block_case_results') : ?>
             
                
                <?php

                  // ACF Relationship Field
                  $posts = get_sub_field( 'case_result_items' );
                  if ( $posts ) : ?>
                      <div class="content-area frame">
                    <ul>
                    <?php foreach ( $posts as $post) : // variable must be called $post (IMPORTANT) ?>
                      <?php setup_postdata( $post ); 

                      $case_summary_content = get_the_content();
                      $case_summary_excerpt = get_the_excerpt();
                      ?>
                      <li class="case-result__item">
                        <span class="case-result-title"><?php the_title(); ?></span>  <?php the_excerpt(); ?> 
                        <?php $cs_content_length = strlen($case_summary_content); ?>
                        <?php $cs_excerpt_length = strlen($case_summary_excerpt); ?>
                        <?php if($cs_content_length >  $cs_excerpt_length )  { ?>
                          <p><a title="" href="<?php the_permalink(); ?>">Read the full case summary</a></p>
                        <?php } ?>
                      </li>

                       

                    <?php endforeach; ?>
                    </ul>
                      <div class="icn--toggle"></div>
                    </div>
                    <?php wp_reset_postdata(); // IMPORTANT - reset the  object so the rest of the page works correctly ?>
                  <?php endif;

                 ?>      
  
             <?php endif; ?>
            <?php endwhile; ?>
          <?php endif;
         ?>
          
          </div>
        </div>
<?php 
        $i++;

      endwhile;

  endif;

 ?>
   </div><!-- /.frame -->
 </div><!-- /.block --> 