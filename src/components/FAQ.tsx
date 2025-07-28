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
          question: "How do I deposit funds into my account?",
          answer: "You can deposit funds using M-Pesa or Cryptocurrency. Simply go to your Dashboard, click on \"Deposit\", enter the amount you want to fund, and follow the on-screen instructions to complete the process."
        },
        {
          id: 2,
          question: "What are the minimum and maximum deposit amounts?",
          answer: "You can deposit any amount starting from KES 5. However, to start mining, the minimum required amount is KES 500 via M-Pesa. The maximum amount allowed per account is KES 5,000,000."
        },
        {
          id: 3,
          question: "What are the withdrawal fees?",
          answer: "There are no withdrawal fees. You receive 100% of your earnings."
        }
      ]
    },
    {
      title: "Mining & Earnings",
      faqs: [
        {
          id: 4,
          question: "How do mining engines work?",
          answer: "Mining engines use auto-mining to help you earn passively. You deposit a set amount, and the system automatically mines and gives you profit after a set time based on the plan you choose."
        },
        {
          id: 7,
          question: "Can I cancel an active mining investment?",
          answer: "Once a mining engine is activated, it cannot be cancelled until it completes its cycle. However, when the mining period ends, you can choose not to reload or reactivate the engine."
        }
      ]
    },
    {
      title: "Referrals & Bonuses",
      faqs: [
        {
          id: 5,
          question: "How do I earn from referrals?",
          answer: "Simply share your unique referral link with others. When someone signs up using your link and makes their first deposit, you'll earn a 10% commission based on the amount they deposit. Referrals are completely optional."
        }
      ]
    },
    {
      title: "Security & Support",
      faqs: [
        {
          id: 6,
          question: "Is my money safe with CryptoMine Pro?",
          answer: "Yes, your money is safe. We use bank-level encryption, secure payment processors, and store all funds in segregated accounts. Our platform follows strict security protocols to keep your funds and data protected."
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
