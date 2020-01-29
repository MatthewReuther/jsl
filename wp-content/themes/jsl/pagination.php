
		<div class="pagination-container">		  
		<?php
		    $total_pages = $the_pages->max_num_pages;
		
		    if ($total_pages > 1){
		
		        $current_page = max(1, get_query_var('paged'));
		
		        echo paginate_links(array(
		            'base' => get_pagenum_link(1) . '%_%',
		            'format' => '/page/%#%',
		            'current' => $current_page,
		            'total' => $total_pages,
		            'prev_text'    => __('<'),
		            'next_text'    => __('>'),
		        ));
		    }
		    
		 ?>  							
		</div>