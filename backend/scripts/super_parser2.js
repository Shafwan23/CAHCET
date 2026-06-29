const fs = require('fs');
const msgs = fs.readFileSync('all_user_msgs.txt', 'utf8').split('====================');

let cocur = '';
let extracur = '';
let internship = '';
let mooc = '';

for (const msg of msgs) {
    if (msg.includes("in students co curricular achievements add")) cocur = msg;
    if (msg.includes("in extra curricular achievements add")) extracur = msg;
    if (msg.includes("this is the data of internship")) internship = msg;
    if (msg.includes("add mooc course details , fields are")) mooc = msg;
}

fs.writeFileSync('full_cocur.txt', cocur);
fs.writeFileSync('full_extracur.txt', extracur);
fs.writeFileSync('full_internship.txt', internship);
fs.writeFileSync('full_mooc.txt', mooc);

console.log('Done splitting second batch!');
