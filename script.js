/* CSP report-only (security audit 2026-10-02): OBSERVE ONLY, never blocks. Violations log to console. Tighten the policy from those logs before ever enforcing. */
(function(){try{
if(document.querySelector('meta[http-equiv="Content-Security-Policy-Report-Only"]'))return;
var m=document.createElement('meta');
m.setAttribute('http-equiv','Content-Security-Policy-Report-Only');
m.setAttribute('content',"default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: blob: https:; font-src 'self' data: https:; connect-src 'self' https:; frame-src 'self' https:; worker-src 'self' blob:; object-src 'none'; base-uri 'self'");
document.head.appendChild(m);
}catch(e){}})();
/* AdSense site verification (ca-pub-3578199654426674) — injected on every page via script.js */
(function(){try{var a=document.createElement('script');a.async=true;a.src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3578199654426674';a.setAttribute('crossorigin','anonymous');document.head.appendChild(a);}catch(e){}});
/* Google Analytics 4 (G-SH02J5Q7MB) — injected on every page via script.js */
(function(){try{window.dataLayer=window.dataLayer||[];window.gtag=function(){window.dataLayer.push(arguments);};var g=document.createElement('script');g.async=true;g.src='https://www.googletagmanager.com/gtag/js?id=G-SH02J5Q7MB';document.head.appendChild(g);window.gtag('js',new Date());window.gtag('config','G-SH02J5Q7MB');}catch(e){}})();
const _embedParamEarly=new URLSearchParams(window.location.search).get("embed");if(window.self!==window.top&&"1"!==_embedParamEarly)throw console.warn("NitroIDE detected it is running inside an iframe. Aborting to prevent infinite loop."),new Error("Recursive load blocked");const body=document.body;let htmlMonaco,cssMonaco,jsMonaco,isIdeInitialized=!1,isRestoringSnapshot=!1,cdnLinks=[],files={"index.html":'<div class="container">\n  <h1 class="bounce">NitroIDE 🚀</h1>\n  <p class="bounce">Type div>ul>li*3 and hit Tab to test Emmet!</p>\n</div>',"style.css":"body {\n  font-family: system-ui, sans-serif;\n  background: var(--bg, #000);\n  color: white;\n  display: grid;\n  place-items: center;\n  height: 100vh;\n  margin: 0;\n  transition: background 0.3s;\n}","script.js":'console.log("⚡ Workspace initialized.");\n\n// Write your JavaScript here...'};const urlParams=new URLSearchParams(window.location.search),targetEnv=urlParams.get("env"),isEmbedMode="1"===urlParams.get("embed");isEmbedMode&&(document.body&&document.body.classList.add("embed-mode"),injectEmbedModeCSS());const importGistId=(urlParams.get("gist")||"").trim(),importRawUrl=(urlParams.get("url")||"").trim(),importTemplateSlug=(urlParams.get("template")||"").trim(),externalImportRequested=Boolean(importGistId||importRawUrl||importTemplateSlug);let externalImportPromise=Promise.resolve();function ensureCoreFiles(e){const t=Object.assign({},e);return t["index.html"]||(t["index.html"]="\n"),t["style.css"]||(t["style.css"]="/* Imported workspace is missing style.css */\n"),t["script.js"]||(t["script.js"]="// Imported workspace is missing script.js\n"),t}async function fetchWithTimeout(e,t=12e3){const n=new AbortController,o=setTimeout(()=>n.abort(),t);try{return await fetch(e,{signal:n.signal})}finally{clearTimeout(o)}}async function fetchGistWorkspace(e){const t=await fetchWithTimeout("https://api.github.com/gists/"+encodeURIComponent(e));if(!t.ok)throw new Error("Gist request failed (HTTP "+t.status+")");const n=await t.json(),o=Object.values(n.files||{});if(!o.length)throw new Error("Gist contains no files");const s=o.find(e=>e.filename&&e.filename.toLowerCase().endsWith(".html"))||o[0];let a=s.content||"";if(s.truncated&&s.raw_url){const e=await fetchWithTimeout(s.raw_url);if(!e.ok)throw new Error("Could not download the gist file");a=await e.text()}if(!a)throw new Error("Gist file is empty");return{vfs:ensureCoreFiles({"index.html":a}),activeFiles:{html:"index.html",css:"style.css",js:"script.js"}}}async function fetchRawUrlWorkspace(e){let t;try{t=new URL(e)}catch(e){throw new Error("Invalid URL")}if("http:"!==t.protocol&&"https:"!==t.protocol)throw new Error("Only http(s) URLs are supported");const n=await fetchWithTimeout(t.toString());if(!n.ok)throw new Error("URL request failed (HTTP "+n.status+")");const o=await n.text();if(!o.trim())throw new Error("URL returned empty content");return{vfs:ensureCoreFiles({"index.html":o}),activeFiles:{html:"index.html",css:"style.css",js:"script.js"}}}async function fetchTemplateWorkspace(e){const t=window.location.pathname.includes("/blog/")||window.location.pathname.includes("/tools/")||window.location.pathname.includes("/landing/"),n=await fetchWithTimeout((t?"../":"")+"templates.json");if(!n.ok)throw new Error("Could not load templates.json (HTTP "+n.status+")");const o=await n.json(),s=(Array.isArray(o)?o:[]).find(t=>t&&t.slug===e);if(!s||!s.files)throw new Error('Template "'+e+'" not found');return{vfs:ensureCoreFiles(s.files),activeFiles:{html:"index.html",css:"style.css",js:"script.js"}}}function applyExternalImport(e){vfs=e.vfs,activeFiles=e.activeFiles,targetEnv&&(vfs=JSON.parse(JSON.stringify(defaultVfs)),activeFiles={html:"index.html",css:"style.css",js:"script.js"}),isIdeInitialized&&(htmlMonaco&&htmlMonaco.setValue(vfs[activeFiles.html]||""),cssMonaco&&cssMonaco.setValue(vfs[activeFiles.css]||""),jsMonaco&&jsMonaco.setValue(vfs[activeFiles.js]||""),renderVFS(),smartRun())}if(externalImportRequested){const e=importGistId?"gist":importRawUrl?"URL":"template";externalImportPromise=(async()=>{try{showToast("<i class='ph-bold ph-spinner-gap' style='margin-right:6px;'></i> Importing "+e+"...");const t=importGistId?await fetchGistWorkspace(importGistId):importRawUrl?await fetchRawUrlWorkspace(importRawUrl):await fetchTemplateWorkspace(importTemplateSlug);if(urlParams.get("code"))return;applyExternalImport(t),showToast("<i class='ph-bold ph-check-circle' style='color:var(--success); margin-right:6px;'></i> "+e.charAt(0).toUpperCase()+e.slice(1)+" loaded!")}catch(e){console.warn("NitroIDE external import failed:",e);try{showToast("<i class='ph-bold ph-warning-circle' style='margin-right:6px;'></i> Import failed - loaded default workspace.")}catch(e){}}})()}"react"===targetEnv?(cdnLinks=["https://unpkg.com/react@18/umd/react.development.js","https://unpkg.com/react-dom@18/umd/react-dom.development.js","https://unpkg.com/@babel/standalone/babel.min.js"],files["index.html"]='<div id="root"></div>',files["style.css"]="body {\n  font-family: system-ui, sans-serif;\n  background: var(--bg, #09090b);\n  color: white;\n  display: grid;\n  place-items: center;\n  height: 100vh;\n  margin: 0;\n}",files["script.js"]="// React and Babel are pre-injected via CDN!\n\nfunction App() {\n  const [count, setCount] = React.useState(0);\n  \n  return (\n    <div style={{ textAlign: 'center' }}>\n      <h1 style={{ marginBottom: '20px' }}>NitroIDE + React ⚛️</h1>\n      <button \n        onClick={() => setCount(count + 1)} \n        style={{ padding: '10px 20px', fontSize: '16px', background: '#00e5ff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', color: '#000' }}>\n        Count: {count}\n      </button>\n    </div>\n  );\n}\n\nconst root = ReactDOM.createRoot(document.getElementById('root'));\nroot.render(<App />);"):"tailwind"===targetEnv&&(cdnLinks=["/vendor/tailwindcss/play-cdn-3.4.17.min.js"],files["index.html"]='<div class="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">\n  <h1 class="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-4">\n    NitroIDE + Tailwind\n  </h1>\n  <p class="text-zinc-400 text-lg mb-8">Edit this code and see changes instantly.</p>\n  <button class="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors font-medium">\n    Utility Button\n  </button>\n</div>',files["style.css"]="/* Tailwind handles the styling! */\n\nbody {\n  margin: 0;\n}",files["script.js"]='console.log("⚡ Tailwind CDN Injected Successfully.");');let defaultVfs={"index.html":files["index.html"],"style.css":files["style.css"],"script.js":files["script.js"]},projects=JSON.parse(localStorage.getItem("nitro_projects"))||[],currentProjectId=localStorage.getItem("nitro_current_project_id");if(0===projects.length){let e=JSON.parse(localStorage.getItem("nitro_vfs")),t=JSON.parse(localStorage.getItem("nitro_active_files")),n={id:"proj_"+Date.now(),name:"Default Workspace",vfs:e||defaultVfs,activeFiles:t||{html:"index.html",css:"style.css",js:"script.js"},lastModified:Date.now()};projects.push(n),currentProjectId=n.id,localStorage.setItem("nitro_projects",JSON.stringify(projects)),localStorage.setItem("nitro_current_project_id",currentProjectId)}let currentProject=projects.find(e=>e.id===currentProjectId)||projects[0];currentProjectId=currentProject.id;let vfs=currentProject.vfs,activeFiles=currentProject.activeFiles;targetEnv&&(vfs=JSON.parse(JSON.stringify(defaultVfs)),activeFiles={html:"index.html",css:"style.css",js:"script.js"});const sharedCode=urlParams.get("code");if(sharedCode&&"undefined"!=typeof LZString)try{const e=LZString.decompressFromEncodedURIComponent(sharedCode),t=JSON.parse(e);t&&t.vfs&&(vfs=t.vfs,t.activeFiles&&(activeFiles=t.activeFiles),window.history.replaceState({},document.title,window.location.pathname))}catch(e){console.error("Failed to parse shared link.")}function toggleTheme(){document.documentElement.classList.toggle("light-mode");let e=document.documentElement.classList.contains("light-mode");if(localStorage.setItem("theme",e?"light":"dark"),document.querySelectorAll("#themeBtn, #themeBtnFloat").forEach(t=>{t.classList.contains("dropdown-item")?t.innerHTML=e?'<i class="ph-bold ph-moon"></i> Dark Mode':'<i class="ph-bold ph-sun"></i> Light Mode':t.innerHTML=e?'<i class="ph-bold ph-moon"></i>':'<i class="ph-bold ph-sun"></i>'}),"undefined"!=typeof monaco){let t=document.getElementById("editorTheme")?document.getElementById("editorTheme").value:"toolbox-dark";monaco.editor.setTheme(e?"vs":t)}}function showToast(e,s){const t=document.getElementById("toast");if(!t)return;t.innerHTML=e,t.classList.add("show"),setTimeout(()=>t.classList.remove("show"),s||2500)}function toggleOptions(){document.getElementById("optionsMenu").classList.toggle("active")}"light"===localStorage.getItem("theme")&&(document.documentElement.classList.add("light-mode"),document.querySelectorAll("#themeBtn, #themeBtnFloat").forEach(e=>{e.classList.contains("dropdown-item")?e.innerHTML='<i class="ph-bold ph-moon"></i> Dark Mode':e.innerHTML='<i class="ph-bold ph-moon"></i>'}));const workspacePrefsKey="nitro_workspace_prefs";let statusTimer,workspacePrefs={};try{workspacePrefs=JSON.parse(localStorage.getItem(workspacePrefsKey))||{}}catch(e){workspacePrefs={}}function saveWorkspacePrefs(e={}){document.getElementById("codebox")&&(workspacePrefs={...workspacePrefs,...e},localStorage.setItem(workspacePrefsKey,JSON.stringify(workspacePrefs)))}function resetWorkspacePrefs(){workspacePrefs={},localStorage.removeItem(workspacePrefsKey)}function getOutputTabButton(e){return Array.from(document.querySelectorAll(".out-tab")).find(t=>(t.getAttribute("onclick")||"").includes(`'${e}'`))}function setWorkspaceStatus(e,t="ready",n=!1){const o=document.getElementById("workspaceStatus"),s=document.getElementById("workspaceStatusText");o&&s&&(clearTimeout(statusTimer),o.dataset.state=t,s.textContent=e,n||"error"===t||(statusTimer=setTimeout(()=>{o.dataset.state="ready",s.textContent="Ready"},1800)))}function setDevice(e){const t=document.getElementById("liveIframe");t.className="","mobile"===e&&t.classList.add("mobile-view"),"tablet"===e&&t.classList.add("tablet-view"),saveWorkspacePrefs({device:e});const n=document.getElementById("optionsMenu");n&&n.classList.remove("active")}function triggerLayoutUpdate(){window.requestAnimationFrame(()=>{htmlMonaco&&htmlMonaco.layout(),cssMonaco&&cssMonaco.layout(),jsMonaco&&jsMonaco.layout()})}function togglePanel(e){const t=document.getElementById(e),n=[document.getElementById("htmlPanel"),document.getElementById("cssPanel"),document.getElementById("jsPanel")];let o=n.filter(e=>!e.classList.contains("collapsed"));t.classList.contains("collapsed")||1!==o.length?(t.classList.toggle("collapsed"),n.forEach(e=>{e.style.width="",e.style.flex=""}),saveWorkspacePrefs({collapsedPanels:n.filter(e=>e.classList.contains("collapsed")).map(e=>e.id)}),setTimeout(triggerLayoutUpdate,300)):showToast("<i class='ph-bold ph-warning-circle' style='margin-right:6px;'></i> Cannot close the last panel.")}function toggleSidebar(e="toggle"){const t=document.getElementById("fileSidebar"),n=document.getElementById("sidebarBackdrop");t&&(window.innerWidth<=768?"close"===e?(t.classList.remove("mobile-open"),n.classList.remove("active")):(t.classList.toggle("mobile-open"),n.classList.toggle("active")):("close"===e?t.classList.add("collapsed"):t.classList.toggle("collapsed"),saveWorkspacePrefs({sidebarCollapsed:t.classList.contains("collapsed")})),setTimeout(triggerLayoutUpdate,300))}function createNewFile(){let e=prompt("Enter filename (e.g., utils.js, theme.css, nav.html):");if(e){if(e.includes(".")||(e+=".js"),vfs[e])return showToast("<i class='ph-bold ph-warning-circle'></i> File already exists!");if(e.endsWith(".js"))vfs[e]="// New JavaScript module\n";else if(e.endsWith(".css"))vfs[e]="/* New CSS module */\n";else{if(!e.endsWith(".html"))return showToast("<i class='ph-bold ph-warning-circle'></i> Only .js, .css, and .html files supported.");vfs[e]="\n<div>\n  \n</div>\n"}renderVFS(),switchFile(e)}}function renameFile(e,t){e.stopPropagation();let n=prompt("Rename file:",t);if(n&&n!==t){if(n.includes(".")||(n+=t.substring(t.lastIndexOf("."))),vfs[n])return showToast("<i class='ph-bold ph-warning-circle'></i> Name already exists.");vfs[n]=vfs[t],delete vfs[t],activeFiles.js===t&&(activeFiles.js=n,document.getElementById("jsPanelPillText").innerText=n),activeFiles.css===t&&(activeFiles.css=n,document.getElementById("cssPanelPillText").innerText=n),activeFiles.html===t&&(activeFiles.html=n,document.getElementById("htmlPanelPillText").innerText=n),renderVFS(),smartRun()}}function deleteFile(e,t){e.stopPropagation(),confirm("Delete "+t+"?")&&(delete vfs[t],activeFiles.js===t?(activeFiles.js="script.js",void 0===vfs["script.js"]&&(vfs["script.js"]=""),jsMonaco.setValue(vfs["script.js"]),document.getElementById("jsPanelPillText").innerText="script.js"):activeFiles.css===t?(activeFiles.css="style.css",cssMonaco.setValue(vfs["style.css"]),document.getElementById("cssPanelPillText").innerText="style.css"):activeFiles.html===t&&(activeFiles.html="index.html",htmlMonaco.setValue(vfs["index.html"]),document.getElementById("htmlPanelPillText").innerText="index.html"),renderVFS(),smartRun())}function renderVFS(){const e=document.getElementById("vfsList"),t=document.getElementById("mobileTabs");let n="",o="";const s=(e,n,s,a=!1)=>{let i=activeFiles.html===e||activeFiles.js===e||activeFiles.css===e?"active":"",l=a?`<div class="file-actions"><span class="file-action-btn" title="Rename" onclick="renameFile(event, '${e}')"><i class="ph-bold ph-pencil-simple"></i></span><span class="file-action-btn del" title="Delete" onclick="deleteFile(event, '${e}')"><i class="ph-bold ph-trash"></i></span></div>`:"";return t&&(o+=`<button class="mob-tab ${i}" onclick="switchFile('${e}')"><i class="ph-fill ${s}" style="color:${n};"></i> ${e}</button>`),`<div class="file-item ${i}" onclick="switchFile('${e}')"><i class="ph-fill ${s}" style="color:${n};"></i> <span class="vfs-filename" title="${e}">${e}</span> ${l}</div>`};n+=s("index.html","#e34c26","ph-file-html"),n+=s("style.css","#264de4","ph-file-css"),n+=s("script.js","#f7df1e","ph-file-js");let a=Object.keys(vfs).length>3;a&&(n+='<div class="sidebar-header" style="margin-top: 15px; border-top: 1px solid var(--border); padding-top: 15px; display:flex; justify-content:space-between; align-items:center;"><span>MODULES</span><button class="btn btn-compact btn-outline" onclick="createNewFile()" style="border:none; padding:2px;" title="New File"><i class="ph-bold ph-plus"></i></button></div>',Object.keys(vfs).forEach(e=>{if(!["index.html","style.css","script.js"].includes(e)){let t=e.endsWith(".js")?"#f7df1e":e.endsWith(".css")?"#264de4":"#e34c26",o=e.endsWith(".js")?"ph-file-js":e.endsWith(".css")?"ph-file-css":"ph-file-html";n+=s(e,t,o,!0)}})),e&&(e.innerHTML=n),e&&!a&&(e.innerHTML+='<button class="btn btn-compact btn-outline" onclick="createNewFile()" style="width:100%; margin-top:15px; border-style:dashed;"><i class="ph-bold ph-plus"></i> Add Module</button>'),t&&(t.innerHTML=o)}function switchFile(e){e.endsWith(".js")?(vfs[activeFiles.js]=jsMonaco.getValue(),activeFiles.js=e,jsMonaco.setValue(vfs[e]),document.getElementById("jsPanelPillText").innerText=e,focusPanel("js")):e.endsWith(".css")?(vfs[activeFiles.css]=cssMonaco.getValue(),activeFiles.css=e,cssMonaco.setValue(vfs[e]),document.getElementById("cssPanelPillText").innerText=e,focusPanel("css")):e.endsWith(".html")&&(vfs[activeFiles.html]=htmlMonaco.getValue(),activeFiles.html=e,htmlMonaco.setValue(vfs[e]),document.getElementById("htmlPanelPillText").innerText=e,focusPanel("html")),renderVFS(),window.innerWidth<=768&&toggleSidebar("close")}function focusPanel(e){const t=e+"Panel",n=document.getElementById(t);window.innerWidth<=768?(document.querySelectorAll(".editor-panel").forEach(e=>{e.style.display="none",e.classList.remove("active-mobile")}),n.style.display="flex",n.classList.add("active-mobile")):(n&&n.classList.contains("collapsed")&&togglePanel(t),n.style.transition="box-shadow 0.2s ease",n.style.boxShadow="inset 0 0 0 1px var(--text-muted)",setTimeout(()=>n.style.boxShadow="none",300)),setTimeout(()=>{"html"===e&&htmlMonaco&&htmlMonaco.focus(),"css"===e&&cssMonaco&&cssMonaco.focus(),"js"===e&&jsMonaco&&jsMonaco.focus(),triggerLayoutUpdate()},100)}function toggleBottomPanel(){const e=document.getElementById("editorTopSplit"),t=document.getElementById("outputBottomSplit");"46px"===t.style.height?(e.style.height="60%",t.style.height="40%"):(e.style.height="calc(100% - 46px)",t.style.height="46px"),saveWorkspacePrefs({topHeight:e.style.height,bottomHeight:t.style.height}),setTimeout(triggerLayoutUpdate,300)}function initCustomResizers(){const e=e=>e.touches?e.touches[0].clientX:e.clientX,t=e=>e.touches?e.touches[0].clientY:e.clientY,n=document.querySelectorAll(".ide-resizer.horiz"),o=[document.getElementById("htmlPanel"),document.getElementById("cssPanel"),document.getElementById("jsPanel")],s=document.getElementById("editorTopSplit");n.forEach((t,n)=>{let a=o[n],i=o[n+1];function l(n){"touchstart"===n.type?document.body.style.overflow="hidden":n.preventDefault(),t.classList.add("active-drag"),document.body.classList.add("is-dragging");const l=document.getElementById("liveIframe");l&&(l.style.pointerEvents="none"),document.body.style.cursor="col-resize";let r=e(n),c=a.getBoundingClientRect().width,d=i.getBoundingClientRect().width,p=s.getBoundingClientRect().width;function m(t){let n=e(t)-r,o=c+n,s=d-n;o<80?(a.classList.add("collapsed"),a.style.flex="none",a.style.width="40px",i.style.flex=`0 0 ${(c+d-40)/p*100}%`):s<80?(i.classList.add("collapsed"),i.style.flex="none",i.style.width="40px",a.style.flex=`0 0 ${(c+d-40)/p*100}%`):(a.classList.remove("collapsed"),i.classList.remove("collapsed"),a.style.flex=`0 0 ${o/p*100}%`,i.style.flex=`0 0 ${s/p*100}%`)}function u(){document.body.style.overflow="",t.classList.remove("active-drag"),document.body.classList.remove("is-dragging"),l&&(l.style.pointerEvents="auto"),document.body.style.cursor="",window.removeEventListener("mousemove",m),window.removeEventListener("mouseup",u),window.removeEventListener("touchmove",m),window.removeEventListener("touchend",u),saveWorkspacePrefs({panelFlex:o.map(e=>({id:e.id,flex:e.style.flex,width:e.style.width,collapsed:e.classList.contains("collapsed")}))}),triggerLayoutUpdate()}window.addEventListener("mousemove",m),window.addEventListener("mouseup",u),window.addEventListener("touchmove",m,{passive:!1}),window.addEventListener("touchend",u)}t.addEventListener("mousedown",l),t.addEventListener("touchstart",l,{passive:!1})});const a=document.querySelector(".ide-resizer.vert"),i=document.getElementById("editorTopSplit"),l=document.getElementById("outputBottomSplit"),r=document.getElementById("ideMainSplit");if(a){function c(e){"touchstart"===e.type?document.body.style.overflow="hidden":e.preventDefault(),a.classList.add("active-drag"),document.body.classList.add("is-dragging");const n=document.getElementById("liveIframe");n&&(n.style.pointerEvents="none"),document.body.style.cursor="row-resize";let o=t(e),s=i.getBoundingClientRect().height,c=l.getBoundingClientRect().height,d=r.getBoundingClientRect().height;function p(e){let n=t(e)-o,a=s+n,r=c-n;a>60&&r>40&&(i.style.height=a/d*100+"%",l.style.height=r/d*100+"%")}function m(){document.body.style.overflow="",a.classList.remove("active-drag"),document.body.classList.remove("is-dragging"),n&&(n.style.pointerEvents="auto"),document.body.style.cursor="",window.removeEventListener("mousemove",p),window.removeEventListener("mouseup",m),window.removeEventListener("touchmove",p),window.removeEventListener("touchend",m),saveWorkspacePrefs({topHeight:i.style.height,bottomHeight:l.style.height}),triggerLayoutUpdate()}window.addEventListener("mousemove",p),window.addEventListener("mouseup",m),window.addEventListener("touchmove",p,{passive:!1}),window.addEventListener("touchend",m)}a.addEventListener("mousedown",c),a.addEventListener("touchstart",c,{passive:!1})}}document.addEventListener("click",e=>{const t=document.getElementById("optionsMenu"),n=document.getElementById("optionsBtn");t&&t.classList.contains("active")&&!t.contains(e.target)&&!n.contains(e.target)&&t.classList.remove("active")});let currentFontSize=parseInt(localStorage.getItem("nitro_font"))||14,isWordWrap=(()=>{try{return"1"===localStorage.getItem("nitroide_wordwrap")}catch(e){return!1}})();function toggleMinimap(){const e=document.getElementById("minimapToggle").checked,t={minimap:{enabled:e}};htmlMonaco&&htmlMonaco.updateOptions(t),cssMonaco&&cssMonaco.updateOptions(t),jsMonaco&&jsMonaco.updateOptions(t),showToast('<i class="ph-bold ph-map-trifold" style="margin-right:6px;"></i> Minimap '+(e?"ON":"OFF")),document.getElementById("optionsMenu").classList.remove("active")}function syncWordWrapMenu(){const b=document.getElementById("wordWrapBtn");b&&(b.innerHTML='<i class="ph-bold ph-text-align-justify"></i> Word Wrap: '+(isWordWrap?"ON":"OFF"))}function toggleWordWrap(){isWordWrap=!isWordWrap;const t={wordWrap:isWordWrap?"on":"off"};htmlMonaco&&htmlMonaco.updateOptions(t),cssMonaco&&cssMonaco.updateOptions(t),jsMonaco&&jsMonaco.updateOptions(t);try{localStorage.setItem("nitroide_wordwrap",isWordWrap?"1":"0")}catch(e){}showToast('<i class="ph-bold ph-text-align-justify" style="margin-right:6px;"></i> Word Wrap '+(isWordWrap?"ON":"OFF")),syncWordWrapMenu();const m=document.getElementById("optionsMenu");m&&m.classList.remove("active")}function changeFontSize(e){currentFontSize+=e,currentFontSize<8&&(currentFontSize=8),currentFontSize>32&&(currentFontSize=32),localStorage.setItem("nitro_font",currentFontSize);const t={fontSize:currentFontSize};htmlMonaco&&htmlMonaco.updateOptions(t),cssMonaco&&cssMonaco.updateOptions(t),jsMonaco&&jsMonaco.updateOptions(t),showToast(`<i class="ph-bold ph-text-aa" style="margin-right:6px;"></i> Font Size: ${currentFontSize}px`)}function toggleOutputTabs(){const e=document.querySelector(".output-tabs");"none"===e.style.display?e.style.display="flex":e.style.display="none",saveWorkspacePrefs({outputTabsHidden:"none"===e.style.display}),triggerLayoutUpdate()}async function formatCode(){htmlMonaco&&await htmlMonaco.getAction("editor.action.formatDocument").run(),cssMonaco&&await cssMonaco.getAction("editor.action.formatDocument").run(),jsMonaco&&await jsMonaco.getAction("editor.action.formatDocument").run(),smartRun(),showToast("<i class='ph-bold ph-magic-wand' style='margin-right:6px;'></i> Code Formatted!"),document.getElementById("optionsMenu").classList.remove("active")}function showMonacoLoadError(e){console.error("NitroIDE: Monaco editor failed to load.",e);["htmlWrap","cssWrap","jsWrap"].forEach(function(id){var w=document.getElementById(id);if(w&&!w.querySelector(".monaco-load-error")){var d=document.createElement("div");d.className="monaco-load-error";d.style.cssText="display:flex;align-items:center;justify-content:center;height:100%;min-height:220px;padding:24px;text-align:center;color:#e4e4e7;font-family:system-ui,sans-serif;";d.innerHTML='<div><div style="font-size:36px;margin-bottom:12px;">&#9888;&#65039;</div><div style="font-weight:600;margin-bottom:8px;">Editor failed to load</div><div style="font-size:14px;opacity:.75;">The code editor could not start.<br>Check your connection and <a href="#" onclick="location.reload();return false;" style="color:#22d3ee;">reload the page</a>.</div></div>';w.appendChild(d)}});try{document.body.classList.remove("workspace-booting")}catch(_){}}function initIDE(){if(isIdeInitialized)return;if(window.self!==window.top&&!isEmbedMode)return void console.warn("NitroIDE detected it is running inside an iframe. Aborting Monaco initialization.");if(window.self!==window.top&&isEmbedMode){document.body.classList.remove("workspace-booting");const e=document.getElementById("liveIframe");return void(e&&forceRun(collectHTML(),collectCSS(),collectJS(),e,{}))}initCustomResizers();const e=new ResizeObserver(()=>triggerLayoutUpdate());["htmlPanel","cssPanel","jsPanel","editorTopSplit","outputBottomSplit","codebox"].forEach(t=>{const n=document.getElementById(t);n&&e.observe(n)});const t=(()=>{const s=document.querySelector('script[src*="/vendor/monaco/vs/loader.js"]');return s?s.src.split("/vs/loader.js")[0]+"/":location.origin+"/vendor/monaco/"})();window.MonacoEnvironment={getWorkerUrl:function(e,n){const o=`\n\t\t\tself.MonacoEnvironment = { baseUrl: '${t}' };\n\t\t\timportScripts('${t}vs/base/worker/workerMain.js');\n\t\t  `;return URL.createObjectURL(new Blob([o],{type:"text/javascript"}))}};if("undefined"==typeof require){showMonacoLoadError(new Error("Monaco AMD loader failed to load"));return}require.config({paths:{vs:t+"vs"}}),require(["vs/editor/editor.main"],function(){monaco.editor.defineTheme("toolbox-dark",{base:"vs-dark",inherit:!0,rules:[{token:"comment",foreground:"8b949e",fontStyle:"italic"},{token:"keyword",foreground:"ff7b72"},{token:"string",foreground:"a5d6ff"},{token:"number",foreground:"79c0ff"},{token:"tag",foreground:"7ee787"},{token:"attribute.name",foreground:"d2a8ff"}],colors:{"editor.background":"#00000000","editorLineNumber.foreground":"#484f58","editorIndentGuide.background":"#21262d"}}),monaco.editor.defineTheme("cyberpunk",{base:"vs-dark",inherit:!0,rules:[{token:"comment",foreground:"00e5ff",fontStyle:"italic"},{token:"keyword",foreground:"ff003c",fontStyle:"bold"},{token:"string",foreground:"fcee0a"},{token:"tag",foreground:"ff003c"},{token:"attribute.name",foreground:"00e5ff"}],colors:{"editor.background":"#00000000","editorLineNumber.foreground":"#ff003c"}}),monaco.editor.defineTheme("tokyo-night",{base:"vs-dark",inherit:!0,rules:[{token:"comment",foreground:"565f89",fontStyle:"italic"},{token:"keyword",foreground:"bb9af7"},{token:"string",foreground:"9ece6a"},{token:"tag",foreground:"f7768e"},{token:"attribute.name",foreground:"7dcfff"}],colors:{"editor.background":"#00000000","editorLineNumber.foreground":"#565f89"}});const e={theme:document.documentElement.classList.contains("light-mode")?"vs":document.getElementById("editorTheme")?document.getElementById("editorTheme").value:"toolbox-dark",automaticLayout:!1,minimap:{enabled:!!document.getElementById("minimapToggle")&&document.getElementById("minimapToggle").checked},fontSize:currentFontSize,wordWrap:isWordWrap?"on":"off",fontFamily:"'JetBrains Mono', 'Fira Code', Consolas, monospace",tabSize:2,padding:{top:15},cursorSmoothCaretAnimation:"on",cursorBlinking:"smooth",smoothScrolling:!0,renderLineHighlight:"all"};htmlMonaco=monaco.editor.create(document.getElementById("htmlWrap"),{...e,language:"html",value:vfs["index.html"]}),cssMonaco=monaco.editor.create(document.getElementById("cssWrap"),{...e,language:"css",value:vfs["style.css"]}),jsMonaco=monaco.editor.create(document.getElementById("jsWrap"),{...e,language:"javascript",value:vfs["script.js"]}),isEmbedMode&&[htmlMonaco,cssMonaco,jsMonaco].forEach(e=>{e&&e.updateOptions({readOnly:!0})}),"undefined"!=typeof emmetMonaco&&(emmetMonaco.emmetHTML(monaco),emmetMonaco.emmetCSS(monaco)),htmlMonaco.onDidChangeModelContent(()=>queueUpdate("html")),cssMonaco.onDidChangeModelContent(()=>queueUpdate("css")),jsMonaco.onDidChangeModelContent(()=>queueUpdate("js")),isIdeInitialized=!0,triggerLayoutUpdate(),renderVFS(),applyWorkspacePrefs(),setTimeout(()=>document.body.classList.remove("workspace-booting"),250),smartRun()},function(e){showMonacoLoadError(e)})}function switchOutputTab(e,t){document.querySelectorAll(".out-tab").forEach(e=>e.classList.remove("active")),document.getElementById("outPreview").classList.remove("active"),document.getElementById("outConsole").classList.remove("active"),document.getElementById("outState").classList.remove("active"),t||(t=getOutputTabButton(e)),t&&t.classList.add("active"),"preview"===e&&document.getElementById("outPreview").classList.add("active"),"console"===e&&(document.getElementById("outConsole").classList.add("active"),document.getElementById("consoleBadge").style.display="none"),"state"===e&&document.getElementById("outState").classList.add("active"),saveWorkspacePrefs({outputTab:e});"46px"===document.getElementById("outputBottomSplit").style.height&&toggleBottomPanel()}function goToLine(e,t){if(!t||t<1)return;const n="jsEditor"===e?jsMonaco:"cssEditor"===e?cssMonaco:htmlMonaco;n&&(n.revealLineInCenter(t),n.setPosition({lineNumber:t,column:1}),n.focus())}function applyWorkspacePrefs(){if(!document.getElementById("codebox"))return;const e=document.getElementById("fileSidebar"),t=document.querySelector(".output-tabs"),n=document.getElementById("editorTopSplit"),o=document.getElementById("outputBottomSplit"),s=[document.getElementById("htmlPanel"),document.getElementById("cssPanel"),document.getElementById("jsPanel")];e&&!1===workspacePrefs.sidebarCollapsed&&window.innerWidth>768&&e.classList.remove("collapsed"),e&&!0===workspacePrefs.sidebarCollapsed&&window.innerWidth>768&&e.classList.add("collapsed"),t&&workspacePrefs.outputTabsHidden&&(t.style.display="none"),n&&workspacePrefs.topHeight&&(n.style.height=workspacePrefs.topHeight),o&&workspacePrefs.bottomHeight&&(o.style.height=workspacePrefs.bottomHeight),Array.isArray(workspacePrefs.panelFlex)?workspacePrefs.panelFlex.forEach(e=>{const t=document.getElementById(e.id);t&&(t.style.flex=e.flex||"",t.style.width=e.width||"",t.classList.toggle("collapsed",!!e.collapsed))}):Array.isArray(workspacePrefs.collapsedPanels)&&s.forEach(e=>e&&e.classList.toggle("collapsed",workspacePrefs.collapsedPanels.includes(e.id))),workspacePrefs.device&&setDevice(workspacePrefs.device),workspacePrefs.outputTab&&switchOutputTab(workspacePrefs.outputTab,getOutputTabButton(workspacePrefs.outputTab)),setTimeout(()=>{triggerLayoutUpdate(),document.body.classList.remove("workspace-booting")},120)}function applyLayoutPreset(e){const t=document.getElementById("editorTopSplit"),n=document.getElementById("outputBottomSplit"),o=[document.getElementById("htmlPanel"),document.getElementById("cssPanel"),document.getElementById("jsPanel")];if(!t||!n)return;const s={balanced:["60%","40%"],code:["calc(100% - 38px)","38px"],preview:["28%","72%"],debug:["46%","54%"]},[a,i]=s[e]||s.balanced;t.style.height=a,n.style.height=i,o.forEach(e=>{e&&(e.classList.remove("collapsed"),e.style.flex="",e.style.width="")}),"debug"===e&&switchOutputTab("console",getOutputTabButton("console")),"preview"===e&&switchOutputTab("preview",getOutputTabButton("preview")),saveWorkspacePrefs({layoutPreset:e,topHeight:a,bottomHeight:i,panelFlex:[]}),setWorkspaceStatus(`Layout: ${e}`,"saved"),setTimeout(triggerLayoutUpdate,160)}document.addEventListener("keydown",e=>{const t=document.getElementById("codebox");t&&t.classList.contains("active")&&(e.ctrlKey||e.metaKey)&&"s"===e.key&&(e.preventDefault(),smartRun(!0),showToast("<i class='ph-fill ph-play' style='margin-right:6px;'></i> Saved & Ran!"))});const workspaceCommands=[{id:"focus-html",icon:"ph-file-html",label:"Focus HTML",action:()=>focusPanel("html")},{id:"focus-css",icon:"ph-file-css",label:"Focus CSS",action:()=>focusPanel("css")},{id:"focus-js",icon:"ph-file-js",label:"Focus JavaScript",action:()=>focusPanel("js")},{id:"compile",icon:"ph-play",label:"Compile Workspace",action:()=>smartRun(!0)},{id:"time-machine",icon:"ph-clock-counter-clockwise",label:"Open Local Time Machine",action:()=>openTimeMachine()},{id:"preview",icon:"ph-browser",label:"Show Preview",action:()=>switchOutputTab("preview",getOutputTabButton("preview"))},{id:"console",icon:"ph-terminal",label:"Show Console",action:()=>switchOutputTab("console",getOutputTabButton("console"))},{id:"state",icon:"ph-tree-structure",label:"Show State Visualizer",action:()=>switchOutputTab("state",getOutputTabButton("state"))},{id:"sidebar",icon:"ph-sidebar-simple",label:"Toggle Explorer",action:()=>toggleSidebar("toggle")},{id:"tabs",icon:"ph-arrows-out-line-vertical",label:"Toggle Output Tabs",action:()=>toggleOutputTabs()},{id:"format",icon:"ph-magic-wand",label:"Format Code",action:()=>formatCode()},{id:"tailwind",icon:"ph-wind",label:"Add Tailwind CDN",action:()=>addSpecificCDN("https://cdn.tailwindcss.com")},{id:"desktop",icon:"ph-monitor",label:"Preview Desktop Width",action:()=>setDevice("desktop")},{id:"tablet",icon:"ph-device-tablet",label:"Preview Tablet Width",action:()=>setDevice("tablet")},{id:"mobile",icon:"ph-device-mobile",label:"Preview Mobile Width",action:()=>setDevice("mobile")},{id:"zip",icon:"ph-file-archive",label:"Download ZIP",action:()=>downloadZip()},{id:"dashboard",icon:"ph-kanban",label:"Open Project Manager",action:()=>openDashboard()},{id:"theme",icon:"ph-sun",label:"Toggle Theme",action:()=>toggleTheme()},{id:"layout-balanced",icon:"ph-layout",label:"Layout: Balanced",action:()=>applyLayoutPreset("balanced")},{id:"layout-code",icon:"ph-code",label:"Layout: Code Focus",action:()=>applyLayoutPreset("code")},{id:"layout-preview",icon:"ph-browser",label:"Layout: Preview Focus",action:()=>applyLayoutPreset("preview")},{id:"layout-debug",icon:"ph-bug",label:"Layout: Console Debug",action:()=>applyLayoutPreset("debug")},{id:"ai-explain",icon:"ph-info",label:"AI: Explain Selected Code",action:()=>aiChatOpenWith("Explain this code")},{id:"ai-generate",icon:"ph-magic-wand",label:"AI: Chat with AI...",action:()=>{if(aiHasKey()){aiToggleSidebar(true)}else{openAiSetupModal()}}},{id:"ai-fix",icon:"ph-bug",label:"AI: Fix Last Console Error",action:()=>aiChatOpenWith("Fix this console error")},{id:"ai-settings",icon:"ph-faders",label:"AI: Key & Model",action:()=>openAiSetupModal()},{id:"deploy-gh",icon:"ph-rocket-launch",label:"Deploy: Publish to GitHub Pages",action:()=>openDeployModal("github")},{id:"deploy-nl",icon:"ph-rocket-launch",label:"Deploy: Publish to Netlify",action:()=>openDeployModal("netlify")}];let runTimeout,selectedCommandIndex=0;function getVisibleCommandItems(){return Array.from(document.querySelectorAll("#cmdList .cmd-item")).filter(e=>"none"!==e.style.display)}function setSelectedCommand(e){const t=getVisibleCommandItems();t.length?(selectedCommandIndex=(e%t.length+t.length)%t.length,t.forEach((e,t)=>{const n=t===selectedCommandIndex;e.classList.toggle("selected",n),e.setAttribute("aria-selected",n?"true":"false"),n&&e.scrollIntoView({block:"nearest"})})):selectedCommandIndex=0}function renderWorkspaceCommands(){if(!document.getElementById("codebox"))return;const e=document.getElementById("cmdList"),t=document.getElementById("cmdInput");e&&(t&&(t.placeholder="Run a workspace command..."),e.innerHTML=workspaceCommands.map((e,t)=>`\n\t\t<button type="button" role="option" class="cmd-item ws-command-item" data-command="${e.id}" onclick="runWorkspaceCommand('${e.id}')">\n\t\t  <div class="cmd-item-left"><span class="cmd-icon-wrap"><i class="ph-bold ${e.icon}"></i></span><span>${e.label}</span></div>\n\t\t  <div class="cmd-item-right">${0===t?"Enter":""}</div>\n\t\t</button>\n\t  `).join(""),selectedCommandIndex=0,setSelectedCommand(0))}function runWorkspaceCommand(e){const t=workspaceCommands.find(t=>t.id===e);if(!t)return;t.action();const n=document.getElementById("cmdPalette");n&&n.classList.remove("active")}function toggleCmdK(){const e=document.getElementById("cmdPalette");e&&(renderWorkspaceCommands(),e.classList.toggle("active"),e.classList.contains("active")&&setTimeout(()=>{const e=document.getElementById("cmdInput");e&&(e.focus(),e.value=""),nitroSearchReset(),nitroSearchPreload(),document.querySelectorAll(".cmd-item").forEach(e=>e.style.display="flex"),setSelectedCommand(0)},100))}var nitroSearchIndex=null,nitroSearchDefaultHTML=null;var nitroSearchCatIcon={Page:"ph-globe",Blog:"ph-file-text",Guide:"ph-book-open",Template:"ph-squares-four",Tool:"ph-terminal",Docs:"ph-book",Action:"ph-lightning"};function nitroSearchReset(){if(document.getElementById("codebox"))return;var l=document.getElementById("cmdList");if(!l)return;if(nitroSearchDefaultHTML===null)nitroSearchDefaultHTML=l.innerHTML;else l.innerHTML=nitroSearchDefaultHTML}function nitroSearchPreload(){if(document.getElementById("codebox")||nitroSearchIndex!==null)return;fetch("/search-index.json").then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(j){nitroSearchIndex=j}).catch(function(){nitroSearchIndex=[]})}function nitroScore(t,d,u,words){t=t.toLowerCase();d=(d||"").toLowerCase();u=u.toLowerCase().replace(/[-_/]/g," ");var s=0;for(var i=0;i<words.length;i++){var w=words[i];if(!w)continue;if(t.indexOf(w)===0)s+=4;else if(t.indexOf(w)>0)s+=2;else if(d.indexOf(w)>=0)s+=1;else if(u.indexOf(w)>=0)s+=0.5;else return -1}return s}function nitroSiteSearch(q){if(document.getElementById("codebox"))return;var l=document.getElementById("cmdList");if(!l)return;if(nitroSearchDefaultHTML===null)nitroSearchDefaultHTML=l.innerHTML;if(!q){l.innerHTML=nitroSearchDefaultHTML;setSelectedCommand(0);return}if(nitroSearchIndex===null){nitroSearchPreload();l.innerHTML='<div class="cmd-item"><div class="cmd-item-left"><i class="ph-bold ph-magnifying-glass"></i> Searching&hellip;</div></div>';setSelectedCommand(0);setTimeout(function(){var i=document.getElementById("cmdInput");if(i&&i.value.toLowerCase().trim()===q)nitroSiteSearch(q)},500);return}var cmds=[{t:"Launch Workspace",u:"/tools/codebox.html",c:"Action",d:"open the browser IDE code editor"},{t:"Toggle Theme",u:"",c:"Action",d:"switch dark light mode appearance",cmd:"theme"},{t:"View Documentation",u:"/docs.html",c:"Docs",d:"help guides documentation"}];var words=q.split(/\s+/),res=[],i,s;for(i=0;i<cmds.length;i++){s=nitroScore(cmds[i].t,cmds[i].d,cmds[i].u,words);if(s>0)res.push({s:s+0.2,p:cmds[i]})}for(i=0;i<nitroSearchIndex.length;i++){var p=nitroSearchIndex[i];s=nitroScore(p.t,p.d,p.u,words);if(s>0)res.push({s:s,p:p})}res.sort(function(a,b){return b.s-a.s});res=res.slice(0,8);if(!res.length){var esc=q.replace(/&/g,"&amp;").replace(/</g,"&lt;");l.innerHTML='<div class="cmd-item"><div class="cmd-item-left"><i class="ph-bold ph-magnifying-glass"></i> No matches for &ldquo;'+esc+'&rdquo;</div></div>'}else{l.innerHTML=res.map(function(r){var p=r.p,ic=nitroSearchCatIcon[p.c]||"ph-globe",t=p.t.replace(/</g,"&lt;");if(p.cmd)return '<div class="cmd-item" onclick="toggleTheme();toggleCmdK();"><div class="cmd-item-left"><i class="ph-bold '+ic+'"></i> '+t+'</div><div class="cmd-item-right">'+p.c+'</div></div>';return '<a href="'+p.u+'" class="cmd-item"><div class="cmd-item-left"><i class="ph-bold '+ic+'"></i> '+t+'</div><div class="cmd-item-right">'+p.c+'</div></a>'}).join("")}setSelectedCommand(0)}function toggleCDN(){document.getElementById("cdnManager").classList.toggle("active"),document.getElementById("optionsMenu").classList.remove("active")}function addCDN(){const e=document.getElementById("cdnInput");e.value&&(cdnLinks.push(e.value),e.value="",renderCDNs(),smartRun())}function addSpecificCDN(e){cdnLinks.includes(e)||(cdnLinks.push(e),renderCDNs(),smartRun(),showToast("<i class='ph-bold ph-package' style='margin-right:6px;'></i> Library Added"))}function removeCDN(e){cdnLinks.splice(e,1),renderCDNs(),smartRun()}function renderCDNs(){document.getElementById("cdnList").innerHTML=cdnLinks.map((e,t)=>`<div class="cdn-item"><span>${e}</span><span class="cdn-remove" onclick="removeCDN(${t})"><i class="ph-bold ph-x"></i></span></div>`).join("")}function exportSingleFile(){if(!isIdeInitialized)return;showToast("<i class='ph-bold ph-download-simple' style='margin-right:6px;'></i> Downloading single file...");let e=cdnLinks.map(e=>e.endsWith(".css")?`<link rel="stylesheet" href="${e}">`:`<script src="${e}"><\/script>`).join("\n  ");vfs[activeFiles.html]=htmlMonaco.getValue(),vfs[activeFiles.css]=cssMonaco.getValue(),vfs[activeFiles.js]=jsMonaco.getValue();let t="",n="";Object.keys(vfs).forEach(e=>{e.endsWith(".css")&&(t+=vfs[e]+"\n"),e.endsWith(".js")&&(n+=vfs[e]+"\n")});let o=vfs["index.html"]||"";Object.keys(vfs).forEach(e=>{"index.html"!==e&&e.endsWith(".html")&&(o+="\n\n"+vfs[e]+"\n")});const s=new Blob([`\n<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Exported Project</title>\n  ${e}\n<style>\n${t}\n</style>\n</head>\n<body>\n${o}\n<script>\n${n}\n<\/script>\n</body>\n</html>`],{type:"text/html"}),a=document.createElement("a");a.href=URL.createObjectURL(s),a.download="dev-project.html",document.body.appendChild(a),a.click(),document.body.removeChild(a),document.getElementById("optionsMenu").classList.remove("active")}function downloadZip(){if(!isIdeInitialized)return;showToast("<i class='ph-bold ph-file-archive' style='margin-right:6px;'></i> Bundling ZIP...");var e=new JSZip;let t=cdnLinks.map(e=>e.endsWith(".css")?`<link rel="stylesheet" href="${e}">`:`<script src="${e}"><\/script>`).join("\n  ");vfs[activeFiles.html]=htmlMonaco.getValue(),vfs[activeFiles.css]=cssMonaco.getValue(),vfs[activeFiles.js]=jsMonaco.getValue();let n=vfs["index.html"]||"";Object.keys(vfs).forEach(e=>{"index.html"!==e&&e.endsWith(".html")&&(n+="\n\n"+vfs[e]+"\n")});const o=`\n<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Exported Project</title>\n  ${t}\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n${n}\n  <script src="script.js"><\/script>\n</body>\n</html>`;e.file("index.html",o);let s="",a="";Object.keys(vfs).forEach(e=>{e.endsWith(".css")&&(s+=`/* --- ${e} --- */\n`+vfs[e]+"\n"),e.endsWith(".js")&&(a+=`/* --- ${e} --- */\n`+vfs[e]+"\n")}),e.file("style.css",s),e.file("script.js",a),e.generateAsync({type:"blob"}).then(function(e){const t=document.createElement("a");t.href=URL.createObjectURL(e),t.download="dev-toolbox-project.zip",document.body.appendChild(t),t.click(),document.body.removeChild(t)}),document.getElementById("optionsMenu").classList.remove("active")}document.addEventListener("DOMContentLoaded",()=>{renderWorkspaceCommands();const e=document.getElementById("cmdInput");e&&(e.addEventListener("input",function(e){const t=e.target.value.toLowerCase().trim();if(document.getElementById("codebox")){document.querySelectorAll(".cmd-item").forEach(e=>{e.textContent.toLowerCase().includes(t)?e.style.display="flex":e.style.display="none"});setSelectedCommand(0)}else nitroSiteSearch(t)}),e.addEventListener("keydown",function(e){const t=getVisibleCommandItems();"ArrowDown"===e.key?(e.preventDefault(),setSelectedCommand(selectedCommandIndex+1)):"ArrowUp"===e.key?(e.preventDefault(),setSelectedCommand(selectedCommandIndex-1)):"Enter"===e.key&&t.length&&(e.preventDefault(),t[selectedCommandIndex].click())})),document.addEventListener("keydown",e=>{if((e.metaKey||e.ctrlKey)&&"k"===e.key&&(e.preventDefault(),toggleCmdK()),"Escape"===e.key){const e=document.getElementById("cmdPalette");e&&e.classList.remove("active");const t=document.getElementById("shareModal");t&&t.classList.remove("active");deployCloseModal();closeAiSetupModal()}});const t=document.getElementById("cmdPalette");t&&t.addEventListener("click",e=>{"cmdPalette"===e.target.id&&toggleCmdK()});const n=document.getElementById("shareModal");n&&n.addEventListener("click",e=>{"shareModal"===e.target.id&&toggleShareModal(!1)});const depM=document.getElementById("deployModal");depM&&depM.addEventListener("click",e=>{"deployModal"===e.target.id&&deployCloseModal()})});let cmdHistory=[],historyIndex=-1;function handleAutoRunToggle(){document.getElementById("autoRunToggle").checked&&smartRun(!1)}function clearConsole(e=!1){const t=document.getElementById("consoleLogs");t&&(t.innerHTML="")}function queueUpdate(e="all"){isRestoringSnapshot||(clearTimeout(runTimeout),document.getElementById("autoRunToggle").checked&&(runTimeout=setTimeout(()=>{if(("html"===e||"css"===e)&&htmlMonaco&&cssMonaco&&jsMonaco){const t=document.getElementById("liveIframe");if(t&&t.contentWindow)return"html"===e?(vfs[activeFiles.html]=htmlMonaco.getValue(),t.contentWindow.postMessage({type:"update-html",html:collectHTML()},"*"),setWorkspaceStatus("Preview updated","saved")):(vfs[activeFiles.css]=cssMonaco.getValue(),t.contentWindow.postMessage({type:"update-css",css:collectCSS()},"*"),setWorkspaceStatus("Styles updated","saved")),void scheduleProjectSave()}smartRun(!1)},"css"===e||"html"===e?220:650)))}function scheduleProjectSave(){setWorkspaceStatus("Saving...","saving"),clearTimeout(scheduleProjectSave.timer),scheduleProjectSave.timer=setTimeout(()=>{currentProject.vfs=vfs,currentProject.activeFiles=activeFiles,currentProject.lastModified=Date.now();let e=projects.findIndex(e=>e.id===currentProjectId);e>-1&&(projects[e]=currentProject),localStorage.setItem("nitro_projects",JSON.stringify(projects)),setWorkspaceStatus("Saved","saved")},500)}function filterConsole(e,t){document.querySelectorAll(".filter-btn").forEach(e=>e.classList.remove("active")),t&&t.classList.add("active");document.querySelectorAll(".console-entry").forEach(t=>{"all"===e||"error"===e&&t.classList.contains("con-err-line")||"warn"===e&&t.classList.contains("con-warn-line")||"log"===e&&(t.classList.contains("con-log-line")||t.classList.contains("con-ret-line"))?t.style.display="flex":t.style.display="none"})}function logToConsole(e,t="error",n=null,o="jsEditor"){const s=document.getElementById("consoleLogs");"error"===t&&setWorkspaceStatus(n?`Error on line ${n}`:"Runtime error","error",!0);let a="error"===t?"con-err-line":"warn"===t?"con-warn-line":"return"===t?"con-ret-line":"con-log-line",i=(new Date).toLocaleTimeString([],{hour12:!1}),l=n?`<span class="error-link" onclick="goToLine('${o}', ${n})">[Line ${n}]</span>`:"",r="return"===t?'<i class="ph-bold ph-arrow-bend-down-right" style="margin-right:4px;"></i>':"";if(s.innerHTML+=`<div class="console-entry ${a}"><span class="log-time">${i}</span> <div class="console-content">${r}${e} ${l}</div></div>`,s.scrollTop=s.scrollHeight,!document.getElementById("outConsole").classList.contains("active")&&"error"===t){let e=document.getElementById("consoleBadge");e&&(e.style.display="inline-flex")}}function escTxt(h){return String(null==h?"":h).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function sanitizeConsoleHTML(h){return String(null==h?"":h).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/&lt;(\/span|\/pre|span class=&quot;con-(?:null|func|tag|str|num|key)&quot;|pre class=&quot;json-block&quot;)&gt;/g,function(m,g){return"<"+g.split("&quot;").join(String.fromCharCode(34))+">"})}window.addEventListener("message",e=>{var d=e.data||{};if("clear"===d.type)return clearConsole(!0);if("state-watch"===d.type)return handleStateWatch(d);d.type&&logToConsole(sanitizeConsoleHTML(d.msg),d.type,"number"==typeof d.line?d.line:null,/^[A-Za-z]+$/.test(d.tab||"")?d.tab:"jsEditor")});let stateCache={};function clearState(){stateCache={},document.getElementById("stateVisualizer").innerHTML="",showToast("<i class='ph-bold ph-trash'></i> State Cleared")}function handleStateWatch(e){try{stateCache[e.name]=JSON.parse(e.data)}catch(t){stateCache[e.name]=String(e.data)}renderStateVisualizer()}function renderStateVisualizer(){const e=document.getElementById("stateVisualizer");if(!e)return;let t="";Object.keys(stateCache).forEach(e=>{t+=`<div style="margin-bottom: 15px;">\n\t\t\t  <div style="color:var(--text); font-weight:bold; border-bottom:1px solid var(--border); padding-bottom:5px; margin-bottom:5px;">${escTxt(e)}</div>\n\t\t\t  <pre class="json-block">${syntaxHighlightJSON(stateCache[e])}</pre>\n\t\t  </div>`}),e.innerHTML=t}function syntaxHighlightJSON(e){return"string"!=typeof e&&(e=JSON.stringify(e,void 0,2)),(e=e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")).replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,function(e){var t="con-num";return/^"/.test(e)?/:$/.test(e)?(t="con-key",e=e.replace(/"/g,"")):t="con-str":/true|false/.test(e)?t="con-func":/null/.test(e)&&(t="con-null"),'<span class="'+t+'">'+e+"</span>"})}function executeConsoleCmd(e){const t=document.getElementById("consoleInput");if("Enter"===e.key){const e=t.value,n=e.trim();if(!n)return;cmdHistory.push(n),historyIndex=cmdHistory.length,logToConsole(`<span style="color:var(--text-muted)">&gt; ${n.replace(/</g,"&lt;")}</span>`,"log"),t.value="";const o=n.toLowerCase().split(" "),s=o[0],a={tailwind:"https://cdn.tailwindcss.com",jquery:"https://code.jquery.com/jquery-3.7.1.min.js",gsap:"https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js",react:"https://unpkg.com/react@18/umd/react.development.js","react-dom":"https://unpkg.com/react-dom@18/umd/react-dom.development.js",bootstrap:"https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"};if("install"===s||"add"===s){const e=o[1];return void(a[e]?(addSpecificCDN(a[e]),logToConsole(`⚡ Success: Injected ${e}.`,"return")):e?(addSpecificCDN(`https://unpkg.com/${e}`),logToConsole(`⚡ Success: Fetched ${e} from unpkg.`,"return")):logToConsole("Usage: install &lt;library_name&gt;","warn"))}if("theme"===s){const e=o[1],t=document.documentElement.classList.contains("light-mode");return"dark"===e&&t?toggleTheme():"light"!==e||t?"toggle"===e&&toggleTheme():toggleTheme(),void logToConsole("🎨 Theme updated.","return")}if("export"===s)return void("--zip"===o[1]||"zip"===o[1]?(downloadZip(),logToConsole("📦 Bundling ZIP...","return")):(exportSingleFile(),logToConsole("📄 Exporting HTML...","return")));if("clear"===s)return void clearConsole(!0);if("format"===s)return void formatCode();if("help"===s)return void logToConsole('\n\t\t\t <div style="padding: 10px 0; line-height: 1.8; font-family: \'JetBrains Mono\', monospace;">\n\t\t\t   <span style="color:var(--text); font-weight:bold;">Developer Command Line Interface</span><br>\n\t\t\t   <span style="color:var(--accent);">install &lt;lib&gt;</span> - Inject a CDN (e.g. <i>install tailwind</i>)<br>\n\t\t\t   <span style="color:var(--accent);">theme &lt;dark|light&gt;</span> - Change workspace aesthetic<br>\n\t\t\t   <span style="color:var(--accent);">export zip</span> - Download full source code<br>\n\t\t\t   <span style="color:var(--accent);">export html</span> - Download single-file bundle<br>\n\t\t\t   <span style="color:var(--accent);">format</span> - Prettify all active code panels<br>\n\t\t\t   <span style="color:var(--accent);">clear</span> - Wipe console history\n\t\t\t </div>\n\t\t   ',"log");const i=document.getElementById("liveIframe");i&&i.contentWindow&&i.contentWindow.postMessage({type:"eval",cmd:e},"*")}else"ArrowUp"===e.key?(e.preventDefault(),historyIndex>0&&(historyIndex--,t.value=cmdHistory[historyIndex])):"ArrowDown"===e.key&&(e.preventDefault(),historyIndex<cmdHistory.length-1?(historyIndex++,t.value=cmdHistory[historyIndex]):(historyIndex=cmdHistory.length,t.value=""))}function collectHTML(){let e=vfs["index.html"]||"";return Object.keys(vfs).forEach(t=>{"index.html"!==t&&t.endsWith(".html")&&(e+="\n\n"+vfs[t]+"\n")}),e}function collectCSS(){let e="";return Object.keys(vfs).forEach(t=>{t.endsWith(".css")&&(e+=`\n/* --- MODULE: ${t} --- */\n`+vfs[t]+"\n")}),e}function collectJS(){let e="";return Object.keys(vfs).forEach(t=>{t.endsWith(".js")&&(e+=`\n// --- MODULE: ${t} ---\n`+vfs[t]+"\n")}),e}const TIME_MACHINE_LIMIT=12;function getTimeMachineKey(e=currentProjectId){return`nitro_time_machine_${e}`}function cloneTimeMachineData(e,t={}){try{return JSON.parse(JSON.stringify(e||t))}catch(e){return t}}function escapeTimeMachineHTML(e){return String(e??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[e]))}function readTimeSnapshots(e=currentProjectId){try{const t=JSON.parse(localStorage.getItem(getTimeMachineKey(e)))||[];return Array.isArray(t)?t.filter(e=>e&&e.id):[]}catch(e){return[]}}function writeTimeSnapshots(e,t=currentProjectId){const n=(Array.isArray(e)?e:[]).slice(0,12),o=getTimeMachineKey(t),s=[...new Set([n.length,8,4,2,1].filter(e=>e>0&&e<=n.length))];for(const e of s)try{return localStorage.setItem(o,JSON.stringify(n.slice(0,e))),!0}catch(e){}return showToast("<i class='ph-bold ph-warning-circle' style='margin-right:6px;'></i> History storage is full."),!1}function getSnapshotCharCount(e){return Object.values(e||{}).reduce((e,t)=>e+String(t||"").length,0)}function formatSnapshotSize(e=0){return e>=1e3?`${(e/1e3).toFixed(e>=1e4?0:1)}k chars`:`${e} chars`}function formatSnapshotTime(e){return new Date(e).toLocaleString([],{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}function saveTimeSnapshot(e="compile"){const t=cloneTimeMachineData(vfs),n=Date.now(),o={id:`snap_${n}_${Math.random().toString(36).slice(2,7)}`,createdAt:n,reason:e,projectId:currentProjectId,projectName:currentProject&&currentProject.name?currentProject.name:"Workspace",fileCount:Object.keys(t).length,totalChars:getSnapshotCharCount(t),activeFiles:cloneTimeMachineData(activeFiles,{html:"index.html",css:"style.css",js:"script.js"}),vfs:t,console:{total:0,errors:0,warnings:0,logs:0,preview:[],pending:!0}};return writeTimeSnapshots([o,...readTimeSnapshots()])?(renderTimeMachineList(),setWorkspaceStatus("Snapshot saved","saved"),o.id):null}function getConsoleSummary(){const e=Array.from(document.querySelectorAll("#consoleLogs .console-entry")),t=e.slice(-4).map(e=>{const t=e.querySelector(".console-content");return(t?t.textContent:e.textContent||"").replace(/\s+/g," ").trim()}).filter(Boolean);return{total:e.length,errors:e.filter(e=>e.classList.contains("con-err-line")).length,warnings:e.filter(e=>e.classList.contains("con-warn-line")).length,logs:e.filter(e=>e.classList.contains("con-log-line")||e.classList.contains("con-ret-line")).length,preview:t}}function finalizeTimeSnapshot(e){if(!e)return;const t=readTimeSnapshots(),n=t.findIndex(t=>t.id===e);-1!==n&&(t[n].console={...getConsoleSummary(),pending:!1},writeTimeSnapshots(t),renderTimeMachineList())}function getSnapshotHealth(e){const t=e.console||{};return t.pending?{className:"is-pending",icon:"ph-spinner-gap",label:"Capturing console"}:t.errors>0?{className:"is-error",icon:"ph-warning-circle",label:`${t.errors} error${1===t.errors?"":"s"}`}:t.warnings>0?{className:"is-warning",icon:"ph-warning",label:`${t.warnings} warning${1===t.warnings?"":"s"}`}:t.total>0?{className:"is-clean",icon:"ph-check-circle",label:`${t.total} console item${1===t.total?"":"s"}`}:{className:"is-quiet",icon:"ph-circle",label:"No console output"}}function getSnapshotActiveLabel(e){const t=Object.values(e.activeFiles||{}).filter(Boolean);return t.length?t.map(escapeTimeMachineHTML).join(", "):"Default files"}function renderTimeMachineList(){const e=document.getElementById("timeMachineList");if(!e)return;const t=readTimeSnapshots();t.length?e.innerHTML=t.map((e,t)=>{const n=getSnapshotHealth(e),o=escapeTimeMachineHTML(e.projectName||"Workspace"),s=e.console&&e.console.preview&&e.console.preview.length?`<div class="time-snapshot-console">${e.console.preview.map(e=>`<span>${escapeTimeMachineHTML(e)}</span>`).join("")}</div>`:"";return`\n\t\t  <article class="time-snapshot-card">\n\t\t\t<div class="time-snapshot-main">\n\t\t\t  <div class="time-snapshot-icon"><i class="ph-bold ph-clock-counter-clockwise"></i></div>\n\t\t\t  <div class="time-snapshot-copy">\n\t\t\t\t<div class="time-snapshot-title-row">\n\t\t\t\t  <h4>${0===t?"Latest compile":"Compile snapshot"}</h4>\n\t\t\t\t  ${0===t?'<span class="time-snapshot-pill">Newest</span>':""}\n\t\t\t\t</div>\n\t\t\t\t<p>${o} - ${formatSnapshotTime(e.createdAt)}</p>\n\t\t\t\t<div class="time-snapshot-meta">\n\t\t\t\t  <span><i class="ph-bold ph-files"></i> ${e.fileCount||0} files</span>\n\t\t\t\t  <span><i class="ph-bold ph-text-aa"></i> ${formatSnapshotSize(e.totalChars||0)}</span>\n\t\t\t\t  <span><i class="ph-bold ph-crosshair"></i> ${getSnapshotActiveLabel(e)}</span>\n\t\t\t\t</div>\n\t\t\t\t<div class="time-snapshot-health ${n.className}">\n\t\t\t\t  <i class="ph-bold ${n.icon}"></i> ${escapeTimeMachineHTML(n.label)}\n\t\t\t\t</div>\n\t\t\t\t${s}\n\t\t\t  </div>\n\t\t\t</div>\n\t\t\t<div class="time-snapshot-actions">\n\t\t\t  <button class="btn btn-compact primary-btn" onclick="restoreTimeSnapshot('${e.id}')"><i class="ph-bold ph-arrow-counter-clockwise"></i> Restore</button>\n\t\t\t</div>\n\t\t  </article>\n\t\t`}).join(""):e.innerHTML='\n\t\t  <div class="time-machine-empty">\n\t\t\t<i class="ph-bold ph-clock-counter-clockwise"></i>\n\t\t\t<h4>No restore points yet</h4>\n\t\t\t<p>Press Compile to save the first local snapshot for this project.</p>\n\t\t  </div>\n\t\t'}function openTimeMachine(){const e=document.getElementById("optionsMenu"),t=document.getElementById("timeMachineModal");e&&e.classList.remove("active"),renderTimeMachineList(),t&&t.classList.add("active")}function closeTimeMachine(){const e=document.getElementById("timeMachineModal");e&&e.classList.remove("active")}function handleTimeMachineBackdrop(e){e.target&&"timeMachineModal"===e.target.id&&closeTimeMachine()}function clearTimeSnapshots(){confirm("Clear all local snapshots for this project?")&&(localStorage.removeItem(getTimeMachineKey()),renderTimeMachineList(),setWorkspaceStatus("History cleared","saved"),showToast("<i class='ph-bold ph-check-circle' style='margin-right:6px;'></i> Local history cleared."))}function pickSnapshotActiveFile(e,t,n,o){if(t&&Object.prototype.hasOwnProperty.call(e,t))return t;return Object.keys(e).find(e=>e.endsWith(n))||o}function syncEditorFromSnapshot(){const e=vfs[activeFiles.html]??vfs["index.html"]??"",t=vfs[activeFiles.css]??vfs["style.css"]??"",n=vfs[activeFiles.js]??vfs["script.js"]??"";htmlMonaco&&htmlMonaco.setValue(e),cssMonaco&&cssMonaco.setValue(t),jsMonaco&&jsMonaco.setValue(n);const o=document.getElementById("htmlPanelPillText"),s=document.getElementById("cssPanelPillText"),a=document.getElementById("jsPanelPillText");o&&(o.innerText=activeFiles.html),s&&(s.innerText=activeFiles.css),a&&(a.innerText=activeFiles.js)}function restoreTimeSnapshot(e){const t=readTimeSnapshots().find(t=>t.id===e);if(!t||!t.vfs)return void showToast("<i class='ph-bold ph-warning-circle' style='margin-right:6px;'></i> Snapshot not found.");const n=cloneTimeMachineData(t.vfs);if(!Object.keys(n).length)return void showToast("<i class='ph-bold ph-warning-circle' style='margin-right:6px;'></i> Snapshot is empty.");void 0===n["index.html"]&&(n["index.html"]=""),void 0===n["style.css"]&&(n["style.css"]=""),void 0===n["script.js"]&&(n["script.js"]="");const o=t.activeFiles||{};vfs=n,activeFiles={html:pickSnapshotActiveFile(vfs,o.html,".html","index.html"),css:pickSnapshotActiveFile(vfs,o.css,".css","style.css"),js:pickSnapshotActiveFile(vfs,o.js,".js","script.js")},currentProject.vfs=vfs,currentProject.activeFiles=activeFiles,currentProject.lastModified=Date.now();const s=projects.findIndex(e=>e.id===currentProjectId);s>-1&&(projects[s]=currentProject),localStorage.setItem("nitro_projects",JSON.stringify(projects)),isRestoringSnapshot=!0,syncEditorFromSnapshot(),renderVFS(),triggerLayoutUpdate(),isRestoringSnapshot=!1,closeTimeMachine(),smartRun(!1),setWorkspaceStatus("Snapshot restored","saved"),showToast("<i class='ph-bold ph-arrow-counter-clockwise' style='margin-right:6px;'></i> Snapshot restored.")}function smartRun(e=!1){if(!isIdeInitialized)return;setWorkspaceStatus(e?"Compiling...":"Running...","running"),vfs[activeFiles.html]=htmlMonaco?htmlMonaco.getValue():"",vfs[activeFiles.css]=cssMonaco?cssMonaco.getValue():"",vfs[activeFiles.js]=jsMonaco?jsMonaco.getValue():"",currentProject.vfs=vfs,currentProject.activeFiles=activeFiles,currentProject.lastModified=Date.now();let t=projects.findIndex(e=>e.id===currentProjectId);t>-1&&(projects[t]=currentProject),localStorage.setItem("nitro_projects",JSON.stringify(projects));const n=e?saveTimeSnapshot("compile"):null;forceRun(collectHTML(),collectCSS(),collectJS(),document.getElementById("liveIframe"),{clearConsole:e}),n&&setTimeout(()=>finalizeTimeSnapshot(n),900)}function forceRun(e,t,n,o,s={}){s.clearConsole&&(document.getElementById("consoleLogs").innerHTML="");let a=`<!DOCTYPE html>\n<html>\n<head>\n${cdnLinks.map(e=>e.endsWith(".css")?`<link rel="stylesheet" href="${e}">`:`<script src="${e}"><\/script>`).join("\n")}\n<style id="live-css-inject">\n::-webkit-scrollbar { width: 6px; height: 6px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: rgba(161, 161, 170, 0.4); border-radius: 10px; } ::-webkit-scrollbar-thumb:hover { background: rgba(161, 161, 170, 0.6); }\n${t}\n</style>\n`;const i=`<script>\n\t\tconst JS_OFFSET = ${a.split("\n").length+30}; \n\t\tfunction serialize(arg) { \n\t\t  if(arg === null) return '<span class="con-null">null</span>';\n\t\t  if(arg === undefined) return '<span class="con-null">undefined</span>';\n\t\t  if(typeof arg === 'function') return '<span class="con-func">ƒ</span> ' + (arg.name || 'anonymous') + '()';\n\t\t  if(arg instanceof HTMLElement) return '<span class="con-tag">' + arg.outerHTML.substring(0, 50).replace(/</g, '&lt;') + (arg.outerHTML.length > 50 ? '...' : '') + '</span>';\n\t\t  if(typeof arg === 'string') return '<span class="con-str">' + arg.replace(/</g, '&lt;') + '</span>';\n\t\t  if(typeof arg === 'number' || typeof arg === 'boolean') return '<span class="con-num">' + arg + '</span>';\n\t\t  try { \n\t\t\tconst seen = new WeakSet();\n\t\t\tconst json = JSON.stringify(arg, (k, v) => { if(typeof v === "object" && v !== null) { if(seen.has(v)) return "[Circular]"; seen.add(v); } return v; }, 2);\n\t\t\treturn '<pre class="json-block">' + json.replace(/"(.*?)":/g, '<span class="con-key">"$1"</span>:') + '</pre>'; \n\t\t  } catch(e) { return String(arg); } \n\t\t}\n\t\twindow.onerror = function(m, u, l) { let realLine = l - JS_OFFSET; if(realLine < 1) realLine = null; window.parent.postMessage({type: 'error', msg: m, line: realLine, tab: 'jsEditor'}, '*'); return true; };\n\t\twindow.addEventListener('unhandledrejection', function(e) { window.parent.postMessage({type: 'error', msg: 'Promise Rejection: ' + (e.reason ? e.reason : 'Unknown')}, '*'); });\n\t\twindow.addEventListener('error', function(e) { if(e.target.tagName) window.parent.postMessage({type: 'error', msg: 'Failed to load ' + e.target.tagName.toLowerCase() + ': ' + (e.target.src || e.target.href)}, '*'); }, true);\n\t\t\n\t\tconst ogLog = console.log, ogWarn = console.warn, ogErr = console.error, ogClear = console.clear;\n\t\tconsole.log = function(...a) { window.parent.postMessage({type: 'log', msg: a.map(serialize).join(' ')}, '*'); ogLog.apply(console, a); };\n\t\tconsole.warn = function(...a) { window.parent.postMessage({type: 'warn', msg: a.map(serialize).join(' ')}, '*'); ogWarn.apply(console, a); };\n\t\tconsole.error = function(...a) { window.parent.postMessage({type: 'error', msg: a.map(serialize).join(' ')}, '*'); ogErr.apply(console, a); };\n\t\tconsole.clear = function() { window.parent.postMessage({type: 'clear'}, '*'); ogClear.apply(console); };\n\t\t\n\t\t// State Visualizer Hook\n\t\twindow.Nitro = {\n\t\t\twatch: function(name, data) {\n\t\t\t\twindow.parent.postMessage({type: 'state-watch', name: name, data: JSON.stringify(data)}, '*');\n\t\t\t}\n\t\t};\n\t\t\n\t\twindow.addEventListener('message', function(e) { \n\t\t  if(e.data.type === 'eval') { try { let r = eval(e.data.cmd); window.parent.postMessage({type: 'return', msg: serialize(r)}, '*'); } catch(err) { console.error(err.message); } }\n\t\t  if(e.data.type === 'update-html') { document.body.innerHTML = e.data.html; }\n\t\t  if(e.data.type === 'update-css') { let styleTag = document.getElementById('live-css-inject'); if(styleTag) styleTag.textContent = e.data.css; }\n\t\t});\n\t  <\/script>\n`;if(o){const t=a+i+`</head>\n<body>\n${e}\n<script>\n`+n+"\n<\/script>\n</body>\n</html>",s=o.parentElement;if(!s||!o.dataset.ready)return o.srcdoc=t,o.dataset.ready="true",void setWorkspaceStatus("Preview updated","saved");const l=document.createElement("iframe");l.setAttribute("sandbox",o.getAttribute("sandbox")||""),l.className=o.className,l.style.position="absolute",l.style.inset="0",l.style.opacity="0",l.style.pointerEvents="none",l.addEventListener("load",()=>{o.removeAttribute("id"),l.id="liveIframe",l.dataset.ready="true",l.style.position="",l.style.inset="",l.style.opacity="",l.style.pointerEvents="",o.remove(),setWorkspaceStatus("Preview updated","saved")},{once:!0}),s.appendChild(l),l.srcdoc=t}}function buildShareUrl(){if("undefined"==typeof LZString)return null;const e=JSON.stringify({vfs:vfs,activeFiles:activeFiles}),t=LZString.compressToEncodedURIComponent(e);return window.location.origin+window.location.pathname+"?code="+t}function openShareModal(){const e=buildShareUrl();if(!e)return showToast("<i class='ph-bold ph-warning-circle' style='margin-right:6px;'></i> Compression library missing.");let t="NitroIDE workspace";try{const n=(typeof vfs!="undefined"&&vfs["index.html"])||"",o=n.match(/<title[^>]*>([^<]*)<\/title>/i);o&&o[1].trim()&&(t=o[1].trim())}catch(n){}document.getElementById("shareTitle").textContent=t;const n=document.getElementById("shareLinkInput");n.value=e;const o=encodeURIComponent(t+" \u2014 built with NitroIDE"),c=encodeURIComponent(e);document.getElementById("shareX").href="https://twitter.com/intent/tweet?text="+o+"&url="+c,document.getElementById("shareWa").href="https://wa.me/?text="+o+"%20"+c,document.getElementById("shareTg").href="https://t.me/share/url?url="+c+"&text="+o,document.getElementById("shareNative").style.display=navigator.share?"":"none",document.getElementById("shareModal").classList.add("active"),window._shareUrl=e,window._shareTitle=t}
function toggleShareModal(e){const t=document.getElementById("shareModal");t&&t.classList.toggle("active",e!==!1),e!==!1&&setTimeout(()=>{const e=document.getElementById("shareLinkInput");e&&(e.focus(),e.select())},50)}
function copyShareLink(){const e=document.getElementById("shareLinkInput"),t=window._shareUrl||e.value,n=()=>showToast("<i class='ph-bold ph-check-circle' style='color:var(--success); margin-right:6px;'></i> Link copied to clipboard!");navigator.clipboard&&navigator.clipboard.writeText?navigator.clipboard.writeText(t).then(n).catch(()=>{e.select();document.execCommand("copy"),n()}):(e.select(),document.execCommand("copy"),n())}
function nativeShare(){if(!navigator.share)return;const e=window._shareTitle||"NitroIDE workspace";navigator.share({title:e,text:e+" \u2014 built with NitroIDE",url:window._shareUrl||document.getElementById("shareLinkInput").value}).catch(()=>{})}
function injectShareButton(){const e=document.querySelector(".ws-header .ws-right"),t=e?e.querySelector(".ws-compile-btn"):null;if(!e||!t||document.getElementById("shareBtn"))return;const n=document.createElement("button");n.id="shareBtn",n.className="ws-btn ws-icon-text-btn",n.title="Share workspace link",n.setAttribute("aria-label","Share workspace link"),n.innerHTML='<i class="ph-bold ph-share-network"></i><span class="ws-hide-mobile">Share</span>',n.addEventListener("click",openShareModal),e.insertBefore(n,t),pinWsRight()}function pinWsRight(){var e=document.querySelector(".workspace-body .ws-right");if(e)e.scrollLeft=e.scrollWidth}function injectEmbedModeCSS(){if(document.getElementById("nitroEmbedCSS"))return;const e=document.createElement("style");e.id="nitroEmbedCSS",e.textContent="\n    body.embed-mode .ws-header,\n    body.embed-mode #fileSidebar,\n    body.embed-mode #sidebarBackdrop,\n    body.embed-mode .editor-half,\n    body.embed-mode .ide-resizer,\n    body.embed-mode .output-tabs,\n    body.embed-mode #outConsole,\n    body.embed-mode #outState,\n    body.embed-mode #cdnManager,\n    body.embed-mode #optionsMenu,\n    body.embed-mode .bg-grid,\n    body.embed-mode .ambient-glow { display: none !important; }\n    body.embed-mode #codebox { height: 100vh !important; }\n    body.embed-mode .ide-workspace { display: block !important; height: calc(100vh - 46px) !important; overflow: hidden; }\n    body.embed-mode .ide-split { display: block !important; height: 100% !important; }\n    body.embed-mode .output-half { height: 100% !important; min-height: 0 !important; }\n    body.embed-mode #outPreview.iframe-wrap { display: block !important; height: 100% !important; }\n    body.embed-mode #liveIframe { width: 100% !important; height: 100% !important; }\n    body.embed-mode .nitro-embed-footer {\n      position: fixed; left: 0; right: 0; bottom: 0; height: 46px; z-index: 9000;\n      display: flex; align-items: center; justify-content: center;\n      background: rgba(10,10,12,0.94); border-top: 1px solid var(--border);\n      backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);\n      font-size: 0.85rem; color: var(--text-muted);\n    }\n    body.embed-mode .nitro-embed-footer a {\n      color: #00e5ff; font-weight: 700; text-decoration: none;\n      display: inline-flex; align-items: center; gap: 6px;\n    }\n    body.embed-mode .nitro-embed-footer a:hover { text-decoration: underline; }\n    html.light-mode body.embed-mode .nitro-embed-footer { background: rgba(255,255,255,0.94); }\n  ",document.head.appendChild(e)}function injectEmbedFooter(){if(document.querySelector(".nitro-embed-footer"))return;let e=buildShareUrl();if(!e)try{const t=new URL(window.location.href);t.searchParams.delete("embed"),e=t.toString()}catch(t){e=window.location.pathname}const t=document.createElement("div");t.className="nitro-embed-footer";const n=document.createElement("a");n.href=e,n.target="_blank",n.rel="noopener",n.innerHTML='<i class="ph-bold ph-lightning"></i> Built with NitroIDE &mdash; open &amp; edit',t.appendChild(n),document.body.appendChild(t)}function openDashboard(){renderDashboard(),document.getElementById("projectDashboard").classList.add("active"),document.getElementById("optionsMenu").classList.remove("active")}function closeDashboard(){document.getElementById("projectDashboard").classList.remove("active")}function renderDashboard(){const e=document.getElementById("projectGrid");e&&(e.innerHTML="",projects.sort((e,t)=>t.lastModified-e.lastModified).forEach(t=>{let n=t.id===currentProjectId,o=new Date(t.lastModified).toLocaleString();e.innerHTML+=`\n            <div class="proj-card ${n?"active":""}">\n                <h3>${escapeTimeMachineHTML(t.name)}</h3><p>Edited: ${o}</p>\n                <div class="proj-actions">\n                    ${n?'<span class="proj-badge">Active</span>':`<button class="btn btn-compact" onclick="switchProject('${t.id}')">Open</button>`}\n                    ${projects.length>1?`<button class="btn btn-compact btn-outline" style="color:var(--error); border-color:var(--error);" onclick="deleteProject('${t.id}')"><i class="ph-bold ph-trash"></i></button>`:""}\n                </div>\n            </div>`}))}function createNewProject(){let e=prompt("Enter project name:");if(!e)return;let t={id:"proj_"+Date.now(),name:e,vfs:JSON.parse(JSON.stringify(defaultVfs)),activeFiles:{html:"index.html",css:"style.css",js:"script.js"},lastModified:Date.now()};projects.push(t),localStorage.setItem("nitro_projects",JSON.stringify(projects)),switchProject(t.id,{resetWorkspace:!0})}function switchProject(e,t={}){smartRun(),t.resetWorkspace&&resetWorkspacePrefs(),localStorage.setItem("nitro_current_project_id",e),window.location.reload()}function deleteProject(e){confirm("Delete this project?")&&(projects=projects.filter(t=>t.id!==e),localStorage.removeItem(getTimeMachineKey(e)),localStorage.setItem("nitro_projects",JSON.stringify(projects)),currentProjectId===e?switchProject(projects[0].id):renderDashboard())}function enhanceMonaco(){if("undefined"==typeof monaco)return;monaco.languages.typescript.javascriptDefaults.setCompilerOptions({target:monaco.languages.typescript.ScriptTarget.ES2020,allowNonTsExtensions:!0,jsx:monaco.languages.typescript.JsxEmit.React,moduleResolution:monaco.languages.typescript.ModuleResolutionKind.NodeJs,module:monaco.languages.typescript.ModuleKind.CommonJS,noEmit:!0,typeRoots:["node_modules/@types"]});const e={jquery:"https://unpkg.com/@types/jquery/index.d.ts",react:"https://unpkg.com/@types/react/index.d.ts","react-dom":"https://unpkg.com/@types/react-dom/index.d.ts",lodash:"https://unpkg.com/@types/lodash/index.d.ts",gsap:"https://unpkg.com/@types/gsap/index.d.ts"};window.injectIntelliSense=async function(t){let n=Object.keys(e).find(e=>t.toLowerCase().includes(e));if(n&&!window[`_typesLoaded_${n}`])try{let t=await fetch(e[n]),o=await t.text();monaco.languages.typescript.javascriptDefaults.addExtraLib(o,`file:///node_modules/@types/${n}/index.d.ts`),window[`_typesLoaded_${n}`]=!0,showToast(`<i class='ph-bold ph-magic-wand' style='color:#bb9af7; margin-right:6px;'></i> IntelliSense loaded for ${n}`)}catch(e){}};const t=window.addSpecificCDN;window.addSpecificCDN=function(e){t&&t(e),window.injectIntelliSense(e)};const n=window.addCDN;window.addCDN=function(){let e=document.getElementById("cdnInput").value;e&&(e=e.trim()),n&&n(),e&&window.injectIntelliSense(e)}}async function processImportedFiles(e){showToast("<i class='ph-bold ph-spinner-gap' style='margin-right:6px;'></i> Importing...");let t=0;for(let n=0;n<e.length;n++){const o=e[n];if(o.name.endsWith(".zip")){const e=await JSZip.loadAsync(o);for(const n of Object.keys(e.files)){const o=e.files[n];if(!o.dir&&(n.endsWith(".html")||n.endsWith(".css")||n.endsWith(".js"))){const e=n.split("/").pop();vfs[e]=await o.async("string"),t++}}}else if(o.name.endsWith(".html")||o.name.endsWith(".css")||o.name.endsWith(".js")){const e=await o.text();vfs[o.name]=e,t++}}t>0?(vfs["index.html"]||(vfs["index.html"]="\n"),vfs["style.css"]||(vfs["style.css"]="/* Imported project missing style.css */\n"),vfs["script.js"]||(vfs["script.js"]="// Imported project missing script.js\n"),htmlMonaco&&htmlMonaco.setValue(vfs["index.html"]),cssMonaco&&cssMonaco.setValue(vfs["style.css"]),jsMonaco&&jsMonaco.setValue(vfs["script.js"]),activeFiles={html:"index.html",css:"style.css",js:"script.js"},renderVFS(),smartRun(),document.getElementById("optionsMenu").classList.remove("active"),showToast(`<i class='ph-bold ph-check-circle' style='margin-right:6px; color:var(--success);'></i> Imported ${t} files!`)):showToast("<i class='ph-bold ph-warning-circle' style='margin-right:6px;'></i> No valid HTML, CSS, or JS files found.")}function handleImport(e){e.target.files.length>0&&processImportedFiles(e.target.files),e.target.value=""}document.addEventListener("DOMContentLoaded",()=>{injectShareButton(),pinWsRight(),void 0!==isEmbedMode&&isEmbedMode&&injectEmbedFooter()}),window.addEventListener("load",()=>{pinWsRight(),setTimeout(pinWsRight,600)}),window.addEventListener("orientationchange",()=>{setTimeout(pinWsRight,300)}),window.onload=()=>{if(document.getElementById("codebox")){const e=()=>{initIDE(),setTimeout(enhanceMonaco,1500)};externalImportRequested?Promise.race([externalImportPromise,new Promise(e=>setTimeout(e,1e4))]).finally(e):e()}};const dragOverlay=document.getElementById("dragOverlay");let dragCounter=0;window.addEventListener("dragover",e=>{e.preventDefault(),e.stopPropagation()}),window.addEventListener("drop",e=>{e.preventDefault(),e.stopPropagation()}),document.body.addEventListener("dragenter",e=>{e.preventDefault(),dragCounter++,dragOverlay&&(dragOverlay.style.display="flex")}),document.body.addEventListener("dragleave",e=>{e.preventDefault(),dragCounter--,0===dragCounter&&dragOverlay&&(dragOverlay.style.display="none")}),document.body.addEventListener("dragover",e=>{e.preventDefault()}),document.body.addEventListener("drop",e=>{e.preventDefault(),dragCounter=0,dragOverlay&&(dragOverlay.style.display="none"),e.dataTransfer.files.length>0&&processImportedFiles(e.dataTransfer.files)});const rPath=window.location.pathname.includes("/blog/")||window.location.pathname.includes("/tools/")||window.location.pathname.includes("/landing/")||window.location.pathname.includes("/templates/")?"../":"./";class NitroHeader extends HTMLElement{connectedCallback(){this.innerHTML=`\n        <div class="nitro-alert-bar-wrapper">\n          <div class="nitro-alert-content-flex">\n            <span class="nitro-alert-badge-pill">BETA</span>\n            <span class="nitro-alert-message-text">NitroIDE is in active development. Help us shape the future of local coding!</span>\n            <button onclick="toggleFeedbackModal()" class="nitro-alert-action-btn">Share Feedback <i class="ph-fill ph-arrow-right"></i></button>\n          </div>\n        </div>\n        <nav class="floating-nav" id="floatingNav">\n          <div class="logo">\n            <a href="${rPath}index.html" style="text-decoration:none; display: flex; align-items: center; gap: 8px;">\n              <img src="${rPath}logo/logo_white.png" alt="NitroIDE" class="logo-dark">\n              <img src="${rPath}logo/logo_black.png" alt="NitroIDE" class="logo-light">\n            </a>\n            <div class="status-ping hide-in-mobile"><span class="ping-dot"></span> 0ms Latency</div>\n          </div>\n          <div class="nav-actions">\n            <a href="${rPath}blog/index.html" aria-label="Tutorials" class="theme-toggle" style="text-decoration: none; display: flex; align-items: center; gap: 6px; height: 36px; box-sizing: border-box;"><i class="ph-bold ph-book-open"></i><span class="hide-in-mobile">Tutorials</span></a>\n            <a href="${rPath}templates.html" aria-label="Templates" class="theme-toggle" style="text-decoration: none; display: flex; align-items: center; gap: 6px; height: 36px; box-sizing: border-box;"><i class="ph-bold ph-squares-four"></i><span class="hide-in-mobile">Templates</span></a>\n            <button class="theme-toggle hide-in-mobile" onclick="toggleCmdK()" title="Command Palette" style="height: 36px; box-sizing: border-box;"><i class="ph-bold ph-magnifying-glass"></i> <span class="hide-in-mobile" style="font-size:0.7rem; font-weight:700; opacity:0.7;">⌘K</span></button>\n            <button class="theme-toggle" onclick="toggleTheme()" id="themeBtnFloat" aria-label="Toggle Dark Mode" style="height: 36px; box-sizing: border-box;"><i class="ph-bold ph-sun"></i></button>\n            <a href="${rPath}tools/codebox.html" class="btn btn-compact primary-btn hide-in-mobile" style="border-radius: 30px; padding: 0 16px; height: 36px; box-sizing: border-box; display: flex; align-items: center;">Open Workspace</a>\n          </div>\n        </nav>\n        <div class="container relative-z" style="padding-top: 10px; padding-bottom: 0;">\n            <div class="header-row">\n              <div class="logo">\n                <a href="${rPath}index.html" style="text-decoration:none; display: flex; align-items: center; gap: 8px;">\n                  <img src="${rPath}logo/logo_white.png" alt="NitroIDE" class="logo-dark">\n                  <img src="${rPath}logo/logo_black.png" alt="NitroIDE" class="logo-light">\n                </a>\n              </div>\n              <div class="nav-actions">\n                <a href="${rPath}blog/index.html" aria-label="Tutorials" class="theme-toggle" style="text-decoration: none; display: flex; align-items: center; gap: 6px; height: 36px; box-sizing: border-box;"><i class="ph-bold ph-book-open"></i><span class="hide-in-mobile">Tutorials</span></a>\n                <a href="${rPath}templates.html" aria-label="Templates" class="theme-toggle" style="text-decoration: none; display: flex; align-items: center; gap: 6px; height: 36px; box-sizing: border-box;"><i class="ph-bold ph-squares-four"></i><span class="hide-in-mobile">Templates</span></a>\n                <button class="theme-toggle hide-in-mobile" onclick="toggleCmdK()" style="height: 36px; box-sizing: border-box;"><i class="ph-bold ph-magnifying-glass"></i> <span>Search...</span> <span class="cmd-badge">⌘K</span></button>\n                <button class="theme-toggle" id="themeBtn" aria-label="Toggle Dark Mode" onclick="toggleTheme()" style="height: 36px; box-sizing: border-box;"><i class="ph-bold ph-sun"></i></button>\n                <a href="${rPath}tools/codebox.html" class="btn btn-compact primary-btn hide-in-mobile" style="border-radius: 30px; padding: 0 16px; height: 36px; box-sizing: border-box; display: flex; align-items: center;">Open Workspace</a>\n              </div>\n            </div>\n        </div>\n        `}}customElements.define("nitro-header",NitroHeader);class NitroFooter extends HTMLElement{connectedCallback(){const e=window.location.pathname.includes("/landing/"),t=window.location.pathname.includes("/tools/"),n=window.location.pathname.includes("/blog/"),o=e||t||n||window.location.pathname.includes("/templates/"),s=o?"../":"./";let a=e?"./":o?"../landing/":"landing/";this.innerHTML=`\n        <style>\n          .footer-wrapper {\n            position: relative;\n            overflow: hidden;\n            border-top: 1px solid var(--border);\n            padding-top: 40px;\n            padding-bottom: 40px;\n            margin-top: 0px;\n          }\n          \n          /* The Massive Background Watermark */\n          .footer-watermark {\n            position: absolute;\n            bottom: -5%;\n            left: 50%;\n            transform: translateX(-50%);\n            font-size: 15vw;\n            font-weight: 800;\n            color: var(--text);\n            opacity: 0.02;\n            pointer-events: none;\n            white-space: nowrap;\n            z-index: 0;\n            letter-spacing: -0.05em;\n            user-select: none;\n          }\n          html.light-mode .footer-watermark { opacity: 0.03; color: #000; }\n\n          /* The Upper Deck */\n          .footer-upper {\n            display: flex;\n            justify-content: space-between;\n            gap: 60px;\n            position: relative;\n            z-index: 1;\n            margin-bottom: 60px;\n          }\n          \n          .footer-brand {\n            flex: 0 0 300px;\n          }\n          .footer-hero {\n            font-size: clamp(2rem, 3vw, 2.8rem);\n            font-weight: 800;\n            letter-spacing: -1px;\n            color: var(--text);\n            line-height: 1.1;\n            margin-bottom: 15px;\n          }\n          .footer-hero span { color: var(--text-muted); }\n          \n          .footer-link-grid {\n            display: grid;\n            grid-template-columns: repeat(4, 1fr);\n            gap: 30px;\n            flex: 1;\n          }\n          .f-col h4 {\n            color: var(--text);\n            font-size: 0.9rem;\n            font-weight: 600;\n            margin-bottom: 15px;\n          }\n          .f-col a {\n            display: block;\n            color: var(--text-muted);\n            text-decoration: none;\n            font-size: 0.85rem;\n            margin-bottom: 12px;\n            transition: color 0.2s;\n          }\n          .f-col a:hover { color: var(--text); }\n          \n          /* The Lower Deck (Strict Grid) */\n          .footer-lower {\n            display: grid;\n            grid-template-columns: 1fr auto 1fr;\n            align-items: center;\n            padding-top: 30px;\n            border-top: 1px solid rgba(255,255,255,0.05);\n            position: relative;\n            z-index: 1;\n          }\n          html.light-mode .footer-lower { border-top: 1px solid rgba(0,0,0,0.05); }\n\n          /* Listed-on: official directory badges */\n          .f-listed {\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            gap: 16px;\n            flex-wrap: wrap;\n            position: relative;\n            z-index: 1;\n            padding-bottom: 28px;\n          }\n          .f-listed-label {\n            font-size: 0.72rem;\n            text-transform: uppercase;\n            letter-spacing: 0.14em;\n            color: var(--text-muted);\n            font-weight: 600;\n          }\n          .f-listed-badges {\n            display: flex;\n            gap: 14px;\n            flex-wrap: wrap;\n            justify-content: center;\n            align-items: center;\n          }\n          .off-badge { display: inline-flex; transition: transform 0.2s, opacity 0.2s; }\n          .off-badge:hover { transform: translateY(-2px); opacity: 0.92; }\n          .off-badge img { height: 40px; width: auto; display: block; border-radius: 8px; }\n          .off-badge .b-light { display: none; }\n          html.light-mode .off-badge .b-light { display: block; }\n          html.light-mode .off-badge .b-dark { display: none; }\n          @media (max-width: 640px) {\n            .f-listed { flex-direction: column; gap: 12px; padding-bottom: 22px; }\n            .f-listed-badges { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px 14px; justify-items: center; align-items: center; width: 100%; max-width: 340px; }\n            .off-badge img { height: 36px; max-width: 100%; }\n          }\n\n          .f-legal {\n            text-align: left;\n            font-size: 0.85rem; \n            color: var(--text-muted); \n            font-weight: 500;\n          }\n          \n          /* --- THE EXPANDING DOCK LOGIC --- */\n          .f-socials {\n            display: flex;\n            gap: 12px;\n            justify-content: center;\n            align-items: center;\n          }\n\n          .expand-btn {\n            display: inline-flex;\n            align-items: center;\n            height: 44px;\n            max-width: 44px; /* Starts as a perfect circle */\n            background: rgba(255,255,255,0.02);\n            border: 1px solid var(--border);\n            border-radius: 44px;\n            overflow: hidden;\n            transition: max-width 0.4s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s, border-color 0.3s, box-shadow 0.3s;\n            text-decoration: none;\n            color: var(--text-muted);\n            white-space: nowrap;\n          }\n          html.light-mode .expand-btn { background: rgba(0,0,0,0.02); }\n\n          .expand-btn i {\n            width: 42px;\n            height: 44px;\n            flex-shrink: 0;\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            font-size: 1.3rem;\n            transition: color 0.3s;\n          }\n\n          .expand-btn span {\n            padding-right: 18px;\n            font-size: 0.85rem;\n            font-weight: 600;\n            opacity: 0;\n            transform: translateX(-10px);\n            transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);\n          }\n\n          /* Hover Expansion Physics */\n          .expand-btn:hover {\n            max-width: 160px; /* Slides open on hover */\n            box-shadow: 0 10px 20px rgba(0,0,0,0.2);\n          }\n          .expand-btn:hover span {\n            opacity: 1;\n            transform: translateX(0);\n          }\n\n          /* Brand Colors on Hover */\n          .expand-btn.gh:hover { border-color: rgba(255,255,255,0.3); color: #fff; background: rgba(255,255,255,0.05); }\n          .expand-btn.pl:hover { border-color: rgba(0,170,69,0.3); color: #00aa45; background: rgba(0,170,69,0.05); }\n          .expand-btn.ph:hover { border-color: rgba(255,97,84,0.3); color: #ff6154; background: rgba(255,97,84,0.05); }\n          .expand-btn.hn:hover { border-color: rgba(41,98,255,0.3); color: #2962ff; background: rgba(41,98,255,0.05); }\n          .expand-btn.cm:hover { border-color: rgba(75,137,245,0.3); color: #4b89f5; background: rgba(75,137,245,0.05); }\n          .expand-btn.tw:hover { border-color: rgba(29,161,242,0.3); color: #1da1f2; background: rgba(29,161,242,0.05); }\n          .expand-btn.li:hover { border-color: rgba(10,102,194,0.3); color: #0a66c2; background: rgba(10,102,194,0.05); }\n          .expand-btn.ig:hover { border-color: rgba(225,48,108,0.3); color: #e1306c; background: rgba(225,48,108,0.05); }\n\n          .f-madein {\n            text-align: right;\n            font-size: 0.8rem;\n            color: var(--text-muted);\n            font-weight: 500;\n            display: flex;\n            align-items: center;\n            justify-content: flex-end;\n            gap: 6px;\n          }\n\n          /* --- MOBILE RESPONSIVENESS --- */\n          @media (max-width: 1100px) {\n            .footer-upper { flex-direction: column; gap: 40px; }\n            .footer-brand { flex: none; max-width: 100%; }\n          }\n          @media (max-width: 768px) {\n            .footer-link-grid { grid-template-columns: repeat(2, 1fr); gap: 40px; }\n            .footer-lower { display: flex; flex-direction: column; gap: 25px; text-align: center; }\n            .f-legal, .f-madein { text-align: center; justify-content: center; }\n            \n            /* On mobile, permanently expand the pills into a 2-column grid */\n            .f-socials { order: -1; width: 100%; flex-wrap: wrap; gap: 10px; }\n            .expand-btn { \n              flex: 1 1 calc(50% - 12px); \n              max-width: none; \n              justify-content: flex-start;\n            }\n            .expand-btn span { opacity: 1; transform: translateX(0); }\n            \n            .footer-watermark { font-size: 22vw; bottom: 5%; }\n          }\n        </style>\n        \n        <div class="footer-wrapper">\n          <div class="footer-watermark">NITROIDE</div>\n          \n          <div class="container relative-z" style="padding-top: 0; padding-bottom: 0;">\n            \n            <div class="footer-upper">\n              <div class="footer-brand">\n                <a href="${s}index.html" style="text-decoration: none; display: inline-block; margin-bottom: 30px;">\n                  <img src="${s}logo/logo_white.png" alt="NitroIDE" class="logo-dark" style="height: 28px;">\n                  <img src="${s}logo/logo_black.png" alt="NitroIDE" class="logo-light" style="height: 28px; display: none;">\n                </a>\n                <div class="footer-hero">\n                  Zero latency.<br><span>Infinite focus.</span>\n                </div>\n                <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; max-width: 300px;">\n                  The ultimate client-side code editor. A free, open-source browser IDE built for modern frontend developers.\n                </p>\n              </div>\n              \n              <div class="footer-link-grid">\n                <div class="f-col">\n                  <h3>Workspace</h3>\n                  <a href="${s}tools/codebox.html?env=vanilla">Launch IDE</a>\n                  <a href="${s}docs.html">Documentation</a>\n                  <a href="${s}changelog.html">Changelog</a>\n                  <a href="${s}roadmap.html">Roadmap</a>\n                  <a href="${s}about.html">About NitroIDE</a>\n                  <a href="${s}contact.html">Contact</a>\n                  <a href=\"${s}showcase.html\">Showcase</a>\n                </div>\n                <div class="f-col">\n                  <h3>Free Sandboxes</h3>\n                  <a href="${a}react-online-playground.html">React Playground</a>\n                  <a href="${a}tailwind-online-editor.html">Tailwind Editor</a>\n                  <a href="${a}test-tailwind-css-online.html">Tailwind CSS Sandbox</a>\n                  <a href="${a}vanilla-javascript-sandbox.html">Vanilla JS Sandbox</a>\n                  <a href="${a}html-css-js-editor.html">HTML/CSS/JS Editor</a>\n                  <a href="${a}monaco-editor-online.html">Monaco Engine Online</a>\n                </div>\n                <div class="f-col">\n                  <h3>Top Use Cases</h3>\n                  <a href="${a}run-react-in-browser-no-install.html">Run React in Browser</a>\n                  <a href="${a}offline-html-editor.html">Offline HTML Editor</a>\n                  <a href="${a}private-code-editor-no-tracking.html">Private Code Editor</a>\n                  <a href="${a}chromebook-code-editor-free.html">Chromebook IDE</a>\n                  <a href="${a}low-ram-code-editor.html">Low RAM Editor</a>\n                  <a href="${a}responsive-design-tester.html">Responsive Design Tester</a>\n                  <a href="${a}export-code-to-zip.html">Export Code to ZIP</a>\n                </div>\n                <div class="f-col">\n                  <h3>Compare</h3>\n                  <a href="${a}vscode-online-alternative.html">VS Code Alternative</a>\n                  <a href="${a}codesandbox-lightweight-alternative.html">CodeSandbox Alt</a>\n                  <a href="${a}codesandbox-vs-nitroide.html">CodeSandbox vs NitroIDE</a>\n                  <a href="${a}codepen-vs-codesandbox.html">CodePen vs CodeSandbox</a>\n                  <a href="${a}codepen-alternative-no-login.html">CodePen Alternative</a>\n                  <a href="${a}replit-alternative-free.html">Replit Alternative</a>\n                  <a href="${a}jsfiddle-alternative.html">JSFiddle Alternative</a>\n                  <a href="${a}stackblitz-lightweight-alternative.html">StackBlitz Alternative</a>\n                </div>\n              </div>\n            </div>\n\n            <div class="f-listed">\n              <span class="f-listed-label">Listed on</span>\n              <div class="f-listed-badges">\n                <a class="off-badge" href="https://devhunt.org/tool/nitroide" target="_blank" rel="noopener" title="NitroIDE on DevHunt"><img class="b-dark" src="${s}assets/badges/devhunt-dark.svg" alt="NitroIDE - Featured on DevHunt" height="40"><img class="b-light" src="${s}assets/badges/devhunt-light.svg" alt="NitroIDE - Featured on DevHunt" height="40"></a>\n                <a class="off-badge" href="https://alternativeto.net/software/nitroide/about/?utm_source=badge&utm_medium=referral" target="_blank" rel="noopener" title="NitroIDE on AlternativeTo"><img class="b-dark" src="${s}assets/badges/alternativeto-dark.svg" alt="NitroIDE | AlternativeTo" height="40"><img class="b-light" src="${s}assets/badges/alternativeto-light.svg" alt="NitroIDE | AlternativeTo" height="40"></a>\n                <a class="off-badge" href="https://www.saashub.com/nitroide?utm_source=badge&utm_campaign=badge&utm_content=nitroide&badge_variant=color&badge_kind=nominated" target="_blank" rel="noopener" title="NitroIDE on SaaSHub"><img src="${s}assets/badges/saashub-nominated.png" alt="Nominated on SaaSHub" height="40"></a>\n                <a class="off-badge" href="https://sourceforge.net/projects/nitroide/" target="_blank" rel="noopener" title="NitroIDE on SourceForge"><img src="${s}assets/badges/sourceforge-button.png" alt="Download NitroIDE from SourceForge" height="40"></a>\n              </div>\n            </div>\n            <div class="footer-lower">\n              \n              <div class="f-legal">\n                © 2026 NitroIDE <span style="margin: 0 10px; opacity: 0.5;">|</span> \n                <a href="${s}legal.html" style="color: inherit; text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--text)'" onmouseout="this.style.color='var(--text-muted)'">Privacy</a> <span style="margin: 0 5px; opacity: 0.5;">|</span> \n                <a href="${s}legal.html#license" style="color: inherit; text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--text)'" onmouseout="this.style.color='var(--text-muted)'">Terms</a>\n              </div>\n              \n              <div class="f-socials">\n                <a href="https://github.com/nitroideofficial/nitroide" target="_blank" class="expand-btn gh"><i class="ph-bold ph-github-logo"></i><span>GitHub</span></a>\n                <a href="https://peerlist.io/nitroide" target="_blank" class="expand-btn pl"><i class="ph-bold ph-leaf"></i><span>Peerlist</span></a>\n                <a href="https://www.producthunt.com/@nitroide" target="_blank" class="expand-btn ph"><i class="ph-bold ph-rocket-launch"></i><span>Product Hunt</span></a>\n                <a href="https://hashnode.com/@nitroide" target="_blank" class="expand-btn hn"><i class="ph-bold ph-hash"></i><span>Hashnode</span></a>\n                <a href="https://www.commudle.com/users/nitroide" target="_blank" class="expand-btn cm"><i class="ph-bold ph-users-three"></i><span>Commudle</span></a>\n                <a href="https://x.com/trynitroide" target="_blank" class="expand-btn tw"><i class="ph-bold ph-twitter-logo"></i><span>Twitter</span></a>\n                <a href="https://www.linkedin.com/in/yashpanchal-nitro" target="_blank" class="expand-btn li"><i class="ph-bold ph-linkedin-logo"></i><span>LinkedIn</span></a>\n                <a href="https://www.instagram.com/nitroideofficial/" target="_blank" class="expand-btn ig"><i class="ph-bold ph-instagram-logo"></i><span>Instagram</span></a>\n              </div>\n              \n              <div class="f-madein">\n                Engineered with <i class="ph-bold ph-lightning" style="color: #00e5ff;"></i> in India\n              </div>\n              \n            </div>\n\n          </div>\n        </div>\n        `}}customElements.define("nitro-footer",NitroFooter);class NitroModals extends HTMLElement{connectedCallback(){this.innerHTML=`\n        <button class="fab" id="fab" aria-label="Scroll to top" onclick="window.scrollTo({top: 0, behavior: 'smooth'})"><i class="ph-bold ph-arrow-up"></i></button>\n        <button class="feedback-fab" onclick="toggleFeedbackModal()" aria-label="Open Feedback Form"><i class="ph-bold ph-chat-teardrop-text"></i></button>\n        <div class="feedback-backdrop" id="feedbackModal" onclick="handleFeedbackClick(event)">\n          <div class="feedback-card">\n            <div class="feedback-header">\n              <h3>Send Feedback</h3>\n              <button onclick="toggleFeedbackModal()" aria-label="Close Feedback Form"><i class="ph-bold ph-x"></i></button>\n            </div>\n            <div class="feedback-body">\n              <p class="feedback-desc">Found a bug or have a suggestion? Let us know directly.</p>\n              <form id="feedbackForm" onsubmit="sendFeedback(event)">\n                <input type="text" id="feedbackWebsite" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;opacity:0;height:0;width:0;border:0;padding:0;" value="">\n                <textarea id="feedbackText" placeholder="Tell us what you think..." required></textarea> <label for="feedbackSource" style="display:block;font-size:.8rem;color:var(--muted);margin:2px 0 6px;">How did you hear about us? <span style="opacity:.6">(optional)</span></label> <select id="feedbackSource" style="width:100%;background:var(--input-bg);border:1px solid var(--border);border-radius:8px;padding:10px 12px;color:var(--text);font-family:inherit;font-size:.9rem;margin-bottom:10px;outline:0;"><option value="">Prefer not to say</option><option>Google search</option><option>Social media</option><option>Friend / colleague</option><option>Directory site</option><option>Other</option></select>\n                <button type="submit" id="feedbackBtn" class="btn-launch primary-btn" style="width:100%;">\n                  <span id="feedbackBtnText">Send Message</span>\n                  <div id="feedbackSpinner" class="spinner" style="display: none;"></div>\n                </button>\n              </form>\n            </div>\n          </div>\n        </div>\n\n        <div class="cmd-palette-backdrop" id="cmdPalette">\n          <div class="cmd-palette">\n            <div class="cmd-input-wrap">\n              <i class="ph-bold ph-magnifying-glass"></i>\n              <input type="text" class="cmd-input" placeholder="Type a command or search..." id="cmdInput" autocomplete="off">\n            </div>\n            <div class="cmd-list" id="cmdList">\n              <a href="${rPath}tools/codebox.html" class="cmd-item"><div class="cmd-item-left"><i class="ph-fill ph-terminal-window"></i> Launch Workspace</div><div class="cmd-item-right">↵</div></a>\n              <div class="cmd-item" onclick="toggleTheme(); toggleCmdK();"><div class="cmd-item-left"><i class="ph-bold ph-sun"></i> Toggle Theme Aesthetic</div></div>\n              <a href="${rPath}docs.html" class="cmd-item"><div class="cmd-item-left"><i class="ph-bold ph-book"></i> View Documentation</div></a>\n            </div>\n          </div>\n        </div>\n        `}}function toggleFeedbackModal(){const e=document.getElementById("feedbackModal");e&&e.classList.toggle("active")}function handleFeedbackClick(e){"feedbackModal"===e.target.id&&toggleFeedbackModal()}function sendFeedback(e){e.preventDefault();const t=document.getElementById("feedbackBtnText"),n=document.getElementById("feedbackSpinner"),m=document.getElementById("feedbackText").value.trim();if(m.length<10){showToast("<i class='ph-bold ph-warning-circle' style='color:var(--error); margin-right:6px;'></i> Please write a little more detail (10+ characters).");return}t&&(t.style.display="none"),n&&(n.style.display="block"),fetch("/api/contact",{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify({form:"feedback",subject:"New Feedback from NitroIDE",message:m,source:((document.getElementById("feedbackSource")||{}).value||""),website:document.getElementById("feedbackWebsite").value})}).then(e=>e.json()).then(e=>{if(!e.success)throw new Error(e.error||"send failed");toggleFeedbackModal(),showToast("<i class='ph-bold ph-check-circle' style='color:var(--success); margin-right:6px;'></i> Feedback sent securely! <span style='opacity:.85'>Want to share publicly? <a href='https://www.trustpilot.com/evaluate/nitroide.com' target='_blank' rel='noopener'>Leave a review</a></span>",6000);const t=document.getElementById("feedbackForm");t&&t.reset()}).catch(e=>{const r=e&&e.message&&"send failed"!==e.message?e.message:"Could not send feedback. Please try again.";showToast("<i class='ph-bold ph-warning-circle' style='color:var(--error); margin-right:6px;'></i> "+r)}).finally(()=>{t&&(t.style.display="block"),n&&(n.style.display="none")})}customElements.define("nitro-modals",NitroModals),document.fonts.ready.then(()=>{setTimeout(()=>{document.body.classList.add("site-loaded"),setTimeout(()=>{const e=document.getElementById("techMarquee");e&&e.classList.add("loaded")},300)},100)}).catch(()=>{document.body.classList.add("site-loaded")}),document.addEventListener("DOMContentLoaded",()=>{if(document.body.classList.contains("workspace-body"))return;document.querySelectorAll(".mockup-window").forEach(e=>{e.addEventListener("mousemove",t=>{const n=e.getBoundingClientRect(),o=t.clientX-n.left,s=t.clientY-n.top,a=n.width/2,i=n.height/2;e.style.transform=`perspective(1000px) rotateX(${(s-i)/i*-4}deg) rotateY(${(o-a)/a*4}deg) scale3d(1.02, 1.02, 1.02)`,e.style.transition="none"}),e.addEventListener("mouseleave",()=>{e.style.transform="perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)",e.style.transition="transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)"})});if("IntersectionObserver"in window){const e=new IntersectionObserver((e,t)=>{e.forEach(e=>{e.isIntersecting&&(e.target.classList.add("active"),t.unobserve(e.target))})},{threshold:.1});document.querySelectorAll('[class*="reveal-"]').forEach(t=>e.observe(t));}setTimeout(()=>{document.querySelectorAll('[class*="reveal-"]:not(.active)').forEach(n=>{const r=n.getBoundingClientRect();if(r.top<1.25*window.innerHeight&&r.bottom>0)n.classList.add("active")})},2500);const t=document.getElementById("globalSpotlight");t&&(window.addEventListener("mousemove",e=>{t.style.opacity="1",t.style.left=`${e.clientX}px`,t.style.top=`${e.clientY}px`}),window.addEventListener("mouseleave",()=>t.style.opacity="0"));let n=!1;const o=new IntersectionObserver(e=>{e[0]&&e[0].isIntersecting&&!n&&(n=!0,document.querySelectorAll(".stat-num").forEach(e=>{let t=parseInt(e.getAttribute("data-target")),n=parseInt(e.getAttribute("data-start")||0),o=e.getAttribute("data-suffix"),s=null;const a=i=>{s||(s=i);const l=Math.min((i-s)/1500,1);e.innerHTML=Math.floor(l*(t-n)+n)+o,l<1&&window.requestAnimationFrame(a)};window.requestAnimationFrame(a)}))},{threshold:.5}),s=document.getElementById("statsRow");s&&o.observe(s),document.querySelectorAll(".magnetic-btn").forEach(e=>{e.addEventListener("mousemove",t=>{const n=e.getBoundingClientRect();e.style.transform=`translate(${.3*(t.clientX-n.left-n.width/2)}px, ${.3*(t.clientY-n.top-n.height/2)}px)`}),e.addEventListener("mouseleave",()=>{e.style.transform="translate(0px, 0px)"})}),document.querySelectorAll(".bento-card").forEach(e=>{e.addEventListener("mousemove",t=>{const n=e.getBoundingClientRect();e.style.setProperty("--mouse-x",t.clientX-n.left+"px"),e.style.setProperty("--mouse-y",t.clientY-n.top+"px")})}),window.addEventListener("scroll",()=>{const e=document.getElementById("floatingNav"),t=document.getElementById("fab");e&&(window.scrollY>300?e.classList.add("scrolled"):e.classList.remove("scrolled")),t&&(window.scrollY>500?t.classList.add("visible"):t.classList.remove("visible"))})}),document.addEventListener("DOMContentLoaded",()=>{const e=document.getElementById("blogGrid");if(!e)return;let t=[];const n=document.getElementById("articleCount"),o=document.getElementById("articleSearch");function s(t){e.innerHTML="",n&&(n.innerHTML=`<i class="ph-fill ph-files" style="color: #00e5ff;"></i> ${t.length} Articles Found`),0!==t.length?t.forEach(t=>{const n=document.createElement("div");n.className="bento-card",n.innerHTML=`\n        <i class="ph-duotone ${t.CTA_ICON||"ph-article"} bento-icon" style="color: ${t.THEME_COLOR||"#ffffff"};"></i>\n        <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 8px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase;">\n          ${t.CATEGORY} • ${t.DATE}\n        </div>\n        <h2>${t.H1_TITLE}</h2>\n        <div class="bento-content-swap">\n          <p class="bento-text">${t.META_DESC}</p>\n          <div class="bento-code" style="display:flex; align-items:flex-end;">\n            <a href="${t.SLUG}.html" class="btn-compact primary-btn" style="border-radius:6px; text-decoration:none;">\n              Read Article <i class="ph-bold ph-arrow-right"></i>\n            </a>\n          </div>\n        </div>\n      `,e.appendChild(n)}):e.innerHTML='<div class="no-results"><i class="ph-duotone ph-ghost" style="font-size: 3rem; margin-bottom: 10px; display:block;"></i>No articles found matching your search.</div>'}!async function(){try{const e=await fetch("blog-data.json");if(!e.ok)throw new Error("Failed to load blog data");const n=await e.json(),o=[],a=new Set;for(const e of n)a.has(e.SLUG)||(a.add(e.SLUG),o.push(e));t=o,s(t)}catch(t){console.error("Error loading blogs:",t),e.innerHTML='<p style="color: red; text-align: center; grid-column: 1/-1;">Unable to load articles at this time.</p>',n&&(n.innerText="Error loading articles")}}(),o&&o.addEventListener("input",e=>{const n=e.target.value.toLowerCase().trim();s(t.filter(e=>e.H1_TITLE&&e.H1_TITLE.toLowerCase().includes(n)||e.META_DESC&&e.META_DESC.toLowerCase().includes(n)||e.CATEGORY&&e.CATEGORY.toLowerCase().includes(n)||e.KEYWORDS&&e.KEYWORDS.toLowerCase().includes(n)||e.CONTENT&&e.CONTENT.toLowerCase().includes(n)))})}),document.addEventListener("DOMContentLoaded",()=>{const e=document.querySelector(".pulse-ticker-box"),t=document.getElementById("pulse-blog-container"),n=document.getElementById("archive-stream"),o=document.getElementById("eco-total-updates"),s=document.getElementById("eco-platform-count"),a=document.getElementById("eco-latest-date"),i=document.getElementById("eco-search"),l=document.getElementById("eco-platform-filters"),r=document.getElementById("eco-sort-toggle"),c=document.getElementById("eco-result-count");let d=null;function p(e){if(Number.isFinite(e?.timestamp))return e.timestamp;const t=new Date(e?.published_timestamp||e?.published_at||e?.created_at||e?.date).getTime();return Number.isNaN(t)?0:t}function m(e){return e?new Date(e).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}):"Latest"}function u(e){const t=p(e);return{platform:"Dev.to",icon:"ph-dev-to-logo",color:"#ffffff",title:e.title,link:e.url,url:e.url,date:m(t),timestamp:t}}async function h(e=5){const m=o=>Array.isArray(o)?o.map(u).sort((e,t)=>p(t)-p(e)):[];let l=[];try{const t=`https://dev.to/api/articles?username=${encodeURIComponent("nitroide")}&per_page=${e}&_=${Date.now()}`;const n=await fetch(t,{cache:"reload",headers:{Accept:"application/json"}});if(n.ok)l=m(await n.json());else console.error("Dev.to API "+n.status);}catch(err){console.error("Archive Dev.to fetch failed (AdBlocker likely):",err)}let s=[];try{const r=await fetch("/assets/devto-latest.json",{cache:"reload"});if(r.ok)s=m(await r.json()).slice(0,e)}catch(err){}const seen=new Set,out=[];for(const a of[...l,...s]){if(a&&a.url&&!seen.has(a.url)){seen.add(a.url);out.push(a)}}return out.sort((e,t)=>p(t)-p(e)).slice(0,e)}if(e&&"undefined"!=typeof pulseLogs){!function(t){if(!e)return;const n=t.map(e=>({...e,timestamp:p(e)})).sort((e,t)=>p(t)-p(e)).slice(0,4);e.innerHTML=n.map(e=>`\n      <a href="${e.link}" target="_blank" rel="noopener" class="ticker-item" style="--ticker-color: ${e.color};">\n        <span class="t-icon"><i class="ph-bold ${e.icon}"></i></span>\n        <div class="t-content-flex">\n          <span class="t-platform">${e.platform}</span>\n          <span class="t-text">${e.title}</span>\n          <span class="t-date">${e.date}</span>\n        </div>\n        <i class="ph-bold ph-arrow-up-right t-arrow"></i>\n      </a>\n    `).join("")}(pulseLogs.filter(e=>"Hashnode"!==e.platform).map(e=>({...e,timestamp:p(e)})))}async function g(e){if(t)if("devto"===e){if(d&&Date.now()-d.fetchedAt<3e5)return f(d,"devto");try{const e=await h(1);Array.isArray(e)&&e.length>0?(d={title:e[0].title,url:e[0].url,date:e[0].date,fetchedAt:Date.now()},f(d,"devto")):t.innerHTML='<p class="pulse-empty-state">No Dev.to articles published yet.</p>'}catch(e){console.error("Dev.to Fetch Blocked:",e),t.innerHTML='<p class="pulse-empty-state">Dev.to could not load in this browser session.</p>'}}else if("hashnode"===e){const e=("undefined"!=typeof pulseLogs?pulseLogs.find(e=>"Hashnode"===e.platform):null)||{title:"Why I Built a Zero-Latency Browser IDE",link:"https://hashnode.com/@nitroide",date:"May 2026"};f({title:e.title,url:e.link||e.url,date:e.date},"hashnode")}}function f(e,n){const o="devto"===n?'<i class="ph-bold ph-dev-to-logo"></i>':'<i class="ph-bold ph-hash"></i>';t.innerHTML=`\n      <a href="${e.url}" target="_blank" rel="noopener" class="pulse-blog-link ${"devto"===n?"is-devto":"is-hashnode"}">\n        <div class="pulse-blog-meta">\n          <span class="pulse-blog-source">${o} ${"devto"===n?"Dev.to Article":"Hashnode Blog"}</span>\n          <span>${e.date}</span>\n        </div>\n        <h3>${e.title}</h3>\n        <p>Explore the technical breakdown, decisions, and implementation details directly on the publishing network.</p>\n        <div class="pulse-read-more">\n          Read Full Log <i class="ph-bold ph-arrow-right"></i>\n        </div>\n      </a>\n    `}if(window.switchPulseTab=function(e,n){document.querySelectorAll(".p-tab").forEach(e=>e.classList.remove("active"));const o=n?.currentTarget||document.querySelector(`.p-tab[data-platform="${e}"]`);o?.classList.add("active"),t.innerHTML='<p class="pulse-loading"><i class="ph-bold ph-spinner-gap"></i> Fetching...</p>',g(e)},t&&g("devto"),n&&"undefined"!=typeof pulseLogs){n.innerHTML='<p class="pulse-loading"><i class="ph-bold ph-spinner-gap"></i> Syncing timelines...</p>';const w={logs:[],platform:"All",query:"",sort:"desc"};function b(e){return p(e)}function y(){!function(e){if(!o||!s||!a)return;const t=[...e].sort((e,t)=>b(t)-b(e)),n=new Set(t.map(e=>e.platform).filter(Boolean));o.textContent=e.length,s.textContent=n.size,a.textContent=t[0]?.date||"No updates"}(w.logs),function(){if(!l)return;const e=["All",...new Set(w.logs.map(e=>e.platform).filter(Boolean))];e.includes(w.platform)||(w.platform="All"),l.innerHTML=e.map(e=>{const t="All"===e?w.logs.length:w.logs.filter(t=>t.platform===e).length;return`\n          <button class="eco-filter-chip${e===w.platform?" is-active":""}" type="button" data-platform="${e}">\n            ${e}<span class="eco-filter-count">${t}</span>\n          </button>\n        `}).join(""),l.querySelectorAll(".eco-filter-chip").forEach(e=>{e.addEventListener("click",()=>{w.platform=e.dataset.platform||"All",y()})})}();const e=function(){const e=w.query.trim().toLowerCase();return w.logs.filter(e=>"All"===w.platform||e.platform===w.platform).filter(t=>!e||[t.title,t.platform,t.date].filter(Boolean).some(t=>t.toLowerCase().includes(e))).sort((e,t)=>{const n=b(t)-b(e);return"desc"===w.sort?n:-n})}();!function(e){if(n.innerHTML="",0===e.length)return void(n.innerHTML='\n          <div class="eco-no-results">\n            <i class="ph-bold ph-magnifying-glass"></i>\n            <strong>No matching updates</strong>\n            <span>Try another search term or platform filter.</span>\n          </div>\n        ');e.forEach(e=>{const t="Dev.to"===e.platform?"rgba(255,255,255,0.06)":`${e.color}18`,o=function(e){const t=new Date(e);return Number.isNaN(t.getTime())?{month:"NEW",day:e}:{month:t.toLocaleDateString("en-US",{month:"short"}),day:t.toLocaleDateString("en-US",{day:"2-digit"})}}(e.date);n.innerHTML+=`\n          <a href="${e.link}" target="_blank" rel="noopener" class="eco-stream-card" style="--stream-color: ${e.color}; --stream-bg: ${t};">\n            <div class="stream-date-block">\n              <span>${o.month}</span>\n              <strong>${o.day}</strong>\n            </div>\n            <div class="stream-icon-box">\n              <i class="ph-bold ${e.icon}"></i>\n            </div>\n            <div class="stream-content">\n              <div class="stream-header">\n                <span class="stream-platform">${e.platform}</span>\n                <span class="stream-date">${e.date}</span>\n              </div>\n              <div class="stream-title">${e.title}</div>\n            </div>\n            <div class="stream-action">\n              Open <i class="ph-bold ph-arrow-up-right"></i>\n            </div>\n          </a>\n        `})}(e),function(e){if(!c)return;const t=1===e?"update":"updates",n="desc"===w.sort?"newest first":"oldest first",o="All"===w.platform?"all platforms":w.platform;c.textContent=`${e} ${t} shown, ${n}, ${o}.`}(e.length)}function v(e){w.logs=e.map(e=>({...e,timestamp:b(e)})).sort((e,t)=>b(t)-b(e)),y()}i?.addEventListener("input",()=>{w.query=i.value,y()}),r?.addEventListener("click",()=>{w.sort="desc"===w.sort?"asc":"desc",r.dataset.sort=w.sort,r.innerHTML="desc"===w.sort?'<i class="ph-bold ph-sort-descending"></i> Newest first':'<i class="ph-bold ph-sort-ascending"></i> Oldest first',y()});const x=pulseLogs.map(e=>({...e,timestamp:p(e)}));h(100).then(e=>{v([...x,...e].sort((e,t)=>t.timestamp-e.timestamp))}).catch(e=>{console.error("Archive Dev.to fetch failed (AdBlocker likely):",e);v([...x].sort((e,t)=>t.timestamp-e.timestamp))})}});;if("serviceWorker"in navigator&&"https:"===location.protocol){window.addEventListener("load",function(){var hadSW=!!navigator.serviceWorker.controller;navigator.serviceWorker.register("/sw.js",{updateViaCache:"none"}).catch(function(e){console.warn("NitroIDE SW registration failed:",e)});navigator.serviceWorker.addEventListener("controllerchange",function(){if(hadSW)nitroShowUpdateToast()})})};function nitroShowUpdateToast(){if(document.getElementById("nitro-sw-toast"))return;var go=function(){var t=document.createElement("div");t.id="nitro-sw-toast";t.setAttribute("role","status");t.style.cssText="position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:99999;display:flex;align-items:center;gap:12px;background:#18181b;border:1px solid rgba(255,255,255,.14);color:#e4e4e7;padding:12px 16px;border-radius:14px;font-size:.9rem;box-shadow:0 12px 40px rgba(0,0,0,.5);max-width:calc(100vw - 40px);font-family:Inter,system-ui,sans-serif";var s=document.createElement("span");s.textContent="New version available";var b=document.createElement("button");b.textContent="Refresh";b.style.cssText="background:#00e5ff;border:none;color:#000;font-weight:700;padding:8px 16px;border-radius:999px;cursor:pointer;font-size:.85rem";b.onclick=function(){window.location.reload()};var x=document.createElement("button");x.textContent="\u2715";x.setAttribute("aria-label","Dismiss update notification");x.style.cssText="background:none;border:none;color:#a1a1aa;cursor:pointer;font-size:1rem;padding:4px;line-height:1";x.onclick=function(){t.remove()};t.appendChild(s);t.appendChild(b);t.appendChild(x);document.body.appendChild(t)};if(document.body)go();else document.addEventListener("DOMContentLoaded",go)}(function(){function injectSkip(){if(document.getElementById("skip-link")||!document.body)return;var a=document.createElement("a");a.id="skip-link";a.className="skip-link";a.textContent="Skip to content";var m=document.getElementById("main")||document.querySelector('main,[role="main"]');if(m){if(!m.id)m.id="main";if(!m.hasAttribute("tabindex"))m.setAttribute("tabindex","-1");a.href="#"+m.id}else{a.href="#main"}document.body.insertBefore(a,document.body.firstChild)}if("loading"===document.readyState)document.addEventListener("DOMContentLoaded",injectSkip);else injectSkip()})();;document.addEventListener("keydown",function(e){if("?"!==e.key||e.ctrlKey||e.metaKey||e.altKey)return;if(!document.getElementById("codebox"))return;var t=e.target;if(t&&t.closest&&t.closest("input,textarea,.monaco-editor,[contenteditable]"))return;window.location.href="/cheatsheet.html"});;document.addEventListener("DOMContentLoaded",function(){syncWordWrapMenu()});
/* ================= v30: BYOK AI ================= */
const AI_PROVIDERS = {
  groq: { label: 'Groq', defaultModel: 'openai/gpt-oss-20b', keyUrl: 'https://console.groq.com/keys',
    help: 'Free, no card. Fastest with the most generous free daily limit. Get a key at console.groq.com/keys.' },
  gemini: { label: 'Google Gemini', defaultModel: 'gemini-2.5-flash-lite', keyUrl: 'https://aistudio.google.com/apikey',
    help: 'Free, no card at aistudio.google.com. Never enable billing on that project or you lose the free tier.' },
  openrouter: { label: 'OpenRouter', defaultModel: 'qwen/qwen3.8-27b:free', keyUrl: 'https://openrouter.ai/keys',
    help: 'Free :free models at openrouter.ai/keys — 50 requests/day. Access to 300+ models. Prompts may train models unless you opt out in their privacy settings.' }
};
function aiGetProvider(){ try { return localStorage.getItem('nitro_ai_provider') || 'groq'; } catch(e){ return 'groq'; } }
function aiGetKey(p){ p = p || aiGetProvider(); try { return localStorage.getItem('nitro_ai_key_' + p) || ''; } catch(e){ return ''; } }
function aiGetModel(p){ p = p || aiGetProvider(); try { return localStorage.getItem('nitro_ai_model_' + p) || AI_PROVIDERS[p].defaultModel; } catch(e){ return AI_PROVIDERS[p].defaultModel; } }
function aiSetAll(p, key, model){
  try {
    localStorage.setItem('nitro_ai_provider', p);
    if (key) localStorage.setItem('nitro_ai_key_' + p, key.trim());
    localStorage.setItem('nitro_ai_model_' + p, (model || '').trim() || AI_PROVIDERS[p].defaultModel);
  } catch(e){}
}
function aiHasKey(){ return !!aiGetKey(); }




function aiFriendlyError(err){
  const m = String((err && err.message) || err);
  if (m === 'NO_KEY') return 'No API key saved yet.';
  if (m === 'NETWORK') return 'Network blocked the request. Check your connection, or try another provider in AI Settings.';
  if (m === 'HTTP_401' || m === 'HTTP_403') return 'Key rejected (401/403). Check the key in AI Key & Model — make sure it was copied fully.';
  if (m === 'HTTP_429') return 'Rate limit hit. Free tiers are limited per day — try again later or switch provider in AI Key & Model.';
  if (m === 'HTTP_400') return 'Bad request (400). The model name may be wrong — check it in AI Key & Model.';
  if (m === 'EMPTY') return 'The AI returned an empty response. Try again.';
  if (/^HTTP_/.test(m)) return 'Request failed (' + m.slice(5) + '). Try again or check AI Settings.';
  return 'Something went wrong. Try again.';
}
function aiActiveEditor(){
  try {
    if (typeof monaco !== 'undefined' && monaco.editor && monaco.editor.getFocusedEditor) {
      const ed = monaco.editor.getFocusedEditor();
      if (ed) return ed;
    }
  } catch(e){}
  if (typeof aiLastEditor !== 'undefined' && aiLastEditor) return aiLastEditor;
  try {
    for (const ed of [htmlMonaco, cssMonaco, jsMonaco]) {
      if (ed && ed.getSelection && !ed.getSelection().isEmpty()) { aiLastEditor = ed; return ed; }
    }
  } catch(e){}
  try { return (typeof jsMonaco !== 'undefined' && jsMonaco) || (typeof htmlMonaco !== 'undefined' && htmlMonaco) || null; }
  catch(e){ return null; }
}



function aiEscapeHtml(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }















/* ================= v30: One-click deploy ================= */
function deploySyncEditors(){
  try {
    if (typeof htmlMonaco !== 'undefined' && htmlMonaco && typeof activeFiles !== 'undefined' && activeFiles) {
      vfs[activeFiles.html] = htmlMonaco.getValue();
      vfs[activeFiles.css] = cssMonaco.getValue();
      vfs[activeFiles.js] = jsMonaco.getValue();
    }
  } catch(e){}
}
function deployGetFiles(){
  deploySyncEditors();
  const files = {};
  try {
    const keys = Object.keys(vfs || {});
    for (const k of keys) {
      if (typeof vfs[k] === 'string') files[k] = vfs[k];
    }
  } catch(e){}
  return files;
}
function deployB64(str){
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  const CH = 0x8000;
  for (let i = 0; i < bytes.length; i += CH) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + CH));
  return btoa(bin);
}
function deployCrc32(bytes){
  let table = deployCrc32._t;
  if (!table) {
    table = deployCrc32._t = new Uint32Array(256);
    for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1); table[n] = c; }
  }
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < bytes.length; i++) crc = table[(crc ^ bytes[i]) & 0xFF] ^ (crc >>> 8);
  return (crc ^ 0xFFFFFFFF) >>> 0;
}
function deployBuildZip(files){
  const enc = new TextEncoder();
  const chunks = []; const central = [];
  let offset = 0;
  for (const name of Object.keys(files)) {
    const nameB = enc.encode(name);
    const dataB = enc.encode(files[name]);
    const crc = deployCrc32(dataB);
    const lh = new DataView(new ArrayBuffer(30));
    lh.setUint32(0, 0x04034b50, true);
    lh.setUint16(4, 20, true); lh.setUint16(6, 0x0800, true); lh.setUint16(8, 0, true);
    lh.setUint16(10, 0, true); lh.setUint16(12, 0x21, true);
    lh.setUint32(14, crc, true); lh.setUint32(18, dataB.length, true); lh.setUint32(22, dataB.length, true);
    lh.setUint16(26, nameB.length, true); lh.setUint16(28, 0, true);
    chunks.push(lh.buffer, nameB.buffer, dataB.buffer);
    const ch = new DataView(new ArrayBuffer(46));
    ch.setUint32(0, 0x02014b50, true);
    ch.setUint16(4, 20, true); ch.setUint16(6, 20, true); ch.setUint16(8, 0x0800, true); ch.setUint16(10, 0, true);
    ch.setUint16(12, 0, true); ch.setUint16(14, 0x21, true);
    ch.setUint32(16, crc, true); ch.setUint32(20, dataB.length, true); ch.setUint32(24, dataB.length, true);
    ch.setUint16(28, nameB.length, true); ch.setUint16(30, 0, true); ch.setUint16(32, 0, true);
    ch.setUint16(34, 0, true); ch.setUint16(36, 0, true); ch.setUint32(38, 0, true); ch.setUint32(42, offset, true);
    central.push(ch.buffer, nameB.buffer);
    offset += 30 + nameB.length + dataB.length;
  }
  const cdStart = offset;
  let cdSize = 0;
  for (const c of central) cdSize += c.byteLength;
  const end = new DataView(new ArrayBuffer(22));
  end.setUint32(0, 0x06054b50, true);
  end.setUint16(8, central.length / 2, true); end.setUint16(10, central.length / 2, true);
  end.setUint32(12, cdSize, true); end.setUint32(16, cdStart, true);
  return new Blob(chunks.concat(central).concat([end.buffer]), { type: 'application/zip' });
}
function deployLog(msg, isErr){
  const el = document.getElementById('deployLog');
  if (!el) return;
  const d = document.createElement('div');
  d.style.cssText = 'padding:3px 0;color:' + (isErr ? 'var(--error)' : 'var(--text-muted)') + ';font-size:.82rem;';
  d.textContent = msg;
  el.appendChild(d);
  el.scrollTop = el.scrollHeight;
}
function deployClearLog(){ const el = document.getElementById('deployLog'); if (el) el.innerHTML = ''; const r = document.getElementById('deployResult'); if (r) r.innerHTML = ''; }
function openDeployModal(tab){
  deployClearLog();
  const m = document.getElementById('deployModal');
  if (m) m.classList.add('active');
  if (tab) deploySwitchTab(tab);
  const dd = document.getElementById('optionsMenu');
  if (dd) dd.classList.remove('active');
}
function deployCloseModal(){ const m = document.getElementById('deployModal'); if (m) m.classList.remove('active'); }
function deploySwitchTab(tab){
  const gh = document.getElementById('deployTabGh');
  const nl = document.getElementById('deployTabNl');
  const ghBtn = document.getElementById('deployTabGhBtn');
  const nlBtn = document.getElementById('deployTabNlBtn');
  const isGh = tab !== 'netlify';
  if (gh) gh.style.display = isGh ? 'block' : 'none';
  if (nl) nl.style.display = isGh ? 'none' : 'block';
  if (ghBtn) ghBtn.classList.toggle('active', isGh);
  if (nlBtn) nlBtn.classList.toggle('active', !isGh);
}
async function deployToGitHub(){
  const tokenEl = document.getElementById('ghToken');
  const nameEl = document.getElementById('ghRepo');
  const btn = document.getElementById('ghDeployBtn');
  const token = tokenEl ? tokenEl.value.trim() : '';
  let repo = nameEl ? nameEl.value.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-') : '';
  if (!token) { showToast("<i class='ph-bold ph-warning-circle' style='margin-right:6px;'></i> Paste your GitHub token first."); return; }
  if (!repo) { showToast("<i class='ph-bold ph-warning-circle' style='margin-right:6px;'></i> Give your site a name."); return; }
  const files = deployGetFiles();
  if (!Object.keys(files).length) { showToast("<i class='ph-bold ph-warning-circle' style='margin-right:6px;'></i> Nothing to deploy."); return; }
  if (btn) btn.disabled = true;
  deployClearLog();
  const H = { 'Authorization': 'Bearer ' + token, 'Accept': 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'Content-Type': 'application/json' };
  try {
    deployLog('Validating token...');
    let res = await fetch('https://api.github.com/user', { headers: H });
    if (!res.ok) throw new Error('Token rejected (' + res.status + '). Check the token and the repo scope.');
    const user = await res.json();
    const owner = user.login;
    deployLog('Signed in as ' + owner);
    deployLog('Creating repo ' + repo + '...');
    res = await fetch('https://api.github.com/user/repos', { method: 'POST', headers: H, body: JSON.stringify({ name: repo, private: false, auto_init: true }) });
    if (res.status === 422) throw new Error('Repo name "' + repo + '" is taken. Pick another name.');
    if (!res.ok) throw new Error('Repo creation failed (' + res.status + ').');
    const names = Object.keys(files);
    for (let i = 0; i < names.length; i++) {
      const path = names[i];
      deployLog('Uploading ' + path + ' (' + (i + 1) + '/' + names.length + ')...');
      res = await fetch('https://api.github.com/repos/' + owner + '/' + repo + '/contents/' + encodeURIComponent(path), {
        method: 'PUT', headers: H,
        body: JSON.stringify({ message: 'Deploy via NitroIDE', content: deployB64(files[path]), branch: 'main' })
      });
      if (!res.ok) throw new Error('Upload failed for ' + path + ' (' + res.status + ').');
    }
    deployLog('Uploading .nojekyll...');
    await fetch('https://api.github.com/repos/' + owner + '/' + repo + '/contents/.nojekyll', {
      method: 'PUT', headers: H, body: JSON.stringify({ message: 'Deploy via NitroIDE', content: deployB64(''), branch: 'main' })
    });
    deployLog('Enabling GitHub Pages...');
    res = await fetch('https://api.github.com/repos/' + owner + '/' + repo + '/pages', {
      method: 'POST', headers: H, body: JSON.stringify({ build_type: 'legacy', source: { branch: 'main', path: '/' } })
    });
    if (!res.ok && res.status !== 409) throw new Error('Pages enable failed (' + res.status + ').');
    const url = 'https://' + owner + '.github.io/' + repo + '/';
    deployLog('Waiting for the first build (usually 1-2 min)...');
    for (let i = 0; i < 30; i++) {
      await new Promise(function(r){ setTimeout(r, 10000); });
      res = await fetch('https://api.github.com/repos/' + owner + '/' + repo + '/pages/builds/latest', { headers: H });
      if (res.ok) { const b = await res.json(); if (b.status === 'built') break; if (b.status === 'errored') throw new Error('Pages build errored. Check the repo on GitHub.'); }
      deployLog('Still building...');
    }
    const rEl = document.getElementById('deployResult');
    if (rEl) rEl.innerHTML = '<div style="background:rgba(16,185,129,.1);border:1px solid rgba(16,185,129,.3);border-radius:10px;padding:14px;margin-top:12px;"><div style="font-weight:700;color:var(--success);margin-bottom:6px;"><i class="ph-bold ph-check-circle"></i> Live!</div><a href="' + url + '" target="_blank" rel="noopener" style="color:#00e5ff;word-break:break-all;">' + url + '</a></div>';
    deployLog('Done.');
    if (tokenEl) tokenEl.value = '';
  } catch(e){
    deployLog('Error: ' + (e.message || e), true);
  } finally {
    if (btn) btn.disabled = false;
  }
}
async function deployToNetlify(){
  const tokenEl = document.getElementById('nlToken');
  const nameEl = document.getElementById('nlSite');
  const btn = document.getElementById('nlDeployBtn');
  const token = tokenEl ? tokenEl.value.trim() : '';
  let name = nameEl ? nameEl.value.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-') : '';
  if (!token) { showToast("<i class='ph-bold ph-warning-circle' style='margin-right:6px;'></i> Paste your Netlify token first."); return; }
  const files = deployGetFiles();
  if (!Object.keys(files).length) { showToast("<i class='ph-bold ph-warning-circle' style='margin-right:6px;'></i> Nothing to deploy."); return; }
  if (btn) btn.disabled = true;
  deployClearLog();
  const H = { 'Authorization': 'Bearer ' + token };
  try {
    deployLog('Building zip...');
    const zip = deployBuildZip(files);
    let siteId, siteUrl;
    if (name) {
      deployLog('Creating site "' + name + '"...');
      let res = await fetch('https://api.netlify.com/api/v1/sites', { method: 'POST', headers: Object.assign({ 'Content-Type': 'application/json' }, H), body: JSON.stringify({ name: name }) });
      if (res.status === 422) throw new Error('Site name "' + name + '" is taken. Pick another.');
      if (!res.ok) throw new Error('Site creation failed (' + res.status + ').');
      const site = await res.json();
      siteId = site.id;
    }
    deployLog('Uploading to Netlify...');
    const upUrl = siteId ? 'https://api.netlify.com/api/v1/sites/' + siteId + '/deploys' : 'https://api.netlify.com/api/v1/sites';
    let res = await fetch(upUrl, { method: 'POST', headers: Object.assign({ 'Content-Type': 'application/zip' }, H), body: zip });
    if (!res.ok) throw new Error('Deploy failed (' + res.status + ').');
    const dep = await res.json();
    const deployId = dep.id || (dep.deploy_id);
    siteUrl = dep.ssl_url || dep.url;
    deployLog('Deploying... (usually under a minute)');
    for (let i = 0; i < 24; i++) {
      await new Promise(function(r){ setTimeout(r, 5000); });
      res = await fetch('https://api.netlify.com/api/v1/deploys/' + deployId, { headers: H });
      if (res.ok) { const d = await res.json(); if (d.state === 'ready') { siteUrl = d.ssl_url || d.url || siteUrl; break; } if (d.state === 'error') throw new Error('Netlify deploy errored.'); }
      deployLog('Still deploying...');
    }
    const rEl = document.getElementById('deployResult');
    if (rEl && siteUrl) rEl.innerHTML = '<div style="background:rgba(16,185,129,.1);border:1px solid rgba(16,185,129,.3);border-radius:10px;padding:14px;margin-top:12px;"><div style="font-weight:700;color:var(--success);margin-bottom:6px;"><i class="ph-bold ph-check-circle"></i> Live!</div><a href="' + siteUrl + '" target="_blank" rel="noopener" style="color:#00e5ff;word-break:break-all;">' + siteUrl + '</a></div>';
    deployLog('Done.');
    if (tokenEl) tokenEl.value = '';
  } catch(e){
    deployLog('Error: ' + (e.message || e), true);
  } finally {
    if (btn) btn.disabled = false;
  }
}

