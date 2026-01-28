"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { User, Music, Users, Edit, Save } from "lucide-react";
import { upsertMinistry } from "@/actions/ministry";
import { toast } from "sonner";

// Mock Data Structure for Officers
interface GroupOfficers {
    conductor: string;
    accompanist: string;
    captain: string;
    generalManager: string;
    accountant: string;
    secretary: string;
}

interface WorshipGroupDetailProps {
    groupName: string;
    groupId: string;
    initialOfficers?: GroupOfficers;
}

const DEFAULT_OFFICERS: GroupOfficers = {
    conductor: "",
    accompanist: "",
    captain: "",
    generalManager: "",
    accountant: "",
    secretary: ""
};

export function WorshipGroupDetail({ groupName, groupId, initialOfficers }: WorshipGroupDetailProps) {
    const [officers, setOfficers] = useState<GroupOfficers>(initialOfficers || DEFAULT_OFFICERS);
    const [isEditingOfficers, setIsEditingOfficers] = useState(false);
    const [tempOfficers, setTempOfficers] = useState<GroupOfficers>(officers);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (initialOfficers) {
            setOfficers(initialOfficers);
            setTempOfficers(initialOfficers);
        }
    }, [initialOfficers]);

    const handleSaveOfficers = async () => {
        setIsLoading(true);
        try {
            const res = await upsertMinistry('WORSHIP', groupId, {
                name: groupName, // Ensure name is saved
                roleInfo: JSON.stringify(tempOfficers)
            });

            if (res.success) {
                setOfficers(tempOfficers);
                setIsEditingOfficers(false);
                toast.success("임원 조직이 저장되었습니다.");
            } else {
                toast.error("저장 실패: " + res.error);
            }
        } catch (e) {
            console.error(e);
            toast.error("오류가 발생했습니다.");
        } finally {
            setIsLoading(false);
        }
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
                    }} disabled={isLoading}>
                        {isEditingOfficers ? <Save className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
                        {isEditingOfficers ? "저장" : "수정"}
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                        {/* 
                            Fix: Pass tempOfficers values when editing, otherwise officers.
                            OR consistently use logic inside OfficerField.
                            Here we pass the value depending on mode to be explicit, but OfficerField can handle it.
                            Let's pass the correct value based on isEditing.
                        */}
                        <OfficerField label="지휘자" value={isEditingOfficers ? tempOfficers.conductor : officers.conductor} isEditing={isEditingOfficers}
                            onChange={(v) => setTempOfficers(prev => ({ ...prev, conductor: v }))} icon={Music} />
                        <OfficerField label="반주자" value={isEditingOfficers ? tempOfficers.accompanist : officers.accompanist} isEditing={isEditingOfficers}
                            onChange={(v) => setTempOfficers(prev => ({ ...prev, accompanist: v }))} icon={Music} />
                        <OfficerField label="대장" value={isEditingOfficers ? tempOfficers.captain : officers.captain} isEditing={isEditingOfficers}
                            onChange={(v) => setTempOfficers(prev => ({ ...prev, captain: v }))} icon={User} />
                        <OfficerField label="총무" value={isEditingOfficers ? tempOfficers.generalManager : officers.generalManager} isEditing={isEditingOfficers}
                            onChange={(v) => setTempOfficers(prev => ({ ...prev, generalManager: v }))} icon={User} />
                        <OfficerField label="회계" value={isEditingOfficers ? tempOfficers.accountant : officers.accountant} isEditing={isEditingOfficers}
                            onChange={(v) => setTempOfficers(prev => ({ ...prev, accountant: v }))} icon={User} />
                        <OfficerField label="서기" value={isEditingOfficers ? tempOfficers.secretary : officers.secretary} isEditing={isEditingOfficers}
                            onChange={(v) => setTempOfficers(prev => ({ ...prev, secretary: v }))} icon={User} />
                    </div>
                </CardContent>
            </Card>
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
                        value={value || ""}
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
