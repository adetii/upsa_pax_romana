import { Routes, Route } from 'react-router-dom'
import Home from './pages/public/Home.jsx'
import './App.css'
import VotePage from './pages/public/VotePage.jsx'
import PaymentSuccess from './pages/public/PaymentSuccess.jsx'
import PaymentFailed from './pages/public/PaymentFailed.jsx'
import PublicResults from './pages/public/PublicResults.jsx'
import AdminLogin from './pages/admin/AdminLogin.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AdminResults from './pages/admin/AdminResults.jsx'
import AdminCandidates from './pages/admin/AdminCandidates.jsx'
import AdminPositions from './pages/admin/AdminPositions.jsx'
import AdminTransactions from './pages/admin/AdminTransactions.jsx'
import Settings from './pages/admin/Settings.jsx'
import AdminManagement from './pages/admin/AdminManagement.jsx'
import AdminCategories from './pages/admin/AdminCategories.jsx'
import NationalVoting from './pages/public/NationalVoting.jsx'
import ForgotPassword from './pages/public/ForgotPassword.jsx'
import ResetPassword from './pages/public/ResetPassword.jsx'
import AdminLayout from './components/AdminLayout.jsx'
import PublicLayout from './components/PublicLayout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import AdminProfile from './pages/admin/AdminProfile.jsx'
import About from './pages/public/About.jsx'
import FAQ from './pages/public/FAQ.jsx'

export default function App() {
  return (
    <Routes>
      {/* Public routes with public layout */}
      <Route path="/" element={<PublicLayout />}> 
        <Route index element={<Home />} />
        <Route path="vote" element={<VotePage />} />
        <Route path="vote/national" element={<NationalVoting />} />
        <Route path="results" element={<PublicResults />} />
        <Route path="about" element={<About />} />
        <Route path="faq" element={<FAQ />} />
      </Route>
      
      {/* Payment routes without layout */}
      <Route path="/payment/success" element={<PaymentSuccess />} />
      <Route path="/payment/failed" element={<PaymentFailed />} />
      
      {/* Auth routes without layout */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      {/* Admin routes with admin layout */}
      <Route path="/admin" element={<AdminLayout />}> 
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="results" element={<AdminResults />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="candidates" element={<AdminCandidates />} />
        <Route path="positions" element={<AdminPositions />} />
        <Route path="transactions" element={<AdminTransactions />} />
        <Route path="settings" element={
          <ProtectedRoute requiredRole="super_admin">
            <Settings />
          </ProtectedRoute>
        } />
        <Route path="admin-management" element={
          <ProtectedRoute requiredRole="super_admin">
            <AdminManagement />
          </ProtectedRoute>
        } />
        <Route path="profile" element={
          <ProtectedRoute requiredRole="admin">
            <AdminProfile />
          </ProtectedRoute>
        } />
      </Route>
    </Routes>
  )
}
