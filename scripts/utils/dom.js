export const $ = (selector, element = document) =>
  element.querySelector(selector);
export const $$ = (selector, element = document) =>
  element.querySelectorAll(selector);

export function createElementFromTemplate(templateSelector) {
  return templateSelector?.content.cloneNode(true);
}
