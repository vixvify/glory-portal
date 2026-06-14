export const COLOR_OPTIONS = [
  { value: "color", label: "ภาพสี" },
  { value: "black_and_white", label: "ขาวดำ" },
  { value: "color_and_black_and_white", label: "ภาพสีและขาวดำ" },
];

export const ASPECT_RATIO_OPTIONS = [
  { value: "landscape", label: "แนวนอน" },
  { value: "portrait", label: "แนวตั้ง" },
];

export const CONTENT_WARNING_OPTIONS = [
  { value: "profanity", label: "มีคำหยาบคาย" },
  { value: "drugs", label: "มียาเสพติด/สิ่งมึนเมา" },
];

export const DROPDOWN_PLACEHOLDERS = {
  LANGUAGE: { value: "", label: "เลือกภาษาของภาพยนตร์..." },
  UNIVERSITY: { value: "", label: "ไม่ระบุ / เลือกสถาบันการศึกษา..." },
  SCHOOL: { value: "", label: "ไม่ระบุ / เลือกโรงเรียน..." },
};

export interface CrewRoleDefinition {
  id: string;
  code: string;
  label: string;
}

export interface CrewCategory {
  id: string;
  label: string;
  roles: CrewRoleDefinition[];
}

export const CREW_CATEGORIES: CrewCategory[] = [
  {
    id: "production_management",
    label: "ฝ่ายบริหาร (Production Management)",
    roles: [
      { id: "executive_producer", code: "EXECUTIVE_PRODUCER", label: "ผู้อำนวยการสร้างบริหาร" },
      { id: "producer", code: "PRODUCER", label: "ผู้อำนวยการสร้าง" },
      { id: "line_producer", code: "LINE_PRODUCER", label: "ผู้จัดการสายการผลิต" },
      { id: "production_manager", code: "PRODUCTION_MANAGER", label: "ผู้จัดการกองถ่าย" },
      { id: "production_assistant", code: "PRODUCTION_ASSISTANT", label: "ผู้ช่วยฝ่ายผลิต" },
    ],
  },
  {
    id: "directing",
    label: "ฝ่ายกำกับ (Directing)",
    roles: [
      { id: "director", code: "DIRECTOR", label: "ผู้กำกับ" },
      { id: "assistant_director", code: "ASSISTANT_DIRECTOR", label: "ผู้ช่วยผู้กำกับ" },
      { id: "continuity", code: "CONTINUITY", label: "ผู้ตรวจสอบความต่อเนื่อง" },
      { id: "acting_coach", code: "ACTING_COACH", label: "โค้ชการแสดง" },
    ],
  },
  {
    id: "screenplay",
    label: "ฝ่ายบท (Screenplay)",
    roles: [
      { id: "writer", code: "WRITER", label: "นักเขียนบท" },
      { id: "script_consultant", code: "SCRIPT_CONSULTANT", label: "ที่ปรึกษาบท" },
    ],
  },
  {
    id: "camera",
    label: "ฝ่ายถ่ายภาพ (Camera Department)",
    roles: [
      { id: "dop", code: "DOP", label: "ผู้กำกับภาพ" },
      { id: "camera_operator", code: "CAMERA_OPERATOR", label: "ช่างกล้อง" },
      { id: "first_assistant_camera", code: "FIRST_ASSISTANT_CAMERA", label: "ผู้ช่วยกล้องคนที่ 1" },
      { id: "second_assistant_camera", code: "SECOND_ASSISTANT_CAMERA", label: "ผู้ช่วยกล้องคนที่ 2" },
      { id: "dit", code: "DIT", label: "ช่างเทคนิคภาพดิจิทัล" },
      { id: "video_assist", code: "VIDEO_ASSIST", label: "ผู้ดูแลจอมอนิเตอร์" },
    ],
  },
  {
    id: "lighting",
    label: "ฝ่ายแสง (Lighting / Electrical)",
    roles: [
      { id: "gaffer", code: "GAFFER", label: "หัวหน้าช่างแสง" },
      { id: "best_boy", code: "BEST_BOY", label: "ผู้ช่วยหัวหน้าช่างแสง" },
      { id: "electrician", code: "ELECTRICIAN", label: "ช่างไฟฟ้า" },
    ],
  },
  {
    id: "grip",
    label: "ฝ่ายขนย้าย/ติดตั้งอุปกรณ์ (Grip Department)",
    roles: [
      { id: "key_grip", code: "KEY_GRIP", label: "หัวหน้าช่างอุปกรณ์" },
      { id: "grip", code: "GRIP", label: "ช่างอุปกรณ์ทั่วไป" },
    ],
  },
  {
    id: "sound",
    label: "ฝ่ายเสียงในกองถ่าย (Production Sound)",
    roles: [
      { id: "sound_mixer", code: "SOUND_MIXER", label: "หัวหน้าช่างเสียง" },
      { id: "boom_operator", code: "BOOM_OPERATOR", label: "ผู้ถือไมค์บูม" },
      { id: "sound_assistant", code: "SOUND_ASSISTANT", label: "ผู้ช่วยฝ่ายเสียง" },
    ],
  },
  {
    id: "art",
    label: "ฝ่ายศิลป์ (Art Department)",
    roles: [
      { id: "production_designer", code: "PRODUCTION_DESIGNER", label: "ผู้ออกแบบงานสร้าง" },
      { id: "art_director", code: "ART_DIRECTOR", label: "ผู้อำนวยการฝ่ายศิลป์" },
      { id: "set_designer", code: "SET_DESIGNER", label: "ผู้ออกแบบฉาก" },
      { id: "props_master", code: "PROPS_MASTER", label: "หัวหน้าฝ่ายอุปกรณ์ประกอบฉาก" },
      { id: "graphic_designer", code: "GRAPHIC_DESIGNER", label: "นักออกแบบกราฟิกประกอบฉาก" },
    ],
  },
  {
    id: "costume",
    label: "ฝ่ายเครื่องแต่งกาย (Costume Department)",
    roles: [
      { id: "costume_designer", code: "COSTUME_DESIGNER", label: "นักออกแบบเครื่องแต่งกาย" },
      { id: "wardrobe_supervisor", code: "WARDROBE_SUPERVISOR", label: "หัวหน้าฝ่ายเสื้อผ้า" },
      { id: "costume_buyer", code: "COSTUME_BUYER", label: "ผู้จัดซื้อเครื่องแต่งกาย" },
    ],
  },
  {
    id: "makeup",
    label: "ฝ่ายแต่งหน้า/ทำผม (Hair & Makeup)",
    roles: [
      { id: "makeup_artist", code: "MAKEUP_ARTIST", label: "ช่างแต่งหน้า" },
      { id: "sfx_makeup_artist", code: "SFX_MAKEUP_ARTIST", label: "ช่างแต่งหน้าเอฟเฟกต์พิเศษ" },
      { id: "hairstylist", code: "HAIRSTYLIST", label: "ช่างทำผม" },
    ],
  },
  {
    id: "cast",
    label: "ฝ่ายแสดง (Cast)",
    roles: [
      { id: "cast", code: "CAST", label: "นักแสดง" },
      { id: "lead_actor", code: "LEAD_ACTOR", label: "นักแสดงนำ" },
      { id: "supporting_actor", code: "SUPPORTING_ACTOR", label: "นักแสดงสมทบ" },
      { id: "extra", code: "EXTRA", label: "นักแสดงประกอบ" },
      { id: "stand_in", code: "STAND_IN", label: "นักแสดงตัวแทน" },
      { id: "body_double", code: "BODY_DOUBLE", label: "นักแสดงแทนตัว" },
      { id: "stunt_double", code: "STUNT_DOUBLE", label: "นักแสดงแทนฉากอันตราย" },
      { id: "animal_wrangler", code: "ANIMAL_WRANGLER", label: "ผู้ฝึกสัตว์/นักแสดงสัตว์" },
      { id: "casting_director", code: "CASTING_DIRECTOR", label: "ผู้อำนวยการออดิชั่น" },
      { id: "casting_assistant", code: "CASTING_ASSISTANT", label: "ผู้ช่วยออดิชั่น" },
      { id: "extras_casting_coordinator", code: "EXTRAS_CASTING_COORDINATOR", label: "ผู้ประสานงานนักแสดงประกอบ" },
    ],
  },
  {
    id: "locations",
    label: "ฝ่ายสถานที่ถ่ายทำ (Locations)",
    roles: [
      { id: "location_manager", code: "LOCATION_MANAGER", label: "ผู้จัดการสถานที่ถ่ายทำ" },
      { id: "assistant_location_manager", code: "ASSISTANT_LOCATION_MANAGER", label: "ผู้ช่วยผู้จัดการสถานที่" },
      { id: "location_scout", code: "LOCATION_SCOUT", label: "ผู้สำรวจสถานที่" },
      { id: "location_coordinator", code: "LOCATION_COORDINATOR", label: "ผู้ประสานงานสถานที่" },
      { id: "location_permits_coordinator", code: "LOCATION_PERMITS_COORDINATOR", label: "ผู้ดูแลการขออนุญาตสถานที่" },
      { id: "location_assistant", code: "LOCATION_ASSISTANT", label: "ผู้ช่วยฝ่ายสถานที่" },
      { id: "location_pa", code: "LOCATION_PA", label: "ผู้ช่วยประจำสถานที่" },
      { id: "unit_manager", code: "UNIT_MANAGER", label: "ผู้จัดการยูนิตหน้างาน" },
      { id: "security_coordinator", code: "SECURITY_COORDINATOR", label: "ผู้ประสานงานความปลอดภัย" },
      { id: "security_guard", code: "SECURITY_GUARD", label: "เจ้าหน้าที่รักษาความปลอดภัย" },
    ],
  },
  {
    id: "support",
    label: "ฝ่ายจัดการผลิต/สนับสนุน (Production Support)",
    roles: [
      { id: "unit_publicist", code: "UNIT_PUBLICIST", label: "ผู้ประชาสัมพันธ์ประจำกอง" },
      { id: "still_photographer", code: "STILL_PHOTOGRAPHER", label: "ช่างภาพนิ่งประจำกองถ่าย" },
      { id: "bts_videographer", code: "BTS_VIDEOGRAPHER", label: "ช่างถ่ายวิดีโอเบื้องหลัง" },
      { id: "catering_coordinator", code: "CATERING_COORDINATOR", label: "ผู้ดูแลอาหารในกองถ่าย" },
      { id: "transportation_captain", code: "TRANSPORTATION_CAPTAIN", label: "หัวหน้าฝ่ายขนส่ง" },
      { id: "driver", code: "DRIVER", label: "พนักงานขับรถ" },
      { id: "picture_car_coordinator", code: "PICTURE_CAR_COORDINATOR", label: "ผู้ประสานงานยานพาหนะในหนัง" },
      { id: "medic", code: "MEDIC", label: "เจ้าหน้าที่การแพทย์/ปฐมพยาบาล" },
      { id: "animal_coordinator", code: "ANIMAL_COORDINATOR", label: "ผู้ประสานงานสัตว์" },
      { id: "script_clearance_coordinator", code: "SCRIPT_CLEARANCE_COORDINATOR", label: "ผู้ตรวจสอบลิขสิทธิ์เนื้อหา" },
      { id: "intimacy_coordinator", code: "INTIMACY_COORDINATOR", label: "ผู้ประสานงานฉากอ่อนไหว" },
      { id: "safety_officer", code: "SAFETY_OFFICER", label: "เจ้าหน้าที่ความปลอดภัย" },
    ],
  },
  {
    id: "sfx",
    label: "ฝ่ายเอฟเฟกต์พิเศษในกองถ่าย (On-Set Special Effects)",
    roles: [
      { id: "sfx_supervisor", code: "SFX_SUPERVISOR", label: "หัวหน้าฝ่ายเอฟเฟกต์พิเศษ" },
      { id: "sfx_technician", code: "SFX_TECHNICIAN", label: "ช่างเอฟเฟกต์พิเศษ" },
      { id: "pyrotechnician", code: "PYROTECHNICIAN", label: "ช่างระเบิด/ไฟ" },
      { id: "mechanical_fx_artist", code: "MECHANICAL_FX_ARTIST", label: "ช่างเอฟเฟกต์เชิงกล" },
      { id: "weather_machine_operator", code: "WEATHER_MACHINE_OPERATOR", label: "ผู้ควบคุมเครื่องฝน/หิมะ/ลม" },
    ],
  },
  {
    id: "post_production",
    label: "ฝ่ายหลังการผลิต (Post-Production)",
    roles: [
      { id: "post_production_supervisor", code: "POST_PRODUCTION_SUPERVISOR", label: "หัวหน้าฝ่ายหลังการผลิต" },
      { id: "editor", code: "EDITOR", label: "ผู้ตัดต่อ" },
      { id: "assistant_editor", code: "ASSISTANT_EDITOR", label: "ผู้ช่วยตัดต่อ" },
      { id: "colorist", code: "COLORIST", label: "ผู้ปรับแต่งสี" },
      { id: "di_supervisor", code: "DI_SUPERVISOR", label: "หัวหน้าฝ่าย Digital Intermediate" },
      { id: "vfx_supervisor", code: "VFX_SUPERVISOR", label: "หัวหน้าฝ่าย VFX" },
      { id: "vfx_producer", code: "VFX_PRODUCER", label: "โปรดิวเซอร์ VFX" },
      { id: "vfx_artist", code: "VFX_ARTIST", label: "ช่างรวมภาพ/ศิลปิน VFX" },
      { id: "motion_graphics_designer", code: "MOTION_GRAPHICS_DESIGNER", label: "นักออกแบบ Motion Graphics" },
      { id: "title_designer", code: "TITLE_DESIGNER", label: "นักออกแบบเครดิต/ไตเติ้ล" },
      { id: "sound_designer", code: "SOUND_DESIGNER", label: "นักออกแบบเสียง" },
      { id: "supervising_sound_editor", code: "SUPERVISING_SOUND_EDITOR", label: "หัวหน้าบรรณาธิการเสียง" },
      { id: "sound_editor", code: "SOUND_EDITOR", label: "นักตัดต่อเสียง" },
      { id: "dialogue_editor", code: "DIALOGUE_EDITOR", label: "นักตัดต่อบทพูด" },
      { id: "adr_supervisor", code: "ADR_SUPERVISOR", label: "หัวหน้า ADR" },
      { id: "foley_artist", code: "FOLEY_ARTIST", label: "ช่างทำเสียงประกอบ" },
      { id: "foley_mixer", code: "FOLEY_MIXER", label: "ช่างผสมเสียง Foley" },
      { id: "rerecording_mixer", code: "RERECORDING_MIXER", label: "วิศวกรผสมเสียงสุดท้าย" },
      { id: "composer", code: "COMPOSER", label: "นักแต่งเพลงประกอบ" },
      { id: "music_supervisor", code: "MUSIC_SUPERVISOR", label: "ผู้ดูแลดนตรีประกอบ" },
      { id: "orchestrator", code: "ORCHESTRATOR", label: "ผู้เรียบเรียงดนตรี" },
    ],
  },
];

