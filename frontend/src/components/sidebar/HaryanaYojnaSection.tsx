import { ArrowUpRight, Bookmark, Send } from 'lucide-react';
import AdBanner from '../shared/AdBanner';
import Image from 'next/image';

function getYouTubeVideoId(url: string): string | null {
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regExp);
  return (match && match[1]?.length === 11) ? match[1] : null;
}

const yojnaVideos = [
  {
    id: 1,
    videoUrl: 'https://youtu.be/QatCH83cCso?si=TfCmfPFoGJGuCxZp',
    title: 'हरियाणा सरकार 3 बड़ी घोषणा', 
  },
  {
    id: 2,
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 
    title: 'हरियाणा में महिलाओं को मिलेंगे ₹2100', 
  },
];

export default function HaryanaYojnaSection() {
  return (
    <section className="bg-gray-100">
      <div className="">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
          Haryana Yojna
        </h2>

        <div className="grid grid-cols-1 gap-8">
          {yojnaVideos.map((video) => {
            const videoId = getYouTubeVideoId(video.videoUrl);
            const thumbnailUrl = videoId
              ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
              : 'https://placehold.co/600x400/cccccc/333333?text=Video+Unavailable';

            return (
              <div key={video.id} className="rounded-2xl overflow-hidden p-2 bg-white">
                <a href={video.videoUrl} target="_blank" rel="noopener noreferrer">
                  <Image
                    src={thumbnailUrl} 
                    alt={video.title}
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover aspect-video rounded-2xl"
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/600x400/cccccc/333333?text=Thumbnail+Error';
                    }}
                    unoptimized
                  />
                </a>

                <div className="py-2 flex items-center justify-between gap-2">
                  <a
                    href={video.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-grow bg-black text-white text-center rounded-lg p-2.5 font-medium text-[10px] text-wrap inline-flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
                  >
                    View Yojna
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                  <div className="flex items-center gap-2">
                      <button className="p-2.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-black transition-colors">
                          <Bookmark className="w-3 h-3" />
                      </button>
                      <button className="p-2.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-black transition-colors">
                          <Send className="w-3 h-3" />
                      </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-8 mb-8">
          <button className="bg-gray-100 border-2 border-gray-300 rounded-xl w-full py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100 hover:border-gray-400 transition-all ">
            View all Yojna
          </button>
        </div>

        <AdBanner text="Google Ad Section" className="h-88" />

        <div className="grid grid-cols-1 gap-8 mt-12">
          {yojnaVideos.map((video) => {
            const videoId = getYouTubeVideoId(video.videoUrl);
            const thumbnailUrl = videoId
              ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
              : 'https://placehold.co/600x400/cccccc/333333?text=Video+Unavailable';

            return (
              <div key={video.id} className="rounded-2xl overflow-hidden p-2 bg-white">
                <a href={video.videoUrl} target="_blank" rel="noopener noreferrer">
                  <Image
                    src={thumbnailUrl} 
                    alt={video.title}
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover aspect-video rounded-2xl"
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/600x400/cccccc/333333?text=Thumbnail+Error';
                    }}
                    unoptimized
                  />
                </a>

                <div className="py-2 flex items-center justify-between gap-2">
                  <a
                    href={video.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-grow bg-black text-white text-center rounded-lg p-2.5 font-medium text-wrap text-[10px] inline-flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
                  >
                    View Yojna
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                  <div className="flex items-center gap-2">
                      <button className="p-2.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-black transition-colors">
                          <Bookmark className="w-3 h-3" />
                      </button>
                      <button className="p-2.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-black transition-colors">
                          <Send className="w-3 h-3" />
                      </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

