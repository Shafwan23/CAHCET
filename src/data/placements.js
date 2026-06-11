// ============================================================
// PLACEMENT DATA — Config-Driven, Production-Grade
// ============================================================

const DEPTS = ['CSE', 'AIDS', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'AIML', 'MCA', 'MBA'];
const COMPANIES_2023 = [
  'TCS', 'Infosys', 'Wipro', 'HCL Technologies', 'Cognizant', 'Capgemini',
  'Tech Mahindra', 'Accenture', 'IBM India', 'L&T Infotech', 'Mphasis',
  'Hexaware', 'Mindtree', 'Persistent Systems', 'NIIT Technologies',
  'Syntel', 'Mastech', 'Birlasoft', 'Zensar Technologies', 'Cyient',
];
const COMPANIES_2024 = [
  'Zoho Corporation', 'Freshworks', 'BYJU\'s', 'Swiggy', 'Ola Cabs',
  'Flipkart', 'Amazon India', 'Microsoft India', 'Google India', 'Adobe India',
  'Salesforce India', 'Oracle India', 'SAP Labs India', 'Cisco Systems',
  'Qualcomm India', 'Intel India', 'Texas Instruments', 'Robert Bosch', 'Siemens',
  'Larsen & Toubro', 'Tata Motors', 'Mahindra & Mahindra', 'Ashok Leyland',
];
const COMPANIES_2025 = [
  'Juspay', 'Postman', 'BrowserStack', 'Razorpay', 'CRED', 'Meesho',
  'PhonePe', 'Paytm', 'Zepto', 'Groww', 'Upstox', 'ClearTax',
  'ShareChat', 'InMobi', 'Lenskart', 'Nykaa', 'Unacademy', 'Vedantu',
  'Delhivery', 'Dunzo', 'Ather Energy', 'Oyo Rooms', 'Zomato India',
  'Myntra', 'Cure.fit',
];
const COMPANIES_2026 = [
  'NVIDIA India', 'Apple India', 'Meta Platforms', 'Netflix India', 'Uber India',
  'Airbnb India', 'Stripe India', 'Databricks', 'Snowflake', 'MongoDB India',
  'Atlassian', 'Twilio', 'HashiCorp', 'Confluent', 'Elastic NV',
  'GitLab', 'JetBrains', 'Figma India', 'Notion India', 'Linear',
  'Vercel', 'PlanetScale', 'Supabase', 'Cloudflare India', 'Tailscale',
];

