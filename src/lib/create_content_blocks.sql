-- Create Content Blocks table
create table public.content_blocks (
  id uuid default uuid_generate_v4() primary key,
  key text not null unique, -- e.g., 'home.hero.title'
  content text not null, -- The actual text or HTML content
  type text default 'text', -- 'text', 'image', 'rich-text'
  description text, -- Helper text for the admin to know what this is
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.content_blocks enable row level security;

-- Policies
create policy "Content blocks are viewable by everyone" on public.content_blocks
  for select using (true);

create policy "Only admins can insert content blocks" on public.content_blocks
  for insert with check (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

create policy "Only admins can update content blocks" on public.content_blocks
  for update using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

create policy "Only admins can delete content blocks" on public.content_blocks
  for delete using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

-- Seed initial content
insert into public.content_blocks (key, content, description) values
-- HOME PAGE
('home.hero.title', 'Your Trusted Partner for', 'First part of the main hero title'),
('home.hero.subtitle', 'Studying in China', 'Highlighted part of the main hero title'),
('home.hero.description', 'From application to arrival, your gateway to top universities.', 'Description text in the hero section'),

('home.about.title', 'Unlocking Global', 'First part of About section title'),
('home.about.highlight', 'Opportunities', 'Highlighted part of About section title'),
('home.about.description', 'At Sinoway Education, we don''t just process applications; we architect futures. As a premier consultancy, we specialize in navigating the complex landscape of Chinese higher education for ambitious international students.', 'Main description in About section'),
('home.about.feature1.title', 'Global Network', 'Title of the first feature in About section'),
('home.about.feature1.desc', 'Connecting you with 100+ top-tier universities across China.', 'Description of the first feature'),
('home.about.feature2.title', 'Scholarship Focus', 'Title of the second feature in About section'),
('home.about.feature2.desc', 'Dedicated team securing full and partial funding for 95% of students.', 'Description of the second feature'),
('home.about.cta', 'Discover Our Story', 'Button text in About section'),

('home.stats.1.label', 'Partner Universities', 'Label for first stat'),
('home.stats.1.value', '50+', 'Value for first stat'),
('home.stats.2.label', 'Students Placed', 'Label for second stat'),
('home.stats.2.value', '2,000+', 'Value for second stat'),
('home.stats.3.label', 'Scholarships Awarded', 'Label for third stat'),
('home.stats.3.value', '$5M+', 'Value for third stat'),
('home.stats.4.label', 'Success Rate', 'Label for fourth stat'),
('home.stats.4.value', '98%', 'Value for fourth stat'),

('home.services.title', 'The Sinoway Advantage', 'Title of the Services section'),
('home.services.subtitle', 'Comprehensive support designed for your success.', 'Subtitle of the Services section'),
('home.services.1.title', 'Expert Guidance', 'Title of service 1'),
('home.services.1.desc', 'Our counselors are alumni of Chinese universities, offering firsthand insights.', 'Description of service 1'),
('home.services.2.title', 'Rapid Processing', 'Title of service 2'),
('home.services.2.desc', 'Optimized workflows ensure your application moves faster than standard channels.', 'Description of service 2'),
('home.services.3.title', 'Elite Partnerships', 'Title of service 3'),
('home.services.3.desc', 'Direct lines of communication with admissions offices at prestige institutions.', 'Description of service 3'),

('home.cta.title', 'Your Future Starts Here', 'Title in the bottom CTA section'),
('home.cta.subtitle', 'Join the ranks of successful graduates who transformed their lives through education in China.', 'Subtitle in the bottom CTA section'),

-- ABOUT PAGE
('about.hero.title_prefix', 'Pioneering', 'About page hero title prefix'),
('about.hero.title_highlight', 'Educational Bridges', 'About page hero title highlight'),
('about.hero.title_suffix', 'to China', 'About page hero title suffix'),
('about.hero.description', 'Founded on the belief that education knows no borders, Sinoway Education has evolved from a small consultancy to a leading authority in Sino-international student exchange. We are more than agents; we are mentors, strategists, and your first family in a new land.', 'About page hero description'),
('about.stats.1', '10+ Years Experience', 'About page stat 1'),
('about.stats.2', 'Official University Partners', 'About page stat 2'),
('about.stats.3', '98% Visa Success Rate', 'About page stat 3'),
('about.stats.4', '24/7 Student Support', 'About page stat 4'),
('about.hero.image', '/images/gallery-3.jpg', 'About page hero image URL'),

('about.values.title', 'Core Values Driving Us', 'Values section title'),
('about.values.subtitle', 'The principles that guide every interaction and decision.', 'Values section subtitle'),
('about.values.1.title', 'Integrity First', 'Value 1 title'),
('about.values.1.desc', 'Transparent processes with no hidden fees or false promises.', 'Value 1 description'),
('about.values.2.title', 'Student-Centric', 'Value 2 title'),
('about.values.2.desc', 'Your academic goals and personal well-being are our top priority.', 'Value 2 description'),
('about.values.3.title', 'Excellence', 'Value 3 title'),
('about.values.3.desc', 'We strive for the highest standards in application quality and support.', 'Value 3 description'),

('about.team.title', 'Meet Our Experts', 'Team section title'),
('about.team.desc', 'Our team consists of former admission officers and alumni from China''s top universities.', 'Team section description'),
('about.team.image', '/images/gallery-5.jpg', 'Team section image URL'),

-- CONTACT PAGE
('contact.hero.title', 'Let''s Start Your Journey', 'Contact page title'),
('contact.hero.desc', 'Whether you have questions about a specific program or need guidance on the visa process, our dedicated team is here to assist you.', 'Contact page description'),
('contact.info.visit.title', 'Visit Us', 'Contact info 1 title'),
('contact.info.visit.line1', 'Level 15, China World Tower B', 'Contact info 1 line 1'),
('contact.info.visit.line2', 'Chaoyang District, Beijing, China', 'Contact info 1 line 2'),
('contact.info.email.title', 'Email Us', 'Contact info 2 title'),
('contact.info.email.line1', 'admissions@sinoway.com', 'Contact info 2 line 1'),
('contact.info.email.line2', 'support@sinoway.com', 'Contact info 2 line 2'),
('contact.info.phone.title', 'Call Us', 'Contact info 3 title'),
('contact.info.phone.line1', '+86 123 456 7890', 'Contact info 3 line 1'),
('contact.info.phone.line2', 'Mon-Fri, 9am - 6pm CST', 'Contact info 3 line 2'),
('contact.form.title', 'Send a Message', 'Contact form title'),

-- SERVICES PAGE
('services.hero.title', 'Our Service Portfolio', 'Services page title'),
('services.hero.desc', 'We offer a holistic suite of services designed to handle every aspect of your study abroad journey.', 'Services page description'),
('services.1.title', 'University Admission', 'Service 1 title'),
('services.1.desc', 'Navigate the complex application systems of China''s elite universities with our guided support.', 'Service 1 description'),
('services.2.title', 'Scholarship Management', 'Service 2 title'),
('services.2.desc', 'Unlock financial aid opportunities including CSC, Provincial, and University-specific scholarships.', 'Service 2 description'),
('services.3.title', 'Visa & Immigration', 'Service 3 title'),
('services.3.desc', 'Seamless transition from acceptance letter to student visa (X1/X2) with zero stress.', 'Service 3 description'),
('services.4.title', 'Accommodation & Settlement', 'Service 4 title'),
('services.4.desc', 'Find your home away from home before you even land in China.', 'Service 4 description'),
('services.5.title', 'Arrival & Orientation', 'Service 5 title'),
('services.5.desc', 'A warm welcome to ensure you settle in comfortably and confidently.', 'Service 5 description'),
('services.cta.title', 'Need a Custom Package?', 'Services CTA title'),
('services.cta.desc', 'We understand every student''s situation is unique. Contact us to discuss a tailored service plan that fits your specific needs.', 'Services CTA description'),
('services.cta.button', 'Contact Support', 'Services CTA button'),

-- WHY US PAGE
('whyus.hero.title_prefix', 'Why Choose', 'Why Us page title prefix'),
('whyus.hero.highlight', 'Sinoway?', 'Why Us page title highlight'),
('whyus.hero.desc', 'Choosing an education consultant is as important as choosing a university. Here is what sets us apart in the crowded landscape of study abroad agencies.', 'Why Us page description'),
('whyus.1.title', 'Proven Track Record', 'Reason 1 title'),
('whyus.1.desc', 'With a 98% admission success rate and over $5M in scholarships secured, our results speak for themselves.', 'Reason 1 description'),
('whyus.2.title', 'Personalized Mentorship', 'Reason 2 title'),
('whyus.2.desc', 'We don''t just process papers. We provide 1-on-1 career counseling and academic roadmap planning.', 'Reason 2 description'),
('whyus.3.title', 'Exclusive Partnerships', 'Reason 3 title'),
('whyus.3.desc', 'Direct agreements with 50+ top Chinese universities give our students priority consideration.', 'Reason 3 description'),
('whyus.4.title', 'End-to-End Support', 'Reason 4 title'),
('whyus.4.desc', 'From the first consultation to airport pickup and dormitory settlement, we are with you every step.', 'Reason 4 description'),
('whyus.5.title', 'Transparent Process', 'Reason 5 title'),
('whyus.5.desc', 'No hidden fees, no false promises. We believe in complete honesty and ethical counseling.', 'Reason 5 description'),
('whyus.6.title', 'Local Presence', 'Reason 6 title'),
('whyus.6.desc', 'Our team in China ensures you have on-ground support whenever you face any challenges.', 'Reason 6 description'),
('whyus.cta.title', 'Ready to experience the difference?', 'Why Us CTA title'),
('whyus.cta.desc', 'Let us handle the complexities of your application while you focus on your future.', 'Why Us CTA description'),
('whyus.cta.button', 'Get Free Consultation', 'Why Us CTA button'),

-- PROGRAMS PAGE (Header)
('programs.header.title', 'Academic Programs', 'Programs page header title'),
('programs.header.desc', 'Curated opportunities for international students. Find your perfect match.', 'Programs page header description'),

-- UNIVERSITIES PAGE (Header)
('universities.header.title', 'Partner Universities', 'Universities page header title'),
('universities.header.desc', 'Explore China''s top institutions. We are official representatives for these prestigious universities.', 'Universities page header description'),

-- NEWS PAGE
('news.hero.title', 'Latest News & Updates', 'News page hero title'),
('news.hero.desc', 'Stay informed about scholarships, university updates, and student life in China.', 'News page hero description'),
('news.no_news.title', 'No news yet', 'Title shown when there are no news posts'),
('news.no_news.desc', 'Check back later for the latest updates.', 'Description shown when there are no news posts'),
('news.post.back_button', 'Back to News', 'Back button text on single post page'),

-- HEADER
('header.brand', 'Sinoway Education', 'Brand name in header'),
('header.nav.login', 'Log in', 'Login button text'),
('header.nav.apply', 'Apply Now', 'Apply button text'),

-- FOOTER
('footer.about.title', 'Sinoway Education', 'Footer about section title'),
('footer.about.desc', 'Empowering global students to achieve academic excellence in China through trusted guidance and expert support.', 'Footer about section description'),
('footer.services.title', 'Services', 'Footer services column title'),
('footer.company.title', 'Company', 'Footer company column title'),
('footer.connect.title', 'Connect', 'Footer connect column title'),
('footer.connect.email', 'admission@sinoway.com', 'Footer email address'),
('footer.connect.phone', '+86 123 456 7890', 'Footer phone number'),
('footer.connect.address', 'Beijing, China', 'Footer address'),
('footer.copyright', 'Sinoway Education. All rights reserved.', 'Footer copyright text'),

-- HOME PAGE (Remaining)
('home.gallery.campus.title', 'Campus Life', 'Home gallery campus title'),
('home.gallery.education.title', 'Immersive Education', 'Home gallery education title'),
('home.gallery.education.desc', 'Experience world-class learning facilities.', 'Home gallery education description'),
('home.gallery.community.title', 'Community', 'Home gallery community title'),
('home.cta.button.apply', 'Begin Application', 'Home bottom CTA apply button'),
('home.cta.button.advisor', 'Speak to an Advisor', 'Home bottom CTA advisor button'),

-- PRIVACY PAGE
('privacy.title', 'Privacy Policy', 'Privacy page title'),
('privacy.subtitle', 'Your privacy is important to us. This document outlines how we handle your personal information.', 'Privacy page subtitle'),
('privacy.updated', 'Last Updated: October 24, 2024', 'Privacy page last updated'),
('privacy.1.title', '1. Introduction', 'Privacy section 1 title'),
('privacy.1.text', 'Sinoway Education ("we", "our", or "us") provides educational consultancy services. By using our website and services, you consent to the data practices described in this statement. We are committed to protecting your personal data and ensuring transparency in how we handle it.', 'Privacy section 1 text'),
('privacy.2.title', '2. Data We Collect', 'Privacy section 2 title'),
('privacy.3.title', '3. Usage of Information', 'Privacy section 3 title'),
('privacy.3.text', 'We use the collected data for various purposes:', 'Privacy section 3 text'),
('privacy.4.title', '4. Data Security', 'Privacy section 4 title'),
('privacy.4.text', 'The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.', 'Privacy section 4 text'),
('privacy.contact.title', 'Contact Our Privacy Officer', 'Privacy contact title'),
('privacy.contact.text', 'If you have any questions about this Privacy Policy, please contact us:', 'Privacy contact text'),
('privacy.contact.email', 'privacy@sinoway.com', 'Privacy contact email'),
('privacy.contact.phone', '+86 123 456 7890', 'Privacy contact phone');
