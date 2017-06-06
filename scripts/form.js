var dataSrc = JSON.parse(localStorage.getItem('dataSrc'));

var qParamId = service.getParameterByName("id");
var bookIndex = service.getIndexByProp("book_id", qParamId);


document.getElementById('cancel').onclick = function() {
	if (qParamId) {
		window.location = "details.html?id=" + qParamId;
	} else {
		window.location = "index.html";
	}

}

if (qParamId) {
	var formElements = document.form.elements;
	var bookObj = dataSrc[bookIndex];
	for (var prop in bookObj) {
		if (formElements.hasOwnProperty(prop)) {
			var value = prop == "rating" ? Math.ceil(bookObj[prop]) : bookObj[prop];
			formElements[prop].value = value;
		}
	}
}


document.getElementById('form').onsubmit = function() {

	var book = create(this)
	if (qParamId) {
		dataSrc[bookIndex] = book;
	} else {
		dataSrc.splice(0, 0, book);
	}
	localStorage.setItem('dataSrc', JSON.stringify(dataSrc));
}

var create = function(form) {

	var today = new Date();
	var obj = {};

	obj.book_id = ((Math.random() * 100).toFixed(0)) * (today.getTime());
	obj.title = form.elements.title.value;
	obj.author = form.elements.author.value;
	obj.ISBN = form.elements.ISBN.value;
	obj.publicationdate = form.elements.publicationdate.value;
	obj.entry_date = today;
	obj.rating = form.elements.rating.value;
	obj.language = form.elements.language.value;
	obj.cover = form.elements.cover.value;
	obj.tags = form.elements.tags.value.split(',');

	service.getDateAsDate([obj], ["publicationdate", "entry_date"]);

	return obj;

}