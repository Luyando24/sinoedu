import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  MapPin, 
  CalendarDays, 
  Clock, 
  ArrowLeft,
  DollarSign,
  Languages,
  BookOpen,
  FileText,
  Building2,
  CheckCircle2,
  AlertCircle,
  Pencil,
  Trophy
} from "lucide-react";

export const dynamic = 'force-dynamic';

interface AccommodationCosts {
  single?: string;
  double?: string;
  [key: string]: string | undefined;
}

export default async function ProgramDetailsPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  
  // Check if user is admin
  const { data: { user } } = await supabase.auth.getUser();
  let isAdmin = false;
  if (user) {
    const { data: role } = await supabase.rpc('get_my_role');
    isAdmin = role === 'admin';
  }

  // Fetch program with university
  const { data: program } = await supabase
    .from('programs')
    .select('*, universities(*)')
    .eq('id', params.id)
    .single();

  if (!program) notFound();

  // Handle University Name Privacy
  const universityName = isAdmin 
    ? program.universities?.name 
    : `Partner University in ${program.universities?.location || program.location || 'China'}`;

  const universityLocation = program.universities?.location || program.location || "China";
  const accommodationCosts = program.accommodation_costs as unknown as AccommodationCosts;

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="container space-y-8">
        {/* Navigation & Admin Controls */}
        <div className="flex items-center justify-between">
          <Link href={`/universities/${program.university_id}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to University
            </Button>
          </Link>
          
          {isAdmin && (
            <Link href={`/admin/programs/${program.id}`}>
              <Button variant="outline" size="sm">
                <Pencil className="mr-2 h-4 w-4" /> Edit Program
              </Button>
            </Link>
          )}
        </div>

        {/* Hero Section */}
        <div className="bg-white rounded-2xl p-8 border shadow-sm">
          <div className="flex flex-col lg:flex-row gap-8">
            {program.cover_image && (
              <div className="w-full lg:w-[400px] h-[300px] relative shrink-0 rounded-xl overflow-hidden bg-slate-100">
                <Image 
                  src={program.cover_image} 
                  alt={program.title} 
                  fill 
                  className="object-cover"
                  priority
                />
              </div>
            )}
            <div className="flex-1 flex flex-col md:flex-row gap-8 justify-between">
              <div className="space-y-4 max-w-3xl">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="default" className="bg-[#0056b3] hover:bg-[#0056b3]/90">
                    {program.level}
                  </Badge>
                  {program.language && (
                    <Badge variant="secondary">
                      <Languages className="mr-1 h-3 w-3" /> {program.language} Taught
                    </Badge>
                  )}
                </div>
                
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[#0056b3]">
                  {program.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground text-lg">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    <span className="font-medium text-foreground">{universityName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span>{universityLocation}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 min-w-[200px]">
              <Link href="/contact" className="w-full">
                <Button size="lg" className="w-full text-lg">Apply Now</Button>
              </Link>
              <p className="text-xs text-center text-muted-foreground">
                Deadline: {program.application_deadline || "Rolling Admission"}
              </p>
            </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Key Details Grid */}
          <Card>
            <CardHeader>
              <CardTitle>Program Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Duration</p>
                    <p className="font-semibold">{program.duration || "Contact us"}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tuition Fee</p>
                    <p className="font-semibold">{program.tuition_fee || "Contact us"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                    <CalendarDays className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Intake</p>
                    <p className="font-semibold">{program.intake || "September"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Deadline</p>
                    <p className="font-semibold">{program.application_deadline || "Open"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-brand-gold" />
              About the Program
            </h2>
            <Card>
              <CardContent className="pt-6 leading-relaxed text-muted-foreground">
                {program.description || "No description available for this program."}
              </CardContent>
            </Card>
          </div>

          {/* Accommodation */}
          {(program.accommodation_details || (program.dormitory_photos && program.dormitory_photos.length > 0)) && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Building2 className="h-6 w-6 text-brand-blue" />
                Accommodation
              </h2>
              <Card>
                <CardContent className="pt-6 space-y-6">
                  {program.accommodation_details && (
                    <div>
                        <h3 className="font-semibold mb-2">Details</h3>
                        <p className="text-muted-foreground leading-relaxed">{program.accommodation_details}</p>
                    </div>
                  )}
                  
                  {program.off_campus_living && (
                     <div className="flex items-center gap-2">
                        <span className="font-semibold">Off-Campus Living:</span>
                        <span className={program.off_campus_living === 'Allowed' ? "text-green-600" : "text-red-600"}>
                            {program.off_campus_living}
                        </span>
                     </div>
                  )}

                  {program.dormitory_photos && program.dormitory_photos.length > 0 && (
                    <div>
                        <h3 className="font-semibold mb-4">Dormitory Gallery</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {program.dormitory_photos.map((photo: string, index: number) => (
                                <div key={index} className="relative aspect-video rounded-lg overflow-hidden bg-slate-100 border group">
                                    <Image
                                        src={photo}
                                        alt={`Dormitory ${index + 1}`}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Entry Requirements */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-brand-blue" />
              Entry Requirements
            </h2>
            <Card>
              <CardContent className="pt-6 space-y-4">
                {program.requirements && (
                   <div>
                     <h3 className="font-semibold mb-2">General Requirements</h3>
                     <p className="text-muted-foreground">{program.requirements}</p>
                   </div>
                )}
                
                {program.academic_requirements && Array.isArray(program.academic_requirements) && program.academic_requirements.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Academic Requirements</h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {program.academic_requirements.map((req: string, i: number) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {program.language_requirements && (
                   <div>
                     <h3 className="font-semibold mb-2">Language Requirements</h3>
                     <p className="text-muted-foreground">{program.language_requirements}</p>
                   </div>
                )}

                {program.age_requirements && (
                   <div>
                     <h3 className="font-semibold mb-2">Age Limit</h3>
                     <p className="text-muted-foreground">{program.age_requirements}</p>
                   </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Required Documents */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FileText className="h-6 w-6 text-brand-red" />
              Required Documents
            </h2>
            <Card>
              <CardContent className="pt-6">
                {program.required_documents && Array.isArray(program.required_documents) && program.required_documents.length > 0 ? (
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {program.required_documents.map((doc: string, i: number) => (
                      <li key={i} className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">Please contact us for the list of required documents.</p>
                )}
              </CardContent>
            </Card>
          </div>

        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Scholarship Info */}
          {(program.scholarship_details) && (
            <Card className="bg-gradient-to-br from-brand-gold/10 to-transparent border-brand-gold/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-brand-gold-dark">
                  <Trophy className="h-5 w-5" />
                  Scholarship Available
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p>{program.scholarship_details}</p>
              </CardContent>
            </Card>
          )}

          {/* Cost Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Fees & Costs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Tuition Fee</span>
                <span className="font-medium">{program.tuition_fee || "N/A"}</span>
              </div>
              {program.registration_fee && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Registration Fee</span>
                  <span className="font-medium">{program.registration_fee}</span>
                </div>
              )}
              {accommodationCosts && (
                 <div className="space-y-2 pt-2">
                    <span className="text-muted-foreground block">Accommodation</span>
                    {accommodationCosts.single && (
                        <div className="flex justify-between pl-2">
                            <span>Single Room</span>
                            <span className="font-medium">{accommodationCosts.single}</span>
                        </div>
                    )}
                    {accommodationCosts.double && (
                        <div className="flex justify-between pl-2">
                            <span>Double Room</span>
                            <span className="font-medium">{accommodationCosts.double}</span>
                        </div>
                    )}
                 </div>
              )}
            </CardContent>
          </Card>

          {/* Need Help */}
          <Card className="bg-brand-blue text-white border-none">
            <CardHeader>
              <CardTitle className="text-white">Need Guidance?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-white/90 text-sm">
                Our counselors can help you check your eligibility and guide you through the application process.
              </p>
              <Link href="/contact" className="block w-full">
                <Button variant="secondary" className="w-full">
                  Contact Us
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </div>
  );
}
