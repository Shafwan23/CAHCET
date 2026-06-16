const fs = require('fs');
const msgs = fs.readFileSync('all_user_msgs.txt', 'utf8').split('====================');

let internship = '';

for (const msg of msgs) {
    if (msg.includes("data of internship, i want it to be in table format")) internship = msg;
}

fs.writeFileSync('full_internship.txt', internship);

console.log('Done splitting third batch!');
