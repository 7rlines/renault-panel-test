// ****** Editable block ******
// Last modified 21/01/14
var ar_back = '123.jpg',	// имя фонового изображения. Впишите ваше имя файла. Если изображение должно загружаться со стороннего сервера, впишите полный адрес, начинающийся с «http://». В этом случае, загружать его не придется.
    ar_back_color = '#000000',		// цвет, которым заполняется место, вокруг фонового изображения. Указывайте цвет в виде rgb: #rrggbb. Если не нужен, оставьте пустым.
    ar_content_width = '1024px',			// ширина контента сайта
    ar_transparent = '1x1.gif',		// имя прозрачного изображения. Впишите ваше имя файла. Если изображение должно загружаться со стороннего сервера, впишите полный адрес, начинающийся с «http://». В последнем случае, загружать его не придется.
    ar_tr_width = '100px',			// ширина кликовой области. Можно указать размер в процентах(%) или в пикселях (px).
    ar_tr_height = '100%',			// высота кликовой области. Можно указать размер в процентах(%) или в пикселях (px).
    ar_tr_left = '1024px',			// смещение кликовой области от левого края окна. Можно указать размер в процентах (%) или в пикселях (px).
    ar_tr_top = '0px',			// смещение кликовой области от верхнего края окна. Можно указать размер в процентах (%) или в пикселях (px).
    ar_width1 = '0px',			// увеличение(уменьшение) ширины для левой кликовой области.
    ar_width2 = '0px',			// ... для правой кликовой области
    ar_pad_top = '0px',			// высота верхней кликовой области, при значении 0px верхняя кликовая область не используется.
    ar_gif_pixel = '',// вызов стороннего счётчика. Если не нужен, оставьте пустым.
	ar_gif_pixel2 = '',				// вызов второго стороннего счётчика. Если не нужен, оставьте пустым.
    ar_position = 'fixed';          // фиксирование подложки. Если не нужно, оставьте пустым.

//*********** Editable block end *********************
//*********** Touch nothing below ********************
var doc = parent.document;

function ar_sendPix(s, b, i) {
    if (!s)return;
    s = ar_rnd_rep(s.replace(/!\[ref\]/, escape(doc.referrer || 'unknown')));
    if (b = doc.body) {
        i = doc.createElement('IMG');
        i.style.position = 'absolute';
        i.style.width = i.style.height = '0px';
        i.onload = i.onerror = function () {
            b.removeChild(i);
            i = b = null
        };
        i.src = s;
        b.insertBefore(i, b.firstChild);
    } else new Image().src = s;
    return true
}
function ar_rnd_rep(s) {
    return s.replace(/!\[rnd\]/g, RndNum4NoCash)
}
function ar_c(s) {
    return !s || (/^http(s|):\/\/|^\/\//i).test(s) ? s : CompPath + s
}
function normalize(value, dimension) {
    return ((/\d+$/).test(value) ? value + (dimension || 'px') : value)
}

ar_sendPix(ar_gif_pixel);
ar_sendPix(ar_gif_pixel2);

ar_bnum = window.ar_bnum || 1;
ar_pass = unescape(window.ar_pass || '');
ar_bid = (typeof(window.bid) == 'undefined') ? 0 : window.bid;
ar_target = Target.indexOf('_top') != -1 ? '_top' : '_blank';

var g = {}, db = doc.body, de = doc.documentElement;
g.cw = de.clientWidth || self.innerWidth || db.clientWidth;
g.ch = de.clientHeight || self.innerHeight || db.clientHeight;

ar_width1 = parseInt(ar_width1, 10);
ar_width2 = parseInt(ar_width2, 10);

var ar_a = makeClick(ar_tr_left, "ar_a");

function makeClick(l, id) {

    var d = doc.createElement('div');
    d.id = "brand_banner";

    var s = doc.createElement('a');
    s.className = "link no_icon";
    s.style.background = ar_back_color + ' url(' + ar_c(ar_back) + ') no-repeat scroll 0 0 ';
    s.id = id + ar_bid;

    s.href = CgiHref;
    s.target = '_blank';
    s.innerHTML = '<img src="' + ar_c(ar_transparent) + '" style="display: none;">';

    d.appendChild(s);
    doc.body.insertBefore(d, doc.body.firstChild);
    return s;
}

var ad_fr = doc.getElementById('ad_ph_' + ar_bnum);
if (ad_fr && self != parent) {
    ad_fr.style.display = "block";
    setTimeout("document.close();", 1000);
}