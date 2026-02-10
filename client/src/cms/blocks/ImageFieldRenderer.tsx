import { useState, useCallback, useRef } from "react";
import { useUpload } from "@/hooks/use-upload";
import { useToast } from "@/hooks/use-toast";
import { MediaPickerDialog } from "@/components/admin/MediaPickerDialog";

interface ImageFieldRendererProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export function ImageFieldRenderer({ value, onChange, label }: ImageFieldRendererProps) {
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, isUploading } = useUpload();
  const { toast } = useToast();

  const handleFileUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please select an image file", variant: "destructive" });
      return;
    }

    const result = await uploadFile(file);
    if (result) {
      const publicUrl = (result.metadata as any)?.publicUrl || result.objectPath;
      const mediaData = {
        filename: file.name,
        storagePath: result.objectPath,
        publicUrl: publicUrl,
        mimeType: file.type || "application/octet-stream",
        fileSize: file.size,
        folder: "uploads",
      };

      try {
        const mediaRes = await fetch("/api/admin/media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(mediaData),
        });
        if (!mediaRes.ok) {
          console.warn("Failed to save media metadata, image still usable");
        }
      } catch {
        console.warn("Failed to save media metadata, image still usable");
      }

      onChange(publicUrl);
      toast({ title: "Uploaded", description: `${file.name} uploaded successfully` });
    }
  }, [uploadFile, onChange, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
    e.target.value = "";
  }, [handleFileUpload]);

  const handleMediaSelect = useCallback((url: string) => {
    onChange(url);
  }, [onChange]);

  const handleClear = useCallback(() => {
    onChange("");
  }, [onChange]);

  return (
    <div className="space-y-2" data-testid="image-field-renderer">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter image URL or upload..."
          className="flex-1 px-3 py-1.5 text-sm bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
          data-testid="image-field-url-input"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-gray-700 transition-colors"
            title="Clear image"
            data-testid="image-field-clear"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative border-2 border-dashed rounded-lg transition-colors ${
          isDragOver
            ? "border-cyan-400 bg-cyan-900/20"
            : "border-gray-700 hover:border-gray-600"
        } ${value ? "p-2" : "p-4"}`}
        data-testid="image-field-dropzone"
      >
        {isUploading ? (
          <div className="flex items-center justify-center py-3">
            <svg className="animate-spin w-5 h-5 text-cyan-400 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            <span className="text-sm text-gray-400">Uploading...</span>
          </div>
        ) : value ? (
          <div className="flex items-start gap-3">
            <div className="w-20 h-20 rounded overflow-hidden bg-gray-800 flex-shrink-0">
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
                data-testid="image-field-preview"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400 truncate mb-2" title={value}>{value}</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMediaPickerOpen(true)}
                  className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors"
                  data-testid="image-field-library-btn"
                >
                  Media Library
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors"
                  data-testid="image-field-upload-btn"
                >
                  Upload New
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-xs text-gray-400 mb-2">
              Drag & drop an image, or
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMediaPickerOpen(true)}
                className="px-3 py-1.5 text-xs bg-cyan-700 hover:bg-cyan-600 text-white rounded transition-colors"
                data-testid="image-field-library-btn"
              >
                Media Library
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors"
                data-testid="image-field-upload-btn"
              >
                Upload
              </button>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
          data-testid="image-field-file-input"
        />
      </div>

      <MediaPickerDialog
        open={mediaPickerOpen}
        onOpenChange={setMediaPickerOpen}
        onSelect={handleMediaSelect}
        accept="image/*"
        title={label ? `Select Image: ${label}` : "Select Image from Media Library"}
      />
    </div>
  );
}
