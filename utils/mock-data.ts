import type { CourseItem, TodoItem } from '@/components/calendar';

// Mock API: 模拟从服务端获取指定日期的课程和待办数据
export function fetchDayData(date: Date): { courses: CourseItem[]; todos: TodoItem[] } {
  const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  
  // Mock 数据库
  const mockDatabase: Record<string, { courses: CourseItem[]; todos: TodoItem[] }> = {
    // 今天 (2025-10-28)
    '2025-10-28': {
      courses: [
        { id: '1', title: '数字电路与逻辑设计B', location: '教2-111', time: '08：00 - 09：20' },
        { id: '2', title: '数字电路与逻辑设计B', location: '教2-111', time: '08：00 - 09：20' },
      ],
      todos: [
        { id: '1', title: '买水', subtitle: '日常', dueDate: '今天', completed: false },
        { id: '2', title: '数电 P19 第三题', subtitle: '数字电路与逻辑设计B', dueDate: '还剩 2 天', completed: false },
        { id: '3', title: '实习报告', subtitle: '生产实习', dueDate: '下周四', completed: false },
      ],
    },
    // 明天 (2025-10-29)
    '2025-10-29': {
      courses: [
        { id: '3', title: '高等数学', location: '教3-201', time: '10：00 - 11：40' },
      ],
      todos: [
        { id: '4', title: '完成作业', subtitle: '高等数学', dueDate: '明天', completed: false },
        { id: '5', title: '准备演讲稿', subtitle: '演讲比赛', dueDate: '还剩 3 天', completed: false },
      ],
    },
  };
  
  // 返回对应日期的数据，如果没有则返回空数组
  return mockDatabase[dateKey] || { courses: [], todos: [] };
}

// 每日活跃度数据类型
export interface DailyActivityData {
  date: string; // YYYY-MM-DD
  score: number; // 0-5
  tasks: {
    login: boolean; // 今日登录
    library: boolean; // 图书馆打卡
    attendance: boolean; // 按时上课
    running: boolean; // 晨跑打卡
    focus: boolean; // 专注学习
  };
}

// Mock API: 生成过去一年的活跃度数据
export function generateUserActivityData(): DailyActivityData[] {
  const data: DailyActivityData[] = [];
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 365); // 从一年前开始
  
  const currentDate = new Date(startDate);
  
  while (currentDate <= today) {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
    
    // 随机生成任务完成情况（模拟真实数据）
    const login = Math.random() > 0.8; // 20% 概率登录
    const library = Math.random() > 0.6; // 40% 概率去图书馆
    const attendance = Math.random() > 0.5; // 50% 概率按时上课
    const running = Math.random() > 0.7; // 30% 概率晨跑
    const focus = Math.random() > 0.4; // 60% 概率专注学习
    
    const score = [login, library, attendance, running, focus].filter(Boolean).length;
    
    data.push({
      date: dateStr,
      score,
      tasks: {
        login,
        library,
        attendance,
        running,
        focus,
      },
    });
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return data;
}

