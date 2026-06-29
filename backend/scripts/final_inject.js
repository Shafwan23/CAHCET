// This script directly writes properly structured data to cse.js
// No more fragile parsing — we construct the data manually from the source text.
const fs = require('fs');
const path = '../frontend/src/data/departments/cse.js';
let content = fs.readFileSync(path, 'utf8');

// ============================================================
// INTERNATIONAL JOURNALS — Hand-structured from user's data
// ============================================================
const journals = [
  // Recent publications (no Academic Year header)
  { id: 1, author: "Abrar Ahmed Katiyan", title: "A Machine Learning–Based Video Compression for Effective Video Encoding and Transmission", journal: "Journal of Machine and Computing, April 2025", doi: "10.53759/7669/jmc202505076", year: "2025" },
  { id: 2, author: "K. Abrar Ahmed", title: "Analysis of Android Malware Detection Using Machine Learning Techniques", journal: "International Conference on Electronics, Engineering Physics, and Earth Science, January 2024", doi: "10.1063/5.0199036", year: "2024" },
  { id: 3, author: "Dr. K. Abrar Ahmed", title: "Mathematical Modeling and Computational Tools for Efficient Water Resource Management: Optimizing Allocation and Sustainability", journal: "Journal of Neonatal Surgery, 14(10S): 683–695, April 2025", doi: "10.52783/jns.v14.2906", year: "2025" },
  { id: 4, author: "T. Balaji, M. Abdulnaseer", title: "A Review on Impacts of Machine Learning in Diverse Fields", journal: "AIP Conference Proceedings, Vol. 2935, 020014 (2024)", doi: "10.1063/5.0198988", year: "2024" },
  { id: 5, author: "Dr. Abrar Ahmed K. & Dr. Inamul Hussain R. Z.", title: "Anticipating Groundwater Depletion for Water Scarcity Alleviation through Advanced Deep Learning Models", journal: "IRO Journal on Sustainable Wireless Systems (ISSN: 2582-3167), December 2023", year: "2023" },
  { id: 6, author: "Mrs. Revathi P", title: "Bipolar Alternate Mark Inversion Encoding (BAMI) Scheme for Performance Signature of Optical Transceiver Systems under Thermal Effects", journal: "Journal of Optical Communications, March 29, 2023", doi: "https://doi.org/10.1515/joc-2023-0021", year: "2023" },
  { id: 7, author: "Dr. K. Lokeshwaran & Dr. K. Abrar Ahmed", title: "Enhancement of Health System for Emergency Care Using IoT Technique", journal: "International Journal of Early Childhood Special Education (INT-JECSE), Vol. 14, Issue 05, 2022, ISSN: 1308-5581", year: "2022" },

  // Academic Year 2018-2019
  { id: 8, author: "R. Vaishnavi, C. Koteeswaran, Sheik Faritha Begum", title: "Mining and Observation Human Motion Styles in Domestic-Based Health Commentary System", journal: "Journal Of Computational And Theoretical Nanoscience, ISSN: 0974-5572, Vol. 15, pp. 2341-2345, 2018, Scopus Indexed (SJR: 0.22)", year: "2018-2019" },
  { id: 9, author: "K. Nivedha, B. Sridhar, Sheik Faritha Begum", title: "An Efficient Wavelet Based on Image Water Marking Techniques", journal: "Journal Of Computational And Theoretical Nanoscience, ISSN: 0974-5572, Vol. 15, pp. 2584-2588, 2018, Scopus Indexed (SJR: 0.22)", year: "2018-2019" },
  { id: 10, author: "S. Hamshika, K. Lokeshwaran, Sheik Faritha Begum", title: "An Upgraded Way to Prevent the Pernicious Review and Provide Quality Based Recommendation in E-Commerce", journal: "Journal Of Computational And Theoretical Nanoscience, ISSN: 0974-5572, Vol. 15, pp. 2645-2648, 2018, Scopus Indexed (SJR: 0.22)", year: "2018-2019" },
  { id: 11, author: "R. Sugumar, A. Rajesh, R. Manivannan", title: "Performance Analysis Of Fragmentation And Replicating Data Over Multi-Clouds With Security", journal: "International Conference On Computer Networks And Communication Technologies, Lecture Notes On Data Engineering And Communication Technologies 15, Springer Nature Singapore Pte Ltd. 2019", year: "2018-2019" },
  { id: 12, author: "S. Sathya", title: "Enhanced Hybrid Data Preprocessing Technique for Eliminating Inconsistencies in the Diabetic Dataset to Improve Mining Results", journal: "Journal of Computational and Theoretical Nanoscience, ISSN: 0974-5572, Vol. 15, No 6/7, pp. 1546-1955, 2018, Scopus Indexed (SJR: 0.22)", year: "2018-2019" },
  { id: 13, author: "S. Kishore Verma, A. Rajesh, J.S. Adeline Johnsana", title: "A Systematic Evaluated Recommendation on Performance Enhancement Factors and Procedures of Relational Data Anonymization", journal: "International Journal of Pure and Applied Mathematics (IJPAM), ISSN: 1314-3395, Volume 120, Issue 5, 2018, pp. 1175-1188, Scopus Indexed (SJR: 0.14)", year: "2018-2019" },
  { id: 14, author: "S. Kishore Verma Samraj, Rajesh Appusamy, Ramya Ravi Shanker", title: "Utility Enhancement of Deficient Relational Recordset Anonymization", journal: "International Journal of Intelligent Engineering and Systems, ISSN: 2185310X, Volume 11, Issue 6, 2018, pp. 137-147, Scopus Indexed (SJR: 0.19)", year: "2018-2019" },
  { id: 15, author: "S. Kishore Verma, A. Rajesh, J.S. Adeline Johnsana", title: "An Improved Classification Analysis on Utility Aware K-anonymized Dataset", journal: "Journal of Computational and Theoretical Nanoscience, ISSN: 15461963, Scopus Indexed (SJR: 0.22), Vol. 16, pp. 445-452, 2019", year: "2018-2019" },
  { id: 16, author: "C. Kotteeswaran", title: "Pattern Based Matrix Insertion Deletion System for Efficient Bio Molecular Computing System", journal: "Journal Of Computational And Theoretical Nanoscience, ISSN: 0974-5572, Vol. 16, pp. 507-511, 2019, Scopus Indexed (SJR: 0.22)", year: "2018-2019" },
  { id: 17, author: "C. Kotteeswaran", title: "Real Time RNA Sequence Edition with Matrix Insertion Deletion for Improved Bio Molecular Computing using TMM", journal: "International Journal of Advanced Computer Science and Applications (IJACSA), Volume 10, No 3, March 2019, Scopus Indexed, Web of Science Indexed", year: "2018-2019" },
  { id: 18, author: "M. Shailaja, K. Lokeshwaran, S. Sheik Faritha Begum", title: "Smart Medication Pill Box For Blind People with Pulse Sensor", journal: "International Journal of Recent Technology and Engineering (IJRTE), ISSN: 2277-3878, Volume-8, Issue-1S2, May 2019, Scopus Indexed", year: "2018-2019" },
  { id: 19, author: "C. Kotteeswaran, Khanaa V, Rajesh A", title: "Rule Based Matrix Insertion Deletion Scheme for Improved Bio Molecular Computing", journal: "International Journal of Recent Technology and Engineering (IJRTE), ISSN: 2277-3878, Volume-8, Issue-1S2, May 2019, Scopus Indexed", year: "2018-2019" },
  { id: 20, author: "R. Sugumar, A. Rajesh, R. Manivannan", title: "Audit: Performance Analysis Of Software Defined Network In Cloud Computing", journal: "Journal Of Computational And Theoretical Nanoscience, ISSN: 0974-5572, Vol. 15, pp. 2202-2209, 2018, Scopus Indexed (SJR: 0.22)", year: "2018-2019" },
  { id: 21, author: "K. Lokeshwaran, A. Rajesh", title: "A Point-to-from Approach to Resolve Broken Links in Linked Open Data", journal: "Journal of Computational and Theoretical Nanoscience, ISSN: 0974-5572, Vol. 15, No 6/7, pp. 1546-1955, 2018, Scopus Indexed (SJR: 0.22)", year: "2018-2019" },
  { id: 22, author: "K. Lokeshwaran, A. Rajesh", title: "A Study of Various Semantic Web Crawlers and Semantic Web Mining", journal: "International Journal of Pure and Applied Mathematics, ISSN: 1314-3395, Vol. 120, No 5, pp. 1163-1173, 2018, Scopus Indexed (SJR: 0.14)", year: "2018-2019" },
  { id: 23, author: "G. Sasirekha, S. Kishore Verma, S. Sheik Faritha Begum, J.S. Adeline Johnsana", title: "An Improved Clustering Realized Relational Data Anonymization with Optimal Privacy and Utility Measures", journal: "International Journal of Recent Technology and Engineering (IJRTE), ISSN: 2277-3878, Volume-8, Issue-1S2, May 2019, Scopus Indexed", year: "2018-2019" },
  { id: 24, author: "Mahalakshmi, R. Sugumar", title: "Data Integrity Validation With Data Dynamics In Data Storages", journal: "International Journal Of Innovation In Engineering Research & Management, ISSN: 2348-4918, UGC Approved Journals No. 48708, Impact Factor: 2.331", year: "2018-2019" },
  { id: 25, author: "K. Lokeshwaran, A. Rajesh, P. Nandakumar", title: "Flagged Approach to Detect Broken Links in Linked Open Data", journal: "IOSR Journal of Engineering, ISSN: 2278-8719, UGC Approved Journal", year: "2018-2019" },
  { id: 26, author: "S. Kishore Verma, A. Rajesh, J.S. Adeline Johnsana", title: "CARD-Utility Guided Clustered Anonymization of Relational Data with Minimum Information Loss and Optimal Re-Identification Risk", journal: "IOSR Journal of Engineering, ISSN: 2250-3021, Volume 8, Issue 11, UGC Approved", year: "2018-2019" },

  // Academic Year 2017-2018
  { id: 27, author: "M. Azhagiri, A. Rajesh", title: "A novel approach to measure the quality of cluster and finding intrusions using intrusion unearthing and probability clomp algorithm", journal: "International Journal of Information Technology, Vol. 10, Issue 3, pp 329–337, September 2018 (Feb 2018 online)", year: "2017-2018" },
  { id: 28, author: "Azhagiri Mahendran, Rajesh Appusamy", title: "An Intrusion Detection System for Network Security Situational Awareness Using Conditional Random Fields", journal: "International Journal of Intelligent Engineering and Systems, Vol. 11, No. 3, Jan 2018", year: "2017-2018" },
  { id: 29, author: "Mohamed Sajid, A. Rajesh", title: "Automatic Early Detection of Skin Cancer Using Neural Network", journal: "Journal of Advanced Research in Dynamical & Control Systems, 04-Special Issue, June 2017", year: "2017-2018" },
  { id: 30, author: "Sheik Faritha Begum", title: "Mortality Risk Reduction Associated with Smoking Cessation", journal: "Journal of Advanced Research in Dynamical & Control Systems, Vol. 10, 05-Special Issue, 2018", year: "2017-2018" },
  { id: 31, author: "M. Fathima Begum, M. Abdulnaseer, C. Kotteeswaran, T. Balaji, P. Nandakumar", title: "Location Of DDoS Botnet Attacks For Cyber Security", journal: "International Journal Of Current Engineering And Scientific Research (IJCESR), ISSN (Print): 2393-8374, (Online): 2394-0697, Volume-5, Issue-3, pp. 13-16, 2018", year: "2017-2018" },
  { id: 32, author: "Nandakumar P, Mohamed Yousuff A R, Abdul Naseer M, Fathima Begum M, Balaji T", title: "Machine Learning And Data Mining Scheme In Cloud Using Distributed Snapshot Algorithm", journal: "International Journal Of Current Engineering And Scientific Research (IJCESR), ISSN (Print): 2393-8374, (Online): 2394-0697, Volume-5, Issue-3, 2018", year: "2017-2018" },
  { id: 33, author: "Balaji T, Mohamed Yousuff A R, Abdul Naseer M, Nandakumar P, Fathima Begum M", title: "Machine Learning On Event Streams In A Distributed Environment By A Streamlearner", journal: "International Journal Of Current Engineering And Scientific Research (IJCESR), ISSN (Print): 2393-8374, (Online): 2394-0697, Volume-5, Issue-3, 2018", year: "2017-2018" },
  { id: 34, author: "Sugumar R, Mahalakshmi V", title: "Data Integrity Validation with Data Dynamics in Data Storages", journal: "International Journal Of Innovation In Engineering Research & Management, ISSN: 2348-4918, Volume 5, Issue 2, 2018", year: "2017-2018" },

  // Academic Year 2016-2017
  { id: 35, author: "N. Sardar Basha, A. Rajesh", title: "Comparative Analysis of Video Compression Standards and its Applications", journal: "International Journal of Control Theory and Applications (IJCTA), 9(28): 391-397, 2016", year: "2016-2017" },
  { id: 36, author: "Boopalan K, Rajesh A, Nalini", title: "Traffic Prediction and Forecasting using Classification of Twitter Stream Analysis", journal: "International Journal of Control Theory and Applications (IJCTA), 9(28): 319-324, 2016", year: "2016-2017" },
  { id: 37, author: "Azhagiri, A. Rajesh, Divya Meena S", title: "Integrated Approach for Intrusion Detection Using Conditional Random Fields with Layered Approach", journal: "International Journal of Control Theory and Applications (IJCTA), 9(28): 93-98, 2016", year: "2016-2017" },
  { id: 38, author: "Gopi R, Dr. A. Rajesh, Sumathi A", title: "Intelligent Transportation Vertical Handoff using LTE-A Networks", journal: "Advances in Natural and Applied Sciences, 10(11): 79-84, July 2016", year: "2016-2017" },
  { id: 39, author: "Gopi R, A. Rajesh", title: "VANET Monitoring Using Sensor to Prevent Intellectual Transportation Traffic", journal: "International Journal of Control Theory and Applications (IJCTA), 9(24): 343-348, 2016", year: "2016-2017" },
  { id: 40, author: "Azhagiri, A. Rajesh", title: "A Concept for Minimizing False Alarms and Security Compromise by Coupled Dynamic Learning of System with Fuzzy Logics", journal: "Indian Journal of Science and Technology, 9(37): 1-8, October 2016, DOI: 10.17485/ijst/2016/v9i37/90284", year: "2016-2017" },
  { id: 41, author: "Azhagiri, A. Rajesh", title: "A Survey on Intrusion Detection System Using Fuzzy Logic", journal: "International Journal of Control Theory and Applications (IJCTA), 9(15): 7517-7522, 2016", year: "2016-2017" },
  { id: 42, author: "Gopi R, Rajesh A", title: "Securing video cloud storage by ERBAC mechanisms in 5G enabled vehicular networks", journal: "Cluster Computing, doi:10.1007/s10586-017-0987-0", year: "2016-2017" },
  { id: 43, author: "Boopalan, C. Nalini, A. Rajesh", title: "Mining Opinions about Traffic Status Using Twitter Messages", journal: "International Journal of Civil Engineering and Technology (IJCIET), 8(2): 218–225, February 2017", year: "2016-2017" },
  { id: 44, author: "A. Senthamarai Selvan, A. Rajesh, N. Sasikala", title: "Dynamic spectrum access for TCP performance improvement in cognitive radio network", journal: "Journal of Chemical and Pharmaceutical Sciences, 9(4): 2241-2246, 2016", year: "2016-2017" },
  { id: 45, author: "Sheik Faritha Begum", title: "Multi-Objective Clustering and Optimization", journal: "International Journal of Control Theory and Applications (IJCTA), ISSN: 0974-5572, Volume 9, Issue 28, 2016, pp. 217-223, Scopus Indexed (SJR: 0.53)", year: "2016-2017" },
  { id: 46, author: "Sheik Faritha Begum", title: "Meta Path Based Top-K Similarity Join In Heterogeneous Information Networks", journal: "Journal of Chemical and Pharmaceutical Sciences, Vol 9(4), October 2016, pp. 2217–2220, ISSN: 0974-2115, Scopus Indexed", year: "2016-2017" },
  { id: 47, author: "Lokeshwaran K, A. Rajesh", title: "Model Based Similar Link Suggestion in LOD", journal: "International Journal of Control Theory and Applications (IJCTA), ISSN: 0974-5572, Volume 9, Issue 28, 2016, pp. 31-40, Scopus Indexed (SJR: 0.53)", year: "2016-2017" },
  { id: 48, author: "C. Kotteeswaran, A. Rajesh, V. Khanna", title: "Rewriting of DNA-RNA by Applying Indexed Grammar with CNF & GNF", journal: "International Journal of Control Theory and Applications (IJCTA), ISSN: 0974-5572, Volume 9, Issue 28, 2016, pp. 31-40, Scopus Indexed (SJR: 0.53)", year: "2016-2017" },
  { id: 49, author: "R. Sugumar, A. Rajesh, R. Manivannan", title: "RABMYST-Performance and Analysis of Rabin's Mystic Sharing on Multi-clouds", journal: "International Journal of Control Theory and Applications (IJCTA), ISSN: 0974-5572, Volume 9, Issue 28, 2016, pp. 307-317, Scopus Indexed (SJR: 0.53)", year: "2016-2017" },
  { id: 50, author: "Sathya S, A. Rajesh, K. Bhuvaneshwari", title: "Hybrid Data Mining Techniques for Accurate Diabetic Prediction", journal: "International Journal of Control Theory and Applications (IJCTA), ISSN: 0974-5572, Volume 9, Issue 28, 2016, pp. 301-306, Scopus Indexed (SJR: 0.53)", year: "2016-2017" },
  { id: 51, author: "Senthamarai Selvan A, Selvaradjou Ka, S. Suresh", title: "A TCP in CR-MANET with Dynamic Bandwidth", journal: "International Journal of Control Theory and Applications (IJCTA), ISSN: 0974-5572, Volume 9, Issue 28, 2016, pp. 243-249, Scopus Indexed (SJR: 0.53)", year: "2016-2017" },
  { id: 52, author: "S. Kishore Verma, A. Rajesh, J.S. Adeline Johnsana", title: "An Enhanced Anonymization and Access Control Approach for Preserving Relational Data Streams", journal: "International Journal of Control Theory and Applications (IJCTA), ISSN: 0974-5572, Volume 9, Issue 28, 2016, pp. 343-356, Scopus Indexed (SJR: 0.53)", year: "2016-2017" },
  { id: 53, author: "S. Kishore Verma, A. Rajesh, S. Anuradha, J.S. Adeline Johnsana", title: "Accuracy Confined Access Control for Privacy Preserving Data Streams", journal: "Journal of Chemical and Pharmaceutical Sciences (JCPS), ISSN: 0974-2115, Volume 9, Issue 4, October–December 2016, pp. 2235-2240, Scopus Indexed (SJR: 0.12)", year: "2016-2017" },
  { id: 54, author: "J.S. Adeline Johnsana, A. Rajesh, S. Kishore Verma", title: "(k, Pd) Anonymization of Time Series Data and Pattern Representation", journal: "International Journal of Control Theory and Applications (IJCTA), ISSN: 0974-5572, Volume 9, Issue 28, 2016, pp. 325-341, Scopus Indexed (SJR: 0.53)", year: "2016-2017" },
  { id: 55, author: "J.S. Adeline Johnsana, A. Rajesh, S. Sangeetha, S. Kishore Verma", title: "Value and Pattern Anonymization of Time Series Data for Privacy Preserving Data Mining", journal: "Journal of Chemical and Pharmaceutical Sciences (JCPS), ISSN: 0974-2115, Volume 9, Issue 4, October–December 2016, pp. 2221-2228, Scopus Indexed (SJR: 0.12)", year: "2016-2017" },
  { id: 56, author: "J.S. Adeline Johnsana, A. Rajesh, S. Kishore Verma", title: "CATs-Clustered k-Anonymization of Time Series Data with Minimal Information Loss and Optimal Re-Identification Risk", journal: "Indian Journal of Science and Technology (IJST), ISSN: 0974-5645, Volume 9, Issue 47, Scopus Indexed (SJR: 0.27), Thomson Reuters", year: "2016-2017" },
  { id: 57, author: "K. Abrar Ahmed, H. Abdul Rauf", title: "Analysis of Fuzzy Membership Function and Boundary Values for Data Anonymization in terms of Information Loss", journal: "International Journal of Control Theory and Applications (IJCTA), Scopus Indexed (SJR: 0.53)", year: "2016-2017" },
  { id: 58, author: "K. Abrar Ahmed, H. Abdul Rauf", title: "Privacy Preserving Data using Fuzzy Hybrid Data Transformation Technique", journal: "Indian Journal of Science and Technology (IJST), ISSN 0973-4562, Vol 10, No 17, pp. 13179-13185, 2017, Scopus Indexed (SJR: 0.27), Thomson Reuters Indexed", year: "2016-2017" },
  { id: 59, author: "Abrar Ahmed, Abdul Rauf H, Rajesh A", title: "A Method for Multiple Numerical QI Attribute Anonymization", journal: "International Journal of Control Theory and Applications (IJCTA), ISSN: 0974-5572, Volume 9, Issue 28, 2016, pp. 301-306, Scopus Indexed (SJR: 0.53)", year: "2016-2017" },
  { id: 60, author: "Sathya S, A. Rajesh", title: "An Effective Prediction of Diabetics Using ID3 Classification Algorithm", journal: "Middle-East Journal of Scientific Research 24 (Recent Innovations in Engineering, Technology, and Management & Applications): 207-211, ISSN 1990-9233, IDOSI Publications, 2016", year: "2016-2017" },
  { id: 61, author: "K. Abrar Ahmed, H. Abdul Rauf", title: "APPDM Framework to Analyze Privacy and Utility Trade-off for MNQIA Anonymization Algorithm", journal: "International Journal of Advance Trends in Engineering and Technology (IJARTET), ISSN: 2394-3785, Vol 4, No 4, pp. 2221-2228, October–April 2017, Thomson Reuters Indexed (SJR: 0.12)", year: "2016-2017" },
  { id: 62, author: "A. Senthamarai Selvan", title: "Spectrum Management And Relay Selection In Cognitive And Cooperative Wireless Network", journal: "International Journal Of Science And Innovative Engineering & Technology, May 2017", year: "2016-2017" },
  { id: 63, author: "R. Sugumar, A. Rajesh", title: "FRD: Fragmentation and Replication of Data over Multi-clouds with Optimistic Performance and Security", journal: "IJPPAS, Vol. 4, No. 1, December 2016, pp. 146-165", year: "2016-2017" },
  { id: 64, author: "M. Fathima Begum, T. Balaji, P. Nanda Kumar, A.R. Mohamed Yousuff, M. Abdul Naseer", title: "Clustering Web Documents to Bootstrap the Discovery of Web Services", journal: "International Journal for Science and Advance Research In Technology, ISSN [Online]: 2395-1052, Vol 3, Issue 2, Feb 2017", year: "2016-2017" },
  { id: 65, author: "S. Madhumathi, C. Kotteeswaran", title: "Efficient Verifiable Policy For Cloud Data Over Outsourced Data Streams Using Multiple Keys", journal: "International Journal of Science and Innovative Engineering and Technology, ISBN: 978-81-904760-9-6, May 2017 Issue, Volume-1", year: "2016-2017" },
  { id: 66, author: "N. Hemalatha, C. Kotteeswaran", title: "An Efficient Ontology Based Querying in Knowledge Extraction", journal: "International Journal of Science and Innovative Engineering and Technology, ISBN: 978-81-904760-9-6, May 2017 Issue, Volume-1", year: "2016-2017" },
  { id: 67, author: "Sheik Faritha Begum", title: "Privacy-Preserving Multi-Keyword Ranked Search over Encrypted Cloud Data", journal: "International Journal of Science and Innovative Engineering & Technology, Volume 1, May 2017, ISBN 978-81-904760-9-6", year: "2016-2017" },
  { id: 68, author: "Madhuri B, Lokeshwaran K", title: "Personalized Travel Sequence Recommendation on Multi-Source Big Social Media", journal: "International Journal of Science and Innovative Engineering & Technology, May 2017 Issue, Volume 1, ISBN 978-81-904760-9-6", year: "2016-2017" },
  { id: 69, author: "Sheik Faritha Begum", title: "Clustering of Tissue Sample for Cancer Diagnosis Using AMOSA Technique", journal: "International Journal of Science and Innovative Engineering & Technology, Volume 1, May 2017, ISBN 978-81-904760-9-6", year: "2016-2017" },
];

