# SF Hacker Houses Demo - Simple Authentication

## Overview
The application now uses simple username/password authentication instead of OAuth for demo purposes.

## Demo Accounts
Use any of these accounts to log in:

| Username | Password | Character |
|----------|----------|-----------|
| `alex`   | `demo123` | Alex Chen - ML Engineer at OpenAI |
| `sarah`  | `demo123` | Sarah Kim - Product Manager at Anthropic |
| `mike`   | `demo123` | Mike Torres - Founder at Stealth AI |

## How to Test

1. **Start the application:**
   ```bash
   npm run dev
   ```

2. **Landing Page:** Visit [http://localhost:3000](http://localhost:3000)
   - Updated messaging focuses on SF hacker house community
   - "Explore Hacker Houses" button now leads to sign-in page

3. **Sign In:** Visit [http://localhost:3001/auth/signin](http://localhost:3001/auth/signin)
   - Use any demo account from the table above
   - Simple username/password form
   - Demo accounts are listed on the sign-in page for convenience

4. **Dashboard:** After login, you'll see:
   - SF Hacker House Directory with 3 sample houses
   - Community stats (houses, members, neighborhoods)
   - Profile completion prompt
   - Sample house data with focus areas, member counts, and neighborhoods

5. **Profile Page:** [http://localhost:3001/profile](http://localhost:3001/profile)
   - Complete profile form with Partiful/Luma integration
   - Skills management system
   - Social media links
   - Live preview of profile changes

## Key Changes Made

1. **Authentication:**
   - Removed Google/GitHub OAuth providers
   - Added NextAuth credentials provider
   - Created 3 demo users with hardcoded credentials
   - Simplified login flow

2. **UI Updates:**
   - Custom sign-in page with demo account information
   - Updated dashboard login prompts
   - Landing page now links to sign-in page
   - Removed OAuth-specific buttons

3. **Security Note:**
   - This is for demo purposes only
   - In production, passwords should be hashed
   - Users should be stored in a database
   - Proper validation and security measures should be implemented

## Demo Flow

1. Visit landing page
2. Click "Explore Hacker Houses"
3. Sign in with demo credentials (e.g., alex/demo123)
4. Browse hacker house directory
5. Click "Complete Profile" to set up profile
6. Add Partiful/Luma URLs and skills
7. Sign out and try different demo accounts

The system maintains all the original functionality while being much easier to demo without OAuth setup requirements. 