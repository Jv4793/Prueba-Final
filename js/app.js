"use strict";

const FAVORITOS_STORAGE_KEY = "playstation-zone-favoritos";
const TEMA_STORAGE_KEY = "playstation-zone-tema";

const elementos = {
  body: document.body,
  navToggle: document.querySelector(".nav-toggle"),
  navLinks: document.querySelector("#menu-principal"),
  themeToggle: document.querySelector("#theme-toggle"),
  consolasGrid: document.querySelector("#consolas-grid"),
  videojuegosGrid: document.querySelector("#videojuegos-grid"),
  favoritosLista: document.querySelector("#favoritos-lista"),
  buscador: document.querySelector("#buscador"),
  resultadoBusqueda: document.querySelector("#resultado-busqueda"),
  climaContenido: document.querySelector("#clima-contenido"),
  actualizarClima: document.querySelector("#actualizar-clima")
};

let favoritos = cargarFavoritos();
let busquedaActual = "";

// Datos principales renderizados dinámicamente.
const consolasPlayStation = [
  {
    id: "ps1",
    nombre: "PlayStation",
    generacion: "Quinta generación",
    anio: 1994,
    descripcion: "La consola que abrió la marca al gran público con CD-ROM, mundos 3D y sagas que definieron una época.",
    imagen: "./assets/images/console-blue.svg",
    alt: "Ilustración abstracta de la primera consola PlayStation"
  },
  {
    id: "ps2",
    nombre: "PlayStation 2",
    generacion: "Sexta generación",
    anio: 2000,
    descripcion: "Una de las consolas más vendidas de la historia, con lector DVD y un catálogo enorme y variado.",
    imagen: "./assets/images/console-dark.svg",
    alt: "Ilustración abstracta de PlayStation 2"
  },
  {
    id: "ps3",
    nombre: "PlayStation 3",
    generacion: "Séptima generación",
    anio: 2006,
    descripcion: "Introdujo Blu-ray, PlayStation Network y una etapa clave para el juego online en la marca.",
    imagen: "./assets/images/console-blue.svg",
    alt: "Ilustración abstracta de PlayStation 3"
  },
  {
    id: "ps4",
    nombre: "PlayStation 4",
    generacion: "Octava generación",
    anio: 2013,
    descripcion: "Consolidó la experiencia social, el streaming y una generación muy sólida de exclusivos.",
    imagen: "./assets/images/console-blue.svg",
    alt: "Ilustración abstracta de PlayStation 4"
  },
  {
    id: "ps5",
    nombre: "PlayStation 5",
    generacion: "Novena generación",
    anio: 2020,
    descripcion: "Apuesta por SSD ultrarrápido, DualSense, trazado de rayos y tiempos de carga reducidos.",
    imagen: "./assets/images/console-white.svg",
    alt: "Ilustración abstracta de PlayStation 5"
  },
  {
    id: "ps-portal",
    nombre: "PlayStation Portal",
    generacion: "Juego remoto",
    anio: 2023,
    descripcion: "Dispositivo orientado a jugar en streaming local desde PS5 con controles integrados.",
    imagen: "./assets/images/handheld.svg",
    alt: "Ilustración abstracta de PlayStation Portal"
  }
];

