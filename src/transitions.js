document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("page-in");

    document.querySelectorAll("a").forEach(link => {
        const href = link.getAttribute("href");

        if (!href || href.startsWith("http") || href.startsWith("#")) return;

        link.addEventListener("click", (e) => {
            e.preventDefault();

            document.body.classList.add("page-out");

            setTimeout(() => {
                window.location.href = href;
            }, 220);
        });
    });
});