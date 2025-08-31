// Estrutura inicial do Conference Ticket Generator - Frontend Mentor Challenge #task2025

// Inicialização quando o DOM é carregado
document.addEventListener('DOMContentLoaded', function() {
    // Referências aos elementos DOM
    const form = document.getElementById('ticketForm');
    const generateBtn = form.querySelector('.generate-btn');
    
    // Estado inicial da aplicação
    let formData = {
        fullName: '',
        email: '',
        githubUsername: ''
    };
    
    console.log('Conference Ticket Generator iniciado - Frontend Mentor Challenge #task2025');
    
    // Event listeners básicos
    setupEventListeners();
    
    // Configuração de event listeners para o formulário
    function setupEventListeners() {
        // Evento de submit do formulário
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            console.log('Formulário enviado!');
            alert('Formulário enviado! (funcionalidade em desenvolvimento)');
        });
        
        // Captura de dados dos inputs em tempo real
        const inputs = form.querySelectorAll('input[type="text"], input[type="email"]');
        inputs.forEach(input => {
            input.addEventListener('input', function(event) {
                const { name, value } = event.target;
                formData[name] = value;
                console.log(`Campo ${name} atualizado:`, value);
            });
        });
        
        // Upload de arquivo (funcionalidade básica)
        const avatarInput = document.getElementById('avatar');
        avatarInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                console.log('Arquivo selecionado:', file.name);
            }
        });
    }
    
    console.log('Event listeners configurados com sucesso');
});