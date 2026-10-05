import React, { createContext, useContext, useState, useEffect } from 'react';
import defaultStudioData from '../data/studioData.json';
import { supabase, fetchStudioContentFromSupabase, saveStudioContentToSupabase } from '../lib/supabase';
import { trackVisitor, getVisitorAnalytics } from '../lib/tracker';

const StudioContext = createContext();

export function StudioProvider({ children }) {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem('project_unleash_studio_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.team && parsed.team.some(m => m.role === 'OWNER / VFX')) {
          return parsed;
        }
      }
    } catch (e) {}
    return defaultStudioData;
  });

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('project_unleash_admin_auth') === 'true';
  });
  const [analytics, setAnalytics] = useState(null);
  const [currentVisitor, setCurrentVisitor] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [isSupabaseSynced, setIsSupabaseSynced] = useState(false);

  // Initialize Anonymous Visitor Tracking & Supabase Content on load
  useEffect(() => {
    const initApp = async () => {
      // 1. Track current visitor anonymously
      const visitorInfo = await trackVisitor();
      if (visitorInfo) {
        setCurrentVisitor(visitorInfo);
      }

      // 2. Fetch latest content from Supabase
      const res = await fetchStudioContentFromSupabase();
      if (res.data) {
        setData(res.data);
        localStorage.setItem('project_unleash_studio_data', JSON.stringify(res.data, null, 2));
        setIsSupabaseSynced(true);
      }

      // 3. Load initial analytics
      loadAnalytics();
    };

    initApp();
  }, []);

  const loadAnalytics = async () => {
    const stats = await getVisitorAnalytics();
    setAnalytics(stats);
  };

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Admin Login via Secret Key or Supabase Credentials
  const loginAdmin = async (keyOrPassword) => {
    const input = (keyOrPassword || '').trim();

    // Accepted keys: project ref, unleash2026, admin, norlive, or custom
    if (
      input === 'unleash2026' ||
      input === 'buhkbqyoligheglutrlc' ||
      input === 'admin' ||
      input === 'norlive'
    ) {
      setIsAdminLoggedIn(true);
      localStorage.setItem('project_unleash_admin_auth', 'true');
      showToast('🔓 ยืนยันสิทธิ์ Admin สำเร็จ! ยินดีต้อนรับสู่ระบบหลังบ้าน', 'success');
      loadAnalytics();
      return { success: true };
    }

    showToast('❌ รหัส Admin ไม่ถูกต้อง', 'error');
    return { success: false, error: 'รหัสผ่าน Admin ไม่ถูกต้อง (ลองใช้รหัส: unleash2026 หรือ Project Ref Supabase)' };
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('project_unleash_admin_auth');
    showToast('🔒 ออกจากระบบ Admin เรียบร้อย', 'info');
  };

  // Save data to Supabase and LocalStorage
  const saveData = async (updatedData) => {
    setData(updatedData);

    // 1. Save to LocalStorage
    try {
      localStorage.setItem('project_unleash_studio_data', JSON.stringify(updatedData, null, 2));
    } catch (e) {}

    // 2. Sync to Supabase
    const { success, error } = await saveStudioContentToSupabase(updatedData);
    if (success) {
      setIsSupabaseSynced(true);
      showToast('⚡ บันทึกและซิงค์ขึ้น Supabase เรียบร้อย! ผู้ชมทุกคนจะเห็นข้อมูลใหม่ทันที', 'success');
    } else {
      showToast('✨ บันทึกในเบราว์เซอร์สำเร็จ (พร้อมอัปโหลดขึ้น Supabase เมื่อรัน SQL แล้ว)', 'info');
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
    saveStudioContentToSupabase(defaultStudioData);
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
    showToast('💾 ดาวน์โหลด studioData.json เรียบร้อย! นำไปทับใน src/data แล้ว Git commit ได้เลย', 'success');
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
        isAdminLoggedIn,
        loginAdmin,
        logoutAdmin,
        analytics,
        loadAnalytics,
        currentVisitor,
        isSupabaseSynced,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </StudioContext.Provider>
  );
}

export const useStudio = () => useContext(StudioContext);
