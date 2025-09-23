import { requireAuth } from '@/lib/auth';
import AdminNavigation from '@/components/admin/AdminNavigation';

export default function ProtectedAdminLayout({ children }) {
  // This will redirect to /admin/login if not authenticated
  const session = requireAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminNavigation session={session} />
      {/* Add left margin to account for sidebar width */}
      <div className="lg:ml-64">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
