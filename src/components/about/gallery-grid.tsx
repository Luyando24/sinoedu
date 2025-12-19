"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ZoomIn, X, ChevronLeft, ChevronRight } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { cn } from "@/lib/utils"

interface GalleryGridProps {
  images: string[]
}

export function GalleryGrid({ images }: GalleryGridProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : 0))
    }
  }

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : images.length - 1))
    }
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((src, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className="group relative h-48 md:h-64 rounded-xl overflow-hidden shadow-md cursor-pointer"
            onClick={() => setSelectedImageIndex(i)}
          >
            <Image
              src={src}
              alt={`Gallery Image ${i + 1}`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <ZoomIn className="text-white w-8 h-8 drop-shadow-md transform scale-50 group-hover:scale-100 transition-transform duration-300" />
            </div>
          </motion.div>
        ))}
      </div>

      <Dialog open={selectedImageIndex !== null} onOpenChange={(open) => !open && setSelectedImageIndex(null)}>
        <DialogContent className="max-w-[95vw] h-[90vh] p-0 bg-black/95 border-none shadow-none flex items-center justify-center overflow-hidden">
            <DialogTitle className="sr-only">Image Gallery View</DialogTitle>
            <DialogDescription className="sr-only">
              Viewing image {selectedImageIndex !== null ? selectedImageIndex + 1 : 0} of {images.length}
            </DialogDescription>
            
            <button 
              onClick={() => setSelectedImageIndex(null)}
              className="absolute top-4 right-4 z-50 p-2 bg-black/50 rounded-full text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {selectedImageIndex !== null && (
              <div className="relative w-full h-full flex items-center justify-center" onClick={() => setSelectedImageIndex(null)}>
                 {/* Navigation Buttons */}
                 <button 
                  onClick={handlePrev}
                  className="absolute left-4 z-50 p-3 bg-black/50 rounded-full text-white hover:bg-white/20 transition-colors hidden md:block"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                
                <button 
                  onClick={handleNext}
                  className="absolute right-4 z-50 p-3 bg-black/50 rounded-full text-white hover:bg-white/20 transition-colors hidden md:block"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>

                <div className="relative w-full h-full max-h-[85vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
                  <Image
                    src={images[selectedImageIndex]}
                    alt={`Gallery Image ${selectedImageIndex + 1}`}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            )}
        </DialogContent>
      </Dialog>
    </>
  )
}
