const fs = require('fs');

const path = '../frontend/src/data/departments/cse.js';
let content = fs.readFileSync(path, 'utf8');

const journals = JSON.parse(fs.readFileSync('parsed_journals.json', 'utf8'));
const trainings = JSON.parse(fs.readFileSync('parsed_trainings.json', 'utf8'));
const cocur = JSON.parse(fs.readFileSync('parsed_student_cocur.json', 'utf8'));
const extracur = JSON.parse(fs.readFileSync('parsed_student_extracur.json', 'utf8'));
const internship = JSON.parse(fs.readFileSync('parsed_internship.json', 'utf8'));
const mooc = JSON.parse(fs.readFileSync('mooc_parsed.json', 'utf8'));

const achievementsData = {
  faculty: {
    internationalJournal: journals,
    internationalConference: [],
    nationalConference: [],
    trainingProgram: trainings
  },
  student: {
    coCurricular: cocur,
    extraCurricular: extracur,
    internship: internship,
    mooc: mooc
  }
};

const newAchievementsDataStr = 'achievementsData: ' + JSON.stringify(achievementsData, null, 4).replace(/\n/g, '\n  ') + ',';

const startRegex = /achievementsData:\s*(?:\{|\[)[\s\S]*?(?:},\n\s*galleryData:|],\n\s*galleryData:)/;
content = content.replace(startRegex, newAchievementsDataStr + '\n  galleryData:');

fs.writeFileSync(path, content);
console.log('Successfully injected all achievements data into cse.js');
