(() => {
  "use strict";
  document.documentElement.dataset.theme = "dark";
  // Off-screen sections use content-visibility:auto (gray-green.css). In-page jumps need real section heights,
  // so render everything before the browser/our handlers compute the target position.
  const renderAllSections = () => document.documentElement.classList.add("cv-off");
  document.addEventListener("click", (e) => { if (e.target.closest?.('a[href^="#"]')) renderAllSections(); }, { capture: true });
  if (location.hash.length > 1) { renderAllSections(); requestAnimationFrame(() => document.querySelector(location.hash)?.scrollIntoView()); }
  if (!document.querySelector('link[href*="gray-green.css"], style[data-href*="gray-green.css"]')) {
    const themeStyles = document.createElement("link");
    themeStyles.rel = "stylesheet";
    themeStyles.href = "./gray-green.css";
    document.head.append(themeStyles);
  }
  const gallery = (window.__JINA__ && window.__JINA__.gallery) || [];
  const q = (selector, root = document) => root.querySelector(selector);
  const qa = (selector, root = document) => [...root.querySelectorAll(selector)];

  /* A compact, theme-aware wordmark avoids the square image treatment and
     keeps the same lockup in the header and footer. */
  const brandMarkup = '<span class="jina-wordmark">JINA</span> <span class="jina-brandline">SERVICE <b>PHUKET</b></span>';
  qa(".image-brand").forEach((brand) => {
    if (!brand.querySelector(".jina-wordmark")) {
      brand.classList.add("jina-lockup");
      brand.innerHTML = brandMarkup;
      brand.removeAttribute("aria-label");
    }
  });

  const sunSvg = `<svg class="theme-toggle-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
  const moonSvg = `<svg class="theme-toggle-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
  const themeButton = q('[data-track="theme"]');
  const renderThemeIcon = () => {
    if (!themeButton) return;
    const isDark = document.documentElement.dataset.theme !== "light";
    themeButton.innerHTML = isDark ? sunSvg : moonSvg;
    themeButton.setAttribute("aria-label", isDark ? "เปลี่ยนเป็นโหมดสว่าง (Light Mode)" : "เปลี่ยนเป็นโหมดมืด (Dark Mode)");
    themeButton.setAttribute("title", isDark ? "โหมดสว่าง (Light Mode)" : "โหมดมืด (Dark Mode)");
  };
  renderThemeIcon();
  themeButton?.addEventListener("click", () => {
    const isDark = document.documentElement.dataset.theme !== "light";
    document.documentElement.dataset.theme = isDark ? "light" : "dark";
    renderThemeIcon();
  });
  const translations = {"บริการ":"Services","แกลเลอรี":"Gallery","มาตรฐาน":"Standards","ราคา":"Pricing","พื้นที่บริการ":"Coverage","คำถามพบบ่อย":"FAQ","ปรึกษาฟรี":"Free consultation","ทีมช่างภูเก็ต • ประสบการณ์ 30 ปี":"Phuket service team • 30 years of experience","สูบสิ่งปฏิกูล แก้ท่อตัน":"Waste pumping & drainage work","ครบงานระบบบำบัดทั่วภูเก็ต":"across Phuket","ประมวลภาพงานปฏิบัติการจริงทั่วภูเก็ต ทั้งบ้านพัก โรงแรม คอนโด สายการบิน โรงแรม รีสอร์ท สำนักงาน โรงเรียนและเทศกาลระดับประเทศ":"Real operational photos across Phuket covering residences, hotels, condos, airlines, resorts, offices, schools, and national festivals.","ประมวลภาพงานปฏิบัติการจริงทั่วภูเก็ต ทั้งบ้านพัก โรงแรม คอนโด สายการบิน และเทศกาลระดับประเทศ":"Real operational photos across Phuket covering residences, hotels, condos, airlines, resorts, offices, schools, and national festivals.","บริการสูบสิ่งปฏิกูล ล้างถังบำบัด–ถังดักไขมัน ทะลวงท่อตัน ติดตั้งระบบบำบัด และซ่อมอะไหล่สุขภัณฑ์ สำหรับบ้าน ธุรกิจ โรงแรม และองค์กรทั่วภูเก็ต":"Septic and grease tank cleaning, blocked-drain clearing, tank installation and sanitary fixture service across Phuket.","ขอประเมินราคาฟรี":"Request a free estimate","บริษัทจดทะเบียนถูกต้อง":"Registered business","นัดหมายตรงเวลา":"On-time appointments","ดูแลพื้นที่หลังจบงาน":"Clean handover","ปีแห่งประสบการณ์":"Years of experience","ลูกค้าที่พึงพอใจกับผลงาน":"Satisfied clients","ชั่วโมงปฏิบัติงานทำความสะอาด":"Service hours","สถานที่ที่ทำความสะอาดเรียบร้อย":"Completed sites","อัตราความพึงพอใจของลูกค้า":"Client satisfaction","จินา เซอร์วิส ยินดีให้บริการ":"JINA SERVICE — complete services","ตั้งแต่งานบ้านเร่งด่วน ไปจนถึงแผนดูแลอาคารเชิงป้องกัน ทีมเดียวดูแลครบและสื่อสารตรงไปตรงมา":"From urgent home callouts to commercial preventative plans,\nour certified team provides reliable care with clear pricing.","บริการสูบส้วม น้ำเสีย ไขมัน และสิ่งปฏิกูลทุกประเภท":"Septic, wastewater, grease & waste pumping","บริการแก้ไขท่อตัน (งูเหล็ก)":"Blocked-drain clearing (drain snake)","ล้างหรือติดตั้งถังดักไขมัน":"Grease tank cleaning & installation","บริการขุดลอกท่อ":"Drainage dredging","บริการล้างทำความสะอาดถังเก็บน้ำ":"Water storage tank cleaning","บริการวางระบบถังบำบัด":"Treatment system installation","บริการวางและย้ายระบบท่อน้ำ":"Water pipe installation & relocation","บริการทุกประเภทเกี่ยวกับสุขภัณฑ์":"All sanitary fixture services","ปรึกษาเพื่อประเมินก่อนได้ฟรีที่ →":"Free consultation and estimate →","ราคาเริ่มต้น ฿1,xxx*":"Starting from ฿1,xxx*","ราคาเริ่มต้น ฿1,200*":"Starting from ฿1,200*","ประเมินตามหน้างานหรือตามตกลง":"Site assessment / agreed quotation","อุปกรณ์มาตรฐาน ทำงานปลอดภัย หายห่วง":"Standard equipment for safer work","ภาพรถและงานบริการจริง":"Our real fleet and service work","งานทั้งหมด":"All work","รถและอุปกรณ์":"Fleet & equipment","สูบส้วม–ถังบำบัด":"Septic service","ท่อตัน–ระบายน้ำ":"Drain work","เราไม่ได้แค่ดูดออก แต่ดูแลให้จบงาน":"More than pumping. A proper finish.","ประเมินก่อนเริ่ม":"Assessment before work","อุปกรณ์ตรงกับงาน":"Right equipment","ส่งมอบพื้นที่สะอาด":"Clean handover","รับประกันตามประเภทงาน":"Job-specific warranty","เชี่ยวชาญงานสูบสิ่งปฏิกูล":"30 Years of Septic &","และระบบบำบัดน้ำเสียครบวงจร":"Wastewater Services in Phuket","เวลาทำการ 09.00–18.00 น.":"Service hours 09:00–18:00","ราคาเข้าใจง่าย ก่อนทีมออกเดินทาง":"Clear Upfront Rates","บ้านพักอาศัย":"Home","ธุรกิจและสำนักงาน":"Business & office","โรงแรมและโครงการ":"Hotel & project","ขอราคาหน้างาน →":"Request a site quotation →","ประสบการณ์จากลูกค้าของเรา":"Customer experiences","ดูรีวิวบน Google Maps":"View reviews on Google Maps","พื้นที่ให้บริการในภูเก็ต":"Service Areas Across Phuket","สถานที่ตั้งจริงบน Google Maps":"Official location on Google Maps","บอกหน้างานคร่าวๆ เราช่วยประเมินให้":"Tell us about the site — we will help estimate","ชื่อ–นามสกุล":"Full name","เบอร์โทรศัพท์":"Phone number","อีเมล":"Email","ประเภทสถานที่":"Property type","พื้นที่ / ตำบล":"Area / subdistrict","รายละเอียดเพิ่มเติม":"Additional details","ส่งข้อมูลให้ทีมประเมินฟรี →":"Send a free estimate request →","คำถามที่พบบ่อย":"Frequently asked questions","ดูงานจริงและข่าวสารจากทีม":"See real work and team updates","เปิดเพจ Facebook →":"Open Facebook page →","บริการจัดการสิ่งปฏิกูลโดยมืออาชีพทั่วภูเก็ต":"Professional sanitation services across Phuket","สูบสิ่งปฏิกูล & AirAsia":"Septic & AirAsia service","เทศกาลดนตรี EDC":"EDC Music Festival","ขุดลอกท่อ & บ่อน้ำเสีย":"Drain & pond dredging","ติดตั้งถังบำบัด":"Septic tank installation","รูปรถและอุปกรณ์":"Fleet & equipment","คลิปวิดีโอ (VDO)":"Video clips (VDO)","▶ เล่นวิดีโอ":"▶ Play Video","▶ กดดูวิดีโอ":"▶ Play Video"};
  Object.assign(translations, {
    "บทความ": "Blog",
    "สาระน่ารู้ & บทความ": "Blog & Articles",
    "ราคา": "Price",
    "มาตรฐาน": "Standards",
    "สูบส้วม น้ำเสีย ไขมัน และสิ่งปฏิกูลทุกประเภท": "All Wastewater, Grease & Septic Pumping",
    "แก้ท่อตันด้วยงูเหล็ก: ชักโครก ท่อพื้นห้องน้ำ และซิงค์น้ำ": "Drain snake clearing: toilets, floor drains, and sinks",
    "ขุดลอกท่อระบายน้ำ และล้างทำความสะอาดถังเก็บน้ำ": "Drain pipe dredging and water storage tank cleaning",
    "วางระบบถังบำบัด บ่อเกรอะ วางหรือย้ายระบบท่อน้ำ": "Septic tank installation, cesspools, water pipe works",
    "ติดตั้งสุขภัณฑ์และท่อระบายน้ำพื้น Floor Drain": "Sanitary fixture & floor drain installation",
    "ทำความสะอาดหรือติดตั้งถังดักไขมัน": "Grease trap cleaning & installation",
    "ทำความสะอาดและสูบถังบำบัด": "Septic tank pumping & cleaning",
    "แก้ไขท่อระบายน้ำอุดตัน": "Blocked drain clearing",
    "ซ่อมและติดตั้งอะไหล่สุขภัณฑ์": "Toilet fixture & spare-part installation",
    "จัดการสิ่งปฏิกูล ทุกประเภท": "All types of waste management",
    "จัดการสิ่งปฏิกูลทุกประเภท": "All types of waste management",
    "ดูโพสต์นี้ ↗": "View this post ↗",
    "ดูโพสต์นี้": "View this post",
    "เริ่มต้น ฿1,xxx*": "Start ฿1,xxx*",
    "เริ่มต้น ฿1,200*": "Start ฿1,200*",
    "ราคาเริ่มต้น ฿1,xxx*": "Start ฿1,xxx*",
    "ราคาเริ่มต้น ฿1,200*": "Start ฿1,200*",
    "From ฿1,xxx*": "Start ฿1,xxx*",
    "From ฿1,200*": "Start ฿1,200*",
    "From": "Start",
    "เราไม่ได้แค่ดูดออก": "Beyond pumping",
    "แต่ดูแลให้จบงาน": "We finish the job properly",
    "เราไม่ได้แค่ดูดออก แต่ดูแลให้จบงาน": "Beyond pumping\nWe finish the job properly",
    "Beyond pumping —we finish the job properly": "Beyond pumping\nWe finish the job properly",
    "Beyond pumping — we finish the job properly": "Beyond pumping\nWe finish the job properly",
    "ประสบการณ์จากลูกค้าของเรา": "Customer Stories & Verified Reviews",
    "ดูรีวิวบน Google Maps": "View Reviews on Google Maps",

    "สูบสิ่งปฏิกูล แก้ท่อตัน":"Septic tank pumping & drain care",
    "ครบงานระบบบำบัดทั่วภูเก็ต":"Wastewater services across Phuket",
    "บริการสูบสิ่งปฏิกูล ล้างถังบำบัด–ถังดักไขมัน ทะลวงท่อตัน ติดตั้งระบบบำบัด และซ่อมอะไหล่สุขภัณฑ์ สำหรับบ้าน ธุรกิจ โรงแรม และองค์กรทั่วภูเก็ต":"Septic tank pumping, grease trap cleaning, blocked drain clearing, wastewater system installation and sanitary fixture care for homes and businesses across Phuket.",
    "รองรับบ่อส้วม บ่อเกรอะ น้ำเสีย ไขมัน และระบบกักเก็บทุกประเภท ด้วยรถและอุปกรณ์เฉพาะทาง":"Septic tanks, cesspits, wastewater, grease and holding systems serviced with purpose-built equipment.",
    "ใช้เครื่องงูเหล็กเปิดทางระบายน้ำสำหรับท่อครัว ห้องน้ำ และท่อเมน แก้ปัญหาได้ตรงจุด":"Drain-snake clearing for kitchen, bathroom and main drain lines, targeting the actual blockage.",
    "ทำความสะอาดและติดตั้งถังดักไขมัน สำหรับบ้าน ร้านอาหาร โรงแรม และครัวเชิงพาณิชย์":"Grease-trap cleaning and installation for homes, restaurants, hotels and commercial kitchens.",
    "ขุดลอกและนำตะกอนหรือสิ่งอุดตันออกจากท่อระบายน้ำ เพื่อคืนการไหลและลดปัญหาน้ำเอ่อ":"Dredging removes sediment and blockages to restore flow and reduce wastewater backup.",
    "บริการด่วนทั่วภูเก็ต":"Responsive service across Phuket",
    "อย่าลังเลถ้าส้วมเต็ม รีบโทรมาเลยจ้าาา เราจะไปในทันที 😊":"Do not wait when your septic tank is full — call us and we will respond promptly. 😊",
    "ให้บริการครบทั้ง 17 ตำบล ในอำเภอเมืองภูเก็ต อำเภอกะทู้ และอำเภอถลาง สำหรับบ้าน ร้านอาหาร โรงแรม โรงเรียน และสำนักงาน":"Serving all 17 subdistricts in Mueang Phuket, Kathu and Thalang for homes, restaurants, hotels, schools and offices.",
    "สูบส้วม ท่อตัน เรียกใช้มือโปร จินาเซอร์วิส":"Septic pumping and blocked drains — call the JINA SERVICE professionals",
    "ห้างหุ้นส่วนจำกัด จินา เซอร์วิส":"JINA SERVICE LIMITED PARTNERSHIP",
    "จดทะเบียนถูกต้องตามกฎหมาย • 0833562000955":"Legally registered • 0833562000955",
    "ราคา":"Price",
    "ประเมินตามหน้างาน":"On-site quote",
    "ปรึกษาฟรี →":"Free consult →",
    "ปรึกษาฟรี→":"Free consult →",
    "เริ่มต้น ฿1,xxx*":"From ฿1,xxx*",
    "เริ่มต้น ฿1,200*":"From ฿1,200*",
    "ติดต่อ":"Contact",
    "อำเภอเมืองภูเก็ต":"Mueang Phuket District",
    "อำเภอกะทู้":"Kathu District",
    "อำเภอถลาง":"Thalang District",
    "ดูงานจริงและข่าวสารจากทีม":"Real jobs and team updates",
    "ติดตามภาพและวิดีโอจากหน้างานของ JINA SERVICE โดยตรงจาก Facebook ข้อมูลในส่วนนี้จะอัปเดตตามเพจต้นทาง":"Follow photos and videos from JINA SERVICE jobs. This section is updated from our Facebook page.",
    "หาก Feed ไม่แสดง เปิดดูบน Facebook →":"If the feed is blocked, view it on Facebook →"
    ,"ห้างหุ้นส่วนจำกัด จินา เซอร์วิส มีประสบการณ์ด้านงานสูบสิ่งปฏิกูล 30 ปี ให้บริการครบทั้งอำเภอเมืองภูเก็ต อำเภอกะทู้ และอำเภอถลาง พร้อมเข้าดูหน้างานและประเมินราคาเบื้องต้นฟรี ไม่มีค่าใช้จ่าย":"JINA SERVICE LIMITED PARTNERSHIP has 30 years of sanitation-pumping experience across Mueang Phuket, Kathu and Thalang, with free preliminary site assessment."
    ,"รับบริการสำหรับบ้าน คอนโด แมนชั่น อพาร์ทเม้นท์ โรงเรียน โรงแรม ร้านอาหาร ร้านค้า ออฟฟิศ และอาคารสำนักงาน ครอบคลุมงานสูบสิ่งปฏิกูล แก้ท่อตัน และดูแลระบบบำบัดน้ำเสียในภูเก็ต":"We serve homes, condominiums, apartments, schools, hotels, restaurants, shops and offices for sanitation pumping, blocked drains and wastewater systems in Phuket."
    ,"บริการเกี่ยวกับระบบบำบัดและสุขาภิบาล":"Wastewater & Septic Services"
    ,"บริการสูบส้วม สิ่งปฏิกูลทุกประเภท ครบวงจร":"Septic & Waste Pumping","บริการสูบส้วมและระบบบำบัด":"Wastewater & Septic Services"
    ,"งานช่วงกลางคืนกรุณานัดหมายล่วงหน้า":"Night service is available by advance appointment."
    ,"ทุกปัญหาเรื่องส้วมที่กวนใจ แก้ได้ครบ จบ เพียงโทรหาเรา":"One call to our team handles your septic and sanitation problem from start to finish."
    ,"เอกสารใบอนุญาตที่แนบมา":"Supporting licence document"
    ,"เปิดดูเอกสารขนาดเต็ม":"View full-size document"
    ,"บอกหน้างานคร่าวๆ":"Tell us about the site"
    ,"เราช่วยประเมินให้":"We will help with an estimate"
    ,"สแกนเพิ่มเพื่อน LINE":"Scan to add us on LINE"
    ,"ส่งรูปหน้างานให้เราประเมินได้รวดเร็วขึ้น":"Send site photos for a faster assessment."
    ,"เบอร์โทรสำรอง (ถ้ามี)":"Alternative phone (optional)"
    ,"Facebook Messenger (ถ้ามี)":"Facebook Messenger (optional)"
    ,"LINE ID (ถ้ามี — ใช้เบอร์หรือ ID ได้)":"LINE ID (optional — phone number or ID)"
    ,"ขนาดบ่อ (ถ้าทราบ)":"Tank size (if known)"
    ,"โปรดอย่าลังเลที่จะโทรหาเรา เพราะเรายินดีให้คำปรึกษาเหมือนเพื่อน":"Please feel free to call — we are happy to offer friendly advice."
    ,"สไลด์โชว์":"Slideshow"
    ,"ตารางภาพทั้งหมด":"Grid View"
    ,"💡 คลิกที่ภาพหรือวิดีโอเพื่อเปิดดูขนาดใหญ่แบบ Full-Screen ได้ทุกรายการ":"💡 Click any photo or video to view in full-screen"
    ,"คลิกที่ภาพหรือวิดีโอเพื่อเปิดดูขนาดใหญ่แบบ Full-Screen ได้ทุกรายการ":"Click any photo or video to view in full-screen"
    ,"ภาพที่":"Image"
    ,"จาก":"of"
    ,"Professional equipment for safer work":"Certified gear for safe work"
    ,"Certified gear for safe work":"Certified gear for safe work"
    ,"เชี่ยวชาญงานสูบสิ่งปฏิกูล และระบบบำบัดน้ำเสียครบวงจร":"30 Years of Septic & Wastewater Services in Phuket"

  });
  Object.assign(translations, {
    "จินา เซอร์วิส ยินดีให้บริการ":"Complete wastewater and septic services",
    "ตั้งแต่งานบ้านเร่งด่วน ไปจนถึงแผนดูแลอาคารเชิงป้องกัน ทีมเดียวดูแลครบและสื่อสารตรงไปตรงมา":"From urgent home callouts to commercial preventative plans,\nour certified team provides reliable care with clear pricing.",
    "รวมภาพ จินาเซอร์วิส ภูเก็ต":"JINA SERVICE Phuket gallery",
    "ประสบการณ์จากลูกค้าของเรา":"What our customers say",
    "คุณเอฟ":"Aef",
    "คุณเชอรี่":"Cheery",
    "เอกสารใบอนุญาตที่แนบมา":"Supporting licence document",
    "เปิดดูเอกสารขนาดเต็ม":"View the full document",
    "หมายเหตุ: เอกสารที่แนบระบุผู้รับใบอนุญาตเป็น ห้างหุ้นส่วนจำกัด สมฤทัย ภูเขียวเดินรถ เลขที่ ชย.88/2563 และระบุวันสิ้นอายุ 13 ธันวาคม 2568 จึงแสดงเป็นเอกสารเดิมที่เกี่ยวข้อง ไม่ใช่การยืนยันว่าเป็นใบอนุญาตปัจจุบันของ หจก.จินา เซอร์วิส":"Document note: the attached transport licence names Somruethai Phukhiao Doen Rot Limited Partnership, licence CHY.88/2563, with an expiry date of 13 December 2025. It is shown as a related historical document and does not represent a current JINA SERVICE licence.",
    "บริการดูแลถังบำบัดครบวงจร":"Complete septic and wastewater care",
    "จินา เซอร์วิส ให้บริการทำความสะอาดและสูบถังบำบัดทั่วภูเก็ต ครอบคลุมเมืองภูเก็ต ถลาง เชิงทะเล ไม้ขาว ป่าตอง กมลา และราไวย์":"JINA SERVICE provides septic tank pumping and wastewater services across Phuket Town, Thalang, Cherng Talay, Mai Khao, Patong, Kamala and Rawai.",
    "บริการหลักของเรา":"Our core services",
    "ทำความสะอาดและสูบถังบำบัด":"Septic tank pumping and cleaning",
    "ทำความสะอาดถังดักไขมัน":"Grease trap cleaning",
    "แก้ไขท่อระบายน้ำอุดตัน":"Blocked drain clearing",
    "ติดตั้งและดูแลถังบำบัด":"Septic tank installation and maintenance",
    "ติดตั้งถังดักไขมัน":"Grease trap installation",
    "ซ่อมและติดตั้งอะไหล่สุขภัณฑ์":"Toilet fixture and spare-part installation",
    "รับประกันตามประเภทงาน 1–12 เดือน โดยแจ้งเงื่อนไขก่อนเริ่มงาน":"1–12 months warranty depending on job scope or agreed terms."
  });
  Object.assign(translations, {
    "บริการมีคุณภาพ ตรงเวลา และประเมินหน้างานฟรี":"Professional, responsive service with a free site assessment",
    "แจ้งขอบเขตและราคาก่อนเริ่มงาน ไม่มีค่าใช้จ่ายแอบแฝง":"We confirm the scope and price before work begins — no hidden call-out charges.",
    "ขอประเมินฟรี":"Request a free assessment",
    "หากมีรูปทางเข้ารถ จุดเปิดบ่อ หรือท่อที่มีปัญหา เตรียมไว้ส่งทาง LINE จะช่วยประเมินได้เร็วขึ้น":"Send photos of the vehicle access, tank opening or affected drain via LINE for a faster initial assessment.",
    "สำนักงาน / ร้านค้า":"Office / shop",
    "โรงแรม / รีสอร์ต":"Hotel / resort",
    "โรงเรียน / องค์กร":"School / organisation",
    "สนใจสมัครสมาชิก และยินยอมให้ JINA SERVICE ใช้ข้อมูลติดต่อเพื่อแจ้งโปรโมชั่นและการสะสมแต้ม (ไม่บังคับ)":"I would like to join the customer programme and receive promotion and reward updates (optional).",
    "หากเลือกสมัคร กรุณากรอกชื่อ เบอร์โทร และอีเมลให้ครบ":"If selected, please provide your name, phone number and email address.",
    "ประสบการณ์ลูกค้า":"Customer experience",
    "ลูกค้าบ้านพัก • ฉลอง":"Residential customer • Chalong",
    "ผู้จัดการร้านอาหาร • ป่าตอง":"Restaurant manager • Patong",
    "ผู้ดูแลอาคาร • เมืองภูเก็ต":"Property manager • Phuket Town",
    "นัดเช้า ทีมมาตรงเวลา อธิบายก่อนทำ และเก็บพื้นที่หน้าบ้านสะอาดดีมาก":"The team arrived on time, explained the work clearly and left the area clean.",
    "จัดรอบดูแลบ่อดักไขมันให้ครัวได้ชัดเจน ลดปัญหากลิ่นช่วงลูกค้าเยอะ":"A clear grease-trap maintenance schedule helped our kitchen reduce odour during busy periods.",
    "ติดต่อสะดวก ส่งตำแหน่งแล้วประเมินเบื้องต้นได้เลย งานเรียบร้อยและสื่อสารดี":"Easy to contact, helpful initial assessment from our location details, and professional communication throughout.",
    "แสดงทั้งประสบการณ์ที่ลูกค้าแบ่งปันกับเราและรีวิวจาก Google Maps โดยสามารถเลือกและจัดลำดับได้":"A selected mix of customer feedback shared with our team and reviews published on Google Maps.",
    "สูบส้วม น้ำเสีย ไขมัน และสิ่งปฏิกูลทุกประเภท":"Septic, wastewater and grease pumping",
    "แก้ท่อตันด้วยงูเหล็ก: ชักโครก ท่อพื้นห้องน้ำ และซิงค์น้ำ":"Blocked drain clearing for toilets, floor drains and sinks",
    "ขุดลอกท่อระบายน้ำ และล้างทำความสะอาดถังเก็บน้ำ":"Drain dredging and water storage tank cleaning",
    "วางระบบถังบำบัด บ่อเกรอะ วางหรือย้ายระบบท่อน้ำ":"Septic tank, cesspit and water pipe installation or relocation",
    "ติดตั้งสุขภัณฑ์และท่อระบายน้ำพื้น Floor Drain":"Sanitary fixture and floor-drain installation",
    "หมายเหตุ":"Note"
  });
  Object.assign(translations, {
    "ขอราคาหน้างาน →":"Contact us",
    "ขอราคาหน้างาน":"Contact us",
    "ปรึกษาเพื่อประเมินก่อนได้ฟรีที่ →":"Message us",
    "ปรึกษาเพื่อประเมินก่อนได้ฟรีที่":"Message us",
    "ประเมินตามหน้างานหรือตามตกลง":"Quoted after a site assessment",
    "ขอประเมินฟรี":"Message us",
    "หากเบราว์เซอร์บล็อก Facebook Feed สามารถกดปุ่มด้านล่างเพื่อเปิดเพจได้ทันที":"If Facebook blocks the embedded feed, use the button below to open our page."
  });
  Object.assign(translations, {
    "ปรึกษาฟรี":"Free Consult",
    "ล้างทำความสะอาดถังเก็บน้ำอย่างเป็นขั้นตอน สำหรับบ้านพัก ธุรกิจ และอาคารทุกประเภท":"Step-by-step water tank cleaning for homes, businesses and managed properties.",
    "สำรวจพื้นที่ วางแผน และติดตั้งระบบถังบำบัดให้เหมาะกับการใช้งานของแต่ละอาคาร":"Site survey, planning and septic system installation matched to each property.",
    "วางระบบหรือย้ายแนวท่อน้ำให้เหมาะกับพื้นที่และการใช้งาน พร้อมประเมินหน้างานก่อนเริ่ม":"Water pipe installation or relocation planned around the site and its daily use.",
    "ตรวจ ซ่อม ติดตั้ง และดูแลงานสุขภัณฑ์ ห้องน้ำ หรืออะไหล่ตามสภาพหน้างาน":"Inspection, repair and installation of toilets, sanitary fixtures and replacement parts.",
    "อุปกรณ์มาตรฐาน ทำงานปลอดภัย":"Standard Equipment • Safe Operation","อุปกรณ์มาตรฐาน ทำงานปลอดภัย หายห่วง":"Professional equipment for safer, reliable work",
    "เลือกใช้อุปกรณ์ที่ได้มาตรฐาน ISO หรือมาตรฐานสากลที่เกี่ยวข้องตามประเภทการใช้งาน พร้อมตรวจสภาพก่อนออกงาน":"We select equipment manufactured to relevant ISO or international standards and inspect it before dispatch.",
    "รถสูบและระบบถัง":"Vacuum trucks and tank systems","ตรวจระบบสูบ วาล์ว ถัง และจุดเชื่อมต่อก่อนใช้งาน":"Pumps, valves, tanks and connections are checked before use.",
    "สายดูดและข้อต่อ":"Suction hoses and fittings","เลือกขนาดให้เหมาะกับงาน ตรวจรอยรั่วและการยึดล็อกทุกครั้ง":"Correct sizing, leak checks and secure connections for every job.",
    "เครื่องทะลวงท่อตัน":"Drain-clearing equipment","เครื่องมือเฉพาะทางสำหรับแก้จุดอุดตัน ลดความเสียหายต่อระบบท่อ":"Purpose-built tools clear blockages while reducing pipe damage.",
    "อุปกรณ์ป้องกันส่วนบุคคล":"Personal protective equipment","ทีมงานใช้อุปกรณ์ป้องกันและชุดทำงานที่เหมาะกับสภาพหน้างาน":"Our crew uses protective equipment suited to each work site.",
    "มาตรฐานของอุปกรณ์ขึ้นอยู่กับผู้ผลิต รุ่น และประเภทการใช้งาน ไม่ได้หมายความว่าห้างหุ้นส่วนได้รับการรับรองระบบบริหาร ISO":"Equipment standards depend on the manufacturer, model and intended use; this does not state that JINA SERVICE holds ISO management-system certification.",
    "ส่วนนี้รองรับการเพิ่มภาพผลงานใหม่ได้ตลอด":"New project photos can be added to this gallery at any time.",
    "เราไม่ได้แค่ดูดออก แต่ดูแลให้จบงาน":"We do more than pump — we complete the job properly.",
    "ห้างหุ้นส่วนจำกัด จินา เซอร์วิส ดำเนินงานโดยทีมที่แต่งกายเป็นมาตรฐาน รถและอุปกรณ์มีการดูแลพร้อมใช้งาน เพื่อให้งานหน้างานเป็นระบบ ปลอดภัย และรบกวนพื้นที่ให้น้อยที่สุด":"Our uniformed crew arrives with maintained vehicles and service-ready equipment, working safely and with minimal disruption.",
    "บ้าน":"Homes","คอนโด":"Condominiums","แมนชั่น":"Mansions","อพาร์ทเม้นท์":"Apartments","โรงเรียน":"Schools","โรงแรม":"Hotels","ร้านอาหาร":"Restaurants","ร้านค้า":"Shops","ออฟฟิศ":"Offices","อาคารสำนักงาน":"Commercial buildings",
    "ราคาจริงขึ้นกับปริมาตร ระยะสาย ระยะทาง และการเข้าถึง กรุณาส่งข้อมูลเพื่อประเมินที่แม่นยำ":"Final pricing depends on tank volume, hose length, travel and site access. Contact us for an accurate quotation.",
    "บ่อขนาดเล็ก / เข้าถึงสะดวก":"Small tank / easy access","นิยม":"Popular","ประเมินตามหน้างาน":"Site quotation","ร้านอาหาร ออฟฟิศ โรงเรียน":"Restaurants, offices and schools","สัญญารายรอบ":"Scheduled service plan","วางตารางดูแล ลดงานฉุกเฉิน":"Planned maintenance to reduce emergencies",
    "* ราคาเริ่มต้นเป็นตัวอย่างสำหรับงานทั่วไป ยืนยันราคาอีกครั้งหลังรับรายละเอียดหน้างาน":"*Starting prices are indicative. We confirm the quotation after reviewing the site details.",
    "เปิดสถานที่จริงใน Google Maps →":"Open our location in Google Maps →",
    "ดูดส้วม ท่อตัน ภูเก็ต จินาเซอร์วิส":"JINA SERVICE Phuket",
    "LINE ID หรือ Facebook (ถ้ามี)":"LINE ID or Facebook (optional)",
    "พื้นที่ / ตำบลในภูเก็ต":"Area / Subdistrict in Phuket",
    "เลือกตำบลในภูเก็ต":"Select Phuket subdistrict",
    "ขนาดบ่อ (ถ้าทราบ)":"Tank capacity (if known)",
    "สำนักงาน / ร้านค้า":"Office / Commercial shop",
    "โรงแรม / รีสอร์ต":"Hotel / Resort",
    "โรงเรียน / องค์กร":"School / Organization",
    "สนใจสมัครสมาชิก และยินยอมให้ JINA SERVICE ใช้ข้อมูลติดต่อเพื่อแจ้งโปรโมชั่น":"Subscribe for membership and allow JINA SERVICE to contact you for promotional updates",
    "จินาเซอร์วิสทีม เคลียร์จบทุกปัญหาทั่วภูเก็ต":"Jina Service Team — Resolving any septic and wastewater issue across Phuket.",
    "หากเลือกสมัคร กรุณากรอกชื่อและเบอร์โทรให้ครบ":"If subscribing, please provide your name and phone number.",
    "ส่งข้อมูลให้ทีมประเมินฟรี →":"Send free estimate request →",
    "โปรดอย่าลังเลที่จะโทรหาเรา เพราะเรายินดีให้คำปรึกษาเหมือนเพื่อน":"Feel free to call us — we are always happy to advise you like a friend.",
    "ตำบลตลาดใหญ่":"Talat Yai",
    "ตำบลตลาดเหนือ":"Talat Nuea",
    "ตำบลเกาะแก้ว":"Koh Kaew",
    "ตำบลรัษฎา":"Rassada",
    "ตำบลวิชิต":"Vichit",
    "ตำบลฉลอง":"Chalong",
    "ตำบลราไวย์":"Rawai",
    "ตำบลกะรน":"Karon",
    "ตำบลกะทู้":"Kathu",
    "ตำบลป่าตอง":"Patong",
    "ตำบลกมลา":"Kamala",
    "ตำบลเทพกระษัตรี":"Thepkrasattri",
    "ตำบลศรีสุนทร":"Srisoonthorn",
    "ตำบลเชิงทะเล":"Cherngtalay",
    "ตำบลป่าคลอก":"Pa Klok",
    "ตำบลไม้ขาว":"Mai Khao",
    "ตำบลสาคู":"Sakhu",
    "ไม่ทราบ / ให้ช่างประเมินหน้างาน":"Not sure / On-site assessment",
    "ถังมาตรฐาน 1,000 ลิตร":"Standard tank 1,000 litres",
    "ถังมาตรฐาน 1,600 ลิตร":"Standard tank 1,600 litres",
    "ถังมาตรฐาน 2,000 ลิตร":"Standard tank 2,000 litres",
    "ถังขนาดใหญ่ 3,000–5,000 ลิตร":"Large tank 3,000–5,000 litres",
    "บ่อเกรอะคอนกรีต / บ่อซึม":"Concrete septic / cesspool",
    "บ่อดักไขมันร้านอาหาร":"Restaurant grease trap",
    "f   เปิดเพจ Facebook →":"Open our Facebook page →","สื่อทั้งหมดเป็นเนื้อหาจากเพจ Facebook ของ JINA SERVICE":"All media is provided directly by the JINA SERVICE Facebook page.","หาก Feed ไม่แสดง เปิดดูบน Facebook →":"If the feed is unavailable, open Facebook →",
    "สูบสิ่งปฏิกูล ทุกประเภท":"All wastewater pumping","ดูดส้วม สูบส้วม":"Septic tank pumping","งานทะลวงท่อตัน":"Blocked drain clearing","งานขุดลอกท่อระบายน้ำ":"Drain dredging","งานจัดการน้ำเสีย":"Wastewater management","งานทำความสะอาดถังบำบัดและถังเก็บน้ำ":"Septic and water tank cleaning","งานวางระบบถังบำบัด":"Septic system installation"
  });
  Object.assign(translations, {
    "อุปกรณ์มาตรฐาน\nทำงานปลอดภัย หายห่วง":"Certified gear for safe work",
    "อุปกรณ์มาตรฐาน ทำงานปลอดภัย หายห่วง":"Certified gear for safe work",
    "อุปกรณ์มาตรฐาน":"Certified gear",
    "ทำงานปลอดภัย หายห่วง":"for safe work",
    "เราไม่ได้แค่ดูดออก\nแต่ดูแลให้จบงาน":"Beyond pumping — we finish the job properly",
    "เราไม่ได้แค่ดูดออก":"Beyond pumping —",
    "แต่ดูแลให้จบงาน":"we finish the job properly",
    "บริการเกี่ยวกับระบบบำบัดและสุขาภิบาล":"Wastewater & Septic Services",
    "บริการสูบส้วม สิ่งปฏิกูลทุกประเภท ครบวงจร":"Septic & Waste Pumping","บริการสูบส้วมและระบบบำบัด":"Wastewater & Septic Services",
    "ประมวลภาพงานปฏิบัติการจริงทั่วภูเก็ต ทั้งบ้านพัก โรงแรม คอนโด สายการบิน และเทศกาลระดับประเทศ":"Real job photos across Phuket — residences, hotels, condos, airlines and festivals.",
    "ทั้งหมด":"All",
    "ราคาเข้าใจง่าย ก่อนทีมออกเดินทาง":"Clear Upfront Rates",
    "ส้วมเต็ม ท่อตัน โทรหาเรา — พร้อมออกหน้างานทันที":"Septic full or drain blocked? Call us — ready to dispatch now!",
    "อย่าลังเลถ้าส้วมเต็ม รีบโทรหาเรา เราพร้อมไปทันที":"Septic full or drain blocked? Call us — ready to dispatch now!",
    "อย่าลังเลถ้าส้วมเต็ม รีบโทรมาเลยจ้าาา เราจะไปในทันที 😊":"Septic full or drain blocked? Call us — ready to dispatch now!",
    "สูบส้วม ท่อตัน เรียกใช้มือโปร จินาเซอร์วิส":"JINA SERVICE Phuket — Official Location",
    "แจ้งขอบเขตและราคาให้เข้าใจก่อนทำงาน":"Clear scope and pricing before work begins",
    "เลือกเครื่องมือและรถตามสภาพพื้นที่จริง":"Equipment and truck selected for the actual site",
    "ตรวจความเรียบร้อยร่วมกันหลังจบงาน":"Final inspection and a clean handover",
    "รับประกันตามประเภทงาน หรือ 6 เดือน–1 ปี ยืนยันเงื่อนไขก่อนเริ่มงาน":"1–12 months warranty depending on job scope or agreed terms.",
    "มีการรับประกันตามประเภทงาน 1–12 เดือน โดยแจ้งเงื่อนไขก่อนเริ่มงาน":"1–12 months warranty depending on job scope or agreed terms.",
    "ราคาเริ่มต้นเป็นตัวอย่างสำหรับงานทั่วไป ยืนยันราคาอีกครั้งหลังรับรายละเอียดหน้างาน":"Starting prices are indicative. We confirm the quotation after reviewing the site details.",
    "ตำบลตลาดใหญ่ • ตำบลตลาดเหนือ • ตำบลเกาะแก้ว • ตำบลรัษฎา • ตำบลวิชิต • ตำบลฉลอง • ตำบลราไวย์ • ตำบลกะรน":"Talat Yai • Talat Nuea • Ko Kaeo • Ratsada • Wichit • Chalong • Rawai • Karon",
    "ตำบลกะทู้ • ตำบลป่าตอง • ตำบลกมลา":"Kathu • Patong • Kamala",
    "ตำบลเทพกระษัตรี • ตำบลศรีสุนทร • ตำบลเชิงทะเล • ตำบลป่าคลอก • ตำบลไม้ขาว • ตำบลสาคู":"Thep Krasattri • Si Sunthon • Cherng Talay • Pa Klok • Mai Khao • Sakhu",
    "เปิดสถานที่จริงใน Google Maps":"Open our location in Google Maps",
    "ควรสูบส้วมบ่อยแค่ไหน?":"How often should a septic tank be pumped?",
    "ขึ้นกับจำนวนผู้ใช้และขนาดบ่อ บ้านทั่วไปควรตรวจระดับทุก 1–3 ปี หากน้ำไหลช้า มีกลิ่น หรือเสียงผิดปกติควรให้ทีมตรวจทันที":"It depends on tank size and usage. Most homes should inspect the tank every 1–3 years, or sooner if drains slow down, odours appear or unusual sounds occur.",
    "รถเข้าซอยแคบได้หรือไม่?":"Can your truck access a narrow lane?",
    "แจ้งพิกัด รูปทางเข้า และระยะจากจุดจอดถึงฝาบ่อ ทีมจะประเมินประเภทรถและความยาวสายที่เหมาะสมก่อนนัดหมาย":"Send the location, access photos and distance from parking to the tank. We will select the right truck and hose length before confirming the appointment.",
    "รับดูแลโรงแรมหรือร้านอาหารเป็นรอบหรือไม่?":"Do you offer scheduled service for hotels and restaurants?",
    "รับบริการแบบรายครั้งและวางรอบป้องกันสำหรับบ่อเกรอะ บ่อดักไขมัน และท่อระบายน้ำ เพื่อลดความเสี่ยงงานฉุกเฉิน":"Yes. We provide one-off visits and preventive schedules for septic tanks, grease traps and drains to reduce emergency callouts.",
    "ค่าบริการสูบส้วมเริ่มต้นเท่าไร?":"How much does septic pumping start from?",
    "งานบ้านพักทั่วไปเริ่มต้น 1,200 บาท ราคาจริงขึ้นกับปริมาตรบ่อ ระยะสาย ระยะทาง และการเข้าถึง ทีมจะแจ้งราคาก่อนเริ่มงาน":"Typical residential service starts from THB 1,200. Final pricing depends on tank volume, hose length, travel and site access, and is confirmed before work begins.",
    "JINA SERVICE ให้บริการพื้นที่ใดบ้าง?":"Which areas does JINA SERVICE cover?",
    "ให้บริการทั่วภูเก็ต ครอบคลุมเมืองภูเก็ต ถลาง เชิงทะเล ไม้ขาว ป่าตอง กมลา ราไวย์ และพื้นที่ใกล้เคียง":"We serve Phuket Town, Thalang, Cherng Talay, Mai Khao, Patong, Kamala, Rawai and nearby areas across Phuket.",
    "งานทะลวงท่อตันกับขุดลอกท่อต่างกันอย่างไร?":"What is the difference between drain clearing and drain dredging?",
    "ทะลวงท่อตันเน้นเปิดจุดอุดตันเฉพาะหน้า ส่วนขุดลอกท่อเป็นการนำตะกอนและสิ่งสะสมออกจากแนวท่อ ทีมจะประเมินวิธีที่เหมาะกับอาการจริง":"Drain clearing targets a specific blockage. Dredging removes accumulated sediment along a drain run. Our team assesses which method fits the symptoms.",
    "รับล้างหรือติดตั้งถังดักไขมันหรือไม่?":"Do you clean and install grease traps?",
    "รับทั้งทำความสะอาดและติดตั้งถังดักไขมันสำหรับบ้าน ร้านอาหาร โรงแรม และครัวเชิงพาณิชย์ โดยประเมินขนาดตามปริมาณการใช้งาน":"Yes. We clean and install grease traps for homes, restaurants, hotels and commercial kitchens, sized to actual usage.",
    "งานมีการรับประกันหรือไม่?":"Is the work covered by a warranty?",
    "มีการรับประกันตามประเภทงาน หรือ 6 เดือน–1 ปี โดยทีมจะแจ้งขอบเขตและเงื่อนไขให้ทราบก่อนเริ่มงาน":"1–12 months warranty depending on job scope or agreed terms, confirmed before work begins.",
    "มีการรับประกันตามประเภทงาน 1–12 เดือน โดยแจ้งเงื่อนไขก่อนเริ่มงาน":"1–12 months warranty depending on job scope or agreed terms.",
    "เปิดเพจ Facebook":"Open Facebook page",
    "หาก Feed ไม่แสดง เปิดดูบน Facebook":"If the feed is unavailable, open Facebook"
  });
  const reverseTranslations = Object.fromEntries(Object.entries(translations).map(([th, en]) => [en, th]));
  const galleryHeading = q("#work-heading");
  const galleryHeadCopy = galleryHeading?.closest(".section-head")?.querySelector(":scope > p");

  const phoneSvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.1 3.5 9.4 7a1.5 1.5 0 0 1-.2 1.8l-1.4 1.4a15.5 15.5 0 0 0 6 6l1.4-1.4a1.5 1.5 0 0 1 1.8-.2l3.5 2.3a1.5 1.5 0 0 1 .6 1.7l-.6 2.1a2 2 0 0 1-1.9 1.4C9.4 22.1 1.9 14.6 1.9 5.4A2 2 0 0 1 3.3 3.5l2.1-.6a1.5 1.5 0 0 1 1.7.6Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  qa(".expertise-contacts a").forEach((link) => {
    if (!q("svg", link)) link.insertAdjacentHTML("afterbegin", phoneSvg);
  });
  const messengerUrl = "https://www.facebook.com/messages/t/100545618430726?utm_source=jina_service_website&utm_medium=social&utm_campaign=Veecreate&utm_content=floating_messenger";
  qa('[data-track^="service_estimate_"], [data-track="pricing_estimate"], .service-promise a').forEach((link) => {
    link.href = messengerUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });
  
  Object.assign(translations, {"สูบสิ่งปฏิกูล แก้ท่อตัน": "Septic & Drain Care", "ครบงานระบบบำบัดทั่วภูเก็ต": "Across All Phuket", "บริการสูบสิ่งปฏิกูล ล้างถังบำบัด–ถังดักไขมัน ทะลวงท่อตัน ติดตั้งระบบบำบัด และซ่อมอะไหล่สุขภัณฑ์ สำหรับบ้าน ธุรกิจ โรงแรม และองค์กรทั่วภูเก็ต": "Fast septic pumping, grease trap cleaning, and drain clearing for homes, hotels, and businesses across Phuket.", "ทีมช่างภูเก็ต • ประสบการณ์ 30 ปี": "Phuket Technicians • 30 Years Experience", "สูบหมดจด ไร้กลิ่น": "Clean & Odorless", "• จบไวในสายเดียว": "• Solved in One Call", "สายด่วนประเมินฟรี • โทรทันที": "Rapid Emergency Hotline • Call Now", "เราไม่ได้แค่ดูดออก\nแต่ดูแลให้จบงาน": "Beyond pumping\nWe finish the job properly", "เราไม่ได้แค่ดูดออก": "Beyond pumping", "แต่ดูแลให้จบงาน": "We finish the job properly", "เราไม่ได้แค่ดูดออก แต่ดูแลให้จบงาน": "Beyond pumping. We finish the job properly.", "Beyond pumping — we finish the job properly": "Beyond pumping\nWe finish the job properly", "เริ่มต้น ฿1,xxx*": "Start ฿1,xxx*", "เริ่มต้น ฿1,200*": "Start ฿1,200*", "ราคาเริ่มต้น ฿1,xxx*": "Start ฿1,xxx*", "ราคาเริ่มต้น ฿1,200*": "Start ฿1,200*", "From ฿1,xxx*": "Start ฿1,xxx*", "From ฿1,200*": "Start ฿1,200*", "สูบส้วม น้ำเสีย ไขมัน และสิ่งปฏิกูลทุกประเภท": "All Wastewater, Grease & Septic Pumping", "สูบส้วม น้ำเสีย ไขมัน": "All Wastewater, Grease", "และสิ่งปฏิกูลทุกประเภท": "& Septic Pumping", "ทำความสะอาดหรือติดตั้งถังดักไขมัน": "Grease trap cleaning & installation", "ทำความสะอาดและสูบถังบำบัด": "Septic tank pumping & cleaning", "แก้ไขท่อระบายน้ำอุดตัน": "Blocked drain clearing", "ซ่อมและติดตั้งอะไหล่สุขภัณฑ์": "Toilet fixture & spare-part installation", "จัดการสิ่งปฏิกูล ทุกประเภท": "All Waste & Septic Services", "จัดการสิ่งปฏิกูลทุกประเภท": "All Waste & Septic Services", "สาระน่ารู้ (Blog)": "Blog & Articles", "สาระน่ารู้": "Blog & Articles", "สาระน่ารู้ & บทความ": "Blog & Articles", "ภาพผลงานจริง": "Work Gallery", "มาตรฐานการทำงาน": "Work Standards", "อัตราค่าบริการ": "Service Pricing", "พื้นที่บริการ 17 ตำบล": "Coverage (17 Subdistricts)", "คำถามที่พบบ่อย": "FAQ", "คำถามพบบ่อย": "FAQ", "บริการของเรา": "Our Services", "ตำบลครอบคลุมทั่วภูเก็ต": "Subdistricts across Phuket", "(เอกสารจดทะเบียน)": "(Registration Document)", "✓ บริษัทจดทะเบียนถูกต้อง": "✓ Licensed & Registered", "✓ นัดหมายตรงเวลา": "✓ Punctual Appointment", "✓ ดูแลพื้นที่หลังจบงาน": "✓ Post-Job Site Cleanup", "✓ ความเชี่ยวชาญสูง": "✓ High Expertise", "บริษัทจดทะเบียนถูกต้อง": "Licensed & Registered", "นัดหมายตรงเวลา": "Punctual Appointment", "ดูแลพื้นที่หลังจบงาน": "Post-Job Site Cleanup", "ความเชี่ยวชาญสูง": "High Expertise", "ประสบการณ์จากลูกค้าของเรา": "Customer Stories & Experiences", "ดูรีวิวบน Google Maps": "View Reviews on Google Maps", "ประสบการณ์ลูกค้า": "Customer Story", "“นัดเช้า ทีมมาตรงเวลา อธิบายก่อนทำ และเก็บพื้นที่หน้าบ้านสะอาดดีมาก”": "“Booked a morning slot. The crew arrived right on time, explained the steps beforehand, and left the front yard spotless.”", "ลูกค้าบ้านพัก • ฉลอง": "Residential Homeowner • Chalong", "“จัดรอบดูแลบ่อดักไขมันให้ครัวได้ชัดเจน ลดปัญหากลิ่นช่วงลูกค้าเยอะ”": "“Set up a clear maintenance schedule for our kitchen grease trap. Eliminated odor issues completely during rush hours.”", "ผู้จัดการร้านอาหาร • ป่าตอง": "Restaurant Manager • Patong", "“ติดต่อสะดวก ส่งตำแหน่งแล้วประเมินเบื้องต้นได้เลย งานเรียบร้อยและสื่อสารดี”": "“Super easy to contact. Sent our location and got an initial estimate right away. Clean work and great communication.”", "ผู้ดูแลอาคาร • เมืองภูเก็ต": "Property Manager • Phuket Town", "แสดงทั้งประสบการณ์ที่ลูกค้าแบ่งปันกับเราและรีวิวจาก Google Maps โดยสามารถเลือกและจัดลำดับได้": "Featuring verified customer feedback and Google Maps reviews curated for transparency.", "อัปเดตงานจริงสดจากหน้าเพจ Facebook": "Live job updates from Facebook", "ข้อมูลและโพสต์ทั้งหมดซิงค์จากเพจทางการ JINA SERVICE": "All posts synced directly from official JINA SERVICE Facebook", "กดติดตาม": "Follow", "+ กดติดตามเพจ": "+ Follow Page", "กดติดตามเพจ @jinaservice": "Follow @jinaservice on Facebook", "ผู้ติดตาม 611+ คน": "611+ Followers", "เปิด 24 ชม.": "Open 24 Hours", "เชื่อมต่อข้อมูลสดกับ Facebook Page สำเร็จ": "Connected to official Facebook Page", "ดูรีวิวงานจริง 24 ชม. • สิทธิ์คิวด่วน": "24/7 Verified Job Reviews • Priority Dispatch"});
  Object.assign(translations, (window.__JINA__ && window.__JINA__.i18n) || {});
  let currentLang = "th";
  const languageButton = q('[data-track="language"]');
  const translatePage = (language) => {
    const savedScrollY = window.scrollY;
    const revDict = Object.fromEntries(Object.entries(translations).map(([th, en]) => [en, th]));
    const dictionary = language === "en" ? translations : revDict;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      if (["SCRIPT", "STYLE"].includes(node.parentElement?.tagName)) return;
      const value = node.nodeValue.trim();
      if (!dictionary[value]) return;
      node.nodeValue = node.nodeValue.replace(value, dictionary[value]);
    });
    const attributeTranslations = {
      "ชื่อผู้ติดต่อ":"Full name",
      "กรอกเฉพาะตัวเลข":"Numbers only",
      "เช่น @lineid, 0954241968 หรือชื่อ Facebook":"e.g. @lineid, 0954241968 or Facebook name",
      "พิมพ์หรือเลือก (เช่น ไม่ทราบ)":"Type or select (e.g. Unknown)",
      "ชื่อผู้ใช้หรือลิงก์ Facebook":"Messenger username or Facebook URL",
      "เช่น 0954241968 หรือ @lineid":"Phone number or LINE ID",
      "เช่น ราไวย์":"e.g. Rawai",
      "เช่น 1,600 ลิตร":"e.g. 1,600 litres",
      "อาการที่พบ เวลาที่สะดวก หรือข้อมูลทางเข้ารถ":"Describe the issue, preferred time and vehicle access"
    };
    qa("input[placeholder], textarea[placeholder]").forEach((field) => {
      const th = field.dataset.placeholderTh || field.getAttribute("placeholder");
      field.dataset.placeholderTh = th;
      field.setAttribute("placeholder", language === "en" ? (attributeTranslations[th] || translations[th] || th) : th);
    });
    qa("optgroup").forEach((grp) => {
      const th = grp.dataset.labelTh || grp.getAttribute("label");
      grp.dataset.labelTh = th;
      grp.setAttribute("label", language === "en" ? (dictionary[th] || th) : th);
    });
    qa("select option").forEach((opt) => {
      const th = opt.dataset.textTh || opt.textContent.trim();
      opt.dataset.textTh = th;
      opt.textContent = language === "en" ? (dictionary[th] || th) : th;
    });
    qa("#tank-size-options option").forEach((opt) => {
      const th = opt.dataset.valTh || opt.getAttribute("value");
      opt.dataset.valTh = th;
      opt.setAttribute("value", language === "en" ? (dictionary[th] || th) : th);
    });
    qa("[data-bilingual]").forEach((element) => { element.textContent = element.dataset[language]; });
    currentLang = language;
    document.documentElement.lang = language;
    if (languageButton) languageButton.textContent = language === "th" ? "EN" : "ไทย";
    showGallery(galleryIndex, false);
    if (typeof showStandard === "function") showStandard(standardIndex);

    // Luxury smooth blur-fade re-trigger on language toggle
    qa(".section-head h2, .services-heading, .equipment-head h2, #work-heading, .work-gallery h2, .standards-copy h2, .expertise-heading, #pricing h2, .review-heading-row h2, .reviews h2, .coverage-copy h2, .contact-section h2, .contact-heading, .faq h2, .social-copy h2, #social-heading, .urgent-headline").forEach(h => {
      if (!h.classList.contains("is-revealed")) return; // off-screen ones replay when scrolled into view
      h.classList.remove("is-revealed");
      void h.offsetWidth;
      h.classList.add("is-revealed");
    });
    window.scrollTo(0, savedScrollY);
    requestAnimationFrame(() => {
      window.scrollTo(0, savedScrollY);
    });
  };
  languageButton?.addEventListener("click", (e) => {
    e.preventDefault();
    translatePage(currentLang === "th" ? "en" : "th");
  });

  // Facebook card direct launch
  const fbWrap = q(".fb-embed-wrap iframe");
  if (fbWrap) {
    fbWrap.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
  }

  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const revealTargets = qa(".section-head, .service-card, .equipment-card, .field-photo, .standards-copy, .expertise-copy, .license-card, .price-card, .review-card, .coverage-grid > *, .contact-grid > *, .social-grid > *");
    revealTargets.forEach((element) => element.classList.add("reveal-ready"));
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: .12, rootMargin: "0px 0px -7% 0px" });
    revealTargets.forEach((element) => revealObserver.observe(element));
  }

  const heroSlideAssets = ((window.__JINA__ && window.__JINA__.heroSlides) || []).map((slide) => [slide.image, slide.position || "center"]);
  const heroSlidesRoot = q(".hero-slides");
  const heroDotsRoot = q(".hero-dots");
  const slideStyle = (src, position) => 'background-image:linear-gradient(90deg,rgba(9,14,11,.93) 0%,rgba(9,14,11,.68) 48%,rgba(9,14,11,.12) 100%),url("' + src + '");background-position:' + position;
  const loadLaterSlides = () => {
    if (!heroSlidesRoot) return;
    qa(".hero-slide", heroSlidesRoot).forEach((slide, index) => {
      if (index > 0 && !slide.style.backgroundImage) {
        slide.style.cssText = slideStyle(...heroSlideAssets[index]);
      }
    });
  };
  if (heroSlidesRoot && heroDotsRoot && heroSlideAssets.length) {
    // Keep the server-rendered slides/dots: replacing slide 1 makes the browser re-report LCP after this script runs
    if (qa(".hero-slide", heroSlidesRoot).length !== heroSlideAssets.length) {
      heroSlidesRoot.innerHTML = heroSlideAssets.map((_, index) => '<div class="hero-slide' + (index === 0 ? ' active' : '') + '"></div>').join("");
      heroDotsRoot.innerHTML = heroSlideAssets.map((_, index) => '<button type="button" class="' + (index === 0 ? 'active' : '') + '" aria-label="' + (index + 1) + ' / ' + heroSlideAssets.length + '"></button>').join("");
    }
    // Slide 1 paints immediately (LCP); later slides fetch after 4.5s or on interaction so they don't compete with first paint
    const laterTimer = setTimeout(loadLaterSlides, 4500);
    ["scroll", "pointerdown", "touchstart", "keydown"].forEach((e) => {
      window.addEventListener(e, () => { clearTimeout(laterTimer); loadLaterSlides(); }, { once: true, passive: true });
    });
  }
  const heroSlides = qa(".hero-slide");
  const heroDots = qa(".hero-dots button");
  let heroIndex = 0;
  let heroTimer;
  const showHero = (index) => {
    loadLaterSlides();
    heroIndex = (index + heroSlides.length) % heroSlides.length;
    heroSlides.forEach((slide, i) => slide.classList.toggle("active", i === heroIndex));
    heroDots.forEach((dot, i) => dot.classList.toggle("active", i === heroIndex));
  };
  heroDots.forEach((dot, index) => dot.addEventListener("click", () => {
    showHero(index);
    if (heroTimer) { clearInterval(heroTimer); heroTimer = setInterval(() => showHero(heroIndex + 1), 3000); }
  }));
  if (heroSlides.length > 1 && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    // Start rotating on first interaction (or after 8s): an earlier slide change gets re-counted as a late LCP
    let rotationStarted = false;
    const startRotation = () => {
      if (rotationStarted) return;
      rotationStarted = true;
      ["scroll", "pointerdown", "keydown", "touchstart"].forEach((type) => removeEventListener(type, startRotation));
      heroTimer = setInterval(() => showHero(heroIndex + 1), 3000);
    };
    ["scroll", "pointerdown", "keydown", "touchstart"].forEach((type) => addEventListener(type, startRotation, { once: true, passive: true }));
    setTimeout(startRotation, 8000);
  }

  const proofTargets = [
    { target: 30, suffix: "+" },
    { target: 1500, suffix: "+" },
    { target: 24, suffix: "/7" },
    { target: 17, suffix: "" },
    { target: 100, suffix: "%" }
  ];
  qa(".proof strong").forEach((element, index) => {
    const num = element.querySelector(".stat-number");
    const conf = num && num.dataset.target ? { target: Number(num.dataset.target), suffix: num.dataset.suffix || "" } : proofTargets[index];
    if (!conf) return;
    const { target, suffix } = conf;
    element.parentElement?.classList.add("proof-item");
    element.setAttribute("aria-label", (target >= 1000 ? new Intl.NumberFormat("en-US").format(target) : target) + suffix);
    const renderValue = (value) => { 
      const formatted = value >= 1000 ? new Intl.NumberFormat("en-US").format(value) : value;
      element.textContent = formatted + suffix; 
    };
    renderValue(0);
    const startCounter = () => {
      const start = performance.now();
      const run = (now) => {
        const progress = Math.min((now - start) / 1450, 1);
        const value = Math.round(target * (1 - Math.pow(1 - progress, 3)));
        renderValue(value);
        if (progress < 1) requestAnimationFrame(run);
      };
      requestAnimationFrame(run);
    };
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        startCounter();
      }, { threshold: .2 });
      observer.observe(element);
    } else startCounter();
  });

  const standardImages = qa(".field-photo > img");
  const standardDots = qa(".standard-dots button");
  let standardIndex = 0;
  const showStandard = (index) => {
    standardIndex = (index + standardImages.length) % standardImages.length;
    standardImages.forEach((image, i) => image.classList.toggle("active", i === standardIndex));
    standardDots.forEach((dot, i) => dot.classList.toggle("active", i === standardIndex));
  };
  standardDots.forEach((dot, index) => dot.addEventListener("click", () => showStandard(index)));
  if (standardImages.length > 1 && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    setInterval(() => showStandard(standardIndex + 1), 4000);
  }

    const galleryFigureButton = q(".gallery-carousel figure button.gallery-slide-btn") || q(".gallery-carousel figure > button:not(.gallery-fullscreen-btn)") || q(".gallery-carousel figure button");
  const galleryCaption = q(".gallery-caption");
  const galleryCounter = q(".gallery-counter");
  const filterButtons = qa(".gallery-filters button");
  const thumbsTrack = q("#gallery-thumbs-track");
  const thumbPrevBtn = q(".thumb-nav-btn.thumb-prev");
  const thumbNextBtn = q(".thumb-nav-btn.thumb-next");
  const carouselView = q(".gallery-carousel-view");
  const gridView = q("#gallery-grid-view");
  const viewModeButtons = qa(".view-mode-btn");

  let category = "all";
  let galleryIndex = 0;
  let viewMode = "carousel";

  const filtered = () => gallery.filter((item) => category === "all" || item.category === category);

  // Render thumbnail strip
  const renderThumbs = () => {
    if (!thumbsTrack) return;
    thumbsTrack.innerHTML = "";
    const items = filtered();
    items.forEach((item, idx) => {
      const btn = document.createElement("button");
      btn.className = "gallery-thumb-item" + (idx === galleryIndex ? " active" : "");
      btn.type = "button";
      btn.setAttribute("aria-label", "เลือกภาพที่ " + (idx + 1) + ": " + (currentLang === "th" ? item.th : item.en));

      // Small *.thumb.webp next to each image; falls back to the full file when a new upload has no thumb yet
      const thumbImg = (src) => `<img src="${src.replace(/\.[a-z0-9]+$/i, ".thumb.webp")}" onerror="this.onerror=null;this.src='${src}'" alt="${currentLang === "th" ? item.altTh : item.altEn}" loading="lazy" />`;
      if (item.type === "video") {
        const posterSrc = item.poster || item.src.replace(/\.webm$/i, "-poster.jpg");
        btn.innerHTML = thumbImg(posterSrc) + `<span class="thumb-video-badge">▶</span>`;
      } else {
        btn.innerHTML = thumbImg(item.src);
      }

      btn.addEventListener("click", () => {
        showGallery(idx, true);
      });
      thumbsTrack.appendChild(btn);
    });
  };

  // Render Grid View
  const renderGrid = () => {
    if (!gridView) return;
    gridView.innerHTML = "";
    const items = filtered();
    items.forEach((item, idx) => {
      const card = document.createElement("div");
      card.className = "grid-item-card";
      card.setAttribute("tabindex", "0");
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", currentLang === "th" ? item.th : item.en);

      if (item.type === "video") {
        const posterSrc = item.poster || item.src.replace(/\.webm$/i, "-poster.jpg");
        card.innerHTML = `<img src="${posterSrc}" alt="${currentLang === "th" ? item.altTh : item.altEn}" loading="lazy" /><div class="grid-item-overlay"><span>${currentLang === "th" ? item.th : item.en}</span><span class="grid-video-icon">▶ VDO</span></div>`;
      } else {
        card.innerHTML = `<img src="${item.src}" alt="${currentLang === "th" ? item.altTh : item.altEn}" loading="lazy" /><div class="grid-item-overlay"><span>${currentLang === "th" ? item.th : item.en}</span></div>`;
      }

      card.addEventListener("click", () => {
        const fullIndex = gallery.indexOf(item);
        lightboxIndex = fullIndex !== -1 ? fullIndex : 0;
        openLightbox(lightboxIndex);
      });
      gridView.appendChild(card);
    });
  };

  const showGallery = (index, autoScrollThumb = false) => {
    const items = filtered();
    if (!items.length) return;
    galleryIndex = (index + items.length) % items.length;
    const item = items[galleryIndex];
    const isVideo = item.type === "video";

    let bgMedia = q(".gallery-carousel figure button .gallery-media-bg");
    if (!bgMedia) {
      bgMedia = document.createElement("img");
      bgMedia.className = "gallery-media-bg";
      bgMedia.loading = "lazy";
      bgMedia.decoding = "async";
      bgMedia.setAttribute("aria-hidden", "true");
      galleryFigureButton?.prepend(bgMedia);
    }

    let media = q(".gallery-carousel figure button .gallery-media");
    if (!media) {
      const oldImg = q(".gallery-carousel figure button img:not(.gallery-media-bg)");
      if (oldImg) oldImg.remove();
    }

    if (isVideo) {
      bgMedia.style.display = "none";
      if (!media || media.tagName !== "VIDEO") {
        media?.remove();
        media = document.createElement("video");
        media.className = "gallery-media gallery-video";
        media.setAttribute("playsinline", "");
        media.setAttribute("muted", "");
        media.setAttribute("autoplay", "");
        media.setAttribute("loop", "");
        galleryFigureButton?.append(media);
      }
      media.src = item.src;
      media.muted = true;
      media.play().catch(() => {});
    } else {
      bgMedia.style.display = "block";
      bgMedia.src = item.src;
      if (!media || media.tagName !== "IMG") {
        media?.remove();
        media = document.createElement("img");
        media.className = "gallery-media gallery-image";
        media.setAttribute("loading", "lazy");
        galleryFigureButton?.append(media);
      }
      media.src = item.src;
      media.alt = currentLang === "th" ? item.altTh : item.altEn;
    }

    const badgeText = isVideo
      ? (currentLang === "th" ? "▶ กดดูวิดีโอเต็มจอ" : "▶ Play Full Video")
      : (currentLang === "th" ? "🔍 ขยายเต็มจอ" : "Zoom");
    galleryCaption.innerHTML = "<span class=\"gallery-caption-title\">" + (currentLang === "th" ? item.th : item.en) + "</span><span class=\"gallery-zoom-badge\">" + badgeText + "</span>";
    if (typeof preloadNearby === "function") preloadNearby(galleryIndex);
    
    // Counter
    const curNum = q("#gallery-current-num");
    const totNum = q("#gallery-total-num");
    if (curNum && totNum) {
      curNum.textContent = galleryIndex + 1;
      totNum.textContent = items.length;
    } else if (galleryCounter) {
      galleryCounter.textContent = (galleryIndex + 1) + " / " + items.length;
    }

    // Update active thumb and auto-center thumb inside track ONLY (never scroll window)
    const thumbBtns = qa(".gallery-thumb-item");
    thumbBtns.forEach((btn, i) => {
      const isActive = i === galleryIndex;
      btn.classList.toggle("active", isActive);
      if (isActive && autoScrollThumb && thumbsTrack) {
        const scrollLeft = btn.offsetLeft - (thumbsTrack.clientWidth - btn.clientWidth) / 2;
        thumbsTrack.scrollTo({ left: Math.max(0, scrollLeft), behavior: "smooth" });
      }
    });
  };

  thumbPrevBtn?.addEventListener("click", () => {
    thumbsTrack?.scrollBy({ left: -320, behavior: "smooth" });
  });
  thumbNextBtn?.addEventListener("click", () => {
    thumbsTrack?.scrollBy({ left: 320, behavior: "smooth" });
  });

  viewModeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      viewMode = btn.dataset.mode || "carousel";
      viewModeButtons.forEach((b) => b.classList.toggle("active", b === btn));
      if (viewMode === "grid") {
        if (carouselView) {
          carouselView.style.display = "none";
          carouselView.classList.add("is-hidden");
        }
        if (gridView) {
          gridView.style.display = "grid";
          gridView.classList.remove("is-hidden");
        }
        renderGrid();
      } else {
        if (carouselView) {
          carouselView.style.display = "block";
          carouselView.classList.remove("is-hidden");
        }
        if (gridView) {
          gridView.style.display = "none";
          gridView.classList.add("is-hidden");
        }
        showGallery(galleryIndex, false);
      }
    });
  });

  // Initialize filter button states
  filterButtons.forEach((btn) => {
    btn.setAttribute("aria-pressed", btn.classList.contains("active") ? "true" : "false");
  });

  filterButtons.forEach((button) => button.addEventListener("click", () => {
    category = button.dataset.category || "all";
    filterButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("active", isActive);
      item.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
    galleryIndex = 0;
    renderThumbs();
    if (viewMode === "grid") {
      renderGrid();
    } else {
      showGallery(0, false);
    }
  }));

  q(".gallery-arrow.prev")?.addEventListener("click", () => showGallery(galleryIndex - 1, true));
  q(".gallery-arrow.next")?.addEventListener("click", () => showGallery(galleryIndex + 1, true));

  // Universal Touch Swipe Gestures: Gallery Carousel, Standards Visual, and Hero Slides
  let isCarouselSwiping = false;

  // Generic reusable swipe binder
  const bindSwipe = (element, onSwipeLeft, onSwipeRight, threshold = 35) => {
    if (!element) return;
    let sX = 0, sY = 0, dX = 0, dY = 0;
    element.addEventListener("touchstart", (e) => {
      sX = e.touches[0].clientX;
      sY = e.touches[0].clientY;
      dX = 0;
      dY = 0;
      isCarouselSwiping = false;
    }, { passive: true });

    element.addEventListener("touchmove", (e) => {
      dX = e.touches[0].clientX - sX;
      dY = e.touches[0].clientY - sY;
      if (Math.abs(dX) > 8) isCarouselSwiping = true;
    }, { passive: true });

    element.addEventListener("touchend", () => {
      if (Math.abs(dX) > threshold && Math.abs(dX) > Math.abs(dY) * 1.2) {
        if (dX < 0) {
          onSwipeLeft();
        } else {
          onSwipeRight();
        }
      }
      setTimeout(() => { isCarouselSwiping = false; }, 100);
    }, { passive: true });
  };

  // 1. Gallery Carousel Swipe (attached to full carousel container for smooth swiping)
  const galleryContainer = q(".gallery-carousel") || q(".gallery-carousel figure");
  bindSwipe(galleryContainer, () => showGallery(galleryIndex + 1, true), () => showGallery(galleryIndex - 1, true), 30);

  // 2. Standards Field-Photo Swipe
  const standardsVisual = q(".standards-visual") || q(".field-photo");
  bindSwipe(standardsVisual, () => showStandard(standardIndex + 1), () => showStandard(standardIndex - 1), 35);

  // 3. Hero Slides Swipe
  const heroSection = q(".hero");
  bindSwipe(heroSection, () => {
    const dots = qa(".hero-dots button");
    if (dots.length > 1) {
      const cur = qa(".hero-slide").findIndex(s => s.classList.contains("active"));
      const nextIdx = (cur + 1) % dots.length;
      dots[nextIdx]?.click();
    }
  }, () => {
    const dots = qa(".hero-dots button");
    if (dots.length > 1) {
      const cur = qa(".hero-slide").findIndex(s => s.classList.contains("active"));
      const prevIdx = (cur - 1 + dots.length) % dots.length;
      dots[prevIdx]?.click();
    }
  }, 40);

  if (q(".gallery-carousel")) {
    renderThumbs();
    showGallery(0, false);
  }

  let lightboxIndex = 0;
  const closeLightbox = () => {
    qa(".lightbox video").forEach((v) => v.pause());
    q(".lightbox")?.remove();
    document.body.style.overflow = "";
    document.body.classList.remove("lightbox-open");
    // Keep the page carousel on the photo the visitor last viewed full-screen
    const lastIdx = filtered().indexOf(gallery[lightboxIndex]);
    if (lastIdx !== -1 && lastIdx !== galleryIndex) showGallery(lastIdx, false);
  };
  const openLightbox = (directIndex) => {
    if (typeof directIndex === "number") {
      lightboxIndex = directIndex;
    } else {
      const currentList = filtered();
      const current = currentList[galleryIndex];
      lightboxIndex = gallery.indexOf(current);
    }
    const box = document.createElement("div");
    box.className = "lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.innerHTML = '<button class="lightbox-close" aria-label="ปิด">×</button><button class="lightbox-arrow lightbox-prev" aria-label="ภาพก่อนหน้า"><svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="15 18 9 12 15 6"></polyline></svg></button><figure><div class="lightbox-media-container"></div><figcaption></figcaption></figure><button class="lightbox-arrow lightbox-next" aria-label="ภาพถัดไป"><svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="9 18 15 12 9 6"></polyline></svg></button>';
    const render = () => {
      qa(".lightbox video", box).forEach((v) => v.pause());
      const item = gallery[lightboxIndex];
      const isVideo = item.type === "video";
      const container = q(".lightbox-media-container", box);
      container.innerHTML = "";
      if (isVideo) {
        const vid = document.createElement("video");
        vid.className = "lightbox-video";
        vid.src = item.src;
        vid.controls = true;
        vid.autoplay = true;
        vid.playsInline = true;
        container.append(vid);
      } else {
        const img = document.createElement("img");
        img.src = item.src;
        img.alt = currentLang === "th" ? item.altTh : item.altEn;
        container.append(img);
      }
      q("figcaption", box).innerHTML = (currentLang === "th" ? item.th : item.en) + '<span class="lightbox-counter">' + (lightboxIndex + 1) + " / " + gallery.length + '</span><div class="lightbox-swipe-hint"><span class="swipe-hand">👈</span> <span class="swipe-hint-text">' + (currentLang === "th" ? "ปัดซ้าย-ขวา เพื่อเปลี่ยนภาพ" : "Swipe left or right to browse") + '</span> <span class="swipe-hand">👉</span></div>';
    };
    const move = (step) => { lightboxIndex = (lightboxIndex + step + gallery.length) % gallery.length; render(); };
    q(".lightbox-close", box).onclick = closeLightbox;
    q(".lightbox-prev", box).onclick = (event) => { event.stopPropagation(); move(-1); };
    q(".lightbox-next", box).onclick = (event) => { event.stopPropagation(); move(1); };
    q("figure", box).onclick = (event) => event.stopPropagation();
    
    // Lightbox touch swipe
    let lbTouchStartX = 0;
    let lbTouchStartY = 0;
    let lbDiffX = 0;
    let lbDiffY = 0;
    q("figure", box).ontouchstart = (event) => {
      lbTouchStartX = event.touches[0].clientX;
      lbTouchStartY = event.touches[0].clientY;
      lbDiffX = 0;
      lbDiffY = 0;
    };
    q("figure", box).ontouchmove = (event) => {
      lbDiffX = event.touches[0].clientX - lbTouchStartX;
      lbDiffY = event.touches[0].clientY - lbTouchStartY;
    };
    q("figure", box).ontouchend = () => {
      if (Math.abs(lbDiffX) > 35 && Math.abs(lbDiffX) > Math.abs(lbDiffY)) {
        move(lbDiffX < 0 ? 1 : -1);
      }
    };
    box.onclick = closeLightbox;
    box._move = move;
    document.body.append(box);
    document.body.style.overflow = "hidden";
    document.body.classList.add("lightbox-open");
    render();
  };
  galleryFigureButton?.addEventListener("click", () => {
    if (isCarouselSwiping) return;
    openLightbox();
  });
  q(".gallery-fullscreen-btn")?.addEventListener("click", (e) => {
    e.stopPropagation();
    openLightbox();
  });
  addEventListener("keydown", (event) => {
    const box = q(".lightbox");
    if (!box) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") box._move(-1);
    if (event.key === "ArrowRight") box._move(1);
  });

  qa('input[inputmode="numeric"]').forEach((input) => input.addEventListener("input", () => {
    input.value = input.value.replace(/\D/g, "");
  }));
  const form = q(".contact-section form");
  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = q('button[type="submit"]', form);
    const original = button.textContent;
    button.disabled = true;
    button.textContent = "กำลังส่งข้อมูล…";
    const status = document.createElement("p");
    status.setAttribute("role", "status");
    try {
      const data = new FormData(form);
      data.append("access_key", "xxxx");
      data.append("subject", "Veecreate | ขอประเมินงาน | JINA SERVICE");
      data.append("from_name", "JINA SERVICE Website");
      data.append("replyto", data.get("email") || "xxxx@example.com");
      const response = await fetch("https://api.web3forms.com/submit", { method: "POST", body: data });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "ส่งไม่สำเร็จ");
      form.reset();
      status.className = "success";
      status.textContent = "ส่งข้อมูลเรียบร้อยแล้ว ทางทีมจะติดต่อกลับโดยเร็วที่สุดครับ";
    } catch (error) {
      status.className = "form-error";
      status.textContent = "ส่งไม่สำเร็จ กรุณาลองอีกครั้ง หรือติดต่อทางโทรศัพท์ (" + error.message + ")";
    } finally {
      q('[role="status"]', form)?.remove();
      form.append(status);
      button.disabled = false;
      button.textContent = original;
    }
  });

  q('[data-track="floating_share"]')?.addEventListener("click", async () => {
    const data = { title: document.title, text: "JINA SERVICE สูบส้วม แก้ท่อตัน ภูเก็ต", url: location.href };
    if (navigator.share) await navigator.share(data).catch(() => {});
    else await navigator.clipboard.writeText(location.href).then(() => alert("คัดลอกลิงก์แล้ว"));
  });

    // Smooth FAQ Accordion Animation (slide out / slide in)
  qa(".faq details").forEach((detail) => {
    const summary = detail.querySelector("summary");
    if (!summary) return;
    summary.addEventListener("click", (e) => {
      e.preventDefault();
      if (detail.open) {
        const startHeight = detail.offsetHeight;
        const summaryHeight = summary.offsetHeight;
        const anim = detail.animate([
          { height: startHeight + "px", opacity: 1 },
          { height: (summaryHeight + 36) + "px", opacity: 0.85 }
        ], { duration: 260, easing: "cubic-bezier(0.16, 1, 0.3, 1)" });
        anim.onfinish = () => {
          detail.removeAttribute("open");
          detail.style.height = "";
        };
      } else {
        detail.setAttribute("open", "");
        const fullHeight = detail.offsetHeight;
        const summaryHeight = summary.offsetHeight;
        detail.animate([
          { height: (summaryHeight + 36) + "px", opacity: 0.85 },
          { height: fullHeight + "px", opacity: 1 }
        ], { duration: 300, easing: "cubic-bezier(0.16, 1, 0.3, 1)" });
      }
    });
  });

  // Unified Luxury Arkitex-style Scroll Reveal Animation (Slide-Fade + Blur-Fade)
  const luxuryElements = qa(`
    .section-head h2, .services-heading, .equipment-head h2, #work-heading,
    .work-gallery h2, .standards-copy h2, .expertise-heading, #pricing h2,
    .review-heading-row h2, .reviews h2, .coverage-copy h2, .contact-section h2,
    .contact-heading, .faq h2, .social-copy h2, #social-heading,
    .kicker, .eyebrow,
    .service-card, .equipment-grid article, .standards-list li,
    .price-card, .review-grid blockquote, .location-card, .faq details,
    .expertise-panel-card, .urgent-cta
  `);
  if ("IntersectionObserver" in window) {
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) document.documentElement.classList.add("js-reveal");
    // Reveal on enter, reset on leave so the slide/blur-fade replays when scrolling up or down
    const luxuryObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.target.classList.toggle("is-revealed", entry.isIntersecting));
    }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
    luxuryElements.forEach((el) => luxuryObserver.observe(el));
  } else {
    luxuryElements.forEach((el) => el.classList.add("is-revealed"));
  }

  // Active Scroll Spy: updates active nav link WITHOUT polluting URL bar with hash (#)
  const spySections = qa("section[id]");
  const navLinks = qa(".topbar nav a, .mobile-nav-menu a");
  let currentActiveId = "";
  if ("IntersectionObserver" in window) {
    const spyObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          if (id && id !== currentActiveId) {
            currentActiveId = id;
            // Clean URL: don't pollute URL bar with # hash
            navLinks.forEach((link) => {
              link.classList.toggle("active", link.getAttribute("href") === "#" + id);
            });
          }
        }
      });
    }, { threshold: 0.25, rootMargin: "-15% 0px -45% 0px" });
    spySections.forEach((section) => spyObserver.observe(section));
  }

  // Smooth scroll on nav link click WITHOUT showing # in URL bar
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href && href.startsWith("#") && href.length > 1) {
        const targetEl = document.querySelector(href);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: "smooth" });
          // Close mobile menu if open
          const mobileDrawer = document.getElementById("mobile-nav-drawer");
          if (mobileDrawer && mobileDrawer.classList.contains("is-open")) {
            mobileDrawer.classList.remove("is-open");
          }
        }
      }
    });
  });

  // 1. Interactive Dual-Mode Facebook Widget Tabs
  const fbTabs = qa(".fb-widget-tabs .fb-tab");
  const fbFeedContent = q(".fb-content-feed, .fb-content-stream");
  const fbOfficialContent = q(".fb-content-official, .fb-content-embed");
  if (fbTabs.length) {
    fbTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        fbTabs.forEach((t) => {
          t.classList.remove("active");
          t.setAttribute("aria-selected", "false");
        });
        tab.classList.add("active");
        tab.setAttribute("aria-selected", "true");
        const target = tab.getAttribute("data-tab");
        if (target === "feed" || target === "stream") {
          if (fbFeedContent) fbFeedContent.classList.add("active");
          if (fbOfficialContent) fbOfficialContent.classList.remove("active");
        } else {
          if (fbFeedContent) fbFeedContent.classList.remove("active");
          if (fbOfficialContent) fbOfficialContent.classList.add("active");
        }
      });
    });
  }

  // Live Facebook Refresh Handler
  const fbRefreshBtn = q("#fb-manual-refresh");
  if (fbRefreshBtn) {
    fbRefreshBtn.addEventListener("click", () => {
      fbRefreshBtn.classList.add("loading");
      if (window.FB && window.FB.XFBML) {
        try { window.FB.XFBML.parse(); } catch(e) {}
      }
      const iframe = q("#fb-live-frame-element");
      if (iframe) {
        const baseSrc = iframe.getAttribute("src").split("&_ts=")[0];
        iframe.setAttribute("src", baseSrc + "&_ts=" + Date.now());
      }
      setTimeout(() => fbRefreshBtn.classList.remove("loading"), 1200);
    });
  }


  // Mobile / Desktop Floating Chat Dock Toggle Handler
  const dockWidget = q("#chat-dock-widget");
  const dockToggleBtn = q("#chat-dock-toggle-btn");
  if (dockWidget && dockToggleBtn) {
    dockToggleBtn.addEventListener("click", () => {
      const willOpen = !dockWidget.classList.contains("is-open");
      dockWidget.classList.toggle("is-open", willOpen);
      dockToggleBtn.setAttribute("aria-expanded", willOpen ? "true" : "false");
    });
  }
})();
// Smooth presentation slide-in trigger for Master Hook
(function() {
  if (typeof window === 'undefined') return;
  function initHookMotion() {
    var hook = document.getElementById('emergency-hook');
    if (!hook) return;
    var title = hook.querySelector('.master-hook-title');
    if (!title) return;
    
    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            title.classList.remove('ppt-slide-in');
            void title.offsetWidth; // force reflow
            title.classList.add('ppt-slide-in');
          }
        });
      }, { threshold: 0.15 });
      obs.observe(hook);
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHookMotion);
  } else {
    initHookMotion();
  }
})();

// Mobile navigation drawer toggle
(function() {
  if (typeof window === 'undefined') return;
  function initMobileMenu() {
    var btn = document.getElementById('mobile-menu-toggle');
    var drawer = document.getElementById('mobile-nav-drawer');
    if (!btn || !drawer) return;
    
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      var isOpen = drawer.classList.contains('is-open');
      if (isOpen) {
        drawer.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
      } else {
        drawer.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });

    // Close when clicking any menu link
    var items = drawer.querySelectorAll('.mobile-nav-item, .drawer-call-btn');
    items.forEach(function(item) {
      item.addEventListener('click', function() {
        drawer.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close when clicking outside
    document.addEventListener('click', function(e) {
      if (drawer.classList.contains('is-open') && !drawer.contains(e.target) && !btn.contains(e.target)) {
        drawer.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileMenu);
  } else {
    initMobileMenu();
  }
})();
