import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Phone, Mail, AlertCircle, CheckCircle, XCircle, PartyPopper, Sparkles, Star } from 'lucide-react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  inquiry: string;
  contactMethod: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  inquiry?: string;
}

interface ApiError {
  message: string;
}

function App() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    inquiry: '',
    contactMethod: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.length < 2) return 'Name must be at least 2 characters';
        if (!/^[a-zA-Z\s]*$/.test(value)) return 'Name can only contain letters and spaces';
        return '';
      case 'email':
        if (!value) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
        return '';
      case 'phone':
        if (value && !/^\+?[\d\s-()]+$/.test(value)) return 'Please enter a valid phone number';
        return '';
      case 'subject':
        if (!value) return 'Please select a subject';
        return '';
      case 'inquiry':
        if (!value.trim()) return 'Please describe your inquiry';
        if (value.length < 10) return 'Inquiry must be at least 10 characters long';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handlePhoneChange = (value: string) => {
    setFormData(prev => ({ ...prev, phone: value || '' }));
    if (touched.phone) {
      const error = validateField('phone', value || '');
      setErrors(prev => ({ ...prev, phone: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: FormErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof FormData]);
      if (error) newErrors[key as keyof FormErrors] = error;
    });

    setErrors(newErrors);
    setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      setApiError(null);

      try {
        const response = await fetch('http://localhost:8000/api/contact/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to submit form');
        }

        setIsSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          inquiry: '',
          contactMethod: '',
        });
        setTouched({});

        setTimeout(() => {
          setIsSubmitted(false);
        }, 3000);
      } catch (error) {
        setApiError((error as Error).message || 'An unexpected error occurred');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const inputVariants = {
    initial: { scale: 1 },
    focus: {
      scale: 1.02,
      boxShadow: "0 0 0 2px rgba(99, 102, 241, 0.2)",
      transition: { duration: 0.2 }
    },
    blur: { scale: 1, boxShadow: "none", transition: { duration: 0.2 } }
  };

  const successVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: -20,
      transition: { duration: 0.4 }
    }
  };

  const sparkleVariants = {
    initial: { scale: 0, rotate: 0 },
    animate: {
      scale: [0, 1, 0],
      rotate: [0, 180, 360],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  };

  const renderFieldError = (fieldName: keyof FormErrors) => {
    if (!touched[fieldName]) return null;
    return errors[fieldName] ? (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 10 }}
        className="flex items-center mt-1 text-sm text-red-600"
      >
        <XCircle className="w-4 h-4 mr-1" />
        {errors[fieldName]}
      </motion.div>
    ) : (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 10 }}
        className="flex items-center mt-1 text-sm text-green-600"
      >
        <CheckCircle className="w-4 h-4 mr-1" />
        Looks good!
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen relative py-12 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#0A0F1C]">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1F3C] via-[#0A0F1C] to-[#1A1F3C]" />
        <motion.div
          initial={{ opacity: 0.3 }}
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1636953056323-9c09fdd74fa6?auto=format&fit=crop&q=80&w=2000&h=1000')] opacity-30 bg-cover bg-center"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-indigo-500/10 to-blue-500/10" />

        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            variants={sparkleVariants}
            initial="initial"
            animate="animate"
            className="absolute"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          >
            <Sparkles className="w-6 h-6 text-indigo-400/30" />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isSubmitted && (
          <motion.div
            variants={successVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-md"
          >
            <motion.div
              className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 flex flex-col items-center"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div
                className="relative"
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 1.5,
                  ease: "easeInOut",
                  times: [0, 0.5, 1]
                }}
              >
                <PartyPopper className="w-16 h-16 text-indigo-400" />
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute top-0 left-0"
                    animate={{
                      scale: [1, 0],
                      rotate: [0, 360],
                      opacity: [1, 0],
                      x: [0, (i - 2) * 30],
                      y: [0, (i - 2) * 30],
                    }}
                    transition={{
                      duration: 0.8,
                      delay: i * 0.1,
                      repeat: Infinity,
                      repeatDelay: 1
                    }}
                  >
                    <Star className="w-6 h-6 text-yellow-400" />
                  </motion.div>
                ))}
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold mt-4 text-white"
              >
                Thank You!
              </motion.h3>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-indigo-200 mt-2"
              >
                Your inquiry has been submitted successfully.
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative max-w-2xl mx-auto bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20"
      >
        <div className="px-8 py-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                "radial-gradient(circle at 30% 107%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 80%)",
                "radial-gradient(circle at 70% 107%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 80%)"
              ]
            }}
            transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
          />
          <h2 className="text-3xl font-bold text-white relative z-10">Contact Us</h2>
          <p className="mt-2 text-blue-100 relative z-10">We'd love to hear from you!</p>
        </div>

        {apiError && (
          <div className="px-8 py-4 bg-red-500/10 border-b border-red-500/20">
            <p className="text-red-400 text-sm flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              {apiError}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
          <motion.div
            variants={inputVariants}
            whileFocus="focus"
            className="space-y-2"
          >
            <label className="block text-sm font-medium text-indigo-200">Name *</label>
            <input
              type="text"
              name="name"
              required
              className={`w-full px-4 py-2 bg-white/5 backdrop-blur-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-white ${touched.name && errors.name ? 'border-red-500' : touched.name && !errors.name ? 'border-green-500' : 'border-white/10'
                }`}
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {renderFieldError('name')}
          </motion.div>

          <motion.div
            variants={inputVariants}
            whileFocus="focus"
            className="space-y-2"
          >
            <label className="block text-sm font-medium text-indigo-200">Email Address *</label>
            <input
              type="email"
              name="email"
              required
              className={`w-full px-4 py-2 bg-white/5 backdrop-blur-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-white ${touched.email && errors.email ? 'border-red-500' : touched.email && !errors.email ? 'border-green-500' : 'border-white/10'
                }`}
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {renderFieldError('email')}
          </motion.div>

          <motion.div
            variants={inputVariants}
            whileFocus="focus"
            className="space-y-2"
          >
            <label className="block text-sm font-medium text-indigo-200">Phone Number (Optional)</label>
            <div className={`phone-input-container ${touched.phone && errors.phone ? 'border-red-500' : touched.phone && !errors.phone ? 'border-green-500' : 'border-white/10'
              }`}>
              <PhoneInput
                international
                countryCallingCodeEditable={false}
                defaultCountry="US"
                value={formData.phone}
                onChange={handlePhoneChange}
                onBlur={() => {
                  setTouched(prev => ({ ...prev, phone: true }));
                  const error = validateField('phone', formData.phone);
                  setErrors(prev => ({ ...prev, phone: error }));
                }}
                className="w-full px-4 py-2 bg-white/5 backdrop-blur-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-white"
              />
            </div>
            {renderFieldError('phone')}
          </motion.div>

          <motion.div
            variants={inputVariants}
            whileFocus="focus"
            className="space-y-2"
          >
            <label className="block text-sm font-medium text-indigo-200">Subject *</label>
            <select
              name="subject"
              required
              className={`w-full px-4 py-2 bg-white/5 backdrop-blur-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-white ${touched.subject && errors.subject ? 'border-red-500' : touched.subject && !errors.subject ? 'border-green-500' : 'border-white/10'
                }`}
              value={formData.subject}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <option value="">Select a subject</option>
              <option value="general">General Inquiry</option>
              <option value="support">Support Request</option>
              <option value="business">Business/Partnership</option>
              <option value="other">Other</option>
            </select>
            {renderFieldError('subject')}
          </motion.div>

          <motion.div
            variants={inputVariants}
            whileFocus="focus"
            className="space-y-2"
          >
            <label className="block text-sm font-medium text-indigo-200">Inquiry Description *</label>
            <textarea
              name="inquiry"
              required
              rows={4}
              className={`w-full px-4 py-2 bg-white/5 backdrop-blur-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-white ${touched.inquiry && errors.inquiry ? 'border-red-500' : touched.inquiry && !errors.inquiry ? 'border-green-500' : 'border-white/10'
                }`}
              value={formData.inquiry}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {renderFieldError('inquiry')}
          </motion.div>

          <motion.div
            variants={inputVariants}
            whileFocus="focus"
            className="space-y-2"
          >
            <label className="block text-sm font-medium text-indigo-200">Preferred Contact Method (Optional)</label>
            <select
              name="contactMethod"
              className="w-full px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-white"
              value={formData.contactMethod}
              onChange={handleChange}
            >
              <option value="">Select preferred contact method</option>
              <option value="phone">Phone</option>
              <option value="email">Email</option>
              <option value="no-preference">No Preference</option>
              <option value="other">Other</option>
            </select>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(99, 102, 241, 0.4)" }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg shadow-indigo-500/25 transition-all duration-200 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700'
              }`}
          >
            <Send className={`w-5 h-5 mr-2 ${isSubmitting ? 'animate-pulse' : ''}`} />
            {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
          </motion.button>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(99, 102, 241, 0.2)" }}
              className="flex items-center justify-center p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 shadow-sm"
            >
              <Phone className="w-5 h-5 mr-2 text-indigo-400" />
              <span className="text-indigo-200">Phone Support</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(99, 102, 241, 0.2)" }}
              className="flex items-center justify-center p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 shadow-sm"
            >
              <Mail className="w-5 h-5 mr-2 text-indigo-400" />
              <span className="text-indigo-200">Email Support</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(99, 102, 241, 0.2)" }}
              className="flex items-center justify-center p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 shadow-sm"
            >
              <AlertCircle className="w-5 h-5 mr-2 text-indigo-400" />
              <span className="text-indigo-200">24/7 Available</span>
            </motion.div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default App;