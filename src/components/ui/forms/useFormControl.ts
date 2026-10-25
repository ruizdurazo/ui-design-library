import { createContext, useContext, useId } from 'react'

export type FormControlContextValue = {
  id: string
  labelId?: string
  descriptionId?: string
}

export const FormControlContext = createContext<FormControlContextValue | null>(
  null,
)

/**
 * Id of the control inside the surrounding FormItem.
 * A caller-supplied id is kept only when the control is not inside a FormItem,
 * so the item's label stays pointed at the same element.
 */
export function useFormControl(explicitId?: string) {
  const context = useContext(FormControlContext)
  const generatedId = useId()
  return {
    id: context?.id ?? explicitId ?? generatedId,
    labelId: context?.labelId,
    descriptionId: context?.descriptionId,
  }
}

export function describedBy(...ids: Array<string | false | null | undefined>) {
  const value = ids.filter((id): id is string => Boolean(id)).join(' ')
  return value || undefined
}
