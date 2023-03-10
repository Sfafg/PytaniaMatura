var htmlBooks = [];
var dropDownID = 0;

function CreateDropDown(labelStr, completion) {
	let dropDownPrefab = document.createElement("div");
	dropDownPrefab.setAttribute("class", "DropDown");
	dropDownPrefab.setAttribute("id", dropDownID);

	let button = document.createElement("div");
	button.setAttribute("onClick", "DropDownFunction(" + dropDownID + ")");
	button.setAttribute("class", "Button");

	if (completion == 0)
		button.setAttribute("style", "color: rgb(183, 96, 96);");
	else if (completion == 1)
		button.setAttribute("style", "color: rgb(183, 180, 96);");
	else
		button.setAttribute("style", "color: rgb(50, 153, 36);");

	let label = document.createElement("div");
	label.setAttribute("class", "Label");
	label.appendChild(document.createTextNode('-' + labelStr));
	label.style.whiteSpace = "pre-line";

	let content = document.createElement("div");
	content.setAttribute("class", "Content");
	content.style.display = "none";

	button.appendChild(label);
	dropDownPrefab.appendChild(button);
	dropDownPrefab.appendChild(content);

	dropDownID++;

	return dropDownPrefab;
}

class Question {
	label;
	answer;
	constructor(label, answer) {
		this.label = label;
		this.answer = answer;
	}


}
function CompletionState(question) {
	if (question.answer == "...")
		return 0;
	else if (question.answer.slice(-5) != "c.n.d") {
		return 1;
	}
	return 2;
}
function BookCompletion(book) {

	count0 = 0;
	count1 = 0;
	count2 = 0;
	book.questions.forEach(element => {
		if (CompletionState(element) == 0)
			count0++;
		else if (CompletionState(element) == 1)
			count1++;
		else count2++;
	});

	if (count1 != 0) {
		return 1;
	}
	if (count0 == 0) {
		return 2;
	}
	if (count2 != 0) {
		return 1;
	}
	return 0;

}
class Book {
	label;
	questions;
	constructor(label, question) {
		this.label = label;
		this.questions = question;
	}
	CreateHTML() {
		let dropDown = CreateDropDown(this.label, BookCompletion(this));
		for (let index = 0; index < this.questions.length; index++) {
			const question = this.questions[index];
			let drop = CreateDropDown(question.label, CompletionState(question));

			let inputField = document.createElement("d");
			inputField.setAttribute("class", "AnswerField");
			inputField.setAttribute("contenteditable", "true");
			inputField.setAttribute("oninput", "OnInputFunction()");
			inputField.appendChild(document.createTextNode(question.answer));
			inputField.style.whiteSpace = "pre-line";

			drop.children[1].appendChild(inputField);
			dropDown.children[1].appendChild(drop);
		}

		return dropDown;
	}
}
function GetBook(htmlBook) {
	let questions = [];
	for (let index = 0; index < htmlBook.children[1].childElementCount; index++) {
		const dropDown = htmlBook.children[1].children[index];

		let label = dropDown.children[0].children[0].textContent;
		let question = new Question(label.substr(1, label.length), dropDown.children[1].children[0].textContent);
		questions.push(question);
	}

	let label = htmlBook.children[0].children[0].textContent;

	return new Book(label.substr(1, label.length), questions);
}

function Update() {

	complitedCount = 0;
	totalCount = 0;
	htmlBooks.forEach(element => {
		const book = GetBook(element);

		totalCount += book.questions.length;
		book.questions.forEach(question => {
			if (CompletionState(question) == 2) {
				complitedCount++;
			}
		});
	});

	const dayInMiliseconds = 1000 * 60 * 60 * 24;

	const dateFrom = new Date().getTime();
	const dateTo = new Date("05/03/2023").getTime();
	const dayCount = (dateTo - dateFrom) / dayInMiliseconds;

	document.getElementsByClassName("Stats")[0].textContent =
		"Pytania: " + complitedCount + "/" + totalCount + "\n" +
		"Dni: " + Math.floor(dayCount) + "\n" +
		"Dziennie: " + Math.ceil((totalCount - complitedCount) / dayCount * 100) / 100;


	htmlBooks.forEach(element => {
		const book = GetBook(element);

		for (let i = 0; i < book.questions.length; i++) {
			const question = book.questions[i];
			let htmlQuestion = element.children[1].children[i].children[0];

			let completion = CompletionState(question);
			if (completion == 0)
				htmlQuestion.setAttribute("style", "color: rgb(183, 96, 96);");
			else if (completion == 1)
				htmlQuestion.setAttribute("style", "color: rgb(183, 180, 96);");
			else
				htmlQuestion.setAttribute("style", "color: rgb(50, 153, 36);");
		}

		let completion = BookCompletion(book);
		if (completion == 0)
			element.children[0].setAttribute("style", "color: rgb(183, 96, 96);");
		else if (completion == 1)
			element.children[0].setAttribute("style", "color: rgb(183, 180, 96);");
		else
			element.children[0].setAttribute("style", "color: rgb(50, 153, 36);");
	});
}

function Start() {
	fetch('https://github.com/Sfafg/PytaniaMatura/blob/WebSite/newAnswers.json').then(response => response.json()).then(data => {

		complitedCount = 0;
		for (let index = 0; index < data.length; index++) {
			const book = new Book(data[index].label, data[index].questions);

			book.questions.forEach(element => {
				if (CompletionState(element) == 2) {
					complitedCount++;
				}
			});

			let htmlBook = book.CreateHTML();
			htmlBooks.push(htmlBook)
			document.body.appendChild(htmlBook);
		}

		Update();
	});

}
function DropDownFunction(index) {
	let content = document.getElementById(index).children[1];
	if (content.style.display == "none") {
		content.style.display = "";
	}
	else {
		content.style.display = "none";
	}
}
