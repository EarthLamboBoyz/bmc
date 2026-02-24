# BrandMeetCreator API Documentation

## Base URL
```
http://localhost:3000/api/v1
```

## Authentication
All authenticated endpoints require JWT token in header:
```
Authorization: Bearer <token>
```

---

## 1. Authentication & Users

### POST /auth/register
Register a new user (Brand or Creator)

**Request:**
```json
{
  "email": "brand@example.com",
  "password": "password123",
  "role": "brand", // or "creator"
  "name": "Company Name",
  // For creators:
  "platforms": ["tiktok", "instagram"],
  "followers": 50000,
  "categories": ["beauty", "lifestyle"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "brand@example.com",
      "role": "brand",
      "name": "Company Name"
    },
    "token": "jwt_token"
  }
}
```

---

### POST /auth/login
Login

**Request:**
```json
{
  "email": "brand@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { /* user object */ },
    "token": "jwt_token"
  }
}
```

---

### GET /auth/me
Get current user info

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { /* full user object with profile */ }
  }
}
```

---

## 2. Campaigns (Brand)

### POST /campaigns
Create a new campaign

**Request:**
```json
{
  "title": "สามสิบ ตรา คุณสัมฤทธิ์",
  "description": "แคมเปญรีวิว...",
  "image_url": "https://...",
  "budget": 500000,
  "max_creators": 300,
  "required_followers": 10000,
  "platforms": ["tiktok", "instagram"],
  "categories": ["beauty", "health"],
  "start_date": "2026-01-27",
  "end_date": "2027-01-26",
  "announcement_date": "2027-01-27",
  "campaign_type": "challenge",
  "duration_days": 365,
  "submission_frequency": "daily",
  "content_guidelines": {
    "structure": "5-step",
    "dos": ["ใช้ Hashtag #ปจด"],
    "donts": ["ไม่ควรพูดว่า..."],
    "hashtags": ["#ปจด", "#สามสิบคุณสัมฤทธิ์"]
  },
  "rewards": [
    {
      "reward_order": 1,
      "reward_type": "sales_milestone",
      "config": {
        "criteria": "gmv",
        "tiers": [
          {"rank": 1, "amount": 8000},
          {"rank": 2, "amount": 5000}
        ]
      }
    },
    {
      "reward_order": 2,
      "reward_type": "streak_bonus",
      "config": {
        "criteria": "streak_days",
        "streaks": [
          {"days": 10, "winners": 10, "amount_per_winner": 500}
        ]
      }
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "campaign": { /* campaign object with rewards */ }
  }
}
```

---

### GET /campaigns
Get all campaigns (with filters)

**Query params:**
- `status` - draft | live | completed
- `search` - search by title
- `platform` - filter by platform
- `category` - filter by category
- `min_followers` - filter by followers requirement
- `page` - pagination
- `limit` - items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "campaigns": [/* array of campaigns */],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "pages": 3
    }
  }
}
```

---

### GET /campaigns/:id
Get campaign details

**Response:**
```json
{
  "success": true,
  "data": {
    "campaign": {
      "id": "uuid",
      "title": "...",
      "description": "...",
      "rewards": [/* array of rewards */],
      "stats": {
        "current_creators": 97,
        "total_submissions": 1245,
        "pending_submissions": 23,
        "total_gmv": 2450000,
        "total_views": 2100000,
        "total_engagement": 187000
      }
    }
  }
}
```

---

### PATCH /campaigns/:id
Update campaign

**Request:**
```json
{
  "title": "Updated title",
  "status": "live"
}
```

---

### DELETE /campaigns/:id
Delete campaign (draft only)

---

### GET /campaigns/:id/dashboard
Get campaign dashboard data

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "active_creators": 97,
      "total_videos": 1245,
      "total_reach": 2100000,
      "budget_used": 375000
    },
    "leaderboard": [
      {
        "rank": 1,
        "creator_name": "@beauty_sara",
        "gmv": 450000,
        "total_submissions": 365,
        "current_streak": 365
      }
    ],
    "pending_submissions": [/* recent submissions */],
    "recent_activity": [/* activity log */]
  }
}
```

---

### POST /campaigns/:id/publish
Publish a draft campaign

---

### POST /campaigns/:id/complete
Mark campaign as completed (triggers reward calculation)

---

## 3. Campaign Rewards

### POST /campaigns/:id/rewards
Add a reward to campaign

**Request:**
```json
{
  "reward_order": 3,
  "reward_type": "custom",
  "reward_name": "iPhone 17 Pro",
  "config": {
    "criteria": "gmv",
    "condition": "gmv >= 1000000",
    "reward_description": "iPhone 17 Pro 256GB",
    "reward_value": 43900,
    "image_url": "...",
    "quantity": 1
  }
}
```

---

### PUT /campaigns/:id/rewards/:rewardId
Update a reward

---

### DELETE /campaigns/:id/rewards/:rewardId
Delete a reward

---

### POST /campaigns/:id/rewards/ai-allocate
AI Auto Allocation of rewards

**Request:**
```json
{
  "total_budget": 50000,
  "selected_templates": [
    "sales_milestone",
    "top_volume",
    "streak_bonus",
    "lucky_draw"
  ],
  "campaign_type": "long-term" // or "short-term", "awareness"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "allocation": {
      "sales_milestone": {
        "percentage": 40,
        "budget": 20000,
        "tiers": [
          {"rank": 1, "amount": 8000},
          {"rank": 2, "amount": 5000}
        ]
      },
      "top_volume": {
        "percentage": 30,
        "budget": 15000,
        "tiers": [/* ... */]
      },
      "streak_bonus": {
        "percentage": 20,
        "budget": 10000,
        "streaks": [/* ... */]
      },
      "lucky_draw": {
        "percentage": 10,
        "budget": 5000,
        "config": {/* ... */}
      }
    },
    "reasoning": "Sales Milestones (40%): Most important for ROI..."
  }
}
```

---

## 4. Applications

### POST /campaigns/:id/apply
Creator applies to campaign

**Request:**
```json
{
  "message": "I'm interested in this campaign because..."
}
```

---

### GET /campaigns/:id/applications
Get applications for a campaign (Brand only)

**Query params:**
- `status` - pending | approved | rejected
- `page`, `limit`

**Response:**
```json
{
  "success": true,
  "data": {
    "applications": [
      {
        "id": "uuid",
        "creator": {
          "name": "...",
          "tiktok_handle": "...",
          "followers": 50000
        },
        "status": "pending",
        "applied_at": "..."
      }
    ]
  }
}
```

---

### PATCH /applications/:id/approve
Approve application (Brand only)

---

### PATCH /applications/:id/reject
Reject application (Brand only)

**Request:**
```json
{
  "reason": "Does not meet requirements"
}
```

---

## 5. Submissions

### POST /campaigns/:id/submissions
Submit work (Creator only)

**Request:**
```json
{
  "video_url": "https://tiktok.com/...",
  "promo_code_url": "https://shorten.link/...",
  "description": "Day 12 review...",
  "submission_date": "2026-02-07"
}
```

---

### GET /campaigns/:id/submissions
Get submissions for a campaign

**Query params:**
- `status` - pending | approved | rejected
- `creator_id` - filter by creator
- `date_from`, `date_to`
- `page`, `limit`

---

### GET /submissions/:id
Get submission details

---

### PATCH /submissions/:id/approve
Approve submission (Brand only)

---

### PATCH /submissions/:id/reject
Reject submission (Brand only)

**Request:**
```json
{
  "rejection_reason": "Video quality not acceptable"
}
```

---

## 6. GMV & Sales Data

### POST /campaigns/:id/gmv/upload
Upload GMV data CSV

**Request:** multipart/form-data
```
file: <CSV file>
```

**CSV Format:**
```csv
creator_id,creator_name,gmv,orders,last_updated
uuid1,@creator1,450000,1200,2026-01-27
uuid2,@creator2,380000,980,2026-01-27
```

**Response:**
```json
{
  "success": true,
  "data": {
    "upload": {
      "id": "uuid",
      "file_name": "gmv_data.csv",
      "total_creators": 97,
      "total_gmv": 2450000,
      "total_orders": 8234,
      "processed": true
    }
  }
}
```

---

### GET /campaigns/:id/gmv
Get GMV data for campaign

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "total_gmv": 2450000,
      "total_orders": 8234,
      "avg_order_value": 297,
      "last_updated": "2026-01-27 14:30:00"
    },
    "creators": [
      {
        "creator_id": "uuid",
        "creator_name": "@beauty_sara",
        "gmv": 450000,
        "orders": 1200,
        "rank": 1
      }
    ]
  }
}
```

