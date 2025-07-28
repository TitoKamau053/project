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
        <h1 className="text-white font-bold text-lg">Terms & Conditions</h1>
        <div></div>
      </div>

      <div className="p-4 space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-white">CryptoMine Pro Terms and Conditions</h1>
          <p className="text-slate-400">Effective Date: May 23, 2022</p>
        </div>

        {/* Introduction */}
        <div className="bg-slate-800 rounded-lg p-4 border-l-4 border-orange-500">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
            <div>
              <p className="text-white font-semibold mb-2">Agreement to Terms</p>
              <p className="text-slate-300 text-sm leading-relaxed">
                By accessing or using CryptoMine Pro, you agree to be bound by the following terms and conditions. 
                These terms apply to all users of the platform.
              </p>
            </div>
          </div>
        </div>

        {/* 1. Deposits */}
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-orange-500 font-semibold text-lg mb-4 flex items-center space-x-2">
            <span className="bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">1</span>
            <span>Deposits</span>
          </h3>
          <div className="space-y-3 text-slate-300 text-sm md:text-base leading-relaxed">
            <p>
              Users can deposit any amount starting from <strong className="text-white">KES 5</strong>. However, to activate a mining engine, 
              the minimum amount required is <strong className="text-white">KES 500 via M-Pesa</strong>. Deposits below this threshold will not qualify for mining.
            </p>
            <p>
              The maximum total mining amount allowed per account is <strong className="text-white">KES 5,000,000</strong>. All deposits must be made 
              through the supported payment method.
            </p>
          </div>
        </div>

        {/* 2. Mining Engines */}
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-orange-500 font-semibold text-lg mb-4 flex items-center space-x-2">
            <span className="bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">2</span>
            <span>Mining Engines</span>
          </h3>
          <div className="space-y-3 text-slate-300 text-sm md:text-base leading-relaxed">
            <p>
              Mining engines are automated earning plans that generate returns over a specific period based on the selected 
              ROI (Return on Investment) and duration. When a user activates a mining engine by depositing the required amount, 
              the system automatically manages the process.
            </p>
            <p>
              <strong className="text-white">Once activated, a mining engine cannot be cancelled or interrupted</strong> before the 
              completion of its full cycle. However, users can choose whether or not to reinvest their capital when the mining period ends.
            </p>
          </div>
        </div>

        {/* 3. Withdrawals */}
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-orange-500 font-semibold text-lg mb-4 flex items-center space-x-2">
            <span className="bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">3</span>
            <span>Withdrawals</span>
          </h3>
          <div className="space-y-3 text-slate-300 text-sm md:text-base leading-relaxed">
            <p>
              Users can request withdrawals at any time after a mining engine completes and profits have been generated. 
              <strong className="text-white">There are no withdrawal fees</strong>, meaning users receive 100% of their earnings.
            </p>
            <p>
              Withdrawals may undergo internal verification procedures to maintain platform security. Processing times may vary 
              slightly depending on the system's load and activity.
            </p>
          </div>
        </div>

        {/* 4. Referrals */}
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-orange-500 font-semibold text-lg mb-4 flex items-center space-x-2">
            <span className="bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">4</span>
            <span>Referrals</span>
          </h3>
          <div className="space-y-3 text-slate-300 text-sm md:text-base leading-relaxed">
            <p>
              The referral program is optional and allows users to earn additional income by sharing their unique referral links. 
              When a referred user signs up and makes their first deposit, the referring user earns a <strong className="text-white">10% commission</strong> based on that deposit amount.
            </p>
            <p>
              Referral rewards are automatically credited and require no manual claim.
            </p>
          </div>
        </div>

        {/* 5. Security */}
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-orange-500 font-semibold text-lg mb-4 flex items-center space-x-2">
            <span className="bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">5</span>
            <span>Security</span>
            <Shield className="w-5 h-5 text-green-500" />
          </h3>
          <div className="space-y-3 text-slate-300 text-sm md:text-base leading-relaxed">
            <p>
              CryptoMine Pro takes the safety of your funds and personal data seriously. We implement <strong className="text-white">bank-level encryption</strong> across all systems, 
              use secure payment processors, and store user funds in segregated accounts.
            </p>
            <p>
              In addition, we apply strict internal security protocols to ensure the protection of both user data and platform transactions.
            </p>
          </div>
        </div>

        {/* 6. Account Responsibility */}
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-orange-500 font-semibold text-lg mb-4 flex items-center space-x-2">
            <span className="bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">6</span>
            <span>Account Responsibility</span>
          </h3>
          <div className="space-y-3 text-slate-300 text-sm md:text-base leading-relaxed">
            <p>
              Users are responsible for maintaining the confidentiality of their account credentials. Any activity conducted under 
              a user's account will be considered authorized unless reported immediately.
            </p>
            <p>
              <strong className="text-white">CryptoMine Pro does not take responsibility for losses resulting from compromised accounts due to user negligence.</strong>
            </p>
          </div>
        </div>

        {/* 7. Suspension and Termination */}
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-orange-500 font-semibold text-lg mb-4 flex items-center space-x-2">
            <span className="bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">7</span>
            <span>Suspension and Termination</span>
          </h3>
          <div className="space-y-3 text-slate-300 text-sm md:text-base leading-relaxed">
            <p>
              We may suspend or terminate your access to the platform at any time, with or without cause, particularly if:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>We detect suspicious or illegal activity.</li>
              <li>You violate these Terms and Conditions.</li>
            </ul>
          </div>
        </div>

        {/* 8. Amendments */}
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-orange-500 font-semibold text-lg mb-4 flex items-center space-x-2">
            <span className="bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">8</span>
            <span>Amendments</span>
          </h3>
          <div className="space-y-3 text-slate-300 text-sm md:text-base leading-relaxed">
            <p>
              We reserve the right to update or modify these terms and conditions at any time. Users will be notified of any 
              major changes through the platform or by email.
            </p>
            <p>
              <strong className="text-white">Continued use of CryptoMine Pro after any updates implies acceptance of the revised terms.</strong>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            <div>
              <p className="text-green-400 font-semibold">Terms Acknowledgment</p>
              <p className="text-slate-300 text-sm">
                By using CryptoMine Pro, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
              </p>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center pt-4">
          <button
            onClick={onBack}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
};
