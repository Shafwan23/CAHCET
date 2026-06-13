import React from 'react';
import { motion } from 'framer-motion';
import { Section, Container } from '../ui/Layout';
import { slideUp } from '../../animations/variants';

const VideoShowcaseSection = ({ data }) => {
  const title = data?.title || 'Experience CAHCET';
  const subtitle = data?.subtitle || 'Campus Media';
  const description = data?.description || 'Take a virtual tour of our sprawling campus and listen to the success stories of our students.';
  const videos = data?.videos || [
    {
      url: 'https://www.youtube.com/embed/BYDRoSM7b1Q',
      title: 'Campus Tour',
      desc: 'Explore our world-class infrastructure and campus life.'
    },
    {
      url: 'https://www.youtube.com/embed/Zj7UNw7SX2U',
      title: 'Success Story',
      desc: 'Hear from our alumni about their journey at CAHCET.'
    }
  ];

  return (
    <Section id="video-showcase" className="bg-white">
      <Container>
        <div className="text-center mb-16">
          <motion.div
            variants={slideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <span className="text-accent-gold font-bold tracking-widest uppercase text-sm mb-4 block">{subtitle}</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-primary-900 mb-6">
              {title}
            </h2>
            <p className="text-primary-600 max-w-2xl mx-auto text-lg">
              {description}
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {videos.map((vid, idx) => (
            <motion.div
              key={idx}
              variants={slideUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="group"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-lg bg-primary-900 aspect-video">
                <iframe
                  className="w-full h-full"
                  src={vid.url}
                  title={vid.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <h3 className="text-2xl font-bold text-primary-900 mt-6 mb-2 group-hover:text-accent-gold transition-colors">{vid.title}</h3>
              <p className="text-primary-600 text-sm">{vid.desc || vid.description}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default VideoShowcaseSection;
