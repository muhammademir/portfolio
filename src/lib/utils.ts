import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getChipColors(text: string) {
  const palettes = [
    'bg-purple-100 text-purple-700 hover:bg-purple-200',
    'bg-pink-100 text-pink-700 hover:bg-pink-200',
    'bg-teal-100 text-teal-700 hover:bg-teal-200',
    'bg-blue-100 text-blue-700 hover:bg-blue-200',
    'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
    'bg-green-100 text-green-700 hover:bg-green-200',
    'bg-orange-100 text-orange-700 hover:bg-orange-200',
    'bg-red-100 text-red-700 hover:bg-red-200',
  ];
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  return palettes[Math.abs(hash) % palettes.length];
}
