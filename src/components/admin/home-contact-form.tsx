"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { Loader2, Save } from "lucide-react"

type ContentBlock = {
  key: string
  content: string
  description: string
}

export function HomeContactForm() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [blocks, setBlocks] = useState<Record<string, string>>({})
  const supabase = createClient()

  const keys = [
    'home.contact.title',
    'home.programs.title',
    'home.scholarships.title',
    'home.universities.title',
    'home.short_term.title',
    'home.contact.card1.title',
    'home.contact.card1.address',
    'home.contact.card1.phone',
    'home.contact.card1.email',
    'home.contact.card1.fb',
    'home.contact.card1.vk',
    'home.contact.card1.ig',
    'home.contact.card1.yt',
    'home.contact.card1.tt',
    'home.contact.card1.xhs',
    'home.contact.card1.image',
    'home.contact.card2.title',
    'home.contact.card2.address',
    'home.contact.card2.phone',
    'home.contact.card2.email',
    'home.contact.card2.globe',
    'home.contact.card2.image',
    'home.contact.card3.title',
    'home.contact.card3.address',
    'home.contact.card3.phone',
    'home.contact.card3.email',
    'home.contact.card3.globe',
    'home.contact.card3.image',
  ]

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('content_blocks')
        .select('key, content')
        .in('key', keys)

      if (error) throw error

      const blockMap: Record<string, string> = {}
      data?.forEach(b => {
        blockMap[b.key] = b.content
      })
      setBlocks(blockMap)
    } catch (error) {
      console.error("Error fetching content:", error)
      toast.error("Failed to load content")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (key: string, value: string) => {
    setBlocks(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const updates = Object.entries(blocks).map(([key, content]) => ({
        key,
        content,
        description: `Homepage contact section: ${key}`
      }))

      const { error } = await supabase
        .from('content_blocks')
        .upsert(updates, { onConflict: 'key' })

      if (error) throw error
      toast.success("Content updated successfully")
    } catch (error) {
      console.error("Error saving content:", error)
      toast.error("Failed to save content")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Home Contact Section</h1>
          <p className="text-muted-foreground">Manage the contact cards on the landing page.</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Changes
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Main title for the section</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Contact Section Title</label>
              <Input 
                value={blocks['home.contact.title'] || ''} 
                onChange={(e) => handleChange('home.contact.title', e.target.value)}
                placeholder="Sinoway Education"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Programs Section Title</label>
              <Input 
                value={blocks['home.programs.title'] || ''} 
                onChange={(e) => handleChange('home.programs.title', e.target.value)}
                placeholder="Programs"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Scholarships Section Title</label>
              <Input 
                value={blocks['home.scholarships.title'] || ''} 
                onChange={(e) => handleChange('home.scholarships.title', e.target.value)}
                placeholder="Scholarship Program"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Universities Section Title</label>
              <Input 
                value={blocks['home.universities.title'] || ''} 
                onChange={(e) => handleChange('home.universities.title', e.target.value)}
                placeholder="University Application"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Short-term Section Title</label>
              <Input 
                value={blocks['home.short_term.title'] || ''} 
                onChange={(e) => handleChange('home.short_term.title', e.target.value)}
                placeholder="Short-term Study Tour"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="card1" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="card1">Headquarters</TabsTrigger>
          <TabsTrigger value="card2">International Support</TabsTrigger>
          <TabsTrigger value="card3">Student Services</TabsTrigger>
        </TabsList>

        {/* Card 1: Headquarters */}
        <TabsContent value="card1">
          <Card>
            <CardHeader>
              <CardTitle>Card 1: Headquarters</CardTitle>
              <CardDescription>Manage details for the first contact card.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Card Title</label>
                  <Input 
                    value={blocks['home.contact.card1.title'] || ''} 
                    onChange={(e) => handleChange('home.contact.card1.title', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Background Image URL</label>
                  <Input 
                    value={blocks['home.contact.card1.image'] || ''} 
                    onChange={(e) => handleChange('home.contact.card1.image', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Address</label>
                <Textarea 
                  value={blocks['home.contact.card1.address'] || ''} 
                  onChange={(e) => handleChange('home.contact.card1.address', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <Input 
                    value={blocks['home.contact.card1.phone'] || ''} 
                    onChange={(e) => handleChange('home.contact.card1.phone', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input 
                    value={blocks['home.contact.card1.email'] || ''} 
                    onChange={(e) => handleChange('home.contact.card1.email', e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="text-sm font-bold mb-4">Social Media Links</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Facebook</label>
                    <Input 
                      value={blocks['home.contact.card1.fb'] || ''} 
                      onChange={(e) => handleChange('home.contact.card1.fb', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Instagram</label>
                    <Input 
                      value={blocks['home.contact.card1.ig'] || ''} 
                      onChange={(e) => handleChange('home.contact.card1.ig', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">VK</label>
                    <Input 
                      value={blocks['home.contact.card1.vk'] || ''} 
                      onChange={(e) => handleChange('home.contact.card1.vk', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Youtube</label>
                    <Input 
                      value={blocks['home.contact.card1.yt'] || ''} 
                      onChange={(e) => handleChange('home.contact.card1.yt', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">TikTok</label>
                    <Input 
                      value={blocks['home.contact.card1.tt'] || ''} 
                      onChange={(e) => handleChange('home.contact.card1.tt', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Xiaohongshu</label>
                    <Input 
                      value={blocks['home.contact.card1.xhs'] || ''} 
                      onChange={(e) => handleChange('home.contact.card1.xhs', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Card 2: International Support */}
        <TabsContent value="card2">
          <Card>
            <CardHeader>
              <CardTitle>Card 2: International Support</CardTitle>
              <CardDescription>Manage details for the second contact card.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Card Title</label>
                  <Input 
                    value={blocks['home.contact.card2.title'] || ''} 
                    onChange={(e) => handleChange('home.contact.card2.title', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Background Image URL</label>
                  <Input 
                    value={blocks['home.contact.card2.image'] || ''} 
                    onChange={(e) => handleChange('home.contact.card2.image', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description / Address</label>
                <Textarea 
                  value={blocks['home.contact.card2.address'] || ''} 
                  onChange={(e) => handleChange('home.contact.card2.address', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <Input 
                    value={blocks['home.contact.card2.phone'] || ''} 
                    onChange={(e) => handleChange('home.contact.card2.phone', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input 
                    value={blocks['home.contact.card2.email'] || ''} 
                    onChange={(e) => handleChange('home.contact.card2.email', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Website URL</label>
                <Input 
                  value={blocks['home.contact.card2.globe'] || ''} 
                  onChange={(e) => handleChange('home.contact.card2.globe', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Card 3: Student Services */}
        <TabsContent value="card3">
          <Card>
            <CardHeader>
              <CardTitle>Card 3: Student Services</CardTitle>
              <CardDescription>Manage details for the third contact card.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Card Title</label>
                  <Input 
                    value={blocks['home.contact.card3.title'] || ''} 
                    onChange={(e) => handleChange('home.contact.card3.title', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Background Image URL</label>
                  <Input 
                    value={blocks['home.contact.card3.image'] || ''} 
                    onChange={(e) => handleChange('home.contact.card3.image', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description / Address</label>
                <Textarea 
                  value={blocks['home.contact.card3.address'] || ''} 
                  onChange={(e) => handleChange('home.contact.card3.address', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <Input 
                    value={blocks['home.contact.card3.phone'] || ''} 
                    onChange={(e) => handleChange('home.contact.card3.phone', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input 
                    value={blocks['home.contact.card3.email'] || ''} 
                    onChange={(e) => handleChange('home.contact.card3.email', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Website URL</label>
                <Input 
                  value={blocks['home.contact.card3.globe'] || ''} 
                  onChange={(e) => handleChange('home.contact.card3.globe', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
