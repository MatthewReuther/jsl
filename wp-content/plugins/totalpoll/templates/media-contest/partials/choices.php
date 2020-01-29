<div class="totalpoll-choices">
	<?php
	$choice_index = 0;
	$per_row      = absint( $this->option( 'general', 'other', 'per-row' ) );
	$per_row      = $per_row < 1 ? 1 : $per_row;
	$choices      = $this->poll->choices();
	$media_types = array ( 'image', 'video', 'audio', 'html', 'other' );
	foreach ( $choices as $choice ):
		$choice_index ++;
		$row         = ceil( $choice_index / $per_row );
		$last_in_row = $per_row === 1 || ( $choice_index % $row === 0 && $choice_index !== 1 );
		?>

		<?php if ( ( $choice_index - 1 ) % $per_row === 0 ): ?>
			<ul class="totalpoll-choices-row">
		<?php endif; ?>

		<li class="totalpoll-choice-container" style="width: <?php echo 100 / $per_row; ?>%" itemprop="suggestedAnswer" itemscope itemtype="http://schema.org/Answer">
			<label class="totalpoll-choice totalpoll-choice-<?php echo $choice['content']['type']; ?>-type">
				<?php if ( in_array( $choice['content']['type'], $media_types ) ): ?>
					<div class="totalpoll-choice-media">

						<?php if ( $choice['content']['type'] === 'image' ): ?>
							<?php include 'choices/image.php'; ?>

						<?php elseif ( $choice['content']['type'] === 'video' ): ?>
							<?php include 'choices/video.php'; ?>

						<?php elseif ( $choice['content']['type'] === 'audio' ) : ?>
							<?php include 'choices/audio.php'; ?>

						<?php elseif ( $choice['content']['type'] === 'html' ) : ?>
							<?php include 'choices/html.php'; ?>

						<?php elseif ( $this->current === 'vote' && $choice['content']['type'] === 'other' ) : ?>
							<?php include 'vote/other.php'; ?>

						<?php endif; ?>

					</div>
				<?php endif; ?>

				<?php include 'choices/text.php'; ?>
			</label>
		</li>

		<?php if ( $choice_index % $per_row === 0 || count( $choices ) === $choice_index ): ?>
		</ul>
		<?php endif; ?>
	<?php endforeach; ?>
</div>