import { forwardRef } from "react";
import { ReactSVG } from "react-svg";
import { cn } from "../utils/utils";

const sizeStyles = {
  lg: { iconOnly: "w-[48px] h-[48px] p-[12px] rounded-full", withLabel: "flex-row h-[48px] px-[24px] py-[12px] gap-[8px] rounded-[1000px]" },
  md: { iconOnly: "w-[36px] h-[36px] p-[8px] rounded-full", withLabel: "flex-row h-[36px] px-[16px] py-[8px] gap-[6px] rounded-[1000px]" },
  sm: { iconOnly: "w-[24px] h-[24px] p-[5px] rounded-full", withLabel: "flex-row h-[24px] px-[8px] py-[4px] gap-[4px] rounded-[1000px]" },
};

const textSizeStyles = { sm: "text-xs font-semibold", md: "text-sm font-semibold", lg: "text-sm font-semibold" };

const FabButton = forwardRef(
  (
    {
      label,
      icon,
      className,
      spinnerClassName,
      loadingTextClassName,
      iconClassName,
      labelClassName,
      onClick,
      disabled = false,
      loading = false,
      isActive = false,
      size = "lg",
      iconPosition = "leading",
      type = "button",
      ...rest
    },
    ref
  ) => {
    const isInteractionDisabled = disabled || loading;
    const isIconOnly = !!icon && !label;
    const hasLabelOnly = !!label && !icon;

    const baseButtonClasses = "flex items-center justify-center outline-none transform-gpu transition-[transform,box-shadow,background-color,border-color] duration-300 ease-out cursor-pointer";

    const layoutClasses = isIconOnly ? sizeStyles[size].iconOnly : sizeStyles[size].withLabel;

    const stateClasses = cn(
      "border-none bg-violet-600 text-white",
      !isInteractionDisabled && "shadow-[0_2px_4px_rgba(79,55,191,0.05),0_4px_8px_rgba(79,55,191,0.10)]",
      !isInteractionDisabled && !isActive && "hover:bg-violet-700 hover:shadow-[0_0_0_5px_rgba(79,55,191,0.25)] active:bg-violet-800 active:shadow-[0_0_0_5px_rgba(79,55,191,0.35)] hover:scale-[1.02] active:scale-[0.97]",
      isActive && "bg-violet-800 shadow-[0_0_0_5px_rgba(79,55,191,0.35)] scale-[0.97]",
      isInteractionDisabled && "opacity-50 cursor-not-allowed"
    );

    const iconSizeClass = size === "sm" ? "w-[14px] h-[14px]" : "w-[20px] h-[20px]";

    const colorizeSvg = (svg) => {
      svg.querySelectorAll("[fill]").forEach((p) => p.setAttribute("fill", "currentColor"));
      svg.querySelectorAll("[stroke]").forEach((s) => s.setAttribute("stroke", "currentColor"));
      svg.setAttribute("class", iconSizeClass);
    };

    const iconElement = icon && <ReactSVG src={icon} className={cn(iconSizeClass, "text-white", iconClassName)} beforeInjection={colorizeSvg} />;

    const spinnerSizeClass = size === "sm" ? "h-[14px] w-[14px]" : "h-4 w-4";

    const renderContent = () => {
      if (loading) {
        return (
          <span className="flex items-center gap-2">
            <svg className={cn("animate-spin", spinnerSizeClass, spinnerClassName)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            {!isIconOnly && <span className={loadingTextClassName}>Chargement...</span>}
          </span>
        );
      }
      if (hasLabelOnly) return <span className={cn("whitespace-nowrap", textSizeStyles[size], labelClassName)}>{label}</span>;
      if (isIconOnly) return iconElement;
      return (
        <span className="flex items-center gap-[8px]">
          {iconPosition === "leading" && iconElement}
          <span className={cn("whitespace-nowrap", textSizeStyles[size], labelClassName)}>{label}</span>
          {iconPosition === "trailing" && iconElement}
        </span>
      );
    };

    return (
      <button ref={ref} {...rest} onClick={onClick} disabled={isInteractionDisabled} className={cn(baseButtonClasses, layoutClasses, stateClasses, className)} type={type}>
        {renderContent()}
      </button>
    );
  }
);

FabButton.displayName = "FabButton";

export default FabButton;
