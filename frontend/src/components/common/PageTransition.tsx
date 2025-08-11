import React, { useEffect, useRef, type ReactNode } from 'react';
import './PageTransition.css';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
  animation?: 'fade-in' | 'slide-in-top' | 'slide-in-bottom' | 'slide-in-left' | 'slide-in-right' | 'zoom-in' | 'bounce-in' | 'rotate-in';
  delay?: number;
}

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  animation?: 'slide-up' | 'slide-left' | 'slide-right' | 'scale-in' | 'rotate-in';
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

// Page Transition Component
export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  className = '',
  animation = 'fade-in',
  delay = 0
}) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const timer = setTimeout(() => {
      element.classList.add('entrance-animation', animation);
    }, delay);

    return () => clearTimeout(timer);
  }, [animation, delay]);

  return (
    <div
      ref={elementRef}
      className={`page-transition-container ${className}`}
    >
      {children}
    </div>
  );
};

// Scroll Reveal Component
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  animation = 'slide-up',
  threshold = 0.1,
  rootMargin = '0px 0px -50px 0px',
  triggerOnce = true
}) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            if (triggerOnce) {
              observer.unobserve(entry.target);
            }
          } else if (!triggerOnce) {
            entry.target.classList.remove('revealed');
          }
        });
      },
      {
        threshold,
        rootMargin
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return (
    <div
      ref={elementRef}
      className={`scroll-reveal ${animation} ${className}`}
    >
      {children}
    </div>
  );
};

// Stagger Container Component
export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  className = '',
  staggerDelay = 100
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const childElements = container.children;
    Array.from(childElements).forEach((child, index) => {
      const delay = index * staggerDelay;
      (child as HTMLElement).style.animationDelay = `${delay}ms`;
    });
  }, [staggerDelay]);

  return (
    <div
      ref={containerRef}
      className={`stagger-animation ${className}`}
    >
      {children}
    </div>
  );
};

// Scroll Progress Hook
export const useScrollProgress = () => {
  const [progress, setProgress] = React.useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setProgress(progress);
    };

    window.addEventListener('scroll', updateProgress);
    updateProgress();

    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return progress;
};

// Parallax Hook
export const useParallax = (speed: number = 0.5) => {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const updateParallax = () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -speed;
      element.style.setProperty('--parallax-y', `${rate}px`);
    };

    window.addEventListener('scroll', updateParallax);
    updateParallax();

    return () => window.removeEventListener('scroll', updateParallax);
  }, [speed]);

  return elementRef;
};

// Scroll Progress Component
export const ScrollProgressIndicator: React.FC = () => {
  const progress = useScrollProgress();

  return (
    <div className="scroll-indicator">
      <div 
        className="scroll-progress" 
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default PageTransition;