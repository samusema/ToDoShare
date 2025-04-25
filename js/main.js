/**
 * File principale per l'applicazione ToDoShare
 */

// Funzione di inizializzazione dell'applicazione
const initApp = () => {
    // Inizializza la modalità scura in base alle preferenze salvate
    initDarkMode();
    
    // Inizializza il router
    initRouter();
    
    // Aggiungi event listener per il drag and drop dei file
    document.addEventListener('DOMContentLoaded', () => {
        // Inizializza il drag and drop quando la dashboard è caricata
        if (window.location.hash === '#/dashboard') {
            initDragAndDrop();
        }
    });
    
    // Aggiungi event listener per il cambio di rotta
    window.addEventListener('hashchange', () => {
        // Inizializza il drag and drop quando la dashboard è caricata
        if (window.location.hash === '#/dashboard') {
            setTimeout(initDragAndDrop, 100);
        }
    });
    
    console.log('ToDoShare inizializzato con successo!');
};

// Avvia l'applicazione
initApp();