import React, { useState, useEffect } from 'react';
import { useStudio } from '../context/StudioContext';
import {
  X,
  Save,
  Download,
  Copy,
  Plus,
  Trash2,
  GitBranch,
  Settings,
  Gamepad2,
  Users,
  Check,
  RefreshCw,
  Upload,
  AlertCircle,
  Lock,
  Unlock,
  LogOut,
  Database,
  KeyRound,
  BarChart3,
  Globe,
  Monitor,
  Smartphone,
  Eye,
  TrendingUp,
  UserCheck
} from 'lucide-react';

export default function AdminModal() {
  const {
    data,
    saveData,
    exportJson,
    copyJson,
    resetToDefault,
    isAdminOpen,
    setIsAdminOpen,
    isAdminLoggedIn,
    loginAdmin,
    logoutAdmin,
    analytics,
    loadAnalytics,
    currentVisitor,
    isSupabaseSynced,
    showToast
  } = useStudio();

  if (!isAdminOpen) return null;

  // Login form state
  const [adminPasskey, setAdminPasskey] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // CMS form state
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'team' | 'games' | 'studio' | 'supabase' | 'git'
  const [formData, setFormData] = useState(JSON.parse(JSON.stringify(data)));
  const [gitCopied, setGitCopied] = useState(false);
  const [sqlCopied, setSqlCopied] = useState(false);

  useEffect(() => {
    if (isAdminLoggedIn) {
      loadAnalytics();
    }
  }, [isAdminLoggedIn]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    const result = await loginAdmin(adminPasskey);
    setIsLoggingIn(false);
    if (!result.success) {
      setLoginError(result.error || 'รหัสผ่านไม่ถูกต้อง');
    }
  };

  // Studio handlers
  const handleStudioChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      studio: { ...prev.studio, [field]: value },
    }));
  };

  // Image file handler for GIF, PNG, JPG, JPEG
  const handleImageUpload = (file, callback) => {
    if (!file) return;
    const allowed = ['image/gif', 'image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowed.includes(file.type)) {
      showToast('⚠️ กรุณาเลือกไฟล์ภาพประเภท .gif, .png, .jpg, .jpeg เท่านั้น', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      callback(e.target.result);
      showToast(`🖼️ อัปโหลดภาพ ${file.name} เรียบร้อย!`, 'success');
    };
    reader.readAsDataURL(file);
  };

  // Games handlers
  const handleGameChange = (index, field, value) => {
    setFormData((prev) => {
      const games = [...prev.games];
      games[index] = { ...games[index], [field]: value };
      return { ...prev, games };
    });
  };

  const handleAddGame = () => {
    const newGame = {
      id: `game-${Date.now()}`,
      title: 'New Roblox Game',
      status: 'IN DEVELOPMENT',
      statusTag: 'IN DEVELOPMENT & PLANNING',
      genre: 'Anime Combat / Action RPG',
      coverUrl: '/LogoMap.png',
      description: 'Exciting new Roblox anime battle title under active development.',
      tags: ['Roblox', 'Action', 'Anime', 'VFX'],
      playUrl: formData.studio.robloxGroupUrl,
    };
    setFormData((prev) => ({ ...prev, games: [...prev.games, newGame] }));
  };

  const handleDeleteGame = (index) => {
    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบเกมนี้?')) {
      setFormData((prev) => {
        const games = prev.games.filter((_, i) => i !== index);
        return { ...prev, games };
      });
    }
  };

  // Team handlers
  const handleMemberChange = (index, field, value) => {
    setFormData((prev) => {
      const team = [...prev.team];
      team[index] = { ...team[index], [field]: value };
      return { ...prev, team };
    });
  };

  const handleAddMember = () => {
    const newMember = {
      id: `member-${Date.now()}`,
      name: 'New Staff',
      handle: '@RobloxUsername',
      role: 'DEVELOPER',
      category: 'DEVELOPERS',
      avatarUrl: '/duck.gif',
      robloxUrl: 'https://www.roblox.com',
      bio: 'Roblox developer crafting high quality mechanics and features.',
    };
    setFormData((prev) => ({ ...prev, team: [...prev.team, newMember] }));
    showToast('➕ เพิ่มสมาชิกใหม่แล้ว! กรุณากรอกข้อมูลและบันทึก', 'info');
  };

  const handleDeleteMember = (index) => {
    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบสมาชิกคนนี้?')) {
      setFormData((prev) => {
        const team = prev.team.filter((_, i) => i !== index);
        return { ...prev, team };
      });
    }
  };

  const handleSave = async () => {
    await saveData(formData);
    setIsAdminOpen(false);
  };

  const copyGitCommand = () => {
    const cmd = `git add src/data/studioData.json\ngit commit -m "Update studio configuration and members"\ngit push origin main`;
    navigator.clipboard.writeText(cmd);
    setGitCopied(true);
    showToast('📋 คัดลอกคำสั่ง Git เรียบร้อย!', 'success');
    setTimeout(() => setGitCopied(false), 2000);
  };

  const copySqlSchema = () => {
    const sql = `-- Run in Supabase SQL Editor:
CREATE TABLE IF NOT EXISTS public.studio_content (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.studio_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read" ON public.studio_content FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public Upsert" ON public.studio_content FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.site_visitors (
  visitor_code TEXT PRIMARY KEY,
  visit_count INT DEFAULT 1 NOT NULL,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  referrer TEXT,
  first_visit_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  last_visit_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.site_visitors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Upsert" ON public.site_visitors FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);`;
    navigator.clipboard.writeText(sql);
    setSqlCopied(true);
    showToast('📋 คัดลอก SQL สำหรับ Supabase เรียบร้อย!', 'success');
    setTimeout(() => setSqlCopied(false), 2000);
  };

  // ------------------ LOGIN SCREEN (When not authenticated) ------------------
  if (!isAdminLoggedIn) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <div className="relative w-full max-w-md bg-[#0b1428] border border-sky-500/30 rounded-3xl shadow-[0_0_60px_rgba(56,189,248,0.25)] p-7 overflow-hidden">
          
          <button
            onClick={() => setIsAdminOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center text-center space-y-3 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-sky-950/60 border border-sky-500/40 flex items-center justify-center text-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.3)]">
              <Lock className="w-7 h-7" />
            </div>
            
            <h2 className="text-2xl font-bold font-display text-white">
              ระบบหลังบ้าน Admin Dashboard
            </h2>
            
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950/40 border border-sky-500/25 text-[11px] font-mono text-sky-300">
              <Database className="w-3 h-3 text-cyan-400" />
              <span>Supabase Ref: buhkbqyoligheglutrlc</span>
            </div>
            
            <p className="text-xs text-gray-400 font-sans leading-relaxed">
              เว็บไซต์นี้เป็นเว็บสาธารณะ <strong>ไม่มีระบบ Login/Register สำหรับคนทั่วไป</strong> เข้าได้เฉพาะผู้ดูแลที่ถือสิทธิ์ Supabase เท่านั้น
            </p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs font-mono">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1">
                รหัสผ่าน Admin / Passkey ผู้ดูแล Supabase
              </label>
              <input
                type="password"
                placeholder="กรอกรหัสผ่าน Admin หรือ Project Ref..."
                value={adminPasskey}
                onChange={(e) => setAdminPasskey(e.target.value)}
                required
                className="w-full bg-[#070d1a] border border-sky-500/25 rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-sky-400 outline-none"
              />
            </div>

            <div className="p-3 rounded-xl bg-sky-950/30 border border-sky-500/15 text-[11px] font-mono text-sky-300/80 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-sky-400 flex-shrink-0" />
              <span>รหัสผ่าน Master: <strong className="text-white">unleash2026</strong> หรือใส่ Project Ref</span>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 rounded-xl font-mono text-xs font-bold tracking-wider uppercase text-white bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-cyan-500 shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-all flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>{isLoggingIn ? 'กำลังตรวจสอบ...' : 'เข้าสู่หน้า Admin Dashboard'}</span>
            </button>
          </form>

        </div>
      </div>
    );
  }

  // ------------------ FULL CMS DASHBOARD (When Authenticated) ------------------
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#0b1428] border border-sky-500/30 rounded-2xl shadow-[0_0_60px_rgba(56,189,248,0.25)] flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-sky-500/15 flex items-center justify-between bg-[#0e1933]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
                <span>Project Unleash — Admin Control Center</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300">
                  {isSupabaseSynced ? 'SUPABASE SYNCED' : 'SUPABASE CONNECTED'}
                </span>
              </h2>
              <p className="text-xs font-mono text-gray-400">
                รหัสของคุณ: {currentVisitor?.visitor_code || 'UNL-ADMIN'} • อัปเดตข้อมูลขึ้น Supabase & ดูสถิติคนเข้าชม
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={logoutAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 text-xs font-mono"
              title="ออกจากระบบ Admin"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap border-b border-sky-500/15 px-6 bg-[#081020] gap-2">
          {[
            { id: 'analytics', label: '📊 สถิติผู้เข้าชม (Visitor Analytics)', icon: <BarChart3 className="w-4 h-4 text-cyan-400" /> },
            { id: 'team', label: `👥 จัดการสมาชิก (${formData.team.length})`, icon: <Users className="w-4 h-4" /> },
            { id: 'games', label: `🎮 จัดการเกม (${formData.games.length})`, icon: <Gamepad2 className="w-4 h-4" /> },
            { id: 'studio', label: '🎨 ปรับแต่งหน้าเว็บ & ข้อความ', icon: <Settings className="w-4 h-4" /> },
            { id: 'supabase', label: '⚡ Supabase Database & SQL', icon: <Database className="w-4 h-4 text-sky-400" /> },
            { id: 'git', label: '🐙 Git & GitHub', icon: <GitBranch className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-mono font-medium border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-sky-400 text-sky-300 bg-sky-950/40'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Modal Body / Tab Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm font-sans">
          
          {/* TAB 1: VISITOR ANALYTICS DASHBOARD (What User Asked For!) */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              
              {/* Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-[#0e1933] border border-sky-500/20 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-gray-400 text-xs font-mono">
                    <span>ผู้เข้าชมทั้งหมด (Unique)</span>
                    <Users className="w-4 h-4 text-sky-400" />
                  </div>
                  <div className="mt-2 text-2xl sm:text-3xl font-display font-black text-white">
                    {analytics?.totalVisitors || 1} <span className="text-xs font-mono text-gray-400 font-normal">คน</span>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 mt-1">
                    รหัส Unique ไม่ต้องล็อกอิน
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#0e1933] border border-sky-500/20 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-gray-400 text-xs font-mono">
                    <span>เปิดดูทั้งหมด (Pageviews)</span>
                    <Eye className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="mt-2 text-2xl sm:text-3xl font-display font-black text-white">
                    {analytics?.totalVisits || 1} <span className="text-xs font-mono text-gray-400 font-normal">ครั้ง</span>
                  </div>
                  <span className="text-[10px] font-mono text-sky-400 mt-1">
                    ยอดรวมทุกการเปิดดู
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#0e1933] border border-sky-500/20 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-gray-400 text-xs font-mono">
                    <span>กลับมาดูซ้ำ (Returning)</span>
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="mt-2 text-2xl sm:text-3xl font-display font-black text-emerald-400">
                    {analytics?.returningVisitors || 0} <span className="text-xs font-mono text-gray-400 font-normal">คน ({analytics?.returningRate || 0}%)</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-300 mt-1">
                    คนเดิมที่เข้ามามากกว่า 1 ครั้ง
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#0e1933] border border-sky-500/20 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-gray-400 text-xs font-mono">
                    <span>ผู้ชมใหม่ (New Visitors)</span>
                    <UserCheck className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="mt-2 text-2xl sm:text-3xl font-display font-black text-purple-300">
                    {analytics?.newVisitors || 1} <span className="text-xs font-mono text-gray-400 font-normal">คน</span>
                  </div>
                  <span className="text-[10px] font-mono text-purple-400 mt-1">
                    เข้ามาครั้งแรก
                  </span>
                </div>
              </div>

              {/* Your Own Visitor ID Banner */}
              <div className="p-4 rounded-xl bg-sky-950/40 border border-sky-500/30 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-sky-500/20 text-sky-400">
                    <Monitor className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-gray-400">
                      รหัสประจำเครื่องของคุณ (Your Anonymous Visitor ID):
                    </div>
                    <div className="text-sm font-mono font-bold text-white flex items-center gap-2">
                      <span className="text-cyan-300">{currentVisitor?.visitor_code || 'UNL-CURRENT'}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-sky-900/60 border border-sky-500/40 text-sky-300 font-normal">
                        คุณเข้าชมมาแล้ว {currentVisitor?.visit_count || 1} ครั้ง
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={loadAnalytics}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600/30 hover:bg-sky-600/50 border border-sky-500/40 text-sky-300 text-xs font-mono"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>รีเฟรชสถิติ</span>
                </button>
              </div>

              {/* Detailed Visitors Table */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider">
                    // รายชื่อและประวัติผู้เข้าชมล่าสุด (Realtime Visitor Logs)
                  </h4>
                  <span className="text-[11px] font-mono text-gray-400">
                    ดึงค่าจาก Supabase / Device Fingerprint อัตโนมัติ
                  </span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-sky-500/20 bg-[#081020]">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-[#0e1933] text-gray-300 border-b border-sky-500/15">
                      <tr>
                        <th className="py-3 px-4">รหัสผู้เข้าชม (Visitor Code)</th>
                        <th className="py-3 px-4">จำนวนครั้งที่ดู</th>
                        <th className="py-3 px-4">สถานะ</th>
                        <th className="py-3 px-4">อุปกรณ์ & OS</th>
                        <th className="py-3 px-4">เบราว์เซอร์</th>
                        <th className="py-3 px-4">แหล่งที่มา (Referrer)</th>
                        <th className="py-3 px-4">เวลาที่เข้าชมล่าสุด</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sky-500/10">
                      {analytics?.visitors?.map((v, i) => {
                        const isReturning = (v.visit_count || 1) > 1;
                        return (
                          <tr key={i} className="hover:bg-sky-950/20 transition-colors">
                            <td className="py-3 px-4 font-bold text-sky-300">
                              {v.visitor_code}
                              {v.visitor_code === currentVisitor?.visitor_code && (
                                <span className="ml-1.5 text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                                  คุณ
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 font-bold text-white">
                              {v.visit_count || 1} ครั้ง
                            </td>
                            <td className="py-3 px-4">
                              {isReturning ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-[10px]">
                                  🔄 กลับมาดูซ้ำ
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-950/60 border border-sky-500/40 text-sky-300 text-[10px]">
                                  🆕 ผู้ชมใหม่
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-gray-300">
                              {v.os} • {v.device_type}
                            </td>
                            <td className="py-3 px-4 text-gray-300">
                              {v.browser}
                            </td>
                            <td className="py-3 px-4 text-cyan-300/90">
                              {v.referrer || 'Direct'}
                            </td>
                            <td className="py-3 px-4 text-gray-400">
                              {v.last_visit_at ? new Date(v.last_visit_at).toLocaleTimeString() : 'เพิ่งเข้ามา'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: TEAM MEMBERS (What User Asked For: เพิ่มสมาชิกที่ทำงานได้ & เปลี่ยนรูป) */}
          {activeTab === 'team' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-bold font-display text-white">
                    รายชื่อสมาชิกในทีม (Studio Team & Staff)
                  </h3>
                  <p className="text-xs text-gray-400 font-sans">
                    เพิ่ม/แก้ไขสมาชิก, เปลี่ยนรูปโปรไฟล์ (รองรับ GIF, PNG, JPG, JPEG) และอัปลง Supabase
                  </p>
                </div>
                <button
                  onClick={handleAddMember}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-cyan-500 text-white font-mono text-xs font-bold shadow-[0_0_15px_rgba(56,189,248,0.3)] transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>เพิ่มสมาชิกใหม่</span>
                </button>
              </div>

              <div className="space-y-4">
                {formData.team.map((member, index) => (
                  <div
                    key={member.id}
                    className="p-5 rounded-2xl bg-[#0e1933] border border-sky-500/20 space-y-4 hover:border-sky-500/40 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-sky-400/40 bg-black flex-shrink-0 shadow-[0_0_10px_rgba(56,189,248,0.25)]">
                          <img
                            src={member.avatarUrl}
                            alt={member.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/LogoMap.png';
                            }}
                          />
                        </div>
                        <div>
                          <span className="text-sm font-bold text-white font-display">
                            {member.name} ({member.handle})
                          </span>
                          <span className="block text-[11px] font-mono text-sky-400">
                            บทบาท: {member.role} • หมวดหมู่: {member.category}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteMember(index)}
                        className="text-red-400 hover:text-red-300 p-2 rounded-xl hover:bg-red-950/40 transition-colors"
                        title="ลบสมาชิกคนนี้"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs font-mono text-gray-300 mb-1">
                          ชื่อที่แสดง (Display Name)
                        </label>
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                          className="w-full bg-[#070d1a] border border-sky-500/20 rounded-xl px-3 py-2 text-white text-xs focus:border-sky-400 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-gray-300 mb-1">
                          Roblox Handle (@...)
                        </label>
                        <input
                          type="text"
                          value={member.handle}
                          onChange={(e) => handleMemberChange(index, 'handle', e.target.value)}
                          className="w-full bg-[#070d1a] border border-sky-500/20 rounded-xl px-3 py-2 text-white text-xs focus:border-sky-400 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-gray-300 mb-1">
                          ตำแหน่ง / บทบาท (Role)
                        </label>
                        <input
                          type="text"
                          value={member.role}
                          onChange={(e) => handleMemberChange(index, 'role', e.target.value)}
                          className="w-full bg-[#070d1a] border border-sky-500/20 rounded-xl px-3 py-2 text-white text-xs focus:border-sky-400 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-gray-300 mb-1">
                          หมวดหมู่ (Category Tab)
                        </label>
                        <select
                          value={member.category}
                          onChange={(e) => handleMemberChange(index, 'category', e.target.value)}
                          className="w-full bg-[#070d1a] border border-sky-500/20 rounded-xl px-3 py-2 text-white text-xs focus:border-sky-400 outline-none"
                        >
                          <option value="OWNER">OWNER</option>
                          <option value="DEVELOPERS">DEVELOPERS</option>
                          <option value="MODELERS">MODELERS</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-mono text-gray-300 mb-1">
                          Roblox Profile URL
                        </label>
                        <input
                          type="text"
                          value={member.robloxUrl}
                          onChange={(e) => handleMemberChange(index, 'robloxUrl', e.target.value)}
                          className="w-full bg-[#070d1a] border border-sky-500/20 rounded-xl px-3 py-2 text-white text-xs focus:border-sky-400 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-gray-300 mb-1">
                          รูปโปรไฟล์ (รองรับ GIF ภาพขยับ, PNG, JPG, JPEG)
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={member.avatarUrl}
                            onChange={(e) => handleMemberChange(index, 'avatarUrl', e.target.value)}
                            className="flex-1 bg-[#070d1a] border border-sky-500/20 rounded-xl px-3 py-2 text-white text-xs focus:border-sky-400 outline-none"
                          />
                          <label className="cursor-pointer px-3 py-2 bg-sky-950/60 hover:bg-sky-900 border border-sky-500/40 rounded-xl flex items-center justify-center text-sky-300 text-xs font-mono">
                            <Upload className="w-3.5 h-3.5 mr-1" />
                            <span>Upload รูป</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                handleImageUpload(e.target.files[0], (dataUrl) =>
                                  handleMemberChange(index, 'avatarUrl', dataUrl)
                                )
                              }
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-gray-300 mb-1">
                        คำอธิบายหน้าที่ / Bio
                      </label>
                      <input
                        type="text"
                        value={member.bio || ''}
                        onChange={(e) => handleMemberChange(index, 'bio', e.target.value)}
                        className="w-full bg-[#070d1a] border border-sky-500/20 rounded-xl px-3 py-2 text-white text-xs focus:border-sky-400 outline-none"
                      />
                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: GAMES SHOWCASE */}
          {activeTab === 'games' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-bold font-display text-white">
                    รายชื่อผลงานเกม (Games Showcase)
                  </h3>
                  <p className="text-xs text-gray-400 font-sans">
                    เพิ่ม/แก้ไขเกม, เปลี่ยนภาพปก, ป้ายสถานะ และลิงก์เข้าเล่น
                  </p>
                </div>
                <button
                  onClick={handleAddGame}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-cyan-500 text-white font-mono text-xs font-bold shadow-[0_0_15px_rgba(56,189,248,0.3)] transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>เพิ่มเกมใหม่</span>
                </button>
              </div>

              {formData.games.map((game, index) => (
                <div
                  key={game.id}
                  className="p-5 rounded-2xl bg-[#0e1933] border border-sky-500/20 space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono text-sky-400 font-bold">
                      # GAME {index + 1}: {game.title}
                    </span>
                    <button
                      onClick={() => handleDeleteGame(index)}
                      className="text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-red-950/40"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-gray-300 mb-1">
                        ชื่อเกม (Title)
                      </label>
                      <input
                        type="text"
                        value={game.title}
                        onChange={(e) => handleGameChange(index, 'title', e.target.value)}
                        className="w-full bg-[#070d1a] border border-sky-500/20 rounded-xl px-3 py-2 text-white text-sm focus:border-sky-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-gray-300 mb-1">
                        สถานะเกม (Status)
                      </label>
                      <select
                        value={game.status}
                        onChange={(e) => handleGameChange(index, 'status', e.target.value)}
                        className="w-full bg-[#070d1a] border border-sky-500/20 rounded-xl px-3 py-2 text-white text-xs focus:border-sky-400 outline-none"
                      >
                        <option value="IN DEVELOPMENT">IN DEVELOPMENT (กำลังพัฒนา - ปุ่มสีเทากดไม่ได้)</option>
                        <option value="PLANNING">PLANNING (อยู่ในช่วงวางแผน - ปุ่มสีเทากดไม่ได้)</option>
                        <option value="RELEASED">RELEASED (เปิดให้เล่นแล้ว - ปุ่มสีฟ้า กดเพื่อไปเล่น)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-gray-300 mb-1">
                        แนวเกม (Genre)
                      </label>
                      <input
                        type="text"
                        value={game.genre}
                        onChange={(e) => handleGameChange(index, 'genre', e.target.value)}
                        className="w-full bg-[#070d1a] border border-sky-500/20 rounded-xl px-3 py-2 text-white text-sm focus:border-sky-400 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-gray-300 mb-1">
                      คำอธิบายเกม (Description)
                    </label>
                    <textarea
                      rows={2}
                      value={game.description}
                      onChange={(e) => handleGameChange(index, 'description', e.target.value)}
                      className="w-full bg-[#070d1a] border border-sky-500/20 rounded-xl px-3 py-2 text-white text-sm focus:border-sky-400 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-gray-300 mb-1">
                        ภาพปกเกม (รองรับ .png, .jpg, .gif, .jpeg)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={game.coverUrl}
                          onChange={(e) => handleGameChange(index, 'coverUrl', e.target.value)}
                          className="flex-1 bg-[#070d1a] border border-sky-500/20 rounded-xl px-3 py-2 text-white text-sm focus:border-sky-400 outline-none"
                        />
                        <label className="cursor-pointer px-3 py-2 bg-sky-950/60 hover:bg-sky-900 border border-sky-500/40 rounded-xl flex items-center justify-center text-sky-300 text-xs font-mono">
                          <Upload className="w-4 h-4 mr-1" />
                          <span>Upload ปก</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleImageUpload(e.target.files[0], (dataUrl) =>
                                handleGameChange(index, 'coverUrl', dataUrl)
                              )
                            }
                          />
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-gray-300 mb-1 flex items-center justify-between">
                        <span>ลิงก์เข้าเล่นเกม Roblox (Game URL)</span>
                        <span className="text-[10px] text-cyan-400 font-mono">*สำหรับปุ่ม "กดเพื่อไปเล่น"</span>
                      </label>
                      <input
                        type="text"
                        placeholder="https://www.roblox.com/games/..."
                        value={game.playUrl}
                        onChange={(e) => handleGameChange(index, 'playUrl', e.target.value)}
                        className="w-full bg-[#070d1a] border border-sky-500/20 rounded-xl px-3 py-2 text-white text-sm focus:border-sky-400 outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: STUDIO PROFILE & BRANDING */}
          {activeTab === 'studio' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1">
                    ชื่อสตูดิโอ (Studio Name)
                  </label>
                  <input
                    type="text"
                    value={formData.studio.name}
                    onChange={(e) => handleStudioChange('name', e.target.value)}
                    className="w-full bg-[#070e1c] border border-sky-500/20 rounded-xl px-3.5 py-2 text-white text-sm focus:border-sky-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1">
                    ป้ายหัวข้อ (Header Badge)
                  </label>
                  <input
                    type="text"
                    value={formData.studio.badge}
                    onChange={(e) => handleStudioChange('badge', e.target.value)}
                    className="w-full bg-[#070e1c] border border-sky-500/20 rounded-xl px-3.5 py-2 text-white text-sm focus:border-sky-400 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1">
                  สโลแกน (Tagline)
                </label>
                <input
                  type="text"
                  value={formData.studio.tagline}
                  onChange={(e) => handleStudioChange('tagline', e.target.value)}
                  className="w-full bg-[#070e1c] border border-sky-500/20 rounded-xl px-3.5 py-2 text-white text-sm focus:border-sky-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1">
                  คำแนะนำสตูดิโอ (Studio Description)
                </label>
                <textarea
                  rows={3}
                  value={formData.studio.description}
                  onChange={(e) => handleStudioChange('description', e.target.value)}
                  className="w-full bg-[#070e1c] border border-sky-500/20 rounded-xl px-3.5 py-2 text-white text-sm focus:border-sky-400 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1">
                    ลิงก์กลุ่ม Roblox (Roblox Group URL)
                  </label>
                  <input
                    type="text"
                    value={formData.studio.robloxGroupUrl}
                    onChange={(e) => handleStudioChange('robloxGroupUrl', e.target.value)}
                    className="w-full bg-[#070e1c] border border-sky-500/20 rounded-xl px-3.5 py-2 text-white text-sm focus:border-sky-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1">
                    รูปโลโก้สตูดิโอ (Logo Image: .png, .jpg, .gif)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.studio.logoUrl}
                      onChange={(e) => handleStudioChange('logoUrl', e.target.value)}
                      className="flex-1 bg-[#070e1c] border border-sky-500/20 rounded-xl px-3.5 py-2 text-white text-sm focus:border-sky-400 outline-none"
                    />
                    <label className="cursor-pointer px-3 py-2 bg-sky-950/60 hover:bg-sky-900 border border-sky-500/40 rounded-xl flex items-center justify-center text-sky-300 text-xs font-mono">
                      <Upload className="w-4 h-4 mr-1" />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleImageUpload(e.target.files[0], (dataUrl) =>
                            handleStudioChange('logoUrl', dataUrl)
                          )
                        }
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1">
                  ข้อความประกาศสด (Live Announcement Banner)
                </label>
                <input
                  type="text"
                  value={formData.studio.announcement || ''}
                  onChange={(e) => handleStudioChange('announcement', e.target.value)}
                  className="w-full bg-[#070e1c] border border-sky-500/20 rounded-xl px-3.5 py-2 text-white text-sm focus:border-sky-400 outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 5: SUPABASE DATABASE & SQL CONFIG */}
          {activeTab === 'supabase' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-sky-950/40 border border-sky-500/30 flex items-start gap-3">
                <Database className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white font-display">
                    การเชื่อมต่อฐานข้อมูล Supabase (Project Ref: buhkbqyoligheglutrlc)
                  </h4>
                  <p className="text-xs text-gray-300 leading-relaxed font-sans">
                    เมื่อคุณกด <strong>"บันทึกและแสดงผลทันที"</strong> ระบบจะอัปเดตข้อมูลขึ้นตาราง <code className="text-sky-300 bg-black/40 px-1 py-0.5 rounded">studio_content</code> และ <code className="text-sky-300 bg-black/40 px-1 py-0.5 rounded">site_visitors</code> บน Supabase โดยอัตโนมัติ ทำให้ผู้ชมทุกคนเห็นข้อมูลใหม่ทันที
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-mono font-bold text-sky-400 uppercase">
                    คำสั่ง SQL สำหรับรันใน Supabase SQL Editor:
                  </h4>
                  <button
                    onClick={copySqlSchema}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-mono font-semibold"
                  >
                    {sqlCopied ? <Check className="w-3.5 h-3.5 text-green-300" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{sqlCopied ? 'คัดลอกแล้ว!' : 'คัดลอก SQL ทั้งหมด'}</span>
                  </button>
                </div>

                <pre className="p-4 rounded-xl bg-[#070d1a] border border-sky-500/20 text-sky-300 text-xs overflow-x-auto leading-relaxed">
{`-- 1. สร้างตารางจัดเก็บข้อมูลเว็บไซต์
CREATE TABLE IF NOT EXISTS public.studio_content (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.studio_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read" ON public.studio_content FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public Upsert" ON public.studio_content FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- 2. สร้างตารางเก็บสถิติผู้เข้าชมแบบ Anonymous (ไม่ต้องล็อกอิน)
CREATE TABLE IF NOT EXISTS public.site_visitors (
  visitor_code TEXT PRIMARY KEY,
  visit_count INT DEFAULT 1 NOT NULL,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  referrer TEXT,
  first_visit_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  last_visit_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.site_visitors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Upsert" ON public.site_visitors FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);`}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 6: GIT & GITHUB */}
          {activeTab === 'git' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-sky-950/40 border border-sky-500/30 flex items-start gap-3">
                <GitBranch className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white font-display">
                    เชื่อมต่อกับ GitHub: https://github.com/Newwee/Project-Unleashed
                  </h4>
                  <p className="text-xs text-gray-300 leading-relaxed font-sans">
                    คุณสามารถดาวน์โหลดไฟล์ <code className="text-sky-300 bg-black/40 px-1 py-0.5 rounded">studioData.json</code> เพื่อนำไป Git commit หรือเก็บสำรองได้ตลอดเวลา
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={exportJson}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-mono text-xs font-semibold"
                >
                  <Download className="w-4 h-4" />
                  <span>ดาวน์โหลด studioData.json</span>
                </button>

                <button
                  onClick={copyJson}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-sky-500/20 text-xs font-mono text-gray-200"
                >
                  <Copy className="w-4 h-4" />
                  <span>คัดลอก JSON ทั้งหมด</span>
                </button>

                <button
                  onClick={copyGitCommand}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-sky-950/60 hover:bg-sky-900 border border-sky-500/40 text-sky-300 text-xs font-mono"
                >
                  <GitBranch className="w-4 h-4" />
                  <span>{gitCopied ? 'คัดลอกคำสั่งแล้ว!' : 'คัดลอกคำสั่ง Git Push'}</span>
                </button>

                <button
                  onClick={resetToDefault}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-950/30 hover:bg-red-900/50 border border-red-500/30 text-xs font-mono text-red-300"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>รีเซ็ตกลับเป็นค่าเริ่มต้น</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-sky-500/15 flex flex-wrap items-center justify-between gap-3 bg-[#0e1933]">
          <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
            <AlertCircle className="w-4 h-4 text-sky-400" />
            <span>กด "บันทึกและซิงค์ขึ้น Supabase" เพื่อให้การแก้ไขมีผลบนเว็บทันที</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAdminOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-mono text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              ปิด
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-mono font-bold text-white bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-all"
            >
              <Save className="w-4 h-4" />
              <span>บันทึกและซิงค์ขึ้น Supabase</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
