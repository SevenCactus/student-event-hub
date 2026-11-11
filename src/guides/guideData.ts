import { GuideCardItem } from './types'

export const guideCards: GuideCardItem[] = [
  // ==========================================
  // NHÓM 1: CÂN BẰNG HỌC TẬP – TRẢI NGHIỆM (6 thẻ mới)
  // ==========================================
  {
    id: 'balance-time',
    icon: '⏱️',
    title: 'Quản lý thời gian & khối lượng học',
    tag: 'Time',
    color: 'blue',
    category: 'balance',
    statHighlight: '31.7% SV trì hoãn, 25.8% bị dồn deadline và 20% ước lượng sai thời gian hoàn thành.',
    text: 'Nhiều bạn sinh viên năm nhất bị quá tải khi lịch học đại học tự do hơn nhưng bài vở dồn cục. Khảo sát ghi nhận 31.7% sinh viên thường xuyên trì hoãn và 25.8% bị dồn deadline dồn dập.',
    realProblem:
      'Chuyển từ cấp 3 sang đại học khiến sinh viên lúng túng trước lượng bài đọc và đồ án tự học lớn. Theo khảo sát 120 sinh viên, 31.7% thừa nhận hay trì hoãn, 25.8% rơi vào cảnh "chạy nước rút" dồn deadline, và 20% ước lượng thời gian sai khiến kế hoạch bị đổ vỡ.',
    seniorPerspective: {
      role: 'S1 (Sinh viên năm 3 – Khối ngành Kỹ thuật & Ngôn ngữ)',
      quote: 'Kỳ 1 mình hay đợi sát hạn mới làm, kết quả là thức trắng đêm nộp bài sơ sài. Sau này mình chia đồ án thành từng mốc 2 ngày và tận dụng 1 tiếng trống giữa các ca học để làm bài ngay trên thư viện.',
    },
    weeklyActions: [
      'Ghi lại toàn bộ deadline và bài tập của tuần này vào sổ tay hoặc lịch.',
      'Coi các khoảng trống 45 - 60 phút giữa các tiết học là giờ tự học cố định.',
      'Chia một bài tập lớn thành 3 bước nhỏ với hạn chót riêng cho từng bước.',
    ],
    relatedTool: {
      type: 'time_budget',
      label: 'Ước lượng quỹ thời gian tuần ↗',
      description: 'Tính toán số giờ học, tự học, hoạt động và cảnh báo quá tải tuần.',
    },
  },
  {
    id: 'balance-gpa',
    icon: '📊',
    title: 'GPA và nỗi lo điểm số',
    tag: 'GPA',
    color: 'orange',
    category: 'balance',
    statHighlight: '62.5% sinh viên lo âu về điểm số; 44.2% từ chối cơ hội trải nghiệm vì sợ tụt GPA.',
    text: 'Áp lực giữ học bổng hoặc sợ rớt môn khiến 62.5% sinh viên lo âu về điểm số, và 44.2% bỏ lỡ các câu lạc bộ, dự án thực tế vì e ngại ảnh hưởng kết quả học tập.',
    realProblem:
      'Điểm số đại học là áp lực có thật, đặc biệt với sinh viên có học bổng hoặc kỳ vọng cao từ gia đình. Dữ liệu khảo sát chỉ ra 62.5% sinh viên luôn mang tâm lý bất an về GPA, dẫn tới 44.2% chủ động từ chối các cơ hội ngoại khóa hoặc dự án nghiên cứu quý giá ngay từ năm nhất.',
    seniorPerspective: {
      role: 'R1 (Trưởng nhóm Tuyển dụng Công nghệ & Dịch vụ)',
      quote: 'GPA thể hiện tính kỷ luật và khả năng học hỏi cơ bản, nhưng chúng tôi dùng nó như một ngưỡng sàng lọc ban đầu chứ không phải yếu tố quyết định. Ứng viên có điểm khá kết hợp dự án thực tế luôn nổi bật hơn ứng viên chỉ có điểm số thuần túy.',
    },
    weeklyActions: [
      'Xác định rõ mức điểm tối thiểu (ngưỡng an toàn) bạn cần duy trì cho kỳ này.',
      'Trước khi từ chối một hoạt động bổ ích, hãy tính thử số giờ thực sự cần mỗi tuần thay vì lo lắng mơ hồ.',
      'Gặp giảng viên hoặc trợ giảng trong giờ giải lao để hỏi trước 1 điểm chưa hiểu trong bài học.',
    ],
    relatedTool: {
      type: 'activity_decision',
      label: 'Bảng kiểm nhận hoạt động ↗',
      description: 'Đánh giá xem một cơ hội có xứng đáng để bạn dành thời gian hay không.',
    },
  },
  {
    id: 'balance-activities',
    icon: '🎯',
    title: 'Chọn hoạt động đúng',
    tag: 'Activities',
    color: 'purple',
    category: 'balance',
    statHighlight: '58.3% sinh viên ưu tiên gom số lượng CLB/chứng nhận thay vì chiều sâu chất lượng.',
    text: 'Tâm lý sợ bỏ lỡ (FOMO) khiến sinh viên năm nhất đăng ký dồn dập nhiều câu lạc bộ. Khảo sát cho thấy 58.3% bạn ưu tiên số lượng chứng nhận thay vì giá trị học hỏi thực chất.',
    realProblem:
      'Nhiều bạn sinh viên năm nhất lầm tưởng rằng tham gia càng nhiều ban bệ, sự kiện thì hồ sơ càng đẹp. Thực tế khảo sát cho thấy 58.3% sinh viên chạy theo số lượng, dẫn đến tình trạng "chân trong chân ngoài", không để lại dấu ấn ở bất kỳ tổ chức nào và kiệt sức vào cuối kỳ.',
    seniorPerspective: {
      role: 'S2 (Chủ nhiệm CLB sinh viên – Khóa trên)',
      quote: 'Một vị trí nòng cốt bạn làm trọn vẹn và tạo ra kết quả rõ ràng đáng giá gấp 5 lần việc đứng tên trong danh sách thành viên của 5 ban khác nhau.',
    },
    weeklyActions: [
      'Chỉ chọn tối đa 1 - 2 hoạt động/CLB phù hợp nhất với năng lực và mục tiêu năm nhất.',
      'Chấm điểm hoạt động định tham gia theo 5 tiêu chí: chuyên môn, kỹ năng, số giờ, tính linh hoạt và sản phẩm đầu ra.',
      'Rà soát và mạnh dạn xin rút lui khỏi những nhóm hoạt động không còn mang lại giá trị học tập.',
    ],
    relatedTool: {
      type: 'activity_decision',
      label: 'Mở Bảng kiểm quyết định hoạt động ↗',
      description: 'Chấm điểm 5 tiêu chí để biết có nên nhận hoạt động mới này không.',
    },
  },
  {
    id: 'balance-portfolio',
    icon: '💼',
    title: 'Portfolio & minh chứng',
    tag: 'Portfolio',
    color: 'red',
    category: 'balance',
    statHighlight: 'Chỉ 21.7% sinh viên có thói quen ghi lại kết quả và minh chứng đo lường được.',
    text: 'Sinh viên tham gia nhiều hoạt động nhưng khi viết CV lại không biết kể gì. Nghiên cứu chỉ ra chỉ 21.7% bạn lưu trữ minh chứng và số liệu cụ thể của các việc đã làm.',
    realProblem:
      'Sau một năm học bận rộn, đa số sinh viên chỉ nhớ mang máng "mình từng tham gia sự kiện A, ban truyền thông B". Việc thiếu thói quen lưu giữ sản phẩm thực tế khiến hồ sơ xin thực tập hay học bổng trở nên nhạt nhòa, thiếu tính thuyết phục trước nhà tuyển dụng.',
    seniorPerspective: {
      role: 'R2 (Senior HR & Chuyên gia Hướng nghiệp)',
      quote: 'Đừng kể bạn bận rộn thế nào, hãy cho tôi xem sản phẩm. Một đường link GitHub chạy được hay một bài thuyết trình được 100 người lắng nghe có giá trị hơn mọi lời tự nhận xét.',
    },
    weeklyActions: [
      'Viết lại 1 dự án hoặc hoạt động đã hoàn thành theo mẫu STAR (Tình huống, Nhiệm vụ, Hành động, Kết quả có con số).',
      'Tập hợp các link sản phẩm, bài thuyết trình, ảnh minh chứng vào một thư mục lưu trữ cá nhân.',
      'Cập nhật hồ sơ năng lực cá nhân để sẵn sàng chia sẻ khi có cơ hội thực tập.',
    ],
    relatedTool: {
      type: 'portfolio',
      label: 'Chuyển sang trang Tạo Portfolio ↗',
      description: 'Xây dựng hồ sơ năng lực trực quan theo mẫu chuẩn sinh viên LEEP.',
    },
  },
  {
    id: 'balance-roadmap',
    icon: '🧭',
    title: 'Lộ trình trải nghiệm theo kỳ',
    tag: 'Roadmap',
    color: 'green',
    category: 'balance',
    statHighlight: 'Lộ trình định hướng 5 mốc từ Năm 1 đến Năm cuối giúp giảm áp lực và tránh lạc hướng.',
    text: 'Không cần vội vã đi làm ngay từ kỳ đầu. Lộ trình gợi ý 5 mốc rõ ràng giúp bạn biết chính xác điều gì nên tập trung ở từng giai đoạn đại học.',
    realProblem:
      'Nhiều sinh viên năm nhất bị "ngộp" vì nhìn thấy bạn bè xung quanh đã đi làm thêm, nhận dự án từ sớm. Sự so sánh đồng trang lứa tạo ra lo âu không cần thiết, trong khi nền tảng học tập cơ sở của năm nhất lại bị xao nhãng.',
    seniorPerspective: {
      role: 'S1 (Cựu sinh viên xuất sắc – Đang làm việc tại Tech Corp)',
      quote: 'Năm nhất là năm để học cách học đại học và thử nghiệm sở thích. Đừng vội lao vào kiếm tiền hay gánh vác quá nhiều, bạn còn 3 năm phía trước để bứt phá chuyên môn.',
    },
    roadmapMilestones: [
      {
        semester: 'Học kỳ 1 (Năm 1)',
        focus: 'Thích nghi & Xây nền tảng',
        detail: 'Làm quen nhịp học đại học, tạo thói quen tự học và giữ GPA ổn định. Quan sát các CLB trước khi tham gia.',
      },
      {
        semester: 'Học kỳ 2 (Năm 1)',
        focus: 'Trải nghiệm có chọn lọc',
        detail: 'Tham gia 1 hoạt động hoặc CLB phù hợp, nhận một trách nhiệm nhỏ để rèn luyện kỹ năng mềm và làm quen bạn bè.',
      },
      {
        semester: 'Năm 2',
        focus: 'Xây dựng minh chứng & Đồ án',
        detail: 'Đào sâu môn chuyên ngành, làm 1 - 2 dự án nhóm hoặc bài nghiên cứu/cuộc thi học thuật có sản phẩm cụ thể.',
      },
      {
        semester: 'Năm 3',
        focus: 'Thực tập & Dự án thực tế',
        detail: 'Ứng tuyển thực tập bán thời gian hoặc tham gia dự án với doanh nghiệp, mở rộng mạng lưới quan hệ trong ngành.',
      },
      {
        semester: 'Năm cuối',
        focus: 'Hoàn thiện hồ sơ & Nghề nghiệp',
        detail: 'Khóa luận / đồ án tốt nghiệp, chuẩn bị CV và portfolio chỉn chu, tham gia phỏng vấn việc làm chính thức.',
      },
    ],
    weeklyActions: [
      'Xác định rõ bản thân đang ở mốc nào trong lộ trình và mục tiêu số 1 của kỳ này là gì.',
      'Ghi nhớ rằng lộ trình mang tính tham khảo linh hoạt, không bắt buộc phải đi làm thêm ngay ở năm nhất.',
      'Chọn ra đúng 1 kỹ năng nền tảng (ngoại ngữ hoặc công nghệ) để tập trung rèn luyện trong tháng này.',
    ],
  },
  {
    id: 'balance-wellbeing',
    icon: '🌿',
    title: 'Ngủ nghỉ & sức khỏe',
    tag: 'Well-being',
    color: 'cyan',
    category: 'balance',
    statHighlight: 'Nhóm SV vừa đi làm vừa tham gia CLB ngủ trung bình chỉ 5.4 giờ/đêm trong mùa giữa kỳ.',
    text: 'Thiếu ngủ và kiệt sức là nguyên nhân hàng đầu khiến hiệu suất học tập giảm sút. Dữ liệu phỏng vấn cho thấy nhóm sinh viên quá tải chỉ ngủ trung bình 5.4 giờ/đêm.',
    realProblem:
      'Để cân cả việc học, câu lạc bộ và làm thêm, cái giá đầu tiên sinh viên đánh đổi chính là giấc ngủ và bữa ăn. Tình trạng này kéo dài dẫn đến suy giảm trí nhớ, mất tập trung trong giờ học và dễ rơi vào trạng thái kiệt sức (burnout) tinh thần.',
    seniorPerspective: {
      role: 'S2 (Sinh viên năm 4)',
      quote: 'Thức đêm cày đồ án trông có vẻ chăm chỉ, nhưng ngày hôm sau bạn mất nguyên một ngày lờ đờ không tiếp thu được gì. Giữ giấc ngủ 7 tiếng giúp bạn giải quyết bài tập nhanh gấp đôi.',
    },
    weeklyActions: [
      'Đặt báo thức giờ đi ngủ cố định mỗi đêm và không mang điện thoại lên giường trước 30 phút.',
      'Chủ động xếp lịch nghỉ ngơi và thư giãn ngắn trước khi bước vào 2 tuần cao điểm thi cử.',
      'Khi cảm thấy quá tải liên tục trên 1 tuần, hãy dũng cảm giảm bớt một cam kết không bắt buộc.',
    ],
    relatedTool: {
      type: 'time_budget',
      label: 'Kiểm tra giờ ngủ với Quỹ thời gian ↗',
      description: 'Xem bạn có đang ngủ dưới 7 giờ/đêm hay không để điều chỉnh kịp thời.',
    },
  },

  // ==========================================
  // NHÓM 2: KỸ NĂNG THEO NGÀNH (Giữ nguyên 3 thẻ hiện có)
  // ==========================================
  {
    id: 'career-english',
    icon: '🧠',
    title: 'Tiếng Anh chuyên ngành',
    tag: 'English for IT',
    color: 'orange',
    category: 'career',
    text: 'Sinh viên ngành Ngôn ngữ & CNTT thường mất thời gian khi đọc tài liệu kỹ thuật, tham gia seminar bằng tiếng Anh và viết báo cáo dự án. Đây là điểm mấu chốt giúp bạn giao tiếp chuyên nghiệp trong môi trường công nghệ.',
    tips: [
      'Đọc tài liệu kỹ thuật chính thức (Official Docs) thay vì dùng bản dịch tự động.',
      'Tham gia thảo luận trên GitHub, Reddit, Dev.to và Discord cộng đồng quốc tế.',
      'Luyện tập thuyết trình ngắn 5 - 10 phút mô tả dự án và tính năng bằng tiếng Anh.',
    ],
  },
  {
    id: 'career-coding',
    icon: '💻',
    title: 'Lập trình & AI',
    tag: 'Coding + AI',
    color: 'purple',
    category: 'career',
    text: 'Việc học code, AI, GitHub và công cụ hỗ trợ vẫn là thách thức lớn đối với sinh viên mới. Cần xây dựng nền tảng kỹ năng từ cơ bản đến nâng cao.',
    tips: [
      'Nắm chắc tư duy logic, cú pháp cơ bản và cấu trúc dữ liệu trước khi phụ thuộc vào AI.',
      'Sử dụng AI như trợ lý giải thích luồng code, review chất lượng và tìm bug tiềm ẩn.',
      'Thực hành quy trình Git & GitHub chuẩn mực cho mọi đồ án cá nhân và nhóm.',
    ],
  },
  {
    id: 'career-teamwork',
    icon: '🤝',
    title: 'Làm việc nhóm',
    tag: 'Teamwork',
    color: 'green',
    category: 'career',
    text: 'Nhiều bạn gặp khó khăn khi phối hợp trong dự án, phân công công việc, thuyết trình và xử lý mâu thuẫn giữa các thành viên trong nhóm.',
    tips: [
      'Thống nhất quy tắc làm việc (Working Agreement), kênh liên lạc và deadline ngay từ đầu.',
      'Minh bạch tiến độ qua bảng Kanban (Notion, Trello hoặc Jira).',
      'Họp stand-up ngắn định kỳ để kịp thời phát hiện và tháo gỡ khúc mắc giữa các bạn.',
    ],
  },
]

