import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon, Check } from 'lucide-react';

interface ImageUploadControlProps {
    label: string;
    value?: string;
    onChange: (url: string | undefined) => void;
    placeholder?: string;
    aspectRatio?: 'square' | 'video' | 'banner';
    className?: string;
}

export const ImageUploadControl: React.FC<ImageUploadControlProps> = ({
    label,
    value,
    onChange,
    placeholder = "Upload image...",
    aspectRatio = 'square',
    className = ''
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            processFile(file);
        }
    };

    const processFile = async (file: File) => {
        if (!file.type.startsWith('image/')) return;

        setUploading(true);
        try {
            const { uploadBuilderAsset } = await import('@/lib/storage');
            const url = await uploadBuilderAsset(file, 'custom-assets');
            onChange(url);
        } catch (error) {
            console.error('Failed to upload image:', error);
            alert('Errore durante il caricamento dell\'immagine. Riprova.');
        } finally {
            setUploading(false);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            processFile(file);
        }
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(undefined);
    };

    const getAspectRatioClass = () => {
        switch (aspectRatio) {
            case 'video': return 'aspect-video';
            case 'banner': return 'aspect-[3/1]';
            case 'square':
            default: return 'aspect-square';
        }
    };

    return (
        <div className={`space-y-2 ${className}`}>
            <label className="text-[10px] text-slate-400 font-medium">{label}</label>

            <div
                onClick={() => !uploading && inputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                    relative w-full rounded-xl border-dashed transition-all cursor-pointer group overflow-hidden
                    ${getAspectRatioClass()}
                    ${isDragging
                        ? 'border-2 border-indigo-500 bg-indigo-500/10'
                        : 'border border-slate-700 bg-slate-800 hover:border-indigo-500 hover:bg-slate-800/80'
                    }
                    ${uploading ? 'cursor-wait opacity-80' : ''}
                `}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                />

                {uploading && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm">
                        <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mb-2" />
                        <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Caricamento...</span>
                    </div>
                )}

                {value ? (
                    <>
                        <img
                            src={value}
                            alt={label}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Upload size={20} className="text-white mb-1" />
                            <span className="text-[10px] text-white font-medium">Change Image</span>
                        </div>
                        <button
                            onClick={handleRemove}
                            className="absolute top-2 right-2 p-1 bg-red-500/80 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                        >
                            <X size={12} />
                        </button>
                    </>
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
                        <div className={`
                            w-10 h-10 rounded-full flex items-center justify-center transition-colors
                            ${isDragging ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-400 group-hover:bg-slate-600 group-hover:text-slate-300'}
                        `}>
                            {isDragging ? <Check size={20} /> : <Upload size={18} />}
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-xs font-medium text-slate-300">
                                {isDragging ? 'Drop to upload' : 'Click or Drag'}
                            </p>
                            <p className="text-[9px] text-slate-500">
                                {placeholder}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
