/**
 * Gestione della Todo List per ToDoShare
 */

// Funzione per renderizzare la sezione della Todo List
const renderTodoListSection = () => {
    const todos = getFromStorage('todos', []);
    
    const todoSection = createElement('div', { className: 'card' }, [
        createElement('h2', { className: 'card-title', textContent: 'Le mie attività' }),
        
        // Form per aggiungere nuovi todo
        createElement('form', { id: 'add-todo-form', onSubmit: handleAddTodo }, [
            createElement('div', { className: 'form-group' }, [
                createElement('input', { 
                    className: 'form-input', 
                    type: 'text', 
                    id: 'todo-text', 
                    placeholder: 'Aggiungi una nuova attività',
                    required: 'true'
                })
            ]),
            
            createElement('div', { className: 'form-group', style: 'display: flex; gap: 1rem' }, [
                createElement('select', { 
                    className: 'form-input', 
                    id: 'todo-priority'
                }, [
                    createElement('option', { value: 'low', textContent: 'Priorità bassa' }),
                    createElement('option', { value: 'medium', textContent: 'Priorità media' }),
                    createElement('option', { value: 'high', textContent: 'Priorità alta' })
                ]),
                
                createElement('input', { 
                    className: 'form-input', 
                    type: 'text', 
                    id: 'todo-tags', 
                    placeholder: 'Tag (separati da virgola)'
                })
            ]),
            
            createElement('div', { style: 'display: flex; gap: 1rem' }, [
                createElement('button', { 
                    className: 'btn btn-primary', 
                    type: 'submit',
                    style: 'flex: 1',
                    textContent: 'Aggiungi' 
                }),
                
                createElement('button', { 
                    className: 'btn btn-secondary', 
                    type: 'button',
                    style: 'flex: 1',
                    onClick: deleteAllTodos,
                    textContent: 'Elimina tutte' 
                })
            ])
        ]),
        
        // Lista dei todo
        createElement('ul', { className: 'todo-list', id: 'todo-list' }, 
            todos.map(todo => renderTodoItem(todo))
        )
    ]);
    
    return todoSection;
};

// Funzione per renderizzare un singolo elemento todo
const renderTodoItem = (todo) => {
    return createElement('li', { 
        className: `todo-item priority-${todo.priority}`,
        'data-id': todo.id
    }, [
        createElement('input', { 
            className: 'todo-checkbox', 
            type: 'checkbox', 
            checked: todo.completed,
            onChange: () => toggleTodoComplete(todo.id)
        }),
        
        createElement('div', { className: `todo-text ${todo.completed ? 'todo-completed' : ''}` }, [
            createElement('div', { textContent: todo.text }),
            createElement('div', { className: 'todo-tags' }, 
                todo.tags.map(tag => 
                    createElement('span', { 
                        className: 'todo-tag', 
                        textContent: tag 
                    })
                )
            )
        ]),
        
        createElement('div', { className: 'todo-actions' }, [
            createElement('button', { 
                className: 'btn btn-secondary',
                onClick: () => showEditTodoModal(todo),
                title: 'Modifica'
            }, [
                createElement('i', { className: 'fas fa-edit' })
            ]),
            
            createElement('button', { 
                className: 'btn btn-secondary',
                onClick: () => deleteTodo(todo.id),
                title: 'Elimina'
            }, [
                createElement('i', { className: 'fas fa-trash' })
            ])
        ])
    ]);
};

