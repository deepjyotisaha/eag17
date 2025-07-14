
// llm_dropdown.js

document.addEventListener('DOMContentLoaded', function() {
    const modelSelect = document.getElementById('modelSelect');

    // Realistic LLM model names
    const models = [
        'GPT-4 Turbo',
        'Gemini Pro',
        'Claude 3 Opus',
        'Llama 3 70B',
        'Mistral AI Large'
    ];

    // Populate the dropdown menu
    models.forEach(model => {
        const option = document.createElement('option');
        option.value = model;
        option.textContent = model;
        modelSelect.appendChild(option);
    });

    // Event listener for model selection
    modelSelect.addEventListener('change', function() {
        const selectedModel = this.value;
        console.log('Selected LLM Model:', selectedModel);
        // Dispatch a custom event (optional)
        const event = new CustomEvent('llmModelSelected', { detail: { model: selectedModel } });
        document.dispatchEvent(event);
    });
});
