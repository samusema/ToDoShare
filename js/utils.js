/**
 * Funzioni di utilità per l'applicazione ToDoShare
 */

// Funzione per creare elementi DOM con attributi e figli
const createElement = (tag, attributes = {}, children = []) => {
    const element = document.createElement(tag);
    
    // Imposta gli attributi
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'className') {
            element.className = value;
        } else if (key === 'textContent') {
            element.textContent = value;
        } else if (key.startsWith('on') && typeof value === 'function') {
            element.addEventListener(key.substring(2).toLowerCase(), value);
        } else {
            element.setAttribute(key, value);
        }
    });
    
    // Aggiunge i figli
    children.forEach(child => {
        if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child));
        } else if (child instanceof Node) {
            element.appendChild(child);
        }
    });
    
    return element;
};

// Funzione per generare un ID univoco
const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Funzione per formattare la data
const formatDate = (date) => {
    return new Date(date).toLocaleDateString('it-IT', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Funzione per mostrare una notifica
const showNotification = (message, type = 'info') => {
    const notification = createElement('div', {
        className: `notification notification-${type}`,
        textContent: message
    });
    
    document.body.appendChild(notification);
    
    // Rimuovi la notifica dopo 3 secondi
    setTimeout(() => {
        notification.classList.add('notification-hide');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
};

// Funzione per salvare dati nel localStorage
const saveToStorage = (key, data) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Errore nel salvataggio dei dati:', error);
        return false;
    }
};

// Funzione per recuperare dati dal localStorage
const getFromStorage = (key, defaultValue = null) => {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
        console.error('Errore nel recupero dei dati:', error);
        return defaultValue;
    }
};

// Funzione per rimuovere dati dal localStorage
const removeFromStorage = (key) => {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('Errore nella rimozione dei dati:', error);
        return false;
    }
};

// Funzione per controllare se l'utente è autenticato
const isAuthenticated = () => {
    return !!getFromStorage('user');
};

// Funzione per attivare/disattivare la modalità scura
const toggleDarkMode = () => {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    saveToStorage('darkMode', isDarkMode);
    return isDarkMode;
};

// Funzione per inizializzare la modalità scura in base alle preferenze salvate
const initDarkMode = () => {
    const isDarkMode = getFromStorage('darkMode', false);
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }
};