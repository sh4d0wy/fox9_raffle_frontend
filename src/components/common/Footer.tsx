import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";


const Footer = () => {
  return (
    <footer className="w-full pb-8 bg-black-1100 font-inter">
      <motion.div 
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      transition={{ duration: 0.3 }}
      className="max-w-[1440px] mx-auto md:px-[52px] px-5 relative">
        <img src="/footer-frame-left.png" className="absolute hidden md:block left-10 top-[22px] h-[166px]" alt="" />
        <img src="/footer-frame-right.png" className="absolute hidden md:block right-10 top-[22px] h-[166px]" alt="" />
        <div className="text-center -mb-2">
          <img src="/footer-shape.png" className="inline-block" alt="" />
        </div>
        <div className="bg-primary-color/[15%]  rounded-[12px] flex md:flex-row flex-col gap-6 items-center justify-between py-7 px-8">
          <Link to="/"><img src="/footer-logo.png" alt="" /></Link>
          <ul className="max-w-[312px] flex items-center sm:flex-row gap-3 flex-col justify-between mx-auto w-full">
            <li>
              <Link to="/" className="text-base font-light text-white block">Terms of Service</Link>
            </li>
            <li>
              <Link to="/" className="text-base font-light text-white block">Support</Link>
            </li>
          </ul>
          <div>
            <h6 className="text-base font-light mb-2 text-white text-center">Follow Us on</h6>
            <ul className="flex items-center gap-4">
              <li>
                <Link to="/" className="w-12 h-12 rounded-full flex items-center justify-center border border-white bg-black-1300"><img src="/icons/twiter.svg" alt="" /></Link>
              </li>
              <li>
                <Link to="/" className="w-12 h-12 rounded-full flex items-center justify-center border border-white bg-black-1300"><img src="/icons/discord.svg" alt="" /></Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="text-center -mt-2">
          <img src="/footer-shape.png" className="inline-block" alt="" />
        </div>
        <div className="text-center mt-4">
          <h6 className="md:text-base text-sm text-white font-inter font-light">All rights reserved. © 2025 LUCKIT</h6>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
