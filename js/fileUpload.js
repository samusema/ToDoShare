/**
 * Gestione dell'upload dei file per ToDoShare
 */

// Funzione per renderizzare la sezione di upload dei file
const renderFileUploadSection = () => {
    const fileSection = createElement('div', { className: 'card' }, [
        createElement('h2', { className: 'card-title', textContent: 'Carica file' }),
        
        createElement('div', { 
            className: 'file-upload', 
            id: 'file-upload-area',
            onClick: () => document.getElementById('file-input').click()
        }, [
            createElement('i', { 
                className: 'fas fa-cloud-upload-alt', 
                style: 'font-size: 3rem; color: #718096; margin-bottom: 1rem' 
            }),
            createElement('p', { textContent: 'Clicca o trascina i file qui' }),
            createElement('p', { 
                className: 'file-info', 
                textContent: 'Limite massimo: 10MB per file' 
            }),
            createElement('input', { 
                type: 'file', 
                id: 'file-input', 
                style: 'display: none',
                multiple: 'true',
                onChange: handleFileSelect
            })
        ]),
        
        createElement('div', { id: 'file-list' })
    ]);
    
    return fileSection;
};

// Funzione per gestire la selezione dei file
const handleFileSelect = (event) => {
    const files = event.target.files;
    
    if (!files || files.length === 0) return;
    
    // Processa ogni file
    Array.from(files).forEach(file => {
        // Controlla la dimensione del file (limite 10MB)
        if (file.size > 10 * 1024 * 1024) {
            showNotification(`Il file ${file.name} supera il limite di 10MB`, 'error');
            return;
        }
        
        // Simula l'upload del file
        simulateFileUpload(file);
    });
    
    // Resetta l'input file
    event.target.value = '';
};

// Funzione per simulare l'upload di un file
const simulateFileUpload = (file) => {
    // Crea un elemento per mostrare il progresso dell'upload
    const fileItem = createElement('div', { 
        className: 'file-item',
        style: 'margin-top: 1rem; padding: 1rem; border: 1px solid var(--border-color); border-radius: 4px'
    }, [
        createElement('div', { 
            style: 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem' 
        }, [
            createElement('span', { textContent: file.name }),
            createElement('span', { textContent: formatFileSize(file.size) })
        ]),
        
        createElement('div', { 
            className: 'progress-bar',
            style: 'height: 8px; background-color: #E2E8F0; border-radius: 4px; overflow: hidden'
        }, [
            createElement('div', { 
                className: 'progress',
                style: 'height: 100%; width: 0%; background-color: var(--action-color); transition: width 0.3s'
            })
        ])
    ]);
    
    // Aggiungi l'elemento alla lista dei file
    const fileList = document.getElementById('file-list');
    fileList.appendChild(fileItem);
    
    // Simula il progresso dell'upload
    let progress = 0;
    const progressBar = fileItem.querySelector('.progress');
    
    const interval = setInterval(() => {
        progress += Math.random() * 10;
        
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            // Aggiungi XP per aver caricato un file
            addXP(5);
            
            // Aggiungi pulsanti di azione dopo il completamento
            const actionsDiv = createElement('div', { 
                style: 'display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 0.5rem' 
            }, [
                createElement('button', { 
                    className: 'btn btn-secondary',
                    textContent: 'Elimina',
                    onClick: () => {
                        fileItem.remove();
                        showNotification(`File ${file.name} eliminato`, 'info');
                    }
                }),
                createElement('button', { 
                    className: 'btn btn-primary',
                    textContent: 'Condividi',
                    onClick: () => {
                        showNotification(`Link di condivisione per ${file.name} copiato negli appunti`, 'success');
                        addXP(3);
                    }
                })
            ]);
            
            fileItem.appendChild(actionsDiv);
            
            showNotification(`File ${file.name} caricato con successo`, 'success');
        }
        
        progressBar.style.width = `${progress}%`;
    }, 200);
};

// Funzione per formattare la dimensione del file
const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Funzione per inizializzare il drag and drop
const initDragAndDrop = () => {
    const fileUploadArea = document.getElementById('file-upload-area');
    
    if (!fileUploadArea) return;
    
    // Previeni il comportamento predefinito del browser
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        fileUploadArea.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    // Evidenzia l'area quando si trascina un file sopra di essa
    ['dragenter', 'dragover'].forEach(eventName => {
        fileUploadArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        fileUploadArea.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        fileUploadArea.classList.add('highlight');
    }
    
    function unhighlight() {
        fileUploadArea.classList.remove('highlight');
    }
    
    // Gestisci il drop dei file
    fileUploadArea.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length > 0) {
            handleFileSelect({ target: { files } });
        }
    }
};