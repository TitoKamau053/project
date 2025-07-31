import React from 'react';
import { MessageCircle } from 'lucide-react';

const whatsappContact = {
  id: 'whatsapp',
  name: 'WhatsApp',
  icon: MessageCircle,
  contact: '+254703819807',
  availability: '24/7',
  responseTime: 'Within 5 minutes',
  color: 'bg-green-600'
};

const defaultMessage = 'Hello.';

export const WhatsAppFloatingButton: React.FC = () => {
  const whatsappUrl = `https://wa.me/${whatsappContact.contact.replace(/\D/g, '')}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-4 right-4 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg text-white ${whatsappContact.color} hover:opacity-90 transition-opacity`}
      aria-label={`Chat on ${whatsappContact.name}`}
      title={`Chat on ${whatsappContact.name}`}
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  );
};
