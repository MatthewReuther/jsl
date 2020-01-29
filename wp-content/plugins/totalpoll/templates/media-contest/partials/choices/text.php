<?php
if (defined('ABSPATH') === false) :
	exit;
endif; // Shhh
?>
<div class="totalpoll-choice-label" itemprop="text">
	<?php
	if ($this->current === 'results') :
		include dirname(__FILE__) . '/../results/bar.php';
	elseif ($choice['content']['type'] !== 'other'):
		echo $this->choice_input($choice)->attribute('class', 'totalpoll-choice-checkbox');
	endif;
	?>
	<span><?php echo esc_attr($choice['content']['label']); ?></span>
	<?php
	if ($this->current === 'results'):
		include dirname(__FILE__) . '/../results/text.php';
	endif;
	?>
</div>
