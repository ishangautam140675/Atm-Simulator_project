// Enhanced Professional Banking - Advanced JavaScript

class BankingApp {
    constructor() {
        this.currentUser = null;
        this.isLoggedIn = false;
        this.pinAttempts = 0;
        this.maxPinAttempts = 3;
        this.transactionHistory = [];
        this.currentTransactionData = null;
        this.lastCompletedTransaction = null;
        this.feedbackCountdownInterval = null;
        
        // ATM Configuration
        this.atmData = {
            location: 'Jaipur, Rajasthan',
            inventory: {
                100: 500,
                200: 300, 
                500: 200
            },
            dailyLimit: 20000,
            transactionLimit: 10000,
            isOnline: true
        };

        // Demo users
        this.demoUsers = {
            'premium': {
                username: 'john_doe',
                password: 'demo123',
                pin: '1234',
                fullName: 'John Doe',
                email: 'john.doe@email.com',
                phone: '+91-9876543210',
                accountNumber: '1234567890',
                balance: 25000,
                dailyWithdrawn: 0,
                accountType: 'Premium'
            },
            'savings': {
                username: 'jane_smith',
                password: 'demo456',
                pin: '1234',
                fullName: 'Jane Smith',
                email: 'jane.smith@email.com',
                phone: '+91-8765432109',
                accountNumber: '0987654321',
                balance: 15000,
                dailyWithdrawn: 0,
                accountType: 'Savings'
            }
        };

        this.initializeApp();
    }

    initializeApp() {
        this.setupEventListeners();
        this.updateDateTime();
        this.createBackgroundParticles();
        
        // Update time every second
        setInterval(() => this.updateDateTime(), 1000);
        
        console.log('Enhanced Banking App initialized successfully');
    }

