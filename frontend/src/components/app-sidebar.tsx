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
        ${open ? "min-w-55" : "w-15"} transition-width duration-300`}
      >
        <div>
          {/* Header */}
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
