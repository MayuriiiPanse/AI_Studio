import { useCallback, useRef, useState } from "react";
import { UploadCloud, ImageIcon } from "lucide-react";
import styles from "./Dropzone.module.css";

export default function Dropzone({ onFile, preview, disabled }) {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = useCallback(
    (files) => {
      const file = files?.[0];
      if (file && file.type.startsWith("image/")) {
        onFile(file);
      }
    },
    [onFile]
  );

  return (
    <div
      className={[styles.zone, dragActive ? styles.active : "", disabled ? styles.disabled : ""].join(" ")}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragActive(false);
        if (!disabled) handleFiles(e.dataTransfer.files);
      }}
      onClick={() => !disabled && inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && !disabled && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        disabled={disabled}
        onChange={(e) => handleFiles(e.target.files)}
      />
      {preview ? (
        <img src={preview} alt="Selected upload preview" className={styles.preview} />
      ) : (
        <div className={styles.placeholder}>
          <div className={styles.iconWrap}>
            <UploadCloud size={22} strokeWidth={1.6} />
          </div>
          <p className={styles.title}>Drop an image, or click to browse</p>
          <p className={styles.hint}>JPG or PNG · this becomes the source for every generated format</p>
        </div>
      )}
      {preview && (
        <div className={styles.overlay}>
          <ImageIcon size={16} />
          <span>Click to replace</span>
        </div>
      )}
    </div>
  );
}
