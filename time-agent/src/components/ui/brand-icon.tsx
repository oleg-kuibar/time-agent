import React from "react";
import * as SimpleIcons from "simple-icons";
import { cn } from "~/lib/utils";

export interface BrandIconProps extends React.SVGAttributes<SVGElement> {
  /**
   * The brand name as it appears in simple-icons
   * See https://simpleicons.org/ for all available icons
   */
  brand: string;
  /**
   * Size of the icon in pixels
   */
  size?: number;
  /**
   * Whether to use the brand's original color
   */
  useColor?: boolean;
}

export function BrandIcon({
  brand,
  size = 24,
  useColor = false,
  className,
  ...props
}: BrandIconProps) {
  // Convert brand name to the format used by simple-icons
  // e.g., "GitHub" -> "siGithub"
  const iconKey = `si${brand.charAt(0).toUpperCase()}${brand.slice(1).toLowerCase()}`;
  const icon = (SimpleIcons as Record<string, any>)[iconKey];

  if (!icon) {
    console.warn(`Brand icon "${brand}" not found in simple-icons`);
    return null;
  }

  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={useColor ? `#${icon.hex}` : "currentColor"}
      className={cn("inline-block", className)}
      dangerouslySetInnerHTML={{ __html: icon.path }}
      {...props}
    />
  );
} 