'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';

// Hàm tự động xác định Rank dựa trên XP hiện tại
const getRankTier = (currentXP: number) => {
  if (currentXP >= 3000) return { tier: "Kim Cương III", nextXP: 3500 };
  if (currentXP >= 2580) return { tier: "Kim Cương II", nextXP: 3000 };
  if (currentXP >= 2000) return { tier: "Kim Cương I", nextXP: 2580 };
  return { tier: "Bạch Kim III", nextXP: 2000 };
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
      lectureUrl: "https://youtube.com", lectureTitle: "Đề C++ Chuyên sâu" 
    },
    { 
      subject: "Toán Học", average: 8.6, status: "Tốt", weakness: null, 
      note: "Duy trì phong độ, luyện thêm bài tập nâng cao.",
      lectureUrl: "https://youtube.com", lectureTitle: "Bài tập nâng cao bổ sung" 
    },
    { 
      subject: "Vật Lý", average: 6.7, status: "Cần cải thiện", weakness: "⚠️ Yếu Lực Từ", 
      note: "Cần đạt ≥ 8.5 bài thi Cuối kỳ.",
      lectureUrl: "https://www.youtube.com/watch?v=zSUdYrDT_nc&list=PLhM0cQTOB54o-gU95ClP2VbSv28ejR2Jc", lectureTitle: "Tài liệu ôn tập tổng quát" 
    },
    { 
      subject: "Hóa Học", average: 7.7, status: "Cảnh báo", weakness: "⚠️ Yếu Lý thuyết Lipid", 
      note: "Cần đạt ≥ 8.5 bài thi Cuối kỳ.",
      lectureUrl: "https://www.youtube.com/watch?v=8nfiPbueiPI&list=PLGcSL45Mzf_LtPWLcEZ484ncw3Z_nV2W9", lectureTitle: "Tài liệu ôn tập tổng quát" 
    }
  ],
  roadmap: [
    { id: 1, subject: "Vật Lý", title: "Ôn tập kiến thức Lực Từ", desc: "Luyện 2 đề trắc nghiệm Từ Trường và Lực Từ.", xp: 300, isCompleted: false },
    { id: 2, subject: "Hóa Học", title: "Củng cố Lý thuyết Lipid", desc: "Tóm tắt sơ đồ tư duy tổng quát kiến thức.", xp: 300, isCompleted: false }
  ],
  classLeaderboard: [
    { name: "Đặng Lê Em", xp: 2570, tier: "Kim Cương I", isUser: false },
    { name: "Huỳnh Võ Hành Tím", xp: 2100, tier: "Kim Cương I", isUser: false },
    { name: "Trần Nguyễn Hải Đan", xp: 1850, tier: "Bạch Kim III", isUser: false },
    { name: "Trần Gia Hân", xp: 1600, tier: "Vàng I", isUser: false }
  ],
  quests: [
    { id: 'Q1', title: "Nộp bài tập C++ đúng hạn", xp: 30, status: 'COMPLETED' },
    { id: 'Q2', title: "Phát biểu 2 lần trong giờ Vật Lý", xp: 50, status: 'AVAILABLE' },
    { id: 'Q3', title: "Hỗ trợ trực nhật lớp tuần này", xp: 40, status: 'AVAILABLE' }
  ],
  badges: [
    { id: 1, title: "Chăm Chỉ", desc: "Streak trên 10 ngày", unlocked: true },
    { id: 2, title: "C++ Master", desc: "Đạt 9.5+ môn Tin Học", unlocked: true },
    { id: 3, title: "Bứt phá", desc: "Cán mốc 3000 XP", unlocked: false }
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

  // State điều khiển Gia sư AI Modal
  const [activeTutorSubject, setActiveTutorSubject] = useState<string | null>(null);

  const userRankInfo = getRankTier(xp);

  const updatedLeaderboard = [
    ...classMockData.classLeaderboard,
    { 
      name: classMockData.userProfile.fullName, 
      xp: xp, 
      tier: userRankInfo.tier, 
      isUser: true 
    }
  ]
  .sort((a, b) => b.xp - a.xp)
  .map((student, index) => ({
    ...student,
    rank: index + 1
  }));

  const currentUserRank = updatedLeaderboard.find(s => s.isUser)?.rank || 1;

  const playRewardSound = () => {
    try {
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
    } catch (e) {}
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

  const handleAddXP = (earnedXP: number, reason: string) => {
    setXp(prev => prev + earnedXP);
    notify(`🎉 ${reason}! +${earnedXP} XP`);
  };

  const handleCompleteRoadmap = (id: number, rewardXP: number) => {
    setRoadmap(roadmap.map(item => item.id === id ? { ...item, isCompleted: true } : item));
    handleAddXP(rewardXP, "Hoàn thành bài tập Lộ trình");
  };

  const handleSendQuest = (id: string, rewardXP: number) => {
    setQuests(quests.map(q => q.id === id ? { ...q, status: 'COMPLETED' } : q));
    handleAddXP(rewardXP, "Hoàn thành Nhiệm vụ");
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
    <div className="bg-[#F4F6F8] text-slate-800 min-h-screen font-sans pb-12">
      
      {/* Thông báo */}
      {showNotification && (
        <div className="fixed top-5 right-5 z-50 bg-[#0066FF] text-white px-4 py-3 rounded-lg shadow-md font-medium text-sm">
          <span>{showNotification}</span>
        </div>
      )}

      {/* Header tối giản Azota */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-[#0066FF] text-white w-7 h-7 rounded flex items-center justify-center font-bold text-sm">
              A
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 leading-none">LVC's Assistance</span>
              <span className="text-xs text-slate-500 ml-2">Lớp {classMockData.userProfile.class}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-600">
            <div>Thi Cuối Kỳ: <strong className="text-slate-900">28 ngày</strong></div>
            <div>Chuỗi học: <strong className="text-slate-900">{classMockData.userProfile.streakDays} ngày</strong></div>
          </div>
        </div>
      </header>

      {/* Nội dung chính */}
      <main className="max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Cột trái */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Thông tin học sinh */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-lg font-bold text-slate-900">{classMockData.userProfile.fullName}</h1>
                <p className="text-slate-500 text-xs mt-1">
                  Xếp hạng lớp: <span className="font-bold text-[#0066FF]">#{currentUserRank}</span> / {classMockData.userProfile.totalClassStudents} học sinh
                </p>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-slate-400 font-medium block uppercase tracking-wider">Hạng</span>
                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded border border-slate-200 inline-block mt-1">
                  {userRankInfo.tier}
                </span>
              </div>
            </div>

            {/* Tiến trình XP */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-slate-600 mb-1">
                <span>Tiến trình XP</span>
                <span className="font-bold text-[#0066FF]">{xp} / {userRankInfo.nextXP} XP</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                <div 
                  className="bg-[#0066FF] h-full transition-all duration-300" 
                  style={{ width: `${Math.min((xp / userRankInfo.nextXP) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Thành tích */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Thành tích học tập
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {classMockData.badges.map((b) => (
                <div 
                  key={b.id} 
                  className={`p-3 rounded border text-xs ${
                    b.unlocked || xp >= 3000
                      ? 'bg-blue-50/50 border-blue-200 text-slate-800' 
                      : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                  }`}
                >
                  <p className="font-bold">{b.title}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quản lý Điểm số & Nút Hỏi Gia sư AI */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h2 className="text-sm font-bold text-slate-900">
                Điểm số & Gia sư AI theo môn
              </h2>

              {/* Lọc môn */}
              <div className="flex items-center gap-1 overflow-x-auto">
                {['Tất cả', 'Tin Học', 'Toán Học', 'Vật Lý', 'Hóa Học'].map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubject(sub)}
                    className={`text-xs px-2.5 py-1 rounded border transition-all shrink-0 ${
                      selectedSubject === sub 
                        ? 'bg-[#0066FF] border-[#0066FF] text-white font-medium' 
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-semibold border-y border-slate-200">
                  <tr>
                    <th className="p-2.5">Môn học</th>
                    <th className="p-2.5">ĐTB</th>
                    <th className="p-2.5">Đánh giá & Hỗ trợ AI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredGrades.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-2.5 font-semibold text-slate-900">{item.subject}</td>
                      <td className="p-2.5 font-bold text-[#0066FF]">{item.average}</td>
                      <td className="p-2.5 space-y-1">
                        {item.weakness && <span className="text-amber-600 font-semibold block">{item.weakness}</span>}
                        <p className="text-slate-600">{item.note}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {item.lectureUrl && (
                            <a
                              href={item.lectureUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-slate-500 hover:underline"
                            >
                              Bài giảng →
                            </a>
                          )}
                          <button
                            onClick={() => setActiveTutorSubject(item.subject)}
                            className="text-[11px] bg-blue-50 text-[#0066FF] hover:bg-blue-100 border border-blue-200 px-2 py-0.5 rounded font-medium transition"
                          >
                            Hỏi Gia sư {item.subject} AI
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Lộ trình ôn luyện */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 mb-3">
              Lộ trình ôn luyện bài tập
            </h2>
            <div className="space-y-2.5">
              {filteredRoadmap.map((item) => (
                <div key={item.id} className="p-3 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-[#0066FF] bg-blue-100 px-1.5 py-0.5 rounded">
                        {item.subject}
                      </span>
                      <h4 className="font-semibold text-xs text-slate-900">{item.title}</h4>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                  </div>

                  <div className="shrink-0 text-right ml-4">
                    <span className="text-xs font-bold text-slate-700 block mb-1.5">+{item.xp} XP</span>
                    {item.isCompleted ? (
                      <span className="text-xs text-emerald-600 font-medium">
                        Đã nộp
                      </span>
                    ) : (
                      <button 
                        onClick={() => handleCompleteRoadmap(item.id, item.xp)}
                        className="text-xs bg-[#0066FF] hover:bg-blue-700 text-white px-3 py-1 rounded font-medium"
                      >
                        Nộp bài
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Cột phải */}
        <div className="space-y-6">
          
          {/* Bảng xếp hạng */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 mb-3">
              Bảng xếp hạng lớp 12 Tin
            </h2>
            <div className="space-y-1.5">
              {updatedLeaderboard.map((student) => (
                <div 
                  key={student.name} 
                  className={`flex items-center justify-between p-2 rounded text-xs ${
                    student.isUser 
                      ? "bg-blue-50 border border-blue-200 font-medium" 
                      : "bg-slate-50 border border-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-5 text-center font-bold ${student.rank === 1 ? 'text-[#0066FF]' : 'text-slate-400'}`}>
                      #{student.rank}
                    </span>
                    <div>
                      <p className={student.isUser ? 'text-[#0066FF] font-bold' : 'text-slate-800'}>
                        {student.name}
                      </p>
                      <p className="text-[10px] text-slate-400">{student.tier}</p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-700">
                    {student.xp} XP
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Nhiệm vụ */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 mb-3">
              Nhiệm vụ rèn luyện
            </h2>

            <form onSubmit={handleAddQuest} className="mb-3 flex gap-2">
              <input 
                type="text" 
                placeholder="Thêm nhiệm vụ mới..."
                value={newQuestTitle}
                onChange={(e) => setNewQuestTitle(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded px-2.5 py-1.5 flex-1 focus:outline-none focus:border-[#0066FF]"
              />
              <select 
                value={newQuestXP}
                onChange={(e) => setNewQuestXP(Number(e.target.value))}
                className="bg-slate-50 border border-slate-200 text-xs text-slate-700 rounded px-1 py-1.5"
              >
                <option value={30}>30 XP</option>
                <option value={50}>50 XP</option>
              </select>
              <button 
                type="submit"
                className="bg-[#0066FF] hover:bg-blue-700 text-white text-xs px-2.5 py-1.5 rounded font-medium"
              >
                Thêm
              </button>
            </form>

            <div className="space-y-1.5 max-h-72 overflow-y-auto">
              {quests.map((quest) => (
                <div key={quest.id} className="p-2 bg-slate-50 rounded border border-slate-200 flex justify-between items-center text-xs">
                  <div>
                    <p className="text-slate-800">{quest.title}</p>
                    <span className="text-[10px] text-[#0066FF] font-semibold">+{quest.xp} XP</span>
                  </div>
                  {quest.status === 'COMPLETED' ? (
                    <span className="text-emerald-600 text-[11px] font-medium">Hoàn thành</span>
                  ) : (
                    <button 
                      onClick={() => handleSendQuest(quest.id, quest.xp)}
                      className="bg-[#0066FF] hover:bg-blue-700 text-white text-[11px] px-2 py-0.5 rounded font-medium"
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

      {/* Component Modal Gia Sư AI Socratic */}
      {activeTutorSubject && (
        <AITutorModal
          subject={activeTutorSubject}
          onClose={() => setActiveTutorSubject(null)}
          onAddXP={handleAddXP}
        />
      )}
    </div>
  );
}

function AITutorModal({ 
  subject, 
  onClose,
  onAddXP 
}: { 
  subject: string; 
  onClose: () => void;
  onAddXP: (xp: number, reason: string) => void;
}) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    { 
      sender: 'ai', 
      text: `Chào Đại Minh! Mình là Gia sư AI môn ${subject}. Mình sẽ hỗ trợ gợi mở tư duy và hướng dẫn từng bước chứ không giải hộ bài. Bạn đang gặp vướng mắc ở bài toán nào?` 
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const handleGenerateSimilarProblem = (difficulty: 'Dễ' | 'Trung bình' | 'Nâng cao') => {
    const earnedXP = difficulty === 'Dễ' ? 20 : difficulty === 'Trung bình' ? 30 : 50;
    
    // Cộng XP trực tiếp vào Dashboard
    onAddXP(earnedXP, `Tự hoàn thành bài tập ${subject} (${difficulty})`);

    const promptText = `Em muốn làm thêm một bài tập tương tự ở mức độ [${difficulty}].`;
    handleSend(null, promptText, difficulty);
  };

  const handleSend = (e: React.FormEvent | null, customText?: string, difficultyLevel?: string) => {
    if (e) e.preventDefault();
    const textToSend = customText || input;
    if (!textToSend.trim() || loading) return;

    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: textToSend }]);
    setLoading(true);
    setIsFinished(false);

    // Giả lập AI phản hồi theo phương pháp Socratic
    setTimeout(() => {
      let aiResponse = "";
      if (difficultyLevel) {
        if (difficultyLevel === 'Dễ') {
          aiResponse = `[Bài tập tương tự - Mức độ Dễ (+20 XP)]\n\nCho mảng số nguyên A gồm N phần tử. Viết hàm C++ tính tổng các số chẵn trong mảng.\n\n👉 Bạn định bắt đầu khởi tạo biến tổng ban đầu bằng bao nhiêu?`;
        } else if (difficultyLevel === 'Nâng cao') {
          aiResponse = `[Bài tập tương tự - Mức độ Nâng cao (+50 XP)]\n\nCho mảng số nguyên A (N <= 10^6). Tìm độ dài dãy con liên tiếp dài nhất có tổng chia hết cho K với độ phức tạp O(N).\n\n👉 Gợi ý: Hãy thử ứng dụng mảng dồn (Prefix Sum) kết hợp với phép Modulo xem sao?`;
        } else {
          aiResponse = `[Bài tập tương tự - Mức độ Trung bình (+30 XP)]\n\nCho mảng số nguyên A gồm N phần tử. Hãy đếm số lượng phần tử xuất hiện đúng 1 lần.\n\n👉 Bạn sẽ dùng mảng đếm hay cấu trúc std::map để giải bài này?`;
        }
      } else {
        // Giả lập phản hồi gợi mở
        aiResponse = `Chính xác! Bạn đã tìm ra hướng giải rất đúng. Bạn có muốn thử sức ngay với một bài tập tương tự để củng cố kiến thức không?`;
        setIsFinished(true); // Hiển thị nút chọn độ khó
      }

      setMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-lg shadow-lg w-full max-w-2xl h-[560px] flex flex-col overflow-hidden">
        
        {/* Header Modal */}
        <div className="bg-white border-b border-slate-200 p-4 flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Gia sư AI Học tập — Môn {subject}</h3>
            <p className="text-[11px] text-slate-500">Phương pháp Socratic: Hướng dẫn & Gợi mở tư duy</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-sm font-bold px-2 py-1">
            ✕
          </button>
        </div>

        {/* Khung tin nhắn */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F4F6F8]">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-lg text-xs leading-relaxed whitespace-pre-line ${
                msg.sender === 'user'
                  ? 'bg-[#0066FF] text-white rounded-br-none font-medium'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 text-slate-500 p-2.5 rounded-lg text-xs italic">
                Gia sư AI đang soạn câu hỏi gợi ý...
              </div>
            </div>
          )}
        </div>

        {/* Bộ chọn độ khó khi hoàn thành bài */}
        {isFinished && !loading && (
          <div className="px-4 py-3 bg-blue-50/80 border-t border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs text-slate-700 font-semibold">Chọn độ khó cho bài tập tiếp theo:</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleGenerateSimilarProblem('Dễ')}
                className="text-xs px-2.5 py-1 rounded font-medium bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition"
              >
                Dễ (+20 XP)
              </button>
              <button
                onClick={() => handleGenerateSimilarProblem('Trung bình')}
                className="text-xs px-2.5 py-1 rounded font-medium bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 transition"
              >
                Trung bình (+30 XP)
              </button>
              <button
                onClick={() => handleGenerateSimilarProblem('Nâng cao')}
                className="text-xs px-2.5 py-1 rounded font-medium bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100 transition"
              >
                Nâng cao (+50 XP)
              </button>
            </div>
          </div>
        )}

        {/* Input nhập liệu */}
        <form onSubmit={(e) => handleSend(e)} className="p-3 bg-white border-t border-slate-200 flex gap-2">
          <input 
            type="text" 
            placeholder={`Trả lời hoặc hỏi Gia sư ${subject}...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded px-3 py-2 focus:outline-none focus:border-[#0066FF]"
          />
          <button 
            type="submit"
            disabled={loading}
            className="bg-[#0066FF] hover:bg-blue-700 text-white text-xs px-4 py-2 rounded font-medium disabled:opacity-50"
          >
            Gửi
          </button>
        </form>

      </div>
    </div>
  );
}