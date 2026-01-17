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
    'Glioma': '#3B82F6',
    'Pituitary': '#10B981',
    'Meningioma': '#EF4444',
    'No Tumor': '#6B7280',
  };

  boxes.forEach((box) => {
    const color = colorMap[box.label] || '#FFFFFF';
    
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
    'Glioma': 'text-blue-500',
    'Pituitary': 'text-green-500',
    'Meningioma': 'text-red-500',
    'No Tumor': 'text-gray-500',
  };
  return colorMap[tumorType || ''] || 'text-gray-500';
}

export function getTumorBgColorClass(tumorType: string | null): string {
  const colorMap: Record<string, string> = {
    'Glioma': 'bg-blue-100 border-blue-300',
    'Pituitary': 'bg-green-100 border-green-300',
    'Meningioma': 'bg-red-100 border-red-300',
    'No Tumor': 'bg-gray-100 border-gray-300',
  };
  return colorMap[tumorType || ''] || 'bg-gray-100 border-gray-300';
}

export function getTumorDescription(tumorType: string | null): string {
  const descriptions: Record<string, string> = {
    'Glioma': 'A type of tumor that occurs in the brain and spinal cord. Gliomas begin in the glial cells that surround nerve cells.',
    'Pituitary': 'Tumors that form in the pituitary gland. Most pituitary tumors are noncancerous growths (adenomas).',
    'Meningioma': 'A tumor that arises from the meninges — the membranes that surround the brain and spinal cord.',
    'No Tumor': 'No tumor detected in the MRI scan. The brain tissue appears normal.',
  };
  return descriptions[tumorType || ''] || 'Unknown tumor type.';
}
