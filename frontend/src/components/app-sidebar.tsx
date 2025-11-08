"use client";

import React from "react";
import { LogOut, Plus, User } from "lucide-react";
import SidebarMenus from "./sidebar-menus";
import { menus } from "@/config/menus";
import { Button } from "@heroui/react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useRouter } from "next/router";

interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({ isMobileOpen, onMobileClose }: SidebarProps = {}) {
  const [open, setOpen] = React.useState(true);
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLinkClick = () => {
    if (onMobileClose) {
      onMobileClose();
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden lg:flex flex-col border-r border-gray-300 h-screen bg-white",
          "overflow-y-hidden", 
          open ? "min-w-55" : "w-15",
          "transition-all duration-300"
        )}
      >
        {/* 1. TOP SECTION (Header) - Static height */}
        <div>
          <div className="flex justify-between items-center mt-4 mb-2 px-3">
            {open && (
              <div className="flex items-center">
                <h1 className="playfair text-lg">Haryana Job Alert</h1>
              </div>
            )}
            <button
              type="button"
              title="Toggle Sidebar"
              onClick={() => setOpen(!open)}
              className="min-w-10 min-h-10 flex justify-center items-center p-2 rounded-2xl hover:bg-gray-200 transition-colors"
            >
              <LogOut
                size={20}
                className={cn(
                  "transition-transform duration-300",
                  open ? "rotate-180" : "rotate-0"
                )}
              />
            </button>
          </div>
        </div>
        
        {/* 2. MIDDLE SECTION (Menus) - Grows and scrolls */}
        {/*
          This div now correctly grows, scrolls internally, and won't
          cause the main page scrollbar to appear.
        */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden hide-scrollbar min-h-0">
          <SidebarMenus menus={menus} open={open} />
        </div>

        {/* 3. BOTTOM SECTION (Profile/Logout) - Static height */}
        <div className="p-4 border-t border-gray-200 space-y-1 bg-gray-50">
          <Link
            href="/dashboard/profile/edit"
            onClick={handleLinkClick}
            className={cn(
              'flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200',
              router.pathname === '/dashboard/profile/edit' 
                ? 'bg-blue-50 text-blue-600 font-medium border border-blue-100'
                : 'text-gray-700 hover:bg-gray-100'
            )}
          >
            <User className="w-5 h-5" />
            {open && <span className="text-sm">Profile Settings</span>}
          </Link>

          <button
            onClick={() => {
              logout();
              handleLinkClick();
            }}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            {open && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
}