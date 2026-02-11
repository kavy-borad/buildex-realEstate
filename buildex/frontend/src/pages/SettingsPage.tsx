import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  Save,
  MapPin,
  Phone,
  Mail,
  Globe,
  CreditCard,
  Palette,
  Moon,
  Sun,
  LayoutTemplate,
  User,
  Shield,
  Lock,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useQuotations } from '@/contexts/QuotationContext';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/components/theme-provider'; // Assuming theme provider exists or I'll just mock it visually for now if not
import { CompanyDetails } from '@/types/quotation';

export default function SettingsPage() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const { companyDetails, updateCompanyDetails } = useQuotations();
  const { user } = useAuth();
  const [formData, setFormData] = useState<CompanyDetails>(companyDetails);
  const [activeTab, setActiveTab] = useState<'profile' | 'company' | 'appearance'>('profile');

  // Sync state with context when context loads
  useEffect(() => {
    setFormData(companyDetails);
  }, [companyDetails]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSave = () => {
    updateCompanyDetails(formData);
    toast({
      title: 'Settings Saved',
      description: 'Your company details have been updated successfully.',
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (

    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen px-6 py-4 bg-background/50 space-y-6 pb-32 max-w-[1600px] mx-auto w-full"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 w-fit">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your company profile, branding, and application preferences.
        </p>
      </motion.div>

      <div className="flex flex-col gap-6">
        {/* Horizontal Navigation Tabs */}
        <motion.div variants={itemVariants} className="flex flex-wrap gap-2 pb-4 border-b border-border/40">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${activeTab === 'profile'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              }`}
          >
            <User className="w-4 h-4" />
            Profile
          </button>
          <button
            onClick={() => setActiveTab('company')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${activeTab === 'company'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              }`}
          >
            <Building2 className="w-4 h-4" />
            Company Profile
          </button>
          <button
            onClick={() => setActiveTab('appearance')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${activeTab === 'appearance'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              }`}
          >
            <Palette className="w-4 h-4" />
            Appearance
          </button>
        </motion.div>

        {/* Content Area */}
        <div className="w-full">
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border/50">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg text-3xl font-bold border-4 border-background">
                    {user?.name?.[0] || 'A'}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{user?.name || 'Admin User'}</h2>
                    <p className="text-muted-foreground flex items-center gap-2">
                      <Shield className="w-3 h-3 text-emerald-500" />
                      {user?.role || 'Administrator'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input value={user?.name || ''} readOnly className="pl-10 bg-muted/20" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input value={user?.email || ''} readOnly className="pl-10 bg-muted/20" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input type="password" value="********" readOnly className="pl-10 bg-muted/20" />
                    </div>
                    <Button variant="link" className="p-0 h-auto text-xs text-primary" onClick={() => toast({ title: "Feature coming soon", description: "This feature is under development." })}>Change Password</Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          {activeTab === 'company' && (
            <motion.div
              key="company"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border/50">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center text-white shadow-lg overflow-hidden">
                    {formData.logo ? (
                      <img src={formData.logo} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <Building2 className="w-8 h-8" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Company Information</h2>
                    <p className="text-sm text-muted-foreground">This information will appear on your quotations.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Logo URL */}
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="logo">Company Logo URL</Label>
                    <div className="relative">
                      <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="logo"
                        value={formData.logo || ''}
                        onChange={handleChange}
                        placeholder="https://example.com/logo.png"
                        className="pl-10 bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20 rounded-xl"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Provide a direct URL to your company logo (PNG/JPG).</p>
                  </div>
                  {/* Company Name */}
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="name">Company Name</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="pl-10 bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20 rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Tagline */}
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="tagline">Tagline (Optional)</Label>
                    <div className="relative">
                      <LayoutTemplate className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="tagline"
                        value={formData.tagline || ''}
                        onChange={handleChange}
                        placeholder="e.g. Building Dreams into Reality"
                        className="pl-10 bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20 rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="pl-10 bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20 rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="pl-10 bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20 rounded-xl"
                      />
                    </div>
                  </div>

                  {/* GST */}
                  <div className="space-y-2">
                    <Label htmlFor="gstNumber">GST Number</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="gstNumber"
                        value={formData.gstNumber}
                        onChange={handleChange}
                        className="pl-10 bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20 rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Office Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="pl-10 bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-border/50 flex justify-end">
                  <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 shadow-sm hover:shadow text-primary-foreground rounded-xl px-8 h-12">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'appearance' && (
            <motion.div
              key="appearance"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold">Theme Preferences</h2>
                  <p className="text-sm text-muted-foreground">Customize how BuildEx looks.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div
                    onClick={() => setTheme("light")}
                    className={`border rounded-xl p-4 cursor-pointer relative transition-all ${theme === 'light'
                      ? 'border-primary ring-2 ring-primary ring-offset-2 ring-offset-background bg-primary/5'
                      : 'border-border hover:bg-muted/50'
                      }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-white shadow-sm border border-gray-100">
                        <Sun className="w-5 h-5 text-orange-500" />
                      </div>
                      <span className="font-medium">Light Mode</span>
                    </div>
                    <div className="h-24 bg-white rounded-lg border border-gray-100 p-2 space-y-2 opacity-75">
                      <div className="h-2 w-2/3 bg-gray-100 rounded"></div>
                      <div className="h-2 w-full bg-gray-100 rounded"></div>
                      <div className="h-2 w-1/2 bg-gray-100 rounded"></div>
                    </div>
                    {theme === 'light' && (
                      <div className="absolute top-4 right-4 w-4 h-4 bg-primary rounded-full" />
                    )}
                  </div>

                  <div
                    onClick={() => setTheme("dark")}
                    className={`border rounded-xl p-4 cursor-pointer relative transition-all ${theme === 'dark'
                      ? 'border-primary ring-2 ring-primary ring-offset-2 ring-offset-background bg-primary/5'
                      : 'border-border hover:bg-muted/50'
                      }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-gray-900 shadow-sm border border-gray-800">
                        <Moon className="w-5 h-5 text-blue-400" />
                      </div>
                      <span className="font-medium">Dark Mode</span>
                    </div>
                    <div className="h-24 bg-gray-900 rounded-lg border border-gray-800 p-2 space-y-2 opacity-75">
                      <div className="h-2 w-2/3 bg-gray-800 rounded"></div>
                      <div className="h-2 w-full bg-gray-800 rounded"></div>
                      <div className="h-2 w-1/2 bg-gray-800 rounded"></div>
                    </div>
                    {theme === 'dark' && (
                      <div className="absolute top-4 right-4 w-4 h-4 bg-primary rounded-full" />
                    )}
                  </div>

                  <div
                    onClick={() => setTheme("system")}
                    className={`border rounded-xl p-4 cursor-pointer relative transition-all ${theme === 'system'
                      ? 'border-primary ring-2 ring-primary ring-offset-2 ring-offset-background bg-primary/5'
                      : 'border-border hover:bg-muted/50'
                      }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 shadow-sm border border-gray-200">
                        <Globe className="w-5 h-5 text-purple-500" />
                      </div>
                      <span className="font-medium">System</span>
                    </div>
                    <div className="h-24 bg-gray-50 rounded-lg border border-gray-200 p-2 space-y-2 opacity-75 relative overflow-hidden">
                      <div className="absolute inset-0 flex">
                        <div className="w-1/2 bg-white"></div>
                        <div className="w-1/2 bg-gray-900"></div>
                      </div>
                    </div>
                    {theme === 'system' && (
                      <div className="absolute top-4 right-4 w-4 h-4 bg-primary rounded-full" />
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