// Funzione per aggiungere un nuovo todo
const handleAddTodo = (event) => {
    event.preventDefault();
    
    const todoText = document.getElementById('todo-text').value.trim();
    const todoPriority = document.getElementById('todo-priority').value;
    const todoTags = document.getElementById('todo-tags').value.trim()
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);
    
    if (!todoText) {
        showNotification('Inserisci il testo dell\'attività', 'error');
        return;
    }
    
    // Verifica se esiste già un todo con lo stesso testo
    const todos = getFromStorage('todos', []);
    const isDuplicate = todos.some(todo => 
        todo.text.toLowerCase() === todoText.toLowerCase()
    );
    
    if (isDuplicate) {
        // Chiedi conferma all'utente prima di aggiungere un duplicato
        if (!confirm('Esiste già un\'attività con questo testo. Vuoi comunque aggiungerla?')) {
            return;
        }
    }
    
    const newTodo = {
        id: generateId(),
        text: todoText,
        completed: false,
        priority: todoPriority,
        tags: todoTags,
        createdAt: new Date().toISOString()
    };
    
    // Aggiungi il nuovo todo alla lista
    todos.unshift(newTodo);
    saveToStorage('todos', todos);
    
    // Aggiorna la UI
    const todoList = document.getElementById('todo-list');
    todoList.prepend(renderTodoItem(newTodo));
    
    // Resetta il form
    document.getElementById('add-todo-form').reset();
    
    // Aggiungi XP per aver creato un nuovo todo
    addXP(5);
    
    showNotification('Attività aggiunta con successo', 'success');
};

// Funzione per eliminare tutte le attività
const deleteAllTodos = () => {
    // Chiedi conferma all'utente
    if (!confirm('Sei sicuro di voler eliminare tutte le attività? Questa azione non può essere annullata.')) {
        return;
    }
    
    // Elimina tutti i todo
    saveToStorage('todos', []);
    
    // Aggiorna la UI
    const todoList = document.getElementById('todo-list');
    if (todoList) {
        todoList.innerHTML = '';
    }
    
    // Aggiorna le statistiche
    updateStats();
    
    showNotification('Tutte le attività sono state eliminate', 'info');
};

// Funzione per completare/decompletare un todo
const toggleTodoComplete = (todoId) => {
    const todos = getFromStorage('todos', []);
    const todoIndex = todos.findIndex(todo => todo.id === todoId);
    
    if (todoIndex === -1) return;
    
    const wasCompleted = todos[todoIndex].completed;
    todos[todoIndex].completed = !wasCompleted;
    saveToStorage('todos', todos);
    
    // Aggiorna la UI
    const todoItem = document.querySelector(`.todo-item[data-id="${todoId}"]`);
    if (todoItem) {
        const todoText = todoItem.querySelector('.todo-text');
        if (todos[todoIndex].completed) {
            todoText.classList.add('todo-completed');
            // Aggiungi XP per aver completato un todo
            if (!wasCompleted) {
                addXP(10);
                showNotification('+10 XP per aver completato un\'attività!', 'success');
            }
        } else {
            todoText.classList.remove('todo-completed');
        }
    }
    
    // Aggiorna le statistiche se sono visibili
    updateStats();
};

// Funzione per eliminare un todo
const deleteTodo = (todoId) => {
    if (!confirm('Sei sicuro di voler eliminare questa attività?')) return;
    
    const todos = getFromStorage('todos', []);
    const newTodos = todos.filter(todo => todo.id !== todoId);
    saveToStorage('todos', newTodos);
    
    // Aggiorna la UI
    const todoItem = document.querySelector(`.todo-item[data-id="${todoId}"]`);
    if (todoItem) {
        todoItem.remove();
    }
    
    showNotification('Attività eliminata con successo', 'info');
    
    // Aggiorna le statistiche se sono visibili
    updateStats();
};

