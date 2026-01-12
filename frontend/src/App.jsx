import { Routes, Route } from 'react-router-dom';
import ClientLayout from './client/layouts/ClientLayout';
import AdminLayout from './admin/layouts/AdminLayout';

// Client Pages
import Home from './client/pages/Home';
import Login from './client/pages/Login';
import Products from './client/pages/Products';
import Popular from './client/pages/Popular';
import Monthly from './client/pages/Monthly';
import More from './client/pages/More';
import LatestDrops from './client/pages/LatestDrops';
import Privacy from './client/pages/Privacy';
import Terms from './client/pages/Terms';
import ProductManagement from './admin/pages/ProductManagement';
import AddNewProduct from './admin/pages/AddNewProduct';
import EditProduct from './admin/pages/EditProduct';
import ProfileSettings from './admin/pages/ProfileSettings';
import EditorsCuration from './client/pages/EditorsPick';
import AllProducts from './client/pages/AllProducts';
import EditMorePage from './admin/pages/EditMorePage';
import AddMorePage from './admin/pages/AddMorePage';
import MorePage from './admin/pages/MorePage';
import FooterSettings from './admin/pages/FooterSettings';
import CategoryPage from './client/pages/CategoryPage';
import ProductDetail from './client/pages/ProductDetail';
import AdminLogin from './admin/components/AdminLogin';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Client Routes */}
        <Route path="/" element={<ClientLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="products" element={<Products />} />
          <Route path="popular" element={<Popular />} />
          <Route path="allproducts" element={<AllProducts />} />
          <Route path="monthly" element={<Monthly />} />
          <Route path="editorspick" element={<EditorsCuration />} />
          <Route path="more" element={<More />} />
          <Route path="more/:slug" element={<More />} />
          <Route path="category" element={<CategoryPage />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="latest" element={<LatestDrops />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="terms" element={<Terms />} />
        </Route>

        {/* Admin Login */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<ProductManagement />} />
          <Route path="add" element={<AddNewProduct />} />
          <Route path="edit" element={<EditProduct />} />
          <Route path="profile" element={<ProfileSettings />} />
          <Route path="editmorepage/:id" element={<EditMorePage />} />
          <Route path="addmorepage" element={<AddMorePage />} />
          <Route path="morepage" element={<MorePage />} />
          <Route path="footer" element={<FooterSettings />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
