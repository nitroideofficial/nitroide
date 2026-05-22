// --- 1. INCEPTION BLOCKER (Silent Safety Check) ---
	if (window.self !== window.top) {
		console.warn("NitroIDE detected it is running inside an iframe. Aborting to prevent infinite loop.");
		throw new Error("Recursive load blocked");
	}

	// --- GLOBALS & UTILS ---
	const body = document.body;
	let htmlMonaco, cssMonaco, jsMonaco;
	let isIdeInitialized = false;
	let isRestoringSnapshot = false;
	let cdnLinks = [];

	// --- DYNAMIC VIRTUAL FILE SYSTEM ---
	let files = {
	  'index.html': `<div class="container">\n  <h1 class="bounce">NitroIDE 🚀</h1>\n  <p class="bounce">Type div>ul>li*3 and hit Tab to test Emmet!</p>\n</div>`,
	  'style.css': `body {\n  font-family: system-ui, sans-serif;\n  background: var(--bg, #000);\n  color: white;\n  display: grid;\n  place-items: center;\n  height: 100vh;\n  margin: 0;\n  transition: background 0.3s;\n}`,
	  'script.js': `console.log("⚡ Workspace initialized.");\n\n// Write your JavaScript here...`
	};

	// --- CONTEXT-AWARE ROUTING ---
	const urlParams = new URLSearchParams(window.location.search);
	const targetEnv = urlParams.get('env');

	if (targetEnv === 'react') {
	    // Pre-load React & Babel CDNs
	    cdnLinks = [
	      'https://unpkg.com/react@18/umd/react.development.js', 
	      'https://unpkg.com/react-dom@18/umd/react-dom.development.js', 
	      'https://unpkg.com/@babel/standalone/babel.min.js'
	    ];
	    files['index.html'] = `<div id="root"></div>`;
	    files['style.css'] = `body {\n  font-family: system-ui, sans-serif;\n  background: var(--bg, #09090b);\n  color: white;\n  display: grid;\n  place-items: center;\n  height: 100vh;\n  margin: 0;\n}`;
	    files['script.js'] = `// React and Babel are pre-injected via CDN!\n\nfunction App() {\n  const [count, setCount] = React.useState(0);\n  \n  return (\n    <div style={{ textAlign: 'center' }}>\n      <h1 style={{ marginBottom: '20px' }}>NitroIDE + React ⚛️</h1>\n      <button \n        onClick={() => setCount(count + 1)} \n        style={{ padding: '10px 20px', fontSize: '16px', background: '#00e5ff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', color: '#000' }}>\n        Count: {count}\n      </button>\n    </div>\n  );\n}\n\nconst root = ReactDOM.createRoot(document.getElementById('root'));\nroot.render(<App />);`;
	} 
	else if (targetEnv === 'tailwind') {
	    // Pre-load Tailwind CDN
	    cdnLinks = ['https://cdn.tailwindcss.com'];
	    files['index.html'] = `<div class="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">\n  <h1 class="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-4">\n    NitroIDE + Tailwind\n  </h1>\n  <p class="text-zinc-400 text-lg mb-8">Edit this code and see changes instantly.</p>\n  <button class="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors font-medium">\n    Utility Button\n  </button>\n</div>`;
	    files['style.css'] = `/* Tailwind handles the styling! */\n\nbody {\n  margin: 0;\n}`;
	    files['script.js'] = `console.log("⚡ Tailwind CDN Injected Successfully.");`;
	}

	let defaultVfs = { 'index.html': files['index.html'], 'style.css': files['style.css'], 'script.js': files['script.js'] };

	// --- PROJECT MANAGER LOGIC ---
	let projects = JSON.parse(localStorage.getItem('nitro_projects')) || [];
	let currentProjectId = localStorage.getItem('nitro_current_project_id');

	if (projects.length === 0) {
	    let legacyVfs = JSON.parse(localStorage.getItem('nitro_vfs'));
	    let legacyActive = JSON.parse(localStorage.getItem('nitro_active_files'));
	    let initialProject = {
	        id: 'proj_' + Date.now(),
	        name: 'Default Workspace',
	        vfs: legacyVfs || defaultVfs,
	        activeFiles: legacyActive || { html: 'index.html', css: 'style.css', js: 'script.js' },
	        lastModified: Date.now()
	    };
	    projects.push(initialProject);
	    currentProjectId = initialProject.id;
	    localStorage.setItem('nitro_projects', JSON.stringify(projects));
	    localStorage.setItem('nitro_current_project_id', currentProjectId);
	}

	let currentProject = projects.find(p => p.id === currentProjectId) || projects[0];
	currentProjectId = currentProject.id;
	let vfs = currentProject.vfs;
	let activeFiles = currentProject.activeFiles;

	// --- FORCE TEMPLATE OVERRIDE ---
	// If the user clicked a Side Door link, bypass their cached project and load the framework
	if (targetEnv) {
	    vfs = JSON.parse(JSON.stringify(defaultVfs));
	    activeFiles = { html: 'index.html', css: 'style.css', js: 'script.js' };
	}

	// --- URL PARSER FOR SHARED CODE ---
	
	const sharedCode = urlParams.get('code');
	if (sharedCode && typeof LZString !== 'undefined') {
    try {
        const decompressed = LZString.decompressFromEncodedURIComponent(sharedCode);
        const payload = JSON.parse(decompressed);
        if (payload && payload.vfs) {
            vfs = payload.vfs;
            if (payload.activeFiles) activeFiles = payload.activeFiles;
            // Clean the URL bar so it looks premium
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    } catch (e) { console.error("Failed to parse shared link."); }
}

	if (localStorage.getItem('theme') === 'light') { 
	  document.documentElement.classList.add('light-mode'); 
	  
	  // Check if it's a dropdown item (codebox) or standard nav button (homepage)
	  document.querySelectorAll('#themeBtn, #themeBtnFloat').forEach(btn => {
		if (btn.classList.contains('dropdown-item')) {
			btn.innerHTML = `<i class="ph-bold ph-moon"></i> Dark Mode`;
		} else {
			btn.innerHTML = `<i class="ph-bold ph-moon"></i>`;
		}
	  });
	}

	function toggleTheme() { 
	  document.documentElement.classList.toggle('light-mode'); 
	  let isLight = document.documentElement.classList.contains('light-mode');
	  localStorage.setItem('theme', isLight ? 'light' : 'dark'); 
	  
	  document.querySelectorAll('#themeBtn, #themeBtnFloat').forEach(btn => {
		if (btn.classList.contains('dropdown-item')) {
			// Add text for the Codebox dropdown
			btn.innerHTML = isLight ? `<i class="ph-bold ph-moon"></i> Dark Mode` : `<i class="ph-bold ph-sun"></i> Light Mode`;
		} else {
			// Keep it icon-only for the Homepage/Nav
			btn.innerHTML = isLight ? `<i class="ph-bold ph-moon"></i>` : `<i class="ph-bold ph-sun"></i>`;
		}
	  });
	  
	  if (typeof monaco !== 'undefined') {
		let currentTheme = document.getElementById('editorTheme') ? document.getElementById('editorTheme').value : 'toolbox-dark';
		monaco.editor.setTheme(isLight ? 'vs' : currentTheme);
	  }
	}

	function showToast(msg) { 
	  const toast = document.getElementById("toast"); 
	  toast.innerHTML = msg; 
	  toast.classList.add("show"); 
	  setTimeout(() => toast.classList.remove("show"), 2500); 
	}

	// --- UI TOGGLES ---
	function toggleOptions() { 
	  document.getElementById('optionsMenu').classList.toggle('active'); 
	}

	const workspacePrefsKey = 'nitro_workspace_prefs';
	let workspacePrefs = {};
	try { workspacePrefs = JSON.parse(localStorage.getItem(workspacePrefsKey)) || {}; } catch (e) { workspacePrefs = {}; }

	function saveWorkspacePrefs(patch = {}) {
	  if (!document.getElementById('codebox')) return;
	  workspacePrefs = { ...workspacePrefs, ...patch };
	  localStorage.setItem(workspacePrefsKey, JSON.stringify(workspacePrefs));
	}

	function resetWorkspacePrefs() {
	  workspacePrefs = {};
	  localStorage.removeItem(workspacePrefsKey);
	}

	function getOutputTabButton(type) {
	  return Array.from(document.querySelectorAll('.out-tab')).find(btn => {
		const target = btn.getAttribute('onclick') || '';
		return target.includes(`'${type}'`);
	  });
	}

	let statusTimer;
	function setWorkspaceStatus(message, type = 'ready', persist = false) {
	  const status = document.getElementById('workspaceStatus');
	  const text = document.getElementById('workspaceStatusText');
	  if (!status || !text) return;
	  clearTimeout(statusTimer);
	  status.dataset.state = type;
	  text.textContent = message;
	  if (!persist && type !== 'error') {
		statusTimer = setTimeout(() => {
		  status.dataset.state = 'ready';
		  text.textContent = 'Ready';
		}, 1800);
	  }
	}

	document.addEventListener('click', (e) => {
	  const menu = document.getElementById('optionsMenu'); 
	  const btn = document.getElementById('optionsBtn');
	  if (menu && menu.classList.contains('active') && !menu.contains(e.target) && !btn.contains(e.target)) {
		menu.classList.remove('active');
	  }
	});

	function setDevice(type) {
	  const iframe = document.getElementById('liveIframe');
	  iframe.className = '';
	  if(type === 'mobile') iframe.classList.add('mobile-view');
	  if(type === 'tablet') iframe.classList.add('tablet-view');
	  saveWorkspacePrefs({ device: type });
	  const optionsMenu = document.getElementById('optionsMenu');
	  if (optionsMenu) optionsMenu.classList.remove('active');
	}

	function triggerLayoutUpdate() {
	  window.requestAnimationFrame(() => {
		if(htmlMonaco) htmlMonaco.layout(); 
		if(cssMonaco) cssMonaco.layout(); 
		if(jsMonaco) jsMonaco.layout();
	  });
	}

	function togglePanel(panelId) {
	  const panel = document.getElementById(panelId);
	  const panels = [document.getElementById('htmlPanel'), document.getElementById('cssPanel'), document.getElementById('jsPanel')];
	  
	  let openPanels = panels.filter(p => !p.classList.contains('collapsed'));
	  if (!panel.classList.contains('collapsed') && openPanels.length === 1) {
		showToast("<i class='ph-bold ph-warning-circle' style='margin-right:6px;'></i> Cannot close the last panel."); return;
	  }
	  panel.classList.toggle('collapsed');
	  panels.forEach(p => { p.style.width = ''; p.style.flex = ''; });
	  saveWorkspacePrefs({
		collapsedPanels: panels.filter(p => p.classList.contains('collapsed')).map(p => p.id)
	  });
	  setTimeout(triggerLayoutUpdate, 300); 
	}

	// --- VIRTUAL FILE SYSTEM LOGIC ---
	function toggleSidebar(action = 'toggle') {
	  const sidebar = document.getElementById('fileSidebar');
	  const backdrop = document.getElementById('sidebarBackdrop');
	  if(!sidebar) return;

	  if (window.innerWidth <= 768) {
		if (action === 'close') {
			sidebar.classList.remove('mobile-open');
			backdrop.classList.remove('active');
		} else {
			sidebar.classList.toggle('mobile-open');
			backdrop.classList.toggle('active');
		}
	  } else {
		if (action === 'close') {
			sidebar.classList.add('collapsed');
		} else {
			sidebar.classList.toggle('collapsed');
		}
		saveWorkspacePrefs({ sidebarCollapsed: sidebar.classList.contains('collapsed') });
	  }
	  setTimeout(triggerLayoutUpdate, 300); 
	}

	function createNewFile() {
	  let filename = prompt("Enter filename (e.g., utils.js, theme.css, nav.html):");
	  if(!filename) return;
	  if(!filename.includes('.')) filename += '.js'; 
	  if(vfs[filename]) return showToast("<i class='ph-bold ph-warning-circle'></i> File already exists!");
	  
	  if(filename.endsWith('.js')) vfs[filename] = "// New JavaScript module\n";
	  else if(filename.endsWith('.css')) vfs[filename] = "/* New CSS module */\n";
	  else if(filename.endsWith('.html')) vfs[filename] = "\n<div>\n  \n</div>\n";
	  else return showToast("<i class='ph-bold ph-warning-circle'></i> Only .js, .css, and .html files supported.");
	  
	  renderVFS(); switchFile(filename);
	}

	function renameFile(e, oldName) {
	  e.stopPropagation();
	  let newName = prompt("Rename file:", oldName);
	  if(!newName || newName === oldName) return;
	  if(!newName.includes('.')) newName += oldName.substring(oldName.lastIndexOf('.'));
	  if(vfs[newName]) return showToast("<i class='ph-bold ph-warning-circle'></i> Name already exists.");
	  
	  vfs[newName] = vfs[oldName]; delete vfs[oldName];
	  if(activeFiles.js === oldName) { activeFiles.js = newName; document.getElementById('jsPanelPillText').innerText = newName; }
	  if(activeFiles.css === oldName) { activeFiles.css = newName; document.getElementById('cssPanelPillText').innerText = newName; }
	  if(activeFiles.html === oldName) { activeFiles.html = newName; document.getElementById('htmlPanelPillText').innerText = newName; }
	  
	  renderVFS(); smartRun();
	}

	function deleteFile(e, filename) {
	  e.stopPropagation();
	  if(confirm("Delete " + filename + "?")) {
		  delete vfs[filename];
		  if(activeFiles.js === filename) { activeFiles.js = 'script.js'; if(typeof vfs['script.js'] === 'undefined') vfs['script.js'] = ''; jsMonaco.setValue(vfs['script.js']); document.getElementById('jsPanelPillText').innerText = 'script.js'; }
		  else if(activeFiles.css === filename) { activeFiles.css = 'style.css'; cssMonaco.setValue(vfs['style.css']); document.getElementById('cssPanelPillText').innerText = 'style.css'; }
		  else if(activeFiles.html === filename) { activeFiles.html = 'index.html'; htmlMonaco.setValue(vfs['index.html']); document.getElementById('htmlPanelPillText').innerText = 'index.html'; }
		  
		  renderVFS(); smartRun();
	  }
	}

	function renderVFS() {
	  const list = document.getElementById('vfsList');
	  const mobList = document.getElementById('mobileTabs');
	  let html = '';
	  let mobHtml = '';
	  
	  const createVfsItem = (filename, color, icon, isDeletable=false) => {
		  let isActive = (activeFiles.html === filename || activeFiles.js === filename || activeFiles.css === filename) ? 'active' : '';
		  let actions = isDeletable ? `<div class="file-actions"><span class="file-action-btn" title="Rename" onclick="renameFile(event, '${filename}')"><i class="ph-bold ph-pencil-simple"></i></span><span class="file-action-btn del" title="Delete" onclick="deleteFile(event, '${filename}')"><i class="ph-bold ph-trash"></i></span></div>` : '';
		  
		  if(mobList) mobHtml += `<button class="mob-tab ${isActive}" onclick="switchFile('${filename}')"><i class="ph-fill ${icon}" style="color:${color};"></i> ${filename}</button>`;
		  
		  return `<div class="file-item ${isActive}" onclick="switchFile('${filename}')"><i class="ph-fill ${icon}" style="color:${color};"></i> <span class="vfs-filename" title="${filename}">${filename}</span> ${actions}</div>`;
	  };

	  html += createVfsItem('index.html', '#e34c26', 'ph-file-html');
	  html += createVfsItem('style.css', '#264de4', 'ph-file-css');
	  html += createVfsItem('script.js', '#f7df1e', 'ph-file-js');
	  
	  let hasModules = Object.keys(vfs).length > 3;
	  if(hasModules) {
		  html += `<div class="sidebar-header" style="margin-top: 15px; border-top: 1px solid var(--border); padding-top: 15px; display:flex; justify-content:space-between; align-items:center;"><span>MODULES</span><button class="btn btn-compact btn-outline" onclick="createNewFile()" style="border:none; padding:2px;" title="New File"><i class="ph-bold ph-plus"></i></button></div>`;
		  Object.keys(vfs).forEach(filename => {
			  if(!['index.html', 'style.css', 'script.js'].includes(filename)) {
				  let color = filename.endsWith('.js') ? '#f7df1e' : (filename.endsWith('.css') ? '#264de4' : '#e34c26');
				  let icon = filename.endsWith('.js') ? 'ph-file-js' : (filename.endsWith('.css') ? 'ph-file-css' : 'ph-file-html');
				  html += createVfsItem(filename, color, icon, true);
			  }
		  });
	  }
	  if (list) list.innerHTML = html;
	  if (list && !hasModules) { list.innerHTML += `<button class="btn btn-compact btn-outline" onclick="createNewFile()" style="width:100%; margin-top:15px; border-style:dashed;"><i class="ph-bold ph-plus"></i> Add Module</button>`; }
	  if (mobList) mobList.innerHTML = mobHtml;
	}

	function switchFile(filename) {
	  if(filename.endsWith('.js')) { vfs[activeFiles.js] = jsMonaco.getValue(); activeFiles.js = filename; jsMonaco.setValue(vfs[filename]); document.getElementById('jsPanelPillText').innerText = filename; focusPanel('js'); } 
	  else if (filename.endsWith('.css')) { vfs[activeFiles.css] = cssMonaco.getValue(); activeFiles.css = filename; cssMonaco.setValue(vfs[filename]); document.getElementById('cssPanelPillText').innerText = filename; focusPanel('css'); } 
	  else if (filename.endsWith('.html')) { vfs[activeFiles.html] = htmlMonaco.getValue(); activeFiles.html = filename; htmlMonaco.setValue(vfs[filename]); document.getElementById('htmlPanelPillText').innerText = filename; focusPanel('html'); }
	  renderVFS();
	  
	  if(window.innerWidth <= 768) toggleSidebar('close');
	}

	function focusPanel(type) {
	  const panelId = type + 'Panel'; const panel = document.getElementById(panelId);
	  
	  if (window.innerWidth <= 768) {
		document.querySelectorAll('.editor-panel').forEach(p => { p.style.display = 'none'; p.classList.remove('active-mobile'); });
		panel.style.display = 'flex'; panel.classList.add('active-mobile');
	  } else {
		if (panel && panel.classList.contains('collapsed')) { togglePanel(panelId); }
		panel.style.transition = 'box-shadow 0.2s ease'; panel.style.boxShadow = 'inset 0 0 0 1px var(--text-muted)';
		setTimeout(() => panel.style.boxShadow = 'none', 300);
	  }
	  
	  setTimeout(() => {
		  if(type === 'html' && htmlMonaco) htmlMonaco.focus();
		  if(type === 'css' && cssMonaco) cssMonaco.focus();
		  if(type === 'js' && jsMonaco) jsMonaco.focus();
		  triggerLayoutUpdate();
	  }, 100);
	}

	function toggleBottomPanel() {
	  const topHalf = document.getElementById('editorTopSplit'); 
	  const bottomHalf = document.getElementById('outputBottomSplit');
	  
	  // Toggle between fully collapsed (46px) and 40% open
	  if(bottomHalf.style.height === '46px') { 
		topHalf.style.height = '60%'; bottomHalf.style.height = '40%'; 
	  } else { 
		topHalf.style.height = 'calc(100% - 46px)'; bottomHalf.style.height = '46px'; 
	  }
	  saveWorkspacePrefs({ topHeight: topHalf.style.height, bottomHeight: bottomHalf.style.height });
	  setTimeout(triggerLayoutUpdate, 300);
	}

	// --- MAGNETIC SLIDERS ---
	function initCustomResizers() {
	  const getClientX = (e) => e.touches ? e.touches[0].clientX : e.clientX;
	  const getClientY = (e) => e.touches ? e.touches[0].clientY : e.clientY;

	  const hResizers = document.querySelectorAll('.ide-resizer.horiz');
	  const panels = [document.getElementById('htmlPanel'), document.getElementById('cssPanel'), document.getElementById('jsPanel')];
	  const container = document.getElementById('editorTopSplit');

	  hResizers.forEach((resizer, idx) => {
		let prevPanel = panels[idx]; let nextPanel = panels[idx + 1];
		
		function startDrag(e) {
		  if(e.type === 'touchstart') { document.body.style.overflow = 'hidden'; } else { e.preventDefault(); }
		  resizer.classList.add('active-drag'); document.body.classList.add('is-dragging'); 
		  const iframe = document.getElementById('liveIframe'); if(iframe) iframe.style.pointerEvents = 'none';
		  document.body.style.cursor = 'col-resize';
		  let startX = getClientX(e); let prevWidth = prevPanel.getBoundingClientRect().width; let nextWidth = nextPanel.getBoundingClientRect().width; let containerWidth = container.getBoundingClientRect().width;

		  function onMove(e) {
			let dx = getClientX(e) - startX; let newPrevWidth = prevWidth + dx; let newNextWidth = nextWidth - dx;
			if (newPrevWidth < 80) { prevPanel.classList.add('collapsed'); prevPanel.style.flex = 'none'; prevPanel.style.width = '40px'; nextPanel.style.flex = `0 0 ${((prevWidth + nextWidth - 40) / containerWidth * 100)}%`;
			} else if (newNextWidth < 80) { nextPanel.classList.add('collapsed'); nextPanel.style.flex = 'none'; nextPanel.style.width = '40px'; prevPanel.style.flex = `0 0 ${((prevWidth + nextWidth - 40) / containerWidth * 100)}%`;
			} else { prevPanel.classList.remove('collapsed'); nextPanel.classList.remove('collapsed'); prevPanel.style.flex = `0 0 ${(newPrevWidth / containerWidth * 100)}%`; nextPanel.style.flex = `0 0 ${(newNextWidth / containerWidth * 100)}%`; }
		  }

		  function stopDrag() {
			document.body.style.overflow = ''; 
			resizer.classList.remove('active-drag'); document.body.classList.remove('is-dragging'); 
			if(iframe) iframe.style.pointerEvents = 'auto'; document.body.style.cursor = '';
			window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', stopDrag);
			window.removeEventListener('touchmove', onMove); window.removeEventListener('touchend', stopDrag);
			saveWorkspacePrefs({
			  panelFlex: panels.map(panel => ({
				id: panel.id,
				flex: panel.style.flex,
				width: panel.style.width,
				collapsed: panel.classList.contains('collapsed')
			  }))
			});
			triggerLayoutUpdate();
		  }
		  
		  window.addEventListener('mousemove', onMove); window.addEventListener('mouseup', stopDrag);
		  window.addEventListener('touchmove', onMove, {passive: false}); window.addEventListener('touchend', stopDrag);
		}
		resizer.addEventListener('mousedown', startDrag); resizer.addEventListener('touchstart', startDrag, {passive: false});
	  });

	  const vResizer = document.querySelector('.ide-resizer.vert');
	  const topHalf = document.getElementById('editorTopSplit');
	  const bottomHalf = document.getElementById('outputBottomSplit');
	  const mainSplit = document.getElementById('ideMainSplit');

	  if (vResizer) {
		function startVDrag(e) {
		  if(e.type === 'touchstart') { document.body.style.overflow = 'hidden'; } else { e.preventDefault(); }
		  vResizer.classList.add('active-drag'); document.body.classList.add('is-dragging'); 
		  const iframe = document.getElementById('liveIframe'); if(iframe) iframe.style.pointerEvents = 'none';
		  document.body.style.cursor = 'row-resize';
		  let startY = getClientY(e); let topHeight = topHalf.getBoundingClientRect().height; let bottomHeight = bottomHalf.getBoundingClientRect().height; let containerHeight = mainSplit.getBoundingClientRect().height;
		  
		  function onVMove(e) {
			let dy = getClientY(e) - startY; let newTopHeight = topHeight + dy; let newBottomHeight = bottomHeight - dy;
			if (newTopHeight > 60 && newBottomHeight > 40) { topHalf.style.height = (newTopHeight / containerHeight * 100) + '%'; bottomHalf.style.height = (newBottomHeight / containerHeight * 100) + '%'; }
		  }

		  function stopVDrag() {
			document.body.style.overflow = '';
			vResizer.classList.remove('active-drag'); document.body.classList.remove('is-dragging'); 
			if(iframe) iframe.style.pointerEvents = 'auto'; document.body.style.cursor = '';
			window.removeEventListener('mousemove', onVMove); window.removeEventListener('mouseup', stopVDrag);
			window.removeEventListener('touchmove', onVMove); window.removeEventListener('touchend', stopVDrag);
			saveWorkspacePrefs({ topHeight: topHalf.style.height, bottomHeight: bottomHalf.style.height });
			triggerLayoutUpdate();
		  }
		  
		  window.addEventListener('mousemove', onVMove); window.addEventListener('mouseup', stopVDrag);
		  window.addEventListener('touchmove', onVMove, {passive: false}); window.addEventListener('touchend', stopVDrag);
		}
		vResizer.addEventListener('mousedown', startVDrag); vResizer.addEventListener('touchstart', startVDrag, {passive: false});
	  }
	}




	// --- EDITOR SETTINGS ---
	let currentFontSize = parseInt(localStorage.getItem('nitro_font')) || 14; 
	let isWordWrap = false;

	function toggleMinimap() {
	  const isEnabled = document.getElementById('minimapToggle').checked;
	  const opts = { minimap: { enabled: isEnabled } };
	  
	  if(htmlMonaco) htmlMonaco.updateOptions(opts); 
	  if(cssMonaco) cssMonaco.updateOptions(opts); 
	  if(jsMonaco) jsMonaco.updateOptions(opts);
	  
	  showToast(`<i class="ph-bold ph-map-trifold" style="margin-right:6px;"></i> Minimap ${isEnabled ? 'ON' : 'OFF'}`);
	  document.getElementById('optionsMenu').classList.remove('active');
	}

	function changeEditorTheme(themeName) {
	  monaco.editor.setTheme(themeName);
	  showToast(`<i class="ph-bold ph-palette" style="margin-right:6px;"></i> Theme: ${themeName}`);
	}

	function changeFontSize(delta) {
	  currentFontSize += delta; if (currentFontSize < 8) currentFontSize = 8; if (currentFontSize > 32) currentFontSize = 32;
	  localStorage.setItem('nitro_font', currentFontSize);
	  const opts = { fontSize: currentFontSize };
	  if(htmlMonaco) htmlMonaco.updateOptions(opts); if(cssMonaco) cssMonaco.updateOptions(opts); if(jsMonaco) jsMonaco.updateOptions(opts);
	  showToast(`<i class="ph-bold ph-text-aa" style="margin-right:6px;"></i> Font Size: ${currentFontSize}px`);
	}

	function toggleOutputTabs() {
	  const tabs = document.querySelector('.output-tabs');
	  
	  if (tabs.style.display === 'none') {
		tabs.style.display = 'flex';
	  } else {
		tabs.style.display = 'none';
	  }
	  saveWorkspacePrefs({ outputTabsHidden: tabs.style.display === 'none' });
	  
	  // Forces the workspace and code panels to recalculate their geometries
	  triggerLayoutUpdate();
	}

	async function formatCode() {
	  if(htmlMonaco) await htmlMonaco.getAction('editor.action.formatDocument').run();
	  if(cssMonaco) await cssMonaco.getAction('editor.action.formatDocument').run();
	  if(jsMonaco) await jsMonaco.getAction('editor.action.formatDocument').run();
	  
	  smartRun(); 
	  showToast("<i class='ph-bold ph-magic-wand' style='margin-right:6px;'></i> Code Formatted!");
	  document.getElementById('optionsMenu').classList.remove('active');
	}

	// --- IDE INITIALIZATION ---
	function initIDE() {
	  if (isIdeInitialized) return;

	  if (window.self !== window.top) {
		console.warn("NitroIDE detected it is running inside an iframe. Aborting Monaco initialization."); return; 
	  }

	  initCustomResizers();
	  
	  const resizeObserver = new ResizeObserver(() => triggerLayoutUpdate());
	  const panelsToObserve = ['htmlPanel', 'cssPanel', 'jsPanel', 'editorTopSplit', 'outputBottomSplit', 'codebox'];
	  panelsToObserve.forEach(id => { const el = document.getElementById(id); if(el) resizeObserver.observe(el); });

	  window.MonacoEnvironment = {
		getWorkerUrl: function(workerId, label) {
		  const workerSource = `
			self.MonacoEnvironment = { baseUrl: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/' };
			importScripts('https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs/base/worker/workerMain.js');
		  `;
		  return URL.createObjectURL(new Blob([workerSource], { type: 'text/javascript' }));
		}
	  };

	  require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' }});
	  require(['vs/editor/editor.main'], function() {
		
		// STANDARD DARK THEME
		monaco.editor.defineTheme('toolbox-dark', {
		  base: 'vs-dark', inherit: true,
		  rules: [
			{ token: 'comment', foreground: '8b949e', fontStyle: 'italic' },
			{ token: 'keyword', foreground: 'ff7b72' },
			{ token: 'string', foreground: 'a5d6ff' },
			{ token: 'number', foreground: '79c0ff' },
			{ token: 'tag', foreground: '7ee787' },
			{ token: 'attribute.name', foreground: 'd2a8ff' },
		  ],
		  colors: { 'editor.background': '#00000000', 'editorLineNumber.foreground': '#484f58', 'editorIndentGuide.background': '#21262d' }
		});

		// CYBERPUNK THEME
		monaco.editor.defineTheme('cyberpunk', {
		  base: 'vs-dark', inherit: true,
		  rules: [
			{ token: 'comment', foreground: '00e5ff', fontStyle: 'italic' },
			{ token: 'keyword', foreground: 'ff003c', fontStyle: 'bold' },
			{ token: 'string', foreground: 'fcee0a' },
			{ token: 'tag', foreground: 'ff003c' },
			{ token: 'attribute.name', foreground: '00e5ff' },
		  ],
		  colors: { 'editor.background': '#00000000', 'editorLineNumber.foreground': '#ff003c' }
		});

		// TOKYO NIGHT THEME
		monaco.editor.defineTheme('tokyo-night', {
		  base: 'vs-dark', inherit: true,
		  rules: [
			{ token: 'comment', foreground: '565f89', fontStyle: 'italic' },
			{ token: 'keyword', foreground: 'bb9af7' },
			{ token: 'string', foreground: '9ece6a' },
			{ token: 'tag', foreground: 'f7768e' },
			{ token: 'attribute.name', foreground: '7dcfff' },
		  ],
		  colors: { 'editor.background': '#00000000', 'editorLineNumber.foreground': '#565f89' }
		});

		const config = { 
		  theme: document.documentElement.classList.contains('light-mode') ? 'vs' : (document.getElementById('editorTheme') ? document.getElementById('editorTheme').value : 'toolbox-dark'), 
		  automaticLayout: false, 
		  minimap: { enabled: document.getElementById('minimapToggle') ? document.getElementById('minimapToggle').checked : false }, 
		  fontSize: currentFontSize, 
		  wordWrap: isWordWrap ? "on" : "off",
		  fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace", 
		  tabSize: 2, 
		  padding: { top: 15 },
		  cursorSmoothCaretAnimation: "on", 
		  cursorBlinking: "smooth",
		  smoothScrolling: true,
		  renderLineHighlight: "all"
		};

		htmlMonaco = monaco.editor.create(document.getElementById('htmlWrap'), { ...config, language: 'html', value: vfs['index.html'] });
		cssMonaco = monaco.editor.create(document.getElementById('cssWrap'), { ...config, language: 'css', value: vfs['style.css'] });
		jsMonaco = monaco.editor.create(document.getElementById('jsWrap'), { ...config, language: 'javascript', value: vfs['script.js'] });

		if(typeof emmetMonaco !== 'undefined') { emmetMonaco.emmetHTML(monaco); emmetMonaco.emmetCSS(monaco); }

		htmlMonaco.onDidChangeModelContent(() => queueUpdate('html'));
		cssMonaco.onDidChangeModelContent(() => queueUpdate('css'));
		jsMonaco.onDidChangeModelContent(() => queueUpdate('js'));

		isIdeInitialized = true;
		triggerLayoutUpdate();
		renderVFS();
		applyWorkspacePrefs();
		setTimeout(() => document.body.classList.remove('workspace-booting'), 250);
		smartRun(); 
	  });
	}

	// --- COMPONENT FUNCTIONS ---
	function switchOutputTab(type, btn) {
	  document.querySelectorAll('.out-tab').forEach(el => el.classList.remove('active'));
	  document.getElementById('outPreview').classList.remove('active');
	  document.getElementById('outConsole').classList.remove('active');
	  document.getElementById('outState').classList.remove('active');
	  
	  if (!btn) btn = getOutputTabButton(type);
	  if (btn) btn.classList.add('active');
	  if(type === 'preview') document.getElementById('outPreview').classList.add('active');
	  if(type === 'console') { document.getElementById('outConsole').classList.add('active'); document.getElementById('consoleBadge').style.display = 'none'; }
	  if(type === 'state') document.getElementById('outState').classList.add('active');
	  saveWorkspacePrefs({ outputTab: type });

	  // Auto-expand the drawer if a tab is clicked while minimized
	  const bottomHalf = document.getElementById('outputBottomSplit');
	  if (bottomHalf.style.height === '46px') {
		toggleBottomPanel();
	  }
	}

	function goToLine(editorId, lineNum) {
	  if(!lineNum || lineNum < 1) return;
	  const target = editorId === 'jsEditor' ? jsMonaco : editorId === 'cssEditor' ? cssMonaco : htmlMonaco;
	  if(target) { target.revealLineInCenter(lineNum); target.setPosition({lineNumber: lineNum, column: 1}); target.focus(); }
	}

	function applyWorkspacePrefs() {
	  if (!document.getElementById('codebox')) return;
	  const sidebar = document.getElementById('fileSidebar');
	  const tabs = document.querySelector('.output-tabs');
	  const topHalf = document.getElementById('editorTopSplit');
	  const bottomHalf = document.getElementById('outputBottomSplit');
	  const panels = [document.getElementById('htmlPanel'), document.getElementById('cssPanel'), document.getElementById('jsPanel')];

	  if (sidebar && workspacePrefs.sidebarCollapsed === false && window.innerWidth > 768) sidebar.classList.remove('collapsed');
	  if (sidebar && workspacePrefs.sidebarCollapsed === true && window.innerWidth > 768) sidebar.classList.add('collapsed');
	  if (tabs && workspacePrefs.outputTabsHidden) tabs.style.display = 'none';
	  if (topHalf && workspacePrefs.topHeight) topHalf.style.height = workspacePrefs.topHeight;
	  if (bottomHalf && workspacePrefs.bottomHeight) bottomHalf.style.height = workspacePrefs.bottomHeight;

	  if (Array.isArray(workspacePrefs.panelFlex)) {
		workspacePrefs.panelFlex.forEach(saved => {
		  const panel = document.getElementById(saved.id);
		  if (!panel) return;
		  panel.style.flex = saved.flex || '';
		  panel.style.width = saved.width || '';
		  panel.classList.toggle('collapsed', !!saved.collapsed);
		});
	  } else if (Array.isArray(workspacePrefs.collapsedPanels)) {
		panels.forEach(panel => panel && panel.classList.toggle('collapsed', workspacePrefs.collapsedPanels.includes(panel.id)));
	  }

	  if (workspacePrefs.device) setDevice(workspacePrefs.device);
	  if (workspacePrefs.outputTab) switchOutputTab(workspacePrefs.outputTab, getOutputTabButton(workspacePrefs.outputTab));
	  setTimeout(() => {
		triggerLayoutUpdate();
		document.body.classList.remove('workspace-booting');
	  }, 120);
	}

	function applyLayoutPreset(preset) {
	  const topHalf = document.getElementById('editorTopSplit');
	  const bottomHalf = document.getElementById('outputBottomSplit');
	  const panels = [document.getElementById('htmlPanel'), document.getElementById('cssPanel'), document.getElementById('jsPanel')];
	  if (!topHalf || !bottomHalf) return;

	  const sizes = {
		balanced: ['60%', '40%'],
		code: ['calc(100% - 38px)', '38px'],
		preview: ['28%', '72%'],
		debug: ['46%', '54%']
	  };
	  const [top, bottom] = sizes[preset] || sizes.balanced;
	  topHalf.style.height = top;
	  bottomHalf.style.height = bottom;
	  panels.forEach(panel => {
		if (!panel) return;
		panel.classList.remove('collapsed');
		panel.style.flex = '';
		panel.style.width = '';
	  });
	  if (preset === 'debug') switchOutputTab('console', getOutputTabButton('console'));
	  if (preset === 'preview') switchOutputTab('preview', getOutputTabButton('preview'));
	  saveWorkspacePrefs({ layoutPreset: preset, topHeight: top, bottomHeight: bottom, panelFlex: [] });
	  setWorkspaceStatus(`Layout: ${preset}`, 'saved');
	  setTimeout(triggerLayoutUpdate, 160);
	}

	// Global Keyboard Listeners
	document.addEventListener('keydown', (e) => {
	  const codebox = document.getElementById('codebox');
	  if (codebox && codebox.classList.contains('active')) {
		if ((e.ctrlKey || e.metaKey) && e.key === 's') { 
		  e.preventDefault(); smartRun(true); showToast("<i class='ph-fill ph-play' style='margin-right:6px;'></i> Saved & Ran!"); 
		}
	  }
	});

	// --- COMMAND PALETTE (CMD+K) ---
	const workspaceCommands = [
	  { id: 'focus-html', icon: 'ph-file-html', label: 'Focus HTML', action: () => focusPanel('html') },
	  { id: 'focus-css', icon: 'ph-file-css', label: 'Focus CSS', action: () => focusPanel('css') },
	  { id: 'focus-js', icon: 'ph-file-js', label: 'Focus JavaScript', action: () => focusPanel('js') },
	  { id: 'compile', icon: 'ph-play', label: 'Compile Workspace', action: () => smartRun(true) },
	  { id: 'time-machine', icon: 'ph-clock-counter-clockwise', label: 'Open Local Time Machine', action: () => openTimeMachine() },
	  { id: 'preview', icon: 'ph-browser', label: 'Show Preview', action: () => switchOutputTab('preview', getOutputTabButton('preview')) },
	  { id: 'console', icon: 'ph-terminal', label: 'Show Console', action: () => switchOutputTab('console', getOutputTabButton('console')) },
	  { id: 'state', icon: 'ph-tree-structure', label: 'Show State Visualizer', action: () => switchOutputTab('state', getOutputTabButton('state')) },
	  { id: 'sidebar', icon: 'ph-sidebar-simple', label: 'Toggle Explorer', action: () => toggleSidebar('toggle') },
	  { id: 'tabs', icon: 'ph-arrows-out-line-vertical', label: 'Toggle Output Tabs', action: () => toggleOutputTabs() },
	  { id: 'format', icon: 'ph-magic-wand', label: 'Format Code', action: () => formatCode() },
	  { id: 'tailwind', icon: 'ph-wind', label: 'Add Tailwind CDN', action: () => addSpecificCDN('https://cdn.tailwindcss.com') },
	  { id: 'desktop', icon: 'ph-monitor', label: 'Preview Desktop Width', action: () => setDevice('desktop') },
	  { id: 'tablet', icon: 'ph-device-tablet', label: 'Preview Tablet Width', action: () => setDevice('tablet') },
	  { id: 'mobile', icon: 'ph-device-mobile', label: 'Preview Mobile Width', action: () => setDevice('mobile') },
	  { id: 'zip', icon: 'ph-file-archive', label: 'Download ZIP', action: () => downloadZip() },
	  { id: 'dashboard', icon: 'ph-kanban', label: 'Open Project Manager', action: () => openDashboard() },
	  { id: 'theme', icon: 'ph-sun', label: 'Toggle Theme', action: () => toggleTheme() },
	  { id: 'layout-balanced', icon: 'ph-layout', label: 'Layout: Balanced', action: () => applyLayoutPreset('balanced') },
	  { id: 'layout-code', icon: 'ph-code', label: 'Layout: Code Focus', action: () => applyLayoutPreset('code') },
	  { id: 'layout-preview', icon: 'ph-browser', label: 'Layout: Preview Focus', action: () => applyLayoutPreset('preview') },
	  { id: 'layout-debug', icon: 'ph-bug', label: 'Layout: Console Debug', action: () => applyLayoutPreset('debug') }
	];

	let selectedCommandIndex = 0;

	function getVisibleCommandItems() {
	  return Array.from(document.querySelectorAll('#cmdList .cmd-item')).filter(item => item.style.display !== 'none');
	}

	function setSelectedCommand(index) {
	  const items = getVisibleCommandItems();
	  if (!items.length) {
		selectedCommandIndex = 0;
		return;
	  }
	  selectedCommandIndex = ((index % items.length) + items.length) % items.length;
	  items.forEach((item, itemIndex) => {
		const isSelected = itemIndex === selectedCommandIndex;
		item.classList.toggle('selected', isSelected);
		item.setAttribute('aria-selected', isSelected ? 'true' : 'false');
		if (isSelected) item.scrollIntoView({ block: 'nearest' });
	  });
	}

	function renderWorkspaceCommands() {
	  if (!document.getElementById('codebox')) return;
	  const list = document.getElementById('cmdList');
	  const input = document.getElementById('cmdInput');
	  if (!list) return;
	  if (input) input.placeholder = 'Run a workspace command...';
	  list.innerHTML = workspaceCommands.map((command, index) => `
		<button type="button" class="cmd-item ws-command-item" data-command="${command.id}" onclick="runWorkspaceCommand('${command.id}')">
		  <div class="cmd-item-left"><span class="cmd-icon-wrap"><i class="ph-bold ${command.icon}"></i></span><span>${command.label}</span></div>
		  <div class="cmd-item-right">${index === 0 ? 'Enter' : ''}</div>
		</button>
	  `).join('');
	  selectedCommandIndex = 0;
	  setSelectedCommand(0);
	}

	function runWorkspaceCommand(id) {
	  const command = workspaceCommands.find(item => item.id === id);
	  if (!command) return;
	  command.action();
	  const palette = document.getElementById('cmdPalette');
	  if (palette) palette.classList.remove('active');
	}

	function toggleCmdK() {
	  const p = document.getElementById('cmdPalette');
	  if(!p) return;
	  renderWorkspaceCommands();
	  p.classList.toggle('active');
	  if (p.classList.contains('active')) {
		setTimeout(() => {
		  const input = document.getElementById('cmdInput');
		  if(input) { input.focus(); input.value = ''; }
		  document.querySelectorAll('.cmd-item').forEach(item => item.style.display = 'flex');
		  setSelectedCommand(0);
		}, 100);
	  }
	}

	document.addEventListener("DOMContentLoaded", () => {
		renderWorkspaceCommands();
		const cmdInput = document.getElementById('cmdInput');
		if (cmdInput) {
			cmdInput.addEventListener('input', function(e) {
				const term = e.target.value.toLowerCase().trim();
				document.querySelectorAll('.cmd-item').forEach(item => {
				  if (item.textContent.toLowerCase().includes(term)) item.style.display = 'flex'; 
				  else item.style.display = 'none'; 
				});
				setSelectedCommand(0);
			});
			cmdInput.addEventListener('keydown', function(e) {
				const items = getVisibleCommandItems();
				if (e.key === 'ArrowDown') {
					e.preventDefault();
					setSelectedCommand(selectedCommandIndex + 1);
				} else if (e.key === 'ArrowUp') {
					e.preventDefault();
					setSelectedCommand(selectedCommandIndex - 1);
				} else if (e.key === 'Enter' && items.length) {
					e.preventDefault();
					items[selectedCommandIndex].click();
				}
			});
		}

		document.addEventListener('keydown', (e) => {
			if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); toggleCmdK(); }
			if (e.key === 'Escape') {
				const p = document.getElementById('cmdPalette');
				if(p) p.classList.remove('active');
			}
		});

		const p = document.getElementById('cmdPalette');
		if(p) {
			p.addEventListener('click', (e) => {
				if(e.target.id === 'cmdPalette') toggleCmdK();
			});
		}
	});

	// --- DEPENDENCY MANAGEMENT ---
	function toggleCDN() { document.getElementById('cdnManager').classList.toggle('active'); document.getElementById('optionsMenu').classList.remove('active'); }
	function addCDN() { const input = document.getElementById('cdnInput'); if(!input.value) return; cdnLinks.push(input.value); input.value = ""; renderCDNs(); smartRun(); }
	function addSpecificCDN(url) { if(!cdnLinks.includes(url)) { cdnLinks.push(url); renderCDNs(); smartRun(); showToast("<i class='ph-bold ph-package' style='margin-right:6px;'></i> Library Added"); } }
	function removeCDN(index) { cdnLinks.splice(index, 1); renderCDNs(); smartRun(); }
	function renderCDNs() { document.getElementById('cdnList').innerHTML = cdnLinks.map((link, i) => `<div class="cdn-item"><span>${link}</span><span class="cdn-remove" onclick="removeCDN(${i})"><i class="ph-bold ph-x"></i></span></div>`).join(''); }

	// --- EXPORT Logic ---
	function exportSingleFile() {
	  if(!isIdeInitialized) return;
	  showToast("<i class='ph-bold ph-download-simple' style='margin-right:6px;'></i> Downloading single file...");
	  let cdnTags = cdnLinks.map(link => link.endsWith('.css') ? `<link rel="stylesheet" href="${link}">` : `<script src="${link}"><\/script>`).join('\n  ');
	  
	  vfs[activeFiles.html] = htmlMonaco.getValue(); vfs[activeFiles.css] = cssMonaco.getValue(); vfs[activeFiles.js] = jsMonaco.getValue();
	  let combinedCSS = ""; let combinedJS = "";
	  Object.keys(vfs).forEach(k => { if(k.endsWith('.css')) combinedCSS += vfs[k] + '\n'; if(k.endsWith('.js')) combinedJS += vfs[k] + '\n'; });

	  let combinedHTML = vfs['index.html'] || '';
	  Object.keys(vfs).forEach(k => { if(k !== 'index.html' && k.endsWith('.html')) combinedHTML += `\n\n` + vfs[k] + '\n'; });

	  const htmlContent = `\n<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Exported Project</title>\n  ${cdnTags}\n<style>\n${combinedCSS}\n</style>\n</head>\n<body>\n${combinedHTML}\n<script>\n${combinedJS}\n<\/script>\n</body>\n</html>`;
	  const blob = new Blob([htmlContent], { type: 'text/html' }); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "dev-project.html"; 
	  document.body.appendChild(a); a.click(); document.body.removeChild(a); document.getElementById('optionsMenu').classList.remove('active');
	}

	function downloadZip() {
	  if(!isIdeInitialized) return;
	  showToast("<i class='ph-bold ph-file-archive' style='margin-right:6px;'></i> Bundling ZIP...");
	  var zip = new JSZip();
	  let cdnTags = cdnLinks.map(link => link.endsWith('.css') ? `<link rel="stylesheet" href="${link}">` : `<script src="${link}"><\/script>`).join('\n  ');
	  
	  vfs[activeFiles.html] = htmlMonaco.getValue(); vfs[activeFiles.css] = cssMonaco.getValue(); vfs[activeFiles.js] = jsMonaco.getValue();
	  
	  let combinedHTML = vfs['index.html'] || '';
	  Object.keys(vfs).forEach(k => { if(k !== 'index.html' && k.endsWith('.html')) combinedHTML += `\n\n` + vfs[k] + '\n'; });

	  const htmlContent = `\n<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Exported Project</title>\n  ${cdnTags}\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n${combinedHTML}\n  <script src="script.js"><\/script>\n</body>\n</html>`;
	  zip.file("index.html", htmlContent); 
	  
	  let combinedCSS = ""; let combinedJS = "";
	  Object.keys(vfs).forEach(k => { if(k.endsWith('.css')) combinedCSS += `/* --- ${k} --- */\n` + vfs[k] + '\n'; if(k.endsWith('.js')) combinedJS += `/* --- ${k} --- */\n` + vfs[k] + '\n'; });
	  
	  zip.file("style.css", combinedCSS); zip.file("script.js", combinedJS);
	  
	  zip.generateAsync({type:"blob"}).then(function(content) { 
		const a = document.createElement("a"); a.href = URL.createObjectURL(content); a.download = "dev-toolbox-project.zip"; 
		document.body.appendChild(a); a.click(); document.body.removeChild(a);
	  });
	  document.getElementById('optionsMenu').classList.remove('active');
	}

	// --- CONSOLE & STATE LOGIC ---
	let runTimeout; let cmdHistory = []; let historyIndex = -1;
	function handleAutoRunToggle() { if(document.getElementById('autoRunToggle').checked) smartRun(false); }
	function clearConsole(manual = false) { const logs = document.getElementById('consoleLogs'); if(logs) logs.innerHTML = ""; }
	function queueUpdate(panelType = 'all') {
	  if (isRestoringSnapshot) return;
	  clearTimeout(runTimeout);
	  if (!document.getElementById('autoRunToggle').checked) return;
	  runTimeout = setTimeout(() => {
		if ((panelType === 'html' || panelType === 'css') && htmlMonaco && cssMonaco && jsMonaco) {
		  const liveIframe = document.getElementById('liveIframe');
		  if (liveIframe && liveIframe.contentWindow) {
			if (panelType === 'html') {
			  vfs[activeFiles.html] = htmlMonaco.getValue();
			  liveIframe.contentWindow.postMessage({ type: 'update-html', html: collectHTML() }, '*');
			  setWorkspaceStatus('Preview updated', 'saved');
			} else {
			  vfs[activeFiles.css] = cssMonaco.getValue();
			  liveIframe.contentWindow.postMessage({ type: 'update-css', css: collectCSS() }, '*');
			  setWorkspaceStatus('Styles updated', 'saved');
			}
			scheduleProjectSave();
			return;
		  }
		}
		smartRun(false);
	  }, panelType === 'css' || panelType === 'html' ? 220 : 650);
	}

	function scheduleProjectSave() {
	  setWorkspaceStatus('Saving...', 'saving');
	  clearTimeout(scheduleProjectSave.timer);
	  scheduleProjectSave.timer = setTimeout(() => {
		currentProject.vfs = vfs;
		currentProject.activeFiles = activeFiles;
		currentProject.lastModified = Date.now();
		let projIndex = projects.findIndex(p => p.id === currentProjectId);
		if (projIndex > -1) projects[projIndex] = currentProject;
		localStorage.setItem('nitro_projects', JSON.stringify(projects));
		setWorkspaceStatus('Saved', 'saved');
	  }, 500);
	}

	function filterConsole(type, btn) {
	  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active')); if (btn) btn.classList.add('active');
	  const logs = document.querySelectorAll('.console-entry');
	  logs.forEach(log => {
		if (type === 'all') { log.style.display = 'flex'; } 
		else if (type === 'error' && log.classList.contains('con-err-line')) { log.style.display = 'flex'; } 
		else if (type === 'warn' && log.classList.contains('con-warn-line')) { log.style.display = 'flex'; } 
		else if (type === 'log' && (log.classList.contains('con-log-line') || log.classList.contains('con-ret-line'))) { log.style.display = 'flex'; } 
		else { log.style.display = 'none'; }
	  });
	}

	function logToConsole(msg, type="error", line=null, editor="jsEditor") {
	  const logs = document.getElementById('consoleLogs');
	  if (type === 'error') setWorkspaceStatus(line ? `Error on line ${line}` : 'Runtime error', 'error', true);
	  // Changed class name to console-entry to avoid conflicts
	  let colorClass = type === 'error' ? 'con-err-line' : type === 'warn' ? 'con-warn-line' : type === 'return' ? 'con-ret-line' : 'con-log-line';
	  let time = new Date().toLocaleTimeString([], {hour12: false});
	  let linkStr = line ? `<span class="error-link" onclick="goToLine('${editor}', ${line})">[Line ${line}]</span>` : '';
	  let icon = type === 'return' ? '<i class="ph-bold ph-arrow-bend-down-right" style="margin-right:4px;"></i>' : '';
	  
	  // New cleaner HTML structure
	  logs.innerHTML += `<div class="console-entry ${colorClass}"><span class="log-time">${time}</span> <div class="console-content">${icon}${msg} ${linkStr}</div></div>`;
	  logs.scrollTop = logs.scrollHeight;
	  
	  if(!document.getElementById('outConsole').classList.contains('active') && type === 'error') {
		  let badge = document.getElementById('consoleBadge');
		  if (badge) badge.style.display = 'inline-flex';
	  }
	}

	window.addEventListener('message', (event) => {
	  if(event.data.type === 'clear') clearConsole(true);
	  else if (event.data.type === 'state-watch') handleStateWatch(event.data);
	  else if (event.data.type) logToConsole(event.data.msg, event.data.type, event.data.line, event.data.tab);
	});


	// --- STATE VISUALIZER ---
	let stateCache = {};
	function clearState() {
	  stateCache = {}; document.getElementById('stateVisualizer').innerHTML = ""; showToast("<i class='ph-bold ph-trash'></i> State Cleared");
	}
	function handleStateWatch(data) {
	  stateCache[data.name] = JSON.parse(data.data); renderStateVisualizer();
	}
	function renderStateVisualizer() {
	  const container = document.getElementById('stateVisualizer');
	  if(!container) return; let html = '';
	  Object.keys(stateCache).forEach(key => {
		  html += `<div style="margin-bottom: 15px;">
			  <div style="color:var(--text); font-weight:bold; border-bottom:1px solid var(--border); padding-bottom:5px; margin-bottom:5px;">${key}</div>
			  <pre class="json-block">${syntaxHighlightJSON(stateCache[key])}</pre>
		  </div>`;
	  });
	  container.innerHTML = html;
	}
	function syntaxHighlightJSON(json) {
	  if (typeof json != 'string') json = JSON.stringify(json, undefined, 2);
	  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
		  var cls = 'con-num';
		  if (/^"/.test(match)) {
			  if (/:$/.test(match)) { cls = 'con-key'; match = match.replace(/"/g, ''); } 
			  else { cls = 'con-str'; }
		  } else if (/true|false/.test(match)) { cls = 'con-func'; }
		  else if (/null/.test(match)) { cls = 'con-null'; }
		  return '<span class="' + cls + '">' + match + '</span>';
	  });
	}

	// --- CLI INTERCEPTOR ---
	function executeConsoleCmd(e) {
	  const input = document.getElementById('consoleInput');
	  if(e.key === 'Enter') {
		const rawCmd = input.value; const cmd = rawCmd.trim(); if(!cmd) return;
		cmdHistory.push(cmd); historyIndex = cmdHistory.length; logToConsole(`<span style="color:var(--text-muted)">&gt; ${cmd.replace(/</g, '&lt;')}</span>`, 'log'); input.value = "";
		const args = cmd.toLowerCase().split(' '); const mainCmd = args[0];

		const libraries = {
		  'tailwind': 'https://cdn.tailwindcss.com', 'jquery': 'https://code.jquery.com/jquery-3.7.1.min.js', 'gsap': 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js',
		  'react': 'https://unpkg.com/react@18/umd/react.development.js', 'react-dom': 'https://unpkg.com/react-dom@18/umd/react-dom.development.js',
		  'bootstrap': 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css'
		};

		if (mainCmd === 'install' || mainCmd === 'add') {
		  const lib = args[1];
		  if (libraries[lib]) { addSpecificCDN(libraries[lib]); logToConsole(`⚡ Success: Injected ${lib}.`, 'return'); } 
		  else if (lib) { addSpecificCDN(`https://unpkg.com/${lib}`); logToConsole(`⚡ Success: Fetched ${lib} from unpkg.`, 'return'); } 
		  else { logToConsole(`Usage: install &lt;library_name&gt;`, 'warn'); } return;
		}

		if (mainCmd === 'theme') {
		  const t = args[1]; const isLight = document.documentElement.classList.contains('light-mode');
		  if (t === 'dark' && isLight) toggleTheme(); else if (t === 'light' && !isLight) toggleTheme(); else if (t === 'toggle') toggleTheme();
		  logToConsole(`🎨 Theme updated.`, 'return'); return;
		}

		if (mainCmd === 'export') {
		  if (args[1] === '--zip' || args[1] === 'zip') { downloadZip(); logToConsole(`📦 Bundling ZIP...`, 'return'); } else { exportSingleFile(); logToConsole(`📄 Exporting HTML...`, 'return'); } return;
		}

		if (mainCmd === 'clear') { clearConsole(true); return; }
		if (mainCmd === 'format') { formatCode(); return; }
		
		if (mainCmd === 'help') {
		   logToConsole(`
			 <div style="padding: 10px 0; line-height: 1.8; font-family: 'JetBrains Mono', monospace;">
			   <span style="color:var(--text); font-weight:bold;">Developer Command Line Interface</span><br>
			   <span style="color:var(--accent);">install &lt;lib&gt;</span> - Inject a CDN (e.g. <i>install tailwind</i>)<br>
			   <span style="color:var(--accent);">theme &lt;dark|light&gt;</span> - Change workspace aesthetic<br>
			   <span style="color:var(--accent);">export zip</span> - Download full source code<br>
			   <span style="color:var(--accent);">export html</span> - Download single-file bundle<br>
			   <span style="color:var(--accent);">format</span> - Prettify all active code panels<br>
			   <span style="color:var(--accent);">clear</span> - Wipe console history
			 </div>
		   `, 'log'); return;
		}

		const liveIframe = document.getElementById('liveIframe');
		if(liveIframe && liveIframe.contentWindow) { liveIframe.contentWindow.postMessage({ type: 'eval', cmd: rawCmd }, '*'); }
	  
	  } else if (e.key === 'ArrowUp') { e.preventDefault(); if (historyIndex > 0) { historyIndex--; input.value = cmdHistory[historyIndex]; }
	  } else if (e.key === 'ArrowDown') { e.preventDefault(); if (historyIndex < cmdHistory.length - 1) { historyIndex++; input.value = cmdHistory[historyIndex]; } else { historyIndex = cmdHistory.length; input.value = ''; } }
	}

	// --- VFS EXECUTION ENGINE ---
	function collectHTML() {
	  let combinedHTML = vfs['index.html'] || '';
	  Object.keys(vfs).forEach(k => {
		if(k !== 'index.html' && k.endsWith('.html')) combinedHTML += `\n\n` + vfs[k] + '\n';
	  });
	  return combinedHTML;
	}

	function collectCSS() {
	  let combinedCSS = '';
	  Object.keys(vfs).forEach(k => {
		if(k.endsWith('.css')) combinedCSS += `\n/* --- MODULE: ${k} --- */\n` + vfs[k] + '\n';
	  });
	  return combinedCSS;
	}

	function collectJS() {
	  let combinedJS = '';
	  Object.keys(vfs).forEach(k => {
		if(k.endsWith('.js')) combinedJS += `\n// --- MODULE: ${k} ---\n` + vfs[k] + '\n';
	  });
	  return combinedJS;
	}

	const TIME_MACHINE_LIMIT = 12;

	function getTimeMachineKey(projectId = currentProjectId) {
	  return `nitro_time_machine_${projectId}`;
	}

	function cloneTimeMachineData(value, fallback = {}) {
	  try {
		return JSON.parse(JSON.stringify(value || fallback));
	  } catch (e) {
		return fallback;
	  }
	}

	function escapeTimeMachineHTML(value) {
	  return String(value ?? '').replace(/[&<>"']/g, char => ({
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#39;'
	  }[char]));
	}

	function readTimeSnapshots(projectId = currentProjectId) {
	  try {
		const snapshots = JSON.parse(localStorage.getItem(getTimeMachineKey(projectId))) || [];
		return Array.isArray(snapshots) ? snapshots.filter(snapshot => snapshot && snapshot.id) : [];
	  } catch (e) {
		return [];
	  }
	}

	function writeTimeSnapshots(snapshots, projectId = currentProjectId) {
	  const capped = (Array.isArray(snapshots) ? snapshots : []).slice(0, TIME_MACHINE_LIMIT);
	  const key = getTimeMachineKey(projectId);
	  const attemptSizes = [...new Set([capped.length, 8, 4, 2, 1].filter(size => size > 0 && size <= capped.length))];

	  for (const size of attemptSizes) {
		try {
		  localStorage.setItem(key, JSON.stringify(capped.slice(0, size)));
		  return true;
		} catch (e) {}
	  }

	  showToast("<i class='ph-bold ph-warning-circle' style='margin-right:6px;'></i> History storage is full.");
	  return false;
	}

	function getSnapshotCharCount(snapshotVfs) {
	  return Object.values(snapshotVfs || {}).reduce((sum, value) => sum + String(value || '').length, 0);
	}

	function formatSnapshotSize(chars = 0) {
	  if (chars >= 1000) return `${(chars / 1000).toFixed(chars >= 10000 ? 0 : 1)}k chars`;
	  return `${chars} chars`;
	}

	function formatSnapshotTime(timestamp) {
	  return new Date(timestamp).toLocaleString([], {
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	  });
	}

	function getConsoleSummary() {
	  const entries = Array.from(document.querySelectorAll('#consoleLogs .console-entry'));
	  const preview = entries.slice(-4).map(entry => {
		const content = entry.querySelector('.console-content');
		return (content ? content.textContent : entry.textContent || '').replace(/\s+/g, ' ').trim();
	  }).filter(Boolean);

	  return {
		total: entries.length,
		errors: entries.filter(entry => entry.classList.contains('con-err-line')).length,
		warnings: entries.filter(entry => entry.classList.contains('con-warn-line')).length,
		logs: entries.filter(entry => entry.classList.contains('con-log-line') || entry.classList.contains('con-ret-line')).length,
		preview
	  };
	}

	function saveTimeSnapshot(reason = 'compile') {
	  const snapshotVfs = cloneTimeMachineData(vfs);
	  const now = Date.now();
	  const snapshot = {
		id: `snap_${now}_${Math.random().toString(36).slice(2, 7)}`,
		createdAt: now,
		reason,
		projectId: currentProjectId,
		projectName: currentProject && currentProject.name ? currentProject.name : 'Workspace',
		fileCount: Object.keys(snapshotVfs).length,
		totalChars: getSnapshotCharCount(snapshotVfs),
		activeFiles: cloneTimeMachineData(activeFiles, { html: 'index.html', css: 'style.css', js: 'script.js' }),
		vfs: snapshotVfs,
		console: { total: 0, errors: 0, warnings: 0, logs: 0, preview: [], pending: true }
	  };

	  const snapshots = readTimeSnapshots();
	  if (!writeTimeSnapshots([snapshot, ...snapshots])) return null;
	  renderTimeMachineList();
	  setWorkspaceStatus('Snapshot saved', 'saved');
	  return snapshot.id;
	}

	function finalizeTimeSnapshot(snapshotId) {
	  if (!snapshotId) return;
	  const snapshots = readTimeSnapshots();
	  const snapshotIndex = snapshots.findIndex(snapshot => snapshot.id === snapshotId);
	  if (snapshotIndex === -1) return;
	  snapshots[snapshotIndex].console = { ...getConsoleSummary(), pending: false };
	  writeTimeSnapshots(snapshots);
	  renderTimeMachineList();
	}

	function getSnapshotHealth(snapshot) {
	  const summary = snapshot.console || {};
	  if (summary.pending) return { className: 'is-pending', icon: 'ph-spinner-gap', label: 'Capturing console' };
	  if (summary.errors > 0) return { className: 'is-error', icon: 'ph-warning-circle', label: `${summary.errors} error${summary.errors === 1 ? '' : 's'}` };
	  if (summary.warnings > 0) return { className: 'is-warning', icon: 'ph-warning', label: `${summary.warnings} warning${summary.warnings === 1 ? '' : 's'}` };
	  if (summary.total > 0) return { className: 'is-clean', icon: 'ph-check-circle', label: `${summary.total} console item${summary.total === 1 ? '' : 's'}` };
	  return { className: 'is-quiet', icon: 'ph-circle', label: 'No console output' };
	}

	function getSnapshotActiveLabel(snapshot) {
	  const files = Object.values(snapshot.activeFiles || {}).filter(Boolean);
	  return files.length ? files.map(escapeTimeMachineHTML).join(', ') : 'Default files';
	}

	function renderTimeMachineList() {
	  const list = document.getElementById('timeMachineList');
	  if (!list) return;
	  const snapshots = readTimeSnapshots();

	  if (!snapshots.length) {
		list.innerHTML = `
		  <div class="time-machine-empty">
			<i class="ph-bold ph-clock-counter-clockwise"></i>
			<h4>No restore points yet</h4>
			<p>Press Compile to save the first local snapshot for this project.</p>
		  </div>
		`;
		return;
	  }

	  list.innerHTML = snapshots.map((snapshot, index) => {
		const health = getSnapshotHealth(snapshot);
		const safeProjectName = escapeTimeMachineHTML(snapshot.projectName || 'Workspace');
		const consolePreview = snapshot.console && snapshot.console.preview && snapshot.console.preview.length
		  ? `<div class="time-snapshot-console">${snapshot.console.preview.map(line => `<span>${escapeTimeMachineHTML(line)}</span>`).join('')}</div>`
		  : '';

		return `
		  <article class="time-snapshot-card">
			<div class="time-snapshot-main">
			  <div class="time-snapshot-icon"><i class="ph-bold ph-clock-counter-clockwise"></i></div>
			  <div class="time-snapshot-copy">
				<div class="time-snapshot-title-row">
				  <h4>${index === 0 ? 'Latest compile' : 'Compile snapshot'}</h4>
				  ${index === 0 ? '<span class="time-snapshot-pill">Newest</span>' : ''}
				</div>
				<p>${safeProjectName} - ${formatSnapshotTime(snapshot.createdAt)}</p>
				<div class="time-snapshot-meta">
				  <span><i class="ph-bold ph-files"></i> ${snapshot.fileCount || 0} files</span>
				  <span><i class="ph-bold ph-text-aa"></i> ${formatSnapshotSize(snapshot.totalChars || 0)}</span>
				  <span><i class="ph-bold ph-crosshair"></i> ${getSnapshotActiveLabel(snapshot)}</span>
				</div>
				<div class="time-snapshot-health ${health.className}">
				  <i class="ph-bold ${health.icon}"></i> ${escapeTimeMachineHTML(health.label)}
				</div>
				${consolePreview}
			  </div>
			</div>
			<div class="time-snapshot-actions">
			  <button class="btn btn-compact primary-btn" onclick="restoreTimeSnapshot('${snapshot.id}')"><i class="ph-bold ph-arrow-counter-clockwise"></i> Restore</button>
			</div>
		  </article>
		`;
	  }).join('');
	}

	function openTimeMachine() {
	  const menu = document.getElementById('optionsMenu');
	  const modal = document.getElementById('timeMachineModal');
	  if (menu) menu.classList.remove('active');
	  renderTimeMachineList();
	  if (modal) modal.classList.add('active');
	}

	function closeTimeMachine() {
	  const modal = document.getElementById('timeMachineModal');
	  if (modal) modal.classList.remove('active');
	}

	function handleTimeMachineBackdrop(event) {
	  if (event.target && event.target.id === 'timeMachineModal') closeTimeMachine();
	}

	function clearTimeSnapshots() {
	  if (!confirm('Clear all local snapshots for this project?')) return;
	  localStorage.removeItem(getTimeMachineKey());
	  renderTimeMachineList();
	  setWorkspaceStatus('History cleared', 'saved');
	  showToast("<i class='ph-bold ph-check-circle' style='margin-right:6px;'></i> Local history cleared.");
	}

	function pickSnapshotActiveFile(snapshotVfs, requestedFile, extension, fallbackFile) {
	  if (requestedFile && Object.prototype.hasOwnProperty.call(snapshotVfs, requestedFile)) return requestedFile;
	  const matchingFile = Object.keys(snapshotVfs).find(filename => filename.endsWith(extension));
	  return matchingFile || fallbackFile;
	}

	function syncEditorFromSnapshot() {
	  const htmlValue = vfs[activeFiles.html] ?? vfs['index.html'] ?? '';
	  const cssValue = vfs[activeFiles.css] ?? vfs['style.css'] ?? '';
	  const jsValue = vfs[activeFiles.js] ?? vfs['script.js'] ?? '';

	  if (htmlMonaco) htmlMonaco.setValue(htmlValue);
	  if (cssMonaco) cssMonaco.setValue(cssValue);
	  if (jsMonaco) jsMonaco.setValue(jsValue);

	  const htmlPill = document.getElementById('htmlPanelPillText');
	  const cssPill = document.getElementById('cssPanelPillText');
	  const jsPill = document.getElementById('jsPanelPillText');
	  if (htmlPill) htmlPill.innerText = activeFiles.html;
	  if (cssPill) cssPill.innerText = activeFiles.css;
	  if (jsPill) jsPill.innerText = activeFiles.js;
	}

	function restoreTimeSnapshot(snapshotId) {
	  const snapshot = readTimeSnapshots().find(item => item.id === snapshotId);
	  if (!snapshot || !snapshot.vfs) {
		showToast("<i class='ph-bold ph-warning-circle' style='margin-right:6px;'></i> Snapshot not found.");
		return;
	  }

	  const nextVfs = cloneTimeMachineData(snapshot.vfs);
	  if (!Object.keys(nextVfs).length) {
		showToast("<i class='ph-bold ph-warning-circle' style='margin-right:6px;'></i> Snapshot is empty.");
		return;
	  }

	  if (typeof nextVfs['index.html'] === 'undefined') nextVfs['index.html'] = '';
	  if (typeof nextVfs['style.css'] === 'undefined') nextVfs['style.css'] = '';
	  if (typeof nextVfs['script.js'] === 'undefined') nextVfs['script.js'] = '';

	  const snapshotActive = snapshot.activeFiles || {};
	  vfs = nextVfs;
	  activeFiles = {
		html: pickSnapshotActiveFile(vfs, snapshotActive.html, '.html', 'index.html'),
		css: pickSnapshotActiveFile(vfs, snapshotActive.css, '.css', 'style.css'),
		js: pickSnapshotActiveFile(vfs, snapshotActive.js, '.js', 'script.js')
	  };

	  currentProject.vfs = vfs;
	  currentProject.activeFiles = activeFiles;
	  currentProject.lastModified = Date.now();
	  const projIndex = projects.findIndex(p => p.id === currentProjectId);
	  if (projIndex > -1) projects[projIndex] = currentProject;
	  localStorage.setItem('nitro_projects', JSON.stringify(projects));

	  isRestoringSnapshot = true;
	  syncEditorFromSnapshot();
	  renderVFS();
	  triggerLayoutUpdate();
	  isRestoringSnapshot = false;

	  closeTimeMachine();
	  smartRun(false);
	  setWorkspaceStatus('Snapshot restored', 'saved');
	  showToast("<i class='ph-bold ph-arrow-counter-clockwise' style='margin-right:6px;'></i> Snapshot restored.");
	}

	function smartRun(manual = false) {
	  if(!isIdeInitialized) return;
	  setWorkspaceStatus(manual ? 'Compiling...' : 'Running...', 'running');
	  
	  vfs[activeFiles.html] = htmlMonaco ? htmlMonaco.getValue() : '';
	  vfs[activeFiles.css] = cssMonaco ? cssMonaco.getValue() : '';
	  vfs[activeFiles.js] = jsMonaco ? jsMonaco.getValue() : '';

	  // Silently backup the workspace to local storage to prevent data loss on refresh
	  currentProject.vfs = vfs;
  currentProject.activeFiles = activeFiles;
  currentProject.lastModified = Date.now();
  let projIndex = projects.findIndex(p => p.id === currentProjectId);
  if (projIndex > -1) projects[projIndex] = currentProject;
  localStorage.setItem('nitro_projects', JSON.stringify(projects));
	  
	  const snapshotId = manual ? saveTimeSnapshot('compile') : null;

	  forceRun(collectHTML(), collectCSS(), collectJS(), document.getElementById('liveIframe'), { clearConsole: manual });
	  if (snapshotId) setTimeout(() => finalizeTimeSnapshot(snapshotId), 900);
	}

	function forceRun(html, css, js, iframe, options = {}) {
	  if (options.clearConsole) document.getElementById('consoleLogs').innerHTML = ""; 
	  let cdnTags = cdnLinks.map(link => link.endsWith('.css') ? `<link rel="stylesheet" href="${link}">` : `<script src="${link}"><\/script>`).join('\n');
	  
	  let headAndCss = `<!DOCTYPE html>\n<html>\n<head>\n${cdnTags}\n<style id="live-css-inject">\n::-webkit-scrollbar { width: 6px; height: 6px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: rgba(161, 161, 170, 0.4); border-radius: 10px; } ::-webkit-scrollbar-thumb:hover { background: rgba(161, 161, 170, 0.6); }\n${css}\n</style>\n`;
	  
	  const interceptor = `<script>
		const JS_OFFSET = ${headAndCss.split('\n').length + 30}; 
		function serialize(arg) { 
		  if(arg === null) return '<span class="con-null">null</span>';
		  if(arg === undefined) return '<span class="con-null">undefined</span>';
		  if(typeof arg === 'function') return '<span class="con-func">ƒ</span> ' + (arg.name || 'anonymous') + '()';
		  if(arg instanceof HTMLElement) return '<span class="con-tag">' + arg.outerHTML.substring(0, 50).replace(/</g, '&lt;') + (arg.outerHTML.length > 50 ? '...' : '') + '</span>';
		  if(typeof arg === 'string') return '<span class="con-str">' + arg.replace(/</g, '&lt;') + '</span>';
		  if(typeof arg === 'number' || typeof arg === 'boolean') return '<span class="con-num">' + arg + '</span>';
		  try { 
			const seen = new WeakSet();
			const json = JSON.stringify(arg, (k, v) => { if(typeof v === "object" && v !== null) { if(seen.has(v)) return "[Circular]"; seen.add(v); } return v; }, 2);
			return '<pre class="json-block">' + json.replace(/"(.*?)":/g, '<span class="con-key">"$1"</span>:') + '</pre>'; 
		  } catch(e) { return String(arg); } 
		}
		window.onerror = function(m, u, l) { let realLine = l - JS_OFFSET; if(realLine < 1) realLine = null; window.parent.postMessage({type: 'error', msg: m, line: realLine, tab: 'jsEditor'}, '*'); return true; };
		window.addEventListener('unhandledrejection', function(e) { window.parent.postMessage({type: 'error', msg: 'Promise Rejection: ' + (e.reason ? e.reason : 'Unknown')}, '*'); });
		window.addEventListener('error', function(e) { if(e.target.tagName) window.parent.postMessage({type: 'error', msg: 'Failed to load ' + e.target.tagName.toLowerCase() + ': ' + (e.target.src || e.target.href)}, '*'); }, true);
		
		const ogLog = console.log, ogWarn = console.warn, ogErr = console.error, ogClear = console.clear;
		console.log = function(...a) { window.parent.postMessage({type: 'log', msg: a.map(serialize).join(' ')}, '*'); ogLog.apply(console, a); };
		console.warn = function(...a) { window.parent.postMessage({type: 'warn', msg: a.map(serialize).join(' ')}, '*'); ogWarn.apply(console, a); };
		console.error = function(...a) { window.parent.postMessage({type: 'error', msg: a.map(serialize).join(' ')}, '*'); ogErr.apply(console, a); };
		console.clear = function() { window.parent.postMessage({type: 'clear'}, '*'); ogClear.apply(console); };
		
		// State Visualizer Hook
		window.Nitro = {
			watch: function(name, data) {
				window.parent.postMessage({type: 'state-watch', name: name, data: JSON.stringify(data)}, '*');
			}
		};
		
		window.addEventListener('message', function(e) { 
		  if(e.data.type === 'eval') { try { let r = eval(e.data.cmd); window.parent.postMessage({type: 'return', msg: serialize(r)}, '*'); } catch(err) { console.error(err.message); } }
		  if(e.data.type === 'update-html') { document.body.innerHTML = e.data.html; }
		  if(e.data.type === 'update-css') { let styleTag = document.getElementById('live-css-inject'); if(styleTag) styleTag.textContent = e.data.css; }
		});
	  <\/script>\n`;
	  
	  const bodyStart = `</head>\n<body>\n${html}\n<script>\n`;
	  if(iframe) {
		const nextSrc = headAndCss + interceptor + bodyStart + js + `\n<\/script>\n</body>\n</html>`;
		const parent = iframe.parentElement;
		if (!parent || !iframe.dataset.ready) {
		  iframe.srcdoc = nextSrc;
		  iframe.dataset.ready = 'true';
		  setWorkspaceStatus('Preview updated', 'saved');
		  return;
		}

		const nextFrame = document.createElement('iframe');
		nextFrame.setAttribute('sandbox', iframe.getAttribute('sandbox') || '');
		nextFrame.className = iframe.className;
		nextFrame.style.position = 'absolute';
		nextFrame.style.inset = '0';
		nextFrame.style.opacity = '0';
		nextFrame.style.pointerEvents = 'none';
		nextFrame.addEventListener('load', () => {
		  iframe.removeAttribute('id');
		  nextFrame.id = 'liveIframe';
		  nextFrame.dataset.ready = 'true';
		  nextFrame.style.position = '';
		  nextFrame.style.inset = '';
		  nextFrame.style.opacity = '';
		  nextFrame.style.pointerEvents = '';
		  iframe.remove();
		  setWorkspaceStatus('Preview updated', 'saved');
		}, { once: true });
		parent.appendChild(nextFrame);
		nextFrame.srcdoc = nextSrc;
	  }
	}
	
	// --- SERVERLESS SHARE LOGIC ---
