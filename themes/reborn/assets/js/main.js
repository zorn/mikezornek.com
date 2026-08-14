// Theme specific JS can go here.

// --- Newsletter signup helpers (Kit forms) ---------------------------------
//
// Kit's embedded form renders a <form data-sv-form="..."> element, injected
// asynchronously by Kit's script.

// 1) Record which page each subscriber signed up from, as a hidden Kit custom
//    field. This rides the form POST itself, so it is captured even when a
//    content blocker neutralizes Kit's (and Plausible's) JavaScript. Requires a
//    "signup_page" custom field to exist in the Kit account, otherwise Kit
//    silently ignores the value.
function tagKitFormWithPage(form) {
  if (form.querySelector('input[name="fields[signup_page]"]')) {
    return;
  }
  var input = document.createElement("input");
  input.type = "hidden";
  input.name = "fields[signup_page]";
  input.value = window.location.pathname;
  form.appendChild(input);
}

function tagAllKitForms() {
  var forms = document.querySelectorAll("form[data-sv-form]");
  for (var i = 0; i < forms.length; i++) {
    tagKitFormWithPage(forms[i]);
  }
}

// Kit injects its form after load, so tag on DOM ready and again as nodes are
// added to the page.
document.addEventListener("DOMContentLoaded", tagAllKitForms);
if (window.MutationObserver) {
  new MutationObserver(tagAllKitForms).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
}

// 2) Track submissions as a Plausible custom event. Plausible ties the event to
//    the current page, giving aggregate per-post attribution for visitors who
//    aren't blocking it. The submit fires only after the browser's built-in
//    email validation, so this counts genuine signup attempts.
function trackNewsletterSignup(event) {
  var form = event.target;
  if (form && form.getAttribute && form.getAttribute("data-sv-form")) {
    window.plausible("Newsletter Signup", {
      props: { path: window.location.pathname },
    });
  }
}

document.addEventListener("submit", trackNewsletterSignup);

// --- Heading anchor links (issue #194) -------------------------------------
//
// The posts heading render hook adds a `.heading-anchor` link to each h2/h3.
// The link's href is `#slug`, so the browser handles the in-page jump and the
// address-bar hash on its own. On top of that, copy the section's full URL to
// the clipboard so the reader can paste a deep link, with a brief "Copied"
// flash for feedback.
function copyHeadingAnchorLink(event) {
  var link = event.target.closest && event.target.closest("a.heading-anchor");
  if (!link) {
    return;
  }
  // Without the async Clipboard API, leave the native hash navigation to stand
  // on its own rather than swallowing the click.
  if (!navigator.clipboard) {
    return;
  }
  navigator.clipboard.writeText(link.href).then(
    function () {
      link.classList.add("is-copied");
      setTimeout(function () {
        link.classList.remove("is-copied");
      }, 1200);
    },
    function () {},
  );
}

document.addEventListener("click", copyHeadingAnchorLink);
