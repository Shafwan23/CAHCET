import React from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';
import { Section, Container } from '../ui/Layout';
import { slideUp } from '../../animations/variants';

// Import local company logos
import zohoLogo from '../../assets/company logo/zoho.png';
import tcsLogo from '../../assets/company logo/tcs.png';
import infosysLogo from '../../assets/company logo/infosys.png';
import tvsLogo from '../../assets/company logo/tvs.png';
import e2eLogo from '../../assets/company logo/e2e.png';
import cognizantLogo from '../../assets/company logo/cognizant.png';
import accentureLogo from '../../assets/company logo/accenture.png';

// Import Swiper styles
import 'swiper/css';

const defaultRecruiters = [
  { name: 'Zoho', logo: zohoLogo },
  { name: 'TCS', logo: tcsLogo },
  { name: 'Infosys', logo: infosysLogo },
  { name: 'TVS', logo: tvsLogo },
  { name: 'E2E Networks', logo: e2eLogo },
  { name: 'Cognizant', logo: cognizantLogo },
  { name: 'Accenture', logo: accentureLogo },
];

const companyLogoMap = {
  'wipro': 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg',
  'ibm': 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg',
  'tech mahindra': 'https://upload.wikimedia.org/wikipedia/commons/3/36/Tech_Mahindra_New_Logo.svg',
  'amazon': 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
  'google': 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
  'microsoft': 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg'
};

const PlacementsSection = ({ data, liveData }) => {
  const { title, description } = data || {
    title: 'Empowering Global Careers',
    description: 'Our graduates are placed in leading global corporations with industry-best packages. Our training and placement cell works tirelessly to bridge the gap between academia and industry.'
  };
  
  let recruiters = [...defaultRecruiters];

  // Merge from Home CMS data if available
  if (data?.recruiters && Array.isArray(data.recruiters)) {
    data.recruiters.forEach(compName => {
      if (!recruiters.find(r => r.name.toLowerCase() === compName.toLowerCase())) {
        const fallbackLogo = companyLogoMap[compName.toLowerCase()] || `https://logo.clearbit.com/${compName.toLowerCase().replace(/\s+/g, '')}.com`;
        recruiters.push({ name: compName, logo: fallbackLogo });
      }
    });
  }

  // Merge live data from Placements CMS
  if (liveData?.recruiters && liveData.recruiters.length > 0) {
    liveData.recruiters.forEach(r => {
      const existing = recruiters.find(dr => dr.name.toLowerCase() === r.companyName.toLowerCase());
      if (existing) {
        existing.logo = r.logoUrl || existing.logo;
      } else {
        const fallbackLogo = companyLogoMap[r.companyName.toLowerCase()] || `https://logo.clearbit.com/${r.companyName.toLowerCase().replace(/\s+/g, '')}.com`;
        recruiters.push({ name: r.companyName, logo: r.logoUrl || fallbackLogo });
      }
    });
  }

  // Calculate stats from live students
  let highestPackage = 24;
  let totalOffers = 500;
  if (liveData?.students && liveData.students.length > 0) {
    highestPackage = Math.max(...liveData.students.map(s => parseFloat(s.package) || 0), highestPackage);
    totalOffers = liveData.students.length > totalOffers ? liveData.students.length : totalOffers;
  }
  return (
    <Section id="placements" className="bg-primary-50 overflow-hidden">
      <Container>
        <div className="text-center mb-16">
          <motion.div
            variants={slideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <span className="text-accent-gold font-bold tracking-widest uppercase text-sm mb-4 block">Placement Excellence</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-primary-900 mb-6">
              {title}
            </h2>
            <p className="text-primary-600 max-w-2xl mx-auto text-lg">
              {description}
            </p>
          </motion.div>
        </div>

        {/* Recruiters Slider */}
        <div className="mb-20">
          <Swiper
            modules={[Autoplay, FreeMode]}
            spaceBetween={40}
            slidesPerView={3}
            loop={true}
            speed={3000}
            freeMode={true}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
              pauseOnMouseEnter: false,
            }}
            breakpoints={{
              640: { slidesPerView: 4 },
              1024: { slidesPerView: 6 },
            }}
            className="py-10 placement-swiper"
          >
            {recruiters.map((company, idx) => (
              <SwiperSlide key={idx}>
                <div className="bg-white rounded-2xl p-6 h-32 flex items-center justify-center shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                  <img 
                    src={company.logo} 
                    alt={company.name} 
                    className="max-h-12 w-auto object-contain opacity-100 transition-opacity"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentNode.querySelector('.text-fallback').style.display = 'block';
                    }}
                  />
                  <div className="text-fallback hidden text-primary-900 font-bold text-lg text-center leading-tight">{company.name}</div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Highlight Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            whileHover={{ y: -10 }}
            className="bg-white p-8 rounded-2xl border border-primary-100 shadow-sm"
          >
            <h4 className="text-accent-gold text-4xl font-bold mb-2">
              {data?.highestPackage || highestPackage} LPA
            </h4>
            <p className="text-primary-900 font-bold mb-4 uppercase tracking-wider text-sm">
              {data?.highestPackageLabel || 'Highest Package'}
            </p>
            <p className="text-primary-600 text-sm">
              {data?.highestPackageDesc || 'Secured by our top students at global tech giants.'}
            </p>
          </motion.div>
          <motion.div
            whileHover={{ y: -10 }}
            className="bg-white p-8 rounded-2xl border border-primary-100 shadow-sm"
          >
            <h4 className="text-accent-gold text-4xl font-bold mb-2">
              {data?.placementRate || '95%'}
            </h4>
            <p className="text-primary-900 font-bold mb-4 uppercase tracking-wider text-sm">
              {data?.placementRateLabel || 'Placement Rate'}
            </p>
            <p className="text-primary-600 text-sm">
              {data?.placementRateDesc || 'Consistent track record of placement excellence across departments.'}
            </p>
          </motion.div>
          <motion.div
            whileHover={{ y: -10 }}
            className="bg-white p-8 rounded-2xl border border-primary-100 shadow-sm"
          >
            <h4 className="text-accent-gold text-4xl font-bold mb-2">
              {data?.totalOffers ? (data.totalOffers.endsWith('+') ? data.totalOffers : `${data.totalOffers}+`) : `${totalOffers}+`}
            </h4>
            <p className="text-primary-900 font-bold mb-4 uppercase tracking-wider text-sm">
              {data?.totalOffersLabel || 'Offers in 2026'}
            </p>
            <p className="text-primary-600 text-sm">
              {data?.totalOffersDesc || 'A new milestone achieved by our students this academic year.'}
            </p>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
};

export default PlacementsSection;