function generateShareLink() {
  if (typeof LZString === 'undefined') {
      return showToast("<i class='ph-bold ph-warning-circle' style='margin-right:6px;'></i> Compression library missing.");
  }
  
  showToast("<i class='ph-bold ph-spinner-gap' style='margin-right:6px;'></i> Generating link...");
  
  // Compress the entire VFS and active file states
  const payload = JSON.stringify({ vfs: vfs, activeFiles: activeFiles });
  const compressed = LZString.compressToEncodedURIComponent(payload);
  
  // Build the URL
  const shareUrl = window.location.origin + window.location.pathname + "?code=" + compressed;
  
  // Copy to clipboard
  navigator.clipboard.writeText(shareUrl).then(() => {
    showToast("<i class='ph-bold ph-check-circle' style='color:var(--success); margin-right:6px;'></i> Link copied to clipboard!");
  }).catch(err => {
    console.error("Clipboard error:", err);
    showToast("<i class='ph-bold ph-warning-circle' style='margin-right:6px;'></i> Failed to copy link.");
  });
}

	function openDashboard() {
    renderDashboard();
    document.getElementById('projectDashboard').classList.add('active');
    document.getElementById('optionsMenu').classList.remove('active');
}

function closeDashboard() { document.getElementById('projectDashboard').classList.remove('active'); }