// ============================================================
// INTERNATIONAL CONFERENCES — Hand-structured from user's data
// ============================================================
const intConf = [
  { id: 1, author: "Abdulnaseer M, T. Balaji", title: "A Review on Impacts of Machine Learning in Diverse Fields", conference: "International Conference on Artificial Intelligence Systems for Sustainable Solutions (AIS3 2023), held at CAHCET, January 2023", year: "2023" },
  { id: 2, author: "P. Revathi", title: "A Robust and Fast Symmetric Text Encryption Algorithm Based on Fermat's Two Squares Theorem", conference: "International Conference on Recent Advances in Electrical, Electronics, Ubiquitous Communication, and Computational Intelligence (RAEEUCCI), held at CAHCET, April 2023", year: "2023" },
  { id: 3, author: "T. Balaji, Abdulnaseer M", title: "A Review on Impacts of Machine Learning in Diverse Fields", conference: "International Conference on Artificial Intelligence Systems for Sustainable Solutions (AIS3 2023), at CAHCET, January 2023", year: "2023" },
  { id: 4, author: "Dr. Inamul Hussain R Z", title: "Voting System using BlockChain", conference: "4th International Conference on Technology and Advancement in Computing Application (ICTACA 24)", year: "2024" },
  { id: 5, author: "Dr. Inamul Hussain R Z", title: "Crowd Funding using BlockChain and Third Web Technology", conference: "4th International Conference on Technology and Advancement in Computing Application (ICTACA 24)", year: "2024" },
];

