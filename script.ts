declare type TButtonState = 'top' | 'left' | 'bottom';
declare type TFluidButtonState = 'hide' | 'animate' | 'show';
(function() {
    // флаг о том что модуль уже загружен на странице
    window.renaultButton = true;
    // Классификация устройства
    let device = document.documentElement.clientWidth > 1000 ? 'desktop' : 'mobile';
    // Положение кнопки для открытия конфигурация
    let button_state: TButtonState = 'top';
    // Базовая ссылка на ресурсы
    const path: string = 'https://renault.7rlines.com/';
    // селектор контейнера с картинкой в котором должна появиться кнопка
    const victimSelector: string = '.article_image, .bigNodeImage, .topArticlesListImage, .image-micro-schema, .main-article-figure, .video-player, .article-image';
    // селектор элемента из которого можно получить название модели
    const getModelTextSelector: string = '.model-name, .model_name, .article-text, .car-tag .preview .name .transition_link, .textpage, .article__content';
    // селектор элемента из которого можно молучить идентификатор статьи для конфигуратора
    const getArtilceSelector: string = '.avg-article-id';
    // селектор статьи
    const articleContainerSelector: string = '.description, #content, article, .main-article, .main-article.hreview, textpage, .page, .main';
    // массив возможных моделей
    const availableModelNames: Array<string> = ['kaptur', 'koleos', 'logan', 'stepway', 'sandero', 'duster', 'dokker'];
    // найденное имя модели
    let modelFoundOnPage = 'koleos';
    // получить случайно число в периоде от заданных
    const getRandomInt = (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    // найти родителя по селектору
    const getParentBySelector = (el: any, sl: string) => {
        while (el = el.parentElement) {
            if (el.matches(sl) || (el.matchesSelector && el.matchesSelector(sl))) {
                return el;
            }
        }
    };
    // Префикс к наименованиям
    const root: string = 'SRL';
    // Функция для нахождения элементов
    const find = (selector: string) => <HTMLElement>document.querySelector(selector);
    // Функция для нахождения всех элементов
    const find_all = (selector: string) => document.querySelectorAll(selector);
    // Функция для создания элементов
    const create = (tag: string) => document.createElement(tag);
    // Функция для создания текста
    const create_text = (text: string) => document.createTextNode(text);
    // Изображение на котором должна быть картинка
    let $image = <HTMLImageElement>find(victimSelector);
    // Статья после которой должна быть кнопка
    let $article = find(articleContainerSelector);
    // Получает имя домена
    let $domainName = null;
    // Оригинальный размер статьи
    let $originArticleRect = null;
    // Означает что первая кнопка загружена
    let button_init: boolean = false;
    let app_init: boolean = false;
    // Повесить обработчик после загрузки DOM
    document.addEventListener('DOMContentLoaded', () => renaultButton());
    // Контейнер для стилей
    const $style = <HTMLStyleElement>create('style');
    // Встраиваем контейнер в head
    document.head.appendChild($style);
    // Идентификаторы индексаторов
    var Ga_id = 'UA-75083026-5';
    var Ya_id = '48519794';
    //id used for site we are indexing
    const platformId: string = 'zr';
    // Универсальная рассылка событий индексаторам
    const sendEventToAnalytics = (eAction?: null, category?: null): void => {
        if (!eAction || typeof(eAction) == "undefined") { return false; }
        category = (!category || typeof(category) == "undefined")? 'button' : category;
        let timeoutForFirstSetOfEvents = 1000;//in order to ga create finishes until first event fires
        setTimeout(function() {
            window.ga('renaultAnalytics.send', {
                hitType: 'event',
                eventCategory: category,
                eventAction: eAction,
                eventLabel: location.pathname
            });
            timeoutForFirstSetOfEvents = 0;
        },timeoutForFirstSetOfEvents);
        var goalParams = {'category': category};
        let goalCB = function(err){
            //console.log('YA CB ♦ ',err,this);
        };
        try {
            //window['yaCounter' + Ya_id].reachGoal(category + ': ' + eAction, goalParams, goalCB );
        } catch (e) {
            console.log('Something is wrong with Yandex analytics: ', e);
        }

    };
    const isMobile = function () {
        if (document.documentElement.clientWidth < 800) {
            return true;
        } else {
            return false;
        }
    };
    const loadScript = (url: string = null, loadHandler: any) => {
        if (!url) {return false; }
        let scriptDom = <HTMLElement>document.createElement('script');
        scriptDom.setAttribute('async','');
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
        $image = <HTMLImageElement>find(victimSelector);//.story-photo

        if (!$image) {
            setTimeout(function () {
                init();
            }, 100);
            return false;
        } else {
            if (app_init) return false;
            app_init = true;
        }

        // Создание нового всплывающего окна
        const popup = new Popup;

        // Класс описания кнопки инициализации
        class Button {
            private $button = create('div');

            protected constructor(private $root: HTMLElement, public type?: 'image') {
                this.view_init();
                this.style_init();
                this.scene_init();
            }

            getViewportOnClassInit() {
                if(window.innerWidth !== undefined && window.innerHeight !== undefined) {
                    var w = window.innerWidth;
                    var h = window.innerHeight;
                } else {
                    var w = document.documentElement.clientWidth;
                    var h = document.documentElement.clientHeight;
                }
                return {width: w, height: h};
            }
            view_init(): void {
                var viewport = this.getViewportOnClassInit();
                if ((document.location.host.indexOf('autonews') >= 0) || (document.location.host.indexOf('rbc') >= 0)) {
                    this.$button.classList.add(`platform-rbc`);
                }
                if (document.location.host.indexOf('avtovzglyad') >= 0) {
                    this.$button.classList.add(`avtovzglyad-mobile`);
                    this.$button.classList.add(`platform-avg`);
                }
                if (document.location.host.indexOf('m.zr.ru') >=0) {
                    this.$button.classList.add(`${root}-mobile-button`);
                }
                this.$button.classList.add(`${root}-button`);
                this.$button.innerHTML = `
                    <span class="${root}-logo"></span>
                    <span class="${root}-divider"></span>
                    <span class="${root}-aligner">
                        <img class="${root}-text" src="${path}imgs/renault_text.svg" />    
                    </span>
                    
                    <span class="${root}-arrow">
                        <span class="${root}-decor"></span>
                        <span class="${root}-arrow-clickable"></span>
                    </span>
                `;
                var isMobileViewport = 0;
                if (isMobile()) {
                    isMobileViewport = 300;
                }
                if (((document.location.host.indexOf('avg') >= 0) || (document.location.host.indexOf('avtovzglyad') >= 0))
                    && ($article.getBoundingClientRect().height < (viewport.height + isMobileViewport))) {
                    if (this.type === 'image' && this.$button.parentNode && this.$button) {
                        this.$button.parentNode.removeChild(this.$button);
                    } else {
                        this.$button.classList.add(`${root}-bottom`);
                    }
                } else {
                    if (this.type === 'image' ) {
                        this.$button.classList.add(`${root}-image`);
                        this.$root.style.position = 'relative';
                        if ((document.location.host.indexOf('avg') >= 0) || (document.location.host.indexOf('avtovzglyad') >= 0)) {
                            this.$button.classList.add(`platform-avg`);
                        }
                        if ((document.location.host.indexOf('zr')) >=0) {
                            this.$button.classList.add(`${root}-image-zr`);
                        }
                    } else {
                        this.$button.classList.add(`${root}-article`);
                    }
                }
                let self = this;
                this.$button.addEventListener('click', function (event) {
                    self.open(event);
                });
                this.$root.appendChild(this.$button);
            }

            static isStylesInit = false;
            private style_init() {
                if (Button.isStylesInit) {
                    return;
                }
                Button.isStylesInit = true;
                const size: number = 5; // default 5 (нормально 4 - 6)
                const adaptive_height = (value: number) => { // default 6
                    return `
                        height: ${value}vw !important;
                        min-height: ${value * (size + 3)}px !important;
                        max-height: ${value * (size + 4)}px !important;
                        `;
                };
                const styles = `
                    .${root}-button.${root}-mobile-button {
                        font-size: 20px;
                    }
                    .${root}-button {
                        font-size: 25px;
                        position: relative;
                        border: 1px solid #FECB39 !important;
                        background: #FECB39 !important;
                        padding: 0 2em 0 0.4em !important;
                        max-width: 9.92em;
                        height: 2em !important;
                        min-height: 1.92em !important;
                        max-height: 2.16em !important;
                        cursor: pointer !important;
                        display: flex !important;
                        align-items: center;
                        justify-content: space-between;
                        box-shadow: none !important;
                        border-radius: 0 !important;
                        text-shadow: none !important;
                        width: auto !important;
                        margin: 0.4em 0;
                    }              
                    .${root}-button .${root}-logo {
                        background: url('${path}imgs/renault_logo.svg') 50% 50% transparent no-repeat;
                        background-size: contain;
                        width: 4em;
                        max-width: 4.04em;
                        height: 1.36em;
                        min-height: 1.3em !important;
                        max-height: 1.4em !important;
                        display: block !important;
                    }
                    .${root}-button .${root}-divider {
                        background: #ffffff;
                        min-width: 0.12em;
                        width: 0.16em;
                        margin: 0 0.32em !important;
                        max-width: 0.24em;
                        height: 1.36em;
                        min-height: 1.3em !important;
                        max-height: 1.4em !important;
                        display: flex !important;
                        margin: 0 0.32em;
                    }
                    .${root}-button .${root}-aligner {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .${root}-button .${root}-text {
                        width: 2.64em;
                        max-width: 2.65em !important;
                        margin-top: 0.04em !important;
                        height: 0.82em !important;
                        min-height: 0.8em !important;
                        max-height: 0.84em !important;
                        display: flex !important;
                    }
                    .${root}-button-hover {
                        background: #ffffff !important;
                        border-color: #AAA7AB !important;
                    }
                    .${root}-button-hover .${root}-divider {
                        background: #FECE17 !important;
                    }
                    .${root}-button .${root}-arrow {
                        height: 0.04em;
                        width: 0.04em;
                        position: absolute;
                        background: transparent;
                        display: inline-block;
                        right: 0.8em;
                        top: 50%
                    }
                    .${root}-button .${root}-arrow > .${root}-decor {
                        position: absolute;
                        display: inline-block;
                        height: 0.4em;
                        width: 0.48em;
                        top: -0.2em;
                        right: 0;
                    }
                    .${root}-rotate180 {
                        -webkit-transform: rotate(180deg);
                        -moz-transform: rotate(180deg);
                        -ms-transform: rotate(180deg);
                        -o-transform: rotate(180deg);
                    }
                    .${root}-button .${root}-arrow > .${root}-decor:before {
                        content: '';
                        height: 0.16em;
                        width: 0.48em;
                        -webkit-transform: rotate(45deg);
                        -moz-transform: rotate(45deg);
                        -ms-transform: rotate(45deg);
                        -o-transform: rotate(45deg);
                        position: absolute;
                        background: #000000;
                        display: inline-block;
                        right: 0;
                        top: 0px;
                    }
                    .${root}-button .${root}-arrow > .${root}-decor:after {
                        content: '';
                        height: 0.16em;
                        width: 0.48em;
                        -webkit-transform: rotate(-45deg);
                        -moz-transform: rotate(-45deg);
                        -ms-transform: rotate(-45deg);
                        -o-transform: rotate(-45deg);
                        position: absolute;
                        background: #000000;
                        display: inline-block;
                        right: 0;
                        bottom: 0px;
                    }
                    .${root}-button .${root}-arrow-clickable {
                        height: 2.4em;
                        width: 2.6em;
                        left: -1.6em;
                        top: -1.2em;
                        position: absolute;
                        -webkit-touch-callout: none; /* iOS Safari */
                        -webkit-user-select: none; /* Safari */
                        -khtml-user-select: none; /* Konqueror HTML */
                        -moz-user-select: none; /* Firefox */
                        -ms-user-select: none; /* Internet Explorer/Edge */
                        user-select: none; /* Non-prefixed version, currently supported by Chrome and Opera */
                    }
                    .${root}-button.platform-avg {
                            font-size: 28px;
                        }
                    @media(max-width:1000px) {
                        .${root}-fluid {
                            z-index: 5000;
                            position: fixed;
                            top: 100px;
                            left: 0;
                            transform: none;
                        }
                        .${root}-button.avtovzglyad-mobile {
                            font-size: 20px;
                        }
                    }
                    @media(max-width:1024px) {
                       .platform-rbc.${root}-fluid {
                           top: 300px;
                       }
                    }
                    @media(min-width:1024px) {
                       .platform-rbc.${root}-fluid {
                           top: 550px;
                       }
                    }
                    @media(max-height:650px) and (min-width:1024px) {
                       .platform-rbc.${root}-fluid {
                           top: 86vh; 
                       }
                    }
                    @media(max-height:360px) {
                       .platform-rbc.${root}-fluid {
                           top: 170px;
                       }
                    }
                    @media(min-width:1000px) {
                        .${root}-fluid {
                            z-index: 5000;
                            position: fixed;
                            top: 100px;
                            left: 0;
                            transform: none;
                        }
                    }
                    .${root}-bottom {
                        max-width: 10.04em;
                        box-sizing: border-box;
                        -moz-box-sizing: border-box;
                        -webkit-box-sizing: border-box;
                    }
                    .${root}-bottom .${root}-divider {
                        flex-grow: 0;
                        flex-shrink: 0;
                        flex-basis: auto;
                    }
                    .target-image {
                        position: relative;
                    }
                    .${root}-button.${root}-image {
                        position: absolute;
                        bottom: 2.5vw;
                        left: 1.0vw;
                        transform: none;
                    }
                    .platform-rbc.${root}-button.${root}-image {
                        z-index: 999;
                        bottom: 16vw;
                    }
                    @media (max-width: 1024px) {
                        .${root}-button.platform-rbc {
                            font-size: 20px;
                        }                     
                        .platform-rbc.${root}-button.${root}-image {
                            bottom: 2.5vw;
                        }
                    }
                    .${root}-button.${root}-image.platform-avg {
                         bottom: 22px;    
                    }
                    .${root}-button.${root}-image.${root}-image-zr {
                        position: absolute;
                        bottom: 0.5vw;
                        left: 1.0vw;
                        transform: none;
                        box-sizing: border-box !important;
                    }
                `;
                $style.innerHTML += styles;
            }

            private scene_init() {
                this.$button.addEventListener('mouseover', function () {
                    if (isMobile()) {
                        return;
                    }
                    this.classList.add(`${root}-button-hover`);
                });
                this.$button.addEventListener('mouseout', function () {
                    if (isMobile()) {
                        return;
                    }
                    this.classList.remove(`${root}-button-hover`);
                });

                if (!button_init) {
                    return button_init = true;
                }

                // Обьект для проверки было ли инициализировано ga логирование
                const ga_triggered = {top: false, left: false, bottom: false};
                const ga_trigger = (state?: TButtonState, update?: boolean): void => {
                    if (update) { button_state = state; }
                    if (ga_triggered[state ? state : button_state]) { return null; }
                    sendEventToAnalytics('show-' + button_state);
                    sendEventToAnalytics(modelFoundOnPage + '-show-' + button_state);
                    ga_triggered[button_state] = true;
                };
                ga_trigger('top', true);
                const $article_button = (this.type !== 'image') ? this.$button : find(`.${root}-button:not(.${root}-image)`);
                const $image_button = (this.type === 'image') ? this.$button : find(`.${root}-button.${root}-image`);

                // Переменные для реализации анимированной перетекающей кнопки
                let fluidButtonLogo = $article_button.getElementsByClassName(`${root}-logo`)[0];
                let fluidButtonDivider = $article_button.getElementsByClassName(`${root}-divider`)[0];
                let fluidButtonAligner = $article_button.getElementsByClassName(`${root}-aligner`)[0];
                let fluidButtonArrow = $article_button.getElementsByClassName(`${root}-arrow`)[0];
                let fluidButtonArrowDecor = $article_button.getElementsByClassName(`${root}-decor`)[0];
                let fluidButtonArrowClickable =  $article_button.getElementsByClassName(`${root}-arrow-clickable`)[0];
                // Переменные для бокового состояния кнопки на мобильных устройствах
                let fluidButtonState: TFluidButtonState = 'hide'; // Три возможных состояния: скрыта, анимация, открыта
                let fluidButtonAnimateTic = 0; // Для анимации открытия и закрытия

                // Мгновенно сделать видимость кнопки спрятанной.
                function hideFluidButton () {
                    fluidButtonLogo.style.setProperty('display', 'none', 'important');
                    fluidButtonDivider.style.setProperty('display', 'none', 'important');
                    fluidButtonAligner.style.setProperty('display', 'none', 'important');
                    fluidButtonArrow.style.setProperty('right', '12px', 'important');

                    $article_button.style.setProperty('padding', '0 0', 'important');
                    $article_button.style.setProperty('width', '40px', 'important');

                    fluidButtonArrowDecor.classList.remove(`${root}-rotate180`);

                }

                // Мгновенно сделать видимость кнопки показанной.
                function showFluidButton () {
                    fluidButtonLogo.style.setProperty('display', '');
                    fluidButtonDivider.style.setProperty('display', '');
                    fluidButtonAligner.style.setProperty('display', '');
                    fluidButtonArrow.style.setProperty('right', '');
                    if (isMobile() && $article_button.classList.contains(`${root}-fluid`) && !((document.location.host.indexOf('zr')) >=0)) {
                        // fluidButtonArrowDecor.classList.add(`${root}-rotate180`);
                    } else {
                        fluidButtonArrowDecor.classList.remove(`${root}-rotate180`);
                    }
                    $article_button.removeAttribute("style");
                }

                let shomAnimationTimer;
                function startShowAnimation () {
                    if (shomAnimationTimer) {
                        clearTimeout(shomAnimationTimer);
                    }
                    if (hideAnimationTimer) {
                        clearTimeout(shomAnimationTimer);
                    }
                    hideFluidButton();
                    fluidButtonAnimateTic = 0;
                    fluidButtonState = 'animate';
                    function animate () {
                        fluidButtonAnimateTic++;
                        fluidButtonArrow.style.setProperty('right', `${(12 + (0.32 * fluidButtonAnimateTic))}px`, 'important');
                        $article_button.style.setProperty('width', `${(40 + 7.24 * fluidButtonAnimateTic)}px`, 'important');
                        if (fluidButtonAnimateTic < 25) {
                            shomAnimationTimer = setTimeout(animate, 10);
                        } else {
                            showFluidButton();
                            fluidButtonState = 'show';
                        }
                    }
                    shomAnimationTimer = setTimeout(animate, 10);
                }

                let hideAnimationTimer;
                function startHideAnimation () {
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
                    function animate () {
                        fluidButtonAnimateTic++;
                        fluidButtonArrow.style.setProperty('right', `${(20 - (0.32 * fluidButtonAnimateTic))}px`, 'important');
                        $article_button.style.setProperty('width', `${(248 - (7.24 * fluidButtonAnimateTic))}px`, 'important');
                        if (fluidButtonAnimateTic < 25) {
                            shomAnimationTimer = setTimeout(animate, 10);
                        } else {
                            hideFluidButton();
                            fluidButtonState = 'hide';
                        }
                    }
                    shomAnimationTimer = setTimeout(animate, 10);
                }

                // Установить видимость кнопки исходя из её состояния, кроме тех случаев когда это не надо.
                function updateFluidButtonView (forceShow = false) {
                    if (!isMobile() || forceShow) {
                        showFluidButton();
                    } else {
                        if (fluidButtonState == 'hide') {
                            hideFluidButton();
                        } else if(fluidButtonState == 'show') {
                            showFluidButton();
                        }
                    }
                }
                updateFluidButtonView();

                fluidButtonArrowClickable.addEventListener('click', function(event) {
                    if (isMobile() && $article_button.classList.contains(`${root}-fluid`) && fluidButtonState !== 'animate') {
                        if (fluidButtonState == 'hide') {
                            startShowAnimation();
                        } else if (fluidButtonState == 'show') {
                            startHideAnimation();
                        }
                    }
                });

                // Обработка свайпа!
                let swipeState = 'idle';
                let swipeStartTime = 0;
                let swipeStartX = 0;
                let swipeStartY = 0;
                const swipeMaxXForStart = 110; // На каком растоянии от края должен быть начат свайп, чтобы засчитать его.
                const swipeTime = 250; // В течении какого времени должен быть сделан свайп, чтобы засчитать его.
                const swipeThreshold = 110; // На сколько далеко нужно сделать дижение от места начала свайпа, чтобы засчитать его.
                document.addEventListener('touchstart', function (e) {
                    if ($article_button.classList.contains(`${root}-fluid`)) {
                        let touchobj = e.changedTouches[0];
                        if (fluidButtonState === 'hide' && touchobj.pageX < document.documentElement.clientWidth / 2) {
                            // Свайп слева
                            if (touchobj.pageX <= swipeMaxXForStart) {
                                swipeState = 'sweepFromLeft';
                                swipeStartTime = Date.now();
                                swipeStartX = touchobj.pageX;
                                swipeStartY = touchobj.pageY;
                            }
                        } else if (fluidButtonState === 'show') {
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
                            let touchobj = e.changedTouches[0];

                            if (touchobj.pageX < swipeStartX) {
                                // Если движение идёт справо на лево, то это не свайп с лева.
                                return;
                            }

                            let distanceX = touchobj.pageX - swipeStartX;
                            let distanceY = (touchobj.pageY >= swipeStartY) ? touchobj.pageY - swipeStartY : swipeStartY - touchobj.pageY;

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
                    } else if (swipeState == 'sweepFromRight') {
                        // Свайп с права на лево.
                        if (Date.now() - swipeStartTime < swipeTime) {
                            let touchobj = e.changedTouches[0];

                            if (touchobj.pageX > swipeStartX) {
                                // Если движение идёт слева на право, то это не свайп с права.
                                return;
                            }
                            let distanceX = swipeStartX - touchobj.pageX;
                            let distanceY = (touchobj.pageY >= swipeStartY) ? touchobj.pageY - swipeStartY : swipeStartY - touchobj.pageY;

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
                const fluid: string = `${root}-fluid`;

                let topTrigger: boolean = false;
                let bottomTrigger: boolean = true;
                let bottomTriggered: boolean = false;
                let heightDetectionTrigger: boolean = false;
                let articleStarted: boolean = false;
                function getViewport() {
                    if(window.innerWidth !== undefined && window.innerHeight !== undefined) {
                        var w = window.innerWidth;
                        var h = window.innerHeight;
                    } else {
                        var w = document.documentElement.clientWidth;
                        var h = document.documentElement.clientHeight;
                    }
                    return {width: w, height: h};
                }
                function elementInViewport(el: any, partially: boolean) {
                    var partially = (typeof(partially) != 'undefined')? true: false;
                    var rect = el.getBoundingClientRect();
                    if (partially) {
                        return rect.bottom > 0 &&
                            rect.right > 0 &&
                            rect.left < (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */ &&
                            rect.top < (window.innerHeight || document.documentElement.clientHeight) /* or $(window).height() */;
                    } else {
                        return (
                            rect.top >= 0 &&
                            rect.left >= 0 &&
                            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
                            rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
                        );
                    }
                }

                function setButtonPosition() {
                    let pageScrolledToStartOfImage = false;
                    let rectImage = $image.getBoundingClientRect();
                        pageScrolledToStartOfImage = (rectImage.top < 0) ? true : false;
                    let articleScrolledToEnd = false;
                    let rectArticle = $article.getBoundingClientRect();
                    if ($originArticleRect === null) {
                        $originArticleRect = $article.getBoundingClientRect();
                    }
                    if (( rectArticle.top < 0 ) && ( Math.abs(rectArticle.top) >= ($originArticleRect.height - getViewport()['height']))) {
                        articleScrolledToEnd = true;
                    } else {
                        articleScrolledToEnd = false;
                    }

                    if (elementInViewport($article,true) && pageScrolledToStartOfImage) {
                        articleStarted = true;
                    } else {
                        articleStarted = false;
                    }
                    if (articleScrolledToEnd) {
                        $article_button.classList.remove(fluid);
                        $article_button.classList.add(`${root}-bottom`);
                        $article_button.style.setProperty('max-width', '248px', 'important');
                        ga_trigger('bottom', true);
                        let $article_bottom = find_all('.article_bottom')[0];
                        if ($article_bottom) {
                           $article_bottom.appendChild($article_button);
                        }
                        bottomTriggered = true;
                        updateFluidButtonView(true);
                    } else {
                        if ($article_button && articleStarted) {
                            if (elementInViewport($image_button, false) || articleScrolledToEnd) {
                                $article_button.classList.remove(fluid);
                                $article_button.classList.add(`${root}-bottom`);
                                $article_button.style.setProperty('max-width', '248px', 'important');
                                updateFluidButtonView(true);
                            } else {
                                $article_button.classList.add(fluid);
                                $article_button.classList.remove(`${root}-bottom`);
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
                $article_button.addEventListener('mouseover', function(e) {
                    let isFluid = $article_button.classList.contains(`${root}-fluid`);
                    if( (!$article_button.onceHoveredFluid && isFluid) || (!$article_button.onceHovered && !isFluid) ) {
                        /*ga('send', 'event', {
                            eventCategory: 'button',
                            eventAction: (isFluid)? `interacted-floated-button` : `interacted-bottom-button`,
                            eventLabel: location.pathname
                        });*/
                        sendEventToAnalytics(((isFluid)? 'floated-button-hover' : 'bottom-button-hover'));
                        sendEventToAnalytics(((isFluid)? (modelFoundOnPage + '-floated-button-hover') : (modelFoundOnPage + '-bottom-button-hover')));
                    }
                    if (isFluid) {
                        $article_button.onceHoveredFluid = true;
                    } else {
                        $article_button.onceHovered = true;
                    }
                });

                $image_button.onceHovered = false;
                $image_button.addEventListener('mouseover', function(e) {
                    if(!$image_button.onceHovered) {
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
            }

            private open(event?: 'auto' | any) {
                if (
                    isMobile() &&
                    this.type !== 'image' &&
                    this.$button.classList.contains(`${root}-fluid`) &&
                    (
                        event.target.className.indexOf(`${root}-decor`) !== -1 ||
                        event.target.className.indexOf(`${root}-arrow-clickable`) !== -1 ||
                        event.target.className.indexOf(`${root}-arrow`) !== -1
                    )
                ) {
                    return;
                }

                function $upTo(el, elClass) {
                    if (el.classList.contains(elClass)){ return el; }
                    while (el && el.parentNode) {
                        el = el.parentNode;
                        if (el.classList && (el.classList.contains(elClass)) ) {
                            return el;
                        }
                    }
                    return null;
                }

                if (event === 'auto') {
                    popup.open('confirm');
                } else {
                    popup.open('model');
                    let $element = $upTo(event.target, `${root}-button`);
                    let $elementType = null;
                    if ($element.classList.contains(`${root}-image`)) {
                        $elementType = 'top';
                    } else if ($element.classList.contains(`${root}-fluid`)) {
                        $elementType = 'left';
                    } else if ($element.classList.contains(`${root}-article`) && !$element.classList.contains(`${root}-fluid`)) {
                        $elementType = 'bottom';
                    }
                    if ($elementType != null) {
                        /*ga('send', 'event', {
                            eventCategory: 'button',
                            eventAction: `click-${$elementType}`,
                            eventLabel: location.pathname
                        })*/
                        sendEventToAnalytics(`click-${$elementType}`);
                        sendEventToAnalytics(modelFoundOnPage + `-click-${$elementType}`);
                    }
                }
            }
        }
        if ($article !== null) {
            new Button($article);
        }
        if ($image !== null) {
            new Button($image, 'image');
        }
    }

    // Класс описания компонента (Всплывающие окно)
    class Popup {

        private $root = create(`${root}-popup`);
        private $container = create(`${root}-container`);
        private $confirm = create(`${root}-confirm`);
        private $showroom = null;
        private $showroom_loaded = false;
        public can_auto: boolean = false;
        public was_open: boolean = false;
        public opened: boolean = false;
        public stage: string = 'confirm';

        constructor() {
            const self = this;
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
        private view_init(): void {
            const self = this;
            self.$root.tabIndex = -1;
            self.$root.addEventListener('keydown', (event: KeyboardEvent) => event.key === 'Escape' ? self.close() : null);
            self.$container.classList.add(`${root}-hide`);
            if (document.location.host.indexOf('avtovzglyad') >= 0 || document.location.host.indexOf('avg') >= 0) {
                self.$root.classList.add(`avtovzglyad`);
            }
            var isIE11 = document.body.style.msTextCombineHorizontal !== undefined;
            let sourceForModelName = find_all(getModelTextSelector);
            if (sourceForModelName) {
                for (var sourceName of sourceForModelName) {
                    let modelName = (sourceName.innerText || sourceName.textContent).toLowerCase();
                    for (let modelNme of availableModelNames) {
                        if (isIE11) {
                            if (!String.prototype.includes) {
                                String.prototype.includes = function(search, start) {
                                    'use strict';
                                    if (typeof start !== 'number') {
                                        start = 0;
                                    }
                                    if (start + search.length > this.length) {
                                        return false;
                                    } else {
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
                        } else {
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
            } else {
                modelFoundOnPage = availableModelNames[getRandomInt(0, (availableModelNames.length - 1))];
            }

            let statsChangeHandler = (type) => {
                sendEventToAnalytics(type, 'configurator');
                sendEventToAnalytics(modelFoundOnPage + '-' + type, 'configurator');
            };
            // if (document.location.host.indexOf('avtovzglyad') >= 0 || document.location.host.indexOf('avg') >= 0) {
            if (document.location.host.indexOf('7rlines') >= 0) {
                let sourceArticleId = find_all(getArtilceSelector);
                if (sourceArticleId) {
                    let arcticleId = (sourceArticleId.innerText || sourceArticleId.textContent).toLowerCase();
                    console.log(arcticleId, '****************************************************************************************');
                }
            }

            if ((document.location.pathname.indexOf('material1') >=0) ||
                (document.location.pathname.indexOf('material2') >=0) ||
                (document.location.pathname.indexOf('material3') >=0) ||
                (document.location.pathname.indexOf('material4') >=0) ||
                (document.location.pathname.indexOf('material5') >=0) ||
                (document.location.pathname.indexOf('renault-naraschivaet-v-rossii-obemy-prodazh') >=0) ||
                (document.location.pathname.indexOf('dvoe-iz-lartsa-v-rossii-startovali') >=0) ||
                (document.location.pathname.indexOf('novoj-spetsversii-renault-kaptur') >=0) ||
                (document.location.pathname.indexOf('kaptur-play-ne-zaputatsja-v-seti') >=0) ||
                (document.location.pathname.indexOf('906902-v-rossii') >=0) ||
                (document.location.pathname.indexOf('905685-novyj') >=0) ||
                (document.location.pathname.indexOf('908402-renault') >=0) ||
                (document.location.pathname.indexOf('907258-novyj') >=0) ||
                (document.location.pathname.indexOf('909409-lichnoe') >=0) ||
                (document.location.pathname.indexOf('906808-otsenki') >=0) ||
                (document.location.pathname.indexOf('905857-renault') >=0) ||
                (document.location.pathname.indexOf('905678-malomernyj') >=0) ||
                (document.location.pathname.indexOf('905260-zimnie') >=0) ||
                (document.location.pathname.indexOf('905154-clio') >=0) ||
                (document.location.pathname.indexOf('905000-pojmali') >=0) ||
                (document.location.pathname.indexOf('909785-kak') >=0) ||
                (document.location.pathname.indexOf('908333-ehkstremalnyj') >=0) ||
                (document.location.pathname.indexOf('910246-v-sakhare') >=0) ||
                (document.location.pathname.indexOf('908923-stavim') >=0) ||
                (document.location.pathname.indexOf('908268-novyj') >=0) ||
                (document.location.pathname.indexOf('908117-rassekrechen') >=0) ||
                (document.location.pathname.indexOf('907184-renault') >=0) ||
                (document.location.pathname.indexOf('907120-renault') >=0) ||
                (document.location.pathname.indexOf('905219-dakar') >=0) ||
                (document.location.pathname.indexOf('904989-novyj') >=0) ||
                (document.location.pathname.indexOf('908063-rassekrechen') >=0) ||
                (document.location.pathname.indexOf('909769-renault') >=0) ||
                (document.location.pathname.indexOf('909898-dva') >=0) ||
                (document.location.pathname.indexOf('909209-dolgozhdannyj') >=0) ||
                (document.location.pathname.indexOf('907239-dozhdalis') >=0) ||
                (document.location.pathname.indexOf('908747-vybiraem') >=0) ||
                (document.location.pathname.indexOf('908054-renault') >=0) ||
                (document.location.pathname.indexOf('905098-simvol') >=0) ||
                (document.location.pathname.indexOf('906626-v-nem') >=0) ||
                (document.location.pathname.indexOf('911699-renault') >=0) ||
                (document.location.pathname.indexOf('912222-renault') >=0) ||
                (document.location.pathname.indexOf('912127-obnovlennaya') >=0) ||
                (document.location.pathname.indexOf('912291-magazin') >=0) ||
                (document.location.pathname.indexOf('912442-krossover') >=0) ||
                (document.location.pathname.indexOf('912584-renault') >=0) ||
                (document.location.pathname.indexOf('912640-renault') >=0) ||
                (document.location.pathname.indexOf('912542-sekretnye') >=0) ||
                (document.location.pathname.indexOf('913113-renault') >=0) ||
                (document.location.pathname.indexOf('913228-kross') >=0) ||
                (document.location.pathname.indexOf('913456-renault') >=0) ||
                (document.location.pathname.indexOf('913446-obnovlenny') >=0) ||
                (document.location.pathname.indexOf('913809-renault') >=0) ||
                (document.location.pathname.indexOf('913798-renault') >=0) ||
                (document.location.pathname.indexOf('913970-renault') >=0) ||
                (document.location.pathname.indexOf('914172-pokupaem') >=0) ||
                (document.location.pathname.indexOf('914308-renault-obyavila') >=0) ||
                (document.location.pathname.indexOf('914498-renault-kaptur') >=0) ||
                (document.location.pathname.indexOf('914387-5-prichin-kupit') >=0) ||
                (document.location.pathname.indexOf('914522-renault-logan') >=0) ||
                (document.location.pathname.indexOf('2018-09-12-renault-sandero') >=0) ||
                (document.location.pathname.indexOf('2018-10-18-renault-kaptur') >=0) ||
                (document.location.pathname.indexOf('2018-10-30-test-drajv') >=0) ||
                (document.location.pathname.indexOf('material6') >=0) ||
                (document.location.pathname.indexOf('material7') >=0) ||
                (document.location.pathname.indexOf('914660-5-prichin') >=0) ||
                (document.location.pathname.indexOf('914873-novoe') >=0) ||
                (document.location.pathname.indexOf('914855-5-prichin-kupit') >=0) ||
                (document.location.pathname.indexOf('915078-rossiyane-raskupayut') >=0) ||
                (document.location.pathname.indexOf('2018-11-08-kak-poluchit-vygodnye') >=0) ||
                (document.location.pathname.indexOf('2018-11-13-test-drajv-renault-kaptur-play') >=0) ||
                (document.location.pathname.indexOf('915242-v-rossii-startovali') >=0) ||
                (document.location.pathname.indexOf('915002-dan-prikaz') >=0) ||
                (document.location.pathname.indexOf('915263-renault-koleos-poluchil') >=0)
            ) {
                let ShowroomPush = () => {
                    RenaultShowroom.push('embed', {
                        vitrine: modelFoundOnPage,
                        container: `${root}-container`,
                        ready: (showroom) => self.$showroom = showroom,

                        stat: (type) => {
                            statsChangeHandler(type);
                            console.log('showroom stat:', type, self.$showroom)
                        }
                    });
                };
                //rbc
                if (document.location.pathname.indexOf('material1') >=0) {
                    RenaultShowroom.push("token","457a8e7c7c6096be469209adf901b16ac76dd1349a8dc7154fe2221b098d3091.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('material2') >=0) {
                    RenaultShowroom.push("token","cbbe3143cfae9faafae9267953f4e58ff472b16566276af38ddd91c36eb478ac.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('material3') >=0) {
                    RenaultShowroom.push("token","79d0dcfc04737a6c2f76d4f8a309fe6a8836418cbb7d5aa2c6d6c449dfc7207a.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('material4') >=0) {
                    RenaultShowroom.push("token","246bf28138a594b20b5dc51525fb4312b46c22beac0f8df48859aabe8a4b9bef.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('material5') >=0) {
                    RenaultShowroom.push("token","fdfda9f521c519b38b7b7f8bb31ec46ef134f1dbf1aaca646098e8352ffc67ff.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                //ag
                if (document.location.pathname.indexOf('renault-naraschivaet-v-rossii-obemy-prodazh') >=0) {
                    RenaultShowroom.push("token","908ae3e39ffec102c6a6b4293d44355357869c40eea9b55b99ef9b680f8bc08d.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('dvoe-iz-lartsa-v-rossii-startovali') >=0) {
                    RenaultShowroom.push("token","54d25cfccbe5d9cc5c06261906f7ca7dd7f7174e707fa93e89b7c29aa0337e9b.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('novoj-spetsversii-renault-kaptur') >=0) {
                    RenaultShowroom.push("token","b19022abd5f73e5fe1226e23b6b339505a6ddc50eef00abf11b28900598c749b.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('kaptur-play-ne-zaputatsja-v-seti') >=0) {
                    RenaultShowroom.push("token","ab715c25a28fd3efb3750e860aebdaeef150e99a0af7acb30934964935d7febb.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                //zr
                if (document.location.pathname.indexOf('906902-v-rossii') >=0) {
                    RenaultShowroom.push("token","19e227736377c4799b0dc15fc9b09655364ed18b557f2e8fd613ec519474b634.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('905685-novyj') >=0) {
                    RenaultShowroom.push("token","95bfdf98bf6196051c4b295a89d853482df6b16de1558e075c9d0338b425728d.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('908402-renault') >=0) {
                    RenaultShowroom.push("token","864f2e48bd0dd397ab07f7fbb022f4af0b844f156e7a0c04ff6a2d949049ded6.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('907258-novyj') >=0) {
                    RenaultShowroom.push("token","dd33d2095fefbab82758fc5112bd80bf11a880304dfd651258e7cf0c1bbf1156.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('909409-lichnoe') >=0) {
                    RenaultShowroom.push("token","27754979f3254a85ea7f7ce8b68b6b47195bd0bb1be875cf36c8ba0530e9eb45.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('906808-otsenki') >=0) {
                    RenaultShowroom.push("token","596122790158fa3da2037573276da6f8d6025ded6e2e2d58284afd8430ba8f2c.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('905857-renault') >=0) {
                    RenaultShowroom.push("token","ef0f4ba9212984006cfced57c9380ee51689c3842582857c352bb1a0b3ed3a1b.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('905678-malomernyj') >=0) {
                    RenaultShowroom.push("token","c73bc1f4d08c2d587cf1a86193785bf7e844e40bee9abe4978a02357cb467250.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('905260-zimnie') >=0) {
                    RenaultShowroom.push("token","8e058755a67bec9eb4f6f79a2f0caf2686280c3bbd61dcca427c8988f294daa9.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('905154-clio') >=0) {
                    RenaultShowroom.push("token","a45943fa2cd086105317ec0ef74245ec1320794b41871c2f9cfc054ccef8d693.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('905000-pojmali') >=0) {
                    RenaultShowroom.push("token","ac66b014d4fb253c68d545546375b965fd18ab48e9475a0d093c815806549a0f.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('909785-kak') >=0) {
                    RenaultShowroom.push("token","71bf84892759e8772ccd0ca39cf500abfa45e0cf614a045ad304ed930f74e601.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('908333-ehkstremalnyj') >=0) {
                    RenaultShowroom.push("token","1a944937324612c85f2533829a38ce9921171808765d26a411421db0d7e19187.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('910246-v-sakhare') >=0) {
                    RenaultShowroom.push("token","a6102a77bdf4a4da577f6d4305c4fafa84300f413ba89d2890319b7dade33b98.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('908923-stavim') >=0) {
                    RenaultShowroom.push("token","dcdcd3fd1c62764d64d0b4c4539ec9adc9864503a437ead0eb1bfcab9e47b5e9.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('908268-novyj') >=0) {
                    RenaultShowroom.push("token","0f54f0c21eaca1b994fb5d65a7e0a78653e524181d8d18c9035a0e7dec900e01.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('908117-rassekrechen') >=0) {
                    RenaultShowroom.push("token","2b5a5a52ce8d0d9c888433ebc0ae8fc103179952a6dc847912a316588f96dc90.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('907184-renault') >=0) {
                    RenaultShowroom.push("token","5bd40920e0e274d7f43c2158b603743fa32565e93d81e3ca8aafb78d0188e14f.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('907120-renault') >=0) {
                    RenaultShowroom.push("token","96002540b72fcab508cbe58f50fd99581b89f89911a21a456f79c0fb6d0afd4a.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('905219-dakar') >=0) {
                    RenaultShowroom.push("token","a280c8e330c865fe5cda234f838bee102fb5076f863a0b18f7582a608316f9cb.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('904989-novyj') >=0) {
                    RenaultShowroom.push("token","4cf846ea0dd5fad5d4e1c8203fa641e37fb125e2f10fd920a70191eff75a62cc.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('908063-rassekrechen') >=0) {
                    RenaultShowroom.push("token","487009c043f7b6e23a675ff61604af5d3fc5ab4767044c22ff2be34ec3e14a3b.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('909769-renault') >=0) {
                    RenaultShowroom.push("token","dc93837ba68d53fa56830d6256949ead98500607a861daaf57273958602bbb26.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('909898-dva') >=0) {
                    RenaultShowroom.push("token","31aaa4e23da9a0776a2820667c71d2cbc63a2169600b0682a2636eeebe26f494.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('909209-dolgozhdannyj') >=0) {
                    RenaultShowroom.push("token","c5bf7e734c29dbecc5241705d7a540b2344c2f7bd362aaf1311e96bfb5ff80ef.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('907239-dozhdalis') >=0) {
                    RenaultShowroom.push("token","d73a473ee6fec9825b9a32f3c93fc68b4741d32ef9ecceb3e573264d225f0c77.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('908747-vybiraem') >=0) {
                    RenaultShowroom.push("token","cc22297d73dc341d5d2224229cd3f954b350608c5f3cb79aa98aad14796a621a.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('908054-renault') >=0) {
                    RenaultShowroom.push("token","26d95275850c1b6c5efc112104a4a84159cbc3c11b7699dead464dfad67980b9.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('905098-simvol') >=0) {
                    RenaultShowroom.push("token","313e552841dc8fb6cd29eaf741d225a4d53366fd73075431e8de29021ff448b0.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('906626-v-nem') >=0) {
                    RenaultShowroom.push("token","a88aa4a0d6fe048449ed69d50f3ab21ce23cd8ae2d26a08ec8727df3066efc9b.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('911699-renault') >=0) {
                    RenaultShowroom.push("token","9e6aec1bbe3baed2e445855dbb31651d9fd01a508a3d7fba59e926c5283397a4.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('912222-renault') >=0) {
                    RenaultShowroom.push("token","ab09cac6c5795767e110dbb02e1217b27f4eee594e93b399c0f87c501bb50efa.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('912127-obnovlennaya') >=0) {
                    RenaultShowroom.push("token","55e1d8ff1359ae791962142dc08d7710b90355cae8d58047d6fbdb0cded93979.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('912291-magazin') >=0) {
                    RenaultShowroom.push("token","f9563d3e97a5bd1294a1405fe4daddf4ba94527f31ae159e58d5be29d4a4dcf8.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('912442-krossover') >=0) {
                    RenaultShowroom.push("token","f3f0bab33344e7d424aac720cbe8eade8fc1fd3093773a45c357f75c9696e307.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('912584-renault') >=0) {
                    RenaultShowroom.push("token","4f9648235134c5a960e1460505807a94125a7f781ade512ee38fef7d67fe9504.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('912640-renault') >=0) {
                    RenaultShowroom.push("token","c1eaf090131940806d46b7845d4cfeb013a45aa000ef774afbcafb4057cbfcaa.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('912542-sekretnye') >=0) {
                    RenaultShowroom.push("token","f53e2516879cd9072ed65aa8f029c0905ccd0df3cece93ad9414d3476e41ed53.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('913113-renault') >=0) {
                    RenaultShowroom.push("token","9e7eecf6fe6d11104e0561a15be22af96afc1674fdc2d2e2bbb9270c43768b4c.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('913228-kross') >=0) {
                    RenaultShowroom.push("token","137b9fd81fb7a10e84b380a63f3c1bc7ee5c4dc460002f9f401f8ffc6ddebaf5.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('913456-renault') >=0) {
                    RenaultShowroom.push("token","c4516393db83e1f920294d82cf6de6b587f1949a9cdc25ffab7913358f8f4dd0.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('913446-obnovlenny') >=0) {
                    RenaultShowroom.push("token","df13491f5c383b1d0fc750c01dc8c59bd34640ab88737e28c3103d9f77718813.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('913809-renault') >=0) {
                    RenaultShowroom.push("token","607ed8c0a4b1b50267c823deeb10fc71deb7f5c8316480fcdefffdee25796ff6.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('913798-renault') >=0) {
                    RenaultShowroom.push("token","adccd3a2fa9ad288098b43dca21c9b99287807775349352b1f504db573726c1d.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('913970-renault') >=0) {
                    RenaultShowroom.push("token","0424af6ea535ef4b9cd6db98c13307fb166c20b191cb0aa8f81dd97474e9247b.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('914172-pokupaem') >=0) {
                    RenaultShowroom.push("token","e5c0803c3c11c64764afb2d3bb66271058074913548f15853ed790f27b5e5518.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('914308-renault-obyavila') >=0) {
                    RenaultShowroom.push("token","db9567ea21e371c15b1e43b77b68e0f4e3d72054ceb29a8c88f81c78c0d740ad.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('914498-renault-kaptur') >=0) {
                    RenaultShowroom.push("token","8bc8d96985f5ccd912fd05293da1ee213108bc4e3765ffe01cd8f4ce673543a7.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('914387-5-prichin') >=0) {
                    RenaultShowroom.push("token","d960c4b3fc73f3bb7a6fb0a1e4672943ef86e357423ea7ad4a0c9bd54e8981b5.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('914522-renault-logan') >=0) {
                    RenaultShowroom.push("token","5cb4b0702fe4189eae6c6acbeebf9af5d5a371d39e4c887fb897eed890c5c378.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('2018-09-12-renault-sandero-stepway') >=0) {
                    RenaultShowroom.push("token","c3a9bab5ade162893dab78042e5ae0f1f9fff446f37f5262313a98b3644baaf8.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('2018-10-18-renault-kaptur') >=0) {
                    RenaultShowroom.push("token","43b373cea4fe2deec84ceed9f88b35289d092314b83b13c565c448d290079f05.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('2018-10-30-test-drajv') >=0) {
                    RenaultShowroom.push("token","8f53f70bfa2e74b1625d26a58c25b28f37817136bdd7bf6da84260dc831614df.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('material6') >=0) {
                    RenaultShowroom.push("token","6ae4b3d1488776be48002602c7fcdb13b0bf3542900244aa1f205645fed0fb32.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('material7') >=0) {
                    RenaultShowroom.push("token","fe6fe5389020d08bda9de9ec09f5f4764fae04cfbdec5c9897ee2007577729b1.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('914660-5-prichin') >=0) {
                    RenaultShowroom.push("token","7380074b6bd96c0f4aeb22d29d854b019d30f89259b3af00d236e0e2a9a0f85d.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('914873-novoe') >=0) {
                    RenaultShowroom.push("token","38956e5ec8592a7549aabc4610a65d2380b6583bbaaba538e857843fede7ef56.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('914855-5-prichin-kupit') >=0) {
                    RenaultShowroom.push("token","7776d8db46829329fba32b3ff6b1ed8b1326f4e372b4638274a69bc01bfe31bf.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('915078-rossiyane-raskupayut') >=0) {
                    RenaultShowroom.push("token","dbb5232bc4033866dc85f01205bd327c3c80de3212fa00a42c4f007370260e9a.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('2018-11-08-kak-poluchit-vygodnye') >=0) {
                    RenaultShowroom.push("token","45cf2c17b8d509d7a024abe528e161d1cf8921e66d47037f5e687a2832eb24a0.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('2018-11-13-test-drajv-renault-kaptur-play') >=0) {
                    RenaultShowroom.push("token","cfe3ab63ea3f3af8dc4c28487945aa22fb865950b0b1273cba53f8ce57ce1842.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('915242-v-rossii-startovali') >=0) {
                    RenaultShowroom.push("token","236bb4507b4c1f4203260c30828584e4f1bc10ae176d185a19df529cf417fe81.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('915002-dan-prikaz') >=0) {
                    RenaultShowroom.push("token","1d81512edb0455717944994c10a289dc82f613f6bc22c08ca9e25301ad273c0e.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }
                if (document.location.pathname.indexOf('915263-renault-koleos-poluchil') >=0) {
                    RenaultShowroom.push("token","916a98c29d6398271f27109ff342b090d506abdb9aa2af4bca7e8a0f898a904f.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());
                }

            } else {
                RenaultShowroom.push('embed', {
                    source: platformId,
                    vitrine: modelFoundOnPage,
                    container: `${root}-container`,
                    ready: (showroom) => self.$showroom = showroom,
                    /*stat: (type) => ga('send', 'event', {
                        eventCategory: 'configurator',
                        eventAction: type,
                        eventLabel: location.pathname
                    })*/
                    stat: (type) => {
                        statsChangeHandler(type);
                    }
                });
            }


            // Элемент "фоновая подложка"
            function $background(): HTMLElement {
                const $bg = create(`${root}-back`);
                $bg.onceHovered = false;
                $bg.addEventListener('mouseover', () => {
                    if (!$bg.onceHovered) {
                        sendEventToAnalytics('bg-close-hover', 'popup');
                        sendEventToAnalytics(modelFoundOnPage + '-bg-close-hover', 'popup');
                    }
                    $bg.onceHovered = true;
                });
                $bg.addEventListener('click', function(e) {
                    self.close.bind(self);
                    sendEventToAnalytics('bg-close-click', 'popup');
                    sendEventToAnalytics(modelFoundOnPage + '-bg-close-click', 'popup');
                });
                return $bg;
            }

            function $close(): HTMLButtonElement {
                const $close = <HTMLButtonElement>create('button');
                $close.classList.add(`${root}-close`);
                $close.innerHTML = '';
                $close.onceHovered = false;
                $close.addEventListener('mouseover', () => {
                    if (!$close.onceHovered) {
                        sendEventToAnalytics('on-cross-close-hover', 'popup');
                        sendEventToAnalytics(modelFoundOnPage + '-on-cross-close-hover', 'popup');
                    }
                    $close.onceHovered = true;
                });
                $close.addEventListener('click', () => {
                    self.close();
                    sendEventToAnalytics('on-cross-close-click', 'popup');
                    sendEventToAnalytics(modelFoundOnPage + '-on-cross-close-click', 'popup');
                });
                return $close;
            }
            const
                $buttons = create('div'),
                $accept = <HTMLButtonElement>create('button'),
                $decline = <HTMLButtonElement>create('button'),
                $image = <HTMLImageElement>create('img'),
                text = `Вы хотите открыть конфигурацию для ${capitalize(modelFoundOnPage)} ?`;
                if (modelFoundOnPage === 'sandero-stepway') {
                    text = `Вы хотите открыть конфигурацию для Sandero Stepway ?`;
                }

            $image.src = `${path}imgs/models/` + modelFoundOnPage + `.jpg`;
            self.$confirm.appendChild($image);

            self.$confirm.classList.add(`${root}-hide`);
            $buttons.classList.add(`${root}-buttons`);

            $accept.innerHTML = 'Узнать конфигурации';
            $accept.classList.add(`${root}-accept`);

            $accept.onceHovered = false;
            $accept.addEventListener('mouseover', () => {
                if (!$accept.onceHovered) {
                    sendEventToAnalytics('on-about-config-hover', 'popup');
                    sendEventToAnalytics(modelFoundOnPage + '-on-about-config-hover', 'popup');
                }
                $accept.onceHovered = true;
            });
            $accept.addEventListener('click', () => {
                self.open('model');
                sendEventToAnalytics('on-about-config-click', 'popup');
                sendEventToAnalytics(modelFoundOnPage + '-on-about-config-click', 'popup');
            });

            $decline.innerHTML = 'Нет, спасибо';
            $decline.classList.add(`${root}-decline`);

            $decline.onceHovered = false;
            $decline.addEventListener('mouseover', () => {
                if (!$decline.onceHovered) {
                    sendEventToAnalytics('on-decline-config-hover', 'popup');
                    sendEventToAnalytics(modelFoundOnPage + '-on-decline-config-hover', 'popup');
                }
                $decline.onceHovered = true;
            });
            $decline.addEventListener('click', () => {
                self.close();
                sendEventToAnalytics('on-decline-config-click', 'popup');
                sendEventToAnalytics(modelFoundOnPage + '-on-decline-config-click', 'popup');
            });

            self.$confirm.innerHTML += `<p class="${root}-confirm-text">${text}</p>`;
            $buttons.appendChild($accept);
            $buttons.appendChild($decline);
            self.$confirm.appendChild($buttons);
            self.$root.appendChild($background());
            self.$root.appendChild($close());
            self.$root.appendChild(self.$confirm);
            self.$root.appendChild(self.$container);
            self.$root.classList.add(`${root}-hide`);
            document.body.appendChild(self.$root);
        }
        // Стили всплывающего окна
        private style_init(): void {
            let isIOS = function () {
                return (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream);
            };
            let cssRotate = function (deg: '-90deg') {
                return `
                    -webkit-transform: rotate(${deg});
                    -moz-transform: rotate(${deg});
                    -ms-transform: rotate(${deg});
                    -o-transform: rotate(${deg});
                `;
            };
            let scrollIframe = function () {
                let cssIOS = `overflow-y: auto;`;
                let css = `overflow-y: hidden;left: 5%;right: 5%;top:5%;bottom:5%;`;
                return (isIOS()) ? cssIOS : css;
            };
            const style = `
                @font-face {
                    font-family: 'RenaultLife';
                    src: url('${path}fonts/RenaultLife-Bold.eot') format('embedded-opentype'), url('${path}fonts/RenaultLife-Bold.woff') format('woff');
                    font-weight: 700;
                    font-style: normal;
                }
    
                ${root}-popup {
                    z-index: 50000 !important;
                    position:fixed;
                    top:0;
                    right:0;
                    bottom:0;
                    left:0;
                    display: block;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    margin:0;
                    padding:0;
                }
                ${root}-container {
                    position: absolute;
                    top: 5px;
                    right: 5px;
                    bottom: 5px;
                    left: 5px;
                    box-sizing: border-box;
                    padding: 0;
                    background: #ffffff;
                    outline: none;
                    -webkit-overflow-scrolling: touch;
                    ${scrollIframe()};
                }
                
                ${root}-confirm {
                
                }
                ${root}-container iframe {
                    height: 100%;
                    width: 100%;
                }
                .${root}-close {
                    font-size: 1.5rem;
                    padding: 0;
                    border: none;
                    border-radius: 50%;
                    background: #fc3;
                    position: absolute;
                    right: 1%;
                    top: 1%;
                    z-index:4; 
                    height: 34px;
                    line-height: 33px;
                    width: 33px;
                    text-align: center; 
                    vertical-align: top;
                }
                .avtovzglyad .${root}-close {
                    left: 1%;
                }
                .${root}-close:before {
                    content: '';
                    background: #000000;
                    display: inline-block;
                    height: 2px;
                    width: 15px;
                    ${cssRotate('45deg')};
                    position: absolute;
                    left: 9px;
                    top: 50%;
                    margin-top: 0px;
                }
                .${root}-close:after {
                    content: '';
                    background: #000000;
                    display: inline-block;
                    height: 2px;
                    width: 15px;
                    ${cssRotate('-45deg')};
                    position: absolute;
                    left: 9px;
                    top: 50%;
                    margin-top: 0px;
                }
                
                .${root}-close:hover { background: #ffde00 }
                
                @media(min-width: 460px) { 
                    .${root}-buttons {
                        display: flex;
                        justify-content: center;
                    }
                }
                @media(max-width: 460px) {
                    .${root}-buttons {
                        display: grid;
                    }
                    .${root}-buttons > button {
                        font-size: 11px;
                    }
                }
                @media(max-width: 220px) {
                    .${root}-buttons {
                        display: grid;
                    }
                    .${root}-buttons > button {
                        font-size: 9px;
                    }
                }
                
                .${root}-buttons > button {
                    padding: .4rem 2rem;
                    border: none;
                    margin: 1rem .5rem 0;
                    cursor: pointer;
                    border-radius: 0;
                    color: black;
                    font-family: Arial;
                    font-size: 13px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: normal;
                }
                
                .${root}-accept { background: #fc3; }
                
                .${root}-accept:hover { background: #ffde00 }
                
                .${root}-decline { background: #dddddd; }
                
                .${root}-decline:hover { background: #dddddd; }
                
                ${root}-confirm {
                    position: absolute;
                    top: 5px;
                    right: 5px;
                    left: 5px;
                    box-sizing: border-box;
                    padding: 20px;
                    background: #ffffff;
                    outline: none;
                    -webkit-overflow-scrolling: touch;
                    ${scrollIframe()};
                    bottom: auto;
                    right: auto;
                    left: 50%;
                    top: 50%;
                    width: 650px;
                    margin-left: -325px;
                    margin-top: -253px;
                    text-align: center;
                    height: 506px;
                }
                
                @media(max-width: 670px){
                    ${root}-confirm {
                        width: 90%;
                        left: 5%;
                        margin-left: 0;
                        height: auto;
                    }
                }
                @media(max-height: 526px){
                    ${root}-confirm {
                        height: auto;
                        top: 5%;
                        margin-top: 0;
                    }
                }
                
                .${root}-confirm-text {
                    width: 100% !important;
                    text-align: center !important;
                    max-width: initial !important;
                    font-size: 16px !important;
                    padding: 0 !important;
                    margin: 0 !important;
                }
                
                ${root}-confirm > img {
                    width: 600px;
                    display: inline-block;
                    max-width: 100%;
                }
                
                ${root}-back {
                    position:absolute;
                    top:0;left:0;right:0;bottom:0;
                    z-index:0;
                    background: rgba(0, 0, 0, .5);
                }
                
                .${root}-hide { display: none !important }
            `;
            $style.innerHTML += style
        }
        auto_open() {
            let timeout: number = (1 * 1000),
                timer_id: number = null,
                self = this;
            setTimeout(() => this.can_auto = true, timeout);
            window.addEventListener('scroll', (event: Event) => {
                if (!this.can_auto) { return null; }
                if ($article && ( ($article.offsetTop + $article.clientHeight - document.documentElement.clientHeight) < window.pageYOffset) ) {
                    if (timer_id == null && !self.was_open) {
                        timer_id = setTimeout(() => {
                            if (self.opened) { return null; }
                            self.open('confirm');
                        }, timeout);
                    }
                }
            });
        }
        new(html_string: string): void {
            this.view(html_string);
            this.open();
        }
        view(html_string: string): void {
            this.$container.innerHTML = html_string;
        }
        close(): void {
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
            this.$root.classList.add(`${root}-hide`);
        }
        open(stage?: 'confirm' | 'model'): void {
            const self = this;
            if (stage == 'model' && !self.$showroom_loaded) {
                self.$showroom_loaded = true;
                self.$showroom.load();
            }
            this.disableScroll();
            this.opened = true;
            if (!this.was_open) { this.was_open = true; }
            if (this.stage !== stage) { this.stage = stage; }
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
            } else {
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
        }
        preventDefault(e) {
            e = e || window.event;
            if (e.preventDefault) {
                e.preventDefault();
            }
            e.returnValue = false;
        }
        preventDefaultForScrollKeys(e) {
            // left: 37, up: 38, right: 39, down: 40,
            // spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
            let keysToDisable = {37: 1, 38: 1, 39: 1, 40: 1, 32: 1, 33: 1, 34: 1, 35: 1, 36: 1};
            if (keysToDisable[e.keyCode]) {
                e = e || window.event;
                if (e.preventDefault) {
                    e.preventDefault();
                }
                e.returnValue = false;
                return false;
            }
        }
        disableScroll() {
            if (window.addEventListener) { // older FF
                window.addEventListener('DOMMouseScroll', this.preventDefault, false);
            }
            window.onwheel = this.preventDefault; // modern standard
            window.onmousewheel = document.onmousewheel = this.preventDefault; // older browsers, IE
            window.ontouchmove = this.preventDefault; // mobile
            document.onkeydown = this.preventDefaultForScrollKeys;
        }
        enableScroll() {
            if (window.removeEventListener) {
                window.removeEventListener('DOMMouseScroll', this.preventDefault, false);
            }
            window.onmousewheel = document.onmousewheel = null;
            window.onwheel = null;
            window.ontouchmove = null;
            document.onkeydown = null;
        }
    }
    function show($element: HTMLElement): void {
        $element.classList.remove(`${root}-hide`);
    }
    function hide($element: HTMLElement): void {
        $element.classList.add(`${root}-hide`);
    }
    function capitalize(string: string): string {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    init();
}
function renaultAnalyticsPrepare(){
    const loadScript = (url: string = null, loadHandler: any) => {
        if (!url) {return false; }
        let scriptDom = <HTMLElement>document.createElement('script');
        scriptDom.setAttribute('async','');
        scriptDom.type = 'text/javascript';
        scriptDom.onload = loadHandler;
        scriptDom.src = url;
        document.body.appendChild(scriptDom);
        return scriptDom;
    };
    if (!window.ga || typeof(window.ga) == 'uindefined') {
        let loadHandler = function(evt){
            // Инициализация GA
            try {
                window.ga('create', Ga_id, 'auto', 'renaultAnalytics');
            } catch(error) {
                return false;
            }
        };
        window.ga = window.ga||function(){(ga.q=ga.q||[]).push(arguments)};
        window.ga.l=+new Date(); // google analytics
        //loadScript('https://www.google-analytics.com/analytics.js',loadHandler);
        //loadScript('https://www.google-analytics.com/analytics_debug.js',loadHandler);
    } else {
        window.ga = window.ga||function(){(ga.q=ga.q||[]).push(arguments)};
        window.ga.l=+new Date(); // google analytics
        window.ga('create', Ga_id, 'auto', 'renaultAnalytics');
    }
    if (!window.Ya || typeof(window.Ya) == 'undefined') {
        let loadHandler2 = function(evt){
            // Инициализация Ya
            try {
                window['yaCounter' + Ya_id] = new Ya.Metrika({ id: Ya_id, clickmap:true, trackLinks:true, accurateTrackBounce:true });
            } catch(e) {}
        };
        //loadScript('https://mc.yandex.ru/metrika/watch.js', loadHandler2);
    } else {
        try {
            window['yaCounter' + Ya_id] = new Ya.Metrika({ id: Ya_id, clickmap:true, trackLinks:true, accurateTrackBounce:true });
        } catch(e) {}
    }
    renaultButton();
}
renaultAnalyticsPrepare();

})();