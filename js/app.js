var gui = require('nw.gui')
var win = gui.Window.get()
var menubar = new gui.Menu({type: 'menubar'})
//File Menu
var FileSubmenu = new gui.Menu()
FileSubmenu.append(new gui.MenuItem({
	label: 'New Counter Page',
	key: 'N',
	modifiers: 'ctrl',
	tooltip: 'Ctrl + N',
	click: function(){
		if(prepareClose()){
			global_id = 1
			removeAllCounters()
			isModify = false
			$("#save-path").val("")
			$("title").text("New Counters - " + app_version)
			counters = new Map()
			keyboard = new Keyboard()
		}
	}
}))
FileSubmenu.append(new gui.MenuItem({type: 'separator'}))
FileSubmenu.append(new gui.MenuItem({
	label: 'Open File...',
	key: 'O',
	modifiers: 'ctrl',
	tooltip: 'Ctrl + O',
	click: function(){
		if(prepareClose()){
			$("#open-file").click()
		}
	}
}))
FileSubmenu.append(new gui.MenuItem({type: 'separator'}))
FileSubmenu.append(new gui.MenuItem({
	label: 'Save',
	key: 'S',
	modifiers: 'ctrl',
	tooltip: 'Ctrl + S',
	click: function(){
		var filepath = $("#save-path").val()
		if(filepath == ""){
			saveAs()
		}
		else {
			saveCounters(filepath)
		}
	}
}))
FileSubmenu.append(new gui.MenuItem({
	label: 'Save As...',
	key: 'S',
	modifiers: 'ctrl-shift',
	click: function(){
		saveAs()
	}
}))
FileSubmenu.append(new gui.MenuItem({type: 'separator'}))
FileSubmenu.append(new gui.MenuItem({
	label: 'Exit',
	key: 'X',
	tooltip: 'Alt + X',
	modifiers: 'alt',
	click: function(){
		win.close()
	}
}))
//Counters Menu
var Countermenu = new gui.Menu()
Countermenu.append(new gui.MenuItem({
	label: 'New Counter',
	click: function(){
		newCounter()
	}
}))
Countermenu.append(new gui.MenuItem({type: 'separator'}))
Countermenu.append(new gui.MenuItem({
	label: 'Reset All',
	click: function(){
		var confirmFlag = confirm("Are you sure want to reset all counters?")
		if(confirmFlag){
			resetAllCounters()
		}
	}
}))
Countermenu.append(new gui.MenuItem({
	label: 'Remove All',
	click: function(){
		var confirmFlag = confirm("Are you sure want to REMOVE ALL counters?")
		if(confirmFlag){
			removeAllCounters()
		}
	}
}))
//Help Menu
var HelpSubmenu = new gui.Menu()
HelpSubmenu.append(new gui.MenuItem({
	label: 'Show Help',
	click: function(){
		gui.Window.open("help.html", {
			"position": "center",
			"width": 550,
			"height": 700,
			"toolbar": false,
			"icon": "img/icon.png"
		})
	}
}))
HelpSubmenu.append(new gui.MenuItem({
	label: 'Open Develop Tools',
	click: function(){
		win.showDevTools()
	}
}))
var onTopStatus = false
HelpSubmenu.append(new gui.MenuItem({
	type: 'checkbox',
	label: 'Always on Top',
	click: function(){
		if(onTopStatus){
			onTopStatus = false
		}else{
			onTopStatus = true
		}
		win.setAlwaysOnTop(onTopStatus)
	}
}))
HelpSubmenu.append(new gui.MenuItem({type: 'separator'}))
HelpSubmenu.append(new gui.MenuItem({
	label: "About...",
	click: function(){
		gui.Window.open("about.html", {
			"position": "center",
			"width": 500,
			"height": 300,
			"toolbar": false,
			"resizable": false,
			"show_in_taskbar": false,
			"frame": false,
			"always-on-top": true
		})
	}
}))


menubar.append(new gui.MenuItem({ label: 'File', submenu: FileSubmenu}));
menubar.append(new gui.MenuItem({ label: 'Counter', submenu: Countermenu}));
menubar.append(new gui.MenuItem({ label: 'Help', submenu: HelpSubmenu}));
win.menu = menubar;
win.on('close', function(){
	if(prepareClose()){
		this.close(true)
	}
})