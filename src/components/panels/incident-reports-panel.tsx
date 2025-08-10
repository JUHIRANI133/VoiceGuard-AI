"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "../button";
import { FileText, Share2, AlertTriangle, ShieldCheck, HelpCircle } from "lucide-react";
import type { RiskLevel } from "@/types";
import { useState } from "react";
import { cn } from "@/lib/utils";

const mockReports = [
  { date: "2024-08-14", caller: "Rohan Kumar", number: "+91 98765 43210", risk: "high", type: "Impersonation", verification: "Spoofed" },
  { date: "2024-08-13", caller: "Priya Sharma", number: "Unknown", risk: "medium", type: "Urgency Tactics", verification: "Unknown" },
  { date: "2024-08-12", caller: "Amit Singh", number: "+91 87654 32109", risk: "low", type: "Safe", verification: "Verified" },
  { date: "2024-08-11", caller: "Anjali Gupta", number: "+91 76543 21098", risk: "high", type: "Tech Support Scam", verification: "Spoofed" },
  { date: "2024-08-10", caller: "Vikram Mehta", number: "+91 99887 76655", risk: "high", type: "Bank Fraud", verification: "Spoofed" },
  { date: "2024-08-09", caller: "Sneha Reddy", number: "Unknown", risk: "medium", type: "Lottery Scam", verification: "Unknown" },
  { date: "2024-08-08", caller: "Deepak Yadav", number: "+91 88776 65544", risk: "low", type: "Safe", verification: "Verified" },
  { date: "2024-08-07", caller: "Sunita Devi", number: "+91 77665 54433", risk: "high", type: "Job Offer Scam", verification: "Spoofed" },
  { date: "2024-08-06", caller: "Rajesh Patel", number: "+91 91234 56789", risk: "medium", type: "KYC Update Scam", verification: "Unknown" },
  { date: "2024-08-05", caller: "Pooja Desai", number: "+91 82345 67890", risk: "high", type: "Electricity Bill Fraud", verification: "Spoofed" },
  { date: "2024-08-04", caller: "Sanjay Verma", number: "Unknown", risk: "low", type: "Safe", verification: "Verified" },
  { date: "2024-08-03", caller: "Meera Iyer", number: "+91 73456 78901", risk: "medium", type: "Investment Scam", verification: "Spoofed" }
];

const RiskBadge = ({ risk }: { risk: RiskLevel }) => {
  const badgeStyles = {
    high: "bg-risk-danger/20 text-risk-danger border-risk-danger/50 hover:bg-risk-danger/30",
    medium: "bg-risk-caution/20 text-risk-caution border-risk-caution/50 hover:bg-risk-caution/30",
    low: "bg-risk-safe/20 text-risk-safe border-risk-safe/50 hover:bg-risk-safe/30",
  };
  const icon = {
    high: <AlertTriangle className="w-3 h-3 mr-1" />,
    medium: <HelpCircle className="w-3 h-3 mr-1" />,
    low: <ShieldCheck className="w-3 h-3 mr-1" />,
  }
  return <Badge variant="outline" className={cn("border", badgeStyles[risk])}>{icon[risk]} {risk.charAt(0).toUpperCase() + risk.slice(1)}</Badge>;
};

const ReportCard = ({ report, onBack }: { report: typeof mockReports[0], onBack: () => void }) => (
    <Card className="glassmorphic-card holographic-noise shine-sweep h-full flex flex-col justify-between">
        <CardHeader>
            <CardTitle>Incident Details</CardTitle>
            <CardDescription>Call from {report.caller} on {report.date}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div><strong>Caller:</strong> {report.caller}</div>
            <div><strong>Number:</strong> {report.number}</div>
            <div><strong>Risk Level:</strong> <RiskBadge risk={report.risk as RiskLevel}/></div>
            <div><strong>Detected Threat:</strong> {report.type}</div>
            <div><strong>Verification Status:</strong> {report.verification}</div>
        </CardContent>
        <div className="p-6">
          <Button onClick={onBack}>Back to Reports</Button>
        </div>
    </Card>
);

export default function IncidentReportsPanel() {
  const [selectedReport, setSelectedReport] = useState<typeof mockReports[0] | null>(null);

  const handleSelectReport = (report: typeof mockReports[0]) => {
    setSelectedReport(report);
  };

  const handleBack = () => {
    setSelectedReport(null);
  };

  if (selectedReport) {
    return <ReportCard report={selectedReport} onBack={handleBack} />;
  }

  return (
    <div className="h-full flex flex-col gap-6 animate-text-fade-in">
      <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter">Incident Report Center</h1>
            <p className="text-muted-foreground">Review flagged calls and suspicious activity.</p>
          </div>
          <Button variant="glass" className="border-primary text-primary">
            <Share2 className="w-4 h-4 mr-2" />
            Export All
          </Button>
      </div>

      <Card className="glassmorphic-card holographic-noise flex-grow">
        <CardContent className="p-4">
          <div className="overflow-auto">
            <Table>
                <TableHeader>
                <TableRow className="hover:bg-transparent border-b-white/20">
                    <TableHead>Date</TableHead>
                    <TableHead>Caller</TableHead>
                    <TableHead>Caller Number</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Detected Threat</TableHead>
                    <TableHead>Verification</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {mockReports.map((report, index) => (
                    <TableRow key={index} className="glassmorphic-row border-b-white/10 hover:bg-primary/10">
                    <TableCell>{report.date}</TableCell>
                    <TableCell>{report.caller}</TableCell>
                    <TableCell>{report.number}</TableCell>
                    <TableCell><RiskBadge risk={report.risk as RiskLevel} /></TableCell>
                    <TableCell>{report.type}</TableCell>
                    <TableCell>{report.verification}</TableCell>
                    <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleSelectReport(report)}>
                            <FileText className="w-4 h-4 mr-2"/>
                            Details
                        </Button>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
