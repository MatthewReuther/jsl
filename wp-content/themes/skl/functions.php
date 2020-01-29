<?php

// turn off automatic development updates
define( 'WP_AUTO_UPDATE_CORE', false );

define('CJ_THEME_DIR', dirname(__FILE__) . DIRECTORY_SEPARATOR);
define('CJ_THEME_VERSION', time());



# Enqueue Custom Scripts
add_action( 'wp_enqueue_scripts', 'cj_enqueue_scripts' );
function cj_enqueue_scripts(){

	$dir =  get_bloginfo('stylesheet_directory');

	# enqueue jquery
	wp_enqueue_script('jquery', $dir . '/js/libs/jquery-3.3.1.min.js');

// 	wp_enqueue_script('jquery');

	# enqueue custom scripts
	wp_enqueue_script('preloads', $dir . '/js/preloads.js', '', CJ_THEME_VERSION );
	wp_enqueue_script('plugins', $dir . '/js/plugins.js', array('jquery'),  CJ_THEME_VERSION, true);
	wp_enqueue_script('gmap', '//maps.googleapis.com/maps/api/js?key=AIzaSyDdu1p0LEKWAZ5TUZtufIzOsz-iTO2Emts', array(),  CJ_THEME_VERSION, true);
	
	

	if ( is_front_page() ) {	
		wp_enqueue_script('raphael', $dir . '/js/wheelnav/raphael.min.js', array('jquery'),  CJ_THEME_VERSION, true);
		wp_enqueue_script('raphael', $dir . '/js/wheelnav/raphael.min.js', array('jquery'),  CJ_THEME_VERSION, true);
		wp_enqueue_script('raphael-icons', $dir . '/js/wheelnav/raphael.icons.min.js', array('jquery'),  CJ_THEME_VERSION, true);
		wp_enqueue_script('wheelnav', $dir . '/js/wheelnav/wheelnav.min.js', array('jquery'),  CJ_THEME_VERSION, true);
		wp_enqueue_script('wheel', $dir . '/js/wheelnav/wheel-script.js', array('jquery'),  CJ_THEME_VERSION, true);
	}
	
	
	wp_enqueue_script('wow', $dir . '/js/wow.min.js', array('jquery'),  CJ_THEME_VERSION, true);
	wp_enqueue_script('scripts', $dir . '/js/scripts.js', array('jquery', 'gmap'),  CJ_THEME_VERSION, true);
   


  // wp_script_add_data( 'scripts', 'async', true );
  wp_script_add_data( 'scripts', 'defer', true );
  // wp_script_add_data( 'gmap', 'async', true );
  wp_script_add_data( 'gmap', 'defer', true );

	if ( is_singular() ) {
		wp_enqueue_script( 'comment-reply' );
	}

	# enqueue custom styles
    wp_enqueue_style( 'bootstrap', $dir . '/css/bootstrap.css', array(), CJ_THEME_VERSION );
    wp_enqueue_style( 'typekit', '//use.typekit.net/spi8lxm.css', array(), CJ_THEME_VERSION );
	wp_enqueue_style( 'style', $dir . '/style.css', array(), CJ_THEME_VERSION );
	wp_enqueue_style( 'slick', $dir . '/css/slick.css', array(), CJ_THEME_VERSION );
	wp_enqueue_style( 'rotating-slider', $dir . '/css/rotating-slider.css', array(), CJ_THEME_VERSION );
	// wp_enqueue_style( 'vzaar', $dir . '/css/vzaar.css', array(), CJ_THEME_VERSION );
}                                                                                                                            

// Create ACF Options Page
if( function_exists('acf_add_options_page') ) {
  acf_add_options_page();
}


// Hide content editor on pages
function reset_editor()
{
     global $_wp_post_type_features;

     $post_type="page";
     $feature = "editor";
     if ( !isset($_wp_post_type_features[$post_type]) )
     {

     }
     elseif ( isset($_wp_post_type_features[$post_type][$feature]) )
     unset($_wp_post_type_features[$post_type][$feature]);
}

