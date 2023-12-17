var N=Object.defineProperty;var F=(t,e,s)=>e in t?N(t,e,{enumerable:!0,configurable:!0,writable:!0,value:s}):t[e]=s;var T=(t,e,s)=>(F(t,typeof e!="symbol"?e+"":e,s),s);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))n(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function s(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(a){if(a.ep)return;a.ep=!0;const i=s(a);fetch(a.href,i)}})();const{host:M}=window.location,p={getSystemInfo:async()=>{try{const{data:t}=await u({path:"/info/system"});return t||{}}catch(t){console.error(t)}},getActions:async()=>{try{const{data:t}=await u({path:"/info/actions"});return t||{}}catch(t){console.error(t)}},getConfigInfo:async()=>{try{const{data:t}=await u({path:"/info/config"});return t||{}}catch(t){console.error(t)}},getWifiSettings:async()=>{try{const{data:t}=await u({path:"/wifi"});return t}catch(t){console.error(t)}},saveWifiSettings:async({ssid:t,password:e,mode:s})=>{try{const{status:n}=await u({path:"/wifi",method:"POST",payload:{ssid:t,password:e,mode:s}});return n===200}catch(n){console.error(n)}},saveName:async t=>{try{const{status:e}=await u({path:"/info/system",method:"PUT",payload:{name:t}});return e===200}catch(e){console.error(e)}},performAction:async t=>{try{const{status:e}=await u({method:"PUT",path:"/actions",params:{action:t}});return e===200}catch(e){console.error(e)}},getSensors:async()=>{try{const{data:t}=await u({path:"/sensors"});return t||{}}catch(t){console.error(t)}},getStates:async()=>{try{const{data:t}=await u({path:"/states"});return t||{}}catch(t){console.error(t)}},getConfigValues:async()=>{try{const{data:t}=await u({path:"/config"});return t||{}}catch(t){console.error(t)}},deleteAllConfigValues:async()=>{try{const{status:t}=await u({method:"DELETE",path:"/config/delete/all"});return t===200}catch(t){console.error(t)}},saveConfigValues:async t=>{try{const{status:e}=await u({method:"POST",path:"/config",payload:t});return e===200}catch(e){console.error(e)}},getCallbacks:async({observable:{name:t,type:e}})=>{try{const{data:s}=await u({path:"/callback/by/observable",params:{name:t,type:e}});return s||[]}catch(s){console.error(s)}},getCallbacksTemplates:async()=>{try{const{data:t}=await u({path:"/callback/template"});return t||[]}catch(t){console.error(t)}},createCallback:async({observable:{name:t,type:e},callback:s})=>{try{const{status:n}=await u({path:"/callback",method:"POST",payload:{observable:{name:t,type:e},callback:s}});return n===201}catch(n){console.error(n)}},updateCallback:async({observable:{name:t,type:e},callback:s})=>{try{const{status:n}=await u({path:"/callback",method:"PUT",payload:{observable:{name:t,type:e},callback:s}});return n===200}catch(n){console.error(n)}},deleteCallback:async({observable:{name:t,type:e},id:s})=>{try{const{status:n}=await u({path:"/callback",method:"DELETE",params:{name:t,type:e,id:s}});return n===200}catch(n){console.error(n)}},getMetrics:async()=>{try{const{data:t}=await u({path:"/metrics"});return t||{}}catch(t){console.error(t)}}};function $(t){if(!t||!Object.keys(t))return"";const e=Object.entries(t).map(([s,n])=>`${s}=${n}`);return e.length>0?"?"+e.join("&"):""}function u({method:t="GET",path:e,payload:s,params:n}){let a=new XMLHttpRequest;a.open(t,`http://${M}${e[0]!="/"?"/":""}${e}${$(n)}`),a.setRequestHeader("Accept","application/json"),s&&a.setRequestHeader("Content-Type","application/json");let i;const o=new Promise(c=>i=c);return a.onreadystatechange=()=>{a.readyState===4&&i({data:a.response?JSON.parse(a.response):null,status:a.status})},a.send(s?JSON.stringify(s):null),o}const r={container:({bordered:t=!1})=>{const e=document.createElement("div");return t&&e.classList.add("bordered"),e},list:()=>{const t=document.createElement("div");return t.classList.add("list"),t},button:({id:t,label:e,labelElement:s="h3",onClick:n=()=>{},danger:a=!1,visible:i=!0})=>{const o=document.createElement("button");return t&&(o.id=t),o.classList.add("btn"),o.innerHTML=`<${s}>${e}</${s}>`,o.onclick=n,a&&(o.style.backgroundColor="var(--color-danger)"),i||(o.style.display="None"),o},icon:({id:t,icon:e,onClick:s=()=>{},visible:n=!0})=>{const a=document.createElement("span");return t&&(a.id=t),a.ariaHidden=!0,a.role="img",a.innerHTML=e,n||(a.style.display="None"),a.style.cursor="pointer",a.onclick=s,a},input:({id:t,label:e,value:s,disabled:n=!1,type:a="text",slot:i,props:o={}})=>{const c=document.createElement("div");c.classList.add("legit","field-container");const d=document.createElement("h2");d.classList.add("field-label"),d.innerHTML=e;const m=document.createElement("div");m.classList.add("input-with-slot");const h=document.createElement("input");return t&&(h.id=t),h.disabled=n,h.value=s,h.type=a,Object.entries(o).forEach(([g,w])=>h.setAttribute(g,w)),m.appendChild(h),i&&m.appendChild(i),c.append(d,m),c},combobox:({id:t,value:e,values:s,label:n,disabled:a=!1,onChange:i,props:o={}})=>{const c=document.createElement("div");if(c.classList.add("field-container"),n){const m=document.createElement("h2");m.classList.add("field-label"),m.innerHTML=n,c.appendChild(m)}const d=document.createElement("select");return t&&(d.id=t),d.disabled=a,d.appendChild(document.createElement("option")),i&&(d.onchange=()=>i(d.value)),Object.entries(o).forEach(([m,h])=>d.setAttribute(m,h)),c.append(d),I(c,s),e&&(d.value=e),c},tree:t=>{const e=document.createElement("ul");return Object.entries(t).forEach(([s,n])=>e.appendChild(O({key:s,value:n}))),e},controlsHolder:()=>{const t=document.createElement("div");return t.classList.add("controls-holder"),t}},v={pencil:'<svg fill="currentColor" class="material-design-icon__svg" width="35" height="35" viewBox="0 0 24 24"><path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"><!----></path></svg>',trash:'<svg fill="currentColor" class="material-design-icon__svg" width="35" height="35" viewBox="0 0 24 24"><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"><!----></path></svg>',cross:'<svg fill="currentColor" class="material-design-icon__svg" width="35" height="35" viewBox="0 0 24 24"><path d="M13.46,12L19,17.54V19H17.54L12,13.46L6.46,19H5V17.54L10.54,12L5,6.46V5H6.46L12,10.54L17.54,5H19V6.46L13.46,12Z"><!----></path></svg>',save:'<svg fill="currentColor" class="material-design-icon__svg" width="35" height="35" viewBox="0 0 24 24"><path d="M15,9H5V5H15M12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3Z"><!----></path></svg>'};function I(t,e){if(!e)return;const s=t.getElementsByTagName("select")[0];if(!s){console.error("Can't find select in combobox");return}let n;Array.isArray(e)?n=e.map(a=>({key:a,caption:a})):n=Object.entries(e).map(([a,i])=>({key:a,caption:i})),n.forEach(({key:a,caption:i})=>{const o=document.createElement("option");o.value=a,o.innerHTML=i,s.appendChild(o)})}const O=({key:t,value:e})=>{const s=document.createElement("li");return s.append(t+": ",D(e)),s},D=t=>{if(Array.isArray(t)){const e=document.createElement("ul");return t.forEach(s=>{const n=document.createElement("li");n.innerHTML=s,e.appendChild(n)}),e}else if(t instanceof Object){const e=document.createElement("ul");return Object.entries(t).forEach(([s,n])=>{const a=document.createElement("li");a.appendChild(O({key:s,value:n})),e.appendChild(a)}),e}else{const e=document.createElement("span");return e.innerHTML=t,e}};let B=0;const V=5e3,f={INFO:"info",SUCCESS:"success",WARNING:"warning",ERROR:"error"};function _(t){const e=document.getElementById(t);e&&e.remove()}function j(t){switch(t){case f.ERROR:return"rgb(171, 12, 12)";case f.SUCCESS:return"rgb(2, 147, 74)";case f.WARNING:return"rgb(147, 106, 2)";default:return"rgb(0, 112, 122)"}}function y({type:t=f.INFO,caption:e,description:s=""}){const n=document.createElement("div");n.classList.add("toast");const a=B++;n.id=a,n.style.backgroundColor=j(t);const i=document.createElement("h2");i.innerHTML=e;const o=document.createElement("div");o.style.overflowWrap="break-word",o.innerHTML=s;const c=document.createElement("button");c.innerHTML="X",c.onclick=()=>_(a),n.append(i,o,c),console.log(n),document.getElementById("toasts-list").appendChild(n),setTimeout(()=>_(a),V)}const l={info:({caption:t,description:e})=>y({caption:t,description:e}),error:({caption:t,description:e})=>y({type:f.ERROR,caption:t,description:e}),success:({caption:t,description:e})=>y({type:f.SUCCESS,caption:t,description:e}),warning:({caption:t,description:e})=>y({type:f.WARNING,caption:t,description:e})};function E(t){return typeof t!="string"||t.length==0?"":t.split("").reduce((e,s)=>(s==="_"?e+=" ":s===s.toUpperCase()?e+=" "+s.toLowerCase():e+=s,e),"")}const x=["id","type","readonly"];function R(t){return x.includes(t)}class S{constructor({id:e="",callback:s,template:n,observable:a,parent:i}){this.id=e,this.callback=s,this.template=n,this.observable=a,this.parent=i,this.fields=Object.entries(this.callback).filter(([o,c])=>!R(o)).reverse(),this.controls={delete:r.icon({icon:v.trash,onClick:()=>this.delete()}),edit:r.icon({icon:v.pencil,onClick:()=>this.edit()}),cancel:r.icon({icon:v.cross,onClick:()=>this.cancel(),visible:!1}),save:r.icon({icon:v.save,onClick:()=>this.save(),visible:!1})}}create(){const e=document.getElementById(this.id);if(this.id&&e)return e;const s=r.container({bordered:!0});s.id=this.id;const n=document.createElement("div");n.classList.add("callback-header");const a=document.createElement("h3"),{id:i,caption:o,type:c}=this.callback;a.innerHTML=`[${i}] ${o||E(c)}`,a.classList.add("title","callback-title");const d=document.createElement("div");d.classList.add("callback-view-controls"),Object.values(this.controls).forEach(h=>d.appendChild(h)),n.append(a,d);const m=r.list();return this.fields.forEach(([h,g])=>{const{required:w}=this.template[h]||!1,L={id:`cb_${i}_${h}`,label:E(h),value:g,disabled:!0,props:{required:w}};let C;this.template[h]&&this.template[h].values?C=r.combobox({...L,values:this.template[h].values}):C=r.input(L),m.appendChild(C)}),s.append(n,m),s}edit(e=!0){this.fields.forEach(([s,n])=>{document.getElementById(`cb_${this.callback.id}_${s}`).disabled=!e}),e?(this.controls.cancel.style.display="",this.controls.save.style.display="",this.controls.delete.style.display="None",this.controls.edit.style.display="None"):(this.controls.cancel.style.display="None",this.controls.save.style.display="None",this.controls.delete.style.display="",this.controls.edit.style.display="")}validate(){let e=!0;return this.fields.forEach(([s,n])=>{const a=document.getElementById(`cb_${this.callback.id}_${s}`);a.getAttribute("required")=="true"&&!a.value&&(e=!1,a.classList.add("required"))}),e}async save(){if(!this.validate())return;this.fields.forEach(([s,n])=>{this.callback[s]=document.getElementById(`cb_${this.callback.id}_${s}`).value});let e;this.callback.id==="New"?e=await p.createCallback({observable:this.observable,callback:this.callback}):e=await p.updateCallback({observable:this.observable,callback:this.callback}),e?(l.success({caption:`Callback ${this.callback.id==="New"?"created":"updated"}!`}),document.getElementById(this.id).remove(),this.parent.update()):l.error({caption:"Failed to save toast",description:"Check device logs for additional information"})}async delete(){confirm("Are you sure you wan to delete callback "+this.callback.id+"?")&&(await p.deleteCallback({observable:this.observable,id:this.callback.id})?(l.success({caption:"Callback deleted"}),this.parent.update()):l.error({caption:"Failed to delete callback",description:"Check device logs for additional information"}))}cancel(){this.callback.id==="New"?(document.getElementById(this.id).remove(),this.parent.update()):this.edit(!1)}}class H{constructor({id:e="",observable:s}){this.id=e,this.observable=s}create(){const e=document.getElementById(this.id);if(this.id&&e)return e;const s=document.createElement("div");return s.id=this.id,this.comboboxTemplates=r.combobox({values:[],label:"Add callback of type",onChange:n=>{this.addNewCallback(n)}}),this.list=r.list(),this.list.id="cb_list_"+this.id,this.list.classList.add("callbacks-list-view"),s.append(this.comboboxTemplates,this.list),this.firstLoad(),s}update(){this.loadCallbacks()}async firstLoad(){await this.loadTemplates(),this.loadCallbacks()}async loadTemplates(){if(this.templates=await p.getCallbacksTemplates(),!this.templates){l.error({caption:"Something gone wrong",description:"Failed to fetch callbacks templates"});return}I(this.comboboxTemplates,Object.keys(this.templates).filter(e=>e!=="default").reduce((e,s)=>(e[s]=E(s),e),{}))}async loadCallbacks(){if(this.templates){if(this.list.innerHTML="",this.callbacks=void 0,this.callbacks=await p.getCallbacks({observable:this.observable}),!this.callbacks){l.error({caption:"Something gone wrong",description:`Failed to fetch callbacks for [${this.observable.type}]${this.observable.name}`});return}if(!this.callbacks||this.callbacks.length===0){this.list.innerHTML="<h3 class='title'>No callbacks added yet</h3>";return}this.callbacks.forEach(e=>this.list.appendChild(new S({id:"cb_"+e.id,callback:e,template:this.templates[e.type],observable:this.observable,parent:this}).create()))}}addNewCallback(e){const s=document.getElementById("cb_new");if(s&&s.remove(),!e)return;const n={...this.templates[e],...this.templates.default},a=Object.entries(n).reduce((o,[c,d])=>(o[c]=d.default||"",o),{id:"New",type:e}),i=new S({id:"cb_new",callback:a,template:n,observable:this.observable,parent:this});this.list.prepend(i.create()),i.edit()}}const b="Something gone wrong";class k{constructor(e,s){T(this,"selectedTab",{});this.id=e,this.tabs=s}create(){const e=document.createElement("div");return e.classList.add("tabs-panel"),this.viewDiv=document.createElement("div"),this.viewDiv.classList.add("tabs-items","list"),this.viewDiv.id=this.id,Object.entries(this.tabs).forEach(([s,{name:n}])=>{const a=document.createElement("h2");a.id=s,a.innerHTML=n,a.onclick=()=>this.open(s),this.viewDiv.appendChild(a)}),this.contentDiv=document.createElement("div"),this.contentDiv.classList.add("tabs-content"),this.contentDiv.id=this.id+"_content",e.append(this.viewDiv,this.contentDiv),e}open(e){const s=document.getElementById(e);if(!s){console.error("Failed to open tab id="+e+": element not found");return}this.selectedTab.tab&&(this.selectedTab.tab.classList.remove("selected-tab"),this.selectedTab.content.style.display="None");let n=document.getElementById(e+"_content");n||(n=this.createTabContent(e),this.contentDiv.appendChild(n)),s.classList.add("selected-tab"),n.style.display="",this.selectedTab.tab=s,this.selectedTab.content=n}createTabContent(e){const s=e+"_content",n=document.createElement("div");if(n.id=s,n.classList.add("tab-content"),n.style.display="None",this.tabs[e].title){const a=document.createElement("h1");a.classList.add("title"),a.innerHTML=this.tabs[e].title,n.appendChild(a)}return this.loadContent(n,e),n}async loadContent(e,s){try{e.appendChild(await this.tabs[s].content())}catch(n){console.error(n)}}}const W={info:{name:"Information",title:"Device information",content:async()=>{const t=await p.getSystemInfo();if(!t){l.error({caption:b,description:"Failed to fetch system information"});return}const e=r.list();return e.append(r.input({id:"name",label:"Device name",value:t.name||"",slot:r.button({label:"save",onClick:async()=>{const s=document.getElementById("name"),n=s.value;if(!n||n.length===0){s.classList.add("required"),l.error({caption:"Device name can't be empty!"});return}const a=await p.saveName(n);s.classList.remove("required"),a?l.success({caption:"Name updated",description:"New device name: "+n}):l.error({caption:"Name update failed",description:"Failed to update device name"})}})}),r.input({label:"Device type",value:t.type,disabled:!0}),r.input({label:"Firmware version",value:t.version,disabled:!0,type:"number"}),r.input({label:"Chip model",value:t.chip_model,disabled:!0}),r.input({label:"Chip revision",value:t.chip_revision,disabled:!0})),e}},wifi:{name:"WiFi",title:"WiFi settings",content:async()=>{const{settings:t,modes:e}=await p.getWifiSettings();if(!t){l.error({caption:b,description:"Failed to fetch WiFi settings"});return}const s=r.list();s.append(r.input({id:"ssid",label:"SSID",value:t.ss||""}),r.input({id:"password",label:"password",value:t.ps||""}),r.combobox({id:"mode",label:"mode",values:e,value:t.md}));const n=r.controlsHolder();n.appendChild(r.button({label:"Save and reconnect",onClick:async()=>{await p.saveWifiSettings({ssid:document.getElementById("ssid").value||"",password:document.getElementById("password").value||"",mode:document.getElementById("mode").value||""})?l.success({caption:"WiFi settings updated"}):l.error({caption:"Failed to update WiFi settings",description:"Check device logs for additional information"})}}));const a=document.createElement("div");return a.append(s,n),a}},actions:{name:"Actions",title:"Device actions",content:async()=>{const t=await p.getActions();if(!t){l.error({caption:b,description:"Failed to fetch device actions"});return}const e=r.list();return Object.entries(t).forEach(([s,n])=>{e.appendChild(r.button({id:"action_"+s,label:n,labelElement:"h1",onClick:async()=>{await p.performAction(s)?l.success({caption:"Done",description:`Action "${n}" performed successfully"`}):l.error({caption:"Action failed",description:`Failed to perform action "${n}"`})}}))}),e}},sensors:{name:"Sensors",title:"Sensors values",content:async()=>{const t=await p.getSensors();if(!t){l.error({caption:b,description:"Failed to fetch sensors"});return}const e=Object.entries(t).reduce((n,[a,{value:i,type:o}])=>(n["sensors_tab_"+a]={name:`${a} (${o}): ${i}`,title:"Callbacks",content:async()=>new H({id:"cb_view_"+a,observable:{type:"sensor",name:a}}).create()},n),{});return new k("sensors",e).create()}},states:{name:"States",title:"Device states",content:async()=>{const t=await p.getStates();if(!t){l.error({caption:b,description:"Failed to fetch device states"});return}const e=Object.entries(t).reduce((n,[a,i])=>(n["state_tab_"+a]={name:`${a}: ${i}`,title:"Callbacks",content:async()=>new H({id:"cb_view_"+a,observable:{type:"state",name:a}}).create()},n),{});return new k("states",e).create()}},configuration:{name:"Configuration",title:"Configuration",content:async()=>{const t=await p.getConfigInfo();if(!t){l.error({caption:b,description:"Failed to fetch configuration information"});return}const e=await p.getConfigValues();if(!e){l.error({caption:b,description:"Failed to fetch configuration values"});return}const s=r.list();Object.entries(t).forEach(([i,{caption:o,type:c}])=>{s.appendChild(r.input({id:i,label:o,type:c,value:e[i]||""}))});const n=r.controlsHolder();n.append(r.button({label:"Delete all values",danger:!0,labelElement:"h2",onClick:()=>{confirm("Are you sure you want to delete all configuration values?")&&p.deleteAllConfigValues()}}),r.button({label:"Save",labelElement:"h2",onClick:()=>p.saveConfigValues()}));const a=document.createElement("div");return a.append(s,n),a}},metrics:{name:"Metrics",title:"Device metrics",content:async()=>{const t=await p.getMetrics();if(!t){l.error({caption:b,description:"Failed to fetch device metrics"});return}return r.tree(t)}}},A=new k("tabs-main",W);window.onload=()=>{document.getElementById("control-panel").appendChild(A.create()),A.open("info")};
