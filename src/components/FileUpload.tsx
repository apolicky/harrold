import { useRef, useState, DragEvent, ChangeEvent } from "react";

interface Props {
  onFile: (text: string, filename: string) => void;
  onError: (message: string) => void;
}

export function FileUpload({ onFile, onError }: Props) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function readFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === "string") onFile(result, file.name);
    };
    reader.onerror = () => onError(`Could not read file "${file.name}"`);
    reader.readAsText(file);
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) readFile(file);
  }

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) readFile(file);
  }

  return (
    <div
      className={`upload-zone ${dragging ? "upload-zone--active" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".har,application/json"
        style={{ display: "none" }}
        onChange={onChange}
      />
      <div className="upload-icon">📁</div>
      <p className="upload-primary">Drop a HAR file here or click to browse</p>
    </div>
  );
}
