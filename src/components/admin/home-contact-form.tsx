"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { Loader2, Save, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react"

interface Location {
  id: string
  title: string
  address: string
  phone: string
  email: string
  image: string
  globe?: string
  socials?: {
    fb?: string
    ig?: string
    vk?: string
    yt?: string
    tt?: string
    xhs?: string
  }
}

export function HomeContactForm() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [blocks, setBlocks] = useState<Record<string, string>>({})
  const [locations, setLocations] = useState<Location[]>([])
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0)
  const supabase = createClient()

  const keys = useMemo(() => [
    'home.contact.title',
    'home.programs.title',
    'home.scholarships.title',
    'home.universities.title',
    'home.short_term.title',
    'home.contact.locations', // New key for dynamic locations
    // Keep old keys for initial migration/fallback
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
  ], [])

  const fetchContent = useCallback(async () => {
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

      // Parse locations if they exist
      if (blockMap['home.contact.locations']) {
        try {
          setLocations(JSON.parse(blockMap['home.contact.locations']))
        } catch (e) {
          console.error("Error parsing locations JSON:", e)
          setLocations([])
        }
      } else if (blockMap['home.contact.card1.title']) {
        // Initial migration from old keys
        const initialLocations: Location[] = [
          {
            id: '1',
            title: blockMap['home.contact.card1.title'] || 'Headquarters',
            address: blockMap['home.contact.card1.address'] || '',
            phone: blockMap['home.contact.card1.phone'] || '',
            email: blockMap['home.contact.card1.email'] || '',
            image: blockMap['home.contact.card1.image'] || '/images/gallery-1.jpg',
            socials: {
              fb: blockMap['home.contact.card1.fb'] || '',
              vk: blockMap['home.contact.card1.vk'] || '',
              ig: blockMap['home.contact.card1.ig'] || '',
              yt: blockMap['home.contact.card1.yt'] || '',
              tt: blockMap['home.contact.card1.tt'] || '',
              xhs: blockMap['home.contact.card1.xhs'] || '',
            }
          },
          {
            id: '2',
            title: blockMap['home.contact.card2.title'] || 'International Support',
            address: blockMap['home.contact.card2.address'] || '',
            phone: blockMap['home.contact.card2.phone'] || '',
            email: blockMap['home.contact.card2.email'] || '',
            image: blockMap['home.contact.card2.image'] || '/images/gallery-2.jpg',
            globe: blockMap['home.contact.card2.globe'] || ''
          },
          {
            id: '3',
            title: blockMap['home.contact.card3.title'] || 'Student Services',
            address: blockMap['home.contact.card3.address'] || '',
            phone: blockMap['home.contact.card3.phone'] || '',
            email: blockMap['home.contact.card3.email'] || '',
            image: blockMap['home.contact.card3.image'] || '/images/gallery-3.jpg',
            globe: blockMap['home.contact.card3.globe'] || ''
          }
        ]
        setLocations(initialLocations)
      }
    } catch (error) {
      console.error("Error fetching content:", error)
      toast.error("Failed to load content")
    } finally {
      setLoading(false)
    }
  }, [supabase, keys])

  useEffect(() => {
    fetchContent()
  }, [fetchContent])

  const handleChange = (key: string, value: string) => {
    setBlocks(prev => ({ ...prev, [key]: value }))
  }

  const handleLocationChange = (index: number, field: keyof Location, value: any) => {
    const newLocations = [...locations]
    newLocations[index] = { ...newLocations[index], [field]: value }
    setLocations(newLocations)
  }

  const handleSocialChange = (index: number, socialField: string, value: string) => {
    const newLocations = [...locations]
    const currentSocials = newLocations[index].socials || {}
    newLocations[index] = { 
      ...newLocations[index], 
      socials: { ...currentSocials, [socialField]: value } 
    }
    setLocations(newLocations)
  }

  const addLocation = () => {
    const newLocation: Location = {
      id: crypto.randomUUID(),
      title: 'New Location',
      address: '',
      phone: '',
      email: '',
      image: '/images/gallery-1.jpg'
    }
    setLocations([...locations, newLocation])
    setExpandedIndex(locations.length)
  }

  const removeLocation = (index: number) => {
    const newLocations = locations.filter((_, i) => i !== index)
    setLocations(newLocations)
    if (expandedIndex === index) setExpandedIndex(null)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // 1. Prepare general settings updates
      const generalKeys = [
        'home.contact.title',
        'home.programs.title',
        'home.scholarships.title',
        'home.universities.title',
        'home.short_term.title',
      ]
      
      const updates = generalKeys.map(key => ({
        key,
        content: blocks[key] || '',
        description: `Homepage section title: ${key}`
      }))

      // 2. Add locations JSON update
      updates.push({
        key: 'home.contact.locations',
        content: JSON.stringify(locations),
        description: 'Homepage contact locations (JSON array)'
      })

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
          <p className="text-muted-foreground">Manage office locations and section titles.</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Changes
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Section Titles</CardTitle>
          <CardDescription>Main titles for homepage sections</CardDescription>
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

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Office Locations</h2>
          <Button variant="outline" size="sm" onClick={addLocation}>
            <Plus className="mr-2 h-4 w-4" />
            Add Location
          </Button>
        </div>

        {locations.map((location, index) => (
          <Card key={location.id} className="overflow-hidden">
            <div 
              className="p-4 flex items-center justify-between cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors"
              onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
            >
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <span className="font-medium">{location.title || 'Untitled Location'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeLocation(index)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                {expandedIndex === index ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </div>

            {expandedIndex === index && (
              <CardContent className="p-6 space-y-4 border-t">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Location Name</label>
                    <Input 
                      value={location.title} 
                      onChange={(e) => handleLocationChange(index, 'title', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Background Image URL</label>
                    <Input 
                      value={location.image} 
                      onChange={(e) => handleLocationChange(index, 'image', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Address / Description</label>
                  <Textarea 
                    value={location.address} 
                    onChange={(e) => handleLocationChange(index, 'address', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <Input 
                      value={location.phone} 
                      onChange={(e) => handleLocationChange(index, 'phone', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input 
                      value={location.email} 
                      onChange={(e) => handleLocationChange(index, 'email', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Website URL (Optional)</label>
                  <Input 
                    value={location.globe || ''} 
                    onChange={(e) => handleLocationChange(index, 'globe', e.target.value)}
                    placeholder="https://..."
                  />
                </div>

                <div className="pt-4 border-t">
                  <h4 className="text-sm font-bold mb-4">Social Media Links (Optional)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Facebook</label>
                      <Input 
                        value={location.socials?.fb || ''} 
                        onChange={(e) => handleSocialChange(index, 'fb', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Instagram</label>
                      <Input 
                        value={location.socials?.ig || ''} 
                        onChange={(e) => handleSocialChange(index, 'ig', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">VK</label>
                      <Input 
                        value={location.socials?.vk || ''} 
                        onChange={(e) => handleSocialChange(index, 'vk', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Youtube</label>
                      <Input 
                        value={location.socials?.yt || ''} 
                        onChange={(e) => handleSocialChange(index, 'yt', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">TikTok</label>
                      <Input 
                        value={location.socials?.tt || ''} 
                        onChange={(e) => handleSocialChange(index, 'tt', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Xiaohongshu</label>
                      <Input 
                        value={location.socials?.xhs || ''} 
                        onChange={(e) => handleSocialChange(index, 'xhs', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}

        {locations.length === 0 && (
          <div className="text-center p-12 border-2 border-dashed rounded-lg text-muted-foreground">
            No locations added yet. Click "Add Location" to start.
          </div>
        )}
      </div>
    </div>
  )
}
