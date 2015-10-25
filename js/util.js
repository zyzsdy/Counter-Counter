"use strict"
var app_version = "Counter Counter ver 1.0.0"
function getCounterId(obj) {
	var id = obj.parents(".item").attr("id").split("c")
	return parseInt(id[1])
}
function newCounter() {
	var counter = new Counter()
	counter.addSelf()
	keyboard.alloc_key(counter)
	counters.set(counter.id, counter)
}
function resetAllCounters() {
	counters.forEach(function (counter) {
		counter.reset()
	})
}
function removeAllCounters() {
	counters.forEach(function (counter) {
		counter.removeSelf()
	})
	counters.clear()
}
function saveAs() {
	$("#save-file").click()
}
function saveCounters(filepath) {
	var jsonRet = []
	counters.forEach(function (counter) {
		var jsonObj = {
			"id": counter.id,
			"name": counter.selfName,
			"num": counter.num,
			"kbd": counter.keyboard
		}
		jsonRet.push(jsonObj)
	})
	var jsonStr = JSON.stringify(jsonRet)
	var fs = require('fs')
	var path = require('path')
	fs.writeFile(filepath, jsonStr, function (err) {
		if (err) {
			console.error("Save Error" + err)
			alert("Error: " + err)
			throw err
		}
	})
	var filename = path.basename(filepath)
	$("title").text(filename + " - " + app_version)
	isModify = false;
}
function modi() {
	if (!isModify) {
		let path = require('path')
		let filename = $("#save-path").val() == "" ? "Untitled" : $("#save-path").val()
		filename = path.basename(filename)
		$("title").text("● " + filename + " - " + app_version)
		isModify = true
	}
}
function prepareClose() {
	if (isModify) {
		var alarmForSave = confirm("Are you really sure want to close the window?\nYou will lost your changes for your counter.")
		return alarmForSave
	} else {
		return true
	}
}
function readCounters(filepath) {
	var fs = require('fs')
	var path = require('path')
	var filename = path.basename(filepath)
	fs.readFile(filepath, function (err, data) {
		if (err) {
			alert("Can't read the file.")
			throw err
		} else {
			let fileData
			try {
				fileData = JSON.parse(data)
				let maxid = 0
				fileData.forEach(function (i) {
					if(i.id == undefined || i.name == undefined || i.num == undefined || i.kbd == undefined){
						throw new Error("This json is not valid.")
					}
					if (i.id > maxid) {
						maxid = i.id
					}
					var counter = new Counter()
					counter.init({
						"id": i.id,
						"name": i.name,
						"num": i.num,
						"kbd": i.kbd
					})
					counters.set(i.id, counter)
				})
				global_id = ++maxid
				console.log(global_id)
				isModify = false
				$("title").text(filename + " - " + app_version)
			} catch (err) {
				alert("Can's resolve json.")
				throw err
			}
		}
	})
}
Array.prototype.findIndex = function (comp_func) {
	for (var i = 0; i < this.length; i++) {
		if (comp_func(this[i])) return i
	}
	return -1
}