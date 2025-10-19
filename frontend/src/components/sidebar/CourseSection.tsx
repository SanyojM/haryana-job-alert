import { Star, Heart } from 'lucide-react';
import Image from 'next/image';

const courses = [
  {
    id: 1,
    title: 'Railway NTPC Exam Course',
    thumbnailUrl: 'https://placehold.co/600x400/3b82f6/ffffff?text=Railway+NTPC&font=inter',
    description: 'One year validity | Recoded lectures | Previous year practice tests',
    rating: 4.1,
    reviews: 189,
    instructor: {
      name: 'Jaihind Sir',
      avatarUrl: 'https://placehold.co/40x40/e2e8f0/334155?text=JS',
    },
    price: {
      original: 999,
      current: 0,
    },
    offerEndsSoon: true,
    courseUrl: '#',
  },
  {
    id: 2,
    title: 'Foundation Vardi batch - RPF Constable course',
    thumbnailUrl: 'https://placehold.co/600x400/4f46e5/ffffff?text=Foundation+Vardi&font=inter',
    description: 'One year validity | Recoded lectures | Previous year practice tests',
    rating: 4.1,
    reviews: 189,
    instructor: {
      name: 'Jaihind Sir',
      avatarUrl: 'https://placehold.co/40x40/e2e8f0/334155?text=JS',
    },
    price: {
      original: 999,
      current: 0,
    },
    offerEndsSoon: true,
    courseUrl: '#',
  },
];

export default function CourseSection() {
  return (
    <section className="bg-gray-100 py-12">
      <div className="">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center mb-10">
          Courses
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
          {courses.map((course) => (
            <div key={course.id} className="bg-white p-2 rounded-2xl overflow-hidden flex flex-col">
              <div className="relative">
                <a href={course.courseUrl}>
                  <Image
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-auto object-cover aspect-video rounded-2xl"
                    width={600}
                    height={400}
                    unoptimized
                  />
                </a>
              </div>

              <div className="py-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-md font-bold text-gray-800 leading-tight">
                        <a href={course.courseUrl}>{course.title}</a>
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-gray-600 flex-shrink-0 ml-2">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className='text-xs'>{course.rating} ({course.reviews})</span>
                    </div>
                </div>
                <p className="text-xs text-gray-500 mb-3">{course.description}</p>
                
                <div className="flex items-center gap-2 mb-4">
                    <Image src={course.instructor.avatarUrl} alt={course.instructor.name} className="w-7 h-7 rounded-full" width={40} height={40} unoptimized />
                    <span className="text-xs text-gray-700">By {course.instructor.name}</span>
                </div>

                <div className="flex flex-col gap-3 mb-5">
                  <div>
                    <span className="text-2xl font-bold text-gray-800">
                      {course.price.current === 0 ? 'FREE' : `₹${course.price.current}`}
                    </span>
                    <span className="text-gray-400 line-through">₹{course.price.original}</span>
                  </div>
                    {course.offerEndsSoon && (
                      <span className="text-xs font-semibold bg-green-100 text-green-700 px-2.5 py-2 rounded-md">
                        Free offer will end soon
                      </span>
                    )}
                </div>

                <div className="mt-auto flex items-center gap-3">
                  <a
                    href={course.courseUrl}
                    className="flex-grow bg-gradient-to-r from-red-600 to-gray-800 text-white text-center rounded-lg px-2 py-3 font-semibold text-xs inline-flex items-center justify-center hover:opacity-90 transition-opacity"
                  >
                    View Course
                  </a>
                  <button className="p-3 rounded-lg bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-500 transition-colors">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <button className="bg-gray-100 border-2 border-gray-300 rounded-xl w-full text-sm py-3 font-semibold text-gray-800 hover:bg-gray-100 hover:border-gray-400 transition-all shadow-sm">
            View More
          </button>
        </div>
      </div>
    </section>
  );
}
