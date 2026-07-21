// Theme specific JS can go here.

// Track newsletter signups as a Plausible custom event.
//
// Kit's embedded form renders a <form data-sv-form="..."> element. We listen at
// the document level (the form is injected asynchronously by Kit's script, and
// `submit` bubbles) and fire a "Newsletter Signup" goal. Plausible associates
// the event with the current page, so signups are source-attributed by which
// post the reader was on. The submit only fires once the browser's built-in
// email validation passes, so this counts genuine signup attempts.
document.addEventListener(
  "submit",
  function (event) {
    var form = event.target;
    if (form && form.getAttribute && form.getAttribute("data-sv-form")) {
      window.plausible("Newsletter Signup", {
        props: { path: window.location.pathname },
      });
    }
  },
  false,
);
