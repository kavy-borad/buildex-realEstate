import { useEffect, useState } from 'react';
import { feedbackApi } from '@/services/api/feedbackApi';
import { CheckCircle2, XCircle, MessageSquare, Loader2, Clock } from 'lucide-react';

interface ClientFeedbackDisplayProps {
    quotationId: string;
}

export default function ClientFeedbackDisplay({ quotationId }: ClientFeedbackDisplayProps) {
    const [feedback, setFeedback] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                setLoading(true);
                const response = await feedbackApi.getFeedback(quotationId);
                if (response.success) {
                    setFeedback(response.data);
                }
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to load feedback');
            } finally {
                setLoading(false);
            }
        };

        fetchFeedback();
    }, [quotationId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                {error}
            </div>
        );
    }

    if (!feedback?.clientFeedback?.action) {
        return (
            <div className="p-6 bg-muted/30 border border-border rounded-lg text-center">
                <Clock className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No feedback submitted yet</p>
            </div>
        );
    }

    const { clientFeedback, clientStatus, status } = feedback;

    const getActionIcon = () => {
        switch (clientFeedback.action) {
            case 'approve':
                return <CheckCircle2 className="w-8 h-8 text-green-600" />;
            case 'reject':
                return <XCircle className="w-8 h-8 text-red-600" />;
            case 'request-changes':
                return <MessageSquare className="w-8 h-8 text-blue-600" />;
            default:
                return null;
        }
    };

    const getActionColor = () => {
        switch (clientFeedback.action) {
            case 'approve':
                return 'bg-green-50 border-green-200';
            case 'reject':
                return 'bg-red-50 border-red-200';
            case 'request-changes':
                return 'bg-blue-50 border-blue-200';
            default:
                return 'bg-gray-50 border-gray-200';
        }
    };

    const getActionText = () => {
        switch (clientFeedback.action) {
            case 'approve':
                return 'Approved';
            case 'reject':
                return 'Rejected';
            case 'request-changes':
                return 'Changes Requested';
            default:
                return 'Unknown';
        }
    };

    return (
        <div className={`p-6 border rounded-lg ${getActionColor()}`}>
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                {getActionIcon()}
                <div>
                    <h3 className="text-lg font-semibold">{getActionText()}</h3>
                    <p className="text-xs text-muted-foreground">
                        {new Date(clientFeedback.respondedAt).toLocaleString()}
                    </p>
                </div>
            </div>

            {/* Comments */}
            {clientFeedback.comments && (
                <div className="mb-4">
                    <h4 className="font-medium text-sm mb-2">Comments:</h4>
                    <p className="text-sm text-muted-foreground bg-white/50 p-3 rounded">
                        {clientFeedback.comments}
                    </p>
                </div>
            )}

            {/* Rejection Reason */}
            {clientFeedback.rejectionReason && (
                <div className="mb-4">
                    <h4 className="font-medium text-sm mb-2 text-red-600">Rejection Reason:</h4>
                    <p className="text-sm text-muted-foreground bg-white/50 p-3 rounded border border-red-200">
                        {clientFeedback.rejectionReason}
                    </p>
                </div>
            )}

            {/* Requested Changes */}
            {clientFeedback.requestedChanges && clientFeedback.requestedChanges.length > 0 && (
                <div className="mb-4">
                    <h4 className="font-medium text-sm mb-2 text-blue-600">Requested Changes:</h4>
                    <ul className="space-y-2">
                        {clientFeedback.requestedChanges.map((change: string, index: number) => (
                            <li
                                key={index}
                                className="text-sm text-muted-foreground bg-white/50 p-3 rounded border border-blue-200 flex items-start gap-2"
                            >
                                <span className="font-semibold text-blue-600">{index + 1}.</span>
                                {change}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Status */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-4 border-t">
                <span className="font-medium">Status:</span>
                <span className="px-2 py-1 bg-white/70 rounded">
                    {clientStatus || status}
                </span>
            </div>
        </div>
    );
}
