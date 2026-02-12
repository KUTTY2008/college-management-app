import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card3D } from '@/components/ui/3DCard';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

type Role = 'student' | 'staff';

export const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>('student');
  const [loading, setLoading] = useState(false);
  
  // Common fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  // Student specific fields
  const [rollNumber, setRollNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [batch, setBatch] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Sign up user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            role,
            full_name: fullName,
            roll_number: role === 'student' ? rollNumber : null,
            phone: role === 'student' ? phone : null,
            batch: role === 'student' ? batch : null,
          });

        if (profileError) {
          // Cleanup auth user if profile creation fails (optional but good practice)
          // For now, just throw error
          throw profileError;
        }

        toast.success('Registration successful! Please check your email for verification.');
        navigate('/login');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <Card3D className="w-full max-w-lg">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-8 shadow-2xl"
        >
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-white">Create Account</h2>
            <p className="mt-2 text-slate-400">Join CollegeEase today</p>
          </div>

          <div className="mb-6 flex rounded-xl bg-slate-800/50 p-1">
            <button
              className={clsx(
                "flex-1 rounded-lg py-2 text-sm font-medium transition-all",
                role === 'student' ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:text-white"
              )}
              onClick={() => setRole('student')}
            >
              Student
            </button>
            <button
              className={clsx(
                "flex-1 rounded-lg py-2 text-sm font-medium transition-all",
                role === 'staff' ? "bg-purple-600 text-white shadow-lg" : "text-slate-400 hover:text-white"
              )}
              onClick={() => setRole('staff')}
            >
              Staff
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
            />
            
            <AnimatePresence mode="wait">
              {role === 'student' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <Input
                    label="Roll Number"
                    required
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    placeholder="2023CS101"
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="Phone Number"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 9876543210"
                    />
                    <Input
                      label="Batch"
                      required
                      value={batch}
                      onChange={(e) => setBatch(e.target.value)}
                      placeholder="2023-2027"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <Input
              label="Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
            
            <Input
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              minLength={6}
            />

            <Button type="submit" className="mt-6 w-full" isLoading={loading}>
              Register as {role === 'student' ? 'Student' : 'Staff'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-indigo-400 hover:text-indigo-300">
              Sign in
            </Link>
          </p>
        </motion.div>
      </Card3D>
    </div>
  );
};
