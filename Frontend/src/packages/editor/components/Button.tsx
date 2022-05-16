import React, { Ref, PropsWithChildren } from 'react'
import ReactDOM from 'react-dom'
import cx from '@emotion/css'
import css from '@emotion/css'

interface BaseProps {
  className: string
  [key: string]: unknown
}
type OrNull<T> = T | null

const Button = React.forwardRef(
  (
    {
      className,
      active,
      reversed,
      ...props
    }: PropsWithChildren<
      {
        active: boolean
        reversed: boolean
      } & BaseProps
      >,
    ref: Ref<OrNull<HTMLSpanElement>>
  ) => (
    <span
      {...props}
      ref={ref as React.RefObject<HTMLSpanElement> }
      className={cx(
        className,
        css`
          cursor: pointer;
          color: ${reversed
          ? active
            ? 'white'
            : '#aaa'
          : active
            ? 'black'
            : '#ccc'};
        `
      )}
    />
  )
);

Button.displayName = 'Button';
export default Button;