/* ================= v30.1: AI Chat panel ================= */
function aiToggleSidebar(force){
  const sb = document.getElementById('aiSidebar');
  const bd = document.getElementById('aiSidebarBackdrop');
  if (!sb) return;
  const open = typeof force === 'boolean' ? force : !sb.classList.contains('open');
  sb.classList.toggle('open', open);
  if (bd) bd.classList.toggle('open', open);
  const btn = document.getElementById('aiSidebarBtn');
  if (btn) { btn.style.color = open ? '#00e5ff' : ''; btn.style.borderColor = open ? 'rgba(0,229,255,.5)' : ''; }
  if (open) {
    aiChatEnsureBoot();
    setTimeout(aiChatRenderContext, 100);
    setTimeout(function(){ const t = document.getElementById('aiChatInput'); if (t && window.innerWidth > 768) t.focus(); }, 300);
  }
  try { localStorage.setItem('nitro_ai_sidebar', open ? '1' : '0'); } catch(e){}
}
try {
  if (localStorage.getItem('nitro_ai_sidebar') === '1') {
    setTimeout(function(){ aiToggleSidebar(true); }, 800);
  }
} catch(e){}
function aiChatSuggestions(){
  const box = document.getElementById('aiChatMessages');
  if (!box) return;
  const div = document.createElement('div');
  div.className = 'ai-suggest-row';
  div.id = 'aiSuggestRow';
  const items = ['Explain this file', 'Find bugs', 'Make it responsive', 'Add comments'];
  div.innerHTML = items.map(function(s){ return '<button onclick="aiChatSuggest(\'' + s + '\')">' + s + '</button>'; }).join('');
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}
function aiChatSuggest(text){
  const r = document.getElementById('aiSuggestRow');
  if (r && r.parentNode) r.parentNode.removeChild(r);
  aiChatSend(text);
}
function aiToggleCtx(label){
  if (aiExcludedCtx[label]) delete aiExcludedCtx[label]; else aiExcludedCtx[label] = 1;
  aiChatRenderContext();
}
function aiChatEnsureBoot(){
  aiChatUpdateModelLabel();
  aiChatUpdateAutoBtn();
  if (!aiChatBooted) {
    aiChatBooted = true;
    aiChatAddMsg('assistant', "Hey! I can see your open file and console \u2014 just tell me what to fix or build, no need to paste code. What are we working on?");
  aiChatSuggestions();
  }
}
var aiChatHistory = [];
var aiChatBooted = false;
var aiLastEditor = null;
try {
  document.addEventListener('focusin', function(){
    try {
      if (typeof monaco !== 'undefined' && monaco.editor && monaco.editor.getFocusedEditor) {
        const ed = monaco.editor.getFocusedEditor();
        if (ed) aiLastEditor = ed;
      }
    } catch(e){}
  });
} catch(e){}
function aiDetectProvider(key){
  key = (key || '').trim();
  if (/^gsk_/.test(key)) return 'groq';
  if (/^sk-or-v1-/.test(key)) return 'openrouter';
  if (/^AIza/.test(key)) return 'gemini';
  return null;
}
async function aiFetchModels(provider, key){
  if (provider === 'groq') {
    const res = await fetch('https://api.groq.com/openai/v1/models', { headers: { 'Authorization': 'Bearer ' + key } });
    if (!res.ok) throw new Error('HTTP_' + res.status);
    const d = await res.json();
    return (d.data || []).map(function(m){ return m.id; }).filter(Boolean).sort();
  }
  if (provider === 'openrouter') {
    const res = await fetch('https://openrouter.ai/api/v1/models', { headers: { 'Authorization': 'Bearer ' + key } });
    if (!res.ok) throw new Error('HTTP_' + res.status);
    const d = await res.json();
    return (d.data || []).map(function(m){ return m.id; }).filter(Boolean).sort();
  }
  if (provider === 'gemini') {
    const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + encodeURIComponent(key));
    if (!res.ok) throw new Error('HTTP_' + res.status);
    const d = await res.json();
    return (d.models || []).filter(function(m){
      return m.supportedGenerationMethods && m.supportedGenerationMethods.indexOf('generateContent') >= 0;
    }).map(function(m){ return String(m.name).replace(/^models\//, ''); }).sort();
  }
  return [];
}
var aiChatModelTimer = null;
function aiSetupKeyTyped(){
  const keyEl = document.getElementById('aiSetupKey');
  const detEl = document.getElementById('aiSetupDetected');
  const selEl = document.getElementById('aiSetupModel');
  const key = keyEl ? keyEl.value.trim() : '';
  if (aiChatModelTimer) clearTimeout(aiChatModelTimer);
  if (!key) { if (detEl) detEl.textContent = ''; if (selEl) selEl.innerHTML = '<option value="">Paste a key first...</option>'; return; }
  const p = aiDetectProvider(key);
  if (!p) { if (detEl) { detEl.style.color = 'var(--warning)'; detEl.textContent = 'Could not detect provider from this key — check it was copied fully.'; } return; }
  if (detEl) { detEl.style.color = 'var(--text-muted)'; detEl.textContent = 'Detected: ' + AI_PROVIDERS[p].label + ' — fetching your models...'; }
  if (selEl) selEl.innerHTML = '<option value="">Loading models...</option>';
  aiChatModelTimer = setTimeout(async function(){
    try {
      const models = await aiFetchModels(p, key);
      if (!models.length) throw new Error('EMPTY');
      if (detEl) { detEl.style.color = 'var(--success)'; detEl.textContent = 'Detected: ' + AI_PROVIDERS[p].label + ' — ' + models.length + ' models available.'; }
      if (selEl) {
        const cur = aiGetModel(p);
        selEl.innerHTML = models.map(function(m){ return '<option value="' + aiEscapeHtml(m) + '"' + (m === cur ? ' selected' : '') + '>' + aiEscapeHtml(m) + '</option>'; }).join('');
        if (selEl.selectedIndex < 0) selEl.selectedIndex = 0;
      }
    } catch(e){
      if (detEl) { detEl.style.color = 'var(--error)'; detEl.textContent = aiFriendlyError(e) + ' — you can still type a model name manually.'; }
      if (selEl) selEl.innerHTML = '<option value="' + aiEscapeHtml(aiGetModel(p)) + '">' + aiEscapeHtml(aiGetModel(p)) + ' (default)</option>';
    }
  }, 600);
}
function openAiSetupModal(){
  const m = document.getElementById('aiSetupModal');
  if (m) m.classList.add('active');
  const det = document.getElementById('aiSetupDetected');
  if (det) det.textContent = '';
  const sel = document.getElementById('aiSetupModel');
  if (sel) sel.innerHTML = '<option value="">Paste a key first...</option>';
  const keyEl = document.getElementById('aiSetupKey');
  if (keyEl) { keyEl.value = ''; setTimeout(function(){ keyEl.focus(); }, 150); }
}
try {
  document.addEventListener('click', function(e){
    if (e.target && e.target.id === 'aiSetupModal') closeAiSetupModal();
  });
} catch(e){}
function closeAiSetupModal(){
  const m = document.getElementById('aiSetupModal');
  if (m) m.classList.remove('active');
}
function aiSetupSave(){
  const keyEl = document.getElementById('aiSetupKey');
  const selEl = document.getElementById('aiSetupModel');
  const key = keyEl ? keyEl.value.trim() : '';
  if (!key) { showToast("<i class='ph-bold ph-warning-circle' style='margin-right:6px;'></i> Paste your API key first."); return; }
  const p = aiDetectProvider(key);
  if (!p) { showToast("<i class='ph-bold ph-warning-circle' style='margin-right:6px;'></i> Could not detect the provider from this key."); return; }
  const model = selEl && selEl.value ? selEl.value : AI_PROVIDERS[p].defaultModel;
  aiSetAll(p, key, model);
  if (keyEl) keyEl.value = '';
  closeAiSetupModal();
  aiChatUpdateModelLabel();
  showToast("<i class='ph-bold ph-check-circle' style='color:var(--success);margin-right:6px;'></i> Connected to " + AI_PROVIDERS[p].label + ".");
  aiToggleSidebar(true);
}
function aiSetupClearKey(){
  try {
    const p = aiGetProvider();
    localStorage.removeItem('nitro_ai_key_' + p);
    localStorage.removeItem('nitro_ai_model_' + p);
  } catch(e){}
  closeAiSetupModal();
  aiChatUpdateModelLabel();
  showToast("<i class='ph-bold ph-info' style='margin-right:6px;'></i> AI key removed.");
}
function aiChatUpdateModelLabel(){
  const el = document.getElementById('aiChatModelLabel');
  if (el) el.textContent = AI_PROVIDERS[aiGetProvider()].label + ' · ' + aiGetModel();
}
function aiChatClear(){
  aiChatHistory = [];
  const box = document.getElementById('aiChatMessages');
  if (box) box.innerHTML = '';
  aiChatBooted = false;
  aiChatEnsureBoot();
}
function aiCurrentFile(){
  try {
    const ed = aiActiveEditor();
    if (!ed || !ed.getModel) return null;
    let fname = 'file';
    try {
      if (typeof activeFiles !== 'undefined' && activeFiles) {
        if (typeof htmlMonaco !== 'undefined' && ed === htmlMonaco) fname = activeFiles.html || 'index.html';
        else if (typeof cssMonaco !== 'undefined' && ed === cssMonaco) fname = activeFiles.css || 'style.css';
        else if (typeof jsMonaco !== 'undefined' && ed === jsMonaco) fname = activeFiles.js || 'script.js';
      }
    } catch(e){}
    return { name: fname, editor: ed, content: ed.getModel().getValue() || '' };
  } catch(e){ return null; }
}
function aiChatContext(){
  const ctx = [];
  try {
    const f = aiCurrentFile();
    if (f && f.content.trim()) {
      if (!aiExcludedCtx['Open file: ' + f.name]) ctx.push({ label: 'Open file: ' + f.name, text: f.content.slice(0, 12000) });
      try {
        const sel = f.editor.getSelection && !f.editor.getSelection().isEmpty() ? f.editor.getModel().getValueInRange(f.editor.getSelection()) : '';
        if (sel && sel.trim() && sel.trim() !== f.content.trim() && !aiExcludedCtx['Selected code (focus here)']) ctx.push({ label: 'Selected code (focus here)', text: sel.slice(0, 4000) });
      } catch(e2){}
    }
  } catch(e){}
  try {
    const errs = document.querySelectorAll('#consoleLogs .console-entry.con-err-line');
    if (errs.length) {
      const t = errs[errs.length - 1].textContent.trim().slice(0, 800);
      if (t && !aiExcludedCtx['Last console error']) ctx.push({ label: 'Last console error', text: t });
    }
  } catch(e){}
  return ctx;
}
var aiExcludedCtx = {};
function aiChatRenderContext(){
  const el = document.getElementById('aiChatContext');
  if (!el) return;
  const ctx = aiChatContext();
  el.innerHTML = ctx.map(function(c){
    const ex = aiExcludedCtx[c.label] ? ' style="opacity:.35;text-decoration:line-through;"' : '';
    return '<span class="ai-ctx-chip"' + ex + ' title="Click to ' + (aiExcludedCtx[c.label] ? 'include' : 'exclude') + ' from next message">' +
      '<span onclick="aiToggleCtx(\'' + aiEscapeHtml(c.label).replace(/'/g, "\\'") + '\')" style="cursor:pointer;">' + aiEscapeHtml(c.label) + '</span>' +
      '<b onclick="aiToggleCtx(\'' + aiEscapeHtml(c.label).replace(/'/g, "\\'") + '\')" style="cursor:pointer;margin-left:4px;">\u00d7</b></span>';
  }).join('');
}
function aiChatAddMsg(role, text){
  aiChatHistory.push({ role: role, content: text });
  const box = document.getElementById('aiChatMessages');
  if (!box) return;
  const div = document.createElement('div');
  div.className = 'ai-msg ' + role;
  div.innerHTML = role === 'user' ? aiEscapeHtml(text) : '<span class="ai-badge">\u2726 AI</span>' + aiChatMd(text);
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
  return div;
}
function aiExtractBlocks(text){
  const parts = String(text).split(/```/);
  const blocks = [];
  for (let i = 1; i < parts.length; i += 2) {
    const chunk = parts[i] || '';
    const lm = chunk.match(/^([a-zA-Z0-9+#-]+)\n/);
    const code = chunk.replace(/^[a-zA-Z0-9+#-]+\n/, '');
    if (code.trim()) blocks.push({ lang: lm ? lm[1].toLowerCase() : '', code: code });
  }
  return blocks;
}
function aiLangMatchesFile(lang, fname){
  fname = (fname || '').toLowerCase();
  if (/\.html?$/.test(fname)) return ['html','xml','markup'].indexOf(lang) >= 0;
  if (/\.css$/.test(fname)) return lang === 'css';
  if (/\.jsx?$/.test(fname)) return ['js','javascript','jsx','ts','typescript'].indexOf(lang) >= 0;
  return true;
}
function aiAutoApplyEnabled(){ try { return localStorage.getItem('nitro_ai_autoapply') === '1'; } catch(e){ return false; } }
function aiChatMd(text){
  const parts = String(text).split(/```/);
  let html = '';
  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 1) {
      const chunk = parts[i] || '';
      const lm = chunk.match(/^([a-zA-Z0-9+#-]+)\n/);
      const lang = lm ? lm[1] : '';
      const code = chunk.replace(/^[a-zA-Z0-9+#-]+\n/, '');
      const idx = aiChatRegisterCode(code);
      const langLabel = aiEscapeHtml(lang || 'code');
      html += '<div class="ai-codeblock"><div class="ai-codeblock-head"><span class="lang">' + langLabel + '</span><span class="spacer"></span>' +
        '<button onclick="aiDiffOpen(' + idx + ')" title="Review changes side-by-side">Diff</button>' +
        '<button class="apply" onclick="aiChatReplaceFile(' + idx + ')" title="Replace the open file with this code">Apply</button>' +
        '<button onclick="aiChatInsertCode(' + idx + ')" title="Insert at cursor">Insert</button>' +
        '<button onclick="aiChatCopyCode(' + idx + ')" title="Copy">Copy</button></div>' +
        '<pre><code>' + aiEscapeHtml(code) + '</code></pre></div>';
    } else {
      const t = parts[i].trim();
      if (t) html += '<p>' + aiEscapeHtml(t).replace(/\n/g, '<br>') + '</p>';
    }
  }
  return html;
}
var aiChatCodeStore = [];
var aiChatCodeFile = [];
var aiCheckpoints = [];
function aiCheckpoint(label){
  try {
    const f = aiCurrentFile();
    if (!f || !f.content) return -1;
    aiCheckpoints.push({ file: f.name, content: f.content, time: Date.now(), label: label || 'AI edit' });
    if (aiCheckpoints.length > 10) aiCheckpoints.shift();
    return aiCheckpoints.length - 1;
  } catch(e){ return -1; }
}
function aiEditorForFile(fname){
  try {
    if (typeof activeFiles !== 'undefined' && activeFiles) {
      if (typeof htmlMonaco !== 'undefined' && activeFiles.html === fname) return htmlMonaco;
      if (typeof cssMonaco !== 'undefined' && activeFiles.css === fname) return cssMonaco;
      if (typeof jsMonaco !== 'undefined' && activeFiles.js === fname) return jsMonaco;
    }
  } catch(e){}
  return null;
}
function aiRestoreCheckpoint(idx){
  const cp = aiCheckpoints[idx];
  if (!cp) return;
  try {
    const ed = aiEditorForFile(cp.file) || aiActiveEditor();
    if (!ed) throw new Error('no editor');
    const model = ed.getModel();
    ed.executeEdits('ai-restore', [{ range: model.getFullModelRange(), text: cp.content }]);
    ed.focus();
    showToast("<i class='ph-bold ph-check-circle' style='color:var(--success);margin-right:6px;'></i> Restored " + aiEscapeHtml(cp.file) + ".");
  } catch(e){ showToast("<i class='ph-bold ph-warning-circle' style='margin-right:6px;'></i> Could not restore."); }
}
function aiChatRegisterCode(code){
  aiChatCodeStore.push(code);
  let fname = '';
  try { const f = aiCurrentFile(); if (f) fname = f.name; } catch(e){}
  aiChatCodeFile.push(fname);
  return aiChatCodeStore.length - 1;
}
function aiChatInsertCode(idx){
  const code = aiChatCodeStore[idx];
  if (!code) return;
  const ed = aiActiveEditor();
  if (!ed) { showToast("<i class='ph-bold ph-warning-circle' style='margin-right:6px;'></i> No editor available."); return; }
  try {
    ed.executeEdits('ai-chat', [{ range: ed.getSelection(), text: code }]);
    ed.focus();
    showToast("<i class='ph-bold ph-check-circle' style='color:var(--success);margin-right:6px;'></i> Code inserted.");
  } catch(e){ showToast("<i class='ph-bold ph-warning-circle' style='margin-right:6px;'></i> Could not insert."); }
}
function aiChatReplaceFile(idx){
  const code = aiChatCodeStore[idx];
  const fname = aiChatCodeFile[idx];
  if (!code) return;
  const label = fname || 'the current file';
  aiCheckpoint('manual apply');
  if (!confirm('Replace the entire content of ' + label + ' with this code?\nYou can undo with Ctrl+Z or Restore from chat.')) return;
  try {
    let ed = null;
    if (typeof activeFiles !== 'undefined' && activeFiles) {
      if (typeof htmlMonaco !== 'undefined' && activeFiles.html === fname) ed = htmlMonaco;
      else if (typeof cssMonaco !== 'undefined' && activeFiles.css === fname) ed = cssMonaco;
      else if (typeof jsMonaco !== 'undefined' && activeFiles.js === fname) ed = jsMonaco;
    }
    if (!ed) ed = aiActiveEditor();
    if (!ed) throw new Error('no editor');
    const model = ed.getModel();
    ed.executeEdits('ai-chat-replace', [{ range: model.getFullModelRange(), text: code }]);
    ed.focus();
    showToast("<i class='ph-bold ph-check-circle' style='color:var(--success);margin-right:6px;'></i> " + aiEscapeHtml(label) + " updated.");
  } catch(e){ showToast("<i class='ph-bold ph-warning-circle' style='margin-right:6px;'></i> Could not replace file."); }
}
function aiChatCopyCode(idx){
  const code = aiChatCodeStore[idx] || '';
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(code).then(function(){ showToast("<i class='ph-bold ph-check-circle' style='color:var(--success);margin-right:6px;'></i> Copied."); });
}
function aiChatKeydown(e){
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); aiChatSend(); }
}
function aiChatAutoresize(){
  const t = document.getElementById('aiChatInput');
  if (t) { t.style.height = 'auto'; t.style.height = Math.min(t.scrollHeight, 120) + 'px'; }
}
async function aiChatSend(prefill){
  if (!aiHasKey()) { openAiSetupModal(); return; }
  const input = document.getElementById('aiChatInput');
  const text = (typeof prefill === 'string' ? prefill : (input ? input.value.trim() : ''));
  if (!text) return;
  aiToggleSidebar(true);
  aiLastUserText = text;
  aiChatAddMsg('user', text);
  if (input && typeof prefill !== 'string') { input.value = ''; aiChatAutoresize(); }
  aiChatRenderContext();
  const typing = document.createElement('div');
  typing.className = 'ai-msg assistant';
  typing.innerHTML = '<div class="ai-typing"><span></span><span></span><span></span></div>';
  const box = document.getElementById('aiChatMessages');
  if (box) { box.appendChild(typing); box.scrollTop = box.scrollHeight; }
  const sendBtn = document.querySelector('.ai-chat-send');
  if (sendBtn) sendBtn.disabled = true;
  try {
    const ctx = aiChatContext();
    let ctxText = '';
    for (const c of ctx) {
      if (c.text) ctxText += '\n\n[' + c.label + ']\n' + c.text;
      else ctxText += '\n\n[' + c.label + ']';
    }
    const system = 'You are an AI pair-programmer inside NitroIDE, a browser IDE. The user\'s open file is attached \u2014 you CAN see their code. Rules: '
      + '1. NEVER ask the user to paste code or describe their project. You already see the file. '
      + '2. If their message is vague (hi, hello, help), say in one line what their code does, then suggest 2-3 specific things you could do with it. '
      + '3. If they ask to fix, change, or build anything: just do it. Output the COMPLETE corrected file in ONE triple-backtick code block, then one short line saying what changed. '
      + '4. Keep every reply short. No markdown headings.';
    const messages = [{ role: 'system', content: system }];
    const hist = aiChatHistory.slice(0, -1).slice(-8);
    for (const m of hist) messages.push({ role: m.role, content: m.content });
    messages.push({ role: 'user', content: text + (ctxText ? '\n\nContext:' + ctxText : '') });
    const out = await aiChatWithHistory(messages);
    if (typing.parentNode) typing.parentNode.removeChild(typing);
    aiChatAddMsg('assistant', out);
    aiChatMaybeAutoApply(out);
  } catch(e){
    if (typing.parentNode) typing.parentNode.removeChild(typing);
    aiChatAddMsg('assistant', 'Sorry — ' + aiFriendlyError(e));
  } finally {
    if (sendBtn) sendBtn.disabled = false;
  }
}
async function aiChatWithHistory(messages){
  const p = aiGetProvider();
  const key = aiGetKey(p);
  const model = aiGetModel(p);
  if (!key) throw new Error('NO_KEY');
  if (p === 'gemini') {
    const sysMsg = messages.find(function(m){ return m.role === 'system'; });
    const rest = messages.filter(function(m){ return m.role !== 'system'; });
    while (rest.length && rest[0].role !== 'user') rest.shift();
    if (!rest.length) throw new Error('EMPTY');
    const contents = rest.map(function(m){ return { role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] }; });
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/' + encodeURIComponent(model) + ':generateContent?key=' + encodeURIComponent(key);
    let res;
    try {
      res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ system_instruction: { parts: [{ text: sysMsg ? sysMsg.content : '' }] }, contents: contents, generationConfig: { temperature: 0.3, maxOutputTokens: 8192 } }) });
    } catch(e){ throw new Error('NETWORK'); }
    if (!res.ok) throw new Error('HTTP_' + res.status);
    const data = await res.json();
    const t = data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text;
    if (!t) throw new Error('EMPTY');
    return t;
  }
  const url = p === 'groq' ? 'https://api.groq.com/openai/v1/chat/completions' : 'https://openrouter.ai/api/v1/chat/completions';
  const headers = { 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' };
  if (p === 'openrouter') { headers['HTTP-Referer'] = 'https://nitroide.com'; headers['X-OpenRouter-Title'] = 'NitroIDE'; }
  let res;
  try {
    res = await fetch(url, { method: 'POST', headers: headers,
      body: JSON.stringify({ model: model, messages: messages, temperature: 0.3, max_tokens: 8192 }) });
  } catch(e){ throw new Error('NETWORK'); }
  if (!res.ok) throw new Error('HTTP_' + res.status);
  const data = await res.json();
  const t = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
  if (!t) throw new Error('EMPTY');
  return t;
}
var aiLastUserText = '';
function aiEditIntent(text){
  return /\b(fix|change|update|modify|replace|add|create|make|build|write|implement|refactor|remove|delete|improve|correct|adjust|set|turn into|convert)\b/i.test(text || '');
}
function aiChatMaybeAutoApply(text){
  if (!aiAutoApplyEnabled()) return;
  if (!aiEditIntent(aiLastUserText)) return;
  const fenceCount = (String(text).match(/```/g) || []).length;
  if (fenceCount % 2 !== 0) return;
  const blocks = aiExtractBlocks(text);
  if (!blocks.length) return;
  let big = blocks[0];
  for (const b of blocks) if (b.code.length > big.code.length) big = b;
  if (big.code.split('\n').length < 10 && big.code.length < 400) return;
  const f = aiCurrentFile();
  if (!f || !f.editor || !f.content.trim()) return;
  if (big.lang && !aiLangMatchesFile(big.lang, f.name)) return;
  try {
    const model = f.editor.getModel();
    const cpIdx = aiCheckpoint('auto-apply');
    f.editor.executeEdits('ai-chat-auto', [{ range: model.getFullModelRange(), text: big.code }]);
    aiChatAddMsg('assistant', '<span class="ai-badge">\u2726 Checkpoint</span><p>Applied to <b>' + aiEscapeHtml(f.name) + '</b>.' + (cpIdx >= 0 ? ' <a href="#" onclick="aiRestoreCheckpoint(' + cpIdx + ');return false;" style="color:#00e5ff;">Restore previous</a>' : '') + '</p>');
  } catch(e){}
}
function aiToggleAutoApply(){
  let on = true;
  try {
    on = localStorage.getItem('nitro_ai_autoapply') === '0';
    localStorage.setItem('nitro_ai_autoapply', on ? '1' : '0');
  } catch(e){}
  aiChatUpdateAutoBtn();
}
function aiChatUpdateAutoBtn(){
  const b = document.getElementById('aiAutoApplyBtn');
  if (!b) return;
  const on = aiAutoApplyEnabled();
  b.style.opacity = on ? '1' : '.35';
  b.title = on ? 'Auto-apply AI code: ON' : 'Auto-apply AI code: OFF';
}
var aiDiffEditor = null;
var aiDiffIdx = -1;
function aiDiffLang(fname){
  fname = (fname || '').toLowerCase();
  if (/\.html?$/.test(fname)) return 'html';
  if (/\.css$/.test(fname)) return 'css';
  return 'javascript';
}
function aiDiffOpen(codeIdx){
  const code = aiChatCodeStore[codeIdx];
  const fname = aiChatCodeFile[codeIdx] || 'file';
  if (!code) return;
  aiDiffIdx = codeIdx;
  const f = aiCurrentFile();
  const original = (f && f.content) || '';
  const m = document.getElementById('aiDiffModal');
  if (m) m.classList.add('active');
  const fl = document.getElementById('aiDiffFile');
  if (fl) fl.textContent = fname;
  setTimeout(function(){
    try {
      const el = document.getElementById('aiDiffEditor');
      if (!el) return;
      if (aiDiffEditor) { aiDiffEditor.dispose(); aiDiffEditor = null; }
      const lang = aiDiffLang(fname);
      const origModel = monaco.editor.createModel(original, lang);
      const modModel = monaco.editor.createModel(code, lang);
      aiDiffEditor = monaco.editor.createDiffEditor(el, {
        theme: document.documentElement.classList.contains('light-mode') ? 'vs' : 'vs-dark',
        renderSideBySide: window.innerWidth > 700,
        readOnly: true,
        automaticLayout: true,
        scrollBeyondLastLine: false,
        minimap: { enabled: false }
      });
      aiDiffEditor.setModel({ original: origModel, modified: modModel });
      // stats
      const st = document.getElementById('aiDiffStats');
      if (st) {
        const a = original.split('\n').length, b = code.split('\n').length;
        st.textContent = a + ' \u2192 ' + b + ' lines';
      }
    } catch(e){
      showToast("<i class='ph-bold ph-warning-circle' style='margin-right:6px;'></i> Could not open diff view.");
      aiDiffClose();
    }
  }, 80);
}
function aiDiffClose(){
  const m = document.getElementById('aiDiffModal');
  if (m) m.classList.remove('active');
  try { if (aiDiffEditor) { aiDiffEditor.dispose(); aiDiffEditor = null; } } catch(e){}
  aiDiffIdx = -1;
}
function aiDiffApply(){
  const idx = aiDiffIdx;
  if (idx < 0) return;
  const code = aiChatCodeStore[idx];
  const fname = aiChatCodeFile[idx] || 'file';
  const cpIdx = aiCheckpoint('diff apply');
  try {
    const ed = aiEditorForFile(fname) || aiActiveEditor();
    if (!ed) throw new Error('no editor');
    const model = ed.getModel();
    ed.executeEdits('ai-diff-apply', [{ range: model.getFullModelRange(), text: code }]);
    ed.focus();
  } catch(e){}
  aiDiffClose();
  aiChatAddMsg('assistant', '<span class="ai-badge">\u2726 Checkpoint</span><p>Applied to <b>' + aiEscapeHtml(fname) + '</b>.' + (cpIdx >= 0 ? ' <a href="#" onclick="aiRestoreCheckpoint(' + cpIdx + ');return false;" style="color:#00e5ff;">Restore previous</a>' : '') + '</p>');
}
try {
  document.addEventListener('click', function(e){
    if (e.target && e.target.id === 'aiDiffModal') aiDiffClose();
  });
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape') {
      const m = document.getElementById('aiDiffModal');
      if (m && m.classList.contains('active')) aiDiffClose();
    }
  });
} catch(e){}
function aiChatOpenWith(prompt){
  if (!aiHasKey()) { openAiSetupModal(); return; }
  aiToggleSidebar(true);
  aiChatSend(prompt);
}
