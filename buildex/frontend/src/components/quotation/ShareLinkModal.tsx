import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Check, Copy, Link as LinkIcon, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShareLinkModalProps {
    isOpen: boolean;
    onClose: () => void;
    shareableUrl: string;
    clientEmail?: string;
    quotationNumber?: string;
}

export const ShareLinkModal = ({ isOpen, onClose, shareableUrl, clientEmail, quotationNumber }: ShareLinkModalProps) => {
    const [copied, setCopied] = useState(false);
    const { toast } = useToast();

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareableUrl);
            setCopied(true);
            toast({
                title: 'Link Copied! 🔗',
                description: 'Shareable link copied to clipboard.',
                className: 'border-l-4 border-l-green-500 bg-white dark:bg-slate-900',
            });
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast({
                title: 'Failed to Copy',
                description: 'Could not copy link to clipboard.',
                variant: 'destructive',
            });
        }
    };

    const handleSendEmail = () => {
        const subject = `Quotation ${quotationNumber ? `#${quotationNumber}` : ''} - Awaiting Your Review`;
        const body = `Dear Client,\n\nPlease find your quotation at the following secure link:\n\n${shareableUrl}\n\nYou can view, approve, reject, or request changes directly from this link.\n\nBest regards`;

        window.location.href = `mailto:${clientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <LinkIcon className="h-5 w-5 text-primary" />
                        Share Quotation with Client
                    </DialogTitle>
                    <DialogDescription>
                        Copy this secure link and send it to your client. They can view and respond to the quotation.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="flex items-center gap-2">
                        <Input
                            value={shareableUrl}
                            readOnly
                            className="font-mono text-sm"
                        />
                        <Button
                            type="button"
                            size="icon"
                            onClick={handleCopy}
                            className="shrink-0"
                        >
                            {copied ? (
                                <Check className="h-4 w-4" />
                            ) : (
                                <Copy className="h-4 w-4" />
                            )}
                        </Button>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="flex-1 gap-2"
                            onClick={handleCopy}
                        >
                            <Copy className="h-4 w-4" />
                            Copy Link
                        </Button>
                        {clientEmail && (
                            <Button
                                variant="outline"
                                className="flex-1 gap-2"
                                onClick={handleSendEmail}
                            >
                                <Mail className="h-4 w-4" />
                                Email Client
                            </Button>
                        )}
                    </div>

                    <div className="bg-muted p-3 rounded-lg text-sm text-muted-foreground">
                        <p className="font-medium mb-1">✨ What clients can do:</p>
                        <ul className="list-disc list-inside space-y-1 text-xs">
                            <li>View quotation details</li>
                            <li>Approve or reject</li>
                            <li>Request changes</li>
                        </ul>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
