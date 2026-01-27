"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { FileSpreadsheet, Loader2, Upload, AlertCircle } from "lucide-react";
import * as XLSX from 'xlsx';
import { createMember } from "@/actions/member-actions";

type ParsedMember = {
    name: string;
    role: string;
    phone: string;
    gender: string;
    birthDate: string;
    address: string;
};

export function ExcelUploadDialog({ onUploadComplete }: { onUploadComplete: () => void }) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [parsedData, setParsedData] = useState<ParsedMember[]>([]);
    const [fileName, setFileName] = useState("");
    const [isParsing, setIsParsing] = useState(false);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        setIsParsing(true);

        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const bstr = evt.target?.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                // Assuming header row is row 1 (index 0)
                const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

                // Remove header and map (assuming standard order or check header names)
                // Let's rely on specific header names roughly or index.
                // Format: [Name, Role, Phone, Gender, BirthDate, Address]
                const rows = data.slice(1) as any[][];

                const mapped: ParsedMember[] = rows.map((row: any[]) => ({
                    name: row[0] || "",
                    role: row[1] || "성도",
                    phone: row[2] ? String(row[2]) : "",
                    gender: row[3] || "여",
                    birthDate: row[4] ? String(row[4]) : "", // Consider parsing dates better later if needed
                    address: row[5] || ""
                })).filter(r => r.name); // Filter empty rows

                setParsedData(mapped);
                toast.success(`${mapped.length}명의 데이터를 불러왔습니다.`);
            } catch (err) {
                console.error(err);
                toast.error("파일을 읽는 중 오류가 발생했습니다.");
            } finally {
                setIsParsing(false);
            }
        };
        reader.readAsBinaryString(file);
    };

    const handleRegister = () => {
        if (parsedData.length === 0) return;

        startTransition(async () => {
            let successCount = 0;
            let failCount = 0;

            // Simple loop for now - optimal would be a bulk insert API
            for (const member of parsedData) {
                // Formatting data to match schema expectations
                // Birthdate needs to be handled carefully if passing to schema that expects Date string or Date object
                // Phone normalization might be needed

                const payload = {
                    ...member,
                    // If phone is just numbers, maybe format? Zod might require specific format.
                    // For MVP, passing as is.
                };

                const result = await createMember(payload as any);
                if (result.success) successCount++;
                else failCount++;
            }

            if (failCount === 0) {
                toast.success(`${successCount}명 전원 등록 완료!`);
            } else {
                toast.warning(`${successCount}명 성공, ${failCount}명 실패.`);
            }

            setOpen(false);
            setParsedData([]);
            setFileName("");
            onUploadComplete();
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="ml-2">
                    <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" /> 엑셀 일괄 등록
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle>교인 엑셀 일괄 등록</DialogTitle>
                    <DialogDescription>
                        엑셀 파일을 업로드하여 다수의 교인을 한 번에 등록합니다.<br />
                        형식: [이름, 직분, 전화번호, 성별, 생년월일, 주소] 순서
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto py-4 space-y-4">
                    <div className="flex items-center gap-4 border p-4 rounded-lg bg-muted/50">
                        <Upload className="h-6 w-6 text-muted-foreground" />
                        <div className="flex-1">
                            <label htmlFor="excel-upload" className="cursor-pointer block">
                                <span className="bg-primary text-primary-foreground px-3 py-1.5 rounded-md text-sm hover:bg-primary/90 transition">
                                    파일 선택
                                </span>
                                <input
                                    id="excel-upload"
                                    type="file"
                                    accept=".xlsx, .xls"
                                    className="hidden"
                                    onChange={handleFileUpload}
                                />
                                <span className="ml-3 text-sm text-muted-foreground">
                                    {fileName || "선택된 파일 없음"}
                                </span>
                            </label>
                        </div>
                        {isParsing && <Loader2 className="h-4 w-4 animate-spin" />}
                    </div>

                    {parsedData.length > 0 && (
                        <div className="border rounded-md">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>이름</TableHead>
                                        <TableHead>직분</TableHead>
                                        <TableHead>전화번호</TableHead>
                                        <TableHead>성별</TableHead>
                                        <TableHead>생년월일</TableHead>
                                        <TableHead>주소</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {parsedData.map((row, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell>{row.name}</TableCell>
                                            <TableCell>{row.role}</TableCell>
                                            <TableCell>{row.phone}</TableCell>
                                            <TableCell>{row.gender}</TableCell>
                                            <TableCell>{row.birthDate}</TableCell>
                                            <TableCell className="truncate max-w-[150px]">{row.address}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}

                    {parsedData.length === 0 && !isParsing && (
                        <div className="text-center py-8 text-muted-foreground text-sm flex flex-col items-center">
                            <AlertCircle className="h-8 w-8 mb-2 opacity-50" />
                            엑셀 파일을 업로드하면 미리보기가 표시됩니다.
                        </div>
                    )}
                </div>

                <DialogFooter className="mt-auto pt-4 border-t">
                    <Button variant="outline" onClick={() => setOpen(false)}>취소</Button>
                    <Button onClick={handleRegister} disabled={parsedData.length === 0 || isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {parsedData.length > 0 ? `${parsedData.length}명 등록하기` : "등록하기"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
