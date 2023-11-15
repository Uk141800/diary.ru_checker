import icon from './modules/icon.js';

function loadXMLDoc(myurl, cb) {
    // Fallback to Microsoft.XMLHTTP if XMLHttpRequest does not exist.
    var xhr = (window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"));
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            if (typeof cb === 'function')
                cb(xhr.responseText);
        } else {
            console.log('Diary is dead again (✖╭╮✖)');
            icon.setGray()
            return 0
        }
    }
    xhr.open("GET", myurl, true);
    xhr.send();

}

function searchfrom(str, sub) {
    let pos = str.indexOf(sub)
        let temp = str.substring(pos + sub.length, pos + 500)
        //console.log(pos + typeof(sub.length))
        return temp
}
function searchto(str, sub) {
    let pos = str.indexOf(sub)
        let temp = str.substring(0, pos)
        return temp
}

function refresh() {
    console.log('start refreshing');
    loadXMLDoc('http://diary.ru/', function (responseText) {
        var echo = ""

            var parser = new DOMParser();
        var doc = parser.parseFromString(responseText, "text/html");

        var diary_com = parser.parseFromString(doc.getElementById('myCommunityLink').innerHTML, "text/html");
        if (diary_com.getElementsByClassName('num').length === 0) {
            console.log("No new comment")
        } else {
            var len = diary_com.getElementsByClassName('num')[0].innerHTML
                var temp = parser.parseFromString(diary_com.getElementsByClassName('num')[0].innerHTML, "text/html");
            var link = temp.getElementsByTagName('a')[0].getAttribute('href');
            var count = temp.getElementsByTagName('a')[0].text
                //console.log('<a href='+link+'>Комменариев в дневнике: ' + count + '</a>')
                echo = echo + '<a target="_blank" href=' + link + '>Комменариев в дневнике: ' + count + '</a><br>'
                //console.log(count)
                //console.log(link)
        }

        var com = parser.parseFromString(doc.getElementById('discussionLink').innerHTML, "text/html");
        if (com.getElementsByClassName('num adm-num').length === 0) {
            console.log("No new comment")
        } else {
            len = com.getElementsByClassName('num adm-num')[0].innerHTML
                temp = parser.parseFromString(com.getElementsByClassName('num adm-num')[0].innerHTML, "text/html");
            link = temp.getElementsByTagName('a')[0].getAttribute('href');
            count = temp.getElementsByTagName('a')[0].text
                //console.log('<a href='+link+'>Комменариев вне дневника: ' + count + '</a>')
                echo = echo + '<a target="_blank" href=' + link + '>Комменариев вне дневника: ' + count + '</a><br>'
                //console.log(count)
                //console.log(link)
        }

        var ref = parser.parseFromString(doc.getElementById('referenceLink').innerHTML, "text/html");
        if (ref.getElementsByClassName('num adm-num').length === 0) {
            //console.log("No new comment")
        } else {
            len = ref.getElementsByClassName('num adm-num')[0].innerHTML
                temp = parser.parseFromString(ref.getElementsByClassName('num adm-num')[0].innerHTML, "text/html");
            link = temp.getElementsByTagName('a')[0].getAttribute('href');
            count = temp.getElementsByTagName('a')[0].text
                //console.log('<a href='+link+'>Упоминаний: ' + count + '</a>')
                echo = echo + '<a target="_blank" href=' + link + '>Упоминаний: ' + count + '</a><br>'
                //console.log(count)
                //console.log(link)
        }

        let umail = searchfrom(responseText, 'U-mail</span></a>')
            umail = searchto(umail, '</li>')
            if (umail.includes('num adm')) {
                echo = echo + "<a target='_blank' href='https://diary.ru/u-mail'>Новых U-mail: " + searchto(searchfrom(umail, 'data-pjax="0">'), "<") + "</a><br>"
            }

            if (echo.length > 0) {
                icon.setRed()
                document.getElementById("text").innerHTML = echo
            } else {
                icon.setGray()
                document.getElementById("text").innerHTML = 'Новых комментариев нет.'
            }

            //console.log(echo)


            //var el = document.createElement( 'html' );
            //el.innerHTML = responseText;
            //alert(el.getElementById('myCommunityLink').value);
            //var parser = new DOMParser();
            //var doc = parser.parseFromString(responseText, "text/html");
            //var diary = parser.parseFromString(doc.getElementById('myCommunityLink').innerHTML, "text/html");
            //var temp = diary.getElementsByClassName('num').innerHTML

            //alert(temp)
            // do something with the responseText here
    });
}

// chrome.runtime.onInstalled.addListener(function(details){
// if(details.reason == "install"){
// refresh()
// }else if(details.reason == "update"){
// refresh()
// }
// });


window.onload = async() => {
    refresh()
    //document.getElementById('button').onclick = () => {
    //	console.log('4')
    //refresh()
    //document.getElementById("text").innerText = "whatever";
    //};
    /*	document.getElementById('con').onclick = () => {
    icon.setGray()
    };
    document.getElementById('dis').onclick = () => {
    icon.setGreen()
    };*/
};

/*<a href="https://00010010.diary.ru" title="Мой дневник" data-pjax="0"><span class="i-menu-diary"></span><span class="alt">Мой дневник</span></a><div class="num"><a class="white" href="https://00010010.diary.ru/p221729445.htm?&amp;commentId=756096283#756096283" data-pjax="0">1</a></div>*/

/*	document.getElementById('show').onclick = () => {
chrome.storage.local.get('cookie', function(result) {
if (!(result.cookie)) {
alert("No data");
}
else{
alert(result.cookie)
};
});
};

document.getElementById('save').onclick = () => {
chrome.storage.local.set({'cookie': document.getElementById("cookie").value}, function() {
//console.log("The value stored was: " + loginToken);
});
alert(document.getElementById("cookie").value);
};*/
