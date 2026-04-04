export function getLetterGrade(grade: number) {
  if (grade >= 80 && grade <= 100) return "A";
  if (grade >= 73 && grade < 80) return "B+";
  if (grade >= 67 && grade < 73) return "B";
  if (grade >= 61 && grade < 67) return "C+";
  if (grade >= 55 && grade < 61) return "C";
  if (grade >= 41 && grade < 55) return "D";
  return "E";
}
