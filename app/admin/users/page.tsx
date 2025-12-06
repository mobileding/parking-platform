import AdminUserList from '@/components/AdminUserList';


export const dynamic = 'force-dynamic';
export default function AdminUsersPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">User Management</h1>
      <p className="mb-8 text-gray-600">
        Manage registered users, check their status, and moderate the platform.
      </p>
      
      <AdminUserList />
    </div>
  );
}