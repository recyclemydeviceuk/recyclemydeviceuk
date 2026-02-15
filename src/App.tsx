import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SellYourPhone from './pages/SellYourPhone';
import HowItWorks from './pages/HowItWorks';
import ContactUs from './pages/ContactUs';
import FAQs from './pages/FAQs';
import BecomeASeller from './pages/BecomeASeller';
import PhoneDetail from './pages/PhoneDetail';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import ReviewRecycler from './pages/ReviewRecycler';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import AdminPanel from './pages/AdminPanel';
import AdminLogin from './pages/AdminLogin';
import AdminOTP from './pages/AdminOTP';
import Devices from './pages/admin/Devices';
import AddDevice from './pages/admin/AddDevice';
import EditDevice from './pages/admin/EditDevice';
import OrdersList from './pages/admin/OrdersList';
import OrderDetails from './pages/admin/OrderDetails';
import UtilitiesManagement from './pages/admin/UtilitiesManagement';
import RecyclerManagement from './pages/admin/RecyclerManagement';
import RecyclerDetails from './pages/admin/RecyclerDetails';
import RecyclerMetrics from './pages/admin/RecyclerMetrics';
import CustomerManagement from './pages/admin/CustomerManagement';
import CustomerDetails from './pages/admin/CustomerDetails';
import ContentManagement from './pages/admin/ContentManagement';
import ContactSubmissions from './pages/admin/ContactSubmissions';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedRecyclerRoute from './components/ProtectedRecyclerRoute';
import RecyclerLogin from './pages/recycler/RecyclerLogin';
import RecyclerDashboard from './pages/recycler/RecyclerDashboard';
import RecyclerOrders from './pages/recycler/RecyclerOrders';
import RecyclerProfile from './pages/recycler/RecyclerProfile';
import RecyclerSupport from './pages/recycler/RecyclerSupport';
import RecyclerDevicesAccepted from './pages/recycler/RecyclerDevicesAccepted';
import RecyclerReviews from './pages/recycler/RecyclerReviews';
import AdminReviews from './pages/admin/AdminReviews';
import AddBlogPost from './pages/admin/AddBlogPost';
import EditBlogPost from './pages/admin/EditBlogPost';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sell-your-phone" element={<SellYourPhone />} />
        <Route path="/phone/:id" element={<PhoneDetail />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/review-recycler" element={<ReviewRecycler />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/become-a-seller" element={<BecomeASeller />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        
        {/* Recycler Routes */}
        <Route path="/recycler/login" element={<RecyclerLogin />} />
        <Route 
          path="/recycler/dashboard" 
          element={
            <ProtectedRecyclerRoute>
              <RecyclerDashboard />
            </ProtectedRecyclerRoute>
          } 
        />
        <Route 
          path="/recycler/devices-accepted" 
          element={
            <ProtectedRecyclerRoute>
              <RecyclerDevicesAccepted />
            </ProtectedRecyclerRoute>
          } 
        />
        <Route 
          path="/recycler/orders" 
          element={
            <ProtectedRecyclerRoute>
              <RecyclerOrders />
            </ProtectedRecyclerRoute>
          } 
        />
        <Route 
          path="/recycler/profile" 
          element={
            <ProtectedRecyclerRoute>
              <RecyclerProfile />
            </ProtectedRecyclerRoute>
          } 
        />
        <Route 
          path="/recycler/support" 
          element={
            <ProtectedRecyclerRoute>
              <RecyclerSupport />
            </ProtectedRecyclerRoute>
          } 
        />
        <Route 
          path="/recycler/reviews" 
          element={
            <ProtectedRecyclerRoute>
              <RecyclerReviews />
            </ProtectedRecyclerRoute>
          } 
        />
        
        {/* Admin Routes */}
        <Route path="/panel/login" element={<AdminLogin />} />
        <Route path="/panel/verify-otp" element={<AdminOTP />} />
        <Route 
          path="/panel" 
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/panel/devices" 
          element={
            <ProtectedRoute>
              <Devices />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/panel/devices/add" 
          element={
            <ProtectedRoute>
              <AddDevice />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/panel/devices/edit/:id" 
          element={
            <ProtectedRoute>
              <EditDevice />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/panel/orders" 
          element={
            <ProtectedRoute>
              <OrdersList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/panel/orders/:id" 
          element={
            <ProtectedRoute>
              <OrderDetails />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/panel/utilities" 
          element={
            <ProtectedRoute>
              <UtilitiesManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/panel/recyclers" 
          element={
            <ProtectedRoute>
              <RecyclerManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/panel/recyclers/:id" 
          element={
            <ProtectedRoute>
              <RecyclerDetails />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/panel/recycler-metrics" 
          element={
            <ProtectedRoute>
              <RecyclerMetrics />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/panel/customers" 
          element={
            <ProtectedRoute>
              <CustomerManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/panel/customers/:id" 
          element={
            <ProtectedRoute>
              <CustomerDetails />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/panel/content" 
          element={
            <ProtectedRoute>
              <ContentManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/panel/contact-submissions" 
          element={
            <ProtectedRoute>
              <ContactSubmissions />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/panel/reviews" 
          element={
            <ProtectedRoute>
              <AdminReviews />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/panel/blog/add" 
          element={
            <ProtectedRoute>
              <AddBlogPost />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/panel/blog/edit/:id" 
          element={
            <ProtectedRoute>
              <EditBlogPost />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </>
  );
}

export default App;