add_action("init","reset_editor");


// [cjedit id="1" detail="all"]
function cjedit_func( $atts ) {
  extract( shortcode_atts( array(
    'id' => '0',
    'detail' => 'all',
  ), $atts ) );
  
  $id = "{$id}";
  $detail = "{$detail}";

  if (! $id) {
    return "No article specified.";
  }

  return file_get_contents("//www.cjadvertising.com/cjedit/output.php?id=$id&detail=$detail");

}
add_shortcode( 'cjedit', 'cjedit_func' );

// allow Editor role to access options - primarily for WordPress SEO and menu editing
function add_theme_caps() {
	$role = get_role( 'editor' );
	$role->add_cap( 'edit_files' );
	$role->add_cap( 'edit_theme_options' );
	$role->add_cap( 'manage_options' );
}
add_action( 'admin_init', 'add_theme_caps');


// [vzaar id="12345" format="widescreen" class="customCSSclass" playlist="true"]
function vzaar_func( $atts ) {
  extract( shortcode_atts( array(
    'id' => '0',
    'class' => '',
    'layout' => '',
    'format' => '',
    'playlist' => true
  ), $atts ) );

  // set shortcode variables
  $class = "{$class}";
  $id = "{$id}";
  $format = "{$format}";
  $layout = "{$layout}";
  $playlist = "{$playlist}";

  // check if is_flag function exists to use "playlist" parameter as a flag
  if (function_exists("is_flag")) {
    if (is_flag('playlist', $atts))
      $format = "playlist";
  }

  // else, check if playlist set as true or yes
  else if (strtolower($playlist) == "true" || strtolower($playlist) == "yes") {
    $format = "playlist";
  }

  // assign aspect ratio class based on video format
  switch ($format) {
      case 'standard':
      case '4x3':
      $aspect = "4x3";
          break;
    case 'widescreen':
    case '16x9':
      $aspect = "16x9";
      break;
    case 'playlist':
      $aspect = "playlist";
      break;
    case 'multiplayer':
      $aspect = 'playlist';
      default:
        $aspect = "16x9";
  }
  switch ($layout) {
      case 'c':
          $val = "collapsible";
          break;
      case 'collapsible':
          $val = "collapsible";
          break;
      default:
        $val = "";
  }

  $layout = $val;

  if ($aspect == "playlist") {
    $markup = "<iframe id='vzpl-$id' name='vzpl-$id' title='video player' class='video player' type='text/html'  frameborder='0' allowFullScreen allowTransparency='true' mozallowfullscreen webkitAllowFullScreen src='//view.vzaar.com/playlists/$id'></iframe>";
  }

  else {
    $markup = "<div class='video-container'><iframe id='vzvd-$id' name='vzvd-$id' title='video player' class='video-player' type='text/html' frameborder='0' allowFullScreen allowTransparency='true' mozallowfullscreen webkitAllowFullScreen src='//view.vzaar.com/$id/player?apiOn=true'></iframe></div>";
  }
  if ($layout == "collapsible") {

    $temp = "<div class='video-container'><span class='video-toggle'>Watch Video</span>$markup</div>";
    $markup = $temp;
  }
  return $markup;
}
add_shortcode( 'vzaar', 'vzaar_func' );


function format_my_number($atts) {
    $num = $atts["value"];

      
      
    return number_format($num, 0, '.', ',');
}
add_shortcode("custom-number-format", "format_my_number");


// function to truncate text strings, namely post titles
function shorten($string, $len) {
	$short_string = substr($string, 0, $len);
	if (strlen($short_string) < strlen($string))
		$short_string .= '...';
	return $short_string;
}




// register sidebar for widgets
if ( function_exists('register_sidebar') )
    register_sidebar(array(
        'before_widget' => '<section class="menu-container"><nav class="menu">',
        'after_widget' => '</nav></section>',
        'before_title' => '<h2>',
        'after_title' => '</h2>',
    ));





