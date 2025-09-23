export const metadata = {
  title: 'Admin Panel - Portfolio',
  description: 'Admin panel for managing portfolio content',
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {children}
    </div>
  );
}
