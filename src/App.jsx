import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import SuspenseLoader from './components/ui/SuspenseLoader';
import FloatingActionButtons from './components/ui/FloatingActionButtons';
import ChatBotWidget from './components/ui/ChatBotWidget';
import EnquiryModal from './components/ui/EnquiryModal';
import './styles/globals.css';

// Admin Portal
import { AdminAuthProvider as AuthProvider } from './admin/context/AdminAuthContext';
import { ToastProvider } from './admin/components/ui/Toast';
import ProtectedRoute from './admin/utils/ProtectedRoute';
import { PermissionRoute } from './components/auth/PermissionRoute';
import { Unauthorized } from './components/auth/Unauthorized';
import { runLocalStorageMigration } from './admin/utils/migrateLocalStorage';
import AdminLoginPage from './admin/pages/AdminLoginPage';
import { Dashboard } from './pages/admin/Dashboard';
import { CMSManagement } from './pages/admin/CMSManagement';
import { ChatbotProvider } from './context/ChatbotContext';
const AdminDashboard = lazy(() => import('./admin/pages/AdminDashboard'));
const DashboardOverview = lazy(() => import('./admin/components/dashboard/DashboardOverview'));
const HomePageEditor = lazy(() => import('./admin/components/editors/HomePageEditor'));
const AboutEditor = lazy(() => import('./admin/components/editors/AboutEditor'));
const CoursesEditor = lazy(() => import('./admin/components/editors/CoursesEditor'));
const AcademicsEditor = lazy(() => import('./admin/components/editors/AcademicsEditor'));
const AdmissionsEditor = lazy(() => import('./admin/components/editors/AdmissionsEditor'));
const FacultyEditor = lazy(() => import('./admin/components/editors/FacultyEditor'));
const GalleryEditor = lazy(() => import('./admin/components/editors/GalleryEditor'));
const SEOEditor = lazy(() => import('./admin/components/editors/SEOEditor'));
const PlaceholderEditor = lazy(() => import('./admin/components/editors/PlaceholderEditor'));
const DepartmentCMSEditor = lazy(() => import('./admin/components/editors/DepartmentCMSEditor'));
const UserManagementEditor = lazy(() => import('./admin/components/editors/UserManagementEditor'));
const ProfileSettingsEditor = lazy(() => import('./admin/components/editors/admin/ProfileSettingsEditor'));
const ChangePasswordEditor = lazy(() => import('./admin/components/editors/admin/ChangePasswordEditor'));
const ActivityLogsEditor = lazy(() => import('./admin/components/editors/admin/ActivityLogsEditor'));
const NotificationsEditor = lazy(() => import('./admin/components/editors/admin/NotificationsEditor'));
const ChatbotSettingsEditor = lazy(() => import('./admin/components/editors/ChatbotSettingsEditor'));
const ChatbotWelcomeEditor = lazy(() => import('./admin/components/editors/ChatbotWelcomeEditor'));
const AdmissionLeadsPage = lazy(() => import('./admin/pages/AdmissionLeadsPage'));

// About Editors
const InstitutionEditor = lazy(() => import('./admin/components/editors/about/InstitutionEditor'));
const PeoplesMessagesEditor = lazy(() => import('./admin/components/editors/about/PeoplesMessagesEditor'));
const AntiRaggingEditor = lazy(() => import('./admin/components/editors/about/AntiRaggingEditor'));
const ValuesPhilosophyEditor = lazy(() => import('./admin/components/editors/about/ValuesPhilosophyEditor'));
const GovApprovalEditor = lazy(() => import('./admin/components/editors/about/GovApprovalEditor'));
const GoverningPolicyEditor = lazy(() => import('./admin/components/editors/about/GoverningPolicyEditor'));
const RefundPolicyEditor = lazy(() => import('./admin/components/editors/about/RefundPolicyEditor'));
const TermsEditor = lazy(() => import('./admin/components/editors/about/TermsEditor'));
const PrivacyPolicyEditor = lazy(() => import('./admin/components/editors/about/PrivacyPolicyEditor'));

