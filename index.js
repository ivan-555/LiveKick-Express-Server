// Pakete importieren
import express from 'express';  // Express Framework
import fetch from 'node-fetch'; // fetch API für Node.js
import dotenv from 'dotenv';  // dotenv Paket für Umgebungsvariablen
dotenv.config();  // liest die .env-Datei ein

// Erstellt eine Express-Anwendung
const app = express();

// Definiert einen GET-Endpunkt
// Wenn das Frontend diesen Endpunkt aufruft, wird dieser Code ausgeführt.
app.get("/api/matches", async (req, res) => {
  try {
    const API_KEY = process.env.API_KEY; // API-Schlüssel von Football-Data.org aus der .env-Datei laden
    const footballDataUrl = 'https://api.football-data.org/v4/competitions/2002/matches'; // URL für die Anfrage an Football-Data.org
    
    // Fetch Anfrage an Football-Data.org mit unserer URl
    const response = await fetch(footballDataUrl, {
      headers: {
        "X-Auth-Token": API_KEY  // Sendet den API-Key im Header mit.
      }
    });
    
    // Speichert die Response als JS Objekt
    const data = await response.json();

    // Setzt den CORS-Header auf "*". Das erlaubt allen Domains, die API aufzurufen.
    res.setHeader("Access-Control-Allow-Origin", "*");
    
    // Gibt die Response als JSON zurück (an den Client)
    res.json(data);

  } catch (error) {
    console.error(error); // Fehler in der Konsole ausgeben
    res.status(500).json({ error: "Fehler bei der Datenabfrage" }); // Statuscode und Fehlermeldung als JSON an den Client senden
  }
});

// Port definieren 
const PORT = process.env.PORT || 3000; // Port auf Umgebungsvariable (vom Hosting Anbieter vergeben) oder lokal auf 3000 setzen
app.listen(PORT, () => { // Server hört auf den Port und wartet auf HTTP Anfragen
  console.log(`Server läuft auf Port ${PORT}`); 
});
