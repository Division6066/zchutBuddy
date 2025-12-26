"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-y-auto overflow-x-hidden bg-white">
      {/* Background gradients */}
      <div className="absolute top-[-20%] right-[-20%] h-[60%] w-[80%] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] h-[50%] w-[60%] rounded-full bg-primary/5 blur-[80px] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between p-6 pt-12 z-20">
        <Link
          href="/app"
          className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-text-dark hover:bg-gray-100 transition-colors"
        >
          <Icon name="arrow_forward" size={24} />
        </Link>
        <div className="w-10 h-10" />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col px-6 relative z-10 w-full -mt-2">
        <div className="text-right mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary mb-4 shadow-sm">
            <Icon name="person_edit" size={26} className="text-primary" />
          </div>
          <h1 className="text-2xl font-extrabold text-text-dark mb-2">הגדרות פרופיל</h1>
          <p className="text-text-subtle text-sm">עדכן את פרטי החשבון שלך</p>
        </div>

        <div className="space-y-6">
          {/* Personal Information */}
          <Card className="p-5">
            <h2 className="font-bold text-lg text-text-dark mb-4">מידע אישי</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName" className="text-sm font-medium text-text-dark mb-2 block">
                  שם מלא
                </Label>
                <Input id="fullName" type="text" placeholder="הכנס שם מלא" className="w-full" />
              </div>
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-text-dark mb-2 block">
                  אימייל
                </Label>
                <Input id="email" type="email" placeholder="your@email.com" className="w-full" />
              </div>
              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-text-dark mb-2 block">
                  טלפון
                </Label>
                <Input id="phone" type="tel" placeholder="050-123-4567" className="w-full" />
              </div>
            </div>
          </Card>

          {/* Preferences */}
          <Card className="p-5">
            <h2 className="font-bold text-lg text-text-dark mb-4">העדפות</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-text-dark text-sm">התראות בדוא"ל</p>
                  <p className="text-xs text-text-subtle">קבל עדכונים על התקדמות התביעה</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked={true} />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-text-dark text-sm">התראות SMS</p>
                  <p className="text-xs text-text-subtle">קבל עדכונים בטקסט</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>
            </div>
          </Card>

          {/* Account Actions */}
          <Card className="p-5">
            <h2 className="font-bold text-lg text-text-dark mb-4">פעולות חשבון</h2>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Icon name="lock" size={20} className="mr-2" />
                שנה סיסמה
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Icon name="download" size={20} className="mr-2" />
                ייצא נתונים
              </Button>
              <Button variant="destructive" className="w-full justify-start">
                <Icon name="delete" size={20} className="mr-2" />
                מחק חשבון
              </Button>
            </div>
          </Card>
        </div>

        {/* Save Button */}
        <div className="mt-8 mb-10">
          <Button className="w-full h-14 rounded-2xl bg-primary text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-light">
            <span className="text-lg font-bold">שמור שינויים</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
