import React from 'react';
import { Search, ChevronDown, Menu } from 'lucide-react';
import img from "../assets/images/Capture.png"
import logo from "../assets/images/logo-egg.jpg"

const Header = () => {
  return (
    <header className="flex items-center justify-between px-4 py-2 bg-white shadow-sm">
      <div className="flex items-center">
        <Menu className="mr-4 h-6 w-6 text-gray-500 md:hidden" />
        
        <img
          src={logo}
          alt="User avatar"
          className=" pl-12 h-20 "
        />
      </div>
      
      <div className="flex-grow mx-4 max-w-xl">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="w-full py-2 pl-10 pr-4 text-gray-700 bg-gray-100 rounded-full focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>
      
      <div className="flex items-center">
        <img
          src={img}
          alt="User avatar"
          className="w-8 h-8 rounded-full"
        />
        <div className="ml-2 hidden md:block">
          <p className="text-sm font-medium text-gray-700">ADMIN</p>
          <p className="text-xs text-gray-500">Admin</p>
        </div>
        <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
      </div>
    </header>
  );
};

export default Header;