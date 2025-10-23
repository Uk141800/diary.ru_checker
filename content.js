// Стилевые правила для каждого фикса
const styleRules = {
  favFix: `body.wide:not(.pay26):not(.pay64):not(.pay63) #wrapper { padding-right: 0px !important; }`,
  mainfeedFix: `.col-md-9, .content .main { width: auto !important; }`,
  avatarFix: `div.avatar img { max-width: 120px; }`
};

// Загружаем начальное состояние
chrome.storage.local.get(['favFix', 'mainfeedFix', 'avatarFix'], (state) => {
  applyStyles(state);
});

// Обработчик обновлений
chrome.runtime.onMessage.addListener(({ action, ...state }) => {
  if (action === 'updateStyles') applyStyles(state);
});

// Применяем/удаляем стили
function applyStyles({ favFix, mainfeedFix, avatarFix }) {
  // Удаляем все старые стили
  document.querySelectorAll('[data-custom-style]').forEach(el => el.remove());

  // Добавляем новые
  if (favFix) addStyle('favFix', styleRules.favFix);
  if (mainfeedFix) addStyle('mainfeedFix', styleRules.mainfeedFix);
  if (avatarFix) addStyle('avatarFix', styleRules.avatarFix);
}

function addStyle(id, css) {
  const style = document.createElement('style');
  style.id = `style-${id}`;
  style.setAttribute('data-custom-style', 'true');
  style.textContent = css;
  document.head.appendChild(style);
}


