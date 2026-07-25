import { navigate } from "./app.js";
import { supabase } from "./supabase.js";

export async function ticket(app) {

  app.innerHTML = `

    <div class="ticket-view">

      <header class="ticket-header">

        <button
          id="backBtn"
          class="back-btn"
        >
          ←
        </button>

      </header>

      <div class="ticket-content">

        <div id="qrContainer"></div>

        <div
          id="ticketStatus"
          class="ticket-status"
        >
          Cargando ticket...
        </div>

      </div>

    </div>

  `;

  document
    .getElementById("backBtn")
    .addEventListener(
      "click",
      () => navigate("house")
    );

  const currentUserId =
    localStorage.getItem("user_id");

  try {

    const {
      data,
      error
    } = await supabase
      .from("Tickets")
      .select("qr_token, Estado")
      .eq(
        "User",
        currentUserId
      )
      .single();

    if (error) {
      throw error;
    }

    if (!data?.qr_token) {

      document
        .getElementById("ticketStatus")
        .textContent =
        "No existe un ticket para este usuario.";

      return;

    }

    new QRCode(
      document.getElementById("qrContainer"),
      {
        text: data.qr_token,

        width: 260,

        height: 260,

        colorDark: "#000000",

        colorLight: "#ffffff",

        correctLevel:
          QRCode.CorrectLevel.H
      }
    );

    document
      .getElementById("ticketStatus")
      .textContent =
      data.Estado === "activo"
        ? "Ticket válido"
        : "Ticket utilizado";

  } catch (err) {

    console.error(err);

    document
      .getElementById("ticketStatus")
      .textContent =
      "Error al cargar el ticket.";

  }

}