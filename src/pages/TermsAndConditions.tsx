import Header from '../components/Header';
import Footer from '../components/Footer';

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">Terms and Conditions</h1>
        <p className="text-xs sm:text-sm text-gray-600 mb-6 sm:mb-8">Last updated: February 2026</p>

        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
          {/* 1. Introduction */}
          <section>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">1. Introduction</h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed mb-3 sm:mb-4">
              Welcome to Recycle My Device. By using our website and services, you agree to comply with and be bound by these Terms and Conditions. Please read them carefully before using our comparison and recycling services.
            </p>
            <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
              The term "Recycle My Device", "us", "we", or "our" refers to the owner of this website. The term "you" refers to the user or viewer of our website and services.
            </p>
          </section>

          {/* 2. Our Services */}
          <section>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">2. Our Services</h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed mb-2">
              Recycle My Device provides a comparison platform that allows you to compare prices from multiple phone recycling companies. We act as an intermediary between you and the recycling companies (referred to as "Buyers").
            </p>
            <ul className="list-disc list-inside space-y-1.5 sm:space-y-2 text-sm sm:text-base md:text-lg text-gray-700 ml-3 sm:ml-4">
              <li>We compare prices from trusted UK recycling companies</li>
              <li>We facilitate the connection between you and the Buyer</li>
              <li>The actual transaction is between you and the Buyer directly</li>
              <li>We do not purchase devices ourselves</li>
            </ul>
          </section>

          {/* 3. Price Quotes */}
          <section>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">3. Price Quotes</h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed mb-2">
              All prices displayed on our website are provided by our partner recycling companies and are subject to:
            </p>
            <ul className="list-disc list-inside space-y-1.5 sm:space-y-2 text-sm sm:text-base md:text-lg text-gray-700 ml-3 sm:ml-4">
              <li>The condition of your device matching your selection</li>
              <li>The device being fully functional as described</li>
              <li>The device not being locked to a network (unless stated)</li>
              <li>The device not being reported lost or stolen</li>
              <li>Prices may change without notice based on market conditions</li>
            </ul>
          </section>

          {/* 4. Device Conditions */}
          <section>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">4. Device Conditions</h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed mb-2">
              When selling your device, you must accurately describe its condition:
            </p>
            <ul className="list-disc list-inside space-y-1.5 sm:space-y-2 text-sm sm:text-base md:text-lg text-gray-700 ml-3 sm:ml-4 mb-3 sm:mb-4">
              <li><strong>Like New:</strong> Device in perfect condition with no visible wear</li>
              <li><strong>Good:</strong> Minor signs of use, fully functional with light scratches</li>
              <li><strong>Fair:</strong> Noticeable wear but fully functional</li>
              <li><strong>Poor:</strong> Heavy wear, scratches, or minor damage but still working</li>
              <li><strong>Faulty:</strong> Device has functional issues or significant damage</li>
            </ul>
            <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
              If your device condition differs from your description, the Buyer may revise the offer or return the device at your expense.
            </p>
          </section>

          {/* 5. Your Responsibilities */}
          <section>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">5. Your Responsibilities</h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed mb-2">
              Before sending your device, you must:
            </p>
            <ul className="list-disc list-inside space-y-1.5 sm:space-y-2 text-sm sm:text-base md:text-lg text-gray-700 ml-3 sm:ml-4">
              <li>Back up and remove all personal data</li>
              <li>Sign out of all accounts (iCloud, Google, Samsung, etc.)</li>
              <li>Disable Find My iPhone/Android or any device locks</li>
              <li>Remove SIM cards and memory cards</li>
              <li>Perform a factory reset</li>
              <li>Ensure you are the legal owner of the device</li>
            </ul>
          </section>

          {/* 6. Payment */}
          <section>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">6. Payment</h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed mb-2">
              Payment is processed by the Buyer directly. Payment methods and timescales vary by Buyer but typically:
            </p>
            <ul className="list-disc list-inside space-y-1.5 sm:space-y-2 text-sm sm:text-base md:text-lg text-gray-700 ml-3 sm:ml-4">
              <li>Payment is made within 1-3 working days of device inspection</li>
              <li>Bank transfer is the standard payment method</li>
              <li>You must provide accurate bank details</li>
              <li>We are not responsible for payment delays by Buyers</li>
            </ul>
          </section>

          {/* 7. Limitation of Liability */}
          <section>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">7. Limitation of Liability</h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed mb-2">
              While we strive to provide accurate information:
            </p>
            <ul className="list-disc list-inside space-y-1.5 sm:space-y-2 text-sm sm:text-base md:text-lg text-gray-700 ml-3 sm:ml-4">
              <li>We are not liable for any transactions between you and Buyers</li>
              <li>We do not guarantee the accuracy of prices displayed</li>
              <li>We are not responsible for devices lost in transit</li>
              <li>Our liability is limited to the maximum extent permitted by law</li>
            </ul>
          </section>

          {/* 8. Intellectual Property */}
          <section>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">8. Intellectual Property</h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
              All content on this website, including text, graphics, logos, and software, is the property of Recycle My Device and is protected by copyright laws. Unauthorised reproduction or distribution is prohibited.
            </p>
          </section>

          {/* 9. Changes to Terms */}
          <section>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">9. Changes to Terms</h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
              We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting to this website. Your continued use of our services constitutes acceptance of any changes.
            </p>
          </section>

          {/* 10. Governing Law */}
          <section>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">10. Governing Law</h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
              These Terms and Conditions are governed by and construed in accordance with the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.
            </p>
          </section>

          {/* 11. Contact Us */}
          <section>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">11. Contact Us</h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
              If you have any questions about these Terms and Conditions, please contact us at <a href="mailto:support@recyclemydevice.co.uk" className="text-primary hover:underline break-all">support@recyclemydevice.co.uk</a>
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
