import { navigate } from "./app.js";

export function Crearperfil(app) {

  let currentStep = 1;
  let username = "";
  let selectedImage = null;

  app.innerHTML = `

    <div class="crearperfil-view">

      <!-- AMBIENT -->
      <div class="crearperfil-ambient"></div>

      <!-- PROGRESS -->
      <div class="crearperfil-progress-wrapper">

        <div class="crearperfil-progress-track">

          <div
            class="crearperfil-progress-fill"
            id="progressFill"
          ></div>

        </div>

        <div
          class="crearperfil-progress-text"
          id="progressText"
        >
          Perfil · 1/2
        </div>

      </div>

      <!-- CONTENT -->
      <div class="crearperfil-container">

        <!-- STEP 1 -->
        <div
          class="crearperfil-step active-step"
          id="step1"
        >

          <div class="crearperfil-content">

            <h1 class="crearperfil-title">
              ¿Cómo te llamás?
            </h1>

            <p class="crearperfil-subtitle">
              Mencioná tu nombre para que otras personas puedan encontrarte.
            </p>

            <input
              id="nameInput"
              class="crearperfil-input"
              type="text"
              maxlength="20"
              placeholder="Tu nombre"
              autocomplete="off"
            />

          </div>

        </div>

        <!-- STEP 2 -->
        <div
          class="crearperfil-step"
          id="step2"
        >

          <div class="crearperfil-content">

            <h1 class="crearperfil-title">
              Agregá una foto
            </h1>

            <p class="crearperfil-subtitle">
              Agregá una foto tuya para ser reconocido.
            </p>

            <label
              class="crearperfil-upload"
            >

              <input
                id="imageInput"
                type="file"
                accept="image/*"
                hidden
              />

              <img
                id="previewImage"
                class="crearperfil-preview"
              />

              <div
                class="crearperfil-plus"
                id="uploadPlus"
              >
                +
              </div>

            </label>

            <div class="crearperfil-note">
              Siempre podrás cambiar la foto.
            </div>

          </div>

        </div>

      </div>

    </div>

  `;

  // =========================
  // 🔥 ELEMENTS
  // =========================

  const step1 =
    document.getElementById("step1");

  const step2 =
    document.getElementById("step2");

  const progressFill =
    document.getElementById(
      "progressFill"
    );

  const progressText =
    document.getElementById(
      "progressText"
    );

  const nameInput =
    document.getElementById(
      "nameInput"
    );

  const imageInput =
    document.getElementById(
      "imageInput"
    );

  const previewImage =
    document.getElementById(
      "previewImage"
    );

  const uploadPlus =
    document.getElementById(
      "uploadPlus"
    );

  // =========================
  // 🔥 AUTO FOCUS
  // =========================

  requestAnimationFrame(() => {

    setTimeout(() => {

      nameInput.focus();

    }, 250);

  });

  // =========================
  // 🔥 STEP 1 -> STEP 2
  // SOLO ENTER / OK
  // =========================

  nameInput.addEventListener(
    "keydown",
    (e) => {

      if (e.key !== "Enter") return;

      const value =
        nameInput.value.trim();

      if (!value) return;

      username = value;

      currentStep = 2;

      progressFill.style.width =
        "100%";

      progressText.textContent =
        "Perfil · 2/2";

      step1.classList.remove(
        "active-step"
      );

      step1.classList.add(
        "leaving-step"
      );

      setTimeout(() => {

        step2.classList.add(
          "active-step"
        );

      }, 220);
    }
  );

  // =========================
  // 🔥 IMAGE PREVIEW
  // =========================

  imageInput.addEventListener(
    "change",
    (e) => {

      const file =
        e.target.files?.[0];

      if (!file) return;

      selectedImage = file;

      const localUrl =
        URL.createObjectURL(file);

      previewImage.src =
        localUrl;

      previewImage.style.display =
        "block";

      uploadPlus.style.opacity =
        "0";

      // =========================
      // 🔥 SIMULACIÓN FINAL
      // =========================

setTimeout(() => {

  const currentView =
    document.querySelector(
      ".crearperfil-view"
    );

  currentView.animate(
    [
      {
        opacity: 1,
        filter: "blur(0px)"
      },

      {
        opacity: 0,
        filter: "blur(8px)"
      }
    ],
    {
      duration: 700,
      easing:
        "cubic-bezier(.22,1,.36,1)",
      fill: "forwards"
    }
  );

  setTimeout(() => {

    navigate("feed");

  }, 650);

}, 450);

    }
  );
}