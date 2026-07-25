import { FeedView } from './Feedview.js';
import { Houseview } from './Houseview.js';
import { Mensajes } from './Mensajes.js';
import { Chat } from './Chat.js';
import { ProfileView } from './Profileview.js';
import { WelcomeView } from './WelcomeView.js'; // nueva vista

import {Crearperfil} from './Crearperfil.js';
import { IntroScrollView }
from "./IntroScrollView.js";

import { initNavigation } from './navigate.js';

import {ticket} from "./ticket.js";

const app = document.getElementById("app");

window.addEventListener("load", () => {
  setTimeout(() => {
    startApp();
    
    const splash = document.getElementById("splash-screen");

    if (!splash) return;

    splash.style.opacity = "0";

    setTimeout(() => {
      splash.style.display = "none";

      // 👇 decidir qué abrir después del splash


      

    }, 2500);

  }, 3000);
});

      function startApp() {
  const userId = localStorage.getItem("user_id");

  if (userId) {
    
    navigate("house");
  } else {
    navigate("intro");
  }
}

export function navigate(view, params = {}) {

  const nav = document.getElementById("nav");

  if (nav) {
  nav.style.display = (
    view === "feed" ||
    view === "welcome" ||
    view === "intro" ||
    view === "house"
  )
    ? "none"
    : "block";
}

  if (view === "mensajes") Mensajes(app);
  if (view === "feed") FeedView(app);
  if (view === "house") Houseview(app);
  if (view === "profile") ProfileView(app);
  if (view === "chat") Chat(app, params);
  if (view === "welcome") WelcomeView(app);
  if (view === "username") Crearperfil(app);
  if (view === "intro") IntroScrollView(app);
  if (view === "ticket") ticket(app);
  

}

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
});