// ============================================================
// NATIONAL CONFERENCES — Hand-structured from user's data
// ============================================================
const natConf = [
  { id: 1, author: "Dr. Inamul Hussain R Z, Dr. Abrar Ahmed K", title: "Prediction of Groundwater Level to Improve Water Scarcity Using Deep Learning Algorithm", conference: "National Conference on Recent Trends in Artificial Intelligence and Soft Computing, Bannari Amman Institute of Technology, January 2024", year: "2024" },
  { id: 2, author: "Mr. R. Sugumar", title: "FRD: Fragmentation and Replication of Data over Multi-Clouds with Optimist Performance and Security", conference: "National Conference on Emerging Trends in Science, Engineering and Technology, Department of CSE, NTET, Coimbatore, 4 March 2016", year: "2016" },
  { id: 3, author: "Mr. R. Sugumar", title: "Secured Public Auditing Scheme for Regenerating Code Based Cloud Storages", conference: "National Conference on Recent Trends in Computer Technology (NCRTCT'16), Department of MCA, Sri Balaji Chockalingam Engineering College, 18 March 2016", year: "2016" },
];

// ============================================================
// TRAINING PROGRAMS — Parse from latest_faculty_p2.txt
// ============================================================
const p2 = fs.readFileSync('latest_faculty_p2.txt', 'utf8');
const trainings = [];
let tId = 1;
let currentTYear = '2024-2025';
p2.split('\n').map(l => l.trim()).filter(l => l.length > 0 && l !== "'").forEach(line => {
    if (line.startsWith('Academic Year')) {
        currentTYear = line.replace('Academic Year (', '').replace(')', '').trim().replace(/[\u2013\u2014]/g, '-').replace(/[^0-9- ]/g, '').trim();
    } else if (!line.startsWith('FDP & Webinar')) {
        trainings.push({
            id: tId++,
            title: line,
            organizer: '',
            date: currentTYear,
            year: currentTYear
        });
    }
});

