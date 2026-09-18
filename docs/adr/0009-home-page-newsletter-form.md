# Home page newsletter form

The home page's right column is narrow. The signup box there needs its own
title, "Monthly(ish) Emails", and a stacked layout with the input over the
button. The Kit embed used on posts and on `/newsletter/` is one hosted design
shared by every placement and edited in Kit's designer, so it cannot look
different on the home page without changing every placement. We render a plain
HTML form (`partials/newsletter-signup-native.html`) that posts directly to the
same Kit form's subscription endpoint and is styled with the site's own classes.

The sourced background for the home page work is in
[docs/research-home-page.md](../research-home-page.md). It recommended a form
below the Start Here list, full width, reusing the embed. The site owner chose
the two-column layout instead, which is what made a native form necessary.

## Considered and rejected

- **A second Kit form with its own design.** This was the plan when the home
  page form was parked in July 2026. It works, but it moves the box's layout
  and copy into Kit's designer, outside the repo, and adds a second form to
  keep in sync. The native form keeps everything in one template and one
  commit.
- **Restyling the embed with CSS overrides.** Kit injects its own inline
  styles. `/newsletter/` already scopes one override (`.newsletter-form-full`)
  to widen the form, and stacking more of those on markup we do not control is
  brittle.

## Consequences

- After submitting, the reader lands on Kit's hosted confirmation page instead
  of seeing an inline success message. Acceptable for a low-traffic form;
  revisit if it ever becomes a measured drop-off.
- Posts and `/newsletter/` keep the embed. Keeping two implementations of one
  form is a real cost, and the first one to grow a bug is the signal to
  consolidate on the other.
- This also extends [0001](0001-curated-list-via-data-file.md): the home page
  is a third renderer of the Start Here list, so the fail-the-build check moved
  into one shared partial rather than being copied a third time.
