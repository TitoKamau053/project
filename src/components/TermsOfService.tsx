import { ArrowLeft, Shield, AlertTriangle, CheckCircle } from 'lucide-react';

interface TermsOfServiceProps {
  onBack: () => void;
}

export const TermsOfService = ({ onBack }: TermsOfServiceProps) => {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <button 
          onClick={onBack}
          className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <h1 className="text-white font-bold text-lg">Terms of Service</h1>
        <div></div>
      </div>

      <div className="p-4 space-y-6">
        {/* Last Updated */}
        <div className="bg-slate-800 rounded-lg p-4 border-l-4 border-orange-500">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <div>
              <p className="text-white font-semibold">Important Information</p>
              <p className="text-slate-400 text-sm">Last updated: January 15, 2025</p>
            </div>
          </div>
        </div>

        {/* Introduction */}
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-orange-500 font-semibold text-lg mb-4">1. Introduction</h3>
          <div className="space-y-3 text-slate-300">
            <p>
              Welcome to CryptoMine Pro ("we," "our," or "us"). These Terms of Service ("Terms") 
              govern your use of our cryptocurrency mining platform and related services.
            </p>
            <p>
              By accessing or using our platform, you agree to be bound by these Terms. 
              If you disagree with any part of these terms, you may not access the service.
            </p>
          </div>
        </div>

        {/* Eligibility */}
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-orange-500 font-semibold text-lg mb-4">2. Eligibility</h3>
          <div className="space-y-3 text-slate-300">
            <p>To use our services, you must:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Be at least 18 years old</li>
              <li>Have the legal capacity to enter into binding agreements</li>
              <li>Not be restricted by any applicable laws from using financial services</li>
              <li>Provide accurate and complete information during registration</li>
            </ul>
          </div>
        </div>

        {/* Services */}
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-orange-500 font-semibold text-lg mb-4">3. Our Services</h3>
          <div className="space-y-3 text-slate-300">
            <p>CryptoMine Pro provides:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Cryptocurrency mining investment opportunities</li>
              <li>Automated profit generation systems</li>
              <li>Secure deposit and withdrawal services</li>
              <li>Referral program with commission rewards</li>
              <li>Real-time portfolio tracking and analytics</li>
            </ul>
          </div>
        </div>

        {/* Investment Risks */}
        <div className="bg-slate-800 rounded-lg p-4 border-l-4 border-red-500">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-red-500 mt-1" />
            <div>
              <h3 className="text-red-500 font-semibold text-lg mb-4">4. Investment Risks</h3>
              <div className="space-y-3 text-slate-300">
                <p className="font-medium">Important Risk Disclosure:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Cryptocurrency investments carry inherent risks</li>
                  <li>Past performance does not guarantee future results</li>
                  <li>You may lose some or all of your invested capital</li>
                  <li>Market volatility can affect returns significantly</li>
                  <li>Only invest what you can afford to lose</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* User Responsibilities */}
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-orange-500 font-semibold text-lg mb-4">5. User Responsibilities</h3>
          <div className="space-y-3 text-slate-300">
            <p>As a user, you agree to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Maintain the confidentiality of your account credentials</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Provide accurate and up-to-date information</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Not engage in fraudulent or harmful activities</li>
              <li>Use the platform only for legitimate purposes</li>
            </ul>
          </div>
        </div>

        {/* Deposits and Withdrawals */}
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-orange-500 font-semibold text-lg mb-4">6. Deposits and Withdrawals</h3>
          <div className="space-y-3 text-slate-300">
            <div>
              <p className="font-medium mb-2">Deposit Terms:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Minimum and maximum limits apply to all deposit methods</li>
                <li>Processing times vary by payment method</li>
                <li>All deposits are final and non-refundable</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-2">Withdrawal Terms:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Withdrawals are subject to verification procedures</li>
                <li>Applicable fees will be deducted from withdrawal amounts</li>
                <li>Processing times depend on the chosen withdrawal method</li>
                <li>We reserve the right to request additional verification</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Prohibited Activities */}
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-orange-500 font-semibold text-lg mb-4">7. Prohibited Activities</h3>
          <div className="space-y-3 text-slate-300">
            <p>The following activities are strictly prohibited:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Creating multiple accounts to circumvent limits</li>
              <li>Using automated systems or bots without authorization</li>
              <li>Attempting to manipulate or exploit platform vulnerabilities</li>
              <li>Money laundering or other illegal financial activities</li>
              <li>Sharing account credentials with third parties</li>
              <li>Providing false or misleading information</li>
            </ul>
          </div>
        </div>

        {/* Limitation of Liability */}
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-orange-500 font-semibold text-lg mb-4">8. Limitation of Liability</h3>
          <div className="space-y-3 text-slate-300">
            <p>
              To the maximum extent permitted by law, CryptoMine Pro shall not be liable for:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Investment losses or reduced returns</li>
              <li>Technical issues or platform downtime</li>
              <li>Third-party payment processor delays</li>
              <li>Market volatility effects on investments</li>
              <li>Indirect, consequential, or punitive damages</li>
            </ul>
          </div>
        </div>

        {/* Account Termination */}
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-orange-500 font-semibold text-lg mb-4">9. Account Termination</h3>
          <div className="space-y-3 text-slate-300">
            <p>We reserve the right to terminate accounts for:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Violation of these Terms of Service</li>
              <li>Suspicious or fraudulent activity</li>
              <li>Regulatory or legal requirements</li>
              <li>Extended periods of inactivity</li>
            </ul>
            <p className="mt-3">
              Upon termination, any remaining funds will be returned after 
              verification and deduction of applicable fees.
            </p>
          </div>
        </div>

        {/* Changes to Terms */}
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-orange-500 font-semibold text-lg mb-4">10. Changes to Terms</h3>
          <div className="space-y-3 text-slate-300">
            <p>
              We may modify these Terms at any time. Significant changes will be 
              communicated through the platform or via email. Continued use of 
              our services after changes constitutes acceptance of the new Terms.
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-slate-800 rounded-lg p-4 border-l-4 border-green-500">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-6 h-6 text-green-500 mt-1" />
            <div>
              <h3 className="text-green-500 font-semibold text-lg mb-4">11. Contact Us</h3>
              <div className="space-y-2 text-slate-300">
                <p>For questions about these Terms, contact us:</p>
                <p>Email: legal@cryptominepro.com</p>
                <p>WhatsApp: +254 700 000 000</p>
                <p>Address: Nairobi, Kenya</p>
              </div>
            </div>
          </div>
        </div>

        {/* Agreement */}
        <div className="bg-orange-500 bg-opacity-10 border border-orange-500 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Shield className="w-6 h-6 text-orange-500 mt-1" />
            <div>
              <h3 className="text-orange-500 font-semibold mb-2">Agreement Confirmation</h3>
              <p className="text-slate-300 text-sm">
                By using CryptoMine Pro, you acknowledge that you have read, 
                understood, and agree to be bound by these Terms of Service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
