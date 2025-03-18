// Pakete importieren
import express from 'express';  // Express Framework
import fetch from 'node-fetch'; // fetch API für Node.js
import dotenv from 'dotenv';  // dotenv Paket für Umgebungsvariablen
import cors from 'cors'; // CORS für Cross-Origin-Requests

dotenv.config();  // liest die .env-Datei ein
const app = express(); // Erstellt eine Express-Anwendung
app.use(cors()); // CORS Middleware aktivieren
const API_KEY = process.env.API_KEY; // API-Schlüssel aus der .env-Datei laden

// Array mit den Ligen, die wir verwenden wollen und deren IDs
const footballDataOrgLeagues = [
  { name: 'bundesliga', id: 2002 },
  { name: 'premier-league', id: 2021 },
  { name: 'la-liga', id: 2014 },
  { name: 'serie-a', id: 2019 },
  { name: 'ligue-1', id: 2015 },
  { name: 'champions-league', id: 2001 }
];
const theSportsDbLeagues = [
  { name: 'bundesliga', id: 4331 },
  { name: 'premier-league', id: 4328 },
  { name: 'la-liga', id: 4335 },
  { name: 'serie-a', id: 4332 },
  { name: 'ligue-1', id: 4334 },
  { name: 'champions-league', id: 4480 }
];

// currentSeasons Objekt, in dem wir die aktuelle Saison für jede Liga speichern
const currentSeasons = {
  'bundesliga': null,
  'premier-league': null,
  'la-liga': null,
  'serie-a': null,
  'ligue-1': null,
  'champions-league': null
}

// matchesCache, in dem wir pro Liga die zuletzt geholten Matches ablegen
const matchesCache = {
  'bundesliga': null,
  'premier-league': null,
  'la-liga': null,
  'serie-a': null,
  'ligue-1': null,
  'champions-league': null
};

// tableCache, in dem wir pro Liga die zuletzt geholte Tabelle ablegen
const tableCache = {
  'bundesliga': null,
  'premier-league': null,
  'la-liga': null,
  'serie-a': null,
  'ligue-1': null,
  'champions-league': null
};

// Fetch Funktion für das Aktualisieren der aktuellen Saison Werten (für theSportsDb API benötigt)
async function updateCurrentSeasons() {
  for (const league of theSportsDbLeagues) {
    try {
      const response = await fetch(`https://www.thesportsdb.com/api/v1/json/3/lookupleague.php?id=${league.id}`);
      const data = await response.json();

      currentSeasons[league.name] = data.leagues[0].strCurrentSeason; // Aktuelle Saison in das currentSeasons Objekt speichern (zb 2024 - 2025)
    } catch (err) {
      console.error(`Fehler beim Abrufen der Saison für ${league.name}:`, err);
    }
  }
}

// Fetch Funktion für das Aktualisieren des matchesCaches
async function updateMatchesCache() {
  for (const league of footballDataOrgLeagues) {
    try {
      const response = await fetch(`https://api.football-data.org/v4/competitions/${league.id}/matches`, {
        headers: { 'X-Auth-Token': API_KEY }
      });
      const data = await response.json();
      
      // Im cache-Objekt ablegen
      matchesCache[league.name] = data;
    } catch (err) {
      console.error(`Fehler beim Aktualisieren der ${league.name} Spiele:`, err);
    }
  }
}

// Fetch Funktion für das Aktualisieren des tableCaches
async function updateTableCache() {
  for (const league of theSportsDbLeagues) {
    try {
      const season = currentSeasons[league.name]
      const response = await fetch(`https://www.thesportsdb.com/api/v1/json/3/lookuptable.php?l=${league.id}&s=${season}`);
      const data = await response.json();
      
      // Im cache-Objekt ablegen
      tableCache[league.name] = data;
    } catch (err) {
      console.error(`Fehler beim Aktualisieren der ${league.name} Tabelle:`, err);
    }
  }
}

// Bei Serverstart initial aufrufen
// await wartet auf das Ergebnis der update Funktionen bevor der Server
// get Anfragen entgegen nimmt. Dadurch wird sichergestellt, dass die
// Daten im Cache sind bevor sie ans Frontend geschickt werden.
// Das ist wichtig da Render den Server in den Sleep Modus versetzt und
// beim aufwachen die Daten im Cache wieder null sind.
await updateCurrentSeasons();
await updateMatchesCache(); 
await updateTableCache();
// Dann Interval setzen
setInterval(updateMatchesCache, 60000); // alle 60 Sekunden
setInterval(updateCurrentSeasons, 60000); // alle 60 Sekunden
setInterval(updateTableCache, 60000); // alle 60 Sekunden


// Get Endpunkt für Liga Matches definieren
footballDataOrgLeagues.forEach(league => {
  app.get(`/${league.name}/matches`, (req, res) => {
    const data = matchesCache[league.name];
    if (!data) {
      return res.status(503).json({ error: `Noch keine Daten für ${league.name} im Cache` });
    }
    res.json(data); // Daten aus dem Cache zurückgeben
  });
});

// Get Endpunkt für Liga Tabelle definieren
theSportsDbLeagues.forEach(league => {
  app.get(`/${league.name}/table`, (req, res) => {
    const data = tableCache[league.name];
    if (!data) {
      return res.status(503).json({ error: `Noch keine Daten für ${league.name} im Cache` });
    }
    res.json(data); // Daten aus dem Cache zurückgeben
  });
});


// Port definieren 
const PORT = process.env.PORT || 3000; // Port auf Umgebungsvariable (vom Hosting Anbieter vergeben) oder lokal auf 3000 setzen
app.listen(PORT, () => { // Server hört auf den Port und wartet auf HTTP Anfragen
  console.log(`Server läuft auf Port ${PORT}`);
});