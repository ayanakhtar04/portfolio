import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Parallax scroll effect for elements
export const parallaxScroll = (element, speed = 0.5) => {
  if (prefersReducedMotion()) return;

  gsap.to(element, {
    y: () => window.innerHeight * speed,
    scrollTrigger: {
      trigger: element,
      start: 'top center',
      end: 'bottom center',
      scrub: 1,
      markers: false,
    },
  });
};

// Stagger elements on scroll into view
export const staggerOnScroll = (selector, staggerAmount = 0.1, duration = 0.6) => {
  if (prefersReducedMotion()) return;

  const elements = document.querySelectorAll(selector);
  if (!elements.length) return;

  gsap.fromTo(
    elements,
    { opacity: 0, y: 50, rotateX: -10 },
    {
      opacity: 1,
      y: 0,
      rotateX: 0,
      duration: duration,
      stagger: staggerAmount,
      ease: 'back.out',
      scrollTrigger: {
        trigger: elements[0].parentElement,
        start: 'top 80%',
        end: 'top 20%',
        scrub: 0.5,
        markers: false,
      },
    }
  );
};

// Scale elements up on scroll
export const scaleOnScroll = (selector, maxScale = 1.1) => {
  if (prefersReducedMotion()) return;

  const elements = document.querySelectorAll(selector);
  elements.forEach(element => {
    gsap.fromTo(
      element,
      { scale: 0.9, opacity: 0 },
      {
        scale: maxScale,
        opacity: 1,
        duration: 0.8,
        ease: 'elastic.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          end: 'top 20%',
          scrub: 0.5,
          markers: false,
        },
      }
    );
  });
};

// Rotate elements on scroll
export const rotateOnScroll = (selector, maxRotation = 360) => {
  if (prefersReducedMotion()) return;

  const elements = document.querySelectorAll(selector);
  elements.forEach(element => {
    gsap.fromTo(
      element,
      { rotation: 0, opacity: 0 },
      {
        rotation: maxRotation,
        opacity: 1,
        duration: 1.2,
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          end: 'top 20%',
          scrub: 1,
          markers: false,
        },
      }
    );
  });
};

// Text clip animation on scroll
export const textClipOnScroll = (selector) => {
  if (prefersReducedMotion()) return;

  const elements = document.querySelectorAll(selector);
  elements.forEach(element => {
    // Wrap text in spans
    const text = element.textContent;
    element.innerHTML = text
      .split('')
      .map(char => `<span style="display: inline-block;">${char}</span>`)
      .join('');

    const chars = element.querySelectorAll('span');

    gsap.fromTo(
      chars,
      {
        opacity: 0,
        y: 20,
        rotateY: -90,
      },
      {
        opacity: 1,
        y: 0,
        rotateY: 0,
        duration: 0.05,
        stagger: 0.02,
        ease: 'back.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          end: 'top 20%',
          scrub: 0.5,
          markers: false,
        },
      }
    );
  });
};

// Horizontal slide on scroll
export const slideOnScroll = (selector, direction = 'left') => {
  if (prefersReducedMotion()) return;

  const elements = document.querySelectorAll(selector);
  elements.forEach(element => {
    const xValue = direction === 'left' ? -100 : 100;

    gsap.fromTo(
      element,
      { x: xValue, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          end: 'top 20%',
          scrub: 0.5,
          markers: false,
        },
      }
    );
  });
};

// Blur and sharpen on scroll
export const blurOnScroll = (selector, maxBlur = 10) => {
  if (prefersReducedMotion()) return;

  const elements = document.querySelectorAll(selector);
  elements.forEach(element => {
    gsap.fromTo(
      element,
      { filter: `blur(${maxBlur}px)`, opacity: 0 },
      {
        filter: 'blur(0px)',
        opacity: 1,
        duration: 0.8,
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          end: 'top 20%',
          scrub: 0.5,
          markers: false,
        },
      }
    );
  });
};

