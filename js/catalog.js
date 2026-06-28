/*
  Catalog Page JavaScript
  ------------------------------------------------------------
  Purpose: Catalog product data, category filters, search, sort, view toggles, product rendering, and RFQ modal.
  Related HTML: catalog.html
  Function map:
  - Catalog data: product list and category definitions.
  - Initialization: spinner, sidebar, products, backend loading, and hash links.
  - Backend loader: optionally merges PHP-loaded catalog items.
  - Category/search/sort filters: controls the visible product list.
  - Product renderer: builds product cards and empty states.
  - RFQ modal: opens email quote requests for selected products.
  - Toast: shows short status messages.
*/

// ──────────────────────────────────────────────
// SECTION: Catalog Product Data
// Replace/extend this array as needed.
// For PHP backend: fetch from php/load_catalog.php
// ──────────────────────────────────────────────
const INTERFACE_TERMINAL_BLOCK_DETAILS = {
  productDescription: {
    en: "High-performance terminal block designed for industrial automation, electrical control systems, and servo driver connections.",
    zh: "适用于工业自动化及伺服驱控接线端子，具备高耐久性与完整控制能力，可满足不同项目需求。"
  },
  keyFeatures: [
    "Customizable Design — 支持定制化设计，费用化定制",
    "Optional LED Indicator — LED 指示灯可定制",
    "Multiple Configurations — 多种规格选择",
    "Adjustable Terminal Size — 接线口尺寸可调",
    "Expandable Connections — 扩展能力强"
  ],
  applications: [
    "Industrial Control Panels（工业控制柜）",
    "Automation Systems（自动化设备）",
    "Servo Driver Interfaces（伺服驱动系统）",
    "Servo Drive Systems（伺服驱动系统）",
    "Power Distribution Systems（电力分配系统）",
    "Communication Equipment（通信设备）"
  ],
  summary: {
    en: "High-quality materials + Flexible customization + Versatile configuration = Reliable and efficient connection solution",
    zh: "高品质材料 + 灵活定制 + 多样化配置 = 可靠、高效的连接解决方案"
  }
};

