# GyManagement

## Progetto per il corso di Programmazione Web e Mobile

### Descrizione del Progetto

GyManagement è un'applicazione web e mobile per la gestione di una palestra. Permette di gestire le interazioni tra amministratori, trainer e clienti, facilitando la prenotazione di sessioni di allenamento.

### Funzionalità Principali

#### Per i Clienti
- Visualizzazione e prenotazione di sessioni di allenamento
- Dashboard personalizzata con allenamenti programmati
- Sistema di valutazione dei trainer
- Gestione del profilo personale

#### Per i Trainer
- Creazione e gestione di slot di allenamento
- Visualizzazione degli allenamenti programmati e passati
- Dashboard con statistiche e informazioni rilevanti
- Visualizzazione delle recensioni ricevute

#### Per gli Amministratori
- Gestione completa degli utenti (trainer e clienti)
- Visualizzazione delle statistiche generali

### Installazione

1. Clona il repository:
   ```bash
   git clone https://github.com/tuoutente/gymanagement.git
   cd gymanagement
   ```

2. Installa le dipendenze:
   ```bash
   npm install
   ```

3. Avvia il server di sviluppo:
   ```bash
   ionic serve
   ```

4. L'applicazione sarà disponibile all'indirizzo: `http://localhost:8100/`

### Struttura del Progetto

La struttura del progetto segue l'architettura con componenti organizzati per funzionalità:

```
src/
├── app/
│   ├── admin/      # Componenti per gli amministratori
│   ├── auth/       # Autenticazione e gestione utenti
│   ├── customer/   # Componenti per i clienti
│   ├── home/       # Homepage e landing pages
│   ├── services/   # Servizi condivisi
│   ├── shared/     # Componenti riutilizzabili
│   └── trainer/    # Componenti per i trainer
├── assets/         # Risorse statiche
└── theme/          # Variabili e temi globali
```

### Autori

- Matteo Genovese, 0762888
- Flavio Vitale, 0750498
- Daniele D'Alba, 0764332
- Andrea Carollo, 0762843

### Note Accademiche

Progetto sviluppato per il corso di Programmazione Web e Mobile
Università di Palermo
Anno Accademico 2024-2025

---

**Nota:** Questo progetto è stato creato a scopo educativo e accademico.
