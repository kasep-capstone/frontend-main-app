'use client'
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { MenuBarTop } from '@/components/menu-bar-top';
import { MenuBar } from '@/components/menu-bar';

export default function BmiPage() {
  const [height, setHeight] = useState('170');
  const [weight, setWeight] = useState('80');

  const handleSave = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <>
      <MenuBarTop />
      <div
        className="flex flex-col justify-center items-center h-full"
        style={{
          backgroundImage: 'url(/bg-batik.svg)',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      >
        <div className="flex flex-col items-center mt-20 text-white">
          <div className="w-60 h-60 bg-amber-800 mb-6 flex items-center justify-center text-sm rounded-lg text-6xl md:text-5xl sm:text-4xl font-bold">
            Text
          </div>
          <div className="w-60 h-20 bg-amber-800 mb-6 flex items-center justify-center text-sm rounded-lg text-xl font-bold">
            Text
          </div>
          <div className="w-64 h-8 bg-amber-800 mb-6 flex items-center justify-center text-sm rounded-lg text-lg font-bold">
            Text
          </div>
          <div className="w-72 h-8 bg-amber-800 flex items-center justify-center text-sm rounded-lg text-lg font-bold">
            Text
          </div>
        </div>

        {/* section untuk bagian bawah*/}
        <div className="relative flex justify-center items-center h-full w-full mt-36">
          <div
            className="w-full h-screen bg-amber-800 p-8 flex flex-col items-center"
            style={{
              borderTopLeftRadius: '100px',
              borderTopRightRadius: '100px',
            }}
          >
            <div className="flex flex-col items-center w-full mt-20">
              <div className="text-gray-200 text-lg mt-8">Pengukuran Terkini</div>
              <div className="flex items-center justify-center w-full">
                {/* Siluet Gambar */}
                <img src="/boy-siluet.png" alt="Boy Silhouette" className="w-32 h-96 object-contain mr-8" />
                <div className="flex flex-col justify-center">
                  {/* Tinggi */}
                  <div className="flex items-center mb-8">
                    <div className="flex flex-col text-white items-center">
                      <div className="flex flex-col items-center mr-4">
                        <div className="w-0 h-0 border-x-8 border-x-transparent border-b-[16px] border-gray-400"></div>
                        <div className="w-1 h-16 bg-gray-400"></div>
                      </div>
                      <div className="text-5xl font-bold mt-3 text-center">
                        <input
                          type="number"
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                          className="w-24 bg-transparent text-5xl font-bold focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <span className="sm:text-lg font-normal ml-[-10px]">cm</span>
                      </div>
                      <span className="text-sm text-gray-300 mb-3">Height</span>
                      <div className="flex flex-col items-center mr-4">
                        <div className="w-1 h-16 bg-gray-400"></div>
                        <div className="w-0 h-0 border-x-8 border-x-transparent border-t-[16px] border-gray-400"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Berat */}
              <div className="flex flex-col text-white max-w-10 items-end">
                <div className='flex flex-col items-center'>
                  <div className="flex items-center ml-4">
                    <div className="w-0 h-0 border-y-8 border-y-transparent border-r-[16px] border-gray-400"></div>
                    <div className="w-36 h-1 bg-gray-400"></div>
                    <div className="w-0 h-0 border-y-8 border-y-transparent border-l-[16px] border-gray-400"></div>
                  </div>
                  <div className="text-5xl font-bold mt-3 text-center">
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-20 bg-transparent text-5xl font-bold focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="sm:text-lg font-normal ml-[-10px]">kg</span>
                  </div>
                  <span className="text-sm text-gray-300 mt-1">Weight</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className="mt-8 px-8 py-3 bg-amber-600 text-white rounded-full font-semibold shadow-lg hover:bg-amber-700 transition-colors"
              >
                Simpan Pengukuran
              </motion.button>

            </div>
          </div>
          <div
            className="absolute w-40 h-40 bg-gray-200 rounded-full flex items-center justify-center text-center"
            style={{
              top: '-80px',
              left: '50%',
              transform: 'translateX(-50%)',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
            }}
          >ini diisi apaan bang</div>
        </div>
        <MenuBar/>
      </div>
    </>
  );
};