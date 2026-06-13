import React from 'react';
import { motion } from 'framer-motion';
import { Section, Container } from '../ui/Layout';
import { fadeIn, slideUp } from '../../animations/variants';

const defaultImages = [
  { url: 'https://images.unsplash.com/photo-1523050338691-c1e53d076efd?auto=format&fit=crop&w=800', title: 'Main Block', size: 'large' },
  { url: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&w=800', title: 'Campus View', size: 'small' },
  { url: 'https://images.unsplash.com/photo-1498243639359-2ceeae4b0c67?auto=format&fit=crop&w=800', title: 'Library', size: 'small' },
  { url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800', title: 'Workshop', size: 'medium' },
  { url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800', title: 'Graduation Day', size: 'medium' },
  { url: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800', title: 'Smart Class', size: 'small' },
];

const GallerySection = ({ data }) => {
  const title = data?.title || 'Life at CAHCET';
  const subtitle = data?.subtitle || 'Visual Tour';
  const images = data?.images || defaultImages;

  return (
    <Section id="gallery" className="bg-white">
      <Container>
        <motion.div
          variants={slideUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-accent-gold font-bold tracking-widest uppercase text-sm mb-4 block">{subtitle}</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-primary-900 mb-6">
            {title}
          </h2>
        </motion.div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {images.map((img, idx) => (
            <motion.div
              key={idx}
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={idx * 0.1}
              className="relative group overflow-hidden rounded-2xl break-inside-avoid shadow-lg cursor-pointer"
            >
              <img 
                src={img.url} 
                alt={img.title} 
                className="w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-primary-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="text-center p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h4 className="text-white font-bold text-lg">{img.title}</h4>
                  <div className="w-10 h-1 bg-accent-gold mx-auto mt-2" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default GallerySection;
