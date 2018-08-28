
function httplize(s){return ((/^\/\//).test(s) ? ((location.protocol == 'https:')?'https:':'http:') : '') + s} 
var ar_q = '';
if(ar_q.indexOf("ad_google")!=-1){
	var ar_e = ar_q.indexOf("100=");ar_q = ar_q.slice(ar_e+4); ar_q=ar_q.split(';');
	var CgiHref =unescape(ar_q[0])+httplize('//ad.adriver.ru/cgi-bin/click.cgi?sid=200394&ad=620787&bid=4966321&bt=43&bn=13&pz=0&nid=0&ref=https:%2f%2frenault.7rlines.com%2f&custom=&xpid=D6h7rUu7kC2qho2KCw0fNCb0HQgC4hS_jCuFja0w1nkJNS53VonOmXAVprjrt-7Jz_ghLQ16lGM0m6_AeJQ2HyGg');
}else{
	var CgiHref = httplize('//ad.adriver.ru/cgi-bin/click.cgi?sid=200394&ad=620787&bid=4966321&bt=43&bn=13&pz=0&nid=0&ref=https:%2f%2frenault.7rlines.com%2f&custom=&xpid=D6h7rUu7kC2qho2KCw0fNCb0HQgC4hS_jCuFja0w1nkJNS53VonOmXAVprjrt-7Jz_ghLQ16lGM0m6_AeJQ2HyGg');
}
var ar_bt=43;
var ar_siteid = 200394;
var Mirror = httplize('//servers1.adriver.ru');
var bid = 4966321;
var sliceid = 1904540;
var ar_adid = 620787;
var ar_pz=0;
var ar_sz='%2frenault%2f';
var ar_nid=0;
var ar_pass='';
var ar_bn=13;
var ar_geozoneid=52;
var Path = '/images/0004966/0004966321/';
var Comp0 = '0/script.js';
var Width = 240;
var Height = 400;
var date = 'Wed, 21 Feb 2018 08:27:54 GMT';
var Uid = 46757475802;
var Target = '_blank';
var Alt = 'AdRiver';
var CompPath = Mirror + Path + '0/';
var RndNum4NoCash = 926669604;
var ar_ntype = 0;
var ar_tns = 0;
var ar_rhost='ad.adriver.ru';
var ar_exposure_price = 0;
var ar_xpid = 'D6h7rUu7kC2qho2KCw0fNCb0HQgC4hS_jCuFja0w1nkJNS53VonOmXAVprjrt-7Jz_ghLQ16lGM0m6_AeJQ2HyGg';
if (typeof(ar_tansw) != 'undefined') clearInterval(ar_tansw);
var ar_script = '<script src="' + Mirror + Path + Comp0 + '?926669604" type="text/javascript" charset="windows-1251"><\/script>';
function loadScript(req){try {var head = parent.document.getElementsByTagName('head')[0],s = parent.document.createElement('script');s.setAttribute('type', 'text/javascript');s.setAttribute('charset', 'windows-1251');s.setAttribute('src', req.split('rnd').join(Math.round(Math.random()*9999999)));s.onreadystatechange = function(){if(/loaded|complete/.test(this.readyState)){head.removeChild(s);s.onload = null;}};s.onload = function(){head.removeChild(s);};head.insertBefore(s, head.firstChild);}catch(e){}}
if (typeof(ar_bnum)=='undefined') {var ar_bnum = 1;}
var ad_id = 'ad_ph_' + ar_bnum;
if (typeof(window.parent.AdriverViewability)=="undefined"){window.parent.AdriverViewability = true;loadScript("//content.adriver.ru/banners/0002186/0002186173/0/AV.js")}
window.parent.adriverviewability = window.parent.adriverviewability || {};
window.parent.adriverviewability.v = window.parent.adriverviewability.v || [];
window.parent.adriverviewability.v.push (function (){window.parent.adriverviewability[ad_id] = new window.parent.AdriverViewability('//ad.adriver.ru/cgi-bin/event.cgi?xpid=D6h7rUu7kC2qho2KCw0fNCb0HQgC4hS_jCuFja0w1nkJNS53VonOmXAVprjrt-7Jz_ghLQ16lGM0m6_AeJQ2HyGg&bid=4966321&type=',0,ad_id);});
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
	st(o.hl('//content.adriver.ru/banners/0002186/0002186173/0/l6.html?620787&0&0&0&926669604&0&46757475802&52&176.213.140.193&javascript&' + (o.all || 0)), oL);
}({
	hl: function httplize(s){return ((/^\/\//).test(s) ? ((location.protocol == 'https:')?'https:':'http:') : '') + s},
        
        c: parent,
        
	
	all: 1
	
}));
