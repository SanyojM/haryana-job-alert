import { ReactNode, useState } from 'react';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardNavbar } from './DashboardNavbar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <DashboardSidebar 
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64">
        {/* Navbar */}
        <DashboardNavbar 
          onMenuClick={() => setIsMobileSidebarOpen(true)}
        />

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white mt-12">
          <div className="px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* About Section */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Haryana Job Alerts</h3>
                <p className="text-sm text-gray-600">
                  Your trusted platform for government job preparation with mock tests, study materials, and expert guidance.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Quick Links</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>
                    <a href="/mock-tests" className="hover:text-blue-600 transition-colors">
                      Mock Tests
                    </a>
                  </li>
                  <li>
                    <a href="/courses" className="hover:text-blue-600 transition-colors">
                      Courses
                    </a>
                  </li>
                  <li>
                    <a href="/posts" className="hover:text-blue-600 transition-colors">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="/contact" className="hover:text-blue-600 transition-colors">
                      Contact Us
                    </a>
                  </li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Support</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>
                    <a href="/help" className="hover:text-blue-600 transition-colors">
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a href="/faq" className="hover:text-blue-600 transition-colors">
                      FAQ
                    </a>
                  </li>
                  <li>
                    <a href="/privacy" className="hover:text-blue-600 transition-colors">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="/terms" className="hover:text-blue-600 transition-colors">
                      Terms of Service
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-gray-200 mt-8 pt-6 text-center text-sm text-gray-600">
              <p>© {new Date().getFullYear()} Haryana Job Alerts. All rights reserved.</p>
              <p className="mt-1">Powered by Softricity</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
