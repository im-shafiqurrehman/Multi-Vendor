import { AiFillFacebook, AiFillInstagram, AiFillYoutube, AiOutlineTwitter } from "react-icons/ai"
import { Link } from "react-router-dom"
import { footercompanyLinks, footerProductLinks, footerSupportLinks } from "../../static/data"

import atmCard from "../../Assests/atm-card.png"
import jazzCash from "../../Assests/jazzcash.png"

const Footer = () => {
  return (
    <div className="bg-[#000] text-white">
      {/* Subscribe Section */}
      <div className="md:flex md:justify-between md:items-center sm:px-12 px-4 bg-gradient-to-r from-[#342ac8] to-[#4b38e0] py-8 rounded-t-lg shadow-lg">
        <h1 className="lg:text-4xl text-3xl md:mb-0 mb-6 lg:leading-normal font-semibold md:w-2/5">
          <span className="text-[#56d879] drop-shadow-md">Subscribe</span> to get news <br />
          events and offers
        </h1>
        <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0">
          <input
            type="text"
            required
            placeholder="Enter your email..."
            className="text-gray-800 sm:w-72 w-full sm:mr-5 mr-1 lg:mb-0 mb-4 py-3 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-[#56d879] transition-all duration-300 shadow-md"
          />
          <button className="bg-[#56d879] hover:bg-[#3cb863] duration-300 px-6 py-3 rounded-lg text-white md:w-auto w-full font-medium shadow-md hover:shadow-lg transition-all">
            Subscribe
          </button>
        </div>
      </div>

      {/* Main Footer Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:px-8 px-5 py-16">
        {/* Logo and Social */}
        <ul className="px-5 flex flex-col items-center sm:items-start">
          <img
            src="https://shopo.quomodothemes.website/assets/images/logo.svg"
            alt="Logo"
            style={{ filter: "brightness(0) invert(1)" }}
            className="h-12 mb-4"
          />
          <p className="text-gray-300 mb-4 text-center sm:text-left">
            The home and elements needed to create beautiful products.
          </p>
          <div className="flex items-center mt-2 space-x-4">
            <a href="#" className="text-gray-400 hover:text-[#56d879] transition-colors duration-300">
              <AiFillFacebook size={25} />
            </a>
            <a href="#" className="text-gray-400 hover:text-[#56d879] transition-colors duration-300">
              <AiOutlineTwitter size={25} />
            </a>
            <a href="#" className="text-gray-400 hover:text-[#56d879] transition-colors duration-300">
              <AiFillInstagram size={25} />
            </a>
            <a href="#" className="text-gray-400 hover:text-[#56d879] transition-colors duration-300">
              <AiFillYoutube size={25} />
            </a>
          </div>
        </ul>

        {/* Company Links */}
        <ul className="flex flex-col items-center sm:items-start">
          <h1 className="text-xl font-semibold mb-4 text-[#56d879]">Company</h1>
          {footerProductLinks.map((link, index) => (
            <li key={index} className="mb-2">
              <Link
                className="text-gray-400 hover:text-[#56d879] duration-300 text-sm cursor-pointer leading-6 hover:translate-x-1 inline-block transition-transform"
                to={link.link}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Shop Links */}
        <ul className="flex flex-col items-center sm:items-start">
          <h1 className="text-xl font-semibold mb-4 text-[#56d879]">Shop</h1>
          {footercompanyLinks.map((link, index) => (
            <li key={index} className="mb-2">
              <Link
                className="text-gray-400 hover:text-[#56d879] duration-300 text-sm cursor-pointer leading-6 hover:translate-x-1 inline-block transition-transform"
                to={link.link}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Support Links */}
        <ul className="flex flex-col items-center sm:items-start">
          <h1 className="text-xl font-semibold mb-4 text-[#56d879]">Support</h1>
          {footerSupportLinks.map((link, index) => (
            <li key={index} className="mb-2">
              <Link
                className="text-gray-400 hover:text-[#56d879] duration-300 text-sm cursor-pointer leading-6 hover:translate-x-1 inline-block transition-transform"
                to={link.link}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-800 pt-8 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 px-6 sm:px-8">
          {/* Copyright */}
          <div className="flex justify-center sm:justify-start items-center">
            <span className="text-gray-400 text-sm">© 2020 Becodemy. All rights reserved.</span>
          </div>

          {/* Terms */}
          <div className="flex justify-center items-center">
            <Link to="/terms" className="text-gray-400 hover:text-[#56d879] text-sm mr-4 transition-colors">
              Terms
            </Link>
            <span className="text-gray-600">·</span>
            <Link to="/privacy" className="text-gray-400 hover:text-[#56d879] text-sm ml-4 transition-colors">
              Privacy Policy
            </Link>
          </div>

          {/* Payment Methods */}
          <div className="flex justify-center sm:justify-end space-x-6">
            <div className="flex flex-col items-center group">
              <div className="bg-white p-2 rounded-lg shadow-md overflow-hidden transform group-hover:scale-105 transition-transform duration-300">
                <img src={atmCard || "/placeholder.svg"} alt="ATM Card" className="w-16 h-auto object-contain" />
              </div>
              <span className="mt-2 text-xs font-medium text-gray-400 group-hover:text-[#56d879] transition-colors">
                ATM Card
              </span>
            </div>

            <div className="flex flex-col items-center group">
              <div className="bg-white p-2 rounded-lg shadow-md overflow-hidden transform group-hover:scale-105 transition-transform duration-300">
                <img src={jazzCash || "/placeholder.svg"} alt="JazzCash" className="w-16 h-auto object-contain" />
              </div>
              <span className="mt-2 text-xs font-medium text-gray-400 group-hover:text-[#56d879] transition-colors">
                JazzCash
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer

