
        /* ==========================================================
           SCROLLSPY — navbar active state follows viewport section
           ========================================================== */
        (function initScrollSpy() {
            const allLinks = document.querySelectorAll('.nav-link');
            const sectionIds = ['home', 'services', 'about', 'work', 'why-us', 'testimonials', 'faq'];
            const sections = sectionIds
                .map(id => document.getElementById(id))
                .filter(Boolean)
                .sort((a, b) => a.offsetTop - b.offsetTop);

            const HEADER_OFFSET = 90;
            let ticking = false;

            function setActive(id) {
                allLinks.forEach(link => {
                    link.classList.toggle('active', link.dataset.section === id);
                });
            }

            function updateActive() {
                const scrollPos = window.scrollY + HEADER_OFFSET;
                let current = sections[0];

                for (const section of sections) {
                    if (section.offsetTop <= scrollPos) current = section;
                    else break;
                }

                // If at bottom of page, force last section active
                const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
                if (atBottom && sections.length) current = sections[sections.length - 1];

                setActive(current ? current.id : 'home');
                ticking = false;
            }

            window.addEventListener('scroll', () => {
                if (!ticking) {
                    window.requestAnimationFrame(updateActive);
                    ticking = true;
                }
            }, { passive: true });
            window.addEventListener('resize', updateActive, { passive: true });
            window.addEventListener('load', updateActive);
            updateActive();
        })();

        /* ==========================================================
           MOBILE MENU
           ========================================================== */
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileMenu = document.getElementById('mobileMenu');

        function setMobileMenu(open) {
            mobileMenu.classList.toggle('hidden', !open);
            mobileMenuBtn.setAttribute('aria-expanded', String(open));
            mobileMenuBtn.innerHTML = open
                ? '<i class="fa-solid fa-xmark text-lg" aria-hidden="true"></i>'
                : '<i class="fa-solid fa-bars text-lg" aria-hidden="true"></i>';
        }

        mobileMenuBtn.addEventListener('click', () => {
            setMobileMenu(mobileMenu.classList.contains('hidden'));
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => setMobileMenu(false));
        });

        document.addEventListener('click', (e) => {
            if (!mobileMenu.classList.contains('hidden') &&
                !mobileMenu.contains(e.target) &&
                !mobileMenuBtn.contains(e.target)) {
                setMobileMenu(false);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
                setMobileMenu(false);
                mobileMenuBtn.focus();
            }
        });

        /* ==========================================================
           FORM
           ========================================================== */
        function handleFormSubmit(e) {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            // TODO: POST to backend / API endpoint
            console.log('Enquiry submitted:', data);
            const banner = document.getElementById('formSuccessBanner');
            banner.classList.remove('hidden');
            e.target.reset();
            setTimeout(() => banner.classList.add('hidden'), 6000);
        }

        /* ==========================================================
           MODAL
           ========================================================== */
        const modal = document.getElementById('customModal');
        const modalContent = document.getElementById('modalContent');
        const focusableSelectors = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
        let lastFocusedElement = null;

        function openModalWithContent(html) {
            lastFocusedElement = document.activeElement;
            modalContent.innerHTML = html;
            modal.classList.remove('hidden');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            setTimeout(() => {
                const closeBtn = modal.querySelector('button[aria-label="Close modal"]');
                (closeBtn || modal).focus();
            }, 20);
        }

        function closeModal() {
            modal.classList.add('hidden');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
                lastFocusedElement.focus();
            }
        }

        function trapFocus(e) {
            if (e.key !== 'Tab') return;
            const focusable = modal.querySelectorAll(focusableSelectors);
            if (!focusable.length) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }

        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                closeModal();
                return;
            }
            trapFocus(e);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        /* ==========================================================
           STORY
           ========================================================== */
        function openStoryModal() {
            openModalWithContent(`
                <div class="space-y-4">
                    <div class="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-widest text-brand-blue">
                        <i class="fa-solid fa-circle-play" aria-hidden="true"></i> ZEROSEVEN STORY (2 MIN)
                    </div>
                    <h3 id="modalTitle" class="font-impact text-3xl text-brand-navy">WE DON'T DO BORING.</h3>
                    <div class="rounded-2xl overflow-hidden bg-brand-navy relative h-56 flex items-center justify-center">
                        <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" alt="" width="800" height="450" loading="lazy" decoding="async" class="w-full h-full object-cover opacity-50 grayscale">
                        <div class="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center">
                            <div class="w-14 h-14 rounded-full bg-brand-blue flex items-center justify-center shadow-blue-glow mb-2" aria-hidden="true">
                                <i class="fa-solid fa-volume-high text-xl"></i>
                            </div>
                            <p class="text-xs font-bold uppercase tracking-wider">ZeroSeven Agency Showreel 2024</p>
                            <p class="text-[11px] text-blue-200 mt-1">7 Driven Specialists • 50+ Ambitious Brands • 3.8x Avg Growth</p>
                        </div>
                    </div>
                    <p class="text-xs text-slate-600 leading-relaxed">
                        Founded in Ahmedabad, Gujarat — ZeroSeven DigiMark combines high-impact creative direction with ruthless performance marketing to scale modern brands.
                    </p>
                </div>
            `);
        }

        /* ==========================================================
           CASE STUDIES
           ========================================================== */
        function openCaseStudy(brandKey) {
            const studies = {
                fyndora: {
                    num: '01',
                    title: 'Fyndora — Gen Z Beauty Rebrand & Scale',
                    metric: '+320% Revenue Growth',
                    summary: 'We repositioned Fyndora with bold visual identity, viral short-form creator reels, and full-funnel Meta + Google Shopping campaigns, scaling monthly revenue 4.2x in 5 months.'
                },
                voltix: {
                    num: '02',
                    title: 'Voltix — National Fitness Franchise Campaign',
                    metric: '4.6x Return on Ad Spend',
                    summary: 'Built the "Discipline Builds Freedom" campaign across Instagram, YouTube Shorts, and hyper-local lead generation funnels, driving 18,000+ qualified gym membership trials.'
                },
                nexora: {
                    num: '03',
                    title: 'Nexora — B2B SaaS Product Launch',
                    metric: '+280% Qualified Pipeline Leads',
                    summary: 'Redesigned Nexora\'s conversion web experience, launched high-intent search & LinkedIn demand-gen ads, reducing cost-per-demo by 44%.'
                },
                all: {
                    num: '07',
                    title: '50+ Bold Brands Scaled Across India & Global',
                    metric: '3.8x Average Client Growth',
                    summary: 'From D2C beauty & skincare (Lumea, Blushh) to SaaS & Real Estate (Nexora, Zentra), our team crafts tailored growth engines.'
                }
            };
            const data = studies[brandKey] || studies.all;
            openModalWithContent(`
                <div class="space-y-4">
                    <span class="font-impact text-3xl text-brand-blue">${data.num}</span>
                    <h3 id="modalTitle" class="text-xl font-extrabold text-brand-navy">${data.title}</h3>
                    <div class="inline-block bg-brand-lightBlue text-brand-blue font-extrabold text-sm px-4 py-2 rounded-xl">
                        ${data.metric}
                    </div>
                    <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">${data.summary}</p>
                    <div class="pt-2">
                        <a href="#contact" onclick="closeModal()" class="inline-flex items-center gap-2 bg-brand-blue text-white text-xs font-bold px-6 py-3 rounded-full shadow-blue-glow">
                            <span>Build Similar Results For Your Brand</span>
                            <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
                        </a>
                    </div>
                </div>
            `);
        }

        /* ==========================================================
           SERVICES
           ========================================================== */
        const services = {
            social: {
                num: '01',
                name: 'Social Media',
                formValue: 'Social Media',
                icon: 'fa-brands fa-instagram',
                tagline: 'Scroll-stopping content and strategies that build real connections.',
                impact: '+87% Avg. Engagement Growth',
                description: 'We turn passive scrollers into loyal brand advocates. Our social team handles everything from viral short-form Reels & TikToks to community management and creator collaborations.',
                deliverables: [
                    'Monthly Content Calendar & Trend Jacking',
                    'High-Retention Reels, Shorts & Carousel Design',
                    'Influencer & Creator Partnership Management',
                    'Community Building & Real-Time Analytics'
                ]
            },
            performance: {
                num: '02',
                name: 'Performance Marketing',
                formValue: 'Performance Marketing',
                icon: 'fa-solid fa-bullhorn',
                tagline: 'High-converting ad campaigns that deliver measurable results.',
                impact: '4.8x Average Client ROAS',
                description: 'Every rupee spent is tracked, tested, and optimized for maximum return. We build full-funnel paid acquisition engines across Meta, Google, YouTube, and LinkedIn.',
                deliverables: [
                    'Meta Ads (Instagram & Facebook) Scaling Funnels',
                    'Google Search, Shopping & Performance Max Ads',
                    'High-Converting Ad Creatives & A/B Split Testing',
                    'Live ROAS, CPA & Attribution Dashboards'
                ]
            },
            seo: {
                num: '03',
                name: 'SEO',
                formValue: 'SEO',
                icon: 'fa-solid fa-chart-line',
                tagline: 'Get found, get trusted, get more customers with powerful SEO strategies.',
                impact: '+240% Organic Search Traffic',
                description: 'Dominate page one for the keywords your customers are actively searching. We combine technical precision with high-authority content to build compounding organic traffic.',
                deliverables: [
                    'Comprehensive Technical SEO & Core Web Vitals Audit',
                    'High-Intent Keyword Research & Competitor Gap Analysis',
                    'On-Page Optimization & Topic Cluster Architecture',
                    'High-Authority Digital PR & Backlink Acquisition'
                ]
            },
            branding: {
                num: '04',
                name: 'Branding',
                formValue: 'Branding',
                icon: 'fa-solid fa-palette',
                tagline: 'Memorable brand identities that make you stand out.',
                impact: '100% Custom Visual & Verbal Identity',
                description: 'People don\'t buy products; they buy brands they feel connected to. We craft bold, unmistakable visual identities and brand positioning that refuse to blend in.',
                deliverables: [
                    'Brand Strategy, Positioning & Voice Guidelines',
                    'Logo Suite, Custom Typography & Color Systems',
                    'Packaging Design & Social Brand Kits',
                    'Complete Brand Book for Seamless Scaling'
                ]
            },
            web: {
                num: '05',
                name: 'Web Development',
                formValue: 'Web Development',
                icon: 'fa-solid fa-laptop-code',
                tagline: 'High-performing websites designed to convert.',
                impact: '2.6x Higher Conversion Rate',
                description: 'Your website is your 24/7 salesperson. We design and engineer lightning-fast, mobile-first web experiences and e-commerce stores built specifically to turn visitors into buyers.',
                deliverables: [
                    'Custom UI/UX Wireframing & Interactive Prototypes',
                    'Conversion-Optimized Landing Pages & Corporate Sites',
                    'Shopify, WooCommerce & Custom Web App Development',
                    'Speed Optimization, SEO-Ready Code & Analytics Setup'
                ]
            },
            content: {
                num: '06',
                name: 'Content',
                formValue: 'Content',
                icon: 'fa-solid fa-clapperboard',
                tagline: 'Engaging content that tells your story and drives results.',
                impact: '3.5x Higher Viewer Retention',
                description: 'Great marketing starts with magnetic storytelling. From commercial video shoots and UGC ad scripts to persuasive copywriting, we produce assets that capture attention immediately.',
                deliverables: [
                    'Short-Form Video Production (Reels, UGC & Ad Films)',
                    'Product Photography & Art Direction',
                    'Direct-Response Copywriting for Ads, Emails & Web',
                    'Motion Graphics, 3D Visuals & Brand Storytelling'
                ]
            }
        };

        function openServiceModal(serviceKey) {
            const s = services[serviceKey] || services.social;
            openModalWithContent(`
                <div class="space-y-4">
                    <div class="flex items-center justify-between pr-2">
                        <div class="flex items-center gap-3">
                            <span class="font-impact text-4xl sm:text-5xl text-brand-blue leading-none">${s.num}</span>
                            <div class="w-10 h-10 rounded-2xl bg-brand-lightBlue text-brand-blue flex items-center justify-center text-lg shadow-sm" aria-hidden="true">
                                <i class="${s.icon}"></i>
                            </div>
                        </div>
                        <span class="inline-flex items-center gap-1.5 bg-brand-lightBlue text-brand-blue text-[11px] font-extrabold px-3 py-1.5 rounded-full">
                            <i class="fa-solid fa-bolt text-[10px]" aria-hidden="true"></i> ${s.impact}
                        </span>
                    </div>

                    <div>
                        <h3 id="modalTitle" class="text-xl sm:text-2xl font-extrabold text-brand-navy">${s.name}</h3>
                        <p class="text-xs font-bold text-brand-blue mt-0.5">${s.tagline}</p>
                    </div>

                    <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">${s.description}</p>

                    <div class="bg-[#F5F9FF] rounded-2xl p-4 border border-blue-100/80 space-y-2.5">
                        <div class="text-[11px] font-extrabold uppercase tracking-wider text-brand-navy">What's Included:</div>
                        <ul class="space-y-2">
                            ${s.deliverables.map(item => `
                                <li class="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                                    <span class="w-4 h-4 rounded-full bg-brand-blue text-white flex items-center justify-center text-[9px] mt-0.5 shrink-0" aria-hidden="true">
                                        <i class="fa-solid fa-check"></i>
                                    </span>
                                    <span>${item}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>

                    <div class="pt-2 flex flex-wrap items-center justify-between gap-3">
                        <button type="button" onclick="selectServiceAndScroll('${s.formValue}')" class="flex-1 inline-flex items-center justify-center gap-2 bg-brand-blue hover:bg-brand-darkBlue text-white text-xs sm:text-sm font-bold px-6 py-3.5 rounded-full shadow-blue-glow transition-all">
                            <span>Enquire About ${s.name}</span>
                            <i class="fa-solid fa-arrow-right text-xs" aria-hidden="true"></i>
                        </button>
                        <button type="button" onclick="closeModal()" class="px-5 py-3.5 rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors">
                            Close
                        </button>
                    </div>
                </div>
            `);
        }

        function selectServiceAndScroll(serviceValue) {
            modal.classList.add('hidden');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';

            const selectEl = document.getElementById('serviceSelect');
            if (selectEl && serviceValue) selectEl.value = serviceValue;

            const contactSection = document.getElementById('contact');
            if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });

            setTimeout(() => selectEl && selectEl.focus(), 600);
        }

        /* ==========================================================
           CALL MODAL
           ========================================================== */
        function openCallModal() {
            openModalWithContent(`
                <div class="space-y-4">
                    <div class="w-11 h-11 rounded-2xl bg-brand-lightBlue text-brand-blue flex items-center justify-center text-lg" aria-hidden="true">
                        <i class="fa-regular fa-calendar-check"></i>
                    </div>
                    <h3 id="modalTitle" class="text-xl font-extrabold text-brand-navy">Book a Free 30-Min Growth Audit</h3>
                    <p class="text-xs text-slate-600 leading-relaxed">
                        Pick a preferred slot and our strategy lead will review your current ads, social presence, and conversion funnel live.
                    </p>
                    <div class="grid grid-cols-2 gap-2.5 text-xs font-bold">
                        <button type="button" onclick="closeModal(); document.getElementById('contact').scrollIntoView({behavior:'smooth'});" class="p-3 rounded-xl border border-blue-200 bg-brand-lightBlue/50 hover:bg-brand-blue hover:text-white text-brand-navy transition-colors">
                            Tomorrow • 11:00 AM IST
                        </button>
                        <button type="button" onclick="closeModal(); document.getElementById('contact').scrollIntoView({behavior:'smooth'});" class="p-3 rounded-xl border border-blue-200 bg-brand-lightBlue/50 hover:bg-brand-blue hover:text-white text-brand-navy transition-colors">
                            Tomorrow • 4:00 PM IST
                        </button>
                    </div>
                    <p class="text-[11px] text-slate-500 pt-1">Or WhatsApp us directly: <a href="https://wa.me/918849903090" class="text-brand-blue font-bold" target="_blank" rel="noopener">+91 88499 03090</a></p>
                </div>
            `);
        }

        /* ==========================================================
           FOOTER YEAR
           ========================================================== */
        document.getElementById('copyrightYear').textContent = new Date().getFullYear();