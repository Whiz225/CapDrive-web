import React from "react";
import Link from "next/link";
import SimpleLayout from "@/components/SimpleLayout";

export const metadata = {
  title: "Terms of Service - CapDrive",
  description: "Terms of Service for CapDrive platform",
};

export default function TermsPage() {
  return (
    <SimpleLayout title="Terms of Service">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Terms of Service
          </h1>
          <p className="text-gray-500 mb-8">Last updated: July 14, 2026</p>

          <div className="prose prose-blue max-w-none">
            <p className="text-gray-600">
              Welcome to CapDrive. By using our platform, you agree to these
              Terms of Service. Please read them carefully.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-600">
              By creating an account, listing a vehicle, booking a ride, or
              using any of our services, you agree to be bound by these Terms of
              Service. If you do not agree to these terms, please do not use our
              platform.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              2. Description of Services
            </h2>
            <p className="text-gray-600">
              CapDrive is a platform that connects:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>
                <strong>Car Buyers</strong> with car sellers (dealers and
                private individuals)
              </li>
              <li>
                <strong>Riders</strong> with drivers for ride booking services
              </li>
              <li>
                <strong>Car Owners</strong> with buyers for vehicle sales
              </li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              3. User Accounts
            </h2>
            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">
              3.1 Registration
            </h3>
            <p className="text-gray-600">
              To use our platform, you must register for an account. You agree
              to provide accurate, current, and complete information during
              registration and to update such information to keep it accurate,
              current, and complete.
            </p>

            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">
              3.2 Account Security
            </h3>
            <p className="text-gray-600">
              You are responsible for safeguarding your password and for any
              activities or actions under your account. You agree to notify us
              immediately of any unauthorized use of your account.
            </p>

            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">
              3.3 Account Types
            </h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>
                <strong>User:</strong> Standard account for browsing, buying,
                and riding
              </li>
              <li>
                <strong>Dealer:</strong> For businesses selling multiple
                vehicles
              </li>
              <li>
                <strong>Driver:</strong> For providing ride services
              </li>
              <li>
                <strong>Admin:</strong> Platform administrators
              </li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              4. Vehicle Listings
            </h2>
            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">
              4.1 Listing Requirements
            </h3>
            <p className="text-gray-600">
              When listing a vehicle, you agree to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>
                Provide accurate and complete information about the vehicle
              </li>
              <li>Include clear, authentic photos of the vehicle</li>
              <li>Set a fair and accurate price</li>
              <li>Disclose any known defects or issues</li>
              <li>Update the listing status when the vehicle is sold</li>
            </ul>

            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">
              4.2 Prohibited Listings
            </h3>
            <p className="text-gray-600">The following are prohibited:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Stolen vehicles</li>
              <li>Vehicles with fraudulent documentation</li>
              <li>Vehicles not legally owned by the seller</li>
              <li>Misrepresented vehicles</li>
              <li>Vehicles with outstanding loans or liens</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              5. Ride Booking
            </h2>
            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">
              5.1 Rider Obligations
            </h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Provide accurate pickup and drop-off locations</li>
              <li>Be ready at the pickup location at the scheduled time</li>
              <li>Treat drivers with respect</li>
              <li>Pay the agreed fare</li>
              <li>Not damage the vehicle</li>
            </ul>

            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">
              5.2 Driver Obligations
            </h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Provide safe and reliable transportation</li>
              <li>Follow traffic laws and regulations</li>
              <li>Treat riders with respect</li>
              <li>Maintain a clean and well-maintained vehicle</li>
              <li>Have valid licenses and insurance</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              6. Payments and Fees
            </h2>
            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">
              6.1 Transaction Fees
            </h3>
            <p className="text-gray-600">CapDrive may charge fees for:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Vehicle listings (subscription-based or per-listing)</li>
              <li>Featured listings (enhanced visibility)</li>
              <li>Ride booking service fees</li>
              <li>Premium dealer accounts</li>
            </ul>

            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">
              6.2 Payment Processing
            </h3>
            <p className="text-gray-600">
              Payments are processed through our secure payment partners. By
              using our payment services, you agree to their terms and
              conditions. We are not responsible for any issues arising from
              payment processing.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              7. User Conduct
            </h2>
            <p className="text-gray-600">You agree not to:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Use the platform for any unlawful purpose</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Impersonate any person or entity</li>
              <li>Share account credentials with others</li>
              <li>Post spam or unauthorized advertising</li>
              <li>Attempt to bypass our security measures</li>
              <li>Engage in any fraudulent activity</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              8. Content and Intellectual Property
            </h2>
            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">
              8.1 User Content
            </h3>
            <p className="text-gray-600">
              You retain ownership of the content you post on our platform. By
              posting content, you grant us a worldwide, non-exclusive,
              royalty-free license to use, reproduce, and distribute your
              content for the purpose of operating our platform.
            </p>

            <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">
              8.2 Platform Content
            </h3>
            <p className="text-gray-600">
              All content on our platform, including text, graphics, logos, and
              software, is the property of CapDrive and is protected by
              copyright and other intellectual property laws.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              9. Termination
            </h2>
            <p className="text-gray-600">
              We reserve the right to suspend or terminate your account at our
              discretion, without notice, for conduct that we believe violates
              these Terms of Service or is harmful to other users, us, or third
              parties, or for any other reason.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              10. Disclaimer of Warranties
            </h2>
            <p className="text-gray-600">
              CapDrive is provided "as is" and "as available" without any
              warranties of any kind, either express or implied. We do not
              guarantee that the platform will be error-free, secure, or
              continuously available.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              11. Limitation of Liability
            </h2>
            <p className="text-gray-600">
              To the maximum extent permitted by law, CapDrive shall not be
              liable for any indirect, incidental, special, consequential, or
              punitive damages, or any loss of profits or revenues, whether
              incurred directly or indirectly, or any loss of data, use,
              goodwill, or other intangible losses, resulting from your use of
              the platform.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              12. Indemnification
            </h2>
            <p className="text-gray-600">
              You agree to indemnify and hold CapDrive harmless from any claims,
              damages, losses, liabilities, costs, or expenses arising from your
              use of the platform or your violation of these Terms of Service.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              13. Governing Law
            </h2>
            <p className="text-gray-600">
              These Terms of Service shall be governed by and construed in
              accordance with the laws of Nigeria, without regard to its
              conflict of law provisions.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              14. Changes to Terms
            </h2>
            <p className="text-gray-600">
              We reserve the right to update or modify these Terms of Service at
              any time. We will notify users of significant changes through
              email or platform notifications. Your continued use of the
              platform after any such changes constitutes your acceptance of the
              new Terms of Service.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              15. Contact Us
            </h2>
            <p className="text-gray-600">
              If you have any questions about these Terms of Service, please
              contact us at:
            </p>
            <p className="text-gray-600 mt-2">
              <strong>Email:</strong> legal@capdrive.com
              <br />
              <strong>Phone:</strong> +234 800 000 0000
              <br />
              <strong>Address:</strong> Lagos, Nigeria
            </p>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                By using CapDrive, you acknowledge that you have read,
                understood, and agree to be bound by these Terms of Service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </SimpleLayout>
  );
}
