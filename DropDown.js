var htmlBooks = [];
var dropDownID = 0;

function CreateDropDown(labelStr) {
	let dropDownPrefab = document.createElement("div");
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
class Book {
	label;
	questions;
	constructor(label, question) {
		this.label = label;
		this.questions = question;
	}
	CreateHTML() {
		let dropDown = CreateDropDown(this.label);
		for (let index = 0; index < this.questions.length; index++) {
			const question = this.questions[index];
			let drop = CreateDropDown(question.label);

			let inputField = document.createElement("d");
			inputField.setAttribute("class", "AnswerField");
			inputField.setAttribute("contenteditable", "true");
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

function Start() {
	fetch('Answers.JSON').then(response => response.json()).then(data => {
		for (let index = 0; index < data.length; index++) {
			const book = new Book(data[index].label, data[index].questions);

			let htmlBook = book.CreateHTML();
			htmlBooks.push(htmlBook)
			document.body.appendChild(htmlBook);
		}
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

function SaveChangesFunction() {
	let books = [];

	for (let index = 0; index < htmlBooks.length; index++) {
		const htmlBook = htmlBooks[index];

		books.push(GetBook(htmlBook));
	}
	console.log(JSON.stringify(books));
}