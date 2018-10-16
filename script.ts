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
    const path: string = 'http://renault.7rlines.com/';
    // селектор контейнера с картинкой в котором должна появиться кнопка
    const victimSelector: string = '.article_image, .bigNodeImage, .topArticlesListImage, .image-micro-schema, .main-article-figure, .video-player, .article-image';
    // селектор элемента из которого можно получить название модели
    const getModelTextSelector: string = '.model-name, .model_name, .article-text, .car-tag .preview .name .transition_link, .textpage, .article__content';
    // селектор статьи
    const articleContainerSelector: string = '.description, #content, article, .main-article, .main-article.hreview, textpage, .page, .main';
    // массив возможных моделей
    const availableModelNames: Array<string> = ['kaptur', 'koleos', 'logan', 'sandero', 'sandero-stepway', 'duster', 'dokker'];
    // найденное имя модели
    let modelFoundOnPage = 'kaptur';
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
            window['yaCounter' + Ya_id].reachGoal(category + ': ' + eAction, goalParams, goalCB );
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
                    @media (max-width: 767px) {
                        .${root}-button.${root}-image.platform-avg {
                            bottom: 5vw;
                        }
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
                                break;
                            }
                        } else {
                            if (modelName.includes(modelNme)) {
                                modelFoundOnPage = modelNme;
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


                if (modelFoundOnPage == 'koleos') {
                    console.log('Koleos');
                    RenaultShowroom.push("token","e536ed9d2a721c7a76d569c523ce6de3e2f930c263580870438cb6bb813e4895.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());

                }
                if (modelFoundOnPage == 'kaptur') {
                    console.log('Kaptur');
                    RenaultShowroom.push("token","003487471d9735cf4d809915a4277cd7b8692bf6f4c257f08026476179308cd4.external-vitrine");
                    loadScript('https://showroom.renault.ru/vitrines/static/js/embed.js', ShowroomPush());

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
                    height: 33px;
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