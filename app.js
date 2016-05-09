// For this challenge, I have interpreted 'optimal' and 'makes sense' to mean
// that for a given student an ideal tutor would be one who can teach as many
// of the subjects as possible that they need to learn, thus minimizing
// the number of individual tutors required.
//
// I have not optimized this alogrithm to include optimization to minimize
// duplication of tutors across students.  A more complex solution could include
// distributing the tutors as evenly as possible across all students so that
// all tutors are given work.

// Import data
const tutors = require('./tutors');
const students = require('./students');

// Returns those elements of the tutor that are also in the student
// Allows us to know subjects the tutor can teach for a given student
// Compare Students -> Tutors
function matches(student, tutor) {
  return student.subjects.filter((subject) => tutor.subjects.includes(subject));
}

// Returns an array of the subjects that a tutor can't teach a student
// Allows us to know which subjects we still have to find a tutor for
function noMatches(student, tutor) {
  return student.subjects.filter((subject) => !tutor.subjects.includes(subject));
}

// Returns array of tutors that can teach subjects a student needs
function getTutors(student, tutors) {
  debugger;
  return tutors.filter((tutor) => matches(student, tutor).length > 0);
}

// Returns an array of tutors with their subjects filtered based upon student needs
function checkTutors(student, tutors) {
  return tutors.map((tutor) => checkTutor(student, tutor));
}

// Filter an individual tutors subjects based on student needs
function checkTutor(student, tutor) {
  const newTutor = Object.assign({}, tutor);
  newTutor.subjects = matches(student, tutor);
  return newTutor;
}

// Sort tutors based upon how many subjects they can teach
function sortTutors(tutors) {
  return tutors.sort((tut1, tut2) => tut2.subjects.length - tut1.subjects.length );
}

// Find the tutor who is the best fit (can teach the most subjects a student needs)
// Sorts an array of the tutors a student needs according to most subjects they
// can teach and then returns the top item
function bestFit(student, tutors) {
  return sortTutors(checkTutors(student, getTutors(student, tutors)))[0]
}

// Return a copy of the student with only the subjects listed that they
// still need filled
function stillNeeds(student, tutor) {
  const newStudent = Object.assign({}, student);
  newStudent.subjects = noMatches(student, tutor);
  return newStudent;
}

// Get all the tutors a student needs
function matchTutors(student, tutors, matches=[]) {
  const bestMatch = bestFit(student, tutors);

  if(!bestMatch) {
    return matches
  } else {
    matches.push(bestMatch);
    return matchTutors(stillNeeds(student, bestMatch), tutors, matches);
  }
}

// Populate the student with the best tutors
function getStudentsTutors(student, tutors) {
  student.tutors = matchTutors(student, tutors);
  return student;
}

// Run all students against all tutors and match them
function matchStudents(students, tutors) {
  return students.map((student) => getStudentsTutors(student, tutors));
}

// Display a printed list of students and teachers
function print(students) {
  console.log("List of best pairings");
  console.log("*****************************************************");
  console.log(" ");

  students.map((student) => {
    console.log(`For the student ${student.name} the ideal pairings to cover all subjects are: `);
    student.tutors.map((tutor) => console.log(`- ${tutor.name}`));
    console.log("*****************************************************");
    console.log(" ");
  });
}


// Run the program
function init(students, tutors) {
  const matchedStudents = matchStudents(students, tutors);
  print(matchedStudents);

  return matchedStudents;
}

init(students, tutors);
