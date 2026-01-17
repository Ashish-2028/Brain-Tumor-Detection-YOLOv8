import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Brain Tumor Detection</h1>
                <p className="text-xs text-gray-500">AI-Powered Medical Analysis</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
            Enhanced YOLOv7 with CBAM Attention
          </div>
          
          <h2 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            Advanced Brain Tumor
            <br />
            <span className="text-blue-600">Detection System</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            State-of-the-art deep learning technology for accurate detection and classification 
            of brain tumors from MRI scans using enhanced YOLOv7 architecture.
          </p>

          <Link
            href="/detect"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Start Detection
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Fast & Accurate</h3>
            <p className="text-gray-600">
              Real-time detection with high accuracy using enhanced YOLOv7 architecture
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Multi-Class Detection</h3>
            <p className="text-gray-600">
              Identifies Glioma, Pituitary, Meningioma, and healthy brain tissue
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Advanced Architecture</h3>
            <p className="text-gray-600">
              Enhanced with CBAM attention, BiFPN neck, and SPPF+ modules
            </p>
          </div>
        </div>

        {/* Tumor Types */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Detectable Tumor Types</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-4 border-2 border-blue-200 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-blue-600">G</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Glioma</h4>
              <p className="text-xs text-gray-500">Brain & spinal cord tumors</p>
            </div>

            <div className="text-center p-4 border-2 border-green-200 rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-green-600">P</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Pituitary</h4>
              <p className="text-xs text-gray-500">Pituitary gland tumors</p>
            </div>

            <div className="text-center p-4 border-2 border-red-200 rounded-lg">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-red-600">M</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Meningioma</h4>
              <p className="text-xs text-gray-500">Meninges membrane tumors</p>
            </div>

            <div className="text-center p-4 border-2 border-gray-200 rounded-lg">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-gray-600">✓</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">No Tumor</h4>
              <p className="text-xs text-gray-500">Healthy brain tissue</p>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-16 text-center">
          <h3 className="text-lg font-semibold text-gray-500 mb-6">Powered By</h3>
          <div className="flex flex-wrap justify-center gap-8 items-center">
            <div className="px-6 py-3 bg-white rounded-lg shadow">
              <span className="font-bold text-gray-700">YOLOv7</span>
            </div>
            <div className="px-6 py-3 bg-white rounded-lg shadow">
              <span className="font-bold text-gray-700">PyTorch</span>
            </div>
            <div className="px-6 py-3 bg-white rounded-lg shadow">
              <span className="font-bold text-gray-700">FastAPI</span>
            </div>
            <div className="px-6 py-3 bg-white rounded-lg shadow">
              <span className="font-bold text-gray-700">Next.js 14</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-500 text-sm">
            © 2026 Brain Tumor Detection System. Research & Educational Purpose.
          </p>
        </div>
      </footer>
    </div>
  );
}
