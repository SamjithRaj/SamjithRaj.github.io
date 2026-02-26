document.addEventListener('DOMContentLoaded', () => {

    const phrases = [
        "Backend Systems Engineer.",
        "C++ Performance Builder.",
        "Concurrency & Architecture Focused.",
        "I build things that scale."
    ];

    const typing = document.getElementById("typing-text");

    let phraseIndex = 0;
    let letterIndex = 0;
    let deleting = false;

    function type() {
        const current = phrases[phraseIndex];

        if (!deleting) {
            typing.textContent = current.substring(0, letterIndex + 1);
            letterIndex++;
            if (letterIndex === current.length) {
                setTimeout(() => deleting = true, 1000);
            }
        } else {
            typing.textContent = current.substring(0, letterIndex - 1);
            letterIndex--;
            if (letterIndex === 0) {
                deleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
            }
        }

        setTimeout(type, deleting ? 40 : 70);
    }

    type();

    document.addEventListener("keydown", function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === "S") {
            const terminal = document.getElementById("terminal");
            terminal.style.display =
                terminal.style.display === "block" ? "none" : "block";
        }
    });

});
