const year = new Date().getFullYear().toString();

export default function Footer() {
  return (
    <footer className="footer footer-center mt-16 bg-base-300 p-4 text-base-content">
      <div>
        <p>Copyright © {year} Remix Austin - All rights reserved.</p>
      </div>
    </footer>
  );
}
