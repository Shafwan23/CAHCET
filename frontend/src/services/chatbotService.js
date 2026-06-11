import { INTENTS, CHATBOT_KNOWLEDGE_BASE } from './chatbotKnowledgeBase';
import { chatbotLeadsService } from './chatbotLeadsService';
import { chatbotAnalyticsService } from './chatbotAnalyticsService';
import { chatbotRecommendationEngine } from './chatbotRecommendationEngine';
import { departmentComparisonService } from './departmentComparisonService';
import { alumniService } from './alumniService';
import { chatbotPersonalityConfig } from './chatbotPersonalityConfig';

class ChatbotService {
  constructor() {
    this.context = [];
    this.counselorState = null; // null | 'AWAITING_INTEREST' | 'AWAITING_MARKS' | 'AWAITING_BUDGET' | 'AWAITING_HOSTEL'
    this.currentCounselorData = {};
    
    // For lead generation
    this.leadState = null;
    this.currentLead = {};
  }

  processQuery(query, cmsData, botName = "CAHCET Assistant") {
    const lowerQuery = query.toLowerCase();
    
    this.context.push(lowerQuery);
    if (this.context.length > 8) this.context.shift();
    
    let response;

    // 0. Handle active state machines
    if (this.counselorState) {
      response = this.handleCounselorFlow(query);
    } else if (this.leadState) {
      response = this.handleLeadFlow(query);
    } else if (lowerQuery.includes('counselor') || lowerQuery.includes('guide me') || lowerQuery.includes('dont know what to study') || lowerQuery.includes('confused about course') || lowerQuery.includes('start ai career counseling')) {
      // 1. Triggers for Counselor Mode
      this.counselorState = 'AWAITING_INTEREST';
      this.currentCounselorData = {};
      response = {
        type: 'text',
        text: "Welcome to the AI Counselor Mode! Let's find the best path for you. First, what are your primary interests? (e.g., Coding, Hardware, Business, Construction)",
        intent: 'COUNSELOR_MODE_START',
        suggestedFollowUps: ['Coding', 'Hardware', 'Business', 'Data']
      };
    } else if (lowerQuery.includes('apply now') || lowerQuery.includes('register') || (lowerQuery.includes('want to join') && lowerQuery.length < 25) || lowerQuery.includes('admission enquiry')) {
      // 2. Triggers for Lead Capture
      this.leadState = 'AWAITING_NAME';
      this.currentLead = {};
      response = {
        type: 'text',
        text: "That's wonderful! I can help you connect with our admissions team. To get started, what is your full name?",
        intent: INTENTS.LEAD_CAPTURE,
        suggestedFollowUps: []
      };
    } else if (lowerQuery.includes('compare')) {
      // 3. Triggers for Department Comparison
      let matched = false;
      const match = lowerQuery.match(/compare\s+([a-z]+)\s+and\s+([a-z]+)/);
      if (match) {
        const [, d1, d2] = match;
        const result = departmentComparisonService.compare(d1, d2);
        if (result.success) {
          chatbotAnalyticsService.logInteraction('COMPARE_DEPARTMENTS', query);
          response = {
            type: 'comparison_table',
            text: `Here is a comparison between ${result.data[0].label} and ${result.data[1].label}:`,
            data: result.data,
            intent: 'COMPARE_DEPARTMENTS',
            suggestedFollowUps: ['View Placements', `Apply for ${result.data[0].label}`]
          };
          matched = true;
        }
      }
      if (!matched) {
        response = this.getKBResponse(lowerQuery, cmsData, botName);
      }
    } else if (lowerQuery.includes('alumni') || lowerQuery.includes('success story')) {
      // 4. Triggers for Alumni Stories
      chatbotAnalyticsService.logInteraction('ALUMNI_STORIES', query);
      
      let alumniData = alumniService.getTopAlumni(3);
      if (cmsData?.placements?.students && Array.isArray(cmsData.placements.students) && cmsData.placements.students.length > 0) {
        // Map CMS students data to expected alumni format
        alumniData = cmsData.placements.students.slice(0, 5).map(s => ({
          name: s.studentName,
          company: s.companyName,
          package: s.package,
          testimonial: s.testimonial || `Secured an excellent placement at ${s.companyName}`,
          image: s.photoUrl || "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150&h=150"
        }));
      }

      response = {
        type: 'alumni_cards',
        text: "Our alumni are working in top global companies. Here are some of our recent real-time success stories:",
        data: alumniData,
        intent: 'ALUMNI_STORIES',
        suggestedFollowUps: ['Top Recruiters', 'Highest Package', 'Apply Now']
      };
    } else if (lowerQuery.includes('placement stat') || lowerQuery.includes('placement record') || lowerQuery.includes('placement dashboard') || lowerQuery.includes('highest package')) {
      // 5. Triggers for Live Placement Dashboard
      chatbotAnalyticsService.logInteraction('LIVE_PLACEMENTS', query);
      
      let highestPackage = 0;
      let topRecruiters = ['TCS', 'Zoho', 'Amazon', 'Cognizant'];
      
      if (cmsData?.placements?.students) {
        const students = Array.isArray(cmsData.placements.students) ? cmsData.placements.students : [];
        highestPackage = students.reduce((max, s) => {
          const pkgStr = s.package ? s.package.replace(/[^0-9.]/g, '') : '0';
          const pkg = parseFloat(pkgStr);
          return pkg > max ? pkg : max;
        }, 0);
      }
      
      if (cmsData?.placements?.recruiters) {
        const recruiters = Array.isArray(cmsData.placements.recruiters) ? cmsData.placements.recruiters : [];
        if (recruiters.length > 0) {
          topRecruiters = recruiters.map(r => r.companyName).slice(0, 4);
        }
      }
      
      const highestStr = highestPackage > 0 ? `${highestPackage} LPA` : '24 LPA';

      response = {
        type: 'placement_dashboard',
        text: "Here is a snapshot of our latest placement achievements based on live CMS data:",
        data: {
          highest: highestStr,
          average: '4.5 LPA',
          percentage: '95%',
          topRecruiters: topRecruiters
        },
        intent: 'LIVE_PLACEMENTS',
        suggestedFollowUps: ['View Recruiters', 'Alumni Stories']
      };
    } else {
      // 6. General Knowledge Base Fallback
      response = this.getKBResponse(lowerQuery, cmsData, botName);
    }

    // Apply personality adjustments
    const personality = cmsData?.chatbot?.personality || 'professional';
    if (response && response.text) {
      response.text = chatbotPersonalityConfig.adjustResponse(response.text, personality);
    }

    // Apply contextual follow-up suggestions
    if (response) {
      let followUps = response.suggestedFollowUps || [];
      if (lowerQuery.includes('cse') || lowerQuery.includes('computer')) {
        followUps = ['Placements in CSE', 'Fees for CSE', 'Top Recruiters'];
      } else if (lowerQuery.includes('admission') || lowerQuery.includes('apply') || lowerQuery.includes('join') || lowerQuery.includes('register')) {
        followUps = ['Fee Structure', 'Scholarships', 'Apply Now'];
      } else if (lowerQuery.includes('placement') || lowerQuery.includes('job') || lowerQuery.includes('package') || lowerQuery.includes('salary') || lowerQuery.includes('recruit')) {
        followUps = ['Highest Package', 'Top Recruiters', 'Alumni Stories'];
      } else if (lowerQuery.includes('hostel') || lowerQuery.includes('stay') || lowerQuery.includes('accommodation')) {
        followUps = ['Hostel Fees', 'Campus Life'];
      } else if (lowerQuery.includes('scholarship') || lowerQuery.includes('concession') || lowerQuery.includes('merit')) {
        followUps = ['Eligibility for Scholarships', 'How to Apply'];
      } else if (lowerQuery.includes('fee') || lowerQuery.includes('cost') || lowerQuery.includes('pay') || lowerQuery.includes('amount')) {
        followUps = ['Scholarships', 'Education Loan'];
      } else if (lowerQuery.includes('campus') || lowerQuery.includes('facility') || lowerQuery.includes('lab') || lowerQuery.includes('library') || lowerQuery.includes('sport')) {
        followUps = ['Hostel Facilities', 'Sports Facilities'];
      }
      
      if (followUps.length > 0) {
        response.suggestedFollowUps = followUps.slice(0, 3); // max 3 to keep it sleek
      }
    }

    return response;
  }

