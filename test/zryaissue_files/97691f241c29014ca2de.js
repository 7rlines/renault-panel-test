pcodeJsonp4073([6],{631:function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{"default":e}}function r(e){this._queue=e}var i=n(165),s=n(146),l=n(169),c=o(l),u=n(170),a=n(59),d=n(625),p=n(632),f=n(635),h=n(628),_=n(264),m=n(224);r.prototype={_blocks:{},render:function(e,t){var n=a.protect("Internal._loadData",function(n){this._render(e,t,n)},this);Ya.Context._asyncModeOn&&!(0,u.isLongExperiment)(c["default"].ssSkipToken.ENABLED)?this._loadByQueue(e,n):this._loadData(e,n),h.hitOnce(e.pageId,e.bundle)},_loadData:function(e,t){var n=(0,i.getAdUsageStorage)(e);d.loadDirect({testtag:m.getDirect({adfoxexp:e.adfoxexp,adUsageStorageId:n.id,ssSkipTokenLength:n.ssSkipTokenLength}),pageId:e.pageId,grab:e.grab,lang:e.lang,geo:e.geo},function(n){(0,s.saveGloballyIsSSP)(e.bundle,n),t(n)})},_loadByQueue:function(e,t){var n=this;this._queue.add(function(o){var r=function(e){t(e),o()};n._loadData(e,r)})},_render:function(e,t,n){return this._blocks[e.renderTo]&&(this._blocks[e.renderTo].destructor(),this._blocks[e.renderTo]=null),n&&n[e.internalType]?(this._blocks[e.renderTo]=this._createBlock(e,n),void(this._blocks[e.renderTo]&&(this._blocks[e.renderTo].render(),"function"==typeof e.onRender&&e.onRender({product:e.product,blockType:e.internalType})))):void(t||_)()},_createBlock:function(e,t){var n=new f({data:t,type:e.internalType,allowRepeatAds:e.allowRepeatAds,clickMacro:e.clickMacro});return new p(n,e.renderTo,e.blockId,e.internalType,e.cspNonce)}},e.exports=r},632:function(e,t,n){"use strict";var o=n(247),r=n(54),i=n(586),s=n(481),l=s(n(258)),c=s(n(633)),u=n(47),a=n(16);e.exports=r.augment(i,{template:n(634).internal,advs:[],constructor:function(e,t,n,o,i){this.blockId=n,this.renderTo=r.dom.querySelector("#"+t),this._mainContId="yap-"+this.blockId,this.dataSource=e,this._type=o,this._nonce=i},render:function(e){if(this.renderTo){var t=this.dataSource,n=t.getLanguage(),r=(0,o.getLangCode)(n);this.insertCSS(this._getCss());var i=this.template({id:this._mainContId,lang:r,type:this._type,html:t.getHtml()});u.innerHTML(this.renderTo,i),this._runScripts(),t.onConfirmVisibility(),a(e)&&e()}},_runScripts:function(){var e=r.dom.querySelector("script",this.renderTo);r.each(e,function(e){var t=e.parentNode,n=document.createElement("script");n.text=e.text,this._nonce&&n.setAttribute("nonce",this._nonce),t.removeChild(e),t.appendChild(n)},this)},_getCss:function(){var e={id:this._mainContId};return l(e)+c(e)}})},633:function(module,exports){module.exports=function(obj){var p=[];with(obj)p.push(".",id," .yap-internal{overflow:hidden !important}");return p.join("")}},634:function(module,exports,__webpack_require__){var util=__webpack_require__(54),Const=__webpack_require__(74),env=__webpack_require__(59),getString=__webpack_require__(117)["default"],templates={internal:function(obj){var p=[];with(obj)p.push('<yatag class="',id,' yap-reset" id="',id,'" lang="',lang,'"><yatag class="yap-internal yap-internal_type_',type,'">',html,"</yatag></yatag>");return p.join("")}};module.exports=templates},635:function(e,t,n){"use strict";var o=n(165),r=n(54),i=n(99),s=n(233),l=n(74),c=n(205),u=n(224);e.exports=r.augment(c,{constructor:function(e){this._data=e.data,this._type=e.type,this._banner=this._data[this._type],this._adUsageStorage=(0,o.getAdUsageStorage)(e)},getHtml:function(){return this._banner.html},onConfirmVisibility:function(){var e=new i({host:this.getLinkHead()+this._banner.linkTail,params:{"test-tag":u.getDirect({format:s.getFormatByName(l.BlockTypes.INTERNAL).index,adUsageStorageId:this._adUsageStorage.id}),wmode:0}});(new Image).src=e.getUrl()}})},637:function(e,t,n){"use strict";function o(){this._reset()}var r=n(54),i=n(99),s=["https://yasta","tic.net/awaps-ad-sdk-","js/1_0/inpage.js"].join(""),l=["https://betas","tatic.yastat","ic.net/awaps-ad-sdk-","js/1_0/inpage.js"].join("");o.prototype={render:function(e,t,n){var o=this._prepareConfig(e,t,n);this._isReady?this._render(o):(this._loader||(this._isBeta=t.beta,this._init()),this._queue.push(o))},_prepareConfig:function(e,t,n){return t.partnerId=e.partnerId,t.category=e.category,{renderTo:e.renderTo,userProps:t,callback:n}},_reset:function(){this._queue=[],this._onLoadDescriptor=null,this._onErrorDescriptor=null},_init:function(){this._loader=r.dom.addScript(this._getLoaderUrl()),this._onLoadDescriptor=r.domEvent.on(this._loader,"load",this._renderQueue,this,{once:!0}),this._onErrorDescriptor=r.domEvent.on(this._loader,"error",this._reportError,this,{once:!0})},_getLoaderUrl:function(){var e=new i({host:this._isBeta?l:s});return e.getUrl()},_renderQueue:function(){this._isReady=!0,r.each(this._queue,this._render,this),this._onErrorDescriptor.un(),this._reset()},_render:function(e){window.ya.mediaAd.inPage.addInPageVideo(e.renderTo,e.userProps,e.callback)},_reportError:function(e){r.each(this._queue,function(t){"function"==typeof t.callback&&t.callback(e)},this),this._onLoadDescriptor.un(),this._reset(),this._removeLoader()},_removeLoader:function(){r.dom.remove(this._loader),delete this._loader}},e.exports=o},639:function(e,t,n){"use strict";function o(){}var r=n(59),i=n(625),s=n(640),l=n(224);o.prototype={render:function c(e,t,n){if(this._fullscreen)n(new Error("Second fullscreen on page denied"));else{var c=r.protect("Fullscreen.render",function(e){var o=this,r=this._prepareConfig(e);r?this._fullscreen=new s(r,t,function(e){n(new Error(e)),o._fullscreen=null}):n(new Error("Fullscreen config is invalid"))},this);this._loadData(e,t,c)}},_loadData:function(e,t,n){return t.data?void n(t.data):void i.loadRtb({pageId:e.pageId,testtag:l.getRtb({adfoxexp:e.adfoxexp}),blockImpId:e.blockImpId,availableWidth:Math.round(document.body.clientWidth),lang:e.lang,geo:e.geo,refresh:!1},n)},_prepareConfig:function(e){return!(!e.rtb||!e.rtb.vastBase64)&&{vastBase64:e.rtb.vastBase64}}},e.exports=o},640:function(e,t,n){"use strict";var o=n(1),r=n(641),i=r.Store,s=n(642),l=n(117)["default"],c=n(13);e.exports=function(e,t,n){var r=i.getById("banner.fullscreen"),u=c({store:r,hasMoreButton:!0,moreButtonText:l("MORE",1),advText:l("ADVERTISMENT",1)},e);r.on("error",function(e){return n(e)}),r.on("destroy",function(){a.destroy()}),r.on("videoEnd",function(){e.onVideoEnd&&e.onVideoEnd(),t.onVideoEnd&&t.onVideoEnd(),a.destroy()}),r.on("videoStart",function(){e.onVideoStart&&e.onVideoStart(),t.onVideoStart&&t.onVideoStart()});var a=new s(u),d=o.render(a);document.body.appendChild(d)}},641:function(e,t){"use strict";var n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};t.__esModule=!0;var o=function(){function e(){this.values={},this.events={}}return e.getById=function(t){return t?e.stores[t]||(e.stores[t]=new e):e.getDefaultStore()},e.getDefaultStore=function(){return e.stores[e.DEFAULT_STORE_ID]||(e.stores[e.DEFAULT_STORE_ID]=new e),e.stores[e.DEFAULT_STORE_ID]},e.prototype.getValue=function(e){return this.values[e]},e.prototype.setValue=function(e,t){return this.values[e]=t,t},e.prototype.on=function(e,t){if("object"===("undefined"==typeof e?"undefined":n(e)))for(var o in e){var r=e[o];"function"==typeof r&&this.bind(o,r)}else"function"==typeof t&&this.bind(e,t)},e.prototype.bind=function(e,t){var n=this,o=e.split(" ").filter(function(e){return e});o.forEach(function(e){n.events[e]=n.events[e]||[],n.events[e].indexOf(t)===-1&&n.events[e].push(t)})},e.prototype.off=function(e,t){var n=this.events[e]||[],o=[],r=n.length;if("string"==typeof e)if("function"==typeof t){for(var i=0;i<r;i++)n[i]!==t&&o.push(n[i]);this.events[e]=o}else this.events[e]=[]},e.prototype.trigger=function(e){for(var t=[],n=1;n<arguments.length;n++)t[n-1]=arguments[n];var o=this.events[e]||[],r=o.length;if(o&&o.length)for(var i=0;i<r;i++){var s=o[i];s.apply(null,t)}},e.DEFAULT_STORE_ID="default",e.stores={},e}();t.Store=o},642:function(e,t,n){"use strict";var o=n(1),r=n(643),i=n(661),s=o.createComponent({beforeRender:function(){var e=this.props.store;e.on("videoStart",function(t){var n=parseInt(t);n>0?e.trigger("startTimer",1e3*n):e.trigger("hideTimer")}),e.on("adPlayStateChanged",function(t){return e.trigger(t?"resumeTimer":"pauseTimer")}),e.on("videoEnd",function(){return e.trigger("finishTimer")})},render:function(){var e=this.props;return e.isMuteButtonVisible="boolean"!=typeof e.isMuteButtonVisible||e.isMuteButtonVisible,e.reference="",o.create(r,e,o.create(i,e))}});e.exports=s},643:function(e,t,n){"use strict";var o=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e},r=n(1),i=n(644),s=n(656),l=n(659),c=n(44),u=n(651),a={additionalClass:"",advText:"",hasMoreButton:!0,isMuteButtonVisible:!1,isMutedAtStart:!1,isTimerVisible:!0,moreButtonText:"",moreButtonStyle:"",closeButtonImageUrl:"",muteButtonImageUrl:"",unMuteButtonImageUrl:"",timerColor:"#fff",time:0,timeCloseButtonVisible:5,reference:"",zIndex:999999},d=r.createComponent({onInit:function(){window.Ya||(window.Ya={}),window.Ya.isFullscreenStarted?this.props.store.trigger("error","Second fullscreen on page denied"):window.Ya.isFullscreenStarted=!0},beforeRender:function(){this.props=o({},a,this.props),this._initRenderEvents()},afterRender:function(){this._inner=this.getResourceById("inner"),this._wrapper=this.getResourceById("wrapper"),this._curtain=this.getResourceById("curtain"),this._wrapper.getElement().style.zIndex=this.props.zIndex,this._initResize()},render:function(){var e=this.props,t=e.advText,n=e.hasMoreButton,o=e.isMuteButtonVisible,c=e.isTimerVisible,u=e.moreButtonText,a=e.timeCloseButtonVisible,d=a!==-1;return r.create("div",{"class":this._getStylesForContainer(),resourceId:"wrapper"},c||d||o||t?r.create(i,this.props):null,r.create("div",{resourceId:"curtain","class":l.fullscreen__curtain}),n&&u?r.create(s,this.props):null,r.create("div",{"class":l["fullscreen-container"]},r.create("div",{"class":l["fullscreen-container__inner"],resourceId:"inner"},this.__children)))},onDestroy:function(){c.un(this._resizeDescriptor)},_initResize:function(){this._resizeDescriptor=c.on(window,"resize",this._setSize,this,{passive:!0})},_setVisible:function(){this._wrapper.addClass(l.fullscreen_visible)},_updateCurtainVisibility:function(e){this._curtain.getElement().style.display=e?"block":"none"},_onResize:function(e){"undefined"!=typeof e&&"undefined"!=typeof e.width&&"undefined"!=typeof e.height&&(this.props.bannerWidth=e.width+"px",this.props.bannerHeight=e.height+"px"),this._setSize()},_initRenderEvents:function(){var e=this,t=this.props.store;t.on("render",function(t){e._onResize(t),e._setVisible()}),t.on("resize",function(t){e._onResize(t)}),t.on("adPlayStateChanged",function(t,n){var o=e.props,r=o.hasMoreButton,i=o.moreButtonText;e._updateCurtainVisibility(t&&n&&r&&i)})},_getStylesForContainer:function(){var e=this.props.additionalClass;return u(l.fullscreen,e)},_setSize:function(){var e=this.props,t=e.bannerWidth,n=e.bannerHeight,o=this._inner.getElement(),r=o.style;r.width=t,r.height=n}});e.exports=d},644:function(e,t,n){"use strict";var o=n(1),r=n(645),i=n(654),s=n(651),l=o.createComponent({beforeRender:function(){this._initRenderEvents()},afterRender:function(){this._muted=this.props.isMutedAtStart,this._close=this.getResourceById("close"),this._counter=this.getResourceById("counter"),this._mute=this.getResourceById("mute")},render:function(){var e=this.props,t=e.advText,n=e.isMuteButtonVisible,s=e.isMutedAtStart,l=e.isTimerVisible,c=e.timeCloseButtonVisible,u=e.store,a=e.timerColor,d=c!==-1;return o.create("div",{"class":this._getStylesForHeader()},n?o.create("div",{"class":this._getClassesForMuteButton(),style:this._getStyleForMuteButton(s),resourceId:"mute",onClick:this._onClickOnMute}):null,d?o.create("div",{"class":this.getClassesForCloseButton(),style:this.getStyleForCloseButton(),resourceId:"close",onClick:this._onClickOnClose}):null,l?o.create("div",{"class":i["fullscreen-header__counter"],resourceId:"counter"},o.create(r,{size:"30",store:u,color:a})):null,t?o.create("div",{"class":this._getStylesForAdvText()},t):null)},_onClickOnClose:function(){this.props.store.trigger("destroy")},_onClickOnMute:function(){var e=i["fullscreen-header__mute_muted"];this._muted=!this._muted,this._mute.toggleClass(e,this._muted);var t=this._getImageForMuteButton(this._muted);t&&this._mute.setStyle("background-image","url('"+t+"')"),this.props.store.trigger("clickOnMute",this._muted)},_updateMuteVisibility:function(e){this._mute.getElement().style.display=e?"block":"none"},_initRenderEvents:function(){var e=this,t=this.props.store;t.on("adPlayStateChanged",function(t,n){e._updateMuteVisibility(n)}),t.on("hideTimer",function(){return e._hideCounter()}),t.on("progressUpdate",function(t){t>e.props.timeCloseButtonVisible&&e._showCloseButton()}),t.on("showCloseButton",function(){return e._showCloseButton()})},_showCloseButton:function(){this._close&&this._close.removeClass(i["fullscreen-header__close_invisible"])},_getClassesForMuteButton:function(){var e=[i["fullscreen-header__mute"]];return this.props.isMutedAtStart>0&&e.push(i["fullscreen-header__mute_muted"]),s(e)},_getStyleForMuteButton:function(e){var t=this._getImageForMuteButton(e);return t?"background-image: url('"+t+"');":""},_getImageForMuteButton:function(e){var t=this.props,n=t.muteButtonImageUrl,o=t.unMuteButtonImageUrl;return n&&o?e?o:n:""},_getStylesForHeader:function(){var e=this.props.additionalClass,t=[i["fullscreen-header"]];return e&&t.push(e+"-header"),s(t)},_getStylesForAdvText:function(){var e=this.props.additionalClass,t=[i["fullscreen-header__adv-text"]];return e&&t.push(e+"-header__adv-text"),s(t)},getClassesForCloseButton:function(){var e=this.props,t=e.additionalClass,n=e.timeCloseButtonVisible,o=[i["fullscreen-header__close"]];return n>0&&o.push(i["fullscreen-header__close_invisible"]),t&&o.push(t+"-header__close"),s(o)},getStyleForCloseButton:function(){var e=this.props.closeButtonImageUrl;return e?"background-image: url('"+e+"');":""},_hideCounter:function(){this._counter.getElement().style.display="none"}});e.exports=l},645:function(e,t,n){"use strict";var o=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e},r=n(1),i=n(646),s=n(107),l=s.requestAnimationFrame,c=n(652),u={color:"#fff",maxValue:10,size:50,direction:-1,startProgress:1},a=r.createComponent({beforeRender:function(){this.props=o({},u,this.props),this._initTimerStartEvent()},render:function(){return r.create("div",{"class":c["fullscreen-timer"]},r.create(i,o({},this.props,{resourceId:"adCountdown",noTransition:!0})))},afterRender:function(){this._adCountdown=this.getResourceById("adCountdown"),this._isRendered=!0,this._isTimerStarted&&this._startTimer()},_initTimerStartEvent:function(){var e=this,t=this.props.store;t.on("startTimer",function(t){return e._onTimerStartEvent(t)}),t.on("pauseTimer",function(){return e._onTimerPauseEvent()}),t.on("resumeTimer",function(){return e._onTimerResumeEvent()})},_onTimerStartEvent:function(e){this._time=e,this._isRendered?this._startTimer():this._isTimerStarted=!0},_onTimerPauseEvent:function(){this._isTimerActive=!1},_onTimerResumeEvent:function(){this._isRendered&&(this._lastDate=new Date,this._isTimerActive=!0,this._startAnimation())},_startTimer:function(){this._isTimerActive=!0,this._progress=0,this._lastDate=new Date,this._startAnimation()},_startAnimation:function(){var e=this,t=function n(){e._computeTime(),e._isTimerActive&&l(n)};l(t)},_computeTime:function(){var e=new Date;this._progress+=e.getTime()-this._lastDate.getTime(),this._lastDate=e,this._progress>this._time&&(this._isTimerActive=!1),this._adCountdown.progress(Math.max(1-this._progress/this._time,0)),this._adCountdown.setMaxValue(this._time/1e3)}});e.exports=a},646:function(e,t,n){"use strict";var o=n(1),r=n(647),i=n(651),s=99,l=30,c="#000",u=30,a=2,d=o.createComponent({beforeRender:function(){var e=this.props,t=e.maxValue,n=e.direction,o=void 0===n?1:n,r=e.startProgress,i=void 0===r?0:r;this._hasCount=!1,isNaN(t)?this._maxValue=l:(this._maxValue=t,this._hasCount=!0),this._current=i,this._direction=o},setMaxValue:function(e){this._maxValue=e},_getCountElem:function(){if(this._countElem)return this._countElem;var e=this.getResourceById("count");return e?(this._countElem=e.getElement(),this._countElem):null},_getCircleElem:function(){if(this._circleElem)return this._circleElem;var e=this.getResourceById("circle");return e?(this._circleElem=e.getElement(),this._circleElem):null},_updateCount:function(){var e=Math.ceil(this._current*this._maxValue),t=this._getCountElem();t&&(t.textContent=Math.min(e,s))},progress:function(e){this._current=e,this._setCircleAttributes(),this._hasCount&&this._updateCount()},_setCircleAttributes:function(){var e=this._getCircleElem();e&&e.setAttribute("stroke-dashoffset",this._strokeDashOffset*this._direction*(1+this._current))},_getStylesForContainer:function(){var e=this.props.additionalClass;return i(r["ad-countdown"],e)},_getStylesForCircle:function(){var e=[];return this.props.noTransition||e.push(r["ad-countdown__circle-transition"]),i(e)},render:function(){var e=this.props,t=e.size,n=void 0===t?u:t,i=e.label,s=void 0===i?"":i,l=e.color,d=void 0===l?c:l,p=e.strokeWidth,f=void 0===p?a:p,h=n-2*f,_=Math.PI*h;return this._strokeDashOffset=-_,o.create("div",{"class":this._getStylesForContainer(),style:"color:"+d+";"},o.create("div",{"class":r["ad-countdown__circle-container"],style:"width:"+n+"px; height:"+n+"px;"},o.create("svg",{viewBox:"0 0 "+n+" "+n,version:"1.1"},o.create("circle",{"class":this._getStylesForCircle(),fill:"transparent","stroke-dasharray":_,"stroke-dashoffset":this._strokeDashOffset,"stroke-width":f,stroke:d,transform:"rotate(-90)",cx:-n/2,cy:n/2,r:h/2,resourceId:"circle"})),this._hasCount?o.create("div",{"class":r["ad-countdown__count"],resourceId:"count"}):null),s?o.create("div",{"class":r["ad-countdown__label"]},s):null)}});e.exports=d},647:function(e,t,n){var o=n(648);"string"==typeof o&&(o=[[e.id,o,""]]);n(650)(o,{singleton:!0});o.locals&&(e.exports=o.locals)},648:function(e,t,n){t=e.exports=n(649)(),t.push([e.id,".node_modules-common-pcode-components-ad-countdown-ad-countdown---ad-countdown{position:relative;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-direction:row;-ms-flex-direction:row;flex-direction:row;-webkit-align-items:center;-ms-flex-align:center;align-items:center}.node_modules-common-pcode-components-ad-countdown-ad-countdown---ad-countdown__count{position:absolute;width:100%;top:50%;text-align:center;-webkit-transform:translateY(-50%);transform:translateY(-50%)}.node_modules-common-pcode-components-ad-countdown-ad-countdown---ad-countdown__label{margin-left:7px}.node_modules-common-pcode-components-ad-countdown-ad-countdown---ad-countdown__circle-container{position:relative}.node_modules-common-pcode-components-ad-countdown-ad-countdown---ad-countdown__circle-transition{transition:stroke-dashoffset .1s linear}",""]),t.locals={"ad-countdown":"node_modules-common-pcode-components-ad-countdown-ad-countdown---ad-countdown","ad-countdown__count":"node_modules-common-pcode-components-ad-countdown-ad-countdown---ad-countdown__count","ad-countdown__label":"node_modules-common-pcode-components-ad-countdown-ad-countdown---ad-countdown__label","ad-countdown__circle-container":"node_modules-common-pcode-components-ad-countdown-ad-countdown---ad-countdown__circle-container","ad-countdown__circle-transition":"node_modules-common-pcode-components-ad-countdown-ad-countdown---ad-countdown__circle-transition"}},649:function(e,t){e.exports=function(){var e=[];return e.toString=function(){for(var e=[],t=0;t<this.length;t++){var n=this[t];n[2]?e.push("@media "+n[2]+"{"+n[1]+"}"):e.push(n[1])}return e.join("")},e.i=function(t,n){"string"==typeof t&&(t=[[null,t,""]]);for(var o={},r=0;r<this.length;r++){var i=this[r][0];"number"==typeof i&&(o[i]=!0)}for(r=0;r<t.length;r++){var s=t[r];"number"==typeof s[0]&&o[s[0]]||(n&&!s[2]?s[2]=n:n&&(s[2]="("+s[2]+") and ("+n+")"),e.push(s))}},e}},650:function(e,t,n){function o(e,t){for(var n=0;n<e.length;n++){var o=e[n],r=f[o.id];if(r){r.refs++;for(var i=0;i<r.parts.length;i++)r.parts[i](o.parts[i]);for(;i<o.parts.length;i++)r.parts.push(u(o.parts[i],t))}else{for(var s=[],i=0;i<o.parts.length;i++)s.push(u(o.parts[i],t));f[o.id]={id:o.id,refs:1,parts:s}}}}function r(e){for(var t=[],n={},o=0;o<e.length;o++){var r=e[o],i=r[0],s=r[1],l=r[2],c=r[3],u={css:s,media:l,sourceMap:c};n[i]?n[i].parts.push(u):t.push(n[i]={id:i,parts:[u]})}return t}function i(e,t){var n=m(),o=y[y.length-1];if("top"===e.insertAt)o?o.nextSibling?n.insertBefore(t,o.nextSibling):n.appendChild(t):n.insertBefore(t,n.firstChild),y.push(t);else{if("bottom"!==e.insertAt)throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");n.appendChild(t)}}function s(e){e.parentNode.removeChild(e);var t=y.indexOf(e);t>=0&&y.splice(t,1)}function l(e){var t=document.createElement("style");return t.type="text/css",i(e,t),t}function c(e){var t=document.createElement("link");return t.rel="stylesheet",i(e,t),t}function u(e,t){var n,o,r;if(t.singleton){var i=v++;n=g||(g=l(t)),o=a.bind(null,n,i,!1),r=a.bind(null,n,i,!0)}else e.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(n=c(t),o=p.bind(null,n),r=function(){s(n),n.href&&URL.revokeObjectURL(n.href)}):(n=l(t),o=d.bind(null,n),r=function(){s(n)});return o(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;o(e=t)}else r()}}function a(e,t,n,o){var r=n?"":o.css;if(e.styleSheet)e.styleSheet.cssText=b(t,r);else{var i=document.createTextNode(r),s=e.childNodes;s[t]&&e.removeChild(s[t]),s.length?e.insertBefore(i,s[t]):e.appendChild(i)}}function d(e,t){var n=t.css,o=t.media;if(o&&e.setAttribute("media",o),e.styleSheet)e.styleSheet.cssText=n;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(n))}}function p(e,t){var n=t.css,o=t.sourceMap;o&&(n+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(o))))+" */");var r=new Blob([n],{type:"text/css"}),i=e.href;e.href=URL.createObjectURL(r),i&&URL.revokeObjectURL(i)}var f={},h=function(e){var t;return function(){return"undefined"==typeof t&&(t=e.apply(this,arguments)),t}},_=h(function(){return/msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase())}),m=h(function(){return document.head||document.getElementsByTagName("head")[0]}),g=null,v=0,y=[];e.exports=function(e,t){t=t||{},"undefined"==typeof t.singleton&&(t.singleton=_()),"undefined"==typeof t.insertAt&&(t.insertAt="bottom");var n=r(e);return o(n,t),function(e){for(var i=[],s=0;s<n.length;s++){var l=n[s],c=f[l.id];c.refs--,i.push(c)}if(e){var u=r(e);o(u,t)}for(var s=0;s<i.length;s++){var c=i[s];if(0===c.refs){for(var a=0;a<c.parts.length;a++)c.parts[a]();delete f[c.id]}}}};var b=function(){var e=[];return function(t,n){return e[t]=n,e.filter(Boolean).join("\n")}}()},651:function(e,t,n){var o,r;!function(){"use strict";function n(){for(var e=[],t=0;t<arguments.length;t++){var o=arguments[t];if(o){var r=typeof o;if("string"===r||"number"===r)e.push(o);else if(Array.isArray(o))e.push(n.apply(null,o));else if("object"===r)for(var s in o)i.call(o,s)&&o[s]&&e.push(s)}}return e.join(" ")}var i={}.hasOwnProperty;"undefined"!=typeof e&&e.exports?e.exports=n:(o=[],r=function(){return n}.apply(t,o),!(void 0!==r&&(e.exports=r)))}()},652:function(e,t,n){var o=n(653);"string"==typeof o&&(o=[[e.id,o,""]]);n(650)(o,{singleton:!0});o.locals&&(e.exports=o.locals)},653:function(e,t,n){t=e.exports=n(649)(),t.push([e.id,".node_modules-common-pcode-components-fullscreen-timer---fullscreen-timer{position:relative;height:100%;width:100%}.node_modules-common-pcode-components-fullscreen-timer---fullscreen-timer__canvas,.node_modules-common-pcode-components-fullscreen-timer---fullscreen-timer__number{position:absolute;top:0;left:0;width:100%;height:100%}",""]),t.locals={"fullscreen-timer":"node_modules-common-pcode-components-fullscreen-timer---fullscreen-timer","fullscreen-timer__canvas":"node_modules-common-pcode-components-fullscreen-timer---fullscreen-timer__canvas","fullscreen-timer__number":"node_modules-common-pcode-components-fullscreen-timer---fullscreen-timer__number"}},654:function(e,t,n){var o=n(655);"string"==typeof o&&(o=[[e.id,o,""]]);n(650)(o,{singleton:!0});o.locals&&(e.exports=o.locals)},655:function(e,t,n){t=e.exports=n(649)(),t.push([e.id,".node_modules-common-pcode-components-fullscreen-fullscreenHeader---fullscreen-header{z-index:4;font-weight:300;left:0;width:100%;line-height:50px;background-image:linear-gradient(-180deg,rgba(0,0,0,.4),transparent);color:#fff;font-size:12px;font-family:sans-serif}.node_modules-common-pcode-components-fullscreen-fullscreenHeader---fullscreen-header,.node_modules-common-pcode-components-fullscreen-fullscreenHeader---fullscreen-header__close{position:absolute;top:0;height:50px;text-align:center}.node_modules-common-pcode-components-fullscreen-fullscreenHeader---fullscreen-header__close{right:0;cursor:pointer;width:50px;background:url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle opacity='.2' cx='20' cy='20' r='13.5'/%3E%3Cpath fill='%23fff' d='M27 13.7l-.7-.7-6.3 6.3-6.3-6.3-.7.7 6.3 6.3-6.3 6.3.7.7 6.3-6.3 6.3 6.3.7-.7-6.3-6.3z'/%3E%3C/svg%3E\") no-repeat 50%}.node_modules-common-pcode-components-fullscreen-fullscreenHeader---fullscreen-header__close_invisible{display:none}.node_modules-common-pcode-components-fullscreen-fullscreenHeader---fullscreen-header__mute{position:absolute;left:0;top:0;cursor:pointer;text-align:center;height:50px;width:50px;background:url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='13.5' opacity='.2'/%3E%3Cpath d='M24 16.4c1.4.6 2.4 2 2.4 3.5 0 1.6-1 2.9-2.4 3.5v-1.8c.5-.4.8-1 .8-1.7 0-.6-.3-1.2-.8-1.7v-1.8zm-10 1.1h3l5-4v13l-5-4h-3v-5z' fill='%23FFF'/%3E%3C/svg%3E\") no-repeat 50%;z-index:2;display:none}.node_modules-common-pcode-components-fullscreen-fullscreenHeader---fullscreen-header__mute_muted{background:url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='13.5' opacity='.2'/%3E%3Cpath d='M26.7 20.4l2.3-2.3-1.1-1.1-2.3 2.3-2.3-2.3-1.2 1.1 2.3 2.3-2.3 2.3 1.2 1.2 2.3-2.3 2.3 2.3 1.1-1.2-2.3-2.3zM13 17.5h3l5-4v13l-5-4h-3v-5z' fill='%23FFF'/%3E%3C/svg%3E\") no-repeat 50%}.node_modules-common-pcode-components-fullscreen-fullscreenHeader---fullscreen-header__counter{height:30px;width:30px;display:inline-block;vertical-align:middle}.node_modules-common-pcode-components-fullscreen-fullscreenHeader---fullscreen-header__adv-text{margin-left:5px;display:inline-block;vertical-align:middle}",""]),t.locals={"fullscreen-header":"node_modules-common-pcode-components-fullscreen-fullscreenHeader---fullscreen-header","fullscreen-header__close":"node_modules-common-pcode-components-fullscreen-fullscreenHeader---fullscreen-header__close","fullscreen-header__close_invisible":"node_modules-common-pcode-components-fullscreen-fullscreenHeader---fullscreen-header__close_invisible","fullscreen-header__mute":"node_modules-common-pcode-components-fullscreen-fullscreenHeader---fullscreen-header__mute","fullscreen-header__mute_muted":"node_modules-common-pcode-components-fullscreen-fullscreenHeader---fullscreen-header__mute_muted","fullscreen-header__counter":"node_modules-common-pcode-components-fullscreen-fullscreenHeader---fullscreen-header__counter","fullscreen-header__adv-text":"node_modules-common-pcode-components-fullscreen-fullscreenHeader---fullscreen-header__adv-text"}},656:function(e,t,n){"use strict";var o=n(1),r=n(657),i=n(651),s=o.createComponent({beforeRender:function(){this._initRenderEvents()},afterRender:function(){this._moreButton=this.getResourceById("moreButton")},render:function(){var e=this.props,t=e.moreButtonText,n=e.reference,i=e.moreButtonStyle;return o.create("a",{href:n?n:"javascript:void(0)","class":r["fullscreen-more"],resourceId:"moreButton",onClick:this._onClickThrough},o.create("div",{"class":this._getStylesForMoreButton(),style:i},t))},_onClickThrough:function(){this.props.store.trigger("clickThrough"),this.props.store.trigger("destroy")},_updateMoreButtonVisibility:function(e){this._moreButton&&this._moreButton.toggleClass(r["fullscreen-more_invisible"],!e)},_initRenderEvents:function(){var e=this,t=this.props.store;t.on("adPlayStateChanged",function(t,n){e._updateMoreButtonVisibility(n)})},_getStylesForMoreButton:function(){var e=this.props.additionalClass,t=[r["fullscreen-more__button"]];return e&&t.push(e+"-more__button"),i(t)}});e.exports=s},657:function(e,t,n){var o=n(658);"string"==typeof o&&(o=[[e.id,o,""]]);n(650)(o,{singleton:!0});o.locals&&(e.exports=o.locals)},658:function(e,t,n){t=e.exports=n(649)(),t.push([e.id,".node_modules-common-pcode-components-fullscreen-fullscreenMoreButton---fullscreen-more{z-index:3;position:absolute;text-align:center;cursor:pointer;left:50%;bottom:20px}.node_modules-common-pcode-components-fullscreen-fullscreenMoreButton---fullscreen-more__button{font-weight:300;text-decoration:none;display:inline-block;background:#fff;padding:9px 25px;min-height:27px;line-height:1.3;box-shadow:0 2px 4px 0 rgba(0,0,0,.18);font-size:20px;color:#000;font-family:sans-serif;position:relative;left:-50%}.node_modules-common-pcode-components-fullscreen-fullscreenMoreButton---fullscreen-more_invisible{display:none}",""]),t.locals={"fullscreen-more":"node_modules-common-pcode-components-fullscreen-fullscreenMoreButton---fullscreen-more","fullscreen-more__button":"node_modules-common-pcode-components-fullscreen-fullscreenMoreButton---fullscreen-more__button","fullscreen-more_invisible":"node_modules-common-pcode-components-fullscreen-fullscreenMoreButton---fullscreen-more_invisible"}},659:function(e,t,n){var o=n(660);"string"==typeof o&&(o=[[e.id,o,""]]);n(650)(o,{singleton:!0});o.locals&&(e.exports=o.locals)},660:function(e,t,n){t=e.exports=n(649)(),t.push([e.id,'.node_modules-common-pcode-components-fullscreen-fullscreen---fullscreen{position:fixed;top:0;left:-100%;width:100%;bottom:0;background-color:rgba(0,0,0,.7)}.node_modules-common-pcode-components-fullscreen-fullscreen---fullscreen_visible{left:0}.node_modules-common-pcode-components-fullscreen-fullscreen---fullscreen__curtain{position:absolute;z-index:2;width:100%;height:100%;display:none}.node_modules-common-pcode-components-fullscreen-fullscreen---fullscreen-container{height:100%;width:100%;text-align:center;display:block;position:relative;z-index:1}.node_modules-common-pcode-components-fullscreen-fullscreen---fullscreen-container:before{content:""}.node_modules-common-pcode-components-fullscreen-fullscreen---fullscreen-container:before,.node_modules-common-pcode-components-fullscreen-fullscreen---fullscreen-container__inner{display:inline-block;height:100%;vertical-align:middle}.node_modules-common-pcode-components-fullscreen-fullscreen---fullscreen-container__inner{width:100%;max-width:100%;max-height:100%;background:50% 50% no-repeat;background-size:contain}',""]),t.locals={fullscreen:"node_modules-common-pcode-components-fullscreen-fullscreen---fullscreen",fullscreen_visible:"node_modules-common-pcode-components-fullscreen-fullscreen---fullscreen_visible",fullscreen__curtain:"node_modules-common-pcode-components-fullscreen-fullscreen---fullscreen__curtain","fullscreen-container":"node_modules-common-pcode-components-fullscreen-fullscreen---fullscreen-container","fullscreen-container__inner":"node_modules-common-pcode-components-fullscreen-fullscreen---fullscreen-container__inner"
}},661:function(e,t,n){"use strict";var o=n(192),r=o.loadCustomScript,i=n(1),s=n(28),l=n(662),c="https://yastatic.net/awaps-ad-sdk-js/1_0/adsdk.js",u=300,a=4/3,d=i.createComponent({_getId:function(){return this._id||(this._id="video_fullscreen_"+s()),this._id},beforeRender:function(){var e=this,t=this.props.store;t.on("clickOnMute",function(t){return e._toggleMute(t)}),t.on("clickThrough",function(){return e._clickThrough()})},render:function(){return i.create("div",{id:this._getId(),resourceId:"container","class":l["fullscreen-video"]})},afterRender:function(){this._loadVideoSDK()},_loadVideoSDK:function(){var e=this;r(window,c,function(){return e._initVideo()},!1)},_initVideo:function(){var e=this,t={autostartoff:!1,category:this.props.videoCategoryId,impId:this.props.impId,impressionOffset:0,keepVideoOnEnd:!1,numruns:1,partnerId:this.props.partnerId,pauseAllowed:!1,soundOnStart:!this.props.isMutedAtStart,switchVolumeOnRollOver:!1,unmuteInvitation:!1,vast:this.props.vast,vastBase64:this.props.vastBase64,visitSiteShow:!1,showGuiForVpaid:!0,yandexADXInsteadOfAdFoxFail:!1,showTimeLeft:!1,showSoundButton:!1,showSkipTimeLeft:!1,showTitle:!1,showSkipButton:!1,upscale:!1};window.ya.mediaAd.bannerAd.initVideo(this._getId(),t,function(t,n){t?e._onVideoError():e._onVideoInit(n)})},_onVideoError:function(){this.props.store.trigger("destroy")},_onVideoInit:function(e){var t=this;this._videoAdController=e;var n=this.props.store;e.onAdEnd=function(){t._stopProgressUpdate(),n.trigger("videoEnd")},e.onBeforeAdStart=function(){return t._onBeforeAdStart()},e.onAdMediaStart=function(){return t._onAdMediaStart()},e.onAdStart=function(){return t._onAdStart()},e.onPlayStateChanged=function(t){n.trigger("adPlayStateChanged",t,e.getCurrentClickability())},e.onClickThrough=function(){return n.trigger("destroy")}},onDestroy:function(){this._stopProgressUpdate(),this._videoAdController&&(this._videoAdController.destroy(),this._videoAdController=null)},_onBeforeAdStart:function(){this.props.store.trigger("render",this._getVideoSize())},_onAdMediaStart:function(){var e=this._videoAdController,t=this._getVideoSize();this._defaultVolume=e.getVolume()>0?e.getVolume():.5,this.props.store.trigger("resize",t),e.displayController.resizeAd(t.width,t.height),this._startProgressUpdate()},_onAdStart:function(){this.props.store.trigger("videoStart",this._videoAdController.getDuration())},_startProgressUpdate:function(){var e=this;this._updateInterval=setInterval(function(){return e._updateProgress()},u)},_stopProgressUpdate:function(){clearInterval(this._updateInterval)},_updateProgress:function(){this._videoAdController&&this.props.store.trigger("progressUpdate",this._videoAdController.getCurrentTime(),this._videoAdController.getDuration())},_toggleMute:function(e){this._videoAdController&&this._videoAdController.setVolume(e?0:this._defaultVolume)},_clickThrough:function(){this._videoAdController&&this._videoAdController.clickThrough()},_getVideoSize:function(){var e=window.innerWidth,t=window.innerHeight,n=this._videoAdController.getAdWidth(),o=this._videoAdController.getAdHeight();if(n>e||o>t){var r=n/o,i=e/t;r>i?(n=e,o=e/r):(n=t*r,o=t)}return{width:n||e,height:o||e/a}}});e.exports=d},662:function(e,t,n){var o=n(663);"string"==typeof o&&(o=[[e.id,o,""]]);n(650)(o,{singleton:!0});o.locals&&(e.exports=o.locals)},663:function(e,t,n){t=e.exports=n(649)(),t.push([e.id,".node_modules-common-pcode-components-fullscreen-video-fullscreenVideo---fullscreen-video{height:100%;width:100%;max-height:100vh;max-width:100vw}",""]),t.locals={"fullscreen-video":"node_modules-common-pcode-components-fullscreen-video-fullscreenVideo---fullscreen-video"}},665:function(e,t){"use strict";e.exports={}}});