
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, MessageSquare, XCircle, ThumbsUp, ThumbsDown, Edit3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeedbackOptionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectOption: (option: 'approve' | 'reject' | 'changes') => void;
}

export const FeedbackOptionsModal = ({ isOpen, onClose, onSelectOption }: FeedbackOptionsModalProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-xl p-0 overflow-hidden gap-0">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="text-xl font-bold">Respond to Quotation</DialogTitle>
                    <DialogDescription>
                        Please select an action to proceed with this quotation.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 pt-4">
                    {/* Approve Option */}
                    <button
                        className="group flex flex-col items-center text-center p-4 rounded-xl border border-border hover:border-green-500/50 hover:bg-green-50/50 transition-all duration-200"
                        onClick={() => onSelectOption('approve')}
                    >
                        <div className="h-12 w-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
                            <ThumbsUp className="h-6 w-6" />
                        </div>
                        <h3 className="font-semibold text-foreground mb-1 group-hover:text-green-700">Approve</h3>
                        <p className="text-xs text-muted-foreground group-hover:text-green-600/80">
                            Accept the quotation and terms.
                        </p>
                    </button>

                    {/* Request Changes Option */}
                    <button
                        className="group flex flex-col items-center text-center p-4 rounded-xl border border-border hover:border-blue-500/50 hover:bg-blue-50/50 transition-all duration-200"
                        onClick={() => onSelectOption('changes')}
                    >
                        <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
                            <Edit3 className="h-6 w-6" />
                        </div>
                        <h3 className="font-semibold text-foreground mb-1 group-hover:text-blue-700">Request Changes</h3>
                        <p className="text-xs text-muted-foreground group-hover:text-blue-600/80">
                            Ask for modifications or revisions.
                        </p>
                    </button>

                    {/* Reject Option */}
                    <button
                        className="group flex flex-col items-center text-center p-4 rounded-xl border border-border hover:border-red-500/50 hover:bg-red-50/50 transition-all duration-200"
                        onClick={() => onSelectOption('reject')}
                    >
                        <div className="h-12 w-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
                            <ThumbsDown className="h-6 w-6" />
                        </div>
                        <h3 className="font-semibold text-foreground mb-1 group-hover:text-red-700">Reject</h3>
                        <p className="text-xs text-muted-foreground group-hover:text-red-600/80">
                            Decline the quotation.
                        </p>
                    </button>
                </div>

                <div className="bg-muted/50 p-4 border-t flex justify-end">
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
