export function currencyFormatter(amount: number): string {
    if (isNaN(amount)) return '';
    return Intl.NumberFormat('en-ng', { currency: 'NGN', style: "currency" }).format(amount);
}

export function dateFormatter(date: string | Date): string {

    return Intl.DateTimeFormat('en', {
        hour12: true,
        hour: '2-digit',
        day: '2-digit', 
        year: '2-digit', 
        month: '2-digit', 
        minute: '2-digit',
        timeZone: 'Africa/Lagos'
    }).format(new Date(date));
}