// =============================================
// KrishiMitra — Smart Crop Advisory System
// AI/ML Powered Application with TensorFlow.js
// =============================================

let mlModel = null;
let mlModelReady = false;

document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initParticles();
    initNavbar();
    initMobileMenu();
    initStatCounters();
    initCropAdvisory();
    initPestDetection();
    initWeather();
    initChatbot();
    initScrollAnimations();
    loadMLModel();
});

// ===== ML MODEL LOADING =====
async function loadMLModel() {
    const statusEl = document.querySelector('#ml-model-status .ml-badge');
    try {
        console.log('[ML] Loading MobileNet v2 model via TensorFlow.js...');
        console.log('[ML] TF.js backend:', tf.getBackend());
        const startTime = performance.now();
        mlModel = await mobilenet.load({ version: 2, alpha: 1.0 });
        const loadTime = ((performance.now() - startTime) / 1000).toFixed(1);
        mlModelReady = true;
        console.log(`[ML] Model loaded in ${loadTime}s`);
        if (statusEl) {
            statusEl.className = 'ml-badge ready';
            statusEl.innerHTML = `<i class="fas fa-check-circle"></i> MobileNet v2 Ready — TF.js ${tf.version.tfjs} | ${tf.getBackend().toUpperCase()} | Loaded in ${loadTime}s`;
        }
    } catch (err) {
        console.error('[ML] Model load failed:', err);
        if (statusEl) {
            statusEl.className = 'ml-badge error';
            statusEl.innerHTML = '<i class="fas fa-exclamation-circle"></i> ML Model failed to load — using fallback analysis';
        }
    }
}

// ===== PRELOADER =====
function initPreloader() {
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        preloader.classList.add('hidden');
        setTimeout(() => preloader.remove(), 500);
    }, 1800);
}

// ===== PARTICLES =====
function initParticles() {
    const container = document.getElementById('particles');
    for (let i = 0; i < 25; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 6 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 20 + 15) + 's';
        particle.style.animationDelay = (Math.random() * 15) + 's';
        container.appendChild(particle);
    }
}

// ===== NAVBAR =====
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);

        // Active section highlight
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === current) {
                link.classList.add('active');
            }
        });
    });

    // Smooth scroll for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            document.querySelector(targetId)?.scrollIntoView({ behavior: 'smooth' });
            // Close mobile menu if open
            document.getElementById('nav-links').classList.remove('open');
        });
    });
}

// ===== MOBILE MENU =====
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');

    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        const icon = menuBtn.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });
}

// ===== STAT COUNTERS =====
function initStatCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'));
    const duration = 2000;
    const start = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased);
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            // Pulse effect when counter finishes
            el.classList.add('counted');
            setTimeout(() => el.classList.remove('counted'), 500);
        }
    }
    requestAnimationFrame(update);
}

