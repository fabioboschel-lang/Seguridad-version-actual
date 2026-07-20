import { supabase } from "./supabase.js";
import { navigate } from "./app.js";
import { getCompatiblePosts } from "./compatiblePosts.js";

export async function FeedView(app) {

  const FEED_START_TIME =
    performance.now();

  console.log(
    "🚀 FeedView iniciado"
  );

  app.innerHTML = `

  <div class="feed-loading">

    <div class="loader-center">

      <svg
        class="loader-heart"
        viewBox="0 0 512 512"
      >
        <path d="M256 464s-16-14.8-70-68.3C88.5 331 32 271.5 32 192 32 120 88 64 160 64c48 0 80 32 96 64 16-32 48-64 96-64 72 0 128 56 128 128 0 79.5-56.5 139-154 203.7-54 53.5-70 68.3-70 68.3z"/>
      </svg>

    </div>

  </div>

  <div class="feed-container hidden-feed">

    <div class="feed-create-profile">
      Crear perfil
    </div>

    <div
      id="imagesGrid"
      class="imagesGrid"
    ></div>

  </div>

  `;

  const imagesGrid =
    document.getElementById(
      "imagesGrid"
    );

  const feedContainer =
    document.querySelector(
      ".feed-container"
    );

  const loadingScreen =
    document.querySelector(
      ".feed-loading"
    );

  const createProfileBtn =
    document.querySelector(
      ".feed-create-profile"
    );

  createProfileBtn.addEventListener(
    "click",
    () => {

      navigate("username");

    }
  );

  const BATCH_SIZE = 30;
  const RENDER_CHUNK_SIZE = 10;

  const currentUserId =
    localStorage.getItem(
      "user_id"
    );

  if (!currentUserId) {

    alert(
      "No hay user_id en localStorage"
    );

    return;
  }

  const ESTADO1_TEXTS = [
    "Bailarias?",
    "Cruzarias?",
    "Conocerias?"
  ];

  try {

    // =========================
    // 🔹 POSTS COMPATIBLES
    // =========================

    const compatiblePosts =
      await getCompatiblePosts(
        currentUserId
      );

    let posts =
      compatiblePosts.slice(
        0,
        BATCH_SIZE
      );
const priorityUserId =
  localStorage.getItem(
    "feedPriorityUserId"
  );

if (priorityUserId) {

  const priorityPost =
    posts.find(
      p =>
        p.user_id ===
        priorityUserId
    );

  if (priorityPost) {

    posts = [

      priorityPost,

      ...posts.filter(
        p =>
          p.user_id !==
          priorityUserId
      )

    ];

  }

  localStorage.removeItem(
    "feedPriorityUserId"
  );

}
    // =========================
    // 🔹 LIKES
    // =========================

    const {
      data: likes,
      error: likesError
    } = await supabase
      .from("Likes")
      .select(
        "id, Remitente, Destinatario, A1, A2, A3, Acepto"
      )
      .or(
        `Remitente.eq.${currentUserId},Destinatario.eq.${currentUserId}`
      );

    if (likesError)
      throw likesError;

    console.log(posts);

  // =========================
  // 🔹 MAPA DE LIKES
  // =========================

  const likesMap = new Map();

  for (const l of likes) {
    const key =
      l.Remitente === currentUserId
        ? l.Destinatario
        : l.Remitente;

    if (!likesMap.has(key)) {
      likesMap.set(key, []);
    }

    likesMap.get(key).push(l);
  }

  imagesGrid.innerHTML = "";

  // =========================
  // 🔹 RENDER EN CHUNKS
  // =========================

  requestAnimationFrame(() => {
    let i = 0;

    function renderChunk() {
      const chunk = posts.slice(i, i + RENDER_CHUNK_SIZE);

      chunk.forEach((post, index) => {
        console.log(post.imagenPost);
        const wrapper = document.createElement("div");
        wrapper.classList.add("post");
        wrapper.dataset.userId = post.user_id;

        // estado base consistente
        wrapper.dataset.estado1 = "false";
        wrapper.dataset.estado2 = "false";
        wrapper.dataset.estado3 = "false";
        wrapper.dataset.hasGivenLike = "false";

        // 🔹 Fondo borroso
        const postBg = document.createElement("div");
        postBg.classList.add("post-bg");
        postBg.style.backgroundImage = `url(${post.imagenPost})`;

        // 🔹 Imagen principal
        const img = document.createElement("img");
        img.classList.add("feed-img");
        img.src = post.imagenPost;
        img.alt = post.username || "post";

        // 🔹 Username
        const usernameDiv = document.createElement("div");
        usernameDiv.classList.add("post-username");
        usernameDiv.textContent = post.username || "usuario";

        // 🔹 Texto
        const textoDiv = document.createElement("div");
        textoDiv.classList.add("post-text");

        let estado1 = false;
        let estado2 = false;
        let estado3 = false;
        let textoFinal = "";

        // 🔹 RELACIONES ENTRE USUARIOS
        const relaciones = likesMap.get(post.user_id) ?? [];

        // 🔴 ESTADO 3
        const filaEstado3 = relaciones.find((l) => l.Acepto === "sí");
        if (filaEstado3) {
          estado3 = true;
          textoFinal = filaEstado3.A3;
          wrapper.dataset.estado3 = "true";
          wrapper.dataset.hasGivenLike = "true";
          wrapper.appendChild(crearChatBtn(post.user_id));
        } else {
          // 🟡 ESTADO 2
          const filaEstado2 = relaciones.find(
            (l) =>
              l.Acepto === "no" &&
              l.Remitente === post.user_id &&
              l.Destinatario === currentUserId
          );

          if (filaEstado2) {
            estado2 = true;
            textoFinal = filaEstado2.A2;
            wrapper.dataset.estado2 = "true";
          } else {
            // 🔵 ESTADO 1
            estado1 = true;
            wrapper.dataset.estado1 = "true";

            const filaEstado1 = relaciones.find(
              (l) =>
                l.Remitente === currentUserId &&
                l.Destinatario === post.user_id
            );

            if (filaEstado1) {
              textoFinal = filaEstado1.A1;
              wrapper.dataset.hasGivenLike = "true";
            } else {
              const idx = Math.floor(
  Math.random() * ESTADO1_TEXTS.length
);

textoFinal = ESTADO1_TEXTS[idx];
              wrapper.dataset.hasGivenLike = "false";
            }
          }
        }

        // 🔹 TEXTO + CLASE
        textoDiv.textContent = textoFinal;

        const claseTexto = (textoFinal || "")
          .toLowerCase()
          .replace(/\s+/g, "")
          .replace(/[^a-z0-9áéíóúüñ]/gi, "");

        if (claseTexto) {
          textoDiv.classList.add(claseTexto);
        }

        // 🔹 BOTÓN LIKE
        const btn = document.createElement("div");
        btn.classList.add("like-btn");

        if (estado3) {
          btn.classList.add("like-bloqueado");
        } else if (estado1 && wrapper.dataset.hasGivenLike === "true") {
          btn.classList.add("like-activo");
        } else {
          btn.classList.add("like-inactivo");
        }

        btn.innerHTML = `
          <svg viewBox="0 0 512 512">
            <path d="M256 464s-16-14.8-70-68.3C88.5 331 32 271.5 32 192 32 120 88 64 160 64c48 0 80 32 96 64 16-32 48-64 96-64 72 0 128 56 128 128 0 79.5-56.5 139-154 203.7-54 53.5-70 68.3-70 68.3z"/>
          </svg>
        `;

        wrapper.appendChild(postBg);
        wrapper.appendChild(img);
        wrapper.appendChild(usernameDiv);
        wrapper.appendChild(btn);
        wrapper.appendChild(textoDiv);

        imagesGrid.appendChild(wrapper);
        if (index === 0) {

  const measureCompletePost = () => {

    requestAnimationFrame(() => {

      requestAnimationFrame(() => {

        const totalTime =
          performance.now() -
          FEED_START_TIME;

        console.log(
          "⚡ Primer post COMPLETO renderizado en:",
          totalTime.toFixed(0),
          "ms"
        );
        loadingScreen.style.opacity = "0";

feedContainer.classList.remove(
  "hidden-feed"
);

      });

    });

  };

  // 👇 imagen ya cargada
  if (img.complete) {

    measureCompletePost();

  } else {

    img.onload =
      measureCompletePost;
  }
}
      });

      i += RENDER_CHUNK_SIZE;

      if (i < posts.length) {
        requestAnimationFrame(renderChunk);
      }
    }

    renderChunk();
    

setTimeout(() => {

  loadingScreen.remove();

}, 450);
  });

} catch (err) {
  console.error("💥 Error general:", err);
}
}


