import React from 'react';
import { motion } from 'framer-motion';
import { Section, Container } from '../ui/Layout';
import { slideUp } from '../../animations/variants';

const VideoShowcaseSection = () => {
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
            <span className="text-accent-gold font-bold tracking-widest uppercase text-sm mb-4 block">Campus Media</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-primary-900 mb-6">
              Experience CAHCET
            </h2>
            <p className="text-primary-600 max-w-2xl mx-auto text-lg">
              Take a virtual tour of our sprawling campus and listen to the success stories of our students.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Campus Tour Video */}
          <motion.div
            variants={slideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="group"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-lg bg-primary-900 aspect-video">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/BYDRoSM7b1Q"
                title="Campus Tour"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <h3 className="text-2xl font-bold text-primary-900 mt-6 mb-2 group-hover:text-accent-gold transition-colors">Campus Tour</h3>
            <p className="text-primary-600 text-sm">Explore our world-class infrastructure and campus life.</p>
          </motion.div>

          {/* Success Story Video */}
          <motion.div
            variants={slideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="group"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-lg bg-primary-900 aspect-video">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/Zj7UNw7SX2U"
                title="Success Story"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <h3 className="text-2xl font-bold text-primary-900 mt-6 mb-2 group-hover:text-accent-gold transition-colors">Success Story</h3>
            <p className="text-primary-600 text-sm">Hear from our alumni about their journey at CAHCET.</p>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
};

export default VideoShowcaseSection;
