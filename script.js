document.addEventListener('DOMContentLoaded', function() {
    const chatBox = document.getElementById('chatBox');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    
    // Load chat history from local storage
    let chatHistory = JSON.parse(localStorage.getItem('hrChatHistory')) || [];
    
    // Initialize chat
    loadChatHistory();
    
    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Quick question buttons
    document.querySelectorAll('.quick-btn').forEach(button => {
        button.addEventListener('click', function() {
            const question = this.getAttribute('data-question');
            userInput.value = question;
            sendMessage();
        });
    });
    
    // Clear history button
    document.getElementById('clearHistory').addEventListener('click', function() {
        if (confirm('Are you sure you want to clear chat history?')) {
            chatHistory = [];
            localStorage.removeItem('hrChatHistory');
            chatBox.innerHTML = '';
            addMessage("Hello! I'm your HR assistant. How can I help you today?", 'bot');
        }
    });
    
    function sendMessage() {
        const message = userInput.value.trim();
        if (message === '') return;
        
        addMessage(message, 'user');
        userInput.value = '';
        
        showTypingIndicator();
        
        // Simulate API call with timeout
        simulateApiCall(message)
            .then(response => {
                hideTypingIndicator();
                addMessage(response, 'bot');
            })
            .catch(error => {
                hideTypingIndicator();
                addMessage("Sorry, I encountered an error. Please try again.", 'bot');
                console.error('API error:', error);
            });
    }
    
    function simulateApiCall(message) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(getBotResponse(message));
            }, 1000 + Math.random() * 2000);
        });
    }
    
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add(`${sender}-message`);
        messageDiv.textContent = text;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
        
        // Save to history (excluding typing indicators)
        if (sender !== 'typing') {
            chatHistory.push({ text, sender });
            localStorage.setItem('hrChatHistory', JSON.stringify(chatHistory));
        }
    }
    
    function loadChatHistory() {
        if (chatHistory.length === 0) {
            addMessage("Hello! I'm your HR assistant. How can I help you today?", 'bot');
            return;
        }
        
        chatHistory.forEach(msg => {
            addMessage(msg.text, msg.sender);
        });
    }
    
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typingIndicator';
        typingDiv.classList.add('bot-message', 'typing');
        typingDiv.textContent = 'Bot is typing';
        chatBox.appendChild(typingDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
    
    function hideTypingIndicator() {
        const typingDiv = document.getElementById('typingIndicator');
        if (typingDiv) {
            typingDiv.remove();
        }
    }
    
    function getBotResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        
        // Interview responses
        if (/(interview|hiring|apply|application)/.test(lowerMessage)) {
            if (/(process|steps|stages)/.test(lowerMessage)) {
                const variations = [
                    "Our interview process typically involves: 1) Resume screening, 2) Technical assessment, 3) HR interview, and 4) Final discussion. The process usually takes 2-3 weeks.",
                    "The hiring process consists of four main stages: initial screening, technical evaluation, cultural fit interview, and final approval. We aim to complete it within 15-20 days.",
                    "When applying, you'll go through: document verification, skills assessment, HR discussion, and manager review. The timeline depends on candidate availability."
                ];
                return variations[Math.floor(Math.random() * variations.length)];
            } else if (/(prepare|ready|study)/.test(lowerMessage)) {
                return "To prepare for a technical interview, review core concepts, practice coding problems, and be ready to discuss your past projects. For HR interviews, focus on your soft skills and behavioral questions.";
            } else if (/(technical|coding|test)/.test(lowerMessage)) {
                return "Technical interviews typically last 45-60 minutes and may involve live coding, system design, or problem-solving questions. Make sure you understand the fundamentals of your field.";
            }
            return "For interview-related questions, we can discuss the process, preparation tips, or specific interview stages. What would you like to know?";
        }
        
        // Common HR situations
        else if (/(leave|time off|vacation|holiday)/.test(lowerMessage)) {
            return "Employees are entitled to 20 paid leave days per year. You can apply for leave through our HR portal with at least 3 days' notice for planned leave.";
        } else if (/(promotion|raise|salary increase)/.test(lowerMessage)) {
            return "Promotion cycles occur twice a year in June and December. Performance reviews determine eligibility for promotions and raises. Would you like more details about our performance metrics?";
        } else if (/(benefit|perk)/.test(lowerMessage)) {
            return "Our benefits package includes health insurance, retirement plans, flexible work options, professional development budget, and wellness programs. Is there a specific benefit you'd like more information about?";
        }
        
        // Employee issues
        else if (/(conflict|issue|problem|colleague|team member)/.test(lowerMessage)) {
            return "For workplace conflicts, I recommend first trying to resolve it directly with the colleague. If that doesn't work, you can approach your manager or HR for mediation. Would you like to schedule a confidential discussion?";
        } else if (/(workload|stress|overwhelmed|busy)/.test(lowerMessage)) {
            return "If you're feeling overwhelmed, consider discussing workload prioritization with your manager. We also offer employee assistance programs and mental health resources. Your well-being is important to us.";
        } else if (/(resign|quit|exit|notice period)/.test(lowerMessage)) {
            return "We're sorry to hear you're considering leaving. The notice period is 30 days. Before you decide, would you like to discuss any concerns with HR or explore internal transfer options?";
        }
        
        // Female employee issues
        else if (/(maternity|pregnancy|pregnant|mother)/.test(lowerMessage)) {
            return "We offer 6 months of maternity leave with full pay. You're also entitled to flexible work arrangements for 6 months after returning. Would you like details about our maternity policy document?";
        } else if (/(harassment|discrimination|abuse|unsafe)/.test(lowerMessage)) {
            return "We take such matters very seriously. All complaints are handled confidentially. You can report issues directly to HR or through our anonymous reporting channel. Your safety and comfort are our priority.";
        } else if (/(flexible|work from home|remote|wfh)/.test(lowerMessage)) {
            return "We support flexible work arrangements, especially for new mothers. Options include adjusted hours, remote work, or part-time schedules. Let me know what would work best for you.";
        }
        
        // Default responses
        const defaultResponses = [
            "I'm an HR assistant specializing in IT company policies. Could you please rephrase your question?",
            "I can help with HR policies, employee issues, and workplace concerns. What specifically would you like to know?",
            "I didn't quite understand. Could you provide more details about your HR-related question?",
            "I'm here to help with HR matters. Could you clarify your question about interviews, policies, or employee concerns?"
        ];
        
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }
});