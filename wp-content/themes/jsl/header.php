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
	<meta https-equiv="Content-Type" content="text/html; charset=UTF-8">
	<meta https-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
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
elseif (is_paged() )
	$template_class .= " page--paged";
else
	$template_class .= " page--sub"

?>

<?php 

if( is_home() || is_category() || is_singular( 'post' )) { 
	$include_banner = get_field('has_banner', get_option('page_for_posts'));
	$banner_image = get_field('banner_image', get_option('page_for_posts'));
	$banner_title = get_field( 'banner_title', get_option('page_for_posts'));
	$banner_content = get_field( 'banner_content', get_option('page_for_posts'));
	$phone_number =  get_field( 'phone_number', 'options' );
	$banner_icon =  get_field('banner_icon', get_option('page_for_posts'));
	
	$banner = get_field('banner_appearance_fields', get_option('page_for_posts'));	
	
	// Desktop Vars
	$banner_header_fc = $banner['header_font_color'];
	$banner_body_fc = $banner['body_font_color'];
	$banner_bg_img = $banner['background_image'];
	$banner_bg_color = $banner['background_color'];
	$banner_frame_align = $banner['frame_alignment'];
	$banner_frame_width = $banner['frame_width'];
	$banner_text_alignment = $banner['text_alignment'];
	
	// Tablet Vars
	$banner_bg_img_tab = $banner['background_image_tablet'];
	$banner_bg_color_tab = $banner['background_color_tablet'];
	$banner_frame_width_tab = $banner['frame_width_tablet'];
	$featured_img_url = get_the_post_thumbnail_url($post->ID, 'large'); 
	
} else {
	$phone_number =  get_field( 'phone_number', 'options' );
	
	// BANNER VARS
	$include_banner = get_field('has_banner');
	$banner_icon = get_field('banner_icon');
	$banner_title = get_field( 'banner_title' );
	$banner_content = get_field( 'banner_content' );
	
	// BANNER APPEARANCE VARS
	$banner = get_field('banner_appearance_fields');
	
	// Desktop Vars
	$banner_header_fc = $banner['header_font_color'];
	$banner_body_fc = $banner['body_font_color'];
	$banner_bg_img = $banner['background_image'];
	$banner_bg_color = $banner['background_color'];
	$banner_frame_align = $banner['frame_alignment'];
	$banner_frame_width = $banner['frame_width'];
	$banner_text_alignment = $banner['text_alignment'];
	
	// Tablet Vars
	$banner_bg_img_tab = $banner['background_image_tablet'];
	$banner_bg_color_tab = $banner['background_color_tablet'];
	$banner_frame_width_tab = $banner['frame_width_tablet'];
	
	
	// Mobile Vars
	$banner_bg_img_mob = $banner['background_image_mobile'];
	$banner_bg_color_mob = $banner['background_color_mobile'];
	$banner_frame_width_mob = $banner['frame_width_mobile'];
	
	// MAIN CONTENT AREA VARS
	$content_area =  get_field('main_content_area');
	
	// MAIN CONTENT AREA APPEARANCE VARS
	$mc = get_field('mc_appearance_fields');
	
	// Desktop Vars
	$mc_header_fc = $mc['header_font_color'];
	$mc_body_fc = $mc['body_font_color'];
	$mc_bg_img = $mc['background_image'];
	$mc_bg_color = $mc['background_color'];
	$mc_frame_align = $mc['frame_alignment'];
	$mc_frame_width = $mc['frame_width'];
	$mc_text_alignment = $mc['text_alignment'];
	
	// Tablet Vars
	$mc_bg_img_tab = $mc['background_image_tablet'];
	$mc_bg_color_tab = $mc['background_color_tablet'];
	$mc_frame_width_tab = $mc['frame_width_tablet'];
	
	
	// Mobile Vars
	$mc_bg_img_mob = $mc['background_image_mobile'];
	$mc_bg_color_mob = $mc['background_color_mobile'];
	$mc_frame_width_mob = $mc['frame_width_mobile'];

	$btn_text = get_field('button_text') ?: 'Click Here';
	$btn_url = get_field('button_url') ?: '';
	$btn_style = ' c-btn--' . get_field('button_style') ?: '';
	$btn_size = get_field('button_size') ? ' c-btn--' . get_field('button_size') : '';
	
} 
	
