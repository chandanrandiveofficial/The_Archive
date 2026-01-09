import { Outlet, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ClientLayout = () => (
  <div className="min-h-screen flex flex-col">
    {/* Replace the old header with the new Navbar component */}
    <Navbar />
    
    <main className="flex-grow container mx-auto p-4">
      <Outlet />
    </main>
    
    <Footer/>
  </div>
);

export default ClientLayout;
