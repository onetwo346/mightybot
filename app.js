// MIGHTY AI - Ultimate Frontend Experience
class MightyAI {
    constructor() {
        this.socket = null;
        this.messageCount = 0;
        this.sessionStartTime = Date.now();
        this.isTyping = false;
        this.currentService = null;
        
        this.initializeElements();
        this.initializeSocket();
        this.setupEventListeners();
        this.updateSessionTime();
        this.startAnimations();
        this.loadCapabilities();
        
        // Update session time every minute
        setInterval(() => this.updateSessionTime(), 60000);
        
        // Add some startup magic
        this.showStartupAnimation();
    }

    initializeElements() {
        this.messagesWrapper = document.getElementById('messagesWrapper');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.charCount = document.getElementById('charCount');
        this.messageCountElement = document.getElementById('messageCount');
        this.sessionTimeElement = document.getElementById('sessionTime');
        this.capabilityPills = document.querySelectorAll('.pill');
    }

    initializeSocket() {
        this.socket = io();
        
        this.socket.on('connect', () => {
            console.log('🚀 Connected to Mighty AI server');
            this.updateServiceStatus('connected');
            this.showNotification('Connected to Mighty AI! 🚀', 'success');
        });

        this.socket.on('disconnect', () => {
            console.log('❌ Disconnected from server');
            this.updateServiceStatus('disconnected');
            this.showNotification('Connection lost... 😔', 'error');
        });

        this.socket.on('ai_response', (data) => {
            this.handleAIResponse(data);
        });

        this.socket.on('typing_start', (data) => {
            this.showTypingIndicator(data.service);
        });

        this.socket.on('typing_stop', () => {
            this.hideTypingIndicator();
        });

        this.socket.on('error', (data) => {
            this.showError(data.message);
        });
    }

    setupEventListeners() {
        // Send button click
        this.sendButton.addEventListener('click', () => {
            this.sendMessage();
        });

        // Enter key to send, Shift+Enter for new line
        this.messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Auto-resize textarea
        this.messageInput.addEventListener('input', () => {
            this.updateCharCount();
            this.autoResizeTextarea();
        });

        // Focus input on page load
        this.messageInput.focus();
    }

    sendMessage() {
        const message = this.messageInput.value.trim();
        console.log('Send button clicked! Message:', message);
        if (!message || this.isTyping) {
            console.log('Message blocked - empty or typing');
            return;
        }

        // Add user message to chat with animation
        this.addMessage(message, 'user');
        
        // Add button click effect
        this.sendButton.classList.add('loading');
        
        // Send to server
        this.socket.emit('send_message', {
            message: message,
            userId: 'user'
        });

        // Clear input and reset
        this.messageInput.value = '';
        this.updateCharCount();
        this.autoResizeTextarea();
        this.messageInput.focus();
        
        // Remove loading effect after a moment
        setTimeout(() => {
            this.sendButton.classList.remove('loading');
        }, 1000);
    }

    addMessage(message, type, service = null, timestamp = null) {
        console.log(`Adding ${type} message:`, message);
        const messageGroup = document.createElement('div');
        messageGroup.className = `message-group ${type}-group`;
        
        // Avatar
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        
        const avatarInner = document.createElement('div');
        avatarInner.className = 'avatar-inner';
        
        if (type === 'user') {
            avatarInner.innerHTML = '<i class="fas fa-user"></i>';
        } else {
            avatarInner.innerHTML = '<i class="fas fa-robot"></i>';
        }
        
        const avatarGlow = document.createElement('div');
        avatarGlow.className = 'avatar-glow';
        avatarInner.appendChild(avatarGlow);
        
        avatar.appendChild(avatarInner);
        
        // Message bubble
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        if (type === 'ai') bubble.classList.add('ai-bubble');
        
        const header = document.createElement('div');
        header.className = 'message-header';
        
        const senderName = document.createElement('span');
        senderName.className = 'sender-name';
        senderName.textContent = type === 'user' ? 'You' : (service || 'Mighty AI');
        
        const messageTime = document.createElement('span');
        messageTime.className = 'message-time';
        messageTime.textContent = timestamp ? this.formatTime(timestamp) : 'Just now';
        
        header.appendChild(senderName);
        header.appendChild(messageTime);
        
        const content = document.createElement('div');
        content.className = 'message-content';
        
        const messageText = document.createElement('p');
        messageText.textContent = message;
        
        content.appendChild(messageText);
        
        bubble.appendChild(header);
        bubble.appendChild(content);
        
        messageGroup.appendChild(avatar);
        messageGroup.appendChild(bubble);
        
        if (this.messagesWrapper) {
            this.messagesWrapper.appendChild(messageGroup);
            this.scrollToBottom();
            console.log(`Message added to DOM. Total messages: ${this.messagesWrapper.children.length}`);
        } else {
            console.error('messagesWrapper not found!');
        }
        
        // Update message count with animation (only for user messages to avoid double counting)
        if (type === 'user') {
            this.messageCount++;
            if (this.messageCountElement) {
                this.messageCountElement.textContent = this.messageCount;
                this.messageCountElement.classList.add('success');
                setTimeout(() => {
                    this.messageCountElement.classList.remove('success');
                }, 600);
            }
        }
        
        // Highlight active capability when AI responds
        if (type === 'ai') {
            this.highlightActiveCapability();
        }
    }

