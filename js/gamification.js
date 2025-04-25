/**
 * Sistema di gamification per ToDoShare
 */

// Funzione per renderizzare la sezione di gamification
const renderGamificationSection = () => {
    const user = getFromStorage('user');
    
    if (!user) return null;
    
    const xpSection = createElement('div', { className: 'xp-container' }, [
        createElement('div', { 
            className: 'level-badge', 
            textContent: user.level 
        }),
        
        createElement('div', { className: 'xp-bar' }, [
            createElement('div', { 
                className: 'xp-progress', 
                style: `width: ${(user.xp / user.xpToNextLevel) * 100}%` 
            })
        ]),
        
        createElement('div', { 
            className: 'xp-text', 
            textContent: `${user.xp}/${user.xpToNextLevel} XP` 
        })
    ]);
    
    return xpSection;
};

// Funzione per aggiungere XP all'utente
const addXP = (amount) => {
    const user = getFromStorage('user');
    
    if (!user) return;
    
    user.xp += amount;
    
    // Controlla se l'utente è salito di livello
    if (user.xp >= user.xpToNextLevel) {
        user.level += 1;
        user.xp -= user.xpToNextLevel;
        user.xpToNextLevel = Math.floor(user.xpToNextLevel * 1.5); // Aumenta l'XP necessario per il prossimo livello
        
        showNotification(`Complimenti! Sei salito al livello ${user.level}!`, 'success');
        
        // Aggiorna l'interfaccia utente
        const levelBadge = document.querySelector('.level-badge');
        if (levelBadge) {
            levelBadge.textContent = user.level;
        }
    }
    
    // Aggiorna la barra dell'XP
    const xpProgress = document.querySelector('.xp-progress');
    if (xpProgress) {
        xpProgress.style.width = `${(user.xp / user.xpToNextLevel) * 100}%`;
    }
    
    // Aggiorna il testo dell'XP
    const xpText = document.querySelector('.xp-text');
    if (xpText) {
        xpText.textContent = `${user.xp}/${user.xpToNextLevel} XP`;
    }
    
    // Salva l'utente aggiornato
    saveToStorage('user', user);
};

// Funzione per ottenere ricompense in base al livello
const getLevelRewards = (level) => {
    const rewards = [
        { level: 2, name: 'Tema Blu', type: 'theme' },
        { level: 3, name: 'Badge Principiante', type: 'badge' },
        { level: 5, name: 'Tema Verde', type: 'theme' },
        { level: 7, name: 'Badge Esperto', type: 'badge' },
        { level: 10, name: 'Tema Oro', type: 'theme' }
    ];
    
    return rewards.filter(reward => reward.level <= level);
};

// Funzione per mostrare le ricompense dell'utente
const showRewardsModal = () => {
    const user = getFromStorage('user');
    
    if (!user) return;
    
    const rewards = getLevelRewards(user.level);
    
    // Crea il modal
    const modalOverlay = createElement('div', { className: 'modal-overlay', id: 'rewards-modal' });
    
    const modal = createElement('div', { className: 'modal' }, [
        createElement('div', { className: 'modal-header' }, [
            createElement('h2', { className: 'modal-title', textContent: 'Le tue ricompense' }),
            createElement('button', { 
                className: 'modal-close', 
                onClick: () => document.getElementById('rewards-modal').remove(),
                textContent: '×'
            })
        ]),
        
        createElement('div', { className: 'modal-body' }, [
            createElement('p', { textContent: `Livello attuale: ${user.level}` }),
            createElement('p', { textContent: `XP: ${user.xp}/${user.xpToNextLevel}` }),
            
            createElement('h3', { 
                textContent: 'Ricompense sbloccate:', 
                style: 'margin-top: 1rem; margin-bottom: 0.5rem' 
            }),
            
            createElement('ul', { className: 'rewards-list' }, 
                rewards.length > 0 
                    ? rewards.map(reward => 
                        createElement('li', { 
                            textContent: `${reward.name} (${reward.type})`,
                            style: 'margin-bottom: 0.5rem'
                        })
                    )
                    : [createElement('li', { textContent: 'Nessuna ricompensa sbloccata' })]
            ),
            
            createElement('p', { 
                textContent: 'Continua a completare le attività per sbloccare nuove ricompense!',
                style: 'margin-top: 1rem'
            })
        ]),
        
        createElement('div', { className: 'modal-footer' }, [
            createElement('button', { 
                className: 'btn btn-primary', 
                onClick: () => document.getElementById('rewards-modal').remove(),
                textContent: 'Chiudi' 
            })
        ])
    ]);
    
    modalOverlay.appendChild(modal);
    document.body.appendChild(modalOverlay);
};