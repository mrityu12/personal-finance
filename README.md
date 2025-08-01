# Personal Finance Visualizer

A comprehensive web application for tracking personal finances, managing budgets, and visualizing spending patterns.

## Features

### Stage 1: Basic Transaction Tracking ✅
- Add, edit, and delete transactions
- Transaction list view with filtering
- Monthly expenses bar chart
- Form validation and error handling

### Stage 2: Categories & Dashboard ✅
- Predefined expense and income categories
- Category-wise pie chart visualization
- Comprehensive dashboard with summary cards
- Recent transactions display

### Stage 3: Budgeting ✅
- Set monthly budgets for different categories
- Budget vs actual spending comparison
- Visual progress indicators
- Budget alerts and insights

## Technology Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Database**: MongoDB
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB (local or cloud)

### Installation

1. **Clone and setup the project:**
```bash
npx create-next-app@latest personal-finance-visualizer --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd personal-finance-visualizer
```

2. **Install dependencies:**
```bash
npm install mongodb recharts lucide-react class-variance-authority clsx tailwind-merge @radix-ui/react-dialog @radix-ui/react-select @radix-ui/react-label @radix-ui/react-progress @radix-ui/react-slot
```

3. **Set up shadcn/ui:**
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input label dialog select alert textarea progress
```

4. **Create folder structure:**
```bash
mkdir -p src/components/{ui,Charts} src/lib src/data src/app/api/{transactions,budgets}
```

5. **Environment setup:**
```bash
# Create .env.local file
echo "MONGODB_URI=mongodb://localhost:27017" >> .env.local
echo "MONGODB_DB=personal_finance" >> .env.local
```

6. **Start development server:**
```bash
npm run dev
```

## MongoDB Setup

### Option 1: Local MongoDB with Docker
```bash
docker run --name mongodb -d -p 27017:27017 mongo:latest
```

### Option 2: MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get connection string and add to `.env.local`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── transactions/route.js
│   │   └── budgets/route.js
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── Charts/            # Chart components
│   ├── Dashboard.jsx      # Main dashboard
│   ├── TransactionForm.jsx
│   ├── TransactionList.jsx
│   └── BudgetManager.jsx
├── lib/
│   ├── mongodb.js        # Database connection
│   └── utils.js          # Utility functions
└── data/
    └── categories.js     # Expense/Income categories
```

## Key Features

### Dashboard
- Monthly income, expenses, and net balance
- Visual charts for expense trends
- Recent transaction overview
- Budget progress tracking

### Transaction Management
- Add income and expense transactions
- Categorize transactions with predefined categories
- Search and filter functionality
- Edit and delete capabilities

### Budget Management
- Set monthly budgets by category
- Visual progress indicators
- Over-budget alerts
- Budget vs actual comparison charts

### Charts & Visualizations
- Monthly expenses bar chart
- Category breakdown pie chart
- Budget comparison charts
- Responsive design for all screen sizes

## API Endpoints

### Transactions
- `GET /api/transactions` - Fetch all transactions
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions` - Update transaction
- `DELETE /api/transactions` - Delete transaction

### Budgets
- `GET /api/budgets` - Fetch all budgets
- `POST /api/budgets` - Create new budget
- `PUT /api/budgets` - Update budget
- `DELETE /api/budgets` - Delete budget

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Environment Variables for Production
```
MONGODB_URI=your_production_mongodb_uri
MONGODB_DB=personal_finance
```

## Usage Guide

### Adding Transactions
1. Click "Add Transaction" button
2. Select transaction type (Income/Expense)
3. Enter amount, description, category, and date
4. Submit form

### Managing Budgets
1. Go to "Budgets" tab
2. Click "Add Budget"
3. Select category and set monthly limit
4. Monitor progress in dashboard

### Viewing Reports
- Dashboard shows current month overview
- Charts update automatically with new data
- Filter transactions by type, category, or search term

## Customization

### Adding New Categories
Edit `src/data/categories.js`:
```javascript
export const EXPENSE_CATEGORIES = [
  { value: 'new_category', label: 'New Category', color: '#color', icon: '🆕' },
  // ... existing categories
];
```

### Styling
- Uses Tailwind CSS for styling
- shadcn/ui provides consistent component design
- Custom animations in `globals.css`

## Performance Features

- Client-side data caching
- Optimized database queries
- Responsive image loading
- Efficient re-rendering with React

## Security Considerations

- Input validation on client and server
- MongoDB injection prevention
- Environment variable protection
- No authentication required (as per requirements)

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
1. Check existing GitHub issues
2. Create new issue with detailed description
3. Include browser and environment details

---

**Built with ❤️ using Next.js, React, and Modern Web Technologies**