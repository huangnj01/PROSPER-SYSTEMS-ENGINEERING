# PSE Website Code Structure

This folder has been reorganized so the HTML, CSS, and JavaScript are easier to maintain.

## Main Pages

- index.html
  Controls the homepage content only. It links to css/index.css and js/index.js.

- catalog.html
  Controls the catalog page content only. It links to css/catalog.css and js/catalog.js.

## CSS Files

- css/index.css
  Homepage styling: top bar, navigation, hero carousel, about section, catalog preview, footer, WhatsApp/Instagram bubbles, and back-to-top button.

- css/catalog.css
  Catalog page styling: page header, sidebar filter, search controls, product cards, modal, footer, and back-to-top button.

## JavaScript Files

- js/index.js
  Homepage behavior: page loading spinner, smooth scrolling, email form handling, scroll animations, active navigation, catalog carousel, and optional showcase image rotation.

- js/catalog.js
  Catalog behavior and product information. Important sections inside this file:
  - Catalog Product Data: product names, descriptions, images, categories, and specifications.
  - CATEGORY_META: category names, icons, and category descriptions.
  - Category Sidebar Builder: builds the category buttons in the catalog sidebar.
  - Category, Search, And Sort Filters: controls filtering and searching.
  - Product Card Renderer: creates the product cards shown on the page.
  - RFQ Modal And Email Builder: opens the request quote email flow.

## Image Assets

- img/
  Stores homepage images, logo, QR code, and product-related images.

## Quick Editing Notes

- To change product categories, edit CATEGORY_META in js/catalog.js.
- To change product names or descriptions, edit CATALOG_DATA in js/catalog.js.
- To change homepage category cards, edit the Catalog Preview section in index.html.
- To change floating WhatsApp/Instagram button positions, edit the Floating Contact / WhatsApp / Instagram sections in css/index.css.

## Partner Vendor Catalog

- partner-vendor-catalog.html
  New page for partner vendors, vendor product offers, enquiry buttons, and brochure downloads.

- css/partner-vendor-catalog.css
  Styling for the vendor list, vendor cards, product offer pricing, and brochure panel. It imports css/catalog.css for the shared catalog look.

- js/partner-vendor-catalog.js
  Data and functions for vendor profiles, vendor products, filtering, enquiry emails, and brochure view/download actions.

- brochures/partner-vendor-brochure.pdf
  Placeholder brochure used by the View brochure and Download PDF brochure buttons. Replace it with the final vendor brochure when ready.

- Homepage Partner Vendor Carousel
  - `index.html` contains the partner-vendor preview cards and link to `partner-vendor-catalog.html`.
  - `css/index.css` controls the modern card layout and responsive carousel style.
  - `js/index.js` shares the carousel behavior for product and partner-vendor sliders.
