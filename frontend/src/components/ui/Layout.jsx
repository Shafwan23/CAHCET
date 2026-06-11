import React from 'react';
import { cn } from '../../utils/cn';

export const Container = ({ children, className = '' }) => (
  <div className={cn('container-custom', className)}>
    {children}
  </div>
);

export const Section = ({ children, className = '', id }) => (
  <section id={id} className={cn('section-padding', className)}>
    {children}
  </section>
);
