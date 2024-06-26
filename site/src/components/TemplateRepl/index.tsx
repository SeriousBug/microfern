import { format } from "microfern";
import { DEFAULT_PLUGINS } from "microfern/plugins";
import { useMemo, useRef, useState } from "react";
import classes from "./styles.module.css";

function Editor({ initialValue, onChange }) {
  const editor = useRef<HTMLPreElement>();

  return (
    <pre
      ref={editor}
      contentEditable
      className={classes.input}
      onInput={() => {
        onChange(editor.current.textContent);
      }}
    >
      {initialValue}
    </pre>
  );
}

export function TemplateRepl({
  template: initialTemplate,
  variables: initialVariables,
}) {
  const [template, setTemplate] = useState(initialTemplate);
  const [variables, setVariables] = useState(initialVariables);
  const [errorMessage, setErrorMessage] = useState(null);

  const output = useMemo(() => {
    try {
      return format(template, variables, {
        plugins: DEFAULT_PLUGINS,
      });
    } catch (err) {
      return err.message;
    }
  }, [template, variables]);

  return (
    <div className={classes.container}>
      <div className={classes.column}>
        <div className={classes.label}>Template</div>
        <Editor initialValue={initialTemplate} onChange={setTemplate} />
        <div className={classes.label}>Variables</div>
        <Editor
          initialValue={JSON.stringify(initialVariables, null, 4)}
          onChange={(value) => {
            try {
              setVariables(JSON.parse(value));
              setErrorMessage(null);
            } catch (err) {
              setErrorMessage(`Error parsing variables: ${err.message}`);
            }
          }}
        />
      </div>

      <div className={classes.column}>
        <div className={classes.label}>Output</div>
        <div className={classes.output}>
          {errorMessage ? errorMessage : output}
        </div>
        <div className={classes.sub}>
          Edit the template or variables to see the output change.
        </div>
      </div>
    </div>
  );
}
