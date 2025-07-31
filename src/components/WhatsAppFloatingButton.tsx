import React, { useState, useRef, useEffect } from 'react';
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

  // State to track position of the floating button
  const [position, setPosition] = useState({ x: window.innerWidth - 64 - 16, y: window.innerHeight - 64 - 16 }); // 64px button size + 16px margin
  const [dragging, setDragging] = useState(false);
  const dragStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragStartMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Update position on window resize to keep button inside viewport
  useEffect(() => {
    const handleResize = () => {
      setPosition(pos => ({
        x: Math.min(pos.x, window.innerWidth - 64 - 16),
        y: Math.min(pos.y, window.innerHeight - 64 - 16)
      }));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
    dragStartPos.current = position;
    dragStartMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const touchMoved = useRef(false);

  const onTouchStart = (e: React.TouchEvent) => {
    // Do NOT call preventDefault here to allow click events on mobile
    setDragging(true);
    touchMoved.current = false;
    const touch = e.touches[0];
    dragStartPos.current = position;
    dragStartMousePos.current = { x: touch.clientX, y: touch.clientY };
  };

  // Prevent scrolling while dragging
  useEffect(() => {
    const preventScroll = (e: TouchEvent) => {
      if (dragging) {
        e.preventDefault();
      }
    };
    window.addEventListener('touchmove', preventScroll, { passive: false });
    return () => {
      window.removeEventListener('touchmove', preventScroll);
    };
  }, [dragging]);

  const onMouseMove = (e: MouseEvent) => {
    if (!dragging) return;
    e.preventDefault();
    const deltaX = e.clientX - dragStartMousePos.current.x;
    const deltaY = e.clientY - dragStartMousePos.current.y;
    let newX = dragStartPos.current.x + deltaX;
    let newY = dragStartPos.current.y + deltaY;

    // Keep within viewport boundaries
    newX = Math.max(16, Math.min(newX, window.innerWidth - 64 - 16));
    newY = Math.max(16, Math.min(newY, window.innerHeight - 64 - 16));

    setPosition({ x: newX, y: newY });
  };

  const onTouchMove = (e: TouchEvent) => {
    if (!dragging) return;
    e.preventDefault();
    const touch = e.touches[0];
    const deltaX = touch.clientX - dragStartMousePos.current.x;
    const deltaY = touch.clientY - dragStartMousePos.current.y;

    // If moved more than 5px, consider it a drag
    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
      touchMoved.current = true;
    }

    let newX = dragStartPos.current.x + deltaX;
    let newY = dragStartPos.current.y + deltaY;

    // Keep within viewport boundaries
    newX = Math.max(16, Math.min(newX, window.innerWidth - 64 - 16));
    newY = Math.max(16, Math.min(newY, window.innerHeight - 64 - 16));

    setPosition({ x: newX, y: newY });
  };

  const onMouseUp = (e: MouseEvent) => {
    if (dragging) {
      e.preventDefault();
      setDragging(false);
    }
  };

  const onTouchEnd = (e: TouchEvent) => {
    if (dragging) {
      // Do not preventDefault here to allow click event
      setDragging(false);
    }
  };

  const onClick = (e: React.MouseEvent | React.TouchEvent) => {
    // Allow all clicks, no prevention
  };

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [dragging]);

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`z-50 flex items-center justify-center w-16 h-16 rounded-full shadow-lg text-white ${whatsappContact.color} hover:opacity-90 transition-opacity cursor-pointer`}
      aria-label={`Chat on ${whatsappContact.name}`}
      title={`Chat on ${whatsappContact.name}`}
      style={{ position: 'fixed', left: position.x, top: position.y }}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      onClick={onClick}
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  );
};
