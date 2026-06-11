import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2 } from 'lucide-react';
import { Input, Select } from './FormElements';
import { collegeData } from '../../data/collegeData';
import Button from './Button';
import logoImg from '../../assets/images/logo.jfif';

const EnquiryModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    course: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Handle Esc key to close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full Name is required';
    } else if (!/^[A-Za-z\s]+$/.test(formData.name)) {
      newErrors.name = 'Only alphabets and spaces are allowed';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Minimum 3 characters required';
    }

    if (!formData.mobile) {
      newErrors.mobile = 'Mobile Number is required';
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Exactly 10 digits required';
    }

    if (!formData.email) {
      newErrors.email = 'Email Address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.course) {
      newErrors.course = 'Please select a course';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
        setFormData({ name: '', mobile: '', email: '', course: '' });
        // Close after success delay
        setTimeout(() => {
          setIsSuccess(false);
          onClose();
        }, 3000);
      }, 1500);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-primary-950/40 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Modal Header */}
            <div className="bg-primary-900 p-8 text-white relative">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-white p-1 flex items-center justify-center">
                  <img src={logoImg} alt="CAHCET Logo" className="w-10 h-10 object-contain" />
                </div>
                <div>
                  <h3 className="text-2xl font-display font-bold">Admission Enquiry</h3>
                  <p className="text-primary-200 text-sm">Fill in the details to start your journey.</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="absolute top-8 right-8 p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 md:p-10 overflow-y-auto max-h-[70vh]">
              {!isSuccess ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    label="Student Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
                    placeholder="Enter your full name"
                  />
                  <div className="grid md:grid-cols-2 gap-6">
                    <Input
                      label="Mobile Number"
                      name="mobile"
                      type="tel"
                      value={formData.mobile}
                      onChange={handleChange}
                      error={errors.mobile}
                      placeholder="10-digit number"
                      maxLength={10}
                    />
                    <Input
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      error={errors.email}
                      placeholder="your@email.com"
                    />
                  </div>
                  <Select
                    label="Course of Interest"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    options={collegeData.courseList}
                    error={errors.course}
                  />

                  <Button
                    type="submit"
                    className="w-full py-5 rounded-2xl mt-4 shadow-xl"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Processing...' : 'Submit Enquiry'}
                  </Button>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center flex flex-col items-center gap-6"
                >
                  <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center text-amber-600 mb-2">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-display font-bold text-primary-900">Successfully Sent!</h3>
                    <p className="text-primary-500 max-w-xs mx-auto">
                      Thank you for your enquiry. Our admission counselor will contact you shortly.
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EnquiryModal;
