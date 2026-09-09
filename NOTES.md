# FE-05 Notes — Component Comparison

## 2 Concrete Things shadcn/ui Handles That My Scratch Implementation Missed:

1. **DOM Portaling (`DialogPrimitive.Portal`):**

   * In my custom modal, the element was rendered within the same component tree as the button that opened it. If a parent container has `overflow: hidden` or a relative z-index, the modal can get clipped.
   * shadcn/ui (Radix) injects the modal directly into the end of the HTML `<body>` using a React Portal, ensuring that the modal is rendered at the top level and displays correctly.

2. **Scroll Locking & Layout Shift Prevention:**

   * In my custom modal, when the popup opens, the page behind it can still be scrolled.
   * shadcn/ui locks background scrolling and compensates for the layout shift that can occur when the scrollbar disappears, preventing the page from jumping or shifting.
