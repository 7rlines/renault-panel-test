(function () {
    // Классификация устройства
    var device = document.documentElement.clientWidth > 1000 ? 'desktop' : 'mobile';
    // Положение кнопки для открытия конфигурация
    var button_state = 'top';
    // Инициализация GA
    ga('create', Ga_id);
    // Базовая ссылка на ресурсы
    var path = 'http://5wheel.7rlines.com/';
    // Префикс к наименованиям
    var root = 'SRL';
    // Функция для нахождения элементов
    var find = function (selector) { return document.querySelector(selector); };
    // Функция для нахождения всех элементов
    var find_all = function (selector) { return document.querySelectorAll(selector); };
    // Функция для создания элементов
    var create = function (tag) { return document.createElement(tag); };
    // Функция для создания текста
    var create_text = function (text) { return document.createTextNode(text); };
    // Статья после которой должна быть кнопка
    var $article = find('#content');
    // Изображение на котором должна быть картинка
    var $image = find('.bigNodeImage,.topArticlesListImage');
    // Означает что первая кнопка загружена
    var button_init = false;
    var app_init = false;
    // Повесить обработчик после загрузки DOM
    document.addEventListener('DOMContentLoaded', function () { return init(); });
    // Контейнер для стилей
    var $style = create('style');
    // Встраиваем контейнер в head
    document.head.appendChild($style);
    // Обработчик для кнопки "Добавить товар"
    function init() {
        device = document.documentElement.clientWidth > 1000 ? 'desktop' : 'mobile';
        $article = find('#content');
        $image = find('.bigNodeImage,.topArticlesListImage');
        if (!$image) {
            setTimeout(function () { init(); }, 100);
            return false;
        }
        else {
            if (app_init)
                return false;
            app_init = true;
        }
        // Создание нового всплывающего окна
        var popup = new Popup;
        // Класс описания кнопки инициализации
        var Button = (function () {
            function Button($root, type) {
                this.$root = $root;
                this.type = type;
                this.$button = create('button');
                this.view_init();
                this.style_init();
                this.scene_init();
            }
            Button.prototype.view_init = function () {
                this.$button.classList.add(root + "-button");
                this.$button.innerHTML = "\n          <span class=\"" + root + "-logo\"></span>\n          <span class=\"" + root + "-divider\"></span>\n          <span class=\"" + root + "-text\"></span>\n          <span class=\"" + root + "-arrow\"></span>";
                this.type === 'image'
                    ? this.$button.classList.add(root + "-image")
                    : this.$button.classList.add(root + "-article");
                if (this.type === 'image')
                    this.$root.style.position = 'relative';
                this.$button.addEventListener('click', this.open);
                this.$root.appendChild(this.$button);
            };
            Button.prototype.style_init = function () {
                var size = 5; // default 5 (нормально 4 - 6)
                var adaptive_height = function (value) {
                    "height: " + value + "vw; min-height: " + value * (size + 3) + "px; max-height: " + value * (size + 4) + "px;";
                };
                var styles = "\n        \n          ." + root + "-button {\n            position: relative;\n            border: 1px solid #FECB39;\n            background: #FECB39;\n            padding: 0 50px 0 10px;\n            max-width: calc(100% - .5vw);\n            " + adaptive_height(size + 1) + "\n            cursor: pointer;\n            display: flex;\n            align-items: center;\n            justify-content: space-between;\n          }\n\n          ." + root + "-button ." + root + "-logo {\n            background: url('" + path + "imgs/renault_logo.svg') 50% 50% transparent no-repeat;\n            background-size: contain;\n            width: 30vw;\n            max-width: " + (size * 20 + 1) + "px;\n            " + adaptive_height(size - 1 + 0.32) + "\n          }\n\n          ." + root + "-button ." + root + "-divider {\n            background: #ffffff;\n            min-width: " + size * 0.6 + "px;\n            width: .5vw;\n            max-width: " + size * 1.2 + "px;\n            " + adaptive_height(size - 1 + 0.32) + "\n            margin: 0 8px;\n          }\n          \n          ." + root + "-button ." + root + "-text {\n            background: url('" + path + "imgs/renault_text.svg') 50% 80% transparent no-repeat;\n            background-size: contain;\n            width: 30vw;\n            max-width: " + (size * 11 + 11) + "px;\n            margin-top: .1vw;\n            " + adaptive_height(size - 3 + 0.32) + "\n          }\n\n          ." + root + "-button:hover {\n            background: #ffffff;\n            border-color: #AAA7AB;\n          }\n\n          ." + root + "-button:hover ." + root + "-divider {\n            background: #FECE17;\n          }\n\n          ." + root + "-button ." + root + "-arrow {\n            height: 1px;\n            width: 1px;\n            position: absolute;\n            background: transparent;\n            display: inline-block;\n            right: 20px;\n            top: 50%\n          }\n\n          ." + root + "-button ." + root + "-arrow:before {\n            content: '';\n            height: 4px;\n            width: 12px;\n            -webkit-transform: rotate(45deg);\n            -moz-transform: rotate(45deg);\n            -ms-transform: rotate(45deg);\n            -o-transform: rotate(45deg);\n            position: absolute;\n            background: #000000;\n            display: inline-block;\n            right: 0;\n            top: -5px;\n          }\n\n          ." + root + "-button ." + root + "-arrow:after {\n            content: '';\n            height: 4px;\n            width: 12px;\n            -webkit-transform: rotate(-45deg);\n            -moz-transform: rotate(-45deg);\n            -ms-transform: rotate(-45deg);\n            -o-transform: rotate(-45deg);\n            position: absolute;\n            background: #000000;\n            display: inline-block;\n            right: 0;\n            bottom: -4px;\n          }\n          \n          @media(max-width:1000px) {\n            \n          }\n          \n          @media(min-width:1000px) {\n            ." + root + "-fluid {\n              position: fixed;\n              top: 100px;\n              left: 0;\n              transform: none;\n            }  \n          }\n          \n          .target-image {\n            position: relative;\n          }\n        \n          ." + root + "-button." + root + "-image {\n            position: absolute;\n            bottom: 2.5vw;\n            left: 1.0vw;\n            transform: none;\n          }";
                $style.innerHTML += styles;
            };
            Button.prototype.scene_init = function () {
                if (!button_init)
                    return button_init = true;
                // Обьект для проверки было ли инициализировано ga логирование
                var ga_triggered = { top: false, left: false, bottom: false };
                var ga_trigger = function (state, update) {
                    if (update)
                        button_state = state;
                    if (ga_triggered[state ? state : button_state])
                        return null;
                    ga('send', 'event', {
                        eventCategory: 'button',
                        eventAction: "show-" + button_state,
                        eventLabel: location.pathname
                    });
                    ga_triggered[button_state] = true;
                };
                ga_trigger('top', true);
                var $article_button = this.type !== 'image' ? this.$button : find("." + root + "-button:not(." + root + "-image)");
                var $image_button = this.type === 'image' ? this.$button : find("." + root + "-button." + root + "-image");
                // Класс для перетекания кнопки в бок
                var fluid = root + "-fluid";
                var image_offset = $image.offsetTop + $image_button.offsetTop + $image_button.clientHeight;
                var article_offset = $article.offsetTop + $article.clientHeight - document.documentElement.clientHeight;
                setTimeout(function () {
                    image_offset = $image.offsetTop + $image_button.offsetTop + $image_button.clientHeight;
                    article_offset = $article.offsetTop + $article.clientHeight - document.documentElement.clientHeight;
                }, 500);
                var topTrigger = false;
                var bottomTrigger = true;
                var heightDetectionTrigger = false;
                function setButtonPosition(event) {
                    if (!heightDetectionTrigger) {
                        image_offset = $image.offsetTop + $image_button.offsetTop + $image_button.clientHeight;
                        article_offset = $article.offsetTop + $article.clientHeight - document.documentElement.clientHeight;
                        heightDetectionTrigger = true;
                    }
                    if ($article_button) {
                        if (window.pageYOffset < image_offset && topTrigger) {
                            $article_button.classList.remove(fluid);
                            topTrigger = false;
                        }
                        else if (window.pageYOffset > image_offset && !topTrigger) {
                            ga_trigger('left', true);
                            $article_button.classList.add(fluid);
                            topTrigger = true;
                        }
                        if (window.pageYOffset > article_offset && bottomTrigger) {
                            $article_button.classList.remove(fluid);
                            bottomTrigger = false;
                            ga_trigger('bottom', true);
                        }
                        else if (window.pageYOffset < article_offset && !bottomTrigger) {
                            $article_button.classList.add(fluid);
                            bottomTrigger = true;
                        }
                    }
                }
                window.addEventListener('load', setButtonPosition);
                window.addEventListener('scroll', setButtonPosition);
            };
            Button.prototype.open = function (type) {
                function $upTo(el, tagName) {
                    tagName = tagName.toLowerCase();
                    if (el.tagName.toLowerCase() == tagName)
                        return el;
                    while (el && el.parentNode) {
                        el = el.parentNode;
                        if (el.tagName && el.tagName.toLowerCase() == tagName) {
                            return el;
                        }
                    }
                    return null;
                }
                if (type === 'auto') {
                    popup.open('confirm');
                }
                else {
                    popup.open('model');
                    var $element = $upTo(type.target, 'button');
                    var $elementType = null;
                    if ($element.classList.contains(root + "-image")) {
                        $elementType = 'top';
                    }
                    else if ($element.classList.contains(root + "-fluid")) {
                        $elementType = 'left';
                    }
                    else if ($element.classList.contains(root + "-article") && !$element.classList.contains(root + "-fluid")) {
                        $elementType = 'bottom';
                    }
                    if ($elementType != null) {
                        ga('send', 'event', {
                            eventCategory: 'button',
                            eventAction: "click-" + $elementType,
                            eventLabel: location.pathname
                        });
                    }
                }
            };
            return Button;
        }());
        if ($article !== null)
            new Button($article);
        if ($image !== null)
            new Button($image, 'image');
    }
    // Класс описания компонента (Всплывающие окно)
    var Popup = (function () {
        function Popup() {
            this.$root = create(root + "-popup");
            this.$container = create(root + "-container");
            this.$confirm = create(root + "-confirm");
            this.can_auto = false;
            this.was_open = false;
            this.opened = false;
            this.stage = 'confirm';
            ga('send', 'event', {
                eventCategory: 'application',
                eventAction: 'load',
                eventLabel: location.pathname
            });
            RenaultShowroom.push('embed', {
                source: '5koleso',
                vitrine: Lx_model,
                container: root + "-container",
                ready: function (showroom) { return showroom.load(); },
                stat: function (type) { return ga('send', 'event', {
                    eventCategory: 'configurator',
                    eventAction: type,
                    eventLabel: location.pathname
                }); }
            });
            this.view_init();
            this.style_init();
            this.auto_open();
        }
        // Инициализация представления
        Popup.prototype.view_init = function () {
            var self = this;
            self.$root.tabIndex = -1;
            self.$root.addEventListener('keydown', function (event) { return event.key === 'Escape' ? self.close() : null; });
            self.$container.classList.add(root + "-hide");
            // Элемент "фоновая подложка"
            function $background() {
                var $bg = create(root + "-back");
                $bg.addEventListener('click', self.close.bind(self));
                return $bg;
            }
            function $close() {
                var $close = create('button');
                $close.classList.add(root + "-close");
                $close.innerHTML = 'x';
                $close.addEventListener('click', function () { return self.close(); });
                return $close;
            }
            var $buttons = create('div'), $accept = create('button'), $decline = create('button'), $image = create('img'), text = "\u0412\u044B \u0445\u043E\u0442\u0438\u0442\u0435 \u043E\u0442\u043A\u0440\u044B\u0442\u044C \u043A\u043E\u043D\u0444\u0438\u0433\u0443\u0440\u0430\u0446\u0438\u044E \u0434\u043B\u044F " + capitalize(Lx_model) + " ?";
            $image.src = path + "imgs/models/" + Lx_model + ".jpg";
            self.$confirm.appendChild($image);
            self.$confirm.classList.add(root + "-hide");
            $buttons.classList.add(root + "-buttons");
            $accept.innerHTML = 'Узнать конфигурации';
            $accept.classList.add(root + "-accept");
            $accept.addEventListener('click', function () { return self.open('model'); });
            $decline.innerHTML = 'Нет, спасибо';
            $decline.classList.add(root + "-decline");
            $decline.addEventListener('click', function () { return self.close(); });
            self.$confirm.innerHTML += "<p class=\"" + root + "-confirm-text\">" + text + "</p>";
            $buttons.appendChild($accept);
            $buttons.appendChild($decline);
            self.$confirm.appendChild($buttons);
            self.$root.appendChild($background());
            self.$root.appendChild($close());
            self.$root.appendChild(self.$confirm);
            self.$root.appendChild(self.$container);
            self.$root.classList.add(root + "-hide");
            document.body.appendChild(self.$root);
        };
        // Стили всплывающего окна
        Popup.prototype.style_init = function () {
            var overlay = function (position, index) {
                return ("position:" + position + ";top:0;left:0;right:0;bottom:0;z-index:" + index);
            };
            var style = "\n\n        @font-face {\n          font-family: 'RenaultLife';\n          src: url('" + path + "fonts/RenaultLife-Bold.eot') format('embedded-opentype'), url('" + path + "fonts/RenaultLife-Bold.woff') format('woff');\n          font-weight: 700;\n          font-style: normal;\n        }\n    \n        " + root + "-popup {\n          " + overlay('fixed', 999) + ";\n          display: flex;\n          align-items: center;\n          justify-content: center }\n\n        " + root + "-container {\n          position: relative;\n          padding: 1rem;\n          min-width: 300px;\n          width: 90%;\n          min-height: 150px;\n          height: 90%;\n          overflow: hidden;\n          background: #fff;\n          outline: none }\n\n        ." + root + "-close {\n          font-size: 1.5rem;\n          padding: .2rem .75rem;\n          border: none;\n          border-radius: 50%;\n          background: #fc3;\n          position: absolute;\n          right: 1%;\n          top: 1%;\n          z-index:4 }\n        \n        ." + root + "-close:hover { background: #ffde00 }\n\n        ." + root + "-buttons { display: flex; justify-content: center }\n\n        ." + root + "-buttons > button {\n          padding: .4rem 2rem;\n          border: none;\n          margin: 1rem .5rem 0;\n          cursor: pointer\n          font-family: bold 12px RenaultLife }\n\n        ." + root + "-accept { background: #fc3 }\n\n        ." + root + "-accept:hover { background: #ffde00 }\n\n        " + root + "-confirm {\n          position: relative;\n          padding: 1rem;\n          max-width: 90%;\n          max-height: 90%;\n          overflow: hidden;\n          background: #fff;\n          text-align: center; }\n\n        ." + root + "-confirm-text {\n          width: 100% !important;\n          text-align: center !important;\n          max-width: initial !important;\n          font-size: 16px !important;\n          padding: 0 !important;\n          margin: 0 !important;\n        }\n\n        " + root + "-confirm > img {\n          width: 600px;\n          display: inline-block;\n          max-width: 100%;\n        }\n\n        " + root + "-back {\n          " + overlay('absolute', 0) + ";\n          background: rgba(0, 0, 0, .5) }\n        \n        ." + root + "-hide { display: none !important }";
            $style.innerHTML += style;
        };
        Popup.prototype.auto_open = function () {
            var _this = this;
            var timeout = 1 * 1000, timer_id = null, self = this;
            setTimeout(function () { return _this.can_auto = true; }, timeout);
            window.addEventListener('scroll', function (event) {
                if (!_this.can_auto)
                    return null;
                if ($article && ($article.offsetTop + $article.clientHeight - document.documentElement.clientHeight) < window.pageYOffset) {
                    if (timer_id == null && !self.was_open) {
                        timer_id = setTimeout(function () {
                            if (self.opened)
                                return null;
                            self.open('confirm');
                        }, timeout);
                    }
                }
            });
        };
        Popup.prototype.new = function (html_string) {
            this.view(html_string);
            this.open();
        };
        Popup.prototype.view = function (html_string) {
            this.$container.innerHTML = html_string;
        };
        Popup.prototype.close = function () {
            this.enableScroll();
            this.opened = false;
            document.body.style.overflow = '';
            this.$root.classList.add(root + "-hide");
        };
        Popup.prototype.open = function (stage) {
            this.disableScroll();
            this.opened = true;
            if (!this.was_open)
                this.was_open = true;
            if (this.stage !== stage)
                this.stage = stage;
            document.body.style.overflow = 'hidden';
            show(this.$root);
            if (this.stage === 'confirm') {
                hide(this.$container);
                show(this.$confirm);
                ga('send', 'event', {
                    eventCategory: 'application',
                    eventAction: 'open-suggestion',
                    eventLabel: location.pathname
                });
            }
            else {
                hide(this.$confirm);
                show(this.$container);
                ga('send', 'event', {
                    eventCategory: 'open-configurator',
                    eventAction: Lx_model,
                    eventLabel: location.pathname
                });
            }
            this.$root.focus();
        };
        Popup.prototype.preventDefault = function (e) {
            e = e || window.event;
            if (e.preventDefault)
                e.preventDefault();
            e.returnValue = false;
        };
        Popup.prototype.preventDefaultForScrollKeys = function (e) {
            // left: 37, up: 38, right: 39, down: 40,
            // spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
            var keysToDisable = { 37: 1, 38: 1, 39: 1, 40: 1, 32: 1, 33: 1, 34: 1, 35: 1, 36: 1 };
            if (keysToDisable[e.keyCode]) {
                e = e || window.event;
                if (e.preventDefault)
                    e.preventDefault();
                e.returnValue = false;
                return false;
            }
        };
        Popup.prototype.disableScroll = function () {
            if (window.addEventListener)
                window.addEventListener('DOMMouseScroll', this.preventDefault, false);
            window.onwheel = this.preventDefault; // modern standard
            window.onmousewheel = document.onmousewheel = this.preventDefault; // older browsers, IE
            window.ontouchmove = this.preventDefault; // mobile
            document.onkeydown = this.preventDefaultForScrollKeys;
        };
        Popup.prototype.enableScroll = function () {
            if (window.removeEventListener)
                window.removeEventListener('DOMMouseScroll', this.preventDefault, false);
            window.onmousewheel = document.onmousewheel = null;
            window.onwheel = null;
            window.ontouchmove = null;
            document.onkeydown = null;
        };
        return Popup;
    }());
    function show($element) {
        $element.classList.remove(root + "-hide");
    }
    function hide($element) {
        $element.classList.add(root + "-hide");
    }
    function capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    init();
})();
//# sourceMappingURL=script.js.map