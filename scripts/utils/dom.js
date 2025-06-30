export const $ = (selector, element = document) =>
  element.querySelector(selector);
export const $$ = (selector, element = document) =>
  element.querySelectorAll(selector);

const hideClass = "--hidden";
const slideClass = "--slide";
const showClass = "--show";

export function createElementFromTemplate(templateSelector) {
  return templateSelector?.content.cloneNode(true);
}

export function toggleVisibility(element, isVisible) {
  element.classList.toggle(hideClass, !isVisible);
}

export function addVisibility(element) {
  element.classList.add(hideClass);
}

export function removeVisibility(element) {
  element.classList.remove(hideClass);
}

export function slide(element) {
  element.classList.add(slideClass);
  setTimeout(() => element.classList.remove(slideClass));
}

export function show(element) {
  setTimeout(() => element.classList.add(showClass));
}

export function unShow(element) {
  setTimeout(() => element.classList.remove(showClass));
}

export function displayModal(modal) {
  modal.classList.add(showClass);
  setTimeout(() => {
    modal.classList.remove(showClass);
  }, 3000);
}