function renderDashboard() {
    const grid = document.getElementById('projectGrid');
    if(!grid) return;
    grid.innerHTML = '';
    projects.sort((a,b) => b.lastModified - a.lastModified).forEach(p => {
        let isActive = p.id === currentProjectId;
        let date = new Date(p.lastModified).toLocaleString();
        grid.innerHTML += `
            <div class="proj-card ${isActive ? 'active' : ''}">
                <h3>${p.name}</h3><p>Edited: ${date}</p>
                <div class="proj-actions">
                    ${isActive ? '<span class="proj-badge">Active</span>' : `<button class="btn btn-compact" onclick="switchProject('${p.id}')">Open</button>`}
                    ${projects.length > 1 ? `<button class="btn btn-compact btn-outline" style="color:var(--error); border-color:var(--error);" onclick="deleteProject('${p.id}')"><i class="ph-bold ph-trash"></i></button>` : ''}
                </div>
            </div>`;
    });
}

function createNewProject() {
    let name = prompt("Enter project name:");
    if(!name) return;
    let newProj = { id: 'proj_' + Date.now(), name: name, vfs: JSON.parse(JSON.stringify(defaultVfs)), activeFiles: { html: 'index.html', css: 'style.css', js: 'script.js' }, lastModified: Date.now() };
    projects.push(newProj);
    localStorage.setItem('nitro_projects', JSON.stringify(projects));
    switchProject(newProj.id, { resetWorkspace: true });
}

