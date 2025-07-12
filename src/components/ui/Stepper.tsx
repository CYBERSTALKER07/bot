import React from 'react';
import { Check, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/cva';

interface StepperProps {
  steps: {
    id: string;
    title: string;
    description?: string;
    optional?: boolean;
  }[];
  currentStep: number;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

interface StepProps {
  step: {
    id: string;
    title: string;
    description?: string;
    optional?: boolean;
  };
  index: number;
  currentStep: number;
  totalSteps: number;
  orientation: 'horizontal' | 'vertical';
}

const Step: React.FC<StepProps> = ({ 
  step, 
  index, 
  currentStep, 
  totalSteps, 
  orientation 
}) => {
  const stepNumber = index + 1;
  const isActive = stepNumber === currentStep;
  const isCompleted = stepNumber < currentStep;
  const isLast = index === totalSteps - 1;

  const stepIndicatorClasses = cn(
    'flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all duration-200',
    isCompleted
      ? 'bg-brand-primary text-white'
      : isActive
        ? 'bg-brand-primary text-white ring-4 ring-brand-primary/20'
        : 'bg-neutral-200 text-neutral-600 border-2 border-neutral-300'
  );

  const stepContentClasses = cn(
    'transition-colors duration-200',
    isActive
      ? 'text-brand-primary'
      : isCompleted
        ? 'text-neutral-700'
        : 'text-neutral-500'
  );

  const connectorClasses = cn(
    'transition-colors duration-200',
    orientation === 'horizontal' ? 'flex-1 h-0.5 mx-4' : 'w-0.5 h-8 ml-4 my-2',
    isCompleted ? 'bg-brand-primary' : 'bg-neutral-300'
  );

  return (
    <div className={cn(
      'flex items-center',
      orientation === 'vertical' ? 'flex-col' : 'flex-row'
    )}>
      <div className={cn(
        'flex items-center',
        orientation === 'vertical' ? 'flex-row w-full' : 'flex-row'
      )}>
        <div className={stepIndicatorClasses}>
          {isCompleted ? (
            <Check className="w-4 h-4" />
          ) : (
            <span>{stepNumber}</span>
          )}
        </div>
        
        {orientation === 'vertical' && (
          <div className="ml-4 flex-1">
            <div className={cn('font-medium text-sm', stepContentClasses)}>
              {step.title}
              {step.optional && (
                <span className="ml-2 text-xs text-neutral-400">(Optional)</span>
              )}
            </div>
            {step.description && (
              <div className="text-xs text-neutral-500 mt-1">
                {step.description}
              </div>
            )}
          </div>
        )}
      </div>

      {orientation === 'horizontal' && (
        <div className="ml-3 flex-1 min-w-0">
          <div className={cn('font-medium text-sm truncate', stepContentClasses)}>
            {step.title}
            {step.optional && (
              <span className="ml-1 text-xs text-neutral-400">(Optional)</span>
            )}
          </div>
          {step.description && (
            <div className="text-xs text-neutral-500 mt-1 truncate">
              {step.description}
            </div>
          )}
        </div>
      )}

      {!isLast && (
        <div className={connectorClasses} />
      )}
    </div>
  );
};

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  orientation = 'horizontal',
  className
}) => {
  return (
    <div className={cn(
      'w-full',
      orientation === 'horizontal' 
        ? 'flex items-center' 
        : 'flex flex-col space-y-0',
      className
    )}>
      {steps.map((step, index) => (
        <Step
          key={step.id}
          step={step}
          index={index}
          currentStep={currentStep}
          totalSteps={steps.length}
          orientation={orientation}
        />
      ))}
    </div>
  );
};

export default Stepper;