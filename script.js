document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Array de Medios
    const mediaItems = [
        { type: 'image', src: 'media/foto1.jpeg' },
        { type: 'image', src: 'media/foto2.jpeg' },
        { type: 'image', src: 'media/foto3.jpeg' },
        { type: 'image', src: 'media/foto4.jpeg' },
        { type: 'image', src: 'media/foto5.jpeg' },
        { type: 'image', src: 'media/foto6.jpeg' },
        { type: 'image', src: 'media/foto7.jpeg' },
        { type: 'image', src: 'media/foto8.jpeg' },
        { type: 'video', src: 'media/video1.mp4' },
        { type: 'video', src: 'media/video2.mp4' },
        { type: 'video', src: 'media/video3.mp4' }
    ];

    // 2. Renderizar Slider
    const sliderTrack = document.getElementById('slider-track');
    if(sliderTrack) {
        mediaItems.forEach(item => {
            const slide = document.createElement('div');
            slide.className = 'slide-item expandable';
            slide.setAttribute('data-type', item.type);
            slide.setAttribute('data-src', item.src);

            const mediaHtml = item.type === 'video' 
                ? `<video muted loop playsinline><source src="${item.src}" type="video/mp4"></video>`
                : `<img src="${item.src}" alt="Work evidence">`;

            slide.innerHTML = `${mediaHtml}<div style="position:absolute;top:10px;right:10px;color:white;opacity:0.5;font-size:0.7rem;"><i class="fa-solid fa-expand"></i></div>`;
            sliderTrack.appendChild(slide);
        });
    }

    // 3. Intersection Observer (Animaciones)
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // 4. Navegación Slider
    const nextBtn = document.getElementById('slide-next');
    const prevBtn = document.getElementById('slide-prev');
    if(nextBtn && prevBtn && sliderTrack) {
        nextBtn.addEventListener('click', () => {
            const width = sliderTrack.querySelector('.slide-item').clientWidth + 15;
            sliderTrack.scrollBy({ left: width, behavior: 'smooth' });
        });
        prevBtn.addEventListener('click', () => {
            const width = sliderTrack.querySelector('.slide-item').clientWidth + 15;
            sliderTrack.scrollBy({ left: -width, behavior: 'smooth' });
        });
    }

    // 5. Lightbox (CORRECCIÓN: Mute permanente forzado por JS)
    const lightbox = document.getElementById('lightbox');
    const lbContent = document.querySelector('.lightbox-content');
    const closeBtn = document.querySelector('.close-lightbox');

    if(sliderTrack) {
        sliderTrack.addEventListener('click', (e) => {
            const item = e.target.closest('.expandable');
            if (!item) return;
            const type = item.getAttribute('data-type');
            const src = item.getAttribute('data-src');

            if (type === 'video') {
                // Inyectamos el video con los atributos estándar
                lbContent.innerHTML = `<video controls autoplay muted playsinline><source src="${src}" type="video/mp4"></video>`;
                const video = lbContent.querySelector('video');
                
                // MUTE FORZADO PERMANENTE:
                // Escuchamos el evento de cambio de volumen para silenciarlo siempre
                video.addEventListener('volumechange', () => {
                    video.muted = true;
                    video.volume = 0;
                });

                // Forzamos la carga visual
                video.load();
            } else {
                lbContent.innerHTML = `<img src="${src}" alt="Work result">`;
            }
            
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    const closeLB = () => {
        if(lightbox) {
            lightbox.classList.remove('active');
            lbContent.innerHTML = '';
            document.body.style.overflow = 'auto';
        }
    };
    if(closeBtn) closeBtn.addEventListener('click', closeLB);
    if(lightbox) lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLB(); });
});