if(!window.console){window.console={log:function(){},error:function(){},warn:function(){}}}if(window.isIdaStatsLoaded){throw new Error("ida_stats.js: Another version of the SDK has been loaded.")}window.isIdaStatsLoaded=true;window.scriptStartTime=window.scriptStartTime||window.performance.now();window.loadingTime=window.loadingTime||new Date().getTime();window._appInfo=window._appInfo||{};window.idaPageIsSPA=_appInfo.idaPageIsSPA||window.idaPageIsSPA||false;_appInfo.dbdmLibrary="1";(function(){var b=["cmCreatePageviewTag","cmCreateProductviewTag","cmCreateShopAction5Tag","cmDisplayShops","cmCreateShopAction9Tag","cmCreateOrderTag","cmCreateRegistrationTag","cmCreateElementTag","cmCreateConversionEventTag","cmCreateManualPageviewTag","cmCreateManualLinkClickTag","cmCreateManualImpressionTag","cmCreateCustomTag","cmSetupOther","cmSetCurrencyCode","cmDisplayShop9s","cmDisplayShop5s","cmRetrieveUserID","ibmStats.event","bindPageViewWithAnalytics"];
window.ghostQueue=[];(function f(){if(!d()){for(var g=0;g<b.length;g++){c(b[g])}a()}})();function d(){for(var g=0;g<b.length;g++){if(b[g].indexOf(".")===-1){if(typeof(window[b[g]])!=="function"||window[b[g]].isGhost){return false}}else{if(typeof(window[b[g].split(".")[0]])!=="undefined"){if(typeof(window[b[g].split(".")[0]][b[g].split(".")[1]])!=="function"||window[b[g].split(".")[0]][b[g].split(".")[1]].isGhost){return false}}else{return false}}}return true}function c(g){if(g.indexOf(".")===-1){window[g]=function(){window.ghostQueue.push({functionName:g,args:arguments})
};window[g].isGhost=true}else{window[g.split(".")[0]]=window[g.split(".")[0]]||{};window[g.split(".")[0]][g.split(".")[1]]=function(){window.ghostQueue.push({functionName:g,args:arguments})};window[g.split(".")[0]][g.split(".")[1]].isGhost=true}}function a(){setTimeout(function(){if(d()){e()}else{a()}},50)}function e(){if(!!dl&&!!dl.log){dl.log("+++DBDM-LOG > Executing "+window.ghostQueue.length+" queued commands from ghostQueue.")}for(var g=0;g<window.ghostQueue.length;g++){if(window.ghostQueue[g].functionName.indexOf(".")===-1){window[window.ghostQueue[g].functionName].apply(this,window.ghostQueue[g].args)
}else{window[window.ghostQueue[g].functionName.split(".")[0]][window.ghostQueue[g].functionName.split(".")[1]].apply(this,window.ghostQueue[g].args)}}}})();var v16elu={evhndlr:true,storeTealiumPageviewData:function(){var e=new Array();window.pageViewAttributes="";var h=JSON.stringify(window.utag.sender).split(/[}]/);for(var d=0;d<h.length;d++){var m=h[d].split("{")[0],g=h[d].split("{")[1];if(m.indexOf("map")!==-1&&typeof g!=="undefined"){var f=g.split(",");for(var c=0;c<f.length;c++){if(typeof f[c].split(":")[1]!=="undefined"&&f[c].split(":")[1].indexOf("PageviewTag_pv_a")!==-1){var l=f[c].split(":")[0].replace(/[""]/g,""),b=f[c].split(":")[1].substring(17,f[c].split(":")[1].length-1);
if(typeof utag.data[l]!=="undefined"&&(e[b]==""||e[b]==undefined)){e[b]=utag.data[l]}else{if(typeof utag.data[l]!=="undefined"&&l.indexOf("meta.")!==-1){e[b]=utag.data[l]}}}}}}for(var d=1;d<=e.length;d++){window.pageViewAttributes+=e[d]+"-_-"}},onPageLoad:function(){if(window.utag&&window.utag.sender){v16elu.storeTealiumPageviewData()}},utilstatsHelper:function(a){ibmStats.event(a)},init:function(){var a=this;window.loadingTime=new Date().getTime();(function(m,l,k,j){var n="";var e=true;var h=["testpage"];
var f=[];if(typeof(digitalData)!=="undefined"&&typeof(digitalData.page)!=="undefined"&&typeof(digitalData.page.pageInfo)!=="undefined"&&typeof(digitalData.page.pageInfo.ibm)!=="undefined"&&typeof(digitalData.page.pageInfo.ibm.siteID)!=="undefined"){n=digitalData.page.pageInfo.ibm.siteID.toLowerCase()}else{if(document.querySelector('meta[name="IBM.WTMSite"]')!==null){n=document.querySelector('meta[name="IBM.WTMSite"]').content.toLowerCase()}}m="//tags.tiqcdn.com/utag/ibm/web/prod/utag.js";if(typeof(h)!=="undefined"){for(var g=0;
g<h.length;g++){if(document.location.href.indexOf(h[g])!=-1){e=false;break}}}if(e&&(n!=="")&&(typeof(f)!=="undefined")){for(var g=0;g<f.length;g++){if(n.toLowerCase()===f[g].toLowerCase()){e=false;break}}}if(e){l=document;k="script";j=l.createElement(k);j.src=m;j.type="text/java"+k;j.async=true;m=l.getElementsByTagName(k)[0];m.parentNode.insertBefore(j,m);j.onload=function(){if(typeof window.utag!=="undefined"&&typeof window.utag.data!=="undefined"){v16elu.siteID=window.utag.data.site_id||"";if(v16elu.siteID.toLowerCase()=="ecom"){window.cmTagQueue.push(["cmSetupNormalization","krypto-_-krypto"])
}if(v16elu.siteID.toLowerCase()=="p4sc"){window.cmTagQueue.push(["cmSetupOther",{cm_JSFEAMasterIDSessionCookie:true,cm_FormPageID:true}])}else{window.cmTagQueue.push(["cmSetupOther",{cm_JSFEAMasterIDSessionCookie:true}])}}}}})();if(window.addEventListener){window.addEventListener("load",v16elu.onPageLoad,false)}else{if(window.attachEvent){window.attachEvent("onload",v16elu.onPageLoad)}}}};if(typeof(window.ida_eluminate_enabled)!=="undefined"||typeof(window.tealium_enabled)!=="undefined"){if(!window.ida_eluminate_enabled||!window.tealium_enabled){}else{v16elu.init()
}}else{v16elu.init()};