// ============================================================
// STUDENT DATA — Parse from clean text files
// ============================================================

// Co-curricular
const cLines = fs.readFileSync('clean_cocur.txt', 'utf8').split('\n').map(l => l.trim()).filter(l => l.length > 0);
const cocur = [];
let cYear = '2024-2025';
let cId = 1;
cLines.forEach(line => {
    if (line.startsWith('Academic Year')) {
        cYear = line.replace('Academic Year', '').replace(/[()]/g, '').trim().replace(/[\u2013\u2014]/g, '-').replace(/[^0-9- ]/g, '').trim();
    } else if (line.length > 10) {
        cocur.push({ id: cId++, title: line, author: "", year: cYear });
    }
});

// Extra-curricular
const eLines = fs.readFileSync('clean_extracur.txt', 'utf8').split('\n').map(l => l.trim()).filter(l => l.length > 0);
const extracur = [];
let eYear = '2024-2025';
let eId = 1;
eLines.forEach(line => {
    if (line.startsWith('Academic Year')) {
        eYear = line.replace('Academic Year', '').replace(/[()]/g, '').trim().replace(/[\u2013\u2014]/g, '-').replace(/[^0-9- ]/g, '').trim();
    } else if (line.length > 10 && !line.startsWith('Extra-Curricular')) {
        extracur.push({ id: eId++, title: line, author: "", year: eYear });
    }
});

