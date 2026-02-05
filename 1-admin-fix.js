<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Access | Xavier OS</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Rajdhani:wght@300;500;700&display=swap" rel="stylesheet">
    <style>
        body { 
            background: #020204; 
            color: #e0e0e0; 
            font-family: 'Rajdhani', sans-serif;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .quantum-panel { 
            background: rgba(10, 14, 39, 0.9); 
            border: 1px solid rgba(255, 0, 64, 0.3); 
            backdrop-filter: blur(20px);
        }
        .font-orbitron { font-family: 'Orbitron', sans-serif; }
        .keypad-btn {
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            transition: all 0.2s;
        }
        .keypad-btn:active {
            background: rgba(0, 240, 255, 0.2);
            transform: scale(0.95);
        }
        .code-display {
            letter-spacing: 0.5em;
            font-family: 'Orbitron', monospace;
        }
        .hidden-access {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 50px;
            opacity: 0;
            z-index: 9999;
        }
    </style>
</head>
<body>

    <div class="quantum-panel rounded-2xl p-8 max-w-md w-full mx-4">
        <div class="text-center mb-8">
            <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center text-2xl">
                🔐
            </div>
            <h1 class="font-orbitron text-2xl font-bold text-red-400 mb-2">ADMIN ACCESS</h1>
            <p class="text-gray-500 text-sm">Enter architect sequence</p>
        </div>

        <!-- Code Display -->
        <div class="bg-black/50 rounded-lg p-4 mb-6 text-center">
            <div id="code-display" class="code-display text-xl text-cyan-400 h-8">••••••••••••</div>
        </div>

        <!-- Keypad -->
        <div class="grid grid-cols-3 gap-3 mb-6">
            <button onclick="enterDigit('a')" class="keypad-btn rounded-lg p-4 text-lg font-bold">a</button>
            <button onclick="enterDigit('r')" class="keypad-btn rounded-lg p-4 text-lg font-bold">r</button>
            <button onclick="enterDigit('c')" class="keypad-btn rounded-lg p-4 text-lg font-bold">c</button>
            <button onclick="enterDigit('h')" class="keypad-btn rounded-lg p-4 text-lg font-bold">h</button>
            <button onclick="enterDigit('i')" class="keypad-btn rounded-lg p-4 text-lg font-bold">i</button>
            <button onclick="enterDigit('t')" class="keypad-btn rounded-lg p-4 text-lg font-bold">t</button>
            <button onclick="enterDigit('e')" class="keypad-btn rounded-lg p-4 text-lg font-bold">e</button>
            <button onclick="enterDigit('x')" class="keypad-btn rounded-lg p-4 text-lg font-bold">x</button>
            <button onclick="enterDigit('_')" class="keypad-btn rounded-lg p-4 text-lg font-bold">_</button>
            <button onclick="enterDigit('2')" class="keypad-btn rounded-lg p-4 text-lg font-bold">2</button>
            <button onclick="enterDigit('0')" class="keypad-btn rounded-lg p-4 text-lg font-bold">0</button>
            <button onclick="enterDigit('5')" class="keypad-btn rounded-lg p-4 text-lg font-bold">5</button>
        </div>

        <!-- Actions -->
        <div class="flex gap-3">
            <button onclick="clearCode()" class="flex-1 bg-gray-800 hover:bg-gray-700 py-3 rounded-lg font-bold text-sm transition">
                Clear
            </button>
            <button onclick="checkCode()" class="flex-1 bg-red-600 hover:bg-red-500 py-3 rounded-lg font-bold text-sm transition">
                Unlock
            </button>
        </div>

        <!-- Status -->
        <div id="status" class="mt-4 text-center text-sm h-6"></div>

        <!-- Direct Input Fallback -->
        <div class="mt-6 pt-6 border-t border-gray-800">
            <p class="text-xs text-gray-600 mb-2 text-center">Or type directly:</p>
            <input type="text" id="direct-input" 
                   class="w-full bg-black/50 border border-red-500/30 rounded-lg p-3 text-white text-center mb-2"
                   placeholder="architect_x_2025"
                   onkeyup="if(event.key==='Enter')checkDirectCode()">
            <button onclick="checkDirectCode()" class="w-full bg-red-600/30 border border-red-500/50 text-red-400 py-2 rounded text-sm">
                Submit
            </button>
        </div>

        <!-- Back -->
        <button onclick="window.location.href='index.html'" class="w-full mt-4 text-gray-500 text-sm hover:text-white transition">
            ← Return to Hub
        </button>
    </div>

    <!-- Hidden tap zone for emergency unlock -->
    <div class="hidden-access" onclick="emergencyTap()" id="emergency-zone"></div>

    <script src="admin-fix.js"></script>
    <script>
        let enteredCode = '';
        const correctCode = 'architect_x_2025';
        let tapCount = 0;

        function enterDigit(digit) {
            if (enteredCode.length < 20) {
                enteredCode += digit;
                updateDisplay();
            }
        }

        function updateDisplay() {
            const display = document.getElementById('code-display');
            if (enteredCode.length === 0) {
                display.textContent = '••••••••••••';
                display.className = 'code-display text-xl text-gray-600 h-8';
            } else {
                display.textContent = enteredCode;
                display.className = 'code-display text-xl text-cyan-400 h-8';
            }
        }

        function clearCode() {
            enteredCode = '';
            updateDisplay();
            document.getElementById('status').textContent = '';
        }

        function checkCode() {
            const result = XavierUnlock.unlock(enteredCode);

            if (result.success) {
                document.getElementById('status').innerHTML = '<span class="text-green-400">✓ ' + result.message + '</span>';
                setTimeout(() => {
                    window.location.href = 'admin.html';
                }, 1500);
            } else {
                document.getElementById('status').innerHTML = '<span class="text-red-400">✗ ' + result.message + '</span>';
                enteredCode = '';
                setTimeout(updateDisplay, 500);
            }
        }

        function checkDirectCode() {
            const input = document.getElementById('direct-input').value.trim();
            enteredCode = input;
            checkCode();
        }

        function emergencyTap() {
            tapCount++;
            console.log('Emergency tap:', tapCount);
            if (tapCount >= 7) {
                if (confirm('Emergency unlock?')) {
                    XavierUnlock.forceUnlock();
                    alert('Admin unlocked via emergency protocol');
                    window.location.href = 'admin.html';
                }
                tapCount = 0;
            }
            setTimeout(() => tapCount = 0, 2000);
        }

        // Check if already unlocked
        if (XavierUnlock.isAdmin()) {
            document.getElementById('status').innerHTML = '<span class="text-green-400">✓ Already unlocked. Redirecting...</span>';
            setTimeout(() => window.location.href = 'admin.html', 1000);
        }
    </script>
</body>
</html>