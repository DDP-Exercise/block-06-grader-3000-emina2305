class GradeController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  init() {
    this.view.renderInputs(this.model.exercises);

    this.view.bindInputChanges(({ type, index, value }) => {
      this.updateModel(type, index, value);
    });

    this.view.bindReset(() => {
      this.model.reset();
      this.view.resetInputs();
    });

    this.model.addEventListener("gradechange", (event) => {
      this.view.renderResults(event.detail);
    });

    this.view.renderResults(this.model.calculateFinalGrade());
  }

  updateModel(type, index, value) {
    if (type === "exercise") {
      this.model.setExercisePoints(index, value);
      return;
    }

    if (type === "exam") {
      this.model.setExamPoints(value);
      return;
    }

    if (type === "attendance") {
      this.model.setAttendance(value);
      return;
    }

    throw new Error(`Unbekannter Eingabetyp: ${type}`);
  }
}