import type { ReactNode } from 'react'
import { Button } from '../button/Button'
import { ButtonWrapper } from '../button-wrapper/ButtonWrapper'
import { LoadingSpinner } from '../spinner/LoadingSpinner'
import { messages } from '../inputs/messages'
import styles from './EditContainer.module.scss'

export type FormState = {
  pending?: boolean
  edit?: boolean
  isValid?: boolean
  error?: { message?: string } | string | null
}

type EditContainerProps = {
  formState: FormState
  allowEdit?: boolean
  onAction?: (action: 'edit' | 'save' | 'cancel') => void
  children?: ReactNode
}

export function EditContainer({
  formState,
  allowEdit = true,
  onAction,
  children,
}: EditContainerProps) {
  const errorText =
    typeof formState.error === 'string'
      ? formState.error
      : formState.error?.message

  return (
    <div>
      {formState.pending ? (
        <div className={styles.pending}>
          <LoadingSpinner />
          <span>{messages.pending}</span>
        </div>
      ) : (
        <div>
          {children}
          {allowEdit ? (
            <ButtonWrapper>
              {!formState.edit ? (
                <Button
                  text={messages.edit}
                  onClick={() => onAction?.('edit')}
                />
              ) : (
                <>
                  <Button
                    variant="primary"
                    text={messages.save}
                    disabled={formState.isValid === false}
                    onClick={() => onAction?.('save')}
                  />
                  <Button
                    text={messages.cancel}
                    onClick={() => onAction?.('cancel')}
                  />
                </>
              )}
            </ButtonWrapper>
          ) : null}
        </div>
      )}
      {errorText ? <div className={styles.error}>{errorText}</div> : null}
    </div>
  )
}
