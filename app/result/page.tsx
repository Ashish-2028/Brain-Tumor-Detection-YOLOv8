'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ImagePreview from '@/components/ImagePreview';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { PredictionResponse } from '@/types/api';
import { getTumorColorClass, getTumorBgColorClass, getTumorDescription } from '@/lib/utils';

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const resultData = localStorage.getItem('detectionResult');
    const imageData = localStorage.getItem('detectionImage');

    if (!resultData || !imageData) {
      router.push('/detect');
      return;
    }

    try {
      setResult(JSON.parse(resultData));
      setImageUrl(imageData);
    } catch (error) {
      console.error('Error loading results:', error);
      router.push('/detect');
    }
  }, [router]);

  const handleNewScan = () => {
    localStorage.removeItem('detectionResult');
    localStorage.removeItem('detectionImage');
    router.push('/detect');
  };

  if (!result || !imageUrl) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Brain Tumor Detection</h1>
                <p className="text-xs text-gray-500">AI-Powered Medical Analysis</p>
              </div>
            </Link>
            
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Analysis Complete
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Detection Results
          </h2>
          <p className="text-lg text-gray-600">
            AI-powered analysis of your brain MRI scan
          </p>
        </div>

        {/* Primary Result */}
        <Card className={`mb-6 border-2 ${getTumorBgColorClass(result.tumor_type)}`}>
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Detected Condition</h3>
            <div className={`text-5xl font-extrabold mb-4 ${getTumorColorClass(result.tumor_type)}`}>
              {result.tumor_type}
            </div>
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-gray-600 text-lg">Confidence:</span>
              <span className="text-3xl font-bold text-gray-900">
                {(result.confidence * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${result.confidence * 100}%` }}
              ></div>
            </div>
            <p className="text-gray-700 max-w-2xl mx-auto">
              {getTumorDescription(result.tumor_type)}
            </p>
          </div>
        </Card>

        {/* Image with Bounding Boxes */}
        <Card className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Annotated MRI Scan</h3>
          <ImagePreview imageUrl={imageUrl} boxes={result.boxes} alt="Detected tumor regions" />
        </Card>

        {/* Detection Details */}
        {result.boxes.length > 0 && (
          <Card className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Detection Details</h3>
            <div className="space-y-3">
              {result.boxes.map((box, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      box.label === 'Glioma' ? 'bg-blue-500' :
                      box.label === 'Pituitary' ? 'bg-green-500' :
                      box.label === 'Meningioma' ? 'bg-red-500' :
                      'bg-gray-500'
                    }`}></div>
                    <span className="font-semibold text-gray-900">{box.label}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">
                      {(box.score * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">
                      Region: ({Math.round(box.x1)}, {Math.round(box.y1)}) - ({Math.round(box.x2)}, {Math.round(box.y2)})
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Performance Stats */}
        <Card className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Analysis Information</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {result.boxes.length}
              </div>
              <div className="text-sm text-gray-600">Detections</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {result.inference_time?.toFixed(2)}s
              </div>
              <div className="text-sm text-gray-600">Processing Time</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {result.image_shape ? `${result.image_shape[1]}×${result.image_shape[0]}` : 'N/A'}
              </div>
              <div className="text-sm text-gray-600">Image Resolution</div>
            </div>
          </div>
        </Card>

        {/* Disclaimer */}
        <Card className="bg-yellow-50 border-2 border-yellow-200 mb-6">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="font-semibold text-yellow-900 mb-1">Medical Disclaimer</h4>
              <p className="text-sm text-yellow-800">
                This AI-powered analysis is for research and educational purposes only. 
                It should not be used as a substitute for professional medical diagnosis. 
                Always consult with qualified healthcare professionals for medical advice and diagnosis.
              </p>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button onClick={handleNewScan} fullWidth>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Analyze New Scan
          </Button>
          <Link href="/" className="flex-1">
            <Button variant="outline" fullWidth>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Back to Home
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
