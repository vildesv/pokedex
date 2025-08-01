// Elementreferanser
const container = document.getElementById("pokemon-container");
const favoritesContainer = document.getElementById("favorites-container");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const typeSelect = document.getElementById("type-select");
const generationSelect = document.getElementById("generation-select");

// Opprett valgt Pokémon-container
const selectedPokemonContainer = document.createElement("div");
selectedPokemonContainer.id = "selected-pokemon-container";
selectedPokemonContainer.style.margin = "1rem auto";
selectedPokemonContainer.style.maxWidth = "600px";
selectedPokemonContainer.style.textAlign = "center";
document.querySelector(".app").insertBefore(selectedPokemonContainer, container);

// Variabel for valgt Pokémon
let selectedPokemon = null;

// Ved oppstart: hent type- og generasjonsvalg, og oppdater favoritter
fetchTypes();
fetchGenerations();
updateFavorites();

// HENT TYPER
async function fetchTypes() {
  const res = await fetch("https://pokeapi.co/api/v2/type");
  const data = await res.json();
  data.results.forEach(type => {
    const option = document.createElement("option");
    option.value = type.name;
    option.textContent = capitalize(type.name);
    typeSelect.appendChild(option);
  });
}

// HENT GENERASJONER
async function fetchGenerations() {
  const res = await fetch("https://pokeapi.co/api/v2/generation");
  const data = await res.json();
  data.results.forEach((gen, i) => {
    const option = document.createElement("option");
    option.value = i + 1;
    option.textContent = `Generasjon ${i + 1}`;
    generationSelect.appendChild(option);
  });
}

// SØK PÅ NAVN
searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const query = searchInput.value.trim().toLowerCase();
  if (!query) return;
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);
  if (res.ok) {
    const data = await res.json();
    clearSelectedPokemon();
    setSelectedPokemon(data);
  } else {
    alert("Fant ingen Pokémon med det navnet.");
  }
  // Nullstill filtre og visning av Pokémon-listen
  typeSelect.value = "";
  generationSelect.value = "";
  container.innerHTML = "";
});

// FILTER: Endring i type eller generasjon
typeSelect.addEventListener("change", handleTypeOrGenChange);
generationSelect.addEventListener("change", handleTypeOrGenChange);

// Kombinert filtrering
async function handleTypeOrGenChange() {
  const type = typeSelect.value;
  const gen = generationSelect.value;

  clearSelectedPokemon();
  container.innerHTML = "";

  if (!type && !gen) return;

  let pokemons = [];

  // Hent Pokémon fra valgt generasjon
  if (gen) {
    const res = await fetch(`https://pokeapi.co/api/v2/generation/${gen}`);
    const data = await res.json();
    const species = data.pokemon_species;

    // Sorter Pokémon etter ID
    species.sort((a, b) => {
      const idA = parseInt(a.url.split("/")[6]);
      const idB = parseInt(b.url.split("/")[6]);
      return idA - idB;
    });

    // Hent full data for hver Pokémon
    const promises = species.map(s =>
      fetch(`https://pokeapi.co/api/v2/pokemon/${s.name}`).then(res => res.json())
    );
    pokemons = await Promise.all(promises);
  } else {
    // Hvis kun type er valgt
    const res = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
    const data = await res.json();
    const promises = data.pokemon.map(p => fetch(p.pokemon.url).then(res => res.json()));
    pokemons = await Promise.all(promises);
  }

  // Hvis både type og generasjon er valgt, filtrer etter type
  if (gen && type) {
    pokemons = pokemons.filter(p =>
      p.types.some(t => t.type.name === type)
    );
  }

  // Sorter og vis Pokémon
  pokemons = pokemons.sort((a, b) => a.id - b.id);
  pokemons.forEach(p => renderPokemonCard(p, container));
}