function register_my_menus() {
  register_nav_menus(
    array(
      'main-menu' => __( 'Main Menu' ),
      'footer-menu' => __( 'Footer Navigation' ),
      'social-menu' => __( 'Social Media Navigation' )
    )
  );
}
add_action( 'init', 'register_my_menus' );



function add_cta_form($atts){
  extract( shortcode_atts( array(
    'kind' => 'true',
    'title' => 'true',
    'description' => 'true'
  ), $atts ) );

  $kind = "{$kind}";
  $title = "{$title}";
  $description = "{$description}";


  if ($kind)
	  $cta_form = "
	  	<div class='form-container $kind'>
	  		<h2>Get a Free Case Review</h2>
	  		<script src='https://app-ab24.marketo.com/js/forms2/js/forms2.min.js'></script>
			<form id='mktoForm_1337'></form>
			<script>MktoForms2.loadForm('https://app-ab24.marketo.com', '795-XMT-246', 1337);</script>
		</div>";
  else
	  $cta_form = '
	  	<div class="form-container">
	  		<h2>Get a Free Case Review</h2>
	  		<script src="https://app-ab24.marketo.com/js/forms2/js/forms2.min.js"></script>
			<form id="mktoForm_1337"></form>
			<script>MktoForms2.loadForm("https://app-ab24.marketo.com", "795-XMT-246", 1337);</script>
		</div>';
  
  return $cta_form;
}

add_shortcode( 'cta_form', 'add_cta_form' );


// [button link="http://domain.com"]
// [btn kind="round" style="font-weight: 400;"  color="white inverted" link="/practice-areas/"]Cases[/btn]
function shortcode_button( $atts, $content = null  ) {
  extract( shortcode_atts( array(
    'link' => '',
    'target' => '',
    'style' => '',
    'kind' => '',
    'color' => 'transparent'
  ), $atts ) );
  
  $link = "{$link}";
  $color = "{$color}";
  $kind = "{$kind}";
  $style = "{$style}";


  if ($link)
    $markup = "<a class='btn $color $kind' style='$style' href='$link' target='$target'>$content</a>";
     
  else
    $markup = "<button type='button' class='btn $color'>$content</button>";
    
  return $markup;

}
add_shortcode( 'btn', 'shortcode_button' );






add_shortcode( 'list_subpages', 'add_subpages' );


function add_phone(){
  $phone = get_field( 'phone_number', 'options' );
  $phone = "<a href='tel:$phone' class='tel'>$phone</a>";
return $phone;
}

add_shortcode( 'phone', 'add_phone' );




function add_address(){
  $address = get_field( 'address', 'options' );
  $address = "<div class='vcard'>
 <div class='adr'>
 <a href='$address[google_map_link]' target='_blank' rel='nofollow'>
  <div class='street-address'>$address[street_address]</div>
  <span class='locality'>$address[locality]</span>, <span class='region'>WI</span> <span class='postal-code'>$address[postal_code]</span>
  </div></a>
  </div>";
return $address;
}

add_shortcode( 'address', 'add_address' );




function my_post_count_queries( $query ) {
  if (!is_admin() && $query->is_main_query()){
    if(is_home()){
       $query->set('posts_per_page', 1);
    }
  }
}
add_action( 'pre_get_posts', 'my_post_count_queries' );


/*********************************************************************/
/******** TRANSFORMS LARGE NUMBERS TO READABLE NUMBERS **************/
/*******************************************************************/
function nice_number($n) {
    // first strip any formatting;
    $n = (0+str_replace(",", "", $n));

    // is this a number?
    if (!is_numeric($n)) return false;

    // now filter it;
    if ($n > 1000000000000) return round(($n/1000000000000), 2).' Trillion';
    elseif ($n > 1000000000) return round(($n/1000000000), 2).' Billion';
    elseif ($n > 1000000) return round(($n/1000000), 2).' Million';
   
    return number_format($n);
}







/***********************************************/
/******** ADD FEATURED IMAGE TO POSTS *********/
/**********************************************/
add_theme_support( 'post-thumbnails' );

