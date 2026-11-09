import type { ButtonHTMLAttributes } from 'react'
import { buttonClassName, type ButtonStyleProps } from './buttonClassName'
import { ButtonContent } from './ButtonContent'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & ButtonStyleProps

/** An action. For navigation use <ButtonLink>. */
export function Button({
  variant,
  size,
  withArrow,
  type = 'button',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button type={type} className={buttonClassName({ variant, size }, className)} {...props}>
      <ButtonContent withArrow={withArrow}>{children}</ButtonContent>
    </button>
  )
}