function switchProject(id, options = {}) {
    smartRun();
    if (options.resetWorkspace) resetWorkspacePrefs();
    localStorage.setItem('nitro_current_project_id', id);
    window.location.reload();
}

function deleteProject(id) {
    if(confirm("Delete this project?")) {
        projects = projects.filter(p => p.id !== id);
        localStorage.removeItem(getTimeMachineKey(id));
        localStorage.setItem('nitro_projects', JSON.stringify(projects));
        if(currentProjectId === id) switchProject(projects[0].id); else renderDashboard();
    }
}

// --- PHASE 4: MONACO INTELLISENSE & COMPILER ENGINE ---
function enhanceMonaco() {
    if (typeof monaco === 'undefined') return;
    
    // 1. Upgrade Monaco Compiler to support modern React JSX and ES6 natively without red squiggles
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ES2020,
        allowNonTsExtensions: true,
        jsx: monaco.languages.typescript.JsxEmit.React,
        moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        module: monaco.languages.typescript.ModuleKind.CommonJS,
        noEmit: true,
        typeRoots: ["node_modules/@types"]
    });

    // 2. The Auto-Type Fetcher (IntelliSense Dictionary)
    const typeDefinitions = {
        'jquery': 'https://unpkg.com/@types/jquery/index.d.ts',
        'react': 'https://unpkg.com/@types/react/index.d.ts',
        'react-dom': 'https://unpkg.com/@types/react-dom/index.d.ts',
        'lodash': 'https://unpkg.com/@types/lodash/index.d.ts',
        'gsap': 'https://unpkg.com/@types/gsap/index.d.ts'
    };

    window.injectIntelliSense = async function(url) {
        let lib = Object.keys(typeDefinitions).find(k => url.toLowerCase().includes(k));
        if (lib && !window[`_typesLoaded_${lib}`]) {
            try {
                let res = await fetch(typeDefinitions[lib]);
                let dts = await res.text();
                monaco.languages.typescript.javascriptDefaults.addExtraLib(dts, `file:///node_modules/@types/${lib}/index.d.ts`);
                window[`_typesLoaded_${lib}`] = true;
                showToast(`<i class='ph-bold ph-magic-wand' style='color:#bb9af7; margin-right:6px;'></i> IntelliSense loaded for ${lib}`);
            } catch(e) {}
        }
    };

    // Intercept existing CDN additions to trigger IntelliSense automatically
    const originalAddSpecificCDN = window.addSpecificCDN;
    window.addSpecificCDN = function(url) {
        if (originalAddSpecificCDN) originalAddSpecificCDN(url);
        window.injectIntelliSense(url);
    };
    
    const originalAddCDN = window.addCDN;
    window.addCDN = function() {
        let url = document.getElementById('cdnInput').value;
        if (url) url = url.trim();
        if (originalAddCDN) originalAddCDN();
        if (url) window.injectIntelliSense(url);
    };
}

