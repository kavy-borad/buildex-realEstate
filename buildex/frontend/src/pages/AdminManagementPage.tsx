import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  UserCog,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Loader2,
  Mail,
  User,
  Lock,
  X,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { API_BASE_URL } from '@/services/api/core';

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt?: string;
}

export default function AdminManagementPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const token = () => localStorage.getItem('auth_token') || '';

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/admins`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      const data = await res.json();
      if (data.success) setAdmins(data.admins || []);
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to fetch admins.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast({ title: 'Missing fields', description: 'Please fill in all fields.', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: 'Admin Created', description: `${form.name} has been added as an admin.` });
        setForm({ name: '', email: '', password: '' });
        setShowForm(false);
        fetchAdmins();
      } else {
        toast({ title: 'Error', description: data.error || 'Failed to create admin.', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Request failed.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (admin: AdminUser) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/admins/${admin._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ isActive: !admin.isActive }),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: `Admin ${!admin.isActive ? 'Activated' : 'Deactivated'}`, description: `${admin.name}'s status has been updated.` });
        fetchAdmins();
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to update status.', variant: 'destructive' });
    }
  };

  const handleDelete = async (admin: AdminUser) => {
    if (!window.confirm(`Delete admin "${admin.name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`${API_BASE_URL}/auth/admins/${admin._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token()}` },
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: 'Admin Deleted', description: `${admin.name} has been removed.` });
        fetchAdmins();
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to delete admin.', variant: 'destructive' });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen px-4 md:px-6 py-4 bg-background/50 space-y-6 pb-32 max-w-[1400px] mx-auto w-full"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Admin Management
          </h1>
          <p className="text-muted-foreground mt-1">Create, manage, and control admin user access.</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Admin
        </Button>
      </motion.div>

      {/* Add Admin Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <UserCog className="w-5 h-5 text-primary" />
              Register New Admin
            </h2>
            <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="John Doe"
                  className="pl-10"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="john@buildex.com"
                  className="pl-10"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Min. 6 characters"
                  className="pl-10"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
            </div>
            <div className="md:col-span-3 flex gap-3 justify-end pt-2">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit" disabled={submitting} className="gap-2">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Create Admin
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Admin List */}
      <motion.div variants={itemVariants} className="space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : admins.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">No admins found.</div>
        ) : (
          admins.map((admin) => (
            <motion.div
              key={admin._id}
              variants={itemVariants}
              className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 flex items-center gap-4 shadow-sm"
            >
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-500 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                {admin.name[0]?.toUpperCase()}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold truncate">{admin.name}</span>
                  {admin.role === 'buildexadmin' && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                      <ShieldCheck className="w-3 h-3" />
                      BUILDEX ADMIN
                    </span>
                  )}
                  {!admin.isActive && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800">
                      INACTIVE
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate">{admin.email}</p>
              </div>

              {/* Role badge */}
              <span className="hidden md:block text-xs text-muted-foreground bg-muted/50 px-3 py-1 rounded-full border border-border/30">
                {admin.role === 'buildexadmin' ? 'Buildex Admin' : 'Admin'}
              </span>

              {/* Actions — don't allow self-deletion or modifying buildexadmin */}
              {admin.role !== 'buildexadmin' && admin._id !== user?.id && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(admin)}
                    title={admin.isActive ? 'Deactivate' : 'Activate'}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {admin.isActive
                      ? <ToggleRight className="w-6 h-6 text-emerald-500" />
                      : <ToggleLeft className="w-6 h-6" />
                    }
                  </button>
                  <button
                    onClick={() => handleDelete(admin)}
                    title="Delete Admin"
                    className="text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              )}
            </motion.div>
          ))
        )}
      </motion.div>
    </motion.div>
  );
}
