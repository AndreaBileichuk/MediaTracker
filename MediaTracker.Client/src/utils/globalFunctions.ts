export const formatRuntime = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
};

export const getYear = (date: string) => new Date(date).getFullYear();

export const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'completed': return '#2ecc71';
        case 'inprocess': return '#f1c40f';
        case 'dropped': return '#e74c3c';
        default: return '#3498db';
    }
};

export function formatDate (date: string): string {
    return new Intl.DateTimeFormat("uk-UA", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    }).format(new Date(date));
}
