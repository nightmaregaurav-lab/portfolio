import * as React from "react";

export interface BubbleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

const BubbleButton = React.forwardRef<HTMLButtonElement, BubbleButtonProps>(
  ({ className = "", active = false, ...props }, ref) => {
    const cls = [
      "block-editor-bubble-btn",
      active ? "block-editor-bubble-btn--active" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return <button ref={ref} className={cls} {...props} type={props.type ?? "button"} />;
  }
);
BubbleButton.displayName = "BubbleButton";

export { BubbleButton };
