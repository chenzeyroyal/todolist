const classes = {
  hide: "--hidden",
  slide: "--slide",
  show: "--show",
  inactive: "--inactive",
  topReached: "--top-reached",
  bottomReached: "--bottom-reached",
  closed: "--closed",
};
const selectors = {
  customSelect: "[data-js-customSelect]",
  customSelectButton: "[data-js-customSelectButton]",
};

export function toggleSidebar(sidebar) {
  sidebar.classList.toggle(classes.closed);
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

export function addTopBorder(element) {
  element.classList.add(classes.topReached);
  setTimeout(() => {
    element.classList.remove(classes.topReached);
  }, 500);
  element.classList.remove(classes.bottomReached);
}

export function addBotBorder(element) {
  element.classList.add(classes.bottomReached);
  setTimeout(() => {
    element.classList.remove(classes.bottomReached);
  }, 500);
  element.classList.remove(classes.topReached);
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

export function toggleSelectVisibility(button, select) {
  button.addEventListener("click", () => select.classList.toggle(classes.hide));
}

export function onCloseAllSelects() {
  document.addEventListener("click", (e) => {
    const isClickInsideButton = e.target.closest(selectors.customSelectButton);

    if (!isClickInsideButton)
      document.querySelectorAll(selectors.customSelect).forEach((select) => {
        select.classList.add(classes.hide);
      });
  });
}
