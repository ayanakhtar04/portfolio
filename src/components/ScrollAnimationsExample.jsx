import React from 'react';

/**
 * ScrollAnimationsExample Component
 *
 * This component demonstrates all available scroll animations.
 * Use the data-attributes to apply animations to your elements.
 *
 * Available Scroll Animations:
 *
 * 1. data-scroll-stagger - Stagger elements on scroll
 *    Usage: <div data-scroll-stagger>Content</div>
 *    Effect: Elements fade in with staggered delays
 *
 * 2. data-scroll-scale - Scale elements up on scroll
 *    Usage: <div data-scroll-scale>Content</div>
 *    Effect: Elements scale from 0.9 to 1.1 with elastic easing
 *
 * 3. data-scroll-rotate - Rotate elements on scroll
 *    Usage: <div data-scroll-rotate>Content</div>
 *    Effect: Elements rotate 180 degrees smoothly
 *
 * 4. data-scroll-slide-left - Slide in from left
 *    Usage: <div data-scroll-slide-left>Content</div>
 *    Effect: Elements slide in from left with power easing
 *
 * 5. data-scroll-slide-right - Slide in from right
 *    Usage: <div data-scroll-slide-right>Content</div>
 *    Effect: Elements slide in from right with power easing
 *
 * 6. data-scroll-blur - Blur and sharpen on scroll
 *    Usage: <div data-scroll-blur>Content</div>
 *    Effect: Elements transition from blurred (10px) to sharp
 *
 * 7. data-scroll-bounce - Bounce effect on scroll
 *    Usage: <div data-scroll-bounce>Content</div>
 *    Effect: Elements bounce into view with bounce.out easing
 *
 * 8. data-scroll-counter - Count numbers on scroll
 *    Usage: <div data-scroll-counter data-target="99">0</div>
 *    Effect: Counter animates from 0 to data-target value
 *
 * 9. data-scroll-flip - Flip cards on scroll
 *    Usage: <div data-scroll-flip>Content</div>
 *    Effect: Elements rotate 90 degrees on Y axis
 *
 * 10. data-scroll-lightup - Glow effect on scroll
 *     Usage: <div data-scroll-lightup>Content</div>
 *     Effect: Box shadow glows with cyan color
 *
 * 11. data-scroll-skew - Skew elements on scroll
 *     Usage: <div data-scroll-skew>Content</div>
 *     Effect: Elements skew 10 degrees then straighten
 *
 * 12. data-reveal - General reveal on scroll
 *     Usage: <div data-reveal>Content</div>
 *     Effect: Default fade in and slide up animation
 *
 * Combining Animations:
 * <div data-scroll-bounce data-scroll-scale>
 *   Content bounces AND scales simultaneously
 * </div>
 *
 * Customizing:
 * Edit src/utils/scrollAnimations.js to modify durations, easing, etc.
 *
 * Performance Notes:
 * - All animations use transform and opacity (GPU-accelerated)
 * - Respects prefers-reduced-motion
 * - Animations pause when off-screen
 * - No performance impact when animations are disabled
 */

export const ScrollAnimationsExample = () => {
  return (
    <div className="hidden">
      {/* This component serves as documentation only */}
      <p>See component file for scroll animation usage guide</p>
    </div>
  );
};

export default ScrollAnimationsExample;
