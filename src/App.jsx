import { Route, Routes } from "react-router-dom";
import Landing from "./assets/features/main/landingpage/landingpage";
import Signup from "./pages/auth/signup";
import Login from "./pages/auth/login";
import VerifyEmail from "./pages/auth/VerifyEmail";
import UploadValidId from "./pages/onboarding/UploadValidId";
import UploadPhoto from "./pages/onboarding/UploadPhoto";
import UploadProofOfResidence from "./pages/onboarding/UploadProofOfResidence";
import SetTransactionPin from "./pages/onboarding/SetTransactionPin";
import ConfirmTransactionPin from "./pages/onboarding/ConfirmTransactionPin";
import Home from "./pages/home";
import ProtectedRoute from "./components/ProtectedRoute";
import OnboardingRoute from "./components/OnboardingRoute";
import Dashboard from "./components/Dashboard";
import Beneficiary from "./pages/Beneficiary";
import AddBeneficiary from "./pages/AddBeneficiary";
import SendMoney from "./pages/SendMoney";
import TransferSuccess from "./components/TransferSuccess";
import PinVerification from "./components/PinVerification";
import Review from "./components/Review";
import TransactionDetail from "./pages/TransactionDetail";
import TransactionHistory from "./pages/TransactionHistory";
import UploadProofOfResidenceLimit from "./pages/UploadProofOfResidenceLimit";
import UploadProofOfFunds from "./pages/UploadProofOfFunds";
import LimitIncreaseReview from "./pages/LimitIncreaseReview";
import LimitIncreasedSuccess from "./pages/LimitIncreaseSuccess";
import AccountLimits from "./pages/AccounLimit";
import LimitIncreaseFailed from "./pages/LimitIncreaseFailed";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Notifications from "./pages/Notifications";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* Onboarding Routes (Protected) */}
      <Route 
        path="/onboarding/valid-id" 
        element={
          <OnboardingRoute requiredStep="valid-id">
            <UploadValidId />
          </OnboardingRoute>
        } 
      />
      <Route 
        path="/onboarding/photo" 
        element={
          <OnboardingRoute requiredStep="photo">
            <UploadPhoto />
          </OnboardingRoute>
        } 
      />
      <Route 
        path="/onboarding/proof-of-residence" 
        element={
          <OnboardingRoute requiredStep="proof-of-residence">
            <UploadProofOfResidence />
          </OnboardingRoute>
        } 
      />
      <Route 
        path="/onboarding/set-pin" 
        element={
          <OnboardingRoute requiredStep="set-pin">
            <SetTransactionPin />
          </OnboardingRoute>
        } 
      />
      <Route 
        path="/onboarding/confirm-pin" 
        element={
          <OnboardingRoute requiredStep="confirm-pin">
            <ConfirmTransactionPin />
          </OnboardingRoute>
        } 
      />

      {/* Protected Routes - Wrapped in Dashboard */}
      <Route
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        <Route path="/home" element={<Home />} />
        <Route path="/beneficiary" element={<Beneficiary />} />
        <Route path="/transaction-history" element={<TransactionHistory />} />
        <Route path="/account-limits" element={<AccountLimits />} />
        <Route path="/profile" element={<Profile />} />
        
        {/* Add more protected routes here */}
      </Route>
      <Route path="/add-beneficiary" element={
        <ProtectedRoute>
        <AddBeneficiary />
        </ProtectedRoute>
        } />
      <Route path="/send-money" element={
        <ProtectedRoute>
        <SendMoney />
        </ProtectedRoute>
        } />
      <Route path="/review" element={
        <ProtectedRoute>
        <Review />
        </ProtectedRoute>
        } />
      <Route path="/pin-verification" element={
        <ProtectedRoute>
        <PinVerification />
        </ProtectedRoute>
        } />
      <Route path="/transfer-success" element={
        <ProtectedRoute>
        <TransferSuccess />
        </ProtectedRoute>
        } />
      <Route path="/transaction-detail" element={
        <ProtectedRoute>
        <TransactionDetail />
        </ProtectedRoute>
        } />
      <Route path="/upload-proof-of-residence-limit" element={
        <ProtectedRoute>
        <UploadProofOfResidenceLimit />
        </ProtectedRoute>
        } />
      <Route path="/upload-proof-of-funds" element={
        <ProtectedRoute>
        <UploadProofOfFunds />
        </ProtectedRoute>    
        } />
      <Route path="/limit-increase-review" element={
        <ProtectedRoute>
        <LimitIncreaseReview />
        </ProtectedRoute>
        } />
      <Route path="/limit-increase-failed" element={
        <ProtectedRoute>
        <LimitIncreaseFailed />
        </ProtectedRoute>  
        } />
      <Route path="/limit-increased-success" element={
        <ProtectedRoute>
        <LimitIncreasedSuccess />
        </ProtectedRoute>     
        } />
      <Route path="/edit-profile" element={
        <ProtectedRoute>
        <EditProfile />
        </ProtectedRoute>  
        } />
      <Route path="/notifications" element={
        <ProtectedRoute>
        <Notifications />
        </ProtectedRoute>
        } />
      
    </Routes>
  );
}

export default App;