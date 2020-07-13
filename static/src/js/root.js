odoo.define('theme_seccua.wysiwyg.default_options', function (require) {
'use strict';

var options = require('web_editor.wysiwyg.default_options');

options['styleTags'].push('drfacts');
options['styleTags'].push('drbenefits');
options['styleTags'].push('drparaheading');
options['styleTags'].push('drlargebody');
options['styleTags'].push('drbody');
options['styleTags'].push('drsmallbody');
options['styleTags'].push('drslidertext');
options['styleTags'].push('drcta');

});
