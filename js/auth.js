/**
 * Gestione dell'autenticazione per ToDoShare
 */

// Funzione per renderizzare la pagina di login
const renderLoginPage = () => {
    const container = createElement('div', { className: 'container login-container' });
    
    const loginCard = createElement('div', { className: 'card' }, [
        createElement('h1', { className: 'login-title', textContent: 'Accedi a ToDoShare' }),
        
        createElement('form', { id: 'login-form', onSubmit: handleLogin }, [
            createElement('div', { className: 'form-group' }, [
                createElement('label', { className: 'form-label', for: 'name', textContent: 'Nome' }),
                createElement('input', { 
                    className: 'form-input', 
                    type: 'text', 
                    id: 'name', 
                    name: 'name', 
                    placeholder: 'Inserisci il tuo nome',
                    required: 'true'
                })
            ]),
            
            createElement('div', { className: 'form-group' }, [
                createElement('label', { className: 'form-label', for: 'email', textContent: 'Email' }),
                createElement('input', { 
                    className: 'form-input', 
                    type: 'email', 
                    id: 'email', 
                    name: 'email', 
                    placeholder: 'Inserisci la tua email',
                    required: 'true'
                })
            ]),
            
            createElement('button', { 
                className: 'btn btn-primary', 
                type: 'submit',
                style: 'width: 100%',
                textContent: 'Accedi' 
            })
        ]),
        
        createElement('p', { 
            className: 'login-footer', 
            style: 'text-align: center; margin-top: 1rem' 
        }, [
            createElement('span', { textContent: 'Non hai un account? ' }),
            createElement('a', { 
                href: '#/register', 
                textContent: 'Registrati' 
            })
        ])
    ]);
    
    container.appendChild(loginCard);
    return container;
};

// Funzione per renderizzare la pagina di registrazione
const renderRegisterPage = () => {
    const container = createElement('div', { className: 'container login-container' });
    
    const registerCard = createElement('div', { className: 'card' }, [
        createElement('h1', { className: 'login-title', textContent: 'Registrati a ToDoShare' }),
        
        createElement('form', { id: 'register-form', onSubmit: handleRegister }, [
            createElement('div', { className: 'form-group' }, [
                createElement('label', { className: 'form-label', for: 'register-name', textContent: 'Nome' }),
                createElement('input', { 
                    className: 'form-input', 
                    type: 'text', 
                    id: 'register-name', 
                    name: 'name', 
                    placeholder: 'Inserisci il tuo nome',
                    required: 'true'
                })
            ]),
            
            createElement('div', { className: 'form-group' }, [
                createElement('label', { className: 'form-label', for: 'register-email', textContent: 'Email' }),
                createElement('input', { 
                    className: 'form-input', 
                    type: 'email', 
                    id: 'register-email', 
                    name: 'email', 
                    placeholder: 'Inserisci la tua email',
                    required: 'true'
                })
            ]),
            
            createElement('div', { className: 'form-group' }, [
                createElement('label', { className: 'form-label', for: 'register-password', textContent: 'Password' }),
                createElement('input', { 
                    className: 'form-input', 
                    type: 'password', 
                    id: 'register-password', 
                    name: 'password', 
                    placeholder: 'Inserisci una password',
                    required: 'true',
                    minLength: '6'
                })
            ]),
            
            createElement('div', { className: 'form-group' }, [
                createElement('label', { className: 'form-label', for: 'register-password-confirm', textContent: 'Conferma Password' }),
                createElement('input', { 
                    className: 'form-input', 
                    type: 'password', 
                    id: 'register-password-confirm', 
                    name: 'password-confirm', 
                    placeholder: 'Conferma la tua password',
                    required: 'true',
                    minLength: '6'
                })
            ]),
            
            createElement('button', { 
                className: 'btn btn-primary', 
                type: 'submit',
                style: 'width: 100%',
                textContent: 'Registrati' 
            })
        ]),
        
        createElement('p', { 
            className: 'login-footer', 
            style: 'text-align: center; margin-top: 1rem' 
        }, [
            createElement('span', { textContent: 'Hai già un account? ' }),
            createElement('a', { 
                href: '#/login', 
                textContent: 'Accedi' 
            })
        ])
    ]);
    
    container.appendChild(registerCard);
    return container;
};