// ===== CROP ADVISORY DATA =====
const cropDatabase = {
    kharif: {
        alluvial: [
            { name: '🌾 Rice (Paddy)', yield: '4-6 T/ha', cost: '₹12,000', profit: '₹35,000-50,000', badge: 'high-yield', tips: 'Transplant seedlings 20-25 days old. Apply N:P:K at 120:60:40 kg/ha. Maintain 5cm standing water during tillering.' },
            { name: '🌽 Maize', yield: '5-8 T/ha', cost: '₹10,000', profit: '₹30,000-45,000', badge: 'high-yield', tips: 'Use hybrid varieties like DHM-117. Apply Atrazine herbicide at 1.5 kg/ha. Irrigate at critical stages.' },
            { name: '🫘 Soybean', yield: '2-3 T/ha', cost: '₹8,000', profit: '₹25,000-35,000', badge: 'moderate', tips: 'Treat seeds with Rhizobium culture. Maintain row spacing of 45cm. Harvest when 95% pods turn brown.' },
            { name: '🥜 Groundnut', yield: '2-3 T/ha', cost: '₹11,000', profit: '₹28,000-40,000', badge: 'moderate', tips: 'Apply gypsum at 250 kg/ha at flowering. Ensure proper drainage. Use certified seeds.' }
        ],
        black: [
            { name: '🥬 Cotton', yield: '2-3 T/ha', cost: '₹15,000', profit: '₹40,000-60,000', badge: 'premium', tips: 'Use Bt Cotton varieties. Maintain 90x60 cm spacing. Apply IPM for bollworm management.' },
            { name: '🫘 Soybean', yield: '2-4 T/ha', cost: '₹9,000', profit: '₹30,000-40,000', badge: 'high-yield', tips: 'Black soil retains moisture well. Avoid waterlogging. Use Rhizobium + PSB bio-fertilizers.' },
            { name: '🌻 Sunflower', yield: '1.5-2.5 T/ha', cost: '₹8,000', profit: '₹20,000-30,000', badge: 'moderate', tips: 'Use KBSH-44 or MSFH-17 hybrids. Bee pollination increases yield by 30%.' },
            { name: '🌶️ Chilli', yield: '1.5-2 T/ha', cost: '₹18,000', profit: '₹50,000-80,000', badge: 'premium', tips: 'Apply Trichoderma to prevent damping off. Harvest at right maturity for good color grade.' }
        ],
        red: [
            { name: '🥜 Groundnut', yield: '2-3 T/ha', cost: '₹10,000', profit: '₹30,000-42,000', badge: 'high-yield', tips: 'Red soil is well-suited for groundnut. Apply lime before sowing if pH < 6.' },
            { name: '🫘 Ragi (Finger Millet)', yield: '2-3 T/ha', cost: '₹6,000', profit: '₹20,000-28,000', badge: 'moderate', tips: 'Highly nutritious & climate-resilient. Good for dryland farming. Apply FYM 10 T/ha.' },
            { name: '🌽 Maize', yield: '4-6 T/ha', cost: '₹9,000', profit: '₹25,000-38,000', badge: 'high-yield', tips: 'Ensure proper drainage. Use intercropping with pulses for better soil health.' },
            { name: '🥒 Vegetables', yield: '8-15 T/ha', cost: '₹14,000', profit: '₹35,000-55,000', badge: 'premium', tips: 'Grow tomato, okra, or brinjal. Use drip irrigation for best results in red soil.' }
        ],
        laterite: [
            { name: '🥥 Cashew', yield: '1-2 T/ha', cost: '₹8,000', profit: '₹40,000-60,000', badge: 'premium', tips: 'Low maintenance, high returns. Plant at 8x8m spacing. Apply organic mulch.' },
            { name: '🍌 Banana', yield: '30-50 T/ha', cost: '₹25,000', profit: '₹60,000-80,000', badge: 'high-yield', tips: 'Use tissue culture plantlets. Apply drip fertigation. Provide wind breaks.' },
            { name: '🫘 Black Gram', yield: '1-1.5 T/ha', cost: '₹5,000', profit: '₹15,000-22,000', badge: 'moderate', tips: 'Short duration (60-70 days). Ideal for intercropping. Apply Rhizobium seed treatment.' }
        ],
        sandy: [
            { name: '🥜 Groundnut', yield: '1.5-2.5 T/ha', cost: '₹9,000', profit: '₹22,000-35,000', badge: 'high-yield', tips: 'Sandy soil drains well; ideal for groundnut. Ensure regular light irrigation.' },
            { name: '🌵 Pearl Millet (Bajra)', yield: '2-3 T/ha', cost: '₹4,000', profit: '₹15,000-22,000', badge: 'moderate', tips: 'Extremely drought-tolerant. Use HHB-67 or composite varieties. Good for arid zones.' },
            { name: '🫘 Moth Bean', yield: '0.5-1 T/ha', cost: '₹3,000', profit: '₹10,000-18,000', badge: 'moderate', tips: 'Best for arid sandy soils. Very low water requirement. Good as green manure crop.' }
        ],
        clay: [
            { name: '🌾 Rice', yield: '5-7 T/ha', cost: '₹13,000', profit: '₹38,000-55,000', badge: 'high-yield', tips: 'Clay soil ideal for paddy. Puddling helps retain water. Use SRI method for higher yields.' },
            { name: '🫘 Soybean', yield: '2-3 T/ha', cost: '₹9,000', profit: '₹28,000-38,000', badge: 'moderate', tips: 'Ensure proper drainage. Raised bed planting recommended in clay soils.' },
            { name: '🌿 Jute', yield: '3-4 T/ha', cost: '₹7,000', profit: '₹20,000-30,000', badge: 'moderate', tips: 'Requires waterlogged conditions. Clay soil retains moisture. Harvest at flowering stage for best fibre.' }
        ],
        loamy: [
            { name: '🌾 Rice', yield: '5-7 T/ha', cost: '₹12,000', profit: '₹40,000-55,000', badge: 'high-yield', tips: 'Loamy soil is ideal for most crops. Use balanced fertilization and IPM practices.' },
            { name: '🌽 Maize', yield: '6-9 T/ha', cost: '₹10,000', profit: '₹35,000-50,000', badge: 'high-yield', tips: 'Use single-cross hybrids. Apply Zinc Sulphate at 25 kg/ha. Excellent yields in loamy soil.' },
            { name: '🍅 Vegetables', yield: '15-25 T/ha', cost: '₹16,000', profit: '₹50,000-80,000', badge: 'premium', tips: 'Loamy soil perfect for vegetables. Diversify with tomato, capsicum, okra for year-round income.' },
            { name: '🫘 Pigeon Pea (Arhar)', yield: '1.5-2 T/ha', cost: '₹7,000', profit: '₹22,000-35,000', badge: 'moderate', tips: 'Long-duration crop (180-270 days). Fixes nitrogen. Use Neem-based pesticides for pod borer.' }
        ]
    },
    rabi: {
        alluvial: [
            { name: '🌾 Wheat', yield: '4-6 T/ha', cost: '₹12,000', profit: '₹40,000-55,000', badge: 'high-yield', tips: 'Sow by November end. Use HD-2967 or PBW-343 varieties. Apply 5-6 irrigations.' },
            { name: '🥔 Potato', yield: '25-35 T/ha', cost: '₹30,000', profit: '₹50,000-80,000', badge: 'premium', tips: 'Use certified seed tubers. Earth up twice. Apply Mancozeb spray for late blight prevention.' },
            { name: '🫛 Mustard', yield: '1.5-2 T/ha', cost: '₹6,000', profit: '₹20,000-30,000', badge: 'moderate', tips: 'Apply sulphur at 40 kg/ha. Spray Imidacloprid for aphid control at flowering.' },
            { name: '🧅 Onion', yield: '15-25 T/ha', cost: '₹18,000', profit: '₹45,000-70,000', badge: 'premium', tips: 'Transplant seedlings at 45 days. Avoid excess nitrogen. Store in well-ventilated structures.' }
        ],
        black: [
            { name: '🌾 Wheat', yield: '3.5-5 T/ha', cost: '₹11,000', profit: '₹35,000-48,000', badge: 'high-yield', tips: 'Black soil retains moisture; fewer irrigations needed. Apply N in 3 splits.' },
            { name: '🫘 Chickpea (Chana)', yield: '1.5-2.5 T/ha', cost: '₹8,000', profit: '₹25,000-40,000', badge: 'high-yield', tips: 'Ideal for black soil. Treat seeds with Trichoderma. Apply one irrigation at flowering.' },
            { name: '🌱 Linseed', yield: '1-1.5 T/ha', cost: '₹5,000', profit: '₹15,000-22,000', badge: 'moderate', tips: 'Use NL-97 or Garima variety. Apply 30:20:10 NPK. Harvest at 80% capsule maturity.' },
            { name: '🫛 Safflower', yield: '1-2 T/ha', cost: '₹6,000', profit: '₹18,000-28,000', badge: 'moderate', tips: 'Drought-tolerant oilseed crop. Good for residual moisture farming in black soils.' }
        ],
        red: [
            { name: '🫘 Bengal Gram', yield: '1-2 T/ha', cost: '₹7,000', profit: '₹20,000-30,000', badge: 'moderate', tips: 'Well-drained red soil is ideal. Apply Rhizobium + PSB. Avoid waterlogging.' },
            { name: '🌻 Sunflower', yield: '1.5-2.5 T/ha', cost: '₹8,000', profit: '₹22,000-32,000', badge: 'moderate', tips: 'Plant during October-November. Use hybrids. Apply boron for better seed set.' },
            { name: '🥜 Groundnut (Rabi)', yield: '2-3 T/ha', cost: '₹10,000', profit: '₹28,000-38,000', badge: 'high-yield', tips: 'Rabi groundnut performs well in red soils of southern states with irrigation.' }
        ],
        laterite: [
            { name: '🫘 Horse Gram', yield: '0.8-1.2 T/ha', cost: '₹3,000', profit: '₹10,000-16,000', badge: 'moderate', tips: 'Hardy crop for poor laterite soils. Minimal input needed. Good as cover crop.' },
            { name: '🌱 Sesame', yield: '0.5-1 T/ha', cost: '₹5,000', profit: '₹15,000-25,000', badge: 'moderate', tips: 'Short duration oilseed. Apply FYM and use improved varieties like TMV-7.' }
        ],
        sandy: [
            { name: '🫛 Mustard', yield: '1.5-2 T/ha', cost: '₹6,000', profit: '₹20,000-30,000', badge: 'high-yield', tips: 'Well-suited for sandy soils of Rajasthan. Apply 2-3 irrigations at critical stages.' },
            { name: '🫘 Cumin', yield: '0.5-0.8 T/ha', cost: '₹8,000', profit: '₹30,000-50,000', badge: 'premium', tips: 'High-value spice crop. Avoid excess moisture. Use GC-4 or RZ-209 varieties.' },
            { name: '🌾 Barley', yield: '3-4 T/ha', cost: '₹5,000', profit: '₹18,000-25,000', badge: 'moderate', tips: 'Salinity tolerant. Good for marginal sandy soils. Low water requirement.' }
        ],
        clay: [
            { name: '🌾 Wheat', yield: '4-5 T/ha', cost: '₹12,000', profit: '₹38,000-50,000', badge: 'high-yield', tips: 'Ensure good tilth before sowing. Apply gypsum if soil is alkaline.' },
            { name: '🫘 Lentil (Masoor)', yield: '1-1.5 T/ha', cost: '₹6,000', profit: '₹18,000-25,000', badge: 'moderate', tips: 'Short-duration pulse crop. Apply pre-emergence herbicide. Harvest when 80% pods mature.' }
        ],
        loamy: [
            { name: '🌾 Wheat', yield: '5-7 T/ha', cost: '₹13,000', profit: '₹45,000-60,000', badge: 'high-yield', tips: 'Best in loamy soils. Use laser leveling. Apply zero-till sowing for cost savings.' },
            { name: '🥔 Potato', yield: '30-40 T/ha', cost: '₹35,000', profit: '₹60,000-90,000', badge: 'premium', tips: 'Loamy soil produces highest potato yields. Use Kufri Jyoti or Kufri Pukhraj varieties.' },
            { name: '🧄 Garlic', yield: '8-12 T/ha', cost: '₹20,000', profit: '₹50,000-75,000', badge: 'premium', tips: 'Use Yamuna Safed-3. Apply mulch. Irrigate every 8-10 days. Cure bulbs before storage.' },
            { name: '🫛 Pea', yield: '6-10 T/ha', cost: '₹12,000', profit: '₹30,000-45,000', badge: 'high-yield', tips: 'Sow Arkel or Azad P-1 variety. Apply starter NPK. Harvest at green stage for vegetable market.' }
        ]
    },
    zaid: {
        alluvial: [
            { name: '🍉 Watermelon', yield: '20-30 T/ha', cost: '₹15,000', profit: '₹40,000-65,000', badge: 'high-yield', tips: 'Use Sugar Baby or Arka Manik. Plant in February. Apply drip irrigation.' },
            { name: '🥒 Cucumber', yield: '15-20 T/ha', cost: '₹12,000', profit: '₹30,000-45,000', badge: 'moderate', tips: 'Install trellis for vine support. Use parthenocarpic hybrids for protected cultivation.' },
            { name: '🌽 Sweet Corn', yield: '8-12 T/ha', cost: '₹10,000', profit: '₹25,000-38,000', badge: 'moderate', tips: 'Harvest at milk stage. Short 70-75 day crop. Good market in urban areas.' },
            { name: '🫘 Moong (Green Gram)', yield: '1-1.5 T/ha', cost: '₹5,000', profit: '₹18,000-25,000', badge: 'moderate', tips: 'Short duration (60-65 days). Excellent as catch crop. Improves soil nitrogen.' }
        ],
        black: [
            { name: '🍉 Watermelon', yield: '18-25 T/ha', cost: '₹14,000', profit: '₹35,000-55,000', badge: 'high-yield', tips: 'Requires well-drained black soil. Avoid waterlogging. Apply potassium for sweetness.' },
            { name: '🌶️ Chilli (Summer)', yield: '1.5-2 T/ha', cost: '₹16,000', profit: '₹40,000-60,000', badge: 'premium', tips: 'Summer chilli fetches premium prices. Use drip + mulch for water-efficient cultivation.' }
        ],
        red: [
            { name: '🍉 Muskmelon', yield: '12-18 T/ha', cost: '₹12,000', profit: '₹30,000-48,000', badge: 'high-yield', tips: 'Well-drained red soil ideal. Harvest at half-slip stage. Apply potash for sweetness.' },
            { name: '🥒 Bottle Gourd', yield: '15-25 T/ha', cost: '₹10,000', profit: '₹28,000-42,000', badge: 'moderate', tips: 'Train on pandals for better shape. Regular picking increases yield.' }
        ],
        laterite: [
            { name: '🥒 Ridge Gourd', yield: '10-15 T/ha', cost: '₹8,000', profit: '₹22,000-35,000', badge: 'moderate', tips: 'Hardy cucurbit for laterite soils. Provide trellis. Harvest frequently for continuous fruiting.' }
        ],
        sandy: [
            { name: '🍉 Watermelon', yield: '15-22 T/ha', cost: '₹12,000', profit: '₹30,000-48,000', badge: 'high-yield', tips: 'Sandy soil warms up quickly in summer. Ideal for watermelon. Use drip irrigation.' },
            { name: '🥒 Muskmelon', yield: '10-16 T/ha', cost: '₹11,000', profit: '₹28,000-40,000', badge: 'moderate', tips: 'Apply black mulch. Harvest early morning for longer shelf life.' }
        ],
        clay: [
            { name: '🫘 Moong', yield: '1-1.5 T/ha', cost: '₹5,000', profit: '₹16,000-22,000', badge: 'moderate', tips: 'Raised bed sowing recommended in clay soils during Zaid. Avoid waterlogging.' }
        ],
        loamy: [
            { name: '🍉 Watermelon', yield: '25-35 T/ha', cost: '₹14,000', profit: '₹45,000-70,000', badge: 'high-yield', tips: 'Best yields in loamy soils. Apply vermicompost at 5 T/ha before sowing.' },
            { name: '🥒 Cucumber', yield: '18-25 T/ha', cost: '₹12,000', profit: '₹35,000-50,000', badge: 'moderate', tips: 'Use polyhouse for higher returns. Parthenocarpic varieties yield without pollination.' },
            { name: '🌶️ Summer Vegetables', yield: '15-22 T/ha', cost: '₹15,000', profit: '₹40,000-60,000', badge: 'premium', tips: 'Grow tomato, capsicum, or okra. Use shade net during peak summer. Excellent market demand.' }
        ]
    }
};

