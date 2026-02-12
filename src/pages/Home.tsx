import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card3D } from '@/components/ui/3DCard';
import { Shield, Upload, Users, Zap } from 'lucide-react';

export const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative px-4 pt-20 pb-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-center"
          >
            <motion.h1 variants={itemVariants} className="bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-5xl font-extrabold text-transparent sm:text-6xl md:text-7xl lg:text-8xl">
              Future of College<br />Management
            </motion.h1>
            <motion.p variants={itemVariants} className="mx-auto mt-6 max-w-2xl text-xl text-slate-300">
              A secure, modern, and efficient platform for students and staff. Manage documents, view details, and stay connected.
            </motion.p>
            <motion.div variants={itemVariants} className="mt-10 flex justify-center gap-4">
              <Link to="/register">
                <Button className="h-12 px-8 text-lg">Get Started</Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" className="h-12 px-8 text-lg">Login</Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Secure Authentication',
                desc: 'Enterprise-grade security with email verification and role-based access control.',
                icon: Shield,
                color: 'text-indigo-400'
              },
              {
                title: 'Easy File Uploads',
                desc: 'Students can securely upload and manage their certificates and documents.',
                icon: Upload,
                color: 'text-pink-400'
              },
              {
                title: 'Staff Dashboard',
                desc: 'Dedicated interface for staff to manage batches and view student details.',
                icon: Users,
                color: 'text-purple-400'
              }
            ].map((feature, i) => (
              <Card3D key={i} className="h-64">
                <div className="glass-card flex h-full flex-col justify-center rounded-2xl p-8">
                  <feature.icon className={`mb-4 h-12 w-12 ${feature.color}`} />
                  <h3 className="mb-2 text-xl font-bold text-white">{feature.title}</h3>
                  <p className="text-slate-400">{feature.desc}</p>
                </div>
              </Card3D>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
