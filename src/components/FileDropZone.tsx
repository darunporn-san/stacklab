import { useState, useRef, DragEvent, ReactNode } from "react";
import { Upload } from "lucide-react";

interface FileDropZoneProps {
  accept?: string;
  onFile: (file: File) => void;
  children?: ReactNode;
  className?: string;
}

export function FileDropZone({ accept, onFile, children, className = "" }: FileDropZoneProps) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFile(file);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={() => setDragging(false)}
      onClick={() => inputRef.current?.click()}
      className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 transition-colors ${
        dragging ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/40"
      } ${className}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
          e.target.value = "";
        }}
      />
      {children ?? (
        <>
          <Upload className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Drop a file here or click to browse</p>
        </>
      )}
    </div>
  );
}
