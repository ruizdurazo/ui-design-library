import { useId, type ReactNode, type MouseEvent } from 'react'
import { cn } from '@/lib/cn'
import { Info } from '../info/Info'
import { FormControlContext } from './useFormControl'
import styles from './FormItem.module.scss'

export type FormItemLayout = 'horizontal' | 'vertical'

type FormItemProps = {
  label?: string
  sublabel?: string
  /** Marks the field as optional. Required fields stay unmarked. */
  optional?: boolean
  infoTitle?: string
  infoText?: string
  /** `horizontal` places the label beside the control. `vertical` stacks it above. */
  layout?: FormItemLayout
  /** Id shared with the nested control. Generated when omitted. */
  id?: string
  children?: ReactNode
}

type FormLabelProps = {
  htmlFor?: string
  id?: string
  optional?: boolean
  children?: ReactNode
}

export function FormLabel({
  htmlFor,
  id,
  optional = false,
  children,
}: FormLabelProps) {
  return (
    <label
      className={styles.label}
      htmlFor={htmlFor}
      id={id}
      title={typeof children === 'string' ? children : undefined}
      onMouseDown={(event: MouseEvent<HTMLLabelElement>) => {
        if (!event.defaultPrevented && event.detail > 1) event.preventDefault()
      }}
    >
      <span className={styles.labelText}>{children}</span>
      {optional ? <span className={styles.optional}>Optional</span> : null}
    </label>
  )
}

export function FormItem({
  label,
  sublabel,
  optional = false,
  infoTitle,
  infoText,
  layout = 'horizontal',
  id,
  children,
}: FormItemProps) {
  const generatedId = useId()
  const controlId = id ?? generatedId
  const labelId = label ? `${controlId}-label` : undefined
  const descriptionId = sublabel ? `${controlId}-description` : undefined
  const hasCaption = Boolean(label || sublabel || infoText)

  return (
    <FormControlContext.Provider
      value={{ id: controlId, labelId, descriptionId }}
    >
      <div className={cn(styles.item, styles[layout])}>
        {hasCaption ? (
          <div className={styles.labelCol}>
            {label || infoText ? (
              <div className={styles.labelLine}>
                {label ? (
                  <FormLabel
                    htmlFor={controlId}
                    id={labelId}
                    optional={optional}
                  >
                    {label}
                  </FormLabel>
                ) : null}
                {infoText ? (
                  <Info title={infoTitle || label}>{infoText}</Info>
                ) : null}
              </div>
            ) : null}
            {sublabel ? (
              <div className={styles.sublabel} id={descriptionId}>
                {sublabel}
              </div>
            ) : null}
          </div>
        ) : null}
        <div className={styles.input}>{children}</div>
      </div>
    </FormControlContext.Provider>
  )
}
