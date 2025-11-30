import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    jobTitle: "",
    companySize: "",
    industry: "",
    subject: "",
    message: "",
    budget: "",
    timeline: "",
    interests: [] as string[],
    hearAboutUs: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement & HTMLSelectElement;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      interests: checked
        ? [...prev.interests, name]
        : prev.interests.filter((item) => item !== name),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to send message");

      setIsSuccess(true);
      setFormData({ name: "", email: "", phone: "", company: "", jobTitle: "", companySize: "", industry: "", subject: "", message: "", budget: "", timeline: "", interests: [], hearAboutUs: "" });
      toast.success("Message sent! We'll get back to you soon.");

      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation */}
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">AuditProp</span>
          </div>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost">Back Home</Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 border-b bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Contact Us</h1>
              <p className="text-xl text-muted-foreground">
                Have a question or need help? Send us a message and our team will respond as soon as possible.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Send us a message</CardTitle>
                </CardHeader>
                <CardContent>
                  {isSuccess ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <CheckCircle2 className="h-16 w-16 text-emerald-500 mb-4" />
                      <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                      <p className="text-muted-foreground mb-6">
                        Thank you for reaching out. Our team will get back to you shortly.
                      </p>
                      <Button variant="outline" onClick={() => setIsSuccess(false)}>
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Personal Info Section */}
                      <div className="border-b pb-6">
                        <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="name" className="block text-sm font-medium mb-2">
                              Full Name *
                            </label>
                            <Input
                              id="name"
                              name="name"
                              type="text"
                              required
                              value={formData.name}
                              onChange={handleChange}
                              placeholder="Your name"
                              data-testid="input-name"
                            />
                          </div>

                          <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-2">
                              Email Address *
                            </label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              required
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="your.email@example.com"
                              data-testid="input-email"
                            />
                          </div>

                          <div>
                            <label htmlFor="phone" className="block text-sm font-medium mb-2">
                              Phone Number
                            </label>
                            <Input
                              id="phone"
                              name="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={handleChange}
                              placeholder="+1 (555) 123-4567"
                              data-testid="input-phone"
                            />
                          </div>

                          <div>
                            <label htmlFor="jobTitle" className="block text-sm font-medium mb-2">
                              Job Title
                            </label>
                            <Input
                              id="jobTitle"
                              name="jobTitle"
                              type="text"
                              value={formData.jobTitle}
                              onChange={handleChange}
                              placeholder="e.g., Property Manager, CEO"
                              data-testid="input-jobTitle"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Company Info Section */}
                      <div className="border-b pb-6">
                        <h3 className="text-lg font-semibold mb-4">Company Information</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="company" className="block text-sm font-medium mb-2">
                              Company Name
                            </label>
                            <Input
                              id="company"
                              name="company"
                              type="text"
                              value={formData.company}
                              onChange={handleChange}
                              placeholder="Your company name"
                              data-testid="input-company"
                            />
                          </div>

                          <div>
                            <label htmlFor="industry" className="block text-sm font-medium mb-2">
                              Industry
                            </label>
                            <select
                              id="industry"
                              name="industry"
                              value={formData.industry}
                              onChange={handleChange}
                              data-testid="select-industry"
                              className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                            >
                              <option value="">Select an industry</option>
                              <option value="real-estate">Real Estate</option>
                              <option value="banking">Banking & Finance</option>
                              <option value="legal">Legal Services</option>
                              <option value="government">Government</option>
                              <option value="insurance">Insurance</option>
                              <option value="investment">Investment</option>
                              <option value="consulting">Consulting</option>
                              <option value="other">Other</option>
                            </select>
                          </div>

                          <div>
                            <label htmlFor="companySize" className="block text-sm font-medium mb-2">
                              Company Size
                            </label>
                            <select
                              id="companySize"
                              name="companySize"
                              value={formData.companySize}
                              onChange={handleChange}
                              data-testid="select-companySize"
                              className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                            >
                              <option value="">Select company size</option>
                              <option value="1-10">1-10 employees</option>
                              <option value="11-50">11-50 employees</option>
                              <option value="51-200">51-200 employees</option>
                              <option value="201-500">201-500 employees</option>
                              <option value="501-1000">501-1000 employees</option>
                              <option value="1000+">1000+ employees</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Interest & Budget Section */}
                      <div className="border-b pb-6">
                        <h3 className="text-lg font-semibold mb-4">Project Details</h3>
                        
                        <div className="mb-4">
                          <label className="block text-sm font-medium mb-3">
                            What are you interested in?
                          </label>
                          <div className="grid md:grid-cols-2 gap-3">
                            {["Online Research Credits", "Deep Search Credits", "NRI Suites Credits", "Bulk Packages", "Custom Solutions", "Other Inquiries"].map((interest) => (
                              <label key={interest} className="flex items-center gap-2 cursor-pointer">
                                <Checkbox
                                  name={interest}
                                  checked={formData.interests.includes(interest)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setFormData((prev) => ({
                                        ...prev,
                                        interests: [...prev.interests, interest],
                                      }));
                                    } else {
                                      setFormData((prev) => ({
                                        ...prev,
                                        interests: prev.interests.filter((item) => item !== interest),
                                      }));
                                    }
                                  }}
                                  data-testid={`checkbox-interest-${interest}`}
                                />
                                <span className="text-sm">{interest}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="budget" className="block text-sm font-medium mb-2">
                              Budget Range
                            </label>
                            <select
                              id="budget"
                              name="budget"
                              value={formData.budget}
                              onChange={handleChange}
                              data-testid="select-budget"
                              className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                            >
                              <option value="">Select budget range</option>
                              <option value="under-10k">Under $10,000</option>
                              <option value="10k-50k">$10,000 - $50,000</option>
                              <option value="50k-100k">$50,000 - $100,000</option>
                              <option value="100k-500k">$100,000 - $500,000</option>
                              <option value="500k+">$500,000+</option>
                              <option value="not-sure">Not sure yet</option>
                            </select>
                          </div>

                          <div>
                            <label htmlFor="timeline" className="block text-sm font-medium mb-2">
                              Project Timeline
                            </label>
                            <select
                              id="timeline"
                              name="timeline"
                              value={formData.timeline}
                              onChange={handleChange}
                              data-testid="select-timeline"
                              className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                            >
                              <option value="">Select timeline</option>
                              <option value="immediate">Immediate (This week)</option>
                              <option value="1-month">Within 1 month</option>
                              <option value="3-months">Within 3 months</option>
                              <option value="6-months">Within 6 months</option>
                              <option value="exploring">Still exploring options</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Message Section */}
                      <div className="border-b pb-6">
                        <h3 className="text-lg font-semibold mb-4">Your Message</h3>
                        
                        <div className="mb-4">
                          <label htmlFor="subject" className="block text-sm font-medium mb-2">
                            Subject *
                          </label>
                          <Input
                            id="subject"
                            name="subject"
                            type="text"
                            required
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="What is this about?"
                            data-testid="input-subject"
                          />
                        </div>

                        <div>
                          <label htmlFor="message" className="block text-sm font-medium mb-2">
                            Message *
                          </label>
                          <textarea
                            id="message"
                            name="message"
                            required
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Tell us about your needs, specific properties, or any concerns..."
                            rows={6}
                            data-testid="textarea-message"
                            className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          />
                        </div>
                      </div>

                      {/* How Did You Hear About Us */}
                      <div>
                        <label htmlFor="hearAboutUs" className="block text-sm font-medium mb-2">
                          How did you hear about us?
                        </label>
                        <select
                          id="hearAboutUs"
                          name="hearAboutUs"
                          value={formData.hearAboutUs}
                          onChange={handleChange}
                          data-testid="select-hearAboutUs"
                          className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                        >
                          <option value="">Select an option</option>
                          <option value="search-engine">Search Engine</option>
                          <option value="social-media">Social Media</option>
                          <option value="referral">Referral</option>
                          <option value="industry-event">Industry Event</option>
                          <option value="news-article">News Article</option>
                          <option value="advertisement">Advertisement</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full"
                        data-testid="button-submit-contact"
                      >
                        {isLoading ? "Sending..." : "Send Message"}
                        {!isLoading && <Send className="ml-2 h-4 w-4" />}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>

              {/* Info Cards */}
              <div className="grid md:grid-cols-3 gap-6 mt-12">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary mb-2">24/7</div>
                      <p className="text-sm text-muted-foreground">
                        We monitor messages around the clock
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary mb-2">&lt;24h</div>
                      <p className="text-sm text-muted-foreground">
                        Typical response time for inquiries
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary mb-2">Expert</div>
                      <p className="text-sm text-muted-foreground">
                        Dedicated support team ready to help
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-12 bg-card">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 AuditProp Technologies. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