/***********************************************/
/******** ALLOW SVGS IN MEDIA LIBRARY *********/
/**********************************************/


// ALLOW UPLOAD OF SVGS IN MEDIA LIBRARY
function add_file_types_to_uploads($file_types){
	$new_filetypes = array();
	$new_filetypes['svg'] = 'image/svg+xml';
	$file_types = array_merge($file_types, $new_filetypes );
	return $file_types;
}
add_action('upload_mimes', 'add_file_types_to_uploads');









// Custom Post Types

function staff_admin_menu() {
    add_menu_page(
        'Staff Members',
        'Staff Members',
        'read',
        'staff-members',
        '', // Callback, leave empty
        'dashicons-groups',
        8 // Position
    );
}

add_action( 'admin_menu', 'staff_admin_menu' );

// Attorney overview Staff Image Custom Post Type
function cj_attorney() {
  $labels = array(
    'name'               => _x( 'Attorneys', 'post type general name' ),
    'singular_name'      => _x( 'Attorney', 'post type singular name' ),
    'add_new'            => _x( 'Add New', 'Attorney' ),
    'add_new_item'       => __( 'Add New Attorney' ),
    'edit_item'          => __( 'Edit Attorney' ),
    'new_item'           => __( 'New Attorney' ),
    'all_items'          => __( 'All Attorneys' ),
    'menu_name'          => 'Attorneys'
  );
  $rewrite = array(
  	'slug' => 'about-us/attorneys',
  	'with_front' => false,
  );
  $args = array(
  	'rewrite'       => $rewrite,
    'labels'        => $labels,
    'hierarchical'        => true, // just to get parent child relationships with your custom post [but you already knew this part]
    'description'   => 'Holds our attorney images, titles and email address.',
    'menu_icon' => 'dashicons-groups',
    'show_in_menu' => 'staff-members',
    'public'        => true,
    'menu_position' => 8,
    'supports'      => array( 'title', 'editor', 'thumbnail', 'page-attributes' ),
    'has_archive'   => false,
  );
  register_post_type( 'attorney', $args ); 
}
add_action( 'init', 'cj_attorney' );



function cj_staff() {
  $labels = array(
    'name'               => _x( 'Staff', 'post type general name' ),
    'singular_name'      => _x( 'Staff Member', 'post type singular name' ),
    'add_new'            => _x( 'Add New', 'Staff Member' ),
    'add_new_item'       => __( 'Add New Staff Member' ),
    'edit_item'          => __( 'Edit Staff Member' ),
    'new_item'           => __( 'New Staff Member' ),
    'all_items'          => __( 'All Staff Members' ),
  
    'menu_name'          => 'Staff Members'
  );
  $rewrite = array(
  	'slug' => 'about-us/staff',
  	'with_front' => false,
  );
  $args = array(
  	'rewrite'       => $rewrite,
    'labels'        => $labels,
    'hierarchical'        => true, // just to get parent child relationships with your custom post [but you already knew this part]
    'description'   => 'Holds our attorney images, titles and email address.',
    'menu_icon' => 'dashicons-groups',
    'show_in_menu' => 'staff-members',
    'public'        => true,
    'menu_position' => 8,
    'supports'      => array( 'title', 'editor', 'thumbnail', 'page-attributes' ),
    'has_archive'   => false,
  );
  register_post_type( 'staff', $args ); 
}
add_action( 'init', 'cj_staff' );


