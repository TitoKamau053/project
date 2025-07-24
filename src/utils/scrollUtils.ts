// Scroll utilities for navigation and user experience

export const scrollToElement = (elementId: string, offset: number = 0) => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - offset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

export const scrollToRef = (ref: React.RefObject<HTMLElement>, offset: number = 0) => {
  if (ref.current) {
    const elementPosition = ref.current.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - offset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

// Set flag in localStorage to trigger scroll on component mount
export const setScrollFlag = (flag: string) => {
  localStorage.setItem('scrollFlag', flag);
};

// Get and clear scroll flag
export const getAndClearScrollFlag = (): string | null => {
  const flag = localStorage.getItem('scrollFlag');
  if (flag) {
    localStorage.removeItem('scrollFlag');
  }
  return flag;
};
