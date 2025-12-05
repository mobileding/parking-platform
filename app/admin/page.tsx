import Link from 'next/link';

export default function AdminDashboardPage() {
  return (
    <div className="container mx-auto p-8">
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-indigo-700">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Platform Overview & Management</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* User Management Card */}
        <Link href="/admin/users" className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Users</h2>
          <p className="text-gray-600">
            View, disable, or delete user accounts. Manage seller permissions.
          </p>
          <div className="mt-4 text-indigo-600 font-medium">Manage Users →</div>
        </Link>

        {/* Domain Oversight Card (Future Feature) */}
 <Link href="/admin/domains" className="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Domains</h2>
          <p className="text-gray-600">
            Oversee all parked domains, flag inappropriate content, or feature listings.
          </p>
          <div className="mt-4 text-indigo-600 font-medium">Manage Domains →</div>
        </Link>

        {/* Analytics Card (Future Feature) */}
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg opacity-75">
          <h2 className="text-xl font-bold text-gray-500 mb-2">Analytics (Coming Soon)</h2>
          <p className="text-gray-500">
            View platform traffic, total sales, and active parking stats.
          </p>
        </div>

      </div>
    </div>
  );
}