<?php
if ( defined( 'ABSPATH' ) === false ) :
	exit;
endif; // Shhh
?>
<?php $supports_full = $choice['content']['thumbnail']['url'] !== $choice['content']['image']['url'] ? true : false; ?>
<a <?php echo $supports_full ? 'href="' . esc_attr( $choice['content']['image']['url'] ) . '"' : ''; ?> class="totalpoll-display-image<?php echo $supports_full ? ' totalpoll-supports-full' : ''; ?>">
	<?php if ( $supports_full ): ?>
		<div class="totalpoll-choice-overlay totalpoll-choice-overlay-image"></div>
	<?php endif; ?>
	<img src="<?php echo esc_attr( $choice['content']['thumbnail']['url'] ); ?>">
</a>