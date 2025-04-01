import { ReactNode } from "react";

export interface BaseProps {
  children?: ReactNode;
  className?: string;
}

export interface ButtonProps extends BaseProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
}

export interface InputProps extends BaseProps {
  type?: string;
  name?: string;
  value?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface LabelProps extends BaseProps {
  htmlFor?: string;
}

export interface FormProps extends BaseProps {
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
} 