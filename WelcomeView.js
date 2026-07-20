import { navigate } from "./app.js";
import { supabase } from "./supabase.js";

export function WelcomeView(app) {

  app.innerHTML = `
<div class="welcome-screen">

<h1 class="main-header-title">
    personaliza tus preferencias
  </h1>
  
  <div class="welcome-box">

    <!-- ===================== -->
    <!-- TU ERES -->
    <!-- ===================== -->
    
    

    <h1 class="welcome-title">
      Soy..
    </h1>

    <div class="selection-grid gender-grid">

      <button
        class="select-btn gender-btn"
        data-value="H"
      >
        🧑 Hombre
      </button>

      <button
        class="select-btn gender-btn"
        data-value="M"
      >
        👩 Mujer
      </button>

    </div>

    <!-- ===================== -->
    <!-- BUSCAS -->
    <!-- ===================== -->

    <h2 class="welcome-subtitle">
      Busco conocer a..
    </h2>

    <div class="selection-grid orientation-grid">

      <button
        class="select-btn target-btn"
        data-value="H"
      >
        ♂️ Hombres
      </button>

      <button
        class="select-btn target-btn"
        data-value="M"
      >
        ♀️ Mujeres
      </button>

    </div>

  </div>

  <!-- ===================== -->
  <!-- BOTON CONTINUAR -->
  <!-- ===================== -->

  <div class="welcome-bottom">

    <button
      id="continueBtn"
      class="continue-btn disabled"
    >
      Continuar
    </button>

  </div>

</div>
  `;

  /* ===================== */
  /* VARIABLES             */
  /* ===================== */

  let sexo = null;

  // ahora pueden coexistir
  let wantsH = false;
  let wantsM = false;

  const continueBtn = document.getElementById("continueBtn");

  const genderBtns = document.querySelectorAll(".gender-btn");
  const targetBtns = document.querySelectorAll(".target-btn");

  /* ===================== */
  /* SEXO (solo uno)       */
  /* ===================== */
/* ===================== */
/* VARIABLES EXTRA       */
/* ===================== */

// indica si la selección actual
// de orientación fue creada automáticamente

let lastClickWasPro = false;

/* ===================== */
/* SEXO (solo uno)       */
/* ===================== */

genderBtns.forEach(btn => {

  btn.addEventListener("click", () => {

    genderBtns.forEach(b =>
      b.classList.remove("active")
    );

    btn.classList.add("active");

    sexo = btn.dataset.value; // H o M

    /* ===================== */
    /* CLICK PRO             */
    /* ===================== */

    // 👇 CASO 1:
    // no hay nada seleccionado abajo

    if (!wantsH && !wantsM) {

      // reset visual
      targetBtns.forEach(b =>
        b.classList.remove("active")
      );

      // soy H -> auto M
      if (sexo === "H") {

        wantsH = false;
        wantsM = true;

        const womenBtn =
          document.querySelector(
            '.target-btn[data-value="M"]'
          );

        womenBtn.classList.add("active");

      }

      // soy M -> auto H
      else if (sexo === "M") {

        wantsM = false;
        wantsH = true;

        const menBtn =
          document.querySelector(
            '.target-btn[data-value="H"]'
          );

        menBtn.classList.add("active");

      }

      // 👇 registrar click pro
      lastClickWasPro = true;
    }

    /* ===================== */
    /* CLICK PRO PREVIO      */
    /* ===================== */

    // 👇 si la orientación actual
    // fue autogenerada previamente

    else if (lastClickWasPro) {

      // limpiar selección anterior
      wantsH = false;
      wantsM = false;

      targetBtns.forEach(b =>
        b.classList.remove("active")
      );

      // reautoseleccionar opuesto

      if (sexo === "H") {

        wantsM = true;

        const womenBtn =
          document.querySelector(
            '.target-btn[data-value="M"]'
          );

        womenBtn.classList.add("active");

      }

      else if (sexo === "M") {

        wantsH = true;

        const menBtn =
          document.querySelector(
            '.target-btn[data-value="H"]'
          );

        menBtn.classList.add("active");

      }

    }

    validate();

  });

});

/* ===================== */
/* ORIENTACION           */
/* ===================== */

targetBtns.forEach(btn => {

  btn.addEventListener("click", () => {

    // 👇 desde este momento
    // ya NO es click pro

    lastClickWasPro = false;

    const value = btn.dataset.value;

    btn.classList.toggle("active");

    if (value === "H") {
      wantsH = !wantsH;
    }

    if (value === "M") {
      wantsM = !wantsM;
    }

    validate();

  });

});


  /* ===================== */
  /* VALIDAR               */
  /* ===================== */

  function validate() {

    const hasOrientation =
      wantsH || wantsM;

    if (sexo && hasOrientation) {

      continueBtn.classList.remove("disabled");
      continueBtn.disabled = false;

    } else {

      continueBtn.classList.add("disabled");
      continueBtn.disabled = true;

    }

  }

  continueBtn.disabled = true;

  /* ===================== */
  /* CONTINUAR             */
  /* ===================== */

  continueBtn.addEventListener("click", async () => {

    if (!sexo) return;

    /* ===================== */
    /* CALCULAR ORIENTACION  */
    /* ===================== */

    let orientacion = null;

    // ambos seleccionados
    if (wantsH && wantsM) {
      orientacion = "X";
    }

    // solo hombres
    else if (wantsH) {
      orientacion = "H";
    }

    // solo mujeres
    else if (wantsM) {
      orientacion = "M";
    }

    if (!orientacion) return;

    try {

      const userId = crypto.randomUUID();

      localStorage.setItem("user_id", userId);
      localStorage.setItem("sexo", sexo);
      localStorage.setItem("orientacion", orientacion);

      const { error } = await supabase
        .from("posts")
        .upsert(
          {
            user_id: userId,
            Sexo: sexo,
            Orientacion: orientacion
          },
          {
            onConflict: "user_id"
          }
        );

      if (error) {

        alert("Error guardando datos");
        return;

      }
      navigate("feed");

    } catch (err) {

      alert("Error inesperado");

    }

  });





}