window.onload = () => {
    if (document.getElementById('codebox')) { 
        initIDE(); 
        setTimeout(enhanceMonaco, 1500); // Give Monaco time to boot up before injecting upgrades
    }
};


// --- IMPORT & DRAG-AND-DROP LOGIC ---
async function processImportedFiles(files) {
  showToast("<i class='ph-bold ph-spinner-gap' style='margin-right:6px;'></i> Importing...");
  let filesProcessed = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    // 1. Handle ZIP Files
    if (file.name.endsWith('.zip')) {
      const zip = await JSZip.loadAsync(file);
      for (const relativePath of Object.keys(zip.files)) {
        const zipEntry = zip.files[relativePath];
        if (!zipEntry.dir && (relativePath.endsWith('.html') || relativePath.endsWith('.css') || relativePath.endsWith('.js'))) {
          // Clean up folder paths (e.g. "my-project/index.html" -> "index.html")
          const cleanName = relativePath.split('/').pop(); 
          vfs[cleanName] = await zipEntry.async("string");
          filesProcessed++;
        }
      }
    } 
    // 2. Handle Individual Raw Files
    else if (file.name.endsWith('.html') || file.name.endsWith('.css') || file.name.endsWith('.js')) {
      const content = await file.text();
      vfs[file.name] = content;
      filesProcessed++;
    }
  }

  if (filesProcessed > 0) {
    // Ensure core files exist to prevent UI breaks
    if (!vfs['index.html']) vfs['index.html'] = "\n";
    if (!vfs['style.css']) vfs['style.css'] = "/* Imported project missing style.css */\n";
    if (!vfs['script.js']) vfs['script.js'] = "// Imported project missing script.js\n";

    // Update the editors with the new core files
    if(htmlMonaco) htmlMonaco.setValue(vfs['index.html']);
    if(cssMonaco) cssMonaco.setValue(vfs['style.css']);
    if(jsMonaco) jsMonaco.setValue(vfs['script.js']);
    
    activeFiles = { html: 'index.html', css: 'style.css', js: 'script.js' };
    
    renderVFS();
    smartRun();
    document.getElementById('optionsMenu').classList.remove('active');
    showToast(`<i class='ph-bold ph-check-circle' style='margin-right:6px; color:var(--success);'></i> Imported ${filesProcessed} files!`);
  } else {
    showToast("<i class='ph-bold ph-warning-circle' style='margin-right:6px;'></i> No valid HTML, CSS, or JS files found.");
  }
}

