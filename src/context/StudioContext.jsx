import React, { createContext, useContext, useState, useEffect } from 'react';
import defaultStudioData from '../data/studioData.json';

const StudioContext = createContext();

export function StudioProvider({ children }) {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem('project_unleash_studio_data');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load saved data:', e);
    }
    return defaultStudioData;
  });

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const saveData = (updatedData) => {
    setData(updatedData);
    try {
      localStorage.setItem('project_unleash_studio_data', JSON.stringify(updatedData, null, 2));
      showToast('✨ บันทึกข้อมูลสำเร็จ! แสดงผลทันทีบนหน้าเว็บ', 'success');
    } catch (e) {
      console.error('Failed to save data:', e);
      showToast('❌ ไม่สามารถบันทึกข้อมูลได้', 'error');
    }
  };

  const updateStudioInfo = (newInfo) => {
    const updated = { ...data, studio: { ...data.studio, ...newInfo } };
    saveData(updated);
  };

  const updateGames = (newGames) => {
    const updated = { ...data, games: newGames };
    saveData(updated);
  };

  const updateTeam = (newTeam) => {
    const updated = { ...data, team: newTeam };
    saveData(updated);
  };

  const resetToDefault = () => {
    setData(defaultStudioData);
    localStorage.removeItem('project_unleash_studio_data');
    showToast('🔄 รีเซ็ตข้อมูลกลับเป็นค่าเริ่มต้นแล้ว', 'info');
  };

  const exportJson = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'studioData.json';
    link.click();
    URL.revokeObjectURL(url);
    showToast('💾 ดาวน์โหลด studioData.json เรียบร้อย! นำไปทับในโปรเจกต์แล้ว Git commit ได้เลย', 'success');
  };

  const copyJson = async () => {
    const jsonStr = JSON.stringify(data, null, 2);
    await navigator.clipboard.writeText(jsonStr);
    showToast('📋 คัดลอก JSON ไปยังคลิปบอร์ดแล้ว!', 'success');
  };

  return (
    <StudioContext.Provider
      value={{
        data,
        saveData,
        updateStudioInfo,
        updateGames,
        updateTeam,
        resetToDefault,
        exportJson,
        copyJson,
        isAdminOpen,
        setIsAdminOpen,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </StudioContext.Provider>
  );
}

export const useStudio = () => useContext(StudioContext);
