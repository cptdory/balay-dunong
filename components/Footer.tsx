export default function Footer() {
    return (
        <footer
            style={{
                borderTop: '1px solid #c9a84c22',
                padding: '40px 32px',
                textAlign: 'center',
            }}
        >
            <div
                className="gold-text"
                style={{
                    fontFamily: "'Cinzel', serif",
                    fontWeight: 700,
                    fontSize: '1rem',
                    letterSpacing: '0.1em',
                    marginBottom: 8,
                }}
            >
                Casa Del Sapere
            </div>
            <div
                style={{
                    fontFamily: "'Lato', sans-serif",
                    fontWeight: 300,
                    fontSize: '0.7rem',
                    letterSpacing: '0.15em',
                    color: '#475569',
                    textTransform: 'uppercase',
                }}
            >
                © 2026 Casa Del Sapere Tutorial Center · All Rights Reserved
            </div>
        </footer>
    );
}
