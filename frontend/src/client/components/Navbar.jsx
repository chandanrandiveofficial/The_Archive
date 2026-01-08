import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { RiSearchLine } from 'react-icons/ri';
import { HiOutlineShoppingBag, HiMenu } from 'react-icons/hi';
import { MdOutlineLightMode, MdDarkMode } from 'react-icons/md';
import { IoClose } from 'react-icons/io5';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const navLinks = [
    { name: 'All Products', path: '/allproducts' },
    { name: 'Popular', path: '/popular' },
    { name: 'Monthly', path: '/monthly' },
    { name: 'Category', path: '/category' },
    { name: 'More', path: '/more' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 z-50">
            <div className="bg-black text-white px-2 py-1 rounded">
              <span className="font-bold text-sm">⬡</span>
            </div>
            <span className="font-bold text-lg tracking-tight">THE ARCHIVE</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-gray-700 hover:text-black text-sm font-medium transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-2 sm:space-x-4 z-50">
            {/* Search Icon */}
            <button className="hidden sm:hidden p-2 hover:bg-gray-100 rounded-full transition-colors">
              <RiSearchLine className="w-5 h-5 text-gray-700" />
            </button>

            {/* Cart Icon */}
            <Link to="/cart" className="p-2 hover:bg-gray-100 rounded-full hidden transition-colors">
              <HiOutlineShoppingBag className="w-5 h-5 text-gray-700" />
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 rounded-full hidden transition-colors"
            >
              {isDarkMode ? (
                <MdOutlineLightMode className="w-5 h-5 text-gray-700" />
              ) : (
                <MdDarkMode className="w-5 h-5 text-gray-700" />
              )}
            </button>

            {/* Mobile Menu Trigger */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <button className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <HiMenu className="w-6 h-6 text-gray-700" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[350px] p-0">
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="text-lg font-semibold">Menu</h2>
                  <SheetClose asChild>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <IoClose className="w-6 h-6 text-gray-700" />
                    </button>
                  </SheetClose>
                </div>

                {/* Mobile Menu Content */}
                <div className="flex flex-col h-full">
                  {/* Mobile Search */}
                  <div className="p-4 border-b">
                    <div className="flex items-center space-x-2 px-4 py-3 bg-gray-100 rounded-lg">
                      <RiSearchLine className="w-5 h-5 text-gray-500" />
                      <input
                        type="text"
                        placeholder="Search..."
                        className="bg-transparent outline-none text-sm w-full text-gray-700 placeholder:text-gray-500"
                      />
                    </div>
                  </div>

                  {/* Mobile Navigation Links */}
                  <div className="flex flex-col p-2">
                    {navLinks.map((link) => (
                      <Link
                        key={link.name}
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className="text-gray-700 hover:text-black text-base font-medium px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>

                  {/* Mobile Cart Link */}
                  <div className="mt-auto hidden border-t p-4">
                    <Link
                      to="/cart"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 text-gray-700 hover:text-black font-medium px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <HiOutlineShoppingBag className="w-5 h-5" />
                      <span>Shopping Cart</span>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
