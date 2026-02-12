import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card3D } from '@/components/ui/3DCard';
import { FileText, Upload, Trash2, Download } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

type FileRecord = {
  id: string;
  name: string;
  url: string;
  size: number;
  created_at: string;
};

export const StudentDashboard = () => {
  const { user, profile } = useAuth();
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) fetchFiles();
  }, [user]);

  const fetchFiles = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFiles(data || []);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !user) return;

    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    setUploading(true);

    try {
      // 1. Upload to Storage
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      // 3. Save metadata to Database
      const { error: dbError } = await supabase
        .from('files')
        .insert({
          user_id: user.id,
          name: file.name,
          url: publicUrl,
          size: file.size,
          type: file.type,
        });

      if (dbError) throw dbError;

      toast.success('File uploaded successfully');
      fetchFiles();
    } catch (error: any) {
      toast.error(error.message || 'Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileId: string, fileName: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
        // Note: Real deletion from storage requires parsing the path from the URL or storing the path.
        // For this demo, we'll just delete the DB record.
        // In a real app, you'd store the storage path in the DB too.
      
      const { error } = await supabase
        .from('files')
        .delete()
        .eq('id', fileId);

      if (error) throw error;
      
      setFiles(files.filter(f => f.id !== fileId));
      toast.success('File deleted');
    } catch (error) {
      toast.error('Error deleting file');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Student Dashboard</h1>
        <p className="text-slate-400">Welcome, {profile?.full_name}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Profile Card */}
        <Card3D className="lg:col-span-1">
          <div className="glass-card h-full rounded-2xl p-6">
            <h3 className="mb-4 text-xl font-bold text-white">My Profile</h3>
            <div className="space-y-4 text-slate-300">
              <div>
                <label className="text-xs text-slate-500 uppercase">Full Name</label>
                <p className="font-medium text-white">{profile?.full_name}</p>
              </div>
              <div>
                <label className="text-xs text-slate-500 uppercase">Roll Number</label>
                <p className="font-medium text-white">{profile?.roll_number}</p>
              </div>
              <div>
                <label className="text-xs text-slate-500 uppercase">Batch</label>
                <p className="font-medium text-white">{profile?.batch}</p>
              </div>
              <div>
                <label className="text-xs text-slate-500 uppercase">Email</label>
                <p className="font-medium text-white">{user?.email}</p>
              </div>
            </div>
          </div>
        </Card3D>

        {/* Documents Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">My Documents</h2>
            <div className="relative">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileUpload}
                disabled={uploading}
              />
              <label htmlFor="file-upload">
                <Button as="span" className="cursor-pointer" isLoading={uploading}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload New
                </Button>
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {files.length === 0 ? (
                 <motion.div 
                   initial={{ opacity: 0 }} 
                   animate={{ opacity: 1 }}
                   className="rounded-xl border border-dashed border-slate-700 p-12 text-center text-slate-500"
                 >
                   <FileText className="mx-auto mb-4 h-12 w-12 opacity-50" />
                   <p>No documents uploaded yet</p>
                 </motion.div>
              ) : (
                files.map((file) => (
                  <motion.div
                    key={file.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="glass flex items-center justify-between rounded-xl p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="rounded-lg bg-indigo-500/10 p-3 text-indigo-400">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{file.name}</h4>
                        <p className="text-xs text-slate-400">
                          {(file.size / 1024 / 1024).toFixed(2)} MB • {new Date(file.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <a href={file.url} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="icon" title="Download">
                          <Download className="h-4 w-4" />
                        </Button>
                      </a>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-400 hover:text-red-300"
                        onClick={() => handleDelete(file.id, file.name)}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
