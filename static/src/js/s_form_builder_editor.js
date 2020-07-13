odoo.define('theme_seccua.s_form_builder_editor', function (require) {
'use strict';

var Dialog = require('web_editor.widget').Dialog;
var core = require('web.core');
var sOptions = require('web_editor.snippets.options');

var _t = core._t;

sOptions.registry.s_form_builder_placeholder = sOptions.Class.extend({
    xmlDependencies: ['/theme_seccua/static/src/xml/theme_seccua.xml'],

    placeholder: function (previewMode, value, $opt) {
        var self = this;
        this.dialog = new Dialog(this, {
            size: 'medium',
            title: _t("Set Placeholder"),
            buttons: [
                {text: _t("Save"), classes: 'btn-primary', click: function () {
                    var placeholder = this.$('#placeholder').val().trim();
                    self.$target.attr({placeholder: placeholder});
                    this.close();
                }}
            ],
            $content: $(core.qweb.render('theme_seccua.s_form_builder_placeholder_modal')),
        }).open();

        this.dialog.opened().then((function () {
            this.$('#placeholder').val(self.$target.attr('placeholder'));
        }).bind(this.dialog));
    },

    defaultValue: function (previewMode, value, $opt) {
        var self = this;
        this.dialog = new Dialog(this, {
            size: 'medium',
            title: _t("Set Default Value"),
            buttons: [
                {text: _t("Save"), classes: 'btn-primary', click: function () {
                    var value = this.$('#default_value').val().trim();
                    self.$target.attr({value: value});
                    this.close();
                }}
            ],
            $content: $(core.qweb.render('theme_seccua.s_form_builder_default_value_modal')),
        }).open();

        this.dialog.opened().then((function () {
            this.$('#default_value').val(self.$target.attr('value'));
        }).bind(this.dialog));
    },

});

});

odoo.define('theme_seccua.website_form_editor', function (require) {
'use strict';

require('website_form_editor');
var options = require('web_editor.snippets.options');
var core = require('web.core');

var qweb = core.qweb;

options.registry.website_form_editor_field_select.include({
    cleanForSave: function () {
        if (this.$target.find('#editable_select').length) {
            var self = this;
            // Reconstruct the field from the select tag
            var select = this.$target.find('select');
            var field = {
                name: select.attr('name'),
                string: this.$target.find('.col-form-label').text().trim(),
                required: self.$target.hasClass('o_website_form_required'),
                custom: self.$target.hasClass('o_website_form_custom'),
            };

            // Build the new records list from the editable select field
            var records = [];
            var editable_options = this.$target.find('#editable_select .o_website_form_select_item');
            _.each(editable_options, function (option) {
                records.push({
                    id: self.$target.hasClass('o_website_form_custom') ? $(option).text().trim() : $(option).attr('id'),
                    display_name: $(option).text().trim()
                });
            });
            field.records = records;

            // Replace this field by the new one
            var $new_select = $(qweb.render("website_form.field_many2one", {field: field}));
            // Reapply the custom style classes
            if (this.$target.hasClass('o_website_form_required_custom')) {
                $new_select.addClass('o_website_form_required_custom');
            }
            if (this.$target.hasClass('o_website_form_field_hidden')) {
                $new_select.addClass('o_website_form_field_hidden');
            }
            var labelClasses = this.$target.find('> div:first').attr('class');
            var inputClasses = this.$target.find('> div:last').attr('class');
            $new_select.find('> div:first').attr('class', labelClasses);
            $new_select.find('> div:last').attr('class', inputClasses);
            if (!this.$target.find('label.col-form-label').length) {
                $new_select.find('label.col-form-label').closest('div').remove();
            }
            this.$target.replaceWith($new_select);
        }
    }
});

});