// Funzione per gestire la registrazione
const handleRegister = (event) => {
    event.preventDefault();
    
    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const passwordConfirm = document.getElementById('register-password-confirm').value;
    
    if (!name || !email || !password) {
        showNotification('Tutti i campi sono obbligatori', 'error');
        return;
    }
    
    if (password !== passwordConfirm) {
        showNotification('Le password non coincidono', 'error');
        return;
    }
    
    // Verifica se l'email è già registrata (simulazione)
    const users = getFromStorage('users', []);
    if (users.some(user => user.email === email)) {
        showNotification('Email già registrata', 'error');
        return;
    }
    
    // Crea un nuovo utente
    const newUser = {
        id: generateId(),
        name,
        email,
        password, // Nota: in un'app reale, la password dovrebbe essere criptata
        avatar: 'assets/images/avatar.png',
        level: 1,
        xp: 0,
        xpToNextLevel: 100,
        createdAt: new Date().toISOString()
    };
    
    // Salva l'utente nell'elenco degli utenti
    users.push(newUser);
    saveToStorage('users', users);
    
    // Salva l'utente corrente (login automatico)
    const currentUser = { ...newUser };
    delete currentUser.password; // Rimuovi la password dall'utente corrente
    saveToStorage('user', currentUser);
    
    // Inizializza i dati dell'utente
    if (!getFromStorage('todos')) {
        // Crea alcuni todo di esempio
        const exampleTodos = [
            {
                id: generateId(),
                text: 'Benvenuto in ToDoShare! Questo è un esempio di attività',
                completed: false,
                priority: 'medium',
                tags: ['esempio', 'benvenuto'],
                createdAt: new Date().toISOString()
            },
            {
                id: generateId(),
                text: 'Completa le attività per guadagnare XP e salire di livello',
                completed: false,
                priority: 'high',
                tags: ['gamification'],
                createdAt: new Date().toISOString()
            }
        ];
        saveToStorage('todos', exampleTodos);
    }
    
    showNotification(`Registrazione completata! Benvenuto, ${name}!`, 'success');
    
    // Reindirizza alla dashboard
    window.location.hash = '#/dashboard';
};

// Funzione per gestire il login
const handleLogin = (event) => {
    event.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    
    if (!name || !email) {
        showNotification('Inserisci nome ed email per accedere', 'error');
        return;
    }
    
    // Verifica se l'utente esiste (simulazione)
    const users = getFromStorage('users', []);
    const user = users.find(u => u.email === email);
    
    if (user) {
        // Utente trovato, verifica il nome
        if (user.name !== name) {
            showNotification('Nome non corretto per questa email', 'error');
            return;
        }
        
        // Login riuscito
        const currentUser = { ...user };
        delete currentUser.password; // Rimuovi la password dall'utente corrente
        saveToStorage('user', currentUser);
        
        showNotification(`Bentornato, ${name}!`, 'success');
    } else {
        // Utente non trovato, crea un nuovo utente (per semplicità)
        const newUser = {
            id: generateId(),
            name,
            email,
            avatar: 'assets/images/avatar.png',
            level: 1,
            xp: 0,
            xpToNextLevel: 100,
            createdAt: new Date().toISOString()
        };
        
        // Salva l'utente nell'elenco degli utenti
        users.push(newUser);
        saveToStorage('users', users);
        
        // Salva l'utente corrente
        saveToStorage('user', newUser);
        
        // Inizializza i dati dell'utente
        if (!getFromStorage('todos')) {
            // Crea alcuni todo di esempio
            const exampleTodos = [
                {
                    id: generateId(),
                    text: 'Benvenuto in ToDoShare! Questo è un esempio di attività',
                    completed: false,
                    priority: 'medium',
                    tags: ['esempio', 'benvenuto'],
                    createdAt: new Date().toISOString()
                },
                {
                    id: generateId(),
                    text: 'Completa le attività per guadagnare XP e salire di livello',
                    completed: false,
                    priority: 'high',
                    tags: ['gamification'],
                    createdAt: new Date().toISOString()
                }
            ];
            saveToStorage('todos', exampleTodos);
        }
        
        showNotification(`Benvenuto, ${name}!`, 'success');
    }
    
    // Reindirizza alla dashboard
    window.location.hash = '#/dashboard';
};

// Funzione per effettuare il logout
const logout = () => {
    removeFromStorage('user');
    showNotification('Logout effettuato con successo', 'info');
    window.location.hash = '#/login';
};

// Funzione per renderizzare l'header con le informazioni dell'utente
const renderHeader = () => {
    const user = getFromStorage('user');
    
    if (!user) return null;
    
    const header = createElement('header', { className: 'header' }, [
        createElement('div', { className: 'logo', textContent: 'ToDoShare' }),
        
        createElement('div', { className: 'user-info' }, [
            createElement('span', { textContent: user.name }),
            createElement('img', { 
                className: 'avatar', 
                src: user.avatar, 
                alt: `Avatar di ${user.name}` 
            }),
            createElement('button', { 
                className: 'theme-toggle', 
                title: 'Cambia tema',
                onClick: () => {
                    const isDark = toggleDarkMode();
                    showNotification(`Modalità ${isDark ? 'scura' : 'chiara'} attivata`, 'info');
                }
            }, [
                createElement('i', { className: 'fas fa-moon' })
            ]),
            createElement('button', { 
                className: 'btn btn-secondary', 
                onClick: logout,
                textContent: 'Esci' 
            })
        ])
    ]);
    
    return header;
};