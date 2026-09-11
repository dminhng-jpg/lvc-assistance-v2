'use client';

import { useState } from 'react';
import { 
  Trophy, Flame, ChartLine, MapPin, Scroll, CheckCircle2, 
  Plus, Filter, Sparkles, Video, ExternalLink, Award, Timer 
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Hàm tự động xác định Rank dựa trên XP hiện tại
const getRankTier = (currentXP: number) => {
  if (currentXP >= 3000) return { tier: "Kim Cương III", badge: "💎", nextXP: 3500 };
  if (currentXP >= 2580) return { tier: "Kim Cương II", badge: "💎", nextXP: 3000 };
  if (currentXP >= 2000) return { tier: "Kim Cương I", badge: "💎", nextXP: 2580 };
  return { tier: "Bạch Kim III", badge: "🥇", nextXP: 2000 };
};

const classMockData = {
  userProfile: {
    fullName: "Nguyễn Đại Minh",
    class: "12 Tin",
    currentXP: 2450,
    streakDays: 12,
    totalClassStudents: 35
  },
  grades: [
    { 
      subject: "Tin Học", average: 9.7, status: "Xuất sắc", weakness: null, 
      note: "Thế mạnh cốt lõi, giữ vững vị trí Top 1 lớp.",
      lectureUrl: "https://youtube.com", lectureTitle: " Đề C++ Chuyên sâu" 
    },
    { 
      subject: "Toán Học", average: 8.6, status: "Tốt", weakness: null, 
      note: "Duy trì phong độ, luyện thêm bài tập nâng cao.",
      lectureUrl: "https://youtube.com", lectureTitle: " Bài tập nâng cao bổ sung " 
    },
    { 
      subject: "Vật Lý", average: 6.7, status: "Cần cải thiện", weakness: "⚠️ Yếu Lực Từ ", 
      note: "Cần đạt ≥ 8.5 bài thi Cuối kỳ.",
      lectureUrl: "https://www.youtube.com/watch?v=zSUdYrDT_nc&list=PLhM0cQTOB54o-gU95ClP2VbSv28ejR2Jc", lectureTitle: "Tài liệu ôn tập tổng quát " 
    },
    { 
      subject: "Hóa Học", average: 7.7, status: "Cảnh báo", weakness: "⚠️ Yếu Lý thuyết Lipid ", 
      note: "Cần đạt ≥ 8.5 bài thi Cuối kỳ.",
      lectureUrl: "https://www.youtube.com/watch?v=8nfiPbueiPI&list=PLGcSL45Mzf_LtPWLcEZ484ncw3Z_nV2W9", lectureTitle: " Tài liệu ôn tập tổng quát " 
    }
  ],
  roadmap: [
    { id: 1, subject: "Vật Lý", title: "Ôn tập kiến thức Lực Từ ", desc: "Luyện 2 đề trắc nghiệm Từ Trường và Lực Từ .", xp: 300, isCompleted: false },
    { id: 2, subject: "Hóa Học", title: "Củng cố Lý thuyết Lipid ", desc: "Tóm tắt sơ đồ tư duy tổng quát kiến thức .", xp: 300, isCompleted: false }
  ],
  classLeaderboard: [
    { name: "Đặng Lê Em", xp: 2570, tier: "Kim Cương I 💎", isUser: false },
    { name: "Huỳnh Võ Hành Tím", xp: 2100, tier: "Kim Cương I 💎", isUser: false },
    { name: "Trần Nguyễn Hải Đan", xp: 1850, tier: "Bạch Kim III 🥇", isUser: false },
    { name: "Trần Gia Hân ", xp: 1600, tier: "Vàng I 🥇", isUser: false }
  ],
  quests: [
    { id: 'Q1', title: "Nộp bài tập C++ đúng hạn", xp: 30, status: 'COMPLETED' },
    { id: 'Q2', title: "Phát biểu 2 lần trong giờ Vật Lý", xp: 50, status: 'AVAILABLE' },
    { id: 'Q3', title: "Hỗ trợ trực nhật lớp tuần này", xp: 40, status: 'AVAILABLE' }
  ],
  badges: [
    { id: 1, title: "🔥 Chăm Chỉ", desc: "Streak trên 10 ngày", unlocked: true },
    { id: 2, title: "💻 C++ Master", desc: "Đạt 9.5+ môn Tin Học", unlocked: true },
    { id: 3, title: "⚡ Bứt phá", desc: "Cán mốc 3000 XP", unlocked: false }
  ]
};

export default function ClassDashboard() {
  const [xp, setXp] = useState(classMockData.userProfile.currentXP);
  const [roadmap, setRoadmap] = useState(classMockData.roadmap);
  const [quests, setQuests] = useState(classMockData.quests);
  const [selectedSubject, setSelectedSubject] = useState<string>('Tất cả');
  const [newQuestTitle, setNewQuestTitle] = useState('');
  const [newQuestXP, setNewQuestXP] = useState(30);
  const [showNotification, setShowNotification] = useState<string | null>(null);

  // Lấy Rank Tier & Mốc XP tiếp theo dựa theo XP hiện tại
  const userRankInfo = getRankTier(xp);

  // Tự động sắp xếp lại Bảng Xếp Hạng & Tính Thứ Hạng Lớp động
  const updatedLeaderboard = [
    ...classMockData.classLeaderboard,
    { 
      name: classMockData.userProfile.fullName, 
      xp: xp, 
      tier: `${userRankInfo.tier} ${userRankInfo.badge}`, 
      isUser: true 
    }
  ]
  .sort((a, b) => b.xp - a.xp)
  .map((student, index) => ({
    ...student,
    rank: index + 1
  }));

  const currentUserRank = updatedLeaderboard.find(s => s.isUser)?.rank || 1;

  // Phát âm thanh khi nhận thưởng
  const playRewardSound = () => {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.3);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const notify = (msg: string) => {
    setShowNotification(msg);
    playRewardSound();
    triggerConfetti();
    setTimeout(() => setShowNotification(null), 3500);
  };

  const handleCompleteRoadmap = (id: number, rewardXP: number) => {
    setRoadmap(roadmap.map(item => item.id === id ? { ...item, isCompleted: true } : item));
    setXp(prev => prev + rewardXP);
    notify(`🎉 Xuất sắc! Nhận +${rewardXP} XP Roadmap`);
  };

  const handleSendQuest = (id: string, rewardXP: number) => {
    setQuests(quests.map(q => q.id === id ? { ...q, status: 'COMPLETED' } : q));
    setXp(prev => prev + rewardXP);
    notify(`✅ Đã nhận +${rewardXP} XP Nhiệm vụ!`);
  };

  const handleAddQuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestTitle.trim()) return;
    const newQ = {
      id: `Q_${Date.now()}`,
      title: newQuestTitle,
      xp: Number(newQuestXP),
      status: 'AVAILABLE'
    };
    setQuests([newQ, ...quests]);
    setNewQuestTitle('');
  };

  const filteredGrades = selectedSubject === 'Tất cả' 
    ? classMockData.grades 
    : classMockData.grades.filter(g => g.subject === selectedSubject);

  const filteredRoadmap = selectedSubject === 'Tất cả'
    ? roadmap
    : roadmap.filter(r => r.subject === selectedSubject);

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen font-sans pb-10 relative selection:bg-indigo-500 selection:text-white">
      
      {/* Toast Notification */}
      {showNotification && (
        <div className="fixed top-5 right-5 z-50 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-indigo-400/50 flex items-center gap-3 animate-bounce">
          <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />
          <span className="text-sm font-bold">{showNotification}</span>
        </div>
      )}

      {/* Navbar */}
      <header className="bg-slate-800/80 backdrop-blur-md border-b border-slate-700/80 p-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 p-2 rounded-xl font-bold shadow-lg shadow-indigo-500/30">🏫</div>
            <div>
              <span className="text-lg font-bold text-white block leading-none">LVC's Assistance</span>
              <span className="text-xs text-indigo-400 font-medium">Dashboard Lớp {classMockData.userProfile.class}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 bg-rose-500/20 text-rose-300 text-xs px-3 py-1.5 rounded-full border border-rose-500/30 font-semibold">
              <Timer className="w-4 h-4 text-rose-400" />
              <span>Thi Cuối Kỳ: <strong>28 ngày</strong></span>
            </div>
            <span className="bg-amber-500/20 text-amber-300 text-xs px-3 py-1.5 rounded-full border border-amber-500/30 font-semibold flex items-center gap-1">
              <Flame className="w-4 h-4 text-amber-400" /> Streak: {classMockData.userProfile.streakDays} ngày
            </span>
          </div>
        </div>
      </header>

      {/* Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-6 flex items-center gap-2 overflow-x-auto">
        <Filter className="w-4 h-4 text-slate-400 shrink-0" />
        <span className="text-xs text-slate-400 font-semibold mr-2 shrink-0">Lọc môn:</span>
        {['Tất cả', 'Tin Học', 'Toán Học', 'Vật Lý', 'Hóa Học'].map((sub) => (
          <button
            key={sub}
            onClick={() => setSelectedSubject(sub)}
            className={`text-xs px-3.5 py-1.5 rounded-xl border transition-all shrink-0 ${
              selectedSubject === sub 
                ? 'bg-indigo-600 border-indigo-500 text-white font-bold shadow-md shadow-indigo-500/20 scale-105' 
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {sub}
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* User Profile Banner */}
          <div className="bg-gradient-to-r from-indigo-900/80 via-slate-800 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>
            <div className="flex justify-between items-center relative z-10">
              <div>
                <h1 className="text-2xl font-black text-white tracking-wide">{classMockData.userProfile.fullName}</h1>
                <p className="text-slate-400 text-sm mt-1">
                  Xếp hạng lớp: <span className="text-indigo-400 font-bold">#{currentUserRank}</span> / {classMockData.userProfile.totalClassStudents} học sinh
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">Thứ Hạng</span>
                <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-300">
                  {userRankInfo.badge} {userRankInfo.tier}
                </span>
              </div>
            </div>

            {/* XP Bar */}
            <div className="mt-6 relative z-10">
              <div className="flex justify-between text-xs text-slate-300 mb-1.5 font-medium">
                <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-amber-400" /> Tiến trình XP</span>
                <span className="text-indigo-300 font-bold">{xp} / {userRankInfo.nextXP} XP</span>
              </div>
              <div className="w-full bg-slate-900/90 rounded-full h-3.5 overflow-hidden p-0.5 border border-slate-700/80 shadow-inner">
                <div 
                  className="bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-700 ease-out shadow-lg" 
                  style={{ width: `${Math.min((xp / userRankInfo.nextXP) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Badges System */}
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" /> Huy Hiệu Đạt Được
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {classMockData.badges.map((b) => (
                <div 
                  key={b.id} 
                  className={`p-3 rounded-xl border flex items-center gap-3 transition ${
                    b.unlocked || xp >= 3000
                      ? 'bg-slate-900/80 border-indigo-500/40 text-white' 
                      : 'bg-slate-900/20 border-slate-800 text-slate-600 opacity-60'
                  }`}
                >
                  <div className="text-xl">{(b.unlocked || xp >= 3000) ? '🏆' : '🔒'}</div>
                  <div>
                    <p className="text-xs font-bold">{b.title}</p>
                    <p className="text-[10px] text-slate-400">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grades Section */}
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <ChartLine className="w-5 h-5 text-indigo-400" /> Quản lý Điểm số & Bài giảng
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-900/80 text-slate-400 uppercase text-[11px] tracking-wider">
                  <tr>
                    <th className="p-3 rounded-l-lg">Môn</th>
                    <th className="p-3">ĐTB</th>
                    <th className="p-3 rounded-r-lg">Khuyến nghị & Tài liệu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/40">
                  {filteredGrades.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-700/20 transition">
                      <td className="p-3 font-semibold text-white">{item.subject}</td>
                      <td className="p-3 font-black text-cyan-400 text-base">{item.average}</td>
                      <td className="p-3 text-xs text-slate-400 space-y-1">
                        {item.weakness && <span className="text-amber-400 font-semibold block">{item.weakness}</span>}
                        <p>{item.note}</p>
                        {item.lectureUrl && (
                          <a
                            href={item.lectureUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-[11px] text-cyan-300 hover:text-white font-medium bg-cyan-950/80 border border-cyan-800/60 px-2.5 py-1 rounded-lg transition hover:scale-105"
                          >
                            <Video className="w-3 h-3 text-cyan-400" />
                            <span>{item.lectureTitle}</span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Roadmap Section */}
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-cyan-400" /> Roadmap Cải Thiện Cá Nhân
            </h2>
            <div className="space-y-3">
              {filteredRoadmap.map((item) => (
                <div key={item.id} className="flex items-start gap-4 p-4 bg-slate-900/60 rounded-xl border border-slate-700/60 hover:border-slate-600 transition">
                  <div className="bg-indigo-600/30 text-indigo-400 font-black rounded-xl w-9 h-9 flex items-center justify-center shrink-0">
                    #{item.id}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-sm text-white">{item.subject}: {item.title}</h4>
                      <span className="text-xs text-indigo-400 font-bold bg-indigo-950 px-2 py-0.5 rounded-full border border-indigo-800">+{item.xp} XP</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
                    <div className="flex justify-end mt-3">
                      {item.isCompleted ? (
                        <span className="text-xs text-emerald-400 flex items-center gap-1 font-bold">
                          <CheckCircle2 className="w-4 h-4" /> Đã hoàn thành
                        </span>
                      ) : (
                        <button 
                          onClick={() => handleCompleteRoadmap(item.id, item.xp)}
                          className="text-xs bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white px-3.5 py-1.5 rounded-xl transition font-bold shadow-md shadow-indigo-600/30"
                        >
                          Hoàn thành
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="space-y-6">
          
          {/* Class Leaderboard */}
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" /> Bảng Xếp Hạng 12 Tin
            </h2>
            <div className="space-y-2.5">
              {updatedLeaderboard.map((student) => (
                <div 
                  key={student.name} 
                  className={`flex items-center justify-between p-3 rounded-xl transition ${
                    student.isUser 
                      ? "bg-gradient-to-r from-indigo-950 to-slate-900 border border-indigo-500/50 shadow-md" 
                      : "bg-slate-900/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`font-black w-5 text-center ${student.rank === 1 ? 'text-amber-400 text-base' : 'text-slate-400 text-xs'}`}>
                      {student.rank === 1 ? '👑' : `#${student.rank}`}
                    </span>
                    <div>
                      <p className={`text-xs font-bold ${student.isUser ? 'text-indigo-300' : 'text-white'}`}>
                        {student.name}
                      </p>
                      <p className="text-[10px] text-slate-400">{student.tier}</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-cyan-400">
                    {student.xp} XP
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quests Interactive */}
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Scroll className="w-5 h-5 text-emerald-400" /> Nhiệm Vụ Rèn Luyện
            </h2>

            <form onSubmit={handleAddQuest} className="mb-4 flex gap-2">
              <input 
                type="text" 
                placeholder="Tự tạo nhiệm vụ..."
                value={newQuestTitle}
                onChange={(e) => setNewQuestTitle(e.target.value)}
                className="bg-slate-900/90 border border-slate-700 text-xs text-white rounded-xl px-3 py-2 flex-1 focus:outline-none focus:border-indigo-500"
              />
              <select 
                value={newQuestXP}
                onChange={(e) => setNewQuestXP(Number(e.target.value))}
                className="bg-slate-900/90 border border-slate-700 text-xs text-indigo-300 rounded-xl px-2 py-2"
              >
                <option value={30}>30 XP</option>
                <option value={50}>50 XP</option>
              </select>
              <button 
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-xl transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {quests.map((quest) => (
                <div key={quest.id} className="p-3 bg-slate-900/50 rounded-xl border border-slate-700/50 flex justify-between items-center">
                  <div>
                    <p className="text-xs font-semibold text-white">{quest.title}</p>
                    <span className="text-[10px] text-indigo-400 font-bold">+{quest.xp} XP</span>
                  </div>
                  {quest.status === 'COMPLETED' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <button 
                      onClick={() => handleSendQuest(quest.id, quest.xp)}
                      className="text-xs bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white px-3 py-1 rounded-lg transition font-semibold"
                    >
                      Nhận XP
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}