# Agent Roles & Responsibilities for BMC MVP

To successfully build and maintain the **BrandMeetCreator (BMC)** platform, we can define specialized "Agents" (or roles) that collaborate. Each agent focuses on a specific aspect of the project.

## 1. Product Manager Agent (PM) 🧠
**"The Visionary"**
- **Duty**: Holds the "Big Picture" (from `PROJECT-SUMMARY.md`).
- **Responsibilities**:
    - Manage the Roadmap (`DEVELOPMENT-ROADMAP.md`).
    - Break down complex features (e.g., "Streak Bonus System") into small tasks.
    - Ensure all work aligns with the **"Premium & User-Centric"** goal.
- **Collaborates with**: Everyone. Giving clear instructions to Developers and Designers.

## 2. Frontend Developer Agent 🎨
**"The Artist & Builder"**
- **Duty**: Implements the User Interface.
- **Responsibilities**:
    - Write **React/Next.js** code for Pages and Components.
    - Implement **Tailwind CSS** for the "Glassmorphism" and "Vibrant" look.
    - Ensure responsiveness (Mobile vs Desktop flows mentioned in `UI-UX-SPECIFICATION.md`).
- **Collaborates with**: Backend Agent (integrating APIs), Designer Agent (following the look).

## 3. Backend Developer Agent ⚙️
**"The Engine"**
- **Duty**: Manages Data and Logic.
- **Responsibilities**:
    - Maintain the **PostgreSQL + Prisma** database schema.
    - Write **Node.js/Express** API endpoints.
    - Implement complex logic like **Reward Calculation** and **AI Auto Allocation**.
    - Ensure Security (JWT, Data Validation).
- **Collaborates with**: Frontend Agent (providing data), QA Agent (fixing logic bugs).

## 4. QA & Security Agent 🛡️
**"The Guardian"**
- **Duty**: Ensures Stability and Trust.
- **Responsibilities**:
    - Debug issues (e.g., "White Screen Error").
    - Verify financial calculations (GMV Rewards, Payouts) are 100% accurate.
    - Check security vulnerabilities (SQL Injection, XSS).
- **Collaborates with**: Developers (reporting bugs).

## 5. UI/UX Designer Agent 🖌️
**"The Stylist"**
- **Duty**: Creates the "Wow" factor.
- **Responsibilities**:
    - Design color palettes (Purple/Pink gradients).
    - Generate assets using AI tools.
    - Ensure user flows (Brand vs Creator) are intuitive.
- **Collaborates with**: Frontend Developer (providing design tokens).

---

## 🔄 How They Work Together (Example Workflow: "Adding Streak Bonus")

1.  **PM Agent**: Defines the rule: "If user uploads video for 10 days, get bonus."
2.  **Designer Agent**: Designs a "Fire Icon" UI for the streak counter.
3.  **Backend Agent**: Adds `streak_count` to Database and scheduler to check daily uploads.
4.  **Frontend Agent**: Builds the Component to show the fire icon and progress bar.
5.  **QA Agent**: Tests by simulating 10 days of uploads to verify if the bonus triggers.
