export type NotificationType =
    | 'new_application'
    | 'application_approved'
    | 'application_rejected'
    | 'new_submission'
    | 'submission_approved'
    | 'submission_rejected'
    | 'submission_revision'
    | 'new_campaign'
    | 'campaign_ending'
    | 'payment_received'
    | 'payment_confirmed'
    | 'payment_disputed'
    | 'submission_received'
    | 'payment_reminder'
    | 'reminder'
    | 'sample_requested'
    | 'sample_approved'
    | 'sample_rejected'
    | 'sample_shipped'
    | 'reward_won'
    | 'system';

export interface Notification {
    id: string;
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
    link?: string;
    actionUrl?: string;
    metadata?: {
        campaignId?: string;
        campaignName?: string;
        creatorName?: string;
        amount?: number;
        [key: string]: any;
    };
}

export const notificationTypeConfig: Record<NotificationType, {
    icon: string;
    color: string;
    bgColor: string;
}> = {
    new_application: { icon: '👤', color: 'text-blue-600', bgColor: 'bg-blue-100' },
    application_approved: { icon: '✅', color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
    application_rejected: { icon: '❌', color: 'text-red-600', bgColor: 'bg-red-100' },
    new_submission: { icon: '📹', color: 'text-purple-600', bgColor: 'bg-purple-100' },
    submission_approved: { icon: '🎉', color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
    submission_rejected: { icon: '⚠️', color: 'text-orange-600', bgColor: 'bg-orange-100' },
    submission_revision: { icon: '🔄', color: 'text-orange-600', bgColor: 'bg-orange-100' },
    submission_received: { icon: '📹', color: 'text-blue-600', bgColor: 'bg-blue-100' },
    new_campaign: { icon: '🚀', color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
    campaign_ending: { icon: '⏰', color: 'text-amber-600', bgColor: 'bg-amber-100' },
    payment_received: { icon: '💰', color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
    payment_confirmed: { icon: '✅', color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
    payment_disputed: { icon: '⚠️', color: 'text-red-600', bgColor: 'bg-red-100' },
    payment_reminder: { icon: '💸', color: 'text-amber-600', bgColor: 'bg-amber-100' },
    reminder: { icon: '⏰', color: 'text-amber-600', bgColor: 'bg-amber-100' },
    sample_requested: { icon: '📦', color: 'text-blue-600', bgColor: 'bg-blue-100' },
    sample_approved: { icon: '✅', color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
    sample_rejected: { icon: '❌', color: 'text-red-600', bgColor: 'bg-red-100' },
    sample_shipped: { icon: '🚚', color: 'text-blue-600', bgColor: 'bg-blue-100' },
    reward_won: { icon: '🎁', color: 'text-purple-600', bgColor: 'bg-purple-100' },
    system: { icon: '🔔', color: 'text-gray-600', bgColor: 'bg-gray-100' },
};

