"use client"

import { useState } from "react"
import { HeroSectionCard } from "@/components/homepage/editable-cards/hero-section-card"
import { AboutUsCard } from "@/components/homepage/editable-cards/about-us-card"
import { ContactUsCard } from "@/components/homepage/editable-cards/contact-us-card"
import { FAQCard } from "@/components/homepage/editable-cards/faq-card"
import { OurServicesCard } from "@/components/homepage/editable-cards/our-services-card"
import { OurTeamCard } from "@/components/homepage/editable-cards/our-team-card"
import { AmenitiesCard } from "@/components/homepage/editable-cards/amenities-card"

// Define interfaces for all our data structures
interface HeroDetail {
  title: string;
  description: string;
  image: string;
  buttonText: string;
  buttonLink: string;
}

interface HeroSectionData {
  clientId: string;
  details: HeroDetail[];
}

interface AboutPoint {
  title: string;
  description: string;
}

interface AboutUsData {
  clientId: string;
  subTitle: string;
  description: string;
  image: string;
  points: AboutPoint[];
}

interface ContactUsData {
  subTitle: string;
  address: string;
  phone1: string;
  phone2: string;
  email1: string;
  email2: string;
  mapLink: string;
}

interface FAQItem {
  title: string;
  description: string;
}

interface FAQData {
  clientId: string;
  subTitle: string;
  FAQs: FAQItem[];
}

interface Service {
  icon: string;
  title: string;
  description: string;
}

interface OurServicesData {
  clientId: string;
  subTitle: string;
  services: Service[];
}

interface TeamMember {
  name: string;
  position: string;
  image: string;
}

interface OurTeamData {
  clientId: string;
  subTitle: string;
  teamMembers: TeamMember[];
}

interface Amenity {
  name: string;
  icon: string;
}

interface AmenitiesData {
  clientId: string;
  subTitle: string;
  amenities: Amenity[];
}

export default function Home() {
  // Example data for demonstration
  const [heroSection, setHeroSection] = useState<HeroSectionData>({
    clientId: "client123",
    details: [
      {
        title: "Discover Your Dream Home",
        description: "Luxury Properties in Prime Locations",
        image: "/placeholder.svg?height=600&width=1200",
        buttonText: "Explore Now",
        buttonLink: "#projects",
      },
    ],
  })

  const [aboutUs, setAboutUs] = useState<AboutUsData>({
    clientId: "client123",
    subTitle: "About Our ",
    description: "We are a leading real estate  with years of experience in the industry.",
    image: "/placeholder.svg?height=600&width=800",
    points: [
      {
        title: "Quality Service",
        description: "We provide top-notch service to all our clients.",
      },
    ],
  })

  const [contactUs, setContactUs] = useState<ContactUsData>({
    subTitle: "Get in Touch",
    address: "123 Real Estate Ave, City, State 12345",
    phone1: "+1 (555) 123-4567",
    phone2: "",
    email1: "info@realestate.com",
    email2: "",
    mapLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.7462606519114!2d-122.41941548439737!3d37.77492977975903!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085809c6c8f4459%3A0xb10ed6d9b5050fa5!2sTwitter!5e0!3m2!1sen!2sus!4v1626209282576!5m2!1sen!2sus",
  })

  const [faq, setFAQ] = useState<FAQData>({
    clientId: "client123",
    subTitle: "Frequently Asked Questions",
    FAQs: [
      {
        title: "How do I schedule a viewing?",
        description: "You can schedule a viewing by contacting our office or using the online booking form.",
      },
    ],
  })

  const [ourServices, setOurServices] = useState<OurServicesData>({
    clientId: "client123",
    subTitle: "What We Offer",
    services: [
      {
        icon: "Home",
        title: "Property Management",
        description: "We offer comprehensive property management services for residential and commercial properties.",
      },
      {
        icon: "Key",
        title: "Real Estate Sales",
        description: "Our experienced agents help you find the perfect property or sell your existing one.",
      },
      {
        icon: "FileText",
        title: "Legal Consultation",
        description: "Get expert legal advice on all aspects of real estate transactions and contracts.",
      },
    ],
  })

  const [ourTeam, setOurTeam] = useState<OurTeamData>({
    clientId: "client123",
    subTitle: "Meet Our Team",
    teamMembers: [
      {
        name: "John Doe",
        position: "CEO",
        image: "/placeholder.svg?height=400&width=400",
      },
    ],
  })

  const [amenities, setAmenities] = useState<AmenitiesData>({
    clientId: "client123",
    subTitle: "Property Amenities",
    amenities: [
      {
        name: "Wi-Fi",
        icon: "Wifi",
      },
      {
        name: "Parking",
        icon: "Car",
      },
      {
        name: "Swimming Pool",
        icon: "Bath",
      },
    ],
  })

  // Save handlers
  const handleSaveHeroSection = (data: HeroSectionData) => {
    console.log("Saving Hero Section:", data)
    setHeroSection(data)
    // Here you would typically make an API call to save the data
  }

  const handleSaveAboutUs = (data: AboutUsData) => {
    console.log("Saving About Us:", data)
    setAboutUs(data)
  }

  const handleSaveContactUs = (data: ContactUsData) => {
    console.log("Saving Contact Us:", data)
    setContactUs(data)
  }

  const handleSaveFAQ = (data: FAQData) => {
    console.log("Saving FAQ:", data)
    setFAQ(data)
  }

  const handleSaveOurServices = (data: OurServicesData) => {
    console.log("Saving Our Services:", data)
    setOurServices(data)
  }

  const handleSaveOurTeam = (data: OurTeamData) => {
    console.log("Saving Our Team:", data)
    setOurTeam(data)
  }

  const handleSaveAmenities = (data: AmenitiesData) => {
    console.log("Saving Amenities:", data)
    setAmenities(data)
  }

  return (
    <main className="container mx-auto p-4 py-8">
      <h1 className="mb-8 text-center text-3xl font-bold">Website Content Management</h1>

      <div className="grid gap-8">
        <HeroSectionCard clientId={heroSection.clientId} details={heroSection.details} onSave={handleSaveHeroSection} />

        <AboutUsCard
          clientId={aboutUs.clientId}
          subTitle={aboutUs.subTitle}
          description={aboutUs.description}
          image={aboutUs.image}
          points={aboutUs.points}
          onSave={handleSaveAboutUs}
        />

        <OurServicesCard
          clientId={ourServices.clientId}
          subTitle={ourServices.subTitle}
          services={ourServices.services}
          onSave={handleSaveOurServices}
        />

        <AmenitiesCard
          clientId={amenities.clientId}
          subTitle={amenities.subTitle}
          amenities={amenities.amenities}
          onSave={handleSaveAmenities}
        />

        <OurTeamCard
          clientId={ourTeam.clientId}
          subTitle={ourTeam.subTitle}
          teamMembers={ourTeam.teamMembers}
          onSave={handleSaveOurTeam}
        />

        <FAQCard clientId={faq.clientId} subTitle={faq.subTitle} FAQs={faq.FAQs} onSave={handleSaveFAQ} />

        <ContactUsCard
          subTitle={contactUs.subTitle}
          address={contactUs.address}
          phone1={contactUs.phone1}
          phone2={contactUs.phone2}
          email1={contactUs.email1}
          email2={contactUs.email2}
          mapLink={contactUs.mapLink}
          onSave={handleSaveContactUs}
        />
      </div>
    </main>
  )
}