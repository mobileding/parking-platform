import AdminDomainList from '@/components/AdminDomainList';

export default function AdminDomainsPage() {
  return (
    <div className="container mx-auto p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Global Domain Oversight</h1>
        <p className="text-gray-600">
          View and moderate all domains parked on the platform.
        </p>
      </header>
      
      <AdminDomainList />
    </div>
  );
}