document.addEventListener('DOMContentLoaded', () => {
    // --- Authentication ---
    const loginOverlay = document.getElementById('login-overlay');
    const loginForm = document.getElementById('login-form');
    const passwordInput = document.getElementById('password');
    const logoutBtn = document.getElementById('logout-btn');
    
    if (sessionStorage.getItem('lebois_admin_auth') === 'true') {
        loginOverlay.style.display = 'none';
        loadSubmissions();
        loadSettings();
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Simple password check (In real app, use backend)
        if (passwordInput.value === 'LeBoisTech!2024&****)') {
            sessionStorage.setItem('lebois_admin_auth', 'true');
            loginOverlay.style.display = 'none';
            loadSubmissions();
            loadSettings();
        } else {
            alert('Access Denied: Invalid Key');
            passwordInput.value = '';
        }
    });

    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        sessionStorage.removeItem('lebois_admin_auth');
        window.location.reload();
    });

    // --- Tab Navigation ---
    const menuItems = document.querySelectorAll('.sidebar-menu li[data-tab]');
    const inboxView = document.querySelector('.content-wrapper:not(#settings-view)'); // The first one
    const settingsView = document.getElementById('settings-view');
    const pageTitle = document.querySelector('.top-bar h2');

    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // UI Toggle
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            const tab = item.getAttribute('data-tab');
            if (tab === 'settings') {
                inboxView.style.display = 'none';
                settingsView.style.display = 'block';
                pageTitle.textContent = 'Site Configuration';
            } else {
                inboxView.style.display = 'block';
                settingsView.style.display = 'none';
                pageTitle.textContent = 'Project Requests';
                loadSubmissions(); // Refresh data
            }
        });
    });

    // --- Settings Logic ---
    const settingsForm = document.getElementById('settings-form');

    function loadSettings() {
        const config = JSON.parse(localStorage.getItem('lebois_config') || '{}');
        
        // Defaults if empty
        document.getElementById('conf-title').value = config.title || 'Le Bois Technology | Enterprise Software Solutions';
        document.getElementById('conf-hero-title').value = config.heroTitle || 'Engineered for Performance.Built to Scale.';
        document.getElementById('conf-hero-desc').value = config.heroDesc || 'We architect robust digital ecosystems. From high-frequency scripts to complex enterprise cloud platforms, Le Bois Technology delivers code that means business.';
        
        document.getElementById('conf-email').value = config.email || 'doukan.krdas@gmail.com';
        document.getElementById('conf-phone').value = config.phone || '+90 545 761 54 94';
        document.getElementById('conf-address').value = config.address || 'Surrey, BC V3S 9H8, Kanada';
        
        document.getElementById('conf-linkedin').value = config.linkedin || 'https://www.linkedin.com/company/le-bois-technology';
        document.getElementById('conf-github').value = config.github || '#';
        document.getElementById('conf-ga').value = config.ga || 'G-4YBMPJ0GNC';

        document.getElementById('conf-vanta').checked = config.vanta === true; // Default FALSE now
    }

    settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const config = {
            title: document.getElementById('conf-title').value,
            heroTitle: document.getElementById('conf-hero-title').value,
            heroDesc: document.getElementById('conf-hero-desc').value,
            email: document.getElementById('conf-email').value,
            phone: document.getElementById('conf-phone').value,
            address: document.getElementById('conf-address').value,
            linkedin: document.getElementById('conf-linkedin').value,
            github: document.getElementById('conf-github').value,
            ga: document.getElementById('conf-ga').value,
            vanta: document.getElementById('conf-vanta').checked
        };

        localStorage.setItem('lebois_config', JSON.stringify(config));
        alert('Configuration saved! Refresh the main website to see changes.');
    });


    // --- Data Management (Inbox) ---
    function loadSubmissions() {
        const tableBody = document.getElementById('submissions-table-body');
        const emptyState = document.getElementById('empty-state');
        const totalCount = document.getElementById('total-count');
        const todayCount = document.getElementById('today-count');
        
        let submissions = JSON.parse(localStorage.getItem('lebois_submissions') || '[]');
        
        // Stats
        if(totalCount) totalCount.textContent = submissions.length;
        if(todayCount) {
            const today = new Date().toLocaleDateString();
            const todaySubmissions = submissions.filter(sub => {
                const subDate = new Date(sub.id).toLocaleDateString();
                return subDate === today;
            });
            todayCount.textContent = todaySubmissions.length;
        }

        if (!tableBody) return; // Guard for settings view
        
        tableBody.innerHTML = '';
        
        if (submissions.length === 0) {
            emptyState.style.display = 'block';
            return;
        } else {
            emptyState.style.display = 'none';
        }

        submissions.sort((a, b) => b.id - a.id);

        submissions.forEach(sub => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="white-space: nowrap; color: #64748b; font-size: 0.9rem;">
                    ${sub.date}
                </td>
                <td>
                    <div style="font-weight: 600; color: #002222;">${escapeHtml(sub.name)}</div>
                    <div style="font-size: 0.85rem; color: #64748b;">${escapeHtml(sub.email)}</div>
                </td>
                <td>
                    <span style="background: #e2e8f0; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: 600;">
                        ${escapeHtml(sub.service)}
                    </span>
                </td>
                <td>
                    <div style="max-width: 300px; font-size: 0.9rem; color: #334155;">
                        ${escapeHtml(sub.message)}
                    </div>
                </td>
                <td>
                    <button class="action-btn" onclick="deleteSubmission(${sub.id})" title="Delete">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    }

    function escapeHtml(text) {
        if (!text) return '';
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    window.deleteSubmission = function(id) {
        if (confirm('Are you sure you want to delete this record?')) {
            let submissions = JSON.parse(localStorage.getItem('lebois_submissions') || '[]');
            submissions = submissions.filter(sub => sub.id !== id);
            localStorage.setItem('lebois_submissions', JSON.stringify(submissions));
            loadSubmissions();
        }
    };
});
