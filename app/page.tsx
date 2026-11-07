import React, { useState } from 'react';
import { 
  Trophy, Flame, ChartLine, MapPin, Scroll, CheckCircle2, 
  Plus, Filter, Sparkles, Video, ExternalLink, Award, Timer,
  BookOpen, Target, ChevronRight, Zap, Bell, Check, UserCheck, BookMarked
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Hàm tự động xác định Rank dựa trên XP hiện tại
const getRankTier = (currentXP) => {
  if (currentXP >= 3500) return { tier: "Thách Đấu", badge: "👑", color: "bg-amber-50 text-amber-700 border-amber-200", nextXP: 5000, currentBaseXP: 3500 };
  if (currentXP >= 3000) return { tier: "Kim Cương III", badge: "💎", color: "bg-blue-50 text-blue-700 border-blue-200", nextXP: 3500, currentBaseXP: 3000 };
  if (currentXP >= 2580) return { tier: "Kim Cương II", badge: "💎", color: "bg-blue-50 text-blue-700 border-blue-200", nextXP: 3000, currentBaseXP: 2580 };
  if (currentXP >= 2000) return { tier: "Kim Cương I", badge: "💎", color: "bg-indigo-50 text-indigo-700 border-indigo-200", nextXP: 2580, currentBaseXP: 2000 };
  return { tier: "Bạch Kim III", badge: "🥇", color: "bg-emerald-50 text-emerald-700 border-emerald-200", nextXP: 2000, currentBaseXP: 1500 };
};

const classMockData = {
  userProfile: {
    fullName: "Nguyễn Đại Minh",
    class: "12 Tin",
    school: "THPT Chuyên Lê Quý Đôn",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    currentXP: 2450,
    streakDays: 12,
    totalClassStudents: 35
  },
  grades: [
    { 
      subject: "Tin Học", average: 9.7, status: "Xuất sắc", weakness: null, 
      note: "Thế mạnh cốt lõi, giữ vững vị trí Top 1 lớp.",
      lectureUrl: "https://youtube.com", lectureTitle: "Đề C++ Chuyên sâu" 
    },
    { 
      subject: "Toán Học", average: 8.6, status: "Tốt", weakness: null, 
      note: "Duy trì phong độ, luyện thêm bài tập Tích phân.",
      lectureUrl: "https://youtube.com", lectureTitle: "Bài tập nâng cao bổ sung" 
    },
    { 
      subject: "Vật Lý", average: 6.7, status: "Cần cải thiện", weakness: "⚠️ Yếu Lực Từ", 
      note: "Mục tiêu: Đạt ≥ 8.5 bài thi Cuối kỳ.",
      lectureUrl: "https://www.youtube.com/watch?v=zSUdYrDT_nc", lectureTitle: "Tài liệu ôn tập tổng quát" 
    },
    { 
      subject: "Hóa Học", average: 7.7, status: "Cảnh báo", weakness: "⚠️ Yếu Lý thuyết Lipid", 
      note: "Cần xem lại sơ đồ tư duy Este - Lipit.",
      lectureUrl: "https://www.youtube.com/watch?v=8nfiPbueiPI", lectureTitle: "Tài liệu ôn tập tổng quát" 
    }
  ],
  roadmap: [
    { id: 1, subject: "Vật Lý", title: "Ôn tập kiến thức Lực Từ", desc: "Luyện 2 đề trắc nghiệm Từ Trường và Lực Từ.", xp: 300, isCompleted: false },
    { id: 2, subject: "Hóa Học", title: "Củng cố Lý thuyết Lipid", desc: "Tóm tắt sơ đồ tư duy tổng quát kiến thức.", xp: 300, isCompleted: false },
    { id: 3, subject: "Toán Học", title: "Giải 5 bài toán Tích Phân VDC", desc: "Luyện bài tập mức độ vận dụng cao.", xp: 250, isCompleted: false },
    { id: 4, subject: "Tin Học", title: "Bài tập Quy hoạch động", desc: "Hoàn thành 3 bài toán Chuyên LVC.", xp: 350, isCompleted: true }
  ],
  classLeaderboard: [
    { name: "Đặng Lê Em", xp: 2570, isUser: false },
    { name: "Huỳnh Võ Hành Tím", xp: 2100, isUser: false },
    { name: "Trần Nguyễn Hải Đan", xp: 1850, isUser: false },
    { name: "Trần Gia Hân", xp: 1600, isUser: false }
  ],
  quests: [
    { id: 'Q1', title: "Nộp bài tập C++ đúng hạn", xp: 30, status: 'COMPLETED' },
    { id: 'Q2', title: "Phát biểu 2 lần trong giờ Vật Lý", xp: 50, status: 'AVAILABLE' },
    { id: 'Q3', title: "Hỗ trợ trực nhật lớp tuần này", xp: 40, status: 'AVAILABLE' }
  ],
  badges: [
    { id: 1, title: "Chăm Chỉ", desc: "Streak trên 10 ngày", unlocked: true, icon: "🔥" },
    { id: 2, title: "C++ Master", desc: "Đạt 9.5+ môn Tin Học", unlocked: true, icon: "💻" },
    { id: 3, title: "Bứt phá", desc: "Cán mốc 3000 XP", unlocked: false, icon: "⚡" }
  ]
};

export default function App() {
  const [xp, setXp] = useState(classMockData.userProfile.currentXP);
  const [roadmap, setRoadmap] = useState(classMockData.roadmap);
  const [quests, setQuests] = useState(classMockData.quests);
  const [selectedSubject, setSelectedSubject] = useState('Tất cả');
  const [newQuestTitle, setNewQuestTitle] = useState('');
  const [newQuestXP, setNewQuestXP] = useState(30);
  const [showNotification, setShowNotification] = useState(null);

  const userRankInfo = getRankTier(xp);

  const updatedLeaderboard = [
    ...classMockData.classLeaderboard,
    { 
      name: classMockData.userProfile.fullName, 
      xp: xp, 
      isUser: true 
    }
  ]
  .sort((a, b) => b.xp - a.xp)
  .map((student, index) => {
    const sRank = getRankTier(student.xp);
    return {
      ...student,
      rank: index + 1,
      tier: `${sRank.tier} ${sRank.badge}`
    };
  });

  const currentUserRank = updatedLeaderboard.find(s => s.isUser)?.rank || 1;

  const playRewardSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, audioCtx.currentTime + 0.15); // E5
      osc.frequency.exponentialRampToValueAtTime(783.99, audioCtx.currentTime + 0.3); // G5
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch (e) {}
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#0066FF', '#10B981', '#F59E0B']
    });
  };

  const notify = (msg) => {
    setShowNotification(msg);
    playRewardSound();
    triggerConfetti();
    setTimeout(() => setShowNotification(null), 3500);
  };

  const handleCompleteRoadmap = (id, rewardXP) => {
    setRoadmap(roadmap.map(item => item.id === id ? { ...item, isCompleted: true } : item));
    setXp(prev => prev + rewardXP);
    notify(`🎉 Đã hoàn thành lộ trình! +${rewardXP} XP`);
  };

  const handleSendQuest = (id, rewardXP) => {
    setQuests(quests.map(q => q.id === id ? { ...q, status: 'COMPLETED' } : q));
    setXp(prev => prev + rewardXP);
    notify(`✅ Đã nhận phần thưởng +${rewardXP} XP!`);
  };

  const handleAddQuest = (e) => {
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
    <div className="bg-[#F4F6F8] text-slate-800 min-h-screen font-sans pb-12 selection:bg-blue-500 selection:text-white">
      
      {/* Toast Notification Azota Style */}
      {showNotification && (
        <div className="fixed top-5 right-5 z-50 bg-white border border-blue-200 text-slate-800 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 border-l-4 border-l-[#0066FF] animate-fade-in">
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-[#0066FF]" />
          </div>
          <span className="text-sm font-medium">{showNotification}</span>
        </div>
      )}

      {/* Top Navbar Azota Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-[#0066FF] text-white font-bold w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-sm">
              A
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 block leading-tight">Azota • LVC Assistance</span>
              <span className="text-xs text-slate-500 font-medium">Lớp 12 Tin - THPT Chuyên Lê Quý Đôn</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-slate-100 text-slate-700 text-xs px-3 py-1.5 rounded-lg border border-slate-200 font-medium">
              <Timer className="w-3.5 h-3.5 text-rose-500" />
              <span>Cuối Kỳ II: <strong className="text-rose-600">28 ngày nữa</strong></span>
            </div>

            <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 text-xs px-3 py-1.5 rounded-lg border border-amber-200 font-semibold">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{classMockData.userProfile.streakDays} Ngày streak</span>
            </div>

            <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-200 text-[#0066FF] flex items-center justify-center font-bold text-xs">
              DM
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 pt-6 space-y-6">

        {/* User Stats Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0066FF] to-blue-400 text-white flex items-center justify-center font-bold text-xl shadow-md">
                👨‍💻
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">{classMockData.userProfile.fullName}</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Lớp <span className="font-semibold text-slate-700">{classMockData.userProfile.class}</span> • Xếp hạng lớp: <span className="text-[#0066FF] font-bold">#{currentUserRank}</span>/{classMockData.userProfile.totalClassStudents} học sinh
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-stretch sm:self-auto">
              <div className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 ${userRankInfo.color}`}>
                <span className="text-base">{userRankInfo.badge}</span>
                <span>{userRankInfo.tier}</span>
              </div>
              <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 text-right">
                <span className="text-[10px] text-slate-400 font-medium uppercase block">Tổng XP tích lũy</span>
                <span className="text-base font-bold text-[#0066FF]">{xp} XP</span>
              </div>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="mt-5">
            <div className="flex justify-between text-xs text-slate-500 mb-1.5 font-medium">
              <span>Tiến trình cấp độ</span>
              <span>Mốc tiếp theo: <strong className="text-slate-800">{userRankInfo.nextXP} XP</strong></span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200">
              <div 
                className="bg-[#0066FF] h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min((xp / userRankInfo.nextXP) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Filter Navigation Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mr-2 shrink-0">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Môn học:</span>
          </div>
          {['Tất cả', 'Tin Học', 'Toán Học', 'Vật Lý', 'Hóa Học'].map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`text-xs px-4 py-2 rounded-xl border font-medium transition shrink-0 ${
                selectedSubject === sub 
                  ? 'bg-[#0066FF] border-[#0066FF] text-white shadow-sm' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Left Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Grades & Lectures Section */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ChartLine className="w-4 h-4 text-[#0066FF]" /> Kết Quả Học Tập & Bài Giảng Bổ Trợ
                </h2>
                <span className="text-xs text-slate-400">Cập nhật 2026</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-y border-slate-200">
                    <tr>
                      <th className="py-3 px-3">Môn học</th>
                      <th className="py-3 px-3">ĐTB</th>
                      <th className="py-3 px-3">Đánh giá & Tài liệu bài giảng</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredGrades.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 px-3 font-semibold text-slate-800">{item.subject}</td>
                        <td className="py-3.5 px-3">
                          <span className={`inline-block font-bold text-sm px-2 py-0.5 rounded-md ${
                            item.average >= 9.0 ? 'bg-emerald-50 text-emerald-700' :
                            item.average >= 8.0 ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {item.average}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 space-y-1">
                          {item.weakness && (
                            <span className="text-amber-600 font-medium block text-[11px]">{item.weakness}</span>
                          )}
                          <p className="text-slate-500 text-xs">{item.note}</p>
                          {item.lectureUrl && (
                            <a
                              href={item.lectureUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs text-[#0066FF] hover:underline font-medium pt-1"
                            >
                              <Video className="w-3.5 h-3.5 text-[#0066FF]" />
                              <span>{item.lectureTitle}</span>
                              <ExternalLink className="w-3 h-3 text-slate-400" />
                            </a>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Personalized Roadmap */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#0066FF]" /> Lộ Trình Cải Thiện Cá Nhân
              </h2>

              <div className="space-y-3">
                {filteredRoadmap.map((item) => (
                  <div key={item.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition flex items-start gap-3 justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-blue-100 text-[#0066FF] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        #{item.id}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-sm text-slate-800">{item.subject}: {item.title}</h3>
                          <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded border border-blue-100">
                            +{item.xp} XP
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                      </div>
                    </div>

                    <div>
                      {item.isCompleted ? (
                        <span className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg font-semibold flex items-center gap-1 shrink-0">
                          <Check className="w-3.5 h-3.5" /> Hoàn thành
                        </span>
                      ) : (
                        <button
                          onClick={() => handleCompleteRoadmap(item.id, item.xp)}
                          className="text-xs bg-[#0066FF] hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-lg font-semibold transition shrink-0 shadow-sm"
                        >
                          Nộp bài ôn
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Badges Section */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" /> Huy Hiệu Đạt Được
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {classMockData.badges.map((b) => (
                  <div 
                    key={b.id} 
                    className={`p-3 rounded-xl border flex items-center gap-3 ${
                      b.unlocked || xp >= 3000
                        ? 'bg-amber-50/40 border-amber-200 text-slate-800' 
                        : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                    }`}
                  >
                    <div className="text-2xl">{b.icon}</div>
                    <div>
                      <p className="text-xs font-bold">{b.title}</p>
                      <p className="text-[10px] text-slate-500">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Side Column */}
          <div className="space-y-6">
            
            {/* Leaderboard Section */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" /> Bảng Xếp Hạng Lớp 12 Tin
              </h2>

              <div className="space-y-2">
                {updatedLeaderboard.map((student) => (
                  <div 
                    key={student.name}
                    className={`flex items-center justify-between p-3 rounded-xl border transition ${
                      student.isUser 
                        ? "bg-blue-50/70 border-blue-200 font-semibold" 
                        : "bg-white border-slate-100 hover:border-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-5 text-center text-xs font-bold ${
                        student.rank === 1 ? 'text-amber-500 text-sm' :
                        student.rank === 2 ? 'text-slate-400' :
                        student.rank === 3 ? 'text-amber-700' : 'text-slate-400'
                      }`}>
                        {student.rank === 1 ? '👑' : `#${student.rank}`}
                      </span>
                      <div>
                        <p className={`text-xs ${student.isUser ? 'text-[#0066FF] font-bold' : 'text-slate-800 font-medium'}`}>
                          {student.name}
                        </p>
                        <p className="text-[10px] text-slate-400">{student.tier}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-700">
                      {student.xp} XP
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quests Section */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Scroll className="w-4 h-4 text-emerald-600" /> Nhiệm Vụ Rèn Luyện
              </h2>

              {/* Form Add Quest */}
              <form onSubmit={handleAddQuest} className="mb-4 flex gap-2">
                <input 
                  type="text" 
                  placeholder="Tự tạo nhiệm vụ mới..."
                  value={newQuestTitle}
                  onChange={(e) => setNewQuestTitle(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-xl px-3 py-2 flex-1 focus:outline-none focus:border-[#0066FF]"
                />
                <select 
                  value={newQuestXP}
                  onChange={(e) => setNewQuestXP(Number(e.target.value))}
                  className="bg-slate-50 border border-slate-200 text-xs text-slate-700 rounded-xl px-2 py-2"
                >
                  <option value={30}>30 XP</option>
                  <option value={50}>50 XP</option>
                </select>
                <button 
                  type="submit"
                  className="bg-[#0066FF] hover:bg-blue-700 text-white p-2 rounded-xl transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </form>

              {/* Quest List */}
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {quests.map((quest) => (
                  <div key={quest.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                    <div>
                      <p className="text-xs font-medium text-slate-800">{quest.title}</p>
                      <span className="text-[10px] text-[#0066FF] font-bold">+{quest.xp} XP</span>
                    </div>
                    {quest.status === 'COMPLETED' ? (
                      <span className="text-emerald-600 bg-emerald-50 p-1 rounded-full border border-emerald-200">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <button 
                        onClick={() => handleSendQuest(quest.id, quest.xp)}
                        className="text-xs bg-[#0066FF] hover:bg-blue-700 text-white px-3 py-1 rounded-lg font-medium transition"
                      >
                        Nhận XP
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}