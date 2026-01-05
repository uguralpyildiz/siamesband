/* =========================================
   SIAMÉS | ARCADE EXPERIENCE ENGINE
   ========================================= */

// 1. INIT LIBRARIES
// ----------------------------------------------------------------
// Lenis Smooth Scroll Setup
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential Ease Out
    smooth: true,
    direction: 'vertical',
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// GSAP Setup
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);


// 2. PRELOADER LOGIC
// ----------------------------------------------------------------
window.addEventListener("load", () => {
    const tl = gsap.timeline();

    // Barı doldur
    tl.to("#loader-bar", {
        width: "100%",
        duration: 1.5,
        ease: "power2.inOut"
    })
        // Ekranı yukarı kaydır
        .to("#preloader", {
            yPercent: -100,
            duration: 0.8,
            ease: "expo.inOut",
            delay: 0.2
        })
        // Hero animasyonlarını başlat
        .add(() => startHeroAnimations());
});


// 3. CURSOR LOGIC (RETICLE)
// ----------------------------------------------------------------
const cursor = document.querySelector(".cursor-reticle");
const cursorCorners = document.querySelectorAll(".cursor-corner");

// Mouse takibi
document.addEventListener("mousemove", (e) => {
    gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1, // Gecikmeli takip (Smooth)
        ease: "power2.out"
    });
});

// Hover Effect (Tetikleyiciler)
const triggers = document.querySelectorAll(".hover-trigger");
triggers.forEach(el => {
    el.addEventListener("mouseenter", () => document.body.classList.add("hovering"));
    el.addEventListener("mouseleave", () => document.body.classList.remove("hovering"));
});


// 4. HERO SECTION LOGIC
// ----------------------------------------------------------------


// Mouse Parallax (Hero için)
const heroSection = document.querySelector("#hero-section");
const parallaxLayers = document.querySelectorAll(".parallax-layer");

heroSection.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 100;
    const y = (e.clientY / window.innerHeight - 0.5) * 100;

    parallaxLayers.forEach(layer => {
        const speed = layer.getAttribute("data-speed");
        gsap.to(layer, {
            x: x * speed,
            y: y * speed,
            duration: 1,
            ease: "power2.out"
        });
    });
});

// START GAME FUNCTION (Click Event)
window.startGame = function () {
    const startTxt = document.getElementById("start-txt");
    startTxt.innerText = "SCROLL DOWN...";
    startTxt.style.color = "#fff";

    const tl = gsap.timeline();

    tl
        // 1. Video Zoom In (İçine girme hissi)
        .to(".hero-bg-video", {
            scale: 2.5,
            duration: 0.8,
            ease: "power2.in"
        })
        // 2. Beyaz Flash Patlaması
        .to(".flash-overlay", {
            opacity: 1,
            duration: 0.1,
            yoyo: true,
            repeat: 3 // Strobe effect
        })
        // 3. Tünele Kaydır
       
        // 4. Flash Söndür
        .to(".flash-overlay", {
            opacity: 0,
            duration: 0.5
        });
};


// 5. TUNNEL LOGIC (SCROLL TRIGGER)
// ----------------------------------------------------------------
const tunnelTl = gsap.timeline({
    scrollTrigger: {
        trigger: "#tunnel-section",
        start: "top top",
        end: "+=5000", // Scroll mesafesi (Animasyon süresi)
        pin: true,
        scrub: 1,
    }
});

const words = document.querySelectorAll(".tunnel-word");

words.forEach((word, i) => {
    // Her kelime için Timeline
    const wordTl = gsap.timeline();

    wordTl.fromTo(word,
        { scale: 0.2, opacity: 0, filter: "blur(10px)" },
        {
            scale: 1.3,           // Orta boy
            opacity: 1,
            filter: "blur(0px)",
            duration: 1,
            ease: "power1.out"
        }
    )
        .to(word, {
            scale: 15,          // Devasa boy (Kameraya çarpma)
            opacity: 0,
            filter: "blur(20px)",
            duration: 1,
            ease: "expo.in"
        });

    // Ana timeline'a ekle (Stagger ile)
    tunnelTl.add(wordTl, i * 1.5);
});