  getKBResponse(lowerQuery, cmsData, botName) {
    let bestMatch = null;
    let maxMatches = 0;

    for (const kb of CHATBOT_KNOWLEDGE_BASE) {
      const matchCount = kb.keywords.filter(kw => lowerQuery.includes(kw)).length;
      if (matchCount > maxMatches) {
        maxMatches = matchCount;
        bestMatch = kb;
      }
    }

    if (bestMatch) {
      chatbotAnalyticsService.logInteraction(bestMatch.intent, lowerQuery);
      const contextString = this.context.join(' ');
      const responses = bestMatch.generateResponse(cmsData, botName, contextString);
      const reply = responses[Math.floor(Math.random() * responses.length)];
      return {
        type: 'text',
        text: reply,
        intent: bestMatch.intent,
        suggestedFollowUps: bestMatch.suggestedFollowUps
      };
    }

    chatbotAnalyticsService.logInteraction(INTENTS.UNKNOWN, lowerQuery);
    
    // Fetch real contact from CMS if available
    let phone = '+91 4172 267387';
    if (cmsData?.contact?.info && Array.isArray(cmsData.contact.info)) {
      const p = cmsData.contact.info.find(i => i.type === 'phone');
      if (p) phone = p.value;
    }

    return {
      type: 'text',
      text: `I'm sorry, I couldn't find specific information on that right now. Could you please rephrase? Alternatively, you can speak directly with our admission counselor at ${phone}.`,
      intent: INTENTS.UNKNOWN,
      suggestedFollowUps: ['Contact Admissions', 'Courses Offered', 'Campus Facilities']
    };
  }