// Internship
const iLines = fs.readFileSync('clean_internship.txt', 'utf8').split('\n').map(l => l.trim()).filter(l => l.length > 0);
const internship = [];
let iId = 1;
let iYear = '2024-2025';
iLines.forEach(line => {
    if (line.startsWith('Academic Year')) {
        iYear = line.replace('Academic Year', '').replace(/[()]/g, '').trim().replace(/[\u2013\u2014]/g, '-').replace(/[^0-9- ]/g, '').trim();
    } else if (/^\d+\s/.test(line)) {
        const parts = line.split('\t');
        if (parts.length >= 5) {
            internship.push({ id: iId++, author: parts[1].trim(), organizer: parts[2].trim(), title: parts[3].trim(), date: parts[4].trim(), year: iYear });
        } else {
            const p = line.split(/\s{2,}/);
            if (p.length >= 5) {
                internship.push({ id: iId++, author: p[1].trim(), organizer: p[2].trim(), title: p[3].trim(), date: p[4].trim(), year: iYear });
            }
        }
    }
});

// MOOC
const mLines = fs.readFileSync('clean_mooc.txt', 'utf8').split('\n').map(l => l.trim()).filter(l => l.length > 0);
const mooc = [];
let mId = 1;
let mYear = '2024-2025';
mLines.forEach(line => {
    if (line.startsWith('Academic Year')) {
        mYear = line.replace('Academic Year', '').replace(/[()]/g, '').trim().replace(/[\u2013\u2014]/g, '-').replace(/[^0-9- ]/g, '').trim();
    } else if (/^\d+\s/.test(line)) {
        const parts = line.split('\t');
        if (parts.length >= 4) {
            mooc.push({ id: mId++, author: parts[1].trim(), organizer: parts[2].trim(), title: parts[3].trim(), date: parts[4] ? parts[4].trim() : "", year: mYear });
        }
    }
});

