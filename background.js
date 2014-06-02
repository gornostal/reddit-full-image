function onRequest(request, sender, callback) {
    if(request.cmd == "test") {
        log("starting ajax call");
        callback({name : "AJ"});
    }
    if(request.cmd == "get_html") {
        log("starting ajax call");
        $.ajax({
            url : request.url,
            dataType: "html",
            success : function(html){
                var url = $(html).find('img[src^="http://i.imgur.com"][src$=".jpg"]').first().attr("src");
                        //var elem = $(html).find("div[class*='panel left']");
                        log("URL source : " + request.url);
                        log("Extracted IMAGE Url: " + url);
                        callback({url : url , classId : request.classId, sourceurl : request.url});
                    }
                });
    }
}

function log(message){
    chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.sendRequest(tab.id, {greeting: message}, function(response) {});
    });
}


chrome.extension.onRequest.addListener(onRequest);