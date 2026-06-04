import { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../lib/api';

function formatBytes(bytes) {
  if (!Number.isFinite(bytes)) return '';
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  let v = bytes;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export default function ResumeManagerPage() {
  const fileInputRef = useRef(null);
  const timeoutRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [analyzeState, setAnalyzeState] = useState('');

  // UI-only progress animation (hook up to backend later)
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const MAX_BYTES = 20 * 1024 * 1024; // 20MB (UI note)

  const acceptedText = useMemo(() => 'PDF, DOC, DOCX', []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    api.profile.getMe().then(res => {
      if (res?.resumeUrl) {
        setPreviewUrl(res.resumeUrl);
      }
    }).catch(console.error);
  }, []);

  const cleanupPreview = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const buildPreview = useCallback(
    (file) => {
      cleanupPreview();
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    },
    [cleanupPreview]
  );

  const validateFile = useCallback(
    (file) => {
      if (!file) return { ok: false, reason: 'No file selected.' };

      const name = file.name?.toLowerCase() || '';
      const isAllowed =
        name.endsWith('.pdf') || name.endsWith('.doc') || name.endsWith('.docx');

      if (!isAllowed) {
        return {
          ok: false,
          reason: 'Unsupported format. Upload PDF, DOC, or DOCX.',
        };
      }

      if (file.size > MAX_BYTES) {
        return {
          ok: false,
          reason: `File too large. Max size is ${formatBytes(MAX_BYTES)}.`,
        };
      }

      return { ok: true };
    },
    [MAX_BYTES]
  );

  const uploadFile = useCallback(async (file) => {
    setIsUploading(true);
    setUploadProgress(20);

    try {
      const formData = new FormData();
      formData.append('resume', file);
      
      const res = await api.upload.resume(formData);
      setUploadProgress(100);
      if (res?.resumeUrl) {
        setPreviewUrl(res.resumeUrl);
      }
    } catch (err) {
      alert(err.message || 'Upload failed');
    } finally {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setAnalyzeState('done');
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setAnalyzeState(''), 3000);
      }, 1500);
      setIsUploading(false);
    }
  }, []);

  const onPickFile = useCallback(
    (file) => {
      const result = validateFile(file);
      if (!result.ok) {
        alert(result.reason);
        return;
      }

      setSelectedFile(file);
      buildPreview(file);
      uploadFile(file);
    },
    [buildPreview, uploadFile, validateFile]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const file = e.dataTransfer?.files?.[0];
      if (file) onPickFile(file);
    },
    [onPickFile]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const chooseFile = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const onInputChange = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (file) onPickFile(file);
    },
    [onPickFile]
  );

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.5rem',
      }}>
        <div>
          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: '1.6rem',
            fontWeight: 800,
            color: '#F8FAFC',
            marginBottom: '0.25rem',
          }}>
            Resume Management
          </h1>
          <p style={{ color: '#8892A4', fontSize: '0.9rem' }}>
            Upload your latest resume and keep your preview up to date.
          </p>
        </div>
        <span style={{
          background: 'rgba(108,99,255,0.15)',
          color: '#6C63FF',
          border: '1px solid rgba(108,99,255,0.3)',
          borderRadius: '2rem',
          padding: '0.35rem 0.9rem',
          fontSize: '0.8rem',
          fontWeight: 600,
        }}>
          Premium • Version-ready
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: previewUrl ? '1fr 1fr' : '1fr',
        gap: '1.5rem',
      }}>
        {/* Upload Section */}
        <motion.div
          className="panel"
          initial={false}
          animate={isDragging ? { scale: 1.01 } : { scale: 1 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          style={{ padding: '1.5rem' }}
        >
          <h4 style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            fontSize: '0.95rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#F8FAFC',
          }}>
            ⬆️ Upload Resume
          </h4>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={onInputChange}
            style={{ display: 'none' }}
          />

          {/* Dropzone */}
          <button
            type="button"
            onClick={chooseFile}
            style={{
              width: '100%',
              border: `2px dashed ${isDragging ? '#6C63FF' : 'rgba(108,99,255,0.2)'}`,
              borderRadius: '1rem',
              padding: '3rem 1.5rem',
              textAlign: 'center',
              background: isDragging ? 'rgba(108,99,255,0.08)' : 'transparent',
              cursor: 'pointer',
              transition: '0.2s',
              color: '#F8FAFC',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📤</div>
            <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Drop your resume here</div>
            <div style={{ color: '#8892A4', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
              Supported formats: <b>{acceptedText}</b>
            </div>
            <div style={{ color: '#8892A4', fontSize: '0.8rem', marginBottom: '1rem' }}>
              Max file size: <b>{formatBytes(MAX_BYTES)}</b>
            </div>
            <span className="btn-outline" style={{
              display: 'inline-block',
              fontSize: '0.85rem',
              padding: '0.5rem 1rem',
            }}>
              Browse Files
            </span>
          </button>

          {/* File info & progress */}
          <div style={{ marginTop: '1rem' }}>
            {selectedFile ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem',
                background: '#1C2340',
                borderRadius: '0.75rem',
              }}>
                <span>📄</span>
                <span style={{ fontSize: '0.85rem', color: '#F8FAFC' }}>{selectedFile.name}</span>
                <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: '#8892A4' }}>
                  {formatBytes(selectedFile.size)}
                </span>
                {!isUploading && uploadProgress === 100 && (
                  <span style={{ color: '#4ade80', fontSize: '0.75rem' }}>✓ Uploaded</span>
                )}
              </div>
            ) : (
              <div style={{ fontSize: '0.8rem', color: '#8892A4' }}>
                Upload a file to see progress and enable preview.
              </div>
            )}

            <AnimatePresence>
              {selectedFile ? (
                <motion.div
                  key="progress"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.22 }}
                  style={{ marginTop: '0.75rem' }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.8rem',
                    marginBottom: '0.35rem',
                  }}>
                    <span style={{ color: '#8892A4' }}>
                      {isUploading ? 'Uploading…' : 'Ready'}
                    </span>
                    <span style={{ color: '#6C63FF', fontWeight: 600 }}>{uploadProgress}%</span>
                  </div>
                  <div style={{
                    height: '6px',
                    background: 'rgba(108,99,255,0.15)',
                    borderRadius: '3px',
                    overflow: 'hidden',
                  }}>
                    <motion.div
                      initial={{ width: '0%' }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      style={{
                        height: '100%',
                        background: 'linear-gradient(90deg, #6C63FF, #00D4FF)',
                        borderRadius: '3px',
                      }}
                    />
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Preview Section */}
        {previewUrl && (
          <div className="panel" style={{ padding: '1.5rem' }}>
            <h4 style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: '0.95rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#F8FAFC',
            }}>
              📄 Preview
            </h4>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
            }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#F8FAFC' }}>
                  {selectedFile?.name || 'Resume'}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#8892A4' }}>
                  {selectedFile ? formatBytes(selectedFile.size) : ''} • Latest version
                </div>
              </div>
              <span style={{
                background: 'rgba(74,222,128,0.15)',
                color: '#4ade80',
                borderRadius: '2rem',
                padding: '0.2rem 0.7rem',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}>
                Live
              </span>
            </div>

            {/* PDF or fallback */}
            {selectedFile?.name?.toLowerCase().endsWith('.pdf') ? (
              <iframe
                src={previewUrl}
                title="Resume PDF preview"
                style={{
                  width: '100%',
                  height: '400px',
                  border: '1px solid rgba(108,99,255,0.2)',
                  borderRadius: '0.75rem',
                  background: '#1C2340',
                }}
              />
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                background: '#1C2340',
                borderRadius: '0.75rem',
                border: '1px solid rgba(108,99,255,0.2)',
              }}>
                <div style={{ fontWeight: 600, color: '#F8FAFC', marginBottom: '0.5rem' }}>
                  Preview available for PDFs
                </div>
                <div style={{ fontSize: '0.85rem', color: '#8892A4' }}>
                  This browser may not render DOC/DOCX previews. Your file is stored for later viewing.
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div style={{
              display: 'flex',
              gap: '0.75rem',
              justifyContent: 'center',
              marginTop: '1rem',
            }}>
              <a
                href={previewUrl}
                download
                className="btn-primary"
                style={{
                  fontSize: '0.85rem',
                  padding: '0.6rem 1.25rem',
                  textDecoration: 'none',
                }}
              >
                ⬇️ Download
              </a>
              <button
                className="btn-outline"
                onClick={chooseFile}
                style={{ fontSize: '0.85rem', padding: '0.6rem 1.25rem' }}
              >
                🔄 Replace
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