// Mobile/Click Import Trigger
function handleImport(event) {
  if (event.target.files.length > 0) {
    processImportedFiles(event.target.files);
  }
  event.target.value = ''; // Reset input
}

// Desktop Drag-and-Drop Listeners
const dragOverlay = document.getElementById('dragOverlay');
let dragCounter = 0; // Fixes flickering when dragging over child elements

// --- THE INVISIBLE DROP SHIELD ---
window.addEventListener('dragover', (e) => { e.preventDefault(); e.stopPropagation(); });
window.addEventListener('drop', (e) => { e.preventDefault(); e.stopPropagation(); });

document.body.addEventListener('dragenter', (e) => {
  e.preventDefault(); dragCounter++;
  if (dragOverlay) dragOverlay.style.display = 'flex';
});

document.body.addEventListener('dragleave', (e) => {
  e.preventDefault(); dragCounter--;
  if (dragCounter === 0 && dragOverlay) dragOverlay.style.display = 'none';
});

document.body.addEventListener('dragover', (e) => { e.preventDefault(); });

document.body.addEventListener('drop', (e) => {
  e.preventDefault(); dragCounter = 0;
  if (dragOverlay) dragOverlay.style.display = 'none';
  if (e.dataTransfer.files.length > 0) {
    processImportedFiles(e.dataTransfer.files);
  }
});



// ==========================================================================
// PHASE 5: GLOBAL UI COMPONENTS & HOMEPAGE LOGIC (NULL-CHECKED)
// ==========================================================================
const rPath = (window.location.pathname.includes('/blog/') || window.location.pathname.includes('/tools/') || window.location.pathname.includes('/landing/')) ? '../' : './';

