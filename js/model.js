class GradeModel extends EventTarget {
  constructor() {
    super();

    this.maxPoints = 100;
    this.positiveLimit = 50;
    this.exerciseWeight = 0.6;
    this.examWeight = 0.4;
    this.attendanceMinimum = 80;

    this.exercises = [
      { name: "01-BMI", points: 0 },
      { name: "02-DR.DOM", points: 0 },
      { name: "03-KEVIN-COSTINGER", points: 0 },
      { name: "04-BACK-TO-THE-FUTURE", points: 0 },
      { name: "05-CONNECT-FOUR", points: 0 },
      { name: "06-GRADER-3000", points: 0 }
    ];

    this.examPoints = 0;
    this.attendancePercent = 0;
  }

  setExercisePoints(index, points) {
    if (index < 0 || index >= this.exercises.length) {
      return;
    }

    this.exercises[index].points = this.sanitize(points);
    this.notifyChange();
  }

  setExamPoints(points) {
    this.examPoints = this.sanitize(points);
    this.notifyChange();
  }

  setAttendance(percent) {
    this.attendancePercent = this.sanitize(percent);
    this.notifyChange();
  }

  reset() {
    this.exercises.forEach((exercise) => {
      exercise.points = 0;
    });

    this.examPoints = 0;
    this.attendancePercent = 0;

    this.notifyChange();
  }

  isPositive(points) {
    return points > this.positiveLimit;
  }

  calculateExerciseGrade() {
    const droppedIndex = this.getDroppedExerciseIndex();

    const countedExercises = this.exercises.filter((exercise, index) => {
      return index !== droppedIndex;
    });

    const earnedPoints = countedExercises.reduce((sum, exercise) => {
      return sum + exercise.points;
    }, 0);

    const maxPoints = countedExercises.length * this.maxPoints;
    const percent = maxPoints === 0 ? 0 : (earnedPoints / maxPoints) * 100;

    const positiveExerciseCount = this.exercises.filter((exercise) => {
      return this.isPositive(exercise.points);
    }).length;

    const requiredPositiveCount = Math.ceil(this.exercises.length * 0.75);

    return {
      percent,
      droppedIndex,
      positiveExerciseCount,
      requiredPositiveCount,
      isPositive:
        this.isPositive(percent) &&
        positiveExerciseCount >= requiredPositiveCount
    };
  }

  calculateFinalGrade() {
    const exerciseGrade = this.calculateExerciseGrade();

    const weightedExercise = exerciseGrade.percent * this.exerciseWeight;
    const weightedExam = this.examPoints * this.examWeight;
    const totalPercent = weightedExercise + weightedExam;

    const examIsPositive = this.isPositive(this.examPoints);
    const attendanceIsEnough = this.attendancePercent >= this.attendanceMinimum;

    const reasons = [];

    if (!exerciseGrade.isPositive) {
      reasons.push(
        `Übungen negativ: mindestens ${exerciseGrade.requiredPositiveCount} Übungen müssen positiv sein und die Übungsnote muss über 50% liegen.`
      );
    }

    if (!examIsPositive) {
      reasons.push("Prüfungsnote ist negativ, weil sie nicht über 50% liegt.");
    }

    if (!attendanceIsEnough) {
      reasons.push("Anwesenheit ist zu niedrig. Mindestens 80% sind notwendig.");
    }

    const isPositive =
      exerciseGrade.isPositive &&
      examIsPositive &&
      attendanceIsEnough;

    return {
      exercises: this.exercises.map((exercise) => ({ ...exercise })),
      examPercent: this.examPoints,
      attendancePercent: this.attendancePercent,
      exerciseGrade,
      weightedExercise,
      weightedExam,
      totalPercent,
      isPositive,
      gradeText: isPositive ? this.getGradeText(totalPercent) : "Nicht Genügend",
      reasons
    };
  }

  getDroppedExerciseIndex() {
    let lowestIndex = 0;

    this.exercises.forEach((exercise, index) => {
      if (exercise.points < this.exercises[lowestIndex].points) {
        lowestIndex = index;
      }
    });

    return lowestIndex;
  }

  getGradeText(percent) {
    if (percent <= 50) {
      return "Nicht Genügend";
    }

    if (percent <= 61) {
      return "Genügend";
    }

    if (percent <= 74) {
      return "Befriedigend";
    }

    if (percent <= 86) {
      return "Gut";
    }

    return "Sehr gut";
  }

  sanitize(value) {
    const numberValue = Number(value);

    if (Number.isNaN(numberValue)) {
      return 0;
    }

    return Math.min(this.maxPoints, Math.max(0, numberValue));
  }

  notifyChange() {
    this.dispatchEvent(
      new CustomEvent("gradechange", {
        detail: this.calculateFinalGrade()
      })
    );
  }
}