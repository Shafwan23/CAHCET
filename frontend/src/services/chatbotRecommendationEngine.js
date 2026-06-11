// src/services/chatbotRecommendationEngine.js

export const chatbotRecommendationEngine = {
  analyzeInterests: (interestsStr) => {
    const lower = interestsStr.toLowerCase();
    const recommendations = [];

    if (lower.includes('code') || lower.includes('software') || lower.includes('computer') || lower.includes('program')) {
      recommendations.push({
        dept: 'Computer Science and Engineering (CSE)',
        key: 'cse',
        reason: 'Perfect for your interest in coding and software development.',
        careers: ['Software Engineer', 'Full Stack Developer', 'Cloud Architect']
      });
      recommendations.push({
        dept: 'Information Technology (IT)',
        key: 'it',
        reason: 'Focuses on networking, systems, and modern IT infrastructure.',
        careers: ['IT Consultant', 'Network Engineer', 'Systems Analyst']
      });
    }

    if (lower.includes('ai') || lower.includes('data') || lower.includes('machine learning') || lower.includes('artificial intelligence')) {
      recommendations.push({
        dept: 'Artificial Intelligence & Data Science (AIDS)',
        key: 'aids',
        reason: 'Directly aligns with your interest in AI and big data.',
        careers: ['Data Scientist', 'AI Engineer', 'ML Researcher']
      });
      recommendations.push({
        dept: 'Artificial Intelligence & Machine Learning (AIML)',
        key: 'aiml',
        reason: 'Specialized focus on machine learning algorithms and AI systems.',
        careers: ['Machine Learning Engineer', 'AI Consultant']
      });
    }

    if (lower.includes('circuit') || lower.includes('electronics') || lower.includes('hardware') || lower.includes('robotics')) {
      recommendations.push({
        dept: 'Electronics and Communication (ECE)',
        key: 'ece',
        reason: 'Ideal for building hardware, IoT devices, and communication systems.',
        careers: ['Electronics Engineer', 'VLSI Designer', 'Telecom Engineer']
      });
      recommendations.push({
        dept: 'Electrical and Electronics (EEE)',
        key: 'eee',
        reason: 'Focuses on power systems, renewable energy, and electrical circuits.',
        careers: ['Power Engineer', 'Control Systems Engineer']
      });
    }

    if (lower.includes('machine') || lower.includes('automobile') || lower.includes('design') || lower.includes('manufacturing')) {
      recommendations.push({
        dept: 'Mechanical Engineering (Mech)',
        key: 'mech',
        reason: 'Great for hands-on design, manufacturing, and thermal engineering.',
        careers: ['Mechanical Designer', 'Automotive Engineer', 'Production Manager']
      });
    }

    if (lower.includes('build') || lower.includes('construction') || lower.includes('structure')) {
      recommendations.push({
        dept: 'Civil Engineering (Civil)',
        key: 'civil',
        reason: 'Focuses on structural design, urban planning, and construction.',
        careers: ['Structural Engineer', 'Urban Planner', 'Site Engineer']
      });
    }

    if (lower.includes('business') || lower.includes('manage') || lower.includes('startup') || lower.includes('finance')) {
      recommendations.push({
        dept: 'Master of Business Administration (MBA)',
        key: 'management',
        reason: 'Perfect for leadership, entrepreneurship, and corporate management.',
        careers: ['Business Analyst', 'Marketing Manager', 'HR Executive']
      });
    }

    // Default fallback
    if (recommendations.length === 0) {
      recommendations.push({
        dept: 'Computer Science and Engineering (CSE)',
        key: 'cse',
        reason: 'The most versatile and high-demand engineering field currently.',
        careers: ['Software Engineer', 'Tech Lead']
      });
      recommendations.push({
        dept: 'Electronics and Communication (ECE)',
        key: 'ece',
        reason: 'A balanced field offering both software and hardware opportunities.',
        careers: ['Systems Engineer', 'Embedded Developer']
      });
    }

    // Return top 2 recommendations
    return recommendations.slice(0, 2);
  }
};
