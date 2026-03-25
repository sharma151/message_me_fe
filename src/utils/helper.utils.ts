import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import isToday from 'dayjs/plugin/isToday'
import isYesterday from 'dayjs/plugin/isYesterday'

dayjs.extend(relativeTime)
dayjs.extend(isToday)
dayjs.extend(isYesterday)

export const formatChatTimestamp = (date: string | Date | number): string => {
  const now = dayjs()
  const target = dayjs(date)

  // Calculate difference in minutes
  const diffInMinutes = now.diff(target, 'minute')

  // 1. Within 59 minutes: "10m ago", "59m ago"
  // We use a custom string here because .fromNow() often says "an hour ago" at 45+ mins
  if (diffInMinutes < 60) {
    return diffInMinutes <= 1 ? 'Just now' : `${diffInMinutes}m ago`
  }

  // 2. If it's today (but 60+ minutes ago): "2:00 PM"
  if (target.isToday()) {
    return target.format('h:mm A')
  }

  // 3. Yesterday: "Yesterday"
  if (target.isYesterday()) {
    return 'Yesterday'
  }

  // 4. Older than yesterday: "8/3/2026"
  return target.format('D/M/YYYY')
}
