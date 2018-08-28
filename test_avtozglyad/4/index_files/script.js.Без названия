req();
function req() {
    var intervalID = window.setInterval(interval, 1000);
    var clicks = 0;
    function interval() {
        if (clicks > 6) {
            document.removeEventListener("click", click, false); 
            document.removeEventListener("touchstart", touch, false); 
            document.createElement("img").src = window.location.protocol + "//botradar.tech/clicks?localstor=" + getLocalStorUID() + "&clicks=" + clicks;
        }
        clicks = 0;
    }

    document.addEventListener("click", click);
    function click() {
        clicks++;
    }
    document.addEventListener("touchstart", touch);
    function touch() {
        clicks++;
    }
    function getLocalStorUID() {
        var storageVal = localStorage.getItem("botradar-id");
        if (!storageVal) {
            var cookieUID = getCookie("botradar-id");
            localStorage.setItem("botradar-id", cookieUID);
            storageVal = cookieUID;
        }
        if (!storageVal) storageVal = "";
        return storageVal
    }
    function setCookie(cname, cvalue, exdays) {
		var d = new Date();
		d.setTime(d.getTime() + (exdays*24*60*60*1000));
		var expires = "expires="+ d.toUTCString();
		document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
    
    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
    var requestURL = window.location.protocol + "//botradar.tech/hit";
    var urlParams = getAllUrlParams(window.location.href);
    var UTMparams = getUTMs(urlParams);
    var site = window.location.hostname;
    if (site.slice(0, 4) == "www.") site = site.slice(4, site.length);
    var d = new Date();
    var dateTime = addZero(d.getMonth() + 1) + "." + addZero(d.getDate()) + "." + addZero(d.getFullYear()) + " " + addZero(d.getHours()) + ":" + addZero(d.getMinutes()) + ":" + addZero(d.getSeconds());
    function addZero(time) {
        var unit = Number(time);
        return unit < 10 ? "0" + unit : unit;
    }
    var parser = document.createElement('a');
    parser.href = document.referrer;
    var ih = window.innerHeight ? window.innerHeight : "";
    var iw = window.innerWidth ? window.innerWidth : "";
    var oh = window.outerHeight ? window.outerHeight : "";
    var ow = window.outerWidth ? window.outerWidth : "";
    var sw = window.screen.width ? window.screen.width : "";
    var sh = window.screen.height ? window.screen.height : "";
	var getCode = document.currentScript.getAttribute('data-code');
	var code = "";
	if (!getCode) code = "";
	else code = getCode;
    var utmParams = code ? "" : encodeQueryData(UTMparams);
    var iframe = "0";
    try {
        if ( top !== self ) { 
            iframe = "1"
        } 
    }
    catch (e) {
        iframe = "0";
    }
    var storageVal = localStorage.getItem("botradar-id");
	if (!storageVal) {
        var cookieUID = getCookie("botradar-id");
        localStorage.setItem("botradar-id", cookieUID);
        storageVal = cookieUID;
    }
    if (!storageVal) storageVal = "";
    requestURL = requestURL + "?" + utmParams + "&referrer=" + parser.hostname + "&site=" + site + "&ih=" + ih + "&iw=" + iw + "&oh=" + oh + "&ow=" + ow + "&sw=" + sw + "&sh=" + sh + "&datetime=" + dateTime + "&code=" + code + "&iframe=" + iframe + "&localstor=" + getLocalStorUID();
    var reqImage = document.createElement("img");
    reqImage.src = requestURL;



    // if (storageVal === "") {
    //     var xhttp = new XMLHttpRequest();
    //     xhttp.open("GET", window.location.protocol + "//botradar.tech/req/getuid", true);
    //     xhttp.withCredentials = true;
    //     xhttp.send();
    //     xhttp.onreadystatechange = function() {
    //         if (this.readyState == 4 && this.status == 200) {
    //             localStorage.setItem('botradar-id', this.responseText);
    //        }
    //     }; 
    // }
    // function mouse(e){
    //     document.removeEventListener("mousemove", mouse, false); 
    //     document.createElement("img").src = window.location.protocol + "//botradar.tech/mouse?x=" + e.movementX + "&y=" + e.movementY + "&localstor=" + getLocalStorUID();    
    // }
    // document.addEventListener("mousemove", mouse)

    function encodeQueryData(data) {
        var ret = [];
        for (var d in data)
            ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
        return ret.join('&');
    }

    function getUTMs(urlParams) {
        var UTMonly = {};
        for (var prop in urlParams) {
            if (urlParams.hasOwnProperty(prop)) {
                var paramCheck = prop.slice(0, 4);
                if (paramCheck == "utm_") {
                    UTMonly[prop] = urlParams[prop];
                }
            }
        }
        return UTMonly;
    }

    function getAllUrlParams(url) {
        var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
        var obj = {};
        if (queryString) {
            queryString = queryString.split('#')[0];
            var arr = queryString.split('&');

            for (var i=0; i<arr.length; i++) {
                var a = arr[i].split('=');
                var paramNum = undefined;
                var paramName = a[0].replace(/\[\d*\]/, function(v) {
                    paramNum = v.slice(1,-1);
                    return '';
                });
                var paramValue = typeof(a[1])==='undefined' ? true : a[1];
                paramName = paramName.toLowerCase();
                paramValue = paramValue.toLowerCase();
                if (obj[paramName]) {
                    if (typeof obj[paramName] === 'string') {
                        obj[paramName] = [obj[paramName]];
                    }
                    if (typeof paramNum === 'undefined') {
                        obj[paramName].push(paramValue);
                    }
                    else {
                        obj[paramName][paramNum] = paramValue;
                    }
                }
                else {
                    obj[paramName] = paramValue;
                }
            }
        }
        return obj;
    }
}