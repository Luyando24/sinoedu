-- Add homepage contact section content blocks
INSERT INTO public.content_blocks (key, content, description) VALUES
('home.contact.title', 'Sinoway Education', 'Homepage contact section title'),

-- Card 1: Headquarters
('home.contact.card1.title', 'Headquarters', 'Card 1 Title'),
('home.contact.card1.address', 'Room 1201, Building D, Guicheng Garden, Beijing Road, Haicheng District, Beihai City, Guangxi Province, China', 'Card 1 Address'),
('home.contact.card1.phone', '+8613601965441', 'Card 1 Phone'),
('home.contact.card1.email', 'info@sinowayedu.com', 'Card 1 Email'),
('home.contact.card1.fb', 'https://www.facebook.com/share/1DPPMYfmyZ/', 'Card 1 Facebook URL'),
('home.contact.card1.vk', 'VK', 'Card 1 VK text/link'),
('home.contact.card1.ig', 'https://www.instagram.com/sinowayedu/?utm_source=qr&igsh=MXR4cGs5emdxNGxweg%3D%3D', 'Card 1 Instagram URL'),
('home.contact.card1.yt', 'https://youtube.com/@sinowayedu?si=HB8B_8LLfJs1OO26', 'Card 1 Youtube URL'),
('home.contact.card1.tt', 'https://www.tiktok.com/@sinowayedu?is_from_webapp=1&sender_device=pc', 'Card 1 TikTok URL'),
('home.contact.card1.xhs', 'https://www.xiaohongshu.com/user/profile/612b3765000000000101fdd4?xhsshare=userQrCode', 'Card 1 Xiaohongshu URL'),
('home.contact.card1.image', '/images/gallery-1.jpg', 'Card 1 Background Image'),

-- Card 2: International Support
('home.contact.card2.title', 'International Support', 'Card 2 Title'),
('home.contact.card2.address', 'Online Support Center, Available Globally', 'Card 2 Address'),
('home.contact.card2.phone', '+8613601965441', 'Card 2 Phone'),
('home.contact.card2.email', 'info@sinowayedu.com', 'Card 2 Email'),
('home.contact.card2.globe', 'www.sinoway.com', 'Card 2 Website URL'),
('home.contact.card2.image', '/images/gallery-2.jpg', 'Card 2 Background Image'),

-- Card 3: Student Services
('home.contact.card3.title', 'Student Services', 'Card 3 Title'),
('home.contact.card3.address', 'Global Student Center', 'Card 3 Address'),
('home.contact.card3.phone', '+8613601965441', 'Card 3 Phone'),
('home.contact.card3.email', 'info@sinowayedu.com', 'Card 3 Email'),
('home.contact.card3.globe', 'www.sinoway.com/services', 'Card 3 Website URL'),
('home.contact.card3.image', '/images/gallery-3.jpg', 'Card 3 Background Image')
ON CONFLICT (key) DO UPDATE SET 
  content = EXCLUDED.content,
  description = EXCLUDED.description;
