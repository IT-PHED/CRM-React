import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "@/services/axiosClient";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { ArrowLeft, Loader2, ZoomIn } from "lucide-react";
import ComplaintChat from "../pages/ComplaintChat";
import ResolveComplaint from "../components/ResolveComplaint";
import { useAuth } from "@/contexts/AuthContext";
/* ================= TYPES ================= */

type ComplaintDetails = {
  ticket: string;
  id: string;
  status: string;
  isResolved: boolean;
  complaintType: string;
  complaintSubType: string;
  remark?: string;
  dateGenerated: string;
  dateResolved: string | null;
  consumerId: string;
  consumerName: string;
  consumerAddress: string;
  consumerCategory: string;
  consumerPhoneNumber: string;
  meterNo: string;
  routeNumber: string;
  mediaURL?: string;
  email: string;
  maxDemand: string;
  ibc: string;
  bsc: string;
};

/* ================= COMPONENT ================= */

export default function ComplaintDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
   const { user } = useAuth();

  const [complaint, setComplaint] = useState<ComplaintDetails | null>(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    const fetchComplaint = async () => {
      const { data } = await axiosClient.get(`/complaint/ticket/${id}`);
      const d = data.data;

      setComplaint({
        id: d.id,
        ticket: d.ticket,
        status: d.status,
        isResolved: d.isResolved,
        complaintType: d.complaintType,
        complaintSubType: d.complaintSubType,
        remark: d.remark,
        dateGenerated: d.dateGenerated,
        dateResolved: d.dateResolved,
        consumerId: d.consumerId,
        consumerName: d.consumerName,
        consumerAddress: `${d.address1} ${d.address2 || ""} ${
          d.address3 || ""
        }`.trim(),
        consumerCategory: d.consumerCategory,
        consumerPhoneNumber: d.mobileNo,
        meterNo: d.meterNo,
        routeNumber: d.routeNumber,
        mediaURL: d.mediaURL,
        email: d.email,
        maxDemand: d.maxDemand,
        ibc: d.ibc,
        bsc: d.bsc,
      });

      setLoading(false);
    };

    fetchComplaint();
  }, [id]);
const handleResolved = () => {
  setComplaint((prev) => {
    if (!prev) return prev;

    return {
      ...prev,
      status: "Resolved",
      dateResolved: new Date().toISOString(),
    };
  });
};

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin h-6 w-6" />
      </div>
    );

  if (!complaint) return null;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <Button variant="ghost" onClick={() => navigate("/complaints/department")}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-xl md:text-2xl">
              Ticket #{complaint.ticket}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {complaint.complaintType} → {complaint.complaintSubType}
            </p>
            <p className="text-xs text-muted-foreground">
              {new Date(complaint.dateGenerated).toLocaleString()}
            </p>
          </div>
          <Badge className="self-start">{complaint.status}</Badge>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* MAIN CONTENT */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <p className="text-sm font-medium">Name</p>
                  <p className="text-sm text-muted-foreground">
                    {complaint.consumerName}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Category</p>
                  <p className="text-sm text-muted-foreground">
                    {complaint.consumerCategory}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">
                    {complaint.consumerPhoneNumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground break-all">
                    {complaint.email}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Address</p>
                <p className="text-sm text-muted-foreground">
                  {complaint.consumerAddress}
                </p>
              </div>
              {complaint.remark && (
                <div className="pt-2 border-t">
                  <p className="text-sm font-medium">Remark</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {complaint.remark}
                  </p>
                </div>
              )}
              {complaint.mediaURL && (
                <div className="pt-2">
                  <p className="text-sm font-medium mb-2">Attachment</p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="relative w-32 h-32 cursor-pointer group">
                        <img
                          src={complaint.mediaURL}
                          alt="Complaint attachment"
                          className="w-full h-full object-cover rounded-md border"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
                          <ZoomIn className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] p-0">
                      <img
                        src={complaint.mediaURL}
                        alt="Complaint attachment"
                        className="w-full h-full object-contain"
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </CardContent>
          </Card>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="meter">
              <AccordionTrigger>Meter & Route Details</AccordionTrigger>
              <AccordionContent>
                <div className="grid sm:grid-cols-2 gap-3 p-2">
                  <div>
                    <p className="text-sm font-medium">Meter Number</p>
                    <p className="text-sm text-muted-foreground">
                      {complaint.meterNo}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Max Demand</p>
                    <p className="text-sm text-muted-foreground">
                      {complaint.maxDemand}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Route Number</p>
                    <p className="text-sm text-muted-foreground">
                      {complaint.routeNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">IBC</p>
                    <p className="text-sm text-muted-foreground">
                      {complaint.ibc}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">BSC</p>
                    <p className="text-sm text-muted-foreground">
                      {complaint.bsc}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Account No</p>
                    <p className="text-sm text-muted-foreground">
                      {complaint.consumerId}
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* CHAT SIDEBAR */}
        <div className="lg:col-span-1">
          <ComplaintChat ticketId={complaint.id} user={user} />
        </div>
        {complaint?.status === "New" ? (
          <ResolveComplaint
            complaintId={complaint.id}
            onResolved={handleResolved}
          />
        ) : (
          <div className="rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            ✅ This complaint has already been resolved.
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: 16,
    height: "calc(100vh - 80px)"
  },
  left: {
    overflowY: "auto"
  },
  right: {
    height: "100%"
  },
  card: {
    background: "#fff",
    padding: 16,
    borderRadius: 12,
    border: "1px solid #e5e7eb"
  }
};
