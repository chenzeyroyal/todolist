import { addVisibility, removeVisibility } from "../../utils/dom.js";

export default class SectionVisibilityController {
  constructor(selectors, isEditing) {
    this.selectors = selectors;
    this.isEditing = isEditing;
    this.handleEditingView(isEditing);
  }

  handleEditingView(isEditing) {
    if (isEditing) {
      addVisibility(this.selectors.input);
      addVisibility(this.selectors.buttonContainer);
      this.selectors.input.focus();

      removeVisibility(this.selectors.title);
      removeVisibility(this.selectors.showTaskFieldButton);
    } else {
      addVisibility(this.selectors.title);
      addVisibility(this.selectors.showTaskFieldButton);

      removeVisibility(this.selectors.input);
      removeVisibility(this.selectors.buttonContainer);
    }
  }
}
