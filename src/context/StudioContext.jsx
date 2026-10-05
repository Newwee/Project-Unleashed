import React, { createContext, useContext, useState, useEffect } from 'react';
import defaultStudioData from '../data/studioData.json';
import { supabase, adminSignIn, adminSignOut } from '../lib/supabase';

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
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('project_unleash_admin_auth') === 'true';
  });
  const [adminUser, setAdminUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('project_unleash_admin_user') || 'null');
    } catch {
      return null;
    }
  });
  const [toastMessage, setToastMessage] = useState(null);

  // Check Supabase session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setIsAdminLoggedIn(true);
          setAdminUser(session.user);
          localStorage.setItem('project_unleash_admin_auth', 'true');
          localStorage.setItem('project_unleash_admin_user', JSON.stringify(session.user));
        }
      } catch (err) {
        // Fallback to local session
      }
    };
    checkSession();
  }, []);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const loginAdmin = async (email, password) => {
    // 1. Try Supabase Auth first
    if (email && password) {
      try {
        const res = await adminSignIn(email, password);
        if (!res.error && res.data?.user) {
          setIsAdminLoggedIn(true);
          setAdminUser(res.data.user);
          localStorage.setItem('project_unleash_admin_auth', 'true');
          localStorage.setItem('project_unleash_admin_user', JSON.stringify(res.data.user));
          showToast(`🔓 เข้าสู่ระบบ Supabase Admin (${res.data.user.email}) สำเร็จ!`, 'success');
          return { success: true };
        }
      } catch (e) {
        console.warn('Supabase auth attempt error:', e);
      }
    }

    // 2. Fallback Studio Owner Admin PIN/Key
    if (
      (password === 'unleash2026' || password === 'admin' || password === 'norlive') ||
      (email === 'admin@projectunleash.com' && password === 'unleash2026')
    ) {
      const mockAdmin = { email: email || 'admin@projectunleash.com', role: 'owner' };
      setIsAdminLoggedIn(true);
      setAdminUser(mockAdmin);
      localStorage.setItem('project_unleash_admin_auth', 'true');
      localStorage.setItem('project_unleash_admin_user', JSON.stringify(mockAdmin));
      showToast('🔓 เข้าสู่ระบบ Admin สำเร็จ!', 'success');
      return { success: true };
    }

    showToast('❌ อีเมลหรือรหัสผ่าน Admin ไม่ถูกต้อง', 'error');
    return { success: false, error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง (ลองใช้รหัสผ่าน: unleash2026 หรืออีเมล Supabase)' };
  };

  const logoutAdmin = async () => {
    try {
      await adminSignOut();
    } catch (e) {}
    setIsAdminLoggedIn(false);
    setAdminUser(null);
    localStorage.removeItem('project_unleash_admin_auth');
    localStorage.removeItem('project_unleash_admin_user');
    showToast('🔒 ออกจากระบบ Admin เรียบร้อย', 'info');
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
        adminUser,
        loginAdmin,
        logoutAdmin,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </StudioContext.Provider>
  );
}

export const useStudio = () => useContext(StudioContext);
