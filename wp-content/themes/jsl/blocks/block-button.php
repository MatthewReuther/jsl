<?php

// /**
//  * Custom Button Block Template.
//  *
//  * @param   array $block The block settings and attributes.
//  * @param   string $content The block inner HTML (empty).
//  * @param   bool $is_preview True during AJAX preview.
//  * @param   (int|string) $post_id The post ID this block is saved to.
//  */

// // Create class attribute allowing for custom "className" and "align" values.
// $className = 'c-btn';
// if( !empty($block['className']) ) {
//     $className .= ' ' . $block['className'];
// }
// if( !empty($block['align']) ) {
//     $className .= ' align' . $block['align'];
// }

// Load values and assing defaults.

$btn_text = $section_button['button_text'] ? $section_button['button_text'] : 'Click Here';
$btn_url = $section_button['button_url'] ? $section_button['button_url'] : '';

if($section_button['button_style'] == "text") {
  $btn_style = " c-text-btn";
} else {
  $btn_style = $section_button['button_style'] ? " c-btn--{$section_button['button_style']}" : '';
}


$btn_size = $section_button['button_size'] ? " c-btn--{$section_button['button_size']}" : '';

?>

<a href="<?php echo $btn_url; ?>" class="c-btn<?php echo $btn_style; ?><?php echo $btn_size; ?>"><?php echo $btn_text; ?></a>