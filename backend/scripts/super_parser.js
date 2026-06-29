const fs = require('fs');
const msgs = fs.readFileSync('all_user_msgs.txt', 'utf8').split('====================');

let journals = '';
let intConf = '';
let natConf = '';
let trainings = '';
let cocur = '';
let extracur = '';
let internship = '';
let mooc = '';

for (const msg of msgs) {
    if (msg.includes('this is the data of international journal')) journals = msg;
    if (msg.includes("there are 5 'Abdulnaseer M and T Balaji")) intConf = msg;
    if (msg.includes("this is national conference 'Dr. Inamul Hussain")) natConf = msg;
    if (msg.includes("this is the data of faculty training program")) trainings = msg;
    if (msg.includes("this is co curricular data 'Academic Year")) cocur = msg;
    if (msg.includes("this is extra curricular 'Academic Year")) extracur = msg;
    if (msg.includes("this is the data of internship")) internship = msg;
    if (msg.includes("add mooc course details , fields are")) mooc = msg;
}

fs.writeFileSync('full_journals.txt', journals);
fs.writeFileSync('full_intConf.txt', intConf);
fs.writeFileSync('full_natConf.txt', natConf);
fs.writeFileSync('full_trainings.txt', trainings);
fs.writeFileSync('full_cocur.txt', cocur);
fs.writeFileSync('full_extracur.txt', extracur);
fs.writeFileSync('full_internship.txt', internship);
fs.writeFileSync('full_mooc.txt', mooc);

console.log('Done splitting!');
