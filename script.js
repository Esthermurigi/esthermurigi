/* =====================================================================
   script.js — the JavaScript for this site
   Two jobs:
     1. Filter the project cards by category (projects.html)
     2. Validate the contact form before it "sends" (contact.html)
   ===================================================================== */

/* ---------------------------------------------------------------
   1. PROJECT FILTER
   Each button carries data-filter="web" etc.
   Each card carries data-category="web coursework" (space separated).
   A card shows when the chosen filter appears in its category list.
   "all" always shows everything.
   --------------------------------------------------------------- */
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const filterEmpty = document.getElementById('filterEmpty');

filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {

        const chosen = button.dataset.filter;
        let visibleCount = 0;

        // Move the highlight onto the button that was just clicked
        filterButtons.forEach(function (btn) {
            btn.classList.remove('is-active');
            btn.setAttribute('aria-pressed', 'false');
        });
        button.classList.add('is-active');
        button.setAttribute('aria-pressed', 'true');

        // Show or hide every card
        projectCards.forEach(function (card) {
            const categories = card.dataset.category.split(' ');
            const matches = chosen === 'all' || categories.includes(chosen);

            card.hidden = !matches;
            if (matches) visibleCount++;
        });

        // Explain an empty result instead of leaving a blank gap
        if (filterEmpty) {
            filterEmpty.hidden = visibleCount !== 0;
        }
    });
});


/* ---------------------------------------------------------------
   2. CONTACT FORM VALIDATION
   We stop the browser's normal submit, check each field ourselves,
   print a message under any field that fails, and only show the
   success message when everything passes.
   --------------------------------------------------------------- */
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    const status = document.getElementById('formStatus');

    // One rule per field: what to check, and what to tell the user
    const rules = {
        name: function (value) {
            if (value === '') return 'Please enter your name.';
            if (value.length < 2) return 'Your name needs at least 2 characters.';
            return '';
        },
        email: function (value) {
            if (value === '') return 'Please enter your email address.';
            // Deliberately simple pattern: something @ something . something
            const looksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            if (!looksValid) return 'Please enter a valid email, e.g. name@example.com';
            return '';
        },
        message: function (value) {
            if (value === '') return 'Please enter a message.';
            if (value.length < 10) return 'Your message needs at least 10 characters.';
            return '';
        }
    };

    // Check one field and paint the result. Returns true when it passed.
    function validateField(field) {
        const error = rules[field.name](field.value.trim());
        const errorBox = document.getElementById(field.name + 'Error');

        field.classList.toggle('is-invalid', error !== '');
        field.setAttribute('aria-invalid', error !== '' ? 'true' : 'false');

        if (errorBox) {
            errorBox.textContent = error;
            errorBox.hidden = error === '';
        }

        return error === '';
    }

    // Validate as soon as the user leaves a field that has an error
    contactForm.querySelectorAll('input, textarea').forEach(function (field) {
        field.addEventListener('blur', function () {
            if (field.classList.contains('is-invalid')) validateField(field);
        });
    });

    contactForm.addEventListener('submit', function (event) {
        event.preventDefault(); // stop the page reloading

        const fields = contactForm.querySelectorAll('input, textarea');
        let allValid = true;

        fields.forEach(function (field) {
            if (!validateField(field)) allValid = false;
        });

        if (!allValid) {
            status.textContent = 'Please fix the highlighted fields and try again.';
            status.className = 'form-status is-error';
            // Send the keyboard focus to the first problem so it is obvious
            const firstBad = contactForm.querySelector('.is-invalid');
            if (firstBad) firstBad.focus();
            return;
        }

        status.textContent = 'Thanks! Your message is ready to send. (This demo has no back-end, so nothing was transmitted.)';
        status.className = 'form-status is-success';
        contactForm.reset();
    });
}
