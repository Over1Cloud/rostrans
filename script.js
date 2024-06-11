// Переменная-флаг, чтобы отслеживать, было ли уже отображено уведомление
let notificationShown = false;

// Функция для загрузки JSON из URL
async function fetchJSON(url) {
  if (!notificationShown) {
    // Показываем уведомление о запуске загрузки JSON
    displayMessage("Загрузка данных...");
    notificationShown = true; // Устанавливаем флаг в true, чтобы уведомление отображалось только один раз
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Ошибка загрузки данных: " + error.message);
  }
}

// Функция для проверки совпадения вопроса
function checkQuestion(text, answers) {
  for (let i = 0; i < answers.length; i++) {
    if (text.includes(answers[i].question)) {
      return answers[i].answer;
    }
  }
  return null;
}

// Функция для выполнения действий на основе найденного ответа
async function processAnswer(answer) {
  if (!answer) {
    throw new Error("Ответ не найден в базе данных");
  }

  const answerElement = document.evaluate(`//*[contains(text(), "${answer}")]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  if (!answerElement) {
    throw new Error("Ответ не найден на сайте");
  }

  const inputElement = answerElement.closest('.choice-view__choice-container').querySelector('input[type="radio"]');
  if (!inputElement) {
    throw new Error("Не удалось найти соответствующий input элемент");
  }

  inputElement.click();
  inputElement.setAttribute('aria-checked', 'true');
}

// Функция для отображения уведомления на странице
function displayMessage(status) {
  const messageContainer = document.createElement('div');
  messageContainer.id = 'notification';
  messageContainer.style.position = 'fixed';
  messageContainer.style.top = '20px';
  messageContainer.style.left = '50%';
  messageContainer.style.transform = 'translateX(-50%)';
  messageContainer.style.padding = '15px';
  messageContainer.style.backgroundColor = '#000';
  messageContainer.style.color = '#fff';
  messageContainer.style.borderRadius = '10px';
  messageContainer.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
  messageContainer.style.zIndex = '9999';
  messageContainer.style.fontFamily = '-apple-system, BlinkMacSystemFont, sans-serif';
  messageContainer.style.fontSize = '16px';
  messageContainer.textContent = status;
  document.body.appendChild(messageContainer);
  
  // Удаляем уведомление через 2 секунды
  setTimeout(() => {
    messageContainer.remove();
  }, 2000);
}

// Функция для выполнения парсинга и действий
async function parseAndProcess() {
  try {
    const data = await fetchJSON('https://raw.githubusercontent.com/Over1Cloud/rostrans/main/answers.json');
    const textOnPage = document.body.innerText;
    const answer = checkQuestion(textOnPage, data);
    await processAnswer(answer);
  } catch (error) {
    displayMessage("Ошибка: " + error.message);
  }
}

// Вызов функции для парсинга и выполнения действий
parseAndProcess();
