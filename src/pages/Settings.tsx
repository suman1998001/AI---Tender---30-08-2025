import { useState, useRef, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Upload, Image, X, Check, Settings as SettingsIcon, Palette, Building, Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DefineCustomThemeModal } from "@/components/settings/DefineCustomThemeModal";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const Settings = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [currentLogo, setCurrentLogo] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string>("theme1");
  const [currentTheme, setCurrentTheme] = useState<string>("theme1");
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isCustomThemeModalOpen, setIsCustomThemeModalOpen] = useState(false);
  const [editingTheme, setEditingTheme] = useState<{
    id: string;
    name: string;
    colors: string[];
    description: string;
    cssVars: Record<string, string>;
  } | null>(null);
  const [customThemes, setCustomThemes] = useState<{
    id: string;
    name: string;
    colors: string[];
    description: string;
    cssVars: Record<string, string>;
  }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Load current logo and theme on component mount
  useEffect(() => {
    // Load logo from localStorage
    const savedLogo = localStorage.getItem('companyLogo');
    setCurrentLogo(savedLogo);
    loadCustomThemes();
  }, []);

  useEffect(() => {
    loadSavedTheme();
  }, [customThemes]);

  const loadCustomThemes = () => {
    const savedCustomThemes = localStorage.getItem('customThemes');
    if (savedCustomThemes) {
      try {
        const parsed = JSON.parse(savedCustomThemes);
        setCustomThemes(parsed);
      } catch (error) {
        console.error('Error loading custom themes:', error);
      }
    }
  };

  const getAllThemes = () => [...themes, ...customThemes];

  const loadSavedTheme = () => {
    const savedTheme = localStorage.getItem('selectedTheme');
    const allThemes = getAllThemes();
    if (savedTheme && allThemes.find(t => t.id === savedTheme)) {
      setSelectedTheme(savedTheme);
      setCurrentTheme(savedTheme);
      
      // Apply the saved theme
      const themeData = allThemes.find(t => t.id === savedTheme);
      if (themeData) {
        const root = document.documentElement;
        Object.entries(themeData.cssVars).forEach(([property, value]) => {
          root.style.setProperty(property, value);
        });
      }
    }
  };


  const themes = [
    {
      id: "theme1",
      name: "Red, Black and White",
      colors: ["#ef4444", "#000000", "#ffffff"],
      description: "Bold and professional with red accents",
      cssVars: {
        "--primary": "0 0% 9%",
        "--red-muted": "0 47% 45%",
        "--red-accent": "0 35% 55%",
        "--red-accent-light": "0 25% 65%",
        "--chart-red-primary": "0 72% 51%",
        "--chart-red-secondary": "0 84% 60%",
        "--chart-red-dark": "0 77% 38%",
        "--chart-red-darker": "0 76% 35%",
        "--error": "0 84% 60%"
      }
    },
    {
      id: "theme2", 
      name: "Blue & Orange",
      colors: ["#213E60", "#E68C3A", "#F4F2EF"],
      description: "Professional blue and orange color palette",
      cssVars: {
        "--primary": "212 48% 25%",
        "--red-muted": "24 78% 56%",
        "--red-accent": "24 78% 56%", 
        "--red-accent-light": "24 78% 66%",
        "--background": "60 100% 99%",
        "--sidebar-background": "60 100% 99%",
        "--chart-red-primary": "24 78% 56%",
        "--chart-red-secondary": "24 78% 66%", 
        "--chart-red-dark": "212 48% 25%",
        "--chart-red-darker": "212 58% 20%",
        "--error": "24 78% 56%"
      }
    },
    {
      id: "theme3",
      name: "Black & Green",
      colors: ["#2f2f2f", "#098676"],
      description: "Sleek and modern with green highlights",
      cssVars: {
        "--primary": "0 0% 18%",
        "--red-muted": "174 87% 29%",
        "--red-accent": "174 87% 29%",
        "--red-accent-light": "174 87% 39%",
        "--chart-red-primary": "174 87% 29%",
        "--chart-red-secondary": "174 87% 39%",
        "--chart-red-dark": "0 0% 18%",
        "--chart-red-darker": "0 0% 12%",
        "--error": "174 87% 29%"
      }
    },
    {
      id: "theme4",
      name: "Light Blue & Navy",
      colors: ["#F7FAFF", "#111C47"],
      description: "Clean and elegant with blue tones",
      cssVars: {
        "--primary": "229 61% 17%",
        "--red-muted": "229 61% 17%",
        "--red-accent": "229 61% 17%",
        "--red-accent-light": "229 50% 25%",
        "--background": "219 100% 98%",
        "--sidebar-background": "219 100% 98%",
        "--chart-red-primary": "229 61% 17%",
        "--chart-red-secondary": "229 50% 25%",
        "--chart-red-dark": "229 71% 12%",
        "--chart-red-darker": "229 81% 8%",
        "--error": "229 61% 17%"
      }
    }
  ];

  const handleFileSelect = (file: File) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload PNG, JPG, or SVG files only.",
        variant: "destructive"
      });
      return;
    }

    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please upload files smaller than 5MB.",
        variant: "destructive"
      });
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleApplyLogo = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      // Convert file to base64 for localStorage
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Logo = e.target?.result as string;
        
        // Save to localStorage
        localStorage.setItem('companyLogo', base64Logo);
        
        setCurrentLogo(base64Logo);
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

        // Notify other components of logo change
        window.dispatchEvent(new CustomEvent('logoChanged', { 
          detail: { logoUrl: base64Logo } 
        }));

        toast({
          title: "Logo applied successfully",
          description: "Your company logo has been updated across the dashboard.",
        });
        
        setUploading(false);
      };
      
      reader.onerror = () => {
        toast({
          title: "Upload failed",
          description: "Failed to process logo. Please try again.",
          variant: "destructive"
        });
        setUploading(false);
      };
      
      reader.readAsDataURL(selectedFile);
      
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload logo. Please try again.",
        variant: "destructive"
      });
      setUploading(false);
    }
  };

  const handleRemoveLogo = () => {
    try {
      // Remove from localStorage
      localStorage.removeItem('companyLogo');

      setCurrentLogo(null);
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Notify other components of logo change
      window.dispatchEvent(new CustomEvent('logoChanged', { 
        detail: { logoUrl: null } 
      }));

      toast({
        title: "Logo removed",
        description: "Company logo has been removed from the dashboard.",
      });
    } catch (error) {
      console.error('Error removing logo:', error);
      toast({
        title: "Remove failed",
        description: "Failed to remove logo. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSaveCustomTheme = (newTheme: {
    id: string;
    name: string;
    colors: string[];
    description: string;
    cssVars: Record<string, string>;
  }) => {
    if (editingTheme) {
      // Update existing theme
      const updatedCustomThemes = customThemes.map(theme => 
        theme.id === editingTheme.id ? newTheme : theme
      );
      setCustomThemes(updatedCustomThemes);
      localStorage.setItem('customThemes', JSON.stringify(updatedCustomThemes));
      
      toast({
        title: "Theme updated successfully",
        description: `"${newTheme.name}" has been updated.`,
      });
    } else {
      // Add new theme
      const updatedCustomThemes = [...customThemes, newTheme];
      setCustomThemes(updatedCustomThemes);
      localStorage.setItem('customThemes', JSON.stringify(updatedCustomThemes));
      
      toast({
        title: "Custom theme saved",
        description: `"${newTheme.name}" has been added to your theme options.`,
      });
    }
    
    setEditingTheme(null);
  };

  const handleEditTheme = (theme: any) => {
    setEditingTheme(theme);
    setIsCustomThemeModalOpen(true);
  };

  const handleDeleteTheme = (themeId: string) => {
    const updatedCustomThemes = customThemes.filter(theme => theme.id !== themeId);
    setCustomThemes(updatedCustomThemes);
    localStorage.setItem('customThemes', JSON.stringify(updatedCustomThemes));
    
    // If the deleted theme was selected, switch to the first available theme
    if (selectedTheme === themeId) {
      const firstTheme = themes[0];
      setSelectedTheme(firstTheme.id);
      handleApplyTheme();
    }
    
    toast({
      title: "Theme deleted",
      description: "The custom theme has been removed.",
    });
  };

  const isCustomTheme = (themeId: string) => {
    return customThemes.some(theme => theme.id === themeId);
  };

  const handleApplyTheme = () => {
    const allThemes = getAllThemes();
    const selectedThemeData = allThemes.find(t => t.id === selectedTheme);
    if (!selectedThemeData) return;

    // Apply CSS variables to the root element
    const root = document.documentElement;
    Object.entries(selectedThemeData.cssVars).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });

    setCurrentTheme(selectedTheme);
    
    // Store theme preference in localStorage
    localStorage.setItem('selectedTheme', selectedTheme);
    
    // Trigger a custom event to notify other components of theme change
    window.dispatchEvent(new CustomEvent('themeChanged', { 
      detail: { theme: selectedTheme, colors: selectedThemeData.cssVars } 
    }));
    
    toast({
      title: "Theme applied successfully",
      description: `${selectedThemeData.name} theme has been activated.`,
    });
  };

  const isLogoApplyEnabled = selectedFile && previewUrl && previewUrl !== currentLogo;
  const isThemeApplyEnabled = selectedTheme !== currentTheme;

  return (
    <DashboardLayout>
      <div className="p-6 space-y-[10px] animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground">Personalize your dashboard experience</p>
          </div>
        </div>

        {/* Company Branding Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Upload Company Logo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Upload Area */}
            <div className="space-y-4">
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                  isDragging 
                    ? 'border-primary bg-primary/5' 
                    : 'border-muted-foreground/25 hover:border-primary/50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <div className="space-y-2">
                  <p className="text-lg font-medium">Drag & Drop your logo here</p>
                  <p className="text-sm text-muted-foreground">
                    or click the button below to browse files
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supported Formats & Size Limit: PNG, JPG, SVG. Max 5MB.
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="mt-4 transition-all duration-200 hover:scale-105"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Browse File
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Current Logo Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-sm font-medium">Current Logo Preview</Label>
                <div className="border rounded-lg p-4 bg-muted/10 h-32 flex items-center justify-center">
                  {currentLogo ? (
                    <img 
                      src={currentLogo} 
                      alt="Current company logo" 
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <div className="text-center">
                      <Image className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">No logo uploaded</p>
                    </div>
                  )}
                </div>
              </div>

              {previewUrl && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium">New Logo Preview</Label>
                  <div className="border rounded-lg p-4 bg-muted/10 h-32 flex items-center justify-center">
                    <img 
                      src={previewUrl} 
                      alt="New logo preview" 
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  {selectedFile && (
                    <div className="text-xs text-muted-foreground">
                      <p>{selectedFile.name}</p>
                      <p>{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <Button
                onClick={handleApplyLogo}
                disabled={!isLogoApplyEnabled || uploading}
                className="transition-all duration-200 hover:scale-105"
              >
                <Check className="h-4 w-4 mr-2" />
                {uploading ? "Uploading..." : "Apply Logo"}
              </Button>
              {currentLogo && (
                <Button
                  variant="outline"
                  onClick={handleRemoveLogo}
                  className="transition-all duration-200 hover:scale-105"
                >
                  <X className="h-4 w-4 mr-2" />
                  Remove Logo
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Dashboard Theme Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Choose Dashboard Theme
              </CardTitle>
              {/* Define Custom Theme Button - aligned with heading */}
              <Button
                variant="outline"
                onClick={() => setIsCustomThemeModalOpen(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Define Custom Theme
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">

            {/* Theme Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {getAllThemes().map((theme) => (
                <div
                  key={theme.id}
                  className={`relative border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md group ${
                    selectedTheme === theme.id
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-muted-foreground/25'
                  }`}
                  onClick={() => setSelectedTheme(theme.id)}
                >
                  {/* Hover Action Buttons */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditTheme(theme);
                      }}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    {isCustomTheme(theme.id) && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Custom Theme</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{theme.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteTheme(theme.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete Theme
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium pr-20">{theme.name}</h4>
                      {currentTheme === theme.id && (
                        <Badge variant="default" className="text-xs">
                          <Check className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      )}
                    </div>
                    
                    {/* Color Swatches */}
                    <div className="flex gap-2">
                      {theme.colors.map((color, index) => (
                        <div
                          key={index}
                          className="w-6 h-6 rounded-full border shadow-sm"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {theme.description}
                    </p>
                    
                    {/* Radio Button */}
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id={theme.id}
                        name="theme"
                        value={theme.id}
                        checked={selectedTheme === theme.id}
                        onChange={() => setSelectedTheme(theme.id)}
                        className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                      />
                      <label htmlFor={theme.id} className="ml-2 text-sm cursor-pointer">
                        Select this theme
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Apply Theme Button */}
            <div className="flex items-center gap-4">
              <Button
                onClick={handleApplyTheme}
                disabled={!isThemeApplyEnabled}
                className="transition-all duration-200 hover:scale-105"
              >
                <Palette className="h-4 w-4 mr-2" />
                Apply Theme
              </Button>
              {isThemeApplyEnabled && (
                <p className="text-sm text-muted-foreground">
                  Click to apply the selected theme to your dashboard
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Custom Theme Modal */}
      <DefineCustomThemeModal
        isOpen={isCustomThemeModalOpen}
        onClose={() => {
          setIsCustomThemeModalOpen(false);
          setEditingTheme(null);
        }}
        onSave={handleSaveCustomTheme}
        editingTheme={editingTheme}
      />
    </DashboardLayout>
  );
};

export default Settings;