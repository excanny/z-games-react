import zgamesLogo from '../assets/Z Games logo with illustration.png';

const AdminHeader = () => {
  return (

      <header className="flex items-center gap-4 mb-8 sm:mb-10 lg:mb-12 text-white px-4">
        {/* Logo on the left */}
        <img
          src={zgamesLogo}
          alt="Z Games Logo"
          className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
        />

        {/* Text block aligned vertically and centered */}
        <div className="text-center flex-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1">
            Z Games Admin Dashboard
          </h1>
          <p className="text-sm sm:text-base text-blue-200 max-w-2xl mx-auto">
            Manage games, players, and scores in real-time
          </p>
        </div>
      </header>
  );
};

export default AdminHeader;
