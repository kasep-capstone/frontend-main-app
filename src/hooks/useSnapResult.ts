import { useState, useEffect } from 'react';

interface RecipeStep {
  instruction: string;
  image: string[];
}

interface Recipe {
  title: string;
  mainImage: string;
  calories: number;
  usedMaterial: string[];
  unusedMaterial: string[];
  missingMaterial: string[];
  material: string[];
  description: string;
  step: RecipeStep[];
}

export interface SnapResult {
  date: string;
  userId: string;
  snaped: string;
  material_detected: string[];
  receipts: Recipe[];
}

export const useSnapResult = () => {
  const [snapResult, setSnapResult] = useState<SnapResult | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // TODO: Replace with actual API call
    // This is mock data for demonstration
    setSnapResult({
      date: "2025-05-19T19:05:45",
      userId: "uuid",
      snaped: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=2070&auto=format&fit=crop",
      material_detected: ["bawang merah", "bawang putih", "gula", "jeruk purut"],
      receipts: [
        {
          title: "soto ayam",
          mainImage: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=2070&auto=format&fit=crop",
          calories: 1500,
          usedMaterial: ["bawang merah", "bawang putih"],
          unusedMaterial: ["merica", "garam"],
          missingMaterial: ["gula", "jeruk purut"],
          material: ["bawang merah", "bawang putih", "gula", "jeruk purut"],
          description: "Soto ayam adalah hidangan sup ayam khas Indonesia yang terkenal dengan kuah beningnya yang gurih dan segar.",
          step: [
            {
              instruction: "Siapkan bumbu-bumbu seperti bawang merah, bawang putih, dan bumbu lainnya.",
              image: [
                "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=2070&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=2071&auto=format&fit=crop"
              ],
            },
            {
              instruction: "Rebus ayam dengan bumbu-bumbu hingga matang dan kuah menjadi bening.",
              image: [
                "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=2070&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=2071&auto=format&fit=crop"
              ],
            },
          ],
        },
        {
          title: "sop ayam",
          mainImage: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=2071&auto=format&fit=crop",
          calories: 1500,
          usedMaterial: ["bawang merah", "bawang putih"],
          unusedMaterial: ["merica", "garam"],
          missingMaterial: ["gula", "jeruk purut"],
          material: ["bawang merah", "bawang putih", "gula", "jeruk purut"],
          description: "Sop ayam adalah hidangan sup ayam yang lezat dengan berbagai sayuran segar.",
          step: [
            {
              instruction: "Potong ayam dan sayuran sesuai ukuran yang diinginkan.",
              image: [
                "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=2070&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=2071&auto=format&fit=crop"
              ],
            },
            {
              instruction: "Masak ayam dan sayuran dalam air mendidih hingga matang.",
              image: [
                "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=2070&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=2071&auto=format&fit=crop"
              ],
            },
          ],
        },
      ],
    });
  }, []);

  return {
    snapResult,
    isVisible,
  };
}; 