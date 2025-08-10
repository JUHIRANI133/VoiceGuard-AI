"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/button";
import { FileText, Share2, AlertTriangle, ShieldCheck, HelpCircle } from "lucide-react";
import type { RiskLevel } from "@/types";

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
    high: "bg-destructive/20 text-destructive border-destructive/50 hover:bg-destructive/30",
    medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50 hover:bg-yellow-500/30",
    low: "bg-green-500/20 text-green-400 border-green-500/50 hover:bg-green-500/30",
  };
  const icon = {
    high: <AlertTriangle className="w-3 h-3 mr-1" />,
    medium: <HelpCircle className="w-3 h-3 mr-1" />,
    low: <ShieldCheck className="w-3 h-3 mr-1" />,
  }
  return <Badge variant="outline" className={badgeStyles[risk]}>{icon[risk]} {risk.charAt(0).toUpperCase() + risk.slice(1)}</Badge>;
};

export default function IncidentReportsPanel() {
  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter text-glow">Incident Report Center</h1>
            <p className="text-muted-foreground">Review flagged calls and suspicious activity.</p>
          </div>
          <Button className="glassmorphic hover:border-primary">
            <Share2 className="w-4 h-4 mr-2" />
            Export All
          </Button>
      </div>

      <Card className="glassmorphic holographic-noise flex-grow">
        <CardContent className="p-4">
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
                <TableRow key={index} className="glassmorphic-row border-b-white/10">
                  <TableCell>{report.date}</TableCell>
                  <TableCell>{report.caller}</TableCell>
                  <TableCell>{report.number}</TableCell>
                  <TableCell><RiskBadge risk={report.risk as RiskLevel} /></TableCell>
                  <TableCell>{report.type}</TableCell>
                  <TableCell>{report.verification}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                        <FileText className="w-4 h-4 mr-2"/>
                        Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
