import { useColorScheme } from '@/hooks/use-color-scheme';
import { useI18n } from '@/hooks/use-i18n';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { DailyActivityData } from '@/utils/mock-data';
import React, { useEffect, useMemo, useRef } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export interface UserActiveCalendarProps {
  data: DailyActivityData[];
}

/**
 * 用户活跃热力图组件
 * 仿照 GitHub Contribution Calendar 设计
 */
export function UserActiveCalendar({ data }: UserActiveCalendarProps) {
  const { t } = useI18n('mine');
  const colorScheme = useColorScheme();
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const cardBackground = useThemeColor({}, 'card');
  const scrollViewRef = useRef<ScrollView>(null);
  
  // 月份 key 映射
  const monthKeys = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  
  // 根据分数获取颜色
  const getColorForScore = (score: number): string => {
    // 浅色模式下的绿色渐变 - 更柔和的颜色
    const lightColors = ['#EBEDF0', '#C6E48B', '#7BC96F', '#49AF5D', '#2E8840', '#1A5928'];
    // 深色模式下的绿色渐变 - 优化对比度
    const darkColors = ['#1C1F26', '#0E4429', '#006D32', '#26A641', '#39D353', '#4ADE68'];
    
    const isDark = colorScheme === 'dark';
    const colors = isDark ? darkColors : lightColors;
    
    return colors[score] || colors[0];
  };
  
  // 处理数据：按月份分组，每个月作为独立块
  const monthBlocks = useMemo(() => {
    if (!data || data.length === 0) {
      return [];
    }
    
    // 创建日期映射
    const dataMap = new Map<string, DailyActivityData>();
    data.forEach(item => {
      dataMap.set(item.date, item);
    });
    
    // 获取第一个和最后一个日期
    const firstDate = new Date(data[0].date);
    const lastDate = new Date(data[data.length - 1].date);
    
    // 按月份组织数据
    const blocks: {
      monthIndex: number;
      weeks: { date: Date; score: number }[][];
    }[] = [];
    
    // 从第一个日期的月份开始，到最后一个日期的月份结束
    const currentDate = new Date(firstDate.getFullYear(), firstDate.getMonth(), 1);
    const endMonth = new Date(lastDate.getFullYear(), lastDate.getMonth(), 1);
    
    while (currentDate <= endMonth) {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      
      // 获取该月第一天是星期几
      const firstDayOfMonth = new Date(year, month, 1);
      const lastDayOfMonth = new Date(year, month + 1, 0);
      
      // 从该月第一天所在周的周日开始
      const startDate = new Date(firstDayOfMonth);
      startDate.setDate(startDate.getDate() - startDate.getDay());
      
      // 到该月最后一天所在周的周六结束
      const endDate = new Date(lastDayOfMonth);
      endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
      
      // 生成该月的周数据
      const weeks: { date: Date; score: number }[][] = [];
      let currentWeek: { date: Date; score: number }[] = [];
      const iterDate = new Date(startDate);
      
      while (iterDate <= endDate) {
        const dateStr = `${iterDate.getFullYear()}-${String(iterDate.getMonth() + 1).padStart(2, '0')}-${String(iterDate.getDate()).padStart(2, '0')}`;
        const dayData = dataMap.get(dateStr);
        
        // 只有在数据范围内且属于当前月份才显示数据
        const isInRange = iterDate >= firstDate && iterDate <= lastDate;
        const isCurrentMonth = iterDate.getMonth() === month;
        const score = isInRange && isCurrentMonth && dayData ? dayData.score : -1;
        
        currentWeek.push({
          date: new Date(iterDate),
          score,
        });
        
        // 每周六结束
        if (iterDate.getDay() === 6) {
          weeks.push(currentWeek);
          currentWeek = [];
        }
        
        iterDate.setDate(iterDate.getDate() + 1);
      }
      
      // 添加该月的数据块
      if (weeks.length > 0) {
        blocks.push({
          monthIndex: month,
          weeks,
        });
      }
      
      // 移动到下一个月
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    
    return blocks;
  }, [data]);
  
  // 滚动到最右边（最新的日期）
  useEffect(() => {
    if (scrollViewRef.current && monthBlocks.length > 0) {
      // 延迟一下确保布局完成
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: false });
      }, 100);
    }
  }, [monthBlocks]);
  
  return (
    <View style={styles.wrapper}>
      <View style={[styles.container, { backgroundColor: cardBackground }]}>
        {/* 热力图主体 */}
        <View style={styles.chartContainer}>
          {/* 左侧星期标签（固定） */}
          <View style={styles.weekdayLabelsFixed}>
            {[
              { key: 'mon', row: 1 },
              { key: 'wed', row: 3 },
              { key: 'fri', row: 5 },
            ].map((item) => (
              <Text
                key={item.key}
                style={[
                  styles.weekdayLabel,
                  { 
                    color: textSecondaryColor, 
                    top: item.row * 15  // 每行高度：格子12px + 间距3px
                  }
                ]}
              >
                {t(`weekdays.${item.key}` as any)}
              </Text>
            ))}
          </View>
          
          {/* 右侧可滚动区域 */}
          <ScrollView 
            ref={scrollViewRef}
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
          >
            {/* 网格容器 - 按月份分块 */}
            <View style={styles.gridContainer}>
              {monthBlocks.map((block, blockIndex) => (
                <View 
                  key={blockIndex} 
                  style={[
                    styles.monthBlock,
                    blockIndex > 0 && { marginLeft: 10 } // 月份间距
                  ]}
                >
                  {/* 该月的周列 */}
                  <View style={styles.weeksContainer}>
                    {block.weeks.map((week, weekIndex) => (
                      <View key={weekIndex} style={styles.week}>
                        {week.map((day, dayIndex) => (
                          <View
                            key={dayIndex}
                            style={[
                              styles.day,
                              {
                                backgroundColor: day.score >= 0 ? getColorForScore(day.score) : 'transparent',
                              },
                            ]}
                          />
                        ))}
                      </View>
                    ))}
                  </View>
                  
                  {/* 该月的标签 */}
                  <View style={styles.monthLabelContainer}>
                    <Text style={[styles.monthLabel, { color: textSecondaryColor }]}>
                      {t(`months.${monthKeys[block.monthIndex]}` as any)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
      
      {/* 底部图例  */}
      <View style={styles.legend}>
        <Text style={[styles.legendText, { color: textSecondaryColor }]}>
          {t('legend.less')}
        </Text>
        {[0, 1, 2, 3, 4, 5].map(score => (
          <View
            key={score}
            style={[
              styles.legendBox,
              { backgroundColor: getColorForScore(score) }
            ]}
          />
        ))}
        <Text style={[styles.legendText, { color: textSecondaryColor }]}>
          {t('legend.more')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 8,
  },
  container: {
    borderRadius: 8,
    padding: 14,
  },
  chartContainer: {
    flexDirection: 'row',
  },
  weekdayLabelsFixed: {
    width: 28,
    height: 7 * 15,
    position: 'relative',
    marginRight: 3,
  },
  weekdayLabel: {
    fontSize: 9,
    position: 'absolute',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 0,
  },
  gridContainer: {
    flexDirection: 'row',
  },
  monthBlock: {
    // 每个月作为一个独立的块
  },
  weeksContainer: {
    flexDirection: 'row',
    gap: 3,
  },
  week: {
    gap: 3,
  },
  day: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  monthLabelContainer: {
    height: 20,
    marginTop: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthLabel: {
    fontSize: 10,
    textAlign: 'center',
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 8,
    gap: 3,
  },
  legendText: {
    fontSize: 10,
    marginHorizontal: 4,
  },
  legendBox: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
});

