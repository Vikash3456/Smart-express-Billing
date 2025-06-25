    // Application State
        let appState = {
            currentProduct: null,
            customerDetails: {},
            orderSummary: {},
            paymentDetails: {}
        };

        // Sample product database
        const productDB = {
            '8901030895559': {
                name: 'Maggi 2-Minute Noodles',
                price: 24.00,
                category: 'Food & Beverages',
                brand: 'Nestle'
            },
            '8901725142259': {
                name: 'Britannia Good Day Cookies',
                price: 35.00,
                category: 'Biscuits & Snacks',
                brand: 'Britannia'
            },
            '1234567890123': {
                name: 'Sample Product',
                price: 99.00,
                category: 'General',
                brand: 'Demo Brand'
            }
        };

        // Navigation
        function goToPage(pageId) {
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
            });
            document.getElementById(pageId).classList.add('active');
        }

        // Image upload handling
        document.getElementById('imageInput').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const preview = document.getElementById('previewImage');
                    preview.src = e.target.result;
                    document.getElementById('previewContainer').style.display = 'block';
                    
                    // Simulate barcode scanning
                    simulateBarcodeScanning();
                };
                reader.readAsDataURL(file);
            }
        });

        // Simulate barcode scanning (since QuaggaJS needs more setup)
        function simulateBarcodeScanning() {
            const loader = document.getElementById('scanningLoader');
            const result = document.getElementById('scanResult');
            
            loader.style.display = 'block';
            
            setTimeout(() => {
                loader.style.display = 'none';
                
                // Simulate finding a barcode
                const mockBarcode = '8901030895559'; // Maggi noodles
                const product = productDB[mockBarcode];
                
                if (product) {
                    result.innerHTML = `
                        <div style="background: #d4edda; color: #155724; padding: 15px; border-radius: 8px; margin-top: 15px;">
                            <i class="fas fa-check-circle"></i>
                            <strong>Product Found!</strong><br>
                            ${product.name} - ₹${product.price}
                        </div>
                    `;
                    
                    appState.currentProduct = {
                        ...product,
                        barcode: mockBarcode
                    };
                    
                    checkFormCompletion();
                } else {
                    result.innerHTML = `
                        <div style="background: #f8d7da; color: #721c24; padding: 15px; border-radius: 8px; margin-top: 15px;">
                            <i class="fas fa-exclamation-triangle"></i>
                            Product not found in database
                        </div>
                    `;
                }
            }, 2000);
        }

        // Form completion check
        function checkFormCompletion() {
            const whatsapp = document.getElementById('whatsappNumber').value;
            const name = document.getElementById('customerName').value;
            const hasProduct = appState.currentProduct !== null;
            
            const nextBtn = document.getElementById('nextBtn');
            nextBtn.disabled = !(whatsapp && name && hasProduct);
        }

        // Event listeners for form inputs
        document.getElementById('whatsappNumber').addEventListener('input', checkFormCompletion);
        document.getElementById('customerName').addEventListener('input', checkFormCompletion);

        // Process upload and move to summary
        function processUpload() {
            if (!appState.currentProduct) {
                alert('Please capture a product image first');
                return;
            }
            
            appState.customerDetails = {
                name: document.getElementById('customerName').value,
                whatsapp: document.getElementById('whatsappNumber').value
            };
            
            updateSummaryPage();
            goToPage('summary');
        }

        // Update summary page
        function updateSummaryPage() {
            const product = appState.currentProduct;
            const price = parseFloat(product.price);
            const tax = price * 0.18;
            const serviceFee = 5.00;
            const total = price + tax + serviceFee;
            
            // Update product details
            document.getElementById('productImage').src = document.getElementById('previewImage').src;
            document.getElementById('productName').textContent = product.name;
            document.getElementById('productBarcode').textContent = `Barcode: ${product.barcode}`;
            document.getElementById('productCategory').textContent = `Category: ${product.category}`;
            document.getElementById('productPrice').textContent = `₹${price.toFixed(2)}`;
            
            // Update bill summary
            document.getElementById('subtotal').textContent = `₹${price.toFixed(2)}`;
            document.getElementById('tax').textContent = `₹${tax.toFixed(2)}`;
            document.getElementById('serviceFee').textContent = `₹${serviceFee.toFixed(2)}`;
            document.getElementById('totalAmount').textContent = `₹${total.toFixed(2)}`;
            document.getElementById('paymentTotal').textContent = `₹${total.toFixed(2)}`;
            
            appState.orderSummary = {
                subtotal: price,
                tax: tax,
                serviceFee: serviceFee,
                total: total
            };
        }

        // Payment method selection
        document.querySelectorAll('.payment-method').forEach(method => {
            method.addEventListener('click', function() {
                document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('selected'));
                this.classList.add('selected');
                
                const methodType = this.dataset.method;
                const cardForm = document.getElementById('cardForm');
                cardForm.style.display = methodType === 'card' ? 'block' : 'none';
            });
        });

        // Card number formatting
        document.getElementById('cardNumber').addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
            let formattedInputValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedInputValue;
        });

        // Card expiry formatting
        document.getElementById('cardExpiry').addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });

        // CVV input restriction
        document.getElementById('cardCvv').addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
        });

        // Process payment
        function processPayment() {
            const selectedMethod = document.querySelector('.payment-method.selected').dataset.method;
            
            // Basic validation for card payment
            if (selectedMethod === 'card') {
                const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
                const cardName = document.getElementById('cardName').value;
                const cardExpiry = document.getElementById('cardExpiry').value;
                const cardCvv = document.getElementById('cardCvv').value;
                
                if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
                    alert('Please fill all card details');
                    return;
                }
                
                if (cardNumber.length !== 16) {
                    alert('Please enter a valid 16-digit card number');
                    return;
                }
                
                if (cardCvv.length !== 3) {
                    alert('Please enter a valid 3-digit CVV');
                    return;
                }
            }
            
            // Show loading
            document.getElementById('paymentLoader').style.display = 'block';
            document.getElementById('payBtn').disabled = true;
            
            // Simulate payment processing
            setTimeout(() => {
                appState.paymentDetails = {
                    method: selectedMethod,
                    amount: appState.orderSummary.total,
                    transactionId: 'TXN' + Date.now(),
                    timestamp: new Date()
                };
                
                updateSuccessPage();
                goToPage('success');
                
                document.getElementById('paymentLoader').style.display = 'none';
                document.getElementById('payBtn').disabled = false;
            }, 3000);
        }

        // Update success page
        function updateSuccessPage() {
            const payment = appState.paymentDetails;
            
            document.getElementById('transactionId').textContent = payment.transactionId;
            document.getElementById('paidAmount').textContent = `₹${payment.amount.toFixed(2)}`;
            document.getElementById('paymentMethod').textContent = getPaymentMethodName(payment.method);
            document.getElementById('paymentTime').textContent = payment.timestamp.toLocaleString();
        }

        // Get payment method display name
        function getPaymentMethodName(method) {
            const names = {
                'card': 'Credit/Debit Card',
                'upi': 'UPI Payment',
                'wallet': 'Digital Wallet'
            };
            return names[method] || 'Unknown';
        }

        // Send WhatsApp message
        function sendWhatsApp() {
            const customer = appState.customerDetails;
            const product = appState.currentProduct;
            const payment = appState.paymentDetails;
            
            const message = `🧾 *Smart Express Billing Receipt*

👤 *Customer:* ${customer.name}
📱 *Transaction ID:* ${payment.transactionId}
🕒 *Date:* ${payment.timestamp.toLocaleDateString()}

📦 *Product Details:*
• ${product.name}
• Price: ₹${product.price}
• Barcode: ${product.barcode}

💰 *Bill Summary:*
• Subtotal: ₹${appState.orderSummary.subtotal.toFixed(2)}
• Tax (18%): ₹${appState.orderSummary.tax.toFixed(2)}
• Service Fee: ₹${appState.orderSummary.serviceFee.toFixed(2)}
• *Total: ₹${appState.orderSummary.total.toFixed(2)}*

✅ Payment Status: Successful
💳 Method: ${getPaymentMethodName(payment.method)}

Thank you for using Smart Express Billing! 🙏`;
            
            const whatsappUrl = `https://wa.me/${customer.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        }

        // Download bill as PDF
        function downloadBill() {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            // Header
            doc.setFontSize(20);
            doc.setTextColor(102, 126, 234);
            doc.text('⚡ Smart Express Billing', 20, 30);
            
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text('Digital Receipt', 20, 40);
            
            // Transaction details
            const payment = appState.paymentDetails;
            const customer = appState.customerDetails;
            const product = appState.currentProduct;
            
            let y = 60;
            doc.text(`Transaction ID: ${payment.transactionId}`, 20, y);
            y += 10;
            doc.text(`Date: ${payment.timestamp.toLocaleString()}`, 20, y);
            y += 10;
            doc.text(`Customer: ${customer.name}`, 20, y);
            y += 10;
            doc.text(`WhatsApp: ${customer.whatsapp}`, 20, y);
            
            // Product details
            y += 20;
            doc.setFontSize(14);
            doc.text('Product Details:', 20, y);
            doc.setFontSize(12);
            y += 15;
            doc.text(`Name: ${product.name}`, 30, y);
            y += 10;
            doc.text(`Category: ${product.category}`, 30, y);
            y += 10;
            doc.text(`Barcode: ${product.barcode}`, 30, y);
            y += 10;
            doc.text(`Price: ₹${product.price}`, 30, y);
            
            // Bill summary
            y += 20;
            doc.setFontSize(14);
            doc.text('Bill Summary:', 20, y);
            doc.setFontSize(12);
            y += 15;
            doc.text(`Subtotal: ₹${appState.orderSummary.subtotal.toFixed(2)}`, 30, y);
            y += 10;
            doc.text(`Tax (18% GST): ₹${appState.orderSummary.tax.toFixed(2)}`, 30, y);
            y += 10;
            doc.text(`Express Service Fee: ₹${appState.orderSummary.serviceFee.toFixed(2)}`, 30, y);
            y += 15;
            doc.setFontSize(14);
            doc.text(`Total Amount: ₹${appState.orderSummary.total.toFixed(2)}`, 30, y);
            
            // Payment details
            y += 20;
            doc.setFontSize(12);
            doc.text(`Payment Method: ${getPaymentMethodName(payment.method)}`, 20, y);
            y += 10;
            doc.text('Payment Status: Successful ✓', 20, y);
            
            // Footer
            y += 30;
            doc.setFontSize(10);
            doc.setTextColor(128, 128, 128);
            doc.text('Thank you for using Smart Express Billing!', 20, y);
            doc.text('Skip the Queue • Click & Pay • Walk Away', 20, y + 10);
            
            // Save the PDF
            doc.save(`SmartExpress_Receipt_${payment.transactionId}.pdf`);
        }

        // Initialize app
        document.addEventListener('DOMContentLoaded', function() {
            // Auto-fill demo data for testing
            if (window.location.search.includes('demo=true')) {
                document.getElementById('whatsappNumber').value = '+91 9876543210';
                document.getElementById('customerName').value = 'Demo User';
            }
            
            // Set current time on success page
            document.getElementById('paymentTime').textContent = new Date().toLocaleString();
        });

        // Keyboard shortcuts for demo
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.shiftKey) {
                switch(e.key) {
                    case 'L':
                        goToPage('landing');
                        break;
                    case 'U':
                        goToPage('upload');
                        break;
                    case 'S':
                        goToPage('summary');
                        break;
                    case 'P':
                        goToPage('payment');
                        break;
                    case 'X':
                        goToPage('success');
                        break;
                }
            }
        });

        // Service Worker for offline functionality (optional)
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(function(registration) {
                    console.log('SW registered: ', registration);
                }).catch(function(registrationError) {
                    console.log('SW registration failed: ', registrationError);
                });
            });
        }

        // Analytics tracking (placeholder)
        function trackEvent(eventName, eventData) {
            console.log('Event:', eventName, eventData);
            // Here you would integrate with Google Analytics, Mixpanel, etc.
        }

        // Track page views
        function trackPageView(pageName) {
            trackEvent('page_view', { page: pageName });
        }

        // Enhanced error handling
        window.addEventListener('error', function(e) {
            console.error('Global error:', e.error);
            // You could send this to an error tracking service
        });

        // Network status detection
        window.addEventListener('online', function() {
            console.log('App is online');
        });

        window.addEventListener('offline', function() {
            console.log('App is offline');
            alert('You are currently offline. Some features may not work properly.');
        });

        // Fix: Link Take Photo button to file input
        document.querySelector('.camera-btn').addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('imageInput').click();
        });