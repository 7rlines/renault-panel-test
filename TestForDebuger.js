/*
 * Это простой редактор JavaScript.
 *
 * Введите JavaScript, затем щёлкните правой кнопкой или выберите из меню Выполнить:
 * 1. Запустить, чтобы исполнить выделенный текст (Ctrl+R),
 * 2. Исследовать, чтобы вызвать для результата Инспектор Объектов (Ctrl+I), или,
 * 3. Отобразить, чтобы вставить результат в комментарий после выделения. (Ctrl+L)
 */

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

loadScript('https://adtest.000webhostapp.com/adServ/loader.js');
