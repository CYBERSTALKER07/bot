import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

// Material Design 3 Typography Scale
type TypographyVariant = 
  | 'display-large' | 'display-medium' | 'display-small'
  | 'headline-large' | 'headline-medium' | 'headline-small'
  | 'title-large' | 'title-medium' | 'title-small'
  | 'label-large' | 'label-medium' | 'label-small'
  | 'body-large' | 'body-medium' | 'body-small';

type SemanticColor = 
  | 'primary' | 'secondary' | 'tertiary'
  | 'surface' | 'on-surface' | 'on-surface-variant'
  | 'error' | 'warning' | 'success' | 'info'
  | 'inherit';

// CVA for consistent styling with better performance
const typographyVariants = cva(
  'transition-colors duration-200 ease-material-standard',
  {
    variants: {
      variant: {
        'display-large': 'text-display-large font-light tracking-tight',
        'display-medium': 'text-display-medium font-light tracking-tight',
        'display-small': 'text-display-small font-light tracking-tight',
        'headline-large': 'text-headline-large font-normal tracking-normal',
        'headline-medium': 'text-headline-medium font-normal tracking-normal',
        'headline-small': 'text-headline-small font-normal tracking-normal',
        'title-large': 'text-title-large font-medium tracking-normal',
        'title-medium': 'text-title-medium font-medium tracking-normal',
        'title-small': 'text-title-small font-medium tracking-wide',
        'label-large': 'text-label-large font-medium tracking-wide',
        'label-medium': 'text-label-medium font-medium tracking-wider',
        'label-small': 'text-label-small font-medium tracking-wider uppercase',
        'body-large': 'text-body-large font-normal tracking-normal',
        'body-medium': 'text-body-medium font-normal tracking-normal',
        'body-small': 'text-body-small font-normal tracking-normal',
      },
      color: {
        primary: 'text-primary-500 dark:text-primary-200',
        secondary: 'text-secondary-500 dark:text-secondary-200',
        tertiary: 'text-gray-700 dark:text-gray-300',
        surface: 'text-gray-900 dark:text-dark-text',
        'on-surface': 'text-gray-800 dark:text-gray-100',
        'on-surface-variant': 'text-gray-600 dark:text-dark-muted',
        error: 'text-error-500',
        warning: 'text-warning-500',
        success: 'text-success-500',
        info: 'text-info-500',
        inherit: 'text-inherit',
      },
      align: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
        justify: 'text-justify',
      },
      weight: {
        light: 'font-light',
        normal: 'font-normal',
        medium: 'font-medium',
        semibold: 'font-semibold',
        bold: 'font-bold',
      },
    },
    defaultVariants: {
      variant: 'body-medium',
      color: 'surface',
      align: 'left',
    },
  }
);

interface TypographyProps extends VariantProps<typeof typographyVariants> {
  as?: React.ElementType;
  className?: string;
  children: React.ReactNode;
  truncate?: boolean;
  gutterBottom?: boolean;
  noWrap?: boolean;
  // Accessibility props
  role?: string;
  'aria-level'?: number;
  id?: string;
}

// Semantic component mapping for better accessibility
const getSemanticElement = (variant: TypographyVariant): React.ElementType => {
  const elementMap: Record<TypographyVariant, React.ElementType> = {
    'display-large': 'h1',
    'display-medium': 'h1',
    'display-small': 'h2',
    'headline-large': 'h2',
    'headline-medium': 'h3',
    'headline-small': 'h4',
    'title-large': 'h5',
    'title-medium': 'h6',
    'title-small': 'h6',
    'label-large': 'span',
    'label-medium': 'span',
    'label-small': 'span',
    'body-large': 'p',
    'body-medium': 'p',
    'body-small': 'p',
  };
  return elementMap[variant];
};

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ 
    variant = 'body-medium',
    color = 'surface',
    align,
    weight,
    as,
    className,
    children,
    truncate = false,
    gutterBottom = false,
    noWrap = false,
    ...props
  }, ref) => {
    const Component = as || getSemanticElement(variant);
    
    return (
      <Component
        ref={ref}
        className={cn(
          typographyVariants({ variant, color, align, weight }),
          {
            'mb-4': gutterBottom,
            'truncate': truncate,
            'whitespace-nowrap overflow-hidden text-ellipsis': noWrap,
          },
          className
  
  Body2: (props: Omit<TypographyProps, 'variant'>) => 
    <Typography variant="body2" {...props} />,
  
  Caption: (props: Omit<TypographyProps, 'variant'>) => 
    <Typography variant="caption" {...props} />,
  
  Overline: (props: Omit<TypographyProps, 'variant'>) => 
    <Typography variant="overline" {...props} />,
};