# Regia del Matrimonio

Web app per organizzare il matrimonio: invitati (con +1, figli e foto), cose da fare e costi con proiezioni.
Si installa come app su **Windows** (Chrome o Edge) e su **Android** (Chrome) e funziona anche offline.
I dati si sincronizzano tra i dispositivi tramite un file sul tuo **Google Drive**.

---

## 1. Pubblicarla su GitHub Pages

1. Su github.com crea un nuovo repository, ad esempio `matrimonio`.
2. **Add file → Upload files** e trascina tutto il contenuto di questa cartella (`index.html`, `manifest.webmanifest`, `sw.js`, le cartelle `icons` e `fonts`). Poi **Commit changes**.
3. **Settings → Pages**: in *Build and deployment* scegli **Deploy from a branch**, branch `main`, cartella `/ (root)`, e salva.
4. Dopo 1–2 minuti l'app è online su `https://<tuo-utente>.github.io/matrimonio/`.

## 2. Creare il Client ID Google (una volta sola, circa 10 minuti)

Serve perché l'app possa scrivere nel tuo Drive. È gratuito.

1. Vai su <https://console.cloud.google.com> e crea un nuovo progetto (es. "Regia Matrimonio").
2. **API e servizi → Libreria**: cerca **Google Drive API** e clicca **Abilita**.
3. **Google Auth Platform** (o "Schermata consenso OAuth"):
   - *Branding*: nome app "Regia del Matrimonio" e la tua email.
   - *Pubblico/Audience*: tipo **Esterno**. Lascia l'app in **Test** e in *Utenti di test* aggiungi la tua email Google.
4. **Client → Crea client**: tipo **Applicazione web**.
   - In *Origini JavaScript autorizzate* aggiungi `https://<tuo-utente>.github.io` (senza `/matrimonio` alla fine).
   - Crea e copia il **Client ID** (finisce con `.apps.googleusercontent.com`).

## 3. Collegare Drive su ogni dispositivo

1. Apri l'app, tocca **Dati e backup**, incolla il Client ID e tocca **Salva Client ID**.
2. Tocca **Collega Google Drive** e accedi con il tuo account Google.
   Google avviserà che l'app "non è verificata": è normale per un'app personale in modalità test. Tocca **Continua**.
3. Ripeti su ogni dispositivo **con lo stesso account Google**.

Se non vuoi incollare il Client ID su ogni dispositivo, scrivilo in `index.html` alla riga
`const DEFAULT_CLIENT_ID='';` e ricarica il file su GitHub.

## 4. Installarla

- **Windows**: apri l'indirizzo con Chrome o Edge e clicca **Installa app** in alto nella pagina (oppure l'icona nella barra degli indirizzi). Finisce nel menu Start.
- **Android**: apri l'indirizzo con Chrome, menu **⋮ → Installa app** (o "Aggiungi a schermata Home"). Compare tra le app.

---

## Come funziona la sincronizzazione

- Su Drive l'app crea la cartella **Regia del Matrimonio** con `dati.json` e le foto degli invitati.
  Grazie al permesso `drive.file` l'app vede **solo** i file che ha creato lei, non il resto del tuo Drive.
- Ogni dispositivo tiene anche una copia locale, quindi l'app funziona offline. Le modifiche partono appena torna la connessione.
- Sincronizza da sola dopo ogni modifica, quando riapri l'app e ogni minuto mentre è aperta.
- Se modifichi cose diverse su due dispositivi, vengono unite. Se modifichi la **stessa** voce su entrambi, vince la modifica più recente.
- L'accesso a Google dura circa un'ora. Dopo, l'indicatore in alto diventa arancione ("tocca qui"): un tocco e riparte, di solito senza reinserire la password.
- Il pallino in alto indica lo stato: verde = sincronizzato, blu = in corso, arancione = da sincronizzare, rosso = errore.

## Backup

**Dati e backup → Esporta backup** crea un file `.json` con tutto, foto comprese. **Ripristina da backup** lo ricarica, e il ripristino si propaga anche a Drive e agli altri dispositivi.
C'è anche **Esporta invitati per Excel** (`.csv`).

## Aggiornare l'app

1. Modifica i file e, **ogni volta**, aumenta il numero di versione in due punti:
   - in `sw.js`: `const CACHE = 'matrimonio-v3';` → `matrimonio-v4`
   - in `index.html`: `const APP_VERSION='3';` → `'4'`
2. Carica i file modificati su GitHub.

Le app installate e aperte controllano gli aggiornamenti ogni 5 minuti e ogni volta che torni sull'app.
Quando c'è una versione nuova compare in basso **"È disponibile una nuova versione dell'app"**: tocca **Aggiorna** e l'app si ricarica.
Puoi anche controllare subito da **Dati e backup → Cerca aggiornamenti**. Il numero di versione è indicato in fondo alla stessa finestra.

- I dati non vengono toccati.
- GitHub Pages può impiegare fino a circa 10 minuti a distribuire i file nuovi, quindi l'avviso può arrivare con un po' di ritardo.
- Se dimentichi di cambiare la versione, l'app se ne accorge lo stesso quando cambia `index.html`. Icone e font però si aggiornano solo con il cambio di versione in `sw.js`.
