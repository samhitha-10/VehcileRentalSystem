import React from 'react';
import { 
  BookOpen, Code2, Layers, Database, ShieldCheck, CheckCircle2, 
  Workflow, Cpu, Sparkles, Terminal, FileCode2
} from 'lucide-react';

interface ProjectDocsModalProps {
  onClose: () => void;
}

export const ProjectDocsModal: React.FC<ProjectDocsModalProps> = ({ onClose }) => {
  return (
    <div className="max-w-5xl mx-auto py-4">
      
      {/* Subject Header */}
      <div className="bg-neutral-900 text-white rounded-2xl p-6 sm:p-8 mb-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-xs font-semibold text-neutral-300 mb-3">
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span>Subject: Web Technologies (Academic Laboratory Project)</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
          Vehicle Rental Management System — Technical Specification
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-3xl">
          Comprehensive full-featured web application designed to demonstrate essential concepts of modern web engineering:
          semantic markup, responsive styling, asynchronous state pipelines, dynamic DOM rendering, client-side persistence, and administrative controls.
        </p>
      </div>

      {/* Grid of Key Technical Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        
        {/* Module 1: HTML5 & Semantics */}
        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center mb-3">
            <FileCode2 className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-neutral-900 mb-1">1. HTML5 & Semantic UI</h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Utilizes semantic elements (<code className="text-indigo-600 font-mono">&lt;header&gt;</code>, <code className="text-indigo-600 font-mono">&lt;nav&gt;</code>, <code className="text-indigo-600 font-mono">&lt;main&gt;</code>, <code className="text-indigo-600 font-mono">&lt;form&gt;</code>) with accessibility guidelines, native date pickers, range sliders, and custom IDs for document navigation.
          </p>
        </div>

        {/* Module 2: Tailwind CSS Responsive System */}
        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs">
          <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center mb-3">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-neutral-900 mb-1">2. Responsive CSS Grid & Flex</h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Mobile-first responsive layout matching mobile, tablet, desktop, and ultra-wide viewports. Clean typography hierarchy, subtle border dividers, and print-specific CSS rules (<code className="text-sky-600 font-mono">@media print</code>) for voucher receipts.
          </p>
        </div>

        {/* Module 3: React 19 & Component Architecture */}
        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
            <Code2 className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-neutral-900 mb-1">3. React 19 & TypeScript</h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Strict TypeScript type declarations (<code className="text-emerald-600 font-mono">Vehicle</code>, <code className="text-emerald-600 font-mono">Booking</code>, <code className="text-emerald-600 font-mono">InsurancePlan</code>) preventing runtime type errors, props drilling prevention, and efficient state isolation.
          </p>
        </div>

        {/* Module 4: Client Storage & Persistence */}
        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs">
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-neutral-900 mb-1">4. Persistent LocalStorage</h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Demonstrates durable browser-level persistence. New vehicle additions, status changes (Available ↔ Rented), and customer reservations persist across tab refreshes and browser sessions seamlessly.
          </p>
        </div>

        {/* Module 5: Client-Side Validation */}
        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs">
          <div className="w-9 h-9 rounded-lg bg-red-50 text-red-700 flex items-center justify-center mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-neutral-900 mb-1">5. Form Validation & Security</h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Multi-tier input validation: driving license verification format, email syntax regex, phone number length, date bounds (pickup date ≤ return date), and sanitization of user strings.
          </p>
        </div>

        {/* Module 6: Dynamic Business Logic & Pricing Engine */}
        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs">
          <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center mb-3">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-neutral-900 mb-1">6. Dynamic Pricing Algorithms</h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Real-time calculation engine computing multi-day rates, insurance excess waivers, accessory add-ons, hub dispatch fees, and state road transport tax percentages instantly as user toggles options.
          </p>
        </div>

      </div>

      {/* System Flow Diagram / Architecture */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs mb-8">
        <h3 className="text-sm font-bold text-neutral-900 mb-4 flex items-center gap-2">
          <Workflow className="w-4 h-4 text-neutral-900" />
          <span>Vehicle Rental System — Lifecycle Workflow</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
            <div className="font-bold text-neutral-900 mb-1">Stage 1: Fleet Discovery</div>
            <p className="text-neutral-600 text-[11px]">
              User filters by category, powertrain, seats, and price. Real-time search algorithm sorts and matches available vehicles across city pickup hubs.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
            <div className="font-bold text-neutral-900 mb-1">Stage 2: Reservation & Config</div>
            <p className="text-neutral-600 text-[11px]">
              Interactive 3-step modal computes rental duration, applies insurance tier, adds optional accessories, and captures driver credentials.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
            <div className="font-bold text-neutral-900 mb-1">Stage 3: Voucher Generation</div>
            <p className="text-neutral-600 text-[11px]">
              Generates unique booking reference code (VR-XXXXX), creates digital QR voucher, saves record to LocalStorage, and adjusts vehicle status.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
            <div className="font-bold text-neutral-900 mb-1">Stage 4: Admin & Lifecycle</div>
            <p className="text-neutral-600 text-[11px]">
              Admin portal tracks fleet metrics, manages reservations, toggles maintenance status, and provides invoice ledger data.
            </p>
          </div>
        </div>
      </div>

      {/* Viva / Presentation Q&A Quick Reference */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs">
        <h3 className="text-sm font-bold text-neutral-900 mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Web Technologies Viva / Evaluation Checklist</span>
        </h3>

        <div className="space-y-2.5 text-xs text-neutral-700">
          <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200/80">
            <strong className="text-neutral-900 block mb-0.5">Q: How is User Authentication and Regional Currency/Place localization handled?</strong>
            <span>A: A central React Context (<code className="font-mono text-neutral-800">UserContext</code>) manages the authenticated driver profile and their regional location. When a user selects their place (e.g., India 🇮🇳), the system applies dynamic exchange conversion to display all fleet rates, insurance tiers, accessories, and vouchers in their local currency (e.g., ₹ INR / Rs in India, $ in the US, £ in the UK). Hub locations and payment gateways (like UPI / GPay / PhonePe in India) dynamically adapt.</span>
          </div>

          <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200/80">
            <strong className="text-neutral-900 block mb-0.5">Q: How does the application handle data persistence without an external SQL server?</strong>
            <span>A: It leverages the HTML5 <code className="font-mono text-neutral-800">localStorage</code> API with JSON serialization. When the user completes a booking or adds a vehicle in Admin mode, state is synchronized immediately to client storage.</span>
          </div>

          <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200/80">
            <strong className="text-neutral-900 block mb-0.5">Q: What validation rules are applied before a reservation is confirmed?</strong>
            <span>A: Strict input checks ensure the driver's full name is provided, driving license number is non-empty, email satisfies RFC standard formatting, phone number contains valid digits, and the return date is equal to or after the pickup date.</span>
          </div>

          <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200/80">
            <strong className="text-neutral-900 block mb-0.5">Q: How is responsive design achieved across mobile and desktop?</strong>
            <span>A: Through utility-first Tailwind CSS classes using mobile-first breakpoints (<code className="font-mono">sm:</code>, <code className="font-mono">md:</code>, <code className="font-mono">lg:</code>), CSS Grid for the fleet catalog, and flexible modals with viewport height constraints.</span>
          </div>
        </div>

        <div className="mt-5 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 transition"
          >
            Close Tech Specs
          </button>
        </div>
      </div>

    </div>
  );
};