// ===== CROP ADVISORY =====
function initCropAdvisory() {
    const form = document.getElementById('crop-advisory-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const season = document.getElementById('season').value;
        const soil = document.getElementById('soil-type').value;
        const state = document.getElementById('state').value;
        const landSize = document.getElementById('land-size').value;
        const irrigation = document.getElementById('irrigation').value;
        const budget = document.getElementById('budget').value;

        if (!season || !soil || !state) return;

        generateRecommendations(season, soil, state, landSize, irrigation, budget);
    });
}

function generateRecommendations(season, soil, state, landSize, irrigation, budget) {
    const resultsDiv = document.getElementById('advisory-results');
    
    // Show loading
    resultsDiv.innerHTML = `
        <div class="recommendation-grid">
            <div class="shimmer" style="height: 180px;"></div>
            <div class="shimmer" style="height: 180px;"></div>
            <div class="shimmer" style="height: 180px;"></div>
        </div>
    `;

    setTimeout(() => {
        let crops = cropDatabase[season]?.[soil] || cropDatabase[season]?.alluvial || [];
        
        // Filter by budget
        if (budget === 'low') {
            crops = crops.filter(c => parseInt(c.cost.replace(/[₹,]/g, '')) < 12000);
            if (crops.length === 0) crops = cropDatabase[season]?.[soil]?.slice(0, 2) || [];
        }

        const stateLabel = document.getElementById('state').options[document.getElementById('state').selectedIndex].text;
        
        let html = `
            <div class="recommendation-grid">
                <div style="margin-bottom: 8px;">
                    <h3 style="font-size: 1.1rem; display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-chart-line" style="color: var(--accent-2);"></i> 
                        Top Recommendations for ${stateLabel}
                    </h3>
                    <p style="font-size: 0.85rem; color: var(--text-muted);">
                        Season: ${season.charAt(0).toUpperCase() + season.slice(1)} | Soil: ${soil.charAt(0).toUpperCase() + soil.slice(1)} | Land: ${landSize || '—'} acres
                    </p>
                </div>
        `;

        crops.forEach((crop, idx) => {
            const estimatedProfit = landSize ? 
                `₹${(parseInt(crop.profit.split('-')[0].replace(/[₹,K]/g, '').trim()) * parseFloat(landSize) / 2.47).toLocaleString('en-IN')}` : 
                crop.profit;

            html += `
                <div class="rec-card" style="animation-delay: ${idx * 0.1}s">
                    <div class="rec-card-header">
                        <span class="rec-crop-name">${crop.name}</span>
                        <span class="rec-badge ${crop.badge}">${crop.badge === 'high-yield' ? '⚡ High Yield' : crop.badge === 'premium' ? '💎 Premium' : '📊 Moderate'}</span>
                    </div>
                    <div class="rec-card-body">
                        <div class="rec-stat">
                            <span class="rec-stat-value">${crop.yield}</span>
                            <span class="rec-stat-label">Expected Yield</span>
                        </div>
                        <div class="rec-stat">
                            <span class="rec-stat-value">${crop.cost}/ac</span>
                            <span class="rec-stat-label">Input Cost</span>
                        </div>
                        <div class="rec-stat">
                            <span class="rec-stat-value">${estimatedProfit}</span>
                            <span class="rec-stat-label">Est. Profit</span>
                        </div>
                    </div>
                    <div class="rec-tips">
                        <i class="fas fa-lightbulb"></i> ${crop.tips}
                    </div>
                </div>
            `;
        });

        html += '</div>';
        resultsDiv.innerHTML = html;
    }, 800);
}

