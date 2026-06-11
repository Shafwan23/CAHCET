/**
 * fileService.js — File & Image Management
 * Handles base64 storage for now; easily replaceable with S3/Cloudinary/Firebase Storage.
 */

const FILES_KEY_PREFIX = 'cahcet_files_';
const MAX_FILE_SIZE_MB = 10;

export const FILE_TYPES = {
  IMAGE: 'image',
  PDF: 'pdf',
  DOCUMENT: 'document',
};

export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
export const ACCEPTED_DOC_TYPES = ['application/pdf', 'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

/* ─── Internal helpers ─── */

function filesKey(deptKey) {
  return `${FILES_KEY_PREFIX}${deptKey || 'global'}`;
}

function loadFiles(deptKey) {
  try {
    const raw = localStorage.getItem(filesKey(deptKey));
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function saveFiles(deptKey, files) {
  localStorage.setItem(filesKey(deptKey), JSON.stringify(files));
}

/* ─── Public API ─── */

export const fileService = {
  /**
   * Upload a file (converts to base64 for localStorage).
   * Returns a file record object.
   */
  async upload(file, deptKey = null, folder = 'general') {
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      throw new Error(`File too large. Max size is ${MAX_FILE_SIZE_MB}MB.`);
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const record = {
            id: `file_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
            name: file.name,
            type: file.type,
            size: file.size,
            folder,
            deptKey,
            url: reader.result, // base64 data URL
            uploadedAt: new Date().toISOString(),
          };
          const files = loadFiles(deptKey);
          saveFiles(deptKey, [record, ...files]);
          resolve(record);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file.'));
      reader.readAsDataURL(file);
    });
  },

  /** Get all files for a department, optionally filtered by folder */
  getFiles(deptKey, folder = null) {
    const files = loadFiles(deptKey);
    if (folder) return files.filter(f => f.folder === folder);
    return files;
  },

  /** Delete a file by id */
  deleteFile(deptKey, fileId) {
    const files = loadFiles(deptKey).filter(f => f.id !== fileId);
    saveFiles(deptKey, files);
  },

  /** Get file by id */
  getFile(deptKey, fileId) {
    return loadFiles(deptKey).find(f => f.id === fileId) || null;
  },

  /** Format file size for display */
  formatSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  },

  /** Check if file is an image */
  isImage(file) {
    return ACCEPTED_IMAGE_TYPES.includes(file.type);
  },

  /** Resize/compress image before storing (canvas-based) */
  async compressImage(file, maxWidthPx = 1200, quality = 0.85) {
    if (!fileService.isImage(file)) return file;
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const canvas = document.createElement('canvas');
        const scale = Math.min(1, maxWidthPx / img.width);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          blob => resolve(new File([blob], file.name, { type: 'image/jpeg' })),
          'image/jpeg',
          quality
        );
      };
      img.src = url;
    });
  },
};
