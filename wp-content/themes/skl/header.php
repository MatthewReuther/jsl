<!doctype html>
<!-- START HTML OPEN -->
<!--[if IE 6]> <html class="no-js ie ie6 lt-ie7 lt-ie8 lt-ie9" lang="en"> <![endif]-->
<!--[if IE 7]> <html class="no-js ie ie7 lt-ie8 lt-ie9" lang="en"> <![endif]-->
<!--[if IE 8]> <html class="no-js ie ie8 lt-ie9" lang="en"> <![endif]-->
<!--[if IE 9]> <html class="no-js ie ie9" lang="en"> <![endif]-->
<!--[if gt IE 9]> <html class="no-js ie" lang="en"> <![endif]-->
<!--[if !(IE)]><!--> <html class="no-js" lang="en"> <!--<![endif]-->
<!-- END HTML OPEN -->

<head>

	<title>
	<?php wp_title(''); ?>
	</title>

	<!-- META -->
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<meta name="viewport" content="width=device-width, initial-scale=1">

	<!-- FAVICON -->
	<link rel="shortcut icon" href="<?php bloginfo('template_directory');?>/favicon.ico" type="image/x-icon">
	<link rel="icon" href="<?php bloginfo('template_directory');?>/favicon.ico" type="image/x-icon">
	<script src="<?php bloginfo('template_directory');?>/js/libs/jquery-3.3.1.min.js" type="text/javascript"></script>
</head>
	<!-- IMPORT FONTS -->



    <!-- Facebook Pixel Code -->
    <script>
     !function(f,b,e,v,n,t,s)
     {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
     n.callMethod.apply(n,arguments):n.queue.push(arguments)};
     if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
     n.queue=[];t=b.createElement(e);t.async=!0;
     t.src=v;s=b.getElementsByTagName(e)[0];
     s.parentNode.insertBefore(t,s)}(window, document,'script',
     'https://connect.facebook.net/en_US/fbevents.js');
     fbq('init', '779470995756167');
     fbq('track', 'PageView');
     fbq('track', 'Lead'); 
    </script>
    <noscript><img height="1" width="1" style="display:none"
     src="https://www.facebook.com/tr?id=779470995756167&ev=PageView&noscript=1
    https://www.facebook.com/tr?id=779470995756167&ev=PageView&noscript=1
    "
    /></noscript>
    <!-- End Facebook Pixel Code -->

	<?php wp_head(); ?>
</head>
<?php
if (is_front_page())
	$template_class .= " page--home";
else
	$template_class .= " page--sub"

?>

<?php 

if( is_home() || is_category() || is_single()) { 
	
$banner_image = get_field('banner_image', get_option('page_for_posts'));
$banner_title = get_field( 'banner_title', get_option('page_for_posts'));
$banner_content = get_field( 'banner_content', get_option('page_for_posts'));
$banner_overlay = get_field( 'banner_overlay', get_option('page_for_posts'));
$phone_number =  get_field( 'phone_number', 'options' );
$banner_image_tablet =  get_field( 'banner_tablet_image', get_option('page_for_posts'));
$banner_image_mobile =  get_field( 'banner_mobile_image', get_option('page_for_posts'));
$generic_banner =  get_field( 'option_banner_image', 'options', get_option('page_for_posts'));
$main_content_bg_img =  get_field('main_content_bg_img', get_option('page_for_posts'));
$main_content_bg_img_tablet =  get_field('main_content_bg_img_tablet', get_option('page_for_posts'));
$main_content_bg_img_mobile =  get_field('main_content_bg_img_mobile', get_option('page_for_posts'));
$main_content_bg_color =  get_field('main_content_bg_color', get_option('page_for_posts'));
$banner_transparent =  get_field('banner_transparent', get_option('page_for_posts'));
$offset =  get_field('offset_content', get_option('page_for_posts'));
	
	
} else {
	$banner_image = get_field('banner_image');
	$banner_title = get_field( 'banner_title' );
	$banner_content = get_field( 'banner_content' );
	$banner_overlay = get_field( 'banner_overlay');
	$banner_bg_color =  get_field( 'banner_background_color' );	
	$generic_banner =  get_field( 'option_banner_image', 'options' );	
	$banner_image_tablet =  get_field( 'banner_tablet_image' );
	$banner_image_mobile =  get_field( 'banner_mobile_image' );
	$main_content_bg_img =  get_field('main_content_bg_img');
	$main_content_bg_img_tablet =  get_field('main_content_bg_img_tablet');
	$main_content_bg_img_mobile =  get_field('main_content_bg_img_mobile');
	$main_content_bg_color =  get_field('main_content_bg_color');
	$banner_transparent =  get_field('banner_transparent');
	$offset =  get_field('offset_content');	
	

	// $color_overlay = get_field('color_overlay'); 
	if(get_field('use_parent_banner_image')) { 
		global $post; 
		$parent_id = $post->post_parent; 
		$banner_image = get_field('banner_image', $parent_id);
		// $color_overlay = get_field('color_overlay', $parent_id);
	}  
} 