const CATALOG_DATA = [
  {
    id: 1, category: "Terminal Blocks",
    name: "Interface terminal block",
    partNumber: "PSE-MT38-SCSI-20",
    description: "High-performance terminal block designed for industrial automation, electrical control systems, and servo driver connections.",
    details: INTERFACE_TERMINAL_BLOCK_DETAILS,
    images: ["catalog/terminalblocks01/item01.JPG", "catalog/terminalblocks01/item02.JPG"], icon: "fas fa-plug",
    specs: { "Cross-section": "0.5-2.5mm²", "Voltage": "500V", "Current": "24A", "Mounting": "DIN 35mm", "Colour": "Grey" }
  },

  {
    id: 2, category: "Terminal Blocks",
    name: "Interface terminal block",
    partNumber: "PSE-MT38-SCSI-20-LGR",
    description: "High-performance terminal block designed for industrial automation, electrical control systems, and servo driver connections.",
    details: INTERFACE_TERMINAL_BLOCK_DETAILS,
    images: ["catalog/terminalblocks02/item01.JPG", "catalog/terminalblocks02/item02.JPG"], icon: "fas fa-plug",
    specs: { "Cross-section": "0.5-2.5mm²", "Voltage": "500V", "Current": "24A", "Mounting": "DIN 35mm", "Colour": "Grey" }
  },
  {
    id: 3, category: "Terminal Blocks",
    name: "Interface terminal block",
    partNumber: "PSE-MT38-SCSI-36-LGR",
    description: "High-performance terminal block designed for industrial automation, electrical control systems, and servo driver connections.",
    details: INTERFACE_TERMINAL_BLOCK_DETAILS,
    images: ["catalog/terminalblocks03/item01.JPG", "catalog/terminalblocks03/item02.JPG"], icon: "fas fa-plug",
    specs: { "Cross-section": "0.5-2.5mm²", "Voltage": "500V", "Current": "24A", "Mounting": "DIN 35mm", "Colour": "Grey" }
  },
  {
    id: 13, category: "Terminal Blocks",
    name: "Interface terminal block",
    partNumber: "PSE-MT38-SCSI-26-LGR",
    description: "High-performance terminal block designed for industrial automation, electrical control systems, and servo driver connections.",
    details: INTERFACE_TERMINAL_BLOCK_DETAILS,
    images: ["catalog/terminalblocks04/item01.JPG", "catalog/terminalblocks04/item02.JPG"], icon: "fas fa-plug",
    specs: { "Cross-section": "0.5-2.5mm²", "Voltage": "500V", "Current": "24A", "Mounting": "DIN 35mm", "Colour": "Grey" }
  },
  {
    id: 4, category: "Electric Wire/Cable",
    name: "End Cover / Stopper for Terminal Blocks",
    description: "Hard grey PVC end cover for standard DIN-rail terminal blocks. Prevents accidental contact with live parts at the end of a terminal strip.",
    images: ["catalog/electricwire01/item01.JPG", "catalog/electricwire01/item02.JPG"], icon: "fas fa-bolt",
    specs: { "Material": "PVC", "Colour": "Grey", "Compatibility": "2.5–6mm² blocks", "IP Rating": "IP20" }
  },
  {
    id: 5, category: "Electric Wire/Cable",
    name: "DIN Rail Insulating Partition",
    description: "Polycarbonate phase partition barrier used between adjacent terminal blocks to improve isolation in multi-phase installations.",
    images: ["catalog/electricwire02/item01.JPG", "catalog/electricwire02/item02.JPG"], icon: "fas fa-bolt",
    specs: { "Material": "Polycarbonate", "Thickness": "1.5mm", "Voltage Rating": "1000V" }
  },
  {
    id: 6, category: "Connector",
    name: "LED Panel Indicator – Red 22mm",
    description: "Flush-mount 22mm LED pilot light with IP65 sealing. Available in red. Ideal for fault/stop signalling on control panels.",
    images: [], icon: "fas fa-lightbulb",
    specs: { "Diameter": "22mm", "Voltage": "24VDC / 220VAC", "Colour": "Red", "IP Rating": "IP65", "LED Life": ">50,000hrs" }
  },
  {
    id: 7, category: "Connector",
    name: "LED Panel Indicator – Green 22mm",
    description: "Flush-mount 22mm LED pilot light for run/on signalling. Long-life LED, vibration-resistant, low power consumption.",
    images: [], icon: "fas fa-lightbulb",
    specs: { "Diameter": "22mm", "Voltage": "24VDC / 220VAC", "Colour": "Green", "IP Rating": "IP65", "LED Life": ">50,000hrs" }
  },
  {
    id: 8, category: "Connector",
    name: "Audible Alarm Buzzer – 80dB",
    description: "Panel-mount electronic buzzer for alarm and alert signalling. Continuous tone, 80dB at 1m. Suitable for industrial environments.",
    images: [], icon: "fas fa-bell",
    specs: { "Sound Level": "80dB @ 1m", "Voltage": "24VDC", "Mounting": "22mm panel cutout", "IP Rating": "IP54" }
  },
  {
    id: 9, category: "Control Board/Panel",
    name: "Pre-Wired DIN-Rail Sub-Panel",
    description: "Factory-assembled DIN-rail module with 10x terminal blocks, PE bar, end covers, and labelled conductors. Ready to install in any standard enclosure.",
    images: [], icon: "fas fa-th-large",
    specs: { "Terminals": "10 × 2.5mm² screwclamp", "Rail Length": "150mm", "Wire Size": "1.5mm² black/blue/G-Y", "Delivery": "Ready-to-install" }
  },
  {
    id: 10, category: "Control Board/Panel",
    name: "I/O Terminal Sub-Assembly – 24VDC",
    description: "Pre-wired I/O marshalling assembly for PLC or relay interface panels. Includes fused terminal blocks, common bus bars, and ID markers.",
    images: [], icon: "fas fa-th-large",
    specs: { "I/O Points": "16 channels", "Voltage": "24VDC", "Fusing": "Per channel", "Label": "Custom / Standard" }
  },
  {
    id: 11, category: "Hardware Tools",
    name: "Custom Terminal Block Assembly",
    description: "Bespoke terminal block assemblies manufactured to your drawing and BOM. Any quantity, any specification — from prototype to production run.",
    images: [], icon: "fas fa-cogs",
    specs: { "Lead Time": "1–3 weeks", "MOQ": "On request", "Standards": "IEC / UL", "Drawing": "Customer supplied" }
  },
  {
    id: 12, category: "Hardware Tools",
    name: "Custom Stamped & Formed Metal Parts",
    description: "Precision-stamped and formed metal components for electrical enclosures, brackets, and panel frames. Manufactured to tight tolerances from your CAD files.",
    images: [], icon: "fas fa-cogs",
    specs: { "Material": "Steel / Aluminium / SS", "Tolerance": "±0.1mm", "Finish": "Zinc / Powder coat", "MOQ": "On request" }
  },
];

