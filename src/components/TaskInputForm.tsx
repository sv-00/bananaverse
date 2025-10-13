// components/MapControls/TaskInputForm.tsx
import { useState } from 'react';
import { Camera } from 'lucide-react';
import { fileToBase64 } from '@/utils/fileUtils';

interface TaskInputFormProps {
    onCreateTask: (taskData: any) => Promise<void>;
    onCancel: () => void;
}

export function TaskInputForm({ onCreateTask, onCancel }: TaskInputFormProps) {
    const [taskName, setTaskName] = useState('');
    const [taskQuantity, setTaskQuantity] = useState(1);
    const [taskImage, setTaskImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setTaskImage(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        if (!taskName.trim()) return;

        setLoading(true);
        try {
            let imageUrl = null;
            if (taskImage) {
                imageUrl = await fileToBase64(taskImage);
            }

            await onCreateTask({
                name: taskName,
                quantity: taskQuantity,
                imageUrl,
                completed: false
            });

            // Reset form
            setTaskName('');
            setTaskQuantity(1);
            setTaskImage(null);
            setImagePreview('');
        } catch (error) {
            console.error('Failed to create task:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-3 p-3 bg-white rounded-lg shadow-md border border-gray-100">
            <div className="flex space-x-2 mb-3">
                <input
                    type="text"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    placeholder="Enter task name..."
                    className="flex-grow p-3 text-sm border-2 border-gray-300 rounded-xl focus:ring-purple-500 focus:border-purple-500 transition duration-150"
                    required
                />
                <input
                    type="number"
                    value={taskQuantity}
                    onChange={(e) => setTaskQuantity(parseInt(e.target.value) || 1)}
                    min="1"
                    className="w-20 p-3 text-sm border-2 border-gray-300 rounded-xl text-center font-bold focus:ring-purple-500 focus:border-purple-500 transition duration-150"
                    placeholder="Qty"
                />
            </div>

            {imagePreview && (
                <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-xl mb-3 shadow-inner mx-auto border-2 border-gray-200"
                />
            )}

            <div className="flex space-x-2">
                <button
                    onClick={onCancel}
                    disabled={loading}
                    className="w-1/3 bg-gray-400 text-white p-3 rounded-xl font-bold text-xs shadow-lg hover:bg-gray-500 transition duration-150 transform hover:scale-[1.01] disabled:opacity-50"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={loading || !taskName.trim()}
                    className="w-1/3 bg-green-600 text-white p-3 rounded-xl font-bold text-sm shadow-lg hover:bg-green-700 transition duration-150 transform hover:scale-[1.01] disabled:opacity-50"
                >
                    {loading ? 'Adding...' : 'Add Task'}
                </button>
                <label className="w-1/3 cursor-pointer bg-blue-600 text-white p-3 rounded-xl font-bold text-xs shadow-lg hover:bg-blue-700 transition duration-150 flex items-center justify-center transform hover:scale-[1.01] disabled:opacity-50">
                    <Camera className="w-3 h-3 mr-1" />
                    Add Photo
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                        disabled={loading}
                    />
                </label>
            </div>
        </div>
    );
}