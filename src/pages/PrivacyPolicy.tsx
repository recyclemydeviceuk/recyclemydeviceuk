import Header from '../components/Header';
import Footer from '../components/Footer';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-600 mb-8">Last updated: February 2026</p>

        <div className="bg-white rounded-xl border border-gray-200 p-8 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              At Recycle My Device, we are committed to protecting and respecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you use our website and services.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              By using Recycle My Device, you agree to the collection and use of information in accordance with this policy.
            </p>
          </section>

          {/* Who We Are */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Who We Are</h2>
            <p className="text-gray-700 leading-relaxed">
              Recycle My Device is a phone comparison and recycling platform based in the United Kingdom. We help users compare prices from trusted recycling companies to get the best value for their old devices.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We collect the following types of information:
            </p>

            <h3 className="text-xl font-bold text-gray-900 mb-3">Personal Information</h3>
            <p className="text-gray-700 leading-relaxed mb-2">
              When you place an order through our website, we collect:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-6">
              <li>Full name (first name and last name)</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Home address (for device collection)</li>
              <li>Bank account details (for payment processing)</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900 mb-3">Device Information</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-6">
              <li>Device model and storage capacity</li>
              <li>Device condition</li>
              <li>Selected buyer and price</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900 mb-3">Technical Information</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Device type</li>
              <li>Pages visited and time spent on site</li>
              <li>Cookies and similar technologies</li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              We use your personal information to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Process your device trade-in order</li>
              <li>Share necessary details with your chosen recycling company</li>
              <li>Send order confirmations and updates</li>
              <li>Respond to your enquiries and provide customer support</li>
              <li>Improve our website and services</li>
              <li>Send marketing communications (with your consent)</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          {/* Sharing Your Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Sharing Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              We share your information with:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-4">
              <li><strong>Recycling Partners:</strong> Your order details are shared with your chosen buyer to process your trade-in</li>
              <li><strong>Service Providers:</strong> Third parties who help us operate our website and services</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              We never sell your personal information to third parties for marketing purposes.
            </p>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies</h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              We use cookies to improve your experience on our website. Cookies help us:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-4">
              <li>Remember your preferences</li>
              <li>Understand how you use our website</li>
              <li>Improve our services</li>
              <li>Show relevant content</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              You can control cookies through your browser settings. Disabling cookies may affect your experience on our website.
            </p>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
            <p className="text-gray-700 leading-relaxed">
              We implement appropriate security measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction. This includes encryption, secure servers, and regular security assessments. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Retention</h2>
            <p className="text-gray-700 leading-relaxed">
              We retain your personal information for as long as necessary to provide our services and comply with legal obligations. Order information is typically retained for 6 years for accounting and legal purposes.
            </p>
          </section>

          {/* Your Rights (GDPR) */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights (GDPR)</h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              Under UK GDPR, you have the following rights:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-4">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
              <li><strong>Erasure:</strong> Request deletion of your data ("right to be forgotten")</li>
              <li><strong>Restriction:</strong> Request restriction of processing</li>
              <li><strong>Portability:</strong> Receive your data in a portable format</li>
              <li><strong>Objection:</strong> Object to processing for marketing purposes</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              To exercise any of these rights, please contact us at <a href="mailto:privacy@recyclemydevice.co.uk" className="text-primary hover:underline">privacy@recyclemydevice.co.uk</a>
            </p>
          </section>

          {/* Third-Party Links */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Links</h2>
            <p className="text-gray-700 leading-relaxed">
              Our website may contain links to third-party websites. We are not responsible for the privacy practices of these websites. We encourage you to read their privacy policies.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children.
            </p>
          </section>

          {/* Changes to This Policy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically.
            </p>
          </section>

          {/* Contact Us */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              If you have any questions about this Privacy Policy or how we handle your data, please contact us:
            </p>
            <ul className="space-y-2 text-gray-700 ml-4">
              <li><strong>Email:</strong> <a href="mailto:privacy@recyclemydevice.co.uk" className="text-primary hover:underline">privacy@recyclemydevice.co.uk</a></li>
              <li><strong>Phone:</strong> <a href="tel:03301234567" className="text-primary hover:underline">0330 123 4567</a></li>
            </ul>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
