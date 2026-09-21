# Albanuun — Project Specification

## 1. Product

Albanuun is a private-feeling, mobile-first pregnancy companion for a husband and wife expecting their baby.

The app should feel personal, calm, useful, and reassuring — not like a generic pregnancy tracker.

The existing pregnancy tracker already handles pregnancy week tracking and weekly baby development. Albanuun should complement it rather than duplicate it.

---

## 2. Core Goals

Albanuun should help:

1. Support Mom during pregnancy.
2. Help Dad understand how to support Mom.
3. Organize practical pregnancy-related information.
4. Keep important appointments and preparation organized.
5. Capture a simple timeline of meaningful pregnancy milestones.
6. Provide trustworthy, easy-to-understand pregnancy information.
7. Provide a simple countdown toward the estimated due date.

---

## 3. V1 Features

### Home / Today
- Current pregnancy context
- Countdown to estimated due date
- "In shaa Allaah" birth countdown
- Quick access to Mom and Dad sections
- Upcoming appointment
- Contextual daily information

### For Mom
- Lightweight daily check-in
- Mood / general wellbeing
- Simple needs such as rest, food, water, quiet, or help
- Avoid excessive medical or symptom tracking

### Dad Mode
- Week-appropriate guidance for Dad
- Practical ways to support Mom
- Simple actions Dad can take
- Guidance should evolve throughout pregnancy

### Appointments
- Upcoming appointments
- Date and time
- Appointment notes
- Questions to ask the doctor
- Mark appointments as completed

### Timeline
- Pregnancy milestones
- Important appointments
- Meaningful events
- Current position in pregnancy
- Should complement rather than duplicate the pregnancy tracker

### Food & Hydration
- Simple hydration tracking
- Lightweight nutrition reminders
- Practical food ideas
- Do not turn this into calorie or diet tracking

### FAQ / Facts
- Frequently asked pregnancy questions
- Clear, concise explanations
- Explain what is commonly experienced
- Clearly identify situations requiring professional medical attention
- Medical information must be based on reliable sources

### Myth vs Fact
- Common pregnancy misconceptions
- Evidence-based explanations
- Keep entries short and easy to understand

### Preparation
Only reveal preparation content when relevant.

Focus on:
- Third trimester preparation
- Hospital preparation
- Birth plan
- Hospital bag
- Important documents
- Transportation
- Emergency contacts
- Practical preparation leading up to birth

Do not overwhelm the user with a huge baby-shopping checklist.

### Baby's Firsts
Keep this very brief.

Examples:
- First ultrasound
- First heartbeat
- First movement
- First kick felt by Dad
- First baby clothes
- Birth

This should integrate naturally with the Timeline.

---

## 4. Future Features

Not part of V1:

- Local photo / memory journal
- More advanced memory features
- Post-birth Baby Mode

Future features must not complicate V1 architecture unnecessarily.

---

## 5. Explicitly Out of Scope

Do not build:

- Baby name generator
- Social or community features
- Letters to baby
- Digital scrapbook
- AI medical chatbot
- Complex medical records
- User accounts
- Login system
- Cloud database
- Backend
- Social sharing
- Gamification
- Excessive notifications
- Calorie tracking
- Excessive symptom tracking

---

## 6. Technical Direction

V1 should be a simple static web application.

Preferred technology:

- HTML
- CSS
- Vanilla JavaScript

Avoid frameworks unless there is a clear technical reason to introduce one.

Hosting:

- GitHub
- GitHub Pages

PWA support should be included when appropriate.

Personal data should initially remain on the user's device using browser storage.

Do not introduce a backend or database for V1.

---

## 7. Design Direction

The visual language should feel:

- Calm
- Warm
- Personal
- Premium
- Modern
- Editorial
- Spacious
- Mobile-first

Avoid stereotypical pregnancy-app aesthetics.

Do not rely heavily on:
- Pink
- Baby clichés
- Excessive rounded cards
- Gradients
- Emojis
- Decorative icons
- Animations
- Excessive shadows
- Visual clutter

Prioritize:
- Strong typography
- Clear hierarchy
- Generous whitespace
- Excellent mobile usability
- Accessible contrast
- Subtle visual details
- Direct and understandable interactions

Design should feel closer to a premium personal journal or modern health product than a generic baby website.

---

## 8. Mobile First

The primary user experience is on a smartphone.

Design and test primarily around approximately 390px wide screens.

Prioritize:
- One-handed use
- Large touch targets
- Short interaction paths
- Minimal unnecessary scrolling
- Clear navigation
- Readability
- Fast loading

Desktop should remain functional but is secondary.

---

## 9. Medical Content

Albanuun is an educational and organizational tool, not a medical professional.

Medical information must:
- Use reliable sources
- Avoid unsupported claims
- Clearly distinguish common information from medical advice
- Include appropriate guidance about when to contact a healthcare professional
- Never diagnose conditions
- Never create false certainty

Medical content should be kept separate from UI code so it can be reviewed and updated independently.

---

## 10. Development Rules

Before modifying existing code:

1. Inspect the existing implementation.
2. Understand how the current feature works.
3. Preserve existing functionality.
4. Make the smallest clean change necessary.
5. Do not rewrite working code without a clear reason.
6. Avoid unnecessary dependencies.
7. Keep the architecture simple.
8. Keep content separate from presentation and logic where practical.
9. Test changes on mobile dimensions.
10. Check for regressions after significant changes.

Do not implement multiple unrelated features in one change unless explicitly requested.

---

## 11. Product Principle

Albanuun should not constantly remind the user that she is pregnant.

The app should make pregnancy:

- Easier
- More organized
- More understandable
- More personal
- More meaningful

The product is not simply an app about pregnancy.

It is an app for two people going through pregnancy together.

