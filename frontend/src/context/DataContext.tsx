import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Campaign, Application, Submission, CreatorStats, Notification, SampleRequest } from '../types';
import {
    mockCampaigns,
    mockApplications,
    mockSubmissions,
    mockCreatorStats,
    mockNotifications,
    mockSampleRequests,
} from '../data/mockData';

// Storage keys
const STORAGE_KEYS = {
    campaigns: 'bmc_campaigns',
    applications: 'bmc_applications',
    submissions: 'bmc_submissions',
    creatorStats: 'bmc_creator_stats',
    notifications: 'bmc_notifications',
    sampleRequests: 'bmc_sample_requests',
};

// Data Context Type
interface DataContextType {
    // Data
    campaigns: Campaign[];
    applications: Application[];
    submissions: Submission[];
    creatorStats: CreatorStats[];
    notifications: Notification[];
    sampleRequests: SampleRequest[];

    // Campaign CRUD
    addCampaign: (campaign: Omit<Campaign, 'id'>) => Campaign;
    updateCampaign: (id: string, updates: Partial<Campaign>) => void;
    deleteCampaign: (id: string) => void;
    getCampaign: (id: string) => Campaign | undefined;

    // Application functions
    applyToCampaign: (campaignId: string, creatorId: string, creatorName: string, creatorHandle: string, creatorAvatar: string, followers: number, message?: string) => Application;
    approveApplication: (applicationId: string) => void;
    rejectApplication: (applicationId: string) => void;
    getApplicationsForCampaign: (campaignId: string) => Application[];
    getApplicationsForCreator: (creatorId: string) => Application[];

    // Submission functions
    submitWork: (campaignId: string, creatorId: string, creatorName: string, creatorHandle: string, creatorAvatar: string, videoUrl: string, promoLink: string, day: number, notes?: string) => Submission;
    approveSubmission: (submissionId: string) => void;
    rejectSubmission: (submissionId: string, reason?: string) => void;
    getSubmissionsForCampaign: (campaignId: string) => Submission[];
    getSubmissionsForCreator: (creatorId: string) => Submission[];

    // Creator Stats
    getCreatorStats: (campaignId: string, creatorId: string) => CreatorStats | undefined;
    updateCreatorStats: (campaignId: string, creatorId: string, updates: Partial<CreatorStats>) => void;

    // Notifications
    addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
    markNotificationRead: (notificationId: string) => void;
    getNotificationsForUser: (userId: string) => Notification[];

    // Sample Requests
    requestSample: (campaignId: string, creatorId: string, creatorName: string, creatorHandle: string, creatorAvatar: string, followers: number, shippingAddress: SampleRequest['shippingAddress'], message?: string) => SampleRequest;
    approveSampleRequest: (requestId: string) => void;
    rejectSampleRequest: (requestId: string, reason: string) => void;
    markSampleShipped: (requestId: string) => void;
    bulkApproveSampleRequests: (requestIds: string[]) => void;
    bulkMarkSamplesShipped: (requestIds: string[]) => void;
    getSampleRequestsForCampaign: (campaignId: string) => SampleRequest[];
    getSampleRequestForCreator: (campaignId: string, creatorId: string) => SampleRequest | undefined;

