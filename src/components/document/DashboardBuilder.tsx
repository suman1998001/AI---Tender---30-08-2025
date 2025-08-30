import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Activity,
  Plus,
  Eye,
  Settings,
  Layout,
  Save,
  GripVertical
} from "lucide-react";

export const DashboardBuilder = () => {
  const [dashboardName, setDashboardName] = useState('');
  const [selectedWidgets, setSelectedWidgets] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isEditMode, setIsEditMode] = useState(true);

  const widgetTypes = [
    { id: 'compliance-chart', name: 'Compliance Status Chart', icon: PieChart, type: 'chart' },
    { id: 'financial-trend', name: 'Financial Trends', icon: TrendingUp, type: 'chart' },
    { id: 'applicant-stats', name: 'Applicant Statistics', icon: BarChart3, type: 'metric' },
    { id: 'processing-time', name: 'Processing Time Analytics', icon: Activity, type: 'metric' },
    { id: 'risk-assessment', name: 'Risk Assessment Matrix', icon: Layout, type: 'table' },
    { id: 'document-summary', name: 'Document Summary', icon: Settings, type: 'summary' }
  ];

  const handleAddWidget = (widgetId: string) => {
    if (!selectedWidgets.includes(widgetId)) {
      setSelectedWidgets([...selectedWidgets, widgetId]);
      const widget = widgetTypes.find(w => w.id === widgetId);
      toast({
        title: "Widget Added",
        description: `${widget?.name} has been added to your dashboard`,
        className: "fixed bottom-4 right-4 w-80 bg-white border border-gray-200 text-gray-900 shadow-lg"
      });
    }
  };

  const handleRemoveWidget = (widgetId: string) => {
    setSelectedWidgets(selectedWidgets.filter(id => id !== widgetId));
    const widget = widgetTypes.find(w => w.id === widgetId);
    toast({
      title: "Widget Removed",
      description: `${widget?.name} has been removed from your dashboard`,
      className: "fixed bottom-4 right-4 w-80 bg-white border border-gray-200 text-gray-900 shadow-lg"
    });
  };

  const handleDragStart = (e: React.DragEvent, widgetId: string) => {
    e.dataTransfer.setData("text/plain", widgetId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const draggedWidgetId = e.dataTransfer.getData("text/plain");
    const draggedIndex = selectedWidgets.indexOf(draggedWidgetId);
    
    if (draggedIndex !== -1 && draggedIndex !== targetIndex) {
      const newWidgets = [...selectedWidgets];
      newWidgets.splice(draggedIndex, 1);
      newWidgets.splice(targetIndex, 0, draggedWidgetId);
      setSelectedWidgets(newWidgets);
    }
  };

  const handleSaveDashboard = () => {
    if (dashboardName.trim() && selectedWidgets.length > 0) {
      toast({
        title: "Dashboard Saved Successfully!",
        description: `Dashboard "${dashboardName}" saved with ${selectedWidgets.length} widgets`,
        className: "fixed bottom-4 right-4 w-80 bg-white border border-gray-200 text-gray-900 shadow-lg"
      });
    }
  };

  const handlePreviewDashboard = () => {
    if (selectedWidgets.length > 0) {
      setShowPreview(!showPreview);
      setIsEditMode(!showPreview);
      toast({
        title: showPreview ? "Edit Mode Enabled" : "Preview Mode Enabled",
        description: showPreview ? "You can now edit your dashboard widgets" : "Displaying dashboard with live data",
        className: "fixed bottom-4 right-4 w-80 bg-white border border-gray-200 text-gray-900 shadow-lg"
      });
    } else {
      toast({
        title: "No Widgets Selected",
        description: "Please add some widgets to preview the dashboard",
        className: "fixed bottom-4 right-4 w-80 bg-white border border-gray-200 text-gray-900 shadow-lg"
      });
    }
  };

  const handleEditDashboard = (dashboardName: string) => {
    toast({
      title: "Feature Coming Soon",
      description: "Dashboard editing functionality is being developed",
      className: "fixed bottom-4 right-4 bg-white border border-gray-200 text-gray-900 shadow-lg"
    });
  };

  const handleViewDashboard = (dashboardName: string) => {
    toast({
      title: "Feature Coming Soon",
      description: "Dashboard viewing functionality is being developed",
      className: "fixed bottom-4 right-4 bg-white border border-gray-200 text-gray-900 shadow-lg"
    });
  };

  const renderWidgetContent = (widgetId: string) => {
    const widget = widgetTypes.find(w => w.id === widgetId);
    
    switch (widgetId) {
      case 'compliance-chart':
        return (
          <div className="space-y-2">
            <div className="h-16 bg-gradient-to-r from-green-100 to-green-200 rounded flex items-center justify-center">
              <PieChart size={24} className="text-green-600" />
            </div>
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span>Compliant:</span>
                <span className="font-semibold text-green-600">85%</span>
              </div>
              <div className="flex justify-between">
                <span>Pending:</span>
                <span className="font-semibold text-yellow-600">15%</span>
              </div>
            </div>
          </div>
        );
      case 'financial-trend':
        return (
          <div className="space-y-2">
            <div className="h-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded flex items-center justify-center">
              <TrendingUp size={24} className="text-blue-600" />
            </div>
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span>Growth:</span>
                <span className="font-semibold text-green-600">+12%</span>
              </div>
              <div className="flex justify-between">
                <span>Trend:</span>
                <span className="font-semibold text-blue-600">Rising</span>
              </div>
            </div>
          </div>
        );
      case 'applicant-stats':
        return (
          <div className="space-y-2">
            <div className="h-16 bg-gradient-to-r from-purple-100 to-purple-200 rounded flex items-center justify-center">
              <BarChart3 size={24} className="text-purple-600" />
            </div>
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span>Total:</span>
                <span className="font-semibold">247</span>
              </div>
              <div className="flex justify-between">
                <span>Active:</span>
                <span className="font-semibold text-green-600">189</span>
              </div>
            </div>
          </div>
        );
      case 'processing-time':
        return (
          <div className="space-y-2">
            <div className="h-16 bg-gradient-to-r from-orange-100 to-orange-200 rounded flex items-center justify-center">
              <Activity size={24} className="text-orange-600" />
            </div>
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span>Avg Time:</span>
                <span className="font-semibold">2.5 days</span>
              </div>
              <div className="flex justify-between">
                <span>Efficiency:</span>
                <span className="font-semibold text-green-600">92%</span>
              </div>
            </div>
          </div>
        );
      case 'risk-assessment':
        return (
          <div className="space-y-2">
            <div className="h-16 bg-gradient-to-r from-red-100 to-red-200 rounded flex items-center justify-center">
              <Layout size={24} className="text-red-600" />
            </div>
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span>High Risk:</span>
                <span className="font-semibold text-red-600">5</span>
              </div>
              <div className="flex justify-between">
                <span>Low Risk:</span>
                <span className="font-semibold text-green-600">42</span>
              </div>
            </div>
          </div>
        );
      case 'document-summary':
        return (
          <div className="space-y-2">
            <div className="h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded flex items-center justify-center">
              <Settings size={24} className="text-gray-600" />
            </div>
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span>Processed:</span>
                <span className="font-semibold">156</span>
              </div>
              <div className="flex justify-between">
                <span>Pending:</span>
                <span className="font-semibold text-yellow-600">23</span>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="text-center">
            {widget && <widget.icon size={24} className="mx-auto mb-2 text-cyan-600" />}
            <div className="text-xs font-medium">{widget?.name}</div>
          </div>
        );
    }
  };

  const renderEnhancedWidget = (widgetId: string) => {
    const widget = widgetTypes.find(w => w.id === widgetId);
    
    switch (widgetId) {
      case 'compliance-chart':
        return (
          <div className="space-y-4">
            <div className="h-32 bg-gradient-to-r from-green-100 to-green-200 rounded-lg flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">85%</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-center">
                <div className="font-semibold text-green-600">Compliant</div>
                <div className="text-2xl font-bold">85%</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-yellow-600">Pending</div>
                <div className="text-2xl font-bold">15%</div>
              </div>
            </div>
          </div>
        );
      case 'financial-trend':
        return (
          <div className="space-y-4">
            <div className="h-32 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
              <TrendingUp size={48} className="text-blue-600" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Revenue Growth</span>
                <span className="font-bold text-green-600">+12%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
        );
      case 'applicant-stats':
        return (
          <div className="space-y-4">
            <div className="h-32 bg-gradient-to-r from-purple-100 to-purple-200 rounded-lg p-4">
              <div className="grid grid-cols-3 gap-2 h-full">
                <div className="bg-purple-400 rounded"></div>
                <div className="bg-purple-500 rounded"></div>
                <div className="bg-purple-300 rounded"></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">247</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">189</div>
                <div className="text-sm text-gray-600">Active</div>
              </div>
            </div>
          </div>
        );
      default:
        return renderWidgetContent(widgetId);
    }
  };

  const renderFullPreviewWidget = (widgetId: string) => {
    const widget = widgetTypes.find(w => w.id === widgetId);
    
    switch (widgetId) {
      case 'compliance-chart':
        return (
          <div className="space-y-4">
            <div className="h-48 bg-gradient-to-r from-green-100 to-green-200 rounded-lg flex items-center justify-center relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">85%</span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 grid grid-cols-2 gap-2 text-sm">
                <div className="bg-white/80 p-2 rounded text-center">
                  <div className="font-bold text-green-600">212</div>
                  <div className="text-xs">Compliant</div>
                </div>
                <div className="bg-white/80 p-2 rounded text-center">
                  <div className="font-bold text-yellow-600">35</div>
                  <div className="text-xs">Pending</div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'financial-trend':
        return (
          <div className="space-y-4">
            <div className="h-48 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg p-4">
              <div className="h-full flex items-end justify-between">
                {[65, 78, 82, 75, 88, 92].map((height, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div 
                      className="w-8 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t"
                      style={{ height: `${height}%` }}
                    ></div>
                    <span className="text-xs mt-1 text-blue-700">Q{i+1}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">+12%</div>
              <div className="text-sm text-gray-600">Growth Rate</div>
            </div>
          </div>
        );
      case 'applicant-stats':
        return (
          <div className="space-y-4">
            <div className="h-48 bg-gradient-to-r from-purple-100 to-purple-200 rounded-lg p-4">
              <div className="grid grid-cols-3 gap-2 h-full">
                <div className="bg-gradient-to-t from-purple-400 to-purple-300 rounded flex items-end justify-center pb-2">
                  <span className="text-white font-bold text-sm">247</span>
                </div>
                <div className="bg-gradient-to-t from-purple-500 to-purple-400 rounded flex items-end justify-center pb-2">
                  <span className="text-white font-bold text-sm">189</span>
                </div>
                <div className="bg-gradient-to-t from-purple-300 to-purple-200 rounded flex items-end justify-center pb-2">
                  <span className="text-purple-700 font-bold text-sm">58</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <div className="font-bold">Total</div>
                <div className="text-gray-600">Applicants</div>
              </div>
              <div>
                <div className="font-bold">Active</div>
                <div className="text-gray-600">Reviews</div>
              </div>
              <div>
                <div className="font-bold">Pending</div>
                <div className="text-gray-600">Action</div>
              </div>
            </div>
          </div>
        );
      case 'processing-time':
        return (
          <div className="space-y-4">
            <div className="h-48 bg-gradient-to-r from-orange-100 to-orange-200 rounded-lg p-4 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600 mb-2">2.5</div>
                <div className="text-lg text-orange-700">Days</div>
                <div className="text-sm text-orange-600 mt-2">Average Processing</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center text-sm">
              <div>
                <div className="font-bold text-green-600">92%</div>
                <div className="text-gray-600">Efficiency</div>
              </div>
              <div>
                <div className="font-bold text-blue-600">156</div>
                <div className="text-gray-600">Processed</div>
              </div>
            </div>
          </div>
        );
      case 'risk-assessment':
        return (
          <div className="space-y-4">
            <div className="h-48 bg-gradient-to-r from-red-100 to-red-200 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-2 h-full">
                <div className="space-y-2">
                  <div className="bg-red-500 rounded p-2 text-white text-center text-sm font-bold">High: 5</div>
                  <div className="bg-yellow-400 rounded p-2 text-white text-center text-sm font-bold">Med: 12</div>
                </div>
                <div className="space-y-2">
                  <div className="bg-green-500 rounded p-2 text-white text-center text-sm font-bold">Low: 42</div>
                  <div className="bg-gray-400 rounded p-2 text-white text-center text-sm font-bold">None: 8</div>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">Risk Matrix</div>
              <div className="text-sm text-gray-600">Real-time Assessment</div>
            </div>
          </div>
        );
      case 'document-summary':
        return (
          <div className="space-y-4">
            <div className="h-48 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg p-4">
              <div className="space-y-3">
                <div className="bg-white rounded p-3 shadow-sm">
                  <div className="flex justify-between">
                    <span className="text-sm">Processed</span>
                    <span className="font-bold text-green-600">156</span>
                  </div>
                </div>
                <div className="bg-white rounded p-3 shadow-sm">
                  <div className="flex justify-between">
                    <span className="text-sm">Pending</span>
                    <span className="font-bold text-yellow-600">23</span>
                  </div>
                </div>
                <div className="bg-white rounded p-3 shadow-sm">
                  <div className="flex justify-between">
                    <span className="text-sm">Failed</span>
                    <span className="font-bold text-red-600">4</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return renderWidgetContent(widgetId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Builder Header */}
      <Card className="border-cyan-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-cyan-900">
            <Layout size={20} />
            Custom Dashboard Builder
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dashboard Name
              </label>
              <Input
                placeholder="Enter dashboard name..."
                value={dashboardName}
                onChange={(e) => setDashboardName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dashboard Type
              </label>
              <Select defaultValue="analytics">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="analytics">Analytics Dashboard</SelectItem>
                  <SelectItem value="compliance">Compliance Dashboard</SelectItem>
                  <SelectItem value="financial">Financial Dashboard</SelectItem>
                  <SelectItem value="operational">Operational Dashboard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Widget Library */}
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900">Available Widgets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              {widgetTypes.map((widget) => (
                <div key={widget.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <widget.icon size={20} className="text-cyan-600" />
                    <div>
                      <div className="font-medium text-sm">{widget.name}</div>
                      <Badge variant="outline" className="text-xs mt-1">
                        {widget.type}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddWidget(widget.id)}
                    disabled={selectedWidgets.includes(widget.id)}
                    className="hover:bg-cyan-50"
                  >
                    <Plus size={14} />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Dashboard Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-gray-900">
              Dashboard Preview
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handlePreviewDashboard}
                  disabled={selectedWidgets.length === 0}
                >
                  <Eye size={14} className="mr-1" />
                  {showPreview ? 'Edit Mode' : 'Preview'}
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleSaveDashboard}
                  disabled={!dashboardName.trim() || selectedWidgets.length === 0}
                  className="bg-cyan-600 hover:bg-cyan-700"
                >
                  <Save size={14} className="mr-1" />
                  Save
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedWidgets.length > 0 ? (
              <div className="space-y-4">
                {showPreview ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedWidgets.map((widgetId) => (
                      <div key={widgetId} className="p-4 border-2 border-gray-200 rounded-lg bg-white shadow-sm">
                        {renderFullPreviewWidget(widgetId)}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {selectedWidgets.map((widgetId, index) => {
                      return (
                        <div 
                          key={widgetId} 
                          className="relative p-4 border-2 border-gray-200 rounded-lg bg-white shadow-sm cursor-move"
                          draggable
                          onDragStart={(e) => handleDragStart(e, widgetId)}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, index)}
                        >
                          <div className="absolute top-2 left-2 opacity-50">
                            <GripVertical size={16} className="text-gray-400" />
                          </div>
                          <button
                            onClick={() => handleRemoveWidget(widgetId)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 z-10"
                          >
                            ×
                          </button>
                          {renderWidgetContent(widgetId)}
                        </div>
                      );
                    })}
                  </div>
                )}
                {selectedWidgets.length > 0 && (
                  <div className="mt-4 p-3 bg-cyan-50 border border-cyan-200 rounded-lg">
                    <div className="text-sm text-cyan-800 font-medium">
                      Dashboard: {dashboardName || 'Untitled Dashboard'}
                    </div>
                    <div className="text-xs text-cyan-600 mt-1">
                      {selectedWidgets.length} widgets configured
                      {showPreview && " • Preview mode with live data"}
                      {!showPreview && isEditMode && " • Edit mode - drag to reorder"}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                <Layout size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-2">Dashboard Preview</p>
                <p className="text-sm text-gray-500">
                  Add widgets to see your dashboard layout
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Saved Dashboards */}
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-900">Saved Dashboards</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'Compliance Overview', widgets: 4, lastModified: '2024-01-15' },
              { name: 'Financial Analysis', widgets: 6, lastModified: '2024-01-12' },
              { name: 'Processing Metrics', widgets: 3, lastModified: '2024-01-08' }
            ].map((dashboard, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">{dashboard.name}</h4>
                    <p className="text-sm text-gray-600">{dashboard.widgets} widgets</p>
                    <p className="text-xs text-gray-500">Modified: {dashboard.lastModified}</p>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleViewDashboard(dashboard.name)}
                      >
                        <Eye size={12} className="mr-1" />
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleEditDashboard(dashboard.name)}
                      >
                        <Settings size={12} className="mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
