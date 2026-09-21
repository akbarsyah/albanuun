# Albanuun — Design System

## 1. Design Philosophy

Albanuun should feel like a private, calm, premium companion rather than a generic pregnancy tracker.

The visual experience should communicate:

- Warmth
- Calm
- Trust
- Intimacy
- Clarity
- Quiet optimism

The design should feel appropriate for both Mom and Dad.

Avoid stereotypical "baby app" aesthetics.

Do not make the interface excessively cute, childish, pink, or decorative.

The emotional tone should be subtle rather than sentimental.

---

## 2. Visual Inspiration

Use the following as conceptual references, not things to copy:

- Apple Health — information hierarchy and clarity
- Day One — personal journal feeling
- Linear — disciplined interface and typography
- Modern editorial design — whitespace, typography, restraint
- Premium healthcare products — trust and clarity

Albanuun should combine these qualities into its own identity.

---

## 3. Brand Direction

Brand name:

Albanuun

The name is inspired by the Arabic word البَنُون (al-banūn), relating to children / offspring.

The Arabic origin should influence the emotional character subtly, but the interface should NOT become heavily Arabic-themed.

Avoid:

- Arabic ornamental patterns everywhere
- Excessive Islamic decoration
- Generic "Islamic app" aesthetics
- Gold-heavy palettes
- Calligraphy as a primary UI element

A subtle cultural influence is welcome through wording, typography choices, and restrained visual details.

---

## 4. Color Direction

Use a warm neutral foundation.

Primary background:
- Warm off-white / ivory

Primary text:
- Deep charcoal

Secondary text:
- Muted warm gray

Accent:
- A restrained earthy or botanical tone

Supporting colors:
- Soft green
- Muted sand
- Warm beige

Avoid highly saturated colors.

Avoid using color merely for decoration.

Color should communicate hierarchy, state, or interaction.

Maintain accessible text contrast.

---

## 5. Typography

Typography should be one of the main visual features.

Prioritize:

- Excellent readability
- Strong hierarchy
- Generous line height
- Large, confident headings
- Restrained use of font weights

Recommended approach:

- Display / heading font: elegant modern serif or refined humanist style
- Body / UI font: clean sans-serif

If external fonts are used, use a small number of fonts and ensure the app remains usable if the font fails to load.

Do not use decorative script fonts.

---

## 6. Layout

Mobile-first.

Primary design target:

390px × 844px

The interface should still work well around:

- 320px width
- 375px width
- 390px width
- 430px width

Desktop should adapt naturally but is secondary.

Use generous horizontal margins.

Avoid filling every available pixel.

Content should breathe.

---

## 7. Navigation

Keep navigation simple.

Prefer a small bottom navigation system on mobile.

Suggested primary navigation:

Home
Care
Journey

Secondary features can be accessed within these sections.

Do not create a navigation item for every feature.

The user should not need to understand the entire information architecture to use the app.

---

## 8. Home Screen

The Home screen is the emotional and functional center of Albanuun.

Priority order:

1. Current pregnancy context
2. Due date / countdown
3. Immediate support for Mom
4. Dad Mode
5. Upcoming appointment
6. Relevant information

The Home screen should feel calm rather than dashboard-like.

Do not create a grid of many equal-sized cards.

Create a clear visual hierarchy.

The most important information should visually dominate.

---

## 9. Cards and Containers

Use cards only when they provide meaningful grouping.

Avoid:

- Card grids everywhere
- Excessive rounded rectangles
- Heavy shadows
- Decorative containers
- Nested cards

Prefer:

- Open layouts
- Dividers
- Typography
- Subtle background changes
- Thin borders
- Whitespace

Cards should have modest corner radii rather than exaggerated rounded corners.

---

## 10. Buttons

Buttons should be:

- Clear
- Tactile
- Accessible
- Large enough for touch

Primary actions should be visually obvious.

Avoid excessive button styles.

Use one primary action style and a small number of secondary styles.

Do not use pill-shaped buttons everywhere.

---

## 11. Icons

Icons should communicate meaning, not decoration.

Use a consistent icon system.

Avoid emoji as interface icons.

Emoji may appear in occasional content where appropriate, but should not form the primary visual language.

---

## 12. Animation

Animation should be subtle and purposeful.

Acceptable:

- Page transitions
- Small state changes
- Progress transitions
- Gentle feedback after completing an action

Avoid:

- Constant motion
- Floating elements
- Excessive bouncing
- Decorative animations
- Long transitions

Respect reduced-motion accessibility preferences.

---

## 13. Tone of Voice

Albanuun's writing should be:

- Warm
- Calm
- Reassuring
- Human
- Concise
- Respectful

Avoid:

- Baby-talk
- Overly sentimental language
- Excessive exclamation marks
- Corporate language
- Fear-inducing language
- Medical jargon without explanation

The app should sound like a thoughtful companion, not a doctor or a motivational coach.

---

## 14. Islamic Language

Use "In shaa Allaah" naturally where appropriate.

For example:

"In shaa Allaah, 4 April 2027"

Do not force religious language into every screen.

The app should remain natural and comfortable to use.

---

## 15. Information Density

Prioritize progressive disclosure.

Show the most useful information first.

Allow the user to expand details when needed.

Avoid long walls of text.

For educational content:

Short answer
↓
Why
↓
More detail
↓
When to seek professional advice

---

## 16. Accessibility

The application must prioritize:

- Sufficient color contrast
- Readable font sizes
- Clear focus states
- Large touch targets
- Semantic HTML
- Keyboard accessibility
- Reduced-motion support
- Clear labels
- No information conveyed by color alone

Do not sacrifice accessibility for aesthetics.

---

## 17. Responsive Behavior

The interface must adapt rather than simply scale.

On smaller screens:

- Reduce horizontal padding
- Preserve readable text sizes
- Stack content vertically
- Keep primary actions accessible
- Avoid horizontal overflow

On larger screens:

- Constrain content width
- Avoid excessively wide text blocks
- Preserve the mobile visual hierarchy

---

## 18. Data Visualization

Use visualization only when it improves understanding.

Examples:

- Pregnancy progress
- Countdown
- Timeline
- Completion status

Avoid charts for the sake of having charts.

Prefer simple progress indicators and timelines over complicated dashboards.

---

## 19. Design Principle

When choosing between:

A. More information

B. Better hierarchy

Prefer better hierarchy.

When choosing between:

A. More decoration

B. Better usability

Prefer better usability.

When choosing between:

A. More features

B. A calmer experience

Prefer the calmer experience.

Albanuun should feel intentionally designed, not feature-heavy.

---

## 20. Implementation Rule

All future UI work must follow this design system.

Before introducing a new visual pattern:

1. Check whether an existing pattern can be reused.
2. Prefer consistency over novelty.
3. Avoid introducing unnecessary components.
4. Do not add visual decoration without a functional or emotional purpose.