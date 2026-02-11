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
import { Checkbox } from "@/components/ui/checkbox";
import { MessageSquare, Loader2 } from "lucide-react";

interface RequestChangesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (changes: string[], comments: string) => Promise<void>;
}

export const RequestChangesModal = ({ isOpen, onClose, onConfirm }: RequestChangesModalProps) => {
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [comments, setComments] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const changeTypes = [
        "Adjust pricing/budget",
        "Change materials/specifications",
        "Modify timeline/duration",
        "Add/Remove items",
        "Update terms & conditions"
    ];

    const toggleType = (type: string) => {
        setSelectedTypes(current =>
            current.includes(type)
                ? current.filter(t => t !== type)
                : [...current, type]
        );
    };

    const handleConfirm = async () => {
        setIsLoading(true);
        await onConfirm(selectedTypes, comments);
        setIsLoading(false);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-blue-600">
                        <MessageSquare className="h-6 w-6" />
                        Request Changes
                    </DialogTitle>
                    <DialogDescription>
                        Let us know what you'd like to adjust in this quotation.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="space-y-3">
                        <Label>What kind of changes? (Select all that apply)</Label>
                        <div className="space-y-2">
                            {changeTypes.map((type) => (
                                <div key={type} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={type}
                                        checked={selectedTypes.includes(type)}
                                        onCheckedChange={() => toggleType(type)}
                                    />
                                    <Label htmlFor={type} className="font-normal cursor-pointer text-sm">
                                        {type}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="details">Detailed Description *</Label>
                        <Textarea
                            id="details"
                            placeholder="Please describe exactly what needs to be changed..."
                            className="min-h-[100px]"
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter className="flex flex-col sm:flex-row gap-2">
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={handleConfirm}
                        disabled={isLoading || !comments.trim()}
                    >
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Send Request
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
