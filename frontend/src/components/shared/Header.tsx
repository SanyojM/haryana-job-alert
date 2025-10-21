"use client";

import { useEffect, useRef, useState } from "react";
import {
  Search,
  User,
  Menu,
  X,
  LogOut,
  House,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { api } from "@/lib/api";
import { AuthDialog } from "@/components/auth/AuthDialog";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Latest Jobs", href: "/category/latest-jobs" },
  { name: "Yojna", href: "/category/yojna" },
  { name: "Offline Forms", href: "/offline-forms" },
  { name: "Online Forms", href: "/online-forms" },
  { name: "Mock Test", href: "/mock-tests" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const currentPath = usePathname();
  const { logout } = useAuth();
  const { user } = useAuth();
  const [categories, setCategories] = useState<
    Array<{ id: number; name: string; description: string | null }>
  >([]);
  const isLoggedIn = !!user;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
  }, [isMenuOpen]);

  return (
    <>
      <style jsx>{`
        .marquee-content {
          animation: marquee 30s linear infinite;
        }
        @keyframes marquee {
          from {
            transform: translateX(0%);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>

      <header className='bg-white'>
        <div className="bg-black text-white py-1 overflow-hidden whitespace-nowrap text-sm">
          <div className="marquee-content flex">
            <p className="px-4">
              You can Now Give MOCK TESTS on Haryana Job Alert for FREE.
            </p>
            <p className="px-4">
              You can Now Give MOCK TESTS on Haryana Job Alert for FREE.
            </p>
            <p className="px-4">
              You can Now Give MOCK TESTS on Haryana Job Alert for FREE.
            </p>
            <p className="px-4">
              You can Now Give MOCK TESTS on Haryana Job Alert for FREE.
            </p>
            <p className="px-4">
              You can Now Give MOCK TESTS on Haryana Job Alert for FREE.
            </p>
          </div>
        </div>

        <div className="max-w-5xl "></div>

        <nav className="lg:container mx-auto px-4 mt-2 sm:mt-5">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex-shrink-0">
              <img className="h-14 w-14 rounded-full" src="/logo.png" alt="Haryana Job Alert Logo" />
              {/* <h1 className="text-xl font-bold italic">
                Haryana <span className="text-green-600">Job</span> Alert
              </h1> */}
            </Link>

            <div className="hidden lg:flex items-center justify-center flex-1 mr-14">
              <div className="p-2 rounded-xl border">
                <div className="bg-white rounded-xl shadow-lg px-4 py-2 flex items-center space-x-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`px-4 py-2 rounded-xl text-md font-medium transition-colors whitespace-nowrap ${
                        link.href === currentPath
                          ? "bg-black text-white"
                          : "text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                  <HoverCard openDelay={0} closeDelay={200}>
                    <HoverCardTrigger asChild>
                      <button className="px-4 py-2 rounded-xl text-md font-medium transition-colors text-gray-600 hover:bg-gray-200 whitespace-nowrap">
                        More
                      </button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-64 p-2 bg-gray-100 border border-gray-400 rounded-2xl mt-2 shadow-lg">
                      <div className="bg-white grid gap-1 p-2 rounded-2xl shadow-lg">
                        <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase">
                          Categories
                        </div>
                        {categories?.length === 0 ? (
                          <div className="px-3 py-2 text-sm text-gray-500">
                            Loading...
                          </div>
                        ) : (
                          categories
                            .filter((cat) => {
                              const name = (cat.name || "").toLowerCase();
                              return name !== "yojna" && name !== "latest jobs";
                            })
                            .map((category) => (
                              <Link
                                key={category.id}
                                href={`/category/${category.name
                                  .toLowerCase()
                                  .replace(/\s+/g, "-")}`}
                                className="px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-700 hover:bg-gray-100 whitespace-nowrap"
                              >
                                {category.name}
                              </Link>
                            ))
                        )}
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                  <div className="border-l border-gray-200 ml-2 pl-4 flex items-center space-x-3">
                    {isLoggedIn ? (
                      <HoverCard openDelay={0} closeDelay={200}>
                        <HoverCardTrigger asChild>
                          <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                            <Avatar className="h-8 w-8 bg-blue-500">
                              <AvatarImage
                                src={user?.avatar_url || "/user.png"}
                                alt={user.full_name || "User"}
                              />
                              <AvatarFallback>
                                {user.full_name
                                  ? user.full_name.charAt(0).toUpperCase()
                                  : "U"}
                              </AvatarFallback>
                            </Avatar>
                          </button>
                        </HoverCardTrigger>
                        <HoverCardContent
                          className="w-60 p-2 bg-gray-100 rounded-3xl mt-6 mr-14"
                          side="bottom"
                        >
                          <div className="flex flex-col space-y-1 border-2 border-gray-200 rounded-2xl bg-white">
                            <div className="font-bold p-3 pb-0.5">
                              {user.full_name || "User"}
                            </div>
                            <div className="text-sm text-gray-600 pl-3">
                              {user.email || "No Email"}
                            </div>
                            <hr className="my-1" />
                            <Link
                              href="/dashboard"
                              className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 text-sm font-medium text-gray-700 whitespace-nowrap"
                            >
                              <House className="w-4 h-4" />
                              <span>Dashboard</span>
                            </Link>
                            <Link
                              href="/dashboard/profile/edit"
                              className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 text-sm font-medium text-gray-700 whitespace-nowrap"
                            >
                              <User className="w-4 h-4" />
                              <span>Profile</span>
                            </Link>
                            <hr className="my-1" />
                            <button
                              onClick={() => logout()} // Call your logout function
                              className="flex items-center gap-3 p-2 rounded-md hover:bg-red-50 text-sm font-medium text-red-600 w-full whitespace-nowrap"
                            >
                              <LogOut className="w-4 h-4" />
                              <span>Logout</span>
                            </button>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    ) : (
                      // --- LOGGED-OUT STATE ---
                      // Show original image, open auth dialog on click
                      <button
                        onClick={() => setIsAuthDialogOpen(true)}
                        className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 p-2 rounded-md"
                        aria-label="Login"
                      >
                        <Image
                          src="/profile.png"
                          width={18}
                          height={18}
                          alt="Login"
                        />
                      </button>
                    )}
                    <Link
                      href="#"
                      className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 p-2 rounded-md"
                    >
                      <Search className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="lg:hidden flex items-center justify-between w-full"
              ref={menuRef}
            >
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-700 hover:bg-gray-200"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
              {isMenuOpen && !isLoggedIn && (
                <button
                  onClick={() => setIsAuthDialogOpen(true)}
                  className="p-1"
                  aria-label="Login"
                >
                  <img
                    src="/profile.png"
                    className="h-7 w-7 rounded-lg bg-white p-1"
                    alt="Login"
                  />
                </button>
              )}
            </div>
          </div>
        </nav>

        {isMenuOpen && (
          <div className="lg:hidden bg-gray-100 shadow-lg absolute w-full z-999 origin-top-right">
            <div className="flex flex-col space-y-1 px-2 pt-2 pb-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium whitespace-nowrap ${
                    link.href === currentPath
                      ? "bg-black text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              {/* More (Categories) - Collapsible */}
              <Collapsible
                open={isCategoriesOpen}
                onOpenChange={setIsCategoriesOpen}
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 whitespace-nowrap">
                  <span>More</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      isCategoriesOpen ? "rotate-180" : ""
                    }`}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-1">
                  <div className="ml-4 space-y-1">
                    {categories?.length === 0 ? (
                      <div className="px-3 py-2 text-sm text-gray-500">
                        Loading...
                      </div>
                    ) : (
                      categories
                        ?.filter((cat) => {
                          const name = (cat.name || "").toLowerCase();
                          return name !== "yojna" && name !== "latest jobs";
                        })
                        .map((category) => (
                          <Link
                            key={category.id}
                            href={`/category/${category.name
                              .toLowerCase()
                              .replace(/\s+/g, "-")}`}
                            className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 whitespace-nowrap"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {category.name}
                          </Link>
                        ))
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {isLoggedIn ? (
                <>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 p-2 rounded-md text-base font-medium whitespace-nowrap"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <House className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/profile/edit"
                    className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 p-2 rounded-md text-base font-medium whitespace-nowrap"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-2 text-red-500 hover:bg-red-50 p-2 rounded-md text-base font-medium w-full text-left whitespace-nowrap"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setIsAuthDialogOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 p-2 rounded-md text-base font-medium w-full whitespace-nowrap"
                >
                  <User className="w-4 h-4" />
                  Login
                </button>
              )}
            </div>
          </div>
        )}

        {/* Auth Dialog */}
        <AuthDialog
          open={isAuthDialogOpen}
          onOpenChange={setIsAuthDialogOpen}
        />
      </header>
    </>
  );
}
