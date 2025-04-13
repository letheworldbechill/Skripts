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

    // Daten speichern
    localStorage.setItem('scripts', JSON.stringify(scripts));
}

// Neues Skript hinzufügen
function addScript() {
    const scriptName = document.getElementById('script-name').value.trim();
    if (!scriptName) return;

    const newScript = {
        id: Date.now(),
        name: scriptName,
        steps: ["Starten", "Fortsetzen", "Abschließen"], // Standard-Schritte, anpassbar
        currentStep: 0,
        completed: false
    };

    scripts.push(newScript);
    document.getElementById('script-name').value = '';
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
