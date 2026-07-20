import { navigate } from "./app.js";

export function Rimagen(app) {

  app.innerHTML = `
    <div class="rimg-screen">

      <div class="rimg-content">

        <h1 class="rimg-title">
          Agregá tu imagen
        </h1>

        <p class="rimg-text">
          Una foto ayuda a que otros usuarios te reconozcan y conecten más fácil con vos dentro de Vybe.
        </p>

        <label class="rimg-upload">

          <input
            id="imageInput"
            type="file"
            accept="image/*"
            hidden
          />

          <div class="rimg-box" id="imageBox">

            <span class="rimg-plus">+</span>

          </div>

        </label>

      </div>

      <div class="rimg-bottom">

        <button id="continueBtn" class="rimg-btn disabled">
          Continuar
        </button>

      </div>

    </div>
  `;

  const input = document.getElementById("imageInput");
  const box = document.getElementById("imageBox");
  const continueBtn = document.getElementById("continueBtn");

  let imageFile = null;

  input.addEventListener("change", (e) => {

    const file = e.target.files[0];
    if (!file) return;

    imageFile = file;

    const url = URL.createObjectURL(file);

    box.innerHTML = `
      <img src="${url}" class="rimg-preview" />
    `;

    continueBtn.classList.remove("disabled");
    continueBtn.disabled = false;

  });

  continueBtn.disabled = true;

  continueBtn.addEventListener("click", () => {

    if (!imageFile) return;

    // por ahora localStorage (después Supabase)
    localStorage.setItem("user_image", URL.createObjectURL(imageFile));

    navigate("feed");

  });

}