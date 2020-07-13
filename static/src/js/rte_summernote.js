odoo.define('theme_seccua.rte.summernote', function (require) {
'use strict';

require('web_editor.rte.summernote');
var core = require('web.core');

var _t = core._t;

$.summernote.lang.odoo.style.drfacts = _t('Facts');
$.summernote.lang.odoo.style.drbenefits = _t('Benefits');
$.summernote.lang.odoo.style.drparaheading = _t('Paragraph Heading');
$.summernote.lang.odoo.style.drlargebody = _t('Large Body');
$.summernote.lang.odoo.style.drbody = _t('Body');
$.summernote.lang.odoo.style.drsmallbody = _t('Small Body');
$.summernote.lang.odoo.style.drslidertext = _t('Slider Text');
$.summernote.lang.odoo.style.drcta = _t('CTA');

});