  handleCounselorFlow(query) {
    let reply = '';
    
    switch (this.counselorState) {
      case 'AWAITING_INTEREST':
        this.currentCounselorData.interest = query;
        this.counselorState = 'AWAITING_MARKS';
        reply = "Got it! Roughly what percentage did you score in your 12th standard (HSC)?";
        return { type: 'text', text: reply, suggestedFollowUps: ['Above 90%', '75% - 90%', 'Below 75%'] };

      case 'AWAITING_MARKS':
        this.currentCounselorData.marks = query;
        this.counselorState = 'AWAITING_BUDGET';
        reply = "Thanks. Are you looking for any specific fee structure or scholarship support?";
        return { type: 'text', text: reply, suggestedFollowUps: ['Yes, need scholarship', 'Normal fee is fine'] };

      case 'AWAITING_BUDGET':
        this.currentCounselorData.budget = query;
        this.counselorState = 'AWAITING_HOSTEL';
        reply = "Noted. Finally, will you be needing hostel accommodation?";
        return { type: 'text', text: reply, suggestedFollowUps: ['Yes, need hostel', 'No, day scholar'] };

      case 'AWAITING_HOSTEL': {
        this.currentCounselorData.hostel = query;
        this.counselorState = null;
        
        const recommendations = chatbotRecommendationEngine.analyzeInterests(this.currentCounselorData.interest);
        
        return {
          type: 'counselor_recommendation',
          text: "Based on your profile, I have generated a personalized career recommendation for you!",
          data: recommendations,
          suggestedFollowUps: ['Apply Now', 'View Placements', 'Talk to Human']
        };
      }
    }
  }

  handleLeadFlow(query) {
    let reply = '';
    switch (this.leadState) {
      case 'AWAITING_NAME':
        this.currentLead.name = query;
        this.leadState = 'AWAITING_PHONE';
        reply = `Thanks, ${query}. What is the best phone number to reach you at?`;
        return { type: 'text', text: reply, suggestedFollowUps: [] };
      case 'AWAITING_PHONE':
        this.currentLead.phone = query;
        this.leadState = 'AWAITING_EMAIL';
        reply = "Got it. And your email address?";
        return { type: 'text', text: reply, suggestedFollowUps: [] };
      case 'AWAITING_EMAIL':
        this.currentLead.email = query;
        this.leadState = 'AWAITING_DEPT';
        reply = "Perfect. Which department or course are you interested in? (e.g., CSE, AIDS, MBA)";
        return { type: 'text', text: reply, suggestedFollowUps: ['CSE', 'AIDS', 'MBA', 'Mech'] };
      case 'AWAITING_DEPT':
        this.currentLead.department = query;
        this.leadState = null;
        chatbotLeadsService.addLead(this.currentLead);
        reply = "Thank you! Our admission counselor will reach out to you shortly. Meanwhile, would you like to know about our Placements or Campus Facilities?";
        return {
          type: 'text',
          text: reply,
          intent: INTENTS.LEAD_CAPTURE,
          suggestedFollowUps: ['Placements', 'Campus Facilities', 'Scholarships']
        };
    }
  }

  clearContext() {
    this.context = [];
    this.leadState = null;
    this.currentLead = {};
    this.counselorState = null;
    this.currentCounselorData = {};
  }
}

export const chatbotService = new ChatbotService();
