/**
 * Format a number as Indian Rupee currency string.
 * Example: formatPrice(12500) → "₹12,500"
 */
export function formatPrice(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount);
}
