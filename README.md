## LiveKick Express Server

### Projektbeschreibung

Dies ist ein Express-Server, der als Proxy zur Football-Data.org API dient, um Fußballspiele, Ergebnisse und Ligadaten bereitzustellen.
Diese Daten verwende ich für meine Fußball Anwendung [LiveKick](https://github.com/ivan-555/LiveKick).

### Funktion

Abruf von Fußballspieldaten für verschiedene Ligen (Serie A, Bundesliga, Premier League, La Liga, Ligue 1, Champions League).
Proxy-Server, der API-Daten ohne CORS-Probleme an das Frontend liefert.

### Technologien

- Node.js: JavaScript-Laufzeitumgebung.
- Express.js: Web-Framework für Node.js.
- node-fetch: HTTP-Client für API-Anfragen.
- Git: Versionskontrolle


### Deployment

Gehostet auf Render unter: https://livekick-express-server.onrender.com

Lokal verfügbar unter: http://localhost:3000


### API-Endpunkte

https://livekick-express-server.onrender.com/api/matches  --> Alle Spiele der Bundesliga