    // Reset
    resetData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Generate unique ID
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Load from localStorage or use default
const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
    try {
        const stored = localStorage.getItem(key);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (error) {
        console.error(`Error loading ${key} from localStorage:`, error);
    }
    return defaultValue;
};

// Save to localStorage
const saveToStorage = <T,>(key: string, value: T) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error saving ${key} to localStorage:`, error);
    }
};

export function DataProvider({ children }: { children: ReactNode }) {
    // State
    const [campaigns, setCampaigns] = useState<Campaign[]>(() =>
        loadFromStorage(STORAGE_KEYS.campaigns, mockCampaigns)
    );
    const [applications, setApplications] = useState<Application[]>(() =>
        loadFromStorage(STORAGE_KEYS.applications, mockApplications)
    );
    const [submissions, setSubmissions] = useState<Submission[]>(() =>
        loadFromStorage(STORAGE_KEYS.submissions, mockSubmissions)
    );
    const [creatorStats, setCreatorStats] = useState<CreatorStats[]>(() =>
        loadFromStorage(STORAGE_KEYS.creatorStats, mockCreatorStats)
    );
    const [notifications, setNotifications] = useState<Notification[]>(() =>
        loadFromStorage(STORAGE_KEYS.notifications, mockNotifications)
    );
    const [sampleRequests, setSampleRequests] = useState<SampleRequest[]>(() =>
        loadFromStorage(STORAGE_KEYS.sampleRequests, mockSampleRequests)
    );

    // Sync across tabs
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === STORAGE_KEYS.campaigns) {
                setCampaigns(loadFromStorage(STORAGE_KEYS.campaigns, mockCampaigns));
            }
            if (e.key === STORAGE_KEYS.applications) {
                setApplications(loadFromStorage(STORAGE_KEYS.applications, mockApplications));
            }
            if (e.key === STORAGE_KEYS.submissions) {
                setSubmissions(loadFromStorage(STORAGE_KEYS.submissions, mockSubmissions));
            }
            if (e.key === STORAGE_KEYS.creatorStats) {
                setCreatorStats(loadFromStorage(STORAGE_KEYS.creatorStats, mockCreatorStats));
            }
            if (e.key === STORAGE_KEYS.notifications) {
                setNotifications(loadFromStorage(STORAGE_KEYS.notifications, mockNotifications));
            }
            if (e.key === STORAGE_KEYS.sampleRequests) {
                setSampleRequests(loadFromStorage(STORAGE_KEYS.sampleRequests, mockSampleRequests));
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Auto-save to localStorage
    useEffect(() => {
        saveToStorage(STORAGE_KEYS.campaigns, campaigns);
    }, [campaigns]);

    // Simple migration: Ensure mock campaigns have samples if missing in storage
    useEffect(() => {
        const hasMissingSamples = campaigns.some(c => (c.id === '1' || c.id === '2') && !c.hasSamples);
        if (hasMissingSamples) {
            setCampaigns(prev => prev.map(c => {
                const mock = mockCampaigns.find(m => m.id === c.id);
                if (mock && mock.hasSamples && !c.hasSamples) {
                    return { ...c, hasSamples: true, sampleInfo: mock.sampleInfo };
                }
                return c;
            }));
        }
    }, [campaigns]);

    // Simple migration: If sampleRequests is empty but we have mock data, use mock data
    // This helps users who already have empty storage from previous runs
    useEffect(() => {
        if (sampleRequests.length === 0 && mockSampleRequests.length > 0) {
            setSampleRequests(mockSampleRequests);
        }
    }, [sampleRequests.length]);

    useEffect(() => {
        saveToStorage(STORAGE_KEYS.applications, applications);
    }, [applications]);

    useEffect(() => {
        saveToStorage(STORAGE_KEYS.submissions, submissions);
    }, [submissions]);

    useEffect(() => {
        saveToStorage(STORAGE_KEYS.creatorStats, creatorStats);
    }, [creatorStats]);

    useEffect(() => {
        saveToStorage(STORAGE_KEYS.notifications, notifications);
    }, [notifications]);

    useEffect(() => {
        saveToStorage(STORAGE_KEYS.sampleRequests, sampleRequests);
    }, [sampleRequests]);

    // Campaign CRUD
    const addCampaign = (campaignData: Omit<Campaign, 'id'>): Campaign => {
        const newCampaign: Campaign = {
            ...campaignData,
            id: generateId(),
        };
        setCampaigns(prev => [...prev, newCampaign]);
        return newCampaign;
    };

    const updateCampaign = (id: string, updates: Partial<Campaign>) => {
        setCampaigns(prev =>
            prev.map(c => (c.id === id ? { ...c, ...updates } : c))
        );
    };

    const deleteCampaign = (id: string) => {
        setCampaigns(prev => prev.filter(c => c.id !== id));
        // Also delete related applications and submissions
        setApplications(prev => prev.filter(a => a.campaignId !== id));
        setSubmissions(prev => prev.filter(s => s.campaignId !== id));
        setCreatorStats(prev => prev.filter(cs => cs.campaignId !== id));
    };

    const getCampaign = (id: string) => campaigns.find(c => c.id === id);

    // Application functions
    const applyToCampaign = (
        campaignId: string,
        creatorId: string,
        creatorName: string,
        creatorHandle: string,
        creatorAvatar: string,
        followers: number,
        message?: string
    ): Application => {
        const newApplication: Application = {
            id: generateId(),
            campaignId,
            creatorId,
            creatorName,
            creatorHandle,
            creatorAvatar,
            followers,
            status: 'pending',
            appliedAt: new Date().toISOString(),
            message,
        };
        setApplications(prev => [...prev, newApplication]);
        return newApplication;
    };

    const approveApplication = (applicationId: string) => {
        setApplications(prev =>
            prev.map(a => {
                if (a.id === applicationId && a.status === 'pending') {
                    // Update campaign currentCreators
                    const campaign = campaigns.find(c => c.id === a.campaignId);
                    if (campaign) {
                        updateCampaign(a.campaignId, {
                            currentCreators: campaign.currentCreators + 1,
                        });
                    }

                    // Create initial creator stats
                    const existingStats = creatorStats.find(
                        cs => cs.campaignId === a.campaignId && cs.creatorId === a.creatorId
                    );
                    if (!existingStats) {
                        setCreatorStats(prev => [
                            ...prev,
                            {
                                campaignId: a.campaignId,
                                creatorId: a.creatorId,
                                totalVideos: 0,
                                approvedVideos: 0,
                                currentStreak: 0,
                                maxStreak: 0,
                                gmv: 0,
                                orders: 0,
                                rank: { gmv: 0, volume: 0, streak: 0 },
                            },
                        ]);
                    }

                    return { ...a, status: 'approved' as const };
                }
                return a;
            })
        );
    };

    const rejectApplication = (applicationId: string) => {
        setApplications(prev =>
            prev.map(a =>
                a.id === applicationId ? { ...a, status: 'rejected' as const } : a
            )
        );
    };

    const getApplicationsForCampaign = (campaignId: string) =>
        applications.filter(a => a.campaignId === campaignId);

    const getApplicationsForCreator = (creatorId: string) =>
        applications.filter(a => a.creatorId === creatorId);

    // Submission functions
    const submitWork = (
        campaignId: string,
        creatorId: string,
        creatorName: string,
        creatorHandle: string,
        creatorAvatar: string,
        videoUrl: string,
        promoLink: string,
        day: number,
        notes?: string
    ): Submission => {
        const newSubmission: Submission = {
            id: generateId(),
            campaignId,
            creatorId,
            creatorName,
            creatorHandle,
            creatorAvatar,
            videoUrl,
            promoLink,
            notes,
            day,
            status: 'pending',
            submittedAt: new Date().toISOString(),
        };
        setSubmissions(prev => [...prev, newSubmission]);

        // Update creator stats
        const stats = creatorStats.find(
            cs => cs.campaignId === campaignId && cs.creatorId === creatorId
        );
        if (stats) {
            updateCreatorStats(campaignId, creatorId, {
                totalVideos: stats.totalVideos + 1,
            });
        }

        return newSubmission;
    };

    const approveSubmission = (submissionId: string) => {
        setSubmissions(prev =>
            prev.map(s => {
                if (s.id === submissionId && s.status === 'pending') {
                    // Update creator stats
                    const stats = creatorStats.find(
                        cs => cs.campaignId === s.campaignId && cs.creatorId === s.creatorId
                    );
                    if (stats) {
                        updateCreatorStats(s.campaignId, s.creatorId, {
                            approvedVideos: stats.approvedVideos + 1,
                            currentStreak: stats.currentStreak + 1,
                            maxStreak: Math.max(stats.maxStreak, stats.currentStreak + 1),
                        });
                    }

                    return {
                        ...s,
                        status: 'approved' as const,
                        reviewedAt: new Date().toISOString(),
                    };
                }
                return s;
            })
        );
    };

    const rejectSubmission = (submissionId: string, reason?: string) => {
        setSubmissions(prev =>
            prev.map(s => {
                if (s.id === submissionId) {
                    // Reset streak on rejection
                    const stats = creatorStats.find(
                        cs => cs.campaignId === s.campaignId && cs.creatorId === s.creatorId
                    );
                    if (stats) {
                        updateCreatorStats(s.campaignId, s.creatorId, {
                            currentStreak: 0,
                        });
                    }

                    return {
                        ...s,
                        status: 'rejected' as const,
                        reviewedAt: new Date().toISOString(),
                        rejectReason: reason,
                    };
                }
                return s;
            })
        );
    };

    const getSubmissionsForCampaign = (campaignId: string) =>
        submissions.filter(s => s.campaignId === campaignId);

    const getSubmissionsForCreator = (creatorId: string) =>
        submissions.filter(s => s.creatorId === creatorId);

    // Creator Stats
    const getCreatorStats = (campaignId: string, creatorId: string) =>
        creatorStats.find(
            cs => cs.campaignId === campaignId && cs.creatorId === creatorId
        );

    const updateCreatorStats = (
        campaignId: string,
        creatorId: string,
        updates: Partial<CreatorStats>
    ) => {
        setCreatorStats(prev =>
            prev.map(cs =>
                cs.campaignId === campaignId && cs.creatorId === creatorId
                    ? { ...cs, ...updates }
                    : cs
            )
        );
    };

    // Notifications
    const addNotification = (
        notification: Omit<Notification, 'id' | 'createdAt'>
    ) => {
        const newNotification: Notification = {
            ...notification,
            id: generateId(),
            createdAt: new Date().toISOString(),
        };
        setNotifications(prev => [newNotification, ...prev]);
    };

    const markNotificationRead = (notificationId: string) => {
        setNotifications(prev =>
            prev.map(n => (n.id === notificationId ? { ...n, read: true } : n))
        );
    };

    const getNotificationsForUser = (userId: string) =>
        notifications.filter(n => n.userId === userId);

    // Sample Request functions
    const requestSample = (
        campaignId: string,
        creatorId: string,
        creatorName: string,
        creatorHandle: string,
        creatorAvatar: string,
        followers: number,
        shippingAddress: SampleRequest['shippingAddress'],
        message?: string
    ): SampleRequest => {
        const campaign = campaigns.find(c => c.id === campaignId);
        const newRequest: SampleRequest = {
            id: generateId(),
            campaignId,
            creatorId,
            creatorName,
            creatorHandle,
            creatorAvatar,
            creatorFollowers: followers,
            status: 'pending',
            quantity: campaign?.sampleInfo?.samplesPerCreator || 1,
            message,
            shippingAddress,
            requestedAt: new Date().toISOString(),
        };
        setSampleRequests(prev => [...prev, newRequest]);

        // Notify brand
        const brandId = campaign?.brandId;
        if (brandId) {
            addNotification({
                userId: brandId,
                type: 'sample_requested',
                title: 'มีคำขอตัวอย่างสินค้าใหม่',
                message: `${creatorName} ขอตัวอย่างสินค้าจากแคมเปญ ${campaign.title}`,
                read: false,
            });
        }

        return newRequest;
    };

    const approveSampleRequest = (requestId: string) => {
        setSampleRequests(prev =>
            prev.map(r => {
                if (r.id === requestId && r.status === 'pending') {
                    // Notify creator
                    addNotification({
                        userId: r.creatorId,
                        type: 'sample_approved',
                        title: 'คำขอตัวอย่างสินค้าได้รับการอนุมัติ',
                        message: 'แบรนด์จะจัดส่งสินค้าไปยังที่อยู่ที่คุณระบุไว้',
                        read: false,
                    });

                    return {
                        ...r,
                        status: 'approved' as const,
                        reviewedAt: new Date().toISOString(),
                    };
                }
                return r;
            })
        );
    };

    const rejectSampleRequest = (requestId: string, reason: string) => {
        setSampleRequests(prev =>
            prev.map(r => {
                if (r.id === requestId) {
                    // Notify creator
                    addNotification({
                        userId: r.creatorId,
                        type: 'sample_rejected',
                        title: 'คำขอตัวอย่างสินค้าไม่ได้รับการอนุมัติ',
                        message: `เหตุผล: ${reason}`,
                        read: false,
                    });

                    return {
                        ...r,
                        status: 'rejected' as const,
                        reviewedAt: new Date().toISOString(),
                        rejectionReason: reason,
                    };
                }
                return r;
            })
        );
    };

    const markSampleShipped = (requestId: string) => {
        setSampleRequests(prev =>
            prev.map(r => {
                if (r.id === requestId && r.status === 'approved') {
                    // Notify creator
                    addNotification({
                        userId: r.creatorId,
                        type: 'sample_shipped',
                        title: 'ตัวอย่างสินค้าถูกจัดส่งแล้ว',
                        message: 'แบรนด์ได้จัดส่งตัวอย่างสินค้าแล้ว',
                        read: false,
                    });

                    return {
                        ...r,
                        status: 'shipped' as const,
                        shippedAt: new Date().toISOString(),
                    };
                }
                return r;
            })
        );
    };

    const bulkApproveSampleRequests = (requestIds: string[]) => {
        requestIds.forEach(id => approveSampleRequest(id));
    };

    const bulkMarkSamplesShipped = (requestIds: string[]) => {
        requestIds.forEach(id => markSampleShipped(id));
    };

    const getSampleRequestsForCampaign = (campaignId: string) =>
        sampleRequests.filter(r => r.campaignId === campaignId);

    const getSampleRequestForCreator = (campaignId: string, creatorId: string) =>
        sampleRequests.find(r => r.campaignId === campaignId && r.creatorId === creatorId);

    // Reset to default mock data
    const resetData = () => {
        setCampaigns(mockCampaigns);
        setApplications(mockApplications);
        setSubmissions(mockSubmissions);
        setCreatorStats(mockCreatorStats);
        setNotifications(mockNotifications);
        setSampleRequests(mockSampleRequests);
    };

    const value: DataContextType = {
        campaigns,
        applications,
        submissions,
        creatorStats,
        notifications,
        sampleRequests,
        addCampaign,
        updateCampaign,
        deleteCampaign,
        getCampaign,
        applyToCampaign,
        approveApplication,
        rejectApplication,
        getApplicationsForCampaign,
        getApplicationsForCreator,
        submitWork,
        approveSubmission,
        rejectSubmission,
        getSubmissionsForCampaign,
        getSubmissionsForCreator,
        getCreatorStats,
        updateCreatorStats,
        addNotification,
        markNotificationRead,
        getNotificationsForUser,
        requestSample,
        approveSampleRequest,
        rejectSampleRequest,
        markSampleShipped,
        bulkApproveSampleRequests,
        bulkMarkSamplesShipped,
        getSampleRequestsForCampaign,
        getSampleRequestForCreator,
        resetData,
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
}
