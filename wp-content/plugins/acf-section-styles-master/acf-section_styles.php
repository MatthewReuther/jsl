<?php

/*
Plugin Name: Advanced Custom Fields: Section Styles
Plugin URI: https://www.ractoon.com
Description: Adds a field to configure styles including padding, border, margin, and backgrounds.
Version: 1.2.3
Author: Shawn Dones / ractoon
Author URI: https://www.ractoon.com
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
*/

// exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) exit;


// check if class already exists
if ( !class_exists('acf_plugin_section_styles') ) :

	class acf_plugin_section_styles {

		/*
		*  __construct
		*
		*  This function will setup the class functionality
		*
		*  @type	function
		*  @date	17/02/2016
		*  @since	1.0.0
		*
		*  @param	n/a
		*  @return	n/a
		*/

		function __construct() {

			// vars
			$this->settings = array(
				'version'	=> '1.0.0',
				'url'			=> plugin_dir_url( __FILE__ ),
				'path'		=> plugin_dir_path( __FILE__ )
			);


			// set text domain
			// https://codex.wordpress.org/Function_Reference/load_plugin_textdomain
			load_plugin_textdomain( 'acf-section_styles', false, plugin_basename( dirname( __FILE__ ) ) . '/lang' ); 


			// include field
			add_action('acf/include_field_types', 	array($this, 'include_field_types')); // v5

		}

		/*
		*  include_field_types
		*
		*  This function will include the field type class
		*
		*  @type	function
		*  @date	17/02/2016
		*  @since	1.0.0
		*
		*  @param	$version (int) major ACF version. Defaults to false
		*  @return	n/a
		*/

		function include_field_types( $version = false ) {

			// include
			include_once('fields/acf-section_styles-v5.php');

		}

	}

	// initialize
	new acf_plugin_section_styles();

// class_exists check
endif;


function add_section_css() {

		$inline_css = '';
	 
		// Section styles
		if ( have_rows('flexible_content_blocks') ) {
			$section_id = 1;
			while ( have_rows('flexible_content_blocks') ) {
				the_row();
				
				
				if(get_row_layout() == "block_global") {
					
						$global_blocks =  get_sub_field('global_blocks');
						$global_blocks = preg_replace("/[\s-]/", "_", $global_blocks);
						if( have_rows('modules', 'global-modules') ):
						while ( have_rows('modules', 'global-modules') ) : the_row();
							
						$module_name = get_sub_field('module_name');
						$module_name = strtolower($module_name);
						$module_name = preg_replace("/[\s-]/", "_", $module_name);
						$module_name = preg_replace("/[.,]/", "", $module_name);
						$module_name = preg_replace('/["]/', "", $module_name); 
							
						
						if($module_name === $global_blocks) {
							if( have_rows('global_module_flexible_content_blocks') ):
							while ( have_rows('global_module_flexible_content_blocks') ) : 
								the_row();
								$styles = get_sub_field( 'section_styles', 'option' );
							endwhile;
						endif;

						}

						endwhile;
					endif;
				} else {
					$styles = get_sub_field( 'section_styles' );
				}

				
				// element id
				$inline_css .= "
		.c-section--{$section_id} {
		";
	
				// set background
				if ( !empty( $styles['background_image'] ) ) {
					$inline_css .= "
		background: url({$styles['background_image']['url']}) no-repeat;
		background-size: cover;
	";
				}
	
				// set other styles
				$inline_css .= "
		background-color: {$styles['background_color']};
		background-position: {$styles['background_position_1']} {$styles['background_position_2']} ;
		border-style: {$styles['border_style']};
		border-color: {$styles['border_color']};
		border-width: {$styles['border_width']};
		margin: {$styles['margin']};
		padding: {$styles['padding']};
	";
		
				// end element id
				$inline_css .= "
		}
		";
	
				$section_id++;
			}
		
		}
		echo '<style>' . $inline_css . '</style>'; 
}
add_action('wp_head', 'add_section_css');
