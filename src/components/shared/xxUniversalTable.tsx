import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MoreHorizontal, BarChart3, Download, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';

interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  className?: string;
  render?: (value: any, row: any, index: number) => React.ReactNode;
}
interface TableAction {
  label: string;
  icon?: React.ComponentType<any>;
  onClick: (row: any) => void;
}
interface UniversalTableProps {
  data: any[];
  columns: TableColumn[];
  actions?: TableAction[];
  pageSize?: number;
  showSerialNumber?: boolean;
  onRowClick?: (row: any) => void;
}
export const UniversalTable = ({
  data,
  columns,
  actions = [],
  pageSize = 10,
  showSerialNumber = true,
  onRowClick
}: UniversalTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [showCompareDialog, setShowCompareDialog] = useState(false);

  // Memoize the full data generation to prevent re-generation on each render
  const fullData = useMemo(() => {
    const generateMockRows = (originalData: any[], targetCount: number) => {
      if (originalData.length >= targetCount) return originalData;
      const mockRows = [];
      for (let i = originalData.length; i < targetCount; i++) {
        const mockRow = {
          ...originalData[0]
        };
        // Modify some fields to make it look different with stable values
        Object.keys(mockRow).forEach(key => {
          if (typeof mockRow[key] === 'string' && key.includes('name')) {
            mockRow[key] = `${mockRow[key]} ${i + 1}`;
          }
          if (typeof mockRow[key] === 'number') {
            // Use a stable calculation instead of random
            mockRow[key] = 50 + (i * 7) % 50; // This creates stable but varied numbers
          }
        });
        mockRow.id = `mock-${i}`;
        mockRows.push(mockRow);
      }
      return [...originalData, ...mockRows];
    };
    return generateMockRows(data, 50);
  }, [data]); // Only regenerate when original data changes

  const totalPages = Math.ceil(fullData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = fullData.slice(startIndex, endIndex);
  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };
  const handleActionClick = (action: TableAction, row: any) => {
    if (action.label.toLowerCase().includes('view') || action.label.toLowerCase().includes('edit')) {
      action.onClick(row);
    } else {
      toast({
        title: "Feature Coming Soon",
        description: "This functionality will be available in a future update.",
      });
    }
  };

  // Checkbox handlers
  const handleSelectRow = (rowId: string, checked: boolean) => {
    const newSelectedRows = new Set(selectedRows);
    if (checked) {
      newSelectedRows.add(rowId);
    } else {
      newSelectedRows.delete(rowId);
    }
    setSelectedRows(newSelectedRows);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allRowIds = currentData.map(row => row.id || `row-${currentData.indexOf(row)}`);
      setSelectedRows(new Set(allRowIds));
    } else {
      setSelectedRows(new Set());
    }
  };

  const selectedRowsData = fullData.filter(row => 
    selectedRows.has(row.id || `row-${fullData.indexOf(row)}`)
  );

  const handleCompare = () => {
    setShowCompareDialog(true);
  };

  const handleExportToExcel = () => {
    if (selectedRowsData.length === 0) return;

    // Prepare data for export
    const exportData = [];
    
    // Add header row
    const headerRow = ['Property', ...selectedRowsData.map((row, index) => 
      row.name || row.applicantName || `Item ${index + 1}`
    )];
    exportData.push(headerRow);

    // Add data rows
    columns.forEach(column => {
      const dataRow = [
        column.label,
        ...selectedRowsData.map(row => {
          const value = row[column.key];
          // Convert rendered content to string for export
          if (column.render) {
            // For rendered content, try to extract meaningful text
            return typeof value === 'object' ? JSON.stringify(value) : String(value || '');
          }
          return value || '';
        })
      ];
      exportData.push(dataRow);
    });

    // Create workbook and worksheet
    const ws = XLSX.utils.aoa_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Comparison");

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `comparison_${timestamp}.xlsx`;

    // Save file
    XLSX.writeFile(wb, filename);

    toast({
      title: "Export Successful",
      description: `Comparison data exported to ${filename}`,
    });
  };

  const handleCloseDialog = () => {
    setShowCompareDialog(false);
  };
  return <div className="relative">
      {/* Compare Button - shows when multiple rows are selected */}
      {selectedRows.size > 1 && (
        <div className="absolute top-[-50px] right-0 z-10">
          <Button 
            onClick={handleCompare}
            className="bg-red-muted hover:bg-red-accent text-white shadow-lg"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Compare Selected ({selectedRows.size})
          </Button>
        </div>
      )}
      
      <div className="bg-white rounded-[15px] border border-gray-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-white hover:bg-white border-b border-slate-200">
              {/* Checkbox Column */}
              <TableHead className="w-12 font-semibold text-slate-700 h-12 px-6 text-left align-middle bg-white whitespace-nowrap">
                <Checkbox
                  checked={currentData.length > 0 && currentData.every(row => 
                    selectedRows.has(row.id || `row-${fullData.indexOf(row)}`)
                  )}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              {showSerialNumber && <TableHead className="w-20 font-semibold text-slate-700 h-12 px-6 text-left align-middle bg-white whitespace-nowrap">
                  SL NO
                </TableHead>}
              {columns.map(column => <TableHead key={column.key} className={`font-semibold text-slate-700 h-12 px-6 text-left align-middle cursor-pointer hover:text-slate-900 transition-colors bg-white ${column.className || ''}`} onClick={() => column.sortable && handleSort(column.key)}>
                  <div className="flex items-center gap-1">
                    {column.label}
                    {column.sortable && sortColumn === column.key && <span className="text-xs">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                  </div>
                </TableHead>)}
              {actions.length > 0 && <TableHead className="w-16 font-semibold text-slate-700 h-12 px-6 text-left align-middle bg-white">
                  Actions
                </TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((row, index) => {
              const rowId = row.id || `row-${startIndex + index}`;
              return <TableRow key={rowId} className="hover:bg-slate-50/80 transition-all duration-200 border-b border-slate-100 cursor-pointer group" onClick={(e) => {
                // Prevent row click when checkbox is clicked
                if ((e.target as HTMLElement).closest('.checkbox-cell')) {
                  e.stopPropagation();
                  return;
                }
                onRowClick?.(row);
              }}>
                {/* Checkbox Column */}
                <TableCell className="font-medium text-slate-600 px-6 py-4 whitespace-nowrap checkbox-cell" onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedRows.has(rowId)}
                    onCheckedChange={(checked) => handleSelectRow(rowId, checked as boolean)}
                    aria-label={`Select row ${startIndex + index + 1}`}
                  />
                </TableCell>
                {showSerialNumber && <TableCell className="font-medium text-slate-600 font-mono text-sm px-6 py-4 whitespace-nowrap">
                    {startIndex + index + 1}
                  </TableCell>}
                {columns.map(column => <TableCell key={column.key} className={`px-6 py-4 ${column.className || ''}`}>
                    {column.render ? column.render(row[column.key], row, startIndex + index) : row[column.key]}
                  </TableCell>)}
                {actions.length > 0 && <TableCell className="px-6 py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-slate-200 transition-all duration-200">
                          <MoreHorizontal className="h-4 w-4 text-slate-500" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white border border-slate-200 shadow-lg min-w-[160px]">
                        {actions.map((action, actionIndex) => <DropdownMenuItem key={actionIndex} onClick={e => {
                    e.stopPropagation();
                    handleActionClick(action, row);
                  }} className="hover:bg-slate-50 cursor-pointer px-3 py-2 text-sm flex items-center gap-2">
                            {action.icon && <action.icon size={16} className="text-slate-500" />}
                            <span className="text-slate-700">{action.label}</span>
                          </DropdownMenuItem>)}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>}
               </TableRow>
             })}
          </TableBody>
        </Table>
      </div>
      
      {totalPages > 1 && <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-white">
          <div className="text-sm text-slate-600 font-medium whitespace-nowrap">
            Showing <span className="font-semibold text-slate-800">{startIndex + 1}</span> to <span className="font-semibold text-slate-800">{Math.min(endIndex, fullData.length)}</span> of <span className="font-semibold text-slate-800">{fullData.length}</span> entries
          </div>
          <Pagination className="ml-auto ">
            <PaginationContent className="gap-1">
              <PaginationItem>
                <PaginationPrevious onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} className={`${currentPage === 1 ? 'pointer-events-none opacity-50' : 'hover:bg-slate-200'} px-3 py-2 transition-colors`} />
              </PaginationItem>
              {Array.from({
            length: Math.min(5, totalPages)
          }, (_, i) => {
            const pageNum = i + 1;
            return <PaginationItem key={pageNum}>
                    <PaginationLink onClick={() => setCurrentPage(pageNum)} isActive={currentPage === pageNum} className={`px-3 py-2 transition-colors ${currentPage === pageNum ? 'bg-slate-800 text-white hover:bg-slate-700' : 'hover:bg-slate-200 text-slate-700'}`}>
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>;
          })}
              <PaginationItem>
                <PaginationNext onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} className={`${currentPage === totalPages ? 'pointer-events-none opacity-50' : 'hover:bg-slate-200'} px-3 py-2 transition-colors`} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>}
    </div>

      {/* Comparison Dialog */}
      <Dialog open={showCompareDialog} onOpenChange={setShowCompareDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <DialogTitle className="text-xl font-semibold text-gray-800">
              Compare Selected Items ({selectedRows.size})
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportToExcel}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export to Excel
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseDialog}
                className="flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Close
              </Button>
            </div>
          </DialogHeader>
          <div className="mt-6">
            {selectedRowsData.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Property</TableHead>
                      {selectedRowsData.map((row, index) => (
                        <TableHead key={index} className="min-w-[150px]">
                          {row.name || row.applicantName || `Item ${index + 1}`}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {columns.map(column => (
                      <TableRow key={column.key}>
                        <TableCell className="font-medium">{column.label}</TableCell>
                        {selectedRowsData.map((row, index) => (
                          <TableCell key={index}>
                            {column.render 
                              ? column.render(row[column.key], row, index)
                              : row[column.key]
                            }
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-center py-8 text-gray-500">No items selected for comparison</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
};
