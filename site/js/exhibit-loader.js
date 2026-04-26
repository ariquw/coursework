class ExhibitLoader {
    constructor() {
        this.slug = new URLSearchParams(window.location.search).get('item');
        this.init();
    }

    async init() {
        if (!this.slug) {
            await this.loadRandomSlug();
        }
        await this.loadData();
        this.setupRandomLink();
    }

    async loadRandomSlug() {
        try {
            const res = await fetch('/api/random');
            const data = await res.json();
            this.slug = data.slug;
        } catch (error) {
            console.error('Ошибка загрузки случайного:', error);
            this.slug = 'vinyl-player'; 
        }
    }

    async loadData() {
        try {
            const response = await fetch(`/api/exhibit/${this.slug}`);
            const data = await response.json();
            
            document.title = `Музей одной вещи | ${data.name}`;
            document.getElementById('title').textContent = data.name;
            document.getElementById('intro').textContent = data.intro;
            
            this.renderSections(data.sections);
            this.createNavigation(data.sections);
        } catch (error) {
            console.error('Ошибка загрузки:', error);
        }
    }

    renderSections(sections) {
        const container = document.getElementById('sections-container');
        container.innerHTML = '';
        
        sections.forEach(section => {
            const hasImage = section.image_url && section.image_url.trim() !== '';
            const paragraphs = section.content ? section.content.split('\n\n').filter(p => p.trim()) : [];
            
            if (section.section_type === 'facts') {
                const facts = section.content
                    .split('\n')
                    .filter(f => f.trim())
                    .map(f => f.replace(/^[•\-●]\s*/, '').trim());
                
                const factsHtml = facts.map((fact, i) => `
                    <div class="fact-card">
                        <span class="fact-number">${String(i + 1).padStart(2, '0')}</span>
                        <p>${fact}</p>
                    </div>
                `).join('');
                
                container.innerHTML += `
                    <section id="facts" class="exhibit-section">
                        <h2 class="section-title">${section.title}</h2>
                        <div class="facts-grid">${factsHtml}</div>
                    </section>
                `;
                return;
            }
            
            if (section.section_type === 'device') {
                const allParas = paragraphs.map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
                
                container.innerHTML += `
                    <section id="device" class="exhibit-section with-blur">
                        <div class="section-blur-circle right"></div>
                        <h2 class="section-title">${section.title}</h2>
                        <div class="section-content full-text">
                            <div class="text-block">${allParas}</div>
                            ${this.renderGallery(section)}
                        </div>
                    </section>
                `;
                return;
            }
            
            if (hasImage && paragraphs.length >= 1) {
                const firstPara = paragraphs[0].replace(/\n/g, '<br>');
                const remainingParas = paragraphs.slice(1).map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
                
                container.innerHTML += `
                    <section id="${section.section_type}" class="exhibit-section">
                        <h2 class="section-title">${section.title}</h2>
                        <div class="section-content with-image">
                            <div class="text-with-image">
                                <p class="first-para">${firstPara}</p>
                                <div class="image-wrapper">
                                    <div class="circle-behind"></div>
                                    <img class="section-image" src="${section.image_url}" alt="${section.title}" loading="lazy">
                                </div>
                            </div>
                            <div class="remaining-text">${remainingParas}</div>
                            ${this.renderGallery(section)}
                        </div>
                    </section>
                `;
                return;
            }
            
            const allParas = paragraphs.map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
            container.innerHTML += `
                <section id="${section.section_type}" class="exhibit-section">
                    <h2 class="section-title">${section.title}</h2>
                    <div class="section-content full-text">
                        <div class="text-block">${allParas}</div>
                        ${this.renderGallery(section)}
                    </div>
                </section>
            `;
        });
    }

    renderGallery(section) {
        if (!section.gallery || section.gallery.length === 0) return '';
        
        const galleryHtml = section.gallery.map(item => `
            <div class="gallery-item">
                <img src="${item.image_url}" alt="${item.caption || ''}" loading="lazy">
                ${item.caption ? `<div class="caption">${item.caption}</div>` : ''}
            </div>
        `).join('');
        
        return `<div class="section-gallery">${galleryHtml}</div>`;
    }

    createNavigation(sections) {
        const nav = document.getElementById('section-nav');
        nav.innerHTML = '';
        
        sections.forEach(section => {
            const link = document.createElement('a');
            link.href = `#${section.section_type}`;
            link.textContent = section.title;
            link.addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById(section.section_type).scrollIntoView({ behavior: 'smooth' });
            });
            nav.appendChild(link);
        });
    }

    setupRandomLink() {
        const link = document.getElementById('random-link');
        if (link) {
            link.addEventListener('click', async (e) => {
                e.preventDefault();
                const res = await fetch('/api/random');
                const data = await res.json();
                window.location.href = `exhibit.html?item=${data.slug}`;
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => new ExhibitLoader());