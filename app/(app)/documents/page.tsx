"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/i18n";

interface Document {
  id: string;
  name: string;
  type: string;
  category: string;
  uploadedAt: string;
  size: string;
}

export default function DocumentsPage() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", label: "הכל", icon: "folder" },
    { id: "id", label: t("documents.types.id"), icon: "badge" },
    { id: "medical", label: t("documents.types.medical"), icon: "medical_information" },
    { id: "financial", label: t("documents.types.financial"), icon: "account_balance" },
    { id: "other", label: t("documents.types.other"), icon: "description" },
  ];

  // Mock data - in production, this would come from Convex
  const documents: Document[] = [
    {
      id: "1",
      name: "תעודת זהות",
      type: "PDF",
      category: "id",
      uploadedAt: "12/12/2024",
      size: "1.2 MB",
    },
    {
      id: "2",
      name: "אישור רפואי",
      type: "PDF",
      category: "medical",
      uploadedAt: "10/12/2024",
      size: "0.8 MB",
    },
    {
      id: "3",
      name: "תלוש משכורת דצמבר",
      type: "PDF",
      category: "financial",
      uploadedAt: "01/12/2024",
      size: "0.3 MB",
    },
    {
      id: "4",
      name: "מכתב פיטורין",
      type: "PDF",
      category: "other",
      uploadedAt: "28/11/2024",
      size: "0.2 MB",
    },
    {
      id: "5",
      name: "טופס 106",
      type: "PDF",
      category: "financial",
      uploadedAt: "15/11/2024",
      size: "0.5 MB",
    },
  ];

  const filteredDocuments =
    activeCategory === "all"
      ? documents
      : documents.filter((doc) => doc.category === activeCategory);

  const getCategoryIcon = (category: string) => {
    const cat = categories.find((c) => c.id === category);
    return cat?.icon || "description";
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">folder</span>
              </div>
              <div>
                <h1 className="text-xl font-black text-foreground">{t("documents.title")}</h1>
                <p className="text-sm text-muted-foreground">{documents.length} מסמכים</p>
              </div>
            </div>
            <button className="h-10 px-4 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold flex items-center gap-2 transition-colors shadow-primary">
              <span className="material-symbols-outlined text-lg">upload</span>
              <span className="hidden sm:inline">{t("documents.upload")}</span>
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
                activeCategory === category.id
                  ? "bg-primary text-white shadow-primary"
                  : "bg-card border border-border text-foreground hover:bg-accent"
              }`}
            >
              <span className="material-symbols-outlined text-lg">{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>

        {/* Documents Grid */}
        {filteredDocuments.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="bg-card rounded-2xl p-4 border border-border shadow-soft hover:shadow-md hover:border-primary/30 transition-all cursor-pointer"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-2xl">
                      {getCategoryIcon(doc.category)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-foreground truncate">{doc.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {doc.type} • {doc.size}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">הועלה {doc.uploadedAt}</span>
                  <div className="flex gap-1">
                    <button className="size-8 rounded-lg hover:bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                      <span className="material-symbols-outlined text-lg">download</span>
                    </button>
                    <button className="size-8 rounded-lg hover:bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                      <span className="material-symbols-outlined text-lg">more_vert</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="size-20 rounded-2xl bg-accent text-muted-foreground flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-4xl">folder_off</span>
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">{t("documents.empty")}</h3>
            <p className="text-muted-foreground mb-6">העלה מסמכים לאחסון מאובטח</p>
            <button className="h-12 px-6 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold flex items-center gap-2 mx-auto transition-colors shadow-primary">
              <span className="material-symbols-outlined">upload</span>
              {t("documents.upload")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
