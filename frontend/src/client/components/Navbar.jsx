import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { RiSearchLine } from 'react-icons/ri';
import { HiMenu, HiOutlineLockClosed } from 'react-icons/hi';
import { IoClose } from 'react-icons/io5';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'All Products', path: '/allproducts' },
    { name: 'Popular', path: '/popular' },
    { name: 'Monthly', path: '/monthly' },
    { name: 'Category', path: '/category' },
    { name: 'More', path: '/more' },
  ];

  return (
    <nav className="bg-white border-b border-zinc-100 sticky top-0 z-[60]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-black text-white w-9 h-9 flex items-center justify-center rounded-sm transition-transform duration-500 group-hover:rotate-45">
              <span className="font-bold text-lg">⬡</span>
            </div>
            <span className="font-extrabold text-xl tracking-tighter text-black uppercase">THE ARCHIVE</span>
          </Link>

          {/* Desktop Navigation Links - Centered & Refined */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-[11px] font-black uppercase tracking-[0.25em] text-zinc-400 hover:text-black transition-all duration-300 relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-black hover:after:w-full after:transition-all"
              >
                {link.name}
              </Link>
            ))}
            {/* Desktop Admin Login Link */}
            <Link
              to="/admin/login"
              className="group flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.25em] text-zinc-300 hover:text-black transition-all duration-300 border-l border-zinc-100 pl-10 ml-2"
            >
              <HiOutlineLockClosed className="text-sm group-hover:scale-110 transition-transform" />
              Admin
            </Link>
          </div>

          {/* Right Section / Mobile Toggle */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Trigger */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <button className="lg:hidden p-2 hover:bg-zinc-50 rounded-lg transition-all duration-300">
                  {isOpen ? (
                    <IoClose className="w-7 h-7 text-black transition-all animate-in zoom-in spin-in-180" />
                  ) : (
                    <HiMenu className="w-7 h-7 text-black transition-all" />
                  )}
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-[400px] p-0 border-l border-zinc-100">
                <div className="flex flex-col h-full bg-white p-10">
                  <div className="flex items-center justify-between mb-20">
                    <span className="font-black text-xs uppercase tracking-widest text-zinc-400">Navigation</span>
                    <SheetClose asChild>
                      <button className="p-2 hover:bg-zinc-50 rounded-full transition-colors">
                        <IoClose className="w-7 h-7 text-black" />
                      </button>
                    </SheetClose>
                  </div>

                  <div className="flex flex-col gap-6">
                    {navLinks.map((link) => (
                      <Link
                        key={link.name}
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className="text-4xl font-black uppercase tracking-tighter text-zinc-200 hover:text-black transition-all duration-500 hover:translate-x-2"
                      >
                        {link.name}
                      </Link>
                    ))}

                    {/* Mobile Admin Login Link */}
                    <Link
                      to="/admin/login"
                      onClick={() => setIsOpen(false)}
                      className="mt-8 flex items-center gap-3 text-sm font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-black transition-all"
                    >
                      <HiOutlineLockClosed className="text-xl" />
                      Admin Login
                    </Link>
                  </div>

                  <div className="mt-auto pt-10 border-t border-zinc-100 flex flex-col gap-4">
                    <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest leading-loose">
                      The Archive © 2025<br />
                      Curated Objects of History
                    </p>
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
