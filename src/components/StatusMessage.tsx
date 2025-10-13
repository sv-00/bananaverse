// components/MapControls/StatusMessage.tsx

interface StatusMessageProps {
    message: { text: string; type: 'success' | 'error' | 'info' | 'warning' } | null;
}

const messageClasses = {
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    warning: 'bg-yellow-100 text-yellow-800'
};

export function StatusMessage({ message }: StatusMessageProps) {
    if (!message) return null;

    return (
        <div className={`mt-3 p-3 text-sm rounded-xl text-center shadow-inner font-medium ${messageClasses[message.type]}`}>
            {message.text}
        </div>
    );
}