?>

<body <?php $page_slug = 'page-'.$post->post_name; body_class("page blog $template_class $page_slug"); ?>>
	<?php if ( function_exists( 'gtm4wp_the_gtm_tag' ) ) { gtm4wp_the_gtm_tag(); } ?>
	<!-- START CHROME FRAME -->
	<!-- Prompt IE 6 users to install Chrome Frame. Remove this if you support IE 6.
	chromium.org/developers/how-tos/chrome-frame-getting-started -->
	<!--[if lt IE 7]><p class=chromeframe>Your browser is <em>ancient!</em> <a href="http://browsehappy.com/">Upgrade to a different browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">install Google Chrome Frame</a> to experience this site.</p><![endif]-->
	<!-- END CHROME FRAME -->
	<?php include('svg-defs.svg'); ?>
	<div class="page-container" id="welcome">

		<div id="toTopBar" class="">
			
			<a href="tel:1-866-909-6894" class="cta phone">
				<div class="overlay"></div>
				<icn class="icn-cta-phone"></icn>
			</a>
			<a href="#welcome" class="cta to-top">
				<div class="overlay"></div>
				<icn class="icn-cta-to-top"></icn>
			</a>
			
			<a href="/#get-help" class="cta">
				<div class="overlay"></div>
				<icn class="icn-cta-email"></icn>
			</a>	

		</div>
	
		<?php if (is_front_page()) { ?>
			<div class="banner-container <?php // echo $color_overlay; ?>-overlay" <?php if (!empty($banner_image)) { ?>style="background-image: url('<?php echo $banner_image['url']; ?>');" <?php } ?>>
			
			
				<?php if(!empty($banner_image_tablet)) {?>
				
					<style>
					    @media only screen and (max-width: 1179px) {
					     .banner-container {
					       background-image: url('<?php echo $banner_image_tablet['url']; ?>') !important;
					       background-position: center top;
					     }
					    }
				  </style>
				
				<?php } ?>
				
				
				<?php if(!empty($banner_image_mobile)) {?>
				
					<style>
					    @media only screen and (max-width: 479px) {
					     .banner-container {
					       background-image: url('<?php echo $banner_image_mobile['url']; ?>') !important;
					       background-position: 62% !important;
					       
					     }
					    }
				  </style>
				
				<?php } ?>
				
					
			
	
				<header>
					

					
					<div class="header-container home">

						<div class="cta-container mobile">
							<div class="frame-main clearfix">
								
									<span>24/7 Free Consultation<a href="tel:1-877-281-6712">1-877-281-6712</a></span>
								
								
							</div>
						</div>
					
						<div class="frame-main frame-header clearfix">
							<div class="inner-wrap clearfix">

								
									
									
									<div class="branding-container">
										<a class="branding-logo" href="/">
											<img class="logo" src="<?php bloginfo('template_directory');?>/img/logo/JSL-logo-update-whiteblue.svg" alt="<?php bloginfo('name'); ?>" />
											<img class="logo active" src="<?php bloginfo('template_directory');?>/img/logo/JSL-blue-logo.png" alt="<?php bloginfo('name'); ?>" />
										</a>	
									</div>
									
									
	
									<nav role="navigation" class="navigation navigation-desktop clearfix ">
									    
									      <?php wp_nav_menu( array('theme_location' => 'main-menu', 'menu_class' => 'menu clearfix', 'container' => '') ); ?>
										 
									</nav>
	
									
									
									<div class="cta-container">
									
										<div class="cta-text">
											<span>24/7 Free Consultation</span>
										</div>
									
										
										<div class="cta-phone">
											<a href="tel:1-877-281-6712">1-877-281-6712</a>
										</div>
									</div>
									
												
								
								
									
	
	
									<div class="mobile-menu-container">
										<div class="menu-mobile-toggle">
											<i class="icon"></i>
										</div>
										<nav role="navigation" class="navigation navigation-mobile clearfix ">
									    
									      <?php wp_nav_menu( array('theme_location' => 'main-menu', 'menu_class' => 'menu-mobile', 'container' => '') ); ?>
		
										 
										</nav>	
									</div>	
	
		
	
									
		
									
									
		 
									
							
							</div><!-- /.inner-wrap -->
						</div><!-- /.frame -->
						
						
						
					</header>
					
					<div class="frame-main frame-banner clearfix">
						<div class="banner-content clearfix">
										<?php if(!empty($banner_title)) { echo "<h2 class='feature--title'>$banner_title</h2>"; }?>
								
											<?php $attorney_image = get_field( 'attorney_image' );?>
											
								
											<?php echo "<div class='feature--content'>$banner_content</div>"; ?>
							
						</div>
						<div class="get-help-wrapper">
							<a class="get-help-icon" href="#get-help"><icn class="icn-get-help-arrow"></icn></a>
						</div>
					</div>
					
					
				
				
			</div>
			
			
		<?php } else {  ?>
	
				<?php include('includes/include-header.php'); ?>
				
					<div class="main-content-container clearfix <?php if($offset) { ?> offset <?php } ?>" <?php if (!empty($main_content_bg_img)) { ?>style="background-image: url('<?php echo $main_content_bg_img['url']; ?>'); background-repeat: no-repeat; background-size: cover; " <?php } ?>>
						
							<?php if(!empty($main_content_bg_img_tablet)) {?>
							
								<style>
								    @media only screen and (max-width: 1179px) {
								     .main-content-container {
								       background-image: url('<?php echo $main_content_bg_img_tablet['url']; ?>') !important;
								       background-position: center top;
								     }
								    }
							  </style>
							
							<?php } ?>
							
							
							<?php if(!empty($main_content_bg_img_mobile)) {?>
							
								<style>
								    @media only screen and (max-width: 479px) {
								     .main-content-container {
								       background-image: url('<?php echo $main_content_bg_img_mobile['url']; ?>') !important;
								       
								     }
								    }
							  </style>
							
							<?php } ?>							
							

						
						<div class="banner-container" <?php if (!empty($banner_image)) { ?>style="background-image: url('<?php echo $banner_image['url']; ?>');" <?php } else if ( is_singular('attorney') ) {  ?> style="background-image: url('<?php echo $generic_banner['url']; ?>');"  <?php } else if ( !empty($banner_bg_color) ) {  ?> style="background: <?php echo $banner_bg_color; ?>;"  <?php }  else if ( ($banner_transparent) ) {  ?> style="background: none !important; background-color:  transparent !important;"  <?php }  else { ?>style="background-image: url('<?php echo $generic_banner['url']; ?>');"  <?php } ?>>
							
							<?php if(!empty($banner_image_tablet)) {?>
							
								<style>
								    @media only screen and (max-width: 1179px) {
								     .banner-container {
								       background-image: url('<?php echo $banner_image_tablet['url']; ?>') !important;
								       background-position: center top;
								     }
								    }
							  </style>
							
							<?php } ?>
							
							
							<?php if(!empty($banner_image_mobile)) {?>
							
								<style>
								    @media only screen and (max-width: 479px) {
								     .banner-container {
								       background-image: url('<?php echo $banner_image_mobile['url']; ?>') !important;
								       
								     }
								    }
							  </style>
							
							<?php } ?>
							
							
														
						
							
							<?php if ( is_singular('attorney') || is_home() ) {  ?>
								
								<style>
								    @media only screen and (max-width: 479px) {
								     .banner-container {
								       background-image: url('<?php echo $generic_banner['url']; ?>') !important;
								       
								     }
								    }
							  </style>
							
							<?php } ?>	
							 
							
							<?php if($banner_overlay) {?><div class="overlay"></div><?php } ?>
							
							<div class="frame-main frame-banner">
								<div class="banner-content clearfix">
												
					
									<?php if (is_front_page()) { ?>
									
										<?php if(!empty($banner_title)) { echo "<h2 class='feature--title'>$banner_title</h2>"; }?>
							
										<?php $attorney_image = get_field( 'attorney_image' );?>
										
							
										<?php echo "<div class='feature--content'>$banner_content</div>"; ?>
							
										<?php } else { ?>
						
											<?php if (is_404()) { ?>
<!-- 											<span class='sub-title'></span> -->
											<h2 class='feature--title'>404: Page Not Found</h2>
											
											<?php if(!empty($banner_title)) { echo "<h2 class='feature--title'>404 Not Found</h2>"; }?>
									
										<?php } else if (is_home()) { ?>
											
											
											<?php if(!empty($banner_title)) { echo "<span class='sub-title'>$banner_title</span>"; }?>					
											<h2 class='feature--title'><?php echo get_the_title( get_option('page_for_posts', true) ); ?></h2>
											
											<?php echo "<div class='feature--content'>$banner_content</div>"; ?>
										
										<?php } else if ( is_singular('post')) {  ?>
											
											<span class='sub-title'>Blog</span>
											<h2 class='feature--title'><?php echo the_title() ?></h2>
											<?php echo do_shortcode("[btn kind='left arrow' style='font-weight: bold; font-size: 14px;' color='white'  link='/about-us/firm-news/']Back to Firm News[/btn]"); ?>
					
											<?php echo "<div class='feature--content'>$banner_content</div>"; ?>
										
										<?php } else if ( is_singular('video') ) {  ?>
											
											<span class='sub-title'>Our Videos</span>
											<h2 class='feature--title'><?php echo the_title() ?></h2>
											
										
										<?php } else if ( is_singular('attorney') || is_singular('staff') ) {  ?>
										
											<span class='sub-title'>About Us</span>
											<h2 class='feature--title'>Meet Our Team</h2>
											
											<?php echo do_shortcode("[btn kind='left arrow' style='font-weight: bold; font-size: 14px;' color='white'  link='/meet-our-team/']Back to Team Overview[/btn]"); ?>
											
											<?php echo "<div class='feature--content'>$banner_content</div>"; ?>
											
							  		
										<?php } else if (! is_front_page()) { ?>
											
											
											<?php if(!empty($banner_title)) { echo "<span class='sub-title'>$banner_title</span>"; }?>
											
											<h2 class='feature--title'><?php echo the_title() ?></h2>
										
											<?php echo "<div class='feature--content'>$banner_content</div>"; ?>
										
										<?php } ?>
						  	
									<?php } ?>
								</div><!-- .banner-content -->
							
							</div><!-- .banner-frame -->
					
					</div><!-- .banner-container -->
		


		
		<?php } ?>


								

