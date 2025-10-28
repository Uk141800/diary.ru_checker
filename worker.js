class Icon {
  constructor() {}

  setGray() {
    chrome.action.setTitle({ title: 'Нет новых уведомлений' });
    chrome.action.setIcon({ path: { 32: 'images/gray32.png' } });
  }

  setRed() {
    chrome.action.setTitle({ title: 'Новые шевеления есть!' });
    chrome.action.setIcon({ path: { 32: 'images/red32new.png' } });
  }

  setGreen() {
    chrome.action.setIcon({ path: { 32: 'images/green32.png' } });
  }
}


// Обработчик сообщений
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "refresh") {
    refresh().then(() => {
      sendResponse({ success: true });
    }).catch(error => {
      sendResponse({ success: false, error: error.message });
    });
    return true; // Необходимо для асинхронного ответа
  }
});

async function refresh() {
  console.log('Start cheking')
  const icon = new Icon();
  try {
    const response = await fetch('https://diary.space/');
    const text = await response.text();

    let echo = ''

    //Ищу комментарии в днвенике
    const intcommenli = text.match(/<li id="myCommunityLink">(.*?)<\/li>/s);
    const intcommen = intcommenli[1].match(/<div class="num"[^<]*?<a[^<]*?href="([^<]*?)".*?>([^<]*?)<\/a>[^<]*?<\/div>/s);
    if (intcommen) {
      //console.log('intcommen')
      //console.log(intcommen)
      echo += "<a href ='"+intcommen[1]+"'>Комментариев в дневнике: " +intcommen[2]+"</a><br>"
    }

    //Ищу комментарии вне днвеника
    const extcommentli = text.match(/<li id="discussionLink">(.*?)<\/li>/s);
    //console.log(extcommentli)
    const extcomment = extcommentli[1].match(/<div class="num adm-num"[^<]*?<a[^<]*?href="([^<]*?)"[^<]*?>([^<]*?)<\/a>[^<]*?<\/div>/s);
    if (extcomment) {
      //console.log('extcomment')
      //console.log(extcomment)
      echo += "<a href ='"+extcomment[1]+"'>Комментариев вне дневника: " +extcomment[2]+"</a><br>"
    }

    //Ищу упоминания
    const referenceli = text.match(/<li id="referenceLink">(.*?)<\/li>/s);
    console.log(referenceli)
    const reference = referenceli[1].match(/<div class="num adm-num"[^<]*?<a[^<]*?href="([^<]*?)"[^<]*?>([^<]*?)<\/a>[^<]*?<\/div>/s);
    if (reference) {
      console.log('reference')
      console.log(reference)
      echo += "<a href ='"+reference[1]+"'>Упоминаний: " +reference[2]+"</a><br>"
    }

    //Ищу умылы
    const umail = text.match(/<span class="i-letter">.*?<div class="num[^<]*?<a[^<]*?href="([^<]*?)"[^<]*?>([^<]*?)<\/a>[^<]*?<\/div>[^<]*?<\/li>/s);
    if (umail) {
      //console.log('umail')
      //console.log(umail)
      echo += "<a href ='"+umail[1]+"'>Новых U-mail: " +umail[2]+"</a><br>"
    }

    if (echo.length > 0) {
      await chrome.storage.local.set({ 'text': echo });
      icon.setRed()
    }else{
      await chrome.storage.local.set({ 'text': 'Ничего нового.' });
      icon.setGray()
    }
    console.log(echo)

  } catch (error) {
    console.error('Refresh failed:', error);
  }
}

// Запускаем при старте сервис-воркера
chrome.runtime.onInstalled.addListener(() => {
  refresh(); // Первый запуск
  chrome.alarms.create('refreshAlarm', { periodInMinutes: 5 }); // Периодический запуск
});

// Обработчик для периодического обновления
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'refreshAlarm') {
    refresh();
  }
});
