import { Lock } from 'lucide-react';

export default async function MaintenancePage() {
  // We can still use translations if we want, or just hardcode for this specific purpose
  // Since it's for "payment pending", maybe a neutral message is better.
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-full mb-6">
            <Lock className="w-10 h-10 text-blue-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Site Temporarily Unavailable
          </h1>
          
          <p className="text-gray-600 mb-8 leading-relaxed">
            We are currently performing scheduled maintenance or updates to improve our services. 
            The website will be back online shortly. Thank you for your patience.
          </p>
          
          <div className="pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Sinoway Education. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
