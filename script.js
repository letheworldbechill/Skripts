// Daten aus localStorage laden oder Standard-Skripte verwenden
let scripts = JSON.parse(localStorage.getItem('scripts')) || [
    {
        id: 1,
        name: "Wäsche waschen",
        steps: ["Waschen", "Trocknen", "Versorgen"],
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
            stepsHtml += `<div class="step">${index + 1}. ${step} ${index < script.currentStep ? '✅' : index === script.currentStep && !script.completed ? '⏳' : ''}</div>`;
        });

        scriptDiv.innerHTML = `
            <div>
                <strong>${script.name}</strong>
                ${stepsHtml}
            </div>
            <div>
                ${!script.completed ? `<button onclick="nextStep(${script.id})">Nächster Schritt</button>` : ''}
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
    const stepInputs = document.querySelectorAll('.step-input');
    const steps = Array.from(stepInputs)
        .map(input => input.value.trim())
        .filter(step => step !== '');

    if (!scriptName || steps.length === 0) {
        alert('Bitte gib einen Skript-Namen und mindestens einen Schritt ein.');
        return;
    }

    const newScript = {
        id: Date.now(),
        name: scriptName,
        steps: steps,
        currentStep: 0,
        completed: false
    };

    scripts.push(newScript);

    // Formular zurücksetzen
    document.getElementById('script-name').value = '';
    const stepsContainer = document.getElementById('steps-container');
    stepsContainer.innerHTML = '<input type="text" class="step-input" placeholder="Schritt 1">';
    
    renderScripts();
}

// Nächster Schritt
function nextStep(scriptId) {
    const script = scripts.find(s => s.id === scriptId);
    if (!script || script.completed) return;

    script.currentStep++;
    if (script.currentStep >= script.steps.length) {
        script.completed = true;
    }
    renderScripts();
}

// Skript löschen
function deleteScript(scriptId) {
    scripts = scripts.filter(s => s.id !== scriptId);
    renderScripts();
}

// Initial rendern
renderScripts();

