import React from "react";
import { Save } from "lucide-react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export interface FormField {
  name: string;
  label?: string;
  type?: string;
  required?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  relation?: {
    endpoint?: string;
    valueKey?: string;
    labelKey?: string;
  };
}

type RelationLoaders = Record<string, () => Promise<unknown[]>>;
type Row = Record<string, unknown>;

function successToast(title = "Salvo com sucesso!") {
  void Swal.fire({
    toast: true,
    position: "top-end",
    icon: "success",
    title,
    showConfirmButton: false,
    timer: 3000,
  });
}

export function ApiForm(props: {
  submit: (body: Record<string, unknown>) => Promise<unknown>;
  fields: FormField[];
  submitLabel?: string;
  relationLoaders?: RelationLoaders;
  onSuccess?: () => void | Promise<void>;
}) {
  const [values, setValues] = React.useState<Record<string, string>>({});
  const [status, setStatus] = React.useState<"idle" | "sending" | "ok" | "error">("idle");
  const [message, setMessage] = React.useState<string>("");
  const [relationOptions, setRelationOptions] = React.useState<Record<string, Row[]>>({});
  const [relationLoading, setRelationLoading] = React.useState<Record<string, boolean>>({});

  const errorMessage = (error: unknown) =>
    error instanceof Error && error.message
      ? error.message
      : "Não foi possível salvar. Revise os dados e tente novamente.";

  const relationFields = React.useMemo(
    () => props.fields.filter((field) => !field.readOnly && field.relation && props.relationLoaders?.[field.name]),
    [props.fields, props.relationLoaders],
  );

  const visibleFields = React.useMemo(
    () => props.fields.filter((field) => !field.readOnly),
    [props.fields],
  );

  React.useEffect(() => {
    let alive = true;
    for (const field of relationFields) {
      const load = props.relationLoaders?.[field.name];
      if (!load) continue;
      setRelationLoading((current) => ({ ...current, [field.name]: true }));
      void load()
        .then((items) => {
          if (!alive) return;
          setRelationOptions((current) => ({
            ...current,
            [field.name]: Array.isArray(items) ? (items as Row[]) : [],
          }));
        })
        .catch(() => {
          if (!alive) return;
          setRelationOptions((current) => ({ ...current, [field.name]: [] }));
        })
        .finally(() => {
          if (!alive) return;
          setRelationLoading((current) => ({ ...current, [field.name]: false }));
        });
    }
    return () => {
      alive = false;
    };
  }, [props.relationLoaders, relationFields]);

  const relationValue = (field: FormField, row: Row): string => {
    const key = field.relation?.valueKey ?? "id";
    const value = row[key];
    return value == null ? "" : String(value);
  };

  const relationLabel = (field: FormField, row: Row): string => {
    const preferred = [
      field.relation?.labelKey,
      "titulo",
      "title",
      "nome",
      "name",
      "descricao",
      "description",
      "email",
      "codigo",
      "code",
    ].filter(Boolean) as string[];
    for (const key of preferred) {
      const value = row[key];
      if (typeof value === "string" && value.trim()) return value;
    }
    const fallback = row[field.relation?.valueKey ?? "id"];
    return fallback == null ? "Registro sem título" : String(fallback);
  };

  const payload = (): Record<string, unknown> => {
    const body: Record<string, unknown> = {};
    for (const field of visibleFields) {
      const raw = values[field.name];
      if (raw == null || raw === "") {
        if (field.required) body[field.name] = "";
      } else if (field.type === "checkbox") {
        body[field.name] = raw === "true";
      } else if (field.type === "date") {
        body[field.name] = dateToIso(raw);
      } else if (field.type === "number" || field.relation) {
        const parsed = Number(raw);
        body[field.name] = Number.isNaN(parsed) ? raw : parsed;
      } else {
        body[field.name] = raw;
      }
    }
    return body;
  };

  const dateToIso = (value: string): string => {
    const date = new Date(value.includes("T") ? value : value + "T00:00:00");
    return Number.isNaN(date.getTime()) ? value : date.toISOString();
  };

  const update = (name: string, value: string) => {
    // Limpa feedback ao começar a editar de novo
    if (status !== "idle" && status !== "sending") setStatus("idle");
    setValues((v) => ({ ...v, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setMessage("");
    try {
      await props.submit(payload());
      setStatus("ok");
      setMessage("Cadastro realizado com sucesso!");
      setValues({});
      successToast();
      await props.onSuccess?.();
    } catch (err) {
      setStatus("error");
      setMessage(errorMessage(err));
    }
  };

  return (
    <form className="form" onSubmit={onSubmit}>
      <div className="form-grid">
        {visibleFields.map((f) => {
          const isTextarea = f.type === "textarea";
          const isRelation = Boolean(f.relation && props.relationLoaders?.[f.name]);
          const gridClass = isTextarea ? "field field-span-2" : "field";
          const options = relationOptions[f.name] ?? [];
          const loadingOptions = relationLoading[f.name];
          return (
            <label key={f.name} className={gridClass}>
              <span className="field-label">
                {f.label ?? f.name}
                {f.required && <span aria-label="obrigatório" style={{ color: "var(--color-error)", marginLeft: "4px" }}>*</span>}
              </span>
              {isRelation ? (
                <div className="relation-picker">
                  <select
                    required={f.required}
                    value={values[f.name] ?? ""}
                    onChange={(e) => update(f.name, e.target.value)}
                    disabled={loadingOptions || (relationOptions[f.name] ?? []).length === 0}
                  >
                    <option value="">
                      {loadingOptions
                        ? "Carregando opções..."
                        : (relationOptions[f.name] ?? []).length === 0
                          ? "Nenhum registro disponível"
                          : "Selecione uma opção"}
                    </option>
                    {options.map((option) => {
                      const value = relationValue(f, option);
                      return (
                        <option key={value} value={value}>
                          {relationLabel(f, option)}
                        </option>
                      );
                    })}
                  </select>
                </div>
              ) : isTextarea ? (
                <textarea
                  required={f.required}
                  placeholder={f.placeholder}
                  value={values[f.name] ?? ""}
                  onChange={(e) => update(f.name, e.target.value)}
                  rows={4}
                />
              ) : f.type === "checkbox" ? (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                  <input
                    type="checkbox"
                    required={f.required}
                    checked={values[f.name] === "true"}
                    onChange={(e) => update(f.name, String(e.target.checked))}
                    style={{ width: "18px", height: "18px", margin: 0, cursor: "pointer" }}
                  />
                  <span className="muted" style={{ fontSize: "0.85rem" }}>Marcar se aplicável</span>
                </div>
              ) : (
                <input
                  type={f.type ?? "text"}
                  required={f.required}
                  placeholder={f.placeholder}
                  value={values[f.name] ?? ""}
                  onChange={(e) => update(f.name, e.target.value)}
                />
              )}
            </label>
          );
        })}
      </div>

      <button className="btn btn-primary" type="submit" disabled={status === "sending"} style={{ alignSelf: "flex-start", marginTop: "8px" }}>
        <Save size={16} aria-hidden="true" />
        {status === "sending" ? "Enviando…" : (props.submitLabel ?? "Salvar Cadastro")}
      </button>

      {status === "ok" && (
        <div className="alert-banner alert-banner-success">
          <svg className="alert-banner-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
            <span>{message}</span>
        </div>
      )}

      {status === "error" && (
        <div className="alert-banner alert-banner-error">
          <svg className="alert-banner-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{message}</span>
        </div>
      )}
    </form>
  );
}