const ELECTRIC_WIRE_SUBCATEGORIES = [
  "D-Sub Cable Assembly",
  "USB Cable Assembly",
  "Wire Harness Assembly",
  "Ribbon Cable Assembly",
  "IDC Cable Assembly",
  "LVDS Cable Assembly",
  "FFC/FPC Cable Assembly",
  "RF Cable Assembly",
  "HDMI Cable Assembly",
  "SATA Cable Assembly",
  "Custom Cable Assembly"
];

const CATEGORY_META = {
  "Terminal Blocks":                            { icon: "fas fa-plug",      desc: "Screw-clamp, spring-cage, and ground terminal blocks for industrial panel wiring." },
  "Electric Wire/Cable":                        { icon: "fas fa-bolt",      desc: "Electric wires, cables, and related wiring materials for panel and machinery applications." },
  "Connector":                                  { icon: "fas fa-link",      desc: "Connector products and accessories for reliable electrical connection work." },
  "Control Board/Panel":                        { icon: "fas fa-th-large",  desc: "Control board, panel, and DIN-rail assemblies ready for cabinet installation." },
  "Hardware Tools":                             { icon: "fas fa-tools",     desc: "Hardware tools and practical parts for installation, assembly, and maintenance work." },
  "Electrical Design CAD Drafting / Drawing":   { icon: "fas fa-drafting-compass", desc: "Electrical design, CAD drafting, and technical drawing support for panel and project documentation." },
};

// ──────────────────────────────────────────────
// SECTION: Catalog State
// ──────────────────────────────────────────────
let activeCategory = 'all';
let searchQuery = '';
let viewMode = 'grid';
let currentRFQProduct = null;
let rfqModal = null;

// ──────────────────────────────────────────────
// SECTION: Catalog Initialization
// ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  window.addEventListener('load', () => {
    const s = document.getElementById('spinner');
    s.classList.add('hide');
    setTimeout(() => s.style.display = 'none', 400);
  });

  rfqModal = new bootstrap.Modal(document.getElementById('rfqModal'));
  buildSidebar();
  renderProducts();

  // Try to load from PHP backend if available
  tryLoadFromBackend();

  // SECTION: Back To Top Button
  const btt = document.getElementById('backToTop');
  window.addEventListener('scroll', () => btt.classList.toggle('show', window.scrollY > 300));

  // URL hash support (e.g. catalog.html#Terminal-Blocks)
  if (location.hash) {
    const cat = decodeURIComponent(location.hash.replace('#', '').replace(/-/g, ' '));
    const match = Object.keys(CATEGORY_META).find(c => c.toLowerCase() === cat.toLowerCase());
    if (match) filterByCategory(match);
  }
});

// ──────────────────────────────────────────────
// SECTION: Optional PHP Backend Loader
// ──────────────────────────────────────────────
function tryLoadFromBackend() {
  fetch('php/load_catalog.php')
    .then(r => r.json())
    .then(items => {
      if (!items || !items.length) return;
      // Merge backend items into CATALOG_DATA
      items.forEach(item => {
        const existing = CATALOG_DATA.find(p => p.name.toLowerCase() === item.name.toLowerCase());
        if (existing) {
          // Update images from backend
          if (item.images && item.images.length) existing.images = item.images;
          if (item.description) existing.description = item.description;
        } else {
          // Add new product from backend
          CATALOG_DATA.push({
            id: Date.now() + Math.random(),
            category: guessCategory(item.name),
            name: item.name,
            description: item.description || 'Contact us for full specifications.',
            images: item.images || [],
            icon: 'fas fa-cube',
            specs: {}
          });
        }
      });
      renderProducts();
    })
    .catch(() => {}); // Silently fail – static data is already shown
}

