import { AppLink, type AppLinkProps } from '../AppLink'
import { buttonClassName, type ButtonStyleProps } from './buttonClassName'
import { ButtonContent } from './ButtonContent'

export type ButtonLinkProps = AppLinkProps & ButtonStyleProps

/** Navigation that looks like a button. Routes internally, opens external URLs safely. */
export function ButtonLink({ variant, size, withArrow, className, children, ...props }: ButtonLinkProps) {
  return (
    <AppLink className={buttonClassName({ variant, size }, className)} {...props}>
      <ButtonContent withArrow={withArrow}>{children}</ButtonContent>
    </AppLink>
  )
}
