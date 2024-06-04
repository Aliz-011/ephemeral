import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { SignUp, ClerkLoaded, ClerkLoading } from '@clerk/nextjs';

const SignInPage = () => {
  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="h-full lg:flex flex-col items-center justify-center px-4">
        <div className="text-center space-y-4 pt-16">
          <h1 className="font-bold text-3xl text-[#2e2a47]">Welcome back!</h1>
          <p className="text-base text-[#7e8ca0]">
            Login or create account to continue.
          </p>
        </div>
        <div className="flex items-center justify-center mt-8">
          <ClerkLoaded>
            <SignUp path="/sign-up" />
          </ClerkLoaded>
          <ClerkLoading>
            <Loader2 className="animate-spin text-muted-foreground size-6" />
          </ClerkLoading>
        </div>
      </div>

      <div className="h-full bg-indigo-600 hidden lg:flex items-center justify-center">
        <Image src="/logo.svg" alt="logo" width={100} height={100} />
      </div>
    </main>
  );
};

export default SignInPage;