function guessCategory(name) {
  const n = name.toLowerCase();
  if (n.includes('terminal')) return 'Terminal Blocks';
  if (n.includes('wire') || n.includes('cable') || n.includes('insul') || n.includes('cover')) return 'Electric Wire/Cable';
  if (n.includes('connector') || n.includes('signal') || n.includes('led') || n.includes('indicator') || n.includes('buzzer')) return 'Connector';
  if (n.includes('panel') || n.includes('board') || n.includes('assembly') || n.includes('sub')) return 'Control Board/Panel';
  if (n.includes('cad') || n.includes('draft') || n.includes('drawing') || n.includes('design')) return 'Electrical Design CAD Drafting / Drawing';
  return 'Hardware Tools';
}

// ──────────────────────────────────────────────
// SECTION: Category Sidebar Builder
function buildSidebar() {
  const cats = Object.keys(CATEGORY_META);
  const counts = {};
  cats.forEach(c => counts[c] = CATALOG_DATA.filter(p => p.category === c).length);

  let html = `<button class="sidebar-cat ${activeCategory === 'all' ? 'active' : ''}" onclick="filterByCategory('all')">
    <span class="cat-icon-sm"><i class="fas fa-th-list"></i></span>
    All Products
    <span class="cat-count">${CATALOG_DATA.length}</span>
  </button>`;

  cats.forEach(c => {
    const meta = CATEGORY_META[c];
    const safeCat = c.replace(/'/g, "\\'");
    const isActive = activeCategory === c;
    html += `<button class="sidebar-cat ${isActive ? 'active' : ''}" onclick="filterByCategory('${safeCat}')">
      <span class="cat-icon-sm"><i class="${meta.icon}"></i></span>
      ${c}
      <span class="cat-count">${counts[c]}</span>
    </button>`;

    if (c === 'Electric Wire/Cable') {
      html += `<div class="sidebar-subcats ${isActive ? 'show' : ''}">`;
      ELECTRIC_WIRE_SUBCATEGORIES.forEach(item => {
        html += `<button type="button" class="sidebar-subcat" onclick="filterByCategory('Electric Wire/Cable')">${item}</button>`;
      });
      html += `</div>`;
    }
  });

  document.getElementById('sidebarCats').innerHTML = html;
}

// SECTION: Category Overview Card Builder
function buildOverviewCards() {
  const cats = Object.keys(CATEGORY_META);
  let html = `<div class="col-auto"><div class="overview-card ${activeCategory === 'all' ? 'active' : ''}" onclick="filterByCategory('all')"><div class="ov-icon"><i class="fas fa-th-list"></i></div><h6>All</h6></div></div>`;
  cats.forEach(c => {
    const meta = CATEGORY_META[c];
    const safeCat = c.replace(/'/g, "\\'");
    html += `<div class="col"><div class="overview-card ${activeCategory === c ? 'active' : ''}" onclick="filterByCategory('${safeCat}')">
      <div class="ov-icon"><i class="${meta.icon}"></i></div>
      <h6>${c}</h6>
    </div></div>`;
  });
  const overview = document.getElementById('overviewCards');
  if (overview) overview.innerHTML = html;
}

// SECTION: Category, Search, And Sort Filters
function filterByCategory(cat) {
  activeCategory = cat;
  buildSidebar();
  buildOverviewCards();
  renderProducts();

  const header = document.getElementById('catHeaderSection');
  if (cat !== 'all' && CATEGORY_META[cat]) {
    document.getElementById('catHeaderTitle').textContent = cat;
    document.getElementById('catHeaderDesc').textContent = CATEGORY_META[cat].desc;
    header.style.display = 'block';
  } else {
    header.style.display = 'none';
  }

  document.getElementById('productsContainer').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function handleSearch(q) {
  searchQuery = q.toLowerCase().trim();
  renderProducts();
}

function getFilteredProducts() {
  let list = [...CATALOG_DATA];
  if (activeCategory !== 'all') list = list.filter(p => p.category === activeCategory);
  if (searchQuery) list = list.filter(p =>
    p.name.toLowerCase().includes(searchQuery) ||
    p.description.toLowerCase().includes(searchQuery) ||
    (p.partNumber || '').toLowerCase().includes(searchQuery) ||
    p.category.toLowerCase().includes(searchQuery)
  );
  const sort = document.getElementById('sortSelect')?.value || 'default';
  if (sort === 'az') list.sort((a, b) => a.name.localeCompare(b.name));
  if (sort === 'za') list.sort((a, b) => b.name.localeCompare(a.name));
  return list;
}

// SECTION: Product Card Renderer
// ──────────────────────────────────────────────
function renderProducts() {
  document.getElementById('skeletonGrid')?.remove();
  const products = getFilteredProducts();
  const count = products.length;
  const label = activeCategory === 'all' ? 'All Products' : activeCategory;
  document.getElementById('resultCount').innerHTML =
    `Showing <strong>${count}</strong> ${count === 1 ? 'product' : 'products'} in <strong>${label}</strong>`;

  if (!count) {
    document.getElementById('productsContainer').innerHTML = `
      <div class="empty-state">
        <i class="fas fa-search"></i>
        <h5>No products found</h5>
        <p>Try adjusting your search or selecting a different category.</p>
        <button class="btn btn-outline-primary mt-2" onclick="filterByCategory('all');document.getElementById('sidebarSearch').value='';handleSearch('');">Clear Filters</button>
      </div>`;
    return;
  }

  const isGrid = viewMode === 'grid';
  const colClass = isGrid ? 'col-md-6 col-lg-4' : 'col-12';
  let html = `<div class="row g-4">`;

  products.forEach(p => {
    const imgHTML = p.images && p.images.length
      ? `<img src="${p.images[0]}" alt="${p.name}"
             data-images='${JSON.stringify(p.images)}'
             onmouseenter="startProductImageHover(this)"
             onmouseleave="stopProductImageHover(this)"
             loading="lazy">`
      : `<div class="prod-img-placeholder"><i class="${p.icon || 'fas fa-cube'}"></i></div>`;

    html += `
      <div class="${colClass}">
        <div class="prod-card ${isGrid ? '' : 'list-view'}">
          <div class="prod-img-wrap">
            ${imgHTML}
            <span class="prod-cat-badge">${p.category}</span>
          </div>
          <div class="prod-body">
            <div class="prod-name">${p.name}</div>
            ${p.partNumber ? `<div class="prod-part-number">${p.partNumber}</div>` : ``}
            <div class="prod-desc">${p.description}</div>
            <div class="prod-footer">
              <button class="btn-rfq" onclick="openRFQModal(${p.id})">
                <i class="fas fa-file-invoice me-1"></i>Request Quote
              </button>
              <button class="btn-detail" onclick="openDetailsModal(${p.id})">
                <i class="fas fa-info-circle me-1"></i>Details
              </button>
            </div>
          </div>
        </div>
      </div>`;
  });

  html += `</div>`;
  document.getElementById('productsContainer').innerHTML = html;
}

// ──────────────────────────────────────────────
// SECTION: Grid/List View Toggle
// ──────────────────────────────────────────────
function setView(mode) {
  viewMode = mode;
  document.getElementById('gridViewBtn').classList.toggle('active', mode === 'grid');
  document.getElementById('listViewBtn').classList.toggle('active', mode === 'list');
  renderProducts();
}

// ──────────────────────────────────────────────
// SECTION: RFQ Modal And Email Builder
// ──────────────────────────────────────────────
function renderProductDetails(product) {
  if (!product || !product.details) return '';
  const d = product.details;
  const features = d.keyFeatures.map(item => '<li><i class="fas fa-check"></i>' + item + '</li>').join('');
  const applications = d.applications.map(item => '<li>' + item + '</li>').join('');
  return [
    '<div class="product-detail-section">',
    '<h6>Product Description | 产品简介</h6>',
    '<p><strong>EN:</strong><br>' + d.productDescription.en + '</p>',
    '<p><strong>中文：</strong><br>' + d.productDescription.zh + '</p>',
    '</div>',
    '<div class="product-detail-section">',
    '<h6>Key Features | 核心特点</h6>',
    '<ul>' + features + '</ul>',
    '</div>',
    '<div class="product-detail-section">',
    '<h6>Applications | 应用场景</h6>',
    '<ul>' + applications + '</ul>',
    '</div>',
    '<div class="product-detail-section product-detail-summary">',
    '<h6>Summary</h6>',
    '<p>' + d.summary.en + '</p>',
    '<p><strong>中文：</strong><br>' + d.summary.zh + '</p>',
    '</div>'
  ].join('');
}

function openProductModal(productId, mode = 'quote') {
  const p = productId ? CATALOG_DATA.find(x => x.id === productId) : null;
  currentRFQProduct = p;

  const imgEl = document.getElementById('modalImg');
  const imgPlaceholder = document.getElementById('modalImgPlaceholder');
  const catLabel = document.getElementById('modalCatLabel');
  const productName = document.getElementById('modalProductName');
  const productPartNumber = document.getElementById('modalPartNumber');
  const productDetails = document.getElementById('modalProductDetails');
  const modalTitle = document.getElementById('rfqModalTitle');
  const rfqForm = document.getElementById('rfqForm');

  if (modalTitle) {
    modalTitle.innerHTML = mode === 'details'
      ? '<i class="fas fa-info-circle me-2" style="color:var(--accent);"></i>Product Details'
      : '<i class="fas fa-file-invoice me-2" style="color:var(--accent);"></i>Request a Quotation';
  }
  if (rfqForm) rfqForm.style.display = mode === 'details' ? 'none' : 'block';

  if (p) {
    catLabel.textContent = p.category;
    productName.textContent = p.name;
    if (productPartNumber) productPartNumber.textContent = p.partNumber ? 'Part No: ' + p.partNumber : '';
    if (productDetails) productDetails.innerHTML = mode === 'details' ? renderProductDetails(p) : '';
    document.getElementById('modalProductInfo').style.display = 'block';
    if (p.images && p.images.length) {
      imgEl.innerHTML = `<img src="${p.images[0]}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;">`;
    } else {
      imgEl.innerHTML = `<div class="placeholder"><i class="${p.icon || 'fas fa-cube'}"></i></div>`;
    }
  } else {
    catLabel.textContent = 'General';
    productName.textContent = 'General Quote Request';
    if (productPartNumber) productPartNumber.textContent = '';
    if (productDetails) productDetails.innerHTML = '';
    imgEl.innerHTML = `<div class="placeholder"><i class="fas fa-file-invoice"></i></div>`;
  }

  rfqModal.show();
}

function openRFQModal(productId) {
  openProductModal(productId, 'quote');
}

function openDetailsModal(productId) {
  openProductModal(productId, 'details');
}

function submitRFQ(e) {
  e.preventDefault();
  const form = e.target;
  const vals = {};
  form.querySelectorAll('input, select, textarea').forEach((el, i) => {
    const lbl = el.previousElementSibling?.textContent?.replace('*','').trim() || 'Field ' + i;
    if (el.value) vals[lbl] = el.value;
  });

  let bodyText = currentRFQProduct
    ? `Product: ${currentRFQProduct.name}\nPart No: ${currentRFQProduct.partNumber || '-'}\nCategory: ${currentRFQProduct.category}\n\n`
    : '';
  Object.entries(vals).forEach(([k, v]) => bodyText += `${k}: ${v}\n`);

  const subj = encodeURIComponent('RFQ – ' + (currentRFQProduct ? currentRFQProduct.name : 'General Quote Request'));
  window.location.href = 'mailto:nigel_pse@outlook.com?subject=' + subj + '&body=' + encodeURIComponent(bodyText);

  rfqModal.hide();
  showToast('✓ Opening your email client to send the RFQ...');
  form.reset();
}

// ──────────────────────────────────────────────
// SECTION: Toast Message Helper
// ──────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toastMsg');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3500);
}
