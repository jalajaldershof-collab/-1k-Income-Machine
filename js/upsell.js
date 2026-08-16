// Upsell page functionality - upsell.html

const basePrice = 17;
const upsell1Price = 10;
const upsell2Price = 27;

let selectedUpsell1 = false;
let selectedUpsell2 = false;

function initiateUpsellCheckout() {
    let total = 17;
    const selectedUpsell1 = document.querySelector('#checkbox1')?.classList.contains('selected') || false;
    const selectedUpsell2 = document.querySelector('#checkbox2')?.classList.contains('selected') || false;

    if (selectedUpsell1) total += 10;
    if (selectedUpsell2) total += 27;

    let contentIds = ['FCS-001'];
    if (selectedUpsell1) contentIds.push('FCS-UPS-001');
    if (selectedUpsell2) contentIds.push('FCS-UPS-002');

    trackConversion('InitiateCheckout', {
        content_name: 'First Customer System Bundle',
        content_type: 'product',
        currency: 'USD',
        value: total,
        content_ids: contentIds,
        num_items: contentIds.length
    });

    // Store selection for thankyou page
    localStorage.setItem('order_data', JSON.stringify({
        total: total,
        items: contentIds,
        selectedUpsell1: selectedUpsell1,
        selectedUpsell2: selectedUpsell2
    }));
}

function handleCheckout() {
    // Track InitiateCheckout
    initiateUpsellCheckout();

    let total = basePrice;
    const hasUpsell1 = selectedUpsell1;
    const hasUpsell2 = selectedUpsell2;

    if (hasUpsell1) total += upsell1Price;
    if (hasUpsell2) total += upsell2Price;

    let redirectUrl = '';
    if (hasUpsell1 && hasUpsell2) {
        redirectUrl = 'https://whop.com/c/ultraoffer/3';
    } else if (hasUpsell1 && !hasUpsell2) {
        redirectUrl = 'https://whop.com/c/the-bundle-offer/2';
    } else if (!hasUpsell1 && hasUpsell2) {
        redirectUrl = 'https://whop.com/c/freeclientsystem/4';
    } else {
        redirectUrl = 'https://whop.com/c/first-customer-blueprint/1';
    }

    const btn = document.querySelector('.btn-primary');
    const originalText = btn.innerHTML;
    btn.innerHTML = '⏳ Redirecting...';
    btn.style.opacity = '0.7';
    btn.disabled = true;

    window.location.href = redirectUrl;
}

function toggleUpsell(tileId, checkboxId) {
    if (tileId === 'upsell1') {
        selectedUpsell1 = !selectedUpsell1;
        const checkbox = document.getElementById(checkboxId);
        if (checkbox) {
            checkbox.classList.toggle('selected');
        }
    } else if (tileId === 'upsell2') {
        selectedUpsell2 = !selectedUpsell2;
        const checkbox = document.getElementById(checkboxId);
        if (checkbox) {
            checkbox.classList.toggle('selected');
        }
    }
    updateTotal();
}

function updateTotal() {
    let total = basePrice;
    let savings = 0;

    if (selectedUpsell1) {
        total += upsell1Price;
        savings += (147 - upsell1Price);
    }

    if (selectedUpsell2) {
        total += upsell2Price;
        savings += (197 - upsell2Price);
    }

    let originalTotal = basePrice;
    if (selectedUpsell1) originalTotal += 147;
    if (selectedUpsell2) originalTotal += 197;

    const totalSavings = originalTotal - total;

    const priceElement = document.getElementById('totalPrice');
    if (priceElement) {
        priceElement.style.transform = 'scale(1.15)';
        setTimeout(() => {
            priceElement.style.transform = 'scale(1)';
        }, 200);
        priceElement.textContent = total;
    }

    const savingsDisplay = document.getElementById('savingsDisplay');
    if (savingsDisplay) {
        if (totalSavings > 0) {
            savingsDisplay.innerHTML = `<i class="fas fa-tag" style="margin-right: 6px;"></i> You save $${totalSavings}`;
        } else {
            savingsDisplay.innerHTML = `<i class="fas fa-tag" style="margin-right: 6px;"></i> You save $0`;
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.upsell-tile').forEach(function(tile) {
        tile.addEventListener('click', function(e) {
            if (e.target.closest('.selection-checkbox')) {
                return;
            }
            const id = this.id;
            if (id === 'upsell1') {
                toggleUpsell('upsell1', 'checkbox1');
            } else if (id === 'upsell2') {
                toggleUpsell('upsell2', 'checkbox2');
            }
        });
    });

    document.querySelectorAll('.selection-checkbox').forEach(function(checkbox) {
        checkbox.addEventListener('click', function(e) {
            e.stopPropagation();
            const tile = this.closest('.upsell-tile');
            if (tile) {
                const id = tile.id;
                if (id === 'upsell1') {
                    toggleUpsell('upsell1', 'checkbox1');
                } else if (id === 'upsell2') {
                    toggleUpsell('upsell2', 'checkbox2');
                }
            }
        });
    });

    updateTotal();
});

const style = document.createElement('style');
style.textContent = `
    .selection-checkbox { cursor: pointer !important; }
    .upsell-tile { cursor: pointer !important; }
`;
document.head.appendChild(style);

// Expose functions globally
window.toggleUpsell = toggleUpsell;
window.handleCheckout = handleCheckout;
window.initiateUpsellCheckout = initiateUpsellCheckout;