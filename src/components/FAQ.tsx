import { useState } from 'react';
import { ArrowLeft, Search, ChevronDown, ChevronRight } from 'lucide-react';

interface FAQProps {
  onBack: () => void;
}

export const FAQ = ({ onBack }: FAQProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqCategories = [
    {
      title: "Getting Started",
      faqs: [
        {
          id: 1,
          question: "How do I create an account?",
          answer: "Click on 'Sign Up' from the login page, fill in your personal details including name, email, and phone number. You'll also need to create a secure password and can optionally enter a referral code."
        },
        {
          id: 2,
          question: "How do I verify my account?",
          answer: "After registration, verify your email address by clicking the link sent to your email. For enhanced security, you can also enable two-factor authentication in your profile settings."
        },
        {
          id: 3,
          question: "What do I need to start mining?",
          answer: "To start mining, you need to: 1) Create and verify your account, 2) Deposit funds using M-Pesa, Bank Transfer, or Cryptocurrency, 3) Choose a mining engine from the 'Mining Now' section, 4) Activate your chosen mining plan."
        }
      ]
    },
    {
      title: "Deposits & Withdrawals",
      faqs: [
        {
          id: 4,
          question: "What payment methods are supported?",
          answer: "We support M-Pesa (KES 100 - 300,000), Bank Transfer (KES 500 - 1,000,000), and Cryptocurrency deposits (KES 50 - 5,000,000). All deposits are processed securely and quickly."
        },
        {
          id: 5,
          question: "How long do deposits take to reflect?",
          answer: "M-Pesa deposits are instant, Bank transfers take 1-2 hours, and Cryptocurrency deposits take 10-30 minutes depending on network confirmation."
        },
        {
          id: 6,
          question: "What are the withdrawal fees?",
          answer: "M-Pesa withdrawals: 2% fee, Bank transfers: KES 50 flat fee, Cryptocurrency withdrawals: 1.5% fee. Minimum withdrawal amounts apply for each method."
        },
        {
          id: 7,
          question: "How long do withdrawals take?",
          answer: "M-Pesa: 1-5 minutes, Bank transfers: 2-24 hours, Cryptocurrency: 10-60 minutes. Processing times may vary during peak periods or due to network conditions."
        }
      ]
    },
    {
      title: "Mining & Investments",
      faqs: [
        {
          id: 8,
          question: "How do mining engines work?",
          answer: "Mining engines are automated investment plans where you invest a fixed amount for a specific duration and ROI. The system automatically generates returns based on the mining engine's parameters without requiring manual intervention."
        },
        {
          id: 9,
          question: "What are the available mining plans?",
          answer: "We offer various plans: Daily Mine Pro (10% ROI, 1 day), Crypto Blast (25% ROI, 1 day), Triple Mine (35% ROI, 10 hours). Each plan has different investment amounts and durations."
        },
        {
          id: 10,
          question: "Can I cancel an active mining investment?",
          answer: "No, active mining investments cannot be cancelled once started. However, you can choose not to reinvest when the current mining period expires."
        },
        {
          id: 11,
          question: "When do I receive my mining rewards?",
          answer: "Mining rewards are automatically credited to your account when the mining period expires. You can then choose to withdraw the funds or reinvest in another mining engine."
        }
      ]
    },
    {
      title: "Referral Program",
      faqs: [
        {
          id: 12,
          question: "How does the referral program work?",
          answer: "Share your unique referral link from the Network section. When someone registers using your link and makes their first deposit, you earn 10% commission on their deposit amount."
        },
        {
          id: 13,
          question: "When do I receive referral commissions?",
          answer: "Referral commissions are credited immediately when your referred user makes a qualifying deposit. The commission appears in your earnings and can be withdrawn or reinvested."
        },
        {
          id: 14,
          question: "Is there a limit to how many people I can refer?",
          answer: "No, there's no limit to the number of people you can refer. The more active referrals you have, the more commission you can earn from the program."
        }
      ]
    },
    {
      title: "Security & Account",
      faqs: [
        {
          id: 15,
          question: "How is my money protected?",
          answer: "We use bank-level encryption, secure payment processors, and store funds in segregated accounts. All transactions are monitored and we maintain strict security protocols to protect your investments."
        },
        {
          id: 16,
          question: "What if I forget my password?",
          answer: "Click 'Forgot Password' on the login page and enter your email address. You'll receive instructions to reset your password securely."
        },
        {
          id: 17,
          question: "How can I enable two-factor authentication?",
          answer: "Go to Profile → Security Settings → Two-Factor Authentication. Follow the setup instructions to add an extra layer of security to your account."
        },
        {
          id: 18,
          question: "What should I do if I notice suspicious activity?",
          answer: "Immediately contact our support team through WhatsApp (+254 700 000 000) or email (support@cryptominepro.com). Also, change your password and enable 2FA if not already active."
        }
      ]
    }
  ];

  const allFaqs = faqCategories.flatMap(category => category.faqs);
  const filteredFaqs = searchQuery 
    ? allFaqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allFaqs;

  const toggleFaq = (id: number) => {
    setOpenFaq(openFaq === id ? null : id);
  };

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
        <h1 className="text-white font-bold text-lg">Frequently Asked Questions</h1>
        <div></div>
      </div>

      <div className="p-4 space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search FAQs..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>

        {/* FAQ Categories */}
        {!searchQuery ? (
          <div className="space-y-6">
            {faqCategories.map((category) => (
              <div key={category.title} className="bg-slate-800 rounded-lg p-4">
                <h3 className="text-orange-500 font-semibold text-lg mb-4">{category.title}</h3>
                <div className="space-y-3">
                  {category.faqs.map((faq) => (
                    <div key={faq.id} className="border border-slate-700 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-700 transition-colors"
                      >
                        <span className="text-white font-medium">{faq.question}</span>
                        {openFaq === faq.id ? (
                          <ChevronDown className="w-5 h-5 text-slate-400" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-slate-400" />
                        )}
                      </button>
                      {openFaq === faq.id && (
                        <div className="px-4 pb-4 border-t border-slate-700">
                          <p className="text-slate-300 text-sm leading-relaxed mt-3">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Search Results */
          <div className="bg-slate-800 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-4">
              Search Results ({filteredFaqs.length} found)
            </h3>
            {filteredFaqs.length > 0 ? (
              <div className="space-y-3">
                {filteredFaqs.map((faq) => (
                  <div key={faq.id} className="border border-slate-700 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-700 transition-colors"
                    >
                      <span className="text-white font-medium">{faq.question}</span>
                      {openFaq === faq.id ? (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                      )}
                    </button>
                    {openFaq === faq.id && (
                      <div className="px-4 pb-4 border-t border-slate-700">
                        <p className="text-slate-300 text-sm leading-relaxed mt-3">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-400">No FAQs found matching your search.</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-orange-500 hover:text-orange-400 transition-colors mt-2"
                >
                  Clear search to see all FAQs
                </button>
              </div>
            )}
          </div>
        )}

        {/* Contact Support */}
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-3">Still need help?</h3>
          <p className="text-slate-400 text-sm mb-4">
            Can't find what you're looking for? Our support team is available 24/7 to assist you.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors">
              WhatsApp Support
            </button>
            <button className="bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              Email Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
