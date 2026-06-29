/*
  Partner Vendor Catalog JavaScript
  ------------------------------------------------------------
  Purpose: Controls vendor data, vendor list rendering, product cards,
  vendor product display, enquiry email actions, and brochure viewing.
  Related HTML: partner-vendor-catalog.html
  Related CSS: css/partner-vendor-catalog.css
*/

// SECTION: Brochure Reference
const BROCHURE_PATH = 'brochures/partner-vendor-brochure.pdf';

// SECTION: Vendor Profile Data
// Edit this list to add/remove partner vendors.
const VENDORS = [
  {
    id: 'powerlink',
    name: 'PowerLink Components',
    logoText: 'PL',
    specialty: 'Terminal blocks and wiring accessories',
    description: 'Supplier of panel wiring components, terminal accessories, and DIN-rail connection products for industrial control cabinets.',
    accent: '#0057A8'
  },
  {
    id: 'panelpro',
    name: 'PanelPro Automation',
    logoText: 'PA',
    specialty: 'Control board and panel devices',
    description: 'Vendor partner for panel devices, indicators, switches, and control cabinet sub-assembly support parts.',
    accent: '#0f766e'
  },
  {
    id: 'cadworks',
    name: 'CADWorks Electrical',
    logoText: 'CE',
    specialty: 'Electrical CAD drafting and drawings',
    description: 'Drafting support partner for electrical layouts, wiring diagrams, panel drawings, and project documentation packages.',
    accent: '#7c3aed'
  }
];

// SECTION: Vendor Product Data
// vendorId links each product to a vendor in VENDORS.
const VENDOR_PRODUCTS = [
  {
    id: 1,
    vendorId: 'powerlink',
    name: 'DIN Rail Terminal Block Set',
    image: 'img/about-img-1.jpg',
    originalPrice: 'SGD 48.00',
    offerPrice: 'SGD 39.00',
    offerNote: 'Save 19%'
  },
  {
    id: 2,
    vendorId: 'powerlink',
    name: 'Electric Wire / Cable Starter Pack',
    image: 'img/about-img.jpg',
    originalPrice: 'SGD 120.00',
    offerPrice: 'SGD 98.00',
    offerNote: 'Bundle offer'
  },
  {
    id: 3,
    vendorId: 'panelpro',
    name: '22mm Control Panel Indicator Kit',
    image: 'img/carousel-2.jpg',
    originalPrice: 'SGD 88.00',
    offerPrice: 'SGD 72.00',
    offerNote: 'Partner price'
  },
  {
    id: 4,
    vendorId: 'panelpro',
    name: 'Control Board / Panel Assembly Set',
    image: 'img/carousel-1.jpg',
    originalPrice: 'SGD 260.00',
    offerPrice: 'SGD 218.00',
    offerNote: 'Limited offer'
  },
  {
    id: 5,
    vendorId: 'cadworks',
    name: 'Electrical CAD Drafting Package',
    image: '',
    originalPrice: 'SGD 450.00',
    offerPrice: 'SGD 360.00',
    offerNote: 'Project rate'
  },
  {
    id: 6,
    vendorId: 'cadworks',
    name: 'Panel Drawing Revision Service',
    image: '',
    originalPrice: 'SGD 180.00',
    offerPrice: 'SGD 145.00',
    offerNote: 'Fast turnaround'
  }
];

// SECTION: Page State
let activeVendor = 'all';
let searchText = '';

// SECTION: Page Initialization
window.addEventListener('load', () => {
  const spinner = document.getElementById('spinner');
  if (spinner) {
    spinner.classList.add('hide');
    setTimeout(() => spinner.style.display = 'none', 400);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  buildVendorList();
  renderVendorCards();
  renderVendorProducts();

  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('show', window.scrollY > 300);
  });
});

// SECTION: Vendor Sidebar Renderer
function buildVendorList() {
  let html = vendorButtonHtml('all', 'All Vendors', 'AV', 'View every vendor product');

  VENDORS.forEach(vendor => {
    html += vendorButtonHtml(vendor.id, vendor.name, vendor.logoText, vendor.specialty, vendor.accent);
  });

  document.getElementById('vendorList').innerHTML = html;
}

function vendorButtonHtml(id, name, logoText, specialty, accent) {
  const activeClass = activeVendor === id ? 'active' : '';
  const colorStyle = accent ? 'style="background:' + accent + '"' : '';

  return '<button class="vendor-list-btn ' + activeClass + '" onclick="selectVendor(\'' + id + '\')">' +
    '<span class="vendor-list-logo" ' + colorStyle + '>' + logoText + '</span>' +
    '<span><span class="vendor-list-name">' + name + '</span><br>' +
    '<span class="small text-muted">' + specialty + '</span></span>' +
    '</button>';
}