    handleAIResponse(data) {
        this.addMessage(data.message, 'ai', data.service, data.timestamp);
    }

    showTypingIndicator(service) {
        this.isTyping = true;
        if (this.typingIndicator) {
            this.typingIndicator.style.display = 'flex';
            this.scrollToBottom();
        }
    }

    hideTypingIndicator() {
        this.isTyping = false;
        if (this.typingIndicator) {
            this.typingIndicator.style.display = 'none';
        }
    }

    showError(message) {
        this.addMessage(`❌ Error: ${message}`, 'ai', 'System');
    }

    updateCharCount() {
        const count = this.messageInput.value.length;
        this.charCount.textContent = count;
        
        // Change color based on count
        if (count > 1800) {
            this.charCount.style.color = '#ff6b6b';
        } else if (count > 1500) {
            this.charCount.style.color = '#feca57';
        } else {
            this.charCount.style.color = '#999';
        }
    }

    autoResizeTextarea() {
        this.messageInput.style.height = 'auto';
        this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 120) + 'px';
    }

    scrollToBottom() {
        setTimeout(() => {
            this.messagesWrapper.scrollTop = this.messagesWrapper.scrollHeight;
        }, 100);
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return date.toLocaleDateString();
    }

    updateSessionTime() {
        const elapsed = Math.floor((Date.now() - this.sessionStartTime) / 60000);
        this.sessionTimeElement.textContent = `${elapsed}m`;
    }

    updateServiceStatus(status) {
        const statusDots = document.querySelectorAll('.pill-status');
        statusDots.forEach(dot => {
            if (status === 'connected') {
                dot.style.animation = 'pulse-dot 2s infinite';
                dot.style.opacity = '1';
            } else {
                dot.style.animation = 'none';
                dot.style.opacity = '0.3';
            }
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--cosmic-green)' : 'var(--cosmic-pink)'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            z-index: 1000;
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    highlightActiveCapability() {
        // Randomly highlight a capability to show AI is working
        const randomIndex = Math.floor(Math.random() * this.capabilityPills.length);
        const randomPill = this.capabilityPills[randomIndex];
        
        if (randomPill) {
            randomPill.classList.add('active');
            setTimeout(() => {
                randomPill.classList.remove('active');
            }, 3000);
        }
    }

    startAnimations() {
        // Add floating animation to stats
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.2}s`;
            card.style.animation = 'slideInUp 0.6s ease-out forwards';
        });
        
        // Add staggered animation to capability pills
        this.capabilityPills.forEach((pill, index) => {
            pill.style.animationDelay = `${index * 0.1}s`;
            pill.style.animation = 'slideInUp 0.5s ease-out forwards';
        });
    }

    showStartupAnimation() {
        // Add startup glow to brand icon
        const brandIcon = document.querySelector('.brand-icon');
        if (brandIcon) {
            brandIcon.style.animation = 'pulse-glow 2s ease-in-out infinite alternate';
        }
        
        // Welcome message typing effect
        setTimeout(() => {
            this.showNotification('🚀 Mighty AI initialized successfully!', 'success');
        }, 1000);
    }

    async loadCapabilities() {
        try {
            const response = await fetch('/api/capabilities');
            const capabilities = await response.json();
            console.log('AI capabilities loaded:', capabilities.length);
        } catch (error) {
            console.error('Failed to load capabilities:', error);
        }
    }
}

// Initialize the MIGHTY AI when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.mightyAI = new MightyAI();
});

// Add some fun easter eggs
document.addEventListener('keydown', (e) => {
    // Ctrl+Shift+M to focus input
    if (e.ctrlKey && e.shiftKey && e.key === 'M') {
        e.preventDefault();
        document.getElementById('messageInput').focus();
    }
    
    // Ctrl+Shift+C to clear chat
    if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        if (confirm('Clear all messages?')) {
            document.getElementById('chatMessages').innerHTML = '';
            document.getElementById('messageCount').textContent = '0';
        }
    }
});
