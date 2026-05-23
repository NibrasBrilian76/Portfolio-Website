document.addEventListener("DOMContentLoaded", function(){

    // Animasi card masuk dari bawah
    gsap.from(".card", {
        duration: 0.8,
        y: 60,
        opacity: 0,
        ease: "power3.out",
        delay: 0.2
    });

    // Animasi tombol
    gsap.from("button", {
    duration: 0.5,
    scale: 0.9,
    opacity: 0,
    ease: "back.out(1.7)",
    stagger: 0.05,
    delay: 0.5,
    clearProps: "scale,opacity"
});

    // Animasi input
    gsap.from("input, textarea", {
        duration: 0.5,
        x: -20,
        opacity: 0,
        ease: "power2.out",
        stagger: 0.08,
        delay: 0.4
    });

    // Animasi judul
    gsap.from("h1", {
        duration: 0.8,
        y: -30,
        opacity: 0,
        ease: "power3.out",
        delay: 0.1
    });

    // Hover effect pada card
    document.querySelectorAll(".card, .projectCard, .featureCard, .postCard").forEach(card => {
        card.addEventListener("mouseenter", () => {
            gsap.to(card, { duration: 0.3, y: -5, scale: 1.01, ease: "power2.out" });
        });
        card.addEventListener("mouseleave", () => {
            gsap.to(card, { duration: 0.3, y: 0, scale: 1, ease: "power2.out" });
        });
    });

    // Hover effect pada tombol navbar sidebar
    document.querySelectorAll(".sidebarItem").forEach(item => {
        item.addEventListener("mouseenter", () => {
            gsap.to(item, { duration: 0.2, x: -8, ease: "power2.out" });
        });
        item.addEventListener("mouseleave", () => {
            gsap.to(item, { duration: 0.2, x: 0, ease: "power2.out" });
        });
    });

});