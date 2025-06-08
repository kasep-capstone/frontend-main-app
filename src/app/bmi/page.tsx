'use client'
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { MenuBarTop } from '@/components/menu-bar-top';
import { MenuBar } from '@/components/menu-bar';

export default function BmiPage() {
  const [height, setHeight] = useState('170');
  const [weight, setWeight] = useState('80');
  const [age, setAge] = useState('25');
  const [gender, setGender] = useState('male');

  // Fungsi untuk menghitung BMI
  const calculateBMI = () => {
    const heightInMeters = parseFloat(height) / 100;
    const weightInKg = parseFloat(weight);
    if (heightInMeters > 0 && weightInKg > 0) {
      return (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
    }
    return '0.0';
  };

  // Fungsi untuk menghitung BMR (Basal Metabolic Rate)
  const calculateBMR = () => {
    const weightInKg = parseFloat(weight);
    const heightInCm = parseFloat(height);
    const ageInYears = parseFloat(age);
    
    if (gender === 'male') {
      return Math.round(88.362 + (13.397 * weightInKg) + (4.799 * heightInCm) - (5.677 * ageInYears));
    } else {
      return Math.round(447.593 + (9.247 * weightInKg) + (3.098 * heightInCm) - (4.330 * ageInYears));
    }
  };

  // Fungsi untuk mendapatkan target kalori berdasarkan BMI
  const getTargetCalories = (bmi: number) => {
    const bmr = calculateBMR();
    const dailyCalories = bmr * 1.4; // Asumsi aktivitas sedang
    
    if (bmi < 18.5) {
      // Underweight - perlu surplus kalori
      return Math.round(dailyCalories + 300);
    } else if (bmi < 25) {
      // Normal - maintenance
      return Math.round(dailyCalories);
    } else if (bmi < 30) {
      // Overweight - deficit kalori ringan
      return Math.round(dailyCalories - 300);
    } else {
      // Obese - deficit kalori sedang
      return Math.round(dailyCalories - 500);
    }
  };

  // Fungsi untuk mendapatkan kategori BMI
  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };

  // Fungsi untuk mendapatkan status kesehatan
  const getHealthStatus = (bmi: number) => {
    if (bmi < 18.5) return 'Berat Badan Kurang';
    if (bmi < 25) return 'Berat Badan Ideal';
    if (bmi < 30) return 'Berat Badan Berlebih';
    return 'Obesitas';
  };

  const bmiValue = parseFloat(calculateBMI());
  const bmiCategory = getBMICategory(bmiValue);
  const healthStatus = getHealthStatus(bmiValue);
  const targetCalories = getTargetCalories(bmiValue);

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
        className="flex flex-col justify-center items-center h-full relative"
        style={{
          backgroundImage: 'url(/bg-batik.svg)',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay untuk membuat background lebih soft */}
        <div className="absolute inset-0 bg-white/70 pointer-events-none"></div>
        <div className="relative z-10 w-full h-full flex flex-col justify-center items-center">
        <div className="flex flex-col items-center mt-20">
          <div className="w-60 h-60 bg-amber-50 border border-amber-200 mb-6 flex flex-col items-center justify-center text-sm rounded-lg font-bold shadow-lg">
            <div className="text-4xl md:text-3xl sm:text-2xl text-amber-600">{targetCalories.toLocaleString()}</div>
            <div className="text-lg mt-2 text-amber-600">kalori</div>
          </div>
          <div className="w-60 h-20 bg-amber-100 mb-6 flex items-center justify-center text-sm rounded-lg text-xl font-bold text-amber-700 shadow-md">
            Target Kalori Harian
          </div>
          <div className="w-64 h-8 bg-blue-50 mb-6 flex items-center justify-center text-sm rounded-lg text-lg font-bold text-blue-600 shadow-sm">
            BMI: {calculateBMI()} ({bmiCategory})
          </div>
          <div className="w-72 h-8 bg-green-50 flex items-center justify-center text-sm rounded-lg text-lg font-bold text-green-600 shadow-sm">
            {healthStatus}
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
              
              {/* Input Umur dan Jenis Kelamin */}
              <div className="flex gap-4 mb-6 mt-4">
                <div className="flex flex-col items-center">
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="25"
                    className="w-16 h-12 bg-amber-700 text-white text-center rounded-lg font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="text-xs text-gray-300 mt-1">Umur</span>
                </div>
                <div className="flex flex-col items-center">
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-20 h-12 bg-amber-700 text-white text-center rounded-lg font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="male">Pria</option>
                    <option value="female">Wanita</option>
                  </select>
                  <span className="text-xs text-gray-300 mt-1">Gender</span>
                </div>
              </div>
              <div className="flex items-center justify-center w-full">
                {/* Siluet Gambar */}
                <img src="/boy-siluet.png" alt="Boy Silhouette" className="w-32 h-96 object-contain mr-8 opacity-60 filter drop-shadow-lg transition-all duration-300 hover:opacity-80" />
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
            className="absolute w-40 h-40 bg-gray-200 rounded-full flex flex-col items-center justify-center text-center text-gray-800"
            style={{
              top: '-80px',
              left: '50%',
              transform: 'translateX(-50%)',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div className="text-2xl font-bold">{targetCalories.toLocaleString()}</div>
            <div className="text-sm font-medium">Kalori</div>
            <div className="text-xs">Target Harian</div>
          </div>
        </div>
        <MenuBar/>
        </div>
      </div>
    </>
  );
};