// 1. THE UNIVERSAL HEADER
class NitroHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <div class="nitro-alert-bar-wrapper">
          <div class="nitro-alert-content-flex">
            <span class="nitro-alert-badge-pill">BETA</span>
            <span class="nitro-alert-message-text">NitroIDE is in active development. Help us shape the future of local coding!</span>
            <button onclick="toggleFeedbackModal()" class="nitro-alert-action-btn">Share Feedback <i class="ph-fill ph-arrow-right"></i></button>
          </div>
        </div>
        <nav class="floating-nav" id="floatingNav">
          <div class="logo">
            <a href="${rPath}index.html" style="text-decoration:none; display: flex; align-items: center; gap: 8px;">
              <img src="${rPath}logo/logo_white.png" alt="NitroIDE" class="logo-dark">
              <img src="${rPath}logo/logo_black.png" alt="NitroIDE" class="logo-light">
            </a>
            <div class="status-ping hide-in-mobile"><span class="ping-dot"></span> 0ms Latency</div>
          </div>
          <div class="nav-actions">
            <a href="${rPath}blog/index.html" aria-label="Tutorials" class="theme-toggle" style="text-decoration: none; display: flex; align-items: center; gap: 6px; height: 36px; box-sizing: border-box;"><i class="ph-bold ph-book-open"></i><span class="hide-in-mobile">Tutorials</span></a>
            <button class="theme-toggle hide-in-mobile" onclick="toggleCmdK()" title="Command Palette" style="height: 36px; box-sizing: border-box;"><i class="ph-bold ph-magnifying-glass"></i> <span class="hide-in-mobile" style="font-size:0.7rem; font-weight:700; opacity:0.7;">⌘K</span></button>
            <button class="theme-toggle" onclick="toggleTheme()" id="themeBtnFloat" aria-label="Toggle Dark Mode" style="height: 36px; box-sizing: border-box;"><i class="ph-bold ph-sun"></i></button>
            <a href="${rPath}tools/codebox.html" class="btn btn-compact primary-btn hide-in-mobile" style="border-radius: 30px; padding: 0 16px; height: 36px; box-sizing: border-box; display: flex; align-items: center;">Open Workspace</a>
          </div>
        </nav>
        <div class="container relative-z" style="padding-top: 10px; padding-bottom: 0;">
            <div class="header-row">
              <div class="logo">
                <a href="${rPath}index.html" style="text-decoration:none; display: flex; align-items: center; gap: 8px;">
                  <img src="${rPath}logo/logo_white.png" alt="NitroIDE" class="logo-dark">
                  <img src="${rPath}logo/logo_black.png" alt="NitroIDE" class="logo-light">
                </a>
              </div>
              <div class="nav-actions">
                <a href="${rPath}blog/index.html" aria-label="Tutorials" class="theme-toggle" style="text-decoration: none; display: flex; align-items: center; gap: 6px; height: 36px; box-sizing: border-box;"><i class="ph-bold ph-book-open"></i><span class="hide-in-mobile">Tutorials</span></a>
                <button class="theme-toggle hide-in-mobile" onclick="toggleCmdK()" style="height: 36px; box-sizing: border-box;"><i class="ph-bold ph-magnifying-glass"></i> <span>Search...</span> <span class="cmd-badge">⌘K</span></button>
                <button class="theme-toggle" id="themeBtn" aria-label="Toggle Dark Mode" onclick="toggleTheme()" style="height: 36px; box-sizing: border-box;"><i class="ph-bold ph-sun"></i></button>
                <a href="${rPath}tools/codebox.html" class="btn btn-compact primary-btn" style="border-radius: 30px; padding: 0 16px; height: 36px; box-sizing: border-box; display: flex; align-items: center;">Open Workspace</a>
              </div>
            </div>
        </div>
        `;
    }
}
customElements.define('nitro-header', NitroHeader);

// 2. THE UNIVERSAL FOOTER (The Expanding "Dynamic Pill" Dock)
class NitroFooter extends HTMLElement {
    connectedCallback() {
        // Pathing Logic
        const isLanding = window.location.pathname.includes('/landing/');
        const isTools = window.location.pathname.includes('/tools/');
        const isBlog = window.location.pathname.includes('/blog/');
        const inSub = isLanding || isTools || isBlog;

        const rPath = inSub ? '../' : './';
        let lPath = isLanding ? './' : (inSub ? '../landing/' : 'landing/');

        this.innerHTML = `
        <style>
          .footer-wrapper {
            position: relative;
            overflow: hidden;
            border-top: 1px solid var(--border);
            padding-top: 40px;
            padding-bottom: 40px;
            margin-top: 0px;
          }
          
          /* The Massive Background Watermark */
          .footer-watermark {
            position: absolute;
            bottom: -5%;
            left: 50%;
            transform: translateX(-50%);
            font-size: 15vw;
            font-weight: 800;
            color: var(--text);
            opacity: 0.02;
            pointer-events: none;
            white-space: nowrap;
            z-index: 0;
            letter-spacing: -0.05em;
            user-select: none;
          }
          html.light-mode .footer-watermark { opacity: 0.03; color: #000; }

          /* The Upper Deck */
          .footer-upper {
            display: flex;
            justify-content: space-between;
            gap: 60px;
            position: relative;
            z-index: 1;
            margin-bottom: 60px;
          }
          
          .footer-brand {
            flex: 0 0 300px;
          }
          .footer-hero {
            font-size: clamp(2rem, 3vw, 2.8rem);
            font-weight: 800;
            letter-spacing: -1px;
            color: var(--text);
            line-height: 1.1;
            margin-bottom: 15px;
          }
          .footer-hero span { color: var(--text-muted); }
          
          .footer-link-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 30px;
            flex: 1;
          }
          .f-col h4 {
            color: var(--text);
            font-size: 0.9rem;
            font-weight: 600;
            margin-bottom: 15px;
          }
          .f-col a {
            display: block;
            color: var(--text-muted);
            text-decoration: none;
            font-size: 0.85rem;
            margin-bottom: 12px;
            transition: color 0.2s;
          }
          .f-col a:hover { color: var(--text); }
          
          /* The Lower Deck (Strict Grid) */
          .footer-lower {
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            align-items: center;
            padding-top: 30px;
            border-top: 1px solid rgba(255,255,255,0.05);
            position: relative;
            z-index: 1;
          }
          html.light-mode .footer-lower { border-top: 1px solid rgba(0,0,0,0.05); }

          .f-legal {
            text-align: left;
            font-size: 0.85rem; 
            color: var(--text-muted); 
            font-weight: 500;
          }
          
          /* --- THE EXPANDING DOCK LOGIC --- */
          .f-socials {
            display: flex;
            gap: 12px;
            justify-content: center;
            align-items: center;
          }

          .expand-btn {
            display: inline-flex;
            align-items: center;
            height: 44px;
            max-width: 44px; /* Starts as a perfect circle */
            background: rgba(255,255,255,0.02);
            border: 1px solid var(--border);
            border-radius: 44px;
            overflow: hidden;
            transition: max-width 0.4s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s, border-color 0.3s, box-shadow 0.3s;
            text-decoration: none;
            color: var(--text-muted);
            white-space: nowrap;
          }
          html.light-mode .expand-btn { background: rgba(0,0,0,0.02); }

          .expand-btn i {
            width: 42px;
            height: 44px;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.3rem;
            transition: color 0.3s;
          }

          .expand-btn span {
            padding-right: 18px;
            font-size: 0.85rem;
            font-weight: 600;
            opacity: 0;
            transform: translateX(-10px);
            transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          }

          /* Hover Expansion Physics */
          .expand-btn:hover {
            max-width: 160px; /* Slides open on hover */
            box-shadow: 0 10px 20px rgba(0,0,0,0.2);
          }
          .expand-btn:hover span {
            opacity: 1;
            transform: translateX(0);
          }

          /* Brand Colors on Hover */
          .expand-btn.gh:hover { border-color: rgba(255,255,255,0.3); color: #fff; background: rgba(255,255,255,0.05); }
          .expand-btn.pl:hover { border-color: rgba(0,170,69,0.3); color: #00aa45; background: rgba(0,170,69,0.05); }
          .expand-btn.ph:hover { border-color: rgba(255,97,84,0.3); color: #ff6154; background: rgba(255,97,84,0.05); }
          .expand-btn.hn:hover { border-color: rgba(41,98,255,0.3); color: #2962ff; background: rgba(41,98,255,0.05); }
          .expand-btn.cm:hover { border-color: rgba(75,137,245,0.3); color: #4b89f5; background: rgba(75,137,245,0.05); }
          .expand-btn.tw:hover { border-color: rgba(29,161,242,0.3); color: #1da1f2; background: rgba(29,161,242,0.05); }
          .expand-btn.li:hover { border-color: rgba(10,102,194,0.3); color: #0a66c2; background: rgba(10,102,194,0.05); }
          .expand-btn.ig:hover { border-color: rgba(225,48,108,0.3); color: #e1306c; background: rgba(225,48,108,0.05); }

          .f-madein {
            text-align: right;
            font-size: 0.8rem;
            color: var(--text-muted);
            font-weight: 500;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 6px;
          }

          /* --- MOBILE RESPONSIVENESS --- */
          @media (max-width: 1100px) {
            .footer-upper { flex-direction: column; gap: 40px; }
            .footer-brand { flex: none; max-width: 100%; }
          }
          @media (max-width: 768px) {
            .footer-link-grid { grid-template-columns: repeat(2, 1fr); gap: 40px; }
            .footer-lower { display: flex; flex-direction: column; gap: 25px; text-align: center; }
            .f-legal, .f-madein { text-align: center; justify-content: center; }
            
            /* On mobile, permanently expand the pills into a 2-column grid */
            .f-socials { order: -1; width: 100%; flex-wrap: wrap; gap: 10px; }
            .expand-btn { 
              flex: 1 1 calc(50% - 12px); 
              max-width: none; 
              justify-content: flex-start;
            }
            .expand-btn span { opacity: 1; transform: translateX(0); }
            
            .footer-watermark { font-size: 22vw; bottom: 5%; }
          }
        </style>
        
        <div class="footer-wrapper">
          <div class="footer-watermark">NITROIDE</div>
          
          <div class="container relative-z" style="padding-top: 0; padding-bottom: 0;">
            
            <div class="footer-upper">
              <div class="footer-brand">
                <a href="${rPath}index.html" style="text-decoration: none; display: inline-block; margin-bottom: 30px;">
                  <img src="${rPath}logo/logo_white.png" alt="NitroIDE" class="logo-dark" style="height: 28px;">
                  <img src="${rPath}logo/logo_black.png" alt="NitroIDE" class="logo-light" style="height: 28px; display: none;">
                </a>
                <div class="footer-hero">
                  Zero latency.<br><span>Infinite focus.</span>
                </div>
                <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; max-width: 300px;">
                  The ultimate client-side code editor. A free, open-source browser IDE built for modern frontend developers.
                </p>
              </div>
              
              <div class="footer-link-grid">
                <div class="f-col">
                  <h4>Workspace</h4>
                  <a href="${rPath}tools/codebox.html?env=vanilla">Launch IDE</a>
                  <a href="${rPath}docs.html">Documentation</a>
                  <a href="${rPath}changelog.html">Changelog</a>
                  <a href="${rPath}about.html">About NitroIDE</a>
                </div>
                <div class="f-col">
                  <h4>Free Sandboxes</h4>
                  <a href="${lPath}react-online-playground.html">React Playground</a>
                  <a href="${lPath}tailwind-online-editor.html">Tailwind Editor</a>
                  <a href="${lPath}test-tailwind-css-online.html">Tailwind CSS Sandbox</a>
                  <a href="${lPath}vanilla-javascript-sandbox.html">Vanilla JS Sandbox</a>
                  <a href="${lPath}html-css-js-editor.html">HTML/CSS/JS Editor</a>
                  <a href="${lPath}monaco-editor-online.html">Monaco Engine Online</a>
                </div>
                <div class="f-col">
                  <h4>Top Use Cases</h4>
                  <a href="${lPath}run-react-in-browser-no-install.html">Run React in Browser</a>
                  <a href="${lPath}offline-html-editor.html">Offline HTML Editor</a>
                  <a href="${lPath}private-code-editor-no-tracking.html">Private Code Editor</a>
                  <a href="${lPath}chromebook-code-editor-free.html">Chromebook IDE</a>
                  <a href="${lPath}low-ram-code-editor.html">Low RAM Editor</a>
                  <a href="${lPath}responsive-design-tester.html">Responsive Design Tester</a>
                  <a href="${lPath}export-code-to-zip.html">Export Code to ZIP</a>
                </div>
                <div class="f-col">
                  <h4>Compare</h4>
                  <a href="${lPath}vscode-online-alternative.html">VS Code Alternative</a>
                  <a href="${lPath}codesandbox-lightweight-alternative.html">CodeSandbox Alt</a>
                  <a href="${lPath}codepen-alternative-no-login.html">CodePen Alternative</a>
                </div>
              </div>
            </div>

            <div class="footer-lower">
              
              <div class="f-legal">
                © 2026 NitroIDE <span style="margin: 0 10px; opacity: 0.5;">|</span> 
                <a href="${rPath}legal.html" style="color: inherit; text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--text)'" onmouseout="this.style.color='var(--text-muted)'">Privacy</a> <span style="margin: 0 5px; opacity: 0.5;">|</span> 
                <a href="${rPath}legal.html#license" style="color: inherit; text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color='var(--text)'" onmouseout="this.style.color='var(--text-muted)'">Terms</a>
              </div>
              
              <div class="f-socials">
                <a href="https://github.com/nitroideofficial/nitroide" target="_blank" class="expand-btn gh"><i class="ph-bold ph-github-logo"></i><span>GitHub</span></a>
                <a href="https://peerlist.io/nitroide" target="_blank" class="expand-btn pl"><i class="ph-bold ph-leaf"></i><span>Peerlist</span></a>
                <a href="https://www.producthunt.com/@nitroide" target="_blank" class="expand-btn ph"><i class="ph-bold ph-rocket-launch"></i><span>Product Hunt</span></a>
                <a href="https://hashnode.com/@nitroide" target="_blank" class="expand-btn hn"><i class="ph-bold ph-hash"></i><span>Hashnode</span></a>
                <a href="https://www.commudle.com/users/nitroide" target="_blank" class="expand-btn cm"><i class="ph-bold ph-users-three"></i><span>Commudle</span></a>
                <a href="https://x.com/trynitroide" target="_blank" class="expand-btn tw"><i class="ph-bold ph-twitter-logo"></i><span>Twitter</span></a>
                <a href="https://www.linkedin.com/in/yashpanchal-nitro" target="_blank" class="expand-btn li"><i class="ph-bold ph-linkedin-logo"></i><span>LinkedIn</span></a>
                <a href="https://www.instagram.com/nitroideofficial/" target="_blank" class="expand-btn ig"><i class="ph-bold ph-instagram-logo"></i><span>Instagram</span></a>
              </div>
              
              <div class="f-madein">
                Engineered with <i class="ph-bold ph-lightning" style="color: #00e5ff;"></i> in India
              </div>
              
            </div>

          </div>
        </div>
        `;
    }
}
customElements.define('nitro-footer', NitroFooter);

// 3. THE UNIVERSAL MODALS
class NitroModals extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <button class="fab" id="fab" aria-label="Scroll to top" onclick="window.scrollTo({top: 0, behavior: 'smooth'})"><i class="ph-bold ph-arrow-up"></i></button>
        <button class="feedback-fab" onclick="toggleFeedbackModal()" aria-label="Open Feedback Form"><i class="ph-bold ph-chat-teardrop-text"></i></button>
        <div class="feedback-backdrop" id="feedbackModal" onclick="handleFeedbackClick(event)">
          <div class="feedback-card">
            <div class="feedback-header">
              <h3>Send Feedback</h3>
              <button onclick="toggleFeedbackModal()" aria-label="Close Feedback Form"><i class="ph-bold ph-x"></i></button>
            </div>
            <div class="feedback-body">
              <p class="feedback-desc">Found a bug or have a suggestion? Let us know directly.</p>
              <form id="feedbackForm" onsubmit="sendFeedback(event)">
                <textarea id="feedbackText" placeholder="Tell us what you think..." required></textarea>
                <button type="submit" id="feedbackBtn" class="btn-launch primary-btn" style="width:100%;">
                  <span id="feedbackBtnText">Send Message</span>
                  <div id="feedbackSpinner" class="spinner" style="display: none;"></div>
                </button>
              </form>
            </div>
          </div>
        </div>

        <div class="cmd-palette-backdrop" id="cmdPalette">
          <div class="cmd-palette">
            <div class="cmd-input-wrap">
              <i class="ph-bold ph-magnifying-glass"></i>
              <input type="text" class="cmd-input" placeholder="Type a command or search..." id="cmdInput" autocomplete="off">
            </div>
            <div class="cmd-list" id="cmdList">
              <a href="${rPath}tools/codebox.html" class="cmd-item"><div class="cmd-item-left"><i class="ph-fill ph-terminal-window"></i> Launch Workspace</div><div class="cmd-item-right">↵</div></a>
              <div class="cmd-item" onclick="toggleTheme(); toggleCmdK();"><div class="cmd-item-left"><i class="ph-bold ph-sun"></i> Toggle Theme Aesthetic</div></div>
              <a href="${rPath}docs.html" class="cmd-item"><div class="cmd-item-left"><i class="ph-bold ph-book"></i> View Documentation</div></a>
            </div>
          </div>
        </div>
        `;
    }
}
customElements.define('nitro-modals', NitroModals);

// 4. GLOBAL INTERACTIONS (Safe for all pages)
document.fonts.ready.then(() => {
  setTimeout(() => {
    document.body.classList.add('site-loaded');
    setTimeout(() => { const tm = document.getElementById('techMarquee'); if(tm) tm.classList.add('loaded'); }, 300);
  }, 100);
}).catch(() => { document.body.classList.add('site-loaded'); });

function toggleFeedbackModal() { const modal = document.getElementById('feedbackModal'); if(modal) modal.classList.toggle('active'); }
function handleFeedbackClick(e) { if(e.target.id === 'feedbackModal') toggleFeedbackModal(); }
function sendFeedback(e) {
  e.preventDefault();
  const btnText = document.getElementById('feedbackBtnText'); const spinner = document.getElementById('feedbackSpinner');
  if(btnText) btnText.style.display = 'none'; if(spinner) spinner.style.display = 'block';
  fetch("https://formsubmit.co/ajax/contactnitroide@gmail.com", {
      method: "POST", headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ _captcha: "false", subject: "New Feedback from NitroIDE", message: document.getElementById('feedbackText').value })
  }).then(res => res.json()).then(data => {
      toggleFeedbackModal(); showToast("<i class='ph-bold ph-check-circle' style='color:var(--success); margin-right:6px;'></i> Feedback sent securely!");
      const form = document.getElementById('feedbackForm'); if(form) form.reset();
  }).catch(err => { showToast("<i class='ph-bold ph-warning-circle' style='color:var(--error); margin-right:6px;'></i> Error."); }).finally(() => {
      if(btnText) btnText.style.display = 'block'; if(spinner) spinner.style.display = 'none';
  });
}

document.addEventListener("DOMContentLoaded", () => {
    if (document.body.classList.contains('workspace-body')) return;

    // 3D Tilt Effect
    document.querySelectorAll('.mockup-window').forEach(windowEl => {
      windowEl.addEventListener('mousemove', (e) => {
        const rect = windowEl.getBoundingClientRect(); const x = e.clientX - rect.left; const y = e.clientY - rect.top;
        const centerX = rect.width / 2; const centerY = rect.height / 2;
        windowEl.style.transform = `perspective(1000px) rotateX(${((y - centerY) / centerY) * -4}deg) rotateY(${((x - centerX) / centerX) * 4}deg) scale3d(1.02, 1.02, 1.02)`;
        windowEl.style.transition = 'none'; 
      });
      windowEl.addEventListener('mouseleave', () => { windowEl.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)'; windowEl.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'; });
    });

    const observer = new IntersectionObserver((entries, obs) => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('active'); obs.unobserve(entry.target); } }); }, { threshold: 0.1 });
    document.querySelectorAll('[class*="reveal-"]').forEach(el => observer.observe(el));

    const globalSpotlight = document.getElementById('globalSpotlight');
    if(globalSpotlight) {
        window.addEventListener('mousemove', (e) => { globalSpotlight.style.opacity = '1'; globalSpotlight.style.left = `${e.clientX}px`; globalSpotlight.style.top = `${e.clientY}px`; });
        window.addEventListener('mouseleave', () => globalSpotlight.style.opacity = '0');
    }

    let statsAnimated = false;
    const statsObserver = new IntersectionObserver((entries) => {
      if(entries[0] && entries[0].isIntersecting && !statsAnimated) {
         statsAnimated = true;
         document.querySelectorAll('.stat-num').forEach(el => {
            let end = parseInt(el.getAttribute('data-target')); let start = parseInt(el.getAttribute('data-start') || 0); let suffix = el.getAttribute('data-suffix');
            let startTimestamp = null;
            const step = (timestamp) => {
              if (!startTimestamp) startTimestamp = timestamp;
              const progress = Math.min((timestamp - startTimestamp) / 1500, 1);
              el.innerHTML = Math.floor(progress * (end - start) + start) + suffix;
              if (progress < 1) window.requestAnimationFrame(step);
            };
            window.requestAnimationFrame(step);
         });
      }
    }, { threshold: 0.5 });
    const sr = document.getElementById('statsRow'); if(sr) statsObserver.observe(sr);

    document.querySelectorAll('.magnetic-btn').forEach(btn => {
      btn.addEventListener('mousemove', (e) => { const rect = btn.getBoundingClientRect(); btn.style.transform = `translate(${(e.clientX - rect.left - rect.width / 2) * 0.3}px, ${(e.clientY - rect.top - rect.height / 2) * 0.3}px)`; });
      btn.addEventListener('mouseleave', () => { btn.style.transform = `translate(0px, 0px)`; });
    });

    document.querySelectorAll('.bento-card').forEach(card => {
      card.addEventListener('mousemove', e => { const rect = card.getBoundingClientRect(); card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`); card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`); });
    });

    window.addEventListener('scroll', () => {
      const nav = document.getElementById('floatingNav'); const fab = document.getElementById('fab');
      if(nav) { if (window.scrollY > 300) nav.classList.add('scrolled'); else nav.classList.remove('scrolled'); }
      if(fab) { if (window.scrollY > 500) fab.classList.add('visible'); else fab.classList.remove('visible'); }
    });
    
    // Visitor Counter with Graceful Fallback
    const hasVisited = localStorage.getItem('nitroide_visited');
    const getUrl = "https://abacus.jasoncameron.dev/get/nitroide/visits";
    
    fetch(hasVisited ? getUrl : "https://abacus.jasoncameron.dev/hit/nitroide/visits")
      .then(res => {
        if (!res.ok) throw new Error("API Down"); 
        return res.json();
      })
      .then(data => {
        const countEl = document.getElementById("visitor-count");
        if (countEl && data.value !== undefined) { 
          countEl.innerText = data.value.toLocaleString(); 
          if (!hasVisited) localStorage.setItem('nitroide_visited', 'true'); 
        }
      })
      .catch((err) => {
        const countEl = document.getElementById("visitor-count");
        if (countEl) {
          countEl.innerText = "14,285"; 
        }
        console.warn("Visitor API unavailable, using fallback count.");
      });
});


