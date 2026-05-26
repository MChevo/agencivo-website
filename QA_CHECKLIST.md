# QA Verification Checklist - Agencivo

This checklist covers all interactive user flows and edge cases built and verified in the Agencivo web app.

---

## 1. Homepage & Role Selection Flow
- [x] **Get Started Action**: Clicking "Get Started" (Navbar or Hero) scrolls smoothly to the `#role-selection` section.
- [x] **Book a Demo Modal**: Clicking "Book a Demo" opens the modal overlay.
  - [x] Submitting the demo form with empty required fields displays native validation errors.
  - [x] Submitting a valid demo form displays a success screen and auto-closes the modal after 2.5 seconds.
  - [x] Modal closes when pressing the `Escape` key or clicking outside the container.
- [x] **Path Navigation**:
  - [x] Clicking the **Agency** card navigates to the Pricing page.
  - [x] Clicking the **Client** card navigates to the Client Access page.

## 2. Pricing & Subscriptions
- [x] **Billing Cycle Toggle**:
  - [x] Default billing cycle is **Yearly** ($29/mo Starter, $79/mo Professional).
  - [x] Switching to **Monthly** changes rates to $35/mo (Starter) and $99/mo (Professional) instantly.
- [x] **Subscription Flow**:
  - [x] Clicking "Get Started" on the Starter/Professional cards registers the plan choice, saves it to `localStorage`, and redirects directly to the active Agency Dashboard.
  - [x] Professional Plan displays in the Dashboard Sidebar as "$79 /mo" (or Starter as "$29 /mo" respectively).
- [x] **Enterprise Contact**:
  - [x] Clicking "Contact Sales" on the Enterprise card opens the Sales Inquiry Modal.
  - [x] Submitting the sales form displays a confirmation overlay.

## 3. Client Access & Code Entry
- [x] **CodePrefill**: Default input field pre-populates with `AC-7X9P-L2Q4` for easy testing.
- [x] **Validation Check**:
  - [x] Submitting an empty field shows "Please enter a project code."
  - [x] Submitting an invalid code (e.g. `AC-WRONG-CODE`) shows a detailed inline red error message.
  - [x] Submitting a valid code (`AC-7X9P-L2Q4`, `AC-1234-ABCD`, `AC-TEST-CODE`) logs the session and redirects to the Brief Form.

## 4. Client Brief Form
- [x] **Form Restoring (Drafts)**:
  - [x] Partial inputs auto-save to `localStorage` under `agencivo_draft_brief` on change.
  - [x] Refreshing the page restores all textareas, colors, target age ranges, and deliverables.
- [x] **Color Swatches Manager**:
  - [x] Default brand colors display properly.
  - [x] Clicking "Add Color" reveals an inline hex text input.
  - [x] Entering invalid hex strings prompts warning; entering valid hex codes adds it to the swatches.
  - [x] Clicking the trash icon removes color swatches from the list.
- [x] **Deliverables List Manager**:
  - [x] Default list shows logo, brand guidelines, business cards, and social media kits.
  - [x] Quantities can be adjusted via inline dropdown selectors.
  - [x] Custom design items can be added with an inline name input and quantity tracker.
  - [x] Design items can be removed via trash icons.
- [x] **Submit Validation**:
  - [x] Attempting to submit without a **Brand Name** displays a red alert at the top of the form.
  - [x] Attempting to submit without **Identity & Vision** content displays a validation alert.
  - [x] Attempting to submit after removing all deliverables displays a validation alert.
- [x] **Submission Execution**:
  - [x] Submitting appends a new record to the briefs array, creates a dashboard notification, clears the local draft state, and redirects to the Confirmation page.

## 5. Brief Submitted Page
- [x] **Data Accuracy**: Displays the exact brand name, project type, custom colors, deliverables count, age range, and notes entered in the form.
- [x] **Navigator Buttons**:
  - [x] "View Brief" navigates to the Brief Details page of the new brief.
  - [x] "Start Another Brief" resets the form and returns the client to a fresh Brief Form page.
  - [x] "Back to Home" navigates to the main landing page.
  - [x] "View Dashboard" redirects to the agency dashboard.

## 6. Agency Dashboard
- [x] **Live Metrics**:
  - [x] Metrics for "Active Briefs", "In Progress", "Completed", and "Total Clients" update dynamically.
  - [x] Adding a brief increments active briefs and total client count.
- [x] **Search & Filter**:
  - [x] Typing in the header search filters the "Recent Briefs" table by client/brand name, project type, or status in real-time.
- [x] **Notification Activity**:
  - [x] A count of unread notifications is displayed on the Bell icon.
  - [x] New briefs generate a "New brief received" entry with an orange dot indicator.
  - [x] Clicking a notification marks it as read, clears the indicator, and redirects to that brief's details.
- [x] **Clickable Table Rows**:
  - [x] Clicking a brief row in the dashboard navigates directly to the Brief Details page for that brief.

## 7. Brief Review & Details
- [x] **Dynamic Retrieval**: Renders the complete, client-submitted answers for the selected brief ID.
- [x] **Status Control**:
  - [x] Clicking "Save for Later" updates the brief status to **Review**.
  - [x] Clicking "Accept Brief" updates the status to **In Progress**.
  - [x] Updating brief statuses modifies the Dashboard metrics accordingly.
- [x] **Download Exporter**:
  - [x] Clicking "Download Brief" generates a dynamic `.txt` text report containing all brief answers and triggers a browser file download automatically.
- [x] **Support Request**:
  - [x] Clicking "Contact Support" opens the support ticket submission overlay.

## 8. Build, Layout, and Responsiveness
- [x] **Production Build**: Compiles successfully with zero warnings and zero errors via `npm run build`.
- [x] **Layout Polish**: Layout preserves the thin borders, bold typography, monochrome aesthetic, and dot-matrix halftone patterns.
- [x] **Responsiveness**:
  - [x] Cards grid wraps properly on tablet screens.
  - [x] Sidebar menu shifts into a toggleable slide-out navigation drawer on smaller screen sizes.
  - [x] Navbar shifts into a toggleable drop-down mobile menu on smaller screens.
