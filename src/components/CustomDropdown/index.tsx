import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/UI/dropdown-menu'
import { twMerge } from 'tailwind-merge'

export interface DropdownItem {
  key: string | number
  label: React.ReactNode
  disabled?: boolean
  icon?: React.ReactNode
  className?: string
  type?: 'item' | 'separator'
}

interface ReusableDropdownProps {
  items?: DropdownItem[]
  triggerContent?: React.ReactNode
  onMenuClick?: (item: DropdownItem) => void
  buttonClassName?: string
  menuClassName?: string
  placement?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
}
const CustomDropdown: React.FC<ReusableDropdownProps> = ({
  items = [],
  triggerContent,
  onMenuClick,
  buttonClassName,
  menuClassName,
  placement = 'bottom',
  align = 'end',
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <span
          className={twMerge(
            'inline-flex items-center cursor-pointer outline-none',
            buttonClassName,
          )}
        >
          {triggerContent}
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side={placement}
        align={align}
        className={twMerge(
          'bg-gray-800 border-gray-500 border min-w-40 rounded-lg py-1 shadow-2xl z-50',
          menuClassName,
        )}
      >
        {items.map((item, index) => {
          if (item.type === 'separator') {
            return (
              <DropdownMenuSeparator
                key={`sep-${index}`}
                className="bg-gray-600 my-0.5"
              />
            )
          }

          // Check if this is a "Delete" or "Destructive" action
          const isDelete =
            item.key.toString().toLowerCase().includes('delete') ||
            item.key.toString().toLowerCase().includes('block')

          return (
            <DropdownMenuItem
              key={item.key}
              disabled={item.disabled}
              onClick={(e) => {
                e.stopPropagation()
                onMenuClick?.(item)
              }}
              className={twMerge(
                'cursor-pointer flex items-center gap-3 px-3 py-1.5 text-xs outline-none transition-colors',
                // Conditional Hover: Red for delete, Gray for others
                isDelete ? 'focus:bg-red-500/20' : 'focus:bg-white/10',
                item.className,
              )}
            >
              {item.icon && (
                <span
                  className={twMerge(
                    'shrink-0 scale-90  focus:text-white transition-colors',
                    // Use !important to prevent the base component from turning the icon black
                    isDelete ? 'text-red-500!' : 'text-white!',
                  )}
                >
                  {item.icon}
                </span>
              )}

              <span
                className={twMerge(
                  'flex-1 truncate',
                  // Use !important to keep text white on hover
                  isDelete ? 'text-red-500!' : 'text-white!',
                )}
              >
                {item.label}
              </span>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
export default CustomDropdown
