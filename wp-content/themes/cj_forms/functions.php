<?php

// turn off automatic development updates
define( 'WP_AUTO_UPDATE_CORE', false );

define('CJ_THEME_DIR', dirname(__FILE__) . DIRECTORY_SEPARATOR);
define('CJ_THEME_VERSION', '2018.03.05'); // change here to force cache refresh


# Enqueue Custom Scripts
add_action( 'wp_enqueue_scripts', 'cj_enqueue_scripts' );
function cj_enqueue_scripts(){
	
	$dir =  get_bloginfo('stylesheet_directory');

	# enqueue jquery
	wp_enqueue_script('jquery');

	# enqueue custom scripts	
	wp_enqueue_script('preloads', $dir . '/js/preloads.js', '', CJ_THEME_VERSION );
	wp_enqueue_script('plugins', $dir . '/js/plugins.js', array('jquery'),  CJ_THEME_VERSION, true);
	wp_enqueue_script('scripts', $dir . '/js/scripts.js', array('jquery'),  CJ_THEME_VERSION, true);
	/* wp_enqueue_script('ngage', 'https://messenger.ngageics.com/ilnksrvr.aspx?websiteid=144-158-219-139-107-150-192-202', true);
	*/

	if ( is_singular() ) {
		wp_enqueue_script( 'comment-reply' );		
	} 
	
	/* # enqueue TypeKit
	 wp_enqueue_script('theme_typekit', '//use.typekit.net/sqy2ldv.js' );
  */
	# enqueue custom styles
	wp_enqueue_style( 'style', $dir . '/style.css', array(), CJ_THEME_VERSION );
}

/*
function theme_typekit_inline() {
  if ( wp_script_is( 'theme_typekit', 'done' ) ) { ?>
  	<script type="text/javascript">try{Typekit.load();}catch(e){}</script>
<?php } }
add_action( 'wp_head', 'theme_typekit_inline' );
*/

// allow Editor role to access options - primarily for WordPress SEO and menu editing
function add_theme_caps() {
	$role = get_role( 'editor' );
	$role->add_cap( 'edit_files' );
	$role->add_cap( 'edit_theme_options' );
	$role->add_cap( 'manage_options' );
}
add_action( 'admin_init', 'add_theme_caps');



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

	return file_get_contents("http://www.cjadvertising.com/cjedit/output.php?id=$id&detail=$detail");

}
add_shortcode( 'cjedit', 'cjedit_func' );




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
        'before_title' => '<h3>',
        'after_title' => '</h3>',
    ));


function register_my_menus() {
  register_nav_menus(
    array(
      'navigation-menu' => __( 'Navigation Menu' ),
      'footer-menu' => __( 'Footer Navigation' )
    )
  );
}
add_action( 'init', 'register_my_menus' );


function add_cta_form(){
	$cta_form = '<div class="form small-form"><h3 class="h-form">Free Consultation</h3><form name="" class="contact-form clearfix" action="http://www.cjadvertising.com/forms/submit.php" method="post"><input type="hidden" name="title" value="" /><input type="hidden" name="formuser" value="" /><div class="control-col"><div class="form-group"><input class="required" name="name" type="text" placeholder="Full Name" /></div><div class="form-group"><input class="required" name="phone" type="text" placeholder="Phone Number" /></div><div class="form-group"><input class="required" name="email_address" type="text" placeholder="Email" /></div></div><div class="control-col"><div class="form-group"><textarea name="comments" id="comment" placeholder="Tell us what happened" rows="4"></textarea></div><input type="submit" value="Get Help Now" /></div></form></div>';
return $cta_form;
}

add_shortcode( 'cta_form', 'add_cta_form' );


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
  // $rewrite = array(
  // 	'slug' => 'our-team/attorneys',
  // 	'with_front' => false,
  // );
  $args = array(
  	// 'rewrite'       => $rewrite,
    'labels'        => $labels,
    'description'   => 'Holds our attorney images, titles and email address.',
    'menu_icon' => 'dashicons-businessman',
    'public'        => true,
    'menu_position' => 8,
    'supports'      => array( 'title', 'editor', 'thumbnail', 'page-attributes' ),
    'has_archive'   => false,
  );
  register_post_type( 'attorney', $args ); 
}
add_action( 'init', 'cj_attorney' );



?>