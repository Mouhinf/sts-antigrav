export default function GlobalLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center">
        {/* Logo animation */}
        <div className="relative w-16 h-16 mb-4">
          <div className="absolute inset-0 border-4 border-sts-primary/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-sts-primary rounded-full border-t-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sts-primary font-bold text-lg">STS</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm animate-pulse">
          Chargement...
        </p>
      </div>
    </div>
  );
}
