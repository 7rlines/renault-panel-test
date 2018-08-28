/* Flash banner on poster or extension code. Last edited by A.Fedotov 23.11.2015 */

var ar_img			= '' || '',
	ar_swf			= '' || '',
	ar_flashver		= parseInt('8') || 0,
	ar_width		= '100%',
	ar_height		= '250',
	ar_img_click	= '',
	ar_wmode		= 'opaque',
	ar_flash_pixels	= '',
	ar_gif_pixels	= '',
	ar_quality		= 'best',
	ar_viewability	= (parseInt('0') || 0) && top == parent,
	ar_html_name    = 'index.html' || '',
	ar_html_pixels	= '';

function ar_flver(d,n,m,f){n=navigator;f='Shockwave Flash';if((m=n.mimeTypes)&&(m=m["application/x-shockwave-flash"])&&m.enabledPlugin&&(n=n.plugins)&&n[f]){d=n[f].description}else if(window.ActiveXObject){try{d=(new ActiveXObject((f+'.'+f).replace(/ /g,''))).GetVariable('$version')}catch(e){}}return parseInt(d?d.replace(/\D+/,'').split(/\D+/)[0]:0)}
function ar_sendPix(s,b,i){if(!s)return;s=ar_rnd_rep(s.replace(/!\[ref\]/,escape(document.referrer||'unknown')));if(b=document.body){i=document.createElement('IMG');i.style.position='absolute';i.style.width=i.style.height='0px';i.onload=i.onerror=function(){b.removeChild(i);i=b=null};i.src=s;b.insertBefore(i,b.firstChild);}else new Image().src=s;return true}
function ar_sendPixs(ps) {
	ps = ps.split(', ');
	for (var i in ps) if (ps.hasOwnProperty(i) && ps[i]) parent.ar_sendPix(httplize(ps[i]));
}

