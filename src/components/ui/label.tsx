import { forwardRef } from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'
import { cn } from '../../lib/utils'

const Label = forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn('text-xs font-medium text-slate-700 leading-none dark:text-slate-300', className)}
    {...props}
  />
))
Label.displayName = 'Label'

export { Label }
