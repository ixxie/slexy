import { setContext, getContext, hasContext } from "svelte";

export interface ModernEditorContext {
  mode: string | null;
}

export const useContext = () => {
  if (hasContext("modern-editor-context")) {
    return getContext<ModernEditorContext>("modern-editor-context");
  } else {
    const context = $state({
      mode: null,
    });
    setContext("modern-editor-context", context);
    return context;
  }
};
