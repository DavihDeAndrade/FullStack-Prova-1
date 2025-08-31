// Conference Ticket Generator - Frontend Mentor Challenge #task2025
class ConferenceTicketGenerator {
    constructor() {
        // Elementos DOM principais
        this.form = document.getElementById('ticketForm');
        this.canvas = document.getElementById('ticketCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.generateBtn = document.getElementById('generateBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.successSection = document.getElementById('successSection');
        
        // Estado da aplicação
        this.formData = {
            fullName: '',
            email: '',
            githubUsername: ''
        };
        this.avatarImage = null;
        this.isFormValid = false;
        
        // Configurações de validação (facilmente modificáveis para demonstração no vídeo)
        this.validationConfig = {
            // Modo de exibição de erro: 'inline', 'above', 'alert', 'toast'
            displayMode: 'inline',
            // Tipo de validação de nome: 'first', 'full'
            nameValidation: 'full',
            // Validação do GitHub: 'require_at', 'no_at', 'flexible'
            githubValidation: 'flexible'
        };
        
        this.init();
    }

    // Inicialização da aplicação
    init() {
        this.setupEventListeners();
        this.setupAccessibility();
        this.drawEmptyTicket(); // Desenha ticket vazio inicial
        console.log('Conference Ticket Generator inicializado - Frontend Mentor Challenge #task2025');
    }

    // Configuração dos event listeners
    setupEventListeners() {
        // Eventos de input em tempo real para validação
        const textInputs = this.form.querySelectorAll('input[type="text"], input[type="email"]');
        textInputs.forEach(input => {
            input.addEventListener('input', (e) => this.handleInputChange(e));
            input.addEventListener('blur', (e) => this.validateField(e.target));
        });

        // Upload de avatar com drag & drop
        this.setupAvatarUpload();

        // Submit do formulário
        this.form.addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Download do ticket
        this.downloadBtn.addEventListener('click', () => this.downloadTicket());
    }

    // Configuração de acessibilidade
    setupAccessibility() {
        // Suporte para navegação por teclado no upload
        const avatarPreview = document.getElementById('avatarPreview');
        avatarPreview.setAttribute('tabindex', '0');
        avatarPreview.setAttribute('role', 'button');
        avatarPreview.setAttribute('aria-label', 'Upload avatar image');
        
        avatarPreview.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                document.getElementById('avatar').click();
            }
        });
    }

    // Configuração do upload de avatar
    setupAvatarUpload() {
        const avatarInput = document.getElementById('avatar');
        const avatarPreview = document.getElementById('avatarPreview');
        const uploadContainer = document.getElementById('avatarUploadContainer');

        // Click para upload
        avatarPreview.addEventListener('click', () => avatarInput.click());

        // Mudança de arquivo
        avatarInput.addEventListener('change', (e) => this.handleAvatarUpload(e));

        // Drag & Drop
        uploadContainer.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadContainer.classList.add('drag-over');
        });

        uploadContainer.addEventListener('dragleave', () => {
            uploadContainer.classList.remove('drag-over');
        });

        uploadContainer.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadContainer.classList.remove('drag-over');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.processAvatarFile(files[0]);
            }
        });
    }

    // Manipula mudanças nos campos de input
    handleInputChange(event) {
        const { name, value } = event.target;
        this.formData[name] = value;
        
        // Validação em tempo real
        this.validateField(event.target);
        
        // Atualiza preview do ticket em tempo real
        this.updateTicketPreview();
        
        // REMOVIDO: Não atualiza mais o estado do botão automaticamente
        // this.updateFormValidation();
    }

    // Sistema de validação flexível (configurável para demonstração no vídeo)
    validateField(field) {
        const { name, value } = field;
        let isValid = true;
        let errorMessage = '';

        // Remove estados anteriores
        field.classList.remove('error', 'success');

        switch (name) {
            case 'fullName':
                const nameResult = this.validateName(value);
                isValid = nameResult.isValid;
                errorMessage = nameResult.message;
                break;
                
            case 'email':
                const emailResult = this.validateEmail(value);
                isValid = emailResult.isValid;
                errorMessage = emailResult.message;
                break;
                
            case 'githubUsername':
                const githubResult = this.validateGitHub(value);
                isValid = githubResult.isValid;
                errorMessage = githubResult.message;
                // CORRIGIDO: Atualiza o valor do input se foi processado
                if (githubResult.processedValue !== undefined && githubResult.processedValue !== value) {
                    field.value = githubResult.processedValue;
                    this.formData.githubUsername = githubResult.processedValue;
                }
                break;
        }

        // Aplica estilo visual
        if (value.trim()) {
            field.classList.add(isValid ? 'success' : 'error');
        }

        // Exibe erro conforme configuração
        this.displayErrorMessage(name, errorMessage, isValid);

        return isValid;
    }

    // Validação de nome (configurável para demonstração no vídeo)
    validateName(value) {
        if (!value.trim()) {
            return { isValid: false, message: 'Nome completo é obrigatório' };
        }

        if (this.validationConfig.nameValidation === 'first') {
            // Validação: apenas primeiro nome (sem espaços)
            if (value.trim().includes(' ')) {
                return { isValid: false, message: 'Digite apenas o primeiro nome' };
            }
        } else if (this.validationConfig.nameValidation === 'full') {
            // Validação: nome e sobrenome obrigatórios
            const nameParts = value.trim().split(' ').filter(part => part.length > 0);
            if (nameParts.length < 2) {
                return { isValid: false, message: 'Digite nome e sobrenome completos' };
            }
        }

        return { isValid: true, message: '' };
    }

    // Validação de email
    validateEmail(value) {
        if (!value.trim()) {
            return { isValid: false, message: 'Endereço de email é obrigatório' };
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            return { isValid: false, message: 'Digite um endereço de email válido' };
        }

        return { isValid: true, message: '' };
    }

    // CORRIGIDO: Validação do GitHub (configurável para demonstração no vídeo)
    validateGitHub(value) {
        if (!value.trim()) {
            return { isValid: false, message: 'Nome de usuário GitHub é obrigatório' };
        }

        let processedValue = value.trim();
        let shouldUpdateField = false;

        if (this.validationConfig.githubValidation === 'require_at') {
            // Exige @ no início
            if (!processedValue.startsWith('@')) {
                return { isValid: false, message: 'Nome de usuário deve começar com @' };
            }
            // Remove @ para validação do formato
            const usernameWithoutAt = processedValue.substring(1);
            const usernameRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/;
            if (!usernameRegex.test(usernameWithoutAt)) {
                return { isValid: false, message: 'Digite um nome de usuário GitHub válido' };
            }
        } else if (this.validationConfig.githubValidation === 'no_at') {
            // Remove @ se existir e não permite
            if (processedValue.startsWith('@')) {
                processedValue = processedValue.substring(1);
                shouldUpdateField = true;
            }
            // Validação do formato sem @
            const usernameRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/;
            if (!usernameRegex.test(processedValue)) {
                return { isValid: false, message: 'Digite um nome de usuário GitHub válido' };
            }
        } else if (this.validationConfig.githubValidation === 'flexible') {
            // Normaliza: remove @ se existir para validação, mas mantém no display
            let usernameForValidation = processedValue;
            if (processedValue.startsWith('@')) {
                usernameForValidation = processedValue.substring(1);
            }
            // Validação do formato
            const usernameRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/;
            if (!usernameRegex.test(usernameForValidation)) {
                return { isValid: false, message: 'Digite um nome de usuário GitHub válido' };
            }
            // Mantém o valor original (com ou sem @)
        }

        return { 
            isValid: true, 
            message: '', 
            processedValue: shouldUpdateField ? processedValue : undefined
        };
    }

    // Sistema flexível de exibição de erros (configurável para demonstração)
    displayErrorMessage(fieldName, message, isValid) {
        switch (this.validationConfig.displayMode) {
            case 'inline':
                this.showInlineError(fieldName, message, isValid);
                break;
            case 'above':
                this.showAboveError(fieldName, message, isValid);
                break;
            case 'alert':
                if (!isValid && message) {
                    alert(`${this.getFieldLabel(fieldName)}: ${message}`);
                }
                break;
            case 'toast':
                if (!isValid && message) {
                    this.showToast(message, 'error');
                }
                break;
        }
    }

    // Exibe erro inline (padrão)
    showInlineError(fieldName, message, isValid) {
        const errorElement = document.getElementById(`${fieldName}Error`);
        if (errorElement) {
            errorElement.textContent = isValid ? '' : message;
            errorElement.setAttribute('aria-live', !isValid ? 'polite' : 'off');
        }
    }

    // Exibe erro acima do campo
    showAboveError(fieldName, message, isValid) {
        const field = document.getElementById(fieldName);
        const existingError = field.parentNode.querySelector('.error-above');
        
        if (existingError) {
            existingError.remove();
        }
        
        if (!isValid && message) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message error-above';
            errorDiv.textContent = message;
            errorDiv.setAttribute('role', 'alert');
            field.parentNode.insertBefore(errorDiv, field);
        }
    }

    // Sistema de toast notifications
    showToast(message, type = 'error') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        toast.setAttribute('role', 'alert');
        
        container.appendChild(toast);
        
        // Remove toast após 4 segundos
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    // Obter labels amigáveis dos campos
    getFieldLabel(fieldName) {
        const labels = {
            fullName: 'Nome Completo',
            email: 'Endereço de Email',
            githubUsername: 'Nome de Usuário GitHub'
        };
        return labels[fieldName] || fieldName;
    }

    // Upload e processamento de avatar
    handleAvatarUpload(event) {
        const file = event.target.files[0];
        if (file) {
            this.processAvatarFile(file);
        }
    }

    processAvatarFile(file) {
        // Validação de tipo de arquivo
        if (!file.type.startsWith('image/') || !['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
            this.displayErrorMessage('avatar', 'Por favor, envie um arquivo de imagem JPG ou PNG', false);
            return;
        }
        
        // Validação de tamanho do arquivo (500KB conforme especificação)
        if (file.size > 500 * 1024) {
            this.displayErrorMessage('avatar', 'Tamanho do arquivo deve ser menor que 500KB', false);
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.avatarImage = img;
                this.showAvatarPreview(e.target.result);
                this.displayErrorMessage('avatar', '', true);
                this.updateTicketPreview(); // Atualiza preview com avatar
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    // Mostra preview do avatar
    showAvatarPreview(imageSrc) {
        const preview = document.getElementById('avatarPreview');
        preview.innerHTML = `<img src="${imageSrc}" alt="Preview do Avatar" class="avatar-image">`;
        preview.classList.add('has-image');
        preview.setAttribute('aria-label', 'Avatar enviado com sucesso');
    }

    // REMOVIDO: Método updateFormValidation que desabilitava o botão

    // MODIFICADO: Handle form submission - agora valida no submit
    handleFormSubmit(event) {
        event.preventDefault();
        
        // Validação completa de todos os campos
        const fullNameValid = this.validateField(document.getElementById('fullName'));
        const emailValid = this.validateField(document.getElementById('email'));
        const githubValid = this.validateField(document.getElementById('githubUsername'));
        
        const hasRequiredData = this.formData.fullName.trim() && 
                               this.formData.email.trim() && 
                               this.formData.githubUsername.trim();

        // Verifica se todos os campos são válidos
        if (!fullNameValid || !emailValid || !githubValid || !hasRequiredData) {
            this.showToast('Por favor, corrija todos os erros antes de gerar seu ticket', 'error');
            
            // Foca no primeiro campo com erro
            const firstErrorField = ['fullName', 'email', 'githubUsername'].find(fieldName => {
                const field = document.getElementById(fieldName);
                return field.classList.contains('error') || !field.value.trim();
            });
            
            if (firstErrorField) {
                document.getElementById(firstErrorField).focus();
            }
            
            return;
        }

        // Se chegou até aqui, tudo está válido
        this.updateTicketPreview();
        this.showSuccessMessage();
        this.downloadBtn.disabled = false;
    }

    // Mostra mensagem de sucesso
    showSuccessMessage() {
        document.getElementById('ticketName').textContent = this.formData.fullName;
        document.getElementById('ticketEmail').textContent = this.formData.email;
        this.successSection.style.display = 'block';
        this.successSection.scrollIntoView({ behavior: 'smooth' });
    }

    // Desenha ticket vazio inicial
    drawEmptyTicket() {
        const ctx = this.ctx;
        const canvas = this.canvas;
        
        // Limpa canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Background do ticket (gradiente roxo)
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, 'hsl(248, 70%, 10%)');
        gradient.addColorStop(0.5, 'hsl(245, 19%, 35%)');
        gradient.addColorStop(1, 'hsl(248, 70%, 10%)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Área principal do ticket
        const ticketX = 40;
        const ticketY = 60;
        const ticketWidth = canvas.width - 80;
        const ticketHeight = 280;
        
        // Fundo do cartão
        ctx.fillStyle = 'hsl(245, 19%, 35%)';
        this.roundRect(ctx, ticketX, ticketY, ticketWidth, ticketHeight, 16);
        ctx.fill();
        
        // Header do ticket
        ctx.fillStyle = 'hsl(7, 88%, 67%)';
        ctx.font = 'bold 20px Inconsolata, monospace';
        ctx.textAlign = 'left';
        ctx.fillText('Coding Conf', ticketX + 24, ticketY + 40);
        
        // Data e local
        ctx.fillStyle = 'hsl(0, 0%, 100%)';
        ctx.font = '14px Inconsolata, monospace';
        ctx.fillText('Jan 31, 2025 / Austin, TX', ticketX + 24, ticketY + 65);
        
        // Placeholder text
        ctx.fillStyle = 'hsla(0, 0%, 100%, 0.6)';
        ctx.font = '16px Inconsolata, monospace';
        ctx.textAlign = 'center';
        ctx.fillText('Complete o formulário para ver o preview do ticket', canvas.width / 2, ticketY + ticketHeight / 2);
        
        // Tag task2025
        ctx.font = '12px Inconsolata, monospace';
        ctx.fillStyle = 'hsl(245, 15%, 58%)';
        ctx.fillText('#task2025', canvas.width / 2, ticketY + ticketHeight - 20);
    }

    // Atualiza preview do ticket em tempo real
    updateTicketPreview() {
        this.drawTicket();
    }

    // Desenha ticket com dados preenchidos
    drawTicket() {
        const ctx = this.ctx;
        const canvas = this.canvas;
        
        // Limpa canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Background do ticket (gradiente roxo)
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, 'hsl(248, 70%, 10%)');
        gradient.addColorStop(0.5, 'hsl(245, 19%, 35%)');
        gradient.addColorStop(1, 'hsl(248, 70%, 10%)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Área principal do ticket
        const ticketX = 40;
        const ticketY = 60;
        const ticketWidth = canvas.width - 80;
        const ticketHeight = 280;
        
        // Fundo do cartão
        ctx.fillStyle = 'hsl(245, 19%, 35%)';
        this.roundRect(ctx, ticketX, ticketY, ticketWidth, ticketHeight, 16);
        ctx.fill();
        
        // Gradiente overlay no cartão
        const cardGradient = ctx.createLinearGradient(ticketX, ticketY, ticketX + ticketWidth, ticketY + ticketHeight);
        cardGradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
        cardGradient.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
        ctx.fillStyle = cardGradient;
        this.roundRect(ctx, ticketX, ticketY, ticketWidth, ticketHeight, 16);
        ctx.fill();
        
        // Header do ticket
        ctx.fillStyle = 'hsl(7, 88%, 67%)';
        ctx.font = 'bold 20px Inconsolata, monospace';
        ctx.textAlign = 'left';
        ctx.fillText('Coding Conf', ticketX + 24, ticketY + 40);
        
        // Data e local
        ctx.fillStyle = 'hsl(0, 0%, 100%)';
        ctx.font = '14px Inconsolata, monospace';
        ctx.fillText('Jan 31, 2025 / Austin, TX', ticketX + 24, ticketY + 65);
        
        // Verifica se tem dados para mostrar
        const hasData = this.formData.fullName || this.formData.email || this.formData.githubUsername;
        
        if (!hasData && !this.avatarImage) {
            // Mostra placeholder se não há dados
            ctx.fillStyle = 'hsla(0, 0%, 100%, 0.6)';
            ctx.font = '16px Inconsolata, monospace';
            ctx.textAlign = 'center';
            ctx.fillText('Complete o formulário para ver o preview do ticket', canvas.width / 2, ticketY + ticketHeight / 2);
        } else {
            // Avatar
            if (this.avatarImage) {
                this.drawTicketAvatar(ticketX + 24, ticketY + 90, 60);
            } else {
                // Avatar placeholder
                ctx.fillStyle = 'hsl(245, 15%, 58%)';
                ctx.beginPath();
                ctx.arc(ticketX + 54, ticketY + 120, 30, 0, 2 * Math.PI);
                ctx.fill();
                
                ctx.fillStyle = 'hsl(0, 0%, 100%)';
                ctx.font = '24px Inconsolata, monospace';
                ctx.textAlign = 'center';
                ctx.fillText('👤', ticketX + 54, ticketY + 130);
            }
            
            // Informações do participante
            ctx.textAlign = 'left';
            
            // Nome (com gradiente se preenchido)
            if (this.formData.fullName) {
                ctx.font = 'bold 22px Inconsolata, monospace';
                
                // Cria gradiente para o nome
                const nameGradient = ctx.createLinearGradient(ticketX + 100, ticketY + 110, ticketX + 100 + 250, ticketY + 110);
                nameGradient.addColorStop(0, 'hsl(7, 86%, 67%)');
                nameGradient.addColorStop(1, 'hsl(0, 0%, 100%)');
                ctx.fillStyle = nameGradient;
                
                ctx.fillText(this.formData.fullName, ticketX + 100, ticketY + 110);
            } else {
                ctx.font = '16px Inconsolata, monospace';
                ctx.fillStyle = 'hsla(0, 0%, 100%, 0.5)';
                ctx.fillText('Seu Nome Aqui', ticketX + 100, ticketY + 110);
            }
            
            // GitHub username
            if (this.formData.githubUsername) {
                ctx.font = '16px Inconsolata, monospace';
                ctx.fillStyle = 'hsl(0, 0%, 100%)';
                const displayUsername = this.formData.githubUsername.startsWith('@') ? 
                                      this.formData.githubUsername : 
                                      `@${this.formData.githubUsername}`;
                ctx.fillText(`${displayUsername}`, ticketX + 100, ticketY + 135);
            } else {
                ctx.font = '14px Inconsolata, monospace';
                ctx.fillStyle = 'hsla(0, 0%, 100%, 0.5)';
                ctx.fillText('@seu-github', ticketX + 100, ticketY + 135);
            }
        }
        
        // Linha decorativa
        const lineY = ticketY + ticketHeight - 60;
        ctx.strokeStyle = 'hsl(245, 15%, 58%)';
        ctx.lineWidth = 1;
        ctx.setLineDash([8, 4]);
        ctx.beginPath();
        ctx.moveTo(ticketX + 24, lineY);
        ctx.lineTo(ticketX + ticketWidth - 24, lineY);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Número do ticket
        ctx.font = 'bold 14px Inconsolata, monospace';
        ctx.fillStyle = 'hsl(7, 88%, 67%)';
        ctx.textAlign = 'right';
        const ticketNumber = this.generateTicketNumber();
        ctx.fillText(`#${ticketNumber}`, ticketX + ticketWidth - 24, ticketY + ticketHeight - 20);
        
        // Tag task2025
        ctx.font = '12px Inconsolata, monospace';
        ctx.fillStyle = 'hsl(245, 15%, 58%)';
        ctx.textAlign = 'center';
        ctx.fillText('#task2025', canvas.width / 2, ticketY + ticketHeight - 10);
    }

    // Desenha avatar no ticket
    drawTicketAvatar(x, y, size) {
        const ctx = this.ctx;
        const radius = size / 2;
        
        ctx.save();
        ctx.beginPath();
        ctx.arc(x + radius, y + radius, radius, 0, 2 * Math.PI);
        ctx.clip();
        
        ctx.drawImage(this.avatarImage, x, y, size, size);
        
        ctx.restore();
        
        // Borda do avatar
        ctx.strokeStyle = 'hsl(7, 88%, 67%)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x + radius, y + radius, radius, 0, 2 * Math.PI);
        ctx.stroke();
    }

    // Gera número único do ticket
    generateTicketNumber() {
        const name = this.formData.fullName || 'USER';
        const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        const randomNum = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
        return `${initials}${randomNum}`;
    }

    // Função auxiliar para desenhar retângulos com cantos arredondados
    roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.arcTo(x + width, y, x + width, y + radius, radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
        ctx.lineTo(x + radius, y + height);
        ctx.arcTo(x, y + height, x, y + height - radius, radius);
        ctx.lineTo(x, y + radius);
        ctx.arcTo(x, y, x + radius, y, radius);
        ctx.closePath();
        return ctx;
    }

    // Download do ticket
    downloadTicket() {
        const link = document.createElement('a');
        const fileName = `coding-conf-ticket-${this.formData.fullName.replace(/\s+/g, '_')}.png`;
        link.download = fileName;
        link.href = this.canvas.toDataURL('image/png');
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showToast('Ticket baixado com sucesso!', 'success');
    }

    // ==================== MÉTODOS PARA DEMONSTRAÇÃO NO VÍDEO ====================
    
    // Altera validação de nome
    setNameValidation(mode) {
        this.validationConfig.nameValidation = mode; // 'first' ou 'full'
        console.log(`Nome validation changed to: ${mode}`);
        console.log('Try typing "João" (first only) or "João Silva" (full name)');
        
        // Revalida campo se já tiver valor
        const nameField = document.getElementById('fullName');
        if (nameField.value) {
            this.validateField(nameField);
        }
    }
    
    // CORRIGIDO: Altera validação do GitHub
    setGitHubValidation(mode) {
        this.validationConfig.githubValidation = mode; // 'require_at', 'no_at', 'flexible'
        console.log(`GitHub validation changed to: ${mode}`);
        
        const examples = {
            'require_at': 'Must start with @ (e.g., @username)',
            'no_at': 'Cannot have @ (automatically removed)',
            'flexible': 'Works with or without @ (automatically normalized)'
        };
        console.log(`Behavior: ${examples[mode]}`);
        
        // Força revalidação do campo se já tiver valor
        const githubField = document.getElementById('githubUsername');
        if (githubField.value) {
            // Limpa erros anteriores
            githubField.classList.remove('error', 'success');
            this.showInlineError('githubUsername', '', true);
            
            // Revalida com nova configuração
            setTimeout(() => {
                this.validateField(githubField);
            }, 100);
        }
    }
    
    // Altera modo de exibição de erro
    setErrorDisplayMode(mode) {
        this.validationConfig.displayMode = mode; // 'inline', 'above', 'alert', 'toast'
        console.log(`Error display mode changed to: ${mode}`);
        
        // Limpa erros existentes
        document.querySelectorAll('.error-message, .error-above').forEach(el => {
            if (!el.id.includes('Error')) el.remove(); // Remove erros 'above'
            else el.textContent = ''; // Limpa erros inline
        });
    }

    // ==================== MÉTODOS DE DEMONSTRAÇÃO RÁPIDA ====================
    
    demonstrateFirstNameValidation() {
        console.log('=== DEMONSTRAÇÃO: Validação Primeiro Nome ===');
        this.setNameValidation('first');
        console.log('Now try typing "João Silva" to see the validation error');
    }
    
    demonstrateFullNameValidation() {
        console.log('=== DEMONSTRAÇÃO: Validação Nome Completo ===');
        this.setNameValidation('full');
        console.log('Now try typing just "João" to see the validation error');
    }
    
    demonstrateGitHubValidations() {
        console.log('=== DEMONSTRAÇÃO: Validações GitHub ===');
        console.log('Available modes:');
        console.log('• setGitHubValidation("require_at") - Must have @');
        console.log('• setGitHubValidation("no_at") - Cannot have @');
        console.log('• setGitHubValidation("flexible") - Works either way');
    }
    
    demonstrateErrorModes() {
        console.log('=== DEMONSTRAÇÃO: Modos de Exibição de Erro ===');
        console.log('Available display modes:');
        console.log('• setErrorDisplayMode("inline") - Below field (default)');
        console.log('• setErrorDisplayMode("above") - Above field');
        console.log('• setErrorDisplayMode("alert") - Browser alert');
        console.log('• setErrorDisplayMode("toast") - Toast notification');
    }

    // Método para resetar todas as configurações
    resetToDefaults() {
        this.validationConfig = {
            displayMode: 'inline',
            nameValidation: 'full',
            githubValidation: 'flexible'
        };
        console.log('All validation settings reset to defaults');
        
        // Limpa todos os erros
        document.querySelectorAll('.error-message, .error-above').forEach(el => {
            if (!el.id.includes('Error')) el.remove();
            else el.textContent = '';
        });
        
        // Remove classes de erro
        document.querySelectorAll('input').forEach(input => {
            input.classList.remove('error', 'success');
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create application instance
    window.ticketGenerator = new ConferenceTicketGenerator();
    
    // Console help for video demonstration
    console.log('');
    console.log('CONFERENCE TICKET GENERATOR - FRONTEND MENTOR');
    console.log('Challenge #task2025 - HTML/CSS/JS Puro');
    console.log('');
    console.log('MÉTODOS PARA DEMONSTRAÇÃO NO VÍDEO:');
    console.log('');
    console.log('VALIDAÇÃO DE NOME:');
    console.log('  • ticketGenerator.setNameValidation("first")   - Apenas primeiro nome');
    console.log('  • ticketGenerator.setNameValidation("full")    - Nome e sobrenome');
    console.log('');
    console.log('VALIDAÇÃO GITHUB:');
    console.log('  • ticketGenerator.setGitHubValidation("require_at")  - Exige @');
    console.log('  • ticketGenerator.setGitHubValidation("no_at")       - Não permite @');
    console.log('  • ticketGenerator.setGitHubValidation("flexible")    - Aceita ambos');
    console.log('');
    console.log('MODO DE EXIBIÇÃO DE ERRO:');
    console.log('  • ticketGenerator.setErrorDisplayMode("inline")  - Abaixo do campo');
    console.log('  • ticketGenerator.setErrorDisplayMode("above")   - Acima do campo');
    console.log('  • ticketGenerator.setErrorDisplayMode("alert")   - Alert do browser');
    console.log('  • ticketGenerator.setErrorDisplayMode("toast")   - Toast notification');
    console.log('');
    console.log('DEMONSTRAÇÕES RÁPIDAS:');
    console.log('  • ticketGenerator.demonstrateFirstNameValidation()');
    console.log('  • ticketGenerator.demonstrateFullNameValidation()');
    console.log('  • ticketGenerator.demonstrateGitHubValidations()');
    console.log('  • ticketGenerator.demonstrateErrorModes()');
    console.log('');
    console.log('RESET: ticketGenerator.resetToDefaults()');
    console.log('');
    console.log('MUDANÇAS:');
    console.log('✓ Botão "Enviar Meu Ticket" sempre habilitado');
    console.log('✓ Validação ocorre apenas no submit');
    console.log('✓ Validação GitHub corrigida - testa todos os modos!');
    console.log('');
    console.log('Aplicação inicializada com assets oficiais do Frontend Mentor!');
    console.log('Estrutura esperada: ./assets/images/ e ./assets/fonts/');
});