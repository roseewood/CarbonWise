export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-inner">
                <p>© {new Date().getFullYear()} CarbonWise</p>
                <div className="footer-links">
                    <a href="/terms">Terms</a>
                    <a href="/privacy">Privacy</a>
                </div>
            </div>
        </footer>
    );
}
