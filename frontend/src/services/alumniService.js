// src/services/alumniService.js

// Mock CMS structure for Alumni. 
// In the future, this data will be fetched from CMSContext.
const ALUMNI_DATA = [
  { id: 1, name: 'Rahul Sharma', company: 'Google', package: '24 LPA', dept: 'CSE', year: '2023', testimonial: 'CAHCET gave me the coding foundation I needed.', image: 'https://i.pravatar.cc/150?u=rahul' },
  { id: 2, name: 'Priya Patel', company: 'Amazon', package: '20 LPA', dept: 'IT', year: '2022', testimonial: 'The placement cell is incredibly supportive.', image: 'https://i.pravatar.cc/150?u=priya' },
  { id: 3, name: 'Arun Kumar', company: 'Zoho', package: '12 LPA', dept: 'AIDS', year: '2024', testimonial: 'State-of-the-art labs helped me excel.', image: 'https://i.pravatar.cc/150?u=arun' },
  { id: 4, name: 'Sneha Reddy', company: 'TCS Digital', package: '10 LPA', dept: 'ECE', year: '2023', testimonial: 'A great balance of hardware and software.', image: 'https://i.pravatar.cc/150?u=sneha' }
];

export const alumniService = {
  getTopAlumni: (limit = 3) => {
    return ALUMNI_DATA.slice(0, limit);
  },
  
  getAlumniByDept: (dept, limit = 3) => {
    return ALUMNI_DATA.filter(a => a.dept.toLowerCase() === dept.toLowerCase()).slice(0, limit);
  }
};