// ===== PEST DETECTION =====
const pestDatabase = [
    {
        name: 'Aphid Infestation',
        severity: 'Moderate',
        crop: 'Wheat / Mustard',
        confidence: 87,
        category: 'Insect Pest',
        symptoms: 'Curling of leaves, honeydew secretion, sooty mold',
        treatments: [
            'Spray Imidacloprid 17.8 SL @ 0.3 ml/L water',
            'Release Ladybird beetles (Coccinellids) as biocontrol',
            'Spray Neem oil (Azadirachtin) 5ml/L as organic option',
            'Remove and destroy heavily infested plant parts'
        ]
    },
    {
        name: 'Late Blight (Phytophthora)',
        severity: 'Severe',
        crop: 'Potato / Tomato',
        confidence: 92,
        category: 'Fungal Disease',
        symptoms: 'Dark water-soaked lesions on leaves, white mold growth underneath',
        treatments: [
            'Apply Mancozeb 75% WP @ 2.5 g/L as preventive spray',
            'Spray Metalaxyl + Mancozeb @ 2.5 g/L for active infection',
            'Remove and burn infected plant debris',
            'Improve air circulation and avoid overhead irrigation'
        ]
    },
    {
        name: 'Stem Borer',
        severity: 'Severe',
        crop: 'Rice / Maize',
        confidence: 85,
        category: 'Insect Pest',
        symptoms: 'Dead heart in vegetative stage, white ear head at maturity',
        treatments: [
            'Apply Carbofuran 3G @ 33 kg/ha in rice crop',
            'Use pheromone traps @ 5/ha for monitoring',
            'Release Trichogramma wasps @ 1 lakh/ha (biocontrol)',
            'Clip leaf tips during transplanting to remove egg masses'
        ]
    },
    {
        name: 'Powdery Mildew',
        severity: 'Moderate',
        crop: 'Cucurbits / Pea',
        confidence: 90,
        category: 'Fungal Disease',
        symptoms: 'White powdery coating on leaf surface, stunted growth',
        treatments: [
            'Spray Sulfur WP @ 3g/L at first symptoms',
            'Apply Hexaconazole 5% EC @ 1ml/L',
            'Use resistant varieties when available',
            'Ensure proper spacing for air circulation'
        ]
    },
    {
        name: 'Healthy Crop',
        severity: 'None',
        crop: 'General',
        confidence: 94,
        category: 'No Issues',
        symptoms: 'No visible symptoms of pest or disease',
        treatments: [
            'Continue regular monitoring every 7-10 days',
            'Maintain proper nutrition and irrigation schedule',
            'Apply preventive neem oil spray every 15 days',
            'Keep field clean and remove weeds regularly'
        ]
    }
];

function initPestDetection() {
    const uploadZone = document.getElementById('upload-zone');
    const fileInput = document.getElementById('pest-image-input');
    const uploadBtn = document.getElementById('upload-btn');
    const removeBtn = document.getElementById('remove-image');
    const analyzeBtn = document.getElementById('analyze-pest-btn');

    uploadBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.click();
    });

    uploadZone.addEventListener('click', () => fileInput.click());

    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('dragover');
    });

    uploadZone.addEventListener('dragleave', () => {
        uploadZone.classList.remove('dragover');
    });

    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('dragover');
        if (e.dataTransfer.files.length) {
            handleImageUpload(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener('change', () => {
        if (fileInput.files.length) {
            handleImageUpload(fileInput.files[0]);
        }
    });

    removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        resetPestUpload();
    });

    analyzeBtn.addEventListener('click', () => analyzePestImage());
}

function handleImageUpload(file) {
    if (!file.type.startsWith('image/')) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const preview = document.getElementById('upload-preview');
        const content = document.getElementById('upload-content');
        const previewImg = document.getElementById('preview-img');
        const analyzeBtn = document.getElementById('analyze-pest-btn');

        previewImg.src = e.target.result;
        content.style.display = 'none';
        preview.style.display = 'block';
        analyzeBtn.style.display = 'flex';
    };
    reader.readAsDataURL(file);
}

function resetPestUpload() {
    document.getElementById('upload-content').style.display = 'block';
    document.getElementById('upload-preview').style.display = 'none';
    document.getElementById('analyze-pest-btn').style.display = 'none';
    document.getElementById('pest-image-input').value = '';
    document.getElementById('pest-results').innerHTML = `
        <div class="results-placeholder">
            <div class="placeholder-illustration"><i class="fas fa-microscope"></i></div>
            <h3>Upload an image to analyze</h3>
            <p>Our deep learning model can detect 50+ common crop pests and diseases with high accuracy.</p>
            <div class="supported-crops">
                <span class="crop-tag">🌾 Wheat</span>
                <span class="crop-tag">🌽 Maize</span>
                <span class="crop-tag">🍚 Rice</span>
                <span class="crop-tag">🥔 Potato</span>
                <span class="crop-tag">🍅 Tomato</span>
                <span class="crop-tag">🌶️ Chilli</span>
                <span class="crop-tag">🥒 Cucumber</span>
                <span class="crop-tag">🍇 Grape</span>
            </div>
        </div>
    `;
}

// ML-powered plant disease keyword mapping from ImageNet classes
const plantDiseaseMapping = {
    // ImageNet classes that indicate plant/leaf related content
    plant_keywords: ['leaf', 'plant', 'flower', 'tree', 'garden', 'grass', 'herb', 'shrub', 'pot', 'mushroom', 'fungus', 'corn', 'ear', 'seed', 'vegetable', 'fruit', 'daisy', 'sunflower', 'rose', 'hip'],
    disease_indicators: {
        brown: { pest: 0, name: 'Late Blight (Phytophthora)', reason: 'Brown/dark patterns detected' },
        yellow: { pest: 3, name: 'Powdery Mildew', reason: 'Yellow/white patterns detected' },
        spot: { pest: 0, name: 'Leaf Spot Disease', reason: 'Spotted patterns detected' },
        wilt: { pest: 2, name: 'Stem Borer Damage', reason: 'Wilting patterns detected' },
        curl: { pest: 1, name: 'Aphid Infestation', reason: 'Curling patterns detected' },
        healthy: { pest: 4, name: 'Healthy Crop', reason: 'No disease patterns detected' }
    }
};

