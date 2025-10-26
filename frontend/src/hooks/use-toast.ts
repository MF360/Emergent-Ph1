"use client";

// Inspired by react-hot-toast library
import * as React from "react";

import type { ToastProps } from "../components/ui/toast";

type ToastActionElement = React.ReactNode;

export type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

type ToastInput = Omit<ToasterToast, "id" | "open" | "onOpenChange">;

interface State {
  toasts: ToasterToast[];
}

const defaultConfig = {
  toastLimit: 3,
  removeDelay: 5000, // 5 seconds by default
};

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

type Action =
  | { type: typeof actionTypes.ADD_TOAST; toast: ToasterToast }
  | {
      type: typeof actionTypes.UPDATE_TOAST;
      toast: Partial<ToasterToast> & { id: string };
    }
  | { type: typeof actionTypes.DISMISS_TOAST; toastId?: string }
  | { type: typeof actionTypes.REMOVE_TOAST; toastId?: string };

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (
  toastId: string,
  removeDelay: number,
  dispatch: (action: Action) => void
) => {
  if (toastTimeouts.has(toastId)) return;

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({ type: actionTypes.REMOVE_TOAST, toastId });
  }, removeDelay);

  toastTimeouts.set(toastId, timeout);
};

// Reducer
export const reducer = (
  state: State,
  action: Action,
  config = defaultConfig
): State => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, config.toastLimit),
      };

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action;

      const newToasts = state.toasts.map((t) =>
        toastId === undefined || t.id === toastId ? { ...t, open: false } : t
      );

      return { ...state, toasts: newToasts };
    }

    case actionTypes.REMOVE_TOAST: {
      if (!action.toastId) return { ...state, toasts: [] };
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
    }

    default:
      return state;
  }
};

// Global state
const listeners: Array<(state: State) => void> = [];
let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => listener(memoryState));
}

// Main toast function
function toast(input: ToastInput, config = defaultConfig) {
  const id = genId();

  const dismiss = () =>
    dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id });
  const update = (props: Partial<ToasterToast>) =>
    dispatch({ type: actionTypes.UPDATE_TOAST, toast: { ...props, id } });

  const toastObj: ToasterToast = {
    ...input,
    id,
    open: true,
    onOpenChange: (open) => {
      if (!open) dismiss();
    },
  };

  dispatch({ type: actionTypes.ADD_TOAST, toast: toastObj });
  addToRemoveQueue(id, config.removeDelay, dispatch);

  return { id, dismiss, update };
}

// React hook
function useToast(config = defaultConfig) {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index !== -1) listeners.splice(index, 1);
    };
  }, []);

  const dismiss = (toastId?: string) =>
    dispatch({ type: actionTypes.DISMISS_TOAST, toastId });

  return {
    ...state,
    toast: (input: ToastInput) => toast(input, config),
    dismiss,
  };
}

export { useToast, toast };
