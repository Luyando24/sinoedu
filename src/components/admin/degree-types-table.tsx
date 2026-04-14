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

type DegreeType = {
  id: string
  name: string
  sort_order: number
  is_active: boolean
}

export function DegreeTypesTable({ initialData }: { initialData: DegreeType[] }) {
  const [data, setData] = useState<DegreeType[]>(initialData)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<DegreeType | null>(null)
  
  const [newItem, setNewItem] = useState({ name: "", sort_order: 0 })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  const router = useRouter()
  const supabase = createClient()

  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => a.sort_order - b.sort_order)

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleAdd = async () => {
    if (!newItem.name) return
    setLoading(true)
    try {
      const { data: inserted, error } = await supabase
        .from('program_levels')
        .insert([{ ...newItem, is_active: true }])
        .select()
        .single()

      if (error) throw error
      setData(prev => [...prev, inserted])
      setIsAddOpen(false)
      setNewItem({ name: "", sort_order: 0 })
      toast.success("Degree type added successfully")
      router.refresh()
    } catch {
      toast.error("Failed to add degree type")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async () => {
    if (!editingItem || !editingItem.name) return
    setLoading(true)
    try {
      const { error } = await supabase
        .from('program_levels')
        .update({ name: editingItem.name, sort_order: editingItem.sort_order })
        .eq('id', editingItem.id)

      if (error) throw error
      setData(prev => prev.map(item => item.id === editingItem.id ? editingItem : item))
      setIsEditOpen(false)
      toast.success("Degree type updated successfully")
      router.refresh()
    } catch {
      toast.error("Failed to update degree type")
    } finally {
      setLoading(false)
    }
  }

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('program_levels')
        .update({ is_active: !currentStatus })
        .eq('id', id)

      if (error) throw error
      setData(prev => prev.map(item => item.id === id ? { ...item, is_active: !currentStatus } : item))
      toast.success(`Degree type marked as ${!currentStatus ? 'active' : 'inactive'}`)
      router.refresh()
    } catch {
      toast.error("Failed to update status")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This may affect programs using this degree type.")) return
    setLoading(true)
    try {
      const { error } = await supabase
        .from('program_levels')
        .delete()
        .eq('id', id)

      if (error) throw error
      setData(prev => prev.filter(item => item.id !== id))
      toast.success("Degree type deleted successfully")
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
            placeholder="Search degree types..."
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
              <Plus className="mr-2 h-4 w-4" /> Add Degree Type
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Degree Type</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input 
                  value={newItem.name} 
                  onChange={e => setNewItem({...newItem, name: e.target.value})} 
                  placeholder="e.g. Bachelor"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Sort Order (Lower appears first)</label>
                <Input 
                  type="number" 
                  value={newItem.sort_order} 
                  onChange={e => setNewItem({...newItem, sort_order: parseInt(e.target.value) || 0})} 
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button onClick={handleAdd} disabled={loading || !newItem.name}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="w-[80px]">
                    <Badge variant="outline" className="font-mono">{item.sort_order}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
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
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  No degree types found.
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
            <DialogTitle>Edit Degree Type</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input 
                value={editingItem?.name || ""} 
                onChange={e => setEditingItem(prev => prev ? {...prev, name: e.target.value} : null)} 
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
            <Button onClick={handleUpdate} disabled={loading || !editingItem?.name}>
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
