document.addEventListener('DOMContentLoaded', function() {
    chrome.tabs.getSelected(null, function(tab) {
        
        // parse opencast host and id of the lecture, may be adapted according to your needs
        var url = tab.url;
        var host = "https://mh-engage.ltcc.tuwien.ac.at";
        var id = getParameterByName('id', url);
        if(host == null || id == null) return;
     
        // get download url and lecture title
        var http = new XMLHttpRequest();
        var params = "id="+id;
        http.open("GET", host+"/search/episode.xml?"+params, true);
        http.onreadystatechange = function() {
            if (http.readyState == 4 && http.status == 200) {
                var parser = new DOMParser();
                var xmlDoc = parser.parseFromString(http.responseText, "text/xml");
                var title = xmlDoc.getElementsByTagName("title")[0].innerHTML;
                if (title == null) title = "video"
                var urls = xmlDoc.getElementsByTagName("url");
                for(elem of urls) {
                    var videoUrl = elem.innerHTML;
                    if (videoUrl == null) return;
                    if(videoUrl.indexOf("http") !== -1 && videoUrl.indexOf("Screen.flv") !== -1) {
                        var downloadButton = document.getElementById('downloadButton');
                        downloadButton.disabled = false;
                        downloadButton.addEventListener('click', function() {
                            chrome.downloads.download({
                                url: videoUrl,
                                filename: title + ".flv"
                            });
                        });
                        break;
                    }
                }
                
            }
        }
        http.send(null);
    }); 
});

// thanks to https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
function getParameterByName(name, url) {
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}