import {
  ArrowUpRight,
  Newspaper,
  ShieldCheck,
  FilePlus,
  Heart,
  Trophy,
  File,
  FileAxis3DIcon,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import Link from "next/link"; // Import the Link component
import { Post } from "@/pages/admin/posts"; // Import the Post type

// An array of colors to cycle through for a dynamic but consistent look
const colors = [
  "from-[#9B2821] to-[#EB2139]",
  "from-[#0C342B] to-[#1D6F50]",
  "from-[#1c1e47] via-[#2b2d6c] to-[#34387e]",
  "from-pink-500 to-purple-500",
  "from-blue-600 to-indigo-500",
  "from-[#f12711] to-[#f5af19]",
  "from-[#4025CA] to-[#6b50d8]",
  "from-teal-700 to-teal-500",
];

const features = [
  {
    icon: Newspaper,
    title: "Current Affairs",
    subtitle: "Daily Learning Content",
  },
  {
    icon: ShieldCheck,
    title: "Quality Mock Tests",
    subtitle: "Test your Knowledge",
  },
  {
    icon: File,
    title: "Exclusive Courses",
    subtitle: "Enroll Now (Designed for You)",
  },
  {
    icon: Trophy,
    title: "We Deliver Quality",
    subtitle: "Quality Information",
  },
];

// The component now accepts a 'posts' prop
export default function PostsSection({ posts }: { posts: Post[] }) {
  return (
    <section className="bg-white px-2">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-3 lg:grid-cols-4 gap-1 md:gap-2">
          {/* We now map over the 'posts' from the props */}
          {posts.slice(0, 8).map(
            (
              post,
              index // Show up to 8 posts
            ) => (
              <Link
                key={post.id}
                href={`/posts/${post.slug}`} // Use the dynamic slug for the link
                passHref
                legacyBehavior
              >
                <a
                  className={`shine relative py-4 sm:py-5 px-2 rounded-lg sm:rounded-xl flex items-center justify-center text-white overflow-hidden shadow-lg hover:scale-105 transition-transform text-center duration-300 bg-gradient-to-r ${
                    colors[index % colors.length]
                  } ${index >= 6 ? "hidden lg:flex" : ""}`} // Hide posts 7 and 8 on mobile
                >
                  <div className="relative z-10">
                    <h3 className="font-semibold text-[12px] md:text-[15px] leading-tight overflow-hidden line-clamp-3 md:line-clamp-2">
                      {post.title}
                    </h3>
                    {/* The 'count' property doesn't exist on our dynamic posts, so it's removed */}
                  </div>
                  <div className="absolute top-1 right-1 w-5 h-5 bg-white/20 rounded-full items-center justify-center group-hover:opacity-100 transition-opacity sm:flex hidden">
                    <ArrowUpRight className="w-4 h-4 text-white" />
                  </div>
                </a>
              </Link>
            )
          )}
        </div>

        {/* <div className="bg-[#0d0625] rounded-full px-2 py-4 shadow-xl hidden md:block mt-8">
            <div className="flex items-center justify-between gap-4 px-4">
                {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 text-white justify-center w-full">
                        <div className="flex-grow-0">
                            <feature.icon className="w-7 h-7 text-[#8c52ff]" />
                        </div>
                        <div className='w-full'>
                            <p className="text-[13px] leading-tight">{feature.title}</p>
                            <p className="text-[10px] text-gray-400">{feature.subtitle}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div> */}

        <h1 className="text-3xl font-bold my-8 text-center">
          Statewise Vacancies
        </h1>

        <div className="bg-white">
          {(() => {
            const states = [
              "Haryana",
              "Punjab",
              "Uttar Pradesh",
              "Bihar",
              "Rajasthan",
              "Odisha",
              "Chhattisgarh",
              "West Bengal",
              "Uttarakhand",
              "Jharkhand",
              "Assam",
              "Manipur",
              "Meghalaya",
              "Mizoram",
              "Nagaland",
              "Sikkim",
              "Tripura",
              "Gujarat",
              "Goa",
              "Kerala",
              "Tamil Nadu",
              "Delhi",
              "Chandigarh",
              "Jammu and Kashmir",
              "Himachal Pradesh",
              "Madhya Pradesh",
              "Arunachal Pradesh",
            ];

            const colors = [
              "from-[#9B2821] to-[#EB2139]",
              "from-[#0C342B] to-[#1D6F50]",
              "from-[#1c1e47] via-[#2b2d6c] to-[#34387e]",
            ];

            return (
              <>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  <input
                    id="toggle-states"
                    type="checkbox"
                    title="Show More"
                    className="hidden peer"
                  />

                  {states.map((state, idx) => (
                    <Link
                      key={state}
                      href={`/category/latest-jobs?state=${encodeURIComponent(
                        state.toLowerCase()
                      )}`}
                      className={`px-3 mb-0 py-2 rounded-lg flex-1 text-center text-sm font-medium transition-colors bg-gradient-to-b text-white truncate
                        ${colors[idx % colors.length]}
                        ${idx >= 6 && idx < 12 ? "hidden lg:block peer-checked:block" : ""}
                        ${idx >= 12 ? "hidden peer-checked:block" : ""}
                        ${idx >= states.length - 3 ? "sm:col-span-2" : ""}
                      `}
                    >
                      {state}
                    </Link>
                  ))}
                  {states.length > 6 && (
                    <>
                      <label
                        htmlFor="toggle-states"
                        className="mt-4 col-span-full justify-center hidden items-center gap-2 px-4 py-2 rounded-full text-sm text-black cursor-pointer select-none peer-checked:inline-flex transition-transform duration-300"
                      >
                          View Less
                          <ChevronUp className="w-4 h-4" />
                      </label>
                      <label
                        htmlFor="toggle-states"
                        className="mt-4 col-span-full justify-center inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm text-black cursor-pointer select-none peer-checked:hidden transition-transform duration-300"
                      >
                          View More
                          <ChevronDown className="w-4 h-4" />
                      </label>
                    </>
                  )}
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </section>
  );
}
