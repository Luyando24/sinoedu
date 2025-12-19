"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { toast } from "sonner"
import { Pencil, FileType, Search, Type, Image as ImageIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type ContentBlock = {
  id: string
  key: string
  content: string
  description: string
  type: string // 'text', 'html', 'image'
}

export function ContentTable({ data }: { data: ContentBlock[] }) {
  const [blocks, setBlocks] = useState(data)
  const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const supabase = createClient()

  // Filter content blocks
  const filteredBlocks = blocks.filter(block => 
    block.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
    block.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    block.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Group blocks by page/section (based on key prefix)
  const groupedBlocks = filteredBlocks.reduce((acc, block) => {
    const section = block.key.split('.')[0]
    if (!acc[section]) acc[section] = []
    acc[section].push(block)
    return acc
  }, {} as Record<string, ContentBlock[]>)

  const sections = Object.keys(groupedBlocks)

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

  const getTypeIcon = (type: string) => {
    switch (type) {
        case 'html': return <FileType className="h-4 w-4 text-blue-500" />
        case 'image': return <ImageIcon className="h-4 w-4 text-purple-500" />
        default: return <Type className="h-4 w-4 text-slate-500" />
    }
  }

  return (
    <div className="space-y-6">
        {/* Search and Filters */}
        <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search content keys, descriptions or values..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        </div>

        {sections.length > 0 ? (
            <Tabs defaultValue={sections[0]} className="w-full">
                <TabsList className="w-full justify-start overflow-x-auto h-auto p-1 bg-transparent border-b rounded-none mb-4">
                    {sections.map(section => (
                        <TabsTrigger 
                            key={section} 
                            value={section}
                            className="data-[state=active]:bg-background data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2 capitalize"
                        >
                            {section}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {sections.map(section => (
                    <TabsContent key={section} value={section} className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {groupedBlocks[section].map(block => (
                                <Card key={block.id} className="hover:shadow-md transition-all group">
                                    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                        <div className="space-y-1 pr-4">
                                            <CardTitle className="text-base font-medium break-all">
                                                {block.key.split('.').slice(1).join('.')}
                                            </CardTitle>
                                            <CardDescription className="line-clamp-1 text-xs">
                                                {block.description}
                                            </CardDescription>
                                        </div>
                                        <Badge variant="outline" className="shrink-0 flex gap-1 items-center">
                                            {getTypeIcon(block.type)}
                                            {block.type}
                                        </Badge>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="bg-muted/50 p-3 rounded-md min-h-[80px] text-sm text-muted-foreground relative group-hover:bg-muted transition-colors">
                                            <div className="line-clamp-3 break-words">
                                                {block.content}
                                            </div>
                                            <Button 
                                                size="icon" 
                                                variant="secondary" 
                                                className="absolute bottom-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                                onClick={() => handleEdit(block)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        ) : (
            <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed">
                <p className="text-muted-foreground">No content blocks found matching your search.</p>
            </div>
        )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
                <Pencil className="h-4 w-4 text-primary" />
                Edit Content
            </DialogTitle>
            <DialogDescription>
                <code className="bg-muted px-1 py-0.5 rounded text-xs">{editingBlock?.key}</code>
                <div className="mt-1">{editingBlock?.description}</div>
            </DialogDescription>
          </DialogHeader>
          {editingBlock && (
            <form onSubmit={handleSave} className="space-y-4 py-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                    Content Value
                    {editingBlock.type === 'html' && <span className="text-xs text-muted-foreground ml-2">(HTML supported)</span>}
                </label>
                <Textarea 
                  value={editingBlock.content}
                  onChange={(e) => setEditingBlock({ ...editingBlock, content: e.target.value })}
                  className="min-h-[200px] font-mono text-sm"
                  placeholder="Enter content..."
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