// ==========================================================================
// BLOG INDEX SEARCH & DYNAMIC RENDERING LOGIC
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  const blogGrid = document.getElementById('blogGrid');
  
  // Safety check: Only execute this script if we are actually on the blog page
  if (!blogGrid) return; 

  let allBlogs = [];
  const countBadge = document.getElementById('articleCount');
  const searchInput = document.getElementById('articleSearch');

  async function loadBlogs() {
    try {
      const response = await fetch('blog-data.json');
      if (!response.ok) throw new Error('Failed to load blog data');
      
      const rawBlogs = await response.json();
      
      // AUTO-FIX: Remove any accidental copy-paste duplicates from the JSON
      const uniqueBlogs = [];
      const seenSlugs = new Set();
      for (const blog of rawBlogs) {
        if (!seenSlugs.has(blog.SLUG)) {
          seenSlugs.add(blog.SLUG);
          uniqueBlogs.push(blog);
        }
      }
      
      // Use the perfectly cleaned list, reversed so newest is at the top
      allBlogs = uniqueBlogs.reverse();
      
      // Initial Render
      renderGrid(allBlogs);
      
    } catch (error) {
      console.error('Error loading blogs:', error);
      blogGrid.innerHTML = '<p style="color: red; text-align: center; grid-column: 1/-1;">Unable to load articles at this time.</p>';
      if (countBadge) countBadge.innerText = 'Error loading articles';
    }
  }

  // Function to build the HTML cards based on the array
  function renderGrid(blogsToRender) {
    blogGrid.innerHTML = ''; // Clear current grid
    
    // Update the counter
    if (countBadge) {
      countBadge.innerHTML = `<i class="ph-fill ph-files" style="color: #00e5ff;"></i> ${blogsToRender.length} Articles Found`;
    }

    // Handle empty search results
    if (blogsToRender.length === 0) {
      blogGrid.innerHTML = `<div class="no-results"><i class="ph-duotone ph-ghost" style="font-size: 3rem; margin-bottom: 10px; display:block;"></i>No articles found matching your search.</div>`;
      return;
    }

    // Loop through and generate cards
    blogsToRender.forEach(blog => {
      const card = document.createElement('div');
      card.className = 'bento-card';
      
      card.innerHTML = `
        <i class="ph-duotone ${blog.CTA_ICON || 'ph-article'} bento-icon" style="color: ${blog.THEME_COLOR || '#ffffff'};"></i>
        <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 8px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase;">
          ${blog.CATEGORY} • ${blog.DATE}
        </div>
        <h2>${blog.H1_TITLE}</h2>
        <div class="bento-content-swap">
          <p class="bento-text">${blog.META_DESC}</p>
          <div class="bento-code" style="display:flex; align-items:flex-end;">
            <a href="${blog.SLUG}.html" class="btn-compact primary-btn" style="border-radius:6px; text-decoration:none;">
              Read Article <i class="ph-bold ph-arrow-right"></i>
            </a>
          </div>
        </div>
      `;
      blogGrid.appendChild(card);
    });
  }

  // Initialize data fetch
  loadBlogs();

// Set up the Real-Time Search Bar listener
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase().trim();
      
      // Filter the global array based on Title, Desc, Category, Keywords, OR CONTENT!
      const filteredBlogs = allBlogs.filter(blog => {
        return (
          (blog.H1_TITLE && blog.H1_TITLE.toLowerCase().includes(searchTerm)) ||
          (blog.META_DESC && blog.META_DESC.toLowerCase().includes(searchTerm)) ||
          (blog.CATEGORY && blog.CATEGORY.toLowerCase().includes(searchTerm)) ||
          (blog.KEYWORDS && blog.KEYWORDS.toLowerCase().includes(searchTerm)) ||
          /* NEW: Deep Content Search */
          (blog.CONTENT && blog.CONTENT.toLowerCase().includes(searchTerm))
        );
      });
      
      renderGrid(filteredBlogs);
    });
  }
});

// ==========================================================================
// ECOSYSTEM PULSE ENGINE (Unified Data Router)
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  const tickerBox = document.querySelector('.pulse-ticker-box');
  const blogContainer = document.getElementById('pulse-blog-container');
  const archiveStream = document.getElementById('archive-stream');
  const archiveTotal = document.getElementById('eco-total-updates');
  const archivePlatforms = document.getElementById('eco-platform-count');
  const archiveLatest = document.getElementById('eco-latest-date');
  const archiveSearch = document.getElementById('eco-search');
  const archiveFilterBar = document.getElementById('eco-platform-filters');
  const archiveSortToggle = document.getElementById('eco-sort-toggle');
  const archiveResultCount = document.getElementById('eco-result-count');

  let cachedDevTo = null;
  const DEVTO_USERNAME = 'nitroide';
  const DEVTO_CACHE_TTL = 5 * 60 * 1000;

  function getPulseTimestamp(item) {
    if (Number.isFinite(item?.timestamp)) return item.timestamp;
    const sourceDate = item?.published_timestamp || item?.published_at || item?.created_at || item?.date;
    const parsed = new Date(sourceDate).getTime();
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  function formatPulseDate(timestamp) {
    if (!timestamp) return 'Latest';
    return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function mapDevToArticle(article) {
    const timestamp = getPulseTimestamp(article);
    return {
      platform: 'Dev.to',
      icon: 'ph-dev-to-logo',
      color: '#ffffff',
      title: article.title,
      link: article.url,
      url: article.url,
      date: formatPulseDate(timestamp),
      timestamp
    };
  }

  async function fetchDevToArticles(limit = 5) {
    const url = `https://dev.to/api/articles?username=${encodeURIComponent(DEVTO_USERNAME)}&per_page=${limit}&_=${Date.now()}`;
    const response = await fetch(url, {
      cache: 'no-store',
      headers: { Accept: 'application/json' }
    });
    if (!response.ok) throw new Error(`Dev.to API ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data)) return [];
    return data
      .map(mapDevToArticle)
      .sort((a, b) => getPulseTimestamp(b) - getPulseTimestamp(a));
  }

  function renderTickerItems(logs) {
    if (!tickerBox) return;
    const latestFour = logs
      .map(log => ({ ...log, timestamp: getPulseTimestamp(log) }))
      .sort((a, b) => getPulseTimestamp(b) - getPulseTimestamp(a))
      .slice(0, 4);

    tickerBox.innerHTML = latestFour.map(log => `
      <a href="${log.link}" target="_blank" rel="noopener" class="ticker-item" style="--ticker-color: ${log.color};">
        <span class="t-icon"><i class="ph-bold ${log.icon}"></i></span>
        <div class="t-content-flex">
          <span class="t-platform">${log.platform}</span>
          <span class="t-text">${log.title}</span>
          <span class="t-date">${log.date}</span>
        </div>
        <i class="ph-bold ph-arrow-up-right t-arrow"></i>
      </a>
    `).join('');
  }

  // 1. ROUTING TO HOMEPAGE LIVE TICKER
  if (tickerBox && typeof pulseLogs !== 'undefined') {
    const manualTickerLogs = pulseLogs
      .filter(log => log.platform !== 'Hashnode')
      .map(log => ({ ...log, timestamp: getPulseTimestamp(log) }));
    renderTickerItems(manualTickerLogs);

    fetchDevToArticles(4)
      .then(devLogs => renderTickerItems([...devLogs, ...manualTickerLogs]))
      .catch(err => console.error("Ticker Dev.to fetch failed:", err));
  }

  // 2. ROUTING TO ARCHITECTURE LOG TABS (Bulletproof Fetch)
  async function renderArchitectureTab(platform) {
    if (!blogContainer) return;

    if (platform === 'devto') {
      if (cachedDevTo && Date.now() - cachedDevTo.fetchedAt < DEVTO_CACHE_TTL) {
        return injectBlogHTML(cachedDevTo, 'devto');
      }
      try {
        const data = await fetchDevToArticles(1);
        
        if (Array.isArray(data) && data.length > 0) {
          cachedDevTo = {
            title: data[0].title,
            url: data[0].url,
            date: data[0].date,
            fetchedAt: Date.now()
          };
          injectBlogHTML(cachedDevTo, 'devto');
        } else {
          // Handles empty Dev.to accounts safely
          blogContainer.innerHTML = '<p class="pulse-empty-state">No Dev.to articles published yet.</p>';
        }
      } catch (e) {
        // Handles Ad-Blockers safely
        console.error("Dev.to Fetch Blocked:", e);
        blogContainer.innerHTML = '<p class="pulse-empty-state">Dev.to could not load in this browser session.</p>';
      }
    } else if (platform === 'hashnode') {
      const latestHashnode = typeof pulseLogs !== 'undefined' ? pulseLogs.find(log => log.platform === 'Hashnode') : null;
      const hashnodeData = latestHashnode || {
        title: "Why I Built a Zero-Latency Browser IDE",
        link: "https://hashnode.com/@nitroide",
        date: "May 2026"
      };
      injectBlogHTML({ title: hashnodeData.title, url: hashnodeData.link || hashnodeData.url, date: hashnodeData.date }, 'hashnode');
    }
  }

  function injectBlogHTML(data, platform) {
    const icon = platform === 'devto' ? '<i class="ph-bold ph-dev-to-logo"></i>' : '<i class="ph-bold ph-hash"></i>';
    blogContainer.innerHTML = `
      <a href="${data.url}" target="_blank" rel="noopener" class="pulse-blog-link ${platform === 'devto' ? 'is-devto' : 'is-hashnode'}">
        <div class="pulse-blog-meta">
          <span class="pulse-blog-source">${icon} ${platform === 'devto' ? 'Dev.to Article' : 'Hashnode Blog'}</span>
          <span>${data.date}</span>
        </div>
        <h3>${data.title}</h3>
        <p>Explore the technical breakdown, decisions, and implementation details directly on the publishing network.</p>
        <div class="pulse-read-more">
          Read Full Log <i class="ph-bold ph-arrow-right"></i>
        </div>
      </a>
    `;
  }

  window.switchPulseTab = function(platform, evt) {
    document.querySelectorAll('.p-tab').forEach(t => t.classList.remove('active'));
    const activeTab = evt?.currentTarget || document.querySelector(`.p-tab[data-platform="${platform}"]`);
    activeTab?.classList.add('active');
    blogContainer.innerHTML = '<p class="pulse-loading"><i class="ph-bold ph-spinner-gap"></i> Fetching...</p>';
    renderArchitectureTab(platform);
  };

  if (blogContainer) renderArchitectureTab('devto');

  // 3. COMPLETE ECOSYSTEM TIMELINE ARCHIVE (Bulletproof Sorting)
  if (archiveStream && typeof pulseLogs !== 'undefined') {
    archiveStream.innerHTML = '<p class="pulse-loading"><i class="ph-bold ph-spinner-gap"></i> Syncing timelines...</p>';
    const archiveState = {
      logs: [],
      platform: 'All',
      query: '',
      sort: 'desc'
    };

    function getLogTimestamp(log) {
      return getPulseTimestamp(log);
    }
     
    function updateArchiveStats(logsArray) {
      if (!archiveTotal || !archivePlatforms || !archiveLatest) return;
      const sortedLogs = [...logsArray].sort((a, b) => getLogTimestamp(b) - getLogTimestamp(a));
      const platforms = new Set(sortedLogs.map(log => log.platform).filter(Boolean));
      archiveTotal.textContent = logsArray.length;
      archivePlatforms.textContent = platforms.size;
      archiveLatest.textContent = sortedLogs[0]?.date || 'No updates';
    }

    function formatStreamDate(dateText) {
      const parsed = new Date(dateText);
      if (Number.isNaN(parsed.getTime())) return { month: 'NEW', day: dateText };
      return {
        month: parsed.toLocaleDateString('en-US', { month: 'short' }),
        day: parsed.toLocaleDateString('en-US', { day: '2-digit' })
      };
    }

    function getVisibleArchiveLogs() {
      const query = archiveState.query.trim().toLowerCase();
      return archiveState.logs
        .filter(log => archiveState.platform === 'All' || log.platform === archiveState.platform)
        .filter(log => {
          if (!query) return true;
          return [log.title, log.platform, log.date]
            .filter(Boolean)
            .some(value => value.toLowerCase().includes(query));
        })
        .sort((a, b) => {
          const delta = getLogTimestamp(b) - getLogTimestamp(a);
          return archiveState.sort === 'desc' ? delta : -delta;
        });
    }

    function renderArchiveFilters() {
      if (!archiveFilterBar) return;
      const platforms = ['All', ...new Set(archiveState.logs.map(log => log.platform).filter(Boolean))];
      if (!platforms.includes(archiveState.platform)) archiveState.platform = 'All';

      archiveFilterBar.innerHTML = platforms.map(platform => {
        const count = platform === 'All'
          ? archiveState.logs.length
          : archiveState.logs.filter(log => log.platform === platform).length;
        const isActive = platform === archiveState.platform ? ' is-active' : '';
        return `
          <button class="eco-filter-chip${isActive}" type="button" data-platform="${platform}">
            ${platform}<span class="eco-filter-count">${count}</span>
          </button>
        `;
      }).join('');

      archiveFilterBar.querySelectorAll('.eco-filter-chip').forEach(button => {
        button.addEventListener('click', () => {
          archiveState.platform = button.dataset.platform || 'All';
          renderArchive();
        });
      });
    }

    function updateArchiveResultCount(visibleCount) {
      if (!archiveResultCount) return;
      const noun = visibleCount === 1 ? 'update' : 'updates';
      const sortLabel = archiveState.sort === 'desc' ? 'newest first' : 'oldest first';
      const filterLabel = archiveState.platform === 'All' ? 'all platforms' : archiveState.platform;
      archiveResultCount.textContent = `${visibleCount} ${noun} shown, ${sortLabel}, ${filterLabel}.`;
    }

    function renderArchive() {
      updateArchiveStats(archiveState.logs);
      renderArchiveFilters();
      const visibleLogs = getVisibleArchiveLogs();
      renderStream(visibleLogs);
      updateArchiveResultCount(visibleLogs.length);
    }

    archiveSearch?.addEventListener('input', () => {
      archiveState.query = archiveSearch.value;
      renderArchive();
    });

    archiveSortToggle?.addEventListener('click', () => {
      archiveState.sort = archiveState.sort === 'desc' ? 'asc' : 'desc';
      archiveSortToggle.dataset.sort = archiveState.sort;
      archiveSortToggle.innerHTML = archiveState.sort === 'desc'
        ? '<i class="ph-bold ph-sort-descending"></i> Newest first'
        : '<i class="ph-bold ph-sort-ascending"></i> Oldest first';
      renderArchive();
    });

    function loadArchive(logsArray) {
      archiveState.logs = logsArray
        .map(log => ({ ...log, timestamp: getLogTimestamp(log) }))
        .sort((a, b) => getLogTimestamp(b) - getLogTimestamp(a));
      renderArchive();
    }

    // Function to render the UI to prevent duplicate code
    function renderStream(logsArray) {
      archiveStream.innerHTML = '';
      if (logsArray.length === 0) {
        archiveStream.innerHTML = `
          <div class="eco-no-results">
            <i class="ph-bold ph-magnifying-glass"></i>
            <strong>No matching updates</strong>
            <span>Try another search term or platform filter.</span>
          </div>
        `;
        return;
      }
      logsArray.forEach(log => {
        const bgOpacity = log.platform === 'Dev.to' ? 'rgba(255,255,255,0.06)' : `${log.color}18`;
        const dateParts = formatStreamDate(log.date);
        archiveStream.innerHTML += `
          <a href="${log.link}" target="_blank" rel="noopener" class="eco-stream-card" style="--stream-color: ${log.color}; --stream-bg: ${bgOpacity};">
            <div class="stream-date-block">
              <span>${dateParts.month}</span>
              <strong>${dateParts.day}</strong>
            </div>
            <div class="stream-icon-box">
              <i class="ph-bold ${log.icon}"></i>
            </div>
            <div class="stream-content">
              <div class="stream-header">
                <span class="stream-platform">${log.platform}</span>
                <span class="stream-date">${log.date}</span>
              </div>
              <div class="stream-title">${log.title}</div>
            </div>
            <div class="stream-action">
              Open <i class="ph-bold ph-arrow-up-right"></i>
            </div>
          </a>
        `;
      });
    }

    // Prep Manual Logs First
    const manualLogs = pulseLogs.map(log => ({ ...log, timestamp: getPulseTimestamp(log) }));

    // Fetch Dev.to safely
    fetchDevToArticles(10)
      .then(devLogs => {
        const combinedLogs = [...manualLogs, ...devLogs].sort((a, b) => b.timestamp - a.timestamp);
        loadArchive(combinedLogs);
      })
      .catch(err => {
         console.error("Archive Dev.to fetch failed (AdBlocker likely):", err);
         // If Dev.to fails, STILL render the manual logs perfectly!
         const safeLogs = [...manualLogs].sort((a, b) => b.timestamp - a.timestamp);
         loadArchive(safeLogs);
      });
  }
});
