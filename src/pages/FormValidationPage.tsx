import { SeoHead } from "../components/SeoHead";
import FormWorkflow from "../tools/FormWorkflow";
import { useTranslation } from "@/hooks/useI18n";

export default function FormValidationPage() {
  const { t } = useTranslation();
  return (
    <article className="animate-fade-in">
      <SeoHead
        title={t("formValidation.seoTitle") || "Form Validation Workflow"}
        description={t("formValidation.seoDesc") || "Build multi-field form validation with visual rule builder, cross-field logic, simulation, and export to Zod, Yup, React Hook Form."}
      />
      <h1 className="text-2xl font-semibold tracking-tight">{t("formValidation.title") || "Form Validation Workflow"}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t("formValidation.subtitle") || "Build multi-field form validation visually — define fields, set rules, simulate, and export production-ready code."}</p>
      <div className="mt-6"><FormWorkflow /></div>
    </article>
  );
}
