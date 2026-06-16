import React from "react";
import { FaPhoneAlt, FaInstagram, FaEnvelope } from "react-icons/fa"; // Import icons for phone, Instagram, and email
import logo from "../../assets/SVG/Asset 1.svg"; // Adjust the path based on where your logo is stored

function Footer() {
  return (
    <footer className="bg-light-background  dark:bg-gray-900 text-black dark:text-gray-300 py-8 w-full">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center">
          {/* Left Side: Logo */}
          <div className="w-full md:w-1/3 flex justify-center md:justify-start mb-6 md:mb-0">
            <img
              src={logo} // Use your actual logo file path here
              alt="TaskTrek Logo"
              className="h-24" // Adjust the logo size as necessary
            />
          </div>

          {/* Right Side: Contact Details */}
          <div className="w-full md:w-2/3 flex justify-center md:justify-end text-left">
            <div className="space-y-4">
              {/* Phone Number */}
              <div className="flex items-center space-x-2">
                <FaPhoneAlt className="text-xl text-light-accent dark:text-dark-accent" />
                <a
                  href="https://wa.me/+923414152012"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-lg hover:text-light-accent dark:hover:text-dark-accent"
                ></a>
              </div>

              {/* Instagram ID
              <div className="flex items-center space-x-2">
                <FaInstagram className="text-xl text-light-accent dark:text-dark-accent" />
                <a href="https://instagram.com/asifdhillon25" target="_blank" rel="noopener noreferrer" className="font-semibold text-lg hover:text-light-accent dark:hover:text-dark-accent">
                  @asifdhillon25
                </a>
              </div> */}

              {/* Email */}
              <div className="flex items-center space-x-2">
                <FaEnvelope className="text-xl text-light-accent dark:text-dark-accent" />
                <a
                  href="mailto:tasktrek25@gmail.com"
                  className="font-semibold text-lg hover:text-light-accent dark:hover:text-dark-accent"
                >
                  ClassEye@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

       
      </div>
    </footer>
  );
}

export default Footer;
