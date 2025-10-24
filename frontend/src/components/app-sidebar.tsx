"use client";

import React from "react";
import { LogOut, Plus } from "lucide-react";
import SidebarMenus from "./sidebar-menus";
import { menus } from "@/config/menus";
import { Button } from "@heroui/react";
import { useAuth } from "@/context/AuthContext";

export default function Sidebar() {
const [open, setOpen] = React.useState(true);

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`hidden lg:flex flex-col justify-between overflow-y-hidden border-r border-gray-300 h-screen 
        ${open ? "min-w-72" : "w-20"} transition-width duration-300`}
      >
        <div>
          {/* Header */}
          <div className="flex justify-between items-center mt-4 mb-2 px-3">
            {open && (
              <div className="flex items-center">
                <img src="/softricity.png" alt="Logo" className="h-14" />
              </div>
            )}
            <button
              type="button"
              title="Toggle Sidebar"
              onClick={() => setOpen(!open)}
              className="min-w-14 min-h-14 flex justify-center items-center p-2 rounded-2xl hover:bg-gray-200 transition-colors"
            >
              <LogOut
                className={`rotate-${open ? "180" : "0"} transition-transform duration-300`}
              />
            </button>
          </div>
          {/* Menus */}
          <SidebarMenus menus={menus} open={open} />
        </div>
      </div>
    </>
  );
}
