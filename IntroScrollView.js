
import { navigate } from "./app.js";

export function IntroScrollView(app) {

  app.innerHTML = `

    <div class="intro-scroll-view">

      <div class="intro-screen">

        <div class="intro-content">

          <!-- BLOQUE INICIAL -->
          <div class="intro-hero">

            <h1 class="intro-brand">
              ClubX
            </h1>

            <div class="intro-date">
              Sábado 21/6
            </div>

          </div>

          <!-- BLOQUE SECUNDARIO -->
          <div class="intro-secondary">

            <p class="intro-title">
              Explorá perfiles para <br>
              compartir tu noche
            </p>

            <div class="intro-swipe">
              desliza para empezar
            </div>

          </div>

        </div>

      </div>

    </div>

  `;

  const container =
    document.querySelector(".intro-scroll-view");

  const hero =
    document.querySelector(".intro-hero");

  const secondary =
    document.querySelector(".intro-secondary");

  let finished = false;
  let userStarted = false;

  // =========================
  // 🔥 NAVEGACIÓN FINAL
  // =========================

  function completeIntro() {

    if (finished) return;

    finished = true;

    navigate("welcome");
  }

  // =========================
  // 🔥 TRANSICIÓN FINAL
  // =========================

  function playExitTransition() {

    if (finished) return;

    
    container.animate(
      [
        {
          transform: "translateY(0vh)"
        },

        {
          transform: "translateY(-100vh)"
        }
      ],
      {
        duration: 1200,
        easing: "cubic-bezier(.22,1,.36,1)",
        fill: "forwards"
      }
    );

    setTimeout(() => {

      completeIntro();

    }, 1050);
  }

  // =========================
  // 🔥 DOUBLE TAP
  // =========================

  let lastTap = 0;

  window.addEventListener("touchmove", () => {

    const now = Date.now();

    const tapGap = now - lastTap;

    // 👇 detectar doble tap real
    if (tapGap < 320 && tapGap > 0) {

      if (userStarted) return;

      userStarted = true;

      playExitTransition();
    }

    lastTap = now;

  });

  // =========================
  // 🔥 ANIMACIÓN TEXTOS
  // =========================

  requestAnimationFrame(() => {

    // 🔹 estado inicial
    secondary.style.opacity = "0";

    secondary.style.transform =
      "translateY(24px)";

    // =========================
    // 🔥 HERO DESAPARECE
    // =========================

    setTimeout(() => {

      hero.animate(
        [
          {
            transform:
              "translateY(0px) scale(1)",

            opacity: 1,

            filter: "blur(0px)"
          },

          {
            transform:
              "translateY(-120px) scale(.78)",

            opacity: 0,

            filter: "blur(10px)"
          }
        ],
        {
          duration: 2200,
          easing: "cubic-bezier(.22,1,.36,1)",
          fill: "forwards"
        }
      );

    }, 1700);

    // =========================
    // 🔥 APARECE CONTENIDO
    // =========================

    setTimeout(() => {

      secondary.animate(
        [
          {
            opacity: 0,
            transform: "translateY(24px)"
          },

          {
            opacity: 1,
            transform: "translateY(0px)"
          }
        ],
        {
          duration: 1800,
          easing: "cubic-bezier(.22,1,.36,1)",
          fill: "forwards"
        }
      );

    }, 2600);

    // =========================
    // 🔥 HINT DE SCROLL
    // =========================

    setTimeout(() => {

      if (userStarted) return;

      container.animate(
        [
          {
            transform: "translateY(0vh)"
          },

          {
            transform: "translateY(-18vh)"
          },

          {
            transform: "translateY(-12vh)"
          }
        ],
        {
          duration: 2400,
          easing: "cubic-bezier(.22,1,.36,1)",
          fill: "forwards"
        }
      );

    }, 4200);

    // =========================
    // 🔥 AUTO TRANSICIÓN
    // =========================

    setTimeout(() => {

      if (userStarted) return;

      userStarted = true;

      playExitTransition();

    }, 8000);

  });

}