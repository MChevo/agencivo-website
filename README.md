# Agencivo SaaS Platform

Agencivo is a premium, minimalist SaaS web application designed for modern creative agencies and their clients. The system allows agencies to subscribe, manage projects, and generate access codes. Clients enter their access code to fill out a structured brief, which is then submitted and received by the agency in a dashboard.

This application is built with **React**, **Vite**, and **Tailwind CSS**.

---

## Getting Started

### 1. Installation
To install the dependencies, run:
```bash
npm install
```

### 2. Run Development Server
To launch the development server locally:
```bash
npm run dev
```
Open the local URL displayed in the terminal (usually `http://localhost:5173`).

### 3. Build for Production
To bundle the project for production with zero compile errors:
```bash
npm run build
```

### 4. Preview Production Build
To preview the compiled production build locally:
```bash
npm run preview
```

---

## Demo Credentials & Client Codes

To test the client access flow, enter any of the following valid codes on the **Client Access** page:
* `AC-7X9P-L2Q4` *(prefilled by default)*
* `AC-1234-ABCD`
* `AC-TEST-CODE`

---

## Completed Pages & Structure

The codebase is split into reusable components and distinct page files:

```
src/
├── context/
│   └── AppContext.jsx     # LocalState engine and localStorage database mapper
├── components/
│   ├── Button.jsx         # Custom Accessible button styles
│   ├── DotField.jsx       # Dot halftone pattern elements
│   ├── DotGrid.jsx        # Matrix dot grid elements
│   ├── Logo.jsx           # Animated brand logo vector
│   ├── Navbar.jsx         # Sticky header with mobile drawer nav
│   ├── Footer.jsx         # Footer with newsletter and info links
│   ├── Sidebar.jsx        # Agency navigation sidebar (displays current plan)
│   └── Modal.jsx          # Overlay drawer for Demo, Sales, and Support forms
├── pages/
│   ├── HomePage.jsx       # Landing page with scroll-to-path selection
│   ├── PricingPage.jsx    # Pricing subscriptions with billing toggle
│   ├── AccessPage.jsx     # Client project code access validator
│   ├── BriefFormPage.jsx  # Rich multi-section client form
│   ├── SubmittedPage.jsx  # Brief submission success page
│   ├── DashboardPage.jsx  # Agency dashboard with metrics & notifications
│   └── BriefDetailsPage.jsx # Deep review details and text summary exporter
```

---

## Implemented Interactions & Features

1. **Home / Landing**:
   - *Get Started*: Scrolls smoothly to the role selection page block.
   - *Book a Demo*: Opens an interactive overlay form with a success notification.
   - *Role Selection*: Card triggers navigate to subscription or code access.

2. **Agency Subscription**:
   - *Billing Toggle*: Active monthly/yearly toggle adjusting prices dynamically (yearly shows a 20% discount).
   - *Subscribe Buttons*: Updates state in `localStorage` to the selected plan and redirects to the agency dashboard.
   - *Contact Sales*: Opens a customized Sales query modal.

3. **Client Access**:
   - *Inline Validation*: Real-time validation checks for custom agency codes (e.g. `AC-7X9P-L2Q4`). Displays inline errors for invalid entries.

4. **Client Brief Form**:
   - *Dynamic Colors*: Add custom HEX brand colors directly, which are rendered inside individual swatches.
   - *Deliverables Manager*: Add custom design deliverables and adjust quantities dynamically.
   - *LocalStorage Draft*: Form progress automatically saves to `localStorage` as a draft, restoring data on refresh.
   - *Form Validation*: Ensures mandatory brand name, Identity & Vision, and at least one design are selected.

5. **Submitted Confirmation**:
   - *Dynamic Summary*: Reads the recently created brief from local storage and renders the full form results.
   - *View Brief Details*: Navigates directly to the review screen for the submitted brief.
   - *Start Another*: Resets the form and draft states to prepare for a new brief.

6. **Agency Dashboard**:
   - *Dynamic Metrics*: Displays real-time calculations for active briefs, in-progress tasks, completed, and client counts.
   - *Interactive List*: Shows a table of recent briefs. Rows are clickable and navigate directly to the detailed view.
   - *Dynamic Notifications*: Lists new briefs and updates. Clicking a notification marks it as read and redirects to the brief details.
   - *Filters & Search*: Real-time search filters recent briefs by client name, project type, or status.
   - *Responsive Drawer Sidebar*: Sidebar converts into an overlay side navigation drawer on tablet/mobile screen sizes.

7. **Brief Details**:
   - *Text Export*: Generates and downloads a clean text (`.txt`) file report summarizing all details of the selected brief.
   - *Status Controller*: "Save for Later" updates the status to "Review" while "Accept Brief" changes it to "In Progress", dynamically adjusting dashboard metrics.
   - *Support Modal*: Accessible contact support forms.
