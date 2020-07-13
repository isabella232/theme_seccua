odoo.define('theme_seccua.s_video_frontend', function (require) {
'use strict';

var publicWidget = require('web.public.widget');
var core = require('web.core');
var config = require('web.config');
var widget = require('web.Widget');

var QWeb = core.qweb;

publicWidget.registry.s_dr_video_snippet = publicWidget.Widget.extend({
    selector: '.s_dr_video_snippet',
    disabledInEditableMode: false,
    xmlDependencies: ['/theme_seccua/static/src/xml/s_dr_video_snippet.xml'],

    read_events: {
        'click .dr_tab:not(.d_ghost_tab)': '_onClickTab',
        'click .dr_s_next': '_onClickNext',
        'click .dr_s_prev': '_onClickPrev',
        'click .d_media': '_onClickMedia',
    },

    events: {
        'click .dr_s_remove_item': '_onClickRemoveTab',
    },

    start: function () {
        this.$('.d_ghost_tab').remove();
        if (!this.editableMode) {
            this.$('.dr_s_prev').addClass('d-none');
            var $tabs = this.$('.dr_tab');
            var thumbsItems = 3;
            if (config.device.isMobile) {
                thumbsItems = 2;
            }
            this.groups = _.groupBy($tabs, function (product, index) {
                return Math.floor(index / thumbsItems);
           });
           this.groupsList = _.keys(this.groups);
           if (this.groupsList.length > 1) {
               this.$('.dr_s_next').removeClass('d-none');
               var lastGroupindex = this.groupsList.length - 1;
               var lastGroup = this.groups[lastGroupindex.toString()];
               var ghostToAdd = thumbsItems - lastGroup.length;
               for (var i = 0; i < ghostToAdd; i++) {
                   var $ghost = $('<div/>', {
                        class: 'dr_tab d_ghost_tab'
                    });
                    lastGroup.push($ghost);
                    $ghost.appendTo(this.$('.dr_tab_block'));
               }
           }
           if ($tabs.length) {
               this._activateTab($($tabs[0]));
           }
           this.activeGroup = this.groupsList[0];
           this._refreshList();
       } else {
           this.$('.dr_tab').removeClass('d-none');
           this.$('.dr_s_prev, .dr_s_next').addClass('d-none');
       }
        return this._super.apply(this, arguments);
    },
    _refreshList: function () {
        var $tabs = this.$('.dr_tab');
        $tabs.addClass('d-none');
        var a = this.groups[this.activeGroup];
        _.each(a, function (tab) {
            var $tab = $(tab);
            $tab.removeClass('d-none');
        });
    },
    _onClickRemoveTab: function (ev) {
        var $btn = $(ev.currentTarget);
        var $tab = $btn.closest('.dr_tab');
        $tab.addClass('d-none');
        $tab.addClass('dr_to_remove');
        if (!this.$('.dr_tab:not(.dr_to_remove)').length) {
            this.$target.remove();
        }
        if ($tab.hasClass('dr_active') && this.$('.dr_tab').length) {
            this.$('.dr_tab_content').empty();
            this._activateTab(this.$('.dr_tab:not(.dr_to_remove):first'));
        }
        this.$target.trigger('content_changed');
    },
    _onClickTab: function (ev) {
        var $tab = $(ev.currentTarget);
        this._activateTab($tab);
    },
    _activateTab: function ($tab) {
        if ($tab.hasClass('dr_active')) {
            return;
        }
        this.$('.dr_tab').removeClass('dr_active');
        $tab.addClass('dr_active');
        this.$('.dr_tab_content').empty();
        $(core.qweb.render('theme_seccua.dr_tab_content', {data: {
            'type': $tab.attr('data-type'),
            'target_url': $tab.attr('data-target'),
            'videoid': $tab.attr('data-videoid') || false,
        }})).appendTo(this.$('.dr_tab_content'));
    },
    _onClickPrev: function () {
        var index = this.groupsList.indexOf(this.activeGroup);
        if (index - 1 === 0) {
            this.$('.dr_s_prev').addClass('d-none');
        }
        index = index === 0 ? this.groupsList.length - 1 : index - 1;
        this.activeGroup = this.groupsList[index];
        this.$('.dr_s_next').removeClass('d-none');
        this._refreshList();
    },
    _onClickNext: function () {
        var index = this.groupsList.indexOf(this.activeGroup);
        this.numOfGroups = this.groupsList.length;
        this.$('.dr_s_prev').removeClass('d-none');
        if (index + 2 === this.numOfGroups) {
            this.$('.dr_s_next').addClass('d-none');
        }
        index = (index + 1) % this.groupsList.length;
        this.activeGroup = this.groupsList[index];
        this._refreshList();
    },
    _onClickMedia: function (ev) {
        new previewWidget(this, ev).appendTo($('body'));
    }
});

publicWidget.registry.s_d_carousel_snippet = publicWidget.Widget.extend({
    selector: '.s_d_carousel_snippet',
    xmlDependencies: ['/theme_seccua/static/src/xml/s_d_carousel_snippet.xml'],
    disabledInEditableMode: false,

    start: function () {
        if (this.editableMode) {
            this.$('.d_carousel_controller_block').remove();
        } else {
            var $slides = this.$('.carousel-item');
            var contentData = _.map($slides, function (slide, index) {
                return {
                    index: index,
                    text: $(slide).find('.s_d_title_block').html().trim()
                };
            });
            $(core.qweb.render('d_carousel_inner_content', {
                data: contentData
            })).appendTo(this.$target);
            var id = this.$('.carousel-control-prev').data('target');
            this.$('.d_target_col').data('target', id);
            this.$('.d_target_col').attr('data-target', id);
        }
        return this._super.apply(this, arguments);
    },

});

var previewWidget = widget.extend({
    className: 's_dr_video_snippet_preview',
    xmlDependencies: ['/theme_seccua/static/src/xml/s_dr_media_viewer.xml'],

    events: {
        'click .d_media': '_onClickMedia',
        'click .d_close_btn': '_onCloseBtnClick',
        'click .d_move_next': '_onNext',
        'click .d_move_previous': '_onPrevious',
        'keydown .d_modal_fullscreen': '_onKeydown',
        'keyup .d_modal_fullscreen': '_onKeyUp',
    },

    init: function (parent, ev) {
        this.$target = parent.$el;
        this.ev = ev;
        this.attachments = _.map(this.$target.find('.dr_tab'), function (tab, index) {
            var $tab = $(tab);
            return {
                target: $tab.attr('data-target'),
                type: $tab.attr('data-type'),
                id: index,
            };
        });
        return this._super.apply(this, arguments);
    },
    start: function (parent, ev) {
        this._onClickMedia(this.ev);
        return this._super.apply(this, arguments);
    },
    _onKeydown: function (ev) {
        switch (ev.which) {
            case $.ui.keyCode.RIGHT:
                ev.preventDefault();
                this._next();
                break;
            case $.ui.keyCode.LEFT:
                ev.preventDefault();
                this._previous();
                break;
        }
    },
    /**
     * Close popup on ESCAPE keyup
     *
     * @private
     * @param {KeyEvent} e
     */
    _onKeyUp: function (e) {
        switch (e.which) {
            case $.ui.keyCode.ESCAPE:
                e.preventDefault();
                this._onClose(e);
                break;
        }
    },
    /**
     * @private
     * @param {MouseEvent} e
     */
    _onClose: function (e) {
        e.preventDefault();
        this._onDestroy();
    },
    _onClickMedia: function (ev) {
        var $tab = $(ev.currentTarget).closest('.dr_tab_content_block');
        this.activeMedia = {
            target: $tab.attr('data-target'),
            type: $tab.attr('data-type'),
        };
        // append to tab content not body so all viewer event can be bind
        $(core.qweb.render('MediaViewer', {widget: this})).appendTo(this.$el);
        this.$modal = $('.d_modal_fullscreen');
        this.$modal.show();
        this.$modal.focus();
        this.$el.on('hidden.bs.modal', _.bind(this._onDestroy, this));
    },
    _updateContent: function () {
        this.$('.d_viewer_content').html(QWeb.render('MediaViewer.Content', {
            widget: this
        }));
        this.$('[data-toggle="tooltip"]').tooltip({delay: 0});
    },
    /**
     * @private
     * @param {MouseEvent} e
     */
    _onNext: function (e) {
        e.preventDefault();
        this._next();
    },
    /**
     * @private
     * @param {MouseEvent} e
     */
    _onPrevious: function (e) {
        e.preventDefault();
        this._previous();
    },
    /**
     * @private
     */
    _next: function () {
        var index = _.findIndex(this.attachments, this.activeMedia);
        index = (index + 1) % this.attachments.length;
        this.activeMedia = this.attachments[index];
        this._updateContent();
    },
    /**
     * @private
     */
    _previous: function () {
        var index = _.findIndex(this.attachments, this.activeMedia);
        index = index === 0 ? this.attachments.length - 1 : index - 1;
        this.activeMedia = this.attachments[index];
        this._updateContent();
    },
    _onCloseBtnClick: function (ev) {
        ev.preventDefault();
        if (this.$modal) {
            this.$modal.modal('hide');
            this.$modal.remove();
        }
        this.destroy();
    },
    _onDestroy: function () {
        this.$modal.remove();
        this.destroy();
    },
});

});
