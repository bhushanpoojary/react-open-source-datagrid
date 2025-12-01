# Voluntary Product Accessibility Template (VPAT) 2.4

## Product Information

**Product Name:** React Open Source DataGrid (react-open-source-grid)  
**Product Version:** 1.7.10  
**Report Date:** December 1, 2025  
**Product Description:** A modern, accessible, enterprise-grade data grid component for React applications  
**Contact Information:** https://github.com/bhushanpoojary/react-open-source-datagrid  
**Evaluation Methods:** Keyboard testing, screen reader testing (NVDA, JAWS, VoiceOver), automated tools (axe DevTools, WAVE), manual WCAG 2.1 checklist

---

## Summary

React Open Source DataGrid is designed with accessibility as a core principle. This VPAT documents conformance to:

- **WCAG 2.1 Level AA** - Web Content Accessibility Guidelines
- **Section 508** - U.S. Federal accessibility requirements
- **EN 301 549** - European accessibility standard

### Conformance Level Legend

- **Supports:** The functionality is fully available to people with disabilities
- **Partially Supports:** Some functionality is available but with limitations
- **Does Not Support:** The functionality is not available
- **Not Applicable:** The criterion does not apply to this product

---

## WCAG 2.1 Level A & AA Conformance

### Table 1: Success Criteria - Level A

| Criteria | Conformance Level | Remarks and Explanations |
|----------|-------------------|--------------------------|
| **1.1.1 Non-text Content** | Supports | All functional images, icons, and controls have appropriate text alternatives via `aria-label` or `aria-labelledby`. Decorative elements use `aria-hidden="true"`. |
| **1.2.1 Audio-only and Video-only (Prerecorded)** | Not Applicable | Product does not contain audio or video content. |
| **1.2.2 Captions (Prerecorded)** | Not Applicable | Product does not contain video content. |
| **1.2.3 Audio Description or Media Alternative** | Not Applicable | Product does not contain video content. |
| **1.3.1 Info and Relationships** | Supports | Semantic structure properly conveyed through ARIA roles (`grid`, `row`, `columnheader`, `gridcell`) and HTML semantics. Relationships between headers and cells are programmatically determined. |
| **1.3.2 Meaningful Sequence** | Supports | Reading and navigation order is logical and meaningful. Tab order follows visual layout. Arrow key navigation follows grid structure. |
| **1.3.3 Sensory Characteristics** | Supports | Instructions do not rely solely on sensory characteristics. Keyboard shortcuts documented with text descriptions, not just visual symbols. |
| **1.4.1 Use of Color** | Supports | Color is not the only visual means of conveying information. Selected rows have both color change and `aria-selected="true"`. Focus indicators use outline in addition to color. Sorted columns show visual indicator and `aria-sort` attribute. |
| **1.4.2 Audio Control** | Not Applicable | Product does not auto-play audio. |
| **2.1.1 Keyboard** | Supports | All functionality is available via keyboard: Arrow keys (cell navigation), Tab/Shift+Tab (focus management), Enter (edit mode), Space (selection), Home/End (column navigation), Ctrl+Home/End (grid edges), PageUp/PageDown (pagination), Escape (exit edit/focus). |
| **2.1.2 No Keyboard Trap** | Supports | Users can navigate into and out of the grid using standard keyboard navigation. Escape key exits edit mode and moves focus to grid container, enabling Tab to exit grid. |
| **2.1.4 Character Key Shortcuts** | Supports | Single-key shortcuts (Space, Enter, Escape) only active when grid has focus. Filter inputs capture character keys without conflict. |
| **2.2.1 Timing Adjustable** | Not Applicable | No time limits are imposed. |
| **2.2.2 Pause, Stop, Hide** | Not Applicable | No moving, blinking, or auto-updating content. |
| **2.3.1 Three Flashes or Below Threshold** | Supports | Product does not contain flashing content. |
| **2.4.1 Bypass Blocks** | Supports | Grid can be skipped via Tab key. First focusable element allows tabbing past entire grid. |
| **2.4.2 Page Titled** | Not Applicable | Component library - page title controlled by implementing application. |
| **2.4.3 Focus Order** | Supports | Focus order is logical and preserves meaning: toolbar → column headers → grid cells → pagination controls. |
| **2.4.4 Link Purpose (In Context)** | Not Applicable | No links within grid component. |
| **2.5.1 Pointer Gestures** | Supports | All multi-point or path-based gestures have single-pointer alternatives. Row reordering works with keyboard (no drag-only functions). |
| **2.5.2 Pointer Cancellation** | Supports | Click actions execute on mouse up event, allowing users to move pointer away to cancel. |
| **2.5.3 Label in Name** | Supports | Visible text labels match accessible names in `aria-label` attributes. |
| **2.5.4 Motion Actuation** | Not Applicable | No device motion-triggered functionality. |
| **3.1.1 Language of Page** | Not Applicable | Component inherits language from host page. |
| **3.2.1 On Focus** | Supports | Receiving focus does not trigger unexpected context changes. Focus styles are purely visual. |
| **3.2.2 On Input** | Supports | Changing settings (filters, sorting) does not cause unexpected context changes without user confirmation. Cell editing requires Enter key to commit. |
| **3.3.1 Error Identification** | Supports | Validation errors in editable cells are announced via `aria-invalid="true"` and error messages. |
| **3.3.2 Labels or Instructions** | Supports | All input fields have labels. Column headers serve as labels for cells. Custom editors include instructions via `aria-describedby`. |
| **4.1.1 Parsing** | Supports | Valid HTML with no duplicate IDs or invalid ARIA usage. Validated via automated tools. |
| **4.1.2 Name, Role, Value** | Supports | All UI components have proper `role`, `aria-label`, state (`aria-selected`, `aria-checked`, `aria-expanded`), and value (`aria-valuenow`) attributes. |

