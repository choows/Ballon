document.addEventListener('DOMContentLoaded', () => {
    const catalogGrid = document.getElementById('catalog-grid');
    const filterContainer = document.getElementById('category-filters');
    const loader = document.getElementById('loader');
    
    // Config Placeholders
    let whatsappNumber = "";
    
    // Fetch Data
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            // 1. Setup Config
            whatsappNumber = data.config.phoneNumber;
            setupInstagram(data.config);

            // 2. Render Categories
            renderFilterButtons(data.categories, data.products);

            // 3. Render Initial Products (All)
            renderProducts(data.products, 'All');

            // Hide Loader
            loader.style.display = 'none';
        })
        .catch(error => {
            console.error('Error loading data:', error);
            catalogGrid.innerHTML = '<p class="text-danger text-center">Failed to load catalog.</p>';
        });

    // --- Functions ---

    function setupInstagram(config) {
        document.getElementById('modal-qr-img').src = config.qrCodeImage;
        document.getElementById('modal-insta-link').href = config.instagramUrl;
    }

    function renderFilterButtons(categories, products) {
        categories.forEach((cat, index) => {
            const btn = document.createElement('button');
            btn.className = `btn btn-filter ${index === 0 ? 'active' : ''}`;
            btn.textContent = cat;
            btn.onclick = () => {
                // Remove active class from all
                document.querySelectorAll('.btn-filter').forEach(b => b.classList.remove('active'));
                // Add active to clicked
                btn.classList.add('active');
                // Filter products
                renderProducts(products, cat);
            };
            filterContainer.appendChild(btn);
        });
    }

    function renderProducts(products, filterCategory) {
        catalogGrid.innerHTML = ''; // Clear current grid

        const filtered = filterCategory === 'All' 
            ? products 
            : products.filter(p => p.category === filterCategory);

        if (filtered.length === 0) {
            catalogGrid.innerHTML = '<div class="col-12 text-center text-muted">No designs found in this category.</div>';
            return;
        }

        filtered.forEach(product => {
            // Create Card HTML
            const col = document.createElement('div');
            col.className = 'col';
            
            // Construct WhatsApp Message
            const message = `Hi, I am interested in the ${product.name} (Price: ${product.price}). Is it available?`;
            const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

            col.innerHTML = `
                <div class="card h-100">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="price-tag">${product.price}</p>
                        <div class="mt-auto">
                            <a href="${waLink}" target="_blank" class="btn btn-success w-100">
                                <i class="fa-brands fa-whatsapp"></i> Order / Enquire
                            </a>
                        </div>
                    </div>
                </div>
            `;
            catalogGrid.appendChild(col);
        });
    }
});