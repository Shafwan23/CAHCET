export const refundPolicyData = {
  guidelines: "The following refund policy applies to application and administrative fees paid to C Abdul Hakeem College of Engineering and Technology. For academic fee refunds, please contact the Administrative Office directly.",
  table: [
    { feeType: 'Application Fee', policy: 'Non-refundable' },
    { feeType: 'Registration Fee', policy: 'Non-refundable' },
    { feeType: 'University Enrollment Fee', policy: 'Non-refundable' },
    { feeType: 'Academic Fees', policy: 'Contact Administrative Office' }
  ],
  contact: {
    office: 'Administrative Office, Ground Floor',
    email: 'contactus@cahcet.edu.in',
    phone: '+91-4172-267387',
    hours: '9:00 AM – 4:00 PM (Mon-Fri)'
  },
  process: [
    'Submit a written application to the Administrative Office',
    'Include all relevant documents and original fee receipts',
    'Provide bank account details for refund transfer',
    'Allow 15–20 working days for processing'
  ],
  specialCircumstances: [
    {
      title: 'Medical Grounds',
      desc: 'In case of serious illness or disability, special consideration for refund may be given upon submission of proper medical documentation.'
    },
    {
      title: 'Course Transfer',
      desc: 'Internal course transfer will have adjusted fee calculations based on the difference in course fees.'
    },
    {
      title: 'Force Majeure',
      desc: 'Special policies may apply in cases of unforeseen circumstances beyond the institution’s control.'
    }
  ],
  nonRefundableItems: [
    'Application Fee',
    'Registration Fee',
    'University Enrollment Fee',
    'Insurance Charges'
  ],
  support: {
    email: 'info@cahcet.edu.in',
    phone: '+91-4172-267387'
  }
};
