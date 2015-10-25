"use strict"
var global_id = 1
var isModify = false
class Counter {
	constructor() {
		this.id = global_id++
		this.num = 0
		this.kbd = 0
		this.selfName = "Title"
		this.counterHtml = null
	}
	init(opt) {
		this.id = opt.id
		this.addSelf()
		this.name = opt.name
		this.keyboard = opt.kbd
		keyboard.custom_key(this, opt.kbd)
		this.num = opt.num
		this.counterHtml.find(".item-main").html(this.num)
	}
	inc() {
		this.num++
		modi()
		this.counterHtml.find(".item-main").html(this.num)
	}
	dec() {
		this.num--
		modi()
		this.counterHtml.find(".item-main").html(this.num)
	}
	reset() {
		this.num = 0
		modi()
		this.counterHtml.find(".item-main").html(this.num)
	}
	addSelf() {
		modi()
		this.counterHtml = $(Counter.getCounterHtmlTemplate(this.id))
		$("#items").append(this.counterHtml)
	}
	removeSelf() {
		modi()
		keyboard.revoke_key(this)
		this.counterHtml.remove()
	}
	set name(newname) {
		this.selfName = newname
		modi()
		this.counterHtml.find(".item-title>span").html(newname)
	}
	get name() {
		return this.selfName
	}
	set keyboard(keyid) {
		modi()
		this.kbd = keyid
		var keyName = "---"
		if (keyid != 0) {
			keyName = keyboardInfo.names[keyid] == undefined ? "Error" : keyboardInfo.names[keyid]
		}
		this.counterHtml.find(".item-key>kbd").html(keyName)
	}
	get keyboard() {
		return this.kbd
	}
	static getCounterHtmlTemplate(id) {
		return '      <div class="item" id="c' + id + '">\
        <span class="item-close">&times;</span>\
        <div class="item-title">\
          <span>Title</span>\
          <input type="text" style="display:none" value="Title">\
        </div>\
        <div class="item-main">0</div>\
        <div class="item-key"><kbd>---</kbd><span><a href="javascript:;" class="item-reset">reset</a></span></div>\
      </div>'
	}
}
var keyboardInfo = {
	names: {
		0: "---",
		81: "Q",
		87: "W",
		69: "E",
		82: "R",
		84: "T",
		89: "Y",
		85: "U",
		73: "I",
		79: "O",
		80: "P",
		65: "A",
		83: "S",
		68: "D",
		70: "F",
		71: "G",
		72: "H",
		74: "J",
		75: "K",
		76: "L",
		90: "Z",
		88: "X",
		67: "C",
		86: "V",
		66: "B",
		78: "N",
		77: "M",
		192: "`",
		49: "1",
		50: "2",
		51: "3",
		52: "4",
		53: "5",
		54: "6",
		55: "7",
		56: "8",
		57: "9",
		48: "0",
		9: "Tab",
		189: "-",
		187: "=",
		219: "[",
		221: "]",
		220: "\\",
		186: ";",
		222: "'",
		188: ",",
		190: ".",
		191: "/",
		32: "Space",
		13: "Enter",
		37: "←",
		38: "↑",
		39: "→",
		40: "↓",
		8: "backspace" 
	}
}
class Keyboard {
	constructor() {
		this.keyMap = new Map()
		this.keyQueue = [81, 87, 69, 82, 84, 89, 85, 73, 79, 80, 65, 83, 68, 70, 71, 72, 74, 75, 76, 90, 88, 67, 86, 66, 78, 77, 192, 49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 9, 189, 187, 219, 221, 220, 186, 222, 188, 190, 191, 32, 13, 37, 38, 39, 40]
		this.setKey = 0
		for (var keyCode in keyboardInfo.names) {
			this.keyMap.set(keyCode, 0)
		}
	}
	alloc_key(counter) {
		var keyid = this.keyQueue.shift()
		if (keyid != undefined) {
			this.keyMap.set(keyid, counter.id)
			counter.keyboard = keyid
		}
	}
	revoke_key(counter) {
		var keyid = counter.keyboard;
		counter.keyboard = 0
		this.keyMap.set(keyid, 0)
		this.keyQueue.push(keyid)
	}
	custom_key(counter, keyid) {
		var hasKeyAvaliable = this.keyQueue.findIndex(function (i) {
			return i == keyid
		})
		if (keyid == 0 || hasKeyAvaliable != -1) {
			if (keyid != 0) {
				this.revoke_key(counter)
				this.keyQueue.splice(hasKeyAvaliable, 1)
			}
			this.keyMap.set(keyid, counter.id)
			counter.keyboard = keyid
		}
	}
	key_listener(event) {
		var keyid = event.which
		if (this.setKey == 0) {
			let counterid = this.keyMap.get(keyid)
			if (counterid != 0) {
				let counter = counters.get(counterid)
				if (counter != undefined) {
					if (event.shiftKey) {
						counter.dec()
					} else {
						counter.inc()
					}
				}
			}
		} else {
			let counterid = this.setKey
			let counter = counters.get(counterid)
			this.setKey = 0
			counter.counterHtml.find(".item-key>kbd").html(keyboardInfo.names[counter.keyboard])
			if (keyid == 8) {
				this.custom_key(counters.get(counterid), 0)
			} else {
				this.custom_key(counters.get(counterid), keyid)
			}
		}
	}
}
var counters = new Map()
var keyboard = new Keyboard()
$(function () {
	$(document).on("click", ".item-title>span", function () {
		$(this).hide()
		$(this).parent(".item-title").find("input").show()
	})
	$(document).on("blur", ".item-title>input", function () {
		var id = getCounterId($(this))
		var name = $(this).val()
		counters.get(id).name = name
		$(this).hide()
		$(this).parent(".item-title").find("span").show()
	})
	$(document).on("click", ".item-newcounter", function () {
		newCounter()
	})
	$(document).on("dblclick", ".item-close", function () {
		var id = getCounterId($(this))
		var counter = counters.get(id)
		counter.removeSelf()
		counters.delete(id)
		counter = null
	})
	$(document).on("click", ".item-main", function (event) {
		var id = getCounterId($(this))
		var counter = counters.get(id)
		if (event.shiftKey) {
			counter.dec()
		} else {
			counter.inc()
		}
	})
	$(document).on("click", ".item-reset", function () {
		var id = getCounterId($(this))
		var reallyReset = confirm("Are you sure to reset this counter?")
		if (reallyReset)
			counters.get(id).reset()
	})
	$(document).on("click", ".item-key>kbd", function () {
		var id = getCounterId($(this))
		if (keyboard.setKey != 0) {
			let counter = counters.get(keyboard.setKey)
			counter.counterHtml.find(".item-key>kbd").html(keyboardInfo.names[counter.keyboard])
		}
		$(this).html("Press...")
		keyboard.setKey = id
	})
	$(document).on("keydown", function (event) {
		if (event.target.nodeName != "INPUT") {
			event.preventDefault()
			keyboard.key_listener(event)
		}
	})
	$(document).on("change", "#save-file", function () {
		var filepath = $(this).val()
		if (filepath != "") {
			var path = require('path')
			var filename = path.basename(filepath)
			$("title").text(filename + " - " + app_version)
			$("#save-path").val(filepath)
			saveCounters(filepath)
		}
	})
	$(document).on("change", "#open-file", function () {
		var filepath = $(this).val()
		if (filepath != "") {
			removeAllCounters()
			isModify = false
			$("#save-file").val("")
			$("#save-path").val(filepath)
			$("title").text("New Counters - " + app_version)
			counters = new Map()
			keyboard = new Keyboard()
			readCounters(filepath)
		}
	})
})