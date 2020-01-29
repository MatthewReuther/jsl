<?php 
    
    $reset_label = get_sub_field( 'reset_label' );
    $sortable_grid = get_sub_field( 'sortable_grid' );
    $source = get_sub_field( 'source' ); 

    if( have_rows('css_id_&_classes') ): 

      while( have_rows('css_id_&_classes') ): the_row(); 
        
          $css_id = get_sub_field("css_id");
          $css_class = get_sub_field("css_class");
      
      endwhile;
    endif;

 ?>


<section id="<?php echo $css_id; ?>" class="sortable-grid-container <?php echo "$css_class"; ?>">
    <div class="sortable-grid--filter nav__grid <?php echo "$css_class"; ?>__filters clearfix">
    
    <?php if ($source == 'staff') { ?>
      <div class="search-filter">
        <input type="text" class="quicksearch" placeholder="Who are you looking for?" />
        <label for="selectFilter">
        <span>Filter By Team</span>
        <select id="selectFilter">
          <option selected value="reset" class="select-reset">Filter By Team</option>
          
            <?php
              // if has rows
              if( have_rows('opt_staff_categories', 'option') ) {
                // while has rows
                while( have_rows('opt_staff_categories', 'option') ) {
                    // instantiate row
                    the_row();
                    // vars
                    $label = get_sub_field('opt_staff_category', 'option');
                    $value = get_sub_field( 'opt_staff_category_value', 'option' );?>

                     <option value="<?php echo $value; ?>"><?php echo $label; ?></option>
                <?php }
              } ?>
         
         
        </select>
        </label>

      </div> 
    <?php } ?>
    <?php if ($source == 'our-work') { ?>
      <div class="search-filter">
        <label for="selectFilter">
        <span>Filter By Project Category</span>
        <select id="selectFilter">
          <option selected value="reset" class="select-reset">Filter By Project Category</option>
          
            <?php
              // if has rows
              if( have_rows('opt_portfolio_categories', 'option') ) {
                // while has rows
                while( have_rows('opt_portfolio_categories', 'option') ) {
                    // instantiate row
                    the_row();
                    // vars
                    $label = get_sub_field('opt_portfolio_category', 'option');
                    $value = get_sub_field( 'opt_portfolio_category_value', 'option' );?>

                     <option value="<?php echo $value; ?>"><?php echo $label; ?></option>
                <?php }
              } ?>
         
         
        </select>
        </label>

      </div> 
    <?php } ?>

      <nav>
      
        <a href="#" class="item-reset" data-filter="*" class="current"><?php echo $reset_label; ?></a>
        <?php if ($source == 'staff') { ?>
          <?php 
            // if has rows
            if( have_rows('opt_staff_categories', 'option') ) {
                // while has rows
                while( have_rows('opt_staff_categories', 'option') ) {
                    // instantiate row
                    the_row();
                    // vars
                    $label = get_sub_field('opt_staff_category', 'option');
                    $value = get_sub_field( 'opt_staff_category_value', 'option' );?>
                    <a href="#" class="item-<?php echo $value; ?>" data-filter=".<?php echo $value; ?>"><?php echo $label; ?></a>
                    <?php
                }
              } ?>
          
           
  
 <?php } else if($source == 'our-work') { ?>

      <?php 
                  // if has rows
                  if( have_rows('opt_portfolio_categories', 'option') ) {
                      // while has rows
                      while( have_rows('opt_portfolio_categories', 'option') ) {
                          
                          // instantiate row
                          the_row();
                          
                          
                          // vars
                          $label = get_sub_field('opt_portfolio_category', 'option');
                          $value = get_sub_field( 'opt_portfolio_category_value', 'option' );?>
                          <a href="#" class="item-<?php echo $value; ?>" data-filter=".<?php echo $value; ?>"><?php echo $label; ?></a>
                          <?php
                          
                          
                      }
                      
                  }
                 ?>

  <?php } ?>
        </nav>
    </div>
      


    <div class="sortable-grid <?php echo $source; ?>--sortable-grid">
          

          <?php if ($source == 'staff') { ?>

              <?php   
                  $args = array(
                              'post_type' => 'staff',
                              'posts_per_page' => -1,
                              'orderby' => 'menu_order',
                              'order' => 'ASC'
                          );

                   $staff_posts = new WP_Query( $args );
                   if( $staff_posts->have_posts() ){
                      // set variables here, outside loop, if needed
                      
                     while( $staff_posts->have_posts() ){ 

                      $staff_posts->the_post();
                      $staff_image = get_field( 'staff_image', $staff_post->ID );
                      $staff_name = get_the_title($staff_post->ID);
                      $staff_title = get_field( 'staff_title', $staff_post->ID  );
                      $staff_department = get_field( 'staff_category', $staff_post->ID );
                      $staff_department = implode(' ', $staff_department);

                      $staff_first_name = explode(' ',trim($staff_name));
                      $staff_first_name = $staff_first_name[0]; 

                      // get hire date
                      $hire_date = get_field('staff_hire_date' , false, false);

                      // make date object
                      $hire_date = new DateTime($hire_date);
                      $hire_date = $hire_date->format('Y-m');
                
                      // get today's date
                      $date = date('Y-m');

                      // Create and Compare dates
                      $date = date_create($date);
                      $hire_date = date_create($hire_date);
                      $diff = date_diff($hire_date,$date);

                      // Get year value from comparison
                      $tenure =  $diff->y;

                      switch ($tenure) {
                        case $tenure >= 20:
                          $t = "20+<small>years</small>";
                          $c = "orange";
                          break;
                        case $tenure >= 10:
                          $t = "10+<small>years</small>";
                          $c = "purple";
                          break;
                        case $tenure >= 5:
                          $t = "5+<small>years</small>";
                          $c = "black";
                          break;
                        default:
                          $t = 1;
                          break;
                      }
                ?>

                <div class="sortable-grid--item <?php // echo $post_type; ?>--item <?php echo $staff_department; ?>">
                  <div class="staff--card">
                    <div class="staff--card--img img--box">
                      <img src="<?php echo $staff_image['url']; ?>" alt="<?php  echo $staff_title; ?>">
                    </div>
                    <div class="staff--card--info">
                      <?php if($tenure > 4) { ?> <i class="icn icn__tenure icn__<?php echo $c; ?>"><?php echo $t; ?></i><?php } ?>
                      <h3 class="staff--card--name"><?php  the_title($staff_post->ID); ?></h3>
                      <h4 class="staff--card--title"><?php  echo $staff_title; ?></h4>
                      <?php if (strpos($staff_department, 'leadership') !== false) { ?>
                      <p class="staff--card--url"><a href="<?php the_permalink($staff_post->ID); ?>">Read <?php echo $staff_first_name; ?>’s Bio ></a></p> 
                      <?php } ?>
                    </div>

                  </div>
                </div>
           <?php 
                }
              }
            } // end if ($source == 'staff')
          wp_reset_postdata(); ?>



          <?php if ($source == 'our-work') { ?>

              <?php   
                  $args = array(
                              'post_type' => 'work',
                              'posts_per_page' => -1,
                              'orderby' => 'menu_order',
                              'order' => 'ASC'
                          );

                   $projects = new WP_Query( $args );
                   if( $projects->have_posts() ){
                      // set variables here, outside loop, if needed
                      $i = 1;
                     while( $projects->have_posts() ){ 

                      $projects->the_post();

                      $project_url = get_field( 'project_url', $projects->ID );
                      $portfolio_category = get_field( 'portfolio_category', $projects->ID );
                      $project_type = get_field( 'project_type', $projects->ID );
                      $project_thumbnail = get_field( 'project_thumbnail', $projects->ID );
                      $project_image = get_field( 'project_image', $projects->ID );
                      $project_video = get_field( 'project_video', $projects->ID );
                      $project_player_type = get_field( 'project_player_type', $projects->ID );

                      $project_title = get_the_title();
                      $project_title = wordwrap(strtolower($project_title), 1, '-', 0);

                ?>

                <div class="sortable-grid--item <?php echo $portfolio_category; ?>">
                  <div class="our-work--card our-work--card--<?php echo $i; ?>">
                    <div class="our-work--card--img img--box" style="background-image: url('<?php echo $project_thumbnail['url']; ?>');">

                      <?php if($project_type == 'image') { ?>
                      <a data-fancybox="images" href="<?php echo $project_image['url']; ?>"></a>

                      <?php } else if($project_type == 'video') { ?>
                      <!-- <a href="<?php // the_permalink(); ?>" class="fancybox"></a> -->
                      <a data-fancybox data-type="iframe" data-src="<?php the_permalink(); ?>" href="javascript:;">
                      </a>
                    <?php } ?>
                      <!-- Captions -->
                      <!-- titles -->
                    </div>
                  </div>
                </div>
           <?php $i++; if($i > 10 ) { $i=1; }
                }
              }
            } // end if ($source == 'our-work')
          wp_reset_postdata(); ?>

    </div>
</section>