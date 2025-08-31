// Conference Ticket Generator - Frontend Mentor Challenge #task2025
class ConferenceTicketGenerator {
    constructor() {
        // Elementos DOM principais
        this.form = document.getElementById('ticketForm');
        this.canvas = document.getElementById('ticketCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.generateBtn = document.getElementById('generateBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        
        // Estado da aplicação
        this.formData = {
            fullName: '',
            email: '',
            githubUsername: ''
        };
        this.avatarImage = null;
        
        this.init();
    }

    // Inicialização da aplicação
    init() {
        this.setupEventListeners();
        this.drawEmptyTicket(); // Desenha ticket vazio inicial
        console.log('Conference Ticket Generator inicializado - Frontend Mentor Challenge #task2025');
    }

    // Configuração dos event listeners
    setupEventListeners() {
        // Eventos de input em tempo real
        const textInputs = this.form.querySelectorAll('input[type="text"], input[type="email"]');
        textInputs.forEach(input => {
            input.addEventListener('input', (e) => this.handleInputChange(e));
        });

        // Setup básico do upload de avatar
        this.setupAvatarUpload();

        // Submit do formulário
        this.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }

    // Configuração do upload de avatar
    setupAvatarUpload() {
        const avatarInput = document.getElementById('avatar');
        const avatarPreview = document.getElementById('avatarPreview');

        // Click para upload
        avatarPreview.addEventListener('click', () => avatarInput.click());

        // Mudança de arquivo
        avatarInput.addEventListener('change', (e) => this.handleAvatarUpload(e));
    }

    // Manipula mudanças nos campos de input
    handleInputChange(event) {
        const { name, value } = event.target;
        this.formData[name] = value;
        
        // Atualiza preview do ticket em tempo real
        this.updateTicketPreview();
        
        console.log(`Campo ${name} atualizado:`, value);
    }

    // Upload de avatar
    handleAvatarUpload(event) {
        const file = event.target.files[0];
        if (file) {
            // Validação básica do arquivo
            if (!file.type.startsWith('image/')) {
                alert('Por favor, envie um arquivo de imagem');
                return;
            }
            
            if (file.size > 500 * 1024) {
                alert('Arquivo deve ser menor que 500KB');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    this.avatarImage = img;
                    this.showAvatarPreview(e.target.result);
                    this.updateTicketPreview(); // Atualiza preview com avatar
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    // Mostra preview do avatar
    showAvatarPreview(imageSrc) {
        const preview = document.getElementById('avatarPreview');
        preview.innerHTML = `<img src="${imageSrc}" alt="Preview do Avatar" class="avatar-image">`;
        preview.classList.add('has-image');
    }

    // Handle form submission
    handleFormSubmit(event) {
        event.preventDefault();
        console.log('Formulário enviado com dados:', this.formData);
        alert('Formulário enviado! (validação em desenvolvimento)');
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
            }
            
            // Informações do participante
            ctx.textAlign = 'left';
            
            // Nome
            if (this.formData.fullName) {
                ctx.font = 'bold 22px Inconsolata, monospace';
                ctx.fillStyle = 'hsl(0, 0%, 100%)';
                ctx.fillText(this.formData.fullName, ticketX + 100, ticketY + 110);
            }
            
            // GitHub username
            if (this.formData.githubUsername) {
                ctx.font = '16px Inconsolata, monospace';
                ctx.fillStyle = 'hsl(0, 0%, 100%)';
                const displayUsername = this.formData.githubUsername.startsWith('@') ? 
                                      this.formData.githubUsername : 
                                      `@${this.formData.githubUsername}`;
                ctx.fillText(`${displayUsername}`, ticketX + 100, ticketY + 135);
            }
        }
        
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
}

// Inicialização quando o DOM é carregado
document.addEventListener('DOMContentLoaded', () => {
    window.ticketGenerator = new ConferenceTicketGenerator();
    
    console.log('Conference Ticket Generator inicializado com preview em tempo real!');
    console.log('Sistema de canvas implementado para renderização do ticket.');
});