# 🚀 HMHC Development Journal

## Project Vision

The Hot Mess Hormone Club will become the all-in-one hormone health companion for women.

Instead of building separate apps, HMHC will contain modular tools including:

- Mood Ring (Cycle Tracking)
- The Hot Flash (Perimenopause)
- Feral Hour (Pep Talks)
- Sleep, Babe
- Feed the Fire
- Doctor Prep
- HMHC Library

---

# Development Log

---

## July 12, 2026

### Milestones

- Created Expo project
- Opened project in VS Code
- Connected project to GitHub
- Created feature/design-system branch
- Created APP_BLUEPRINT.md
- Planned overall application architecture

### What I Learned

- Expo Router uses folders to create navigation.
- Git branches let me build safely without breaking the main app.
- GitHub is backing up my project.

### Ideas

- AI Hormone Coach
- Daily Hormone Briefing
- Doctor Report PDF
- Symptom Pattern Detection
- Community Challenges

### Questions

- How should onboarding work?
- Should users choose Perimenopause or Cycle Tracking first?

---
## Sprint 1

Goal:

Transform the default Expo project into the first recognizable version of the HMHC app.

Objectives

- Build design system

- Create reusable components

- Build bottom navigation

- Create first dashboard

Status

🟡 In Progress
🏆 Milestone Reached

The HMHC project officially became a structured software project.

Date:
July 12, 2026

Completed:

✓ Repository
✓ Git Workflow
✓ Documentation
✓ Branch Strategy
✓ Project Vision

The foundation has been poured.

## Reflection

Today was the first day that HMHC stopped feeling like an idea and started feeling like a real software company.

For the first time, I can see how this will actually become reality.

## Milestone: First HMHC Dashboard

The first recognizable HMHC dashboard successfully rendered in the browser.

Built:
- HMHC branded header
- Reusable section cards
- Hormone briefing section
- Pep talk section
- Quick log section
- Black, gold, and cream visual foundation

This was the first moment the project looked and felt like a real product.

## Sprint 5: The App Has a Memory

Today I built my first persistent features.

Completed:
- Mood Logger
- Mood persistence
- Symptoms Logger
- Symptoms persistence

Today I learned:
- AsyncStorage
- useEffect
- Arrays
- Multi-select state
- Two-terminal workflow
- Why Ctrl+C doesn't mean Copy 😄

Big realization:

The app is no longer just displaying information.

It is starting to remember the user.

## Planned Feature: Interactive Cycle Calendar

Create an interactive monthly calendar in the Track tab that:

- Displays menstrual, follicular, ovulation, and luteal phases in different colours
- Highlights the predicted fertile window
- Marks estimated ovulation
- Highlights today
- Allows users to tap a date to view mood, symptoms, cycle day, and journal data
- Uses editable cycle settings, including last period start date, average cycle length, and average period length
- Clearly labels fertile-window and ovulation dates as predictions, especially for perimenopausal users

Luxury Polish Pass & Daily Briefing Evolution

Over the past few development sessions, the HMHC app has taken a major leap forward. The focus shifted away from simply displaying information and toward creating an experience that feels calming, validating, and genuinely supportive for women navigating perimenopause.

✨ Major Accomplishments
🌙 Selected Day Card Redesign

The Selected Day card was transformed from a basic data summary into a personalized Daily Briefing.

New sections include:

Mood
Symptoms
Today's Cycle
Hormone Snapshot
What This Means
Today's Focus
Gentle Reminder

Each section now has better spacing, improved hierarchy, and a warmer, more premium appearance.

🧠 Cycle Intelligence Integration

The Selected Day card is now driven directly from the cycle engine (cycle.ts).

Instead of hardcoded content, each phase automatically provides:

phase title
emoji
hormone levels
phase description
recommendations
encouragement

This means every day dynamically changes based on where the user is in their cycle.

The app is beginning to feel intelligent rather than static.

🔋 Hormone Battery Component

One of the biggest design wins so far.

Created a reusable HormoneBattery component that visually represents hormone fluctuations using battery imagery instead of plain text.

Features include:

hormone name
emoji
battery visualization
direction arrows
phase colour accents
automatic battery fill based on hormone status

This instantly reduced cognitive load while making hormone information much easier to understand.

It also established one of the app's first truly recognizable visual elements.

🎨 Luxury UI Direction

The project philosophy has evolved toward what we're calling a "luxury polish pass."

Design principles now include:

generous spacing
calm layouts
subtle colour accents
reusable components
ADHD-friendly visual hierarchy
minimal cognitive load
premium feel without unnecessary complexity

The goal is no longer simply building an app.

The goal is creating an experience that feels safe, supportive, and beautiful.

💡 Future Features Brainstormed

Several major features were planned for future development:

🕵️ Hormone Detective
identify symptom patterns automatically
connect symptoms with cycle phases
surface personalized insights
🔮 Tomorrow's Forecast
prepare users for upcoming hormone changes
recommend recovery, nutrition and self-care before symptoms appear
Animated hormone battery indicators
Phase-themed colours throughout the application
Expanded reusable design system
❤️ Personal Reflection

Today's work felt different.

The project is no longer just a collection of screens.

It's becoming a thoughtfully designed companion for women who often feel unheard, dismissed, or overwhelmed by the changes happening in their bodies.

Every design decision now asks the same question:

"Does this make someone feel more understood?"

If the answer is yes, it belongs.

The vision is becoming clearer with every session, and the app is beginning to develop its own personality.

This no longer feels like just another tracking app.

It feels like the beginning of something genuinely meaningful.

❤️ Developer's Note

Today was one of those milestone days where progress wasn't measured by how many lines of code were written, but by how the app made us feel. Seeing the first version of the hormone battery component and the redesigned Daily Briefing on screen made the vision tangible for the first time. It finally feels like HMHC has its own identity.

The foundation is now solid. From here, every new feature builds on something that's already beautiful instead of patching together disconnected pieces.

🗓️ August 2, 2026
🧱 Milestone: Daily Check-In Foundation Complete

Today felt like a real developer day.

We successfully completed the foundation for the new Daily Check-In feature.

✅ Completed
Refactored the old Quick Log into a shared architecture.
Built reusable screens for Mood, Symptoms, and Flow.
Implemented a shared QuickLogModal.
Mood logging now saves correctly.
Symptoms logging now saves correctly.
Flow logging now saves correctly.
All three persist after refresh.
🐛 Bug of the Day

Flow kept crashing with the dreaded:

Cannot read properties of null (reading 'inst')

After chasing modals, callbacks, React Native Web, AsyncStorage, and component architecture, we finally found the real culprit.

The Flow state hooks had accidentally been declared outside the HomeScreen component.

Moving them inside immediately resolved the crash.

A tiny mistake...

...that taught a huge lesson.

🧠 Things I Learned

Today was the first day I genuinely felt like I started understanding how React works instead of just copying code.

Things that clicked:

Hooks belong inside components.
Props pass information between components.
State has an owner.
Components should each have one responsibility.
When debugging, stop guessing and inspect the whole file.
One bug can have a very misleading error message.
💡 Architecture Decisions

Instead of continuing to add more features, we decided to spend time making the project healthier.

Next step:

Create useHomeDashboard.ts
Begin moving dashboard logic out of HomeScreen
Make the codebase easier to grow as the app expands

Future Sheena will appreciate today's decisions.

❤️ Personal Win

There were several moments today where I wanted to quit.

I didn't.

I kept asking questions.

I kept learning.

I kept laying one brick at a time.

Today didn't just make the app better.

It made me a better developer.