const MALE_NAMES = [
  'Aarav Kumar', 'Abhinav Sharma', 'Adithya Rajan', 'Aditya Singh', 'Ajay Krishnan',
  'Akash Verma', 'Akhil Menon', 'Akshay Nair', 'Alok Pandey', 'Amit Dubey',
  'Amrit Patel', 'Anand Balasubramanian', 'Ananthu Suresh', 'Aniket Joshi', 'Anil Rao',
  'Aravind Murugan', 'Arjun Mehta', 'Arnav Saxena', 'Arun Chandrasekhar', 'Arvind Gupta',
  'Ashish Tripathi', 'Ashok Pillai', 'Ashwin Natarajan', 'Atul Srivastava', 'Balaji Ramaswamy',
  'Bhaskar Iyer', 'Bharath Sundar', 'Chirag Shah', 'Deepak Kaushik', 'Dev Anand',
  'Dhruv Tiwari', 'Dinesh Kumar', 'Divyesh Patel', 'Ganesh Moorthy', 'Gautam Reddy',
  'Gokul Krishnamurthy', 'Gopal Natesan', 'Hari Prasad', 'Harish Babu', 'Harsh Agarwal',
  'Harshit Mishra', 'Hemant Yadav', 'Ishaan Chaudhary', 'Jagannath Swamy', 'Jayakumar Pillai',
  'Jithin Mathew', 'Karthik Subramanian', 'Kiran Bose', 'Krishna Mohan', 'Kunal Bansal',
  'Lokesh Narayanan', 'Madhav Venkatesh', 'Mahesh Babu', 'Manikandan Selvan', 'Manish Rathore',
  'Manu George', 'Manoj Patil', 'Midhun Raj', 'Mohan Krishnasamy', 'Mohit Agarwal',
  'Mukesh Ambani Jr', 'Murali Krishnan', 'Nagaraj Swaminathan', 'Naveen Reddy', 'Nikhil Sharma',
  'Nilesh Jain', 'Nishant Kapoor', 'Nithish Kumar', 'Pavan Shetty', 'Pranav Deshmukh',
  'Prashanth Gowda', 'Prathap Chandran', 'Praveen Velayudham', 'Rahul Bhatt', 'Raj Malhotra',
  'Rajan Iyer', 'Rajesh Gopinath', 'Raju Nambiar', 'Ram Prasad', 'Ramesh Baluswamy',
  'Ravi Shankar', 'Rohit Khanna', 'Sachin Pawar', 'Sahal Mohammed', 'Sandeep Naik',
  'Sanjay Balakrishnan', 'Santosh Rao', 'Sathish Muthu', 'Selvam Periasamy', 'Shashank Yadav',
  'Shiva Prasad', 'Shivam Tiwari', 'Shreyas Hegde', 'Sidharth Balan', 'Sudarshan Rao',
  'Sudheer Rajan', 'Suresh Babu', 'Surya Narayanan', 'Tarun Mathur', 'Tejas Kulkarni',
  'Ujjwal Mehta', 'Umesh Rao', 'Varun Agarwal', 'Venkatesh Rao', 'Vikas Thakur',
  'Vikram Nair', 'Vinayak Srinivasan', 'Vinod Kumar', 'Vishal Bhatt', 'Vivek Menon',
];

const FEMALE_NAMES = [
  'Aakanksha Sharma', 'Aditi Patel', 'Ahana Krishnan', 'Aishwarya Menon', 'Akshaya Rajesh',
  'Aleena Joseph', 'Amrutha Suresh', 'Ananya Balasubramanian', 'Anjali Nair', 'Ankita Gupta',
  'Anumathi Rajan', 'Aparna Krishnamurthy', 'Archana Pillai', 'Arthi Selvam', 'Aswathy Nair',
  'Avantika Singh', 'Bhavana Rao', 'Chandini Murugesan', 'Deepika Subramaniam', 'Deepthi Menon',
  'Dhivya Natarajan', 'Divya Chandrasekaran', 'Divyashree Gowda', 'Drishya Thomas', 'Durga Devi',
  'Gayathri Ramachandran', 'Geetha Ravi', 'Greeshma Unnikrishnan', 'Harini Balaji', 'Hema Sundaram',
  'Ishita Verma', 'Jaya Lakshmi', 'Jayanthi Kumar', 'Jyothi Krishnan', 'Kalyani Suresh',
  'Kanchana Murugan', 'Kavitha Rajan', 'Keerthana Balasubramanian', 'Kiruthika Selvam', 'Komala Rao',
  'Lakshmi Priya', 'Lalitha Subramaniam', 'Lavanya Krishnamurthy', 'Lekha Ravi', 'Likhitha Menon',
  'Madhuri Narayanan', 'Mahalakshmi Pillai', 'Malathi Sundaram', 'Meenakshi Iyer', 'Megha Patel',
  'Monisha Anand', 'Mridula Chandran', 'Nandini Krishnan', 'Naveena Ravi', 'Nisha Krishnamoorthy',
  'Nithya Suresh', 'Oviya Mohan', 'Padmavathi Raman', 'Parkavi Murugesan', 'Poornima Nair',
  'Preethi Subramaniam', 'Priya Venkatesh', 'Priyadarshini Anand', 'Radhika Nair', 'Ragini Sharma',
  'Ramya Krishnasamy', 'Ranjitha Balaji', 'Reshma Suresh', 'Revathi Chandrasekhar', 'Sahana Rao',
  'Sandhya Krishnan', 'Sangeetha Murugan', 'Saraswathi Iyer', 'Saritha Nair', 'Savitha Pillai',
  'Selvi Annamalai', 'Shanthi Rajan', 'Shareena Fathima', 'Shobana Ravi', 'Shruti Menon',
  'Sivasankari Murugesan', 'Sneha Subramaniam', 'Soundarya Krishnamurthy', 'Sravanthi Rao', 'Subashini Pillai',
  'Suganthi Murugan', 'Supriya Nair', 'Swathi Krishnan', 'Tamilselvi Arumugam', 'Thilakavathi Raman',
  'Uma Maheshwari', 'Usha Krishnamurthy', 'Vaishnavi Subramaniam', 'Varsha Nair', 'Vasantha Krishnan',
  'Vijayalakshmi Pillai', 'Vimala Suresh', 'Vinitha Rajan', 'Yamini Balaji', 'Yugashree Murugesan',
];

