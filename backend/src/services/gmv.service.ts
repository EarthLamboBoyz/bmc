import prisma from '../utils/prisma';

interface CSVRow {
    creator_id: string;
    creator_name: string;
    gmv: string | number;
    orders: string | number;
    last_updated?: string;
}

interface ProcessResult {
    uploadId: string;
    processed: boolean;
    totalRows: number;
    successCount: number;
    errorCount: number;
    errors: string[];
    summary: {
        totalGMV: number;
        totalOrders: number;
        creatorsUpdated: number;
    };
}

/**
 * Parse CSV content into array of objects
 */
const parseCSV = (buffer: Buffer): CSVRow[] => {
    const content = buffer.toString('utf-8');
    const lines = content.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
        throw new Error('CSV file is empty or has no data rows');
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const rows: CSVRow[] = [];

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const row: any = {};
        
        headers.forEach((header, index) => {
            row[header] = values[index] || '';
        });

        rows.push(row as CSVRow);
    }

    return rows;
};

/**
 * Validate CSV row
 */
const validateRow = (row: CSVRow, rowNumber: number): { valid: boolean; error?: string } => {
    if (!row.creator_id) {
        return { valid: false, error: `Row ${rowNumber}: creator_id is required` };
    }

    if (!row.gmv && row.gmv !== '0') {
        return { valid: false, error: `Row ${rowNumber}: gmv is required` };
    }

    const gmvValue = parseFloat(String(row.gmv));
    if (isNaN(gmvValue) || gmvValue < 0) {
        return { valid: false, error: `Row ${rowNumber}: gmv must be a valid non-negative number` };
    }

    const ordersValue = parseInt(String(row.orders || '0'));
    if (isNaN(ordersValue) || ordersValue < 0) {
        return { valid: false, error: `Row ${rowNumber}: orders must be a valid non-negative integer` };
    }

    return { valid: true };
};

/**
 * Process CSV file and update creator stats
 */
const processCSV = async (
    campaignId: string,
    uploadedBy: string,
    fileBuffer: Buffer,
    fileName: string
): Promise<ProcessResult> => {
    const result: ProcessResult = {
        uploadId: '',
        processed: false,
        totalRows: 0,
        successCount: 0,
        errorCount: 0,
        errors: [],
        summary: {
            totalGMV: 0,
            totalOrders: 0,
            creatorsUpdated: 0
        }
    };

    // Create upload record
    const upload = await prisma.gmvUpload.create({
        data: {
            campaignId,
            uploadedBy,
            fileName,
            processed: false
        }
    });

    result.uploadId = upload.id;

    try {
        // Parse CSV
        const rows = parseCSV(fileBuffer);
        result.totalRows = rows.length;
        console.log(`[GMV Upload] Parsed ${rows.length} rows from CSV`);

        // Process each row
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const rowNumber = i + 2; // +2 because header is row 1

            // Validate row
            const validation = validateRow(row, rowNumber);
            if (!validation.valid) {
                result.errors.push(validation.error!);
                result.errorCount++;
                continue;
            }

            try {
                // Update or create creator campaign stats (no validation needed for demo)
                const gmvValue = parseFloat(String(row.gmv));
                const ordersValue = parseInt(String(row.orders || '0'));
                
                console.log(`[GMV Upload] Processing row ${rowNumber}: creatorId=${row.creator_id}, gmv=${gmvValue}, orders=${ordersValue}`);

                await prisma.creatorCampaignStats.upsert({
                    where: {
                        campaignId_creatorId: {
                            campaignId,
                            creatorId: row.creator_id
                        }
                    },
                    create: {
                        campaignId,
                        creatorId: row.creator_id,
                        gmv: gmvValue,
                        orders: ordersValue,
                        lastGmvUpdate: new Date()
                    },
                    update: {
                        gmv: gmvValue,
                        orders: ordersValue,
                        lastGmvUpdate: new Date()
                    }
                });

                result.successCount++;
                result.summary.totalGMV += gmvValue;
                result.summary.totalOrders += ordersValue;
                result.summary.creatorsUpdated++;

            } catch (error: any) {
                console.error(`[GMV Upload] Error on row ${rowNumber}:`, error);
                result.errors.push(`Row ${rowNumber}: ${error.message}`);
                result.errorCount++;
            }
        }

        // Update upload record
        await prisma.gmvUpload.update({
            where: { id: upload.id },
            data: {
                processed: true,
                processedAt: new Date(),
                totalCreators: result.summary.creatorsUpdated,
                totalGmv: result.summary.totalGMV,
                totalOrders: result.summary.totalOrders,
                errorMessage: result.errors.length > 0 ? result.errors.join('\n') : null
            }
        });

        result.processed = true;
        return result;

    } catch (error: any) {
        // Update upload record with error
        await prisma.gmvUpload.update({
            where: { id: upload.id },
            data: {
                processed: false,
                errorMessage: error.message
            }
        });

        throw error;
    }
};

/**
 * Get GMV stats summary for a campaign
 */
const getCampaignGMVSummary = async (campaignId: string) => {
    const stats = await prisma.creatorCampaignStats.findMany({
        where: { campaignId }
    });

    return {
        totalCreators: stats.length,
        totalGMV: stats.reduce((sum, s) => sum + (s.gmv || 0), 0),
        totalOrders: stats.reduce((sum, s) => sum + (s.orders || 0), 0),
        topCreator: stats.length > 0 
            ? stats.reduce((max, s) => (s.gmv || 0) > (max.gmv || 0) ? s : max, stats[0])
            : null
    };
};

export const gmvService = {
    processCSV,
    getCampaignGMVSummary
};
