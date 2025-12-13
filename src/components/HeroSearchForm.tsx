"use client"

import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { motion } from "framer-motion"

export function HeroSearchForm() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.5 }}
      className="w-full max-w-5xl mx-auto mt-12 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* City Select */}
        <div className="relative">
          <select 
            className="w-full h-12 px-4 rounded-lg bg-white/90 border-0 focus:ring-2 focus:ring-brand-red text-gray-700 font-medium appearance-none cursor-pointer"
            defaultValue=""
          >
            <option value="" disabled>Select City</option>
            <option value="beijing">Beijing</option>
            <option value="shanghai">Shanghai</option>
            <option value="wuhan">Wuhan</option>
            <option value="chengdu">Chengdu</option>
            <option value="hangzhou">Hangzhou</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
            </svg>
          </div>
        </div>

        {/* Degree Select */}
        <div className="relative">
          <select 
            className="w-full h-12 px-4 rounded-lg bg-white/90 border-0 focus:ring-2 focus:ring-brand-red text-gray-700 font-medium appearance-none cursor-pointer"
            defaultValue=""
          >
            <option value="" disabled>Select Degree</option>
            <option value="bachelor">Bachelor</option>
            <option value="master">Master</option>
            <option value="phd">PhD</option>
            <option value="non-degree">Non-Degree</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
            </svg>
          </div>
        </div>

        {/* Teaching Language Select */}
        <div className="relative">
          <select 
            className="w-full h-12 px-4 rounded-lg bg-white/90 border-0 focus:ring-2 focus:ring-brand-red text-gray-700 font-medium appearance-none cursor-pointer"
            defaultValue=""
          >
            <option value="" disabled>Teaching Language</option>
            <option value="english">English</option>
            <option value="chinese">Chinese</option>
            <option value="bilingual">Bilingual</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
            </svg>
          </div>
        </div>

        {/* Duration Select */}
        <div className="relative">
          <select 
            className="w-full h-12 px-4 rounded-lg bg-white/90 border-0 focus:ring-2 focus:ring-brand-red text-gray-700 font-medium appearance-none cursor-pointer"
            defaultValue=""
          >
            <option value="" disabled>Select Duration</option>
            <option value="1">1 Year</option>
            <option value="2">2 Years</option>
            <option value="3">3 Years</option>
            <option value="4">4 Years</option>
            <option value="5+">5+ Years</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
            </svg>
          </div>
        </div>

        {/* Scholarship Select */}
        <div className="relative">
          <select 
            className="w-full h-12 px-4 rounded-lg bg-white/90 border-0 focus:ring-2 focus:ring-brand-red text-gray-700 font-medium appearance-none cursor-pointer"
            defaultValue=""
          >
            <option value="" disabled>Select Scholarship</option>
            <option value="full">Full Scholarship</option>
            <option value="partial">Partial Scholarship</option>
            <option value="self-funded">Self-Funded</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
            </svg>
          </div>
        </div>

         {/* Programs Input */}
         <div className="relative">
           <input 
            type="text" 
            placeholder="Search Programs" 
            className="w-full h-12 px-4 rounded-lg bg-white/90 border-0 focus:ring-2 focus:ring-brand-red text-gray-700 placeholder:text-gray-500 font-medium"
          />
        </div>

        {/* Intake Select */}
        <div className="relative">
          <select 
            className="w-full h-12 px-4 rounded-lg bg-white/90 border-0 focus:ring-2 focus:ring-brand-red text-gray-700 font-medium appearance-none cursor-pointer"
            defaultValue=""
          >
            <option value="" disabled>Select Intake</option>
            <option value="march">March Intake</option>
            <option value="september">September Intake</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
            </svg>
          </div>
        </div>

        {/* Search Button */}
        <Button 
          className="w-full h-12 bg-brand-blue hover:bg-brand-blue/90 text-white font-bold text-lg rounded-lg shadow-lg flex items-center justify-center gap-2"
        >
          <Search className="w-5 h-5" />
          Search
        </Button>
      </div>
    </motion.div>
  )
}
