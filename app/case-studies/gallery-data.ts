export const projects = [
  { name: "Tejraj", image: "/work/tejraj.webp", category: "Real estate · Digital experience" },
  { name: "Goel Ganga", image: "/work/goel-ganga.jpg", category: "Real estate · Brand website" },
  { name: "House of Memories", image: "/work/house-of-memories.jpg", category: "Hospitality · Digital experience" },
  { name: "Kiara Lifespaces", image: "/work/kiara.webp", category: "Real estate · Brand website" },
  { name: "Majestique", image: "/work/majestique.webp", category: "Real estate · Digital experience" },
];

export const wrap = (value: number, length: number) => ((value % length) + length) % length;
export type GalleryPosition = { x: number; y: number };