// 🔥 TOGGLE LIKE
document.addEventListener("click", async (e) => {
  const btn = e.target.closest(".like-btn");
if (!btn) return;

const post = btn.closest(".post");
  const destinatario = post?.dataset.userId;
  const remitente = localStorage.getItem("user_id");

  const estado1 = post?.dataset.estado1 === "true";
  const estado2 = post?.dataset.estado2 === "true";
  const estado3 = post?.dataset.estado3 === "true";

  if (!post || !remitente || !destinatario) return;
  if (post.dataset.liking === "true") return;

  post.dataset.liking = "true";
  

  try {
    // 🔵 ESTADO 1
    if (estado1) {
      const hasGivenLike = post.dataset.hasGivenLike === "true";

      if (hasGivenLike) {
        btn.classList.remove("like-activo");
        btn.classList.add("like-inactivo");
        post.dataset.hasGivenLike = "false";

        await supabase
          .from("Likes")
          .delete()
          .eq("Remitente", remitente)
          .eq("Destinatario", destinatario);

      } else {
        const textoActual = post.querySelector(".post-text")?.textContent;

        await supabase.from("Likes").insert([{
          Remitente: remitente,
          Destinatario: destinatario,
          A1: textoActual,
          Acepto: "no"
        }]);

        btn.classList.remove("like-inactivo");
        btn.classList.add("like-activo");
        post.dataset.hasGivenLike = "true";
      }

    // 🟡 ESTADO 2 → MATCH
    } else if (estado2) {
      const { data: filas } = await supabase
        .from("Likes")
        .select("*")
        .eq("Remitente", destinatario)
        .eq("Destinatario", remitente)
        .limit(1);

      if (!filas || filas.length === 0) return;

      await supabase
        .from("Likes")
        .update({ Acepto: "sí" })
        .eq("id", filas[0].id);

      btn.classList.remove("like-inactivo");
      btn.classList.add("like-bloqueado");
     post.dataset.estado2 = "false";
post.dataset.estado3 = "true";

if (!post.querySelector(".chat-go-btn")) {
  post.appendChild(crearChatBtn(destinatario));
}

      const textDiv = post.querySelector(".post-text");
      if (textDiv && filas[0].A3) {
        textDiv.textContent = filas[0].A3;
        const nuevaClase = filas[0].A3
          .toLowerCase()
          .replace(/\s+/g, '')
          .replace(/[^a-z0-9áéíóúüñ]/gi, '');
        textDiv.className = "post-text " + nuevaClase;
      }
      return;

    // 🔴 ESTADO 3
    } else if (estado3) {
      btn.classList.remove("like-inactivo", "like-activo");
      btn.classList.add("like-bloqueado");
      return;
    }

  } catch (err) {
    console.error("💥 Error en toggle like:", err);
  } finally {
    post.dataset.liking = "false";
  }
});


