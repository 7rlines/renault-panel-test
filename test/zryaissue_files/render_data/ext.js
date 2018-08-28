!function(e){function t(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var n={};t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r})},t.n=function(e){var n=e&&e.__esModule?function(){return e["default"]}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="https://yastatic.net/safeframe-bundles/",t(t.s=24)}([function(e,t,n){"use strict";function r(e,t,n){e.setAttribute(t,n)}function o(e,t){return e.getAttribute(t)}function i(e,t){e.style.cssText=t}function s(e,t){e.appendChild(t)}function a(e){var t=f(e);t&&t.removeChild(e)}function u(e,t,n,r){void 0===r&&(r=!1),e.addEventListener?e.addEventListener(t,n,r):e.attachEvent("on"+t,n)}function c(e,t,n){e.removeEventListener?e.removeEventListener(t,n,!1):e.detachEvent("on"+t,n)}function d(e){return e.contentWindow}function p(e){return window.getComputedStyle?window.getComputedStyle(e,null):e.currentStyle}function l(e){return e.getBoundingClientRect()}function f(e){return e&&(e.parentNode||e.parentElement)||null}function h(e){if(e){var t=!/\{[^\}]*}/g.test(e),n=void 0;t?(n=document.createElement("link"),n.type="text/css",n.rel="stylesheet",n.href=e):(n=document.createElement("style"),n.type="text/css",n.styleSheet?n.styleSheet.cssText=e:n.appendChild(document.createTextNode(e)));document.getElementsByTagName("head")[0].appendChild(n)}}t.__esModule=!0,t.setAttr=r,t.getAttr=o,t.setStyle=i,t.appendChild=s,t.removeFromDocument=a,t.addEventListener=u,t.removeEventListener=c,t.getIframeWindow=d,t.getCurrentStyle=p,t.getRect=l,t.parent=f,t.createStyleSheet=h},function(e,t,n){"use strict";function r(e){return e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,"")}function o(e,t){if(e)for(var n in e)e.hasOwnProperty(n)&&t(n,e[n])}function i(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];for(var n={},r=function(e,t){n[e]=t},i=0,s=e;i<s.length;i++){o(s[i],r)}return n}function s(e){return i(e)}function a(e){l++;var t=(new Date).getTime(),n=Math.round(100*Math.random());return[e||"","_",t,"_",n,"_",l].join("")}function u(e){var t=[];return o(e,function(e,n){var r="number"==typeof n?n+"px":n;t.push(e+":"+r)}),0===t.length?"":t.join(";")+";"}function c(e){return 0===e.length?"":p.reduce(e,function(e,t){return e.replace(/\/$/,"")+"/"+t.replace(/^\//,"")})}function d(){var e=navigator.plugins;if(e.length>0)for(var t=0;t<e.length;t++)if(-1!==e[t].name.toLowerCase().indexOf("flash")){var n=/\d+\.\d+/.exec(e[t].description);if(n)return parseFloat(n[0])}return 0}t.__esModule=!0;var p=n(11);t.trim=r,t.forEachProp=o,t.merge=i,t.shallowCopy=s;var l=0;t.guid=a,t.toCssString=u,t.concatPath=c,t.getFlashVersion=d},,function(e,t,n){"use strict";function r(e){window.console&&window.console.log&&window.console.log("[SafeFrame info] "+e)}function o(e){window.console&&window.console.error?window.console.error("[SafeFrame error] "+e):r("[SafeFrame error] "+e);var t=window;t.$sf&&t.$sf.info&&t.$sf.info.errs&&t.$sf.info.errs.push&&t.$sf.info.errs.push(e)}t.__esModule=!0,t.logInfo=r,t.logError=o},,,function(e,t,n){"use strict";function r(){return"complete"===document.readyState||"interactive"===document.readyState&&!document.documentElement.doScroll}function o(e){r()?setTimeout(e):a.push(e)}function i(){s.removeEventListener(document,"DOMContentLoaded",i),s.removeEventListener(window,"load",i);for(var e=0,t=a;e<t.length;e++){(0,t[e])()}a=[]}t.__esModule=!0;var s=n(0),a=[];t.onDocumentReady=o,r()||(s.addEventListener(document,"DOMContentLoaded",i),s.addEventListener(window,"load",i))},function(e,t,n){"use strict";function r(e){var t={};return i.forEachProp(e,function(e,n){var r=typeof n;"number"!==r&&"string"!==r&&"boolean"!==r||(t[e]=n)}),t}function o(e){return e&&e.sharedData&&"string"==typeof e.ownerKey&&e.privateData?new s(e.sharedData,e.ownerKey,e.privateData):null}t.__esModule=!0;var i=n(1);t.createPosMeta=o;var s=function(){function e(e,t,n){this.sharedData=r(e),this.ownerKey=t,this.privateData=r(n)}return e.prototype.value=function(e,t){return e in this.sharedData?this.sharedData[e]:t===this.ownerKey&&e in this.privateData?this.privateData[e]:void 0},e.prototype.getFullMeta=function(){return{sharedData:this.sharedData,ownerKey:this.ownerKey,privateData:this.privateData}},e}();t.PosMeta=s},,,function(e,t,n){"use strict";function r(e){return encodeURIComponent(JSON.stringify(e))}function o(e){try{var t=JSON.parse(decodeURIComponent(e));if(t.id&&t.html&&t.pmGuid)return t}catch(n){}return null}t.__esModule=!0,t.encode=r,t.decode=o},function(e,t,n){"use strict";t.__esModule=!0,t.reduce=function(e,t,n){var r=0;for(arguments.length<3&&(r=1,n=e[0]);r<e.length;r++)n=t(n,e[r],r,e);return n}},,,,,,,,,,,,,function(e,t,n){"use strict";t.__esModule=!0;var r=n(25),o=window;o.$sf=o.$sf||{},o.$sf.info={errs:[]},o.$sf.ext=r.ext,r.init()},function(e,t,n){"use strict";function r(){var e=O.decode(window.name);if(window.name="",!(e&&e.id&&e.pmGuid&&e.html))return null;var t=/[^_]*_(\d+)_\d+_\d+/.exec(e.pmGuid);if(!t||!t[1])return null;var n=Number(t[1]),r=(new Date).getTime()-n;return r<0||r>3e4?null:e}function o(e){var t=e.replace(/[^a-zA-Z0-9#(),]/g,"");return t?"body{background: "+t+"}":""}function i(){var e=r();if(null===e)return void E.logError("SafeFrame cannot establish communication with host. Render aborted.");w=new T.HostState({geom:e.geom,supports:e.supports,meta:_.createPosMeta(e.posMeta),hasFocus:e.hasFocus}),v=new D.OperationsStatus(function(e){return S.handleOperationTimeout(e)}),S=new F.MessagesDispatcher(w,v),y=new k.PostMessagesExt(e.pmGuid,function(e){return S.handleMessage(e)});var t=new b.ErrorHandler(y);window.onerror=function(e,n,r){return t.handleError(e,n,r)},C.createStyleSheet(e.css),C.createStyleSheet(o(e.bg)),L.addBaseTag({href:e.basePath,target:e.target}),M.write(window,document,e.html),x.onDocumentReady(function(){return L.updateLinks(e.target)})}function s(e,t,n){S.registerStatusChangeCallback(n)}function a(){return w.supports}function u(){return w.geom}function c(e){"collapsed"===v.getCurrentStatus()&&(v.startOperation("expand"),y.send({type:"expand-request",dim:e}))}function d(){"expanded"===v.getCurrentStatus()&&(v.startOperation("collapse"),y.send({type:"collapse-request"}))}function p(){return v.getCurrentStatus()}function l(e,t){return w.meta?w.meta.value(e,t):null}function f(){y.send({type:"nuke"})}function h(e,t){if(t){if(v.isRunning("write-cookie"))return;var n=t.expires&&t.expires.getTime();v.startOperation("write-cookie",[e,t.value]),y.send({type:"write-cookie-request",name:e,value:t.value,expires:n})}else{if(v.isRunning("read-cookie"))return;v.startOperation("read-cookie",e),y.send({type:"read-cookie-request",name:e})}}function g(){return 100*w.geom.self.iv}function m(){return w.hasFocus||document.hasFocus()}t.__esModule=!0;var y,v,w,S,C=n(0),E=n(3),O=n(10),x=n(6),_=n(7),M=n(26),b=n(27),T=n(28),F=n(29),D=n(30),k=n(31),L=n(32);t.grabNameParams=r,t.init=i,t.ext={register:s,supports:a,geom:u,expand:c,collapse:d,status:p,meta:l,nuke:f,cookie:h,inViewPercentage:g,winHasFocus:m}},function(e,t,n){"use strict";function r(e,t,n){var r=e.document,o=r.createElement("script"),i=r.querySelector("script")||r.body;o.src=t,o.onload=o.onreadystatechange=function(){this.readyState&&"complete"!==this.readyState&&"loaded"!==this.readyState||(o.onload=o.onreadystatechange=null,"function"==typeof n&&n())},i.parentNode.insertBefore(o,i)}function o(e,t,n){function o(){if(s.length){s.shift()(o)}}for(var i=[],s=[],a=/<script(.*?)>((.|\n)*?)<\/script>/g,u=/src=("|')(.*)("|')/,c=a.exec(n);c;){var d={text:c[2]},p=u.exec(c[1]);p&&p[2]&&(d.src=p[2]),i.push(d),c=a.exec(n)}for(var l=0;l<i.length;l++)!function(t){var n=i[t];if(n.src)s.push(function(t){r(e,n.src,t)});else{var o=e.document.createElement("script");o.type="text/javascript",o.text=n.text,s.push(function(t){e.document.body.appendChild(o),t()})}}(l);if(n=n.replace(/<script/g,'<script type="text/template"'),-1===n.indexOf("<body")){n='<!DOCTYPE html><html><head><meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/></head><body>'+n+"</body></html>"}t.write(n),t.close(),o()}function i(e,t){e.write(t),e.close()}function s(e,t,n){a?o(e,t,n):i(t,n)}t.__esModule=!0;var a=document.documentMode<10;t.write=s},function(e,t,n){"use strict";t.__esModule=!0;var r=function(){function e(e){this.postMessagesTransport=e,this.collectedErrors=[],this.reportErrorsTimeoutId=null}return e.prototype.report=function(){this.postMessagesTransport.send({type:"error",messages:this.collectedErrors}),this.collectedErrors=[],this.reportErrorsTimeoutId=null},e.prototype.handleError=function(e,t,n){var r=this;return this.collectedErrors.push("Error occurred inside SafeFrame:\nMessage: "+e+"\nURL: "+t+"\nLine: "+n),null===this.reportErrorsTimeoutId&&(this.reportErrorsTimeoutId=setTimeout(function(){return r.report()},1e3)),!0},e}();t.ErrorHandler=r},function(e,t,n){"use strict";t.__esModule=!0;var r=function(){function e(e){this.geom=e.geom,this.supports=e.supports,this.meta=e.meta,this.hasFocus=e.hasFocus}return e.prototype.updateGeom=function(e){this.geom=e},e.prototype.updateHasFocus=function(e){this.hasFocus=e},e}();t.HostState=r},function(e,t,n){"use strict";t.__esModule=!0;var r=function(){function e(e,t){this.hostState=e,this.operationsStatus=t,this.statusChangeCb=function(){}}return e.prototype.registerStatusChangeCallback=function(e){this.statusChangeCb=e||function(){}},e.prototype.handleMessage=function(e){if("error"===e.type&&(this.operationsStatus.stopAnyOperationByType(e.causedByMethod),this.statusChangeCb("failed",{cmd:e.causedByMethod,reason:e.message})),"geom-updated"===e.type&&(this.hostState.updateGeom(e.geom),this.statusChangeCb("geom-update",{})),"focus-updated"===e.type&&(this.hostState.updateHasFocus(e.hasFocus),this.statusChangeCb("focus-change",{info:e.hasFocus})),"collapsed"===e.type){var t=this.operationsStatus.stopOperation("collapse");t&&(this.operationsStatus.stopOperation("in-expand",null),this.statusChangeCb("collapsed",{}))}if("expanded"===e.type){var t=this.operationsStatus.stopOperation("expand");t&&(this.operationsStatus.startOperation("in-expand",null,Infinity),this.statusChangeCb("expanded",{}))}if("cookie-read"===e.type){var t=this.operationsStatus.stopOperation("read-cookie",e.name);t&&this.statusChangeCb("read-cookie",{info:e.value})}if("cookie-written"===e.type){var t=this.operationsStatus.stopOperation("write-cookie",[e.name,e.value]);t&&this.statusChangeCb("write-cookie",{info:e.value})}},e.prototype.handleOperationTimeout=function(e){this.handleMessage({type:"error",causedByMethod:e,message:"Timeout"})},e}();t.MessagesDispatcher=r},function(e,t,n){"use strict";t.__esModule=!0;var r=function(){function e(e){this.pendingOperations={},this.onTimeout=e}return e.prototype.startOperation=function(e,t,n){var r=this;if(void 0===n&&(n=1e3),this.pendingOperations[e])throw new Error("already running operation "+e);var o=n===Infinity?-1:setTimeout(function(){r.onTimeout(e),r.stopOperation(e,t)},n);this.pendingOperations[e]={signature:JSON.stringify(t),timeoutId:o}},e.prototype.stopOperation=function(e,t){return!(!this.pendingOperations[e]||this.pendingOperations[e].signature!==JSON.stringify(t))&&(this.stopAnyOperationByType(e),!0)},e.prototype.stopAnyOperationByType=function(e){this.pendingOperations[e]&&(-1!==this.pendingOperations[e].timeoutId&&clearTimeout(this.pendingOperations[e].timeoutId),delete this.pendingOperations[e])},e.prototype.isRunning=function(e){return Boolean(this.pendingOperations[e])},e.prototype.getCurrentStatus=function(){return this.pendingOperations.expand?"expanding":this.pendingOperations.collapse?"collapsing":this.pendingOperations["in-expand"]?"expanded":"collapsed"},e}();t.OperationsStatus=r},function(e,t,n){"use strict";t.__esModule=!0;var r=n(0),o=function(){function e(e,t){var n=this;this.guid=e,this.callback=t,this.handler=function(e){n.handle(e)},r.addEventListener(window,"message",this.handler)}return e.prototype.destroy=function(){r.removeEventListener(window,"message",this.handler)},e.prototype.send=function(e){var t;try{t=JSON.stringify({guid:this.guid,payload:e})}catch(n){}t&&window.parent.postMessage(t,"*")},e.prototype.handle=function(e){var t;try{t=JSON.parse(e.data)}catch(n){}t&&t.guid&&this.callback(t.payload)},e}();t.PostMessagesExt=o},function(e,t,n){"use strict";function r(e){var t=e.target,n=e.href,r=document.createElement("base");t&&a.setAttr(r,"target",t),n&&a.setAttr(r,"href",n),i.prependChild(s.getHead(window),r)}function o(e){for(var t=document.getElementsByTagName("a"),n=0;n<t.length;n++)a.setAttr(t[n],"target",e)}t.__esModule=!0;var i=n(33),s=n(34),a=n(0);t.addBaseTag=r,t.updateLinks=o},function(e,t,n){"use strict";function r(e,t){e.firstChild?e.insertBefore(t,e.firstChild):e.appendChild(t)}t.__esModule=!0,t.prependChild=r},function(e,t,n){"use strict";function r(e){var t=e.document,n=t.getElementsByTagName("head")[0];return n||(n=t.createElement("head"),t.documentElement.appendChild(n)),n}t.__esModule=!0,t.getHead=r}]);