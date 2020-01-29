<?php

/**
 * Custom Button Block Template.
 *
 * @param   array $block The block settings and attributes.
 * @param   string $content The block inner HTML (empty).
 * @param   bool $is_preview True during AJAX preview.
 * @param   (int|string) $post_id The post ID this block is saved to.
 */


// Create class attribute allowing for custom "className" and "align" values.
$className = 'c-btn';
if( !empty($block['className']) ) {
    $className .= ' ' . $block['className'];
}
if( !empty($block['align']) ) {
    $className .= ' align' . $block['align'];
}

// Load values and assing defaults.
$btn_text = get_field('button_text') ?: 'Click Here';
$btn_url = get_field('button_text') ?: '';
$btn_style = ' c-btn--' . get_field('button_style') ?: '';
$btn_size = get_field('button_size') ? ' c-btn--' . get_field('button_size') : '';

?>
<a href="<?php echo $btn_url; ?>" class="c-btn<?php echo $btn_style; ?><?php echo $btn_size; ?>"><?php echo $btn_text; ?></a>