// 🔹 Doble tap para corazón grande (mantener igual)
document.addEventListener("dblclick", async (e) => {
  if (!e.target.classList.contains("feed-img")) return;

  const img = e.target;
  const wrapper = img.closest(".post");
  if (!wrapper) return;

  const destinatario = wrapper.dataset.userId;
  const remitente = localStorage.getItem("user_id");

  const estado1 = wrapper.dataset.estado1 === "true";
  const estado2 = wrapper.dataset.estado2 === "true";
  const estado3 = wrapper.dataset.estado3 === "true";

  const hasGivenLike = wrapper.dataset.hasGivenLike === "true";
  const btn = wrapper.querySelector(".like-btn");

  crearBigHeart(wrapper, img, e);

  if (estado1 && !hasGivenLike) {
    wrapper.dataset.hasGivenLike = "true";
    btn.classList.remove("like-inactivo");
    btn.classList.add("like-activo");

    if (wrapper.dataset.liking === "true") return;
    wrapper.dataset.liking = "true";

    try {
      const textoActual = wrapper.querySelector(".post-text")?.textContent;

      await supabase.from("Likes").insert([{
        Remitente: remitente,
        Destinatario: destinatario,
        A1: textoActual,
        Acepto: "no"
      }]);
    } catch (err) {
      console.error("❌ Error insert dbltap:", err);
      wrapper.dataset.hasGivenLike = "false";
      btn.classList.remove("like-activo");
      btn.classList.add("like-inactivo");
    } finally {
      wrapper.dataset.liking = "false";
    }

  } else if (estado2) {
    if (wrapper.dataset.liking === "true") return;
    wrapper.dataset.liking = "true";

    const textDiv = wrapper.querySelector(".post-text");

    try {
      const { data: filas } = await supabase
        .from("Likes")
        .select("*")
        .eq("Remitente", destinatario)
        .eq("Destinatario", remitente)
        .limit(1);

      if (filas && filas.length > 0) {
        await supabase
          .from("Likes")
          .update({ Acepto: "sí" })
          .eq("id", filas[0].id);

        btn.classList.remove("like-inactivo", "like-activo");
        btn.classList.add("like-bloqueado");
        wrapper.dataset.estado2 = "false";
wrapper.dataset.estado3 = "true";

if (!wrapper.querySelector(".chat-go-btn")) {
  wrapper.appendChild(crearChatBtn(destinatario));
}

        if (textDiv && filas[0].A3) {
          textDiv.textContent = filas[0].A3;
          const nuevaClase = filas[0].A3
            .toLowerCase()
            .replace(/\s+/g, '')
            .replace(/[^a-z0-9áéíóúüñ]/gi, '');
          textDiv.className = "post-text " + nuevaClase;
        }
      }
    } catch (err) {
      console.error("❌ Error match dbltap:", err);
    } finally {
      wrapper.dataset.liking = "false";
    }
  }
});

