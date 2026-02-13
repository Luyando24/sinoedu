import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default async function SiteAccessControlPage({
  params: { locale },
  searchParams
}: {
  params: { locale: string };
  searchParams: { token?: string; action?: string; updated?: string }
}) {
  const SECRET_TOKEN = 'payment-pending-2024-lock'; // This should ideally be an env var
  const { token, action } = searchParams;

  if (token !== SECRET_TOKEN) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Unauthorized Access</h1>
        <p className="text-gray-600">You do not have permission to access this page.</p>
      </div>
    );
  }

  const supabase = createClient();

  // Get current status
  const { data: setting } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'site_locked')
    .single();

  const isLocked = setting?.value === true;

  if (action === 'toggle') {
    const { error } = await supabase
      .from('site_settings')
      .update({ value: !isLocked })
      .eq('key', 'site_locked');

    if (!error) {
      // Redirect back to the same page with updated flag
      redirect(`/${locale}/site-access-control?token=${SECRET_TOKEN}&updated=true`);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-6">Website Access Control</h1>
        
        <div className="mb-8">
          <p className="text-sm uppercase tracking-wider text-gray-500 mb-1">Current Status</p>
          <div className={`text-3xl font-bold ${isLocked ? 'text-red-600' : 'text-green-600'}`}>
            {isLocked ? 'LOCKED' : 'ACTIVE'}
          </div>
        </div>

        <p className="text-gray-600 mb-8">
          {isLocked 
            ? 'The website is currently hidden from all public users.' 
            : 'The website is currently visible to everyone.'}
        </p>

        <form action="">
          <input type="hidden" name="token" value={SECRET_TOKEN} />
          <input type="hidden" name="action" value="toggle" />
          <Button 
            type="submit"
            variant={isLocked ? "default" : "destructive"}
            className="w-full h-12 text-lg font-semibold"
          >
            {isLocked ? 'Unlock Website' : 'Lock Website'}
          </Button>
        </form>

        {searchParams.updated && (
          <p className="mt-4 text-green-600 font-medium">Status updated successfully!</p>
        )}

        <div className="mt-8 pt-6 border-t border-gray-100 text-xs text-gray-400">
          Secret Link Access Only • Do Not Share
        </div>
      </div>
    </div>
  );
}
