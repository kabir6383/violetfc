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
      const res = await fetch('/api/images');
      if (res.ok) {
        const data = await res.json();
        setImages(data);
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
