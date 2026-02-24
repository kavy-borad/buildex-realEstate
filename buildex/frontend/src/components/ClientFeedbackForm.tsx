import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, XCircle, MessageSquare, Loader2 } from 'lucide-react';
import { feedbackApi } from '@/services/api/feedbackApi';
import { toast } from 'sonner';

interface ClientFeedbackFormProps {
    quotationId: string;
    onSuccess?: () => void;
}

export default function ClientFeedbackForm({ quotationId, onSuccess }: ClientFeedbackFormProps) {
    const [selectedAction, setSelectedAction] = useState<'approve' | 'reject' | 'request-changes' | null>(null);
    const [comments, setComments] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');
    const [requestedChanges, setRequestedChanges] = useState<string[]>(['']);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!selectedAction) {
            toast.error('Please select an action');
            return;
        }

        setIsSubmitting(true);
        try {
            const feedbackData: any = {
                action: selectedAction,
                comments
            };

            if (selectedAction === 'reject') {
                if (!rejectionReason.trim()) {
                    toast.error('Please provide a rejection reason');
                    setIsSubmitting(false);
                    return;
                }
                feedbackData.rejectionReason = rejectionReason;
            }

            if (selectedAction === 'request-changes') {
                const changes = requestedChanges.filter(c => c.trim());
                if (changes.length === 0) {
                    toast.error('Please specify at least one change');
                    setIsSubmitting(false);
                    return;
                }
                feedbackData.requestedChanges = changes;
            }

            const response = await feedbackApi.submitFeedback(quotationId, feedbackData);

            if (response.success) {
                toast.success('Feedback submitted successfully!');
                onSuccess?.();
            } else {
                toast.error(response.message || 'Failed to submit feedback');
            }
        } catch (error: any) {
            console.error('Error submitting feedback:', error);
            toast.error(error.response?.data?.message || 'Failed to submit feedback');
        } finally {
            setIsSubmitting(false);
        }
    };

    const addChangeField = () => {
        setRequestedChanges([...requestedChanges, '']);
    };

    const updateChange = (index: number, value: string) => {
        const updated = [...requestedChanges];
        updated[index] = value;
        setRequestedChanges(updated);
    };

    const removeChange = (index: number) => {
        setRequestedChanges(requestedChanges.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-4">Submit Your Feedback</h3>
                <p className="text-sm text-muted-foreground mb-6">
                    Please review the quotation and select an action below
                </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                    variant={selectedAction === 'approve' ? 'default' : 'outline'}
                    className={`h-20 flex flex-col items-center justify-center gap-2 ${selectedAction === 'approve' ? 'bg-green-600 hover:bg-green-700' : ''
                        }`}
                    onClick={() => setSelectedAction('approve')}
                >
                    <CheckCircle2 className="w-6 h-6" />
                    <span>Approve</span>
                </Button>

                <Button
                    variant={selectedAction === 'reject' ? 'default' : 'outline'}
                    className={`h-20 flex flex-col items-center justify-center gap-2 ${selectedAction === 'reject' ? 'bg-red-600 hover:bg-red-700' : ''
                        }`}
                    onClick={() => setSelectedAction('reject')}
                >
                    <XCircle className="w-6 h-6" />
                    <span>Reject</span>
                </Button>

                <Button
                    variant={selectedAction === 'request-changes' ? 'default' : 'outline'}
                    className={`h-20 flex flex-col items-center justify-center gap-2 ${selectedAction === 'request-changes' ? 'bg-blue-600 hover:bg-blue-700' : ''
                        }`}
                    onClick={() => setSelectedAction('request-changes')}
                >
                    <MessageSquare className="w-6 h-6" />
                    <span>Request Changes</span>
                </Button>
            </div>

            {/* Conditional Fields Based on Action */}
            {selectedAction && (
                <div className="space-y-4 mt-6">
                    {/* Comments (Optional for all) */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Comments {selectedAction !== 'approve' && '(Optional)'}
                        </label>
                        <Textarea
                            placeholder="Add your comments here..."
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            rows={4}
                            className="w-full"
                        />
                    </div>

                    {/* Rejection Reason (Required for reject) */}
                    {selectedAction === 'reject' && (
                        <div>
                            <label className="block text-sm font-medium mb-2 text-red-600">
                                Rejection Reason *
                            </label>
                            <Textarea
                                placeholder="Please specify why you are rejecting this quotation..."
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                rows={4}
                                className="w-full border-red-200 focus:border-red-500"
                                required
                            />
                        </div>
                    )}

                    {/* Requested Changes (Required for request-changes) */}
                    {selectedAction === 'request-changes' && (
                        <div>
                            <label className="block text-sm font-medium mb-2 text-blue-600">
                                Requested Changes *
                            </label>
                            {requestedChanges.map((change, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        placeholder={`Change ${index + 1}`}
                                        value={change}
                                        onChange={(e) => updateChange(index, e.target.value)}
                                        className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {requestedChanges.length > 1 && (
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => removeChange(index)}
                                            className="text-red-600"
                                        >
                                            <XCircle className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={addChangeField}
                                className="mt-2"
                            >
                                + Add Another Change
                            </Button>
                        </div>
                    )}

                    {/* Submit Button */}
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full"
                        size="lg"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            'Submit Feedback'
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
}