const videojuegosPlayStation = [
  {
    id: "god-of-war-ragnarok",
    titulo: "God of War Ragnarök",
    consola: "PS5 / PS4",
    genero: "Acción y aventura",
    anio: 2022,
    descripcion: "Una aventura intensa de Kratos y Atreus con combates precisos, exploración y una gran narrativa.",
    imagen: "./assets/images/game-action.svg",
    alt: "Ilustración abstracta de un juego de acción inspirado en God of War Ragnarök"
  },
  {
    id: "horizon-forbidden-west",
    titulo: "Horizon Forbidden West",
    consola: "PS5 / PS4",
    genero: "Aventura",
    anio: 2022,
    descripcion: "Exploración en mundo abierto, máquinas espectaculares y paisajes naturales de gran escala.",
    imagen: "./assets/images/game-adventure.svg",
    alt: "Ilustración abstracta de un mundo de aventura inspirado en Horizon Forbidden West"
  },
  {
    id: "gran-turismo-7",
    titulo: "Gran Turismo 7",
    consola: "PS5 / PS4",
    genero: "Conducción",
    anio: 2022,
    descripcion: "Simulación de carreras con coleccionismo de coches, circuitos clásicos y conducción detallada.",
    imagen: "./assets/images/game-racing.svg",
    alt: "Ilustración abstracta de un juego de conducción inspirado en Gran Turismo 7"
  },
  {
    id: "spider-man-2",
    titulo: "Marvel's Spider-Man 2",
    consola: "PS5",
    genero: "Acción",
    anio: 2023,
    descripcion: "Movimiento ágil por Nueva York, combates espectaculares y campaña protagonizada por dos héroes.",
    imagen: "./assets/images/game-city.svg",
    alt: "Ilustración abstracta de un juego de superhéroes inspirado en Marvel's Spider-Man 2"
  },
  {
    id: "the-last-of-us-part-ii",
    titulo: "The Last of Us Parte II",
    consola: "PS4 / PS5",
    genero: "Narrativa",
    anio: 2020,
    descripcion: "Una historia adulta con sigilo, tensión, exploración y una producción audiovisual muy cuidada.",
    imagen: "./assets/images/game-forest.svg",
    alt: "Ilustración abstracta de un juego narrativo inspirado en The Last of Us Parte II"
  },
  {
    id: "ratchet-clank-rift-apart",
    titulo: "Ratchet & Clank: Rift Apart",
    consola: "PS5",
    genero: "Plataformas",
    anio: 2021,
    descripcion: "Plataformas y acción con cambios dimensionales rápidos y un estilo visual muy colorido.",
    imagen: "./assets/images/game-portal.svg",
    alt: "Ilustración abstracta de un juego de plataformas inspirado en Ratchet & Clank: Rift Apart"
  },
  {
    id: "ghost-of-tsushima",
    titulo: "Ghost of Tsushima",
    consola: "PS4 / PS5",
    genero: "Aventura",
    anio: 2020,
    descripcion: "Aventura samurái de mundo abierto con duelos, sigilo y una dirección artística muy reconocible.",
    imagen: "./assets/images/game-sun.svg",
    alt: "Ilustración abstracta de un juego samurái inspirado en Ghost of Tsushima"
  },
  {
    id: "astro-bot",
    titulo: "Astro Bot",
    consola: "PS5",
    genero: "Plataformas",
    anio: 2024,
    descripcion: "Plataformas accesible, creativo y lleno de referencias a la historia de PlayStation.",
    imagen: "./assets/images/game-space.svg",
    alt: "Ilustración abstracta de un juego de plataformas inspirado en Astro Bot"
  }
];

function crearTarjetaConsola(consola) {
  const articulo = document.createElement("article");
  articulo.className = "data-card";
  articulo.innerHTML = `
    <img class="data-card__image" src="${consola.imagen}" alt="${consola.alt}" loading="lazy">
    <div class="data-card__body">
      <div class="data-card__meta">
        <span class="tag">${consola.generacion}</span>
        <span class="tag">${consola.anio}</span>
      </div>
      <h3>${consola.nombre}</h3>
      <p>${consola.descripcion}</p>
    </div>
  `;
  return articulo;
}

function crearTarjetaVideojuego(videojuego) {
  const esFavorito = favoritos.includes(videojuego.id);
  const articulo = document.createElement("article");
  articulo.className = "data-card";
  articulo.innerHTML = `
    <img class="data-card__image" src="${videojuego.imagen}" alt="${videojuego.alt}" loading="lazy">
    <div class="data-card__body">
      <div class="data-card__meta">
        <span class="tag">${videojuego.consola}</span>
        <span class="tag">${videojuego.genero}</span>
        <span class="tag">${videojuego.anio}</span>
      </div>
      <h3>${videojuego.titulo}</h3>
      <p>${videojuego.descripcion}</p>
      <button class="favorite-button" type="button" data-id="${videojuego.id}" aria-pressed="${esFavorito}" aria-label="${esFavorito ? "Quitar de favoritos" : "Añadir a favoritos"}: ${videojuego.titulo}">
        <span aria-hidden="true">${esFavorito ? "★" : "☆"}</span>
        <span>${esFavorito ? "Favorito" : "Añadir favorito"}</span>
      </button>
    </div>
  `;
  return articulo;
}

