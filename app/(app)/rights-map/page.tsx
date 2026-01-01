"use client";

import { useTranslation } from "@/lib/i18n";

interface Right {
  id: string;
  title: string;
  description: string;
  status: "active" | "pending" | "available";
  category: string;
  value?: string;
}

export default function RightsMapPage() {
  const { t } = useTranslation();

  // Mock data - in production, this would come from Convex
  const rights: Right[] = [
    {
      id: "1",
      title: "דמי אבטלה",
      description: "קצבה חודשית למובטלים",
      status: "active",
      category: "ביטוח לאומי",
      value: "₪4,200",
    },
    {
      id: "2",
      title: "מענק עבודה",
      description: "מענק שנתי לעובדים בשכר נמוך",
      status: "pending",
      category: "מס הכנסה",
    },
    {
      id: "3",
      title: "הנחה בארנונה",
      description: "הנחה של 70% בארנונה",
      status: "active",
      category: "עירייה",
      value: "₪1,800/שנה",
    },
    {
      id: "4",
      title: "קצבת נכות",
      description: "קצבה חודשית לבעלי נכות",
      status: "available",
      category: "ביטוח לאומי",
    },
    {
      id: "5",
      title: "סיוע בדיור",
      description: "סבסוד שכר דירה",
      status: "available",
      category: "משרד הבינוי",
    },
  ];

  const getStatusColor = (status: Right["status"]) => {
    switch (status) {
      case "active":
        return "bg-success-bg border-success text-success";
      case "pending":
        return "bg-warning-bg border-warning text-warning";
      case "available":
        return "bg-info-bg border-info text-info";
    }
  };

  const getStatusIcon = (status: Right["status"]) => {
    switch (status) {
      case "active":
        return "check_circle";
      case "pending":
        return "pending";
      case "available":
        return "add_circle";
    }
  };

  const getStatusLabel = (status: Right["status"]) => {
    switch (status) {
      case "active":
        return "פעיל";
      case "pending":
        return "בטיפול";
      case "available":
        return "זמין";
    }
  };

  const activeRights = rights.filter((r) => r.status === "active");
  const pendingRights = rights.filter((r) => r.status === "pending");
  const availableRights = rights.filter((r) => r.status === "available");

  const totalValue = activeRights.reduce((sum, r) => {
    const match = r.value?.match(/[\d,]+/);
    return sum + (match ? parseInt(match[0].replace(",", "")) : 0);
  }, 0);

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">map</span>
            </div>
            <div>
              <h1 className="text-xl font-black text-foreground">{t("dashboard.rightsMap")}</h1>
              <p className="text-sm text-muted-foreground">סקירה של כל הזכויות שלך</p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-2xl p-4 border border-border shadow-soft">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-success">check_circle</span>
              <span className="text-sm text-muted-foreground">פעילות</span>
            </div>
            <p className="text-2xl font-black text-foreground">{activeRights.length}</p>
          </div>
          <div className="bg-card rounded-2xl p-4 border border-border shadow-soft">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-warning">pending</span>
              <span className="text-sm text-muted-foreground">בטיפול</span>
            </div>
            <p className="text-2xl font-black text-foreground">{pendingRights.length}</p>
          </div>
          <div className="bg-card rounded-2xl p-4 border border-border shadow-soft">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-info">add_circle</span>
              <span className="text-sm text-muted-foreground">זמינות</span>
            </div>
            <p className="text-2xl font-black text-foreground">{availableRights.length}</p>
          </div>
          <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-4 text-white">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined">payments</span>
              <span className="text-sm text-white/80">ערך חודשי</span>
            </div>
            <p className="text-2xl font-black">₪{totalValue.toLocaleString()}</p>
          </div>
        </div>

        {/* Rights List */}
        <div className="space-y-6">
          {/* Active Rights */}
          {activeRights.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-success text-lg">check_circle</span>
                זכויות פעילות ({activeRights.length})
              </h2>
              <div className="space-y-3">
                {activeRights.map((right) => (
                  <div
                    key={right.id}
                    className="bg-card rounded-2xl p-4 border-2 border-success/30 shadow-soft"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-foreground">{right.title}</h3>
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-accent text-muted-foreground">
                            {right.category}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{right.description}</p>
                      </div>
                      {right.value && (
                        <div className="text-end">
                          <p className="text-lg font-black text-success">{right.value}</p>
                          <p className="text-xs text-muted-foreground">לחודש</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Pending Rights */}
          {pendingRights.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-warning text-lg">pending</span>
                בטיפול ({pendingRights.length})
              </h2>
              <div className="space-y-3">
                {pendingRights.map((right) => (
                  <div
                    key={right.id}
                    className="bg-card rounded-2xl p-4 border border-warning/30 shadow-soft"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-foreground">{right.title}</h3>
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-accent text-muted-foreground">
                            {right.category}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{right.description}</p>
                      </div>
                      <span className="px-3 py-1 rounded-lg text-xs font-bold bg-warning-bg text-warning">
                        בטיפול
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Available Rights */}
          {availableRights.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-info text-lg">add_circle</span>
                זכויות זמינות ({availableRights.length})
              </h2>
              <div className="space-y-3">
                {availableRights.map((right) => (
                  <div
                    key={right.id}
                    className="bg-card rounded-2xl p-4 border border-border shadow-soft hover:border-primary/30 transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-foreground">{right.title}</h3>
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-accent text-muted-foreground">
                            {right.category}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{right.description}</p>
                      </div>
                      <button className="h-9 px-4 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-bold transition-colors">
                        בדוק זכאות
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
