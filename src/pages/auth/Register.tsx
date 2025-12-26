  import React, { useState } from 'react';
  import axios, { AxiosError } from 'axios';
  import { useNavigate } from 'react-router-dom';

  interface FormData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }

  interface ApiError {
    [key: string]: string[];
  }

  const Register: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
    });

    const [errors, setErrors] = useState<Partial<FormData> & { form?: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleBack = () => {
      // Go back if possible, otherwise go to home
      if (window.history.state && window.history.state.idx > 0) {
        navigate(-1);
      } else {
        navigate('/'); // fallback
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      if (errors[name as keyof FormData]) {
        setErrors((prev) => {
          const updated = { ...prev };
          delete updated[name as keyof FormData];
          return updated;
        });
      }
    };

    const validateForm = (): Partial<FormData> => {
      const newErrors: Partial<FormData> = {};
      if (!formData.name.trim()) newErrors.name = 'Full name is required';
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
      if (formData.password !== formData.password_confirmation) {
        newErrors.password_confirmation = 'Passwords do not match';
      }
      return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setIsSubmitting(false);
        return;
      }

      try {
        await axios.post('/api/register', formData);
        navigate('/', {
          state: { message: 'Registration successful! Please log in.', type: 'success' },
        });
      } catch (err) {
        const error = err as AxiosError<{ errors?: ApiError }>;
        if (error.response?.data?. errors) {
          const backendErrors: Partial<FormData> = {};
          Object.entries(error.response.data.errors).forEach(([key, messages]) => {
            if (key in formData) {
              backendErrors[key as keyof FormData] = messages[0];
            }
          });
          setErrors(backendErrors);
        } else {
          setErrors({ form: 'Registration failed. Please try again later.' });
        }
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded shadow-md p-8 md:p-10 space-y-6 relative">
          {/* Back Button - Top Left */}
          <button
            type="button"
            onClick={handleBack}
            className="absolute -top-2 -left-2 w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
            aria-label="Go back"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-[#001F3D]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>

          {/* Top accent bar */}
          <div className="h-1.5 bg-[#001F3D] rounded-t-xl -mx-8 -mt-8 mb-5"></div>
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">Create Your Account</h2>
            <p className="text-gray-500 mt-2">
              Join our boarding community — secure, simple, and tenant-focused.
            </p>
          </div>

          {errors.form && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded focus:ring-2 focus:outline-none transition ${
                  errors.name
                    ? 'border-red-400 focus:ring-red-200'
                    : 'border-gray-300 focus:ring-[#001F3D]/20 focus:border-[#001F3D]'
                }`}
                placeholder="Enter your full name"
              />
              {errors.name && <p className="mt-1.5 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded focus:ring-2 focus:outline-none transition ${
                  errors.email
                    ? 'border-red-400 focus:ring-red-200'
                    : 'border-gray-300 focus:ring-[#001F3D]/20 focus:border-[#001F3D]'
                }`}
                placeholder="your@email.com"
              />
              {errors.email && <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded focus:ring-2 focus:outline-none transition ${
                  errors.password
                    ? 'border-red-400 focus:ring-red-200'
                    : 'border-gray-300 focus:ring-[#001F3D]/20 focus:border-[#001F3D]'
                }`}
                placeholder="Create a strong password (min. 8 characters)"
              />
              {errors.password && <p className="mt-1.5 text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="password_confirmation"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="password_confirmation"
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded focus:ring-2 focus:outline-none transition ${
                  errors.password_confirmation
                    ? 'border-red-400 focus:ring-red-200'
                    : 'border-gray-300 focus:ring-[#001F3D]/20 focus:border-[#001F3D]'
                }`}
                placeholder="Re-enter your password"
              />
              {errors.password_confirmation && (
                <p className="mt-1.5 text-sm text-red-600">{errors.password_confirmation}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded font-semibold text-white transition ${
                isSubmitting
                  ? 'bg-[#001F3D]/70 cursor-not-allowed'
                  : 'bg-[#001F3D] hover:bg-[#003566] active:bg-[#002a57] shadow-sm'
              }`}
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Login link */}
          <div className="text-center text-gray-600 mt-4">
            Already have an account?{' '}
            <a href="/login" className="font-medium text-[#001F3D] hover:underline">
              Log in
            </a>
          </div>
        </div>
      </div>
    );
  };

  export default Register;