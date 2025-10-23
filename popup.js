document.addEventListener('DOMContentLoaded', async () => {
  const contentDiv = document.getElementById('text');

  // Первоначальная загрузка данных
  const { text: initialText } = await chrome.storage.local.get('text');
  updateContent(contentDiv, initialText);

  // Обноление при тыке на расширение
  try {
    await chrome.runtime.sendMessage({ action: "refresh" });
    console.log("Refresh DOMContentLoaded");
    const { text: updatedText } = await chrome.storage.local.get('text');
    updateContent(contentDiv, updatedText);
  } catch (error) {
    console.error("Refresh failed:", error);
    contentDiv.textContent = 'Ошибка при проверке обновлений';
  }
});

function updateContent(element, text) {
  if (text) {
    element.innerHTML = text;
    // Обработчики для ссылок
    element.querySelectorAll('a').forEach(link => {
      link.removeEventListener('click', handleLinkClick);
      link.addEventListener('click', handleLinkClick);
    });
  } else {
    element.textContent = 'Новых комментариев нет';
  }
}

function handleLinkClick(e) {
  e.preventDefault();
  chrome.tabs.create({ url: e.target.href });
}


// Fixes
document.addEventListener('DOMContentLoaded', async () => {
  const toggles = {
    favFix: document.getElementById('favFix'),
    mainfeedFix: document.getElementById('mainfeedFix'),
    avatarFix: document.getElementById('avatarFix')
  };

  // Загружаем сохранённые состояния
  const savedState = await chrome.storage.local.get(['favFix', 'mainfeedFix', 'avatarFix']);

  // Устанавливаем текущие значения
  for (const [key, toggle] of Object.entries(toggles)) {
    toggle.checked = savedState[key] || false;

    // Обработчик изменений
    toggle.addEventListener('change', async () => {
      await chrome.storage.local.set({ [key]: toggle.checked });

      // Отправляем обновление на все вкладки example.com
      const tabs = await chrome.tabs.query({ url: "*://*.diary.space/*" });
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, {
          action: 'updateStyles',
          favFix: toggles.favFix.checked,
          mainfeedFix: toggles.mainfeedFix.checked,
          avatarFix: toggles.avatarFix.checked
        });
      });
    });
  }
});

