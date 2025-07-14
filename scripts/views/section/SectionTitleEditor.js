import { setButtonToActive, setButtonToInactive } from "../../utils/ui.js";

export default class SectionTitleEditor {
  constructor(section, selectors) {
    this.section = section;

    this.title = {
      container: selectors.titleContainer,
      text: selectors.title,
      input: selectors.input,
      buttons: selectors.buttonContainer,
      submitButton: selectors.submitButton,
      cancelButton: selectors.cancelButton,
    };

    this.setTitle();
    this.checkInput();
  }

  setTitle() {
    this.title.text.textContent = this.section.title;

    this.cancelTitle();
  }

  saveTitle() {
    const value = this.title.input.value;
    this.section.title = value;
    this.title.text.textContent = this.section.title;
  }

  cancelTitle() {
    this.title.input.value = this.title.text.textContent;
  }

  checkInput() {
    this.title.input.addEventListener("input", () => {
      if (this.title.input.value.trim() === "") {
        setButtonToInactive(this.title.submitButton);
      } else {
        setButtonToActive(this.title.submitButton);
      }
    });
  }
}
