const fs = require('fs');
const path = '../frontend/src/data/departments/cse.js';
let content = fs.readFileSync(path, 'utf8');

const firstItems = `[
              {
                      "id": 1,
                      "title": "A Machine Learning-Based Video Compression for Effective Video Encoding and Transmission",
                      "author": "Abrar Ahmed Katiyan",
                      "journal": "Journal of Machine and Computing",
                      "year": "2025"
              },
              {
                      "id": 2,
                      "title": "Analysis of Android Malware Detection Using Machine Learning Techniques",
                      "author": "K. Abrar Ahmed",
                      "journal": "International Conference on Electronics, Engineering Physics, and Earth Science",
                      "year": "2024"
              },
              {
                      "id": 3,
                      "title": "Mathematical Modeling and Computational Tools for Efficient Water Resource Management: Optimizing Allocation and Sustainability",
                      "author": "Dr. K. Abrar Ahmed",
                      "journal": "Journal of Neonatal Surgery, 14(10S): 683-695",
                      "year": "2025"
              },
              {
                      "id": 4,
                      "title": "A Review on Impacts of Machine Learning in Diverse Fields",
                      "author": "T. Balaji, M. Abdulnaseer",
                      "journal": "AIP Conference Proceedings, Vol. 2935, 020014",
                      "year": "2024"
              },
              {
                      "id": 5,
                      "title": "Anticipating Groundwater Depletion for Water Scarcity Alleviation through Advanced Deep Learning Models",
                      "author": "Dr. Abrar Ahmed K. & Dr. Inamul Hussain R. Z.",
                      "journal": "IRO Journal on Sustainable Wireless Systems",
                      "year": "2023"
              },
              {
                      "id": 6,
                      "title": "Bipolar Alternate Mark Inversion Encoding (BAMI) Scheme for Performance Signature of Optical Transceiver Systems under Thermal Effects",
                      "author": "Mrs. Revathi P",
                      "journal": "Journal of Optical Communications",
                      "year": "2023"
              },
              {
                      "id": 7,
                      "title": "Enhancement of Health System for Emergency Care Using IoT Technique",
                      "author": "Dr. K. Lokeshwaran & Dr. K. Abrar Ahmed",
                      "journal": "International Journal of Early Childhood Special Education (INT-JECSE), Vol. 14, Issue 05",
                      "year": "2022"
              },
              {
                      "id": 8,
                      "author": "R.Vaishnavi, C.Koteeswaran and Sheik Faritha Begum",
                      "title": "Mining and Observation Human Motion Styles in Domestic-Based Health Commentary System",
                      "journal": "Journal Of Computational And Theoretical Nanoscience ISSN: 0974-5572 Vol. 15 2341-2345, 2018, Scopus Indexed (Sjr: 0.22).",
                      "year": "2018-2019"
              },`;

const marker = 'internationalJournal: [';
const idx = content.indexOf(marker);
if (idx !== -1) {
  // Find where item 9 starts
  const nextItemIdx = content.indexOf('{"id": 9', idx) !== -1 ? content.indexOf('{"id": 9', idx) : content.indexOf('{\n                      "id": 9', idx);
  if (nextItemIdx !== -1) {
    const newContent = content.substring(0, idx + marker.length) + '\n' + firstItems.substring(1) + '\n' + content.substring(nextItemIdx);
    fs.writeFileSync(path, newContent);
    console.log("Fixed successfully");
  } else {
    console.log("Could not find id 9");
  }
} else {
  console.log("Could not find marker");
}
