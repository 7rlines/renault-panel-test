(function () {
    // флаг о том что модуль уже загружен на странице
    window.renaultButton = true;
    // Классификация устройства
    var device = document.documentElement.clientWidth > 1000 ? 'desktop' : 'mobile';
    // Положение кнопки для открытия конфигурация
    var button_state = 'top';
    // Базовая ссылка на ресурсы
    var path = 'http://renault.7rlines.com/';
    // селектор контейнера с картинкой в котором должна появиться кнопка
    var victimSelector = '.article_image, .bigNodeImage, .topArticlesListImage, .image-micro-schema, .main-article-figure, .video-player, .article-image';
    // селектор элемента из которого можно получить название модели
    var getModelTextSelector = '.model-name, .model_name, .article-text, .car-tag .preview .name .transition_link, .textpage, .article__content';
    // селектор статьи
    var articleContainerSelector = '.description, #content, article, .main-article, .main-article.hreview, textpage, .page, .main';
    // массив возможных моделей
    var availableModelNames = ['kaptur', 'koleos', 'logan', 'sandero', 'sandero-stepway', 'duster', 'dokker'];
    // найденное имя модели
    var modelFoundOnPage = 'kaptur';
    // получить случайно число в периоде от заданных
    var getRandomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    // найти родителя по селектору
    var getParentBySelector = function (el, sl) {
        while (el = el.parentElement) {
            if (el.matches(sl) || (el.matchesSelector && el.matchesSelector(sl))) {
                return el;
            }
        }
    };
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
    // Изображение на котором должна быть картинка
    var $image = find(victimSelector);
    // Статья после которой должна быть кнопка
    var $article = find(articleContainerSelector);
    // Получает имя домена
    var $domainName = null;
    // Оригинальный размер статьи
    var $originArticleRect = null;
    // Означает что первая кнопка загружена
    var button_init = false;
    var app_init = false;
    // Повесить обработчик после загрузки DOM
    document.addEventListener('DOMContentLoaded', function () { return renaultButton(); });
    // Контейнер для стилей
    var $style = create('style');
    // Встраиваем контейнер в head
    document.head.appendChild($style);
    // Идентификаторы индексаторов
    var Ga_id = 'UA-75083026-5';
    var Ya_id = '48519794';
    //id used for site we are indexing
    var platformId = 'zr';
    // Универсальная рассылка событий индексаторам
    var sendEventToAnalytics = function (eAction, category) {
        if (!eAction || typeof (eAction) == "undefined") {
            return false;
        }
        category = (!category || typeof (category) == "undefined") ? 'button' : category;
        var timeoutForFirstSetOfEvents = 1000; //in order to ga create finishes until first event fires
        setTimeout(function () {
            window.ga('renaultAnalytics.send', {
                hitType: 'event',
                eventCategory: category,
                eventAction: eAction,
                eventLabel: location.pathname
            });
            timeoutForFirstSetOfEvents = 0;
        }, timeoutForFirstSetOfEvents);
        var goalParams = { 'category': category };
        var goalCB = function (err) {
            //console.log('YA CB ♦ ',err,this);
        };
        try {
            window['yaCounter' + Ya_id].reachGoal(category + ': ' + eAction, goalParams, goalCB);
        }
        catch (e) {
            console.log('Something is wrong with Yandex analytics: ', e);
        }
    };
    var isMobile = function () {
        if (document.documentElement.clientWidth < 800) {
            return true;
        }
        else {
            return false;
        }
    };
    var loadScript = function (url, loadHandler) {
        if (url === void 0) { url = null; }
        if (!url) {
            return false;
        }
        var scriptDom = document.createElement('script');
        scriptDom.setAttribute('async', '');
        scriptDom.type = 'text/javascript';
        scriptDom.onload = loadHandler;
        scriptDom.src = url;
        document.body.appendChild(scriptDom);
        return scriptDom;
    };
    function renaultButton() {
        // Обработчик для кнопки "Добавить товар"
        function init() {
            device = document.documentElement.clientWidth > 1000 ? 'desktop' : 'mobile';
            $article = find(articleContainerSelector);
            $image = find(victimSelector); //.story-photo
            if (!$image) {
                setTimeout(function () {
                    init();
                }, 100);
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
            var Button = /** @class */ (function () {
                function Button($root, type) {
                    this.$root = $root;
                    this.type = type;
                    this.$button = create('div');
                    this.view_init();
                    this.style_init();
                    this.scene_init();
                }
                Button.prototype.getViewportOnClassInit = function () {
                    if (window.innerWidth !== undefined && window.innerHeight !== undefined) {
                        var w = window.innerWidth;
                        var h = window.innerHeight;
                    }
                    else {
                        var w = document.documentElement.clientWidth;
                        var h = document.documentElement.clientHeight;
                    }
                    return { width: w, height: h };
                };
                Button.prototype.view_init = function () {
                    var viewport = this.getViewportOnClassInit();
                    if ((document.location.host.indexOf('autonews') >= 0) || (document.location.host.indexOf('rbc') >= 0)) {
                        this.$button.classList.add("platform-rbc");
                    }
                    if (document.location.host.indexOf('avtovzglyad') >= 0) {
                        this.$button.classList.add("avtovzglyad-mobile");
                    }
                    if (document.location.host.indexOf('m.zr.ru') >= 0) {
                        this.$button.classList.add(root + "-mobile-button");
                    }
                    this.$button.classList.add(root + "-button");
                    this.$button.innerHTML = "\n                    <span class=\"" + root + "-logo\"></span>\n                    <span class=\"" + root + "-divider\"></span>\n                    <span class=\"" + root + "-aligner\">\n                        <img class=\"" + root + "-text\" src=\"" + path + "imgs/renault_text.svg\" />    \n                    </span>\n                    \n                    <span class=\"" + root + "-arrow\">\n                        <span class=\"" + root + "-decor\"></span>\n                        <span class=\"" + root + "-arrow-clickable\"></span>\n                    </span>\n                ";
                    var isMobileViewport = 0;
                    if (isMobile()) {
                        isMobileViewport = 300;
                    }
                    if (((document.location.host.indexOf('avg') >= 0) || (document.location.host.indexOf('avtovzglyad') >= 0))
                        && ($article.getBoundingClientRect().height < (viewport.height + isMobileViewport))) {
                        if (this.type === 'image' && this.$button.parentNode && this.$button) {
                            this.$button.parentNode.removeChild(this.$button);
                        }
                        else {
                            this.$button.classList.add(root + "-bottom");
                        }
                    }
                    else {
                        if (this.type === 'image') {
                            this.$button.classList.add(root + "-image");
                            this.$root.style.position = 'relative';
                            if ((document.location.host.indexOf('avg') >= 0) || (document.location.host.indexOf('avtovzglyad') >= 0)) {
                                this.$button.classList.add("platform-avg");
                            }
                            if ((document.location.host.indexOf('zr')) >= 0) {
                                this.$button.classList.add(root + "-image-zr");
                            }
                        }
                        else {
                            this.$button.classList.add(root + "-article");
                        }
                    }
                    var self = this;
                    this.$button.addEventListener('click', function (event) {
                        self.open(event);
                    });
                    this.$root.appendChild(this.$button);
                };
                Button.prototype.style_init = function () {
                    if (Button.isStylesInit) {
                        return;
                    }
                    Button.isStylesInit = true;
                    var size = 5; // default 5 (нормально 4 - 6)
                    var adaptive_height = function (value) {
                        return "\n                        height: " + value + "vw !important;\n                        min-height: " + value * (size + 3) + "px !important;\n                        max-height: " + value * (size + 4) + "px !important;\n                        ";
                    };
                    var styles = "\n                    ." + root + "-button." + root + "-mobile-button {\n                        font-size: 20px;\n                    }\n                    ." + root + "-button {\n                        font-size: 25px;\n                        position: relative;\n                        border: 1px solid #FECB39 !important;\n                        background: #FECB39 !important;\n                        padding: 0 2em 0 0.4em !important;\n                        max-width: 9.92em;\n                        height: 2em !important;\n                        min-height: 1.92em !important;\n                        max-height: 2.16em !important;\n                        cursor: pointer !important;\n                        display: flex !important;\n                        align-items: center;\n                        justify-content: space-between;\n                        box-shadow: none !important;\n                        border-radius: 0 !important;\n                        text-shadow: none !important;\n                        width: auto !important;\n                        margin: 0.4em 0;\n                    }              \n                    ." + root + "-button ." + root + "-logo {\n                        background: url('" + path + "imgs/renault_logo.svg') 50% 50% transparent no-repeat;\n                        background-size: contain;\n                        width: 4em;\n                        max-width: 4.04em;\n                        height: 1.36em;\n                        min-height: 1.3em !important;\n                        max-height: 1.4em !important;\n                        display: block !important;\n                    }\n                    ." + root + "-button ." + root + "-divider {\n                        background: #ffffff;\n                        min-width: 0.12em;\n                        width: 0.16em;\n                        margin: 0 0.32em !important;\n                        max-width: 0.24em;\n                        height: 1.36em;\n                        min-height: 1.3em !important;\n                        max-height: 1.4em !important;\n                        display: flex !important;\n                        margin: 0 0.32em;\n                    }\n                    ." + root + "-button ." + root + "-aligner {\n                        display: flex;\n                        align-items: center;\n                        justify-content: center;\n                    }\n                    ." + root + "-button ." + root + "-text {\n                        width: 2.64em;\n                        max-width: 2.65em !important;\n                        margin-top: 0.04em !important;\n                        height: 0.82em !important;\n                        min-height: 0.8em !important;\n                        max-height: 0.84em !important;\n                        display: flex !important;\n                    }\n                    ." + root + "-button-hover {\n                        background: #ffffff !important;\n                        border-color: #AAA7AB !important;\n                    }\n                    ." + root + "-button-hover ." + root + "-divider {\n                        background: #FECE17 !important;\n                    }\n                    ." + root + "-button ." + root + "-arrow {\n                        height: 0.04em;\n                        width: 0.04em;\n                        position: absolute;\n                        background: transparent;\n                        display: inline-block;\n                        right: 0.8em;\n                        top: 50%\n                    }\n                    ." + root + "-button ." + root + "-arrow > ." + root + "-decor {\n                        position: absolute;\n                        display: inline-block;\n                        height: 0.4em;\n                        width: 0.48em;\n                        top: -0.2em;\n                        right: 0;\n                    }\n                    ." + root + "-rotate180 {\n                        -webkit-transform: rotate(180deg);\n                        -moz-transform: rotate(180deg);\n                        -ms-transform: rotate(180deg);\n                        -o-transform: rotate(180deg);\n                    }\n                    ." + root + "-button ." + root + "-arrow > ." + root + "-decor:before {\n                        content: '';\n                        height: 0.16em;\n                        width: 0.48em;\n                        -webkit-transform: rotate(45deg);\n                        -moz-transform: rotate(45deg);\n                        -ms-transform: rotate(45deg);\n                        -o-transform: rotate(45deg);\n                        position: absolute;\n                        background: #000000;\n                        display: inline-block;\n                        right: 0;\n                        top: 0px;\n                    }\n                    ." + root + "-button ." + root + "-arrow > ." + root + "-decor:after {\n                        content: '';\n                        height: 0.16em;\n                        width: 0.48em;\n                        -webkit-transform: rotate(-45deg);\n                        -moz-transform: rotate(-45deg);\n                        -ms-transform: rotate(-45deg);\n                        -o-transform: rotate(-45deg);\n                        position: absolute;\n                        background: #000000;\n                        display: inline-block;\n                        right: 0;\n                        bottom: 0px;\n                    }\n                    ." + root + "-button ." + root + "-arrow-clickable {\n                        height: 2.4em;\n                        width: 2.6em;\n                        left: -1.6em;\n                        top: -1.2em;\n                        position: absolute;\n                        -webkit-touch-callout: none; /* iOS Safari */\n                        -webkit-user-select: none; /* Safari */\n                        -khtml-user-select: none; /* Konqueror HTML */\n                        -moz-user-select: none; /* Firefox */\n                        -ms-user-select: none; /* Internet Explorer/Edge */\n                        user-select: none; /* Non-prefixed version, currently supported by Chrome and Opera */\n                    }\n                    @media(max-width:1000px) {\n                        ." + root + "-fluid {\n                            z-index: 5000;\n                            position: fixed;\n                            top: 100px;\n                            left: 0;\n                            transform: none;\n                        }\n                        ." + root + "-button.avtovzglyad-mobile {\n                            font-size: 20px;\n                        }\n                    }\n                   @media(max-width:1024px) {\n                       .platform-rbc." + root + "-fluid {\n                           top: 300px;\n                       }\n                   }\n                   @media(min-width:1024px) {\n                       .platform-rbc." + root + "-fluid {\n                           top: 550px;\n                       }\n                   }\n                   @media(max-height:650px) and (min-width:1024px) {\n                       .platform-rbc." + root + "-fluid {\n                           top: 86vh; \n                       }\n                   }\n                   @media(max-height:360px) {\n                       .platform-rbc." + root + "-fluid {\n                           top: 170px;\n                       }\n                   }\n                    @media(min-width:1000px) {\n                        ." + root + "-fluid {\n                            z-index: 5000;\n                            position: fixed;\n                            top: 100px;\n                            left: 0;\n                            transform: none;\n                        }\n                    }\n                    ." + root + "-bottom {\n                        max-width: 10.04em;\n                        box-sizing: border-box;\n                        -moz-box-sizing: border-box;\n                        -webkit-box-sizing: border-box;\n                    }\n                    ." + root + "-bottom ." + root + "-divider {\n                        flex-grow: 0;\n                        flex-shrink: 0;\n                        flex-basis: auto;\n                    }\n                    .target-image {\n                        position: relative;\n                    }\n                    ." + root + "-button." + root + "-image {\n                        position: absolute;\n                        bottom: 2.5vw;\n                        left: 1.0vw;\n                        transform: none;\n                    }\n                    .platform-rbc." + root + "-button." + root + "-image {\n                        z-index: 999;\n                        bottom: 16vw;\n                    }\n                    @media (max-width: 1024px) {\n                        ." + root + "-button.platform-rbc {\n                            font-size: 20px;\n                        }                     \n                        .platform-rbc." + root + "-button." + root + "-image {\n                            bottom: 2.5vw;\n                        }\n                    }\n                    @media (max-width: 767px) {\n                        ." + root + "-button." + root + "-image.platform-avg {\n                            bottom: 5vw;\n                        }\n                    }\n                    ." + root + "-button." + root + "-image." + root + "-image-zr {\n                        position: absolute;\n                        bottom: 0.5vw;\n                        left: 1.0vw;\n                        transform: none;\n                        box-sizing: border-box !important;\n                    }\n                ";
                    $style.innerHTML += styles;
                };
                Button.prototype.scene_init = function () {
                    this.$button.addEventListener('mouseover', function () {
                        if (isMobile()) {
                            return;
                        }
                        this.classList.add(root + "-button-hover");
                    });
                    this.$button.addEventListener('mouseout', function () {
                        if (isMobile()) {
                            return;
                        }
                        this.classList.remove(root + "-button-hover");
                    });
                    if (!button_init) {
                        return button_init = true;
                    }
                    // Обьект для проверки было ли инициализировано ga логирование
                    var ga_triggered = { top: false, left: false, bottom: false };
                    var ga_trigger = function (state, update) {
                        if (update) {
                            button_state = state;
                        }
                        if (ga_triggered[state ? state : button_state]) {
                            return null;
                        }
                        sendEventToAnalytics('show-' + button_state);
                        sendEventToAnalytics(modelFoundOnPage + '-show-' + button_state);
                        ga_triggered[button_state] = true;
                    };
                    ga_trigger('top', true);
                    var $article_button = (this.type !== 'image') ? this.$button : find("." + root + "-button:not(." + root + "-image)");
                    var $image_button = (this.type === 'image') ? this.$button : find("." + root + "-button." + root + "-image");
                    // Переменные для реализации анимированной перетекающей кнопки
                    var fluidButtonLogo = $article_button.getElementsByClassName(root + "-logo")[0];
                    var fluidButtonDivider = $article_button.getElementsByClassName(root + "-divider")[0];
                    var fluidButtonAligner = $article_button.getElementsByClassName(root + "-aligner")[0];
                    var fluidButtonArrow = $article_button.getElementsByClassName(root + "-arrow")[0];
                    var fluidButtonArrowDecor = $article_button.getElementsByClassName(root + "-decor")[0];
                    var fluidButtonArrowClickable = $article_button.getElementsByClassName(root + "-arrow-clickable")[0];
                    // Переменные для бокового состояния кнопки на мобильных устройствах
                    var fluidButtonState = 'hide'; // Три возможных состояния: скрыта, анимация, открыта
                    var fluidButtonAnimateTic = 0; // Для анимации открытия и закрытия
                    // Мгновенно сделать видимость кнопки спрятанной.
                    function hideFluidButton() {
                        fluidButtonLogo.style.setProperty('display', 'none', 'important');
                        fluidButtonDivider.style.setProperty('display', 'none', 'important');
                        fluidButtonAligner.style.setProperty('display', 'none', 'important');
                        fluidButtonArrow.style.setProperty('right', '12px', 'important');
                        $article_button.style.setProperty('padding', '0 0', 'important');
                        $article_button.style.setProperty('width', '40px', 'important');
                        fluidButtonArrowDecor.classList.remove(root + "-rotate180");
                    }
                    // Мгновенно сделать видимость кнопки показанной.
                    function showFluidButton() {
                        fluidButtonLogo.style.setProperty('display', '');
                        fluidButtonDivider.style.setProperty('display', '');
                        fluidButtonAligner.style.setProperty('display', '');
                        fluidButtonArrow.style.setProperty('right', '');
                        if (isMobile() && $article_button.classList.contains(root + "-fluid") && !((document.location.host.indexOf('zr')) >= 0)) {
                            // fluidButtonArrowDecor.classList.add(`${root}-rotate180`);
                        }
                        else {
                            fluidButtonArrowDecor.classList.remove(root + "-rotate180");
                        }
                        $article_button.removeAttribute("style");
                    }
                    var shomAnimationTimer;
                    function startShowAnimation() {
                        if (shomAnimationTimer) {
                            clearTimeout(shomAnimationTimer);
                        }
                        if (hideAnimationTimer) {
                            clearTimeout(shomAnimationTimer);
                        }
                        hideFluidButton();
                        fluidButtonAnimateTic = 0;
                        fluidButtonState = 'animate';
                        function animate() {
                            fluidButtonAnimateTic++;
                            fluidButtonArrow.style.setProperty('right', (12 + (0.32 * fluidButtonAnimateTic)) + "px", 'important');
                            $article_button.style.setProperty('width', (40 + 7.24 * fluidButtonAnimateTic) + "px", 'important');
                            if (fluidButtonAnimateTic < 25) {
                                shomAnimationTimer = setTimeout(animate, 10);
                            }
                            else {
                                showFluidButton();
                                fluidButtonState = 'show';
                            }
                        }
                        shomAnimationTimer = setTimeout(animate, 10);
                    }
                    var hideAnimationTimer;
                    function startHideAnimation() {
                        if (shomAnimationTimer) {
                            clearTimeout(shomAnimationTimer);
                        }
                        if (hideAnimationTimer) {
                            clearTimeout(shomAnimationTimer);
                        }
                        fluidButtonLogo.style.setProperty('display', 'none', 'important');
                        fluidButtonDivider.style.setProperty('display', 'none', 'important');
                        fluidButtonAligner.style.setProperty('display', 'none', 'important');
                        $article_button.style.setProperty('width', '248px', 'important');
                        fluidButtonAnimateTic = 0;
                        fluidButtonState = 'animate';
                        function animate() {
                            fluidButtonAnimateTic++;
                            fluidButtonArrow.style.setProperty('right', (20 - (0.32 * fluidButtonAnimateTic)) + "px", 'important');
                            $article_button.style.setProperty('width', (248 - (7.24 * fluidButtonAnimateTic)) + "px", 'important');
                            if (fluidButtonAnimateTic < 25) {
                                shomAnimationTimer = setTimeout(animate, 10);
                            }
                            else {
                                hideFluidButton();
                                fluidButtonState = 'hide';
                            }
                        }
                        shomAnimationTimer = setTimeout(animate, 10);
                    }
                    // Установить видимость кнопки исходя из её состояния, кроме тех случаев когда это не надо.
                    function updateFluidButtonView(forceShow) {
                        if (forceShow === void 0) { forceShow = false; }
                        if (!isMobile() || forceShow) {
                            showFluidButton();
                        }
                        else {
                            if (fluidButtonState == 'hide') {
                                hideFluidButton();
                            }
                            else if (fluidButtonState == 'show') {
                                showFluidButton();
                            }
                        }
                    }
                    updateFluidButtonView();
                    fluidButtonArrowClickable.addEventListener('click', function (event) {
                        if (isMobile() && $article_button.classList.contains(root + "-fluid") && fluidButtonState !== 'animate') {
                            if (fluidButtonState == 'hide') {
                                startShowAnimation();
                            }
                            else if (fluidButtonState == 'show') {
                                startHideAnimation();
                            }
                        }
                    });
                    // Обработка свайпа!
                    var swipeState = 'idle';
                    var swipeStartTime = 0;
                    var swipeStartX = 0;
                    var swipeStartY = 0;
                    var swipeMaxXForStart = 110; // На каком растоянии от края должен быть начат свайп, чтобы засчитать его.
                    var swipeTime = 250; // В течении какого времени должен быть сделан свайп, чтобы засчитать его.
                    var swipeThreshold = 110; // На сколько далеко нужно сделать дижение от места начала свайпа, чтобы засчитать его.
                    document.addEventListener('touchstart', function (e) {
                        if ($article_button.classList.contains(root + "-fluid")) {
                            var touchobj = e.changedTouches[0];
                            if (fluidButtonState === 'hide' && touchobj.pageX < document.documentElement.clientWidth / 2) {
                                // Свайп слева
                                if (touchobj.pageX <= swipeMaxXForStart) {
                                    swipeState = 'sweepFromLeft';
                                    swipeStartTime = Date.now();
                                    swipeStartX = touchobj.pageX;
                                    swipeStartY = touchobj.pageY;
                                }
                            }
                            else if (fluidButtonState === 'show') {
                                // Свайп справа
                                if ((document.documentElement.clientWidth - touchobj.pageX) <= swipeMaxXForStart) {
                                    swipeState = 'sweepFromRight';
                                    swipeStartTime = Date.now();
                                    swipeStartX = touchobj.pageX;
                                    swipeStartY = touchobj.pageY;
                                }
                            }
                        }
                    });
                    document.addEventListener('touchmove', function (e) {
                    });
                    document.addEventListener('touchend', function (e) {
                        if (swipeState == 'sweepFromLeft') {
                            // Свайп с лева на право
                            if (Date.now() - swipeStartTime < swipeTime) {
                                var touchobj = e.changedTouches[0];
                                if (touchobj.pageX < swipeStartX) {
                                    // Если движение идёт справо на лево, то это не свайп с лева.
                                    return;
                                }
                                var distanceX = touchobj.pageX - swipeStartX;
                                var distanceY = (touchobj.pageY >= swipeStartY) ? touchobj.pageY - swipeStartY : swipeStartY - touchobj.pageY;
                                if (distanceY > distanceX) {
                                    // Если изменения по высоте больше, чем изменения по ширене, то это не свайп.
                                    return;
                                }
                                if (distanceY > 15) {
                                    // Если изменения по высоте больше, чем надо, то это не свайп.
                                    return;
                                }
                                if (distanceX > swipeThreshold) {
                                    startShowAnimation();
                                }
                            }
                        }
                        else if (swipeState == 'sweepFromRight') {
                            // Свайп с права на лево.
                            if (Date.now() - swipeStartTime < swipeTime) {
                                var touchobj = e.changedTouches[0];
                                if (touchobj.pageX > swipeStartX) {
                                    // Если движение идёт слева на право, то это не свайп с права.
                                    return;
                                }
                                var distanceX = swipeStartX - touchobj.pageX;
                                var distanceY = (touchobj.pageY >= swipeStartY) ? touchobj.pageY - swipeStartY : swipeStartY - touchobj.pageY;
                                if (distanceY > distanceX) {
                                    // Если изменения по высоте больше, чем изменения по ширене, то это не свайп.
                                    return;
                                }
                                if (distanceY > 15) {
                                    // Если изменения по высоте больше, чем надо, то это не свайп.
                                    return;
                                }
                                if (distanceX > swipeThreshold) {
                                    startHideAnimation();
                                }
                            }
                        }
                    });
                    // Класс для перетекания кнопки в бок
                    var fluid = root + "-fluid";
                    var topTrigger = false;
                    var bottomTrigger = true;
                    var bottomTriggered = false;
                    var heightDetectionTrigger = false;
                    var articleStarted = false;
                    function getViewport() {
                        if (window.innerWidth !== undefined && window.innerHeight !== undefined) {
                            var w = window.innerWidth;
                            var h = window.innerHeight;
                        }
                        else {
                            var w = document.documentElement.clientWidth;
                            var h = document.documentElement.clientHeight;
                        }
                        return { width: w, height: h };
                    }
                    function elementInViewport(el, partially) {
                        var partially = (typeof (partially) != 'undefined') ? true : false;
                        var rect = el.getBoundingClientRect();
                        if (partially) {
                            return rect.bottom > 0 &&
                                rect.right > 0 &&
                                rect.left < (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */ &&
                                rect.top < (window.innerHeight || document.documentElement.clientHeight) /* or $(window).height() */;
                        }
                        else {
                            return (rect.top >= 0 &&
                                rect.left >= 0 &&
                                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
                                rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */);
                        }
                    }
                    function setButtonPosition() {
                        var pageScrolledToStartOfImage = false;
                        var rectImage = $image.getBoundingClientRect();
                        pageScrolledToStartOfImage = (rectImage.top < 0) ? true : false;
                        var articleScrolledToEnd = false;
                        var rectArticle = $article.getBoundingClientRect();
                        if ($originArticleRect === null) {
                            $originArticleRect = $article.getBoundingClientRect();
                        }
                        if ((rectArticle.top < 0) && (Math.abs(rectArticle.top) >= ($originArticleRect.height - getViewport()['height']))) {
                            articleScrolledToEnd = true;
                        }
                        else {
                            articleScrolledToEnd = false;
                        }
                        if (elementInViewport($article, true) && pageScrolledToStartOfImage) {
                            articleStarted = true;
                        }
                        else {
                            articleStarted = false;
                        }
                        if (articleScrolledToEnd) {
                            $article_button.classList.remove(fluid);
                            $article_button.classList.add(root + "-bottom");
                            $article_button.style.setProperty('max-width', '248px', 'important');
                            ga_trigger('bottom', true);
                            var $article_bottom = find_all('.article_bottom')[0];
                            if ($article_bottom) {
                                $article_bottom.appendChild($article_button);
                            }
                            bottomTriggered = true;
                            updateFluidButtonView(true);
                        }
                        else {
                            if ($article_button && articleStarted) {
                                if (elementInViewport($image_button, false) || articleScrolledToEnd) {
                                    $article_button.classList.remove(fluid);
                                    $article_button.classList.add(root + "-bottom");
                                    $article_button.style.setProperty('max-width', '248px', 'important');
                                    updateFluidButtonView(true);
                                }
                                else {
                                    $article_button.classList.add(fluid);
                                    $article_button.classList.remove(root + "-bottom");
                                    ga_trigger('left', true);
                                    updateFluidButtonView();
                                }
                            }
                        }
                    }
                    window.addEventListener('load', setButtonPosition);
                    window.addEventListener('scroll', setButtonPosition);
                    window.addEventListener('resize', setButtonPosition);
                    $article_button.onceHovered = false;
                    $article_button.onceHoveredFluid = false;
                    $article_button.addEventListener('mouseover', function (e) {
                        var isFluid = $article_button.classList.contains(root + "-fluid");
                        if ((!$article_button.onceHoveredFluid && isFluid) || (!$article_button.onceHovered && !isFluid)) {
                            /*ga('send', 'event', {
                                eventCategory: 'button',
                                eventAction: (isFluid)? `interacted-floated-button` : `interacted-bottom-button`,
                                eventLabel: location.pathname
                            });*/
                            sendEventToAnalytics(((isFluid) ? 'floated-button-hover' : 'bottom-button-hover'));
                            sendEventToAnalytics(((isFluid) ? (modelFoundOnPage + '-floated-button-hover') : (modelFoundOnPage + '-bottom-button-hover')));
                        }
                        if (isFluid) {
                            $article_button.onceHoveredFluid = true;
                        }
                        else {
                            $article_button.onceHovered = true;
                        }
                    });
                    $image_button.onceHovered = false;
                    $image_button.addEventListener('mouseover', function (e) {
                        if (!$image_button.onceHovered) {
                            /*ga('send', 'event', {
                                eventCategory: 'button',
                                eventAction: `interacted-top-button`,
                                eventLabel: location.pathname
                            });
                            window[window.yaKey].reachGoal('ButtonInteraction: ' + 'hover_top');*/
                            sendEventToAnalytics('top-button-hover');
                            sendEventToAnalytics(modelFoundOnPage + '-top-button-hover');
                        }
                        $image_button.onceHovered = true;
                    });
                };
                Button.prototype.open = function (event) {
                    if (isMobile() &&
                        this.type !== 'image' &&
                        this.$button.classList.contains(root + "-fluid") &&
                        (event.target.className.indexOf(root + "-decor") !== -1 ||
                            event.target.className.indexOf(root + "-arrow-clickable") !== -1 ||
                            event.target.className.indexOf(root + "-arrow") !== -1)) {
                        return;
                    }
                    function $upTo(el, elClass) {
                        if (el.classList.contains(elClass)) {
                            return el;
                        }
                        while (el && el.parentNode) {
                            el = el.parentNode;
                            if (el.classList && (el.classList.contains(elClass))) {
                                return el;
                            }
                        }
                        return null;
                    }
                    if (event === 'auto') {
                        popup.open('confirm');
                    }
                    else {
                        popup.open('model');
                        var $element = $upTo(event.target, root + "-button");
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
                            /*ga('send', 'event', {
                                eventCategory: 'button',
                                eventAction: `click-${$elementType}`,
                                eventLabel: location.pathname
                            })*/
                            sendEventToAnalytics("click-" + $elementType);
                            sendEventToAnalytics(modelFoundOnPage + ("-click-" + $elementType));
                        }
                    }
                };
                Button.isStylesInit = false;
                return Button;
            }());
            if ($article !== null) {
                new Button($article);
            }
            if ($image !== null) {
                new Button($image, 'image');
            }
        }
        // Класс описания компонента (Всплывающие окно)
        var Popup = /** @class */ (function () {
            function Popup() {
                this.$root = create(root + "-popup");
                this.$container = create(root + "-container");
                this.$confirm = create(root + "-confirm");
                this.$showroom = null;
                this.$showroom_loaded = false;
                this.can_auto = false;
                this.was_open = false;
                this.opened = false;
                this.stage = 'confirm';
                var self = this;
                /*ga('send', 'event', {
                    eventCategory: 'application',
                    eventAction: 'load',
                    eventLabel: location.pathname
                });*/
                this.view_init();
                sendEventToAnalytics('load', 'application');
                sendEventToAnalytics(modelFoundOnPage + '-load', 'application');
                this.style_init();
                this.auto_open();
            }
            // Инициализация представления
            Popup.prototype.view_init = function () {
                var self = this;
                self.$root.tabIndex = -1;
                self.$root.addEventListener('keydown', function (event) { return event.key === 'Escape' ? self.close() : null; });
                self.$container.classList.add(root + "-hide");
                if (document.location.host.indexOf('avtovzglyad') >= 0 || document.location.host.indexOf('avg') >= 0) {
                    self.$root.classList.add("avtovzglyad");
                }
                var isIE11 = document.body.style.msTextCombineHorizontal !== undefined;
                var sourceForModelName = find_all(getModelTextSelector);
                if (sourceForModelName) {
                    for (var _i = 0, sourceForModelName_1 = sourceForModelName; _i < sourceForModelName_1.length; _i++) {
                        var sourceName = sourceForModelName_1[_i];
                        var modelName = (sourceName.innerText || sourceName.textContent).toLowerCase();
                        for (var _a = 0, availableModelNames_1 = availableModelNames; _a < availableModelNames_1.length; _a++) {
                            var modelNme = availableModelNames_1[_a];
                            if (isIE11) {
                                if (!String.prototype.includes) {
                                    String.prototype.includes = function (search, start) {
                                        'use strict';
                                        if (typeof start !== 'number') {
                                            start = 0;
                                        }
                                        if (start + search.length > this.length) {
                                            return false;
                                        }
                                        else {
                                            return this.indexOf(search, start) !== -1;
                                        }
                                    };
                                }
                                if (modelName.includes(modelNme, 0)) {
                                    modelFoundOnPage = modelNme;
                                    break;
                                }
                            }
                            else {
                                if (modelName.includes(modelNme)) {
                                    modelFoundOnPage = modelNme;
                                    break;
                                }
                            }
                        }
                    }
                }
                else {
                    modelFoundOnPage = availableModelNames[getRandomInt(0, (availableModelNames.length - 1))];
                }
                var statsChangeHandler = function (type) {
                    sendEventToAnalytics(type, 'configurator');
                    sendEventToAnalytics(modelFoundOnPage + '-' + type, 'configurator');
                };
                var ShowroomPush = function () {
                    RenaultShowroom.push('embed', {
                        vitrine: modelFoundOnPage,
                        container: root + "-container",
                        ready: function (showroom) { return self.$showroom = showroom; },
                        stat: function (type) {
                            statsChangeHandler(type);
                            console.log('showroom stat:', type, self.$showroom);
                        }
                    });
                };
                if (modelFoundOnPage == 'koleos') {
                    console.log('Koleos');
                    RenaultShowroom.push("token", "e536ed9d2a721c7a76d569c523ce6de3e2f930c263580870438cb6bb813e4895.external-vitrine");
                    loadScript('https://renault-showroom.slava.digital/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (modelFoundOnPage == 'kaptur') {
                    console.log('Kaptur');
                    RenaultShowroom.push("token", "003487471d9735cf4d809915a4277cd7b8692bf6f4c257f08026476179308cd4.external-vitrine");
                    loadScript('https://renault-showroom.slava.digital/vitrines/static/js/embed.js', ShowroomPush());
                }
                // Элемент "фоновая подложка"
                function $background() {
                    var $bg = create(root + "-back");
                    $bg.onceHovered = false;
                    $bg.addEventListener('mouseover', function () {
                        if (!$bg.onceHovered) {
                            sendEventToAnalytics('bg-close-hover', 'popup');
                            sendEventToAnalytics(modelFoundOnPage + '-bg-close-hover', 'popup');
                        }
                        $bg.onceHovered = true;
                    });
                    $bg.addEventListener('click', function (e) {
                        self.close.bind(self);
                        sendEventToAnalytics('bg-close-click', 'popup');
                        sendEventToAnalytics(modelFoundOnPage + '-bg-close-click', 'popup');
                    });
                    return $bg;
                }
                function $close() {
                    var $close = create('button');
                    $close.classList.add(root + "-close");
                    $close.innerHTML = '';
                    $close.onceHovered = false;
                    $close.addEventListener('mouseover', function () {
                        if (!$close.onceHovered) {
                            sendEventToAnalytics('on-cross-close-hover', 'popup');
                            sendEventToAnalytics(modelFoundOnPage + '-on-cross-close-hover', 'popup');
                        }
                        $close.onceHovered = true;
                    });
                    $close.addEventListener('click', function () {
                        self.close();
                        sendEventToAnalytics('on-cross-close-click', 'popup');
                        sendEventToAnalytics(modelFoundOnPage + '-on-cross-close-click', 'popup');
                    });
                    return $close;
                }
                var $buttons = create('div'), $accept = create('button'), $decline = create('button'), $image = create('img'), text = "\u0412\u044B \u0445\u043E\u0442\u0438\u0442\u0435 \u043E\u0442\u043A\u0440\u044B\u0442\u044C \u043A\u043E\u043D\u0444\u0438\u0433\u0443\u0440\u0430\u0446\u0438\u044E \u0434\u043B\u044F " + capitalize(modelFoundOnPage) + " ?";
                $image.src = path + "imgs/models/" + modelFoundOnPage + ".jpg";
                self.$confirm.appendChild($image);
                self.$confirm.classList.add(root + "-hide");
                $buttons.classList.add(root + "-buttons");
                $accept.innerHTML = 'Узнать конфигурации';
                $accept.classList.add(root + "-accept");
                $accept.onceHovered = false;
                $accept.addEventListener('mouseover', function () {
                    if (!$accept.onceHovered) {
                        sendEventToAnalytics('on-about-config-hover', 'popup');
                        sendEventToAnalytics(modelFoundOnPage + '-on-about-config-hover', 'popup');
                    }
                    $accept.onceHovered = true;
                });
                $accept.addEventListener('click', function () {
                    self.open('model');
                    sendEventToAnalytics('on-about-config-click', 'popup');
                    sendEventToAnalytics(modelFoundOnPage + '-on-about-config-click', 'popup');
                });
                $decline.innerHTML = 'Нет, спасибо';
                $decline.classList.add(root + "-decline");
                $decline.onceHovered = false;
                $decline.addEventListener('mouseover', function () {
                    if (!$decline.onceHovered) {
                        sendEventToAnalytics('on-decline-config-hover', 'popup');
                        sendEventToAnalytics(modelFoundOnPage + '-on-decline-config-hover', 'popup');
                    }
                    $decline.onceHovered = true;
                });
                $decline.addEventListener('click', function () {
                    self.close();
                    sendEventToAnalytics('on-decline-config-click', 'popup');
                    sendEventToAnalytics(modelFoundOnPage + '-on-decline-config-click', 'popup');
                });
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
                var isIOS = function () {
                    return (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream);
                };
                var cssRotate = function (deg) {
                    return "\n                    -webkit-transform: rotate(" + deg + ");\n                    -moz-transform: rotate(" + deg + ");\n                    -ms-transform: rotate(" + deg + ");\n                    -o-transform: rotate(" + deg + ");\n                ";
                };
                var scrollIframe = function () {
                    var cssIOS = "overflow-y: auto;";
                    var css = "overflow-y: hidden;left: 5%;right: 5%;top:5%;bottom:5%;";
                    return (isIOS()) ? cssIOS : css;
                };
                var style = "\n                @font-face {\n                    font-family: 'RenaultLife';\n                    src: url('" + path + "fonts/RenaultLife-Bold.eot') format('embedded-opentype'), url('" + path + "fonts/RenaultLife-Bold.woff') format('woff');\n                    font-weight: 700;\n                    font-style: normal;\n                }\n    \n                " + root + "-popup {\n                    z-index: 50000 !important;\n                    position:fixed;\n                    top:0;\n                    right:0;\n                    bottom:0;\n                    left:0;\n                    display: block;\n                    align-items: center;\n                    justify-content: center;\n                    overflow: hidden;\n                    margin:0;\n                    padding:0;\n                }\n                " + root + "-container {\n                    position: absolute;\n                    top: 5px;\n                    right: 5px;\n                    bottom: 5px;\n                    left: 5px;\n                    box-sizing: border-box;\n                    padding: 0;\n                    background: #ffffff;\n                    outline: none;\n                    -webkit-overflow-scrolling: touch;\n                    " + scrollIframe() + ";\n                }\n                \n                " + root + "-confirm {\n                \n                }\n                " + root + "-container iframe {\n                    height: 100%;\n                    width: 100%;\n                }\n                ." + root + "-close {\n                    font-size: 1.5rem;\n                    padding: 0;\n                    border: none;\n                    border-radius: 50%;\n                    background: #fc3;\n                    position: absolute;\n                    right: 1%;\n                    top: 1%;\n                    z-index:4; \n                    height: 33px;\n                    line-height: 33px;\n                    width: 33px;\n                    text-align: center; \n                    vertical-align: top;\n                }\n                .avtovzglyad ." + root + "-close {\n                    left: 1%;\n                }\n                ." + root + "-close:before {\n                    content: '';\n                    background: #000000;\n                    display: inline-block;\n                    height: 2px;\n                    width: 15px;\n                    " + cssRotate('45deg') + ";\n                    position: absolute;\n                    left: 9px;\n                    top: 50%;\n                    margin-top: 0px;\n                }\n                ." + root + "-close:after {\n                    content: '';\n                    background: #000000;\n                    display: inline-block;\n                    height: 2px;\n                    width: 15px;\n                    " + cssRotate('-45deg') + ";\n                    position: absolute;\n                    left: 9px;\n                    top: 50%;\n                    margin-top: 0px;\n                }\n                \n                ." + root + "-close:hover { background: #ffde00 }\n                \n                @media(min-width: 460px) { \n                    ." + root + "-buttons {\n                        display: flex;\n                        justify-content: center;\n                    }\n                }\n                @media(max-width: 460px) {\n                    ." + root + "-buttons {\n                        display: grid;\n                    }\n                    ." + root + "-buttons > button {\n                        font-size: 11px;\n                    }\n                }\n                @media(max-width: 220px) {\n                    ." + root + "-buttons {\n                        display: grid;\n                    }\n                    ." + root + "-buttons > button {\n                        font-size: 9px;\n                    }\n                }\n                \n                ." + root + "-buttons > button {\n                    padding: .4rem 2rem;\n                    border: none;\n                    margin: 1rem .5rem 0;\n                    cursor: pointer;\n                    border-radius: 0;\n                    color: black;\n                    font-family: Arial;\n                    font-size: 13px;\n                    font-style: normal;\n                    font-weight: 400;\n                    line-height: normal;\n                }\n                \n                ." + root + "-accept { background: #fc3; }\n                \n                ." + root + "-accept:hover { background: #ffde00 }\n                \n                ." + root + "-decline { background: #dddddd; }\n                \n                ." + root + "-decline:hover { background: #dddddd; }\n                \n                " + root + "-confirm {\n                    position: absolute;\n                    top: 5px;\n                    right: 5px;\n                    left: 5px;\n                    box-sizing: border-box;\n                    padding: 20px;\n                    background: #ffffff;\n                    outline: none;\n                    -webkit-overflow-scrolling: touch;\n                    " + scrollIframe() + ";\n                    bottom: auto;\n                    right: auto;\n                    left: 50%;\n                    top: 50%;\n                    width: 650px;\n                    margin-left: -325px;\n                    margin-top: -253px;\n                    text-align: center;\n                    height: 506px;\n                }\n                \n                @media(max-width: 670px){\n                    " + root + "-confirm {\n                        width: 90%;\n                        left: 5%;\n                        margin-left: 0;\n                        height: auto;\n                    }\n                }\n                @media(max-height: 526px){\n                    " + root + "-confirm {\n                        height: auto;\n                        top: 5%;\n                        margin-top: 0;\n                    }\n                }\n                \n                ." + root + "-confirm-text {\n                    width: 100% !important;\n                    text-align: center !important;\n                    max-width: initial !important;\n                    font-size: 16px !important;\n                    padding: 0 !important;\n                    margin: 0 !important;\n                }\n                \n                " + root + "-confirm > img {\n                    width: 600px;\n                    display: inline-block;\n                    max-width: 100%;\n                }\n                \n                " + root + "-back {\n                    position:absolute;\n                    top:0;left:0;right:0;bottom:0;\n                    z-index:0;\n                    background: rgba(0, 0, 0, .5);\n                }\n                \n                ." + root + "-hide { display: none !important }\n            ";
                $style.innerHTML += style;
            };
            Popup.prototype.auto_open = function () {
                var _this = this;
                var timeout = (1 * 1000), timer_id = null, self = this;
                setTimeout(function () { return _this.can_auto = true; }, timeout);
                window.addEventListener('scroll', function (event) {
                    if (!_this.can_auto) {
                        return null;
                    }
                    if ($article && (($article.offsetTop + $article.clientHeight - document.documentElement.clientHeight) < window.pageYOffset)) {
                        if (timer_id == null && !self.was_open) {
                            timer_id = setTimeout(function () {
                                if (self.opened) {
                                    return null;
                                }
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
                if (this.stage === 'model') {
                    sendEventToAnalytics('closed', 'configurator');
                    sendEventToAnalytics(modelFoundOnPage + '-closed', 'configurator');
                }
                if (this.stage === 'confirm') {
                    sendEventToAnalytics('closed', 'suggestion');
                    sendEventToAnalytics(modelFoundOnPage + '-closed', 'suggestion');
                }
                document.body.style.overflow = '';
                this.$root.classList.add(root + "-hide");
            };
            Popup.prototype.open = function (stage) {
                var self = this;
                if (stage == 'model' && !self.$showroom_loaded) {
                    self.$showroom_loaded = true;
                    self.$showroom.load();
                }
                this.disableScroll();
                this.opened = true;
                if (!this.was_open) {
                    this.was_open = true;
                }
                if (this.stage !== stage) {
                    this.stage = stage;
                }
                document.body.style.overflow = 'hidden';
                show(this.$root);
                if (this.stage === 'confirm') {
                    hide(this.$container);
                    show(this.$confirm);
                    /*ga('send', 'event', {
                        eventCategory: 'application',
                        eventAction: 'open-suggestion',
                        eventLabel: location.pathname
                    });*/
                    sendEventToAnalytics('open-suggestion', 'application');
                    sendEventToAnalytics(modelFoundOnPage + '-open-suggestion', 'application');
                }
                else {
                    hide(this.$confirm);
                    show(this.$container);
                    /* ga('send', 'event', {
                         eventCategory: 'open-configurator',
                         eventAction: window.Lx_model,
                         eventLabel: location.pathname
                     });*/
                    sendEventToAnalytics(modelFoundOnPage, 'open-configurator');
                }
                this.$root.focus();
            };
            Popup.prototype.preventDefault = function (e) {
                e = e || window.event;
                if (e.preventDefault) {
                    e.preventDefault();
                }
                e.returnValue = false;
            };
            Popup.prototype.preventDefaultForScrollKeys = function (e) {
                // left: 37, up: 38, right: 39, down: 40,
                // spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
                var keysToDisable = { 37: 1, 38: 1, 39: 1, 40: 1, 32: 1, 33: 1, 34: 1, 35: 1, 36: 1 };
                if (keysToDisable[e.keyCode]) {
                    e = e || window.event;
                    if (e.preventDefault) {
                        e.preventDefault();
                    }
                    e.returnValue = false;
                    return false;
                }
            };
            Popup.prototype.disableScroll = function () {
                if (window.addEventListener) { // older FF
                    window.addEventListener('DOMMouseScroll', this.preventDefault, false);
                }
                window.onwheel = this.preventDefault; // modern standard
                window.onmousewheel = document.onmousewheel = this.preventDefault; // older browsers, IE
                window.ontouchmove = this.preventDefault; // mobile
                document.onkeydown = this.preventDefaultForScrollKeys;
            };
            Popup.prototype.enableScroll = function () {
                if (window.removeEventListener) {
                    window.removeEventListener('DOMMouseScroll', this.preventDefault, false);
                }
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
    }
    function renaultAnalyticsPrepare() {
        var loadScript = function (url, loadHandler) {
            if (url === void 0) { url = null; }
            if (!url) {
                return false;
            }
            var scriptDom = document.createElement('script');
            scriptDom.setAttribute('async', '');
            scriptDom.type = 'text/javascript';
            scriptDom.onload = loadHandler;
            scriptDom.src = url;
            document.body.appendChild(scriptDom);
            return scriptDom;
        };
        if (!window.ga || typeof (window.ga) == 'uindefined') {
            var loadHandler = function (evt) {
                // Инициализация GA
                try {
                    window.ga('create', Ga_id, 'auto', 'renaultAnalytics');
                }
                catch (error) {
                    return false;
                }
            };
            window.ga = window.ga || function () { (ga.q = ga.q || []).push(arguments); };
            window.ga.l = +new Date(); // google analytics
            loadScript('https://www.google-analytics.com/analytics.js', loadHandler);
            //loadScript('https://www.google-analytics.com/analytics_debug.js',loadHandler);
        }
        else {
            window.ga = window.ga || function () { (ga.q = ga.q || []).push(arguments); };
            window.ga.l = +new Date(); // google analytics
            window.ga('create', Ga_id, 'auto', 'renaultAnalytics');
        }
        if (!window.Ya || typeof (window.Ya) == 'undefined') {
            var loadHandler2 = function (evt) {
                // Инициализация Ya
                try {
                    window['yaCounter' + Ya_id] = new Ya.Metrika({ id: Ya_id, clickmap: true, trackLinks: true, accurateTrackBounce: true });
                }
                catch (e) { }
            };
            loadScript('https://mc.yandex.ru/metrika/watch.js', loadHandler2);
        }
        else {
            try {
                window['yaCounter' + Ya_id] = new Ya.Metrika({ id: Ya_id, clickmap: true, trackLinks: true, accurateTrackBounce: true });
            }
            catch (e) { }
        }
        renaultButton();
    }
    renaultAnalyticsPrepare();
})();
