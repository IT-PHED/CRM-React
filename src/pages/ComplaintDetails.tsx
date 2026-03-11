/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { useAuth } from "@/contexts/AuthContext";
import {
  GetComplaintInformation,
  useGetAllRegionalUsersTable,
  useReassignComplaint,
} from "@/hooks/useApiQuery";
import { Check, ChevronsUpDown, Loader2, ZoomIn } from "lucide-react";
import ResolveComplaint from "../components/ResolveComplaint";
import ComplaintChat from "../pages/ComplaintChat";
import CloseComplaint from "@/components/closeComplaint";
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
  assignedTo?: string | null;
  regionId?: string | null;
  region_Id?: string | null;
};

/* ================= COMPONENT ================= */

export default function ComplaintDetails() {
  const { user } = useAuth();
  const { isLoading, complaintInfo } = GetComplaintInformation();

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const [complaint, setComplaint] = useState<ComplaintDetails | null>(null);

  const customerServiceId = "64737384838778640014";
  const isCustomerCareAgent = user?.departmentId == customerServiceId;

  const complaintDetails = complaintInfo?.data;

  const resolvedRegionId = complaintDetails?.regionId || "";

  console.log("DEBUG: Resolved Region ID Value:", resolvedRegionId);
  console.log("DEBUG: Hook Execution State:", {
    isReady,
    finalRegionIdSent: isReady
      ? resolvedRegionId
      : "EMPTY (Waiting for 2s delay)",
    consumerId: complaintDetails?.consumerId,
  });

  const { allRegionalStaffs } = useGetAllRegionalUsersTable(
    user.departmentId,
    complaintDetails?.consumerId ?? "0",
    isReady ? resolvedRegionId : ""
  );
  const { reassignComplaint, isPending } = useReassignComplaint();

  // assignment state
  const [employees, setEmployees] = useState<any[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [assignedStaffId, setAssignedStaffId] = useState<string>("");
  const [openAssign, setOpenAssign] = useState(false);
  const [assignedTo, setAssignedTo] = useState<{
    name?: string;
    email?: string;
  } | null>(null);
  const [assignData, setAssignData] = useState({
    assignToStaffId: "",
    assignToEmail: "",
    assignTo: "",
  });

  // resolve assigned staff's display name/email when employees or assignedStaffId change
  useEffect(() => {
    if (!assignedStaffId) return;
    const emp = employees.find((e) => e.staffId === assignedStaffId);
    if (emp) {
      setAssignedTo({ name: emp.name, email: emp.email });
    }
  }, [employees, assignedStaffId]);

  const handleAssign = async () => {
    const payload = {
      ticketId: complaintDetails.ticket,
      consumerId: complaintDetails?.consumerId,
      assignStaffId: assignData.assignToStaffId,
      assignEmail: assignData.assignToEmail,
    };

    reassignComplaint(payload);
  };

  /* ================= FETCH DATA ================= */
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

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin h-6 w-6" />
      </div>
    );

  // if (!complaint) return null;

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* <Button
        variant="ghost"
        onClick={() => navigate("/complaints/department")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button> */}

      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-xl md:text-2xl">
              Ticket #{complaintDetails?.ticket}
            </CardTitle>
            <CardTitle className="text-md text-muted-foreground">
              {complaintDetails?.complaintType} →{" "}
              {complaintDetails?.complaintSubType}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {new Date(complaintDetails?.dateGenerated).toLocaleString()}
            </p>
          </div>
          <Badge className="self-start">{complaintDetails?.status}</Badge>
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
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Consumer Name
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {complaintDetails?.consumerName}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Consumer ID
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {complaintDetails?.consumerId}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Category
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {complaintDetails?.consumerCategory}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Phone
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {complaintDetails?.consumerPhoneNumber || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Email
                  </p>
                  <p
                    className="text-sm font-medium text-gray-900 truncate"
                    title={complaintDetails?.email}
                  >
                    {complaintDetails?.email || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Date Generated
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {complaintDetails?.dateGenerated
                      ? new Date(
                          complaintDetails.dateGenerated
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Region ID
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {resolvedRegionId || "N/A"}
                  </p>
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Complaint Details Section */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Complaint Type
                  </p>
                  <div className="mt-1">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-md">
                      {complaintDetails?.complaintType}
                    </span>
                    <p className="text-sm text-gray-600 mt-1">
                      {complaintDetails?.complaintSubType}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    BSC
                  </p>
                  <p className="text-sm text-gray-900 mt-1">
                    {complaintDetails?.bsc}
                  </p>
                </div>
              </div>

              {/* Address Section */}
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Service Address
                </p>
                <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                  {complaintDetails?.consumerAddress}
                </p>
              </div>
              {complaintDetails?.remark && (
                <div className="pt-2 border-t">
                  <p className="text-sm font-medium">Remark</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {complaintDetails?.remark}
                  </p>
                </div>
              )}
              {complaintDetails?.mediaURL && (
                <div className="pt-2">
                  <p className="text-sm font-medium mb-2">Attachment</p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="relative w-32 h-32 cursor-pointer group">
                        <img
                          src={complaintDetails?.mediaURL}
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
                        src={complaintDetails?.mediaURL}
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
                      {complaintDetails?.meterNo}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Max Demand</p>
                    <p className="text-sm text-muted-foreground">
                      {complaintDetails?.maxDemand}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Route Number</p>
                    <p className="text-sm text-muted-foreground">
                      {complaintDetails?.routeNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">IBC</p>
                    <p className="text-sm text-muted-foreground">
                      {complaintDetails?.ibc}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">BSC</p>
                    <p className="text-sm text-muted-foreground">
                      {complaintDetails?.bsc}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Account No</p>
                    <p className="text-sm text-muted-foreground">
                      {complaintDetails?.consumerId}
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="grid gap-4 md:grid-cols-2">
            {complaintDetails?.status.toLocaleLowerCase() === "new" || complaintDetails?.status.toLocaleLowerCase() === "allocated" && (
              <Card>
                <CardHeader>
                  <CardTitle>Assign Staff</CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Currently Assigned To
                      </p>
                      <p className="font-medium text-sm">
                        {complaintDetails?.assignedTo
                          ? assignedTo?.name ??
                            `Staff ${complaintDetails.assignedTo}`
                          : "Assigned to nobody yet"}
                      </p>
                    </div>

                    <div className="mt-2">
                      <Label htmlFor="assign">Assign To</Label>

                      <Popover open={openAssign} onOpenChange={setOpenAssign}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openAssign}
                            className="w-full justify-between"
                            disabled={!allRegionalStaffs?.data?.length} // keep disabled when empty
                          >
                            {!allRegionalStaffs?.data?.length
                              ? "No staff found"
                              : assignData.assignTo
                              ? allRegionalStaffs?.data.find(
                                  (emp: any) =>
                                    `${emp.staffId}-${emp.email}` ===
                                    assignData.assignTo
                                )?.name || "Select staff"
                              : "Select staff"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Search staff..." />
                            <CommandList>
                              <CommandEmpty>No staff found.</CommandEmpty>
                              <CommandGroup>
                                {allRegionalStaffs?.data.map((emp: any) => (
                                  <CommandItem
                                    key={emp.email}
                                    value={`${emp.staffId}-${emp.email}`}
                                    onSelect={(currentValue) => {
                                      const [staffId, email] =
                                        currentValue.split("-");
                                      setAssignData({
                                        ...assignData,
                                        assignTo: currentValue,
                                        assignToEmail: email,
                                        assignToStaffId: staffId,
                                      });
                                      setOpenAssign(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        assignData.assignTo ===
                                          `${emp.staffId}-${emp.email}`
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {emp.staffId} --- {emp.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>

                      <Button
                        onClick={() => handleAssign()}
                        disabled={!assignData.assignToStaffId}
                        className="mt-2 w-full"
                      >
                        {isPending ? "Reassigning..." : "Assign"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <>
              {complaintDetails?.status.toLocaleLowerCase() === "new" || complaintDetails?.status.toLocaleLowerCase() === "allocated" ? (
                <ResolveComplaint
                  complaintId={complaintDetails.id ?? ""}
                  onResolved={handleResolved}
                />
              ) : (
                <div className="rounded-xl border border-green-200 bg-green-50/50 overflow-hidden col-span-2">
                  {/* Header Section */}
                  <div className="bg-green-100/50 px-4 py-3 border-b border-green-200 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-green-800 font-semibold text-sm">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-200 text-green-700">
                        ✓
                      </span>
                      Complaint Resolved
                    </div>
                    <span className="text-[10px] font-medium uppercase text-green-600 tracking-wider">
                      {complaintDetails?.dateResolved
                        ? new Date(
                            complaintDetails?.dateResolved
                          ).toLocaleDateString()
                        : "Date Unknown"}
                    </span>
                  </div>

                  {/* Comment Body */}
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <p className="text-xs font-bold text-green-800 uppercase mb-1">
                          Resolution Remark
                        </p>
                        <p className="text-sm text-green-900 leading-relaxed italic">
                          "
                          {complaintDetails?.feedback ||
                            "No resolution remark provided."}
                          "
                        </p>

                        <div className="mt-4 flex items-center gap-2 pt-3 border-t border-green-200/50">
                          <div className="h-7 w-7 rounded-full bg-green-200 flex items-center justify-center text-[10px] font-bold text-green-700">
                            {complaintDetails?.resolvedBy
                              ?.substring(0, 2)
                              .toUpperCase() || "ST"}
                          </div>
                          <div>
                            <p className="text-[11px] text-green-800 font-bold leading-none">
                              Resolved By
                            </p>
                            <p className="text-[10px] text-green-600">
                              Staff ID:{" "}
                              {complaintDetails?.resolvedBy || "System"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>

            {isCustomerCareAgent &&
              complaintDetails?.status.toLocaleLowerCase() === "resolved" && (
                <div className="col-span-2">
                  <CloseComplaint complaintId={complaintDetails.id ?? ""} />
                </div>
              )}
            <div className="space-y-4">
              {/* FINAL STATE: If status is closed, show the final closure details */}
              {complaintDetails?.status.toLocaleLowerCase() === "closed" && (
                <div className="rounded-xl border border-blue-200 bg-blue-50/30 overflow-hidden col-span-2">
                  {/* Header */}
                  <div className="bg-blue-100/50 px-4 py-3 border-b border-blue-200 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-blue-800 font-semibold text-sm">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white text-[10px]">
                        🔒
                      </span>
                      Ticket Permanently Closed
                    </div>
                    <span className="text-[10px] font-medium uppercase text-blue-600 tracking-wider">
                      {complaintDetails?.closedDate
                        ? new Date(complaintDetails.closedDate).toLocaleString()
                        : "Date Unknown"}
                    </span>
                  </div>

                  {/* Closure Content */}
                  <div className="p-4">
                    <p className="text-xs font-bold text-blue-800 uppercase mb-1">
                      Final Closure Remark
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed bg-white/50 p-3 rounded-lg border border-blue-100 italic">
                      "
                      {complaintDetails?.closedByRemark ||
                        "The ticket was closed successfully without additional comments."}
                      "
                    </p>

                    {/* Closing Officer Footer */}
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                          {complaintDetails?.closedBy?.substring(0, 2) || "OP"}
                        </div>
                        <div>
                          <p className="text-[11px] text-blue-900 font-bold leading-none">
                            Closed By
                          </p>
                          <p className="text-[10px] text-blue-600">
                            ID: {complaintDetails?.closedBy}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Final Status: {complaintDetails?.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CHAT SIDEBAR */}
        <div className="lg:col-span-1">
          <ComplaintChat ticketId={complaintDetails?.ticket} user={user} />
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: 16,
    height: "calc(100vh - 80px)",
  },
  left: {
    overflowY: "auto",
  },
  right: {
    height: "100%",
  },
  card: {
    background: "#fff",
    padding: 16,
    borderRadius: 12,
    border: "1px solid #e5e7eb",
  },
};
