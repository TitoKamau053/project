import { useState } from 'react';
import { ArrowLeft, MessageCircle, Phone, Mail, Search, ChevronDown, ChevronRight, Send } from 'lucide-react';

interface SupportProps {
  onBack: () => void;
}

export const Support = ({ onBack }: SupportProps) => {
  const [activeTab, setActiveTab] = useState('faq');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
    priority: 'medium'
  });

  const faqData = [
    {
      id: 1,
      question: "How do I deposit funds into my account?",
      answer: "You can deposit funds using M-Pesa, Bank Transfer, or Cryptocurrency. Go to the Deposit page, select your preferred method, enter the amount, and follow the instructions provided."
    },
    {
      id: 2,
      question: "What are the minimum and maximum deposit amounts?",
      answer: "Minimum deposits: M-Pesa (KES 100), Bank Transfer (KES 500), Crypto (KES 50). Maximum deposits: M-Pesa (KES 300,000), Bank Transfer (KES 1,000,000), Crypto (KES 5,000,000)."
    },
    {
      id: 3,
      question: "How long does it take to process withdrawals?",
      answer: "M-Pesa withdrawals are processed within 1-5 minutes, Bank transfers take 2-24 hours, and cryptocurrency withdrawals take 10-60 minutes depending on network congestion."
    },
    {
      id: 4,
      question: "What are the withdrawal fees?",
      answer: "M-Pesa withdrawals have a 2% fee, Bank transfers have a flat KES 50 fee, and cryptocurrency withdrawals have a 1.5% fee."
    },
    {
      id: 5,
      question: "How do mining engines work?",
      answer: "Mining engines are automated investment plans that generate returns over specified periods. You invest a fixed amount, and the system automatically generates profits based on the ROI percentage and duration."
    },
    {
      id: 6,
      question: "How do I earn from referrals?",
      answer: "Share your unique referral link with friends. When they register and make their first deposit, you earn 10% commission on their deposit amount."
    },
    {
      id: 7,
      question: "Is my money safe with CryptoMine Pro?",
      answer: "Yes, we use bank-level encryption and secure payment processors. All funds are stored in segregated accounts and we maintain strict security protocols."
    },
    {
      id: 8,
      question: "Can I cancel an active mining investment?",
      answer: "Active mining investments cannot be cancelled once started. However, you can choose not to reinvest when the mining period expires."
    }
  ];

  const supportChannels = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: MessageCircle,
      contact: '+254 703 819 807',
      availability: '24/7',
      responseTime: 'Within 5 minutes',
      color: 'bg-green-600'
    },
    {
      id: 'telegram',
      name: 'Telegram',
      icon: MessageCircle,
      contact: '@cryptomine_pro',
      availability: '24/7',
      responseTime: 'Within 10 minutes',
      color: 'bg-blue-600'
    },
    {
      id: 'phone',
      name: 'Phone Support',
      icon: Phone,
      contact: '+254 703 819 807',
      availability: '9 AM - 6 PM',
      responseTime: 'Immediate',
      color: 'bg-orange-600'
    },
    {
      id: 'email',
      name: 'Email Support',
      icon: Mail,
      contact: 'support@cryptominepro.com',
      availability: '24/7',
      responseTime: 'Within 2 hours',
      color: 'bg-slate-600'
    }
  ];

  const filteredFaq = faqData.filter(item =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmitTicket = () => {
    if (!contactForm.subject || !contactForm.message) {
      alert('Please fill in all required fields');
      return;
    }
    alert('Support ticket submitted successfully! We\'ll get back to you soon.');
    setContactForm({ subject: '', message: '', priority: 'medium' });
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
        <h1 className="text-white font-bold text-lg">Help & Support</h1>
        <div></div>
      </div>

      <div className="p-4">
        {/* Support Tabs */}
        <div className="flex bg-slate-800 rounded-lg p-1 mb-6">
          {[
            { id: 'faq', label: 'FAQ' },
            { id: 'contact', label: 'Contact Us' },
            { id: 'ticket', label: 'Submit Ticket' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-orange-500 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <div className="space-y-6">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search FAQ..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 pl-12 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            </div>

            {/* FAQ List */}
            <div className="space-y-3">
              {filteredFaq.map((item) => (
                <div key={item.id} className="bg-slate-800 rounded-lg border border-slate-700">
                  <button
                    onClick={() => setOpenFaq(openFaq === item.id ? null : item.id)}
                    className="w-full p-4 text-left flex items-center justify-between hover:bg-slate-700 transition-colors"
                  >
                    <span className="text-white font-medium">{item.question}</span>
                    {openFaq === item.id ? (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    )}
                  </button>
                  {openFaq === item.id && (
                    <div className="px-4 pb-4">
                      <p className="text-slate-300 leading-relaxed">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredFaq.length === 0 && searchQuery && (
              <div className="text-center py-8">
                <p className="text-slate-400">No FAQ found matching your search.</p>
              </div>
            )}
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-4">Get in Touch</h3>
              <p className="text-slate-400 mb-6">
                Choose your preferred way to contact our support team. We're here to help 24/7.
              </p>

              <div className="grid gap-4">
                {supportChannels.map((channel) => {
                  const Icon = channel.icon;
                  return (
                    <div
                      key={channel.id}
                      className="bg-slate-900 rounded-lg p-4 border border-slate-700"
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 ${channel.color} rounded-lg flex items-center justify-center`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-semibold mb-1">{channel.name}</h4>
                          <p className="text-slate-400 text-sm mb-2">{channel.contact}</p>
                          <div className="flex items-center space-x-4 text-xs text-slate-500">
                            <span>Available: {channel.availability}</span>
                            <span>Response: {channel.responseTime}</span>
                          </div>
                        </div>
                        <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                          Contact
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-800 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="bg-slate-700 text-white py-3 px-4 rounded-lg hover:bg-slate-600 transition-colors">
                  Live Chat
                </button>
                <button className="bg-slate-700 text-white py-3 px-4 rounded-lg hover:bg-slate-600 transition-colors">
                  Schedule Call
                </button>
                <button className="bg-slate-700 text-white py-3 px-4 rounded-lg hover:bg-slate-600 transition-colors">
                  Video Call
                </button>
                <button className="bg-slate-700 text-white py-3 px-4 rounded-lg hover:bg-slate-600 transition-colors">
                  Screen Share
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Submit Ticket Tab */}
        {activeTab === 'ticket' && (
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-4">Submit Support Ticket</h3>
              <p className="text-slate-400 mb-6">
                Can't find what you're looking for? Submit a detailed support ticket and our team will get back to you.
              </p>

              <div className="space-y-4">
                {/* Priority */}
                <div>
                  <label className="block text-slate-400 text-sm font-medium mb-2">
                    Priority Level
                  </label>
                  <select
                    value={contactForm.priority}
                    onChange={(e) => setContactForm({ ...contactForm, priority: e.target.value })}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                    title="Select priority level"
                  >
                    <option value="low">Low - General inquiry</option>
                    <option value="medium">Medium - Account issue</option>
                    <option value="high">High - Payment issue</option>
                    <option value="urgent">Urgent - Security concern</option>
                  </select>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-slate-400 text-sm font-medium mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    placeholder="Brief description of your issue"
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-slate-400 text-sm font-medium mb-2">
                    Detailed Message *
                  </label>
                  <textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Please provide as much detail as possible about your issue..."
                    rows={6}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors resize-none"
                  />
                </div>

                <button
                  onClick={handleSubmitTicket}
                  className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <Send className="w-5 h-5" />
                  <span>Submit Ticket</span>
                </button>
              </div>
            </div>

            {/* Response Time Info */}
            <div className="bg-slate-800 rounded-lg p-4 border-l-4 border-blue-500">
              <h4 className="text-white font-semibold mb-2">Expected Response Times</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Low Priority:</span>
                  <span className="text-white">24-48 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Medium Priority:</span>
                  <span className="text-white">4-8 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">High Priority:</span>
                  <span className="text-white">1-2 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Urgent:</span>
                  <span className="text-white">Within 30 minutes</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