### Table 2: Success Criteria - Level AA

| Criteria | Conformance Level | Remarks and Explanations |
|----------|-------------------|--------------------------|
| **1.2.4 Captions (Live)** | Not Applicable | Product does not contain live audio. |
| **1.2.5 Audio Description (Prerecorded)** | Not Applicable | Product does not contain video content. |
| **1.3.4 Orientation** | Supports | Grid layout adapts to portrait and landscape orientations. No restrictions on display orientation. |
| **1.3.5 Identify Input Purpose** | Supports | Input fields use appropriate `autocomplete` attributes where applicable. Filter inputs use `type` attributes to identify purpose. |
| **1.4.3 Contrast (Minimum)** | Supports | All themes meet WCAG AA contrast requirements (4.5:1 for normal text, 3:1 for large text). Focus indicators have 3:1 contrast against background. Tested with contrast checking tools. |
| **1.4.4 Resize Text** | Supports | Grid remains usable when text is scaled up to 200%. Layout reflows appropriately. Density modes (compact, normal, comfortable) provide additional text size options. |
| **1.4.5 Images of Text** | Supports | No images of text used. All text is actual text that can be scaled and customized. |
| **1.4.10 Reflow** | Supports | Content reflows for 320px viewport width without horizontal scrolling (except grid scrolling which is expected for data tables). Responsive design adapts to different screen sizes. |
| **1.4.11 Non-text Contrast** | Supports | UI components and graphical objects have 3:1 contrast ratio against adjacent colors. Borders, focus indicators, and icons meet contrast requirements. Compatible with Windows High Contrast Mode. |
| **1.4.12 Text Spacing** | Supports | Grid remains usable when user applies custom text spacing (line height, letter spacing, word spacing, paragraph spacing). |
| **1.4.13 Content on Hover or Focus** | Supports | Tooltips and context menus can be dismissed (Escape key), persist when hovered, and remain visible until dismissed. |
| **2.4.5 Multiple Ways** | Not Applicable | Component library - navigation controlled by implementing application. |
| **2.4.6 Headings and Labels** | Supports | Column headers are descriptive. Filter labels clearly describe purpose. All interactive elements have clear, descriptive labels. |
| **2.4.7 Focus Visible** | Supports | Keyboard focus indicator is clearly visible with 2px solid outline. Focus never hidden or unclear. Compatible with Windows High Contrast Mode (uses outline, not box-shadow). |
| **2.5.5 Target Size** | Supports | Interactive elements (buttons, checkboxes, column headers) are at least 24x24px in normal density mode, meeting enhanced target size guidelines. |
| **3.1.2 Language of Parts** | Not Applicable | Component displays data provided by application. Language handling is application responsibility. |
| **3.2.3 Consistent Navigation** | Supports | Navigation mechanisms (keyboard shortcuts, toolbar) are consistent throughout grid. |
| **3.2.4 Consistent Identification** | Supports | Icons and controls are consistently identified (e.g., sort icons, selection checkboxes). |
| **3.3.3 Error Suggestion** | Supports | Validation errors provide specific suggestions when possible (e.g., "Value must be between 0 and 100"). |
| **3.3.4 Error Prevention (Legal, Financial, Data)** | Supports | Cell editing requires explicit commit (Enter key) or cancel (Escape key). Confirmation dialogs available for destructive actions. |
| **4.1.3 Status Messages** | Supports | Status messages announced via `aria-live` regions: selection changes, sort actions, filter applications, pagination updates, error messages. Screen reader users receive appropriate notifications. |

---

## Section 508 Conformance

React Open Source DataGrid conforms to the Revised Section 508 standards, which align with WCAG 2.0 Level AA (and substantially with WCAG 2.1 Level AA).

### 502 Interoperability with Assistive Technology

