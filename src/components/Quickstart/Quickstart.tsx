
import { useEffect, useState } from 'react';
import './Quickstart.css';
import { useI18n } from '../../i18n';

type CopyState = 'idle' | 'copied' | 'error';

const CHANNEL_COMMANDS: Record<string, (base: string) => string> = {
  'DISCOVERY_RELEASE_CHANNEL=dev': (base) => `DISCOVERY_RELEASE_CHANNEL=dev ${base}`,
  '--branch dev': (base) => `${base} -- --branch dev`,
  'DISCOVERY_RELEASE_CHANNEL=beta': (base) => `DISCOVERY_RELEASE_CHANNEL=beta ${base}`,
  'DISCOVERY_RELEASE_CHANNEL=lts': (base) => `DISCOVERY_RELEASE_CHANNEL=lts ${base}`,
  'install_discovery_server.sh --mode update': () => './scripts/linux/install_discovery_server.sh --mode update',
};

function Quickstart() {
  const { text } = useI18n();
  const [copyState, setCopyState] = useState<CopyState>('idle');
  const [selectedChannel, setSelectedChannel] = useState<string | null>('DISCOVERY_RELEASE_CHANNEL=dev');

  const activeCommand =
    selectedChannel && CHANNEL_COMMANDS[selectedChannel]
      ? CHANNEL_COMMANDS[selectedChannel](text.quickstart.command)
      : text.quickstart.command;

  useEffect(() => {
    if (copyState === 'idle') {
      return undefined;
    }

    const resetTimeout = window.setTimeout(() => setCopyState('idle'), 2200);
    return () => window.clearTimeout(resetTimeout);
  }, [copyState]);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(activeCommand);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = activeCommand;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        textarea.style.pointerEvents = 'none';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();

        const copied = document.execCommand('copy');
        document.body.removeChild(textarea);

        if (!copied) {
          throw new Error('Unable to copy command');
        }
      }

      setCopyState('copied');
    } catch {
      setCopyState('error');
    }
  };

  const copyButtonLabel = copyState === 'copied'
    ? text.quickstart.copiedLabel
    : copyState === 'error'
      ? text.quickstart.copyErrorLabel
      : text.quickstart.copyLabel;

  return (
    <section id="quickstart" tabIndex={-1} className="quickstart">
      <div className="quickstart__inner">
        <div className="quickstart__header">
          <span className="quickstart__label">{text.quickstart.label}</span>
          <h2 className="quickstart__title">
            {text.quickstart.titlePrefix}{' '}
            <span className="quickstart__title-accent">{text.quickstart.titleAccent}</span>{' '}
            {text.quickstart.titleSuffix}
          </h2>
          <p className="quickstart__desc">
            {text.quickstart.description}
          </p>
        </div>

        {/* Linux Bootstrap */}
        <div className="quickstart__bootstrap">
          <div className="quickstart__bootstrap-glow" />
          <div className="quickstart__bootstrap-content">
            <div className="quickstart__bootstrap-icon" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </div>
            <div>
              <h3 className="quickstart__bootstrap-title">{text.quickstart.bootstrapTitle}</h3>
              <p className="quickstart__bootstrap-desc">
                {text.quickstart.bootstrapDescription}
              </p>
            </div>
          </div>

          <div className="quickstart__bootstrap-terminal">
            <div className="quickstart__bootstrap-header">
              <span className="quickstart__terminal-dot quickstart__terminal-dot--red" aria-hidden="true" />
              <span className="quickstart__terminal-dot quickstart__terminal-dot--yellow" aria-hidden="true" />
              <span className="quickstart__terminal-dot quickstart__terminal-dot--green" aria-hidden="true" />
              <span className="quickstart__terminal-label">{text.quickstart.terminalLabel}</span>
              <button
                type="button"
                className={`quickstart__copy-btn${copyState === 'copied' ? ' quickstart__copy-btn--copied' : ''}${copyState === 'error' ? ' quickstart__copy-btn--error' : ''}`}
                onClick={handleCopy}
                aria-label={text.quickstart.copyAriaLabel}
                title={copyButtonLabel}
              >
                {copyState === 'copied' ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                ) : copyState === 'error' ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                  </svg>
                )}
              </button>
            </div>
            <div className="quickstart__bootstrap-body">
              <div className="quickstart__terminal-line">
                <span className="quickstart__terminal-prompt" aria-hidden="true">$</span>
                <code className="quickstart__terminal-cmd">
                  {activeCommand}
                </code>
              </div>
            </div>
            <p className="sr-only" role="status" aria-live="polite">
              {copyState === 'idle' ? '' : copyButtonLabel}
            </p>
          </div>

          <div className="quickstart__bootstrap-examples">
            <span className="quickstart__bootstrap-label">
              {text.quickstart.channelsLabel} {text.quickstart.channelSelectedHint}
            </span>
            <div className="quickstart__bootstrap-chips">
              {text.quickstart.channels.map((channel) => {
                const isActive = selectedChannel === channel;
                return (
                  <button
                    key={channel}
                    type="button"
                    className={`quickstart__chip-btn${isActive ? ' quickstart__chip-btn--active' : ''}`}
                    aria-pressed={isActive}
                    onClick={() => setSelectedChannel(isActive ? null : channel)}
                  >
                    <code>{channel}</code>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Prerequisites */}
        <div className="quickstart__prereqs">
          <h3 className="quickstart__prereqs-title">{text.quickstart.prerequisitesTitle}</h3>
          <div className="quickstart__prereqs-grid">
            {text.quickstart.prerequisites.map((pr) => (
              <div key={pr.name} className="quickstart__prereq">
                <span className="quickstart__prereq-icon" aria-hidden="true">{pr.icon}</span>
                <span className="quickstart__prereq-name">{pr.name}</span>
                {'extra' in pr ? <span className="quickstart__prereq-extra">{pr.extra}</span> : null}
              </div>
            ))}
          </div>
          <div className="quickstart__docs-bar">
            <a href="#/docs/server-install" className="quickstart__docs-link">
              {text.quickstart.docsInstallLink} →
            </a>
            <a href="#/docs/requirements" className="quickstart__docs-link">
              {text.quickstart.docsRequirementsLink} →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Quickstart;
