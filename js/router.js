/**
 * Sistema di routing per ToDoShare
 */

// Definizione delle rotte
const routes = {
    '/': () => {
        // Reindirizza alla dashboard se l'utente è autenticato, altrimenti al login
        window.location.hash = isAuthenticated() ? '#/dashboard' : '#/login';
    },
    '/login': () => {
        if (isAuthenticated()) {
            window.location.hash = '#/dashboard';
            return;
        }
        
        const appContainer = document.getElementById('app');
        appContainer.innerHTML = '';
        appContainer.appendChild(renderLoginPage());
    },
    '/register': () => {
        if (isAuthenticated()) {
            window.location.hash = '#/dashboard';
            return;
        }
        
        const appContainer = document.getElementById('app');
        appContainer.innerHTML = '';
        appContainer.appendChild(renderRegisterPage());
    },
    '/dashboard': () => {
        if (!isAuthenticated()) {
            window.location.hash = '#/login';
            return;
        }
        
        const appContainer = document.getElementById('app');
        appContainer.innerHTML = '';
        
        // Aggiungi l'header
        const header = renderHeader();
        if (header) {
            appContainer.appendChild(header);
        }
        
        // Crea il contenitore principale
        const container = createElement('div', { className: 'container' });
        
        // Aggiungi la sezione di gamification
        container.appendChild(renderGamificationSection());
        
        // Aggiungi la dashboard
        const dashboard = createElement('div', { className: 'dashboard' });
        
        // Colonna 1: Todo List
        dashboard.appendChild(renderTodoListSection());
        
        // Colonna 2: File Upload
        dashboard.appendChild(renderFileUploadSection());
        
        // Colonna 3: Statistiche e informazioni
        const statsSection = createElement('div', { className: 'card' }, [
            createElement('h2', { className: 'card-title', textContent: 'Statistiche' }),
            createElement('div', { className: 'stats-container' }, [
                createElement('p', { textContent: `Attività completate: ${getCompletedTodosCount()}` }),
                createElement('p', { textContent: `Attività in corso: ${getPendingTodosCount()}` }),
                createElement('div', { style: 'display: flex; flex-direction: column; gap: 0.5rem; margin-top: 1rem' }, [
                    createElement('button', { 
                        className: 'btn btn-primary',
                        onClick: showShareModal,
                        textContent: 'Condividi la tua lista' 
                    }),
                    createElement('button', { 
                        className: 'btn btn-secondary',
                        onClick: showRewardsModal,
                        textContent: 'Mostra ricompense' 
                    })
                ])
            ])
        ]);
        dashboard.appendChild(statsSection);
        
        container.appendChild(dashboard);
        appContainer.appendChild(container);
    },
    '/404': () => {
        const appContainer = document.getElementById('app');
        appContainer.innerHTML = '';
        
        const container = createElement('div', { className: 'container' }, [
            createElement('div', { className: 'card' }, [
                createElement('h1', { textContent: 'Pagina non trovata' }),
                createElement('p', { textContent: 'La pagina che stai cercando non esiste.' }),
                createElement('a', { 
                    href: '#/', 
                    className: 'btn btn-primary',
                    textContent: 'Torna alla home' 
                })
            ])
        ]);
        
        appContainer.appendChild(container);
    }
};

// Funzione per gestire il cambio di rotta
const handleRouteChange = () => {
    const hash = window.location.hash.substring(1) || '/';
    const route = routes[hash] || routes['/404'];
    route();
};

// Inizializza il router
const initRouter = () => {
    window.addEventListener('hashchange', handleRouteChange);
    handleRouteChange();
};