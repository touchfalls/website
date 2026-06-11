// === НАСТРОЙКИ TELEGRAM-БОТА ===
// 1. Создай бота у @BotFather, получи токен
// 2. Напиши боту /start, потом открой https://api.telegram.org/bot<ТОКЕН>/getUpdates
//    и скопируй свой chat.id
// 3. Вставь значения ниже:
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID   = process.env.TELEGRAM_CHAT_ID;
// ===============================

document.addEventListener("DOMContentLoaded", () => {
    const form    = document.getElementById("invite_form");
    const status  = document.getElementById("form_status");
    const btn     = document.getElementById("submit_btn");

    // копирование IP
    document.querySelectorAll(".copy_btn").forEach(el => {
        el.addEventListener("click", async () => {
            const value = el.dataset.copy;
            try {
                await navigator.clipboard.writeText(value);
                const hint = el.querySelector(".copy_hint");
                const old  = hint.textContent;
                hint.textContent = "copied";
                el.classList.add("copied");
                setTimeout(() => {
                    hint.textContent = old;
                    el.classList.remove("copied");
                }, 1200);
            } catch (_) {}
        });
    });

    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (BOT_TOKEN.startsWith("PASTE_") || CHAT_ID.startsWith("PASTE_")) {
            status.textContent = "форма ещё не настроена — напиши в telegram";
            status.className = "form_status error";
            return;
        }

        const data = new FormData(form);
        const nick  = (data.get("nick")  || "").toString().trim();
        const tg    = (data.get("tg")    || "").toString().trim();
        const age   = (data.get("age")   || "").toString().trim();
        const about = (data.get("about") || "").toString().trim();

        const text =
            "🟢 новая заявка на margoles\n\n" +
            "ник: " + nick + "\n" +
            "tg: " + tg + "\n" +
            "возраст: " + age + "\n" +
            "о себе: " + about;

        btn.disabled = true;
        status.textContent = "отправка...";
        status.className = "form_status";

        try {
            const url = "https://api.telegram.org/bot" + BOT_TOKEN + "/sendMessage";
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: text,
                    disable_web_page_preview: true
                })
            });

            const json = await res.json();
            if (!json.ok) throw new Error(json.description || "ошибка telegram api");

            form.reset();
            status.textContent = "заявка отправлена, ответим в течение суток";
            status.className = "form_status ok";
        } catch (err) {
            status.textContent = "не получилось отправить — напиши в telegram";
            status.className = "form_status error";
            console.error(err);
        } finally {
            btn.disabled = false;
        }
    });
});