// Funzione per mostrare il modal di modifica di un todo
const showEditTodoModal = (todo) => {
    // Crea il modal
    const modalOverlay = createElement('div', { className: 'modal-overlay', id: 'edit-todo-modal' });
    
    const modal = createElement('div', { className: 'modal' }, [
        createElement('div', { className: 'modal-header' }, [
            createElement('h2', { className: 'modal-title', textContent: 'Modifica attività' }),
            createElement('button', { 
                className: 'modal-close', 
                onClick: () => document.getElementById('edit-todo-modal').remove(),
                textContent: '×'
            })
        ]),
        
        createElement('div', { className: 'modal-body' }, [
            createElement('form', { id: 'edit-todo-form' }, [
                createElement('div', { className: 'form-group' }, [
                    createElement('label', { className: 'form-label', for: 'edit-todo-text', textContent: 'Testo' }),
                    createElement('input', { 
                        className: 'form-input', 
                        type: 'text', 
                        id: 'edit-todo-text', 
                        value: todo.text,
                        required: 'true'
                    })
                ]),
                
                createElement('div', { className: 'form-group' }, [
                    createElement('label', { className: 'form-label', for: 'edit-todo-priority', textContent: 'Priorità' }),
                    createElement('select', { 
                        className: 'form-input', 
                        id: 'edit-todo-priority'
                    }, [
                        createElement('option', { value: 'low', textContent: 'Priorità bassa', selected: todo.priority === 'low' }),
                        createElement('option', { value: 'medium', textContent: 'Priorità media', selected: todo.priority === 'medium' }),
                        createElement('option', { value: 'high', textContent: 'Priorità alta', selected: todo.priority === 'high' })
                    ])
                ]),
                
                createElement('div', { className: 'form-group' }, [
                    createElement('label', { className: 'form-label', for: 'edit-todo-tags', textContent: 'Tag (separati da virgola)' }),
                    createElement('input', { 
                        className: 'form-input', 
                        type: 'text', 
                        id: 'edit-todo-tags', 
                        value: todo.tags.join(', ')
                    })
                ])
            ])
        ]),
        
        createElement('div', { className: 'modal-footer' }, [
            createElement('button', { 
                className: 'btn btn-secondary', 
                onClick: () => document.getElementById('edit-todo-modal').remove(),
                textContent: 'Annulla' 
            }),
            createElement('button', { 
                className: 'btn btn-primary', 
                onClick: () => handleEditTodo(todo.id),
                textContent: 'Salva' 
            })
        ])
    ]);
    
    modalOverlay.appendChild(modal);
    document.body.appendChild(modalOverlay);
};

// Funzione per gestire la modifica di un todo
const handleEditTodo = (todoId) => {
    const todoText = document.getElementById('edit-todo-text').value.trim();
    const todoPriority = document.getElementById('edit-todo-priority').value;
    const todoTags = document.getElementById('edit-todo-tags').value.trim()
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);
    
    if (!todoText) {
        showNotification('Inserisci il testo dell\'attività', 'error');
        return;
    }
    
    const todos = getFromStorage('todos', []);
    const todoIndex = todos.findIndex(todo => todo.id === todoId);
    
    if (todoIndex === -1) return;
    
    todos[todoIndex] = {
        ...todos[todoIndex],
        text: todoText,
        priority: todoPriority,
        tags: todoTags
    };
    
    saveToStorage('todos', todos);
    
    // Aggiorna la UI
    const todoList = document.getElementById('todo-list');
    const oldTodoItem = document.querySelector(`.todo-item[data-id="${todoId}"]`);
    if (oldTodoItem && todoList) {
        const newTodoItem = renderTodoItem(todos[todoIndex]);
        todoList.replaceChild(newTodoItem, oldTodoItem);
    }
    
    // Chiudi il modal
    document.getElementById('edit-todo-modal').remove();
    
    showNotification('Attività modificata con successo', 'success');
};

// Funzione per ottenere il conteggio dei todo completati
const getCompletedTodosCount = () => {
    const todos = getFromStorage('todos', []);
    return todos.filter(todo => todo.completed).length;
};

// Funzione per ottenere il conteggio dei todo in corso
const getPendingTodosCount = () => {
    const todos = getFromStorage('todos', []);
    return todos.filter(todo => !todo.completed).length;
};

// Funzione per aggiornare le statistiche nella dashboard
const updateStats = () => {
    const statsContainer = document.querySelector('.stats-container');
    if (statsContainer) {
        const completedStats = statsContainer.querySelector('p:first-child');
        const pendingStats = statsContainer.querySelector('p:nth-child(2)');
        
        if (completedStats) {
            completedStats.textContent = `Attività completate: ${getCompletedTodosCount()}`;
        }
        
        if (pendingStats) {
            pendingStats.textContent = `Attività in corso: ${getPendingTodosCount()}`;
        }
    }
};

