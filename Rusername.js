import { navigate } from "./app.js";

export function Rusername(app){

  app.innerHTML = `

    <div class="ruser-screen">

      <!-- LOGO -->
      <img
        src="./logo-vybe.png"
        class="ruser-logo"
        alt="Vybe"
      >

      <!-- CONTENIDO -->
      <div class="ruser-content">

        <h1 class="ruser-title">
          Antes del evento,<br>
          empieza la conexión.
        </h1>

        <p class="ruser-text">
          Descubrí quién va a estar esta noche,
          conectá antes de cruzarte en persona.
        </p>

        <!-- INPUT -->
        <div class="ruser-input-wrap">

          <input
            id="usernameInput"
            class="ruser-input"
            type="text"
            maxlength="18"
            placeholder="Tu nombre de usuario"
            autocomplete="off"
          >

        </div>

      </div>

      <!-- BOTON -->
      <div class="ruser-bottom">

        <button
          id="continueBtn"
          class="ruser-btn disabled"
        >
          Continuar
        </button>

      </div>

    </div>

  `;

  const input = document.getElementById("usernameInput");
  const continueBtn = document.getElementById("continueBtn");

  let username = "";

  /* ========================= */
  /* VALIDAR INPUT             */
  /* ========================= */

  input.addEventListener("input", () => {

    username = input.value.trim();

    if(username.length >= 3){

      continueBtn.classList.remove("disabled");
      continueBtn.disabled = false;

    }else{

      continueBtn.classList.add("disabled");
      continueBtn.disabled = true;

    }

  });

  continueBtn.disabled = true;

  /* ========================= */
  /* CONTINUAR                 */
  /* ========================= */

  continueBtn.addEventListener("click", () => {

    if(username.length < 3) return;

    localStorage.setItem("username", username);

    // TEMPORAL
    // después irá a WelcomeView
    navigate("feed");

  });

}