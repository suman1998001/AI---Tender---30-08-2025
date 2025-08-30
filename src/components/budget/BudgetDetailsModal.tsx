import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  IndianRupee, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  User, 
  Building2, 
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle,
  Coffee,
  Monitor,
  Car,
  X
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts";

interface BudgetDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  budget: any;
}

export const BudgetDetailsModal = ({ isOpen, onClose, budget }: BudgetDetailsModalProps) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'analytics'>('overview');

  if (!budget) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const utilizationPercentage = (budget.actual / budget.totalBudget) * 100;
  const commitmentPercentage = (budget.committed / budget.totalBudget) * 100;
  const availablePercentage = (budget.available / budget.totalBudget) * 100;

  // Mock transaction data
  const recentTransactions = [
    {
      id: 1,
      description: "AWS Cloud Services",
      amount: 125000,
      date: "Today",
      type: "expense",
      icon: Monitor,
      category: "Infrastructure"
    },
    {
      id: 2,
      description: "Office Supplies",
      amount: 15000,
      date: "Yesterday", 
      type: "expense",
      icon: Coffee,
      category: "Operations"
    },
    {
      id: 3,
      description: "Vehicle Maintenance",
      amount: 85000,
      date: "2 Days Ago",
      type: "expense", 
      icon: Car,
      category: "Maintenance"
    }
  ];

  // Mock trend data
  const trendData = [
    { month: 'Jan', budgeted: 100000, actual: 85000 },
    { month: 'Feb', budgeted: 100000, actual: 92000 },
    { month: 'Mar', budgeted: 100000, actual: 88000 },
    { month: 'Apr', budgeted: 100000, actual: 105000 },
    { month: 'May', budgeted: 100000, actual: 95000 },
    { month: 'Jun', budgeted: 100000, actual: 102000 }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden p-6 bg-card border-border">
        <DialogHeader className="pb-6 border-b border-border bg-card">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-red-accent flex items-center justify-center">
                  <IndianRupee className="w-6 h-6 text-white" />
                </div>
                {budget.name}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground mt-1">{budget.owner} • {budget.department}</DialogDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto max-h-[calc(90vh-160px)] pt-6">
          {/* Summary Cards - Dashboard Style */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[10px] mb-[10px]">
            {/* Total Budget Card */}
            <Card className="group relative overflow-hidden rounded-lg border border-border bg-card shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-red-accent/10 to-red-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
                <div className="space-y-1">
                  <CardTitle className="text-sm font-medium text-muted-foreground tracking-tight leading-none">
                    Total Budget
                  </CardTitle>
                  <div className="text-2xl font-bold text-foreground tracking-tight">
                    {formatCurrency(budget.totalBudget)}
                  </div>
                </div>
                <div className="bg-red-accent p-2.5 rounded-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Target className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              
              <CardContent className="relative pt-0 px-6 pb-6">
                <p className="text-xs text-muted-foreground font-medium">
                  Allocated Amount
                </p>
              </CardContent>
              
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Card>

            {/* Actual Spend Card */}
            <Card className="group relative overflow-hidden rounded-lg border border-border bg-card shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-muted/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
                <div className="space-y-1">
                  <CardTitle className="text-sm font-medium text-muted-foreground tracking-tight leading-none">
                    Actual Spend
                  </CardTitle>
                  <div className="text-2xl font-bold text-foreground tracking-tight">
                    {formatCurrency(budget.actual)}
                  </div>
                </div>
                <div className="bg-primary p-2.5 rounded-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <ArrowDownLeft className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              
              <CardContent className="relative pt-0 px-6 pb-6">
                <p className="text-xs text-red-accent font-medium">
                  +12% from last month
                </p>
              </CardContent>
              
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Card>

            {/* Committed Card */}
            <Card className="group relative overflow-hidden rounded-lg border border-border bg-card shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-muted/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
                <div className="space-y-1">
                  <CardTitle className="text-sm font-medium text-muted-foreground tracking-tight leading-none">
                    Committed
                  </CardTitle>
                  <div className="text-2xl font-bold text-foreground tracking-tight">
                    {formatCurrency(budget.committed)}
                  </div>
                </div>
                <div className="bg-red-muted p-2.5 rounded-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Clock className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              
              <CardContent className="relative pt-0 px-6 pb-6">
                <p className="text-xs text-muted-foreground font-medium">
                  Pending Payments
                </p>
              </CardContent>
              
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-muted opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Card>

            {/* Available Card */}
            <Card className="group relative overflow-hidden rounded-lg border border-border bg-card shadow-sm hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-muted/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <CardHeader className="relative flex flex-row items-start justify-between space-y-0 pb-3 pt-6 px-6">
                <div className="space-y-1">
                  <CardTitle className="text-sm font-medium text-muted-foreground tracking-tight leading-none">
                    Available
                  </CardTitle>
                  <div className="text-2xl font-bold text-foreground tracking-tight">
                    {formatCurrency(budget.available)}
                  </div>
                </div>
                <div className="bg-primary p-2.5 rounded-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              
              <CardContent className="relative pt-0 px-6 pb-6">
                <p className="text-xs text-muted-foreground font-medium">
                  Remaining Balance
                </p>
              </CardContent>
              
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-[10px]">
            {/* Left Column - Budget Breakdown */}
            <div className="lg:col-span-2 space-y-[10px]">
              {/* Utilization Progress */}
              <Card className="border-border bg-card rounded-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-red-accent" />
                    Budget Utilization
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-foreground">Actual Spend</span>
                      <span className="text-sm font-bold text-red-accent">{utilizationPercentage.toFixed(1)}%</span>
                    </div>
                    <Progress value={utilizationPercentage} className="h-3 bg-muted" />
                  </div>
                  
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-foreground">Committed Amount</span>
                        <span className="text-sm font-bold text-red-muted">{commitmentPercentage.toFixed(1)}%</span>
                      </div>
                      <Progress value={commitmentPercentage} className="h-3 bg-muted" />
                    </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-foreground">Available</span>
                      <span className="text-sm font-bold text-primary">{availablePercentage.toFixed(1)}%</span>
                    </div>
                    <Progress value={availablePercentage} className="h-3 bg-muted" />
                  </div>
                </CardContent>
              </Card>

              {/* Spending Trends */}
              <Card className="border-border bg-card rounded-lg h-[380px]">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-foreground">Spending Trends</CardTitle>
                  <p className="text-sm text-muted-foreground">Monthly budget vs actual spending comparison</p>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" tickFormatter={value => `₹${value / 1000}K`} />
                        <Bar dataKey="budgeted" fill="hsl(var(--muted))" name="Budgeted" />
                        <Bar dataKey="actual" fill="hsl(var(--red-accent))" name="Actual" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Quick Actions & Transactions */}
            <div className="space-y-[10px]">
              {/* Quick Actions */}
              <Card className="border-border bg-gradient-to-br from-red-accent/5 to-red-accent/10 border border-red-accent/20 rounded-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-foreground text-left">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start bg-red-accent hover:bg-red-muted text-white rounded-lg" size="sm">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Create Payment Request
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-red-accent/30 hover:bg-red-accent/10 rounded-lg" size="sm">
                    <ArrowUpRight className="w-4 h-4 mr-2" />
                    Transfer Budget
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-border hover:bg-muted rounded-lg" size="sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Review
                  </Button>
                </CardContent>
              </Card>

              {/* Upcoming Payments */}
              <Card className="border-border bg-card rounded-lg">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold text-muted-foreground">Upcoming Payment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-2">
                    <h3 className="text-3xl font-bold text-foreground">{formatCurrency(125000)}</h3>
                    <p className="text-sm font-medium text-foreground">AWS Infrastructure</p>
                    <p className="text-xs text-muted-foreground">Tomorrow</p>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Transactions */}
              <Card className="border-border bg-card rounded-lg h-[240px]">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-foreground">Recent Transactions</CardTitle>
                  <p className="text-sm text-muted-foreground">Latest budget activities</p>
                </CardHeader>
                <CardContent className="space-y-4 overflow-y-auto max-h-[140px]">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-red-accent/10 flex items-center justify-center">
                        <transaction.icon className="w-5 h-5 text-red-accent" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-foreground">{transaction.description}</p>
                          <span className="text-sm font-bold text-red-accent">
                            -{formatCurrency(transaction.amount)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">{transaction.category}</p>
                          <p className="text-xs text-muted-foreground">{transaction.date}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};