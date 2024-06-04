'use client';

import { useUser } from '@clerk/nextjs';

export const WelcomeMessage = () => {
  const { user, isLoaded } = useUser();

  return (
    <div className="mb-2 space-y-2">
      <h2 className="text-2xl lg:text-4xl text-white font-medium">
        Welcome back{isLoaded ? ', ' : ' '}
        {user?.firstName} 👋🏻
      </h2>
      <p className="text-sm lg:text-base text-[#89b6fd]">
        This is your overview report
      </p>
    </div>
  );
};
