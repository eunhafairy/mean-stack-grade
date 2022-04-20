/** Notice * This file contains works from many authors under various (but compatible) licenses. Please see core.txt for more information. **/
(function(){(window.wpCoreControlsBundle=window.wpCoreControlsBundle||[]).push([[7],{429:function(ia,ea,e){e.r(ea);var ca=e(1),fa=e(456),ha=e(457),da;(function(e){e[e.EXTERNAL_XFDF_NOT_REQUESTED=0]="EXTERNAL_XFDF_NOT_REQUESTED";e[e.EXTERNAL_XFDF_NOT_AVAILABLE=1]="EXTERNAL_XFDF_NOT_AVAILABLE";e[e.EXTERNAL_XFDF_AVAILABLE=2]="EXTERNAL_XFDF_AVAILABLE"})(da||(da={}));ia=function(){function e(e){this.aa=e;this.state=da.EXTERNAL_XFDF_NOT_REQUESTED}e.prototype.U$=function(){var e=this;return function(w,z,r){return Object(ca.b)(e,
void 0,void 0,function(){var e,n,f,y,x,aa,ba,ea=this,fa;return Object(ca.d)(this,function(h){switch(h.label){case 0:if(this.state!==da.EXTERNAL_XFDF_NOT_REQUESTED)return[3,2];e=this.aa.getDocument().Ir();return[4,this.o9(e)];case 1:n=h.ea(),f=this.v4(n),this.dH=null!==(fa=null===f||void 0===f?void 0:f.parse())&&void 0!==fa?fa:null,this.state=null===this.dH?da.EXTERNAL_XFDF_NOT_AVAILABLE:da.EXTERNAL_XFDF_AVAILABLE,h.label=2;case 2:if(this.state===da.EXTERNAL_XFDF_NOT_AVAILABLE)return r(w),[2];y=new DOMParser;
x=y.parseFromString(w,"text/xml");z.forEach(function(e){ea.merge(x,ea.dH,e-1)});aa=new XMLSerializer;ba=aa.serializeToString(x);r(ba);return[2]}})})}};e.prototype.PK=function(e){this.o9=e};e.prototype.fe=function(){this.dH=void 0;this.state=da.EXTERNAL_XFDF_NOT_REQUESTED};e.prototype.v4=function(e){return e?Array.isArray(e)?new fa.a(e):"string"!==typeof e?null:(new DOMParser).parseFromString(e,"text/xml").querySelector("xfdf > add")?new fa.a(e):new ha.a(e):null};e.prototype.merge=function(e,w,z){var r=
this;0===z&&(this.lca(e,w.Go),this.nca(e,w.JG));var h=w.ca[z];h&&(this.oca(e,h.Dm),this.qca(e,h.kY,w.pv),this.pca(e,h.page,z),this.mca(e,h.sQ));h=this.aa.kc();if(z===h-1){var n=w.pv;Object.keys(n).forEach(function(f){n[f].oI||r.cU(e,f,n[f])})}};e.prototype.lca=function(e,w){null!==w&&(e=this.Iu(e),this.Xp(e,"calculation-order",w))};e.prototype.nca=function(e,w){null!==w&&(e=this.Iu(e),this.Xp(e,"document-actions",w))};e.prototype.oca=function(e,w){var z=this,r=this.Hu(e.querySelector("xfdf"),"annots");
Object.keys(w).forEach(function(e){z.Xp(r,'[name="'+e+'"]',w[e])})};e.prototype.qca=function(e,w,z){var r=this;if(0!==w.length){var h=this.Iu(e);w.forEach(function(n){var f=n.getAttribute("field"),w=z[f];w&&(r.cU(e,f,w),r.Xp(h,"null",n))})}};e.prototype.cU=function(e,w,z){var r=this.Iu(e);null!==z.WA&&this.Xp(r,'ffield [name="'+w+'"]',z.WA);e=this.Hu(e.querySelector("xfdf"),"fields");w=w.split(".");this.cK(e,w,0,z.value);z.oI=!0};e.prototype.pca=function(e,w,z){null!==w&&(e=this.Iu(e),e=this.Hu(e,
"pages"),this.Xp(e,'[number="'+(z+1)+'"]',w))};e.prototype.mca=function(e,w){Object.keys(w).forEach(function(w){(w=e.querySelector('annots [name="'+w+'"]'))&&w.parentElement.removeChild(w)})};e.prototype.cK=function(e,w,z,r){if(z===w.length)w=document.createElementNS("","value"),w.textContent=r,this.Xp(e,"value",w);else{var h=w[z];this.Hu(e,'[name="'+h+'"]',"field").setAttribute("name",h);e=e.querySelectorAll('[name="'+h+'"]');1===e.length?this.cK(e[0],w,z+1,r):(h=this.g8(e),this.cK(z===w.length-
1?h:this.Sia(e,h),w,z+1,r))}};e.prototype.g8=function(e){for(var w=null,z=0;z<e.length;z++){var r=e[z];if(0===r.childElementCount||1===r.childElementCount&&"value"===r.children[0].tagName){w=r;break}}return w};e.prototype.Sia=function(e,w){for(var z=0;z<e.length;z++)if(e[z]!==w)return e[z];return null};e.prototype.Xp=function(e,w,z){w=e.querySelector(w);null!==w&&e.removeChild(w);e.appendChild(z)};e.prototype.Iu=function(e){var w=e.querySelector("pdf-info");if(null!==w)return w;w=this.Hu(e.querySelector("xfdf"),
"pdf-info");w.setAttribute("xmlns","http://www.pdftron.com/pdfinfo");w.setAttribute("version","2");w.setAttribute("import-version","4");return w};e.prototype.Hu=function(e,w,z){var r=e.querySelector(w);if(null!==r)return r;r=document.createElementNS("",z||w);e.appendChild(r);return r};return e}();ea["default"]=ia},441:function(ia,ea){ia=function(){function e(){}e.prototype.vz=function(e){var ca={Go:null,JG:null,pv:{},ca:{}};e=(new DOMParser).parseFromString(e,"text/xml");ca.Go=e.querySelector("pdf-info calculation-order");
ca.JG=e.querySelector("pdf-info document-actions");ca.pv=this.eda(e);ca.ca=this.qda(e);return ca};e.prototype.eda=function(e){var ca=e.querySelector("fields");e=e.querySelectorAll("pdf-info > ffield");if(null===ca&&null===e)return{};var ea={};this.W1(ea,ca);this.U1(ea,e);return ea};e.prototype.W1=function(e,ea){if(null!==ea&&ea.children){for(var ca=[],da=0;da<ea.children.length;da++){var ba=ea.children[da];ca.push({name:ba.getAttribute("name"),element:ba})}for(;0!==ca.length;)for(ea=ca.shift(),da=
0;da<ea.element.children.length;da++)ba=ea.element.children[da],"value"===ba.tagName?e[ea.name]={value:ba.textContent,WA:null,oI:!1}:ba.children&&ca.push({name:ea.name+"."+ba.getAttribute("name"),element:ba})}};e.prototype.U1=function(e,ea){ea.forEach(function(ca){var da=ca.getAttribute("name");e[da]?e[da].WA=ca:e[da]={value:null,WA:ca,oI:!1}})};e.prototype.qda=function(e){var ca=this,ea={};e.querySelectorAll("pdf-info widget").forEach(function(e){var ba=parseInt(e.getAttribute("page"),10)-1;ca.VB(ea,
ba);ea[ba].kY.push(e)});e.querySelectorAll("pdf-info page").forEach(function(e){var ba=parseInt(e.getAttribute("number"),10)-1;ca.VB(ea,ba);ea[ba].page=e});this.WR(e).forEach(function(e){var ba=parseInt(e.getAttribute("page"),10),aa=e.getAttribute("name");ca.VB(ea,ba);ea[ba].Dm[aa]=e});this.IR(e).forEach(function(e){var ba=parseInt(e.getAttribute("page"),10);e=e.textContent;ca.VB(ea,ba);ea[ba].sQ[e]=!0});return ea};e.prototype.VB=function(e,ea){e[ea]||(e[ea]={Dm:{},sQ:{},kY:[],page:null})};return e}();
ea.a=ia},456:function(ia,ea,e){var ca=e(1),fa=e(0);e.n(fa);ia=function(e){function da(ba){var aa=e.call(this)||this;aa.S7=Array.isArray(ba)?ba:[ba];return aa}Object(ca.c)(da,e);da.prototype.parse=function(){var e=this,aa={Go:null,JG:null,pv:{},ca:{}};this.S7.forEach(function(w){aa=Object(fa.merge)(aa,e.vz(w))});return aa};da.prototype.WR=function(e){var aa=[];e.querySelectorAll("add > *").forEach(function(e){aa.push(e)});e.querySelectorAll("modify > *").forEach(function(e){aa.push(e)});return aa};
da.prototype.IR=function(e){return e.querySelectorAll("delete > *")};return da}(e(441).a);ea.a=ia},457:function(ia,ea,e){var ca=e(1);ia=function(e){function ea(ca){var ba=e.call(this)||this;ba.T7=ca;return ba}Object(ca.c)(ea,e);ea.prototype.parse=function(){return this.vz(this.T7)};ea.prototype.WR=function(e){return e.querySelectorAll("annots > *")};ea.prototype.IR=function(){return[]};return ea}(e(441).a);ea.a=ia}}]);}).call(this || window)