// Funzione per mostrare il modal di condivisione
const showShareModal = () => {
    // Crea il modal
    const modalOverlay = createElement('div', { className: 'modal-overlay', id: 'share-modal' });
    
    const modal = createElement('div', { className: 'modal' }, [
        createElement('div', { className: 'modal-header' }, [
            createElement('h2', { className: 'modal-title', textContent: 'Condividi la tua lista' }),
            createElement('button', { 
                className: 'modal-close', 
                onClick: () => document.getElementById('share-modal').remove(),
                textContent: '×'
            })
        ]),
        
        createElement('div', { className: 'modal-body' }, [
            createElement('p', { textContent: 'Seleziona come vuoi condividere la tua lista di attività:' }),
            
            createElement('div', { className: 'form-group', style: 'margin-top: 1rem' }, [
                createElement('select', { 
                    className: 'form-input', 
                    id: 'share-method'
                }, [
                    createElement('option', { value: 'email', textContent: 'Via Email' }),
                    createElement('option', { value: 'link', textContent: 'Link condivisibile' }),
                    createElement('option', { value: 'social', textContent: 'Social Media' })
                ])
            ]),
            
            createElement('div', { className: 'form-group' }, [
                createElement('input', { 
                    className: 'form-input', 
                    type: 'text', 
                    id: 'share-recipient', 
                    placeholder: 'Email del destinatario'
                })
            ]),
            
            createElement('div', { className: 'form-group' }, [
                createElement('label', { className: 'form-label' }, [
                    createElement('input', { 
                        type: 'checkbox', 
                        id: 'share-completed'
                    }),
                    createElement('span', { textContent: ' Includi attività completate' })
                ])
            ])
        ]),
        
        createElement('div', { className: 'modal-footer' }, [
            createElement('button', { 
                className: 'btn btn-secondary', 
                onClick: () => document.getElementById('share-modal').remove(),
                textContent: 'Annulla' 
            }),
            createElement('button', { 
                className: 'btn btn-primary', 
                onClick: handleShare,
                textContent: 'Condividi' 
            })
        ])
    ]);
    
    modalOverlay.appendChild(modal);
    document.body.appendChild(modalOverlay);
    
    // Aggiungi event listener per cambiare il placeholder in base al metodo di condivisione
    document.getElementById('share-method').addEventListener('change', (e) => {
        const shareRecipient = document.getElementById('share-recipient');
        switch (e.target.value) {
            case 'email':
                shareRecipient.placeholder = 'Email del destinatario';
                break;
            case 'link':
                shareRecipient.placeholder = 'Nome del link (opzionale)';
                break;
            case 'social':
                shareRecipient.placeholder = 'Messaggio (opzionale)';
                break;
        }
    });
};

// Funzione per gestire la condivisione
const handleShare = () => {
    const shareMethod = document.getElementById('share-method').value;
    const shareRecipient = document.getElementById('share-recipient').value.trim();
    const includeCompleted = document.getElementById('share-completed').checked;
    
    // Simula la condivisione
    setTimeout(() => {
        document.getElementById('share-modal').remove();
        
        let message;
        switch (shareMethod) {
            case 'email':
                message = shareRecipient 
                    ? `Lista condivisa via email con ${shareRecipient}` 
                    : 'Lista condivisa via email';
                break;
            case 'link':
                message = 'Link di condivisione generato e copiato negli appunti';
                break;
            case 'social':
                message = 'Lista condivisa sui social media';
                break;
        }
        
        showNotification(message, 'success');
        
        // Aggiungi XP per aver condiviso
        addXP(15);
        showNotification('+15 XP per aver condiviso la tua lista!', 'success');
    }, 1000);
};