function renderConsolas() {
  elementos.consolasGrid.replaceChildren(...consolasPlayStation.map(crearTarjetaConsola));
  console.log("Consolas cargadas:", consolasPlayStation.length);
}

function obtenerVideojuegosFiltrados() {
  const termino = busquedaActual.trim().toLowerCase();
  if (!termino) {
    return videojuegosPlayStation;
  }

  return videojuegosPlayStation.filter((juego) => {
    return [juego.titulo, juego.consola, juego.genero].some((valor) => valor.toLowerCase().includes(termino));
  });
}

function renderVideojuegos() {
  const videojuegosFiltrados = obtenerVideojuegosFiltrados();
  elementos.videojuegosGrid.replaceChildren(...videojuegosFiltrados.map(crearTarjetaVideojuego));

  if (busquedaActual.trim()) {
    elementos.resultadoBusqueda.textContent = `${videojuegosFiltrados.length} resultado(s) para "${busquedaActual.trim()}".`;
  } else {
    elementos.resultadoBusqueda.textContent = `${videojuegosPlayStation.length} videojuegos disponibles.`;
  }

  console.log("Videojuegos renderizados:", videojuegosFiltrados.length);
}

function renderFavoritos() {
  const juegosFavoritos = videojuegosPlayStation.filter((juego) => favoritos.includes(juego.id));

  if (juegosFavoritos.length === 0) {
    const mensaje = document.createElement("p");
    mensaje.className = "empty-state";
    mensaje.textContent = "Todavía no tienes videojuegos favoritos. Marca alguno desde la sección de videojuegos.";
    elementos.favoritosLista.replaceChildren(mensaje);
    console.log("Favoritos renderizados: sin favoritos");
    return;
  }

  elementos.favoritosLista.replaceChildren(...juegosFavoritos.map(crearTarjetaVideojuego));
  console.log("Favoritos renderizados:", juegosFavoritos.map((juego) => juego.titulo));
}

function toggleFavorito(idVideojuego) {
  if (favoritos.includes(idVideojuego)) {
    favoritos = favoritos.filter((id) => id !== idVideojuego);
  } else {
    favoritos.push(idVideojuego);
  }

  guardarFavoritos();
  renderVideojuegos();
  renderFavoritos();
  console.log("Favoritos actualizados:", favoritos);
}

function guardarFavoritos() {
  localStorage.setItem(FAVORITOS_STORAGE_KEY, JSON.stringify(favoritos));
}

function cargarFavoritos() {
  try {
    const favoritosGuardados = JSON.parse(localStorage.getItem(FAVORITOS_STORAGE_KEY)) || [];
    console.log("Favoritos cargados desde LocalStorage:", favoritosGuardados);
    return Array.isArray(favoritosGuardados) ? favoritosGuardados : [];
  } catch (error) {
    console.warn("No se pudieron cargar favoritos. Se reinicia la lista.", error);
    return [];
  }
}

