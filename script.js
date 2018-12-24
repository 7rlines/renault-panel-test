(function () {
    // флаг о том что модуль уже загружен на странице
    window.renaultButton = true;
    // Классификация устройства
    var device = document.documentElement.clientWidth > 1000 ? 'desktop' : 'mobile';
    // Положение кнопки для открытия конфигурация
    var button_state = 'top';
    // Базовая ссылка на ресурсы
    var path = 'https://renault.7rlines.com/';
    // селектор контейнера с картинкой в котором должна появиться кнопка
    var victimSelector = '.article_image, .bigNodeImage, .topArticlesListImage, .image-micro-schema, .main-article-figure, .video-player, .article-image';
    // селектор элемента из которого можно получить название модели
    var getModelTextSelector = '.model-name, .model_name, .article-text, .car-tag .preview .name .transition_link, .textpage, .article__content';
    // селектор элемента из которого можно молучить идентификатор статьи для конфигуратора
    var getArtilceSelector = '.avg-article-id';
    // селектор статьи
    var articleContainerSelector = '.description, #content, article, .main-article, .main-article.hreview, textpage, .page, .main';
    // массив возможных моделей
    var availableModelNames = ['kaptur', 'koleos', 'logan', 'stepway', 'sandero', 'duster', 'dokker'];
    // найденное имя модели
    var modelFoundOnPage = 'koleos';
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
    document.addEventListener('DOMContentLoaded', function () { return init(); });
    // Контейнер для стилей
    var $style = create('style');
    // Встраиваем контейнер в head
    document.head.appendChild($style);
    // Идентификаторы индексаторов
    var Ga_id = 'UA-117670791-1';
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
                        this.$button.classList.add("platform-avg");
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
                    var styles = "\n                    ." + root + "-button." + root + "-mobile-button {\n                        font-size: 20px;\n                    }\n                    ." + root + "-button {\n                        font-size: 25px;\n                        position: relative;\n                        border: 1px solid #FECB39 !important;\n                        background: #FECB39 !important;\n                        padding: 0 2em 0 0.4em !important;\n                        max-width: 9.92em;\n                        height: 2em !important;\n                        min-height: 1.92em !important;\n                        max-height: 2.16em !important;\n                        cursor: pointer !important;\n                        display: flex !important;\n                        align-items: center;\n                        justify-content: space-between;\n                        box-shadow: none !important;\n                        border-radius: 0 !important;\n                        text-shadow: none !important;\n                        width: auto !important;\n                        margin: 0.4em 0;\n                    }              \n                    ." + root + "-button ." + root + "-logo {\n                        background: url('" + path + "imgs/renault_logo.svg') 50% 50% transparent no-repeat;\n                        background-size: contain;\n                        width: 4em;\n                        max-width: 4.04em;\n                        height: 1.36em;\n                        min-height: 1.3em !important;\n                        max-height: 1.4em !important;\n                        display: block !important;\n                    }\n                    ." + root + "-button ." + root + "-divider {\n                        background: #ffffff;\n                        min-width: 0.12em;\n                        width: 0.16em;\n                        margin: 0 0.32em !important;\n                        max-width: 0.24em;\n                        height: 1.36em;\n                        min-height: 1.3em !important;\n                        max-height: 1.4em !important;\n                        display: flex !important;\n                        margin: 0 0.32em;\n                    }\n                    ." + root + "-button ." + root + "-aligner {\n                        display: flex;\n                        align-items: center;\n                        justify-content: center;\n                    }\n                    ." + root + "-button ." + root + "-text {\n                        width: 2.64em;\n                        max-width: 2.65em !important;\n                        margin-top: 0.04em !important;\n                        height: 0.82em !important;\n                        min-height: 0.8em !important;\n                        max-height: 0.84em !important;\n                        display: flex !important;\n                    }\n                    ." + root + "-button-hover {\n                        background: #ffffff !important;\n                        border-color: #AAA7AB !important;\n                    }\n                    ." + root + "-button-hover ." + root + "-divider {\n                        background: #FECE17 !important;\n                    }\n                    ." + root + "-button ." + root + "-arrow {\n                        height: 0.04em;\n                        width: 0.04em;\n                        position: absolute;\n                        background: transparent;\n                        display: inline-block;\n                        right: 0.8em;\n                        top: 50%\n                    }\n                    ." + root + "-button ." + root + "-arrow > ." + root + "-decor {\n                        position: absolute;\n                        display: inline-block;\n                        height: 0.4em;\n                        width: 0.48em;\n                        top: -0.2em;\n                        right: 0;\n                    }\n                    ." + root + "-rotate180 {\n                        -webkit-transform: rotate(180deg);\n                        -moz-transform: rotate(180deg);\n                        -ms-transform: rotate(180deg);\n                        -o-transform: rotate(180deg);\n                    }\n                    ." + root + "-button ." + root + "-arrow > ." + root + "-decor:before {\n                        content: '';\n                        height: 0.16em;\n                        width: 0.48em;\n                        -webkit-transform: rotate(45deg);\n                        -moz-transform: rotate(45deg);\n                        -ms-transform: rotate(45deg);\n                        -o-transform: rotate(45deg);\n                        position: absolute;\n                        background: #000000;\n                        display: inline-block;\n                        right: 0;\n                        top: 0px;\n                    }\n                    ." + root + "-button ." + root + "-arrow > ." + root + "-decor:after {\n                        content: '';\n                        height: 0.16em;\n                        width: 0.48em;\n                        -webkit-transform: rotate(-45deg);\n                        -moz-transform: rotate(-45deg);\n                        -ms-transform: rotate(-45deg);\n                        -o-transform: rotate(-45deg);\n                        position: absolute;\n                        background: #000000;\n                        display: inline-block;\n                        right: 0;\n                        bottom: 0px;\n                    }\n                    ." + root + "-button ." + root + "-arrow-clickable {\n                        height: 2.4em;\n                        width: 2.6em;\n                        left: -1.6em;\n                        top: -1.2em;\n                        position: absolute;\n                        -webkit-touch-callout: none; /* iOS Safari */\n                        -webkit-user-select: none; /* Safari */\n                        -khtml-user-select: none; /* Konqueror HTML */\n                        -moz-user-select: none; /* Firefox */\n                        -ms-user-select: none; /* Internet Explorer/Edge */\n                        user-select: none; /* Non-prefixed version, currently supported by Chrome and Opera */\n                    }\n                    ." + root + "-button.platform-avg {\n                            font-size: 28px;\n                        }\n                    @media(max-width:1000px) {\n                        ." + root + "-fluid {\n                            z-index: 5000;\n                            position: fixed;\n                            top: 100px;\n                            left: 0;\n                            transform: none;\n                        }\n                        ." + root + "-button.avtovzglyad-mobile {\n                            font-size: 20px;\n                        }\n                    }\n                    @media(max-width:1024px) {\n                       .platform-rbc." + root + "-fluid {\n                           top: 300px;\n                       }\n                    }\n                    @media(min-width:1024px) {\n                       .platform-rbc." + root + "-fluid {\n                           top: 550px;\n                       }\n                    }\n                    @media(max-height:650px) and (min-width:1024px) {\n                       .platform-rbc." + root + "-fluid {\n                           top: 86vh; \n                       }\n                    }\n                    @media(max-height:360px) {\n                       .platform-rbc." + root + "-fluid {\n                           top: 170px;\n                       }\n                    }\n                    @media(min-width:1000px) {\n                        ." + root + "-fluid {\n                            z-index: 5000;\n                            position: fixed;\n                            top: 100px;\n                            left: 0;\n                            transform: none;\n                        }\n                    }\n                    ." + root + "-bottom {\n                        max-width: 10.04em;\n                        box-sizing: border-box;\n                        -moz-box-sizing: border-box;\n                        -webkit-box-sizing: border-box;\n                    }\n                    ." + root + "-bottom ." + root + "-divider {\n                        flex-grow: 0;\n                        flex-shrink: 0;\n                        flex-basis: auto;\n                    }\n                    .target-image {\n                        position: relative;\n                    }\n                    ." + root + "-button." + root + "-image {\n                        position: absolute;\n                        bottom: 2.5vw;\n                        left: 1.0vw;\n                        transform: none;\n                    }\n                    .platform-rbc." + root + "-button." + root + "-image {\n                        z-index: 999;\n                        bottom: 16vw;\n                    }\n                    @media (max-width: 1024px) {\n                        ." + root + "-button.platform-rbc {\n                            font-size: 20px;\n                        }                     \n                        .platform-rbc." + root + "-button." + root + "-image {\n                            bottom: 2.5vw;\n                        }\n                    }\n                    ." + root + "-button." + root + "-image.platform-avg {\n                         bottom: 22px;    \n                    }\n                    ." + root + "-button." + root + "-image." + root + "-image-zr {\n                        position: absolute;\n                        bottom: 0.5vw;\n                        left: 1.0vw;\n                        transform: none;\n                        box-sizing: border-box !important;\n                    }\n                ";
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
                sendEventToAnalytics('GitHub', 'source');
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
                                    if (modelFoundOnPage === 'stepway') {
                                        modelFoundOnPage = 'sandero-stepway';
                                    }
                                    break;
                                }
                            }
                            else {
                                if (modelName.includes(modelNme)) {
                                    modelFoundOnPage = modelNme;
                                    if (modelFoundOnPage === 'stepway') {
                                        modelFoundOnPage = 'sandero-stepway';
                                    }
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
                // if (document.location.host.indexOf('avtovzglyad') >= 0 || document.location.host.indexOf('avg') >= 0) {
                if (document.location.host.indexOf('7rlines') >= 0) {
                    var sourceArticleId = find_all(getArtilceSelector);
                    if (sourceArticleId) {
                        var arcticleId = (sourceArticleId[0].innerText || sourceArticleId[0].textContent).toLowerCase();
                        console.log(arcticleId, '****************************************************************************************');
                    }
                }
                if ((document.location.pathname.indexOf('material1') >= 0) ||
                    (document.location.pathname.indexOf('material2') >= 0) ||
                    (document.location.pathname.indexOf('material3') >= 0) ||
                    (document.location.pathname.indexOf('material4') >= 0) ||
                    (document.location.pathname.indexOf('material5') >= 0) ||
                    (document.location.pathname.indexOf('renault-naraschivaet-v-rossii-obemy-prodazh') >= 0) ||
                    (document.location.pathname.indexOf('dvoe-iz-lartsa-v-rossii-startovali') >= 0) ||
                    (document.location.pathname.indexOf('novoj-spetsversii-renault-kaptur') >= 0) ||
                    (document.location.pathname.indexOf('kaptur-play-ne-zaputatsja-v-seti') >= 0) ||
                    (document.location.pathname.indexOf('906902-v-rossii') >= 0) ||
                    (document.location.pathname.indexOf('905685-novyj') >= 0) ||
                    (document.location.pathname.indexOf('908402-renault') >= 0) ||
                    (document.location.pathname.indexOf('907258-novyj') >= 0) ||
                    (document.location.pathname.indexOf('909409-lichnoe') >= 0) ||
                    (document.location.pathname.indexOf('906808-otsenki') >= 0) ||
                    (document.location.pathname.indexOf('905857-renault') >= 0) ||
                    (document.location.pathname.indexOf('905678-malomernyj') >= 0) ||
                    (document.location.pathname.indexOf('905260-zimnie') >= 0) ||
                    (document.location.pathname.indexOf('905154-clio') >= 0) ||
                    (document.location.pathname.indexOf('905000-pojmali') >= 0) ||
                    (document.location.pathname.indexOf('909785-kak') >= 0) ||
                    (document.location.pathname.indexOf('908333-ehkstremalnyj') >= 0) ||
                    (document.location.pathname.indexOf('910246-v-sakhare') >= 0) ||
                    (document.location.pathname.indexOf('908923-stavim') >= 0) ||
                    (document.location.pathname.indexOf('908268-novyj') >= 0) ||
                    (document.location.pathname.indexOf('908117-rassekrechen') >= 0) ||
                    (document.location.pathname.indexOf('907184-renault') >= 0) ||
                    (document.location.pathname.indexOf('907120-renault') >= 0) ||
                    (document.location.pathname.indexOf('905219-dakar') >= 0) ||
                    (document.location.pathname.indexOf('904989-novyj') >= 0) ||
                    (document.location.pathname.indexOf('908063-rassekrechen') >= 0) ||
                    (document.location.pathname.indexOf('909769-renault') >= 0) ||
                    (document.location.pathname.indexOf('909898-dva') >= 0) ||
                    (document.location.pathname.indexOf('909209-dolgozhdannyj') >= 0) ||
                    (document.location.pathname.indexOf('907239-dozhdalis') >= 0) ||
                    (document.location.pathname.indexOf('908747-vybiraem') >= 0) ||
                    (document.location.pathname.indexOf('908054-renault') >= 0) ||
                    (document.location.pathname.indexOf('905098-simvol') >= 0) ||
                    (document.location.pathname.indexOf('906626-v-nem') >= 0) ||
                    (document.location.pathname.indexOf('911699-renault') >= 0) ||
                    (document.location.pathname.indexOf('912222-renault') >= 0) ||
                    (document.location.pathname.indexOf('912127-obnovlennaya') >= 0) ||
                    (document.location.pathname.indexOf('912291-magazin') >= 0) ||
                    (document.location.pathname.indexOf('912442-krossover') >= 0) ||
                    (document.location.pathname.indexOf('912584-renault') >= 0) ||
                    (document.location.pathname.indexOf('912640-renault') >= 0) ||
                    (document.location.pathname.indexOf('912542-sekretnye') >= 0) ||
                    (document.location.pathname.indexOf('913113-renault') >= 0) ||
                    (document.location.pathname.indexOf('913228-kross') >= 0) ||
                    (document.location.pathname.indexOf('913456-renault') >= 0) ||
                    (document.location.pathname.indexOf('913446-obnovlenny') >= 0) ||
                    (document.location.pathname.indexOf('913809-renault') >= 0) ||
                    (document.location.pathname.indexOf('913798-renault') >= 0) ||
                    (document.location.pathname.indexOf('913970-renault') >= 0) ||
                    (document.location.pathname.indexOf('914172-pokupaem') >= 0) ||
                    (document.location.pathname.indexOf('914308-renault-obyavila') >= 0) ||
                    (document.location.pathname.indexOf('914498-renault-kaptur') >= 0) ||
                    (document.location.pathname.indexOf('914387-5-prichin-kupit') >= 0) ||
                    (document.location.pathname.indexOf('914522-renault-logan') >= 0) ||
                    (document.location.pathname.indexOf('2018-09-12-renault-sandero') >= 0) ||
                    (document.location.pathname.indexOf('2018-10-18-renault-kaptur') >= 0) ||
                    (document.location.pathname.indexOf('2018-10-30-test-drajv') >= 0) ||
                    (document.location.pathname.indexOf('material6') >= 0) ||
                    (document.location.pathname.indexOf('material7') >= 0) ||
                    (document.location.pathname.indexOf('914660-5-prichin') >= 0) ||
                    (document.location.pathname.indexOf('914873-novoe') >= 0) ||
                    (document.location.pathname.indexOf('914855-5-prichin-kupit') >= 0) ||
                    (document.location.pathname.indexOf('915078-rossiyane-raskupayut') >= 0) ||
                    (document.location.pathname.indexOf('2018-11-08-kak-poluchit-vygodnye') >= 0) ||
                    (document.location.pathname.indexOf('2018-11-13-test-drajv-renault-kaptur-play') >= 0) ||
                    (document.location.pathname.indexOf('915242-v-rossii-startovali') >= 0) ||
                    (document.location.pathname.indexOf('915002-dan-prikaz') >= 0) ||
                    (document.location.pathname.indexOf('915263-renault-koleos-poluchil') >= 0)) {
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
                    //rbc
                    if (document.location.pathname.indexOf('material1') >= 0) {
                        RenaultShowroom.push("token", "457a8e7c7c6096be469209adf901b16ac76dd1349a8dc7154fe2221b098d3091.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('material2') >= 0) {
                        RenaultShowroom.push("token", "cbbe3143cfae9faafae9267953f4e58ff472b16566276af38ddd91c36eb478ac.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('material3') >= 0) {
                        RenaultShowroom.push("token", "79d0dcfc04737a6c2f76d4f8a309fe6a8836418cbb7d5aa2c6d6c449dfc7207a.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('material4') >= 0) {
                        RenaultShowroom.push("token", "246bf28138a594b20b5dc51525fb4312b46c22beac0f8df48859aabe8a4b9bef.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('material5') >= 0) {
                        RenaultShowroom.push("token", "fdfda9f521c519b38b7b7f8bb31ec46ef134f1dbf1aaca646098e8352ffc67ff.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    //ag
                    if (document.location.pathname.indexOf('renault-naraschivaet-v-rossii-obemy-prodazh') >= 0) {
                        RenaultShowroom.push("token", "908ae3e39ffec102c6a6b4293d44355357869c40eea9b55b99ef9b680f8bc08d.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('dvoe-iz-lartsa-v-rossii-startovali') >= 0) {
                        RenaultShowroom.push("token", "54d25cfccbe5d9cc5c06261906f7ca7dd7f7174e707fa93e89b7c29aa0337e9b.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('novoj-spetsversii-renault-kaptur') >= 0) {
                        RenaultShowroom.push("token", "b19022abd5f73e5fe1226e23b6b339505a6ddc50eef00abf11b28900598c749b.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('kaptur-play-ne-zaputatsja-v-seti') >= 0) {
                        RenaultShowroom.push("token", "ab715c25a28fd3efb3750e860aebdaeef150e99a0af7acb30934964935d7febb.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    //zr
                    if (document.location.pathname.indexOf('906902-v-rossii') >= 0) {
                        RenaultShowroom.push("token", "19e227736377c4799b0dc15fc9b09655364ed18b557f2e8fd613ec519474b634.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('905685-novyj') >= 0) {
                        RenaultShowroom.push("token", "95bfdf98bf6196051c4b295a89d853482df6b16de1558e075c9d0338b425728d.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('908402-renault') >= 0) {
                        RenaultShowroom.push("token", "864f2e48bd0dd397ab07f7fbb022f4af0b844f156e7a0c04ff6a2d949049ded6.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('907258-novyj') >= 0) {
                        RenaultShowroom.push("token", "dd33d2095fefbab82758fc5112bd80bf11a880304dfd651258e7cf0c1bbf1156.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('909409-lichnoe') >= 0) {
                        RenaultShowroom.push("token", "27754979f3254a85ea7f7ce8b68b6b47195bd0bb1be875cf36c8ba0530e9eb45.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('906808-otsenki') >= 0) {
                        RenaultShowroom.push("token", "596122790158fa3da2037573276da6f8d6025ded6e2e2d58284afd8430ba8f2c.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('905857-renault') >= 0) {
                        RenaultShowroom.push("token", "ef0f4ba9212984006cfced57c9380ee51689c3842582857c352bb1a0b3ed3a1b.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('905678-malomernyj') >= 0) {
                        RenaultShowroom.push("token", "c73bc1f4d08c2d587cf1a86193785bf7e844e40bee9abe4978a02357cb467250.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('905260-zimnie') >= 0) {
                        RenaultShowroom.push("token", "8e058755a67bec9eb4f6f79a2f0caf2686280c3bbd61dcca427c8988f294daa9.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('905154-clio') >= 0) {
                        RenaultShowroom.push("token", "a45943fa2cd086105317ec0ef74245ec1320794b41871c2f9cfc054ccef8d693.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('905000-pojmali') >= 0) {
                        RenaultShowroom.push("token", "ac66b014d4fb253c68d545546375b965fd18ab48e9475a0d093c815806549a0f.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('909785-kak') >= 0) {
                        RenaultShowroom.push("token", "71bf84892759e8772ccd0ca39cf500abfa45e0cf614a045ad304ed930f74e601.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('908333-ehkstremalnyj') >= 0) {
                        RenaultShowroom.push("token", "1a944937324612c85f2533829a38ce9921171808765d26a411421db0d7e19187.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('910246-v-sakhare') >= 0) {
                        RenaultShowroom.push("token", "a6102a77bdf4a4da577f6d4305c4fafa84300f413ba89d2890319b7dade33b98.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('908923-stavim') >= 0) {
                        RenaultShowroom.push("token", "dcdcd3fd1c62764d64d0b4c4539ec9adc9864503a437ead0eb1bfcab9e47b5e9.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('908268-novyj') >= 0) {
                        RenaultShowroom.push("token", "0f54f0c21eaca1b994fb5d65a7e0a78653e524181d8d18c9035a0e7dec900e01.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('908117-rassekrechen') >= 0) {
                        RenaultShowroom.push("token", "2b5a5a52ce8d0d9c888433ebc0ae8fc103179952a6dc847912a316588f96dc90.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('907184-renault') >= 0) {
                        RenaultShowroom.push("token", "5bd40920e0e274d7f43c2158b603743fa32565e93d81e3ca8aafb78d0188e14f.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('907120-renault') >= 0) {
                        RenaultShowroom.push("token", "96002540b72fcab508cbe58f50fd99581b89f89911a21a456f79c0fb6d0afd4a.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('905219-dakar') >= 0) {
                        RenaultShowroom.push("token", "a280c8e330c865fe5cda234f838bee102fb5076f863a0b18f7582a608316f9cb.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('904989-novyj') >= 0) {
                        RenaultShowroom.push("token", "4cf846ea0dd5fad5d4e1c8203fa641e37fb125e2f10fd920a70191eff75a62cc.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('908063-rassekrechen') >= 0) {
                        RenaultShowroom.push("token", "487009c043f7b6e23a675ff61604af5d3fc5ab4767044c22ff2be34ec3e14a3b.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('909769-renault') >= 0) {
                        RenaultShowroom.push("token", "dc93837ba68d53fa56830d6256949ead98500607a861daaf57273958602bbb26.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('909898-dva') >= 0) {
                        RenaultShowroom.push("token", "31aaa4e23da9a0776a2820667c71d2cbc63a2169600b0682a2636eeebe26f494.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('909209-dolgozhdannyj') >= 0) {
                        RenaultShowroom.push("token", "c5bf7e734c29dbecc5241705d7a540b2344c2f7bd362aaf1311e96bfb5ff80ef.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('907239-dozhdalis') >= 0) {
                        RenaultShowroom.push("token", "d73a473ee6fec9825b9a32f3c93fc68b4741d32ef9ecceb3e573264d225f0c77.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('908747-vybiraem') >= 0) {
                        RenaultShowroom.push("token", "cc22297d73dc341d5d2224229cd3f954b350608c5f3cb79aa98aad14796a621a.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('908054-renault') >= 0) {
                        RenaultShowroom.push("token", "26d95275850c1b6c5efc112104a4a84159cbc3c11b7699dead464dfad67980b9.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('905098-simvol') >= 0) {
                        RenaultShowroom.push("token", "313e552841dc8fb6cd29eaf741d225a4d53366fd73075431e8de29021ff448b0.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('906626-v-nem') >= 0) {
                        RenaultShowroom.push("token", "a88aa4a0d6fe048449ed69d50f3ab21ce23cd8ae2d26a08ec8727df3066efc9b.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('911699-renault') >= 0) {
                        RenaultShowroom.push("token", "9e6aec1bbe3baed2e445855dbb31651d9fd01a508a3d7fba59e926c5283397a4.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('912222-renault') >= 0) {
                        RenaultShowroom.push("token", "ab09cac6c5795767e110dbb02e1217b27f4eee594e93b399c0f87c501bb50efa.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('912127-obnovlennaya') >= 0) {
                        RenaultShowroom.push("token", "55e1d8ff1359ae791962142dc08d7710b90355cae8d58047d6fbdb0cded93979.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('912291-magazin') >= 0) {
                        RenaultShowroom.push("token", "f9563d3e97a5bd1294a1405fe4daddf4ba94527f31ae159e58d5be29d4a4dcf8.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('912442-krossover') >= 0) {
                        RenaultShowroom.push("token", "f3f0bab33344e7d424aac720cbe8eade8fc1fd3093773a45c357f75c9696e307.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('912584-renault') >= 0) {
                        RenaultShowroom.push("token", "4f9648235134c5a960e1460505807a94125a7f781ade512ee38fef7d67fe9504.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('912640-renault') >= 0) {
                        RenaultShowroom.push("token", "c1eaf090131940806d46b7845d4cfeb013a45aa000ef774afbcafb4057cbfcaa.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('912542-sekretnye') >= 0) {
                        RenaultShowroom.push("token", "f53e2516879cd9072ed65aa8f029c0905ccd0df3cece93ad9414d3476e41ed53.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('913113-renault') >= 0) {
                        RenaultShowroom.push("token", "9e7eecf6fe6d11104e0561a15be22af96afc1674fdc2d2e2bbb9270c43768b4c.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('913228-kross') >= 0) {
                        RenaultShowroom.push("token", "137b9fd81fb7a10e84b380a63f3c1bc7ee5c4dc460002f9f401f8ffc6ddebaf5.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('913456-renault') >= 0) {
                        RenaultShowroom.push("token", "c4516393db83e1f920294d82cf6de6b587f1949a9cdc25ffab7913358f8f4dd0.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('913446-obnovlenny') >= 0) {
                        RenaultShowroom.push("token", "df13491f5c383b1d0fc750c01dc8c59bd34640ab88737e28c3103d9f77718813.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('913809-renault') >= 0) {
                        RenaultShowroom.push("token", "607ed8c0a4b1b50267c823deeb10fc71deb7f5c8316480fcdefffdee25796ff6.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('913798-renault') >= 0) {
                        RenaultShowroom.push("token", "adccd3a2fa9ad288098b43dca21c9b99287807775349352b1f504db573726c1d.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('913970-renault') >= 0) {
                        RenaultShowroom.push("token", "0424af6ea535ef4b9cd6db98c13307fb166c20b191cb0aa8f81dd97474e9247b.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('914172-pokupaem') >= 0) {
                        RenaultShowroom.push("token", "e5c0803c3c11c64764afb2d3bb66271058074913548f15853ed790f27b5e5518.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('914308-renault-obyavila') >= 0) {
                        RenaultShowroom.push("token", "db9567ea21e371c15b1e43b77b68e0f4e3d72054ceb29a8c88f81c78c0d740ad.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('914498-renault-kaptur') >= 0) {
                        RenaultShowroom.push("token", "8bc8d96985f5ccd912fd05293da1ee213108bc4e3765ffe01cd8f4ce673543a7.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('914387-5-prichin') >= 0) {
                        RenaultShowroom.push("token", "d960c4b3fc73f3bb7a6fb0a1e4672943ef86e357423ea7ad4a0c9bd54e8981b5.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('914522-renault-logan') >= 0) {
                        RenaultShowroom.push("token", "5cb4b0702fe4189eae6c6acbeebf9af5d5a371d39e4c887fb897eed890c5c378.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('2018-09-12-renault-sandero-stepway') >= 0) {
                        RenaultShowroom.push("token", "c3a9bab5ade162893dab78042e5ae0f1f9fff446f37f5262313a98b3644baaf8.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('2018-10-18-renault-kaptur') >= 0) {
                        RenaultShowroom.push("token", "43b373cea4fe2deec84ceed9f88b35289d092314b83b13c565c448d290079f05.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('2018-10-30-test-drajv') >= 0) {
                        RenaultShowroom.push("token", "8f53f70bfa2e74b1625d26a58c25b28f37817136bdd7bf6da84260dc831614df.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('material6') >= 0) {
                        RenaultShowroom.push("token", "6ae4b3d1488776be48002602c7fcdb13b0bf3542900244aa1f205645fed0fb32.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('material7') >= 0) {
                        RenaultShowroom.push("token", "fe6fe5389020d08bda9de9ec09f5f4764fae04cfbdec5c9897ee2007577729b1.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('914660-5-prichin') >= 0) {
                        RenaultShowroom.push("token", "7380074b6bd96c0f4aeb22d29d854b019d30f89259b3af00d236e0e2a9a0f85d.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('914873-novoe') >= 0) {
                        RenaultShowroom.push("token", "38956e5ec8592a7549aabc4610a65d2380b6583bbaaba538e857843fede7ef56.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('914855-5-prichin-kupit') >= 0) {
                        RenaultShowroom.push("token", "7776d8db46829329fba32b3ff6b1ed8b1326f4e372b4638274a69bc01bfe31bf.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('915078-rossiyane-raskupayut') >= 0) {
                        RenaultShowroom.push("token", "dbb5232bc4033866dc85f01205bd327c3c80de3212fa00a42c4f007370260e9a.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('2018-11-08-kak-poluchit-vygodnye') >= 0) {
                        RenaultShowroom.push("token", "45cf2c17b8d509d7a024abe528e161d1cf8921e66d47037f5e687a2832eb24a0.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('2018-11-13-test-drajv-renault-kaptur-play') >= 0) {
                        RenaultShowroom.push("token", "cfe3ab63ea3f3af8dc4c28487945aa22fb865950b0b1273cba53f8ce57ce1842.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('915242-v-rossii-startovali') >= 0) {
                        RenaultShowroom.push("token", "236bb4507b4c1f4203260c30828584e4f1bc10ae176d185a19df529cf417fe81.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('915002-dan-prikaz') >= 0) {
                        RenaultShowroom.push("token", "1d81512edb0455717944994c10a289dc82f613f6bc22c08ca9e25301ad273c0e.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                    if (document.location.pathname.indexOf('915263-renault-koleos-poluchil') >= 0) {
                        RenaultShowroom.push("token", "916a98c29d6398271f27109ff342b090d506abdb9aa2af4bca7e8a0f898a904f.external-vitrine");
                        loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                    }
                }
                else {
                    RenaultShowroom.push('embed', {
                        source: platformId,
                        vitrine: modelFoundOnPage,
                        container: root + "-container",
                        ready: function (showroom) { return self.$showroom = showroom; },
                        /*stat: (type) => ga('send', 'event', {
                            eventCategory: 'configurator',
                            eventAction: type,
                            eventLabel: location.pathname
                        })*/
                        stat: function (type) {
                            statsChangeHandler(type);
                        }
                    });
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
                if (modelFoundOnPage === 'sandero-stepway') {
                    text = "\u0412\u044B \u0445\u043E\u0442\u0438\u0442\u0435 \u043E\u0442\u043A\u0440\u044B\u0442\u044C \u043A\u043E\u043D\u0444\u0438\u0433\u0443\u0440\u0430\u0446\u0438\u044E \u0434\u043B\u044F Sandero Stepway ?";
                }
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
                var style = "\n                @font-face {\n                    font-family: 'RenaultLife';\n                    src: url('" + path + "fonts/RenaultLife-Bold.eot') format('embedded-opentype'), url('" + path + "fonts/RenaultLife-Bold.woff') format('woff');\n                    font-weight: 700;\n                    font-style: normal;\n                }\n    \n                " + root + "-popup {\n                    z-index: 50000 !important;\n                    position:fixed;\n                    top:0;\n                    right:0;\n                    bottom:0;\n                    left:0;\n                    display: block;\n                    align-items: center;\n                    justify-content: center;\n                    overflow: hidden;\n                    margin:0;\n                    padding:0;\n                }\n                " + root + "-container {\n                    position: absolute;\n                    top: 5px;\n                    right: 5px;\n                    bottom: 5px;\n                    left: 5px;\n                    box-sizing: border-box;\n                    padding: 0;\n                    background: #ffffff;\n                    outline: none;\n                    -webkit-overflow-scrolling: touch;\n                    " + scrollIframe() + ";\n                }\n                \n                " + root + "-confirm {\n                \n                }\n                " + root + "-container iframe {\n                    height: 100%;\n                    width: 100%;\n                }\n                ." + root + "-close {\n                    font-size: 1.5rem;\n                    padding: 0;\n                    border: none;\n                    border-radius: 50%;\n                    background: #fc3;\n                    position: absolute;\n                    right: 1%;\n                    top: 1%;\n                    z-index:4; \n                    height: 34px;\n                    line-height: 33px;\n                    width: 33px;\n                    text-align: center; \n                    vertical-align: top;\n                }\n                .avtovzglyad ." + root + "-close {\n                    left: 1%;\n                }\n                ." + root + "-close:before {\n                    content: '';\n                    background: #000000;\n                    display: inline-block;\n                    height: 2px;\n                    width: 15px;\n                    " + cssRotate('45deg') + ";\n                    position: absolute;\n                    left: 9px;\n                    top: 50%;\n                    margin-top: 0px;\n                }\n                ." + root + "-close:after {\n                    content: '';\n                    background: #000000;\n                    display: inline-block;\n                    height: 2px;\n                    width: 15px;\n                    " + cssRotate('-45deg') + ";\n                    position: absolute;\n                    left: 9px;\n                    top: 50%;\n                    margin-top: 0px;\n                }\n                \n                ." + root + "-close:hover { background: #ffde00 }\n                \n                @media(min-width: 460px) { \n                    ." + root + "-buttons {\n                        display: flex;\n                        justify-content: center;\n                    }\n                }\n                @media(max-width: 460px) {\n                    ." + root + "-buttons {\n                        display: grid;\n                    }\n                    ." + root + "-buttons > button {\n                        font-size: 11px;\n                    }\n                }\n                @media(max-width: 220px) {\n                    ." + root + "-buttons {\n                        display: grid;\n                    }\n                    ." + root + "-buttons > button {\n                        font-size: 9px;\n                    }\n                }\n                \n                ." + root + "-buttons > button {\n                    padding: .4rem 2rem;\n                    border: none;\n                    margin: 1rem .5rem 0;\n                    cursor: pointer;\n                    border-radius: 0;\n                    color: black;\n                    font-family: Arial;\n                    font-size: 13px;\n                    font-style: normal;\n                    font-weight: 400;\n                    line-height: normal;\n                }\n                \n                ." + root + "-accept { background: #fc3; }\n                \n                ." + root + "-accept:hover { background: #ffde00 }\n                \n                ." + root + "-decline { background: #dddddd; }\n                \n                ." + root + "-decline:hover { background: #dddddd; }\n                \n                " + root + "-confirm {\n                    position: absolute;\n                    top: 5px;\n                    right: 5px;\n                    left: 5px;\n                    box-sizing: border-box;\n                    padding: 20px;\n                    background: #ffffff;\n                    outline: none;\n                    -webkit-overflow-scrolling: touch;\n                    " + scrollIframe() + ";\n                    bottom: auto;\n                    right: auto;\n                    left: 50%;\n                    top: 50%;\n                    width: 650px;\n                    margin-left: -325px;\n                    margin-top: -253px;\n                    text-align: center;\n                    height: 506px;\n                }\n                \n                @media(max-width: 670px){\n                    " + root + "-confirm {\n                        width: 90%;\n                        left: 5%;\n                        margin-left: 0;\n                        height: auto;\n                    }\n                }\n                @media(max-height: 526px){\n                    " + root + "-confirm {\n                        height: auto;\n                        top: 5%;\n                        margin-top: 0;\n                    }\n                }\n                \n                ." + root + "-confirm-text {\n                    width: 100% !important;\n                    text-align: center !important;\n                    max-width: initial !important;\n                    font-size: 16px !important;\n                    padding: 0 !important;\n                    margin: 0 !important;\n                }\n                \n                " + root + "-confirm > img {\n                    width: 600px;\n                    display: inline-block;\n                    max-width: 100%;\n                }\n                \n                " + root + "-back {\n                    position:absolute;\n                    top:0;left:0;right:0;bottom:0;\n                    z-index:0;\n                    background: rgba(0, 0, 0, .5);\n                }\n                \n                ." + root + "-hide { display: none !important }\n            ";
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
