export const $ = (selector, element = document) =>
  element.querySelector(selector);
export const $$ = (selector, element = document) =>
  element.querySelectorAll(selector);

const classes = {
  hide: "--hidden",
  slide: "--slide",
  show: "--show",
  inactive: "--inactive",
};

export function createElementFromTemplate(templateSelector) {
  return templateSelector?.content.cloneNode(true);
}

export function addVisibility(element) {
  element.classList.remove(classes.hide);
}

export function removeVisibility(element) {
  element.classList.add(classes.hide);
}

export function slide(element) {
  element.classList.add(classes.slide);
  setTimeout(() => element.classList.remove(classes.slide));
}

export function show(element) {
  setTimeout(() => element.classList.add(classes.show));
}

export function unShow(element) {
  setTimeout(() => element.classList.remove(classes.show));
}

export function displayModal(modal) {
  modal.classList.add(classes.show);
  setTimeout(() => {
    modal.classList.remove(classes.show);
  }, 3000);
}
export function setButtonToActive(button) {
  button.classList.remove(classes.inactive);
}
export function setButtonToInactive(button) {
  button.classList.add(classes.inactive);
}

export function handleSelects(button, select) {
  document.addEventListener("click", (e) => {
    if (button.contains(e.target)) {
      select.classList.toggle("--hidden");
    } else {
      removeVisibility(select);
    }
  });
}
