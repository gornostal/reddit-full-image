/* global $:false, chrome:false */
$.expr[":"].containsNoCase = function(el, i, m) {
	var search = m[3];
	if (!search) {
		return false;
	}
	return new RegExp(search, 'i').test($(el).text());
};

// Add the regex selector
$.expr[':'].regex = function(a, i, m) {
	var r = new RegExp(m[3], 'i');
	return r.test($(a).text());
};

// An implementation of outerHTML for jQuery
$.fn.outerHTML = function() {
	return $('<div />').append(this.eq(0).clone()).html();
};


// **********************************************************************************************************
$("a[class^='title'][href^='http://imgur.com']").each(
		function() {
			var url = $(this).attr("href");
			var classId = $(this).closest("div[class^=' thing']").attr("class");
			console.log("Before Call: Classid : " + classId +", URL: " + url);
			chrome.extension.sendRequest({cmd: "get_html", url : url, classId:classId},
				function(data) {
					var url = data.url;
					console.log("After getting callback: Classid: " + data.classId + ", " + "URL : "   + data.url);
					if(typeof url == "undefined"){
						// Try a default
						var a = data.sourceurl.split("/");
						url = "http://i.imgur.com/" + a[a.length-1] + ".jpg";
					}
					var elem = $("[class^='"+data.classId+"']").find("a[class^='title ']");
					elem.after("<br><img class='imgur-full if-preview' src='"+ url +"' />");
					elem.parents('.thing:first').find(".thumbnail").remove();

				} // End of callback function
			); // end of sendrequest

		});// end of .each
// **********************************************************************************************************

// **********************************************************************************************************
// $("a[class*='thumbnail'][href^='http://i.imgur.com']").remove();
$("a.title[href^='http://i.imgur.com']").add('.thing a.title[href$=".jpg"]:visible').each(function() {
	var url = $(this).attr("href");
	//console.log(url);
	$(this).after("<br><img class='imgur-full if-preview' src='"+ url +"' />");
	$(this).parents('.thing:first').find(".thumbnail").remove();

});// end of .each
// **********************************************************************************************************

$(document.body).on('click', '.imgur-full', function(){
	$(this).toggleClass('if-preview');
});

chrome.extension.onRequest.addListener(function(request) {
	console.log(request.greeting);
});
