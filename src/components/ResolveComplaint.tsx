import { useState } from "react";
import axiosClient from "@/services/axiosClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ResolveComplaintProps = {
  complaintId: string;
  onResolved?: () => void;
};

export default function ResolveComplaint({
  complaintId,
  onResolved,
}: ResolveComplaintProps) {
  const [feedback, setFeedback] = useState("");
  const [resolving, setResolving] = useState(false);
  const { toast } = useToast();

  const handleResolve = async () => {
    if (!feedback.trim()) {
      toast({ title: "Feedback required", variant: "destructive" });
      return;
    }

    setResolving(true);
    try {
      await axiosClient.patch(
        `/complaint-resolution/resolve-complaint/${complaintId}`,
        {
          feedback: feedback.trim(),
        }
      );

      toast({ title: "Ticket resolved successfully" });
      setFeedback("");
      onResolved?.();
    } catch (err) {
        console.log(err);
      toast({ title:err.data.detail, variant: "destructive" });
    } finally {
      setResolving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Resolve Ticket
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Textarea
          placeholder="Enter resolution feedback..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={4}
          disabled={resolving}
        />
        <Button
          onClick={handleResolve}
          disabled={resolving || !feedback.trim()}
          className="w-full"
        >
          {resolving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Resolve Ticket
        </Button>
      </CardContent>
    </Card>
  );
}
