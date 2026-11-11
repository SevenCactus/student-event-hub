import { useState, useEffect, useRef, useCallback } from 'react'
import type { PortfolioData, PortfolioErrors, PortfolioTemplateId } from './types'
import { loadSavedPortfolio, savePortfolioToStorage, defaultInitialPortfolio } from './storage'
import { validatePortfolio } from './validation'
import { exportPortfolioPdf } from './pdfExport'
import PortfolioEditor from './PortfolioEditor'
import PortfolioPreview from './PortfolioPreview'
import './portfolio.css'

type EventItemReadOnly = {
  id: string
  title: string
  date: string
  status: string
}

type Props = {
  events?: EventItemReadOnly[]
  onNotify?: (msg: string) => void
}

const createEmptyPortfolio = (): PortfolioData => ({
  id: `portfolio-${Date.now()}`,
  personalInfo: {
    avatarUrl: '',
    fullName: '',
    title: '',
    school: '',
    email: '',
    phone: '',
    location: '',
    headline: '',
  },
  aboutMe: '',
  education: [],
  skills: [],
  projects: [],
  activities: [],
  certificates: [],
  socialLinks: {
    linkedin: '',
    github: '',
    facebook: '',
    website: '',
  },
  templateId: 'modern',
  primaryColor: '#111e38',
  updatedAt: new Date().toISOString(),
})

