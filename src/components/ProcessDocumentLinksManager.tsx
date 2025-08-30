import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Link2, 
  Loader2,
  Check,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ProcessDocumentLinksService, { ProcessDocumentLink } from '@/services/processDocumentLinksService';

interface ProcessDocumentLinksManagerProps {
  rfpId?: string;
}

export const ProcessDocumentLinksManager: React.FC<ProcessDocumentLinksManagerProps> = ({ rfpId }) => {
  const { toast } = useToast();
  const [links, setLinks] = useState<ProcessDocumentLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingLink, setEditingLink] = useState<ProcessDocumentLink | null>(null);
  const [saving, setSaving] = useState(false);

  const [newLink, setNewLink] = useState({
    document_link: '',
    is_active: true
  });

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const data = rfpId 
        ? await ProcessDocumentLinksService.getByRfpId(rfpId)
        : await ProcessDocumentLinksService.getAll();
      setLinks(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch process document links',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, [rfpId]);

  const handleCreate = async () => {
    if (!rfpId) {
      toast({
        title: 'Error',
        description: 'RFP ID is required',
        variant: 'destructive'
      });
      return;
    }

    if (!newLink.document_link) {
      toast({
        title: 'Error',
        description: 'Document link is required',
        variant: 'destructive'
      });
      return;
    }

    try {
      setSaving(true);
      const createdLink = await ProcessDocumentLinksService.create({
        rfp_id: rfpId,
        ...newLink
      });
      
      setLinks(prev => [createdLink, ...prev]);
      setShowCreateDialog(false);
      setNewLink({
        document_link: '',
        is_active: true
      });
      
      toast({
        title: 'Success',
        description: 'Process document link created successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create process document link',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async () => {
    if (!editingLink?.id) return;

    try {
      setSaving(true);
      const updatedLink = await ProcessDocumentLinksService.update(editingLink.id, {
        document_link: editingLink.document_link,
        is_active: editingLink.is_active
      });
      
      setLinks(prev => prev.map(link => link.id === editingLink.id ? updatedLink : link));
      setShowEditDialog(false);
      setEditingLink(null);
      
      toast({
        title: 'Success',
        description: 'Process document link updated successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update process document link',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this process document link?')) return;

    try {
      await ProcessDocumentLinksService.delete(id);
      setLinks(prev => prev.filter(link => link.id !== id));
      
      toast({
        title: 'Success',
        description: 'Process document link deleted successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete process document link',
        variant: 'destructive'
      });
    }
  };

  const handleToggleActive = async (link: ProcessDocumentLink) => {
    if (!link.id) return;

    try {
      const updatedLink = await ProcessDocumentLinksService.toggleActive(link.id, link.is_active || false);
      setLinks(prev => prev.map(l => l.id === link.id ? updatedLink : l));
      
      toast({
        title: 'Success',
        description: `Process document link ${updatedLink.is_active ? 'activated' : 'deactivated'} successfully`
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update process document link status',
        variant: 'destructive'
      });
    }
  };

  const openLink = (url: string) => {
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading process document links...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link2 className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">Process Document Links</h2>
          <Badge variant="outline">{links.length} links</Badge>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-red-accent hover:bg-red-muted text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Document Link
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Process Document Link</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Document Link *</label>
                <Input
                  placeholder="https://example.com/document.pdf"
                  value={newLink.document_link}
                  onChange={(e) => setNewLink(prev => ({ ...prev, document_link: e.target.value }))}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={newLink.is_active}
                  onChange={(e) => setNewLink(prev => ({ ...prev, is_active: e.target.checked }))}
                />
                <label htmlFor="is_active" className="text-sm font-medium">Active</label>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleCreate} disabled={saving} className="flex-1">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                  Create Link
                </Button>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)} disabled={saving}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Links Table */}
      <Card>
        <CardContent className="p-0">
          {links.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Link2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No process document links found</p>
              <p className="text-sm">Add your first document link to get started</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document Link</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {links.map((link) => (
                  <TableRow key={link.id}>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="text-sm text-gray-900 line-clamp-1 font-medium">
                          {link.document_link}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant={link.is_active ? "default" : "outline"}
                        onClick={() => handleToggleActive(link)}
                        className="h-6 px-2"
                      >
                        {link.is_active ? (
                          <>
                            <Check className="w-3 h-3 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <X className="w-3 h-3 mr-1" />
                            Inactive
                          </>
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {link.created_at ? new Date(link.created_at).toLocaleDateString() : 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openLink(link.document_link)}
                          title="Open Link"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingLink(link);
                            setShowEditDialog(true);
                          }}
                          title="Edit"
                        >
                          <Edit3 className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => link.id && handleDelete(link.id)}
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3 text-red-accent" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Process Document Link</DialogTitle>
          </DialogHeader>
          {editingLink && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Document Link *</label>
                <Input
                  placeholder="https://example.com/document.pdf"
                  value={editingLink.document_link}
                  onChange={(e) => setEditingLink(prev => prev ? { ...prev, document_link: e.target.value } : null)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit_is_active"
                  checked={editingLink.is_active || false}
                  onChange={(e) => setEditingLink(prev => prev ? { ...prev, is_active: e.target.checked } : null)}
                />
                <label htmlFor="edit_is_active" className="text-sm font-medium">Active</label>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleEdit} disabled={saving} className="flex-1">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                  Update Link
                </Button>
                <Button variant="outline" onClick={() => setShowEditDialog(false)} disabled={saving}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
