(function() {
    'use strict';
    
    const CONFIG = {
        ADMIN_KEY: 'xavier_admin_session',
        ACCESS_TIER: 'xavier_access_tier',
        CODE: 'architect_x_2025'
    };
    
    window.XavierUnlock = {
        isAdmin: function() {
            return localStorage.getItem(CONFIG.ADMIN_KEY) === 'true';
        },
        
        getTier: function() {
            if (this.isAdmin()) return 'architect';
            return localStorage.getItem(CONFIG.ACCESS_TIER) || 'free';
        },
        
        unlock: function(code) {
            if (code === CONFIG.CODE) {
                localStorage.setItem(CONFIG.ADMIN_KEY, 'true');
                localStorage.setItem(CONFIG.ACCESS_TIER, 'architect');
                return { success: true };
            }
            return { success: false };
        },
        
        forceUnlock: function() {
            localStorage.setItem(CONFIG.ADMIN_KEY, 'true');
            localStorage.setItem(CONFIG.ACCESS_TIER, 'architect');
            return true;
        },
        
        logout: function() {
            localStorage.removeItem(CONFIG.ADMIN_KEY);
            localStorage.removeItem(CONFIG.ACCESS_TIER);
            window.location.href = 'index.html';
        },
        
        hasAccess: function(feature) {
            const tier = this.getTier();
            if (tier === 'architect') return true;
            if (tier === 'pro' && feature === 'holoworld') return true;
            return false;
        }
    };
    
    console.log('System ready');
})();
