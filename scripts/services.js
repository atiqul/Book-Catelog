var dataSrc = dataSrc || JSON.parse(localStorage.getItem('dataSrc'));
var service = {
	getDateAsDate: function(data, prop) {
		data.forEach(function(entry) {
			prop.forEach(function(attr) {
				var d = new Date(entry[attr]);
				if (!isNaN(Date.parse(d))) {
					entry[attr] = d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate();
				}
			})
		})
		return data;
	},

	sortByProp: function(data, prop) {
		return data.sort(function(a, b) {
			return (a[prop] > b[prop]) ? -1 : ((b[prop] > a[prop]) ? 1 : 0);
		});
	},

	getCoverImage: function(imgUrl) {
		var bookCoverUrl = imgUrl;
		if (bookCoverUrl.indexOf("http://pics.cdn.librarything.com") > -1 || bookCoverUrl == '' || bookCoverUrl == null) {
			bookCoverUrl = "img/defbookcover.jpg";
		}
		return bookCoverUrl;
	},

	filterData: function(elements, text) {
		Array.prototype.filter.call(elements, function(elem) {
			if (!elem.attributes["data-summary"].value.match(new RegExp(text, "i"))) {
				elem.style.display = "none"
			} else {
				elem.style.display = "block"
			}
		})
	},

	getParameterByName: function(name, url) {
		if (!url) url = window.location.href;
		name = name.replace(/[\[\]]/g, "\\$&");
		var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	},

	getIndexByProp: function(prop, value) {
		return dataSrc.findIndex(x => x[prop] == value)
	},

	groupByProp: function(data, key) {
		return data.reduce(function(obj, prop) {
			if (key == "tags") {
				var tags = prop[key] || [];
				tags.forEach(function(tag) {
					(obj[tag] = obj[tag] || []).push(prop);
				})
				if (tags.length == 0) {
					(obj["Other Cetagory"] = obj["Other Cetagory"] || []).push(prop)
				}

			} else if (key == "publicationdate") {
				var objProp = new Date(prop[key]).getFullYear();
				if (objProp.toString() === "NaN") {
					objProp = "Other Year";
				}
				(obj[objProp] = obj[objProp] || []).push(prop);
			} else {
				if (prop[key] == "" || prop[key] == undefined) {
					(obj["Other Author"] = obj["Other Author"] || []).push(prop);
				} else {
					(obj[prop[key]] = obj[prop[key]] || []).push(prop);
				}
			}
			return obj;
		}, {});
	}


}