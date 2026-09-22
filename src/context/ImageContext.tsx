import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { ImageRecord } from '../types';
import { api } from '../services/api';

const defaultImagesList: ImageRecord[] = [
  { id: 'home-hero', section: 'home', title: 'Hero Banner', url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop' },
  { id: 'home-gal-1', section: 'home', title: 'Facility Gym Area', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop' },
  { id: 'home-gal-2', section: 'home', title: 'Studio & Mat Zone', url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1470&auto=format&fit=crop' },
  { id: 'home-gal-3', section: 'home', title: 'Free Weights Corner', url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1470&auto=format&fit=crop' },
  { id: 'home-gal-4', section: 'home', title: 'Cardio Suite', url: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?q=80&w=1374&auto=format&fit=crop' },
  { id: 'workout-aerobic', section: 'workouts', title: 'Aerobic & Cardio', url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1470&auto=format&fit=crop' },
  { id: 'workout-anaerobic', section: 'workouts', title: 'Anaerobic Power', url: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1469&auto=format&fit=crop' },
  { id: 'workout-lite', section: 'workouts', title: 'Resistance & Apparatus', url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1470&auto=format&fit=crop' },
  { id: 'workout-zumba', section: 'workouts', title: 'Zumba Dance', url: 'https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?q=80&w=1470&auto=format&fit=crop' },
  { id: 'workout-own', section: 'workouts', title: 'Calisthenics & Core', url: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=1470&auto=format&fit=crop' },
  { id: 'nutri-weight-loss', section: 'nutrition', title: 'Fat Loss Protocol', url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1453&auto=format&fit=crop' },
  { id: 'nutri-weight-gain', section: 'nutrition', title: 'Muscle Mass Plan', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1480&auto=format&fit=crop' },
  { id: 'nutri-health', section: 'nutrition', title: 'Vitality & Whole Foods', url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1470&auto=format&fit=crop' },
  { id: 'nutri-wellness', section: 'nutrition', title: 'Anti-Inflammatory Plan', url: 'https://images.unsplash.com/photo-1478144592103-25e218a04891?q=80&w=1375&auto=format&fit=crop' },
  { id: 'before-pic', section: 'transformations', title: 'Member Before', url: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1469&auto=format&fit=crop' },
  { id: 'after-pic', section: 'transformations', title: 'Member After', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop' }
];

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

  const refreshImages = useCallback(async () => {
    try {
      const fetched = await api.getImages();
      if (fetched && fetched.length > 0) {
        setImages(fetched);
        localStorage.setItem('violet_images', JSON.stringify(fetched));
      } else {
        const stored = localStorage.getItem('violet_images');
        if (stored) {
          setImages(JSON.parse(stored));
        } else {
          setImages(defaultImagesList);
          localStorage.setItem('violet_images', JSON.stringify(defaultImagesList));
        }
      }
    } catch (err) {
      console.error('Image fetch error', err);
      const stored = localStorage.getItem('violet_images');
      setImages(stored ? JSON.parse(stored) : defaultImagesList);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshImages();
  }, [refreshImages]);

  const getImageUrl = (id: string, fallback: string) => {
    const img = images.find((i) => i.id === id);
    return img?.url ? img.url : fallback;
  };

  return (
    <ImageContext.Provider value={{ images, loading, refreshImages, getImageUrl }}>
      {children}
    </ImageContext.Provider>
  );
};

export const useImages = () => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error('useImages must be used within ImageProvider');
  }
  return context;
};