// Academic Editors
const TeachingMethodologyEditor = lazy(() => import('./admin/components/editors/academics/TeachingMethodologyEditor'));
const CampusFacilitiesEditor = lazy(() => import('./admin/components/editors/academics/CampusFacilitiesEditor'));
const SportsEditor = lazy(() => import('./admin/components/editors/academics/SportsEditor'));
const CampusLifeEditor = lazy(() => import('./admin/components/editors/academics/CampusLifeEditor'));
const AcademicCalendarEditor = lazy(() => import('./admin/components/editors/academics/AcademicCalendarEditor'));
const ListHolidaysEditor = lazy(() => import('./admin/components/editors/academics/ListHolidaysEditor'));
const SyllabusEditor = lazy(() => import('./admin/components/editors/academics/SyllabusEditor'));

// Admissions Editors
const AdmissionRegistrationEditor = lazy(() => import('./admin/components/editors/admissions/AdmissionRegistrationEditor'));
const AdmissionProcedureEditor = lazy(() => import('./admin/components/editors/admissions/AdmissionProcedureEditor'));
const ScholarshipsEditor = lazy(() => import('./admin/components/editors/admissions/ScholarshipsEditor'));
const EducationLoanEditor = lazy(() => import('./admin/components/editors/admissions/EducationLoanEditor'));
const PaymentsEditor = lazy(() => import('./admin/components/editors/admissions/PaymentsEditor'));

// Research & Contact Editors
const ResearchEditor = lazy(() => import('./admin/components/editors/research/ResearchEditor'));
const ContactUsEditor = lazy(() => import('./admin/components/editors/contact/ContactUsEditor'));

// Updates & Placements
const LatestEventsEditor = lazy(() => import('./admin/components/editors/updates/LatestEventsEditor'));
const PlacementUpdatesEditor = lazy(() => import('./admin/components/editors/updates/PlacementUpdatesEditor'));
const AnnouncementsEditor = lazy(() => import('./admin/components/editors/updates/AnnouncementsEditor'));
const NewsletterEditor = lazy(() => import('./admin/components/editors/updates/NewsletterEditor'));
const RecruitersEditor = lazy(() => import('./admin/components/editors/placements/RecruitersEditor'));
const StudentsPlacedEditor = lazy(() => import('./admin/components/editors/placements/StudentsPlacedEditor'));

// Homepage Editors
const NavbarEditor = lazy(() => import('./admin/components/editors/homepage/NavbarEditor'));
const HeroEditor = lazy(() => import('./admin/components/editors/homepage/HeroEditor'));
const StatsEditor = lazy(() => import('./admin/components/editors/homepage/StatsEditor'));
const AcademicDeptEditor = lazy(() => import('./admin/components/editors/homepage/AcademicDeptEditor'));
const PlacementExcellenceEditor = lazy(() => import('./admin/components/editors/homepage/PlacementExcellenceEditor'));
const ContactSectionEditor = lazy(() => import('./admin/components/editors/homepage/ContactSectionEditor'));
const FooterEditor = lazy(() => import('./admin/components/editors/homepage/FooterEditor'));

// Content & Admin (Placeholders)

// Lazy load the heavy department architecture
const DepartmentsOverviewPage = lazy(() => import('./pages/departments/DepartmentsOverviewPage'));

// Lazy load the About module pages
const AboutLayout = lazy(() => import('./pages/about/AboutLayout'));
const InstitutionPage = lazy(() => import('./pages/about/InstitutionPage'));
const TeachingMethodologyPage = lazy(() => import('./pages/about/TeachingMethodologyPage'));
const CampusFacilityPage = lazy(() => import('./pages/about/CampusFacilityPage'));
const CampusLifePage = lazy(() => import('./pages/about/CampusLifePage'));
const AcademicCalendarPage = lazy(() => import('./pages/about/AcademicCalendarPage'));
const ListHolidaysPage = lazy(() => import('./pages/about/ListHolidaysPage'));
const SyllabusPage = lazy(() => import('./pages/about/SyllabusPage'));
const InstitutionHero = lazy(() => import('./pages/about/InstitutionHero'));
const SportsPage = lazy(() => import('./pages/about/SportsPage'));

