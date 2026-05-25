===== CHROME WEB STORE SUBMISSION REQUIREMENTS =====
ddChromeExt - Datadog TraceId Navigator (v1.4.0)

================================================================================
1. SINGLE PURPOSE DESCRIPTION (Privacy Practices Tab)
================================================================================
A productivity extension that accelerates TraceId log navigation in Datadog by 
injecting quick-access buttons next to TraceId values, enabling users to open 
logs in new tabs or floating panels with automatic time range detection.


================================================================================
2. CLIPBOARD READ JUSTIFICATION (Privacy Practices Tab)
================================================================================
The clipboardRead permission is used solely for the "Format JSON" feature, 
which allows users to:
- Read unformatted JSON from their clipboard
- Format it with proper indentation (2-space format)
- Write the result back to clipboard for use in Datadog

This feature helps developers quickly debug and format JSON payloads during 
troubleshooting sessions. The permission is only triggered when the user 
explicitly clicks the "Format JSON" button and is never accessed automatically.


================================================================================
3. CLIPBOARD WRITE JUSTIFICATION (Privacy Practices Tab)
================================================================================
The clipboardWrite permission is used for two user-initiated features:
A) JSON Formatting: Write formatted JSON back to clipboard after formatting
B) Copy Logs URL: Copy the current logs view URL to clipboard with a single click

Both operations require explicit user action (button click) and provide immediate 
visual feedback via toast notifications. Users can easily verify what was copied 
from the clipboard. The permission is never used automatically.


================================================================================
4. HOST PERMISSION JUSTIFICATION (Privacy Practices Tab)
================================================================================
The extension requires host permission for https://pluxee.datadoghq.eu/* to:
- Detect and inject buttons next to TraceId values in Datadog pages
- Access page DOM to build accurate logs URLs with current time range parameters
- Monitor DOM changes via mutation observers to maintain button visibility as 
  page content updates dynamically
- Extract from_ts and to_ts URL parameters to apply correct time ranges to logs

The extension ONLY operates on the specified Datadog host and does not:
- Access user data outside of the specified domain
- Track or transmit user activity
- Modify user data or settings
- Interact with any other websites

The extension is domain-locked to prevent unintended access to other sites.


================================================================================
5. REMOTE CODE JUSTIFICATION (Privacy Practices Tab)
================================================================================
The extension does NOT use any form of remote code execution, code injection, 
or dynamic code loading from external sources. 

The only remote resource loaded is:
- Font Awesome Icon Library (CDN: https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css)
  
This is a read-only CSS stylesheet containing icon definitions and does NOT 
include any executable code. Font Awesome is a widely-used, trusted third-party 
library for icon rendering and is necessary for button visual consistency in 
the extension UI.

All extension logic is contained in local source files:
- manifest.json (configuration)
- content.js (extension logic)
- Inline CSS styling

No eval(), Function(), or dynamic script injection is used anywhere in the codebase.


================================================================================
6. SCREENSHOT/VIDEO REQUIREMENTS
================================================================================
RECOMMENDED SCREENSHOTS TO CREATE:

Screenshot 1: Main Feature - Open TraceId Logs
- Show Datadog TraceId table/row with injected "open in tab" and "open in panel" buttons
- Caption: "Quick-access buttons injected next to TraceId values"

Screenshot 2: Floating Panel Window
- Show interactive floating panel with TraceId logs
- Include title bar with pencil icon (rename), link icon (copy URL), and window controls
- Caption: "Floating panel with draggable, resizable window management"

Screenshot 3: Format JSON Feature
- Show Datadog sidebar with "Format JSON" button highlighted
- Caption: "One-click JSON formatting from clipboard for quick debugging"

Screenshot 4: Copy URL Feature
- Show floating panel title bar with copy button
- Show toast notification confirming URL copied
- Caption: "Copy logs URL to clipboard for sharing with team members"

VIDEO OPTION (Higher impact):
- 30-60 second demo showing:
  1. TraceId button injection (0-10s)
  2. Opening logs in new tab (10-20s)
  3. Opening in floating panel (20-35s)
  4. Panel interactions (35-50s)
  5. Copy URL and Format JSON features (50-60s)