// 6. ABOUT (SCROLLYTELLING)
// ----------------------------------------------------------------
const storyTl = gsap.timeline({
    scrollTrigger: {
        trigger: "#about-section",
        start: "top top",
        end: "+=2600",
        pin: true,
        scrub: 1
    }
});

const steps = document.querySelectorAll(".story-step");
const images = document.querySelectorAll(".story-img");

steps.forEach((step, i) => {
    // 1. Yazıyı Aktif Et
    storyTl.to(step, { opacity: 1, borderLeftColor: "#FF003C", duration: 0.5 }, i * 2);

    // 2. İlgili Resmi Getir
    if (images[i]) {
        storyTl.to(images[i], { opacity: 1, scale: 1, zIndex: 10 + i, duration: 0.5 }, i * 2);
    }

    // 3. Öncekini Söndür (Son adım hariç)
    if (i < steps.length - 1) {
        storyTl.to(step, { opacity: 0.2, borderLeftColor: "#333", duration: 0.5 }, (i * 2) + 1.5);
        storyTl.to(images[i], { opacity: 0, duration: 0.5 }, (i * 2) + 1.5);
    }
});





// 8. MISSIONS LOG (MAP REVEAL) - FIX
const missionItems = document.querySelectorAll(".mission-item");
const mapImg = document.getElementById("map-reveal");

missionItems.forEach(item => {
    item.addEventListener("mouseenter", (e) => {
        const mapUrl = item.getAttribute("data-map");
        mapImg.src = mapUrl;

        // Görünür yaparken bir miktar başlangıç pozisyonu verelim
        gsap.to(mapImg, {
            opacity: .5,
            scale: 1,
            rotate: 0,
            duration: 0.3
        });
    });

    item.addEventListener("mousemove", (e) => {
        // e.clientX ve clientY ekranın o anki görünür alanındaki koordinatlardır
        // Resmi mouse imlecinin biraz sağında ve altında tutalım
        gsap.to(mapImg, {
            x: e.clientX + 15, // Sağa 15px kaydır
            y: e.clientY + 15, // Aşağı 15px kaydır
            duration: 0.15,    // Takip hızı (ne kadar düşükse o kadar yapışık gider)
            ease: "none"       // Daha keskin takip için "none" veya "power1.out"
        });
    });

    item.addEventListener("mouseleave", () => {
        gsap.to(mapImg, {
            opacity: 0,
            scale: 0.9,
            rotate: 5,
            duration: 0.3
        });
    });
});


// 9. DISCOGRAPHY (HORIZONTAL SCROLL)
// ----------------------------------------------------------------
const discoSection = document.getElementById("discography-section");
const discoTrack = document.querySelector(".disco-track");

// Mobilde yatay scroll iptal, dikey olsun. Masaüstünde yatay.
if (window.innerWidth > 768) {
    gsap.to(discoTrack, {
        x: () => -(discoTrack.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
            trigger: discoSection,
            start: "top top",
            end: () => "+=" + discoTrack.scrollWidth,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true
        }
    });
}


// 10. FOOTER MARQUEE
// ----------------------------------------------------------------
gsap.to(".marquee-content", {
    xPercent: -50,
    duration: 20,
    repeat: -1,
    ease: "linear"
}).totalProgress(0.5);


// ... (Önceki kodların devamı) ...

// 11. ARMORY (MERCH) ANIMATIONS
// ----------------------------------------------------------------
gsap.from(".loot-card", {
    scrollTrigger: {
        trigger: "#armory-section",
        start: "top 80%"
    },
    y: 50,
    opacity: 1,
    duration: 0.8,
    stagger: 0.2,
    ease: "power2.out"
});

// 12. ARCHIVES (GALLERY) ANIMATIONS
// ----------------------------------------------------------------
gsap.from(".archive-item", {
    scrollTrigger: {
        trigger: "#archives-section",
        start: "top 80%"
    },
    scale: 0.8,
    opacity: 0,
    duration: 0.5,
    stagger: 0.1,
    ease: "back.out(1.7)"
});



