odoo.define('theme_seccua.snippet.options', function (require) {
'use strict';

var weWidgets = require('wysiwyg.widgets');
var core = require('web.core');
var sOptions = require('web_editor.snippets.options');
var dom = $.summernote.core.dom;

var _t = core._t;

sOptions.registry.drgl_add_image = sOptions.Class.extend({
    xmlDependencies: ['/theme_seccua/static/src/xml/s_dr_video_snippet.xml'],

    addMedia: function (previewMode, value, $opt) {
        this._openMediaDialog();
    },
    _openMediaDialog: function () {
        var self = this;
        var mediaDialog = new weWidgets.MediaDialog(this, {
            noIcons: true,
            noDocuments: true,
            noVideos: false,
        });
        mediaDialog.open();
        mediaDialog.on('save', this, function (media) {
            self._addMedia($(media));
            self.$target.trigger('content_changed');
        });
        mediaDialog.on('cancel', this, function () {
            if (!this.$('.dr_tab').length) {
                this.$target.remove();
            }
        });
    },

    //--------------------------------------------------------------------------
    // Options
    //--------------------------------------------------------------------------

    /**
     * @override
     */
    onBuilt: function () {
        this._super();
        this._openMediaDialog();
    },

    cleanForSave: function () {
        this._super.apply(this, arguments);
        this.$('.dr_to_remove').remove();
    },
    _addMedia: function ($media) {
        var data = {};
        if (dom.isImg($media[0])) {
            data = {
                type: 'image',
                thumbnail: $media.attr('src'),
                target_url: $media.attr('src'),
            };
        }
        if ($media.find('iframe').length) {
            $media = $media.find('iframe');
            var url = $media.attr('src');
            var full = url.match(/(\?|&)v=([^&#]+)/);
            var short = url.match(/(\.be\/)+([^\/]+)/);
            var embed = url.match(/(\embed\/)+([^\/]+)/);
            var videoID = false;
            if (url.indexOf("youtu") !== -1) {
                if (full) {
                    videoID = full.pop();
                } else if (short) {
                    videoID = short.pop();
                } else if (embed) {
                    videoID = embed.pop();
                    videoID = videoID.split('?')[0];
                } else {
                    videoID = false;
                }
            } else {
                videoID = false;
            }
            data['type'] = 'video';
            data['thumbnail'] = 'https://img.youtube.com/vi/' + videoID + '/default.jpg';
            data['target_url'] = url;
            if (videoID) {
                data['videoid'] = videoID;
            }
        }
        $(core.qweb.render('theme_seccua.s_dr_video_snippet_tab', {data: data})).appendTo(this.$('.dr_tab_block'));
        if (this.$('.dr_tab_content').children().length === 0) {
            $(core.qweb.render('theme_seccua.dr_tab_content', {data: {
                'type': data.type,
                'target_url': data.target_url,
                'videoid': videoID || false,
            }})).appendTo(this.$('.dr_tab_content'));
            this.$('.dr_tab').addClass('dr_active');
        }
    },
});

});
