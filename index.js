// Pakete importieren
import express from 'express';  // Express Framework
import fetch from 'node-fetch'; // fetch API für Node.js
import dotenv from 'dotenv';  // dotenv Paket für Umgebungsvariablen
import cors from 'cors'; // CORS für Cross-Origin-Requests

dotenv.config();  // liest die .env-Datei ein
const app = express(); // Erstellt eine Express-Anwendung
app.use(cors()); // CORS Middleware aktivieren
const API_KEY = process.env.API_KEY; // API-Schlüssel aus der .env-Datei laden

// cache-Objekt, in dem wir pro Liga die zuletzt geholten Daten ablegen
const cache = {
  'bundesliga': null,
  'premier-league': null,
  'la-liga': null,
  'serie-a': null,
  'ligue-1': null,
  'champions-league': null
};

const leagues = [
  { name: 'bundesliga', id: 2002 },
  { name: 'premier-league', id: 2021 },
  { name: 'la-liga', id: 2014 },
  { name: 'serie-a', id: 2019 },
  { name: 'ligue-1', id: 2015 },
  { name: 'champions-league', id: 2001 }
];

// Fetch Funktion für das Aktualisieren des Caches
async function updateCache() {
  for (const league of leagues) {
    try {
      const response = await fetch(`https://api.football-data.org/v4/competitions/${league.id}/matches`, {
        headers: { 'X-Auth-Token': API_KEY }
      });
      const data = await response.json();
      
      // Im cache-Objekt ablegen
      cache[league.name] = data;
    } catch (err) {
      console.error(`Fehler beim Aktualisieren von ${league.name}:`, err);
    }
  }
}

// Bei Serverstart einmal initial aufrufen
updateCache();

// Dann alle 60 Sekunden neu fetchen
setInterval(updateCache, 60_000);

// Get Endpunkt für jede Liga definieren
leagues.forEach(league => {
  app.get(`/${league.name}/matches`, (req, res) => {
    const data = cache[league.name];
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