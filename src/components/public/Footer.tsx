import { FaHeart } from "react-icons/fa";
export default function Footer() {
  return (
    <footer className="border-t-4 border-black py-8 bg-white">
      <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-sm font-bold text-black">
          © {new Date().getFullYear()} Muhammad Emir Fadlyanto
        </p>
        <p className="text-xs font-bold text-gray-800">
          Built with <FaHeart className="inline-block text-red-700" />
        </p>
      </div>
    </footer>
  )
}