// Testimonials Custom Post Type
function cj_testimonial() {
  $labels = array(
    'name'               => _x( 'Testimonials', 'post type general name' ),
    'singular_name'      => _x( 'Testimonial', 'post type singular name' ),
    'add_new'            => _x( 'Add New', 'Testimonial' ),
    'add_new_item'       => __( 'Add New Testimonial' ),
    'edit_item'          => __( 'Edit Testimonial' ),
    'new_item'           => __( 'New Testimonial' ),
    'all_items'          => __( 'All Testimonials' ),
    'menu_name'          => 'Testimonials'
  );
  $rewrite = array(
  	'slug' => 'about-us/our-testimonial',
  	'with_front' => false,
  );
  $args = array(
  	'rewrite'       => $rewrite,
    'labels'        => $labels,
    'hierarchical'        => true, // just to get parent child relationships with your custom post [but you already knew this part]
    'description'   => 'Holds our attorney images, titles and email address.',
    'menu_icon' => 'dashicons-format-quote',
    'public'        => true,
    'menu_position' => 8,
    'supports'      => array( 'title', 'thumbnail', 'page-attributes' ),
    'has_archive'   => false,
  );
  register_post_type( 'testimonial', $args ); 
}
add_action( 'init', 'cj_testimonial' );

// Case Result Custom Post Type
function cj_case_result() {
  $labels = array(
    'name'               => _x( 'Case Results', 'post type general name' ),
    'singular_name'      => _x( 'Case Result', 'post type singular name' ),
    'add_new'            => _x( 'Add New', 'Case Result' ),
    'add_new_item'       => __( 'Add New Case Result' ),
    'edit_item'          => __( 'Edit Case Result' ),
    'new_item'           => __( 'New Case Result' ),
    'all_items'          => __( 'All Case Results' ),
    'menu_name'          => 'Case Results'
  );
  $rewrite = array(
  	'slug' => 'about-us/our-results',
  	'with_front' => false,
  );
  $args = array(
  	'rewrite'       => $rewrite,
    'labels'        => $labels,
    'hierarchical'        => true, // just to get parent child relationships with your custom post [but you already knew this part]
    'description'   => 'Holds our attorney images, titles and email address.',
    'menu_icon' => 'dashicons-portfolio',
    'public'        => true,
    'menu_position' => 7,
    'supports'      => array( 'title', 'thumbnail' ),
    'has_archive'   => false,
  );
  register_post_type( 'case_result', $args ); 
}
add_action( 'init', 'cj_case_result' );

// Video Custom Post Type
function cj_video() {
  $labels = array(
    'name'               => _x( 'Videos', 'post type general name' ),
    'singular_name'      => _x( 'Video', 'post type singular name' ),
    'add_new'            => _x( 'Add New', 'Video' ),
    'add_new_item'       => __( 'Add New Video' ),
    'edit_item'          => __( 'Edit Video' ),
    'new_item'           => __( 'New Videos' ),
    'all_items'          => __( 'All Videos' ),
    'menu_name'          => 'Videos'
  );
  $rewrite = array(
  	'slug' => 'about-us/our-videos',
  	'with_front' => false,
  );
  $args = array(
  	'rewrite'       => $rewrite,
    'labels'        => $labels,
    'hierarchical'        => true, // just to get parent child relationships with your custom post [but you already knew this part]
    'description'   => 'Holds our attorney images, titles and email address.',
    'menu_icon' => 'dashicons-format-video',
    'public'        => true,
    'menu_position' => 7,
    'supports'      => array( 'title', 'thumbnail' ),
    'has_archive'   => false,
  );
  register_post_type( 'video', $args ); 
}
add_action( 'init', 'cj_video' );





/***********************************************/
/************** cjVote Tool *******************/
/**********************************************/
	/**** cjVote Tool ***/
	$webhook_url = "https://www.cjintegrateddigital.com/marketo/index.php";
	$site_url = "https://www.sklaw.com/blog/poll/skl-name-the-knight/";
	$programName = "SKL_19_02_NameTheKnight_Campaign";
	$client_id = "6";
	$totalpoll_id = 2032;
	
	
	$gfVotingFormID = 1;
	$gfVotingFirstNameID = '1';
	$gfVotingLastNameID = '2';
	$gfVotingEmailID = '3';
	$gfVotingPhoneID = '4';
	$gfVotingNominationID = '5';

	
	add_action( 'gform_after_submission', 'submit_vote', 10, 2 );
	add_action( "totalpoll/actions/poll/vote", 'poll_vote', 10, 3);
// 	add_action( 'gform_after_submission', 'add_nomination', 10, 2 );
	add_action( 'gform_after_update_entry', 'update_nomination', 10, 1 );
	add_action('wp_trash_post', 'hide_nomination');
	add_action('gform_delete_entry', 'hide_nomination');
	
	add_action( 'acf/save_post', 'update_entry_id', 20, 1 );
	add_action( 'transition_post_status', 'status_change', 10, 3 );
	
	
	
	function poll_vote(TP_Poll $poll, $log) {
		global $webhook_url, $programName, $client_id;

		if ( $poll !== false ) {
			$fields = $poll->fields()->to_array();
			$post = array();
			
			$post["client_id"] = $client_id;
			$post["program"] = $programName;
	    	$post["source"] = "site";
			$post["firstName"] = $fields['cjvote_poll_fname'];
			$post["lastName"] = $fields['cjvote_poll_lname'];
			$post["email"] = $fields['cjvote_poll_email'];
			$post["phone"] = $fields['cjvote_poll_phone'];
			
		
			$notificationEmail = "jray@cjadvertising.com, mreuther@cjadvertising.com";
			$headers  = "MIME-Version: 1.0\r\n";
			$headers .= "Content-type: text/html; charset=iso-8859-1\r\n";
			$headers .= "From: \"Legacy Server\" <www@cjadvertising.com>";
			mail("$notificationEmail", "Poll Call - Data", "Received Data: " . json_encode($fields) . "Sent Data: " . json_encode($post) , $headers);
			
			$url = $webhook_url;
			$ch = curl_init($url);
	
			curl_setopt($ch,  CURLOPT_RETURNTRANSFER, 1);
			curl_setopt($ch, CURLOPT_HTTPHEADER, array('accept: application/json','Content-Type: application/json'));
			curl_setopt($ch, CURLOPT_POST, 1);
			curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($post));
			curl_getinfo($ch);
			$response = curl_exec($ch);
		    $responseInfo = curl_getinfo($ch);
			curl_close($ch);			
			
		}
	}
	
		
	
	$totalpoll_entry_id = 0;
	function update_entry_id($post) {
		global $totalpoll_entry_id;
		$ID = $_POST["ID"]; 
		update_field("cjvote_totalpoll_entry_id", $totalpoll_entry_id, $ID);
	} 
	
	function update_nomination($post) {
		global $webhook_url, $programName, $client_id, $totalpoll_id;
		
		if(isset($_POST) && $_POST["post_type"] == "cj_nomination") {
			$fields = $_POST["acf"];
			$ID = $_POST["ID"];
			
			$post = array(); 
			
			$post["client_id"] = $client_id;
			$post["program"] = $programName;
	    	$post["email"] = get_field("cjVote_nomination_email", $ID);
			$post["action"] = "update";
			 
			
			$api = TotalPoll::instance();
			
			$poll = $api->poll($totalpoll_id);
			if($poll == NULL) {
				$poll = TotalPoll::poll($totalpoll_id);
				if($poll == NULL) return;
			}
			
			$url = $webhook_url;
			$ch = curl_init($url);
	
			curl_setopt($ch,  CURLOPT_RETURNTRANSFER, 1);
			curl_setopt($ch, CURLOPT_HTTPHEADER, array('accept: application/json','Content-Type: application/json'));
			curl_setopt($ch, CURLOPT_POST, 1);
			curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($post));
			curl_getinfo($ch);
			$response = curl_exec($ch);
			curl_close($ch);
	
			$choice_result = -1;
			$search = "[".$ID."]";
			foreach($poll->choices(false, false) as $val) {
				if($val["content"]["label"] == null) return;
				
				if(strpos($val["content"]["label"], $search) != FALSE) $choice_result = $val["index"];
				if($choice_result != -1) break;
			}
	
			if($choice_result == -1) {
	
				$choice = array();  
				$choice["content"]["label"] = "Vote for " . get_field("cjVote_nomination_contact_fname", $ID) . " ". get_field("cjVote_nomination_contact_lname", $ID) . " [" . $ID . "]";
				$choice["content"]["type"] = "html";
				$choice['content']['visible'] = true;
	
				global $totalpoll_entry_id;
				$totalpoll_entry_id = count($poll->choices(false, false));
				

				$poll->insert_choice($choice, true);
			
			} else {
				TogglePollChoice($totalpoll_id, $choice_result, true);
			}
		}
	}
	
	function submit_vote( $entry, $form ) {
		global $site_url;
		

		$entry_value = rgar( $entry, '5' );
		
		$poll_index = SearchPollIndex($entry_value);
		
		$url = $site_url . "?totalpoll[action]=vote&totalpoll[view]=vote&totalpoll[page]=1&totalpoll[choices][0]=".$poll_index."&totalpoll[fields][cjvote_poll_fname]=".urlencode(rgar( $entry, '1' ))."&totalpoll[fields][cjvote_poll_lname]=".urlencode(rgar( $entry, '2' ))."&totalpoll[fields][cjvote_poll_email]=".urlencode(rgar( $entry, '3' ));
		
		//echo $url;
		
	    $ch = curl_init($url);
			
		curl_setopt($ch,  CURLOPT_RETURNTRANSFER, 1);
		
		$response = curl_exec($ch);
		curl_close($ch);
		
		mail("jray@cjadvertising.com, mreuther@cjadvertising.com", "GForm After Submission Call", "Succeeded" , "MIME-Version: 1.0\r\nContent-type: text/html; charset=iso-8859-1\r\nFrom: \"Legacy Server\" <www@cjadvertising.com>");
	}
	
	function hide_nomination($post_id) {
		global $post, $webhook_url, $programName, $client_id, $totalpoll_id;
	    $post_type = $post->post_type;
		
		if(isset($_POST) && ($_POST["post_type"] == "cjvote" || $post_type == "cjvote")) {
			$ID = $_POST["ID"];
			if($ID == null || $ID == "")
				$ID = $post_id;
			
			$api = TotalPoll::instance();
			
			$poll = $api->poll($totalpoll_id);
			if($poll == NULL) {
				$poll = TotalPoll::poll($totalpoll_id);
				if($poll == NULL) return;
			}
			
			$choice_result = -1;
			$search = "[".$ID."]";
			foreach($poll->choices(false, false) as $val) {
				if(strpos($val["content"]["label"], $search) != FALSE) $choice_result = $val["index"];
				if($choice_result != -1) break;
			}
			
			if($choice_result == -1) {
			
				$choice = array();  
				$choice["content"]["label"] = "Vote for " . get_field("cjVote_nomination_contact_fname", $ID) . " ". get_field("cjVote_nomination_contact_lname", $ID) . " [" . $ID . "]";
				$choice["content"]["type"] = "html";
				$choice['content']['visible'] = false;
				
				global $totalpoll_entry_id;
				$totalpoll_entry_id = count($poll->choices(false, false));
				

				$poll->insert_choice($choice, false);
			
			} else {
				TogglePollChoice($totalpoll_id, $choice_result, false);
			}
		}
	}
	
	
	function SearchPollIndex($id) {
		global $totalpoll_id;
		
		$search = $id;
		
		$api = TotalPoll::instance();
			
		$poll = $api->poll($totalpoll_id);
		if($poll == NULL) {
			$poll = TotalPoll::poll($totalpoll_id);
			if($poll == NULL) return -1;
		}
		
		foreach($poll->choices(false, false) as $val) {
			if(strstr($val["content"]["label"], $search)) return $val["index"];
		}
		
		return -1;
	}
	
	function TogglePollChoice($id, $index, $visible) {
		$choice_content = (array) get_post_meta( $id, "choice_".$index."_content", true );
		
		$choice_content['visible'] = $visible;
		
		$ret = update_post_meta( $id, "choice_".$index."_content", $choice_content );
	
	}
	
	
	
	
	
	
	








?>
