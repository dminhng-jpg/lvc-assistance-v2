LVC_Assistance - Ứng Dụng Quản Lý Lớp Học
> **Hệ thống Quản lý Learning Roadmap & Gamification Dashboard** Mô hình giả lập cho học sinh lớp 12 Tin — Trường THPT Chuyên Lương Văn Chánh.
![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel)
---
Tổng Quan Dự Án
LVC's Assistance là ứng dụng web tương tác dạng Dashboard được thiết kế nhằm hỗ trợ học sinh lớp 12 theo dõi tiến trình học tập, quản lý lộ trình học tập cá nhân (Roadmap) và thúc đẩy tinh thần rèn luyện thông qua các cơ chế Game hóa (Gamification).
Ứng dụng biến các bài tập rèn luyện và mục tiêu học tập thành các Nhiệm vụ (Quests) tích lũy điểm kinh nghiệm (XP), từ đó xếp hạng thời gian thực và mở khóa các danh hiệu thi đua trong lớp.
---
Tính Năng Nổi Bật
 Bảng Xếp Hạng Động (Dynamic Leaderboard): Tự động cập nhật thứ hạng và danh hiệu Rank (Bạch Kim, Kim Cương...) ngay khi tích lũy XP.
 Roadmap Học Tập Cá Nhân Hóa: Gợi ý bài tập cải thiện dựa trên điểm số thực tế từng môn (Tin Học, Vật Lý, Hóa Học, Toán Học).
 Tích Hợp Link Bài Giảng: Hỗ trợ truy cập nhanh các video bài giảng ôn tập chuyên đề.
 Nhiệm Vụ & Điểm Cộng Tương Tác: Cho phép tự tạo và duyệt hoàn thành các nhiệm vụ rèn luyện lớp học.
 Hiệu Ứng Game Hóa Trực Quan: Tích hợp pháo hoa (`canvas-confetti`), âm thanh chúc mừng (Web Audio API) và hệ thống huy hiệu (Badges).
 Bộ Lọc Môn Học & Đếm Ngược Thi: Dễ dàng tra cứu thông tin theo môn và theo dõi thời gian đếm ngược tới kỳ thi quan trọng.
---
Công Nghệ Sử Dụng (Tech Stack)
Core Framework: Next.js (App Router, Client Components)
Language: TypeScript
Styling: Tailwind CSS
Icon Set: Lucide React
Interactive Effects: `canvas-confetti`, Web Audio API
Deployment: Vercel
---
Hướng Dẫn Cài Đặt & Chạy Cục Bộ
1. Khởi chạy dự án
```bash
# Clone dự án về máy
git clone https://github.com/<your-username>/lvc-assistance.git

# Truy cập thư mục dự án
cd lvc-assistance

# Cài đặt các thư viện phụ thuộc
npm install

# Khởi chạy server phát triển
npm run dev
```
2. Truy cập
Mở trình duyệt và truy cập: `http://localhost:3000`
---
Tác Giả & Đóng Góp
Phát triển bởi: Nguyễn Đại Minh — Học sinh lớp 12 Tin - NK: 2024-2027 , THPT Chuyên Lương Văn Chánh.
		   Huỳnh Võ Thành Tính - Học sinh lớp 12 Tin - NK: 2024-2027, THPT Chuyên Lương Văn Chánh.
Mục đích: Dự án học tập & hỗ trợ thi đua lớp học.
---
This project was made with love for Luong Van Chanh Highschool For The Gifted <3