import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 tracking-tight">NeuroSight AI</h1>
                <p className="text-sm font-medium text-indigo-600/80">Brain Tumor Detection</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
        <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-indigo-50 to-transparent -z-10" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl -z-10" />
        
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100/50 border border-indigo-200 text-indigo-800 rounded-full text-sm font-semibold mb-8 shadow-sm backdrop-blur-sm">
            <span className="w-2 h-2 bg-indigo-600 rounded-full animate-ping absolute"></span>
            <span className="w-2 h-2 bg-indigo-600 rounded-full relative"></span>
            Powered by Ultralytics YOLOv8
          </div>
          
          <h2 className="text-6xl sm:text-7xl font-black text-gray-900 mb-6 leading-[1.1] tracking-tight">
            Advanced MRI 
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Tumor Detection
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
            State-of-the-art deep learning technology for accurate detection and classification 
            of brain tumors from MRI scans using accelerated YOLOv8 architecture.
          </p>

          <Link
            href="/detect"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gray-900 hover:bg-indigo-600 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-xl hover:shadow-indigo-500/30 text-lg group"
          >
            <svg className="w-5 h-5 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Start Analysis
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20 relative z-10">
          <div className="bg-white/70 backdrop-blur-xl border border-gray-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">Fast & Accurate</h3>
            <p className="text-gray-600 font-medium leading-relaxed">
              Real-time detection with high precision powered by YOLOv8 Nano & Medium models
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-xl border border-gray-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">Multi-Class Detection</h3>
            <p className="text-gray-600 font-medium leading-relaxed">
              Identifies Glioma, Pituitary, Meningioma, and healthy brain tissue seamlessly
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-xl border border-gray-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">Switchable Architecture</h3>
            <p className="text-gray-600 font-medium leading-relaxed">
              Dynamically switch between Nano (speed) and Medium (accuracy) inference layers
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

        <div className="mt-20 text-center">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">Powered By Leading Tech</h3>
          <div className="flex flex-wrap justify-center gap-6 items-center">
            <div className="px-6 py-4 bg-white/50 border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all">
              <span className="font-bold text-gray-800 tracking-tight">YOLOv8 <span className="text-xs text-gray-500 font-medium">by Ultralytics</span></span>
            </div>
            <div className="px-6 py-4 bg-white/50 border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all">
              <span className="font-bold text-gray-800 tracking-tight">PyTorch</span>
            </div>
            <div className="px-6 py-4 bg-white/50 border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all">
              <span className="font-bold text-gray-800 tracking-tight">FastAPI</span>
            </div>
            <div className="px-6 py-4 bg-white/50 border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all">
              <span className="font-bold text-gray-800 tracking-tight">Next.js</span>
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
