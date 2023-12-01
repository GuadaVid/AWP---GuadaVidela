document.addEventListener('DOMContentLoaded', init);

function init() {
    // Cargar entradas almacenadas localmente al iniciar la aplicación
    loadEntries();

    // Registrar el Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('Service Worker registrado:', registration))
            .catch(error => console.error('Error al registrar el Service Worker:', error));
    }
}

// Función para guardar una nueva entrada o actualizar una existente
function saveEntry() {
    const entryText = document.getElementById('entry-text').value;
    if (entryText.trim() === '') return;

    const entry = {
        text: entryText,
        timestamp: new Date().toLocaleString()
    };

    const entries = JSON.parse(localStorage.getItem('entries')) || [];
    const entryIndex = parseInt(document.getElementById('entry-index').value);

    if (!isNaN(entryIndex) && entryIndex >= 0 && entryIndex < entries.length) {
        // Si hay un índice válido, actualizar la entrada existente
        entries[entryIndex] = entry;
    } else {
        entries.push(entry);
    }

    // Guardar las entradas localmente
    localStorage.setItem('entries', JSON.stringify(entries));

    // Actualizar la lista de entradas
    loadEntries();

    // Limpiar el área de texto y el índice
    document.getElementById('entry-text').value = '';
    document.getElementById('entry-index').value = '';
}


// Función para cargar las entradas almacenadas localmente
function loadEntries() {
    const entriesList = document.getElementById('entries-list');
    entriesList.innerHTML = '';

    const entries = JSON.parse(localStorage.getItem('entries')) || [];
    entries.forEach((entry, index) => {
        const entryItem = document.createElement('div');
        entryItem.classList.add('entry-item');
        entryItem.innerHTML = `
            <p>${entry.text}</p>
            <small>${entry.timestamp}</small>
            <button onclick="editEntry(${index})">Editar</button>
            <button onclick="deleteEntry(${index})">Eliminar</button>
        `;
        entriesList.appendChild(entryItem);
    });

}

// editar 
function editEntry(index) {
    const entries = JSON.parse(localStorage.getItem('entries')) || [];
    if (index >= 0 && index < entries.length) {
        const entry = entries[index];
        document.getElementById('entry-text').value = entry.text;
        document.getElementById('entry-index').value = index;
    }
}

// eliminar 
function deleteEntry(index) {
    const entries = JSON.parse(localStorage.getItem('entries')) || [];
    if (index >= 0 && index < entries.length) {
        entries.splice(index, 1);
        localStorage.setItem('entries', JSON.stringify(entries));
        loadEntries();
    }
}
