const fs = require('fs');
const path = require('path');

const text = `
PLACEMENT CELL ACTIVITIES DURING THE ACADEMIC YEAR 2025-2026

An orientation session on placement training was conducted on 19th August 2025 for final-year (2026 batch) students of CSE, IT, AIDS, ECE, and MCA branches at the EEE Block Seminar Hall. Mr. Deepak Karri, an alumnus of IIT Madras from Smart Training Resources India Pvt. Ltd., was the resource person.

A campus drive was conducted by M/s. QSpiders—A Unit of Test Yantra Software Solutions for final-year students of CSE, IT, ECE, EEE, MECH, and MCA, facilitated by Ms. S. Deeksha (HR), on 20.08.2025. A total of 29 students were selected.

A program on employability skills was conducted on 21st August 2025 for final-year (2026 batch) students of CSE, IT, AIDS, ECE, and MCA branches at the EEE Block Seminar Hall. Mr. Narayanan, senior manager from Ethnus Consultancy Services, was the resource person.

A training program on “How to Prepare for Interviews” by M/s. SMART Training Resources was held on 30th August 2025 (Saturday), from 11:00 a.m. to 12:40 p.m., for final-year students of CSE, IT, AIDS, ECE, and MCA branches. Mr. Deepak Karri, an alumnus of IIT Madras, was the resource person.

An online incubation drive was conducted by M/s. Pentagon Space for final-year students of all UG branches and MCA on 09.09.2025. A total of 9 students were selected.

The Placement Cell of CAHCET, in collaboration with the Departments of CSE, IT, AIDS, and MCA, organized a multi-session Workshop on Agentic AI, aimed at equipping students with insights into the next generation of autonomous and goal-driven artificial intelligence systems. The event was held on 13th September 2025.

On 23rd September 2025, BG Enterprises conducted an online interview at the college placement cell for 17 shortlisted final-year students from CSE, IT, and AIDS departments for the Junior Software Developer role, followed by a final round at their company campus on 25.09.2025. Three students were selected:

A campus drive was conducted by M/s. TCNOM Engineers for final-year students of EEE on 30.09.2025. A total of 7 students were selected.

A campus drive was conducted by M/s. TVS Sundram Fasteners Limited for final-year students of ECE, EEE & MECH on 08.10.2025. A total of 53 students were selected

An Infosys Insider Session was conducted by Ms. P. Keertha and Ms. V. Pooja for final-year women candidates of CSE, IT, ECE, EEE, and AIDS on 14.10.2025.

A campus drive was conducted by M/s. Relevantz Technology Services for ex-final-year students of CSE, IT, and MCA on 23.10.2025. 1 students selected

A campus drive was conducted by M/s. C-Tech Engineering and Constructions for final-year students of AIDS, CIVIL, CSE, IT, and MCA on 24.10.2025. A total of 5 students were selected.

M/s. Infosys Limited conducted a campus drive for final-year female students of CSE, IT, AIDS, and MCA on 03.11.2025 and 04.11.2025, with final interviews on 05.11.2025. The interview was conducted at VIT – Chennai. Two students—KAVIYA J and ELAKIYA K (both CSE)—were selected as systems engineers.

An off-campus drive was conducted by M/s. Zoho Corporation for final-year students of CSE, IT, AIDS, ECE, and MCA on 12.11.2025 and 13.11.2025 at Annai Mira College of Engineering and Technology for the role of Site Reliability Engineer (SRE). One student has been selected from the IT Dept.

A virtual drive was conducted by M/s. Intellipaat Software Solutions Pvt Ltd. for final-year students of AIDS, CSE, IT, EEE, ECE, and MCA on 16.11.2025 & 17.11.2025. A total of 5 students have been selected.

An off-campus drive was conducted by M/s. Zoho Corporation for final-year students of CSE, IT, and AIDS on 27.11.2025 at the Zoho Office at Vellore. Totally two students have been selected. 

A campus recruitment drive was conducted by M/s CSCS Cloud Supply Chain Solutions (CSCS) for final-year students of AIDS, CSE, IT, ECE, and MCA on 08.12.2025. A total of 6 students were selected.

A campus recruitment drive was conducted by M/s Smart Training Resource Pvt. Ltd. for final-year students of AI & DS, CSE, IT, ECE, and MCA on 01.2026. A total of 34 students were selected

A pooled campus recruitment drive was conducted by AMCET through Naan Mudhalvan on 07.01.2026 for final-year students of CSE, IT, EEE, and AI&DS; 2 students were selected.

A virtual drive was conducted by M/s. Foxconn for final-year students of AIDS, CSE, IT, EEE, and ECE on 14.01.2026. A total of 5 students have been selected.

A job fair was conducted by Adhiparasakthi Engineering College on 09.01.26. One student has been selected.

A virtual drive was conducted by M/s. LearnFlu Edutech for final-year students of AIDS, CSE, IT, EEE, and ECE on 21.01.2026. A total of 10 students have been selected.

A campus recruitment drive was conducted by M/s. Chamundi Die Cast Pvt. Ltd. for final-year students of EEE & MECH on 30.01.2026.

An on-site drive was conducted by M/s. Fidobe India IT Solutions Pvt Ltd. for final-year students of IT on 11.02.2026.

A Campus Recruitment Drive was conducted by M/s. Test Series Pro for all UG/PG courses on 18.02.2026.

A campus recruitment drive was conducted by M/s. Adz4needz for the IT department on 19.02.2026.

An On-Site Drive was conducted by M/s. Least Action Pvt. Ltd. for final-year students of IT on 20.02.2026.

A campus recruitment drive was conducted by M/s. HTL Limited for all UG branches on 26.03.2026.

A campus recruitment drive was conducted by M/s. Hashed In Technologies by Deloitte for the B.Tech-IT department on 26.03.2026.

A campus recruitment drive was conducted by M/s. TATA Electronics and Solutions (P) Ltd. for all UG branches on 06.04.2026.

A Campus Recruitment Drive was conducted by M/s. LG Balakrishan & Bros  (P) Ltd., for CSE, IT, AI&DS, ECE, EEE & MECH branches on 10.04.2026

11.04.2026—an on-site recruitment drive by M/s. Tata Consultancy Services: 1 student selected.

An on-site recruitment drive by M/s. Tykhe Software Pvt. Ltd. on 28.03.2026: 1 student selected from AI&DS.

Placement Day for the 2026 Batch was conducted on 30.04.2026 at C. Abdul Hakeem College of Engineering & Technology. During the event, offer letters were formally handed over to the selected candidates through their parents, making it a proud and memorable milestone in their academic journey. The highest package offered for the 2026 batch was 5.6 LPA.

A Campus Recruitment Drive was conducted by M/s. OTOMATIKS ROBOTICS ACADEMY  for CSE, IT, AI&DS, ECE, EEE, MECH, MCA & MBA branches on 06.05.2026

Tata Consultancy Services conducted an on-site recruitment drive, in which ABUBAKKAR SIDDIQ N from the IT Department secured the highest package of 7.5 LPA.

PLACEMENT CELL ACTIVITIES DURING THE ACADEMIC YEAR 2024-2025

A Career Guidance Program On “Transformation from Student to Industry Ready” was conducted By M/s. SKAIT IT Education Chennai for the final year Students of CSE, IT & ECE branches on 23.08.2024. Mr. Arun Kumar.P. – S/M & Operations Head, was the resource person.

An online Incubation Drive was conducted by M/s. Pentagon Space – Chennai (Ms. Kajal – Senior Campus Hiring Associate) for the final year students of CSE, IT, ECE, EEE & MCA courses on 04.09.2024.

An online Incubation Drive was conducted by M/s. MCoreta –Bengalore (represented by Mr. Prem Kumar D. HR & Team) for the final year students of ECE & EEE – on 30.09.24.

An online Incubation Drive was conducted by M/s. Qspiders –Bengalore (represented by Ms. K. Manjula – Business Developer) for all UG & MCA courses of – 2025 Batch on 05.10.24. Totally 31 were selected.

A Campus Interview was conducted by M/s. Logskim Solution Pvt Ltd., for their clients M/s. Mitsuba India Pvt Ltd., & M/s. ZF Commercial Vehicle Control Systems India Pvt Ltd.,   for EEE, ECE & MECH branches of – 2025 Batch on 08.11.24. Totally 27 were selected.

A Campus Interview was conducted by M/s. TCNOM Engineers Pvt Ltd., for EEE branch of 2025 Batch on 16.12.2024. Totally 05 were selected.

A Pooled Campus Interview was conducted by M/s. Tech Mahindra through TNSLPP for the final year students of CSE, IT, ECE & MCA @ Sree Sai Ram Engineering College Chennai on 14.12.2024. Totally 02 were selected.

A Pooled Campus Interview was conducted by M/s. Ebbed UR through TNSLPP for the final year students of CSE, IT, & ECE branches of batch 2025 @ MNM Jain Engineering College Chennai on 09.01.2025. 

A Pooled Campus Interview was conducted by M/s. Infosys Pvt Ltd., through TNSLPP final year CSE, IT, ECE & EEE for the batch 2025 @ Velammal Engineering College on 17 & 18 .01.2025. One of our student was selected from CSE branch.  

A Virtual Drive was conducted by M/s. Movate Technologies Pvt Ltd., for the final year students of CSE, IT, ECE, & MCA on 20 .01.2025. Totally 02 were selected.  

As a Part of the Virtual Drive, an online aptitude test was conducted by M/s. LTIMINDTREE (TNSLPP) for the final year of CSE, IT at Technology Tower on 01 .02.2025.

As a Part of the Virtual Drive, an online aptitude test was conducted by M/s. Elewayte, for the final year students of CSE, IT, ECE, MCA & MBA on 21 .02.2025. Totally 02 were selected.  

A Campus Interview was conducted by M/s. SPK Power Infra Pvt Ltd., for the students of EEE 2025 batch on 04.03.2025. Totally 05 were selected.

A Campus Interview was conducted by M/s. Turbo Energy Pvt Ltd., for ECE, EEE & MECH branches of 2025 Batch on 10.03.2025. Totally 42 were selected.

An Orientation Session for Internship at Cloud Supply Chain Solutions was conducted on 13th March 2025  for the final year students of CSE, IT, EEE, ECE & MCA branches at EEE – Block Seminar Hall. M

PLACEMENT CELL ACTIVITIES DURING ACADEMIC YEAR 2023-2024

An 06 days Life-Skills training was conducted by M/s. GTT Foundation – Chennai Sponsored by Barclays from 31.07.23 to 05.08.23 for the final year of CSE, IT, ECE, EEE, MECH, AERO & CIVIL branches. Mr. John Solomon was the resource person. 

A seminar on Overseas Education Guidance And Placement Awareness was conducted by M/s. Osprey Academy Pvt Ltd., Vellore for the 4th final year Students of CSE, IT, ECE & EEE branches on 01.09.2023. Dr. V. Sathish Kumar M. Phil and PhD & Team was the resource person.

A Seminar on Career Guidance was conducted by Mr. Suhail Ahmed.M Program Manager @ Wipro – Chennai for the final year Students of CSE, IT, ECE & EEE branches on 07.09.2023.

A Campus Interview was conducted by M/s. Home First Finance – Vellore (Mr. K. Selva Kumar – HR) for the final year students of MBA – 24 Batch on 13.09.23. Totally 01 candidate have been selected.

A Campus Interview was conducted by M/s. Fudo Jobs – Chennai for their client M/s. Zebronics M/s. Schneider M/s. Stanadyne (Mr. C. Ravi – HR) for the final year students of ECE, EEE & MECH – 24 Batch on 18.10.23. Totally 38 candidate have been selected from ECE, EEE & MECH.

A Seminar on Career Guidance was conducted by Mr. Suhail Ahmed.M Program Manager @ Wipro – Chennai for the first year Students of CSE, IT, ECE, EEE, Civil & AIDA branches on 19.12.2023.

A Virtual Drive was conducted by M/s. Pentagon Space – Chennai (Ms. Kajal – Senior Campus Hiring Associate) for the final year students of CSE, IT, ECE, EEE & MCA – 24 Batch on 08.01.24. Totally 10 candidate have been selected.

A Virtual Drive was conducted by M/s. Technologies Global Pvt Ltd., (Ms. Priya Sathish – Talent Acquisition Executive HR) for the final year students of CSE, IT, ECE, EEE & MCA – 24 Batch on 10.01.24. Totally 06 candidate have been selected.

A Virtual Drive was conducted by M/s. Qspiders Pvt Ltd., (Ms. Jayalakshmi . J– Business Developer) for the final year students of CSE, IT, ECE, EEE & MCA – 24 Batch on 19.01.24. Totally 32 Candidates have been selected.

A Campus Drive was conducted by M/s. Oasis Automation Pvt Ltd., – Bangalore (Mr. S. Mohamed Subair Ali, -HR) for the final year students of ECE & EEE– 24 Batch on 24.01.24. Totally 02 Candidates have been selected.

A seminar on Placement Career Guidance Program was conducted by M/s. Skill Raja – Coimbatore for the 3rd year Students of CSE, IT, ECE & EEE branches on 15.02.2024. Mr. Dinesh Kumar P & Mr. Arun K was the resource person.

A Virtual Drive was conducted by M/s. Terv Pro (Ms. Sarihaa.S– Training Head) for the final year students of CSE, IT, EEE & MCA – 24 Batch on 21.02.24. Totally 03 candidate have been selected.

A Campus Interview was conducted by M/s. S10 Healthcare Pvt Ltd., – Vellore (Mrs. S. Swathi Lakshmi – HR) for the final year students of UG & MCA – 24 Batch on 28.02.24.

A Campus Interview was conducted by M/s. Techveel Pvt Ltd., – Chennai (Ms. Farheen Begum M A- HR) for the final year students of UG & MCA – 24 Batch on 06.03.24. Totally 04 students have been selected.

A Campus Online Drive was conducted by M/s. Crystal Recruitment Solution for all branches of the final years on 18.03.24.

A seminar on Program on “Opportunity to Global Scholarship and Skill Development” was conducted by By M/s. Audacious Dreams Foundation for the 1st year U.G. & MBA Students on 04.05.2024. Mr. Suhail Akhtar Nissar & Team was the resource person.

A Campus (Virtual) Interview was conducted by M/s. Datasensor Qualitas for the final year students of MECH & EEE – 24 Batch on 17.05.24. Totally 03 Students have selected from EEE Dept.  

A Campus Interview was conducted by M/s. Otomatiks – Bangalore for the final year students of UG & MCA – 24 Batch on 21.05.24. Totally 02 Students have selected from IT Dept. 

A Campus Interview was conducted by M/s. TCNOM Engineers – Chennai for the final year students of EEE & ECE – 24 Batch on 30.05.24. Totally 12 Students have selected from EEE & ECE Dept. 

A Virtual Drive was conducted by M/s. TCS for the final year students of CSE, IT, EEE & MCA – 24 Batch on 12.06.24. Totally 03 candidate have been selected.
`;

const lines = text.split('\\n');
let currentYear = null;
const activitiesByYear = {};

lines.forEach(line => {
  const trimmed = line.trim();
  if (!trimmed) return;
  
  const yearMatch = trimmed.match(/ACADEMIC YEAR (\\d{4}-\\d{4})/i);
  if (yearMatch) {
    currentYear = yearMatch[1];
    activitiesByYear[currentYear] = [];
  } else if (currentYear) {
    activitiesByYear[currentYear].push(trimmed);
  }
});

const outputData = Object.keys(activitiesByYear).map(year => ({
  year,
  label: 'AY ' + year.replace('-', '–'),
  activities: activitiesByYear[year]
}));

const filePath = path.join(__dirname, 'frontend/src/data/recruiters.js');
let fileContent = fs.readFileSync(filePath, 'utf8');

const replacement = 'export const placementActivities = ' + JSON.stringify(outputData, null, 2) + ';\\n';

fileContent = fileContent.replace(/export const placementActivities = \\[\\s\\S]*?\\];\\n?/, replacement);

fs.writeFileSync(filePath, fileContent);
console.log('Done!');
