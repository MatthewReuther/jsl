

<?php get_header(); ?>
	<div class="main-content-container clearfix offset " <?php if (!empty($background_image)) { ?>style="background-image: url('<?php echo $background_image['url']; ?>'); background-repeat: no-repeat; 
    background-size: cover; " <?php } ?>>




		<div class="main-content-wrap">	
			
			
	
			<div class="frame-main clearfix">	
					
				<div class="row">
		    		<div class="col content-container no-gutter col-md-8">
			        	<div class="col-md-12 frame-content">
				        	<h1>Page Not Found</h1>
			            	<p>We’re sorry, but the page you requested can’t be found. Please use your browser’s back button or the main navigation menu to visit a different area of the website.</p>
			            
			        	</div>
		    		</div>
		    	
		    		<div class="col-md-4 sidebar-container">
				        <div class="col-md-12 col box-shadow">
				            <?php echo do_shortcode('[cta_form title=false descritpion=false]'); ?>
				        </div>
			    	</div>
			    	
				</div>
								
			</div>
		</div>
		

		
	</div>
<?php get_footer(); ?>