---

## 12. UX / Navigation

Albanuun uses three primary navigation destinations on mobile:

**Journey | Home | Care**

Home is the central and primary destination.

Settings should be accessible from the header and should not occupy a primary navigation slot.

---

## 13. Home

Home is the daily starting point and emotional center of the application.

The Home screen should answer four questions quickly:

1. Where are we in the pregnancy?
2. How is Mom doing?
3. What can Dad do?
4. Is there anything important coming up?

### Home hierarchy

1. Pregnancy status
2. Estimated due date
3. For Mom
4. For Dad
5. Next appointment

### Pregnancy status

Display:

- Mom's name
- Current pregnancy week
- Current pregnancy day
- Current trimester

Example:

"[Mom]'s pregnancy"

"Week 12"

"12 weeks + 1 day"

### Estimated due date

Display:

"Estimated due date"

"In shaa Allaah"

"4 April 2027"

The due date should be treated as an estimate, not a guaranteed birth date.

### For Mom

Provide a lightweight daily check-in.

Primary question:

"How are you feeling today?"

Possible states:

- Good
- Okay
- Rough

Optionally allow Mom to indicate a simple need:

- Rest
- Food
- Water
- Quiet
- Help

Do not turn this into complex symptom or medical tracking.

### For Dad

Show a short contextual suggestion that changes according to pregnancy stage.

Example:

"Ask her how she's feeling before trying to solve anything."

Dad Mode should feel practical and personal rather than instructional or preachy.

### Next appointment

Show the next upcoming appointment.

Display:

- Date
- Time
- Appointment type

Allow the user to open the full appointment details.

---

## 14. Care

Care contains practical pregnancy support and educational information.

Organize the page into four conceptual groups:

### For Mom

Daily wellbeing check-in.

### For Dad

Dad Mode and pregnancy-stage-specific guidance.

### Practical

- Appointments
- Nourish / Food & Hydration
- Preparation

### Learn

- FAQ
- Myth vs Fact

Care should prioritize useful information over feature density.

---

## 15. For Mom

The For Mom feature is intentionally lightweight.

Primary interaction:

"How are you feeling today?"

Allow Mom to select:

- Good
- Okay
- Rough

Optional needs:

- Rest
- Food
- Water
- Quiet
- Help

An optional short note may be added.

The feature should support communication between Mom and Dad rather than attempt to diagnose or medically monitor Mom.

---

## 16. Dad Mode

Dad Mode provides contextual guidance based on the current pregnancy stage.

Each entry may contain:

### Understand

A short explanation of what is relevant during the current pregnancy stage.

### Support

A practical action Dad can take.

### Remember

A short relationship-oriented reminder.

Dad Mode should evolve throughout pregnancy.

It should avoid:

- Condescending language
- Overly generic advice
- Fear-based messaging
- Pretending to provide medical expertise

---

## 17. Appointments

Appointments should remain simple.

Users can:

- Add an appointment
- View upcoming appointments
- View previous appointments
- Mark appointments as completed
- Add notes
- Add questions for the doctor

The appointment system is an organizer, not a medical record system.

---

## 18. Nourish

Nourish is the preferred working name for Food & Hydration.

It should provide:

### Hydration

A simple daily hydration indicator.

### Food

Simple food and nourishment ideas.

### Optional notes

A lightweight space for personal notes.

Do not implement calorie counting or complex nutritional analysis in V1.

Any medical or nutritional recommendations must be based on reliable sources and should not override advice from the user's healthcare provider.

---

## 19. Preparation

Preparation should use progressive disclosure.

Do not show a large birth-preparation checklist during early pregnancy.

Relevant preparation content should become visible as pregnancy progresses.

Focus primarily on:

### Third trimester

- Hospital preparation
- Birth plan
- Hospital bag
- Important documents
- Transportation
- Emergency contacts
- Other practical preparations

The system should surface relevant preparation based on pregnancy stage.

---

## 20. Learn

The Learn section contains:

### FAQ

Searchable pregnancy questions organized into sensible categories.

Each answer should use a clear structure:

1. Short answer
2. Explanation
3. When to seek professional advice
4. Sources

### Myth vs Fact

Short, evidence-based explanations of common pregnancy misconceptions.

Keep entries concise.

Avoid sensational or fear-inducing language.

---

## 21. Journey

Journey represents the pregnancy as a shared story rather than a task list.

It contains:

### Timeline

Important pregnancy milestones, appointments, and meaningful events.

The timeline should distinguish:

- Completed events
- Current stage
- Upcoming milestones

### Baby's Firsts

Keep this intentionally brief.

Examples:

- First ultrasound
- First heartbeat
- First movement
- First kick felt by Dad
- First baby clothes
- Birth

Journey should feel reflective and personal rather than like a project-management checklist.

---

## 22. Settings

Settings should be accessible from the header.

Potential settings:

### Personalization

- Mom's name
- Dad's name
- Baby nickname
- Due date
- Hospital

### Appearance

- System
- Light
- Dark

### Data

- Export personal data
- Clear local data

Settings should remain secondary to the main pregnancy experience.

---

## 23. Navigation Principles

Use:

**Journey | Home | Care**

Home is the visually emphasized central destination.

Navigation should remain persistent on mobile.

Avoid creating additional primary navigation items unless there is a strong usability reason.

Use secondary navigation within each section.

Avoid deep navigation hierarchies.

Users should generally reach important information within one or two interactions.

---

## 24. UX Principle

Albanuun should distinguish between:

**Today**
What matters right now.

**Care**
What can help Mom and Dad.

**Journey**
What has happened and what is ahead.

The application should progressively reveal information as pregnancy progresses rather than presenting everything at once.

The interface should always prioritize the user's current context.
