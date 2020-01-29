<?php
# Database Configuration
define( 'DB_NAME', 'wp_cjaskl' );
define( 'DB_USER', 'cjaskl' );
define( 'DB_PASSWORD', '1DZ63ytN5OaklvOCBadc' );
define( 'DB_HOST', '127.0.0.1' );
define( 'DB_HOST_SLAVE', '127.0.0.1' );
define('DB_CHARSET', 'utf8');
define('DB_COLLATE', 'utf8_unicode_ci');
$table_prefix = 'wp_';

# Security Salts, Keys, Etc
define('AUTH_KEY',         'LCoB+nsI,F*=bJyyAIc@B1 h_~_4<FpFsa+?EcfB-{p pwM(qwsu3?zTb%IA)M`^');
define('SECURE_AUTH_KEY',  'V]vV,JdMhB|!|;|7UE$I,*qwe(wI2yO.3$i&gm@Mt2Jkmg^4Z}|0RT>jCGU/p9EV');
define('LOGGED_IN_KEY',    'j2|<1NWA(kPc+QPQ$|I{rdz=cJ{V-%&T- Ts-FN[!J&X5v4$Mw/Q-M{fb$6,d_=u');
define('NONCE_KEY',        'Cg@|TRB&U8&7|i^1!/YtA:Vh2iv,KT3SM RW$hv1]_?rbyfy#5/scy$INwC?>X&J');
define('AUTH_SALT',        ')(5//8BG}Y];Jr[2T-od2[/sn7S-+~rA CUq5-7p#C4ppVU3{/ FU%-t_Y7L)~uf');
define('SECURE_AUTH_SALT', '@U#RVBTV9S3wL:}jS@L/BLKSb=H_8~h+(8#jB!yrpaO?^x!WrfG7]$h+O2caZq@)');
define('LOGGED_IN_SALT',   'N@NOmGZ6:<cb!@J)i6A-3Bj!-*[R6L(li[!isxL,#+27xN[y%48sjkHmRTdn:B!V');
define('NONCE_SALT',       's*u4OH!%bd3M1lul>pK1L-Rfj/kxy0;+ )ejX,/k?@MZ3` mEvz+ul63B<ne=-g!');


# Localized Language Stuff

define( 'WP_CACHE', TRUE );

define( 'WP_AUTO_UPDATE_CORE', false );

define( 'PWP_NAME', 'cjaskl' );

define( 'FS_METHOD', 'direct' );

define( 'FS_CHMOD_DIR', 0775 );

define( 'FS_CHMOD_FILE', 0664 );

define( 'PWP_ROOT_DIR', '/nas/wp' );

define( 'WPE_APIKEY', 'f6dd6966bfb9fc4c6dfe484a2354ae8086b39b57' );

define( 'WPE_FOOTER_HTML', "" );

define( 'WPE_CLUSTER_ID', '111247' );

define( 'WPE_CLUSTER_TYPE', 'pod' );

define( 'WPE_ISP', true );

define( 'WPE_BPOD', false );

define( 'WPE_RO_FILESYSTEM', false );

define( 'WPE_LARGEFS_BUCKET', 'largefs.wpengine' );

define( 'WPE_SFTP_PORT', 2222 );

define( 'WPE_LBMASTER_IP', '' );

define( 'WPE_CDN_DISABLE_ALLOWED', true );

define( 'DISALLOW_FILE_MODS', FALSE );

define( 'DISALLOW_FILE_EDIT', FALSE );

define( 'DISABLE_WP_CRON', false );

define( 'WPE_FORCE_SSL_LOGIN', false );

define( 'FORCE_SSL_LOGIN', false );

/*SSLSTART*/ if ( isset($_SERVER['HTTP_X_WPE_SSL']) && $_SERVER['HTTP_X_WPE_SSL'] ) $_SERVER['HTTPS'] = 'on'; /*SSLEND*/

define( 'WPE_EXTERNAL_URL', false );

define( 'WP_POST_REVISIONS', FALSE );

define( 'WPE_WHITELABEL', 'wpengine' );

define( 'WP_TURN_OFF_ADMIN_BAR', false );

define( 'WPE_BETA_TESTER', false );

umask(0002);

$wpe_cdn_uris=array ( );

$wpe_no_cdn_uris=array ( );

$wpe_content_regexs=array ( );

$wpe_all_domains=array ( 0 => 'www.juddshawinjurylaw.com', 1 => 'www.sklaw.com', 2 => 'cjaskl.wpengine.com', 3 => 'sklaw.com', 4 => 'juddshawinjurylaw.com', );

$wpe_varnish_servers=array ( 0 => 'pod-111247', );

$wpe_special_ips=array ( 0 => '104.154.105.168', );

$wpe_ec_servers=array ( );

$wpe_largefs=array ( );

$wpe_netdna_domains=array ( );

$wpe_netdna_domains_secure=array ( );

$wpe_netdna_push_domains=array ( );

$wpe_domain_mappings=array ( );

$memcached_servers=array ( 'default' =>  array ( 0 => 'unix:///tmp/memcached.sock', ), );

//define( 'WP_SITEURL', 'http://www.juddshawinjurylaw.com' );

//define( 'WP_HOME', 'http://www.juddshawinjurylaw.com' );
define('WPLANG','');

# WP Engine ID


# WP Engine Settings






# That's It. Pencils down
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');
require_once(ABSPATH . 'wp-settings.php');


























