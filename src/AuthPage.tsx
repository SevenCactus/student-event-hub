import { useState } from 'react'
import type { FormEvent } from 'react'
import { supabase, isSupabaseConfigured } from './lib/supabase'

type AuthMode = 'login' | 'register'

export default function AuthPage({ onExplore }: { onExplore: () => void }) {
  const [mode, setMode] = useState<AuthMode>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(false)
  const isRegister = mode === 'register'

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode)
    setNotice('')
    setShowPassword(false)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const fields = new FormData(form)
    const name = String(fields.get('name') ?? '').trim()
    const email = String(fields.get('email') ?? '').trim()
    const password = String(fields.get('password') ?? '')
    const confirmPassword = String(fields.get('confirmPassword') ?? '')

    if (isRegister && !name) {
      setNotice('Vui lòng nhập họ và tên của bạn.')
      form.querySelector<HTMLInputElement>('[name="name"]')?.focus()
      return
    }

    if (isRegister && password !== confirmPassword) {
      setNotice('Mật khẩu xác nhận chưa khớp. Bạn kiểm tra lại nhé.')
      form.querySelector<HTMLInputElement>('[name="confirmPassword"]')?.focus()
      return
    }

    if (!isSupabaseConfigured) {
      form.reset()
      setShowPassword(false)
      setNotice(isRegister
        ? 'Thông tin hợp lệ. Để lưu tài khoản vào cơ sở dữ liệu Supabase, hãy dán VITE_SUPABASE_ANON_KEY vào file .env. Bạn có thể nhấn "Trải nghiệm LEEP" để dùng thử ngay.'
        : 'Chưa phát hiện VITE_SUPABASE_ANON_KEY trong .env. Bạn có thể nhấn "Trải nghiệm LEEP" bên dưới để dùng thử.')
      return
    }

    setLoading(true)
    try {
      if (isRegister) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
          },
        })
        if (error) {
          setNotice(`Lỗi đăng ký: ${error.message}`)
        } else {
          setNotice('Đăng ký thành công! Hãy kiểm tra email (nếu có xác thực) hoặc đăng nhập để tiếp tục.')
          setMode('login')
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) {
          setNotice(`Đăng nhập thất bại: ${error.message}`)
        } else {
          onExplore()
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Không thể kết nối'
      setNotice(`Đã xảy ra lỗi: ${message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-story" aria-label="Giới thiệu LEEP">
        <a className="auth-brand" href="#" onClick={(event) => { event.preventDefault(); onExplore() }} aria-label="Khám phá LEEP">
          <span className="brand-mark" aria-hidden="true">✦</span>
          <span>LEEP<span className="auth-brand-dot">.</span></span>
        </a>

        <div className="auth-story-content">
          <p className="auth-kicker"><span /> KHÔNG GIAN PHÁT TRIỂN CỦA BẠN</p>
          <h1>Một bước nhỏ.<br /><span>Một hành trình lớn.</span></h1>
          <p className="auth-story-description">Kết nối với sự kiện, trau dồi kỹ năng và viết tiếp câu chuyện của riêng bạn cùng LEEP.</p>

          <div className="auth-preview" aria-hidden="true">
            <div className="auth-preview-heading"><span>GÓC CỦA BẠN</span><span>↗</span></div>
            <div className="auth-preview-event">
              <div className="auth-date"><b>24</b><span>THÁNG 10</span></div>
              <div><span className="auth-event-label">SỰ KIỆN SẮP TỚI</span><h2>Build Your Portfolio</h2><p>Mỗi dự án, một dấu ấn mới.</p></div>
            </div>
            <div className="auth-preview-progress"><span>Hành trình phát triển</span><b>72%</b></div>
            <div className="auth-progress-track"><span /></div>
            <div className="auth-preview-tags"><span>✦ Kỹ năng mới</span><span>◈ Dự án cá nhân</span><span>↗ Cơ hội mới</span></div>
          </div>
        </div>

        <div className="auth-story-footer"><span className="auth-footer-spark">✦</span><p>Học hỏi. Kết nối. Tiến xa hơn.</p><span>LEEP / SINH VIÊN</span></div>
      </section>

      <section className="auth-form-panel" aria-labelledby="auth-title">
        <button className="auth-explore-top" type="button" onClick={onExplore}>Khám phá LEEP <span aria-hidden="true">↗</span></button>
        <div className="auth-form-wrap">
          <div className="auth-form-icon" aria-hidden="true">{isRegister ? '✦' : '↗'}</div>
          <p className="auth-form-eyebrow">{isRegister ? 'BẮT ĐẦU CÙNG LEEP' : 'CHÀO MỪNG ĐẾN VỚI LEEP'}</p>
          <h2 id="auth-title">{isRegister ? 'Tạo tài khoản mới' : 'Sẵn sàng tiến xa hơn?'}</h2>
          <p className="auth-form-description">{isRegister ? 'Một nơi cho những ý tưởng, mục tiêu và bước tiến của bạn.' : 'Đăng nhập để tiếp tục hành trình học tập và kết nối của bạn.'}</p>

          <div className="auth-mode-switch" aria-label="Chọn đăng nhập hoặc đăng ký">
            <button type="button" aria-pressed={!isRegister} className={!isRegister ? 'selected' : ''} onClick={() => switchMode('login')}>Đăng nhập</button>
            <button type="button" aria-pressed={isRegister} className={isRegister ? 'selected' : ''} onClick={() => switchMode('register')}>Đăng ký</button>
          </div>

          <form key={mode} className="auth-form" onSubmit={handleSubmit} onChange={() => setNotice('')} aria-describedby="auth-preview-note">
            {isRegister && <div className="form-group">
              <label htmlFor="auth-name">Họ và tên</label>
              <input id="auth-name" name="name" className="form-control" autoComplete="name" placeholder="Nguyễn Minh Anh" required maxLength={100} />
            </div>}

            <div className="form-group">
              <label htmlFor="auth-email">Địa chỉ email</label>
              <input id="auth-email" name="email" className="form-control" type="email" autoComplete="email" placeholder="ban@example.com" required maxLength={254} />
            </div>

            <div className="form-group">
              <label htmlFor="auth-password">Mật khẩu</label>
              <div className="auth-password-field">
                <input id="auth-password" name="password" className="form-control" type={showPassword ? 'text' : 'password'} autoComplete={isRegister ? 'new-password' : 'current-password'} placeholder={isRegister ? 'Tạo mật khẩu từ 8 ký tự' : 'Nhập mật khẩu của bạn'} required minLength={isRegister ? 8 : 1} aria-describedby={isRegister ? 'password-help' : undefined} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'} aria-pressed={showPassword}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" />{showPassword && <path d="m3 3 18 18" />}</svg>
                </button>
              </div>
              {isRegister && <small id="password-help" className="auth-field-hint">Sử dụng ít nhất 8 ký tự cho mật khẩu của bạn.</small>}
            </div>

            {isRegister && <div className="form-group">
              <label htmlFor="auth-confirm">Xác nhận mật khẩu</label>
              <input id="auth-confirm" name="confirmPassword" className="form-control" type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Nhập lại mật khẩu" required minLength={8} />
            </div>}

            {notice && <p className="auth-notice" role="status">{notice}</p>}
            <button type="submit" className="primary-btn auth-submit" disabled={loading}>
              {loading ? 'Đang xử lý...' : (isRegister ? 'Tạo tài khoản' : 'Đăng nhập')}
              <span aria-hidden="true">→</span>
            </button>
          </form>

          <p className="auth-switch-prompt">{isRegister ? 'Bạn đã có tài khoản?' : 'Bạn chưa có tài khoản?'} <button type="button" onClick={() => switchMode(isRegister ? 'login' : 'register')}>{isRegister ? 'Đăng nhập' : 'Đăng ký ngay'}</button></p>
          <div className="auth-divider"><span>hoặc bắt đầu khám phá</span></div>
          <button className="secondary-btn auth-guest" type="button" onClick={onExplore}>Trải nghiệm LEEP <span aria-hidden="true">↗</span></button>
          <p className="auth-preview-note" id="auth-preview-note">Bản xem thử giao diện. Chưa kết nối tài khoản; thông tin đăng nhập không được lưu hoặc gửi đi.</p>
        </div>
        <p className="auth-copyright">LEEP · Không gian dành cho những bước tiến mới.</p>
      </section>
    </main>
  )
}
