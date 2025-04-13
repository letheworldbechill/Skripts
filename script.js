// Daten aus localStorage laden oder Standard-Skripte verwenden
let scripts = JSON.parse(localStorage.getItem('scripts')) || [
    {
        id: 1,
        name: "Wäsche waschen",
        category: "Haushalt",
        steps: [
            { name: "Waschen", completed: false, timestamp: null },
            { name: "Trocknen", completed: false, timestamp: null },
            { name: "Versorgen", completed: false, timestamp: null }
        ],
        currentStep: 0,
        completed: false
    }
];

// Eingabefeld für neuen Schritt hinzufügen
function addStepInput() {
    const stepsContainer = document.getElementById('steps-container');
    const stepCount = stepsContainer.children.length + 1;
    const newStepInput = document.createElement('input');
    newStepInput.type = 'text';
    newStepInput.className = 'step-input';
    newStepInput.placeholder = `Schritt ${stepCount}`;
    stepsContainer.appendChild(newStepInput);
}

// Skripte anzeigen
function renderScripts() {
    const scriptList = document.getElementById('script-list');
    scriptList.innerHTML = '';

    scripts.forEach(script => {
        const scriptDiv = document.createElement('div');
        scriptDiv.className = `script-item ${script.completed ? 'completed' : ''}`;

        let stepsHtml = '';
        script.steps.forEach((step, index) => {
            stepsHtml += `
                <div class="step" draggable="true" 
                     ondragstart="dragStart(event, ${script.id}, ${index})" 
                     ondragover="event.preventDefault()" 
                     ondrop="drop(event, ${script.id}, ${index})">
                    ${index + 1}. ${step.name} 
                    ${step.completed ? '✅' : index === script.currentStep && !script.completed ? '⏳' : ''} 
                    ${step.timestamp ? `<small>${new Date(step.timestamp).toLocaleString()}</small>` : ''}
                </div>`;
        });

        scriptDiv.innerHTML = `
            <div>
                <strong>${script.name} (${script.category})</strong>
                <div id="steps-${script.id}">${stepsHtml}</div>
            </div>
            <div>
                ${!script.completed ? `<button onclick="nextStep(${script.id})">Nächster Schritt</button>` : ''}
                <button onclick="editScript(${script.id})">Bearbeiten</button>
                <button onclick="deleteScript(${script.id})">Löschen</button>
            </div>
        `;
        scriptList.appendChild(scriptDiv);
    });

    // Daten in localStorage speichern
    localStorage.setItem('scripts', JSON.stringify(scripts));
}

// Neues Skript hinzufügen
function addScript() {
    const scriptName = document.getElementById('script-name').value.trim();
    const scriptCategory = document.getElementById('script-category').value.trim();
    const stepInputs = document.querySelectorAll('.step-input');
    const steps = Array.from(stepInputs)
        .map(input => input.value.trim())
        .filter(step => step !== '')
        .map(step => ({ name: step, completed: false, timestamp: null }));

    if (!scriptName || steps.length === 0) {
        alert('Bitte gib einen Skript-Namen, eine Kategorie und mindestens einen Schritt ein.');
        return;
    }

    const newScript = {
        id: Date.now(),
        name: scriptName,
        category: scriptCategory,
        steps: steps,
        currentStep: 0,
        completed: false
    };

    scripts.push(newScript);

    // Formular zurücksetzen
    document.getElementById('script-name').value = '';
    document.getElementById('script-category').value = '';
    const stepsContainer = document.getElementById('steps-container');
    stepsContainer.innerHTML = '<input type="text" class="step-input" placeholder="Schritt 1">';
    
    renderScripts();
}

// Nächster Schritt
function nextStep(scriptId) {
    const script = scripts.find(s => s.id === scriptId);
    if (!script || script.completed) return;

    const currentStep = script.steps[script.currentStep];
    currentStep.completed = true;
    currentStep.timestamp = new Date().toISOString();
    script.currentStep++;

    if (script.currentStep >= script.steps.length) {
        script.completed = true;
    }
    renderScripts();
}

// Skript bearbeiten
function editScript(scriptId) {
    const script = scripts.find(s => s.id === scriptId);
    if (!script) return;

    const newName = prompt('Neuer Name für das Skript:', script.name);
    if (newName !== null) script.name = newName.trim();

    const newCategory = prompt('Neue Kategorie für das Skript:', script.category);
    if (newCategory !== null) script.category = newCategory.trim();

    script.steps.forEach((step, index) => {
        const newStepName = prompt(`Neuer Name für Schritt ${index + 1}:`, step.name);
        if (newStepName !== null) step.name = newStepName.trim();
    });

    renderScripts();
}

// Skript löschen
function deleteScript(scriptId) {
    scripts = scripts.filter(s => s.id !== scriptId);
    renderScripts();
}

// Drag-and-Drop Funktionen
function dragStart(event, scriptId, stepIndex) {
    event.dataTransfer.setData('text/plain', `${scriptId},${stepIndex}`);
}

function drop(event, targetScriptId, targetIndex) {
    event.preventDefault();
    const [sourceScriptId, sourceIndex] = event.dataTransfer.getData('text/plain').split(',').map(Number);
    
    if (sourceScriptId === targetScriptId) {
        const script = scripts.find(s => s.id === sourceScriptId);
        const [removed] = script.steps.splice(sourceIndex, 1);
        script.steps.splice(targetIndex, 0, removed);
        renderScripts();
    }
}

// Initial rendern
renderScripts();
