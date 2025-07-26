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
          <h3 className="text-orange-500 font-semibold text-lg mb-4">1. Acceptance of Terms</h3>
          <div className="space-y-3 text-slate-300">
            <p>
              By accessing and using CryptoMine Pro ("Platform"), you accept and agree to be bound by the terms and provision of this agreement. These Terms of Service ("Terms") constitute a legally binding agreement between you and CryptoMine Pro.
            </p>
            <p>
              If you do not agree to abide by the above, please do not use this service. We reserve the right to change or modify these terms at any time without prior notice.
            </p>
          </div>
        </div>

        {/* Eligibility */}
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-orange-500 font-semibold text-lg mb-4">2. Eligibility and Account Registration</h3>
          <div className="space-y-3 text-slate-300">
            <p>To use our platform, you must:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Be at least 18 years of age</li>
              <li>Have full legal capacity to enter into these Terms</li>
              <li>Provide accurate, current and complete information during registration</li>
              <li>Maintain and promptly update your account information</li>
              <li>Keep your login credentials secure and confidential</li>
              <li>Be responsible for all activities under your account</li>
            </ul>
          </div>
        </div>

        {/* Services */}
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-orange-500 font-semibold text-lg mb-4">3. Platform Services</h3>
          <div className="space-y-3 text-slate-300">
            <p>CryptoMine Pro provides automated cryptocurrency mining services including:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Multiple mining engine options with varying durations and returns</li>
              <li>Secure deposit and withdrawal processing</li>
              <li>Real-time portfolio tracking and performance monitoring</li>
              <li>Referral program with commission opportunities</li>
              <li>Customer support and technical assistance</li>
              <li>Educational resources and market insights</li>
            </ul>
          </div>
        </div>

        {/* Investment Terms */}
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-orange-500 font-semibold text-lg mb-4">4. Investment Terms and Conditions</h3>
          <div className="space-y-3 text-slate-300">
            <div>
              <p className="font-medium mb-2">Mining Engines:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Each mining engine has specific investment amounts, durations, and expected returns</li>
                <li>Once activated, mining engines cannot be cancelled or modified</li>
                <li>Returns are automatically credited to your account upon completion</li>
                <li>Mining engines are subject to market conditions and technical performance</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-2">Investment Minimums and Maximums:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Minimum deposit: KES 500 (via M-Pesa) or KES 5 (via Cryptocurrency)</li>
                <li>Maximum account balance: KES 5,000,000</li>
                <li>Daily investment limits may apply based on account verification level</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Financial Terms */}
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-orange-500 font-semibold text-lg mb-4">5. Deposits, Withdrawals, and Fees</h3>
          <div className="space-y-3 text-slate-300">
            <div>
              <p className="font-medium mb-2">Deposit Policy:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>All deposits are final and non-refundable</li>
                <li>Deposits via M-Pesa typically reflect within 1-5 minutes</li>
                <li>Cryptocurrency deposits require network confirmations (10-60 minutes)</li>
                <li>Minimum deposit amounts vary by payment method</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-2">Withdrawal Policy:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>No withdrawal fees - you receive 100% of your earnings</li>
                <li>Withdrawal processing times: M-Pesa (1-5 minutes), Crypto (10-60 minutes)</li>
                <li>All withdrawals are subject to verification and security checks</li>
                <li>Suspicious activities may result in withdrawal delays or restrictions</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Investment Risks */}
        <div className="bg-slate-800 rounded-lg p-4 border-l-4 border-red-500">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-red-500 mt-1" />
            <div>
              <h3 className="text-red-500 font-semibold text-lg mb-4">6. Risk Disclosure</h3>
              <div className="space-y-3 text-slate-300">
                <p className="font-medium">IMPORTANT: Please read and understand these risks:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Market Risk:</strong> Cryptocurrency values are highly volatile and can result in significant losses</li>
                  <li><strong>Technology Risk:</strong> Mining hardware and software are subject to technical failures</li>
                  <li><strong>Regulatory Risk:</strong> Changes in laws may affect operations and returns</li>
                  <li><strong>Liquidity Risk:</strong> You may not be able to withdraw funds immediately in all circumstances</li>
                  <li><strong>Platform Risk:</strong> Technical issues may temporarily affect access to funds</li>
                  <li><strong>No Guarantee:</strong> Past performance does not guarantee future results</li>
                </ul>
                <p className="text-red-400 font-medium">Only invest funds you can afford to lose completely.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Referral Program */}
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-orange-500 font-semibold text-lg mb-4">7. Referral Program</h3>
          <div className="space-y-3 text-slate-300">
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Earn 10% commission on the first deposit of users you refer</li>
              <li>Referral links are unique to your account and must not be shared with unauthorized parties</li>
              <li>Referral commissions are credited immediately upon successful deposit</li>
              <li>Self-referrals and fraudulent referral activities are prohibited</li>
              <li>We reserve the right to modify or terminate the referral program</li>
              <li>Commissions are subject to the same withdrawal terms as other earnings</li>
            </ul>
          </div>
        </div>

        {/* Prohibited Activities */}
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-orange-500 font-semibold text-lg mb-4">8. Prohibited Uses</h3>
          <div className="space-y-3 text-slate-300">
            <p>You agree not to use the platform for:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Any unlawful purpose or to solicit others to perform unlawful acts</li>
              <li>Creating multiple accounts to circumvent platform limits</li>
              <li>Using automated systems, bots, or scripts without authorization</li>
              <li>Attempting to gain unauthorized access to other users' accounts</li>
              <li>Money laundering, terrorist financing, or other illegal financial activities</li>
              <li>Providing false, inaccurate, or misleading information</li>
              <li>Interfering with or disrupting the platform's operation</li>
              <li>Violating any applicable local, state, national, or international law</li>
            </ul>
          </div>
        </div>

        {/* Account Security */}
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-orange-500 font-semibold text-lg mb-4">9. Account Security and Responsibilities</h3>
          <div className="space-y-3 text-slate-300">
            <p>You are responsible for:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Immediately notifying us of any unauthorized access</li>
              <li>Using strong passwords and enabling additional security features</li>
              <li>Keeping your contact information updated</li>
              <li>Monitoring your account for unauthorized transactions</li>
            </ul>
          </div>
        </div>

        {/* Platform Availability */}
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-orange-500 font-semibold text-lg mb-4">10. Platform Availability and Modifications</h3>
          <div className="space-y-3 text-slate-300">
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>We strive for 99.9% uptime but cannot guarantee uninterrupted service</li>
              <li>Scheduled maintenance will be announced in advance when possible</li>
              <li>We reserve the right to modify, suspend, or discontinue services</li>
              <li>Features and mining engines may be added, modified, or removed</li>
              <li>User interface and functionality may be updated periodically</li>
            </ul>
          </div>
        </div>

        {/* Limitation of Liability */}
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-orange-500 font-semibold text-lg mb-4">11. Limitation of Liability</h3>
          <div className="space-y-3 text-slate-300">
            <p>
              To the maximum extent permitted by applicable law, CryptoMine Pro shall not be liable for:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Any investment losses or failure to achieve expected returns</li>
              <li>Damages arising from platform downtime or technical issues</li>
              <li>Third-party payment processor delays or failures</li>
              <li>Market volatility effects on cryptocurrency values</li>
              <li>Any indirect, consequential, special, or punitive damages</li>
              <li>Loss of profits, data, or business opportunities</li>
            </ul>
            <p className="mt-3 text-sm">
              Our total liability shall not exceed the amount you have deposited in the 30 days preceding the claim.
            </p>
          </div>
        </div>

        {/* Account Termination */}
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-orange-500 font-semibold text-lg mb-4">12. Account Termination</h3>
          <div className="space-y-3 text-slate-300">
            <p>We may terminate or suspend your account immediately for:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Breach of these Terms of Service</li>
              <li>Suspected fraudulent or illegal activity</li>
              <li>Failure to provide required verification documents</li>
              <li>Extended periods of account inactivity (12+ months)</li>
              <li>Court order or regulatory requirement</li>
            </ul>
            <p className="mt-3">
              Upon termination, remaining funds will be returned after verification and deduction of applicable fees, subject to legal and regulatory requirements.
            </p>
          </div>
        </div>

        {/* Privacy and Data Protection */}
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-orange-500 font-semibold text-lg mb-4">13. Privacy and Data Protection</h3>
          <div className="space-y-3 text-slate-300">
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Your privacy is important to us and governed by our Privacy Policy</li>
              <li>We collect and process personal data necessary for platform operation</li>
              <li>Data is stored securely using bank-level encryption</li>
              <li>We may share information as required by law or regulation</li>
              <li>You have rights regarding your personal data under applicable laws</li>
            </ul>
          </div>
        </div>

        {/* Dispute Resolution */}
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-orange-500 font-semibold text-lg mb-4">14. Dispute Resolution</h3>
          <div className="space-y-3 text-slate-300">
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>We encourage resolving disputes through direct communication first</li>
              <li>Contact our support team via WhatsApp (+254 700 000 000) or email</li>
              <li>Disputes not resolved within 30 days may be subject to arbitration</li>
              <li>Arbitration shall be conducted under Kenyan law</li>
              <li>Class action lawsuits are waived to the extent permitted by law</li>
            </ul>
          </div>
        </div>

        {/* Governing Law */}
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-orange-500 font-semibold text-lg mb-4">15. Governing Law and Jurisdiction</h3>
          <div className="space-y-3 text-slate-300">
            <p>
              These Terms shall be governed by and construed in accordance with the laws of Kenya. 
              Any disputes arising under these Terms shall be subject to the exclusive jurisdiction 
              of the courts of Kenya.
            </p>
          </div>
        </div>

        {/* Changes to Terms */}
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-orange-500 font-semibold text-lg mb-4">16. Changes to Terms</h3>
          <div className="space-y-3 text-slate-300">
            <p>
              We reserve the right to modify these Terms at any time. Material changes will be 
              communicated via email or platform notification at least 7 days before taking effect. 
              Continued use of the platform after changes constitutes acceptance of the new Terms.
            </p>
          </div>
        </div>

        {/* Severability */}
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-orange-500 font-semibold text-lg mb-4">17. Severability</h3>
          <div className="space-y-3 text-slate-300">
            <p>
              If any provision of these Terms is found to be unenforceable or invalid, 
              that provision shall be limited or eliminated to the minimum extent necessary 
              so that these Terms shall otherwise remain in full force and effect.
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-slate-800 rounded-lg p-4 border-l-4 border-green-500">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-6 h-6 text-green-500 mt-1" />
            <div>
              <h3 className="text-green-500 font-semibold text-lg mb-4">18. Contact Information</h3>
              <div className="space-y-2 text-slate-300">
                <p>For questions about these Terms, contact us:</p>
                <p><strong>Email:</strong> legal@cryptominepro.com</p>
                <p><strong>Support Email:</strong> support@cryptominepro.com</p>
                <p><strong>WhatsApp:</strong> +254 700 000 000</p>
                <p><strong>Business Hours:</strong> Monday - Friday, 8:00 AM - 6:00 PM EAT</p>
                <p><strong>Address:</strong> Nairobi, Kenya</p>
              </div>
            </div>
          </div>
        </div>

        {/* Agreement */}
        <div className="bg-orange-500 bg-opacity-10 border border-orange-500 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Shield className="w-6 h-6 text-orange-500 mt-1" />
            <div>
              <h3 className="text-orange-500 font-semibold mb-2">Acknowledgment and Agreement</h3>
              <p className="text-slate-300 text-sm">
                By creating an account and using CryptoMine Pro, you acknowledge that you have read, 
                understood, and agree to be bound by these Terms of Service. You also acknowledge 
                that you understand the risks involved in cryptocurrency investments and that you 
                are participating at your own risk.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
