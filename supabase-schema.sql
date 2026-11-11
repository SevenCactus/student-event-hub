-- ====================================================================
-- SUPABASE DATABASE SCHEMA CHO ỨNG DỤNG LEEP (student-event-hub)
-- Project: https://bvuaeytpelizyzfzilta.supabase.co
-- ====================================================================

-- 1. BẢNG PROFILES (Hồ sơ sinh viên / người dùng)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  full_name text,
  student_code text,
  batch text default 'K18',
  major text default 'Ngôn ngữ & CNTT',
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Bật Row Level Security (RLS)
alter table public.profiles enable row level security;

create policy "Cho phép mọi người xem profile công khai"
  on public.profiles for select using (true);

create policy "Người dùng có thể tự sửa profile của mình"
  on public.profiles for update using (auth.uid() = id);

create policy "Người dùng có thể tự thêm profile của mình"
  on public.profiles for insert with check (auth.uid() = id);

-- Trigger tự động tạo profile khi đăng ký tài khoản mới qua Supabase Auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- 2. BẢNG EVENTS (Quản lý các sự kiện, workshop, hackathon)
create table if not exists public.events (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete set null,
  title text not null,
  date date not null,
  status text not null check (status in ('Đang diễn ra', 'Chuẩn bị', 'Sắp tới')),
  progress integer not null default 0 check (progress >= 0 and progress <= 100),
  people integer not null default 0 check (people >= 0),
  color text not null default 'orange' check (color in ('orange', 'blue', 'purple', 'green', 'red', 'cyan')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.events enable row level security;

create policy "Cho phép xem sự kiện công khai"
  on public.events for select using (true);

create policy "Cho phép thêm sự kiện"
  on public.events for insert with check (true);

create policy "Cho phép sửa sự kiện"
  on public.events for update using (true);

create policy "Cho phép xóa sự kiện"
  on public.events for delete using (true);


-- 3. BẢNG TASKS (Việc cần làm / Nhiệm vụ trong tuần)
create table if not exists public.tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  label text not null,
  meta text,
  tag text,
  done boolean not null default false,
  created_at timestamptz default now()
);

alter table public.tasks enable row level security;

create policy "Cho phép xem nhiệm vụ"
  on public.tasks for select using (true);

create policy "Cho phép tạo nhiệm vụ"
  on public.tasks for insert with check (true);

create policy "Cho phép cập nhật nhiệm vụ"
  on public.tasks for update using (true);

create policy "Cho phép xóa nhiệm vụ"
  on public.tasks for delete using (true);


-- 4. BẢNG PORTFOLIOS (Dự án cá nhân để xây dựng năng lực)
create table if not exists public.portfolios (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'Đang phát triển',
  github_url text,
  demo_url text,
  created_at timestamptz default now()
);

alter table public.portfolios enable row level security;

create policy "Cho phép xem portfolio công khai"
  on public.portfolios for select using (true);

create policy "Cho phép thêm sửa xóa portfolio"
  on public.portfolios for all using (true);


-- 5. BẢNG GUIDES (Cẩm nang sinh viên / FAQ)
create table if not exists public.guides (
  id uuid default gen_random_uuid() primary key,
  icon text not null,
  title text not null,
  text text not null,
  color text not null default 'orange',
  tag text not null,
  tips jsonb default '[]'::jsonb,
  sort_order integer default 0,
  created_at timestamptz default now()
);

alter table public.guides enable row level security;

create policy "Cho phép đọc cẩm nang công khai"
  on public.guides for select using (true);


-- ====================================================================
-- CHÈN DỮ LIỆU MẪU BAN ĐẦU (SEED DATA)
-- ====================================================================

-- Dữ liệu sự kiện mẫu
insert into public.events (title, date, status, progress, people, color)
values
  ('Workshop: English for IT', '2026-10-12', 'Đang diễn ra', 72, 32, 'orange'),
  ('Seminar: AI & Ngôn ngữ', '2026-10-18', 'Chuẩn bị', 45, 21, 'blue'),
  ('Hackathon: Build Your Portfolio', '2026-10-24', 'Sắp tới', 18, 12, 'purple')
on conflict do nothing;

-- Dữ liệu nhiệm vụ mẫu
insert into public.tasks (label, meta, tag, done)
values
  ('Hoàn thiện portfolio dự án AI', 'Hôm nay • 2h', 'Portfolio', true),
  ('Luyện IELTS chuyên ngành CNTT', '2:00 PM • 45 phút', 'Tiếng Anh', false),
  ('Chuẩn bị slide thuyết trình nhóm', 'Tuần này • 1 bài', 'Nhóm', false),
  ('Nộp bài tập ngôn ngữ học số', 'Hạn chót 18:00', 'Học tập', false)
on conflict do nothing;

-- Dữ liệu portfolio mẫu
insert into public.portfolios (title, description, status)
values
  ('Website Portfolio cá nhân', 'Trang giới thiệu bản thân, dự án, kỹ năng và contact.', 'Đang phát triển'),
  ('AI Assistant for Students', 'Ứng dụng hỗ trợ học tập, lên kế hoạch và ôn tập hiệu quả.', 'Prototype'),
  ('Case study: English for IT', 'Nghiên cứu cách sử dụng tiếng Anh trong môi trường lập trình và công nghệ.', 'Chuẩn bị')
on conflict do nothing;

-- Dữ liệu cẩm nang mẫu
insert into public.guides (icon, title, text, color, tag, tips, sort_order)
values
  ('🧠', 'Tiếng Anh chuyên ngành', 'Sinh viên ngành Ngôn ngữ & CNTT thường mất thời gian khi đọc tài liệu kỹ thuật, tham gia seminar bằng tiếng Anh và viết báo cáo dự án. Đây là điểm mấu chốt giúp bạn giao tiếp chuyên nghiệp trong môi trường công nghệ.', 'orange', 'English for IT', '["Đọc tài liệu kỹ thuật chính thức (Official Docs) thay vì dùng bản dịch tự động.", "Tham gia thảo luận trên GitHub, Reddit, Dev.to và Discord cộng đồng quốc tế.", "Luyện tập thuyết trình ngắn 5 - 10 phút mô tả dự án và tính năng bằng tiếng Anh."]'::jsonb, 1),
  ('💻', 'Lập trình & AI', 'Việc học code, AI, GitHub và công cụ hỗ trợ vẫn là thách thức lớn đối với sinh viên mới. Cần xây dựng nền tảng kỹ năng từ cơ bản đến nâng cao.', 'purple', 'Coding + AI', '["Nắm chắc tư duy logic, cú pháp cơ bản và cấu trúc dữ liệu trước khi phụ thuộc vào AI.", "Sử dụng AI như trợ lý giải thích luồng code, review chất lượng và tìm bug tiềm ẩn.", "Thực hành quy trình Git & GitHub chuẩn mực cho mọi đồ án cá nhân và nhóm."]'::jsonb, 2),
  ('🤝', 'Làm việc nhóm', 'Nhiều bạn gặp khó khăn khi phối hợp trong dự án, phân công công việc, thuyết trình và xử lý mâu thuẫn giữa các thành viên trong nhóm.', 'green', 'Teamwork', '["Thống nhất quy tắc làm việc (Working Agreement), kênh liên lạc và deadline ngay từ đầu.", "Minh bạch tiến độ qua bảng Kanban (Notion, Trello hoặc Jira).", "Họp stand-up ngắn định kỳ để kịp thời phát hiện và tháo gỡ khúc mắc giữa các bạn."]'::jsonb, 3),
  ('📦', 'Portfolio & dự án cá nhân', 'Sinh viên cần có sản phẩm rõ ràng để chứng minh kỹ năng: project, case study, GitHub, CV, video demo và bài viết giới thiệu công việc.', 'red', 'Portfolio', '["Tập trung hoàn thiện 2 - 3 sản phẩm cốt lõi có giải quyết bài toán thực tế.", "Viết tài liệu README chỉn chu: mục tiêu dự án, kiến trúc kỹ thuật và link Live Demo.", "Kèm theo bài phân tích Case Study về những thử thách kỹ thuật và cách bạn vượt qua."]'::jsonb, 4),
  ('⏱️', 'Quản lý thời gian', 'Việc vừa học lập trình, vừa luyện tiếng Anh, vừa tham gia hoạt động xã hội khiến nhiều bạn mất cân bằng học tập và sức khỏe.', 'blue', 'Study Life', '["Áp dụng kỹ thuật Pomodoro và Time-blocking để chia nhỏ khung giờ học tập tập trung.", "Xác định nhiệm vụ quan trọng nhất (Top 1 Priority) cần giải quyết mỗi ngày.", "Duy trì cân bằng giữa học tập, thể thao và giấc ngủ để duy trì năng lượng bền bỉ."]'::jsonb, 5),
  ('🚀', 'Kỹ năng nghề nghiệp', 'Sinh viên cần hiểu rõ về CV, kỹ năng phỏng vấn, internship, networking và cách chuẩn bị cho môi trường làm việc thực tế.', 'cyan', 'Career', '["Thiết kế CV 1 trang súc tích, làm nổi bật kết quả định lượng của các dự án đã làm.", "Luyện tập phỏng vấn kỹ thuật và kỹ năng trả lời theo phương pháp STAR.", "Tích cực kết nối với các anh chị mentor và tiền bối trong ngành qua LinkedIn."]'::jsonb, 6)
on conflict do nothing;
