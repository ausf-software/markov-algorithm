setHide("info_div", "info_selector", "Readme");
setHide("text_answer_div", "answer_text_selector", "Text answer");

document.getElementById("submit").onclick = function(){
	var intput_string = document.getElementById('intput-string').value;
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
	var rules_string = (document.getElementById('rules-string').value);
	var rules = rules_string.split("\n");

	if (isValid(intput_string, rules_string)) {
		document.getElementById("text_answer_div").innerHTML = "<br>";
		
        var markovAlgorithm = new MarkovAlgorithm(intput_string);

        for (let rule of rules) {
			if (rule.trim() != "")
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
		
		var theDivText = document.getElementById("text_answer_div");
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
function isValid(input, rules) {
	return input != "" && hasNoSpacesOrNewlines(input) && rules != "";
}