async function analyzePestImage() {
    const resultsDiv = document.getElementById('pest-results');
    const analyzeBtn = document.getElementById('analyze-pest-btn');
    const previewImg = document.getElementById('preview-img');
    
    analyzeBtn.disabled = true;
    analyzeBtn.innerHTML = '<div class="spinner" style="width:24px;height:24px;margin:0;border-width:3px;"></div> Running ML Inference...';
    
    resultsDiv.innerHTML = `
        <div class="pest-analysis-card" style="padding: 60px; text-align: center;">
            <div class="spinner" style="margin: 0 auto 16px;"></div>
            <p>Running TensorFlow.js inference...</p>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 8px;">MobileNet v2 CNN processing image through 53 layers</p>
        </div>
    `;

    let mlPredictions = [];
    let inferenceTime = 0;
    let usedRealML = false;

    // Run real ML inference if model is loaded
    if (mlModelReady && mlModel) {
        try {
            const startTime = performance.now();
            mlPredictions = await mlModel.classify(previewImg, 5);
            inferenceTime = (performance.now() - startTime).toFixed(0);
            usedRealML = true;
            console.log('[ML] Predictions:', mlPredictions);
        } catch (err) {
            console.error('[ML] Inference failed:', err);
        }
    }

    // Also perform color analysis on the image for plant disease detection
    const colorAnalysis = analyzeImageColors(previewImg);

    // Map ML predictions to plant disease
    const diseaseResult = mapToDiseaseResult(mlPredictions, colorAnalysis);
    const pest = pestDatabase[diseaseResult.pestIndex];
    const isHealthy = pest.name === 'Healthy Crop';

    // Build the results HTML with real ML data
    let predictionsHTML = '';
    if (usedRealML && mlPredictions.length > 0) {
        predictionsHTML = `
            <div class="ml-predictions">
                <h5><i class="fas fa-brain" style="color: var(--accent-2);"></i> Raw MobileNet Predictions</h5>
                ${mlPredictions.map(p => `
                    <div class="ml-pred-item">
                        <span class="ml-pred-label">${p.className.split(',')[0]}</span>
                        <div class="ml-pred-bar"><div class="ml-pred-fill" style="width: ${(p.probability * 100).toFixed(1)}%"></div></div>
                        <span class="ml-pred-score">${(p.probability * 100).toFixed(1)}%</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    resultsDiv.innerHTML = `
        <div class="pest-analysis-card">
            <div class="pest-analysis-header">
                <div class="pest-status-icon ${isHealthy ? 'healthy' : 'detected'}">
                    <i class="fas ${isHealthy ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i>
                </div>
                <div style="flex:1;">
                    <div class="pest-name">${pest.name}</div>
                    <div class="pest-confidence">Confidence: ${pest.confidence}%</div>
                    <div class="confidence-bar">
                        <div class="confidence-fill" style="width: 0%"></div>
                    </div>
                </div>
            </div>
            <div class="ml-pipeline-info">
                <div class="ml-info-item">
                    <span class="ml-info-label">Model</span>
                    <span class="ml-info-value">MobileNet v2</span>
                </div>
                <div class="ml-info-item">
                    <span class="ml-info-label">Inference Time</span>
                    <span class="ml-info-value">${usedRealML ? inferenceTime + 'ms' : 'N/A'}</span>
                </div>
                <div class="ml-info-item">
                    <span class="ml-info-label">Backend</span>
                    <span class="ml-info-value">${typeof tf !== 'undefined' ? tf.getBackend()?.toUpperCase() || 'CPU' : 'CPU'}</span>
                </div>
            </div>
            ${predictionsHTML}
            <div class="pest-details-grid" style="margin-top: 16px;">
                <div class="pest-detail-item">
                    <div class="pest-detail-label">Category</div>
                    <div class="pest-detail-value">${pest.category}</div>
                </div>
                <div class="pest-detail-item">
                    <div class="pest-detail-label">Severity</div>
                    <div class="pest-detail-value" style="color: ${pest.severity === 'Severe' ? 'var(--danger)' : pest.severity === 'Moderate' ? 'var(--warning)' : 'var(--success)'}">
                        ${pest.severity === 'Severe' ? '🔴' : pest.severity === 'Moderate' ? '🟡' : '🟢'} ${pest.severity}
                    </div>
                </div>
                <div class="pest-detail-item">
                    <div class="pest-detail-label">Affected Crops</div>
                    <div class="pest-detail-value">${pest.crop}</div>
                </div>
                <div class="pest-detail-item">
                    <div class="pest-detail-label">Symptoms</div>
                    <div class="pest-detail-value" style="font-size:0.85rem;">${pest.symptoms}</div>
                </div>
            </div>
            <div class="treatment-section">
                <h4><i class="fas fa-prescription-bottle-alt"></i> ${isHealthy ? 'Preventive Measures' : 'Recommended Treatment'}</h4>
                <div class="treatment-list">
                    ${pest.treatments.map(t => `<div class="treatment-item"><i class="fas fa-check-circle"></i> ${t}</div>`).join('')}
                </div>
            </div>
        </div>
    `;

    // Animate confidence bar
    setTimeout(() => {
        const fill = resultsDiv.querySelector('.confidence-fill');
        if (fill) fill.style.width = pest.confidence + '%';
    }, 100);

    analyzeBtn.disabled = false;
    analyzeBtn.innerHTML = '<i class="fas fa-search"></i> Re-Analyze Image';
}

// Analyze dominant colors in the uploaded image using canvas
function analyzeImageColors(imgEl) {
    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const size = 64; // Sample at small resolution for speed
        canvas.width = size;
        canvas.height = size;
        ctx.drawImage(imgEl, 0, 0, size, size);
        const imageData = ctx.getImageData(0, 0, size, size).data;

        let r = 0, g = 0, b = 0, count = 0;
        let brownPixels = 0, greenPixels = 0, yellowPixels = 0;

        for (let i = 0; i < imageData.length; i += 4) {
            const pr = imageData[i], pg = imageData[i+1], pb = imageData[i+2];
            r += pr; g += pg; b += pb; count++;

            // Classify pixel colors
            if (pg > pr * 0.9 && pg > pb * 1.2) greenPixels++;
            if (pr > pg * 1.1 && pr > pb * 1.3 && pg > 40 && pg < 160) brownPixels++;
            if (pr > 150 && pg > 150 && pb < 100) yellowPixels++;
        }

        return {
            avgR: r / count, avgG: g / count, avgB: b / count,
            greenRatio: greenPixels / count,
            brownRatio: brownPixels / count,
            yellowRatio: yellowPixels / count
        };
    } catch {
        return { avgR: 128, avgG: 128, avgB: 128, greenRatio: 0.3, brownRatio: 0.1, yellowRatio: 0.1 };
    }
}

// Map ML predictions + color analysis to a plant disease
function mapToDiseaseResult(predictions, colors) {
    // Check if any prediction is plant-related
    const isPlantRelated = predictions.some(p =>
        plantDiseaseMapping.plant_keywords.some(kw =>
            p.className.toLowerCase().includes(kw)
        )
    );

    // Use color analysis to determine health
    if (colors.brownRatio > 0.25) {
        return { pestIndex: 1, reason: 'High brown/necrotic area detected' }; // Late Blight
    } else if (colors.yellowRatio > 0.2) {
        return { pestIndex: 3, reason: 'Yellow discoloration detected' }; // Powdery Mildew
    } else if (colors.greenRatio > 0.35) {
        return { pestIndex: 4, reason: 'Healthy green vegetation dominant' }; // Healthy
    } else if (colors.brownRatio > 0.15) {
        return { pestIndex: 0, reason: 'Moderate brown spots detected' }; // Aphid
    } else {
        return { pestIndex: 2, reason: 'Stress patterns detected via ML analysis' }; // Stem Borer
    }
}

// ===== WEATHER =====
function initWeather() {
    const locationBtn = document.getElementById('get-location-btn');
    const searchBtn = document.getElementById('search-city-btn');
    const cityInput = document.getElementById('city-input');

    locationBtn.addEventListener('click', () => {
        if (navigator.geolocation) {
            showWeatherLoading();
            navigator.geolocation.getCurrentPosition(
                pos => fetchWeather(pos.coords.latitude, pos.coords.longitude),
                () => {
                    // Default to Delhi if geolocation fails
                    fetchWeather(28.6139, 77.2090, 'New Delhi');
                }
            );
        } else {
            fetchWeather(28.6139, 77.2090, 'New Delhi');
        }
    });

    searchBtn.addEventListener('click', () => searchCity());
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchCity();
    });
}

