## LiveKick Express Server

### Projektbeschreibung

Dies ist ein Express-Server, der als Proxy für die football-data.org und TheSportsDB API dient, um Fußballspiele, Ergebnisse und Ligadaten zu fetchen.
Die bereitgestellten Daten werden für meine Fußball-Anwendung [LiveKick](https://github.com/ivan-555/LiveKick) genutzt.

### Funktion

- Abruf von Fußballspieldaten für verschiedene Ligen (Serie A, Bundesliga, Premier League, La Liga, Ligue 1, Champions League).
- Proxy-Service, der API-Daten an das Frontend weitergibt und so CORS-Probleme umgeht.


### Technologien

- Node.js
- Express.js
- Git

### Deployment

Gehostet auf Render unter: https://livekick-express-server.onrender.com

### Get Endpunkte

#### Spiele:

- https://livekick-express-server.onrender.com/serie-a/matches
- https://livekick-express-server.onrender.com/bundesliga/matches
- https://livekick-express-server.onrender.com/premier-league/matches
- https://livekick-express-server.onrender.com/la-liga/matches
- https://livekick-express-server.onrender.com/ligue-1/matches
- https://livekick-express-server.onrender.com/champions-league/matches

#### Tabelle:

- https://livekick-express-server.onrender.com/serie-a/table
- https://livekick-express-server.onrender.com/bundesliga/table
- https://livekick-express-server.onrender.com/premier-league/table
- https://livekick-express-server.onrender.com/la-liga/table
- https://livekick-express-server.onrender.com/ligue-1/table
- https://livekick-express-server.onrender.com/champions-league/table
