<?php 
    
    $reset_label = get_sub_field( 'reset_label' );
    $sortable_grid = get_sub_field( 'sortable_grid' );
    

 ?>





<div class="container">
  <div class="">
    <div class="">
    <?php if ( have_rows( 'sortable_grid' ) ) : ?>
    <div class="portfolioFilter clearfix">
      <a href="#" data-filter="*" class="current"><?php echo $reset_label; ?></a>
       
          <?php while ( have_rows( 'sortable_grid' ) ) : the_row(); ?>
            <?php 
              $label = get_sub_field( 'category_label' );
             ?>
              <a href="#" data-filter=".<?php print (str_replace(' ', '-', strtolower($label))); ?>"><?php echo $label; ?></a>
          <?php endwhile; ?>
      
    </div>
    <?php endif; ?>
    </div>
      <?php if ( have_rows( 'sortable_grid' ) ) : 
        $source = get_field( 'source' );

        ?>
    <div class="portfolioContainer <?php echo $sorce; ?>--sortable-grid">
        
          <?php while ( have_rows( 'sortable_grid' ) ) : the_row(); ?>
            <?php $label = get_sub_field( 'category_label' ); ?>
            <?php 
              // ACF Relationship Field
              $posts = get_sub_field( 'grid_items' );
              if ( $posts ) : ?>
                <?php foreach ( $posts as $post) : // variable must be called $post (IMPORTANT) ?>
                  <?php setup_postdata( $post ); ?>
                  <?php $post_type = get_post_type( get_the_ID() ); ?>
                  <div class="<?php print (str_replace(' ', '-', strtolower($label))); ?> <?php echo $post_type; ?>--item">
                    <?php 
                      if ($post_type == "staff") { ?>
                        
                        <?php 
                          $staff_image = get_field( 'staff_image' );
                          $staff_title = get_field( 'staff_title' );
                          $staff_category = get_field( 'staff_category' );

                         ?>
                       
                          <div class="staff--card">
                            <div class="staff--card--img img--box">
                              <img src="<?php echo $staff_image['url']; ?>" alt="<?php the_title(); ?>">
                            </div>
                            <div class="staff--card--info">
                              <h3 class="staff--card--name"><?php the_title(); ?></h3>
                              <h4 class="staff--card--title"><?php echo $staff_title; ?> | <?php echo $staff_category; ?></h4>
                            </div>
                          </div>

                      <?php }

                     ?>
                  </div>



                <?php endforeach; ?>
                
                <?php wp_reset_postdata(); // IMPORTANT - reset the  object so the rest of the page works correctly ?>
              <?php endif;
             ?>

          <?php endwhile; ?>


      <?php endif; ?>


    </div>
  </div>
</div>