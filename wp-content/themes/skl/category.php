<?php get_header(); ?>
<div role="main" class="frame frame-main clearfix">
	<article class="content clearfix">
		<header>
			<h1><?php the_title(); ?></h1>
		</header>
		<?php while (have_posts()) : the_post(); ?>
		<section>
			<h3><a href="<?php the_permalink() ?>"><?php the_title(); ?></a></h3>
			<p class="details"><span class="author">by <?php the_author(); ?></span> | <span class="date"><?php the_time('F jS, Y') ?></span></p>
			<?php the_content(); ?>
		</section>
		<?php endwhile;?>
	</article><!-- .content -->
	<aside class="sidebar">
	  <?php include("cta_form.php"); ?>
	</aside>
	<?php include("pagination.php"); ?>
</div><!-- [role="main"] -->
<?php get_footer(); ?>