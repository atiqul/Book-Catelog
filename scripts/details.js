var replacByProp = {
	"title_left": "title",
	"title_right": "title",
	"author_left": "author",
	"author_right": "author",
	"rating": "rating"
}
var replaceText = function(replacedObj, replaceingObj) {
	for (key in replacedObj) {
		document.getElementById(key).innerHTML = replaceingObj[replacedObj[key]];
	}
}
var index = service.getIndexByProp("book_id", service.getParameterByName("id"))
var obj = dataSrc[index];
console.log(obj)

replaceText(replacByProp, obj)
var coverImg = service.getCoverImage(obj.cover)
document.getElementById("cover_img").setAttribute("src", coverImg)

function goEdit() {
	window.location = "form.html?id=" + obj.book_id;
}

function goDelete() {
	document.getElementById("dialogue-container").style.display = "block";
}

function exit() {
	document.getElementById("dialogue-container").style.display = "none";
}

function confirmDel() {
	dataSrc.splice(index, 1);
	localStorage.setItem('dataSrc', JSON.stringify(dataSrc));
	window.location = "index.html";
}