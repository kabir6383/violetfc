import React, { createContext, useState, useEffect, useContext } from 'react';

export interface ImageRecord {
  id: string;
  section: string;
  title: string;
  url: string;
}

interface ImageContextType {
  images: ImageRecord[];
  loading: boolean;
  refreshImages: () => Promise<void>;
  getImageUrl: (id: string, fallback: string) => string;
}

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export const ImageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [images, setImages] = useState<ImageRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshImages = async () => {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const storedImages = localStorage.getItem('violet_images');
      if (storedImages) {
        setImages(JSON.parse(storedImages));
      } else {
        // Initialize with defaults if empty
        const defaultImages = [
          { id: 'home-hero', section: 'home', title: 'Hero Background', url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop' },
          { id: 'home-gal-1', section: 'home', title: 'Gallery 1', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop' },
          { id: 'home-gal-2', section: 'home', title: 'Gallery 2', url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1470&auto=format&fit=crop' },
          { id: 'home-gal-3', section: 'home', title: 'Gallery 3', url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1470&auto=format&fit=crop' },
          { id: 'home-gal-4', section: 'home', title: 'Gallery 4', url: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?q=80&w=1374&auto=format&fit=crop' },
          { id: 'workout-aerobic', section: 'workouts', title: 'Aerobic', url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1470&auto=format&fit=crop' },
          { id: 'workout-anaerobic', section: 'workouts', title: 'Anaerobic', url: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1469&auto=format&fit=crop' },
          { id: 'workout-lite', section: 'workouts', title: 'Lite Apparatus', url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1470&auto=format&fit=crop' },
          { id: 'workout-zumba', section: 'workouts', title: 'Zumba', url: 'https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?q=80&w=1470&auto=format&fit=crop' },
          { id: 'workout-own', section: 'workouts', title: 'Own Body Workout', url: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=1470&auto=format&fit=crop' },
          { id: 'nutri-weight-loss', section: 'nutrition', title: 'Weight Loss', url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1453&auto=format&fit=crop' },
          { id: 'nutri-weight-gain', section: 'nutrition', title: 'Weight Gain', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1480&auto=format&fit=crop' },
          { id: 'nutri-health', section: 'nutrition', title: 'Health Conscious', url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1470&auto=format&fit=crop' },
          { id: 'nutri-wellness', section: 'nutrition', title: 'Wellness & Recovery', url: 'https://images.unsplash.com/photo-1478144592103-25e218a04891?q=80&w=1375&auto=format&fit=crop' }
        ];
        localStorage.setItem('violet_images', JSON.stringify(defaultImages));
        setImages(defaultImages);
      }
    } catch (err) {
      console.error('Failed to fetch images', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshImages();
  }, []);

  const getImageUrl = (id: string, fallback: string) => {
    const img = images.find(i => i.id === id);
    return img ? img.url : fallback;
  };

  return (
    <ImageContext.Provider value={{ images, loading, refreshImages, getImageUrl }}>
      {children}
    </ImageContext.Provider>
  );
};

export const useImages = () => {
  const context = useContext(ImageContext);
  if (context === undefined) {
    throw new Error('useImages must be used within an ImageProvider');
  }
  return context;
};
