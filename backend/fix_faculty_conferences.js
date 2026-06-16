const fs = require('fs');

const path = '../frontend/src/data/departments/cse.js';
let content = fs.readFileSync(path, 'utf8');

const intConf = [
  {
    "id": 1,
    "title": "A Review on Impacts of Machine Learning in Diverse Fields",
    "author": "Abdulnaseer M and T Balaji",
    "conference": "International Conference on Artificial Intelligence Systems for Sustainable Solutions (AIS3 2023)",
    "location": "CAHCET",
    "year": "2023",
    "description": "Presented at AIS3 2023, CAHCET in January 2023."
  },
  {
    "id": 2,
    "title": "A Robust and Fast Symmetric Text Encryption Algorithm Based on Fermat's Two Squares Theorem",
    "author": "P. Revathi",
    "conference": "International Conference on Recent Advances in Electrical, Electronics, Ubiquitous Communication, and Computational Intelligence (RAEEUCCI)",
    "location": "CAHCET",
    "year": "2023",
    "description": "Presented at RAEEUCCI, CAHCET in April 2023."
  },
  {
    "id": 3,
    "title": "Voting system using BlockChain",
    "author": "Dr. Inamul Hussain R Z",
    "conference": "4th International Conference on Technology and Advancement in computing Application (ICTACA 24)",
    "location": "",
    "year": "2024",
    "description": "Presented in ICTACA 24."
  },
  {
    "id": 4,
    "title": "Crowd Funding using BlockChain and Third Web Technology",
    "author": "Dr. Inamul Hussain R Z",
    "conference": "4th International Conference on Technology and Advancement in computing Application (ICTACA 24)",
    "location": "",
    "year": "2024",
    "description": "Presented in ICTACA 24."
  }
];

const natConf = [
  {
    "id": 1,
    "title": "Prediction of Groundwater Level to Improve Water Scarcity Using Deep Learning Algorithm",
    "author": "Dr. Inamul Hussain R Z and Dr. Abrar Ahmed K",
    "conference": "National Conference on Recent Trends in Artificial Intelligence and Soft Computing",
    "location": "Bannari Amman Institute of Technology",
    "year": "2024",
    "description": "Presented in January 2024."
  },
  {
    "id": 2,
    "title": "FRD: FRAGMENTATION AND REPLICATION OF DATA OVER MULTI-CLOUDS WITH OPTIMIST PERFORMANCE AND SECURITY",
    "author": "Mr. R. Sugumar",
    "conference": "National Conference on Emerging Trends in Science, Engineering and Technology",
    "location": "NTET, Coimbatore",
    "year": "2016",
    "description": "Presented on 4 March 2016."
  },
  {
    "id": 3,
    "title": "SECURED PUBLIC AUDITING SCHEME FOR REGENERATING CODE BASED CLOUD STORAGES",
    "author": "Mr. R. Sugumar",
    "conference": "National Conference on Recent Trends in Computer Technology NCRTCT’ 16",
    "location": "Sri Balaji Chockalingam Engineering College",
    "year": "2016",
    "description": "Presented on 18 March 2016."
  }
];

const journals = JSON.parse(fs.readFileSync('parsed_journals.json', 'utf8'));
let trainings = JSON.parse(fs.readFileSync('parsed_trainings.json', 'utf8'));

// Fix trainingProgram to have 'year' so the table filter works properly.
trainings = trainings.map(t => {
  return { ...t, year: t.date ? t.date.replace(/[^0-9- ]/g, '') : 'Unknown Year' };
});

const cocur = JSON.parse(fs.readFileSync('parsed_student_cocur.json', 'utf8'));
const extracur = JSON.parse(fs.readFileSync('parsed_student_extracur.json', 'utf8'));
const internship = JSON.parse(fs.readFileSync('parsed_internship.json', 'utf8'));
const mooc = JSON.parse(fs.readFileSync('mooc_parsed.json', 'utf8'));

const achievementsData = {
  faculty: {
    internationalJournal: journals,
    internationalConference: intConf,
    nationalConference: natConf,
    trainingProgram: trainings
  },
  student: {
    coCurricular: cocur,
    extraCurricular: extracur,
    internship: internship,
    mooc: mooc
  }
};

const newAchievementsDataStr = 'achievementsData: ' + JSON.stringify(achievementsData, null, 4).replace(/\n/g, '\n  ') + ',\n    ';
const startIdx = content.indexOf('achievementsData: {');
const endIdx = content.indexOf('galleryData: [');
content = content.substring(0, startIdx) + newAchievementsDataStr + content.substring(endIdx);
fs.writeFileSync(path, content);
console.log('Fixed faculty conferences and trainingProgram year');
