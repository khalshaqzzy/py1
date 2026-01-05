import 'lucide-react-native';

declare module 'lucide-react-native' {
  import { FC } from 'react';
  import { SvgProps } from 'react-native-svg';
  
  export interface LucideProps extends SvgProps {
    size?: number | string;
    color?: string;
    strokeWidth?: number | string;
    absoluteStrokeWidth?: boolean;
    className?: string; // Support for NativeWind
  }

  export type LucideIcon = FC<LucideProps>;
  
  // Export some common icons to ensure they pick up the new types
  export const Code: LucideIcon;
  export const LayoutDashboard: LucideIcon;
  export const BookOpen: LucideIcon;
  export const Trophy: LucideIcon;
  export const Clock: LucideIcon;
  export const CheckCircle: LucideIcon;
  export const Sparkles: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const ChevronLeft: LucideIcon;
  export const FileText: LucideIcon;
  export const LogOut: LucideIcon;
  export const Play: LucideIcon;
  export const AlertCircle: LucideIcon;
  export const CheckCircle2: LucideIcon;
  export const XCircle: LucideIcon;
}
