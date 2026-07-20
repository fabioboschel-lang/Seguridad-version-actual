import { navigate } from "./app.js";
import { getCompatiblePosts }
from "./compatiblePosts.js";
import { supabase } from "./supabase.js";

export async function Houseview(app) {

  app.innerHTML = `

    <div class="tickets-view">

      <header class="tickets-header">

        <div class="brand">
          ClubX
        </div>

        <div class="header-actions">

          <button
            id="messagesBtn"
            class="nav-btn">
<svg viewBox="0 0 100 100" class="icon">

  <!-- avioncito estilo Telegram -->
  <path
    d="
      M10 47
      Q10 43 15 41

      L83 13
      Q92 9 90 18

      L78 82
      Q76 91 68 85

      L41 61

      L73 32
      Q76 29 73 28

      L31 55

      L15 50
      Q10 49 10 47
      Z
    "
    fill="white"
  />

</svg>
            
          </button>

          <button
            id="profileBtn"
            class="header-icon"
          >
            👤
          </button>

        </div>

      </header>

      <section class="countdown-section">

        <div class="countdown-label">
          Empieza en
        </div>

        <div id="countdown">
          --d --h --m --s
        </div>

      </section>

      <section
        id="postsSlider"
        class="posts-slider"
      ></section>

<button
  class="ticket-btn"
  id="ticketBtn"
>
  Obtener ticket
</button>

    </div>

  `;
  
  const ticketBtn =
  document.querySelector(
    ".ticket-btn"
  );

const currentUserId =
  localStorage.getItem(
    "user_id"
  );

try {
  
  
const {
  data: ticketData,
  error: ticketError
} = await supabase
  .from("Tickets")
  .select("Estado")
  .eq(
    "User",
    currentUserId
  )
  .single();

if (
  ticketData?.Estado ===
  "activo"
) {

  ticketBtn.textContent =
    "Ver ticket";

}

} catch (err) {

  console.error(
    "Error ticket:",
    err
  );

}

ticketBtn.addEventListener("click", async () => {
  if (ticketBtn.textContent === "Ver ticket") {
    navigate("ticket");
    return;
  }

  try {
    const { data, error } = await supabase.functions.invoke(
      "create-ticket-payment",
      {
        body: {
          user_id: currentUserId
        }
      }
    );

    if (error) {
      throw error;
    }

    if (!data?.init_point) {
      throw new Error("La Edge Function no devolvió un init_point.");
    }

    window.open(data.init_point, "_blank");
  } catch (error) {
    console.error("Error al iniciar el pago:", error);
    alert("Ocurrió un error al iniciar el pago.");
  }
});

  // =====================
  // NAVEGACIÓN
  // =====================

  document
    .getElementById("messagesBtn")
    .addEventListener(
      "click",
      () => navigate("chat")
    );

  document
    .getElementById("profileBtn")
    .addEventListener(
      "click",
      () => navigate("perfil")
    );

  // =====================
  // COUNTDOWN
  // =====================

  try {

    const {
      data: evento,
      error: eventoError
    } = await supabase
      .from("Eventos")
      .select("fecha")
      .single();

    if (eventoError) {
      console.error(eventoError);
    } else {

      const targetDate =
        new Date(evento.fecha);

      const countdown =
        document.getElementById(
          "countdown"
        );

      function updateCountdown() {

        const diff =
          targetDate -
          new Date();

        if (diff <= 0) {

          countdown.textContent =
            "Comenzó";

          return;
        }

        const days =
          Math.floor(
            diff / 86400000
          );

        const hours =
          Math.floor(
            (diff % 86400000) /
            3600000
          );

        const minutes =
          Math.floor(
            (diff % 3600000) /
            60000
          );

        const seconds =
          Math.floor(
            (diff % 60000) /
            1000
          );

        countdown.textContent =
          `${days}d ${hours}h ${minutes}m ${seconds}s`;
      }

      updateCountdown();

      setInterval(
        updateCountdown,
        1000
      );
    }

  } catch (err) {

    console.error(
      "Error countdown:",
      err
    );

  }

// =====================
// POSTS
// =====================

try {

  const currentUserId =
    localStorage.getItem(
      "user_id"
    );

  const posts =
    await getCompatiblePosts(
      currentUserId
    );

  const slider =
    document.getElementById(
      "postsSlider"
    );

  slider.innerHTML = "";

  posts.forEach((post) => {

    if (!post.imagenPost)
      return;

    const card =
      document.createElement(
        "div"
      );

    card.className =
      "ticket-card";

    const img =
      document.createElement(
        "img"
      );

    img.src =
      post.imagenPost;

    img.loading =
      "lazy";

    card.appendChild(
      img
    );

    card.addEventListener(
      "click",
      () => {

        localStorage.setItem(
          "feedPriorityUserId",
          post.user_id
        );

        navigate("feed");

      }
    );

    slider.appendChild(
      card
    );

  });

} catch (err) {

  console.error(
    "Error cargando posts:",
    err
  );

}
}