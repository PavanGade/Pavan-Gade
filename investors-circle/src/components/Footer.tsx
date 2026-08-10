import { Globe, Mail, Phone } from "lucide-react";

const socialLinks = [
  { icon: Globe, href: "https://instagram.com", label: "Instagram" },
  { icon: Globe, href: "https://facebook.com", label: "Facebook" },
  { icon: Globe, href: "https://linkedin.com", label: "LinkedIn" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <h3 className="font-serif text-2xl mb-4">
              Investors <span className="gold-gradient-text">Circle</span>
            </h3>
            <p className="text-sm text-white/50 leading-relaxed">
              Exclusive Access. Better Deals. Higher Returns.
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-white/40 mb-4">
              Contact
            </h4>
            <p className="text-sm text-white/60 leading-relaxed">
              WeWork Raheja Mindspace, Survey No. 64, Building 9, 13th Floor,
              Madhapur, Hyderabad, Telangana 500081
            </p>
            <a
              href="tel:+917416436805"
              className="text-sm text-gold-400 hover:text-gold-300 mt-3 inline-flex items-center gap-2"
            >
              <Phone className="w-3.5 h-3.5" />
              +91 7416436805
            </a>
            <a
              href="mailto:hello@investorscircle.in"
              className="text-sm text-white/50 hover:text-white/70 mt-2 inline-flex items-center gap-2"
            >
              <Mail className="w-3.5 h-3.5" />
              hello@investorscircle.in
            </a>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-white/40 mb-4">
              Connect
            </h4>
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="glass-button w-10 h-10 rounded-full flex items-center justify-center text-white/60 hover:text-gold-400"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 text-center text-xs text-white/30">
          © {new Date().getFullYear()} Investors Circle. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