TECHNICAL SPECS:
- Minimum: 1280x720px (or higher resolution)
- Format: PNG, JPG for screenshots; MP4, WebM for videos
- File size: Keep under 5MB per file
- Focus: Clear UI with buttons visible


================================================================================
7. DATA USAGE COMPLIANCE CERTIFICATION
================================================================================
STATEMENT TO CERTIFY ON PRIVACY PRACTICES TAB:

"I certify that this extension's use of user data complies with the 
Chrome Web Store Developer Program Policies:

1. DATA COLLECTION: The extension does not collect, transmit, or store 
   any personal user data. It operates entirely within the user's browser 
   session on the Datadog domain (https://pluxee.datadoghq.eu/).

2. PURPOSE LIMITATION: All data accessed (DOM content, URL parameters, 
   clipboard content via explicit user action) is used solely for the 
   advertised feature purposes:
   - Button injection and log navigation
   - Time range extraction for accurate logs views
   - JSON formatting and URL copying (user-initiated only)

3. DATA TRANSMISSION: No user data is transmitted to external servers 
   except for Font Awesome icon library CSS, which is read-only and 
   contains no user-specific information.

4. THIRD-PARTY SHARING: User data is not shared with any third parties 
   or business partners.

5. SECURITY: The extension operates with minimal necessary permissions 
   and follows Chrome security best practices.

This extension respects user privacy and does not engage in deceptive 
or unauthorized data practices."


================================================================================
8. CONTACT EMAIL (Settings Page)
================================================================================
ACTION REQUIRED: Enter publisher's contact email on Settings page

Example format:
Name: Peter Macko (Konica Minolta IT Solutions Czech)
Email: [YOUR EMAIL ADDRESS]

NOTE: This email must be:
- A valid, monitored email address
- Associated with the developer/publisher
- Available for Chrome Web Store support communications
- Verified via email confirmation link before publishing


================================================================================
9. EMAIL VERIFICATION (Settings Page)
================================================================================
VERIFICATION PROCESS:
1. Enter contact email on Settings page
2. Chrome Web Store sends verification email to that address
3. Click verification link in email within the specified timeframe
4. Email status changes from "Unverified" to "Verified"
5. You can then proceed with publishing

IMPORTANT:
- Verification is REQUIRED before publishing
- Check spam folder if email doesn't arrive
- Resend verification link if needed
- Same email must be used for all future submissions by this publisher


================================================================================
10. SUBMISSION CHECKLIST
================================================================================
BEFORE PUBLISHING:
☐ Extension packaged as .zip file (sources/ folder contents)
☐ manifest.json version updated (currently 1.4.0)
☐ README.md documentation complete
☐ Icon prepared (128x128px PNG recommended)
☐ 3-4 high-quality screenshots prepared
☐ (Optional) Demo video created

PRIVACY PRACTICES TAB:
☐ Single purpose description entered
☐ clipboardRead justification entered
☐ clipboardWrite justification entered
☐ Host permission justification entered
☐ Remote code justification entered
☐ Data usage compliance certified
☐ At least 1 screenshot uploaded

SETTINGS PAGE:
☐ Contact email entered
☐ Email verification completed
☐ Publisher information verified

CONTENT REVIEW:
☐ Extension name finalized: "ddChromeExt - Datadog TraceId Navigator"
☐ Short description entered (132 chars)
☐ Detailed description entered
☐ Category selected: "Productivity" or "Developer Tools"
☐ Language set to English
☐ Content rating classification completed

SUBMISSION:
☐ All required fields completed
☐ Review pricing and distribution options
☐ Submit for review


================================================================================
ESTIMATED REVIEW TIME
================================================================================
Initial Review: 24-72 hours
Resubmission (if changes needed): 24-72 hours

Common rejection reasons to avoid:
- Missing privacy justifications
- Unclear extension purpose
- Unverified contact email
- Missing or low-quality screenshots
- Non-compliance with Developer Program Policies


================================================================================
SUPPORT CONTACTS
================================================================================
Chrome Web Store Support: https://support.google.com/chrome_webstore
Developer Forum: https://groups.google.com/a/chromium.org/g/chromium-extensions
Policy Questions: https://developer.chrome.com/docs/webstore/program_policies/