    setupEventListeners() {
        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => this.closeModal(e.target.closest('.modal')));
        });

        // Custom withdrawal notes calculation
        document.querySelectorAll('.note-selector input').forEach(input => {
            input.addEventListener('input', () => this.calculateCustomWithdrawal());
        });

        // Radio option handlers (for custom notes panel)
        document.querySelectorAll('.radio-option').forEach(option => {
            option.addEventListener('click', (e) => this.handleRadioSelection(e.currentTarget));
        });

        // Password strength checker
        document.getElementById('regPassword')?.addEventListener('input', (e) => this.checkPasswordStrength(e.target.value));
        
        // PIN input restrictions
        document.getElementById('regPin')?.addEventListener('input', (e) => this.restrictPinInput(e.target));
        document.getElementById('loginPin')?.addEventListener('input', (e) => this.restrictPinInput(e.target));
        document.getElementById('verificationPin')?.addEventListener('input', (e) => this.restrictPinInput(e.target));
    }

    updateDateTime() {
        const now = new Date();
        const dateOptions = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        const timeOptions = { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit',
            hour12: true 
        };

        const dateStr = now.toLocaleDateString('en-IN', dateOptions);
        const timeStr = now.toLocaleTimeString('en-IN', timeOptions);

        document.getElementById('currentDate').textContent = dateStr;
        document.getElementById('currentTime').textContent = timeStr;
    }

    createBackgroundParticles() {
        const particleContainer = document.querySelector('.bg-particles');
        if (!particleContainer) return;

        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particleContainer.appendChild(particle);
        }
    }

    showScreen(screenId) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Show target screen
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
        }
    }

    showDemoModal() {
        const modal = document.getElementById('demoModal');
        if (modal) {
            modal.classList.add('active');
        }
    }

    closeModal(modal) {
        if (modal) {
            modal.classList.remove('active');
        }
    }

    handleRadioSelection(option) {
        // Remove selection from siblings
        const parent = option.parentElement;
        parent.querySelectorAll('.radio-option').forEach(opt => {
            const radio = opt.querySelector('input[type="radio"]');
            if (radio) radio.checked = false;
        });

        // Select current option
        const radio = option.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;

        // Show/hide custom notes panel for withdrawal
        const customPanel = document.getElementById('customNotesPanel');
        if (customPanel && radio.value === 'custom') {
            customPanel.style.display = 'block';
        } else if (customPanel) {
            customPanel.style.display = 'none';
        }
    }

    restrictPinInput(input) {
        // Only allow 4 digits
        input.value = input.value.replace(/\D/g, '').substr(0, 4);
    }

    checkPasswordStrength(password) {
        const strengthBar = document.querySelector('.password-strength');
        if (!strengthBar) return;

        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        strengthBar.className = 'password-strength';
        if (strength < 2) {
            strengthBar.classList.add('password-weak');
        } else if (strength < 4) {
            strengthBar.classList.add('password-medium');
        } else {
            strengthBar.classList.add('password-strong');
        }
    }

    async handleRegistration(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const userData = Object.fromEntries(formData.entries());

        // Basic validation
        if (userData.pin !== userData.confirmPin) {
            this.showNotification('PIN values do not match!', 'error');
            return;
        }
        if (!userData.password || userData.password.length < 8) {
            this.showNotification('Password must be at least 8 characters', 'error');
            return;
        }
        if (!/^[0-9]{4}$/.test(userData.pin)) {
            this.showNotification('PIN must be exactly 4 digits!', 'error');
            return;
        }

        // Simulate registration process
        this.showLoadingOverlay('Creating your account...', [
            { icon: 'fas fa-user-plus', text: 'Validating Details' },
            { icon: 'fas fa-shield-alt', text: 'Security Setup' },
            { icon: 'fas fa-check', text: 'Account Created' }
        ]);

        const passwordHash = await this.hashString(userData.password);
        const pinHash = await this.hashString(userData.pin);

        setTimeout(() => {
            this.hideLoadingOverlay();
            // Store user data (in real app, send to server)
            const newUser = {
                username: userData.username,
                fullName: userData.fullName,
                phone: userData.phone,
                location: userData.location,
                accountNumber: this.generateAccountNumber(),
                balance: 0,
                dailyWithdrawn: 0,
                accountType: 'Savings',
                passwordHash,
                pinHash
            };

            localStorage.setItem('bankingUser_' + userData.username, JSON.stringify(newUser));
            
            this.showFeedbackModal('success', 'Account Created Successfully!', 
                `Welcome ${userData.fullName}! Your account number is ${newUser.accountNumber}. You can now login to access your account.`);
            
            // Clear form and show login
            e.target.reset();
            setTimeout(() => {
                this.closeFeedbackModal();
                this.showScreen('loginScreen');
            }, 2000);
        }, 1000);
    }

    async handleLogin(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const loginData = Object.fromEntries(formData.entries());

        this.showLoadingOverlay('Signing you in...', [
            { icon: 'fas fa-key', text: 'Verifying Credentials' },
            { icon: 'fas fa-shield-alt', text: 'Security Check' },
            { icon: 'fas fa-check', text: 'Login Successful' }
        ]);

        const storedUserStr = localStorage.getItem('bankingUser_' + loginData.username);
        const storedUser = storedUserStr ? JSON.parse(storedUserStr) : null;

        const passwordHash = await this.hashString(loginData.password);
        const pinHash = await this.hashString(loginData.pin);

        setTimeout(() => {
            this.hideLoadingOverlay();
            if (storedUser) {
                const passOk = storedUser.passwordHash ? storedUser.passwordHash === passwordHash : storedUser.password === loginData.password;
                const pinOk = storedUser.pinHash ? storedUser.pinHash === pinHash : storedUser.pin === loginData.pin;
                if (passOk && pinOk) {
                    this.loginUser(storedUser);
                    return;
                }
            }
            this.showNotification('Invalid credentials. Please check your username, password, and PIN.', 'error');
        }, 800);
    }

    handleDemoLogin(type) {
        const demoUser = this.demoUsers[type];
        if (demoUser) {
            this.showLoadingOverlay('Loading Demo Account...', [
                { icon: 'fas fa-user', text: 'Loading Profile' },
                { icon: 'fas fa-database', text: 'Fetching Data' },
                { icon: 'fas fa-check', text: 'Ready!' }
            ]);

            setTimeout(() => {
                this.hideLoadingOverlay();
                this.closeModal(document.getElementById('demoModal'));
                this.loginUser(demoUser);
            }, 1500);
        }
    }

    loginUser(user) {
        this.currentUser = user;
        this.isLoggedIn = true;
        this.pinAttempts = 0;
        
        // Reset daily withdrawn if new day
        const lastLogin = localStorage.getItem('lastLogin_' + user.username);
        const today = new Date().toDateString();
        
        if (lastLogin !== today) {
            user.dailyWithdrawn = 0;
            localStorage.setItem('lastLogin_' + user.username, today);
        }

        // Load transaction history for this user
        this.loadTransactionHistory();
        this.updateUserInterface();
        this.showDashboard();
        this.showNotification(`Welcome back, ${user.fullName || user.username}!`, 'success');
    }

    updateUserInterface() {
        if (!this.currentUser) return;

        // Update user panel
        const nameEl = document.getElementById('userName');
        if (nameEl) nameEl.textContent = this.currentUser.fullName || this.currentUser.username;
        const detailsEl = document.getElementById('userDetails');
        if (detailsEl) {
            const acc = this.currentUser.accountNumber || '';
            const masked = acc ? `****${acc.slice(-4)}` : '****0000';
            detailsEl.textContent = `Account: ${masked}`;
        }
        const locTop = document.getElementById('userLocation');
        if (locTop) locTop.textContent = this.currentUser.location || this.atmData.location;
        const locDash = document.getElementById('dashboardLocation');
        if (locDash) locDash.textContent = this.currentUser.location || this.atmData.location;

        // Update balance information
        const balEl = document.getElementById('mainBalance');
        if (balEl) balEl.textContent = `₹${(this.currentUser.balance || 0).toLocaleString('en-IN')}`;
        const usedEl = document.getElementById('dailyUsed');
        if (usedEl) usedEl.textContent = `₹${(this.currentUser.dailyWithdrawn || 0).toLocaleString('en-IN')}`;
        const remainEl = document.getElementById('dailyRemaining');
        if (remainEl) remainEl.textContent = `₹${(this.atmData.dailyLimit - (this.currentUser.dailyWithdrawn || 0)).toLocaleString('en-IN')}`;

        // Update ATM inventory
        this.updateATMInventory();

        // Update recent transactions preview
        this.updateRecentTransactionsPreview();
    }

    updateATMInventory() {
        const inventory = this.atmData.inventory;
        document.getElementById('notes100').textContent = inventory[100];
        document.getElementById('notes200').textContent = inventory[200];
        document.getElementById('notes500').textContent = inventory[500];
    }

    showDashboard() {
        this.showScreen('dashboardScreen');
    }

    logout() {
        this.currentUser = null;
        this.isLoggedIn = false;
        this.pinAttempts = 0;
        this.showScreen('welcomeScreen');
        this.showNotification('Logged out successfully!', 'info');
    }

    // Transaction Methods
    handleWithdrawal(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const noteSelection = formData.get('noteSelection') || 'auto';

        let amount = parseInt(formData.get('withdrawAmount')) || 0;
        let notesBreakdown = { 100: 0, 200: 0, 500: 0 };

        if (noteSelection === 'custom') {
            const notes100 = parseInt(document.getElementById('custom100')?.value) || 0;
            const notes200 = parseInt(document.getElementById('custom200')?.value) || 0;
            const notes500 = parseInt(document.getElementById('custom500')?.value) || 0;
            amount = (notes100 * 100) + (notes200 * 200) + (notes500 * 500);
            notesBreakdown = { 100: notes100, 200: notes200, 500: notes500 };
        } else {
            // Auto selection: compute optimal notes breakdown
            try {
                notesBreakdown = this.calculateNotesBreakdown(amount);
            } catch (err) {
                this.showNotification(err.message, 'error');
                return;
            }
        }

        if (amount <= 0 || amount % 100 !== 0) {
            this.showNotification('Please enter a valid amount in multiples of ₹100!', 'error');
            return;
        }

        this.currentTransactionData = {
            type: 'withdrawal',
            amount,
            notesBreakdown,
            fee: amount > 2000 ? 10 : 0
        };

        this.showPinVerification();
    }

    handleDeposit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const amount = parseInt(formData.get('depositAmount'));

        if (!amount || amount <= 0) {
            this.showNotification('Please enter a valid deposit amount!', 'error');
            return;
        }

        this.currentTransactionData = {
            type: 'deposit',
            amount: amount,
            fee: 0
        };

        this.showPinVerification();
    }

    handleTransfer(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const transferData = Object.fromEntries(formData.entries());
        const amount = parseInt(transferData.transferAmount);

        if (!amount || amount <= 0) {
            this.showNotification('Please enter a valid transfer amount!', 'error');
            return;
        }

        if (!transferData.recipientAccount) {
            this.showNotification('Please enter recipient account number!', 'error');
            return;
        }

        this.currentTransactionData = {
            type: 'transfer',
            amount: amount,
            recipientAccount: transferData.recipientAccount,
            recipientName: transferData.recipientName || 'Unknown',
            fee: amount > 5000 ? 25 : 10
        };

        this.showPinVerification();
    }

    calculateNotesBreakdown(amount) {
        const breakdown = { 100: 0, 200: 0, 500: 0 };
        let remaining = amount;

        // Prioritize higher denominations
        breakdown[500] = Math.min(Math.floor(remaining / 500), this.atmData.inventory[500]);
        remaining -= breakdown[500] * 500;

        breakdown[200] = Math.min(Math.floor(remaining / 200), this.atmData.inventory[200]);
        remaining -= breakdown[200] * 200;

        breakdown[100] = Math.min(Math.floor(remaining / 100), this.atmData.inventory[100]);
        remaining -= breakdown[100] * 100;

        if (remaining > 0) {
            throw new Error('Unable to dispense exact amount with available denominations');
        }

        return breakdown;
    }

    calculateCustomWithdrawal() {
        const notes100 = parseInt(document.getElementById('custom100')?.value) || 0;
        const notes200 = parseInt(document.getElementById('custom200')?.value) || 0;
        const notes500 = parseInt(document.getElementById('custom500')?.value) || 0;
        
        const total = (notes100 * 100) + (notes200 * 200) + (notes500 * 500);
        const display = document.getElementById('customCalculation');
        
        if (display) {
            display.textContent = `Selected: ₹500×${notes500}, ₹200×${notes200}, ₹100×${notes100} | Total: ₹${total.toLocaleString('en-IN')}`;
        }
    }

    showPinVerification() {
        const modal = document.getElementById('pinVerificationModal');
        const transactionData = this.currentTransactionData;
        if (!modal || !transactionData) return;

        // Update PIN modal content
        const summaryElement = document.getElementById('transactionSummary');
        if (summaryElement) {
            let summaryText = '';
            if (transactionData.type === 'balance_check') {
                summaryText = 'Authorize Balance Inquiry';
            } else if (transactionData.type === 'history_access') {
                summaryText = 'Authorize Viewing Transaction History';
            } else {
                summaryText = `${transactionData.type.toUpperCase()}: ₹${transactionData.amount.toLocaleString('en-IN')}`;
                if (transactionData.fee > 0) {
                    summaryText += ` + ₹${transactionData.fee} fee`;
                }
                if (transactionData.recipientAccount) {
                    summaryText += `\nTo: ${transactionData.recipientAccount}`;
                }
            }
            summaryElement.textContent = summaryText;
        }

        // Clear previous PIN input and attempts display
        const pinInput = document.getElementById('verificationPin');
        if (pinInput) pinInput.value = '';
        const attemptsElement = document.getElementById('pinAttempts');
        if (attemptsElement) {
            attemptsElement.textContent = '';
            attemptsElement.classList.remove('active');
        }

        modal.classList.add('active');
    }

    closePinModal() {
        const modal = document.getElementById('pinVerificationModal');
        if (modal) modal.classList.remove('active');
    }

    cancelCurrentTransaction() {
        this.currentTransactionData = null;
        this.closePinModal();
    }

    verifyPin(e) {
        if (e && e.preventDefault) e.preventDefault();
        const pinInput = document.getElementById('verificationPin');
        const enteredPin = pinInput?.value || '';

        if (!enteredPin || enteredPin.length !== 4) {
            this.showNotification('Please enter your 4-digit PIN', 'warning');
            return;
        }

        const storedPin = this.currentUser?.pin || null; // plaintext for demo users
        const storedPinHash = this.currentUser?.pinHash || null;

        const proceed = async () => {
            let match = false;
            if (storedPinHash) {
                const hash = await this.hashString(enteredPin);
                match = hash === storedPinHash;
            } else if (storedPin) {
                match = enteredPin === storedPin;
            }

            if (!match) {
                this.pinAttempts++;
                const attemptsElement = document.getElementById('pinAttempts');
                if (this.pinAttempts >= this.maxPinAttempts) {
                    this.closePinModal();
                    this.showFeedbackModal('error', 'Account Temporarily Locked', 
                        'Too many incorrect PIN attempts. Please try again later or contact customer support.');
                    setTimeout(() => {
                        this.logout();
                        this.closeFeedbackModal();
                    }, 3000);
                    return;
                }
                if (attemptsElement) {
                    attemptsElement.textContent = `Incorrect PIN. ${this.maxPinAttempts - this.pinAttempts} attempts remaining.`;
                    attemptsElement.classList.add('active');
                }
                if (pinInput) pinInput.value = '';
                return;
            }

        // PIN verified, process action
        this.pinAttempts = 0;
        this.closePinModal();
        this.processTransaction();
        };

        proceed();
    }

    processTransaction() {
        const transactionData = this.currentTransactionData;
        if (!transactionData) return;

        this.showLoadingOverlay('Processing your transaction...', [
            { icon: 'fas fa-credit-card', text: 'Validating Account' },
            { icon: 'fas fa-calculator', text: 'Processing Amount' },
            { icon: 'fas fa-check-circle', text: 'Transaction Complete' }
        ]);

        // Simulate processing delay
        setTimeout(() => {
            try {
                this.executeTransaction(transactionData);
                this.hideLoadingOverlay();

                // Post-processing based on type
                if (transactionData.type === 'balance_check') {
                    const msg = `Your balance is ₹${(this.currentUser.balance || 0).toLocaleString('en-IN')}`;
                    this.showFeedbackModal('success', 'Current Balance', msg);
                } else if (transactionData.type === 'history_access') {
                    this.showTransactionHistory();
                } else {
                    this.showTransactionSuccess(transactionData);
                }
            } catch (error) {
                this.hideLoadingOverlay();
                this.showFeedbackModal('error', 'Transaction Failed', error.message || 'Unknown error');
            }
        }, 1000);
    }

    executeTransaction(transactionData) {
        const totalAmount = (transactionData.amount || 0) + (transactionData.fee || 0);

        switch (transactionData.type) {
            case 'withdrawal':
                if (totalAmount > this.currentUser.balance) {
                    throw new Error('Insufficient balance for this withdrawal');
                }
                if (transactionData.amount > this.atmData.transactionLimit) {
                    throw new Error(`Transaction limit exceeded. Maximum ₹${this.atmData.transactionLimit.toLocaleString('en-IN')} per transaction`);
                }
                if ((this.currentUser.dailyWithdrawn + transactionData.amount) > this.atmData.dailyLimit) {
                    throw new Error('Daily withdrawal limit exceeded');
                }
                // Check note availability
                for (const [denom, count] of Object.entries(transactionData.notesBreakdown)) {
                    if (count > this.atmData.inventory[denom]) {
                        throw new Error(`Insufficient ₹${denom} notes in ATM`);
                    }
                }
                // Execute withdrawal
                this.currentUser.balance -= totalAmount;
                this.currentUser.dailyWithdrawn += transactionData.amount;
                for (const [denom, count] of Object.entries(transactionData.notesBreakdown)) {
                    this.atmData.inventory[denom] -= count;
                }
                break;

            case 'deposit':
                this.currentUser.balance += transactionData.amount;
                break;

            case 'transfer':
                if (totalAmount > this.currentUser.balance) {
                    throw new Error('Insufficient balance for this transfer');
                }
                if (transactionData.amount > this.atmData.transactionLimit) {
                    throw new Error(`Transfer limit exceeded. Maximum ₹${this.atmData.transactionLimit.toLocaleString('en-IN')} per transaction`);
                }
                this.currentUser.balance -= totalAmount;
                break;

            case 'balance_check':
            case 'history_access':
                // No balance changes. Only authorize access.
                break;

            default:
                break;
        }

        // Only record real monetary transactions
        if ([ 'withdrawal', 'deposit', 'transfer' ].includes(transactionData.type)) {
            const transaction = {
                id: Date.now().toString(),
                type: transactionData.type,
                amount: transactionData.amount,
                fee: transactionData.fee,
                date: new Date().toISOString(),
                status: 'completed',
                balanceAfter: this.currentUser.balance,
                location: this.currentUser.location || this.atmData.location,
                ...transactionData
            };
            this.transactionHistory.unshift(transaction);
            this.lastCompletedTransaction = transaction;
            this.saveTransactionHistory();
            // Send SMS notification (simulated)
            this.sendSMSNotification(transaction);
        }

        // Persist and refresh UI regardless
        this.updateUserData();
        this.updateUserInterface();
    }

    showTransactionSuccess(transactionData) {
        let message = `₹${transactionData.amount.toLocaleString('en-IN')} ${transactionData.type} completed successfully!`;
        
        if (transactionData.notesBreakdown) {
            message += '\n\nNotes dispensed:\n';
            for (const [denom, count] of Object.entries(transactionData.notesBreakdown)) {
                if (count > 0) {
                    message += `₹${denom} x ${count}\n`;
                }
            }
        }
        
        if (transactionData.fee > 0) {
            message += `\nTransaction fee: ₹${transactionData.fee}`;
        }

        message += `\nNew balance: ₹${this.currentUser.balance.toLocaleString('en-IN')}`;

        this.showFeedbackModal('success', 'Transaction Successful', message);
        
        // Keep the receipt modal visible longer after withdrawals
        const isWithdrawal = transactionData.type === 'withdrawal';
        const holdMs = isWithdrawal ? 60000 : 4000;

        // Start countdown for withdrawals
        if (isWithdrawal) {
            const countdownEl = document.getElementById('feedbackCountdown');
            let seconds = Math.floor(holdMs / 1000);
            if (countdownEl) countdownEl.textContent = `Returning to dashboard in ${seconds}s`;
            if (this.feedbackCountdownInterval) {
                clearInterval(this.feedbackCountdownInterval);
                this.feedbackCountdownInterval = null;
            }
            this.feedbackCountdownInterval = setInterval(() => {
                seconds--;
                if (seconds <= 0) {
                    clearInterval(this.feedbackCountdownInterval);
                    this.feedbackCountdownInterval = null;
                }
                if (countdownEl) countdownEl.textContent = `Returning to dashboard in ${Math.max(seconds,0)}s`;
            }, 1000);
        }

        setTimeout(() => {
            // Clear countdown on auto-close
            if (this.feedbackCountdownInterval) {
                clearInterval(this.feedbackCountdownInterval);
                this.feedbackCountdownInterval = null;
            }
            const countdownEl = document.getElementById('feedbackCountdown');
            if (countdownEl) countdownEl.textContent = '';
            this.closeFeedbackModal();
            this.showDashboard();
        }, holdMs);
    }

    buildReceiptHTML(tx) {
        const user = this.currentUser || {};
        const maskedAcc = user.accountNumber ? `****${user.accountNumber.slice(-4)}` : '****0000';
        const dateStr = new Date(tx.date || Date.now()).toLocaleString('en-IN');
        const lines = [];
        lines.push(`<h2 style="margin:0;">Enhanced Professional Banking</h2>`);
        lines.push(`<div style="margin:2px 0 10px 0;color:#7f8c8d;">Official Transaction Receipt</div>`);
        lines.push(`<hr>`);
        lines.push(`<div><strong>Name:</strong> ${user.fullName || user.username || 'User'}</div>`);
        lines.push(`<div><strong>Account:</strong> ${maskedAcc}</div>`);
        lines.push(`<div><strong>Location:</strong> ${tx.location || (user.location || this.atmData.location)}</div>`);
        lines.push(`<div><strong>Date/Time:</strong> ${dateStr}</div>`);
        lines.push(`<div><strong>Txn ID:</strong> ${tx.id || ''}</div>`);
        lines.push(`<hr>`);
        lines.push(`<div><strong>Type:</strong> ${tx.type.toUpperCase()}</div>`);
        lines.push(`<div><strong>Amount:</strong> ₹${(tx.amount||0).toLocaleString('en-IN')}</div>`);
        if (tx.fee && tx.fee > 0) lines.push(`<div><strong>Fee:</strong> ₹${tx.fee}</div>`);
        if (typeof tx.balanceAfter === 'number') lines.push(`<div><strong>Balance After:</strong> ₹${tx.balanceAfter.toLocaleString('en-IN')}</div>`);
        if (tx.recipientAccount) lines.push(`<div><strong>To:</strong> ${tx.recipientAccount} (${tx.recipientName || ''})</div>`);
        if (tx.notesBreakdown) {
            const notes = Object.entries(tx.notesBreakdown).filter(([,c]) => c>0).map(([d,c]) => `₹${d}×${c}`).join(', ');
            if (notes) lines.push(`<div><strong>Notes:</strong> ${notes}</div>`);
        }
        lines.push(`<hr>`);
        lines.push(`<div style="font-size:12px;color:#7f8c8d;">Thank you for banking with us.</div>`);
        return `<div style="font-family:Segoe UI,Tahoma,Arial,sans-serif; padding:20px;">${lines.join('')}</div>`;
    }

    printLastReceipt() {
        const tx = this.lastCompletedTransaction;
        if (!tx) {
            this.showNotification('No recent transaction to print.', 'warning');
            return;
        }
        const w = window.open('', '_blank');
        if (!w) return;
        w.document.write(`<!DOCTYPE html><html><head><title>Receipt</title></head><body>${this.buildReceiptHTML(tx)}<script>window.onload=function(){window.print();window.close();}<' + '/script></body></html>`);
        w.document.close();
    }

    async downloadLastReceiptPDF() {
        const tx = this.lastCompletedTransaction;
        if (!tx) {
            this.showNotification('No recent transaction to download.', 'warning');
            return;
        }
        if (!window.jspdf || !window.jspdf.jsPDF) {
            this.showNotification('PDF generator unavailable. Use Print and Save as PDF.', 'warning');
            return;
        }
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        let y = 15;
        doc.setFontSize(16);
        doc.text('Enhanced Professional Banking', 14, y); y += 8;
        doc.setFontSize(11);
        doc.text('Official Transaction Receipt', 14, y); y += 6;
        doc.line(14, y, 196, y); y += 6;

        const user = this.currentUser || {};
        const maskedAcc = user.accountNumber ? `****${user.accountNumber.slice(-4)}` : '****0000';
        const dateStr = new Date(tx.date || Date.now()).toLocaleString('en-IN');
        const rows = [
            [`Name`, `${user.fullName || user.username || 'User'}`],
            [`Account`, `${maskedAcc}`],
            [`Location`, `${tx.location || (user.location || this.atmData.location)}`],
            [`Date/Time`, `${dateStr}`],
            [`Txn ID`, `${tx.id || ''}`],
            [`Type`, `${tx.type.toUpperCase()}`],
            [`Amount`, `₹${(tx.amount||0).toLocaleString('en-IN')}`]
        ];
        if (tx.fee && tx.fee > 0) rows.push([`Fee`, `₹${tx.fee}`]);
        if (typeof tx.balanceAfter === 'number') rows.push([`Balance After`, `₹${tx.balanceAfter.toLocaleString('en-IN')}`]);
        if (tx.recipientAccount) rows.push([`To`, `${tx.recipientAccount} (${tx.recipientName || ''})`]);
        if (tx.notesBreakdown) {
            const notes = Object.entries(tx.notesBreakdown).filter(([,c]) => c>0).map(([d,c]) => `₹${d}×${c}`).join(', ');
            if (notes) rows.push([`Notes`, notes]);
        }

        rows.forEach(([k,v]) => {
            doc.text(`${k}: ${v}`, 14, y);
            y += 7;
            if (y > 280) { doc.addPage(); y = 15; }
        });
        y += 5;
        doc.setFontSize(10);
        doc.text('Thank you for banking with us.', 14, y);

        doc.save('receipt.pdf');
    }

    sendSMSNotification(transaction) {
        const message = `${transaction.type.toUpperCase()} of ₹${transaction.amount} completed. Balance: ₹${this.currentUser.balance}. Thank you for using our services.`;
        
        this.showNotification(`SMS sent to ${this.currentUser.phone}`, 'info');
        console.log(`SMS to ${this.currentUser.phone}: ${message}`);
    }

    // Transaction History
    showTransactionHistory() {
        // Direct access kept for internal use; external calls use initiateHistoryAccess()
        this.showScreen('historyScreen');
        this.renderTransactionHistory();
        const filter = document.getElementById('historyFilter');
        if (filter) filter.value = 'all';
        this.updateHistoryStats();
    }

    async downloadStatementPDF() {
        const list = (() => {
            const filter = document.getElementById('historyFilter')?.value || 'all';
            return filter === 'all' ? this.transactionHistory : this.transactionHistory.filter(t => t.type === filter);
        })();
        if (!list || list.length === 0) {
            this.showNotification('No transactions to include in statement.', 'warning');
            return;
        }
        if (!window.jspdf || !window.jspdf.jsPDF) {
            // Fallback: printable window
            const w = window.open('', '_blank');
            if (!w) return;
            const user = this.currentUser || {};
            const maskedAcc = user.accountNumber ? `****${user.accountNumber.slice(-4)}` : '****0000';
            let html = `<h2>Account Statement</h2><div>${user.fullName || user.username} (${maskedAcc})</div><hr>`;
            html += '<table border="1" cellspacing="0" cellpadding="6"><thead><tr><th>Date</th><th>Type</th><th>Amount</th><th>Fee</th></tr></thead><tbody>';
            html += list.map(t => `<tr><td>${new Date(t.date).toLocaleString('en-IN')}</td><td>${t.type}</td><td>${t.type==='deposit'?'+':'-'}₹${t.amount.toLocaleString('en-IN')}</td><td>${t.fee||0}</td></tr>`).join('');
            html += '</tbody></table>';
            w.document.write(`<!DOCTYPE html><html><head><title>Statement</title></head><body style="font-family:Segoe UI,Arial,sans-serif">${html}<script>window.onload=function(){window.print();}<' + '/script></body></html>`);
            w.document.close();
            return;
        }
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        const marginX = 14;
        let y = 15;
        doc.setFontSize(16);
        doc.text('Account Statement', marginX, y); y += 8;
        const user = this.currentUser || {};
        const maskedAcc = user.accountNumber ? `****${user.accountNumber.slice(-4)}` : '****0000';
        doc.setFontSize(11);
        doc.text(`${user.fullName || user.username || 'User'} (${maskedAcc})`, marginX, y); y += 6;
        doc.text(`Generated: ${new Date().toLocaleString('en-IN')}`, marginX, y); y += 4;
        doc.line(marginX, y, 196, y); y += 6;
        doc.setFontSize(11);
        doc.text('Date', marginX, y);
        doc.text('Type', marginX + 60, y);
        doc.text('Amount', marginX + 100, y);
        doc.text('Fee', marginX + 140, y);
        y += 6;
        doc.setFontSize(10);
        list.forEach(t => {
            const dt = new Date(t.date).toLocaleString('en-IN');
            const amt = `${t.type==='deposit'?'+':'-'}₹${t.amount.toLocaleString('en-IN')}`;
            const fee = t.fee ? `₹${t.fee}` : '—';
            doc.text(dt, marginX, y);
            doc.text(t.type.toUpperCase(), marginX + 60, y);
            doc.text(amt, marginX + 100, y);
            doc.text(fee, marginX + 140, y);
            y += 6;
            if (y > 280) { doc.addPage(); y = 15; }
        });
        doc.save('account_statement.pdf');
    }

    initiateHistoryAccess() {
        this.currentTransactionData = {
            type: 'history_access',
            amount: 0,
            fee: 0,
            description: 'View Transaction History'
        };
        this.showPinVerification();
    }

    initiateBalanceInquiry() {
        this.currentTransactionData = {
            type: 'balance_check',
            amount: 0,
            fee: 0,
            description: 'Balance Inquiry'
        };
        this.showPinVerification();
    }

    renderTransactionHistory(filtered = null) {
        const container = document.getElementById('transactionsList');
        if (!container) return;
        const list = filtered ?? this.transactionHistory;

        if (!list || list.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: #7f8c8d;">
                    <i class="fas fa-receipt" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                    <h3>No transactions yet</h3>
                    <p>Your transaction history will appear here once you make your first transaction.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = list.map(transaction => `
            <div class="transaction-item">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <i class="fas ${this.getTransactionIcon(transaction.type)}" style="font-size: 1.5rem; color: ${this.getTransactionColor(transaction.type)};"></i>
                        <div>
                            <strong style="color: #2c3e50; font-size: 1.1rem;">${transaction.type.toUpperCase()}</strong>
                            <div style="color: #7f8c8d; font-size: 0.9rem;">${new Date(transaction.date).toLocaleString('en-IN')}</div>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 1.2rem; font-weight: 700; color: ${this.getTransactionColor(transaction.type)};">
                            ${transaction.type === 'deposit' ? '+' : '-'}₹${transaction.amount.toLocaleString('en-IN')}
                        </div>
                        ${transaction.fee > 0 ? `<div style=\"font-size: 0.8rem; color: #e74c3c;\">Fee: ₹${transaction.fee}</div>` : ''}
                    </div>
                </div>
                ${transaction.recipientAccount ? `
                    <div style=\"background: rgba(52, 152, 219, 0.1); padding: 0.5rem; border-radius: 5px; font-size: 0.9rem;\">
                        To: ${transaction.recipientAccount} (${transaction.recipientName})
                    </div>
                ` : ''}
                ${transaction.notesBreakdown ? `
                    <div style=\"background: rgba(39, 174, 96, 0.1); padding: 0.5rem; border-radius: 5px; font-size: 0.9rem;\">
                        Notes: ${Object.entries(transaction.notesBreakdown).map(([denom, count]) => 
                            count > 0 ? `₹${denom}×${count}` : '').filter(Boolean).join(', ')}
                    </div>
                ` : ''}
            </div>
        `).join('');
    }

    getTransactionIcon(type) {
        const icons = {
            'withdrawal': 'fa-money-bill-wave',
            'deposit': 'fa-piggy-bank',
            'transfer': 'fa-exchange-alt'
        };
        return icons[type] || 'fa-receipt';
    }

    getTransactionColor(type) {
        const colors = {
            'withdrawal': '#e74c3c',
            'deposit': '#27ae60',
            'transfer': '#3498db'
        };
        return colors[type] || '#7f8c8d';
    }

    // Utility Methods
    generateAccountNumber() {
        return Date.now().toString().substr(-10);
    }

    updateUserData() {
        if (this.currentUser && this.currentUser.username) {
            localStorage.setItem('bankingUser_' + this.currentUser.username, JSON.stringify(this.currentUser));
        }
    }

    saveTransactionHistory() {
        if (!this.currentUser) return;
        localStorage.setItem('transactionHistory_' + this.currentUser.username, JSON.stringify(this.transactionHistory));
    }

    loadTransactionHistory() {
        if (!this.currentUser) {
            this.transactionHistory = [];
            return;
        }
        const stored = localStorage.getItem('transactionHistory_' + this.currentUser.username);
        this.transactionHistory = stored ? JSON.parse(stored) : [];
    }

    // UI Helper Methods
    showLoadingOverlay(message, steps = []) {
        const overlay = document.getElementById('loadingOverlay');
        const titleEl = document.getElementById('loadingTitle');
        const msgEl = document.getElementById('loadingMessage');
        const stepsContainer = document.querySelector('.loading-steps');
        
        if (overlay) {
            if (titleEl) titleEl.textContent = message;
            if (msgEl) msgEl.textContent = 'Please wait while we securely process your request...';
            overlay.classList.add('active');
        }

        if (stepsContainer && steps.length > 0) {
            stepsContainer.innerHTML = steps.map((step, index) => `
                <div class="step" id="step-${index}">
                    <i class="${step.icon}" style="font-size: 1.5rem;"></i>
                    <span>${step.text}</span>
                </div>
            `).join('');

            // Animate steps
            steps.forEach((step, index) => {
                setTimeout(() => {
                    const stepEl = document.getElementById(`step-${index}`);
                    if (stepEl) {
                        // Mark previous steps as completed
                        for (let i = 0; i < index; i++) {
                            const prevStep = document.getElementById(`step-${i}`);
                            if (prevStep) {
                                prevStep.classList.remove('active');
                                prevStep.classList.add('completed');
                            }
                        }
                        stepEl.classList.add('active');
                    }
                }, index * 800);
            });

            // Mark final step as completed
            setTimeout(() => {
                const lastIndex = steps.length - 1;
                const lastStep = document.getElementById(`step-${lastIndex}`);
                if (lastStep) {
                    lastStep.classList.remove('active');
                    lastStep.classList.add('completed');
                }
            }, steps.length * 800);
        }
    }

    hideLoadingOverlay() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
    }

    showFeedbackModal(type, title, message) {
        const modal = document.getElementById('feedbackModal');
        const icon = document.getElementById('feedbackIcon');
        const titleEl = document.getElementById('feedbackTitle');
        const textEl = document.getElementById('feedbackMessage');
        const detailsEl = document.getElementById('feedbackDetails');
        
        // Reset countdown
        const countdownEl = document.getElementById('feedbackCountdown');
        if (countdownEl) countdownEl.textContent = '';
        if (this.feedbackCountdownInterval) {
            clearInterval(this.feedbackCountdownInterval);
            this.feedbackCountdownInterval = null;
        }
        
        if (modal && icon && titleEl) {
            icon.className = `feedback-icon ${type}`;
            icon.innerHTML = type === 'success' ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-times-circle"></i>';
            titleEl.textContent = title;
            if (textEl) textEl.textContent = '';
            if (detailsEl) {
                detailsEl.textContent = message;
            }
            modal.classList.add('active');
        }
    }

    closeFeedbackModal() {
        // Clear countdown when closing
        if (this.feedbackCountdownInterval) {
            clearInterval(this.feedbackCountdownInterval);
            this.feedbackCountdownInterval = null;
        }
        const countdownEl = document.getElementById('feedbackCountdown');
        if (countdownEl) countdownEl.textContent = '';
        const modal = document.getElementById('feedbackModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    showNotification(message, type = 'info') {
        const container = document.getElementById('notificationContainer');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-times-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };

        notification.innerHTML = `
            <i class="fas ${icons[type] || icons.info}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.remove()">×</button>
        `;

        container.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }
    // History helpers
    updateHistoryStats() {
        const totalEl = document.getElementById('totalTransactions');
        const monthlyEl = document.getElementById('monthlyTransactions');
        if (totalEl) totalEl.textContent = this.transactionHistory.length.toString();
        if (monthlyEl) {
            const now = new Date();
            const m = now.getMonth();
            const y = now.getFullYear();
            const monthly = this.transactionHistory.filter(t => {
                const d = new Date(t.date);
                return d.getMonth() === m && d.getFullYear() === y;
            });
            monthlyEl.textContent = monthly.length.toString();
        }
    }

    filterTransactions() {
        const filter = document.getElementById('historyFilter')?.value || 'all';
        const list = filter === 'all' ? this.transactionHistory : this.transactionHistory.filter(t => t.type === filter);
        this.renderTransactionHistory(list);
        this.updateHistoryStats();
    }

    updateRecentTransactionsPreview() {
        const container = document.getElementById('recentTransactionsList');
        if (!container) return;
        const preview = this.transactionHistory.slice(0, 5);
        if (preview.length === 0) {
            container.innerHTML = '<div style="color:#7f8c8d;">No recent activity</div>';
            return;
        }
        container.innerHTML = preview.map(t => `
            <div class="transaction-mini" style="display:flex;justify-content:space-between;align-items:center;padding:0.5rem 0;border-bottom:1px solid #ecf0f1;">
                <div style="display:flex;align-items:center;gap:0.5rem;">
                    <i class="fas ${this.getTransactionIcon(t.type)}" style="color:${this.getTransactionColor(t.type)}"></i>
                    <div>${t.type.toUpperCase()}</div>
                </div>
                <div style="font-weight:700;color:${this.getTransactionColor(t.type)}">${t.type === 'deposit' ? '+' : '-'}₹${t.amount.toLocaleString('en-IN')}</div>
            </div>`).join('');
    }

    showBalanceInquiry() {
        if (!this.currentUser) return;
        // Require PIN before showing balance
        this.initiateBalanceInquiry();
    }

    async hashString(str) {
        const enc = new TextEncoder();
        const buf = await crypto.subtle.digest('SHA-256', enc.encode(str));
        const bytes = Array.from(new Uint8Array(buf));
        return bytes.map(b => b.toString(16).padStart(2, '0')).join('');
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.bankingApp = new BankingApp();

    // Global wrappers for inline handlers
    window.showWelcomeScreen = () => window.bankingApp.showScreen('welcomeScreen');
    window.showRegisterScreen = () => window.bankingApp.showScreen('registerScreen');
    window.showLoginScreen = () => window.bankingApp.showScreen('loginScreen');
    window.showDashboard = () => window.bankingApp.showDashboard();
    window.showWithdrawScreen = () => window.bankingApp.showScreen('withdrawScreen');
    window.showDepositScreen = () => window.bankingApp.showScreen('depositScreen');
    window.showTransferScreen = () => window.bankingApp.showScreen('transferScreen');
    window.showChangePinScreen = () => window.bankingApp.showScreen('changePinScreen');

    window.showDemoModal = () => document.getElementById('demoModal')?.classList.add('active');
    window.closeDemoModal = () => document.getElementById('demoModal')?.classList.remove('active');
    window.autoLoginDemo = (key) => {
        const map = { 'demo_user': 'savings', 'premium_user': 'premium' };
        window.bankingApp.handleDemoLogin(map[key] || 'savings');
    };

    window.registerUser = (e) => window.bankingApp.handleRegistration(e);
    window.loginUser = (e) => window.bankingApp.handleLogin(e);
    window.initiateWithdrawal = (e) => window.bankingApp.handleWithdrawal(e);
    window.initiateDeposit = (e) => window.bankingApp.handleDeposit(e);
    window.initiateTransfer = (e) => window.bankingApp.handleTransfer(e);
    window.changePin = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const cur = formData.get('currentPin');
        const np = formData.get('newPin');
        const cp = formData.get('confirmNewPin');
        if (np !== cp) return window.bankingApp.showNotification('New PIN and confirm PIN do not match', 'error');
        if (!/^[0-9]{4}$/.test(np)) return window.bankingApp.showNotification('PIN must be 4 digits', 'error');
        const user = window.bankingApp.currentUser;
        const curHash = user.pinHash ? await window.bankingApp.hashString(cur) : null;
        if ((user.pinHash && user.pinHash !== curHash) || (user.pin && user.pin !== cur)) {
            return window.bankingApp.showNotification('Current PIN is incorrect', 'error');
        }
        // Update to hashed PIN
        user.pinHash = await window.bankingApp.hashString(np);
        delete user.pin;
        window.bankingApp.updateUserData();
        window.bankingApp.showFeedbackModal('success', 'PIN Updated', 'Your PIN has been updated successfully.');
        setTimeout(() => {
            window.bankingApp.closeFeedbackModal();
            window.bankingApp.showDashboard();
        }, 1500);
    };

    window.verifyPIN = (e) => window.bankingApp.verifyPin(e);
    window.cancelTransaction = () => window.bankingApp.cancelCurrentTransaction();
    window.closeFeedbackModal = () => window.bankingApp.closeFeedbackModal();
    window.logout = () => window.bankingApp.logout();
    window.showTransactionHistory = () => window.bankingApp.initiateHistoryAccess();
    window.filterTransactions = () => window.bankingApp.filterTransactions();
    window.showBalanceInquiry = () => window.bankingApp.initiateBalanceInquiry();
    window.printLastReceipt = () => window.bankingApp.printLastReceipt();
    window.downloadLastReceiptPDF = () => window.bankingApp.downloadLastReceiptPDF();
    window.downloadStatementPDF = () => window.bankingApp.downloadStatementPDF();
});

// Handle page visibility change
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && window.bankingApp) {
        window.bankingApp.updateDateTime();
    }
});

// Handle window resize for responsive design
window.addEventListener('resize', () => {
    // Update any responsive elements if needed
});

// Prevent context menu on production
document.addEventListener('contextmenu', (e) => {
    // Uncomment for production
    // e.preventDefault();
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.altKey && e.key === 'h' && window.bankingApp?.isLoggedIn) {
        window.bankingApp.showDashboard();
    }
    if (e.altKey && e.key === 't' && window.bankingApp?.isLoggedIn) {
        window.bankingApp.showTransactionHistory();
    }
    if (e.key === 'Escape') {
        // Close any open modals
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
    }
});