?>



<body <?php $page_slug = 'page-'.$post->post_name; body_class("page blog $template_class $page_slug"); ?>>
	<?php if ( function_exists( 'gtm4wp_the_gtm_tag' ) ) { gtm4wp_the_gtm_tag(); } ?>
	<!-- START CHROME FRAME -->
	<!-- Prompt IE 6 users to install Chrome Frame. Remove this if you support IE 6.
	chromium.org/developers/how-tos/chrome-frame-getting-started -->
	<!--[if lt IE 7]><p class=chromeframe>Your browser is <em>ancient!</em> <a href="http://browsehappy.com/">Upgrade to a different browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">install Google Chrome Frame</a> to experience this site.</p><![endif]-->
	<!-- END CHROME FRAME -->

	<div class="page-container" id="welcome">

		<div id="toTopBar" class="">
			
			<a href="tel:<?php echo $phone_number ?>" class="cta phone">
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
		
						
			<header>
					

					
					<div class="header-container"   <?php if (!$include_banner) { ?> style="background-color: #17345d;"<?php }?>>

						<div class="cta-container mobile">
							<div class="frame-main clearfix">
								
									<div class="inner-wrap">
										<icn class="icn-phone"></icn>
										<?php echo do_shortcode( '[phone]' ); ?>
										<em>24/7 Free Consultation</em></div>
								
							</div>
						</div>
					
						<div class="frame-main frame-header clearfix">
							<div class="inner-wrap clearfix">

								
									
									
									<div class="branding-container">
										<a class="branding-logo" href="/">
											<img class="logo" style="width: 225px;" src="<?php bloginfo('template_directory');?>/img/logo/JSL-logo-update-whiteblue.svg" alt="<?php bloginfo('name'); ?>" />
											<img class="logo active" style="width: 225px;" src="<?php bloginfo('template_directory');?>/img/logo/JSL-logo-update-whiteblue.svg" alt="<?php bloginfo('name'); ?>" />
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
											<?php echo do_shortcode( '[phone]' ); ?>
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

		<?php if (($include_banner || is_404()) && (!is_singular('attorney') && (!is_singular('staff')))) { ?>
			
			
			<div class="banner-container  <?php // echo $color_overlay; ?>-overlay" <?php if (is_singular('post')) { ?>style="background-image: url('<?php echo $featured_img_url; ?>');"  <?php } elseif (!empty($banner_bg_img) && empty($banner_bg_color)) { ?>style="background-image: url('<?php echo $banner_bg_img['url']; ?>');" <?php } elseif (empty($banner_bg_img) && !empty($banner_bg_color)) { ?>style="background-color: <?php echo $banner_bg_color ?>;"  <?php } ?>>
				<?php if (is_singular('post')) { ?>
					<div class="overlay"></div>
				<?php } ?>
				
				<?php if(!empty($banner_bg_img_tab) && empty($banner_bg_color_tab)) {?>
				
					<style>
					    @media only screen and (max-width: 1179px) {
					     .banner-container {
					       background-image: url('<?php echo $banner_bg_img_tab['url']; ?>') !important;
					       background-position: center top;
					     }
					    }
				  </style>
				
				<?php } elseif (!empty($banner_bg_color_tab) && empty($banner_bg_img_tab)) {?> 
						<style>
							@media only screen and (max-width: 1179px) {
								.banner-container {
									background-image: none !important;
									background-color: <?php echo $banner_bg_color_tab ?> !important;
								}
							}
						</style>
				<?php } ?>
				
				
				<?php if(!empty($banner_bg_img_mob) && empty($banner_bg_color_mob)) {?>
				
					<style>
					    @media only screen and (max-width: 479px) {
					     .banner-container {
					       background-image: url('<?php echo $banner_bg_img_mob['url']; ?>') !important;
					       background-position: 62% !important;
					       
					     }
					    }
				  </style>
				
				<?php } elseif (!empty($banner_bg_color_mob) && empty($banner_bg_img_mob)) {?> 
						<style>
							@media only screen and (max-width: 479px) {
								.banner-container {
									background-image: none !important;
									background-color: <?php echo $banner_bg_color_mob ?> !important;
								}
							}
						</style>
				<?php } ?>
									
					
					<div class="frame-main frame-banner clearfix frame-<?php echo $banner_frame_align; ?>">
						<div class="banner-content clearfix <?php if (is_singular('post')) { ?> col-md-8  text-align-center ?><?php } else { ?> col-md-<?php echo $banner_frame_width_mob; ?> col-md-<?php echo $banner_frame_width_tab; ?> col-lg-<?php echo $banner_frame_width; ?> text-<?php echo $banner_text_alignment; ?> <?php } ?>">
							
							<?php if (!is_singular('post')) { ?>
								<?php if(!empty($banner_icon)) { echo "<img src='$banner_icon[url]' alt='$banner_title' class='feature--icon' />"; }?>
								<?php if(!empty($banner_title)) { echo "<h1 class='feature--title' style='color: $banner_header_fc !important;'>$banner_title</h1>"; }?>
								<?php echo "<div class='feature--content' style='color: $banner_body_fc !important;'>$banner_content</div>"; ?>
								
								<?php if(!empty($btn_text) && !empty($btn_url)) {
          
										$btn = "<a href='$btn_url' class='c-btn $btn_style $btn_size'>$btn_text</a>";
									    	echo $btn;
										}
								?>
								
								
							<?php } else { ?>
								<h1 class='feature--title'><?php echo the_title() ?></h1>
								<hr class="color-divider" style="margin: 0 auto; background-color: #00DA73">
							<?php } ?>
							
							

							<?php if (is_404()) { ?>
								<h2 class='feature--title'>404: Page Not Found</h2>
											
									<?php if(!empty($banner_title)) { echo "<h2 class='feature--title'>404 Not Found</h2>"; }?>
						
											
								<?php }?>
							
						</div>
						
					
						
					</div>
					
					<?php if (is_front_page()) { ?>	
						<div class="get-help-wrapper">
							<a class="get-help-icon" href="#get-help"><icn class="icn-get-help-arrow"></icn></a>
						</div>
					<?php } ?>
				
				
			</div>
	
	 <?php } ?>
					<?php if (!empty($content_area)) { ?>
								<div class="main-content-container clearfix" <?php if(!$include_banner && !empty($mc_bg_img)) { ?> style="padding-top: 120px; background-image: url('<?php echo $mc_bg_img['url']; ?>'); background-repeat: no-repeat; background-size: cover; " <?php } elseif (!$include_banner && empty($mc_bg_img)) { ?>style="padding-top: 120px; background-image: url('<?php echo $mc_bg_img['url']; ?>');" <?php } ?>>
						
							<?php if(!empty($mc_bg_img_tab)) {?>
							
								<style>
								    @media only screen and (max-width: 1179px) {
								     .main-content-container {
								       background-image: url('<?php echo $mc_bg_img_tab['url']; ?>') !important;
								       background-position: center top;
								     }
								    }
							  </style>
							
							<?php } ?>
							
							
							<?php if(!empty($mc_bg_img_mob)) {?>
							
								<style>
								    @media only screen and (max-width: 479px) {
								     .main-content-container {
								       background-image: url('<?php echo $mc_bg_img_mob['url']; ?>') !important;
								       
								     }
								    }
							  </style>
							
							<?php } ?>
					<?php } ?>							
							

						


								

