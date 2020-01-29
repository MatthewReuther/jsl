<?php
if ( defined( 'ABSPATH' ) === false ) :
	exit;
endif; // Shhh
?>
<?php $youtube_vimeo = preg_match( '/(youtube\.com)|(vimeo\.com)/', $choice['content']['video']['url'] ) ? true : false; ?>
<a href="<?php echo $youtube_vimeo ? esc_attr( $choice['content']['video']['url'] ) : '#totalpoll-choice-' . $this->poll->id() . '-' . $choice_index . '-content' ?>" class="totalpoll-display-video">
	<div class="totalpoll-choice-overlay totalpoll-choice-overlay-video"></div>
	<?php if ( ! $youtube_vimeo ): ?>
		<div class="totalpoll-video-hidden-content">
			<div id="totalpoll-choice-<?php echo $this->poll->id() . '-' . $choice_index; ?>-content"><?php echo $this->embed( esc_attr( $choice['content']['video']['url'] ) ); ?></div>
		</div>
	<?php endif; ?>
	<img src="<?php echo esc_attr( $choice['content']['thumbnail']['url'] ); ?>">
</a>