function obtenerTemaPreferido() {
  const temaGuardado = localStorage.getItem(TEMA_STORAGE_KEY);
  if (temaGuardado === "dark" || temaGuardado === "light") {
    return temaGuardado;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function aplicarModoOscuro(tema = obtenerTemaPreferido()) {
  const esOscuro = tema === "dark";
  elementos.body.dataset.theme = tema;
  elementos.themeToggle.setAttribute("aria-pressed", String(esOscuro));
  elementos.themeToggle.setAttribute("aria-label", esOscuro ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
  elementos.themeToggle.querySelector(".theme-toggle__text").textContent = esOscuro ? "Modo claro" : "Modo oscuro";
  elementos.themeToggle.querySelector(".theme-toggle__icon").textContent = esOscuro ? "☀" : "◐";
  localStorage.setItem(TEMA_STORAGE_KEY, tema);
  console.log("Modo visual aplicado:", tema);
}

function alternarTema() {
  const temaActual = elementos.body.dataset.theme === "dark" ? "dark" : "light";
  aplicarModoOscuro(temaActual === "dark" ? "light" : "dark");
}

function crearMensajeClima(temperatura, viento, weatherCode, esDia) {
  if (weatherCode >= 51 || viento >= 35) {
    return "Buen día para jugar en casa.";
  }

  if (temperatura >= 16 && temperatura <= 25 && esDia) {
    return "Buen día para salir a comprar juegos.";
  }

  return "Tarde perfecta para una sesión de PlayStation.";
}

async function obtenerClima() {
  const url = "https://api.open-meteo.com/v1/forecast?latitude=43.5322&longitude=-5.6611&current=temperature_2m,wind_speed_10m,weather_code,is_day&timezone=Europe%2FMadrid";
  elementos.climaContenido.innerHTML = '<p class="loading-message">Cargando clima para preparar la partida...</p>';

  try {
    const respuesta = await fetch(url);
    if (!respuesta.ok) {
      throw new Error(`Respuesta HTTP ${respuesta.status}`);
    }

    const datos = await respuesta.json();
    const actual = datos.current;
    const temperatura = Number(actual.temperature_2m);
    const viento = Number(actual.wind_speed_10m);
    const codigo = Number(actual.weather_code);
    const esDia = Boolean(actual.is_day);
    const mensaje = crearMensajeClima(temperatura, viento, codigo, esDia);

    elementos.climaContenido.innerHTML = `
      <div class="weather-stat">
        <strong>${temperatura.toFixed(1)}°C</strong>
        <span>Temperatura</span>
      </div>
      <div class="weather-stat">
        <strong>${viento.toFixed(0)} km/h</strong>
        <span>Viento</span>
      </div>
      <p class="weather-message">${mensaje}</p>
    `;

    console.log("Datos recibidos de Open-Meteo:", datos);
  } catch (error) {
    elementos.climaContenido.innerHTML = `
      <p class="error-message">No se pudo obtener el clima ahora mismo. La aplicación sigue funcionando y puedes intentarlo más tarde.</p>
    `;
    console.warn("No se pudo obtener el clima. Se muestra mensaje amigable:", error);
  }
}

function registrarServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    console.log("Service Worker no soportado en este navegador.");
    return;
  }

  window.addEventListener("load", async () => {
    try {
      const registro = await navigator.serviceWorker.register("./service-worker.js");
      console.log("Service Worker registrado correctamente:", registro.scope);
    } catch (error) {
      console.warn("No se pudo registrar el Service Worker en este contexto:", error);
    }
  });
}

function manejarClickFavoritos(evento) {
  const boton = evento.target.closest(".favorite-button");
  if (!boton) {
    return;
  }

  toggleFavorito(boton.dataset.id);
}

function configurarMenuResponsive() {
  elementos.navToggle.addEventListener("click", () => {
    const estaAbierto = elementos.navLinks.classList.toggle("is-open");
    elementos.navToggle.setAttribute("aria-expanded", String(estaAbierto));
  });

  elementos.navLinks.addEventListener("click", (evento) => {
    if (evento.target.matches("a")) {
      elementos.navLinks.classList.remove("is-open");
      elementos.navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

function configurarEventos() {
  elementos.themeToggle.addEventListener("click", alternarTema);
  elementos.videojuegosGrid.addEventListener("click", manejarClickFavoritos);
  elementos.favoritosLista.addEventListener("click", manejarClickFavoritos);
  elementos.buscador.addEventListener("input", (evento) => {
    busquedaActual = evento.target.value;
    renderVideojuegos();
  });
  elementos.actualizarClima.addEventListener("click", obtenerClima);
  configurarMenuResponsive();
}

function iniciarAplicacion() {
  aplicarModoOscuro();
  renderConsolas();
  renderVideojuegos();
  renderFavoritos();
  configurarEventos();
  obtenerClima();
  registrarServiceWorker();
  console.log("PlayStation Zone iniciada correctamente.");
}

iniciarAplicacion();
