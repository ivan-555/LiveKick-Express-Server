// Pakete importieren
import express from 'express';  // Express Framework
import fetch from 'node-fetch'; // fetch API für Node.js
import dotenv from 'dotenv';  // dotenv Paket für Umgebungsvariablen
dotenv.config();  // liest die .env-Datei ein
import cors from 'cors'; // CORS für Cross-Origin-Requests

const app = express(); // Erstellt eine Express-Anwendung
app.use(cors()); // CORS Middleware aktivieren
const API_KEY = process.env.API_KEY; // API-Schlüssel aus der .env-Datei laden

const leagues = [
  { name: 'bundesliga', id: 2002 },
  { name: 'premier-league', id: 2021 },
  { name: 'la-liga', id: 2014 },
  { name: 'serie-a', id: 2019 },
  { name: 'ligue-1', id: 2015 },
  { name: 'champions-league', id: 2001 }
];

leagues.forEach(league => {
  app.get(`/${league.name}/matches`, async (req, res) => { // Definiert den GET-Endpunkt den das Frontend aufrufen kann
    try {
      const response = await fetch(`https://api.football-data.org/v4/competitions/${league.id}/matches`, {
        headers: { 'X-Auth-Token': API_KEY }
      });
      const data = await response.json(); // Speichert die Response als JS Objekt
      res.json(data); // Gibt die Response als JSON zurück (an den Client)
    } catch (error) {
      console.error(error); // Fehler in der Konsole ausgeben
      res.status(500).json({ error: `Fehler beim Abrufen der Daten für ${league.name}` }); // Statuscode und Fehlermeldung als JSON an den Client senden
    }
  });
});

// Port definieren 
const PORT = process.env.PORT || 3000; // Port auf Umgebungsvariable (vom Hosting Anbieter vergeben) oder lokal auf 3000 setzen
app.listen(PORT, () => { // Server hört auf den Port und wartet auf HTTP Anfragen
  console.log(`Server läuft auf Port ${PORT}`);
});