// ============================================================
// BUILD AND INJECT
// ============================================================
const achievementsData = {
  faculty: {
    internationalJournal: journals,
    internationalConference: intConf,
    nationalConference: natConf,
    trainingProgram: trainings
  },
  student: {
    coCurricular: cocur,
    extraCurricular: extracur,
    internship: internship,
    mooc: mooc
  }
};

const newStr = 'achievementsData: ' + JSON.stringify(achievementsData, null, 4).replace(/\n/g, '\n  ') + ',\n    ';
const startIdx = content.indexOf('achievementsData: {');
const endIdx = content.indexOf('galleryData: [');
content = content.substring(0, startIdx) + newStr + content.substring(endIdx);
fs.writeFileSync(path, content);

console.log('=== FINAL COUNTS ===');
console.log('Journals:', journals.length);
console.log('Int. Conferences:', intConf.length);
console.log('Nat. Conferences:', natConf.length);
console.log('Trainings:', trainings.length);
console.log('Co-curricular:', cocur.length);
console.log('Extra-curricular:', extracur.length);
console.log('Internship:', internship.length);
console.log('MOOC:', mooc.length);

// Verify no duplicates in journals
console.log('\n=== JOURNAL VERIFICATION (first 7) ===');
journals.slice(0, 7).forEach(j => {
    console.log(`[${j.id}] Author: ${j.author}`);
    console.log(`     Title: ${j.title.substring(0, 70)}...`);
    console.log(`     Journal: ${j.journal.substring(0, 70)}...`);
    console.log(`     Year: ${j.year}`);
    console.log('');
});
