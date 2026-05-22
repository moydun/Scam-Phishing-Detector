document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('file-input');
    const filePreview = document.getElementById('file-preview');
    const selectedFileName = document.getElementById('selected-file-name');
    const btnRemoveFile = document.getElementById('btn-remove-file');
    const textInput = document.getElementById('text-input');
    const btnAnalyze = document.getElementById('btn-analyze');
    
    // Display panels
    const resultsPlaceholder = document.getElementById('results-placeholder');
    const loadingContainer = document.getElementById('loading-container');
    const loadingText = document.getElementById('loading-text');
    const resultsContent = document.getElementById('results-content');
    const resultsCard = document.getElementById('results-card');
    
    // Result details
    const verdictCard = document.getElementById('verdict-card');
    const verdictTitle = document.getElementById('verdict-title');
    const confidenceValue = document.getElementById('confidence-value');
    const verdictReasoning = document.getElementById('verdict-reasoning');
    const highlightsGroup = document.getElementById('highlights-group');
    const highlightsList = document.getElementById('highlights-list');
    
    // Metadata fields
    const metaSubject = document.getElementById('meta-subject');
    const metaFrom = document.getElementById('meta-from');
    const metaTo = document.getElementById('meta-to');
    const metaDate = document.getElementById('meta-date');
    
    // Error banner
    const errorBanner = document.getElementById('error-banner');
    const errorMessage = document.getElementById('error-message');
    
    let selectedFile = null;
    let loadingInterval = null;

    // Determine Backend API URL dynamically
    let API_URL = 'http://localhost:8000/api/analyze';
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        // If deployed to production (e.g. Railway), default to relative route
        // or resolve based on standard port config if port 3000 is used.
        if (window.location.port === '3000') {
            API_URL = `http://${window.location.hostname}:8000/api/analyze`;
        } else {
            API_URL = '/api/analyze';
        }
    }

    // ----------------------------------------------------
    // Drag & Drop Event Listeners
    // ----------------------------------------------------
    
    // Clicking on dropzone triggers hidden file input
    dropzone.addEventListener('click', () => {
        fileInput.click();
    });
    
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFileSelect(e.target.files[0]);
        }
    });
    
    // Prevent default behaviors for drag events
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    // Highlighting dropzone on drag over
    ['dragenter', 'dragover'].forEach(eventName => {
        dropzone.addEventListener(eventName, () => {
            dropzone.classList.add('dragover');
        }, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, () => {
            dropzone.classList.remove('dragover');
        }, false);
    });
    
    // Drop file handler
    dropzone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length > 0) {
            const file = files[0];
            if (file.name.endsWith('.eml')) {
                handleFileSelect(file);
            } else {
                showError("Пожалуйста, выберите файл в формате .eml.");
            }
        }
    });

    // ----------------------------------------------------
    // File Management Functions
    // ----------------------------------------------------
    
    function handleFileSelect(file) {
        selectedFile = file;
        selectedFileName.textContent = file.name;
        
        // Hide dropzone, show preview
        dropzone.style.display = 'none';
        filePreview.style.display = 'flex';
        
        // Clear manual text input when file is selected to avoid confusion
        textInput.value = '';
        textInput.disabled = true;
        textInput.placeholder = "Используется загруженный файл письма. Очистите файл, чтобы ввести текст вручную.";
        
        // Hide any existing errors
        hideError();
    }
    
    btnRemoveFile.addEventListener('click', () => {
        selectedFile = null;
        fileInput.value = '';
        
        // Show dropzone, hide preview
        dropzone.style.display = 'flex';
        filePreview.style.display = 'none';
        
        // Restore manual text input
        textInput.disabled = false;
        textInput.value = '';
        textInput.placeholder = "Вставьте полный текст электронного письма (включая заголовки, если они есть)...";
        
        hideError();
    });

    // ----------------------------------------------------
    // API Call & Scanning Logic
    // ----------------------------------------------------
    
    btnAnalyze.addEventListener('click', async () => {
        // Validate input
        const rawText = textInput.value.trim();
        if (!selectedFile && !rawText) {
            showError("Пожалуйста, перетащите файл письма .eml или вставьте текст в поле ввода.");
            return;
        }
        
        // Show Loading State
        setVisualState('loading');
        hideError();
        startLoadingTextRotation();
        
        // Prepare Form Data for multipart upload
        const formData = new FormData();
        if (selectedFile) {
            formData.append('file', selectedFile);
        } else {
            formData.append('text', rawText);
        }
        
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.detail || "Произошла ошибка при анализе письма.");
            }
            
            if (data.success) {
                renderResults(data);
                setVisualState('results');
            } else {
                throw new Error("Не удалось получить корректный результат анализа.");
            }
            
        } catch (error) {
            console.error(error);
            showError(error.message);
            setVisualState('placeholder');
        } finally {
            stopLoadingTextRotation();
        }
    });

    // ----------------------------------------------------
    // UI Rendering & Helper Functions
    // ----------------------------------------------------
    
    function startLoadingTextRotation() {
        const loadingTexts = [
            "Парсинг структуры и заголовков письма...",
            "Анализ адреса отправителя на SPF/DKIM...",
            "Проверка встроенных ссылок и редиректов...",
            "Запуск нейросетевого сканирования через ИИ Gemini...",
            "Изучение психологических приемов давления...",
            "Формирование итогового вердикта безопасности..."
        ];
        
        let index = 0;
        loadingText.textContent = loadingTexts[index];
        
        loadingInterval = setInterval(() => {
            index = (index + 1) % loadingTexts.length;
            loadingText.textContent = loadingTexts[index];
        }, 2200);
    }
    
    function stopLoadingTextRotation() {
        if (loadingInterval) {
            clearInterval(loadingInterval);
            loadingInterval = null;
        }
    }
    
    function setVisualState(state) {
        // Reset all
        resultsPlaceholder.style.display = 'none';
        loadingContainer.style.display = 'none';
        resultsContent.style.display = 'none';
        
        if (state === 'placeholder') {
            resultsPlaceholder.style.display = 'flex';
        } else if (state === 'loading') {
            loadingContainer.style.display = 'flex';
        } else if (state === 'results') {
            resultsContent.style.display = 'flex';
        }
    }
    
    function renderResults(data) {
        // Clear previous themes
        resultsCard.className = 'panel-card';
        verdictCard.className = 'verdict-header-card';
        
        // Extract threat variables
        const verdict = data.verdict.toLowerCase(); // safe, scam, phishing
        const confidence = data.confidence;
        
        // Translate and Apply Themes
        let displayVerdict = "БЕЗОПАСНО";
        let themeClass = "theme-safe";
        
        if (verdict === 'scam') {
            displayVerdict = "МОШЕННИЧЕСТВО";
            themeClass = "theme-scam";
        } else if (verdict === 'phishing') {
            displayVerdict = "ФИШИНГ / УГРОЗА";
            themeClass = "theme-phishing";
        }
        
        // Set Theme Classes
        resultsCard.classList.add(themeClass);
        verdictCard.classList.add(themeClass);
        
        // Set Content
        verdictTitle.textContent = displayVerdict;
        confidenceValue.textContent = confidence;
        verdictReasoning.textContent = data.reasoning;
        
        // Render Highlights/Red Flags
        highlightsList.innerHTML = '';
        if (data.highlights && data.highlights.length > 0) {
            highlightsGroup.style.display = 'flex';
            data.highlights.forEach(highlight => {
                const li = document.createElement('li');
                li.className = 'highlight-item';
                li.textContent = highlight;
                highlightsList.appendChild(li);
            });
        } else {
            // Hide red flags if safe and empty
            if (verdict === 'safe') {
                highlightsGroup.style.display = 'none';
            } else {
                highlightsGroup.style.display = 'flex';
                const li = document.createElement('li');
                li.className = 'highlight-item';
                li.textContent = "Прямых подозрительных флагов не выделено, но ИИ рекомендует проявить бдительность.";
                highlightsList.appendChild(li);
            }
        }
        
        // Render Metadata
        metaSubject.textContent = data.metadata.subject || "Без темы";
        metaSubject.title = data.metadata.subject || "Без темы";
        
        metaFrom.textContent = data.metadata.from || "Неизвестно";
        metaFrom.title = data.metadata.from || "Неизвестно";
        
        metaTo.textContent = data.metadata.to || "Неизвестно";
        metaTo.title = data.metadata.to || "Неизвестно";
        
        metaDate.textContent = data.metadata.date || "Не указана";
        metaDate.title = data.metadata.date || "Не указана";
    }
    
    function showError(message) {
        errorMessage.textContent = message;
        errorBanner.style.display = 'flex';
        // Auto scroll to error
        errorBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    function hideError() {
        errorBanner.style.display = 'none';
    }
});
