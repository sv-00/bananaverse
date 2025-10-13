// components/MapControls/MapControls.tsx
import { ListChecks } from 'lucide-react';
import { TaskInputForm } from './TaskInputForm';
import { StatusMessage } from './StatusMessage';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface MapControlsProps {
    authStatus: string;
    showTaskInput: boolean;
    loading: boolean;
    message: { text: string; type: 'success' | 'error' | 'info' | 'warning' } | null;
    taskCount: number;
    onTaskCreate: (taskData: any) => Promise<void>;
    onCancelTask: () => void;
}

export function MapControls({
    authStatus,
    showTaskInput,
    loading,
    message,
    taskCount,
    onTaskCreate,
    onCancelTask
}: MapControlsProps) {
    return (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 max-w-[95%] w-[450px] bg-gradient-to-br from-white/95 to-gray-100/90 backdrop-blur-sm border border-gray-300/70 rounded-xl shadow-2xl p-4">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h1 className="text-xl font-black text-gray-800">🍌 Banana Laundering Map</h1>
                    <p className="text-xs text-gray-500 mt-1 truncate">{authStatus}</p>
                </div>
                <button className="p-2 text-gray-500 hover:text-purple-600 transition duration-150 rounded-full hover:bg-gray-100">
                    <ListChecks className="w-5 h-5" />
                </button>
            </div>

            {!showTaskInput && (
                <p className="text-sm text-gray-700 p-3 bg-yellow-100 border border-yellow-200 rounded-lg font-medium text-center shadow-inner">
                    Drop a pin for your next top-secret 🍌 delivery location!
                </p>
            )}

            {showTaskInput && (
                <TaskInputForm
                    onCreateTask={onTaskCreate}
                    onCancel={onCancelTask}
                />
            )}

            <StatusMessage message={message} />

            {loading && <LoadingSpinner />}
        </div>
    );
}