function httplize(s){return ((/^\/\//).test(s)?location.protocol:'')+s}
function ar_rnd_rep(s){return s.replace(/!\[rnd\]/g,RndNum4NoCash)}
function ar_c(s){return !s||(/^http(s|):\/\/|^\/\//i).test(s)?s:CompPath+s}
function ar_fp(p,v){return '<param name="'+p+'" value="'+v+'">'}
function ar_p(p,v){return typeof(v)=='undefined'?'':p+'='+v}
function ar_px(i){return (/^\d+$/.test(i)?i+'px':i)}
function ar_isVA(s){if(/loaded|complete/.test(s.readyState)){s.onload=null;setTimeout(ar_s,0);}}
function ar_s(){
	if (ar_viewability) {
		ar_va = new ar_VA({p: ad_fr});
		ar_va.force();
	}
	if(ad_fr && parent != self){setTimeout('document.close();',1000);}
}
function ar_addEvent(e,t,f){
	if (e.addEventListener) { e.addEventListener(t, f, false); }
	else if (e.attachEvent) { e.attachEvent('on'+t, f); }
}
function ar_removeEvent(e,t,f){
	if (e.removeEventListener) { e.removeEventListener(t, f, false); }
	else if (e.detachEvent) { e.detachEvent('on'+t, f); }
}
function ar_bind(func, context){return function(){return func.apply(context, arguments);};}
function ar_getStyle(e,s){
	if (e.currentStyle) { return e.currentStyle[s]||''; }
	else if (parent.getComputedStyle) { return parent.getComputedStyle(e,null)[s]||''; }
}
function ar_getScroll(){
	var g = {}, d = parent.document, db = d.body, de = d.documentElement, cm = d.compatMode == 'CSS1Compat';
	g.sl = parent.pageXOffset || cm && de.scrollLeft || db.scrollLeft;
	g.st = parent.pageYOffset || cm && de.scrollTop || db.scrollTop;
	return g;
}
function ar_getCoords(e,scroll) {
	var box = e.getBoundingClientRect();

	if (scroll) {
		var sg = ar_getScroll();
		return {left: box.left + sg.sl, top: box.top + sg.st};
	}

	return box;
}
function ar_getOffsetSum(e,scroll) {
	var top = 0, left = 0, fixed = false, sg;

	while(e) {
		if (ar_getStyle(e, 'position') === 'fixed') fixed = true;
		top += e.offsetTop;
		left += e.offsetLeft;
		e = e.offsetParent;
	}

	if (scroll && fixed) {
		sg = ar_getScroll();
		return {left: left + sg.sl, top: top + sg.st};
	}

	if (!scroll && !fixed) {
		sg = ar_getScroll();
		return {left: left - sg.sl, top: top - sg.st};
	}

	return {left: left, top: top};
}
function ar_getPosition(e,scroll){
	var box = e.getBoundingClientRect ? ar_getCoords(e,scroll) : ar_getOffsetSum(e,scroll);
	return {left: Math.round(box.left), top: Math.round(box.top)};
}
var ar_clickCoord = {
	_putRes: function (res, el) {
		function put(custom, n, val) {
			var r = new RegExp(n + '=.*?(;|$)', 'i');
			custom = r.test(custom) ? custom.replace(r, n + '=' + val + '$1') : (custom + (custom ? ';' : '') + n + '=' + val);
			return custom;
		}

		if (el.href.indexOf('custom=') !== -1) {
			el.href = el.href.replace(/(?:custom=(.*?)(&|$))/i, function (s, custom, end) {
				custom = put(custom, 201, res.x);
				custom = put(custom, 202, res.y);
				custom = put(custom, 206, 'js');

				return 'custom=' + custom + end;
			});
		} else { el.href += '&custom=201=' + res.x + ';202=' + res.y + ';206=js'; }
	},
	calc: function (ev, link, el) {
		var click = {x: ev.clientX, y: ev.clientY},
			ph = ar_getPosition(el),
			res = {x: click.x - ph.left, y: click.y - ph.top};
		this._putRes(res, link);
	}
};
function ar_v(p, v){return ((typeof(p) == 'undefined' || isNaN(p)) ? (v || 0) : p)}
function ar_getEvent(n){
	return httplize('//' + ar_rhost + '/cgi-bin/event.cgi?ntype=' + ar_v(ar_ntype, 0)
		+ ar_p('&xpid', window.ar_xpid)
		+ '&bid=' + ar_v(bid, 0)
		+ '&sid=' + ar_v(ar_siteid, 0)
		+ '&bt=' + ar_v(ar_bt, 0)
		+ '&ad=' + ar_v(ar_adid, 0)
		+ '&nid=' + ar_v(ar_nid, 0)
		+ '&rnd=' + ar_v(RndNum4NoCash, 0)
		+ '&sliceid=' + ar_v(sliceid, 0)
		+ '&type=' + n);
}
var ar_checkOver = {
	init: function (ph) {
		this.p = ph;
		this.timer = 0;
		this.delay = 500;

		this.handleOver = ar_bind(this.over, this);
		this.handleOut = ar_bind(this.out, this);

		ar_addEvent(this.p, 'mouseover', this.handleOver);
		ar_addEvent(this.p, 'mouseout', this.handleOut);
	},
	over: function () { this.timer = setTimeout(ar_bind(this.complete, this), this.delay); },
	out: function () { clearTimeout(this.timer); },
	complete: function () {
		parent.ar_sendPix(ar_getEvent(100));
		this.end();
	},
	end: function () {
		ar_removeEvent(this.p, 'mouseover', this.handleOver);
		ar_removeEvent(this.p, 'mouseout', this.handleOut);
	}
};

if(typeof(ar_bnum)=='undefined') var ar_bnum = 1;
if(typeof(ar_rhost)=='undefined') var ar_rhost = 'ad.adriver.ru';
if(typeof(ar_geozoneid)=="undefined") var ar_geozoneid = 0;
ar_swf = ar_c(ar_rnd_rep(ar_swf));
ar_img = ar_c(ar_rnd_rep(ar_img));
ar_html_name = ar_c(ar_rnd_rep(ar_html_name));
ar_img_click = ar_rnd_rep(ar_img_click);
ar_wmode = ar_wmode||'transparent';
ar_pass = unescape(window.ar_pass || '');

parent.ar_sendPix = ar_sendPix;
parent.ar_sendPixs = ar_sendPixs;

var ad_fr = parent.document.getElementById('ad_ph_' + ar_bnum),
	ar_target = Target.indexOf('_top') != -1 ? '_top' : '_blank',
	ar_metrics = 'width="100\x25" height="100\x25"',
	ar_html = '',
	ar_cr_id = 'ar_cr_' + ar_bnum + Math.round(Math.random() * 1000000),
	ar_va = null,
	ar_pixs;

if (ar_html_name) {
	ar_pixs = ar_html_pixels;

	ar_html = '<iframe id="' + ar_cr_id + '" name="' + ar_cr_id + '" ' + ar_metrics + ' marginwidth=0 marginheight=0 scrolling=no vspace=0 hspace=0 frameborder=0 src="' + ar_html_name + (/\?/.test(ar_html_name) ? '&' : '?') + 'html_params='
			+escape(
				ar_p('target', ar_target) +
				ar_p('&rhost', ar_rhost) +
				ar_p('&bid', bid) +
				ar_p('&sid', ar_siteid) +
				ar_p('&width', ar_width) +
				ar_p('&height', ar_height) +
				ar_p('&rnd', RndNum4NoCash) +
				ar_p('&pz', ar_pz) +
				ar_p('&ad', ar_adid) +
				ar_p('&bt', ar_bt) +
				ar_p('&bn', window.ar_bn) +
				ar_p('&ar_sliceid', sliceid) +
				ar_p('&ntype', ar_ntype) +
				ar_p('&nid', ar_nid) +
				ar_p('&xpid', escape(window.ar_xpid)) +
				ar_p('&url', escape(CgiHref + '&rleurl=')) +
				ar_p('&CompPath', escape(CompPath)) +
				ar_p('&ar_pass', escape(ar_pass))
			)
			+'"><\/iframe>';
} else if (ar_swf && ar_flver()>=ar_flashver) {
	ar_pixs = ar_flash_pixels;

	var ar_flashvars = 'link1=' + escape(httplize(CgiHref) + '&rleurl=')
		+ ar_p('&target', ar_target)
		+ ar_p('&ar_comppath', escape(httplize(CompPath)))
		+ ar_p('&ar_pass', escape(ar_pass))
		+ ar_p('&ar_bid', bid)
		+ ar_p('&ar_bt', ar_bt)
		+ ar_p('&ar_ad', ar_adid)
		+ ar_p('&ar_nid', ar_nid)
		+ ar_p('&ar_rnd', RndNum4NoCash)
		+ ar_p('&ar_ntype', ar_ntype)
		+ ar_p('&ar_sliceid', sliceid)
		+ ar_p('&ar_sid', ar_siteid)
		+ ar_p('&ar_geoid', ar_geozoneid)
		+ ar_p('&ar_xpid', window.ar_xpid)
		+ ar_p('&ar_rhost', escape(ar_rhost));

	ar_html = window.ActiveXObject
		? '<object id="'+ar_cr_id+'" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" ' + ar_metrics + '>'
			+ ar_fp('movie', ar_swf + (ar_swf.indexOf('?')!=-1?'&':'?') + ar_flashvars)
			+ ar_fp('wmode', ar_wmode)
			+ ar_fp('quality', ar_quality)
			+ ar_fp('flashvars', ar_flashvars)
			+ ar_fp('play', 'true')
			+ ar_fp('loop', 'true')
			+ ar_fp('menu', 'false')
			+ ar_fp('allowScriptAccess', 'always')
			+ '</object>'
		: '<embed id="'+ar_cr_id+'" type="application/x-shockwave-flash" menu=false allowScriptAccess=always play=true loop=true src="'
			+ ar_swf + '" wmode=' + ar_wmode + ' quality=' + ar_quality + ' flashvars="' + ar_flashvars + '" '
			+ ar_metrics + '></embed>';
} else if (ar_img) {
	ar_pixs = ar_gif_pixels;

	parent.ar_clickCoord = ar_clickCoord;
	ar_html = '<a href="' + CgiHref + '&rleurl=' + escape(ar_img_click) + '" onclick="ar_clickCoord.calc(event, this, document.getElementById(\'ad_ph_' + ar_bnum + '\')); return ar_sendPix(\''+ar_pass+'\');" target="' + ar_target + '"><img id="'+ar_cr_id+'" src="' + ar_img + '" border="0" alt="' + (Alt||'') + '" ' + ar_metrics + '></a>';
}

if(location.href.indexOf('mngcgi')==-1) parent.ar_sendPixs(ar_pixs);

if(ad_fr&&parent!=self){
	ad_fr.innerHTML		= ar_html;
	ad_fr.style.width	= ar_px(ar_width);
	ad_fr.style.height	= ar_px(ar_height);
	ad_fr.style.display	= "block";
}
else document.write(ar_html);

ar_checkOver.init(parent.document.getElementById(ar_cr_id));

ar_html && ar_viewability ? document.write('<script type="text/javascript" src="' + Mirror + '/viewability.js?0.1.1" onload="ar_s()" onreadystatechange="ar_isVA(this)" onerror="ar_s()"></script>') : ar_s();