export const FLAT_CREW_ROLES = CREW_CATEGORIES.flatMap((cat) => cat.roles);

export const CREW_TAB_OPTIONS = FLAT_CREW_ROLES.map((role) => ({
  id: role.id,
  label: role.label,
}));

export const CREW_MAPPING = FLAT_CREW_ROLES.map((role) => ({
  id: role.id,
  label: role.label,
}));

export type CrewTabId = typeof FLAT_CREW_ROLES[number]["id"];

export const AGE_RATING_OPTIONS = ["G", "PG", "PG-13", "NC-17", "R"];

export const LANGUAGE_OPTIONS = ["ไทย", "อังกฤษ", "เกาหลี", "ญี่ปุ่น", "จีน"];

export const CREW_TAB_CONFIG = FLAT_CREW_ROLES.map((role) => ({
  id: role.id as CrewTabId,
  label: role.label,
  placeholder: `พิมพ์ชื่อ หรือเลือก${role.label}...`,
  addLabel: `เพิ่มรายชื่อ${role.label}`,
}));

export function getCrewRoleLabel(roleName: string): string {
  const cleanRole = roleName.trim().toUpperCase();
  const found = FLAT_CREW_ROLES.find((r) => r.code === cleanRole);
  return found ? found.label : roleName;
}
