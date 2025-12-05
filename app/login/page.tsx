// app/login/page.tsx

import SignInForm from './SignInForm';

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-900">
          Log In to iolab
        </h1>
        
        {/* The dedicated form component will go here */}
        <SignInForm />

        <p className="text-sm text-center text-gray-600">
          Don't have an account? 
          <a href="/signup" className="text-blue-600 hover:text-blue-500 ml-1">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}