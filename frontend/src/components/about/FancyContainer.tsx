import { ArrowRight, Instagram, Star } from "lucide-react";
import Image from "next/image";
import React from "react";

interface FancyContainerProps {
  className?: string;
}

const FancyContainer: React.FC<FancyContainerProps> = ({ className = "" }) => {
  return (
    <div className="space-y-20 px-4 sm:p-0 py-5 my-20">
      <div
        className={`relative p-10 max-w-5xl mx-auto min-h-[350px] h-[436px] md:h-[0] sm:h-[0] bg-gradient-to-r from-[#093028] to-[#237a57] rounded-[50px] ${className}`}
        >
        <div className="absolute top-0 -right-[10px] w-[80px] h-[100px] bg-white rounded-bl-[50px]" />
        <div className="absolute bottom-0 left-0 w-[180px] h-[80px] bg-white rounded-tr-[50px]" />

        <div className="absolute top-0 right-[70px] w-[70px] h-[70px] bg-white" />
        <div className="absolute top-0 right-[70px] w-[80px] h-[80px] bg-gradient-to-r from-[#185E46] sm:from-[#1f6e51] to-[#207454] rounded-tr-[50px]" />
        
        <div className="absolute bottom-[80px] left-0 w-[70px] h-[70px] bg-white" />
        <div className="absolute bottom-[80px] left-0 w-[80px] h-[80px] bg-gradient-to-r from-[#093028] to-[#0d3d2e] sm:to-[#0a362d] rounded-bl-[50px] z-10" />

        <div className="absolute top-5 -right-3 bg-black p-4 rounded-full">
          <Instagram size={30} color="white" />
        </div>

        <div className="absolute -bottom-3 left-3 flex justify-between items-center">
          <div className="rounded-full p-4">
              <img src="/logo.png" alt="" className="w-15" />
          </div>
          <div className="rounded-full flex justify-center items-center bg-black w-15 h-15">
            <ArrowRight size={25} color="white" />
          </div>
          <div className="ml-10 mb-5">
          </div>
        </div>
        
        <div className="z-30 text-white absolute flex flex-col md:flex-row sm:flex-row justify-between w-full pr-20">
          <div className="h-full flex flex-col items-start md:items-end sm:items-end">
              <div>
                  <h1 className="text-2xl sm:text-4xl font-bold">Mr. Aditya Jaglan</h1>
              <p className="max-w-3xl text-xs sm:text-md">Founder of Haryana Job Alert</p>
              <p
                  className="text-sm sm:text-lg max-w-xl mt-3"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  >
                  I started this platform because at my time, I didn't have the right knowledge and guideance about jobs and career. Now, You can use this platform to get your Dream JOB
              </p>
              </div>
              <div className="flex flex-col-reverse md:flex-row sm:flex-row items-start sm:items-center space-y-5 sm:space-y-0 mt-5 md:mt-20 sm:mt-20 flex-wrap">
                  <button className="bg-white rounded-xl shadow-md px-1 py-1 flex items-center justify-between font-semibold text-gray-800 hover:shadow-lg cursor-pointer hover:scale-105 duration-300 transition-transform hover:bg-gradient-to-r hover:from-[#222627] hover:to-[#414245] hover:text-white mr-4">
                      <span className='text-sm pl-3'>Get in Touch</span>
                      <span className="ml-4 w-10 h-10 rounded-md bg-green-400 object-cover flex items-center justify-center">
                          <img src="/arrow.png" width={48} height={48} alt='arrow' className='rounded-md' />
                      </span>
                  </button>
                  <div className="flex items-center my-6 sm:my-0">
                    <div className="flex -space-x-3">
                        <Image src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1064&auto=format&fit=crop&ixlib-rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="User 1" width={32} height={32} className="rounded-full border-2 border-white/50 object-cover" />
                        <Image src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1064&auto=format&fit=crop&ixlib-rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="User 2" width={32} height={32} className="rounded-full border-2 border-white/50 object-cover" />
                        <Image src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1064&auto=format&fit=crop&ixlib-rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="User 3" width={32} height={32} className="rounded-full border-2 border-white/50 object-cover" />
                        <Image src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1064&auto=format&fit=crop&ixlib-rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="User 4" width={32} height={32} className="rounded-full border-2 border-white/50 object-cover" />
                    </div>
                    <div className="ml-4 text-center">
                        <div className="flex text-yellow-300">
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" />
                        </div>
                        <p className="text-xs font-medium">Join us now</p>
                    </div>
                </div>

              </div>
          </div>
          <img src="/aj.png" alt="" className="absolute right-12 sm:right-14 -bottom-25 sm:-bottom-7.5 w-[150px] md:w-[330px] sm:w-[330px] h-[200px] sm:h-[450px] object-cover self-end" />
        </div>
      </div>

      <div
        className={`relative p-10 max-w-5xl mx-auto min-h-[350px] h-[436px] md:h-[0] sm:h-[0] bg-gradient-to-r from-[#93291e] to-[#ed213a] rounded-[50px] ${className}`}
        >
        <div className="absolute top-0 -right-[10px] w-[80px] h-[100px] bg-white rounded-bl-[50px]" />
        <div className="absolute -bottom-[10px] left-0 w-[180px] h-[90px] bg-white rounded-tr-[50px]" />

        <div className="absolute top-0 right-[70px] w-[70px] h-[70px] bg-white" />
        <div className="absolute top-0 right-[70px] w-[80px] h-[80px] bg-gradient-to-r from-[#c4282f] sm:from-[#df2537] to-[#e72238] rounded-tr-[50px]" />
        
        <div className="absolute bottom-[80px] left-0 w-[70px] h-[70px] bg-white" />
        <div className="absolute bottom-[80px] left-0 w-[80px] h-[80px] bg-gradient-to-r from-[#93291e] to-[#a42a24] sm:to-[#9a2821] rounded-bl-[50px] z-10" />

        <div className="absolute top-5 -right-3 bg-black p-4 rounded-full">
          <Instagram size={30} color="white" />
        </div>

        <div className="absolute -bottom-3 left-3 flex justify-between items-center">
          <div className="rounded-full p-4">
              <img src="/logo.png" alt="" className="w-15" />
          </div>
          <div className="rounded-full flex justify-center items-center bg-black w-15 h-15">
            <ArrowRight size={25} color="white" />
          </div>
          <div className="ml-10 mb-5">
          </div>
        </div>

        <div className="z-30 text-white absolute flex flex-col md:flex-row sm:flex-row justify-between w-full pr-20">
          <div className="h-full flex flex-col items-start md:items-end sm:items-end">
              <div>
                  <h1 className="text-2xl sm:text-4xl font-bold">Mr. Jaihind Sir</h1>
              <p className="max-w-3xl text-xs sm:text-md">Founder of Value Plus Campus, Jind Haryana</p>
              <p
                  className="text-sm sm:text-lg max-w-xl mt-3"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  >
                  India's Premier Online Government Job Coaching Platform! We've been helping Students prepare for Government Jobs for 12 years. We offer both Online and Offline coaching.
              </p>
              </div>
              <div className="flex flex-col-reverse md:flex-row sm:flex-row items-start sm:items-center space-y-5 sm:space-y-0 mt-5 md:mt-20 sm:mt-20 flex-wrap">
                  <button className="bg-white rounded-xl shadow-md px-1 py-1 flex items-center justify-between font-semibold text-gray-800 hover:shadow-lg cursor-pointer hover:scale-105 duration-300 transition-transform hover:bg-gradient-to-r hover:from-[#222627] hover:to-[#414245] hover:text-white mr-4">
                      <span className='text-sm pl-3'>Get in Touch</span>
                      <span className="ml-4 w-10 h-10 rounded-md bg-green-400 object-cover flex items-center justify-center">
                          <img src="/arrow.png" width={48} height={48} alt='arrow' className='rounded-md' />
                      </span>
                  </button>
                  <div className="flex items-center my-6 sm:my-0">
                    <div className="flex -space-x-3">
                        <Image src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1064&auto=format&fit=crop&ixlib-rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="User 1" width={32} height={32} className="rounded-full border-2 border-white/50 object-cover" />
                        <Image src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1064&auto=format&fit=crop&ixlib-rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="User 2" width={32} height={32} className="rounded-full border-2 border-white/50 object-cover" />
                        <Image src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1064&auto=format&fit=crop&ixlib-rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="User 3" width={32} height={32} className="rounded-full border-2 border-white/50 object-cover" />
                        <Image src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1064&auto=format&fit=crop&ixlib-rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="User 4" width={32} height={32} className="rounded-full border-2 border-white/50 object-cover" />
                    </div>
                    <div className="ml-4 text-center">
                        <div className="flex text-yellow-300">
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" />
                        </div>
                        <p className="text-xs font-medium">Join us now</p>
                    </div>
                </div>

              </div>
          </div>
          <img src="/js.png" alt="" className="w-[150px] md:w-[330px] sm:w-[330px] h-[150px] sm:h-[310px] -mt-12 sm:mt-0 object-cover self-end" />
        </div>
      </div>
    </div>
  );
};

export default FancyContainer;
