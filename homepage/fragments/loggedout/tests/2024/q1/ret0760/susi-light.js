  // eslint-disable-next-line no-unused-vars
  var atOffer = {
    settings: {
      requiredElements: {
        else: {
          main: 'main',
        },
      },
    },

    main: function () {
      this.insertHTML({
        templateHtml: this.html.customCSS,
      });
      this.insertHTML({
        templateHtml: this.html.ttModalOverlay,
        position: 'afterBegin',
        element: this.usedRequiredElements.main, 
      });
      this.addSUSI();
    },
    updateSignin: function(signin) { 
      const app = this;
      const clone = signin.cloneNode(true);
      clone.classList = 'tt-feds-login';
      signin.replaceWith(clone);
      clone.addEventListener('click', this.initSusiLight.bind(this));
    },
    addSUSI: function () {
      const app = this;
      const script = document.createElement('script');
      script.src = 'https://www.qa01.adobe.com/special/narcis/susi-light/sl.min.js';
      this.$('body', (body) => body.append(script));
      if (window.adobeid) {
        // this.waitForLazyElem({elem: '.feds-login', elemContainer: '#feds-header', callback: this.updateSignin.bind(app)} );
        this.waitForLazyElem({elem: '.feds-signIn', elemContainer: '.global-navigation', callback: this.updateSignin.bind(app)} );
      } 
    },
    addParams: function(el) {
      const dt_value = window.matchMedia('(prefers-color-scheme: dark)').matches;
      el.id = 'sentry';
      el.authParams = {
        client_id: window.adobeid?.client_id,
        dt: dt_value,
        locale: window.adobeid?.locale,
        redirect_uri: window.adobeid?.redirect_uri || window.location.href, 
        response_type: 'code',
        scope: window.adobeid?.scope
      };
      el.popup = true;
      el.config = {
        consentProfile: 'free',
      };
    },
    addListeners: function(el) {
      el.addEventListener('on-auth-failed', (e) => {
        if (e.detail.reason === 'popup-blocked') {
          window.location.assign(e.detail.fallbackUrl);
        }
      });
      el.addEventListener('on-provider-clicked', (e) => {
        console.log('provider clicked');
      });
      el.addEventListener('on-error', (e) =>  {
        if (e.detail.name === 'critical') {
          console.error('critical susi-l');
        }
        if (e.detail.name === 'unrecoverable') {
          console.error('unrecoverable susi-l');
        }
      });

      el.addEventListener('on-auth-code', () => {
        window.location.assign(window.adobeid?.redirect_uri || window.location.href);
      });
    },
    addCloseEvents: function(overLay,container,el) {
      const handleKeyInputSentry = (e) => {
        if (e.shiftKey && e.key === 'Tab') {
          container.nextSibling.focus();
        } else if (e.key === 'Tab') {
          e.preventDefault();
          el.parentElement.focus();
        } 
        if (e.key === 'Escape') {
          close(overLay, container);
        }
      }
      const close = (overLay, container) => {
        overLay.remove();
        container.remove();
        document.removeEventListener(handleKeyInputSentry);
      }
      document.addEventListener('keyup', handleKeyInputSentry);
      overLay.addEventListener('click', () => {
        close(overLay, container);
      });
    },
    initSusiLight: function () {
      const app = this;
      const overLay = document.createElement('div')
      const top = document.createElement('div');
      const bottom = document.createElement('div');
      const container = document.createElement('div');
      top.id = 'tt-sentry-tp';
      top.setAttribute('tabindex','0');
      bottom.id = 'tt-sentry-bt';
      bottom.setAttribute('tabindex','0');
      overLay.id = 'tt-modal-overlay';
      container.id = "tt-sentry-container";
      container.setAttribute('role', 'dialog');
      container.setAttribute('tabindex', '0');

      const el = document.createElement('susi-sentry');
      
      this.addParams(el);
      this.addListeners(el);
 
      container.append(el);
      this.addCloseEvents(overLay,container,el);
      this.$(this.usedRequiredElements.main, (main) => {
        main.prepend(bottom);
        main.prepend(container);
        main.prepend(top);
        main.prepend(overLay);
        container.focus();
      });
    }
  };

	atOffer.html = {
  "customCSS": "<style data-tt-id=\"customCSS\" data-adobe-target-testid=\"RET0760MILOSCRIPT\">\n #tt-modal-overlay, #tt-sentry-tp, #tt-sentry-container, #tt-sentry-bt { display: block !important; } \n  .tt-feds-login {\n    align-self: center;\n    background-color: transparent;\n    border: none;\n    cursor: pointer;\n    display: flex;\n    font-family: inherit;\n    font-size: inherit;\n    line-height: inherit;\n    padding: 10px 4px;\n    text-decoration: none;\n    transition: color .1s ease;\n  }\n  .tt-feds-login:hover {\n    color: #2b9af3;\n  }\n  #tt-modal-overlay {\n    position: fixed;\n    top: 0;\n    bottom: 0;\n    left: 0;\n    right: 0;\n    z-index: 10000;\n    background: #000;\n    opacity: 0.4;\n  }\n  #tt-sentry-container {\n    background-color: #fff;\n    height: 482px;\n    width: 343px;\n    max-width: 100vw;\n    position: fixed;\n    top: 50%;\n    left: 50%;\n    transform: translate(-50%, -50%);\n    z-index: 100000;\n    border-radius: 8px;\n    padding: 40px;\n  }\n</style>\n"
};
/*waitForLazyElem.v2.min.js*/
atOffer.waitForLazyElem=function(options){try{const initialElemCheck=this.$(options.elem);if(initialElemCheck)options.callback(initialElemCheck);else{var observer=new MutationObserver(()=>{this.log(`waitForLazyElem: "${ options.elem }" loaded`);const elemCheck=this.$(options.elem);elemCheck&&(options.callback(elemCheck),observer.disconnect())});const container=document.querySelector(options.elemContainer);container?(this.log(`waitForLazyElem found elemContainer: ${ options.elemContainer } and attaching the observer.`),observer.observe(container,{childList:!0,subtree:!0})):this.log(`waitForLazyElem could not find elemContainer: ${ options.elemContainer }`,"policelight")}}catch(e){this.log(`waitForLazyElem errored: ${ options.elemContainer }. Error:\n${ e }`,"policelight"),this.removeFailedTest()}};
/*atLibrary.v3.min.js*/
function atLibrary(customFunctions,id){this.libraryVersionNumber="3.0";this.$=function(selector,callback,scope){if(!selector){this.log("element provided to $ is undefined","policelight");return false}if(typeof callback==="object"){const tempfunc=scope;scope=callback;callback=tempfunc}try{let elem;scope=scope?scope:document;if(selector.includes(":eq")){const sel=selector.split(":eq")[0];const num=selector.split(":eq")[1].match(/(\d+)/)[0];elem=scope.querySelectorAll(sel)[num]}else{elem=scope.querySelector(selector)}if(elem){this.addAtMarker(elem);if(typeof callback==="function"){callback(elem,0)}return elem}}catch(e){this.warn("-ERROR-$('"+selector+"'): "+e)}};this.$$=function(selector,callback,scope){if(typeof callback==="object"){const tempfunc=scope;scope=callback;callback=tempfunc}if(selector){scope=scope?scope:document;const elems=scope.querySelectorAll(selector);elems.forEach((elem,index)=>{this.addAtMarker(elem);if(typeof callback==="function"){callback(elem,index)}});return elems}else{this.log("element provided to $$ is undefined","policelight");return false}};this.addAtMarker=function(el){const addAttribute=domNode=>{domNode.setAttribute("data-adobe-target-testid",this.id)};try{if(el instanceof NodeList){el.forEach(item=>addAttribute(item))}else if(el instanceof Node){addAttribute(el)}else{const elem=document.querySelectorAll(el);elem.forEach(item=>addAttribute(item))}}catch(e){this.log(e)}};this.fillMissingOptionsWithDefaults=function(options,defaultOptions){return{...defaultOptions,...options}};this.includes=function(str,arr){for(let substr of arr){if(substr==="${ ")substr=substr.trim();if(str.includes(substr))return true }return false};this.parseString=function(str,data){const reduce=(target,obj)=>{let keys=target.split(".");return keys.reduce((prev,curr)=>{if(curr.search(/\[/g)>-1){let mCurr=curr.replace(/\]/g,"");let arr=mCurr.split("[");return arr.reduce((pr,cu)=>{cu=cu.split('"').join("").split("'").join("");return pr&&pr[cu]},prev)}else{return prev&&prev[curr]}},obj)};const completeData={this:this};if(data){completeData.data=data}if(this.useCopy){const uc=this.useCopy;if(uc.languages&&uc.languages[this.language]){completeData.thisLanguage=uc.languages[this.language]}if(uc.countries){if(uc.countries[this.country]){completeData.thisCountry=uc.countries[this.country]}if(uc.countries[this.userCountry]){completeData.thisUserCountry=uc.countries[this.userCountry]}}if(uc.locales&&uc.locales[this.locale]){completeData.thisLocale=uc.locales[this.locale]}if(this.useCopy.pages&&this.useCopy.pages[this.page]){completeData.thisPage=this.useCopy.pages[this.page]}}return str.replace(/\$\{([^}]+)}/g,(_,target)=>{target=target.trim();for(const property in completeData){const splitValue="["+property+".";if(target.includes(splitValue)){const openBracketSplit=target.split(splitValue);for(let i=1;i<openBracketSplit.length;i++){let closeBracketSplit=openBracketSplit[i].split("]");closeBracketSplit[0]=reduce(property+"."+closeBracketSplit[0],completeData);if(isNaN(closeBracketSplit[0])){closeBracketSplit[0]="'"+closeBracketSplit[0]+"'"}openBracketSplit[i]=closeBracketSplit.join("]")}target=openBracketSplit.join("[")}}return reduce(target,completeData)})};this.insertHTML=function(fOptions){const defaultOptions={templateHtml:false,position:"beforeEnd",element:"body",linkHeader:false,data:{}};const placeHTML=element=>{const position=options.position.toLowerCase();if(position==="innerhtml"){element.innerHTML=options.templateHtml}else if(position==="outerhtml"){element.outerHTML=options.templateHtml}else{element.insertAdjacentHTML(options.position,options.templateHtml)}};if("element"in fOptions&&typeof fOptions.element==="undefined"){this.log("element provided to insertHTML is undefined","policelight");return false}else if(!fOptions.templateHtml){if(fOptions.html){fOptions.templateHtml=fOptions.html;delete fOptions.html}else{this.log("The insertHTML function was passed an undefined html setting.  Please check your reference in the function call. It is likely your data-tt-id name does not exactly match your reference","policelight");return false}}const options={...defaultOptions,...fOptions};while(this.includes(options.templateHtml,["${ ","[["])){if(options.templateHtml.includes("[[")){options.templateHtml=options.templateHtml.split("[[").join("${").split("]]]").join("] }").split("]]").join("}")}options.templateHtml=this.parseString(options.templateHtml,options.data)}const newElemContainer=document.createElement("DIV");if(options.templateHtml.startsWith("<tr")||options.templateHtml.startsWith("<td")){options.templateHtml=options.templateHtml.split("<tr>").join("<ttr>").split("<tr ").join("<ttr ").split("</tr>").join("</ttr>").split("<td>").join("<ttd>").split("<td ").join("<ttd ").split("</td>").join("</ttd>")}newElemContainer.innerHTML=options.templateHtml;const newElem=newElemContainer.querySelector(":scope>*")||newElemContainer;newElem.setAttribute("data-adobe-target-testid",this.id);if(typeof options.linkHeader==="string"||options.linkHeader instanceof String){newElem.setAttribute("daa-lh",options.linkHeader)}else if(options.linkHeader===true){const dataId=newElem.getAttribute("data-tt-id");newElem.setAttribute("daa-lh",this.id+"|"+dataId)}const ttIfs=newElem.querySelectorAll('[data-tt-if=""],[data-tt-if="undefined"]');ttIfs.forEach(ttIf=>{ttIf.parentNode.removeChild(ttIf)});options.templateHtml=newElem.outerHTML;const tableTags=["tr","td"];tableTags.forEach(tag=>{options.templateHtml=options.templateHtml.split("<t"+tag+" ").join("<"+tag+" ").split("<t"+tag+">").join("<"+tag+">").split("</t"+tag+">").join("</"+tag+">")});if(typeof options.element==="string"||options.element instanceof String){const el=document.querySelectorAll(options.element);for(let j=0;j<el.length;j++){placeHTML(el[j])}}else if(options.element){placeHTML(options.element)}};this.removeFailedTest=function(message){this.trackCustomLink(message);this.removeFlickerPreventionCss()};this.removeFlickerPreventionCss=()=>{this.log("removing flicker prevention css");let els=document.querySelectorAll('style.atHide[data-adobe-target-testid="'+this.id+'"]');els.forEach(el=>el.parentNode.removeChild(el))};this.trackCustomLink=function(val,prependTestNumber){if(typeof prependTestNumber==="undefined")prependTestNumber=true;if(prependTestNumber)val=this.id+" "+val;this.log("trackCustomLink: "+val);try{if(window.marketingtech&&window.marketingtech.adobe&&window.marketingtech.adobe.alloy&&window.alloy){window.alloy("sendEvent",{documentUnloading:true,xdm:{eventType:"web.webinteraction.linkClicks",web:{webInteraction:{linkClicks:{value:1},type:"other",name:val}}},data:{_adobe_corpnew:{digitalData:{primaryEvent:{eventInfo:{eventName:val}}}}}})}else if(window._satellite&&window._satellite.buildInfo){let digitalDataSnapshot=window.digitalData._snapshot();digitalDataSnapshot._set("primaryEvent.eventInfo.eventName",val);window._satellite.track("event",{digitalData:digitalDataSnapshot,clickTracking:true})}else if(window.s_adbadobenonacdc){window.s_adbadobenonacdc.tl(true,"o",val)}else{this.warn("Custom Link not tracked. Library not found.")}}catch(e){this.warn("-ERROR-trackCustomLink: "+e)}};this.log=function(output,emoji){if(this.devPhase){let emojiSymbol="",emojis={target:"0x1F3AF",thumbsup:"0x1F44D",thumbsdown:"0x1F44E",pray:"0x1F64F",smile:"0x1F600",thinking:"0x1F914",warning:"0x26A0",policelight:"0x1F6A8",fire:"0x1F525",cat:"0x1F431",dog:"0x1F436"};if(!emoji)emoji=this.defaultEmojiForLogs;if(!(emoji.toLowerCase()in emojis)){emojiSymbol=String.fromCodePoint(emoji)+" "}else{emoji.split("U+").join("0x");emojiSymbol=String.fromCodePoint(emojis[emoji.toLowerCase()])+" "}let prefix=emojiSymbol+this.id+"-"+this.experience+"-"+this.language+"-"+this.country+"-"+this.audience+"-"+this.server+": ";if(!!window.MSInputMethodContext&&!!document.documentMode&&typeof output!=="string"){console.log(prefix);console.log(output)}else{console.log(prefix,output)}}};this.warn=function(output){if(this.devPhase)console.warn(this.id+"-"+this.experience+"-"+this.country+"-"+this.language+"-"+this.server+"-"+this.audience+": "+output)};this.init=function(){const defaultSettings={id:id,requiredElements:false,audiences:false,defaultEmojiForLogs:"target",waitForBodyLoad:true,timeout:3e3};const checkKeyAgainstUrl=key=>{const pageList=key.split(",");let pageFound=false;pageList.forEach(item=>{if(window.location.href.includes(item.trim())){pageFound=true}});return pageFound};const findRequiredElements=settings=>{if(settings.waitForBodyLoad&&document.readyState!=="interactive"&&document.readyState!=="complete"){return"bodyNotLoaded"}else if(!settings.waitForBodyLoad||document.readyState==="interactive"||document.readyState==="complete"){if(settings.requiredElements===false||Array.isArray(settings.requiredElements)||(typeof settings.requiredElements==="string"||settings.requiredElements instanceof String)&&settings.requiredElements!==""){this.usedRequiredElements=settings.requiredElements;return chooseSelectionMethod(settings.requiredElements)}else if(typeof settings.requiredElements==="object"){let elementFound=false;Object.keys(settings.requiredElements).forEach(key=>{if(!elementFound&&(checkKeyAgainstUrl(key)||key==="else"||key==="all")){this.usedRequiredElements=settings.requiredElements[key];elementFound=chooseSelectionMethod(settings.requiredElements[key])}});return elementFound}else{return false}}};const chooseSelectionMethod=selector=>{if(selector===false){return true}else if((typeof selector==="string"||selector instanceof String)&&selector!==""){return tryToSelect(selector)}else if(Array.isArray(selector)){for(let i=0;i<selector.length;i++){if(!tryToSelect(selector[i]))return false}return true}else if(typeof selector==="object"){let allKeysFound=true;Object.keys(selector).forEach(function(key){if(!tryToSelect(selector[key]))allKeysFound=false});return allKeysFound}};const tryToSelect=selector=>{try{let el=document.querySelectorAll(selector);if(el.length){return true}else{this.log(`${ this.id } required element '${ selector }' not found`,"policelight");return false}}catch(e){this.warn("Invalid selector in required elements");return false}};const setCountryAndLanguageFromLocale=locale=>{let localeArray=locale.toLowerCase().split("-").join("_").split("_");if(localeArray.length){if(localeArray.length>=3){this.language=`${ localeArray[0] }-${ localeArray[1] }`;this.country=localeArray[2]}else if(localeArray.length>=2){this.language=localeArray[0];this.country=localeArray[1]}else{this.country=localeArray[0];const diffCountryLanguageCodes={jp:"ja",mx:"es",br:"pt",se:"sv",dk:"da",us:"en",cn:"zh-hant",hk:"zh-hant",tw:"zh-hant",kr:"ko"};const diffLanguageCountryCodes={};Object.keys(diffCountryLanguageCodes).forEach(function(key){diffLanguageCountryCodes[diffCountryLanguageCodes[key]]=key});if(this.country==="nb"){this.language="no";this.country="no"}else if(this.country in diffCountryLanguageCodes){this.language=diffCountryLanguageCodes[this.country]}else if(this.country in diffLanguageCountryCodes){this.language=this.country;this.country=diffLanguageCountryCodes[this.country]}else{this.language=this.country}}this.countryCode=this.country==="uk"?"GB":this.country.toUpperCase();this.countryFolder="";let ccGeoFolderList=["br","ca","ca_fr","la","mx","cl","africa","be_nl","be_fr","be_en","bg","sa_en","sa_ar","ae_en","cz","cy_en","dk","de","ee","es","fr","gr_en","ie","il_en","it","lv","lt","lu_de","lu_en","lu_fr","hu","mt","mena_en","nl","no","at","pl","pt","ro","ch_de","si","sk","ch_fr","fi","se","ch_it","tr","ua","uk","ru","au","hk_en","in","nz","sea","sg","th_en","cn","hk_zh","tw","jp","kr","cis_ru","ae_ar","mena_ar","il_he","cis_en","co","ar","pe","za","my_en","id_en","ph_en","vn_en"];if(locale==="iw_IL"){this.countryFolder="il_he/"}else if(ccGeoFolderList.includes(this.country+"_"+this.language)){this.countryFolder=this.country+"_"+this.language+"/"}else if(ccGeoFolderList.includes(this.country)){this.countryFolder=this.country+"/"}}this.locale=this.language+"_"+this.country};const setInitValues=(settings,id)=>{this.id=settings.id||id;this.campaign=id;this.experience=1;this.country="us";this.countryCode="US";this.language="en";this.countryFolder="";this.audience="all";this.defaultEmojiForLogs=settings.defaultEmojiForLogs;if(window.location.host.includes("stage")||window.location.host.includes("stg")||window.location.host.includes("author")){this.server="stage"}else{this.server="prod"}const ua=navigator.userAgent.toLocaleLowerCase()||navigator.vendor.toLocaleLowerCase()||window.opera.toLocaleLowerCase();this.browser=false;if(ua.includes("edg/")){this.browser="edge"}else if(ua.includes("firefox/")){this.browser="firefox"}else if(ua.includes("opr/")){this.browser="opera"}else if(ua.includes("chrome/")){this.browser="chrome"}else if(ua.includes("safari/")){this.browser="safari"}this.platform=false;if(/windows phone/i.test(ua)){this.platform="windowsPhone"}else if(/android/i.test(ua)){this.platform="android"}else if(/(iphone|ipad|ipod)/i.test(ua)&&!window.MSStream){this.platform="iOS"}else if(/(macintosh|macintel|macppc|mac68k|macos)/i.test(ua)){this.platform="mac"}else if(/(win32|win64|windows|wince)/i.test(ua)){this.platform="windows"}this.devPhase=false;let locale="en_us";if(typeof adobeid!=="undefined"&&"locale"in adobeid){if(typeof adobeid.locale==="object"&&"ietf"in adobeid.locale){locale=adobeid.locale.ietf}else if(typeof adobeid.locale==="string"){locale=adobeid.locale}}else if(adobe_dc_sdk?.dom?.getLocale){locale=adobe_dc_sdk.dom.getLocale()}setCountryAndLanguageFromLocale(locale);this.userCountry=this.country;this.userCountryCode=this.countryCode;if(window.location.pathname==="/"||window.location.pathname==="/"+this.country+"/"){this.page="index";this.pageWithPath="/index"}else{const pathArray=window.location.pathname.split("/");if(window.location.pathname[window.location.pathname.length-1]==="/"){this.page=pathArray[pathArray.length-2]}else{this.page=pathArray[pathArray.length-1].split(".")[0]}this.pageWithPath=window.location.pathname}if(this.country!=="us"){if(this.country==="gb"){this.log('Locale uses "gb", updated to "uk".');this.country="uk";this.countryFolder="uk/"}this.pageWithPath=window.location.pathname.replace(this.countryFolder,"")}};const lookForRecipeNamePrefixes=recipeName=>{if(recipeName.startsWith("control")||recipeName.startsWith("ctrl")||recipeName.startsWith("cntrl")||recipeName.startsWith("holdout")){return 0}else{let prefixes=["var","branch","challenger","experience"];for(let i=0;i<prefixes.length;i++){for(let j=0;j<2;j++){let prefix=prefixes[i];if(!j)prefix+=" ";if(recipeName.startsWith(prefix)){let exp=recipeName.substr(prefix.length,1);if(exp==="-"){return 1}else if(isNaN(exp)){return recipeName.charCodeAt(prefix.length)-97}else{return exp}}}}}return 1};const setValuesFromTarget=settings=>{let el=document.querySelectorAll('[data-csp-campaign-id="'+this.id+'"]'),recipeName="${campaign.recipe.name}",campaignName="${campaign.name}",geoLocationCountry="${profile.geolocation.country}";if(el.length){campaignName=el[0].getAttribute("data-campaign-name");recipeName=el[0].getAttribute("data-recipe-name");geoLocationCountry=el[0].getAttribute("data-geolocation-country")}recipeName=recipeName.toLowerCase();campaignName=campaignName.toLowerCase();if(!recipeName.includes("recipe.name")){this.experience=lookForRecipeNamePrefixes(recipeName);if(Array.isArray(settings.audiences)){for(let i=0;i<settings.audiences.length;i++){if(recipeName.includes(settings.audiences[i].toLowerCase())||campaignName.includes(settings.audiences[i].toLowerCase()))this.audience=settings.audiences[i]}}let targetCountryNameMap={argentina:"ar",brazil:"br",canada:"ca",chile:"cl",colombia:"co","costa rica":"cr",ecuador:"ec",guatemala:"gt",mexico:"mx",peru:"pe","united states":"us",venezuela:"ve",austria:"at",belgium:"be",bulgaria:"bg",croatia:"hr","czech republic":"cz",denmark:"dk",estonia:"ee",finland:"fi",france:"fr",germany:"de",greece:"gr",hungary:"hu",ireland:"ie",italy:"it",latvia:"lv",lithuania:"lt",luxembourg:"lu",malta:"mt",netherlands:"nl",norway:"no",poland:"pl",portugal:"pt",romania:"ro","russian federation":"ru",serbia:"rs","slovakia (slovak republic)":"sk",slovenia:"si",spain:"es",sweden:"se",switzerland:"ch","united kingdom":"uk",ukraine:"ua",australia:"au",china:"cn","hong kong":"hk",india:"in",japan:"jp","south korea":"kr","new zealand":"nz",taiwan:"tw",indonesia:"id",malaysia:"my",philippines:"ph",singapore:"sg",thailand:"th","viet nam":"vn",algeria:"dz",cyprus:"cy",egypt:"eg",morocco:"ma","south africa":"za",tunisia:"tn",afghanistan:"af",bahrain:"bh",israel:"il",jordan:"jo",kuwait:"kw",lebanon:"lb",oman:"om",qatar:"qa","saudi arabia":"sa",turkey:"tr","united arab emirates":"ae",yemen:"ye"};if(geoLocationCountry in targetCountryNameMap)this.userCountry=targetCountryNameMap[geoLocationCountry];this.userCountryCode=this.userCountry==="uk"?"GB":this.userCountry.toUpperCase()}};const setValuesFromGet=()=>{this.get={};let args=location.search.substr(1).split(/&/);for(let i=0;i<args.length;++i){let tmp=args[i].split(/=/);if(tmp[0]!==""){this.get[decodeURIComponent(tmp[0])]=decodeURIComponent(tmp.slice(1).join("").replace("+"," "))}}if("tt"in this.get||"at_preview_token"in this.get||"test"in this.get||"atMarker"in this.get){this.devPhase=true;if("tt"in this.get){let ttArray=decodeURIComponent(this.get.tt.toLowerCase()).split(",");for(let i=0;i<ttArray.length;i++){if(ttArray[i].includes(this.id.toLowerCase())){let tmpDcc=ttArray[i].split("-");if(tmpDcc.length>=2&&!isNaN(tmpDcc[1]))this.experience=tmpDcc[1]}}}}let geoLocationCountry="${profile.geolocation.country}",cspScript=document.querySelectorAll('[data-csp-campaign-id="'+this.id+'"]');if(geoLocationCountry.includes("profile.geolocation.country")&&!cspScript.length&&("countryCode"in this.get||"akamaiLocale"in this.get)){if("countryCode"in this.get){this.userCountry=this.get.countryCode.toLowerCase()}else if("akamaiLocale"in this.get){this.userCountry=this.get.akamaiLocale.toLowerCase()}this.userCountryCode=this.userCountry.toUpperCase();if(this.userCountry==="gb"){this.userCountry="uk"}}if("server"in this.get){this.server=this.get.server}if("atMarker"in this.get)document.body.classList.add("atMarker");if("atlocale"in this.get)setCountryAndLanguageFromLocale(this.get.locale);if("ataudience"in this.get)this.audience=this.get.ataudience;if("atbrowser"in this.get)this.browser=this.get.atbrowser.toLowerCase();if("atplatform"in this.get)this.platform=this.get.atplatform.toLowerCase();if(this.platform==="windowsphone"){this.platform="windowsPhone"}else if(this.platform==="ios"){this.platform==="iOS"}};const addClassesToBodyAndStartMain=async()=>{const testIdWithVariant=this.id+"-"+this.experience;document.body.classList.add(testIdWithVariant);document.body.classList.add("ttLocale-"+this.locale);document.body.classList.add("ttPage-"+this.page);document.body.classList.add("ttAudience-"+this.audience);let testIdsValue=document.body.dataset.adobeTargetTestids;if(testIdsValue){let testIdsValueArray=testIdsValue.split(" ");if(!testIdsValueArray.includes(testIdWithVariant))document.body.dataset.adobeTargetTestids=testIdsValue+" "+testIdWithVariant}else{document.body.dataset.adobeTargetTestids=testIdWithVariant}this.log(`firing main function in library v${ this.libraryVersionNumber }`);await this.main();this.removeFlickerPreventionCss()};const runMain=()=>{if("disable"in this.get&&this.get.disable.includes(this.id)){this.removeFailedTest("disabled by parameter")}else if("main"in this){this.experience=parseInt(this.experience);if(this.devPhase){addClassesToBodyAndStartMain()}else{try{addClassesToBodyAndStartMain()}catch(e){this.removeFailedTest("error: JS contains error")}}}else{this.removeFailedTest("error: main function not set")}};let settings=defaultSettings;if("settings"in customFunctions)settings={...defaultSettings,...customFunctions.settings};let endTime=Date.now()+settings.timeout;Object.keys(customFunctions).forEach(key=>{this[key]=customFunctions[key]});setInitValues(settings,id);setValuesFromTarget(settings);setValuesFromGet();if(findRequiredElements(settings)===true){runMain()}else{let findElementsInterval=setInterval(()=>{const elementsFound=findRequiredElements(settings);if(elementsFound===true){clearInterval(findElementsInterval);runMain()}else if(Date.now()>endTime){clearInterval(findElementsInterval);if(elementsFound==="bodyNotLoaded"){this.removeFailedTest("error: body not loaded in allowed timeout")}else{this.removeFailedTest("error: requiredElements not found in allowed timeout")}}},100)}};this.init()}
if (typeof atOffers === 'undefined') var atOffers = {};
atOffers['RET0760MILOSCRIPT'] = new atLibrary(atOffer, 'RET0760MILOSCRIPT');
