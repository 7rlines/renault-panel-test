
function httplize(s){return ((/^\/\//).test(s) ? ((location.protocol == 'https:')?'https:':'http:') : '') + s} 
var ar_q = '';
if(ar_q.indexOf("ad_google")!=-1){
	var ar_e = ar_q.indexOf("100=");ar_q = ar_q.slice(ar_e+4); ar_q=ar_q.split(';');
	var CgiHref =unescape(ar_q[0])+httplize('//ad.adriver.ru/cgi-bin/click.cgi?sid=200394&ad=648862&bid=5484847&bt=43&bn=1&pz=0&nid=0&ref=&custom=&xpid=DwIFduqa4trdkiILPJseFEB3fTsWxtFhgqMxuC5EisPu3f3fBSF4CtjWCm0cfR-8_5AUcdmS39HCgunAeMC6q');
}else{
	var CgiHref = httplize('//ad.adriver.ru/cgi-bin/click.cgi?sid=200394&ad=648862&bid=5484847&bt=43&bn=1&pz=0&nid=0&ref=&custom=&xpid=DwIFduqa4trdkiILPJseFEB3fTsWxtFhgqMxuC5EisPu3f3fBSF4CtjWCm0cfR-8_5AUcdmS39HCgunAeMC6q');
}
var ar_bt=43;
var ar_siteid = 200394;
var Mirror = httplize('//servers2.adriver.ru');
var bid = 5484847;
var sliceid = 2078708;
var ar_adid = 648862;
var ar_pz=0;
var ar_sz='%2fwww%2fcontent%2fnews%2f910852%2dvoditelej%2dne%2dpoluchaetsya%2drazdel%2f';
var ar_nid=0;
var ar_pass='';
var ar_bn=1;
var ar_geozoneid=52;
var Path = '/images/0005484/0005484847/';
var Comp0 = '0/script.js';
var Width = 0;
var Height = 250;
var date = 'Fri, 16 Feb 2018 13:16:01 GMT';
var Uid = 51020248780;
var Target = '_blank';
var Alt = 'AdRiver';
var CompPath = Mirror + Path + '0/';
var RndNum4NoCash = 419957154;
var ar_ntype = 0;
var ar_tns = 0;
var ar_rhost='ad.adriver.ru';
var ar_exposure_price = 0;
var ar_xpid = 'DwIFduqa4trdkiILPJseFEB3fTsWxtFhgqMxuC5EisPu3f3fBSF4CtjWCm0cfR-8_5AUcdmS39HCgunAeMC6q';
if (typeof(ar_tansw) != 'undefined') clearInterval(ar_tansw);
var ar_script = '<script src="' + Mirror + Path + Comp0 + '?419957154" type="text/javascript" charset="windows-1251"><\/script>';
function loadScript(req){try {var head = parent.document.getElementsByTagName('head')[0],s = parent.document.createElement('script');s.setAttribute('type', 'text/javascript');s.setAttribute('charset', 'windows-1251');s.setAttribute('src', req.split('rnd').join(Math.round(Math.random()*9999999)));s.onreadystatechange = function(){if(/loaded|complete/.test(this.readyState)){head.removeChild(s);s.onload = null;}};s.onload = function(){head.removeChild(s);};head.insertBefore(s, head.firstChild);}catch(e){}}
if (typeof(ar_bnum)=='undefined') {var ar_bnum = 1;}
var ad_id = 'ad_ph_' + ar_bnum;
if (typeof(window.parent.AdriverViewability)=="undefined"){window.parent.AdriverViewability = true;loadScript("//content.adriver.ru/banners/0002186/0002186173/0/AV.js")}
window.parent.adriverviewability = window.parent.adriverviewability || {};
window.parent.adriverviewability.v = window.parent.adriverviewability.v || [];
window.parent.adriverviewability.v.push (function (){window.parent.adriverviewability[ad_id] = new window.parent.AdriverViewability('//ad.adriver.ru/cgi-bin/event.cgi?xpid=DwIFduqa4trdkiILPJseFEB3fTsWxtFhgqMxuC5EisPu3f3fBSF4CtjWCm0cfR-8_5AUcdmS39HCgunAeMC6q&bid=5484847&type=',0,ad_id);});
document.write(ar_script);
	  

(function (o) {
	var i, w = o.c || window, d = document, y = 31;
	function oL(){
		if (!w.postMessage || !w.addEventListener) {return;}
		if (w.document.readyState == 'complete') {return sL();}
		w.addEventListener('load', sL, false);
	}
	function sL(){try{i.contentWindow.postMessage('pgLd', '*');}catch(e){}}
	function mI(u, oL){
		var i = d.createElement('iframe'); i.setAttribute('src', o.hl(u)); i.onload = oL; with(i.style){width = height = '10px'; position = 'absolute'; top = left = '-10000px'} d.body.appendChild(i);
		return i;
	}
	function st(u, oL){
		if (d.body){return i = mI(u, oL)}
		if(y--){setTimeout(function(){st(u, oL)}, 100)}
	}
	st(o.hl('//content.adriver.ru/banners/0002186/0002186173/0/l6.html?648862&0&0&0&419957154&0&51020248780&52&176.213.140.193&javascript&' + (o.all || 0)), oL);
}({
	hl: function httplize(s){return ((/^\/\//).test(s) ? ((location.protocol == 'https:')?'https:':'http:') : '') + s},
        
        c: parent,
        
	
	all: 1
	
}));
