import { useSaleStore } from '@/stores';
import React, { useState, useEffect } from 'react';

const KeyCombinationDetector: React.FC = () => {
    const resetForm = useSaleStore(state=>state.resetForm)
  const handleKeyDown = (event: KeyboardEvent) => {
    console.log(event)
    // Aquí puedes verificar las combinaciones de teclas.
    if (event.key === 'c') {
      // Ejecuta alguna acción cuando se presiona Ctrl + S.
       resetForm();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div>
     
    </div>
  );
};

export default KeyCombinationDetector;
