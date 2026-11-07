# Eventra - Event Management Website

A responsive event management website where users can explore upcoming events, search and filter them, view details and register with validated forms.

**Live demo:** https://kesarwani-09.github.io/Event-Management-Website/Features

* Hero section with live countdown to the next event
* Event cards (name, date, venue, image, short description)
* Search by name or venue + category filters
* Event details popup with registration form
* JavaScript validation (name, email, 10-digit phone) with inline error messages
* Confirmation message after successful registration
* Dark / light mode (remembers your choice)
* Registrations saved in Local Storage, with a "My registrations" list and cancel option
* Fully responsive: mobile, tablet and desktop

## Tech Stack

HTML5, CSS3 (Grid, Flexbox, CSS variables), Vanilla JavaScript. No frameworks.

## Project Structure

```
index.html   - page structure
style.css    - styling, themes, responsive layout
script.js    - events data, search/filter, validation, Local Storage, countdown
```

## How it works

* Events are stored in an array in `script.js` and rendered into cards dynamically.
* Search and filter re-render the grid on every keystroke or click.
* Validation uses regular expressions and shows errors on blur and on submit.
* Registrations and theme preference are stored in `localStorage`.

## Run locally

Open `index.html` in a browser, or use VS Code Live Server.

## Author

Aditya Kesarwani
2406005
Kalinga Institute Of Industrial Technology 

