import React from "react";
import { Dropdown } from "antd";
import type { MenuProps, DropDownProps } from "antd";

interface ReusableDropdownProps {
  items?: MenuProps["items"];
  triggerContent?: React.ReactNode;
  onMenuClick?: MenuProps["onClick"]; // 1. Callback to access clicked value
  buttonClassName?: string;
  menuClassName?: string;
  placement?: DropDownProps["placement"];
  trigger?: DropDownProps["trigger"]; 
}

const CustomDropdown: React.FC<ReusableDropdownProps> = ({
  items,
  triggerContent,
  onMenuClick,
  buttonClassName,
  menuClassName,
  placement = "bottomRight",
  trigger = ["hover"],
}) => {
  return (
    <Dropdown
      placement={placement}
      trigger={trigger}
      menu={{
        items,
        className: menuClassName,
        onClick: onMenuClick,
      }}
    >
      <span
        className={buttonClassName}
        style={{ cursor: "pointer", display: "inline-block" }}
      >
        {triggerContent}
      </span>
    </Dropdown>
  );
};

export default CustomDropdown;
