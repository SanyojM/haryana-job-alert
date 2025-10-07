import { Star, Heart } from 'lucide-react';
import AdBanner from './AdBanner';
import Link from 'next/link';
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
    {
        id: 3,
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
            <div>
                <div className="text-center mb-20">
                    <Image
                        src="/courses.png"
                        alt="Mock Tests"
                        className="inline-block h-20 w-auto"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {courses.map((course) => (
                        <div key={course.id} className="bg-gray-100 rounded-2xl overflow-hidden flex flex-col">
                            <div className="relative">
                                <a href={course.courseUrl}>
                                    <Image
                                        src={course.thumbnailUrl}
                                        alt={course.title}
                                        className="w-full h-auto object-cover aspect-video rounded-2xl"
                                    />
                                </a>
                            </div>

                            <div className="py-5 px-1 flex flex-col flex-grow justify-between">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-gray-800 leading-tight">
                                        <a href={course.courseUrl}>{course.title}</a>
                                    </h3>
                                    <div className="flex items-center gap-1 text-sm text-gray-600 flex-shrink-0 ml-2">
                                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                        <span>{course.rating} ({course.reviews})</span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 mb-3">{course.description}</p>

                                <div className="flex items-center gap-2 mb-4">
                                    <Image src={course.instructor.avatarUrl} alt={course.instructor.name} className="w-7 h-7 rounded-full" />
                                    <span className="text-sm text-gray-700">By {course.instructor.name}</span>
                                </div>

                                <div className="flex items-center gap-3 mb-5">
                                    <span className="text-2xl font-bold text-gray-800">
                                        {course.price.current === 0 ? 'FREE' : `₹${course.price.current}`}
                                    </span>
                                    <span className="text-gray-400 line-through">₹{course.price.original}</span>
                                    {course.offerEndsSoon && (
                                        <span className="text-xs font-semibold bg-green-100 text-green-700 px-2.5 py-1 rounded-md">
                                            Free offer will end soon
                                        </span>
                                    )}
                                </div>

                                <div className="mt-auto flex items-center gap-3">
                                    <Link
                                        href={`/courses/${course.id}`}
                                        className="flex-grow bg-gradient-to-r from-red-600 to-gray-800 text-white text-center rounded-lg px-4 py-3 font-semibold text-sm inline-flex items-center justify-center hover:opacity-90 transition-opacity"
                                    >
                                        View Course
                                    </Link>
                                    <button className="p-3 rounded-lg bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-500 transition-colors">
                                        <Heart className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <button className="bg-gray-100 border-2 border-gray-300 rounded-xl px-12 py-3 font-semibold text-gray-800 hover:bg-gray-100 hover:border-gray-400 transition-all shadow-sm">
                        View More
                    </button>
                </div>
                <div className='mt-10 md:hidden'>
                    <AdBanner text="Google Ads Section" className="h-32" />
                </div>
            </div>
        </section>
    );
}
