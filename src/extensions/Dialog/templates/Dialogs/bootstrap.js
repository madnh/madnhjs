;(function (_) {
    var version = '1.0.0';
    _.M.defineConstant({
        DIALOG_TEMPLATE_BOOTSTRAP_PRE_OPTIONS_NAME: '_.M.Dialog.Template.Bootstrap'
    });
    _.M.PreOptions.define(_.M.DIALOG_TEMPLATE_BOOTSTRAP_PRE_OPTIONS_NAME, {
        has_header: true,
        has_footer: true,
        close_manual: true,
        padding: true,
        overflow: 'hidden',
        buttons_align: 'right',
        pending_info: ''
    });

    var dialog_opening = 0;


    function _section_header(self, dialog, render_data) {
        var header_color = dialog.options.type ? 'bg-' + dialog.options.type : '';

        return '<div class="modal-header ' + header_color + '">' +
            '<button type="button" class="close" onclick="' + render_data.close_func + '()"><span aria-hidden="true">&times;</span></button>' +
            '<h4 class="modal-title">' + dialog.options.title + '</h4>' +
            '</div>';
    }

    function _section_body(self, dialog, render_data) {
        var content = dialog.getContent();
        var body_styles = [];

        if (!this.options.padding) {
            body_styles.push('padding: 0px;');
        }
        body_styles.push('overflow: ' + this.options.overflow + ';');

        return ['<div class="modal-body" style="', body_styles.join(' '), '">', content, '</div>'].join('');
    }

    function _section_footer(self, dialog, render_data) {
        var buttons = [];
        var template = '<div class="modal-footer" style="text-align: ' + this.options.buttons_align + ';">';
        var pending_info = '<span class="dialog-pending-info text-muted pull-' + (this.options.buttons_align === 'left' ? 'right' : 'left') + '">' + this.options.pending_info + '</span>&nbsp;&nbsp;';

        _.each(dialog.buttons, function (button) {
            buttons.push(button.render());
        });

        template += buttons.join("\n") + pending_info;
        template += '</div>';

        return template;
    }

    function _layout(self, dialog, render_data) {
        var size_class_map = {large: 'lg', small: 'sm'};
        var size = '';
        var layout = ['<div class="modal fade" tabindex="-1" role="dialog" id="<%= dom_id %>" data-dialog-id="', dialog.id, '" data-draw="<%- draw %>">'];


        if (size_class_map.hasOwnProperty(this.options.size)) {
            size = 'modal-' + size_class_map[this.options.size];
        }

        layout.push('<div class="modal-dialog ', size, '">', '<div class="modal-content">');

        if (this.options.has_header) {
            layout.push('@HEADER@');
        }

        layout.push('@BODY@');

        if (this.options.has_footer) {
            layout.push('@FOOTER@');
        }

        layout.push('</div></div></div>');

        return layout.join('');
    }

    function getModalOption(close_manual) {
        return {
            backdrop: close_manual ? 'static' : true,
            keyboard: !close_manual
        }
    }

    function _open_dialog() {
        var modal_options = getModalOption(this.options.close_manual),
            dialog = this.getDialog(),
            data = {};

        data['close_func'] = _.M.WAITER.createFunc(function () {
            this.getDialog().close();
        }.bind(this), false, 'Modal: ' + dialog.id + ' >>> Header close button');

        this.waiter_keys.push(data['close_func']);

        var template = this.render(data);

        $('body').append(template);
        console.log('Template dialog open');

        this.getDOM().on('show.bs.modal', function (event) {
            if ($(event.target).is(this.getDOM())) {
                this.emitEvent('show');
            }
        }.bind(this));
        this.getDOM().on('shown.bs.modal', function (event) {
            if ($(event.target).is(this.getDOM())) {
                $('body .modal-backdrop').last().attr('id', 'modal-backdrop_' + this.id);
                this.emitEvent('shown');
            }
        }.bind(this));
        this.getDOM().on('hide.bs.modal', function (event) {
            if ($(event.target).is(this.getDOM())) {
                this.emitEvent('hide');
            }
        }.bind(this));
        this.getDOM().on('hidden.bs.modal', function (event) {
            if ($(event.target).is(this.getDOM())) {
                this.emitEvent('hidden');
                this.getDialog().close();
            }
        }.bind(this));

        this.getDOM().modal(modal_options);
    }

    function update_dialog_close_status() {
        var closeable = this.getDialog().isCloseable();
        var modal_dom = this.getDOM();

        modal_dom.find('.modal-header .close').toggleClass('hide', !closeable);

    }

    function Bootstrap() {
        this.type_prefix = 'template_dialog_bootstrap';
        _.M.Template.call(this);
        this.options = _.M.PreOptions.get(_.M.DIALOG_TEMPLATE_BOOTSTRAP_PRE_OPTIONS_NAME);

        this.waiter_keys = [];
        this.setLayout(_layout);
        this.setSection('HEADER', _section_header.bind(this));
        this.setSection('BODy', _section_body.bind(this));
        this.setSection('FOOTER', _section_footer.bind(this));

        this.mimic('open', 'toggle_enable', 'close', 'hide', 'show', 'update_content');

        this.on('open', _open_dialog.bind(this));
        this.on('toggle_enable', update_dialog_close_status.bind(this));
        this.on('close', function () {
            _.M.WAITER.remove(this.waiter_keys);
            this.waiter_keys = [];
            this.getDOM().modal('hide');
            this.getDOM().remove();

            //Fix modal-open class on body
            dialog_opening = Math.max(0, --dialog_opening);
            $('body').toggleClass('modal-open', dialog_opening > 0);

            if (!dialog_opening) {
                $('body .modal-backdrop').remove();
            }
            $('body ' + '.modal-backdrop_' + this.id).remove();
        });
        this.on('hide', function () {
            this.getDOM().hide();
            $('body ' + '.modal-backdrop_' + this.id).hide();
        });
        this.on('show', function () {
            dialog_opening++;
            this.getDOM().show();
            $('body ' + '.modal-backdrop_' + this.id).show();
        });
        this.on('update_content', function (new_content) {
            if (this.getDialog().isOpened()) {
                this.updateContent(new_content);
            }
        });

    }

    _.M.inherit(Bootstrap, _.M.Template);
    Object.defineProperty(Bootstrap, 'version', {
        value: version
    });

    /**
     *
     * @returns {null|*|Object|_.M.EventEmitter|_.M.Dialog}
     */
    Bootstrap.prototype.getDialog = function () {
        return this.dataSource;
    };

    Bootstrap.prototype.updateContent = function (new_content) {
        if (!new_content) {
            new_content = this.getDialog().options.content;
        }

        this.getDOM().find('.modal-body').html(new_content);
    };

    Bootstrap.prototype.updatePendingInfo = function (info) {
        this.getDOM().find('.dialog-pending-info').html(info);
    };


    _.M.Template.register(_.M.DIALOG_TEMPLATE_TYPE, 'Bootstrap', Bootstrap);
})(_);