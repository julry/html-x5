import { FTClient } from "https://esm.sh/ft-client"

// Инициализация клиента
const ftClient = new FTClient(
  "https://games-admin.fut.ru/api/",
  "x5group-technologies"
)

// Находим элементы формы
const nameInput = document.querySelector('.ggg-form input[type="text"]')
const phoneInput = document.querySelector('.ggg-form input[type="tel"]')
const emailInput = document.querySelector('.ggg-form input[type="email"]')
const consentCheckbox   = document.querySelectorAll(".ggg-checkboxes input[type='checkbox']")[0]
const subscribeTopCheck = document.querySelectorAll(".ggg-checkboxes input[type='checkbox']")[1]
const subscribeX5Check  = document.querySelectorAll(".ggg-checkboxes input[type='checkbox']")[2]
const submitBtn = document.querySelector('.ggg-btn')
const textError = document.querySelector('.text_error')
const text_button = document.querySelector(".ggg-btn");
const errorModal = document.querySelector(".YYY");
const div = document.querySelector(".GGG");
consentCheckbox.checked = true;
subscribeTopCheck.checked = true;
subscribeX5Check.checked = true;

// // === Автоподстановка +7 при клике ===
// phoneInput.addEventListener("onfocus", () => {
//   if (!phoneInput.value.startsWith("+7")) {
//     phoneInput.value = "+7"
//   }
// })

// // === Ограничение на ввод — только цифры после +7 ===
// phoneInput.addEventListener("input", () => {
//   if (!phoneInput.value.startsWith("+7")) {
//     phoneInput.value = "+7"
//   }
//   phoneInput.value = "+7" + phoneInput.value.slice(2).replace(/\D/g, "")
// })

submitBtn.addEventListener('click', async () => {
  textError.innerHTML = ""

  const name = nameInput.value.trim()
  const phone = phoneInput.value.trim()
  const email = emailInput.value.trim()

  // Проверка пустых полей
  if (!name && !phone && !email) {
    textError.innerHTML = "Заполните все поля (Имя, Телефон, Почта)."
    return
  }
    // Проверка пустых полей
  if (!name && !phone) {
    textError.innerHTML = "Заполните поля (Имя, Телефон)."
    return
  }
    if (!name && !email) {
    textError.innerHTML = "Заполните поля (Телефон, Почта)."
    return
  }
      if (!phone && !email) {
    textError.innerHTML = "Заполните поля (Телефон, Почта)."
    return
  }
    // Проверка пустых полей
  if (!name) {
    textError.innerHTML = "Заполните поля (Имя)."
    return
  }
    if (!phone) {
    textError.innerHTML = "Заполните поля (Телефон)."
    return
  }
      if (!email) {
    textError.innerHTML = "Заполните поля (Почта)."
    return
  }

  // Проверка телефона (должно быть не меньше 12 символов: +7 и 10 цифр)
  if (phone.length < 12) {
    textError.innerHTML = "Введите корректный телефон (пример: +7XXXXXXXXXX)."
    return
  }

  // Проверка email
  if (!email.includes("@")) {
    textError.innerHTML = "Введите корректный адрес электронной почты."
    return
  }

  // Проверка согласия
  if (!consentCheckbox.checked) {
    textError.innerHTML = "Нужно дать согласие на обработку данных."
    return
  }

  try {
    const data = {
      name: name,
      phone: phone,
      email: email,
      isSubscribed: subscribeTopCheck.checked, 
      isSub: subscribeX5Check.checked
    }

    const newRecord = await ftClient.createRecord(data);

    ym?.(103834904,'reachGoal','mail')

    console.log("new record ID:", newRecord.id)
    console.log("saved fields:", data)

    document.querySelector(".GGG").style.display = "none"
    errorModal.style.display = "flex"  // можно сразу показать следующий блок
  } catch (err) {
    console.error("Ошибка при сохранении:", err)
    textError.innerHTML = "Ошибка при отправке данных."
  }
})