| Criteria | Conformance Level | Remarks |
|----------|-------------------|---------|
| **502.2.1 User Control of Accessibility Features** | Not Applicable | No platform accessibility features are disabled. |
| **502.2.2 No Disruption of Accessibility Features** | Supports | Grid does not disrupt or disable platform accessibility features. |
| **502.3 Accessibility Services** | Supports | Grid uses standard platform accessibility services via ARIA and semantic HTML. |
| **502.4 Platform Accessibility Features** | Supports | Compatible with browser and OS accessibility features (screen readers, high contrast, zoom, custom stylesheets). |

### 503 Applications

| Criteria | Conformance Level | Remarks |
|----------|-------------------|---------|
| **503.2 User Preferences** | Supports | Respects user preferences for colors, contrast, fonts, and text size via CSS custom properties and density modes. |
| **503.3 Alternative User Interfaces** | Not Applicable | Single interface optimized for all users. |
| **503.4 User Controls for Captions and Audio** | Not Applicable | No audio or video content. |

---

## EN 301 549 Conformance

React Open Source DataGrid conforms to EN 301 549 V3.2.1 (2021-03), the European standard for ICT accessibility. This standard incorporates WCAG 2.1 Level AA, which is documented in the tables above.

### Key EN 301 549 Requirements

- **9.x (Web content):** Conforms to WCAG 2.1 Level AA as documented above
- **11.x (Software):** Meets interoperability requirements with assistive technologies
- **Keyboard access:** Full keyboard functionality without requiring specific timing
- **Focus indicator:** Visible focus indicator for all interactive elements

---

## Best Practices Beyond Standards

The DataGrid implements additional accessibility enhancements beyond minimum compliance:

### Advanced Keyboard Navigation
- **Ctrl+Arrow keys:** Extended navigation with modifier keys
- **Escape key:** Context-sensitive exit from edit mode and grid focus
- **Smart tab wrapping:** Tab key wraps to next row for efficient navigation

### Screen Reader Optimization
- **Live regions:** Comprehensive announcements for all state changes
- **Context preservation:** Row and column position announced during navigation
- **Intelligent verbosity:** Concise announcements to avoid cognitive overload

### Visual Accessibility
- **Multiple themes:** Pre-tested accessible color schemes
- **Density modes:** Three size options for different visual needs
- **Focus indicators:** Enhanced visibility (2px outline) exceeding minimum requirements
- **High contrast mode:** Explicit support for Windows High Contrast Mode

### Documentation
- **Keyboard shortcut reference:** Comprehensive cheat sheet in documentation
- **ARIA pattern documentation:** Implementation details for developers
- **Testing guide:** Instructions for validating accessibility

---

## Testing and Validation

### Assistive Technology Testing

| Tool | Version | Operating System | Result |
|------|---------|------------------|--------|
| NVDA | 2023.3 | Windows 11 | Full functionality confirmed |
| JAWS | 2024 | Windows 11 | Full functionality confirmed |
| VoiceOver | macOS 14 | macOS Sonoma | Full functionality confirmed |
| Narrator | Windows 11 | Windows 11 | Full functionality confirmed |

### Automated Testing Tools

| Tool | Result |
|------|--------|
| axe DevTools | 0 violations detected |
| WAVE | 0 errors, 0 contrast errors |
| Lighthouse Accessibility | 100/100 score |
| Pa11y | No issues detected |

### Manual Testing

- ✅ Complete keyboard-only navigation test
- ✅ Color contrast verification (all themes)
- ✅ Windows High Contrast Mode testing
- ✅ Text resize testing (200% zoom)
- ✅ Focus indicator visibility testing
- ✅ Reading order verification
- ✅ Form label association testing

---

## Known Issues and Limitations

As of version 1.7.10, there are no known accessibility issues that would prevent conformance with WCAG 2.1 Level AA or Section 508 standards.

### Planned Enhancements

Future versions will include:
- Enhanced mobile screen reader support (iOS/Android)
- Additional ARIA live region customization options
- Braille display optimization
- Voice control optimization (Dragon NaturallySpeaking)

---

## Contact and Support

For accessibility questions, issues, or feedback:

- **GitHub Issues:** https://github.com/bhushanpoojary/react-open-source-datagrid/issues
- **Documentation:** https://github.com/bhushanpoojary/react-open-source-datagrid/tree/main/docs
- **Label:** Use "accessibility" label for accessibility-related issues

We are committed to maintaining and improving the accessibility of React Open Source DataGrid and welcome feedback from users of assistive technologies.

---

## Legal

This VPAT is provided for informational purposes. While we strive for accuracy, conformance may vary based on implementation and configuration. Organizations should conduct their own accessibility evaluations based on their specific use cases and requirements.

**Last Updated:** December 1, 2025  
**VPAT Version:** 2.4  
**VPAT Template Source:** https://www.itic.org/policy/accessibility/vpat
