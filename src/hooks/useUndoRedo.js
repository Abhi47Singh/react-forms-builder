import { useRef, useState } from "react";

export default function useUndoRedo(initialState, limit = 10) {
  const [state, setState] = useState(initialState);
  const undoStack = useRef([]);
  const redoStack = useRef([]);

  const set = (newState) => {
    // Only push if state actually changes
    if (newState !== state) {
      undoStack.current.push(state);
      if (undoStack.current.length > limit) undoStack.current.shift();
      setState(newState);
      redoStack.current = [];
    }
  };

  const undo = () => {
    if (undoStack.current.length === 0) return;
    const prev = undoStack.current.pop();
    redoStack.current.push(state);
    setState(prev);
  };

  const redo = () => {
    if (redoStack.current.length === 0) return;
    const next = redoStack.current.pop();
    undoStack.current.push(state);
    setState(next);
  };

  const clear = () => {
    undoStack.current = [];
    redoStack.current = [];
    setState(initialState);
  };

  return [state, set, undo, redo, clear];
}