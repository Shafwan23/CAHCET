import React from 'react';
import { motion } from 'framer-motion';
import { Section, Container } from '../ui/Layout';
import { slideUp, fadeIn } from '../../animations/variants';

// Import local facility images
import campusHostelImg from '../../assets/images/campus_hostel.png';
import sportsArenaImg from '../../assets/images/sports_arena.png';

const FacilitiesSection = ({ data }) => {
  const defaultFacilities = [
    { 
      title: 'Smart Classrooms', 
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800',
      description: 'Digitally enabled learning spaces for interactive sessions.'
    },
    { 
      title: 'Advanced Labs', 
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
      description: 'Industry-standard labs for hands-on technical training.'
    },
    { 
      title: 'Central Library', 
      image: 'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&q=80&w=800',
      description: 'Over 50,000+ volumes and digital resources access.'
    },
    { 
      title: 'Campus Hostel', 
      image: campusHostelImg,
      description: 'Safe and comfortable residential facilities for students.'
    },
    { 
      title: 'Sports Arena', 
      image: sportsArenaImg,
      description: 'Extensive sports facilities for physical development.'
    },
    { 
      title: 'Cafeteria', 
      image: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?auto=format&fit=crop&q=80&w=800',
      description: 'Hygienic and diverse dining options for all.'
    },
  ];

  const facilities = data?.items || defaultFacilities;
  const sectionTitle = data?.title || 'Infrastructure Built for Innovation';
  return (
    <Section id="facilities" className="bg-white">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <motion.div
            variants={slideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="md:w-2/3"
          >
            <span className="text-accent-gold font-bold tracking-widest uppercase text-sm mb-4 block">World-Class Campus</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-primary-900 mb-6">
              {sectionTitle}
            </h2>
            <p className="text-primary-600 text-lg">
              Explore our sprawling 100-acre campus designed to provide the best learning and living experience.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.map((facility, idx) => (
            <motion.div
              key={idx}
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={idx * 0.1}
              className="group relative overflow-hidden rounded-2xl shadow-lg h-[300px]"
            >
              <img 
                src={facility.image} 
                alt={facility.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-950/90 via-primary-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              
              <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-2xl font-bold text-white mb-2">{facility.title}</h3>
                <p className="text-white/70 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {facility.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default FacilitiesSection;
