import { ContentGuidelines } from '../../types';

interface ContentGuidelinesFormProps {
  value: ContentGuidelines;
  onChange: (guidelines: ContentGuidelines) => void;
}

export default function ContentGuidelinesForm({ value, onChange }: ContentGuidelinesFormProps) {
  const updateField = (field: keyof ContentGuidelines, val: string) => {
    onChange({ ...value, [field]: val });
  };

  const fields = [
    {
      key: 'contentStructure' as keyof ContentGuidelines,
      label: 'โครงสร้างคอนเทนต์',
      icon: '📝',
      placeholder: `แนะนำ: ระบุข้อมูลเกี่ยวกับ...
• ความยาววิดีโอที่ต้องการ (เช่น 30-60 วินาที)
• รูปแบบวิดีโอ (แนวตั้ง/แนวนอน)
• ขั้นตอนการนำเสนอ (Hook → เนื้อหา → CTA)
• สไตล์การนำเสนอ (รีวิว, Tutorial, Vlog)`,
    },
    {
      key: 'keyMessages' as keyof ContentGuidelines,
      label: 'Key Messages',
      icon: '💬',
      placeholder: `แนะนำ: ระบุข้อมูลเกี่ยวกับ...
• สิ่งที่ต้องพูด/กล่าวถึง (ชื่อแบรนด์, USP, โค้ดส่วนลด)
• สิ่งที่ห้ามพูด/กล่าวอ้าง (เช่น ห้ามอ้างผลทางการแพทย์)
• จุดขายหลักของสินค้า
• ข้อความ CTA ที่ต้องการ`,
    },
    {
      key: 'dosAndDonts' as keyof ContentGuidelines,
      label: "Do's & Don'ts",
      icon: '✅',
      placeholder: `แนะนำ: ระบุข้อมูลเกี่ยวกับ...
✓ สิ่งที่ควรทำ:
  - โชว์สินค้าให้เห็นชัด
  - ทำให้ดูเป็นธรรมชาติ
  - ใส่เสียงบรรยาย

✗ สิ่งที่ไม่ควรทำ:
  - ใช้ฟิลเตอร์หนักเกินไป
  - พูดเปรียบเทียบกับคู่แข่ง
  - ใช้เพลงมีลิขสิทธิ์`,
    },
    {
      key: 'hashtagsAndLinks' as keyof ContentGuidelines,
      label: 'Hashtags & Links',
      icon: '#️⃣',
      placeholder: `แนะนำ: ระบุข้อมูลเกี่ยวกับ...
• Hashtags ที่ต้องใช้ (#แบรนด์ #แคมเปญ)
• Hashtags แนะนำเพิ่มเติม
• Account ที่ต้อง Mention (@brand)
• Promo Code (ถ้ามี)
• ลิงก์ Landing Page
• วิธีใส่ลิงก์ (Bio, Comment แรก)`,
    },
    {
      key: 'visualGuidelines' as keyof ContentGuidelines,
      label: 'แนวทางด้านภาพและเสียง',
      icon: '🎨',
      placeholder: `แนะนำ: ระบุข้อมูลเกี่ยวกับ...
• โทนสี/Mood ที่ต้องการ
• Background ที่เหมาะสม
• การแต่งกาย/สไตล์
• เพลง/เสียงที่แนะนำ
• แสงและความคมชัด
• องค์ประกอบที่ต้องมีในเฟรม`,
    },
    {
      key: 'legalNotes' as keyof ContentGuidelines,
      label: 'Legal & Disclosure',
      icon: '⚖️',
      placeholder: `แนะนำ: ระบุข้อมูลเกี่ยวกับ...
• ต้องใส่ Disclosure หรือไม่ (#ad #sponsored)
• ข้อความ Disclosure ที่ต้องใช้
• ข้อจำกัดทางกฎหมาย
• คำเตือนที่ต้องแสดง (ถ้ามี)`,
    },
  ];

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500 dark:text-gray-300 bg-gray-50 dark:bg-slate-700 rounded-xl p-4">
        💡 กรอกรายละเอียดในแต่ละหัวข้อเพื่อให้ Creator เข้าใจและสร้างคอนเทนต์ได้ตรงตามที่ต้องการ
        สามารถเว้นว่างหัวข้อที่ไม่จำเป็นได้
      </p>

      {fields.map((field) => (
        <div key={field.key} className="border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden">
          <div className="bg-gray-50 dark:bg-slate-700 px-4 py-3 border-b border-gray-200 dark:border-slate-600">
            <h3 className="font-semibold flex items-center gap-2 dark:text-white">
              <span>{field.icon}</span>
              {field.label}
            </h3>
          </div>
          <div className="p-4 bg-white dark:bg-slate-800">
            <textarea
              placeholder={field.placeholder}
              value={value[field.key] || ''}
              onChange={(e) => updateField(field.key, e.target.value)}
              rows={6}
              className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-gray-400 dark:bg-slate-900 dark:text-white"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