// SECTION: Vendor Card Renderer
function renderVendorCards() {
  const vendors = getVisibleVendors();

  if (!vendors.length) {
    document.getElementById('vendorCards').innerHTML = '<div class="col-12"><div class="empty-vendor-state">No vendors found. Try another search.</div></div>';
    return;
  }

  document.getElementById('vendorCards').innerHTML = vendors.map(vendor =>
    '<div class="col-md-6 col-xl-4">' +
      '<article class="vendor-card">' +
        '<div class="vendor-head">' +
          '<div class="vendor-logo" style="background:' + vendor.accent + '">' + vendor.logoText + '</div>' +
          '<div><div class="vendor-name">' + vendor.name + '</div>' +
          '<div class="vendor-meta">' + vendor.specialty + '</div></div>' +
        '</div>' +
        '<p class="vendor-desc">' + vendor.description + '</p>' +
        '<button class="btn-vendor" onclick="selectVendor(\'' + vendor.id + '\')">' +
          '<i class="fas fa-book-open me-2"></i>View catalog' +
        '</button>' +
      '</article>' +
    '</div>'
  ).join('');
}

// SECTION: Filtering
function selectVendor(vendorId) {
  activeVendor = vendorId;
  buildVendorList();
  renderVendorCards();
  renderVendorProducts();
  document.getElementById('vendorProducts').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function handlePartnerSearch(value) {
  searchText = value.trim().toLowerCase();
  renderVendorCards();
  renderVendorProducts();
}

function getVisibleVendors() {
  return VENDORS.filter(vendor => {
    const activeMatch = activeVendor === 'all' || vendor.id === activeVendor;
    const searchMatch = !searchText ||
      vendor.name.toLowerCase().includes(searchText) ||
      vendor.specialty.toLowerCase().includes(searchText) ||
      vendor.description.toLowerCase().includes(searchText) ||
      VENDOR_PRODUCTS.some(product => product.vendorId === vendor.id && product.name.toLowerCase().includes(searchText));

    return activeMatch && searchMatch;
  });
}

function getVisibleProducts() {
  return VENDOR_PRODUCTS.filter(product => {
    const vendor = getVendor(product.vendorId);
    const activeMatch = activeVendor === 'all' || product.vendorId === activeVendor;
    const searchMatch = !searchText ||
      product.name.toLowerCase().includes(searchText) ||
      vendor.name.toLowerCase().includes(searchText) ||
      vendor.specialty.toLowerCase().includes(searchText);

    return activeMatch && searchMatch;
  });
}

// SECTION: Product Card Renderer
function renderVendorProducts() {
  const products = getVisibleProducts();
  const activeName = activeVendor === 'all' ? 'All Vendors' : getVendor(activeVendor).name;

  document.getElementById('partnerResultCount').innerHTML = 'Showing <strong>' + products.length + '</strong> ' +
    (products.length === 1 ? 'product' : 'products') + ' from <strong>' + activeName + '</strong>';

  document.getElementById('activeVendorSummary').textContent = activeVendor === 'all'
    ? 'Review all partner vendor products.'
    : getVendor(activeVendor).description;

  if (!products.length) {
    document.getElementById('vendorProducts').innerHTML = '<div class="empty-vendor-state">No products found for this vendor or search term.</div>';
    return;
  }

  document.getElementById('vendorProducts').innerHTML = '<div class="partner-products-grid">' +
    products.map(productCardHtml).join('') +
    '</div>';
}

function productCardHtml(product) {
  const vendor = getVendor(product.vendorId);
  const imageHtml = product.image
    ? '<img src="' + product.image + '" alt="' + product.name + '" loading="lazy">'
    : '<div class="product-placeholder"><i class="fas fa-cube"></i></div>';

  return '<article class="partner-product-card">' +
    '<div class="partner-product-image">' + imageHtml + '</div>' +
    '<div class="partner-product-body">' +
      '<div class="partner-product-vendor">' + vendor.name + '</div>' +
      '<div class="partner-product-name">' + product.name + '</div>' +
      '<div class="product-actions"><button class="btn-enquiry" onclick="sendProductEnquiry(' + product.id + ')">' +
        '<i class="fas fa-envelope me-2"></i>Enquiry' +
      '</button></div>' +
    '</div>' +
  '</article>';
}

// SECTION: Enquiry And Brochure Actions
function sendProductEnquiry(productId) {
  const product = VENDOR_PRODUCTS.find(item => item.id === productId);
  const vendor = getVendor(product.vendorId);
  const subject = encodeURIComponent('Partner Vendor Product Enquiry - ' + product.name);
  const body = encodeURIComponent(
    'Hello PSE,\n\n' +
    'I would like to enquire about this partner vendor product.\n\n' +
    'Vendor: ' + vendor.name + '\n' +
    'Product: ' + product.name + '\n\n' +
    'Please contact me with more information.\n'
  );

  window.location.href = 'mailto:nigel_pse@outlook.com?subject=' + subject + '&body=' + body;
  showToast('Opening your email client for the product enquiry...');
}

function viewBrochure() {
  window.open(BROCHURE_PATH, '_blank', 'noopener');
}

function getVendor(vendorId) {
  return VENDORS.find(vendor => vendor.id === vendorId) || VENDORS[0];
}

function showToast(message) {
  const toast = document.getElementById('toastMsg');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}