// 🔹 Función crearBigHeart se mantiene idéntica a tu versión actual




function crearChatBtn(userId) {
  const btn = document.createElement("div");
  btn.className = "chat-go-btn";

  btn.innerHTML = `
  <svg viewBox="0 0 100 100">
    <path d="
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
    " fill="white"/>
  </svg>
  `;

  btn.addEventListener("click", () => {
    navigate("chat", { userId });
  });

  return btn;
}
















function crearBigHeart(wrapper, img, e) {
  const rect = img.getBoundingClientRect();

  // 🔹 Punto exacto del toque
  const xStart = e.clientX - rect.left;
  const yStart = e.clientY - rect.top;

  // 🔹 Destino: recto hacia arriba
  const xEnd = xStart;
  const yEnd = yStart - 100;

  const bigHeart = document.createElement("div");
  bigHeart.classList.add("bigHeartEffect");

  // 🔹 Posición exacta del toque
  bigHeart.style.left = `${xStart}px`;
  bigHeart.style.top = `${yStart}px`;

  // 🔹 Gradientes
// =========================
// 🎨 SISTEMA DE RAREZA HEART
// =========================

// 🔹 Comunes (70%)
const gradients = [
  ["#FF2D55", "#FFB199"],  // like / atracción (rojo → calidez humana)
  ["#00C896", "#4F46E5"],  // match / conexión (verde → energía de unión)
  ["#3F5BFF", "#A855F7"]   // UI / sistema (azul → violeta navegación)
];
// =========================
// 🎲 Selección de gradient
// =========================

const gradientColors =
  gradients[Math.floor(Math.random() * gradients.length)];

// =========================
// ↕️ DIRECCIONES (se mantiene)
// =========================

const directions = [
  ["0%", "0%", "0%", "100%"],   // arriba → abajo
  ["0%", "100%", "0%", "0%"],   // abajo → arriba
  ["0%", "0%", "100%", "0%"],   // izquierda → derecha
  ["100%", "0%", "0%", "0%"]    // derecha → izquierda
];

const dir =
  directions[Math.floor(Math.random() * directions.length)];

// =========================
// ID único
// =========================

const gradientId =
  "gradientHeart-" + Date.now() + "-" + Math.floor(Math.random() * 99999);

const finalRotations = [-15, 0, 15]; // izquierda, recto, derecha
const finalRotation = finalRotations[Math.floor(Math.random() * finalRotations.length)];

const size = 120;
  const half = size / 2;

  

  bigHeart.innerHTML = `
    <svg viewBox="0 0 512 512">
      <defs>
        <linearGradient id="${gradientId}" x1="${dir[0]}" y1="${dir[1]}" x2="${dir[2]}" y2="${dir[3]}">
          <stop offset="0%" stop-color="${gradientColors[0]}"/>
          <stop offset="100%" stop-color="${gradientColors[1]}"/>
        </linearGradient>
      </defs>
      <path fill="url(#${gradientId})" d="M256 464s-16-14.8-70-68.3C88.5 331 32 271.5 32 192 32 120 88 64 160 64c48 0 80 32 96 64 16-32 48-64 96-64 72 0 128 56 128 128 0 79.5-56.5 139-154 203.7-54 53.5-70 68.3-70 68.3z"/>
    </svg>
  `;

  wrapper.appendChild(bigHeart);
  void bigHeart.offsetWidth;

bigHeart.animate(
  [
    {
      transform: `translate(-${half}px, -${half}px) scale(0.55) rotate(0deg)`,
      opacity: 0
    },

    {
      transform: `translate(
        ${(xEnd - xStart) * 0.18 - half}px,
        ${(yEnd - yStart) * 0.18 - half}px
      ) scale(0.82) rotate(12deg)`,
      opacity: 0.65,
      offset: 0.16
    },

    {
      transform: `translate(
        ${(xEnd - xStart) * 0.45 - half}px,
        ${(yEnd - yStart) * 0.45 - half}px
      ) scale(1.08) rotate(-10deg)`,
      opacity: 1,
      offset: 0.34
    },

    {
      transform: `translate(
        ${(xEnd - xStart) * 0.72 - half}px,
        ${(yEnd - yStart) * 0.72 - half}px
      ) scale(1.15) rotate(8deg)`,
      offset: 0.50
    },

    {
      transform: `translate(
        ${xEnd - xStart - half}px,
        ${yEnd - yStart - half}px
      ) scale(0.96) rotate(${finalRotation}deg)`,
      offset: 0.64
    },

    {
      transform: `translate(
        ${xEnd - xStart - half}px,
        ${yEnd - yStart - half}px
      ) scale(1.04) rotate(${finalRotation * 0.6}deg)`,
      offset: 0.72
    },

    {
      transform: `translate(
        ${xEnd - xStart - half}px,
        ${yEnd - yStart - half}px
      ) scale(1) rotate(${finalRotation}deg)`,
      opacity: 1,
      offset: 0.80
    },

    {
      transform: `translate(
        ${xEnd - xStart - half}px,
        ${yEnd - yStart - half}px
      ) scale(1) rotate(${finalRotation}deg)`,
      opacity: 0.85,
      offset: 0.92
    },

    {
      transform: `translate(
        ${xEnd - xStart - half}px,
        ${yEnd - yStart - half - 18}px
      ) scale(1.05) rotate(${finalRotation}deg)`,
      opacity: 0,
      offset: 1
    }
  ],
  {
    duration: 1900,
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    fill: "forwards"
  }
);


// 🔽 AUTO SCROLL DESPUÉS DEL DOUBLE TAP
setTimeout(() => {
  requestAnimationFrame(() => {

    const scrollTarget = wrapper.nextElementSibling;

    if (!scrollTarget) return;

    scrollTarget.scrollIntoView({
      behavior: "auto",
      block: "start"
    });

  });
}, 700);
}


