'use client'

interface HowToUseModalProps {
  onClose: () => void
}

export function HowToUseModal({ onClose }: HowToUseModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-large modal-how-to" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <h2>🇨🇦 How to Use This App</h2>
        <p className="modal-description">
          Welcome to the Canadian Immigration Timeline Tracker!
        </p>

        <div className="how-to-content">
          {/* Step 1 */}
          <div className="how-to-step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>🔍 Find Your Timeline</h3>
              <p>Use the <strong>Search bar</strong> to look for your username:</p>
              <ul>
                <li>Type your username in the search box</li>
                <li>If found → Your timeline is already here!</li>
                <li>If not found → You can share yours (Step 3)</li>
              </ul>
            </div>
          </div>

          {/* Step 2 */}
          <div className="how-to-step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>✅ Claim Your Timeline</h3>
              <p>If you found your username in the list:</p>
              <ul>
                <li>Click the <strong>&quot;Claim&quot;</strong> button on your row</li>
                <li>Enter your email address</li>
                <li>Your timeline moves to <strong>&quot;My Timeline&quot;</strong> section at top</li>
                <li>You can now edit and update your progress!</li>
              </ul>
            </div>
          </div>

          {/* Step 3 */}
          <div className="how-to-step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>📝 Share Your Timeline (If New)</h3>
              <p>Don&apos;t see your username? Share your timeline:</p>
              <ul>
                <li>Click <strong>&quot;+ Share Your Timeline&quot;</strong> button</li>
                <li>Fill in your details (ITA, AOR, Stream, etc.)</li>
                <li>Submit → Your timeline appears in &quot;My Timeline&quot;</li>
                <li>Keep it updated as you progress!</li>
              </ul>
            </div>
          </div>

          {/* Step 4 */}
          <div className="how-to-step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h3>📊 Compare & Analyze</h3>
              <p>Use filters to find similar timelines:</p>
              <ul>
                <li><strong>Stream:</strong> CEC, FSW, PNP, etc.</li>
                <li><strong>Type:</strong> Inland or Outland</li>
                <li><strong>Visa Office:</strong> Ottawa, Sydney, etc.</li>
                <li><strong>Status:</strong> See completed applications or today&apos;s updates</li>
                <li>Check <strong>Processing Time Averages</strong> to benchmark your timeline</li>
              </ul>
            </div>
          </div>

          {/* Step 5 */}
          <div className="how-to-step">
            <div className="step-number">5</div>
            <div className="step-content">
              <h3>💬 Ask Questions & Get Advice</h3>
              <p>Connect with other applicants:</p>
              <ul>
                <li><strong>Tap any username</strong> to open their full timeline profile</li>
                <li>View their complete processing breakdown and milestones</li>
                <li>Switch to <strong>&quot;Questions & Comments&quot;</strong> tab</li>
                <li>Ask questions, share advice, or discuss your experience</li>
                <li>Timeline owners can reply and help others!</li>
              </ul>
            </div>
          </div>

          {/* Pro Tips */}
          <div className="how-to-tips">
            <h3>💡 Pro Tips</h3>
            <ul>
              <li><strong>👤 Click usernames:</strong> Tap any username to see their full timeline, stats, and ask questions!</li>
              <li><strong>Sort columns:</strong> Click any column header (ITA Date, AOR→eCOPR, etc.) to sort</li>
              <li><strong>Look for 🔴:</strong> Red dot means updated in last 7 days</li>
              <li><strong>Green rows:</strong> User received eCOPR! 🎉</li>
              <li><strong>Golden rows:</strong> PR Card received - complete! 🎊</li>
              <li><strong>Analytics:</strong> Filter to see averages for YOUR situation</li>
            </ul>
          </div>

          {/* Status Badges */}
          <div className="how-to-badges">
            <h3>🏆 Status Badges Explained</h3>
            <div className="badge-examples">
              <div className="badge-example">
                <span className="completion-badge ecopr">✅ eCOPR</span>
                <span>= Received permanent resident status</span>
              </div>
              <div className="badge-example">
                <span className="completion-badge pr-card">🎉 PR Card</span>
                <span>= PR Card received - journey complete!</span>
              </div>
              <div className="badge-example">
                <span className="completion-badge hang-in-there">💪 Hang in there!</span>
                <span>= Both checks done, waiting for decision</span>
              </div>
            </div>
          </div>

          {/* Credits */}
          <div className="how-to-credits">
            <h3>🙏 Credits & Data Source</h3>
            <p>
              This tracker is built using data from the community-maintained Google Sheet:
            </p>
            <a
              href="https://docs.google.com/spreadsheets/d/1NWB2btjnVYWnd8kfHX8vUEbmsox6GZGlmXa-rCms7OI/edit?gid=0#gid=0"
              target="_blank"
              rel="noopener noreferrer"
              className="credits-link"
            >
              📊 View Original Google Sheet
            </a>
            <p className="credits-text">
              Special thanks to all Express Entry applicants who share their timelines
              to help others navigate the immigration process. 🇨🇦
            </p>
          </div>
        </div>

        <button onClick={onClose} className="btn-primary">
          Got it! Let&apos;s go
        </button>
      </div>
    </div>
  )
}