---

### GET /campaigns/:id/gmv/download-template
Download CSV template for GMV upload

---

## 7. Creator Stats & Leaderboard

### GET /campaigns/:id/leaderboard
Get campaign leaderboard

**Query params:**
- `sort_by` - gmv | video_count | streak | engagement
- `limit` - default 100

**Response:**
```json
{
  "success": true,
  "data": {
    "leaderboard": [
      {
        "rank": 1,
        "creator": {
          "id": "uuid",
          "name": "@beauty_sara",
          "followers": 85000
        },
        "stats": {
          "gmv": 450000,
          "total_submissions": 365,
          "current_streak": 365,
          "longest_streak": 365,
          "total_views": 890000,
          "total_engagement": 67000,
          "engagement_rate": 7.53
        }
      }
    ]
  }
}
```

---

### GET /campaigns/:id/my-stats
Get my stats in this campaign (Creator only)

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "total_submissions": 12,
      "approved_submissions": 12,
      "current_streak": 12,
      "longest_streak": 12,
      "gmv": 280000,
      "current_rank": {
        "gmv": 4,
        "volume": 12,
        "streak": 8
      },
      "milestones_achieved": [10],
      "next_milestone": 20,
      "potential_rewards": {
        "current": ["Sales Milestone Rank 4: ฿2,000"],
        "upcoming": ["Streak 20 days: Chance to win"]
      }
    }
  }
}
```

---

## 8. Rewards & Winners

### POST /campaigns/:id/calculate-rewards
Calculate all rewards (after campaign ends)

**Response:**
```json
{
  "success": true,
  "data": {
    "total_winners": 45,
    "total_payout": 125000,
    "by_type": {
      "sales_milestone": {
        "winners": 5,
        "payout": 20000
      },
      "top_volume": {
        "winners": 5,
        "payout": 15000
      },
      "streak_bonus": {
        "winners": 15,
        "payout": 10000
      },
      "lucky_draw": {
        "winners": 10,
        "payout": 5000
      },
      "custom": {
        "winners": 1,
        "description": "iPhone 17 Pro",
        "value": 43900
      }
    },
    "winners": [/* array of winners */]
  }
}
```

---

### GET /campaigns/:id/winners
Get winners list

---

### POST /campaigns/:id/announce-winners
Announce winners (send notifications)

---

### GET /my/rewards
Get my rewards across all campaigns (Creator)

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "total_earned": 32400,
      "this_month": 8200,
      "pending": 1500
    },
    "rewards": [
      {
        "campaign_title": "สามสิบ ตรา คุณสัมฤทธิ์",
        "reward_type": "sales_milestone",
        "reward_description": "Rank 4 GMV",
        "amount": 2000,
        "status": "paid",
        "paid_at": "2026-01-28"
      }
    ]
  }
}
```