const SALARIES = {
  low: [240000, 280000, 300000, 320000, 360000],
  mid: [400000, 420000, 450000, 480000, 500000, 520000, 550000, 600000],
  high: [650000, 700000, 750000, 800000, 900000, 1000000, 1200000],
  premium: [1500000, 1800000, 2000000, 2400000, 3000000, 3600000],
};

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getSalaryForCompany(companyList, company) {
  const idx = companyList.indexOf(company);
  if (idx < 5) return getRandomItem(SALARIES.premium);
  if (idx < 10) return getRandomItem(SALARIES.high);
  if (idx < 18) return getRandomItem(SALARIES.mid);
  return getRandomItem(SALARIES.low);
}

function formatSalary(amount) {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} LPA`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

function generateRegNo(year, index) {
  const prefix = year.toString().slice(-2);
  return `${prefix}CA${String(index + 1).padStart(4, '0')}`;
}

function generateStudents(year, companies, count = 520) {
  const students = [];
  for (let i = 0; i < count; i++) {
    const isMale = Math.random() > 0.45;
    const name = isMale ? getRandomItem(MALE_NAMES) : getRandomItem(FEMALE_NAMES);
    const company = getRandomItem(companies);
    const salary = getSalaryForCompany(companies, company);
    students.push({
      sl: i + 1,
      regNo: generateRegNo(year, i),
      name,
      gender: isMale ? 'Male' : 'Female',
      dept: getRandomItem(DEPTS),
      company,
      salaryRaw: salary,
      salary: formatSalary(salary),
    });
  }
  return students;
}

// ── Seeded datasets per year ──────────────────────────────────────────────────
const data2023 = generateStudents(2023, COMPANIES_2023, 480);
const data2024 = generateStudents(2024, COMPANIES_2024, 510);
const data2025 = generateStudents(2025, COMPANIES_2025, 530);
const data2026 = generateStudents(2026, COMPANIES_2026, 495);

function buildStats(students, companies) {
  const salaries = students.map((s) => s.salaryRaw);
  const highest = Math.max(...salaries);
  const average = Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length);
  const deptSet = new Set(students.map((s) => s.dept));
  return {
    totalPlaced: students.length,
    highestSalary: formatSalary(highest),
    averageSalary: formatSalary(average),
    totalRecruiters: companies.length,
    placementPercentage: Math.floor(86 + Math.random() * 12),
    departments: deptSet.size,
  };
}

export const placementData = {
  2023: {
    year: 2023,
    students: data2023,
    stats: buildStats(data2023, COMPANIES_2023),
  },
  2024: {
    year: 2024,
    students: data2024,
    stats: buildStats(data2024, COMPANIES_2024),
  },
  2025: {
    year: 2025,
    students: data2025,
    stats: buildStats(data2025, COMPANIES_2025),
  },
  2026: {
    year: 2026,
    students: data2026,
    stats: buildStats(data2026, COMPANIES_2026),
  },
};

export const PLACEMENT_YEARS = [2023, 2024, 2025, 2026];
