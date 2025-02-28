'use client';

import React from 'react';
import LoginButton from '../components/login';
import AuthButton from '../components/SessionProviderWrapper';

const Page: React.FC = () => {
  return (
    <div>
      <AuthButton>
        <div>{<LoginButton/>}</div>
      </AuthButton>
    </div>
  );
};

export default Page;