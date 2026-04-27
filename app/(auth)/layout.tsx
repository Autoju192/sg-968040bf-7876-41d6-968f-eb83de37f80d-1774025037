export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="text-white font-semibold text-xl">BidWriteIt</span>
          </div>
          <p className="text-slate-400 text-sm">AI-powered tender writing for UK care providers</p>
        </div>
        <div className="bg-white rounded-xl shadow-xl p-8">
          {children}
        </div>
      </div>
    </div>
  )
}
