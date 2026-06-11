// src/services/departmentComparisonService.js

// Mock data model, ready to be replaced by CMS context in the future
const DEPT_STATS = {
  cse: { label: 'CSE', scope: 'Software & Web', placementRate: '95%', topRecruiters: ['TCS', 'Zoho', 'Amazon'], coreSubject: 'Algorithms' },
  it: { label: 'IT', scope: 'Systems & Networking', placementRate: '94%', topRecruiters: ['Infosys', 'Cognizant', 'IBM'], coreSubject: 'Networks' },
  aids: { label: 'AIDS', scope: 'Data Science & Big Data', placementRate: '96%', topRecruiters: ['MuSigma', 'TCS', 'Wipro'], coreSubject: 'Data Mining' },
  aiml: { label: 'AIML', scope: 'AI & Machine Learning', placementRate: '97%', topRecruiters: ['Google', 'Zoho', 'Accenture'], coreSubject: 'Neural Networks' },
  ece: { label: 'ECE', scope: 'Hardware & IoT', placementRate: '90%', topRecruiters: ['Intel', 'Qualcomm', 'TCS'], coreSubject: 'VLSI' },
  eee: { label: 'EEE', scope: 'Power Systems', placementRate: '88%', topRecruiters: ['Siemens', 'L&T', 'BHEL'], coreSubject: 'Control Systems' },
  mech: { label: 'Mech', scope: 'Design & Manufacturing', placementRate: '85%', topRecruiters: ['Ashok Leyland', 'TVS', 'Hyundai'], coreSubject: 'Thermodynamics' },
  civil: { label: 'Civil', scope: 'Construction & Planning', placementRate: '82%', topRecruiters: ['L&T', 'Sobha', 'Tata Projects'], coreSubject: 'Structural Design' },
  management: { label: 'MBA', scope: 'Business & Management', placementRate: '92%', topRecruiters: ['HDFC', 'ICICI', 'Deloitte'], coreSubject: 'Marketing & Finance' },
  mca: { label: 'MCA', scope: 'App Development', placementRate: '93%', topRecruiters: ['TCS', 'Infosys', 'Cognizant'], coreSubject: 'Software Engineering' }
};

export const departmentComparisonService = {
  compare: (dept1Key, dept2Key) => {
    // Basic fuzzy match extraction logic
    const extractKey = (raw) => {
      const lower = raw.toLowerCase();
      for (const key of Object.keys(DEPT_STATS)) {
        if (lower.includes(key)) return key;
      }
      return null;
    };

    const key1 = extractKey(dept1Key);
    const key2 = extractKey(dept2Key);

    if (key1 && key2 && key1 !== key2) {
      return {
        success: true,
        data: [
          DEPT_STATS[key1],
          DEPT_STATS[key2]
        ]
      };
    }

    return { success: false };
  }
};
