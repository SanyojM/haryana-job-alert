import { Youtube, Instagram, Phone } from 'lucide-react';

export default function FloatingSocials() {
  return (
    <div className="fixed top-[45%] left-0 -translate-y-1/2 z-50">
      <div className="bg-white p-2 rounded-r-2xl shadow-lg border-t border-r border-b border-gray-200/80">
        <div className="flex flex-col items-center gap-3">
          <a
            href="#"
            aria-label="YouTube"
            className="w-12 h-12 flex items-center justify-center bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
          >
            <Youtube size={24} />
          </a>
          <a
            href="#"
            aria-label="Instagram"
            className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-600 to-yellow-500 text-white rounded-full hover:opacity-90 transition-opacity"
          >
            <Instagram size={24} />
          </a>
          <a
            href="#"
            aria-label="Contact"
            className="w-12 h-12 flex items-center justify-center bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
          >
            <Phone size={24} />
          </a>
        </div>
      </div>
    </div>
  );
}
