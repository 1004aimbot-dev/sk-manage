"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [username, setUsername] = useState("admin");
    const [password, setPassword] = useState("admin");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const res = await signIn("credentials", {
            username,
            password,
            redirect: false,
        });

        if (res?.error) {
            toast.error("로그인 실패: 아이디/비번을 확인하세요 (admin/admin)");
            setLoading(false);
        } else {
            toast.success("로그인 성공!");
            router.push("/admin");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>성남신광교회 관리자</CardTitle>
                    <CardDescription>시스템 접근을 위해 로그인해주세요.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">아이디</label>
                            <Input
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="admin"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">비밀번호</label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="admin"
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "로그인 중..." : "로그인"}
                        </Button>
                        <div className="text-xs text-center text-slate-500">
                            * 테스트 계정: admin / admin
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
