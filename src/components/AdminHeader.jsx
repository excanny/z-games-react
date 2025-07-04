import React from 'react';

const AdminHeader = () => {
  return (
    <header className="text-center mb-8 sm:mb-10 lg:mb-12 text-white px-2">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Z Games Admin Dashboard</h1>
      <p className="text-sm sm:text-base text-blue-200 max-w-2xl mx-auto">
        Manage games, players, and scores in real-time
      </p>
    </header>
  );
};

export default AdminHeader;
