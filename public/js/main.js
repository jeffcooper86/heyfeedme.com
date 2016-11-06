const rightNav = require('./modules/right-nav');
const siteNav = require('./modules/site-nav');

require('browsernizr/test/touchevents');
require('browsernizr');

/**
 * Components.
 * ----------------------------
 */


/**
 * Modules.
 * ----------------------------
 */
rightNav.init();
siteNav.init();
