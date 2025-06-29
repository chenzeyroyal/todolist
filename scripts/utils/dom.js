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

export function addVisibility(element, isVisible) {
  element.classList.add(hideClass, !isVisible);
}

export function removeVisibility(element, isVisible) {
  element.classList.remove(hideClass, !isVisible);
}

export function slide(element) {
  element.classList.add(slideClass);
  setTimeout(() => element.classList.remove(slideClass));
}

export function show(element) {
  setTimeout(() => element.classList.add(showClass));
}