// Lazy load the Academics module pages
const AcademicsLayout = lazy(() => import('./pages/academics/AcademicsLayout'));
const AcademicsSportsPage = lazy(() => import('./pages/academics/SportsPage'));
const ResearchPage = lazy(() => import('./pages/ResearchPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const StudentsPlacedPage = lazy(() => import('./pages/placements/StudentsPlacedPage'));
const RecruitersPage = lazy(() => import('./pages/placements/RecruitersPage'));
const PeoplesMessagePage = lazy(() => import('./pages/about/PeoplesMessagePage'));
const AntiRaggingPage = lazy(() => import('./pages/about/AntiRaggingPage'));
const ValuesPhilosophyPage = lazy(() => import('./pages/about/ValuesPhilosophyPage'));
const GovernmentApprovalPage = lazy(() => import('./pages/about/GovernmentApprovalPage'));
const GoverningCouncilPage = lazy(() => import('./pages/about/GoverningCouncilPage'));
const RefundPolicyPage = lazy(() => import('./pages/about/RefundPolicyPage'));
const TermsConditionsPage = lazy(() => import('./pages/about/TermsConditionsPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/about/PrivacyPolicyPage'));
const AdmissionProcedurePage = lazy(() => import('./pages/admissions/AdmissionProcedurePage'));
const RegistrationPage2026 = lazy(() => import('./pages/admissions/RegistrationPage2026'));
const ScholarshipPage = lazy(() => import('./pages/admissions/ScholarshipPage'));
const EducationLoanPage = lazy(() => import('./pages/admissions/EducationLoanPage'));
const PaymentsPage = lazy(() => import('./pages/admissions/PaymentsPage'));
const AICounselorPage = lazy(() => import('./pages/AICounselorPage'));

const ApplicationRegisterPage = lazy(() => import('./pages/admissions/ApplicationRegisterPage'));
const ApplicationLoginPage = lazy(() => import('./pages/admissions/ApplicationLoginPage'));
const ApplicationDashboardLayout = lazy(() => import('./pages/admissions/dashboard/ApplicationDashboardLayout'));
const ApplicationListView = lazy(() => import('./pages/admissions/dashboard/ApplicationListView'));
const PersonalDetailsPage = lazy(() => import('./pages/admissions/dashboard/PersonalDetailsPage'));
const AcademicInfoPage = lazy(() => import('./pages/admissions/dashboard/AcademicInfoPage'));
const CourseSelectionPage = lazy(() => import('./pages/admissions/dashboard/CourseSelectionPage'));
const PaymentPage = lazy(() => import('./pages/admissions/dashboard/PaymentPage'));

const DepartmentPage = lazy(() => import('./pages/departments/DepartmentPage'));

/** Suppresses admin-portal-only widgets on /admin/* routes */
const PublicWidgets = ({ onEnquiryClick, isEnquiryOpen, onClose }) => {
  const location = useLocation();
  if (location.pathname.startsWith('/admin')) return null;

  const hideFloatingButtons = location.pathname.includes('/admissions/registration') || 
                              location.pathname.includes('/admissions/register') || 
                              location.pathname.includes('/admissions/login') ||
                              location.pathname.includes('/admissions/application');

  return (
    <>
      {!hideFloatingButtons && <FloatingActionButtons onEnquiryClick={onEnquiryClick} />}
      <ChatBotWidget />
      <EnquiryModal isOpen={isEnquiryOpen} onClose={onClose} />
    </>
  );
};

function App() {
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  useEffect(() => {
    runLocalStorageMigration();
  }, []);

  return (
    <AuthProvider>
        <ToastProvider>
          <ChatbotProvider>
    <BrowserRouter>
      <Suspense fallback={<SuspenseLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ai-counselor" element={<AICounselorPage />} />
          <Route path="/departments" element={<DepartmentsOverviewPage />} />
          
          {/* Legacy MBA redirects for backward compatibility */}
          <Route path="/departments/mba/*" element={<Navigate to="/departments/management/department" replace />} />
          <Route path="/departments/mba" element={<Navigate to="/departments/management/department" replace />} />
          
          {/* Unified Department Routing */}
          <Route path="/departments/:deptKey/:section" element={<DepartmentPage />} />
          <Route path="/departments/:deptKey" element={<Navigate to="department" replace />} />

          {/* About Module Routes */}
          <Route path="/about/institution" element={<AboutLayout hero={<InstitutionHero />}><InstitutionPage /></AboutLayout>} />
          <Route path="/about/teaching-methodology" element={<AboutLayout><TeachingMethodologyPage /></AboutLayout>} />
          <Route path="/about/peoples-message" element={<PeoplesMessagePage />} />
          <Route path="/about/anti-ragging-policy" element={<AntiRaggingPage />} />
          <Route path="/about/values-and-philosophy" element={<ValuesPhilosophyPage />} />
          <Route path="/about/government-approval" element={<GovernmentApprovalPage />} />
          <Route path="/about/governing-council" element={<GoverningCouncilPage />} />
          <Route path="/about/refund-policy" element={<RefundPolicyPage />} />
          <Route path="/about/terms-and-conditions" element={<TermsConditionsPage />} />
          <Route path="/about/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/about/campus-facility" element={<AboutLayout><CampusFacilityPage /></AboutLayout>} />
          <Route path="/about/campus-life" element={<AboutLayout><CampusLifePage /></AboutLayout>} />
          <Route path="/about/academic-calendar" element={<AboutLayout><AcademicCalendarPage /></AboutLayout>} />
          <Route path="/about/list-of-holidays" element={<AboutLayout><ListHolidaysPage /></AboutLayout>} />
          <Route path="/about/syllabus" element={<AboutLayout><SyllabusPage /></AboutLayout>} />
          <Route path="/about/sports" element={<AboutLayout><SportsPage /></AboutLayout>} />

          {/* Academics Module Routes — /academics/* */}
          <Route path="/academics/teaching-methodology" element={<AcademicsLayout><TeachingMethodologyPage /></AcademicsLayout>} />
          <Route path="/academics/campus-facility"      element={<AcademicsLayout><CampusFacilityPage /></AcademicsLayout>} />
          <Route path="/academics/sports"               element={<AcademicsLayout><AcademicsSportsPage /></AcademicsLayout>} />
          <Route path="/academics/campus-life"          element={<AcademicsLayout><CampusLifePage /></AcademicsLayout>} />
          <Route path="/academics/academic-calendar"    element={<AcademicsLayout><AcademicCalendarPage /></AcademicsLayout>} />
          <Route path="/academics/list-of-holidays"     element={<AcademicsLayout><ListHolidaysPage /></AcademicsLayout>} />
          <Route path="/academics/syllabus"             element={<AcademicsLayout><SyllabusPage /></AcademicsLayout>} />

          {/* Research Route */}
          <Route path="/research" element={<ResearchPage />} />

          {/* Contact Route */}
          <Route path="/contact" element={<ContactPage />} />

          {/* Admissions Route */}
          <Route path="/admissions/admission-procedure" element={<AdmissionProcedurePage />} />
          <Route path="/admissions/registration-2026" element={<RegistrationPage2026 />} />
          <Route path="/admissions/registration" element={<Navigate to="/admissions/registration-2026" replace />} />
          <Route path="/admissions/register" element={<ApplicationRegisterPage />} />
          <Route path="/admissions/login" element={<ApplicationLoginPage />} />
          <Route path="/admissions/application" element={<ApplicationDashboardLayout />}>
            <Route index element={<ApplicationListView />} />
            <Route path=":applicationId/personal" element={<PersonalDetailsPage />} />
            <Route path=":applicationId/academic" element={<AcademicInfoPage />} />
            <Route path=":applicationId/course" element={<CourseSelectionPage />} />
            <Route path=":applicationId/payment" element={<PaymentPage />} />
          </Route>
          <Route path="/admissions/scholarship-and-awards" element={<ScholarshipPage />} />
          <Route path="/admissions/education-loan" element={<EducationLoanPage />} />
          <Route path="/admissions/payments" element={<PaymentsPage />} />

          {/* Placements Routes */}
          <Route path="/placements/students-placed" element={<PageTopWrapper><StudentsPlacedPage /></PageTopWrapper>} />
          <Route path="/placements/recruiters" element={<PageTopWrapper><RecruitersPage /></PageTopWrapper>} />

          {/* ── Admin Routes ─────────────────────────────────────────── */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/unauthorized" element={<Unauthorized />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardOverview />} />
            <Route path="home" element={<HomePageEditor />} />
            <Route path="about" element={<AboutEditor />} />
            <Route path="courses" element={<CoursesEditor />} />
            <Route path="academics" element={<AcademicsEditor />} />
            <Route path="admissions" element={<AdmissionsEditor />} />
            <Route path="faculty" element={<FacultyEditor />} />
            <Route path="gallery" element={<GalleryEditor />} />
            <Route path="seo" element={<SEOEditor />} />
            
            {/* Homepage */}
            <Route path="homepage/navbar" element={<NavbarEditor />} />
            <Route path="homepage/hero" element={<HeroEditor />} />
            <Route path="homepage/stats" element={<StatsEditor />} />
            <Route path="homepage/academic" element={<AcademicDeptEditor />} />
            <Route path="homepage/placement-excellence" element={<PlacementExcellenceEditor />} />
            <Route path="homepage/contact" element={<ContactSectionEditor />} />
            <Route path="homepage/footer" element={<FooterEditor />} />

            {/* Updates */}
            <Route path="updates/events" element={<LatestEventsEditor />} />
            <Route path="updates/placements" element={<PlacementUpdatesEditor />} />
            <Route path="updates/announcements" element={<AnnouncementsEditor />} />
            <Route path="updates/newsletters" element={<NewsletterEditor />} />

            {/* Placements */}
            <Route path="placements/recruiters" element={<RecruitersEditor />} />
            <Route path="placements/students" element={<StudentsPlacedEditor />} />

            {/* About */}
            <Route path="about/institution" element={<InstitutionEditor />} />
            <Route path="about/peoples-messages" element={<PeoplesMessagesEditor />} />
            <Route path="about/anti-ragging" element={<AntiRaggingEditor />} />
            <Route path="about/values" element={<ValuesPhilosophyEditor />} />
            <Route path="about/approval" element={<GovApprovalEditor />} />
            <Route path="about/governing-policy" element={<GoverningPolicyEditor />} />
            <Route path="about/refund-policy" element={<RefundPolicyEditor />} />
            <Route path="about/terms" element={<TermsEditor />} />
            <Route path="about/privacy" element={<PrivacyPolicyEditor />} />

            {/* Academics */}
            <Route path="academics/teaching-methodology" element={<TeachingMethodologyEditor />} />
            <Route path="academics/facilities" element={<CampusFacilitiesEditor />} />
            <Route path="academics/sports" element={<SportsEditor />} />
            <Route path="academics/campus-life" element={<CampusLifeEditor />} />
            <Route path="academics/calendar" element={<AcademicCalendarEditor />} />
            <Route path="academics/holidays" element={<ListHolidaysEditor />} />
            <Route path="academics/syllabus" element={<SyllabusEditor />} />

            {/* Admissions */}
            <Route path="admissions/registration" element={<AdmissionRegistrationEditor />} />
            <Route path="admissions/procedure" element={<AdmissionProcedureEditor />} />
            <Route path="admissions/scholarships" element={<ScholarshipsEditor />} />
            <Route path="admissions/loan" element={<EducationLoanEditor />} />
            <Route path="admissions/payments" element={<PaymentsEditor />} />

            {/* Research */}
            <Route path="research/main" element={<ResearchEditor />} />

            {/* Contact */}
            <Route path="contact/main" element={<ContactUsEditor />} />

            {/* Admin Settings */}
            <Route path="users" element={<UserManagementEditor />} />
            <Route path="admin/profile" element={<ProfileSettingsEditor />} />
            <Route path="admin/password" element={<ChangePasswordEditor />} />
            <Route path="admin/activity" element={<ActivityLogsEditor />} />
            <Route path="admin/notifications" element={<NotificationsEditor />} />
            <Route path="chatbot/settings" element={<ChatbotSettingsEditor />} />
            <Route path="chatbot/welcome" element={<ChatbotWelcomeEditor />} />
            <Route path="chatbot/leads" element={<AdmissionLeadsPage />} />
            
            {/* Departments */}
            <Route path="departments/:deptKey/:section" element={<DepartmentCMSEditor />} />
            <Route path="departments/:deptKey" element={<DepartmentCMSEditor />} />
          </Route>
          <Route path="/admin" element={<Navigate to="/admin/login" replace />} />

          {/* Catch all route - can redirect to home or 404 page */}
          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>
      <PublicWidgets
        onEnquiryClick={() => setIsEnquiryOpen(true)}
        isEnquiryOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
      />
    </BrowserRouter>
          </ChatbotProvider>
        </ToastProvider>
      </AuthProvider>
  );
}

// Simple wrapper to ensure placement pages scroll to top on load
const PageTopWrapper = ({ children }) => {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return children;
};

export default App;
