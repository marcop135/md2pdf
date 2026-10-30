import { useEffect, useRef, useState } from 'react';
import { classifyImport, textForImport } from '../../Lib/importFile.js';

function useDrop(ref, onLoad = () => {}) {
  const [uploading, setUploading] = useState(false);
  const [isOver, setOver] = useState(false);
  // In-flight guard read/written synchronously so a fresh closure isn't
  // needed; keeps `uploading`/`isOver` out of the effect deps so listeners
  // aren't torn down and re-added on every dragover during a drag.
  const uploadingRef = useRef(false);
  const stopDefault = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  useEffect(() => {
    const dragLeaveHandler = (e) => {
      setOver(false);
      stopDefault(e);
    };
    const dragOverHandler = (e) => {
      setOver(true);
      stopDefault(e);
    };
    const dropHandler = (e) => {
      setOver(false);
      stopDefault(e);
      uploadHandler(e.dataTransfer.files);
    };

    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

    const finishUpload = () => {
      uploadingRef.current = false;
      setUploading(false);
    };

    const uploadHandler = (files) => {
      const file = files && files[0];
      const kind = file && file.name ? classifyImport(file.name) : null;
      if (
        file &&
        kind &&
        file.size <= MAX_FILE_SIZE &&
        !uploadingRef.current
      ) {
        const reader = new FileReader();
        reader.onload = (e) => {
          finishUpload();
          onLoad(textForImport(kind, e.target.result));
        };
        reader.onerror = finishUpload;
        reader.onabort = finishUpload;
        uploadingRef.current = true;
        setUploading(true);
        reader.readAsText(files[0]);
      }
    };
    const target = ref.current;
    if (!target) return;
    target.addEventListener('dragenter', stopDefault, true);
    target.addEventListener('dragover', dragOverHandler, true);
    target.addEventListener('dragleave', dragLeaveHandler, true);
    target.addEventListener('drop', dropHandler, true);
    return () => {
      target.removeEventListener('dragenter', stopDefault, true);
      target.removeEventListener('dragover', dragOverHandler, true);
      target.removeEventListener('dragleave', dragLeaveHandler, true);
      target.removeEventListener('drop', dropHandler, true);
    };
  }, [ref, onLoad]);
  return [uploading, isOver];
}

export default useDrop;
