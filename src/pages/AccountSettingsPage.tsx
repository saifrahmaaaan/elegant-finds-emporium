import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import PageLayout from '@/components/PageLayout';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const TITLES = ['Mr.', 'Ms.', 'Mrs.', 'Dr.', 'Mx.'];
const COUNTRIES = ['United States', 'Canada', 'United Kingdom', 'Australia', 'India']; // Add more as needed

const AccountSettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState('Mr.');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [newsletter, setNewsletter] = useState(true);
  const [initialFirstName, setInitialFirstName] = useState('');
  const [initialLastName, setInitialLastName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      setFirstName(user.user_metadata?.first_name || '');
      setLastName(user.user_metadata?.last_name || '');
      setInitialFirstName(user.user_metadata?.first_name || '');
      setInitialLastName(user.user_metadata?.last_name || '');
      setTitle(user.user_metadata?.title || TITLES[0]);
      setCountry(user.user_metadata?.country || '');
      setDob(user.user_metadata?.dob || '');
      setNewsletter(user.user_metadata?.newsletter !== false); // default to true
    }
  }, [user]);

  const isDirty = firstName !== initialFirstName || lastName !== initialLastName;

  const handleSave = async () => {
    if (!isDirty || !user) return;
    setSaving(true);
    const updates = {
      data: {
        ...user.user_metadata,
        first_name: firstName,
        last_name: lastName,
      },
    };
    const { error } = await supabase.auth.updateUser(updates);
    setSaving(false);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Profile Updated', description: 'Your name has been updated.' });
      setInitialFirstName(firstName);
      setInitialLastName(lastName);
    }
  };

  return (
    <PageLayout title="Account Settings">
      <div className="max-w-2xl mx-auto bg-white rounded-none p-8 mt-8 mb-16 shadow-sm border border-gray-100">
        <h2 className="font-garamond text-2xl font-semibold mb-8 text-center tracking-widest">MY PERSONAL DETAILS</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div>
            <label className="block text-xs font-medium mb-2 uppercase tracking-wide">TITLE*</label>
            <select value={title} disabled className="w-full border px-3 py-2 rounded-none bg-gray-50 text-base opacity-60 cursor-not-allowed">
              {TITLES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-2 uppercase tracking-wide">FIRST NAME*</label>
            <Input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First Name" className="rounded-none" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-2 uppercase tracking-wide">LAST NAME*</label>
            <Input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last Name" className="rounded-none" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-2 uppercase tracking-wide">COUNTRY / REGION*</label>
            <select value={country} disabled className="w-full border px-3 py-2 rounded-none bg-gray-50 text-base opacity-60 cursor-not-allowed">
              <option value="">Not set</option>
              {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

        </div>
        <h2 className="font-garamond text-2xl font-semibold mb-8 text-center tracking-widest">MY CREDENTIALS</h2>
        <div className="mb-10">
          <label className="block text-xs font-medium mb-2 uppercase tracking-wide">EMAIL*</label>
          <Input value={email} disabled className="rounded-none opacity-60 cursor-not-allowed" placeholder="Email" />
        </div>
        <h3 className="font-semibold text-base mb-3">PRIVACY SETTINGS</h3>
        <div className="flex items-start mb-6">
          <input type="checkbox" checked={newsletter} onChange={e => setNewsletter(e.target.checked)} className="mt-1 mr-2" />
          <span className="text-xs text-gray-700">I would like to receive updates about new activities, exclusive products, tailored services and to have a personalised client experience based on my interests.</span>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          Privacy laws may grant you certain rights such as the right to access, delete, modify and rectify your data, or to restrict or object to processing, as well as the right to data portability. You can also lodge a complaint with your competent regulator. You can withdraw your consent or delete your profile at any time. For further information regarding our privacy practices and your rights, please contact us at <a href="mailto:privacy@elegantfinds.com" className="underline">privacy@elegantfinds.com</a>.
        </p>
        <div className="flex justify-end items-center mt-8">
          <Button 
            className={`bg-black text-white px-8 py-2 rounded-none ${isDirty && !saving ? 'opacity-100 cursor-pointer' : 'opacity-60 cursor-not-allowed'}`}
            disabled={!isDirty || saving}
            onClick={handleSave}
          >
            {saving ? 'Saving...' : 'SAVE CHANGES'}
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default AccountSettingsPage;
