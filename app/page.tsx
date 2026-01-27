import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, Lock } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-4 px-6 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">C</div>
          <span className="text-xl font-bold text-slate-800">성남신광교회</span>
        </div>
        <Link href="/login">
          <Button variant="outline" size="sm" className="gap-2">
            <Lock className="w-4 h-4" />
            관리자 로그인
          </Button>
        </Link>
      </header>

      {/* Hero Section */}
      <main className="flex-1 container mx-auto px-6 py-12">
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
            환영합니다
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            성남신광교회에 오신 것을 환영합니다.<br />
            이곳은 성도님들과 함께하는 온라인 공간입니다.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Facilities Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>비전센터 소개</CardTitle>
              <CardDescription>교회의 다양한 시설을 안내해 드립니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">
                대예배실, 비전홀, 로뎀나무 카페 등<br />
                성도님들을 위한 편안한 공간이 준비되어 있습니다.
              </p>
              {/* Note: In a real public app, we'd link to public pages. 
                  Since we only have admin pages now, I'll just show info or link to admin for demo purposes if user is authorized, 
                  but strictly public users can't see admin pages. 
                  For this task, I'll just leave it as information. 
              */}
              <div className="text-sm text-blue-600 font-medium">
                * 관리자 메뉴에서 수정 가능
              </div>
            </CardContent>
          </Card>

          {/* Ministries Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>섬기는 사람들</CardTitle>
              <CardDescription>교회를 섬기는 일꾼들을 소개합니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">
                각 위원회와 부서에서<br />
                하나님의 사랑으로 섬기고 있습니다.
              </p>
            </CardContent>
          </Card>

          {/* Training Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>양육 프로그램</CardTitle>
              <CardDescription>신앙의 성장을 돕는 프로그램입니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">
                제자훈련, 성경공부 등<br />
                체계적인 양육 과정이 있습니다.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 px-6 text-center">
        <p>© 2026 성남신광교회. All rights reserved.</p>
      </footer>
    </div>
  );
}
