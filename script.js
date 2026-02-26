document.addEventListener('DOMContentLoaded', () => {

    /* Typing Animation */
    const phrases = [
        "Backend Systems Engineer.",
        "C++ Performance Builder.",
        "Concurrency Enthusiast.",
        "I build things that scale."
    ];

    const typingElement = document.getElementById("typing-text");

    let phraseIndex = 0;
    let letterIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        const currentPhrase = phrases[phraseIndex];

        if (!isDeleting) {
            typingElement.textContent = currentPhrase.substring(0, letterIndex + 1);
            letterIndex++;
            if (letterIndex === currentPhrase.length) {
                setTimeout(() => isDeleting = true, 1000);
            }
        } else {
            typingElement.textContent = currentPhrase.substring(0, letterIndex - 1);
            letterIndex--;
            if (letterIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
            }
        }

        setTimeout(typeEffect, isDeleting ? 40 : 70);
    }

    typeEffect();

    /* Hidden Easter Egg (Press Ctrl + Shift + S) */
    document.addEventListener("keydown", function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === "S") {
            const egg = document.getElementById("easter-egg");
            egg.style.display = egg.style.display === "block" ? "none" : "block";
        }
    });

});
