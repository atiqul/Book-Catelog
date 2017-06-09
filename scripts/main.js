if (!JSON.parse(localStorage.getItem('dataSrc'))) {
	dataSrc = service.sortByProp(service.getDateAsDate(dataSrc, ["publicationdate", "entry_date"]), "entry_date");
	localStorage.setItem('dataSrc', JSON.stringify(dataSrc));
}
dataSrc = JSON.parse(localStorage.getItem('dataSrc'));
var displayedObj = dataSrc;
var offset = 0;
displayCatelog(displayedObj, 12, offset)

function displayCatelog(data, limit, startIndex) {

	displayedObj = data;
	startIndex = startIndex || 0;
	offset = startIndex + limit;
	var row = createElem('div', {
		'class': 'row'
	});
	var limitUpperBound = startIndex + limit;
	for (var i = startIndex; i < limitUpperBound; i++) {
		if (data.hasOwnProperty(i)) {
			setTimeout(function() {
				entry = data[i];
				var bookCoverUrl = service.getCoverImage(entry.cover);
				var col = createElem('div', {
					"class": "book-container col col-lg-4 col-md-4 col-sm-6 col-xs-12",
					"data-summary": entry.title + "," + entry.author
				});

				var button = createElem('input', {
					"type": "button",
					"class": "btn btn-default details",
					"onclick": "routeTo(" + entry.book_id + ")",
					"value": "View details"
				});

				var overlay = createElem('div', {
					"class": "overlay"
				});


				var cover = createElem('div', {
					"class": "cover"
				});
				var img = createElem('img', {
					"src": bookCoverUrl
				});
				var author = createElem('div', {
					"class": "author"
				});
				var rating = createElem('span')
				var title = createElem('div', {
					"class": "title"
				});

				title.innerHTML = entry.title;
				author.innerHTML = "by " + entry.author;
				rating.innerHTML = entry.rating != "" ? "Rating: " + entry.rating : "";

				author.appendChild(rating);

				cover.appendChild(overlay);
				cover.appendChild(button);
				cover.appendChild(img);

				col.appendChild(cover);
				col.appendChild(author);
				col.appendChild(title);

				row.appendChild(col);


				document.getElementById('catelog-container').appendChild(row);

			}(i));
		}
	}
}



function createElem(elemTagName, properties) {
	var elem = document.createElement(elemTagName);
	for (prop in properties) {
		elem.setAttribute(prop, properties[prop]);
	}
	return elem;
}

document.getElementById("sortby").onchange = function() {
	if (this.value != "") {
		service.sortByProp(displayedObj, this.value);
		document.getElementById('catelog-container').innerHTML = ""
		displayCatelog(displayedObj, 12)
	}
};



document.getElementById("filter").onkeyup = function(event) {
	service.filterData(document.getElementsByClassName("book-container"), this.value)
}

var groupByAuthorObj = service.groupByProp(dataSrc, "author");
var groupByCategoryObj = service.groupByProp(dataSrc, "tags")
var groupByYearObj = service.groupByProp(dataSrc, "publicationdate")

var totalGroupByObject = Object.assign({}, groupByAuthorObj, groupByCategoryObj, groupByYearObj);

createSideMenu(groupByAuthorObj, "byAuthorPanel");
createSideMenu(groupByCategoryObj, "byCategoryPanel");
createSideMenu(groupByYearObj, "byYearPanel");


function createSideMenu(obj, parentId) {
	for (var prop in obj) {
		var li = createElem('li', {
			"data-label": prop,
			"onclick": "displayGroupByList(this)"
		});
		var a = createElem('a', {
			"href": "#"
		})
		a.innerHTML = prop + " (" + (obj[prop]).length + ") ";
		li.appendChild(a);
		document.getElementById(parentId).appendChild(li);
	}
}

function displayGroupByList(elem) {
	elem.children[0].click();
	var activeElems = document.querySelectorAll(".active");

	[].forEach.call(activeElems, function(el) {
		el.classList.remove("active");
	});

	elem.classList.add("active")
	var prop = elem.getAttribute("data-label");
	var resultArr = totalGroupByObject[prop];
	if (prop == "all") {
		resultArr = dataSrc;
	}
	document.getElementById('catelog-container').innerHTML = ""
	displayCatelog(resultArr, 12);
	return false;
}


function routeTo(id) {
	location.href = "details.html?id=" + id;
}

// for side menu accordion script

var accItem = document.getElementsByClassName('panel-collapse');
var accHD = document.getElementsByClassName('panel-heading');

for (i = 0; i < accHD.length; i++) {
	accHD[i].addEventListener('click', toggleItem, false);
}

function toggleItem() {
	var itemClass = this.className;
	var open = this.nextSibling.nextSibling.classList.contains("in");

	for (i = 0; i < accItem.length; i++) {
		accItem[i].classList.remove("in");
		accItem[i].previousSibling.previousSibling.children[0].children[0].classList.add("collapsed")
	}
	if (!open) {
		this.nextSibling.nextSibling.classList.toggle("in");
		this.children[0].children[0].classList.remove("collapsed");
	}
}



//pagination on scroll

window.addEventListener("scroll", function(event) {
	if ((document.documentElement.scrollHeight - window.scrollY) == window.innerHeight) {
		if (displayedObj.length > offset) {
			displayCatelog(displayedObj, 12, offset)
		}
	}
})