// Gradient shift on scroll
export const gradientShiftOnScroll = (selector) => {
  if (prefersReducedMotion()) return;

  const elements = document.querySelectorAll(selector);
  elements.forEach(element => {
    gsap.to(element, {
      backgroundPosition: '200% center',
      duration: 1,
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        end: 'top 20%',
        scrub: 1,
        markers: false,
      },
    });
  });
};

// Bounce effect on scroll
export const bounceOnScroll = (selector) => {
  if (prefersReducedMotion()) return;

  const elements = document.querySelectorAll(selector);
  elements.forEach(element => {
    gsap.fromTo(
      element,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'bounce.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          end: 'top 20%',
          scrub: 0.5,
          markers: false,
        },
      }
    );
  });
};

// Counter animation on scroll (count numbers)
export const counterOnScroll = (selector) => {
  if (prefersReducedMotion()) return;

  const elements = document.querySelectorAll(selector);
  elements.forEach(element => {
    const target = parseInt(element.getAttribute('data-target')) || 100;
    const obj = { value: 0 };

    gsap.to(obj, {
      value: target,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => {
        element.textContent = Math.floor(obj.value);
      },
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        once: true,
        markers: false,
      },
    });
  });
};

// Flip card animation on scroll
export const flipOnScroll = (selector) => {
  if (prefersReducedMotion()) return;

  const elements = document.querySelectorAll(selector);
  elements.forEach(element => {
    gsap.fromTo(
      element,
      { rotateY: -90, opacity: 0 },
      {
        rotateY: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'back.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          end: 'top 20%',
          scrub: 0.5,
          markers: false,
        },
      }
    );
  });
};

// Light-up effect (glow intensifies)
export const lightupOnScroll = (selector) => {
  if (prefersReducedMotion()) return;

  const elements = document.querySelectorAll(selector);
  elements.forEach(element => {
    gsap.fromTo(
      element,
      {
        boxShadow: '0 0 0px rgba(34, 211, 238, 0)',
        backgroundColor: 'transparent',
      },
      {
        boxShadow: '0 0 30px rgba(34, 211, 238, 0.5), inset 0 0 20px rgba(34, 211, 238, 0.2)',
        backgroundColor: 'rgba(34, 211, 238, 0.1)',
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          end: 'top 20%',
          scrub: 0.5,
          markers: false,
        },
      }
    );
  });
};

// Skew on scroll
export const skewOnScroll = (selector, maxSkew = 10) => {
  if (prefersReducedMotion()) return;

  const elements = document.querySelectorAll(selector);
  elements.forEach(element => {
    gsap.fromTo(
      element,
      { skewY: maxSkew, opacity: 0 },
      {
        skewY: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'back.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          end: 'top 20%',
          scrub: 0.5,
          markers: false,
        },
      }
    );
  });
};

// Initialize all scroll animations
export const initializeAllScrollAnimations = () => {
  if (prefersReducedMotion()) return;

  // Stagger sections
  staggerOnScroll('[data-scroll-stagger]', 0.1, 0.6);

  // Scale elements
  scaleOnScroll('[data-scroll-scale]', 1.05);

  // Rotate elements
  rotateOnScroll('[data-scroll-rotate]', 180);

  // Slide elements
  slideOnScroll('[data-scroll-slide-left]', 'left');
  slideOnScroll('[data-scroll-slide-right]', 'right');

  // Blur elements
  blurOnScroll('[data-scroll-blur]', 8);

  // Bounce elements
  bounceOnScroll('[data-scroll-bounce]');

  // Counter elements
  counterOnScroll('[data-scroll-counter]');

  // Flip elements
  flipOnScroll('[data-scroll-flip]');

  // Light-up elements
  lightupOnScroll('[data-scroll-lightup]');

  // Skew elements
  skewOnScroll('[data-scroll-skew]', 5);
};

// Cleanup function
export const cleanupScrollAnimations = () => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
};
