// app/dashboard/page.tsx 
// This is the simplest possible server component.
// The session check will now happen safely on the client-side.

import DashboardContent from './DashboardContent';

export const dynamic = 'force-dynamic'; // 💡 ADD THIS LINE

export default function DashboardPage() {
    return <DashboardContent />;
}