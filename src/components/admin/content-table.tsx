"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import { Pencil } from "lucide-react"

type ContentBlock = {
  id: string
  key: string
  content: string
  description: string
  type: string
}

export function ContentTable({ data }: { data: ContentBlock[] }) {
  const [blocks, setBlocks] = useState(data)
  const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const handleEdit = (block: ContentBlock) => {
    setEditingBlock(block)
    setIsOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingBlock) return

    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('content_blocks')
        .update({ content: editingBlock.content })
        .eq('id', editingBlock.id)

      if (error) throw error

      setBlocks(blocks.map(b => b.id === editingBlock.id ? editingBlock : b))
      toast.success("Content updated successfully")
      setIsOpen(false)
    } catch (error) {
      console.error(error)
      toast.error("Failed to update content")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Key</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Content Preview</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blocks.map((block) => (
              <TableRow key={block.id}>
                <TableCell className="font-mono text-sm">{block.key}</TableCell>
                <TableCell>{block.description}</TableCell>
                <TableCell className="max-w-[300px] truncate">{block.content}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(block)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {blocks.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No content blocks found. Run the migration script.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Content: {editingBlock?.key}</DialogTitle>
          </DialogHeader>
          {editingBlock && (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Content</label>
                <Textarea
                  value={editingBlock.content}
                  onChange={(e) => setEditingBlock({ ...editingBlock, content: e.target.value })}
                  className="min-h-[200px]"
                />
                <p className="text-xs text-muted-foreground">
                  {editingBlock.description}
                </p>
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
