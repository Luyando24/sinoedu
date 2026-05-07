"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { Search, Plus, Trash, Pencil, CheckCircle2, XCircle, Save } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { DataTablePagination } from "./data-table-pagination"

type Duration = {
  id: string
  name: string
  value: string
  sort_order: number
  is_active: boolean
}

export function DurationsTable({ initialData }: { initialData: Duration[] }) {
  const [data, setData] = useState<Duration[]>(initialData)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Duration | null>(null)
  
  const [newItem, setNewItem] = useState({ name: "", value: "", sort_order: 0 })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  const router = useRouter()
  const supabase = createClient()

  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.value.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => a.sort_order - b.sort_order)

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleAdd = async () => {
    if (!newItem.name || !newItem.value) return
    setLoading(true)
    try {
      const { data: inserted, error } = await supabase
        .from('program_durations')
        .insert([{ ...newItem, is_active: true }])
        .select()
        .single()

      if (error) throw error
      setData(prev => [...prev, inserted])
      setIsAddOpen(false)
      setNewItem({ name: "", value: "", sort_order: 0 })
      toast.success("Duration added successfully")
      router.refresh()
    } catch {
      toast.error("Failed to add duration. Value might already exist.")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async () => {
    if (!editingItem || !editingItem.name || !editingItem.value) return
    setLoading(true)
    try {
      const { error } = await supabase
        .from('program_durations')
        .update({ 
          name: editingItem.name, 
          value: editingItem.value,
          sort_order: editingItem.sort_order 
        })
        .eq('id', editingItem.id)

      if (error) throw error
      setData(prev => prev.map(item => item.id === editingItem.id ? editingItem : item))
      setIsEditOpen(false)
      toast.success("Duration updated successfully")
      router.refresh()
    } catch {
      toast.error("Failed to update duration")
    } finally {
      setLoading(false)
    }
  }

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('program_durations')
        .update({ is_active: !currentStatus })
        .eq('id', id)

      if (error) throw error
      setData(prev => prev.map(item => item.id === id ? { ...item, is_active: !currentStatus } : item))
      toast.success(`Duration marked as ${!currentStatus ? 'active' : 'inactive'}`)
      router.refresh()
    } catch {
      toast.error("Failed to update status")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This may affect programs and filters using this duration.")) return
    setLoading(true)
    try {
      const { error } = await supabase
        .from('program_durations')
        .delete()
        .eq('id', id)

      if (error) throw error
      setData(prev => prev.filter(item => item.id !== id))
      toast.success("Duration deleted successfully")
      router.refresh()
    } catch {
      toast.error("Failed to delete. It might be in use.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-[300px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search durations..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
          />
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Duration
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Duration</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Display Name</label>
                <Input 
                  value={newItem.name} 
                  onChange={e => setNewItem({...newItem, name: e.target.value})} 
                  placeholder="e.g. 1 Year"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Internal Value (Used for filtering)</label>
                <Input 
                  value={newItem.value} 
                  onChange={e => setNewItem({...newItem, value: e.target.value})} 
                  placeholder="e.g. 1"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Sort Order</label>
                <Input 
                  type="number" 
                  value={newItem.sort_order} 
                  onChange={e => setNewItem({...newItem, sort_order: parseInt(e.target.value) || 0})} 
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button onClick={handleAdd} disabled={loading || !newItem.name || !newItem.value}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Order</TableHead>
              <TableHead>Display Name</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">{item.sort_order}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.value}</TableCell>
                  <TableCell>
                    {item.is_active ? (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">Active</Badge>
                    ) : (
                      <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 border-none">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => {
                          setEditingItem(item)
                          setIsEditOpen(true)
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => toggleStatus(item.id, item.is_active)}
                        className={item.is_active ? "text-amber-600" : "text-green-600"}
                      >
                        {item.is_active ? <XCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-red-600"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No durations found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filteredData.length}
        itemsPerPage={itemsPerPage}
      />

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Duration</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Display Name</label>
              <Input 
                value={editingItem?.name || ""} 
                onChange={e => setEditingItem(prev => prev ? {...prev, name: e.target.value} : null)} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Internal Value</label>
              <Input 
                value={editingItem?.value || ""} 
                onChange={e => setEditingItem(prev => prev ? {...prev, value: e.target.value} : null)} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Sort Order</label>
              <Input 
                type="number" 
                value={editingItem?.sort_order || 0} 
                onChange={e => setEditingItem(prev => prev ? {...prev, sort_order: parseInt(e.target.value) || 0} : null)} 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdate} disabled={loading || !editingItem?.name || !editingItem?.value}>
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
