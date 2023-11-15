import icon from './modules/icon.js';

chrome.alarms.onAlarm.addListener(a => {
    console.log('Alarm!', a);

    fetch('http://just-the-time.appspot.com/').then((response) => response.text())
    .then((text) => {
        console.log(text);
    });

    fetch('http://diary.ru').then((response) => response.text())
    .then((text) => {
        //console.log(text);
        if (text.includes('div class="num')) {
            icon.setRed()
            console.log('!!1рас!1!');
        } else {
            icon.setGray()
            console.log('No notification')
        }
    });
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.alarms.get('alarm', a => {
        if (!a) {
            console.log("Alarm created")
            chrome.alarms.create('alarm', {
                periodInMinutes: 5
            });

            fetch('http://diary.ru').then((response) => response.text())
            .then((text) => {
                //console.log(text);
                if (text.includes('div class="num')) {
                    icon.setRed()
                    console.log('!!1рас!1!')
                } else {
                    icon.setGray()
                    console.log('No notification')
                }
            });
        }
    });
});
