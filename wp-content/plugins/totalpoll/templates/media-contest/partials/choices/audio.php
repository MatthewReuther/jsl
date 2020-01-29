<?php
if ( defined( 'ABSPATH' ) === false ) :
	exit;
endif; // Shhh
?>
<a href="#">
	<img src="<?php echo esc_attr( $choice['content']['thumbnail']['url'] ); ?>">
</a>
<audio class="totalpoll-audio-player" controls>
	<source src="<?php echo esc_attr( $choice['content']['audio']['url'] ); ?>" type="audio/mpeg">
	<?php _e( 'Your browser does not support the audio element.', $this->textdomain ); ?>
</audio>