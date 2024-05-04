var M=Object.defineProperty;var D=(t,e,n)=>e in t?M(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n;var T=(t,e,n)=>(D(t,typeof e!="symbol"?e+"":e,n),n);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function n(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(s){if(s.ep)return;s.ep=!0;const o=n(s);fetch(s.href,o)}})();const r={title:(t,e="h1")=>{const n=document.createElement(e);return n.classList.add("title"),n.innerHTML=t,n},container:(t={bordered:!1})=>{const e=document.createElement("div");return e.classList.add("container"),t.bordered&&e.classList.add("bordered"),e},list:()=>{const t=document.createElement("div");return t.classList.add("list"),t},button:({id:t,label:e,labelElement:n="h2",onClick:i,danger:s=!1,visible:o=!0})=>{const a=document.createElement("button");t&&(a.id=t),a.classList.add("btn");const c=`<${n}>${e}</${n}>`;return a.innerHTML=c,i&&(a.onclick=async()=>{a.disabled=!0,a.innerHTML="Loading...";try{await i()}catch(l){console.error(l)}finally{a.innerHTML=c,a.disabled=!1}}),s&&(a.style.backgroundColor="var(--color-danger)"),o||(a.style.display="none"),a},icon:({id:t,icon:e,onClick:n=()=>{},visible:i=!0})=>{const s=document.createElement("span");return t&&(s.id=t),s.ariaHidden=!0,s.role="img",s.innerHTML=e,i||(s.style.display="none"),s.style.cursor="pointer",s.onclick=n,s},input:({id:t,label:e,value:n,disabled:i=!1,type:s="text",slot:o,props:a={}})=>{const c=document.createElement("div");c.classList.add("field-container");const l=document.createElement("h2");l.classList.add("field-label"),l.innerHTML=e;const m=document.createElement("div");m.classList.add("input-with-slot");const p=document.createElement("input");return t&&(p.id=t),p.disabled=i,p.value=n,p.type=s,Object.entries(a).forEach(([g,w])=>p.setAttribute(g,w)),m.appendChild(p),o&&m.appendChild(o),c.append(l,m),c},combobox:({id:t,value:e,values:n,label:i,disabled:s=!1,onChange:o,props:a={}})=>{const c=document.createElement("div");if(c.classList.add("field-container"),i){const m=document.createElement("h2");m.classList.add("field-label"),m.innerHTML=i,c.appendChild(m)}const l=document.createElement("select");return t&&(l.id=t),l.disabled=s,l.appendChild(document.createElement("option")),o&&(l.onchange=()=>o(l.value)),Object.entries(a).forEach(([m,p])=>l.setAttribute(m,p)),c.append(l),A(c,n),e&&(l.value=e),c},tree:t=>{const e=document.createElement("ul");return Object.entries(t).forEach(([n,i])=>e.appendChild(I({key:n,value:i}))),e},controlsHolder:()=>{const t=document.createElement("div");return t.classList.add("controls-holder"),t}},v={pencil:'<svg fill="currentColor" class="material-design-icon__svg" width="35" height="35" viewBox="0 0 24 24"><path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"></path></svg>',trash:'<svg fill="currentColor" class="material-design-icon__svg" width="35" height="35" viewBox="0 0 24 24"><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"></path></svg>',cross:'<svg fill="currentColor" class="material-design-icon__svg" width="35" height="35" viewBox="0 0 24 24"><path d="M13.46,12L19,17.54V19H17.54L12,13.46L6.46,19H5V17.54L10.54,12L5,6.46V5H6.46L12,10.54L17.54,5H19V6.46L13.46,12Z"></path></svg>',save:'<svg fill="currentColor" class="material-design-icon__svg" width="35" height="35" viewBox="0 0 24 24"><path d="M15,9H5V5H15M12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3Z"></path></svg>',update:'<svg fill="currentColor" class="material-design-icon__svg" width="35" height="35" viewBox="0 0 24 24"><path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z"></path></svg>'};function A(t,e){if(!e)return;const n=t.getElementsByTagName("select")[0];if(!n){console.error("Can't find select in combobox");return}let i;Array.isArray(e)?i=e.map(s=>({key:s,caption:s})):i=Object.entries(e).map(([s,o])=>({key:s,caption:o})),i.forEach(({key:s,caption:o})=>{const a=document.createElement("option");a.value=s,a.innerHTML=o,n.appendChild(a)})}const I=({key:t,value:e})=>{const n=document.createElement("li");return n.append(t+": ",F(e)),n},F=t=>{if(Array.isArray(t)){const e=document.createElement("ul");return t.forEach(n=>{const i=document.createElement("li");i.innerHTML=n,e.appendChild(i)}),e}else if(t instanceof Object){const e=document.createElement("ul");return Object.entries(t).forEach(([n,i])=>{const s=document.createElement("li");s.appendChild(I({key:n,value:i})),e.appendChild(s)}),e}else{const e=document.createElement("span");return e.innerHTML=t,e}};class k{constructor(e,n,i){T(this,"selected",{});this.id=e,this.menuItems=n,this.placeholder=i}create(){const e=document.createElement("div");e.classList.add("menu-panel"),this.viewDiv=document.createElement("div"),this.viewDiv.classList.add("menu-items","list","br"),this.viewDiv.id=this.id,Object.entries(this.menuItems).forEach(([i,{name:s}])=>{const o=document.createElement("h2");o.id=i,o.innerHTML=s,o.onclick=()=>this.open(i),this.viewDiv.appendChild(o)}),this.contentDiv=document.createElement("div"),this.contentDiv.classList.add("menu-item-content"),this.contentDiv.id=this.id+"-content",this.loadingTitle=r.title("Loading...","h2"),this.loadingTitle.style.display="none",this.contentDiv.appendChild(this.loadingTitle);const n=r.icon({id:this.id+"-update",icon:v.update,onClick:()=>this.updateContent()});return n.classList.add("update-button"),this.contentDiv.appendChild(n),e.append(this.viewDiv,this.contentDiv),e}open(e){const n=document.getElementById(e);if(!n){console.error("Failed to open menuItem id="+e+": element not found");return}this.selected.item&&(this.selected.item.classList.remove("menu-selected"),this.selected.content.style.display="none");let i=document.getElementById(e+"-content");i?i.style.display="":(i=this.createContent(e),this.contentDiv.appendChild(i)),n.classList.add("menu-selected"),this.selected.name=e,this.selected.item=n,this.selected.content=i,document.getElementById(this.id+"-update").style.display="unset"}updateContent(){this.selected&&(this.selected.content.remove(),this.selected.content=this.createContent(this.selected.name),this.contentDiv.appendChild(this.selected.content))}createContent(e){const n=e+"-content",i=r.container();return i.id=n,this.menuItems[e].title&&i.appendChild(r.title(this.menuItems[e].title)),this.loadContent(i,e),i}async loadContent(e,n){try{this.loading(!0),e.appendChild(await this.menuItems[n].content()??r.container())}catch(i){console.error(i)}finally{this.loading(!1)}}loading(e){this.loadingTitle.style.display=e?"":"none"}}let{hostname:C}=window.location;C==="localhost"&&(C="192.168.2.2");const b="Something gone wrong",h={info:async()=>(await u({path:"/info/system"})).data,actions:async()=>(await u({path:"/info/actions"})).data,configInfo:async()=>(await u({path:"/info/config"})).data,getWifi:async()=>(await u({path:"/wifi"})).data,saveWifi:async t=>{await u({path:"/wifi",method:"POST",payload:t})},saveName:async t=>{await u({path:"/info/system",method:"PUT",payload:{name:t}})},execAction:async t=>{await u({method:"PUT",path:"/actions",params:{action:t}})},sensors:async()=>(await u({path:"/sensors"})).data,states:async()=>(await u({path:"/states"})).data,config:async()=>(await u({path:"/config"})).data,dropConfig:async()=>{await u({method:"DELETE",path:"/config/delete/all"})},saveConfig:async t=>{await u({method:"POST",path:"/config",payload:t})},hooks:async({observable:{name:t,type:e}})=>(await u({path:"/hooks/by/observable",params:{name:t,type:e}})).data,hooksTemplates:async t=>(await u({path:"/hooks/templates",params:{type:t}})).data,createHook:async({observable:{name:t,type:e},hook:n})=>{await u({path:"/hooks",method:"POST",payload:{observable:{name:t,type:e},hook:n}})},updateHook:async({observable:{name:t,type:e},hook:n})=>{await u({path:"/hooks",method:"PUT",payload:{observable:{name:t,type:e},hook:n}})},deleteHook:async({observable:{name:t,type:e},id:n})=>{await u({path:"/hooks",method:"DELETE",params:{name:t,type:e,id:n}})},features:async()=>(await u({path:"/features"})).data,metrics:async()=>(await u({path:"/metrics"})).data};function $(t){if(!t||!Object.keys(t))return"";const e=Object.entries(t).map(([n,i])=>`${n}=${i}`);return e.length>0?"?"+e.join("&"):""}function u({method:t="GET",path:e,payload:n,params:i}){let s=new XMLHttpRequest;s.open(t,`http://${C}${e[0]!="/"?"/":""}${e}${$(i)}`,!0),s.setRequestHeader("Accept","application/json"),n&&s.setRequestHeader("Content-Type","application/json");let o;const a=new Promise(c=>o=c);return s.onloadend=()=>{let c;try{c=s.response?JSON.parse(s.response):null}catch(l){console.log(l)}o({data:c,status:s.status})},s.send(n?JSON.stringify(n):null),a}let j=0;const B=5e3,f={INFO:"info",SUCCESS:"success",WARNING:"warning",ERROR:"error"};function O(t){const e=document.getElementById(t);e&&e.remove()}function N(t){switch(t){case f.ERROR:return"rgb(171, 12, 12)";case f.SUCCESS:return"rgb(2, 147, 74)";case f.WARNING:return"rgb(147, 106, 2)";default:return"rgb(0, 112, 122)"}}function y({type:t=f.INFO,caption:e,description:n=""}){const i=document.createElement("div");i.classList.add("toast");const s="toast-"+j++;i.id=s,i.style.backgroundColor=N(t);const o=document.createElement("h2");o.id=s+"-caption",o.innerHTML=e;const a=document.createElement("div");a.id=s+"-description",a.style.overflowWrap="break-word",a.innerHTML=n;const c=document.createElement("button");c.id=s+"-close",c.innerHTML="X",c.onclick=()=>O(s),i.append(o,a,c),document.getElementById("toasts-list").appendChild(i),setTimeout(()=>O(s),B)}const d={info:({caption:t,description:e})=>y({caption:t,description:e}),error:({caption:t,description:e})=>y({type:f.ERROR,caption:t,description:e}),success:({caption:t,description:e})=>y({type:f.SUCCESS,caption:t,description:e}),warning:({caption:t,description:e})=>y({type:f.WARNING,caption:t,description:e})},x={name:"Information",title:"Device information",content:async()=>{const t=await h.info();if(!t){d.error({caption:b,description:"Failed to fetch system information"});return}document.title=`SmartThing ${t.name}(${t.type})`;const e=r.list();return e.append(r.input({id:"device-name",label:"Device name",value:t.name||"",slot:r.button({id:"save-device-name",label:"save",onClick:async()=>{const n=document.getElementById("device-name"),i=n.value;if(!i||i.length===0){n.classList.add("required"),d.error({caption:"Device name can't be empty!"});return}try{await h.saveName(i),d.success({caption:"Name updated",description:"New device name: "+i})}catch{d.error({caption:"Name update failed",description:"Failed to update device name"})}finally{n.classList.remove("required")}}})}),r.input({label:"Device type",value:t.type,disabled:!0}),r.input({label:"Firmware version",value:t.version,disabled:!0,type:"number"}),r.input({label:"Chip model",value:t.chip_model,disabled:!0}),r.input({label:"Chip revision",value:t.chip_revision,disabled:!0})),e}},R={name:"WiFi",title:"WiFi settings",content:async()=>{const{settings:t,modes:e}=await h.getWifi();if(!t){d.error({caption:b,description:"Failed to fetch WiFi settings"});return}const n=r.list();n.append(r.input({id:"ssid",label:"SSID",value:t.ss||""}),r.input({id:"password",label:"password",value:t.ps||""}),r.combobox({id:"mode",label:"mode",values:e,value:t.md}));const i=r.controlsHolder();i.appendChild(r.button({label:"Save and reconnect",onClick:async()=>{try{await h.saveWifi({ssid:document.getElementById("ssid").value||"",password:document.getElementById("password").value||"",mode:document.getElementById("mode").value||""}),d.success({caption:"WiFi settings updated"})}catch{d.error({caption:"Failed to update WiFi settings",description:"Check device logs for additional information"})}}}));const s=r.container();return s.append(n,i),s}},V={name:"Actions",title:"Actions list",content:async()=>{const t=await h.actions();if(!t)return r.title("No actions configured");const e=r.list();return Object.entries(t).forEach(([n,i])=>{e.appendChild(r.button({id:"action_"+n,label:i,labelElement:"h1",onClick:async()=>{try{await h.execAction(n),d.success({caption:"Done",description:`Action "${i}" performed successfully`})}catch{d.error({caption:"Action failed",description:`Failed to perform action "${i}"`})}}}))}),e}};function L(t){return typeof t!="string"||t.length==0?"":t.split("").reduce((e,n)=>(n==="_"?e+=" ":n===n.toUpperCase()?e+=" "+n.toLowerCase():e+=n,e),"")}const W=["id","type","readonly"];function P(t){return W.includes(t)}class _{constructor({id:e="",hook:n,template:i,observable:s,parent:o}){this.id=e,this.hook=n,this.template=i,this.observable=s,this.parent=o,this.fields=Object.entries(this.hook).filter(([a,c])=>!P(a)).reverse(),this.controls={delete:r.icon({icon:v.trash,onClick:()=>this.delete()}),edit:r.icon({icon:v.pencil,onClick:()=>this.edit()}),cancel:r.icon({icon:v.cross,onClick:()=>this.cancel(),visible:!1}),save:r.icon({icon:v.save,onClick:()=>this.save(),visible:!1})}}create(){const e=document.getElementById(this.id);if(this.id&&e)return e;const n=r.container();n.id=this.id;const i=document.createElement("div");i.classList.add("hook-header");const{id:s,caption:o,type:a}=this.hook,c=r.title(`[${s}] ${o||L(a)}`,"h2");c.classList.add("hook-title");const l=document.createElement("div");l.classList.add("hook-view-controls"),Object.values(this.controls).forEach(p=>l.appendChild(p)),i.append(c,l);const m=r.list();return this.fields.forEach(([p,g])=>{const{required:w}=this.template[p]||!1,H={id:`cb_${s}_${p}`,label:L(p),value:g,disabled:!0,props:{required:w}};let E;this.template[p]&&this.template[p].values?E=r.combobox({...H,values:this.template[p].values}):E=r.input(H),m.appendChild(E)}),n.append(i,m),n}edit(e=!0){this.fields.forEach(([n,i])=>{document.getElementById(`cb_${this.hook.id}_${n}`).disabled=!e}),e?(this.controls.cancel.style.display="",this.controls.save.style.display="",this.controls.delete.style.display="none",this.controls.edit.style.display="none"):(this.controls.cancel.style.display="none",this.controls.save.style.display="none",this.controls.delete.style.display="",this.controls.edit.style.display="")}validate(){let e=!0;return this.fields.forEach(([n,i])=>{const s=document.getElementById(`cb_${this.hook.id}_${n}`);s.getAttribute("required")=="true"&&!s.value&&(e=!1,s.classList.add("required"))}),e}async save(){if(this.validate()){this.fields.forEach(([e,n])=>{this.hook[e]=document.getElementById(`cb_${this.hook.id}_${e}`).value});try{this.hook.id==="New"?(delete this.hook.id,await h.createHook({observable:this.observable,hook:this.hook})):await h.updateHook({observable:this.observable,hook:this.hook}),d.success({caption:`Hook ${this.hook.id==="New"?"created":"updated"}!`}),document.getElementById(this.id).remove(),this.parent.update()}catch{d.error({caption:"Failed to save toast",description:"Check device logs for additional information"})}}}async delete(){if(confirm("Are you sure you wan to delete hook "+this.hook.id+"?"))try{await h.deleteHook({observable:this.observable,id:this.hook.id}),d.success({caption:"Hook deleted"}),this.parent.update()}catch{d.error({caption:"Failed to delete hook",description:"Check device logs for additional information"})}}cancel(){this.hook.id==="New"?(document.getElementById(this.id).remove(),this.parent.update()):this.edit(!1)}}class S{constructor({id:e="",observable:n}){this.id=e,this.observable=n}create(){const e=document.getElementById(this.id);if(this.id&&e)return e;const n=document.createElement("div");return n.id=this.id,this.comboboxTemplates=r.combobox({values:[],label:"Add hook of type",onChange:i=>{this.addNewHook(i)}}),this.list=r.list(),this.list.id="cb_list_"+this.id,this.list.classList.add("hooks-list-view"),n.append(this.comboboxTemplates,this.list),this.firstLoad(),n}update(){this.loadHooks()}async firstLoad(){await this.loadTemplates(),this.loadHooks()}async loadTemplates(){this.templates=await h.hooksTemplates(this.observable.type),this.templates&&A(this.comboboxTemplates,Object.keys(this.templates).filter(e=>e!=="default").reduce((e,n)=>(e[n]=L(n),e),{}))}async loadHooks(){if(this.list.innerHTML="",this.hooks=await h.hooks({observable:this.observable}),!this.hooks||this.hooks.length===0){this.list.appendChild(r.title("No hooks added yet","h3"));return}this.hooks.forEach(e=>this.list.appendChild(new _({id:"cb_"+e.id,hook:e,template:{...this.templates[e.type],...this.templates.default},observable:this.observable,parent:this}).create()))}addNewHook(e){const n=document.getElementById("cb_new");if(n&&n.remove(),!e)return;const i={...this.templates[e],...this.templates.default},s=Object.entries(i).reduce((a,[c,l])=>(a[c]=l.default||"",a),{id:"New",type:e}),o=new _({id:"cb_new",hook:s,template:i,observable:this.observable,parent:this});this.list.prepend(o.create()),o.edit()}}const q={name:"Sensors",title:"Sensors values",content:async()=>{const t=await h.sensors();if(!t||Object.keys(t).length===0)return r.title("No sensors configured","h2");const e=Object.entries(t).reduce((i,[s,{value:o,type:a}])=>(i["sensors-menu-"+s]={name:`${s} (${a}): ${o}`,title:"Hooks",content:async()=>{var c,l;return((c=window.features)==null?void 0:c.hooks)===void 0||((l=window.features)==null?void 0:l.hooks)==!0?new S({id:"cb_view_"+s,observable:{type:"sensor",name:s}}).create():r.title("Hooks feature disabled in this build","h2")}},i),{}),n=new k("sensors-menu",e).create();return n.classList.add("bt"),n}},U={name:"States",title:"Device states values",content:async()=>{const t=await h.states();if(!t||Object.keys(t).length===0)return r.title("No states configured","h2");const e=Object.entries(t).reduce((i,[s,o])=>(i["state-menu-"+s]={name:`${s}: ${o}`,title:"Hooks",content:async()=>{var a,c;return((a=window.features)==null?void 0:a.hooks)===void 0||((c=window.features)==null?void 0:c.hooks)==!0?new S({id:"cb_view_"+s,observable:{type:"state",name:s}}).create():r.title("Hooks feature disabled in this build","h2")}},i),{}),n=new k("states-menu",e).create();return n.classList.add("bt"),n}},Z={name:"Configuration",title:"Configuration values",content:async()=>{const t=await h.configInfo();if(!t){d.error({caption:b,description:"Failed to fetch configuration information"});return}if(Object.keys(t).length===0)return r.title("No config entries","h2");const e=await h.config();if(!e){d.error({caption:b,description:"Failed to fetch configuration values"});return}const n=r.list();Object.entries(t).forEach(([o,{caption:a,type:c}])=>{n.appendChild(r.input({id:o,label:a,type:c,value:e[o]||""}))});const i=r.controlsHolder();i.append(r.button({id:"config-delete",label:"Delete all values",danger:!0,onClick:async()=>{if(confirm("Are you sure you want to delete all configuration values?"))try{await h.dropConfig(),d.success({caption:"All values removed"})}catch{d.error({caption:"Failed to delete configuration values"})}}}),r.button({id:"config-save",label:"Save",onClick:async()=>{const o={};Object.keys(t).forEach(a=>o[a]=document.getElementById(a).value);try{await h.saveConfig(o),d.success({caption:"Configuration updated"})}catch{d.error({caption:"Failed to save configuration values"})}}}));const s=r.container();return s.append(n,i),s}},G={name:"Metrics",title:"Device metrics",content:async()=>{try{return r.tree(await h.metrics())}catch(t){console.log(t),d.error({caption:b,description:"Failed to fetch device metrics"})}}},J={info:x,wifi:R,actions:V,sensors:q,states:U,configuration:Z,metrics:G};window.onload=async()=>{const t=await h.features().catch(n=>{console.log("Failed to load features",n),d.error({caption:"Failed to load device features"})})??{},e=new k("menu-main",Object.entries(J).reduce((n,[i,s])=>((t[i]===void 0||t[i]===!0)&&(n[i]=s),n),{}));window.features=t,document.getElementById("control-panel").appendChild(e.create()),e.open("info")};
