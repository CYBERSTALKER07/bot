import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface TypographyProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2' | 'caption' | 'overline';
  component?: React.ElementType;
  color?: 'primary' | 'secondary' | 'textPrimary' | 'textSecondary' | 'error' | 'warning' | 'info' | 'success';
  align?: 'left' | 'center' | 'right' | 'justify';
  gutterBottom?: boolean;
  noWrap?: boolean;
  paragraph?: boolean;
  className?: string;
  children: React.ReactNode;
}

const Typography: React.FC<TypographyProps> = ({
  variant = 'body1',
  component,
  color = 'textPrimary',
  align = 'left',
  gutterBottom = false,
  noWrap = false,
  paragraph = false,
  className = '',
  children,
  ...props
}) => {
  const { isDark } = useTheme();

  const getVariantClasses = () => {
    const variants = {
      h1: 'text-6xl font-light tracking-tight leading-tight',
      h2: 'text-5xl font-light tracking-tight leading-tight',
      h3: 'text-4xl font-normal tracking-normal leading-snug',
      h4: 'text-3xl font-normal tracking-normal leading-snug',
      h5: 'text-2xl font-normal tracking-normal leading-normal',
      h6: 'text-xl font-medium tracking-normal leading-normal',
      subtitle1: 'text-lg font-normal tracking-normal leading-relaxed',
      subtitle2: 'text-base font-medium tracking-normal leading-relaxed',
      body1: 'text-base font-normal tracking-normal leading-relaxed',
      body2: 'text-sm font-normal tracking-normal leading-relaxed',
      caption: 'text-xs font-normal tracking-wide leading-normal',
      overline: 'text-xs font-medium tracking-wider leading-normal uppercase'
    };
    return variants[variant];
  };

  const getColorClasses = () => {
    const colors = {
      primary: isDark ? 'text-lime' : 'text-asu-maroon',
      secondary: isDark ? 'text-dark-accent' : 'text-asu-gold',
      textPrimary: isDark ? 'text-dark-text' : 'text-gray-900',
      textSecondary: isDark ? 'text-dark-muted' : 'text-gray-600',
      error: 'text-red-500',
      warning: 'text-amber-500',
      info: 'text-blue-500',
      success: 'text-green-500'
    };
    return colors[color];
  };

  const getAlignClasses = () => {
    const aligns = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
      justify: 'text-justify'
    };
    return aligns[align];
  };

  const getDefaultComponent = () => {
    const components = {
      h1: 'h1',
      h2: 'h2',
      h3: 'h3',
      h4: 'h4',
      h5: 'h5',
      h6: 'h6',
      subtitle1: 'h6',
      subtitle2: 'h6',
      body1: 'p',
      body2: 'p',
      caption: 'span',
      overline: 'span'
    };
    return components[variant];
  };

  const Component = component || getDefaultComponent();

  const classes = `
    ${getVariantClasses()}
    ${getColorClasses()}
    ${getAlignClasses()}
    ${gutterBottom ? 'mb-4' : ''}
    ${noWrap ? 'whitespace-nowrap overflow-hidden text-ellipsis' : ''}
    ${paragraph ? 'mb-4' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
};

export default Typography;

// Predefined typography variants for common use cases
export const MaterialTypography = {
  Heading1: (props: Omit<TypographyProps, 'variant'>) => 
    <Typography variant="h1" {...props} />,
  
  Heading2: (props: Omit<TypographyProps, 'variant'>) => 
    <Typography variant="h2" {...props} />,
  
  Heading3: (props: Omit<TypographyProps, 'variant'>) => 
    <Typography variant="h3" {...props} />,
  
  Heading4: (props: Omit<TypographyProps, 'variant'>) => 
    <Typography variant="h4" {...props} />,
  
  Heading5: (props: Omit<TypographyProps, 'variant'>) => 
    <Typography variant="h5" {...props} />,
  
  Heading6: (props: Omit<TypographyProps, 'variant'>) => 
    <Typography variant="h6" {...props} />,
  
  Subtitle1: (props: Omit<TypographyProps, 'variant'>) => 
    <Typography variant="subtitle1" {...props} />,
  
  Subtitle2: (props: Omit<TypographyProps, 'variant'>) => 
    <Typography variant="subtitle2" {...props} />,
  
  Body1: (props: Omit<TypographyProps, 'variant'>) => 
    <Typography variant="body1" {...props} />,
  
  Body2: (props: Omit<TypographyProps, 'variant'>) => 
    <Typography variant="body2" {...props} />,
  
  Caption: (props: Omit<TypographyProps, 'variant'>) => 
    <Typography variant="caption" {...props} />,
  
  Overline: (props: Omit<TypographyProps, 'variant'>) => 
    <Typography variant="overline" {...props} />,
};