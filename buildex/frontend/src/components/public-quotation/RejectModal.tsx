import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { XCircle, Loader2, DollarSign, UserX, CalendarX, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface RejectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string, comments?: string) => Promise<void>;
}

export const RejectModal = ({ isOpen, onClose, onConfirm }: RejectModalProps) => {
    const [reason, setReason] = useState<string>('');
    const [comments, setComments] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const reasons = [
        {
            id: 'budget',
            label: 'Budget too high',
            icon: DollarSign,
            description: 'Price exceeds our budget allocation'
        },
        {
            id: 'competitor',
            label: 'Selected another contractor',
            icon: UserX,
            description: 'Found a better fit elsewhere'
        },
        {
            id: 'postponed',
            label: 'Project Postponed',
            icon: CalendarX,
            description: 'Project is on hold or cancelled'
        },
        {
            id: 'other',
            label: 'Other Reason',
            icon: HelpCircle,
            description: 'Something else not listed here'
        }
    ];

    const handleConfirm = async () => {
        if (!reason) {
            toast.error("Please select a reason for rejection");
            return;
        }
        setIsLoading(true);
        // Find the full label of the selected reason
        const selectedReason = reasons.find(r => r.id === reason)?.label || reason;

        await onConfirm(selectedReason, comments);
        setIsLoading(false);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader className="space-y-3">
                    <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                        <XCircle className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="text-center">
                        <DialogTitle className="text-xl">Reject Quotation</DialogTitle>
                        <DialogDescription className="mt-2">
                            We value your feedback. Please let us know why you're declining this quotation.
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="space-y-3">
                        <Label className="text-base font-medium">Reason for Rejection *</Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {reasons.map((r) => (
                                <div
                                    key={r.id}
                                    onClick={() => setReason(r.id)}
                                    className={cn(
                                        "cursor-pointer border rounded-xl p-4 transition-all hover:bg-slate-50",
                                        reason === r.id
                                            ? "border-red-500 bg-red-50/50 ring-1 ring-red-500"
                                            : "border-slate-200"
                                    )}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={cn(
                                            "mt-0.5 p-1.5 rounded-lg shrink-0",
                                            reason === r.id ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-500"
                                        )}>
                                            <r.icon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className={cn(
                                                "font-medium text-sm",
                                                reason === r.id ? "text-red-900" : "text-slate-900"
                                            )}>
                                                {r.label}
                                            </p>
                                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                                {r.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="comments" className="text-base font-medium">Additional Comments</Label>
                        <Textarea
                            id="comments"
                            placeholder="Please provide any specific details that could help us improve..."
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            className="resize-none min-h-[100px] text-sm"
                        />
                    </div>
                </div>

                <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-between border-t pt-4">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        disabled={isLoading}
                        className="text-slate-500 hover:text-slate-900"
                    >
                        Cancel
                    </Button>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                            variant="destructive"
                            onClick={handleConfirm}
                            disabled={isLoading}
                            className="bg-red-600 hover:bg-red-700 min-w-[140px]"
                        >
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Confirm Rejection
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
