import outlookSignature from '../assets/Outlook-signature1_.png';
import { LuBellDot } from "react-icons/lu";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoIosArrowDown } from "react-icons/io";

const Navbar = () => {
  return (
    <header className="flex items-center justify-between bg-white border-b border-border px-6 py-1 sticky top-0 z-50">
      <div className="flex items-center gap-6">

        <button className="text-text-light hover:text-text-dark transition-colors cursor-pointer" aria-label="Toggle menu">
         <RxHamburgerMenu className='w-6 h-6' />
        </button>


        <div className="flex items-center gap-3">

          <img src={outlookSignature} alt="Single View logo" className="w-24 h-16 " />

        </div>
      </div>


      <div className="flex items-center gap-8">

        <button className="flex items-center gap-1 border rounded-full px-3 py-1.5 text-sm text-text hover:bg-gray-50 transition-colors cursor-pointer">
          <span>Quick links</span>
          <IoIosArrowDown className="w-4 h-4 text-text-light" />
        </button>


        <button className="text-sm text-text hover:text-text-dark transition-colors cursor-pointer font-medium">
          عربي
        </button>


        <button className="relative text-text-light hover:text-text-dark transition-colors cursor-pointer" aria-label="Notifications">
         <LuBellDot className='w-5 h-5' />
         
        </button>


        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-primary font-semibold text-xs">
            AI
          </div>
          <span className="text-sm text-text-dark font-medium">
            Abdullah_Ibrahim
          </span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
