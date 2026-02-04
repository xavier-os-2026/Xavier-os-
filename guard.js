

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        SESSION_KEY: 'xavier_quantum_session',
        ADMIN_KEY: 'xavier_admin_session',
        ACCESS_CODE_HASH: 'YXJjaGl0ZWN0X3hfMjAyNQ==', // architect_x_2025 base64
        REDIRECT_DELAY: 0, // No auto-redirect - user must manually navigate
        PROTECTED_ROUTES: ['admin.html', 'holoworld.html', 'dropship.html', 'marketing.html'],
        PUBLIC_ROUTES: ['index.html', 'pricing.html', 'settings.html']
    };

    // Quantum Encryption Helper
    const QuantumCrypt = {
        encode: (str) => btoa(str),
        decode: (str) => atob(str),
        hash: (str) => {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                const char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash;
            }
            return hash.toString(16);
        }
    };

    // Session Manager
    const SessionManager = {
        isAuthenticated: () => {
            return localStorage.getItem(CONFIG.SESSION_KEY) === 'authenticated' ||
                   localStorage.getItem(CONFIG.ADMIN_KEY) === 'true';
        },

        isAdmin: () => {
            return localStorage.getItem(CONFIG.ADMIN_KEY) === 'true';
        },

        validateAccess: (requiredLevel = 'user') => {
            if (requiredLevel === 'admin' && !SessionManager.isAdmin()) {
                return false;
            }
            return SessionManager.isAuthenticated();
        },

        // Check if user has Pro/Unlimited access
        hasProAccess: () => {
            const tier = localStorage.getItem('xavier_access_tier');
            return tier === 'pro' || tier === 'unlimited' || tier === 'architect' || 
                   localStorage.getItem(CONFIG.ADMIN_KEY) === 'true';
        }
    };

    // Route Guard - Blocks access to protected pages but NO AUTO-REDIRECT to HoloWorld
    const RouteGuard = {
        currentPage: () => {
            const path = window.location.pathname;
            return path.substring(path.lastIndexOf('/') + 1) || 'index.html';
        },

        protect: () => {
            const current = RouteGuard.currentPage();
            const isProtected = CONFIG.PROTECTED_ROUTES.some(route => current.includes(route));

            if (isProtected && !SessionManager.isAuthenticated()) {
                // Show locked overlay instead of redirecting away
                RouteGuard.showLockScreen();
                return false;
            }

            // Special check for HoloWorld - requires Pro access
            if (current.includes('holoworld') && !SessionManager.hasProAccess()) {
                RouteGuard.showUpgradeScreen();
                return false;
            }

            return true;
        },

        showLockScreen: () => {
            const overlay = document.createElement('div');
            overlay.id = 'quantum-lock';
            overlay.innerHTML = `
                <div style="position: fixed; inset: 0; background: rgba(2,2,4,0.95); z-index: 9999; 
                           display: flex; flex-direction: column; align-items: center; justify-content: center; 
                           font-family: 'Orbitron', sans-serif;">
                    <div style="width: 64px; height: 64px; border: 3px solid rgba(0,240,255,0.3); 
                               border-top: 3px solid #00f0ff; border-radius: 50%; 
                               animation: spin 1s linear infinite; margin-bottom: 24px;"></div>
                    <h2 style="color: #00f0ff; font-size: 24px; margin-bottom: 16px;">QUANTUM LOCK</h2>
                    <p style="color: #666; margin-bottom: 24px;">Authentication Required</p>
                    <button onclick="window.location.href='index.html'" 
                            style="padding: 12px 32px; background: transparent; border: 1px solid #00f0ff; 
                                   color: #00f0ff; cursor: pointer; font-family: 'Rajdhani', sans-serif;
                                   font-weight: bold; transition: all 0.3s;"
                            onmouseover="this.style.background='#00f0ff'; this.style.color='#020204';"
                            onmouseout="this.style.background='transparent'; this.style.color='#00f0ff';">
                        RETURN TO HUB
                    </button>
                    <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
                </div>
            `;
            document.body.appendChild(overlay);
            document.body.style.overflow = 'hidden';
        },

        showUpgradeScreen: () => {
            const overlay = document.createElement('div');
            overlay.innerHTML = `
                <div style="position: fixed; inset: 0; background: rgba(2,2,4,0.95); z-index: 9999; 
                           display: flex; flex-direction: column; align-items: center; justify-content: center;">
                    <h2 style="color: #b026ff; font-size: 28px; font-family: 'Orbitron', sans-serif; margin-bottom: 16px;">
                        HOLOVERSE ACCESS
                    </h2>
                    <p style="color: #888; margin-bottom: 24px; font-family: 'Rajdhani', sans-serif;">
                        Pro tier or higher required for HoloWorld entry
                    </p>
                    <div style="display: flex; gap: 16px;">
                        <button onclick="window.location.href='pricing.html'" 
                                style="padding: 12px 24px; background: #b026ff; border: none; color: white; 
                                       cursor: pointer; font-weight: bold;">
                            UPGRADE ACCESS
                        </button>
                        <button onclick="window.location.href='index.html'" 
                                style="padding: 12px 24px; background: transparent; border: 1px solid #666; 
                                       color: #666; cursor: pointer;">
                            BACK TO HUB
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(overlay);
        }
    };

    // Hidden Access Protocol (Architect Code)
    const HiddenAccess = {
        init: () => {
            let sequence = [];
            const code = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // Konami code variant

            document.addEventListener('keydown', (e) => {
                sequence.push(e.keyCode);
                if (sequence.length > code.length) sequence.shift();

                if (JSON.stringify(sequence) === JSON.stringify(code)) {
                    HiddenAccess.activateArchitectMode();
                }
            });

            // Mobile: Triple tap logo
            let tapCount = 0;
            const logo = document.querySelector('[onclick*="index.html"]');
            if (logo) {
                logo.addEventListener('click', (e) => {
                    tapCount++;
                    if (tapCount === 3) {
                        e.preventDefault();
                        HiddenAccess.promptArchitectCode();
                    }
                    setTimeout(() => tapCount = 0, 1000);
                });
            }
        },

        promptArchitectCode: () => {
            const input = prompt('🔐 Enter Architect Sequence:');
            if (input && btoa(input) === CONFIG.ACCESS_CODE_HASH) {
                HiddenAccess.activateArchitectMode();
            }
        },

        activateArchitectMode: () => {
            localStorage.setItem(CONFIG.ADMIN_KEY, 'true');
            localStorage.setItem('xavier_access_tier', 'architect');
            alert('🔓 ARCHITECT MODE ACTIVATED\nUnlimited access granted.');
            window.location.reload();
        }
    };

    // Initialize on load
    document.addEventListener('DOMContentLoaded', () => {
        RouteGuard.protect();
        HiddenAccess.init();

        // Expose global auth check (but NO auto-redirect to HoloWorld)
        window.XavierAuth = {
            check: SessionManager.validateAccess,
            isPro: SessionManager.hasProAccess,
            logout: () => {
                localStorage.removeItem(CONFIG.SESSION_KEY);
                localStorage.removeItem(CONFIG.ADMIN_KEY);
                window.location.href = 'index.html';
            }
        };
    });

})();