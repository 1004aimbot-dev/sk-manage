"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { User, Music, Users, Edit, Save } from "lucide-react";

// Mock Data Structure for Officers
interface GroupOfficers {
    conductor: string; // 지휘자
    accompanist: string; // 반주자
    captain: string; // 대장
    generalManager: string; // 총무
    accountant: string; // 회계
    secretary: string; // 서기
}

interface WorshipGroupDetailProps {
    groupName: string;
    groupId: string;
    // We can pass initial data if we had it
}

export function WorshipGroupDetail({ groupName, groupId }: WorshipGroupDetailProps) {
    // State for Officers
    const [officers, setOfficers] = useState<GroupOfficers>({
        conductor: "김지휘",
        accompanist: "이반주",
        captain: "박대장",
        generalManager: "최총무",
        accountant: "정회계",
        secretary: "강서기"
    });
    const [isEditingOfficers, setIsEditingOfficers] = useState(false);
    const [tempOfficers, setTempOfficers] = useState<GroupOfficers>(officers);

    // Mock Data for Members (just for UI demo, in real app usage we might pass this or fetch it)
    // The previous page.tsx fetched members. We can keep fetching there and pass here, or fetch here.
    // For simplicity, let's allow passing children (Member Table) or replicate member list here.
    // Let's accept `children` for the Member List section to reuse the existing logic in page.tsx if possible,
    // OR we can move the member list logic here. 
    // Given the prompt "Add fields... make them visible first", I will put Officers on top.

    const handleSaveOfficers = () => {
        setOfficers(tempOfficers);
        setIsEditingOfficers(false);
        // In real app, server action to save
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold tracking-tight">{groupName} 관리</h2>
            </div>

            {/* Officers Section */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Users className="w-5 h-5" /> 임원 조직
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={() => {
                        if (isEditingOfficers) handleSaveOfficers();
                        else {
                            setTempOfficers(officers);
                            setIsEditingOfficers(true);
                        }
                    }}>
                        {isEditingOfficers ? <Save className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
                        {isEditingOfficers ? "저장" : "수정"}
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                        <OfficerField label="지휘자" value={officers.conductor} isEditing={isEditingOfficers}
                            onChange={(v) => setTempOfficers({ ...tempOfficers, conductor: v })} icon={Music} />
                        <OfficerField label="반주자" value={officers.accompanist} isEditing={isEditingOfficers}
                            onChange={(v) => setTempOfficers({ ...tempOfficers, accompanist: v })} icon={Music} />
                        <OfficerField label="대장" value={officers.captain} isEditing={isEditingOfficers}
                            onChange={(v) => setTempOfficers({ ...tempOfficers, captain: v })} icon={User} />
                        <OfficerField label="총무" value={officers.generalManager} isEditing={isEditingOfficers}
                            onChange={(v) => setTempOfficers({ ...tempOfficers, generalManager: v })} icon={User} />
                        <OfficerField label="회계" value={officers.accountant} isEditing={isEditingOfficers}
                            onChange={(v) => setTempOfficers({ ...tempOfficers, accountant: v })} icon={User} />
                        <OfficerField label="서기" value={officers.secretary} isEditing={isEditingOfficers}
                            onChange={(v) => setTempOfficers({ ...tempOfficers, secretary: v })} icon={User} />
                    </div>
                </CardContent>
            </Card>

            {/* This is where the Member List from page.tsx will go if we compose them, 
                but reusing the styling here ensures consistency. 
                I'll export this component and let page.tsx render the member list below it.
            */}
        </div>
    );
}

function OfficerField({
    label, value, isEditing, onChange, icon: Icon
}: {
    label: string, value: string, isEditing: boolean, onChange: (val: string) => void, icon: any
}) {
    return (
        <div className="flex items-center space-x-4 p-3 rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-2 bg-primary/10 rounded-full">
                <Icon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{label}</p>
                {isEditing ? (
                    <Input
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="h-8 text-sm"
                    />
                ) : (
                    <p className="text-base font-semibold">{value || "-"}</p>
                )}
            </div>
        </div>
    );
}
