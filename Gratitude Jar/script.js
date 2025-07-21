// Gratitude Jar Application
class GratitudeJar {
    constructor() {
        this.notes = [];
        this.noteColors = [
            'var(--note-color-1)',
            'var(--note-color-2)',
            'var(--note-color-3)',
            'var(--note-color-4)',
            'var(--note-color-5)',
            'var(--note-color-6)',
            'var(--note-color-7)',
            'var(--note-color-8)'
        ];
        
        this.init();
    }

    init() {
        this.loadNotes();
        this.setupEventListeners();
        this.displayTodaysGratitude();
        this.renderNotes();
        this.updateNotesCount();
    }

    setupEventListeners() {
        const form = document.getElementById('gratitudeForm');
        const textarea = document.getElementById('gratitudeText');
        const charCount = document.getElementById('charCount');

        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addNote();
        });

        // Character counter
        textarea.addEventListener('input', () => {
            const length = textarea.value.length;
            charCount.textContent = `${length} / 200`;
            
            if (length > 180) {
                charCount.style.color = '#F56565';
            } else if (length > 150) {
                charCount.style.color = '#ED8936';
            } else {
                charCount.style.color = 'var(--text-secondary)';
            }
        });

        // Auto-resize textarea
        textarea.addEventListener('input', () => {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Enter to submit form
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                this.addNote();
            }
        });
    }

    addNote() {
        const textarea = document.getElementById('gratitudeText');
        const text = textarea.value.trim();
        
        if (!text) {
            this.showError('Please enter a gratitude message');
            return;
        }

        if (text.length > 200) {
            this.showError('Message is too long. Please keep it under 200 characters.');
            return;
        }

        const note = {
            id: Date.now().toString(),
            text: text,
            date: new Date().toISOString(),
            color: this.getRandomColor()
        };

        this.notes.unshift(note); // Add to beginning for newest first
        this.saveNotes();
        this.renderNotes();
        this.updateNotesCount();
        this.displayTodaysGratitude();
        
        // Clear form with animation
        textarea.value = '';
        textarea.style.height = 'auto';
        document.getElementById('charCount').textContent = '0 / 200';
        document.getElementById('charCount').style.color = 'var(--text-secondary)';
        
        // Show success feedback
        this.showSuccess('Gratitude added to your jar! ✨');
        
        // Focus back to textarea for easy multiple entries
        setTimeout(() => textarea.focus(), 100);
    }

    deleteNote(noteId) {
        const noteElement = document.querySelector(`[data-note-id="${noteId}"]`);
        
        if (noteElement) {
            // Add delete animation
            noteElement.style.animation = 'noteDelete 0.4s ease-out forwards';
            
            setTimeout(() => {
                this.notes = this.notes.filter(note => note.id !== noteId);
                this.saveNotes();
                this.renderNotes();
                this.updateNotesCount();
                this.displayTodaysGratitude();
                this.showSuccess('Note removed from jar');
            }, 400);
        }
    }

    renderNotes() {
        const notesGrid = document.getElementById('notesGrid');
        const emptyState = document.getElementById('emptyState');
        
        if (this.notes.length === 0) {
            notesGrid.innerHTML = '';
            emptyState.classList.remove('hidden');
            return;
        }

        emptyState.classList.add('hidden');
        
        notesGrid.innerHTML = this.notes.map(note => this.createNoteHTML(note)).join('');
        
        // Add click listeners for delete buttons
        notesGrid.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-btn')) {
                const noteId = e.target.closest('.note').dataset.noteId;
                if (confirm('Are you sure you want to remove this gratitude note?')) {
                    this.deleteNote(noteId);
                }
            }
        });
    }

    createNoteHTML(note) {
        const date = new Date(note.date);
        const formattedDate = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
        
        const timeAgo = this.getTimeAgo(date);

        return `
            <div class="note" data-note-id="${note.id}" style="background-color: ${note.color};" tabindex="0" role="article" aria-label="Gratitude note from ${formattedDate}">
                <div class="note-content">${this.escapeHtml(note.text)}</div>
                <div class="note-footer">
                    <span class="note-date" title="${date.toLocaleString()}">${timeAgo}</span>
                    <button class="delete-btn" aria-label="Delete this note" title="Delete note">
                        🗑️
                    </button>
                </div>
            </div>
        `;
    }

    displayTodaysGratitude() {
        const todaysNote = document.getElementById('todaysNote');
        const todaysText = document.getElementById('todaysText');
        
        if (this.notes.length === 0) {
            todaysText.textContent = "Add your first gratitude note to see a daily inspiration!";
            todaysNote.style.background = 'linear-gradient(135deg, var(--accent-color), #EAB308)';
            return;
        }

        // Get a "random" note based on today's date for consistency
        const today = new Date().toDateString();
        const seed = this.hashCode(today);
        const randomIndex = Math.abs(seed) % this.notes.length;
        const selectedNote = this.notes[randomIndex];
        
        todaysText.textContent = selectedNote.text;
        todaysNote.style.backgroundColor = selectedNote.color;
    }

    updateNotesCount() {
        const notesCount = document.getElementById('notesCount');
        const count = this.notes.length;
        notesCount.textContent = count === 1 ? '1 note' : `${count} notes`;
    }

    getRandomColor() {
        return this.noteColors[Math.floor(Math.random() * this.noteColors.length)];
    }

    getTimeAgo(date) {
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
        if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
        return `${Math.floor(diffInSeconds / 31536000)}y ago`;
    }

    hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    saveNotes() {
        try {
            localStorage.setItem('gratitudeNotes', JSON.stringify(this.notes));
        } catch (error) {
            console.error('Failed to save notes to localStorage:', error);
            this.showError('Failed to save your note. Please try again.');
        }
    }

    loadNotes() {
        try {
            const saved = localStorage.getItem('gratitudeNotes');
            if (saved) {
                this.notes = JSON.parse(saved);
                // Validate loaded notes
                this.notes = this.notes.filter(note => 
                    note && 
                    typeof note.id === 'string' && 
                    typeof note.text === 'string' && 
                    typeof note.date === 'string'
                );
            }
        } catch (error) {
            console.error('Failed to load notes from localStorage:', error);
            this.notes = [];
            this.showError('Failed to load saved notes. Starting fresh.');
        }
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelector('.notification');
        if (existing) {
            existing.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 2rem;
            right: 2rem;
            background: ${type === 'error' ? '#FEB2B2' : '#C6F6D5'};
            color: ${type === 'error' ? '#C53030' : '#2F855A'};
            padding: 1rem 1.5rem;
            border-radius: var(--border-radius-note);
            box-shadow: 0 4px 12px var(--shadow-medium);
            z-index: 1001;
            font-weight: 600;
            animation: slideInRight 0.3s ease-out;
            max-width: 300px;
            word-wrap: break-word;
        `;

        document.body.appendChild(notification);

        // Auto-remove after 4 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out forwards';
            setTimeout(() => notification.remove(), 300);
        }, 4000);

        // Add slide animations
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes slideOutRight {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Export functionality for future enhancement
    exportNotes() {
        try {
            const dataStr = JSON.stringify(this.notes, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `gratitude-notes-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            this.showSuccess('Notes exported successfully!');
        } catch (error) {
            console.error('Export failed:', error);
            this.showError('Failed to export notes. Please try again.');
        }
    }

    // Import functionality for future enhancement
    importNotes(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedNotes = JSON.parse(e.target.result);
                if (Array.isArray(importedNotes)) {
                    this.notes = [...this.notes, ...importedNotes];
                    this.saveNotes();
                    this.renderNotes();
                    this.updateNotesCount();
                    this.displayTodaysGratitude();
                    this.showSuccess(`Imported ${importedNotes.length} notes successfully!`);
                } else {
                    this.showError('Invalid file format. Please select a valid JSON file.');
                }
            } catch (error) {
                console.error('Import failed:', error);
                this.showError('Failed to import notes. Please check the file format.');
            }
        };
        reader.readAsText(file);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Hide loading overlay
    const loadingOverlay = document.getElementById('loadingOverlay');
    setTimeout(() => {
        loadingOverlay.classList.remove('show');
    }, 500);

    // Initialize the Gratitude Jar application
    window.gratitudeJar = new GratitudeJar();

    // Add service worker registration for future PWA enhancement
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(() => {
            // Service worker registration failed, but that's okay
            console.log('Service worker registration not available');
        });
    }

    // Add keyboard accessibility
    document.addEventListener('keydown', (e) => {
        // ESC to close any open dialogs or focus textarea
        if (e.key === 'Escape') {
            document.getElementById('gratitudeText').focus();
        }
    });

    // Animate elements on scroll for better UX
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            }
        });
    }, observerOptions);

    // Observe note elements for scroll animations
    const noteElements = document.querySelectorAll('.note');
    noteElements.forEach(note => observer.observe(note));
});

// Handle online/offline status
window.addEventListener('online', () => {
    if (window.gratitudeJar) {
        window.gratitudeJar.showSuccess('You\'re back online! 🌐');
    }
});

window.addEventListener('offline', () => {
    if (window.gratitudeJar) {
        window.gratitudeJar.showError('You\'re offline. Your notes are saved locally. 📱');
    }
});

// Handle beforeunload to warn users about unsaved changes
window.addEventListener('beforeunload', (e) => {
    const textarea = document.getElementById('gratitudeText');
    if (textarea && textarea.value.trim()) {
        e.preventDefault();
        e.returnValue = 'You have an unsaved gratitude note. Are you sure you want to leave?';
        return e.returnValue;
    }
});