export default function PortfolioManager({ events = [], onNotify }: Props) {
  const [portfolio, setPortfolio] = useState<PortfolioData>(() => loadSavedPortfolio())
  const [errors, setErrors] = useState<PortfolioErrors>({})
  const [isUnsaved, setIsUnsaved] = useState(false)
  const [saveStatusText, setSaveStatusText] = useState<'saved' | 'saving' | 'unsaved' | 'error'>('saved')
  const [isExporting, setIsExporting] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [mobileTab, setMobileTab] = useState<'edit' | 'preview'>('edit')

  const autoSaveTimerRef = useRef<number | null>(null)
  const latestPortfolioRef = useRef<PortfolioData>(portfolio)
  const isUnsavedRef = useRef<boolean>(isUnsaved)

  latestPortfolioRef.current = portfolio
  isUnsavedRef.current = isUnsaved

  // Warn before leaving browser tab if unsaved changes exist
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isUnsavedRef.current) {
        e.preventDefault()
        e.returnValue = 'Bạn có những thay đổi chưa lưu trong hồ sơ portfolio. Bạn có chắc chắn muốn rời đi?'
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current)
        if (isUnsavedRef.current) {
          savePortfolioToStorage(latestPortfolioRef.current)
        }
      }
    }
  }, [])

  // Auto-save logic with debounce
  const triggerAutoSave = useCallback((newData: PortfolioData) => {
    setIsUnsaved(true)
    setSaveStatusText('saving')

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current)
    }

    autoSaveTimerRef.current = window.setTimeout(() => {
      const ok = savePortfolioToStorage(newData)
      if (ok) {
        setIsUnsaved(false)
        setSaveStatusText('saved')
      } else {
        setSaveStatusText('error')
      }
    }, 1000)
  }, [])

  // Handle data updates from editor
  const handleDataChange = (updater: (prev: PortfolioData) => PortfolioData) => {
    setPortfolio((prev) => {
      const next = updater(prev)
      triggerAutoSave(next)
      const newErrors = validatePortfolio(next)
      setErrors(newErrors)
      return next
    })
  }

  // Template / color change from preview
  const handleTemplateChange = (id: PortfolioTemplateId) => {
    handleDataChange((prev) => ({ ...prev, templateId: id }))
  }

  const handleColorChange = (color: string) => {
    handleDataChange((prev) => ({ ...prev, primaryColor: color }))
  }

  // Manual save
  const handleManualSave = () => {
    const validationErrors = validatePortfolio(portfolio)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      if (onNotify) {
        onNotify('Vui lòng kiểm tra lại các trường báo lỗi màu đỏ trước khi lưu.')
      }
      return
    }

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current)
    }

    const success = savePortfolioToStorage(portfolio)
    if (success) {
      setIsUnsaved(false)
      setSaveStatusText('saved')
      if (onNotify) {
        onNotify('Đã lưu thành công toàn bộ hồ sơ Portfolio!')
      }
    } else {
      setSaveStatusText('error')
      if (onNotify) {
        onNotify('Lỗi: Bộ nhớ trình duyệt đã đầy hoặc bị khóa, không thể lưu hồ sơ.')
      }
    }
  }

  // Export PDF
  const handleExportPdf = () => {
    setIsExporting(true)
    const runExport = () => {
      const result = exportPortfolioPdf(portfolio.personalInfo.fullName)
      setIsExporting(false)
      if (!result.ok && result.message) {
        if (onNotify) {
          onNotify(result.message)
        } else {
          alert(result.message)
        }
      }
    }

    if (window.innerWidth < 1024 && mobileTab !== 'preview') {
      setMobileTab('preview')
      setTimeout(runExport, 350)
    } else {
      runExport()
    }
  }

  // Delete portfolio (resets to completely clean empty state and persists)
  const handleConfirmDelete = () => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current)
    }
    const empty = createEmptyPortfolio()
    savePortfolioToStorage(empty)
    setPortfolio(empty)
    setErrors({})
    setIsUnsaved(false)
    setSaveStatusText('saved')
    setShowDeleteModal(false)
    if (onNotify) {
      onNotify('Đã xóa toàn bộ thông tin hồ sơ Portfolio.')
    }
  }

  // Restore sample data helper when empty
  const handleLoadSample = () => {
    const sample = { ...defaultInitialPortfolio, updatedAt: new Date().toISOString() }
    savePortfolioToStorage(sample)
    setPortfolio(sample)
    setErrors({})
    setIsUnsaved(false)
    setSaveStatusText('saved')
    if (onNotify) {
      onNotify('Đã nạp lại hồ sơ mẫu Omni-Freshmen.')
    }
  }

  const isPortfolioCompletelyEmpty =
    !portfolio.personalInfo.fullName?.trim() &&
    !portfolio.aboutMe?.trim() &&
    portfolio.education.length === 0 &&
    portfolio.skills.length === 0 &&
    portfolio.projects.length === 0 &&
    portfolio.activities.length === 0 &&
    portfolio.certificates.length === 0

  return (
    <div className="portfolio-container">
      {/* Top action header */}
      <div className="portfolio-header-bar">
        <div>
          <h1>Hồ Sơ Năng Lực Sinh Viên (Portfolio)</h1>
          <p>Xây dựng hồ sơ học thuật, kỹ năng và dự án chuyên nghiệp dành cho sinh viên Omni-Freshmen</p>
        </div>

        <div className="portfolio-actions-group">
          <span className={`portfolio-save-indicator ${saveStatusText}`} role="status">
            {saveStatusText === 'saved' && '✓ Đã tự động lưu'}
            {saveStatusText === 'saving' && '⟳ Đang lưu nháp...'}
            {saveStatusText === 'unsaved' && '● Chưa lưu'}
            {saveStatusText === 'error' && '⚠ Lỗi lưu nháp'}
          </span>

          {isPortfolioCompletelyEmpty && (
            <button
              type="button"
              className="portfolio-icon-btn"
              style={{ padding: '8px 14px', fontWeight: 600, borderRadius: '10px' }}
              onClick={handleLoadSample}
            >
              ✨ Nạp dữ liệu mẫu
            </button>
          )}

          <button
            type="button"
            className="portfolio-icon-btn"
            style={{ background: '#111e38', color: '#fff', padding: '8px 16px', fontWeight: 600, borderRadius: '10px', border: 'none' }}
            onClick={handleManualSave}
          >
            💾 Lưu hồ sơ
          </button>

          <button
            type="button"
            className="portfolio-icon-btn"
            disabled={isExporting}
            style={{ padding: '8px 16px', fontWeight: 600, borderRadius: '10px' }}
            onClick={handleExportPdf}
          >
            {isExporting ? '⏳ Đang chuẩn bị...' : '📄 Xuất PDF'}
          </button>

          <button
            type="button"
            className="portfolio-icon-btn portfolio-delete-btn"
            style={{ padding: '8px 14px', borderRadius: '10px' }}
            title="Xóa toàn bộ dữ liệu hồ sơ"
            onClick={() => setShowDeleteModal(true)}
          >
            🗑️ Xóa hồ sơ
          </button>
        </div>
      </div>

      {/* Mobile Switcher: Edit / Preview tabs */}
      <div className="portfolio-view-tabs portfolio-mobile-only" role="tablist" aria-label="Chế độ xem trên di động">
        <button
          type="button"
          role="tab"
          aria-selected={mobileTab === 'edit'}
          className={`portfolio-view-tab-btn ${mobileTab === 'edit' ? 'active' : ''}`}
          onClick={() => setMobileTab('edit')}
        >
          ✏️ Chỉnh sửa
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mobileTab === 'preview'}
          className={`portfolio-view-tab-btn ${mobileTab === 'preview' ? 'active' : ''}`}
          onClick={() => setMobileTab('preview')}
        >
          👁️ Xem trước
        </button>
      </div>

      {/* Editor & Preview Side-by-Side Layout */}
      <div className="portfolio-editor-layout with-preview">
        {/* Editor Column */}
        <div className={`portfolio-editor-column ${mobileTab === 'edit' ? '' : 'portfolio-hide-mobile'}`}>
          <PortfolioEditor
            data={portfolio}
            errors={errors}
            onChange={handleDataChange}
            events={events}
          />
        </div>

        {/* Preview Column */}
        <div className={`portfolio-preview-column ${mobileTab === 'preview' ? '' : 'portfolio-hide-mobile'}`}>
          <PortfolioPreview
            data={portfolio}
            onChangeTemplate={handleTemplateChange}
            onChangeColor={handleColorChange}
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="portfolio-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="del-title">
          <div className="portfolio-confirm-box">
            <h3 id="del-title">⚠️ Xác nhận xóa hồ sơ Portfolio</h3>
            <p>
              Bạn có chắc chắn muốn xóa toàn bộ thông tin trong hồ sơ Portfolio hiện tại không?
              Hành động này sẽ xóa dữ liệu đã lưu trong trình duyệt và không thể hoàn tác.
            </p>
            <div className="portfolio-confirm-actions">
              <button
                type="button"
                className="portfolio-icon-btn"
                style={{ padding: '8px 16px' }}
                onClick={() => setShowDeleteModal(false)}
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                className="portfolio-icon-btn portfolio-delete-btn"
                style={{ padding: '8px 16px', fontWeight: 600 }}
                onClick={handleConfirmDelete}
              >
                Đồng ý xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
