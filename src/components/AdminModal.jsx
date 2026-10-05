import React, { useState } from 'react';
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
  KeyRound
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
    adminUser,
    loginAdmin,
    logoutAdmin,
    showToast
  } = useStudio();

  if (!isAdminOpen) return null;

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // CMS form state
  const [activeTab, setActiveTab] = useState('studio'); // 'studio' | 'games' | 'team' | 'git' | 'raw'
  const [formData, setFormData] = useState(JSON.parse(JSON.stringify(data)));
  const [gitCopied, setGitCopied] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    const result = await loginAdmin(loginEmail, loginPassword);
    setIsLoggingIn(false);
    if (!result.success) {
      setLoginError(result.error || 'การเข้าสู่ระบบล้มเหลว');
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
      statusTag: 'IN DEVELOPMENT',
      genre: 'Action / RPG',
      coverUrl: '/LogoMap.png',
      description: 'Exciting new Roblox title under active development.',
      tags: ['Roblox', 'Action', 'Anime'],
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
      name: 'New Developer',
      handle: '@Developer_Handle',
      role: 'DEVELOPER',
      category: 'DEVELOPERS',
      avatarUrl: '/duck.gif',
      robloxUrl: 'https://www.roblox.com',
      bio: 'Roblox developer crafting high quality mechanics.',
    };
    setFormData((prev) => ({ ...prev, team: [...prev.team, newMember] }));
  };

  const handleDeleteMember = (index) => {
    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบสมาชิกคนนี้?')) {
      setFormData((prev) => {
        const team = prev.team.filter((_, i) => i !== index);
        return { ...prev, team };
      });
    }
  };

  const handleSave = () => {
    saveData(formData);
    setIsAdminOpen(false);
  };

  const copyGitCommand = () => {
    const cmd = `git add src/data/studioData.json\ngit commit -m "Update studio configuration and members"\ngit push origin main`;
    navigator.clipboard.writeText(cmd);
    setGitCopied(true);
    showToast('📋 คัดลอกคำสั่ง Git เรียบร้อย!', 'success');
    setTimeout(() => setGitCopied(false), 2000);
  };

  // ------------------ LOGIN SCREEN (If not authenticated) ------------------
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
              ระบบหลังบ้าน Project Unleash
            </h2>
            
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950/40 border border-sky-500/25 text-[11px] font-mono text-sky-300">
              <Database className="w-3 h-3 text-cyan-400" />
              <span>เชื่อมต่อกับ Supabase: buhkbqyoligheglutrlc</span>
            </div>
            
            <p className="text-xs text-gray-400 font-sans">
              เฉพาะผู้ดูแลระบบ (Admin) เท่านั้นที่สามารถเข้าถึงและแก้ไขข้อมูลหลังบ้านได้
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
                อีเมลผู้ดูแลระบบ (Supabase Auth / Email)
              </label>
              <input
                type="email"
                placeholder="admin@projectunleash.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full bg-[#070d1a] border border-sky-500/20 rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-sky-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1">
                รหัสผ่าน / Master PIN
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                className="w-full bg-[#070d1a] border border-sky-500/20 rounded-xl px-3.5 py-2.5 text-white text-sm focus:border-sky-400 outline-none"
              />
            </div>

            <div className="p-2.5 rounded-xl bg-sky-950/30 border border-sky-500/15 text-[11px] font-mono text-sky-300/80 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-sky-400 flex-shrink-0" />
              <span>รหัสผ่าน Master ชั่วคราว: <strong className="text-white">unleash2026</strong></span>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 rounded-xl font-mono text-xs font-bold tracking-wider uppercase text-white bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-cyan-500 shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-all flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>{isLoggingIn ? 'กำลังยืนยันตัวตน...' : 'เข้าสู่ระบบ ADMIN'}</span>
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
                <span>ระบบจัดการหลังบ้าน Project Unleash</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300">
                  SUPABASE CONNECTED
                </span>
              </h2>
              <p className="text-xs font-mono text-gray-400">
                เข้าสู่ระบบโดย: {adminUser?.email || 'Studio Admin'} • เชื่อมต่อกับ Git & Supabase
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={logoutAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 text-xs font-mono"
              title="ออกจากระบบ"
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
            { id: 'studio', label: 'Studio Profile', icon: <Settings className="w-4 h-4" /> },
            { id: 'games', label: `Games (${formData.games.length})`, icon: <Gamepad2 className="w-4 h-4" /> },
            { id: 'team', label: `Team (${formData.team.length})`, icon: <Users className="w-4 h-4" /> },
            { id: 'git', label: 'Git & GitHub Connection', icon: <GitBranch className="w-4 h-4 text-sky-400" /> },
            { id: 'raw', label: 'Raw JSON', icon: <RefreshCw className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-mono font-medium border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-sky-400 text-sky-300 bg-sky-950/30'
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
          
          {/* TAB 1: STUDIO PROFILE */}
          {activeTab === 'studio' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1">
                    Studio Name
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
                    Header Badge
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
                  Tagline
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
                  Studio Description
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
                    Roblox Group Link
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
                    Logo Image URL / Path (Supports GIF, PNG, JPG, JPEG)
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
                  Live Announcement Banner
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

          {/* TAB 2: GAMES */}
          {activeTab === 'games' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono text-gray-400">
                  Games Showcase List
                </span>
                <button
                  onClick={handleAddGame}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-600/30 hover:bg-sky-600/50 border border-sky-500/40 text-sky-300 text-xs font-mono"
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
                      # GAME {index + 1}
                    </span>
                    <button
                      onClick={() => handleDeleteGame(index)}
                      className="text-red-400 hover:text-red-300 p-1 rounded-lg hover:bg-red-950/40"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-gray-300 mb-1">
                        Game Title
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
                        Status (IN DEVELOPMENT / PLANNING / RELEASED)
                      </label>
                      <input
                        type="text"
                        value={game.status}
                        onChange={(e) => handleGameChange(index, 'status', e.target.value)}
                        className="w-full bg-[#070d1a] border border-sky-500/20 rounded-xl px-3 py-2 text-white text-sm focus:border-sky-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-gray-300 mb-1">
                        Genre
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
                      Description
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
                        Cover Image (Supports .png, .jpg, .gif, .jpeg)
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
                          <span>Upload</span>
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
                      <label className="block text-xs font-mono text-gray-300 mb-1">
                        Play / Community Link
                      </label>
                      <input
                        type="text"
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

          {/* TAB 3: TEAM MEMBERS */}
          {activeTab === 'team' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono text-gray-400">
                  Studio Staff & Developers (รองรับภาพ Gif, png, jpg, jpeg)
                </span>
                <button
                  onClick={handleAddMember}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-600/30 hover:bg-sky-600/50 border border-sky-500/40 text-sky-300 text-xs font-mono"
                >
                  <Plus className="w-4 h-4" />
                  <span>เพิ่มสมาชิกใหม่</span>
                </button>
              </div>

              {formData.team.map((member, index) => (
                <div
                  key={member.id}
                  className="p-5 rounded-2xl bg-[#0e1933] border border-sky-500/20 space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden border border-sky-500/40 bg-black">
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
                      <span className="text-sm font-bold text-white">
                        {member.name} ({member.handle})
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteMember(index)}
                      className="text-red-400 hover:text-red-300 p-1 rounded-lg hover:bg-red-950/40"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-mono text-gray-300 mb-1">
                        Display Name
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
                        Role (OWNER, DEVELOPER, MODELER)
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
                        Category Tab
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
                        Avatar File (.gif, .png, .jpg, .jpeg)
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
                          <span>Upload</span>
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
                      Bio / Role Description
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
          )}

          {/* TAB 4: GIT & GITHUB CONNECTION */}
          {activeTab === 'git' && (
            <div className="space-y-6">
              
              <div className="p-4 rounded-xl bg-sky-950/40 border border-sky-500/30 flex items-start gap-3">
                <GitBranch className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white font-display">
                    เชื่อมต่อกับ GitHub: https://github.com/Newwee/Project-Unleashed
                  </h4>
                  <p className="text-xs text-gray-300 leading-relaxed font-sans">
                    ข้อมูลทั้งหมดของสตูดิโอจะถูกเก็บไว้ที่ <code className="text-sky-300 bg-black/40 px-1 py-0.5 rounded">src/data/studioData.json</code> คุณสามารถแก้ไขผ่านหน้านี้แล้วส่งออกไฟล์ หรือแก้ไขใน Git โดยตรงได้เลย!
                  </p>
                </div>
              </div>

              {/* Step by step */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold text-sky-400 uppercase">
                  ขั้นตอนการ Push ข้อมูลขึ้น GitHub Repo:
                </h4>
                
                <div className="space-y-2 text-xs font-mono text-gray-300">
                  <div className="p-3 rounded-xl bg-black/40 border border-sky-500/20 flex items-center justify-between">
                    <span>1. บันทึกและดาวน์โหลดไฟล์ <strong className="text-white">studioData.json</strong></span>
                    <button
                      onClick={exportJson}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>ดาวน์โหลด JSON</span>
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-sky-500/20">
                    <span>2. นำไฟล์ที่ดาวน์โหลดไปวางทับที่โฟลเดอร์ <code className="text-sky-300">src/data/studioData.json</code></span>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-sky-500/20 space-y-2">
                    <div className="flex justify-between items-center">
                      <span>3. รันคำสั่ง Git ใน Terminal:</span>
                      <button
                        onClick={copyGitCommand}
                        className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white text-[11px]"
                      >
                        {gitCopied ? <Check className="w-3 h-3 text-cyan-400" /> : <Copy className="w-3 h-3" />}
                        <span>คัดลอกคำสั่ง</span>
                      </button>
                    </div>
                    <pre className="p-3 rounded-lg bg-[#070d1a] border border-sky-500/20 text-sky-300 text-xs overflow-x-auto">
{`git add src/data/studioData.json
git commit -m "Update studio configuration and members"
git push origin main`}
                    </pre>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={copyJson}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-sky-500/20 text-xs font-mono text-gray-200"
                >
                  <Copy className="w-4 h-4" />
                  <span>คัดลอก JSON ทั้งหมด</span>
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

          {/* TAB 5: RAW JSON */}
          {activeTab === 'raw' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs font-mono text-gray-400">
                <span>แก้ไข JSON โดยตรง (Raw Editor)</span>
                <button
                  onClick={copyJson}
                  className="text-sky-400 hover:text-sky-300 flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </button>
              </div>
              <textarea
                rows={16}
                value={JSON.stringify(formData, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    setFormData(parsed);
                  } catch (err) {
                    // let user keep typing
                  }
                }}
                className="w-full bg-[#070d1a] border border-sky-500/20 rounded-xl p-4 font-mono text-xs text-sky-300 focus:border-sky-400 outline-none leading-relaxed"
              />
            </div>
          )}

        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-sky-500/15 flex flex-wrap items-center justify-between gap-3 bg-[#0e1933]">
          <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
            <AlertCircle className="w-4 h-4 text-sky-400" />
            <span>กด "บันทึกและแสดงผลทันที" เพื่อดูผลการเปลี่ยนแปลงบนเว็บ</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAdminOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-mono text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-mono font-bold text-white bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-all"
            >
              <Save className="w-4 h-4" />
              <span>บันทึกและแสดงผลทันที</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
