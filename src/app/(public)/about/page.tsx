export default function AboutPage() {
  return (
    <div className="container py-16 space-y-16">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">About Us</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          We are dedicated to connecting ambitious students with the best educational opportunities in China.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Our Mission</h2>
          <p className="text-muted-foreground">
            Our mission is to simplify the complex process of applying to Chinese universities. We believe that quality education should be accessible to everyone, regardless of their background.
          </p>
        </div>
        <div className="space-y-6">
           <h2 className="text-2xl font-bold">Our Vision</h2>
           <p className="text-muted-foreground">
             To be the world&apos;s most trusted agency for education in China, recognized for our integrity, professionalism, and high success rates.
           </p>
        </div>
      </div>
    </div>
  )
}
