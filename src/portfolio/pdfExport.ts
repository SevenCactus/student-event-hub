export function exportPortfolioPdf(studentName?: string): { ok: boolean; message?: string } {
  const previewEl = document.getElementById('portfolio-preview-area')
  if (!previewEl) {
    return {
      ok: false,
      message: 'Không tìm thấy khung xem trước hồ sơ. Hãy chuyển sang tab "Xem trước" trước khi xuất PDF.',
    }
  }

  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    return {
      ok: false,
      message: 'Trình duyệt đang chặn cửa sổ bật lên (Popup). Vui lòng cho phép popup rồi thử xuất PDF lại.',
    }
  }

  // Gather all stylesheets from the current page
  const styleSheets = Array.from(document.styleSheets)
  let cssText = ''
  styleSheets.forEach((sheet) => {
    try {
      const rules = Array.from(sheet.cssRules || [])
      rules.forEach((rule) => {
        cssText += rule.cssText + '\n'
      })
    } catch {
      if (sheet.href) {
        cssText += `@import url("${sheet.href}");\n`
      }
    }
  })

  const safeTitle = (studentName || '').trim()
    ? `Portfolio - ${studentName!.trim()}`
    : 'Ho-so-Portfolio-LEEP'

  const html = `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<title>${safeTitle.replace(/[<>]/g, '')}</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
<style>
${cssText}

@media print {
  @page {
    size: A4 portrait;
    margin: 12mm;
  }
}

html, body {
  margin: 0;
  padding: 0;
  background: #ffffff !important;
  font-family: 'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

.portfolio-preview-frame {
  border: none !important;
  box-shadow: none !important;
  border-radius: 0 !important;
  padding: 0 !important;
  margin: 0 !important;
  background: #ffffff !important;
  max-width: 100% !important;
  max-height: none !important;
  height: auto !important;
  overflow: visible !important;
}

.pf-mod-card, .pf-mod-project-card, .pf-mod-timeline-item,
.pf-min-item, .pf-cre-project-row, .pf-cre-edu-card,
.pf-cre-cert-card, .pf-cre-activity-item, .pf-min-section, .pf-cre-section {
  break-inside: avoid;
  page-break-inside: avoid;
}

.pf-tpl-project-img, .pf-tpl-cert-img {
  max-height: 200px;
  break-inside: avoid;
}
</style>
</head>
<body>
${previewEl.outerHTML}
<script>
  window.onload = function() {
    setTimeout(function() { window.print(); }, 400);
  };
<\/script>
</body>
</html>`

  printWindow.document.write(html)
  printWindow.document.close()
  return { ok: true }
}
