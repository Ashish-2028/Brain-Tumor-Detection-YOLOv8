import { BoundingBox } from '@/types/api';

export function drawBoundingBoxes(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  boxes: BoundingBox[]
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;

  ctx.drawImage(image, 0, 0);

  const colorMap: Record<string, string> = {
    'glioma': '#3B82F6',
    'pituitary': '#10B981',
    'meningioma': '#EF4444',
    'no tumor': '#6B7280',
  };

  boxes.forEach((box) => {
    const color = colorMap[box.label.toLowerCase()] || '#FFFFFF';
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.strokeRect(box.x1, box.y1, box.x2 - box.x1, box.y2 - box.y1);

    const label = `${box.label}: ${(box.score * 100).toFixed(1)}%`;
    ctx.font = 'bold 16px sans-serif';
    const textMetrics = ctx.measureText(label);
    const textHeight = 20;

    ctx.fillStyle = color;
    ctx.fillRect(
      box.x1,
      box.y1 - textHeight - 4,
      textMetrics.width + 10,
      textHeight + 4
    );

    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(label, box.x1 + 5, box.y1 - 8);
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 10 * 1024 * 1024;

  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload a JPEG, PNG, or WebP image.',
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File too large. Maximum size is 10MB.',
    };
  }

  return { valid: true };
}

export function getTumorColorClass(tumorType: string | null): string {
  const colorMap: Record<string, string> = {
    'glioma': 'text-blue-500',
    'pituitary': 'text-green-500',
    'meningioma': 'text-red-500',
    'no tumor': 'text-gray-500',
  };
  return colorMap[(tumorType || '').toLowerCase()] || 'text-gray-500';
}

export function getTumorBgColorClass(tumorType: string | null): string {
  const colorMap: Record<string, string> = {
    'glioma': 'bg-blue-100 border-blue-300',
    'pituitary': 'bg-green-100 border-green-300',
    'meningioma': 'bg-red-100 border-red-300',
    'no tumor': 'bg-gray-100 border-gray-300',
  };
  return colorMap[(tumorType || '').toLowerCase()] || 'bg-gray-100 border-gray-300';
}

export function getTumorDescription(tumorType: string | null): string {
  const descriptions: Record<string, string> = {
    'glioma': 'A type of tumor that occurs in the brain and spinal cord. Gliomas begin in the glial cells that surround nerve cells.',
    'pituitary': 'Tumors that form in the pituitary gland. Most pituitary tumors are noncancerous growths (adenomas).',
    'meningioma': 'A tumor that arises from the meninges — the membranes that surround the brain and spinal cord.',
    'no tumor': 'No tumor detected in the MRI scan. The brain tissue appears normal.',
  };
  return descriptions[(tumorType || '').toLowerCase()] || 'Unknown tumor type.';
}