---

## 9. Payments

### GET /campaigns/:id/payments
Get payment status for campaign (Brand)

---

### POST /campaigns/:id/payments/process
Process payments for winners

**Request:**
```json
{
  "winner_ids": ["uuid1", "uuid2"],
  "payment_method": "bank_transfer"
}
```

---

### PATCH /payments/:id/mark-paid
Mark payment as paid

**Request:**
```json
{
  "transaction_id": "TXN123456",
  "payment_reference": "REF-2026-0127"
}
```

---

## 10. Dashboard & Analytics

### GET /dashboard/brand
Get brand dashboard overview

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "total_campaigns": 5,
      "active_campaigns": 2,
      "total_creators": 450,
      "total_budget": 2500000,
      "pending_review": 23
    },
    "recent_campaigns": [/* ... */],
    "pending_applications": [/* ... */],
    "recent_submissions": [/* ... */]
  }
}
```

---

### GET /dashboard/creator
Get creator dashboard overview

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "total_earnings": 32400,
      "this_month": 8200,
      "active_campaigns": 2,
      "approval_rate": 98
    },
    "active_campaigns": [/* ... */],
    "recommended_campaigns": [/* ... */],
    "recent_earnings": [/* ... */]
  }
}
```

---

## 11. Notifications

### GET /notifications
Get notifications

**Query params:**
- `read` - true | false | all
- `type` - filter by type
- `page`, `limit`

---

### PATCH /notifications/:id/read
Mark notification as read

---

### POST /notifications/mark-all-read
Mark all notifications as read

---

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "email": "Email is required"
    }
  }
}
```

**Error Codes:**
- `VALIDATION_ERROR` - Invalid input
- `UNAUTHORIZED` - Not authenticated
- `FORBIDDEN` - No permission
- `NOT_FOUND` - Resource not found
- `CONFLICT` - Resource conflict (e.g., already exists)
- `SERVER_ERROR` - Internal server error

---

## Pagination

All list endpoints support pagination:
```json
{
  "success": true,
  "data": {
    "items": [/* ... */],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  }
}
```

---

## Rate Limiting

- 100 requests per minute per IP
- 1000 requests per hour per user

Response headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1643723400
```
