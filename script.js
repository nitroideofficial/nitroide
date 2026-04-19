	// --- 1. INCEPTION BLOCKER (Silent Safety Check) ---
	if (window.self !== window.top) {
		console.warn("NitroIDE detected it is running inside an iframe. Aborting to prevent infinite loop.");
		throw new Error("Recursive load blocked");
	}

	// --- GLOBALS & UTILS ---
	const body = document.body;
	let htmlMonaco, cssMonaco, jsMonaco;
	let isIdeInitialized = false;
	let cdnLinks = [];

	// --- DYNAMIC VIRTUAL FILE SYSTEM ---
	let files = {
	  'index.html': `<div class="container">\n  <h1 class="bounce">NitroIDE 🚀</h1>\n  <p class="bounce">Type div>ul>li*3 and hit Tab to test Emmet!</p>\n</div>`,
	  'style.css': `body {\n  font-family: system-ui, sans-serif;\n  background: var(--bg, #000);\n  color: white;\n  display: grid;\n  place-items: center;\n  height: 100vh;\n  margin: 0;\n  transition: background 0.3s;\n}`,
	  'script.js': `console.log("⚡ Workspace initialized.");\n\n// Write your JavaScript here...`
	};

	let defaultVfs = { 'index.html': files['index.html'], 'style.css': files['style.css'], 'script.js': files['script.js'] };
	// Attempt to load previous session from memory, otherwise load defaults
	let vfs = JSON.parse(localStorage.getItem('nitro_vfs')) || defaultVfs;
	let activeFiles = JSON.parse(localStorage.getItem('nitro_active_files')) || { html: 'index.html', css: 'style.css', js: 'script.js' };

	if (localStorage.getItem('theme') === 'light') { 
	  document.documentElement.classList.add('light-mode'); 
	  const tBtn = document.getElementById('themeBtn'); 
	  if(tBtn) tBtn.innerHTML = `<i class="ph-bold ph-moon"></i> Dark Mode`; 
	}

	function toggleTheme() { 
	  document.documentElement.classList.toggle('light-mode'); 
	  let isLight = document.documentElement.classList.contains('light-mode');
	  localStorage.setItem('theme', isLight ? 'light' : 'dark'); 
	  
	  const btns = document.querySelectorAll('#themeBtn'); 
	  btns.forEach(btn => btn.innerHTML = isLight ? `<i class="ph-bold ph-moon"></i> Dark Mode` : `<i class="ph-bold ph-sun"></i> Light Mode`); 
	  
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
	  document.getElementById('optionsMenu').classList.remove('active');
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
		  if(activeFiles.js === filename) { activeFiles.js = 'script.js'; jsMonaco.setValue(vfs['script.js']); document.getElementById('jsPanelPillText').innerText = 'script.js'; }
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
		  
		  return `<div class="file-item ${isActive}" onclick="switchFile('${filename}')"><i class="ph-fill ${icon}" style="color:${color};"></i> ${filename} ${actions}</div>`;
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
			triggerLayoutUpdate();
		  }
		  
		  window.addEventListener('mousemove', onVMove); window.addEventListener('mouseup', stopVDrag);
		  window.addEventListener('touchmove', onVMove, {passive: false}); window.addEventListener('touchend', stopVDrag);
		}
		vResizer.addEventListener('mousedown', startVDrag); vResizer.addEventListener('touchstart', startVDrag, {passive: false});
	  }
	}




	// --- EDITOR SETTINGS ---
	let currentFontSize = 14; let isWordWrap = false;

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
		  return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
			self.MonacoEnvironment = { baseUrl: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.36.1/min/' };
			importScripts('https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.36.1/min/vs/base/worker/workerMain.js');
		  `)}`;
		}
	  };

	  require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.36.1/min/vs' }});
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

		[htmlMonaco, cssMonaco, jsMonaco].forEach(ed => { 
		  ed.onDidChangeModelContent(queueUpdate); 
		});

		isIdeInitialized = true;
		triggerLayoutUpdate();
		renderVFS();
		smartRun(); 
	  });
	}

	// --- COMPONENT FUNCTIONS ---
	function switchOutputTab(type, btn) {
	  document.querySelectorAll('.out-tab').forEach(el => el.classList.remove('active'));
	  document.getElementById('outPreview').classList.remove('active');
	  document.getElementById('outConsole').classList.remove('active');
	  document.getElementById('outState').classList.remove('active');
	  
	  btn.classList.add('active');
	  if(type === 'preview') document.getElementById('outPreview').classList.add('active');
	  if(type === 'console') { document.getElementById('outConsole').classList.add('active'); document.getElementById('consoleBadge').style.display = 'none'; }
	  if(type === 'state') document.getElementById('outState').classList.add('active');

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

	// Global Keyboard Listeners
	document.addEventListener('keydown', (e) => {
	  const codebox = document.getElementById('codebox');
	  if (codebox && codebox.classList.contains('active')) {
		if ((e.ctrlKey || e.metaKey) && e.key === 's') { 
		  e.preventDefault(); smartRun(); showToast("<i class='ph-fill ph-play' style='margin-right:6px;'></i> Saved & Ran!"); 
		}
	  }
	});

	// --- COMMAND PALETTE (CMD+K) ---
	function toggleCmdK() {
	  const p = document.getElementById('cmdPalette');
	  if(!p) return;
	  p.classList.toggle('active');
	  if (p.classList.contains('active')) {
		setTimeout(() => {
		  const input = document.getElementById('cmdInput');
		  if(input) { input.focus(); input.value = ''; }
		  document.querySelectorAll('.cmd-item').forEach(item => item.style.display = 'flex');
		}, 100);
	  }
	}

	document.addEventListener("DOMContentLoaded", () => {
		const cmdInput = document.getElementById('cmdInput');
		if (cmdInput) {
			cmdInput.addEventListener('input', function(e) {
				const term = e.target.value.toLowerCase().trim();
				document.querySelectorAll('.cmd-item').forEach(item => {
				  if (item.textContent.toLowerCase().includes(term)) item.style.display = 'flex'; 
				  else item.style.display = 'none'; 
				});
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

	  const htmlContent = `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Exported Project</title>\n  ${cdnTags}\n<style>\n${combinedCSS}\n</style>\n</head>\n<body>\n${combinedHTML}\n<script>\n${combinedJS}\n<\/script>\n</body>\n</html>`;
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

	  const htmlContent = `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Exported Project</title>\n  ${cdnTags}\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n${combinedHTML}\n  <script src="script.js"><\/script>\n</body>\n</html>`;
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
	function handleAutoRunToggle() { if(document.getElementById('autoRunToggle').checked) smartRun(); }
	function clearConsole(manual = false) { const logs = document.getElementById('consoleLogs'); if(logs) logs.innerHTML = ""; }
	function queueUpdate() { clearTimeout(runTimeout); if (document.getElementById('autoRunToggle').checked) { runTimeout = setTimeout(smartRun, 800); } }

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
	function smartRun() {
	  if(!isIdeInitialized) return;
	  
	  vfs[activeFiles.html] = htmlMonaco ? htmlMonaco.getValue() : '';
	  vfs[activeFiles.css] = cssMonaco ? cssMonaco.getValue() : '';
	  vfs[activeFiles.js] = jsMonaco ? jsMonaco.getValue() : '';

	  // Silently backup the workspace to local storage to prevent data loss on refresh
	  localStorage.setItem('nitro_vfs', JSON.stringify(vfs));
	  localStorage.setItem('nitro_active_files', JSON.stringify(activeFiles));

	  let combinedHTML = vfs['index.html'] || '';
	  let combinedCSS = "";
	  let combinedJS = "";

	  Object.keys(vfs).forEach(k => {
		  if(k !== 'index.html' && k.endsWith('.html')) combinedHTML += `\n\n` + vfs[k] + '\n';
		  if(k.endsWith('.css')) combinedCSS += `\n/* --- MODULE: ${k} --- */\n` + vfs[k] + '\n';
		  if(k.endsWith('.js')) combinedJS += `\n// --- MODULE: ${k} ---\n` + vfs[k] + '\n';
	  });

	  forceRun(combinedHTML, combinedCSS, combinedJS, document.getElementById('liveIframe'));
	}

	function forceRun(html, css, js, iframe) {
	  document.getElementById('consoleLogs').innerHTML = ""; 
	  let cdnTags = cdnLinks.map(link => link.endsWith('.css') ? `<link rel="stylesheet" href="${link}">` : `<script src="${link}"><\/script>`).join('\n');
	  
	  let headAndCss = `<!DOCTYPE html>\n<html>\n<head>\n${cdnTags}\n<style id="live-css-inject">\n${css}\n</style>\n`;
	  
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
		  if(e.data.type === 'update-css') { let styleTag = document.getElementById('live-css-inject'); if(styleTag) styleTag.textContent = e.data.css; }
		});
	  <\/script>\n`;
	  
	  const bodyStart = `</head>\n<body>\n${html}\n<script>\n`;
	  if(iframe) iframe.srcdoc = headAndCss + interceptor + bodyStart + js + `\n<\/script>\n</body>\n</html>`;
	}

	window.onload = () => { 
	  if (document.getElementById('codebox')) { initIDE(); }
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
