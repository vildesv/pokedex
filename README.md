# 🎮 Pokédex - Pokémon API-prosjekt

Dette prosjektet er laget for å øve på asynkron JavaScript, med fokus på bruk av `async/await` og `promises` for å hente og håndtere data fra et eksternt API — i dette tilfellet [PokeAPI](https://pokeapi.co/).

---

## ⚙️ Funksjonalitet

- 🔍 **Søk etter Pokémon:** Brukeren kan søke opp en Pokémon basert på navn.
- 🧩 **Filtrering:** Mulighet for å filtrere Pokémon basert på type og generasjon, enkeltvis eller kombinert.
- ⭐ **Favoritter:** Legge til og fjerne Pokémon i en lokal favorittliste lagret i `localStorage`.
- 🃏 **Visning:** Interaktiv visning av Pokémon som kort med flip-effekt, samt detaljvisning av valgt Pokémon.
- 🔄 **Reset-knapp:** Tilbakestiller søk, filtrering og visning uten å laste siden på nytt.

---

## 📝 Hvordan prosjektet dekker oppgavekravene

### 🕸️ Flere ulike API-endepunkter  
Prosjektet henter data fra flere PokeAPI-endepunkter:  
- `/type` — for å hente alle typer  
- `/generation` — for å hente generasjoner  
- `/pokemon/{name}` — for å hente detaljert informasjon om enkelt-Pokémon  
- `/type/{type}` — for å hente Pokémon med valgt type  
- `/generation/{gen}` — for å hente Pokémon fra valgt generasjon

### 🔗 Bruk av URL-parametre  
API-kallene bruker dynamiske parametre i URL-ene, f.eks. navn på Pokémon, type eller generasjon for å hente spesifikke data.

### 🔄 Løkker for å hente og generere innhold  
Når data hentes fra API-et, kjøres det gjennom løkker for å hente data om flere Pokémon samtidig (med `Promise.all`), samt for å generere HTML-innhold dynamisk.

### ⚡ Asynkron JavaScript med async/await og promises  
Alle API-kall håndteres med `async/await` for lesbar og effektiv asynkron kode, og `Promise.all` brukes for parallell lasting av flere ressurser.

---

## 🛠️ Teknologier brukt

- JavaScript (ES6+) med async/await og promises  
- Fetch API for asynkrone HTTP-forespørsler  
- HTML og CSS for struktur og styling  
- LocalStorage for lagring av brukerfavoritter

---

## 🎓 Hva jeg har lært

- Hvordan håndtere flere API-endepunkter i samme prosjekt  
- Bruk av URL-parametre for dynamisk datahenting  
- Effektiv håndtering av asynkrone operasjoner med løkker og `Promise.all`  
- Bygge interaktiv brukergrensesnitt med dynamisk innhold  