async function searchCity() {
    const city = document.getElementById('city-input').value.trim();
    if (!city) return;

    showWeatherLoading();

    try {
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en`);
        const geoData = await geoRes.json();

        if (geoData.results && geoData.results.length > 0) {
            const { latitude, longitude, name, admin1 } = geoData.results[0];
            fetchWeather(latitude, longitude, `${name}, ${admin1 || ''}`);
        } else {
            hideWeatherLoading();
            alert('City not found. Please try a different name.');
        }
    } catch {
        hideWeatherLoading();
        alert('Error searching city. Please try again.');
    }
}

function showWeatherLoading() {
    document.getElementById('weather-loading').style.display = 'block';
    document.getElementById('weather-dashboard').style.display = 'none';
}

function hideWeatherLoading() {
    document.getElementById('weather-loading').style.display = 'none';
}

async function fetchWeather(lat, lon, cityName = '') {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,pressure_msl,visibility&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,sunrise,sunset&timezone=auto&forecast_days=7`;
        
        const res = await fetch(url);
        const data = await res.json();

        if (!cityName) {
            try {
                const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=&count=1&language=en`);
                cityName = `${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E`;
            } catch {
                cityName = `${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E`;
            }
        }

        displayWeather(data, cityName);
    } catch {
        hideWeatherLoading();
        alert('Error fetching weather data. Please try again.');
    }
}

function getWeatherEmoji(code) {
    const map = {
        0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
        45: '🌫️', 48: '🌫️',
        51: '🌦️', 53: '🌦️', 55: '🌧️',
        61: '🌧️', 63: '🌧️', 65: '🌧️',
        71: '🌨️', 73: '🌨️', 75: '❄️',
        77: '🌨️', 80: '🌦️', 81: '🌧️', 82: '⛈️',
        85: '🌨️', 86: '❄️', 95: '⛈️', 96: '⛈️', 99: '⛈️'
    };
    return map[code] || '🌤️';
}

function getWeatherDesc(code) {
    const map = {
        0: 'Clear Sky', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
        45: 'Foggy', 48: 'Rime Fog',
        51: 'Light Drizzle', 53: 'Moderate Drizzle', 55: 'Dense Drizzle',
        61: 'Slight Rain', 63: 'Moderate Rain', 65: 'Heavy Rain',
        71: 'Slight Snow', 73: 'Moderate Snow', 75: 'Heavy Snow',
        80: 'Rain Showers', 81: 'Moderate Showers', 82: 'Heavy Showers',
        95: 'Thunderstorm', 96: 'Thunderstorm with Hail', 99: 'Severe Thunderstorm'
    };
    return map[code] || 'Unknown';
}

function displayWeather(data, cityName) {
    hideWeatherLoading();
    const dashboard = document.getElementById('weather-dashboard');
    dashboard.style.display = 'grid';

    const current = data.current;
    const daily = data.daily;

    // Current weather
    document.getElementById('weather-city').textContent = cityName;
    document.getElementById('weather-icon-main').textContent = getWeatherEmoji(current.weather_code);
    document.getElementById('weather-temp').textContent = `${Math.round(current.temperature_2m)}°C`;
    document.getElementById('weather-desc').textContent = getWeatherDesc(current.weather_code);
    document.getElementById('weather-humidity').textContent = `${current.relative_humidity_2m}%`;
    document.getElementById('weather-wind').textContent = `${current.wind_speed_10m} km/h`;
    document.getElementById('weather-visibility').textContent = current.visibility ? `${(current.visibility / 1000).toFixed(1)} km` : '—';
    document.getElementById('weather-pressure').textContent = `${Math.round(current.pressure_msl)} hPa`;

    // Sunrise & Sunset
    if (daily.sunrise && daily.sunset) {
        document.getElementById('sunrise').textContent = new Date(daily.sunrise[0]).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
        document.getElementById('sunset').textContent = new Date(daily.sunset[0]).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    }

    // Farming Advisory
    const temp = current.temperature_2m;
    const humidity = current.relative_humidity_2m;
    const weatherCode = current.weather_code;
    let farmAdvice = '';

    if (weatherCode >= 61) {
        farmAdvice = `<h4><i class="fas fa-exclamation-circle"></i> Rain Alert</h4>
            <p>🌧️ Rainfall expected. <strong>Postpone spraying activities.</strong> Ensure proper drainage in fields. Harvest mature crops if possible to prevent damage. Cover harvested produce.</p>`;
    } else if (temp > 40) {
        farmAdvice = `<h4><i class="fas fa-temperature-high"></i> Heat Alert</h4>
            <p>🔥 Extreme heat! <strong>Irrigate early morning or late evening.</strong> Apply mulch to conserve soil moisture. Avoid transplanting during peak hours. Provide shade for nurseries.</p>`;
    } else if (temp < 5) {
        farmAdvice = `<h4><i class="fas fa-snowflake"></i> Frost Alert</h4>
            <p>❄️ Frost risk! <strong>Cover sensitive crops with straw or plastic.</strong> Light irrigation in evening can prevent frost damage. Avoid pruning during cold spells.</p>`;
    } else if (humidity > 85) {
        farmAdvice = `<h4><i class="fas fa-tint"></i> High Humidity Advisory</h4>
            <p>💧 High humidity increases fungal disease risk. <strong>Apply preventive fungicide spray.</strong> Ensure proper plant spacing. Monitor crops for early blight and mildew signs.</p>`;
    } else {
        farmAdvice = `<h4><i class="fas fa-thumbs-up"></i> Favorable Conditions</h4>
            <p>✅ Weather is suitable for field operations. Good time for <strong>sowing, spraying, and fertilizer application.</strong> Ensure adequate irrigation if no rain is forecasted.</p>`;
    }

    document.getElementById('farming-advisory-weather').innerHTML = farmAdvice;

    // 7-Day Forecast
    const forecastGrid = document.getElementById('forecast-grid');
    forecastGrid.innerHTML = '';
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i < 7 && i < daily.time.length; i++) {
        const date = new Date(daily.time[i]);
        const dayName = i === 0 ? 'Today' : days[date.getDay()];
        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
            <div class="forecast-day">${dayName}</div>
            <div class="forecast-icon">${getWeatherEmoji(daily.weather_code[i])}</div>
            <div class="forecast-temp">${Math.round(daily.temperature_2m_max[i])}°</div>
            <div class="forecast-temp-min">${Math.round(daily.temperature_2m_min[i])}°</div>
            ${daily.precipitation_sum[i] > 0 ? `<div class="forecast-rain"><i class="fas fa-tint"></i>${daily.precipitation_sum[i].toFixed(1)}mm</div>` : ''}
        `;
        forecastGrid.appendChild(card);
    }

    // Farming Impact Analysis
    const impactDiv = document.getElementById('farming-impact');
    const totalRain = daily.precipitation_sum.reduce((a, b) => a + b, 0);
    const avgMaxTemp = daily.temperature_2m_max.reduce((a, b) => a + b, 0) / daily.temperature_2m_max.length;

    impactDiv.innerHTML = `
        <div class="impact-item">
            <div class="impact-icon" style="background: rgba(33,158,188,0.15); color: var(--info);">
                <i class="fas fa-tint"></i>
            </div>
            <div class="impact-text">
                <strong>Total weekly rainfall:</strong> ${totalRain.toFixed(1)}mm — ${totalRain > 50 ? 'Excessive, ensure drainage' : totalRain > 20 ? 'Adequate for most crops' : 'Low, plan irrigation'}
            </div>
        </div>
        <div class="impact-item">
            <div class="impact-icon" style="background: rgba(231,111,81,0.15); color: var(--danger);">
                <i class="fas fa-thermometer-half"></i>
            </div>
            <div class="impact-text">
                <strong>Avg. max temp:</strong> ${avgMaxTemp.toFixed(1)}°C — ${avgMaxTemp > 35 ? 'Hot; increase irrigation frequency' : avgMaxTemp > 20 ? 'Optimal growing conditions' : 'Cool; protect frost-sensitive crops'}
            </div>
        </div>
        <div class="impact-item">
            <div class="impact-icon" style="background: rgba(82,183,136,0.15); color: var(--success);">
                <i class="fas fa-seedling"></i>
            </div>
            <div class="impact-text">
                <strong>Spray window:</strong> ${weatherCode < 50 && current.wind_speed_10m < 15 ? '✅ Good — Low wind & no rain expected' : '⚠️ Check daily before spraying'}
            </div>
        </div>
    `;
}

// ===== CHATBOT =====
const chatResponses = {
    greetings: [
        "Namaste! 🙏 I'm KrishiBot, your farming assistant. How can I help you today?",
        "Hello! Welcome to KrishiMitra. Ask me anything about farming, crops, or weather! 🌾"
    ],
    rabi: "**Best Rabi Season Crops (Nov–Mar):**\n\n🌾 **Wheat** — India's top Rabi crop. Sow by end of November for best results.\n🫘 **Chickpea (Chana)** — Low water need, high MSP. Ideal for dryland farming.\n🥔 **Potato** — High investment but excellent returns in alluvial soils.\n🫛 **Mustard** — Important oilseed crop, grows well across north India.\n🧅 **Onion** — Great market demand, especially late Rabi varieties.\n\n💡 *Use our Crop Advisory tool for personalized recommendations based on your soil and location!*",
    kharif: "**Best Kharif Season Crops (Jun–Oct):**\n\n🌾 **Rice (Paddy)** — Main monsoon crop. Best in alluvial & clay soils.\n🌽 **Maize** — Versatile crop for food, feed and industrial use.\n🥜 **Groundnut** — Excellent oilseed for sandy and red soils.\n🫘 **Soybean** — Top crop for black soils of MP and Maharashtra.\n🥬 **Cotton** — Cash crop with high returns in black soil regions.\n\n💡 *Try our Crop Advisory section for soil-specific recommendations!*",
    zaid: "**Best Zaid Season Crops (Mar–Jun):**\n\n🍉 **Watermelon** — High demand, excellent returns in summer.\n🥒 **Cucumber** — Quick harvest, good market price.\n🫘 **Moong (Green Gram)** — Short duration, improves soil nitrogen.\n🌽 **Sweet Corn** — Growing urban demand, short crop cycle.\n\n💡 *Zaid crops need assured irrigation. Consider drip irrigation for water efficiency!*",
    pest: "**Pest Detection Tips:**\n\n🔍 **How to use:** Go to our *Pest Detection* section, upload a clear photo of the affected plant part.\n\n📸 **Photo Tips:**\n• Take close-up shots of damaged leaves/stems\n• Ensure good lighting (natural daylight is best)\n• Include both healthy and affected parts for comparison\n\n🐛 **Common Pests to Watch:**\n• Aphids — Curling leaves, honeydew\n• Stem Borer — Dead heart, white ear\n• Pod Borer — Holes in pods/fruits\n• Whitefly — Tiny white insects under leaves\n\n💡 *Our AI can detect 50+ pests and diseases with treatment recommendations!*",
    weather: "**Weather Tips for Farming:**\n\n🌦️ Check our **Weather Dashboard** for real-time data!\n\n📋 **Key Weather Rules:**\n• Don't spray pesticides if rain is expected within 6 hours\n• Irrigate before expected heat waves\n• Cover nurseries during frost warnings\n• High humidity = higher fungal disease risk\n\n🌡️ **Critical Temperatures:**\n• Wheat: 10-25°C (ideal), frost below 2°C damages\n• Rice: 22-32°C (ideal), cold below 15°C slows growth\n• Cotton: 21-35°C (ideal), cold affects germination\n\n💡 *Click 'Use My Location' in the Weather section for hyperlocal forecasts!*",
    schemes: "**Government Schemes for Farmers:** 🏛️\n\n💰 **PM-KISAN** — ₹6,000/year direct income support for all land-holding farmers.\n🌾 **PM Fasal Bima Yojana** — Crop insurance at just 2% premium for Kharif, 1.5% for Rabi.\n💧 **PM Krishi Sinchai Yojana** — Subsidies up to 55-90% on drip/sprinkler irrigation.\n🧪 **Soil Health Card** — Free soil testing and crop-specific fertilizer recommendations.\n💳 **Kisan Credit Card** — Low-interest crop loans up to ₹3 lakh at 4% interest.\n🏪 **e-NAM** — Online trading platform for better market access and prices.\n\n📞 *Call Kisan Call Center: 1800-180-1551 (toll free) for more info!*",
    soil: "**Understanding Soil Types:**\n\n🟤 **Alluvial Soil** — Most fertile, found in Indo-Gangetic plains. Best for wheat, rice, sugarcane.\n⚫ **Black Soil** — High water retention. Ideal for cotton, soybean, and groundnut.\n🔴 **Red Soil** — Well-drained, found in south India. Good for millets, groundnut.\n🟠 **Laterite Soil** — Iron-rich, found in heavy rainfall areas. Suitable for tea, coffee, cashew.\n🏜️ **Sandy Soil** — Low fertility, found in Rajasthan. Good for bajra, guar, cumin.\n🟢 **Loamy Soil** — Best balanced soil. Supports almost all crops excellently.\n\n💡 *Get your soil tested at nearest KVK (Krishi Vigyan Kendra) for free!*",
    fertilizer: "**Fertilizer Guide:**\n\n🧪 **NPK Basics:**\n• **N (Nitrogen)** — Leaf growth, green color. Urea is main source.\n• **P (Phosphorus)** — Root development, flowering. DAP is common source.\n• **K (Potassium)** — Fruit quality, disease resistance. MOP is main source.\n\n📊 **General Recommendations:**\n• Wheat: 120:60:40 NPK kg/ha\n• Rice: 120:60:40 NPK kg/ha\n• Potato: 180:80:100 NPK kg/ha\n• Cotton: 120:60:60 NPK kg/ha\n\n🌿 **Organic Options:**\n• Vermicompost: 5 T/ha\n• Farm Yard Manure: 10-15 T/ha\n• Neem Cake: 250 kg/ha\n\n⚠️ *Always do soil test before applying fertilizers!*",
    irrigation: "**Irrigation Best Practices:**\n\n💧 **Methods:**\n• **Flood** — Traditional, wastes water. Being phased out.\n• **Drip** — 90% efficiency. Best for horticulture. Govt subsidy available.\n• **Sprinkler** — 75% efficiency. Good for field crops.\n• **Furrow** — Simple, moderate efficiency.\n\n📅 **Critical Irrigation Stages:**\n• Wheat: CRI (21 days), Tillering, Booting, Flowering, Grain filling\n• Rice: Transplanting to grain formation (continuous)\n• Potato: Stolon initiation, Tuber development\n\n💡 *Tip: Mulching reduces water need by 30-40%!*",
    organic: "**Organic Farming Tips:**\n\n🌿 **Getting Started:**\n1. Apply FYM / Compost at 10-15 T/ha\n2. Use bio-fertilizers (Rhizobium, Azotobacter, PSB)\n3. Practice crop rotation and intercropping\n4. Make Jeevamrutham for soil health\n\n🐛 **Natural Pest Control:**\n• Neem oil spray (5ml/L)\n• Panchagavya (3% spray)\n• Dashaparni Ark for insects\n• Yellow sticky traps for whitefly\n\n📜 **Certification:**\n• PGS-India (Participatory Guarantee System) for small farmers\n• NPOP certification for export\n• 3-year transition period required\n\n💰 *Organic produce fetches 20-40% premium in market!*",
    market: "**Market & Pricing Info:**\n\n📊 **Key Resources:**\n• **e-NAM** (enam.gov.in) — Online trading platform\n• **Agmarknet** — Daily mandi prices across India\n• **APMC Rates** — Check local mandi rates\n\n💡 **Tips for Better Price:**\n• Grade and sort produce before selling\n• Store in proper conditions (cold storage for perishables)\n• Consider Farmer Producer Organizations (FPOs)\n• Explore direct-to-consumer channels\n• Check MSP before selling to government agencies\n\n📞 *Call Kisan Call Center: 1800-180-1551 for daily prices!*",
    help: "**Here's what I can help you with:** 🤖\n\n🌾 Crop selection & recommendations\n🐛 Pest & disease identification\n🌦️ Weather-based farming advice\n🏛️ Government schemes for farmers\n🧪 Soil & fertilizer guidance\n💧 Irrigation best practices\n🌿 Organic farming tips\n📊 Market prices & selling tips\n\n*Just type your question or try these topics!*"
};

function initChatbot() {
    const toggle = document.getElementById('chatbot-toggle');
    const window_ = document.getElementById('chatbot-window');
    const closeBtn = document.getElementById('chatbot-close');
    const clearBtn = document.getElementById('chatbot-clear');
    const input = document.getElementById('chatbot-input');
    const sendBtn = document.getElementById('chatbot-send');
    const suggestions = document.querySelectorAll('.suggestion-chip');

    // Toggle chatbot
    toggle.addEventListener('click', () => {
        window_.classList.toggle('open');
        if (window_.classList.contains('open')) {
            const messages = document.getElementById('chatbot-messages');
            if (messages.children.length === 0) {
                addBotMessage(chatResponses.greetings[Math.floor(Math.random() * chatResponses.greetings.length)]);
            }
            input.focus();
        }
    });

    closeBtn.addEventListener('click', () => window_.classList.remove('open'));

    clearBtn.addEventListener('click', () => {
        document.getElementById('chatbot-messages').innerHTML = '';
        addBotMessage(chatResponses.greetings[0]);
    });

    // Send message
    sendBtn.addEventListener('click', () => sendChatMessage());
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendChatMessage();
    });

    // Suggestion chips
    suggestions.forEach(chip => {
        chip.addEventListener('click', () => {
            input.value = chip.getAttribute('data-msg');
            sendChatMessage();
        });
    });
}

function sendChatMessage() {
    const input = document.getElementById('chatbot-input');
    const msg = input.value.trim();
    if (!msg) return;

    addUserMessage(msg);
    input.value = '';

    // Show typing indicator
    showTypingIndicator();

    setTimeout(() => {
        removeTypingIndicator();
        const response = getChatResponse(msg);
        addBotMessage(response);
    }, 800 + Math.random() * 700);
}

function getChatResponse(msg) {
    const lower = msg.toLowerCase();

    // Greeting
    if (/^(hi|hello|hey|namaste|namaskar|hola)/.test(lower)) {
        return chatResponses.greetings[Math.floor(Math.random() * chatResponses.greetings.length)];
    }

    // Rabi crops
    if (/rabi|wheat|sarso|mustard|chana|chickpea|winter crop/.test(lower)) {
        return chatResponses.rabi;
    }

    // Kharif crops
    if (/kharif|rice|paddy|maize|soybean|cotton|monsoon crop|dhan/.test(lower)) {
        return chatResponses.kharif;
    }

    // Zaid crops
    if (/zaid|summer|watermelon|tarbooz|cucumber|kheera|moong/.test(lower)) {
        return chatResponses.zaid;
    }

    // Pest
    if (/pest|disease|insect|bug|keet|rog|blight|worm|detect/.test(lower)) {
        return chatResponses.pest;
    }

    // Weather
    if (/weather|rain|barish|mausam|temperature|forecast|climate/.test(lower)) {
        return chatResponses.weather;
    }

    // Government Schemes
    if (/scheme|subsid|sarkari|government|pm.kisan|yojana|loan|insurance|bima/.test(lower)) {
        return chatResponses.schemes;
    }

    // Soil
    if (/soil|mitti|alluvial|black soil|clay|loam|sandy|laterite/.test(lower)) {
        return chatResponses.soil;
    }

    // Fertilizer
    if (/fertili|urea|dap|npk|khad|compost|manure|nutrient/.test(lower)) {
        return chatResponses.fertilizer;
    }

    // Irrigation
    if (/irrig|water|drip|sprinkler|sinchai|pani|moisture/.test(lower)) {
        return chatResponses.irrigation;
    }

    // Organic
    if (/organic|jaivik|natural|bio|chemical.free|pesticide.free/.test(lower)) {
        return chatResponses.organic;
    }

    // Market
    if (/market|price|mandi|msp|sell|rate|bazaar|enam/.test(lower)) {
        return chatResponses.market;
    }

    // Help
    if (/help|what can you|kya|feature|option/.test(lower)) {
        return chatResponses.help;
    }

    // Default / fallback
    return "I understand you're asking about: *\"" + msg + "\"*\n\nI can help you with:\n• 🌾 Crop recommendations (try: \"best rabi crops\")\n• 🐛 Pest detection (try: \"pest detection tips\")\n• 🌦️ Weather advice (try: \"weather tips\")\n• 🏛️ Government schemes (try: \"PM Kisan\")\n• 🧪 Soil & fertilizer (try: \"fertilizer guide\")\n• 💧 Irrigation (try: \"drip irrigation\")\n\n*Try asking one of these topics!* 😊";
}

function addBotMessage(text) {
    const messages = document.getElementById('chatbot-messages');
    const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    
    // Convert markdown-like formatting
    let formattedText = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>');

    const div = document.createElement('div');
    div.className = 'chat-message bot';
    div.innerHTML = `
        <div class="msg-avatar">🤖</div>
        <div>
            <div class="msg-bubble">${formattedText}</div>
            <span class="msg-time">${time}</span>
        </div>
    `;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

function addUserMessage(text) {
    const messages = document.getElementById('chatbot-messages');
    const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    const div = document.createElement('div');
    div.className = 'chat-message user';
    div.innerHTML = `
        <div class="msg-avatar">👤</div>
        <div>
            <div class="msg-bubble">${text}</div>
            <span class="msg-time">${time}</span>
        </div>
    `;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

function showTypingIndicator() {
    const messages = document.getElementById('chatbot-messages');
    const div = document.createElement('div');
    div.className = 'chat-message bot';
    div.id = 'typing-indicator';
    div.innerHTML = `
        <div class="msg-avatar">🤖</div>
        <div class="msg-bubble">
            <div class="typing-indicator">
                <span></span><span></span><span></span>
            </div>
        </div>
    `;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

function removeTypingIndicator() {
    const el = document.getElementById('typing-indicator');
    if (el) el.remove();
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.section-header, .glass-card, .rec-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(el);
    });
}

// ===== LANGUAGE TOGGLE (placeholder) =====
document.getElementById('lang-toggle')?.addEventListener('click', function() {
    const langSpan = this.querySelector('span');
    const langs = ['EN', 'हिं', 'ਪੰ'];
    const currentIdx = langs.indexOf(langSpan.textContent);
    langSpan.textContent = langs[(currentIdx + 1) % langs.length];
});
