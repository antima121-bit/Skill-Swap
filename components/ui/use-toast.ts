"use client"

import * as React from "react"

import type { ToastProps } from "@/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 3000 // Changed from 1000000 to 3000ms (3 seconds)

type State = {
  toasts: ToastProps[]
}

type Action =
  | {
      type: "ADD_TOAST"
      toast: ToastProps
    }
  | {
      type: "UPDATE_TOAST"
      toast: ToastProps
    }
  | {
      type: "DISMISS_TOAST"
      toastId?: string
    }
  | {
      type: "REMOVE_TOAST"
      toastId: string
    }

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToastToMap = (toastId: string, dispatch: React.Dispatch<Action>) => {
  if (toastTimeouts.has(toastId)) {
    clearTimeout(toastTimeouts.get(toastId)!)
    toastTimeouts.delete(toastId)
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
      }

    case "DISMISS_TOAST":
      if (action.toastId) {
        clearTimeout(toastTimeouts.get(action.toastId)!)
        return {
          ...state,
          toasts: state.toasts.filter((toast) => toast.id !== action.toastId),
        }
      } else {
        const [toastToDismiss] = state.toasts.slice(-1)
        if (toastToDismiss) {
          clearTimeout(toastTimeouts.get(toastToDismiss.id!))
          return {
            ...state,
            toasts: state.toasts.filter((toast) => toast.id !== toastToDismiss.id),
          }
        }
      }
      return state

    case "REMOVE_TOAST":
      clearTimeout(toastTimeouts.get(action.toastId)!)
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

type Toast = Pick<ToastProps, "id" | "title" | "description" | "action" | "variant">

function useToast() {
  const [state, dispatch] = React.useReducer(reducer, { toasts: [] })

  const toastFunction = React.useCallback(({ ...props }: Toast) => {
    const id = Math.random().toString(36).substring(2, 9)

    const update = (props: ToastProps) =>
      dispatch({
        type: "UPDATE_TOAST",
        toast: { ...props, id },
      })
    const dismiss = (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId: toastId || id })

    dispatch({
      type: "ADD_TOAST",
      toast: {
        ...props,
        id,
        open: true,
        onOpenChange: (open) => {
          if (!open) {
            dismiss(id)
          }
        },
      },
    })

    addToastToMap(id, dispatch)

    return {
      id: id,
      dismiss,
      update,
    }
  }, [])

  return {
    toasts: state.toasts,
    toast: toastFunction,
    dismiss: React.useCallback(() => dispatch({ type: "DISMISS_TOAST" }), []),
  }
}

export { useToast }
