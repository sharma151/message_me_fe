import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/UI/dropdown-menu'
import { twMerge } from 'tailwind-merge'

export interface DropdownItem {
  key: string | number
  label: React.ReactNode
  disabled?: boolean
  icon?: React.ReactNode
  className?: string
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
            'inline-flex items-center cursor-pointer',
            buttonClassName,
          )}
        >
          {triggerContent}
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side={placement}
        align={align}
        className={twMerge('bg-gray-600 px-2 border-gray-300', menuClassName)}
      >
        {items.map((item) => (
          <DropdownMenuItem
            key={item.key}
            disabled={item.disabled}
            onClick={() => onMenuClick?.(item)}
            className={twMerge(
              'cursor-pointer flex items-center gap-2 text-gray-100 bg-gray-600! hover:text-white!',
              item.className,
            )}
          >
            {item.icon && <span>{item.icon}</span>}
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default CustomDropdown
