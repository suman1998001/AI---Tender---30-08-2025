import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus, Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CustomColor {
  id: string;
  name: string;
  value: string;
}

interface DefineCustomThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (theme: {
    id: string;
    name: string;
    colors: string[];
    description: string;
    cssVars: Record<string, string>;
  }) => void;
  editingTheme?: {
    id: string;
    name: string;
    colors: string[];
    description: string;
    cssVars: Record<string, string>;
  } | null;
}

export const DefineCustomThemeModal = ({ isOpen, onClose, onSave, editingTheme }: DefineCustomThemeModalProps) => {
  const [themeName, setThemeName] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#FF0000");
  const [secondaryColor, setSecondaryColor] = useState("#000000");
  const [additionalColors, setAdditionalColors] = useState<CustomColor[]>([]);
  const { toast } = useToast();

  // Populate modal when editing
  useEffect(() => {
    if (editingTheme) {
      setThemeName(editingTheme.name);
      setPrimaryColor(editingTheme.colors[0] || "#FF0000");
      setSecondaryColor(editingTheme.colors[1] || "#000000");
      
      // Set additional colors if they exist
      const additionalColorsFromTheme = editingTheme.colors.slice(2).map((color, index) => ({
        id: `color-${index}`,
        name: `Color ${index + 3}`,
        value: color
      }));
      setAdditionalColors(additionalColorsFromTheme);
    } else {
      // Reset for new theme
      setThemeName("");
      setPrimaryColor("#FF0000");
      setSecondaryColor("#000000");
      setAdditionalColors([]);
    }
  }, [editingTheme, isOpen]);

  const addColorField = () => {
    const newColor: CustomColor = {
      id: `color-${Date.now()}`,
      name: "",
      value: "#AABBCC"
    };
    setAdditionalColors([...additionalColors, newColor]);
  };

  const removeColorField = (id: string) => {
    setAdditionalColors(additionalColors.filter(color => color.id !== id));
  };

  const updateColorName = (id: string, name: string) => {
    setAdditionalColors(additionalColors.map(color => 
      color.id === id ? { ...color, name } : color
    ));
  };

  const updateColorValue = (id: string, value: string) => {
    setAdditionalColors(additionalColors.map(color => 
      color.id === id ? { ...color, value } : color
    ));
  };

  const isValidHex = (hex: string): boolean => {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
  };

  const hexToHsl = (hex: string): string => {
    // Remove the hash if present
    hex = hex.replace('#', '');
    
    // Parse the hex values
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  };

  const validateInputs = (): boolean => {
    if (!themeName.trim()) {
      toast({
        title: "Theme name required",
        description: "Please enter a name for your custom theme.",
        variant: "destructive"
      });
      return false;
    }

    if (!isValidHex(primaryColor)) {
      toast({
        title: "Invalid primary color",
        description: "Please enter a valid hex color code for the primary color.",
        variant: "destructive"
      });
      return false;
    }

    if (!isValidHex(secondaryColor)) {
      toast({
        title: "Invalid secondary color",
        description: "Please enter a valid hex color code for the secondary color.",
        variant: "destructive"
      });
      return false;
    }

    for (const color of additionalColors) {
      if (!color.name.trim()) {
        toast({
          title: "Color name required",
          description: "Please provide names for all additional colors.",
          variant: "destructive"
        });
        return false;
      }

      if (!isValidHex(color.value)) {
        toast({
          title: "Invalid color code",
          description: `Please enter a valid hex color code for "${color.name}".`,
          variant: "destructive"
        });
        return false;
      }
    }

    return true;
  };

  const handleSave = () => {
    if (!validateInputs()) return;

    // Generate CSS variables based on the colors
    // Primary color (red) is the main accent color
    // Secondary color (black) is used for backgrounds and contrasts
    const primaryHsl = hexToHsl(primaryColor);
    const secondaryHsl = hexToHsl(secondaryColor);

    const cssVars: Record<string, string> = {
      "--primary": secondaryHsl, // Use secondary (black) for main UI elements
      "--secondary": primaryHsl, // Use primary (red) for secondary elements
      "--red-muted": primaryHsl,
      "--red-accent": primaryHsl,
      "--red-accent-light": primaryHsl,
      "--chart-red-primary": primaryHsl, // Primary (red) for main chart elements
      "--chart-red-secondary": secondaryHsl, // Secondary (black) for chart contrast
      "--chart-red-dark": primaryHsl,
      "--chart-red-darker": primaryHsl,
      "--error": primaryHsl, // Use primary (red) for error states
      "--accent": primaryHsl, // Use primary (red) for accents
      "--muted": secondaryHsl // Use secondary (black) for muted elements
    };

    // Add additional colors to CSS variables
    additionalColors.forEach((color, index) => {
      const colorHsl = hexToHsl(color.value);
      const sanitizedName = color.name.toLowerCase().replace(/\s+/g, '-');
      cssVars[`--custom-${sanitizedName}`] = colorHsl;
      cssVars[`--custom-color-${index + 1}`] = colorHsl;
    });

    const newTheme = {
      id: editingTheme?.id || `custom-${Date.now()}`,
      name: themeName,
      colors: [primaryColor, secondaryColor, ...additionalColors.map(c => c.value)],
      description: `Custom theme: ${themeName}`,
      cssVars
    };

    onSave(newTheme);
    handleClose();
  };

  const handleClose = () => {
    setThemeName("");
    setPrimaryColor("#FF0000");
    setSecondaryColor("#000000");
    setAdditionalColors([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            {editingTheme ? "Edit Custom Theme" : "Define Custom Theme"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Theme Name */}
          <div className="space-y-2">
            <Label htmlFor="theme-name">Theme Name</Label>
            <Input
              id="theme-name"
              value={themeName}
              onChange={(e) => setThemeName(e.target.value)}
              placeholder="e.g., My Corporate Blue, Energetic Red & Black"
            />
          </div>

          {/* Default Color Fields */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Default Colors</h4>
            
            {/* Primary Color */}
            <div className="space-y-2">
              <Label htmlFor="primary-color">Primary Color</Label>
              <div className="flex gap-3 items-center">
                <Input
                  id="primary-color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  placeholder="#FF0000"
                  className="flex-1"
                />
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-12 h-10 rounded border cursor-pointer"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                This color will be used for main buttons, primary headers, and key accents throughout the application.
              </p>
            </div>

            {/* Secondary Color */}
            <div className="space-y-2">
              <Label htmlFor="secondary-color">Secondary Color</Label>
              <div className="flex gap-3 items-center">
                <Input
                  id="secondary-color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  placeholder="#000000"
                  className="flex-1"
                />
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-12 h-10 rounded border cursor-pointer"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                This color will be used for backgrounds, text, and contrasting elements within the application.
              </p>
            </div>
          </div>

          {/* Additional Colors */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-foreground">Additional Colors</h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addColorField}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Color Field
              </Button>
            </div>

            {additionalColors.map((color) => (
              <div key={color.id} className="flex gap-3 items-start p-3 border rounded-lg">
                <div className="flex-1 space-y-2">
                  <Input
                    value={color.name}
                    onChange={(e) => updateColorName(color.id, e.target.value)}
                    placeholder="Color name (e.g., Accent Color, Chart Color 1)"
                  />
                  <div className="flex gap-3 items-center">
                    <Input
                      value={color.value}
                      onChange={(e) => updateColorValue(color.id, e.target.value)}
                      placeholder="#AABBCC"
                      className="flex-1"
                    />
                    <input
                      type="color"
                      value={color.value}
                      onChange={(e) => updateColorValue(color.id, e.target.value)}
                      className="w-12 h-10 rounded border cursor-pointer"
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeColorField(color.id)}
                  className="mt-1"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Theme
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};