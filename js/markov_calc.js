setHide("info_div", "info_selector", "Readme");
setHide("text_answer_div", "answer_text_selector", "Text answer");

function getAcceptButton() {
	return document.getElementById("submit");
}

function getInputString() {
	return document.getElementById('intput-string').value;
}

function getMaxSteps() {
	var max_steps;
	try {
		var value = document.getElementById('max-steps').value;
		max_steps = parseInt(value);
		if (isNaN(max_steps)) {
			max_steps = 0;
		}
	} catch (error) {
		max_steps = 0;
	}
	return max_steps;
}

function getRules() {
	var rules_string = (document.getElementById('rules-string').value);
	return rules_string.split("\n");
}

function getRulesString() {
	return document.getElementById('rules-string').value;
}

function getName() {
	return document.getElementById('name-string').value;
}

function setRules(rules) {
	document.getElementById('rules-string').value = rules;
}

function setInputString(inputString) {
	document.getElementById('intput-string').value = inputString;
}

function setName(name) {
	document.getElementById('name-string').value = name;
}

function setMaxSteps(steps) {
	document.getElementById('max-steps').value = steps;
}

function clearAnswer() {
	document.getElementById("text_answer_div").innerHTML = "<br>";
}

function getAnswerDiv() {
	return document.getElementById("text_answer_div");
}
function getProgrammsDiv() {
	return document.getElementById("programms_div");
}

getAcceptButton().onclick = function(){
	var intput_string = getInputString();
	var max_steps = getMaxSteps();
	var rules = getRules();

	if (isValid(intput_string)) {
		clearAnswer();
		
        var markovAlgorithm = new MarkovAlgorithm(intput_string);

        for (let rule of rules) {
			var rt = rule.trim();
			if (rt != "" && rt[0] == '/' && rt[1] == '/') {
				continue;
			}
			if (rt != "")
            	markovAlgorithm.addRule(rule);
        }

        var result = markovAlgorithm.execute(max_steps);
		var st = result.getIntermediate().split("\n");

		var a = `
            <p class='answer'><strong>Шаги:</strong> ${result.getSteps()}</p>
            <p class='answer'><strong>Результат:</strong> ${result.getRes()}</p>
            <p class='answer'><strong>Промежуточные результаты:</p>
        `;
		for (let s of st) {
			a += `<p class='answer_sub'>${s}</p>`;
		}
		
		var theDivText = getAnswerDiv();
		theDivText.innerHTML = a;
	} else {
		alert("Invalid text");
	}
}

document.getElementById("info_selector").onclick = function(){
	setHide("info_div", "info_selector", "Readme");
}

document.getElementById("answer_text_selector").onclick = function(){
	setHide("text_answer_div", "answer_text_selector", "Text answer");
}

function setHide(id, name, text) {
	var element = document.getElementById(id);
	if (element.style.display == "none") {
		element.style.display = '';
		document.getElementById(name).innerHTML = "▼ " + text;
	} else {
		element.style.display = 'none';
		document.getElementById(name).innerHTML = "➤ " + text;
	}
}
function hasNoSpacesOrNewlines(str) {
    const regex = /^[^\s]*$/;
    return regex.test(str);
}
function isValid(input) {
	return input != "" && hasNoSpacesOrNewlines(input);
}

var url = location.href;
var mainUrl = location.href.split("?")[0];
////// URL data
function gup( name, url ) {
    if (!url) url = location.href;
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( url );
    return results == null ? null : results[1];
}

function parseDataUrl() {
	var max_steps;
	var intput_string = gup("intput_string");
	try {
		max_steps = parseInt(gup("max_steps"))
	} catch (error) {
		max_steps = 0;
	}
	setInputString(intput_string);
	setMaxSteps(max_steps);
	var rules = decodeURIComponent(gup("rules"));
	setRules(rules);
}

function dataToUrl() {
	var intput_string = getInputString();
	var max_steps = getMaxSteps();
	var rules_string = getRulesString();
	var rules = encodeURIComponent(rules_string);
	return `?intput_string=${intput_string}&max_steps=${max_steps}&rules=${rules}`;
}

if (url.split("?").length > 1) {
	parseDataUrl();
}

function copyTextToClipboard(text) {
	var textArea = document.createElement("textarea");
  
	textArea.style.position = 'fixed';
	textArea.style.top = 0;
	textArea.style.left = 0;
  
	textArea.style.width = '2em';
	textArea.style.height = '2em';
  
	textArea.style.padding = 0;
  
	textArea.style.border = 'none';
	textArea.style.outline = 'none';
	textArea.style.boxShadow = 'none';
  
	textArea.style.background = 'transparent';
  
	textArea.value = text;
  
	document.body.appendChild(textArea);
	textArea.focus();
	textArea.select();
  
	try {
	  var successful = document.execCommand('copy');
	  var msg = successful ? 'successful' : 'unsuccessful';
	} catch (err) {
	  console.log('Oops, unable to copy');
	}
  
	document.body.removeChild(textArea);
}

document.getElementById("share").onclick = function() {
	console.log(dataToUrl())
	copyTextToClipboard(mainUrl + dataToUrl());
	alert("Link copied");
}
////////////////////////

var programs = [];
var cout_p = 0;

function serializeMarkovPrograms(programs) {
    return JSON.stringify(programs, null, 2);
}

function deserializeMarkovPrograms(serializedData) {
    const data = JSON.parse(serializedData);
    return data.map(item => new MarkovProgramm(item.name, item.input, item.max_steps, item.rules));
}

function downloadProgramms() {
    const blob = new Blob([serializeMarkovPrograms(programs)], { type: 'application/json' });
	const filename = "markovAlgorithm.markov";
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'data.json';

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

document.getElementById('fileInput').addEventListener('change', (event) => {
	const file = event.target.files[0];

	if (file) {
		const reader = new FileReader();
		reader.onload = function(event) {
			const serializedData = event.target.result;
			const pro = deserializeMarkovPrograms(serializedData);
			console.log(pro);
			programs = pro;
			proggramDivUpdate();
		};
		reader.readAsText(file);
	} else {
		alert('Пожалуйста, выберите файл для загрузки.');
	}
});

function addProgramm () {
	var intput_string = getInputString();
	var max_steps = getMaxSteps();
	var rules = getRules();
	var name = getName();
	var p = new MarkovProgramm(name, intput_string, max_steps, rules);
	programs.push(p);
	console.log(programs);
	proggramDivUpdate();
}

function rulesToString(rules) {
	var res = "";
	for (var rule of rules) {
		res += `${rule}\n`
	}
	return res;
}

function loadProgramm(n) {
	var p = programs[n];
	setName(p.getName());
	setInputString(p.getInputString());
	setMaxSteps(p.getMaxSteps());
	setRules(rulesToString(p.getRules()));
}

function removeProgramm(n) {
	programs.splice(n, 1);
	proggramDivUpdate();
}

function proggramDivUpdate() {
	var div = getProgrammsDiv();
	div.innerHTML = "";

	var res = "";
	for (var i = 0; i < programs.length; i++) {
		res += "<div>";
		res += `<input type='text' value='${programs[i].getName()}' disabled>`;
		res += `<input type='button' value='Upload' onclick='loadProgramm(${i})'>`;
		res += `<input type='button' value='Remove' onclick='removeProgramm(${i})'>`;
		res += "</div>";
	}
	div.innerHTML = res;
}