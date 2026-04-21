class ExhibitLoader {
    constructor() {
        this.slug = new URLSearchParams(window.location.search).get('item') || 'vinyl-player';
        this.init();
    }

    async init() {
        await this.loadData();
        this.setupRandomLink();
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
            const paragraphs = section.content.split('\n\n').filter(p => p.trim());
            
            if (hasImage && paragraphs.length >= 1) {
                const firstPara = paragraphs[0].replace(/\n/g, '<br>');
                const remainingParas = paragraphs.slice(1).map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
                
                container.innerHTML += `
                    <section id="${section.section_type}" class="exhibit-section">
                        <h2 class="section-title">${section.title}</h2>
                        <div class="section-content with-image">
                            <div class="text-with-image">
                                <p class="first-para">${firstPara}</p>
                                <img class="section-image" src="${section.image_url}" alt="${section.title}">
                            </div>
                            <div class="remaining-text">
                                ${remainingParas}
                            </div>
                        </div>
                    </section>
                `;
            } else {
                const allParas = paragraphs.map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
                container.innerHTML += `
                    <section id="${section.section_type}" class="exhibit-section">
                        <h2 class="section-title">${section.title}</h2>
                        <div class="section-content full-text">
                            <div class="text-block">
                                ${allParas}
                            </div>
                        </div>
                    </section>
                `;
            }
        });
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