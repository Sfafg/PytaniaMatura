
var dropDowns = document.getElementsByClassName("DropDown");
var dropDownID = 0;

function CreateDropDown(labelStr) {
	var dropDownPrefab = document.createElement("div");
	dropDownPrefab.setAttribute("class", "DropDown");
	dropDownPrefab.setAttribute("id", dropDownID);

	let button = document.createElement("div");
	button.setAttribute("onClick", "DropDownFunction(" + dropDownID + ")");
	button.setAttribute("class", "Button");

	let label = document.createElement("div");
	label.setAttribute("class", "Label");
	label.appendChild(document.createTextNode('-' + labelStr));

	let content = document.createElement("div");
	content.setAttribute("class", "Content");
	content.style.display = "none";

	button.appendChild(label);
	dropDownPrefab.appendChild(button);
	dropDownPrefab.appendChild(content);

	dropDownID += 1;

	return dropDownPrefab;
}

function Start() {
	fetch('https://raw.githubusercontent.com/Sfafg/PytaniaMatura/master/Answers.JSON').then(response => response.json()).then(data => {
		for (let index = 0; index < data.length; index++) {
			const element = data[index];

			let dropDown = CreateDropDown(element.label);
			for (let index = 0; index < element.questions.length; index++) {
				const question = element.questions[index];

				let drop = CreateDropDown(question.label);

				let inputField = document.createElement("div");
				inputField.setAttribute("class", "AnswerField");
				inputField.setAttribute("contenteditable", "true");
				inputField.appendChild(document.createTextNode(question.answer));
				inputField.style.whiteSpace = "pre-line";

				drop.children[1].appendChild(inputField);
				dropDown.children[1].appendChild(drop);

			}
			document.body.appendChild(dropDown);
		}
	});

	SaveChangesFunction();

	for (let index = 0; index < dropDowns.length; index++) {
		let content = dropDowns[index].children[1];
		content.style.display = "none";
	}
}
function DropDownFunction(index) {
	let content = dropDowns[index].children[1];
	if (content.style.display == "none") {
		content.style.display = "";
	}
	else {
		content.style.display = "none";
	}
}

function SaveChangesFunction() {
	JSON.stringify(document.body);
}