// VALGT POKÉMON
function setSelectedPokemon(pokemon) {
  selectedPokemon = pokemon;

  selectedPokemonContainer.innerHTML = `
    <div class="selected-pokemon-card">
      <img src="${pokemon.sprites.front_default}" alt="${capitalize(pokemon.name)}" class="selected-pokemon-img" />
      <h3>${capitalize(pokemon.name)}</h3>
      <div class="types-container">
        ${pokemon.types.map(t => `<span class="type-badge ${t.type.name}">${capitalize(t.type.name)}</span>`).join("")}
      </div>
      <div style="margin-top: 1rem;">
        <button id="favorite-toggle-btn">${isFavorite(pokemon.name) ? "💔 Fjern favoritt" : "❤️ Legg til favoritt"}</button>
        <button id="remove-selected-btn" style="margin-left: 0.5rem;">✖️ Fjern</button>
      </div>
    </div>
  `;

  document.getElementById("remove-selected-btn").addEventListener("click", () => {
    clearSelectedPokemon();
  });

  document.getElementById("favorite-toggle-btn").addEventListener("click", () => {
    toggleFavorite(pokemon.name);
    const btn = document.getElementById("favorite-toggle-btn");
    btn.textContent = isFavorite(pokemon.name) ? "💔 Fjern favoritt" : "❤️ Legg til favoritt";
    updateFavorites();
  });
}

// Fjern valgt Pokémon
function clearSelectedPokemon() {
  selectedPokemon = null;
  selectedPokemonContainer.innerHTML = "";
  container.innerHTML = "";
}

// FLIP-KORT
function renderPokemonCard(pokemon, parentContainer) {
  const card = document.createElement("div");
  card.className = "pokemon-card";

  const inner = document.createElement("div");
  inner.className = "card-inner";

  const front = document.createElement("div");
  front.className = "card-front";

  const imgContainer = document.createElement("div");
  imgContainer.className = "pokemon-image-container";

  const img = document.createElement("img");
  img.src = pokemon.sprites.front_default || "";
  img.alt = capitalize(pokemon.name);
  img.className = "pokemon-img";
  imgContainer.appendChild(img);

  const info = document.createElement("div");
  info.className = "card-info";

  const nameEl = document.createElement("div");
  nameEl.className = "pokemon-name";
  nameEl.textContent = capitalize(pokemon.name);

  const typesContainer = document.createElement("div");
  typesContainer.className = "types-container";
  pokemon.types.forEach(t => {
    const typeSpan = document.createElement("span");
    typeSpan.className = `type-badge ${t.type.name}`;
    typeSpan.textContent = capitalize(t.type.name);
    typesContainer.appendChild(typeSpan);
  });

  info.append(nameEl, typesContainer);
  front.append(imgContainer, info);

  const back = document.createElement("div");
  back.className = "card-back";
  back.innerHTML = `
    <div class="pokemon-text-top">POKÉMON</div>
    <div class="pokeball-back"></div>
    <div class="pokemon-text-bottom">POKÉMON</div>
  `;

  inner.append(front, back);
  card.appendChild(inner);
  parentContainer.appendChild(card);

  card.addEventListener("click", () => {
    clearSelectedPokemon();
    setSelectedPokemon(pokemon);
    container.innerHTML = "";
  });
}

// FAVORITTER
function toggleFavorite(name) {
  const favorites = getFavorites();
  if (favorites.includes(name)) {
    localStorage.setItem("favorites", JSON.stringify(favorites.filter(f => f !== name)));
  } else {
    favorites.push(name);
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }
}

function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites")) || [];
}

function isFavorite(name) {
  return getFavorites().includes(name);
}

async function updateFavorites() {
  favoritesContainer.innerHTML = "";
  const favorites = getFavorites();
  for (const name of favorites) {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      if (res.ok) {
        const data = await res.json();
        renderPokemonCard(data, favoritesContainer);
      }
    } catch (error) {
      console.error("Feil ved henting av favoritt:", error);
    }
  }
}

// Hjelpefunksjon: Gjør første bokstav stor
function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// NULLSTILL / RESET KNAPP
const resetBtn = document.getElementById("reset-btn");
resetBtn.addEventListener("click", () => {
  // Nullstill søk og filtervalg
  searchInput.value = "";
  typeSelect.value = "";
  generationSelect.value = "";

  // Nullstill visninger
  clearSelectedPokemon();
  container.innerHTML = "";

  // Oppdater favoritter på nytt (visning)
  updateFavorites();
});
