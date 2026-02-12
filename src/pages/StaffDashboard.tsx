import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card3D } from '@/components/ui/3DCard';
import { FileText, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Student = {
  id: string;
  full_name: string;
  roll_number: string;
  batch: string;
  files: {
    id: string;
    name: string;
    url: string;
    created_at: string;
  }[];
};

export const StaffDashboard = () => {
  const { profile } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('All');
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      // Fetch profiles with role 'student'
      // Note: In a real app, you'd use a join query or separate queries.
      // Supabase join syntax: .select('*, files(*)')
      
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          roll_number,
          batch,
          files (
            id,
            name,
            url,
            created_at
          )
        `)
        .eq('role', 'student');

      if (error) throw error;
      setStudents(data as any || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const batches = ['All', ...Array.from(new Set(students.map(s => s.batch).filter(Boolean)))];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.roll_number?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBatch = selectedBatch === 'All' || student.batch === selectedBatch;
    return matchesSearch && matchesBatch;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Staff Dashboard</h1>
        <p className="text-slate-400">Welcome, {profile?.full_name}</p>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card3D className="md:col-span-1">
            <div className="glass-card flex h-full flex-col justify-center rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white">Total Students</h3>
                <p className="text-4xl font-bold text-indigo-400">{students.length}</p>
            </div>
        </Card3D>
         <Card3D className="md:col-span-2">
             <div className="glass-card flex h-full items-center rounded-2xl p-6">
                 <div className="flex w-full gap-4">
                     <div className="flex-1">
                        <Input
                            placeholder="Search by name or roll number..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                     </div>
                     <select
                        className="glass rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        value={selectedBatch}
                        onChange={(e) => setSelectedBatch(e.target.value)}
                     >
                        {batches.map(batch => (
                            <option key={batch} value={batch as string} className="bg-slate-900">
                                {batch}
                            </option>
                        ))}
                     </select>
                 </div>
             </div>
         </Card3D>
      </div>

      <div className="space-y-4">
        {filteredStudents.map((student) => (
          <motion.div
            key={student.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass overflow-hidden rounded-xl"
          >
            <div 
                className="flex cursor-pointer items-center justify-between p-4 hover:bg-white/5"
                onClick={() => setExpandedStudent(expandedStudent === student.id ? null : student.id)}
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
                    {student.full_name?.[0]}
                </div>
                <div>
                  <h4 className="font-medium text-white">{student.full_name}</h4>
                  <p className="text-xs text-slate-400">{student.roll_number} • {student.batch}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                {expandedStudent === student.id ? <ChevronUp /> : <ChevronDown />}
              </Button>
            </div>

            <AnimatePresence>
              {expandedStudent === student.id && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="bg-slate-900/50 px-4"
                >
                  <div className="border-t border-white/10 py-4">
                    <h5 className="mb-3 text-sm font-semibold text-slate-300">Uploaded Documents</h5>
                    {student.files && student.files.length > 0 ? (
                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {student.files.map((file) => (
                          <a 
                            key={file.id} 
                            href={file.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 rounded-lg bg-slate-800 p-3 hover:bg-slate-700 transition-colors"
                          >
                            <FileText className="h-4 w-4 text-indigo-400" />
                            <span className="truncate text-sm text-slate-200">{file.name}</span>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500">No documents uploaded.</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
        
        {filteredStudents.length === 0 && (
            <div className="text-center py-12 text-slate-500">
                No students found matching your criteria.
            </div>
        )}
      </div>
    </div>
  );
};
