class GradeView {
  constructor() {
    this.gradeInputs = document.querySelector("#gradeInputs");
    this.resetButton = document.querySelector("#resetButton");

    this.finalGrade = document.querySelector("#finalGrade");
    this.exerciseGrade = document.querySelector("#exerciseGrade");
    this.examGrade = document.querySelector("#examGrade");
    this.attendanceGrade = document.querySelector("#attendanceGrade");
    this.totalGrade = document.querySelector("#totalGrade");
    this.formula = document.querySelector("#formula");
    this.messages = document.querySelector("#messages");
  }

  renderInputs(exercises) {
    const exerciseInputs = exercises.map((exercise, index) => {
      return this.createPointInput({
        label: exercise.name,
        helpText: "Übungspunkte",
        type: "exercise",
        index
      });
    });

    const examInput = this.createPointInput({
      label: "Prüfungsnote",
      helpText: "Punkte der Prüfung",
      type: "exam"
    });

    const attendanceInput = this.createPointInput({
      label: "Anwesenheit",
      helpText: "Mindestens 80%",
      type: "attendance"
    });

    this.gradeInputs.replaceChildren(
      ...exerciseInputs,
      examInput,
      attendanceInput
    );
  }

  createPointInput({ label, helpText, type, index = "" }) {
    const wrapper = document.createElement("article");
    wrapper.className = "input-card";

    if (type === "exercise") {
      wrapper.dataset.exerciseIndex = String(index);
    }

    const inputId = `${type}-${index}`;

    wrapper.innerHTML = `
      <div class="input-info">
        <label for="${inputId}">${label}</label>
        <span>${helpText}</span>
      </div>

      <input
        id="${inputId}"
        type="number"
        min="0"
        max="100"
        value="0"
        data-grade-input
        data-type="${type}"
        ${type === "exercise" ? `data-index="${index}"` : ""}
      />
    `;

    return wrapper;
  }

  bindInputChanges(handler) {
    this.gradeInputs.addEventListener("input", (event) => {
      const input = event.target.closest("[data-grade-input]");

      if (!input) {
        return;
      }

      handler({
        type: input.dataset.type,
        index: input.dataset.index === undefined ? null : Number(input.dataset.index),
        value: Number(input.value)
      });
    });
  }

  bindReset(handler) {
    this.resetButton.addEventListener("click", handler);
  }

  resetInputs() {
    const inputs = this.gradeInputs.querySelectorAll("[data-grade-input]");

    inputs.forEach((input) => {
      input.value = "0";
    });
  }

  renderResults(result) {
    this.highlightExercises(result);
    this.highlightExamAndAttendance(result);

    this.exerciseGrade.textContent = `${this.format(result.exerciseGrade.percent)}%`;
    this.examGrade.textContent = `${this.format(result.examPercent)}%`;
    this.attendanceGrade.textContent = `${this.format(result.attendancePercent)}%`;
    this.totalGrade.textContent = `${this.format(result.totalPercent)}%`;

    this.finalGrade.textContent = result.gradeText;
    this.finalGrade.classList.toggle("fail", !result.isPositive);

    this.renderFormula(result);
    this.renderMessages(result);
  }

  highlightNegativeResult(element, shouldHighlight) {
    element.classList.toggle("negative", shouldHighlight);
  }

  highlightDroppedResult(element, shouldHighlight) {
    element.classList.toggle("dropped", shouldHighlight);
  }

  highlightExercises(result) {
    const cards = this.gradeInputs.querySelectorAll("[data-exercise-index]");

    cards.forEach((card, index) => {
      const exercise = result.exercises[index];
      const helpText = card.querySelector(".input-info span");

      const isDropped = index === result.exerciseGrade.droppedIndex;
      const isNegative = exercise.points <= 50;

      this.highlightDroppedResult(card, isDropped);
      this.highlightNegativeResult(card, isNegative && !isDropped);

      if (isDropped) {
        helpText.textContent = "Streichergebnis";
      } else if (isNegative) {
        helpText.textContent = "Negativ";
      } else {
        helpText.textContent = "Positiv";
      }
    });
  }

  highlightExamAndAttendance(result) {
    const examInput = this.gradeInputs.querySelector("[data-type='exam']");
    const attendanceInput = this.gradeInputs.querySelector("[data-type='attendance']");

    const examCard = examInput.closest(".input-card");
    const attendanceCard = attendanceInput.closest(".input-card");

    this.highlightNegativeResult(examCard, result.examPercent <= 50);
    this.highlightNegativeResult(attendanceCard, result.attendancePercent < 80);
  }

  renderFormula(result) {
    const exerciseClass = result.exerciseGrade.isPositive ? "good" : "bad";
    const examClass = result.examPercent > 50 ? "good" : "bad";

    this.formula.innerHTML = `
      Gesamt =
      <span class="${exerciseClass}">
        ${this.format(result.exerciseGrade.percent)} × 0,6
      </span>
      +
      <span class="${examClass}">
        ${this.format(result.examPercent)} × 0,4
      </span>
      =
      <strong>${this.format(result.totalPercent)}%</strong>
    `;
  }

  renderMessages(result) {
    if (result.reasons.length === 0) {
      this.messages.innerHTML = `
        <div class="message success">
          Positiv: Übungen, Prüfung und Anwesenheit erfüllen alle Anforderungen.
        </div>
      `;
      return;
    }

    this.messages.innerHTML = result.reasons
      .map((reason) => `<div class="message">${reason}</div>`)
      .join("");
  }

  format(value) {
    return Number(value).toFixed(1).replace(".0", "");
  }
}