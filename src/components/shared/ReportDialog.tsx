import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { Flag } from "lucide-react";

interface ReportDialogProps {
    sellerName: string;
}

export function ReportDialog({ sellerName }: ReportDialogProps) {
    const [reason, setReason] = useState("spam");
    const [details, setDetails] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const handleSubmit = () => {
        // API call would go here
        console.log("Report submitted:", { sellerName, reason, details });

        toast.success("Report Submitted", {
            description: "We have received your report and will investigate.",
        });
        setIsOpen(false);
        setDetails("");
        setReason("spam");
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                    <Flag className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Report {sellerName}</DialogTitle>
                    <DialogDescription>
                        Help us maintain a safe marketplace. Please select a reason for reporting this seller.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <RadioGroup value={reason} onValueChange={setReason} className="grid gap-2">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="spam" id="spam" />
                            <Label htmlFor="spam">Spam or misleading</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="scam" id="scam" />
                            <Label htmlFor="scam">Scam or fraud</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="harassment" id="harassment" />
                            <Label htmlFor="harassment">Harassment or abusive behavior</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="other" id="other" />
                            <Label htmlFor="other">Other</Label>
                        </div>
                    </RadioGroup>
                    <div className="grid gap-2">
                        <Label htmlFor="details">Additional Details (Optional)</Label>
                        <Textarea
                            id="details"
                            placeholder="Please provide more context..."
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={handleSubmit}>Submit Report</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
