# Unused source (moved out of src/ during the pre-deploy audit)

None of these files is imported by the live site, so none of them is in the
build. They are kept only so nothing is lost; delete this folder when you're
sure you don't need them.

- components/Hero.jsx, Pipeline.jsx, Skills.jsx, Contact.jsx: earlier versions,
  replaced by the Animated* components.
- components/Header.jsx: the top bar, replaced by the bottom dock.
- components/BootIntro.jsx: the boot intro, no longer mounted.
- components/ScrollAnimationsExample.jsx, TechBackground.jsx: demo/old background.
- utils/animations.js, utils/scrollAnimations.js: old GSAP helpers.
