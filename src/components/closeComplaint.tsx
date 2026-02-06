import { useState } from "react";
import axiosClient from "@/services/axiosClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCloseComplaint } from "@/hooks/useApiQuery";

type Props = {
    complaintId: string;
};

export default function CloseComplaint({
    complaintId,
}: Props) {
    const [feedback, setFeedback] = useState("");
    const { closeComplaint, isPending } = useCloseComplaint(complaintId);

    const handleResolve = async () => {
        const payload = {
            feedback
        }
        closeComplaint(payload);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Close Ticket
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <Textarea
                    placeholder="Enter resolution feedback..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={4}
                    disabled={isPending}
                />
                <Button
                    onClick={handleResolve}
                    disabled={isPending || !feedback.trim()}
                    className="w-full"
                >
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Close Ticket
                </Button>
            </CardContent>
        </Card>
    );
}
