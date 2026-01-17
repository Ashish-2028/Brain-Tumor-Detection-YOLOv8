'use client';

import { useEffect, useRef } from 'react';
import { BoundingBox } from '@/types/api';
import { drawBoundingBoxes } from '@/lib/utils';

interface ImagePreviewProps {
  imageUrl: string;
  boxes?: BoundingBox[];
  alt?: string;
}

export default function ImagePreview({ imageUrl, boxes = [], alt = 'MRI Image' }: ImagePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imageRef.current && canvasRef.current && boxes.length > 0) {
      const img = imageRef.current;
      const canvas = canvasRef.current;

      if (img.complete) {
        drawBoundingBoxes(canvas, img, boxes);
      } else {
        img.onload = () => {
          drawBoundingBoxes(canvas, img, boxes);
        };
      }
    }
  }, [imageUrl, boxes]);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <img
        ref={imageRef}
        src={imageUrl}
        alt={alt}
        className={`w-full h-auto rounded-lg ${boxes.length > 0 ? 'hidden' : ''}`}
      />
      {boxes.length > 0 && (
        <canvas
          ref={canvasRef}
          className="w-full h-auto rounded-lg border-2 border-gray-200"
        />
      )}
    </div>
  );
}
