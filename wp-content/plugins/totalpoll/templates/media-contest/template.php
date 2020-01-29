<?php

if ( defined( 'ABSPATH' ) === false ) :
	exit;
endif; // Shhh

/**
 * Template Name: Media Contest
 * Template URI: http://totalpoll.com
 * Version: 1.0.5
 * Requires: 3.0.0
 * Description: Run rich media contest easily with great look
 * Author: MisqTech
 * Author URI: http://misqtech.com
 * Category: All
 * Type: media
 */

if ( ! class_exists( 'TP_MC_Template' ) && class_exists( 'TP_Template' ) ):

	class TP_MC_Template extends TP_Template {
		protected $textdomain = 'tp-media-contest';
		protected $__FILE__ = __FILE__;

		public function assets() {
			wp_enqueue_style( 'tosrus-style', $this->asset( 'assets/css/jquery.tosrus' . ( WP_DEBUG ? '' : '.min' ) . '.css' ), array(), ( WP_DEBUG ? time() : TP_VERSION ) );
			wp_register_script( 'tosrus', $this->asset( 'assets/js/min/jquery.tosrus.js' ), 'jquery', TP_VERSION );
			wp_enqueue_script( 'tp-media-contest', $this->asset( 'assets/js' . ( WP_DEBUG ? '' : '/min' ) . '/main.js' ), array (	'jquery', 'tosrus' ), ( WP_DEBUG ? time() : TP_VERSION ) );
		}

		public function settings() {
			return array (
				/**
				 * Sections
				 */
				'general'    => array (
					'label' => __( 'General', $this->textdomain ),
					/**
					 * Tabs
					 */
					'tabs'  => array (
						'container' => array (
							'label'  => __( 'Container', $this->textdomain ),
							/**
							 * Fields
							 */
							'fields' => array (
								'padding'      => array (
									'type'    => 'text',
									'label'   => __( 'Padding', $this->textdomain ),
									'default' => '1em',
								),
								'border-color' => array (
									'type'    => 'color',
									'label'   => __( 'Pagination container border', $this->textdomain ),
									'default' => '#EAEAEA',
								),
							),
						),
						'messages'  => array (
							'label'  => __( 'Messages', $this->textdomain ),
							/**
							 * Fields
							 */
							'fields' => array (
								'background' => array (
									'type'    => 'color',
									'label'   => __( 'Background', $this->textdomain ),
									'default' => '#FFFAFB',
								),
								'border'     => array (
									'type'    => 'color',
									'label'   => __( 'Border', $this->textdomain ),
									'default' => '#F5BCC8',
								),
								'color'      => array (
									'type'    => 'color',
									'label'   => __( 'Foreground', $this->textdomain ),
									'default' => '#F44336',
								),
							),
						),
						'question'  => array (
							'label'  => __( 'Question', $this->textdomain ),
							/**
							 * Fields
							 */
							'fields' => array (
								'font-size'     => array (
									'type'    => 'text',
									'label'   => __( 'Font size', $this->textdomain ),
									'default' => '1.25em',
								),
								'margin-bottom' => array (
									'type'    => 'text',
									'label'   => __( 'Margin below', $this->textdomain ),
									'default' => '1em',
								),
							),
						),
						'other'     => array (
							'label'  => __( 'Other', $this->textdomain ),
							/**
							 * Fields
							 */
							'fields' => array (
								'per-row'       => array (
									'type'       => 'number',
									'label'      => __( 'Choices per row', $this->textdomain ),
									'default'    => '3',
									'attributes' => array (
										'min'  => 1,
										'step' => 1,
									),
								),
								'animation'     => array (
									'type'    => 'text',
									'label'   => __( 'Animation duration (ms)', $this->textdomain ),
									'default' => '1000',
								),
								'border-radius' => array (
									'type'    => 'text',
									'label'   => __( 'Border radius', $this->textdomain ),
									'default' => '0',
								),
							),

						),
					),
				),
				'choices'    => array (
					'label' => __( 'Choices', $this->textdomain ),
					/**
					 * Tabs
					 */
					'tabs'  => array (
						'general' => array (
							'label'  => __( 'General', $this->textdomain ),
							/**
							 * Fields
							 */
							'fields' => array (
								'image-padding'      => array (
									'type'    => 'text',
									'label'   => __( 'Image padding', $this->textdomain ),
									'default' => '0.8em',
								),
								'padding'            => array (
									'type'    => 'text',
									'label'   => __( 'Padding', $this->textdomain ),
									'default' => '0.8em',
								),
								'vertical-padding'   => array (
									'type'    => 'text',
									'label'   => __( 'Vertical spacing', $this->textdomain ),
									'default' => '0.8em',
								),
								'horizontal-padding' => array (
									'type'    => 'text',
									'label'   => __( 'Horizontal spacing', $this->textdomain ),
									'default' => '0.8em',
								),
								'text-align'         => array (
									'type'    => 'select',
									'label'   => __( 'Text align', $this->textdomain ),
									'extra'   => array (
										'options' => array (
											'left'   => 'Left',
											'center' => 'Center',
											'right'  => 'Right'
										)
									),
									'default' => 'center'
								)
							),

						),
						'default' => array (
							'label'  => __( 'Default', $this->textdomain ),
							/**
							 * Fields
							 */
							'fields' => array (
								'background:normal' => array (
									'type'    => 'color',
									'label'   => __( 'Background', $this->textdomain ),
									'default' => '#EEEEEE',
								),
								'background:hover'  => array (
									'type'    => 'color',
									'label'   => __( 'Background hover', $this->textdomain ),
									'default' => '#E5E5E5',
								),
								'media-background'  => array (
									'type'    => 'color',
									'label'   => __( 'Media background', $this->textdomain ),
									'default' => '#FFFFFF',
								),
								'border:normal'     => array (
									'type'    => 'color',
									'label'   => __( 'Border', $this->textdomain ),
									'default' => '#EAEAEA',
								),
								'border:hover'      => array (
									'type'    => 'color',
									'label'   => __( 'Border hover', $this->textdomain ),
									'default' => '#DEDEDE',
								),
								'color:normal'      => array (
									'type'    => 'color',
									'label'   => __( 'Foreground', $this->textdomain ),
									'default' => 'inherit',
								),
								'color:hover'       => array (
									'type'    => 'color',
									'label'   => __( 'Foreground hover', $this->textdomain ),
									'default' => 'inherit',
								),
							),

						),
						'checked' => array (
							'label'  => __( 'Checked', $this->textdomain ),
							/**
							 * Fields
							 */
							'fields' => array (
								'background:normal' => array (
									'type'    => 'color',
									'label'   => __( 'Background', $this->textdomain ),
									'default' => '#269EE3',
								),
								'background:hover'  => array (
									'type'    => 'color',
									'label'   => __( 'Background hover', $this->textdomain ),
									'default' => '#269EE3',
								),
								'border:normal'     => array (
									'type'    => 'color',
									'label'   => __( 'Border', $this->textdomain ),
									'default' => '#1A7FB9',
								),
								'border:hover'      => array (
									'type'    => 'color',
									'label'   => __( 'Border hover', $this->textdomain ),
									'default' => '#1A7FB9',
								),
								'color:normal'      => array (
									'type'    => 'color',
									'label'   => __( 'Foreground', $this->textdomain ),
									'default' => '#FFFFFF',
								),
								'color:hover'       => array (
									'type'    => 'color',
									'label'   => __( 'Foreground hover', $this->textdomain ),
									'default' => '#FFFFFF',
								),
							),

						),
					),
				),
				'buttons'    => array (
					'label' => __( 'Buttons', $this->textdomain ),
					/**
					 * Tabs
					 */
					'tabs'  => array (
						'general' => array (
							'label'  => __( 'General', $this->textdomain ),
							/**
							 * Fields
							 */
							'fields' => array (
								'padding'     => array (
									'type'    => 'text',
									'label'   => __( 'Padding', $this->textdomain ),
									'default' => '0.8em',
								),
								'font-weight' => array (
									'type'    => 'text',
									'label'   => __( 'Font weight', $this->textdomain ),
									'default' => '600',
								),
								'align'       => array (
									'type'    => 'select',
									'label'   => __( 'Align', $this->textdomain ),
									'extra'   => array (
										'options' => array (
											'left'   => 'Left',
											'center' => 'Center',
											'right'  => 'Right'
										)
									),
									'default' => 'center'
								)
							),

						),
						'default' => array (
							'label'  => __( 'Default', $this->textdomain ),
							/**
							 * Fields
							 */
							'fields' => array (
								'background:normal' => array (
									'type'    => 'color',
									'label'   => __( 'Background', $this->textdomain ),
									'default' => '#EEEEEE',
								),
								'background:hover'  => array (
									'type'    => 'color',
									'label'   => __( 'Background hover', $this->textdomain ),
									'default' => '#E5E5E5',
								),
								'border:normal'     => array (
									'type'    => 'color',
									'label'   => __( 'Border', $this->textdomain ),
									'default' => '#EAEAEA',
								),
								'border:hover'      => array (
									'type'    => 'color',
									'label'   => __( 'Border hover', $this->textdomain ),
									'default' => '#DEDEDE',
								),
								'color:normal'      => array (
									'type'    => 'color',
									'label'   => __( 'Foreground', $this->textdomain ),
									'default' => '#676767',
								),
								'color:hover'       => array (
									'type'    => 'color',
									'label'   => __( 'Foreground hover', $this->textdomain ),
									'default' => '#5A5A5A',
								),
							),

						),
						'primary' => array (
							'label'  => __( 'Primary', $this->textdomain ),
							/**
							 * Fields
							 */
							'fields' => array (
								'background:normal' => array (
									'type'    => 'color',
									'label'   => __( 'Background', $this->textdomain ),
									'default' => '#269EE3',
								),
								'background:hover'  => array (
									'type'    => 'color',
									'label'   => __( 'Background hover', $this->textdomain ),
									'default' => '#2090D0',
								),
								'border:normal'     => array (
									'type'    => 'color',
									'label'   => __( 'Border', $this->textdomain ),
									'default' => '#1A7FB9',
								),
								'border:hover'      => array (
									'type'    => 'color',
									'label'   => __( 'Border hover', $this->textdomain ),
									'default' => '#106BC5',
								),
								'color:normal'      => array (
									'type'    => 'color',
									'label'   => __( 'Foreground', $this->textdomain ),
									'default' => '#FFFFFF',
								),
								'color:hover'       => array (
									'type'    => 'color',
									'label'   => __( 'Foreground hover', $this->textdomain ),
									'default' => '#FFFFFF',
								),
							),

						),
					),
				),
				'results'    => array (
					'label' => __( 'Results', $this->textdomain ),
					/**
					 * Tabs
					 */
					'tabs'  => array (
						'bar'  => array (
							'label'  => __( 'Bar', $this->textdomain ),
							/**
							 * Fields
							 */
							'fields' => array (
								'height'         => array (
									'type'    => 'height',
									'label'   => __( 'Height', $this->textdomain ),
									'default' => '5px',
								),
								'bar-background' => array (
									'type'    => 'color',
									'label'   => __( 'Bar background', $this->textdomain ),
									'default' => '#EEEEEE',
								),
								'color:start'    => array (
									'type'    => 'color',
									'label'   => __( 'Start color', $this->textdomain ),
									'default' => '#269EE3',
								),
								'color:end'      => array (
									'type'    => 'color',
									'label'   => __( 'End color', $this->textdomain ),
									'default' => '#269EE3',
								),
							),

						),
						'text' => array (
							'label'  => __( 'Text', $this->textdomain ),
							/**
							 * Fields
							 */
							'fields' => array (
								'font-size'   => array (
									'type'    => 'text',
									'label'   => __( 'Font size', $this->textdomain ),
									'default' => '0.9em',
								),
								'font-weight' => array (
									'type'    => 'text',
									'label'   => __( 'Font weight', $this->textdomain ),
									'default' => 'normal',
								),
								'color'       => array (
									'type'    => 'color',
									'label'   => __( 'Color', $this->textdomain ),
									'default' => '#777777',
								),
							),

						),
					),
				),
				'typography' => array (
					'label' => __( 'Typography', $this->textdomain ),
					/**
					 * Tabs
					 */
					'tabs'  => array (
						'general' => array (
							'label'  => false,
							/**
							 * Fields
							 */
							'fields' => array (
								'line-height' => array (
									'type'    => 'text',
									'label'   => __( 'Line height', $this->textdomain ),
									'default' => '1.5',
								),
								'font-family' => array (
									'type'    => 'text',
									'label'   => __( 'Font family', $this->textdomain ),
									'default' => 'inherit',
								),
								'font-size'   => array (
									'type'    => 'text',
									'label'   => __( 'Font size', $this->textdomain ),
									'default' => '14px',
								),
							),
						),
					),
				),
			);

		}
	}

	return 'TP_MC_Template';

endif;

