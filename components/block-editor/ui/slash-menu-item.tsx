import * as React from "react";

export interface SlashMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
}

const SlashMenuItem = React.forwardRef<HTMLButtonElement, SlashMenuItemProps>(
  ({ className = "", selected = false, ...props }, ref) => {
    const cls = [
      "block-editor-slash-menu-item",
      selected ? "block-editor-slash-menu-item--selected" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return <button ref={ref} className={cls} {...props} type={props.type ?? "button"} />;
  }
);
SlashMenuItem.displayName = "SlashMenuItem";

export { SlashMenuItem };
